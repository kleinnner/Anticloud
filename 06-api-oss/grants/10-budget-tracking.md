---
title: "Grant Budget Tracking"
sidebar_position: 10
description: "Track and manage grant budgets."
tags: [grants]
---

# Grant Budget Tracking

## Overview

Track and manage grant budgets.

## Budget Categories

| Category | Allocated | Spent | Remaining | Utilization |
|---|---|---|---|---|
| Personnel | €100,000 | €45,000 | €55,000 | 45% |
| Equipment | €50,000 | €50,000 | €0 | 100% |
| Travel | €10,000 | €2,000 | €8,000 | 20% |
| Subcontractors | €30,000 | €10,000 | €20,000 | 33% |
| Overhead | €20,000 | €8,000 | €12,000 | 40% |
| **Total** | **€210,000** | **€115,000** | **€95,000** | **55%** |

## Budget Tracking Tool

```bash
# View budget
apioss grants budget --grant eic-accelerator

# Add expense
apioss grants expense --grant eic-accelerator \
  --category equipment \
  --amount 5000 \
  --description "GPU server" \
  --date 2025-06-01

# Generate burn rate report
apioss grants burn-rate --grant eic-accelerator
```

## Budget Reallocation

```yaml
reallocation:
  original:
    equipment: €50,000
    travel: €10,000
  requested:
    equipment: €45,000
    travel: €15,000
  reason: Additional conferences for dissemination
```

## Next

- [Timeline Management](11-timeline-management.md)

## See Also

Related grants, investor, and commercial documentation.

- [Grant Proposals](../grants/01-eic-accelerator.md)
- [Grant Management](../grants/07-grant-management.md)
- [Investor Overview](../investors/01-investor-overview.md)
- [Commercial Guide](../commercial/01-commercial-overview.md)

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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