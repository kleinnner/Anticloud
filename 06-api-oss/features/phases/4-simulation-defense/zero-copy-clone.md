---
title: "Zero-Copy Clone"
sidebar_position: 99
description: "Instantly clones the knowledge graph using copy-on-write semantics"
tags: [features]
---

# Zero-Copy Clone

## What It Does
Instantly clones the knowledge graph using copy-on-write semantics
— no data
duplication, near-zero overhead. Enables branching and
experimentation
without storage multiplication. Each clone shares underlying storage
via
CoW pointers until writes occur.

## How It Works
The zero-copy clone module in `ai-oss-gateway/src/zero_copy.rs`
implements a
CoW (copy-on-write) graph store on top of the SQLite WAL-backed
knowledge
graph. The core data structure is a page-addressable tree of graph
nodes and
edges. When a clone operation is requested via `zero_copy_clone`
WebSocket
message, the engine creates a new graph context with a pointer to
the
parent's page table — no pages are copied. All pages are read-only
and
shared between parent and clone. When a mutation occurs in either
the parent
or clone, the affected pages are copied lazily (at the moment of
write) with
the new version stored in a clone-local page table. The unchanged
pages
continue to be shared. This means 1,000 clones of a 100GB graph
still use
only 100GB of storage until modifications are made. The CoW engine
tracks
page reference counts for garbage collection — when a clone is
collapsed,
its private pages are freed and shared pages decrement their
reference count.
The ZeroCopyCloneView on the HTTP UI at port 8081 provides clone
management
— list clones, compare states, collapse clones. The World Engine
and
scenario simulation modules use zero-copy cloning as their
underlying fork
mechanism. Config is driven by `opencode.json` under the `zero_copy`
section
with page size and cache parameters. All data is stored in
`./data/`.
Frontend connects via WebSocket to port 3030. HTTP UI is served on
port 8081.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the ZeroCopyCloneView in the browser at port 8081
3. View existing clones — each shows parent, creation time, size (shared +
   private pages)
4. Create a new clone via `zero_copy_clone` WS message or UI button
5. Work in the clone — all mutations are tracked in private pages
6. Compare clone state with parent using graph diff
7. Collapse a clone when done — private pages are freed
8. Monitor storage efficiency in the dashboard — shared vs private page
   ratio
9. Configure clone limits in `opencode.json` under `zero_copy.max_clones`

## The Moat
- Copy-on-write for graph databases requires sophisticated pointer
  management and structural sharing
- Snowflake offers zero-copy clone but only in the cloud and for flat
  tables — API-OSS brings it to local-first graphs with the same
instant-
  clone semantics
- The page-level CoW with lazy copy ensures near-zero clone time regardless
  of graph size
- Reference-counted garbage collection ensures storage is reclaimed when
  clones are collapsed
- Zero-copy cloning is the foundation for the World Engine's parallel
  universe management
- No graph database offers Git-like branching with CoW semantics at this
  efficiency

## Why Choose API-OSS
Palantir has no zero-copy clone capability — each deployment has
isolated
storage with full data duplication. Snowflake offers zero-copy clone
but is
cloud-only and table-based, not graph-based. API-OSS provides
instant graph
cloning with CoW semantics that work entirely offline on consumer
hardware.
For analysts running parallel analyses and simulations, this means
unlimited
forking without storage cost.

## Competitive Comparison
- **Palantir**: No zero-copy clone; each deployment has isolated storage with
  full duplication
- **Google**: No equivalent product
- **Anthropic**: No clone product
- **Snowflake**: Zero-copy clone exists but is cloud-only and table-based,
  not graph-based; credits-based pricing

## Cost-Benefit Analysis
Snowflake's zero-copy clone costs per-credit for storage and compute
— 1TB
of cloned data can cost $2K–$5K/month in storage. Palantir's
isolated
deployments require full data duplication: 10 deployments of a 100GB
graph
= 1TB storage. API-OSS provides unlimited zero-copy clones at zero
additional cost — 1,000 clones of a 100GB graph still use ~100GB +
delta.
One-time hardware of ~$3,000. A defense organization running 50
parallel
analyses saves $500K–$2M/year in storage costs. Clone creation is
milliseconds regardless of graph size.

## Applications
- **Consumer**: Personal graph branching without storage bloat, experimental
  data analysis
- **Government / Defense**: Instant operational picture cloning, parallel
  intelligence analysis, sandboxed investigation
- **Enterprise**: Test environment creation, sandboxed analysis, experimental
  query evaluation, development/staging branches

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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