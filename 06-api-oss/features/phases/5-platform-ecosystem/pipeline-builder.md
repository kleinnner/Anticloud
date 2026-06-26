---
title: "Pipeline Builder"
sidebar_position: 99
description: "A visual pipeline builder for constructing data processing pipelines from composable steps:"
tags: [features]
---

# Pipeline Builder

## What It Does
A visual pipeline builder for constructing data processing pipelines from composable steps:
Ingest, Transform, Analyze, and Export. Pipelines are saved as DAG structures in the
knowledge graph (graph nodes with edges defining step order and data flow) and executed by
the API-OSS engine. No coding required — steps are configured via property inspectors and
connected via drag-and-drop. Supports fan-in/fan-out topologies and parallel execution.

## How It Works
The Pipeline Builder frontend `PipelineBuilderView` (using Canvas API or React Flow) is
served on the HTTP UI at port 8081. The step palette provides four categories: Ingest
(connectors, file import, web scraping), Transform (filter, map, aggregate, join, Rhai
script), Analyze (model inference via Qwen2.5-VL, graph query, statistical analysis,
anomaly detection), and Export (graph write, file export, bridge send, webhook POST). Each
step type is implemented as a Rust trait object (files `ingest.rs`, `transform.rs`,
`analyze.rs`, `export.rs` under the pipeline module in `ai-oss-gateway/src/`). The pipeline
DAG is validated for cycles before execution using topological sort — cycles are rejected
with a clear error. Steps support multiple inputs and outputs (fan-in/fan-out), enabling
complex DAG topologies. When executed, the pipeline engine in `pipeline.rs` creates a tokio
task for each step, connected by tokio channels. Each step receives data from upstream
channels, processes it, and sends results to downstream channels. Independent branches of
the DAG execute concurrently for parallel performance. Error handling: if a step fails, the
pipeline can stop (default), skip the failed records, or retry with configurable count and
backoff. Progress is streamed via WebSocket (`pipeline_progress` messages showing step
status, throughput, and ETA). Pipelines are saved as graph meta-nodes (label `Pipeline`)
containing the DAG structure as JSON properties with versioning and rollback support.
Pipelines integrate with the Workflow Builder — pipelines can be embedded as steps in larger
workflows with human-in-the-loop approval. Steps are extensible via WASM plugins. The
pipeline engine supports configurable concurrency: up to 16 parallel branches with a message
queue depth of 1,000 records per inter-step channel and automatic backpressure when
downstream processing lags behind upstream ingestion.

The pipeline execution engine in `pipeline.rs` uses a tokio-based actor model. When a
pipeline run is triggered, the engine deserializes the DAG from the graph meta-node
properties, performs topological sort via Kahn's algorithm to validate acyclic structure
and compute execution order with parallel branches, and then spawns one tokio task per step.
Step dependencies are modeled as `tokio::sync::mpsc` channels — each step's output channel
has a buffer size equal to the downstream step's `batch_size` configuration (default 100
records). Tokio tasks for independent branches execute concurrently on the tokio thread
pool (default 4–8 worker threads), enabling parallel data processing across fan-out
topologies. Error handling is implemented as a `RetryPolicy` enum with variants `Stop`,
`Skip`, and `Retry { max_attempts: u32, backoff_ms: u64 }` — the engine wraps each step
execution in a `tokio::time::timeout` set to the step's `timeout_seconds` configuration
(default 300). Progress is reported back to the client through dedicated
`pipeline_progress` WS messages sent via a `tokio::sync::watch` channel shared between the
engine and the WebSocket handler, allowing the frontend to display real-time per-step
status, row counts, and estimated completion times without polling.

## How to Operate
1. Start gateway: `api-oss start`. Open Pipeline Builder at `http://localhost:8081/pipelines`.
2. Drag steps from palette to canvas: Ingest (select source), Transform (configure logic),
   Analyze (select model/query), Export (choose output target).
3. Connect steps by dragging between output and input ports — DAG validated automatically.
4. Configure each step in the property inspector — set parameters and select connectors.
5. Click "Validate" — backend checks for cycles and missing required parameters.
6. Click "Run" — pipeline executes with real-time progress per step.
7. View results: Export-to-graph steps show results in Graph view. File downloads provided.
8. Save: click "Save" — stored as graph node, appears in pipeline list.
9. Schedule: use `pipeline_save` with schedule parameter or UI Schedule tab.
10. Delete: `pipeline_delete` WS message or right-click > Delete in UI.
11. Embed in workflow: in Workflow Builder, add "Run Pipeline" step, select the pipeline.
12. Monitor: Prometheus on port 9000 — `pipeline_runs_total`, `pipeline_run_duration_ms`,
    `pipeline_steps_completed_total`, `pipeline_errors_total` with `source` and `step` labels.
13. Export pipeline results: `api-oss graph query --type PipelineResult` after execution.
14. For CLI-driven pipeline management: `api-oss pipeline run --id <pipeline-id>` triggers
    execution from the command line with optional `--params` overrides as JSON.

## The Moat
- Competitors require coding for pipeline construction (Airflow, Prefect) or limit topology
  to simple sequential steps without fan-in/fan-out.
- Pipelines stored as graph nodes in the knowledge graph — metadata-rich management,
  versioning, and ledger audit for every execution.
- Fan-in/fan-out DAGs with parallel execution rival code-based orchestration tools but in
  a visual, no-code interface.
- Steps extensible via WASM plugins — any custom step type without core engine changes.

## Why Choose API-OSS
A data analyst with no programming experience builds a complex ETL pipeline ingesting from
SQL, transforming with Rhai, analyzing with Qwen2.5-VL, and exporting to the graph — no
code. A defense analyst builds intelligence pipelines fully offline. An enterprise replaces
Airflow DAGs with visual pipelines integrated with the AI graph.

## Competitive Comparison
- **Palantir**: Foundry pipeline builder but cloud-dependent and proprietary.
- **OpenAI**: No pipeline builder, no batch processing.
- **Apache Airflow**: Code-first DAGs (Python), no visual builder.
- **Prefect**: Code-first with some UI, requires Cloud or server.
- **Nvidia**: No pipeline builder for AI decision platforms.

## Cost-Benefit Analysis
Airflow infrastructure: $100–$500/month cloud VMs. Prefect Cloud: $20/user/month.
API-OSS Pipeline Builder: $0. Replacing Airflow saves $1,200–$6,000/yr infrastructure and
$50k–$100k/yr in engineer time. Visual pipeline creation takes hours versus days writing
Airflow DAGs — saving $2k–$5k per pipeline. No-code makes pipeline development accessible
to analysts, not just engineers.

Using cloud AI pipelines: OpenAI batch API at $0.075/M input tokens for GPT-4o — a
pipeline processing 500k records/month with 1k tokens each would cost $37,500/month.
API-OSS pipeline inference uses the local Qwen2-VL-2B-Instruct-Q4_K_M.gguf model at zero
per-record cost. Palantir AIP's pipeline builder requires Foundry license ($500k+/year)
plus dedicated compute and operations staff. AWS Step Functions cost $0.025 per 1k state
transitions — a pipeline with 10 steps running 10k times/month costs $2.50/month plus Lambda
execution costs ($0.20 per million invocations), but this does not include AI inference or
graph storage. API-OSS combines pipeline orchestration, AI inference, graph storage, and
export in one system — replacing 3–4 separate tools (Airflow + model hosting + database +
notification) and their associated integration engineering costs ($50k–$150k/year).

## Applications
- **Consumer**: Automate personal data processing — daily email summaries, RSS feeds.
- **Government / Defense**: Repeatable intelligence analysis pipelines, fully offline.
- **Enterprise**: ETL pipelines, compliance checks, automated reporting, replacing Airflow.

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
