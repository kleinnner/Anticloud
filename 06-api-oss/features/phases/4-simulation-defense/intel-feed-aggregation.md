---
title: "Intel Feed Aggregation"
sidebar_position: 99
description: "Aggregates intelligence from multiple sources — RSS, APIs, file"
tags: [features]
---

# Intel Feed Aggregation

## What It Does
Aggregates intelligence from multiple sources — RSS, APIs, file
drops, web
scraping — into a unified feed. Supports scheduled polling and
automatic
ingestion into the knowledge graph for downstream analysis. Every
ingested
item is a first-class graph node with full provenance.

## How It Works
The intel feed module in `ai-oss-gateway/src/intel_feed.rs`
implements a
multi-source ingestion pipeline. Feed sources are defined in
`opencode.json`
under the `intel_feeds` section — each with a type (rss, api,
file_watch,
web_scrape), URL/path, polling interval, and parser configuration.
The feed
poller runs on a configurable scheduler, fetching new items from
each
source. An item parser extracts structured fields (title, body,
author,
timestamp, geolocation, source) and passes them to the ingestion
pipeline.
Each item becomes a graph node in the SQLite WAL-backed graph,
linked to its
source feed node. The entity resolution engine
(`entity_resolver.rs`)
automatically matches ingested items against existing graph
entities,
suggesting merges with confidence scores. The contradiction scanner
cross-references new data against existing facts, flagging
discrepancies.
The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can classify
and
prioritize incoming intelligence based on relevance to active
operations.
The intel feed view streams updates via WebSocket on port 3030. HTTP
UI is
served on port 8081. All processing runs fully offline — ingested
data is
stored locally in `./data/`. The CLI includes 87 commands with
`intel-feed`
subcommands. Config is driven by `opencode.json`.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the IntelFeedView in the browser at port 8081
3. Add feed sources via `intel_feed_add` WebSocket message or the UI form
4. Configure feed parameters — URL, polling interval, parser type,
   authentication
5. View aggregated items in the unified feed view
6. Ingest items into the knowledge graph manually or enable auto-ingest
7. Review entity resolution suggestions for new items matching existing
   graph entities
8. Monitor the contradiction scanner for conflicting information
9. Use the CLI: `api-oss intel-feed list`, `api-oss intel-feed poll`,
   `api-oss intel-feed ingest`

## The Moat
- Multi-source intelligence aggregation feeding directly into a local
  knowledge graph with full provenance creates an integrated
intelligence
  pipeline
- Each ingestion event is a first-class graph node, not just a row in a
  flat table
- Entity resolution and contradiction scanning mean the system actively
  maintains data quality, not just collecting raw feeds
- Fully offline operation means intelligence aggregation works in
  disconnected environments — critical for deployed defense
- The graph-native approach means intelligence items are automatically
  linked to existing entities, operations, and decisions
- No competitor offers a local-first, graph-integrated intelligence feed
  aggregation platform

## Why Choose API-OSS
Palantir Foundry has data pipelines but requires cloud connectivity
and
expensive licensing. Google has no equivalent intelligence feed
product.
API-OSS provides a complete multi-source intelligence aggregation
platform
that runs entirely offline, feeding directly into a live knowledge
graph
with entity resolution and contradiction detection. Every ingested
item is
automatically linked to relevant entities, operations, and
decisions. For
defense customers, this means continuous intelligence integration in
contested environments.

## Competitive Comparison
- **Palantir**: Foundry has data pipelines but requires cloud connectivity;
  $3M+/yr licensing
- **Google**: No equivalent intelligence feed product
- **Anthropic**: No data feed product
- **Nvidia**: No data feed product

## Cost-Benefit Analysis
Palantir Foundry's data pipeline capabilities cost $3M–$8M/year.
Commercial
OSINT aggregation platforms (Dataminr, ZeroFox) cost
$100K–$500K/year per
user. API-OSS provides equivalent or superior multi-source
intelligence
aggregation at zero software cost — one-time hardware of ~$3,000.
No per-feed
fees, no per-user licensing, no data egress costs. A defense
intelligence
organization running 50+ feed sources saves $500K–$3M/year. All
data remains
local — no cloud exposure of intelligence sources or targets.

## Applications
- **Consumer**: Personal news aggregation with graph-based knowledge
  integration, research feed management
- **Government / Defense**: OSINT collection, SIGINT feed integration,
  HUMINT reporting aggregation, open-source monitoring
- **Enterprise**: Competitive intelligence, market monitoring, regulatory
  change tracking, industry news aggregation

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com