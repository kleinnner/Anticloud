---
title: "Storage Architecture"
sidebar_position: 7
description: "This document describes the storage architecture of API-OSS, covering database schema design, vector storage, file storage, caching layers, and backup strategies."
tags: [architecture]
---

# Storage Architecture

## Overview

This document describes the storage architecture of API-OSS, covering database schema design, vector storage, file storage, caching layers, and backup strategies.

## Storage Components

```
┌──────────────────────────────────────────────────┐
│                    Storage Layer                   │
├────────────┬───────────┬───────────┬─────────────┤
│ PostgreSQL │   Redis   │  Object   │   Vector    │
│ (metadata, │ (cache,   │ Storage   │   Store     │
│  config,   │  session, │ (models,  │ (embeddings)│
│  audit)    │  rate)    │  files)   │             │
└────────────┴───────────┴───────────┴─────────────┘
```

## PostgreSQL Schema

### Core Tables

```sql
-- Projects / Workspaces
CREATE TABLE workspaces (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    org_id      UUID REFERENCES organizations(id),
    settings    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- API Routes
CREATE TABLE routes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id),
    path        TEXT NOT NULL,
    methods     TEXT[] NOT NULL,
    upstream    TEXT NOT NULL,
    config      JSONB DEFAULT '{}',
    enabled     BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- API Keys
CREATE TABLE api_keys (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    key_hash    TEXT NOT NULL,
    key_prefix  TEXT NOT NULL,
    type        TEXT NOT NULL,
    workspace_id UUID REFERENCES workspaces(id),
    permissions TEXT[],
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Audit Logs
CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp   TIMESTAMPTZ NOT NULL DEFAULT now(),
    actor_id    UUID,
    action      TEXT NOT NULL,
    resource    JSONB,
    changes     JSONB,
    result      TEXT,
    integrity   JSONB
);
```

### Indexing Strategy

```sql
-- High-cardinality: audit logs by timestamp
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);

-- Lookups by workspace
CREATE INDEX idx_routes_workspace ON routes(workspace_id);
CREATE INDEX idx_api_keys_workspace ON api_keys(workspace_id);

-- Full-text search on route paths
CREATE INDEX idx_routes_path_gin ON routes USING GIN(path gin_trgm_ops);
```

## Vector Storage

### Schema

```sql
CREATE TABLE embeddings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL,
    model_id    TEXT NOT NULL,
    vector      vector(1536) NOT NULL,
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_embeddings_vector ON embeddings
    USING ivfflat (vector vector_cosine_ops)
    WITH (lists = 100);
```

### Query Pattern

```sql
SELECT id, document_id, 1 - (vector <=> $1) AS similarity
FROM embeddings
WHERE model_id = $2
ORDER BY vector <=> $1
LIMIT $3;
```

## Object Storage Layout

```
/models/
  /gpt-4/
    weights.bin
    config.json
    tokenizer.json
  /claude-3/
    ...

/data/
  /workspace-abc/
    /exports/
    /logs/
    /backups/

/plugins/
  /org.example/
    rate-limiter-v2.1.0.tar.gz
```

## Caching Strategy

### Multi-Layer Cache

```
L1: In-Memory (per node, ~100MB)
  - Route configs
  - Plugin configs
  - Model metadata
  - TTL: 60s, Eviction: LRU

L2: Redis (shared cluster)
  - Rate limit counters
  - Session data
  - Response cache
  - TTL: configurable, Eviction: allkeys-lru

L3: CDN (edge)
  - Static responses
  - Model lists
  - Health check responses
```

## Backup Strategy

### Full Backup (Daily)

```
pg_dump -h localhost -U apioss_admin apioss | gzip > backup-$(date +%Y-%m-%d).sql.gz
```

### WAL Archiving (Continuous)

```bash
archive_command = 'cp %p /backups/wal/%f'
restore_command = 'cp /backups/wal/%f %p'
```

### Point-in-Time Recovery

```bash
pg_restore --target-time "2026-05-30 14:00:00 UTC" --dbname apioss backup-full.sql
```

### Retention Policy

| Backup Type | Retention | Storage |
|---|---|---|
| Hourly WAL | 7 days | Hot storage |
| Daily full | 30 days | Hot storage |
| Weekly full | 6 months | Cold storage |
| Monthly full | 1 year | Archive |
| Annual full | 7 years | Glacier/tape |

## Storage Sizing Example

| Workload | Routes | Users | Requests/Day | DB Size | Vector Size |
|---|---|---|---|---|---|
| Small | 50 | 10 | 100K | 5 GB | 10 GB |
| Medium | 200 | 100 | 1M | 50 GB | 100 GB |
| Large | 1000 | 1000 | 10M | 500 GB | 500 GB |
| Enterprise | 5000+ | 10000+ | 100M+ | 2 TB+ | 5 TB+ |

## Next Steps

- [06 Scaling Architecture](06-scaling-architecture.md)
- [08 Monitoring Architecture](08-monitoring-architecture.md)
- [Backup & Restore Procedures](../operations/07-backup-restore.md)

## See Also

Related architecture, deployment, and operations documentation.

- [Deployment Guide](../deployment/01-overview.md)
- [Security Overview](../security/01-security-overview.md)
- [Operations Guide](../operations/01-operations-overview.md)
- [Self-Hosting Guide](../self-hosting/01-overview.md)
