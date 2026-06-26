---
title: "Safety Benchmarks (HarmBench)"
sidebar_position: 99
description: "Runs the HarmBench suite of pre-built harmful request tests against models."
tags: [features]
---

# Safety Benchmarks (HarmBench)

## What It Does
Runs the HarmBench suite of pre-built harmful request tests against models.
Automatically measures refusal rate and compliance with harmful requests.
Provides standardized safety scoring with per-category breakdowns for risk
assessment.

## How It Works
The gateway starts via `api-oss start` and loads configuration from
`opencode.json`.
The HarmBench integration lives in `eval/` Rust modules in
`ai-oss-gateway/src/`.
On first run, the module downloads the HarmBench dataset from its canonical
source and caches it in `./data/eval/datasets/harmbench/`.

The dataset contains ~400 adversarial prompts across categories including
cyberattack instructions, physical harm, harassment, fraud, and disinformation.
Each prompt has a known ground-truth label indicating whether a safe model
should refuse.
When a user triggers HarmBench evaluation (via CLI `eval run --benchmark
harmbench` or WS message), the benchmark runner at
`eval/benchmark_runner.rs` loads each prompt sequentially against the target
model running on the local llama.cpp server with CUDA backend.

The model is Qwen2-VL-2B-Instruct-Q4_K_M.gguf or whichever model is
currently active.
For each prompt, the model's response is collected and passed to a local
classifier that determines whether the response complies with the harmful
request or refuses.
The classifier uses a dedicated small model (a fine-tuned BERT variant) that
runs alongside the primary LLM, scoring each response on a compliance spectrum
from "explicit refusal" to "full compliance."

Category-level scores are aggregated: the module reports compliance rate,
refusal rate, and ambiguous rate per category.
An overall HarmBench score is computed as the weighted average of refusal rates
across categories, where categories are weighted by severity (physical harm and
cyberattack have higher weights than harassment).
Results are committed to the ledger with a SHA-256 hash of the evaluation run,
the model hash, the HarmBench dataset version, and timestamps.

The frontend renders a radar chart of per-category safety scores via WebSocket
on port 3030.
The HTTP UI on port 8081 displays a safety report table with pass/fail per
category.
All results are stored in SQLite alongside annotation datasets.
Historical HarmBench scores enable trend analysis — quality gates can be
configured to block promotion if safety scores decline below a configurable
threshold.

## How to Operate
1. Run HarmBench evaluation: `api-oss eval run --benchmark harmbench`.
2. The CLI shows progress: "HarmBench: 0/400 prompts evaluated... Refusal
   rate: 96.5%... Category: Cyberattack — 100% refusal".
3. On completion: "HarmBench complete. Overall safety score: 97.2%. See report
   at http://localhost:8081/eval/reports/latest".
4. To export detailed results: `api-oss eval report --benchmark harmbench
   --format json`. Outputs to `./data/eval/reports/harmbench_latest.json`.
5. In the frontend on port 8081, navigate to Evaluation > Safety Benchmarks.
   The HarmBench section shows overall safety score with color coding,
   per-category breakdown, historical trend chart, and prompt-level drill-down.
6. To run HarmBench as part of a quality gate, add to `opencode.json`:
   ```json
   {
     "quality_gates": {
       "gates": [
         { "metric": "harmbench_safety_score", "op": ">=", "threshold": 0.90 }
       ]
     }
   }
   ```
7. To schedule HarmBench runs: `api-oss eval schedule --benchmark harmbench
   --cron "0 6 * * 1"` runs every Monday at 6 AM.
8. For custom harm categories, create a JSONL file in
   `./data/eval/custom/custom_harmbench.jsonl` and run
   `api-oss eval run --benchmark custom_harmbench`.

## The Moat
- HarmBench runs locally with cached test datasets — no external API calls
- Refusal rate is computed deterministically using a local classifier
- Fully reproducible safety scores across runs
- Competitors do not expose HarmBench tooling to users
- Custom harm categories enable domain-specific safety testing
- Ledger-anchored results provide tamper-evident safety audit trails
- Quality gates can enforce safety floors for model promotion

## Why Choose API-OSS
Customers choose API-OSS HarmBench because it is the only system that runs
standardized safety benchmarks entirely on local hardware.
Anthropic and OpenAI run safety evaluations internally and do not expose their
tools.
Organizations that need to independently verify model safety — for regulatory
compliance, procurement, or internal governance — can run HarmBench on any
model without sending prompts to a third party.

## Competitive Comparison
- **Anthropic**: Safety evaluation is internal; no HarmBench tooling exposed.
- **OpenAI**: Safety benchmarks run internally; users cannot run them locally.
- **Nvidia**: No HarmBench integration in NeMo.
- **Palantir**: Safety evaluation exists in AIP but requires cloud
  infrastructure.
- **Mercor**: No safety benchmark tooling.

## Cost-Benefit Analysis
Running HarmBench via cloud API services costs ~$20 per evaluation pass
(400 prompts x $0.05/request).
API-OSS HarmBench costs $0 — the classifier runs locally.
Weekly safety evaluations cost $1,040/year via API vs. $0 with API-OSS.
Building a custom HarmBench framework costs ~$50K in engineering time.
Every safety incident that HarmBench prevents costs an average of $100K.
For defense contractors, independent HarmBench evaluation is contractual —
API-OSS avoids $20K+ per third-party assessment.

## Applications
- **Consumer**: Verify a model's safety alignment before personal use.
- **Government / Defense**: Mandatory safety testing for AI systems in public
  service. Custom harm categories evaluate mission-specific risks.
- **Enterprise**: Compliance-driven safety evaluation for regulated AI
  deployments. Included in model cards for governance boards.

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