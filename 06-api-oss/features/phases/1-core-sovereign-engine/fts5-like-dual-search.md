---
title: "FTS5 + LIKE Dual Search"
sidebar_position: 99
description: "Full-text search across all graph content using SQLite FTS5 with porter tokenizer for English stemming, with SQL LIKE fallback for partial and fuzzy matches. Results ranked by BM25 relevance. No exter"
tags: [features]
---

# FTS5 + LIKE Dual Search

## What It Does
Full-text search across all graph content using SQLite FTS5 with porter tokenizer for English stemming, with SQL LIKE fallback for partial and fuzzy matches. Results ranked by BM25 relevance. No external search API or Elasticsearch cluster required. Search spans all node types, message content, and document text. Supports phrase matching, prefix wildcards, and boolean operators.

## How It Works
The dual search engine lives in `ai-oss-gateway/src/search.rs`. When a search query arrives via WebSocket (port 3030), routing logic applies:

**FTS5 path**: Complete words without wildcards route to the FTS5 virtual table. The `porter` tokenizer provides English stemming ("running" matches "run", "decisions" matches "decision"). Results ranked by BM25 relevance. FTS5 indexes node names, descriptions, message content, and document text from `data/graph.db`. Supports phrase matching, prefix matching (run*), and boolean operators (AND, OR, NOT).

**LIKE path**: Queries with wildcards (%, _) or partial/fuzzy patterns route to LIKE fallback. Handles cases like `%infrastruct%` matching "infrastructure". Slower (full table scan) but catches patterns FTS5 misses.

Results include: node ID, type, name, matching text snippet with highlighted terms, relevance score (0-1), and direct link to source node. Frontend `SearchView` (React 18 + Vite 5 + Tailwind) shows results with relevance badges, type filters, and sort controls.

The search index rebuilds automatically on node changes. The system runs on the single `api-oss` binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups. Everything works fully offline.

## How to Operate
1. Launch the gateway: `api-oss start` or run the binary directly.
2. Open `http://localhost:8081` (React 18 + Vite 5 + Tailwind frontend).
3. Open Search view. Type query — results appear in real time (debounced 300ms).
4. Use quotes for exact phrase: `"strategic objectives"`.
5. Use `*` for prefix wildcard: `infra*` matches "infrastructure".
6. Use `%` for LIKE fallback: `%struct%` catches partial matches.
7. Use boolean: `budget AND forecast`, `revenue OR income`, `project NOT cancelled`.
8. Filter by node type. Click any result to navigate to its source.
9. CLI: `api-oss search "quarterly report"`, `api-oss search --type Document "meeting notes"`.

Config:
```json
{
  "search": {
    "fts5_tokenizer": "porter",
    "max_results": 50,
    "like_fallback": true
  }
}
```

## The Moat
- Every competitor depends on paid search APIs (Elasticsearch, Algolia, cloud search services).
- Our dual search uses only SQLite — zero operational cost, zero network calls.
- FTS5 for ranked search, LIKE for fuzzy patterns. All in one database file.
- No per-query costs, no rate limits, no network latency.

## Why Choose API-OSS
Enterprise search without enterprise costs. Elasticsearch starts at $95/month. Algolia charges per 1,000 requests. API-OSS provides unlimited search for free with zero infrastructure management.

## Competitive Comparison
- **OpenAI**: No search within your data — cloud-only chat.
- **Google**: Relies on paid cloud search infrastructure.
- **Anthropic**: No search capability.

## Cost-Benefit Analysis
OpenAI charges $0.15/1M input and $0.60/1M output tokens. Elasticsearch cloud starts at $95/month. Algolia charges $0.50/1K requests + $0.40/1K records. At 100K searches/month, cloud search costs $50-$500/month. API-OSS: $0.

## Applications
- **Consumer**: Instant offline search across your entire knowledge base.
- **Government / Defense**: Full-text search in air-gapped environments.
- **Enterprise**: Zero-cost search — no per-query or per-document fees.

## Protocol Message Reference
Request: `{"type":"search_query","query":"budget forecast","filters":{"types":["Document"]},"limit":20}`. Response: `{"type":"search_results","results":[{"id":"uuid","type":"Document","name":"Q4 Budget","snippet":"...budget forecast...","score":0.87}],"total":15}`.

## CLI Command Reference
`api-oss search "query"`, `api-oss search --type Document "budget"`, `api-oss search --limit 100`.

## Security Considerations
Search operates entirely locally. No query text transmitted. Results respect codex isolation. FTS5 index validated by SHA-256 integrity check on startup.

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
