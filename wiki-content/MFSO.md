<!-- SEO -->
<meta name="description" content="MFSO — Multi-Factor Sovereign Sign-On identity vault with Shamir secret sharing, BIP39 entropy analysis, Ed25519 vs ECDSA comparative analysis, hardware-backed key storage.">
<meta name="keywords" content="MFSO, search oracle, sovereign search, encrypted search, identity vault">

<meta property="og:title" content="MFSO — Anticloud Wiki">
<meta property="og:description" content="MFSO — Multi-Factor Sovereign Sign-On identity vault with Shamir secret sharing, BIP39 entropy analysis, Ed25519 vs ECDSA comparative analysis, hardware-backed key storage.">
<meta property="og:image" content="https://kleinnner.github.io/Anticloud/img/og-image.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="MFSO">
<meta name="twitter:description" content="MFSO — Multi-Factor Sovereign Sign-On identity vault with Shamir secret sharing, BIP39 entropy analysis, Ed25519 vs ECDSA comparative analysis, hardware-backed key storage.">
<link rel="canonical" href="https://github.com/kleinnner/Anticloud/wiki/MFSO">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MFSO",
  "description": "MFSO — Multi-Factor Sovereign Sign-On identity vault with Shamir secret sharing, BIP39 entropy analysis, Ed25519 vs ECDSA comparative analysis, hardware-backed key storage.",
  "applicationCategory": "Storage",
  "operatingSystem": "Cross-platform",
  "programmingLanguage": "Rust",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
</script>

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
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
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
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart LR
    MF[MFSO] -->|Storage| KAZ[Kazcade]
    MF -->|Crypto| LIB[Libern]
    MF -->|Audit| AIO[aioss-format]
    MF -->|Search| KAM[Kamelot]
```

## Search Query Flow

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
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
