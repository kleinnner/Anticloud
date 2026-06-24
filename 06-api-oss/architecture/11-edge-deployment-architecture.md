---
title: "Edge Deployment Architecture"
sidebar_position: 11
description: "Architecture for deploying API-OSS at the edge."
tags: [architecture]
---

# Edge Deployment Architecture

## Overview

Architecture for deploying API-OSS at the edge.

## Edge Topology

```mermaid
graph TB
    subgraph "Cloud Region"
        CENTRAL["Central API-OSS Cluster<br/>Full Gateway + DB + Redis"]
    end

    subgraph "Edge Locations"
        E1["Edge Node 1<br/>(Lite)"]
        E2["Edge Node 2<br/>(Lite)"]
        E3["Edge Node 3<br/>(Lite)"]
    end

    CENTRAL <--> E1
    CENTRAL <--> E2
    CENTRAL <--> E3
```
```

## Edge Node Specs

```yaml
edge_node:
  cpu: 2 cores
  memory: 2 GB
  storage: 10 GB
  network: 100 Mbps
  capabilities:
    - request_routing
    - caching
    - offline_queue
    - local_auth
```

## Offline Mode

```yaml
offline:
  enabled: true
  cache:
    strategy: lru
    capacity: 1000
  queue:
    max_size: 10000
    retry_interval: 30s
    max_retries: 10
  sync:
    interval: 60s
    batch_size: 100
```

## Next

- [DR Architecture](12-disaster-recovery-architecture.md)

## See Also

Related architecture, deployment, and operations documentation.

- [Deployment Guide](../deployment/01-overview.md)
- [Security Overview](../security/01-security-overview.md)
- [Operations Guide](../operations/01-operations-overview.md)
- [Self-Hosting Guide](../self-hosting/01-overview.md)
