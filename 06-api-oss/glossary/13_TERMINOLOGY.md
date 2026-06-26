---
title: "API-SOS Terminology Reference — The Anti-Cloud Stack"
sidebar_position: 99
description: "*Formal name:** API-SOS — Agent-Predictive Intelligence Sovereign Operating System"
tags: [glossary]
---

# API-SOS Terminology Reference — The Anti-Cloud Stack

**Formal name:** API-SOS — Agent-Predictive Intelligence Sovereign Operating System
**Pitch concept:** The Anti-Cloud
**Author:** Lois-Kleinner, 2026

---

## Core Concepts

### API-SOS (Agent-Predictive Intelligence Sovereign Operating System)
The formal patent name for the sovereign AI decision infrastructure. An operating system for intelligence that is agent-driven, predictive by design, and sovereign by architecture. Not a chatbot. Not a SaaS product. A decision infrastructure that operates without any dependency on foreign cloud providers.

### The Anti-Cloud
Pitch concept name for API-SOS. The first AI infrastructure that can't be turned off, audited, or restricted by any foreign government. Zero cloud dependency. Zero third-party API calls. Zero data leakage. Runs on any hardware, no internet required.

### Sovereign AI
Artificial intelligence that runs on infrastructure owned and controlled by the user's jurisdiction. No data leaves the sovereign boundary. No foreign government can compel access. No third-party cloud provider can shut it down. This is distinct from "AI sovereignty" as a policy goal — API-SOS is a working implementation.

### Local-First
The system operates entirely on local hardware. Inference, storage, graph operations, audit logging — all run on-premises. The system does not require internet access for any core function. Updates and model swaps are file-copy operations, not API migrations.

### Zero-Trust AI
An AI architecture where no external component is trusted by default. The .aioss ledger provides cryptographic verification of every decision. Tool execution is sandboxed. Model output is parsed and validated. The system assumes no network, no cloud, no third-party reliability.

---

## Architecture

### Gateway
The Rust-based WebSocket server (`ws_server.rs`, 1,573 lines). Routes client messages to the appropriate handler (prompt, tool execution, graph operations, ledger, council, contradiction scan). Serves the React frontend as static files. Configurable port (default 3030) with auto-increment fallback.

### Llama.cpp Inference Engine
Local LLM inference via `llama-server.exe` (not LlamaFile — the config path `llamafile.exe` is a legacy reference; the actual binary is `llama-server.exe` from the llama.cpp ecosystem). Communicates via HTTP REST API on a local port. Supports CUDA GPU acceleration. Models are GGUF quantized files.

### WebSocket Protocol
Bidirectional JSON message protocol over WebSocket. 19 client message types (prompt, stop, graph_*, tool_result, heartbeat, config_get, ledger_tail, council, contradiction_*, approve_tools, generate_passaporte, create_agent, list_agents, create/list/delete/switch codex, extract_knowledge). 19 corresponding server message types. All messages are serde-tagged Rust enums.

### Normal Mode (Chat)
Standard interaction mode. User sends a prompt. The model generates a response, streaming tokens in real-time. Tool calls are detected via `<tool_call>` XML tags, executed automatically, and results are fed back to the model for continuation. The response is finalized and the post-pipeline runs.

### CLAW Mode (Plan/Build)
Constrained agent workflow mode. Named CLAW (C-autious L-ayered A-utonomous W-orkflow). The model generates tool call plans, but each tool call requires explicit user approval before execution. Includes Plan phase (model proposes steps) and Build phase (user approves each step). 120-second timeout on approval requests.

### Post-Pipeline
Automatic processes that run after every prompt completes: knowledge extraction (AI scans the response for entities/concepts/relationships to add to the graph), council deliberation (multi-agent analysis), contradiction scan (3-layer detection), and graph canvas update (sends updated graph data to the frontend).

---

## Data Layer

### Knowledge Graph
SQLite database (`graph.db`) with WAL journal mode. Three core tables: `nodes` (UUID, type, label, content, stance, sentiment, metadata, codex_id, created_at), `edges` (UUID, source_id, target_id, type, weight, metadata, created_at), `codexes` (UUID, name, description, created_at). FTS5 virtual table `nodes_fts` for full-text search on node labels and content.

### .aioss Ledger
Append-only audit ledger stored as JSON files (`{session_id}_{timestamp}.aioss`) in `data/ledger/`. Each entry contains: index, timestamp, type (system/user_message/ai_message/tool_call/graph_mutation/contradiction/decision), actor, actor_label, content (arbitrary JSON), SHA-256 hash, and parent_hash (previous entry's hash). The hash chain makes tampering detectable — re-computing all hashes and comparing them to stored hashes reveals any modification. The core differentiator for regulated institutions.

### Codex
Workspace scoping mechanism. Each codex has its own graph namespace. Nodes and edges are tagged with `codex_id`. Codexes can be created, listed, deleted, and switched at runtime. Enables multi-tenant or multi-project graph isolation within a single database.

### Passaporte (Digital Twin)
Digital identity representation of the user within the system. Contains avatar, name, title, tags, summary, statistics. Generated via AI analysis of user interactions. Includes GDPR compliance metadata. Exportable as a "digital passport" for the user's AI twin.

---

## AI Engine

### GGUF (GPT-Generated Unified Format)
Quantized model format used by llama.cpp. API-SOS uses Qwen2.5 models in GGUF format. Quantization levels (Q2 through Q8) trade precision for size. Q4_K_M is the recommended balance (quality/speed/file size). Q3_K_S is the lightweight tool-calling option (~1.5GB).

### Qwen2.5 (1.5B / 3B / 7B)
The Qwen2.5 family of models from Alibaba Cloud. Chosen for: native `<tool_call>` XML output format (no fine-tuning needed for tool calling), strong function-calling performance, Apache 2.0 license, and availability in GGUF quantization. 7B Q4_K_M is the primary model (~4.3GB, best quality). 3B Q3_K_S is the lightweight option (~1.5GB, ~90% tool-calling reliability).

### Tool System
11 registered tools that the AI can invoke: `graph_search`, `graph_get_node`, `graph_add_node`, `graph_add_edge`, `graph_neighbors`, `graph_stats`, `ledger_append`, `file_read`, `file_write`, `bash`, `web_search`. Each tool has a name, description, and JSON schema for arguments. Tools are sandboxed (path traversal blocked, command blocklist, file operation boundaries).

### Tool Call XML (`<tool_call>`)
The model outputs tool calls as XML tags in its response: `<tool_call>{"name": "tool_name", "arguments": {...}}</tool_call>`. The tool parser (`tool_parser.rs`) extracts these tags, validates the JSON, and routes to the appropriate tool handler. Qwen models output this format natively — no fine-tuning required.

### Council Engine
Multi-agent deliberation system. Three hardcoded agents: Risk Analyst (identifies risks in responses/decisions), Legal Counsel (evaluates compliance and regulatory alignment), Strategist (assesses strategic fit and long-term implications). Each agent receives the same context and produces a structured vote (pro/con/neutral with reasoning). Results are aggregated and stored in the graph as Decision nodes.

### Contradiction Engine
Three-layer contradiction detection:

| Layer | Method | Strength |
|-------|--------|----------|
| 1 — Stance-based | Entities with opposing stances (Pro/Con) on the same concept | High |
| 2 — Semantic | Keyword pair matching (capped/unlimited, pro/con, allow/prohibit, etc.) | Medium |
| 3 — Inferred | Graph chain traversal from existing contradictions | Low (weak) |

Results are stored as `CONTRADICTS` edges in the graph with severity scores. Resolution creates `RESOLVED_*` edges. Scan runs automatically in the post-pipeline and on demand via WebSocket message.

---

## Graph Model

### Node Types (6 + 1)

| Type | Purpose | Example |
|------|---------|---------|
| Entity | Person, organization, country | "Central Bank of UAE" |
| Concept | Abstract idea, principle, policy | "Monetary Policy 2026" |
| Document | Ingested file content | "CBUAE Annual Report.pdf" |
| Agent | AI or human agent representation | "Risk Analyst" |
| Decision | Council deliberation outcome | "Approve: low risk" |
| Evidence | Supporting data or citation | "GDPR Article 17" |
| Contradiction | Detected conflict record | "Pro vs Con on liability caps" |

### Edge Types (7)

| Type | Meaning | Weight Range |
|------|---------|-------------|
| Supports | Node A supports Node B | 0.0 - 1.0 |
| Contradicts | Node A contradicts Node B | 0.0 - 1.0 (severity) |
| References | Node A references Node B | 0.0 - 1.0 |
| BelongsTo | Node A belongs to Node B | 1.0 (fixed) |
| EscalatesTo | Node A escalates to Node B | 0.0 - 1.0 |
| RespondsTo | Node A responds to Node B | 0.0 - 1.0 |
| Precedes | Node A precedes Node B | 0.0 - 1.0 |

---

## File Formats

### .aioss
The audit ledger file format. JSON array of hash-chained entries. Each entry chains to the previous via SHA-256 hash. Format: `{session_short_id}_{timestamp}.aioss`. Stored in `data/ledger/`. Verifiable via `ai-oss ledger verify` command.

### .gguf
GPT-Generated Unified Format. Quantized neural network model format used by llama.cpp. API-SOS supports Q2 through Q8 quantization levels. Models stored in `data/models/`.

### graph.db
SQLite database with WAL journal mode. Contains the knowledge graph (nodes, edges, codexes tables) and FTS5 full-text search index. Stored in `data/` with `.db-wal` and `.db-shm` journal files.

### opencode.json
Configuration file for the API-SOS gateway. JSON format with sections: gateway (host, port, ui_port), model (path, backend, context_length, gpu_layers), user (name, sovereign_name, theme), ledger (enabled, directory, auto_flush), tools (sandboxed), contradiction_engine (enabled, scan_interval).

---

## Documentation Inventory

| Doc | Summary |
|-----|---------|
| `04_MODEL_GUIDE.txt` | Model selection, quantization levels, hardware requirements, inference engine |
| `05_GATEWAY_GUIDE.txt` | Rust architecture, project structure, WebSocket protocol, tool execution flow |
| `06_GRAPH_MODEL.txt` | Knowledge graph data model, node/edge types, visualizations, semantic search |
| `07_AIOSS_FORMAT.txt` | Audit ledger format specification, hash chaining, entry types |
| `08_CONTRADICTION.txt` | 3-layer contradiction detection, severity, resolution workflow |
| `09_CLI_REFERENCE.txt` | Full CLI commands: init, start, query, ingest, graph, ledger, config, model, doctor |
| `10_ROADMAP.txt` | 7-phase development roadmap from MVP to NixOS sovereign OS |
| `12_FUNDING_LIST.md` | 131 non-dilutive funding targets across 7 categories |
| `PITCH_ONEPAGER.md` | The Anti-Cloud pitch document for SWFs, G42, Mubadala, ICD, DESC, Temasek, PIF |

---

## Funding Terminology

### MBRIF (Draft — not yet submitted)
Mohammed Bin Rashid Innovation Fund. UAE government innovation fund. Offers up to $2M in innovation loans for UAE-based technology companies. Government validation that unlocks all subsequent funding.

### Non-Dilutive Funding
Capital that does not require giving up equity. Includes grants (UAE ICT Fund, EU Horizon Europe, EIC Accelerator), development bank loans (IsDB, EBRD, World Bank), family office patient capital, and government innovation funds. API-SOS targets ~92% non-dilutive funding.

### SWF (Sovereign Wealth Fund)
State-owned investment fund that invests in national strategic assets. Key targets: Mubadala ($300B), ADIA ($1T), ICD ($100B), PIF ($700B), Temasek ($300B), Norges Bank ($1.6T). These institutions buy strategic capability, not startup equity.

### DFI (Development Finance Institution)
Government-backed financial institution that provides financing for development projects. Key targets: IsDB, EBRD, IFC, World Bank, Asian Development Bank. Provide concessional loans and grants for digital infrastructure.

### Patient Capital
Long-term investment that does not expect quick returns. SWFs and family offices are patient capital sources. They think in decades, not quarters. API-SOS's sovereign AI thesis aligns with this time horizon — infrastructure assets appreciate over decades, not venture timelines.

---

## Innovations

### Patent: API-SOS — Agent-Predictive Intelligence Sovereign Operating System

| Innovation | Description | Novelty |
|------------|-------------|---------|
| **Hash-chained audit ledger** (.aioss) | Every AI decision, tool call, and graph mutation is SHA-256 hash-chained. Tampering is cryptographically detectable. | First AI system with blockchain-grade audit trail built into the architecture, not bolted on. |
| **Local-first sovereign inference** | Entire AI stack runs on local hardware. Zero cloud dependency. Zero third-party API calls. Cannot be shut down by any foreign government. | No other AI platform offers this. OpenAI/Anthropic/Google require cloud. Harvey is SaaS. API-SOS runs in a bunker. |
| **3-layer contradiction detection** | Stance-based, semantic, and inferred graph traversal. Automated detection of conflicting information across documents, decisions, and agents. | First system to combine graph structure, semantic analysis, and inference chain traversal for contradiction detection in AI outputs. |
| **Multi-agent council with graph memory** | Risk/Legal/Strategy agents deliberate on every decision. Results are stored as Decision nodes in the knowledge graph with full traceability. | Agents share a persistent, queryable graph memory — not ephemeral context windows. Decisions accumulate over time. |
| **Codex-scoped knowledge graphs** | Workspace isolation within a single graph database. Each codex has its own node/edge namespace. | Enables multi-tenant deployment without separate database instances. Critical for SWFs managing multiple portfolio entities. |
| **The .aioss format** | Standardized JSON format for AI audit trails with mandatory hash chaining. Self-verifying, self-describing, portable. | First attempt at a standardized format for AI decision audit trails. Comparable to what blockchain did for financial transactions. |
| **CLAW workflow (Plan/Build mode)** | Constrained agent workflow where the AI proposes tool calls and the user approves each step. Safety-first autonomous execution. | Novel approach to AI safety: not "stop all tool calls" or "auto-execute all" — but a structured approval workflow with timeouts. |

---

**API-SOS — Agent-Predictive Intelligence Sovereign Operating System**
**The Anti-Cloud**

*Written by Lois-Kleinner, 2026*

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)

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
