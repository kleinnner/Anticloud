# TOTP Generator

Time-based One-Time Password generator for multi-factor authentication.

```mermaid
flowchart LR
    subgraph Input["Input"]
        S[Secret Key]
        I[Issuer]
        A[Account]
    end
    subgraph Engine["TOTP Engine"]
        H[HMAC-SHA1]
        T[Time Counter]
        Tr[Truncate]
    end
    subgraph Output["Output"]
        C[Current Code]
        R[Remaining Time]
        Q[QR Code]
    end
    S --> H
    T --> H --> Tr --> C
    T --> R
    I --> Q
    A --> Q
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
