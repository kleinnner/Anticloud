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
