---
title: "AI-OSS Model Guide: Choosing and Running the Right AI Model"
sidebar_position: 99
description: "AI-OSS uses LlamaFile as its inference engine — a single, self-contained binary that runs AI models locally with no dependencies. This guide explains how model selection works."
tags: [features]
---

# AI-OSS Model Guide: Choosing and Running the Right AI Model

AI-OSS uses LlamaFile as its inference engine — a single, self-contained binary that runs AI models locally with no dependencies. This guide explains how model selection works.

## Why LlamaFile?

| Traditional AI Setup | LlamaFile Setup |
|---------------------|-----------------|
| pip install torch | wget llamafile |
| pip install transformers | chmod +x llamafile |
| pip install llama-cpp-python | ./llamafile --model model.gguf |
| And 47 other dependencies that break on your OS | **That's it. No Python. No CUDA. No dependency hell.** |

Key LlamaFile properties:

- Single .exe — runs on Windows, Linux, Mac
- Quantized models (GGUF format) — no GPU required
- Built-in HTTP server — gateway talks to it over HTTP
- Tool use support — select models can call functions
- MIT License — fully open source
- Automatic device detection — CPU/GPU/Vulkan/Metal

## The Recommended Model: Qwen2.5-7B-Instruct

**Primary model:** Qwen2.5-7B-Instruct-Q4_K_M.gguf

### Why Qwen2.5-7B?

1. **BUILT-IN TOOL USE** — Qwen2.5 was trained specifically for function calling. It outputs structured JSON tool calls that the gateway can parse and execute.
2. **32K CONTEXT WINDOW** — Can ingest entire contracts, memos, legal docs in a single context window.
3. **MULTILINGUAL** — Excellent English AND Chinese. EU/US/SG multi-jurisdiction work requires this.
4. **MIT LICENSED** — Qwen2.5 is Apache 2.0 — fully open, no commercial restrictions.
5. **QUANTIZATION-FRIENDLY** — The Q4_K_M quantization maintains 95%+ of quality while fitting in 6GB RAM.
6. **SMALL FOOTPRINT** — 4.3GB file size. Downloads in 3 minutes.

## Model Comparison Table

| Model | Size | RAM | VRAM | Speed | Tool Use |
|-------|------|-----|------|-------|----------|
| qwen2-vl-2b-q4-Q4_K_M | 1.8GB | 4GB | 2GB | 45 t/s | Good |
| Qwen2.5-7B-Instruct-Q4_K_M | 4.3GB | 6GB | 4GB | 25 t/s | Excellent |
| Qwen2.5-14B-Instruct-Q4_K_M | 8.5GB | 10GB | 6GB | 15 t/s | Excellent |
| Llama-3.2-3B-Instruct-Q4 | 2.0GB | 4GB | 2GB | 40 t/s | Decent |
| Mistral-7B-Instruct-v0.3 | 4.4GB | 6GB | 4GB | 22 t/s | Good |
| DeepSeek-7B-Chat-Q4_K_M | 4.5GB | 6GB | 4GB | 20 t/s | Good |

*Speed measured on: AMD Ryzen 7 5800X, no GPU. t/s = tokens per second (higher = faster)*

## Quantization Levels Explained

GGUF quantization levels (best → worst quality):

| Level | RAM (7B) | Quality | Use Case |
|-------|----------|---------|----------|
| Q8_0 | ~8GB | ~93% | Maximum quality, powerful machine |
| Q6_K | ~5.5GB | ~89% | Balanced quality/speed (recommended for 14B) |
| Q4_K_M | ~4.2GB | ~85% | Standard consumer machine (**RECOMMENDED**) |
| Q3_K_M | ~3.5GB | ~80% | Low RAM machines only |
| Q2_K | ~2.8GB | ~72% | Emergencies only |

## Hardware Recommendations

### Entry Level (~$0 extra)
- CPU: Intel i5/i7 (12th gen+) or AMD Ryzen 5/7
- RAM: 8GB
- Model: Qwen2.5-7B-Instruct-Q4_K_M
- Speed: ~12 tokens/sec (CPU, 4 threads)
- Status: **Fully works**

### Recommended (~$0 extra)
- CPU: Intel i7/i9 or AMD Ryzen 7/9
- RAM: 16GB
- GPU: Any GPU with 4GB VRAM (GTX 1660, RTX 3050+)
- Model: Qwen2.5-7B-Instruct-Q4_K_M
- Speed: ~30 tokens/sec (GPU acceleration)
- Status: **Excellent**

### Power User ($300–$600 GPU upgrade)
- GPU: RTX 3060 12GB or RTX 4070
- RAM: 16GB
- Model: Qwen2.5-14B-Instruct-Q4_K_M
- Speed: ~20 tokens/sec (GPU)
- Status: **Best-in-class local**

### Laptop / Mobile
- Apple Silicon M1/M2/M3 (8GB+ RAM) → Use MLX format, not GGUF
  - Model: mlx-community/Qwen2.5-7B-Instruct-4bit
  - Speed: ~40 tokens/sec (Metal)
- Android: Termux + LlamaFile APK
  - Model: qwen2-vl-2b-q4-Q4_K_M
  - Speed: ~8 tokens/sec (mobile CPU)

## Downloading Models

Primary source (HuggingFace):
```
https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-GGUF
```

Files to download: `Qwen2.5-7B-Instruct-Q4_K_M.gguf` (~4.3GB)

Where to save:
- Windows: `C:\Users\YOURNAME\.ai-oss\models\`
- Linux: `~/.ai-oss/models/`

Using the CLI:
```bash
aioss model install Qwen2.5-7B-Instruct-Q4_K_M
aioss model list
```

## Switching Models

```bash
aioss config set model.name "qwen2-vl-2b-q4-Q4_K_M"
aioss restart
```

## LlamaFile Command Reference

For power users who want to run LlamaFile directly:

```bash
# Basic server mode (gateway connects via HTTP)
llamafile \
  --model Qwen2.5-7B-Instruct-Q4_K_M.gguf \
  --host 127.0.0.1 \
  --port 8081 \
  --context-size 8192 \
  --threads 4 \
  --n-gpu-layers 0

# With GPU acceleration (NVIDIA CUDA)
llamafile \
  --model Qwen2.5-7B-Instruct-Q4_K_M.gguf \
  --host 127.0.0.1 \
  --port 8081 \
  --context-size 8192 \
  --n-gpu-layers 99

# With Vulkan (cross-vendor GPU)
llamafile \
  --model Qwen2.5-7B-Instruct-Q4_K_M.gguf \
  --host 127.0.0.1 \
  --port 8081 \
  --context-size 8192 \
  --gpu vulkan

# With Apple Silicon Metal
llamafile \
  --model Qwen2.5-7B-Instruct-Q4_K_M.gguf \
  --host 127.0.0.1 \
  --port 8081 \
  --context-size 8192 \
  --gpu metal
```

## Model Performance Notes

**What 7B Q4 does well:**
- Summarizing legal documents
- Identifying contract risks
- Writing professional memos and CTAs
- Multi-step reasoning (with chain-of-thought)
- Multilingual (English + Chinese + EU languages)
- Tool use (graph_search, file_read, etc.)

**Where 7B struggles:**
- Long documents (>32K tokens) — use RAG instead
- Very niche legal jargon — fine-tune for better results
- Real-time financial calculations — use a tool for math
- Multi-modal (images, PDFs with images) — not supported

## Upgrade Path

| Stage | Model | Timeline |
|-------|-------|----------|
| MVP (Now) | Qwen2.5-7B-Instruct-Q4_K_M | Everyone can run this |
| v2 | Qwen2.5-14B-Instruct-Q4_K_M | 3 months (needs 10GB RAM/6GB VRAM) |
| v3 | DeepSeek-V3-7B or next-gen | 6 months (swap GGUF file) |
| Enterprise | 70B model on dedicated server | Just a different model file |

**The beauty: You never change the code. Just change the model.**

## See Also

Related features, architecture, and roadmap documentation.

- [Features Overview](../features/README.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [API Reference](../api-reference/01-overview.md)
- [Roadmap](../roadmap/01-product-vision.md)

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
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
