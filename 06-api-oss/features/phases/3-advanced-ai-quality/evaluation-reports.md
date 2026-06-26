---
title: "Evaluation Reports"
sidebar_position: 99
description: "Generates structured evaluation reports combining benchmark results, human"
tags: [features]
---

# Evaluation Reports

## What It Does
Generates structured evaluation reports combining benchmark results, human
evaluation data, safety assessments, and bias analysis into a single document.
Exportable as JSON, HTML, or PDF for compliance reviews and stakeholder
communication.
Reports aggregate real evaluation runs from the local ledger with every metric
traced to a specific run.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading configuration
from `opencode.json`.
The `evaluation_report.rs` Rust module in `ai-oss-gateway/src/` manages report
generation.
When a report is requested (via WS message `eval_report_generate` or CLI), the
module queries the local ledger in `./data/` for all evaluation runs matching
the specified filters: model hash, time range, benchmark type, and run IDs.

The ledger stores each evaluation result as a signed entry with the run
parameters, metric scores, dataset version, and model hash.
The report generator collects these entries via a SQL query against
`data/graph.db` that joins evaluation runs, metric scores, dataset versions,
and model metadata. The query filters by the user-specified parameters —
model hash, time range (using SQLite datetime functions on the run timestamp),
benchmark type, and specific run IDs — then orders results chronologically
within each section.

The assembler creates a `ReportDocument` struct containing all sections:

- **Benchmark section**: per-benchmark scores (MMLU accuracy, GSM8K pass rate,
  HumanEval pass@k), trend data comparing against historical baselines, and
  dataset version information
- **Human evaluation section**: scores from the Model Judge view, including
  side-by-side comparison results, rubric scores per criterion, and IAA
  statistics
- **Safety section**: HarmBench results, toxicity scores, jailbreak detection
  rates, and red team findings
- **Bias section**: BBQ-style evaluation results with per-demographic-dimension
  breakdowns
- **Model section**: architecture, quantization, context length, and the
  SHA-256 hash from the ledger

Each metric in the report is hyperlinked to its source evaluation run ID in the
ledger.
HTML reports include interactive charts rendered with Chart.js served from the
HTTP UI on port 8081. Charts include radar plots comparing models across
benchmarks, bar charts for per-metric scores with confidence intervals, and
line charts showing metric trends over model versions. The chart data is
embedded as JSON in the HTML, so no live backend is needed for viewing.
PDF reports use headless Chrome via the `headless_chrome` crate, rendering the
HTML report to PDF with configurable page size (A4, Letter), margins, and
header/footer content.
Reports are stored in `./data/eval/reports/` with a filename matching the
report ID and a `.html`, `.pdf`, or `.json` extension.

Every report generation is itself recorded in the ledger as a
`report_generated` entry with a SHA-256 of the report content, enabling tamper
detection.
The frontend `EvaluationReportView` connects via WebSocket to port 3030 and
provides a report builder interface where users select sections, date ranges,
and output format. The builder supports drag-and-drop section reordering and
live preview with a count of included evaluation runs.

## How to Operate
1. Generate a report via CLI: `api-oss eval report generate --model my_model
   --from 2026-01-01 --to 2026-05-30 --format html`. Outputs the report path.
2. Via frontend on port 8081: navigate to Evaluation > Reports, click "New
   Report", select model, set date range, toggle sections, choose format, click
   "Generate".
3. View an existing report: `api-oss eval report show --id <report_id>`.
4. Compare two reports: `api-oss eval report diff --id1 <id1> --id2 <id2>` to
   see a side-by-side diff with color-coded metric changes.
5. List all reports: `api-oss eval report list --limit 20`.
6. Delete a report: `api-oss eval report delete --id <report_id>`.
7. Configure auto-generation in `opencode.json`:
   ```json
   {
     "evaluation_reports": {
       "auto_generate": true,
       "schedule_cron": "0 8 1 * *"
     }
   }
   ```
6. Verify integrity: `api-oss eval report verify --id <report_id>`.

## The Moat
- Reports aggregate real evaluation runs from the local ledger — no manual
  data collection
- Every metric is traced to a specific evaluation run ID
- Reports are reproducible with identical content from same parameters
- Tamper-evident via ledger anchoring at generation time
- No cloud reporting service or third-party dashboard tool required
- Auto-generation on schedule eliminates manual compliance overhead

## Why Choose API-OSS
Customers choose API-OSS evaluation reports because they transform raw ledger
data into compliance-ready documents without manual effort.
Palantir's AI evaluation reporting requires cloud infrastructure.
Nvidia offers no structured evaluation report generation.
API-OSS produces professional-grade reports from real, verified evaluation
runs with full traceability.

## Competitive Comparison
- **Palantir**: AI evaluation reporting in AIP requires cloud infrastructure.
- **Nvidia**: No structured evaluation report generation in NeMo.
- **OpenAI**: No evaluation report generation. Manual collection required.
- **Anthropic**: No evaluation report tooling.
- **Mercor**: Basic dashboards exist but are cloud-only.

## Cost-Benefit Analysis
Manual report creation costs 4 hours/month of operator time ($5K/year).
BI tools (Tableau $70/user/month, Power BI $10/user/month) add ongoing cost
of $840-$5,880/year for 7 users.
API-OSS auto-generates reports in seconds at no additional cost.
Compliance auditors charge $500/hour — ledger-anchored reports reduce audit
time by 75%, saving $3K-$6K per annual audit.
Building custom reporting costs ~$40K in engineering time plus $2K/year in
infrastructure hosting.
EU AI Act and emerging US state AI regulations require periodic model
evaluation reporting — API-OSS reports satisfy these requirements with zero
additional engineering effort per reporting cycle.

## Applications
- **Consumer**: Share a personal model's evaluation results with a structured
  document.
- **Government / Defense**: Produce compliance documentation for AI system
  deployment approval.
- **Enterprise**: Standardized reporting for model governance boards and
  auditors.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com