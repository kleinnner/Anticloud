---
title: "Risk Assessment — API-OSS"
sidebar_position: 99
description: "Documentation for Risk Assessment — API-OSS"
tags: [compliance]
---

# Risk Assessment — API-OSS

## Asset Inventory

| Asset | Type | Criticality | Description |
|-------|------|-------------|-------------|
| Knowledge Graph | Data | High | All entities, relationships, documents, decisions |
| Audit Ledger | Data | Critical | Tamper-evident record of all operations |
| AI Model Files | Software | High | GGUF model binaries for local inference |
| Configuration | Data | Medium | Server config, API keys (optional), tokens |
| User Credentials | Data | Critical | Password hashes, session tokens |
| Source Code | Software | High | Rust + TypeScript source |

## Threat Model

| Threat | Likelihood | Impact | Mitigation |
|--------|-----------|--------|------------|
| Unauthorized graph access | Low | High | RBAC, ABAC, bearer token auth |
| Data tampering | Low | Critical | SHA-256 ledger, hash chain verification |
| Model poisoning | Low | High | Model hash pinning, Ed25519 signatures |
| DoS via tool execution | Medium | Medium | Sandboxed tool execution, rate limiting |
| Path traversal | Low | Critical | Filename sanitization, path validation |
| Supply chain attack | Low | High | Binary integrity checks, signed releases |
| Data exfiltration via SIEM | Low | Medium | SIEM disabled by default, user-configured |

## Risk Register

| ID | Risk | Severity | Status | Mitigation |
|----|------|----------|--------|------------|
| R1 | SQL injection via graph query | High | Fixed | Parameterized queries throughout |
| R2 | Command injection via bash tool | High | Fixed | Regex metacharacter blocking |
| R3 | Path traversal in file ops | High | Fixed | Path canonicalization + directory whitelist |
| R4 | Weak token obfuscation | Medium | Acknowledged | Tokens stored with XOR obfuscation; planned migration to AES |
| R5 | No rate limiting on WS | Medium | Acknowledged | To be implemented in next release |

## See Also

Related compliance, security, and legal documentation.

- [Compliance Overview](../compliance/01-compliance-overview.md)
- [Security Overview](../security/01-security-overview.md)
- [Legal Documents](../legal/01-terms-of-service.md)
- [Audit Ledger](../whitepapers/07-audit-ledger-integrity.md)
