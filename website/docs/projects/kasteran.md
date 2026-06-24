---
sidebar_label: Kasteran
---

# Kasteran

Systems Language with rune-based symbolic syntax, linear capability types, self-hosted compiler with Cranelift JIT/WASM/C backends, formal verification pipeline

## Compiler Pipeline

```mermaid
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

    subgraph Backends
        CJ
        WA
        CC
    end
```

## Documentation

View the full documentation for this project on GitHub:
- [Project README](https://github.com/kleinnner/Anticloud/blob/main/03-kasteran/README.md)
- [Project Directory](https://github.com/kleinnner/Anticloud/tree/main/03-kasteran)
