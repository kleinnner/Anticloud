<!-- SEO -->
<meta name="description" content="MFSO — Multi-Factor Sovereign Sign-On identity vault with Shamir secret sharing, BIP39 entropy analysis, Ed25519 vs ECDSA comparative analysis, hardware-backed key storage.">
<meta name="keywords" content="MFSO, search oracle, sovereign search, encrypted search, identity vault">



<!-- Breadcrumb: Home > Projects > MFSO -->

![Status](https://img.shields.io/badge/status-experimental-ff3b30?style=for-the-badge)
![Category](https://img.shields.io/badge/category-Storage-ff3b30?style=for-the-badge)
![Language](https://img.shields.io/badge/language-Rust-f74c00?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# MFSO

Multi-Factor Sovereign Sign-On identity vault with Shamir secret sharing, BIP39 entropy analysis, Ed25519 vs ECDSA comparative analysis, and hardware-backed key storage.

## Quick Facts

| Attribute | Value |
|-----------|-------|
| **Status** | ![Experimental](https://img.shields.io/badge/-experimental-ff3b30) |
| **Category** | Storage & Search |
| **Language** | Rust |
| **Source** | [`07-mfso/`](https://github.com/kleinnner/Anticloud/tree/main/07-mfso) |
| **Dependencies** | Kazcade, Libern |

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

## Relationship Graph

```mermaid
flowchart LR
    MF[MFSO] -->|Storage| KAZ[Kazcade]
    MF -->|Crypto| LIB[Libern]
    MF -->|Audit| AIO[aioss-format]
    MF -->|Search| KAM[Kamelot]
```

## Search Query Flow

```mermaid
sequenceDiagram
    Client->>Oracle: search(query)
    Oracle->>Factor1: analyze(credential)
    Oracle->>Factor2: analyze(biometric)
    Oracle->>Factor3: analyze(device)
    Factor1-->>Oracle: score_1
    Factor2-->>Oracle: score_2
    Factor3-->>Oracle: score_3
    Oracle->>Aggregator: fuse(scores)
    Aggregator-->>Oracle: confidence
    Oracle-->>Client: results(ranked)
```

## Key Features

- **Shamir Secret Sharing**: Split keys across multiple factors
- **BIP39 Entropy Analysis**: Mnemonic seed generation and validation
- **Ed25519 vs ECDSA**: Comparative signing analysis
- **Hardware-Backed Keys**: TPM and secure element integration
- **MFA Auth Gateway**: Multi-factor authentication pipeline
- **Identity Vault**: Sovereign self-custody of digital identity

## Related Projects

| Project | Relationship | Protocol |
|---------|-------------|----------|
| [Kazcade](Kazcade) | Storage backend — CRDT-synced vector state | P2P/CRDT |
| [Libern](Libern) | Cryptographic dependency — provides Ed25519, SHA3-256 | FFI |
| [Kamelot](Kamelot) | Search — cloud function orchestration | gRPC |

---

> 📖 **Full docs**: [Docusaurus MFSO](https://kleinnner.github.io/Anticloud/docs/projects/mfso) · [Home](Home) · [Projects](Projects) · [Architecture](Architecture) · [Ecosystem](Ecosystem) · [Roadmap](Roadmap) · [Glossary](Glossary) · [Protocol-Spec](Protocol-Spec)

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ