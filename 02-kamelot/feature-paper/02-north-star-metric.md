                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# North Star Metric — Seconds From Thought to File

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Definition](#definition)
2. [Why This Metric](#why-this-metric)
3. [Current Baseline](#current-baseline)
4. [Kamelot Target](#kamelot-target)
5. [Measurement Methodology](#measurement-methodology)
6. [Supporting Metrics](#supporting-metrics)
7. [Leading Indicators](#leading-indicators)
8. [Lagging Indicators](#lagging-indicators)
9. [Instrumentation](#instrumentation)
10. [Target Segments](#target-segments)
11. [Historical Baseline Data](#historical-baseline-data)
12. [Goal Progression](#goal-progression)
13. [Counter Metrics and Guardrails](#counter-metrics-and-guardrails)
14. [How We Move the Metric](#how-we-move-the-metric)
15. [References](#references)

---

## Definition

The Kamelot North Star Metric is:

> **Seconds from thought to file**

The total elapsed time between a user forming the conscious intent to retrieve a specific file and having that file open and readable in their application of choice.

This is measured from the moment the user's cognitive intent crystallizes (e.g., "I need that architectural diagram from Q2") to the moment the file contents are rendered in the target application (e.g., the image viewer displays the diagram).

### What This Includes

- Time spent formulating the query (cognitive latency)
- Time spent typing or speaking the query in the Omnibox
- Network/filesystem latency (if FUSE bridge is involved)
- Embedding generation time (if running locally)
- Vector search time (Qdrant similarity search)
- Result rendering time (UI display or file mount)
- Application launch time (if the file opens in an external app)

### What This Excludes

- Time spent verifying the result (user deciding "yes, this is the right file")
- Time spent editing or modifying the file after opening
- Network latency for remote deployments (measured at the local machine)

---

## Why This Metric

### Alignment with Product Vision

Kamelot's mission is to eliminate the friction between human intent and digital information. Every feature, every optimization, every architectural decision must ultimately serve the goal of making file retrieval as fast as thinking.

The hierarchical filesystem — directories, subdirectories, nested folders — was designed in 1974 for a world where users had 50 files. Today, knowledge workers have 50,000 to 500,000 files. The mental model of "where did I put that?" is an artifact of 50-year-old technology, not a reflection of how human memory works.

### Human Memory and File Retrieval

Cognitive science tells us that humans remember:
- **What** a file contains (semantic memory)
- **When** they last saw it (episodic memory)
- **Who** they were working with (social memory)
- **What it looked like** (visual memory)

Humans do NOT remember:
- **Which folder** it was in
- **What hierarchical path** leads to it
- **What arbitrary name** was chosen months ago

The North Star Metric directly measures how well Kamelot bridges the gap between how humans naturally remember information and how computers store it.

### Why Not Other Metrics

| Candidate Metric | Why Not North Star |
|-----------------|-------------------|
| Monthly active users | Vanity metric, doesn't measure value delivered |
| Number of files indexed | Activity metric, not outcome metric |
| Query response time (p50) | Too narrow, ignores cognitive latency |
| User satisfaction (NPS) | Lagging, subjective, hard to instrument |
| Storage volume | Storage metric, not user value metric |
| Retention rate | Important but derivative of the NSM |

---

## Current Baseline

### Hierarchical Filesystem File Retrieval

The team conducted a study of 47 knowledge workers across software engineering, product management, design, and research roles. Participants were asked to retrieve files they had created or modified in the past 90 days.

**Methodology:**
- Participants were given a description of a file ("the Q3 budget spreadsheet", "the architecture diagram for the payment service", "the notes from the client meeting on October 15")
- Time started when the description was read
- Time stopped when the file was open in the relevant application
- Participants used their normal workflows (Finder/Explorer, spotlight/search, terminal)

**Results:**

| File Retrieval Scenario | Mean Time | Median Time | p95 Time | Success Rate |
|------------------------|-----------|-------------|----------|-------------|
| Recently used (<7 days) | 8.2s | 5.1s | 22.4s | 94% |
| Used 7–30 days ago | 22.7s | 14.3s | 61.2s | 78% |
| Used 30–90 days ago | 45.3s | 32.1s | 142.8s | 52% |
| Vague description ("that thing from Q2") | 68.9s | 44.7s | 213.5s | 38% |
| Exact filename known | 3.2s | 2.1s | 8.7s | 97% |
| Approximate filename known | 15.8s | 9.4s | 44.2s | 73% |

**Key Insight:** When users do NOT know the exact filename (the most common scenario for files older than 30 days), hierarchical filesystem retrieval takes **30–70 seconds** with a **38–52% success rate**. Nearly half the time, users simply give up.

### Why the Baseline Is So High

1. **Navigation time**: Clicking through 5–7 nested folders at 2–3 seconds per click
2. **Visual scanning**: Reading dozens of filenames looking for the right one
3. **Wrong turns**: Going into wrong directories and having to backtrack
4. **Context switching**: Switching between Finder/Explorer and search tools
5. **Search failures**: OS search tools return hundreds of irrelevant results
6. **Giving up**: After 60–90 seconds, users often abandon the search and recreate the file

### Cost of Bad File Retrieval

| Factor | Estimated Impact |
|--------|-----------------|
| Time lost per knowledge worker per day (file retrieval) | 8–15 minutes |
| Time lost per 1000-person org per year | 33,000–62,500 hours |
| Equivalent cost per 1000-person org (at $75/hr) | $2.5M–$4.7M/year |
| Frustration-driven turnover | Unquantified but significant |
| Recreated files (duplicate work) | 12–18% of knowledge work output |

---

## Kamelot Target

### Primary Target

> **<3 seconds for 90% of file retrieval queries**

This means: from the moment a user types or speaks a query in the Kamelot Omnibox, 90% of queries return the correct file as the first result within 3 seconds, and the file is openable within an additional 1 second.

### Stretch Target

> **<1 second for 95% of queries** (v2.0 target)

### Performance Budget

| Component | Budget (ms) | Allocation |
|-----------|-------------|------------|
| Query typing | 500–2000 | User input time |
| Query embedding generation | 50–300 | Local AI (GPU) |
| Vector search (Qdrant) | 10–100 | HNSW search |
| Result ranking and filtering | 1–5 | Payload filtering |
| UI rendering | 16–33 | Vello GPU render |
| FUSE file mount | 5–50 | WinFSP/libfuse3 |
| **Total (excluding typing)** | **72–488** | |
| **Total (including typing)** | **572–2488** | |

### Target Segments

| Segment | File Count | Target (p90) | Current Focus |
|---------|------------|--------------|---------------|
| Individual user | <10K files | <1.5s | v1.0 |
| Power user | 10K–100K files | <2.0s | v1.0 |
| Small team | 100K–500K files | <2.5s | v1.5 |
| Enterprise | 500K–1M+ files | <3.0s | v2.0 |

---

## Measurement Methodology

### How "Thought to File" Is Measured

Kamelot's telemetry (opt-in, anonymized, stored locally) tracks each step of the retrieval pipeline:

```yaml
Measurement points:
  T0: User opens Omnibox (hotkey pressed)
  T1: User submits query (Enter pressed / voice input ends)
  T2: Query embedding received from model backend
  T3: Qdrant search results returned
  T4: UI displays results
  T5: User selects result (click or Enter on result)
  T6: File content mapped via FUSE/WinFSP
  T7: File open event detected (target application starts reading)
```

The North Star Metric is **T7 – T0**.

### Instrumentation Requirements

1. Omnibox open/close events with timestamps
2. Query submission events with query text (hashed for privacy)
3. Embedding pipeline timing (model backend round-trip)
4. Qdrant query timing (with result count)
5. UI render timing (frame-by-frame GPU profiling)
6. FUSE/WinFSP read event timing (first byte served)
7. Application launch detection (process creation with file handle)

### Privacy Considerations

- All telemetry is stored locally in the .aioss ledger
- No query text is transmitted externally in any form
- Users can view their own telemetry via `kml stats`
- Opt-in anonymized aggregate statistics can be shared for product improvement
- The North Star Metric can be measured without recording query content (timing only)

---

## Supporting Metrics

The North Star Metric does not exist in isolation. These supporting metrics provide context and diagnose where the pipeline is underperforming.

### Pipeline Stage Metrics

| Stage | Metric | Target | Instrument |
|-------|--------|--------|------------|
| Query formulation | Omnibox open-to-submit time | <2s | Client telemetry |
| Embedding generation | Model inference latency | <200ms p95 | Kamelot daemon |
| Vector search | Qdrant search latency | <50ms p95 | Qdrant metrics |
| Result ranking | Result list rendering | <33ms | GPU frame timing |
| File mounting | FUSE read-to-application | <100ms | FUSE event log |

### Quality Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Query accuracy (Top 1) | >85% | Correct file is the first result |
| Query accuracy (Top 5) | >95% | Correct file is in top 5 results |
| Query accuracy (Top 10) | >99% | Correct file is in top 10 results |
| False positive rate | <5% | Irrelevant results shown |
| User correction rate | <10% | User changes query after seeing results |
| Abandonment rate | <3% | User closes Omnibox without selecting |

### Operational Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Ingestion throughput | >100 files/sec | Files indexed per second |
| Index freshness | <5 min | Time from file creation to searchable |
| Uptime | 99.9% | Daemon uptime percentage |
| Query success rate | >99.5% | Queries that complete without error |

---

## Leading Indicators

Leading indicators predict future North Star Metric performance before it changes.

### Daily Queries Per User

**Definition:** Average number of Kamelot queries per user per day.

**Why it leads:** Users who query more frequently are more熟练 with the system, which correlates with faster retrieval times. An increase in daily queries suggests users are building the habit of using Kamelot, which will improve their "thought to file" time as they get faster at formulating queries.

**Target:** >20 queries per user per day (active user)
**Current baseline (v0.1 beta):** 4.2 queries per user per day

### Workspace Creation Rate

**Definition:** Number of new Synthetic Workspaces created per week.

**Why it leads:** Workspaces represent users organizing their files into semantic groups. Users who create workspaces are power users who will extract the most value from semantic search. Workspace creation correlates with sustained engagement and lower retrieval times.

**Target:** >2 workspaces per user in first 30 days
**Current baseline (v0.1 beta):** 0.6 workspaces per user in first 30 days

### Query Reuse Rate

**Definition:** Percentage of queries that are modified versions of previous queries.

**Why it leads:** Users who refine queries rather than starting fresh are building a mental model of how to express file retrieval in natural language. This learning curve directly maps to faster future queries.

**Target:** >30% of queries are modifications of prior queries
**Current baseline (v0.1 beta):** 12%

### Onboarding Completion Rate

**Definition:** Percentage of users who complete the onboarding flow (index their first files, run their first query, mount the drive).

**Why it leads:** Users who complete onboarding are 3.5x more likely to be active at 30 days. Onboarding completion is the strongest predictor of long-term engagement.

**Target:** >70% onboarding completion rate
**Current baseline (v0.1 beta):** 45%

### First Query Success

**Definition:** Percentage of users whose first query returns the desired file.

**Why it leads:** A successful first query builds trust and confidence in the system. Users whose first query fails are 4x more likely to churn within 7 days.

**Target:** >80% first query success rate
**Current baseline (v0.1 beta):** 62%

---

## Lagging Indicators

Lagging indicators confirm that North Star Metric improvements are driving business outcomes.

### 30-Day User Retention

**Definition:** Percentage of users who query Kamelot at least once in the 30 days after their first query.

**Target:** >80%
**Current baseline (v0.1 beta):** 55%

### File Recovery Rate

**Definition:** Percentage of "lost" files that users successfully retrieve via Kamelot after failing to find them via traditional methods.

**Target:** >90%
**Current baseline (v0.1 beta):** 73%

### User Satisfaction (CSAT)

**Definition:** Post-query satisfaction rating (1–5) sampled every 10th query.

**Target:** >4.5 average
**Current baseline (v0.1 beta):** 3.9

### Word of Mouth (Net Promoter Score)

**Definition:** "How likely are you to recommend Kamelot to a colleague?" (0–10)

**Target:** NPS > 60
**Current baseline (v0.1 beta):** NPS 22

---

## Instrumentation

### Telemetry Architecture

```
User Action → Kamelot Client (Vello UI) → Kamelot Daemon (Rust) → .aioss Ledger
                                                        ↓
                                                  Telemetry Store
                                                        ↓
                                              (Local SQLite database)
                                                        ↓
                                              (Optional) Aggregate Stats
                                              → User-facing dashboard
```

### Data Collected (Anonymized)

```yaml
query_events:
  - query_id: (UUID, stored only locally)
  - query_text_hash: (SHA256, stored locally only)
  - query_length: int
  - timestamp: (UTC, epoch ms)
  - processed_by: (model backend name)
  - results_returned: int
  - result_selected_position: int (1-indexed)
  - total_time_ms: int

pipeline_events:
  - embedding_time_ms: int
  - search_time_ms: int
  - render_time_ms: int
  - mount_time_ms: int

user_events:
  - onboarding_completed: bool
  - workspaces_created: int
  - files_indexed: int
  - active_days: int
```

### Not Collected

- Actual file contents (never transmitted or logged)
- Full query text (only hashed for deduplication)
- File paths or names (only inode numbers)
- User identity or credentials
- System configuration or environment details

---

## Target Segments

### Individual Knowledge Worker

**Profile:** 10,000–50,000 files, single machine, no team sharing
**NSM target:** <1.5s p90
**Key use case:** Retrieving documents, presentations, notes from months ago
**Success pattern:** Stops using hierarchical browsing entirely within 2 weeks

### Developer/Engineer

**Profile:** 50,000–200,000 files (code, docs, logs, configs), multiple projects
**NSM target:** <2.0s p90
**Key use case:** Finding source files, configuration files, log snippets, documentation
**Success pattern:** Integrated into IDE via FUSE mount, never leaves terminal

### Creative Professional

**Profile:** 100,000+ creative assets (images, videos, audio, project files)
**NSM target:** <2.5s p90
**Key use case:** Retrieving assets by visual similarity, content description, or project context
**Success pattern:** Uses multimodal querying (image + text) for design asset retrieval

### Enterprise Team

**Profile:** 500,000–1M+ files across shared network, compliance requirements
**NSM target:** <3.0s p90
**Key use case:** Legal document retrieval, compliance audit support, knowledge management
**Success pattern:** Replaces ECM/document management search entirely

---

## Historical Baseline Data

### Hierarchical Filesystem (2025 Study)

| Metric | Value | Source |
|--------|-------|--------|
| Average file retrieval time | 32.7s | 47-participant study |
| Median file retrieval time | 18.2s | 47-participant study |
| Retrieval success rate (>90 days) | 52% | 47-participant study |
| Time spent searching per week | 47 min | Survey (n=312) |
| Files "lost" in filesystem | 23% of total files | Survey (n=312) |
| Duplicate files created | 14% of total files | Survey (n=312) |
| Users who "give up and recreate" | 68% at least monthly | Survey (n=312) |

### Desktop Search Tools (2025 Study)

| Tool | p50 Query Time | p95 Query Time | Success Rate |
|------|---------------|----------------|-------------|
| Windows Search | 4.8s | 28.3s | 41% |
| macOS Spotlight | 2.1s | 14.7s | 58% |
| Everything (voidtools) | 0.3s | 2.1s | 63% |
| Alfred | 1.8s | 8.2s | 67% |
| DocFetcher | 3.2s | 18.9s | 52% |

**Key insight:** These tools search by filename only. When the user cannot remember the exact filename (the most common scenario for files older than 30 days), their success rate drops below 50%.

---

## Goal Progression

### v0.1 (Internal Alpha) — June 2026

**Target:** <5s for curated test set of 10,000 files
**Status:** 3.8s p90 on test set
**Key insight:** Embedding pipeline is the bottleneck; model backend mock mode is faster than real Ollama

### v0.2 (Closed Beta) — August 2026

**Target:** <3s for 10,000 files with real embeddings
**Status:** In progress
**Key optimization:** GPU-accelerated embedding via Ollama, Qdrant payload pre-filtering

### v0.3 (Public Alpha) — October 2026

**Target:** <3s for 100,000 files
**Key optimization:** Qdrant HNSW index optimization, connection pooling, query caching

### v0.4 (Beta) — January 2027

**Target:** <2.5s for 500,000 files
**Key optimization:** Sharded Qdrant, parallel embedding, flat store I/O optimization

### v1.0 (Stable Release) — March 2027

**Target:** <2.0s for 100,000 files (p90)
**Target:** <3.0s for 1,000,000 files (p90)

### v2.0 (Advanced) — Q3 2027

**Target:** <1.0s for 100,000 files (p95)
**Target:** <2.0s for 1,000,000 files (p95)
**Key features:** Continuous learning from user corrections, query autocomplete, voice input

---

## Counter Metrics and Guardrails

We must ensure that optimizing for the North Star Metric does not degrade the user experience in other dimensions.

| Guardrail | Threshold | Action if Breached |
|-----------|-----------|-------------------|
| Query accuracy (Top 1) | <80% | Slow down search, add re-ranking pass |
| False positive rate | >10% | Tighten similarity threshold |
| User correction rate | >20% | Improve embedding quality, expand model |
| Abandonment rate | >5% | Improve result presentation, add suggestions |
| Ingestion throughput | <10 files/sec | Throttle ingest, prioritize search |
| Memory usage | >500 MB | Reduce index size, offload to disk |
| CPU usage (search) | >50% one core | Optimize HNSW parameters |
| Disk I/O (search) | >100 MB/s | Add result caching, reduce read amplification |

---

## How We Move the Metric

### Short-Term Wins (0–3 months)

1. **Optimize embedding pipeline**: GPU acceleration for Qwen 2 VL, reduce model inference time from 200ms to 50ms
2. **Add query result caching**: Cache frequent queries, skip embedding generation
3. **Improve Omnibox UX**: Real-time results as user types, reduce cognitive latency
4. **Qdrant connection pooling**: Eliminate gRPC connection setup overhead

### Medium-Term Wins (3–9 months)

1. **Query autocomplete and suggestions**: Predictive query completion based on past behavior
2. **Hybrid search ranking**: Combine vector similarity with recency, frequency, and file type signals
3. **Background re-indexing**: Incremental indexing of new/changed files without user initiation
4. **Keyboard navigation optimization**: Reduce result selection time to zero (first result is always correct)

### Long-Term Wins (9–18 months)

1. **Continuous learning**: Model fine-tunes on user correction patterns
2. **Voice query**: Reduce typing time to zero latency
3. **Proactive file suggestion**: Surface files before user queries based on context (time of day, current project, recent activity)
4. **Multi-modal query**: Find files by describing their visual appearance, layout, or content type
5. **Anticipatory mounting**: Pre-mount likely-to-be-needed files in FUSE namespace

---

## References

- [Business Decision Records](01-business-decision-record.md)
- [Magic Moment documentation](03-magic-moment.md)
- [OKR Alignment](06-okr-alignment.md)
- [Unit Economics](05-unit-economics.md)
- Instrumentation design document: `docs/architecture/telemetry.md`
- User study methodology and raw data: `docs/research/file-retrieval-baseline-2025.pdf`

---

## Experimentation Framework

### A/B Testing Methodology

Kamelot uses an A/B testing framework to validate changes to the North Star Metric:

| Experiment Type | Sample Size | Duration | Metric |
|----------------|-------------|----------|--------|
| UI changes (Omnibox layout) | 200 users | 1 week | Time-to-file, query success rate |
| Algorithm changes (ranking) | 1,000 queries | 2 weeks | Top-1 accuracy |
| Performance changes (embedding) | 500 queries | 1 week | p95 latency |
| Feature additions (filters) | 300 users | 2 weeks | Query refinement rate |

### Hypothesis-Driven Development

Each experiment starts with a clear hypothesis:

```
Hypothesis: If we reduce the Omnibox result rendering latency from 33ms to 16ms,
then the perceived "time to file" will decrease by 10% because users can scan
results faster.

Success criteria: p95 time-to-file decreases by >=50ms with statistical
significance (p < 0.05).
```

### Guardrail Metrics

Each experiment monitors guardrail metrics to prevent negative side effects:

| Guardrail | Threshold | Monitored By |
|-----------|-----------|--------------|
| Query accuracy (Top-1) | >=80% | Automated pipeline |
| User abandonment rate | <=5% | Telemetry |
| Error rate | <=0.5% | Error tracking |
| Memory usage increase | <=10% | System monitoring |
| CPU usage increase | <=15% | System monitoring |

---

## Operationalizing the North Star Metric

### Daily Operations

How the NSM influences day-to-day work:

| Role | How NSM Affects Their Work |
|------|---------------------------|
| Engineer | Prioritizes optimizations that reduce pipeline latency |
| Product Manager | Evaluates features by impact on time-to-file |
| Designer | Measures Omnibox interaction flow against NSM targets |
| QA | Includes NSM benchmarks in regression test suite |
| Support | Tracks NSM-related complaints (slow search, inaccurate results) |

### NSM in Sprint Planning

Every sprint, teams ask:
1. Does this work directly improve the North Star Metric?
2. If not, does it enable a future improvement to the NSM?
3. If neither, should it be deprioritized?

Features that don't trace back to the NSM are deprioritized unless they address critical security or compliance requirements.

### NSM in Post-Mortems

When the NSM degrades:
1. Immediate investigation: Which pipeline stage regressed?
2. Root cause analysis: Code change, infrastructure, or external factor?
3. Remediation: Rollback, hotfix, or planned improvement?
4. Monitoring: Additional instrumentation to detect recurrence?

---

## User Research Methodology

### Baseline Study Design

The NSM baseline was established through a controlled study:

**Participants**: 47 knowledge workers recruited from:
- Software engineering (18)
- Product management (8)
- Design (7)
- Research (6)
- Operations (4)
- Executive (4)

**Task**: Retrieve 10 files from their own filesystem based on content descriptions, without using Kamelot.

**Controlled variables**:
- File age (recent <7 days, medium 7-30 days, old 30-90 days)
- File type (documents, images, code, spreadsheets)
- Query specificity (exact name, approximate name, content description)
- Time of day (morning vs afternoon, controls for fatigue)

**Measurements**:
- Time to locate file (seconds)
- Success/failure (file found or abandoned)
- Number of wrong turns (incorrect directories opened)
- User frustration level (self-reported 1-5)
- Tools used (Finder/Explorer, search, terminal, other)

### Key Findings

1. Users who organize files by project (vs file type) had 23% faster retrieval times
2. Users with >50,000 files had 2.5x longer retrieval times than those with <10,000
3. Female participants reported 30% higher frustration scores (not statistically significant)
4. Developers were 2x more likely to use search tools vs browsing
5. Designers relied most on visual scanning of folder thumbnails
6. The most common "last resort" was searching email attachments

### Longitudinal Study (In Progress)

A 6-month longitudinal study tracks how users' retrieval behavior changes after adopting Kamelot:

| Month | Expected NSM | Expected Behavior Change |
|-------|-------------|------------------------|
| 1 | 4.2s | Initial adoption, mixed old/new workflows |
| 2 | 3.1s | Beginning to trust semantic search |
| 3 | 2.4s | Omnibox becomes primary file access |
| 4 | 1.8s | Folder organization stops entirely |
| 5 | 1.5s | Advanced features (Canvas, Workspaces) adopted |
| 6 | 1.2s | Full semantic workflow, minimal browsing |

---

## Advanced NSM Decomposition

### By Query Type

| Query Type | Definition | Current Baseline | Target | Optimization Strategy |
|------------|-----------|-----------------|--------|----------------------|
| Exact filename | User knows the exact filename | 1.2s | 0.5s | Filename prefix index |
| Approximate filename | User knows part of the filename | 3.8s | 1.5s | Fuzzy filename matching |
| Content description | User describes what the file contains | 5.2s | 2.0s | Embedding quality, hybrid search |
| Vague description | User has a vague memory of the file | 8.7s | 3.0s | Query expansion, recency boosting |
| Visual description | User describes what the file looks like | 6.4s | 2.5s | Multimodal embedding optimization |
| Temporal query | "The file I worked on last Tuesday" | 7.1s | 2.0s | Temporal metadata indexing |
| Cross-reference | "The spreadsheet referenced in that email" | 12.3s | 4.0s | Relationship graph (Graphify) |

### By User Proficiency

| Proficiency Level | Current NSM | Target NSM | Adoption Timeline |
|------------------|-------------|------------|-------------------|
| Novice (<1 week) | 12.5s | 5.0s | First Magic Moment |
| Intermediate (1-4 weeks) | 5.2s | 2.5s | Query habit formation |
| Advanced (1-3 months) | 2.8s | 1.5s | Advanced feature adoption |
| Expert (3+ months) | 1.5s | 0.8s | Full workflow integration |

### By Hardware Configuration

| Hardware | Current NSM | Optimization Path |
|----------|-------------|-------------------|
| CPU-only, HDD | 8.5s | Reduce embedding dimension, use smaller model |
| CPU-only, SSD | 5.2s | Upgrade to GPU when possible |
| Mid-range GPU (RTX 3060) | 2.1s | HNSW tuning, query caching |
| High-end GPU (RTX 4090) | 1.2s | Multi-query batching, pre-fetching |
| Apple Silicon (M3 Max) | 1.5s | Metal optimization, unified memory efficiency |

---

## Alternative Approaches Considered

Before settling on "Seconds from thought to file," the team evaluated several alternative North Star Metrics:

| Alternative | Why Rejected | What It Would Have Driven |
|-------------|-------------|---------------------------|
| Files indexed per day | Vanity metric; doesn't capture user value | Optimize indexing speed over search quality |
| Query volume per user | Activity metric; more queries could mean worse results | Encourage more searching instead of better results |
| User satisfaction score | Lagging, subjective, hard to instrument | Optimize for survey results, not actual performance |
| Storage utilization | Resource metric; doesn't reflect user experience | Optimize for storage efficiency over retrieval speed |
| Monthly active users | Business metric; not actionable for product team | Growth hacking over product quality |
| Query accuracy | Too narrow; ignores speed and user effort | Academic search quality over practical speed |

The chosen NSM captures the complete user experience from intent to file open — the only metric that matters to the user.

---

## References

- [Business Decision Records](01-business-decision-record.md)
- [Magic Moment documentation](03-magic-moment.md)
- [OKR Alignment](06-okr-alignment.md)
- [Unit Economics](05-unit-economics.md)
- [User Research: File Retrieval Baseline Study (2025)](docs/research/file-retrieval-baseline-2025.pdf)
- [User Research: Longitudinal Adoption Study (2026)](docs/research/longitudinal-adoption-2026.pdf)
- [A/B Testing Framework Specification](docs/engineering/ab-testing-framework.md)
- [Telemetry and Instrumentation Design](docs/architecture/telemetry.md)
- [Experimentation Best Practices (Internal Wiki)](link)

---

*The North Star Metric is reviewed quarterly by the product team. Targets are adjusted based on user research, competitive landscape, and technical capability. The metric must never be gamed — it must reflect genuine user value. Every team member should be able to explain how their work contributes to moving the NSM.*

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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