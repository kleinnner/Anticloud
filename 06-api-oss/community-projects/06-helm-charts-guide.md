---
title: "apioss-helm Charts"
sidebar_position: 6
description: "Community-maintained Helm charts for API-OSS."
tags: [community-projects]
---

# apioss-helm Charts

## Overview

Community-maintained Helm charts for API-OSS.

## Installation

```bash
helm repo add apioss-community https://charts.api-oss.local
helm repo update

helm install apioss apioss-community/apioss \
  --namespace apioss \
  --create-namespace \
  --values values.yml
```

## Values

```yaml
replicaCount: 3
image:
  repository: api-oss
  tag: latest
gateway:
  port: 8080
  adminPort: 9090
postgresql:
  enabled: true
redis:
  enabled: true
ingress:
  enabled: true
  hosts:
    - host: api.example.com
```

## Features

```yaml
- Configurable replicas
- PostgreSQL and Redis subcharts
- Ingress with TLS
- HPA configuration
- PDB configuration
- ServiceMonitor for Prometheus
```

## Next

- [Community Projects Index](10-community-projects-index.md)

## See Also

Related community projects and development documentation.

- [Community Projects](../community-projects/01-community-projects-overview.md)
- [Community Overview](../community/01-building-community.md)
- [Contributing Guide](../contributing/01-contributing-overview.md)
- [Plugin Development](../plugins/01-plugins-overview.md)
