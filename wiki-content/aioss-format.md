<!-- SEO -->
<meta name="description" content="aioss-format — dual-format cryptographic ledger with SHA3-256 hash chaining, Ed25519 state proofs, memory-mapped IO, SQLite event store, post-quantum migration.">
<meta name="keywords" content="aioss format, cryptographic ledger, proof-of-usefulness, hash chain, SHA3-256, Ed25519">



<!-- Breadcrumb: Home > Projects > aioss-format -->

![Status](https://img.shields.io/badge/status-stable-34c759?style=for-the-badge)
![Category](https://img.shields.io/badge/category-Crypto-1d1d1f?style=for-the-badge)
![Language](https://img.shields.io/badge/language-JSON-8b5cf6?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# aioss-format

Dual-Format Cryptographic Ledger with SHA3-256 hash chaining, Ed25519 state proofs, memory-mapped IO, SQLite event store, and post-quantum migration support.

## Quick Facts

| Attribute | Value |
|-----------|-------|
| **Status** | ![Stable](https://img.shields.io/badge/-stable-34c759) |
| **Category** | Core Infrastructure |
| **Language** | JSON Schema |
| **Source** | [`04-aioss-format/`](https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format) |
| **Dependencies** | Libern (crypto primitives) |

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

## Relationship Graph

```mermaid
flowchart LR
    AIOS[aioss-format] -->|Crypto| LIB[Libern]
    AIOS -->|Used By| KAT[Kathon]
    AIOS -->|Used By| KAM[Kamelot]
    AIOS -->|Used By| API[API-OSS]
    AIOS -->|Used By| INT[Inte11ect]
    AIOS -->|Used By| SOV[Sovereign-OS]
    AIOS -->|Used By| MF[MFSO]
```

## Ledger Append Sequence

```mermaid
sequenceDiagram
    App->>Ledger: append(data)
    Ledger->>Hasher: SHA3-256(data)
    Hasher-->>Ledger: hash
    Ledger->>Signer: Ed25519(hash)
    Signer-->>Ledger: signature
    Ledger->>Chain: link(prev_hash, hash, signature)
    Chain-->>Ledger: entry_hash
    Ledger-->>App: ok(entry_hash)
```

## Key Features

- **SHA3-256 Hash Chain**: Tamper-evident event sequencing
- **Ed25519 State Proofs**: Cryptographic state attestations
- **Dual Format**: Binary + JSON representations
- **Memory-Mapped IO**: High-performance append-only writes
- **SQLite Event Store**: Embedded queryable event history
- **Post-Quantum Migration**: Future-proofing against quantum attacks

## Related Projects

| Project | Relationship | Protocol |
|---------|-------------|----------|
| [Libern](Libern) | Cryptographic dependency — provides Ed25519, SHA3-256 | FFI |
| [Kathon](Kathon) | Consumer — browser audit logging | File |
| [Sovereign-OS](Sovereign-OS) | OS integration — system-wide ledger daemon | IPC |

---

> 📖 **Full docs**: [Docusaurus aioss-format](https://kleinnner.github.io/Anticloud/docs/projects/aioss-format) · [Home](Home) · [Projects](Projects) · [Architecture](Architecture) · [Ecosystem](Ecosystem) · [Roadmap](Roadmap) · [Glossary](Glossary) · [Protocol-Spec](Protocol-Spec)
