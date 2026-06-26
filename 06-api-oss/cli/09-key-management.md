---
title: "Key Management Reference"
sidebar_position: 9
description: "Manage API keys via CLI."
tags: [cli]
---

# Key Management Reference

## Overview

Manage API keys via CLI.

## apioss keys

```bash
apioss keys <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `create` | Create a new API key |
| `list` | List all API keys |
| `revoke` | Revoke an API key |
| `rotate` | Rotate an API key |
| `update` | Update key metadata |

### apioss keys create

```bash
apioss keys create [flags]

Flags:
  -n, --name string         Key name
  -r, --role string         Key role (admin, user, readonly)
  -s, --scope strings       Key scopes (e.g. chat:write, models:read)
      --expires duration    Key expiration (e.g. 30d, 1y)
      --rate-limit int      Key-level rate limit

Examples:
  apioss keys create --name "dev-key" --role user
  apioss keys create --name "ci-key" --role readonly --expires 90d
  apioss keys create --name "admin-key" --role admin
```

### apioss keys list

```bash
apioss keys list [flags]

Flags:
  -j, --json     JSON output
  -f, --filter   Filter by role

Examples:
  apioss keys list
  apioss keys list --json
  apioss keys list --filter admin
```

### apioss keys revoke

```bash
apioss keys revoke <key-id>

Examples:
  apioss keys revoke key-123
  apioss keys revoke key-123 --reason "Compromised"
```

### apioss keys rotate

```bash
apioss keys rotate <key-id>

Examples:
  apioss keys rotate key-123
  # New key: ak-newkey...
```

## Next

- [10 User Management](10-user-management.md)

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com