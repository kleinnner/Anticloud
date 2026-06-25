---
title: "API Reference 25: pgwire Protocol (PostgreSQL Compatible)"
sidebar_position: 25
description: "AI-OSS exposes a PostgreSQL-compatible wire protocol endpoint, allowing any PostgreSQL client (psql, DBeaver, Tableau, etc.) to query the knowledge graph using SQL."
tags: [api]
---

# API Reference 25: pgwire Protocol (PostgreSQL Compatible)

## Overview

AI-OSS exposes a PostgreSQL-compatible wire protocol endpoint, allowing any PostgreSQL client (psql, DBeaver, Tableau, etc.) to query the knowledge graph using SQL.

## Connection

```bash
psql -h localhost -p 5432 -U admin -d aioss
# Password: (API key or pgwire password)
```

## Connection Configuration

```yaml
gateway:
  pgwire:
    enabled: true
    port: 5432
    require_ssl: true
    max_connections: 50
```

## Mapping

The pgwire endpoint maps graph data to virtual tables:

| Virtual Table | Description | Maps To |
|---------------|-------------|---------|
| `nodes` | All graph nodes | `graph.nodes` |
| `edges` | All graph edges | `graph.edges` |
| `documents` | All indexed documents | `documents` index |
| `models` | Available models | `models` registry |
| `contradictions` | Active contradictions | `graph.contradictions` |
| `decisions` | Council decisions | `ledger.decisions` |
| `stats` | System statistics | `monitoring.metrics` |

## Query Examples

### SQL

```sql
-- Find all Concept nodes about liability
SELECT id, label, content, metadata
FROM nodes
WHERE node_type = 'Concept'
  AND (label ILIKE '%liability%' OR content ILIKE '%liability%')
ORDER BY created_at DESC
LIMIT 10;

-- Find contradictions with high severity
SELECT c.id, c.summary, c.severity,
       n1.label as node_a, n2.label as node_b
FROM contradictions c
JOIN nodes n1 ON c.node_a_id = n1.id
JOIN nodes n2 ON c.node_b_id = n2.id
WHERE c.severity > 0.7
  AND c.resolved = false;

-- Count nodes by type
SELECT node_type, COUNT(*) as count
FROM nodes
GROUP BY node_type
ORDER BY count DESC;

-- Find all edges for a specific node
SELECT e.edge_type, e.weight,
       n_source.label as source,
       n_target.label as target
FROM edges e
JOIN nodes n_source ON e.source_id = n_source.id
JOIN nodes n_target ON e.target_id = n_target.id
WHERE n_source.id = 'uuid_clause_4' OR n_target.id = 'uuid_clause_4';

-- Full-text search
SELECT id, label, content, rank
FROM nodes
WHERE label MATCH 'liability cap'
ORDER BY rank DESC;

-- System stats
SELECT * FROM stats;
```

## Supported PostgreSQL Features

| Feature | Status |
|---------|--------|
| SELECT with WHERE | ✅ Full |
| JOIN (INNER, LEFT) | ✅ Full |
| ORDER BY, LIMIT, OFFSET | ✅ Full |
| LIKE / ILIKE | ✅ Full |
| Aggregates (COUNT, SUM, AVG) | ✅ Full |
| GROUP BY, HAVING | ✅ Full |
| Subqueries | ✅ Full |
| CTE (WITH) | ✅ Full |
| INSERT | ⚠️ Limited (graph.nodes only) |
| UPDATE | ❌ Read-only for now |
| DELETE | ❌ Read-only for now |
| Full-text search (MATCH) | ✅ Via FTS5 |
| JSON operators | ✅ Via json1 extension |
| SSL/TLS | ✅ |
| Prepared statements | ✅ |
| Transactions | ✅ Read-only transactions |

## Tool Integration

Connect BI tools directly:

```bash
# Tableau
Host: localhost
Port: 5432
Database: aioss
Username: admin
Password: sk-aioss-xxxxxxxxxxxx
SSL: required

# Python
import psycopg2
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    dbname="aioss",
    user="admin",
    password="sk-aioss-xxxxxxxxxxxx"
)
cur = conn.cursor()
cur.execute("SELECT node_type, COUNT(*) FROM nodes GROUP BY node_type")
```

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
