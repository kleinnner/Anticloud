<!--
  ▄▄   ▄▄▄                      ▄▄                        ▄▄                     
  ██  ██▀                       ██                        ██                     
  ▄▄▄█  ██▄██      ▄█████▄  ████████  ██ ▄██▀    ▄█████▄   ▄███▄██   ▄████▄   █▄▄▄     
  ▄▄█▀▀▀    █████      ▀ ▄▄▄██      ▄█▀   ██▄██      ▀ ▄▄▄██  ██▀  ▀██  ██▄▄▄▄██    ▀▀▀█▄▄ 
  ▀▀█▄▄▄    ██  ██▄   ▄██▀▀▀██    ▄█▀     ██▀██▄    ▄██▀▀▀██  ██    ██  ██▀▀▀▀▀▀    ▄▄▄█▀▀ 
      ▀▀▀█  ██   ██▄  ██▄▄▄███  ▄██▄▄▄▄▄  ██  ▀█▄   ██▄▄▄███  ▀██▄▄███  ▀██▄▄▄▄█  █▀▀▀     
           ▀▀    ▀▀   ▀▀▀▀ ▀▀  ▀▀▀▀▀▀▀▀  ▀▀   ▀▀▀   ▀▀▀▀ ▀▀    ▀▀▀ ▀▀    ▀▀▀▀▀
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# RICE Scoring Model — Kazkade Feature Prioritization

## Methodology

Every feature candidate is scored on four dimensions:

| Dimension | Definition | Scale |
|-----------|------------|-------|
| **Reach** | How many users will this feature affect in a given time period? | 1–10 (quarterly active users) |
| **Impact** | How much value does it provide per user? | 0.25× (minimal), 0.5× (low), 1× (medium), 2× (high), 3× (massive) |
| **Confidence** | How sure are we about Reach and Impact estimates? | 20% (wild guess), 50% (medium), 80% (high), 100% (proven) |
| **Effort** | How many engineering weeks will this require? | Number of weeks (including design, implementation, testing, docs) |

**RICE Score = (Reach × Impact × Confidence) / Effort**

Higher is better. A score of 1.0 means the feature delivers roughly one user-impact-unit per engineering week.

## Current Feature Scores

### P0 — Ship This Quarter

| Feature | Reach | Impact | Confidence | Effort (wks) | RICE Score | Rationale |
|---------|-------|--------|------------|---------------|------------|-----------|
| `.aioss` ledger MVP | 10 | 3× | 100% | 6 | 5.00 | Core differentiator; trust is the product |
| Single-binary distribution | 10 | 2× | 100% | 3 | 6.67 | Prerequisite for every other feature |
| `kazkade benchmark` harness | 8 | 2× | 100% | 4 | 4.00 | Required for verification to be meaningful |
| Cross-platform (Win/Mac/Linux) | 9 | 2× | 80% | 6 | 2.40 | Blocks majority of ICP adoption |

### P1 — Next Quarter

| Feature | Reach | Impact | Confidence | Effort (wks) | RICE Score | Rationale |
|---------|-------|--------|------------|---------------|------------|-----------|
| Dashboard (live FPS/memory) | 7 | 2× | 80% | 5 | 2.24 | Magic moment accelerator for interactive use cases |
| Zero-copy buffer API | 6 | 3× | 80% | 8 | 1.80 | Highest per-user impact but scoped to compute-heavy users |
| `kazkade verify` command | 9 | 2× | 80% | 3 | 4.80 | Ships alongside ledger MVP; minimal incremental effort |
| Automated CI integration | 8 | 1.5× | 80% | 4 | 2.40 | Captures leads from CI/CD pipeline |

### P2 — Backlog

| Feature | Reach | Impact | Confidence | Effort (wks) | RICE Score | Rationale |
|---------|-------|--------|------------|---------------|------------|-----------|
| Plugin SDK / FFI | 5 | 2× | 50% | 12 | 0.42 | High potential but unvalidated; needs more customer research |
| Web dashboard (hosted) | 6 | 1.5× | 50% | 8 | 0.56 | Local dashboard must prove value first |
| Multi-machine benchmark federation | 4 | 3× | 50% | 16 | 0.38 | High effort; wait for enterprise demand |
| `.aioss` standardization proposal | 5 | 2× | 30% | 10 | 0.30 | Long play; no immediate user value |
| WASM polyfill for legacy runtimes | 3 | 1× | 20% | 8 | 0.08 | Low reach, low confidence |

## How Scores Are Determined

### Reach Scoring Guidelines

| Score | Definition |
|-------|------------|
| 1–2 | Niche feature used by <5% of users |
| 3–4 | Used by 5–15% of users |
| 5–6 | Used by 15–30% of users |
| 7–8 | Used by 30–60% of users |
| 9–10 | Used by >60% of users |

### Impact Multiplier Guidelines

| Factor | Definition |
|--------|------------|
| 0.25× | "Nice to have" — marginal improvement |
| 0.5× | "Slightly better" — measurable but small |
| 1× | "Expected" — baseline value |
| 2× | "Significantly better" — clear user-facing improvement |
| 3× | "Transformative" — changes how users work |

### Confidence Tiers

| Level | Definition | Basis |
|-------|------------|-------|
| 20% | Gut feeling | No user research |
| 50% | Informed estimate | Limited user interviews or analogous features |
| 80% | Strong signal | User testing, surveys, or analogous shipping history |
| 100% | Proven | Already shipped internal version; data exists |

## Prioritization Rationale

### Why Single-Binary Ships First (RICE: 6.67)

Everything depends on the binary existing and being trivially downloadable. Without this, there is no product. Max reach (all users), high impact (no install friction), proven (100% confidence — we already have it working), low effort (3 weeks of polish). This is the highest-ROI thing we can do.

### Why `.aioss` Ledger Ships Immediately (RICE: 5.00)

The `.aioss` ledger is the single reason a user picks Kazkade over `hyperfine`, `benchmark.js`, or any other benchmark tool. Without it, we're a faster benchmark runner. With it, we're a trust platform. High reach (all users need trust), transformative impact (3× — it changes the benchmark game), proven (100% — we've demonstrated the prototype).

### Why Plugin SDK Is P2 (RICE: 0.42)

The plugin SDK would let third-party runtimes embed Kazkade verification. This is a powerful ecosystem play but requires deep API design, documentation, and maintenance. We have low confidence (50%) that enough third parties will adopt it in the next 6 months to justify the 12-week effort. Better to nail the core experience first, then add extensibility.

## Score Re-evaluation Cadence

| Review | Frequency | Trigger |
|--------|-----------|---------|
| Weekly triage | Every Monday | New feature requests, bug reports |
| Quarterly deep-dive | Every quarter | Re-score all P0-P2 features based on new data |
| Event-driven | As needed | Customer win/loss, competitor moves, market shifts |

Scores are never static. As we ship features and gather usage data, confidence increases and reach estimates become more precise. A feature stuck at P2 today may jump to P1 next quarter if a major customer requests it.

## Escalation Path

If a feature is down-prioritized but a customer requires it for close:
1. BDR/CS documents the request with RICE scoring overlay
2. Leadership reviews: does this change our quarterly RICE?
3. If yes, re-prioritize and communicate timeline
4. If no, offer workaround or professional services engagement

This prevents RICE from becoming a bureaucracy. It exists to focus the team, not gatekeep customer needs.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
