# 03 — Kasteran Programming Language

[![DOI](https://img.shields.io/badge/DOI-10.7910/DVN/KFK12Y-005c99?style=flat-square)](https://doi.org/10.7910/DVN/KFK12Y) [![DOI](https://img.shields.io/badge/DOI-10.7910/DVN/GDLO0L-005c99?style=flat-square)](https://doi.org/10.7910/DVN/GDLO0L)

A systems programming language with rune-based visual syntax (symbolic glyphs inspired by Urbit's Hoon and APL), a gradual type system with linear capability model, self-hosted compiler with formal verification, and multiple compilation targets.

```mermaid
flowchart LR
    subgraph Frontend
        LX[Lexer]
        PR[Parser]
        AT[AST]
    end
    subgraph Analysis
        HR[HIR]
        TC[Type Checker]
        CH[Capability Checker]
    end
    subgraph Backend
        BC[Bytecode Compiler]
        VM[Virtual Machine]
        CJ[Cranelift JIT]
        WB[WASM Backend]
        CB[C Backend]
    end
    subgraph Tools
        LS[LSP Server]
        RP[REPL]
        PK[Package Manager]
        AD[AutoDiff Engine]
    end
    Source --> LX --> PR --> AT --> HR --> TC --> CH
    CH --> BC --> VM
    CH --> CJ & WB & CB
    AT --> RP
    TC --> LS
    PK --> Source
    AD --> BC
```

## Documentation

| Category | Docs | Description |
|----------|------|-------------|
| [Research](./research/) | 15 | Academic papers on language design, rune syntax, type theory, linear types, memory safety, formal verification, theorem proving, compiler optimization, auto-vectorization, auto-differentiation, dataflow architecture, ECS, GPU computing, WASM, package management |
| [Features](./features/) | 15 | Feature documentation |
| [Tutorials](./tutorials/) | 15 | Getting started guides |
| [No Black Boxes](./no-black-boxes/) | 10 | Transparency philosophy |
| [No More Silicon](./no-more-silicon/) | 10 | Hardware independence |
| [Privacy](./privacy/) | 10 | Privacy documentation |
| [Compliance](./compliance/) | 11 | Compliance frameworks |
| [Data Safety](./data-safety/) | 10 | Data safety guarantees |
| [CSR](./csr/) | 10 | Corporate social responsibility |
| [FAQ](./faq/) | 13 | Frequently asked questions |
| [Why Use](./why-use/) | 15 | Value proposition |
| [Community](./community/) | 10 | Community documentation |
| [BDRs](./bdr/) | 10 | Business decision records |
| [Help](./help/) | 11 | Troubleshooting guides |
| [Developers](./developers/) | 15 | Developer documentation |

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ