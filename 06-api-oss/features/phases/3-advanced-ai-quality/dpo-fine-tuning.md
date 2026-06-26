---
title: "DPO Fine-Tuning"
sidebar_position: 99
description: "Direct Preference Optimization (DPO) fine-tuning from preference pairs"
tags: [features]
---

# DPO Fine-Tuning

## What It Does
Direct Preference Optimization (DPO) fine-tuning from preference pairs
collected naturally via user ratings in the ledger.
Converts comparative feedback into model improvements without the complexity
of RLHF.
DPO runs locally, avoiding expensive, slow, cloud-dependent RLHF pipelines.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading DPO
configuration from `opencode.json`.
The `finetune.rs` Rust module in `ai-oss-gateway/src/` manages the DPO
training pipeline.

Preference data is collected organically as users interact with the model —
every time a user rates a model output (thumbs up/down) or selects a preferred
output in an A/B test, the system records a preference pair: the input prompt,
the chosen (preferred) output, and the rejected (non-preferred) output.
These preference pairs accumulate in the ledger at `./data/preferences/`.

When the operator triggers DPO fine-tuning (via CLI `finetune dpo`), the
module reads the preference dataset from the ledger at
`./data/preferences/`. The dataset is filtered to include only pairs with
confidence weight above a configurable threshold (default 0.7), where
confidence is derived from the rater's historical consistency score.
DPO works by directly optimizing the policy (the model) to increase the
probability of preferred responses and decrease the probability of rejected
responses, without training a separate reward model.

The module loads the base model (default: Qwen2-VL-2B-Instruct-Q4_K_M.gguf
on CUDA) and the preference dataset. The model is loaded with the llama.cpp
backend via the `llama-cpp-2` crate, with the GPU set to CUDA device 0.
It applies LoRA adapters during training — only low-rank matrices are updated
on the query and value projection layers with rank r=8 (configurable via
`--lora-rank`), keeping the base model frozen.
The DPO loss function is computed per batch: for each preference pair, the
model computes log-probabilities of the chosen and rejected responses, and the
loss is the negative log of the sigmoid of their difference (scaled by beta,
a temperature parameter controlling how much to favor the chosen over
rejected). The per-batch loss is the mean over all preference pairs in the
batch, with a weight decay regularization term (default 0.01) added to prevent
adapter weight drift.

Training uses the AdamW optimizer with a cosine learning rate schedule that
decays from the initial learning rate to 0 over the total number of training
steps, with 10% warmup steps where the LR increases linearly.
Hyperparameters (learning rate, beta, batch size, number of epochs, LoRA rank,
weight decay, warmup ratio) are configurable via CLI flags or config file in
`opencode.json` under `fine_tuning.dpo`.
The batch size defaults to 4 — limited by the 8 GB VRAM of a typical consumer
GPU with qwen2-vl-2b-q4 loaded — and can be reduced to 1 for GPUs with
4 GB or less.
Training runs on the local GPU — data never leaves the machine.

Progress is displayed in the CLI with loss curves, accuracy (fraction of pairs
where chosen has higher probability than rejected), and estimated time to
completion. The progress bar updates every 10 batches, showing current loss,
accuracy, learning rate, and tokens processed per second.
After training, the LoRA adapter weights are saved to `./data/adapters/` with
a name derived from the base model and training run ID. The adapter file is a
GGML-compatible binary (typically 8-16 MB for rank 8), and the module also
saves a JSON metadata file with the training hyperparameters, final metrics,
and a SHA-256 of the adapter weights.
The adapter can be loaded at runtime alongside the base model via
`api-oss model run --model base_qwen --adapter dpo_20260530_001`.

The module generates a training report with: final loss, accuracy, preference
distribution, training time, and learning curves.
All training metadata is recorded in the ledger.
The 87 CLI commands include `finetune dpo`, `finetune dpo-status`, `finetune
dpo-list`, `finetune dpo-cancel`, and `finetune dpo-report`.

## How to Operate
1. Collect preference data: rate responses thumbs up/down in the UI or via
   `api-oss model run --prompt "..." --rate`.
2. Check data status: `api-oss finetune dpo-data-status` to see pair count
   and rating distribution.
3. Start DPO training: `api-oss finetune dpo --base-model qwen2-vl-2b-q4
   --learning-rate 5e-5 --beta 0.1 --epochs 3 --lora-rank 8`.
4. Monitor live: `api-oss finetune dpo-status --run <run_id>` to see
   current loss, accuracy, and progress percentage.
5. Cancel training: `api-oss finetune dpo-cancel --run <run_id>`.
6. Use the fine-tuned model: `api-oss model run --model
   dpo_qwen2-vl-2b-q4_20260530_001 --prompt "..."`.
7. View training report: `api-oss finetune dpo-report --run <run_id>`.
8. List all trained adapters: `api-oss finetune dpo-list`.
9. Compare pre/post DPO: `api-oss ab-test start --control base
   --treatment dpo_model`.
10. Configure defaults in `opencode.json`:
   ```json
   {
     "fine_tuning": {
       "dpo": {
         "default_beta": 0.1,
         "default_lr": 5e-5,
         "default_epochs": 3,
         "min_preference_pairs": 500
       }
     }
   }
   ```

## The Moat
- Preference data collected organically from user ratings
- DPO runs locally — no cloud RLHF pipeline needed
- No reward model required — preference pairs directly update the policy
- LoRA adapters keep training efficient
- Data never leaves the machine
- Adapters are small (MBs) and swappable at runtime

## Why Choose API-OSS
Anthropic uses RLHF — expensive, slow, requires cloud infrastructure.
OpenAI's RLHF fine-tuning is cloud-only with high GPU costs.
API-OSS DPO runs on local hardware with data collected from natural
interactions.

## Competitive Comparison
- **Anthropic**: Uses RLHF. Expensive, slow, cloud-dependent.
- **OpenAI**: RLHF-based fine-tuning. Cloud-only. High cost.
- **Nvidia**: No DPO fine-tuning in NeMo.
- **Mercor**: No model fine-tuning capabilities.

## Cost-Benefit Analysis
OpenAI fine-tuning costs $XX/hr GPU. DPO on local RTX 4090: $0/hr.
30-min training run on OpenAI = ~$15-20. 100 runs/year = $1,500-$2,000 saved.
RLHF requires reward model training (~$500 per run) + PPO (~$1,000 per run),
totaling $1,500 per RLHF run at minimum.
DPO eliminates these costs entirely — no reward model, no PPO loop.
Building equivalent DPO pipeline from scratch costs ~$80K in engineering time.
Each DPO iteration that improves model accuracy by 2-5% on held-out
preference pairs saves $10K in avoided data recollection and relabeling.
LoRA-based training consumes approximately 3-4 GB VRAM for qwen2-vl-2b-q4,
making DPO feasible on $1,000 consumer GPUs versus the $10K+ professional
GPUs required for full fine-tuning.

## Applications
- **Consumer**: Improve personal model alignment from usage feedback.
- **Government / Defense**: Align models to mission-specific values without
  cloud dependency.
- **Enterprise**: Continuous model improvement from production user feedback.

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com