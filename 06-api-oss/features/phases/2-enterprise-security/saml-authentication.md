---
title: "SAML Authentication"
sidebar_position: 99
description: "Enterprise SAML 2.0 authentication with full metadata exchange."
tags: [features]
---

# SAML Authentication

## What It Does
Enterprise SAML 2.0 authentication with full metadata exchange.
Compatible with ADFS, Okta, Azure AD, Keycloak, and any standards-compliant SAML identity
provider — providing single sign-on for enterprise users through their existing identity
infrastructure.
## How It Works
SAML authentication is implemented in the Rust module `ai-oss-gateway/src/saml.rs`.
The SAML implementation is pure Rust with no external XML parsing dependencies — SAML
assertions are parsed and validated using the `quick-xml` crate for XML parsing and
`rsa`/`sha2` for signature verification.
The SAML flow is initiated when a user clicks "Login with SSO" on the HTTP UI at
`https://localhost:8081/login`.
The gateway generates a SAML Authentication Request (AuthnRequest), signs it (if
configured), and redirects the user to the IdP's Single Sign-On URL.
The IdP authenticates the user (via their existing credentials, MFA, or other configured
policies) and posts a SAML Assertion to the gateway's Assertion Consumer Service (ACS) URL
at `https://<host>:8081/auth/saml/acs`.
The Rust engine validates the assertion: signature verification using the IdP's public
certificate (loaded from `opencode.json` or fetched from the IdP's metadata URL), audience
restriction check (the assertion's `AudienceRestriction` must match the gateway's entity
ID), recipient check (the assertion's `SubjectConfirmationData Recipient` must match the
ACS URL), time-window check (assertion's `NotBefore` and `NotOnOrAfter` conditions), and
one-time use check (assertion ID is recorded to prevent replay).
After validation, the user's attributes (typically `NameID`, email, groups) are extracted
and mapped to API-OSS roles using configurable attribute mappings in `opencode.json`.
The CLI (`api-oss auth saml metadata` — exports SP metadata XML for IdP configuration)
provides terminal management as part of 87 CLI commands across 9 subcommand groups (auth,
service, sync, backup, etc.).
WebSocket to port 3030 handles the SAML authentication status updates — when the browser
completes the SAML flow, the WebSocket connection is established with the authenticated
session.
SAML configuration is driven by `opencode.json` under `saml.*` — including IdP metadata
URL or XML, SP entity ID, ACS URL, signing certificate, and attribute mapping rules.
All SAML authentication events are recorded in the immutable ledger at `data/ledger/` in
`.aioss` format.
The gateway runs as a single binary via `api-oss start` and supports fully air-gapped
operation — the IdP must be reachable on the local network, but no internet is required
if the IdP metadata and certificates are loaded from local configuration.
## How to Operate
1.
**Configure the IdP**: In `opencode.json`, set `saml.idp.metadata_url: "https://idp.corp.com/FederationMetadata/2007-06/FederationMetadata.xml"` or provide the metadata XML directly as `saml.idp.metadata_xml`.
2.
**Export SP metadata**: Run `api-oss auth saml metadata` to get the gateway's SAML SP metadata XML.
Import this into your IdP (ADFS, Okta, Azure AD) to configure the relying party trust.
3.
**Configure attribute mapping**: In `opencode.json`, set `saml.attribute_mapping.name_id: "username"`, `saml.attribute_mapping.groups: "memberOf"`, and `saml.role_mapping.CN=AI-Admins,OU=Groups,DC=corp,DC=com: "admin"`.
4.
**Test authentication**: Open `https://localhost:8081/login` and click "Login with SSO".
You are redirected to the IdP, authenticate, and are redirected back with an authenticated
session.
5.
**Monitor SAML events**: The HTTP UI at `https://localhost:8081/admin/auth` shows recent SAML authentication events with success/failure status.
6.
**Audit**: Check `data/ledger/` for `.aioss` entries recording every SAML authentication with assertion ID, user, and outcome.
## The Moat
- **Pure Rust SAML implementation**: SAML assertion validation is pure Rust with no dependency on OpenSSL or external XML parsers.
Signature verification, audience restriction, time-window checks — all implemented
natively.
- **No external XML parsing libraries**: XML parsing uses `quick-xml`, a safe Rust XML parser.
No XSLT, no XPath, no XML External Entity (XXE) processing — eliminating the most common
SAML parser vulnerabilities.
- **Full assertion validation**: Audience restriction, recipient check, time-window, signature verification, and one-time use prevention are all enforced.
Expired or replayed assertions are rejected.
- **Offline IdP metadata**: IdP metadata and certificates can be loaded from local configuration files — no dependency on IdP metadata URL resolution during authentication.
- **Attribute-based role mapping**: SAML attributes (group memberships, roles) are mapped to API-OSS RBAC roles automatically — no separate user provisioning.
- **Immutable audit trail**: Every SAML authentication event is recorded in `data/ledger/` with cryptographic proof.
## Why Choose API-OSS
OpenAI provides no SAML support.
Palantir supports SAML but requires cloud-based Foundry deployment — the SAML flow must
route through Palantir's infrastructure.
Snowflake supports SAML but only through its cloud console.
API-OSS provides pure Rust SAML 2.0 authentication that works entirely on-premises.
For US federal deployments where ADFS integration is mandatory, and for any enterprise
with existing SAML-based identity infrastructure, API-OSS integrates without cloud
dependencies.
## Competitive Comparison
- **OpenAI**: No SAML support — OpenID Connect only.
Organizations with SAML-only identity infrastructure (ADFS, legacy Okta) cannot integrate.
- **Palantir**: SAML supported but requires cloud Foundry deployment — SAML traffic must route through Palantir's cloud.
No offline or air-gapped SAML support.
- **Snowflake**: SAML via cloud console only.
Requires Snowflake cloud infrastructure.
- **Anthropic**: No SAML support.
## Cost-Benefit Analysis
SAML integration middleware (Okta, Azure AD) costs $2-$15/user/month.
For a 1,000-user organization, this is $24k-$180k/year.
Building custom SAML integration in-house requires 3-6 months of engineering and a
security audit ($50k-$100k).
API-OSS provides production-grade, pure Rust SAML 2.0 authentication at zero additional
cost.
Time savings: 3-6 months of SAML integration development eliminated.
Risk reduction: the pure Rust implementation eliminates the most common SAML security
vulnerabilities — XML signature wrapping attacks, XXE processing, and XSLT injection —
that have affected numerous SAML libraries in other languages.
## Applications
- **Consumer**: N/A
- **Government / Defense**: ADFS integration is mandatory for US federal deployments — most federal agencies use Active Directory Federation Services for single sign-on.
API-OSS SAML integration works with ADFS on-premises with no cloud dependency.
- **Enterprise**: Okta/Azure AD SAML federation with existing HR identity stores — employees authenticate with their corporate credentials via their existing SAML IdP, and their directory group memberships automatically determine their roles in the AI system.

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
