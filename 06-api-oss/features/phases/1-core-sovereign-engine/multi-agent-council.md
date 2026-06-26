---
title: "Multi-Agent Council"
sidebar_position: 99
description: "Three specialized agents (Risk, Legal, Strategist) deliberate on every decision output before it is final. Each agent issues a vote (Approve, Reject, or Abstain with rationale), and the system records"
tags: [features]
---

# Multi-Agent Council

## What It Does
Three specialized agents (Risk, Legal, Strategist) deliberate on every decision output before it is final. Each agent issues a vote (Approve, Reject, or Abstain with rationale), and the system records dissenting opinions in the audit ledger. Persistent graph memory carries deliberation history between sessions. The council ensures no significant decision is made without adversarial review from multiple perspectives.

## How It Works
The council system is implemented in i-oss-gateway/src/council.rs and handlers/council.rs. When a decision is proposed (e.g., a tool execution or a strategic recommendation), the system invokes three specialized agent instances, each with a distinct system prompt and evaluation criteria:

**Risk Agent**: Evaluates the decision for downside risk, financial exposure, safety concerns, and worst-case outcomes. Its prompt includes a risk taxonomy (financial, operational, reputational, safety) and a standard risk assessment framework.

**Legal Agent**: Evaluates for regulatory compliance, contractual obligations, liability exposure, and jurisdictional issues. Its prompt includes regulatory frameworks (GDPR, SOX, HIPAA) and checks against policy constraints.

**Strategist Agent**: Evaluates for alignment with stated goals, competitive positioning, long-term consequences, and opportunity costs. Its prompt includes the system's stated objectives and strategic planning principles.

Each agent generates a vote (Approve/Reject/Abstain) with a written rationale. The council result includes the majority verdict (if two or more agree), any dissenting opinions, and a summary. The entire deliberation � including each agent's vote, rationale, and the final verdict � is recorded in the SHA-256 hash-chained audit ledger at data/ledger/ in .aioss format.

Persistent graph memory: each agent's deliberation history is stored as nodes in data/graph.db (SQLite WAL), linked by edges to the relevant decision and session. This means agents can reference past deliberations in new evaluations.

The frontend CouncilView (React 18 + Vite 5 + Tailwind) shows each agent's vote, rationale, and the overall verdict in a clean card layout. The system runs on the single pi-oss binary. HTTP UI on port 8081. WebSocket on port 3030 carries council and council_result messages.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. When a decision is proposed, the Council view opens automatically showing each agent's deliberation.
4. Review each agent's vote and rationale. The majority verdict is highlighted.
5. View dissenting opinions � these are recorded permanently in the ledger.
6. Click "Accept" to proceed with the council's recommendation or "Override" to make your own decision.
7. Override reasons are also recorded in the ledger for audit.
8. Use CLI: pi-oss council history to view past deliberations, pi-oss council status for pending items.

Config in opencode.json:
`json
{
  "council": {
    "enabled": true,
    "agents": ["risk", "legal", "strategist"],
    "quorum": 2,
    "record_dissents": true
  }
}
`

## The Moat
- No competitor runs a multi-agent voting protocol on-device with persistent memory.
- Most systems generate a single output with no checks.
- Our council forces adversarial review of every decision, surfacing blind spots that a single model cannot catch.
- Persistent graph memory means agents build institutional knowledge across sessions.
- Every deliberation is cryptographically anchored in the hash-chained audit ledger.

## Why Choose API-OSS
The Multi-Agent Council provides institutional-grade checks on AI decisions that no other product offers. For regulated industries (finance, healthcare, defense), the council provides auditable evidence that decisions were reviewed from multiple perspectives before execution. The persistent memory means agents learn from past deliberations, becoming more effective over time.

## Competitive Comparison
- **OpenAI**: No deliberation mechanism � single-shot stateless responses only. No multi-perspective review.
- **Anthropic**: Constitution-based training but no runtime agent council or voting protocol.
- **Palantir**: AIP has no multi-agent deliberation or voting mechanism for decisions.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Multi-Agent Council

## What It Does
Three specialized agents (Risk, Legal, Strategist) deliberate on every decision output before it is final. Each agent issues a vote (Approve, Reject, or Abstain with rationale), and the system records dissenting opinions in the audit ledger. Persistent graph memory carries deliberation history between sessions. The council ensures no significant decision is made without adversarial review from multiple perspectives.

## How It Works
The council system is implemented in i-oss-gateway/src/council.rs and handlers/council.rs. When a decision is proposed (e.g., a tool execution or a strategic recommendation), the system invokes three specialized agent instances, each with a distinct system prompt and evaluation criteria:

**Risk Agent**: Evaluates the decision for downside risk, financial exposure, safety concerns, and worst-case outcomes. Its prompt includes a risk taxonomy (financial, operational, reputational, safety) and a standard risk assessment framework.

**Legal Agent**: Evaluates for regulatory compliance, contractual obligations, liability exposure, and jurisdictional issues. Its prompt includes regulatory frameworks (GDPR, SOX, HIPAA) and checks against policy constraints.

**Strategist Agent**: Evaluates for alignment with stated goals, competitive positioning, long-term consequences, and opportunity costs. Its prompt includes the system's stated objectives and strategic planning principles.

Each agent generates a vote (Approve/Reject/Abstain) with a written rationale. The council result includes the majority verdict (if two or more agree), any dissenting opinions, and a summary. The entire deliberation � including each agent's vote, rationale, and the final verdict � is recorded in the SHA-256 hash-chained audit ledger at data/ledger/ in .aioss format.

Persistent graph memory: each agent's deliberation history is stored as nodes in data/graph.db (SQLite WAL), linked by edges to the relevant decision and session. This means agents can reference past deliberations in new evaluations.

The frontend CouncilView (React 18 + Vite 5 + Tailwind) shows each agent's vote, rationale, and the overall verdict in a clean card layout. The system runs on the single pi-oss binary. HTTP UI on port 8081. WebSocket on port 3030 carries council and council_result messages.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. When a decision is proposed, the Council view opens automatically showing each agent's deliberation.
4. Review each agent's vote and rationale. The majority verdict is highlighted.
5. View dissenting opinions � these are recorded permanently in the ledger.
6. Click "Accept" to proceed with the council's recommendation or "Override" to make your own decision.
7. Override reasons are also recorded in the ledger for audit.
8. Use CLI: pi-oss council history to view past deliberations, pi-oss council status for pending items.

Config in opencode.json:
`json
{
  "council": {
    "enabled": true,
    "agents": ["risk", "legal", "strategist"],
    "quorum": 2,
    "record_dissents": true
  }
}
`

## The Moat
- No competitor runs a multi-agent voting protocol on-device with persistent memory.
- Most systems generate a single output with no checks.
- Our council forces adversarial review of every decision, surfacing blind spots that a single model cannot catch.
- Persistent graph memory means agents build institutional knowledge across sessions.
- Every deliberation is cryptographically anchored in the hash-chained audit ledger.

## Why Choose API-OSS
The Multi-Agent Council provides institutional-grade checks on AI decisions that no other product offers. For regulated industries (finance, healthcare, defense), the council provides auditable evidence that decisions were reviewed from multiple perspectives before execution. The persistent memory means agents learn from past deliberations, becoming more effective over time.

## Competitive Comparison
- **OpenAI**: No deliberation mechanism � single-shot stateless responses only. No multi-perspective review.
- **Anthropic**: Constitution-based training but no runtime agent council or voting protocol.
- **Palantir**: AIP has no multi-agent deliberation or voting mechanism for decisions.
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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781885
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/06-api-oss
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/api-oss-fixed
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