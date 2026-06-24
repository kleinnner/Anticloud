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
