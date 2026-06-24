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
