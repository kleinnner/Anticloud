---
title: "API Reference 26: Webhook API"
sidebar_position: 26
description: "AI-OSS can send webhooks for events, enabling integration with external systems."
tags: [api]
---

# API Reference 26: Webhook API

## Overview

AI-OSS can send webhooks for events, enabling integration with external systems.

## Configure Webhooks

```bash
curl -X PUT http://localhost:8080/v1/config \
  -H "Authorization: Bearer sk-aioss-admin-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "webhooks": {
      "endpoints": [
        {
          "url": "https://hooks.slack.com/services/T00/B00/xxxx",
          "events": ["contradiction.high", "ingestion.complete"],
          "secret": "whsec_my_webhook_secret",
          "retry_count": 3,
          "timeout_ms": 5000
        }
      ]
    }
  }'
```

## Event Types

| Event | Description | Payload Size |
|-------|-------------|-------------|
| `ingestion.started` | Document ingestion began | ~500 bytes |
| `ingestion.progress` | Ingestion progress update | ~300 bytes |
| `ingestion.complete` | Document ingestion finished | ~1KB |
| `ingestion.error` | Ingestion failed | ~500 bytes |
| `contradiction.detected` | New contradiction found | ~2KB |
| `contradiction.high` | High-severity contradiction | ~2KB |
| `contradiction.resolved` | Contradiction was resolved | ~1KB |
| `council.decision` | Council made a decision | ~3KB |
| `council.vote` | Agent cast a vote | ~1KB |
| `model.loaded` | Model loaded into memory | ~500 bytes |
| `model.error` | Model error occurred | ~500 bytes |
| `bridge.connected` | Bridge connected | ~300 bytes |
| `bridge.disconnected` | Bridge disconnected | ~300 bytes |
| `bridge.error` | Bridge error | ~500 bytes |
| `user.login` | User logged in | ~500 bytes |
| `system.alert` | System alert (disk, memory, etc.) | ~1KB |
| `system.error` | System error | ~1KB |

## Webhook Payload Format

```json
{
  "event": "contradiction.high",
  "id": "evt_abc123",
  "created_at": "2026-05-31T12:00:00Z",
  "api_version": "v1",
  "data": {
    "contradiction_id": "uuid_contra_001",
    "severity": 0.94,
    "node_a": {
      "id": "uuid_section_4_2",
      "label": "Section 4.2",
      "type": "Concept"
    },
    "node_b": {
      "id": "uuid_section_12_1",
      "label": "Section 12.1",
      "type": "Concept"
    },
    "summary": "Liability cap ($5M) vs Unlimited liability (confidentiality breach)"
  }
}
```

## Security (HMAC Verification)

Each webhook includes an HMAC signature in the header:

```text
X-Webhook-Signature: sha256=abc123def456...
```

```python
import hmac
import hashlib

def verify_webhook(payload_body, signature_header, secret):
    expected = hmac.new(
        secret.encode(),
        payload_body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature_header)
```

## Retry Logic

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 10 seconds |
| 3 | 60 seconds |
| 4 | 300 seconds (5 min) |
| 5 | 3600 seconds (1 hour) |

After 5 failed attempts, the webhook is marked as `failed` and requires manual re-enable.

## Webhook Status

```bash
curl http://localhost:8080/v1/config/webhooks/status \
  -H "Authorization: Bearer sk-aioss-admin-xxxxxxxxxxxx"
```

```json
{
  "endpoints": [
    {
      "url": "https://hooks.slack.com/services/T00/B00/xxxx",
      "status": "active",
      "events_received": 15230,
      "events_succeeded": 15210,
      "events_failed": 20,
      "last_success": "2026-05-31T12:00:00Z",
      "last_failure": "2026-05-30T10:00:00Z"
    }
  ]
}
```

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)
