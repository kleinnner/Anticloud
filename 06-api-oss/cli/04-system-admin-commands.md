---
title: "CLI Guide 04: System & Admin Commands"
sidebar_position: 4
description: "Admin commands for configuration, backup/restore, ledger, health, diagnostics, secrets, and certificates."
tags: [cli]
---

# CLI Guide 04: System & Admin Commands

## Overview

Admin commands for configuration, backup/restore, ledger, health, diagnostics, secrets, and certificates.

## Configuration

```bash
# Show current config (merged from all sources)
api-oss config show

# Show a specific config key
api-oss config get gateway.ws_port

# Set a config value
api-oss config set gateway.ws_port 3030

# Edit config in default editor
api-oss config edit

# Validate config file
api-oss config validate

# Export config as TOML
api-oss config export --format toml > api-oss.toml
```

## Backup

```bash
# Full backup (graph + ledger + config)
api-oss backup --output ./backups/backup-2026-05-31.tar.gz

# Backup with encryption
api-oss backup --output ./backups/backup.tar.gz --encrypt --key-file ./backup-key.pem

# List available backups
api-oss backup list

# Verify backup integrity
api-oss backup verify ./backups/backup-2026-05-31.tar.gz

# Schedule automatic backups
api-oss backup schedule --interval daily --time 02:00 --retention 30
```

## Restore

```bash
# Full restore
api-oss restore ./backups/backup-2026-05-31.tar.gz

# Restore graph only
api-oss restore ./backups/backup-2026-05-31.tar.gz --scope graph

# Restore to a specific point in time
api-oss restore --as-of "2026-05-30T00:00:00Z"

# Dry run (validate without applying)
api-oss restore ./backups/backup-2026-05-31.tar.gz --dry-run
```

## Ledger

```bash
# Show recent ledger entries
api-oss ledger tail --lines 20

# Stream new entries
api-oss ledger stream

# Query ledger by type
api-oss ledger query --type chat_message --limit 50

# Query by actor
api-oss ledger query --actor "user-1"

# Query by date range
api-oss ledger query --from "2026-05-01" --to "2026-05-31"

# Export ledger
api-oss ledger export --format json --output ledger.json
api-oss ledger export --format csv --output ledger.csv

# Verify ledger integrity
api-oss ledger verify

# Search ledger entries
api-oss ledger search "model load"

# Get ledger statistics
api-oss ledger stats
```

## Health

```bash
# Quick health check
api-oss health

# Detailed health
api-oss health --verbose

# Check specific component
api-oss health --component model
api-oss health --component graph
api-oss health --component ledger
api-oss health --component bridge

# Machine-readable output
api-oss health --format json
```

## Diagnostics

```bash
# Run all diagnostics
api-oss diagnostics run

# Run specific test
api-oss diagnostics run --test network
api-oss diagnostics run --test disk
api-oss diagnostics run --test memory

# Run diagnostics and export
api-oss diagnostics run --output diagnostics.json

# List available tests
api-oss diagnostics list
```

## Logs

```bash
# View recent logs
api-oss logs --lines 50

# Follow logs (tail -f style)
api-oss logs --follow

# Filter by level
api-oss logs --level error

# Filter by module
api-oss logs --module ws_server

# Export logs
api-oss logs --output logs.txt
```

## Metrics

```bash
# Show metrics snapshot
api-oss metrics

# Watch metrics live
api-oss metrics --watch

# Export as Prometheus format
api-oss metrics --format prometheus

# Specific metric categories
api-oss metrics --category model
api-oss metrics --category graph
api-oss metrics --category network
```

## Secrets

```bash
# List secrets
api-oss secret list

# Set a secret
api-oss secret set openai-api-key "sk-..."

# Get a secret (masked by default)
api-oss secret get openai-api-key --reveal

# Delete a secret
api-oss secret rm openai-api-key

# Generate a strong random secret
api-oss secret generate --length 32 > new-key.txt

# Shamir split a secret
api-oss secret shamir-split --shares 5 --threshold 3 --input master-key.bin
```

## TLS Certificates

```bash
# Generate self-signed certificate
api-oss cert generate --hostname my-server.local

# Show certificate info
api-oss cert info

# Show certificate expiry
api-oss cert expiry

# Renew certificate
api-oss cert renew

# Import CA-signed certificate
api-oss cert import --cert cert.pem --key key.pem
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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com