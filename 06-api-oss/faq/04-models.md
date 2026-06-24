---
title: "MODELS — FREQUENTLY ASKED QUESTIONS"
sidebar_position: 4
description: "GGUF format only. This is the standard format for llama.cpp-compatible models."
tags: [faq]
---

# MODELS — FREQUENTLY ASKED QUESTIONS

## What model formats are supported?

GGUF format only. This is the standard format for llama.cpp-compatible models.

## Where do I get models?

Download from Hugging Face, your own fine-tuned models, or any source providing GGUF files. We do not distribute model files — you must provide your own.

## What models are recommended?

Quantised Qwen2.5 models (1.5B to 7B parameters) are recommended for the best balance of quality and performance. Larger models (13B-70B) work but require more RAM/VRAM.

## Can I use GPT-4 or Claude models?

No. API-SOS runs entirely locally with no cloud dependency. GPT-4 and Claude are cloud-only. You are limited to open-weight models you can download and run yourself.

## How do I switch between models?

Change `model.model_path` in the configuration file, or use the CLI: `api-oss config set model_path ./data/models/new-model.gguf`. The system will pick up the change on the next inference request.

## Does API-SOS support multimodal models?

Yes. Set `model.model_type` to `vl` (vision-language) and provide a vision encoder GGUF file via `model.vision_encoder_path`. The system will load both the base model and the encoder.

## Can I use a GPU?

Yes. Set `model.backend` to `cuda` and `model.n_gpu_layers` to the number of layers to offload (default 0 = CPU only). Requires a CUDA-compatible NVIDIA GPU and the CUDA runtime.

## Why is my model not loading?

Common causes: the GGUF file is corrupt (redownload), the model architecture is unsupported, the model requires more RAM/VRAM than available, or `model.model_path` points to a non-existent file. Enable debug logging for details: `api-oss config set log_level debug`.

## Can I fine-tune the model?

Yes. Fine-tuning is available via the RLHF system (collects ratings and auto-fine-tunes) or via the external llama-finetune binary. See the finetune section in the configuration reference.

## How do I know what model is currently loaded?

Use the Model Manager in the frontend UI (ModelCard view) or the CLI: `api-oss status` shows the active model path and type.

## See Also

Related FAQ, support, and troubleshooting documentation.

- [FAQ Index](../faq/01-general.md)
- [Support Guide](../support/01-getting-help.md)
- [Troubleshooting](../troubleshooting/01-app-wont-start.md)
- [User Manual](../user-manual/01-getting-started.md)
