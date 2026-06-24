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
