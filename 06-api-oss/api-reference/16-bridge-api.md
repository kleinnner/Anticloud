---
title: "API Reference 16: Bridge API"
sidebar_position: 16
description: "curl http://localhost:8080/v1/bridges"
tags: [api]
---

# API Reference 16: Bridge API

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/bridges` | List configured bridges |
| POST | `/v1/bridges` | Configure a new bridge |
| GET | `/v1/bridges/{id}` | Get bridge details |
| PUT | `/v1/bridges/{id}` | Update bridge config |
| DELETE | `/v1/bridges/{id}` | Remove bridge |
| POST | `/v1/bridges/{id}/connect` | Connect bridge |
| POST | `/v1/bridges/{id}/disconnect` | Disconnect bridge |
| GET | `/v1/bridges/{id}/status` | Get bridge health |
| GET | `/v1/bridges/{id}/messages` | List recent messages |

## List Bridges

```bash
curl http://localhost:8080/v1/bridges \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "data": [
    {
      "id": "discord_main",
      "platform": "discord",
      "name": "Main Discord Server",
      "status": "connected",
      "channels": ["#general", "#support", "#ai-chat"],
      "users_served": 234,
      "messages_today": 1520,
      "connected_at": "2026-05-01T00:00:00Z"
    }
  ]
}
```

## Configure Bridge (Discord)

```bash
curl -X POST http://localhost:8080/v1/bridges \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "discord",
    "name": "Customer Support Bridge",
    "config": {
      "token": "MTIzNDU2Nzg5MDEyMzQ1Njc4OQ==.GxYzAb.discord_bot_token",
      "channels": ["123456789", "987654321"],
      "command_prefix": "!ai",
      "allow_dm": true,
      "rate_limit_messages_per_minute": 30
    },
    "permissions": {
      "allowed_roles": ["admin", "support"],
      "max_context_length": 4096,
      "allowed_models": ["qwen2.5-7b-q4"]
    }
  }'
```

## Supported Platforms

| Platform | Auth Method | Features |
|----------|-------------|----------|
| Discord | Bot Token | Threads, slash commands, files |
| Telegram | Bot Token | Groups, inline mode, files |
| WhatsApp | API Key | Business API, media |
| Slack | App Token | Channels, DMs, slash commands |
| Matrix | Access Token | Rooms, E2EE |
| Signal | Registration ID | E2EE messaging |
| Email | SMTP/IMAP | Send + receive |
| SMS | API Key (Twilio) | Two-way SMS |

## Bridge Status

```bash
curl http://localhost:8080/v1/bridges/discord_main/status \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "id": "discord_main",
  "status": "connected",
  "platform": "discord",
  "uptime_seconds": 2592000,
  "latency_ms": 125,
  "connected_channels": 3,
  "rate_limit_remaining": 87,
  "rate_limit_reset": "2026-05-31T12:00:00Z",
  "last_error": null,
  "version": "api-oss-bridge-0.1.0"
}
```

## Bridge Messages

```bash
curl "http://localhost:8080/v1/bridges/discord_main/messages?limit=20" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "data": [
    {
      "id": "msg_001",
      "platform_message_id": "123456789012345678",
      "channel": "#general",
      "author": {
        "id": "user_98765",
        "name": "JohnDoe",
        "platform": "discord"
      },
      "content": "What's the liability cap on this contract?",
      "timestamp": "2026-05-31T11:30:00Z",
      "response": "Based on the Master MSA, the liability cap is $5M per incident...",
      "response_time_ms": 2340
    }
  ]
}
```

## Bridge WebSocket Events

| Type | Description |
|------|-------------|
| `bridge.message` | New message from bridge channel |
| `bridge.response` | AI response sent to bridge |
| `bridge.status_change` | Bridge connected/disconnected |
| `bridge.error` | Bridge error notification |

## WebSocket Bridge Messages

```json
// Client → Server: Send message via bridge
{
  "type": "bridge.send",
  "id": "bridge_msg_001",
  "payload": {
    "bridge_id": "discord_main",
    "channel": "#general",
    "content": "Hello from API-OSS!"
  }
}

// Server → Client: Incoming bridge message
{
  "type": "bridge.message",
  "id": "incoming_001",
  "payload": {
    "bridge_id": "discord_main",
    "platform": "discord",
    "channel": "#general",
    "author": "JohnDoe",
    "content": "What's the liability cap?"
  }
}
```

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)
