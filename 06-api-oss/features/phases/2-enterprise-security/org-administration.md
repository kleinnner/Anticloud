---
title: "Org Administration"
sidebar_position: 99
description: "Multi-organization management with hierarchical org structure and full data isolation."
tags: [features]
---

# Org Administration

## What It Does
Multi-organization management with hierarchical org structure and full data isolation.
Each organization can have its own codices, users, roles, rules, constitution, and
configuration — completely isolated from other organizations on the same instance.
## How It Works
Org administration is implemented in the Rust module `ai-oss-gateway/src/orgs.rs`.
The org engine manages a tree of organizations where each org has a unique ID, name,
parent (for hierarchical nesting), and a set of configuration overrides that inherit from
parent orgs.
Data isolation is enforced at the graph engine level in Rust — every query to
`data/graph.db` (SQLite WAL) includes an org scope filter that is atomic with the query
execution.
When a user authenticates (via bearer token from `api-oss auth generate`, SAML, OIDC, or
LDAP), the auth module resolves their org membership.
Every subsequent WebSocket message on port 3030 and every HTTP request on port 8081
includes the org context.
The Rust engine passes the org ID through the query pipeline, ensuring that graph
mutations, rule evaluations, and constitution enforcement operate only within the user's
authorized org scope.
Cross-org data leakage is structurally impossible because the org filter is part of the
database access path, not an application-layer check.
Org hierarchy enables parent orgs to define shared rules and constitutions that child orgs
inherit with optional overrides.
The CLI (`api-oss org create`, `api-oss org list`, `api-oss org add-user`, `api-oss org
remove-user`) provides terminal-based management as part of the 87 CLI commands across 9
subcommand groups (auth, service, sync, backup, etc.).
WebSocket messages (`org_create`, `org_list`, `org_delete`, `org_add_user`,
`org_remove_user`, `org_grant_access`) enable programmatic management.
The `OrgAdminView` frontend renders an org tree browser with member management and usage
quotas.
Configuration for org structure is persisted in `opencode.json` with overrides at each org
level.
Background sync with external identity providers (LDAP, SAML, OIDC) maps directory groups
to org roles.
All org operations are recorded in the immutable ledger at `data/ledger/` in `.aioss`
format.
The entire system runs as a single binary via `api-oss start`, fully air-gapped with no
internet required.
## How to Operate
1.
**Create a root org**: `api-oss org create --name "Acme Corp"` or via `OrgAdminView` at `https://localhost:8081/admin/orgs`.
2.
**Create child orgs**: `api-oss org create --name "Engineering" --parent "Acme Corp"` for hierarchical structure.
3.
**Add users**: `api-oss auth add-user --username alice --org "Engineering" --role editor`.
The user now operates only within the Engineering org scope.
4.
**Configure org overrides**: Edit `opencode.json` under `orgs.Engineering` to set org-specific model parameters, rule sets, or constitution principles.
5.
**Grant cross-org access**: `api-oss org grant-access --from "Engineering" --to "Finance" --resource codex:budget_2025` for limited data sharing.
6.
**Monitor org usage**: The `OrgAdminView` shows per-org usage metrics, active users, and storage in `data/graph.db`.
7.
**Audit**: Check `data/ledger/` for `.aioss` entries recording every org administration action with cryptographic proof.
## The Moat
- **Engine-level isolation, not application-level**: Org scope is enforced in the Rust graph engine query path.
There is no middleware or proxy that can be bypassed.
Cross-org data leakage is structurally impossible.
- **Hierarchical inheritance**: Parent orgs define shared policies that child orgs inherit.
Changes propagate instantly — no batch sync or replication delay.
- **Atomic scope enforcement**: The org filter is part of every database query.
Adding a user to an org immediately scopes their access — no policy cache to expire, no
session to refresh.
- **Complete air-gap**: Org administration, user management, and data isolation all operate locally.
No cloud identity provider required.
- **Immutable audit trail**: Every org operation is recorded in `data/ledger/` with SHA-256 cryptographic chaining.
An auditor can verify the complete org structure history.
- **Single binary**: The org engine is compiled into the same `api-oss` binary.
No separate identity service, no directory sync daemon.
## Why Choose API-OSS
Cloud AI platforms like OpenAI provide only single-organization — every user in the same
workspace sees the same data.
Palantir Foundry offers multi-org but requires cloud deployment with complex setup and
per-org licensing costs that scale linearly.
Snowflake's multi-account model requires separate accounts for each org ($2k-$20k/mo
each).
API-OSS provides unlimited orgs on a single binary at zero additional cost.
Org isolation is enforced at the Rust engine level, providing stronger guarantees than
competing solutions that rely on application-layer filtering.
For enterprises with multi-department or multi-subsidiary needs, API-OSS delivers
enterprise-grade org administration as a built-in feature.
## Competitive Comparison
- **OpenAI**: Single organization — no multi-tenant administration.
All users share the same workspace and data.
- **Palantir**: Multi-org via Foundry, but requires cloud deployment.
Per-org licensing adds significant cost.
Org setup requires Palantir consulting engagement (weeks to months).
- **Snowflake**: Multi-org via separate accounts, each with its own compute and storage costs ($2k-$20k/mo minimum each).
No hierarchical org structure.
- **Anthropic**: Single workspace — no org administration.
## Cost-Benefit Analysis
Cloud vendors charge per-organization: Snowflake accounts start at $2k/mo each, Palantir
Foundry per-org licenses can add $100k-$500k/year.
API-OSS provides unlimited orgs at zero marginal cost.
Time savings: configuring Palantir or Snowflake for multi-org takes 4-8 weeks of
architecture work; API-OSS orgs are created in seconds via CLI.
Risk reduction: engine-level isolation prevents the most common data breach scenario in
multi-tenant systems — application-layer access control bypass.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Separate orgs for different intelligence agencies (CIA, NSA, DIA) running on shared infrastructure with strict data isolation.
Cross-org access grants enable controlled collaboration on joint operations.
- **Enterprise**: Multi-department (Engineering, Finance, HR, Legal) management with full isolation — HR data visible only to HR users, even though all orgs run on the same single binary instance.
Multi-subsidiary management for holding companies.

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com