                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# Unit Economics — Cost Per File, Query, and User

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Cost Per File Ingested](#cost-per-file-ingested)
3. [Cost Per Query Executed](#cost-per-query-executed)
4. [Storage Cost Per GB](#storage-cost-per-gb)
5. [Infrastructure Cost Per User](#infrastructure-cost-per-user)
6. [Break-Even Analysis vs Cloud Storage](#break-even-analysis-vs-cloud-storage)
7. [Lifetime Value Estimates by Segment](#lifetime-value-estimates-by-segment)
8. [Cost Modeling Methodology](#cost-modeling-methodology)
9. [Sensitivity Analysis](#sensitivity-analysis)
10. [Revenue Model](#revenue-model)
11. [Path to Profitability](#path-to-profitability)
12. [References](#references)

---

## Executive Summary

Kamelot is fundamentally a **zero-marginal-cost software product** for individual users. After the one-time hardware investment (computer, storage, optional GPU), there are no per-file, per-query, or per-user costs for the core functionality.

For enterprise and support tiers, Kamelot generates revenue through professional services, not through data monetization or per-seat subscriptions.

### Key Unit Economics

| Metric | Individual (Self-Hosted) | Enterprise (Supported) |
|--------|------------------------|----------------------|
| Cost per file ingested | $0.0000003 (electricity only) | $0.0000003 |
| Cost per query executed | $0.0000008 (electricity only) | $0.0000008 |
| Storage cost per GB (HDD) | $0.02 (one-time) | $0.02 (one-time) |
| Storage cost per GB (SSD) | $0.08 (one-time) | $0.08 (one-time) |
| Infrastructure cost per user/year | $5-25 (electricity) | $5-25 + support cost |
| Average revenue per user/year | $0 | $500-5,000 |

### Key Insight

Kamelot's unit economics are **inherently superior to cloud alternatives** because:
1. No per-unit cloud compute costs (inference, storage, bandwidth)
2. No data egress fees
3. All costs are fixed (hardware) or near-zero (electricity)
4. Marginal cost approaches zero as usage scales

---

## Cost Per File Ingested

### Definition

The total cost to ingest one file into the Kamelot system: read from disk, parse content, generate embedding vector, store in Qdrant, store encrypted blob in flat store, write metadata to .aioss ledger.

### Cost Breakdown

| Component | Time (ms) | CPU Usage | RAM Usage | Electricity Cost |
|-----------|-----------|-----------|-----------|-----------------|
| File read | 0.5-5 | Minimal | - | $0.00000001 |
| Content parsing | 1-100 (varies) | Low-Moderate | Variable | $0.00000002 |
| Embedding (GPU) | 10-50 | - | 4-8 GB VRAM | $0.00000008 |
| Embedding (CPU) | 100-500 | High | 8-16 GB RAM | $0.00000050 |
| Qdrant insert | 5-15 | Low | - | $0.00000002 |
| Flat store write | 0.5-2 | Low | - | $0.00000001 |
| Ledger append | 0.1-0.5 | Minimal | - | $0.00000001 |
| **Total (GPU)** | **~17-172 ms** | - | - | **~$0.00000015** |
| **Total (CPU)** | **~107-622 ms** | - | - | **~$0.00000057** |

### Cost at Scale

| Files Indexed | GPU Ingest Time | GPU Cost | CPU Ingest Time | CPU Cost |
|--------------|----------------|----------|----------------|----------|
| 1,000 | 30 seconds | $0.00015 | 3 minutes | $0.00057 |
| 10,000 | 5 minutes | $0.00150 | 30 minutes | $0.00570 |
| 100,000 | 50 minutes | $0.01500 | 5 hours | $0.05700 |
| 1,000,000 | 8.3 hours | $0.15000 | 50 hours | $0.57000 |

### Amortized Cost Per File Over Hardware Lifetime

| Hardware Component | Cost | Lifespan | Amortized Per File (1M files) |
|-------------------|------|----------|------------------------------|
| Computer | $1,000 | 3 years | $0.00100 |
| GPU (optional) | $500 | 3 years | $0.00050 |
| Storage SSD 2TB | $200 | 5 years | $0.00004 |
| **Total hardware** | | | **$0.00154** |

**Total cost per file (including amortized hardware): ~$0.00154**

### Comparative Analysis

| Method | Cost Per File | Notes |
|--------|--------------|-------|
| Kamelot (GPU, self-hosted) | $0.00154 | Includes amortized hardware |
| Google Drive (just storage) | $0.00008/month | Subscription amortized per file |
| Dropbox (just storage) | $0.00010/month | Subscription amortized per file |
| OpenAI embedding (per file) | $0.00013 | API cost only, no hardware |
| AWS S3 + embedding | $0.00025 | Storage + compute + embedding |

**Note:** Cloud services charge per month, not one-time. Over 3 years, cloud storage for 1M files costs $2,520-$3,600. Kamelot costs a one-time $1.54 in hardware amortization.

---

## Cost Per Query Executed

### Definition

The total cost to execute one user query: receive query text, generate embedding, search Qdrant, rank results, render UI, mount file (if opened).

### Cost Breakdown

| Component | Time (ms) | Cost |
|-----------|-----------|------|
| Query embedding (GPU) | 10-50 | $0.00000008 |
| Query embedding (CPU) | 100-500 | $0.00000050 |
| Qdrant search | 5-50 | $0.00000002 |
| Result ranking | 1-5 | $0.00000001 |
| UI rendering | 16-33 | $0.00000002 |
| File mount (FUSE) | 5-50 | $0.00000002 |
| **Total per query (GPU)** | **~37-188 ms** | **~$0.00000015** |
| **Total per query (CPU)** | **~127-638 ms** | **~$0.00000057** |

### Cost at Scale

| Queries/Day | Monthly Queries | Monthly Cost (GPU) | Monthly Cost (CPU) |
|-------------|----------------|--------------------|--------------------|
| 10 | 300 | $0.00005 | $0.00017 |
| 50 | 1,500 | $0.00023 | $0.00086 |
| 100 | 3,000 | $0.00045 | $0.00171 |
| 1,000 | 30,000 | $0.00450 | $0.01710 |
| 10,000 | 300,000 | $0.04500 | $0.17100 |

### Comparative Analysis

| Service | Cost Per Query | Notes |
|---------|---------------|-------|
| Kamelot (GPU, self-hosted) | $0.00000015 | Electricity only |
| Kamelot (CPU, self-hosted) | $0.00000057 | Electricity only |
| OpenAI GPT-4o (with RAG) | $0.02-$0.10 | Per-query API cost |
| Pinecone query (SaaS) | $0.0001-$0.001 | Per-vector read cost |
| Elastic Cloud search | $0.0001-$0.001 | Per-document search cost |

**Kamelot queries are 100-100,000x cheaper than cloud equivalents.**

---

## Storage Cost Per GB

### Encrypted Flat Store

| Storage Medium | Cost Per GB (One-Time) | Lifespan | Cost Per GB/Year |
|---------------|----------------------|----------|-----------------|
| HDD (consumer) | $0.015-$0.025 | 3-5 years | $0.003-$0.008 |
| SSD (consumer SATA) | $0.06-$0.10 | 5-7 years | $0.009-$0.020 |
| SSD (NVMe) | $0.08-$0.15 | 5-7 years | $0.011-$0.030 |
| SSD (Enterprise) | $0.20-$0.40 | 5-7 years | $0.029-$0.080 |

### Qdrant Vector Index

| Files Indexed | Vector Index Size | Storage Cost (SSD) |
|--------------|-------------------|-------------------|
| 10,000 | ~80 MB | ~$0.006 |
| 100,000 | ~800 MB | ~$0.06 |
| 1,000,000 | ~8 GB | ~$0.64 |

### Overhead (Ledger, Metadata, Cache)

| Component | Per 100K Files | Storage Cost |
|-----------|---------------|-------------|
| .aioss ledger | ~500 MB | ~$0.04 |
| sled metadata store | ~200 MB | ~$0.02 |
| Thumbnail cache | ~1-10 GB | ~$0.08-$0.80 |
| Query cache | ~100 MB | ~$0.01 |

### Total Storage Cost Per User (Typical)

| User Type | File Count | Total Storage | One-Time Storage Cost |
|-----------|-----------|---------------|----------------------|
| Light user | 5,000 files (50 GB) | ~55 GB | $0.40-$4.40 |
| Typical user | 50,000 files (250 GB) | ~260 GB | $2.00-$20.80 |
| Power user | 500,000 files (1 TB) | ~1.04 TB | $10.00-$83.20 |
| Enterprise | 5,000,000 files (5 TB) | ~5.2 TB | $50.00-$416.00 |

---

## Infrastructure Cost Per User

### Self-Hosted Individual

| Category | Monthly Cost | Annual Cost |
|----------|-------------|-------------|
| Electricity (50W idle + 100W load, 8 hrs/day) | $1.20-$3.60 | $14.40-$43.20 |
| Hardware depreciation (computer) | $8.33/month | $100.00 |
| Storage depreciation (SSD) | $1.67/month | $20.00 |
| GPU depreciation (optional) | $4.17/month | $50.00 |
| **Total with GPU** | **$15.37-$17.77** | **$184.40-$213.20** |
| **Total without GPU** | **$11.20-$13.60** | **$134.40-$163.20** |

### Self-Hosted Enterprise (Per User)

| Category | Monthly Cost | Annual Cost |
|----------|-------------|-------------|
| Shared server infrastructure | $5.00-$20.00 | $60.00-$240.00 |
| Storage (depreciation) | $2.00-$8.00 | $24.00-$96.00 |
| IT admin time (amortized) | $5.00-$15.00 | $60.00-$180.00 |
| Backup infrastructure | $3.00-$10.00 | $36.00-$120.00 |
| **Total per user** | **$15.00-$53.00** | **$180.00-$636.00** |

### Comparative: Cloud Alternatives

| Service | Monthly Cost (500 GB) | Annual Cost | Per User (10 users) |
|---------|---------------------|-------------|--------------------|
| Google Drive Business | $18/user | $216/user | $216 |
| Dropbox Advanced | $24/user | $288/user | $288 |
| OneDrive for Business | $10/user | $120/user | $120 |
| Box Enterprise | $35/user | $420/user | $420 |
| **Kamelot (individual)** | **$1.20-$3.60** | **$14.40-$43.20** | **$14.40-$43.20** |

---

## Break-Even Analysis vs Cloud Storage

### Break-Even Timeline

The point at which Kamelot becomes cheaper than cloud storage subscriptions:

| Scenario | Cloud Monthly Cost | Kamelot Hardware Upfront | Break-Even (months) |
|----------|-------------------|------------------------|--------------------|
| Individual (500 GB, Google Drive) | $9.99 | $400 (SSD upgrade) | 40 months |
| Individual (1 TB, Dropbox) | $11.99 | $600 (SSD + RAM) | 50 months |
| Small team (5 users, 2 TB, GDrive) | $90 | $1,200 (NAS) | 13 months |
| Small team (10 users, 5 TB, Dropbox) | $240 | $2,000 (server) | 8 months |
| Enterprise (50 users, 10 TB) | $1,750 | $5,000 (server) | 3 months |

### Three-Year Total Cost of Ownership

| User Type | Kamelot (3yr) | Google Drive (3yr) | Dropbox (3yr) | Savings with Kamelot |
|-----------|--------------|-------------------|--------------|--------------------|
| Individual (500 GB) | $443 | $360 | $432 | Kamelot costs more* |
| Power user (1 TB) | $613 | $720 | $1,080 | **$107-$467 saved** |
| Small team (5 users) | $1,643 | $3,240 | $5,400 | **$1,597-$3,757 saved** |
| Enterprise (50 users) | $9,500 | $32,400 | $54,000 | **$22,900-$44,500 saved** |

*Note: Individual user with no GPU breaks even at about 3 years. This is acceptable because Kamelot provides semantic search that cloud storage does not. For most users, the productivity benefit alone justifies the cost within weeks.

### Value Beyond Storage

The productivity value of Kamelot's semantic search dwarfs the storage cost:

| Metric | Value |
|--------|-------|
| Time saved per user per day | 8-15 minutes |
| Value of time saved (at $50/hr) | $6.67-$12.50/day |
| Annual value per user | $1,667-$3,125 |
| **Kamelot cost per user per year** | **$14-$213** |
| **ROI** | **8x-223x** |

---

## Lifetime Value Estimates by Segment

### LTV Calculation Methodology

LTV = Average Revenue Per User (ARPU) x Average Customer Lifetime

For Kamelot, we segment users into three tiers based on support and services revenue.

### Individual (Free) Segment

| Metric | Value |
|--------|-------|
| Revenue per user | $0 (core is free) |
| Average lifetime | N/A (retention not tied to revenue) |
| LTV | $0 (direct revenue) |
| Indirect value | Word-of-mouth referrals, community contributions, ecosystem growth |
| Referral value | ~$50-200 per user over lifetime (probability-weighted) |

### Community (Supporters) Segment

| Metric | Value |
|--------|-------|
| Revenue model | One-time payment or annual supporter tier |
| Annual revenue per user | $50-$100 |
| Average lifetime | 2-3 years |
| **LTV** | **$100-$300** |
| Gross margin | 90%+ (no incremental cost) |

### Enterprise (Supported) Segment

| Metric | Bronze | Silver | Gold | Platinum |
|--------|--------|--------|------|----------|
| Annual subscription | $5,000 | $15,000 | $50,000 | $150,000 |
| Average users covered | 10-50 | 50-200 | 200-1,000 | 1,000+ |
| Revenue per user/year | $100-$500 | $75-$300 | $50-$250 | $50-$150 |
| Average lifetime | 2 years | 3 years | 4 years | 5 years |
| **LTV per user** | **$200-$1,000** | **$225-$900** | **$200-$1,000** | **$250-$750** |
| Gross margin | 85% | 80% | 75% | 70% |

### Blended LTV

Assuming a user mix of 90% free, 8% community, 2% enterprise:

| Metric | Value |
|--------|-------|
| Blended ARPU (all users) | $15-$40/year |
| Blended LTV (3 year avg) | $45-$120 |
| Customer acquisition cost target | <$30 |

---

## Cost Modeling Methodology

### Assumptions

1. **Electricity cost**: $0.12/kWh (US average), 50W idle, 100W load for typical desktop
2. **GPU power**: Additional 150W under load for mid-range GPU (RTX 3060-class)
3. **Hardware lifespan**: 3 years for computer/GPU, 5 years for storage
4. **Indexing workload**: GPU embedding at 20 files/sec, CPU embedding at 3 files/sec
5. **Query workload**: Average 50 queries/day/user, GPU embedding at 50ms/query
6. **No cloud infrastructure costs**: All costs are local (no AWS/Azure/GCP)

### Cost Model Equation

```
Cost Per File = (Electricity_Cost_Per_File) + (Hardware_Amortization_Per_File)
Electricity_Cost_Per_File = (Ingest_Time_Seconds / 3600) * System_Power_kW * $0.12/kWh
Hardware_Amortization_Per_File = Total_Hardware_Cost / Total_Files_Over_Lifespan
```

### Sensitivity Factors

| Factor | Impact on Cost Per File |
|--------|----------------------|
| Electricity price (+50%) | +50% on electricity portion (small overall) |
| Hardware cost (+25%) | +25% on amortized portion |
| GPU vs CPU embedding | 4x difference in electricity cost |
| File size (affects ingest time) | Proportional to read + parse time |
| Embedding model size | Proportional to inference time |

---

## Sensitivity Analysis

### Scenario: Hardware Cost Variation

| Hardware Budget | Monthly Cost (amortized) | Files/Day (GPU) | Cost Per File |
|----------------|------------------------|-----------------|-------------|
| $800 (budget PC, no GPU) | $17.78 | 50,000 | $0.0000107 |
| $1,500 (mid-range with GPU) | $34.44 | 500,000 | $0.0000021 |
| $3,000 (high-end with GPU) | $69.44 | 1,000,000 | $0.0000021 |
| $5,000 (workstation, dual GPU) | $115.56 | 2,000,000 | $0.0000017 |

### Scenario: Usage Pattern

| Usage Pattern | Daily Queries | Monthly Electricity Cost | Cost Per Query |
|--------------|--------------|------------------------|---------------|
| Light | 10 | $0.02 | $0.00000007 |
| Moderate | 50 | $0.07 | $0.00000005 |
| Heavy | 200 | $0.25 | $0.00000004 |
| Extreme | 1,000 | $1.20 | $0.00000004 |

### Scenario: Scale (Enterprise)

| Metric | 10 users | 100 users | 1,000 users |
|--------|----------|-----------|-------------|
| Server cost (amortized/month) | $500 | $1,500 | $5,000 |
| Storage (total) | $100 | $800 | $7,500 |
| IT admin (amortized/month) | $100 | $500 | $3,000 |
| **Cost per user/month** | **$70** | **$28** | **$15.50** |
| Breakeven vs cloud (months) | 8 | 4 | 2 |

---

## Revenue Model

### Revenue Streams

| Stream | Target Segment | Price Range | Margin |
|--------|---------------|-------------|--------|
| Community License | Individual, enthusiasts | $50-$100 one-time | 95% |
| Bronze Support | Small teams | $5,000/year | 85% |
| Silver Support | Mid-size teams | $15,000/year | 80% |
| Gold Support | Large organizations | $50,000/year | 75% |
| Platinum Support | Enterprise | $150,000/year | 70% |
| Consulting | Enterprise | $200-$500/hour | 90% |
| Training | All segments | $1,000-$5,000/session | 90% |
| Custom Development | Enterprise | $10,000-$100,000 | 80% |

### Revenue Projections (Conservative)

| Year | Free Users | Community | Enterprise Support | Total Revenue |
|------|-----------|-----------|-------------------|-------------|
| 1 (2026) | 5,000 | 100 | 5 | $50,000-$100,000 |
| 2 (2027) | 25,000 | 500 | 25 | $300,000-$600,000 |
| 3 (2028) | 100,000 | 2,000 | 100 | $1,500,000-$3,000,000 |
| 4 (2029) | 300,000 | 5,000 | 300 | $5,000,000-$10,000,000 |
| 5 (2030) | 1,000,000 | 15,000 | 1,000 | $20,000,000-$40,000,000 |

### Revenue Per User Projection

| Year | Blended ARPU | CAC | LTV (3yr) | LTV/CAC |
|------|-------------|-----|-----------|---------|
| 1 | $15 | $50 | $45 | 0.9 |
| 2 | $18 | $40 | $54 | 1.4 |
| 3 | $22 | $30 | $66 | 2.2 |
| 4 | $27 | $25 | $81 | 3.2 |
| 5 | $32 | $20 | $96 | 4.8 |

---

## Path to Profitability

### Year 1: Validation Phase

- Focus: Product-market fit, community building
- Revenue target: $50,000-$100,000
- Expenses: ~$200,000 (development, infrastructure)
- Path: Funded by founders/seed investment
- **Net: -$100,000 to -$150,000**

### Year 2: Growth Phase

- Focus: Enterprise adoption, support tier refinement
- Revenue target: $300,000-$600,000
- Expenses: ~$500,000 (team expansion, marketing)
- Path: Community growth drives word-of-mouth
- **Net: -$200,000 to +$100,000**

### Year 3: Break-Even

- Focus: Enterprise sales, recurring revenue
- Revenue target: $1,500,000-$3,000,000
- Expenses: ~$1,500,000 (scaled team)
- Path: Enterprise support contracts provide stable revenue
- **Net: $0 to +$1,500,000**

### Year 4-5: Profitability

- Focus: Scale enterprise, international expansion
- Revenue target: $5,000,000-$40,000,000
- Expenses: Scalable (software margins)
- Path: High-margin support revenue scales with user base
- **Net: Profitable**

---

## References

- [Business Decision Record: Self-hosted over SaaS](01-business-decision-record.md#bdr-006-self-hosted-over-saas)
- [OKR Alignment: Revenue and adoption targets](06-okr-alignment.md)
- [SBOM: Infrastructure dependency costs](04-software-bill-of-materials.md)
- [North Star Metric: Value of time saved](02-north-star-metric.md)
- Hardware pricing sources: PCPartPicker, Amazon, Newegg (June 2026)
- Cloud pricing sources: Google Workspace, Dropbox, Microsoft 365 (June 2026)
- Market sizing: Gartner Magic Quadrant for Content Collaboration Platforms (2025)

---

## Cost Comparison: Kamelot vs Cloud File Search

### Annual Cost Comparison by File Count

| Files | Kamelot (GPU) | Kamelot (CPU) | Google Drive | Dropbox | Pinecone + OpenAI |
|-------|--------------|--------------|--------------|---------|-------------------|
| 1,000 | $14 | $14 | $120 | $180 | $120 |
| 10,000 | $14 | $14 | $120 | $180 | $600 |
| 100,000 | $15 | $15 | $120 | $180 | $5,000 |
| 500,000 | $16 | $16 | $240 | $360 | $25,000 |
| 1,000,000 | $18 | $18 | $360 | $540 | $50,000 |

Kamelot's cost remains flat because indexing and storage are one-time hardware costs. Cloud costs scale linearly with data volume and query volume.

### Five-Year Total Cost of Ownership

| Scenario | Kamelot | Cloud Equivalent | Savings |
|----------|---------|-----------------|---------|
| Individual (100K files) | $150 | $600-$2,500 | $450-$2,350 |
| Power user (500K files) | $200 | $1,800-$12,500 | $1,600-$12,300 |
| Small team (5 users, 1M files) | $800 | $6,000-$50,000 | $5,200-$49,200 |
| Enterprise (50 users, 5M files) | $5,000 | $60,000-$500,000 | $55,000-$495,000 |

### Non-Monetary Benefits of Self-Hosted

- **Full privacy**: No data leaves your infrastructure
- **Offline availability**: Works without internet connection
- **No vendor lock-in**: Open formats, open source
- **Customization**: Full control over configuration and deployment
- **Compliance**: Data sovereignty for regulated industries
- **Performance**: Filesystem-level latency, no network round trips

---

## Infrastructure Cost Breakdown by Component

### Detailed Hardware Cost Analysis

| Component | Budget Build | Mid-Range | High-End | Workstation |
|-----------|-------------|-----------|----------|-------------|
| CPU | Intel i5-12400 ($150) | AMD Ryzen 7 7700 ($300) | AMD Ryzen 9 7950X ($550) | AMD Threadripper 7980X ($2,500) |
| RAM | 16 GB DDR4 ($40) | 32 GB DDR5 ($100) | 64 GB DDR5 ($200) | 128 GB DDR5 ($400) |
| GPU | None (CPU mode) | RTX 3060 12GB ($250) | RTX 4090 24GB ($1,600) | 2x RTX 6000 Ada ($14,000) |
| Storage | 1 TB SATA SSD ($50) | 2 TB NVMe ($150) | 4 TB NVMe ($300) | 8 TB NVMe RAID ($2,000) |
| Motherboard | B760 ($100) | B650 ($150) | X670 ($300) | TRX50 ($1,000) |
| PSU | 500W ($50) | 750W ($100) | 1000W ($200) | 1600W ($500) |
| Case | Basic ($50) | Mid-tower ($100) | Full-tower ($200) | Server chassis ($500) |
| **Total** | **~$440** | **~$1,150** | **~$3,350** | **~$20,900** |

### What Each Build Supports

| Build | Max Files | Query Latency (p95) | Indexing Speed | AI Model |
|-------|-----------|-------------------|---------------|----------|
| Budget (CPU) | 100K | 500ms | 3 files/s | nomic-embed-text |
| Mid-Range (GPU) | 500K | 100ms | 20 files/s | Qwen 2 VL 7B Q4 |
| High-End (GPU) | 2M+ | 50ms | 40 files/s | Qwen 2 VL 7B Q4 |
| Workstation | 5M+ | 30ms | 100 files/s | Multiple models |

### Upgrade Path

The architecture supports incremental upgrades:

1. **Start with budget build** ($440) — evaluate Kamelot with CPU mode
2. **Add GPU** (+$250) — when embedding quality matters
3. **Upgrade RAM** (+$100) — when index exceeds 100K files
4. **Add NVMe storage** (+$150) — when indexing speed is critical
5. **Replace CPU** (+$550) — when serving multiple concurrent users

No software license costs are incurred at any upgrade stage.

---

## Revenue Contribution Analysis

### Revenue by Segment (Year 3 Projected)

| Segment | Users | Revenue | % of Total | Margin |
|---------|-------|---------|------------|--------|
| Free (individual) | 90,000 | $0 | 0% | N/A |
| Community License | 8,000 | $600,000 | 24% | 95% |
| Bronze Support | 1,200 | $600,000 | 24% | 85% |
| Silver Support | 500 | $750,000 | 30% | 80% |
| Gold Support | 80 | $400,000 | 16% | 75% |
| Platinum Support | 10 | $150,000 | 6% | 70% |
| Consulting/Training | Variable | $100,000 | 4% | 90% |
| **Total** | **~100,000** | **~$2,600,000** | **100%** | **~82%** |

### Contribution Margin Analysis

The weighted average contribution margin across all revenue streams is approximately 82%. This is high because:
- Software delivery costs are near zero (digital distribution)
- Support costs scale sub-linearly (Rust is reliable, minimal breakage)
- The community handles a significant portion of Tier 1 support
- Enterprise support leverages the same codebase (no separate product)

### Customer Acquisition Cost (CAC) by Channel

| Channel | CAC | Conversion Rate | Time to Payback |
|---------|-----|----------------|-----------------|
| Organic (word-of-mouth) | $5 | 15% | Immediate |
| Search/SEO | $25 | 5% | 2 months |
| Community (Discord, GitHub) | $10 | 10% | 1 month |
| Technical blog/content | $50 | 3% | 3 months |
| Conference talks | $200 | 2% | 6 months |
| Paid advertising | $75 | 1% | 4 months |
| Enterprise sales | $2,000 | 20% | 6 months |

### LTV/CAC Ratio by Segment

| Segment | LTV (3yr) | CAC | LTV/CAC |
|---------|-----------|-----|---------|
| Free user (referral value) | $50 | $5 | 10.0 |
| Community License | $200 | $25 | 8.0 |
| Bronze Enterprise | $3,000 | $2,000 | 1.5 |
| Silver Enterprise | $12,000 | $2,000 | 6.0 |
| Gold Enterprise | $60,000 | $2,000 | 30.0 |
| Platinum Enterprise | $250,000 | $2,000 | 125.0 |

The high LTV/CAC for Gold and Platinum reflects the efficiency of enterprise sales for high-value accounts.

---

## Cost of Downtime

### Estimated Cost per Hour of Downtime

| Segment | Users Affected | Productivity Loss/Hour | Revenue Loss/Hour |
|---------|---------------|----------------------|-------------------|
| Individual | 1 | $50-$150 | $0 |
| Small team (5 users) | 5 | $250-$750 | $0 |
| Mid-size org (50 users) | 50 | $2,500-$7,500 | $500-$1,000 |
| Enterprise (500 users) | 500 | $25,000-$75,000 | $5,000-$10,000 |

### What Causes Downtime

| Cause | Frequency | Average Duration | Cost per Incident (50 users) |
|-------|-----------|-----------------|------------------------------|
| Daemon crash | Monthly | 2 minutes | $83-$250 |
| OOM (out of memory) | Quarterly | 5 minutes | $208-$625 |
| Disk full | Yearly | 15 minutes | $625-$1,875 |
| Qdrant failure | Quarterly | 5 minutes | $208-$625 |
| Ollama failure | Monthly | 3 minutes | $125-$375 |
| OS/reboot required | Semi-annual | 5 minutes | $208-$625 |
| Configuration error | Quarterly | 10 minutes | $417-$1,250 |
| **Expected monthly downtime** | | **~8 minutes** | **$167-$500** |

### Downtime Prevention Investment

To achieve 99.9% uptime (43 minutes/month max), an enterprise would invest:
- Automated monitoring and alerting: $500 setup + $50/month
- Redundant hardware: $1,000-$5,000 one-time
- Automated failover configuration: 20 hours of IT time (~$3,000)
- Regular backup verification: 2 hours/month (~$300)

This is significantly less than the cost of 8 minutes of monthly downtime for a 50-user organization ($2,000-$6,000/year).

---

## Sensitivity Analysis: Variables Affecting Unit Economics

### Variable: Electricity Price

| Electricity Rate | GPU Annual Cost | CPU Annual Cost | Cost Per Query (GPU) | Cost Per Query (CPU) |
|-----------------|----------------|-----------------|---------------------|---------------------|
| $0.08/kWh (low) | $11 | $8 | $0.00000010 | $0.00000038 |
| $0.12/kWh (US avg) | $16 | $12 | $0.00000015 | $0.00000057 |
| $0.20/kWh (high) | $27 | $20 | $0.00000025 | $0.00000095 |
| $0.40/kWh (Europe) | $54 | $40 | $0.00000050 | $0.00000190 |

### Variable: GPU Price

| GPU Model | Price | VRAM | Files/Second | Query Latency | Cost/File |
|-----------|-------|------|-------------|---------------|-----------|
| None (CPU) | $0 | 0 GB | 3 | 500ms | $0.00000057 |
| GTX 1660 6GB | $200 | 6 GB | 8 | 120ms | $0.00000030 |
| RTX 3060 12GB | $250 | 12 GB | 15 | 50ms | $0.00000018 |
| RTX 4090 24GB | $1,600 | 24 GB | 35 | 15ms | $0.00000012 |
| A100 80GB (cloud) | $3,500/hr | 80 GB | 100 | 5ms | Not applicable |

### Variable: Storage Type

| Storage | Cost/GB | Index 100K files (800 MB) | Query Latency Impact | Recommendation |
|---------|---------|--------------------------|---------------------|----------------|
| NVMe SSD | $0.08 | $0.06 | None | Best for index |
| SATA SSD | $0.06 | $0.05 | +5ms | Good for most |
| 7200 RPM HDD | $0.02 | $0.02 | +50ms | OK for flat store |
| 5400 RPM HDD | $0.015 | $0.01 | +100ms | Not recommended |
| Cloud EBS gp3 | $0.08/month | $0.06/month | +5-20ms | Ongoing cost |

### Variable: File Count

| File Count | Qdrant Index Size | Flat Store (100KB avg) | Total Storage | Annual Electricity |
|-----------|-------------------|----------------------|---------------|-------------------|
| 1,000 | 8 MB | 100 MB | 108 MB | $14 |
| 10,000 | 80 MB | 1 GB | 1.08 GB | $14 |
| 100,000 | 800 MB | 10 GB | 10.8 GB | $15 |
| 1,000,000 | 8 GB | 100 GB | 108 GB | $18 |
| 10,000,000 | 80 GB (sharded) | 1 TB | 1.08 TB | $45 |

---

## Competitive Pricing Analysis

### Direct Competitors (Semantic File Search)

| Product | Pricing | Self-Hosted | Semantic Search | Offline |
|---------|---------|-------------|-----------------|---------|
| **Kamelot** | **Free** | **Yes** | **Yes** | **Yes** |
| Google Drive | $10-$25/user/month | No | Limited | No |
| Dropbox | $12-$24/user/month | No | Limited (AI) | No |
| Box | $20-$45/user/month | No | No | No |
| OneDrive | $6-$22/user/month | No | No | No |
| M-Files | $300-$700/user/year | Yes | No | Yes |
| DocFetcher | Free | Yes | No | Yes |
| Elastic Enterprise Search | $100-$500/month | Yes | Basic | Yes |

### Indirect Competitors (Desktop Search)

| Product | Pricing | Semantic Search | File System Integration |
|---------|---------|-----------------|------------------------|
| Kamelot | Free | Yes | FUSE mount |
| Everything (voidtools) | Free | No | No |
| Alfred | $34 (Powerpack) | No | No |
| Flow Launcher | Free | No | No |
| macOS Spotlight | Built-in | No | No |
| Windows Search | Built-in | No | No |
| DocFetcher | Free | No | No |

### Kamelot's Competitive Advantage

1. **Only free semantic search tool** that works fully offline and self-hosted
2. **Only tool with FUSE filesystem integration** — existing apps work unchanged
3. **Only tool with per-file encryption** built into the search index
4. **Only tool with append-only immutable ledger** for ransomware rollback
5. **No per-query costs** — unlike cloud AI search tools

---

## Appendix: Cost Model Formulas

### Electricity Cost

```
Cost_electricity = Power_W / 1000 × Hours × Rate_per_kWh

Where:
  Power_W = System power draw in watts (idle or under load)
  Hours = Hours of operation per year
  Rate_per_kWh = Electricity rate in $/kWh
```

### Ingestion Cost

```
Cost_ingest = Time_hours × Power_kW × Rate_per_kWh
  + (Hardware_cost / Lifespan_years / Files_per_year)

Where:
  Time_hours = Total files / Files_per_second / 3600
  Power_kW = (CPU_power + GPU_power + system_overhead) / 1000
```

### Query Cost

```
Cost_query = Query_time_hours × Power_kW × Rate_per_kWh

Where:
  Query_time_hours = (embedding_time + search_time + render_time) / 3600
  Power_kW = incremental power draw during query
```

### Total Cost of Ownership (3 Year)

```
TCO_3yr = Hardware_one_time + (Electricity_annual × 3) + Storage_one_time
  + (Support_cost × 3) + (Maintenance_hours × Hourly_rate × 3)
```

### Return on Investment

```
ROI = (Time_saved_hours_per_year × Hourly_rate × Years) / TCO

Where:
  Time_saved_hours_per_year = Minutes_saved_per_day × 250_workdays / 60
  Hourly_rate = User's fully-loaded hourly cost
```

---

## References

- [Business Decision Record: Self-hosted over SaaS](01-business-decision-record.md#bdr-006-self-hosted-over-saas)
- [OKR Alignment: Revenue and adoption targets](06-okr-alignment.md)
- [SBOM: Infrastructure dependency costs](04-software-bill-of-materials.md)
- [North Star Metric: Value of time saved](02-north-star-metric.md)
- [Pricing and Licensing FAQ](../faqs/06-pricing-licensing.md)
- Hardware pricing sources: PCPartPicker, Amazon, Newegg (June 2026)
- Cloud pricing sources: Google Workspace, Dropbox, Microsoft 365 (June 2026)
- Electricity rates: US Energy Information Administration (2025)
- Market sizing: Gartner Magic Quadrant for Content Collaboration Platforms (2025)
- Productivity studies: McKinsey, Harvard Business Review (2020-2025)

---

*Unit economics are reviewed quarterly. All figures are estimates based on current hardware pricing, electricity rates, and projected adoption curves. Actual results may vary. This model assumes stable hardware prices and electricity rates. Major shifts in energy costs or GPU availability would require revision.*

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com