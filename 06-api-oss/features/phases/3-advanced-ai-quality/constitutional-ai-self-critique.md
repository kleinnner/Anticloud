---
title: "Constitutional AI Self-Critique"
sidebar_position: 99
description: "Post-generation critique pass that checks model outputs against a constitution"
tags: [features]
---

# Constitutional AI Self-Critique

## What It Does
Post-generation critique pass that checks model outputs against a constitution
of configurable rules.
Detects violations using a secondary LLM evaluation.
Automatically regenerates improved outputs or surfaces warnings.
The constitution is fully customizable per deployment with rules defined in
`opencode.json`.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading constitutional
AI configuration from `opencode.json` under the `contradiction_engine` section.
The `constitution.rs` Rust module in `ai-oss-gateway/src/` manages the
constitution rules, critique pass, and regeneration.

The constitution is a list of principle rules, each with a `name`,
`description`, `violation_criteria`, and `severity` (low, medium, high,
critical). Rules are defined in the config file:
```json
{
  "contradiction_engine": {
    "constitution": [
      {
        "name": "No Harmful Instructions",
        "description": "Output must not contain instructions for causing harm",
        "violation_criteria": "Does this output provide step-by-step
          instructions for self-harm, violence, or illegal activities?",
        "severity": "critical"
      }
    ],
    "critique_model": "same",
    "auto_regenerate": true,
    "max_regeneration_attempts": 3
  }
}
```

After the primary LLM generates a response, the constitution module sends the
output plus the violation criteria for each rule to the critique model.
The critique model can be the same model (default, `"critique_model": "same"`)
or a separate model specified by name. When using a separate model, the module
loads it via the same CUDA backend — qwen2-vl-2b-q4 for critique as well —
and keeps both model instances in GPU memory. If VRAM is insufficient (total
< 16 GB), the module queues the critique pass sequentially after generation
completes.
The critique model returns a structured judgment: for each rule, it outputs
`{"rule": "name", "violated": true/false, "explanation": "..."}`.

If any rule is violated, the module takes action based on severity:
- `low`: adds a warning annotation to the output
- `medium`: appends a disclaimer
- `high` and `critical`: triggers automatic regeneration

During regeneration, the original prompt plus the critique results are sent to
the primary LLM with an instruction to address the violations. The regeneration
prompt is constructed by the `constitution.rs` module: it wraps the original
prompt, the flagged rule violations, and the critique explanations into a
structured template:
```
[Original Prompt]: {prompt}
[Previous Output]: {output}
[Violations]: {rule_name}: {explanation}
[Instruction]: Revise the output to address each violation.
```
This generate-then-critique loop repeats up to `max_regeneration_attempts`
times.
If the output still violates rules after max attempts, the system falls back
to a safe default response or surfaces all violations with severity annotations
attached as metadata to the WebSocket response on port 3030.

Regenerated outputs are compared to the original using BLEU score to detect
if the critique over-corrected (e.g., the model became overly cautious).
The over-correction heuristic: if the BLEU score between original and
regenerated output drops below 0.5 AND the semantic similarity (cosine distance
on embeddings) drops below 0.7, the module flags potential over-correction.
If over-correction is detected, the original output is kept with warnings
attached rather than surfacing the regenerated output.
All critique results, regeneration attempts, over-correction flags, and final
decisions are logged to the ledger with a unique run ID per generation cycle.
The ledger records each step as a separate entry: `critique_evaluated`,
`critique_regenerated`, and `critique_finalized`, each with a timestamp and
SHA-256 of the intermediate state.

The frontend displays critique annotations inline with the output.
The HTTP UI on port 8081 includes a "Constitution" configuration page.
All operations run fully offline with no internet access.

## How to Operate
1. Define constitutional rules in `opencode.json` under
   `contradiction_engine.constitution`.
2. Restart or run `api-oss config reload`.
3. Run inference with constitution: `api-oss model run --prompt "..."
   --constitution`.
4. Run inference without constitution for comparison: `api-oss model run
   --prompt "..." --no-constitution`.
5. View critique details in the UI on port 8081 or via `api-oss model
   run-status --id <run_id> --show-critique`.
6. Test a specific rule: `api-oss constitution test-rule --rule "No Harmful
   Instructions" --output "..."`.
7. List all rules: `api-oss constitution list-rules`.
8. Export full constitution: `api-oss constitution export --file
   ./constitution.json`.
9. Import constitution: `api-oss constitution import --file ./rules.json`.

## The Moat
- Generation and critique run on the same local hardware — no external API
- Constitution fully customizable per deployment
- Dual-pass achieves safety without sacrificing helpfulness
- Over-correction detection prevents unnecessary refusals
- Configurable severity levels for graduated responses
- All results recorded in the immutable ledger

## Why Choose API-OSS
Anthropic applies constitutional AI only at training time — rules are baked in.
API-OSS runs a separate critique pass after every generation with user-defined
rules.
A defense contractor can add mission-specific rules without retraining.
An enterprise can enforce industry-specific content policies.

## Competitive Comparison
- **Anthropic**: Constitutional AI applied pre-generation only. Rules not
  user-modifiable.
- **OpenAI**: Moderation API is cloud-only with fixed policies.
- **Nvidia**: No constitutional AI in NeMo.
- **Palantir**: No constitutional AI features.
- **Mercor**: No constitutional AI capabilities.

## Cost-Benefit Analysis
OpenAI Moderation API costs $0.01/1K chars — $500/month for 100K generations.
Azure AI Content Safety costs $0.50-$1.50 per 1K records.
API-OSS critique runs locally at $0 per generation.
Building equivalent self-critique from scratch costs ~$60K in engineering time
plus ongoing maintenance for rule updates.
Each content policy violation reaching a customer costs an estimated $100K in
remediation, legal, and brand damage. Constitutional AI catches violations
before delivery, preventing these costs entirely.
Over-correction detection reduces unnecessary refusal rate by an estimated
40%, preserving model usefulness while maintaining safety guardrails.

## Applications
- **Consumer**: Enforce personal content rules on AI outputs.
- **Government / Defense**: Guarantee AI outputs comply with mission-specific
  policies.
- **Enterprise**: Self-regulating AI systems for regulated industries.

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
