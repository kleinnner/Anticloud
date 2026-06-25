---
title: "API Reference 03: REST API (OpenAI-Compatible)"
sidebar_position: 3
description: "AI-OSS implements the OpenAI API specification for seamless migration. Supported endpoints:"
tags: [api]
---

# API Reference 03: REST API (OpenAI-Compatible)

## Compatibility

AI-OSS implements the OpenAI API specification for seamless migration. Supported endpoints:

| Endpoint | Status | Notes |
|----------|--------|-------|
| `POST /v1/chat/completions` | ✅ Full | Streaming, functions, tools |
| `POST /v1/completions` | ✅ Full | Legacy completions |
| `POST /v1/embeddings` | ✅ Full | Local embedding models |
| `GET /v1/models` | ✅ Full | List available models |
| `GET /v1/models/{id}` | ✅ Full | Model details |
| `POST /v1/images/generations` | ❌ | Not supported (no GPU gen) |
| `POST /v1/audio/transcriptions` | ⚠️ Partial | Via Whisper plugin |
| `POST /v1/moderations` | ❌ | Content moderation TBD |

## Chat Completions

**Endpoint:** `POST /v1/chat/completions`

### Request
```json
{
  "model": "qwen2.5-7b-q4",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the liability cap?"}
  ],
  "temperature": 0.7,
  "max_tokens": 2048,
  "stream": false,
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "graph_search",
        "description": "Search the knowledge graph",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {"type": "string"}
          },
          "required": ["query"]
        }
      }
    }
  ]
}
```

### Response (Non-Streaming)
```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1717113600,
  "model": "qwen2.5-7b-q4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Based on the Master MSA v4, the liability cap is $5M per incident.",
        "tool_calls": [
          {
            "id": "call_abc123",
            "type": "function",
            "function": {
              "name": "graph_search",
              "arguments": "{\"query\": \"liability cap Master MSA\"}"
            }
          }
        ]
      },
      "finish_reason": "tool_calls"
    }
  ],
  "usage": {
    "prompt_tokens": 342,
    "completion_tokens": 124,
    "total_tokens": 466
  }
}
```

### Streaming (Server-Sent Events)
```text
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Based"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":" on"},"finish_reason":null}]}

data: [DONE]
```

## AI-OSS Extensions

Additional headers and query parameters:

| Header | Description |
|--------|-------------|
| `X-Codex-Id` | Active Codex context |
| `X-Graph-Context` | `enabled` or `disabled` |
| `X-Debug` | Include reasoning in response |
| `X-Council-Mode` | `single` or `council` |

## Curl Examples

```bash
# Basic chat
curl http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5-7b-q4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'

# Streaming
curl http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5-7b-q4",
    "messages": [{"role": "user", "content": "Tell me a story"}],
    "stream": true
  }'

# With graph context
curl http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "X-Codex-Id: project-alpha" \
  -d '{
    "model": "qwen2.5-7b-q4",
    "messages": [{"role": "user", "content": "Summarize the contract risks"}],
    "max_tokens": 4096
  }'
```

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
