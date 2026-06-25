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

# Debugging and Profiling

Kazkade uses `thiserror` for structured errors (`CoreError`, `CoreResult`), `log` for debug output, and provides a telemetry system for benchmarking. This guide covers common debugging and profiling workflows.

## Rust Debugging Basics

### Backtraces

Enable full backtraces for panic analysis:

```bash
# Full backtrace on panic
RUST_BACKTRACE=1 cargo run -- bench

# Full backtrace on all errors (including unwrap/expect)
RUST_BACKTRACE=full cargo run -- query test.acol "SELECT *"

# Library logging
RUST_LOG=debug cargo run -- bench
```

Since Kazkade uses `thiserror`, most errors are `CoreError` variants:

```rust
pub enum CoreError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Invalid argument: {0}")]
    InvalidArgument(String),
    #[error("Out of memory")]
    OutOfMemory,
}
```

### Debug Assertions

Modules use `assert_eq!` and `assert!` with descriptive messages:

```rust
assert_eq!(self.stride, 0, "Cannot cast strided chunk");
assert!(offset + length <= self.count, "Chunk slice out of bounds");
```

To disable expensive checks in release:

```bash
cargo build --release
# Debug assertions are off by default in release mode
```

## Profiling

### perf (Linux — x86_64)

```bash
# Build release with debug symbols
cargo build --release

# CPU profiling
perf stat -e cycles,instructions,cache-misses,branch-misses \
  ./target/release/kazkade bench --size 512

# Sampling profiler
perf record --call-graph dwarf ./target/release/kazkade bench --size 512
perf report

# Cache miss analysis
perf stat -e cache-references,cache-misses,LLC-load-misses \
  ./target/release/kazkade bench --size 512
```

### DTrace (macOS)

```bash
# CPU sampling (requires SIP-disabled or dtrace)
sudo dtrace -n 'profile-997 /execname == "kazkade"/ { @[ustack()] = count(); }' \
  -c "./target/release/kazkade bench --size 512"

# Quick instruments wrapper
cargo instruments -t "CPU Profiler" -- bench --size 512
cargo instruments -t "Allocations" -- bench --size 512
cargo instruments -t "System Trace" -- bench --size 512
```

### Windows

```bash
# Windows Performance Toolkit (requires WPT install)
cargo build --release
xperf -on latency -stackwalk profile
./target/release/kazkade bench --size 512
xperf -d trace.etl
# Open in WPA.exe
```

## Memory Profiling

### RAM Metrics via the Dashboard

The `sys_panel()` in the dashboard shows cross-platform RAM usage:

```rust
fn sys_memory_gb() -> (f64, f64) {
    // Linux: /proc/meminfo
    // Windows: GlobalMemoryStatusEx
    // macOS: sysctl hw.memsize + vm_stat
}
```

### Peak Memory

Use `heaptrack` (Linux) or `xperf` (Windows) for allocation traces:

```bash
# heaptrack (Linux)
heaptrack ./target/release/kazkade gen --rows 1000000
heaptrack --analyze heaptrack.kazkade.*.gz
```

## SIMD Verification with `test_*_random`

Each SIMD kernel should have a random comparison test. Run these to verify SIMD correctness:

```bash
# Run all SIMD tests
cargo test test_ -- --nocapture

# Run specific random tests
cargo test test_tanh_random
cargo test test_simd_equals_scalar
```

The pattern is always the same:

```rust
#[test]
fn test_kernel_random() {
    let x: Vec<f32> = random_vec(n);
    let mut expected = vec![0.0; n];
    let mut actual = vec![0.0; n];

    scalar_kernel(n, &x, &mut expected);
    kernel(n, &x, &mut actual); // goes through SIMD dispatch

    for i in 0..n {
        assert!((actual[i] - expected[i]).abs() < EPSILON,
            "Mismatch at {}: {} vs {}", i, actual[i], expected[i]);
    }
}
```

## Benchmark-Driven Development

Kazkade's `bench` CLI command runs a standard benchmark suite and produces both console output and an HTML telemetry report:

```bash
cargo run -- bench --size 512

# Example output:
# GEMM 512x512x512... 3.2 ms (84.2 GFLOPS)
# Vector 1M elements... add: 112.3 us (106.9 GB/s)
# Columnar 100K rows... filter: 15.2 us (6579.0 M/s)
# Rasterizer 800x600 100 frames... 167.1 ms (598 FPS)

# HTML report is saved to /tmp/Kazkade_telemetry.html
```

The `Telemetry` struct tracks every event with `std::time::Instant` precision:

```rust
let start = Instant::now();
kazkade::simd::matrix::matmul_f32(m, n, k, &a, &b, &mut c);
let elapsed = start.elapsed();
telem.record(Event::Matmul { m, n, k, elapsed });
```

To add a new benchmark, follow the pattern in `run_bench()`: record `Instant::now()` before and after, create an `Event`, and push to telemetry.

## Quick Reference

| Goal | Command |
|------|---------|
| Full backtrace | `RUST_BACKTRACE=1 cargo run` |
| Debug logging | `RUST_LOG=debug cargo run` |
| CPU profile (Linux) | `perf record --call-graph dwarf ./target/release/kazkade bench` |
| CPU profile (macOS) | `cargo instruments -t "CPU Profiler" -- bench` |
| Run random tests | `cargo test test_` |
| Quick benchmark | `cargo run --release -- bench --size 512` |
| Build with debug symbols | `cargo build --release` (already includes symbols) |
| Optimized build | `cargo build --release` (LTO, strip) |

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
