---
title: "Tutorial 05: Connect a Database"
sidebar_position: 5
description: "Connect API-OSS to a PostgreSQL database and create data-driven routes."
tags: [tutorials]
---

# Tutorial 05: Connect a Database

## Objective

Connect API-OSS to a PostgreSQL database and create data-driven routes.

## Prerequisites

- API-OSS running
- Docker installed (for running PostgreSQL)

## Step 1: Start PostgreSQL

```bash
docker run -d --name postgres \
  -e POSTGRES_DB=app \
  -e POSTGRES_USER=app_user \
  -e POSTGRES_PASSWORD=pass \
  -p 5432:5432 \
  postgres:16-alpine
```

## Step 2: Add the Database as a Data Source

```bash
curl -X POST http://localhost:8080/api/v1/datasources \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "App Database",
    "type": "postgres",
    "host": "host.docker.internal",
    "port": 5432,
    "database": "app",
    "username": "app_user",
    "password": "pass"
  }'
```

## Step 3: Test the Connection

```bash
curl -X POST http://localhost:8080/api/v1/datasources/ds-abc/test \
  -H "X-Admin-Key: Your$trongP@ssw0rd!"
```

## Step 4: Create a Table

```bash
# Via API-OSS query route
curl -X POST http://localhost:8080/api/v1/routes \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/v1/db/setup",
    "datasource": "ds-abc",
    "query": "CREATE TABLE IF NOT EXISTS items (id SERIAL PRIMARY KEY, name TEXT, created_at TIMESTAMPTZ DEFAULT now())",
    "methods": ["POST"]
  }'
```

## Step 5: Create a Data Route

```bash
curl -X POST http://localhost:8080/api/v1/routes \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/v1/items",
    "datasource": "ds-abc",
    "query": "SELECT * FROM items ORDER BY created_at DESC LIMIT 100",
    "methods": ["GET"]
  }'
```

## Step 6: Insert Data

```bash
curl -X POST http://localhost:8080/api/v1/routes \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/v1/items",
    "datasource": "ds-abc",
    "query": "INSERT INTO items (name) VALUES ($1) RETURNING *",
    "params": {"name": "body"},
    "methods": ["POST"]
  }'
```

## Step 7: Test

```bash
# Insert
curl -X POST http://localhost:8080/v1/items \
  -H "Content-Type: application/json" \
  -d '{"name": "My First Item"}'

# List
curl http://localhost:8080/v1/items
```

## What You Learned

- Starting PostgreSQL
- Registering data sources
- Testing connections
- Creating data-driven routes
- Using parameterized queries

## Next Tutorial

→ [06: Build a Workflow](06-build-workflow.md)

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
