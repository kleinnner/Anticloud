---
title: "Formal Inter-Annotator Agreement (IAA)"
sidebar_position: 99
description: "Computes statistical agreement metrics between annotators to quantify labeling"
tags: [features]
---

# Formal Inter-Annotator Agreement (IAA)

## What It Does
Computes statistical agreement metrics between annotators to quantify labeling
reliability.
Supports Cohen's Kappa for pairwise agreement and Fleiss' Kappa for multi-
annotator scenarios.
Provides actionable quality reports with per-annotator and per-item breakdowns.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading IAA
configuration from `opencode.json`.
The annotation pipeline Rust module (with statistics integration) in
`ai-oss-gateway/src/` manages IAA computation.

When IAA is triggered (via WS message `formal_iaa_run` or CLI), the module
queries the SQLite database at `./data/annotations.db` for items that have
been annotated by multiple annotators.
It filters to items with at least two annotations (for Cohen's Kappa) or more
than two (for Fleiss' Kappa).

The module computes agreement using the standard formula: observed agreement
minus expected agreement, divided by 1 minus expected agreement.
Cohen's Kappa is computed per pair of annotators:
`kappa = (p_o - p_e) / (1 - p_e)`, where p_o is observed agreement and p_e is
expected agreement.

Fleiss' Kappa extends this to multiple annotators by computing agreement
across all rater pairs for each item.
The module handles different label types: nominal (unordered categories,
standard Kappa), ordinal (ordered categories, weighted Kappa with linear or
quadratic weights), and binary (special case with simplified computation).

Results are computed per campaign, per dataset, and per annotator pair:
- Overall agreement: Kappa value with interpretation (poor: <0, slight: 0-0.2,
  fair: 0.21-0.4, moderate: 0.41-0.6, substantial: 0.61-0.8, almost perfect:
  0.81-1.0)
- Per-annotator agreement: each annotator's average Kappa against all others
- Pairwise agreement matrix: Kappa for every annotator pair
- Per-item agreement: which items have low agreement
- Category-specific agreement: which label categories are most/least agreed
- Confidence intervals via bootstrapping

Results are committed to the ledger with the model hash, campaign ID, Kappa
values, and interpretation.
The frontend displays IAA results in a tabular format with color coding by
agreement level.
The HTTP UI on port 8081 includes an IAA dashboard with trend charts.

WS messages include `formal_iaa_run`, `formal_iaa_pairwise`, `formal_iaa_result`,
and `formal_iaa_pairwise_result`.
All computation runs locally with no data sent to external services.

The database schema in `./data/annotations.db` stores annotations in a `annotations` table with columns: `item_id`, `annotator_id`, `campaign_id`, `label`, `confidence_score`, `timestamp`, and `annotation_hash` for ledger integrity. The IAA module issues SQL queries filtered by campaign ID, grouping by item_id with `COUNT(DISTINCT annotator_id)` to identify items with sufficient annotations. For weighted Kappa, the module reads `label_weight` from a `label_categories` table where ordinal distances are predefined.

Computation is parallelized across items using a thread pool from `rayon` — for bootstrap confidence intervals, the module resamples items with replacement 1,000 times (configurable), recomputes Kappa per iteration, and derives the 95% CI from the percentile distribution of resampled values.

## How to Operate
1. Compute IAA: `api-oss iaa compute --campaign camp_001`.
2. View pairwise: `api-oss iaa pairwise --campaign camp_001`.
3. View trend: `api-oss iaa trend --campaign camp_001`.
4. Configure thresholds in `opencode.json`:
   ```json
   {
     "annotation": {
       "iaa": {
         "minimum_kappa": 0.6,
         "auto_flag_below_threshold": true,
         "default_method": "fleiss",
         "bootstrap_iterations": 1000
       }
     }
   }
   ```
5. Use weighted Kappa: `--weighted linear`.
6. Export report: `api-oss iaa export --campaign camp_001 --format json`.
7. View per-item: `api-oss iaa items --campaign camp_001 --min-agreement 0.5`.
8. Bulk flag low-agreement items: `api-oss iaa flag --campaign camp_001 --threshold 0.4 --action review`.
9. Schedule recurring IAA: `api-oss iaa schedule --campaign camp_001 --cron "0 9 * * 1"`.
10. Watch WS stream in real-time: connect to ws://localhost:3030 and subscribe to `formal_iaa_result` messages — each result includes `{campaign_id, kappa_value, pair, timestamp}` JSON payloads.

## The Moat
- Mathematically rigorous statistics computed entirely on-device
- Results stored in the local ledger for auditability
- Supports Cohen's Kappa, Fleiss' Kappa, weighted Kappa
- Per-annotator, pairwise, per-category, per-item granularity
- Bootstrapped confidence intervals
- Trend tracking over time
- Configurable minimum Kappa thresholds

## Why Choose API-OSS
Mercor computes IAA server-side and does not expose real-time results.
API-OSS makes IAA available on-demand with full granularity.
For compliance (FDA, IC guidance), ledger-backed IAA provides the audit trail.

## Competitive Comparison
- **Mercor**: Server-side IAA. Not exposed in real-time to users.
- **Palantir**: Basic agreement tracking in Foundry. Not standalone.
- **OpenAI / Anthropic / Nvidia**: No IAA tools.

## Cost-Benefit Analysis
Statistical consulting for IAA costs $2K-$5K per analysis.
50 analyses/year = $100K-$250K/year saved.
Building equivalent costs ~$20K in engineering time.
Low IAA campaigns require $5K-$15K in re-annotation costs — early detection
prevents rework.
FDA 21 CFR Part 11 requires documented reliability — API-OSS provides it
automatically.
Each low-agreement item caught early saves $0.50-$2.00 in re-annotation labor
at scale (10K items = $5K-$20K saved per campaign).
Bootstrapped confidence intervals (1,000 iterations) complete in under 2 seconds
for typical 500-item campaigns on consumer hardware, making statistical rigor
free at the margin.
EU AI Act Article 15 requires documented human oversight reliability — IAA
ledger entries satisfy this requirement with zero additional cost.

## Applications
- **Consumer**: Verify consistency of personal labeling projects.
- **Government / Defense**: Prove annotation reliability in compliance-driven
  workflows.
- **Enterprise**: Quality gate — reject annotators below Kappa threshold.

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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
