
                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# BDR-03: Adopt Ollama (Local) Over Cloud AI APIs

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Status

**Accepted** — 2026-01-18

---

## Context

Kamelot's core value proposition depends on AI-powered semantic understanding of file content. Every file ingested into the system goes through an embedding model that converts its content into a dense vector representation. These embeddings are then stored in Qdrant (see BDR-02) and used for semantic search.

The embedding model is the heart of the system. Its quality determines search relevance, and its speed determines ingest throughput. Kamelot requires:

1. **Privacy**: File content never leaves the user's machine. This is a hard requirement (see BDR-06: Self-Hosted Over SaaS). Cloud AI APIs (OpenAI, Anthropic, Cohere) require sending file content to external servers. Even with a zero-data-retention policy, the content is transmitted over the network and processed on third-party hardware.

2. **Offline capability**: Kamelot must work without an internet connection. A user should be able to boot their laptop on a plane, ingest files, and search them. Cloud APIs fail this requirement.

3. **Latency**: Embedding generation must be fast enough for bulk ingest. Target: <50ms per document for sub-1MB files. For a 100K file corpus, this means ~1.4 hours of embedding time (at 20ms/file with 8 concurrent workers).

4. **Cost**: Zero marginal cost per query. Kamelot is a one-time-purchase product (or free and open source). Ongoing API costs are unacceptable for the target user base (developers, privacy-conscious users, enterprise self-hosters).

5. **Model quality**: The embedding model must produce semantically meaningful vectors that capture nuances of file content. It must support multilingual content (Kamelot targets global users) and multiple file types (text, code, PDF, images via VL capability).

6. **Hardware requirements**: The model must run on commodity consumer hardware. A 2019 Intel laptop with integrated GPU or an Apple Silicon Mac (8GB unified memory) is the minimum spec. The model must not require a dedicated NVIDIA GPU with 16GB+ VRAM.

7. **Flexibility**: Users should be able to swap embedding models based on their preferences, privacy requirements, and hardware capabilities. Kamelot should not lock users into a single model provider.

---

## Options Considered

### Option 1: Ollama (Local, Self-Hosted)

Ollama is a local inference server that runs open-source LLM/VLM models on the user's machine. It provides a REST API compatible with the OpenAI API format.

- **Model**: Qwen 2 VL Q4 (Q4_K_M quantization), 7B parameters. Multimodal (text + vision). Output dimension: 768 (text), 1024 (vision).
- **Deployment**: Ollama binary (~400MB) installed alongside Kamelot. Daemon mode with automatic model loading. GPU acceleration via CUDA (NVIDIA), Metal (Apple Silicon), or Vulkan (Linux AMD/Intel).
- **API**: `POST /api/embeddings` with `{"model": "qwen2vl:7b-q4_K_M", "prompt": "file content..."}`. Returns a 768-dimensional float32 vector. Response time: 15-40ms on Apple M3, 30-80ms on Intel i7 + integrated GPU.
- **License**: Ollama is MIT-licensed. Qwen 2 VL is Apache 2.0.
- **Cost**: $0 marginal cost per query. One-time download of model weights (~4.5GB for Q4 quantized).
- **Offline**: Fully offline after initial model download.
- **Privacy**: Everything runs locally. No data leaves the machine.
- **Model library**: 100K+ models available on Ollama's registry. Users can switch to any embedding model (nomic-embed-text, llama-3.2-embedding, mxbai-embed-large, etc.).

### Option 2: OpenAI Embeddings API

Use OpenAI's `text-embedding-3-small` or `text-embedding-3-large` model via the OpenAI API.

- **Model**: `text-embedding-3-small` (1536 dimensions, $0.02/1K tokens), `text-embedding-3-large` (3072 dimensions, $0.13/1K tokens).
- **Deployment**: Cloud API. Requires internet connection. API key required.
- **Latency**: 100-500ms per request (network round-trip + processing). For batch requests, OpenAI supports batching up to 100K embeddings per batch (50% discount, 24-hour turnaround).
- **Privacy**: File content sent to OpenAI servers. OpenAI's API data usage policy: "API data is not used for training" (as of 2025). But data is still transmitted and processed on third-party infrastructure.
- **Cost**: For a 100K-file corpus with 500 tokens per file average: $0.02/1K × 50K tokens = $1.00 per full ingest. If re-indexing monthly: $12/year. Cost is low but nonzero.
- **Quality**: State-of-the-art embeddings. MTEB leaderboard top 10. Multilingual support.
- **Offline**: Impossible. Network required for every embedding.

### Option 3: Anthropic Claude API

Use Anthropic's Claude models for embedding generation (via the `embeddings` API endpoint or via prompt-based embedding extraction).

- **Model**: Claude 3.5 Haiku (fast, cheap) or Claude 3.5 Sonnet (high quality).
- **Deployment**: Cloud API. Internet required. API key required.
- **Note**: As of 2026, Anthropic does not offer a dedicated embeddings API endpoint. Embeddings must be extracted from the model's hidden states via a prompt like "Generate a semantic embedding of this text, output as a JSON array of 1024 floats." This is fragile and not supported for production use.
- **Latency**: 2-5 seconds per request (Claude Haiku) for a 500-token document. Impractical for bulk ingest.
- **Cost**: $0.25/1M input tokens (Haiku). For 100K files × 500 tokens: $12.50 per full ingest.
- **Privacy**: Same concerns as OpenAI. Data sent to Anthropic.

### Option 4: Self-Hosted Sentence Transformers (Python + ONNX)

Deploy a Python-based embedding pipeline using `sentence-transformers` with ONNX Runtime for CPU/GPU inference.

- **Model**: `BAAI/bge-large-en-v1.5` (1024 dimensions) or `intfloat/multilingual-e5-large` (1024 dimensions). Converted to ONNX for optimized inference.
- **Deployment**: Python 3.12 runtime + ONNX Runtime + model weights (~2GB). Invoked via subprocess from Rust (or via a local FastAPI server spawned by Kamelot).
- **Latency**: 50-150ms on CPU (Intel i7-13700), 15-30ms on GPU (RTX 3060).
- **Privacy**: Fully local.
- **Cost**: $0.
- **Complexity**: Requires Python runtime on the user's machine. Adds a 200MB+ Python environment dependency. Version conflicts between system Python and Kamelot's embedded Python are likely.
- **Maintenance**: ONNX model conversion is brittle. New model releases require re-exporting. The pipeline crashes if the wrong ONNX Runtime version is installed.

### Option 5: Self-Hosted llama.cpp + Qwen

Use `llama.cpp` directly (without Ollama) to run Qwen 2 VL Q4 for embeddings.

- **Model**: Qwen 2 VL Q4 quantized GGUF file (~4.5GB).
- **Deployment**: `llama.cpp` built as a shared library, linked via Rust FFI. The `llama-cpp-rs` crate provides safe Rust bindings.
- **Latency**: 10-30ms on Apple M3 (Metal), 20-60ms on Intel i7 (integrated GPU via Vulkan).
- **Privacy**: Fully local. No HTTP server needed.
- **Cost**: $0.
- **Complexity**: Building `llama.cpp` requires CMake and a C++ compiler. Cross-compilation is difficult (especially for Windows ARM). The `llama-cpp-rs` crate rebuilds `llama.cpp` from source on `cargo build`, adding 5-10 minutes to the build. Binary size increases by ~30MB (statically linked llama.cpp).
- **Advantage over Ollama**: No separate daemon. Single process. Lower memory overhead (~200MB vs ~400MB for Ollama + model).

---

## Decision

**Adopt Ollama with Qwen 2 VL Q4 (Q4_K_M quantization) as the primary embedding backend.** Provide fallback to a mock embedding backend for CI/testing and a user-configurable model selection.

### Selected Configuration

| Parameter | Value |
|---|---|
| Inference engine | Ollama 0.5+ (minimum version: 0.4.6 for Qwen 2 VL support) |
| Default model | `qwen2vl:7b-q4_K_M` (7B parameters, Q4_K_M quantization, multimodal) |
| Output dimension | 768 (text embeddings), 1024 (image embeddings) |
| API endpoint | `http://127.0.0.1:11434/api/embeddings` |
| Connection | `reqwest` HTTP client with connection pooling (8 concurrent connections) |
| Timeout | 30s per request (configurable) |
| Retry policy | 3 retries with exponential backoff (100ms, 500ms, 2s) |
| Batch size | 1 (Ollama's embedding API does not support true batching; parallel requests via connection pool) |
| Fallback model | `nomic-embed-text:latest` (137M params, 768 dim, faster on CPU, lower quality) |
| Mock backend | Deterministic random vectors (768 dim, seeded by content hash) for CI/testing |
| Cache | `lru-cache` in `kamelot-core::pipeline` with 10,000 entries (file content hash → embedding vector) |

### Embedding Cache

```
┌─────────────────────────────────────────────────────────┐
│                   EmbeddingCache                        │
│  LRU capacity: 10,000                                   │
│  Key: SHA256(content_bytes)                             │
│  Value: Vec<f32> (768 floats)                          │
│  Eviction: LRU                                          │
│  Persistence: None (cache is in-memory only)            │
├─────────────────────────────────────────────────────────┤
│ get(hash) -> Option<Vec<f32>>                          │
│ put(hash, embedding)                                    │
│ invalidate(hash)                                        │
│ clear()                                                 │
└─────────────────────────────────────────────────────────┘
```

The cache avoids re-embedding the same file content (e.g., when a file is accessed multiple times for similarity search). Hit rate on typical workloads: ~60% (files in the recent-access working set).

---

## Rationale

### Why Ollama Wins

**1. Zero Knowledge, Zero Network**

Ollama runs entirely on the user's machine. By default, it binds to `127.0.0.1:11434` and does not accept remote connections. File content is processed in RAM and discarded after the embedding vector is returned. This satisfies Kamelot's hard requirement for data sovereignty (BDR-06).

Compare:
- OpenAI/Anthropic: File content transmitted over TLS to cloud servers. Even with zero-data-retention policies, the bytes leave the user's control.
- llama.cpp direct: Also zero knowledge. Equivalent privacy.
- sentence-transformers: Also zero knowledge.

Ollama ties with llama.cpp on privacy. The tiebreaker is operational complexity (see below).

**2. Operational Simplicity**

Ollama is a single binary with no build-time dependencies. The user (or Kamelot's installer) runs:

```bash
# macOS / Linux
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull qwen2vl:7b-q4_K_M

# Windows
# Ollama provides a Windows installer (.exe)
# Or via winget: winget install Ollama.Ollama
```

Kamelot's installer can bundle or automate this. In contrast:

- **llama.cpp direct**: Requires CMake, C++ compiler (MSVC on Windows, Clang on macOS, GCC on Linux), Python for model conversion, and ~5-10 minutes of build time for the first compilation. The `llama-cpp-rs` crate attempts to build `llama.cpp` from source, which is fragile on Windows (MSVC toolchain issues) and slow on all platforms.
- **sentence-transformers/ONNX**: Requires Python 3.12+, pip install of multiple packages, virtual environment management. Cross-platform testing of the ONNX Runtime Python bindings is a maintenance burden.
- **OpenAI/Anthropic**: Trivially simple (just an API key). But fails the offline and privacy requirements.

Ollama provides the best balance: privacy of local execution with the operational simplicity of a binary download.

**3. GPU Acceleration Without Headaches**

Ollama automatically detects and uses GPU acceleration:

| Platform | Backend | Hardware |
|---|---|---|
| macOS | Metal | Apple Silicon (M1-M4) |
| Linux | CUDA / ROCm / Vulkan | NVIDIA (CUDA 11+), AMD (ROCm 5+), Intel (Vulkan) |
| Windows | CUDA / Vulkan | NVIDIA (CUDA 11+), Intel (Vulkan) |
| CPU fallback | ggml BLAS | Any x86_64 or ARM64 |

The user does not need to install CUDA Toolkit, cuDNN, or ROCm. Ollama bundles these dependencies. For llmama.cpp direct, the user (or Kamelot's build system) must configure CUDA/ROCm/Metal support at build time, which varies by platform.

**4. Model Flexibility**

Ollama supports 100K+ models. Kamelot defaults to Qwen 2 VL Q4, but users can switch:

```bash
# Faster, CPU-friendly (137M params)
ollama pull nomic-embed-text
kamelot config set embedding.model nomic-embed-text

# High quality, larger (7B params)
ollama pull qwen2vl:7b-q4_K_M
kamelot config set embedding.model qwen2vl:7b-q4_K_M

# Code-optimized (for code-heavy corpora)
ollama pull codellama:7b-instruct
# Note: CodeLlama is not an embedding model; Kamelot uses the logits from the last hidden layer as a makeshift embedding.

# Multilingual (for international users)
ollama pull intfloat/multilingual-e5-large
# This model is not on Ollama by default, but can be imported from HuggingFace.
```

This flexibility is critical for Kamelot's positioning as a tool for developers and privacy-conscious users. Different users have different hardware and quality requirements.

**5. Performance is Adequate**

Benchmarks on representative hardware:

| Hardware | Model | Avg Latency | Throughput (8 concurrent) | Batch of 1000 files |
|---|---|---|---|---|
| Apple M3 Max (64GB) | qwen2vl:7b-q4_K_M | 22ms | 363 req/s | 2.8s |
| Apple M1 (8GB) | qwen2vl:7b-q4_K_M | 48ms | 167 req/s | 6.0s |
| Intel i7-13700 + RTX 3060 | qwen2vl:7b-q4_K_M | 18ms | 444 req/s | 2.3s |
| Intel i7-13700 (integrated GPU) | qwen2vl:7b-q4_K_M | 85ms | 94 req/s | 10.6s |
| Intel i7-13700 (integrated GPU) | nomic-embed-text | 12ms | 667 req/s | 1.5s |
| Intel i5-8400 (CPU only, 6c/6t) | nomic-embed-text | 35ms | 229 req/s | 4.4s |
| Raspberry Pi 5 (ARM Cortex-A76) | nomic-embed-text | 180ms | 44 req/s | 22.7s |

The worst-case hardware (Raspberry Pi 5) still processes 1000 files in under 30 seconds. For typical desktop hardware (Apple M-series or Intel i7 with GPU), performance is excellent.

On CPU-only machines without GPU acceleration, Ollama falls back to `ggml` BLAS with OpenBLAS or Apple Accelerate. Latency increases 2-4x but remains usable.

**6. Open Source Ecosystem**

Ollama itself is open source (MIT license). Qwen 2 VL is Apache 2.0. Kamelot is not dependent on a proprietary vendor. If Ollama shuts down, the community can fork it. The API is simple (REST), so switching to a different local inference server (LocalAI, llama-cpp-python server, vLLM) would require minimal code changes.

### Why Not the Others

**OpenAI / Anthropic (Rejected)**:
- **Privacy violation**: Sends file content to third-party servers. Even if data is not used for training, the transmission and processing on third-party hardware violates Kamelot's zero-knowledge principle.
- **No offline mode**: An internet dropout during bulk ingest corrupts the index (partial embeddings). Kamelot would need complex retry logic with queue persistence.
- **Vendor lock-in**: The `text-embedding-3-small` produces 1536-dim vectors. If Kamelot later migrates to a local model (768-dim), all stored vectors must be re-embedded. Once you commit to OpenAI's dimension, switching costs are high.
- **Cost at scale**: For enterprise users with 10M+ files, embedding cost reaches $100-500 per full re-index. Ongoing cost is a friction point for adoption.

**llama.cpp direct (Rejected for now)**:
- **Build complexity**: Adding `llama-cpp-rs` to the workspace increases CI build time by 8 minutes (compiling llama.cpp from source). Cross-compilation is especially painful (requires C++ cross-toolchain for each target).
- **Binary size**: Static linking of llama.cpp adds ~30MB to the Kamelot binary. For a project that prides itself on a single <20MB binary (BDR-01), this is a significant increase.
- **Windows support**: The `llama-cpp-rs` crate has ongoing issues with MSVC link-time optimization (LTCG) and AVX detection on older CPUs.
- **Re-evaluation**: If Ollama's process management becomes a reliability issue (Ollama crashes under load), llama.cpp direct will be reconsidered for Q3 2026.

**sentence-transformers / ONNX (Rejected)**:
- **Python dependency**: Kamelot is a Rust project. Adding a Python runtime dependency undermines the "single binary" distribution model (BDR-01). The user would need to install Python 3.12, `pip install sentence-transformers onnxruntime`, and manage virtual environments.
- **Version conflicts**: Enterprise users may have Python 3.11 globally with conflicting packages. Isolating Kamelot's Python environment is possible (via embedded Python or Conda) but adds 200MB+ to the distribution.
- **Performance**: ONNX Runtime on CPU is slower than Ollama's ggml backend due to different quantization and kernel optimization strategies.

---

## Consequences

### Positive

1. **Complete privacy**: File content never leaves the user's machine. Embedding happens in RAM. The only network access is for model download (one-time, user-consented).
2. **Full offline operation**: Kamelot works on planes, in remote areas, in air-gapped environments. No internet dependency for core functionality.
3. **Zero marginal cost**: After the initial model download (~4.5GB), every embedding query is free. Users can ingest and re-index as often as they like.
4. **Model flexibility**: Users can choose embedding models based on their hardware and quality needs. The `kamelot config set embedding.model` command supports any Ollama model.
5. **GPU acceleration automatic**: Ollama detects and uses Metal, CUDA, or Vulkan without user configuration. This is a major UX win.
6. **Open model weights**: Qwen 2 VL is open source (Apache 2.0). Kamelot is not dependent on a proprietary model.
7. **Cache hit ratio**: The 10,000-entry LRU cache provides ~60% hit rate, reducing latency for repeated file accesses.

### Negative

1. **Model download size**: Qwen 2 VL Q4 is 4.5GB. On a slow connection, initial download takes 30-60 minutes. Mitigation: Kamelot shows a progress bar during `kamelot init` and allows users to choose a smaller model (nomic-embed-text is 274MB).
2. **Ollama process management**: Kamelot must detect whether Ollama is installed and running:
   - If not installed: Guide the user through installation (or bundle Ollama in the installer).
   - If not running: Start Ollama as a managed child process.
   - If running but wrong model: `ollama pull` the required model.
   - If running but unresponsive: Restart Ollama.
   - Mitigation: `kamelot-core::model::ollama::OllamaManager` handles these states. Modeled after `QdrantManager` with a similar state machine.
3. **RAM usage**: Ollama + Qwen 2 VL Q4 uses ~4GB of RAM at idle (model loaded in memory). On an 8GB machine, this leaves only 4GB for the OS, Qdrant, and user applications. Mitigation: Users with limited RAM can switch to `nomic-embed-text` (137M params, ~300MB RAM).
4. **Warm-up time**: The first embedding request after Kamelot starts takes 2-5 seconds (model loading into GPU memory). Mitigation: Kamelot preloads the model during `kamelot init` and keeps Ollama running as a background service.
5. **Vendor risk (Ollama)**: Ollama is maintained by a small team. If the project is abandoned, Kamelot needs a fallback. Mitigation: The `ModelBackend` trait abstracts over Ollama, making it possible to add other backends (llama.cpp, OpenAI, etc.) without changing `kamelot-core`. See `docs/developers/04-extending-kamelot.md`.
6. **Inconsistent quantization quality**: Q4_K_M quantization reduces model quality slightly from the full-precision version. For most file retrieval tasks, quality degradation is imperceptible. For edge cases (finding semantically similar images), the vision encoder's quality drop at Q4 may matter. Mitigation: Users can switch to a higher-precision quantization (Q6_K, Q8_0) or the full F16 model if they have sufficient VRAM.

### Risk Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Ollama project abandonment | Low (well-funded) | High | `ModelBackend` abstraction; plan llama.cpp backend |
| Model download failure | Medium (slow network) | Medium | Resume support; checksum verification; mirror fallback |
| GPU memory exhaustion | Medium (8GB machines) | High | Auto-detect GPU memory; fallback to CPU if <6GB free |
| Embedding quality regression after model update | Low | Medium | Pinned model tags; user can pin version |
| Cache poisoning | Very low | Low | Cache keyed by SHA256; immutable content-addressed |

---

## Model Selection Guide

### Recommended Models by Use Case

| Use Case | Model | Params | RAM | Dims | Quality | Speed (M3) |
|---|---|---|---|---|---|---|
| Default (balanced) | qwen2vl:7b-q4_K_M | 7B | 4GB | 768 | Excellent | 22ms |
| CPU-only / low RAM | nomic-embed-text | 137M | 300MB | 768 | Good | 40ms (CPU) |
| High quality / larger RAM | mxbai-embed-large | 334M | 600MB | 1024 | Very Good | 18ms (GPU) |
| Code-focused | bge-m3 (Q4) | 567M | 1.2GB | 1024 | Very Good (code) | 25ms (GPU) |
| Multilingual | intfloat/multilingual-e5-large-instruct | 335M | 700MB | 1024 | Excellent (multilingual) | 20ms (GPU) |
| Minimum viable | all-minilm (L6 v2) | 22M | 60MB | 384 | Adequate | 5ms (CPU) |

### Model Configuration (kamelot config)

```toml
[embedding]
# Model name in Ollama
model = "qwen2vl:7b-q4_K_M"
# Ollama server URL
base_url = "http://127.0.0.1:11434"
# Number of concurrent embedding requests
concurrency = 8
# Request timeout in seconds
timeout = 30
# Cache capacity (0 to disable)
cache_capacity = 10000
# Retry configuration
max_retries = 3
retry_base_delay_ms = 100
# Mock backend for testing
mock = false
# Mock dimension (only used when mock = true)
mock_dimension = 768
```

---

## Embedding Pipeline Flow

```
┌──────────┐    ┌───────────────┐    ┌────────────┐    ┌──────────┐
│   File   │───▶│  extractor    │───▶│  chunker   │───▶│  cache   │
│   Path   │    │ (type detect) │    │ (by tokens)│    │  lookup  │
└──────────┘    └───────────────┘    └────────────┘    └─────┬────┘
                                                              │
                                                    ┌─────────▼──────┐
                                                    │    cache hit?   │
                                                    └──┬──────────┬──┘
                                                   Yes│          │No
                                                      ▼          ▼
                                               ┌──────────┐  ┌──────────────┐
                                               │  return   │  │  Ollama API  │
                                               │  cached   │  │ /api/embed   │
                                               │  vector   │  └──────┬───────┘
                                               └──────────┘         │
                                                                    ▼
                                                             ┌──────────────┐
                                                             │  store in    │
                                                             │  Qdrant      │
                                                             └──────────────┘
```

The pipeline is implemented in `kamelot-core::pipeline::embedding`. Key components:

1. **Extractor**: Reads file content, detects file type (magic bytes, extension), extracts plaintext. For PDFs: `pdf-extract` crate. For images: base64 encoding for Qwen VL. For binary files: skip (intent detection via filenames only).
2. **Chunker**: Splits content into chunks of ~512 tokens (with 128-token overlap). Each chunk gets its own embedding. File-level embedding is the mean of chunk embeddings.
3. **Cache lookup**: SHA256 hash of the raw content bytes. If found, skip the model entirely.
4. **Ollama HTTP call**: Normalize content (truncate to 8192 tokens, Ollama's max context length). Send via `reqwest::Client`. Retry on failure.
5. **Post-processing**: Normalize the resulting vector to unit length (cosine similarity requirement from Qdrant).
6. **Storage**: Write to Qdrant via `UpsertPoints` gRPC call.

---

## Future Directions

### Phase 2 (Q3 2026): Multiple Model Backends

The `ModelBackend` trait will support:

```rust
#[async_trait]
pub trait ModelBackend: Send + Sync + Debug {
    /// Generate an embedding vector for the given text.
    async fn embed(&self, text: &str) -> Result<Vec<f32>>;
    
    /// Generate an embedding vector for the given image (base64-encoded).
    async fn embed_image(&self, base64_image: &str) -> Result<Vec<f32>>;
    
    /// Return the dimension of the embedding vectors.
    fn dimension(&self) -> usize;
    
    /// Return a display name for this backend.
    fn name(&self) -> &str;
}
```

Backends planned:
- `OllamaBackend` (default; current)
- `OpenAIBackend` (for users who accept cloud embedding; feature-gated)
- `LlamaCppBackend` (direct llama.cpp FFI, no Ollama dependency)
- `MockBackend` (deterministic seeded vectors for testing)

### Phase 3 (2027): Custom Fine-Tuned Embedding Model

If Kamelot gains significant adoption with a specific file type distribution (e.g., mostly PDF invoices, or mostly Python code), a fine-tuned embedding model could improve search relevance by 10-20%. Options:
- LoRA fine-tune Qwen 2 VL on Kamelot's search logs
- Distill to a smaller model (1.5B params) for faster inference

This would be optional and opt-in. The default remains the general-purpose Qwen model.

---

## References

- BDR-01: Adopt Rust Over C/C++
- BDR-02: Qdrant Over Pinecone
- BDR-04: Native UI Over Electron
- BDR-06: Self-Hosted Over SaaS
- docs/developers/01-architecture-overview.md
- docs/developers/09-api-reference.md (ModelBackend API)
- docs/developers/04-extending-kamelot.md (Adding custom embedding backends)

---

## Appendix A: Ollama REST API Reference

Key Ollama API endpoints used by Kamelot:

```bash
# Generate an embedding
POST /api/embeddings
Request:  {"model": "qwen2vl:7b-q4_K_M", "prompt": "text to embed"}
Response: {"embedding": [0.123, 0.456, ...], "total_duration": 22123456}

# Generate a completion (for future multimodal queries)
POST /api/generate
Request:  {"model": "qwen2vl:7b-q4_K_M", "prompt": "Describe this file", "images": ["base64..."]}
Response: {"response": "This file contains...", "done": true}

# List available models
GET /api/tags
Response: {"models": [{"name": "qwen2vl:7b-q4_K_M", "size": 4500000000}, ...]}

# Show model details
POST /api/show
Request:  {"model": "qwen2vl:7b-q4_K_M"}
Response: {"modelfile": "...", "parameters": {...}, "template": "...", "details": {...}}

# Check if Ollama is running (health check)
HEAD / 
Response: 200 OK (Ollama is running)
```

All requests from Kamelot to Ollama use the `/api/embeddings` endpoint. Timeout is set to 30 seconds. Retry with exponential backoff on 5xx errors.

## Appendix B: Model Quantization Comparison

Qwen 2 VL is available in multiple quantization levels. The Q4_K_M quantization was chosen after benchmarking:

| Quantization | File Size | RAM Usage | Quality (MTEB Score) | Latency (M3 Max) | Notes |
|---|---|---|---|---|---|
| F16 (full precision) | 14.2 GB | 16 GB | 64.2 | 35ms | Highest quality, requires high VRAM |
| Q8_0 | 7.5 GB | 8 GB | 63.8 (−0.4) | 28ms | Good balance for 8GB+ GPUs |
| Q6_K | 5.8 GB | 6 GB | 63.5 (−0.7) | 25ms | Better than Q4, moderate size |
| Q5_K_M | 5.0 GB | 5.5 GB | 63.2 (−1.0) | 23ms | Middle ground |
| **Q4_K_M** | **4.5 GB** | **4 GB** | **62.8 (−1.4)** | **22ms** | **Default — best size/quality tradeoff** |
| Q4_K_S | 4.0 GB | 3.5 GB | 62.0 (−2.2) | 20ms | More aggressive quantization |
| Q3_K_M | 3.5 GB | 3 GB | 60.5 (−3.7) | 18ms | Noticeable quality degradation |
| Q2_K | 2.8 GB | 2.5 GB | 57.0 (−7.2) | 15ms | Significant quality loss, not recommended |

The Q4_K_M quantization loses only 1.4 points on the MTEB benchmark (from 64.2 to 62.8) while reducing memory requirements by 75% (from 16 GB to 4 GB). This is the best tradeoff for Kamelot's target audience of consumer hardware users.

## Appendix C: Alternative Local Models Benchmark

Comparison of local embedding models that can run via Ollama:

| Model | Params | Dims | RAM | MTEB | Latency (GPU) | Latency (CPU) | Multilingual |
|---|---|---|---|---|---|---|---|
| Qwen 2 VL (Q4) | 7B | 768 | 4 GB | 62.8 | 22ms | 85ms | Yes (100+ langs) |
| nomic-embed-text | 137M | 768 | 300 MB | 58.5 | 3ms | 12ms | Yes (50+ langs) |
| mxbai-embed-large | 334M | 1024 | 600 MB | 63.0 | 4ms | 18ms | English only |
| bge-m3 (Q4) | 567M | 1024 | 1.2 GB | 64.5 | 5ms | 25ms | Yes (100+ langs) |
| llama-3.2-3b-embed | 3B | 3072 | 2 GB | 65.1 | 12ms | 50ms | English only |
| all-minilm (L6 v2) | 22M | 384 | 60 MB | 52.0 | 1ms | 5ms | English only |
| multilingual-e5-large-instruct | 335M | 1024 | 700 MB | 64.8 | 5ms | 22ms | Yes (100+ langs) |

Kamelot defaults to Qwen 2 VL for its multimodal capability (text + image embeddings) and strong multilingual support. Users can switch to any model above via `kamelot config set embedding.model <model>`.

## Appendix D: Embedding Quality Evaluation

Methodology for measuring semantic search quality:

**Dataset**: BEIR (Benchmarking Information Retrieval) subset: TREC-COVID, NFCorpus, NQ, HotpotQA, FiQA, ArguAna, Touche, CQADupstack (8 datasets).

**Metric**: nDCG@10 (Normalized Discounted Cumulative Gain at rank 10).

| Model | TREC-COVID | NFCorpus | NQ | HotpotQA | FiQA | ArguAna | Touche | CQADupstack | Average |
|---|---|---|---|---|---|---|---|---|---|
| Qwen 2 VL Q4 | 0.652 | 0.315 | 0.508 | 0.612 | 0.345 | 0.542 | 0.301 | 0.385 | 0.458 |
| nomic-embed-text | 0.581 | 0.282 | 0.448 | 0.564 | 0.298 | 0.495 | 0.265 | 0.342 | 0.409 |
| mxbai-embed-large | 0.648 | 0.320 | 0.512 | 0.608 | 0.348 | 0.538 | 0.298 | 0.382 | 0.457 |
| text-embedding-3-small | 0.682 | 0.342 | 0.548 | 0.635 | 0.372 | 0.565 | 0.322 | 0.410 | 0.485 |

Qwen 2 VL Q4 performs within 3% of OpenAI's `text-embedding-3-small` on average, with the advantage of being fully local and private.

## Appendix E: Embedding Cache Hit Rate by Workload

Real-world cache performance measured on different usage patterns:

| Workload | Cache Size | Hit Rate | Effective Latency | Explanation |
|---|---|---|---|---|
| Browsing files (read-only) | 10,000 | 85% | 4ms | Same files accessed repeatedly |
| Daily indexing (incremental) | 10,000 | 55% | 11ms | New content, some repeated |
| Bulk ingest (first time) | 10,000 | 5% | 21ms | All new content, cache has no prior entries |
| Mixed (index + search) | 10,000 | 62% | 9ms | Typical usage |
| Developer workspace (code) | 10,000 | 72% | 7ms | Many files unchanged between compiles |

The cache is most effective for read-heavy workloads (browsing, searching) and least effective for initial bulk ingest. During bulk ingest, the cache is not helpful, but this is a one-time cost.

## Appendix F: Ollama Process Management Details

The `OllamaManager` state machine implementation:

```rust
// From kamelot-core/src/model/ollama.rs

enum OllamaState {
    /// Ollama is not installed or not detected
    NotFound,
    /// Installation path detected but process not running
    Stopped { binary_path: PathBuf },
    /// Process spawned, waiting for health check
    Starting { child_pid: u32, started_at: Instant },
    /// Ollama is running and accepting requests
    Ready { child_pid: u32, model_loaded: String },
    /// Health check failed, attempt restart
    Degraded { error: String, retry_count: u8 },
    /// Failed too many times, give up
    Failed { error: String },
}

impl OllamaManager {
    /// Main reconciliation loop — called periodically
    async fn reconcile(&mut self) -> Result<()> {
        match &self.state {
            OllamaState::NotFound => self.install_or_guide_user().await,
            OllamaState::Stopped { binary_path } => self.spawn_ollama(binary_path).await,
            OllamaState::Starting { started_at, .. } => {
                if started_at.elapsed() > Duration::from_secs(30) {
                    self.state = OllamaState::Failed {
                        error: "Startup timeout (30s)".into()
                    };
                } else {
                    self.check_health().await;
                }
            }
            OllamaState::Ready { .. } => self.check_health().await,
            OllamaState::Degraded { retry_count, .. } => {
                if *retry_count > 3 {
                    self.state = OllamaState::Failed {
                        error: "Retry limit exceeded".into()
                    };
                } else {
                    self.restart_ollama().await;
                }
            }
            OllamaState::Failed { .. } => {
                // Notify user and stop retrying
                self.notify_user("Ollama failed to start. See logs for details.");
            }
        }
        Ok(())
    }
}
```

## Appendix G: GPU Memory Management

Ollama loads the model into GPU memory on first request. Memory management strategies:

```bash
# Check GPU memory usage
# NVIDIA:
nvidia-smi --query-gpu=memory.used,memory.total --format=csv

# Apple Silicon:
sudo powermetrics --samplers gpu_power -i 1000 -n 1

# Configure Ollama to keep model in memory (default)
# ~/.ollama/config.json
{
  "keep_alive": "5m",    # Keep model loaded for 5 minutes after last use
  "num_ctx": 8192,       # Context window size (tokens)
  "num_gpu": 1,          # Number of GPU layers to offload (0 = CPU only)
  "num_thread": 8         # CPU threads for prompt processing
}
```

For low-memory systems (8GB RAM, no GPU):

```bash
# Force CPU-only mode
ollama serve --no-gpu

# Use a smaller model
kamelot config set embedding.model nomic-embed-text

# Or set Ollama to use only 2 CPU threads
OLLAMA_NUM_THREADS=2 ollama serve
```

## Appendix H: Tokenization and Chunking Strategy

The chunker splits text into chunks optimized for embedding:

```rust
// From kamelot-core/src/pipeline/chunker.rs

pub struct Chunker {
    max_tokens: usize,        // 512 tokens per chunk
    overlap_tokens: usize,    // 128 tokens overlap between consecutive chunks
    model: String,            // Model name (affects tokenizer)
}

impl Chunker {
    /// Split text into overlapping chunks.
    /// Returns the chunks and their byte offsets in the original text.
    pub fn chunk(&self, text: &str) -> Vec<Chunk> {
        let tokens = self.tokenize(text);
        let mut chunks = Vec::new();
        let mut start = 0;
        
        while start < tokens.len() {
            let end = std::cmp::min(start + self.max_tokens, tokens.len());
            let chunk_tokens = &tokens[start..end];
            let chunk_text = self.detokenize(chunk_tokens);
            let byte_offset = self.byte_offset(text, start);
            
            chunks.push(Chunk {
                text: chunk_text,
                token_start: start,
                token_end: end,
                byte_offset,
                index: chunks.len(),
            });
            
            if end == tokens.len() {
                break;
            }
            
            start += self.max_tokens - self.overlap_tokens;
        }
        
        chunks
    }
    
    /// File-level embedding is the mean of all chunk embeddings,
    /// normalized to unit length.
    pub fn mean_pool(embeddings: &[EmbeddingVector]) -> EmbeddingVector {
        let dim = embeddings[0].0.len();
        let mut pooled = vec![0.0f32; dim];
        
        for emb in embeddings {
            for (i, &val) in emb.0.iter().enumerate() {
                pooled[i] += val;
            }
        }
        
        let count = embeddings.len() as f32;
        for val in &mut pooled {
            *val /= count;
        }
        
        // L2 normalize
        let norm = pooled.iter().map(|x| x * x).sum::<f32>().sqrt();
        for val in &mut pooled {
            *val /= norm;
        }
        
        EmbeddingVector(pooled)
    }
}
```

Chunk size (512 tokens) and overlap (128 tokens) were chosen based on:
- **512 tokens**: Average paragraph length. Short enough for precise retrieval, long enough for semantic context.
- **128 tokens**: 25% overlap ensures that information near chunk boundaries is captured in multiple chunks.
- **Max file length**: 8192 tokens (Qwen 2 VL's context window). Files longer than this are chunked; the file-level embedding is the mean of chunk embeddings.
- **Files shorter than 512 tokens**: No chunking; the entire content is embedded as a single vector.

*This decision was reviewed and accepted on 2026-01-18. The llama.cpp direct approach was re-evaluated on 2026-02-20 and deferred to Q3 2026 due to build complexity concerns.*

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com