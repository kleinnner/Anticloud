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

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
