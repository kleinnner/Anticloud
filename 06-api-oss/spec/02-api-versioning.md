---
title: "API Versioning Guide"
sidebar_position: 2
description: "API-OSS uses URL-based versioning for the API."
tags: [spec]
---

# API Versioning Guide

## Overview

API-OSS uses URL-based versioning for the API.

## Versioning Scheme

```
https://api.example.com/v1/chat
                       ^^
                   Major version
```

## Current Versions

| Version | Status | Release | EOL |
|---|---|---|---|
| v1 | Active | 2024-06 | — |
| v2 | Active | 2024-10 | — |
| v3 | Preview | 2025-04 | — |

## Version Policy

### Breaking Changes

Breaking changes require a new major version:

- Endpoint removal or rename
- Request/response schema changes
- Authentication/authorization changes
- Error format changes
- Rate limit behavior changes

### Non-Breaking Changes

Can be added to existing versions:

- New optional fields in responses
- New endpoints
- New HTTP methods on existing endpoints
- Enhanced error messages
- New query parameters

## Version Headers

```http
# Request version via header
GET /v1/chat
Accept-Version: 1.2

# Response version header
API-Version: 1.2
Deprecated: true
Sunset: Sun, 31 Dec 2025 23:59:59 GMT
```

## Migration

```bash
# Test against new version
curl https://api.example.com/v2/chat \
  -H "Authorization: Bearer sk-test" \
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"Hello"}]}'
```

## Next

- [03 Changelog & Breaking Changes](03-changelog-breaking-changes.md)

## See Also

Related spec, API reference, and code generation documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [API Reference](../api-reference/01-overview.md)
- [API Versioning](../spec/02-api-versioning.md)
- [Code Generation](../spec/04-code-generation.md)
