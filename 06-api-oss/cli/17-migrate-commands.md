---
title: "Migration Commands Reference"
sidebar_position: 17
description: "Migrate from other API providers and between API-OSS versions."
tags: [cli]
---

# Migration Commands Reference

## Overview

Migrate from other API providers and between API-OSS versions.

## apioss migrate

```bash
apioss migrate <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `from-openai` | Migrate from OpenAI |
| `from-anthropic` | Migrate from Anthropic |
| `from-azure` | Migrate from Azure OpenAI |
| `from-vertex` | Migrate from GCP Vertex AI |
| `from-bedrock` | Migrate from AWS Bedrock |
| `from-huggingface` | Migrate from Hugging Face |
| `from-ollama` | Migrate from Ollama |
| `config` | Migrate config between versions |

### apioss migrate from-openai

```bash
apioss migrate from-openai [flags]

Flags:
  --api-key string       OpenAI API key
  --org-id string        OpenAI organization ID
  --output string        Output config file
  --dry-run              Preview without applying

Examples:
  apioss migrate from-openai --api-key sk-... -o config.yml
  apioss migrate from-openai --api-key sk-... --dry-run
```

### apioss migrate config

```bash
apioss migrate config <from-version> <input> [flags]

Flags:
  -o, --output string   Output file
  --validate            Validate after migration

Examples:
  apioss migrate config v1-to-v2 old-config.yml -o new-config.yml
  apioss migrate config v2-to-v3 config.yml -o config-v3.yml
```

## Next

- [18 Diagnose Commands](18-diagnose-commands.md)

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)
