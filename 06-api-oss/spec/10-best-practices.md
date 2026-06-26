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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ