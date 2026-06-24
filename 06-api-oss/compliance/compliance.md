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
