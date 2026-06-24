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
