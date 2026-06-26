---
title: "Tutorial 07: Monitoring & Alerting"
sidebar_position: 7
description: "Set up monitoring dashboards and configure alerts for your API."
tags: [tutorials]
---

# Tutorial 07: Monitoring & Alerting

## Objective

Set up monitoring dashboards and configure alerts for your API.

## Prerequisites

- API-OSS running with traffic (create some from previous tutorials)

## Step 1: View Real-Time Metrics

```bash
# Stream metrics
curl -N http://localhost:8080/api/v1/stats?period=5m \
  -H "X-Admin-Key: Your$trongP@ssw0rd!"
```

## Step 2: Create an Alert

```bash
curl -X POST http://localhost:8080/api/v1/alerts \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "High Error Rate",
    "metric": "error_rate",
    "condition": "> 0.05",
    "duration": "5m",
    "severity": "warning",
    "channels": ["slack"]
  }'
```

## Step 3: Create a PagerDuty Alert

```bash
curl -X POST http://localhost:8080/api/v1/alerts \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Instance Down",
    "metric": "uptime",
    "condition": "== 0",
    "duration": "1m",
    "severity": "critical",
    "channels": ["pagerduty", "slack"]
  }'
```

## Step 4: List Active Alerts

```bash
curl http://localhost:8080/api/v1/alerts \
  -H "X-Admin-Key: Your$trongP@ssw0rd!"
```

## Step 5: Add a Slack Webhook Channel

```bash
curl -X POST http://localhost:8080/api/v1/channels \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "slack",
    "webhook": "https://hooks.slack.com/services/T00/B00/abc123",
    "channel": "#alerts"
  }'
```

## Step 6: View Alert History

```bash
curl http://localhost:8080/api/v1/alerts?period=24h \
  -H "X-Admin-Key: Your$trongP@ssw0rd!"
```

## Step 7: Acknowledge an Alert

```bash
curl -X POST http://localhost:8080/api/v1/alerts/alert-abc/acknowledge \
  -H "X-Admin-Key: Your$trongP@ssw0rd!"
```

## What You Learned

- Viewing real-time metrics
- Creating metric alerts
- Configuring notification channels
- Viewing alert history
- Acknowledging alerts

## Next Tutorial

→ [08: Custom Plugin](08-custom-plugin.md)

## See Also

Related tutorials, cookbooks, and API reference documentation.

- [User Manual](../user-manual/01-getting-started.md)
- [Code Cookbooks](../code-cookbooks/01-getting-started.md)
- [Developer Guides](../developer-guides/01-why-build-on-apioss.md)
- [API Reference](../api-reference/01-overview.md)

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
