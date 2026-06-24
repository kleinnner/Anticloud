# Ledger Verifier

Cryptographic ledger verification and audit trail validator.

```mermaid
flowchart LR
    subgraph Input["Input"]
        L[Ledger File]
        K[Public Keys]
        H[Hash Chain]
    end
    subgraph Verification["Verification Engine"]
        S[Signature Check]
        I[Integrity Verify]
        C[Chain Validation]
    end
    subgraph Output["Output"]
        R[Verification Result]
        A[Audit Report]
        P[Proof Package]
    end
    L --> S
    K --> S --> R
    H --> I
    I --> C --> A
    A --> P
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
