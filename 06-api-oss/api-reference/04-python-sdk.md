---
title: "API Reference 04: Python SDK"
sidebar_position: 4
description: "pip install api-oss"
tags: [api]
---

# API Reference 04: Python SDK

## Installation

```bash
pip install api-oss
```

## Client Initialization

```python
from api_oss import APIOSS

# Basic
client = APIOSS(
    api_key="sk-aioss-xxxxxxxxxxxx",
    base_url="http://localhost:8080/v1"
)

# With timeout and retries
client = APIOSS(
    api_key="sk-aioss-xxxxxxxxxxxx",
    base_url="http://localhost:8080/v1",
    timeout=30.0,
    max_retries=3,
    default_headers={"X-Codex-Id": "project-alpha"}
)
```

## Chat

```python
# Basic chat
response = client.chat.completions.create(
    model="qwen2.5-7b-q4",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)

# With system prompt
response = client.chat.completions.create(
    model="qwen2.5-7b-q4",
    messages=[
        {"role": "system", "content": "You are a legal assistant."},
        {"role": "user", "content": "Analyze this contract"}
    ]
)

# Streaming
stream = client.chat.completions.create(
    model="qwen2.5-7b-q4",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

## Function Calling

```python
from api_oss import APIOSS

client = APIOSS(api_key="sk-aioss-xxxxxxxxxxxx")

# Define tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name"
                    }
                },
                "required": ["location"]
            }
        }
    }
]

# Execute tool call
response = client.chat.completions.create(
    model="qwen2.5-7b-q4",
    messages=[{"role": "user", "content": "What's the weather in London?"}],
    tools=tools
)

# Handle tool call
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    import json
    args = json.loads(tool_call.function.arguments)
    result = get_weather(args["location"])  # Your function
    # Send result back
    response = client.chat.completions.create(
        model="qwen2.5-7b-q4",
        messages=[
            {"role": "user", "content": "What's the weather in London?"},
            response.choices[0].message,
            {"role": "tool", "tool_call_id": tool_call.id, "content": str(result)}
        ]
    )
```

## Graph Operations

```python
# Search graph
results = client.graph.search(query="liability cap", limit=10)
for node in results:
    print(f"{node.label} ({node.node_type}): {node.content[:100]}")

# Get node by ID
node = client.graph.get("uuid_insurance_policy")
print(node.content)

# Create node
new_node = client.graph.create(
    node_type="Concept",
    label="New Policy Clause",
    content="Clause 4.3: Extended liability coverage..."
)

# Create edge
client.graph.link(
    source_id=new_node.id,
    target_id="uuid_insurance_policy",
    edge_type="REFERENCES"
)

# Get neighbors
neighbors = client.graph.neighbors("uuid_sarah", depth=2)
```

## Documents

```python
# Ingest a file
result = client.documents.ingest("./contract.pdf")
print(f"Created {result.nodes_created} nodes")

# List documents
docs = client.documents.list(codex_id="project-alpha")
for doc in docs:
    print(f"{doc.filename}: {doc.status}")

# Watch directory (continuous)
client.documents.watch("./inbox/")
```

## Models

```python
# List models
models = client.models.list()
for model in models:
    print(f"{model.id}: {model.quantization} ({model.size_gb}GB)")

# Download model
client.models.download("qwen2.5-7b-q4")

# Get model info
info = client.models.get("qwen2.5-7b-q4")
print(f"Context: {info.context_length}, RAM: {info.ram_required_gb}GB")
```

## Error Handling

```python
from api_oss import APIOSSError, RateLimitError, AuthError

try:
    response = client.chat.completions.create(...)
except RateLimitError:
    print("Rate limited. Retrying in 5s...")
    time.sleep(5)
except AuthError:
    print("Invalid API key")
except APIOSSError as e:
    print(f"API error: {e.code} - {e.message}")
```

## Async Support

```python
from api_oss import AsyncAPIOSS
import asyncio

async def main():
    client = AsyncAPIOSS(
        api_key="sk-aioss-xxxxxxxxxxxx",
        base_url="http://localhost:8080/v1"
    )
    
    response = await client.chat.completions.create(
        model="qwen2.5-7b-q4",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(response.choices[0].message.content)

asyncio.run(main())
```

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)
