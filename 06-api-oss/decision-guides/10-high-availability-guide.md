---
title: "Decision Guide: High Availability"
sidebar_position: 10
description: "What HA level do I need?"
tags: [decision-guides]
---

# Decision Guide: High Availability

## Question

What HA level do I need?

## Decision Tree

```
What's your uptime requirement?
├── 99.9% (8.7h downtime/year) → Single node + backups
├── 99.95% (4.4h/year) → 2 nodes + DB replica
├── 99.99% (52min/year) → 3 nodes + multi-AZ
└── 99.999% (5min/year) → Multi-region federation
```

## HA Tiers

| Tier | Nines | Downtime/year | Architecture | Cost |
|---|---|---|---|---|
| Bronze | 99.9% | 8.7h | Single + backups | $ |
| Silver | 99.95% | 4.4h | 2 nodes + replica | $$ |
| Gold | 99.99% | 52min | 3 nodes + multi-AZ | $$$ |
| Platinum | 99.999% | 5min | Multi-region federation | $$$$ |

## Recommendation

```yaml
development:
  tier: Bronze
  reason: "No SLA required, cost-effective"

production_small:
  tier: Silver
  reason: "Good balance of cost and reliability"

production_enterprise:
  tier: Gold
  reason: "Enterprise SLA requirements"

global:
  tier: Platinum
  reason: "Multi-region, max reliability"
```

## Next

- [Decision Guides Index](10-decision-guides-index.md)

## See Also

Related decision guides, architecture, and deployment documentation.

- [Decision Guides Overview](../decision-guides/01-decision-guides-overview.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [Deployment Guide](../deployment/01-overview.md)
- [Recipes](../recipes/01-recipes-overview.md)
