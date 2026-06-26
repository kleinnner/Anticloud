.------------------------------------------------------------------------------.
|                                                                              |
|   +----------------------------------------------------------------------+    |
|   ¦                                                                      ¦    |
|   ¦          HOW-TO-USE DEVELOPERS — DEVELOPER QUICK START               ¦    |
|   ¦                                                                      ¦    |
|   ¦                    inte11ect — Community Intelligence                 ¦    |
|   ¦                                                                      ¦    |
|   +----------------------------------------------------------------------+    |
|                                                                              |
'------------------------------------------------------------------------------'

---

# inte11ect Developer: Quick Start Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [First API Call](#first-api-call)
4. [SDK Installation](#sdk-installation)
5. [Basic Integration Patterns](#basic-integration-patterns)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Webhooks Setup](#webhooks-setup)
9. [CLI for Developers](#cli-for-developers)
10. [Testing Your Integration](#testing-your-integration)

---

## Getting Started

```mermaid
flowchart LR
    A[Register Account] --> B[Generate API Key]
    B --> C[Install SDK]
    C --> D[Make First Call]
    D --> E[Build Integration]
    E --> F[Test & Deploy]
```

### Prerequisites

- API key from Settings > API Keys
- Node.js 18+ or Python 3.9+
- Basic understanding of REST APIs

---

## Authentication

```python
import requests

API_KEY = "your-api-key-here"
BASE_URL = "https://api.inte11ect.dev/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Test authentication
response = requests.get(f"{BASE_URL}/me", headers=headers)
print(response.json())
```

### Token Types

```yaml
token_types:
  api_key:
    type: "Bearer token"
    expiry: "Never (revocable)"
    usage: "Server-side integrations"
  
  jwt:
    type: "JWT Bearer token"
    expiry: "1 hour"
    usage: "User-facing applications"
  
  oauth:
    type: "OAuth 2.0"
    expiry: "Configurable"
    usage: "Third-party apps"
```

---

## First API Call

### List Available Models

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.inte11ect.dev/v1/models
```

```json
{
  "data": [
    {
      "id": "gpt-4o",
      "provider": "openai",
      "context_window": 128000,
      "capabilities": ["chat", "vision"]
    },
    {
      "id": "claude-3-5-sonnet",
      "provider": "anthropic",
      "context_window": 200000,
      "capabilities": ["chat", "vision"]
    }
  ]
}
```

### Send a Chat Message

```bash
curl -X POST https://api.inte11ect.dev/v1/chat \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ],
    "max_tokens": 100
  }'
```

```json
{
  "id": "chatcmpl_abc123",
  "model": "gpt-4o-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I assist you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  }
}
```

---

## SDK Installation

### Python SDK

```bash
pip install inte11ect-sdk
```

```python
from inte11ect import Inte11ect

client = Inte11ect(api_key="your-api-key")

# List models
models = client.models.list()
for model in models:
    print(f"{model.id} - {model.provider}")

# Chat completion
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

### Node.js SDK

```bash
npm install @inte11ect/sdk
```

```javascript
const { Inte11ect } = require('@inte11ect/sdk');

const client = new Inte11ect({
  apiKey: process.env.INTE11ECT_API_KEY
});

async function main() {
  // List models
  const models = await client.models.list();
  console.log(models);
  
  // Chat completion
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Hello!' }]
  });
  console.log(response.choices[0].message.content);
}

main();
```

### Go SDK

```bash
go get github.com/inte11ect/sdk-go
```

```go
package main

import (
    "fmt"
    "github.com/inte11ect/sdk-go"
)

func main() {
    client := inte11ect.NewClient("your-api-key")
    
    models, err := client.Models.List()
    if err != nil {
        panic(err)
    }
    fmt.Printf("Models: %+v\n", models)
    
    resp, err := client.Chat.Create(&inte11ect.ChatRequest{
        Model: "gpt-4o-mini",
        Messages: []inte11ect.Message{
            {Role: "user", Content: "Hello!"},
        },
    })
    if err != nil {
        panic(err)
    }
    fmt.Println(resp.Choices[0].Message.Content)
}
```

---

## Basic Integration Patterns

### Pattern 1: Streaming Chat

```python
from inte11ect import Inte11ect

client = Inte11ect(api_key="your-api-key")

def stream_chat():
    stream = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Write a story"}],
        stream=True
    )
    
    for chunk in stream:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)

stream_chat()
```

### Pattern 2: Conversation Management

```javascript
class ConversationManager {
  constructor(client) {
    this.client = client;
    this.conversations = new Map();
  }

  async createConversation(model = 'gpt-4o-mini') {
    const conv = await this.client.conversations.create({
      model,
      title: `Chat ${new Date().toISOString()}`
    });
    this.conversations.set(conv.id, conv);
    return conv;
  }

  async sendMessage(conversationId, content) {
    const conv = this.conversations.get(conversationId);
    if (!conv) throw new Error('Conversation not found');
    
    const response = await this.client.chat.completions.create({
      model: conv.model,
      messages: [
        ...conv.messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content }
      ]
    });
    
    conv.messages.push(
      { role: 'user', content },
      { role: 'assistant', content: response.choices[0].message.content }
    );
    
    return response.choices[0].message.content;
  }
}
```

### Pattern 3: System Prompt Templates

```python
class SystemPromptTemplates:
    def __init__(self):
        self.templates = {
            "code_review": "You are an expert code reviewer...",
            "translator": "You are a professional translator...",
            "analyst": "You are a data analyst..."
        }
    
    def chat_with_template(self, template_name: str, user_message: str) -> str:
        system_prompt = self.templates.get(template_name)
        if not system_prompt:
            raise ValueError(f"Unknown template: {template_name}")
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message.content
```

---

## Error Handling

```python
from inte11ect import Inte11ect, APIError, RateLimitError, AuthError

client = Inte11ect(api_key="your-api-key")

def safe_chat_call(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                timeout=30
            )
            return response
        
        except RateLimitError as e:
            wait_time = e.retry_after or (2 ** attempt)
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)
        
        except AuthError:
            print("Authentication failed. Check your API key.")
            break
        
        except APIError as e:
            print(f"API error: {e.status_code} - {e.message}")
            if e.status_code >= 500:
                time.sleep(2 ** attempt)
            else:
                break
        
        except TimeoutError:
            print(f"Request timed out (attempt {attempt + 1})")
    
    raise Exception("Max retries exceeded")
```

---

## Rate Limiting

```python
class RateLimitedClient:
    def __init__(self, api_key: str, tier: str = "pro"):
        self.client = Inte11ect(api_key=api_key)
        self.limits = {
            "community": {"rpm": 10, "rpd": 100},
            "pro": {"rpm": 100, "rpd": 1000},
            "team": {"rpm": 500, "rpd": 10000}
        }
        self.limit = self.limits.get(tier, self.limits["community"])
        self.request_times = []
    
    async def request(self, messages):
        await self.wait_for_capacity()
        
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        
        self.request_times.append(time.time())
        return response
    
    async def wait_for_capacity(self):
        now = time.time()
        
        # Clean old requests
        self.request_times = [t for t in self.request_times if now - t < 60]
        
        if len(self.request_times) >= self.limit["rpm"]:
            wait = 60 - (now - self.request_times[0])
            if wait > 0:
                await asyncio.sleep(wait)
```

---

## Webhooks Setup

```python
from fastapi import FastAPI, Request, HTTPException
import hashlib
import hmac

app = FastAPI()

@app.post("/webhooks/inte11ect")
async def handle_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("X-Webhook-Signature")
    webhook_secret = "your-webhook-secret"
    
    # Verify signature
    expected = hmac.new(
        webhook_secret.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(401, "Invalid signature")
    
    event = await request.json()
    
    # Handle event
    if event["type"] == "message.created":
        await handle_new_message(event["data"])
    elif event["type"] == "export.completed":
        await handle_export_completed(event["data"])
    
    return {"status": "ok"}

async def handle_new_message(data: dict):
    print(f"New message from {data['user_id']}: {data['content_preview']}")

async def handle_export_completed(data: dict):
    print(f"Export ready: {data['download_url']}")
```

---

## CLI for Developers

```bash
# Install CLI
npm install -g @inte11ect/cli

# Configure
inte11ect config set api_key "your-api-key"

# Test connection
inte11ect api check

# Quick chat
inte11ect ask "What is the capital of France?"

# JSON mode
inte11ect ask --json "List 3 programming languages"

# Pipe operations
cat data.txt | inte11ect ask "Summarize this" > summary.txt
```

---

## Testing Your Integration

```bash
# Health check
curl https://api.inte11ect.dev/health

# Test authentication
curl -I https://api.inte11ect.dev/v1/me \
  -H "Authorization: Bearer YOUR_KEY"

# Test model access
inte11ect models list

# Test rate limits
inte11ect benchmark --requests 10 --concurrency 2

# Run integration tests
inte11ect test integration

# Monitor API usage
inte11ect api usage
```

---

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ