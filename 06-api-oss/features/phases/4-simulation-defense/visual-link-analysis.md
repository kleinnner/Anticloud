---
title: "Visual Link Analysis"
sidebar_position: 99
description: "Renders an interactive network graph for intelligence analysis,"
tags: [features]
---

# Visual Link Analysis

## What It Does
Renders an interactive network graph for intelligence analysis,
showing
entity-relationship visualizations with social network analysis
patterns.
Enables analysts to discover hidden connections and patterns in the
knowledge graph. Every node and edge in the visualization is a live,
queryable object in the underlying graph.

## How It Works
The visual link analysis module in
`ai-oss-gateway/src/visual_link.rs`
implements a real-time graph visualization engine. It queries the
SQLite
WAL-backed graph for entities and relationships within a
user-defined scope,
then renders them as an interactive force-directed network graph
using D3.js.
The view supports pan, zoom, drag, and node expansion — clicking a
node
expands its connected subgraph. Social network analysis algorithms
run
server-side in Rust: centrality (degree, betweenness, closeness,
eigenvector),
community detection (Louvain, label propagation), and path finding
(shortest
path, all paths, max flow). Results are visualized with node size,
color,
and label encoding of computed metrics. The link analysis query
engine
supports complex graph patterns: "find all paths between person A
and person
B," "find common connections of group X," "show communication
hierarchy in
organization Y." The Timescape engine enables temporal filtering —
viewing
the graph as it existed at any point in history. The
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can suggest hidden
relationships by analyzing patterns across the graph. Frontend
updates
stream via WebSocket on port 3030. HTTP UI is served on port 8081.
Config is
driven by `opencode.json`. All analysis is stored in `./data/` for
export
and sharing.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the VisualLinkAnalysisView in the browser at port 8081
3. Select entities to analyze — by search, graph scope, or filter criteria
4. The interactive network graph renders with force-directed layout
5. Right-click nodes to expand connections, view properties, or run path
   analysis
6. Run SNA algorithms from the toolbar — centrality, community detection
7. Filter visually by entity type, relationship type, or timeframe
8. Use the temporal scrubber for historical graph state analysis
9. Export visualizations as graph snapshots, images, or interactive HTML

## The Moat
- Graph-native link analysis operating on the live knowledge graph in
  real-time — not on exported data snapshots
- Every node and edge in the visualization is a live, queryable object in
  the underlying graph
- Social network analysis algorithms running natively in Rust on the graph
  store — no data export to external tools
- Temporal filtering via Timescape means analysts see the graph as it
  existed at any point
- The integration with the full knowledge graph means link analysis doesn't
  stop at connections — it surfaces decisions, intelligence, and
provenance
- Fully offline — no cloud dependency for rendering or computation

## Why Choose API-OSS
Palantir Gotham and Foundry offer link analysis but require cloud
connectivity and cost $5M+/year in licensing. Google has no
equivalent
product. API-OSS provides professional-grade visual link analysis
with SNA
algorithms, temporal filtering, and live graph querying — entirely
offline
on consumer hardware. For intelligence analysts, this means
discovering
hidden connections in the field without a network connection.

## Competitive Comparison
- **Palantir**: Link analysis in Gotham/Foundry but requires cloud and
  expensive licensing; $5M+/yr
- **Google**: No equivalent product
- **Anthropic**: No link analysis product
- **Nvidia**: No link analysis product

## Cost-Benefit Analysis
Palantir's link analysis capabilities cost $5M–$10M/year including
Foundry
licensing. Dedicated link analysis tools (i2 Analyst's Notebook,
Maltego)
cost $5K–$15K/user/year with cloud dependency for many features.
API-OSS
provides superior graph-native link analysis at zero software cost
— one-time
hardware of ~$3,000. No per-user licensing. A defense intelligence
organization with 50 analysts saves $250K–$750K/year in tool
licensing alone.
All sensitive connection data remains local — no cloud exposure of
intelligence networks or sources.

## Applications
- **Consumer**: Personal network analysis, relationship mapping, social
  media connection discovery
- **Government / Defense**: Intelligence analysis, counter-terrorism link
  discovery, organized crime network mapping, counter-intelligence
- **Enterprise**: Fraud detection, organizational network analysis, conflict
  of interest discovery, supply chain mapping

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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