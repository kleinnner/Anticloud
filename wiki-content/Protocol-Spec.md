<!-- SEO -->
<meta name="description" content="Anticloud inter-project protocol specifications — REST, gRPC, WebSocket, CRDT/P2P, LSP, MCP, FFI connections across all 11 projects.">
<meta name="keywords" content="anticloud protocol, REST API, gRPC, CRDT, P2P, LSP, MCP, FFI, inter-project communication">
<meta property="og:title" content="Anticloud Protocol Specifications">
<meta property="og:description" content="REST, gRPC, WebSocket, CRDT/P2P, LSP, MCP, FFI connections across all 11 projects.">
<meta property="og:image" content="https://kleinnner.github.io/Anticloud/img/og-image.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Anticloud Protocol Specifications">
<meta name="twitter:description" content="Inter-project protocol specifications across all 11 Anticloud projects.">
<link rel="canonical" href="https://github.com/kleinnner/Anticloud/wiki/Protocol-Spec">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Anticloud Protocol Specifications",
  "description": "REST, gRPC, WebSocket, CRDT/P2P, LSP, MCP, FFI connections across all 11 projects.",
  "isPartOf": { "@id": "https://github.com/kleinnner/Anticloud/wiki" },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://github.com/kleinnner/Anticloud/wiki/Home" },
      { "@type": "ListItem", "position": 2, "name": "Protocol-Spec", "item": "https://github.com/kleinnner/Anticloud/wiki/Protocol-Spec" }
    ]
  }
}
</script>

![Protocols](https://img.shields.io/badge/Section-Protocols-0071e3?style=for-the-badge)
![Protocols](https://img.shields.io/badge/Protocols-7-34c759?style=for-the-badge)
![Connections](https://img.shields.io/badge/Connections-14-ff9f0a?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# Protocol Specifications

The Anticloud ecosystem uses 7 distinct protocols for inter-project communication. This page documents each protocol's role, transport, and data flow.

## Protocol Map

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart LR
    KAT[Kathon] -- "CRDT/P2P" --> KAZ[Kazcade]
    KAT -- "FFI" --> LIB[Libern]
    KAT -- "MCP" --> ANT[Anticode]
    KAT -- "REST" --> AIO[aioss-format]
    KAM[Kamelot] -- "REST+WS" --> API[API-OSS]
    API -- "gRPC" --> INT[Inte11ect]
    KAS[Kasteran] -- "FFI" --> LIB
    KAS -- "WASM" --> KAZ
    SOV[Sovereign-OS] -- "FFI" --> AIO
    SOV -- "FFI" --> KAS
    KAZ -- "RPC" --> MFS[MFSO]

    style REST fill:#34c759,color:#fff
    style gRPC fill:#0071e3,color:#fff
    style CRDT/P2P fill:#ff9f0a,color:#fff
    style LSP fill:#8b5cf6,color:#fff
    style MCP fill:#ff3b30,color:#fff
    style FFI fill:#1d1d1f,color:#fff
    style WASM fill:#5856d6,color:#fff
```

## Protocol Matrix

| # | Source | Target | Protocol | Transport | Purpose |
|---|--------|--------|----------|-----------|---------|
| 1 | Kathon | Kazcade | CRDT/P2P | QUIC / WebRTC | Distributed state synchronization |
| 2 | Kathon | Libern | FFI | Native binding | Cryptographic operations |
| 3 | Kathon | Anticode | MCP | stdio / TCP | AI agent tool execution |
| 4 | Kathon | aioss-format | REST | HTTP/2 | Audit trail append |
| 5 | Kamelot | API-OSS | REST + WebSocket | HTTP/2 + WS | Service orchestration & events |
| 6 | API-OSS | Inte11ect | gRPC | HTTP/2 streaming | AI model routing |
| 7 | Kasteran | Libern | FFI | Native binding | Crypto primitives for compiler |
| 8 | Kasteran | Kazcade | WASM | WebAssembly | Sandboxed plugin execution |
| 9 | Sovereign-OS | aioss-format | FFI | Kernel-level syscall | Boot attestation ledger |
| 10 | Sovereign-OS | Kasteran | FFI | Kernel-level syscall | System language runtime |
| 11 | Kazcade | MFSO | RPC | TCP | Search query routing |
| 12 | Anticode | Kathon | LSP | TCP | Language intelligence |
| 13 | Kamelot | Kazcade | REST | HTTP/2 | Storage backend access |
| 14 | Inte11ect | Kazcade | gRPC | HTTP/2 | Embedding storage & retrieval |

## Protocol Details

### REST (HTTP/2)

Used for request-response communication between services. API-OSS serves as the primary REST gateway.

- **Endpoints**: `/api/v1/{resource}`
- **Auth**: Ed25519-signed requests (header: `Authorization: Ed25519 {signature}`)
- **Content-Type**: `application/json` or `application/cbor`
- **Used by**: Kathon ↔ aioss-format, Kamelot ↔ API-OSS, Kamelot ↔ Kazcade

### gRPC + WebSocket (HTTP/2 Streaming)

Used for high-throughput streaming and bidirectional communication.

- **Service definitions**: Protocol Buffers v3 (`.proto` files in `06-api-oss/proto/`)
- **Streaming**: Server-side streaming for model inference, bidirectional for real-time collaboration
- **Used by**: API-OSS ↔ Inte11ect, Inte11ect ↔ Kazcade

### CRDT over P2P (QUIC / WebRTC)

Used for distributed state synchronization without central coordination.

- **CRDT type**: Last-Writer-Wins Register + Multi-Value Register + Grow-only Set
- **Transport**: QUIC (reliable) or WebRTC (browser-compatible)
- **Conflict resolution**: Lamport timestamps + Merkle clock
- **Used by**: Kathon ↔ Kazcade

### LSP (Language Server Protocol)

Used for editor-agnostic language intelligence.

- **Capabilities**: Completion, hover, go-to-definition, references, diagnostics
- **Transport**: TCP (default) or stdio
- **Used by**: Anticode ↔ Kasteran

### MCP (Model Context Protocol)

Used for AI agent tool execution and model interaction.

- **Resources**: Files, databases, browser state
- **Tools**: Code execution, file editing, web search
- **Sampling**: Model inference requests
- **Used by**: Anticode ↔ Kathon

### FFI (Foreign Function Interface)

Used for direct native function calls between projects written in the same or compatible languages.

- **Calling convention**: C ABI (via `#[no_mangle]` in Rust)
- **Memory safety**: Shared ownership via `Arc<>`, no `unsafe` exposure
- **Used by**: Kathon ↔ Libern, Kasteran ↔ Libern, Sovereign-OS ↔ aioss-format, Sovereign-OS ↔ Kasteran

### WASM (WebAssembly)

Used for sandboxed plugin execution across language boundaries.

- **Runtime**: Wasmtime (standalone) / Wasmer (embedded)
- **Capabilities**: WASI preview 2 with restricted fs/network access
- **Used by**: Kasteran → Kazcade (plugin sandbox)

---

> 📖 **Full docs**: [Docusaurus Intro](https://kleinnner.github.io/Anticloud/docs/intro) · [Home](Home) · [Architecture](Architecture) · [Projects](Projects) · [Security](Security) · [Glossary](Glossary)
