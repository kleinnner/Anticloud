---
title: "Decision Guide: Database Choice"
sidebar_position: 7
description: "Which database should I use with API-OSS?"
tags: [decision-guides]
---

# Decision Guide: Database Choice

## Question

Which database should I use with API-OSS?

## Decision Tree

```
Do you need <1ms query latency?
├── Yes → Do you need complex queries?
│   ├── Yes → PostgreSQL with connection pooling
│   └── No → Redis (for simple KV)
└── No → What's your scale?
    ├── <10GB → SQLite (embedded)
    ├── <100GB → PostgreSQL (single node)
    └── 100GB+ → PostgreSQL (partitioned + read replicas)
```

## Database Comparison

| Feature | PostgreSQL | MySQL | SQLite | Redis |
|---|---|---|---|---|
| Performance | Excellent | Good | Good (single) | Excellent |
| Features | Rich | Good | Basic | Basic |
| Scaling | Read replicas | Replicas | None | Cluster |
| ACID | Yes | Configurable | Yes | No |
| JSON support | Excellent | Good | Limited | Limited |
| Extensions | Rich | Limited | None | Lua |

## Recommendation

```yaml
default: PostgreSQL 15+
reason: "Best feature set, JSON support, extensions"

small_deployments:
  option: SQLite + PostgreSQL
  reason: "SQLite for config, PG for audit"

high_performance:
  option: PostgreSQL + Redis
  reason: "PG for persistence, Redis for caching"

distributed:
  option: PostgreSQL (Citus)
  reason: "Horizontal scaling for large deployments"
```

## Next

- [Monitoring Stack Guide](08-monitoring-stack-guide.md)

## See Also

Related decision guides, architecture, and deployment documentation.

- [Decision Guides Overview](../decision-guides/01-decision-guides-overview.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [Deployment Guide](../deployment/01-overview.md)
- [Recipes](../recipes/01-recipes-overview.md)
