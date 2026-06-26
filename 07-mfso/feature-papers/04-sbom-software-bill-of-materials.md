<!--
     ▄▄▄   ▄▄▄  ▄▄▄  ▄▄▄▄▄▄▄▄              ▄▄▄▄      ▄▄▄▄     ▄▄▄     
    ██     ███  ███  ██▀▀▀▀▀▀            ▄█▀▀▀▀█    ██▀▀██      ██    
    ██     ████████  ██           ██     ██▄       ██    ██     ██    
    ██     ██ ██ ██  ███████   ▄▄▄██▄▄▄   ▀████▄   ██ ██ ██     ██    
  ▀▀█▄     ██ ▀▀ ██  ██        ▀▀▀██▀▀▀       ▀██  ██    ██     ▄█▀▀  
    ██     ██    ██  ██           ██     █▄▄▄▄▄█▀   ██▄▄██      ██    
    ██     ▀▀    ▀▀  ▀▀                   ▀▀▀▀▀      ▀▀▀▀       ██    
    ▀█▄▄                                                      ▄▄█▀    

MF+SO — Multi Factor+ Sign On
by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner
The Sovereign Identity & Authentication Vault
-->

# SBOM — Software Bill of Materials, Dependencies, Licenses & Vulnerabilities

## 1. Executive Summary

A Software Bill of Materials (SBOM) is a complete, formally structured list of components, libraries, and modules that are required to build a given piece of software. MF+SO maintains a comprehensive SBOM to ensure supply chain transparency, vulnerability management, and license compliance.

This document provides the complete SBOM for MF+SO, including all direct and transitive dependencies, their licenses, versions, and known vulnerabilities.

### 1.1 SBOM Overview

| Format | SPDX 2.3 |
|--------|----------|
| Location | `sbom/` directory |
| Regenerated | Every release |
| Verification | Signed with Minisign |
| Published | https://mfso.ai/sbom/ |

## 2. Runtime Dependencies

### 2.1 JavaScript/TypeScript Libraries

| Package | Version | License | Purpose |
|---------|---------|---------|---------|
| @noble/ciphers | 1.0.3 | MIT | AES-256-GCM |
| @noble/curves | 1.6.0 | MIT | Ed25519, X25519 |
| @noble/hashes | 1.5.0 | MIT | SHA3-256, HKDF |
| idb | 8.0.0 | ISC | IndexedDB wrapper |

### 2.2 WebAssembly Modules

| Module | Version | License | Purpose |
|--------|---------|---------|---------|
| mfso-crypto | 1.0.0 | AGPL-3.0 | Cryptographic operations |
| mfso-chain | 1.0.0 | AGPL-3.0 | .aioss chain processing |

### 2.3 Development Dependencies

| Package | Version | License | Purpose |
|---------|---------|---------|---------|
| TypeScript | 5.5+ | Apache-2.0 | Language |
| Vitest | 2.0+ | MIT | Testing |
| ESLint | 9.0+ | MIT | Linting |
| Prettier | 3.0+ | MIT | Formatting |
| Playwright | 1.50+ | Apache-2.0 | E2E testing |

## 3. Dependency Tree (Direct)

```
mf-so@1.0.0
├── @noble/ciphers@1.0.3 (MIT)
│   └── @noble/ciphers-utils@1.0.1 (MIT)
├── @noble/curves@1.6.0 (MIT)
│   └── @noble/hashes@1.5.0 (MIT)
├── @noble/hashes@1.5.0 (MIT)
└── idb@8.0.0 (ISC)
```

**Total direct dependencies**: 4
**Total transitive dependencies**: 2
**Total dependency count**: 6

## 4. Vulnerability Assessment

### 4.1 Current Scan Results

| Scan Date | Critical | High | Medium | Low | Tool |
|-----------|----------|------|--------|-----|------|
| 2026-06-01 | 0 | 0 | 0 | 0 | Snyk |
| 2026-05-01 | 0 | 0 | 0 | 0 | Dependabot |
| 2026-04-01 | 0 | 0 | 0 | 0 | npm audit |

### 4.2 Vulnerability History

| CVE | Package | Severity | Fixed In | Status |
|-----|---------|----------|----------|--------|
| None reported | — | — | — | Clean |

## 5. Supply Chain Security

### 5.1 Verification

| Check | Method |
|-------|--------|
| Package signing | npm registry signatures |
| Lock file | package-lock.json |
| Reproducible builds | Deterministic compilation |
| SBOM signing | Minisign signature |

### 5.2 Continuous Monitoring

- Automated dependency scanning on every PR
- Weekly full dependency audit
- Alerting on new vulnerabilities
- Automated PR for dependency updates
- Security research community monitoring

## 6. License Compliance

### 6.1 License Summary

| License | Usage |
|---------|-------|
| MIT | 3 packages (noble libraries) |
| ISC | 1 package (idb) |
| AGPL-3.0 | 2 internal modules |

### 6.2 Compliance

- All licenses are OSI-approved open source
- No copyleft conflicts
- License headers in all source files
- Third-party notice file included

## 7. Update Cadence

| Dependency Type | Update Frequency | Review Required |
|----------------|-----------------|-----------------|
| Runtime (noble) | Monthly (patch), quarterly (minor) | Security review |
| Runtime (idb) | Quarterly | Functional review |
| Dev tools | Quarterly | Team review |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com