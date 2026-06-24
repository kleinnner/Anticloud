---
title: "API Reference 17: Error Codes"
sidebar_position: 17
description: "{"
tags: [api]
---

# API Reference 17: Error Codes

## Error Response Format

```json
{
  "error": {
    "code": "model_not_found",
    "message": "Model 'unknown-model' was not found in the registry.",
    "type": "not_found_error",
    "param": "model",
    "details": {
      "available_models": ["qwen2.5-7b-q4", "llama-3.2-3b-q4"]
    }
  }
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid JSON, missing fields) |
| 401 | Authentication failed |
| 403 | Permission denied |
| 404 | Resource not found |
| 409 | Conflict (duplicate, state conflict) |
| 422 | Unprocessable entity (validation error) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 502 | Bad gateway (upstream failure) |
| 503 | Service unavailable (loading) |
| 504 | Gateway timeout |

## Error Code Table

| Code | HTTP | Description | Recovery |
|------|------|-------------|----------|
| `invalid_request` | 400 | Malformed JSON or missing required fields | Check request format |
| `invalid_api_key` | 401 | API key format is invalid | Generate a new key |
| `expired_api_key` | 401 | API key has expired | Generate a new key |
| `revoked_api_key` | 401 | API key has been revoked | Generate a new key |
| `insufficient_permissions` | 403 | Key lacks required permissions | Use a key with higher permissions |
| `resource_not_found` | 404 | Requested resource does not exist | Check resource ID |
| `model_not_found` | 404 | Model ID not found in registry | List available models |
| `node_not_found` | 404 | Graph node not found | Check node ID |
| `document_not_found` | 404 | Document not found | Check document ID |
| `duplicate_resource` | 409 | Resource already exists | Use PUT instead of POST |
| `graph_conflict` | 409 | Graph operation conflicts with state | Retry with updated state |
| `validation_error` | 422 | Input failed validation | Check field constraints |
| `rate_limited` | 429 | Too many requests | Retry after `retry_after` seconds |
| `model_not_loaded` | 503 | Model is not loaded into memory | Load model first |
| `model_loading` | 503 | Model is currently loading | Wait and retry |
| `index_not_ready` | 503 | Search index is building | Wait and retry |
| `bridge_disconnected` | 503 | Bridge is not connected | Reconnect bridge |
| `model_inference_error` | 500 | Model failed during inference | Retry, check model file |
| `internal_error` | 500 | Unexpected server error | Report bug |
| `ledger_write_failed` | 500 | Failed to write to audit ledger | Check disk space |
| `graph_corruption` | 500 | Graph database corruption detected | Restore from backup |
| `timeout` | 504 | Request exceeded time limit | Reduce request complexity |

## WebSocket Error Codes

| Code | Meaning |
|------|---------|
| 4001 | Authentication failed |
| 4002 | Session expired |
| 4003 | Rate limited |
| 4004 | Server shutting down |
| 4005 | Protocol violation |
| 4006 | Invalid message type |
| 4007 | Message too large |
| 4008 | Session limit reached |

## Retry Logic

```python
import time
from api_oss import APIOSS, RateLimitError, ServiceUnavailableError

client = APIOSS(api_key="sk-aioss-xxxxxxxxxxxx")

def retry_with_backoff(fn, max_retries=3):
    for attempt in range(max_retries):
        try:
            return fn()
        except RateLimitError as e:
            time.sleep(e.retry_after)
        except ServiceUnavailableError:
            time.sleep(2 ** attempt)  # Exponential backoff
    raise Exception("Max retries exceeded")
```

## Debug Headers

| Header | Description |
|--------|-------------|
| `X-Request-ID` | Unique request identifier for tracing |
| `X-API-Key-ID` | ID of the API key used (first 8 chars) |
| `X-RateLimit-Limit` | Rate limit per time window |
| `X-RateLimit-Remaining` | Requests remaining in window |
| `X-RateLimit-Reset` | Unix timestamp when limit resets |
| `X-Duration-Ms` | Request processing time in ms |

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)
