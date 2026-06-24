<!-- SEO -->
<meta name="description" content="API-OSS — sovereign API gateway with multi-agent deliberation councils, contradiction detection, 162 feature docs, WASM sandbox, and 30 research papers.">
<meta name="keywords" content="api-oss, API gateway, sovereign engine, rust, graphql, wasm">

<meta property="og:title" content="API-OSS — Anticloud Wiki">
<meta property="og:description" content="API-OSS — sovereign API gateway with multi-agent deliberation councils, contradiction detection, 162 feature docs, WASM sandbox, and 30 research papers.">
<meta property="og:image" content="https://kleinnner.github.io/Anticloud/img/og-image.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="API-OSS">
<meta name="twitter:description" content="API-OSS — sovereign API gateway with multi-agent deliberation councils, contradiction detection, 162 feature docs, WASM sandbox, and 30 research papers.">
<link rel="canonical" href="https://github.com/kleinnner/Anticloud/wiki/API-OSS">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "API-OSS",
  "description": "API-OSS — sovereign API gateway with multi-agent deliberation councils, contradiction detection, 162 feature docs, WASM sandbox, and 30 research papers.",
  "applicationCategory": "Cloud",
  "operatingSystem": "Cross-platform",
  "programmingLanguage": "Rust",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
</script>

<!-- Breadcrumb: Home > Projects > API-OSS -->

![Status](https://img.shields.io/badge/status-stable-34c759?style=for-the-badge)
![Category](https://img.shields.io/badge/category-Cloud-ff9f0a?style=for-the-badge)
![Language](https://img.shields.io/badge/language-Rust-f74c00?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# API-OSS

Sovereign Open-Source API Gateway with multi-agent deliberation councils, contradiction detection engine, WASM sandbox, and comprehensive audit trail.

## Quick Facts

| Attribute | Value |
|-----------|-------|
| **Status** | ![Stable](https://img.shields.io/badge/-stable-34c759) |
| **Category** | Cloud & AI |
| **Language** | Rust |
| **Source** | [`06-api-oss/`](https://github.com/kleinnner/Anticloud/tree/main/06-api-oss) |
| **Dependencies** | Kamelot, Libern |

## AI Gateway Pipeline

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart TD
    R[Request] -->|Route| OR[Orchestrator]
    OR -->|Dispatch| DC[Deliberation Council]
    subgraph Council
        A1[Agent 1]
        A2[Agent 2]
        A3[Agent N]
    end
    DC -->|Responses| CD[Contradiction<br/>Detection Engine]
    CD -->|Resolved| SM[Summary]
    SM -->|Sandbox| WS[WASM Sandbox]
    WS -->|Execute| PL[Plugin]
    PL -->|Result| RSP[Response]
    RSP -->|Audit| AF[.aioss Ledger]
    RSP -->|Return| C[Client]
```

## Relationship Graph

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart LR
    API[API-OSS] -->|Runtime| KAM[Kamelot]
    API -->|AI Routing| INT[Inte11ect]
    API -->|Crypto| LIB[Libern]
    API -->|Audit| AIOS[aioss-format]
```

## API Request Flow

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
sequenceDiagram
    Client->>Gateway: HTTP Request
    Gateway->>Auth: verify(Ed25519 signature)
    Auth-->>Gateway: ok(identity)
    Gateway->>WASM: execute(plugin)
    WASM->>Upstream: proxy(request)
    Upstream-->>WASM: response
    WASM-->>Gateway: result
    Gateway-->>Client: HTTP Response
```

## Key Features

- **Deliberation Councils**: Multi-agent consensus for AI decisions
- **Contradiction Detection**: Resolves conflicts between agent outputs
- **WASM Sandbox**: Secure plugin execution
- **162 Feature Docs**: Comprehensive API documentation
- **30 Research Papers**: Published research backing the architecture
- **Audit Trail**: All operations cryptographically signed

## Related Projects

| Project | Relationship | Protocol |
|---------|-------------|----------|
| [Kamelot](Kamelot) | Runtime — cloud function execution | gRPC |
| [Libern](Libern) | Cryptographic dependency — provides Ed25519, SHA3-256 | FFI |
| [Inte11ect](Inte11ect) | AI routing — intelligent request distribution | REST |

---

> 📖 **Full docs**: [Docusaurus API-OSS](https://kleinnner.github.io/Anticloud/docs/projects/api-oss) · [Home](Home) · [Projects](Projects) · [Architecture](Architecture) · [Ecosystem](Ecosystem) · [Roadmap](Roadmap) · [Glossary](Glossary) · [Protocol-Spec](Protocol-Spec)
