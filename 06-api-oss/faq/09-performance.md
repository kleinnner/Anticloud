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
