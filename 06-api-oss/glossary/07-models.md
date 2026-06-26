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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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