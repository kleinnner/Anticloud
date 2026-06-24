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
