<!-- SEO -->
<meta name="description" content="Kathon — cryptographic browser with vision-LLM ad blocking (94.3% precision), CRDT P2P sync, spatial workspace, anti-enshittification engine, per-tab VPN.">
<meta name="keywords" content="kathon, cryptographic browser, vision LLM, ad blocking, CRDT, P2P sync, anti-enshittification">

![Status](https://img.shields.io/badge/status-beta-0071e3?style=for-the-badge)
![Category](https://img.shields.io/badge/category-Browser-0071e3?style=for-the-badge)
![Language](https://img.shields.io/badge/language-Rust-f74c00?style=for-the-badge)

# Kathon

Cryptographic Browser with vision-LLM ad blocking, CRDT P2P sync, spatial workspace, anti-enshittification engine, per-tab VPN.

## Quick Facts

| Attribute | Value |
|-----------|-------|
| **Status** | ![Beta](https://img.shields.io/badge/-beta-0071e3) |
| **Category** | Browser & Client |
| **Language** | Rust |
| **Source** | [`01-kathon/`](https://github.com/kleinnner/Anticloud/tree/main/01-kathon) |
| **Dependencies** | Libern (crypto), Kazcade (storage) |

## Architecture Flow

```mermaid
flowchart LR
    U[User] -->|HTTP Request| PR[Proxy Router]
    PR -->|Per-Tab| VPN[VPN Tunnel]
    PR -->|URL| VL[Vision-LLM<br/>Ad Classifier]
    VL -->|94.3% Precision| FB[Ad/Tracker Filter]
    FB -->|Clean Content| SW[Spatial Workspace]
    PR -->|Events| CS[CRDT P2P Sync]
    CS -->|Replicated State| P2P[Peer Nodes]
    SW -->|User Actions| AE[Anti-Enshittification<br/>Engine]
    AE -->|Verified| AF[.aioss Ledger]
```

## Relationship Graph

```mermaid
flowchart LR
    KATHON[Kathon] -->|CRDT Sync| KAZ[Kazcade]
    KATHON -->|Crypto| LIB[Libern]
    KATHON -->|Audit| AIOS[aioss-format]
    KATHON -->|MCP| ANT[Anticode]
```

## Key Features

- **Vision-LLM Ad Blocking**: 94.3% precision using ONNX models
- **Per-Tab VPN**: Isolated VPN tunnels per browser tab
- **CRDT P2P Sync**: Conflict-free replicated data types for distributed state
- **Spatial Workspace**: 2D canvas-based tab organization
- **Anti-Enshittification Engine**: Prevents platform degradation
- **Audit Trail**: All actions logged to .aioss ledger

---

> 📖 **Full docs**: [Docusaurus Kathon](https://kleinnner.github.io/Anticloud/docs/projects/kathon) · [Home](Home) · [Projects](Projects) · [Architecture](Architecture)
