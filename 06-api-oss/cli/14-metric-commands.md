---
title: "Metric Commands Reference"
sidebar_position: 14
description: "Query gateway metrics via CLI."
tags: [cli]
---

# Metric Commands Reference

## Overview

Query gateway metrics via CLI.

## apioss metrics

```bash
apioss metrics <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `query` | Query a metric |
| `list` | List available metrics |
| `top` | Show top-N metrics |
| `histogram` | Show latency histogram |
| `health` | Show health metrics |

### apioss metrics query

```bash
apioss metrics query <metric> [flags]

Flags:
  --since duration   Time range start
  --until duration   Time range end
  --interval string  Aggregation interval (1m, 5m, 1h)
  -j, --json         JSON output

Examples:
  apioss metrics query apioss_requests_total --since 1h
  apioss metrics query apioss_request_latency_ms --interval 5m --json
```

### apioss metrics top

```bash
apioss metrics top [flags]

Flags:
  --limit int     Number of results (default 10)
  --metric string Metric to sort by

Examples:
  apioss metrics top --limit 5
  apioss metrics top --metric apioss_errors_total
```

### apioss metrics histogram

```bash
apioss metrics histogram [flags]

Flags:
  --since duration   Time range start
  --bucket string    Bucket boundaries

Examples:
  apioss metrics histogram --since 1h
  # Output:
  # <10ms:  4523
  # 10-50ms: 2341
  # 50-100ms: 567
  # 100ms+:  123
```

## apioss metrics health

```bash
apioss metrics health [flags]

Flags:
  -j, --json   JSON output

Examples:
  apioss metrics health
  # database: ok, redis: ok, uptime: 72h
```

## Next

- [15 Admin Commands](15-admin-commands.md)

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)
