---
title: "Decision Guide: Security Level"
sidebar_position: 9
description: "What security level do I need?"
tags: [decision-guides]
---

# Decision Guide: Security Level

## Question

What security level do I need?

## Decision Tree

```
Do you handle regulated data (HIPAA, PCI, FedRAMP)?
├── Yes → Level 3 (Enterprise security)
└── No → Is your API public-facing?
    ├── Yes → Level 2 (Standard security)
    └── No → Level 1 (Basic security)
```

## Security Levels

| Level | Name | Features | Suitable For |
|---|---|---|---|
| L1 | Basic | API keys, TLS, rate limiting | Internal tools, dev |
| L2 | Standard | + RBAC, audit, IP allowlist, SSO | SaaS, B2B |
| L3 | Enterprise | + mTLS, encryption at rest, HSM, TPM | Regulated, defense |

## Level 1: Basic

```yaml
features:
  - API key authentication
  - TLS 1.3
  - Rate limiting
  - Basic audit logging
```

## Level 2: Standard

```yaml
features:
  - All L1 features
  - RBAC
  - Audit log (hash chain)
  - IP allow/deny
  - SSO (SAML, OIDC)
  - Secrets management
```

## Level 3: Enterprise

```yaml
features:
  - All L2 features
  - mTLS (mutual TLS)
  - Encryption at rest (BYOK)
  - HSM integration
  - TPM attestation
  - SIEM integration
  - Air-gapped support
  - Compliance reporting
```

## Next

- [Decision Guides Index](10-decision-guides-index.md)

## See Also

Related decision guides, architecture, and deployment documentation.

- [Decision Guides Overview](../decision-guides/01-decision-guides-overview.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [Deployment Guide](../deployment/01-overview.md)
- [Recipes](../recipes/01-recipes-overview.md)
