---
title: "License Commands Reference"
sidebar_position: 19
description: "Manage API-OSS licenses via CLI."
tags: [cli]
---

# License Commands Reference

## Overview

Manage API-OSS licenses via CLI.

## apioss license

```bash
apioss license <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `show` | Display license info |
| `validate` | Validate license key |
| `activate` | Activate a license |
| `deactivate` | Deactivate current license |
| `renew` | Refresh offline license |

### apioss license show

```bash
apioss license show [flags]

Flags:
  -j, --json     JSON output

Examples:
  apioss license show
  apioss license show --json
  # Licensed to: ACME Corp
  # Type: enterprise
  # Expires: 2026-05-31
  # Features: all
```

### apioss license validate

```bash
apioss license validate [flags]

Flags:
  -k, --key string   License key to validate

Examples:
  apioss license validate
  apioss license validate --key "OSS-XXXX-YYYY-ZZZZ"
```

### apioss license activate

```bash
apioss license activate <key> [flags]

Flags:
  --offline       Activate in air-gapped mode
  --token string  Offline activation token

Examples:
  apioss license activate "OSS-XXXX-YYYY-ZZZZ"
  apioss license activate "OSS-XXXX" --offline --token "abc123"
```

## Next

- [20 Completion & Help](20-completion-help.md)

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)
