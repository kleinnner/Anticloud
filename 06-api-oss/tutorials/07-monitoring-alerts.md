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
