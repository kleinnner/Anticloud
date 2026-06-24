---
title: "apioss-github-action"
sidebar_position: 5
description: "GitHub Action for CI/CD with API-OSS."
tags: [community-projects]
---

# apioss-github-action

## Overview

GitHub Action for CI/CD with API-OSS.

## Usage

```yaml
name: Deploy API-OSS Config
on:
  push:
    branches: [main]
    paths:
      - 'config/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: community/apioss-github-action@v1
        with:
          endpoint: ${{ secrets.APIOSS_ENDPOINT }}
          api_key: ${{ secrets.APIOSS_KEY }}
          config_path: ./config/production.yml
```

## Inputs

```yaml
inputs:
  endpoint:
    description: "API-OSS endpoint URL"
    required: true
  api_key:
    description: "API-OSS API key"
    required: true
  config_path:
    description: "Path to config file"
    required: true
  validate_only:
    description: "Only validate, don't apply"
    required: false
    default: "false"
```

## Next

- [apioss-helm Charts](06-helm-charts-guide.md)

## See Also

Related community projects and development documentation.

- [Community Projects](../community-projects/01-community-projects-overview.md)
- [Community Overview](../community/01-building-community.md)
- [Contributing Guide](../contributing/01-contributing-overview.md)
- [Plugin Development](../plugins/01-plugins-overview.md)
