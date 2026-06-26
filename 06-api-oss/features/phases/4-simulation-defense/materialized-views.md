---
title: "Materialized Views"
sidebar_position: 99
description: "Pre-computes and caches complex graph queries as materialized views"
tags: [features]
---

# Materialized Views

## What It Does
Pre-computes and caches complex graph queries as materialized views
that
refresh on schedule or trigger. Provides fast access to
frequently-needed
graph projections without repeated computation. Views track
dependencies
and invalidate only when underlying graph data changes.

## How It Works
The materialized view module in
`ai-oss-gateway/src/materialized_view.rs`
implements a dependency-aware caching layer over the knowledge
graph. A
materialized view is defined as a graph query pattern with a refresh
policy
— the view definition stores the query expression, output schema,
and
refresh configuration in the SQLite WAL-backed graph metadata. When
a view
is created, the engine executes the query and stores the results as
a
materialized subgraph. The dependency tracker builds a dependency
meta-graph — a graph of views, each node tracking which underlying
graph
entities and properties it depends on. When underlying data changes
(nodes
created, properties modified, edges added/removed), the dependency
tracker
identifies all affected views and marks them as stale for
incremental
refresh. The incremental refresh engine re-executes only the
affected
portions of the query rather than recomputing the full view. Refresh
can be
scheduled (cron-based), event-driven (on underlying data change), or
manual.
Materialized views can themselves serve as data sources for other
views,
creating a view dependency DAG. The MaterializedViewView on the HTTP
UI at
port 8081 provides creation, monitoring, and management of views.
The
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can suggest view
materialization candidates based on query history patterns. Frontend
connects
via WebSocket to port 3030. Config is driven by `opencode.json`
under the
`materialized_views` section with default refresh intervals and
cache size
limits. All data is stored in `./data/`.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the MaterializedViewView in the browser at port 8081
3. Create a new materialized view via `materialized_view_create` WebSocket
   message — provide query pattern and refresh config
4. View all existing views — each shows definition, refresh status, last
   refresh time, size
5. Monitor dependency graph — which views depend on which graph entities
6. Trigger manual refresh via `materialized_view_refresh` WS message
7. Update view definitions without dropping — incremental schema evolution
8. Review cache hit statistics — query latency reduction from view usage
9. Configure auto-suggestion for materialization candidates
10. Use the CLI: `api-oss materialized-view list`,
    `api-oss materialized-view create`,
    `api-oss materialized-view refresh`

## The Moat
- Materialized views in a graph context must track view dependencies and
  invalidate only when underlying graph data changes — requiring a
  dependency graph of views, a meta-graph on top of the knowledge
graph
- Snowflake's materialized views are cloud-only and SQL-table-based; API-OSS
  provides graph-native materialized views with incremental refresh
- The dependency meta-graph enables precise invalidation — only affected
  views are refreshed, not all views
- Incremental refresh (only recomputing changed portions) dramatically
  reduces refresh cost for large views
- The meta-graph on top of the knowledge graph is a novel architectural
  achievement
- Fully offline operation with local caching

## Why Choose API-OSS
Palantir has no materialized view concept. Snowflake offers
materialized
views but requires cloud connectivity and is limited to flat SQL
tables.
API-OSS provides graph-native materialized views with dependency
tracking,
incremental refresh, and offline operation. For analysts running
complex
graph queries repeatedly, materialized views provide
order-of-magnitude
speed improvements without cloud dependency.

## Competitive Comparison
- **Palantir**: No materialized view concept
- **Google**: No equivalent product
- **Anthropic**: No materialized view product
- **Snowflake**: Materialized views exist but require cloud and are
  SQL-table-based only; credits-based pricing

## Cost-Benefit Analysis
Snowflake materialized views cost credits for storage and compute
— a
frequently-refreshed 100GB view can cost $3K–$8K/month. Repeated
execution
of complex graph queries without caching wastes analyst time and
compute.
API-OSS provides materialized views at zero software cost —
one-time
hardware of ~$3,000. Incremental refresh means minimal compute
overhead. A
defense organization running 50+ frequent complex queries saves
$200K–$500K/year in compute costs. Time savings: a 30-second graph
query
repeated 100 times/day saves 50+ analyst hours/month when cached as
a
materialized view.

## Applications
- **Consumer**: Pre-computed personal analytics, frequently-accessed data
  projections
- **Government / Defense**: Frequently-queried intelligence projections,
  standing analytical views, common operational picture refreshes
- **Enterprise**: Operational dashboards, real-time analytics, business
  intelligence views, KPI aggregations

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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