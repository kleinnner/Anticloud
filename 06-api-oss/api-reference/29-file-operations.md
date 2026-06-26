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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com