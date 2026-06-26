---
title: "Codex CRUD + Switching"
sidebar_position: 99
description: "Full create, read, update, delete lifecycle for codex workspaces. Each codex has an isolated graph namespace — nodes and edges from one codex are invisible to others. Switching between codexes reconte"
tags: [features]
---

# Codex CRUD + Switching

## What It Does
Full create, read, update, delete lifecycle for codex workspaces. Each codex has an isolated graph namespace — nodes and edges from one codex are invisible to others. Switching between codexes recontextualizes the entire UI to the selected workspace. All graph queries, chat sessions, and search results are scoped to the active codex. Users can create unlimited codexes, rename them, and delete them with atomic data removal.

## How It Works
The codex system lives in `ai-oss-gateway/src/handlers/codex.rs`. It implements multi-tenancy at the row level within a single SQLite WAL database at `data/graph.db`. Every node, edge, session, and search record in the database includes a `codex_id TEXT NOT NULL` column. All CRUD queries append `WHERE codex_id = ?` to ensure complete data isolation. This is enforced at the database layer — no query can accidentally leak data across codexes because the WHERE clause is parameterized and mandatory.

The Rust backend exposes WebSocket messages on port 3030: `create_codex` creates a new codex with a generated UUID and returns the ID and name. `switch_codex` changes the active codex for the current WebSocket connection — the server returns `codex_switched` and subsequent queries are scoped to the new codex. `list_codexes` returns all codexes with metadata (name, creation date, node count). `delete_codex` removes the codex and all associated data in a single SQLite transaction.

When creating a new codex, an optional "seed from existing" feature copies the schema (node types, edge types) but not the data — providing a template mechanism. The frontend `CodexManagerView` (React 18 + Vite 5 + Tailwind) shows codexes as workspace tabs with drag-to-reorder, rename-in-place, and color coding. Tab colors help users visually distinguish workspaces at a glance.

The system runs on the single `api-oss` binary. HTTP UI on port 8081. Config in `opencode.json` at root and gateway levels controls the default codex and max codex count. CLI has 87 commands across 9 subcommand groups including `codex create`, `codex switch`, `codex list`, `codex delete`. Startup runs SHA-256 integrity check. Everything works fully offline.

## How to Operate
1. Launch the gateway: `api-oss start` or run the binary directly.
2. Open `http://localhost:8081` in a browser (React 18 + Vite 5 + Tailwind frontend).
3. The default codex loads automatically. Click the codex name in the header to open the codex switcher.
4. Click "New Codex" to create a new workspace — give it a name and optional color.
5. The UI switches to the new codex. All new data (nodes, edges, sessions) goes into this codex.
6. Switch between codexes instantly — all data lives in the same SQLite file so switching requires zero network delay.
7. Right-click a codex to rename or delete it. Deletion removes all associated data atomically.
8. Use CLI: `api-oss codex create --name "ProjectX"`, `api-oss codex switch --id <uuid>`, `api-oss codex list`.
9. Use `api-oss codex delete --id <uuid>` to permanently remove a codex and all its data.

Config in `opencode.json`:
```json
{
  "codex": {
    "default_codex": "default",
    "max_codexes": 100,
    "allow_seed_from": true
  }
}
```

## The Moat
- Palantir treats each deployment as a separate silo with infrastructure duplication — separate servers, databases, and backup pipelines for each tenant.
- Our codex model provides equivalent isolation within a single SQLite database using `codex_id` scoping.
- Switching between codexes is instant because all data lives in the same database file — no data migration, no cache warming.
- Row-level isolation within a single database means one backup backs up all codexes. One integrity check validates all codexes.
- No competitor offers multi-workspace isolation in a local-first architecture. All cloud AI products are single-workspace.

## Why Choose API-OSS
Multi-tenant workspace isolation without multi-infrastructure cost. Organizations that need to separate projects, clients, or classification levels can do so within a single deployment. Palantir charges per-silo infrastructure; API-OSS provides equivalent isolation in a single SQLite file. The instant switching between workspaces enables workflows that cross domains: analyze intelligence in one workspace, switch to personal research, switch back — all from the same machine.

## Competitive Comparison
- **Palantir**: Per-deployment infrastructure isolation — expensive operational overhead, separate servers for each silo.
- **OpenAI**: Single workspace — no multi-workspace concept. All data in one flat chat history.
- **Anthropic**: No workspace concept — single project view with no isolation.

## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Codex multi-tenancy adds zero cost — it is built into the single binary. Palantir charges per-deployment infrastructure costs that scale linearly with the number of tenants ($100K+/year per silo). API-OSS provides unlimited codexes on the same hardware. Risk reduction: each codex is fully isolated — a data corruption in one codex does not affect others.

## Applications
- **Consumer**: Separate workspaces for different life domains — work, health, finances — each with its own graph and chat history.
- **Government / Defense**: Isolated workspaces for different classification levels (unclassified, confidential, secret) on one machine.
- **Enterprise**: Project-level isolation without per-project infrastructure costs. Client-specific workspaces with complete data separation.

## Protocol Message Reference
Request: `{"type":"create_codex","name":"ProjectX","color":"#ff0000","seed_from":"default"}`. Response: `{"type":"codex_created","codex":{"id":"uuid","name":"ProjectX","color":"#ff0000","node_count":0}}`. `switch_codex`: `{"type":"switch_codex","codex_id":"uuid"}` → `{"type":"codex_switched","codex_id":"uuid","node_count":42}`. `list_codexes`: `{"type":"list_codexes"}` → `{"type":"codex_list","codexes":[...]}`. `delete_codex`: `{"type":"delete_codex","codex_id":"uuid"}` → `{"type":"codex_deleted","codex_id":"uuid"}`.

## CLI Command Reference
`api-oss codex create --name "ProjectX" --color "#ff0000"`, `api-oss codex switch --id <uuid>`, `api-oss codex list`, `api-oss codex delete --id <uuid>`, `api-oss codex rename --id <uuid> --name "NewName"`. All commands accept `--help` for detailed usage.

## Security Considerations
Row-level isolation via `codex_id` is enforced at the database query layer and checked at compile time via Rust's type system. Data from one codex cannot leak into another unless explicitly merged. The SHA-256 integrity check on startup validates the database. PID file lock prevents concurrent writer corruption. All codex operations are recorded in the audit ledger.

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
