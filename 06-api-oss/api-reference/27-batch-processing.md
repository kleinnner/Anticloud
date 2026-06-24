---
title: "API Reference 27: Batch Processing"
sidebar_position: 27
description: "Batch endpoints for processing multiple items efficiently."
tags: [api]
---

# API Reference 27: Batch Processing

## Overview

Batch endpoints for processing multiple items efficiently.

## Batch Chat Completions

```bash
curl -X POST http://localhost:8080/v1/batch/chat/completions \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5-7b-q4",
    "requests": [
      {
        "messages": [{"role": "user", "content": "Summarize: text 1"}],
        "max_tokens": 256
      },
      {
        "messages": [{"role": "user", "content": "Summarize: text 2"}],
        "max_tokens": 256
      }
    ]
  }'
```

```json
{
  "batch_id": "batch_001",
  "total_requests": 50,
  "status": "processing",
  "created_at": "2026-05-31T12:00:00Z",
  "estimated_completion": "2026-05-31T12:05:00Z"
}
```

## Batch Results

```bash
curl http://localhost:8080/v1/batch/batch_001 \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "batch_id": "batch_001",
  "status": "completed",
  "total_requests": 50,
  "completed": 50,
  "failed": 0,
  "results": [
    {
      "index": 0,
      "response": {
        "choices": [{"message": {"content": "Summary of text 1..."}}]
      }
    }
  ],
  "created_at": "2026-05-31T12:00:00Z",
  "completed_at": "2026-05-31T12:04:30Z",
  "total_duration_ms": 270000
}
```

## Batch Embeddings

```bash
curl -X POST http://localhost:8080/v1/batch/embeddings \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-3-small",
    "inputs": [
      "Text 1 to embed",
      "Text 2 to embed",
      "Text 3 to embed"
    ]
  }'
```

## Batch Graph Search

```bash
curl -X POST http://localhost:8080/v1/batch/graph/search \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      {"query": "liability cap", "node_type": "Concept", "limit": 5},
      {"query": "GDPR compliance", "node_type": "Concept", "limit": 5}
    ]
  }'
```

## Batch Limits

| Resource | Free | Pro | Business | Enterprise |
|----------|------|-----|----------|------------|
| Max batch requests | 10 | 50 | 500 | 5000 |
| Max batch duration | 5 min | 15 min | 60 min | Unlimited |
| Concurrent batches | 1 | 2 | 5 | 20 |
| Batch result retention | 1 hour | 24 hours | 7 days | 30 days |

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)
