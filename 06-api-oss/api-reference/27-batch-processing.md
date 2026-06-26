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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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
