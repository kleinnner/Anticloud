# 06 — API-OSS

**Agent-Predictive Intelligence Sovereign Operating System** — A local-first sovereign AI platform encompassing an API gateway architecture, multi-agent deliberation councils, cryptographic audit infrastructure, decentralized identity, and full-stack AI transparency.

```mermaid
flowchart TD
    subgraph Gateway["AI Gateway"]
        RT[Request Router]
        RL[Rate Limiter]
        AU[Authentication]
    end
    subgraph Councils["Multi-Agent Councils"]
        RA[Risk Agent]
        LA[Legal Agent]
        SA[Strategist Agent]
        CO[Consensus Engine]
    end
    subgraph AI["AI Infrastructure"]
        ML[Model Router]
        RL2[RL Fine-Tuning]
        AL[Active Learning]
        RA2[RAG Pipeline]
    end
    subgraph Ledger["Transparency Layer"]
        AL2[.aioss Ledger]
        CE[Contradiction Engine]
        CT[Citation Tracker]
    end
    subgraph Security["Security & Compliance"]
        TP[TPM Attestation]
        WA[WASM Sandbox]
        CM[Compliance Monitor]
    end
    subgraph Extensions["Ecosystem"]
        CL[CLI Tools]
        VS[VS Code Extension]
        API[API Tools]
        HD[API Hub]
    end
    User --> Gateway
    Gateway --> AU
    AU --> Councils
    Councils --> CO
    CO --> AI
    AI --> Ledger
    AI --> Security
    Ledger --> Extensions
```

## Documentation

| Category | Docs | Description |
|----------|------|-------------|
| [Research](./research/) | 30 | Academic research papers |
| [Whitepapers](./whitepapers/) | 10 | Technical whitepapers |
| [Features](./features/) | 162 | Comprehensive feature documentation |
| [Architecture](./architecture/) | 15 | Architecture documentation |
| [Specifications](./spec/) | 11 | Technical specifications |
| [Tutorials](./tutorials/) | 15 | Getting started guides |
| [Compliance](./compliance/) | 10 | Compliance frameworks |
| [Community](./community/) | 10 | Community documentation |
| [Governance](./governance/) | 12 | Governance documentation |
| [FAQ](./faq/) | 15 | Frequently asked questions |
| [Glossary](./glossary/) | 30 | Terminology reference |
| [CLI Reference](./cli/) | 22 | Command-line interface documentation |
| [API Reference](./api-reference/) | 30 | API documentation |
| [Cheat Sheets](./cheat-sheets/) | 4 | Quick reference guides |
| [Decision Guides](./decision-guides/) | 11 | Technology decision guides |
| [Accessibility](./accessibility/) | 8 | Accessibility documentation |
| [Brand](./brand/) | 8 | Brand guidelines |
| [Case Studies](./case-studies/) | 10 | Usage case studies |
| [Community Projects](./community-projects/) | 8 | Community project showcase |
| [Press](./press/) | 12 | Press documentation |
