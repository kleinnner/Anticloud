---
title: "Model Card Generation"
sidebar_position: 99
description: 'Auto-generates model cards compliant with "Model Cards for Model Reporting"'
tags: [features]
---

# Model Card Generation

## What It Does
Auto-generates model cards compliant with "Model Cards for Model Reporting"
(Mitchell et al.) — including eval results, bias notes, intended use, training
data provenance, and limitations.
Cards are stored alongside models in the ledger and updated automatically when
new evaluation data becomes available.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading model card
configuration from `opencode.json`.
The `model_card.rs` Rust module in `ai-oss-gateway/src/` manages card
generation and storage.

When a model card is requested (via WS message `model_card_get` or CLI), the
module queries the ledger for all available data about the model. The query
is executed against `data/graph.db` using SQL joins across the
`evaluation_runs`, `bias_evaluations`, `safety_benchmarks`,
`human_evaluations`, `training_provenance`, and `model_metadata` tables. Each
query is scoped by the model's SHA-256 hash to ensure only data for that exact
model version is included.
The assembled data includes:
- Evaluation results from `eval/benchmark_runner.rs`
- Bias evaluation scores from the bias framework
- Safety benchmark results (HarmBench, toxicity, jailbreak)
- Human evaluation data from Model Judge
- Training data provenance records
- Model metadata (architecture, quantization, parameter count, context length,
  SHA-256 hash)

The module assembles this data into a `ModelCard` struct that implements the
standard Model Card sections as specified by Mitchell et al. (2019):
- **Model Details**: name, version, type, license, authors (from
  `opencode.json`), and the model's SHA-256 hash from the ledger
- **Intended Use**: primary use cases, out-of-scope use cases, and
  recommended audience
- **Factors**: relevant demographic groups (from bias evaluation), environmental
  factors (GPU type, quantization level from training provenance)
- **Metrics**: model performance measures with 95% confidence intervals computed
  using the Wilson score interval for binary metrics and bootstrapped
  percentile intervals for continuous metrics
- **Evaluation Data**: datasets used, preprocessing steps, dataset version
  hashes from the ledger
- **Training Data**: source, size, preprocessing, labeling method, data
  provenance chain
- **Quantitative Analyses**: per-benchmark results with per-demographic
  disaggregation where bias evaluation data exists
- **Ethical Considerations**: bias findings (per-dimension scores from BBQ),
  fairness assessment summary
- **Caveats and Recommendations**: known limitations from evaluation runs,
  deployment recommendations based on benchmark performance patterns

Each section is populated from real data in the ledger — no hand-written
marketing copy.
Benchmark results include dataset versions and run IDs for traceability.
Bias findings reference the specific bias evaluation run ID with a link to
the full bias report.
Safety scores reference the HarmBench run ID and include the full pass/fail
breakdown per HarmBench category.

If certain data is missing (e.g., no bias evaluation run), the card clearly
marks the section as "Not evaluated" rather than omitting it — preventing the
appearance of completeness where gaps exist.
Cards are generated as structured JSON internally via serde serialization of
the `ModelCard` struct, and then rendered to HTML via a Tera template or to
Markdown via a custom formatter.
The generated card is stored in the ledger alongside the model entry, with a
SHA-256 hash of the card content for tamper detection. Each card version
increments a version counter in the ledger, enabling full version history.

When new evaluation data is added for a model, the model card is automatically
updated and the ledger entry is updated with a new version.
The HTTP UI on port 8081 displays model cards in a formatted view with
collapsible sections.
WS messages include `model_card_get` and `model_card_data`.

All operations work fully offline.

## How to Operate
1. Generate a model card: `api-oss model card generate --model my_model`.
2. View latest card: `api-oss model card show --model my_model`.
3. View a specific version: `api-oss model card show --model my_model --version 3`.
4. Export to file: `api-oss model card export --model my_model --format html
   --output ./card.html`. Supports `html`, `md`, `json`, and `pdf` formats.
5. View version history: `api-oss model card history --model my_model`.
6. Compare two versions: `api-oss model card diff --model my_model --v1 3
   --v2 2`.
7. Add human annotation: `api-oss model card annotate --model my_model
   --section "Caveats" --note "Not for medical use"`.
8. Verify card integrity: `api-oss model card verify --model my_model`.
9. Regenerate with new data: `api-oss model card regenerate --model my_model`.
10. Configure auto-update in `opencode.json`:
   ```json
   {
     "model_cards": {
       "auto_update": true,
       "sections": ["all"]
     }
   }
   ```

## The Moat
- Cards generated from real local evaluation results, not marketing copy
- Every metric traced to a specific evaluation run in the ledger
- Tamper-evident via hash chaining
- Missing evaluations explicitly noted — no hidden gaps
- Auto-update when new evaluation data arrives
- Version history tracks documentation evolution
- No cloud dependency

## Why Choose API-OSS
OpenAI model cards are static documents authored by OpenAI.
Anthropic publishes centrally with no per-deployment generation.
API-OSS generates a unique card for every model version with every metric
traceable to a real evaluation run.

## Competitive Comparison
- **OpenAI**: Static cards authored centrally. No per-deployment generation.
- **Anthropic**: Central cards for base models. No per-fine-tune cards.
- **Nvidia**: No model card generation in NeMo.
- **Palantir**: Documentation exists but not auto-generated from eval data.
- **Mercor**: No model card capabilities.

## Cost-Benefit Analysis
Manual model card creation takes 4-8 hours per version at $100/hour —
$400-$800 per card. For 20 model versions per year, that's $8K-$16K/year.
Compliance auditors charge $500/hour — auto-generated cards reduce audit
preparation time by 75%, saving an estimated $3K-$6K per annual audit.
Building a custom model card generation framework from scratch costs ~$30K in
engineering time plus ongoing maintenance for template updates.
EU AI Act transparency requirements (Article 13) map directly to the Model
Card structure — API-OSS satisfies them without additional investment,
potentially saving $10K-$50K in compliance consulting fees.
The automatic update feature ensures model cards never become stale, avoiding
the compliance risk of outdated documentation which can result in regulatory
fines of up to 3% of annual revenue under the EU AI Act.

## Applications
- **Consumer**: Document fine-tuned models for sharing with peers.
- **Government / Defense**: Compliance documentation for AI deployment
  approval.
- **Enterprise**: Standardized documentation for internal governance boards.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ