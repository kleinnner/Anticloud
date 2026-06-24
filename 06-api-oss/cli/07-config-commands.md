---
title: "Config Commands Reference"
sidebar_position: 7
description: "Manage gateway configuration via CLI."
tags: [cli]
---

# Config Commands Reference

## Overview

Manage gateway configuration via CLI.

## apioss config

```bash
apioss config <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `init` | Create default config file |
| `validate` | Validate config file |
| `show` | Display current config |
| `set` | Set a config value |
| `get` | Get a config value |
| `migrate` | Migrate config between versions |
| `diff` | Show differences between configs |
| `export` | Export config with resolved env vars |
| `encrypt` | Encrypt sensitive config values |

### apioss config init

```bash
apioss config init [flags]

Flags:
  -o, --output string   Output file (default "config.yml")
      --v3              Generate v3 config format

Examples:
  apioss config init
  apioss config init -o production.yml
  apioss config init --v3
```

### apioss config validate

```bash
apioss config validate [file]

Examples:
  apioss config validate
  apioss config validate config.yml
  apioss config validate --v2 config-v2.yml
```

### apioss config set

```bash
apioss config set <key> <value>

Examples:
  apioss config set gateway.port 8080
  apioss config set routes[0].upstream https://api.openai.com
  apioss config set --file config.yml gateway.host 0.0.0.0
```

### apioss config migrate

```bash
apioss config migrate <from-version> <input> [flags]

Flags:
  -o, --output string   Output file

Examples:
  apioss config migrate v1-to-v2 config.yml -o config-v2.yml
  apioss config migrate v2-to-v3 config-v2.yml -o config-v3.yml
```

### apioss config encrypt

```bash
apioss config encrypt <value>

Examples:
  apioss config encrypt "my-api-key"
  # Output: encrypted:aes256gcm:base64:abc123...
```

## Next

- [08 Route Commands](08-route-commands.md)

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)
