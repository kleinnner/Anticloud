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

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
