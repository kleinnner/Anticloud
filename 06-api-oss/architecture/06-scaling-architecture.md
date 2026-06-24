---
title: "Scaling Architecture"
sidebar_position: 6
description: "This document describes how API-OSS scales horizontally and vertically to handle increasing traffic, data volume, and geographic distribution."
tags: [architecture]
---

# Scaling Architecture

## Overview

This document describes how API-OSS scales horizontally and vertically to handle increasing traffic, data volume, and geographic distribution.

## Scaling Dimensions

```
Throughput (RPS)      Data Volume (Storage)    Geographic (Latency)
Add nodes             Scale DB / Shard         Add regions
```

## Horizontal Scaling (API Nodes)

All API-OSS gateway nodes are stateless. Session data, rate limit counters, and cached responses live in Redis. This allows adding or removing nodes at any time with zero downtime.

### Auto-Scaling Triggers

| Metric | Threshold | Duration | Action |
|---|---|---|---|
| CPU | > 70% | 5 min | Scale up |
| Memory | > 80% | 5 min | Scale up |
| Connections | > 80% of max | 5 min | Scale up |
| CPU | < 30% | 15 min | Scale down |
| RPS | < 50% capacity | 15 min | Scale down |

### Auto-Scaling Configuration

```yaml
deploy:
  autoscaling:
    metrics:
      - type: cpu
        target: 70
      - type: memory
        target: 80
      - type: custom
        name: rps_per_node
        target: 10000
    min_replicas: 3
    max_replicas: 20
    cooldown:
      scale_up: 60
      scale_down: 300
```

## Scaling the Database

### Read Replicas

```
Primary (writes) → Replica 1 (reads) → Replica 2 (reads)
```

- All writes go to primary
- Read replicas serve query/analytics traffic
- Replication lag: typically <100ms

### Connection Pooling

```
api-oss admin config set db.pool_size=25
api-oss admin config set db.pool_max_overflow=50
api-oss admin config set db.pool_timeout=30
```

### Connection Routing

```
All writes → primary
Analytics/reporting → replica
Cache-hot reads → replica (with staleness tolerance)
```

### Sharding

For very large datasets (>1TB):

```
Shard by: workspace_id or org_id
Algorithm: consistent hashing
Shard key: hash(workspace_id) % N
```

## Scaling Redis

### Redis Cluster

```
Master A (slaves) ─┐
Master B (slaves) ─┼── Client (smart)
Master C (slaves) ─┘
```

Hash slots: 16384 total, evenly split across masters.

### Redis Memory Sizing

| Use Case | Memory | Eviction Policy |
|---|---|---|
| Rate limit counters | 1-4 GB | volatile-ttl |
| Session data | 2-8 GB | allkeys-lru |
| Response cache | 4-16 GB | allkeys-lru |

## Scaling Upstream Connections

```
api-oss admin config set upstream.keepalive=100
api-oss admin config set upstream.keepalive_timeout=60000
api-oss admin config set upstream.max_connections=500
api-oss admin config set circuit_breaker.enabled=true
api-oss admin config set circuit_breaker.error_threshold=50
api-oss admin config set circuit_breaker.timeout=30000
```

## Geographic Scaling

```
User in EU  → Route to eu-west-1
User in US  → Route to us-east-1
User in APAC → Route to ap-southeast-1

Global Rate Limits: Redis CRDT (bounded staleness ~1s)
Global Config:      Git repo → CI/CD push to all regions
Global Audit:       Per-region storage → central SIEM
```

## Performance Targets

| Metric | Target | Threshold |
|---|---|---|
| Max RPS per node | 10,000 (4 vCPU) | > 12,000 |
| p99 latency | < 500ms | > 2s |
| Error rate | < 0.1% | > 1% |
| DB query time | < 10ms | > 100ms |
| Cache hit ratio | > 90% | < 80% |

## Next Steps

- [07 Storage Architecture](07-storage-architecture.md)
- [08 Monitoring Architecture](08-monitoring-architecture.md)
- [Deployment Guide](../deployment/01-deployment-overview.md)

## See Also

Related architecture, deployment, and operations documentation.

- [Deployment Guide](../deployment/01-overview.md)
- [Security Overview](../security/01-security-overview.md)
- [Operations Guide](../operations/01-operations-overview.md)
- [Self-Hosting Guide](../self-hosting/01-overview.md)
