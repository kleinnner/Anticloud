---
title: "Data Flow Diagram — API-OSS"
sidebar_position: 99
description: "┌──────────────────────────────────────────────────────────────────┐"
tags: [compliance]
---

# Data Flow Diagram — API-OSS

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER MACHINE                             │
│                                                                   │
│  ┌──────────┐    WebSocket     ┌────────────────────────────┐    │
│  │  Browser  │◄──────────────►│      Gateway (Rust)         │    │
│  │  (PWA)    │   localhost:3030│                              │    │
│  └──────────┘                 │  ┌────────────────────────┐  │    │
│       │                       │  │  Knowledge Graph       │  │    │
│       │  HTTP                 │  │  (SQLite, WAL mode)    │  │    │
│       │  localhost:8080       │  │  - nodes               │  │    │
│       ▼                       │  │  - edges               │  │    │
│  ┌──────────┐                 │  │  - embeddings           │  │    │
│  │  VS Code │                 │  │  - FTS5 index          │  │    │
│  │  Ext.    │                 │  └────────────────────────┘  │    │
│  └──────────┘                 │  ┌────────────────────────┐  │    │
│       │                       │  │  Audit Ledger           │  │    │
│  ┌──────────┐                 │  │  (.aioss files)         │  │    │
│  │  CLI     │                 │  │  - SHA-256 chain        │  │    │
│  │  (49 cmd)│                 │  │  - GDPR section         │  │    │
│  └──────────┘                 │  └────────────────────────┘  │    │
│                               │  ┌────────────────────────┐  │    │
│  ┌──────────────┐             │  │  LLM Subprocess         │  │    │
│  │  External    │             │  │  (llama.cpp)            │  │    │
│  │  API Clients │◄──────HTTP──┤  │  - Model inference      │  │    │
│  │  (OpenAI     │   :8080     │  │  - Embeddings           │  │    │
│  │   Compatible)│             │  └────────────────────────┘  │    │
│  └──────────────┘             └────────────────────────────┘  │    │
│                                                                   │
│  NO DATA LEAVES THIS MACHINE (unless user configures SIEM)       │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow for Key Operations

### Chat Message
```
User → Browser → WebSocket → Gateway
  → LLM Subprocess (local)
  → Response streamed back via WebSocket
  → Logged to Audit Ledger
  → Stored in Knowledge Graph
```

### Document Ingestion
```
User → Browser → POST /api/ingest → Gateway
  → File saved to data/documents/
  → Text extracted (PDF/DOCX/XLSX/CSV/etc.)
  → Content chunked and embedded
  → Stored in Knowledge Graph
  → SHA-256 hash logged to Audit Ledger
```

### Council Decision
```
User → WebSocket → Gateway
  → Multi-agent LLM deliberation (3+ agents)
  → Weighted voting
  → Decision logged to Audit Ledger
  → Decision edge added to Knowledge Graph
```

## Data at Rest

| Data | Location | Encryption |
|------|----------|------------|
| Knowledge Graph | `data/graph.db` | SQLite file (WAL mode) |
| Audit Ledger | `data/ledger/*.aioss` | SHA-256 hash chain |
| Model Files | `data/models/*.gguf` | File system |
| Configuration | `opencode.json` | JSON (optional encryption) |
| User Tokens | `data/auth_tokens.json` | Obfuscated |

## Data in Transit

| Channel | Protocol | Encryption |
|---------|----------|------------|
| Browser ↔ Gateway | WebSocket (ws://) | TLS 1.3 (optional) |
| HTTP API | HTTP/1.1 | TLS 1.3 (optional) |
| LLM Subprocess | localhost TCP | None (loopback only) |

## SIEM Integration (Optional)

If configured, the gateway can push audit events to:
- Splunk HEC (`https://splunk-instance:8088/services/collector`)
- Datadog Logs API (`https://http-intake.logs.datadoghq.com/v1/input`)

This is the ONLY outbound data flow and is disabled by default.

## See Also

Related compliance, security, and legal documentation.

- [Compliance Overview](../compliance/01-compliance-overview.md)
- [Security Overview](../security/01-security-overview.md)
- [Legal Documents](../legal/01-terms-of-service.md)
- [Audit Ledger](../whitepapers/07-audit-ledger-integrity.md)

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
