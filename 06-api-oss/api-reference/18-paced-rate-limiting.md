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
