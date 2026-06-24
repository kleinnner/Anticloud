---
title: "Data Lineage Tracking"
sidebar_position: 99
description: "End-to-end data provenance for every graph mutation."
tags: [features]
---

# Data Lineage Tracking

## What It Does
End-to-end data provenance for every graph mutation.
Tracks the origin, transformation, and consumption of every data point
— enabling full
impact analysis, audit trails, and regulatory compliance for "right to
explanation"
requirements.
## How It Works
Data lineage is implemented as a first-class directed acyclic graph
(DAG) stored alongside
the data in `ai-oss-gateway/src/lineage.rs`.
Unlike traditional audit logs, lineage is not a flat list of events —
it is a structured
DAG where every node represents a data entity and every edge represents
a transformation.
When a graph mutation occurs (create, update, delete, or decision
output), the Rust engine
records a lineage entry containing: the node ID of the mutation result,
the parent node
IDs (the input data that produced this result), the user who performed
the action, the
rule or council decision that triggered the mutation, and a
nanosecond-precision
timestamp.
The lineage DAG is stored in `data/graph.db` (SQLite WAL) alongside the
primary graph
data, ensuring lineage is always consistent with the data it describes.
Frontend views interact via WebSocket to port 3030 — sending
`lineage_register` to
record events, `lineage_impact` to trace the impact of a specific node
forward through the
DAG, and `lineage_graph` to request the full lineage visualization.
Results are returned via `lineage_registered`, `lineage_impact_result`,
and
`lineage_graph_result` messages.
The HTTP UI on port 8081 renders an interactive `DataLineageView` with
collapsible trees,
impact highlighting, and node inspection.
Impact analysis uses a Rust-native breadth-first traversal of the DAG
— no SQL recursion
required, enabling millisecond-scale impact analysis even on graphs with
millions of
edges.
Lineage graphs can be exported as DOT (for Graphviz visualization), JSON
(for external
audit tools), or as part of the `.aioss` ledger format stored in
`data/ledger/`.
All operations are configured via `opencode.json` and the gateway runs
as a single binary
started by `api-oss start`.
The entire feature works fully air-gapped with no internet — lineage
data never leaves
the instance.
## How to Operate
1.
**Open the DataLineageView** at `https://localhost:8081/lineage` to browse the interactive lineage DAG.
2.
**Select a node** to view its provenance: origin mutation, input data sources, transformation rules, and the user who created it.
3.
**Run impact analysis**: Right-click a node and select "Trace Impact" — the graph highlights all downstream nodes affected by this data point.
The Rust engine traverses the DAG and returns results via WebSocket.
4.
**Export lineage**: Click "Export" to download in DOT, JSON, or flat CSV format for external audit or regulatory submission.
5.
**Register lineage programmatically**: Send `{"type": "lineage_register", "node_id": "...", "parents": ["..."], "user": "...", "rule": "..."}` over WebSocket to port 3030.
6.
**Query via CLI**: `api-oss lineage trace --node <id>` uses the Rust DAG traversal (one of 87 CLI commands across 9 subcommand groups including auth, service, sync, backup, etc.).
7.
**Audit lineage integrity**: The lineage DAG is cryptographically referenced in the immutable ledger at `data/ledger/` — auditors can verify that lineage records match the actual data history.
## The Moat
- **First-class DAG storage, not an audit log**: Lineage is a structured DAG, not a flat event list.
Impact analysis traverses edges in Rust with no SQL recursion —
millisecond-scale even
at enterprise data volumes.
- **Consistency with data: Lineage entries are written atomically with the mutation in `data/graph.db`.
If the mutation commits, lineage exists.
If lineage cannot be written, the mutation is rejected.
There is no inconsistency window.
- **Immutability via ledger**: Every lineage event is also recorded in `data/ledger/` with `.aioss` cryptographic chaining.
Tampering with lineage data is immediately detectable.
- **Air-gapped provenance tracking**: All lineage data is local.
No data leaves the instance — critical for classified and regulated
environments where
data provenance must be verified but data cannot be shared externally.
- **Fine-grained transparency**: For every data point, an operator can see exactly which inputs, rules, and decisions produced it — fulfilling GDPR "right to explanation" requirements.
## Why Choose API-OSS
No competing AI platform provides first-class data lineage.
OpenAI's chat completions return no provenance information — the user
cannot trace why a
specific output was produced.
Palantir Foundry offers lineage as a separate product tier requiring
extensive
configuration and cloud infrastructure.
API-OSS bakes lineage into every graph mutation at zero additional cost
and zero
configuration.
For regulated industries where every AI decision must be explainable and
traceable to its
source data, API-OSS provides the infrastructure that cloud vendors
cannot.
## Competitive Comparison
- **OpenAI**: No data lineage — the platform is a black box.
Outputs cannot be traced to specific inputs or model versions.
- **Palantir**: Lineage via Foundry as a separate product tier, requiring Foundry cloud deployment.
Lineage setup takes weeks of configuration.
- **Snowflake**: Lineage via Snowflake Horizon, cloud-only and limited to SQL queries — no support for AI decision lineage.
- **Anthropic**: No data storage or lineage capabilities.
## Cost-Benefit Analysis
Building data lineage in-house requires: a graph database (Neo4j at
$15k-$60k/year per
instance), a lineage collection pipeline integrated with every data
transformation (3-6
months engineering), and custom audit integration.
Palantir's lineage feature requires a full Foundry enterprise contract
($1M+/yr).
Snowflake's Horizon lineage is included in Enterprise edition ($4k+/mo).
API-OSS provides comprehensive DAG-based lineage at zero additional cost
— it is built
into the graph engine.
Time savings: 3-6 months of engineering eliminated.
Risk reduction: GDPR fines for non-compliance with right-to-explanation
can reach 4% of
global revenue — API-OSS lineage provides the audit trail to
demonstrate compliance.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Mandatory provenance for intelligence data used in targeting decisions — every recommendation must be traceable to its source intelligence reports with full transformation history.
- **Enterprise**: Regulatory compliance (GDPR right to explanation, SOX audit trails, FDA validation for AI-assisted medical decisions).
For financial services, lineage demonstrates that AI-driven trading
decisions are based on
permissible data sources.