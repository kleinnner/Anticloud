---
title: "Decision Guide: High Availability"
sidebar_position: 10
description: "What HA level do I need?"
tags: [decision-guides]
---

# Decision Guide: High Availability

## Question

What HA level do I need?

## Decision Tree

```
What's your uptime requirement?
├── 99.9% (8.7h downtime/year) → Single node + backups
├── 99.95% (4.4h/year) → 2 nodes + DB replica
├── 99.99% (52min/year) → 3 nodes + multi-AZ
└── 99.999% (5min/year) → Multi-region federation
```

## HA Tiers

| Tier | Nines | Downtime/year | Architecture | Cost |
|---|---|---|---|---|
| Bronze | 99.9% | 8.7h | Single + backups | $ |
| Silver | 99.95% | 4.4h | 2 nodes + replica | $$ |
| Gold | 99.99% | 52min | 3 nodes + multi-AZ | $$$ |
| Platinum | 99.999% | 5min | Multi-region federation | $$$$ |

## Recommendation

```yaml
development:
  tier: Bronze
  reason: "No SLA required, cost-effective"

production_small:
  tier: Silver
  reason: "Good balance of cost and reliability"

production_enterprise:
  tier: Gold
  reason: "Enterprise SLA requirements"

global:
  tier: Platinum
  reason: "Multi-region, max reliability"
```

## Next

- [Decision Guides Index](10-decision-guides-index.md)

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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
