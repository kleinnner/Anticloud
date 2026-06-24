# Secure Random

Cryptographically secure random number and string generation tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        T[Type]
        L[Length]
        F[Format]
    end
    subgraph Generator["Random Engine"]
        E[Entropy Source]
        G[Generator]
        T2[Transformer]
    end
    subgraph Output["Output"]
        R[Random Value]
        H[Hex]
        B[Base64]
    end
    T --> G
    L --> G
    E --> G --> R
    F --> T2 --> H
    T2 --> B
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
