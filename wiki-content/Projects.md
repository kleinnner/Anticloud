<!-- SEO -->
<meta name="description" content="Anticloud platform projects — 11 open-source projects status, tech stacks, language distribution, and inter-project dependency graph.">
<meta name="keywords" content="anticloud projects, kathon, kamelot, kasteran, kazcade, api-oss, inte11ect, aioss-format, libern, anticode, sovereign-os, mfso">


<!-- Breadcrumb: Home > Projects -->

![Projects](https://img.shields.io/badge/Section-Projects-0071e3?style=for-the-badge)
![Total](https://img.shields.io/badge/Total-13%20Projects-34c759?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)
[![Harvard Dataverse](https://img.shields.io/badge/Data-Harvard%20Dataverse-8B4513?style=flat-square&logo=dataverse)](https://dataverse.harvard.edu/dataverse/anticloud)
[![Zenodo](https://img.shields.io/badge/Research-Zenodo-1682D4?style=flat-square&logo=zenodo)](https://zenodo.org/search?q=anticloud)

# Platform Projects

The Anticloud ecosystem includes 13 platform projects spanning browsers, cloud infrastructure, programming languages, storage systems, operating systems, AI, and philosophical foundations.

## Project Domain Map

```mermaid
flowchart LR
    subgraph Browser[Browser & Client]
        KATHON[Kathon<br/>![Beta](https://img.shields.io/badge/-beta-0071e3)]
        ANTICODE[Anticode<br/>![Alpha](https://img.shields.io/badge/-alpha-ff9f0a)]
    end
    subgraph Cloud[Cloud & AI]
        KAMELOT[Kamelot<br/>![Beta](https://img.shields.io/badge/-beta-0071e3)]
        APIOSS[API-OSS<br/>![Stable](https://img.shields.io/badge/-stable-34c759)]
        INTE11ECT[Inte11ect<br/>![Alpha](https://img.shields.io/badge/-alpha-ff9f0a)]
        CAMUS[Camus<br/>![Experimental](https://img.shields.io/badge/-experimental-ff3b30)]
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
    subgraph Philosophy[Philosophy]
        DAAS[ΔaaS<br/>![Research](https://img.shields.io/badge/-research-8b5cf6)]
    end
```

## Distribution

```mermaid
pie showData
    title Language Distribution
    "Rust" : 6
    "TypeScript" : 1
    "Go" : 1
    "JSON" : 1
    "Linux" : 1
    "Kasteran" : 1
    "Python" : 1
    "Manifesto" : 1
```

```mermaid
pie showData
    title Status Distribution
    "Stable" : 3
    "Beta" : 1
    "Alpha" : 4
    "Experimental" : 4
    "Research" : 1
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
| [Camus](Camus) | ![Experimental](https://img.shields.io/badge/-experimental-ff3b30) | Terminal-native vision-language AI shell | Python |
| [MFSO](MFSO) | ![Experimental](https://img.shields.io/badge/-experimental-ff3b30) | Multi-Factor Search Oracle | Rust |
| [Sovereign-OS](Sovereign-OS) | ![Experimental](https://img.shields.io/badge/-experimental-ff3b30) | Privacy-first operating system | Linux |

## ![Research](https://img.shields.io/badge/status-research-8b5cf6) Research Projects

| Project | Status | Description | Language |
|---------|--------|-------------|----------|
| [ΔaaS](DeltaaaS) | ![Research](https://img.shields.io/badge/-research-8b5cf6) | Post-cloud superposition computing manifesto | Manifesto |

## Inter-Project Dependencies

```mermaid
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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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