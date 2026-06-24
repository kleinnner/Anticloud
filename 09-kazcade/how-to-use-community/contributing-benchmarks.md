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

# Contributing Benchmarks

This guide covers running, recording, and sharing benchmark results with the Kazkade community. All results are cryptographically signed via `.aioss` for tamper-proof verification.

## Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ kazkade     │────>│ .aioss       │────>│ Community       │
│ bench       │     │ signed        │     │ Leaderboard     │
│ --record    │     │ ledger        │     │ (shared)        │
└─────────────┘     └──────────────┘     └─────────────────┘
      zero-copy           SHA3-256+         web dashboard
      measurements        Ed25519            & CSV export
```

## Running a Benchmark

```bash
# Standard suite
kazkade bench

# Specific benchmark module
kazkade bench --filter scan
kazkade bench --filter join
kazkade bench --filter rasterize

# Custom workload parameters
kazkade bench --rows 100000000 --cols 16 --codec rle
```

## Recording Benchmarks

Use `--record` to persist results to a local `.acol` store:

```bash
kazkade bench --record
```

This creates:

```
~/.kazcade/benchmarks/
  ├── 2026-06-19T12-00-00.acol
  ├── 2026-06-19T12-00-00.aioss
  └── 2026-06-19T12-00-00.json
```

The `.acol` file stores columnar benchmark data:

| Column | Type | Description |
|--------|------|-------------|
| `timestamp` | i64 (ns) | When benchmark ran |
| `bench_name` | utf8 | Benchmark identifier |
| `throughput` | f64 | Bytes per second |
| `rows` | i64 | Row count processed |
| `cpu_model` | utf8 | CPU identifier |
| `simd_level` | utf8 | SIMD ISA used |
| `codec` | utf8 | Compression codec |
| `latency_p50` | f64 | Median latency |
| `latency_p99` | f64 | P99 latency |

## Tamper-Proof Signing

Each benchmark result is automatically signed with an Ed25519 keypair:

```bash
# Generate a signing key
kazkade ledger keygen --output my-keypair.json

# Record with signing
kazkade bench --record --sign my-keypair.json
```

The `.aioss` ledger entry contains:

```json
{
  "version": 1,
  "timestamp": "2026-06-19T12:00:00Z",
  "benchmark_hash": "sha3-256:a1b2...",
  "signature": "ed25519:deadbeef...",
  "public_key": "ed25519:abcd...",
  "previous_hash": "sha3-256:0000...",
  "entry_type": "BenchmarkResult"
}
```

## Publishing Benchmarks

### Option 1: Community Leaderboard (CLI)

```bash
kazkade bench publish --leaderboard
```

This submits your signed benchmark to the community leaderboard. The `.aioss` signature ensures no one can tamper with your results.

### Option 2: Manual Export

```bash
# Export to CSV
kazkade bench export --format csv --output results.csv

# Export to JSON
kazkade bench export --format json --output results.json
```

### Option 3: Share via URL

```bash
kazkade bench share --url https://leaderboard.kazcade.io
```

## Verifying Published Results

```bash
# Verify a result's integrity
kazkade ledger verify results.aioss

# Output:
# ✓ Signature: VALID (key: ed25519:abcd...)
# ✓ Hash match: SHA3-256 verified
# ✓ Chain: continuous from genesis
#   Entry: 2026-06-19T12:00:00Z — BenchmarkResult

# Batch verify multiple results
kazkade ledger verify --batch *.aioss
```

## Creating Custom Benchmark Suites

Define custom benchmarks in a YAML file:

```yaml
# custom-bench.yml
name: "analytics-suite"
rows: 50000000
columns:
  - name: "id"
    type: i64
  - name: "value"
    type: f64
  - name: "category"
    type: utf8
    cardinality: 100
  - name: "timestamp"
    type: i64
    min: 0
    max: 1700000000000000000

workloads:
  - name: "scan-heavy"
    type: scan
    repeats: 10
  - name: "filter-eq"
    type: filter
    predicate: "category == 'A'"
    repeats: 10
```

Run:

```bash
kazkade bench --suite custom-bench.yml
```

## Benchmarking Best Practices

1. **Close other apps** during benchmarking for consistent results
2. **Run 3+ iterations** — Kazkade reports min/mean/max automatically
3. **Note CPU frequency scaling** — if using a laptop, plug in and set high-performance mode
4. **Use `--record`** for reproducibility
5. **Pin CPU frequency** if possible:

```bash
# Linux
sudo cpupower frequency-set --governor performance

# Windows (PowerShell Admin)
powercfg -setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c
```

## Interpreting Results

| Metric | Good | Great | Exceptional |
|--------|------|-------|-------------|
| Scan throughput | >500 MB/s | >1 GB/s | >3 GB/s |
| Filter throughput | >300 MB/s | >700 MB/s | >2 GB/s |
| Aggregation | >200 MB/s | >500 MB/s | >1.5 GB/s |
| Join throughput | >150 MB/s | >400 MB/s | >1 GB/s |
| Sort throughput | >100 MB/s | >300 MB/s | >800 MB/s |
| MLP inference | >100 M/s | >500 M/s | >1 B/s |

## Sharing Results with the Community

```bash
# Generate a shareable report
kazkade bench report --format html --output benchmark-report.html

# Or markdown
kazkade bench report --format md --output BENCHMARKS.md
```

The HTML report includes interactive charts, system information, and a verification badge showing the `.aioss` signature.

## CI Integration for Benchmarks

```yaml
# .github/workflows/bench.yml
name: Benchmark
on: [push]
jobs:
  bench:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          ./kazkade bench --ci --record
          ./kazkade bench export --format json > bench-results.json
      - uses: actions/upload-artifact@v4
        with:
          name: benchmark-results
          path: bench-results.json
```

The `--ci` flag reduces warm-up iterations and produces machine-readable output.

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

