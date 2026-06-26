---
title: "Error Codes Cheat Sheet"
sidebar_position: 4
description: "Documentation for Error Codes Cheat Sheet"
tags: [cheat-sheets]
---

# Error Codes Cheat Sheet

## Authentication Errors

| Code | Status | Meaning |
|---|---|---|
| invalid_api_key | 401 | Invalid or expired |
| missing_api_key | 401 | No key provided |
| key_revoked | 401 | Key has been revoked |
| key_expired | 401 | Key has expired |
| insufficient_permissions | 403 | Missing scope |

## Request Errors

| Code | Status | Meaning |
|---|---|---|
| invalid_request | 400 | Malformed request body |
| missing_required_field | 400 | Required field missing |
| invalid_model | 400 | Model not found |
| context_length_exceeded | 400 | Input too long |
| invalid_messages_format | 400 | Wrong message format |

## Rate Limit Errors

| Code | Status | Meaning |
|---|---|---|
| rate_limit_exceeded | 429 | Rate limit hit |
| rate_limit_key_exceeded | 429 | Key limit hit |
| rate_limit_global_exceeded | 429 | Global limit hit |

## Server Errors

| Code | Status | Meaning |
|---|---|---|
| internal_error | 500 | Unexpected error |
| upstream_error | 502 | Upstream error |
| upstream_timeout | 504 | Upstream timed out |
| service_unavailable | 503 | Temporarily unavailable |

## Next

- [Quick Start Cheat Sheet](05-quick-start-cheat-sheet.md)

## See Also

Related cheat sheets and reference documentation.

- [Cheat Sheets](../cheat-sheets/01-cheat-sheets-overview.md)
- [CLI Reference](../cli/01-getting-started.md)
- [Config Reference](../reference/03-configuration-schema.md)
- [Error Codes](../reference/04-error-codes.md)

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com