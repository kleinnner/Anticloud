---
sidebar_label: Kathon
description: Kathon cryptographic browser with vision-LLM ad blocking (94.3% precision), CRDT P2P sync, spatial workspace, anti-enshittification engine, and per-tab VPN. Architecture diagram included.
---

# Kathon

Cryptographic Browser with vision-LLM ad blocking, CRDT P2P sync, spatial workspace, anti-enshittification engine, per-tab VPN

## Architecture Flow

```mermaid
flowchart LR
    U[User] -->|HTTP Request| PR[Proxy Router]
    PR -->|Per-Tab| VPN[VPN Tunnel]
    PR -->|URL| VL[Vision-LLM<br/>Ad Classifier]
    VL -->|94.3% Precision| FB[Ad/Tracker Filter]
    FB -->|Clean Content| SW[Spatial Workspace]
    PR -->|Events| CS[CRDT P2P Sync]
    CS -->|Replicated State| P2P[Peer Nodes]
    SW -->|User Actions| AE[Anti-Enshittification<br/>Engine]
    AE -->|Verified| AF[.aioss Ledger]
```

## Documentation

View the full documentation for this project on GitHub:
- [Project README](https://github.com/kleinnner/Anticloud/blob/main/01-kathon/README.md)
- [Project Directory](https://github.com/kleinnner/Anticloud/tree/main/01-kathon)
