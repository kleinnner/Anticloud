---
title: "Document Ingestion (7 Formats)"
sidebar_position: 99
description: "Ingests PDF, XLSX, DOCX, PPTX, CSV, JSON, and HTML files into the knowledge graph. Each file is processed with per-file error handling — one corrupt file does not block the batch. Paragraphs are prese"
tags: [features]
---

# Document Ingestion (7 Formats)

## What It Does
Ingests PDF, XLSX, DOCX, PPTX, CSV, JSON, and HTML files into the knowledge graph. Each file is processed with per-file error handling — one corrupt file does not block the batch. Paragraphs are preserved as individual graph nodes with source document provenance including file name, page number, and paragraph index. A 50MB per-file limit prevents memory exhaustion. Documents are linked to their source file via "sourced_from" edges, enabling full provenance tracking.

## How It Works
The ingestion pipeline lives in `ai-oss-gateway/src/ingest.rs` and `handlers/documents.rs`. When a file is uploaded (via HTTP on port 8081 or CLI), the system determines the MIME type and dispatches to the appropriate parser:

- **PDF** (`pdf-extract` crate): Extracts text with layout preservation. Each page becomes a logical section. Paragraphs are split on double newlines. Embedded images are noted but not extracted.
- **XLSX** (`calamine` crate): Reads cell values row by row. Each worksheet becomes a node, each row becomes a child node with column-value pairs as properties. Formulas are evaluated to their current values.
- **DOCX** (`docx-rs` crate): Parses the XML structure, extracting paragraphs with their styles (heading, normal, list). Headings become parent nodes, paragraphs become children. Tracked changes are resolved.
- **PPTX** (custom XML parsing): Extracts text from each slide. Slides become ordered nodes. Speaker notes are preserved as properties.
- **CSV/JSON** (`serde` crate): CSV rows become nodes with column headers as property keys. JSON objects become nodes with nested objects as child nodes. Arrays become ordered child lists.
- **HTML** (`scraper` crate): Extracts text content from body, preserving heading hierarchy (h1-h6). Links become edge references. Tables are converted to structured data.

Each extracted paragraph is inserted as a graph node in `data/graph.db` (SQLite WAL) with properties: `source_file`, `page_number` (if applicable), `paragraph_index`, `content_hash` (SHA-256 of text), and `codex_id` for multi-tenant isolation. The node is linked via a "sourced_from" edge to a document node representing the original file.

Batch processing uses parallel threads with per-file error isolation. If a PDF is corrupted, it fails individually while the other files in the batch complete. Errors are recorded in the audit ledger at `data/ledger/` in `.aioss` format. The 50MB limit is configurable in `opencode.json`.

The system runs on the single `api-oss` binary. The 3050 Ti GPU auto-detects with backend "cuda" (used for optional OCR enhancement via a lightweight OCR model). CLI has 87 commands across 9 subcommand groups including `ingest file`, `ingest batch`, `ingest status`. Everything works fully offline.

## How to Operate
1. Launch the gateway: `api-oss start` or run the binary directly. SHA-256 integrity check runs on startup.
2. Open `http://localhost:8081` in a browser (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Document Ingestion view.
4. Drag-and-drop files onto the upload zone, or click to select files. Supported: PDF, XLSX, DOCX, PPTX, CSV, JSON, HTML.
5. Click "Ingest" to start processing. Progress bars show per-file status.
6. After ingestion, open the Graph view to see the extracted nodes linked to the source document.
7. Use the Search view to find content from ingested documents via FTS5 full-text search.
8. Use CLI: `api-oss ingest file --path report.pdf`, `api-oss ingest batch --dir ./documents/`.
9. Use `api-oss ingest status` to check progress of running ingestion jobs.

Config in `opencode.json`:
```json
{
  "ingest": {
    "max_file_size_mb": 50,
    "parallel_threads": 4,
    "extract_metadata": true
  }
}
```

## The Moat
- Palantir's format support is limited and focused on structured data — weak document handling.
- Most systems treat documents as opaque blobs. Our ingestion pipeline preserves paragraph-level structure with full provenance.
- Each paragraph links back to its source document in the graph, enabling graph traversal of document content.
- 7 formats supported with zero external API calls — all parsing is local via Rust crates.
- Per-file error isolation means one corrupt PDF does not block ingestion of 100 good documents.
- The 50MB per-file limit can be increased for deployments with sufficient memory.

## Why Choose API-OSS
Document ingestion transforms unstructured files into structured, graph-linked knowledge — the foundation of any serious knowledge management system. No cloud AI provider offers this capability; they expect you to manually copy-paste text. Palantir does document processing but at enterprise licensing costs with limited format support. API-OSS gives you professional-grade document ingestion for free, locally, with full provenance tracking and searchability.

## Competitive Comparison
- **Palantir**: Limited format support focused on structured data — weak document handling, enterprise pricing only.
- **OpenAI**: No document ingestion — manual text copy-paste only. No way to import files into ChatGPT.
- **Anthropic**: No document ingestion. Claude cannot import local files directly.

## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Document ingestion adds zero cost. Cloud document processing services (Amazon Textract, Google Document AI) charge $0.015-$0.05 per page. API-OSS provides unlimited document ingestion for free. Time savings: batch import 1000 files in minutes vs. manual copy-paste for hours. Risk reduction: documents never leave the machine.

## Applications
- **Consumer**: Ingest your personal documents (bank statements, research papers, recipes) into your private knowledge graph.
- **Government / Defense**: Batch-ingest intelligence reports in any format into a classified graph database.
- **Enterprise**: Migrate document archives into searchable, graph-linked knowledge with full provenance.

## Protocol Message Reference
File upload via HTTP multipart POST to `/api/ingest`. Or CLI: binary file path. Backend returns `{"type":"ingest_progress","file":"report.pdf","status":"processing","percent":45}`. On completion: `{"type":"ingest_complete","file":"report.pdf","nodes_created":127,"errors":null}`. On error: `{"type":"ingest_error","file":"corrupt.pdf","error":"Unsupported format or corrupted file"}`.

## CLI Command Reference
`api-oss ingest file --path document.pdf`, `api-oss ingest batch --dir ./docs/ --recursive`, `api-oss ingest status`, `api-oss ingest cancel --job-id <id>`. All commands support `--codex` for scoping to a specific workspace.

## Security Considerations
Files are read locally and never transmitted. The 50MB limit prevents memory exhaustion. SHA-256 content hashes enable deduplication and integrity verification. All ingestion events are recorded in the audit ledger. Path traversal protection prevents ingestion from outside the data directory.

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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
