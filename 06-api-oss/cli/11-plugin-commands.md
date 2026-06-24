---
title: "Plugin Commands Reference"
sidebar_position: 11
description: "Manage plugins via CLI."
tags: [cli]
---

# Plugin Commands Reference

## Overview

Manage plugins via CLI.

## apioss plugins

```bash
apioss plugins <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `install` | Install a plugin |
| `uninstall` | Remove a plugin |
| `list` | List installed plugins |
| `enable` | Enable a plugin |
| `disable` | Disable a plugin |
| `update` | Update a plugin |
| `info` | Show plugin details |
| `package` | Package a plugin for distribution |
| `publish` | Publish to marketplace |

### apioss plugins install

```bash
apioss plugins install <source> [flags]

Flags:
      --version string   Plugin version
      --registry string  Plugin registry URL

Examples:
  apioss plugins install custom-auth
  apioss plugins install ./my-plugin.tar.gz
  apioss plugins install custom-auth --version 1.2.0
```

### apioss plugins list

```bash
apioss plugins list [flags]

Flags:
  -j, --json    JSON output
  -e, --enabled Show only enabled

Examples:
  apioss plugins list
  apioss plugins list --json
  apioss plugins list --enabled
```

### apioss plugins package

```bash
apioss plugins package <path> [flags]

Flags:
  -o, --output string   Output file

Examples:
  apioss plugins package ./my-plugin
  apioss plugins package ./my-plugin -o my-plugin-v1.tar.gz
```

### apioss plugins publish

```bash
apioss plugins publish <path> [flags]

Flags:
      --registry string   Marketplace registry URL
      --token string      Auth token

Examples:
  apioss plugins publish my-plugin.tar.gz
  apioss plugins publish my-plugin.tar.gz --registry https://marketplace.api-oss.local
```

## Next

- [12 Model Commands](12-model-commands.md)

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)
