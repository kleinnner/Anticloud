---
title: "Message Streaming + Log"
sidebar_position: 99
description: "Real-time token-by-token streaming of AI responses over WebSocket with full message persistence. Provides a message log view with session replay, message editing, response option selection, and audit-"
tags: [features]
---

# Message Streaming + Log

## What It Does
Real-time token-by-token streaming of AI responses over WebSocket with full message persistence. Provides a message log view with session replay, message editing, response option selection, and audit-grade timestamping. Every message is stored as a graph node in the knowledge graph, enabling graph-based queries across conversation history and cross-session contradiction scanning.

## How It Works
The message streaming and logging system is implemented in i-oss-gateway/src/handlers/chat.rs and sessions.rs. When a user sends a prompt via WebSocket on port 3030: the prompt message is received by the Rust backend. The prompt is saved as a user message node in data/graph.db (SQLite WAL) immediately. The prompt is forwarded to the local LLM (Qwen2-VL-2B-Instruct-Q4_K_M.gguf on CUDA). The response is streamed back token by token as 	oken WebSocket messages, rendered in real time by the React 18 frontend. Users can send stop to cancel mid-stream.

Each message is a first-class graph entity with edges linking it to: its session, adjacent messages (conversation order), detected emotions, entities mentioned, the generating model, and its SHA-256 hash for integrity.

The frontend MessagesView (React 18 + Vite 5 + Tailwind) provides a scrollable log with replay controls, edit buttons, and option pickers. The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including message list, message get, message export.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Messages stream in real time in the Chat view � watch tokens as they're generated.
4. To replay a session: switch sessions in the sidebar, scroll through history.
5. To edit a message: click the edit icon, modify text, save. Original version is preserved.
6. To see options: click "options" to view alternative responses from different runs.
7. Use the Message Log view to search all messages across sessions.
8. Use CLI: pi-oss message list --session <id>, pi-oss message get --id <uuid>.
9. Use CLI: pi-oss message export --session <id> --format json.

Config in opencode.json:
`json
{
  "message": {
    "stream_tokens": true,
    "max_history": 10000,
    "save_partial_on_stop": true
  }
}
`

## The Moat
- Cloud AI services stream tokens but lack persistent local logs with replay and editing.
- Our message log is a first-class graph entity � not just a flat list.
- Graph storage enables contradiction scanning, sentiment analysis, and cross-referencing across sessions.
- Editing preserves the original via parent version links � full edit history.
- Every message is timestamped and hash-verified for audit integrity.

## Why Choose API-OSS
Complete conversation audit trail with cryptographic integrity. Organizations documenting AI-assisted decisions � legal research, medical diagnosis, intelligence analysis � get a permanent, verifiable record of every interaction. Graph-based storage means conversations feed contradiction detection, sentiment analysis, and knowledge graph enrichment.

## Competitive Comparison
- **OpenAI**: Streaming API without persistent local log. Chat history is cloud-only, non-replayable offline.
- **Anthropic**: No persistent message log beyond the browser session. No message editing.
- **Google**: Gemini keeps cloud history but no local replay, editing, or graph integration.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Message Streaming + Log

## What It Does
Real-time token-by-token streaming of AI responses over WebSocket with full message persistence. Provides a message log view with session replay, message editing, response option selection, and audit-grade timestamping. Every message is stored as a graph node in the knowledge graph, enabling graph-based queries across conversation history and cross-session contradiction scanning.

## How It Works
The message streaming and logging system is implemented in i-oss-gateway/src/handlers/chat.rs and sessions.rs. When a user sends a prompt via WebSocket on port 3030: the prompt message is received by the Rust backend. The prompt is saved as a user message node in data/graph.db (SQLite WAL) immediately. The prompt is forwarded to the local LLM (Qwen2-VL-2B-Instruct-Q4_K_M.gguf on CUDA). The response is streamed back token by token as 	oken WebSocket messages, rendered in real time by the React 18 frontend. Users can send stop to cancel mid-stream.

Each message is a first-class graph entity with edges linking it to: its session, adjacent messages (conversation order), detected emotions, entities mentioned, the generating model, and its SHA-256 hash for integrity.

The frontend MessagesView (React 18 + Vite 5 + Tailwind) provides a scrollable log with replay controls, edit buttons, and option pickers. The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including message list, message get, message export.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Messages stream in real time in the Chat view � watch tokens as they're generated.
4. To replay a session: switch sessions in the sidebar, scroll through history.
5. To edit a message: click the edit icon, modify text, save. Original version is preserved.
6. To see options: click "options" to view alternative responses from different runs.
7. Use the Message Log view to search all messages across sessions.
8. Use CLI: pi-oss message list --session <id>, pi-oss message get --id <uuid>.
9. Use CLI: pi-oss message export --session <id> --format json.

Config in opencode.json:
`json
{
  "message": {
    "stream_tokens": true,
    "max_history": 10000,
    "save_partial_on_stop": true
  }
}
`

## The Moat
- Cloud AI services stream tokens but lack persistent local logs with replay and editing.
- Our message log is a first-class graph entity � not just a flat list.
- Graph storage enables contradiction scanning, sentiment analysis, and cross-referencing across sessions.
- Editing preserves the original via parent version links � full edit history.
- Every message is timestamped and hash-verified for audit integrity.

## Why Choose API-OSS
Complete conversation audit trail with cryptographic integrity. Organizations documenting AI-assisted decisions � legal research, medical diagnosis, intelligence analysis � get a permanent, verifiable record of every interaction. Graph-based storage means conversations feed contradiction detection, sentiment analysis, and knowledge graph enrichment.

## Competitive Comparison
- **OpenAI**: Streaming API without persistent local log. Chat history is cloud-only, non-replayable offline.
- **Anthropic**: No persistent message log beyond the browser session. No message editing.
- **Google**: Gemini keeps cloud history but no local replay, editing, or graph integration.
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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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