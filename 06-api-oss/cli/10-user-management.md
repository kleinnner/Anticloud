---
title: "User Management Reference"
sidebar_position: 10
description: "Manage users via CLI."
tags: [cli]
---

# User Management Reference

## Overview

Manage users via CLI.

## apioss users

```bash
apioss users <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `create` | Create a new user |
| `list` | List all users |
| `get` | Get user details |
| `update` | Update user |
| `delete` | Delete user |
| `suspend` | Suspend user account |
| `activate` | Reactivate user |

### apioss users create

```bash
apioss users create <email> [flags]

Flags:
  -n, --name string         Display name
  -r, --role string         User role
  -w, --workspace strings   Workspace assignments

Examples:
  apioss users create alice@example.com --name "Alice"
  apioss users create bob@example.com --role admin
  apioss users create chris@example.com --workspace ws-1 --workspace ws-2
```

### apioss users list

```bash
apioss users list [flags]

Flags:
  -j, --json     JSON output
  -f, --filter   Filter by status

Examples:
  apioss users list
  apioss users list --json
  apioss users list --filter active
```

### apioss users delete

```bash
apioss users delete <user-id>

Examples:
  apioss users delete user-123
  apioss users delete user-123 --permanent
```

## Next

- [11 Plugin Commands](11-plugin-commands.md)

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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
