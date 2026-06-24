# Architecture Canvas

System architecture modeling and visualization tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        C[Components]
        R[Relationships]
        P[Properties]
    end
    subgraph Canvas["Architecture Canvas"]
        M[Model Builder]
        V[Visualizer]
        A[Analyzer]
    end
    subgraph Output["Output"]
        D[Diagrams]
        R2[Reports]
        E[Export]
    end
    Input --> M --> V
    M --> A
    V --> D
    A --> R2
    D --> E
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
