---
title: "Codex Multi-Tenant Workspaces"
sidebar_position: 99
description: "Provides isolated workspaces (codexes) within a single SQLite database using `codex_id` scoping on every node, edge, session, and search record. Users can create, switch, list, delete, and save into c"
tags: [features]
---

# Codex Multi-Tenant Workspaces

## What It Does
Provides isolated workspaces (codexes) within a single SQLite database using `codex_id` scoping on every node, edge, session, and search record. Users can create, switch, list, delete, and save into codexes — each with its own graph namespace, conversation history, and search profiles. Codexes are fully independent: data in one codex is invisible from another, yet all live in the same database file for simple backup and restore.

## How It Works
The multi-tenant workspace system is implemented in `ai-oss-gateway/src/handlers/codex.rs` and enforced throughout the entire data access layer in `graph.rs`, `sessions.rs`, and `search.rs`. Every database table that stores user-facing data includes a `codex_id TEXT NOT NULL` column. Every query method accepts a `codex_id` parameter and includes it in the WHERE clause. This is not a convention — it is enforced at the database abstraction layer. Any query that omits `codex_id` fails at compile time via Rust's type system (the `CodexId` newtype is a required struct field).

The isolation model is row-level, not table-level. A single SQLite WAL database at `data/graph.db` hosts all tenants. This means:
- One backup file contains all workspaces — disaster recovery for all tenants is as simple as copying one file
- One SHA-256 integrity check on startup validates all data across all codexes
- Schema migrations affect all tenants simultaneously — no per-tenant migration coordination
- Resource limits (disk, memory) are shared fairly across tenants

WebSocket messages (port 3030): `create_codex` creates a new isolated workspace, `switch_codex` changes the active scope, `list_codexes` returns all workspaces with metadata, `delete_codex` removes a workspace atomically, `save_to_codex` saves the current session state to a specified codex.

The frontend `CodexManagerView` (React 18 + Vite 5 + Tailwind) displays codexes as a horizontal tab bar with color indicators and a "+" button for creation. The active codex is highlighted. A dropdown menu on each tab provides rename and delete options. The view connects via WebSocket to port 3030 for real-time updates.

The system runs on the single `api-oss` binary. HTTP UI on port 8081. CLI has `codex` as one of 9 subcommand groups with 87 total commands. Config in `opencode.json` at root and gateway levels controls codex limits and defaults.

## How to Operate
1. Launch the gateway: `api-oss start` or run the binary directly.
2. Open `http://localhost:8081` in a browser (React 18 + Vite 5 + Tailwind frontend).
3. The default "Personal" codex loads. Click the "+" tab to create a new workspace.
4. Name the codex (e.g., "Work", "Research", "Classified") and assign a color.
5. Click on any codex tab to switch instantly — the UI, graph, and sessions all re-scope to the selected workspace.
6. Drag tabs to reorder. Right-click a tab for rename/delete options.
7. All operations show real-time confirmation via WebSocket on port 3030.
8. Use CLI: `api-oss codex create --name "ProjectX"`, `api-oss codex list`, `api-oss codex switch --name "Research"`.
9. Use `api-oss codex delete --id <uuid>` to permanently remove a workspace and all its data.

Config in `opencode.json`:
```json
{
  "codex": {
    "max_codexes": 50,
    "default_codex": "Personal"
  }
}
```

## The Moat
- Palantir requires per-deployment isolation — separate infrastructure for each tenant, multiplied cost for licensing, servers, and operations.
- Our model stores all tenants in one database with row-level `codex_id` isolation, making multi-tenancy trivial to deploy, backup, and restore.
- No cloud AI provider offers multi-tenant workspaces at all — all are single-workspace with no data isolation concept.
- The isolation is enforced at the database query layer and checked at compile time via Rust's type system — no runtime isolation bugs.
- Single-file backup means disaster recovery for all tenants is as simple as copying one file.

## Why Choose API-OSS
Single-deployment multi-tenant workspace isolation with zero infrastructure overhead. Organizations that need to separate projects, clients, or security domains can do so without provisioning separate servers or paying per-workspace licensing fees. Palantir charges per-deployment; API-OSS provides equivalent isolation in a single SQLite file. The model scales from one codex to hundreds within the same database, same binary, same machine.

## Competitive Comparison
- **Palantir**: Per-deployment isolation — each tenant requires separate infrastructure, separate licensing, increased operational cost.
- **OpenAI**: Single workspace per user — no multi-workspace concept. All data in one flat history.
- **Anthropic**: No workspace concept — single project view with no isolation.

## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Codex multi-tenancy is bundled at zero additional cost. Palantir Foundry costs $100K+/year per deployment, with each tenant requiring a separate deployment. API-OSS provides unlimited tenants on the same hardware with zero per-tenant licensing. Time savings: one backup restores all tenants. Risk reduction: row-level isolation prevents cross-tenant data leakage.

## Applications
- **Consumer**: Separate workspaces for work, personal, and research projects — each with independent data.
- **Government / Defense**: Classified and unclassified data in isolated workspaces on the same physical machine.
- **Enterprise**: Single-deployment multi-tenant for teams, projects, or clients. Complete data separation.

## Protocol Message Reference
Same message types as Codex CRUD + Switching: `create_codex`, `switch_codex`, `list_codexes`, `delete_codex`, `save_to_codex`. All messages include `codex_id` in the payload for context. The `switch_codex` message re-scopes all subsequent operations. Multi-tenant enforcement happens transparently at the database layer — clients do not need to specify `codex_id` on every query after switching.

## CLI Command Reference
`api-oss codex create --name "ProjectX"`, `api-oss codex list`, `api-oss codex switch --id <uuid>`, `api-oss codex delete --id <uuid>`, `api-oss codex rename --id <uuid> --name "NewName"`, `api-oss codex stats --id <uuid>`. The `--codex` flag is available on all data commands to scope operations.

## Security Considerations
Row-level isolation via `codex_id` is enforced at the database layer and compile-time checked. Cross-codex data access requires explicit codex switch. All data operations are logged in the audit ledger with `codex_id`. The SHA-256 integrity check on startup validates all codexes. PID file lock prevents concurrent instance corruption across all tenants.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
