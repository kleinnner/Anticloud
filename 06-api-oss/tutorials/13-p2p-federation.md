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
