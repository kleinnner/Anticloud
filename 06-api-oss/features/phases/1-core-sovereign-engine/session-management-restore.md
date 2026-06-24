---
title: "Session Management + Restore"
sidebar_position: 99
description: "Persists all chat sessions to SQLite so conversation history survives gateway restarts, crashes, and shutdowns. Users can list sessions, restore the latest session on startup, delete old sessions, and"
tags: [features]
---

# Session Management + Restore

## What It Does
Persists all chat sessions to SQLite so conversation history survives gateway restarts, crashes, and shutdowns. Users can list sessions, restore the latest session on startup, delete old sessions, and edit individual messages within any session. Session state is saved on every message � a crash loses at most the current in-flight token.

## How It Works
Session management is implemented in i-oss-gateway/src/sessions.rs. Each session is a node in the knowledge graph at data/graph.db (SQLite WAL) with type "Session". Messages are child nodes linked by "contains" edges with an order property for sequence.

When the gateway starts (via pi-oss start or binary directly), the system:
1. Checks for an existing session state in the database.
2. If estore_latest_session is configured (default: true), loads the most recent session's messages.
3. Sends a session_restored message via WebSocket with the session ID and message history.
4. The frontend ChatView (React 18 + Vite 5 + Tailwind) renders the restored session.

On each new message: the message is immediately saved to SQLite in the same transaction that processes the WebSocket message. This means every message is persisted before the next token is generated. A crash during inference loses at most the current in-flight token � all prior context is restored on restart.

Session operations via WebSocket (port 3030): list_sessions (return all sessions with metadata), estore_latest_session (reload last session), estore_session (load specific session by ID), delete_session (remove session and all messages atomically), edit_message (modify a message in place � original is preserved as a parent version).

Session metadata includes: session name (auto-generated from first message or user-set), created date, last active date, message count, model used, and codex ID.

The system runs on the single pi-oss binary (no Docker required, optional). HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including session list, session restore, session delete.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check runs on startup.
2. The latest session is automatically restored in the Chat view.
3. Open http://localhost:8081 to see the restored conversation.
4. Use the session sidebar to view all sessions, switch between them, or delete old ones.
5. Click the session name to rename it.
6. Edit any message by clicking the edit icon � changes are saved immediately.
7. Delete a session from the sidebar � confirmation dialog prevents accidental deletion.
8. Use CLI: pi-oss session list, pi-oss session restore --id <id>, pi-oss session restore --latest.
9. Use pi-oss session delete --id <id> to permanently remove a session.

Config in opencode.json:
`json
{
  "session": {
    "auto_restore": true,
    "restore_latest": true,
    "max_sessions": 100
  }
}
`

## The Moat
- Cloud AI services maintain session state in memory on their servers � if the connection drops, context is lost.
- Our session persistence writes every message to disk immediately � crash recovery loses at most one token.
- Every message is a graph node, enabling graph queries across conversation history.
- Session restore on startup means zero context loss even after system restart.
- Message editing preserves full edit history for audit purposes.

## Why Choose API-OSS
Zero data loss guarantee for AI conversations. Organizations that rely on AI-assisted workflows cannot afford to lose conversation context due to crashes or restarts. Our session persistence guarantees that every message is safely stored before the next token is generated. The automatic restore on startup means operators pick up exactly where they left off, even after a power failure.

## Competitive Comparison
- **OpenAI**: Session state is server-side � connection loss loses context if browser or network fails.
- **Anthropic**: No session persistence beyond browser refresh. Crash = lost context.
- **Google**: Gemini keeps cloud history but no local restore on crash, no message editing, no graph integration.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Session Management + Restore

## What It Does
Persists all chat sessions to SQLite so conversation history survives gateway restarts, crashes, and shutdowns. Users can list sessions, restore the latest session on startup, delete old sessions, and edit individual messages within any session. Session state is saved on every message � a crash loses at most the current in-flight token.

## How It Works
Session management is implemented in i-oss-gateway/src/sessions.rs. Each session is a node in the knowledge graph at data/graph.db (SQLite WAL) with type "Session". Messages are child nodes linked by "contains" edges with an order property for sequence.

When the gateway starts (via pi-oss start or binary directly), the system:
1. Checks for an existing session state in the database.
2. If estore_latest_session is configured (default: true), loads the most recent session's messages.
3. Sends a session_restored message via WebSocket with the session ID and message history.
4. The frontend ChatView (React 18 + Vite 5 + Tailwind) renders the restored session.

On each new message: the message is immediately saved to SQLite in the same transaction that processes the WebSocket message. This means every message is persisted before the next token is generated. A crash during inference loses at most the current in-flight token � all prior context is restored on restart.

Session operations via WebSocket (port 3030): list_sessions (return all sessions with metadata), estore_latest_session (reload last session), estore_session (load specific session by ID), delete_session (remove session and all messages atomically), edit_message (modify a message in place � original is preserved as a parent version).

Session metadata includes: session name (auto-generated from first message or user-set), created date, last active date, message count, model used, and codex ID.

The system runs on the single pi-oss binary (no Docker required, optional). HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including session list, session restore, session delete.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check runs on startup.
2. The latest session is automatically restored in the Chat view.
3. Open http://localhost:8081 to see the restored conversation.
4. Use the session sidebar to view all sessions, switch between them, or delete old ones.
5. Click the session name to rename it.
6. Edit any message by clicking the edit icon � changes are saved immediately.
7. Delete a session from the sidebar � confirmation dialog prevents accidental deletion.
8. Use CLI: pi-oss session list, pi-oss session restore --id <id>, pi-oss session restore --latest.
9. Use pi-oss session delete --id <id> to permanently remove a session.

Config in opencode.json:
`json
{
  "session": {
    "auto_restore": true,
    "restore_latest": true,
    "max_sessions": 100
  }
}
`

## The Moat
- Cloud AI services maintain session state in memory on their servers � if the connection drops, context is lost.
- Our session persistence writes every message to disk immediately � crash recovery loses at most one token.
- Every message is a graph node, enabling graph queries across conversation history.
- Session restore on startup means zero context loss even after system restart.
- Message editing preserves full edit history for audit purposes.

## Why Choose API-OSS
Zero data loss guarantee for AI conversations. Organizations that rely on AI-assisted workflows cannot afford to lose conversation context due to crashes or restarts. Our session persistence guarantees that every message is safely stored before the next token is generated. The automatic restore on startup means operators pick up exactly where they left off, even after a power failure.

## Competitive Comparison
- **OpenAI**: Session state is server-side � connection loss loses context if browser or network fails.
- **Anthropic**: No session persistence beyond browser refresh. Crash = lost context.
- **Google**: Gemini keeps cloud history but no local restore on crash, no message editing, no graph integration.
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

