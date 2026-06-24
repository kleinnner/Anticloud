# Cert Badges

Certification badge generator and compliance status indicator.

```mermaid
flowchart LR
    subgraph Input["Input"]
        C[Certifications]
        S[Status]
        M[Metadata]
    end
    subgraph Generator["Badge Engine"]
        T[Template Selector]
        R[Renderer]
        V[Validator]
    end
    subgraph Output["Output"]
        B[SVG Badges]
        E[Embed Code]
        G[Gallery]
    end
    C --> T
    S --> R --> B
    M --> V --> E
    B --> G
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
