---
title: "Custom Extensions Reference"
sidebar_position: 6
description: "API-OSS extends OpenAPI with vendor-specific extensions for gateway configuration."
tags: [spec]
---

# Custom Extensions Reference

## Overview

API-OSS extends OpenAPI with vendor-specific extensions for gateway configuration.

## Extension Prefix

All custom extensions use the `x-apioss-` prefix.

## Route Extensions

```yaml
/v1/chat:
  post:
    x-apioss-route:
      rateLimit:
        requests: 1000
        window: 60s
      auth:
        required: true
        scopes:
          - chat:write
      upstream:
        timeout: 30s
        retries: 3
        circuitBreaker:
          threshold: 5
          halfOpenAfter: 30s
      cors:
        origins:
          - https://app.example.com
        methods:
          - POST
          - OPTIONS
```

## Model Extensions

```yaml
components:
  schemas:
    Model:
      x-apioss-model:
        provider: openai
        capabilities:
          - chat
          - embeddings
        contextWindow: 8192
        pricing:
          input: 0.01
          output: 0.03
        rateLimit:
          rpm: 10000
          tpm: 1000000
```

## Plugin Extensions

```yaml
x-apioss-plugins:
  - name: custom-auth
    type: middleware
    phase: pre-auth
    config:
      api_key_header: X-API-Key
      validation_url: https://auth.internal/validate
```

## Webhook Extensions

```yaml
x-apioss-webhooks:
  chat.completed:
    url: https://hooks.example.com/chat
    events:
      - chat.completed
      - chat.failed
    secret: ${WEBHOOK_SECRET}
    retry:
      maxAttempts: 3
      backoff: exponential
```

## Deprecation Extensions

```yaml
paths:
  /v1/old-endpoint:
    x-apioss-deprecated:
      version: "1.0"
      sunset: "2025-12-31"
      migration: /v2/new-endpoint
```

## Extension Validation

```bash
# Validate extensions
apioss spec validate docs/spec/openapi.yaml

# Generate config from spec
apioss spec generate-config docs/spec/openapi.yaml -o config.yml
```

## Next

- [07 Spec Validation](07-spec-validation.md)

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
