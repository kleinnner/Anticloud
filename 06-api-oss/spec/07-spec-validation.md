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
