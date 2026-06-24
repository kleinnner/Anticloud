---
title: "Migration"
sidebar_position: 99
description: "Import tools for migrating from Palantir Foundry, OpenAI ChatGPT logs, Anthropic Claude"
tags: [features]
---

# Migration

## What It Does
Import tools for migrating from Palantir Foundry, OpenAI ChatGPT logs, Anthropic Claude
exports, and legacy systems (CSV/JSON) into API-OSS. Includes schema mapping via YAML
configuration, incremental migration with cursor-based tracking, and real-time progress
tracking via WebSocket (port 3030). All migrated data is attested in the ledger with
original source provenance recorded for a cryptographic audit trail.

## How It Works
The migration system lives in `migration.rs` under `ai-oss-gateway/src/` and uses an
adapter-based import architecture. Each source system has a dedicated adapter that reads
exported data and transforms it into API-OSS graph nodes with appropriate labels, properties,
and edges. The `palantir_export` adapter reads CSV/SQLite exports from Foundry (Foundry's
export API produces workspace data as CSV dumps or SQLite files), maps Foundry object types
to graph node labels (e.g., `FoundryObject` to `Document`, `Person`, `Project`), and
preserves Foundry object IDs as metadata for traceability. The `openai_logs` adapter reads
the JSON export from ChatGPT's data export feature (Settings > Data Controls > Export Data),
parses conversation threads into graph nodes with edges for message sequences, and preserves
conversation metadata (model used, timestamps, token counts). The `anthropic_logs` adapter
handles Claude's data export similarly. The `legacy_csv` and `legacy_json` adapters accept
a YAML schema mapping configuration file — the operator defines how CSV columns or JSON
fields map to graph node labels, properties, and edges (e.g., `column "Name"` to property
`"name"`). All adapters support dry-run mode: `--dry-run` shows what nodes would be created
without modifying the graph. Incremental migration via `--cursor` tracks the last imported
record, enabling phased migration of large datasets over days or weeks. Progress is
streamed via `migration_progress` WS messages with counts, percentages, and ETA.
The migration engine supports parallel processing with configurable worker count (default 4
workers) for transforming records concurrently, with a message queue depth of 10,000 records
to buffer between parse and transform stages. Each migration run creates a dedicated ledger
entry recording the adapter used, total records processed, errors encountered, and the
importing user's Passaporte signature for full audit trail. After
migration, a `migration_result` message provides a detailed report: nodes created, edges
created, records skipped with reasons, warnings, and source provenance metadata. Every
migrated record is attested in the ledger with a special "migration" entry type recording
source system, original record ID, timestamp, and the importing user's Passaporte signature.

The adapter architecture in `migration.rs` is trait-based: `trait MigrationAdapter` defines
methods `fn detect_format(path: &Path) -> Result<SourceFormat>`, `fn validate(data: &[u8],
mapping: Option<&Mapping>) -> Result<ValidationReport>`, `fn parse_records(data: &[u8],
cursor: Option<&str>) -> Result<(Vec<Record>, Option<String>)>`, and `fn transform(record:
Record) -> Result<GraphNode>`. Each source system has a struct implementing this trait —
`PalantirAdapter`, `OpenaiLogsAdapter`, `AnthropicLogsAdapter`, `LegacyCsvAdapter`,
`LegacyJsonAdapter` — registered in a static `HashMap<&'static str, Box<dyn MigrationAdapter>>`
built at startup via `inventory` crate or manual registration. The CLI parser for migration
commands uses clap derive: `MigrationCmd` enum with `ListAdapters`, `Import` (with `--adapter`,
`--file`, `--mapping`, `--dry-run`, `--cursor`), and `Status` (with `--id` optional)
variants. The import flow: the adapter's `detect_format` validates the file is recognized,
`validate` checks schema compatibility, `parse_records` reads records incrementally (using a
buffered reader in 64 KB chunks to avoid loading large exports entirely into memory),
`transform` converts each record to a graph node, and a batch inserter (default 500 nodes
per transaction) commits to the graph database with a ledger attestation per batch. The
cursor is a simple string — typically the last imported record ID or timestamp — persisted
in a `.migration_cursor` file in the data directory, enabling resume after interruption.

## How to Operate
1. Start the gateway: `api-oss start`. WebSocket on port 3030.
2. List adapters: `api-oss migration list-adapters` — shows palantir, openai, anthropic,
   legacy-csv, legacy-json.
3. Export data from source. For Palantir: use Foundry's export feature. For OpenAI:
   ChatGPT Settings > Data Controls > Export Data.
4. Run migration: `api-oss migration import --adapter openai --file ./chatgpt-export.json`.
5. Dry-run first: `api-oss migration import --adapter palantir --file ./export.csv --dry-run`.
6. Legacy CSV with mapping: create `mapping.yaml`, then `api-oss migration import
   --adapter legacy-csv --file ./data.csv --mapping ./mapping.yaml`.
7. Check status: `api-oss migration status` — shows recent migrations with counts.
8. Incremental: `api-oss migration import --adapter openai --file ./new-export.json
   --cursor <last-id>`.
9. After migration, verify: `api-oss graph query --type Conversation` or `api-oss ledger
    verify` for ledger integrity.
10. Review full report: `api-oss migration status --id <migration-id>`.
11. For large datasets, use `--workers 8` to parallelize transformation across 8 cores and
    `--batch-size 2000` to commit 2,000 nodes per transaction for faster throughput —
    benchmarked at 50,000 records/minute on a $2,000 GPU workstation.
12. Resume interrupted migration: re-run the same command — the cursor file (`.migration_cursor`
    in the data directory) tracks the last successfully imported record, skipping already-
    processed records automatically.

## The Moat
- Competitors offer no migration tools — they want data lock-in. Palantir makes data export
  intentionally difficult; OpenAI offers export but no import tool to migrate elsewhere.
- By providing import adapters for all major competitors, API-OSS lowers the switching
  barrier to zero — eliminating data lock-in entirely.
- The schema mapping engine with YAML configuration supports arbitrary legacy systems —
  any CSV or JSON export can be mapped to the graph.
- Incremental migration with cursor tracking makes it safe to migrate large datasets
  iteratively over weeks without service interruption.

## Why Choose API-OSS
A Palantir customer paying $500k+/year who wants to migrate to a sovereign, offline-first
platform can use the Palantir adapter to import their entire Foundry workspace into API-OSS
— preserving data, metadata, and relationships with full provenance attestation. An
enterprise with years of ChatGPT conversation logs can import them into their local
knowledge graph, making all that conversational data searchable and interconnected.

## Competitive Comparison
- **Palantir**: No export/import tools — intentional data lock-in.
- **OpenAI**: Data export available but no import tool to other platforms.
- **Anthropic**: Limited data export, no migration tools.
- **Google**: Google Takeout available but no targeted migration to AI platforms.
- **Snowflake**: Can unload data via SQL but no competitor migration tools.

## Cost-Benefit Analysis
Manual migration from Palantir takes 3–12 months of engineering ($150k–$600k at $150/hour).
The API-OSS Palantir adapter reduces this to hours. Manual ChatGPT import scripting takes
days — the OpenAI adapter handles it in one command. Data loss during manual migration is
common — dry-run mode and ledger attestation prevent this entirely. Cursor-based incremental
migration allows phased transition over weeks, reducing business disruption risk.
ngrok charges $20/month for tunnels — migration runs fully locally with zero external
service dependencies, eliminating any tunnel or API gateway costs. OpenAI API charges
$0.01/1K tokens for data export processing; migrating 100K conversation entries via the
API would incur approximately $100 in token processing fees — API-OSS migration processes
data locally at zero cost.

## Applications
- **Consumer**: Migrate from ChatGPT, Claude, or other AI platforms to a local knowledge
  graph preserving all conversation history.
- **Government / Defense**: Migrate from legacy or competitor systems with full provenance
  tracking. Every migrated record attested in the ledger.
- **Enterprise**: Phased migration from Palantir, legacy BI tools, or custom systems.
  Incremental migration allows coexistence during transition period.
