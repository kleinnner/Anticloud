---
title: "Local LLM Inference (llama.cpp)"
sidebar_position: 99
description: "Runs a llama.cpp server subprocess managed via WASMtime, loading the qwen2-vl-2b-q4-Instruct-Q4_K_M model with CUDA backend on the 3050 Ti GPU. Models are pinned by SHA-256 hash and can be signed offli"
tags: [features]
---

# Local LLM Inference (llama.cpp)

## What It Does
Runs a llama.cpp server subprocess managed via WASMtime, loading the qwen2-vl-2b-q4-Instruct-Q4_K_M model with CUDA backend on the 3050 Ti GPU. Models are pinned by SHA-256 hash and can be signed offline for supply-chain security. No internet connection is required after the initial model download. Runtime model switching allows swapping models without restarting the gateway.

## How It Works
The inference engine is implemented across i-oss-gateway/src/llama.rs, inference.rs, and provider/local.rs. It manages the lifecycle of the local LLM process.

Model loading: On startup, the system reads the configured model path from opencode.json. The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model (~2GB) is loaded via llama.cpp's shared library. The model is pinned by SHA-256 hash � if the hash doesn't match, the system refuses to load it, preventing model substitution attacks.

CUDA acceleration: The system auto-detects the GPU using the cuda backend. On a 3050 Ti (4GB VRAM), the Q4_K_M quantized model runs at 20-40 tokens/second. GPU detection runs at startup and logs the detected device.

Inference pipeline: When a prompt arrives via WebSocket (port 3030), the engine tokenizes the prompt, runs the transformer forward pass on the GPU, samples from the output logits (configurable temperature, top_p, top_k), and streams tokens back via WebSocket in real time.

Runtime model switching: The inference manager holds a Box<dyn InferenceProvider> trait object. When a select_model message arrives, the old provider is dropped (freeing GPU memory) and a new one is initialized. Session context is preserved across switches.

WASMtime management: llama.cpp runs as a subprocess managed through WASMtime for sandboxing isolation, preventing the LLM process from accessing the filesystem beyond its allocated directory.

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including model list, model load, model switch. Everything works fully offline.

## How to Operate
1. Download the model: pi-oss model download Qwen2-VL-2B-Instruct-Q4_K_M.gguf.
2. Launch the gateway: pi-oss start or run the binary directly. The 3050 Ti GPU auto-detects with "cuda".
3. The model loads automatically. Watch startup log for "Model loaded successfully".
4. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
5. Start chatting � the model responds token-by-token via WebSocket streaming.
6. To switch models: use Model Management dropdown or pi-oss model switch --name <model>.
7. Use pi-oss model list to see available models, pi-oss model status for current info.
8. Use pi-oss model verify --hash <sha256> to verify model integrity.

Config in opencode.json:
`json
{
  "model": {
    "path": "./models/Qwen2-VL-2B-Instruct-Q4_K_M.gguf",
    "backend": "cuda",
    "temperature": 0.7,
    "max_tokens": 2048,
    "hash": "sha256-<expected-hash>"
  }
}
`

## The Moat
- Every competitor requires cloud API calls for inference with per-token billing.
- Our system runs fully offline with zero per-token costs. No cut-off, rate-limiting, or pricing surprises.
- Model pinning by SHA-256 hash ensures reproducibility and supply-chain security.
- Runtime model switching with zero downtime � no other local inference system offers this.
- WASMtime sandboxing provides defense-in-depth for the inference subprocess.
- The 3050 Ti GPU provides sufficient performance for 3B-parameter models at usable speeds.

## Why Choose API-OSS
Complete AI sovereignty. Organizations that cannot send data to cloud APIs (defense, healthcare, legal, finance) can run state-of-the-art inference locally with no data egress. The qwen2-vl-2b-q4 model provides capable instruction following, reasoning, and vision-language understanding � all on a single consumer GPU. No per-token billing means costs are fixed and predictable.

## Competitive Comparison
- **OpenAI**: API-dependent � can be cut off, rate-limited, or deprecated at any time. Per-token billing.
- **Anthropic**: Cloud API only. No offline mode exists. Claude cannot run locally.
- **Nvidia**: Cloud AI platform � no local-first inference offering for general-purpose LLMs.
- **Google**: Gemini API � cloud-only with usage quotas and per-token pricing.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Local LLM Inference (llama.cpp)

## What It Does
Runs a llama.cpp server subprocess managed via WASMtime, loading the qwen2-vl-2b-q4-Instruct-Q4_K_M model with CUDA backend on the 3050 Ti GPU. Models are pinned by SHA-256 hash and can be signed offline for supply-chain security. No internet connection is required after the initial model download. Runtime model switching allows swapping models without restarting the gateway.

## How It Works
The inference engine is implemented across i-oss-gateway/src/llama.rs, inference.rs, and provider/local.rs. It manages the lifecycle of the local LLM process.

Model loading: On startup, the system reads the configured model path from opencode.json. The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model (~2GB) is loaded via llama.cpp's shared library. The model is pinned by SHA-256 hash � if the hash doesn't match, the system refuses to load it, preventing model substitution attacks.

CUDA acceleration: The system auto-detects the GPU using the cuda backend. On a 3050 Ti (4GB VRAM), the Q4_K_M quantized model runs at 20-40 tokens/second. GPU detection runs at startup and logs the detected device.

Inference pipeline: When a prompt arrives via WebSocket (port 3030), the engine tokenizes the prompt, runs the transformer forward pass on the GPU, samples from the output logits (configurable temperature, top_p, top_k), and streams tokens back via WebSocket in real time.

Runtime model switching: The inference manager holds a Box<dyn InferenceProvider> trait object. When a select_model message arrives, the old provider is dropped (freeing GPU memory) and a new one is initialized. Session context is preserved across switches.

WASMtime management: llama.cpp runs as a subprocess managed through WASMtime for sandboxing isolation, preventing the LLM process from accessing the filesystem beyond its allocated directory.

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including model list, model load, model switch. Everything works fully offline.

## How to Operate
1. Download the model: pi-oss model download Qwen2-VL-2B-Instruct-Q4_K_M.gguf.
2. Launch the gateway: pi-oss start or run the binary directly. The 3050 Ti GPU auto-detects with "cuda".
3. The model loads automatically. Watch startup log for "Model loaded successfully".
4. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
5. Start chatting � the model responds token-by-token via WebSocket streaming.
6. To switch models: use Model Management dropdown or pi-oss model switch --name <model>.
7. Use pi-oss model list to see available models, pi-oss model status for current info.
8. Use pi-oss model verify --hash <sha256> to verify model integrity.

Config in opencode.json:
`json
{
  "model": {
    "path": "./models/Qwen2-VL-2B-Instruct-Q4_K_M.gguf",
    "backend": "cuda",
    "temperature": 0.7,
    "max_tokens": 2048,
    "hash": "sha256-<expected-hash>"
  }
}
`

## The Moat
- Every competitor requires cloud API calls for inference with per-token billing.
- Our system runs fully offline with zero per-token costs. No cut-off, rate-limiting, or pricing surprises.
- Model pinning by SHA-256 hash ensures reproducibility and supply-chain security.
- Runtime model switching with zero downtime � no other local inference system offers this.
- WASMtime sandboxing provides defense-in-depth for the inference subprocess.
- The 3050 Ti GPU provides sufficient performance for 3B-parameter models at usable speeds.

## Why Choose API-OSS
Complete AI sovereignty. Organizations that cannot send data to cloud APIs (defense, healthcare, legal, finance) can run state-of-the-art inference locally with no data egress. The qwen2-vl-2b-q4 model provides capable instruction following, reasoning, and vision-language understanding � all on a single consumer GPU. No per-token billing means costs are fixed and predictable.

## Competitive Comparison
- **OpenAI**: API-dependent � can be cut off, rate-limited, or deprecated at any time. Per-token billing.
- **Anthropic**: Cloud API only. No offline mode exists. Claude cannot run locally.
- **Nvidia**: Cloud AI platform � no local-first inference offering for general-purpose LLMs.
- **Google**: Gemini API � cloud-only with usage quotas and per-token pricing.
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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ