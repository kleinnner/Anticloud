---
title: "CLI Guide 02: Model Commands"
sidebar_position: 2
description: "Model commands manage LLM inference, model files, and configuration."
tags: [cli]
---

# CLI Guide 02: Model Commands

## Overview

Model commands manage LLM inference, model files, and configuration.

## Model List

```bash
# List all available models
api-oss model list

# List with details
api-oss model list --verbose

# Filter by source
api-oss model list --source huggingface
api-oss model list --source local
```

## Model Pull

```bash
# Download a model from HuggingFace
api-oss model pull Qwen/Qwen2-VL-2B-Instruct-GGUF

# With specific quantization
api-oss model pull Qwen/Qwen2-VL-2B-Instruct-GGUF --quant q4_k_m

# From custom URL
api-oss model pull https://example.com/models/my-model.gguf
```

## Model Info

```bash
# Show model metadata
api-oss model info qwen2-vl-2b-q4

# Show detailed configuration
api-oss model info qwen2-vl-2b-q4 --verbose
```

## Model Remove

```bash
# Remove a model
api-oss model rm qwen2-vl-2b-q4

# Force remove without confirmation
api-oss model rm --force qwen2-vl-2b-q4
```

## Model Serve

```bash
# Serve a model on the default port
api-oss model serve qwen2-vl-2b-q4

# Serve with custom parameters
api-oss model serve qwen2-vl-2b-q4 --port 8081 --ctx-length 4096 --gpu-layers 35

# List running model servers
api-oss model serve --list

# Stop a running model server
api-oss model serve --stop qwen2-vl-2b-q4
```

## Chat

```bash
# Interactive chat
api-oss chat -m qwen2-vl-2b-q4

# One-shot query
api-oss chat -m qwen2-vl-2b-q4 -p "Explain quantum computing in one sentence"

# With system prompt
api-oss chat -m qwen2-vl-2b-q4 -s "You are a helpful assistant" -p "What is AI?"

# Pipe input
echo "Hello" | api-oss chat -m qwen2-vl-2b-q4
```

## Complete (non-interactive)

```bash
# Generate completion
api-oss complete -m qwen2-vl-2b-q4 -p "The capital of France is"

# With temperature
api-oss complete -m qwen2-vl-2b-q4 -p "Once upon a time" --temperature 0.8

# Structured output (JSON Schema)
api-oss complete -m qwen2-vl-2b-q4 -p "Extract: John is 30" --response-format json_schema --schema '{"type":"object","properties":{"name":{"type":"string"},"age":{"type":"integer"}}}'
```

## Fine-Tuning

```bash
# Start LoRA fine-tuning
api-oss finetune lora --model qwen2-vl-2b-q4 --data ./training-data.jsonl

# Start DPO fine-tuning
api-oss finetune dpo --model qwen2-vl-2b-q4 --data ./preferences.jsonl

# List running fine-tuning jobs
api-oss finetune list

# Cancel a job
api-oss finetune cancel <job-id>
```

## Model Evaluation

```bash
# Run a benchmark suite
api-oss eval run --suite mmlu --model qwen2-vl-2b-q4 --samples 100

# Compare two models
api-oss eval compare --model-a qwen2-vl-2b-q4 --model-b llama-3.2-3b-q4 --suite gsm8k

# List evaluation results
api-oss eval list

# View leaderboard
api-oss eval leaderboard
```

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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