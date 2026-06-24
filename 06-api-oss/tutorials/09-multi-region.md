---
title: "Tutorial 09: Multi-Region Setup"
sidebar_position: 9
description: "Deploy API-OSS across two regions with database replication and DNS failover."
tags: [tutorials]
---

# Tutorial 09: Multi-Region Setup

## Objective

Deploy API-OSS across two regions with database replication and DNS failover.

## Prerequisites

- Two cloud environments (or two servers)
- Docker installed on both
- A domain name

## Step 1: Deploy Primary (us-east)

```bash
# On primary server
docker run -d --name apioss-primary \
  -p 8080:8080 \
  -p 5432:5432 \
  -e APIOSS_ADMIN_PASSWORD=pass \
  -e APIOSS_DB_URL=postgres://apioss:pass@localhost:5432/apioss \
  -e APIOSS_REDIS_URL=redis://localhost:6379 \
  -e APIOSS_REGION=us-east-1 \
  -e APIOSS_IS_PRIMARY=true \
  api-oss:latest
```

## Step 2: Deploy Replica (eu-west)

```bash
# On replica server
docker run -d --name apioss-replica \
  -p 8080:8080 \
  -e APIOSS_ADMIN_PASSWORD=pass \
  -e APIOSS_DB_URL=postgres://apioss:pass@primary-ip:5432/apioss?sslmode=require \
  -e APIOSS_REDIS_URL=redis://localhost:6379 \
  -e APIOSS_REGION=eu-west-1 \
  -e APIOSS_IS_PRIMARY=false \
  api-oss:latest
```

## Step 3: Configure Database Replication

```sql
-- On primary
CREATE PUBLICATION apioss_pub FOR ALL TABLES;

-- On replica
CREATE SUBSCRIPTION apioss_sub
CONNECTION 'host=primary-ip port=5432 dbname=apioss user=apioss password=pass'
PUBLICATION apioss_pub;
```

## Step 4: Configure DNS

```
# Primary region
us-east.api.example.com A 203.0.113.10

# Replica region
eu-west.api.example.com A 203.0.113.20

# Geo-routing
api.example.com CNAME us-east.api.example.com (primary)
```

## Step 5: Configure Cross-Region Rate Limiting

```bash
# On both regions
apioss admin config set rate_limit.global=true
apioss admin config set rate_limit.global_sync_url=https://us-east.api.example.com/api/v1/sync/rate-limits
```

## Step 6: Test Failover

```bash
# Simulate primary failure
# Stop primary: docker stop apioss-primary

# DNS switches to replica
curl https://api.example.com/health

# Promote replica to primary
curl -X POST http://localhost:8080/api/v1/system/promote \
  -H "X-Admin-Key: pass"
```

## What You Learned

- Multi-region deployment
- Database replication
- DNS geo-routing
- Cross-region rate limiting
- Manual failover

## Next Tutorial

→ [10: CI/CD Pipeline](10-ci-cd-pipeline.md)

## See Also

Related tutorials, cookbooks, and API reference documentation.

- [User Manual](../user-manual/01-getting-started.md)
- [Code Cookbooks](../code-cookbooks/01-getting-started.md)
- [Developer Guides](../developer-guides/01-why-build-on-apioss.md)
- [API Reference](../api-reference/01-overview.md)
