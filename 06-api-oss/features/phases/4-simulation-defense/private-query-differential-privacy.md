---
title: "Private Query / Differential Privacy"
sidebar_position: 99
description: "Provides differential privacy guarantees for statistical queries on"
tags: [features]
---

# Private Query / Differential Privacy

## What It Does
Provides differential privacy guarantees for statistical queries on
the
knowledge graph. Tracks privacy budget (epsilon consumption),
injects
calibrated noise, and enforces privacy guarantees before returning
results.
Enables privacy-safe data sharing and analysis across instances.

## How It Works
The differential privacy module in
`ai-oss-gateway/src/differential_privacy.rs`
implements a complete privacy budget management system for graph
queries.
The core engine supports two noise mechanisms: Laplace mechanism
(for
epsilon-differential privacy) and Gaussian mechanism (for (epsilon,
delta)-differential privacy). When a query arrives via WebSocket on
port
3030 (`private_query` message), the privacy budget accountant checks
the
requesting user or role's remaining epsilon budget — configured
per-role in
`opencode.json` under `differential_privacy.budgets`. The query is
analyzed
to determine its sensitivity (how much a single individual's data
can affect
the result). Calibrated noise is injected into the query result
based on the
privacy parameter epsilon and the query sensitivity. The composition
theorem
tracks cumulative epsilon consumption across multiple queries —
sequential
queries each consume from the budget, with advanced composition
providing
tighter bounds for repeated queries. Budget can be reset via
`private_budget_reset` (audit-logged). The query noise injector
handles
various graph query types: count queries, sum queries, average
queries,
histogram queries, and more complex graph aggregations. The
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA can assist with
sensitivity
analysis for complex graph queries. All privacy budget consumption
is
recorded with full provenance in the SQLite WAL-backed graph in
`./data/`.
Frontend connects via WebSocket to port 3030. HTTP UI is served on
port
8081. Config is driven by `opencode.json` under the
`differential_privacy`
section with epsilon budgets per role, noise mechanism selection,
and
composition theorem choice.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Configure privacy budgets in `opencode.json` under
   `differential_privacy.budgets` — per-role epsilon limits
3. Submit a statistical query via `private_query` WebSocket message with
   privacy parameters
4. The engine returns the noisy result with: the query answer, epsilon
   consumed, remaining budget, and noise mechanism used
5. Check privacy budget status via `private_budget` WS message
6. Reset a privacy budget (audit-logged operation) via `private_reset` WS
   message
7. Monitor budget consumption across users/roles in the privacy dashboard
8. Configure auto-notification when budgets approach exhaustion
9. Use the CLI: `api-oss privacy query`, `api-oss privacy budget`,
   `api-oss privacy reset`

## The Moat
- Implementing differential privacy correctly — with proper epsilon tracking,
  noise calibration (Laplace/Gaussian mechanisms), and composition
theorems
  — is notoriously difficult
- Integrating this with graph queries so that every query consumes from a
  privacy budget is architecturally complex
- The graph context makes sensitivity analysis more challenging — edge
  relationships affect query sensitivity in ways that flat tables do
not
- Composition theorem tracking ensures privacy guarantees hold across
  arbitrarily many queries
- Full provenance on every privacy budget operation enables complete audit
- No competitor offers graph-integrated differential privacy with epsilon
  budget tracking for local-first deployments

## Why Choose API-OSS
Palantir has no differential privacy — queries expose raw data
with no
privacy guarantees. Google has a differential privacy library
(DPLib) but
no graph-integrated product. API-OSS provides privacy guarantees for
every
statistical query on the knowledge graph, with full epsilon budget
tracking
and calibrated noise injection. For defense and enterprise customers
sharing
data across organizations, this means privacy-safe analysis without
exposing
sensitive underlying data.

## Competitive Comparison
- **Palantir**: No differential privacy; queries expose raw data with no
  privacy guarantees
- **Google**: Differential privacy library (DPLib) but no graph-integrated
  product; cloud-dependent
- **Anthropic**: No differential privacy product
- **Nvidia**: No differential privacy product

## Cost-Benefit Analysis
Building correct differential privacy capabilities costs $500K–$2M
in expert
engineering plus $100K–$300K in privacy auditing. Google Cloud's
DLP (Data
Loss Prevention) charges $0.01–$0.05 per GB scanned. API-OSS
provides
built-in differential privacy at zero software cost — one-time
hardware of
~$3,000. No per-query privacy costs. A defense organization sharing
intelligence data across 10 coalition partners saves $500K–$2M in
custom DP
development. Privacy compliance fines under GDPR/EU AI Act can
exceed $20M
— API-OSS's DP guarantees reduce this risk to near zero.

## Applications
- **Consumer**: Private personal analytics, protecting query privacy on
  personal data
- **Government / Defense**: Privacy-preserving intelligence queries, PII
  protection, coalition data sharing with source protection
- **Enterprise**: GDPR-compliant analytics, privacy-safe data sharing,
  customer analytics without PII exposure

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
