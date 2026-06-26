---
title: "Benchmark Suite"
sidebar_position: 99
description: "A comprehensive benchmark suite using Criterion.rs for performance regression detection"
tags: [features]
---

# Benchmark Suite

## What It Does
A comprehensive benchmark suite using Criterion.rs for performance regression detection
across all platform subsystems. Covers graph operations (insert, query, traversal at
10k/100k/1M node scales), connector throughput (rows/second for PostgreSQL, SQLite, MQTT,
Kafka sources), ledger verification (signatures/second, batch verification throughput), and
end-to-end model inference pipelines (Qwen2-VL-2B-Instruct-Q4_K_M.gguf with CUDA
backend). Produces HDR histograms for full latency distribution and exports Prometheus
metrics for production monitoring.

## How It Works
The benchmark suite lives in `benches/` with separate files: `graph_bench.rs`,
`connector_bench.rs`, `ledger_bench.rs`, and `pipeline_bench.rs`. Each group uses
Criterion.rs criterion groups and benchmark functions to measure throughput and latency.
Graph benchmarks populate a temporary graph.db with 10k/100k/1M nodes and measure insertion
throughput (nodes/sec), query latency (p50/p95/p99/p99.9), and traversal time for depth-5
subgraph extractions. Connector benchmarks simulate data sources and measure rows/second
ingested through the virtual connector abstraction. Ledger benchmarks measure signature
creation (ed25519 signatures/sec) and batch verification throughput. Pipeline benchmarks
execute standard ingest-transform-analyze-export pipelines end-to-end with the Qwen2.5-VL
model on CUDA, measuring total wall-clock time and per-step breakdown. All benchmarks
output HDR histogram files (`.hdr`) for offline analysis with histogram tools. The
Prometheus metrics endpoint at `/metrics` (port 9000) exposes histograms for graph query
latency, connector throughput, and inference latency — the same metrics used by the
Kubernetes HorizontalPodAutoscaler and CI/CD performance gates. The `.benchmarks/`
directory stores previous run results for regression comparison. CI integration runs a
subset of benchmarks on each commit with configurable failure thresholds (e.g., p99 latency
regression > 5% fails the pipeline). The CLI exposes `api-oss bench run`, `bench list`,
`bench compare`, and `bench report` commands for on-demand benchmarking. Benchmarks measure
connector throughput in rows/second (tested against PostgreSQL, SQLite, MQTT, Kafka sources),
ledger verification throughput in signatures/second for ed25519 batch verification, and
end-to-end pipeline latency for the Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA — all
with HDR histogram recording for p50, p95, p99, and p99.9 latency percentiles.

## How to Operate
1. Ensure the gateway is running: `api-oss start`. The benchmark suite connects to the
   running instance via WebSocket on port 3030.
2. Run the full benchmark suite: `api-oss bench run` — executes all benchmark groups and
   outputs results to stdout and `.benchmarks/`.
3. Run a specific benchmark group: `api-oss bench run --group graph` — options: graph,
   connector, ledger, pipeline.
4. List previous benchmark runs: `api-oss bench list` — shows timestamp, git commit, and
   summary statistics for each run.
5. Compare two runs: `api-oss bench compare --base <run-id> --target <run-id>` — outputs
   a table with deltas and flags regressions beyond threshold.
6. Generate a report: `api-oss bench report --format html` — produces an HTML report with
   HDR histograms, comparison tables, and trend charts.
7. In CI, add `api-oss bench run --ci --threshold 5` to the pipeline — exits non-zero if
   any metric regresses more than 5%.
8. Review Prometheus histograms at `http://localhost:9000/metrics` for production
    monitoring with the same measurements as CI benchmarking.
9. Configure benchmark parameters (dataset sizes, iterations, thresholds) in `opencode.json`
    under `benchmark` section at root or gateway level.
10. Run a specific workload size: `api-oss bench run --group graph --scale 1M` — benchmarks
    graph operations at 1M node scale. Options: `10k`, `100k`, `1M`.
11. Export benchmark results: `api-oss bench report --format html --output ./bench-report.html`
    — generates a standalone HTML report with interactive HDR histograms, regression tables,
    and trend charts suitable for sharing with stakeholders or attaching to CI artifacts.

## The Moat
- Nvidia publishes closed benchmarks optimized for their hardware that cannot be
  independently reproduced — API-OSS benchmarks are open, reproducible, and runnable on
  any hardware the operator chooses.
- HDR histogram tracking captures the full latency distribution including p99.9 and
  worst-case, not just averages — catching tail-latency regressions that average-based
  benchmarks miss entirely.
- Prometheus metrics export means production monitoring uses the same measurements as CI
  benchmarking — no gap between benchmark results and production behavior.
- Every benchmark is fully offline with no cloud dependency — run them in an air-gapped
  environment on classified hardware.

## Why Choose API-OSS
A defense agency evaluating API-OSS for a classified deployment can run the full benchmark
suite on their own hardware, in their own facility, and get verifiable performance numbers
for their specific workload — no NDA, no cloud dependency, no vendor-controlled benchmarks.
An enterprise can set up CI performance gates that prevent any commit from regressing p99
graph query latency by more than 5%. A consumer can verify that their $2,000 workstation
meets performance requirements before committing to a deployment. No competitor provides
this level of transparent, reproducible, production-connected benchmarking.

## Competitive Comparison
- **Nvidia**: Closed benchmarks optimized for their hardware — you cannot reproduce them.
  No CI integration, no Prometheus export, no HDR histograms.
- **Palantir**: No public benchmarks, no performance transparency. Customers must trust
  vendor claims without independent verification.
- **OpenAI/Anthropic**: Cloud APIs with no client-side benchmarking capability. Performance
  varies with cloud load and is not measurable or reproducible client-side.
- **Snowflake**: Performance benchmarks exist but are controlled by Snowflake, not
  independently reproducible on your own infrastructure.
- **Google**: Vertex AI benchmarks are cloud-only and not reproducible on local hardware.

## Cost-Benefit Analysis
Nvidia's closed benchmarks require purchasing their hardware ($30k+ for an A100) to
validate. API-OSS benchmarks run on any hardware — a $2,000 workstation with a consumer GPU
provides reproducible results. The CI integration eliminates performance regression
debugging time (days of engineer time per incident, ~$2k–$5k each). OpenAI API inference
costs $0.15/M tokens — running the pipeline benchmark suite against the API for 100
iterations would cost ~$150. API-OSS pipeline benchmarks cost $0 (local inference with the
free Qwen2.5-VL model). Snowflake query benchmarking requires an active warehouse
($2–$8/credit). Criterion.rs with HDR histograms replaces expensive third-party performance
testing tools ($500–$2,000/month for Latency Tools or similar). ngrok charges $20/month for
tunnels — benchmarking requires no external services, so the $20/month ngrok cost is
entirely eliminated. OpenAI charges $0.01/1K tokens for API inference; benchmarking the
pipeline against the API for 1M tokens of processing would cost $10 in API fees — API-OSS
benchmarks run the local model at zero inference cost.

## Applications
- **Consumer**: Verify performance on your hardware before committing to deployment. Ensure
  your laptop or home server meets requirements for your expected workload.
- **Government / Defense**: Validate performance on classified hardware in a secure facility
  before operational deployment. Independent verification of all performance claims.
- **Enterprise**: CI/CD performance gates prevent regressions from reaching production.
  Capacity planning uses real benchmarks from production-like hardware. Hardware comparison
  data for procurement decisions.

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
