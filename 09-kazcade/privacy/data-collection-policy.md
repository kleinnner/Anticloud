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

# Data Collection Policy

## Exactly What Kazkade Collects (Nothing by Default)

Kazkade is designed with a **zero-data-by-default** policy. The software collects absolutely no telemetry, usage statistics, or personal information unless you explicitly opt in. This is not a privacy mode — this is the default behavior.

> "Privacy is not a configuration option. It is the architectural default." — Kazkade Privacy Philosophy

---

## Data Collection Overview

| Data Type | Collected by Default | Requires Explicit Action |
|-----------|---------------------|-------------------------|
| Usage statistics | ✗ No | `--share-statistics` flag |
| Crash reports | ✗ No | `--share-crash-report` flag |
| Benchmark results | ✗ No | `--publish` flag |
| Error logs | ✗ Local only | Manual upload |
| Performance metrics | ✗ Local only | Dashboard displays locally |
| Personal information | ✗ No data stored | Not applicable |
| IP addresses | ✗ Not logged | Network requests require flag |
| Hardware identifiers | ✗ Not collected | `--include-hardware-id` |
| Software versions | ✗ Local version only | Sent with `--share-*` flags |
| Feature usage | ✗ Not tracked | Never tracked |

---

## What Happens at First Launch

```bash
$ kazkade

Kazkade v0.1.0
Starting in offline mode...

Data Collection: DISABLED (default)
  - No telemetry
  - No usage statistics
  - No crash reports
  - No network connections
  - All processing is local

To enable data sharing, see:
  kazkade config set data.sharing=true
  kazkade config set data.share_benchmarks=true

Privacy Report: kazkade self-test --privacy
```

---

## Explicit Data Sharing Flags

### Benchmark Publishing

```bash
# No data shared by default
$ kazkade bench --gemm
Results displayed locally only.

# Explicit opt-in to share
$ kazkade bench --gemm --share-results

You are about to share benchmark results.
This includes:
  - CPU model and microarchitecture
  - SIMD features detected
  - Memory configuration and speed
  - OS and kernel version
  - Rust toolchain version
  - Benchmark results (GFLOPS, latency, throughput)

No personal information is shared.
No IP address is logged (anonymized via Tor).
No file contents or data are shared.

Share? [y/N]: y

Results shared. Publication ID: bench-20260619-001
View at: https://benchmarks.kazkade.dev/public/bench-20260619-001
```

### Crash Reporting

```bash
# Default: crash dump saved locally
$ kazkade bench --gemm
Kazkade encountered a fatal error.
Crash dump saved to: ./crash-dumps/crash-20260619-120000.dmp

To share this crash report with developers:
  kazkade self-test --share-crash ./crash-dumps/crash-20260619-120000.dmp

This will upload:
  - Stack trace (no user data)
  - CPU and memory state at crash
  - Software version
  - Operating system information

No personal data is included. Crash dump is encrypted before transmission.
```

---

## Telemetry and Network Connections

### No Telemetry Flag

```bash
# Verify no outbound connections
$ kazkade self-test --privacy --connections

Privacy Connection Test:
  Checking for outbound connections...

  DNS lookups: 0 (no external DNS queries)
  HTTP requests: 0 (no HTTP connections)
  HTTPS requests: 0 (no HTTPS connections)
  Other connections: 0

  Result: PASS - No outbound connections detected
```

### Network Activity Monitoring

Kazkade provides tools to monitor its own network activity:

```bash
# Monitor network activity in real-time
$ kazkade inspect --network

Network Activity Monitor (real-time):
┌────────────────┬──────────┬──────────────┬──────────┐
│ Time           │ Protocol │ Destination   │ Size     │
├────────────────┼──────────┼──────────────┼──────────┤
│ (no activity)  │ —        │ —            │ —        │
└────────────────┴──────────┴──────────────┴──────────┘

Total connections: 0
Total data sent: 0 bytes
Total data received: 0 bytes
All network activity is disabled by default.
```

---

## Explicit Consent Required

Every data-sharing operation requires explicit consent:

```bash
# Opt-in is granular and per-operation
$ kazkade config set data.share_benchmarks=true
WARNING: You are enabling benchmark result sharing.
This will share CPU info, performance metrics, and software versions.
This is OPT-IN and can be revoked at any time.
Enable? [y/N]: y

# Revoke consent
$ kazkade config set data.share_benchmarks=false
Benchmark sharing disabled.
Any previously shared data can be deleted:
$ kazkade data --delete-shared --publication-id bench-20260619-001
```

---

## Data Shared When Opted In

When you explicitly opt in, the following data is collected:

### Benchmark Sharing Data

```json
{
  "publication_id": "bench-20260619-001",
  "timestamp": "2026-06-19T12:00:00Z",
  "kazkade_version": "0.1.0",
  "hardware": {
    "cpu": "AMD Ryzen 9 7950X",
    "cores": 16,
    "simd_features": ["avx512f", "avx512vnni", "avx2", "sse4.2"],
    "memory_gb": 64,
    "cache": {
      "l1d": "32 KB x 16",
      "l2": "1 MB x 16",
      "l3": "64 MB"
    }
  },
  "software": {
    "os": "Ubuntu 24.04 LTS",
    "kernel": "6.8.0-generic",
    "rustc": "nightly-2026-06-01"
  },
  "benchmarks": [
    {
      "name": "gemm_f32_1024",
      "gflops": 142.6,
      "latency_us": 12.4,
      "simd_path": "avx512"
    }
  ]
}
```

### What Is NOT Shared

- No file contents
- No database contents
- No query results
- No user data
- No IP addresses (anonymized)
- No location data
- No personal identifiers
- No account information

---

## The `--dry-run` Flag

Before any data sharing, you can preview what would be sent:

```bash
$ kazkade bench --gemm --share-results --dry-run

DRY RUN: No data will be sent.
Here is what WOULD be shared:

{
  "hardware": {
    "cpu": "AMD Ryzen 9 7950X",
    "simd_features": ["avx512f", "avx2"]
  },
  "benchmarks": [
    {
      "name": "gemm_f32_1024",
      "gflops": 142.6
    }
  ]
}

To actually share, run without --dry-run.
```

---

## Data Retention and Deletion

### Retention Policy

| Data Type | Retention | Deletion Method |
|-----------|-----------|----------------|
| Local crash dumps | 30 days (auto-deleted) | `kazkade data clean` |
| Local logs | 7 days (auto-rotated) | `kazkade data clean` |
| Shared benchmarks | Until revoked | `kazkade data --delete-shared` |
| Crash reports | 90 days | `kazkade data --delete-shared` |

### User-Controlled Deletion

```bash
# List all shared data
$ kazkade data --list-shared

Shared Data:
┌──────────────────────┬──────────┬──────────┬──────────┐
│ Publication ID       │ Type     │ Date     │ Status   │
├──────────────────────┼──────────┼──────────┼──────────┤
│ bench-20260619-001   │ Benchmark│ 2026-06-19│ Active  │
│ crash-20260618-001   │ Crash rpt│ 2026-06-18│ Active  │
└──────────────────────┴──────────┴──────────┴──────────┘

# Delete shared data
$ kazkade data --delete-shared --publication-id bench-20260619-001
Requesting deletion from Kazkade servers...
Deletion confirmed. Publication ID bench-20260619-001 removed.
```

---

## Compliance Verification

```bash
$ kazkade self-test --privacy --data-collection

Data Collection Policy Verification:
  Default telemetry:        DISABLED ✓
  Default crash reporting:  DISABLED ✓
  Default benchmark share:  DISABLED ✓
  Default usage tracking:   DISABLED ✓
  Opt-in required:          ENFORCED ✓
  DRY-RUN available:        YES ✓
  Data deletion:            SUPPORTED ✓
  Network monitoring:       AVAILABLE ✓

Result: PASS - Kazkade complies with zero-data-by-default policy
```

---

## Comparison with Other Software

| Software | Default Telemetry | Opt-Out Available | Data Deletion |
|----------|------------------|-------------------|---------------|
| Kazkade | None | N/A (opt-in only) | Full |
| VS Code | Crash + usage | Yes (requires config) | Limited |
| Docker Desktop | Usage | Yes | Limited |
| Unity Editor | Extensive | Yes (requires registry) | Limited |
| Windows 11 | Extensive | Limited | Partial |
| Ubuntu | None (opt-in) | N/A (opt-in only) | Full |

---

## The Commitment

Kazkade commits to:

1. **Zero data collection by default** — No telemetry, no usage stats, no crash reports
2. **Explicit opt-in only** — Every data sharing requires user action
3. **Granular consent** — Each data type has its own opt-in
4. **Dry-run preview** — See what will be shared before sharing
5. **Full deletion** — All shared data can be deleted on request
6. **Network transparency** — Monitor all network activity
7. **No third-party sharing** — Shared data never sold or shared with third parties
8. **Open source verification** — The entire data collection code is visible

---

## Related Documentation

- [Privacy by Design](./privacy-by-design.md) — Architecture principles
- [No Telemetry Mode](./no-telemetry-mode.md) — Air-gapped operation
- [Data Minimization](./data-minimization.md) — Collect-only-what's-needed
- [Consent Management](./consent-management.md) — User consent flows

---

## Quick Reference

```bash
# Check data collection status
kazkade self-test --privacy --data-collection

# View what data would be shared
kazkade bench --gemm --share-results --dry-run

# Enable benchmark sharing
kazkade config set data.share_benchmarks=true

# List and delete shared data
kazkade data --list-shared
kazkade data --delete-shared --publication-id bench-20260619-001

# Monitor network activity
kazkade inspect --network

# Clean local data
kazkade data clean
```

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
