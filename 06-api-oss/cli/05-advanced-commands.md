---
title: "CLI Guide 05: Advanced Commands"
sidebar_position: 5
description: "Advanced commands for P2P sync, bridges, deployment, marketplace, plugins, WASM, and shell completion."
tags: [cli]
---

# CLI Guide 05: Advanced Commands

## Overview

Advanced commands for P2P sync, bridges, deployment, marketplace, plugins, WASM, and shell completion.

## Sync (P2P)

```bash
# List known peers
api-oss sync peers

# Connect to a peer
api-oss sync connect --peer 192.168.1.100:3031

# Start P2P sync daemon
api-oss sync start

# Sync now (one-shot)
api-oss sync now

# Show sync status
api-oss sync status

# Sync specific codex
api-oss sync codex --name "shared-research" --mode pull

# Pair with QR code
api-oss sync qr --display  # Show QR code
api-oss sync qr --scan      # Scan QR code from camera

# Set sync schedule
api-oss sync schedule --interval 5m

# Set relay server
api-oss sync relay --set relay.example.com:3032
```

## Bridge Commands

### Discord

```bash
# Start Discord bridge
api-oss bridge discord start --token "DISCORD_BOT_TOKEN"

# Stop Discord bridge
api-oss bridge discord stop

# Show Discord bridge status
api-oss bridge discord status

# Set Discord command prefix
api-oss bridge discord prefix "!ai"

# List Discord bridge channels
api-oss bridge discord channels
```

### Telegram

```bash
# Start Telegram bridge
api-oss bridge telegram start --token "TELEGRAM_BOT_TOKEN"

# Stop Telegram bridge
api-oss bridge telegram stop

# Show Telegram bridge status
api-oss bridge telegram status

# Set allowed user IDs
api-oss bridge telegram allow --user 123456789
```

### WhatsApp

```bash
# Start WhatsApp bridge
api-oss bridge whatsapp start

# Show QR code for pairing
api-oss bridge whatsapp qr

# Stop WhatsApp bridge
api-oss bridge whatsapp stop

# Show WhatsApp bridge status
api-oss bridge whatsapp status
```

## Deployment

```bash
# List deployment pipelines
api-oss deploy list

# Create a deployment pipeline
api-oss deploy create --name "production" --config ./deploy-prod.toml

# Trigger deployment
api-oss deploy run --name "production"

# Promote model to environment
api-oss deploy promote --model qwen2-vl-2b-q4 --from staging --to production

# Check deployment status
api-oss deploy status --name "production"

# Rollback deployment
api-oss deploy rollback --name "production" --version 3
```

## Marketplace

```bash
# List available plugins
api-oss marketplace list --category plugin

# List available models
api-oss marketplace list --category model

# List available data connectors
api-oss marketplace list --category connector

# Install from marketplace
api-oss marketplace install "plugin-name"

# Publish to marketplace
api-oss marketplace publish --file ./my-plugin.wasm --manifest ./manifest.toml

# Search marketplace
api-oss marketplace search "data mining"

# Show marketplace item details
api-oss marketplace info "plugin-name"
```

## Plugin Management

```bash
# List installed plugins
api-oss plugin list

# Install a plugin from file
api-oss plugin install --file ./my-plugin.wasm

# Install from URL
api-oss plugin install --url https://example.com/plugins/plugin.wasm

# Enable/disable a plugin
api-oss plugin enable "my-plugin"
api-oss plugin disable "my-plugin"

# Remove a plugin
api-oss plugin remove "my-plugin"

# Show plugin details
api-oss plugin info "my-plugin"

# Update a plugin
api-oss plugin update "my-plugin"
```

## WASM Module Management

```bash
# List WASM modules
api-oss wasm list

# Load a WASM module
api-oss wasm load --file ./module.wasm

# Run a WASM function
api-oss wasm run --module "my-module" --function "process" --args '{"input": "test"}'

# Show module info
api-oss wasm info "my-module"

# Unload a module
api-oss wasm unload "my-module"

# Set module permissions
api-oss wasm perm "my-module" --allow-network --allow-fs-read /data/
```

## Shell Completion

```bash
# Generate Bash completion
api-oss completion bash > /etc/bash_completion.d/api-oss

# Generate Zsh completion
api-oss completion zsh > /usr/local/share/zsh/site-functions/_api-oss

# Generate Fish completion
api-oss completion fish > ~/.config/fish/completions/api-oss.fish

# Generate PowerShell completion
api-oss completion powershell > api-oss.ps1
```

## TPM Attestation

```bash
# Show TPM status
api-oss tpm status

# Generate attestation report
api-oss tpm attest --output attestation.json

# Verify attestation from a remote peer
api-oss tpm verify --report remote-attestation.json

# Get TPM PCR values
api-oss tpm pcr --list
```

## File Safety

```bash
# Scan a file for malware
api-oss filesafety scan ./suspicious-file.pdf

# Scan a directory
api-oss filesafety scan ./incoming/ --recursive

# Show scan history
api-oss filesafety history

# Update virus definitions
api-oss filesafety update
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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
