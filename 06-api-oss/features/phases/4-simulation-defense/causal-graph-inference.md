---
title: "Causal Graph Inference"
sidebar_position: 99
description: "Infers causal relationships from graph structure and temporal"
tags: [features]
---

# Causal Graph Inference

## What It Does
Infers causal relationships from graph structure and temporal
patterns using
causal inference algorithms. Enables counterfactual reasoning —
"what would
happen if this edge changed or this node was removed?" Analysts can
understand root causes and predict downstream effects of graph
mutations.

## How It Works
The causal graph module in `ai-oss-gateway/src/causal_graph.rs`
implements a
suite of causal discovery and inference algorithms operating
directly on the
knowledge graph. The causal discovery engine runs PC (Peter-Clark)
algorithm,
LiNGAM (Linear Non-Gaussian Acyclic Model), and Granger causality
tests on
temporal graph data — relationship sequences, property changes
over time,
and event cascades. These algorithms produce a causal graph overlay
on the
knowledge graph, with directed edges representing inferred causal
relationships and confidence scores. The counterfactual simulator
answers
"what if" questions by mutating the causal graph and propagating
effects
through the causal structure — removing a node, changing an edge
direction,
or modifying a property — and predicting the downstream impact on
related
entities. The graph mutation impact analyzer uses do-calculus to
estimate
the effect of interventions on graph variables. Results are
integrated with
the World Engine — counterfactual simulations run in forked
universes via
zero-copy clones. The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on
CUDA
assists with pattern recognition for causal structure learning from
complex
graph data. All state is stored in SQLite WAL in `./data/`. Frontend
connects
via WebSocket to port 3030. HTTP UI is served on port 8081. Config
is driven
by `opencode.json` under the `causal_graph` section with algorithm
selection
and significance thresholds. The CLI includes 87 commands with
`causal`
subcommands.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the Causal Graph view in the browser at port 8081
3. Select a scope for causal analysis — specific entities, subgraph, or
   entire graph
4. Choose causal discovery algorithm (PC, LiNGAM, Granger) in the UI or
   config
5. Run discovery — the engine produces a causal overlay graph with
   confidence edges
6. Inspect inferred causal relationships — each edge shows confidence,
   algorithm, evidence
7. Run counterfactual queries: "what if entity X is removed?" — the
   simulator predicts effects
8. View impact analysis results in the forked universe comparison view
9. Export causal graph as a separated graph snapshot to `./data/`
10. Use the CLI: `api-oss causal discover`, `api-oss causal counterfactual`,
    `api-oss causal impact`

## The Moat
- Causal inference on graph data is an active research area — combining
  temporal graph data with causal discovery algorithms is a
significant
  architectural achievement
- The integration with the World Engine means counterfactual reasoning runs
  in isolated universes with CoW storage efficiency
- Multiple causal discovery algorithms (PC, LiNGAM, Granger) provide robust
  inference across different data types
- The graph mutation impact analyzer enables precise intervention analysis
- Fully offline operation means causal analysis works in disconnected
  environments
- No competitor offers interactive causal inference on a live knowledge
  graph

## Why Choose API-OSS
Palantir has no causal inference capability. Google has research in
causal
inference but no integrated product. Anthropic researches
interpretability
but has no causal graph product. API-OSS provides a complete causal
inference platform operating directly on the knowledge graph —
enabling
analysts to discover causal relationships, run counterfactual
simulations,
and analyze intervention impacts — all offline on consumer
hardware.

## Competitive Comparison
- **Palantir**: No causal inference capability
- **Google**: Research in causal inference but no integrated product
- **Anthropic**: Research in interpretability but no causal graph product
- **Nvidia**: No causal inference product

## Cost-Benefit Analysis
Building custom causal inference capabilities for graph data costs
$1M–$3M
in R&D plus ongoing model training. Statistical software packages
(R, STATA,
SAS) cost $5K–$15K/year per seat but lack graph-native
integration. API-OSS
provides graph-native causal inference at zero software cost —
one-time
hardware of ~$3,000. A defense intelligence organization performing
causal
analysis for attribution and root-cause investigation saves
$1M–$3M in
custom development. Time savings: manual causal analysis of a
complex event
cascade takes weeks; API-OSS provides algorithmic discovery in
minutes.

## Applications
- **Consumer**: Personal cause-effect understanding, health symptom analysis,
  financial outcome drivers
- **Government / Defense**: Root cause analysis of events, attack
  attribution, strategic cause-effect mapping
- **Enterprise**: Business impact analysis, root cause investigation,
  marketing attribution, operational causality

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com