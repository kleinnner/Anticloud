<!-- SEO -->
<meta name="description" content="Anticloud ecosystem wiki — 11 open-source projects building sovereign, privacy-first, cryptographically-verified technology. 40 developer tools across 4 domains.">
<meta name="keywords" content="anticloud, wiki, sovereign technology, cryptography, open source, kathon, kamelot, kasteran">



<!-- Breadcrumb: Home -->

![Anticloud](https://img.shields.io/badge/Anticloud-Sovereign%20Technology%20Research-1d1d1f?style=for-the-badge)
![Projects](https://img.shields.io/badge/Projects-13-0071e3?style=for-the-badge)
![Tools](https://img.shields.io/badge/Tools-40-34c759?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT%20%2F%20Apache%202.0-ff9f0a?style=for-the-badge)
![Languages](https://img.shields.io/badge/Languages-Rust%20%7C%20Go%20%7C%20TS%20%7C%20JSON-8b5cf6?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

---

# Anticloud Wiki

Welcome to the Anticloud ecosystem wiki — a unified knowledge base for **13 open-source projects** and **40 developer tools** building sovereign, privacy-first, cryptographically-verified technology.

## Ecosystem Overview

```mermaid
mindmap
  root((Anticloud))
    Browsers & Clients
      Kathon
      Anticode
    Cloud & AI
      Kamelot
      API-OSS
      Inte11ect
      Camus
    Languages & Storage
      Kasteran
      Kazcade
      MFSO
    Crypto & OS
      aioss-format
      Libern
      Sovereign-OS
    Philosophy
      DeltaaaS
```

## Project Status Legend

| Badge | Meaning |
|-------|---------|
| ![Stable](https://img.shields.io/badge/status-stable-34c759) | Production-ready |
| ![Beta](https://img.shields.io/badge/status-beta-0071e3) | Feature-complete, testing |
| ![Alpha](https://img.shields.io/badge/status-alpha-ff9f0a) | Active development |
| ![Experimental](https://img.shields.io/badge/status-experimental-ff3b30) | Research phase |

## Cryptographic Foundation

All Anticloud projects share a common cryptographic layer:

```mermaid
flowchart LR
    subgraph Foundation[Cryptographic Foundation]
        SHA3[SHA3-256<br/>Hashing]
        ED25519[Ed25519<br/>Signatures]
        AIOSS[.aioss<br/>Ledger Format]
    end
    subgraph Projects[Platform Projects]
        KATHON[Kathon]
        KASTERAN[Kasteran]
        KAZCADE[Kazcade]
        KAMELOT[Kamelot]
    end
    SHA3 --> KATHON & KASTERAN & KAZCADE & KAMELOT
    ED25519 --> KATHON & KASTERAN & KAZCADE & KAMELOT
    AIOSS --> KATHON & KAZCADE
```

## Quick Links

| Section | Description |
|---------|-------------|
| [Architecture](Architecture) | System architecture, cluster graphs, data flow |
| [Projects](Projects) | All 13 platform projects with status badges |
| [Kathon](Kathon) | Cryptographic browser with vision-LLM ad blocking |
| [Kamelot](Kamelot) | Cloud runtime & AI orchestration |
| [Kasteran](Kasteran) | Rune-based systems language |
| [Kazcade](Kazcade) | Vector file system |
| [API-OSS](API-OSS) | Sovereign API gateway |
| [Inte11ect](Inte11ect) | AI gateway & model router |
| [Camus](Camus) | Terminal-native vision-language AI shell |
| [ΔaaS](DeltaaaS) | Post-cloud superposition computing manifesto |
| [aioss-format](aioss-format) | Proof-of-usefulness ledger |
| [Libern](Libern) | Cryptographic library |
| [Anticode](Anticode) | AI-native IDE |
| [Sovereign-OS](Sovereign-OS) | Privacy-first OS |
| [MFSO](MFSO) | Multi-Factor Search Oracle |
| [Tools](Tools) | 40 developer tools across 4 domains |
| [Ecosystem](Ecosystem) | All platforms, profiles, and research repos |
| [Getting Started](Getting-Started) | Quick start guide and first steps |
| [Contributing](Contributing) | How to contribute to the ecosystem |
| [Roadmap](Roadmap) | Development timeline through 2027 |
| [FAQ](FAQ) | Frequently asked questions |
| [Glossary](Glossary) | Technical terms and definitions |
| [Security](Security) | Threat model and cryptographic guarantees |
| [Protocol Spec](Protocol-Spec) | Inter-project protocol specifications |
| [Performance](Performance) | Benchmarks and performance data |

## Stats

- **13** Platform Projects
- **40** Developer Tools
- **4** Domains: Security, Compliance, Analysis, Utilities
- **1** Cryptographic Foundation: SHA3-256 + Ed25519 + .aioss
- **6** External Platforms: GitHub, LinkedIn, DEV, Hugging Face, WordPress, Fandom

---

> 📖 **Full documentation**: [Docusaurus Portal](https://kleinnner.github.io/Anticloud/) · [GitHub Repository](https://github.com/kleinnner/Anticloud) · [Fandom Wiki](https://anticloud.fandom.com) · [Architecture](Architecture) · [Projects](Projects) · [Ecosystem](Ecosystem) · [Roadmap](Roadmap) · [Glossary](Glossary)
