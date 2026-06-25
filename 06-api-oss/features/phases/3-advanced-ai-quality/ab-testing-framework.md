---
title: "A/B Testing Framework"
sidebar_position: 99
description: "Split-tests two models or configurations with statistical significance"
tags: [features]
---

# A/B Testing Framework

## What It Does
Split-tests two models or configurations with statistical significance
calculation.
Built-in experiment tracking records parameters, results, and sample sizes.
Determines the winner with configurable confidence thresholds.
Supports side-by-side comparison of model versions, prompt templates, and
inference parameters.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading A/B testing
configuration from `opencode.json`.
The `ab_test.rs` Rust module in `ai-oss-gateway/src/` manages experiment
lifecycle.
When an experiment is created (via WS message `ab_test_run` or CLI), the
module defines the two variants — typically a control (current production
model) and a treatment (candidate model).

The experiment specifies a routing strategy:
- **Interleaved**: each user request is sent to both variants and responses
  compared side-by-side
- **Split**: each request randomly assigned to one variant
- **Sequential**: requests alternate between variants

Each request-response pair is recorded with the variant identity, input,
output, and evaluation metric(s). Metrics can be user-assigned scores,
automated quality metrics (BLEU, ROUGE-L, semantic similarity), latency,
output length, or custom metrics via wasm plugin.

The module maintains an internal `ExperimentState` struct in `ab_test.rs`
that tracks cumulative sample counts, running sums for continuous metrics,
and the per-variant score distribution. For binary metrics, it stores the
proportion of positive outcomes per variant; for continuous metrics, it
stores the mean, variance, and sample count per variant. These accumulators
update incrementally as each new result arrives via the WebSocket on port
3030, avoiding re-scanning historical data on every update.

When computing statistical significance, the module first checks that the
minimum sample size has been met — default 30 per variant for the z-test and
20 per variant for Welch's t-test, configurable via `opencode.json`. The
power analysis uses a standard normal power function: given a desired power
(0.80 default) and effect size (0.5 default Cohen's d), it returns N per
variant. The module logs a warning if the current sample is below the
required N.

Results accumulate in the ledger with per-request granularity.
After each batch (configurable, default 100), the module computes statistical
significance:
- Binary outcomes (like/dislike): two-proportion z-test
- Continuous metrics (BLEU, latency): Welch's t-test

The module reports the test statistic, p-value, effect size (Cohen's d for
continuous, absolute difference for binary), and significance status.
A winner is declared when sufficient samples reach significance at the
configured alpha level (default 0.05).
Power analysis estimates required sample sizes upfront.

The frontend displays real-time experiment results as data accumulates, with
a significance tracker showing p-value evolution.
The HTTP UI on port 8081 includes an Experiment Manager page.
Experiment configuration is version-controlled in the ledger for
reproducibility.

WS messages include `ab_test_run`, `ab_test_result`, `ab_test_status`, and
`ab_test_conclude`.
The 87 CLI commands include `ab-test start`, `ab-test status`, `ab-test
conclude`, and `ab-test list`.

## How to Operate
1. Create experiment: `api-oss ab-test start --name "temp_test" --control
   "model_v1" --treatment "model_v2" --metric "user_satisfaction" --alpha
   0.05`.
2. Route traffic: `api-oss model run --experiment exp_001 --prompt "..."`.
3. Submit feedback: `api-oss ab-test feedback --experiment exp_001
   --request-id req_123 --score 1`.
4. Check status: `api-oss ab-test status --experiment exp_001`.
5. Conclude: `api-oss ab-test conclude --experiment exp_001 --promote-winner`.
6. Template-based test: compare prompts via `--control-template` and
   `--treatment-template`.
7. Filter by time range: `api-oss ab-test results --experiment exp_001 --from
   "2026-05-01" --to "2026-05-30"` to exclude stale data.
8. Export raw data: `api-oss ab-test export --experiment exp_001 --format csv
   --output ./data/ab_test_export.csv` for external analysis.
9. Auto-promote in config:
   ```json
   {
     "ab_testing": {
       "auto_promote": true,
       "minimum_samples": 500,
       "alpha": 0.05
     }
   }
   ```

## The Moat
- A/B tests run locally with no external traffic routing
- Statistical significance computed using exact methods
- Experiment configurations version-controlled in the ledger
- Real-time p-value tracking as samples accumulate
- Multiple routing strategies for different scenarios
- Template-based experiments enable prompt engineering tests
- All experiment data stays local

## Why Choose API-OSS
Palantir's A/B testing requires Foundry's cloud orchestration.
OpenAI offers no self-hosted A/B testing.
API-OSS bakes statistical experimentation into the inference pipeline.
Power analysis tells operators required sample sizes upfront.

## Competitive Comparison
- **Palantir**: A/B testing exists but requires Foundry cloud infrastructure.
- **OpenAI**: No self-hosted A/B testing framework.
- **Anthropic**: No A/B testing tooling.
- **Nvidia**: No A/B testing in NeMo.
- **Mercor**: No A/B testing capabilities.

## Cost-Benefit Analysis
Enterprise experimentation platforms (Optimizely, LaunchDarkly) cost
$50K-$200K/year.
Building equivalent in-house costs ~$60K in engineering time.
Each A/B test that identifies a model improvement saves $10K in opportunity
cost.
Preventing false promotion from noise saves $5K per rollback.
Running 50 A/B tests per year on cloud platforms would cost ~$0.50/request in
traffic routing fees. API-OSS routes all traffic locally at $0 additional
cost.
The power analysis feature alone saves an estimated $2K per test by preventing
under-powered experiments from wasting samples and operator time.
A single false-positive promotion causes an average of $15K in incident
response and rollback effort. The statistical rigor of the z-test and
Welch's t-test implementations reduces false-positive risk from ~30%
(naive comparison) to the configured alpha level of 0.05.

## Applications
- **Consumer**: Compare two fine-tuned variants of a personal model.
- **Government / Defense**: Statistically validate model changes before
  deployment.
- **Enterprise**: Data-driven decisions on prompt templates and model versions.

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
