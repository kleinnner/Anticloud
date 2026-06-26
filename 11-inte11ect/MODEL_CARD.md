# Model Card: Inte11ect — Modular AI Platform

## Model Information

- **Model Name:** Inte11ect — Modular AI Platform
- **Version:** 0.1.0
- **Base Model:** Qwen 2.5 1.5B (Q4_K_M GGUF quantization)
- **Architecture:** Transformer decoder with 1.5B parameters
- **Tokenizer:** Qwen2 BPE (vocabulary size: 151,936)
- **Context Length:** 4096 tokens (default, configurable)
- **Precision:** Q4_K_M (4-bit k-quant mixed)
- **Module Count:** 71 Type-11 domain-expert modules + GOD-11 meta-cognitive orchestrator
- **Routing Mechanism:** Eigenvector Router — PCA-like projection into 72-dimensional module space with cosine similarity scoring
- **Orchestrator:** GOD-11 — meta-cognitive synthesis across modules with confidence scoring and shot training
- **RAG Engine:** SQLite-backed with 72 domain knowledge bases; context injection per module
- **Cryptographic Ledger:** .aioss — SHA3-256 hash chain with Ed25519 digital signatures
- **Inference Engine:** llama-server subprocess (CPU-only, 4 threads)
- **Format:** ChatML (`<|im_start|>system`, `<|im_end|>`, `<|im_start|>assistant`)
- **Developer:** L.-K. Alpasan / The Anticloud
- **License:** MIT

## Intended Use

### Primary Use Cases
- Local AI platform for domain-specific reasoning across 71 expert domains
- Multi-module deliberation via GOD-11 meta-cognitive orchestration
- RAG-augmented queries with per-module knowledge base injection
- Cryptographic audit trail for all inference interactions
- Research into eigenvector routing and module-based AGI simulacra

### Secondary Use Cases
- Educational tool for exploring domain-specific AI personas
- Development platform for testing modular reasoning architectures
- Benchmarking CPU-based local inference performance

### Out-of-Scope
- High-stakes automated decision-making without human review
- Medical diagnosis or treatment recommendations
- Legal advice without qualified human attorney review
- Critical infrastructure control systems
- Weapons or surveillance system integration
- Any use violating the USE_POLICY

## Training Data

Inte11ect uses Qwen 2.5 1.5B (Qwen/Qwen2.5-1.5B) as the base model, developed by Alibaba Cloud's Qwen team. No additional fine-tuning or training has been applied to the base model. The 71 module system prompts are hand-crafted heuristic templates that guide the base model's responses through prompt engineering rather than model training. RAG domain knowledge bases contain curated reference texts for each module's domain.

**Base Model Training Data:** The Qwen 2.5 series was trained on a diverse corpus including web texts, books, academic papers, code repositories, and multilingual data. See the [Qwen technical report](https://arxiv.org/abs/2407.10671) for full details.

## Evaluation

### Module Query Accuracy
The `test-harness.ps1` script tests 10 module endpoints with domain-specific queries:
- **Endpoints tested:** Sci-11, Code-11, Psy-11, Phil-11, Med-11, Eso-11, Law-11, Deus-11, Tech-11, Math-11
- **Success criteria:** Response length > 50 characters with valid JSON response
- **GOD-11 test:** Validates meta-cognitive mode with activated module reporting and eigenvector weights
- **Module info test:** Validates `/api/modules/{id}` endpoint returns complete module metadata

### Inference Performance
- **Speed:** ~8–10 tokens per second on modern CPU (4 threads)
- **First-token latency:** ~1–3 seconds (includes prompt processing)
- **Memory:** ~1.5 GB for model weights (GGUF Q4_K_M), ~200 MB for KV cache at 4096 context
- **RAG database:** Variable (inte11ect.db, grows with usage)
- **Power consumption:** ~25W typical during inference

### Quality Benchmarks (Base Qwen 2.5 1.5B)
The base model's performance on standard benchmarks (from Qwen technical report):
- MMLU: ~64.5%
- HumanEval: ~57.9%
- GSM8K: ~70.3%
- BBH: ~44.2%

Module-specific prompting may alter these baselines. Users should evaluate quality for their specific use cases.

## Environmental Impact

| Factor | Value |
|--------|-------|
| Hardware | CPU-only (no GPU) |
| Typical Power Draw | ~25W |
| Energy per Query | ~25–75 J (1–3s at 25W) |
| Estimated CO2 per Query | ~0.002–0.006 g CO2 (US grid avg) |
| vs Cloud LLM Inference | ~100x+ less energy (no network, no datacenter overhead) |
| Hardware Reuse | Runs on existing hardware, no specialized accelerators |

## Known Limitations

1. **1.5B parameter model** — Limited reasoning depth compared to larger models (7B, 13B, 70B+)
2. **CPU-only inference** — ~8–10 tok/s is suitable for interactive use but not real-time
3. **Heuristic module prompts** — Module system prompts are hand-tuned, not learned; quality may be inconsistent across modules
4. **No code execution sandbox** — The `sandbox/` directory exists but execution is not yet implemented; code output is text-only
5. **Module overlap** — 71 modules with distinct domains may produce overlapping or contradictory responses to boundary queries
6. **RAG quality** — Depends on the quality and relevance of locally provided documents; default knowledge is pre-curated
7. **No multimodal support** — Text-only inference; vision, audio, and other modalities are not supported
8. **Single-model architecture** — All modules share the same underlying model; module differentiation is achieved entirely through prompting

## Citation

```bibtex
@article{alpasan2026inte11ect,
  title={Inte11ect: Modular AGI Simulacra Platform with Eigenvector Routing and Cryptographic Audit},
  author={Alpasan, L.-K.},
  journal={The Anticloud Research Corpus},
  year={2026}
}
```

---

*L.-K. Alpasan & 0-1.gg 2026 — MIT License*

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com