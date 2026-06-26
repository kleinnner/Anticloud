---
title: "Export Evaluation Datasets"
sidebar_position: 99
description: "Downloads real benchmark datasets from Hugging Face, converts them to the"
tags: [features]
---

# Export Evaluation Datasets

## What It Does
Downloads real benchmark datasets from Hugging Face, converts them to the
internal evaluation format, and caches them locally for fully offline use.
Supports all standard benchmark formats including MMLU, GSM8K, HumanEval,
HellaSwag, and ARC.
Once cached, datasets are available for repeated evaluation runs with no
recurring network calls.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading configuration
from `opencode.json`.
When a dataset export is triggered (via CLI or WS), the `eval/` module in Rust
resolves the Hugging Face dataset identifier from the config or command
argument.
The module first checks `./data/eval/datasets/` for an existing cached copy,
verifying integrity via SHA-256 hash recorded in the ledger.

If not cached, it streams the dataset from Hugging Face using the
`huggingface_hub` crate, downloading parquet or JSONL files into a staging
directory.
Each record is parsed and converted to the internal evaluation format — a
normalized schema with `input`, `expected_output`, `metadata` (source, split,
category), and optional `few_shot_examples` fields.
Conversion is deterministic: the same Hugging Face dataset always produces
bit-identical internal files.

During conversion, benchmark-specific logic handles format differences:
- MMLU uses multiple-choice with four options
- GSM8K uses chain-of-thought with numeric answers
- HumanEval uses function signatures with test cases

After conversion, the files are written to
`./data/eval/datasets/<benchmark>/<split>/` as compressed JSONL.
A ledger entry records the dataset hash, download timestamp, Hugging Face
revision SHA, and conversion parameters.
All subsequent evaluation runs use the cached local copy — no internet access
is required.
The benchmark runner at `eval/benchmark_runner.rs` reads these cached files
when executing evaluation campaigns.

The HTTP UI on port 8081 lists available datasets with their cache status,
size, and last-verified hash.
Datasets can be refreshed from the CLI with `eval dataset refresh` to pull the
latest Hugging Face revision.

## How to Operate
1. Run `api-oss eval dataset list` to see all available benchmarks and their
   cache status. Uncached datasets show "not downloaded".
2. Run `api-oss eval dataset download --benchmark mmlu --split test` to download
   and convert the MMLU test split. The CLI shows progress: "Downloading:
   14,042 items... Converting: 100%... Cached to
   ./data/eval/datasets/mmlu/test/".
3. For a bulk download of all standard benchmarks, run
   `api-oss eval dataset download --all`. This downloads MMLU (14K), GSM8K
   (8.5K), HumanEval (164), HellaSwag (10K), and ARC (7.8K) — approximately
   45K total items, ~200MB on disk.
4. Verify cache integrity: `api-oss eval dataset verify --benchmark mmlu`
   recomputes SHA-256 on every cached file and compares against the ledger
   entry. Mismatches are flagged and the dataset is re-downloaded automatically.
5. To refresh a dataset to the latest Hugging Face revision, run
   `api-oss eval dataset refresh --benchmark mmlu`. The old cache is renamed
   with a `.bak` suffix, new data is downloaded, and if conversion succeeds,
   the old cache is deleted.
6. In the frontend on port 8081, navigate to the Evaluation section, click
   "Datasets" to see a table of benchmarks with cache status, item count, last
   download date, and hash. Click "Download" or "Refresh" per dataset.
7. For air-gapped environments, download the datasets on a connected machine,
   copy `./data/eval/datasets/` to the air-gapped system's `./data/` directory,
   and run `api-oss eval dataset verify --all` to validate integrity.

## The Moat
- Once downloaded, all evaluation datasets are available offline — no recurring
  network calls for evaluation
- Conversion to internal format is deterministic and reproducible: same source
  always produces bit-identical output
- Datasets are cached with SHA-256 integrity verification anchored in the
  immutable ledger
- No competitor offers local benchmark caching with tamper detection —
  datasets are either cloud-streamed or not available
- Supports multiple benchmark formats from a single unified import pipeline
- Automatic corruption detection via hash comparison on every evaluation run
- Air-gap compatible: datasets can be pre-loaded and verified before
  disconnecting the network
- Hugging Face revision pinning ensures reproducibility across time

## Why Choose API-OSS
Customers choose API-OSS for benchmark evaluation because datasets are cached
locally and available fully offline.
Competitors like OpenAI and Nvidia run benchmarks on their own infrastructure —
users cannot reproduce results or run evaluations in private environments.
API-OSS gives organizations the ability to independently verify model
performance on standard benchmarks without trusting a cloud provider's
methodology.
For regulated industries, this means evaluations can be conducted in air-gapped
facilities with no data exfiltration risk.
The deterministic conversion ensures that two organizations evaluating the same
benchmark get the same inputs, enabling apples-to-apples comparison.

## Competitive Comparison
- **Nvidia**: Benchmark datasets are not available for local download and
  execution. Nvidia runs benchmarks internally and publishes selective results.
- **OpenAI**: Evaluation datasets are not exposed for local use. Benchmarks are
  run on OpenAI infrastructure with opaque methodology.
- **Anthropic**: No downloadable benchmark datasets for users. Evaluations are
  internal.
- **Palantir**: Benchmark evaluation exists in Foundry but requires cloud
  infrastructure and streaming dataset access.
- **Mercor**: No evaluation dataset export feature. All evaluation is on
  Mercor's platform.

## Cost-Benefit Analysis
Cloud competitors charge per-evaluation-run for benchmark testing.
A single MMLU run on OpenAI infrastructure costs ~$10 in API credits (14K items
evaluated).
Running MMLU locally via API-OSS costs $0 — the dataset is cached, inference
uses local GPU at no additional charge.
Over 100 evaluation runs, that's $1,000 saved vs. OpenAI.
Nvidia's benchmark tooling requires DGX cloud access at $30/hr+. API-OSS runs
on any CUDA GPU, including a single RTX 4090.
For air-gapped deployments, the alternative is manual dataset creation which
costs weeks of operator time. API-OSS eliminates that engineering cost entirely.

## Applications
- **Consumer**: Run standard benchmarks on personal hardware without internet.
  Compare local models against published scores to validate quality.
- **Government / Defense**: Evaluate models against public benchmarks in
  air-gapped environments. Pre-load datasets during connectivity windows,
  verify integrity, then evaluate offline.
- **Enterprise**: Standardized model evaluation across air-gapped or restricted
  networks. Procurement teams use local benchmark scores to compare model
  vendors without leaking evaluation methodology.

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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