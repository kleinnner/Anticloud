---
title: "Decision Guide: Deployment Model"
sidebar_position: 2
description: "Should I self-host, use managed cloud, or hybrid?"
tags: [decision-guides]
---

# Decision Guide: Deployment Model

## Question

Should I self-host, use managed cloud, or hybrid?

## Decision Tree

```
Do you have compliance requirements (HIPAA, FedRAMP)?
├── Yes → Self-host (on-premise or air-gapped)
└── No → Do you have DevOps team?
    ├── Yes → Self-host (any platform)
    └── No → Do you need data sovereignty?
        ├── Yes → Self-host (simplified Docker)
        └── No → Managed cloud (optional)
```

## Comparison

| Factor | Self-Host | Managed Cloud | Hybrid |
|---|---|---|---|
| Data control | Full | Shared | Full |
| Ops overhead | High | Low | Medium |
| Customization | Full | Limited | Full |
| Cost (low vol) | Higher | Lower | Medium |
| Cost (high vol) | Lower | Higher | Lower |
| Compliance | Full control | Provider-dependent | Full control |

## Recommendation Matrix

```yaml
scenarios:
  startup_mvp:
    recommendation: Self-host (Docker)
    reason: "Free, full control, low volume"

  mid_market:
    recommendation: Self-host (Kubernetes)
    reason: "DevOps team, growing volume"

  enterprise:
    recommendation: Self-host (HA/federation)
    reason: "Compliance, high volume"

  no_ops:
    recommendation: Managed cloud
    reason: "No operations team"
```

## Next

- [Plugin Runtime Guide](03-plugin-runtime-guide.md)

## See Also

Related decision guides, architecture, and deployment documentation.

- [Decision Guides Overview](../decision-guides/01-decision-guides-overview.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [Deployment Guide](../deployment/01-overview.md)
- [Recipes](../recipes/01-recipes-overview.md)
