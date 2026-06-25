---
title: "Tutorial 01: Hello World"
sidebar_position: 1
description: "Deploy API-OSS and make your first API call."
tags: [tutorials]
---

# Tutorial 01: Hello World

## Objective

Deploy API-OSS and make your first API call.

## Prerequisites

- Docker installed (or download the binary)
- Terminal access

## Step 1: Start API-OSS

```bash
docker run -d --name apioss -p 8080:8080 api-oss:latest

# Wait for it to start
sleep 5
docker logs apioss
```

You should see: `Server started on port 8080`

## Step 2: Check Health

```bash
curl http://localhost:8080/health
```

Response:
```json
{"status":"healthy","version":"2.2.0","uptime":5}
```

## Step 3: Create Your First Route

```bash
# Create a route that proxies to httpbin
curl -X POST http://localhost:8080/api/v1/routes \
  -H "X-Admin-Key: admin" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/v1/hello",
    "upstream": "https://httpbin.org/anything",
    "methods": ["GET"]
  }'
```

## Step 4: Call Your Route

```bash
curl http://localhost:8080/v1/hello
```

You should get a JSON response back from httpbin.

## Step 5: View Route Stats

```bash
curl http://localhost:8080/api/v1/stats?period=1h \
  -H "X-Admin-Key: admin"
```

## What You Learned

- Starting API-OSS
- Health check
- Creating a route
- Making an API call
- Viewing basic stats

## Next Tutorial

→ [02: Chat with an LLM](02-chat-with-llm.md)

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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
