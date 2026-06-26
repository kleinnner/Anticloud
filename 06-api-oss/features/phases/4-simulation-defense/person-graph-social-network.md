---
title: "Person Graph / Social Network"
sidebar_position: 99
description: "Entity resolution for people across data sources, constructing"
tags: [features]
---

# Person Graph / Social Network

## What It Does
Entity resolution for people across data sources, constructing
social graphs
from relationships, communications, and co-occurrences. Infers
relationships
and generates person profiles automatically. The resulting social
graph is a
first-class citizen in the knowledge graph.

## How It Works
The person graph module in `ai-oss-gateway/src/person_graph.rs`
builds on
the entity resolution engine (`entity_resolver.rs`) with specialized
person-entity matching. When data about a person is ingested from
any source
— intel feeds, sensor data, document parsing, manual entry — the
system runs
probabilistic matching against existing person entities. Matching
considers
name variants, aliases, biometrics, communications patterns,
geolocation
co-occurrence, and network proximity. Each match is scored with a
confidence
metric. High-confidence matches are auto-merged; lower-confidence
matches
are presented for manual confirmation. The social graph builder
infers
relationships from structured data (organizational charts, phone
records)
and unstructured evidence (co-occurrence in documents,
communications
metadata). Relationship types include hierarchy
(subordinate/superior),
communication (frequency, direction), association (co-location,
co-membership), and familial. The PersonGraphView renders person
profiles
with timeline, relationship map (using D3.js force-directed graph),
and
intelligence links. The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on
CUDA
infers latent relationships from pattern analysis. All data is
stored in
SQLite WAL in `./data/` with full Timescape provenance. Frontend
connects
via WebSocket to port 3030. HTTP UI is served on port 8081. Config
is driven
by `opencode.json` under the `person_graph` section with matching
thresholds
and relationship models.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the PersonGraphView in the browser at port 8081
3. Ingest person data from any source — feed aggregation, manual entry,
   file import
4. View auto-resolved person profiles with confidence scores
5. Review merge suggestions from entity resolution — accept or reject
6. Navigate the social network graph — expand relationships, view
   communication patterns
7. Infer latent relationships via the "Infer" button — the model analyzes
   patterns
8. Search for persons by name, alias, or attributes via decision search
9. Export person network as graph snapshot to `./data/`
10. Configure matching thresholds in `opencode.json` under
    `person_graph.matching`

## The Moat
- Entity resolution at the graph level — merging two people means
  reconciling all their edges, properties, and provenance — is
significantly
  harder than flat-table deduplication
- The confidence scoring accounts for graph structure, not just attribute
  similarity
- Relationship inference from unstructured evidence is a novel ML application
  on graph data
- The social graph is a live, queryable part of the knowledge graph, not a
  separate silo
- Timescape provenance on every person entity enables temporal network
  analysis
- Offline operation means person graph analysis works in disconnected
  environments

## Why Choose API-OSS
Palantir Gotham has person graph capabilities but requires cloud
connectivity
and costs millions per year. Google has no equivalent product.
API-OSS
provides professional-grade person entity resolution, social graph
construction, and relationship inference — entirely offline on
consumer
hardware. For intelligence analysts, this means building target
networks in
the field without a network connection.

## Competitive Comparison
- **Palantir**: Person graph exists in Gotham but is cloud-dependent and
  proprietary; $5M+/yr
- **Google**: No equivalent product
- **Anthropic**: No person graph product
- **Nvidia**: No person graph product

## Cost-Benefit Analysis
Palantir Gotham's person graph capabilities cost $5M–$10M/year.
Dedicated
entity resolution platforms (Senzing, Zingg) cost $50K–$200K/year.
API-OSS
provides graph-native person entity resolution and social network
construction at zero software cost — one-time hardware of ~$3,000.
A defense
intelligence organization analyzing 100K+ person entities saves
$3M–$8M/year.
All sensitive person data remains local — no cloud exposure of
targets,
sources, or relationship networks.

## Applications
- **Consumer**: Personal contact network analysis, family tree construction,
  professional network mapping
- **Government / Defense**: Target network analysis, counter-intelligence,
  organized crime mapping, human source network management
- **Enterprise**: CRM enrichment, organizational network analysis, talent
  mapping, M&A due diligence

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