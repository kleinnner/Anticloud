---
title: "Fine-Tuning (LoRA)"
sidebar_position: 99
description: "Performs Low-Rank Adaptation (LoRA) fine-tuning on local hardware using"
tags: [features]
---

# Fine-Tuning (LoRA)

## What It Does
Performs Low-Rank Adaptation (LoRA) fine-tuning on local hardware using
datasets derived from annotations, conversation history, or uploaded data.
Produces lightweight adapter weights (MBs) that can be swapped at runtime.
Data never leaves the machine.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading fine-tuning
configuration from `opencode.json`.
The `finetune.rs` Rust module in `ai-oss-gateway/src/` manages the LoRA
training pipeline.

When fine-tuning is triggered (via CLI `finetune start` or WS message), the
module loads the base model (default: Qwen2-VL-2B-Instruct-Q4_K_M.gguf with
CUDA backend) and the training dataset.
The dataset can come from annotation campaigns (stored in SQLite via WS CRUD),
conversation logs in the ledger, or an uploaded JSONL file.

The module parses the dataset into a training format: input-output pairs for
supervised fine-tuning.
LoRA works by injecting trainable low-rank decomposition matrices into the
attention layers of the transformer.
The module applies LoRA to the query and value projection matrices with a
configurable rank (default 16) and alpha (default 32).

The base model weights are frozen — only the LoRA parameters (typically <1% of
total parameters) are updated during training.
Training uses the AdamW optimizer with cosine learning rate schedule and
optional warmup.
Hyperparameters (learning rate, batch size, LoRA rank/alpha, number of epochs,
weight decay, warmup steps) are configurable via CLI flags.

Training progress is displayed in the CLI with loss curves, learning rate, and
estimated time to completion.
The module supports gradient checkpointing to reduce memory usage, enabling
fine-tuning on consumer GPUs (RTX 4090 with 24GB VRAM can fine-tune 3B
parameter models).

After training, the LoRA adapter weights are saved to
`./data/adapters/<name>/` as a GGML-compatible file.
A metadata JSON file is saved alongside with the adapter name, base model
hash, training parameters, final loss, and timestamp.
The adapter can be loaded at runtime by specifying `--model <adapter_name>` —
the gateway loads the base model and applies the LoRA weights before inference.

Multiple adapters can coexist and be swapped without reloading the base model.
The module also supports adapter merging: `finetune merge` applies the LoRA
weights into the base model, producing a standalone fine-tuned model file.
All training metadata is recorded in the ledger.

The frontend `FinetuneView` (connected via WS to port 3030) displays training
progress with real-time loss charts and ETA.
The HTTP UI on port 8081 includes a Fine-tuning dashboard with training
history, adapter management, and dataset preview.
The 87 CLI commands include `finetune start`, `finetune cancel`, `finetune
list`, `finetune status`, `finetune merge`, and `finetune export`.

## How to Operate
1. Prepare a dataset. Annotations from the Studio are ready. Upload custom:
   `api-oss finetune dataset-prepare --file ./data.jsonl --format sft`.
2. Start training: `api-oss finetune start --name my_finetune --base-model
   qwen2-vl-2b-q4 --dataset annotation_campaign_3 --learning-rate 2e-4
   --epochs 5`.
3. Use the adapter: `api-oss model run --model my_finetune --prompt "Hello"`.
4. List adapters: `api-oss finetune list`.
5. Merge adapter: `api-oss finetune merge --adapter my_finetune --output
   ./models/merged.gguf`.
6. Cancel: `api-oss finetune cancel`.
7. Export: `api-oss finetune export --adapter my_finetune --output ./exports/`.
8. Configure defaults in `opencode.json`:
   ```json
   {
     "fine_tuning": {
       "lora": {
         "default_rank": 16,
         "default_lr": 2e-4,
         "default_epochs": 3,
         "gradient_checkpointing": true
       }
     }
   }
   ```

## The Moat
- Fine-tuning runs entirely on-premises — data never leaves
- LoRA adapters are small (MBs) and stored alongside base models
- No API call to a cloud fine-tuning endpoint
- Full control over hyperparameters
- Adapters swappable at runtime without reloading base model
- Consumer GPUs can fine-tune 3B parameter models

## Why Choose API-OSS
OpenAI's fine-tuning is cloud-only with data upload required.
Anthropic offers no fine-tuning at all.
API-OSS enables model customization on proprietary data without exposing it.

## Competitive Comparison
- **OpenAI**: Cloud-only. Data upload required. Limited hyperparameter control.
- **Anthropic**: No fine-tuning available.
- **Nvidia**: NeMo fine-tuning requires DGX cloud.
- **Palantir**: Foundry model customization requires AIP infrastructure.
- **Mercor**: No fine-tuning capabilities.

## Cost-Benefit Analysis
OpenAI fine-tuning costs $XX/hr GPU. Local: $0/hr.
50 fine-tunes/year = $1,500/year saved.
Inference on fine-tuned models: OpenAI $0.012/1K tokens vs local $0.
10M tokens/month = $120/month savings.
Building equivalent infrastructure costs ~$100K in engineering time.

## Applications
- **Consumer**: Fine-tune on personal writing style without cloud upload.
- **Government / Defense**: Adapt to classified domain language on air-gapped
  hardware.
- **Enterprise**: Domain-specific model variants for each business unit.
