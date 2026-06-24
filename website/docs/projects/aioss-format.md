---
sidebar_label: aioss-format
---

# aioss-format

Dual-Format Cryptographic Ledger with SHA3-256 hash chaining, Ed25519 state proofs, memory-mapped IO, SQLite event store, post-quantum migration support

## Ledger Architecture

```mermaid
flowchart LR
    E[Event] -->|SHA3-256| H[Hash Chain]
    H -->|Append| MM[Memory-Mapped IO]
    MM -->|Write| SQ[SQLite Event Store]
    H -->|Periodic| SP[State Proof]
    SP -->|Ed25519| SG[Signature]
    SG -->|Verify| V[Verifier]
    H -->|Migrate| PQ[Post-Quantum<br/>Migration]
```

## Documentation

View the full documentation for this project on GitHub:
- [Project README](https://github.com/kleinnner/Anticloud/blob/main/04-aioss-format/README.md)
- [Project Directory](https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format)
