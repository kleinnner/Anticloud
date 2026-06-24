---
title: "Governance Dashboard"
sidebar_position: 99
description: "Policy compliance overview with violation tracking, explainability, and"
tags: [features]
---

# Governance Dashboard

## What It Does
Policy compliance overview with violation tracking, explainability, and
centralized
visibility into all governance rules, their current status, and historical
compliance
posture.
Provides a single pane of glass for AI system governance with full
provenance for every
violation.
## How It Works
The governance dashboard aggregates data from multiple enforcement points
in the Rust
engine at `ai-oss-gateway/src/governance.rs`.
Governance evaluation is integrated directly into the Rust mutation
pipeline — every
graph change is checked against active policies before commit.
The policies evaluated include: rules engine rules (block/warn conditions),
constitution
principles (constitutional AI checks), ABAC policies (attribute-based
access control), RLS
policies (row-level security), DLP patterns (data loss prevention), and CEP
alerts
(complex event processing).
Violations from any of these systems are recorded as first-class entities
in the event
store with full provenance — the exact mutation or decision that
triggered the
violation, the user involved, the policy that was violated, the timestamp,
and a unique
violation ID linked to the immutable ledger entry.
The dashboard displays a hierarchical policy tree showing each policy
domain (rules,
constitution, access control, DLP, CEP) with the count of active violations
per domain.
Each violation is expandable to show its full context — including the
explainability
trace showing why the policy fired.
The explainability feature traces the violation back through the evaluation
pipeline:
which condition matched, what data triggered it, what the expected value
was, and what the
actual value was.
The HTTP UI on port 8081 renders the `GovernanceView` with the policy tree,
violation feed
(real-time via WebSocket to port 3030), and compliance scorecards showing
pass/fail rates
over configurable time windows.
CLI commands (`api-oss governance query`, `api-oss governance explain
--violation V-001`)
provide terminal access as part of 87 CLI commands across 9 subcommand
groups (auth,
service, sync, backup, etc.).
All violations and governance snapshots are recorded in the immutable
ledger at
`data/ledger/` in `.aioss` format with cryptographic chaining.
Configuration for governance policies and dashboard settings is driven by
`opencode.json`.
The gateway runs as a single binary via `api-oss start`, fully air-gapped.
## How to Operate
1.
**Open the GovernanceView** at `https://localhost:8081/governance` to see the policy tree and current violation feed.
2.
**Review violations**: Click any violation to see its full context — which user, which mutation/decision, which policy, and the explainability trace showing exactly why it fired.
3.
**Filter by severity**: Use the filter controls to show only blocking violations (critical), warnings (high), or informational findings (medium/low).
4.
**Export compliance report**: Click "Export" to generate a governance compliance report for the selected time period — includes all violations with context, pass/fail rates, and trend data.
5.
**Query via WebSocket**: Send `{"type": "governance_query", "time_range": {"from": "2025-01-01", "to": "2025-06-01"}}` to programmatically retrieve governance data.
6.
**Explain a violation**: Send `{"type": "governance_explain", "violation_id": "V-001"}` to receive the full explainability trace.
7.
**Audit**: Check `data/ledger/` for `.aioss` entries recording every governance violation with cryptographic proof.
## The Moat
- **Integrated into the mutation pipeline**: Governance checks run before every graph mutation commits.
Violations are recorded with the mutation — not discovered later in log
analysis.
There is no window where a violating mutation exists without a
corresponding governance
record.
- **Full provenance for every violation**: Each violation links to the exact mutation, the user, the policy, the evaluation trace, and the immutable ledger entry.
Auditors can trace from a violation back to the root cause.
- **Multi-domain aggregation**: Rules, constitution, ABAC, RLS, DLP, and CEP violations are all visible in one dashboard — no switching between systems to understand governance posture.
- **Explainability built in**: The dashboard shows exactly why each policy fired — condition evaluation, expected vs.
actual values, and the rule definition.
No black-box governance decisions.
- **Air-gapped governance**: All governance data is local.
Compliance reports can be generated and shared without data leaving the
deployment.
- **Immutable violation log**: Violations in `data/ledger/` are cryptographically chained — tampering with violation records is immediately detectable.
## Why Choose API-OSS
No AI platform competitor provides a centralized governance dashboard with
violation
tracking, explainability, and multi-domain policy aggregation.
OpenAI has no governance visibility — users cannot see what policies are
enforced or
when they are violated.
Palantir offers governance via AIP as a separate product tier.
Snowflake Horizon provides data governance but not AI governance.
API-OSS provides a comprehensive governance dashboard as a built-in feature
at zero
additional cost — giving compliance teams the visibility they need
without requiring
separate governance tooling.
## Competitive Comparison
- **OpenAI**: No governance dashboard — users have no visibility into policy enforcement or violations.
- **Palantir**: Governance via AIP (Artificial Intelligence Platform), separate product tier requiring additional licensing.
Cloud-dependent.
- **Snowflake**: Governance via Snowflake Horizon, covers data governance only — no AI governance, no violation explainability.
- **Anthropic**: No governance dashboard.
## Cost-Benefit Analysis
Governance, risk, and compliance (GRC) platforms (MetricStream, ServiceNow
GRC, Archer)
cost $50k-$200k/year and require manual data input for AI-specific
controls.
Building a custom governance dashboard requires 4-8 months of development.
API-OSS provides a comprehensive governance dashboard with automated
violation detection
and explainability at zero additional cost.
Time savings: 4-8 months of GRC integration development eliminated.
Risk reduction: centralized governance visibility reduces the mean time to
discover policy
violations from days/weeks to milliseconds — violations appear in the
dashboard as they
happen.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Audit-ready governance for classified AI operations — an inspector general can review the governance dashboard on-site to verify that all policy violations are tracked and remediated, with full provenance from violation to resolution.
- **Enterprise**: Board-level compliance reporting for AI-assisted decision-making — the governance dashboard provides a single view of compliance posture across rules, constitution, access control, and DLP, with exportable reports for audit committee review.