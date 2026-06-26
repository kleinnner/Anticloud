---
title: "Tutorial 04: Add a Plugin"
sidebar_position: 4
description: "Install and configure a plugin to modify request/response behavior."
tags: [tutorials]
---

# Tutorial 04: Add a Plugin

## Objective

Install and configure a plugin to modify request/response behavior.

## Prerequisites

- API-OSS running
- Tutorial 01-03 completed

## Step 1: Browse Available Plugins

```bash
curl http://localhost:8080/api/v1/marketplace \
  -H "X-Admin-Key: Your$trongP@ssw0rd!"
```

Sample response:
```json
[
  {"name": "org.example/cors", "version": "1.0.0", "description": "CORS headers"},
  {"name": "org.example/logging", "version": "2.0.0", "description": "Enhanced logging"},
  {"name": "org.example/cache", "version": "1.5.0", "description": "Response caching"}
]
```

## Step 2: Install the Logging Plugin

```bash
curl -X POST http://localhost:8080/api/v1/plugins \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "org.example/logging",
    "version": "2.0.0"
  }'
```

## Step 3: Configure the Plugin

```bash
curl -X PUT http://localhost:8080/api/v1/plugins/org.example/logging/config \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "log_request_body": true,
    "log_response_body": true,
    "exclude_paths": ["/health"]
  }'
```

## Step 4: Attach Plugin to a Route

```bash
curl -X PUT http://localhost:8080/api/v1/routes/route-abc \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "plugins": ["org.example/logging"]
  }'
```

## Step 5: Test the Plugin

```bash
# Make a request
curl http://localhost:8080/v1/hello -H "Authorization: Bearer ak_..."

# View logs
docker logs apioss | grep "logging"
```

You'll see detailed request/response logs.

## Step 6: Disable the Plugin

```bash
curl -X POST http://localhost:8080/api/v1/plugins/org.example/logging/disable \
  -H "X-Admin-Key: Your$trongP@ssw0rd!"
```

## What You Learned

- Browsing the plugin marketplace
- Installing plugins
- Configuring plugins
- Attaching plugins to routes
- Enabling/disabling plugins

## Next Tutorial

→ [05: Connect a Database](05-connect-database.md)

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ