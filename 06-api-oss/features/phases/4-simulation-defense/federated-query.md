---
title: "Federated Query"
sidebar_position: 99
description: "Enables querying across multiple API-OSS instances with"
tags: [features]
---

# Federated Query

## What It Does
Enables querying across multiple API-OSS instances with
privacy-preserving
federation. Peers can share selected data and query results without
exposing
raw underlying data. Federated queries run across P2P-connected
instances
with differential privacy guarantees.

## How It Works
The federated query module in
`ai-oss-gateway/src/federated_query.rs`
implements a distributed query engine over peer-to-peer connected
API-OSS
instances. Peers discover each other through the fleet registry or
manual
configuration in `opencode.json` under the `federated_query.peers`
section.
When a user submits a federated query via `federated_query`
WebSocket
message on port 3030, the query planner decomposes it into
sub-queries for
each peer based on their declared capabilities and access policies.
Each
peer executes its sub-query locally against its own SQLite
WAL-backed
knowledge graph, applying privacy filters before returning results.
Privacy
filters include: differential privacy (epsilon budget tracking with
Laplace
noise via the `private_query` module), column-level restrictions
(only
certain properties are shareable), aggregate-only results (no raw
record
exposure), and k-anonymity thresholds. The distributed query
executor
collects responses from all peers, applies privacy-preserving
aggregation
(secure summation, noisy counts), and fuses results into a unified
response.
The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can assist with
query
planning optimization and result fusion. Peer communication is
encrypted
end-to-end. Each federated query is recorded with full provenance
— which
peers contributed, what privacy filters were applied, and what
results were
returned. The FederatedQueryView on the HTTP UI at port 8081
provides peer
management and query monitoring. Config is driven by
`opencode.json`. All
data is stored in `./data/`.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly on each instance
2. Configure peer connections in `opencode.json` under
   `federated_query.peers` — peer address, authentication key,
data sharing
   policy
3. Open the FederatedQueryView in the browser at port 8081
4. View connected peers and their status — online, data categories available,
   query load
5. Submit a federated query via the UI or `federated_query` WS message
6. The query planner shows the decomposition plan — which sub-queries go to
   which peers
7. View fused results with per-peer contribution breakdown and privacy
   filter indicators
8. Monitor privacy budget consumption for differential privacy queries
9. Export federated query results as graph snapshot to `./data/`
10. Use the CLI: `api-oss federated peers`, `api-oss federated query`

## The Moat
- Privacy-preserving federated graph query — where you can ask a question
  across instances without exposing sensitive data — requires
advanced
  cryptography and distributed query planning
- Palantir's per-deployment data silos cannot do cross-instance query without
  central infrastructure
- Differential privacy with epsilon budget tracking ensures quantifiable
  privacy guarantees
- Peer-to-peer architecture means no central query coordinator — works fully
  offline between instances
- Each federated query has full provenance for audit
- The combination of federated query + differential privacy + P2P peer
  discovery is unique

## Why Choose API-OSS
Palantir deploys per-deployment data silos with no cross-instance
query
capability without central Palantir infrastructure. Google's
BigQuery Omni
requires cloud connectivity. API-OSS provides peer-to-peer federated
queries
across instances with privacy-preserving filters, differential
privacy
guarantees, and full offline operation. For coalition operations and
multi-agency intelligence sharing, this means asking questions
across
organizational boundaries without exposing sensitive source data.

## Competitive Comparison
- **Palantir**: Per-deployment data silos; no cross-instance query capability;
  cloud-dependent
- **Google**: BigQuery Omni but requires cloud; per-query pricing at
  $5–$10/TB
- **Anthropic**: No federated query product
- **Nvidia**: No federated query product

## Cost-Benefit Analysis
Building federated graph query capabilities with privacy guarantees
costs
$1M–$5M in development. Google BigQuery Omni charges $5–$10/TB
for
cross-cloud queries plus data egress. Palantir's siloed deployments
require
data export/import for any cross-instance analysis — costing
$50K–$200K per
integration. API-OSS provides federated queries at zero software
cost —
one-time hardware of ~$3,000 per node. A coalition of 10 defense
agencies
sharing intelligence saves $2M–$10M in integration costs. No cloud
data
exposure — queries run P2P between local instances.

## Applications
- **Consumer**: Not applicable
- **Government / Defense**: Coalition data sharing, cross-agency intelligence
  queries, multi-national operations, joint task force intelligence
- **Enterprise**: Multi-entity analytics, supply chain data sharing,
  cross-organizational collaboration, M&A due diligence

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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