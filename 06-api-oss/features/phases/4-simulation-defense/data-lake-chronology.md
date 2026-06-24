---
title: "Data Lake / Chronology"
sidebar_position: 99
description: "Raw data storage with temporal versioning and bucket-based"
tags: [features]
---

# Data Lake / Chronology

## What It Does
Raw data storage with temporal versioning and bucket-based
organization.
Provides contradiction scanning across the entire data lake —
automatically
identifying conflicting facts from different sources. Every data
item is a
versioned, provenance-tracked graph node.

## How It Works
The data lake module in `ai-oss-gateway/src/data_lake.rs` implements
a
bucket-based storage system on top of the SQLite WAL-backed
knowledge graph.
Data is organized into logical buckets (configurable in
`opencode.json`
under `data_lake.buckets`) that can represent sources, categories,
classifications, or ingestion pipelines. Each data item ingested
into a
bucket becomes a graph node with the raw payload stored as a
property and
temporal fields (ingestion time, source timestamp, received time)
for
chronology. The temporal versioning engine tracks every version of
each data
item — when new data arrives for an existing entity, the old
version is
preserved with a validity interval. The contradiction scanner runs
across
all buckets, comparing new data against existing facts.
Contradictions are
identified by comparing entity relationships, property values, and
timestamps — two sources claiming different values for the same
property at
overlapping times triggers a contradiction alert with confidence
scores for
each source. The DataLakeView on the HTTP UI at port 8081 provides
bucket
management, chronology browsing, and contradiction review
interfaces. The
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can analyze
contradiction
patterns and suggest source reliability scores. Frontend connects
via
WebSocket to port 3030. All data is stored in `./data/`. Config
controls
retention policies, bucket schemas, and contradiction thresholds.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the DataLakeView in the browser at port 8081
3. Create buckets via `data_lake_bucket_create` WebSocket message or UI
4. Configure bucket schemas in `opencode.json` under `data_lake.buckets`
5. Ingest data into buckets via `data_lake_chronology` WS message, file
   drop, or API
6. Browse chronology view to see temporal evolution of data
7. Review contradictions flagged by the scanner — view conflicting sources
   and confidence scores
8. Resolve contradictions by accepting one source or flagging for manual
   review
9. Export bucket contents as graph snapshots to `./data/`
10. Use the CLI: `api-oss data-lake list`, `api-oss data-lake ingest`,
    `api-oss data-lake contradictions`

## The Moat
- A data lake that is fully local, temporally versioned, and includes
  automated contradiction detection requires a fundamentally
different
  architecture than cloud data lakes
- Contradiction scanning across all data with confidence scoring is a novel
  capability — no competitor offers this for graph data
- Bucket-based organization combined with graph-native storage means data is
  immediately queryable and linkable
- Temporal versioning preserves every historical state without storage
  multiplication
- Fully offline operation means the data lake works in disconnected
  environments
- Each data item has full provenance — source, ingestion time, transformations
  applied

## Why Choose API-OSS
Palantir Foundry has a data lake but it is cloud-dependent,
expensive
($3M+/yr), and lacks contradiction scanning. Google and Anthropic
have no
equivalent product. API-OSS provides a fully local, temporally
versioned
data lake with automated contradiction detection — enabling
intelligence
analysts to confidently reconcile data from multiple sources without
cloud
dependency.

## Competitive Comparison
- **Palantir**: Foundry has data lake but is cloud-dependent; no
  contradiction scanning; $3M+/yr
- **Google**: No equivalent product
- **Anthropic**: No data lake product
- **Nvidia**: No data lake product

## Cost-Benefit Analysis
Cloud data lakes (AWS S3 + Athena, Google BigLake) cost
$10K–$100K/month in
storage and query costs plus data egress fees. Palantir Foundry data
lake
capabilities cost $3M–$8M/year. API-OSS provides a complete local
data lake
at zero software cost — one-time hardware of ~$3,000. No storage
costs beyond
local disk. A defense organization managing 50TB of intelligence
data saves
$500K–$3M/year in cloud storage and query costs. All data remains
local —
no cloud exposure of classified intelligence. Contradiction scanning
saves
analyst time: manual source deconfliction across 10K+ items takes
weeks;
API-OSS automates it in seconds.

## Applications
- **Consumer**: Personal data archive with version history, document
  management
- **Government / Defense**: Intelligence data lake, source deconfliction,
  multi-source fusion, signals intelligence storage
- **Enterprise**: Data warehousing, regulatory data retention, multi-source
  data integration
