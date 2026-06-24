# SSP Generator

System Security Plan (SSP) generation and compliance documentation tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        S[System Description]
        C[Controls]
        I[Implementation]
    end
    subgraph Generator["SSP Engine"]
        T[Template Engine]
        P[Population]
        V[Validator]
    end
    subgraph Output["Output"]
        SSP[SSP Document]
        POA[M POA&M]
        AR[Attachment Roster]
    end
    S --> T
    C --> P --> SSP
    I --> V --> POA
    SSP --> AR
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
