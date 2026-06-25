---
title: "API Reference 08: Message Types (WebSocket Protocol)"
sidebar_position: 8
description: "The WebSocket protocol defines 810 message types organized into categories. This reference covers the primary message types."
tags: [api]
---

# API Reference 08: Message Types (WebSocket Protocol)

## Overview

The WebSocket protocol defines 810 message types organized into categories. This reference covers the primary message types.

## Message Categories

| Category | Count | Prefix | Description |
|----------|-------|--------|-------------|
| Auth | 8 | `auth_` | Authentication and session management |
| Chat | 24 | `chat_` | Conversational messages |
| Prompt | 12 | `prompt_` | Query and prompt messages |
| Tool | 48 | `tool_` | Tool execution and results |
| Graph | 96 | `graph_` | Knowledge graph operations |
| Search | 32 | `search_` | Search and retrieval |
| Document | 64 | `doc_` | Document ingestion and management |
| Model | 16 | `model_` | Model management |
| Ledger | 24 | `ledger_` | Audit ledger operations |
| Config | 16 | `config_` | Configuration |
| Council | 48 | `council_` | Multi-agent council |
| Bridge | 64 | `bridge_` | Bridge operations |
| Plugin | 32 | `plugin_` | Plugin management |
| Annotation | 48 | `annot_` | Annotation operations |
| Monitoring | 32 | `monitor_` | Metrics and health |
| System | 48 | `sys_` | System operations |
| File | 32 | `file_` | File operations |
| Notification | 24 | `notify_` | Push notifications |
| Sync | 48 | `sync_` | P2P sync operations |
| Debug | 16 | `debug_` | Debug and diagnostics |
| Extensions | 48 | `ext_` | Custom/plugin extensions |
| Reserved | 30 | — | Future use |

## Core Chat Messages

### chat.send (Client → Server)
```json
{
  "type": "chat.send",
  "id": "msg_001",
  "payload": {
    "room_id": "default",
    "content": "Hello, AI!",
    "attachments": [],
    "context": {
      "codex_id": "project-alpha",
      "mode": "chat"
    }
  }
}
```

### chat.token (Server → Client)
```json
{
  "type": "chat.token",
  "id": "msg_001",
  "payload": {
    "content": "Hello",
    "index": 0
  }
}
```

### chat.done (Server → Client)
```json
{
  "type": "chat.done",
  "id": "msg_001",
  "payload": {
    "total_tokens": 42,
    "duration_ms": 1500,
    "finish_reason": "stop"
  }
}
```

### chat.error (Server → Client)
```json
{
  "type": "chat.error",
  "id": "msg_001",
  "payload": {
    "code": "model_unavailable",
    "message": "Model is currently loading"
  }
}
```

## Prompt Messages

### prompt.send (Client → Server)
```json
{
  "type": "prompt.send",
  "id": "req_001",
  "payload": {
    "text": "Analyze the liability implications",
    "mode": "council",
    "context": {
      "active_nodes": ["clause_4", "insurance_policy"],
      "codex_id": "proj_alpha"
    }
  }
}
```

### prompt.result (Server → Client)
```json
{
  "type": "prompt.result",
  "id": "req_001",
  "payload": {
    "response": "The liability cap of $5M...",
    "confidence": 0.94,
    "referenced_nodes": ["uuid_policy", "uuid_clause_4"],
    "council_votes": {
      "risk_analyst": { "vote": "keep", "confidence": 0.91 },
      "legal_analyst": { "vote": "keep", "confidence": 0.88 },
      "strategist": { "vote": "modify", "confidence": 0.62 }
    }
  }
}
```

## System Messages

### sys.status (Server → Client)
```json
{
  "type": "sys.status",
  "id": "sys_001",
  "payload": {
    "status": "healthy",
    "uptime_seconds": 86400,
    "model_loaded": "qwen2.5-7b-q4",
    "graph_nodes": 1420,
    "graph_edges": 3847,
    "memory_usage_mb": 4096,
    "active_sessions": 5
  }
}
```

### sys.error (Server → Client)
```json
{
  "type": "sys.error",
  "id": "sys_002",
  "payload": {
    "severity": "critical",
    "code": "disk_space_low",
    "message": "Disk space below 10% on /data partition"
  }
}
```

## Message IDs

All messages include an `id` field. Guidelines:
- Client-generated IDs: prefix with client identifier (`client_prefix_001`)
- Server-generated IDs: UUID v4
- Idempotency: Duplicate IDs within 5-second window are deduplicated

## Message Size Limits

| Direction | Max Size | Behavior |
|-----------|----------|----------|
| Client → Server | 10 MB | Truncated with warning |
| Server → Client | 50 MB | Chunked for large payloads |
| Token stream | Unlimited | Individual tokens limited to 64KB |

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
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
