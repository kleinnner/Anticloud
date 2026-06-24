# Port Protocol Mapper

Network port mapping, protocol identification, and service discovery tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        R[Range]
        H[Hosts]
        P[Protocols]
    end
    subgraph Mapping["Mapping Engine"]
        S[Scanner]
        I[Identifier]
        C[Categorizer]
    end
    subgraph Output["Output"]
        PM[Port Map]
        PS[Protocol Summary]
        SR[Security Report]
    end
    R --> S --> PM
    H --> I --> PS
    P --> C --> SR
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
