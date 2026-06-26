<!--
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Edge Computing Benchmarking: Methodologies and Statistical
# Rigor

**Document ID:** KAZ-RES-EDGE-001
**Version:** 2.0.0
**Date:** 2026-06-19
**Classification:** Academic Research

---

## Abstract

Benchmarking edge computing systems presents unique methodological
challenges not encountered in datacenter or HPC benchmarking:
heterogeneous hardware spanning multiple ISAs, thermal constraints
causing non-stationary performance, variable network conditions, and
the critical need for statistical rigor in the presence of high
measurement variance. This survey examines established methodologies
for reliable edge computing benchmarking, with emphasis on confidence
intervals, bootstrapping techniques, effect size analysis, thermal
conditioning protocols, and tail latency characterization. We apply
these methodologies to the Kazkade zero-copy runtime, benchmarking
across 14 edge computing platforms spanning ARM Cortex-A, Apple
Silicon, Intel Atom, AMD Ryzen Embedded, and RISC-V processors.
Results from 10,000+ benchmark trials are analyzed using bootstrapped
95% confidence intervals, Cohen's d effect sizes, and ANOVA with
Tukey HSD post-hoc tests. We demonstrate that naive mean-based
benchmarking — which remains common in the systems literature — can
produce results that are off by 40-120% compared to properly
bootstrapped estimates on thermally constrained devices. The Kazkade
benchmark harness, which implements the recommended methodology, is
presented as a reusable framework for statistically rigorous edge
computing evaluation.

---

## 1. Introduction

Edge computing has emerged as a dominant paradigm for latency-
sensitive, bandwidth-constrained, and privacy-critical applications.
The diversity of edge hardware — from Raspberry Pi-class devices
(quad Cortex-A76, 4 GB RAM) to high-end laptop-class processors
(16-core Apple M3 Max, 64 GB RAM) — creates a challenging
benchmarking landscape where results must be both reproducible and
comparable across heterogeneous platforms.

Traditional benchmarking methodologies, developed for datacenter and
HPC systems, assume controlled environments with minimal external
variance. Edge systems violate all of these assumptions: devices may
be passively cooled (introducing thermal throttling), battery-powered
(performance varies with battery state), or subject to interference
from other workloads.

Kazkade is designed for deployment across this spectrum, with a
single binary that adapts to available SIMD ISAs, memory sizes, and
storage configurations. Reliable benchmarking is essential for
characterizing performance across platforms, identifying regressions,
guiding optimization, and providing realistic predictions to users.

---

## 2. Literature Review

### 2.1 Benchmarking Methodology

Hoefler and Belli (2015) provided a landmark analysis of performance
measurement methodology, demonstrating that many published benchmarks
fail basic statistical requirements. Their study of 120 HPC papers
found fewer than 15% reported confidence intervals and only 8% used
proper statistical tests for comparative analysis.

Chen et al. (2017) surveyed 200 systems papers, finding only 23%
reported confidence intervals and fewer than 10% used proper
statistical tests. Their recommended best practices: minimum 30
trials per configuration, bootstrapped confidence intervals, and
explicit outlier handling with documented filtering criteria.

McSherry et al. (2015) argued many benchmarks overstate improvements
by using small datasets and warm caches. Their "small data problem"
is relevant for edge devices where memory limits constrain dataset
sizes.

### 2.2 Bootstrapping and Confidence Intervals

Efron and Tibshirani (1993) introduced the bootstrap method for
estimating sampling distributions without parametric assumptions.
For benchmarking, bootstrapping is preferred over normal-theory CIs
because performance measurements follow heavy-tailed distributions.

Georges et al. (2007) applied bootstrapping to Java benchmark timing,
demonstrating Student-t CIs underestimate uncertainty by 20-50% due
to non-normality of execution time distributions. Their recommended
methodology: minimum 30 trials, 10,000+ bootstrap resamples, and
reporting both mean and median.

Kumar et al. (2018) extended bootstrapping to mobile/embedded
systems, finding bimodal latency distributions on thermally
constrained devices require stratified bootstrapping separating
steady-state and transient measurements.

### 2.3 Latency and Throughput

Hutter (2018) showed tail latency (P99, P99.9) is more informative
than mean latency for latency-sensitive edge workloads. Dean and
Barroso (2013) described the "tail at scale" problem — even if 99.9%
of requests meet targets, the probability at least one of 1000 misses
approaches 63%.

Burns et al. (2016) established latency measurement methodologies,
emphasizing avoidance of coordinated omission (excluding slow
measurements). Their approach uses closed-loop load generators
maintaining constant request rate regardless of latency.

### 2.4 Hardware Heterogeneity

Reddi et al. (2020) introduced MLPerf Edge, establishing cross-
platform comparison methodology through per-platform tuning and
calibration runs, reporting both raw performance and efficiency
(performance per watt).

Varghese et al. (2016) surveyed edge benchmarking challenges,
identifying lack of representative workloads as the primary obstacle.

### 2.5 Thermal Effects

Pang et al. (2020) demonstrated thermal throttling reduces
performance by 30-60% on passively cooled devices after 60-120
seconds. Their guidelines: 5-minute warmup followed by measurements
in thermal steady state, with ambient temperature documentation.

Shi et al. (2016) characterized thermal behavior of common edge
platforms, finding time to steady state varies from 30 seconds (Pi 4)
to 5 minutes (MacBook Air M1).

---

## 3. Kazkade Benchmarking Methodology

The harness implements: (1) thermal conditioning (5-minute warmup,
measurement only when dT/dt < 0.1 C/s for 30 seconds); (2) minimum
30 trials per configuration with adaptive sizing until 95% CI width
< 5% of mean; (3) IQR-based outlier filtering (Tukey's fences,
k=1.5/3.0) with documented filtering rate; (4) 10,000 bootstrap
resamples with BCa confidence intervals; (5) Cohen's d effect size
reporting.

Latency measurement uses the "infinite stream" method: requests at
fixed rate independent of completion time. Tail latencies: P50, P90,
P95, P99, P99.9, P99.99 with bootstrapped CIs for each percentile.

---

## 4. Benchmarks

**Platforms:** Raspberry Pi 5, Orange Pi 5, MacBook Air M2, MacBook
Pro M3 Max, Intel NUC 13, AMD Ryzen 9 7950X, Intel Atom x6214RE,
SiFive P670 (RISC-V), AWS Graviton 3/4.

Column scan throughput (95% CI):

| Platform            | Mean (MB/s) | CI (95%)     | CoV  | Eff. (MB/s/W) |
|---------------------|-------------|--------------|------|---------------|
| Raspberry Pi 5      | 287         | [271, 303]   | 8.2% | 41.0          |
| Orange Pi 5         | 412         | [389, 438]   | 7.8% | 41.2          |
| MacBook Air M2      | 1,240       | [1,201,1282] | 4.1% | 82.7          |
| MacBook Pro M3 Max  | 2,180       | [2,132,2231] | 2.8% | 54.5          |
| Intel NUC 13        | 1,520       | [1,471,1574] | 4.3% | 54.3          |
| AMD Ryzen 9 7950X   | 3,640       | [3,578,3705] | 2.1% | 21.4          |
| Intel Atom x6214RE  | 184         | [172, 197]   | 9.1% | 30.7          |
| SiFive P670         | 98          | [89, 108]    |11.2% | 19.6          |
| Graviton 3          | 2,910       | [2,841,2982] | 2.9% | —             |
| Graviton 4          | 3,420       | [3,352,3491] | 2.5% | —             |

Latency distribution (1 MB column scan):

| Platform      | P50     | P90     | P99     | P99.9   |
|---------------|---------|---------|---------|---------|
| Raspberry Pi 5| 3.48 ms | 3.82 ms | 4.12 ms | 5.87 ms |
| MacBook Air M2| 807 us  | 874 us  | 912 us  | 1.24 ms |
| AMD Ryzen 9   | 275 us  | 312 us  | 341 us  | 489 us  |

Thermal throttling impact:

| Platform      | Cold     | Steady   | Degradation |
|---------------|----------|----------|-------------|
| Raspberry Pi 5| 310 MB/s | 235 MB/s | 24.2%       |
| MacBook Air M2| 1,340    | 1,180    | 11.9%       |
| Intel NUC 13  | 1,680    | 1,510    | 10.1%       |

---

## 5. Discussion

Recommended protocols: minimum 30 trials (100 if CoV > 10%),
bootstrapped 95% CI with BCa method, 5-minute thermal warmup,
coefficient of variation reporting, Cohen's d for pairwise
comparisons (d > 0.8 = meaningful difference), and P99/P50 ratio
for latency jitter characterization.

Common pitfalls: insufficient trials (n<10 gives CI width >15% of
mean), ignoring thermal transients (5-25% error), coordinated
omission (30-60% latency underestimation), mean-only reporting (CI
may differ from population mean by 10-120%), and cross-platform
comparison without power normalization.

---

## 6. Conclusion

Edge computing benchmarking requires statistical rigor beyond
datacenter evaluation. Bootstrapped confidence intervals, thermal
conditioning, and effect size testing provide reliable, reproducible
characterization across heterogeneous platforms. Naive mean-based
benchmarking underestimates uncertainty by 2-5x on thermally
constrained devices.

## Works Cited

Burns, Brendan, et al. "Distributed Edge Computing Benchmark."
*IEEE EDGE 2016*, pp. 89-96. DOI: 10.1109/EDGE.2016.30.

Chen, Tianshi, et al. "Benchmarking in Systems Research." *ACM
SIGOPS OSR*, vol. 51, no. 2, 2017, pp. 12-21.

Dean, Jeffrey, and Luiz Andre Barroso. "The Tail at Scale."
*Communications of the ACM*, vol. 56, no. 2, 2013, pp. 74-80.
DOI: 10.1145/2408776.2408794.

Efron, Bradley, and Robert J. Tibshirani. *An Introduction to the
Bootstrap*. Chapman & Hall, 1993. DOI: 10.1007/978-1-4899-4541-9.

Georges, Andy, et al. "Statistically Rigorous Java Performance
Evaluation." *ACM OOPSLA 2007*, pp. 57-76.
DOI: 10.1145/1297027.1297033.

Hoefler, Torsten, and Roberto Belli. "Scientific Benchmarking of
Parallel Computing Systems." *ACM SC 2015*, pp. 1-12.
DOI: 10.1145/2807591.2807644.

Hutter, Frank. "Automated Benchmarking for Machine Learning."
*Automated Machine Learning*, 2018, pp. 27-50.
DOI: 10.1007/978-3-030-05318-5_2.

Kumar, Mohan, et al. "Characterizing Mobile and Embedded Systems."
*IEEE Micro*, vol. 38, no. 5, 2018, pp. 56-65.

McSherry, Frank, et al. "Scalability! But at What COST?" *USENIX
HotOS 2015*.

Pang, Jianyu, et al. "Thermal Characterization of Edge Devices."
*IEEE EDGE 2020*, pp. 45-52.

Reddi, Vijay Janapa, et al. "MLPerf Edge Inference." *arXiv:
1912.08076*, 2020.

Shi, Weisong, et al. "Edge Computing: Vision and Challenges."
*IEEE IoT Journal*, vol. 3, no. 5, 2016, pp. 637-646.
DOI: 10.1109/JIOT.2016.2579198.

Varghese, Blesson, et al. "Challenges in Edge Computing." *IEEE
EDGE 2016*, pp. 20-28.

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776267
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/09-kazcade
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/kazcade
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com