---
title: "Prediction Engine"
sidebar_position: 99
description: "Generates scenario-based predictions from the current graph state by branching possible futures. Each prediction explores a different decision path, producing probability-weighted outcomes. Monte Carl"
tags: [features]
---

# Prediction Engine

## What It Does
Generates scenario-based predictions from the current graph state by branching possible futures. Each prediction explores a different decision path, producing probability-weighted outcomes. Monte Carlo style sampling explores the space of possible graph evolutions. Predictions are grounded in actual graph entities and relationships rather than pure LLM hallucination.

## How It Works
The Prediction Engine is implemented in i-oss-gateway/src/handlers/prediction.rs. It operates on the knowledge graph at data/graph.db (SQLite WAL) using a multi-branch simulation approach:

1. **State snapshotting**: The current graph state is captured, including all nodes, edges, and their properties.
2. **Branch creation**: The LLM (Qwen2-VL-2B-Instruct-Q4_K_M.gguf on CUDA) generates N possible future branches (default 5, configurable). Each branch represents a different decision path: "What if we invest?", "What if we delay?", "What if we pursue partnership X?"
3. **Monte Carlo sampling**: For each branch, the system runs M simulation steps (default 10). At each step, the LLM samples possible outcomes weighted by their probability, creating a tree of possible futures.
4. **Probability aggregation**: Outcomes across all branches are aggregated into a probability distribution. The most likely outcome for each branch is surfaced as the primary prediction, with confidence intervals.
5. **Output**: A scenario tree is returned via WebSocket on port 3030, showing each branch with its predicted outcome, probability score, and confidence interval.

The frontend PredictionView (React 18 + Vite 5 + Tailwind) renders the scenario tree as an interactive visualization with probability bars, color-coded outcomes (green/positive, yellow/neutral, red/negative), and expandable details for each node in the tree.

Predictions are rooted in the graph: the LLM receives the current graph state (entities, relationships, decisions) as context, ensuring predictions are grounded in known facts rather than pure hallucination. Each prediction is recorded in the audit ledger.

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including prediction generate, prediction list.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Prediction view.
4. Select a starting node or decision point from the graph.
5. Click "Generate Predictions" � the system creates N branches and runs Monte Carlo simulations.
6. View the scenario tree: each branch shows a predicted outcome with probability and confidence.
7. Click on any prediction node to see its detailed rationale and contributing factors.
8. Use CLI: pi-oss prediction generate --node <uuid>, pi-oss prediction list.

Config in opencode.json:
`json
{
  "prediction": {
    "num_branches": 5,
    "simulation_steps": 10,
    "confidence_threshold": 0.6
  }
}
`

## The Moat
- Palantir's prediction capabilities are proprietary and expensive. Our prediction engine runs locally for free.
- By branching directly from the graph, predictions are grounded in known entities and relationships.
- Monte Carlo-style sampling provides probability-weighted outcomes rather than single-point predictions.
- The scenario tree visualization makes complex predictions comprehensible at a glance.
- All predictions are recorded in the audit ledger for after-action review.
- No competitor offers scenario-based prediction integrated with a local knowledge graph.

## Why Choose API-OSS
Strategic planning with AI-powered scenario analysis. Organizations that need to evaluate decision alternatives � investment strategies, operational courses of action, competitive responses � get a prediction engine that explores the possibility space systematically. Unlike generic LLM predictions that hallucinate freely, our engine grounds predictions in the actual knowledge graph, providing traceable, auditable scenario analysis.

## Competitive Comparison
- **Palantir**: Proprietary prediction tools, expensive (+/year), closed algorithms.
- **OpenAI**: No structured prediction engine � pure generative outputs with no scenario branching.
- **Anthropic**: No prediction capabilities. Claude has no scenario analysis tool.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Prediction Engine

## What It Does
Generates scenario-based predictions from the current graph state by branching possible futures. Each prediction explores a different decision path, producing probability-weighted outcomes. Monte Carlo style sampling explores the space of possible graph evolutions. Predictions are grounded in actual graph entities and relationships rather than pure LLM hallucination.

## How It Works
The Prediction Engine is implemented in i-oss-gateway/src/handlers/prediction.rs. It operates on the knowledge graph at data/graph.db (SQLite WAL) using a multi-branch simulation approach:

1. **State snapshotting**: The current graph state is captured, including all nodes, edges, and their properties.
2. **Branch creation**: The LLM (Qwen2-VL-2B-Instruct-Q4_K_M.gguf on CUDA) generates N possible future branches (default 5, configurable). Each branch represents a different decision path: "What if we invest?", "What if we delay?", "What if we pursue partnership X?"
3. **Monte Carlo sampling**: For each branch, the system runs M simulation steps (default 10). At each step, the LLM samples possible outcomes weighted by their probability, creating a tree of possible futures.
4. **Probability aggregation**: Outcomes across all branches are aggregated into a probability distribution. The most likely outcome for each branch is surfaced as the primary prediction, with confidence intervals.
5. **Output**: A scenario tree is returned via WebSocket on port 3030, showing each branch with its predicted outcome, probability score, and confidence interval.

The frontend PredictionView (React 18 + Vite 5 + Tailwind) renders the scenario tree as an interactive visualization with probability bars, color-coded outcomes (green/positive, yellow/neutral, red/negative), and expandable details for each node in the tree.

Predictions are rooted in the graph: the LLM receives the current graph state (entities, relationships, decisions) as context, ensuring predictions are grounded in known facts rather than pure hallucination. Each prediction is recorded in the audit ledger.

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including prediction generate, prediction list.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Prediction view.
4. Select a starting node or decision point from the graph.
5. Click "Generate Predictions" � the system creates N branches and runs Monte Carlo simulations.
6. View the scenario tree: each branch shows a predicted outcome with probability and confidence.
7. Click on any prediction node to see its detailed rationale and contributing factors.
8. Use CLI: pi-oss prediction generate --node <uuid>, pi-oss prediction list.

Config in opencode.json:
`json
{
  "prediction": {
    "num_branches": 5,
    "simulation_steps": 10,
    "confidence_threshold": 0.6
  }
}
`

## The Moat
- Palantir's prediction capabilities are proprietary and expensive. Our prediction engine runs locally for free.
- By branching directly from the graph, predictions are grounded in known entities and relationships.
- Monte Carlo-style sampling provides probability-weighted outcomes rather than single-point predictions.
- The scenario tree visualization makes complex predictions comprehensible at a glance.
- All predictions are recorded in the audit ledger for after-action review.
- No competitor offers scenario-based prediction integrated with a local knowledge graph.

## Why Choose API-OSS
Strategic planning with AI-powered scenario analysis. Organizations that need to evaluate decision alternatives � investment strategies, operational courses of action, competitive responses � get a prediction engine that explores the possibility space systematically. Unlike generic LLM predictions that hallucinate freely, our engine grounds predictions in the actual knowledge graph, providing traceable, auditable scenario analysis.

## Competitive Comparison
- **Palantir**: Proprietary prediction tools, expensive (+/year), closed algorithms.
- **OpenAI**: No structured prediction engine � pure generative outputs with no scenario branching.
- **Anthropic**: No prediction capabilities. Claude has no scenario analysis tool.
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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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
