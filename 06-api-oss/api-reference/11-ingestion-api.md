---
title: "API Reference 11: Ingestion API"
sidebar_position: 11
description: "curl -X POST http://localhost:8080/v1/documents/ingest"
tags: [api]
---

# API Reference 11: Ingestion API

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/documents/ingest` | Ingest a file |
| POST | `/v1/documents/ingest/batch` | Batch ingest multiple files |
| GET | `/v1/documents` | List ingested documents |
| GET | `/v1/documents/{id}` | Get document details |
| DELETE | `/v1/documents/{id}` | Delete document and its nodes |
| POST | `/v1/documents/{id}/reingest` | Re-process document |
| POST | `/v1/documents/watch` | Watch directory for new files |

## Ingest a File

```bash
curl -X POST http://localhost:8080/v1/documents/ingest \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -F "file=@contract.pdf" \
  -F "codex_id=project-alpha" \
  -F "chunk_size=512" \
  -F "chunk_overlap=32"
```

```json
{
  "document_id": "doc_001",
  "filename": "contract.pdf",
  "status": "processing",
  "nodes_created": 0,
  "chunks": 0,
  "file_size_bytes": 245760,
  "estimated_time_seconds": 12
}
```

## Batch Ingest (URLs)

```bash
curl -X POST http://localhost:8080/v1/documents/ingest/batch \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://example.com/docs/contract1.pdf",
      "https://example.com/docs/contract2.pdf"
    ],
    "codex_id": "project-alpha",
    "recursive": false
  }'
```

## Supported File Types

| Extension | Type | Parser | Max Size |
|-----------|------|--------|----------|
| `.pdf` | PDF | pdf-extract | 100MB |
| `.docx` | Word | docx-rs | 50MB |
| `.txt` | Text | UTF-8 | 10MB |
| `.md` | Markdown | CommonMark | 10MB |
| `.html` | HTML | html2text | 10MB |
| `.json` | JSON | serde_json | 10MB |
| `.csv` | CSV | csv-rs | 50MB |
| `.xml` | XML | quick-xml | 10MB |
| `.eml` | Email | mailparse | 10MB |
| `.msg` | Outlook | msg-rs | 10MB |
| `.rtf` | Rich Text | rtf-parser | 10MB |
| `.ipynb` | Jupyter | json + markdown | 10MB |
| `.yaml` | YAML | serde_yaml | 10MB |
| `.toml` | TOML | toml-rs | 5MB |

## Ingest with Custom Chunking

```bash
curl -X POST http://localhost:8080/v1/documents/ingest \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -F "file=@research_paper.pdf" \
  -F 'config={
    "chunk_size": 1024,
    "chunk_overlap": 128,
    "chunk_method": "semantic",
    "extract_metadata": true,
    "generate_embeddings": true,
    "extract_entities": true,
    "extract_concepts": true,
    "extract_relationships": true,
    "codex_id": "research"
  };type=application/json'
```

## Document Status Webhook

Configure a webhook to be notified when ingestion completes:

```bash
curl -X PUT http://localhost:8080/v1/config \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "ingestion": {
      "webhook_url": "https://example.com/webhooks/ingestion",
      "webhook_events": ["complete", "error"]
    }
  }'
```

Webhook payload:
```json
{
  "event": "ingestion.complete",
  "document_id": "doc_001",
  "filename": "contract.pdf",
  "nodes_created": 47,
  "duration_ms": 12300,
  "status": "success"
}
```

## Watch Directory

```bash
curl -X POST http://localhost:8080/v1/documents/watch \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/data/inbox/",
    "recursive": true,
    "codex_id": "project-alpha",
    "auto_delete": true
  }'
```

## Ingest via WebSocket

```json
// Client → Server
{
  "type": "doc.ingest",
  "id": "ingest_001",
  "payload": {
    "filename": "contract.pdf",
    "content": "base64-encoded-content...",
    "codex_id": "project-alpha"
  }
}

// Server → Client (progress)
{
  "type": "doc.ingest_progress",
  "id": "ingest_001",
  "payload": {
    "status": "chunking",
    "progress": 0.4,
    "chunks_processed": 20,
    "total_chunks": 50
  }
}

// Server → Client (complete)
{
  "type": "doc.ingest_complete",
  "id": "ingest_001",
  "payload": {
    "document_id": "doc_001",
    "nodes_created": 47,
    "duration_ms": 12300
  }
}
```

## Error Codes

| Code | Meaning |
|------|---------|
| `unsupported_format` | File type not supported |
| `file_too_large` | Exceeds maximum file size |
| `parse_error` | Failed to parse file content |
| `embedding_failed` | Embedding generation failed |
| `duplicate_content` | Content already exists (dedup) |

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

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