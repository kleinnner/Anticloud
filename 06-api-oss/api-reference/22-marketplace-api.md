---
title: "API Reference 22: Marketplace API"
sidebar_position: 22
description: 'curl "http://localhost:8080/v1/marketplace/listings?category=tool&sort=popular&page=1" \'
tags: [api]
---

# API Reference 22: Marketplace API

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/marketplace/listings` | Browse marketplace |
| GET | `/v1/marketplace/listings/{id}` | Get listing details |
| GET | `/v1/marketplace/categories` | List categories |
| GET | `/v1/marketplace/search` | Search listings |
| POST | `/v1/marketplace/purchase` | Purchase/install listing |
| GET | `/v1/marketplace/purchases` | List purchased items |
| POST | `/v1/marketplace/publish` | Publish a new listing |
| PUT | `/v1/marketplace/listings/{id}` | Update listing |
| DELETE | `/v1/marketplace/listings/{id}` | Remove listing |
| POST | `/v1/marketplace/listings/{id}/review` | Submit review |

## Browse Marketplace

```bash
curl "http://localhost:8080/v1/marketplace/listings?category=tool&sort=popular&page=1" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "data": [
    {
      "id": "web-scraper",
      "name": "Web Scraper",
      "version": "1.2.0",
      "author": {
        "name": "AI-OSS Team",
        "verified": true
      },
      "type": "tool",
      "description": "Scrape and extract content from web pages",
      "price": {
        "amount": 0,
        "currency": "USD",
        "tier": "free"
      },
      "rating": 4.5,
      "review_count": 128,
      "install_count": 5230,
      "icon_url": "https://marketplace.api-oss.local/icons/web-scraper.png",
      "compatibility": ">=0.1.0",
      "updated_at": "2026-05-20T00:00:00Z"
    }
  ],
  "total": 234,
  "page": 1,
  "page_size": 20
}
```

## Listing Details

```bash
curl http://localhost:8080/v1/marketplace/listings/web-scraper \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "id": "web-scraper",
  "name": "Web Scraper",
  "version": "1.2.0",
  "author": {
    "name": "AI-OSS Team",
    "verified": true,
    "other_plugins": ["pdf-extractor", "csv-converter"]
  },
  "type": "tool",
  "description": "Scrape and extract content from web pages...",
  "long_description": "# Web Scraper\n\nThis plugin allows AI models to...\n\n## Features\n- Extract text from any URL\n- Handle JavaScript-rendered pages\n- Respect robots.txt\n- Configurable rate limiting",
  "screenshots": ["url1.png", "url2.png"],
  "price": {
    "amount": 0,
    "currency": "USD",
    "tier": "free"
  },
  "rating": 4.5,
  "review_count": 128,
  "install_count": 5230,
  "permissions": ["network:http"],
  "compatibility": ">=0.1.0",
  "size_kb": 256,
  "source_url": "https://github.com/ai-oss/plugin-web-scraper",
  "documentation_url": "https://docs.api-oss.local/plugins/web-scraper",
  "changelog": "## 1.2.0\n- Added JS rendering support\n- Fixed memory leak\n- Improved error handling",
  "created_at": "2026-01-15T00:00:00Z",
  "updated_at": "2026-05-20T00:00:00Z"
}
```

## Pricing Tiers

| Tier | Description | Platform Fee | Payout Schedule |
|------|-------------|-------------|-----------------|
| `free` | No cost | 0% | N/A |
| `one_time` | Single purchase | 30% | Net 30 |
| `subscription` | Monthly/annual | 30% | Net 30 |
| `usage_based` | Pay per call | 20% | Net 30 |

## Purchase/Install

```bash
curl -X POST http://localhost:8080/v1/marketplace/purchase \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "listing_id": "web-scraper",
    "version": "1.2.0"
  }'
```

```json
{
  "purchase_id": "purch_001",
  "listing_id": "web-scraper",
  "status": "installing",
  "plugin_id": "web-scraper",
  "progress": 0.5,
  "estimated_time_seconds": 5
}
```

## Publish to Marketplace

```bash
curl -X POST http://localhost:8080/v1/marketplace/publish \
  -H "Authorization: Bearer sk-aioss-admin-xxxxxxxxxxxx" \
  -F "manifest=@manifest.toml" \
  -F "plugin=@plugin.wasm" \
  -F "screenshot=@screenshot1.png" \
  -F "screenshot=@screenshot2.png" \
  -F "icon=@icon.png"
```

```json
{
  "listing_id": "my-plugin",
  "status": "pending_review",
  "estimated_review_time_hours": 24,
  "message": "Your plugin has been submitted for review. You will be notified when it's approved."
}
```

## Search Marketplace

```bash
curl "http://localhost:8080/v1/marketplace/search?q=web+scraper&category=tool&sort=rating&price=free&page=1" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

## Submit Review

```bash
curl -X POST http://localhost:8080/v1/marketplace/listings/web-scraper/review \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "title": "Excellent plugin",
    "body": "This plugin saved us hours of manual work. Highly recommended.",
    "version": "1.2.0"
  }'
```

## WebSocket Marketplace Messages

| Type | Direction | Description |
|------|-----------|-------------|
| `marketplace.browse` | Client → Server | Browse/query listings |
| `marketplace.result` | Server → Client | Browsing results |
| `marketplace.install_progress` | Server → Client | Installation progress |
| `marketplace.install_complete` | Server → Client | Installation done |
| `marketplace.install_error` | Server → Client | Installation failed |

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
