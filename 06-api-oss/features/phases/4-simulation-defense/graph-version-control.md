---
title: "Graph Version Control"
sidebar_position: 99
description: "Git-like versioning for the knowledge graph — branch, merge, diff,"
tags: [features]
---

# Graph Version Control

## What It Does
Git-like versioning for the knowledge graph — branch, merge, diff,
and full
change history. Every mutation is a commit with hash, parent
references, and
author metadata. Enables collaborative graph editing with full
version
history and conflict resolution.

## How It Works
The graph VCS module in `ai-oss-gateway/src/graph_vcs.rs` implements
a
distributed version control system for the knowledge graph. Every
mutation
to the SQLite WAL-backed graph is captured as a commit object with:
SHA-256
hash of the commit content, timestamp, author, parent commit
hash(es),
commit message, and a reference to the full graph state. The commit
graph
forms a DAG (directed acyclic graph) of graph history. The branch
manager
supports creating, listing, switching, and deleting branches —
each branch
is a pointer to a commit in the DAG. Branching uses the zero-copy
clone
system for storage efficiency. The merge resolver handles merging
divergent
graph histories. When merging two branches, the engine identifies
conflicting changes — same node/edge modified differently in both
branches.
Conflicts are flagged for manual resolution with a visual merge
interface
showing both versions and suggested resolution. The diff generator
computes
structural differences between any two commits:
added/removed/modified nodes,
edges, and properties. The `commit_incremental` WebSocket message
allows
committing partial changes (specific subgraph) rather than the
entire graph
state. The `temporal_changes` message queries changes within a time
window.
The `state_proof` message provides cryptographic proof of graph
state at any
commit. The GraphVCSView on the HTTP UI at port 8081 provides a
visual
commit graph, branch management, and merge interface. The
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can suggest merge
resolutions based on context. Frontend connects via WebSocket to
port 3030.
Config is driven by `opencode.json` under the `graph_vcs` section.
All data
is stored in `./data/`.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the Graph VCS view in the browser at port 8081
3. View commit history as an interactive DAG — each commit shows hash,
   author, message, timestamp
4. Create a branch from any commit via the branch manager
5. Work on the branch — all mutations create commits on the active branch
6. Switch between branches — the graph state updates to the branch's commit
7. Merge branches — the visual merge interface shows conflicts for
   resolution
8. View diffs between any two commits — color-coded node/edge changes
9. Use `commit_incremental` WS message for partial commits
10. Export commit history as a graph snapshot to `./data/`
11. Use the CLI: `api-oss vcs log`, `api-oss vcs branch`,
    `api-oss vcs diff`, `api-oss vcs merge`

## The Moat
- Applying version control semantics to a graph database — where branching
  means forking subgraphs and merging requires conflict resolution
on edges
  — is a deep systems challenge
- No existing graph database offers true Git-like VCS with branching,
  merging, and conflict resolution
- The combination of CoW branching + commit DAG + automated merge conflict
  detection is unique
- The DAG-based commit history enables full audit trails and temporal
  navigation
- Cryptographic state proofs provide verifiable integrity of graph history
- Zero-copy branching means 1,000 branches cost the storage of one

## Why Choose API-OSS
Palantir has no version control for graph state — changes are
permanent and
audit trails are limited. Google and Anthropic have no equivalent
product.
API-OSS provides full Git-like version control for the knowledge
graph with
branching, merging, diff, and cryptographic state proofs — all
offline on
consumer hardware. For collaborative intelligence analysis, this
means safe
experimentation, full auditability, and parallel workflows without
data loss.

## Competitive Comparison
- **Palantir**: No version control for graph state; changes are permanent
- **Google**: No equivalent product
- **Anthropic**: No version control product
- **Nvidia**: No version control product

## Cost-Benefit Analysis
Building Git-like version control for graph data costs $2M–$5M in
custom
R&D. Enterprise graph databases (Neo4j, ArangoDB) offer no VCS
capabilities.
API-OSS provides full graph VCS at zero software cost — one-time
hardware of
~$3,000. A defense intelligence organization collaborating on shared
intelligence products saves $2M–$5M in custom development. Time
savings:
recovering a mistakenly-modified graph state takes seconds with VCS;
without
it, data recovery can take days or be impossible.

## Applications
- **Consumer**: Personal data version history, experiment tracking, journal
  versioning
- **Government / Defense**: Intelligence product versioning, audit trails,
  collaborative analysis, change management
- **Enterprise**: Knowledge base versioning, collaborative graph editing,
  change management, compliance documentation

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