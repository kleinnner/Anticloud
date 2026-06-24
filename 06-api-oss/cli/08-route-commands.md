---
title: "Route Commands Reference"
sidebar_position: 8
description: "Manage gateway routes via CLI."
tags: [cli]
---

# Route Commands Reference

## Overview

Manage gateway routes via CLI.

## apioss routes

```bash
apioss routes <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `list` | List all routes |
| `add` | Add a new route |
| `update` | Update an existing route |
| `remove` | Remove a route |
| `get` | Get route details |
| `test` | Test route matching |

### apioss routes list

```bash
apioss routes list [flags]

Flags:
  -j, --json     JSON output
  -f, --filter   Filter by upstream

Examples:
  apioss routes list
  apioss routes list --json
  apioss routes list --filter openai
```

### apioss routes add

```bash
apioss routes add <path> <upstream> [flags]

Flags:
      --methods strings   Allowed methods (default [GET,POST])
      --timeout duration  Upstream timeout (default 30s)
      --retries int       Max retries (default 3)
      --rate-limit int    Requests per window
      --rate-window int   Rate limit window seconds
      --auth              Require authentication

Examples:
  apioss routes add /v1/chat https://api.openai.com
  apioss routes add /v1/embeddings http://localhost:8081 --timeout 60s
  apioss routes add /v1/health http://health:8080 --methods GET
```

### apioss routes remove

```bash
apioss routes remove <id>

Examples:
  apioss routes remove route-123
```

### apioss routes test

```bash
apioss routes test <method> <path>

Examples:
  apioss routes test POST /v1/chat
  # Matches route-123 -> https://api.openai.com
```

## Next

- [09 Key Management](09-key-management.md)

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)
