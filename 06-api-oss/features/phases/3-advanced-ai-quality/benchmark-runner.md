---
title: "Benchmark Runner"
sidebar_position: 99
description: "Automates download and execution of standard NLP benchmarks: MMLU, GSM8K,"
tags: [features]
---

# Benchmark Runner

## What It Does
Automates download and execution of standard NLP benchmarks: MMLU, GSM8K,
HumanEval, HellaSwag, and ARC.
Computes standardized scores and stores results in the local ledger for
comparison, trend analysis, and quality gate enforcement.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading benchmark
configuration from `opencode.json`.
The `eval/benchmark_runner.rs` Rust module in `ai-oss-gateway/src/` is the core
execution engine.
When a benchmark is triggered (via CLI `eval run --benchmark <name>` or WS
message), the module first checks `./data/eval/datasets/` for cached dataset
files.

If datasets are not cached, it downloads them from Hugging Face using the
`huggingface_hub` crate and converts them to the internal evaluation format.
Each benchmark has a dedicated evaluation method:

- **MMLU** (multi-task language understanding): uses few-shot prompting with
  5 examples per task and measures accuracy across 57 subjects
- **GSM8K** (grade school math): uses chain-of-thought prompting and measures
  exact match on numeric answers
- **HumanEval**: uses function synthesis from docstrings with `pass@k` metrics
  (k=1, 10, 100) by generating multiple completions and running test cases
- **HellaSwag**: uses sentence completion with multiple-choice accuracy
- **ARC** (AI2 Reasoning Challenge): uses both easy and challenge splits with
  accuracy measurement

The benchmark runner loads the target model (default:
Qwen2-VL-2B-Instruct-Q4_K_M.gguf with CUDA backend) via the llama.cpp C API.
For each benchmark item, it formats the prompt according to the benchmark's
few-shot template, runs inference with deterministic sampling (temperature=0,
top_p=1), and compares the output against the expected answer using
benchmark-specific scoring.

For HumanEval, the runner generates completions, executes them in a sandboxed
Python environment (using the `pyo3` crate to call a local Python runtime),
and compares test outputs against expected results.
All results are committed to the ledger with the model hash, dataset version,
inference parameters, and per-item scores.

The ledger stores both aggregate scores and individual item results, enabling
detailed analysis.
The module supports running individual benchmarks or batches
(e.g., `eval run --all` runs all available benchmarks sequentially).
Results are cached in `./data/eval/results/` for quick retrieval.

The HTTP UI on port 8081 displays benchmark results in a table with
per-benchmark scores, confidence intervals, and historical trends.
The 87 CLI commands include the `eval` command group with subcommands:
`eval run`, `eval list`, `eval results`, `eval compare`, and `eval dataset`.

All benchmark execution runs fully offline after initial dataset download.

Dataset caching uses SHA-256 verification: before each run, the module computes
the SHA-256 hash of each cached dataset file and compares it against a
manifest file (`./data/eval/datasets/MANIFEST.json`) that stores the expected
hash and dataset version. If hashes mismatch, the module re-downloads the
dataset. The `huggingface_hub` crate is configured with a local mirror URL
(via the `HF_ENDPOINT` environment variable) for air-gapped environments.

For HumanEval sandboxed execution, `eval/benchmark_runner.rs` spawns a Python
subprocess via `pyo3`'s Python interpreter embedded in Rust. Each generated
function is compiled and executed in a restricted scope with `builtins` limited
to a safe subset (no `os`, `subprocess`, `sys`, `eval`, `exec`, or `import`
statements allowed). Test cases are run with a 5-second timeout per function —
functions exceeding the timeout are marked as failed. The pass@k metric is
computed using the unbiased estimator: `pass@k = 1 - C(n - c, k) / C(n, k)`,
where `n` = total generations, `c` = passing generations, and `k` = number of
trials. For k=1, this simplifies to `c/n`.

Deterministic sampling is enforced by setting `temperature=0`, `top_p=1.0`,
`top_k=-1` (disabled), and seeding the random number generator with a fixed
seed derived from the dataset item hash: `seed = hash(item_id) % u32::MAX`.
This guarantees bitwise reproducibility across runs on the same hardware.

## How to Operate
1. List benchmarks: `api-oss eval list`.
2. Run single: `api-oss eval run --benchmark mmlu --model my_model`.
3. Run all: `api-oss eval run --all --model my_model`.
4. View results: `api-oss eval results --model my_model`.
5. Compare models: `api-oss eval compare --model1 base --model2 finetune`.
6. View trends: `api-oss eval trend --benchmark mmlu --model my_model`.
7. Run subset of MMLU: `--subjects "college_physics,abstract_algebra"`.
8. Add custom benchmark: place Python script in `./data/eval/custom/` with a
   `run(model, dataset_path) -> dict` interface, then `api-oss eval run --benchmark custom_my_test`.
9. Verify dataset integrity: `api-oss eval dataset verify --benchmark mmlu`.
10. Run HumanEval with more samples: `--pass-at-k-samples 200` (default 100).
11. Configure in `opencode.json`:
   ```json
   {
     "benchmark_runner": {
       "default_model": "my_model",
       "few_shot_count": 5,
       "temperature": 0.0
     }
   }
   ```

## The Moat
- Datasets cached locally for fully offline execution
- Standardized scoring ensures reproducible results
- No API calls to external evaluation services
- Dataset SHA-256 verification prevents corruption
- Per-item storage enables detailed error analysis
- Custom benchmark support via Python scripts
- HumanEval sandboxed execution provides code evaluation

## Why Choose API-OSS
OpenAI runs benchmarks on their infrastructure with opaque methodology.
Nvidia publishes selective results without local execution.
API-OSS gives organizations independent evaluation on their own hardware with
full transparency.

## Competitive Comparison
- **OpenAI**: Benchmarks run internally. Opaque methodology.
- **Nvidia**: Selective publishing. No local execution.
- **Anthropic**: Internal benchmarks. No user runner.
- **Palantir**: Foundry evaluation requires cloud infrastructure.
- **Mercor**: No benchmark runner.

## Cost-Benefit Analysis
MMLU via OpenAI API costs ~$140 (14K items x 5-shot x $0.01/1K tokens).
Full suite of 5 benchmarks costs ~$400 per version via API.
10 model versions/year = $4,000/year saved with local execution.
DGX cloud rental ($30/hr x 4hr) = $120 per suite.
Building equivalent infrastructure costs ~$80K in engineering time.
HumanEval sandboxed execution replaces a $500/month CodeSandbox or
CI-based evaluation pipeline — saving $6K/year in infrastructure costs.
Deterministic sampling eliminates the "flaky benchmark" problem where
non-deterministic runs produce ±2% score variance, which wastes an estimated
$10K/year in engineer time investigating phantom regressions. For
organizations running 50+ model variants per year (common in enterprise R&D),
the savings from local execution vs. API-based evaluation exceed $20K/year,
not counting the data security benefit of never sending proprietary model
outputs to external APIs.

## Applications
- **Consumer**: Verify model capabilities before personal adoption.
- **Government / Defense**: Independently verify performance claims in secure
  environments.
- **Enterprise**: Standardized model evaluation across vendors for procurement.

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
