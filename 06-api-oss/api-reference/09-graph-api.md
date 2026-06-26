---
title: "API Reference 09: Graph API"
sidebar_position: 9
description: "The Graph API provides CRUD operations on the knowledge graph via both REST and WebSocket."
tags: [api]
---

# API Reference 09: Graph API

## Overview

The Graph API provides CRUD operations on the knowledge graph via both REST and WebSocket.

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/graph/search` | Search nodes and edges |
| GET | `/v1/graph/nodes/{id}` | Get node by ID |
| POST | `/v1/graph/nodes` | Create node |
| PUT | `/v1/graph/nodes/{id}` | Update node |
| DELETE | `/v1/graph/nodes/{id}` | Delete node |
| GET | `/v1/graph/nodes/{id}/neighbors` | Get node neighbors |
| POST | `/v1/graph/edges` | Create edge |
| DELETE | `/v1/graph/edges/{id}` | Delete edge |
| GET | `/v1/graph/stats` | Graph statistics |
| POST | `/v1/graph/export` | Export graph |

## Node Operations

### Search (REST)
```bash
curl http://localhost:8080/v1/graph/search \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -G -d "q=liability cap" \
  -d "node_type=Concept" \
  -d "limit=20" \
  -d "offset=0"
```

```json
{
  "data": [
    {
      "id": "uuid_clause_4",
      "node_type": "Concept",
      "label": "Clause 4 — Liability Cap",
      "content": "$5M liability cap in Master Service Agreement...",
      "stance": null,
      "sentiment": 0.0,
      "metadata": {
        "document_source": "Master_MSA_v4.pdf",
        "jurisdiction": "US (Delaware)"
      },
      "created_at": "2026-05-01T10:30:00Z",
      "relevance_score": 0.94
    }
  ],
  "total": 42,
  "page": 1,
  "page_size": 20
}
```

### Create Node
```bash
curl -X POST http://localhost:8080/v1/graph/nodes \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "node_type": "Concept",
    "label": "GDPR Article 17",
    "content": "Right to erasure ('right to be forgotten')...",
    "metadata": {
      "regulation": "GDPR",
      "article": 17,
      "jurisdiction": "EU"
    }
  }'
```

```json
{
  "id": "uuid_new_node",
  "node_type": "Concept",
  "label": "GDPR Article 17",
  "content": "Right to erasure ('right to be forgotten')...",
  "created_at": "2026-05-31T12:00:00Z"
}
```

### Node Types

| Type | Color | Description | Stance Supported |
|------|-------|-------------|-----------------|
| Entity | Yellow | People, companies, locations | Yes |
| Concept | Blue | Ideas, policies, regulations | No |
| Document | Green | PDFs, DOCX, memos | No |
| Agent | Purple | AI agent personas | Yes |
| Decision | Orange | Conclusions, votes | No |
| Evidence | Gray | Supporting data points | No |
| Contradiction | Red | Detected conflicts | No |
| Tool | Teal | Tool definitions | No |
| Query | Cyan | Saved queries | No |

### Get Neighbors
```bash
curl "http://localhost:8080/v1/graph/nodes/uuid_sarah/neighbors?depth=2&limit=50" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "nodes": [...],
  "edges": [...],
  "depth": 2
}
```

## Edge Operations

### Edge Types

| Type | Direction | Description | Weight Default |
|------|-----------|-------------|----------------|
| SUPPORTS | Directed | Confirms, aligns with | 0.7 |
| CONTRADICTS | Undirected | Conflicts with | 1.0 |
| MAYBE_CONTRADICTS | Undirected | Potential conflict | 0.5 |
| REFERENCES | Directed | Cites, links to | 1.0 |
| BELONGSTO | Directed | Is part of | 1.0 |
| ESCALATESTO | Directed | Escalates to | 0.8 |
| RESPONDSTO | Directed | Answers, addresses | 0.8 |
| PRECEDES | Directed | Happens before | 1.0 |
| DEFINED_IN | Directed | Defined in document | 1.0 |
| MENTIONS | Undirected | Mentions in content | 0.5 |
| OWNS | Directed | Owns, manages | 0.9 |
| COLLABORATES | Undirected | Works together | 0.6 |

### Create Edge
```bash
curl -X POST http://localhost:8080/v1/graph/edges \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "source_id": "uuid_new_node",
    "target_id": "uuid_insurance_policy",
    "edge_type": "REFERENCES",
    "weight": 1.0,
    "metadata": {
      "context": "GDPR compliance review"
    }
  }'
```

```json
{
  "id": "uuid_new_edge",
  "source_id": "uuid_new_node",
  "target_id": "uuid_insurance_policy",
  "edge_type": "REFERENCES",
  "weight": 1.0,
  "created_at": "2026-05-31T12:00:00Z"
}
```

## Graph Statistics

```bash
curl http://localhost:8080/v1/graph/stats \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "total_nodes": 1420,
  "total_edges": 3847,
  "node_types": {
    "Entity": 234,
    "Concept": 456,
    "Document": 89,
    "Agent": 12,
    "Decision": 78,
    "Evidence": 512,
    "Contradiction": 39
  },
  "edge_types": {
    "SUPPORTS": 1024,
    "CONTRADICTS": 89,
    "REFERENCES": 1534,
    "BELONGSTO": 456,
    "OTHER": 744
  },
  "connected_components": 12,
  "density": 0.0019,
  "central_nodes": [
    {"id": "uuid_policy", "label": "Insurance Policy", "degree": 89},
    {"id": "uuid_clause_4", "label": "Clause 4", "degree": 67}
  ]
}
```

## Graph Export

```bash
curl -X POST http://localhost:8080/v1/graph/export \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"format": "graphml", "codex_id": "project-alpha"}'
```

Supported formats: `json`, `graphml`, `csv` (nodes + edges), `dot` (Graphviz)

## Embeddings

### Get Node Embedding
```bash
curl "http://localhost:8080/v1/graph/nodes/uuid_001/embedding" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "node_id": "uuid_001",
  "model": "all-MiniLM-L6-v2",
  "dimensions": 384,
  "embedding": [0.012, -0.034, 0.089, ...]
}
```

## WebSocket Graph Messages

| Type | Direction | Description |
|------|-----------|-------------|
| `graph.search` | Client → Server | Search query |
| `graph.search_result` | Server → Client | Search results |
| `graph.node_get` | Client → Server | Get node |
| `graph.node` | Server → Client | Node data |
| `graph.node_create` | Client → Server | Create node |
| `graph.node_created` | Server → Client | Node created |
| `graph.node_updated` | Server → Client | Node updated |
| `graph.node_deleted` | Server → Client | Node deleted |
| `graph.edge_create` | Client → Server | Create edge |
| `graph.edge_created` | Server → Client | Edge created |
| `graph.edge_deleted` | Server → Client | Edge deleted |
| `graph.neighbors` | Client → Server | Get neighbors |
| `graph.neighbors_result` | Server → Client | Neighbors data |
| `graph.mutation` | Server → Client | Graph changed (push) |

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ