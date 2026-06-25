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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
