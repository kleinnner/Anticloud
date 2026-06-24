---
title: "OpenAPI Spec Overview"
sidebar_position: 1
description: "API-OSS provides a complete OpenAPI 3.1 specification covering the proxy API and admin API."
tags: [spec]
---

# OpenAPI Spec Overview

## Introduction

API-OSS provides a complete OpenAPI 3.1 specification covering the proxy API and admin API.

## Spec Location

```
docs/spec/openapi.yaml
```

## Coverage

| Section | Endpoints |
|---|---|
| **Proxy API** | Chat, embeddings, models, search, ingest, health, WebSocket |
| **Admin API** | Routes, plugins, keys, users, workspaces, stats, audit, config, alerts, datasources, workflows, billing |

## Using the Spec

### Online Viewer

```bash
# Swagger UI
docker run -p 8080:8080 -v $(pwd)/docs/spec:/spec swaggerapi/swagger-ui
# Open http://localhost:8080
```

### Code Generation

```bash
# TypeScript
npx openapi-generator-cli generate \
  -i docs/spec/openapi.yaml \
  -g typescript-axios \
  -o sdk/typescript

# Python
npx openapi-generator-cli generate \
  -i docs/spec/openapi.yaml \
  -g python \
  -o sdk/python

# Go
npx openapi-generator-cli generate \
  -i docs/spec/openapi.yaml \
  -g go \
  -o sdk/go
```

### Validation

```bash
# Install spectral
npm install -g @stoplight/spectral-cli

# Validate
spectral lint docs/spec/openapi.yaml

# Check for breaking changes
npx @openapitools/openapi-diff \
  --from docs/spec/openapi-v2.yaml \
  --to docs/spec/openapi.yaml
```

## Next

- [02 API Versioning](02-api-versioning.md)
- [03 Changelog](03-changelog-breaking-changes.md)
- [04 Code Generation](04-code-generation.md)

## See Also

Related spec, API reference, and code generation documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [API Reference](../api-reference/01-overview.md)
- [API Versioning](../spec/02-api-versioning.md)
- [Code Generation](../spec/04-code-generation.md)
