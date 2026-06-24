# Link Cleaner

URL sanitization, cleaning, and tracking parameter removal tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        U[Raw URL]
        R[Rules]
        P[Parameters]
    end
    subgraph Engine["Cleaning Engine"]
        P2[Parser]
        S[Sanitizer]
        V[Validator]
    end
    subgraph Output["Output"]
        CU[Clean URL]
        R2[Report]
        S2[Stats]
    end
    U --> P2
    R --> S --> CU
    P --> V --> R2
    P2 --> S2
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
