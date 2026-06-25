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
