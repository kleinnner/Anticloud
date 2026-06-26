---
title: "Quality Gates for Promotion"
sidebar_position: 99
description: "Enforces minimum quality thresholds — BLEU, ROUGE-L, exact match, and custom"
tags: [features]
---

# Quality Gates for Promotion

## What It Does
Enforces minimum quality thresholds — BLEU, ROUGE-L, exact match, and custom
metrics — before a model can be promoted to production.
Automated promotion blocking with detailed failure reports.
Gates are defined in configuration and evaluated against local test sets, with
results stored in the ledger for auditability.

## How It Works
The gateway starts via `api-oss start`, loading quality gate configuration from
`opencode.json` under the `quality_gates` section.
Each gate specifies a metric name, comparison operator (`>=`, `<=`, `>`, `<`,
`==`), threshold value, and the target dataset or evaluation type.
The `promotion.rs` Rust module in `ai-oss-gateway/src/` reads these definitions
on startup and registers them with the model lifecycle manager.

When a user triggers model promotion (via CLI `model promote` or WS message
`model_promote`), the gateway halts promotion and runs all registered quality
gates sequentially.
For each gate, the module loads the corresponding evaluation results from the
ledger — if no recent results exist (within a configurable staleness window),
it triggers an evaluation run automatically.
Metric computation uses the cached benchmark datasets in `./data/eval/datasets/`.

BLEU and ROUGE-L are computed against reference outputs using the `rust_bleu`
and `rust_rouge` crates.
Exact match uses string comparison after normalization (whitespace, punctuation
stripping).
Custom metrics are evaluated by loading a user-provided evaluation script from
`./data/eval/custom/` and running it in a sandboxed wasm runtime.

If any gate fails, the promotion is blocked and a detailed failure report is
generated listing each gate with its current score, threshold, pass/fail status,
and the evaluation run ID.
The report is committed to the ledger as a `promotion_attempt` entry with the
timestamp, model hash, and operator identity.
Failed promotion attempts are visible in the frontend under the Model Lifecycle
view, which connects via WebSocket to port 3030.

Operators can override a failed gate by setting `"allow_override": true` in the
gate config, which requires a signed justification message stored in the ledger.
The HTTP UI served on port 8081 shows a quality gate dashboard with pass rates
over time and per-gate trend charts.
The 87 CLI commands include `model promote --force` to bypass gates with a
recorded justification.

## How to Operate
1. Edit `opencode.json` to define quality gates:
   ```json
   {
     "quality_gates": {
       "gates": [
         { "metric": "bleu", "op": ">=", "threshold": 0.85,
           "dataset": "test_set_v1" },
         { "metric": "exact_match", "op": ">=", "threshold": 0.70,
           "dataset": "test_set_v1" },
         { "metric": "rouge_l", "op": ">=", "threshold": 0.80,
           "dataset": "test_set_v2" }
       ],
       "staleness_window_hours": 24,
       "allow_override": false
     }
   }
   ```
2. Restart the gateway or run `api-oss config reload` to apply the new gate
   definitions.
3. Try to promote a model: `api-oss model promote --model my_finetune
   --target production`.
4. If gates pass: "Quality gates passed. Model my_finetune promoted to
   production." The promotion is recorded in the ledger.
5. If gates fail: "Quality gates FAILED. Check
   ./data/ledger/promotion_attempt_latest.json for details."
6. To view failure details in the UI, navigate to Model Lifecycle on port 8081,
   click "Promotion Attempts", and select the failed attempt.
7. To override a gate, set `"allow_override": true` in `opencode.json`, then
   run `api-oss model promote --force --reason "Emergency fix #1234"`.
8. To test gate configuration without promoting, run
   `api-oss model check-gates --model my_finetune`.

## The Moat
- Quality gates are defined locally, evaluated against local test sets, and
  enforced before any model switch
- No cloud CI/CD dependency — all gate evaluation runs on the local machine
- Gates are stored as configuration in the ledger for auditability and version
  history
- Custom metrics via wasm sandbox allow domain-specific quality measures
- Staleness windows prevent promotion based on outdated evaluation results
- Every promotion attempt (pass or fail) is cryptographically committed to the
  ledger

## Why Choose API-OSS
Customers choose API-OSS quality gates because they enforce rigorous model
promotion standards without requiring a cloud CI/CD pipeline.
Palantir's gated deployments require Foundry AIP's cloud orchestration layer.
OpenAI offers no user-configurable quality gates — users must build their own
promotion pipeline around the API.
API-OSS bakes gates directly into the model lifecycle, making it impossible to
accidentally promote a low-quality model.

## Competitive Comparison
- **Palantir**: Gated deployments exist but require Foundry AIP's cloud
  infrastructure. Gate definitions are not locally auditable.
- **OpenAI**: No user-configurable quality gates. Users must build external
  CI/CD pipelines.
- **Anthropic**: No model promotion gates. Models are deployed by Anthropic.
- **Mercor**: No model promotion or quality gates.
- **Nvidia**: No quality gate framework in NeMo.

## Cost-Benefit Analysis
Building equivalent quality gates with cloud CI/CD costs ~$200/month for
GitHub Actions or GitLab CI runners.
OpenAI fine-tuning costs $XX/hr GPU — running gates on API-OSS uses local GPU
at $0/hr extra.
Every failed promotion that would have shipped a bad model costs ~$10K in
incident response. If gates catch 1 bad promotion per quarter, that's $40K/year
in prevention.
Palantir's gate system is bundled in enterprise contracts at $500K+/year.
API-OSS gates are included at no additional cost.

## Applications
- **Consumer**: Automatically prevent a low-quality fine-tune from replacing a
  working personal model. Set a BLEU gate of 0.75 on a held-out test set.
- **Government / Defense**: Safety-critical quality gates for classified model
  deployments. Every failed gate is recorded with operator identity.
- **Enterprise**: Production-grade deployment pipeline with automated quality
  enforcement. Custom metrics enforce domain-specific quality standards.

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

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
