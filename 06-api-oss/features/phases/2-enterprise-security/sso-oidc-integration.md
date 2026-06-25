---
title: "SSO / OIDC Integration"
sidebar_position: 99
description: "Enterprise single sign-on compatible with any OpenID Connect provider — Okta, Azure AD,"
tags: [features]
---

# SSO / OIDC Integration

## What It Does
Enterprise single sign-on compatible with any OpenID Connect provider — Okta, Azure AD,
Keycloak, Google Workspace, Auth0, and any OIDC-compliant identity provider.
Supports full offline fallback when the identity provider is unreachable — ensuring AI
operations continue during network outages.
## How It Works
OIDC integration is implemented in the Rust module `ai-oss-gateway/src/sso.rs`.
The implementation follows the OpenID Connect Core 1.0 specification using pure Rust
libraries.
When a user initiates login at `https://localhost:8081/login`, the gateway generates an
OIDC Authentication Request with `response_type=code`, `scope=openid profile email`, and a
unique `state` value (for CSRF protection) and `nonce` (for replay protection).
The user is redirected to the IdP's authorization endpoint.
After authentication, the IdP redirects back with an authorization code.
The gateway exchanges the code for ID and access tokens at the IdP's token endpoint.
The ID token is validated: signature verification using the IdP's JWKS (fetched and
cached), issuer check (`iss` claim must match the configured issuer), audience check
(`aud` claim must include the configured client ID), nonce check (must match the original
request), and expiration check.
Token validation results are cached in memory with a configurable TTL (`oidc.cache_ttl:
300` seconds) to reduce IdP traffic.
The unique architectural differentiator is the offline fallback mechanism.
Most SSO implementations fail when the IdP is unreachable — users cannot authenticate
and existing sessions cannot be validated.
API-OSS caches validated session tokens locally in `data/graph.db` (SQLite WAL) with their
original TTL.
If the IdP is unreachable during token validation, the gateway falls back to the local
cache, validating the token against the cached JWKS and checking the local session
database.
For emergency access during extended IdP outages, a configurable `oidc.emergency_bypass`
in `opencode.json` allows designated admin users to authenticate with a local bearer token
(generated via `api-oss auth generate`) when the IdP is down.
The CLI (`api-oss auth sso-status` — check provider connectivity and cached sessions,
`api-oss auth sso-emergency` — generate emergency access token) provides management as
part of 87 CLI commands across 9 subcommand groups (auth, service, sync, backup, etc.).
SSO configuration — provider URL, client ID, client secret (stored in the encrypted
secrets store), scopes, optional CA certificate for air-gapped deployments — is driven
by `opencode.json`.
The HTTP UI on port 8081 renders SSO status and session information.
All OIDC authentication events are recorded in the immutable ledger at `data/ledger/` in
`.aioss` format.
The gateway runs as a single binary via `api-oss start`, with the offline fallback
ensuring continuous operation during network disruptions.
## How to Operate
1.
**Configure OIDC**: In `opencode.json`, set `oidc.provider_url: "https://okta.corp.com/oauth2/default"`, `oidc.client_id: "abc123"`, and `oidc.client_secret_secret: "okta_client_secret"` (referencing a secret in the secrets store).
2.
**Set up the redirect URI**: Register `https://<host>:8081/auth/oidc/callback` as the redirect URI with your IdP.
3.
**Test SSO login**: Open `https://localhost:8081/login` and click "Login with SSO".
You are redirected to your IdP, authenticate, and return authenticated.
4.
**Check SSO status**: `api-oss auth sso-status` shows IdP connectivity, cached session count, and JWKS cache status.
5.
**Simulate offline**: Disconnect the network — existing sessions continue to work.
New login attempts use the emergency bypass if configured.
6.
**Configure emergency bypass**: In `opencode.json`, set `oidc.emergency_bypass_users: ["admin"]` — these users can authenticate with a bearer token during IdP outages.
7.
**Audit**: Check `data/ledger/` for `.aioss` entries recording every OIDC authentication and cached session validation.
## The Moat
- **Offline fallback with local session cache**: Cached session tokens and JWKS enable authentication validation during IdP outages.
Most SSO implementations completely fail when the IdP is unreachable.
- **Emergency bypass for extended outages**: Designated admin users can authenticate with local bearer tokens when the IdP is down for extended periods — ensuring AI system operations never halt.
- **Pure Rust OIDC implementation**: All OIDC flows — discovery, token exchange, JWKS fetching and validation — are implemented natively in Rust.
No external OAuth/OIDC library dependencies.
- **Nonce and state protection**: Replay attacks are prevented by nonce validation.
CSRF attacks are prevented by state parameter validation.
- **Cached JWKS with automatic refresh**: The IdP's JSON Web Key Set is fetched and cached locally.
Token signature verification works even if the IdP is unreachable at the time of
verification.
- **Immutable audit trail**: Every authentication event — online and offline — is recorded in `data/ledger/` with cryptographic proof.
## Why Choose API-OSS
Palantir's SSO requires cloud connection for auth validation — there is no offline
fallback.
OpenAI's SSO is available only on the Enterprise plan and has no offline mode.
Snowflake's SSO requires cloud connectivity.
API-OSS is the only AI platform that provides SSO with a true offline fallback — cached
sessions and emergency local authentication ensure the AI system remains operational
during network disruptions.
For deployments in locations with unreliable connectivity — ships, forward operating
bases, remote industrial sites — this is a critical differentiator.
## Competitive Comparison
- **Palantir**: SSO requires cloud connection for auth validation — no offline fallback.
IdP outage means system is inaccessible.
- **OpenAI**: SSO available only on Enterprise plan.
No offline mode — internet connectivity is required for all authentication.
- **Snowflake**: SSO requires cloud connectivity.
No offline authentication capability.
- **Anthropic**: SSO via OIDC but requires internet connectivity.
No offline fallback.
## Cost-Benefit Analysis
Downtime from SSO provider outages costs enterprises an average of $5,600/minute (IDC
2023).
For an AI system supporting critical operations, IdP unavailability can halt all
decision-making.
API-OSS's offline fallback eliminates this risk — the system continues operating with
cached sessions and emergency bypass.
The cost of implementing a similar offline auth mechanism is 3-6 months of engineering.
API-OSS provides this at zero additional cost.
Risk reduction: SSO provider outages (Okta's 2022 breach, Azure AD outages) no longer
affect the AI system's availability.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Required for classified networks where the IdP may be segmented behind different classification boundaries — a ship at sea may lose connectivity to the shore-based IdP for days.
API-OSS OIDC with offline fallback ensures the AI system remains operational throughout
the mission.
- **Enterprise**: Okta/Azure AD single sign-on with zero-trust network tolerance — branch offices with unreliable WAN links can continue using the AI system even when the corporate SSO provider is temporarily unreachable.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
