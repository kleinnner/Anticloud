# Data Residency Map

Data residency visualization and compliance mapping tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        L[Locations]
        R[Regulations]
        D[Data Types]
    end
    subgraph Engine["Mapping Engine"]
        GM[Geo Mapper]
        CR[Compliance Rules]
        RM[Risk Matrix]
    end
    subgraph Output["Output"]
        HM[Heat Map]
        CR2[Compliance Report]
        RC[Recommendations]
    end
    L --> GM --> HM
    R --> CR --> CR2
    D --> RM --> RC
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
