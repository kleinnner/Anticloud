---
title: "API Reference 20: Embedding API"
sidebar_position: 20
description: "OpenAI-compatible endpoint:"
tags: [api]
---

# API Reference 20: Embedding API

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/embeddings` | Generate embeddings |
| GET | `/v1/embeddings/models` | List available embedding models |
| POST | `/v1/embeddings/similarity` | Compute similarity between texts |

## Generate Embeddings

OpenAI-compatible endpoint:

```bash
curl http://localhost:8080/v1/embeddings \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-3-small",
    "input": "The liability cap is $5M per incident"
  }'
```

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [0.012, -0.034, 0.089, ...]
    }
  ],
  "model": "text-embedding-3-small",
  "usage": {
    "prompt_tokens": 8,
    "total_tokens": 8
  }
}
```

### Batch Embeddings

```bash
curl http://localhost:8080/v1/embeddings \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-3-small",
    "input": [
      "The liability cap is $5M per incident",
      "GDPR requires data protection impact assessment",
      "The contract is governed by Delaware law"
    ]
  }'
```

## Available Embedding Models

```bash
curl http://localhost:8080/v1/embeddings/models \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "data": [
    {
      "id": "text-embedding-3-small",
      "object": "model",
      "owned_by": "ai-oss",
      "dimensions": 384,
      "max_input_tokens": 8192,
      "model_size_mb": 22,
      "speed_tokens_per_second": 1000,
      "quality": "good"
    },
    {
      "id": "text-embedding-3-large",
      "object": "model",
      "owned_by": "ai-oss",
      "dimensions": 768,
      "max_input_tokens": 8192,
      "model_size_mb": 85,
      "speed_tokens_per_second": 400,
      "quality": "excellent"
    },
    {
      "id": "text-embedding-ada-002",
      "object": "model",
      "owned_by": "openai",
      "dimensions": 1536,
      "max_input_tokens": 8192,
      "quality": "excellent",
      "requires_remote": true
    }
  ]
}
```

## Similarity Comparison

```bash
curl -X POST http://localhost:8080/v1/embeddings/similarity \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-3-small",
    "input_a": "The liability cap is $5M per incident",
    "input_b": "Maximum liability is limited to five million dollars per occurrence"
  }'
```

```json
{
  "similarity": 0.94,
  "model": "text-embedding-3-small",
  "dimensions": 384,
  "method": "cosine"
}
```

## Vector Operations

```bash
# Compute cosine similarity between two vectors directly
curl -X POST http://localhost:8080/v1/embeddings/similarity \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "vector_a": [0.012, -0.034, ...],
    "vector_b": [0.045, -0.012, ...],
    "method": "cosine"
  }'
```

## Best Practices

1. **Cache embeddings** — Same text produces same embedding; cache by input hash
2. **Batch when possible** — Batch processing is 10x more efficient
3. **Use the right model** — `text-embedding-3-small` is 10x faster for similar quality
4. **Normalize text** — Strip formatting, normalize whitespace before embedding
5. **Monitor dimensions** — Ensure all vectors use the same model for consistency

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
