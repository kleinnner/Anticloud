<!-- SEO -->
<meta name="description" content="Anticloud platform projects — 11 open-source projects status, tech stacks, language distribution, and inter-project dependency graph.">
<meta name="keywords" content="anticloud projects, kathon, kamelot, kasteran, kazcade, api-oss, inte11ect, aioss-format, libern, anticode, sovereign-os, mfso">


<!-- Breadcrumb: Home > Projects -->

![Projects](https://img.shields.io/badge/Section-Projects-0071e3?style=for-the-badge)
![Total](https://img.shields.io/badge/Total-11%20Projects-34c759?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# Platform Projects

The Anticloud ecosystem includes 11 platform projects spanning browsers, cloud infrastructure, programming languages, storage systems, and operating systems.

## Project Domain Map

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart LR
    subgraph Browser[Browser & Client]
        KATHON[Kathon<br/>![Beta](https://img.shields.io/badge/-beta-0071e3)]
        ANTICODE[Anticode<br/>![Alpha](https://img.shields.io/badge/-alpha-ff9f0a)]
    end
    subgraph Cloud[Cloud & AI]
        KAMELOT[Kamelot<br/>![Alpha](https://img.shields.io/badge/-alpha-ff9f0a)]
        APIOSS[API-OSS<br/>![Stable](https://img.shields.io/badge/-stable-34c759)]
        INTE11ECT[Inte11ect<br/>![Alpha](https://img.shields.io/badge/-alpha-ff9f0a)]
    end
    subgraph Storage[Storage & Search]
        KAZCADE[Kazcade<br/>![Experimental](https://img.shields.io/badge/-experimental-ff3b30)]
        MFSO[MFSO<br/>![Experimental](https://img.shields.io/badge/-experimental-ff3b30)]
    end
    subgraph Core[Core Infrastructure]
        KASTERAN[Kasteran<br/>![Alpha](https://img.shields.io/badge/-alpha-ff9f0a)]
        SOVEREIGNOS[Sovereign-OS<br/>![Experimental](https://img.shields.io/badge/-experimental-ff3b30)]
        AIOSS[aioss-format<br/>![Stable](https://img.shields.io/badge/-stable-34c759)]
        LIBERN[Libern<br/>![Stable](https://img.shields.io/badge/-stable-34c759)]
    end
```

## Distribution

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
pie showData
    title Language Distribution
    "Rust" : 6
    "TypeScript" : 1
    "Go" : 1
    "JSON" : 1
    "Linux" : 1
    "Kasteran" : 1
```

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
pie showData
    title Status Distribution
    "Stable" : 3
    "Beta" : 1
    "Alpha" : 4
    "Experimental" : 3
```

## ![Stable](https://img.shields.io/badge/status-stable-34c759) Stable Projects

| Project | Status | Description | Language |
|---------|--------|-------------|----------|
| [API-OSS](API-OSS) | ![Stable](https://img.shields.io/badge/-stable-34c759) | Open-source API gateway with sovereign engine | Rust |
| [aioss-format](aioss-format) | ![Stable](https://img.shields.io/badge/-stable-34c759) | Tamper-evident proof-of-usefulness ledger | JSON |
| [Libern](Libern) | ![Stable](https://img.shields.io/badge/-stable-34c759) | Cryptographic library (Ed25519, SHA3) | Rust |

## ![Beta](https://img.shields.io/badge/status-beta-0071e3) Beta Projects

| Project | Status | Description | Language |
|---------|--------|-------------|----------|
| [Kathon](Kathon) | ![Beta](https://img.shields.io/badge/-beta-0071e3) | Cryptographic browser with vision-LLM ad blocking | Rust |

## ![Alpha](https://img.shields.io/badge/status-alpha-ff9f0a) Alpha Projects

| Project | Status | Description | Language |
|---------|--------|-------------|----------|
| [Kamelot](Kamelot) | ![Alpha](https://img.shields.io/badge/-alpha-ff9f0a) | Cloud runtime & AI orchestration | Rust |
| [Kasteran](Kasteran) | ![Alpha](https://img.shields.io/badge/-alpha-ff9f0a) | Rune-based systems language | Rust |
| [Inte11ect](Inte11ect) | ![Alpha](https://img.shields.io/badge/-alpha-ff9f0a) | AI gateway & model router | Go |
| [Anticode](Anticode) | ![Alpha](https://img.shields.io/badge/-alpha-ff9f0a) | AI-native IDE | TypeScript |

## ![Experimental](https://img.shields.io/badge/status-experimental-ff3b30) Experimental Projects

| Project | Status | Description | Language |
|---------|--------|-------------|----------|
| [Kazcade](Kazcade) | ![Experimental](https://img.shields.io/badge/-experimental-ff3b30) | Vector file system | Rust |
| [MFSO](MFSO) | ![Experimental](https://img.shields.io/badge/-experimental-ff3b30) | Multi-Factor Search Oracle | Rust |
| [Sovereign-OS](Sovereign-OS) | ![Experimental](https://img.shields.io/badge/-experimental-ff3b30) | Privacy-first operating system | Linux |

## Inter-Project Dependencies

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart TB
    LIBERN[Libern] --> AIOSS[aioss-format]
    LIBERN --> KASTERAN[Kasteran]
    LIBERN --> KATHON[Kathon]
    KASTERAN --> KAZCADE[Kazcade]
    KASTERAN --> SOVEREIGNOS[Sovereign-OS]
    KAZCADE --> MFSO[MFSO]
    KAZCADE --> KAMELOT[Kamelot]
    KAMELOT --> APIOSS[API-OSS]
    APIOSS --> INTE11ECT[Inte11ect]
    KATHON --> KAZCADE
    KATHON --> ANTICODE[Anticode]
```

---

> 📖 **Full docs**: [Docusaurus Projects](https://kleinnner.github.io/Anticloud/docs/projects) · [Home](Home) · [Architecture](Architecture) · [Tools](Tools) · [Ecosystem](Ecosystem) · [Roadmap](Roadmap) · [Glossary](Glossary) · [Security](Security)
