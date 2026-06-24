# Vendor Risk Score

Vendor risk assessment, scoring, and management tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        V[Vendor Info]
        C[Criteria]
        E[Evidence]
    end
    subgraph Engine["Risk Engine"]
        S[Scorer]
        W[Weighting]
        A[Aggregator]
    end
    subgraph Output["Output"]
        RS[Risk Score]
        B[Breakdown]
        RC[Recommendations]
    end
    V --> S --> RS
    C --> W --> B
    E --> A --> RC
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
