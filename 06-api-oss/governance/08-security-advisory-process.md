---
title: "Security Advisory Process"
sidebar_position: 8
description: "How API-OSS handles security vulnerabilities and disclosures."
tags: [governance]
---

# Security Advisory Process

## Overview

How API-OSS handles security vulnerabilities and disclosures.

## Reporting

Report security vulnerabilities to:

```
Email: security@api-oss.local
PGP key: https://api-oss.local/security-pgp.asc
```

## Response Times

| Severity | Initial Response | Fix Timeline |
|---|---|---|
| Critical | 4 hours | 24 hours |
| High | 8 hours | 72 hours |
| Medium | 24 hours | 7 days |
| Low | 72 hours | 30 days |

## Severity Ratings

| Severity | CVSS Score | Example |
|---|---|---|
| Critical | 9.0–10.0 | Remote code execution |
| High | 7.0–8.9 | Authentication bypass |
| Medium | 4.0–6.9 | Privilege escalation |
| Low | 0.1–3.9 | Information disclosure |

## Disclosure Process

### Private Disclosure

```
1. Reporter submits vulnerability
2. Security team triages (24h)
3. Fix developed (private fork)
4. CVE assigned
5. Patch released
6. Public disclosure after 90 days
```

### Coordinated Disclosure

```
1. Reporter submits vulnerability
2. Agreement on timeline
3. Fix developed together
4. CVE assigned jointly
5. Simultaneous release
```

## Security Advisories

Advisories published at:

```text
https://github.com/example/apioss/security/advisories
```

## Bug Bounty

```text
Program: https://hackerone.com/apioss
Scope: apioss gateway, plugins, SDKs
Rewards: $500–$10,000
```

## Next

- [09 Plugin Marketplace Governance](09-plugin-marketplace-governance.md)

## See Also

Related governance, contributing, and security documentation.

- [Governance Overview](../governance/01-governance-overview.md)
- [Contributing Guide](../contributing/01-contributing-overview.md)
- [Code of Conduct](../governance/06-code-of-conduct-enforcement.md)
- [Security Advisory](../governance/08-security-advisory-process.md)
