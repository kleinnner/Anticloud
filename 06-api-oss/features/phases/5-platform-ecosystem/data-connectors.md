---
title: "Data Connectors"
sidebar_position: 99
description: "A connector framework for ingesting data from external sources into the API-OSS knowledge"
tags: [features]
---

# Data Connectors

## What It Does
A connector framework for ingesting data from external sources into the API-OSS knowledge
graph. Supports SQL databases (PostgreSQL, MySQL, SQLite), REST APIs, MQTT brokers (via
`rumqttc`), and Kafka streams (via `rdkafka`). Connectors support scheduled sync with
cursor-based incremental updates, transformation via Rhai scripting or WASM plugins, and
a virtual connector abstraction for composing connectors into data pipelines.

## How It Works
The connector system lives in `handlers/connectors.rs` and `virtual_connector.rs` under
`ai-oss-gateway/src/`. The connector registry maintains a list of configured connectors,
each stored as a graph node with connection parameters, credentials (encrypted at rest with
Passaporte-derived keys), schedule configuration, and transformation scripts. When a
connector syncs, the framework opens a connection to the source — SQL connection pool for
databases, HTTP client for REST APIs, MQTT subscriber, Kafka consumer — fetches new data
since the last sync cursor, and normalizes it into typed graph nodes through the virtual
connector abstraction layer. The virtual connector maps source schemas to graph node types:
for SQL databases, each row becomes a node with columns as properties and foreign keys as
edges; for REST APIs, JSON response objects are recursively flattened into nodes with edges
preserving the object hierarchy; for MQTT/Kafka, each message becomes a node with topic
metadata and payload as properties. Transformation pipelines (Rhai script or WASM plugin)
can filter, enrich, or restructure incoming data before it enters the graph — for example,
enriching a customer record by querying another API and merging the results. Connectors
support cursor-based incremental sync using row IDs (auto-increment), timestamps (updated_at
columns), or offset positions (Kafka offsets) to minimize repeated data transfer. The sync
scheduler runs as a tokio task, waking connectors at their configured intervals (cron
expressions or duration strings). Each sync operation writes to the ledger, creating an
auditable record of what was ingested, from which source, and when. All connector config
and credentials are stored in the graph and backed up via `api-oss backup create`. The
entire system works fully offline — connectors pull from local databases and local MQTT
brokers without any internet dependency. The connector runtime supports up to 50 concurrent
sync tasks with configurable worker pool size (default 10). Each connector maintains a
message queue depth of 5,000 records for buffered ingestion, with automatic backpressure
when downstream graph writes lag behind source reads. Reconnection logic uses jittered
exponential backoff (1s, 2s, 4s, ... 60s max) with a health check interval of 30 seconds
for long-polling sources like Kafka and MQTT.

## How to Operate
1. Start the gateway: `api-oss start`. The WebSocket server on port 3030 accepts connector
   commands. The HTTP UI on port 8081 provides the Connectors management view.
2. Create a connector: send WS message `connector_create` with JSON payload specifying
   source type, connection parameters, and schedule. Or use the web UI > Connectors > Add.
3. Test a connector: `connector_test` WS message or click "Test" in UI — the gateway
   attempts to connect to the source and reports status.
4. Trigger an immediate sync: `connector_sync` WS message or click "Sync Now" in UI.
5. List all connectors: `api-oss graph query --type Connector` or `connector_list` WS.
6. Configure transformations: attach a Rhai script or WASM plugin path via
   `connector_create` under `transform.path`. The script receives each row as a map and
   returns the modified map or null to skip.
7. Schedule regular sync: set `schedule.interval` in connector config (e.g., `"5m"`,
   `"1h"`, `"daily@02:00"`).
8. Delete a connector: `connector_delete` WS message or UI delete button.
9. Monitor connector health: Prometheus at port 9000 exposes `connector_sync_duration_ms`,
    `connector_rows_ingested_total`, `connector_errors_total`.
10. All connector config is stored in `opencode.json` under `connectors` at root or gateway
    level for backup and version control.
11. View connector diagnostics: `api-oss doctor --connectors` — shows all configured connectors,
    their current state (idle, syncing, error, disabled), last sync timestamp, rows ingested,
    and error counts.
12. For high-volume ingestion, set `connector.batch_size` (default 500) and
    `connector.worker_count` (default 10) in `opencode.json` to tune throughput against
    source system capacity and available CPU cores.

## The Moat
- Palantir's connector library is extensive but proprietary and cloud-dependent — you cannot
  add or modify connectors without Palantir engineering engagement.
- API-OSS connectors are open-source, community-contributed, and fully offline — no cloud
  dependency for any connector operation.
- The virtual connector abstraction normalizes data from any source into typed graph nodes,
  making all data natively queryable in the graph regardless of origin.
- Transformation via Rhai scripting or WASM sandbox means connectors are safely extensible
  without compromising host system security.

## Why Choose API-OSS
A defense agency needs to ingest data from multiple classified databases, MQTT sensor feeds,
and internal REST APIs — all within an air-gapped facility. API-OSS connectors work entirely
offline, support SQL/MQTT/Kafka/REST, and pipe everything into a queryable knowledge graph
with full ledger audit. An enterprise can centralize data from operational databases,
message queues, and APIs into a single graph without paying per-connector licensing fees or
sending data to a cloud ETL service. A consumer can connect their home MySQL server, MQTT
weather station, and personal APIs into their local knowledge graph.

## Competitive Comparison
- **Palantir**: Extensive connector library but proprietary and cloud-reliant. Adding a new
  connector requires Palantir engineering engagement and contract.
- **Fivetran**: Cloud-only ETL, no local-first option. $0.25/credit row pricing adds up
  quickly for high-volume ingestion. No AI graph target.
- **Airbyte**: Self-hostable but has no AI decision engine integration — data lands in a
  warehouse, not a knowledge graph. Complex infrastructure setup.
- **Kafka Connect**: Connector framework exists but has no graph target, complex operation,
  no transformation pipeline built in.
- **Stitch (Talend)**: Cloud-only ETL, per-row pricing, no local option, no graph target.

## Cost-Benefit Analysis
Fivetran charges $0.25/credit row — ingesting 1M rows/month costs $250/month. Airbyte self-
hosted is free but requires infrastructure management ($100–$500/month for a cloud VM).
Palantir connector licensing is bundled at $500k+/year. API-OSS connectors cost $0 — all
built into the free single binary. A one-time $2,000 workstation replaces a Fivetran/Airbyte
stack costing $3k–$12k/year. The time saved by not writing custom ingestion scripts (days
per connector) is worth $5k–$20k per connector. The virtual connector abstraction means one
configuration pattern works across all source types — no per-vendor connector setup.
OpenAI charges $0.01/1K tokens for embedding-based data ingestion; API-OSS connectors
ingest raw data directly into the graph at zero per-row cost. ngrok charges $20/month for
tunnels to expose webhook-based connectors; API-OSS built-in tunnel is free.

## Applications
- **Consumer**: Connect personal databases (finance, inventory), IoT devices (MQTT sensors),
  and web APIs to your local knowledge graph for unified querying.
- **Government / Defense**: Ingest intelligence from multiple classified databases, sensor
  networks, and internal services — all within air-gapped environments with no cloud
  connectivity.
- **Enterprise**: Centralize data from operational databases (PostgreSQL, MySQL, SQLite),
  message queues (Kafka, MQTT), and internal APIs into the knowledge graph. Eliminate data
  silos without expensive ETL tool licensing.
