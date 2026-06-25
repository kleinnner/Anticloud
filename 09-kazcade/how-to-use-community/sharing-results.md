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

# Sharing Results

This guide covers exporting, sharing, and verifying benchmark and query results from Kazkade. All shared data can be cryptographically verified via `.aioss` ledger signatures.

## Export Formats

Kazkade supports multiple export formats for interoperability:

```bash
# Export benchmark results
kazkade bench export --format csv   --output bench.csv
kazkade bench export --format json  --output bench.json
kazkade bench export --format parquet --output bench.parquet
kazkade bench export --format acol  --output bench.acol

# Export query results
kazkade query "SELECT * FROM data WHERE value > 100" \
  --format csv --output results.csv
```

### CSV Export

```csv
timestamp,bench_name,throughput,rows,simd_level,codec
2026-06-19T12:00:00Z,scan_i64,1250000000,128000000,AVX512,rle
2026-06-19T12:00:01Z,filter_eq,890000000,64000000,AVX512,delta
2026-06-19T12:00:02Z,aggregation,1100000000,32000000,AVX512,bitpack
```

### JSON Export

```json
{
  "benchmarks": [
    {
      "timestamp": "2026-06-19T12:00:00Z",
      "bench_name": "scan_i64",
      "throughput": 1250000000.0,
      "rows": 128000000,
      "simd_level": "AVX512",
      "codec": "rle",
      "metadata": {
        "cpu": "AMD Ryzen 9 7950X",
        "os": "Linux 6.8",
        "kazcade_version": "0.6.0"
      }
    }
  ],
  "ledger_hash": "sha3-256:a1b2c3d4...",
  "signature": "ed25519:deadbeef..."
}
```

## Community Leaderboard

Publish results to the community leaderboard:

```bash
kazkade bench publish --leaderboard
```

This uploads your signed `.aioss`-wrapped results to the central leaderboard at `https://leaderboard.kazcade.io`.

### Browsing the Leaderboard

```bash
kazkade bench leaderboard --top 10
```

```
Rank  User          Throughput   Bench          CPU               Signed
1     @vectorix     3.2 GB/s    scan_i64       Ryzen 9 9950X     ✓
2     @rustacean    2.8 GB/s    scan_i64       Threadripper 7980X ✓
3     @dataguru     2.4 GB/s    scan_i64       EPYC 9654         ✓
4     @zerocopydev  2.1 GB/s    scan_i64       M3 Ultra          ✓
5     @simdfan      1.9 GB/s    scan_i64       Xeon 6980P        ✓
```

### Leaderboard Categories

| Category | Description |
|----------|-------------|
| scan | Pure sequential scan throughput |
| filter | Column predicate evaluation |
| aggregation | GROUP BY performance |
| join | Hash/merge join throughput |
| sort | Full dataset sort |
| rasterize | Software rasterizer speed |
| mlp_infer | MLP inference throughput |

## `.aioss` Verification for Trust

Every shared result includes a `.aioss` ledger entry for verification:

### Verify a Shared Result

```bash
# Download a result
curl -LO https://leaderboard.kazcade.io/results/abc123.aioss

# Verify its integrity
kazkade ledger verify abc123.aioss
```

Output:

```
Entry: BenchmarkResult
  Timestamp:    2026-06-19T12:00:00Z
  Author:       ed25519:abcd1234...
  Hash:         sha3-256:a1b2c3d4...
  Signature:    ✓ VALID
  Chain:        #42 (verified to genesis)
  Tamper:       NONE DETECTED
```

### Trust Model

```
┌──────────┐     ┌───────────────┐     ┌──────────────┐
│ Author   │────>│ SHA3-256 hash │────>│ Ed25519 sign │
│ (results)│     │ (content)     │     │ (private key)│
└──────────┘     └───────────────┘     └──────┬───────┘
                                               │
                                               ▼
                                        ┌──────────────┐
                                        │ .aioss ledger │
                                        │ (immutable)   │
                                        └──────────────┘
                                               │
                                  ┌────────────┴────────────┐
                                  ▼                         ▼
                           ┌──────────┐             ┌──────────┐
                           │ Verifier │             │ Verifier │
                           │ (public) │             │ (public) │
                           └──────────┘             └──────────┘
```

## Sharing via URL

Generate a self-contained share URL:

```bash
kazkade bench share --url https://leaderboard.kazcade.io
```

This creates a short URL like `https://leaderboard.kazcade.io/s/abc123` that includes:

- Full benchmark metadata
- Interactive charts
- `.aioss` verification badge
- System information (CPU, RAM, OS, SIMD level)

## Embedding Results

### Markdown Badge

```markdown
[![Benchmark: 3.2 GB/s](https://leaderboard.kazcade.io/badge/abc123.svg)](https://leaderboard.kazcade.io/s/abc123)
```

### HTML Embed

```html
<iframe src="https://leaderboard.kazcade.io/embed/abc123"
        width="800" height="600"
        frameborder="0"
        title="Kazkade Benchmark Result"></iframe>
```

## Exporting to External Tools

### Pandas (Python)

```python
import pandas as pd
df = pd.read_csv("bench_results.csv")
df.groupby("bench_name")["throughput"].agg(["mean", "max", "std"])
```

### Jupyter Notebook

```bash
kazkade query "SELECT * FROM bench_results" --format json | python -c "
import sys, json, pandas as pd
data = json.load(sys.stdin)
df = pd.DataFrame(data['benchmarks'])
print(df.describe())
"
```

### Grafana

```bash
kazkade bench export --format json | python scripts/grafana_push.py
```

## Community Verification Protocol

1. **Author** runs benchmark with `--record --sign key.json`
2. **Author** publishes via `--leaderboard` or file upload
3. **Anyone** downloads `.aioss` file
4. **Anyone** runs `kazkade ledger verify`
5. **Trust** is established via the Ed25519 key's reputation

### Key Management

```bash
# Generate a new identity
kazkade ledger keygen --output identity.json

# Show public key
kazkade ledger keyinfo identity.json

# Link identity to GitHub (optional)
kazkade ledger link-github --key identity.json
```

## Result Annotations

Add context to your shared results:

```bash
kazkade bench annotate \
  --result abc123 \
  --label "AVX512 vs AVX2 comparison" \
  --notes "Enables AVX512-F and AVX512-VL. Turbo disabled for consistency."
```

## Batch Operations

```bash
# Export all recorded benchmarks
kazkade bench export --all --format csv --output all-benchmarks.csv

# Verify all results in a directory
kazkade ledger verify --batch results/*.aioss

# Publish multiple results
kazkade bench publish --file results/*.acol
```

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
