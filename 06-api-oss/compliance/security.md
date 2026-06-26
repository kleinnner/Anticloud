---
title: "Security Documentation"
sidebar_position: 99
description: "API-OSS follows a defense-in-depth architecture with zero trust principles. All components run within a single self-contained binary on hardware under the customer's control. No external network depen"
tags: [compliance]
---

# Security Documentation

## Architecture

API-OSS follows a defense-in-depth architecture with zero trust principles. All components run within a single self-contained binary on hardware under the customer's control. No external network dependencies required.

## Security Features

### Authentication
- Bearer token auth (JWT-compatible)
- Username/password with bcrypt-style hashing
- SSO/OIDC support (Google, Azure AD, Okta)
- SAML 2.0 identity provider integration
- LDAP directory authentication
- Read-only API keys for shared dashboards

### Authorization
- **RBAC** — role-based access with granular permission sets
- **ABAC** — attribute-based at the node level (classification, owner, department, codex)
- Classification levels: Unclassified → Internal → Confidential → Secret → TopSecret
- Guardrail state machine: ReadOnly → Write → Admin → Emergency
- Every tool call validated against current guardrail state

### Network Security
- TLS 1.3 with auto-generated self-signed certificates
- mTLS support for peer-to-peer sync
- CORS configurable via `allowed_origins`
- WebSocket rate limiting (per-IP sliding window)
- WebSocket origin validation
- Message size limits and input sanitization

### Data Security
- SHA-256 hash chain for audit ledger (`.aioss` format)
- Tamper-evident: verification re-computes entire chain
- Model file integrity via SHA-256 pins + Ed25519 signatures
- Binary integrity verification on every startup
- File safety scanning: ClamAV + VirusTotal API
- Automatic quarantine for infected files

### Supply Chain Security
- SBOM generation (SPDX format)
- Model hash verification against signed pins
- Binary signing via Ed25519
- Reproducible builds via Docker multi-stage

### Operational Security
- 60+ diagnostic tests across 13 categories
- `.health` hash-chained diagnostic ledger
- Auto-backup with configurable retention
- Process watchdog with auto-restart
- Graceful shutdown handling

## Security Checklist for Deployment

- [ ] Enable TLS with valid certificates
- [ ] Configure `allowed_origins` to restrict CORS
- [ ] Set up bearer token authentication
- [ ] Enable ABAC with classification levels
- [ ] Configure guardrail states for sensitive operations
- [ ] Set up ClamAV for file scanning
- [ ] Enable audit ledger
- [ ] Run `api-oss doctor` to verify deployment
- [ ] Generate SBOM: `api-oss build manifest`
- [ ] Verify binary integrity: `api-oss check`

## Vulnerability Reporting

Report vulnerabilities to security@api-oss.local. 48-hour acknowledgment SLA. Responsible disclosure policy.

## See Also

Related compliance, security, and legal documentation.

- [Compliance Overview](../compliance/01-compliance-overview.md)
- [Security Overview](../security/01-security-overview.md)
- [Legal Documents](../legal/01-terms-of-service.md)
- [Audit Ledger](../whitepapers/07-audit-ledger-integrity.md)

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
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20782190
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/06-api-oss
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/api-oss-fixed
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com