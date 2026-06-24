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
