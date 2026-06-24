---
title: "Tutorial 13: P2P Federation"
sidebar_position: 13
description: "Connect two API-OSS instances together via P2P federation for multi-site orchestration."
tags: [tutorials]
---

# Tutorial 13: P2P Federation

## Objective

Connect two API-OSS instances together via P2P federation for multi-site orchestration.

## Prerequisites

- Two API-OSS instances running (or two Docker containers)
- Network connectivity between them

## Step 1: Start Two Instances

```bash
# Instance A (Site 1)
docker run -d --name apioss-a \
  -p 8081:8080 \
  -p 3031:3030 \
  -e APIOSS_ADMIN_PASSWORD=pass \
  -e APIOSS_SITE_ID=site-a \
  api-oss:latest

# Instance B (Site 2)
docker run -d --name apioss-b \
  -p 8082:8080 \
  -p 3032:3030 \
  -e APIOSS_ADMIN_PASSWORD=pass \
  -e APIOSS_SITE_ID=site-b \
  api-oss:latest
```

## Step 2: Configure Bridge on Site A

```bash
curl -X POST http://localhost:8081/api/v1/bridges \
  -H "X-Admin-Key: pass" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Link to Site B",
    "remote_url": "http://host.docker.internal:8082",
    "remote_key": "api_adm_abc123...",
    "type": "bidirectional",
    "sync_config": true,
    "sync_routes": true,
    "sync_models": true
  }'
```

## Step 3: Share a Route Across Sites

```bash
# Register a model on Site B
curl -X POST http://localhost:8082/api/v1/models \
  -H "X-Admin-Key: pass" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model_name": "gpt-4",
    "share_via_bridge": true
  }'
```

## Step 4: Access Remote Model from Site A

```bash
# This model is proxied through Site B via the bridge
curl -X POST http://localhost:8081/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bridge://site-b/gpt-4",
    "messages": [{"role": "user", "content": "Hello from Site A!"}]
  }'
```

## Step 5: Check Bridge Status

```bash
curl http://localhost:8081/api/v1/bridges \
  -H "X-Admin-Key: pass"

curl http://localhost:8081/api/v1/bridges/bridge-abc/stats \
  -H "X-Admin-Key: pass"
```

## Step 6: Enable P2P Discovery

```bash
curl -X PUT http://localhost:8081/api/v1/config \
  -H "X-Admin-Key: pass" \
  -H "Content-Type: application/json" \
  -d '{
    "p2p": {
      "discovery_enabled": true,
      "discovery_port": 3030,
      "known_peers": ["site-b@host.docker.internal:3032"]
    }
  }'
```

## What You Learned

- Starting multiple API-OSS instances
- Configuring P2P bridges
- Sharing models across sites
- Cross-site API proxying
- Bridge monitoring

## Next Tutorial

→ [14: Secrets with Vault](14-secrets-vault.md)

## See Also

Related tutorials, cookbooks, and API reference documentation.

- [User Manual](../user-manual/01-getting-started.md)
- [Code Cookbooks](../code-cookbooks/01-getting-started.md)
- [Developer Guides](../developer-guides/01-why-build-on-apioss.md)
- [API Reference](../api-reference/01-overview.md)
