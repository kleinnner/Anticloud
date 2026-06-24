---
title: "OpenAPI Best Practices"
sidebar_position: 10
description: "Best practices for maintaining the API-OSS OpenAPI specification."
tags: [spec]
---

# OpenAPI Best Practices

## Overview

Best practices for maintaining the API-OSS OpenAPI specification.

## Spec Organization

```
openapi.yaml
  components/
    schemas/        # Reusable data models
    responses/      # Reusable responses
    parameters/     # Reusable parameters
    examples/       # Reusable examples
    headers/        # Reusable headers
    securitySchemes/# Auth definitions
  paths/
    /v1/chat/       # Group by resource
    /v1/models/
    /v2/admin/
```

## Naming Conventions

```yaml
# Operation IDs: {verb}{Resource}
operationId: createChatCompletion
operationId: listModels
operationId: deleteApiKey

# Schemas: PascalCase
ChatCompletionRequest
ModelList
ErrorResponse

# Parameters: camelCase
modelName
pageSize
cursorToken
```

## Documentation

```yaml
# Every endpoint needs summary and description
paths:
  /v1/chat:
    post:
      summary: Create a chat completion
      description: |
        Sends a chat conversation to the model and returns a completion.
        
        **Rate limits:** 1000 requests per minute
        **Auth required:** Yes
      tags:
        - Chat
```

## Security

```yaml
# Define once, reuse everywhere
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: API key authentication

# Apply globally or per-endpoint
security:
  - bearerAuth: []
```

## Error Responses

```yaml
responses:
  '400':
    description: Bad request
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Error'
        example:
          error:
            code: invalid_request
            message: "Model parameter is required"
            type: validation_error
  '429':
    description: Rate limit exceeded
    headers:
      X-RateLimit-Remaining:
        schema:
          type: integer
      X-RateLimit-Reset:
        schema:
          type: integer
```

## Version Control

```yaml
# Keep spec version aligned with release
info:
  version: 3.0.0
  x-apioss-release-date: 2025-04-15
```

## Linting Rules

```yaml
# Mandatory rules
- operationId must be present on all endpoints
- All responses must have examples
- All parameters must have descriptions
- No unused components
- Path parameters must use {param} syntax
```

## Next

- [OpenAPI Spec](../spec/openapi.yaml)

## See Also

Related spec, API reference, and code generation documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [API Reference](../api-reference/01-overview.md)
- [API Versioning](../spec/02-api-versioning.md)
- [Code Generation](../spec/04-code-generation.md)
