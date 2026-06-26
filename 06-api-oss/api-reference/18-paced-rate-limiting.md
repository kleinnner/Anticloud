---
title: "API Reference 18: Rate Limiting"
sidebar_position: 18
description: "Every response includes rate limit headers:"
tags: [api]
---

# API Reference 18: Rate Limiting

## Rate Limit Tiers

| Tier | Requests/Min | Burst | Cost/Month |
|------|-------------|-------|------------|
| Free | 20 | 5 | $0 |
| Pro | 100 | 20 | $49 |
| Business | 500 | 100 | $199 |
| Enterprise | 5000 | 1000 | $999+ |
| Custom | Unlimited | Unlimited | Custom |

## Rate Limit Headers

Every response includes rate limit headers:

```text
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 487
X-RateLimit-Reset: 1717117200
X-RateLimit-Cost: 1
```

## Rate Limit Response (429)

```json
{
  "error": {
    "code": "rate_limited",
    "message": "Rate limit exceeded. Please retry after the specified time.",
    "type": "rate_limit_error",
    "retry_after": 12,
    "details": {
      "limit": 500,
      "remaining": 0,
      "reset_at": "2026-05-31T12:00:00Z"
    }
  }
}
```

## Per-Endpoint Limits

| Endpoint | Limit | Cost Per Request |
|----------|-------|-----------------|
| `POST /v1/chat/completions` | Tier limit | 1 |
| `POST /v1/completions` | Tier limit | 1 |
| `POST /v1/embeddings` | Tier limit × 10 | 1 |
| `GET /v1/models` | Tier limit × 100 | 0 |
| `POST /v1/graph/nodes` | Tier limit × 5 | 1 |
| `GET /v1/graph/search` | Tier limit × 10 | 0 |
| `POST /v1/documents/ingest` | Tier limit ÷ 2 | 10 |
| `POST /v1/council/deliberate` | Tier limit ÷ 2 | 5 |
| WebSocket messages | Tier limit × 2 | 1 |

## Rate Limit on WebSocket

WebSocket connections have message-level rate limiting. Exceeded connections receive:

```json
{
  "type": "error",
  "code": "rate_limited",
  "message": "Message rate exceeded. Slow down.",
  "retry_after_ms": 5000
}
```

## Concurrency Limits

| Tier | Concurrent Requests | Concurrent WS Connections |
|------|-------------------|--------------------------|
| Free | 1 | 1 |
| Pro | 5 | 5 |
| Business | 25 | 25 |
| Enterprise | 100 | 100 |

## Best Practices

```python
# 1. Implement exponential backoff
import time
from api_oss import RateLimitError

def api_call_with_retry(client, request_fn):
    for attempt in range(5):
        try:
            return request_fn()
        except RateLimitError as e:
            wait = e.retry_after * (2 ** attempt)
            time.sleep(min(wait, 60))

# 2. Batch requests when possible
# Instead of 100 individual requests, use batch endpoints

# 3. Cache responses
# GET /v1/models response rarely changes

# 4. Use WebSocket for streaming (reduces request count)
# One WebSocket connection = hundreds of messages without counting requests

# 5. Monitor rate limit headers
response = client.chat.completions.create(...)
remaining = int(response.headers.get('X-RateLimit-Remaining', 0))
if remaining < 10:
    time.sleep(5)  # proactive backoff
```

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ