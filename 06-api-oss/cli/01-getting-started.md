---
title: "CLI Guide 01: Getting Started"
sidebar_position: 1
description: "The `api-oss` CLI is a single binary that serves as both the server and the command-line interface. All 87 commands are available from the same binary."
tags: [cli]
---

# CLI Guide 01: Getting Started

## Overview

The `api-oss` CLI is a single binary that serves as both the server and the command-line interface. All 87 commands are available from the same binary.

## Installation

```bash
# Linux/macOS
chmod +x api-oss
./api-oss init

# Windows
api-oss.exe init
```

## First Run

```bash
# Initialize config and data directories
api-oss init

# Start the server
api-oss serve

# In another terminal, check status
api-oss health
```

## Global Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--config` | `api-oss.toml` | Config file path |
| `--data-dir` | `./data` | Data directory |
| `--log-level` | `info` | Log level: trace/debug/info/warn/error |
| `--port` | `3030` | WebSocket port |
| `--ui-port` | `8080` | HTTP UI port |
| `--model-dir` | `./models` | Model storage directory |

## Subcommand Structure

```
api-oss
├── init              Initialize config and directories
├── serve             Start the server
├── health            Check system health
├── model             Model management (pull, list, rm, info, serve)
├── chat              Interactive or one-shot chat
├── complete          Generate completion
├── graph             Graph operations (nodes, edges, query, import, export)
├── ingest            File ingestion
├── search            Search graph and documents
├── document          Document CRUD
├── ledger            Audit ledger operations
├── config            Configuration management
├── backup            Backup data
├── restore           Restore from backup
├── secret            Secrets management
├── cert              TLS certificate management
├── diagnostics       Run diagnostics
├── logs              View logs
├── metrics           Export metrics
├── sync              P2P sync operations
├── bridge            Bridge management (Discord, Telegram, WhatsApp)
├── deploy            Deploy pipeline
├── marketplace       Marketplace operations
├── plugin            Plugin management
├── wasm              WASM module management
├── finetune          Model fine-tuning
├── eval              Model evaluation
└── completion        Shell completion generator
```

## Shell Completion

```bash
# Bash
source <(api-oss completion bash)

# Zsh
source <(api-oss completion zsh)

# Fish
api-oss completion fish | source

# PowerShell
api-oss completion powershell | Out-String | Invoke-Expression
```

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)
