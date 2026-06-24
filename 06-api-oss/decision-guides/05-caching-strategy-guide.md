---
title: "Decision Guide: Caching Strategy"
sidebar_position: 5
description: "What should I cache and how?"
tags: [decision-guides]
---

# Decision Guide: Caching Strategy

## Question

What should I cache and how?

## Decision Tree

```
Is the response deterministic (same input = same output)?
├── Yes → Is it expensive to generate?
│   ├── Yes → Cache it
│   └── No → Don't cache
└── No → Can you use semantic caching?
    ├── Yes → Vector-based cache
    └── No → Don't cache
```

## Cache Types

| Type | Use Case | TTL | Storage |
|---|---|---|---|
| Response cache | Deterministic endpoints | 5-60 min | Local memory |
| Semantic cache | Similar queries | 1-24h | Vector DB |
| Token cache | Repeated requests | Session | Local memory |
| Rate limit cache | Auth checks | Varies | Redis |

## Cache Recommendation

```yaml
embeddings:
  cache: Response cache
  ttl: 1 hour
  reason: "Deterministic, expensive"

chat:
  cache: Semantic cache (optional)
  ttl: Varies
  reason: "Non-deterministic, similar queries"

health:
  cache: None
  reason: "Lightweight, changes frequently"

models:
  cache: Response cache
  ttl: 1 hour
  reason: "Rarely changes, frequent requests"
```

## Next

- [Rate Limiting Guide](06-rate-limiting-guide.md)

## See Also

Related decision guides, architecture, and deployment documentation.

- [Decision Guides Overview](../decision-guides/01-decision-guides-overview.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [Deployment Guide](../deployment/01-overview.md)
- [Recipes](../recipes/01-recipes-overview.md)
