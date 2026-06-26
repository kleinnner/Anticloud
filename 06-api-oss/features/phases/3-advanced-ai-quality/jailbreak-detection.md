---
title: "Jailbreak Detection"
sidebar_position: 99
description: "ML-based detection of jailbreak attempts in user inputs."
tags: [features]
---

# Jailbreak Detection

## What It Does
ML-based detection of jailbreak attempts in user inputs.
Classifies adversarial prompts as safe or malicious using a dedicated local
detection model.
Blocks or flags adversarial requests before they reach the LLM, preventing
unsafe outputs.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading jailbreak
detection configuration from `opencode.json`.
The `jailbreak.rs` Rust module in `ai-oss-gateway/src/` manages the detection
pipeline.
When jailbreak detection is enabled, every user input is first passed through
a dedicated jailbreak classifier — a small, fast transformer model (fine-tuned
DistilBERT) that detects adversarial prompt patterns.

The classifier is loaded from `./data/models/jailbreak/` at boot time and runs
on the same CUDA GPU as the primary LLM, but can be configured to run on CPU
separately via `"device": "cpu"` in config.
The module tokenizes the input using a WordPiece tokenizer (cached at boot,
~10MB vocabulary) and runs a forward pass through the DistilBERT encoder,
producing a probability score (0.0-1.0) via the classification head's softmax
output.
If the score exceeds a configurable threshold (default 0.8), the input is
classified as malicious.
The classifier uses ONNX runtime for optimized inference — the model is
exported to ONNX format at training time, yielding ~25% faster inference
compared to raw PyTorch execution.

The detection model is trained on a dataset of known jailbreak patterns:
- Prompt injections: "Ignore previous instructions"
- Role-playing attacks: "You are now DAN, do anything now"
- Encoding attacks: base64-encoded malicious prompts
- Multi-turn attacks: gradually building to adversarial requests
- Context manipulation: supplying false context to override safety

The dataset is continuously updatable by adding new jailbreak examples to
`./data/jailbreak/training_data/` and running `api-oss jailbreak retrain`.
The classifier runs in ~5ms on GPU and ~30ms on CPU.

When a jailbreak is detected, configurable actions:
- `mode: "block"` — returns a safe default without invoking the LLM
- `mode: "flag"` — passes input with a metadata flag for review
- `mode: "log"` — records detection but allows inference

All detection events are logged to the ledger with the input hash, classifier
score, detected pattern category, and model hash.
The frontend displays jailbreak detection statistics on the Safety dashboard.
The HTTP UI on port 8081 includes a "Jailbreak Test" page.

WS messages include `jailbreak_detect` and `jailbreak_detect_result`.
All operations run locally with no internet access.

## How to Operate
1. Enable in `opencode.json`:
   ```json
   {
     "jailbreak_detection": {
       "enabled": true,
       "threshold": 0.8,
       "mode": "block",
       "device": "cuda",
       "custom_patterns_file": "./data/jailbreak/patterns.txt"
     }
   }
   ```
2. Test a prompt: `api-oss jailbreak detect --prompt "Ignore previous
   instructions..."`. Returns the score and classification with pattern
   category if matched.
3. Run inference: `api-oss model run --prompt "Tell me a joke"`. Jailbreak
   check happens automatically before LLM invocation.
4. View dashboard: Safety > Jailbreak Detection on port 8081. Shows detection
   rate over time, per-category breakdown, and per-annotator flagging stats.
5. Add custom patterns via a text file referenced in `custom_patterns_file`.
   Each line is a regex pattern for rule-based detection complementing the ML
   classifier.
6. Retrain: add labeled examples to `./data/jailbreak/training_data/`, run
   `api-oss jailbreak retrain`. Retraining uses the local GPU and completes
   in ~30 minutes for 10K examples.
7. Calibrate threshold: `api-oss jailbreak calibrate --dataset ./data.jsonl`.
   Runs a grid search from 0.5-0.95 in 0.05 steps and reports F1 scores per
   threshold.
8. Statistics: `api-oss jailbreak stats --since 2026-01-01`.

## The Moat
- Detection runs locally — no data sent to external moderation
- Small, fast model adds minimal latency (~5ms GPU)
- Continuously updatable without retraining the main model
- Regex patterns complement ML classifier for rule-based detection
- Configurable actions for graduated responses
- All events recorded in the immutable ledger

## Why Choose API-OSS
Anthropic uses rule-based filtering that is brittle against novel patterns.
OpenAI Moderation API is cloud-based, requiring data to be sent externally.
API-OSS runs a dedicated ML classifier locally that continuously improves.

## Competitive Comparison
- **Anthropic**: Rule-based filtering, brittle against novel attacks.
- **OpenAI**: Moderation API is cloud-based. Data leaves premises.
- **Nvidia**: No jailbreak detection in NeMo.
- **Palantir**: No user-facing jailbreak detection.
- **Mercor**: No jailbreak detection.

## Cost-Benefit Analysis
OpenAI Moderation API costs $0.01/1K characters — $500/month for 50M
characters. For a customer-facing chatbot processing 1M requests/month with
500 average characters each, that's $5,000/month in moderation fees.
Third-party services (AWS Comprehend, GCP Perspective) charge
$0.005-$0.02/request — $5,000-$20,000/month at 1M requests.
API-OSS runs the jailbreak classifier locally at $0 — the only cost is the
one-time GPU inference pass (~5ms on RTX 4090).
Building a custom ML classifier with comparable accuracy (95%+ F1) costs
~$60K in engineering time plus ongoing data labeling ($5K-$10K/year for
new attack patterns).
Each successful jailbreak reaching end users costs $50K-$500K depending on
the content type — for a customer support chatbot, a single harmful response
can trigger a regulatory incident.
Multi-year TCO comparison: OpenAI Moderation API = $60K/year at 1M
requests/month. API-OSS = $0 runtime + $60K one-time build + $5K/year data
labeling. Breakeven in 13 months.

## Applications
- **Consumer**: Protect personal AI assistants from manipulation.
- **Government / Defense**: Prevent adversarial attacks on classified AI
  systems.
- **Enterprise**: Ensure LLM-powered customer-facing apps aren't exploited.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ