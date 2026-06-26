---
title: "API-SOS — Complete File Inventory"
sidebar_position: 99
description: "Lois-Kleinner, 2026"
tags: [glossary]
---

# API-SOS — Complete File Inventory

*Lois-Kleinner, 2026*

## Codebase

### Rust Backend (`ai-oss-gateway/src/`)

| File | Purpose | Lines |
|------|---------|-------|
| `main.rs` | CLI entry point, 9 subcommands, model downloader (curl on all platforms) | ~2,326 |
| `lib.rs` | Library root | — |
| `config.rs` | Config loader (opencode.json + env overrides) | ~690 |
| `llama.rs` | llama-server subprocess manager (spawn, prompt, SSE streaming, stop) | ~476 |
| `graph.rs` | SQLite knowledge graph + FTS5 search, 6 node types, 7 edge types, codex scoping | ~1,028 |
| `tools.rs` | Tool registry + execution (image gen, voice, finetune, analysis tools) | ~1,773 |
| `ws_server.rs` | WebSocket server (Axum, 19+ bidirectional message types, post-pipeline) | ~5,239 |
| `protocol.rs` | Message type definitions (serde-tagged enums, client + server) | ~824 |
| `ledger.rs` | .aioss hash-chained audit ledger (append, flush, verify, session management) | — |
| `ingest.rs` | Document ingestion (PDF, Excel, DOCX, PPTX, CSV, JSON, HTML) | — |
| `contradiction.rs` | 3-layer contradiction detection (stance, semantic, graph-traversal) | ~577 |
| `council.rs` | Multi-agent council deliberation (Risk, Legal, Strategist + voting) | ~509 |
| `tool_parser.rs` | `<tool_call>` XML parser from model output (with unit tests) | 159 |
| `http_client.rs` | Zero-dependency HTTP client (raw TcpStream, SSE, chunked encoding) | ~442 |
| `sd.rs` | Stable Diffusion subprocess manager (generate, edit, variate) | ~278 |

**Total Rust:** ~15,000+ lines across 95+ source files. Zero compilation errors, zero warnings.

### React Frontend (`frontend/src/`)

| File | Purpose |
|------|---------|
| `main.tsx` | Entry, ErrorBoundary |
| `index.css` | Tailwind + custom CSS, dark mode, cursors, animations |
| `App.tsx` | Shell, view router, global keyboard shortcuts |
| `ws/store.js` | Reactive pub/sub store (25+ state fields, 28+ actions) |
| `ws/useWebSocket.js` | WebSocket client (connect, reconnect, heartbeat, queue, dispatch) |
| `ws/protocol.js` | Outbound message builders |
| `lib/uiStore.js` | UI state (tab, theme, modal, nexus, context menu) |
| `lib/useDraggable.js` | Pointer-event drag-and-drop hook |
| `components/Sidebar.jsx` | Left panel (agents, recents, persona, graph, ledger, connection status) |
| `components/TopTabs.jsx` | Tab navigation (12 views) |
| `components/CognitiveWindow.tsx` | Canvas-based brain map + prediction tree (raw Canvas 2D) |
| `components/CommandNexus.jsx` | Cmd+K command palette |
| `components/CodexPanel.jsx` | Right panel workspace browser |
| `components/LoadingScreen.jsx` | Boot screen with step progress |
| `components/ContextMenu.jsx` | Right-click context menu |
| `components/CustomCursor.jsx` | Custom dot cursor (mix-blend-mode: difference) |
| `components/Modals.jsx` | Modal system (Council, Data, Settings, CodexConfig, LedgerDetail) |
| `components/MessageBubble.jsx` | Chat message renderer (user/ai/system/error) |
| `components/ConfidenceBar.jsx` | Confidence percentage bar |
| `components/ActionButtons.jsx` | Quick-action dropdown |
| `views/CommandView.jsx` | Main chat view |
| `views/ClawTerminal.jsx` | CLAW mode terminal (plan/build/approve workflow) |
| `views/CouncilView.jsx` | Agent council deliberation board (draggable cards) |
| `views/ContextMapView.jsx` | Entity relationship graph (draggable nodes, SVG edges) |
| `views/DataLinksView.jsx` | Tool calls + contradictions + chain dashboard |
| `views/PredictionView.jsx` | Scenario tree (draggable cards) |
| `views/EmotionNexusView.jsx` | Sentiment analysis dashboard |
| `views/OutputStudioView.jsx` | Rich text editor with export |
| `views/MessagesView.jsx` | Agent-scoped conversation tabs |
| `views/PassaporteView.jsx` | Digital twin identity display |
| `views/DocumentsView.jsx` | File browser with fetch/preview/download |
| `views/LedgerView.jsx` | Audit ledger table |

### Binaries & DLLs (`data/bin/`)

| File | Purpose | Status |
|------|---------|--------|
| `llama-server.exe` | llama.cpp inference server | REQUIRED — download from llama.cpp releases |
| `llama.dll` | Core llama.cpp library | Included with llama-server |
| `llama-common.dll` | Shared utilities | Included with llama-server |
| `ggml.dll` | GGML tensor library (CPU) | Included with llama-server |
| `ggml-cuda.dll` | CUDA GPU backend | Included with llama-server (optional) |
| `cublas64_12.dll` | NVIDIA CUDA BLAS | Included with llama-server (optional) |
| `cublasLt64_12.dll` | NVIDIA CUDA BLAS (light) | Included with llama-server (optional) |
| `cudart64_12.dll` | NVIDIA CUDA runtime | Included with llama-server (optional) |
| `libomp140.x86_64.dll` | OpenMP parallel support | Included with llama-server |
| `mtmd.dll` | Multimodal support | Included with llama-server |
| `sd.exe` | **OPTIONAL** — stable-diffusion.cpp binary | Download separately if image gen needed |
| `whisper.exe` | **OPTIONAL** — Whisper speech-to-text | Download separately if voice needed |
| `piper.exe` | **OPTIONAL** — Piper text-to-speech | Download separately if voice needed |
| `llama-finetune.exe` | **OPTIONAL** — Fine-tuning binary | Download separately if finetuning needed |

### Model Files (`data/models/`)

| File | Size | Purpose |
|------|------|---------|
| `Qwen2-VL-2B-Instruct-Q4_K_M.gguf` | ~2 GB | Primary AI model (vision-language, recommended) |
| `mmproj-Qwen2-VL-2B-Instruct-f16.gguf` | ~400 MB | Vision encoder for VL model |
| (Additional models can be downloaded via `api-oss model download`) | | |

---

## Documentation (`docs/`)

| File | Title | Purpose |
|------|-------|---------|
| `04_MODEL_GUIDE.txt` | Model Selection Guide | Quantization, hardware, Qwen2.5 models |
| `05_GATEWAY_GUIDE.txt` | Gateway Architecture | Rust structure, WS protocol, tool flow |
| `06_GRAPH_MODEL.txt` | Knowledge Graph Model | 6 node types, 7 edge types, visualizations |
| `07_AIOSS_FORMAT.txt` | .aioss Ledger Format | SHA-256 hash chain, entry types, verification |
| `08_CONTRADICTION.txt` | Contradiction Detection | 3-layer engine, severity, resolution |
| `09_CLI_REFERENCE.txt` | CLI Reference | All 9 subcommands, environment variables |
| `10_ROADMAP.txt` | Development Roadmap | 7-phase plan to NixOS appliance |
| `12_FUNDING_LIST.md` | Funding Targets | 131 non-dilutive institutions |
| `13_TERMINOLOGY.md` | Terminology Reference | API-SOS glossary, innovations table |
| `14_IMAGE_GENERATION.md` | Image Generation | SD 1.5 GGUF integration, tools, NSIS |

### Pitch & Strategy

| File | Purpose |
|------|---------|
| `PITCH_ONEPAGER.md` | The Anti-Cloud one-pager for SWFs |
| `FOUNDER_STATEMENT.md` | Founder manifesto — 10 bold claims |
| `FEATURES.md` | Full features + uniqueness + comparison matrix |
| `FILES.md` | This file — complete inventory |

### Planned

| File | Purpose |
|------|---------|
| `TAM_SAM_SOM.md` | Market sizing analysis |
| `GOVERNMENT_SALES_PLAN.md` | 50-government sales pipeline |
| `TECHNICAL_SUPERIORITY.md` | Technical moats deep dive |
| `CONSUMER_STRATEGY.md` | Consumer/SMB product strategy |
| `WEB_INTELLIGENCE_PLAN.md` | Search engine + web fetch |
| `TECHNICAL_MOATS.md` | Moat architecture + priorities |
| `15_VOICE_INTEGRATION.md` | Whisper + Piper voice |
| `NSIS_INSTALLER.md` | Installer specification |

---

## Config (`opencode.json`)

```json
{
    "gateway": { "host": "127.0.0.1", "ws_port": 3030, "ui_port": 8081 },
    "model": {
        "mock": false,
        "model_path": "./data/models/Qwen2-VL-2B-Instruct-Q4_K_M.gguf",
        "llama_server_path": "./data/bin/llama-server.exe",
        "backend": "cuda",
        "context_length": 8192,
        "threads": 4,
        "n_gpu_layers": 24
    },
    "user": { "name": "User", "sovereign_name": "Default Workspace", "theme": "dark" },
    "ledger": { "enabled": true, "directory": "./data/ledger", "auto_flush": true },
    "tools": { "sandboxed": true },
    "contradiction_engine": { "enabled": true, "scan_interval_ms": 60000 }
}
```

---

## Startup Scripts (`ai-oss-gateway/`)

| File | Platform | Purpose |
|------|----------|---------|
| `ai-oss.bat` | Windows | Build frontend + launch gateway, opens browser |
| `ai-oss.sh` | Linux/Mac | Launch gateway |

---

## Ledger (`data/ledger/`)

SHA-256 hash-chained audit ledger. Created on first startup. Each session generates one `.aioss` file.

---

*Lois-Kleinner, 2026*

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com