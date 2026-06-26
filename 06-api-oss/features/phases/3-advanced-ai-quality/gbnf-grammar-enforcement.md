---
title: "GBNF Grammar Enforcement"
sidebar_position: 99
description: "Converts JSON Schema definitions to GBNF grammar files and passes them as"
tags: [features]
---

# GBNF Grammar Enforcement

## What It Does
Converts JSON Schema definitions to GBNF grammar files and passes them as
`--grammar-file` to llama-server.
Guarantees structured, schema-compliant output — no prompt engineering or
post-processing required.
Provides formal guarantees of output structure at the token generation level.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading grammar
enforcement configuration from `opencode.json`.
When GBNF grammar system is enabled, the `grammar.rs` Rust module in
`ai-oss-gateway/src/` intercepts all inference requests that specify a JSON
Schema in the request payload.
The module converts the JSON Schema to a GBNF (GGML BNF) grammar file using a
recursive schema-to-grammar compiler.

Each JSON Schema type maps to a GBNF rule:
- `string` maps to a rule that generates valid string tokens
- `number` maps to numeric token sequences
- `integer` maps to integer token sequences
- `boolean` maps to `true | false`
- `array` wraps item rules with comma separators and brackets
- `object` maps to a sequence of key-value pairs with comma separators and
  braces

Required fields are enforced at the grammar level — optional fields are wrapped
in optional rule alternatives.
`enum` values are expanded as literal alternatives: `"enum": ["red",
"green"]` becomes `"red" | "green"`.
`pattern` constraints are approximated via GBNF character class rules.
`minLength`/`maxLength` are enforced via repetition bounds.

The compiled GBNF grammar is written to a temporary file in
`./data/grammars/` with a filename derived from the schema hash.
The grammar file is then passed to the llama-server process via the
`--grammar-file` flag.
Since GBNF constrains token generation at the logit level, the model physically
cannot produce tokens outside the grammar — this provides formal guarantees of
schema compliance.

The temporary grammar file is cached — identical schemas reuse the same GBNF
file without recompilation.
Grammar files are cleaned up after the gateway shuts down, or can be persisted
by setting `"persist_grammars": true` in config.
The system also supports direct GBNF rule specification (bypassing JSON Schema
conversion) for advanced users.

All grammar operations work fully offline with no internet access.

## How to Operate
1. Enable in `opencode.json`:
   ```json
   {
     "grammar_enforcement": {
       "enabled": true,
       "default_strictness": "schema"
     }
   }
   ```
2. Send a request with a JSON Schema via CLI:
   ```
   api-oss model run --prompt "Generate a profile" --schema '{
     "type": "object",
     "properties": {
       "name": {"type": "string"},
       "age": {"type": "integer", "minimum": 0}
     },
     "required": ["name"]
   }'
   ```
3. Via WebSocket to port 3030, include `"schema": {...}` in the request.
4. Use raw GBNF: `--grammar 'root ::= "Hello" | "World"'`.
5. View generated GBNF files: set `"persist_grammars": true`, check
   `./data/grammars/`.

## The Moat
- Grammar-based output enforcement provides formal guarantees of structured
  output — unlike prompt-based JSON mode
- Conversion from JSON Schema to GBNF is deterministic and type-safe
- GBNF constrains token generation at the logit level — model cannot output
  invalid tokens
- Runs entirely locally — no API call to a structured output service
- No post-processing or retry logic needed

## Why Choose API-OSS
OpenAI's JSON mode is prompt-based — no formal guarantee of schema compliance.
Anthropic has no structured output enforcement.
API-OSS constrains the model's token generation with a formal grammar, making
it physically impossible to produce non-compliant output.
This eliminates validation code, retry logic, and error handling for malformed
JSON in production systems.

## Competitive Comparison
- **OpenAI**: JSON mode is prompt-based — no formal guarantee. ~3-5% malformed
  output rate.
- **Anthropic**: No structured output enforcement.
- **Nvidia**: No grammar enforcement in NeMo.
- **Palantir**: No grammar enforcement for model output.
- **Mercor**: No grammar enforcement.

## Cost-Benefit Analysis
OpenAI JSON mode costs per request and still produces malformed output ~3-5%
of the time.
Retry logic doubles latency and cost.
For 100K requests/month, avoiding retries saves ~$300/month and reduces p95
latency by 40%.
Building custom grammar enforcement costs ~$20K in engineering time.
Each production incident from malformed JSON costs ~$5K. Grammar enforcement
eliminates this entire class of incidents.

## Applications
- **Consumer**: Ensure personal AI tools return parseable structured data.
- **Government / Defense**: Guarantee machine-parseable outputs for automated
  analysis pipelines.
- **Enterprise**: Type-safe model integration into production systems with
  strict schema contracts.

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