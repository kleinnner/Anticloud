---
title: "Decision Guide: Security Level"
sidebar_position: 9
description: "What security level do I need?"
tags: [decision-guides]
---

# Decision Guide: Security Level

## Question

What security level do I need?

## Decision Tree

```
Do you handle regulated data (HIPAA, PCI, FedRAMP)?
├── Yes → Level 3 (Enterprise security)
└── No → Is your API public-facing?
    ├── Yes → Level 2 (Standard security)
    └── No → Level 1 (Basic security)
```

## Security Levels

| Level | Name | Features | Suitable For |
|---|---|---|---|
| L1 | Basic | API keys, TLS, rate limiting | Internal tools, dev |
| L2 | Standard | + RBAC, audit, IP allowlist, SSO | SaaS, B2B |
| L3 | Enterprise | + mTLS, encryption at rest, HSM, TPM | Regulated, defense |

## Level 1: Basic

```yaml
features:
  - API key authentication
  - TLS 1.3
  - Rate limiting
  - Basic audit logging
```

## Level 2: Standard

```yaml
features:
  - All L1 features
  - RBAC
  - Audit log (hash chain)
  - IP allow/deny
  - SSO (SAML, OIDC)
  - Secrets management
```

## Level 3: Enterprise

```yaml
features:
  - All L2 features
  - mTLS (mutual TLS)
  - Encryption at rest (BYOK)
  - HSM integration
  - TPM attestation
  - SIEM integration
  - Air-gapped support
  - Compliance reporting
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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

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