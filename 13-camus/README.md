# Camus

A terminal-native, local-first vision-language AI shell. Zero cloud, zero tracking, zero API keys.

[![Hugging Face](https://img.shields.io/badge/Models-HuggingFace-FFD21E?style=flat-square&logo=huggingface)](https://huggingface.co/Anticloud)
[![Harvard Dataverse](https://img.shields.io/badge/Data-Harvard%20Dataverse-8B4513?style=flat-square&logo=dataverse)](https://dataverse.harvard.edu/dataverse/anticloud)
[![Zenodo](https://img.shields.io/badge/Research-Zenodo-1682D4?style=flat-square&logo=zenodo)](https://zenodo.org/search?q=anticloud)

```
python camus.py
```

---

## Quick Start

```bash
pip install llama-cpp-python numpy rich ddgs plotext
python camus.py
```

Model and vision projector auto-detected from `models/`.

## Benchmarks (measured on 8-core CPU, 32GB RAM)

| Setting | Tokens/sec | First token | Memory |
|---|---|---|---|
| ctx=2048 | 0.58 | 0.34s | 260 MB |
| ctx=4096 | 0.55 | 0.76s | 317 MB |
| Flash attention | 0.69 | 0.31s | 260 MB |

Full benchmark data at `docs/BENCHMARKS.md`.

## Features

- **Local inference** — Qwen2-VL-2B Q4_K_M, CPU-only, no GPU required
- **Vision understanding** — Describe images, OCR, visual Q&A
- **Four-bar scoring** — Accuracy, Confidence, Contradiction, Humanity per response
- **Hybrid RAG** — BM25 + FAISS + Eigenvector search with Reciprocal Rank Fusion
- **Web search** — DuckDuckGo integration, no API key needed
- **ASCII graphs** — `/graphify bar|line|pie|scatter`
- **Streaming** — Tokens appear as generated
- **REST API** — OpenAI-compatible on port 8080
- **Session persistence** — `/save` and `/load`

## Commands

| Command | Description |
|---|---|
| `/graphify bar A:10 B:25 C:40` | Bar chart |
| `/graphify line 2 4 3 5 7 6` | Line chart |
| `/graphify pie a:30 b:40 c:30` | Pie chart |
| `/search <query>` | Web search |
| `/status` | System info |
| `/settings` | Configuration |
| `/save <name>` | Save session |
| `/load <name>` | Load session |
| `/clear` | Clear history |
| `/help` | All commands |

## API

```bash
python camus.py --api --port 8080
curl http://localhost:8080/v1/chat/completions \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

## Files

```
camus/
├── camus.py                           # Shell
├── camus.json                         # Config
├── MODEL_CARD.md / LICENSE / CITATION.cff
├── SECURITY.md / USE_POLICY.md
├── docs/ (10 files)                   # Full documentation
├── articles/ (20 papers)             # Research papers
├── cookbook/README.md                 # Examples
└── models/
    ├── camus-2b-vl-q4_k_m.gguf        # Model (940 MB)
    └── mmproj-camus-2b-f32.gguf       # Vision projector (2.5 GB)
```

## License

MIT (shell code). Base model derived from Qwen2-VL-2B-Instruct (Apache 2.0).

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