<!-- SEO -->
<meta name="description" content="Frequently asked questions about the Anticloud ecosystem — 16 questions covering projects, tools, cryptography, and community.">
<meta name="keywords" content="anticloud faq, frequently asked questions, ecosystem guide, getting started">
<meta property="og:title" content="Anticloud FAQ">
<meta property="og:description" content="16 frequently asked questions about the Anticloud ecosystem covering projects, tools, cryptography, and community.">
<meta property="og:image" content="https://kleinnner.github.io/Anticloud/img/og-image.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Anticloud FAQ">
<meta name="twitter:description" content="16 frequently asked questions about the Anticloud ecosystem.">
<link rel="canonical" href="https://github.com/kleinnner/Anticloud/wiki/FAQ">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"What is Anticloud?","acceptedAnswer":{"@type":"Answer","text":"Anticloud is a sovereign technology research ecosystem comprising 11 open-source projects and 40 developer tools building privacy-first, cryptographically-verified technology."}},
    {"@type":"Question","name":"What does 'sovereign technology' mean?","acceptedAnswer":{"@type":"Answer","text":"Technology that operates independently of centralized cloud providers, giving users full control over their data, computation, and identity through cryptographic verification."}},
    {"@type":"Question","name":"How many projects are in the ecosystem?","acceptedAnswer":{"@type":"Answer","text":"11 platform projects spanning browsers, cloud infrastructure, programming languages, storage systems, operating systems, and cryptographic libraries."}},
    {"@type":"Question","name":"How do I get started?","acceptedAnswer":{"@type":"Answer","text":"Start with the Getting Started guide, then browse Projects to find your area of interest, or explore the 40 developer tools."}},
    {"@type":"Question","name":"What programming languages are used?","acceptedAnswer":{"@type":"Answer","text":"Primarily Rust, with TypeScript, Go, and Python used in specific projects. The Kasteran language is a custom rune-based systems language."}},
    {"@type":"Question","name":"What is the cryptographic foundation?","acceptedAnswer":{"@type":"Answer","text":"SHA3-256 hashing, Ed25519 digital signatures, and the .aioss tamper-evident ledger format — all provided by the Libern cryptographic library."}},
    {"@type":"Question","name":"Can I contribute?","acceptedAnswer":{"@type":"Answer","text":"Yes — see the Contributing guide. All projects are open source under MIT/Apache 2.0 licenses."}}
  ]
}
</script>

![FAQ](https://img.shields.io/badge/Section-FAQ-1d1d1f?style=for-the-badge)
![Questions](https://img.shields.io/badge/Questions-16-0071e3?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# Frequently Asked Questions

## Common Questions Overview

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart LR
    Q[Question] -->|What is Anticloud?| A1[11 open-source projects<br/>40 developer tools<br/>Sovereign technology research]
    Q -->|How to contribute?| A2[Open source<br/>MIT / Apache 2.0<br/>See Contributing guide]
    Q -->|Which project for me?| A3[Privacy browsing → Kathon<br/>Cloud AI → Kamelot<br/>Systems → Kasteran<br/>Storage → Kazcade]
    Q -->|Technical foundation?| A4[SHA3-256 + Ed25519<br/>.aioss ledger<br/>Libern crypto library]
    style Q fill:#1d1d1f,color:#fff
```

## Ecosystem Questions

<details>
<summary><strong>What is Anticloud?</strong></summary>

Anticloud is a **sovereign technology research ecosystem** comprising **11 open-source platform projects** and **40 developer tools**. The ecosystem builds privacy-first, cryptographically-verified technology spanning browsers, cloud infrastructure, programming languages, storage systems, and operating systems. [Learn more →](Home)
</details>

<details>
<summary><strong>What does "sovereign technology" mean?</strong></summary>

Technology that operates independently of centralized cloud providers, giving users full control over their data, computation, and identity. All Anticloud projects use cryptographic verification (SHA3-256 + Ed25519 + .aioss ledger) to ensure tamper-evident operations without reliance on third-party infrastructure.
</details>

<details>
<summary><strong>How is this different from the Fandom Wiki?</strong></summary>

The **GitHub Wiki** focuses on technical architecture, inter-project dependencies, and ecosystem mapping — complementing the main [Docusaurus documentation site](https://kleinnner.github.io/Anticloud/). The [Fandom Wiki](https://anticloud.fandom.com) serves as a community knowledge base for broader audiences.
</details>

<details>
<summary><strong>Where can I find the full documentation?</strong></summary>

The main documentation portal is at [kleinnner.github.io/Anticloud](https://kleinnner.github.io/Anticloud/), built with Docusaurus. It includes 55+ documentation pages, 40 tool docs, blog posts, and research paper references.
</details>

## Project Questions

<details>
<summary><strong>How many projects are in the ecosystem?</strong></summary>

**11 platform projects**: Kathon (browser), Kamelot (cloud runtime), Kasteran (language), Kazcade (VFS), API-OSS (API gateway), Inte11ect (AI gateway), aioss-format (ledger), Libern (crypto), Anticode (IDE), Sovereign-OS (OS), MFSO (search oracle). See [Projects](Projects) for full details.
</details>

<details>
<summary><strong>Which project should I start with?</strong></summary>

Choose by interest:
- **Privacy browsing** → [Kathon](Kathon) — vision-LLM ad blocking, per-tab VPN
- **Cloud/AI orchestration** → [Kamelot](Kamelot) or [Inte11ect](Inte11ect)
- **Systems programming** → [Kasteran](Kasteran) — rune-based language
- **Storage** → [Kazcade](Kazcade) — vector file system
- **API development** → [API-OSS](API-OSS) — WASM sandbox gateway
- **Identity/security** → [MFSO](MFSO) — multi-factor sign-on
</details>

<details>
<summary><strong>What are the project statuses?</strong></summary>

| Status | Meaning | Projects |
|--------|---------|----------|
| ![Stable](https://img.shields.io/badge/-stable-34c759) | Production-ready | API-OSS, aioss-format, Libern |
| ![Beta](https://img.shields.io/badge/-beta-0071e3) | Feature-complete, testing | Kathon |
| ![Alpha](https://img.shields.io/badge/-alpha-ff9f0a) | Active development | Kasteran, Kamelot, Inte11ect, Anticode |
| ![Experimental](https://img.shields.io/badge/-experimental-ff3b30) | Research phase | Kazcade, MFSO, Sovereign-OS |
</details>

<details>
<summary><strong>How do projects relate to each other?</strong></summary>

All projects share a common cryptographic foundation (Libern → SHA3-256, Ed25519). Higher-level projects depend on lower-level ones — e.g., Kathon uses Kazcade for storage and Libern for crypto. See [Architecture](Architecture) for the full dependency graph.
</details>

## Technical Questions

<details>
<summary><strong>What is the cryptographic foundation?</strong></summary>

A three-layer stack:
1. **SHA3-256** — Cryptographic hashing for integrity verification
2. **Ed25519** — Digital signatures for authenticity and non-repudiation
3. **.aioss ledger format** — Tamper-evident chain of proof-of-usefulness records

All provided by the [Libern](Libern) cryptographic library.
</details>

<details>
<summary><strong>What programming languages are used?</strong></summary>

| Language | Projects |
|----------|----------|
| **Rust** | Kathon, Kasteran, Kazcade, Kamelot, Libern, MFSO |
| **TypeScript** | Anticode, API-OSS (portal), Inte11ect (desktop) |
| **Go** | Inte11ect (core) |
| **Python** | Sovereign-OS (tools), API-OSS (research) |
| **Kasteran** | Self-hosted systems language |
</details>

<details>
<summary><strong>What protocols do projects use to communicate?</strong></summary>

- **REST/HTTP** — API-OSS ↔ external services
- **gRPC + WebSocket** — API-OSS ↔ Inte11ect (streaming)
- **CRDT over P2P** — Kathon ↔ Kazcade (distributed state)
- **LSP + MCP** — Anticode ↔ Kathon (AI-assisted coding)
- **Native FFI** — Kasteran ↔ Libern (crypto primitives)
</details>

<details>
<summary><strong>What is the .aioss ledger format?</strong></summary>

A dual-format cryptographic ledger format using SHA3-256 hash chaining and Ed25519 state proofs. It supports memory-mapped IO for high performance, SQLite event store integration, and post-quantum migration. Used for tamper-evident audit trails across the ecosystem. [Learn more →](aioss-format)
</details>

## Community Questions

<details>
<summary><strong>How can I contribute?</strong></summary>

See the [Contributing](Contributing) guide. All projects are open source (MIT / Apache 2.0). You can submit issues, fork repositories, open pull requests, or join discussions on GitHub.
</details>

<details>
<summary><strong>Where is the community?</strong></summary>

The ecosystem spans multiple platforms: [GitHub](https://github.com/kleinnner/Anticloud) (code & issues), [LinkedIn](https://linkedin.com/in/kleinner) (professional), [DEV.to](https://dev.to/kleinner) (articles), [Bluesky](https://bsky.app/profile/kleinner.bsky.social) (updates). See [Ecosystem](Ecosystem) for all platforms.
</details>

<details>
<summary><strong>What research has been published?</strong></summary>

Research papers are published on [Zenodo](https://zenodo.org/search?q=anticloud) and [Harvard Dataverse](https://dataverse.harvard.edu/dataverse/anticloud), covering cryptographic verification, sovereign computing, AI-native architectures, and privacy-preserving systems.
</details>

<details>
<summary><strong>Is there a development roadmap?</strong></summary>

Yes — see the [Roadmap](Roadmap) page for the quarter-by-quarter release timeline through 2027.
</details>

---

> 📖 **Full docs**: [Docusaurus Intro](https://kleinnner.github.io/Anticloud/docs/intro) · [Home](Home) · [Getting-Started](Getting-Started) · [Projects](Projects) · [Contributing](Contributing) · [Ecosystem](Ecosystem)
