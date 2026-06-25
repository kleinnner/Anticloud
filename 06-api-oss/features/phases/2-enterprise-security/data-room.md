---
title: "Data Room"
sidebar_position: 99
description: "Secure virtual data room for mergers, acquisitions, audits, and cross-organization"
tags: [features]
---

# Data Room

## What It Does
Secure virtual data room for mergers, acquisitions, audits, and cross-organization
collaboration.
Provides time-limited, revocable access to specific codices with full audit logging of
every view and query — enabling due diligence without compromising data control.
## How It Works
The Data Room is implemented in the Rust engine at `ai-oss-gateway/src/`.
When an operator creates a data room via `dataroom_create` over WebSocket to port 3030,
the engine creates an ephemeral access scope in the graph database (`data/graph.db` SQLite
WAL) that references specific codices, documents, or graph nodes.
Access is granted with a time window (`valid_from`, `valid_until`), optional max queries
limit, and assigned to specific external users (who receive bearer tokens generated via
`api-oss auth generate`).
The critical architectural guarantee: data room access is enforced at the Rust graph
engine level, not at the application layer.
When a data room is created, the engine stores an access grant record that the query
pipeline checks on every graph read operation.
If the time window expires or the operator sends `dataroom_revoke`, the engine atomically
removes the access grant — no stale sessions, no cached data accessible after
revocation.
There is no timeout-based expiry that can race with a running query; the check is
synchronous in the query path.
Every query within a data room is logged with user, timestamp, exact graph access, and
query parameters — recorded in the immutable ledger at `data/ledger/` in `.aioss`
format.
The HTTP UI on port 8081 renders the `DataRoomView` for creating and managing data rooms,
viewing the activity log, and generating access reports.
The CLI (`api-oss dataroom create`, `api-oss dataroom list`, `api-oss dataroom revoke`)
provides terminal management as part of 87 CLI commands across 9 subcommand groups (auth,
service, sync, backup, etc.).
Configuration for data room defaults (max duration, max queries, notification settings) is
driven by `opencode.json`.
The gateway runs as a single binary via `api-oss start`, fully air-gapped with no internet
— critical for M&A due diligence where documents must never leave the controlled
network.
## How to Operate
1.
**Create a data room**: Open `https://localhost:8081/dataroom` and click "New Data Room".
Select the codices and documents to include, set access start/end times, and generate
access tokens for external users.
2.
**Invite external users**: Share the generated bearer token and WebSocket URL (`wss://<instance>:3030?token=<token>`).
External users connect via the API-OSS frontend or direct WebSocket.
3.
**Monitor activity**: The data room dashboard shows live queries, connected users, and remaining time/quota.
All activity is streamed in real time via WebSocket.
4.
**Revoke access**: Click "Revoke" — access is terminated atomically in the Rust engine.
The external user's next query returns an access denied error.
5.
**Export audit log**: `api-oss dataroom audit --id DR-001 --format pdf` generates a complete access report for the due diligence record.
6.
**Expire automatically**: Data rooms automatically expire at `valid_until`.
The engine removes access grants without operator action.
7.
**Audit**: Check `data/ledger/` for complete data room lifecycle with cryptographic proof.
## The Moat
- **Engine-level enforcement, not application-level**: Access grants are checked in the Rust graph query pipeline.
There is no middleware, no session cache to clear, no application restart needed.
Revocation is atomic and immediate.
- **Synchronous access check**: Every query checks the access grant synchronously before execution.
There is no race condition where a query could execute after revocation.
- **No data movement**: Data room access grants access to the existing data in place.
No data is ever copied, exported, or moved — eliminating the most common data leakage
vector in virtual data rooms.
- **Full query-level audit**: Every graph read operation within a data room is logged with query parameters.
An auditor can verify exactly what the external user accessed.
- **Tamper-proof audit trail**: All data room events are recorded in `data/ledger/` with SHA-256 cryptographic chaining.
- **Air-gapped operation**: Data rooms work fully offline.
External users connect directly to the API-OSS instance — no cloud relay, no third-party
data room provider.
## Why Choose API-OSS
Traditional virtual data room providers (Intralinks, Box, Merrill) charge $15k-$50k per
deal and require data to be uploaded to their servers — the data leaves your control.
OpenAI and Anthropic have no data room concept.
Palantir Foundry can be configured for data room-like access but requires cloud
deployment.
API-OSS provides secure data room capabilities as a built-in feature at zero additional
cost — data never leaves the instance, access is enforced at the engine level, and the
immutable audit trail satisfies the most demanding due diligence requirements.
## Competitive Comparison
- **OpenAI**: No data room concept — no multi-user access controls for document review.
- **Palantir**: Data rooms via Foundry, separate licensing tier.
Requires cloud deployment — data must leave your network for the data room.
- **Snowflake**: No virtual data room — data sharing requires full table copies.
- **Anthropic**: No data room.
## Cost-Benefit Analysis
Traditional virtual data room providers charge $15k-$50k per M&A deal.
For a company doing 5-10 deals per year, that is $75k-$500k annually in data room costs.
Building a custom data room solution costs $100k-$200k in development plus ongoing
infrastructure.
API-OSS provides complete data room functionality at zero additional cost.
Time savings: data rooms are created in minutes, not days — no onboarding, no data
upload, no third-party platform setup.
Risk reduction: data never leaves your infrastructure — eliminating the primary data
breach risk in M&A due diligence (third-party data room provider compromise).
## Applications
- **Consumer**: N/A
- **Government / Defense**: Secure document review for classified contract bidding — contractors review solicitation documents in a time-limited data room with full audit logging.
Revocation is atomic when the bidding window closes.
- **Enterprise**: M&A due diligence with time-boxed access for external auditors — the target company grants the acquiring company's auditors access to specific financial codices for a limited period with full query-level audit.

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
