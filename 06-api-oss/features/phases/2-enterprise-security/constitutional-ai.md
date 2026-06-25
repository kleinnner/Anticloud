---
title: "Constitutional AI"
sidebar_position: 99
description: "Configurable constitution with 30+ built-in principles governing AI behavior."
tags: [features]
---

# Constitutional AI

## What It Does
Configurable constitution with 30+ built-in principles governing AI behavior.
Users can modify, add, or remove principles — unlike competing systems where the
constitution is fixed and immutable.
Every principle is evaluated at decision time by the Rust engine.
## How It Works
Constitutional AI is implemented in the Rust module `ai-oss-gateway/src/constitution.rs`.
The constitution is a structured document containing principles — each principle is a
compiled rule with: a name and description, a category (harmlessness, honesty, privacy,
transparency, fairness, reliability, human oversight), an evaluation function (compiled
from a declarative rule definition), a severity (suggestion, warning, block), and optional
conditions (applies only to specific codices, user roles, or data types).
The constitution is stored in `data/graph.db` (SQLite WAL) alongside the graph data,
versioned with a full revision history.
When the council (Qwen2-VL-2B-Instruct-Q4_K_M.gguf on CUDA) produces a decision or the
rules engine evaluates a mutation, the constitution evaluation engine runs every enabled
principle against the decision context.
Each principle evaluates to pass, warn, or fail.
Failures can block the decision entirely (for `severity: block` principles), trigger a
warning to the user, or log an incident for review.
The results are aggregated into a constitution compliance report that accompanies every
decision.
Principles are user-editable via the `ConstitutionView` frontend at
`https://localhost:8081/constitution` — a visual principle editor with live evaluation
preview and version history.
Changes are made by sending `constitution_update` over WebSocket to port 3030, with the
full principle definition.
Unlike Anthropic's constitutional AI, which is baked into the model weights and cannot be
changed, API-OSS's constitution is a user-editable document evaluated at decision time in
the Rust layer — external to the model.
This means users can add industry-specific principles (HIPAA privacy requirements, GDPR
data minimization, military rules of engagement) without retraining the model.
The constitution version history is recorded in the immutable ledger at `data/ledger/` in
`.aioss` format.
Configuration for default principles and severity levels is driven by `opencode.json`.
The gateway runs as a single binary via `api-oss start`, fully air-gapped.
## How to Operate
1.
**View the constitution**: Open `https://localhost:8081/constitution` in the HTTP UI.
The `ConstitutionView` displays all 30+ principles grouped by category.
2.
**Modify a principle**: Click a principle to edit its name, description, evaluation logic, severity, and conditions.
The live preview shows how the change affects sample decisions.
3.
**Add a custom principle**: Click "Add Principle" and define: category, evaluation condition (using the rule DSL), severity, and scope.
Example: "Block any decision that includes PII in the output" with `severity: block`.
4.
**Toggle principles**: Enable or disable principles without deleting them — useful for testing new principles before enforcing them.
5.
**Review compliance history**: The timeline shows every decision with its constitution compliance report — which principles passed, warned, or failed.
6.
**Version management**: The constitution maintains a full revision history.
Roll back to a previous version with `constitution_rollback` over WebSocket.
7.
**Audit**: Check `data/ledger/` for `.aioss` entries recording every constitution change and every constitution evaluation result.
## The Moat
- **User-editable, not hardcoded**: Unlike Anthropic's constitution that is fixed in model weights, API-OSS's constitution is a user-editable document evaluated at runtime.
Users can add, modify, or remove principles without model retraining.
- **Evaluated in Rust, not in the model**: Constitution principles are compiled rules checked by the Rust evaluation engine before or after the model inference.
The model cannot violate the constitution because the constitution is enforced
independently of model output.
- **30+ built-in principles**: Harmlessness, honesty, privacy, transparency, fairness, reliability, human oversight, and more — covering the full range of AI safety considerations.
- **Severity-controlled enforcement**: Principles can suggest, warn, or block.
Blocking principles guarantee that violating outputs never reach the user.
- **Versioned with full audit**: Every constitution change is versioned and recorded in `data/ledger/` with cryptographic chaining.
Auditors can verify the constitution state at any point in time.
- **Live evaluation preview**: The `ConstitutionView` shows how changes affect decisions in real time — no trial-and-error in production.
## Why Choose API-OSS
Anthropic's constitutional AI is a pioneering approach but is locked to their model —
users cannot modify the constitution.
OpenAI has no constitutional AI framework — content filtering is opaque and not
configurable.
Palantir has no constitutional AI.
API-OSS provides a fully configurable constitutional AI framework that runs locally,
enforces principles at the Rust engine level (not model level), and provides 30+ built-in
principles plus unlimited custom principles.
For organizations that need AI behavior to align with their specific values, regulations,
or mission requirements, API-OSS is the only platform that delivers configurable
constitutional AI.
## Competitive Comparison
- **Anthropic**: Fixed constitution in model weights — not user-configurable.
Users cannot add industry-specific or mission-specific principles.
- **OpenAI**: No constitutional AI — content filtering is opaque, non-configurable, and applies only to obvious violations.
- **Palantir**: No constitutional AI framework — no principle-based governance of AI behavior.
- **Snowflake**: No constitution or AI governance framework.
## Cost-Benefit Analysis
Building a constitutional AI system in-house requires: AI safety research expertise (rare
and expensive — $300k-$500k/year per researcher), custom rule evaluation engine
development (6-12 months), and integration with model inference (2-4 months).
Anthropic's API provides constitutional AI but charges per-token and does not allow
customization.
API-OSS provides a complete, configurable constitutional AI framework at zero additional
cost.
Time savings: 8-16 months of research and development eliminated.
Risk reduction: for healthcare, military, or financial services, having non-configurable
AI safety principles is a liability — API-OSS allows organizations to enforce the
specific principles required by their regulators.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Mission-aligned constitution for military decision support — principles such as "never recommend lethal action without human confirmation" and "always identify confidence level of intelligence sources" are enforced at the engine level.
- **Enterprise**: Industry-specific principles — healthcare organizations add HIPAA privacy principles ("block any output containing PHI without authorization"), financial services add FINRA compliance principles ("flag any recommendation that could be construed as investment advice without disclaimer").

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
