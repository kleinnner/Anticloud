---
title: "Backup & Restore Commands"
sidebar_position: 16
description: "Backup and restore gateway data via CLI."
tags: [cli]
---

# Backup & Restore Commands

## Overview

Backup and restore gateway data via CLI.

## apioss backup

```bash
apioss backup <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `create` | Create a new backup |
| `list` | List available backups |
| `show` | Show backup details |
| `delete` | Delete a backup |
| `schedule` | Configure backup schedule |

### apioss backup create

```bash
apioss backup create [flags]

Flags:
  --full             Full backup (default)
  --config           Config files only
  --data             Data only (DB + Redis)
  --plugins          Plugin data only
  -o, --output       Output path
  --encrypt          Encrypt backup
  --encrypt-key      Encryption key

Examples:
  apioss backup create
  apioss backup create --config -o /backups/config.aioss
  apioss backup create --full --encrypt
```

### apioss backup list

```bash
apioss backup list [flags]

Flags:
  -j, --json     JSON output

Examples:
  apioss backup list
  apioss backup list --json
```

## apioss restore

```bash
apioss restore <backup-file> [flags]

Flags:
  --dry-run       Validate without restoring
  --force         Skip confirmation
  --partial       Restore specific components
  --target-db     Target database URL

Examples:
  apioss restore /backups/full-20250531.aioss
  apioss restore /backups/config.aioss --dry-run
  apioss restore backup.aioss --partial --config
```

## apioss backup schedule

```bash
apioss backup schedule [flags]

Flags:
  --interval string   Schedule interval (hourly, daily, weekly)
  --retention int     Days to keep backups
  --target string     Backup destination

Examples:
  apioss backup schedule --interval daily --retention 30
  apioss backup schedule --off  # Disable scheduling
```

## Next

- [17 Migrate Commands](17-migrate-commands.md)

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
