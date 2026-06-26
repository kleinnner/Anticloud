▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document version: 1.0.0 | Updated: 2026-06-19
Category: help-bugs | ID: LIB-HLP-003

────────────────────────────────────────────────────────────────

# AI Not Responding

## 1. Overview

Libern includes a local AI engine (CandleEngine) that provides natural language processing features such as message summarization, smart reply suggestions, and content moderation. Because the AI runs entirely on the user's device, it depends on local hardware capabilities and a downloaded model file.

This guide covers common AI-related issues:
1. AI model not downloaded or missing
2. CandleEngine fallback to MockEngine
3. Slow AI responses
4. AI not available on certain hardware
5. Memory and performance issues with AI

### AI Engine Architecture

```
┌─────────────────────────────────────────────────────────┐
│              AI Engine Decision Flow                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  User sends /ask or @Liber                              │
│         │                                                │
│         ▼                                                │
│  Check AI engine status                                 │
│         │                                                │
│    ┌────┴────┐                                           │
│    │ Loaded  │  Not Loaded                               │
│    ▼         ▼                                           │
│  Run      Check model file exists?                      │
│  Inference  │                                            │
│         ┌──┴──┐                                          │
│      Yes│     │No                                        │
│         ▼     ▼                                          │
│    Candle   Check llama-cli exists?                     │
│    Engine   │                                            │
│         ┌──┴──┐                                          │
│      Yes│     │No                                        │
│         ▼     ▼                                          │
│    Candle   MockEngine                                   │
│    Engine                                                │
│                                                          │
│  Result streamed to UI via IPC Channel                   │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Engine Types

Libern uses a tiered AI engine architecture:

| Engine | Description | When Used |
|--------|-------------|-----------|
| CandleEngine | Full local inference using Candle ML framework | Default, when model is available |
| MockEngine | Simulated responses (template-based) | Fallback when model is unavailable |
| Disabled | No AI functionality | When user turns off AI features |

### Initialization Flow

1. Libern starts
2. Checks for downloaded AI model in the data directory
3. If model found: Load CandleEngine with the model
4. If model not found: Attempt to download from configured source
5. If download fails or is canceled: Fall back to MockEngine
6. If MockEngine unavailable: Disable AI features

---

## 3. Model Not Downloaded

### Symptoms
- AI features are grayed out or show "Not Available"
- Status indicator shows "AI: MockEngine"
- Error message: "AI model not found. Please download the model."
- AI-related operations return generic template responses

### Causes and Solutions

**Model file missing:**
The AI model file is not bundled with the Libern binary due to its size (typically 500 MB to 2 GB). It must be downloaded separately.

**Solution:** Download the model through the Libern interface:
1. Open Settings > AI
2. Click "Download AI Model"
3. Wait for the download to complete (progress indicator shown)
4. Restart Libern if prompted

**Manual download:**
If the in-app download fails:
1. Download the model from the official model repository
2. Verify the SHA-256 checksum
3. Place the file in the correct directory:
   - Windows: `%APPDATA%\Libern\models\`
   - macOS: `~/Library/Application Support/Libern/models/`
   - Linux: `~/.local/share/libern/models/`

**Download interrupted:**
If the download is interrupted, the partial file may be corrupted.
1. Delete the partial file from the models directory
2. Restart the download from Settings > AI

---

## 4. CandleEngine Fallback to MockEngine

### Symptoms
- AI features work but return low-quality or generic responses
- Status indicator: "AI: MockEngine"
- AI responses are template-based rather than contextually generated

### Causes

**Insufficient hardware:**
CandleEngine requires specific hardware capabilities:
- **Minimum:** 4 GB RAM, CPU with AVX2 support
- **Recommended:** 8 GB RAM, dedicated GPU with 4 GB VRAM
- **macOS:** M1 or later (Apple Silicon)
- **Linux:** CPU with AVX2 or Vulkan-compatible GPU

**Model incompatibility:**
The downloaded model may not be compatible with the current CandleEngine version.
- Solution: Re-download the model after updating Libern

### Diagnostic Steps

To determine why CandleEngine is not loading:

1. **Check hardware capabilities:**
   - Windows: Task Manager > Performance
   - macOS: System Information > Graphics/Displays
   - Linux: `lspci | grep VGA` or `glxinfo | grep "OpenGL renderer"`

2. **Check Libern logs:**
   Look for lines containing `CandleEngine:`, `Error:`, or `Fallback:`.

3. **Run AI diagnostic:**
   ```
   libern --ai-diagnostics
   ```
   This will test hardware compatibility and report any issues.

---

## 5. Slow AI Responses

### Expected Performance

AI response times vary by hardware:

| Hardware | Simple Query | Complex Query |
|----------|-------------|---------------|
| High-end GPU (RTX 4090) | < 1 second | 1-3 seconds |
| Mid-range GPU (RTX 3060) | 1-3 seconds | 3-8 seconds |
| Apple Silicon M3 | 1-2 seconds | 3-6 seconds |
| Apple Silicon M1 | 3-5 seconds | 8-15 seconds |
| CPU only (modern) | 5-15 seconds | 15-30 seconds |
| CPU only (older) | 15-30 seconds | 30-60 seconds |

### Optimization Tips

1. **Use GPU acceleration:** Ensure GPU drivers are up to date
2. **Reduce max_tokens:** Lower values produce faster responses
3. **Close other applications:** Free up system resources
4. **Use a smaller model:** If a smaller GGUF model is available
5. **Monitor temperatures:** Avoid thermal throttling on laptops

---

## 6. Common Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Engine not initialized" | AI engine failed to load | Check logs, verify model |
| "CUDA error: out of memory" | GPU VRAM exhausted | Reduce gpu_layers, use CPU |
| "Model file not found" | Model not downloaded | Download AI model |
| "Incompatible model version" | Model mismatch with engine | Update model |
| "AVX not supported" | CPU too old | Use MockEngine |
| "MockEngine fallback active" | Model unavailable | Check download status |
| "Failed to load GGUF model" | Corrupted model file | Re-download model |
| "llama.cpp process crashed" | Runtime error | Reinstall llama.cpp |

---

## 7. Memory and Performance Issues

### High Memory Usage

AI models can use significant memory:
- Small model: 500 MB - 1 GB
- Medium model: 1 GB - 2 GB
- Large model: 2 GB - 4 GB

**Solutions:**
- Use a smaller model if available
- Reduce GPU layers to decrease VRAM usage
- Close other memory-intensive applications

### Out of Memory Errors

**Symptoms:** Libern crashes with an out-of-memory error, or AI features fail with "Not enough memory."

**Solutions:**
1. Increase system swap space
2. Use a smaller AI model
3. Reduce batch size in AI settings
4. Close other applications
5. Add more RAM to the system

---

## 8. AI Troubleshooting Quick Reference

| Problem | Quick Check | Solution |
|---------|------------|----------|
| AI not responding | `getAiStatus()` | Download model |
| Generic responses | Check engine type | Install real model |
| Slow responses | Check CPU/GPU usage | Close other apps |
| Crashes during AI | Check memory usage | Increase swap |
| Model download fails | Check internet | Download manually |
| "Engine not initialized" | Check logs | Reinstall model |
| MockEngine active | Check model path | Place model correctly |
| GPU not used | Check driver version | Update GPU drivers |

---

## 9. AI Engine Configuration

### CandleEngine Settings

```json
{
  "ai": {
    "engine": "candle",
    "model_path": "models/Qwen2-VL-2B-Instruct-Q4_K_M.gguf",
    "binary_dir": "bin",
    "gpu_layers": 0,
    "batch_size": 4,
    "thread_count": 4,
    "max_tokens": 512,
    "temperature": 0.7,
    "top_p": 0.9,
    "repeat_penalty": 1.1
  }
}
```

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `LIBERN_AI_ENGINE` | Force engine type | `candle`, `mock`, `disabled` |
| `LIBERN_MODEL_PATH` | Override model file path | `/custom/path/model.gguf` |
| `LIBERN_LLAMA_BIN` | Override llama.cpp binary | `/custom/path/llama-cli` |
| `LIBERN_GPU_LAYERS` | GPU acceleration layers | `32` |
| `LIBERN_AI_THREADS` | CPU threads for inference | `8` |

---

## 10. AI Model Comparison

| Model | File Size | RAM Usage | Quality | Speed |
|-------|-----------|-----------|---------|-------|
| Qwen 2.5 0.5B Q4 | ~400 MB | ~1 GB | Basic | Fast |
| Qwen 2.5 1.5B Q4 (default) | ~1.1 GB | ~3 GB | Good | Moderate |
| Qwen 2.5 7B Q4 | ~4 GB | ~8 GB | Excellent | Slow |
| Llama 3.2 1B Q4 | ~700 MB | ~2 GB | Good | Fast |
| Llama 3.2 3B Q4 | ~2 GB | ~4 GB | Very Good | Moderate |
| Phi-3 Mini Q4 | ~2 GB | ~4 GB | Very Good | Moderate |

### Choosing the Right Model

| Hardware | Recommended Model |
|----------|------------------|
| 4 GB RAM, no GPU | Qwen 0.5B or MockEngine |
| 8 GB RAM, CPU only | Qwen 1.5B (default) |
| 16 GB RAM, integrated GPU | Qwen 1.5B or Llama 3.2 1B |
| 32 GB RAM, dedicated GPU | Qwen 7B or Llama 3.2 3B |
| 64 GB RAM, high-end GPU | Any model |

---

## 11. AI Diagnostic Script

### Comprehensive AI Diagnostic

```bash
#!/bin/bash
# ai-diagnostic.sh - Run this to diagnose AI issues

echo "=== AI Diagnostic ==="

# 1. Check hardware
echo "--- CPU ---"
grep -c avx /proc/cpuinfo && echo "AVX supported"
grep -c avx2 /proc/cpuinfo && echo "AVX2 supported"

echo "--- Memory ---"
free -h | grep Mem

echo "--- GPU ---"
lspci | grep -i "vga\|3d" 2>/dev/null || echo "No GPU detected"

# 2. Check model
MODEL_DIR="$HOME/.local/share/com.libern.app/models"
echo "--- Model ---"
ls -la "$MODEL_DIR/" 2>/dev/null || echo "Model directory not found"

# 3. Check binary
BIN_DIR="$HOME/.local/share/com.libern.app/bin"
echo "--- Binary ---"
ls -la "$BIN_DIR/" 2>/dev/null || echo "Binary directory not found"

# 4. Run Libern diagnostic
libern --ai-diagnostics

echo "=== Diagnostic Complete ==="
```

---

## 12. AI Error Message Reference

### Engine Initialization Errors

| Error | Meaning | Action |
|-------|---------|--------|
| `Failed to load GGUF model from path...` | Model file not found or corrupted | Check path, re-download |
| `llama.cpp output: error loading model` | Model incompatible with llama.cpp | Use compatible GGUF model |
| `CUDA error: out of memory` | GPU VRAM full | Reduce gpu_layers, use CPU |
| `Failed to spawn llama.cpp process` | Binary not found or not executable | Check binary path and permissions |
| `AVX not supported on this CPU` | Old CPU without vector extensions | Use MockEngine |
| `Engine initialization timed out` | Model took too long to load | Check system resources |

### Inference Errors

| Error | Meaning | Action |
|-------|---------|--------|
| `Inference request timed out` | Generation too slow | Reduce max_tokens |
| `Callback channel closed` | Frontend disconnected | Restart Libern |
| `Empty response from engine` | Model returned nothing | Retry with different prompt |
| `Token limit exceeded` | Generated too many tokens | Reduce max_tokens |
| `Engine returned error: ...` | Underlying engine error | Check logs, report bug |

---

## 13. Performance Tuning Guide

### For Faster AI Responses

1. **Reduce max_tokens** — Shorter responses are faster
   - Default: 512
   - Fast: 128
   - Balanced: 256

2. **Reduce context messages** — Fewer messages in context means less processing
   - Default: 20
   - Fast: 5
   - Balanced: 10

3. **Enable GPU acceleration** — If you have a compatible GPU
   - Set `gpu_layers` to 32+ for best performance
   - Requires NVIDIA GPU with CUDA (future)

4. **Increase thread count** — Use more CPU cores
   - Default: 4
   - Adjust based on your CPU core count

5. **Use smaller model** — Switch to Qwen 0.5B for faster but less capable AI

### Configuration for Lowest Latency

```json
{
  "ai": {
    "engine": "candle",
    "max_tokens": 128,
    "temperature": 0.7,
    "context_messages": 5,
    "gpu_layers": 0,
    "thread_count": 8,
    "batch_size": 1
  }
}
```

---

## 14. AI Log Analysis

### Understanding AI Logs

When Libern starts, look for these log messages:

```
[INFO] Liber: Using MockEngine
  → AI model not found. Solution: Download model.

[INFO] Liber: Loaded Qwen 2.5 1.5B Instruct (via llama.cpp)
  → AI engine ready. No action needed.

[ERROR] Liber: Failed to load Qwen (...), using MockEngine
  → Model file exists but failed to load.
  → Check: model file corruption, incompatible version

[ERROR] Liber: llama.cpp binary not found
  → Missing llama-cli. Solution: Download llama.cpp binary.

[WARN] Liber: Model file exists but is too small (expected > 1GB)
  → Corrupted download. Solution: Re-download model.
```

### Common AI Error Patterns

| Log Pattern | Meaning | Action |
|-------------|---------|--------|
| `Using MockEngine` | Model not available | Download model |
| `Failed to load GGUF` | Model file corrupted | Re-download |
| `llama.cpp process exited with code ...` | Runtime error | Reinstall llama.cpp |
| `CUDA error` | GPU issue | Check GPU drivers |
| `Out of memory` | Insufficient RAM | Close other apps |
| `Inference timed out` | Too slow | Reduce max_tokens |

---

## 15. AI State Management

### AiState Structure

```rust
// From apps/desktop/src-tauri/src/lib.rs
pub struct AiState {
    pub engine: Mutex<Box<dyn AiEngine + Send>>,
}

impl AiState {
    pub fn new(app_data_dir: &Path) -> Self {
        let engine = create_engine(app_data_dir);
        AiState {
            engine: Mutex::new(engine),
        }
    }

    pub fn reset(&self) {
        let mut engine = self.engine.lock().unwrap();
        *engine = create_engine(&app_data_dir);
    }
}
```

### Engine Creation Logic

```rust
fn create_engine(app_data_dir: &Path) -> Box<dyn AiEngine + Send> {
    let model_path = app_data_dir.join("models/Qwen2-VL-2B-Instruct-Q4_K_M.gguf");
    let binary_dir = app_data_dir.join("bin");

    // Check if model and binary exist
    if model_path.exists() && binary_dir.join("llama-cli").exists() {
        // Check file size
        if let Ok(metadata) = std::fs::metadata(&model_path) {
            if metadata.len() > 1_000_000_000 {
                // File is large enough, try to load
                match CandleEngine::new(model_path, binary_dir) {
                    Ok(engine) => {
                        println!("Liber: Loaded Qwen 2.5 1.5B Instruct");
                        return Box::new(engine);
                    }
                    Err(e) => {
                        println!("Liber: Failed to load Qwen ({}), using MockEngine", e);
                    }
                }
            } else {
                println!("Liber: Model file too small ({} bytes), using MockEngine", metadata.len());
            }
        }
    }

    println!("Liber: Using MockEngine");
    Box::new(MockEngine::new())
}
```

---

## 16. AI Model Compatibility Matrix

### GGUF Models Tested with Libern

| Model | Works? | Notes |
|-------|--------|-------|
| Qwen 2.5 0.5B Instruct Q4_K_M | ✅ Yes | Fast, lower quality |
| Qwen 2.5 1.5B Instruct Q4_K_M | ✅ Yes | Default, recommended |
| Qwen 2.5 7B Instruct Q4_K_M | ⚠️ Slow | Needs 8GB+ RAM |
| Llama 3.2 1B Instruct Q4_K_M | ✅ Yes | Good alternative |
| Llama 3.2 3B Instruct Q4_K_M | ⚠️ Slow | Good quality |
| Phi-3 Mini 4K Instruct Q4_K_M | ✅ Yes | Good quality |
| Mistral 7B Q4_K_M | ⚠️ Very slow | Needs 8GB+ RAM |
| CodeLlama 7B Q4_K_M | ⚠️ Very slow | Only for code |

### Unsupported Models

| Model | Reason |
|-------|--------|
| GPT-2 (any format) | Not GGUF compatible |
| BERT-based models | Not causal language models |
| OpenAI GPT-3.5/4 | Cloud-only models |
| Claude models | Cloud-only models |
| Gemma 2B (original) | Tokenizer incompatibility |

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com