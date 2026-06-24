# Threat Model

Threat modeling framework for security risk assessment and mitigation planning.

```mermaid
flowchart LR
    subgraph Input["Input"]
        S[System Architecture]
        A[Assets]
        T[Trust Boundaries]
    end
    subgraph Engine["Threat Model Engine"]
        I[Identification]
        C[Categorization]
        R[Risk Scoring]
    end
    subgraph Output["Output"]
        TM[Threat Model]
        RM[Risk Matrix]
        MP[Mitigation Plan]
    end
    S --> I
    A --> C --> TM
    T --> R --> RM
    RM --> MP
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
