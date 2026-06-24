<!-- SEO -->
<meta name="description" content="Kamelot — cloud runtime & AI orchestration with semantic vector file system, 1536-dim embedding search (91% recall), BLAKE3 hash-chain integrity.">
<meta name="keywords" content="kamelot, cloud runtime, AI orchestration, serverless, container orchestration, multi-cloud">



<!-- Breadcrumb: Home > Projects > Kamelot -->

![Status](https://img.shields.io/badge/status-alpha-ff9f0a?style=for-the-badge)
![Category](https://img.shields.io/badge/category-Cloud-ff9f0a?style=for-the-badge)
![Language](https://img.shields.io/badge/language-Rust-f74c00?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# Kamelot

Cloud Runtime & AI Orchestration with serverless containers and multi-cloud deployment.

## Quick Facts

| Attribute | Value |
|-----------|-------|
| **Status** | ![Alpha](https://img.shields.io/badge/-alpha-ff9f0a) |
| **Category** | Cloud & AI |
| **Language** | Rust |
| **Source** | [`02-kamelot/`](https://github.com/kleinnner/Anticloud/tree/main/02-kamelot) |
| **Dependencies** | API-OSS, Libern, Kazcade |

## Architecture Flow

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart TD
    F[Function] -->|Deploy| OR[Orchestrator]
    OR -->|Schedule| CR[Container Runtime]
    CR -->|Execute| WA[WASM Sandbox]
    OR -->|Scale| AU[Auto-Scaler]
    AU -->|Metrics| MON[Monitoring]
    CR -->|Store| KV[KV Store]
    KV -->|Backup| KZ[Kazcade VFS]
    OR -->|Audit| AF[.aioss Ledger]
```

## Relationship Graph

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart LR
    KAM[Kamelot] -->|Gateway| API[API-OSS]
    KAM -->|Storage| KAZ[Kazcade]
    KAM -->|Crypto| LIB[Libern]
    KAM -->|Audit| AIOS[aioss-format]
    KAM -->|AI Routing| INT[Inte11ect]
```

## Deployment Lifecycle

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
stateDiagram-v2
    [*] --> Provisioned
    Provisioned --> Running: deploy
    Running --> Scaling: load increase
    Scaling --> Running: scale complete
    Running --> Draining: shutdown
    Draining --> Stopped: drain complete
    Stopped --> Provisioned: redeploy
```

## Key Features

- **Serverless Runtime**: Function-as-a-Service with WASM isolation
- **AI Orchestration**: Model deployment and inference routing
- **Multi-Cloud**: Deploy across AWS, GCP, Azure, or on-prem
- **Auto-Scaling**: Event-driven scaling with custom metrics
- **Container Runtime**: Lightweight OCI-compatible runtime
- **Audit Logging**: All operations signed to .aioss ledger

## Related Projects

| Project | Relationship | Protocol |
|---------|-------------|----------|
| [API-OSS](API-OSS) | API gateway — REST interface for service orchestration | REST |
| [Libern](Libern) | Cryptographic dependency — provides Ed25519, SHA3-256 | FFI |
| [Kazcade](Kazcade) | Storage backend — CRDT-synced vector state | P2P/CRDT |

---

> 📖 **Full docs**: [Docusaurus Kamelot](https://kleinnner.github.io/Anticloud/docs/projects/kamelot) · [Home](Home) · [Projects](Projects) · [Architecture](Architecture) · [Ecosystem](Ecosystem) · [Roadmap](Roadmap) · [Glossary](Glossary) · [Protocol-Spec](Protocol-Spec)
