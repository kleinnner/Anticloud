---
title: "Decision Scoring + Analytics"
sidebar_position: 99
description: "Tracks decision quality over time by scoring every council decision and recording actual"
tags: [features]
---

# Decision Scoring + Analytics

## What It Does
Tracks decision quality over time by scoring every council decision and recording actual
outcomes.
Provides analytics on decision accuracy, consistency, bias patterns, and calibration —
enabling continuous improvement of AI-assisted decision-making.
## How It Works
Decision scoring is built into the council deliberation pipeline in `ai-oss-gateway/src/`.
When the council produces a decision — whether from the constitutional AI framework, a
rule evaluation, or a PSI result — the decision scoring engine captures the full
decision context: input data (sources, provenance from lineage tracking), reasoning trace
(which constitution principles were evaluated, which rules fired), vote distribution (if
multiple council members participated), confidence scores, and the raw model output from
the Qwen2-VL-2B-Instruct-Q4_K_M.gguf model running on CUDA.
When the actual outcome is known, an operator submits it via `decision_record_outcome`
over WebSocket to port 3030, or through the `DecisionScoringView` frontend at
`https://localhost:8081/decisions/scoring`.
The scoring engine computes quality metrics: precision (was the recommendation correct?),
recall (did it identify all relevant cases?), calibration (does 70% confidence mean 70%
accuracy?), fairness (do accuracy rates differ across demographic groups?), and
consistency (does the same input produce the same output?).
Analytics are computed incrementally in the Rust engine — results are stored in
`data/graph.db` (SQLite WAL) and updated as new outcomes are recorded.
The HTTP UI on port 8081 renders decision scorecards, outcome correlation dashboards, and
bias heatmaps.
All scoring events are streamed via WebSocket and recorded in the immutable ledger at
`data/ledger/` in `.aioss` format.
The CLI (`api-oss scores list`, `api-oss scores report`, etc.) provides terminal access,
one of 87 commands across 9 subcommand groups.
Configuration is driven by `opencode.json` at the gateway level.
The entire feature operates on a single binary started by `api-oss start`, fully
air-gapped with no internet.
## How to Operate
1.
**Open the DecisionScoringView** at `https://localhost:8081/decisions/scoring` to see the scorecard dashboard.
2.
**Review pending decisions**: The view lists all council decisions awaiting outcome confirmation.
3.
**Record an outcome**: Click a decision and select "Record Outcome" — choose correct, incorrect, partially correct, or custom.
Submit via the UI or send `{"type": "decision_record_outcome", "decision_id": "...",
"outcome": "correct"}` over WebSocket.
4.
**View analytics**: The dashboard shows precision/recall trends over time, calibration curves (confidence vs.
actual accuracy), and bias heatmaps by user group or data source.
5.
**Export reports**: `api-oss scores report --format pdf --from 2025-01-01 --to 2025-06-01` generates a compliance-ready decision quality report.
6.
**Set quality targets**: Configure `opencode.json` with `scoring.targets.precision: 0.95` to receive alerts when quality drops below threshold.
7.
**Investigate bias**: The bias detection module compares accuracy rates across user-defined segments — e.g., does the model perform differently on data from region A vs.
region B?
## The Moat
- **Built into the deliberation pipeline, not an afterthought**: Decision scoring is part of the council execution path.
Every decision is scored with full context — inputs, reasoning, vote distribution,
confidence.
Black-box AI systems cannot provide this transparency.
- **Incremental analytics**: Scores are updated incrementally in Rust as new outcomes are recorded.
No ETL, no batch processing — the dashboard reflects the latest data within
milliseconds.
- **Full provenance integration**: Each scored decision links to its data lineage DAG entries.
An auditor can trace from a decision quality score back to the specific input data and
reasoning steps.
- **Bias detection built in**: Automated fairness testing compares accuracy across segments without requiring a separate data science team.
- **Air-gapped analytics**: All decision quality data is local.
No data leaves the instance — critical for classified environments where decision
accuracy must be measured but data cannot be shared.
## Why Choose API-OSS
OpenAI provides no decision tracking whatsoever — their platforms are stateless chat
completions with no outcome feedback loop.
Palantir Foundry can be configured for decision analytics but requires extensive custom
data modeling and cloud infrastructure.
API-OSS provides decision scoring as a built-in, zero-configuration feature of the council
engine.
Every AI recommendation is automatically tracked, outcomes can be recorded with one click,
and quality analytics are computed in real-time.
For regulated industries that need to demonstrate AI decision accuracy over time, API-OSS
provides the infrastructure that no competitor matches.
## Competitive Comparison
- **OpenAI**: No decision tracking — no outcome feedback loop exists.
Users cannot measure or improve decision quality.
- **Palantir**: Decision analytics via Foundry, but requires custom data modeling and separate analytics infrastructure.
Not built into the decision pipeline.
- **Snowflake**: No AI decision analytics.
Snowflake is a data warehouse, not an AI decision platform.
- **Anthropic**: No decision scoring — API returns completions without tracking or outcome feedback.
## Cost-Benefit Analysis
Building decision analytics in-house requires: a data pipeline for capturing decisions and
outcomes (2-4 months engineering), a BI tool like Tableau or Looker ($70-$150/user/month),
and a data science team for bias analysis ($200k-$400k/year).
Palantir's analytics capabilities require a full Foundry contract ($1M+/yr).
API-OSS provides comprehensive decision scoring and analytics at zero additional cost.
Time savings: 2-4 months of data pipeline development eliminated.
Risk reduction: for regulated industries (FDA, FINRA, EU AI Act), demonstrating decision
quality over time is mandatory — API-OSS provides the evidence trail out of the box.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Decision quality auditing for military targeting recommendations — every recommendation must be scored, outcomes must be tracked, and accuracy trends must be reported to oversight committees.
- **Enterprise**: Board-level reporting on AI decision accuracy for SOX compliance.
Continuous improvement programs where model recommendations are tracked against real-world
outcomes and models are retrained based on quality gaps.

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
