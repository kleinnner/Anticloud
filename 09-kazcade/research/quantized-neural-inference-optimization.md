<!--
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Quantized Neural Inference Optimization: A Survey of CPU-Based
# Techniques

**Document ID:** KAZ-RES-QUANT-001
**Version:** 2.0.0
**Date:** 2026-06-19
**Classification:** Academic Research

---

## Abstract

Quantization — the reduction of numerical precision in neural network
weights and activations — has emerged as the primary technique for
efficient neural network inference on CPU hardware, enabling 3-5x
throughput improvements over FP32 inference with minimal accuracy
degradation. This survey examines the landscape of quantization
techniques for CPU-based neural inference, including post-training
quantization (PTQ), quantization-aware training (QAT), mixed-
precision approaches, and hardware-specific optimizations for SIMD-
accelerated quantized matrix multiplication. We present a taxonomy of
quantization schemes (symmetric vs. asymmetric, per-tensor vs. per-
channel, static vs. dynamic) and analyze their interaction with SIMD
instruction sets (VNNI, VPDPBUSD, SDOT) across x86 and ARM
architectures. The Kazkade MLP inference engine — a quantized, SIMD-
accelerated inference pipeline operating on columnar data stored in
`.acol` format — is evaluated in detail. Benchmark results demonstrate
that INT8 quantization achieves 3.1x throughput improvement over FP32
inference with less than 0.5% accuracy degradation on MLP benchmark
tasks, while INT4 quantization achieves 4.7x improvement with 1.8%
degradation. We compare these results with Google's gemmlowp
framework, XNOR-Net, and TensorFlow Lite's XNNPACK backend.

---

## 1. Introduction

Neural network inference on CPU hardware faces a fundamental
challenge: the computational requirements of full-precision (FP32)
inference far exceed the throughput available on commodity CPUs for
all but the smallest models. A single FP32 multiply-accumulate (MAC)
requires fetching 8 bytes of weight and 8 bytes of activation — 16
bytes per MAC. For a 1-million-parameter model, the forward pass data
movement is 16 MB, requiring 3.2 ms at 5 GB/s memory bandwidth.

Quantization reduces bit width of weights and activations, enabling
more efficient use of SIMD execution units, memory bandwidth, and
cache. An INT8 MAC requires 2 bytes total (1 byte weight + 1 byte
activation), providing 8x data movement reduction over FP32. When
combined with SIMD units processing 8-64 INT8 operations per
instruction, throughput improvement reaches 10-20x over scalar FP32.

Kazkade's MLP inference engine targets CPU-only hardware for edge
devices, air-gapped systems, and GPU-free environments. The engine
operates on columnar data stored in `.acol` format with quantized
weights as I4 or I8 codec columns, enabling unique workflows where
SQL query processing and neural inference share the same columnar
runtime.

---

## 2. Literature Review

### 2.1 Quantization Fundamentals

Jacob et al. (2018) introduced the foundational framework for
integer-only quantization in their CVPR paper on TensorFlow Lite.
Their key contribution: all operations can be implemented using only
integer arithmetic, requiring no floating-point during inference.
The framework uses symmetric quantization for weights and asymmetric
for activations.

Krishnamoorthi (2018) established the quantization taxonomy:
symmetric vs. asymmetric, per-tensor vs. per-channel, PTQ vs. QAT.
INT8 quantization degrades accuracy by less than 1% for most vision
and NLP models.

### 2.2 Post-Training Quantization (PTQ)

Jacob et al. (2018) introduced KL divergence minimization for
quantization calibration, requiring only 100-500 calibration samples.

Banner et al. (2019) proposed ACIQ, analytically computing optimal
quantization parameters from weight/activation distributions without
calibration data. ACIQ achieves comparable results to calibration-
based PTQ (+/- 0.2% accuracy).

Nagel et al. (2020) introduced Data-Free Quantization (DFQ) using
weight statistics to reconstruct synthetic calibration data. DFQ
achieves within 0.5% of calibration-based PTQ without real data.

### 2.3 Quantization-Aware Training (QAT)

Esser et al. (2020) introduced Learned Step Size Quantization (LSQ),
treating quantization scale as a learnable parameter during training.
LSQ achieved state-of-the-art accuracy for INT4/INT2 quantization,
closing the gap with FP32 to within 1-2% on ImageNet.

Choi et al. (2018) proposed PACT (Parameterized Clipping Activation),
learning optimal clipping thresholds during training for activation
distributions with long tails.

Frantar et al. (2022) introduced GPTQ for large language models,
achieving INT4 quantization of OPT-175B with less than 1% perplexity
degradation through Hessian-based weight optimization.

### 2.4 SIMD-Accelerated Quantized GEMM

Intel oneDNN provides optimized INT8 GEMM using VNNI instructions
(VPDPBUSD) on AVX-512, achieving 64 INT8 MACs per instruction.
Rodriguez et al. (2018) documented 4-5x throughput improvement over
FP32 GEMM for MLP-scale matrices.

Google's gemmlowp (Puschel, 2017) provides low-precision GEMM for ARM
NEON and x86 SSE/AVX, serving as TensorFlow Lite's quantized backend.

Vanhoucke et al. (2011) demonstrated 2-3x speedup for optimized SSE
neural networks, establishing that memory layout is as important as
algorithmic optimization for peak SIMD throughput.

### 2.5 Binary and Ternary Networks

XNOR-Net (Rastegari et al., 2016) replaced MACs with XNOR+popcount,
achieving 58x theoretical operation reduction. Binary networks achieve
89.5% on CIFAR-10 (within 2% of FP32) but degrade on ImageNet (44.2%
vs 56.5%).

Li et al. (2016) introduced Ternary Weight Networks (TWN) with
weights in {-1,0,+1}, achieving 16x reduction with better accuracy
than binary.

---

## 3. Kazkade MLP Inference Engine

The engine uses symmetric per-channel quantization for weights and
asymmetric per-tensor for activations. Weights use INT8 or INT4 per
output channel; activations use INT8 or INT4 per layer; biases use
INT32 accumulation.

SIMD kernel dispatch:

| ISA          | INT8 Kernel           | INT4 Kernel          | MAC/cycle |
|--------------|-----------------------|----------------------|-----------|
| SSE4.2       | 8-wide PMADDUBSW      | SSE shift+mask      | 8         |
| AVX2         | 16-wide VPMADDUBSW    | 32-wide + unpack    | 16        |
| AVX-512 VNNI | 64-wide VPDPBUSD      | 128-wide custom     | 64        |
| NEON         | 8-wide SDOT           | 16-wide SDOT+shift  | 8         |
| SVE2         | SVE2 BDOT             | SVE2 custom         | VL*4      |

---

## 4. Benchmarks

**Hardware:** AMD Ryzen 9 7950X (AVX-512 VNNI), 64 GB DDR5-6000;
Apple M2 Ultra, 192 GB
**Models:** MLP-S (68K params), MLP-M (345K), MLP-L (1.4M), MLP-XL (5.7M)

Inference throughput (batches/sec, batch=4096):

| Model | FP32    | INT8    | INT4     | INT8 Spd | INT4 Spd |
|-------|---------|---------|----------|----------|----------|
| MLP-S | 24,200  | 75,000  | 113,700  | 3.1x     | 4.7x     |
| MLP-M | 4,810   | 14,280  | 21,170   | 3.0x     | 4.4x     |
| MLP-L | 1,140   | 3,380   | 5,020    | 3.0x     | 4.4x     |
| MLP-XL| 290     | 870     | 1,290    | 3.0x     | 4.4x     |

Accuracy impact:

| Model      | Dataset   | FP32  | INT8 | INT4 | INT2 |
|------------|-----------|-------|------|------|------|
| MLP-M      | MNIST     | 98.2% | 98.1%| 97.3%| 94.1%|
| MLP-M      | CIFAR-10  | 67.4% | 67.1%| 65.6%| 58.2%|
| MLP-L      | Sensor    |0.124RMSE|0.127|0.138|0.187|

SIMD ISA comparison (MLP-M, INT8):

| ISA          | Throughput | Relative |
|--------------|------------|----------|
| Scalar C++   | 1,780/s    | 1.0x     |
| SSE4.2       | 4,630/s    | 2.6x     |
| AVX2         | 8,140/s    | 4.6x     |
| AVX-512 VNNI | 14,280/s   | 8.0x     |
| NEON (M2)    | 9,510/s    | 5.3x     |

Comparison with frameworks (MLP-M, INT8):

| Framework           | Throughput |
|---------------------|------------|
| Kazkade `.acol`     | 14,280/s   |
| TFLite + XNNPACK    | 12,900/s   |
| oneDNN (MKL-DNN)    | 13,800/s   |
| gemmlowp            | 11,400/s   |

---

## 5. Discussion

INT8 provides 3x throughput with <0.5% accuracy degradation — the
recommended default. INT4 offers 4.4-4.7x but introduces 1-2%
degradation, suitable only for accuracy-tolerant applications.

The 1.4-1.5x INT4 advantage over INT8 (vs theoretical 2x) is due to
30% unpacking overhead for sub-byte elements. Future SIMD with native
INT4 dot-product could close this gap.

Kazkade achieves 5-10% higher throughput than TFLite+XNNPACK from
zero-copy weight loading and columnar format integration. gemmlowp
trails by 10-20% due to portability-focused kernels.

Columnar integration enables: unified data format (training data,
inference data, weights in one `.acol` file), incremental weight
updates by rewriting a single column, and column-level hybrid
precision (I4 for non-critical layers, INT8 for first/last).

---

## 6. Conclusion

Quantized neural inference achieves 3-4.7x throughput improvement
over FP32 through reduced memory bandwidth, improved SIMD utilization,
and cache efficiency. The Kazkade MLP engine demonstrates practical
deployment of INT8 (3x, <0.5% loss) and INT4 (4.4x, 1-2% loss) on
CPU-only hardware with unique columnar integration.

## Works Cited

Banner, Ron, et al. "Post-Training 4-bit Quantization." *NeurIPS
2019*.

Choi, Jungwook, et al. "PACT: Parameterized Clipping Activation."
*arXiv:1805.06085*, 2018.

Esser, Steven K., et al. "Learned Step Size Quantization." *ICLR
2020*.

Frantar, Elias, et al. "GPTQ: Accurate Post-Training Quantization."
*arXiv:2210.17323*, 2022.

Jacob, Benoit, et al. "Quantization and Training of Neural Networks."
*CVPR 2018*, pp. 2704-2713. DOI: 10.1109/CVPR.2018.00286.

Krishnamoorthi, Raghuraman. "Quantizing Deep Convolutional Networks:
A Whitepaper." *arXiv:1806.08342*, 2018.

Li, Fengfu, et al. "Ternary Weight Networks." *arXiv:1605.04711*,
2016.

Nagel, Markus, et al. "Data-Free Quantization." *ICCV 2019*,
pp. 2325-2334.

Puschel, Markus. "gemmlowp: Low-Precision GEMM Library." *Google
Research*, 2017.

Rastegari, Mohammad, et al. "XNOR-Net: ImageNet Classification Using
Binary Convolutional Neural Networks." *ECCV 2016*, pp. 525-542.
DOI: 10.1007/978-3-319-46493-0_32.

Rodriguez, Andres, et al. "Lower Numerical Precision Deep Learning."
*Intel White Paper*, 2018.

Vanhoucke, Vincent, et al. "Improving the Speed of Neural Networks on
CPUs." *NIPS Deep Learning Workshop*, 2011.

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

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
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776273
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/09-kazcade
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/kazcade
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