---
title: "API Reference 12: Model Management API"
sidebar_position: 12
description: "curl http://localhost:8080/v1/models"
tags: [api]
---

# API Reference 12: Model Management API

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/models` | List available models |
| GET | `/v1/models/{id}` | Get model details |
| POST | `/v1/models/{id}/load` | Load/unload model |
| POST | `/v1/models/{id}/unload` | Unload model from memory |
| POST | `/v1/models/download` | Download a model |
| DELETE | `/v1/models/{id}` | Delete a model file |
| GET | `/v1/models/{id}/status` | Get model runtime status |
| POST | `/v1/models/switch` | Hot-swap active model |

## List Models

```bash
curl http://localhost:8080/v1/models \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "data": [
    {
      "id": "qwen2.5-7b-q4",
      "object": "model",
      "owned_by": "ai-oss",
      "created": 1717113600,
      "permission": [],
      "root": "Qwen/Qwen2.5-7B-Instruct-GGUF",
      "quantization": "Q4_K_M",
      "size_gb": 4.3,
      "context_length": 32768,
      "ram_required_gb": 6,
      "status": "loaded"
    },
    {
      "id": "llama-3.2-3b-q4",
      "object": "model",
      "owned_by": "meta",
      "created": 1717027200,
      "quantization": "Q4_K_M",
      "size_gb": 2.0,
      "context_length": 8192,
      "ram_required_gb": 4,
      "status": "available"
    }
  ],
  "object": "list"
}
```

## Model Details

```bash
curl http://localhost:8080/v1/models/qwen2.5-7b-q4 \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "id": "qwen2.5-7b-q4",
  "object": "model",
  "owned_by": "Qwen",
  "created": 1717113600,
  "description": "Qwen2.5 7B Instruct - Q4_K_M quantization",
  "license": "Apache 2.0",
  "url": "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-GGUF",
  "file_path": "/data/models/qwen2.5-7b-instruct-q4_k_m.gguf",
  "file_size_bytes": 4617089843,
  "sha256": "a1b2c3d4e5f6...",
  "quantization": "Q4_K_M",
  "context_length": 32768,
  "ram_required_gb": 6,
  "vram_required_gb": 4,
  "supports_tools": true,
  "supports_streaming": true,
  "supports_functions": true,
  "languages": ["en", "zh", "de", "fr", "es"],
  "status": "loaded",
  "loading_progress": 1.0,
  "inference_stats": {
    "tokens_per_second": 25.3,
    "avg_latency_ms": 180,
    "peak_memory_mb": 4096,
    "queries_served": 15230
  }
}
```

## Download Model

```bash
curl -X POST http://localhost:8080/v1/models/download \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model_id": "qwen2.5-7b-q4",
    "source": "huggingface",
    "url": "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-GGUF/resolve/main/qwen2.5-7b-instruct-q4_k_m.gguf"
  }'
```

```json
{
  "id": "download_001",
  "model_id": "qwen2.5-7b-q4",
  "status": "downloading",
  "progress": 0.35,
  "speed_mbps": 45.2,
  "downloaded_mb": 1507,
  "total_mb": 4308,
  "estimated_time_seconds": 62
}
```

## Load/Unload Model

```bash
# Load model into memory
curl -X POST http://localhost:8080/v1/models/qwen2.5-7b-q4/load \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"

# Unload model (frees RAM/VRAM)
curl -X POST http://localhost:8080/v1/models/qwen2.5-7b-q4/unload \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

## Hot-Swap Active Model

```bash
curl -X POST http://localhost:8080/v1/models/switch \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model_id": "llama-3.2-3b-q4",
    "warm_up": true
  }'
```

## Model Runtime Status

```bash
curl http://localhost:8080/v1/models/qwen2.5-7b-q4/status \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "model_id": "qwen2.5-7b-q4",
  "status": "loaded",
  "uptime_seconds": 86400,
  "active_queries": 5,
  "queued_queries": 2,
  "peak_memory_mb": 4200,
  "current_memory_mb": 3900,
  "gpu_utilization": 0.65,
  "total_queries": 15230,
  "total_tokens": 5847290,
  "avg_latency_ms": 180,
  "p95_latency_ms": 450,
  "throughput_tps": 25.3,
  "errors_last_hour": 2
}
```

## Recommended Models

| ID | Size | RAM | Context | Tools | Best For |
|----|------|-----|---------|-------|----------|
| `qwen2.5-7b-q4` | 4.3GB | 6GB | 32K | ✅ Excellent | General purpose |
| `qwen2-vl-2b-q4` | 1.8GB | 4GB | 32K | ✅ Good | Low-resource |
| `qwen2.5-14b-q4` | 8.5GB | 10GB | 32K | ✅ Excellent | High-quality |
| `llama-3.2-3b-q4` | 2.0GB | 4GB | 8K | ⚠️ Decent | English-focused |
| `mistral-7b-v03` | 4.4GB | 6GB | 32K | ✅ Good | Multilingual |
| `deepseek-coder-7b` | 4.5GB | 6GB | 16K | ⚠️ Basic | Code generation |

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com