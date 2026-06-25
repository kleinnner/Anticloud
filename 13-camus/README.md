# Camus

A terminal-native, local-first vision-language AI shell. Zero cloud, zero tracking, zero API keys.

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
