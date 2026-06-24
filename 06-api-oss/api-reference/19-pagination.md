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
