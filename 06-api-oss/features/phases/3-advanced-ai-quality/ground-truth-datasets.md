---
title: "Ground Truth Datasets"
sidebar_position: 99
description: "Manages golden datasets of ground-truth-labeled items."
tags: [features]
---

# Ground Truth Datasets

## What It Does
Manages golden datasets of ground-truth-labeled items.
Automatically scores model predictions against ground truth to detect
regressions, compute accuracy, and validate performance over time.
Datasets are stored locally in the ledger with full version history.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading ground truth
configuration from `opencode.json`.
The annotation pipeline Rust module in `ai-oss-gateway/src/` manages ground
truth datasets.
The module uses an in-memory LRU cache (default 10,000 items) for frequently
accessed ground truth items, reducing SQLite reads during scoring pipelines.
Cache entries are invalidated when the dataset version changes.

Ground truth datasets are stored in the SQLite database at
`./data/annotations.db` with ledger-backed integrity.
Each ground truth dataset has: a name, description, schema (the label schema
used for annotation), items (each with input data and the authoritative label),
version history, and status (draft, validated, deprecated).

Datasets are created in several ways:
- By promoting annotated items from a completed annotation campaign (after
  adjudication resolves conflicts)
- By importing from a JSONL file with known correct labels
- By manual entry through the frontend
- By inheriting from another ground truth dataset with modifications

Version history tracks every change: when an item is added, removed, or its
label is corrected, a new version is created with a diff from the previous
version.
Versions are identified by SHA-256 hash of the dataset manifest.

Automated scoring pipelines run model predictions against ground truth items:
the module loads each item, sends the input to the target model, collects the
output, and compares it against the ground truth label using configurable
metrics (exact match, BLEU, cosine similarity, or custom evaluator).
For classification tasks, the module computes a full confusion matrix per
dataset, identifying which label pairs are most frequently confused.
Per-item scores are aggregated into dataset-level accuracy, precision, recall,
and F1 scores.
Scoring runs in a configurable batch mode (default 50 items per batch) with
progress reported via WS message `ground_truth_score_progress`.

Regression detection compares current accuracy against historical baselines —
if accuracy drops beyond a configurable threshold (default 5%), the module
raises a regression alert.
Alerts are surfaced in the frontend and written to the ledger.

Ground truth datasets can be linked to quality gates: a model cannot be
promoted if its accuracy on a ground truth dataset falls below a threshold.
The frontend `GroundTruthView` connects via WebSocket to port 3030 and provides
a dataset browser with item-level drill-down.

WS messages include `ground_truth_set`, `ground_truth_get`, `ground_truth_score`,
`ground_truth_set_result`, `ground_truth_list`, and `ground_truth_score_result`.
The HTTP UI on port 8081 includes a Ground Truth dashboard with version
history timeline where operators can view diffs and roll back if needed.

## How to Operate
1. Promote from campaign: `api-oss ground-truth promote --campaign camp_001
   --name "GT v1"`.
2. Import from file: `api-oss ground-truth import --file ./golden.jsonl
   --name "Support GT" --schema ./schema.json`.
3. List: `api-oss ground-truth list`.
4. Score model: `api-oss ground-truth score --dataset "GT v1" --model
   my_finetune`.
5. View history: `api-oss ground-truth score-history --dataset "GT v1"`.
6. Add items: `api-oss ground-truth add-items --dataset "GT v1"
   --file ./new_items.jsonl`.
7. Correct label: `api-oss ground-truth correct --dataset "GT v1"
   --item-id item_042 --new-label "malignant"`.
8. Rollback: `api-oss ground-truth rollback --dataset "GT v1" --version 3`.
9. Link to quality gates in `opencode.json`.

## The Moat
- Datasets stored locally in the ledger with full version history
- Automated scoring runs offline with no network calls
- Regression detection alerts on accuracy degradation
- Version history enables rollback to any previous state
- Integration with quality gates for promotion blocking
- No cloud dependency

## Why Choose API-OSS
Palantir's ground truth management requires cloud infrastructure.
Mercor has no ground truth dataset management.
API-OSS provides complete ground truth lifecycle — from annotation promotion
through versioning, scoring, and regression detection — all offline.

## Competitive Comparison
- **Palantir**: Ground truth in Foundry requires cloud infrastructure.
- **Mercor**: No ground truth dataset management.
- **OpenAI**: No ground truth management.
- **Anthropic**: No ground truth tooling.
- **Nvidia**: No ground truth management in NeMo.

## Cost-Benefit Analysis
Building equivalent ground truth management costs ~$35K in engineering time.
Without automated scoring, manual testing costs ~$500/test and is often
skipped. For 20 model updates/year, that's $10K/year just in manual testing.
Catching one regression before deployment saves $10K+ in incident response.
A single regression in a production model can affect thousands of users —
prevention alone justifies the infrastructure.
Version history prevents data loss costing $5K+ to recreate from scratch.
Cloud alternatives (Labelbox, Scale AI) cost $50-200/month for storage plus
per-item query fees. Over 3 years, that's $1,800-$7,200 in storage alone.
Mercor has no ground truth management, forcing teams to build their own —
API-OSS includes it at zero additional cost.

## Applications
- **Consumer**: Maintain personal "answer key" for custom classifiers.
- **Government / Defense**: Validate model behavior against curated
  intelligence benchmarks.
- **Enterprise**: Automated regression testing for every promotion candidate.

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