# ROI Calculator

Return on Investment calculator for technology and business decisions.

```mermaid
flowchart LR
    subgraph Input["Input"]
        C[Costs]
        B[Benefits]
        T[Timeline]
    end
    subgraph Engine["ROI Engine"]
        M[Model]
        C2[Calculator]
        S[Sensitivity]
    end
    subgraph Output["Output"]
        R[ROI Percentage]
        P[Payback Period]
        N[NPV]
    end
    C --> M
    B --> C2 --> R
    T --> S --> P
    M --> N
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
