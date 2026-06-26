---
title: "Active Learning (Uncertainty / Diversity)"
sidebar_position: 99
description: "Algorithmically selects the most informative unlabeled items for annotators"
tags: [features]
---

# Active Learning (Uncertainty / Diversity)

## What It Does
Algorithmically selects the most informative unlabeled items for annotators
to label, using uncertainty sampling (model confidence) and diversity sampling
(representative coverage).
Maximizes labeling efficiency per annotation dollar by prioritizing the items
that will most improve model performance.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading active
learning configuration from `opencode.json`.
The `active_learning.rs` Rust module in `ai-oss-gateway/src/` (with
dependencies on `annotation/annotation.rs`) manages sampling strategies.

The module maintains a pool of unlabeled items from the currently active
annotation campaign.
When annotators request the next item (via the Annotation Studio), the active
learning module selects the most informative item based on the configured
strategy.

**Uncertainty Sampling**: For each unlabeled item, the module computes the
model's prediction uncertainty using the logits from the current model.
For classification tasks, uncertainty is measured as the entropy of the
predicted probability distribution: items with high entropy (the model is
unsure between classes) are prioritized.
For generative tasks, uncertainty is measured as the perplexity of the
generated output or variance across multiple stochastic generations.
The module calls `get_next_by_uncertainty()` which scores all unlabeled items
and returns the top-N with highest uncertainty scores.
Uncertainty sampling uses the local model's own logits — no third-party API
call is needed.

**Diversity Sampling**: To avoid selecting many similar items (all from the
same cluster), diversity sampling uses embeddings to select items that are
maximally different from each other and from already-annotated items.
The module computes embeddings for all unlabeled items using the model's
embedding layer (or a dedicated embedding model), then performs k-means
clustering or farthest-first traversal to select items that maximize coverage
of the embedding space.
The module calls `get_next_by_diversity()` which returns items from
underrepresented clusters.

**Combined Strategy**: The default strategy combines both approaches using a
tunable ratio (default 70% uncertainty, 30% diversity).
Items receive a composite score that balances informativeness (uncertainty)
and representativeness (diversity).
The combined score ensures that annotation effort covers the full data
distribution while focusing on the most ambiguous regions.

The module also supports representative sampling: after a batch of annotations
is complete, the module re-embeds the newly annotated items and updates the
diversity model, ensuring continuous adaptation.
Sampling results are committed to the ledger with the selected items, sampling
strategy, uncertainty scores, and diversity scores.

The frontend integrates with the Annotation Studio — when an annotator
completes an item, the studio automatically requests the next item via WS
message `active_learning_sample` and receives the selection via
`active_learning_result`.
CLI commands include `active-learning preview` and `active-learning status`.
All operations work fully offline.

## How to Operate
1. Enable in `opencode.json`:
   ```json
   {
     "annotation": {
       "active_learning": {
         "enabled": true,
         "strategy": "combined",
         "uncertainty_weight": 0.7,
         "diversity_weight": 0.3,
         "sample_batch_size": 10
       }
     }
   }
   ```
2. Create campaign with active learning: `api-oss campaign create --name "AL
   Demo" --dataset items --active-learning`.
3. Open Annotation Studio. The studio automatically selects informative items.
4. Preview: `api-oss active-learning preview --campaign camp_001 --count 10`.
5. Status: `api-oss active-learning status --campaign camp_001`.
6. Simulate strategies: `api-oss active-learning simulate --dataset historical
   --strategies "uncertainty,diversity,combined,random"`.
7. Change strategy mid-campaign: update config, run `api-oss config reload`.

## The Moat
- Closed-form, deterministic algorithms run locally — zero cloud dependency
- Uncertainty scoring uses local model's own logits
- Diversity sampling uses local embeddings
- Combined strategy balances informativeness and representativeness
- Embedding computation runs on local GPU
- Simulation mode compares strategies without live campaigns
- Competitors use random sampling only

## Why Choose API-OSS
Mercor uses random sampling — every item has equal chance, wasting budget on
easy items.
API-OSS uses model uncertainty to prioritize ambiguous items and diversity to
cover the full distribution.
Combined strategy achieves best of both approaches.

## Competitive Comparison
- **Mercor**: Random sampling only. No optimization.
- **Palantir**: Basic active learning in Foundry requires cloud infrastructure.
- **OpenAI / Anthropic / Nvidia**: No active learning tooling.

## Cost-Benefit Analysis
Active learning reduces required annotations by 50-80%.
10,000 items at $1/item (Mercor): $10,000.
With active learning: $2,000-$5,000 for same quality.
10 campaigns/year: $50K-$80K/year saved.
Building equivalent costs ~$60K in engineering time.
Simulation identifies best strategy upfront, preventing $2K+ in wasted budget.

## Applications
- **Consumer**: Prioritize labeling confusing photos — save hours of work.
- **Government / Defense**: Maximize intelligence value from limited analyst
  time.
- **Enterprise**: Reduce labeling costs by 50-80% for production ML pipelines.

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20775926
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/06-api-oss
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/api-oss-fixed
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com