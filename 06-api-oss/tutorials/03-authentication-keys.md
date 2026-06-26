---
title: "Tutorial 03: Authentication & API Keys"
sidebar_position: 3
description: "Secure your API with authentication, API keys, and rate limiting."
tags: [tutorials]
---

# Tutorial 03: Authentication & API Keys

## Objective

Secure your API with authentication, API keys, and rate limiting.

## Prerequisites

- API-OSS running
- Tutorial 01-02 completed (or routes configured)

## Step 1: Change Admin Password

```bash
curl -X POST http://localhost:8080/api/v1/auth/password \
  -H "X-Admin-Key: admin" \
  -H "Content-Type: application/json" \
  -d '{
    "current": "admin",
    "new": "Your$trongP@ssw0rd!"
  }'
```

## Step 2: Create an API Key

```bash
curl -X POST http://localhost:8080/api/v1/keys \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App Key",
    "type": "standard"
  }'
```

Save the returned key — it's shown only once:
```json
{
  "id": "key_abc123",
  "name": "My App Key",
  "key": "api_std_a1b2c3d4e5f6..."
}
```

## Step 3: Require Authentication on a Route

```bash
curl -X PUT http://localhost:8080/api/v1/routes/route-abc \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "auth_required": true
  }'
```

## Step 4: Call with Authentication

```bash
# Without key — should fail
curl http://localhost:8080/v1/hello
# 401 Unauthorized

# With key — should work
curl http://localhost:8080/v1/hello \
  -H "Authorization: Bearer ak_a1b2c3d4e5f6..."
# 200 OK
```

## Step 5: Add Rate Limiting

```bash
curl -X PUT http://localhost:8080/api/v1/routes/route-abc \
  -H "X-Admin-Key: Your$trongP@ssw0rd!" \
  -H "Content-Type: application/json" \
  -d '{
    "rate_limit": 5,
    "rate_limit_window": 60
  }'
```

Now you can only call this route 5 times per minute.

## Step 6: Test Rate Limits

```bash
# Rapid requests
for i in {1..10}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    http://localhost:8080/v1/hello \
    -H "Authorization: Bearer ak_a1b2c3d4e5f6..."
done
```

After 5 requests, you'll see `429 Too Many Requests`.

## What You Learned

- Changing admin password
- Creating API keys
- Requiring authentication
- Rate limiting routes

## Next Tutorial

→ [04: Add a Plugin](04-add-plugin.md)

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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
