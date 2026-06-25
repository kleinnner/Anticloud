---
title: "Glossary 6: Security Terms"
sidebar_position: 6
description: "Documentation for Glossary 6: Security Terms"
tags: [glossary]
---

# Glossary 6: Security Terms

## Terms

### Air-Gap
- Network physically isolated from the internet
- API-OSS fully supports air-gapped deployment

### TPM (Trusted Platform Module)
- Hardware security chip for cryptographic operations
- API-OSS uses TPM for attestation and key management

### Attestation
- Cryptographic proof that hardware/software is authentic
- API-OSS TPM attestation verifies boot chain integrity

### SHA-256 Audit Chain
- Linked list of hashes ensuring tamper-evident audit trail
- Each entry contains hash of previous entry

### Encryption at Rest
- Data encrypted when stored on disk
- API-OSS supports AES-256-GCM encryption

### Encryption in Transit
- Data encrypted during network transmission
- API-OSS uses TLS 1.3 for all network communication

### TLS (Transport Layer Security)
- Cryptographic protocol for secure network communication
- API-OSS supports TLS 1.2 and 1.3 with mTLS option

### mTLS (Mutual TLS)
- Both client and server authenticate via certificates
- API-OSS supports mTLS for zero-trust deployments

### Zero Trust Architecture
- Security model: never trust, always verify
- API-OSS supports zero-trust with mTLS + RBAC + audit

### Sandbox
- Isolated execution environment for untrusted code
- API-OSS uses WASM sandbox for plugin isolation

### Permission Manifest
- Declarative list of capabilities a plugin requires
- Reviewed and approved at plugin install time

### Secrets Management
- Secure storage and rotation of API keys, tokens, passwords
- API-OSS integrates with HashiCorp Vault, KMS, env vars

### CVE (Common Vulnerabilities and Exposures)
- Public database of known security vulnerabilities
- API-OSS has automated CVE scanning in CI/CD

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
