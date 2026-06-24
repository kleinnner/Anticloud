---
title: "Bearer Token Auth"
sidebar_position: 99
description: "HTTP Bearer token authentication for all API and WebSocket access."
tags: [features]
---

# Bearer Token Auth

## What It Does
HTTP Bearer token authentication for all API and WebSocket access.
Supports a zero-config mode when no tokens are configured — ideal for closed, physically
secured deployments where additional authentication would be operational friction.
Adding a single token automatically locks down the entire system.
## How It Works
Bearer token authentication is implemented in the Rust module
`ai-oss-gateway/src/auth.rs`.
On every HTTP request to port 8081 and every WebSocket connection to port 3030, the
gateway checks for an `Authorization: Bearer <token>` header.
The zero-config detection logic works as follows: at startup, the system reads the token
store from the encrypted secrets database.
If the store is empty (no tokens have ever been created), the system permits all requests
without authentication.
This is not a separate "allowlisted" mode — it is the same code path with an empty-token
fast path.
When `api-oss auth generate --label my-token` is invoked (one of 87 CLI commands across 9
subcommand groups), the first token is created.
The token is generated as 32 bytes of cryptographically random data from the Rust `OsRng`
source, then SHA-256 hashed before storage.
The plaintext token is displayed once to the operator; subsequent lookups return only the
token prefix and label.
Once any token exists, the zero-config path is disabled permanently — all requests must
present a valid bearer token.
Tokens support optional expiration (via `--expiry 90d`), optional labels for organization,
and optional binding to specific IP ranges.
Token validation caches the hashed tokens in memory with an LRU cache for minimal latency.
The auth module integrates with the immutable ledger at `data/ledger/` — every auth
decision (success, failure, token expiry) is recorded in `.aioss` format with
cryptographic chaining.
The entire system runs as a single binary started via `api-oss start` or directly, with
token configuration persisted in the encrypted secrets store.
TLS 1.3 is provided by auto-generated self-signed certificates via `rcgen` and `rustls`,
ensuring bearer tokens are never transmitted in plaintext.
All of this works fully air-gapped with no internet connectivity.
## How to Operate
1.
**Deploy without tokens**: Start the gateway via `api-oss start`.
The HTTP UI at `https://localhost:8081` and WebSocket at `wss://localhost:3030` accept all
connections.
Config in `opencode.json` controls all runtime parameters.
2.
**Generate a token**: Run `api-oss auth generate --label "admin-access" --expiry 365d`.
Save the displayed token — it is shown only once.
3.
**Lock the system down**: With the token created, the zero-config mode is disabled.
All clients must now include `Authorization: Bearer <token>` in requests.
4.
**Manage tokens**: Use `api-oss auth list` to view active tokens (prefix + label only), `api-oss auth remove <prefix>` to revoke a token, and `api-oss auth generate` to create additional tokens.
5.
**Test from CLI**: `curl -H "Authorization: Bearer <token>" https://localhost:8081/api/health` verifies the token works.
6.
**WebSocket auth**: Include the token in the connection URL: `wss://localhost:3030?token=<token>`.
7.
**Audit**: Check `data/ledger/` for `.aioss` entries recording every auth decision.
## The Moat
- **Intelligent zero-config default**: Unlike every competitor that requires always-on authentication, API-OSS defaults to open access when deployed on isolated hardware.
This is not a separate "development mode" — it is the same code path detecting an empty
token store.
- **Self-hardening**: Adding a single token automatically and permanently locks down the system.
There is no configuration toggle to accidentally leave open.
- **Cryptographic token storage**: Tokens are SHA-256 hashed before storage — the plaintext exists only in the CLI output at generation time.
A database compromise does not reveal valid tokens.
- **Full audit trail**: Every auth decision is recorded in `data/ledger/` with `.aioss` cryptographic chaining.
Auditors can prove that no unauthorized access occurred.
- **Air-gapped**: Token generation and validation use local entropy (`OsRng`) and local storage.
No identity provider, no cloud dependency, no internet required.
- **Single binary**: The auth system is compiled into the same binary that serves the HTTP UI and WebSocket — no separate auth microservice, no proxy.
## Why Choose API-OSS
Cloud vendors charge per-seat or per-API-key pricing — OpenAI's API keys are tied to
usage tiers, Snowflake charges per user, and Palantir's per-seat licensing can reach
$100k+/year.
API-OSS provides unlimited bearer tokens at zero cost.
The zero-config mode is unique to API-OSS — for physically secured deployments like
factory floors, SCIFs, or disconnected networks, requiring authentication adds friction
without security benefit.
When the system is deployed in an open network, adding a single token hardens it
instantly.
No competitor offers this flexibility.
## Competitive Comparison
- **OpenAI**: Always-on API key auth, no zero-config mode.
API keys are managed through a cloud dashboard and tied to billing — cannot be used
air-gapped.
- **Palantir**: Always-on auth via SSO or LDAP binding.
Complex setup requiring cloud-based identity infrastructure.
No offline fallback.
- **Snowflake**: Always-on auth via cloud console.
Users cannot deploy without authentication.
No air-gapped operation.
## Cost-Benefit Analysis
Cloud vendors charge for auth infrastructure: OpenAI's API keys are free but tied to paid
usage ($0.01-$0.10 per 1K tokens).
Palantir's per-seat licensing ranges from $50k-$100k/user/year for full platform access.
Snowflake charges per user ($2-$40/user/month) for authentication alone.
API-OSS provides unlimited tokens at zero marginal cost.
The time savings are significant: configuring Okta SSO or SAML with competitors takes 2-4
weeks of engineering effort; API-OSS bearer tokens are operational in 30 seconds.
Risk reduction: in an air-gapped deployment, the absence of cloud auth dependency
eliminates an entire class of attack surface — there is no SSO provider to compromise,
no Okta tenant to breach.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Physically secured SCIF deployments where additional auth is unnecessary overhead — the system is deployed on a standalone machine inside a vault.
When tokens are added, the system locks down automatically.
- **Enterprise**: Flexible deployment from fully open (internal engineering tool) to fully locked (customer-facing API) with a single CLI command.
Token generation integrates into existing CI/CD pipelines for automated deployment.
