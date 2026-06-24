# Compliance Matrix

Mapping of Anticloud ecosystem projects to common compliance frameworks.

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully addressed in documentation |
| 🔶 | Partially addressed |
| 📋 | Documented approach, implementation-dependent |
| ❌ | Not applicable / not addressed |

---

## Platform Projects

| Project | SOC 2 | FedRAMP | GDPR | HIPAA | NIST CSF | PCI DSS |
|---------|-------|---------|------|-------|----------|---------|
| 01 Kathon | 🔶 | ❌ | ✅ | ❌ | ✅ | ❌ |
| 02 Kamelot | 🔶 | ❌ | ✅ | 📋 | ✅ | ❌ |
| 03 Kasteran | 🔶 | ❌ | ✅ | 📋 | ✅ | ❌ |
| 04 aioss-format | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 05 sovereign-os | 🔶 | 🔶 | ✅ | 📋 | ✅ | ❌ |
| 06 api-oss | ✅ | 🔶 | ✅ | 📋 | ✅ | ❌ |
| 07 MF+SO | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 08 libern | 🔶 | ❌ | ✅ | 📋 | ✅ | ❌ |
| 09 kazcade | 🔶 | ❌ | ✅ | 📋 | ✅ | ❌ |
| 10 Anticode | 🔶 | ❌ | ✅ | ❌ | ✅ | ❌ |
| 11 inte11ect | 🔶 | ❌ | ✅ | 📋 | ✅ | ❌ |

## Developer Tools

| Category | SOC 2 | FedRAMP | GDPR | HIPAA | NIST CSF |
|----------|-------|---------|------|-------|----------|
| Security & Cryptography | ✅ | 📋 | ✅ | ✅ | ✅ |
| Compliance & Governance | ✅ | ✅ | ✅ | ✅ | ✅ |
| Analysis & Planning | 🔶 | ❌ | ✅ | 📋 | ✅ |
| Developer Utilities | 🔶 | ❌ | ✅ | 📋 | 🔶 |

---

## Key Compliance Features by Project

### Cryptographic Foundation (All Projects)
- **SHA3-256 hash chains** — NIST-approved, FIPS 202 compliant
- **Ed25519 digital signatures** — FIPS 186-5 ready
- **.aioss ledger** — Tamper-evident, supports audit trails (SOC 2)
- **Post-quantum migration** — ML-DSA, FALCON, SPHINCS+ (NIST PQC standards)

### aioss-format (04)
- Dual binary/JSON format for interoperability
- Memory-mapped IO for performance auditing
- SQLite event store for queryable audit logs
- Compliance mapping to SOC 2, FedRAMP, GDPR, HIPAA

### MF+SO (07)
- Shamir secret sharing over GF(256) — key escrow without single point of failure
- Hardware-backed keys (TPM, Secure Enclave, StrongBox) — FIPS 140-3
- Side-channel resistance in constant-time Rust — Common Criteria

### api-oss (06)
- Multi-agent deliberation councils — no-black-box AI transparency
- Contradiction detection engine — audit trail for all decisions
- WASM sandbox — code isolation for FedRAMP boundary

### Compliance & Governance Tools
- SSP Generator — FedRAMP-ready System Security Plans
- Compliance Gap Analyzer — NIST CSF gap analysis
- Supply Chain SBOM — EO 14028 compliant software bills of materials
- Data Residency Map — GDPR data localization visualization

---

## Notes

- Anticloud provides **architecture documentation** for compliance. Actual compliance certification requires implementation-specific audits.
- The `.aioss` tamper-evident ledger format is designed as a compliance primitive that maps to multiple frameworks.
- See each project's `docs/` directory for detailed compliance documentation.
