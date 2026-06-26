---
title: "AI-OSS CLI Reference: Command-Line Interface for the Sovereign Decision Engine"
sidebar_position: 99
description: "The AI-OSS CLI is the primary interface for interacting with the decision engine. The gateway binary (ai-oss-gateway) exposes both an interactive shell and a set of non-interactive commands."
tags: [cli]
---

# AI-OSS CLI Reference: Command-Line Interface for the Sovereign Decision Engine

The AI-OSS CLI is the primary interface for interacting with the decision engine. The gateway binary (ai-oss-gateway) exposes both an interactive shell and a set of non-interactive commands.

```
USAGE:  ai-oss [OPTIONS] <COMMAND>
VERSION: 0.1.0 (stable)
```

## Global Options

| Option | Description | Default |
|--------|-------------|---------|
| `-c, --config <PATH>` | Config file path | `./opencode.json` |
| `-d, --data-dir <DIR>` | Data directory | `./data` |
| `--model <PATH>` | Override GGUF model path | env: `AIOSS_MODEL` |
| `--llamafile <PATH>` | Override LlamaFile binary path | env: `AIOSS_LLAMAFILE` |
| `--port <PORT>` | HTTP/WebSocket port | `8080` |
| `-v, --verbose` | Increase logging verbosity | — |
| `-q, --quiet` | Suppress non-error output | — |
| `--no-color` | Disable terminal colors | — |
| `--version` | Print version information | — |
| `-h, --help` | Print help | — |

## Commands

### ai-oss init

Initialize a new AI-OSS project in the current directory.

Creates: `opencode.json`, `data/`, `data/graph/`, `data/ledger/`, `data/models/`, `data/documents/`, `data/codex/`

```bash
ai-oss init
ai-oss init --name "Contract Review 2026"
ai-oss init --model qwen2.5-7b-q4 --force
```

### ai-oss start

Start the AI-OSS gateway. Launches LlamaFile as subprocess, starts WebSocket server.

```bash
ai-oss start
ai-oss start --browser
ai-oss start --headless --port 9090
```

Interactive commands (when running in terminal):
- `/help` — Show available commands
- `/exit` — Stop the gateway
- `/status` — Show gateway status + model info
- `/graph` — Open graph inspector
- `/ledger` — Tail the ledger
- `/codex <id>` — Switch active Codex
- `/model <path>` — Hot-swap model

### ai-oss query

Send a one-shot query without starting full interactive session. Useful for scripting and automation.

```bash
ai-oss query "What's the liability cap?"
ai-oss query "Summarize contract Q2" --codex project-alpha
cat contract.txt | ai-oss query "Summarize this" --stream
ai-oss query "Search for insurance policies" --json | jq .
```

### ai-oss ingest

Ingest documents into the knowledge graph. Supports PDF, TXT, MD, DOCX, HTML, JSON, CSV.

```bash
ai-oss ingest ./contracts/Q2_insurance.pdf
ai-oss ingest ./documents/ --recursive
ai-oss ingest ./inbox/ --watch
ai-oss ingest ./data.json --dry-run
```

### ai-oss graph

Directly query and manipulate the knowledge graph.

| Subcommand | Description |
|------------|-------------|
| `search <QUERY>` | Full-text search across nodes |
| `get <ID>` | Get a specific node by ID |
| `create` | Interactive node creation wizard |
| `link <SOURCE> <TARGET> <TYPE>` | Create an edge |
| `neighbors <ID>` | Show node neighborhood |
| `stats` | Show graph statistics |
| `export <FORMAT>` | Export graph (json, graphml, csv, dot) |
| `prune` | Remove orphan nodes |

```bash
ai-oss graph search "liability cap"
ai-oss graph get uuid_insurance_policy
ai-oss graph neighbors uuid_sarah --depth 2
ai-oss graph export dot | dot -Tpng -o graph.png
ai-oss graph stats
```

### ai-oss ledger

View and verify the .aioss audit ledger.

| Subcommand | Description |
|------------|-------------|
| `tail` | Tail current session's ledger |
| `show <SESSION_ID>` | Display a specific ledger file |
| `list` | List all .aioss files |
| `verify` | Verify hash chain integrity |

```bash
ai-oss ledger tail --lines 5
ai-oss ledger show a1b2c3d4
ai-oss ledger verify --all
```

### ai-oss config

Get and set configuration values at runtime.

```bash
ai-oss config get ledger.directory
ai-oss config set contradiction_engine.enabled true
ai-oss config list
ai-oss config path
```

### ai-oss model

Manage GGUF models.

```bash
ai-oss model list
ai-oss model download qwen2.5-7b-q4
ai-oss model info qwen2.5-7b-q4
ai-oss model remove qwen2.5-7b-q4
```

### ai-oss doctor

Diagnostic tool. Checks: LlamaFile binary, GGUF model, config validity, writable directories, port availability, SQLite, system RAM, firewall.

```bash
ai-oss doctor
ai-oss doctor --fix
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Configuration error |
| 3 | Model error |
| 4 | Graph error |
| 5 | Ledger error |
| 6 | Port in use |
| 7 | Permission denied |
| 8 | LlamaFile crash |
| 9 | Internal error |
| 10 | Signal interrupt |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AIOSS_CONFIG` | Config file path | `./opencode.json` |
| `AIOSS_DATA_DIR` | Data directory | `./data` |
| `AIOSS_MODEL` | GGUF model path | Overrides config |
| `AIOSS_LLAMAFILE` | LlamaFile binary path | Search PATH |
| `AIOSS_PORT` | HTTP/WebSocket port | `8080` |
| `AIOSS_LOG_LEVEL` | Log level (trace/debug/info/warn/error) | `info` |
| `AIOSS_LOG_FORMAT` | Log format (text/json) | `text` |
| `AIOSS_NO_COLOR` | Disable colors | — |
| `AIOSS_HOME` | Home directory | `~/.ai-oss/` |

## Shell Completion

```bash
ai-oss completion bash    > /etc/bash_completion.d/ai-oss
ai-oss completion zsh     > /usr/local/share/zsh/site-functions/_ai-oss
ai-oss completion fish    > ~/.config/fish/completions/ai-oss.fish
ai-oss completion powershell > profile.ps1
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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
