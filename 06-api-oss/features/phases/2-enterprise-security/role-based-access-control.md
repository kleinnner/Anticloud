---
title: "Role-Based Access Control (RBAC)"
sidebar_position: 99
description: "Provides granular permission management per codex with four built-in roles — Admin,"
tags: [features]
---

# Role-Based Access Control (RBAC)

## What It Does
Provides granular permission management per codex with four built-in roles — Admin,
Editor, Viewer, Auditor — plus unlimited custom roles defined in `opencode.json`.
Every user action is scoped to their role and the specific codex or resource they operate
on, with role changes taking effect in real time.
## How It Works
RBAC is implemented in the Rust module `ai-oss-gateway/src/rbac.rs`.
The permission model is evaluated at the Rust layer on every query and mutation — not in
application middleware or the frontend.
When a user sends a WebSocket message to port 3030 (to read, create, update, or delete
graph data), the Rust engine extracts the user's session from the bearer token (generated
via `api-oss auth generate`) or SSO authentication.
The session includes the user's roles, which are mapped to specific codices: `user alice
has role editor on codex finance_reports`.
For each graph operation, the engine checks: does the user have a role on the target codex
(or a parent codex in the hierarchy), does the role permit the requested action (admin:
all actions, editor: create/update/read, viewer: read-only, auditor: read + audit log
access), and is there any ABAC policy that overrides this role-based decision.
Role checks are performed before any data is read from or written to `data/graph.db`
(SQLite WAL).
If the check fails, the operation is rejected with a permission denied error — no data
is touched.
The four built-in roles cover standard access patterns: Admin (full control — create,
read, update, delete, manage permissions, manage secrets), Editor (create, read, update
— no delete, no permission management), Viewer (read-only — can view data and
decisions but cannot modify anything), and Auditor (read + access to immutable ledger and
audit stream — cannot modify data).
Custom roles can be defined in `opencode.json` with granular action permissions — for
example, a "Compliance Officer" role with `["read", "audit", "export"]` permissions.
Role assignments are managed via the CLI (`api-oss auth add-user --username alice --role
editor --codex finance_reports`, `api-oss auth list-users`), one of 87 CLI commands across
9 subcommand groups (auth, service, sync, backup, etc.).
The HTTP UI on port 8081 renders the `OrgAdminView` for visual role assignment and audit.
Role changes are broadcast to all connected sessions in real time over WebSocket — if an
admin revokes a user's role, the next operation from that user is rejected with no session
expiry delay.
All role assignments, changes, and access decisions are recorded in the immutable ledger
at `data/ledger/` in `.aioss` format.
The gateway runs as a single binary via `api-oss start`, fully air-gapped.
## How to Operate
1.
**Create a user**: `api-oss auth add-user --username alice` creates a user in the local auth store.
The user can then log in with a generated bearer token.
2.
**Assign a role**: `api-oss auth add-user --username alice --role editor --codex finance_reports` gives Alice editor access to the finance_reports codex.
3.
**Verify access**: `api-oss auth check-access --username alice --codex finance_reports --action read` returns allowed or denied.
4.
**View user list**: `api-oss auth list-users` shows all users with their roles and assigned codices.
5.
**Manage via UI**: Open `https://localhost:8081/admin/users` for visual user and role management — add users, assign roles, view access history.
6.
**Define custom roles**: In `opencode.json`, add a custom role definition: `{"role": "compliance_officer", "permissions": ["read", "audit", "export"]}`.
7.
**Test role enforcement**: Have an editor attempt to delete a node — the operation is rejected at the Rust engine level before any data is modified.
8.
**Audit**: Check `data/ledger/` for `.aioss` entries recording every role assignment, change, and access decision — providing a complete audit trail of who had what role at any point in time.
## The Moat
- **Engine-level permission enforcement**: Permission checks run in the Rust engine on every operation — not in application middleware, not in the frontend.
There is no role escalation path because the auth check is baked into the graph engine's
execution path.
- **Real-time role revocation**: Role changes are broadcast over WebSocket and take effect on the next operation.
There is no session cache to clear, no token TTL to wait for.
Revoking a role immediately prevents further access.
- **Codex-scoped roles**: Roles are assigned per codex, not globally.
A user can be an editor on one codex and a viewer on another — with no way to cross
codex boundaries.
- **Four built-in roles + unlimited custom roles**: Admin, Editor, Viewer, and Auditor cover standard patterns.
Custom roles with granular permission sets handle any additional requirements.
- **Integration with ABAC**: RBAC decisions can be overridden or refined by ABAC policies — for example, "editor role is required, but user must also have clearance >= SECRET."
- **Immutable audit trail**: Every role assignment, change, and access decision is recorded in `data/ledger/` with cryptographic proof.
## Why Choose API-OSS
OpenAI operates a single-user model — every user with an API key has the same access to
all resources.
There is no role separation, no codex-level permission scoping.
Palantir offers RBAC but requires cloud-based policy synchronization.
Snowflake offers RBAC but only in a cloud SQL context, not for AI decision engines.
API-OSS provides production-grade RBAC with engine-level enforcement, real-time
revocation, and codex-scoped permissions — all as a built-in feature of the single
binary at zero additional cost.
For enterprises that need to enforce least-privilege access across departments and teams,
API-OSS delivers the permission model that cloud AI platforms cannot.
## Competitive Comparison
- **OpenAI**: Single-user model with no role separation — every user is effectively an admin with full access.
No support for read-only or auditor roles.
- **Palantir**: Role-based access control available but requires cloud connection for policy sync.
Offline operation is not supported — policy changes require cloud connectivity.
- **Snowflake**: RBAC exists but only in cloud SQL context, not for AI decision engines.
No auditor role equivalent for AI operations.
- **Anthropic**: No RBAC — stateless API, no user or role model.
## Cost-Benefit Analysis
Enterprise-grade RBAC platforms (Okta, Azure AD with PIM) cost $6-$15/user/month — for
1,000 users, $72k-$180k/year.
Building custom RBAC in-house requires 2-4 months of engineering.
API-OSS provides comprehensive RBAC with real-time enforcement at zero additional cost.
Time savings: 2-4 months of RBAC development eliminated.
Risk reduction: real-time role revocation prevents the "stale permissions" problem —
when an employee changes roles or leaves the company, their AI system access is revoked
immediately, not at the next session expiry or directory sync cycle.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Mandatory for classified codex access with read-only auditor roles — intelligence analysts have editor access to their mission codices, but oversight auditors have read-only access to all codices for compliance monitoring.
Role changes from a departing analyst take effect immediately.
- **Enterprise**: HR codex viewable by HR users only, finance codex by finance only, engineering codex by engineering only — with cross-codex access granted only when needed and immediately revocable.
External auditors receive auditor roles with read-only access to specific codices for the
duration of the audit.
