---
title: "Code Generation from OpenAPI Spec"
sidebar_position: 4
description: "Generate client libraries from the OpenAPI specification."
tags: [spec]
---

# Code Generation from OpenAPI Spec

## Overview

Generate client libraries from the OpenAPI specification.

## Prerequisites

```bash
# Install OpenAPI Generator
npm install @openapitools/openapi-generator-cli -g
```

## TypeScript/Axios

```bash
npx openapi-generator-cli generate \
  -i docs/spec/openapi.yaml \
  -g typescript-axios \
  -o sdk/typescript \
  --additional-properties=supportsES6=true,withInterfaces=true
```

```typescript
import { ChatApi } from './sdk/typescript';

const api = new ChatApi();
const response = await api.createChatCompletion({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello' }]
});
```

## Python

```bash
npx openapi-generator-cli generate \
  -i docs/spec/openapi.yaml \
  -g python \
  -o sdk/python \
  --additional-properties=packageName=apioss_sdk

pip install ./sdk/python
```

```python
from apioss_sdk import ChatApi, Configuration

config = Configuration(access_token='ak-...')
api = ChatApi(config)
response = api.create_chat_completion(
    model='gpt-4',
    messages=[{'role': 'user', 'content': 'Hello'}]
)
```

## Go

```bash
npx openapi-generator-cli generate \
  -i docs/spec/openapi.yaml \
  -g go \
  -o sdk/go \
  --additional-properties=packageName=apioss
```

```go
import apioss "sdk/go"

client := apioss.NewAPIClient(apioss.NewConfiguration())
resp, _, err := client.ChatApi.CreateChatCompletion(ctx, body)
```

## Java

```bash
npx openapi-generator-cli generate \
  -i docs/spec/openapi.yaml \
  -g java \
  -o sdk/java \
  --additional-properties=artifactId=apioss-sdk
```

## C# / .NET

```bash
npx openapi-generator-cli generate \
  -i docs/spec/openapi.yaml \
  -g csharp \
  -o sdk/csharp
```

## Rust

```bash
npx openapi-generator-cli generate \
  -i docs/spec/openapi.yaml \
  -g rust \
  -o sdk/rust
```

## Automation

```yaml
# .github/workflows/generate-sdks.yml
name: Generate SDKs
on:
  push:
    paths:
      - 'docs/spec/openapi.yaml'
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npx openapi-generator-cli generate -i docs/spec/openapi.yaml -g typescript-axios -o sdk/typescript
    - run: npx openapi-generator-cli generate -i docs/spec/openapi.yaml -g python -o sdk/python
    - uses: stefanzweifel/git-auto-commit-action@v5
```

## Next

- [05 Contract Testing](05-contract-testing.md)

## See Also

Related spec, API reference, and code generation documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [API Reference](../api-reference/01-overview.md)
- [API Versioning](../spec/02-api-versioning.md)
- [Code Generation](../spec/04-code-generation.md)
