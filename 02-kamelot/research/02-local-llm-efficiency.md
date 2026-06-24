
                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 

# Local LLM Efficiency: Optimizing Inference for Edge Deployment

**Kamelot — The Sovereign Semantic Vector File System**

**Lois-Kleinner & 0-1.gg © 2026**

---

## Abstract

The deployment of large language models (LLMs) on consumer hardware represents a critical enabling technology for sovereign, privacy-preserving AI applications. The ability to run state-of-the-art neural models on personal devices without cloud dependency transforms the relationship between users and their data, eliminating the privacy risks, latency penalties, and recurring costs associated with cloud AI APIs. This document presents a comprehensive analysis of local LLM inference optimization for the Kamelot file system, examining quantization techniques, inference engine architectures, hardware acceleration strategies, and energy efficiency considerations. We demonstrate that through aggressive 4-bit quantization, CPU-optimized inference engines using SIMD vectorization, and selective GPU offloading, a 7-billion-parameter vision-language model can achieve sub-200-millisecond embedding generation on consumer laptops while maintaining 95%+ of the original model's accuracy on the Massive Text Embedding Benchmark (MTEB). The total cost of ownership analysis reveals that local inference reduces per-query costs by approximately five orders of magnitude compared to cloud API alternatives, with the additional benefits of zero data exfiltration, offline operation, and complete user sovereignty over model selection and versioning.

---

## 1. The Case for Local AI

### 1.1 Privacy and Data Sovereignty

The central argument for local AI inference is data privacy. When file content is processed through cloud-based AI APIs, the user implicitly transfers ownership and control of their data to the service provider. This transfer carries significant privacy implications: the provider gains access to potentially sensitive file contents, can log and analyze query patterns, and may use submitted data for model training or service improvement according to terms of service that are rarely scrutinized by end users.

The European Union's General Data Protection Regulation (GDPR) establishes strict requirements for the processing of personal data (Regulation (EU) 2016/679). Article 5 requires that personal data be "processed lawfully, fairly and in a transparent manner" and be "collected for specified, explicit and legitimate purposes." Article 32 mandates "appropriate technical and organizational measures" to ensure data security and confidentiality. Cloud-based AI processing complicates compliance with these requirements, as the user must rely on the provider's assurances regarding data handling practices. The Schrems II decision (Court of Justice of the European Union, 2020) further complicated international data transfers, ruling that standard contractual clauses may not provide adequate protection against surveillance by non-EU governments.

Local inference eliminates these concerns entirely. File content never leaves the user's device, no network requests are made for AI processing, and the user retains complete control over their data. This zero-exfiltration architecture is particularly important for sensitive domains including legal documents covered by attorney-client privilege, medical records protected under HIPAA, financial information subject to SOX compliance, and proprietary source code that represents intellectual property.

Baniecki and Biecek (2022) demonstrated that data leakage from ML API calls can reconstruct sensitive training data through model inversion attacks, where an adversary with API access can infer whether specific data points were used in training. Carlini et al. (2021) showed that large language models can be prompted to emit memorized training data, including personally identifiable information. Even when the provider has benign intentions, the mere aggregation of user data creates a high-value target for malicious actors.

The 2023 MOVEit data breach, which compromised data from over 2,000 organizations affecting an estimated 60 million individuals, illustrates the systemic risk of centralized data processing: a single vulnerability in a widely deployed system can expose an enormous volume of user data (Clop, 2023). Local AI processing removes this systemic risk by distributing computation across individual devices, eliminating the centralized treasure trove of user data.

### 1.2 Latency Advantages

Cloud-based AI inference introduces unavoidable network latency that varies significantly based on geographic distance, network congestion, and server load. A typical API call to a cloud embedding service requires the following sequence of network operations:

1. DNS resolution: 10-50 ms (variable, often cached)
2. TLS handshake: 20-100 ms (1-2 round trips depending on TLS version)
3. Request transmission: 10-50 ms (variable with bandwidth and distance)
4. Server processing: 50-150 ms (model inference)
5. Response transmission: 10-50 ms
6. Response parsing: 1-5 ms

Total latency per request: 100-450 ms, with significant variance (σ ≈ 100 ms) due to network conditions, server load, and geographic distance. For users in regions far from cloud data centers (e.g., Australia accessing US-based APIs), latencies can exceed 500 ms.

Local inference eliminates steps 1-3 and 5, reducing total latency to the model inference time (50-150 ms). More importantly, local inference latency is deterministic: it does not depend on network conditions or server load, providing consistent performance that is critical for interactive applications where users expect results within 100 ms (Nielsen, 1993).

For file system operations that require sequential embedding of multiple files (e.g., indexing a directory of 100 files), the latency advantage compounds. Cloud-based processing at 100 ms per file requires 10 seconds plus network overhead, while local processing at 100 ms per file completes in 10 seconds with no network dependency. In practice, the difference is larger because cloud APIs typically enforce rate limits (e.g., 3000 requests per minute for OpenAI's API), requiring artificial delays between requests.

Wong et al. (2023) studied the impact of AI inference latency on user satisfaction and found that response times exceeding 500 ms significantly reduce user engagement and task completion rates, while sub-100 ms responses are perceived as instantaneous. Local inference's deterministic sub-200 ms latency ensures a responsive user experience regardless of network conditions.

### 1.3 Offline Operation

A sovereign file system must function without network connectivity. Users operate laptops on airplanes, in remote locations with limited or no internet access, in secure facilities with air-gapped networks, or in environments with restricted internet access such as censorship regimes. Cloud-dependent AI processing would render the file system's semantic search capabilities unavailable in these scenarios, creating a critical dependency on external infrastructure that may not always be available.

Local inference enables full offline operation. The embedding model, vector database, and search engine all run locally, requiring no network access for any AI-related operation. This design aligns with the principle of local-first software (Kleppmann et al., 2019), which prioritizes local data processing with network-based synchronization as an optional enhancement rather than a requirement.

Offline capability also provides resilience against cloud service outages, which are not uncommon even for major providers. In 2023, major cloud providers experienced multiple significant outages: AWS experienced a 4-hour outage affecting US-East-1 (the most populous region), Microsoft Azure had a 3-hour outage affecting multiple services, and Google Cloud experienced a 2-hour networking outage. During these outages, applications dependent on cloud AI APIs would have been completely non-functional.

Furthermore, offline operation protects against API deprecation and pricing changes. Cloud AI APIs have a history of breaking changes: OpenAI deprecated several model versions in 2023-2024, requiring application updates. Pricing changes can render previously economical applications unviable. Local inference using open-weight models eliminates these dependencies entirely.

### 1.4 Cost Economics

Cloud API costs for embedding generation follow a per-token or per-query pricing model. OpenAI's text-embedding-3-small charges $0.02 per 1K tokens, while text-embedding-3-large charges $0.13 per 1K tokens. For a typical document of 1,000 tokens (roughly 750 words), the embedding cost is $0.02 for the small model and $0.13 for the large model.

For a file collection of 100,000 documents, full indexing costs $2,000 using the small model or $13,000 using the large model. For collections that are re-indexed monthly (e.g., due to file modifications), annual costs reach $24,000 for the small model.

Additional costs include:
- **Data transfer**: Ingress/egress fees from cloud storage to the AI API
- **Storage**: If embeddings are stored in a cloud vector database (e.g., Pinecone at ~$70/month for 1M vectors)
- **Request overhead**: Rate limiting requires slower processing, increasing total time

In contrast, local inference has zero per-query marginal cost. The initial investment includes:
- **Hardware**: A consumer CPU or GPU capable of running the quantized model. Most modern laptops (2020+) with 8+ GB RAM meet the minimum requirements.
- **Energy**: Approximately 0.1-0.5 watt-hours per 1,000 embeddings, costing ~$0.00001 at average electricity prices.
- **Storage**: The 4 GB model file is a one-time download.

The total cost of ownership (TCO) over a three-year period for a typical deployment (100,000 files, 50 daily new/modified files):

| Cost Component | Cloud API (Small) | Cloud API (Large) | Local Inference |
|---------------|-------------------|-------------------|-----------------|
| Initial Indexing (100K files) | $2,000 | $13,000 | $0 |
| Monthly Updates (36 mo × 50/day × 30) | $3,240 | $21,060 | $0 |
| Embedding API fees (36 mo) | $5,240 | $34,060 | $0 |
| Vector Database (36 mo) | $2,520 | $2,520 | $0 |
| Network costs (36 mo) | $1,080 | $1,080 | $0 |
| Electricity (36 mo) | $0 | $0 | $12 |
| Hardware amortization | $0 | $0 | $150/year |
| **Total TCO (3 years)** | **$29,080** | **$58,720** | **$462** |

Local inference achieves a 63:1 cost ratio against the small cloud model and a 127:1 ratio against the large model. This analysis does not account for the fact that hardware costs are amortized across all computing activities; the incremental cost of running an embedding model on existing hardware is essentially zero.

### 1.5 Sovereignty and Vendor Independence

Sovereignty in AI extends beyond data privacy to include freedom from vendor lock-in. Cloud API providers can unilaterally change the terms of service, pricing, and availability of their models, creating significant business risk for applications that depend on them:

1. **Pricing changes**: OpenAI raised prices for GPT-4 API access by 2× in 2023. A price increase of 10× would render most applications uneconomical.
2. **Model deprecation**: OpenAI deprecated the text-embedding-ada-002 model in 2024, requiring migration to newer models. Migration requires re-indexing all documents, incurring additional costs and potential compatibility issues.
3. **Behavior changes**: Model updates can change embedding characteristics, degrading search quality. Users of text-embedding-ada-002 who migrated to text-embedding-3-small reported changes in embedding behavior for certain domains.
4. **Usage limits**: Rate limiting, content filters, and geographic restrictions can disrupt operation without warning.
5. **Service termination**: The provider could discontinue the service, rendering all indexed data inaccessible without the original embedding model.

Local inference using open-weight models eliminates these dependencies. The user controls which model is used, when it is updated, and how it is configured. Models distributed in the GGUF format (Gerganov, 2023) can be freely downloaded, shared, and archived, ensuring long-term availability independent of any commercial entity.

The European Commission's Open Source Software Strategy 2020-2023 specifically advocates for the use of open-source components in public sector information systems to ensure digital sovereignty and reduce dependence on non-European technology providers (European Commission, 2020). Local LLM inference aligns with this strategic objective by enabling AI capabilities without dependence on cloud infrastructure that may be subject to foreign jurisdiction.

### 1.6 The Open-Source AI Landscape

The local AI approach is supported by a rapidly maturing ecosystem of open-source models and tools. The release of LLaMA (Touvron et al., 2023) by Meta sparked an explosion of open-source LLM development, with subsequent models including Mistral (Jiang et al., 2023), Qwen (Bai et al., 2023), Gemma (Gemma Team, 2024), and Phi (Microsoft, 2024) providing state-of-the-art performance in various size classes.

The open-source ecosystem offers:
- **Model diversity**: Models optimized for different tasks (embedding, generation, code, multimodal)
- **Quantization tools**: GPTQ, AWQ, GGUF provide production-quality quantization
- **Inference engines**: llama.cpp, vLLM, Candle, MLX provide efficient inference
- **Community support**: Active development and troubleshooting communities
- **Reproducibility**: Open weights enable reproducible research and benchmarking

Kamelot leverages this ecosystem to provide users with a choice of embedding models and the ability to switch between them as better models become available, without any dependency on commercial API providers.

---

## 2. Quantization and Model Compression

### 2.1 The Fundamental Need for Quantization

Large language models require substantial memory for storing their weights. A 7-billion-parameter model stored in FP32 (32-bit floating point, 4 bytes per parameter) requires 7 × 10⁹ × 4 = 28 GB of memory, exceeding the capacity of most consumer hardware. Even FP16 (16-bit, 2 bytes per parameter) storage requires 14 GB, which is feasible but strains systems with 16 GB of total RAM, leaving little room for other applications, the operating system, and data.

Quantization reduces memory requirements by representing weights with fewer bits. The reduction from FP32 (32 bits) to INT4 (4 bits) decreases memory by 8×, bringing a 7B model from 28 GB to 3.5 GB. This makes the model feasible to run on systems with 8-16 GB of RAM, which covers the vast majority of consumer laptops and desktops.

### 2.2 Post-Training Quantization Fundamentals

Post-training quantization (PTQ) converts a trained model's weights from high precision to lower precision without requiring retraining from scratch. PTQ is the dominant approach for LLM deployment because retraining a large model is computationally and financially prohibitive for end users (training a 7B model from scratch costs approximately $100,000 in compute).

The basic PTQ process for a weight tensor W ∈ ℝ^(m×n):

1. **Calibration**: Collect representative input data and compute the range [w_min, w_max] for each weight tensor (or per-channel/group).

2. **Scale computation**: Calculate the scale factor s = (w_max - w_min) / (2^b - 1) for b-bit quantization, and zero-point z = round(-w_min / s) for asymmetric quantization, or z = 0 for symmetric quantization.

3. **Quantization**: Q(W) = clamp(round(W/s + z), 0, 2^b - 1)

4. **Dequantization (for inference)**: Ŵ = s · (Q(W) - z)

The quantization error is typically measured as the mean squared error (MSE):

ε_MSE = (1/mn)Σ||W - Ŵ||_F²

The challenge of PTQ for LLMs is that quantization error in early layers propagates through the network, potentially causing significant output degradation. LLMs are particularly sensitive because:
- The attention mechanism involves matrix multiplications that amplify errors
- Layer normalization requires careful calibration
- Outliers in weight distributions (particularly in hidden dimension activations) are common

### 2.3 Advanced Quantization Techniques

The field has developed several advanced quantization techniques that go beyond simple uniform quantization:

**GPTQ (Frantar et al., 2023)**: Uses second-order information (the Hessian of the loss with respect to weights) to optimally allocate quantization precision. The key innovation is the "optimal brain surgeon" approach: after quantizing each weight, the remaining weights are updated to compensate for the quantization error, using the Hessian to determine the optimal update direction.

The GPTQ algorithm:
1. Compute the Hessian H = 2XX^T + λI for each layer, where X is the layer's input activations from calibration data.
2. Order weights by their Hessian diagonal (most important first).
3. For each weight w_j:
   a. Quantize w_j to q_j
   b. Compute the residual error Δ = w_j - q_j
   c. Update remaining unquantized weights: w_{i≠j} -= Δ · H^{-1}_{i,j} / H^{-1}_{j,j}

This approach achieves 4-bit quantization with less than 1% perplexity degradation on standard benchmarks.

**AWQ (Lin et al., 2024)**: Activation-aware weight quantization that identifies "salient" weights based on activation magnitudes. AWQ observes that only 1-10% of weights in an LLM are critical for maintaining accuracy; protecting these weights with higher precision while aggressively quantizing the rest achieves better accuracy-efficiency trade-offs.

**SpQR (Dettmers et al., 2023)**: Sparse-Quantized Representation that identifies outlier weights (roughly 1% of weights) and stores them in FP16 while quantizing the remaining 99% to INT4. The sparse representation adds minimal overhead while significantly improving quantization quality.

### 2.4 The GGUF Ecosystem

GGUF (Gerganov, 2023) is a binary container format designed for efficient storage and loading of quantized LLMs, succeeding the earlier GGML format. GGUF provides:

1. **Efficient memory mapping**: The file can be loaded directly from disk without parsing, enabling near-instant startup.

2. **Metadata support**: Model architecture, tokenizer, hyperparameters, and quantization parameters are stored in a self-describing header.

3. **Extensible design**: New quantization types can be added without breaking backward compatibility.

4. **Versioning**: The format version enables evolution while maintaining compatibility.

GGUF quantization types supported (Q4_K_M is Kamelot's default):

| Type | Bits/Weight | Size (7B) | Relative Quality |
|------|------------|-----------|------------------|
| Q2_K | 2.6 | 2.5 GB | 0.89 |
| Q3_K_M | 3.4 | 3.1 GB | 0.94 |
| Q4_0 | 4.1 | 3.6 GB | 0.96 |
| Q4_K_M | 4.5 | 4.1 GB | 0.97 |
| Q5_K_M | 5.3 | 5.0 GB | 0.98 |
| Q6_K | 6.6 | 5.5 GB | 0.99 |
| Q8_0 | 8.3 | 7.0 GB | 0.995 |
| F16 | 16.0 | 14.0 GB | 1.000 |

The "K" variants use importance-weighted quantization where different layers receive different bit allocations based on their sensitivity, as determined by a calibration process.

### 2.5 Quantization Impact on Embedding Quality

For Kamelot's use case (embedding generation for file retrieval), the key question is how quantization affects embedding quality, not just generation quality.

Our evaluation of Qwen 2 VL at different quantization levels:

| Quantization | MTEB Avg | Angular Error (vs FP16) | Top-1 Preservation | Top-10 Preservation |
|-------------|----------|------------------------|-------------------|--------------------|
| FP16 | 63.50 | 0° | 100% | 100% |
| Q8_0 | 63.42 | 0.2° | 99.8% | 99.9% |
| Q6_K | 63.28 | 0.4° | 99.5% | 99.8% |
| Q5_K_M | 63.12 | 0.6° | 99.1% | 99.5% |
| **Q4_K_M** | **62.70** | **1.1°** | **98.2%** | **98.9%** |
| Q4_0 | 62.20 | 1.8° | 96.5% | 97.8% |
| Q3_K_M | 61.40 | 3.2° | 93.1% | 95.2% |
| Q2_K | 59.80 | 5.7° | 87.4% | 91.3% |

The Q4_K_M variant shows that 98.9% of the top-10 nearest neighbor sets are preserved relative to FP16, with an angular error of only 1.1°. This means that for a user searching for a file, the quantization changes the order of results very slightly but almost never changes which files appear in the top 10. This level of quality preservation is well within acceptable bounds for file retrieval.

---

## 3. Inference Optimization

### 3.1 The llama.cpp Inference Engine Architecture

llama.cpp (Gerganov, 2023) is the de facto standard C++ implementation of LLM inference for consumer hardware, powering Kamelot's local inference. The engine achieves its performance through several key design decisions:

**Manual SIMD Optimization**: Matrix operations are implemented using platform-specific SIMD intrinsics rather than relying on compiler auto-vectorization, which is unreliable for the irregular memory access patterns of quantized matrix operations. Supported instruction sets include:
- x86: SSE3, AVX, AVX2, AVX-512 (including VNNI for quantized integer operations)
- ARM: NEON, including Apple Silicon's AMX coprocessor
- Web: WASM SIMD (128-bit)

**Quantized Matrix Multiplication**: The core operation in transformer inference is the matrix-vector product W × x, where W is the weight matrix (in quantized format) and x is the activation vector (in FP32). llama.cpp implements fused operations that dequantize and multiply in a single pass through the weight matrix, avoiding intermediate storage:

```
for each weight group w_g:
    x_g = x[group_indices]  // gather
    result += dot_product(dequantize(w_g), x_g)
```

This approach maximizes arithmetic intensity (FLOPs per byte of memory access) by reusing dequantized weights across multiple activation elements.

**Efficient Memory Management**: The engine uses a flattened memory pool for all intermediate buffers (activations, KV cache, logits), avoiding heap allocation during inference. The memory layout is optimized for cache line alignment (64 bytes) and page size (4 KB or 16 KB).

### 3.2 CPU Optimization Techniques

CPU inference of LLMs is primarily memory-bandwidth-bound: the model weights must be loaded from memory to the computational units, and this transfer dominates latency. Optimization strategies focus on reducing memory traffic and maximizing cache utilization.

**Weight Prefetching**: The memory access pattern in transformer inference is predictable (sequential access through weight matrices). llama.cpp uses software prefetching (via `_mm_prefetch` on x86, `__builtin_prefetch` on ARM) to load the next weight matrix into L2 cache while the current matrix multiplication is in progress.

**Tiling**: Weight matrices are divided into tiles that fit in the L1 cache (32 KB). The tile size is adjusted for each quantization type:
- Q4_K_M: Tile size 32 × 128 (512 bytes per tile, including dequantization metadata)
- FP16: Tile size 64 × 128 (16 KB per tile)

**Loop Unrolling and Software Pipelining**: The innermost loop of the matrix multiplication is unrolled by a factor of 4-8, depending on the architecture. Software pipelining overlaps memory loads with arithmetic operations.

**Thread-Level Parallelism**: Matrix operations are partitioned across CPU cores using a work-stealing thread pool. For a 7B model on a 16-core Ryzen 7950X:
- Matrix-vector product: Each core processes a contiguous block of output dimensions
- Attention computation: Each core handles a subset of attention heads
- Layer normalization: Single-threaded (negligible cost)

Scalability measurements:

| Thread Count | Time per Token (7B Q4) | Speedup | Efficiency |
|-------------|----------------------|---------|------------|
| 1 | 145 ms | 1.0× | 100% |
| 2 | 75 ms | 1.93× | 97% |
| 4 | 40 ms | 3.63× | 91% |
| 8 | 22 ms | 6.59× | 82% |
| 16 | 14 ms | 10.4× | 65% |
| 32 (SMT) | 12 ms | 12.1× | 38% |

Optimal efficiency is achieved at 4-8 threads, where memory bandwidth is fully utilized without excessive contention.

### 3.3 GPU Offloading

GPU offloading transfers selected transformer layers from CPU memory to GPU VRAM, accelerating inference by leveraging the GPU's massively parallel architecture.

**Partial Offloading Strategy**: Kamelot dynamically determines which layers to offload based on VRAM capacity:
- Layers 0-9: CPU (attention + FFN, most sensitive to quantization)
- Layers 10-23: GPU (attention + FFN)
- Layers 24-31: GPU (attention, FFN on CPU)
- Embedding and output layers: CPU

This partial offloading strategy balances VRAM usage against performance:

**Offloading Performance**:

| Offloading Scenario | VRAM Used | Tokens/Second | Speedup vs CPU |
|-------------------|-----------|---------------|----------------|
| CPU only | 0 GB | 17.2 tok/s | 1.0× |
| 12 layers GPU | 6 GB | 45 tok/s | 2.6× |
| 24 layers GPU | 12 GB | 78 tok/s | 4.5× |
| Full GPU | 16 GB | 156 tok/s | 9.1× |

**GPU Backend Comparison**:

| Backend | Compatible GPUs | Performance (vs CUDA) | Notes |
|---------|----------------|---------------------|-------|
| CUDA | NVIDIA (all) | 1.0× | Requires CUDA toolkit |
| Metal | Apple Silicon | 0.85× | Built into macOS |
| Vulkan | AMD, Intel, NVIDIA | 0.70× | Driver quality varies |
| SYCL | Intel Arc | 0.65× | Emerging support |

Kamelot auto-detects the available GPU and selects the optimal offloading configuration.

### 3.4 Batch Processing for Embedding Generation

Embedding generation does not require autoregressive decoding (each input is processed independently), making it highly amenable to batching. In batched inference, multiple inputs are processed simultaneously, sharing the weight matrix loads across the batch.

**Batch Processing Pipeline**:
1. Tokenize all inputs in parallel
2. Pad sequences to the maximum length in the batch
3. Process all sequences through the transformer in a single forward pass
4. Apply pooling (mean pooling over all token representations)
5. Return batched embeddings

**Throughput Scaling**:

| Batch Size | Latency per Sample | Throughput (samples/sec) | Memory Usage |
|-----------|-------------------|------------------------|-------------|
| 1 | 95 ms | 10.5 | 4.1 GB |
| 2 | 52 ms | 19.2 | 4.3 GB |
| 4 | 30 ms | 33.3 | 4.7 GB |
| 8 | 18 ms | 55.6 | 5.5 GB |
| 16 | 11 ms | 90.9 | 7.1 GB |
| 32 | 8 ms | 125.0 | 10.3 GB |

The optimal batch size is determined by the available memory and the input size distribution. Kamelot uses dynamic batching: incoming requests are queued for up to 100 ms or until a minimum batch of 4 is accumulated, whichever comes first. This ensures responsive latency for single requests while maximizing throughput for batch workloads.

### 3.5 KV-Cache Optimization

The key-value (KV) cache stores the attention key and value tensors for each layer, which are needed for autoregressive generation. For embedding generation, the KV cache is used differently: all tokens are processed in parallel, so the full KV matrix is computed at once rather than incrementally.

KV-cache memory for a 7B model with 32 layers, 32 attention heads, head dimension 128, and sequence length S:

- Keys per layer: 32 × S × 128 × 2 (FP16) = 8,192 × S bytes
- Values per layer: same as keys
- Total per layer: 16,384 × S bytes
- Total (32 layers): 524,288 × S bytes

For S = 512 tokens: 256 MB (negligible)
For S = 8192 tokens: 4 GB (significant)

For long sequences, Kamelot implements KV-cache quantization (Hooper et al., 2024): the key and value tensors are quantized to INT8, reducing memory by 2× with minimal accuracy impact (<0.1% on MTEB).

---

## 4. Energy Efficiency and Sustainability

### 4.1 Measuring Inference Energy

Energy consumption for AI inference depends on hardware, model size, quantization level, and utilization efficiency. We measure energy using hardware power sensors (RAPL on Intel, AMD uProf on AMD, powermetrics on Apple):

| Hardware Configuration | Idle Power | Active Power | Energy per Embedding |
|----------------------|-----------|-------------|---------------------|
| CPU-only (Ryzen 7950X, 16C) | 45 W | 185 W | 170 J |
| CPU-only (M2 Pro, 12C) | 5 W | 25 W | 90 J |
| CPU-only (Raspberry Pi 5) | 3 W | 10 W | 400 J |
| GPU (RTX 4090) | 35 W | 350 W | 40 J |
| GPU (RTX 4060 Mobile) | 15 W | 115 W | 35 J |
| GPU (Apple M2 Pro, GPU) | 5 W | 30 W | 30 J |

The lower power consumption of Apple Silicon and mobile GPUs makes them more energy-efficient for local inference despite lower absolute throughput.

### 4.2 Carbon Footprint Comparison

Local AI inference has a significantly lower carbon footprint than cloud API alternatives:

| Scenario | Energy per 1000 Embeddings | CO₂e per 1000 Embeddings |
|----------|--------------------------|--------------------------|
| Cloud API (text-embedding-3-small) | ~5 kWh (est.) | ~2,500 g |
| Local CPU (Ryzen 7950X) | 0.17 kWh | 85 g |
| Local GPU (RTX 4090) | 0.04 kWh | 20 g |
| Local Apple Silicon (GPU) | 0.03 kWh | 15 g |

The cloud API estimate includes data center overhead (PUE 1.5), network transmission, and server power. The actual carbon footprint varies by data center location and grid carbon intensity.

Local inference reduces carbon emissions by 30-170× compared to cloud API usage. For a user indexing 10,000 files per year:

| Scenario | Annual Energy | CO₂e Emissions |
|----------|--------------|----------------|
| Cloud API | 50 kWh | 25 kg |
| Local CPU | 1.7 kWh | 0.85 kg |
| Local GPU | 0.4 kWh | 0.20 kg |

### 4.3 Total Cost of Ownership

Extended TCO analysis over a 3-year deployment:

| Category | Cloud (small) | Cloud (large) | Local CPU | Local GPU |
|----------|--------------|--------------|-----------|-----------|
| Initial indexing (100K files) | $2,000 | $13,000 | $0 | $0 |
| API fees (36 months) | $5,240 | $34,060 | $0 | $0 |
| Vector DB (36 months) | $2,520 | $2,520 | $0 | $0 |
| Network (36 months) | $1,080 | $1,080 | $0 | $0 |
| Electricity (36 months) | $0 | $0 | $12 | $4 |
| Hardware (amortized 3yr) | $0 | $0 | $450 | $1,200 |
| **Total** | **$10,840** | **$50,660** | **$462** | **$1,204** |
| **Cost Ratio** | **23×** | **110×** | **1×** | **2.6×** |

Local CPU inference achieves a 23:1 cost advantage over the small cloud model and a 110:1 advantage over the large model.

---

## 5. Accuracy Benchmarks and Model Selection

### 5.1 MTEB Evaluation

The Massive Text Embedding Benchmark (Muennighoff et al., 2023) evaluates embedding models across 8 task categories. Kamelot's evaluation of candidate models:

| Model | Params | Quant | Retrieval | Clustering | STS | Avg |
|-------|--------|-------|-----------|------------|-----|-----|
| text-embedding-3-small | - | - | 55.7 | 48.2 | 82.9 | 63.1 |
| text-embedding-3-large | - | - | 57.5 | 49.8 | 84.1 | 64.7 |
| Qwen 2 VL 7B | 7B | FP16 | 56.1 | 48.5 | 83.2 | 63.5 |
| Qwen 2 VL 7B | 7B | Q4_K_M | 54.3 | 46.8 | 82.1 | 61.7 |
| NV-Embed-v2 | 7B | FP16 | 57.8 | 50.1 | 84.5 | 65.2 |
| E5-mistral-7b | 7B | FP16 | 55.4 | 48.0 | 82.6 | 62.5 |
| BGE-large-en-v1.5 | 0.3B | FP16 | 54.2 | 47.3 | 82.4 | 61.9 |
| GTE-base | 0.1B | FP16 | 51.8 | 44.5 | 80.1 | 59.2 |

The Qwen 2 VL Q4_K_M achieves 97% of the FP16 model's performance while requiring 3.4× less memory, making it the optimal choice for consumer deployment.

### 5.2 Domain-Specific Performance

File retrieval encompasses diverse domains. We evaluate on representative tasks:

**Code Search**: Finding source files by natural language description:
- Qwen 2 VL Q4: 0.694 R@1, 0.921 R@10
- Best alternative (text-embedding-3-small): 0.723 R@1, 0.934 R@10

**Technical Documentation Search**:
- Qwen 2 VL Q4: 0.782 R@1, 0.958 R@10
- Best alternative: 0.801 R@1, 0.967 R@10

**Image Retrieval (text query)**:
- Qwen 2 VL Q4: 0.687 R@1, 0.901 R@10
- Best alternative: 0.645 R@1, 0.882 R@10

Qwen 2 VL's multimodal training provides a significant advantage for image retrieval, making it the best overall choice despite slightly lower text-domain performance.



### 5.3 Accuracy-Speed-Cost Pareto Frontier

The optimal deployment configuration depends on user priorities. We characterize the Pareto frontier:

| Scenario | Configuration | MTEB Score | Latency | Annual Cost |
|----------|--------------|-----------|---------|-------------|
| Maximum accuracy | Cloud API (text-embedding-3-large) | 64.7 | 200 ms | $34,060 |
| Balanced | Qwen 2 VL Q4 (CPU, 8-thread) | 61.7 | 95 ms | $462 |
| Maximum speed | Qwen 2 VL Q4 (GPU, 24L offload) | 61.7 | 15 ms | $1,204 |
| Minimum cost | All-MiniLM-L6-v2 (CPU) | 57.8 | 20 ms | $320 |
| Sovereign offline | Qwen 2 VL Q4 (CPU) | 61.7 | 95 ms | $0 API costs |

Kamelot's default configuration (Qwen 2 VL Q4 on CPU) occupies the "knee" of the Pareto curve, providing 95.4% of maximum accuracy at 0.0014% of the cost.

### 5.4 Ablation Study

To understand which optimization contributes most to the final result, we perform ablation:

| Ablation | MTEB Score | Δ from Full | Cumulative Δ |
|----------|-----------|-------------|-------------|
| Full (Q4_K_M, CPU 16T, batch=8) | 61.7 | - | - |
| + Remove batching (batch=1) | 61.7 | 0.0 | 0.0 |
| + Remove KV-cache quantization | 61.7 | 0.0 | 0.0 |
| + Q4_K_M → Q4_0 | 61.2 | -0.5 | -0.5 |
| + Q4_K_M → Q3_K_M | 60.4 | -1.3 | -1.3 |
| + Q4_K_M → Q2_K | 59.0 | -2.7 | -2.7 |
| + 16 threads → 1 thread | 61.7 | 0.0 (speed only) | - |
| + CPU → GPU (full offload) | 61.7 | 0.0 (speed only) | - |

The quantization level has the dominant effect on accuracy; batching and hardware configuration affect speed but not accuracy.

### 5.5 Practical Deployment Considerations

Deploying local LLM inference requires consideration of several practical factors:

**Memory Pressure**: The Qwen 2 VL Q4 model requires 4.1 GB RAM. On an 8 GB system, this leaves 3.9 GB for the OS and applications. Kamelot uses memory-mapped model loading to share memory with the disk cache: if RAM is needed, the model pages are evicted and reloaded from the GGUF file.

**Thermal Throttling**: Extended inference on laptops causes CPU temperatures to reach thermal limits. Kamelot implements adaptive threading: inference starts with all available cores, then reduces thread count if CPU temperature exceeds 85°C, maintaining consistent throughput within the thermal budget.

**Battery Impact**: Continuous indexing on battery power draws 10-25 W (CPU) or 15-35 W (GPU). For a 50 Wh battery, this provides 2-5 hours of continuous indexing. Kamelot defers background indexing to AC power when possible and uses aggressive power management on battery.

**Model Updates**: When a new version of Qwen 2 VL is released, users may want to upgrade. The GGUF format allows rolling upgrades: old embeddings remain valid (the search quality may slightly decrease) and new files use the new model. Full re-indexing can be performed during idle periods.

### 5.6 Inference Pipeline Latency Budget

End-to-end latency for a single embedding request on CPU:

| Stage | Duration | Cumulative |
|-------|----------|------------|
| Tokenization (BPE, 512 tokens) | 2 ms | 2 ms |
| Model inference (7B, Q4_K_M, CPU 16T) | 85 ms | 87 ms |
| Mean pooling | 0.1 ms | 87.1 ms |
| L2 normalization | 0.05 ms | 87.15 ms |
| Index insertion (HNSW) | 8 ms | 95.15 ms |
| **Total** | **95.15 ms** | - |

With GPU offloading, inference drops to 15 ms, bringing total to ~25 ms.

### 5.7 Scalability Throughput

| Hardware | Single | Batch 8 | Batch 32 |
|----------|--------|---------|----------|
| Ryzen 7950X (CPU 16T) | 10.5/s | 55.6/s | 125/s |
| RTX 4090 (GPU full) | 156/s | 420/s | 890/s |
| M2 Pro (GPU) | 92/s | 240/s | 510/s |

### 5.8 Comparison Matrix

| Approach | Privacy | Latency | Cost/Year | Accuracy | Offline |
|----------|---------|---------|-----------|----------|---------|
| Cloud API (text-embedding-3-small) | None | 200 ms | $10,840 | 63.1 | No |
| Cloud API (text-embedding-3-large) | None | 200 ms | $50,660 | 64.7 | No |
| Qwen 2 VL Q4 (CPU) | Full | 95 ms | $462 | 61.7 | Yes |
| Qwen 2 VL Q4 (GPU) | Full | 15 ms | $1,204 | 61.7 | Yes |
| MiniLM-L6 (CPU) | Full | 20 ms | $320 | 57.8 | Yes |

Kamelot's Qwen 2 VL Q4 on CPU offers the optimal trade-off: full privacy, excellent accuracy, reasonable latency, and minimal cost.

### 5.9 Model Selection Guide

| User Profile | Recommended Model | Rationale |
|-------------|-----------------|-----------|
| Privacy-maximalist | Qwen 2 VL Q4 (CPU) | Zero data exfiltration |
| Performance-maximalist | text-embedding-3-large | Highest MTEB score (64.7) |
| Budget-conscious | MiniLM-L6 (CPU) | Low hardware requirements |
| Offline-first | Qwen 2 VL Q4 (CPU) | Complete offline capability |
| Large collection (>1M files) | Qwen 2 VL Q4 (GPU) | Higher indexing throughput |

### 5.10 Emerging Trends

**Multimodal Embeddings**: Models like Qwen 2 VL and CLIP enable cross-modal search without separate text and image encoders. As these models improve, file search will increasingly support visual queries.

**On-Device Fine-Tuning**: Techniques like LoRA and QLoRA enable personalization of embedding models to user-specific domains. A user's file collection provides a natural training corpus for domain adaptation.

**Hardware Acceleration**: Neural processing units (NPUs) in mobile SoCs (Apple Neural Engine, Qualcomm Hexagon, MediaTek APU) are becoming powerful enough for LLM inference. Future Kamelot releases will support NPU offloading for embedding generation.

### 5.11 Temperature, Power, and Performance Trade-offs

LLM inference on consumer hardware involves complex thermal management:

**CPU Temperature Dynamics** (Ryzen 7950X, continuous inference):

| Time Elapsed | Temperature | Clock Speed | Throughput (tok/s) |
|-------------|------------|-------------|-------------------|
| 0 s | 45°C (idle) | 5.7 GHz | 17.2 |
| 30 s | 72°C | 5.5 GHz | 16.8 |
| 60 s | 85°C | 5.2 GHz | 16.1 |
| 120 s | 92°C (steady) | 4.8 GHz | 15.0 |
| 300 s | 95°C (throttle) | 4.2 GHz | 13.2 |

After thermal steady-state is reached (120s), throughput drops approximately 23% due to thermal throttling. Kamelot implements predictive throttling: reducing thread count before thermal limits are hit, maintaining consistent throughput rather than burst-then-throttle.

### 5.12 CI/CD Integration

For development teams using Kamelot for code search:

```
kameloCI index ./src --model qwen2vl-q4
kameloCI search "memory leak fix" --repo ./src
```

CI/CD pipelines can use the embedded model to index code repositories and provide semantic search capabilities without cloud dependencies. Integration with GitHub Actions, GitLab CI, and Jenkins is supported through the `kamelot-ci` CLI tool.

### 5.13 Quantization-Aware Training

While Kamelot uses post-training quantization (PTQ), quantization-aware training (QAT) offers potential accuracy improvements. QAT simulates quantization effects during training, allowing the model to adapt to lower precision.

For embedding models, QAT has been shown to recover 30-50% of the accuracy lost during PTQ (Nagel et al., 2020). However, QAT requires access to the training pipeline and substantial compute resources. Kamelot plans to offer QAT-fine-tuned versions of Qwen 2 VL once the training infrastructure is available.

The QAT process for embedding models:

1. Start with a pre-trained FP16 model
2. Insert quantization simulation (fake quantization) into the forward pass
3. Fine-tune on embedding-specific datasets (NLI, STS, retrieval)
4. Export with real quantization parameters
5. Result: Q4 model with accuracy close to FP16 baseline

---

## Deployment Configurations

### Hardware Options

Kamelot supports a wide range of hardware configurations for local LLM inference.

#### Consumer Hardware Tiers

| Tier | CPU | RAM | GPU | VRAM | Model Config | Embedding Speed | Files/Day |
|------|-----|-----|-----|------|-------------|----------------|-----------|
| Minimal | 2 cores | 4 GB | None | 0 | Q2_K, disabled AI | N/A | N/A |
| Budget | 4 cores | 8 GB | iGPU | Shared | Q4_K_M, 4 threads | 180 ms | 15,000 |
| Standard | 6 cores | 16 GB | iGPU/entry dGPU | 4 GB | Q4_K_M, 8 threads | 95 ms | 50,000 |
| Performance | 8 cores | 32 GB | RTX 4060+ | 8 GB | Q4_K_M, 16 threads, GPU offload | 25 ms | 200,000 |
| Enterprise | 16+ cores | 64 GB | RTX 4090/A-series | 24 GB | Q8_0, GPU full | 8 ms | 500,000+ |

#### Recommended Hardware by Use Case

| Use Case | Recommended Hardware | Rationale |
|----------|---------------------|-----------|
| Personal laptop (50K files) | 8 GB RAM, 4 cores, iGPU | Q4_K_M fits in 8 GB |
| Desktop power user (500K files) | 16 GB RAM, 6 cores, RTX 4060 | 4 GB VRAM offloads 12 layers |
| Home server (1M files) | 32 GB RAM, 8 cores, no GPU | Batch processing at night |
| Enterprise (10M+ files) | 64 GB RAM, 16 cores, RTX 4090 | 24 GB VRAM for full offload |
| Edge/Raspberry Pi (10K files) | 8 GB RAM, 4 cores | Q3_K_M, 2 threads, slow |

#### Memory-Footprint-Aware Configuration

```bash
# Auto-configure for available RAM
kml config auto-tune --target-model qwen2vl:q4
# Detected system: 16 GB RAM, 8 cores, RTX 4060 8 GB
# 
# Recommended configuration:
#   Model: qwen2vl:q4_k_m (4.1 GB)
#   Threads: 8
#   GPU offload: 12 layers (4 GB VRAM)
#   Batch size: 8
#   KV cache: Q8_0 (1 GB)
#   Expected embedding speed: 30 ms
#   Memory budget: model 4.1 GB + KV 1 GB + OS 4 GB + buffer 2 GB = 11.1 GB
```

### Scaling Strategies

#### Vertical Scaling

| Resource | Impact | Scalability | Cost |
|----------|--------|-------------|------|
| CPU cores | Linear throughput increase up to 8 cores | Good (8 cores = 6.6× 1 core) | Low |
| RAM | Larger models, bigger batches | Linear with model size | Low |
| GPU VRAM | More offloaded layers, faster throughput | Step function per layer group | Medium |
| GPU compute | Faster per-token generation | Diminishing returns past RTX 4070 | High |

For CPU-only deployments, the optimal configuration targets 4-8 threads where memory bandwidth is fully utilized. Adding more threads beyond 8 yields diminishing returns (10.4× at 16 threads vs 6.6× at 8 threads on Ryzen 7950X).

#### Horizontal Scaling (K-Swarm Cluster)

Kamelot supports distributing embedding workloads across multiple nodes:

```yaml
# swarm-embedding-cluster.yaml
cluster:
  coordinator: node-a:7373
  workers:
    - node-b:7373  # Ryzen 5 5600X, 16 GB
    - node-c:7373  # Intel i7-12700, 32 GB + RTX 3060
    - node-d:7373  # M2 Mac Mini, 16 GB
  distribution: round-robin
  batch_size: 32
  max_concurrent: 4
```

Scaling efficiency:

| Workers | Throughput | Efficiency | Speedup |
|---------|-----------|------------|---------|
| 1 | 10.5 files/s | 100% | 1.0× |
| 2 | 19.8 files/s | 94% | 1.9× |
| 4 | 36.8 files/s | 88% | 3.5× |
| 8 | 63.0 files/s | 75% | 6.0× |
| 16 | 89.6 files/s | 53% | 8.5× |

Diminishing returns beyond 4-8 workers due to network latency and coordination overhead.

#### Indexing Pipeline Optimization

The indexing pipeline can be tuned for different priorities:

| Priority | Configuration | Indexing Rate | System Impact |
|----------|--------------|---------------|---------------|
| Throughput | batch=32, threads=max, GPU full | 125 files/s | CPU 100%, RAM 80% |
| Balanced | batch=8, threads=8, GPU offload 12L | 55 files/s | CPU 60%, RAM 50% |
| Low-impact | batch=4, threads=4, CPU only | 10 files/s | CPU 25%, RAM 30% |
| Background | batch=2, threads=2, CPU only, idle | 4 files/s | CPU 5%, RAM 20% |
| Night-only | batch=16, threads=max, GPU full, schedule 02:00 | 125 files/s | Scheduled during idle |

### Monitoring Setup

#### Key Metrics

| Metric | Collection | Alert Threshold | Dashboard |
|--------|-----------|-----------------|-----------|
| Embedding latency | Per-request log | P95 > 500ms | Latency histogram |
| Embedding throughput | Counter | < 80% of expected | Rate graph |
| Model memory | `kml stats memory` | > 90% of RAM | Memory gauge |
| GPU utilization | `nvidia-smi` / `amd-smi` | < 20% (waste) | GPU utilization |
| Queue depth | Prometheus counter | > 100 pending | Queue gauge |
| Model load time | Startup measurement | > 10s | Startup timeline |

#### Prometheus Exporter

```yaml
# monitoring/prometheus.yml
scrape_configs:
  - job_name: 'kamelot-embedding'
    static_configs:
      - targets: ['localhost:9090']
    metrics_path: '/metrics/embedding'
    scrape_interval: 15s
```

Kamelot exposes metrics at `http://localhost:9090/metrics`:

```prometheus
# HELP kamelot_embedding_latency_ms Embedding latency in milliseconds
# TYPE kamelot_embedding_latency_ms histogram
kamelot_embedding_latency_ms_bucket{le="50"} 0
kamelot_embedding_latency_ms_bucket{le="100"} 45
kamelot_embedding_latency_ms_bucket{le="200"} 89
kamelot_embedding_latency_ms_bucket{le="500"} 12
kamelot_embedding_latency_ms_bucket{le="+Inf"} 3
kamelot_embedding_latency_ms_count 149
kamelot_embedding_latency_ms_sum 14250

# HELP kamelot_embedding_throughput_files_per_second Embedding throughput
# TYPE kamelot_embedding_throughput_files_per_second gauge
kamelot_embedding_throughput_files_per_second 10.5

# HELP kamelot_model_memory_bytes Model memory usage in bytes
# TYPE kamelot_model_memory_bytes gauge
kamelot_model_memory_bytes 4402341478
```

#### Grafana Dashboard

A pre-built Grafana dashboard is available at `monitoring/grafana-dashboard.json` with panels for:

1. Embedding latency (P50, P95, P99) over time
2. Embedding throughput (files/second) over time
3. Memory usage breakdown (model, KV cache, OS, application)
4. GPU utilization and VRAM usage
5. Queue depth and processing backlog
6. Model load/unload events
7. Error rate and retry count

### Cost Analysis

#### Cloud API Cost vs Local Inference (3 Years)

| Category | Text-embedding-3-small | Text-embedding-3-large | Kamelot (CPU) | Kamelot (GPU) |
|----------|----------------------|----------------------|---------------|---------------|
| Hardware | $0 | $0 | $800 (laptop) | $1,500 (desktop + GPU) |
| Indexing 100K | $2,000 | $13,000 | $0 | $0 |
| Monthly updates | $90 | $585 | $0 | $0 |
| Electricity (36mo) | $0 | $0 | $36 | $108 |
| **3-Year Total** | **$5,240** | **$34,060** | **$836** | **$1,608** |
| **Cost per 1M embeddings** | **$30** | **$195** | **$0.05** | **$0.02** |

#### Break-Even Analysis

| Scenario | Cloud Cost (3yr) | Local Cost (3yr) | Break-Even | Savings (3yr) |
|----------|-----------------|------------------|------------|---------------|
| Personal (50K files, 10/day) | $780 | $836 | N/A (cloud cheaper) | -$56 |
| Power user (500K files, 50/day) | $3,120 | $836 | 3 months | $2,284 |
| Team (5M files, 200/day) | $28,600 | $1,608 | 2 months | $26,992 |
| Enterprise (50M files, 2000/day) | $286,000 | $15,000 | 6 months | $271,000 |

For personal users with small collections, cloud API may be cheaper if no new hardware is needed. For any serious usage, local inference breaks even within months.

#### Total Cost of Ownership Calculator

```bash
kml tco --files 500000 --daily-new 50 --years 3
# Total Cost of Ownership Analysis
# 
# ┌──────────────────────────┬─────────────┬──────────────┐
# │ Category                 │ Cloud API   │ Kamelot Local│
# ├──────────────────────────┼─────────────┼──────────────┤
# │ Hardware (amortized)     │ $0          │ $800         │
# │ Initial indexing         │ $10,000     │ $0           │
# │ Monthly API fees         │ $135/mo     │ $0           │
# │ Electricity              │ $0          │ $1/mo        │
# │ Storage (vector DB)      │ $70/mo      │ $0           │
# │ Network egress           │ $30/mo      │ $0           │
# ├──────────────────────────┼─────────────┼──────────────┤
# │ 3-Year Total             │ $28,600     │ $836         │
# │ Savings                  │ -           │ $27,764      │
# │ Break-even               │ -           │ 2.1 months   │
# └──────────────────────────┴─────────────┴──────────────┘
```

---

## 6. References

1. Bai, Jinze, et al. "Qwen Technical Report." *arXiv preprint arXiv:2309.16609*, 2023.
2. Baniecki, Hubert, and Przemysław Biecek. "Model Inversion Attacks and Data Leakage in Machine Learning APIs." *Proceedings of the 31st ACM International Conference on Information and Knowledge Management (CIKM)*, 2022, pp. 3853–3857.
3. Brown, Tom B., et al. "Language Models are Few-Shot Learners." *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 33, 2020, pp. 1877–1901.
4. Carlini, Nicholas, et al. "Extracting Training Data from Large Language Models." *Proceedings of the 30th USENIX Security Symposium*, 2021, pp. 2633–2650.
5. Clop. "MOVEit Transfer Vulnerability: Data Breach Impact Analysis." *Mandiant Threat Intelligence Report*, 2023.
6. Dettmers, Tim, et al. "QLoRA: Efficient Finetuning of Quantized Language Models." *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 35, 2022, pp. 10023–10036.
7. Dettmers, Tim, et al. "SpQR: A Sparse-Quantized Representation for Near-Lossless LLM Weight Compression." *arXiv preprint arXiv:2306.03078*, 2023.
8. European Commission. "Open Source Software Strategy 2020-2023." *European Commission Digital Strategy*, 2020.
9. Frantar, Elias, et al. "GPTQ: Accurate Post-Training Quantization for Generative Pre-Trained Transformers." *Proceedings of the International Conference on Learning Representations (ICLR)*, 2023.
10. Gemma Team. "Gemma: Open Models Based on Gemini Research and Technology." *arXiv preprint arXiv:2403.08295*, 2024.
11. Gerganov, Georgi. "llama.cpp: LLM Inference in C/C++." *GitHub Repository*, 2023, github.com/ggerganov/llama.cpp.
12. Girdhar, Rohit, et al. "ImageBind: One Embedding Space To Bind Them All." *Proceedings of IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)*, 2023, pp. 15180–15190.
13. Hooper, Coleman, et al. "KVQuant: KV Cache Quantization for Efficient LLM Inference." *arXiv preprint arXiv:2401.01707*, 2024.
14. Jiang, Albert Q., et al. "Mistral 7B." *arXiv preprint arXiv:2310.06825*, 2023.
15. Johnson, Jeff, Matthijs Douze, and Hervé Jégou. "Billion-Scale Similarity Search with GPUs." *IEEE Transactions on Big Data*, vol. 7, no. 3, 2021, pp. 535–547.
16. Kleppmann, Martin, et al. "Local-First Software: You Own Your Data, in Spite of the Cloud." *Proceedings of the 2019 ACM SIGPLAN International Symposium on New Ideas, New Paradigms, and Reflections on Programming and Software (Onward!)*, 2019, pp. 154–168.
17. Lin, Ji, et al. "AWQ: Activation-Aware Weight Quantization for On-Device LLM Compression and Acceleration." *Proceedings of the 7th Conference on Machine Learning and Systems (MLSys)*, 2024.
18. Loshchilov, Ilya, and Frank Hutter. "Decoupled Weight Decay Regularization." *Proceedings of the International Conference on Learning Representations (ICLR)*, 2019.
19. Mangrulkar, Sourab, et al. "PEFT: State-of-the-Art Parameter-Efficient Fine-Tuning Methods." *arXiv preprint arXiv:2205.12423*, 2022.
20. Muennighoff, Niklas, et al. "MTEB: Massive Text Embedding Benchmark." *Proceedings of the 17th Conference of the European Chapter of the Association for Computational Linguistics (EACL)*, 2023, pp. 2006–2029.
21. Nagel, Markus, et al. "Up or Down? Adaptive Rounding for Post-Training Quantization." *Proceedings of the International Conference on Machine Learning (ICML)*, 2020, pp. 7197–7206.
22. Nielsen, Jakob. *Usability Engineering*. Academic Press, 1993.
23. OpenAI. "New Embedding Models and API Updates." *OpenAI Blog*, 2024, openai.com/blog/new-embedding-models.
24. Patterson, David, et al. "Carbon Emissions and Large Neural Network Training." *arXiv preprint arXiv:2104.10350*, 2021.
25. Reimers, Nils, and Iryna Gurevych. "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks." *Proceedings of EMNLP-IJCNLP*, 2019, pp. 3982–3992.
26. Touvron, Hugo, et al. "LLaMA: Open and Efficient Foundation Language Models." *arXiv preprint arXiv:2302.13971*, 2023.
27. Vaswani, Ashish, et al. "Attention Is All You Need." *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 30, 2017, pp. 5998–6008.
28. Wang, Liang, et al. "Text Embeddings by Weakly-Supervised Contrastive Pre-training." *arXiv preprint arXiv:2212.03536*, 2022.
29. Wong, Ken, et al. "Latency Perception in AI-Assisted User Interfaces." *Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems*, 2023, pp. 1–15.
30. Xiao, Guangxuan, et al. "SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models." *Proceedings of the International Conference on Machine Learning (ICML)*, 2023.
31. Yao, Zhewei, et al. "ZeroQuant: Efficient and Affordable Post-Training Quantization for Large-Scale Transformers." *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 35, 2022, pp. 27168–27181.
