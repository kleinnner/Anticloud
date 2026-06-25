# API Reference

## POST /v1/chat/completions

```json
{
  "messages": [{"role": "user", "content": "Hello"}],
  "temperature": 0.7,
  "max_tokens": 200,
  "use_web": false
}
```

Response: `{"choices": [{"message": {"role": "assistant", "content": "..."}}]}`

## POST /v1/embeddings

```json
{"input": "Text to embed"}
```

Response: `{"data": [{"object": "embedding", "index": 0, "embedding": [...]}]}`

Embedding dimension: 1536. Latency: ~0.4s per text.

## POST /v1/graphify

```json
{"command": "bar A:10 B:25 C:40"}
```

Response: `{"output": "...ASCII chart..."}`

## GET /v1/health

`{"status": "ok", "model": "Camus 2B VL"}`

## GET /v1/status

`{"n_ctx": 2048, "vision": true, "history": 0}`
