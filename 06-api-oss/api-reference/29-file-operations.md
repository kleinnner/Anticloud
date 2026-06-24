---
title: "API Reference 29: File Operations API"
sidebar_position: 29
description: "curl -X POST http://localhost:8080/v1/files/upload"
tags: [api]
---

# API Reference 29: File Operations API

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/files/upload` | Upload a file |
| GET | `/v1/files/{id}` | Get file metadata |
| GET | `/v1/files/{id}/download` | Download file |
| DELETE | `/v1/files/{id}` | Delete file |
| GET | `/v1/files` | List files |
| POST | `/v1/files/{id}/process` | Re-process file |

## Upload File

```bash
curl -X POST http://localhost:8080/v1/files/upload \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -F "file=@contract.pdf" \
  -F "purpose=assistants" \
  -F "metadata={\"department\":\"legal\",\"contract_id\":\"MSA-2026-001\"};type=application/json"
```

```json
{
  "id": "file_abc123",
  "filename": "contract.pdf",
  "purpose": "assistants",
  "size_bytes": 245760,
  "mime_type": "application/pdf",
  "status": "uploaded",
  "metadata": {
    "department": "legal",
    "contract_id": "MSA-2026-001"
  },
  "created_at": "2026-05-31T12:00:00Z"
}
```

## Download File

```bash
curl http://localhost:8080/v1/files/file_abc123/download \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -o contract.pdf
```

## List Files

```bash
curl "http://localhost:8080/v1/files?purpose=assistants&limit=20" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

## File Purposes

| Purpose | Retention | Max Size | Notes |
|---------|-----------|----------|-------|
| `assistants` | 30 days | 100MB | Files for AI context |
| `batch` | 7 days | 500MB | Batch processing inputs |
| `fine-tune` | 90 days | 1GB | Training data |
| `vision` | 24 hours | 20MB | Image analysis |
| `user-data` | Permanent | 50MB | User-uploaded content |

## File Limits

| Tier | Max Upload Size | Total Storage | Files Per Request |
|------|----------------|---------------|-------------------|
| Free | 10MB | 100MB | 1 |
| Pro | 50MB | 1GB | 5 |
| Business | 100MB | 10GB | 10 |
| Enterprise | 500MB | 100GB | 25 |

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)
