---
title: "API Reference 13: Ledger API"
sidebar_position: 13
description: 'curl "http://localhost:8080/v1/ledger?limit=20&offset=0" \'
tags: [api]
---

# API Reference 13: Ledger API

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/ledger` | List ledger sessions |
| GET | `/v1/ledger/{session_id}` | Get ledger entries |
| GET | `/v1/ledger/{session_id}/verify` | Verify hash chain integrity |
| GET | `/v1/ledger/search` | Search ledger entries |
| GET | `/v1/ledger/stats` | Ledger statistics |
| POST | `/v1/ledger/export` | Export ledger data |

## List Sessions

```bash
curl "http://localhost:8080/v1/ledger?limit=20&offset=0" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "data": [
    {
      "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "created_at": "2026-05-31T10:00:00Z",
      "completed_at": "2026-05-31T11:30:00Z",
      "status": "completed",
      "session_type": "interactive",
      "entry_count": 142,
      "model": "qwen2.5-7b-q4",
      "codex_id": "project-alpha",
      "head_hash": "e3b0c44298fc1c149afbf4c8996fb924",
      "verified": true
    }
  ],
  "total": 45,
  "page": 1,
  "page_size": 20
}
```

## Get Session Entries

```bash
curl "http://localhost:8080/v1/ledger/a1b2c3d4?limit=10&offset=0" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "entries": [
    {
      "index": 0,
      "timestamp": "2026-05-31T10:00:01.000Z",
      "type": "user_message",
      "actor": "user",
      "actor_label": "Lois K.",
      "content": {
        "text": "Ingest the Q2 insurance contract"
      },
      "hash": "abc111...",
      "parent_hash": "00000000000000000000000000000000"
    },
    {
      "index": 1,
      "timestamp": "2026-05-31T10:00:05.000Z",
      "type": "tool_call",
      "actor": "ai",
      "content": {
        "tool": "ingest_document",
        "arguments": {"path": "./contracts/Q2_insurance.pdf"},
        "result": {"success": true, "nodes_created": 47}
      },
      "hash": "abc222...",
      "parent_hash": "abc111..."
    }
  ],
  "total_entries": 142,
  "page": 1,
  "page_size": 10
}
```

## Verify Hash Chain

```bash
curl "http://localhost:8080/v1/ledger/a1b2c3d4/verify" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "verified": true,
  "entries_checked": 142,
  "chain_integrity": true,
  "genesis_match": true,
  "head_match": true,
  "last_verified": "2026-05-31T12:00:00Z"
}
```

On failure:
```json
{
  "verified": false,
  "error": "Hash mismatch at entry 73",
  "expected_hash": "abc123...",
  "computed_hash": "def456...",
  "tampered_entries": [73, 72],
  "recommended_action": "Restore from backup. Ledger has been tampered with."
}
```

## Search Ledger

```bash
curl -X POST http://localhost:8080/v1/ledger/search \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "liability cap",
    "entry_types": ["user_message", "ai_message"],
    "actors": ["user"],
    "date_from": "2026-05-01T00:00:00Z",
    "date_to": "2026-05-31T23:59:59Z",
    "codex_id": "project-alpha",
    "limit": 50
  }'
```

## Ledger Statistics

```bash
curl http://localhost:8080/v1/ledger/stats \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "total_sessions": 45,
  "total_entries": 8230,
  "storage_size_mb": 12.4,
  "earliest_session": "2026-04-01T00:00:00Z",
  "latest_session": "2026-05-31T11:30:00Z",
  "entry_types": {
    "user_message": 2340,
    "ai_message": 2100,
    "tool_call": 1890,
    "graph_mutation": 980,
    "contradiction": 120,
    "decision": 45,
    "heartbeat": 755
  },
  "verification_status": {
    "verified": 43,
    "failed": 0,
    "not_checked": 2
  }
}
```

## Export

```bash
curl -X POST http://localhost:8080/v1/ledger/export \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "json",
    "sessions": ["a1b2c3d4"],
    "date_from": "2026-05-01T00:00:00Z",
    "include_entries": true
  }'
```

Supported formats: `json`, `jsonl`, `csv`, `parquet`

## WebSocket Ledger Messages

| Type | Direction | Description |
|------|-----------|-------------|
| `ledger.tail` | Client → Server | Start/stop tailing |
| `ledger.entry` | Server → Client | New entry (push) |
| `ledger.get` | Client → Server | Get specific session |
| `ledger.session` | Server → Client | Session data |
| `ledger.verify` | Client → Server | Verify session |
| `ledger.verify_result` | Server → Client | Verification result |

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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