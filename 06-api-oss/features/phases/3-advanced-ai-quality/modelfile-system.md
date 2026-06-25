---
title: "Modelfile System"
sidebar_position: 99
description: "Dockerfile-like declarative model configuration using `FROM`, `SYSTEM`,"
tags: [features]
---

# Modelfile System

## What It Does
Dockerfile-like declarative model configuration using `FROM`, `SYSTEM`,
`TEMPLATE`, and `PARAMETER` directives.
Models are built from modelfiles, versioned, and stored in the local model
registry.
Enables reproducible, reviewable, and version-controlled model configurations.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading modelfile
configuration from `opencode.json`.
The `modelfile.rs` Rust module in `ai-oss-gateway/src/` implements a parser
and builder for the modelfile format. The module exposes a `ModelfileBuilder`
struct with methods `parse(src: &str) -> Result<Ast>` and
`build(ast: &Ast) -> Result<ModelConfig>`.
A modelfile is a plain text file with directives that compose base models,
system prompts, inference parameters, and template overrides into a named
model configuration. Each directive is parsed as a separate AST node with
span information for error reporting.

The parser reads the modelfile using a hand-written recursive descent parser in
Rust that produces an AST of directives. Error messages include line and column
numbers for all parse failures:

- `FROM` specifies the base model file path (e.g., `FROM
  ./models/qwen2-vl-2b-q4.gguf`)
- `SYSTEM` sets the system prompt: `SYSTEM You are a helpful assistant
  specialized in data analysis.`
- `TEMPLATE` overrides the chat template: `TEMPLATE {{.Prompt}}` — uses Go
  template syntax compatible with llama.cpp
- `PARAMETER` sets inference parameters: `PARAMETER temperature 0.7`,
  `PARAMETER top_p 0.9`, `PARAMETER max_tokens 4096`

When `api-oss model modelfile-apply --file my_model.modelfile` is run, the
module validates the modelfile (checking that the base model exists, parameters
are in range, template is valid Go template syntax), then creates a model
entry in the local registry under `./data/models/registry/` with a manifest
JSON that embeds all directives, the base model path, and a SHA-256 hash of
the modelfile content.
The manifest is signed with the operator's Ed25519 key and committed to the
ledger, providing tamper-evident provenance for every model configuration.

When inference is requested for a modelfile-built model, the gateway loads the
base model, applies the system prompt, merges the parameters into the
inference context, and uses the custom template for chat formatting.
Modelfiles support `FROM` chaining: a modelfile can reference another
registered model by name, enabling composition of pre-configured models.

The 87 CLI commands include `model modelfile-create`, `model modelfile-apply`,
`model modelfile-list`, `model modelfile-show`, `model modelfile-validate`,
and `model modelfile-export`.
The HTTP UI on port 8081 includes a modelfile editor with syntax highlighting
and a "Build" button that triggers `modelfile-apply` via the backend.

## How to Operate
1. Create a modelfile `my_assistant.modelfile`:
   ```
   FROM ./models/qwen2-vl-2b-q4.gguf
   NAME my_assistant
   SYSTEM You are a concise, accurate assistant for technical queries.
   PARAMETER temperature 0.3
   PARAMETER top_p 0.9
   PARAMETER max_tokens 2048
   ```
2. Validate: `api-oss model modelfile-validate --file my_assistant.modelfile`.
3. Apply: `api-oss model modelfile-apply --file my_assistant.modelfile`.
4. Run: `api-oss model run my_assistant --prompt "What is 2+2?"`.
5. List: `api-oss model modelfile-list`.
6. Show: `api-oss model modelfile-show --name my_assistant`.
7. Use FROM chaining:
   ```
   FROM my_assistant
   NAME my_assistant_v2
   PARAMETER temperature 0.5
   ```

## The Moat
- Fully open format with user-defined directives — no proprietary schema
- Modelfiles are plain text — diff cleanly in git
- Reproducible model configurations — same modelfile + base = same behavior
- Fully local with no dependency on Ollama's closed format
- FROM chaining enables composition without duplication
- Template override enables custom chat formats

## Why Choose API-OSS
Ollama's modelfile format is closed, undocumented, and tied to Ollama's
infrastructure.
API-OSS modelfiles are plain text with a fully documented, open specification.
Every directive serves a clear purpose.
Modelfiles can be version-controlled, reviewed in code review, and shared as
standalone configuration files.

## Competitive Comparison
- **Ollama**: Modelfile is a closed, undocumented format tied to proprietary
  infrastructure.
- **OpenAI**: No modelfile system. Configuration via API parameters.
- **Anthropic**: No modelfile system.
- **Nvidia**: No modelfile system in NeMo.
- **Palantir**: No modelfile system.

## Cost-Benefit Analysis
Building a modelfile system with parser, validator, registry, and CLI in-house
costs ~$40K in engineering time ($160K at $200/hr fully loaded).
Ollama's closed format creates vendor lock-in — migrating away from Ollama
costs ~$20K in reconfiguration and retraining for a team of 5.
Manual configuration per experiment (setting system prompt, temperature, top_p,
max_tokens via CLI flags each time) costs 30 minutes per run — with modelfiles,
it's a single `api-oss model run my_assistant`. Over 500 experiments/year for
a team of 5 ML engineers, that's 250 hours saved — ~$37,500/year at $150/hr
loaded cost.
Modelfiles are plain text and diff cleanly in git code review, replacing ad-hoc
documentation of experiment parameters. Every experiment's full configuration
is version-controlled alongside code, eliminating the "which parameters did I
use?" problem that costs 15 minutes per experiment retrieval.

## Applications
- **Consumer**: Version-control personal model configurations.
- **Government / Defense**: Reproduce exact model configurations across
  air-gapped deployments.
- **Enterprise**: Standardize model configuration across teams with reviewable
  modelfiles.

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
