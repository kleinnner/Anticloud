---
title: "Diagnose & Troubleshooting Commands"
sidebar_position: 18
description: "Diagnose and troubleshoot gateway issues via CLI."
tags: [cli]
---

# Diagnose & Troubleshooting Commands

## Overview

Diagnose and troubleshoot gateway issues via CLI.

## apioss diagnose

Run comprehensive diagnostic checks.

```bash
apioss diagnose [flags]

Flags:
  --check strings     Specific checks (db, redis, routes, plugins, tls, dns)
  --verbose           Verbose output
  --output string     Output format (text, json, html)
  --since duration    Check metrics since

Examples:
  apioss diagnose
  apioss diagnose --check db,redis
  apioss diagnose --verbose
  apioss diagnose --output json
```

### Check Types

| Check | What it verifies |
|---|---|
| `db` | Database connectivity, migrations, connection pool |
| `redis` | Redis connectivity, memory, keyspace |
| `routes` | Route configuration validity |
| `plugins` | Plugin health and configuration |
| `tls` | Certificate expiry and validity |
| `dns` | DNS resolution for upstreams |
| `ports` | Port availability |

### Output

```json
{
  "status": "degraded",
  "timestamp": "2025-05-31T12:00:00Z",
  "checks": {
    "db": { "status": "ok", "latency_ms": 2 },
    "redis": { "status": "ok", "latency_ms": 1 },
    "routes": { "status": "ok", "count": 15 },
    "tls": {
      "status": "warning",
      "message": "Certificate expires in 14 days"
    }
  },
  "recommendations": [
    "Renew TLS certificate for api.example.com"
  ]
}
```

## apioss verify

Verify system integrity.

```bash
apioss verify [flags]

Flags:
  --checksum     Verify file checksums
  --config       Verify config integrity
  --db           Verify database integrity

Examples:
  apioss verify
  apioss verify --db
  apioss verify --config
```

## Next

- [19 License Commands](19-license-commands.md)

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)
