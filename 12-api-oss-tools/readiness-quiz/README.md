# Readiness Quiz

Organizational readiness assessment for technology adoption.

```mermaid
flowchart LR
    subgraph Input["Input"]
        Q[Questionnaire]
        C[Categories]
        W[Weights]
    end
    subgraph Assessment["Assessment Engine"]
        S[Scoring]
        A[Analysis]
        R[Reporting]
    end
    subgraph Output["Output"]
        RS[Readiness Score]
        BR[Breakdown]
        RP[Recommendations]
    end
    Q --> S --> RS
    C --> A --> BR
    W --> R --> RP
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
