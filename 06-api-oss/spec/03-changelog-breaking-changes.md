---
title: "Changelog & Breaking Changes"
sidebar_position: 3
description: "Track API specification changes across versions."
tags: [spec]
---

# Changelog & Breaking Changes

## Overview

Track API specification changes across versions.

## v3.0.0 Breaking Changes

| Change | Old | New |
|---|---|---|
| Chat response format | `choices[0].text` | `choices[0].message.content` |
| Error response format | `{"error": "msg"}` | `{"error": {"message": "...", "code": "...", "type": "..."}}` |
| Rate limit headers | `X-RateLimit-*` | `X-RateLimit-Remaining`, `X-RateLimit-Reset` |
| Auth header | `Authorization: Bearer sk-*` | `Authorization: Bearer ak-*` |

## v2.0.0 Breaking Changes

| Change | Old | New |
|---|---|---|
| Admin API base | `/admin/*` | `/v2/admin/*` |
| Key format | `sk-*` | `ak-*` |
| Pagination | `offset/limit` | `page/per_page` cursor |
| WebSocket protocol | JSON only | JSON + binary frames |

## v1.2.0 Breaking Changes

| Change | Old | New |
|---|---|---|
| Log format | Text | JSON |
| Rate limit headers | `X-RateLimit-Limit` | `X-RateLimit-Remaining`, `X-RateLimit-Reset` |

## Deprecation Schedule

| Version | Deprecated | Sunset |
|---|---|---|
| v1.0 | 2024-10 | 2025-06 |
| v1.1 | 2024-10 | 2025-06 |
| v1.2 | 2025-04 | 2026-04 |

## Migration Paths

### v1.x to v2.x

```bash
# Update key format
apioss admin migrate-keys

# Update code
- s/Bearer sk-/Bearer ak-/g
- s/admin\//v2\/admin\//g
```

### v2.x to v3.x

```bash
# Migrate config
apioss config migrate v2-to-v3 config.yml

# Update SDK
npm install apioss-sdk@3
```

## Next

- [04 Code Generation](04-code-generation.md)

## See Also

Related spec, API reference, and code generation documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [API Reference](../api-reference/01-overview.md)
- [API Versioning](../spec/02-api-versioning.md)
- [Code Generation](../spec/04-code-generation.md)
