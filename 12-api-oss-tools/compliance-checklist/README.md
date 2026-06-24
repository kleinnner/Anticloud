# Compliance Checklist

Compliance requirement tracking and audit preparation tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        F[Framework Selection]
        R[Requirements]
        E[Evidence]
    end
    subgraph Engine["Compliance Engine"]
        C[Checklist Generator]
        S[Status Tracker]
        G[Gap Identifier]
    end
    subgraph Output["Output"]
        CL[Compliance Checklist]
        PR[Progress Report]
        AR[Audit Readiness]
    end
    F --> C --> CL
    R --> S --> PR
    E --> G --> AR
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
