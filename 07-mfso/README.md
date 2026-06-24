# 07 — MF+SO Sovereign Identity & Authentication Vault

**Multi-Factor + Sign On** — A cryptographic authentication and identity management system with defense-in-depth: AES-256-GCM, PBKDF2-SHA256, SHA3-256, HMAC, Ed25519, Shamir's secret sharing, and TPM/Secure Enclave/StrongBox hardware-backed key storage.

```mermaid
flowchart TD
    subgraph Vault["Identity Vault"]
        CP[Crypto Primitives]
        SS[Shamir Secret Sharing]
        BP[BIP39 Mnemonic]
        TP[TOTP Generator]
    end
    subgraph Hardware["Hardware Security"]
        SE[Secure Enclave]
        SB[StrongBox]
        TM[TPM 2.0]
    end
    subgraph Auth["Authentication"]
        PA[Passwordless Auth]
        ZK[Zero-Knowledge Proofs]
        PS[Privacy-Preserving Auth]
    end
    subgraph PostQuantum["Post-Quantum"]
        PQ[CRYSTALS-Dilithium]
        ML[ML-DSA Migration]
        SC[Side-Channel Resistance]
    end
    subgraph Standards["Standards Compliance"]
        W3[W3C DID]
        NI[NIST Standards]
        FC[FIPS Compliance]
    end
    Vault --> Hardware
    Vault --> Auth
    Vault --> PostQuantum
    Vault --> Standards
```

## Documentation

| Category | Docs | Description |
|----------|------|-------------|
| [Feature Papers](./feature-papers/) | 6 | Business requirements and encryption standards |
| [Data Safety & Security](./data-safety-security-sovereignty/) | 8 | AIOSS ledger integrity, backup integrity, cryptographic guarantees |
| [No Black Boxes](./no-black-boxes/) | 8 | Open source philosophy, transparency reports |
| [No More Silicon](./no-more-silicon/) | 6 | Hardware minimalism, edge computing |
| [Privacy](./privacy/) | 8 | Privacy policy, GDPR/CCPA compliance |
| [Compliance](./compliance/) | 8 | SOC2, GDPR, HIPAA, FedRAMP |
| [CSR](./csr/) | 7 | Environmental impact, ethical AI |
| [FAQ](./faq/) | 8 | Frequently asked questions |
| [Help & Bugs](./help-bugs/) | 7 | Troubleshooting |
| [How To Use Community](./how-to-use-community/) | 8 | Community usage guides |
| [How To Use Enterprise](./how-to-use-enterprise/) | 8 | Enterprise usage guides |
| [Enterprise](./enterprise/) | 7 | Enterprise documentation |
