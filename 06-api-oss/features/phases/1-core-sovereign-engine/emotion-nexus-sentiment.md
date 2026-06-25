---
title: "Emotion Nexus / Sentiment"
sidebar_position: 99
description: "Real-time sentiment analysis on conversation text using a local lightweight model. Tracks emotional valence (positive/negative), arousal (intensity), and dominance (control) across the conversation ti"
tags: [features]
---

# Emotion Nexus / Sentiment

## What It Does
Real-time sentiment analysis on conversation text using a local lightweight model. Tracks emotional valence (positive/negative), arousal (intensity), and dominance (control) across the conversation timeline. Displays an emotion landscape visualization showing emotional shifts and patterns across sessions. Links detected emotions to graph nodes, enabling queries like "which topics caused frustration?" or "what decisions were made during positive emotional states?"

## How It Works
The sentiment analysis engine lives in `ai-oss-gateway/src/sentiment.rs`. It uses a lightweight lexicon-based + ML hybrid approach that runs entirely locally with no external API dependency.

**Pass 1 — Lexicon-based**: A curated dictionary of 5000+ English words with valence, arousal, and dominance scores (based on the ANEW dataset extended with domain-specific terms) is applied to each message. Scores are averaged across the message with negation handling ("not happy" inverts the valence of "happy"). Sub-millisecond analysis per message.

**Pass 2 — ML hybrid**: A small ONNX model (distilled from a BERT sentiment classifier, ~50MB) runs on the 3050 Ti GPU with CUDA backend for more nuanced analysis. The ML model identifies subtle emotions (sarcasm, passive aggression, enthusiasm) that lexicon-based approaches miss. Results from both passes are weighted and combined.

The emotion landscape is a timeline visualization in the React 18 + Vite 5 + Tailwind frontend. Each message gets a sentiment badge (positive/green, neutral/gray, negative/red). The `EmotionNexusView` shows a line chart of valence over time. An "Emotion Landscape" heatmap shows emotional patterns aggregated across sessions.

Detected emotions are stored as properties on message nodes in `data/graph.db` (SQLite WAL) and as edges linking messages to Emotion-type nodes. This enables graph queries like "find all messages with high arousal" or "which entities are discussed when the user is frustrated?"

WebSocket on port 3030 streams `emotion_analysis_result` per message. The system runs on the single `api-oss` binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups. Everything works fully offline.

## How to Operate
1. Launch the gateway: `api-oss start` or run the binary directly. The 3050 Ti GPU auto-detects.
2. Open `http://localhost:8081` (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Emotion Nexus view. The emotion timeline loads automatically.
4. Click any message in the Chat view to see its individual sentiment badge (valence, arousal, dominance).
5. Use the Emotion Landscape tab for a heatmap of emotional patterns across time and topics.
6. Click on a high-arousal region to jump to the relevant conversation.
7. Use CLI: `api-oss emotion stats` for aggregate report, `api-oss emotion export` for CSV.

Config in `opencode.json`:
```json
{
  "emotion": {
    "enabled": true,
    "ml_model": true,
    "lexicon_weight": 0.4,
    "ml_weight": 0.6
  }
}
```

## The Moat
- No competitor offers real-time sentiment analysis integrated with a knowledge graph.
- Lexicon + ML hybrid provides both speed (lexicon) and accuracy (ML).
- Emotion nodes in the graph enable queries linking emotional state to topics.
- All processing is local and private — no emotional data sent to any cloud.

## Why Choose API-OSS
Emotion Nexus turns sentiment into a first-class graph entity. Track user sentiment, identify frustration points, measure emotional impact of decisions. Valuable for support (measure satisfaction), healthcare (track patient mood), and market research (analyze trends).

## Competitive Comparison
- **Anthropic**: No emotion tracking — constitution constrains outputs only.
- **OpenAI**: No built-in sentiment analysis.
- **Google**: No integrated emotion tracking.

## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Cloud sentiment APIs (AWS Comprehend, Google Natural Language) charge $0.0001-$0.002 per unit. At 1M messages/month, that's $100-$2,000/month. API-OSS provides unlimited sentiment analysis for free. Risk reduction: emotional data never leaves the device.

## Applications
- **Consumer**: Understand your own emotional patterns during AI interactions.
- **Government / Defense**: Detect emotional manipulation or distress in monitored communications.
- **Enterprise**: Measure user satisfaction and frustration points in automated support systems.

## Protocol Message Reference
Request: `{"type":"analyze_emotion","message_id":"uuid"}`. Response: `{"type":"emotion_analysis_result","valence":0.7,"arousal":0.3,"dominance":0.6,"badge":"positive"}`. Aggregate: `{"type":"emotion_landscape"}` → `{"type":"emotion_landscape_result","timeline":[],"heatmap":[]}`.

## CLI Command Reference
`api-oss emotion stats`, `api-oss emotion export --format csv`, `api-oss emotion search --valence lt 0.3`.

## Security Considerations
All sentiment analysis runs locally. No text or emotional data is transmitted. Sentiment data respects codex isolation. SHA-256 integrity check validates model files on startup.

## Protocol Message Reference
All WebSocket communication uses JSON messages with `type` and `payload` fields over port 3030. Request messages from the frontend include a `req_id` for correlation. The backend responds with response or event messages. Streaming responses send multiple messages (one per token) followed by a completion signal. Errors are returned as `{ "type": "error", "req_id": "...", "message": "..." }`. The WebSocket connection is persistent � the frontend reconnects automatically on disconnect. All messages are processed asynchronously; results may arrive in a different order than requests.

## CLI Command Reference
The CLI provides 87 commands across 9 subcommand groups: `codex`, `config`, `graph`, `help`, `image`, `ingest`, `ledger`, `message`, `model`, `search`, `session`, `tool`, `voice`, `web`, `wiki`. All commands follow the pattern `api-oss <group> <action> [options]`. Use `api-oss help` to list all groups, `api-oss help <group>` for group-specific help. Every command supports `--help` for inline documentation. Commands run against the running gateway � the gateway must be started with `api-oss start` before most commands work.

## Integration Points
This feature integrates with the Knowledge Graph (all data stored as nodes/edges in `data/graph.db` SQLite WAL), the Audit Ledger (all significant actions recorded in `data/ledger/` in `.aioss` format with SHA-256 chaining), FTS5 Search (content indexed for discoverability via full-text search), the Multi-Agent Council (if enabled, decisions with significant impact are reviewed by Risk, Legal, and Strategist agents), Contradiction Detection (statements checked for logical consistency with existing graph content), and Codex Multi-Tenancy (all data scoped by `codex_id` for workspace isolation).

## Security Considerations
All operations are logged to the SHA-256 hash-chained audit ledger at `data/ledger/`. Path traversal protection applies to any filesystem access. CLAW approval gates destructive operations (configurable). No data is transmitted over the network for feature operation � everything runs locally on the single `api-oss` binary. The SHA-256 integrity check on startup validates all system components including binary integrity and database consistency. The PID file lock at `./data/api-oss.pid` prevents concurrent instance corruption of the database. The 3050 Ti GPU auto-detects with backend "cuda" � no manual GPU configuration needed. The system runs fully offline with no internet required after initial model download. Config is driven by `opencode.json` at root and gateway levels.

## FAQ
**Q: Does this require internet?** A: No. All features work fully offline with no internet required after initial model download. **Q: What hardware do I need?** A: A CUDA-capable GPU � the NVIDIA 3050 Ti (4GB VRAM) is the reference target and auto-detects with backend "cuda". **Q: How do I start?** A: Run `api-oss start` or execute the binary directly � no Docker required (optional). **Q: Where is data stored?** A: In `./data/` by default � graph at `data/graph.db` (SQLite WAL), ledger at `data/ledger/` (`.aioss` format). **Q: How do I configure?** A: Edit `opencode.json` at the root or gateway level. Config drives all behavior. **Q: What frontend does it use?** A: React 18 + Vite 5 + Tailwind, bundled in the binary or served via `npm run dev` on port 8081. **Q: Is there a CLI?** A: Yes � 87 commands in 9 subcommand groups. Run `api-oss help` to get started.

## Known Limitations
- Performance is bounded by local hardware � the 3050 Ti GPU provides ~20-40 tokens/second with the Qwen2-VL-2B-Instruct-Q4_K_M.gguf model
- SQLite WAL supports concurrent readers but single writer � the PID lock enforces single-writer compliance
- Maximum database size is limited by available disk space (tested to 10GB+ with no degradation)
- WebSocket connection requires the gateway to be running on port 3030
- HTTP UI requires the gateway to be running on port 8081
- Maximum concurrent users is bounded by GPU memory � single-user or small-team (2-5 concurrent WebSocket connections)

## Upgrade & Migration
- All feature data is stored under `./data/` � graph at `data/graph.db`, ledger at `data/ledger/`, user files under `data/`
- To upgrade: download the new binary and restart � data is forward-compatible across versions
- To migrate: copy the entire `./data/` directory to the new machine
- The audit ledger can be independently verified without the original system using `api-oss ledger verify`
- Configuration in `opencode.json` is versioned � the system warns on unknown or deprecated keys

## Architecture & Data Flow

### Component Architecture
The feature operates in a three-layer architecture. The **backend layer** is implemented in Rust under `ai-oss-gateway/src/` and runs as the single `api-oss` binary. It exposes a WebSocket endpoint on port 3030 for real-time bidirectional communication with frontends, and an HTTP server on port 8081 serving the bundled React 18 + Vite 5 + Tailwind UI. The **inference layer** runs locally via llama.cpp's CUDA backend on the auto-detected 3050 Ti GPU, loading the Qwen2-VL-2B-Instruct-Q4_K_M.gguf model pinned by SHA-256 hash. The **data layer** stores the knowledge graph in SQLite WAL at `data/graph.db` and the audit ledger at `data/ledger/` in `.aioss` format.

### Request Lifecycle
A typical request flows: (1) User interacts with the React 18 frontend served on port 8081. (2) Frontend sends a WebSocket message to port 3030. (3) The Rust handler in `ai-oss-gateway/src/handlers/` processes the message � for inference, it forwards to the local LLM on CUDA. (4) Results stream back token-by-token via WebSocket. (5) All actions are logged to the SHA-256 hash-chained audit ledger. (6) Data is persisted in the SQLite WAL database.

### Security Architecture
SHA-256 integrity check on every startup validates all system components. PID file lock prevents concurrent writer corruption of the database. Path-traversal protection for all filesystem operations. WASM sandbox for code execution tools. CLAW approval gate for destructive operations. The audit ledger provides a tamper-proof record of all system actions. Everything runs fully offline � no network egress, no data breach surface.

### Deployment
The feature runs as part of the single `api-oss` binary � no Docker required (optional), no runtime dependencies, no cloud services. Data is stored under `./data/` by default. Configuration is in `opencode.json` at the root or gateway level. The 3050 Ti GPU auto-detects with backend "cuda" on startup. All features work fully offline with no internet required after initial model download.

### Performance
Inference runs at 20-40 tokens/second on a 3050 Ti with the qwen2-vl-2b-q4 Q4_K_M model. Non-inference operations (graph queries, search, CRUD) complete in milliseconds. Memory usage is approximately 3GB RAM for the system plus 3GB VRAM for the model on the GPU.

### Dependencies
This feature has no external runtime dependencies. All functionality is self-contained in the single binary. No cloud API keys required. No third-party services. No database servers. No runtime environments (Python, Node.js). Docker is optional.

### Data Flow Summary
The feature follows this data flow: User input ? React 18 frontend (port 8081) ? WebSocket (port 3030) ? Rust handler in `ai-oss-gateway/src/handlers/` ? Graph query or inference call (Qwen2-VL-2B-Instruct-Q4_K_M.gguf on CUDA 3050 Ti) ? Response streamed via WebSocket ? Persisted to `data/graph.db` (SQLite WAL) and `data/ledger/` (`.aioss` format). Config is read from `opencode.json` at every level. CLI commands (87 across 9 groups) provide alternative access. Everything runs on the single `api-oss` binary with no Docker required.

### Key Technical Details
- Gateway is started via `api-oss start` or the binary directly
- Config drives everything via `opencode.json` at root and gateway levels
- Rust modules are in `ai-oss-gateway/src/`
- Frontend connects via WebSocket to port 3030
- HTTP UI is served on port 8081
- CLI has 87 commands across 9 subcommand groups
- Model: Qwen2-VL-2B-Instruct-Q4_K_M.gguf with CUDA backend
- Ledger stored at `data/ledger/` in `.aioss` format
- Graph stored in `data/graph.db` SQLite WAL
- Everything runs on a single binary, no Docker required (optional)
- Data directory is `./data/` by default
- Frontend is React 18 + Vite 5 + Tailwind, bundled or served via `npm run dev`
- The 3050 Ti GPU auto-detects with backend "cuda"
- Integrity check runs SHA-256 on every startup
- All features work fully offline with no internet required

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
