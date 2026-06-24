---
title: "Voice I/O (Whisper + Piper)"
sidebar_position: 99
description: "Provides offline speech-to-text via Whisper and text-to-speech via Piper. Voice mode enables hands-free interaction with the system. Audio input is captured from the microphone and processed locally; "
tags: [features]
---

# Voice I/O (Whisper + Piper)

## What It Does
Provides offline speech-to-text via Whisper and text-to-speech via Piper. Voice mode enables hands-free interaction with the system. Audio input is captured from the microphone and processed locally; speech output is generated and streamed as audio chunks. Fully local, no internet required, no per-minute billing.

## How It Works
The voice I/O system is implemented in i-oss-gateway/src/whisper.rs and piper.rs.

**Speech-to-text (Whisper)**: The system uses Whisper.cpp bindings to load a small Whisper model (tiny.en, ~75MB) locally. Audio is captured from the microphone via the browser's MediaRecorder API, streamed to the backend as udio_chunk WebSocket messages on port 3030. The Rust backend processes audio chunks through Whisper, which runs on the 3050 Ti GPU with CUDA backend for fast inference. The transcription result is returned as a 	ranscription_result message.

**Text-to-speech (Piper)**: Piper is a fast neural TTS system that runs on CPU. The system loads a Piper voice model (~10MB) on startup. When oice_speak is called, the text is sent to Piper, which generates audio data (16-bit PCM at 22050Hz). The audio is streamed back as udio_response WebSocket messages in chunks for real-time playback.

**Voice mode**: The user can toggle voice mode on/off via the frontend. When active, the system listens continuously, transcribes speech, sends the text as a prompt to the LLM, and reads the response aloud via Piper.

The frontend (React 18 + Vite 5 + Tailwind) provides: voice mode toggle button, microphone button with recording indicator, audio waveform visualization, and volume meter. Audio playback uses the Web Audio API.

The system runs on the single pi-oss binary. HTTP UI on port 8081. Everything works fully offline with no internet required.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. The 3050 Ti GPU auto-detects.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Click the microphone icon to start voice input. Speak clearly.
4. The transcription appears in real time as the system processes audio.
5. Release the microphone button to submit the transcribed text as a prompt.
6. The AI response is read aloud via Piper TTS.
7. Toggle "Voice Mode" for continuous hands-free interaction.
8. Adjust voice settings: TTS speed, voice model, microphone sensitivity.
9. Use CLI: pi-oss voice transcribe --file input.wav, pi-oss voice speak --text "Hello world".

Config in opencode.json:
`json
{
  "voice": {
    "whisper_model": "tiny.en",
    "piper_voice": "amy",
    "auto_tts": true,
    "microphone_sample_rate": 16000
  }
}
`

## The Moat
- OpenAI offers Whisper as a cloud API with per-minute billing (.006/minute).
- No competitor offers local STT/TTS integrated into an AI decision engine.
- Our voice I/O is fully offline, has zero per-minute costs, and works without internet connectivity.
- Whisper on the 3050 Ti GPU provides fast local transcription (near real-time for tiny model).
- Piper runs on CPU, requiring no GPU resources for TTS.
- Complete privacy � no audio data ever leaves the device.

## Why Choose API-OSS
Free, private voice interaction with AI. Organizations that need hands-free AI interaction � medical professionals during procedures, field operators in gloves, accessibility users � get local voice I/O with zero ongoing costs and complete privacy. No competitor offers this in a local-first package.

## Competitive Comparison
- **OpenAI**: Whisper API � cloud-only, per-minute billing (.006/min), requires internet. No TTS integration.
- **Anthropic**: No voice I/O. Claude has no speech-to-text or text-to-speech capability.
- **Google**: Cloud STT/TTS � per-minute billing (.006-.024/min), cloud-only, requires internet.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Voice I/O (Whisper + Piper)

## What It Does
Provides offline speech-to-text via Whisper and text-to-speech via Piper. Voice mode enables hands-free interaction with the system. Audio input is captured from the microphone and processed locally; speech output is generated and streamed as audio chunks. Fully local, no internet required, no per-minute billing.

## How It Works
The voice I/O system is implemented in i-oss-gateway/src/whisper.rs and piper.rs.

**Speech-to-text (Whisper)**: The system uses Whisper.cpp bindings to load a small Whisper model (tiny.en, ~75MB) locally. Audio is captured from the microphone via the browser's MediaRecorder API, streamed to the backend as udio_chunk WebSocket messages on port 3030. The Rust backend processes audio chunks through Whisper, which runs on the 3050 Ti GPU with CUDA backend for fast inference. The transcription result is returned as a 	ranscription_result message.

**Text-to-speech (Piper)**: Piper is a fast neural TTS system that runs on CPU. The system loads a Piper voice model (~10MB) on startup. When oice_speak is called, the text is sent to Piper, which generates audio data (16-bit PCM at 22050Hz). The audio is streamed back as udio_response WebSocket messages in chunks for real-time playback.

**Voice mode**: The user can toggle voice mode on/off via the frontend. When active, the system listens continuously, transcribes speech, sends the text as a prompt to the LLM, and reads the response aloud via Piper.

The frontend (React 18 + Vite 5 + Tailwind) provides: voice mode toggle button, microphone button with recording indicator, audio waveform visualization, and volume meter. Audio playback uses the Web Audio API.

The system runs on the single pi-oss binary. HTTP UI on port 8081. Everything works fully offline with no internet required.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. The 3050 Ti GPU auto-detects.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Click the microphone icon to start voice input. Speak clearly.
4. The transcription appears in real time as the system processes audio.
5. Release the microphone button to submit the transcribed text as a prompt.
6. The AI response is read aloud via Piper TTS.
7. Toggle "Voice Mode" for continuous hands-free interaction.
8. Adjust voice settings: TTS speed, voice model, microphone sensitivity.
9. Use CLI: pi-oss voice transcribe --file input.wav, pi-oss voice speak --text "Hello world".

Config in opencode.json:
`json
{
  "voice": {
    "whisper_model": "tiny.en",
    "piper_voice": "amy",
    "auto_tts": true,
    "microphone_sample_rate": 16000
  }
}
`

## The Moat
- OpenAI offers Whisper as a cloud API with per-minute billing (.006/minute).
- No competitor offers local STT/TTS integrated into an AI decision engine.
- Our voice I/O is fully offline, has zero per-minute costs, and works without internet connectivity.
- Whisper on the 3050 Ti GPU provides fast local transcription (near real-time for tiny model).
- Piper runs on CPU, requiring no GPU resources for TTS.
- Complete privacy � no audio data ever leaves the device.

## Why Choose API-OSS
Free, private voice interaction with AI. Organizations that need hands-free AI interaction � medical professionals during procedures, field operators in gloves, accessibility users � get local voice I/O with zero ongoing costs and complete privacy. No competitor offers this in a local-first package.

## Competitive Comparison
- **OpenAI**: Whisper API � cloud-only, per-minute billing (.006/min), requires internet. No TTS integration.
- **Anthropic**: No voice I/O. Claude has no speech-to-text or text-to-speech capability.
- **Google**: Cloud STT/TTS � per-minute billing (.006-.024/min), cloud-only, requires internet.
### Protocol Message Reference

The feature communicates over WebSocket on port 3030 with the following message types. All messages are JSON with `type` and `payload` fields. The frontend sends request messages; the backend responds with response or event messages.

**Request messages** (frontend ? backend):
- Detailed in the How to Operate section above � each actionable step corresponds to a WebSocket message
- All messages include a `req_id` field for request-response correlation
- Errors are returned as `{ "type": "error", "req_id": "...", "message": "..." }`
- Messages are processed asynchronously � results may arrive in a different order than requests

**Response/event messages** (backend ? frontend):
- Each request generates at least one response message with status and data
- Streaming responses send multiple messages (e.g., one per token) followed by a completion message
- Event messages (e.g., model status changes, contradiction scan results) are pushed without a corresponding request
- The WebSocket connection is persistent � the frontend reconnects automatically on disconnect

**Error handling**: All WebSocket messages include error handling. If a request fails, an error message is returned with a description. The frontend displays errors as toast notifications. Failed requests do not affect other ongoing operations.

**Rate limiting**: There is no rate limiting on WebSocket messages � the system processes messages as fast as the hardware can handle. The 3050 Ti GPU and local inference ensure no external API rate limits apply.

### CLI Command Reference

The CLI provides 87 commands across 9 subcommand groups. All commands follow the pattern `api-oss <group> <action> [options]`. Use `api-oss help` to list all groups, `api-oss help <group>` for group-specific help.

The most important commands for this feature are:
- `api-oss status` � check gateway status and feature availability
- `api-oss config get <key>` � read configuration values
- `api-oss config set <key> <value>` � update configuration
- `api-oss log tail` � view real-time system logs
- `api-oss health` � run a comprehensive health check

### Integration Points

This feature integrates with the following other system components:

- **Knowledge Graph**: All data created or modified by this feature is stored as nodes and edges in `data/graph.db`. This enables cross-feature queries and relationships.
- **Audit Ledger**: All significant actions are recorded as entries in `data/ledger/` in `.aioss` format. The SHA-256 hash chain provides tamper-proof audit.
- **Search**: Content created by this feature is indexed by the FTS5 full-text search engine, making it discoverable via the Search view.
- **Multi-Agent Council**: If enabled, decisions made by this feature that have significant impact are reviewed by the Risk, Legal, and Strategist agents.
- **Contradiction Detection**: Statements made by this feature are checked for logical consistency with existing graph content.
- **Codex Multi-Tenancy**: All data is scoped by `codex_id`, ensuring isolation between workspaces.

### Security Considerations

- All feature operations are logged to the audit ledger with cryptographic chaining
- Path traversal protection applies to any file system access
- CLAW approval required for destructive operations (configurable)
- No data is transmitted over the network for feature operation
- The SHA-256 integrity check on startup validates all system components
- PID file lock prevents concurrent instance corruption of the database
- Feature works fully offline � no cloud dependency, no data breach surface

### Known Limitations

- Performance is bounded by local hardware � the 3050 Ti GPU provides ~20-40 tokens/second
- SQLite WAL supports concurrent reads but single writer � the PID lock enforces this
- Maximum database size is limited by available disk space (tested to 10GB+)
- WebSocket connection requires the gateway to be running (port 3030)
- HTTP UI requires the gateway to be running (port 8081)

### Upgrade & Migration

- All feature data is stored in the `./data/` directory
- To upgrade: replace the binary and restart � data is forward-compatible
- To migrate: copy the `./data/` directory to the new machine
- The audit ledger can be verified independently with `api-oss ledger verify`
- Configuration in `opencode.json` is versioned � the system warns on unknown keys

### Dependencies

This feature has no external runtime dependencies. All functionality is self-contained in the single `api-oss` binary:
- No cloud API keys required
- No third-party services
- No database servers
- No runtime environments (Python, Node.js)
- Docker is optional � everything runs as a single binary
- Everything works fully offline with no internet required

### FAQ

**Q: Does this require an internet connection?**
A: No. All features work fully offline with no internet required after initial model download.

**Q: What hardware do I need?**
A: A machine with a CUDA-capable GPU. The NVIDIA 3050 Ti (4GB VRAM) is the reference target and auto-detects with backend "cuda".

**Q: How do I start the gateway?**
A: Run `api-oss start` or execute the binary directly. The HTTP UI is on port 8081 and WebSocket on port 3030.

**Q: Can I run this in Docker?**
A: Docker is optional. The system runs as a single binary with no container required.

**Q: Where is my data stored?**
A: All data is in `./data/` by default � graph at `data/graph.db` (SQLite WAL), ledger at `data/ledger/` (`.aioss` format).

**Q: How do I configure the system?**
A: Edit `opencode.json` at the root or gateway level. Config drives all behavior.

**Q: Can I use a different model?**
A: Yes. Download any GGUF model and configure it in `opencode.json`. Runtime model switching is supported.

**Q: Is there a CLI?**
A: Yes � 87 commands in 9 subcommand groups. Run `api-oss help` to get started.

