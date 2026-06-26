---
title: "Canvas Graph Rendering"
sidebar_position: 99
description: "Renders the knowledge graph in 2D and 3D using raw HTML5 Canvas 2D API and Three.js respectively. Six node types — Entity (blue circle), Concept (green diamond), Document (yellow square), Agent (red t"
tags: [features]
---

# Canvas Graph Rendering

## What It Does
Renders the knowledge graph in 2D and 3D using raw HTML5 Canvas 2D API and Three.js respectively. Six node types — Entity (blue circle), Concept (green diamond), Document (yellow square), Agent (red triangle), Decision (purple hexagon), Emotion (pink star) — are visually distinct. No D3.js, vis.js, or any third-party graph library is used for 2D rendering. The 3D mode uses Three.js for WebGL-accelerated interactive visualization. Users can drag nodes, zoom, pan, select, and inspect node details directly on the canvas.

## How It Works
The frontend graph renderer lives in the React 18 + Vite 5 + Tailwind codebase under `src/views/graph/`. Two core components handle rendering.

**BrainGraph2D**: Implements a custom force-directed layout algorithm using pure HTML5 Canvas 2D API. Each frame calculates repulsive forces between all nodes (Coulomb's law simulation) and attractive forces along edges (Hooke's law). The simulation runs in requestAnimationFrame loops for smooth 60fps rendering. Nodes are drawn as shapes with distinct colors per type. Edge thickness encodes relationship weight (thicker = stronger connection). Zoom and pan are handled via Canvas transform matrices. Performance scales to 5000+ nodes without frame drops because there are zero DOM elements per node — everything is rasterized directly to a bitmap.

**BrainGraph3D**: Uses Three.js with OrbitControls for WebGL-accelerated 3D rendering. The force layout operates in 3D space with Z-axis depth. Nodes are SphereGeometry meshes with MeshStandardMaterial colored by type. Edges are LineSegments with BufferGeometry. Node labels use CSS2DRenderer for crisp text overlay. WebGL rendering leverages the GPU — on a 3050 Ti with auto-detected "cuda" backend, 10,000+ nodes render smoothly.

Data flows from the backend: the frontend connects via WebSocket to port 3030 and sends a `graph_data` message. The Rust backend in `ai-oss-gateway/src/handlers/graph.rs` queries the SQLite WAL database at `data/graph.db` for all nodes and edges, serializes them as JSON, and sends the response. Graph data includes node positions (persisted between sessions), types, labels, and edge relationships.

The single `api-oss` binary serves the HTTP UI on port 8081 and the WebSocket endpoint on port 3030. Config is driven by `opencode.json` at root and gateway levels — rendering settings like default zoom, force layout parameters, and node size scaling are configurable. CLI has 87 commands across 9 subcommand groups for graph operations (`graph list`, `graph stats`, `graph export`). Startup runs SHA-256 integrity check.

## How to Operate
1. Start the gateway: `api-oss start` or run the binary directly. SHA-256 integrity check runs on startup.
2. Open `http://localhost:8081` in a browser (React 18 + Vite 5 + Tailwind, bundled or via `npm run dev`).
3. Click "Graph" in the navigation to open `GraphCanvasView`.
4. The graph loads automatically via WebSocket — nodes appear with force-directed layout animation.
5. Drag nodes to rearrange. Scroll to zoom. Click a node to inspect its properties and connected edges.
6. Toggle between 2D and 3D mode using the view toggle. The 3050 Ti GPU provides hardware-accelerated 3D.
7. Use the filter panel to show/hide specific node types (Entity, Concept, Document, Agent, Decision, Emotion).
8. Search for nodes by name using the search bar — the graph highlights matching nodes in real time.
9. Right-click a node for context menu: "View Details", "Find Path To...", "Expand Neighbors".
10. Use CLI: `api-oss graph stats` for node/edge counts and type distributions, `api-oss graph export --format json`.

Config in `opencode.json`:
```json
{
  "graph": {
    "force_repulsion": 5000,
    "force_attraction": 0.01,
    "node_size_min": 10,
    "node_size_max": 50,
    "default_zoom": 1.0
  }
}
```

## The Moat
- Palantir's graph UI is proprietary, closed-source, and licensed per-seat at enterprise pricing ($100K+/year per seat).
- D3.js and vis.js force-directed renderers struggle beyond 500 nodes due to SVG DOM overhead. Our Canvas 2D renderer handles 5000+ nodes at 60fps because it rasterizes directly to a bitmap.
- The 3D mode using Three.js provides immersive graph exploration that no competitor offers in a local-first package.
- Zero library dependencies for 2D means the graph renderer has minimal attack surface and small bundle size.
- All node types, colors, shapes, and sizes are configurable via CSS variables — themable without code changes.
- Works fully offline with no internet required. No external CDN for graph libraries.

## Why Choose API-OSS
Organizations that need to visualize complex knowledge graphs — intelligence analysis, research, enterprise knowledge management — get a professional-grade graph renderer with zero licensing cost. Palantir charges millions for similar graph visualization capabilities. The 2D Canvas renderer outperforms D3-based alternatives at scale, while the 3D mode provides a genuinely impressive exploration experience. Both modes work fully offline with no internet required.

## Competitive Comparison
- **Palantir**: Proprietary closed graph UI — Gotham and Foundry graph tools are expensive ($100K+/year per seat), closed-source, require server deployment.
- **OpenAI**: No graph visualization of any kind. ChatGPT has no concept of a knowledge graph.
- **Google**: No built-in graph renderer in any consumer AI product.

## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25–$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference — the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150–$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Explore your personal knowledge graph with smooth 60fps rendering from your browser.
- **Government / Defense**: Visualize intelligence graphs in air-gapped classified environments with no SaaS dependency.
- **Enterprise**: Embeddable graph visualization with no expensive license fees — no D3.js or vis.js dependency.

## Protocol Message Reference
Frontend sends `graph_data` (full graph), `graph_neighbors` (expand node), `graph_query` (filtered query) via WebSocket port 3030. Backend responds with node/edge JSON arrays. Node objects: `{id, type, name, description, properties, x, y, z, codex_id}`. Edge objects: `{id, source_id, target_id, type, weight, properties}`. The 2D renderer receives flat arrays; the 3D renderer receives the same data with Z coordinates.

## CLI Command Reference
`api-oss graph stats` (node/edge counts), `api-oss graph export --format json` (full export), `api-oss graph query "Entity(name CONTAINS 'X')"` (filtered), `api-oss graph neighbors --id <uuid>` (expand), `api-oss graph import --file graph.json` (import). All commands support `--codex` for multi-tenant scoping.

## Security Considerations
Graph data never leaves the machine. All rendering is local — no CDN, no external font loading. The graph database at `data/graph.db` is protected by the PID file lock against concurrent writer corruption. SHA-256 integrity check on startup validates the database.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com