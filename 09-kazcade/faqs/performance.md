<!--
  ▄▄   ▄▄▄                      ▄▄                        ▄▄                     
  ██  ██▀                       ██                        ██                     
  ▄▄▄█  ██▄██      ▄█████▄  ████████  ██ ▄██▀    ▄█████▄   ▄███▄██   ▄████▄   █▄▄▄     
  ▄▄█▀▀▀    █████      ▀ ▄▄▄██      ▄█▀   ██▄██      ▀ ▄▄▄██  ██▀  ▀██  ██▄▄▄▄██    ▀▀▀█▄▄ 
  ▀▀█▄▄▄    ██  ██▄   ▄██▀▀▀██    ▄█▀     ██▀██▄    ▄██▀▀▀██  ██    ██  ██▀▀▀▀▀▀    ▄▄▄█▀▀ 
      ▀▀▀█  ██   ██▄  ██▄▄▄███  ▄██▄▄▄▄▄  ██  ▀█▄   ██▄▄▄███  ▀██▄▄███  ▀██▄▄▄▄█  █▀▀▀     
           ▀▀    ▀▀   ▀▀▀▀ ▀▀  ▀▀▀▀▀▀▀▀  ▀▀   ▀▀▀   ▀▀▀▀ ▀▀    ▀▀▀ ▀▀    ▀▀▀▀▀
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Performance FAQ

## Why is Kazkade fast?
Kazkade is built around three principles: **zero-copy**, **cache-aware data layout**, and **explicit SIMD vectorisation**. Columnar files are memory-mapped so the kernel's virtual memory system handles loading — no copying into intermediate buffers. Data is laid out in column-major order optimised for SIMD gather/scatter, and all hot loops are hand-tuned using intrinsics (no auto-vectorisation guesswork). The result is near-roofline utilisation on modern CPUs.

## What SIMD is supported?
- **x86-64**: SSE4.2, AVX2, AVX-512 (F + CD + BW + DQ + VL). At startup, Kazkade selects the best available path. A CPU with AVX2 (Haswell or later) is strongly recommended for peak GEMM performance.
- **ARM64**: NEON (128-bit), SVE (if available, detected at runtime). Apple Silicon M1–M4 use NEON with special tuning for the Firestorm/PerfMonitor PMU counters.

## How do I get the best GEMM performance?
1. Ensure your CPU supports AVX2 (x86) or NEON (ARM). Run `kazkade self-test` to confirm active SIMD paths.
2. Set matrix dimensions to multiples of 64 to avoid tail handling overhead.
3. Use `--threads` equal to your physical core count (not logical threads/hyperthreads). For example, on a 12-core/24-thread CPU, use `--threads 12`.
4. Warm the cache by running the benchmark twice — the second run reflects steady-state performance.
5. On Linux, use `cpupower frequency-set -g performance` to disable frequency scaling during benchmarks.

## What affects rasterizer FPS?
Rasterizer FPS is primarily bound by memory bandwidth and SIMD throughput. Key factors: resolution (fewer pixels = higher FPS), triangle count, and whether the workload fits in L2/L3 cache. Batch size matters — the rasterizer is most efficient with 10k–100k triangles per draw call.

## How do I interpret benchmark output?
Benchmark output shows three columns: **Metric**, **Value**, and **Units**. For GEMM, the metric is GFLOPS achieved vs theoretical peak, shown as a percentage. For the rasterizer, FPS and fill rate (GPixel/s) are reported. Hash-chain benchmarks show signatures per second. A "memory bandwidth" sub-test also runs to help diagnose bottlenecks — if achieved GFLOPS is below 50% of peak, memory bandwidth is likely the limiter.

## Can I benchmark specific sub-systems?
Yes. Pass individual flags: `kazkade bench --gemm` (matrix multiply only), `kazkade bench --raster` (software rasteriser), `kazkade bench --hash` (Ed25519 signing), or `kazkade bench --all` (default). Combine with `--csv` for easy import into spreadsheets or plotting tools.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

