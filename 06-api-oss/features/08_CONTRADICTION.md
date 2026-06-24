---
title: "AI-OSS Contradiction Detection Engine: Catching Conflicts Before They Become Problems"
sidebar_position: 99
description: "The contradiction engine is the single most important feature that separates AI-OSS from every other AI tool. It continuously scans the knowledge graph for conflicting statements, stances, and evidenc"
tags: [features]
---

# AI-OSS Contradiction Detection Engine: Catching Conflicts Before They Become Problems

The contradiction engine is the single most important feature that separates AI-OSS from every other AI tool. It continuously scans the knowledge graph for conflicting statements, stances, and evidence — and surfaces them so you can resolve them before they cause real-world damage.

> "Two lawyers review the same contract. One says 'This clause is enforceable.' The other says 'This clause violates EU law.' AI-OSS detects the contradiction and flags it. You resolve it before the deal closes. Without AI-OSS, you find out in court."

## Why This Matters

Real-world disasters caused by undetected contradictions:
- Autopilot: "stay in lane" vs "avoid obstacles" when obstacle is in lane → fatal crash
- Drug interaction: "take with food" vs "take on empty stomach" → patient injury, $2B lawsuit
- Contract: "liability capped at $5M" vs "unlimited liability for breach" → litigation

## How It Works

The contradiction engine has three layers:

### Layer 1: Stance-Based Contradiction

Two Entity nodes have opposing stances on the same Concept node.

```
Sarah Jenkins (Entity, stance: "Pro") on "Remove_Liability_Cap"
Legal Analyst (Entity, stance: "Con") on "Remove_Liability_Cap"
→ CONTRADICTS edge created
→ Severity: medium (people disagreeing is normal)
```

**Detection:**
```sql
SELECT n1, n2 FROM nodes n1, nodes n2
WHERE n1.node_type = 'Entity'
  AND n2.node_type = 'Entity'
  AND n1.stance = 'Pro' AND n2.stance = 'Con'
  AND EXISTS (
    SELECT 1 FROM edges
    WHERE (source = n1.id AND target = n2.id)
      AND edge_type = 'REFERENCES' AND target = 'uuid_concept_X'
  )
```

### Layer 2: Semantic Contradiction

The AI model detects semantic contradictions between two pieces of content.

```
Node A: "Liability is capped at $5M per incident."
Node B: "Confidentiality breach carries unlimited liability."
→ LLM evaluates: Do these contradict? → YES → CONTRADICTS edge
```

**Detection pipeline:**
1. Candidate selection: Concept nodes sharing edges to the same parent
2. LLM prompt: "Do these statements contradict? YES/NO/UNCERTAIN"
3. If YES → create CONTRADICTS edge with confidence
4. If UNCERTAIN → create MAYBE_CONTRADICTS edge (low weight)

### Layer 3: Inferred Contradiction

Uses graph traversal to find indirect contradictions through chains of relationships.

```
Node_A (Sarah Jenkins) → SUPPORTS → Node_C (Remove Cap)
Node_B (EU Directive) → REQUIRES → Node_D (Keep Cap)
Node_C → CONTRADICTS → Node_D (direct)
→ Inferred: Sarah Jenkins contradicts EU Directive 2009
```

**Algorithm:**
```python
def find_inferred_contradictions(graph, depth=3):
    for each node in graph.nodes:
        for each path in bfs(node, max_depth=depth):
            if path_contains_contradiction(path):
                contradictions.append({...})
```

## Contradiction Edge Types

| Edge Type | Meaning | Weight |
|-----------|---------|--------|
| CONTRADICTS | Direct contradiction | 1.0 |
| MAYBE_CONTRADICTS | Possible contradiction (LLM uncertain) | 0.5 |
| WEAKLY_CONTRADICTS | Minor disagreement | 0.3 |
| INCOMPATIBLE_WITH | Logically incompatible | 0.9 |
| OVERRIDES | One explicitly overrides the other | 0.8 |

## Severity Classification

Calculated from three factors:
- Edge weight (0.3–1.0) × 0.4
- Node importance (degree centrality) × 0.3
- Proximity to active decisions × 0.3

| Score | Label | Action |
|-------|-------|--------|
| 0.0–0.3 | LOW | Info-only, no alert |
| 0.3–0.7 | MEDIUM | Shown in dashboard |
| 0.7–1.0 | HIGH | Alert user, block decisions |

## Contradiction Record

Stored in graph as Contradiction node + CONTRADICTS edge + .aioss ledger entry.

```json
{
  "id": "uuid_contra_001",
  "node_type": "Contradiction",
  "label": "Liability cap vs Unlimited confidentiality",
  "severity": 0.82,
  "resolved": false,
  "detected_at": "2026-05-07T14:32:00Z",
  "detected_by": "semantic_engine_v1",
  "confidence": 0.91
}
```

## Resolution Workflow

1. **DETECT** — Engine finds contradiction → creates node + edge
2. **NOTIFY** — If severity > 0.7 → push notification; > 0.3 → dashboard tab
3. **REVIEW** — User opens detail panel showing both sides + evidence
4. **RESOLVE** — User can:
   - DISMISS (false positive)
   - OVERRIDE_A / OVERRIDE_B (one is correct)
   - AMEND (create resolution node)
   - ESCALATE (flag for human legal review)
5. **RECORD** — Resolution in graph + ledger
6. **LEARN** — Resolution feeds back to reduce false positives

## Configuration

```json
{
  "contradiction_engine": {
    "enabled": true,
    "scan_interval_ms": 60000,
    "layers": { "stance": true, "semantic": true, "inferred": true },
    "inferred_depth": 3,
    "severity_thresholds": { "low": 0.3, "medium": 0.7, "high": 1.0 },
    "alert_channels": ["ui", "notification"],
    "max_candidates_per_scan": 100,
    "llm_for_semantic": "qwen2.5-7b-instruct-q4_k_m"
  }
}
```

## See Also

Related features, architecture, and roadmap documentation.

- [Features Overview](../features/README.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [API Reference](../api-reference/01-overview.md)
- [Roadmap](../roadmap/01-product-vision.md)
