<!-- SEO -->
<meta name="description" content="Anticode — terminal-native AI coding engine running fully local LLMs with MCP protocol agent system, cryptographic audit trail for all AI actions, autonomous code generation.">
<meta name="keywords" content="anticode, AI IDE, code generation, developer tools, AI-assisted development">

![Status](https://img.shields.io/badge/status-alpha-ff9f0a?style=for-the-badge)
![Category](https://img.shields.io/badge/category-Browser-0071e3?style=for-the-badge)
![Language](https://img.shields.io/badge/language-TypeScript-3178c6?style=for-the-badge)

# Anticode

Terminal-Native AI Coding Engine running fully local LLMs, MCP protocol agent system, cryptographic audit trail for all AI actions, and autonomous code generation.

## Quick Facts

| Attribute | Value |
|-----------|-------|
| **Status** | ![Alpha](https://img.shields.io/badge/-alpha-ff9f0a) |
| **Category** | Browser & Client |
| **Language** | TypeScript |
| **Source** | [`10-anticode/`](https://github.com/kleinnner/Anticloud/tree/main/10-anticode) |
| **Dependencies** | Kathon (MCP), Libern |

## Agent System Flow

```mermaid
flowchart TD
    P[Prompt] -->|MCP| AG[Agent<br/>Orchestrator]
    AG -->|Task| LL[Local LLM<br/>llama.cpp]
    LL -->|Code| RE[Review Engine]
    RE -->|Approved| AP[Apply Patch]
    RE -->|Rejected| FB[Feedback]
    FB -->|Loop| LL
    AP -->|All Actions| AT[Audit Trail]
    AT -->|Signed| AF[.aioss Ledger]
```

## Relationship Graph

```mermaid
flowchart LR
    ANT[Anticode] -->|MCP| KAT[Kathon]
    ANT -->|Crypto| LIB[Libern]
    ANT -->|Audit| AIO[aioss-format]
    ANT -->|Agent| API[API-OSS]
```

## Key Features

- **Fully Local LLM**: Runs llama.cpp models without cloud dependency
- **MCP Protocol**: Model Context Protocol for agent orchestration
- **Review Engine**: Autonomous code review and improvement loop
- **Patch Application**: Direct file modification with rollback
- **Audit Trail**: Every AI action cryptographically signed
- **Terminal Native**: CLI-first experience for developers

---

> 📖 **Full docs**: [Docusaurus Anticode](https://kleinnner.github.io/Anticloud/docs/projects/anticode) · [Home](Home) · [Projects](Projects) · [Architecture](Architecture)
