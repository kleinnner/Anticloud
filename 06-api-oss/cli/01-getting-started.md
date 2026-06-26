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

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com