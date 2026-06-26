---
title: "Model Leaderboard"
sidebar_position: 99
description: "Displays per-model performance comparisons across benchmarks, latency"
tags: [features]
---

# Model Leaderboard

## What It Does
Displays per-model performance comparisons across benchmarks, latency
measurements, and quality scores in a ranked leaderboard view.
Supports side-by-side model comparison and historical performance tracking.
All data is computed locally with no public upload.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading leaderboard
configuration from `opencode.json`.
The `model_leaderboard.rs` Rust module in `ai-oss-gateway/src/` manages the
leaderboard data and presentation.

When the leaderboard is accessed (via WS message `leaderboard_get` or by
navigating to the frontend view), the module queries the ledger for all
evaluation results across all registered models.
For each model, it aggregates:
- Benchmark scores from `eval/benchmark_runner.rs` runs (MMLU, GSM8K,
  HumanEval, HellaSwag, ARC)
- Human evaluation scores from the Model Judge
- Safety scores from HarmBench and toxicity checks
- Bias evaluation results
- Latency measurements recorded during inference

The module computes a composite quality score using configurable weights
(default: benchmarks 40%, human eval 30%, safety 20%, latency 10%).
Models are ranked by composite score in descending order.
Each model entry displays: model name, architecture, quantization, parameter
count, composite score, individual benchmark scores with trend arrows
(up/down/flat compared to previous run), latency p50/p95, safety score, and
bias score.

The leaderboard supports filtering (by benchmark score range, safety tier,
latency tier) and sorting (by any metric column).
Side-by-side comparison mode lets users select 2-4 models and view their
scores across all metrics in a paired table with delta columns.
Historical tracking shows each metric's trajectory across evaluation runs —
a model that was consistently improving but recently regressed is visible.

The leaderboard data is refreshed automatically whenever new evaluation
results are added to the ledger.
The frontend `ModelLeaderboardView` connects via WebSocket to port 3030 and
renders the leaderboard as an interactive table with sortable columns, filter
controls, and a comparison mode toggle.
The HTTP UI on port 8081 serves the leaderboard page.

The leaderboard never uploads data anywhere — all results and comparisons are
from the local ledger.
WS messages include `leaderboard_get` and `leaderboard_data`.
Leaderboard configuration is set in `opencode.json`.

Internally, `model_leaderboard.rs` serializes the composite score as a weighted
sum of z-normalized sub-scores to prevent any single metric from dominating due
to scale differences. Normalization means and standard deviations are computed
from all historical model runs in the ledger and stored in a `normalization`
table. The refresh mechanism subscribes to ledger commit events — whenever
`eval/benchmark_runner.rs` or the Model Judge module commits a new result, the
leaderboard re-aggregates affected model entries in O(m) time where m is the
number of models. Historical snapshots are preserved at each model registration
epoch, enabling the trend arrows (comparing current composite to previous
epoch's composite). The side-by-side comparison delta columns are computed as
absolute and percentage differences per metric, color-coded green (improvement)
or red (regression) based on a 2% minimum detectable effect threshold.

## How to Operate
1. Open the Model Leaderboard on port 8081. Navigate to Models > Leaderboard.
2. Default view shows all registered models ranked by composite score.
3. Click column headers to sort ascending/descending.
4. Select 2-4 models, click "Compare" for side-by-side view with deltas.
5. Use filter panel: safety >= 95%, MMLU >= 70%, latency <= 50ms.
6. Click a model name for its detail view with trend charts.
7. Export: `api-oss model leaderboard export --format csv`.
8. CLI: `api-oss model leaderboard` renders ASCII table.
9. Configure weights in `opencode.json`:
   ```json
   {
     "model_leaderboard": {
       "weights": {
         "benchmark": 0.4,
         "human_eval": 0.3,
         "safety": 0.2,
         "latency": 0.1
       }
     }
   }
    ```
    }

10. Filter programmatically: `api-oss model leaderboard --min-safety 0.95 --min-benchmark 0.7 --max-latency-ms 50`.
11. Export comparison: `api-oss model leaderboard compare --model-ids m1,m2 --format json`.
12. Reset normalization baseline: `api-oss model leaderboard reset-baseline`.

## The Moat
- All benchmarking performed locally — results never uploaded publicly
- Metrics computed deterministically and stored in the local ledger
- No competitor offers a private, local model leaderboard
- Composite scoring with configurable weights
- Side-by-side comparison with delta columns
- Historical trend analysis prevents selecting regressed models
- Full data locality

## Why Choose API-OSS
Nvidia's benchmarks are closed and proprietary.
OpenAI's leaderboards are public requiring result submission.
API-OSS gives organizations a private leaderboard for comparing models on
their own criteria with results that never leave the machine.

## Competitive Comparison
- **Nvidia**: Closed benchmarks. No private leaderboard.
- **OpenAI**: Public leaderboards. Requires result submission.
- **Anthropic**: No model leaderboard tooling.
- **Palantir**: Foundry comparison requires cloud infrastructure.
- **Mercor**: No model leaderboard.

## Cost-Benefit Analysis
Private evaluation infrastructure costs $20K+/year.
Manual spreadsheet tracking costs ~$5K/year in labor and is error-prone.
Wrong model selection due to incomplete comparison costs $50K+.
API-OSS leaderboard is included at no cost.
Z-normalized scoring eliminates subjective weighting errors — estimated
$15K/year saved in analyst time spent debating composite formulas.
Historical snapshots prevent selecting a regressed model: a single regression
incident in production costs $10K-$100K in degraded output, which the trend
arrow system would flag before deployment. For enterprise procurement teams
evaluating 10+ vendor models per year, the side-by-side comparison mode
eliminates ~40 hours of manual spreadsheet work per evaluation cycle (saving
$4K-$8K per cycle at $100-$200/hr loaded cost).

## Applications
- **Consumer**: Compare personal fine-tunes privately.
- **Government / Defense**: Benchmark on classified evaluation sets.
- **Enterprise**: Data-driven model selection without leaking proprietary data.

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
