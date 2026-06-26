---
title: "Compliance Framework"
sidebar_position: 99
description: "API-OSS generates compliance reports for the following frameworks via `api-oss compliance` CLI command and the Compliance Dashboard UI."
tags: [compliance]
---

# Compliance Framework

API-OSS generates compliance reports for the following frameworks via `api-oss compliance` CLI command and the Compliance Dashboard UI.

## Supported Frameworks

| Framework | CLI Flag | Report Contents |
|-----------|----------|-----------------|
| SOC 2 | `--soc2` | Trust services criteria (security, availability, processing integrity, confidentiality, privacy) |
| ISO 27001 | `--iso27001` | Annex A controls (A.5–A.18), risk assessment, SoA |
| GDPR | `--gdpr` | Data inventory, processing activities, DPA terms, right to erasure |
| HIPAA | `--hipaa` | Administrative, physical, technical safeguards (45 CFR §164) |
| FedRAMP | `--fedramp` | NIST 800-53 control families, CSP baseline |
| UAE IA | `--uae-ia` | UAE Information Assurance standards, NESA compliance |
| EU AI Act | `--eu-ai-act` | Risk classification, transparency obligations, conformity assessment |
| STIG | `--stig` | Security Technical Implementation Guide checks |
| SCAP | `--scap` | Security Content Automation Protocol (XCCDF + OVAL) |
| SSP | `--ssp` | System Security Plan (NIST 800-53) |

## Usage

```bash
# Generate all compliance reports
api-oss compliance --all

# Single framework
api-oss compliance --soc2

# Export as JSON
api-oss compliance --soc2 --format json

# Export as HTML
api-oss compliance --soc2 --format html
```

## Built-in Compliance Features

### Audit Ledger (`.aioss`)
- SHA-256 hash chain: every entry cryptographically linked to previous
- Entry types: user_message, ai_message, tool_call, graph_mutation, contradiction, decision, rating
- GDPR-compliant: includes schema_url, legal_basis, data_controller, retention_period, right_to_erasure flag
- Regulatory framework tagging per entry

### Data Classification
- Node-level classification: Unclassified, Internal, Confidential, Secret, TopSecret
- ABAC enforcement based on classification level
- Department and owner-level access control

### Data Residency
- Zero cloud dependency: data stored on customer hardware
- No telemetry, no analytics, no call-home
- Full offline operation capability
- Air-gapped deployment script included

### Privacy Controls
- GDPR export: `/api/gdpr/export` — JSON export of all user data
- GDPR erase: `/api/gdpr/erase` — full data deletion with ledger tombstone
- Data retention: configurable per session, auto-purge for old sessions
- Right to erasure: embedded in ledger schema

## Vendor Lock-in Prevention
- OpenAPI-compatible API (`/v1/chat/completions`, `/v1/models`)
- Standard `.aioss` ledger format (portable JSON)
- Graph export formats: JSON, CSV, DOT, GraphML
- SBOM generation for dependency transparency

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
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781794
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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