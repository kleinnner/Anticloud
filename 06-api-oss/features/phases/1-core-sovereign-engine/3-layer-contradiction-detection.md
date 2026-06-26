---
title: "3-Layer Contradiction Detection"
sidebar_position: 3
description: 'Detects logical contradictions across the entire system using three layered approaches that operate at increasing depth. Stance-level detection catches explicit position changes (e.g., "I support X" f'
tags: [features]
---

# 3-Layer Contradiction Detection

## What It Does
Detects logical contradictions across the entire system using three layered approaches that operate at increasing depth. Stance-level detection catches explicit position changes (e.g., "I support X" followed by "I oppose X"). Semantic keyword-pair detection finds opposing terms in close proximity (e.g., "increase" near "decrease"). Graph-traversal inference discovers contradictions reachable via graph edges — if node A implies B and node C implies not-B, the system flags A and C as contradictory. Resolved contradictions are tracked and rechecked on subsequent scans.

## How It Works
The contradiction engine lives in `ai-oss-gateway/src/contradiction.rs` and `contradiction_clean.rs`. Three detection layers run in order of increasing computational cost.

**Stance layer**: Maintains a map of entities to stated positions. Each new statement about an entity is compared against all prior positions. If "Q4 revenue will grow" is stored and the new statement says "Q4 revenue will decline", a contradiction is flagged. The stance map is persisted in the knowledge graph at `data/graph.db` (SQLite WAL) so contradictions survive restarts across gateway restarts.

**Semantic keyword-pair layer**: A curated lexicon of 200+ opposing keyword pairs (increase/decrease, approve/reject, buy/sell) is matched against text windows of configurable size (default 100 tokens). Co-occurrence of opposing pairs within the same window triggers a contradiction flag. The lexicon is stored as a graph edge type so users can add custom opposing pairs via the graph API.

**Graph-traversal layer**: Starting from a node, BFS traversal follows edges up to depth 3. If any reachable node contains a statement that logically inverts a statement on the starting node, a contradiction is flagged. This catches indirect contradictions that simple text matching misses, such as "Company A acquired Company B" conflicting with "Company B acquired Company A" if they appear in different parts of the graph.

Each contradiction event is recorded as an entry in the SHA-256 hash-chained audit ledger at `data/ledger/` in `.aioss` format. The frontend `ContradictionsView` polls via WebSocket (port 3030) for updates. The contradiction meter gauge shows the ratio of contradictions to total statements, providing a real-time coherence score for the entire knowledge graph. The 3050 Ti GPU auto-detects with backend "cuda" for accelerated scanning of large graphs.

The system runs on the single `api-oss` binary. Startup triggers a SHA-256 integrity check. Config in `opencode.json` at root and gateway levels controls scan frequency (default every 5 minutes), sensitivity thresholds, and which layers are active. CLI has 87 commands across 9 subcommand groups including `contradiction scan`, `contradiction list`, and `contradiction resolve`. Everything works fully offline with no internet required.

## How to Operate
1. Launch the gateway: `api-oss start` or run the binary directly.
2. Open the HTTP UI on port 8081 (React 18 + Vite 5 + Tailwind, bundled or served via `npm run dev`).
3. Navigate to the Contradictions view from the main navigation.
4. Click "Scan" to trigger a manual contradiction scan or wait for the automated interval (default 5 min).
5. Review flagged contradictions in the list view — each shows the two conflicting statements, the detection layer that found them, and a link to the source graph nodes.
6. Mark contradictions as Resolved, Dismissed, or leave Open for recheck. The contradiction meter gauge updates in real time via WebSocket.
7. All actions are recorded in the audit ledger at `data/ledger/`. Use `api-oss ledger tail` to view recent entries.
8. Use `api-oss contradiction resolve --id <hash>` to bulk-resolve from CLI.

Config in `opencode.json`:
```json
{
  "contradiction": {
    "scan_interval_secs": 300,
    "layers": ["stance", "keyword", "graph"],
    "keyword_window_tokens": 100,
    "graph_traversal_depth": 3
  }
}
```

## The Moat
- No competitor — OpenAI, Anthropic, Google, or Nvidia — implements any form of contradiction detection in their deployed AI products.
- Palantir's AIP does not check for logical consistency across data or decisions.
- The three-layer design is architecturally novel — the graph-traversal layer uses the knowledge graph as a logical inference engine.
- Every contradiction event is cryptographically anchored in the hash-chained ledger, providing tamper-proof audit of detected inconsistencies.
- The system works fully offline with no internet required — critical for classified and regulated environments where cloud AI is prohibited.
- Resolved contradictions are rechecked automatically; if a resolved contradiction reappears, the system detects the regression.

## Why Choose API-OSS
This feature alone justifies the platform for any organization where AI decision consistency matters. No other product — cloud or local — checks its own outputs for logical consistency across time, topics, or agents. For regulated industries (finance, healthcare, defense), this provides audit-grade proof that the system does not simultaneously hold contradictory positions. The three-layer architecture catches everything from direct flip-flops to deeply buried indirect contradictions that a human reviewer would miss. It is a genuinely novel capability that no competitor offers at any price.

## Competitive Comparison
- **OpenAI**: No contradiction detection. GPT-4o may contradict itself freely across turns and sessions. Users have no tool to detect or resolve conflicts.
- **Anthropic**: Constitutional AI constrains training but does not detect runtime contradictions. Claude cannot flag when its own outputs conflict across a conversation.
- **Google**: Gemini has no cross-session or cross-document contradiction checking. Cloud-only with no local graph to traverse.
- **Nvidia**: NeMo Guardrails can filter topics but has no contradiction detection capability.
- **Palantir**: AIP Foundry has no logical consistency checking across its data pipeline.

## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25–$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference — the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150–$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private AI with guaranteed logical consistency — no contradictory advice on health, finance, or legal topics.
- **Government / Defense**: Air-gapped contradiction scanning for intelligence analysis — the system cannot hold conflicting operational stances.
- **Enterprise**: Audit-proof knowledge base against logical inconsistencies. SOX/HIPAA compliance for AI-assisted decision making.

## Protocol Message Reference
WebSocket communication on port 3030 uses JSON messages. Request: `{"type": "contradiction_scan", "codex_id": "..."}` triggers a scan. Response: `{"type": "contradiction_scan_result", "contradictions": [...], "meter": 0.05}` returns results. Each contradiction object contains `layer`, `statement_a`, `statement_b`, `node_ids`, `status`, and `created_at`. The frontend polls via `contradiction_meter` for real-time gauge updates. Errors return `{"type": "error", "message": "..."}`.

## CLI Command Reference
The CLI provides 87 commands across 9 subcommand groups. For this feature: `api-oss contradiction scan` (trigger manual scan), `api-oss contradiction list --status open` (list by status), `api-oss contradiction resolve --id <hash>` (mark resolved), `api-oss contradiction dismiss --id <hash>` (mark dismissed), `api-oss contradiction show --id <hash>` (view details). Use `api-oss help contradiction` for full subcommand documentation.

## Security Considerations
All contradiction events are recorded in the SHA-256 hash-chained audit ledger. The system does not transmit any data over the network for contradiction detection — everything runs locally. The PID file lock prevents concurrent instance corruption of the graph database. The SHA-256 integrity check on startup validates all system components including the contradiction engine.

## FAQ
**Q: Does contradiction detection require internet?** A: No. All three layers run fully offline with no external API calls. **Q: How often does it scan?** A: Default every 5 minutes, configurable via `scan_interval_secs` in `opencode.json`. **Q: Can I add custom opposing keywords?** A: Yes. The lexicon is stored as a graph edge type — add nodes and edges via the Graph API. **Q: Does it slow down the system?** A: The stance and keyword layers run in <10ms. The graph-traversal layer scales with graph size but is bounded by depth 3 default.

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com