---
title: "Tutorial 01: Hello World"
sidebar_position: 1
description: "Deploy API-OSS and make your first API call."
tags: [tutorials]
---

# Tutorial 01: Hello World

## Objective

Deploy API-OSS and make your first API call.

## Prerequisites

- Docker installed (or download the binary)
- Terminal access

## Step 1: Start API-OSS

```bash
docker run -d --name apioss -p 8080:8080 api-oss:latest

# Wait for it to start
sleep 5
docker logs apioss
```

You should see: `Server started on port 8080`

## Step 2: Check Health

```bash
curl http://localhost:8080/health
```

Response:
```json
{"status":"healthy","version":"2.2.0","uptime":5}
```

## Step 3: Create Your First Route

```bash
# Create a route that proxies to httpbin
curl -X POST http://localhost:8080/api/v1/routes \
  -H "X-Admin-Key: admin" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/v1/hello",
    "upstream": "https://httpbin.org/anything",
    "methods": ["GET"]
  }'
```

## Step 4: Call Your Route

```bash
curl http://localhost:8080/v1/hello
```

You should get a JSON response back from httpbin.

## Step 5: View Route Stats

```bash
curl http://localhost:8080/api/v1/stats?period=1h \
  -H "X-Admin-Key: admin"
```

## What You Learned

- Starting API-OSS
- Health check
- Creating a route
- Making an API call
- Viewing basic stats

## Next Tutorial

→ [02: Chat with an LLM](02-chat-with-llm.md)

## See Also

Related tutorials, cookbooks, and API reference documentation.

- [User Manual](../user-manual/01-getting-started.md)
- [Code Cookbooks](../code-cookbooks/01-getting-started.md)
- [Developer Guides](../developer-guides/01-why-build-on-apioss.md)
- [API Reference](../api-reference/01-overview.md)
