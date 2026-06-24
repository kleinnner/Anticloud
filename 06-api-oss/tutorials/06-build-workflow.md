---
title: "Tutorial 06: Build a Workflow"
sidebar_position: 6
description: "Create a multi-step workflow that chains API calls and AI inference."
tags: [tutorials]
---

# Tutorial 06: Build a Workflow

## Objective

Create a multi-step workflow that chains API calls and AI inference.

## Prerequisites

- API-OSS running with an LLM configured
- Tutorial 01-05 completed

## Step 1: Create a Workflow

```bash
curl -X POST http://localhost:8080/api/v1/workflows \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Support Ticket Classifier",
    "steps": [
      {
        "id": "classify",
        "type": "ai-inference",
        "config": {
          "model": "gpt-4",
          "prompt": "Classify this ticket as: billing, technical, or feature-request\n\nTicket: {{ input.body }}",
          "output": "classification"
        }
      },
      {
        "id": "summarize",
        "type": "ai-inference",
        "config": {
          "model": "gpt-4",
          "prompt": "Summarize this ticket in one sentence:\n\n{{ input.body }}",
          "output": "summary"
        }
      },
      {
        "id": "route",
        "type": "condition",
        "config": {
          "if": "steps.classify.output == 'billing'",
          "then": "notify-billing",
          "else": "log-ticket"
        }
      },
      {
        "id": "notify-billing",
        "type": "http-request",
        "config": {
          "url": "https://hooks.slack.com/services/T00/B00/abc",
          "method": "POST",
          "body": {
            "text": "Billing ticket: {{ input.body }}"
          }
        }
      },
      {
        "id": "log-ticket",
        "type": "data-query",
        "config": {
          "query": "INSERT INTO tickets (body, classification, summary) VALUES ($1, $2, $3)",
          "params": ["{{ input.body }}", "{{ steps.classify.output }}", "{{ steps.summarize.output }}"]
        }
      }
    ]
  }'
```

## Step 2: Test the Workflow

```bash
curl -X POST http://localhost:8080/api/v1/workflows/wf-abc/test \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "body": "I was charged twice for my subscription. Please refund the duplicate charge."
  }'
```

## Step 3: View Workflow Output

```json
{
  "status": "completed",
  "steps": {
    "classify": {"output": "billing", "duration_ms": 1200},
    "summarize": {"output": "Customer requesting refund for duplicate charge", "duration_ms": 800},
    "route": {"branch": "notify-billing"},
    "notify-billing": {"status": 200, "duration_ms": 300}
  },
  "total_duration_ms": 2300
}
```

## Step 4: Create a Route for the Workflow

```bash
curl -X POST http://localhost:8080/api/v1/routes \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/v1/tickets",
    "workflow": "wf-abc",
    "methods": ["POST"]
  }'
```

## Step 5: Test via Route

```bash
curl -X POST http://localhost:8080/v1/tickets \
  -H "Content-Type: application/json" \
  -d '{"body": "Can you add support for PDF export?"}'
```

## What You Learned

- Creating multi-step workflows
- AI inference steps
- Conditional branching
- HTTP request steps
- Data query steps
- Attaching workflows to routes

## Next Tutorial

→ [07: Monitoring & Alerting](07-monitoring-alerts.md)

## See Also

Related tutorials, cookbooks, and API reference documentation.

- [User Manual](../user-manual/01-getting-started.md)
- [Code Cookbooks](../code-cookbooks/01-getting-started.md)
- [Developer Guides](../developer-guides/01-why-build-on-apioss.md)
- [API Reference](../api-reference/01-overview.md)
