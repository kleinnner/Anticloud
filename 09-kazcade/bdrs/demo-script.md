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

# Demo Script — Kazkade Sales Demo

## Setup

**Prerequisites:** Any x86-64 or ARM64 machine with Windows, Linux, or macOS. No sudo/root required.

**Total demo time:** ~15 minutes.

**BDR preparation:**
- Download the Kazkade binary ahead of time: `curl -O https://kazcade.io/dl/kazcade && chmod +x kazkade`
- Prepare a sample CSV file with 1M rows of time-series data (provided in `./demo/sample.csv`)
- Open a terminal with a clean prompt, pre-sized to 120×40 for readability

---

## Step 1: Intro — Download and Run Info (2 min)

**Goal:** Demonstrate that Kazkade is a single binary with zero dependencies.

**Commands:**

```bash
./kazkade --version
./kazkade info
```

**Talking points:**
- "This is the only file you need. There is no `apt install`, no `pip install`, no Docker pull."
- "The `info` command shows your CPU, SIMD capabilities, cache topology, and OS — all detected at runtime with zero configuration."
- "Note the SIMD level detected: [AVX-512 / AVX2 / NEON]. Kazkade selected the optimal path automatically."

**Expected output highlights:**
```
Kazkade v0.7.2
SIMD: AVX2 (detected)
OS: Linux 6.8 x86_64
Cache: L1 32K, L2 256K, L3 16MB
```

**Time:** 2 min

---

## Step 2: Run First Benchmark (3 min)

**Goal:** Show how easy it is to run a microbenchmark and get structured output.

**Command:**

```bash
./kazkade bench --gemm M=1024,N=1024,K=1024
```

**Talking points:**
- "One command runs GEMM at native SIMD speed, then outputs results in JSON, Markdown, or the `.aioss` ledger format."
- "This produces a real, measured number — not an estimated or synthetic score."
- "Kazkade runs warm-up iterations, detects outliers, and computes confidence intervals automatically."

**Expected output highlights:**
```
GEMM 1024x1024x1024
  Best:    2.34 ms  (2.10 TFLOPS)
  Median:  2.38 ms
  CI 95%: [2.32, 2.41]
  Samples: 100 (3 outliers removed)
```

**Time:** 3 min

---

## Step 3: Show Dashboard (2 min)

**Goal:** Visualize benchmark results.

**Command:**

```bash
./kazkade dashboard --open
```

**Talking points:**
- "Kazkade ships with a built-in web dashboard. No separate install, no Grafana, no Prometheus."
- "You can compare runs, filter by machine, export to PDF — all from the binary."
- "This runs entirely locally. No telemetry is sent externally unless you configure it."

**Expected behavior:** Browser opens to `http://localhost:8123` showing a plot of the benchmark result with machine metadata.

**Time:** 2 min

---

## Step 4: Create `.aioss` Ledger (3 min)

**Goal:** Demonstrate the tamper-proof ledger.

**Commands:**

```bash
# Run a benchmark and write to ledger
./kazkade bench --gemm M=512,N=512,K=512 --ledger ./demo.ledger.aioss

# Append a second run
./kazkade bench --gemm M=2048,N=2048,K=2048 --ledger ./demo.ledger.aioss

# View the ledger
./kazkade ledger show ./demo.ledger.aioss
```

**Talking points:**
- "Each benchmark is appended to the ledger. The ledger is a chain of SHA-256 hashes — each entry links back to the previous one."
- "The ledger also records the binary hash, CPU microcode version, and OS kernel. It's a complete computational provenance record."
- "You can't edit a ledger entry without breaking the hash chain. This is what makes it tamper-proof."

**Expected `ledger show` highlights:**
```
Entry 1: GEMM 512x512x512 | time=0.31ms | hash=ab12... | prev=0000 (genesis)
Entry 2: GEMM 2048x2048x2048 | time=9.87ms | hash=cd34... | prev=ab12...
Chain integrity: VALID
```

**Time:** 3 min

---

## Step 5: Verify Ledger Integrity (2 min)

**Goal:** Show the verification workflow.

**Commands:**

```bash
# Verify the ledger is intact
./kazkade ledger verify ./demo.ledger.aioss

# Simulate tampering (modify a byte)
# (BDR: manually edit one byte with a hex editor ahead of time, or show the command)
./kazkade ledger verify ./demo.ledger.tampered.aioss
```

**Talking points:**
- "Verification rehashes every entry and checks the chain. If anything changed — even one bit — the chain status flips to INVALID."
- "This is what compliance teams and auditors need: a single command that proves the computation hasn't been altered."
- "You can distribute ledgers publicly. Anyone with Kazkade can verify them."

**Expected output:**
```
Ledger: demo.ledger.aioss
Entries: 2
Chain: VALID
Last verified: 2026-06-18T14:30:00Z
```

**Time:** 2 min

---

## Step 6: Query Columnar Data with SQL (3 min)

**Goal:** Show the columnar analytics engine.

**Commands:**

```bash
# Run a SQL query against a CSV/Parquet file
./kazkade sql "SELECT region, AVG(revenue) FROM demo/sample.csv GROUP BY region ORDER BY AVG(revenue) DESC"
```

**Talking points:**
- "No database server. No schema definition. Kazkade memory-maps the file and runs vectorized SQL on it."
- "The query engine is SIMD-accelerated. It's faster than pandas for GROUP BY and FILTER on numeric columns."
- "Every query is also recorded in the ledger if you pass `--ledger` — so you can prove *what* you computed and *when*."

**Expected output:**
```
region          AVG(revenue)
NA              142,304.21
EMEA            98,712.45
APAC            76,891.33
LATAM           34,567.89
(4 rows, 0.043 sec)
```

**Time:** 3 min

---

## Full Demo Timeline

| Step | Activity | Time | Key Takeaway |
|------|----------|------|--------------|
| 1 | Download + Info | 2 min | Single binary, zero deps, auto-SIMD |
| 2 | First benchmark | 3 min | Real GEMM perf with statistical rigor |
| 3 | Dashboard | 2 min | Built-in visualization, no separate stack |
| 4 | `.aioss` ledger | 3 min | Tamper-proof cryptographic chain |
| 5 | Verify ledger integrity | 2 min | One command proves no tampering |
| 6 | SQL analytics | 3 min | Zero-copy columnar engine, no server |
| **Total** | | **15 min** | |

---

## Objection Handler for Demo

| During Step | If Prospect Says… | BDR Response |
|-------------|-------------------|--------------|
| 2 | "Our benchmarks are more complex" | "Kazkade supports custom kernels via `--kernel` — you can plug in your own GEMM or convolution. Let me show you." |
| 4 | "How does the ledger scale?" | "We've tested ledgers with 10,000+ entries. Verification takes < 100 ms. Each entry is ~200 bytes." |
| 6 | "Can it connect to Postgres?" | "Not directly. But you can export CSV or Parquet and query it. For live DB querying, use Kazkade on exports." |
| Any | "Can I see the source?" | "Absolutely — it's Apache 2.0 on GitHub at `github.com/kazcade/kazcade`. I'll send you the link." |

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ