---
title: "Plugin Marketplace Governance"
sidebar_position: 9
description: "Governance rules for the API-OSS plugin marketplace."
tags: [governance]
---

# Plugin Marketplace Governance

## Overview

Governance rules for the API-OSS plugin marketplace.

## Plugin Review Process

```
1. Plugin submitted via GitHub PR
2. Automated security scan (SAST)
3. Manual code review (maintainer)
4. Sandbox testing
5. Documentation review
6. Published to marketplace
```

## Requirements

### Mandatory

```
- Open source license (MIT, Apache 2.0, or compatible)
- Plugin manifest (plugin.json)
- Documentation (README.md)
- Test suite
- No obfuscated code
- No telemetry without user consent
```

### Recommended

```
- WASM format (preferred)
- Published source code
- Community support channel
- Version pinning
```

## Quality Standards

| Level | Requirements | Badge |
|---|---|---|
| Bronze | Basic functionality, tested | 🥉 |
| Silver | + Documentation, examples | 🥈 |
| Gold | + Performance benchmarks, CI | 🥇 |
| Platinum | + Security audit, maintained | 💎 |

## Takedown Policy

Plugins may be removed for:

```
- Security vulnerabilities (immediate)
- License violations (7 days notice)
- No longer maintained (30 days notice)
- Community complaints (review)
- Terms of service violations
```

## Revenue Share

```
Community plugins: 100% to developer
Verified plugins: 90% to developer
Marketplace fee: 5–10%
```

## Next

- [10 Community Council](10-community-council.md)

## See Also

Related governance, contributing, and security documentation.

- [Governance Overview](../governance/01-governance-overview.md)
- [Contributing Guide](../contributing/01-contributing-overview.md)
- [Code of Conduct](../governance/06-code-of-conduct-enforcement.md)
- [Security Advisory](../governance/08-security-advisory-process.md)
