---
title: "Compliance Framework Mapping"
sidebar_position: 10
description: "Mapping API-OSS capabilities to major compliance frameworks."
tags: [whitepapers]
---

# Compliance Framework Mapping

## Abstract

Mapping API-OSS capabilities to major compliance frameworks.

## Introduction

API-OSS provides configurable security controls that can be mapped to multiple compliance frameworks.

## SOC 2

| Control | API-OSS Feature |
|---|---|
| CC1: Control environment | RBAC, audit logging |
| CC2: Communication | Documentation, alerts |
| CC3: Risk assessment | Vulnerability scanning |
| CC4: Monitoring | Metrics, dashboards |
| CC5: Control activities | Rate limiting, IP whitelist |
| CC6: Logical/Physical access | Auth (API keys, SSO, mTLS) |
| CC7: System operations | Backup, DR, HA |
| CC8: Change management | Config versioning, CI/CD |
| CC9: Risk mitigation | Encryption, secrets mgmt |

## HIPAA

| Rule | API-OSS Feature |
|---|---|
| Privacy Rule (164.502) | Data access controls |
| Security Rule (164.308) | Admin safeguards, RBAC |
| Security Rule (164.310) | Encryption at rest |
| Security Rule (164.312) | Audit controls, integrity |
| Breach Notification (164.400) | Alert webhooks |
| BA Agreements | Configurable logging |

## GDPR

| Article | API-OSS Feature |
|---|---|
| Art 5: Principles | Data minimization config |
| Art 17: Right to erasure | Data deletion API |
| Art 25: Data protection by design | Configurable retention |
| Art 30: Records of processing | Audit logging |
| Art 32: Security of processing | Encryption, access controls |
| Art 33: Breach notification | Alert webhooks |
| Art 35: DPIA | Documentation |

## FedRAMP

| Control Family | API-OSS Feature |
|---|---|
| AC: Access Control | RBAC, SSO, mTLS |
| AU: Audit | Hash chain ledger |
| IA: Identification & Auth | API keys, OAuth2 |
| SC: System & Comms | TLS 1.3, encryption |
| SI: System Integrity | TPM attestation |
| CP: Contingency Planning | Backup, DR, HA |

## PCI DSS

| Requirement | API-OSS Feature |
|---|---|
| Req 3: Protect stored data | Encryption at rest |
| Req 4: Encrypt transmission | TLS 1.3 |
| Req 7: Access control | RBAC |
| Req 8: Identification | API keys, SSO |
| Req 10: Monitoring | Audit logging |
| Req 11: Testing | Pen testing support |

## Configuration

```yaml
compliance:
  framework: soc2
  controls:
    logical_access:
      mfa: required
      session_timeout: 30m
    audit:
      retention_days: 395
      integrity_check: true
    encryption:
      at_rest: aes-256-gcm
      in_transit: tls-1.3
```

## Next

- [01 Sovereign AI Architecture](01-sovereign-ai-architecture.md)

## See Also

- [Whitepapers](../whitepapers/01-sovereign-ai-architecture.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
