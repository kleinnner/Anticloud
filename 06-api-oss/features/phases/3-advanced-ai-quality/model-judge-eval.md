---
title: "Model Judge / Eval"
sidebar_position: 99
description: "Provides side-by-side comparison of model outputs with structured human"
tags: [features]
---

# Model Judge / Eval

## What It Does
Provides side-by-side comparison of model outputs with structured human
evaluation.
Evaluators assign scores across defined criteria and leave comments.
Results feed into the leaderboard and regression test suite.
Enables systematic quality assessment by human judges.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading judge
evaluation configuration from `opencode.json`.
The evaluation pipeline Rust module in `ai-oss-gateway/src/` manages the judge
workflow.

When an evaluation session is created, the module presents a set of model
outputs for side-by-side comparison.
Each evaluation presents the same input prompt to two (or more) model variants
and displays the outputs alongside each other.
The evaluator scores each output against a customizable rubric.

Standard rubric criteria include: relevance (does the output address the
prompt?), accuracy (is the information correct?), coherence (is the response
well-structured?), helpfulness (does it meet the user's needs?), safety (does
it avoid harmful content?), and style (is the tone appropriate?).
Rubrics are defined per project in `opencode.json` and can include
domain-specific criteria.

Evaluators can be internal team members, domain experts, or trusted external
reviewers — each with an identity recorded in the ledger.
The evaluation interface is served via the HTTP UI on port 8081 through the
`ModelJudgeView` frontend view, which connects via WebSocket to port 3030.
The view renders outputs in a side-by-side or stacked layout with scoring
controls beneath each output.

When an evaluator submits scores, a WS message `eval_result` is sent to the
gateway, which records the scores, comments, evaluator identity, and timestamp
in the ledger.
The module computes aggregate statistics per model variant: mean scores per
criterion, overall mean, score distributions, and inter-evaluator agreement
metrics.

Results are fed into the model leaderboard (updating `model_leaderboard.rs`
data) and the regression test suite.
The module supports blinding — evaluators can be shown outputs without knowing
which model variant produced them.
Multiple evaluation rounds can be configured: after initial scoring, the system
can present items again with revealed model identities.

All evaluation data is stored locally with cryptographic integrity via the
ledger.
WS messages include `eval_model` (start evaluation session) and `eval_result`
(submit scores).
All operations work fully offline.

The blinding feature is implemented by storing a `model_id -> label` mapping in
a separate table within the ledger, encrypted at rest with a session key. The
evaluation frontend receives only anonymous variant IDs (e.g., `variant_a`,
`variant_b`) until the reveal command decrypts the mapping. Aggregate
statistics are computed in `ai-oss-gateway/src/eval/aggregator.rs` — for each
criterion, the module calculates mean, median, standard deviation, min, max,
and inter-quartile range across all evaluators. Inter-evaluator agreement is
computed via intraclass correlation coefficient (ICC) for continuous scores
and Cohen's Kappa for categorical labels. The regression test suite integration
works by storing threshold criteria in the ledger — for example, `"accuracy
>= 4.0"` as a pass/fail gate — and the module emits a `regression_check` event
after each evaluation submission that the CI/CD pipeline listens for via
WebSocket.

## How to Operate
1. Define rubric in `opencode.json`:
   ```json
   {
     "judge_eval": {
       "rubric": {
         "criteria": ["relevance", "accuracy", "coherence"],
         "scale": [1, 5],
         "allow_comments": true
       },
       "blinding": true,
       "min_evaluators_per_item": 3
     }
   }
   ```
2. Open Model Judge view on port 8081. Click "New Evaluation Session."
3. Select models and evaluation dataset. Click "Start Session."
4. Score each criterion 1-5. Optionally add comments. Click "Submit."
5. View aggregate results on the Evaluation Dashboard.
6. Reveal model identities: `api-oss eval reveal --session <session_id>`.
7. Export: `api-oss eval export --session <session_id> --format csv`.
8. Set regression gate: `api-oss eval set-gate --criterion accuracy --threshold 4.0 --operator ge`.
9. View evaluator agreement: `api-oss eval iaa --session <session_id>`.
10. Multi-round evaluation: `api-oss eval round --session <session_id> --reveal --new-round`.

## The Moat
- Evaluation runs entirely offline — no cloud judge service
- Customizable rubrics for domain-specific criteria
- All data stored locally with cryptographic integrity
- Blinding eliminates confirmation bias
- Inter-evaluator agreement metrics quantify reliability
- Results feed directly into leaderboard and regression testing

## Why Choose API-OSS
Mercor's model evaluation is a cloud service — data leaves premises.
OpenAI and Anthropic offer no human evaluation tooling.
API-OSS provides a complete judge evaluation platform with customizable
rubrics, blinding, and IAA metrics.

## Competitive Comparison
- **Mercor**: Cloud service. Data leaves premises. Per-evaluation pricing.
- **OpenAI**: No human evaluation tooling.
- **Anthropic**: No human evaluation tooling.
- **Nvidia**: No judge evaluation in NeMo.
- **Palantir**: No structured human evaluation tooling.

## Cost-Benefit Analysis
Mercor charges $0.50-$2.00 per evaluation item.
1,000 items = $500-$2,000 per comparison.
20 evaluations/year = $10K-$40K/year.
API-OSS is free — use internal evaluators at no per-item cost.
Building equivalent platform costs ~$70K in engineering time.
The blinding feature alone prevents confirmation bias that inflates scores by
15-30% in unblinded evaluations — catching this inflation before model
selection prevents deploying an overrated model (estimated $50K-$200K cost of
a bad deployment). Regression gates automate quality checks that would
otherwise require 1 hour of manual review per model version — for 24 model
versions per year, this saves 24 hours of QA engineer time ($2,400 at
$100/hr). Intraclass correlation coefficient (ICC) reporting provides
defensible evidence of evaluation reliability for regulatory submissions —
avoiding a single regulatory re-audit saves $15K-$40K in consultant fees.

## Applications
- **Consumer**: Evaluate personal models on custom criteria privately.
- **Government / Defense**: Structured human evaluation of classified outputs.
- **Enterprise**: Quality assurance for model releases with auditable records.

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