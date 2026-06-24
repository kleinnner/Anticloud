---
title: "Tutorial 02: Chat with an LLM"
sidebar_position: 2
description: "Route chat requests through API-OSS to an LLM provider."
tags: [tutorials]
---

# Tutorial 02: Chat with an LLM

## Objective

Route chat requests through API-OSS to an LLM provider.

## Prerequisites

- API-OSS running (from Tutorial 01)
- An OpenAI-compatible LLM endpoint

## Step 1: Add an LLM Provider

```bash
curl -X POST http://localhost:8080/api/v1/models \
  -H "X-Admin-Key: admin" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model_name": "gpt-4",
    "base_url": "https://api.openai.com/v1",
    "api_key_env": "OPENAI_API_KEY"
  }'
```

## Step 2: Set Your API Key

```bash
# Restart with your key
docker stop apioss
docker rm apioss

docker run -d --name apioss \
  -p 8080:8080 \
  -e OPENAI_API_KEY="sk-your-key-here" \
  api-oss:latest
```

## Step 3: Send a Chat Message

```bash
curl -X POST http://localhost:8080/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "user", "content": "Say hello in 10 words or less"}
    ]
  }'
```

Response:
```json
{
  "id": "chatcmpl-abc123",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      }
    }
  ]
}
```

## Step 4: Stream the Response

```bash
curl -X POST http://localhost:8080/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Count to 5"}],
    "stream": true
  }'
```

You'll see chunks arrive as SSE (Server-Sent Events).

## What You Learned

- Registering an LLM provider
- Setting API keys
- Non-streaming chat
- Streaming chat (SSE)

## Next Tutorial

→ [03: Authentication & API Keys](03-authentication-keys.md)

## See Also

Related tutorials, cookbooks, and API reference documentation.

- [User Manual](../user-manual/01-getting-started.md)
- [Code Cookbooks](../code-cookbooks/01-getting-started.md)
- [Developer Guides](../developer-guides/01-why-build-on-apioss.md)
- [API Reference](../api-reference/01-overview.md)
