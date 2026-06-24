---
title: "Glossary 7: Model Glossary"
sidebar_position: 7
description: "Documentation for Glossary 7: Model Glossary"
tags: [glossary]
---

# Glossary 7: Model Glossary

## Terms

### LLM (Large Language Model)
- Large neural network trained on massive text data
- Examples: Llama 3, Mistral, GPT-4, Phi-3

### SLM (Small Language Model)
- Smaller, more efficient language model
- Examples: Phi-3 Mini (3.8B), Gemma 2B, TinyLlama

### GGUF (GPT-Generated Unified Format)
- File format for quantized models (successor to GGML)
- Primary format used by llama.cpp and API-OSS

### GGML (GPT-Generated Model Language)
- Original format for quantized models (deprecated, replaced by GGUF)

### GPTQ (GPT Post-Training Quantization)
- Quantization method for GPU inference
- Supports INT4/INT8 quantization

### AWQ (Activation-Aware Weight Quantization)
- Quantization method that considers activation patterns
- Higher accuracy than GPTQ at same bitrate

### LoRA (Low-Rank Adaptation)
- Efficient fine-tuning method (trainable adapters instead of full model)
- API-OSS supports LoRA adapters natively

### QLoRA (Quantized LoRA)
- LoRA applied to quantized models
- Enables fine-tuning on consumer GPUs

### Adapter
- Small trainable module added to a base model
- API-OSS stores adapters separately from base model

### Context Length / Context Window
- Maximum tokens a model can process in one pass
- API-OSS supports extended context via sliding window

### Temperature
- Controls randomness in model output (0 = deterministic, 1 = creative)
- API-OSS supports per-query temperature setting

### Top-P (Nucleus Sampling)
- Limits token selection to top probability mass
- Used with temperature for controlled generation

### Top-K
- Limits token selection to K most likely tokens
- Alternative to top-p for output control

### Repetition Penalty
- Penalizes tokens that already appeared in output
- Prevents repetitive text generation

### System Prompt
- Initial instruction that sets model behavior
- API-OSS supports hierarchical system prompts

### Streaming
- Real-time token-by-token output delivery
- API-OSS supports SSE and WebSocket streaming

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)
