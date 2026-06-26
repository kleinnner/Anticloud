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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com