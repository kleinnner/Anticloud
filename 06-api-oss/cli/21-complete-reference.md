---
title: "Complete CLI Reference"
sidebar_position: 21
description: "Flat index of all API-OSS CLI commands."
tags: [cli]
---

# Complete CLI Reference

## Overview

Flat index of all API-OSS CLI commands.

## Core

| Command | Description |
|---|---|
| `apioss` | API-OSS CLI and gateway server |
| `apioss start` | Start gateway server |
| `apioss stop` | Stop gateway server |
| `apioss restart` | Restart gateway |
| `apioss reload` | Reload config |
| `apioss status` | Check gateway status |
| `apioss version` | Show version |

## Configuration

| Command | Description |
|---|---|
| `apioss config init` | Create default config |
| `apioss config validate` | Validate config |
| `apioss config show` | Display config |
| `apioss config set` | Set config value |
| `apioss config get` | Get config value |
| `apioss config migrate` | Migrate config version |
| `apioss config diff` | Diff configs |
| `apioss config export` | Export with env vars |
| `apioss config encrypt` | Encrypt sensitive values |

## Routes

| Command | Description |
|---|---|
| `apioss routes list` | List routes |
| `apioss routes add` | Add route |
| `apioss routes update` | Update route |
| `apioss routes remove` | Remove route |
| `apioss routes get` | Get route detail |
| `apioss routes test` | Test route matching |

## Keys

| Command | Description |
|---|---|
| `apioss keys create` | Create API key |
| `apioss keys list` | List keys |
| `apioss keys revoke` | Revoke key |
| `apioss keys rotate` | Rotate key |
| `apioss keys update` | Update key |

## Users

| Command | Description |
|---|---|
| `apioss users create` | Create user |
| `apioss users list` | List users |
| `apioss users get` | Get user |
| `apioss users update` | Update user |
| `apioss users delete` | Delete user |
| `apioss users suspend` | Suspend user |
| `apioss users activate` | Activate user |

## Plugins

| Command | Description |
|---|---|
| `apioss plugins install` | Install plugin |
| `apioss plugins uninstall` | Uninstall plugin |
| `apioss plugins list` | List plugins |
| `apioss plugins enable` | Enable plugin |
| `apioss plugins disable` | Disable plugin |
| `apioss plugins update` | Update plugin |
| `apioss plugins info` | Show plugin info |
| `apioss plugins package` | Package plugin |
| `apioss plugins publish` | Publish plugin |

## Models

| Command | Description |
|---|---|
| `apioss models list` | List models |
| `apioss models add` | Add model |
| `apioss models remove` | Remove model |
| `apioss models update` | Update model |
| `apioss models test` | Test model |

## Logs

| Command | Description |
|---|---|
| `apioss logs` | View logs |
| `apioss log export` | Export logs |

## Metrics

| Command | Description |
|---|---|
| `apioss metrics query` | Query metric |
| `apioss metrics list` | List metrics |
| `apioss metrics top` | Show top metrics |
| `apioss metrics histogram` | Latency histogram |
| `apioss metrics health` | Health metrics |

## Admin

| Command | Description |
|---|---|
| `apioss admin migrate` | Run migrations |
| `apioss admin reset` | Reset admin password |
| `apioss admin backup` | Create backup |
| `apioss admin restore` | Restore backup |
| `apioss admin verify` | Verify integrity |
| `apioss admin diagnose` | Run diagnostics |
| `apioss admin drain` | Drain connections |
| `apioss admin stats` | System statistics |

## Backup

| Command | Description |
|---|---|
| `apioss backup create` | Create backup |
| `apioss backup list` | List backups |
| `apioss backup show` | Show backup |
| `apioss backup delete` | Delete backup |
| `apioss backup schedule` | Schedule backups |
| `apioss restore` | Restore from backup |

## Migrate

| Command | Description |
|---|---|
| `apioss migrate from-openai` | Migrate from OpenAI |
| `apioss migrate from-anthropic` | Migrate from Anthropic |
| `apioss migrate from-azure` | Migrate from Azure |
| `apioss migrate from-vertex` | Migrate from Vertex |
| `apioss migrate from-bedrock` | Migrate from Bedrock |
| `apioss migrate from-huggingface` | Migrate from HF |
| `apioss migrate from-ollama` | Migrate from Ollama |
| `apioss migrate config` | Migrate config |

## License

| Command | Description |
|---|---|
| `apioss license show` | Show license |
| `apioss license validate` | Validate license |
| `apioss license activate` | Activate license |
| `apioss license deactivate` | Deactivate license |
| `apioss license renew` | Renew offline license |

## Completion

| Command | Description |
|---|---|
| `apioss completion bash` | Bash completion |
| `apioss completion zsh` | Zsh completion |
| `apioss completion fish` | Fish completion |
| `apioss completion powershell` | PowerShell completion |
| `apioss man` | Generate man page |

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

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
