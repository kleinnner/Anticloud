---
title: "Glossary 2: Core Concepts"
sidebar_position: 2
description: "Documentation for Glossary 2: Core Concepts"
tags: [glossary]
---

# Glossary 2: Core Concepts

## Terms

### AI (Artificial Intelligence)
- Machine-based systems that perform tasks requiring human-like intelligence
- In API-OSS: powers chat, search, analysis, and automation features

### Model
- A trained neural network that can process inputs and generate outputs
- API-OSS supports multiple model formats: GGUF, GPTQ, AWQ, and more

### Inference
- The process of running a model to generate a response
- API-OSS performs inference locally (no cloud required)

### Training
- The process of teaching a model on a dataset
- API-OSS supports fine-tuning via LoRA adapters

### Fine-Tuning
- Taking a pre-trained model and training it further on domain-specific data
- API-OSS supports LoRA fine-tuning natively

### Quantization
- Reducing model precision (e.g., FP16 → INT4) to reduce size and speed up inference
- API-OSS supports Q2–Q8 quantization levels

### Token
- The basic unit of text processing (roughly 0.75 words)
- Models have context limits measured in tokens (e.g., 4K, 32K, 128K)

### Context Window
- The maximum number of tokens a model can process at once
- API-OSS supports sliding window for extended context

### Prompt
- The input text given to a model to elicit a response
- API-OSS supports system prompts, user prompts, and multi-turn conversations

### Embedding
- A numerical vector representation of text
- Used for search, clustering, and similarity analysis in API-OSS

### RAG (Retrieval-Augmented Generation)
- Combining search retrieval with model generation
- API-OSS indexes documents and retrieves relevant context for queries

### Agent
- An AI system that can use tools, make decisions, and execute tasks autonomously
- API-OSS supports multi-agent orchestration via the Council Engine

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)
