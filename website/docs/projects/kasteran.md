---
sidebar_label: Kasteran
description: Kasteran systems language with rune-based symbolic syntax, linear capability types, self-hosted compiler with Cranelift JIT, WebAssembly, and C backends, plus formal verification pipeline.
keywords: [systems programming, rune-based language, symbolic syntax, memory safety, cryptography]
image: /img/anticloud-social.png
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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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