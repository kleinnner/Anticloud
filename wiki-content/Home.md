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
[![Harvard Dataverse](https://img.shields.io/badge/Data-Harvard%20Dataverse-8B4513?style=flat-square&logo=dataverse)](https://dataverse.harvard.edu/dataverse/anticloud)
[![Zenodo](https://img.shields.io/badge/Research-Zenodo-1682D4?style=flat-square&logo=zenodo)](https://zenodo.org/search?q=anticloud)
[![Hugging Face](https://img.shields.io/badge/Models-HuggingFace-FFD21E?style=flat-square&logo=huggingface)](https://huggingface.co/Anticloud)
[![Figshare](https://img.shields.io/badge/Data-Figshare-FF5722?style=flat-square&logo=figshare)](https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885)
[![Academia.edu](https://img.shields.io/badge/Research-Academia.edu-41454A?style=flat-square&logo=academia)](https://independent.academia.edu/kleinner)
[![Telepedia](https://img.shields.io/badge/Wiki-Telepedia-0071e3?style=flat-square)](https://anticloud.telepedia.net)
[![Fandom](https://img.shields.io/badge/Wiki-Fandom-005c99?style=flat-square&logo=fandom)](https://anticloud.fandom.com)

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com