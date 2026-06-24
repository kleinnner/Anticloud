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
