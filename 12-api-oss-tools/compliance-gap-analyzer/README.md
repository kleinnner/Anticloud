# Compliance Gap Analyzer

Compliance gap identification and remediation planning tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        F[Framework]
        S[Current State]
        T[Target State]
    end
    subgraph Analysis["Gap Analysis Engine"]
        M[Mapping Engine]
        G[Gap Detector]
        I[Impact Scorer]
    end
    subgraph Output["Output"]
        GR[Gap Report]
        RP[Remediation Plan]
        TR[Timeline]
    end
    F --> M
    S --> G --> GR
    T --> I --> RP
    RP --> TR
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
