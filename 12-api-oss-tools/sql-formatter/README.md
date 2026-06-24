# SQL Formatter

SQL query formatting, beautification, and linting tool.

```mermaid
flowchart LR
    subgraph Input["Input"]
        Q[SQL Query]
        D[Dialect]
        O[Options]
    end
    subgraph Engine["Format Engine"]
        P[Parser]
        F[Formatter]
        L[Linter]
    end
    subgraph Output["Output"]
        FQ[Formatted Query]
        E[Errors]
        S[Suggestions]
    end
    Q --> P --> F --> FQ
    D --> P
    O --> L --> E
    L --> S
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
