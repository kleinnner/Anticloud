---
title: "Decision Guide: Federation Strategy"
sidebar_position: 4
description: "When should I use P2P federation?"
tags: [decision-guides]
---

# Decision Guide: Federation Strategy

## Question

When should I use P2P federation?

## Decision Tree

```
Do you have multiple regions?
├── No → Federation not needed
└── Yes → Do you need automatic failover?
    ├── No → Federation not needed
    └── Yes → Do you need <30s RTO?
        ├── No → Backup + restore is sufficient
        └── Yes → Do you need <5min RPO?
            ├── No → Async federation
            └── Yes → Active-active federation
```

## Federation Tiers

| Tier | RPO | RTO | Complexity | Cost |
|---|---|---|---|---|
| None | 1h | 4h | Low | Low |
| Async | 5min | 30min | Medium | Medium |
| Active-Active | 0 | 5min | High | High |

## When to Federate

```yaml
federate:
  - Multi-region HA required
  - RTO < 30 minutes
  - Cross-region data sync needed
  - Global user base

dont_federate:
  - Single region deployment
  - RTO > 4 hours acceptable
  - Low availability requirements
  - Simple development/staging
```

## Next

- [Caching Strategy Guide](05-caching-strategy-guide.md)

## See Also

Related decision guides, architecture, and deployment documentation.

- [Decision Guides Overview](../decision-guides/01-decision-guides-overview.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [Deployment Guide](../deployment/01-overview.md)
- [Recipes](../recipes/01-recipes-overview.md)
