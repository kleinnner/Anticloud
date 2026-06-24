---
title: "Tutorial 03: Authentication & API Keys"
sidebar_position: 3
description: "Secure your API with authentication, API keys, and rate limiting."
tags: [tutorials]
---

# Tutorial 03: Authentication & API Keys

## Objective

Secure your API with authentication, API keys, and rate limiting.

## Prerequisites

- API-OSS running
- Tutorial 01-02 completed (or routes configured)

## Step 1: Change Admin Password

```bash
curl -X POST http://localhost:8080/api/v1/auth/password \
  -H "X-Admin-Key: admin" \
  -H "Content-Type: application/json" \
  -d '{
    "current": "admin",
    "new": "Your$trongP@ssw0rd!"
  }'
```

## Step 2: Create an API Key

```bash
curl -X POST http://localhost:8080/api/v1/keys \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App Key",
    "type": "standard"
  }'
```

Save the returned key — it's shown only once:
```json
{
  "id": "key_abc123",
  "name": "My App Key",
  "key": "api_std_a1b2c3d4e5f6..."
}
```

## Step 3: Require Authentication on a Route

```bash
curl -X PUT http://localhost:8080/api/v1/routes/route-abc \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "auth_required": true
  }'
```

## Step 4: Call with Authentication

```bash
# Without key — should fail
curl http://localhost:8080/v1/hello
# 401 Unauthorized

# With key — should work
curl http://localhost:8080/v1/hello \
  -H "Authorization: Bearer ak_a1b2c3d4e5f6..."
# 200 OK
```

## Step 5: Add Rate Limiting

```bash
curl -X PUT http://localhost:8080/api/v1/routes/route-abc \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "rate_limit": 5,
    "rate_limit_window": 60
  }'
```

Now you can only call this route 5 times per minute.

## Step 6: Test Rate Limits

```bash
# Rapid requests
for i in {1..10}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    http://localhost:8080/v1/hello \
    -H "Authorization: Bearer ak_a1b2c3d4e5f6..."
done
```

After 5 requests, you'll see `429 Too Many Requests`.

## What You Learned

- Changing admin password
- Creating API keys
- Requiring authentication
- Rate limiting routes

## Next Tutorial

→ [04: Add a Plugin](04-add-plugin.md)

## See Also

Related tutorials, cookbooks, and API reference documentation.

- [User Manual](../user-manual/01-getting-started.md)
- [Code Cookbooks](../code-cookbooks/01-getting-started.md)
- [Developer Guides](../developer-guides/01-why-build-on-apioss.md)
- [API Reference](../api-reference/01-overview.md)
