# TCO Calculator

Total Cost of Ownership calculator for infrastructure and technology decisions.

```mermaid
flowchart LR
    subgraph Input["Input"]
        D[Direct Costs]
        I[Indirect Costs]
        T[Time Horizon]
    end
    subgraph Engine["TCO Engine"]
        M[Cost Model]
        C[Calculator]
        O[Optimizer]
    end
    subgraph Output["Output"]
        TC[TCO Breakdown]
        C2[Comparison]
        S[Savings Plan]
    end
    D --> M
    I --> C --> TC
    T --> O --> C2
    TC --> S
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
