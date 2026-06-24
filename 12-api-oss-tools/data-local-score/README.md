# Data Local Score

Data localization scoring and sovereignty assessment tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        D[Data Flow]
        L[Locations]
        R[Regulations]
    end
    subgraph Scoring["Scoring Engine"]
        M[Mapper]
        S[Scorer]
        C[Comparator]
    end
    subgraph Output["Output"]
        DS[Data Score]
        RS[Risk Score]
        RC[Recommendations]
    end
    D --> M
    L --> S --> DS
    R --> C --> RS
    DS --> RC
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
