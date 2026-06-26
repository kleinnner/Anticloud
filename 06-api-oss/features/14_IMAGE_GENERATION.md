---
title: "API-SOS Image Generation"
sidebar_position: 99
description: "*Local sovereign image generation via stable-diffusion.cpp*"
tags: [features]
---

# API-SOS Image Generation

**Local sovereign image generation via stable-diffusion.cpp**
**No Python. No PyTorch. No cloud. Single binary.**

---

## Overview

API-SOS adds image generation through a separate subprocess (same pattern as llama-server). `stable-diffusion.cpp` is a single C++ binary that runs SD 1.5 GGUF models with Hyper-SD or LCM-LoRA for 1-4 step generation. No Python, no PyTorch, no dependencies.

Total disk cost: ~1.25 GB (binary + model + LoRAs).

### Architecture

```
API-SOS Gateway ──spawn──> stable-diffusion.cpp (subprocess, port 3031)
     │                        │
     │                   HTTP POST /generate
     │                        │
     │                   Image saved to data/images/
     │                        │
     └───> WebSocket: ImageGenerated { id, url, prompt, style }
          Frontend renders inline, stores as graph node
```

### VRAM Management (RTX 3050 Ti, 4 GB)

Two modes:

| Mode | llama-server | sd.cpp | Image Time | Swap Overhead |
|------|-------------|--------|------------|---------------|
| **GPU swap** (default) | Killed during gen | Spawns | ~1-2s | ~3s (kill + spawn) |
| **CPU SD** | Keeps running | CPU only | ~10-15s | 0s (simultaneous) |

**GPU swap** is recommended. The overhead is ~3s and the generation is ~2s = ~5s total for an image while keeping GPU memory available for Qwen most of the time.

---

## Binary Setup

### Download stable-diffusion.cpp

```
# Windows (curl, not PowerShell)
curl -L https://github.com/leejet/stable-diffusion.cpp/releases/latest/download/sd-windows-x64.zip -o sd.zip
tar -xf sd.zip -C data\bin\
del sd.zip

# Verify
data\bin\sd.exe --version
```

### Download SD 1.5 GGUF Model

```
# SD 1.5 Q4_K_M (512x512 base)
curl -L https://huggingface.co/leejet/stable-diffusion-1.5-gguf/resolve/main/sd-1.5-q4_k_m.gguf -o data\models\sd-1.5-q4_k_m.gguf

# Hyper-SD LoRA (1-4 step distilled)
curl -L https://huggingface.co/leejet/hyper-sd-lora-gguf/resolve/main/hyper-sd-1.5-lora.gguf -o data\models\hyper-sd-lora.gguf

# LCM-LoRA (fallback, optional)
curl -L https://huggingface.co/leejet/lcm-lora-gguf/resolve/main/lcm-lora-sd-1.5.gguf -o data\models\lcm-lora.gguf
```

All downloads use `curl` — PowerShell `Invoke-WebRequest` is used nowhere.

### Configuration (opencode.json)

```json
{
    "image_generation": {
        "enabled": true,
        "binary_path": "./data/bin/sd.exe",
        "model_path": "./data/models/sd-1.5-q4_k_m.gguf",
        "lora_path": "./data/models/hyper-sd-lora.gguf",
        "port": 3031,
        "mode": "gpu_swap",
        "default_width": 512,
        "default_height": 512,
        "steps": 4,
        "cfg_scale": 4.5,
        "output_dir": "./data/images"
    }
}
```

---

## Rust Implementation

### New File: `src/sd.rs` — Subprocess Manager

Same pattern as `llama.rs`. ~180 lines.

```rust
pub struct SDManager {
    process: Option<Child>,
    config: SDConfig,
    cancel: Arc<AtomicBool>,
}

impl SDManager {
    pub fn spawn(config: &SDConfig) -> Result<Self>;
    pub fn generate(&mut self, req: GenerateRequest) -> Result<GenerateResponse>;
    pub fn stop(&mut self);
    pub fn is_running(&self) -> bool;
}

pub struct SDConfig {
    pub binary_path: PathBuf,
    pub model_path: PathBuf,
    pub lora_path: Option<PathBuf>,
    pub port: u16,
    pub mode: SDMode,  // GpuSwap or Cpu
    pub default_width: u32,
    pub default_height: u32,
    pub steps: u32,
    pub cfg_scale: f32,
    pub output_dir: PathBuf,
}

pub struct GenerateRequest {
    pub prompt: String,
    pub negative_prompt: Option<String>,
    pub style: Option<String>,
    pub width: Option<u32>,
    pub height: Option<u32>,
    pub steps: Option<u32>,
    pub seed: Option<u64>,
    pub image_id: Option<String>,  // for img2img/edits
}

pub struct GenerateResponse {
    pub id: String,
    pub filename: String,
    pub url: String,         // /api/images/{id}.png
    pub prompt: String,
    pub style: String,
    pub width: u32,
    pub height: u32,
    pub seed: u64,
}
```

### sd.cpp HTTP Client

The gateway communicates with `stable-diffusion.cpp` via HTTP POST.

```
POST http://127.0.0.1:3031/generate
Content-Type: application/json

{
    "prompt": "photorealistic cat in a cyberpunk city",
    "negative_prompt": "blurry, low quality",
    "width": 512,
    "height": 512,
    "steps": 4,
    "cfg_scale": 4.5,
    "seed": -1
}

Response:
{
    "id": "a1b2c3d4",
    "output": "data/images/a1b2c3d4.png",
    "seed": 123456789
}
```

---

## New WebSocket Messages (`protocol.rs`)

### Client -> Server
```
// Already handled via tool execution, but add direct:
{ "type": "generate_image", "prompt": "...", "style": "cinematic" }
{ "type": "edit_image", "image_id": "...", "prompt": "add a dragon" }
{ "type": "variate_image", "image_id": "...", "variation_strength": 0.3 }
```

### Server -> Client
```json
{
    "type": "image_generated",
    "id": "a1b2c3d4",
    "url": "/api/images/a1b2c3d4.png",
    "prompt": "photorealistic cat in a cyberpunk city",
    "style": "cyberpunk",
    "width": 512,
    "height": 512,
    "seed": 123456789
}

{
    "type": "image_edited",
    "id": "e5f6g7h8",
    "url": "/api/images/e5f6g7h8.png",
    "original_id": "a1b2c3d4",
    "prompt": "add a dragon",
    "seed": 987654321
}

{
    "type": "image_generation_error",
    "original_prompt": "...",
    "error": "Out of memory"
}
```

---

## New Tools (`tools.rs`)

### 1. `generate_image` — Text to Image

| Parameter | Type | Required | Default |
|-----------|------|----------|---------|
| `prompt` | string | ✅ | — |
| `negative_prompt` | string | ❌ | "blurry, low quality" |
| `style` | string | ❌ | "realistic" |
| `width` | integer | ❌ | 512 |
| `height` | integer | ❌ | 512 |
| `steps` | integer | ❌ | 4 |
| `seed` | integer | ❌ | -1 (random) |

Returns:
```json
{
    "id": "a1b2c3d4",
    "url": "/api/images/a1b2c3d4.png",
    "prompt": "...",
    "style": "cinematic",
    "width": 512,
    "height": 512,
    "seed": 123456789
}
```

### 2. `edit_image` — Image to Image (Edit Existing)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image_id` | string | ✅ | ID of existing generated image |
| `prompt` | string | ✅ | Description of changes |
| `strength` | float | ❌ | How much to change (0.0-1.0, default 0.6) |

Returns same shape as `generate_image` plus `original_id` field.

### 3. `variate_image` — Create Variations

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image_id` | string | ✅ | Source image ID |
| `variation_strength` | float | ❌ | 0.0-1.0 (default 0.4, lower = closer to original) |
| `count` | integer | ❌ | How many variations (1-4, default 2) |

Returns array of generated images.

### 4. `describe_image` — Generate Prompt from Image

Uses Qwen (vision) or local captioning model to describe an existing generated image.

| Parameter | Type | Required |
|-----------|------|----------|
| `image_id` | string | ✅ |

Returns caption / suggested prompt.

### 5. `get_styles` — List Available Styles

Returns array of { name, description, preview_url } for the UI style picker.

| Parameter | Type | Required |
|-----------|------|----------|
| (none) | | |

Returns:
```json
{
    "styles": [
        { "name": "realistic", "description": "Photorealistic, detailed, 4K", "preview": "...", "lora": null },
        { "name": "cinematic", "description": "Film grain, dramatic lighting", "preview": "...", "lora": "hyper-sd-lora.gguf" },
        ...
    ]
}
```

---

## Style System

Each style is a LoRA file (~10-50 MB) + a prompt prefix. Styles do not require different base models.

| Style | Prompt Prefix | LoRA | Size |
|-------|-------------|------|------|
| realistic | "photorealistic, highly detailed, 4k" | None (base model) | 0 MB |
| cinematic | "cinematic lighting, film grain, anamorphic" | None | 0 MB |
| anime | "anime style, cel shaded, vibrant colors" | anime-lora.gguf | ~30 MB |
| cyberpunk | "cyberpunk aesthetic, neon lights, dark" | cyberpunk-lora.gguf | ~30 MB |
| oil_painting | "oil painting style, thick brush strokes" | painting-lora.gguf | ~30 MB |
| watercolor | "watercolor painting, soft edges" | watercolor-lora.gguf | ~30 MB |
| sketch | "pencil sketch, line art, grayscale" | sketch-lora.gguf | ~25 MB |
| pixel_art | "pixel art, 8-bit style, retro game" | pixel-lora.gguf | ~20 MB |

**Total with all 8 styles:** ~1.4 GB (1.2 GB base + ~200 MB LoRAs)

Minimal config (2 styles + base): ~1.25 GB

---

## Frontend: Image Display & Interaction

### Message Bubble Changes

When the AI sends an `image_generated` message, the frontend renders:

```
┌─────────────────────────────┐
│  [AI Avatar]  AI-OSS        │
│                             │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │   GENERATED IMAGE   │    │
│  │   (click to expand) │    │
│  │                     │    │
│  └─────────────────────┘    │
│                             │
│  Prompt: "photorealistic    │
│  cat in a cyberpunk city"   │
│                             │
│  Style: cyberpunk ·         │
│  512x512 · seed: 123456789  │
│                             │
│  [🎨 Edit] [🔀 Vary] [⬇ Download]  │
└─────────────────────────────┘
```

### Composer Enhancements

Add an "image" toggle button next to the chat input:

```
[🎨 Generate Image] [📝 Chat]

When "Generate Image" is selected:
┌─────────────────────────────┐
│ Style: [realistic ▼]        │
│ Prompt: "..."               │
│ Width: [512] Height: [512]  │
│                             │
│ [Generate]                  │
└─────────────────────────────┘
```

### Image View Modal

Click on any generated image to open a full-screen modal with:
- Full resolution image
- Prompt + style metadata
- Edit / Vary / Download buttons
- Edit history timeline (if image was edited)
- "Copy prompt" button

### Graph Node Visualization

Generated images appear as visual nodes in the CognitiveWindow (brain map view). They show a small thumbnail preview and connect to the prompt/decision that generated them.

---

## NSIS Installer — Optional Image Generation Component

### Installer Structure

```
API-SOS Setup
├── [x] Core Gateway (50 MB, always installed)
│     ├── ai-oss-gateway.exe
│     ├── llama-server.exe + CUDA DLLs
│     ├── whisper.exe
│     ├── piper.exe + voices
│     ├── React frontend
│     └── Default config
│
├── [ ] Image Generation (optional, ~1.25 GB)
│     ├── sd.exe (stable-diffusion.cpp binary)
│     ├── sd-1.5-q4_k_m.gguf
│     ├── hyper-sd-lora.gguf
│     └── core style LoRAs (4 styles, ~100 MB)
│
├── [ ] Extended Style Pack (optional, ~100 MB)
│     └── Additional LoRAs (anime, cyberpunk, oil_painting, watercolor, sketch, pixel_art)
│
└── [ ] Voice Support (optional, ~200 MB, planned for Phase 2)
```

### Component Selection UI

```
┌──────────────────────────────────────┐
│ API-SOS Setup - Choose Components    │
│                                      │
│ ☑ Core Gateway (50 MB)               │
│    Required. Includes AI engine,      │
│    frontend, and all base tools.      │
│                                      │
│ ☐ Image Generation (1.25 GB)         │
│    Generate images via SD 1.5 GGUF.   │
│    ⚠ Requires curl for model download │
│                                      │
│ ☐ Extended Style Pack (100 MB)       │
│    6 additional art styles for        │
│    image generation.                  │
│    (requires Image Generation above)  │
│                                      │
│ ☐ Voice Support (200 MB)             │
│    Speech-to-text and text-to-speech. │
│    (coming in Phase 2)               │
│                                      │
│ [< Back] [Install] [Cancel]          │
└──────────────────────────────────────┘
```

### Download Approach (curl, NOT PowerShell)

When Image Generation is selected, the installer does NOT bundle the models (too large for NSIS). Instead, it:

1. **Installs `sd.exe`** binary (~15 MB, bundled in installer)
2. **Creates `download_models.bat`** on the desktop with curl commands
3. **Optionally runs the batch file** if the user clicks "Download Now"

The batch script:

```batch
@echo off
echo API-SOS Image Model Downloader
echo ==============================
echo.
echo Downloading SD 1.5 GGUF (1.2 GB)...
curl -L https://huggingface.co/leejet/stable-diffusion-1.5-gguf/resolve/main/sd-1.5-q4_k_m.gguf -o "%~dp0..\data\models\sd-1.5-q4_k_m.gguf"
if %errorlevel% neq 0 (
    echo FAILED. Try manual download: https://huggingface.co/leejet/stable-diffusion-1.5-gguf
    pause
    exit /b 1
)
echo.
echo Downloading Hyper-SD LoRA (15 MB)...
curl -L https://huggingface.co/leejet/hyper-sd-lora-gguf/resolve/main/hyper-sd-1.5-lora.gguf -o "%~dp0..\data\models\hyper-sd-lora.gguf"
echo.
echo Downloading Core Style LoRAs (100 MB)...
curl -L https://huggingface.co/api-sos/styles/resolve/main/cinematic-lora.gguf -o "%~dp0..\data\models\cinematic-lora.gguf"
curl -L https://huggingface.co/api-sos/styles/resolve/main/anime-lora.gguf -o "%~dp0..\data\models\anime-lora.gguf"
curl -L https://huggingface.co/api-sos/styles/resolve/main/cyberpunk-lora.gguf -o "%~dp0..\data\models\cyberpunk-lora.gguf"
curl -L https://huggingface.co/api-sos/styles/resolve/main/oil_painting-lora.gguf -o "%~dp0..\data\models\oil_painting-lora.gguf"
echo.
echo ✓ Image models downloaded successfully!
pause
```

The installer never uses PowerShell `Invoke-WebRequest`. All user-facing downloads use `curl`.

---

## Config Changes (opencode.json)

```json
{
    "gateway": {
        "host": "127.0.0.1",
        "ws_port": 3030,
        "ui_port": 8080,
        "image_port": 3031
    },
    "image_generation": {
        "enabled": false,
        "binary_path": "./data/bin/sd.exe",
        "model_path": "./data/models/sd-1.5-q4_k_m.gguf",
        "lora_path": "./data/models/hyper-sd-lora.gguf",
        "additional_loras": ["./data/models/cinematic-lora.gguf"],
        "port": 3031,
        "mode": "gpu_swap",
        "default_width": 512,
        "default_height": 512,
        "steps": 4,
        "cfg_scale": 4.5,
        "output_dir": "./data/images"
    }
}
```

The image generation section is absent by default (feature disabled). When the user checks "Image Generation" in the installer, the config is generated with `"enabled": true` and correct paths.

---

## Edit History

Every generated image stores its full provenance in both the knowledge graph and the .aioss ledger:

```
Image node (graph):
{
    id: "a1b2c3d4",
    type: "Image",
    label: "cat in a cyberpunk city",
    content: { prompt, style, width, height, seed, steps },
    metadata: {
        parent_id: null,     // if edited, ID of original
        edit_chain: [],      // ordered list of ancestor IDs
        generated_at: "2026-05-08T10:00:00Z",
        model_hash: "sha256:..."
    }
}

.aioss ledger entry:
{
    index: 42,
    type: "ai_message",
    content: {
        image_id: "a1b2c3d4",
        prompt: "...",
        style: "cyberpunk",
        tool_call: "generate_image"
    },
    hash: "sha256:...",
    parent_hash: "sha256:..."
}
```

The frontend can render an edit chain timeline:

```
Original ──> Edit 1 (add dragon) ──> Edit 2 (make it night)
[a1b2c3d4]     [e5f6g7h8]             [i9j0k1l2]
```

---

## Implementation Priority

| Phase | Feature | Lines of Rust | Lines of Frontend | Disk Added |
|-------|---------|--------------|-------------------|------------|
| 1 | `sd.rs` subprocess + `generate_image` tool | ~180 | ~50 | ~1.25 GB |
| 2 | Style system + style selector in UI | ~30 | ~100 | ~200 MB (LoRAs) |
| 3 | `edit_image` + `variate_image` tools | ~40 | ~50 | 0 |
| 4 | Edit history timeline in frontend | ~20 | ~80 | 0 |
| 5 | `describe_image` tool | ~30 | 0 | 0 |
| 6 | Image nodes in CognitiveWindow | 0 | ~60 | 0 |

---

*Lois-Kleinner, 2026*

## See Also

Related features, architecture, and roadmap documentation.

- [Features Overview](../features/README.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [API Reference](../api-reference/01-overview.md)
- [Roadmap](../roadmap/01-product-vision.md)

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ