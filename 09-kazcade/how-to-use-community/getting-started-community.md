<!--
  __   ___                      __                        __                     
  ¦¦  ¦¦¯                       ¦¦                        ¦¦                     
  ___¦  ¦¦_¦¦      _¦¦¦¦¦_  ¦¦¦¦¦¦¦¦  ¦¦ _¦¦¯    _¦¦¦¦¦_   _¦¦¦_¦¦   _¦¦¦¦_   ¦___     
  __¦¯¯¯    ¦¦¦¦¦      ¯ ___¦¦      _¦¯   ¦¦_¦¦      ¯ ___¦¦  ¦¦¯  ¯¦¦  ¦¦____¦¦    ¯¯¯¦__ 
  ¯¯¦___    ¦¦  ¦¦_   _¦¦¯¯¯¦¦    _¦¯     ¦¦¯¦¦_    _¦¦¯¯¯¦¦  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯    ___¦¯¯ 
      ¯¯¯¦  ¦¦   ¦¦_  ¦¦___¦¦¦  _¦¦_____  ¦¦  ¯¦_   ¦¦___¦¦¦  ¯¦¦__¦¦¦  ¯¦¦____¦  ¦¯¯¯     
           ¯¯    ¯¯   ¯¯¯¯ ¯¯  ¯¯¯¯¯¯¯¯  ¯¯   ¯¯¯   ¯¯¯¯ ¯¯    ¯¯¯ ¯¯    ¯¯¯¯¯
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Getting Started — Community Edition

Kazkade is a zero-copy compute runtime built in Rust. This guide gets you up and running in under five minutes.

## Prerequisites

- **OS**: Windows x64, Linux x86_64/arm64, macOS arm64
- **CPU**: SSE4.2 minimum; AVX2, AVX-512, NEON, or SVE recommended
- **RAM**: 512 MB minimum, 4 GB recommended
- **Disk**: 50 MB for the binary, variable for `.acol` stores

## Download

Download the latest single-binary release for your platform:

```bash
# Linux x86_64
curl -LO https://releases.kazcade.io/v0.6.0/kazcade-linux-x86_64.tar.gz
tar xzf kazcade-linux-x86_64.tar.gz

# macOS arm64
curl -LO https://releases.kazcade.io/v0.6.0/kazcade-darwin-arm64.tar.gz
tar xzf kazcade-darwin-arm64.tar.gz

# Windows x64 (PowerShell)
Invoke-WebRequest -Uri "https://releases.kazcade.io/v0.6.0/kazcade-windows-x64.zip" -OutFile "kazcade.zip"
Expand-Archive -Path "kazcade.zip" -DestinationPath "."
```

No installer required—just a single static binary.

## Verify the Binary

```bash
./kazkade self-test
```

This runs a built-in integrity check. You should see:

```
? Binary integrity: PASS
? CPU features: AVX2
? Memory map: OK
? Self-test: All 47 checks passed
```

## First Run — `kazkade info`

```bash
./kazkade info
```

Sample output:

```
Kazkade v0.6.0
  Runtime:   zero-copy (mmap)
  Storage:   .acol / .aioss
  CPU:       AMD Ryzen 9 7950X (AVX512)
  Memory:    64 GB
  SIMD:      AVX512-F, AVX512-VL, AVX512-BW, AVX512-DQ
  Codecs:    rle, delta, bitpack, dict, i4, i8
  Plugins:   0 loaded
  Uptime:    0s
  Version:   0.6.0 (release)
  Build:     2026-06-18T12:00:00Z
```

No signup, no telemetry, no account required.

## Your First Benchmark

Run the built-in benchmarking suite:

```bash
./kazkade bench
```

This runs a standard set of analytics benchmarks:

```
Benchmark suite: standard
  scan_i64       1.2 GB/s    (128M rows)
  filter_eq      890 MB/s    (64M rows)
  aggregation    1.1 GB/s    (32M groups)
  join_hash      720 MB/s    (16M x 16M)
  sort          650 MB/s    (32M rows)
  rasterize     340 MB/s    (1920x1080)
  mlp_infer     1.8 GB/s    (batch=4096)
```

Each result is measured in zero-copy mode—no data is copied between kernel and userspace.

## Explore an `.acol` File

```bash
# Inspect column metadata
./kazkade inspect examples/sample.acol

# Output:
# File:      examples/sample.acol
# Columns:   12
# Rows:      1,048,576
# Size:      42.3 MB (mmap: 42.3 MB)
# Codecs:    Delta(ts), RLE(status), Bitpack(flags), Dict(category)
# Checksum:  SHA3-256: a1b2c3d4...
```

## Launch the Dashboard

```bash
./kazkade dashboard
```

Opens the local web dashboard at `http://127.0.0.1:8742`. From here you can:

- Browse `.acol` files in the local directory
- Run SQL queries interactively
- Visualize columnar data
- View benchmark results
- Inspect ledger state

The dashboard is fully local—zero network traffic leaves your machine.

## Next Steps

| Guide | Description |
|-------|-------------|
| `contributing-benchmarks.md` | Record and share benchmarks |
| `sharing-results.md` | Export to CSV/JSON and share |
| `community-dashboard.md` | Dashboard community features |
| `collaborative-analysis.md` | Multi-user `.acol` workflows |
| `contributing-guide.md` | How to contribute code/docs |
| `feature-requests.md` | Request new features |

## CLI Reference Quickstart

```
kazkade info          System information
kazkade bench         Run benchmarks
kazkade bench --record  Record benchmark results
kazkade query "SELECT * FROM data"  SQL query
kazkade inspect <file>  Inspect .acol file
kazkade dashboard    Launch web dashboard
kazkade self-test    Run integrity checks
kazkade ledger       Show ledger status
```

## Troubleshooting

**"Binary not found"**: Ensure `./kazkade` is executable (`chmod +x kazkade` on Linux/macOS).

**"mmap failed"**: Kazkade needs large mmap limits. On Linux: `sudo sysctl -w vm.max_map_count=6553000`.

**"AVX2 not found"**: Kazkade falls back to SSE4.2 gracefully, but AVX2 is strongly recommended for columnar workloads.

**"Port 8742 in use"**: Use `--port` to change: `kazkade dashboard --port 8743`.

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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
