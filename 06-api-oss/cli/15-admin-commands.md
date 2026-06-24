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
