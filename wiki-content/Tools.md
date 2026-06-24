<!-- SEO -->
<meta name="description" content="Anticloud developer tools — 40 tools across Security, Compliance, Analysis, and Utilities domains with status badges, descriptions, and domain distribution.">
<meta name="keywords" content="anticloud tools, developer tools, security tools, compliance tools, cryptography tools">


<!-- Breadcrumb: Home > Tools -->

![Tools](https://img.shields.io/badge/Section-Tools-34c759?style=for-the-badge)
![Total](https://img.shields.io/badge/Total-40%20Tools-34c759?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-10-ff3b30?style=flat-square)
![Compliance](https://img.shields.io/badge/Compliance-9-ff9f0a?style=flat-square)
![Analysis](https://img.shields.io/badge/Analysis-8-0071e3?style=flat-square)
![Utilities](https://img.shields.io/badge/Utilities-13-8b5cf6?style=flat-square)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# Developer Tools

The Anticloud ecosystem includes **40 developer tools** organized into four domains: Security & Cryptography, Compliance & Governance, Analysis & Planning, and Developer Utilities.

## Tool Clusters

```mermaid
mindmap
  root((40 Tools))
    Security
      Hash Checker
      Encrypt Text
      JWT Inspector
      TOTP Generator
      Secure Random
      Threat Model
      Attack Surface
      Ledger Verifier
      Credential Vault
    Compliance
      SSP Generator
      Supply Chain SBOM
      Gap Analyzer
      Compliance Generator
      Compliance Checklist
      Capability Matrix
      Vendor Risk Score
      Data Residency Map
      Cert Badges
    Analysis
      TCO Calculator
      ROI Calculator
      RFP Response
      Integration Checker
      Deployment Cost Est.
      Deploy Simulator
      Contract Clause Analyzer
      Architecture Canvas
    Utilities
      JSON Explorer
      Diff Viewer
      Regex Playground
      SQL Formatter
      Link Cleaner
      Passphrase Generator
      Port Protocol Mapper
      Model Benchmark
      Privacy Scanner
      Focus Timer
      Habit Tracker
      Local Notes
      Readiness Quiz
```

## Domain Distribution

```mermaid
pie
    title Tool Distribution by Domain
    "Security & Cryptography" : 10
    "Compliance & Governance" : 9
    "Analysis & Planning" : 8
    "Developer Utilities" : 13
```

## ![Stable](https://img.shields.io/badge/status-stable-34c759) Stable Tools

### Security & Cryptography
| Tool | Description |
|------|-------------|
| [Hash Checker](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/hash-checker) | Multi-algorithm cryptographic hashing & verification |
| [Encrypt Text](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/encrypt-text) | Symmetric & asymmetric text encryption |
| [JWT Inspector](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/jwt-inspector) | JWT decode, validation, and security analysis |
| [TOTP Generator](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/totp-generator) | Time-based one-time password generator |
| [Secure Random](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/secure-random) | CSPRNG with UUID, passphrase, and byte generation |

### Compliance & Governance
| Tool | Description |
|------|-------------|
| [SSP Generator](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/ssp-generator) | FedRAMP/StateRAMP SSP automation |
| [Supply Chain SBOM](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/supply-chain-sbom) | SPDX/CycloneDX SBOM generation |
| [Capability Matrix](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/capability-matrix) | Capability-to-framework mapping |

### Developer Utilities
| Tool | Description |
|------|-------------|
| [JSON Explorer](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/json-explorer) | JSON tree visualization & query |
| [Diff Viewer](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/diff-viewer) | Side-by-side text comparison |
| [Regex Playground](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/regex-playground) | Interactive regex tester with match highlighting |
| [SQL Formatter](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/sql-formatter) | SQL query beautifier |

## ![Beta](https://img.shields.io/badge/status-beta-0071e3) / ![Alpha](https://img.shields.io/badge/status-alpha-ff9f0a) / ![Experimental](https://img.shields.io/badge/status-experimental-ff3b30) Tools

| Domain | Tools |
|--------|-------|
| 🔒 Security (5) | Threat Model (Beta), Ledger Verifier (Beta), Attack Surface Analyzer (Alpha), Credential Vault (Exp), Secure Random (Stable) |
| 📋 Compliance (6) | Compliance Generator (Beta), Vendor Risk Score (Beta), Data Residency Map (Beta), Gap Analyzer (Alpha), Compliance Checklist (Alpha), Cert Badges (Exp) |
| 📊 Analysis (8) | TCO Calculator (Beta), ROI Calculator (Beta), Architecture Canvas (Beta), RFP Response (Beta), Integration Checker (Alpha), Deployment Cost Est. (Alpha), Deploy Simulator (Exp), Contract Clause Analyzer (Exp) |
| 🔧 Utilities (9) | Passphrase Generator (Alpha), Port Protocol Mapper (Alpha), Model Benchmark (Alpha), Privacy Scanner (Alpha), Focus Timer (Alpha), Habit Tracker (Alpha), Local Notes (Alpha), Readiness Quiz (Alpha), Link Cleaner (Exp) |

---

> 📖 **Full docs**: [Docusaurus Tools](https://kleinnner.github.io/Anticloud/docs/tools) · [Home](Home) · [Architecture](Architecture) · [Projects](Projects) · [Ecosystem](Ecosystem) · [Performance](Performance) · [Glossary](Glossary)
