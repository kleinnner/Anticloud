# Passphrase Generator

Secure passphrase generation using word lists and entropy sources.

```mermaid
flowchart LR
    subgraph Input["Input"]
        L[Word Count]
        W[Word List]
        S[Separator]
    end
    subgraph Generator["Generation Engine"]
        E[Entropy Source]
        P[Picker]
        C[Combiner]
    end
    subgraph Output["Output"]
        PP[Passphrase]
        SC[Strength Check]
        V[Variants]
    end
    L --> P
    W --> P
    E --> P --> C --> PP
    PP --> SC
    S --> C
    P --> V
```

[Documentation](./docs/README.md) | [FAQ](./docs/FAQ.md) | [Quickstart](./docs/QUICKSTART.md) | [Tutorial](./docs/TUTORIAL.md)
