<!-- SEO -->
<meta name="description" content="Libern — P2P communication engine with CRDT convergence, Ed25519-signed hash chains, local AI summarization, 3D sandbox world, enterprise AI auditability.">
<meta name="keywords" content="libern, cryptographic library, Ed25519, SHA3, digital signatures, blockchain">



<!-- Breadcrumb: Home > Projects > Libern -->

![Status](https://img.shields.io/badge/status-stable-34c759?style=for-the-badge)
![Category](https://img.shields.io/badge/category-Crypto-1d1d1f?style=for-the-badge)
![Language](https://img.shields.io/badge/language-Rust-f74c00?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# Libern

P2P Communication Engine with CRDT convergence, Ed25519-signed hash chains, local AI summarization, 3D sandbox world, and enterprise AI auditability framework.

## Quick Facts

| Attribute | Value |
|-----------|-------|
| **Status** | ![Stable](https://img.shields.io/badge/-stable-34c759) |
| **Category** | Core Infrastructure |
| **Language** | Rust |
| **Source** | [`08-libern/`](https://github.com/kleinnner/Anticloud/tree/main/08-libern) |
| **Dependencies** | None (foundational library) |

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

## Relationship Graph

```mermaid
flowchart LR
    LIB[Libern] -->|Crypto| AIO[aioss-format]
    LIB -->|FFI| KAS[Kasteran]
    LIB -->|Signing| KAT[Kathon]
    LIB -->|Signing| KAM[Kamelot]
    LIB -->|Signing| API[API-OSS]
    LIB -->|Signing| INT[Inte11ect]
    LIB -->|Signing| MF[MFSO]
```

## Cryptographic Trait Hierarchy

```mermaid
classDiagram
    class Signer {
        +sign(data: &[u8]) -> Signature
    }
    class Verifier {
        +verify(data: &[u8], sig: &Signature) -> bool
    }
    class Hasher {
        +hash(data: &[u8]) -> Hash
        +hash_stream(reader: &mut Read) -> Hash
    }
    class KeyPair {
        +generate() -> KeyPair
        +from_seed(seed: &[u8]) -> KeyPair
        +public() -> PublicKey
    }
    class Ed25519 {
        +sign(data) -> Signature
        +verify(data, sig) -> bool
    }
    class SHA3 {
        +hash(data) -> Hash
        +hash_stream(reader) -> Hash
    }
    Ed25519 --|> Signer
    Ed25519 --|> Verifier
    Ed25519 --|> KeyPair
    SHA3 --|> Hasher
```

## Key Features

- **CRDT Convergence**: Conflict-free replicated data types for P2P
- **Ed25519 Signatures**: Message signing and verification
- **Hash Chains**: Tamper-evident message history
- **Local AI Summarization**: On-device conversation summarization
- **3D Sandbox World**: Immersive spatial communication
- **Enterprise Auditability**: Framework for AI interaction auditing

## Related Projects

| Project | Relationship | Protocol |
|---------|-------------|----------|
| [Kathon](Kathon) | Consumer — browser crypto signing | FFI |
| [Kamelot](Kamelot) | Consumer — cloud runtime signing | FFI |
| [aioss-format](aioss-format) | Consumer — ledger state proofs | FFI |

---

> 📖 **Full docs**: [Docusaurus Libern](https://kleinnner.github.io/Anticloud/docs/projects/libern) · [Home](Home) · [Projects](Projects) · [Architecture](Architecture) · [Ecosystem](Ecosystem) · [Roadmap](Roadmap) · [Glossary](Glossary) · [Protocol-Spec](Protocol-Spec)

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
