---
title: "Workflow Builder"
sidebar_position: 99
description: "A visual workflow builder with human-in-the-loop approval steps, conditional branching,"
tags: [features]
---

# Workflow Builder

## What It Does
A visual workflow builder with human-in-the-loop approval steps, conditional branching,
parallel execution, timer triggers (cron expressions with timezone support), and webhook
integration. Workflows orchestrate graph operations, model inference (Qwen2.5-VL on CUDA),
pipeline execution, and human decisions — all stored as graph nodes with ledger attestation
for every step. Built on top of the pipeline engine with added control flow and approval
semantics. CLI commands via `api-oss workflow` with WS messages on port 3030.

## How It Works
The Workflow Builder is implemented in `workflow.rs` under `ai-oss-gateway/src/`, built on
the pipeline infrastructure. The frontend `WorkflowBuilderView` (served on HTTP UI at port
8081) provides a visual editor with node types: Start/Trigger (cron schedule, webhook, graph
mutation event, manual), Action (graph query/add/delete, model infer, pipeline run, bridge
send, connector sync), Condition (if/else based on graph query results or Rhai/WASM
expressions), Approval (human-in-the-loop — creates a ledger entry requiring a Passaporte
signature from an authorized approver), Parallel (fan-out to multiple branches with barrier
synchronization), Timer (delay, wait-for-time, timeout with configurable duration), and End
(success, failure, notification via bridge). The workflow DAG is saved as a graph meta-node
with label `Workflow`, containing the node-edge topology as structured properties, with
versioning and rollback support. The workflow execution engine uses tokio tasks: each node
is a tokio task, edges create tokio channels between nodes. Approval nodes pause execution
and create a ledger entry of type `WorkflowApproval` containing: workflow ID, node ID, input
data hash, requesting user's Passaporte, and a list of authorized approver Passaporte IDs.
An authorized approver responds via WS message `workflow_approval_respond` with
`{approved: true/false, comment: "..."}` — the response is signed by the approver's
Passaporte and recorded in the ledger for non-repudiation. Condition nodes evaluate a graph
query or expression — if results exist/expression is truthy, the "true" branch is taken.
Parallel nodes execute all branches concurrently and wait for all to complete (barrier).
Timer nodes support cron expressions with timezone (using the `cron` crate), and delays.
Workflows can be triggered manually (WS `workflow_trigger`), on a schedule (cron), on graph
mutations (event trigger), or via webhook. Each execution creates a ledger entry recording
start time, end time, each node execution with input/output hashes, approval responses, and
final status (completed, failed, cancelled). The workflow engine supports up to 50 concurrent
executions with configurable max_nodes per workflow (default 50) and max_execution_time
(default 1 hour). Workflow triggers include cron expressions with full timezone support,
graph mutation events, webhook POSTs, and manual invocation via the WS `workflow_trigger`
message or CLI `api-oss workflow run --id <workflow-id>`.

## How to Operate
1. Start the gateway: `api-oss start`. Open Workflow Builder at `http://localhost:8081/workflows`.
2. Create a new workflow: click "New Workflow", give it a name and description.
3. Add a trigger: drag "Schedule" trigger, configure a cron expression (e.g., `0 8 * * 1-5`).
4. Add actions: drag "Graph Query", configure the query. Drag "Model Infer", configure prompt.
5. Add a condition: drag "Condition", write a Rhai expression.
6. Add an approval step: drag "Approval", select authorized approver Passaporte roles.
7. Connect nodes by dragging between ports — DAG validated for cycles.
8. Click "Validate" — checks for cycles, missing parameters, valid cron expressions.
9. Click "Save" — stored as graph node.
10. Click "Enable" — workflow becomes active. Scheduled workflows registered in the cron
    scheduler.
11. For approval: authorized approvers receive notification (in UI or via bridge). Respond
    with approve/reject.
12. Monitor Prometheus on port 9000: `workflow_runs_total`, `workflow_approvals_pending`.
13. Configure defaults in `opencode.json` under `workflow`: `max_execution_time` (1h),
    `max_nodes` (50), `approval_timeout` (24h).
14. View pending approvals: `api-oss workflow list --pending-approval` — shows all workflows
    waiting for your Passaporte approval signature.
15. Bulk approve: `api-oss workflow approve --all` with optional `--comment` flag to approve
    all pending approval steps matching a filter (e.g., `--workflow-id <id>`).

## The Moat
- Competitors separate workflow orchestration (Airflow, Temporal) from AI decision engines
  — requiring complex integrations and data transfer between separate systems.
- By embedding workflow orchestration directly into the graph, workflows become first-class
  citizens — versioned, auditable, and queryable in the same system as the data they operate
  on.
- Human-in-the-loop approval with cryptographic attestation in the ledger is unique —
  approval responses are signed Passaporte entries providing non-repudiation.
- The condition engine uses the same graph query language as the rest of the platform.

## Why Choose API-OSS
A defense agency builds an intelligence analysis workflow: when a report is ingested
(trigger), analyze with local AI (action), route by classification (condition), wait for
analyst approval (approval), publish to shared graph (action) — all in one system, fully
offline, with cryptographic audit. An enterprise automates compliance document review with
human approval steps and ledger-attested decisions.

## Competitive Comparison
- **Palantir**: Workflow features in Foundry but cloud-dependent and proprietary.
- **OpenAI**: No workflow system. Interactive-only.
- **Anthropic**: No workflow system.
- **Temporal**: Workflow engine but no AI integration or cryptographic approval.
- **Apache Airflow**: Code-first DAGs, no visual builder, no AI integration.

## Cost-Benefit Analysis
Temporal Cloud: $20/node/hour ($14,400/node/year). Self-hosted: $500–$2,000/month. Airflow
infrastructure: $200–$1,000/month + Python development per DAG. API-OSS Workflow Builder:
$0. Building one approval workflow with Airflow + custom UI: weeks of development
($10k–$30k). Visual builder creates in hours. Ledger-attested approvals replace audit tools
($5k–$20k/year). Scheduled workflows replace cron infrastructure.

Cloud alternatives for approval workflows: Zapier costs $30–$100/month for 2,000–50,000
tasks but has no AI graph backend, no offline mode, and sends all approval data through
Zapier's cloud. Microsoft Power Automate costs $15–$40/user/month with per-flow run limits
and requires Azure AD. A team of 50 users on Power Automate pays $9,000–$24,000/year with
no local AI processing or ledger attestation. API-OSS Workflow Builder costs $0 with
unlimited workflows, users, and runs. The cryptographic approval ledger (Passaporte-signed
approval responses with non-repudiation) eliminates the need for separate e-signature
services like DocuSign ($10–$40/month per user) or Adobe Sign ($19–$49/month per user) for
approval workflows — saving an additional $6,000–$30,000/year for a team of 50. The
built-in cron scheduling infrastructure replaces external cron job services ($5–$20/month
for cron-job.org or EasyCron premium) and system cron management overhead.

## Applications
- **Consumer**: Automate complex decision chains with human approval.
- **Government / Defense**: Multi-step approval workflows for intelligence actions. Each
  approval step cryptographically attested in the ledger. Fully offline.
- **Enterprise**: Compliance workflows with human approval. Document approval chains with
  automated routing. SLA enforcement with escalation timers.

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
