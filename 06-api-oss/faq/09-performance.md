---
title: "PERFORMANCE — FREQUENTLY ASKED QUESTIONS"
sidebar_position: 9
description: "Inference speed depends on model size, hardware, and quantisation. A 7B model on CPU typically produces 2-5 tokens per second. For faster inference: use a GPU (set `model.backend` to `cuda` and increa"
tags: [faq]
---

# PERFORMANCE — FREQUENTLY ASKED QUESTIONS

## The model is responding very slowly.

Inference speed depends on model size, hardware, and quantisation. A 7B model on CPU typically produces 2-5 tokens per second. For faster inference: use a GPU (set `model.backend` to `cuda` and increase `n_gpu_layers`), use a smaller or more heavily quantised model, or reduce `model.context_length`.

## GPU is not being used.

Check that `model.backend` is set to `cuda` and `model.n_gpu_layers` is greater than 0. Verify that the CUDA runtime is installed and the GPU is detected by running `nvidia-smi`. Check the gateway logs for CUDA initialisation messages.

## Memory usage is very high.

llama.cpp models load entirely into RAM (or VRAM). A 7B Q4_K_M model uses approximately 4-5 GB. Reduce `model.context_length` from 4096 to 2048 to lower memory usage. Use a smaller model or a more aggressive quantisation (Q2_K or Q3_K).

## The contradiction engine makes responses slower.

The contradiction engine runs on a configurable interval (`contradiction_engine.scan_interval_ms`). Increase the interval (e.g., from 60 000 ms to 120 000 ms) to reduce frequency. Disable it entirely by setting `contradiction_engine.enabled` to `false`.

## RAG is slow for large document collections.

The knowledge graph uses SQLite FTS5 under the hood. Ensure `rag.max_context_nodes` is not set too high (default 5). Monitor `rag.min_similarity` — a higher threshold means fewer nodes are retrieved, improving speed. Consider embedding on ingest only (`rag.embed_on_ingest`).

## The frontend feels sluggish.

Large conversation histories (thousands of messages) or graph visualisations with many nodes can slow down the browser. Archive old conversations. In the graph view, use the search and filter tools to reduce the number of visible nodes.

## Can I run on CPU only?

Yes. Set `model.backend` to a CPU-only value and `model.n_gpu_layers` to 0. Performance will be slower but the system will work without a GPU.

## How do I monitor performance?

The metrics endpoint (`http://localhost:8081/metrics`) exposes inference time, request count, memory usage, and system health. Use the Ops Center Dashboard in the frontend for a visual overview.

## What is active learning and how does it affect performance?

Active learning automatically selects high-value data points for annotation or fine-tuning. It runs in the background and has minimal impact on runtime performance. Configure it in the active-learning section of the config.

## See Also

Related FAQ, support, and troubleshooting documentation.

- [FAQ Index](../faq/01-general.md)
- [Support Guide](../support/01-getting-help.md)
- [Troubleshooting](../troubleshooting/01-app-wont-start.md)
- [User Manual](../user-manual/01-getting-started.md)

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
