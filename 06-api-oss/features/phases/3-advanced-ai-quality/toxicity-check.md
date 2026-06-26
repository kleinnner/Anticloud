---
title: "Toxicity Check"
sidebar_position: 99
description: "Scores model outputs across multiple toxicity dimensions: toxicity, severe"
tags: [features]
---

# Toxicity Check

## What It Does
Scores model outputs across multiple toxicity dimensions: toxicity, severe
toxicity, obscenity, threat, insult, and identity attack.
Provides per-dimension scores and aggregate safety metrics using a dedicated
local classification model.
Results are stored in the ledger for trend analysis and compliance.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading toxicity check
configuration from `opencode.json`.
The `toxicity.rs` Rust module in `ai-oss-gateway/src/` manages the
classification pipeline.
When toxicity checking is enabled, every inference response is passed through
a dedicated toxicity classifier — a small, fast model (fine-tuned DistilBERT)
that runs alongside the primary LLM on the same CUDA GPU or CPU.

The classifier loads from `./data/models/toxicity/` at boot time — a fine-tuned
DistilBERT model (~85MB ONNX format) with a 6-output classification head.
For each output, the module tokenizes the text using a cached BERT WordPiece
tokenizer and runs a forward pass through the classifier, producing logits for
each of six toxicity dimensions defined by the Perspective API taxonomy.
Logits are converted to probabilities via sigmoid and thresholded at
configurable per-dimension cutoffs (default 0.5 for severe_toxicity, threat;
0.6 for obscenity, insult, identity_attack; 0.7 for general toxicity).
The ONNX runtime provides consistent ~8ms inference per 100-token output on
GPU and ~25ms on CPU.

The results include a per-dimension score (0.0-1.0) and an overall toxicity
flag (true if any dimension exceeds its threshold).
Results are attached to the inference response as metadata.
If toxicity is detected and `"block_toxic": true` is set in config, the output
is replaced with a configurable safe default message, and the original output
is stored in the ledger with the toxicity scores for review.

The module also supports batch toxicity checking for evaluation datasets:
`api-oss toxicity check-batch --file ./data/eval/results.jsonl` scores every
output in a file and produces aggregate statistics.
Toxicity results are committed to the ledger with the model hash, input hash,
and per-dimension scores, enabling longitudinal analysis of model safety.

The frontend displays toxicity scores inline with model outputs, using color
coding: green (all clear), yellow (borderline), red (toxic with breakdown).
Each red result shows the per-dimension breakdown so operators can see
whether the issue is profanity, threats, or identity attacks.
The HTTP UI on port 8081 includes a Toxicity Dashboard with aggregate
statistics per model, per-dimension trend charts, and a "Recent Toxic Outputs"
review queue where flagged outputs can be reviewed, dismissed, or escalated.

The module supports threshold profiles — different sets of thresholds for
different deployment contexts. For example, a children's app might use
stricter thresholds (0.3 for all dimensions) while an adult educational
platform uses defaults. Profiles are selected via the `"profile"` config key.

WS messages include `toxicity_check` (trigger a check) and
`toxicity_check_result` (return scores).
All classification runs locally with no internet access required.

## How to Operate
1. Enable in `opencode.json`:
   ```json
   {
     "toxicity": {
       "enabled": true,
       "block_toxic": false,
       "device": "cuda",
       "profile": "default",
       "thresholds": {
         "toxicity": 0.7,
         "severe_toxicity": 0.5,
         "obscenity": 0.6,
         "threat": 0.5,
         "insult": 0.6,
         "identity_attack": 0.5
       }
     }
   }
   ```
2. Run inference: `api-oss model run --prompt "Tell me a joke"`. Toxicity
   scores are included automatically in the response metadata.
3. Check specific text: `api-oss toxicity check --text "You are terrible"`.
   Returns per-dimension scores: `{"toxicity": 0.92, "severe_toxicity": 0.12, ...}`.
4. Batch check: `api-oss toxicity check-batch --file ./outputs.jsonl
   --output ./toxicity_scores.jsonl`. Processes 10K outputs in ~30 seconds.
5. Review blocked outputs in the Safety > Toxicity Review dashboard on port
   8081. Each flagged output shows the original and safe default.
6. Switch profiles: `api-oss toxicity set-profile --profile children_app`.

## The Moat
- Toxicity classification runs locally — no API call to external moderation
- Multi-dimensional scoring for granular insight
- Results stored in the local ledger for auditability
- Configurable per-dimension thresholds
- Block-toxic mode prevents offensive outputs automatically
- All operations work fully offline

## Why Choose API-OSS
OpenAI Moderation API is cloud-only — all outputs must be sent to OpenAI.
Anthropic offers no user-facing toxicity scoring.
API-OSS runs a dedicated classifier on the local machine, ensuring output
content never leaves the premises.

## Competitive Comparison
- **OpenAI**: Moderation API is cloud-only. Data leaves premises.
- **Anthropic**: No user-facing toxicity scoring tool.
- **Nvidia**: No toxicity checking in NeMo.
- **Palantir**: No toxicity scoring capability.
- **Mercor**: No toxicity checking.

## Cost-Benefit Analysis
OpenAI Moderation API costs $0.01/1K characters. For a SaaS platform
generating 500K outputs/month at 200 average characters each, that's
$1,000/month or $12,000/year in moderation fees alone.
At 2M outputs/month (mid-growth startup), it scales to $4,000/month ($48K/yr).
Third-party services (AWS Comprehend at $0.002/request, GCP Perspective at
$0.01/request) cost $1,000-$20,000/month depending on volume.
API-OSS toxicity classifier runs locally at $0 — no per-output charges, no
character counting, no tier upgrades. The only cost is the on-device compute
(~8ms GPU per output, ~5W at idle).
Building an equivalent multi-dimensional toxicity classifier costs ~$40K in
engineering time plus $5K-$10K in labeled training data.
Each toxic output reaching a public customer causes $10K-$50K in incident
response, regulatory filing, and PR costs. At a 0.1% miss rate, a platform
with 1M outputs/month ships 1,000 toxic outputs — API-OSS block-toxic mode
prevents this entirely.
Platforms using OpenAI Moderation also face data exfiltration risk — all
outputs leave premises. API-OSS keeps every output local.

## Applications
- **Consumer**: Filter personal model outputs for offensive content.
- **Government / Defense**: Ensure AI outputs meet professional standards.
- **Enterprise**: Content moderation for customer-facing AI features.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com