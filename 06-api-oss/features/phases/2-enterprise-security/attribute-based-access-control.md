---
title: "Attribute-Based Access Control (ABAC)"
sidebar_position: 99
description: "Evaluates access policies at query time based on user attributes, classification levels,"
tags: [features]
---

# Attribute-Based Access Control (ABAC)

## What It Does
Evaluates access policies at query time based on user attributes, classification levels,
codex scoping, and environmental conditions.
Supports hierarchical classification labels (TOP SECRET, SECRET, CONFIDENTIAL), dynamic
attribute resolution (group membership, department, clearance level), and fine-grained
resource conditions.
## How It Works
ABAC is implemented in the Rust module `ai-oss-gateway/src/abac.rs`.
Policy evaluation runs in the Rust query planner — before any data is retrieved from
`data/graph.db` (SQLite WAL) or returned over WebSocket to port 3030.
This means access control is atomic with data retrieval and cannot be bypassed by
connecting through a different interface (pgwire, HTTP API, direct SQLite access).
ABAC policies are JSON documents with subject/action/resource/condition tuples.
A policy statement reads: "Allow subject with attribute `clearance >= SECRET` to perform
action `read` on resource with attribute `classification <= SECRET`." Subject attributes
are resolved from the authenticated user's session: clearance level (from LDAP/SAML/OIDC
attribute mapping or local RBAC), org membership (from org administration), department,
role, and custom attributes defined in `opencode.json`.
Resource attributes are resolved from the graph metadata: classification label, owner org,
codex membership, data sensitivity tag, and custom tags.
Environmental conditions can include: time of day (allow access only during business
hours), location (from IP or network segment), and device trust level (from TPM
attestation status).
The policy evaluation engine supports: hierarchical classification (TOP SECRET > SECRET >
CONFIDENTIAL > UNCLASSIFIED), multi-attribute conditions (AND/OR/NOT combinations),
resource hierarchy inheritance (a codex's classification applies to all codices within
it), and attribute-based row filtering (return only rows where `org_id = user.org_id` —
integrating with Row-Level Security).
Policies are evaluated in the Rust query planner, not in SQL or application middleware.
The HTTP UI on port 8081 renders the ABAC policy editor as part of the governance
dashboard.
CLI commands (`api-oss abac policy list`, `api-oss abac policy test --user alice
--resource codex:finance --action read`) provide terminal management as part of 87 CLI
commands across 9 subcommand groups (auth, service, sync, backup, etc.).
All ABAC evaluations are recorded in the immutable ledger at `data/ledger/` in `.aioss`
format.
Configuration is driven by `opencode.json`.
The gateway runs as a single binary via `api-oss start`, fully air-gapped.
## How to Operate
1.
**Define attributes**: In `opencode.json`, define user attribute sources and resource attribute schema under `abac.attributes`.
2.
**Create policies**: Use the ABAC policy editor at `https://localhost:8081/abac` or write JSON policy documents.
Example: `{"effect": "deny", "subject": {"clearance": "UNCLASSIFIED"}, "action": "read",
"resource": {"classification": "SECRET"}}`.
3.
**Test a policy**: `api-oss abac policy test --user alice --resource codex:financial_reports --action read` shows whether access is allowed or denied and which policy matched.
4.
**Set user attributes**: User attributes are resolved from the identity provider (LDAP/SAML/OIDC) or set manually via `api-oss auth add-user --attr clearance=SECRET`.
5.
**Set resource attributes**: Resource attributes are set when creating codices or importing documents — classification labels are inherited through the codex hierarchy.
6.
**View evaluation traces**: The ABAC dashboard shows the evaluation path for any access decision — which policies were evaluated, which matched, and whether access was allowed or denied.
7.
**Audit**: Check `data/ledger/` for `.aioss` entries recording every ABAC evaluation with full attribute context.
## The Moat
- **Query planner integration, not middleware**: Policy evaluation runs in the Rust query planner.
There is no SQL proxy, no middleware layer, no application code that can be bypassed by
connecting directly to the database.
- **Atomic with data retrieval**: Access control and data retrieval are the same atomic operation.
There is no race condition where data could be retrieved before the access control check
completes.
- **Hierarchical classification**: Classification labels enforce ordering — a user with SECRET clearance cannot access TOP SECRET data, but can access CONFIDENTIAL data.
The hierarchy is enforced in the evaluation engine.
- **Multi-attribute composition**: Policies can combine subject, resource, and environmental attributes with AND/OR/NOT logic.
A policy can require "clearance >= SECRET AND department == finance AND time between
9AM-5PM."
- **Attribute inheritance**: Resources inherit attributes from their parent codex.
Setting a classification on a parent codex automatically applies to all child codices.
- **Full audit trail**: Every ABAC evaluation — allowed and denied — is recorded in `data/ledger/` with the full attribute snapshot.
## Why Choose API-OSS
Snowflake offers RLS but requires cloud-hosted infrastructure with no offline fallback.
Palantir ABAC requires Foundry cloud deployment.
OpenAI has no access control model — it is a single-user system.
API-OSS provides production-grade ABAC as a built-in feature of the single binary at zero
additional cost.
The query-planner-level enforcement provides stronger guarantees than any middleware-based
solution.
For organizations that need fine-grained, attribute-based access control with hierarchical
classification — government agencies, defense contractors, multi-tenant enterprises —
API-OSS delivers enterprise access control that cloud platforms cannot match.
## Competitive Comparison
- **Snowflake**: Row-level security exists but requires cloud-hosted Snowflake warehouse.
No offline fallback — policies cannot be evaluated without cloud connectivity.
No hierarchical classification support.
- **Palantir**: ABAC available but tied to Foundry cloud deployment.
Policy evaluation requires cloud-mediated access.
No local policy engine.
- **OpenAI**: No ABAC — single-user model, no attribute-based access control.
Every user with an API key has the same access.
- **Anthropic**: No ABAC — stateless API, no access control model.
## Cost-Benefit Analysis
Enterprise ABAC solutions (Axiomatics, NextLabs) cost $50k-$200k+/year and require
integration with existing systems.
Building custom ABAC in a database layer requires 4-8 months of engineering.
Cloud vendors bundle basic access controls in platform costs but require premium tiers for
ABAC.
API-OSS provides comprehensive ABAC with hierarchical classification at zero additional
cost.
Time savings: 4-8 months of access control development eliminated.
Risk reduction: query-planner-level enforcement prevents the most common data breach
vector in multi-tenant systems — application-layer access control bypass.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Classified (TOP SECRET, SECRET, CONFIDENTIAL) label enforcement per document — a user with SECRET clearance can create and read SECRET and CONFIDENTIAL documents but cannot access TOP SECRET documents.
Classification labels propagate through the codex hierarchy automatically.
- **Enterprise**: Geography-based access controls (EU users can access EU customer data only), department-level scoping (Finance users see only Finance codices), project-based access (users assigned to Project X see only Project X data).

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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
