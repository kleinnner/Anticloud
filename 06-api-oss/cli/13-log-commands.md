---
title: "Log Commands Reference"
sidebar_position: 13
description: "Inspect and manage gateway logs via CLI."
tags: [cli]
---

# Log Commands Reference

## Overview

Inspect and manage gateway logs via CLI.

## apioss logs

```bash
apioss logs [flags]
```

### Flags

| Flag | Description |
|---|---|
| `--tail` | Stream logs in real-time |
| `--lines int` | Number of recent lines (default 50) |
| `--level string` | Filter by level (info, warn, error) |
| `--route string` | Filter by route ID |
| `--since duration` | Show logs since duration (e.g. 5m, 1h) |
| `--until duration` | Show logs until duration |
| `--json` | JSON output |

### Examples

```bash
# Stream logs
apioss logs --tail

# Recent errors
apioss logs --level error --lines 100

# Route-specific
apioss logs --route route-123 --tail

# Time window
apioss logs --since 30m

# JSON output
apioss logs --level error --since 1h --json
```

## apioss log export

Export logs to file.

```bash
apioss log export [output] [flags]

Flags:
  --since duration   Start time
  --until duration   End time
  --format string    Output format (json, csv, parquet)

Examples:
  apioss log export logs.json --since 24h
  apioss log export logs.csv --format csv
```

## Next

- [14 Metric Commands](14-metric-commands.md)

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)
