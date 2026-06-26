---
title: "Tutorial 11: Custom Model Provider"
sidebar_position: 11
description: "Add a custom self-hosted model (e.g., Llama, Mistral) as an API-OSS provider."
tags: [tutorials]
---

# Tutorial 11: Custom Model Provider

## Objective

Add a custom self-hosted model (e.g., Llama, Mistral) as an API-OSS provider.

## Prerequisites

- API-OSS running
- A machine with GPU for model serving
- Docker with NVIDIA Container Toolkit

## Step 1: Deploy a Local Model

```bash
# Deploy Llama 3 with vLLM
docker run -d --gpus all \
  --name vllm \
  -p 8000:8000 \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  vllm/vllm-openai:latest \
  --model meta-llama/Meta-Llama-3-8B-Instruct \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.9
```

## Step 2: Register as a Provider

```bash
curl -X POST http://localhost:8080/api/v1/models \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "vllm",
    "model_name": "llama-3-8b",
    "base_url": "http://host.docker.internal:8000/v1",
    "capabilities": {
      "chat": true,
      "embedding": false,
      "streaming": true,
      "function_calling": true
    }
  }'
```

## Step 3: Test the Model

```bash
curl -X POST http://localhost:8080/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3-8b",
    "messages": [
      {"role": "user", "content": "Hello! What can you do?"}
    ]
  }'
```

## Step 4: Configure Model Routing

```bash
# Route based on model name
apioss admin config set routing.default_model=llama-3-8b
apioss admin config set routing.fallback_model=gpt-4

# Or route by workload type
apioss admin config set routing.rules='[
  {"route": "/v1/chat/fast", "model": "llama-3-8b"},
  {"route": "/v1/chat/advanced", "model": "gpt-4"}
]'
```

## Step 5: Load Balancing Across GPU Nodes

```bash
apioss admin config set routing.load_balance='{
  "llama-3-8b": [
    {"url": "http://gpu-1:8000/v1", "weight": 50},
    {"url": "http://gpu-2:8000/v1", "weight": 50}
  ]
}'
```

## Step 6: Monitor Model Performance

```bash
curl http://localhost:8080/api/v1/stats?group-by=model&period=1h \
  -H "X-Admin-Key: Your$trongP@ssw0rd!"
```

## What You Learned

- Deploying a local LLM with vLLM
- Registering custom providers
- Model routing rules
- Load balancing across GPUs
- Model-specific monitoring

## Next Tutorial

→ [12: mTLS Configuration](12-mtls.md)

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com