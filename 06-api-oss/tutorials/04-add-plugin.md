---
title: "Tutorial 04: Add a Plugin"
sidebar_position: 4
description: "Install and configure a plugin to modify request/response behavior."
tags: [tutorials]
---

# Tutorial 04: Add a Plugin

## Objective

Install and configure a plugin to modify request/response behavior.

## Prerequisites

- API-OSS running
- Tutorial 01-03 completed

## Step 1: Browse Available Plugins

```bash
curl http://localhost:8080/api/v1/marketplace \
  -H "X-Admin-Key: Your$trongP@ssw0rd!"
```

Sample response:
```json
[
  {"name": "org.example/cors", "version": "1.0.0", "description": "CORS headers"},
  {"name": "org.example/logging", "version": "2.0.0", "description": "Enhanced logging"},
  {"name": "org.example/cache", "version": "1.5.0", "description": "Response caching"}
]
```

## Step 2: Install the Logging Plugin

```bash
curl -X POST http://localhost:8080/api/v1/plugins \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "org.example/logging",
    "version": "2.0.0"
  }'
```

## Step 3: Configure the Plugin

```bash
curl -X PUT http://localhost:8080/api/v1/plugins/org.example/logging/config \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "log_request_body": true,
    "log_response_body": true,
    "exclude_paths": ["/health"]
  }'
```

## Step 4: Attach Plugin to a Route

```bash
curl -X PUT http://localhost:8080/api/v1/routes/route-abc \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "plugins": ["org.example/logging"]
  }'
```

## Step 5: Test the Plugin

```bash
# Make a request
curl http://localhost:8080/v1/hello -H "Authorization: Bearer ak_..."

# View logs
docker logs apioss | grep "logging"
```

You'll see detailed request/response logs.

## Step 6: Disable the Plugin

```bash
curl -X POST http://localhost:8080/api/v1/plugins/org.example/logging/disable \
  -H "X-Admin-Key: Your$trongP@ssw0rd!"
```

## What You Learned

- Browsing the plugin marketplace
- Installing plugins
- Configuring plugins
- Attaching plugins to routes
- Enabling/disabling plugins

## Next Tutorial

→ [05: Connect a Database](05-connect-database.md)

## See Also

Related tutorials, cookbooks, and API reference documentation.

- [User Manual](../user-manual/01-getting-started.md)
- [Code Cookbooks](../code-cookbooks/01-getting-started.md)
- [Developer Guides](../developer-guides/01-why-build-on-apioss.md)
- [API Reference](../api-reference/01-overview.md)
