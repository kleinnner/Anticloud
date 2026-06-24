# 05 — Sovereign OS (01s)

An Arch Linux-based sovereign operating system with integrated .aioss cryptographic ledger, custom toolchain (zerocli + runes), and a no-black-box transparency philosophy. Built for privacy, auditability, and hardware independence.

```mermaid
flowchart TD
    subgraph Base["Operating System Base"]
        AL[Arch Linux]
        DE[Custom Desktop Environment]
        GN[GNOME Shell Extensions]
    end
    subgraph Toolchain["Custom Toolchain"]
        ZC[zerocli]
        RN[Runes Glyph System]
        LX[Lexer & Parser]
        CG[Codegen: x86_64 JIT]
    end
    subgraph Ledger["AIOSS Ledger System"]
        AD[.aioss Daemon]
        HL[Health Diagnostic Ledger]
        SE[SQLite Event Store]
        LM[Log Manager]
    end
    subgraph Security["Security Layer"]
        SB[Secure Boot]
        MB[Measured Boot]
        TK[TPM Attestation]
    end
    subgraph Services["System Services"]
        SD[systemd Services]
        FW[Firefox Customization]
        AS[Audio/Sound Scheme]
    end
    Base --> Toolchain
    Base --> Ledger
    Base --> Security
    Base --> Services
```

## Documentation

| Category | Docs | Description |
|----------|------|-------------|
| [Research](./research/) | 14 | Academic papers on cryptographic audit ledgers, hash chain integrity, no-black-box AI, decentralized identity, privacy-preserving systems, sustainable computing, OS security, compiler optimization, data sovereignty, post-silicon computing, tamper-evident logging, trustworthy computing, Arch Linux stability |
| [Features](./features/) | 20 | Feature documentation covering AIOSS ledger, ISO build system, desktop environment, GNOME extensions, toolchain, zerocli, lexer/parser, codegen, runes, binary format, ledger daemon, health ledger, SQLite store, log manager, theming, boot process, systemd services |
| [Tutorials](./tutorials/) | 25 | Getting started guides |
| [No Black Boxes](./no-black-boxes/) | 7 | Transparency philosophy |
| [No More Silicon](./no-more-silicon/) | 6 | Hardware independence |
| [Privacy](./privacy/) | 10 | Privacy documentation |
| [Compliance](./compliance/) | 10 | Compliance frameworks (GDPR, SOC2, HIPAA, FedRAMP, PCI-DSS, ISO 27001, CCPA, AI Act) |
| [Data Safety](./data-safety/) | 10 | Data safety guarantees |
| [CSR](./csr/) | 6 | Corporate social responsibility |
| [FAQ](./faq/) | 12 | Frequently asked questions |
| [Why Use](./why-use/) | 8 | Value proposition |
| [Community](./community/) | 9 | Community documentation |
| [BDRs](./bdr/) | 8 | Business decision records |
| [Help](./help/) | 9 | Troubleshooting guides |
| [Enterprise](./enterprise/) | 10 | Enterprise documentation |
| [Developers](./developers/) | 18 | Developer documentation |
