---
title: "Rules Engine"
sidebar_position: 99
description: "Custom rules evaluated against every graph mutation and AI output."
tags: [features]
---

# Rules Engine

## What It Does
Custom rules evaluated against every graph mutation and AI output.
Rules can block, warn, or trigger actions based on configurable
conditions — from simple
field checks ("price must be positive") to complex multi-node patterns
("no decision
combining data from codex A and codex B without approval").
## How It Works
The rules engine is implemented in the Rust module
`ai-oss-gateway/src/rules.rs`.
Rules are defined using a declarative DSL that compiles to a directed
acyclic graph (DAG)
of evaluation nodes.
Each rule has: a name, description, conditions (one or more boolean
expressions evaluated
against graph nodes, edges, and attributes), severity (suggestion,
warning, block), and
actions (block mutation, emit warning, trigger webhook, log violation,
notify SIEM,
trigger incident).
When a graph mutation is submitted, the DAG compiler determines which
rules depend on the
affected node types — only those rules are re-evaluated (incremental
evaluation).
This makes real-time rule enforcement feasible even with hundreds of
active rules.
The evaluation runs in the Rust mutation pipeline before the mutation is
committed to
`data/graph.db` (SQLite WAL).
If any rule evaluates to block, the mutation is rejected and the engine
returns a detailed
violation report — which rule fired, which condition was violated, and
which
node/attribute was involved.
Rules can also be evaluated against AI outputs — before a council
decision is returned
via WebSocket to port 3030, every enabled rule is checked against the
decision content.
Rules are managed via WebSocket messages: `rule_create` (define new rule
with DSL
conditions), `rule_list` (list all rules with status), `rule_toggle`
(enable/disable),
`rule_update` (modify conditions), `rule_delete`, and `rule_run_all`
(trigger full
re-evaluation of all data against a rule — useful for auditing after
rule changes).
The HTTP UI on port 8081 renders the `RulesView` with a visual rule
editor, violation
browser, and test harness for evaluating rules against sample data
before deployment.
The CLI (`api-oss rule list`, `api-oss rule create`, `api-oss rule
violations`) provides
terminal management, one of 87 CLI commands across 9 subcommand groups
(auth, service,
sync, backup, etc.).
Configuration is driven by `opencode.json`.
The gateway runs as a single binary via `api-oss start`, fully
air-gapped.
All rule evaluations (pass and fail) are recorded in the immutable
ledger at
`data/ledger/` in `.aioss` format.
## How to Operate
1.
**Create a rule**: Open the `RulesView` at `https://localhost:8081/rules` and use the visual editor or the DSL.
Example: `block if node.type == "expense" && node.amount > 100000 &&
user.role != "cfo"`.
2.
**Test the rule**: Use the test harness to evaluate the rule against sample data.
The engine shows whether the rule would pass, warn, or block.
3.
**Enable the rule**: Toggle the rule to active.
It immediately begins evaluating all new mutations and decisions.
4.
**Review violations**: The violation browser shows all triggered violations with full context — which mutation, which user, which rule, timestamp.
5.
**Configure actions**: Set the rule to "trigger webhook" and configure the webhook URL in `opencode.json`.
When the rule fires, a JSON payload is sent to the webhook.
6.
**Audit**: `api-oss rule violations --rule "expense-limit" --since 2025-01-01` lists all violations for a specific rule.
7.
**Run full re-evaluation**: After changing a rule, run `api-oss rule run-all --rule "expense-limit"` to check all existing data against the updated rule.
## The Moat
- **Incremental DAG evaluation**: Rules are compiled to a DAG and only affected rules re-evaluate on each mutation.
Hundreds of rules can be active with no performance degradation.
- **Pre-commit enforcement**: Rules run in the mutation pipeline before the change is committed to `data/graph.db`.
Blocking rules guarantee that violating mutations never reach the
database.
- **Dual evaluation scope**: Rules evaluate both graph mutations (data input) and AI outputs (decision output) — covering the complete data lifecycle.
- **Declarative DSL with compiler**: The DSL compiles to optimized evaluation nodes.
No scripting, no arbitrary code execution in rules — preventing
injection attacks.
- **Deep system integration**: Rules can access any system state — user role, org membership, codex classification, graph relationships — because the engine runs in the same binary as the auth, ABAC, and graph modules.
- **Air-gapped enforcement**: All rule evaluation is local.
No cloud dependency for rule execution.
## Why Choose API-OSS
OpenAI provides no custom rules engine — users cannot define policies
that govern AI
behavior.
Palantir Gotham offers rules but as a separate product tier with
significant licensing
costs.
Snowflake's rules via Snowpipe are batch-only with multi-minute latency.
API-OSS provides a real-time, incremental rules engine as a built-in
feature of the single
binary at zero additional cost.
For enterprises that need to enforce business logic on AI operations —
expense approval
limits, data classification rules, compliance checks — API-OSS
delivers sub-second rule
enforcement out of the box.
## Competitive Comparison
- **OpenAI**: No custom rules engine — users cannot define policies or constraints on AI behavior.
- **Palantir**: Rules via Gotham, separate product tier with independent licensing.
Requires cloud deployment.
- **Snowflake**: Rules via Snowpipe, batch-only with 1-3 minute minimum latency.
No support for AI output evaluation.
- **Anthropic**: No rules engine.
## Cost-Benefit Analysis
A business rules engine (Drools, IBM ODM) costs $50k-$200k/year in
licensing plus
infrastructure.
Building custom rule evaluation infrastructure costs 3-6 months of
engineering.
Palantir Gotham rules require a separate product contract
($100k-$500k+/year).
API-OSS provides a complete, real-time rules engine at zero additional
cost.
Time savings: 3-6 months of development eliminated.
Risk reduction: pre-commit enforcement prevents data integrity
violations and compliance
breaches before they reach the database — a blocking rule for "expense
> $100K without
CFO approval" prevents unauthorized expenditures from being recorded at
all.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Classified data handling rules — "block any graph node whose content contains a classified codeword from being created outside a TOP SECRET codex." Rules run before the data is committed, preventing accidental classification violations.
- **Enterprise**: Business logic enforcement — "never approve an expense report > $100K without CFO review" (blocks the mutation), "flag any decision involving personally identifiable information" (warns the operator), "notify compliance when more than 10 expense reports are created in one hour" (triggers webhook to GRC system).

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
