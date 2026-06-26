---
title: "Row-Level Security (RLS)"
sidebar_position: 99
description: "SQL-level access control that rewrites queries with user/group filters at"
tags: [features]
---

# Row-Level Security (RLS)

## What It Does
SQL-level access control that rewrites queries with user/group filters at
query time.
Works on both SQLite and pgwire protocol, ensuring users only see rows they
are authorized
to access regardless of how they connect to the data layer.
## How It Works
RLS is implemented in the Rust module `ai-oss-gateway/src/abac.rs` in
coordination with
the pgwire handler at `ai-oss-gateway/src/pgwire.rs`.
When a query arrives via the PostgreSQL wire protocol or directly against
the embedded
SQLite engine, the Rust query parser intercepts the SQL AST before
execution.
The ABAC engine evaluates the current user's attributes — org membership,
clearance
level, department, and any custom attributes defined in `opencode.json` —
against the
active RLS policies for each table referenced in the query.
Matching policies inject WHERE clause filters such as `org_id =
current_setting('app.current_org_id')` or `classification_level <=
current_user_classification()`.
The rewritten query is then executed against `data/graph.db` (SQLite WAL),
returning only
authorized rows.
All of this happens within a single binary — the gateway is started via
`api-oss start`
or directly, with configuration driven by `opencode.json`.
The frontend connects via WebSocket to port 3030 and displays query results
through the
HTTP UI on port 8081.
RLS policies themselves are managed via WebSocket messages (`rls_create`,
`rls_update`,
`rls_delete`) and are stored in the graph database with full lineage
tracking.
Every RLS evaluation is recorded in `data/ledger/` in `.aioss` format,
providing a
tamper-proof audit trail of every access control decision.
Because the rewrite is performed in Rust before query execution, there is
no way for a
client to bypass RLS by connecting directly to the database port — the
pgwire handler
always applies policy.
## How to Operate
1.
**Define RLS policies** via the `RulesView` frontend at `https://localhost:8081/rules` or by editing `opencode.json` directly with policy definitions per table.
2.
**Assign user attributes** using `api-oss auth add-user --username alice --attr clearance=secret --attr department=finance`.
The CLI supports 87 commands across 9 subcommand groups.
3.
**Test the policy** by querying as a specific user: open the query editor at `https://localhost:8081/query` and execute `SELECT * FROM sensitive_table`.
The returned rows will be filtered by the active RLS policy.
4.
**Verify via pgwire**: Connect with any PostgreSQL client (e.g., `psql -h localhost -p 5432 -U alice`) and run the same query.
The Rust pgwire handler applies the same policy rewrite.
5.
**Audit access**: Check `data/ledger/` for `.aioss` ledger entries recording every query and the RLS filters that were applied.
6.
**Monitor via CLI**: `api-oss auth log --tail 50` streams recent auth and access decisions including RLS evaluations.
## The Moat
- **Query-level enforcement, not application-level**: RLS is applied in the Rust query planner before the query executes.
There is no middleware, no SQL proxy, no application code that can be
bypassed.
- **Protocol-independent**: The same policies apply whether a user connects via the WebSocket API on port 3030, the pgwire protocol on port 5432, or the embedded SQLite engine directly.
There is one policy engine, enforced everywhere.
- **Air-gapped operation**: All policy evaluation is local.
No cloud dependency for access control — critical for classified
deployments.
- **Tamper-proof audit**: Every RLS-filtered query is logged to `data/ledger/` with `.aioss` cryptographic chaining.
An auditor can verify that every access decision was policy-compliant.
- **Multi-factor policy composition**: RLS policies integrate with the ABAC engine, supporting hierarchical classification labels, org scoping, and custom attribute resolution simultaneously.
- **Single binary**: No separate database server, no middleware, no Docker container — just `api-oss start` running everything.
## Why Choose API-OSS
RLS from cloud vendors like Snowflake forces your data into their cloud
infrastructure.
Self-hosting PostgreSQL with RLS requires a separate RDS or managed
database instance
costing $500-$5,000/mo.
API-OSS delivers RLS as a built-in, zero-cost feature of a single binary
that runs
anywhere — on a laptop, a server in a SCIF, or an edge device.
There is no separate database license, no per-row pricing, and no cloud
dependency.
For multi-tenant deployments where each tenant's data must be strictly
isolated, API-OSS
RLS provides the same guarantees as a dedicated database per tenant without
the
operational overhead.
## Competitive Comparison
- **Snowflake**: RLS available but cloud-only — data must reside in Snowflake's infrastructure.
Per-credit pricing makes row-level filtering expensive at scale.
- **Palantir**: RLS via Foundry, but requires data to be in Palantir's data layer.
Separate licensing tier adds significant cost.
- **OpenAI**: No SQL access, no RLS.
Users cannot query data at all — only interact via chat completions.
- **Anthropic**: No data storage, no RLS.
## Cost-Benefit Analysis
Snowflake RLS requires a Snowflake account ($2k-$20k/mo) plus compute
credits for every
filtered query.
PostgreSQL RLS with a managed cloud provider costs $500-$5,000/mo for the
database
instance alone.
Palantir Foundry RLS is bundled in enterprise contracts that start at
$1M+/yr.
API-OSS provides equivalent RLS at zero additional cost — the feature is
included in the
free, single-binary deployment.
Time savings: configuring RLS in Snowflake or PostgreSQL requires complex
policy SQL and
schema design taking weeks.
API-OSS RLS policies are defined in `opencode.json` with immediate effect
— no schema
migrations, no downtime.
Risk reduction: data cannot be exfiltrated through direct database
connections because the
Rust engine intercepts and rewrites every query.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Multi-level security — users at TOP SECRET, SECRET, and CONFIDENTIAL clearance levels see different rows in the same table, enforced at the database engine level.
- **Enterprise**: Multi-tenant SaaS applications where each customer's data is stored in shared tables but isolated by RLS policy — tenant A's finance team sees only tenant A's invoices.

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ