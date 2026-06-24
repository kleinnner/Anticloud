---
title: "Knowledge Graph (SQLite + FTS5)"
sidebar_position: 99
description: "A 6-node-type (Entity, Concept, Document, Agent, Decision, Emotion), 7-edge-type graph stored entirely in SQLite with WAL mode. FTS5 porter tokenizer powers full-text search across all node content wi"
tags: [features]
---

# Knowledge Graph (SQLite + FTS5)

## What It Does
A 6-node-type (Entity, Concept, Document, Agent, Decision, Emotion), 7-edge-type graph stored entirely in SQLite with WAL mode. FTS5 porter tokenizer powers full-text search across all node content with a LIKE fallback for partial matches. Every node and edge is queryable via WebSocket. The graph is the central data structure � all features (chat, sessions, search, contradictions, predictions) operate on and contribute to the graph.

## How It Works
The knowledge graph is the core data model, implemented in i-oss-gateway/src/graph.rs, graph_api.rs, and handlers/graph.rs. The graph is stored in a single SQLite file at data/graph.db with WAL (Write-Ahead Logging) mode for concurrent read performance.

Node types (6): Entity (people, organizations, places), Concept (ideas, theories, categories), Document (files, articles, reports), Agent (AI agents, tool instances), Decision (choices made with rationale), Emotion (sentiment results). Edge types (7): relates_to, sourced_from, depends_on, contradicts, leads_to, contains, references.

Each node has: id (UUID), codex_id (tenant isolation), 
ode_type, 
ame, description, properties (JSON), created_at, updated_at. Each edge has: id, source_id, 	arget_id, edge_type, weight, properties, created_at.

Queryable via WebSocket on port 3030: graph_query (pattern matching), graph_get (by ID), graph_neighbors (connected nodes), graph_stats (aggregates), graph_canvas (rendering data), graph_stat_report. An FTS5 virtual table indexes names, descriptions, and properties using the porter tokenizer. The LIKE fallback handles partial matches.

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including graph query, graph stat, graph export. Config in opencode.json drives everything.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Graph view to see all nodes and edges on the Canvas.
4. Click "Add Node" to create � select type (Entity, Concept, Document, Agent, Decision, Emotion).
5. Connect nodes by dragging from one to another � select edge type from the context menu.
6. Search the graph using the search bar � FTS5 full-text search with instant results.
7. Click any node to view its properties, connected edges, and traversal path.
8. Use CLI: pi-oss graph query "Entity(name CONTAINS 'Acme')", pi-oss graph stats.
9. Use pi-oss graph export --format json to export the entire graph.

Config in opencode.json:
`json
{
  "graph": {
    "fts5_tokenizer": "porter",
    "max_query_depth": 5,
    "auto_index": true
  }
}
`

## The Moat
- Palantir's graph database is proprietary, expensive (+/year), and requires server infrastructure.
- Snowflake's graph queries cost per compute credit � each query incurs cost.
- Our graph runs in a single SQLite file with zero operational cost, zero network calls, zero cloud dependency.
- FTS5 search is built into the graph � no separate search index to manage.
- The 6 node types and 7 edge types provide rich expressiveness while remaining simple to understand.
- Everything works fully offline � the graph is completely local with no external dependencies.

## Why Choose API-OSS
The knowledge graph is the central innovation that makes API-OSS more than a chatbot. It turns AI conversations into a structured, queryable, traversable knowledge base. Organizations that need to build and maintain knowledge � research teams, intelligence analysts, enterprise knowledge managers � get a professional graph database integrated with AI inference, search, contradiction detection, and prediction.

## Competitive Comparison
- **Palantir**: Proprietary expensive graph platform with no local-first option. Requires Foundry or Gotham deployment.
- **Snowflake**: Graph queries per-compute-credit cost makes graph exploration expensive at scale.
- **OpenAI**: No knowledge graph � chat history is flat with no structured relationship modeling.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Knowledge Graph (SQLite + FTS5)

## What It Does
A 6-node-type (Entity, Concept, Document, Agent, Decision, Emotion), 7-edge-type graph stored entirely in SQLite with WAL mode. FTS5 porter tokenizer powers full-text search across all node content with a LIKE fallback for partial matches. Every node and edge is queryable via WebSocket. The graph is the central data structure � all features (chat, sessions, search, contradictions, predictions) operate on and contribute to the graph.

## How It Works
The knowledge graph is the core data model, implemented in i-oss-gateway/src/graph.rs, graph_api.rs, and handlers/graph.rs. The graph is stored in a single SQLite file at data/graph.db with WAL (Write-Ahead Logging) mode for concurrent read performance.

Node types (6): Entity (people, organizations, places), Concept (ideas, theories, categories), Document (files, articles, reports), Agent (AI agents, tool instances), Decision (choices made with rationale), Emotion (sentiment results). Edge types (7): relates_to, sourced_from, depends_on, contradicts, leads_to, contains, references.

Each node has: id (UUID), codex_id (tenant isolation), 
ode_type, 
ame, description, properties (JSON), created_at, updated_at. Each edge has: id, source_id, 	arget_id, edge_type, weight, properties, created_at.

Queryable via WebSocket on port 3030: graph_query (pattern matching), graph_get (by ID), graph_neighbors (connected nodes), graph_stats (aggregates), graph_canvas (rendering data), graph_stat_report. An FTS5 virtual table indexes names, descriptions, and properties using the porter tokenizer. The LIKE fallback handles partial matches.

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including graph query, graph stat, graph export. Config in opencode.json drives everything.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Graph view to see all nodes and edges on the Canvas.
4. Click "Add Node" to create � select type (Entity, Concept, Document, Agent, Decision, Emotion).
5. Connect nodes by dragging from one to another � select edge type from the context menu.
6. Search the graph using the search bar � FTS5 full-text search with instant results.
7. Click any node to view its properties, connected edges, and traversal path.
8. Use CLI: pi-oss graph query "Entity(name CONTAINS 'Acme')", pi-oss graph stats.
9. Use pi-oss graph export --format json to export the entire graph.

Config in opencode.json:
`json
{
  "graph": {
    "fts5_tokenizer": "porter",
    "max_query_depth": 5,
    "auto_index": true
  }
}
`

## The Moat
- Palantir's graph database is proprietary, expensive (+/year), and requires server infrastructure.
- Snowflake's graph queries cost per compute credit � each query incurs cost.
- Our graph runs in a single SQLite file with zero operational cost, zero network calls, zero cloud dependency.
- FTS5 search is built into the graph � no separate search index to manage.
- The 6 node types and 7 edge types provide rich expressiveness while remaining simple to understand.
- Everything works fully offline � the graph is completely local with no external dependencies.

## Why Choose API-OSS
The knowledge graph is the central innovation that makes API-OSS more than a chatbot. It turns AI conversations into a structured, queryable, traversable knowledge base. Organizations that need to build and maintain knowledge � research teams, intelligence analysts, enterprise knowledge managers � get a professional graph database integrated with AI inference, search, contradiction detection, and prediction.

## Competitive Comparison
- **Palantir**: Proprietary expensive graph platform with no local-first option. Requires Foundry or Gotham deployment.
- **Snowflake**: Graph queries per-compute-credit cost makes graph exploration expensive at scale.
- **OpenAI**: No knowledge graph � chat history is flat with no structured relationship modeling.
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

