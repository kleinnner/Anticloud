---
title: "API Reference 19: Pagination"
sidebar_position: 19
description: "All list endpoints support cursor-based and offset-based pagination."
tags: [api]
---

# API Reference 19: Pagination

## Standard Pagination

All list endpoints support cursor-based and offset-based pagination.

### Offset Pagination

```bash
curl "http://localhost:8080/v1/graph/search?q=liability&limit=20&offset=40" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "data": [...],
  "total": 142,
  "page": 3,
  "page_size": 20,
  "has_more": true,
  "next_offset": 60
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | int | 20 | Results per page (max 100) |
| `offset` | int | 0 | Number of results to skip |

### Cursor Pagination (Recommended)

For high-performance pagination on large datasets:

```bash
curl "http://localhost:8080/v1/ledger?cursor=abc123&limit=20" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "data": [...],
  "cursor": "def456",
  "has_more": true,
  "total_estimate": 8230,
  "page_size": 20
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | int | 20 | Results per page |
| `cursor` | string | — | Opaque cursor from previous response |
| `direction` | string | `forward` | `forward` or `backward` |

To paginate forward:
```python
cursor = None
while True:
    response = client.get(f"/v1/ledger?cursor={cursor}&limit=20")
    for item in response.json()["data"]:
        process(item)
    cursor = response.json().get("cursor")
    if not cursor or not response.json()["has_more"]:
        break
```

## Sorting

```bash
# Sort by field
curl "http://localhost:8080/v1/models?sort=created&order=desc"

# Sort by multiple fields
curl "http://localhost:8080/v1/graph/search?sort=-created_at,+label"
# - = descending, + or blank = ascending
```

## Filtering

```bash
# Simple equality filter
curl "http://localhost:8080/v1/graph/search?node_type=Concept"

# Range filters
curl "http://localhost:8080/v1/ledger?created_after=2026-05-01&created_before=2026-05-31"

# Multiple values
curl "http://localhost:8080/v1/graph/search?node_type=Concept,Entity,Document"

# Metadata filters (JSON path)
curl "http://localhost:8080/v1/graph/search?metadata.jurisdiction=EU"
```

## Response Structure

All paginated endpoints return:

```json
{
  "data": [...],
  "total": 142,
  "page": 1,
  "page_size": 20,
  "has_more": true,
  "next_offset": 20,
  "previous_offset": 0,
  "first_page_url": "...",
  "next_page_url": "...",
  "previous_page_url": null,
  "sort": "-created_at",
  "query_time_ms": 45
}
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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ