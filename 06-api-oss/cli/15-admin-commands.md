---
title: "Admin Commands Reference"
sidebar_position: 15
description: "Administrative operations via CLI."
tags: [cli]
---

# Admin Commands Reference

## Overview

Administrative operations via CLI.

## apioss admin

```bash
apioss admin <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `migrate` | Run database migrations |
| `reset` | Reset admin password |
| `backup` | Create a backup |
| `restore` | Restore from backup |
| `verify` | Verify system integrity |
| `diagnose` | Run diagnostic checks |
| `drain` | Drain connections for maintenance |
| `stats` | Show system statistics |

### apioss admin migrate

```bash
apioss admin migrate [flags]

Flags:
      --dry-run    Preview without applying
      --version    Migrate to specific version

Examples:
  apioss admin migrate
  apioss admin migrate --dry-run
  apioss admin migrate --version 20250501001
```

### apioss admin backup

```bash
apioss admin backup [flags]

Flags:
      --full       Full backup (config + data)
      --config     Config only
      --data       Data only
  -o, --output     Output path

Examples:
  apioss admin backup --full -o /backups/full-20250531.aioss
  apioss admin backup --config -o /backups/config.aioss
```

### apioss admin restore

```bash
apioss admin restore <backup-file> [flags]

Flags:
      --dry-run    Validate without restoring
      --force      Skip confirmation

Examples:
  apioss admin restore /backups/full-20250531.aioss
  apioss admin restore /backups/config.aioss --dry-run
```

### apioss admin diagnose

```bash
apioss admin diagnose [flags]

Flags:
      --check strings   Specific checks (db, redis, routes, plugins)

Examples:
  apioss admin diagnose
  apioss admin diagnose --check db,redis
```

### apioss admin stats

```bash
apioss admin stats [flags]

Flags:
  -j, --json   JSON output

Examples:
  apioss admin stats
  # requests: 1,234,567
  # errors: 123 (0.01%)
  # avg latency: 45ms
```

## Next

- [16 Backup Commands](16-backup-restore.md)

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com