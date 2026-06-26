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