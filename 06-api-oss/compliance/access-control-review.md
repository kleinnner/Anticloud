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
