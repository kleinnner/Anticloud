---
title: "Case Study 10: MSP — Hosted AI Services"
sidebar_position: 10
description: "The MSP wanted to add AI to their service portfolio. Challenges:"
tags: [case-study]
---

# Case Study 10: MSP — Hosted AI Services

## Customer Profile

| Attribute | Value |
|-----------|-------|
| **Customer** | Managed Service Provider (IT services, 50 employees) |
| **Requirement** | Offer AI hosting as a managed service to 200+ clients |
| **Users** | 200+ small businesses (2–50 users each) |
| **Previous solution** | No AI service offering |
| **Deployment** | Multi-tenant API-OSS on MSP's infrastructure |

## Challenge

The MSP wanted to add AI to their service portfolio. Challenges:
- Their clients were SMBs with no AI expertise
- Each client had different compliance needs
- MSP needed a single management pane for all clients
- Clients expected fixed pricing (not usage-based)
- Easy onboarding (zero configuration for end clients)

## Solution

```yaml
Multi-tenant API-OSS deployment:
  - Control plane: MSP dashboard for managing all instances
  - Per-client API-OSS instance (isolated)
  - Standard pricing tiers (see docs/monetization/22-multi-tenant-msps)
  - Automated provisioning (client signs up → instance created)
  - Usage monitoring per client (for billing)
  - Branded as "MSP AI" (white-label)
```

## Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| New AI service offering | None | Launched in 4 weeks | — |
| Clients using AI | 0 | 150 | — |
| Monthly revenue from AI service | $0 | $45K | — |
| Client churn rate | 8%/yr | 4%/yr | 50% reduction |
| Average contract value | $500/mo | $800/mo | +60% increase |
| MSP support tickets/month | 50 | 120 (scalable) | Automated |

## Key Takeaways

1. MSPs are a force multiplier — one sale = 200+ end clients
2. White-labeling is essential (MSP puts their brand on it)
3. Fixed pricing is preferred over usage-based for MSPs
4. Multi-tenant control panel differentiated from competitors
5. Automated provisioning made onboarding seamless

## ROI

```yaml
Deployment cost: $50K (setup + training + control panel)
Monthly revenue: $45K (from 150 clients × $300 avg/mo)
Annual revenue: $540K
Gross margin: 70% (infrastructure cost ~$13.5K/mo)
Payback period: <2 months
Client retention: >95%
```

## See Also

Related case studies, sales, and commercial documentation.

- [Case Studies](../case-studies/01-defense-contractor.md)
- [Monetization Guide](../monetization/01-business-model-landscape.md)
- [Sales Playbook](../sales/01-battle-cards.md)
- [Commercial Guide](../commercial/01-commercial-overview.md)
