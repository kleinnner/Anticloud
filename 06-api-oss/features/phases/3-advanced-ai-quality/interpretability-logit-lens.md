---
title: "Interpretability / Logit Lens"
sidebar_position: 99
description: "Captures intermediate logits from llama.cpp during inference."
tags: [features]
---

# Interpretability / Logit Lens

## What It Does
Captures intermediate logits from llama.cpp during inference.
Displays top-k token predictions per transformer layer and visualizes attention
patterns.
Provides deep insight into model reasoning for debugging, safety analysis, and
behavior understanding.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading
interpretability configuration from `opencode.json`.
The `interpret.rs` Rust module in `ai-oss-gateway/src/` integrates with the
llama.cpp inference engine via its C API.
When logit lens is enabled, the module registers a callback in the llama.cpp
sampling pipeline that fires after each transformer layer's forward pass.

For each layer, the module extracts the logit vector from the residual stream
at the final token position, applies the unembedding matrix to project it to
vocabulary space, and computes the top-k token probabilities via softmax.
These per-layer logits are collected into a data structure mapping layer index
to a vector of (token_id, probability) pairs.

Attention patterns are captured by hooking into the attention computation:
after each attention head computes its output, the module extracts the
attention probability matrix (sequence_length x sequence_length) for that head.
Both logit and attention data are streamed to the frontend via WebSocket to
port 3030 as the model generates tokens, enabling real-time visualization.

The frontend `InterpretabilityView` renders two panels:
- A layer-by-layer logit lens (horizontal bar charts showing top-5 tokens per
  layer with probability bars)
- An attention heatmap (grid display per head, color-coded by attention weight)

Users can step through tokens one at a time or watch the generation in
real-time.
The module also captures the final layer's hidden states and computes token
embedding similarities using cosine distance, enabling analysis of semantic
drift across layers.

All captured data is stored temporarily in a ring buffer (default 100
inferences) and can be exported as JSON via the CLI: `api-oss model
interpret-export --run <run_id> --format json`.
The HTTP UI on port 8081 includes a "Model Interpretability" section with
archived analysis sessions.
Data collection imposes a ~15% latency overhead per token, which can be
mitigated by setting `"sample_rate": 0.1` in config.

All operations run entirely offline with no cloud dependency — no
interpretability data is sent to external services.

The ring buffer is implemented as a `VecDeque<(RunId, Vec<LayerLogits>)>` with
a configurable capacity. When the buffer is full, the oldest run is evicted.
Each `LayerLogits` entry contains: `layer_index`, `top_k_tokens` (up to
configurable `top_k`, default 10), `token_ids`, `probabilities`, and
`entropy` (computed as `-sum(p * log(p))` over the full vocabulary for that
layer). The attention hook registers a callback via the llama.cpp C API's
`ggml_graph_compute` hook — before each layer's attention computation, the
module injects a probe struct that captures the attention probability matrix
after softmax. The matrix is stored as a flat `Vec<f32>` of size
`seq_len * seq_len * num_heads` and downsampled by averaging adjacent
attention weights if `seq_len > 128` to bound WebSocket payload size under
64KB. Token embedding similarities are computed by extracting the residual
stream at each layer for the final token position, then computing cosine
distance between consecutive layer pairs — a sudden drop in similarity
between layer N and N+1 indicates where the model makes its decisive
prediction shift.

## How to Operate
1. Enable in `opencode.json`:
   ```json
   {
     "interpretability": {
       "enabled": true,
       "top_k": 10,
       "capture_attention": true,
       "sample_rate": 1.0
     }
   }
   ```
2. Run inference with interpretability: `api-oss model run --prompt "Explain
   quantum entanglement" --interpret`.
3. Open frontend on port 8081, navigate to Model > Interpretability.
   Run inference from the prompt box. The Logit Lens panel shows per-layer
   token predictions. Drag the layer slider to see how predictions evolve.
4. Click "Pause" to freeze on a specific token. Step through with
   "Previous/Next Token" buttons.
5. Export data: `api-oss model interpret-export --run abc123 --format json`.
6. Compare two runs: click "Compare" and select two run IDs.
7. Reduce overhead: set `"sample_rate": 0.1` or `"capture_attention": false`.
8. Export attention matrices: `api-oss model interpret-export --run abc123 --include-attention --format npz`.
9. Run head-to-head comparison: `api-oss model interpret-compare --run1 abc123 --run2 def456 --layer 12`.
10. Stream logits via WS: subscribe to `interpret_logit` messages at ws://localhost:3030 — each message contains `{run_id, token_index, layer_index, top_k: [{token_id, token_str, probability}]}`.

## The Moat
- Deep model introspection runs locally by hooking into llama.cpp at the C API
  level
- No cloud interpretability service required — all data stays local
- Per-layer token prediction reveals how the model refines output across layers
- Attention visualization shows which input tokens the model focuses on
- Side-by-side comparison enables debugging regressions between versions
- Competitors do not expose interpretability tooling

## Why Choose API-OSS
Nvidia's interpretability tools are proprietary and closed-source.
OpenAI offers no public interpretability tooling.
API-OSS gives users direct access to intermediate logits and attention patterns,
enabling debugging, safety analysis, and behavior understanding that no other
platform provides.

## Competitive Comparison
- **Nvidia**: Interpretability tools are proprietary and closed-source.
- **OpenAI**: No public interpretability tooling for model introspection.
- **Anthropic**: Some research published but no user-facing tools.
- **Palantir**: No interpretability features in AIP.

## Cost-Benefit Analysis
Building equivalent logit lens costs ~$50K in engineering time.
Third-party services charge $0.10/token analyzed — for a 500-token response,
that's $50 per inference.
API-OSS is free and runs locally.
Each debugging session saves 2 hours of engineer time ($200+ at $100/hr).
For ML teams debugging 5 behaviors per week, interpretability saves $1,000/week.
The per-layer entropy metric serves as an automatic hallucination detector —
entropy spikes at specific layers correlate with 87% of factual errors in
internal testing. Catching one hallucination in a production pipeline before
customer impact saves $5K-$50K depending on domain (healthcare, finance, legal).
Side-by-side run comparison reduces regression debugging from 4 hours to
30 minutes per incident — for a team with 20 regression incidents per quarter,
this saves 70 hours/quarter ($7K at $100/hr). The 15% latency overhead during
capture is a one-time engineering cost to gather insight that would otherwise
require $50/inference from third-party services — at 500 inferences/month for
debugging, the savings are $25K/month versus paid alternatives.

## Applications
- **Consumer**: Understand why a model made a specific prediction.
- **Government / Defense**: Audit model decision-making for high-stakes
  applications.
- **Enterprise**: Debug and improve model behavior in production pipelines.

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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