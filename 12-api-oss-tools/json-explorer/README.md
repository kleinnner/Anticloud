# JSON Explorer

JSON data structure exploration, editing, and visualization tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        J[JSON Data]
        Q[Query]
        F[Format]
    end
    subgraph Engine["Explorer Engine"]
        P[Parser]
        T[Tree View]
        S[Search]
    end
    subgraph Output["Output"]
        TV[Tree View]
        V[Validation]
        E[Export]
    end
    J --> P --> TV
    Q --> S
    F --> V
    TV --> E
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
