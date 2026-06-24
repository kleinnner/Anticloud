# Model Benchmark

AI model benchmarking and performance comparison tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        M[Models]
        D[Datasets]
        M2[Metrics]
    end
    subgraph Benchmark["Benchmark Engine"]
        R[Runner]
        C[Collector]
        A[Analyzer]
    end
    subgraph Output["Output"]
        B[Benchmark Results]
        C2[Comparison Charts]
        RC[Recommendations]
    end
    M --> R
    D --> R --> C
    M2 --> A --> B
    C --> A
    B --> C2
    B --> RC
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
