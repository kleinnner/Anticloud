---
title: "CI/CD Architecture"
sidebar_position: 14
description: "CI/CD pipeline architecture for API-OSS deployments."
tags: [architecture]
---

# CI/CD Architecture

## Overview

CI/CD pipeline architecture for API-OSS deployments.

## Pipeline Stages

```yaml
stages:
  - name: lint
    commands:
      - cargo fmt --check
      - cargo clippy
      - spectral lint docs/spec/openapi.yaml

  - name: test
    commands:
      - cargo test --unit
      - cargo test --integration
      - cargo test --e2e

  - name: build
    commands:
      - docker build -t api-oss:$TAG .
      - docker push api-oss:$TAG

  - name: deploy-staging
    commands:
      - helm upgrade apioss ./helm --namespace staging
      - docker compose -f docker-compose.staging.yml up -d

  - name: integration-test
    commands:
      - newman run tests/postman/collection.json
      - dredd docs/spec/openapi.yaml http://staging:8080

  - name: deploy-production
    commands:
      - helm upgrade apioss ./helm --namespace production
```

## GitHub Actions

```yaml
name: Deploy
on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cargo build --release
      - run: cargo test
      - run: docker build -t api-oss:${{ github.ref_name }} .
      - run: docker push api-oss:${{ github.ref_name }}
      - run: helm upgrade apioss ./helm --set image.tag=${{ github.ref_name }}
```

## Canary Deployments

```yaml
canary:
  enabled: true
  initial_percent: 10
  increment: 10
  interval: 5m
  metrics:
    - error_rate < 1%
    - p99_latency < 500ms
```

## Next

- [15 Architecture Index](15-architecture-index.md)

## See Also

Related architecture, deployment, and operations documentation.

- [Deployment Guide](../deployment/01-overview.md)
- [Security Overview](../security/01-security-overview.md)
- [Operations Guide](../operations/01-operations-overview.md)
- [Self-Hosting Guide](../self-hosting/01-overview.md)
