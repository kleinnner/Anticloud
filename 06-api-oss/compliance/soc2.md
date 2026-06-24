---
title: "SOC 2 Compliance"
sidebar_position: 99
description: "API-OSS is designed to meet SOC 2 Type II criteria across all five trust service categories. As a local-first, air-gap deployable AI decision engine, the architecture inherently satisfies many SOC 2 r"
tags: [compliance]
---

# SOC 2 Compliance

## Overview

API-OSS is designed to meet SOC 2 Type II criteria across all five trust service categories. As a local-first, air-gap deployable AI decision engine, the architecture inherently satisfies many SOC 2 requirements that cloud-dependent systems struggle with.

| Category | Status | Evidence |
|----------|--------|----------|
| **Security** | ✅ Implemented | TLS 1.3, bearer token auth, ABAC, RBAC, sandboxed tools, path traversal protection, TPM attestation |
| **Availability** | ✅ Implemented | Auto-backup, health checks, graceful shutdown, process watchdog, redundant port binding |
| **Processing Integrity** | ✅ Implemented | SHA-256 hash-chained ledger, contradiction detection, Z3 formal verification, input sanitization |
| **Confidentiality** | ✅ Implemented | Classification-based access control (Unclassified→TopSecret), field-level data masking, encryption at rest |
| **Privacy** | ✅ Implemented | GDPR export/erase, no telemetry, no call-home, data residency controls, right to erasure |

## Security Controls

| Control ID | Control | Implementation |
|-----------|---------|----------------|
| CC1.1 | Access Control Policy | `auth.rs` — bearer token + username/password authentication |
| CC1.2 | Logical Access | `abac.rs` — attribute-based access control with classification levels |
| CC1.3 | Authentication | `tls.rs` — TLS 1.3 with auto-generated self-signed certificates |
| CC2.1 | System Monitoring | `diagnostics/` — 60+ diagnostic tests, .health hash-chained ledger |
| CC3.1 | Change Management | `graph_vcs.rs` — version control for knowledge graph mutations |
| CC4.1 | Risk Assessment | `compliance_package.rs` — automated compliance report generation |
| CC5.1 | Incident Response | `automation.rs` — incident playbooks, alert routing, SIEM dashboard |
| CC6.1 | Logical and Physical Access | `sessions.rs` — session store with validation and timeout |
| CC7.1 | System Operations | `backup.rs` — automated backup/restore with retention policy |

## Continuous Monitoring

- `.aioss` ledger provides tamper-evident audit trail for all system operations
- `.health` ledger records diagnostic test results with SHA-256 chain
- All configuration changes logged to ledger
- System integrity checks run on every startup (`integrity.rs`)

## See Also

Related compliance, security, and legal documentation.

- [Compliance Overview](../compliance/01-compliance-overview.md)
- [Security Overview](../security/01-security-overview.md)
- [Legal Documents](../legal/01-terms-of-service.md)
- [Audit Ledger](../whitepapers/07-audit-ledger-integrity.md)
