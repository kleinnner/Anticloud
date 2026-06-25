.------------------------------------------------------------------------------.
|                                                                              |
|   ╔══════════════════════════════════════════════════════════════════════╗    |
|   ║                                                                      ║    |
|   ║        HOW-TO-USE DEVELOPERS — API CLIENT LIBRARIES                  ║    |
|   ║                                                                      ║    |
|   ║                    inte11ect — Community Intelligence                 ║    |
|   ║                                                                      ║    |
|   ╚══════════════════════════════════════════════════════════════════════╝    |
|                                                                              |
'------------------------------------------------------------------------------'

---

# inte11ect Developer: API Client Libraries

## Overview

inte11ect provides first-party SDK client libraries for multiple programming languages. This guide covers installation, configuration, and usage for each supported language.

## Supported Languages

| Language | Package | Status | Version |
|---|---|---|---|
| Python | `inte11ect-sdk` | Stable | 2.1.0 |
| Node.js | `@inte11ect/sdk` | Stable | 2.0.0 |
| Go | `github.com/inte11ect/go-sdk` | Beta | 0.9.0 |
| Java | `com.inte11ect:client` | Beta | 0.8.0 |
| Ruby | `inte11ect-ruby` | Beta | 0.7.0 |
| Rust | `inte11ect` | Alpha | 0.5.0 |

---

## Python Client

### Installation

```bash
pip install inte11ect-sdk
# or with extra dependencies
pip install inte11ect-sdk[async]
pip install inte11ect-sdk[streaming]
```

### Basic Usage

```python
from inte11ect import Inte11ect
from inte11ect.models import ChatCompletion, Model, Conversation

class PythonClient:
    def __init__(self, api_key: str):
        self.client = Inte11ect(api_key=api_key)
    
    def chat(self, model: str, messages: list, **kwargs) -> ChatCompletion:
        return self.client.chat.completions.create(
            model=model,
            messages=messages,
            **kwargs
        )
    
    def stream(self, model: str, messages: list):
        return self.client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True
        )
    
    def list_models(self) -> list[Model]:
        return self.client.models.list()
    
    def create_conversation(self, title: str, model: str) -> Conversation:
        return self.client.conversations.create(title=title, model=model)
    
    def get_ledger_entries(self, limit: int = 50):
        return self.client.ledger.list(limit=limit)

# Async usage
import asyncio
from inte11ect import AsyncInte11ect

async def async_example():
    client = AsyncInte11ect(api_key="your-api-key")
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(response.choices[0].message.content)

asyncio.run(async_example())
```

### Streaming with Python

```python
from inte11ect import Inte11ect

client = Inte11ect(api_key="your-api-key")

stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Write a short poem"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

### Error Handling

```python
from inte11ect.exceptions import (
    AuthenticationError,
    RateLimitError,
    APIError,
    ConnectionError
)

class RobustClient:
    def __init__(self, api_key: str):
        self.client = Inte11ect(api_key=api_key)
    
    def safe_chat(self, messages: list, retries: int = 3):
        for attempt in range(retries):
            try:
                return self.client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages
                )
            except AuthenticationError:
                raise  # Don't retry auth errors
            except RateLimitError as e:
                wait = e.retry_after or (2 ** attempt)
                time.sleep(wait)
            except (APIError, ConnectionError):
                if attempt == retries - 1:
                    raise
                time.sleep(2 ** attempt)
```

---

## Node.js Client

### Installation

```bash
npm install @inte11ect/sdk
# or
yarn add @inte11ect/sdk
```

### Basic Usage

```javascript
const { Inte11ect } = require('@inte11ect/sdk');

class NodeClient {
  constructor(config) {
    this.client = new Inte11ect(config);
  }
  
  async chat(model, messages, options = {}) {
    return this.client.chat.completions.create({
      model,
      messages,
      ...options
    });
  }
  
  async* stream(model, messages) {
    const stream = await this.client.chat.completions.create({
      model,
      messages,
      stream: true
    });
    
    for await (const chunk of stream) {
      yield chunk;
    }
  }
}

// TypeScript version
import { Inte11ect, type ChatCompletion } from '@inte11ect/sdk';

interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

class TypeScriptClient {
  private client: Inte11ect;
  
  constructor(config: ClientConfig) {
    this.client = new Inte11ect(config);
  }
  
  async chat(model: string, messages: Array<{role: string, content: string}>): Promise<ChatCompletion> {
    return this.client.chat.completions.create({ model, messages });
  }
}
```

---

## Go Client

### Installation

```bash
go get github.com/inte11ect/go-sdk
```

### Basic Usage

```go
package inte11ect

import (
    "bytes"
    "encoding/json"
    "net/http"
    "time"
)

type Client struct {
    apiKey  string
    baseURL string
    http    *http.Client
}

func NewClient(apiKey string) *Client {
    return &Client{
        apiKey:  apiKey,
        baseURL: "https://api.inte11ect.dev/v1",
        http:    &http.Client{Timeout: 30 * time.Second},
    }
}

func (c *Client) Chat(req *ChatRequest) (*ChatResponse, error) {
    body, _ := json.Marshal(req)
    httpReq, _ := http.NewRequest("POST", c.baseURL+"/chat", bytes.NewReader(body))
    httpReq.Header.Set("Authorization", "Bearer "+c.apiKey)
    httpReq.Header.Set("Content-Type", "application/json")
    
    resp, err := c.http.Do(httpReq)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var result ChatResponse
    json.NewDecoder(resp.Body).Decode(&result)
    return &result, nil
}

// Streaming in Go
func (c *Client) StreamChat(req *ChatRequest) (<-chan StreamChunk, error) {
    body, _ := json.Marshal(req)
    httpReq, _ := http.NewRequest("POST", c.baseURL+"/chat/stream", bytes.NewReader(body))
    httpReq.Header.Set("Authorization", "Bearer "+c.apiKey)
    
    resp, err := c.http.Do(httpReq)
    if err != nil {
        return nil, err
    }
    
    chunks := make(chan StreamChunk)
    go func() {
        defer resp.Body.Close()
        decoder := json.NewDecoder(resp.Body)
        for decoder.More() {
            var chunk StreamChunk
            decoder.Decode(&chunk)
            chunks <- chunk
        }
        close(chunks)
    }()
    
    return chunks, nil
}
```

---

## Ruby Client

### Installation

```bash
gem install inte11ect-ruby
```

### Basic Usage

```ruby
require "inte11ect"

client = Inte11ect::Client.new(api_key: ENV["INTE11ECT_API_KEY"])

# Chat completion
response = client.chat(
  model: "gpt-4o-mini",
  messages: [{role: "user", content: "Hello!"}]
)
puts response.dig("choices", 0, "message", "content")

# Streaming
client.chat(
  model: "gpt-4o-mini",
  messages: [{role: "user", content: "Tell me a story"}],
  stream: true
) do |chunk|
  print chunk.dig("choices", 0, "delta", "content")
end

# List models
models = client.models.list
models.each { |m| puts m["id"] }
```

---

## Java Client

### Installation

```xml
<!-- Maven -->
<dependency>
    <groupId>com.inte11ect</groupId>
    <artifactId>client</artifactId>
    <version>0.8.0</version>
</dependency>
```

### Basic Usage

```java
import com.inte11ect.client.*;

public class Inte11ectExample {
    public static void main(String[] args) {
        Inte11ectClient client = new Inte11ectClient.Builder()
            .apiKey(System.getenv("INTE11ECT_API_KEY"))
            .build();
        
        ChatRequest request = ChatRequest.builder()
            .model("gpt-4o-mini")
            .addMessage(Message.user("Hello!"))
            .build();
        
        ChatResponse response = client.chat(request);
        System.out.println(response.getChoices().get(0).getMessage().getContent());
    }
}

// Async Java client
public class AsyncExample {
    public static void main(String[] args) throws Exception {
        Inte11ectAsyncClient client = new Inte11ectAsyncClient.Builder()
            .apiKey(System.getenv("INTE11ECT_API_KEY"))
            .build();
        
        CompletableFuture<ChatResponse> future = client.chatAsync(
            ChatRequest.builder()
                .model("gpt-4o-mini")
                .addMessage(Message.user("Hello asynchronously!"))
                .build()
        );
        
        future.thenAccept(response -> {
            System.out.println(response.getChoices().get(0).getMessage().getContent());
        });
    }
}
```

---

## Rust Client

### Installation

```toml
# Cargo.toml
[dependencies]
inte11ect = "0.5"
tokio = { version = "1", features = ["full"] }
```

### Basic Usage

```rust
use inte11ect::Client;

#[tokio::main]
async fn main() {
    let client = Client::new(std::env::var("INTE11ECT_API_KEY").unwrap());
    
    let response = client.chat()
        .model("gpt-4o-mini")
        .message("user", "Hello!")
        .send()
        .await
        .unwrap();
    
    println!("{}", response.choices[0].message.content);
}

// Streaming in Rust
async fn stream_example() {
    let client = Client::new(std::env::var("INTE11ECT_API_KEY").unwrap());
    
    let mut stream = client.chat()
        .model("gpt-4o-mini")
        .message("user", "Count to 10")
        .stream()
        .await
        .unwrap();
    
    while let Some(chunk) = stream.next().await {
        if let Some(content) = chunk.choices[0].delta.content {
            print!("{}", content);
        }
    }
}
```

---

## Client Configuration

All SDK clients support the following configuration options:

| Option | Type | Default | Description |
|---|---|---|---|
| apiKey | string | null | Your API key |
| baseUrl | string | https://api.inte11ect.dev/v1 | API base URL |
| timeout | number | 30000 | Request timeout (ms) |
| maxRetries | number | 3 | Max retry attempts |
| retryDelay | number | 1000 | Base retry delay (ms) |
| userAgent | string | inte11ect-sdk/version | Custom user agent |
| proxy | string | null | HTTP proxy URL |

### Configuration Examples

```python
# Python
client = Inte11ect(
    api_key="key",
    base_url="https://api.inte11ect.dev/v1",
    timeout=60000,
    max_retries=5
)
```

```javascript
// Node.js
const client = new Inte11ect({
  apiKey: "key",
  baseUrl: "https://api.inte11ect.dev/v1",
  timeout: 60000,
  maxRetries: 5
});
```

---

## Authentication Methods

```python
# API Key (recommended)
client = Inte11ect(api_key="sk-...")

# Environment variable
import os
client = Inte11ect(api_key=os.environ["INTE11ECT_API_KEY"])

# OAuth token
client = Inte11ect(api_key="oauth-...")

# Session token (temporary)
client = Inte11ect(api_key="sess-...")
```

### API Key Best Practices

```yaml
api_key_security:
  - "Never commit API keys to version control"
  - "Use environment variables or secret managers"
  - "Rotate keys every 90 days"
  - "Use separate keys for dev/staging/production"
  - "Set appropriate permissions on each key"
  - "Monitor API key usage for anomalies"
  - "Revoke compromised keys immediately"
```

---

## Pagination

```python
# Python - paginated results
def list_all_conversations(client, page_size: int = 50):
    all_conversations = []
    cursor = None
    
    while True:
        response = client.conversations.list(
            limit=page_size,
            cursor=cursor
        )
        all_conversations.extend(response.data)
        
        if not response.has_more:
            break
        
        cursor = response.next_cursor
    
    return all_conversations
```

---

## Rate Limiting

```python
class RateLimitedClient:
    def __init__(self, api_key: str, rpm: int = 60):
        self.client = Inte11ect(api_key=api_key)
        self.rpm = rpm
        self.timestamps = []
    
    def wait_if_needed(self):
        now = time.time()
        self.timestamps = [t for t in self.timestamps if now - t < 60]
        
        if len(self.timestamps) >= self.rpm:
            sleep_time = 60 - (now - self.timestamps[0])
            time.sleep(sleep_time)
        
        self.timestamps.append(time.time())
    
    def chat(self, model: str, messages: list):
        self.wait_if_needed()
        return self.client.chat.completions.create(
            model=model,
            messages=messages
        )
```

---

## Webhook Support

```python
# Register webhook with SDK
client.webhooks.register(
    url="https://myapp.com/inte11ect-webhook",
    events=["message.created", "export.completed"],
    secret="my-webhook-secret"
)

# List webhooks
webhooks = client.webhooks.list()

# Delete webhook
client.webhooks.delete("wh_abc123")
```

---

## SDK Version Migration

```python
# Version 1.x (legacy)
client = Inte11ect(api_key="key")
response = client.Completion.create(model="gpt-4o-mini", prompt="Hello")

# Version 2.x (current)
client = Inte11ect(api_key="key")
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello"}]
)
```

### Migration Checklist

- [ ] Update imports to new module structure
- [ ] Replace `prompt` parameter with `messages` array
- [ ] Replace `Completion.create` with `chat.completions.create`
- [ ] Update error handling imports
- [ ] Test streaming functionality
- [ ] Verify authentication still works
- [ ] Check pagination API changes
- [ ] Review rate limit handling

---

## Troubleshooting SDK Issues

| Issue | Cause | Solution |
|---|---|---|
| ImportError | SDK not installed | Run `pip install inte11ect-sdk` |
| AuthenticationError | Invalid API key | Check environment variable |
| Timeout | Network issues | Increase timeout setting |
| JSONDecodeError | API version mismatch | Update SDK to latest |
| ConnectionError | Proxy configuration | Check proxy settings |
| RateLimitError | Too many requests | Implement backoff |
| TypeError | Wrong parameter type | Check API documentation |

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
