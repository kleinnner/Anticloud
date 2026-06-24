# Deploy Simulator

Deployment scenario simulation and infrastructure planning tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        C[Configuration]
        E[Environment]
        T[Traffic Model]
    end
    subgraph Simulator["Simulation Engine"]
        SM[Scenario Manager]
        EM[Environment Model]
        PM[Performance Model]
    end
    subgraph Output["Output"]
        R[Results]
        B[Benchmarks]
        RC[Recommendations]
    end
    C --> SM
    E --> EM --> R
    T --> PM --> B
    R --> RC
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
