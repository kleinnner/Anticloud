---
title: "API Reference 01: Overview & Getting Started"
sidebar_position: 1
description: "AI-OSS exposes four API surfaces:"
tags: [api]
---

# API Reference 01: Overview & Getting Started

## API Surface

AI-OSS exposes four API surfaces:

| Interface | Protocol | Default Port | Auth | Primary Use |
|-----------|----------|-------------|------|-------------|
| WebSocket | ws/wss | 3030 | API Key + JWT | Real-time AI interactions |
| REST | HTTP | 8080 | API Key | CRUD operations, management |
| pgwire | TCP | 5432 | Username/password | PostgreSQL-compatible queries |
| MCP | stdio/HTTP | 3031 | API Key | Tool integration with MCP clients |

## Base URLs

```yaml
Local:        http://localhost:8080/v1
Docker:       http://ai-oss:8080/v1
K8s (in-cluster): http://ai-oss-service:8080/v1
Custom domain: https://ai-oss.example.com/v1
WebSocket:    ws://localhost:3030/ws
```

## Authentication

All API requests require an API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  http://localhost:8080/v1/chat/completions
```

### API Key Types

| Key Type | Prefix | Permissions | Use Case |
|----------|--------|-------------|----------|
| Admin | `sk-aioss-admin-` | Full access | Infrastructure management |
| Write | `sk-aioss-write-` | Read + Write | Applications, CI/CD |
| Read | `sk-aioss-read-` | Read-only | Monitoring, dashboards |
| Bridge | `sk-aioss-bridge-` | Bridge + limited AI | Chat bridges |

## SDKs

| Language | Package | Install |
|----------|---------|---------|
| Python | `api-oss` | `pip install api-oss` |
| JavaScript | `@your-org/sdk` | `npm install @your-org/sdk` |
| Rust | `api-oss` | `cargo add api-oss` |

## Quick Start (Python)

```python
from api_oss import APIOSS

client = APIOSS(
    api_key="sk-aioss-xxxxxxxxxxxx",
    base_url="http://localhost:8080/v1"
)

# Chat completion
response = client.chat.completions.create(
    model="qwen2.5-7b-q4",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

## Quick Start (JavaScript)

```javascript
import { APIOSS } from '@your-org/sdk';

const client = new APIOSS({
  apiKey: 'sk-aioss-xxxxxxxxxxxx',
  baseURL: 'http://localhost:8080/v1'
});

const response = await client.chat.completions.create({
  model: 'qwen2.5-7b-q4',
  messages: [{ role: 'user', content: 'Hello!' }]
});
console.log(response.choices[0].message.content);
```

## Versioning

API is versioned via URL path (`/v1/`). Breaking changes trigger a new version. The current version is **v1**. Deprecated endpoints return a `Warning` header with sunset date.

## Content Type

All requests and responses use `application/json` unless specified otherwise.

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)
