---
title: "Decision Tree / Provenance"
sidebar_position: 99
description: "Provides full decision provenance from input to output — every"
tags: [features]
---

# Decision Tree / Provenance

## What It Does
Provides full decision provenance from input to output — every
council vote,
tool call, graph mutation, and reasoning step is tracked and
visualizable as
a decision tree. Every decision is fully auditable with complete
context.
The system records not just what was decided, but why and how.

## How It Works
The provenance tracking engine in `ai-oss-gateway/src/provenance.rs`
instruments every decision-making pathway in the system. When a
decision
request enters the council, the provenance engine creates a root
decision
node in the SQLite WAL-backed graph. Each sub-step — individual
council
member votes, tool invocations, graph queries, model inferences from
the
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model on CUDA — is recorded as
a child
node with timestamps, inputs, outputs, and confidence scores. The
decision
tree builder constructs a directed acyclic graph (DAG) of causality
from
these nodes, enabling analysts to trace any decision back to its
root data,
reasoning steps, and voting breakdown. The DecisionTreeView renders
this as
an interactive tree visualization on the HTTP UI at port 8081. Each
node is
clickable for full detail — showing the exact graph state at
decision time
(via Timescape), the tools invoked, the data retrieved, and the
votes cast.
Timescape time-travel queries enable replaying the exact graph
context at
each decision step. The provenance graph itself is
version-controlled,
enabling diff between decision paths. Frontend connects via
WebSocket to
port 3030. Config is driven by `opencode.json`. All data is stored
in
`./data/`.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the DecisionTreeView in the browser at port 8081
3. Browse recent decisions from the activity feed or search for specific
   decisions via DecisionSearch
4. Click any decision to expand its full provenance tree
5. Navigate the tree: expand council votes, tool calls, graph queries, model
   inference details
6. Click individual provenance nodes to view exact graph state at that
   moment (Timescape)
7. Compare decision paths using graph diff between related decisions
8. Export decision provenance as a graph snapshot or PDF audit report
9. Use the CLI: `api-oss provenance get`, `api-oss provenance tree`,
   `api-oss provenance export`

## The Moat
- Complete provenance tracking at the graph level is extremely hard because
  every operation must be captured without performance degradation
- Most AI systems provide black-box outputs; API-OSS provides a white-box
  audit trail for every decision
- The provenance graph is itself a live, queryable subgraph — analysts can
  run link analysis on decision patterns
- Timescape integration means every provenance node captures the exact graph
  state at decision time
- Decision tree visualization enables intuitive navigation of complex
  multi-step decisions
- No competitor offers per-decision provenance at this level of granularity
  and transparency

## Why Choose API-OSS
Palantir AIP has some provenance tracking but not full graph-level
capture
with Timescape state snapshots. Google and Anthropic offer no
decision
provenance product. API-OSS provides complete, auditable provenance
for
every system decision — from the initial query through council
deliberation,
tool calls, model inference, and final graph mutation. For defense
and
regulated enterprise customers, this level of transparency is
essential for
accountability, compliance, and post-mission analysis.

## Competitive Comparison
- **Palantir**: AIP has some provenance but not full graph-level tracking;
  black-box model outputs
- **Google**: No equivalent product
- **Anthropic**: No decision provenance product
- **Nvidia**: No decision provenance product

## Cost-Benefit Analysis
Building custom decision provenance tracking costs $500K–$2M in
development
plus ongoing maintenance. Regulatory compliance for AI-driven
decisions (EU
AI Act, DOD AI Ethics) requires provenance capabilities —
non-compliance
fines can exceed $20M. API-OSS provides complete provenance out of
the box
at zero software cost — one-time hardware of ~$3,000. A defense
organization
deploying AI-assisted C2 saves $500K–$2M in custom development
while
ensuring compliance with DOD AI ethical principles. Time savings:
manual
audit of a single multi-step decision takes 4–8 hours; API-OSS
provides
complete provenance in seconds.

## Applications
- **Consumer**: Personal decision audit trail, financial decision tracking
- **Government / Defense**: Accountability for autonomous decisions,
  compliance with DOD AI ethics, post-mission analysis, legal review
- **Enterprise**: Regulatory compliance (EU AI Act, SOX), audit
  requirements, board-level decision documentation, quality
management
