---
title: "PID File Lock"
sidebar_position: 99
description: "Writes a PID file on startup and exits if one already exists with a live process. Prevents multiple gateway instances from running simultaneously, ensuring data integrity by serializing all writes to "
tags: [features]
---

# PID File Lock

## What It Does
Writes a PID file on startup and exits if one already exists with a live process. Prevents multiple gateway instances from running simultaneously, ensuring data integrity by serializing all writes to the SQLite database. The PID file is cleaned up on graceful shutdown, and stale PID files (from crashes) are detected and removed automatically.

## How It Works
The PID file lock is implemented in i-oss-gateway/src/main.rs as the first operation during startup. The sequence:

1. On startup, the system checks for an existing PID file at ./data/api-oss.pid (configurable).
2. If the file exists, reads the PID and checks if that process is alive using the sysinfo crate (cross-platform process existence check).
3. If the PID corresponds to a live process, the system prints an error message: "Another instance is already running (PID: <pid>)" and exits with a non-zero code.
4. If the PID file exists but the process is dead (stale lock from a crash), the system removes the stale file and proceeds.
5. The system writes its own PID to the file and registers a shutdown handler to remove it on graceful exit.
6. On SIGTERM, SIGINT, or normal shutdown, the shutdown handler removes the PID file.

This mechanism prevents concurrent gateway instances from writing to the SQLite WAL database at data/graph.db and the ledger at data/ledger/. SQLite in WAL mode supports multiple readers but only one writer � the PID lock guarantees single-writer compliance.

The system runs on the single pi-oss binary. Everything works fully offline with no internet required.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly.
2. If this is the first instance, the system starts normally and creates the PID file.
3. If a second instance is launched, it detects the live PID and exits with a clear error message.
4. To force-start (e.g., if a crash left a stale PID file), use pi-oss start --force.
5. The --force flag removes any existing PID file regardless of process status.
6. On normal shutdown (Ctrl+C or pi-oss stop), the PID file is cleaned up automatically.
7. If the system crashes, the PID file remains but is detected as stale on next startup.

Config in opencode.json:
`json
{
  "pid_file": {
    "path": "./data/api-oss.pid",
    "force_on_stale": true
  }
}
`

## The Moat
- Most AI systems are designed for cloud scale-out with no single-instance guarantee.
- Our system is designed for local-first operation where concurrent writers would corrupt the SQLite WAL.
- The PID lock is the simplest possible guarantee of data integrity � no database-level locking needed.
- Cross-platform via sysinfo crate � works on Windows, Linux, and macOS.
- Stale PID detection prevents the "crashed and can't restart" problem.
- --force flag provides a clean escape hatch for recovery scenarios.

## Why Choose API-OSS
Data integrity guarantee for local-first AI. Organizations running API-OSS in automated deployment scripts or containerized environments get a hard guarantee against concurrent instance corruption. PID file locking is simple, well-understood, and effective � no distributed locking protocols needed for a single-machine deployment.

## Competitive Comparison
- **OpenAI**: Cloud-managed, no local instance control needed or offered. Concurrency handled by their infrastructure.
- **Anthropic**: Cloud-only, no local binary. No PID file concept exists.
- **Palantir**: Server-based deployment with no single-instance guarantee for local deployments.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# PID File Lock

## What It Does
Writes a PID file on startup and exits if one already exists with a live process. Prevents multiple gateway instances from running simultaneously, ensuring data integrity by serializing all writes to the SQLite database. The PID file is cleaned up on graceful shutdown, and stale PID files (from crashes) are detected and removed automatically.

## How It Works
The PID file lock is implemented in i-oss-gateway/src/main.rs as the first operation during startup. The sequence:

1. On startup, the system checks for an existing PID file at ./data/api-oss.pid (configurable).
2. If the file exists, reads the PID and checks if that process is alive using the sysinfo crate (cross-platform process existence check).
3. If the PID corresponds to a live process, the system prints an error message: "Another instance is already running (PID: <pid>)" and exits with a non-zero code.
4. If the PID file exists but the process is dead (stale lock from a crash), the system removes the stale file and proceeds.
5. The system writes its own PID to the file and registers a shutdown handler to remove it on graceful exit.
6. On SIGTERM, SIGINT, or normal shutdown, the shutdown handler removes the PID file.

This mechanism prevents concurrent gateway instances from writing to the SQLite WAL database at data/graph.db and the ledger at data/ledger/. SQLite in WAL mode supports multiple readers but only one writer � the PID lock guarantees single-writer compliance.

The system runs on the single pi-oss binary. Everything works fully offline with no internet required.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly.
2. If this is the first instance, the system starts normally and creates the PID file.
3. If a second instance is launched, it detects the live PID and exits with a clear error message.
4. To force-start (e.g., if a crash left a stale PID file), use pi-oss start --force.
5. The --force flag removes any existing PID file regardless of process status.
6. On normal shutdown (Ctrl+C or pi-oss stop), the PID file is cleaned up automatically.
7. If the system crashes, the PID file remains but is detected as stale on next startup.

Config in opencode.json:
`json
{
  "pid_file": {
    "path": "./data/api-oss.pid",
    "force_on_stale": true
  }
}
`

## The Moat
- Most AI systems are designed for cloud scale-out with no single-instance guarantee.
- Our system is designed for local-first operation where concurrent writers would corrupt the SQLite WAL.
- The PID lock is the simplest possible guarantee of data integrity � no database-level locking needed.
- Cross-platform via sysinfo crate � works on Windows, Linux, and macOS.
- Stale PID detection prevents the "crashed and can't restart" problem.
- --force flag provides a clean escape hatch for recovery scenarios.

## Why Choose API-OSS
Data integrity guarantee for local-first AI. Organizations running API-OSS in automated deployment scripts or containerized environments get a hard guarantee against concurrent instance corruption. PID file locking is simple, well-understood, and effective � no distributed locking protocols needed for a single-machine deployment.

## Competitive Comparison
- **OpenAI**: Cloud-managed, no local instance control needed or offered. Concurrency handled by their infrastructure.
- **Anthropic**: Cloud-only, no local binary. No PID file concept exists.
- **Palantir**: Server-based deployment with no single-instance guarantee for local deployments.
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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
