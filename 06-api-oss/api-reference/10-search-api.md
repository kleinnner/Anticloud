---
title: "API Reference 10: Search API"
sidebar_position: 10
description: "AI-OSS provides hybrid search combining full-text (BM25) and semantic (embedding) search."
tags: [api]
---

# API Reference 10: Search API

## Overview

AI-OSS provides hybrid search combining full-text (BM25) and semantic (embedding) search.

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/search` | Search across all indexed content |
| POST | `/v1/search` | Advanced search with filters |
| GET | `/v1/search/index/status` | Index status |
| POST | `/v1/search/index/rebuild` | Rebuild search index |

## Basic Search

```bash
# Simple keyword search
curl "http://localhost:8080/v1/search?q=liability+cap&limit=10" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"

# With filters
curl "http://localhost:8080/v1/search?q=GDPR&node_type=Concept&codex_id=project-alpha" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "data": [
    {
  "id": "uuid_clause_4",
      "node_type": "Concept",
      "label": "Clause 4 — Liability Cap",
      "content": "$5M liability cap in Master Service Agreement...",
      "full_text_score": 8.42,
      "semantic_score": 0.87,
      "combined_score": 0.92,
      "highlights": ["<mark>liability</mark> <mark>cap</mark>", "$5M"]
    }
  ],
  "total": 42,
  "page": 1,
  "page_size": 10,
  "query_time_ms": 45
}
```

## Advanced Search (POST)

```bash
curl -X POST http://localhost:8080/v1/search \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the insurance requirements?",
    "node_types": ["Concept", "Evidence"],
    "codex_id": "project-alpha",
    "filters": {
      "created_after": "2026-01-01T00:00:00Z",
      "created_before": "2026-12-31T23:59:59Z",
      "metadata": {
        "jurisdiction": "EU"
      }
    },
    "search_mode": "hybrid",
    "full_text_weight": 0.3,
    "semantic_weight": 0.7,
    "min_score": 0.5,
    "limit": 20,
    "offset": 0,
    "include_embeddings": false,
    "include_highlights": true
  }'
```

## Search Modes

| Mode | Description | Best For |
|------|-------------|----------|
| `fulltext` | BM25 keyword matching | Exact term lookup |
| `semantic` | Embedding similarity | Concept exploration |
| `hybrid` | Weighted combination (default) | General purpose |
| `hybrid_rrf` | Reciprocal rank fusion | Balanced results |

## Semantic Search with Vector

```bash
curl -X POST http://localhost:8080/v1/search \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "vector": [0.012, -0.034, 0.089, ...],
    "search_mode": "semantic",
    "limit": 10
  }'
```

## Index Management

```bash
# Get index status
curl http://localhost:8080/v1/search/index/status \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "status": "ready",
  "total_documents": 1024,
  "total_chunks": 15360,
  "last_indexed": "2026-05-31T11:00:00Z",
  "index_size_mb": 256,
  "pending_documents": 0
}
```

## Faceted Search

```bash
curl -X POST http://localhost:8080/v1/search \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "contract",
    "facets": {
      "node_type": true,
      "metadata.jurisdiction": true,
      "metadata.department": true
    },
    "limit": 0
  }'
```

```json
{
  "facets": {
    "node_type": {
      "Concept": 234,
      "Document": 89,
      "Evidence": 512
    },
    "metadata.jurisdiction": {
      "US": 156,
      "EU": 98,
      "UK": 45
    },
    "metadata.department": {
      "Legal": 200,
      "Finance": 89,
      "Compliance": 67
    }
  }
}
```

## WebSocket Search Messages

| Type | Direction | Description |
|------|-----------|-------------|
| `search.query` | Client → Server | Search request |
| `search.result` | Server → Client | Search results |
| `search.suggest` | Client → Server | Get autocomplete suggestions |
| `search.suggestions` | Server → Client | Suggestions |
| `search.index_status` | Client → Server | Get index status |
| `search.index_rebuild` | Client → Server | Rebuild index |

## Error Codes

| Code | Meaning |
|------|---------|
| `index_not_ready` | Search index still building |
| `invalid_search_mode` | Unknown search mode |
| `filter_parse_error` | Invalid filter expression |
| `no_results` | Search returned no results |

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
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com