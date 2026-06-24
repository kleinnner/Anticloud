---
sidebar_label: libern
description: libern P2P communication engine with CRDT convergence, Ed25519-signed hash chains, local AI summarization, 3D sandbox world, and enterprise AI auditability framework.
---

# libern

P2P Communication Engine with CRDT convergence, Ed25519-signed hash chains, local AI summarization, 3D sandbox world, enterprise AI auditability framework

## P2P Message Flow

```mermaid
flowchart LR
    S[Sender] -->|Message| CR[CRDT Merge]
    CR -->|Converge| HC[Hash Chain<br/>Ed25519 Signed]
    HC -->|Broadcast| PN[P2P Network]
    PN -->|Receive| CR2[CRDT Merge]
    CR2 -->|Converged| R[Recipient]
    CR2 -->|Summarize| AI[Local AI<br/>Summarization]
    R -->|Events| SV[3D Sandbox<br/>World]
    HC -->|Audit| AF[.aioss Ledger]
```

## Documentation

View the full documentation for this project on GitHub:
- [Project README](https://github.com/kleinnner/Anticloud/blob/main/08-libern/README.md)
- [Project Directory](https://github.com/kleinnner/Anticloud/tree/main/08-libern)
