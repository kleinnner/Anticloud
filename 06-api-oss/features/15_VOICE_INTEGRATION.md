---
title: "Voice Integration — API-OSS"
sidebar_position: 99
description: "*Whisper.cpp + API-Winston-TTS-SAI-0.5*"
tags: [features]
---

# Voice Integration — API-OSS

**Whisper.cpp + API-Winston-TTS-SAI-0.5**
**Fully sovereign. No cloud. No API fees.**

---

## Overview

Two new subprocesses, same pattern as `llama.cpp` and `stable-diffusion.cpp`:

| Component | Function | Binary | Model Size | Runtime |
|-----------|----------|--------|------------|---------|
| **Whisper.cpp** | Speech-to-Text (STT) | `whisper.exe` | ~150 MB (`ggml-base`) | CPU, real-time |
| **API-Winston-TTS-SAI-0.5** | Text-to-Speech (TTS) | `piper.exe` | ~10-50 MB per voice | CPU, real-time |

**Total added:** ~200 MB (whisper base + 2 voices). No Python. No GPU required. Fully sovereign.

---

## Architecture

```
User speaks ──> Browser (Web Audio API) ──> WAV bytes ──> WebSocket ──> API-SOS Gateway
                                                                              │
                                                                     ┌────────▼────────┐
                                                                     │  whisper.cpp    │
                                                                     │  (stdin: audio) │
                                                                     │  (stdout: text) │
                                                                     └────────┬────────┘
                                                                              │
                                                                        Transcription text
                                                                              │
                                                                         AI processes
                                                                              │
                                                                        Response text
                                                                              │
                                                                      ┌────────▼────────┐
                                                                      │  API-Winston-   │
                                                                      │  TTS-SAI-0.5    │
                                                                      │  (stdin: text)  │
                                                                      │  (stdout: WAV)  │
                                                                      └────────┬────────┘
                                                                              │
                                                                         WAV bytes
                                                                              │
API-SOS Gateway ──> WebSocket ──> WAV bytes ──> Browser plays audio
```

---

## File Changes

### New: `src/whisper.rs` (~120 lines)

Same pattern as `llama.rs`:

```rust
pub struct WhisperManager {
    process: Option<Child>,
    cancel: Arc<AtomicBool>,
}

impl WhisperManager {
    /// Spawn whisper.cpp as subprocess on stdin/stdout
    pub fn spawn(model_path: &Path, binary_path: &Path) -> Result<Self>;
    
    /// Send WAV bytes via stdin, receive transcription text from stdout
    pub fn transcribe(&mut self, audio_data: Vec<u8>) -> Result<String>;
    
    /// Kill the subprocess
    pub fn stop(&mut self);
}
```

Whisper.cpp accepts raw PCM or WAV on stdin, outputs text on stdout. Invocation:

```
whisper.exe -m data\models\ggml-base.bin --stdin --no-timestamps
```

### New: `src/piper.rs` (~100 lines)

```rust
pub struct PiperManager {
    process: Option<Child>,
    cancel: AtomicBool,
}

impl PiperManager {
    /// Spawn piper as subprocess
    pub fn spawn(model_path: &Path, binary_path: &Path) -> Result<Self>;
    
    /// Send text via stdin, receive WAV bytes from stdout
    pub fn speak(&mut self, text: &str) -> Result<Vec<u8>>;
    
    /// Stop
    pub fn stop(&mut self);
}
```

API-Winston-TTS-SAI-0.5 invocation (backed by Piper):
```
echo "Hello world" | piper.exe --model api-winston-tts-sai-0.5-en.onnx --output-raw | aplay
```

Or for file output:
```
echo "Hello world" | piper.exe --model api-winston-tts-sai-0.5-en.onnx --output-file output.wav
```

### Modified: `src/tools.rs` (+60 lines)

Add 2 new tools:

```rust
// Registration
ToolDefinition {
    name: "voice_transcribe",
    description: "Transcribe audio data to text using local speech-to-text.",
    parameters: serde_json::json!({
        "type": "object",
        "properties": {
            "audio_format": {"type": "string", "enum": ["wav", "pcm"], "default": "wav"},
            "sample_rate": {"type": "integer", "default": 16000}
        }
    }),
}

ToolDefinition {
    name: "voice_speak",
    description: "Convert text to speech audio using local text-to-speech.",
    parameters: serde_json::json!({
        "type": "object",
        "properties": {
            "text": {"type": "string", "description": "Text to speak"},
            "voice": {"type": "string", "enum": ["winston-en", "winston-ar"], "default": "winston-en"}
        },
        "required": ["text"]
    }),
}

// Execution
"voice_transcribe" => {
    // Frontend sends audio blob as base64 in WebSocket message
    // whisper decodes to PCM, transcribes, returns text
}

"voice_speak" => {
    // Text sent to API-Winston-TTS-SAI-0.5 via stdin
    // WAV bytes returned, served via /api/audio/uuid.wav
    // Frontend plays the audio
}
```

### Modified: `src/protocol.rs` (+6 messages)

**Client → Server:**
```rust
AudioChunk {
    data: String,      // base64-encoded audio bytes
    format: String,    // "wav" | "pcm"
    sample_rate: u32,
    is_final: bool,    // true = last chunk, start transcription
}
```

**Server → Client:**
```rust
TranscriptionResult {
    text: String,
    confidence: f64,
    is_final: bool,
}

AudioResponse {
    id: String,
    url: String,       // "/api/audio/uuid.wav"
    duration_ms: u64,
    format: String,
    voice: String,
}
```

### Modified: `src/ws_server.rs` (+80 lines)

Handle `AudioChunk` messages. Accumulate chunks. On `is_final: true`, send to whisper, return transcription.

Handle `voice_speak` tool call. Send text to API-Winston-TTS-SAI-0.5 (Piper backend), save WAV to `data/audio/`, serve via Axum static route.

Serve audio files at `/api/audio/{uuid}.wav`.

### Modified: `opencode.json`

```json
{
    "voice": {
        "whisper": {
            "binary_path": "./data/bin/whisper.exe",
            "model_path": "./data/models/ggml-base.bin"
        },
        "piper": {
            "binary_path": "./data/bin/piper.exe",
            "model_path": "./data/models/voice-en-us.onnx",
            "voices": {
                "winston-en": "./data/models/api-winston-tts-sai-0.5-en.onnx",
                "winston-ar": "./data/models/api-winston-tts-sai-0.5-ar.onnx"
            }
        },
        "enabled": false
    }
}
```

### Frontend Changes (`ai-oss-frontend/src/`)

**New: `lib/useVoiceRecorder.js`** (~80 lines)
```javascript
// Hook for browser Web Audio API recording
// Returns: { startRecording, stopRecording, isRecording, audioBlob }
// Uses MediaRecorder API with WAV encoding
```

**New: `components/VoiceButton.jsx`** (~40 lines)
```javascript
// Microphone button in the composer area
// Hold to record, release to send
// Visual feedback: pulsing red dot when recording
// Sends AudioChunk messages via WebSocket
```

**New: `components/AudioPlayer.jsx`** (~30 lines)
```javascript
// Inline audio player for voice responses
// Auto-play or click to play
// Shows waveform visualization (optional)
```

**Modified: `views/CommandView.jsx`** (+15 lines)
```javascript
// Add VoiceButton next to the text input
// Add AudioPlayer for AI voice responses
```

**Modified: `App.jsx`** (+5 lines)
```javascript
// Add /api/audio/* route if needed (handled by backend)
```

---

## Download & Setup

### Whisper.cpp

```
# Download binary
curl -L https://github.com/ggerganov/whisper.cpp/releases/latest/download/whisper-windows-x64.zip -o whisper.zip
tar -xf whisper.zip -C data\bin\
del whisper.zip

# Download model (base = ~150MB, good quality, CPU real-time)
curl -L https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin -o data\models\ggml-base.bin
```

### Piper TTS

```
# Download binary
curl -L https://github.com/rhasspy/piper/releases/latest/download/piper_windows_x86_64.zip -o piper.zip
tar -xf piper.zip -C data\bin\
del piper.zip

# Download voices (English + Arabic for UAE market)
curl -L https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/low/en_US-lessac-low.onnx -o data\models\api-winston-tts-sai-0.5-en.onnx
curl -L https://huggingface.co/rhasspy/piper-voices/resolve/main/ar/ar_AE/hassan/low/ar_AE-hassan-low.onnx -o data\models\api-winston-tts-sai-0.5-ar.onnx
```

### Total Download

| Component | Size |
|-----------|------|
| whisper.exe binary | ~15 MB |
| ggml-base.bin | ~150 MB |
| piper.exe + DLLs | ~10 MB |
| api-winston-tts-sai-0.5-en.onnx | ~20 MB |
| api-winston-tts-sai-0.5-ar.onnx | ~20 MB |
| **Total** | **~215 MB** |

---

## NSIS Installer — Optional Voice Component

```
API-SOS Setup
├── [x] Core Gateway (always)
├── [ ] Image Generation (optional)
├── [√] Voice Support — API-Winston-TTS-SAI-0.5 (optional, ~215 MB)
│     ├── whisper.exe
│     ├── ggml-base.bin
│     ├── piper.exe
│     ├── api-winston-tts-sai-0.5-en.onnx
│     └── api-winston-tts-sai-0.5-ar.onnx
```

Models downloaded via curl batch script (same pattern as image generation). Never uses PowerShell `Invoke-WebRequest`.

---

## Implementation Priority

| Phase | Feature | Rust Lines | Frontend Lines | Total Time |
|-------|---------|-----------|----------------|------------|
| 1 | `whisper.rs` subprocess + `voice_transcribe` tool | ~120 | 0 | 2-3 hours |
| 2 | `piper.rs` subprocess + `voice_speak` tool | ~100 | 0 | 2-3 hours |
| 3 | AudioChunk WebSocket + frontend recorder | ~40 | ~120 | 3-4 hours |
| 4 | AudioPlayer + inline playback | 0 | ~50 | 1-2 hours |
| 5 | Voice button in composer | 0 | ~40 | 1 hour |
| **Total** | | **~260** | **~210** | **~10-12 hours** |

---

## Key Design Decisions

1. **No streaming STT** — Accumulate full audio, transcribe once. Simpler, sufficient for voice commands.
2. **WAV files on disk** — Audio saved to `data/audio/`, served via static route. No DB storage for audio.
3. **CPU-only** — Whisper and Piper run on CPU. Does not compete with GPU for Qwen or SD.
4. **Optional feature** — Disabled by default. Enabled via `opencode.json` or NSIS component selection.
5. **Arabic voice included** — `api-winston-tts-sai-0.5-ar` for UAE market. English (`api-winston-tts-sai-0.5-en`) default.

---

*API-SOS — The Anti-Cloud*
*Lois Kleinner, 2026*

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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
