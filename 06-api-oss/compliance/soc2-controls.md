---
title: "SOC 2 Controls Mapping — API-OSS"
sidebar_position: 99
description: "API-OSS maps to SOC 2 Trust Services Criteria across 5 categories:"
tags: [compliance]
---

# SOC 2 Controls Mapping — API-OSS

## Overview
API-OSS maps to SOC 2 Trust Services Criteria across 5 categories:
- **CC** — Common Criteria (security, availability, processing integrity, confidentiality, privacy)
- **A** — Additional Criteria for Availability
- **PI** — Additional Criteria for Processing Integrity
- **C** — Additional Criteria for Confidentiality

---

## CC6: Logical and Physical Access Controls

| Control | Implementation | Evidence |
|---------|---------------|----------|
| CC6.1: Access policy | RBAC with 4 roles: Admin, Editor, Viewer, Auditor | `src/rbac.rs` |
| CC6.2: User access provisioning | Bearer token authentication, user accounts with registration/login | `src/auth.rs` |
| CC6.3: Authentication | SHA-256 hashed passwords with salt, session tokens with 24h expiry | `src/auth.rs` |
| CC6.4: Authorization | Codex-scoped access, ABAC policies with classification levels | `src/abac.rs`, `src/rbac.rs` |
| CC6.5: Access termination | Session expiry (24h), token revocation, user deletion | `src/auth.rs` |
| CC6.6: Physical access | Runs on customer hardware — no API-OSS access to customer premises | Architecture |
| CC6.7: Logical access | TLS 1.3 encryption in transit, self-signed certificates | `src/tls.rs` |
| CC6.8: Transmission security | TLS 1.3 with rustls, no external dependencies for HTTPS | `src/tls.rs`, `src/http_client.rs` |

## CC7: System Operations

| Control | Implementation | Evidence |
|---------|---------------|----------|
| CC7.1: Detection and monitoring | Diagnostic engine with 50+ tests, real-time health monitoring | `src/diagnostics/mod.rs` |
| CC7.2: Incident response | Automated STIG scanning, error ring buffer (200 entries) | `src/diagnostics/stig.rs`, `src/handlers/http.rs` |
| CC7.3: Change management | Graph VCS for data changes, config validation on startup | `src/graph_vcs.rs`, `src/config.rs` |

## CC8: Change Management

| Control | Implementation | Evidence |
|---------|---------------|----------|
| CC8.1: Change authorization | Config schema validation, startup integrity checks | `src/config.rs`, `src/integrity.rs` |
| CC8.2: Testing | Diagnostic test suite (50+ tests), CLI doctor command | `src/diagnostics/tests.rs` |

## Availability

| Control | Implementation | Evidence |
|---------|---------------|----------|
| A1.1: Capacity management | Usage tracker, model switching, configurable resource limits | `src/usage.rs` |
| A1.2: Backup and recovery | Full sovereign state export/import, automated backups | `src/backup.rs` |
| A1.3: Business continuity | Single-binary deployment, no external dependencies, portable state | Architecture |

## Confidentiality

| Control | Implementation | Evidence |
|---------|---------------|----------|
| C1.1: Confidential information protection | ABAC with classification, data rooms with token-gated access | `src/abac.rs`, `src/tenant.rs` |
| C1.2: Disposal | GDPR data erasure, session purge, file deletion | `src/ledger.rs` |

## Processing Integrity

| Control | Implementation | Evidence |
|---------|---------------|----------|
| PI1.1: Complete/accurate processing | SHA-256 hash chain ledger, FTS5 indexing verification | `src/ledger.rs`, `src/graph.rs` |
| PI1.2: Error handling | Error ring buffer, diagnostic engine, guardrail state machine | `src/handlers/http.rs`, `src/diagnostics/` |

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com