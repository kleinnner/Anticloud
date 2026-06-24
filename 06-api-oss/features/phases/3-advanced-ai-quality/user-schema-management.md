---
title: "User Schema Management"
sidebar_position: 99
description: "Manages custom schema definitions per tenant for structured data interactions."
tags: [features]
---

# User Schema Management

## What It Does
Manages custom schema definitions per tenant for structured data interactions.
Supports pgwire schema reflection — dynamically discovers and exposes database
schemas for SQL-based model interaction.
Enables tenants to define, version, and enforce structured data contracts for
model input/output without writing validation code.

## How It Works
The gateway starts via `api-oss start` or direct binary execution, loading tenant
configuration from `opencode.json`.
On startup, the `user_schema.rs` Rust module in `ai-oss-gateway/src/` reads
schema definitions from the local ledger stored under `./data/`.

When pgwire schema reflection is enabled, the gateway connects to the configured
PostgreSQL-compatible endpoint and introspects `information_schema` tables.
Column types and constraints are converted into internal schema representations.
Each schema is versioned — every mutation creates a new ledger entry with a
timestamp and previous-hash pointer, forming an immutable audit trail.

Schema enforcement occurs during inference: the gateway intercepts model input
and output, validates against the active schema version, and rejects or coerces
non-compliant data before it reaches the application layer.
The frontend `UserSchemaView` connects via WebSocket to port 3030 and renders
schema definitions in a tree view with type hierarchy, nullable flags, default
values, and foreign-key relationships.

CRUD operations flow over WS messages (`user_schema_create`, `user_schema_list`,
`user_schema_get`) which the Rust handler validates against JSON Schema stored
in the config before committing to the ledger.
Schema reflection runs in a background tokio task that periodically polls the
pgwire endpoint for structural changes, emitting `user_schema_diff` events when
columns are added, removed, or modified.

The HTTP UI served on port 8081 provides a read-only schema browser for
non-interactive inspection.
All schema data is stored in SQLite alongside annotation datasets, using the
same ledger-backed CRUD protocol.

## How to Operate
1. Open the Schema Management view in the frontend UI (navigate to User Schema
   from the dashboard). The view connects automatically via WebSocket to port
   3030.
2. Click "Reflect from Database" to trigger pgwire introspection. Enter the
   database connection string (postgresql://user:pass@host:5432/db). The gateway
   connects, reads `information_schema.columns`, and populates the schema tree.
3. For manual schema creation, click "New Schema" and define fields using the
   type builder (string, integer, float, boolean, array, object with nested
   properties). Each field supports nullability, default values, and regex
   pattern constraints.
4. Save the schema — a `user_schema_create` WS message is dispatched. The Rust
   handler validates and commits the schema to the ledger with a new version
   hash.
5. To inspect schema versions, use the version history panel. Click any version
   to see the diff against the previous version, rendered as a side-by-side
   JSON diff.
6. To enforce a schema during inference, configure `"schema_enforcement": {
   "mode": "reject" | "coerce" }` in `opencode.json`. Schema enforcement blocks
   non-compliant outputs from reaching clients.
7. For CLI usage, run `api-oss schema list`, `api-oss schema get <name>`, or
   `api-oss schema reflect <connection_string>`.

## The Moat
- Schema definitions are stored locally per tenant with full version history in
  the immutable ledger
- Schema reflection from pgwire happens live with no external schema registry
- Custom schemas enable tenant-isolated structured data workflows within a
  single air-gapped deployment
- No cloud schema registry — every schema operation is verified client-side
  with cryptographic integrity
- Enforcement works fully offline with no internet access required
- pgwire reflection avoids manual schema import — the database itself is the
  source of truth
- Version history on every schema prevents accidental overwrites and enables
  rollback
- All schema mutations are traced to a specific operator session via the WS
  connection

## Why Choose API-OSS
A customer chooses API-OSS schema management because it works entirely offline
with no dependency on any cloud schema registry.
Competitors require data to leave premises for schema resolution or enforce
schemas only at the application layer.
API-OSS enforces at the gateway level, ensuring no non-compliant data ever
reaches the model or the client.
The pgwire reflection eliminates manual schema entry — databases are
introspected live.
Full version history with immutable audit trails satisfies compliance
requirements for regulated industries without paying for a separate schema
registry product.

## Competitive Comparison
- **Palantir**: Ontology schema management exists but is cloud-dependent and
  requires Foundry AIP infrastructure. No pgwire live reflection. Schema
  enforcement is tied to Foundry's pipeline system.
- **OpenAI**: No user schema management at all. Structured output is
  prompt-based with no formal schema enforcement.
- **Mercor**: No schema management feature. Annotation data has no formal
  structure enforcement.
- **Anthropic**: No schema management. No structured output guarantees.
- **Nvidia**: No tenant-isolated schema management in NeMo.

## Cost-Benefit Analysis
Cloud competitors charge separately for schema registries and data governance
features.
Palantir's Ontology management is bundled in Foundry licenses at $500K+/year.
API-OSS schema management is free — built into the gateway with no additional
license cost.
pgwire reflection eliminates manual schema entry time: an operator would spend
2-4 hours per schema manually defining types vs. seconds with reflection.
Schema enforcement prevents production incidents from malformed model output —
each incident avoided saves ~4 hours of engineering debugging time.
Mercor has no schema features, requiring teams to build custom validation
middleware. API-OSS eliminates that engineering cost entirely.

## Applications
- **Consumer**: Define custom schemas for personal data organization (structured
  journal entries, expense tracking, bookmark classification) with enforced
  types and validation.
- **Government / Defense**: Per-tenant schema isolation for multi-classification
  environments where each security domain requires different data structures.
  pgwire reflection works in air-gapped facilities against internal databases.
- **Enterprise**: Multi-tenant schema management for SaaS deployment with
  complete data isolation. Schema version history satisfies SOC 2 audit
  requirements for data contract changes.
