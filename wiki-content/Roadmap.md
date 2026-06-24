<!-- SEO -->
<meta name="description" content="Anticloud development roadmap — quarter-by-quarter release timeline for all 11 platform projects across 2025-2027.">
<meta name="keywords" content="anticloud roadmap, release timeline, development milestones, kathon beta, kasteran stable">
<meta property="og:title" content="Anticloud Development Roadmap">
<meta property="og:description" content="Quarter-by-quarter release timeline for all 11 platform projects spanning 2025-2027.">
<meta property="og:image" content="https://kleinnner.github.io/Anticloud/img/og-image.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Anticloud Development Roadmap">
<meta name="twitter:description" content="Quarter-by-quarter release timeline for all 11 platform projects.">
<link rel="canonical" href="https://github.com/kleinnner/Anticloud/wiki/Roadmap">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Anticloud Development Roadmap",
  "description": "Quarter-by-quarter release timeline for all 11 platform projects spanning 2025-2027.",
  "isPartOf": { "@id": "https://github.com/kleinnner/Anticloud/wiki" },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://github.com/kleinnner/Anticloud/wiki/Home" },
      { "@type": "ListItem", "position": 2, "name": "Roadmap", "item": "https://github.com/kleinnner/Anticloud/wiki/Roadmap" }
    ]
  }
}
</script>

![Roadmap](https://img.shields.io/badge/Section-Roadmap-1d1d1f?style=for-the-badge)
![Projects](https://img.shields.io/badge/Tracking-11%20Projects-0071e3?style=for-the-badge)
![Horizon](https://img.shields.io/badge/Horizon-2025%E2%80%932027-34c759?style=for-the-badge)
![Milestones](https://img.shields.io/badge/Milestones-18-ff9f0a?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# Development Roadmap

The Anticloud ecosystem development roadmap organized by quarter, showing planned release milestones for all 11 platform projects.

## Release Timeline

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
gantt
    title Anticloud Project Releases
    dateFormat  YYYY-MM
    axisFormat  %Y Q%q

    section Stable
    Libern 1.0           :done,  lib1, 2025-01, 2025-06
    aioss-format 1.0     :done,  aio1, 2025-03, 2025-09
    API-OSS 2.0          :done,  api1, 2025-06, 2025-12

    section Beta
    Kathon 1.0-beta      :active, kat1, 2025-09, 2026-06
    Inte11ect 0.8-beta   :active, int1, 2025-12, 2026-09
    Kasteran 0.9-beta    :        kas1, 2026-03, 2026-12

    section Alpha
    Kamelot 0.5-alpha    :active, kam1, 2025-06, 2026-06
    Anticode 0.4-alpha   :        ant1, 2025-09, 2026-09
    Sovereign-OS 0.3-alpha :     sov1, 2026-01, 2026-12

    section Experimental
    Kazcade 0.2-exp      :        kaz1, 2026-03, 2027-03
    MFSO 0.1-exp         :        mfs1, 2026-06, 2027-06
```

## Milestone Map

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
timeline
    title Development Milestones
    2025 Q1-Q2 : Foundation complete : Libern 1.0 : aioss-format 1.0
    2025 Q3-Q4 : API-OSS 2.0 stable : Kathon beta launch
    2026 Q1-Q2 : Kasteran beta : Kamelot alpha complete : Sovereign-OS alpha
    2026 Q3-Q4 : Inte11ect beta : Anticode alpha : Kazcade experimental
    2027 Q1-Q2 : Kathon 1.0 stable : Kasteran 1.0 stable
    2027 Q3-Q4 : Kamelot beta : MFSO experimental : Sovereign-OS beta
```

## Project Phase Roadmap

| Project | Current | Next Milestone | Target | Dependencies |
|---------|---------|----------------|--------|--------------|
| **Libern** | ✅ 1.0 Stable | 1.1 — Post-quantum primitives | 2026 Q2 | — |
| **aioss-format** | ✅ 1.0 Stable | 1.2 — Streaming verification | 2026 Q3 | Libern |
| **API-OSS** | ✅ 2.0 Stable | 2.1 — WASM plugin system | 2026 Q2 | — |
| **Kathon** | 🔄 1.0 Beta | 1.0 Stable | 2026 Q3 | Libern, Kazcade |
| **Inte11ect** | 🔄 0.8 Beta | 1.0 Stable | 2027 Q1 | API-OSS |
| **Kasteran** | 🔄 0.8 Alpha | 0.9 Beta | 2026 Q4 | Libern |
| **Kamelot** | 🔄 0.4 Alpha | 0.5 Beta | 2026 Q4 | API-OSS, Kazcade |
| **Anticode** | 🔄 0.3 Alpha | 0.5 Beta | 2027 Q1 | Kathon |
| **Sovereign-OS** | 🔄 0.2 Alpha | 0.3 Alpha | 2026 Q3 | Kasteran, aioss-format |
| **Kazcade** | 🔄 0.1 Experimental | 0.2 Alpha | 2027 Q1 | Kasteran |
| **MFSO** | 🔄 0.1 Experimental | 0.2 Alpha | 2027 Q2 | Kazcade |

## Dependency Chain

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart LR
    subgraph Foundation[Foundation Layer]
        LIB[Libern] --> AIO[aioss-format]
    end
    subgraph Language[Language Layer]
        LIB --> KAS[Kasteran]
    end
    subgraph Storage[Storage Layer]
        KAS --> KAZ[Kazcade]
        KAZ --> MFS[MFSO]
    end
    subgraph Browser[Browser Layer]
        KAZ --> KAT[Kathon]
        KAT --> ANT[Anticode]
    end
    subgraph Cloud[Cloud Layer]
        KAZ --> KAM[Kamelot]
        KAM --> API[API-OSS]
        API --> INT[Inte11ect]
    end
    subgraph OS[OS Layer]
        KAS --> SOV[Sovereign-OS]
        AIO --> SOV
    end
    style KAT fill:#0071e3,color:#fff
    style KAS fill:#ff9f0a,color:#fff
    style API fill:#34c759,color:#fff
```

## Key Deliverables

- **2025**: Cryptographic foundation (Libern 1.0, aioss-format 1.0, API-OSS 2.0)
- **2026**: Browser & cloud betas (Kathon, Inte11ect, Kasteran) + alpha-layer expansion
- **2027**: Production releases (Kathon 1.0, Kasteran 1.0) + experimental research (Kazcade, MFSO)

---

> 📖 **Full docs**: [Docusaurus Projects](https://kleinnner.github.io/Anticloud/docs/projects) · [Home](Home) · [Projects](Projects) · [Architecture](Architecture) · [Contributing](Contributing) · [Glossary](Glossary)
