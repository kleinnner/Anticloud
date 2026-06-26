# Model Card: API-OSS

## Model Information

- **Name:** API-OSS (Agent-Predictive Intelligence Sovereign Operating System)
- **Version:** 1.0.0
- **Type:** AI Gateway Platform (not a single model — architectural gateway managing multiple models)
- **Architecture:** Multi-agent deliberation council engine + contradiction detection + cryptographic audit ledger + WASM sandbox
- **License:** Apache 2.0
- **Release Date:** 2026-06-24
- **Authors:** Alpasan, L.-K.

### Supported Base Models

API-OSS is model-agnostic and supports multiple base model families via its modelfile system:

| Family | Models | Type |
|--------|--------|------|
| Qwen 2.5 | 0.5B, 7B, 14B | LLM |
| Qwen2-VL | 2B, 7B | Vision-Language |
| Llama 3 | 1B, 3B, 8B | LLM |
| Mistral | 7B | LLM |
| Mixtral | 8x7B | LLM (MoE) |
| Phi-3 | Mini 3.8B, Medium 14B | LLM |
| DeepSeek Coder | 1.3B, 6.7B | Code LLM |
| Gemma 2 | 2B, 9B | LLM |
| LLaVA | 1.6 7B | Vision-Language |
| Stable Diffusion | 1.5, SDXL Turbo | Image Generation |
| Playground v2.5 | — | Image Generation |
| Whisper | base, small, medium | Speech-to-Text |
| Piper | English, Arabic | Text-to-Speech |

## Intended Use

### Primary Use
AI gateway platform with multi-agent deliberation councils for enterprise, compliance, and transparency. Designed for regulated institutions (government, defense, financial services, healthcare, legal) that require sovereign AI infrastructure with cryptographic audit trails.

### Secondary Use
- Model-agnostic inference across local LLMs
- Bias evaluation across demographic dimensions
- Fine-tuning (LoRA/DPO) on local hardware
- Red teaming and safety evaluation framework
- Knowledge graph construction and query
- Document ingestion and analysis
- Compliance evidence generation

### Out-of-Scope
- Cloud-only AI services
- Proprietary model training at scale
- Decision-making without human oversight
- Weapons development or targeting
- Mass surveillance beyond lawful authority

## System Architecture

```
User ──WebSocket── Gateway (Rust) ─┬─ LLM (local inference)
                                    ├─ Knowledge Graph (SQLite + FTS5)
                                    ├─ .aioss Ledger (SHA-256 hash chain)
                                    ├─ Contradiction Engine (3-layer)
                                    ├─ Council Engine (multi-agent)
                                    ├─ Guardrail Policies
                                    ├─ WASM Sandbox
                                    └─ Tool System (sandboxed, 11 tools)
```

### Core Components

| Component | Description |
|-----------|-------------|
| **Multi-Agent Council** | Risk, Legal, Strategist agents deliberate every output; weighted voting with written reasoning |
| **Contradiction Detection** | 3-layer engine: stance-based, semantic pair, graph-traversal inference |
| **Guardrail Policies** | Input/output scanning, jailbreak detection, toxicity checking, PII redaction |
| **WASM Sandbox** | Isolated plugin execution with path traversal protection |
| **Cryptographic Ledger** | SHA-256 hash-chained .aioss format; tamper-evident by design |
| **Model Registry** | Versioned model catalog with modelfile-based configuration |
| **Modelfile System** | Dockerfile-like declarative configuration (FROM, SYSTEM, TEMPLATE, PARAMETER) |
| **Bias Evaluation** | BBQ-methodology across race, gender, religion, age, socioeconomic, nationality dimensions |
| **Fine-Tuning** | LoRA/DPO on local hardware; adapters <1% of parameters; runtime swappable |

## Evaluation

### Multi-Model Benchmark Framework
- **MMLU**: 57-subject multi-task language understanding with few-shot prompting
- **GSM8K**: Grade-school math with chain-of-thought and exact-match scoring
- **HumanEval**: Function synthesis with pass@k metrics and sandboxed execution
- **HellaSwag**: Sentence completion with multiple-choice accuracy
- **ARC**: AI2 Reasoning Challenge (easy + challenge splits)
- All benchmarks run fully offline with SHA-256 verified cached datasets

### Safety Scoring
- **HarmBench**: 400+ adversarial prompts across cyberattack, physical harm, harassment, fraud, disinformation categories
- **Jailbreak Detection Score**: ML-based classifier (DistilBERT) with configurable threshold
- **Toxicity Score**: Per-dimension scoring (hate, harassment, violence, self-harm, sexual) with configurable thresholds
- **Red Team Security Score**: Automated adversarial attack campaigns with iterative deepening

### Bias Evaluation
- BBQ methodology across 8 demographic dimensions
- Per-dimension bias scores (-1 to +1) with bootstrap confidence intervals
- Reference baselines for GPT-4, Claude 3, Llama 3
- Custom template support for domain-specific axes

### Contradiction Detection Accuracy
- 3-layer detection: stance + semantic pair + graph-traversal inference
- Self-tuning thresholds based on false positive/negative rates
- Configurable severity and confidence scoring per contradiction

## Environmental Impact

- **Model-agnostic**: Energy consumption depends entirely on the chosen base model
- **CPU-only mode**: Smaller models (0.5B-3B) run efficiently on CPU
- **Efficiency through selection**: Match model size to task complexity
- **WASM sandbox**: Minimal overhead for plugin execution
- **Comparison**: Local inference eliminates cloud data center energy overhead
- Recommended: Qwen2.5-0.5B or Llama 3.2-1B for low-power deployments

## Known Limitations

1. **Platform complexity** requires configuration and system administration
2. **WASM sandbox** is still evolving; some plugins may require API stabilization
3. **Multi-agent deliberation** adds latency compared to single-model inference
4. **Model quality** depends entirely on the underlying model selected
5. **Contradiction detection** accuracy depends on knowledge graph population and embedding quality
6. **JavaScript/TypeScript UIs** require Node.js for development
7. **Fine-tuning** requires CUDA-capable GPU for practical training speeds
8. **No cloud AI fallback** — model quality limited to locally available models
9. **HarmBench evaluations** reflect only the specific model version tested
10. **Bias evaluations** are statistical and should not be treated as definitive

## Citation

```bibtex
@article{alpasan2026apioss,
  title={API-OSS: Sovereign AI Gateway Architecture with Multi-Agent Deliberation and Tamper-Evident Audit},
  author={Alpasan, L.-K.},
  journal={The Anticloud Research Corpus},
  year={2026}
}
```

---

*Generated: 2026-06-24*

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
