---
title: "HTML-Scrape Web Search"
sidebar_position: 99
description: "Performs web searches by scraping DuckDuckGo Lite HTML results directly. No API key, no registration, no rate limit dependency, no third-party SDK. The search module can be fully disabled for air-gapp"
tags: [features]
---

# HTML-Scrape Web Search

## What It Does
Performs web searches by scraping DuckDuckGo Lite HTML results directly. No API key, no registration, no rate limit dependency, no third-party SDK. The search module can be fully disabled for air-gapped operation without affecting any other system component. When enabled, it provides real-time web search results that are ingested into the conversation context.

## How It Works
The web search module lives in i-oss-gateway/src/http_client.rs and handlers/web_search.rs. When a search query arrives via WebSocket on port 3030 (web_search message), the system constructs a URL for DuckDuckGo Lite, sends an HTTP GET request using the zero-dependency HTTP client built on raw TcpStream � no eqwest, no hyper, no external HTTP crate. TLS is handled manually. The returned HTML is parsed using a minimal custom HTML selector. Up to 10 results are returned as a JSON array via WebSocket.

The configuration flag search.enabled in opencode.json controls the entire module. When set to alse, the system operates fully offline with zero network calls. A 10-second timeout prevents hanging on slow networks. The search is non-blocking and runs asynchronously.

The system runs on the single pi-oss binary. The HTTP UI is served on port 8081. CLI has 87 commands across 9 subcommand groups including web search <query>. Startup runs a SHA-256 integrity check. Everything works fully offline when search is disabled.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly.
2. Open http://localhost:8081 in a browser (React 18 + Vite 5 + Tailwind frontend).
3. In the Chat view, mention a web search or use the "Web Search" tool.
4. The system sends a web_search message via WebSocket and returns results with titles, snippets, and URLs.
5. Click any result to open it or reference it in conversation.
6. To disable search for air-gapped operation, set search.enabled: false in opencode.json.
7. Test search from CLI: pi-oss web search "latest AI research 2026".
8. The zero-dependency HTTP client handles all networking � no external crate updates needed.

Config in opencode.json:
`json
{
  "search": {
    "enabled": true,
    "provider": "duckduckgo-lite",
    "max_results": 10,
    "timeout_secs": 10
  }
}
`

## The Moat
- Every competitor's search feature depends on a paid API key � OpenAI requires Bing Search API ($7 per 1,000 queries), Google has its own paid API ($5 per 1,000 queries), Anthropic has no search.
- Our approach costs zero dollars and has zero contractual dependencies on any search provider.
- DuckDuckGo Lite's HTML structure is stable and lightweight � no JavaScript rendering needed.
- The zero-dependency HTTP client avoids hundreds of transitive crate dependencies.
- When disabled, the feature has zero impact on binary size or attack surface.

## Why Choose API-OSS
Zero-cost web search integrated into an AI system. Every cloud AI provider that offers web search charges per-query fees or requires a paid API subscription. API-OSS provides web search capability at zero marginal cost. For organizations that need to toggle search on/off depending on deployment environment (online vs. air-gapped), the configuration flag provides instant switching without code changes.

## Competitive Comparison
- **OpenAI**: Requires Bing Search API key �  per 1,000 queries, registration required, rate limits apply.
- **Google**: Uses own paid search API � metered billing,  per 1,000 queries, terms of service restrictions.
- **Anthropic**: No web search capability built into Claude.
- **Nvidia**: No embedded search capability in AI enterprise products.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# HTML-Scrape Web Search

## What It Does
Performs web searches by scraping DuckDuckGo Lite HTML results directly. No API key, no registration, no rate limit dependency, no third-party SDK. The search module can be fully disabled for air-gapped operation without affecting any other system component. When enabled, it provides real-time web search results that are ingested into the conversation context.

## How It Works
The web search module lives in i-oss-gateway/src/http_client.rs and handlers/web_search.rs. When a search query arrives via WebSocket on port 3030 (web_search message), the system constructs a URL for DuckDuckGo Lite, sends an HTTP GET request using the zero-dependency HTTP client built on raw TcpStream � no eqwest, no hyper, no external HTTP crate. TLS is handled manually. The returned HTML is parsed using a minimal custom HTML selector. Up to 10 results are returned as a JSON array via WebSocket.

The configuration flag search.enabled in opencode.json controls the entire module. When set to alse, the system operates fully offline with zero network calls. A 10-second timeout prevents hanging on slow networks. The search is non-blocking and runs asynchronously.

The system runs on the single pi-oss binary. The HTTP UI is served on port 8081. CLI has 87 commands across 9 subcommand groups including web search <query>. Startup runs a SHA-256 integrity check. Everything works fully offline when search is disabled.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly.
2. Open http://localhost:8081 in a browser (React 18 + Vite 5 + Tailwind frontend).
3. In the Chat view, mention a web search or use the "Web Search" tool.
4. The system sends a web_search message via WebSocket and returns results with titles, snippets, and URLs.
5. Click any result to open it or reference it in conversation.
6. To disable search for air-gapped operation, set search.enabled: false in opencode.json.
7. Test search from CLI: pi-oss web search "latest AI research 2026".
8. The zero-dependency HTTP client handles all networking � no external crate updates needed.

Config in opencode.json:
`json
{
  "search": {
    "enabled": true,
    "provider": "duckduckgo-lite",
    "max_results": 10,
    "timeout_secs": 10
  }
}
`

## The Moat
- Every competitor's search feature depends on a paid API key � OpenAI requires Bing Search API ($7 per 1,000 queries), Google has its own paid API ($5 per 1,000 queries), Anthropic has no search.
- Our approach costs zero dollars and has zero contractual dependencies on any search provider.
- DuckDuckGo Lite's HTML structure is stable and lightweight � no JavaScript rendering needed.
- The zero-dependency HTTP client avoids hundreds of transitive crate dependencies.
- When disabled, the feature has zero impact on binary size or attack surface.

## Why Choose API-OSS
Zero-cost web search integrated into an AI system. Every cloud AI provider that offers web search charges per-query fees or requires a paid API subscription. API-OSS provides web search capability at zero marginal cost. For organizations that need to toggle search on/off depending on deployment environment (online vs. air-gapped), the configuration flag provides instant switching without code changes.

## Competitive Comparison
- **OpenAI**: Requires Bing Search API key �  per 1,000 queries, registration required, rate limits apply.
- **Google**: Uses own paid search API � metered billing,  per 1,000 queries, terms of service restrictions.
- **Anthropic**: No web search capability built into Claude.
- **Nvidia**: No embedded search capability in AI enterprise products.
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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
