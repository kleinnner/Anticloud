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
