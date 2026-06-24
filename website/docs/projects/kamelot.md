---
sidebar_label: Kamelot
description: Kamelot semantic vector file system replacing directory trees with 1536-dim dense embedding search achieving 91% recall at rank 10, with BLAKE3 hash-chain integrity verification.
---

# Kamelot

Semantic Vector File System replacing directory trees with 1536-dim dense embedding search, BLAKE3 hash-chain integrity

## Architecture Flow

```mermaid
flowchart LR
    F[File] -->|Content| CH[Chunker]
    CH -->|Segments| EM[Embedding Model<br/>1536-dim]
    EM -->|Vectors| ID[Inverted Index]
    ID -->|Rank 10 Recall: 91%| Q[Query Engine]
    Q -->|Search| R[Results]
    F -->|Content| B3[BLAKE3 Hash]
    B3 -->|Hash Chain| HC[Integrity Chain]
    HC -->|Verify| AF[.aioss Ledger]
```

## Documentation

View the full documentation for this project on GitHub:
- [Project README](https://github.com/kleinnner/Anticloud/blob/main/02-kamelot/README.md)
- [Project Directory](https://github.com/kleinnner/Anticloud/tree/main/02-kamelot)
