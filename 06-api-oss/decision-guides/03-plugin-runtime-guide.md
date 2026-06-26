---
title: "Decision Guide: Plugin Runtime"
sidebar_position: 3
description: "Which plugin runtime should I use?"
tags: [decision-guides]
---

# Decision Guide: Plugin Runtime

## Question

Which plugin runtime should I use?

## Decision Tree

```
Do you need maximum performance?
├── Yes → WASM (Rust, Go, C)
└── No → Do you have existing JS code?
    ├── Yes → JavaScript (legacy)
    └── No → Do you need rapid prototyping?
        ├── Yes → JavaScript
        └── No → WASM (for future-proofing)
```

## Comparison

| Factor | WASM | JavaScript | Lua |
|---|---|---|---|
| Performance | Excellent | Good | Good |
| Memory safety | Yes | No | No |
| Language choice | Rust, Go, C, Zig | JavaScript | Lua |
| Startup time | Fast | Fast | Fast |
| Ecosystem | Growing | Mature | Small |
| Sandboxing | Strong | Limited | Limited |
| Future support | Primary | Deprecated | Stable |

## Recommendation

```yaml
new_plugins:
  recommendation: WASM
  reason: "Future-proof, secure, performant"

existing_js:
  recommendation: JavaScript
  reason: "Quick migration, no rewrite needed"

rapid_prototyping:
  recommendation: JavaScript
  reason: "Fast iteration, then migrate to WASM"

performance_critical:
  recommendation: WASM (Rust)
  reason: "Best performance, zero-cost abstractions"
```

## Next

- [Federation Strategy Guide](04-federation-strategy-guide.md)

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

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
