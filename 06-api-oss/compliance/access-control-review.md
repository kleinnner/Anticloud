---
title: "Access Control Review — API-OSS"
sidebar_position: 99
description: "Codex-scoped access: users can be restricted to specific codex IDs."
tags: [compliance]
---

# Access Control Review — API-OSS

## Authentication Methods

| Method | Implementation | Use Case |
|--------|---------------|----------|
| Bearer Token | Static tokens in `data/auth_tokens.json` | API access |
| User Account | Registration/login with SHA-256 + salt hashing | Multi-user access |
| Read-Only Token | `ro-*` prefixed tokens | Auditor access |
| Shared Dashboard | `dash-*` tokens with expiry | Temporary sharing |

## RBAC Roles

| Role | Graph Read | Graph Write | Tool Exec | User Mgmt | Ledger View | Export |
|------|-----------|-------------|-----------|-----------|-------------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Viewer | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auditor | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

*Codex-scoped access: users can be restricted to specific codex IDs.*

## ABAC Policies

Attribute-Based Access Control evaluates:
- **Node attributes**: classification, department, owner
- **User attributes**: role, clearance, department
- **Environment**: time of day, connection type

Policies are defined in `data/abac_policies.json` as priority-ordered rules.

## Session Management

- Tokens are stored in `auth_tokens.json` (obfuscated)
- User sessions have 24-hour expiry
- Read-only tokens persist until revoked
- Dashboard tokens have configurable expiry (default 7 days)

## Access Logging

All access to the system is logged to the SHA-256 hash-chained ledger:
- Login attempts (success/failure)
- Graph mutations (create, update, delete)
- Council executions
- Document ingestions
- Configuration changes
- Tool executions

## Codex Isolation

Data is organized into **codexes** (isolated workspaces). Users with codex-scoped RBAC can only access data within their assigned codexes. No cross-codex data access is allowed without explicit permission.

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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
