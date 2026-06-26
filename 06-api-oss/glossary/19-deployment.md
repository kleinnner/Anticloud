---
title: "Glossary 19: Deployment Glossary"
sidebar_position: 19
description: "Documentation for Glossary 19: Deployment Glossary"
tags: [glossary]
---

# Glossary 19: Deployment Glossary

## Terms

### Single Binary
- API-OSS distributed as one executable file
- No dependencies, no runtime, no VM required

### Docker Image
- Containerized API-OSS for Docker deployment
- Available on Docker Hub and GitHub Container Registry

### Helm Chart
- Kubernetes deployment template
- Configure models, replicas, storage, networking

### Installer
- Setup wizard for guided installation
- Supports: interactive, silent, unattended modes

### Quick Start
- Minimal configuration to get API-OSS running
- `api-oss init` + `api-oss serve` = running in 60 seconds

### Config File
- TOML-format file controlling API-OSS behavior
- Location: `config.toml` in data directory or custom path

### Environment Variable
- Configuration via OS environment variables
- Overrides config file values, useful for Docker/K8s

### Data Directory
- Where API-OSS stores all persistent data
- Default: `./data/` relative to binary location

### Model Directory
- Where model files are stored
- Configurable path for model storage

### Port Configuration
- Network ports for API-OSS services
- Defaults: 3030 (WebSocket API), 8080 (HTTP UI)

### Logging
- System event recording for debugging and monitoring
- Levels: error, warn, info, debug, trace

### Health Check
- Endpoint to verify service is running
- API-OSS provides `/health` endpoint

### Graceful Shutdown
- Cleanly stopping API-OSS without data loss
- Handles: pending queries, index saves, cache flush

### Update / Upgrade
- Replacing API-OSS binary with newer version
- API-OSS supports: binary swap, Docker pull, package manager

### Rollback
- Reverting to previous version
- Data directory forward-compatible within minor versions

### Migration
- Updating data format between versions
- Automatic on startup (backup recommended first)

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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
