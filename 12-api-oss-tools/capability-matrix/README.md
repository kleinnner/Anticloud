# Capability Matrix

Capability mapping, maturity assessment, and gap analysis tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        RC[Required Capabilities]
        CC[Current Capabilities]
        BM[Benchmarks]
    end
    subgraph Matrix["Capability Engine"]
        M[Maturity Model]
        G[Gap Analysis]
        S[Scoring]
    end
    subgraph Output["Output"]
        CM[Capability Matrix]
        GR[Gap Report]
        RP[Roadmap Plan]
    end
    RC --> M
    CC --> M --> G
    BM --> S
    G --> GR
    S --> CM
    G --> RP
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
