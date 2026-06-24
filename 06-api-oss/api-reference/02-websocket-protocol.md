---
title: "API Reference 02: WebSocket Protocol"
sidebar_position: 2
description: "const ws = new WebSocket('ws://localhost:3030/ws');"
tags: [api]
---

# API Reference 02: WebSocket Protocol

## Connection

```javascript
const ws = new WebSocket('ws://localhost:3030/ws');

ws.onopen = () => {
  // Authenticate
  ws.send(JSON.stringify({
    type: 'auth',
    api_key: 'sk-aioss-xxxxxxxxxxxx'
  }));
};
```

## Message Envelope

All WebSocket messages use a standard JSON envelope:

```json
{
  "type": "string",
  "id": "string",
  "timestamp": "ISO8601",
  "payload": {}
}
```

## Authentication Flow

```
CLIENT                    SERVER
  |                         |
  |-- {type: "auth",       -->|
  |    api_key: "sk-..."    | |
  |                         | |
  |<--{type: "auth_ok",    --|
  |    session_id: "..."   } |
  |                         |
```

### auth (Client → Server)
```json
{
  "type": "auth",
  "api_key": "sk-aioss-xxxxxxxxxxxx"
}
```

### auth_ok (Server → Client)
```json
{
  "type": "auth_ok",
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "user": {
    "id": "user_001",
    "name": "Lois K.",
    "role": "admin"
  }
}
```

### auth_error (Server → Client)
```json
{
  "type": "auth_error",
  "code": "invalid_key",
  "message": "API key not found or revoked"
}
```

## Heartbeat

Client sends every 60 seconds; server responds. If server misses 3 consecutive heartbeats, connection is closed.

### Client → Server
```json
{
  "type": "heartbeat",
  "timestamp": "2026-05-31T12:00:00Z"
}
```

### Server → Client
```json
{
  "type": "heartbeat_ack",
  "timestamp": "2026-05-31T12:00:00Z",
  "server_time": "2026-05-31T12:00:00.123Z"
}
```

## Error Message Format

```json
{
  "type": "error",
  "id": "req_001",
  "code": "model_not_found",
  "message": "Model 'unknown-model' not found in registry",
  "details": {
    "available_models": ["qwen2.5-7b-q4", "llama-3.2-3b-q4"]
  }
}
```

### Standard Error Codes

| Code | HTTP Equiv | Meaning |
|------|-----------|---------|
| `invalid_request` | 400 | Malformed JSON or missing fields |
| `auth_failed` | 401 | Invalid or missing API key |
| `forbidden` | 403 | API key lacks required permissions |
| `not_found` | 404 | Resource not found |
| `rate_limited` | 429 | Too many requests |
| `model_error` | 500 | Model inference failed |
| `internal_error` | 500 | Unexpected server error |
| `timeout` | 504 | Request exceeded time limit |

## Close Codes

| Code | Reason |
|------|--------|
| 1000 | Normal closure |
| 4001 | Auth failed |
| 4002 | Session expired |
| 4003 | Rate limited |
| 4004 | Server shutdown |
| 4005 | Protocol violation |

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)
