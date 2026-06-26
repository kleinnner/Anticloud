---
title: "Search Profiles"
sidebar_position: 99
description: "Personalized search experience with saved results, search history, and result forking. Users can save searches for later reference, fork a search result to start a new exploration path, and view their"
tags: [features]
---

# Search Profiles

## What It Does
Personalized search experience with saved results, search history, and result forking. Users can save searches for later reference, fork a search result to start a new exploration path, and view their search interaction history. Each profile maintains its own saved results and history. Search becomes a stateful exploration tool rather than a stateless query.

## How It Works
The search profile system is implemented in i-oss-gateway/src/search_profile.rs. Each user (or codex) has a search profile stored as nodes and edges in data/graph.db (SQLite WAL).

**Saved results**: When a user saves a search result, a "saved_search" node is created with the query text, result snippet, URL or node ID, and a timestamp. The node is linked to the source result via a "references" edge.

**Search history**: Every search query is recorded as a "search_event" node with the query text, timestamp, result count, and whether the user interacted with the results. Users can view and search their own history.

**Result forking**: When a user forks a search result, the system creates a new exploration branch. The fork creates a new "search_branch" node linked to the original result. Subsequent searches within that branch are linked to the branch node, creating an exploration tree.

The frontend SearchProfileView (React 18 + Vite 5 + Tailwind) shows saved results, recent searches, and forking history. Users can manage their saved results (rename, delete, organize into folders) and view their search history as a timeline.

WebSocket messages on port 3030 handle: get_search_profile (load profile), search_interaction (record interaction), ork_search_result (branch from result), save_search_result (save to profile), get_saved_searches (list saved), delete_saved_search (remove).

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including search saved, search history, search fork.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Perform a search in the Search view.
4. Click the "Save" icon on any result to save it to your profile.
5. Click "Fork" to create a new exploration branch from a result.
6. View your saved results in the Search Profile view.
7. Browse your search history as a timeline � click any past query to re-run it.
8. Use CLI: pi-oss search saved, pi-oss search history, pi-oss search fork --id <uuid>.
9. Use pi-oss search saved --delete --id <uuid> to remove a saved result.

Config in opencode.json:
`json
{
  "search_profile": {
    "save_history": true,
    "max_saved_results": 100,
    "max_history_entries": 500
  }
}
`

## The Moat
- No competitor offers search profiles with result forking in a local-first AI system.
- This turns search from a stateless query into a stateful exploration tool.
- Users build a personal search history that becomes part of their knowledge graph.
- Forked searches create exploration trees that preserve research context.
- Saved results are linked to the knowledge graph, enabling cross-referencing with entities and decisions.

## Why Choose API-OSS
Research-grade search capabilities built into an AI platform. Users who conduct serious research � intelligence analysts, academics, enterprise researchers � can build a personal search archive with branching exploration paths. No other AI system tracks search as a first-class activity with persistence, forking, and graph integration.

## Competitive Comparison
- **OpenAI**: No search profile � stateless search with no history, no saved results, no forking.
- **Google**: Cloud-based search history with limited export, no forking, no local persistence.
- **Anthropic**: No search capability. Claude cannot search the web or internal knowledge.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Search Profiles

## What It Does
Personalized search experience with saved results, search history, and result forking. Users can save searches for later reference, fork a search result to start a new exploration path, and view their search interaction history. Each profile maintains its own saved results and history. Search becomes a stateful exploration tool rather than a stateless query.

## How It Works
The search profile system is implemented in i-oss-gateway/src/search_profile.rs. Each user (or codex) has a search profile stored as nodes and edges in data/graph.db (SQLite WAL).

**Saved results**: When a user saves a search result, a "saved_search" node is created with the query text, result snippet, URL or node ID, and a timestamp. The node is linked to the source result via a "references" edge.

**Search history**: Every search query is recorded as a "search_event" node with the query text, timestamp, result count, and whether the user interacted with the results. Users can view and search their own history.

**Result forking**: When a user forks a search result, the system creates a new exploration branch. The fork creates a new "search_branch" node linked to the original result. Subsequent searches within that branch are linked to the branch node, creating an exploration tree.

The frontend SearchProfileView (React 18 + Vite 5 + Tailwind) shows saved results, recent searches, and forking history. Users can manage their saved results (rename, delete, organize into folders) and view their search history as a timeline.

WebSocket messages on port 3030 handle: get_search_profile (load profile), search_interaction (record interaction), ork_search_result (branch from result), save_search_result (save to profile), get_saved_searches (list saved), delete_saved_search (remove).

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including search saved, search history, search fork.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Perform a search in the Search view.
4. Click the "Save" icon on any result to save it to your profile.
5. Click "Fork" to create a new exploration branch from a result.
6. View your saved results in the Search Profile view.
7. Browse your search history as a timeline � click any past query to re-run it.
8. Use CLI: pi-oss search saved, pi-oss search history, pi-oss search fork --id <uuid>.
9. Use pi-oss search saved --delete --id <uuid> to remove a saved result.

Config in opencode.json:
`json
{
  "search_profile": {
    "save_history": true,
    "max_saved_results": 100,
    "max_history_entries": 500
  }
}
`

## The Moat
- No competitor offers search profiles with result forking in a local-first AI system.
- This turns search from a stateless query into a stateful exploration tool.
- Users build a personal search history that becomes part of their knowledge graph.
- Forked searches create exploration trees that preserve research context.
- Saved results are linked to the knowledge graph, enabling cross-referencing with entities and decisions.

## Why Choose API-OSS
Research-grade search capabilities built into an AI platform. Users who conduct serious research � intelligence analysts, academics, enterprise researchers � can build a personal search archive with branching exploration paths. No other AI system tracks search as a first-class activity with persistence, forking, and graph integration.

## Competitive Comparison
- **OpenAI**: No search profile � stateless search with no history, no saved results, no forking.
- **Google**: Cloud-based search history with limited export, no forking, no local persistence.
- **Anthropic**: No search capability. Claude cannot search the web or internal knowledge.
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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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