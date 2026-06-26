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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com