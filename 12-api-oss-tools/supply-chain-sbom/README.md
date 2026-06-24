# Supply Chain SBOM

Software Bill of Materials (SBOM) generation, analysis, and supply chain risk management.

```mermaid
flowchart LR
    subgraph Input["Input"]
        P[Package Manifests]
        D[Dependencies]
        V[Vulnerability DB]
    end
    subgraph Analysis["SBOM Engine"]
        G[SBOM Generator]
        A[Analyzer]
        T[Tracker]
    end
    subgraph Output["Output"]
        S[SPDX/CycloneDX]
        VR[Vulnerability Report]
        L[License Report]
    end
    P --> G --> S
    D --> A --> VR
    V --> T --> L
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
