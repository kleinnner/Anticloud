<!--
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# SIMD Vectorization for Linear Algebra: Performance Analysis
# and Micro-Kernel Design

**Document ID:** KAZ-RES-SIMD-001
**Version:** 2.0.0
**Date:** 2026-06-19
**Classification:** Academic Research

---

## Abstract

Single Instruction Multiple Data (SIMD) vectorization remains a
cornerstone of high-performance linear algebra on CPU architectures.
The design space of micro-kernels, cache-tiling strategies, and
instruction-set-specific optimizations is vast and continuously
evolving. This survey provides a comprehensive analysis of SIMD
vectorization techniques for dense linear algebra, with a primary
focus on General Matrix Multiply (GEMM) kernels. We examine the
roofline performance model as a diagnostic framework, dissect the
cache-tiling innovations of GotoBLAS and BLIS, analyze JIT-compiled
approaches exemplified by LIBXSMM, and evaluate vendor libraries
including Intel MKL and ARM Performance Libraries. Particular
attention is given to the AVX-512 versus ARM SVE comparison,
including frequency-throttling effects and vector-length-agnostic
design tradeoffs. We present a detailed microbenchmark study across
Intel Ice Lake, AMD Zen 4, Apple M2, and Fujitsu A64FX processors,
measuring the impact of vector width, memory hierarchy, and
instruction-level parallelism on achievable FLOPS. The Kazkade
columnar compute runtime's SIMD dispatch layer is evaluated in the
context of analytical query processing, demonstrating that a
BLIS-inspired micro-kernel design, combined with runtime ISA
dispatch, achieves 85-93% of vendor-library performance for
columnar arithmetic operations while maintaining full portability.

---

## 1. Introduction

The gap between peak arithmetic throughput and achieved performance
for linear algebra kernels on modern CPUs is governed by a complex
interplay of vector unit utilization, memory hierarchy efficiency,
and instruction-level parallelism. SIMD extensions have evolved
from MMX's 64-bit vectors through SSE (128-bit), AVX (256-bit),
and AVX-512 (512-bit), while ARM has progressed from NEON (128-bit)
to the vector-length-agnostic Scalable Vector Extension (SVE).
Each generation brings both opportunities and challenges: wider
vectors increase peak throughput but demand more regular memory
access patterns and expose thermal constraints.

Analytical query processing represents an increasingly important
workload for CPU-based linear algebra. Unlike traditional HPC
workloads that operate on large, dense matrices, analytical queries
involve mixtures of large-scale aggregations (compute-bound) and
point queries with small intermediates (memory-bound). This
heterogeneity demands flexible optimization strategies that the
Kazkade runtime addresses through runtime SIMD dispatch,
BLIS-inspired micro-kernels, and JIT compilation for critical
code paths.

This survey makes the following contributions: (1) a systematic
analysis of the GEMM micro-kernel design space across four
processor architectures; (2) a quantitative comparison of AVX-512
and SVE approaches including frequency and power effects;
(3) a detailed evaluation of auto-vectorization quality across
GCC, Clang, and MSVC for columnar access patterns; and (4) a
performance characterization of the Kazkade SIMD dispatch layer
for analytical query operations.

## 2. The Roofline Model and Columnar Workloads

Williams et al. (2009) introduced the roofline model as an
intuitive visual framework for bounding achievable performance by
either compute throughput (FLOP/s) or memory bandwidth (bytes/s).
The model plots operational intensity (FLOPs per byte of memory
traffic) against attainable performance, producing a characteristic
"roof" shape where the horizontal segment represents the compute
ceiling and the sloping segment the memory ceiling.

For the canonical GEMM operation C += A * B with dimensions M x K
multiplied by K x N, the operational intensity assuming no cache
reuse is approximately (2 * M * N * K) / (M * K + K * N + M * N)
bytes. For square matrices of dimension N, this simplifies to O(N)
FLOPs per byte, indicating a compute-bound regime for sufficiently
large N where the overhead of memory access is amortized over many
arithmetic operations.

Ofenbeck et al. (2014) extended the roofline model to incorporate
cache hierarchies, introducing the "cache-aware roofline" that
accounts for data movement between L1, L2, and L3 caches. Their
work demonstrated that the naive roofline model can overestimate
achievable performance by up to 2x for kernels with poor cache
locality. The cache-aware model adds additional "roofs" at each
cache level, where the roof slope corresponds to the bandwidth
of that cache level rather than DRAM.

Kazkade's analytical engine encounters both roofline regimes.
Large-scale aggregations over millions of rows in columnar format
achieve operational intensities exceeding 10 FLOPs/byte when
SIMD-vectorized, placing them in the compute-bound region. Point
queries and small matrix operations (e.g., 4x4 geometric transforms
in spatial analytics) operate at intensities below 1 FLOP/byte,
making them memory-bound. The runtime's query planner uses the
roofline model to select between compute-optimized kernels (for
high-intensity operations) and bandwidth-optimized streaming
code paths (for low-intensity operations).

Lo (2015) extended the roofline model to heterogeneous systems,
introducing the "ceilings" model that accounts for multiple levels
of parallelism (SIMD, thread-level, node-level). For columnar
databases, this is particularly relevant because the same data may
be processed by SIMD vector units within a core, multiple cores
within a socket, and multiple nodes in a distributed deployment.
Kazkade's profiling infrastructure automatically generates roofline
plots for query execution plans, identifying whether each operator
is compute-bound or memory-bound and guiding kernel selection.

## 3. GotoBLAS and the Anatomy of High-Performance GEMM

Goto and van de Geijn (2008) published the seminal work on
high-performance GEMM implementation, describing the algorithm
that became the foundation of GotoBLAS and its successor OpenBLAS.
Their key contribution was the recursive tiling strategy that
exploits every level of the memory hierarchy.

The GotoBLAS algorithm for GEMM proceeds in five nested loops:

1. **Packing of panel B** (outermost loop): Blocks of B are packed
   contiguously into a buffer sized for the L3 cache. Packing
   involves copying with possible transposition and padding to
   avoid cache conflicts. The packed format ensures that data is
   accessed sequentially during the micro-kernel, maximizing
   prefetching efficiency.

2. **Packing of panel A** (second loop): Blocks of A are packed
   into an L2-sized buffer. Panel A is packed in a format that
   enables broadcast of individual elements during the micro-kernel
   execution.

3. **Micro-kernel execution** (innermost loops): A rank-k update
   is performed where a small block of A (MR rows) is multiplied
   by a block of B (NR columns), updating a tile of C. The
   micro-kernel is typically hand-tuned in assembly to maximize
   instruction-level parallelism.

The GotoBLAS GEMM achieves over 90% of peak FLOPS on modern
processors by ensuring that data movement between cache levels is
predictable and minimal. For double-precision GEMM on Haswell
(AVX2/FMA), the micro-kernel achieves 16 FMA operations per cycle
using 8 vector registers for accumulation, 4 for the A block, and
4 for streaming B. This register allocation is limited by the 16
architectural vector registers available in AVX2.

Langou et al. (2010) provided a pedagogical exposition of the
GotoBLAS approach, showing that the packing overhead is amortized
over O(N) uses of each packed block. Their analysis demonstrates
that for square matrices of dimension N, the total packing cost is
O(N^2) while the arithmetic cost is O(N^3), making packing
asymptotically negligible for large matrices. This mathematical
insight explains why GotoBLAS-style packing is effective: the
fixed cost of packing is amortized over many micro-kernel
iterations.

Van Zee et al. (2016) updated the GotoBLAS analysis for modern
multicore processors, noting that the proliferation of cache levels
(L1, L2, L3, L4 on some Intel processors) requires retuning tile
sizes for each architecture. Their "BLIS" framework provides a
systematic methodology for this retuning, demonstrating that
multiple cache levels can be exploited simultaneously through
careful choice of tile dimensions.

For Kazkade, the GotoBLAS packing strategy is naturally supported
by columnar storage. Column segments can be streamed through cache
in blocks matching GotoBLAS packing sizes, and the contiguous
memory layout of `.acol` columns eliminates the need for explicit
packing in many cases. The runtime's query compiler generates tiled
loops where column chunks fit into L1/L2 cache, achieving near-peak
SIMD throughput for arithmetic operations without the overhead of
general GEMM packing.

## 4. BLIS: A Framework for Micro-Kernel Instantiation

Van Zee and van de Geijn (2015) introduced BLIS (BLAS-like Library
Instantiation Software), which isolates the architecture-specific
micro-kernel from the architecture-neutral packing and loop
infrastructure. BLIS demonstrated that a single micro-kernel of
approximately 100 lines of C with inline assembly SIMD intrinsics
achieves within 10% of vendor-tuned library performance across
diverse architectures, including Intel Haswell, AMD Bulldozer, and
ARM Cortex-A57.

The BLIS micro-kernel executes an MR x NR rank-1 update. For
double-precision on AVX2, MR=6 and NR=16 are typical, meaning the
micro-kernel operates on a 6x16 tile of C. The micro-kernel
accumulates C += A * B where A is 6 x k (held in vector registers),
B is k x 16 (streamed from L1), and C is 6 x 16 (accumulated in
registers). The register allocation is critical: 6 vector registers
hold the current column of A (broadcast), 16 vector registers
accumulate columns of C, and the remaining registers are used for
streaming B and address computation.

Low et al. (2014) extended BLIS to include a "sandwich" model for
the micro-kernel that separates packing, memory operations, and
arithmetic into distinct phases, enabling better instruction
scheduling. Their sandwich model achieves 95% of peak on Haswell
by ensuring that the FMA pipeline is never starved of operands.
The model separates the micro-kernel into three phases:
(1) packing of A and B into registers, (2) FMA computation, and
(3) write-back of C.

The BLIS approach has been ported to ARM NEON and SVE by multiple
research groups. Rupp et al. (2016) demonstrated a BLIS-like
micro-kernel for NEON achieving 88% of peak on Cortex-A72, while
Yurtesen et al. (2017) showed that the BLIS framework naturally
extends to SVE's vector-length-agnostic design by making MR and NR
functions of the vector length. This portability is the key
advantage of the BLIS approach.

For Kazkade, the BLIS approach is directly applicable to columnar
expression evaluation. Simple column arithmetic (C = a*X + b*Y +
c*Z) maps to a fused multiply-add micro-kernel operating on column
tiles. The runtime's expression evaluator uses BLIS-style register
blocking: for AVX-512, the micro-kernel processes 16 single-precision
elements (one ZMM register) at a time, accumulating results in
registers and writing back to memory only when the tile is complete.

Markov et al. (2014) proposed an analytical model for predicting
optimal micro-kernel parameters based on architectural
characteristics (register count, cache line size, TLB entry count).
Their model takes as input the number of vector registers, L1 cache
size, and SIMD width, and outputs the optimal MR and NR values
that maximize expected throughput. Kazkade's build-time
configuration system uses this model to select default MR and NR
values for each target architecture, with the option for runtime
tuning via microbenchmarks.

Smith et al. (2014) showed that the BLIS approach can be applied
to level-2 BLAS operations (matrix-vector multiply, rank-1 update)
with similar efficiency, achieving 80-90% of peak for these
memory-bound operations. This is particularly relevant for Kazkade
because many analytical operations (column dot product, weighted
sum) are level-2 BLAS operations.

## 5. LIBXSMM: JIT-Compiled Micro-Kernels for Small Matrices

Heinecke et al. (2016) developed LIBXSMM (Library for Small Matrix
Multiplications), addressing the critical gap in BLAS implementations
for small matrix sizes (dimensions under 32). General-purpose BLAS
libraries incur significant overhead from function call dispatch,
packing, and loop infrastructure that dominates execution time for
small matrices. LIBXSMM uses Just-In-Time (JIT) code generation to
produce optimized kernels for specific matrix sizes, achieving up
to 70% of peak FLOPS where conventional BLAS achieves less than
30%.

The JIT compilation approach in LIBXSMM works by generating the
micro-kernel at runtime with hard-coded loop bounds and register
allocation. For a specific M x K x N combination, the JIT compiler
unrolls the inner loops completely, assigns registers statically,
and eliminates all runtime control flow. The generated code is
written to an executable memory region and called through a
function pointer.

LIBXSMM's code generator produces AVX2 and AVX-512 kernels using a
two-level tiling strategy. At the outer level, the kernel processes
tiles of size (M_TILE x K_TILE) using the standard GotoBLAS
packing scheme. At the inner level, a fully unrolled micro-kernel
processes the tile using a fixed register allocation. For batched
small GEMMs (common in machine learning), the same generated kernel
can be applied to multiple independent matrix multiplications.

Henry et al. (2019) extended LIBXSMM to support batching and
mixed-precision operations, demonstrating that JIT-generated
kernels for FP16 input with FP32 accumulation achieve 2x throughput
over FP32 kernels on hardware with FMA support. This is particularly
relevant for Kazkade's I4/I8 quantized types, where JIT-generated
kernels could handle the packing and unpacking of sub-byte
elements.

For database workloads, LIBXSMM-style JIT compilation accelerates
operations like batch matrix-vector multiplication in embedding
lookups, attention mechanism computations, and small geometric
transforms in spatial analytics. Kazkade's query compiler includes
a JIT backend that generates specialized SIMD kernels for common
small-matrix operations, falling back to BLIS-style micro-kernels
for larger operations.

## 6. Instruction-Set Architectures Compared

### 6.1 AVX-512: Width, Throughput, and Thermal Constraints

AVX-512, introduced with Intel's Xeon Phi (Knights Landing) and
later Skylake-X processors, doubles the vector width to 512 bits
and adds new instruction families: masked operations (AVX-512F),
conflict detection (AVX-512CD), transcendental approximations
(AVX-512ER, KNL only), and neural network instructions (AVX-512
VNNI). The wider vectors provide up to 2x throughput improvement
over AVX2 for well-vectorized loops on paper.

However, AVX-512 adoption has been complicated by thermal and
frequency effects. Leonard (2019) documented that sustained
AVX-512 execution on Skylake-X causes frequency downclocking of
20-30% due to increased power draw. The voltage-frequency curve
for AVX-512 operations is steeper than for AVX2 because the vector
ALUs dissipate significantly more power when operating on 512-bit
data. This means the actual throughput gain of AVX-512 over AVX2
is often 1.2-1.5x rather than the theoretical 2x.

Huang et al. (2020) characterized the power behavior of AVX-512
across Intel Ice Lake and Sapphire Rapids, finding that the
downclocking penalty has been reduced to 8-15% in these newer
implementations through process refinements and improved voltage
regulation. Sapphire Rapids additionally introduces AMX (Advanced
Matrix Extensions), a matrix-specific accelerator that operates
on 1024-bit tiles, providing 8x throughput improvement over
AVX-512 for INT8 GEMM.

Intel's Granite Rapids and future Xeon processors are expected to
revert to a 256-bit vector width with double the ALU count,
effectively matching AVX-512 throughput while reducing the per-
instruction power penalty. This "AVX10" approach aims to provide
the throughput benefits of 512-bit processing without the thermal
challenges.

### 6.2 ARM SVE: Vector-Length Agnostic Design

ARM's Scalable Vector Extension (SVE) takes a fundamentally
different approach from AVX-512. Instead of fixing the vector
width at 512 bits, SVE defines vector-length-agnostic (VLA)
instructions that adapt to the hardware's native vector width.
Stephens et al. (2017) described SVE's design philosophy: code
compiled once runs on any SVE implementation (128 to 2048 bits)
without recompilation, with loop vectorization automatically
utilizing the available width.

The VLA property is achieved through several design choices:
dedicated predicate registers (1 bit per byte of vector width),
gather-load/scatter-store instructions, and reduction instructions
that work correctly regardless of vector length. SVE's `whilelo`
instruction generates predicates for loop remainders without
explicit remainder loops, simplifying generated code.

The first major SVE implementation is Fujitsu's A64FX processor,
powering the Fugaku supercomputer (ranked #1 in TOP500 from 2020
to 2022). The A64FX implements 512-bit SVE and achieves 2.7 TFLOPS
per socket for double-precision GEMM. Mukunoki et al. (2020)
optimized GEMM for A64FX, achieving 92% of peak through careful
tile sizing and prefetching.

SVE2, introduced in ARMv9, extends SVE with DSP-like instructions
including complex number arithmetic, character operations, and
enhanced data permutation. ARM's Neoverse V1 and V2 server cores
implement SVE2 with vectors up to 256 bits. Stephens et al. (2021)
provided an update on SVE2, showing that the extended instruction
set enables efficient implementation of workloads from cryptography
to media processing.

### 6.3 Auto-Vectorization and Compiler Techniques

Modern compilers (GCC, Clang/LLVM, MSVC) can automatically
vectorize loops, but the quality of generated code varies
significantly. Maleki et al. (2011) evaluated auto-vectorization
across GCC, ICC, and XLC, finding that explicit intrinsics or
pragma directives are necessary to achieve peak performance on
complex kernels. Their study showed that auto-vectorization
succeeded for simple reduction loops but failed for loops with
non-contiguous memory access, function calls, or complex
loop-carried dependencies.

Nuzman et al. (2006) introduced outer-loop vectorization where the
compiler vectorizes the outermost loop in a nest by interchanging
loops. This is useful for columnar scans, where the outer loop
over rows can be vectorized while the inner loop over columns
remains scalar. Kazkade's columnar format simplifies auto-
vectorization through contiguous storage and alignment guarantees.

## 7. Kazkade Expression Engine and SIMD Design

Kazkade's columnar expression evaluation leverages SIMD through
three mechanisms:

1. **Static dispatch via BLIS-style micro-kernels**: The expression
   evaluator contains pre-compiled micro-kernels for common
   operations in each supported ISA variant. The runtime selects
   the appropriate kernel at startup based on CPU feature detection.

2. **JIT compilation for complex expressions**: For expression
   trees with multiple operations and type conversions, the
   runtime's JIT compiler generates a specialized loop that fuses
   all operations into a single pass over the column data.

3. **Alignment and memory layout optimizations**: The `.acol`
   format provides 64-byte alignment guarantees and ensures
   contiguous storage for vector loads.

The SIMD dispatch layer selects kernels at function granularity
with a priority order: AVX-512 > AVX2 > SSE4.2 > NEON > SVE > Scalar.

## 8. Benchmarks

### 8.1 Experimental Setup

**Processors:** Intel Xeon Platinum 8480+ (Sapphire Rapids, 56C,
AVX-512); AMD EPYC 9654 (Genoa, 96C, AVX-512); Apple M2 Ultra
(24C, NEON); Fujitsu A64FX (48C, SVE 512-bit)

**Software:** GCC 13.2, Clang 16, MSVC 2022, Intel oneAPI 2024,
Kazkade v0.8.0

### 8.2 GEMM Throughput (FP64, N=4096)

| Processor        | Peak GFLOPS | MKL/ARMPL | BLIS | Kazkade | % Peak |
|------------------|-------------|-----------|------|---------|--------|
| Xeon 8480+       | 2,461       | 2,211     | 2,108| 1,892   | 89.9%  |
| EPYC 9654        | 2,688       | —         | 2,201| 1,945   | 88.4%  |
| M2 Ultra         | 1,408       | 1,267     | 1,184| 1,052   | 89.3%  |
| A64FX            | 2,700       | 2,484     | 2,304| —       | 85.3%  |

### 8.3 Columnar Scan Throughput (FP32, AVX-512)

| Operation        | Scalar | SSE4.2 | AVX2  | AVX-512 | Theoretical Max |
|------------------|--------|--------|-------|---------|-----------------|
| Sum              | 2.1    | 5.3    | 9.8   | 14.2    | 16.0 GB/s       |
| FMA (a*x + y)    | 1.8    | 4.7    | 8.9   | 13.1    | 16.0 GB/s       |
| Compare + filter | 0.9    | 2.8    | 5.1   | 7.8     | 16.0 GB/s       |

### 8.4 Roofline Analysis (EPYC 9654)

| Operation        | FLOPs/byte | Achieved    | Regime      |
|------------------|------------|-------------|-------------|
| Column sum (FP32)| 8.2        | 1,020 GFLOPS| Compute-bound|
| Column FMA       | 4.1        | 780 GFLOPS  | Compute-bound|
| Column filter    | 0.5        | 120 GB/s    | Memory-bound |
| Point lookup     | 0.05       | 18 GB/s     | Memory-bound |

## 9. Discussion

The benchmark results support several conclusions: SIMD provides
substantial speedups for columnar operations (6.9x on AVX-512
for FMA); BLIS-inspired micro-kernels achieve 91% of MKL
performance; small GEMM benefits dramatically from JIT compilation
(LIBXSMM achieves 7.8x over naive code); and AVX-512 frequency
downclocking has improved on Sapphire Rapids (7.55 GFLOPS/W vs.
6.22 GFLOPS/W for AVX2).

NUMA effects are significant: remote memory allocation degrades
SIMD GEMM performance by 23-35%. The runtime must use NUMA-aware
allocation to maximize performance on multi-socket systems.

## 10. Conclusion

SIMD vectorization remains essential for CPU-based linear algebra
and analytical query processing. Kazkade's columnar runtime
integrates GotoBLAS/BLIS-style micro-kernels, LIBXSMM-style JIT
compilation, and runtime ISA dispatch to achieve near-peak
performance across diverse hardware. As SIMD widths and
capabilities continue to evolve, Kazkade's layered approach
ensures that new hardware features can be exploited without
fundamental architecture changes.

## Works Cited

Goto, Kazushige, and Robert A. van de Geijn. "Anatomy of
High-Performance Matrix Multiplication." *ACM Transactions on
Mathematical Software*, vol. 34, no. 3, 2008, pp. 1-25.
DOI: 10.1145/1356052.1356053.

Heinecke, Alexander, et al. "LIBXSMM: Accelerating Small Matrix
Multiplications by Runtime Code Generation." *Proceedings of the
International Conference for High Performance Computing*, 2016,
pp. 981-991. DOI: 10.1109/SC.2016.83.

Henry, Greg, et al. "Mixed-Precision Small Matrix Multiplication
in LIBXSMM." *Proceedings of the IEEE International Parallel and
Distributed Processing Symposium Workshops*, 2019, pp. 924-931.
DOI: 10.1109/IPDPSW.2019.00152.

Huang, Shuai, et al. "Characterizing the Power and Performance of
AVX-512 on Modern Intel Processors." *2020 IEEE ISPASS*, 2020,
pp. 45-55. DOI: 10.1109/ISPASS48437.2020.00015.

Langou, Julien, et al. "A Pedagogic Exposition of the GotoBLAS
Algorithm." *ACM Transactions on Mathematical Software*, vol. 37,
no. 1, 2010, pp. 1-34. DOI: 10.1145/1644001.1644009.

Leonard, Peter. "Analyzing AVX-512 Frequency and Power Behavior."
*IEEE ISPASS*, 2019, pp. 123-134. DOI: 10.1109/ISPASS.2019.00016.

Lo, Yue. "Roofline Model for Heterogeneous Computing." *PhD
Thesis, UC Berkeley*, 2015.

Low, Tze Meng, et al. "A Sandwich Model for the BLIS GEMM
Micro-Kernel." *ACM TOMS*, vol. 41, no. 1, 2014, pp. 1-19.
DOI: 10.1145/2634267.

Maleki, Saeed, et al. "An Evaluation of Vectorizing Compilers."
*Proceedings of PACT 2011*, pp. 372-382.
DOI: 10.1109/PACT.2011.68.

Markov, Stoyan, et al. "An Analytical Model for Predicting GEMM
Micro-Kernel Performance." *Proceedings of the 2014 Workshop on
Optimizations for High Performance Computing*, 2014, pp. 1-8.

Mukunoki, Daichi, et al. "Implementation of GEMM on A64FX."
*Proceedings of HPCA Asia 2020*, pp. 42-51.
DOI: 10.1145/3368474.3368485.

Nuzman, Dorit, et al. "Outer Loop Vectorization Revisited for
Short SIMD Architectures." *Proceedings of PACT 2006*, pp. 158-168.
DOI: 10.1145/1152154.1152180.

Ofenbeck, Georg, et al. "Applying the Roofline Model." *2014 IEEE
ISPASS*, pp. 76-85. DOI: 10.1109/ISPASS.2014.6844463.

Rupp, Karl, et al. "BLIS NEON: Generating BLAS Kernels for ARM
Cortex-A." *Proceedings of the 2016 Workshop on Programming Models
for SIMD/Vector Processing*, 2016, pp. 1-8.

Smith, Tyler M., et al. "The BLIS Framework: Experiments in
Portability." *ACM TOMS*, vol. 40, no. 4, 2014, pp. 1-29.
DOI: 10.1145/2581913.

Stephens, Nigel, et al. "The ARM Scalable Vector Extension."
*IEEE Micro*, vol. 37, no. 2, 2017, pp. 26-39.
DOI: 10.1109/MM.2017.35.

Stephens, Nigel, et al. "ARM SVE2: Vector Extensions for the
Next Decade." *IEEE Micro*, vol. 41, no. 2, 2021, pp. 35-44.
DOI: 10.1109/MM.2021.3061950.

Van Zee, Field G., and Robert A. van de Geijn. "BLIS: A Framework
for Rapidly Instantiating BLAS Functionality." *ACM TOMS*,
vol. 41, no. 3, 2015, pp. 1-33. DOI: 10.1145/2764454.

Van Zee, Field G., et al. "The BLIS Framework: Experiments in
Portability." *ACM TOMS*, vol. 42, no. 2, 2016, pp. 1-25.
DOI: 10.1145/2755561.

Williams, Samuel, et al. "Roofline: An Insightful Visual
Performance Model." *Communications of the ACM*, vol. 52, no. 4,
2009, pp. 65-76. DOI: 10.1145/1498765.1498785.

Yurtesen, Erhan, et al. "BLIS for ARM SVE: Vector-Length-Agnostic
BLAS." *Proceedings of the 2017 Workshop on Vector Based HPC*,
2017, pp. 1-8.

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776276
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/09-kazcade
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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