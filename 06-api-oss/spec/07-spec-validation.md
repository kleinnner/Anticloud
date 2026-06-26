---
title: "Spec Validation & Linting"
sidebar_position: 7
description: "Validate and lint the OpenAPI specification for correctness and consistency."
tags: [spec]
---

# Spec Validation & Linting

## Overview

Validate and lint the OpenAPI specification for correctness and consistency.

## Spectral Linting

### Installation

```bash
npm install -g @stoplight/spectral-cli
```

### Usage

```bash
# Basic lint
spectral lint docs/spec/openapi.yaml

# With custom ruleset
spectral lint docs/spec/openapi.yaml --ruleset .spectral.yml

# Output formats
spectral lint docs/spec/openapi.yaml --format json
spectral lint docs/spec/openapi.yaml --format junit -o report.xml
```

### Ruleset

```yaml
# .spectral.yml
extends:
  - spectral:oas
  - spectral:api-oss

rules:
  apioss-route-naming:
    description: Route paths must be kebab-case
    severity: error
    given: $.paths[*]~
    then:
      function: pattern
      functionOptions:
        match: "^/[a-z0-9-]+(/[a-z0-9-]+)*$"

  apioss-response-examples:
    description: All responses must have examples
    severity: warn
    given: $.paths.*.*.responses.*.content.*
    then:
      field: example
      function: truthy
```

## OpenAPI CLI Validation

```bash
# Online validator
curl -X POST https://validator.openapi.cloud/validate \
  -H "Content-Type: application/json" \
  -d @docs/spec/openapi.yaml

# Offline validation with openapi-cli
npm install @apidevtools/swagger-cli -g
swagger-cli validate docs/spec/openapi.yaml
```

## Custom API-OSS Validation

```bash
# API-OSS spec validator
apioss spec validate docs/spec/openapi.yaml

# Check extensions
apioss spec validate --extensions docs/spec/openapi.yaml

# Generate report
apioss spec validate --format html -o report.html docs/spec/openapi.yaml
```

## CI Integration

```yaml
# .github/workflows/spec-validation.yml
name: Spec Validation
on:
  pull_request:
    paths:
      - 'docs/spec/openapi.yaml'
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm install -g @stoplight/spectral-cli
    - run: spectral lint docs/spec/openapi.yaml
    - run: npx @openapitools/openapi-diff --from=main:docs/spec/openapi.yaml --to=HEAD:docs/spec/openapi.yaml
```

## Common Issues

| Issue | Fix |
|---|---|
| Missing operationId | Add `operationId` to all endpoints |
| Missing response examples | Add example responses |
| Invalid schema references | Check `$ref` paths |
| Circular references | Break circular dependencies |
| Missing security schemes | Define auth schemes in components |

## Next

- [08 Client Library Automation](08-client-library-automation.md)

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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
