---
title: "Graph Diff"
sidebar_position: 99
description: "Visual diff between two graph states — showing added, removed, and"
tags: [features]
---

# Graph Diff

## What It Does
Visual diff between two graph states — showing added, removed, and
modified
nodes and edges with color-coded indicators. Enables analysts to
understand
exactly what changed between any two points in time, between
universes, or
between graph versions.

## How It Works
The graph diff module in `ai-oss-gateway/src/graph_diff.rs`
implements a
graph comparison engine that computes structural differences between
two
graph snapshots. The diff algorithm operates at three levels:
node-level
(comparing node existence and properties), edge-level (comparing
edge
existence and properties), and subgraph-level (comparing structural
patterns).
The engine loads two graph states — either from Timescape
historical points,
Graph VCS commits, or World Engine universes — and computes a
change set
classified into: added (exist in new, not in old), removed (exist in
old,
not in new), modified (exist in both but properties differ), and
moved (node
exists in both but connections changed). The diff serializer
produces a
structured diff manifest that the GraphDiffView renders as an
interactive
visualization. Users see a side-by-side or unified view with
color-coded
changes: green for additions, red for removals, yellow for
modifications,
blue for moves. Each change is clickable for detail — showing
before/after
property values, context, and linked changes. The
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can highlight
semantically
significant changes — changes that affect critical entities or
relationships.
The diff engine integrates with the Timescape for temporal diffs and
the
World Engine for universe comparison. Frontend connects via
WebSocket to
port 3030. HTTP UI is served on port 8081. Config is driven by
`opencode.json`. All diff output can be exported to `./data/`.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the GraphDiffView in the browser at port 8081
3. Select two graph states to compare — from Timescape history, VCS commits,
   or parallel universes
4. The diff engine computes changes and displays them as a color-coded
   visualization
5. Navigate the diff — expand nodes to see property-level changes, filter
   by change type (added/removed/modified)
6. Click individual changes for before/after detail
7. Use semantic diff highlighting to surface significant changes
8. Export the diff as a report or graph snapshot to `./data/`
9. Use the CLI: `api-oss diff timescape`, `api-oss diff vcs`,
   `api-oss diff universe`

## The Moat
- Computing meaningful diffs between graph states — where changes include
  node property edits, edge additions/removals, and subgraph
reorganizations
  — requires sophisticated graph isomorphism awareness
- Three-level diff (node, edge, subgraph) provides comprehensive change
  analysis that simple line-based diff cannot
- Integration with Timescape, VCS, and World Engine enables diff across
  arbitrary graph states
- Semantic diff highlighting using the local LLM identifies impactful
  changes automatically
- The color-coded interactive visualization makes complex graph changes
  immediately understandable
- No competitor offers graph-native diff at this level of sophistication

## Why Choose API-OSS
Palantir has no graph diff capability — analysts must manually
track changes
between snapshots. Google and Anthropic have no equivalent product.
API-OSS
provides comprehensive graph diff across any two states —
temporal, version
control, or multi-universe — with interactive visualization and
semantic
highlighting. For intelligence analysts tracking how a situation
evolves,
this means immediately understanding what changed and why it
matters.

## Competitive Comparison
- **Palantir**: No graph diff capability; manual comparison only
- **Google**: No equivalent product
- **Anthropic**: No graph diff product
- **Nvidia**: No graph diff product

## Cost-Benefit Analysis
Building graph-native diff capabilities costs $300K–$1M in custom
development. Manual comparison of two graph snapshots by an analyst
takes
4–8 hours for a moderate-sized graph (10K nodes). API-OSS provides
instant,
interactive graph diff at zero software cost — one-time hardware
of ~$3,000.
A defense intelligence organization performing 100 diff comparisons
per week
saves $500K–$1M/year in analyst time. Automated diff catches
changes that
manual comparison would miss, reducing intelligence gaps.

## Applications
- **Consumer**: Personal data change tracking, document version comparison
- **Government / Defense**: Intelligence product change analysis, activity
  monitoring, pattern-of-life change detection, operational change
tracking
- **Enterprise**: Knowledge graph change review, collaborative auditing,
  regulatory change monitoring

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
