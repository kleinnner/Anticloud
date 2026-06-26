---
title: "Entity Resolution"
sidebar_position: 99
description: "Deduplicates entities across data sources using probabilistic"
tags: [features]
---

# Entity Resolution

## What It Does
Deduplicates entities across data sources using probabilistic
matching with
confidence scoring. Provides merge suggestions with manual
confirmation and
automatic merging for high-confidence matches. Reconciles all edges,
properties, and provenance when merging graph entities.

## How It Works
The entity resolution module in
`ai-oss-gateway/src/entity_resolver.rs`
implements a multi-strategy probabilistic matcher for graph
entities. When
new data is ingested or an entity is created, the resolver compares
it
against existing entities using multiple matching strategies:
attribute
similarity (name, type, properties), graph structure similarity
(shared
neighbors, relationship patterns), temporal co-occurrence, and
embedding
similarity (using the Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on
CUDA for
semantic matching of unstructured properties). Each strategy
produces a
confidence score; the fusion engine combines them using weighted
ensemble
scoring. Matches above a configurable auto-merge threshold (default
0.95)
are merged automatically. Matches between 0.70 and 0.95 are
presented as
suggestions in the UI; matches below 0.70 are discarded but logged
for
learning. When entities are merged, the merge engine reconciles all
edges —
incoming and outgoing — transferring them to the surviving entity.
Conflicting
property values are preserved with provenance tags and the
contradiction
scanner is notified. The merge operation is recorded with full
provenance
for audit. The entity resolution view surfaces a dashboard with
match
statistics, suggestion review, and merge history. All state is
stored in
SQLite WAL in `./data/`. Frontend connects via WebSocket to port
3030. HTTP
UI is served on port 8081. Config is driven by `opencode.json` under
the
`entity_resolution` section with matching thresholds, strategy
weights, and
auto-merge rules.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the Entity Resolution view in the browser at port 8081
3. Configure matching thresholds in `opencode.json` under
   `entity_resolution`
4. Ingest data from any source — the resolver automatically evaluates new
   entities
5. View match suggestions — merge, reject, or defer each suggestion
6. Accepted auto-merges are logged in the activity feed
7. Manually trigger resolution on existing entities via `entity_resolve`
   WebSocket message
8. View merge history with full provenance for each operation
9. Export resolution statistics to `./data/`

## The Moat
- Entity resolution at the graph level — where merging two entities means
  reconciling all their edges, properties, and provenance — is
significantly
  harder than flat-table deduplication
- The confidence scoring accounts for graph structure, not just attribute
  similarity
- Multi-strategy matching (attribute, graph, temporal, embedding) provides
  robust resolution even with sparse data
- Auto-merge with configurable thresholds balances automation with safety
- Full provenance on every merge enables complete audit trails
- Offline operation means resolution works in disconnected environments

## Why Choose API-OSS
Palantir offers entity resolution but it is cloud-dependent and
opaque —
users cannot inspect or tune the matching logic. Google has no
equivalent
product. API-OSS provides transparent, configurable entity
resolution at the
graph level, with multi-strategy matching, confidence scoring, and
full
provenance — all offline on consumer hardware.

## Competitive Comparison
- **Palantir**: Entity resolution exists but is cloud-dependent and opaque;
  $5M+/yr
- **Google**: No equivalent product
- **Anthropic**: No entity resolution product
- **Nvidia**: No entity resolution product

## Cost-Benefit Analysis
Dedicated entity resolution platforms (Senzing at $50K–$200K/year,
Zingg at
$30K–$100K/year) provide flat-table deduplication only. Building
graph-level
entity resolution costs $500K–$2M in custom development. API-OSS
provides
graph-native entity resolution at zero software cost — one-time
hardware of
~$3,000. A defense intelligence organization managing 1M+ entities
saves
$500K–$2M/year. Time savings: manual entity deduplication across
100K
records takes 2–4 weeks; API-OSS resolves in minutes with
automated
matching.

## Applications
- **Consumer**: Contact deduplication, personal data unification, photo
  library person tagging
- **Government / Defense**: Target identity resolution, alias detection,
  multi-source subject unification
- **Enterprise**: Customer data platform, master data management, supplier
  deduplication, patient matching

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ