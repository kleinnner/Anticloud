---
title: "Decision Guide: Rate Limiting"
sidebar_position: 6
description: "Which rate limiting algorithm and tier should I use?"
tags: [decision-guides]
---

# Decision Guide: Rate Limiting

## Question

Which rate limiting algorithm and tier should I use?

## Decision Tree

```
Do you need distributed rate limiting?
├── Yes → Redis-backed algorithm
│   ├── Need precise control? → Token bucket
│   └── Need simplicity? → Sliding window
└── No → Local algorithm
    ├── Need simplicity? → Fixed window
    └── Need fairness? → Token bucket
```

## Algorithm Comparison

| Algorithm | Fairness | Memory | Precision | Redis Required |
|---|---|---|---|---|
| Fixed window | Low | Low | Low | No |
| Sliding window | High | Medium | High | No |
| Token bucket | High | Low | Medium | No |
| Redis sliding | High | Medium | High | Yes |
| Redis token | High | Low | Medium | Yes |

## Tier Recommendation

```yaml
free_tier:
  algorithm: Sliding window
  rate: 100 req/hour
  burst: 10
  storage: Local

pro_tier:
  algorithm: Token bucket
  rate: 10000 req/hour
  burst: 100
  storage: Redis

enterprise_tier:
  algorithm: Redis token bucket
  rate: 100000 req/hour
  burst: 1000
  storage: Redis cluster
```

## Next

- [Database Choice Guide](07-database-choice-guide.md)

## See Also

Related decision guides, architecture, and deployment documentation.

- [Decision Guides Overview](../decision-guides/01-decision-guides-overview.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [Deployment Guide](../deployment/01-overview.md)
- [Recipes](../recipes/01-recipes-overview.md)
