---
title: "Tutorial 14: Secrets with Vault"
sidebar_position: 14
description: "Integrate HashiCorp Vault for secure secrets management in API-OSS."
tags: [tutorials]
---

# Tutorial 14: Secrets with Vault

## Objective

Integrate HashiCorp Vault for secure secrets management in API-OSS.

## Prerequisites

- API-OSS running
- Docker installed

## Step 1: Start Vault

```bash
docker run -d --name vault \
  -p 8200:8200 \
  -e VAULT_DEV_ROOT_TOKEN_ID=root-token \
  -e VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200 \
  -e VAULT_ADDR=http://localhost:8200 \
  vault:latest
```

## Step 2: Store Secrets in Vault

```bash
# Store database credentials
curl -X POST http://localhost:8200/v1/secret/data/apioss/database \
  -H "X-Vault-Token: root-token" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "url": "postgres://apioss:pass@db:5432/apioss",
      "password": "s3cret_db_pass"
    }
  }'

# Store API keys
curl -X POST http://localhost:8200/v1/secret/data/apioss/keys \
  -H "X-Vault-Token: root-token" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "openai_key": "sk-abc123...",
      "slack_webhook": "https://hooks.slack.com/services/..."
    }
  }'
```

## Step 3: Configure API-OSS to Use Vault

```bash
curl -X PUT http://localhost:8080/api/v1/config \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "secrets": {
      "provider": "vault",
      "vault": {
        "address": "http://host.docker.internal:8200",
        "token": "root-token",
        "path": "secret/data/apioss",
        "kv_version": 2
      }
    }
  }'
```

## Step 4: Reference Secrets in Config

```bash
curl -X PUT http://localhost:8080/api/v1/config \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "db": {
      "url": "{{vault:database.url}}",
      "password": "{{vault:database.password}}"
    }
  }'
```

## Step 5: Verify Secrets Resolution

```bash
curl http://localhost:8080/api/v1/config \
  -H "X-Admin-Key: Your$trongP@ssw0rd!"

# The password field should show "resolved" (not the actual value)
```

## Step 6: Rotate a Secret

```bash
# Update in Vault
curl -X POST http://localhost:8200/v1/secret/data/apioss/keys \
  -H "X-Vault-Token: root-token" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "openai_key": "sk-new-key-..."
    }
  }'

# Reload API-OSS config
curl -X POST http://localhost:8080/api/v1/config/reload \
  -H "X-Admin-Key: Your$trongP@ssw0rd!"
```

## What You Learned

- Starting Vault in dev mode
- Storing secrets in Vault
- Configuring API-OSS to use Vault
- Referencing secrets in configuration
- Rotating secrets without restart

## Next Tutorial

→ [15: Production Readiness](15-production-readiness.md)

## See Also

Related tutorials, cookbooks, and API reference documentation.

- [User Manual](../user-manual/01-getting-started.md)
- [Code Cookbooks](../code-cookbooks/01-getting-started.md)
- [Developer Guides](../developer-guides/01-why-build-on-apioss.md)
- [API Reference](../api-reference/01-overview.md)
