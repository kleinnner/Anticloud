# Contract Clause Analyzer

Contract clause analysis and risk assessment tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        D[Contract Document]
        L[Legal Rules]
        R[Risk Criteria]
    end
    subgraph Analysis["Analysis Engine"]
        P[Parser]
        C[Classifier]
        S[Scorer]
    end
    subgraph Output["Output"]
        CR[Clause Report]
        RA[Risk Assessment]
        S2[Suggestions]
    end
    D --> P
    L --> C --> CR
    R --> S --> RA
    RA --> S2
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
