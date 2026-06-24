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

# Cross-Platform FAQ

## Does Kazkade run on ARM macOS?
Yes. Kazkade fully supports Apple Silicon (M1, M2, M3, M4) via the ARM64 build. The macOS binary is a universal ("fat") binary containing both x86-64 and ARM64 slices, so the same download works on Intel and Apple Silicon Macs. On Apple Silicon, Kazkade uses NEON SIMD and is tuned for the Firestorm performance cores. Performance is comparable to an equivalent x86-64 AVX2 implementation.

## Does it work on Linux ARM (Raspberry Pi)?
Yes. An ARM64 Linux build is provided for aarch64 targets, including Raspberry Pi 4 and 5 (running 64-bit OS). NEON SIMD is fully utilised. On a Raspberry Pi 5 (Cortex-A76), GEMM benchmarks reach approximately 8–10 GFLOPS — sufficient for moderate data analysis and ledger verification. Note that Raspberry Pi 3 and earlier are not supported (ARMv8.0 is the minimum).

## What about Windows ARM?
Windows ARM64 (Snapdragon X Elite, etc.) is supported. The ARM64 Windows binary uses NEON SIMD and is functionally identical to the x64 build. The same `.zip` archive includes both x64 and ARM64 binaries, or you can download the architecture-specific package. Performance on Snapdragon X Elite is competitive with mid-range x86 laptops for columnar queries and ledger operations.

## How is the binary different per platform?
Binaries differ in three ways:
1. **SIMD dispatch**: x86 builds ship with SSE4.2 + AVX2 + AVX-512 code paths selected at runtime. ARM builds ship with NEON + optional SVE paths. Each binary only contains paths relevant to its architecture, keeping size small (~15 MB compressed).
2. **Memory-mapping semantics**: Windows uses `CreateFileMapping` with `MapViewOfFile`; Linux and macOS use `mmap` with `MAP_POPULATE`. The binary abstracts this behind a portable I/O layer, but platform-specific tuning flags differ.
3. **Executable format**: PE (Windows), Mach-O (macOS), ELF (Linux). The `.aioss` and `.acol` file formats are platform-independent and byte-order-agnostic (little-endian).

## Are .acol files cross-platform?
Yes. `.acol` files use a fixed little-endian layout and are fully portable across x64 Windows, ARM macOS, and Linux ARM. You can create a columnar file on a Raspberry Pi and query it on a Windows workstation with identical results.

## Can I cross-compile Kazkade?
Kazkade is distributed as prebuilt binaries. If you need to build from source, the recommended approach is native compilation. Cross-compilation is possible with Zig or LLVM toolchains but not officially supported. The build system uses a single Rust codebase with `#[cfg(target_arch)]` guards for platform-specific SIMD intrinsics.

## Are there any platform-specific limitations?
On macOS, the default `ulimit -n` (open file limit) is 256, which may be hit when memory-mapping many large `.acol` files simultaneously. Increase it with `ulimit -n 4096` in your shell profile. On Windows, ensure long path support is enabled (`fsutil behavior set disable8dot3 1`) if you store columnar files in deeply nested directories.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
