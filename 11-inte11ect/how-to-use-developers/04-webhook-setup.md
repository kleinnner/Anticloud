.------------------------------------------------------------------------------.
|                                                                              |
|   +----------------------------------------------------------------------+    |
|   ¦                                                                      ¦    |
|   ¦          HOW-TO-USE DEVELOPERS — WEBHOOK SETUP                      ¦    |
|   ¦                                                                      ¦    |
|   ¦                    inte11ect — Community Intelligence                 ¦    |
|   ¦                                                                      ¦    |
|   +----------------------------------------------------------------------+    |
|                                                                              |
'------------------------------------------------------------------------------'

---

# inte11ect Developer: Webhook Setup

## Overview

Webhooks allow your application to receive real-time notifications about events in inte11ect. When an event occurs, inte11ect sends an HTTP POST request to your registered endpoint with the event data.

## Supported Events

| Event | Trigger | Payload |
|---|---|---|
| message.created | New message sent | message data, user, model |
| conversation.created | Conversation started | conversation metadata |
| export.completed | Export ready | download URL |
| model.completed | Model finishes processing | tokens, latency |
| error.occurred | Processing error | error details |
| moderation.flagged | Content flagged | flagged content |
| user.created | New user registered | user data |
| user.deleted | User account removed | user ID |

## Webhook vs API Polling

| Feature | Webhook | API Polling |
|---|---|---|
| Real-time | Yes | No (polling interval) |
| Server load | Low (event-driven) | High (constant polling) |
| Complexity | Medium | Low |
| Reliability | Requires retry logic | Simple |
| Cost | Lower (fewer requests) | Higher (regular requests) |
| Use case | Event-driven apps | Simple integrations |

---

## Setup Steps

### Step 1: Create Webhook Endpoint

```python
from flask import Flask, request, jsonify
import hmac
import hashlib

app = Flask(__name__)
WEBHOOK_SECRET = "your-webhook-secret"

@app.route("/inte11ect-webhook", methods=["POST"])
def webhook():
    # Verify signature
    signature = request.headers.get("X-Webhook-Signature")
    body = request.get_data()
    
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected):
        return jsonify({"error": "Invalid signature"}), 401
    
    # Process event
    event = request.json
    print(f"Received event: {event['type']}")
    
    return jsonify({"status": "received"}), 200

if __name__ == "__main__":
    app.run(port=8080)
```

### Step 2: Register Webhook

```bash
curl -X POST https://api.inte11ect.dev/v1/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/inte11ect-webhook",
    "events": ["message.created", "export.completed"],
    "secret": "your-webhook-secret",
    "description": "Production webhook for processing exports"
  }'
```

### Step 3: Test Webhook

```bash
# Send test event
curl -X POST https://api.inte11ect.dev/v1/webhooks/test \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"url": "https://your-app.com/inte11ect-webhook"}'

# Send specific event type test
curl -X POST https://api.inte11ect.dev/v1/webhooks/test \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "url": "https://your-app.com/inte11ect-webhook",
    "event": "message.created"
  }'
```

---

## Webhook Payload Structure

```json
{
  "id": "evt_abc123",
  "type": "message.created",
  "created_at": "2026-06-19T10:30:00Z",
  "data": {
    "user_id": "usr_abc123",
    "conversation_id": "conv_def456",
    "model": "gpt-4o",
    "content_preview": "What is the capital of France?",
    "input_tokens": 12,
    "output_tokens": 45
  }
}
```

### Event-Specific Payloads

**export.completed**:
```json
{
  "id": "evt_def456",
  "type": "export.completed",
  "created_at": "2026-06-19T11:00:00Z",
  "data": {
    "export_id": "exp_xyz789",
    "conversation_id": "conv_def456",
    "format": "json",
    "download_url": "https://api.inte11ect.dev/v1/export/exp_xyz789/download",
    "expires_at": "2026-06-20T11:00:00Z",
    "file_size_bytes": 245000
  }
}
```

**error.occurred**:
```json
{
  "id": "evt_ghi789",
  "type": "error.occurred",
  "created_at": "2026-06-19T10:31:00Z",
  "data": {
    "error_code": "MODEL_TIMEOUT",
    "error_message": "Model provider timed out after 30s",
    "model": "claude-3-5-sonnet",
    "user_id": "usr_abc123",
    "conversation_id": "conv_def456",
    "retryable": true
  }
}
```

**moderation.flagged**:
```json
{
  "id": "evt_mod001",
  "type": "moderation.flagged",
  "created_at": "2026-06-19T10:32:00Z",
  "data": {
    "content": "User message was flagged",
    "categories": ["hate_speech", "harassment"],
    "confidence_scores": {
      "hate_speech": 0.95,
      "harassment": 0.87,
      "sexual": 0.02,
      "violence": 0.01
    },
    "user_id": "usr_abc123",
    "action_taken": "message_blocked"
  }
}
```

---

## Webhook Security

```python
import hmac
import hashlib

def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected)

def verify_webhook_timestamp(timestamp: str, max_age: int = 300) -> bool:
    event_time = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    return (datetime.now(timezone.utc) - event_time).total_seconds() < max_age

# Comprehensive verification
def verify_webhook(request, secret: str, max_age: int = 300) -> bool:
    signature = request.headers.get("X-Webhook-Signature")
    timestamp = request.headers.get("X-Webhook-Timestamp")
    
    if not signature or not timestamp:
        return False
    
    # Check timestamp freshness (prevents replay attacks)
    if not verify_webhook_timestamp(timestamp, max_age):
        return False
    
    # Verify signature
    body = request.get_data()
    return verify_webhook_signature(body, signature, secret)
```

### Security Best Practices

```yaml
webhook_security:
  signature_verification:
    - "Always verify X-Webhook-Signature header"
    - "Use HMAC-SHA256 for signature generation"
    - "Store webhook secrets securely (e.g., environment variables)"
    - "Rotate secrets periodically"
  
  replay_protection:
    - "Check X-Webhook-Timestamp header"
    - "Reject events older than 5 minutes"
    - "Maintain a cache of processed event IDs"
  
  endpoint_security:
    - "Use HTTPS only"
    - "Restrict to known IP ranges if possible"
    - "Implement request rate limiting"
    - "Log all webhook requests"
```

---

## Webhook Retry Policy

| Attempt | Delay | Total Time |
|---|---|---|
| 1 | 0s | 0s |
| 2 | 10s | 10s |
| 3 | 30s | 40s |
| 4 | 60s | 100s |
| 5 | 120s | 220s |

After 5 failed attempts, the webhook is automatically disabled.

### Retry Response Codes

inte11ect will retry webhook delivery if your endpoint returns:
- `5xx` Server errors
- `429` Too Many Requests
- Timeout (no response within 10 seconds)

inte11ect will NOT retry on:
- `2xx` Success
- `4xx` Client errors (except 429)

### Handling Duplicate Events

```python
class DuplicateEventDetector:
    def __init__(self):
        self.processed_events = set()
        self.cleanup_interval = 3600  # 1 hour
    
    def is_duplicate(self, event_id: str) -> bool:
        if event_id in self.processed_events:
            return True
        self.processed_events.add(event_id)
        
        # Periodic cleanup
        if len(self.processed_events) > 10000:
            self.processed_events.clear()
        
        return False

# Usage in webhook handler
detector = DuplicateEventDetector()

@app.route("/inte11ect-webhook", methods=["POST"])
def webhook():
    event = request.json
    
    if detector.is_duplicate(event["id"]):
        return jsonify({"status": "already_processed"}), 200
    
    # Process event...
```

---

## Managing Webhooks

```bash
# List webhooks
curl -H "Authorization: Bearer TOKEN" https://api.inte11ect.dev/v1/webhooks

# Update webhook
curl -X PATCH https://api.inte11ect.dev/v1/webhooks/wh_abc123 \
  -H "Authorization: Bearer TOKEN" \
  -d '{"events": ["message.created", "model.completed"]}'

# Delete webhook
curl -X DELETE https://api.inte11ect.dev/v1/webhooks/wh_abc123 \
  -H "Authorization: Bearer TOKEN"

# Test webhook delivery
curl -X POST https://api.inte11ect.dev/v1/webhooks/wh_abc123/test \
  -H "Authorization: Bearer TOKEN"

# Get webhook delivery logs
curl -H "Authorization: Bearer TOKEN" \
  https://api.inte11ect.dev/v1/webhooks/wh_abc123/logs?limit=50

# Get webhook statistics
curl -H "Authorization: Bearer TOKEN" \
  https://api.inte11ect.dev/v1/webhooks/wh_abc123/stats
```

### Webhook Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Active: Created
    Active --> Disabled: 5 consecutive failures
    Active --> Deleted: Manual deletion
    Disabled --> Active: Re-enabled manually
    Deleted --> [*]
```

---

## Webhook Event Processing Patterns

### Fan-Out Pattern

```python
class WebhookFanOut:
    def __init__(self):
        self.subscribers = {
            "message.created": [],
            "export.completed": [],
            "error.occurred": []
        }
    
    def subscribe(self, event_type: str, handler):
        self.subscribers[event_type].append(handler)
    
    async def process_event(self, event: dict):
        handlers = self.subscribers.get(event["type"], [])
        results = []
        
        for handler in handlers:
            try:
                result = await handler(event["data"])
                results.append(result)
            except Exception as e:
                print(f"Handler failed: {e}")
        
        return results

# Usage
fan_out = WebhookFanOut()
fan_out.subscribe("message.created", log_to_database)
fan_out.subscribe("message.created", forward_to_slack)
fan_out.subscribe("message.created", update_analytics)
```

### Filter Pattern

```python
class WebhookFilter:
    def __init__(self):
        self.filters = []
    
    def add_filter(self, condition, handler):
        self.filters.append((condition, handler))
    
    async def process(self, event: dict):
        for condition, handler in self.filters:
            if condition(event["data"]):
                await handler(event["data"])

# Usage
filter = WebhookFilter()
filter.add_filter(
    lambda data: data.get("model") == "gpt-4o",
    handle_gpt4o_event
)
filter.add_filter(
    lambda data: data.get("error_code") == "RATE_LIMITED",
    handle_rate_limited
)
```

---

## Webhook Implementation in Different Languages

### Node.js Express

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

app.post('/inte11ect-webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];
  
  // Verify signature
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest('hex');
  
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const event = req.body;
  console.log(`Received event: ${event.type}`);
  
  res.json({ received: true });
});

app.listen(8080);
```

### Go Gin

```go
package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
    "io"
    "net/http"
    "github.com/gin-gonic/gin"
)

var webhookSecret = "your-webhook-secret"

func verifySignature(body []byte, signature string) bool {
    mac := hmac.New(sha256.New, []byte(webhookSecret))
    mac.Write(body)
    expected := hex.EncodeToString(mac.Sum(nil))
    return hmac.Equal([]byte(signature), []byte(expected))
}

func webhookHandler(c *gin.Context) {
    body, _ := io.ReadAll(c.Request.Body)
    signature := c.GetHeader("X-Webhook-Signature")
    
    if !verifySignature(body, signature) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid signature"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"status": "received"})
}

func main() {
    r := gin.Default()
    r.POST("/inte11ect-webhook", webhookHandler)
    r.Run(":8080")
}
```

---

## Webhook Monitoring

```python
class WebhookMonitor:
    def __init__(self):
        self.metrics = {
            "total_received": 0,
            "successful": 0,
            "failed": 0,
            "by_type": {}
        }
    
    def record_event(self, event_type: str, success: bool):
        self.metrics["total_received"] += 1
        if success:
            self.metrics["successful"] += 1
        else:
            self.metrics["failed"] += 1
        
        self.metrics["by_type"][event_type] = \
            self.metrics["by_type"].get(event_type, 0) + 1
    
    def get_report(self) -> dict:
        total = self.metrics["total_received"]
        return {
            **self.metrics,
            "success_rate": self.metrics["successful"] / max(total, 1) * 100
        }
```

---

## Webhook Best Practices

```yaml
webhook_best_practices:
  endpoint:
    - "Respond quickly (under 5 seconds)"
    - "Use a queue for heavy processing"
    - "Implement idempotency for duplicate events"
    - "Return appropriate HTTP status codes"
    - "Log all incoming events for debugging"
  
  reliability:
    - "Acknowledge receipt immediately"
    - "Process asynchronously when possible"
    - "Implement dead-letter queues for failures"
    - "Monitor webhook delivery success rate"
    - "Set up alerting for webhook failures"
  
  scaling:
    - "Use multiple endpoints for load balancing"
    - "Implement circuit breakers"
    - "Use webhook rate limiting"
    - "Consider webhook event filtering"
```

```
Lois-Kleinner and 0-1.gg 2026 — Confidential
```

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com