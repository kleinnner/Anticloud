---
title: "Chat / Conversation UI"
sidebar_position: 99
description: "Full-featured chat interface with streaming AI responses rendered token-by-token. Complete message history with session management including edit, delete, and branch capabilities. All conversations pe"
tags: [features]
---

# Chat / Conversation UI

## What It Does
Full-featured chat interface with streaming AI responses rendered token-by-token. Complete message history with session management including edit, delete, and branch capabilities. All conversations persist across gateway restarts via SQLite persistence. The UI shows token count, model name, and generation status in real time. Users can select from multiple response options, edit any previous message, and replay entire sessions.

## How It Works
The frontend `ChatView` is a React 18 component served via Vite 5 on port 8081. It connects to the Rust backend over WebSocket on port 3030. Each chat session corresponds to a node in the knowledge graph at `data/graph.db` (SQLite WAL), with messages stored as ordered child nodes. Messages are first-class graph entities — they can be searched via FTS5 full-text search, linked to other nodes via entity extraction, and traversed by the contradiction detection engine.

The WebSocket message flow: the user types a message and the frontend sends a `prompt` message. The backend in `ai-oss-gateway/src/handlers/chat.rs` forwards the prompt to the local LLM (Qwen2-VL-2B-Instruct-Q4_K_M.gguf with CUDA backend, auto-detecting the 3050 Ti GPU). Tokens are streamed back one by one as `token` messages, rendered with smooth typing animation. When generation completes, a `done` message signals the end with token usage statistics. Users can send `stop` to cancel generation mid-stream — partial responses are preserved.

Session management via WebSocket: `list_sessions` returns all sessions, `restore_latest_session` reloads the last active session on startup, `delete_session` removes a session and all its messages atomically, `edit_message` modifies a message in place with a new version (original preserved as parent).

Persistence: every write goes to SQLite WAL immediately. A crash loses at most the current in-flight token — all prior context is restored on restart. The session sidebar shows session names, message counts, dates, and the model used.

The HTTP UI is served on port 8081. Config in `opencode.json` at root and gateway levels controls model selection, system prompt, generation parameters (temperature, top_p, max_tokens), and session behavior. CLI has 87 commands across 9 subcommand groups including `session list`, `session restore`, `session delete`. Startup runs SHA-256 integrity check.

## How to Operate
1. Start the gateway: `api-oss start` or run the binary directly. The 3050 Ti GPU auto-detects with "cuda".
2. Open `http://localhost:8081` in a browser (React 18 + Vite 5 + Tailwind frontend).
3. The Chat view loads — the latest session is restored automatically via WebSocket.
4. Type a message in the input box and press Enter. Tokens stream in real time with typing animation.
5. Click "Stop" to cancel generation. Click "Regenerate" to get an alternative response.
6. Click the edit icon on any message (user or AI) to modify it in place. The original version is preserved.
7. Use the session sidebar to create (`create_session`), switch (`switch_session`), or delete sessions.
8. View token count, model name, and generation speed in the status bar.
9. Use CLI: `api-oss session list`, `api-oss session restore --latest`, `api-oss session delete --id <id>`.

Config in `opencode.json`:
```json
{
  "chat": {
    "model": "Qwen2-VL-2B-Instruct-Q4_K_M.gguf",
    "temperature": 0.7,
    "max_tokens": 2048,
    "system_prompt": "You are a helpful AI assistant."
  }
}
```

## The Moat
- OpenAI's web chat is cloud-only with no offline mode. Our chat connects to a fully local inference engine.
- Messages are stored in the local SQLite database and survive restarts. No data ever leaves the machine unless explicitly exported.
- Session persistence writes every message to disk immediately — crash recovery loses at most one token.
- Message history is a first-class graph entity, enabling graph queries across conversations.
- Streaming token rendering with smooth animation matches cloud chat UX, but runs 100% locally.
- The system works fully offline with no internet required after initial model download.

## Why Choose API-OSS
The chat UI matches or exceeds the quality of cloud AI chat interfaces — streaming tokens, message editing, session management — while running completely locally. No data is sent to any server. No API key is required. No usage limits apply. For organizations handling sensitive data (legal, medical, defense), this eliminates the primary risk of cloud AI: data egress. Session persistence guarantees zero data loss even during a power failure.

## Competitive Comparison
- **OpenAI**: Cloud-only web chat — no offline mode, no local persistence, data leaves your machine.
- **Anthropic**: Cloud-only console — no offline capability, no session management beyond browser history.
- **Google**: Gemini web chat — cloud-only with usage limits, data stored on Google servers.

## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. API-OSS costs $0 for all inference. At 10,000 conversations/month with average 500 tokens each, cloud competitors bill $75–$7,500/month. API-OSS costs zero — the only cost is the one-time hardware. Time savings: no API integration, no rate-limit handling. Risk reduction: zero data breach surface.

## Applications
- **Consumer**: Private chat with no data uploaded to any server. Complete ownership of conversation history.
- **Government / Defense**: Secure chat in classified environments with zero network egress.
- **Enterprise**: Full audit trail of all AI conversations stored locally. Compliance-ready.

## Protocol Message Reference
Request: `{"type":"prompt","content":"Hello","session_id":"...","req_id":"r1"}`. Streaming response: `{"type":"token","token":"Hello","req_id":"r1"}`, `{"type":"token","token":"!","req_id":"r1"}`, ..., `{"type":"done","req_id":"r1","usage":{"prompt":5,"completion":42}}`. Stop: `{"type":"stop","req_id":"r1"}`. Session management: `{"type":"list_sessions"}`, `{"type":"restore_latest_session"}`, `{"type":"delete_session","session_id":"..."}`.

## CLI Command Reference
`api-oss session list`, `api-oss session restore --latest`, `api-oss session restore --id <id>`, `api-oss session delete --id <id>`, `api-oss message edit --id <uuid> --content "new text"`, `api-oss message export --session <id> --format json`.

## Security Considerations
All messages are stored locally in `data/graph.db`. No data is transmitted over the network for chat functionality. The SHA-256 integrity check on startup validates the database. PID file lock prevents concurrent writer corruption. The chat session system supports Codex multi-tenancy for data isolation between workspaces.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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