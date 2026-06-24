# Privacy Scanner

Privacy compliance scanning and data exposure detection tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        S[System Scan]
        P[Policies]
        R[Regulations]
    end
    subgraph Engine["Scan Engine"]
        D[Detector]
        C[Classifier]
        A[Assessor]
    end
    subgraph Output["Output"]
        FR[Findings Report]
        RC[Risk Categories]
        RP[Remediation Plan]
    end
    S --> D
    P --> C --> FR
    R --> A --> RC
    RC --> RP
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
