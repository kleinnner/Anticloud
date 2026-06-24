---
sidebar_label: Anticode
description: Anticode terminal-native AI coding engine running fully local LLMs with MCP protocol agent system, cryptographic audit trail for all AI actions, and autonomous code generation.
---

# Anticode

Terminal-Native AI Coding Engine running fully local LLMs, agent system with MCP protocol, cryptographic audit trail for all AI actions

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

## Documentation

View the full documentation for this project on GitHub:
- [Project README](https://github.com/kleinnner/Anticloud/blob/main/10-anticode/README.md)
- [Project Directory](https://github.com/kleinnner/Anticloud/tree/main/10-anticode)
