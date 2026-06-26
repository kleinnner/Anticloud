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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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