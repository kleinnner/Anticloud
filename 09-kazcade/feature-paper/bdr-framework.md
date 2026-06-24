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

# BDR Framework: From Lead to Handoff

## 1. Ideal Customer Profile (ICP)

### Tier 1 — Core ICP (Highest Priority)

| Attribute | Criteria |
|-----------|----------|
| **Industry** | Game development, real-time simulation, HPC, financial modeling, edge AI |
| **Company size** | 10–500 engineers (teams that feel dependency bloat but can't justify full infra teams) |
| **Current stack** | Node.js, Python, Lua, or WebAssembly for compute-heavy workloads |
| **Pain point** | "Our app is slow and we can't prove why. Benchmarks are questioned by customers." |
| **Budget** | $10k–$100k ARR for runtime licensing; proof-of-concept within 2 weeks |
| **Decision maker** | Lead architect, CTO, or head of developer experience |
| **Trigger events** | Failed audit, performance regression in production, customer churn due to latency |

### Tier 2 — Adjacent ICP

| Attribute | Criteria |
|-----------|----------|
| **Industry** | Blockchain infrastructure, scientific computing, CI/CD tooling |
| **Pain point** | Need verifiable compute for audit/compliance reasons |
| **Budget** | $5k–$50k ARR |

### Tier 3 — Out of Scope

| Attribute | Criteria |
|-----------|----------|
| **Examples** | Static site builders, CRUD apps, CMS platforms |
| **Rationale** | No compute-intensive workloads; zero-copy benefits negligible |

## 2. Lead Scoring Criteria

Each lead is scored 0–100 based on weighted attributes:

| Criterion | Weight | Score Range | Scoring Guide |
|-----------|--------|-------------|---------------|
| ICP fit | 30% | 0–30 | Tier 1 = 30, Tier 2 = 15, Out of scope = 0 |
| Pain intensity | 25% | 0–25 | Active search = 25, aware but not searching = 15, no pain = 0 |
| Authority | 20% | 0–20 | Decision maker = 20, influencer = 10, no access = 0 |
| Timeline | 15% | 0–15 | 0–3 months = 15, 3–6 months = 10, 6+ = 5 |
| Budget | 10% | 0–10 | Budget allocated = 10, planned = 5, none = 0 |

**Tier thresholds**: Hot (>75), Warm (50–75), Cold (<50)

## 3. Outreach Sequence

### Channel: Email + LinkedIn + GitHub

| Touch | Day | Channel | Action | Template Reference |
|-------|-----|---------|--------|-------------------|
| 1 | 1 | LinkedIn | Connect request with personalized note | A |
| 2 | 3 | Email | Problem-aware cold email | B |
| 3 | 7 | GitHub | Comment on relevant issue/PR | C |
| 4 | 14 | Email | Case study or benchmark comparison | D |
| 5 | 21 | LinkedIn | Follow-up with value-add content | E |
| 6 | 30 | Email | Breakup email / final CTA | F |

All touches must include a clear value proposition tied to the prospect's specific stack. No generic "let's connect" messages.

### Template A — LinkedIn Connection

```
Hi [Name] — I saw your work on [specific project/tech]. We built Kazkade to solve the
"[pain point specific to their stack]" problem without adding dependency bloat.
Would love to connect and share what we're doing.
```

### Template B — Cold Email (Subject Line)

```
[Their Stack] benchmark trust issue? Kazkade fixes it in one binary
```

### Template C — GitHub Engagement

Engage with their open-source projects. Comment constructively on performance-related issues. Only mention Kazkade if directly relevant.

### Template D — Case Study Email

```
Subject: How [similar company] cut latency 60% with Kazkade

Body: [2-sentence context] → [Link to full case study] → [1-sentence CTA for a call]
```

### Template E — LinkedIn Content Share

Share a Kazkade technical blog post with a personal note: "Thought this might be relevant to your work on [their project]."

### Template F — Breakup Email

```
Subject: Closing the loop

Body: We haven't heard back, so we'll stop reaching out. If your priorities change,
our GitHub is always open. Here's a direct link to try Kazkade in 2 minutes: [link]
```

## 4. Discovery Call Questions

### Technical Qualification (15 min)

1. "Walk me through your current compute pipeline. Where does the bottleneck live?"
2. "How do you benchmark performance today? How do you *prove* those results to stakeholders?"
3. "What's your current runtime stack, and what would make you switch?"
4. "How much engineering time goes into dependency management and environment setup?"
5. "Have you ever had a performance regression make it to production? How was it detected?"

### Business Qualification (10 min)

6. "What would a 2x improvement in compute throughput mean for your business?"
7. "How much does an hour of unplanned debugging cost your team?"
8. "Who else needs to sign off on a new runtime evaluation?"
9. "What's your timeline for making a decision?"

### Red Flags

- "We don't care about benchmark verification" (trust isn't a need)
- "We use Docker for everything" (resistant to single-binary paradigm)
- "Our stack is fine, we just need more servers" (doesn't see zero-copy value)

## 5. Demo Qualification Checklist

Before scheduling a demo, ensure:

- [ ] Lead score ≥ 50 (warm or hot)
- [ ] ICP tier confirmed (Tier 1 preferred)
- [ ] At least one technical stakeholder confirmed
- [ ] Specific use case identified (gaming, simulation, data pipeline)
- [ ] Current stack known (node, python, wasm, etc.)
- [ ] Pain point articulated in prospect's own words
- [ ] Prospect has downloaded and run `kazkade --help`
- [ ] Demo environment compatible (Windows/Linux/macOS)

### Demo Structure

| Segment | Duration | Content |
|---------|----------|---------|
| Setup | 3 min | Binary download, `kazkade init` (30 seconds total) |
| Magic moment | 7 min | `kazkade run --record` then `kazkade verify` |
| Use case deep dive | 15 min | Custom pipeline relevant to prospect's stack |
| Benchmark comparison | 10 min | Side-by-side with their current runtime |
| Q&A | 10 min | Open discussion |

## 6. Handoff to Engineering

When a lead is ready for technical evaluation, the BDR submits a handoff document containing:

```
Lead Name:         [Name]
Company:           [Company]
ICP Tier:          [1/2]
Lead Score:        [0–100]
Use Case:          [Description]
Current Stack:     [Technologies]
Pain Point:        [Quoted from discovery]
Demo Completed:    [Yes/No]
Commitment Level:  [Evaluation / POC / Pilot]
Next Action:       [Date and owner]
```

The engineering team then has 5 business days to:
1. Acknowledge receipt of handoff
2. Schedule technical deep-dive (if needed)
3. Set expectations for POC timeline

**SLA**: Engineering responds within 24 hours with a technical contact assigned. If no response, the BDR escalates to engineering lead.

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
