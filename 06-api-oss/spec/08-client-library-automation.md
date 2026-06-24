---
title: "Client Library Automation"
sidebar_position: 8
description: "Automatically generate and publish client libraries from the OpenAPI spec."
tags: [spec]
---

# Client Library Automation

## Overview

Automatically generate and publish client libraries from the OpenAPI spec.

## GitHub Actions Pipeline

```yaml
# .github/workflows/publish-sdks.yml
name: Publish SDKs
on:
  push:
    tags:
      - 'v*'

jobs:
  publish-typescript:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npx openapi-generator-cli generate -i docs/spec/openapi.yaml -g typescript-axios -o sdk/typescript
    - run: cd sdk/typescript && npm publish

  publish-python:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-python@v5
    - run: npx openapi-generator-cli generate -i docs/spec/openapi.yaml -g python -o sdk/python
    - run: cd sdk/python && pip install build && python -m build && twine upload dist/*

  publish-go:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-go@v5
    - run: npx openapi-generator-cli generate -i docs/spec/openapi.yaml -g go -o sdk/go
    - run: cd sdk/go && git tag v$(cat VERSION) && git push origin --tags
```

## Package Manager Targets

| Language | Package Manager | Registry |
|---|---|---|
| TypeScript | npm | npmjs.com |
| Python | pip | PyPI |
| Go | go modules | GitHub |
| Java | maven | Maven Central |
| C# | nuget | NuGet Gallery |
| Rust | cargo | crates.io |
| Ruby | gem | RubyGems |

## Version Alignment

```bash
#!/bin/bash
# scripts/align-sdk-versions.sh
SPEC_VERSION=$(grep '^version:' docs/spec/openapi.yaml | cut -d' ' -f2)
echo "Spec version: $SPEC_VERSION"

# Update SDK versions
sed -i "s/\"version\": \".*\"/\"version\": \"$SPEC_VERSION\"/" sdk/typescript/package.json
sed -i "s/version = .*/version = \"$SPEC_VERSION\"/" sdk/python/setup.cfg
```

## Automated PR on Spec Changes

```yaml
# .github/workflows/update-sdks.yml
name: Update SDKs
on:
  pull_request:
    paths:
      - 'docs/spec/openapi.yaml'
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
      with:
        ref: ${{ github.head_ref }}
    - run: npx openapi-generator-cli generate -i docs/spec/openapi.yaml -g typescript-axios -o sdk/typescript
    - uses: stefanzweifel/git-auto-commit-action@v5
```

## Next

- [09 Mock Server Generation](09-mock-server-generation.md)

## See Also

Related spec, API reference, and code generation documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [API Reference](../api-reference/01-overview.md)
- [API Versioning](../spec/02-api-versioning.md)
- [Code Generation](../spec/04-code-generation.md)
