# Hash Checker

Cryptographic hash generation, verification, and checksum tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        F[File]
        T[Text]
        H[Expected Hash]
    end
    subgraph Engine["Hash Engine"]
        G[Generator]
        V[Verifier]
        C[Comparator]
    end
    subgraph Output["Output"]
        RH[Result Hash]
        VR[Verification Result]
        M[Match Status]
    end
    F --> G --> RH
    T --> G
    G --> C --> M
    H --> V --> VR
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
