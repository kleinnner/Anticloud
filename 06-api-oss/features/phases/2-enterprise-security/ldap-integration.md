---
title: "LDAP Integration"
sidebar_position: 99
description: "Direct LDAP bind authentication against existing directory services —"
tags: [features]
---

# LDAP Integration

## What It Does
Direct LDAP bind authentication against existing directory services —
Active Directory,
OpenLDAP, FreeIPA, and any LDAP v3-compatible directory.
Synchronizes users and groups from the directory into the API-OSS RBAC
system without
middleware or additional identity infrastructure.
## How It Works
LDAP integration is implemented in the Rust module
`ai-oss-gateway/src/ldap.rs`.
Unlike most LDAP integrations that rely on system `libldap` or external
binaries, the
API-OSS LDAP client is a pure Rust implementation using the `ldap3` crate
for LDAP
protocol operations and `x509-parser` for certificate handling.
When a user attempts to authenticate, the gateway performs an LDAP bind
operation against
the configured directory server (host, port, optional TLS via `rustls`).
The bind credentials can be: simple bind (username/password) for user
authentication, or
SASL bind (DIGEST-MD5 or GSSAPI) for Kerberos-integrated authentication.
Authentication is handled over WebSocket to port 3030 — the frontend
sends `ldap_auth`
with credentials, and the Rust engine performs the LDAP bind synchronously
before
establishing the session.
After successful authentication, the user's LDAP attributes are mapped to
API-OSS roles
using configurable attribute mappings in `opencode.json`.
For example: `ldap.role_mapping.memberOf:
"CN=API-OSS-Admins,OU=Groups,DC=corp,DC=com" →
role: admin`.
Background synchronization runs on a configurable schedule
(`ldap.sync_interval: "3600"`
seconds) to sync users and groups from the directory.
The sync is incremental — only changed entries are updated, using LDAP's
`modifyTimestamp` or `uSNChanged` attribute for change detection.
Synced users are created in the RBAC system with their directory group
memberships mapped
to codex roles.
The CLI (`api-oss auth ldap test` — test LDAP connectivity and bind
credentials,
`api-oss auth ldap sync` — force an immediate sync) provides management
as part of 87
CLI commands across 9 subcommand groups (auth, service, sync, backup,
etc.).
LDAP configuration is driven by `opencode.json` under `ldap.*`.
The HTTP UI on port 8081 renders LDAP status and sync history.
All LDAP authentication and sync events are recorded in the immutable
ledger at
`data/ledger/` in `.aioss` format.
The gateway runs as a single binary via `api-oss start`, fully air-gapped
— the LDAP
server must be reachable on the network, but no internet is required.
## How to Operate
1.
**Configure LDAP**: In `opencode.json`, set `ldap.url: "ldaps://dc01.corp.com:636"`, `ldap.bind_dn: "CN=api-oss-svc,OU=Service Accounts,DC=corp,DC=com"`, `ldap.bind_password_secret: "ldap_service_password"` (referencing a secret in the secrets store), and `ldap.base_dn: "DC=corp,DC=com"`.
2.
**Test connectivity**: `api-oss auth ldap test` performs a bind and search against the configured directory.
It reports connection success, bind status, and user/group counts.
3.
**Map groups to roles**: In `opencode.json`, define `ldap.role_mapping` entries mapping directory groups to API-OSS roles (admin, editor, viewer, auditor).
4.
**Force sync**: `api-oss auth ldap sync` triggers an immediate incremental sync.
Users and groups are created or updated in the RBAC system.
5.
**Authenticate via LDAP**: Users log in at `https://localhost:8081/login` with their directory credentials.
The Rust engine performs an LDAP bind and establishes the session.
6.
**Monitor sync status**: The HTTP UI shows the last sync time, number of users synced, and any sync errors.
7.
**Audit**: Check `data/ledger/` for `.aioss` entries recording all LDAP authentications and sync operations.
## The Moat
- **Pure Rust LDAP client, no libldap dependency**: The LDAP implementation uses the `ldap3` Rust crate directly — no system library dependency, no `libldap` vulnerabilities, no version compatibility issues.
- **Direct bind, not SCIM provisioning**: Most enterprise SSO integrations use SCIM for user provisioning — adding latency and complexity.
API-OSS performs direct LDAP binds for authentication and synchronizes
directory data
natively.
- **Incremental sync with change detection**: Only changed directory entries are synced — minimizing network traffic and directory server load.
- **Role mapping from directory groups**: Group memberships are automatically mapped to codex roles, eliminating manual role assignment for directory-managed users.
- **Full audit trail**: Every LDAP authentication attempt and sync operation is recorded in `data/ledger/` with cryptographic proof.
- **TLS-secured directory connections**: LDAPS (LDAP over TLS) is supported via `rustls`, using the auto-generated or configured CA certificate for server verification.
## Why Choose API-OSS
OpenAI provides no LDAP support — users authenticate via OpenAI's own
identity system or
OIDC.
Snowflake offers LDAP only via SCIM provisioning, not direct bind.
Palantir supports LDAP but requires a cloud gateway — the LDAP traffic
must flow through
Palantir's cloud infrastructure.
API-OSS provides direct, pure-Rust LDAP bind authentication that works
entirely
on-premises.
For enterprises with existing Active Directory or OpenLDAP deployments,
API-OSS integrates
without additional identity infrastructure.
## Competitive Comparison
- **OpenAI**: No LDAP support — OpenID Connect only.
Users without OIDC-compatible identity providers cannot integrate existing
directories.
- **Snowflake**: LDAP via SCIM provisioning, not direct bind — requires SCIM-compatible identity provider and additional configuration.
No direct LDAP authentication.
- **Palantir**: LDAP supported but requires cloud gateway — directory traffic must route through Palantir's infrastructure for authentication.
- **Anthropic**: No LDAP support.
## Cost-Benefit Analysis
Third-party LDAP integration middleware (Okta LDAP Interface, Azure AD
Domain Services)
costs $2-$15/user/month.
For a 1,000-user deployment, that is $24k-$180k/year.
Building a custom LDAP integration costs 2-4 months of engineering.
API-OSS provides native, pure-Rust LDAP integration at zero additional
cost.
Time savings: 2-4 months of integration development eliminated.
Risk reduction: direct bind eliminates the security risk of credential
sharing with SCIM
provisioning middlewares — user credentials go directly from the user to
the LDAP
directory without passing through intermediate systems.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Direct AD bind for classified enclaves — users authenticate with their existing Common Access Card (CAC) or Active Directory credentials.
The LDAP integration works entirely within the classified network with no
external
dependencies.
- **Enterprise**: Seamless integration with existing corporate Active Directory — employees use their existing AD credentials to access the AI system, and their AD group memberships automatically determine their roles in API-OSS.