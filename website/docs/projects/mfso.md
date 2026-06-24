---
sidebar_label: MF+SO
description: MF+SO Multi-Factor Sovereign Sign-On identity vault with Shamir secret sharing, BIP39 entropy analysis, Ed25519 vs ECDSA comparative analysis, and hardware-backed key storage.
keywords: [MFSO index, corpus search, sovereign search, encrypted search]
image: /img/anticloud-social.png
---

# MF+SO

Multi-Factor Sovereign Sign-On identity vault with Shamir secret sharing, BIP39 entropy analysis, Ed25519 vs ECDSA comparative analysis, hardware-backed keys

## Identity Flow

```mermaid
flowchart LR
    U[User] -->|MFA| AU[Auth Gateway]
    AU -->|Factor Split| SS[Shamir Secret<br/>Sharing]
    SS -->|Shares| HK[Hardware Keys]
    SS -->|Recover| MK[Master Key]
    MK -->|BIP39| BE[BIP39 Entropy<br/>Analysis]
    BE -->|Seed| SK[Signing Key]

    subgraph Signing
        SK -->|Ed25519| ED[Ed25519 Signature]
        SK -->|ECDSA| EC[ECDSA Signature]
    end

    ED -->|Compare| CA[Comparative<br/>Analysis]
    EC -->|Compare| CA
```

## Documentation

View the full documentation for this project on GitHub:
- [Project README](https://github.com/kleinnner/Anticloud/blob/main/07-mfso/README.md)
- [Project Directory](https://github.com/kleinnner/Anticloud/tree/main/07-mfso)
