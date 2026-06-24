# Attack Surface Analyzer

Security attack surface analysis and visualization.

```mermaid
flowchart LR
    subgraph Input["Input"]
        S[System Model]
        E[Entry Points]
        D[Data Flows]
    end
    subgraph Analysis["Analysis Engine"]
        AS[Attack Surface Mapping]
        V[Vulnerability Scan]
        R[Risk Scoring]
    end
    subgraph Output["Output"]
        M[Attack Surface Map]
        R2[Risk Report]
        RC[Recommendations]
    end
    Input --> AS --> M
    Input --> V --> R2
    R --> RC
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
