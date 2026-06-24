---
title: "Case Study 6: Energy Company — Offline Field Operations"
sidebar_position: 6
description: "Field geologists worked in remote locations with zero internet. They needed:"
tags: [case-study]
---

# Case Study 6: Energy Company — Offline Field Operations

## Customer Profile

| Attribute | Value |
|-----------|-------|
| **Customer** | Oil & gas exploration company (5,000 employees) |
| **Requirement** | AI for field workers with NO internet connectivity |
| **Users** | 200+ field geologists + engineers |
| **Previous solution** | Paper maps, field notebooks, 3G satellite (limited) |
| **Deployment** | Laptops + rugged tablets (fully offline) |

## Challenge

Field geologists worked in remote locations with zero internet. They needed:
- AI-powered geological analysis on-site
- No cloud dependency whatsoever
- Works on low-power laptops (no GPU)
- Sync when back at base camp (weekly)
- Maps, sensor data, historical drilling records available offline

## Solution

```yaml
API-OSS deployed on ruggedized laptops:
  - Tiny model (Phi-3 quantized to Q4, <2GB RAM)
  - Pre-loaded geological maps (OpenStreetMap tiles)
  - Sensor data ingestion (CSV from field instruments)
  - Materialized views: historical drilling data offline
  - PWA: works in mobile browser on tablet
  - Sync: P2P sync when multiple laptops in range at base camp
```

## Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Geological analysis time | 1 day (send to HQ) | 15 minutes (on-site) | 97% faster |
| Drilling decisions per week | 3 | 12 | 4x |
| Satellite data costs | $5K/month | $500/month (minimal) | 90% reduction |
| Data lost in field | 15% of observations | <1% | 93% improvement |
| Field worker satisfaction | 4/10 | 9/10 | +125% |

## Key Takeaways

1. Offline AI is a huge market (oil & gas, mining, military, humanitarian)
2. Tiny quantized models + pre-loaded data = viable
3. Materialized views made offline data usable
4. P2P sync eliminated need for internet
5. PWA on tablets was the killer delivery channel

## ROI

```yaml
Deployment cost: $250K (software + ruggedized hardware + training)
Annual savings: $2.8M (satellite costs + drilling efficiency)
Payback period: <3 months
Drilling accuracy improvement: +22%
```

## See Also

Related case studies, sales, and commercial documentation.

- [Case Studies](../case-studies/01-defense-contractor.md)
- [Monetization Guide](../monetization/01-business-model-landscape.md)
- [Sales Playbook](../sales/01-battle-cards.md)
- [Commercial Guide](../commercial/01-commercial-overview.md)
