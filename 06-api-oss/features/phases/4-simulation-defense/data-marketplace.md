---
title: "Data Marketplace"
sidebar_position: 99
description: "A dataset marketplace for sharing anonymized data across API-OSS"
tags: [features]
---

# Data Marketplace

## What It Does
A dataset marketplace for sharing anonymized data across API-OSS
instances.
Users can publish, search, browse, and install datasets with
privacy-preserving exchange mechanisms. Every exchange is
cryptographically
verified without a central platform provider.

## How It Works
The data marketplace module in `ai-oss-gateway/src/marketplace.rs`
implements
a decentralized P2P data marketplace on top of the federated query
network.
Datasets are published as graph snapshots with metadata —
description,
schema, coverage, anonymization method, trust score, and
cryptographic
signature of the publisher. Discovery happens through peer-to-peer
queries
across federated instances: a `marketplace_search` WebSocket message
broadcasts a search query to all connected peers, which respond with
matching dataset metadata. Results are ranked by relevance and
publisher
trust score. When a user installs a dataset via
`marketplace_install`, the
dataset is transferred as a compressed graph snapshot over encrypted
peer-to-peer connection. Before transmission, datasets are
anonymized
through configurable pipelines: differential privacy (epsilon budget
via the
`private_query` module), k-anonymity (generalizing identifying
fields), or
aggregation (releasing only statistical summaries). The trust scorer
tracks
publisher reputation based on dataset quality, accuracy, and
community
feedback. Each published dataset includes a cryptographic hash for
integrity
verification — recipients can verify the dataset has not been
tampered with.
The marketplace registry (stored in SQLite WAL in `./data/`) tracks
installed
datasets, publishers, and trust scores. The
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can assess dataset
quality
and suggest relevant datasets based on graph content. Frontend
connects via
WebSocket to port 3030. HTTP UI is served on port 8081. Config is
driven by
`opencode.json` under the `marketplace` section with privacy
defaults and
trust scoring parameters. The CLI includes 87 commands with
`marketplace`
subcommands.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the Data Marketplace view in the browser at port 8081
3. Browse available datasets via `marketplace_list` — shows published
   datasets from all connected peers
4. Search for datasets via `marketplace_search` with keywords, categories,
   or schema filters
5. View dataset details — description, schema, anonymization method,
   publisher trust score, size
6. Install a dataset via `marketplace_install` — the dataset transfers over
   P2P with anonymization
7. Publish a dataset — select graph entities or snapshots, configure
   anonymization, add metadata
8. View installed datasets and manage them (uninstall, update, refresh)
9. Rate published datasets — feedback updates publisher trust scores
10. Use the CLI: `api-oss marketplace list`, `api-oss marketplace search`,
    `api-oss marketplace publish`, `api-oss marketplace install`

## The Moat
- A peer-to-peer data marketplace where every exchange is privacy-preserving
  and cryptographically verified — without a central platform
provider —
  requires decentralized discovery, trust scoring, and verifiable
  anonymization
- Integration with differential privacy ensures quantifiable privacy
  guarantees for shared datasets
- Cryptographic hashes provide tamper-proof integrity verification
- Decentralized discovery via federated queries means no central server to
  attack or censor
- Trust scoring with community feedback creates a self-regulating marketplace
- No competitor offers a P2P privacy-preserving data marketplace for graph
  data

## Why Choose API-OSS
Palantir has no data marketplace — data is locked in
per-deployment silos
with no cross-instance sharing mechanism. Google and Nvidia have no
equivalent P2P marketplace. API-OSS provides a decentralized data
marketplace
where organizations can share anonymized graph datasets with privacy
guarantees, cryptographic verification, and trust scoring — all
offline on
local hardware.

## Competitive Comparison
- **Palantir**: No data marketplace; data is locked in per-deployment silos
- **Google**: No equivalent peer-to-peer marketplace
- **Anthropic**: No data marketplace product
- **Nvidia**: No data marketplace product

## Cost-Benefit Analysis
Commercial data marketplaces (AWS Data Exchange, Snowflake
Marketplace)
charge publishing fees, subscription costs, and data transfer fees
— typically
15–30% of transaction value. Building a custom P2P data
marketplace costs
$500K–$2M in development. API-OSS provides a built-in data
marketplace at
zero software cost — one-time hardware of ~$3,000 per node. No
transaction
fees, no platform commissions. A defense coalition sharing
intelligence
datasets across 20 agencies saves $1M–$5M/year in data exchange
costs. All
data remains within the P2P network — no cloud exposure of shared
intelligence.

## Applications
- **Consumer**: Personal data exchange, community datasets, open data sharing
- **Government / Defense**: Coalition data sharing, sanitized intelligence
  exchange, multi-agency dataset pooling
- **Enterprise**: Industry data pools, benchmark datasets, partner data
  exchange, research collaboration
