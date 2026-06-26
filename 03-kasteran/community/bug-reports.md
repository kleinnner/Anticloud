<!--
KASTERAN* — The Last Programming Language
© Lois-Kleinner & 0-1.gg 2026. All rights reserved.

 ▄▄   ▄▄▄                                           ▄     
 ██  ██▀                         ██              ▄▄ █ ▄▄  
 ██▄██      ▄█████▄  ▄▄█████▄  ███████    ▄████▄    ██▄████   ▄█████▄  ██▄████▄   █████   
 █████      ▀ ▄▄▄██  ██▄▄▄▄ ▀    ██      ██▄▄▄▄██   ██▀       ▀ ▄▄▄██  ██▀   ██  ▀▀ █ ▀▀  
 ██  ██▄   ▄██▀▀▀██   ▀▀▀▀██▄    ██      ██▀▀▀▀▀▀   ██       ▄██▀▀▀██  ██    ██     ▀     
 ██   ██▄  ██▄▄▄███  █▄▄▄▄▄██    ██▄▄▄   ▀██▄▄▄▄█   ██       ██▄▄▄███  ██    ██           
 ▀▀    ▀▀   ▀▀▀▀ ▀▀   ▀▀▀▀▀▀      ▀▀▀▀     ▀▀▀▀▀    ▀▀        ▀▀▀▀ ▀▀  ▀▀    ▀▀           
-->

# Kasteran* — Bug Reports
© Lois-Kleinner & 0-1.gg 2026

## Overview

Bug reports help us improve Kasteran* by identifying and fixing issues. A good bug report provides clear, detailed information that allows maintainers to reproduce and fix the problem efficiently.

## Bug Report Template

```markdown
### Bug Report

**Summary**: Brief description of the bug

**Version**: Kasteran* version (output of `kasteran --version`)

**Environment**:
- OS: [e.g., Windows 11, macOS 14.5, Ubuntu 24.04]
- Architecture: [e.g., x86-64, ARM64]
- Compiler version: [e.g., 1.0.0]
- Rust version: [if building from source]

**Steps to Reproduce**:
1. Create file `test.krn` with content:
   ```kasteran
   fn main() {
       // minimal reproduction case
   }
   ```
2. Run: `kasteran build test.krn`
3. See error: [paste error output]

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Minimal Reproduction**: Minimal code that demonstrates the bug

**Additional Context**: Any other relevant information

**Possible Fix**: If you have ideas on how to fix
```

## Severity Levels

| Level | Definition | Examples | Response Time |
|---|---|---|---|
| Critical | System crash, data loss, security issue | Compiler crash, memory corruption | 24 hours |
| High | Major feature broken, no workaround | Type checker wrong, codegen error | 72 hours |
| Medium | Feature partially broken, workaround exists | Error message unclear, edge case failure | 1 week |
| Low | Minor issue, cosmetic | Typo in error message, formatting issue | 2 weeks |
| Enhancement | Not a bug, but improvement | Better error message, performance improvement | Triage |

## Bug Lifecycle

```
Submitted → Triaged → Assigned → In Progress → Fixed → Verified → Closed
     ↓                                                    ↓
  Duplicate                                            Won't Fix
  Not a bug
  Needs more info
```

### Stages
1. **Submitted**: Bug report is created
2. **Triaged**: Maintainers review and label
3. **Assigned**: Developer assigned to fix
4. **In Progress**: Fix is being developed
5. **Fixed**: PR with fix is merged
6. **Verified**: Fix is confirmed working
7. **Closed**: Bug is resolved

## Labels

Bug reports are labeled for tracking:
- `bug`: Confirmed bug
- `critical`: Critical severity
- `high`: High severity
- `medium`: Medium severity
- `low`: Low severity
- `needs-reproduction`: Cannot reproduce
- `needs-information`: More info needed
- `has-workaround`: Workaround available
- `good-first-issue`: Good for new contributors

## Resolution Tracking

### Response Timeline
- **Initial response**: Within 48 hours
- **Triage**: Within 1 week
- **Critical fix**: Within 1 week
- **High fix**: Within 1 month
- **Medium fix**: Within 3 months
- **Low fix**: Within 6 months

### Status Updates
Bug reporters receive updates:
- When triaged
- When assigned
- When fix is in progress
- When fix is merged
- When fix is released

## Verifying Fixes

When a fix is submitted, reporters can help:
1. Apply the fix from the PR
2. Test with your reproduction case
3. Confirm the bug is resolved
4. Report any remaining issues

## Security Bugs

Security bugs should be reported privately:
- **Email**: security@kasteran.dev
- **PGP key**: Available on website
- **Do not**: File a public issue for security bugs

Security bugs are handled according to our [Security Policy](security-policy.md).

## Conclusion

Well-structured bug reports help us fix issues quickly. By following this template and providing complete information, you help make Kasteran* better for everyone.

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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