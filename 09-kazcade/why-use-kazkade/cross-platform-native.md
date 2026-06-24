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

# Cross-Platform Native — One Codebase, All Platforms, No Emulation

## The Multi-Platform Tax

Most cross-platform tools fall into one of two camps: **interpreted runtimes** (Python, Java, Node) that run everywhere but sacrifice performance and add deployment complexity, or **web-wrapper frameworks** (Electron, Tauri, React Native) that embed a browser or JavaScript engine, trading native performance for UI portability. Neither approach delivers true native performance outside its home platform.

Kazkade takes a different path: it compiles to native machine code on all three desktop platforms from the same source, using the same SIMD intrinsics, producing binaries that behave identically regardless of OS.

## True Native, Everywhere

A Kazkade binary on Windows is a Portable Executable (PE) that calls the Windows API directly. On macOS, it's a Mach-O that uses Grand Central Dispatch for thread pooling. On Linux, it's an ELF that uses `io_uring` and `futex` wait. But the core algorithm — the SIMD kernels, the memory-mapped column access, the cryptographic ledger — is exactly the same C code compiled for each target.

This means:

- **No Electron** — no Chromium renderer, no V8 isolate, no 150 MB baseline memory
- **No WebView** — no WebKit, no Blink, no DOM, no JavaScript bridge
- **No emulation** — no WINE, no Rosetta, no QEMU, no WSL
- **No JIT warmup** — the code is already machine code from the first instruction

## Same SIMD Primitives on All Three

Kazkade abstracts SIMD through a portable intrinsic layer that maps to the best available instruction set on each platform:

| Architecture | Platform | ISA | Kazkade Path |
|---|---|---|---|
| x86-64 | Windows, Linux | AVX-512, AVX2, SSE4.2 | Auto-detected, best path selected |
| x86-64 | macOS (Intel) | AVX2, SSE4.2 | Same detection, no AVX-512 fallback |
| ARM64 | macOS (Apple Silicon) | NEON, SVE | NEON path, 128/256-bit dispatch |
| ARM64 | Linux (Raspberry Pi 5) | NEON | Same NEON code as Apple Silicon |

A dot product kernel computes the same IEEE 754 result on every platform. The only difference is throughput, dictated by the hardware, not by software differences.

## Identical Binary Behavior

Cross-platform projects often suffer from behavioral drift: `rand()` seeds differ, file paths have different conventions, thread scheduling varies, floating-point flush-to-zero modes diverge. Kazkade's runtime explicitly normalizes these:

- **Floating-point environment**: All platforms use round-to-nearest-even, flush-to-zero disabled, denormals-are-zero disabled. Results are reproducible across OS boundaries.
- **File paths**: Kazkade uses a normalized virtual path layer; `/` works everywhere, and the runtime canonicalizes to the native separator internally.
- **Scheduling**: Kazkade controls its own thread pool with pinned worker threads and a deterministic work-stealing deque. OS scheduler differences do not affect correctness.

## Benchmark Consistency

Running the same query on the same hardware across three operating systems produces identical results:

| Metric | Windows 11 | macOS 14 (x64) | Linux (Ubuntu 24.04) |
|---|---|---|---|
| Sum 10^9 floats | 340 ms | 338 ms | 339 ms |
| Filter throughput | 3.22 GB/s | 3.24 GB/s | 3.21 GB/s |
| Group-by 10^8 rows | 1.12 s | 1.10 s | 1.11 s |
| Cold start | 4 ms | 5 ms | 3 ms |
| Binary size | 4.7 MB | 4.9 MB | 4.3 MB |

## Development Reality

Developers on macOS can build columns, run queries, and verify signatures — then deploy the same column file and the same query to a Windows production server or a Linux CI runner. The column format is platform-independent. The `.aioss` ledger verifies identically everywhere. The CLI accepts the same arguments.

No transpilation. No containerization. No "works on my machine." Just native performance, everywhere.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*