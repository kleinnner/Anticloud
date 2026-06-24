# Deployment Cost Estimator

Infrastructure cost estimation and budget planning tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        R[Resource Specs]
        P[Pricing Tiers]
        U[Usage Patterns]
    end
    subgraph Engine["Cost Engine"]
        CM[Cost Model]
        CA[Calculator]
        OP[Optimizer]
    end
    subgraph Output["Output"]
        E[Estimate]
        C[Comparison]
        S[Savings Plan]
    end
    R --> CM --> E
    P --> CA --> C
    U --> OP --> S
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
