<!-- SEO -->
<meta name="description" content="Kasteran — rune-based systems language with linear capability types, self-hosted compiler with Cranelift JIT, WebAssembly, and C backends, formal verification.">
<meta name="keywords" content="kasteran, systems programming, rune-based language, symbolic syntax, memory safety, cryptography">

<meta property="og:title" content="Kasteran — Anticloud Wiki">
<meta property="og:description" content="Kasteran — rune-based systems language with linear capability types, self-hosted compiler with Cranelift JIT, WebAssembly, and C backends, formal verification.">
<meta property="og:image" content="https://kleinnner.github.io/Anticloud/img/og-image.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Kasteran">
<meta name="twitter:description" content="Kasteran — rune-based systems language with linear capability types, self-hosted compiler with Cranelift JIT, WebAssembly, and C backends, formal verification.">
<link rel="canonical" href="https://github.com/kleinnner/Anticloud/wiki/Kasteran">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Kasteran",
  "description": "Kasteran — rune-based systems language with linear capability types, self-hosted compiler with Cranelift JIT, WebAssembly, and C backends, formal verification.",
  "applicationCategory": "Language",
  "operatingSystem": "Cross-platform",
  "programmingLanguage": "Rust",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
</script>

<!-- Breadcrumb: Home > Projects > Kasteran -->

![Status](https://img.shields.io/badge/status-alpha-ff9f0a?style=for-the-badge)
![Category](https://img.shields.io/badge/category-Language-8b5cf6?style=for-the-badge)
![Language](https://img.shields.io/badge/language-Rust-f74c00?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# Kasteran

Rune-based Systems Language with linear capability types, self-hosted compiler with Cranelift JIT, WebAssembly, and C backends, formal verification pipeline.

## Quick Facts

| Attribute | Value |
|-----------|-------|
| **Status** | ![Alpha](https://img.shields.io/badge/-alpha-ff9f0a) |
| **Category** | Core Infrastructure |
| **Language** | Rust (self-hosted) |
| **Source** | [`03-kasteran/`](https://github.com/kleinnner/Anticloud/tree/main/03-kasteran) |
| **Dependencies** | Libern (crypto FFI) |

## Compiler Pipeline

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart TD
    S[Source Code<br/>Rune-Based Syntax] -->|Lex| L[Lexer]
    L -->|Tokens| P[Parser]
    P -->|AST| TC[Type Checker<br/>Linear Capability Types]
    TC -->|Typed AST| FV[Formal Verifier]
    FV -->|Verified IR| OPT[Optimizer]
    OPT -->|Optimized IR| CG[Code Generator]
    CG -->|JIT| CJ[Cranelift JIT]
    CG -->|WASM| WA[WebAssembly]
    CG -->|Native| CC[C Backend]
```

## Relationship Graph

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart LR
    KAS[Kasteran] -->|FFI| LIB[Libern]
    KAS -->|Compiled| KAZ[Kazcade]
    KAS -->|Compiled| SOV[Sovereign-OS]
    KAS -->|Audit| AIOS[aioss-format]
```

## Compilation Pipeline

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
stateDiagram-v2
    [*] --> Source
    Source --> Parsed: lexical analysis
    Parsed --> Checked: type checking
    Checked --> IR: codegen
    IR --> Optimized: optimization passes
    Optimized --> Linked: linking
    Linked --> Executable: emit
```

## Key Features

- **Rune-Based Syntax**: Symbolic, expressive language design
- **Linear Capability Types**: Memory safety without GC
- **Self-Hosted Compiler**: Compiles itself since milestone M3
- **Three Backends**: Cranelift JIT, WebAssembly, C transpilation
- **Formal Verification**: Built-in theorem proving pipeline
- **Crypto Primitives**: Native FFI to Libern library

## Related Projects

| Project | Relationship | Protocol |
|---------|-------------|----------|
| [Libern](Libern) | Cryptographic dependency — provides Ed25519, SHA3-256 | FFI |
| [Kazcade](Kazcade) | Storage backend — CRDT-synced vector state | P2P/CRDT |
| [Sovereign-OS](Sovereign-OS) | Target platform — compiled binary deployment | Native |

---

> 📖 **Full docs**: [Docusaurus Kasteran](https://kleinnner.github.io/Anticloud/docs/projects/kasteran) · [Home](Home) · [Projects](Projects) · [Architecture](Architecture) · [Ecosystem](Ecosystem) · [Roadmap](Roadmap) · [Glossary](Glossary) · [Protocol-Spec](Protocol-Spec)
