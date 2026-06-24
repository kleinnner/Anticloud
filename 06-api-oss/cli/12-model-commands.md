---
title: "Model Commands Reference"
sidebar_position: 12
description: "Manage AI models via CLI."
tags: [cli]
---

# Model Commands Reference

## Overview

Manage AI models via CLI.

## apioss models

```bash
apioss models <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `list` | List available models |
| `add` | Register a new model |
| `remove` | Remove a model |
| `update` | Update model config |
| `test` | Test a model endpoint |

### apioss models list

```bash
apioss models list [flags]

Flags:
  -j, --json     JSON output
  -f, --filter   Filter by provider

Examples:
  apioss models list
  apioss models list --json
  apioss models list --filter openai
```

### apioss models add

```bash
apioss models add <name> <provider> [flags]

Flags:
      --model-id string     Provider model ID
      --capability strings  Model capabilities (chat, embeddings, image)
      --context int         Context window size
      --pricing-input float Input token price
      --pricing-output float Output token price

Examples:
  apioss models add gpt-4 openai --model-id gpt-4-turbo
  apioss models add claude-3 anthropic --capability chat
  apioss models add text-embedding-3 openai --capability embeddings
```

### apioss models test

```bash
apioss models test <name> [flags]

Flags:
      --prompt string   Test prompt

Examples:
  apioss models test gpt-4 --prompt "Hello"
```

## Next

- [13 Log Commands](13-log-commands.md)

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)
