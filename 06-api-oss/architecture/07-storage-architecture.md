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

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com