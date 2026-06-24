---
title: "Decision Guide: Monitoring Stack"
sidebar_position: 8
description: "Which monitoring stack should I use?"
tags: [decision-guides]
---

# Decision Guide: Monitoring Stack

## Question

Which monitoring stack should I use?

## Decision Tree

```
Do you have existing monitoring?
├── Yes → Integrate with existing stack
└── No → What's your budget?
    ├── $0 → Prometheus + Grafana (self-hosted)
    ├── $$ → Grafana Cloud
    └── $$$ → Datadog
```

## Stack Comparison

| Feature | Prometheus + Grafana | Grafana Cloud | Datadog |
|---|---|---|---|
| Cost | Free (self-host) | $0-200/mo | $15+/host/mo |
| Setup effort | High | Low | Low |
| Scalability | Self-managed | Managed | Managed |
| Alerting | Alertmanager | Built-in | Built-in |
| Logs | + Loki | + Loki | Built-in |
| Traces | + Tempo | + Tempo | APM |
| Dashboards | Grafana | Grafana | Datadog |

## Recommendation

```yaml
startup:
  stack: "Prometheus + Grafana"
  cost: "$0 (self-hosted on same infra)"
  reason: "Free, open source, flexible"

mid_market:
  stack: "Grafana Cloud"
  cost: "$200/mo"
  reason: "Managed, good value"

enterprise:
  stack: "Datadog"
  cost: "$1,000+/mo"
  reason: "All-in-one, APM, SIEM integration"

existing_datadog:
  stack: "Datadog (integrate)"
  reason: "Leverage existing investment"
```

## Next

- [Security Level Guide](09-security-level-guide.md)

## See Also

Related decision guides, architecture, and deployment documentation.

- [Decision Guides Overview](../decision-guides/01-decision-guides-overview.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [Deployment Guide](../deployment/01-overview.md)
- [Recipes](../recipes/01-recipes-overview.md)
