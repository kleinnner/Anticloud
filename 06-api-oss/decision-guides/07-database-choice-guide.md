---
title: "Decision Guide: Database Choice"
sidebar_position: 7
description: "Which database should I use with API-OSS?"
tags: [decision-guides]
---

# Decision Guide: Database Choice

## Question

Which database should I use with API-OSS?

## Decision Tree

```
Do you need <1ms query latency?
├── Yes → Do you need complex queries?
│   ├── Yes → PostgreSQL with connection pooling
│   └── No → Redis (for simple KV)
└── No → What's your scale?
    ├── <10GB → SQLite (embedded)
    ├── <100GB → PostgreSQL (single node)
    └── 100GB+ → PostgreSQL (partitioned + read replicas)
```

## Database Comparison

| Feature | PostgreSQL | MySQL | SQLite | Redis |
|---|---|---|---|---|
| Performance | Excellent | Good | Good (single) | Excellent |
| Features | Rich | Good | Basic | Basic |
| Scaling | Read replicas | Replicas | None | Cluster |
| ACID | Yes | Configurable | Yes | No |
| JSON support | Excellent | Good | Limited | Limited |
| Extensions | Rich | Limited | None | Lua |

## Recommendation

```yaml
default: PostgreSQL 15+
reason: "Best feature set, JSON support, extensions"

small_deployments:
  option: SQLite + PostgreSQL
  reason: "SQLite for config, PG for audit"

high_performance:
  option: PostgreSQL + Redis
  reason: "PG for persistence, Redis for caching"

distributed:
  option: PostgreSQL (Citus)
  reason: "Horizontal scaling for large deployments"
```

## Next

- [Monitoring Stack Guide](08-monitoring-stack-guide.md)

## See Also

Related decision guides, architecture, and deployment documentation.

- [Decision Guides Overview](../decision-guides/01-decision-guides-overview.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [Deployment Guide](../deployment/01-overview.md)
- [Recipes](../recipes/01-recipes-overview.md)

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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ