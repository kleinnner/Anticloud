<!-- SEO -->
<meta name="description" content="MFSO — Multi-Factor Sovereign Sign-On identity vault with Shamir secret sharing, BIP39 entropy analysis, Ed25519 vs ECDSA comparative analysis, hardware-backed key storage.">
<meta name="keywords" content="MFSO, search oracle, sovereign search, encrypted search, identity vault">

![Status](https://img.shields.io/badge/status-experimental-ff3b30?style=for-the-badge)
![Category](https://img.shields.io/badge/category-Storage-ff3b30?style=for-the-badge)
![Language](https://img.shields.io/badge/language-Rust-f74c00?style=for-the-badge)

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

## Key Features

- **Shamir Secret Sharing**: Split keys across multiple factors
- **BIP39 Entropy Analysis**: Mnemonic seed generation and validation
- **Ed25519 vs ECDSA**: Comparative signing analysis
- **Hardware-Backed Keys**: TPM and secure element integration
- **MFA Auth Gateway**: Multi-factor authentication pipeline
- **Identity Vault**: Sovereign self-custody of digital identity

---

> 📖 **Full docs**: [Docusaurus MFSO](https://kleinnner.github.io/Anticloud/docs/projects/mfso) · [Home](Home) · [Projects](Projects) · [Architecture](Architecture)
