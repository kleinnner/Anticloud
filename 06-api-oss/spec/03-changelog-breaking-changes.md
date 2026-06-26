---
title: "Changelog & Breaking Changes"
sidebar_position: 3
description: "Track API specification changes across versions."
tags: [spec]
---

# Changelog & Breaking Changes

## Overview

Track API specification changes across versions.

## v3.0.0 Breaking Changes

| Change | Old | New |
|---|---|---|
| Chat response format | `choices[0].text` | `choices[0].message.content` |
| Error response format | `{"error": "msg"}` | `{"error": {"message": "...", "code": "...", "type": "..."}}` |
| Rate limit headers | `X-RateLimit-*` | `X-RateLimit-Remaining`, `X-RateLimit-Reset` |
| Auth header | `Authorization: Bearer sk-*` | `Authorization: Bearer ak-*` |

## v2.0.0 Breaking Changes

| Change | Old | New |
|---|---|---|
| Admin API base | `/admin/*` | `/v2/admin/*` |
| Key format | `sk-*` | `ak-*` |
| Pagination | `offset/limit` | `page/per_page` cursor |
| WebSocket protocol | JSON only | JSON + binary frames |

## v1.2.0 Breaking Changes

| Change | Old | New |
|---|---|---|
| Log format | Text | JSON |
| Rate limit headers | `X-RateLimit-Limit` | `X-RateLimit-Remaining`, `X-RateLimit-Reset` |

## Deprecation Schedule

| Version | Deprecated | Sunset |
|---|---|---|
| v1.0 | 2024-10 | 2025-06 |
| v1.1 | 2024-10 | 2025-06 |
| v1.2 | 2025-04 | 2026-04 |

## Migration Paths

### v1.x to v2.x

```bash
# Update key format
apioss admin migrate-keys

# Update code
- s/Bearer sk-/Bearer ak-/g
- s/admin\//v2\/admin\//g
```

### v2.x to v3.x

```bash
# Migrate config
apioss config migrate v2-to-v3 config.yml

# Update SDK
npm install apioss-sdk@3
```

## Next

- [04 Code Generation](04-code-generation.md)

## See Also

Related spec, API reference, and code generation documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [API Reference](../api-reference/01-overview.md)
- [API Versioning](../spec/02-api-versioning.md)
- [Code Generation](../spec/04-code-generation.md)

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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ