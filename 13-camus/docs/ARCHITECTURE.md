# Architecture

```
User → Camus Shell → llama.cpp → GGUF (Q4_K_M)
                 → Scoring (confidence, contradiction, humanity, accuracy)
                 → RAG (BM25 + FAISS + Eigen)
                 → Web Search (DuckDuckGo)
                 → ASCII Graphs (plotext)
                 → REST API (http.server, port 8080)
```

## Scoring Pipeline

```
Logprobs → avg logprob + margin + entropy → Confidence (30:40:30)
Embed(query)·Embed(response) → cosine → invert → Contradiction
Token stats → burstiness + Zipf + TTR → Humanity (30:35:35)
Weights: Acc=35%Conf + 35%(1-D) + 30%Hum → Composite=35%Acc + 25%Conf + 25%(1-D) + 15%Hum
```

## Hardware Detection

| RAM | n_ctx | GPU | n_gpu_layers |
|---|---|---|---|
| <4GB | 1024 | None | 0 |
| 4-8GB | 2048 | 1-2GB VRAM | 12 |
| 8-16GB | 4096 | 2-4GB VRAM | 24 |
| 16-32GB | 8192 | 4GB+ VRAM | -1 (all) |
