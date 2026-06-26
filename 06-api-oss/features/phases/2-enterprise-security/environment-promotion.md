---
title: "Environment Promotion"
sidebar_position: 99
description: "Codex and configuration promotion through Dev → Staging → Production"
tags: [features]
---

# Environment Promotion

## What It Does
Codex and configuration promotion through Dev → Staging → Production
pipelines with
automated quality gates.
Every promotion runs validation checks — rule evaluation, constitution
compliance,
performance benchmarks, security scans — before allowing the promotion to
proceed.
## How It Works
Environment promotion is implemented as a first-class state machine in
`ai-oss-gateway/src/promotion.rs`.
The system supports an arbitrary number of named environments (Dev,
Staging, Production,
QA, etc.) configured in `opencode.json`.
Each environment has its own copy of codices, rules, constitution
principles, secrets, and
configuration — stored in `data/graph.db` (SQLite WAL) with
environment-scoped tables.
When an operator initiates a promotion via `env_promote` over WebSocket to
port 3030, the
Rust engine snapshots the source environment's state and begins evaluating
quality gates.
Each gate is a Rust function that checks a specific condition: rule
violations must be
zero (queries the rules engine for any active violations in the source
environment),
constitution compliance must pass (runs the constitution evaluation engine
against all
pending changes), performance benchmarks must be within thresholds
(measures inference
latency of the Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA against the
environment's
data), security scan must pass (triggers the SBOM vulnerability scanner and
DLP checks),
and SBOM diff must show no critical new vulnerabilities.
Gates are evaluated atomically — if any gate fails, the promotion is
rejected and the
engine produces a detailed failure report with specific violations and
line-number-level
details.
Approved promotions are recorded in the immutable ledger at `data/ledger/`
in `.aioss`
format.
The promotion supports rollback — `env_rollback` restores the target
environment to its
previous state from a copy stored in SQLite.
The frontend at `https://localhost:8081/environments` renders an
`EnvironmentView` with
visual promotion pipeline, diff views, and gate status.
The CLI (`api-oss env create`, `api-oss env promote`, `api-oss env
rollback`, `api-oss env
diff`) provides terminal access as part of 87 CLI commands across 9
subcommand groups
(auth, service, sync, backup, etc.).
The gateway runs as a single binary via `api-oss start`, fully air-gapped
with no Docker
required (optional container support available).
## How to Operate
1.
**Create environments**: `api-oss env create --name staging --from dev` or via the frontend at `https://localhost:8081/environments`.
2.
**Make changes in Dev**: Edit codices, rules, constitution principles in the development environment.
3.
**Initiate promotion**: Click "Promote to Staging" in the UI or send `{"type": "env_promote", "source": "dev", "target": "staging"}` over WebSocket to port 3030.
4.
**Review gate results**: The promotion pane shows each gate's status (pass/fail) with detailed reports.
Failed gates include specific violations — e.g., "Rule R42 has 3 active
violations in
Dev" or "SBOM shows 2 critical CVEs in dependency X."
5.
**Approve or reject**: If gates pass, confirm the promotion.
If gates fail, the promotion is blocked automatically — fix the issues
and retry.
6.
**Verify production**: After promotion to Production, use `api-oss env diff --env1 staging --env2 production` to verify the expected changes were applied.
7.
**Rollback if needed**: `api-oss env rollback --env production` restores the previous state from the SQLite backup.
8.
**Audit**: Check `data/ledger/` for `.aioss` entries recording every promotion attempt, gate result, and approval decision.
## The Moat
- **First-class promotion engine, not a CI/CD script**: Promotion is a stateful operation in the Rust engine with atomic gate evaluation.
There is no external CI/CD pipeline to configure, no YAML files to write,
no Jenkins jobs
to maintain.
- **Atomic gates**: All gates are evaluated before any change is applied.
If any gate fails, the promotion is rejected and the target environment is
untouched —
no partial updates, no inconsistent state.
- **Automated rollback**: Every promotion creates a pre-promotion snapshot in SQLite.
Rollback is instantaneous — the engine restores the previous state from
the snapshot.
- **Deep integration with all systems**: Gates check the rules engine, constitution, SBOM scanner, DLP engine, and model benchmarks — all running in the same Rust binary.
No external tool integration required.
- **Full audit trail**: Every promotion attempt — success or failure — is recorded in `data/ledger/` with cryptographic proof.
Auditors can verify the complete promotion history.
## Why Choose API-OSS
Palantir requires manual promotion processes with no automated quality
gates.
OpenAI offers a single environment with no promotion capability — changes
go directly to
production.
Snowflake's environment management requires separate accounts and CI/CD
tooling.
API-OSS provides a complete promotion pipeline with built-in quality gates
as a feature of
the single binary.
For enterprises that need staged AI configuration rollout with compliance
verification —
from development through staging to production — API-OSS delivers
infrastructure that
competitors cannot match.
## Competitive Comparison
- **Palantir**: Manual promotion process, no automated quality gates.
Promotions require Palantir consulting engagement for each deployment.
- **OpenAI**: No environment promotion — single environment, changes affect all users immediately.
- **Snowflake**: Environment management via separate accounts and CI/CD pipelines — not embedded in the platform.
## Cost-Benefit Analysis
A proper promotion pipeline with CI/CD requires: Jenkins/GitLab CI
($500-$2,000/month),
automated testing infrastructure, quality gate tooling, and 2-4 months of
engineering to
configure.
Palantir's consulting-led promotion process adds $50k-$200k per deployment
cycle.
API-OSS provides a complete promotion engine with built-in quality gates at
zero
additional cost.
Time savings: 2-4 months of CI/CD setup eliminated.
Risk reduction: failed promotions are caught before they affect production
— preventing
the most common cause of AI system incidents (misconfigured production
deployments).
## Applications
- **Consumer**: N/A
- **Government / Defense**: Staged deployment for classified AI systems with audit trail — new detection rules are tested in a staging environment with simulated data before being promoted to the operational classified system.
- **Enterprise**: Controlled AI configuration rollout with compliance verification — changes that affect SOX or GDPR compliance posture must pass the compliance gate before reaching production.

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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