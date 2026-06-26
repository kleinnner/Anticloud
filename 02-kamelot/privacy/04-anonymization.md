                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 

# 04 — Anonymization

**Kamelot — The Sovereign Semantic Vector File System**

**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. Introduction
2. Why Anonymization Is Largely N/A
3. Crash Report Anonymization
4. Version Ping Anonymization
5. Aggregated Statistics
6. DPIA Summary
7. Conclusion

---

## 1. Introduction

Since Kamelot collects minimal data by design, traditional anonymization techniques are largely unnecessary. This document describes the anonymization practices that apply to the small amount of data Kamelot does collect.

---

## 2. Why Anonymization Is Largely N/A

### 2.1 No Personal Data Collected

Kamelot does not collect personal data:

- No user names
- No email addresses
- No IP addresses (in software telemetry)
- No device identifiers
- No account information
- No file content or metadata

Because we collect no personal data, there is nothing to anonymize for most of the system.

### 2.2 Local Data

All user data (files, metadata, indexes) remains on the user's device and is never transmitted to Kamelot servers. Anonymization of local data is the user's choice.

### 2.3 When Anonymization Applies

Anonymization practices apply only to:

1. Crash reports (opt-in)
2. Version pings (default on)
3. Aggregated statistics (derived from above)

---

## 3. Crash Report Anonymization

### 3.1 What We Anonymize

In crash reports, the following fields are anonymized:

| Field | Anonymization Method |
|-------|---------------------|
| IP address | Stripped (not logged) |
| Timestamp | Rounded to the hour |
| Stack trace | Function names only (no file paths) |
| Configuration | Keys and paths removed |
| Username in paths | Replaced with "user" placeholder |

### 3.2 IP Address Handling

Crash reports are sent via HTTPS to our server. The server:

1. Receives the HTTP request
2. Records the IP address briefly for rate limiting
3. Strips the IP address from the stored report
4. Retains only the anonymized report

IP addresses are retained for a maximum of 24 hours in memory-only logs, then discarded.

### 3.3 Timestamp Rounding

Timestamps in crash reports are rounded to the hour:

- Original: `2026-06-15T14:30:00.123456Z`
- Anonymized: `2026-06-15T14:00:00Z`

This prevents identification based on precise timing of events.

### 3.4 Path Sanitization

File paths in stack traces are sanitized:

- Original: `/home/alice/Documents/kamelot/src/store.rs`
- Anonymized: `src/store.rs`

User-specific path components are replaced with placeholders:

- Original: `/home/alice/.config/kamelot/config.yaml`
- Anonymized: `~/config/kamelot/config.yaml`

### 3.5 User Identifier Removal

Crash reports contain no user identifiers. Specifically:

- No user IDs (Kamelot has no user system)
- No email addresses
- No device names
- No UUIDs or serial numbers

---

## 4. Version Ping Anonymization

### 4.1 What We Anonymize

The version ping is already anonymous by design:

| Field | Anonymization Method |
|-------|---------------------|
| Version | Left as-is (not personal data) |
| OS | Left as-is (not personal data) |
| Date | Rounded to the day |
| IP address | Stripped (not logged) |

### 4.2 No Persistent Identifiers

The version ping contains no persistent identifiers:

- No cookies
- No device fingerprints
- No tracking parameters
- No referral information

Each ping is independent and unlinkable to previous pings.

### 4.3 IP Address Handling

Our version ping endpoint:

1. Accepts the GET request
2. Records the version, OS, and date
3. Discards the IP address immediately
4. Increments an anonymous counter

IP addresses are never stored alongside version ping data.

### 4.4 Cannot Identify Individuals

The combination of version, OS, and date is not sufficient to identify an individual:

- Many users run the same version on the same OS
- The date has day granularity (thousands of pings per day)
- No IP, no device ID, no user ID

---

## 5. Aggregated Statistics

### 5.1 What We Publish

We may publish aggregated statistics such as:

- "Kamelot has approximately 10,000 monthly active users"
- "60% of users are on Linux, 25% on Windows, 15% on macOS"
- "Version 0.2.0 adoption rate: 45%"

### 5.2 Aggregation Methods

Statistics are aggregated such that:

- Individual users cannot be identified
- Minimum threshold: 100 users per data point
- No individual trajectories are tracked
- Only aggregate percentages are published

### 5.3 What We Do NOT Publish

- Individual user counts per country
- Usage patterns by time of day
- Hardware configurations by user
- Any data that could identify a specific user

---

## 6. DPIA Summary

### 6.1 Data Protection Impact Assessment

A Data Protection Impact Assessment (DPIA) is required under GDPR for processing that is likely to result in high risk to individuals' rights and freedoms.

Kamelot's DPIA conclusion: **No DPIA required**, because:

1. No systematic evaluation of personal aspects (profiling)
2. No large-scale processing of special categories of data
3. No systematic monitoring of publicly accessible areas

### 6.2 Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Data breach of telemetry data | Very low | Minimal | Minimal data collected, anonymized |
| Re-identification from crash reports | Very low | Low | Paths sanitized, IDs removed |
| Tracking via version pings | Very low | Low | No persistent identifiers |
| User data exposure | Zero | Critical | Data never transmitted |

### 6.3 Data Protection by Design

Kamelot implements data protection by design:

- **Minimization**: Collect only what's necessary
- **Anonymization**: Anonymize what we collect
- **Transparency**: Document everything
- **User control**: Users can disable all collection
- **Security**: Encrypt everything locally

---

## 7. Conclusion

Since Kamelot collects minimal data — and no personal data — traditional anonymization is largely unnecessary. The small amount of data collected (crash reports, version pings) is anonymized by:

- Stripping IP addresses
- Rounding timestamps
- Sanitizing paths
- Removing user identifiers
- Aggregating statistics

The result is that no individual user can be identified from any data Kamelot collects.

---

## 8. Statistical Disclosure Control

### 8.1 Overview

Statistical Disclosure Control (SDC) refers to techniques used to prevent the identification of individuals from published statistics. While Kamelot's published statistics are already highly aggregated, we apply SDC as an additional safeguard.

### 8.2 Techniques Applied

| Technique | Description | Applied To |
|-----------|-------------|------------|
| Cell suppression | Suppress statistics based on < 100 users | All published stats |
| Rounding | Round percentages to nearest 5% | Adoption rates |
| Perturbation | Add small random noise to counts | Aggregate counters |
| Thresholding | Minimum count requirement | Any breakdown |
| Frequency-based | Suppress infrequent combinations | OS × version breakdowns |

### 8.3 Minimum Threshold Rules

| Data Point | Minimum Threshold |
|------------|------------------|
| Total users | 1 (but reported as ≥100 if <100) |
| OS breakdown | 100 users per OS |
| Version breakdown | 100 users per version |
| OS × version combination | 100 users per combination |
| Country breakdown | 500 users per country (not collected) |

### 8.4 Perturbation Details

For published aggregate counts:

```
Actual count: 12,347
Perturbed count: 12,350 (± 0.1% noise)
Noise distribution: Laplace(0, σ=0.05%)
```

This small perturbation makes it impossible to infer exact counts while preserving statistical accuracy for decision-making.

## 9. Re-identification Risk Assessment

### 9.1 Risk Model

We assess re-identification risk using three criteria:

1. **Uniqueness**: How unique is the data point?
2. **Linkability**: Can it be linked to external data?
3. **Inference**: What can be inferred from it?

### 9.2 Version Ping Risk Assessment

| Criterion | Assessment | Rationale |
|-----------|------------|-----------|
| Uniqueness | Very Low | Thousands share same version + OS + date |
| Linkability | Very Low | No persistent identifiers, no IP logged |
| Inference | Very Low | Only version, OS, date — no personal data |
| Overall risk | Very Low | Cannot identify individuals |

### 9.3 Crash Report Risk Assessment

| Criterion | Assessment | Rationale |
|-----------|------------|-----------|
| Uniqueness | Low | Stack trace may be unique to specific bug |
| Linkability | Very Low | No identifiers, IP stripped |
| Inference | Low | May reveal software/hardware used |
| Overall risk | Low | Anonymization further reduces risk |

### 9.4 Motivated Attacker Scenario

Even against a motivated attacker with access to:

- External datasets (breach data, public records)
- Advanced deanonymization techniques
- Computational resources

The risk remains very low because:

1. No personal data is collected
2. No persistent identifiers exist
3. Data is too sparse and unspecific
4. No behavioral or preference data

### 9.5 Period Risk Re-assessment

We re-assess re-identification risk:

| Trigger | Action |
|---------|--------|
| Quarterly | Internal review of data collected |
| New data collection feature | Privacy review before launch |
| Published breach in similar software | Risk model update |
| Regulatory guidance change | Compliance review |
| Annual | Full re-identification risk assessment |

## 10. Pseudonymization Strategies

### 10.1 Pseudonymization vs Anonymization

| Aspect | Pseudonymization | Anonymization |
|--------|-----------------|---------------|
| Reversible? | Yes (with key) | No |
| Personal data? | Still personal data | Not personal data |
| GDPR scope | Still in scope | Out of scope |
| Use case | Crash reports (temporary) | Published statistics |

### 10.2 Where Kamelot Uses Pseudonymization

| Context | Method | Reversibility |
|---------|--------|---------------|
| Crash report IDs | UUID v4 (random) | Not reversible |
| DHT peer IDs | Ed25519 public key | Not reversible (keypair) |
| Telemetry session | Random session token | 24-hour window |

### 10.3 Pseudonymization Best Practices

Kamelot follows these pseudonymization best practices:

1. **Separation**: Pseudonymization keys stored separately from data
2. **Rotation**: Keys and identifiers rotated periodically
3. **Limited retention**: Pseudonymized data retained only as long as needed
4. **Access control**: Pseudonymization keys accessible only to authorized personnel
5. **Audit trail**: All pseudonymization operations logged

### 10.4 Key Management

For pseudonymization that requires reversibility:

| Key | Storage | Access | Rotation |
|-----|---------|--------|----------|
| Crash report mapping | Not stored (UUID is random) | N/A | Per report |
| Session tokens | Memory only | Server process | 24 hours |
| Peer identities | Local config file | User only | User-initiated |

### 10.5 When to Use Which

| Scenario | Approach | Reason |
|----------|----------|--------|
| Published statistics | Anonymization | Out of GDPR scope |
| Internal debugging | Pseudonymization | May need to correlate reports |
| User support | Pseudonymization (session-based) | Temporary correlation |
| Long-term analysis | Anonymization (aggregation) | No personal data needed |

## 11. Anonymization in Machine Learning

### 11.1 Training Data

Kamelot does not collect user data for machine learning training:

- No file contents are used for training
- No search queries are used for training
- No usage patterns are used for training
- No telemetry data is used for training

The AI model (Qwen 2 VL) is downloaded pre-trained and runs locally.

### 11.2 Local Model Customization

If a user chooses to fine-tune the local AI model:

- Fine-tuning occurs entirely on the user's device
- Training data never leaves the device
- The fine-tuned model remains on the device
- No training data is transmitted to Kamelot or third parties

### 11.3 Differential Privacy

For future features that may involve aggregation of model improvements:

- Differential privacy (ε = 1.0 or lower) would be applied
- Randomized response for categorical data
- Gradient perturbation for any model updates
- Privacy budget tracking per user

Currently, no such features exist in Kamelot.

### 11.4 Federated Learning Considerations

Kamelot does not currently implement federated learning. If implemented in the future:

- No raw data would leave user devices
- Only model gradient updates would be shared
- Differential privacy would be mandatory
- User opt-in would be required
- Full transparency about what is shared

## Anonymization Techniques Comparison

### k-Anonymity

k-anonymity ensures that each record is indistinguishable from at least k-1 other records.

#### How It Works

K-anonymity works by generalizing or suppressing quasi-identifiers (attributes that could identify an individual when combined) so that each combination appears at least k times in the dataset.

#### Example

```
Original records:
  {age: 29, zip: 12345, diagnosis: "flu"}
  {age: 31, zip: 12346, diagnosis: "diabetes"}
  {age: 30, zip: 12344, diagnosis: "flu"}

After 3-anonymity (generalize age to range, zip to first 3 digits):
  {age: 28-32, zip: 123**, diagnosis: "flu"}
  {age: 28-32, zip: 123**, diagnosis: "diabetes"}
  {age: 28-32, zip: 123**, diagnosis: "flu"}
```

#### Application in Kamelot

| Use Case | k Value | Quasi-Identifiers | Generalization |
|----------|---------|-------------------|----------------|
| Published statistics | k=100 | OS, version, date | OS → category, version → major.minor, date → month |
| Crash report aggregation | k=50 | CPU, OS, crash_type | CPU → family, OS → family, timestamp → day |
| Telemetry reports | k=100 | Version, OS, architecture | Version → major.minor, date → month |

#### Strengths and Weaknesses

| Aspect | Rating | Explanation |
|--------|--------|-------------|
| Simplicity | ⭐⭐⭐⭐⭐ | Easy to understand and implement |
| Effectiveness | ⭐⭐⭐⭐ | Prevents simple re-identification |
| Data utility | ⭐⭐⭐ | Generalization reduces precision |
| Homogeneity attacks | ⭐⭐ | Doesn't handle homogeneous groups |
| Background knowledge | ⭐ | Assumes attacker has no prior knowledge |

#### Implementation

```bash
# Apply k-anonymity to a dataset
kml privacy k-anonymity --input stats.csv --k 100 --output anonymized.csv
# Applying k-anonymity with k=100...
# Quasi-identifiers: [version, os, architecture, date]
# Generalization applied:
#   version: x.y.* (major.minor only)
#   os: family only (linux, windows, macos)
#   date: YYYY-MM (month granularity)
# Result: 100% of records satisfy k=100
```

### l-Diversity

l-diversity extends k-anonymity by ensuring diversity in sensitive attributes within each equivalence class.

#### How It Works

For each group of identical quasi-identifiers, there must be at least l "well-represented" values for the sensitive attribute.

#### Types of l-Diversity

| Type | Description | Example (l=3) |
|------|-------------|---------------|
| Distinct l-diversity | At least l distinct sensitive values | diagnosis must have ≥3 distinct values |
| Entropy l-diversity | Entropy of sensitive values ≥ log(l) | Even distribution across diagnoses |
| Recursive (c,l)-diversity | Most frequent value doesn't dominate | Top diagnosis < c × bottom diagnoses |

#### Application in Kamelot

Kamelot applies l-diversity when publishing any statistics that include a sensitive dimension:

| Context | l Value | Sensitive Attribute | Diversity Type |
|---------|---------|-------------------|----------------|
| Error rate by platform | l=3 | Error type | Distinct |
| Performance by hardware | l=4 | Performance tier | Recursive (c=2) |
| Feature adoption by region | l=3 | Feature category | Entropy (log 3) |

#### Implementation

```bash
kml privacy l-diversity --input stats.csv --l 3 --sensitive error_type
# Checking l-diversity (l=3)...
# Equivalence class analysis:
# ┌──────────────────────┬────────┬──────────┐
# │ Quasi-ID Group       │ Count  │ l-Div?   │
# ├──────────────────────┼────────┼──────────┤
# │ linux, 0.2, x86_64   │ 1,234  │ ✅ (5)   │
# │ windows, 0.1, x86_64 │ 567    │ ✅ (4)   │
# │ macos, 0.2, aarch64  │ 89     │ ❌ (2)   │
# └──────────────────────┴────────┴──────────┘
# Result: 2 of 3 groups satisfy l=3
# Action: Further generalize macos group or suppress
```

#### Strengths and Weaknesses

| Aspect | Rating | Explanation |
|--------|--------|-------------|
| Homogeneity protection | ⭐⭐⭐⭐ | Prevents same-value attacks |
| Skewness protection | ⭐⭐⭐ | Less effective with skewed distributions |
| Similarity protection | ⭐⭐ | Similar values may still leak information |
| Data utility | ⭐⭐⭐ | More generalization than k-anonymity alone |
| Implementation complexity | ⭐⭐ | More complex than plain k-anonymity |

### Differential Privacy

Differential privacy provides mathematical guarantees about privacy protection regardless of attacker's background knowledge.

#### How It Works

Differential privacy adds calibrated noise to query results, making it impossible to determine whether any individual's data is included.

**ε-Differential Privacy**: An algorithm M satisfies ε-differential privacy if for any two datasets D and D' differing by one record, and any output S:

```
P[M(D) ∈ S] ≤ e^ε × P[M(D') ∈ S]
```

#### Epsilon Values

| ε Value | Privacy Level | Noise Level | Use Case |
|---------|---------------|-------------|----------|
| ε ≤ 0.1 | Very high | High | Medical data, financial data |
| ε = 0.1-1.0 | High | Moderate | Most privacy-sensitive applications |
| ε = 1.0-10 | Moderate | Low | General analytics |
| ε > 10 | Low | Very low | Non-sensitive aggregate statistics |

#### Application in Kamelot

| Context | ε Value | Mechanism | Sensitivity |
|---------|---------|-----------|-------------|
| User count estimation | ε = 1.0 | Laplace mechanism | 1 (presence/absence) |
| Feature adoption rates | ε = 2.0 | Gaussian mechanism | 1/n (proportions) |
| Performance benchmarks | ε = 5.0 | Laplace mechanism | Range of metric |
| Published statistics | ε = 0.5 | Laplace mechanism | 1 (count queries) |

#### Implementation

```bash
# Apply differential privacy to query
kml privacy differential-privacy \
  --query "SELECT COUNT(*) FROM version_pings WHERE os = 'linux'" \
  --epsilon 1.0 \
  --sensitivity 1
# Query result (without noise): 12,347
# Query result (with ε=1.0 noise): 12,351 (± 7.2)
# 
# Privacy budget used: ε = 1.0
# Remaining budget: ε = 9.0 (of 10.0 total per user)

# Track privacy budget
kml privacy budget --user token-a1b2c3d4
# User: token-a1b2c3d4
# Total budget: ε = 10.0
# Used: ε = 3.5
# Remaining: ε = 6.5
# Queries:
#   2026-06-15: ε = 1.0 (count query)
#   2026-06-14: ε = 0.5 (proportion query)
#   2026-06-10: ε = 2.0 (benchmark query)
```

#### Strengths and Weaknesses

| Aspect | Rating | Explanation |
|--------|--------|-------------|
| Mathematical guarantee | ⭐⭐⭐⭐⭐ | Provable privacy regardless of attacker |
| Background knowledge resistance | ⭐⭐⭐⭐⭐ | Immune to auxiliary information |
| Composition | ⭐⭐⭐⭐ | Multiple queries can be tracked |
| Data utility | ⭐⭐ | Noise reduces accuracy for small datasets |
| Implementation complexity | ⭐⭐ | Requires careful calibration |
| Interpretability | ⭐ | Epsilon is non-intuitive for non-experts |

### Implementation Trade-offs

#### Comparison Matrix

| Criterion | k-Anonymity | l-Diversity | Differential Privacy |
|-----------|-------------|-------------|---------------------|
| Protection against re-identification | Good | Better | Best | 
| Protection against attribute disclosure | Poor | Good | Best |
| Background knowledge resistance | Poor | Poor | Best |
| Data utility at low privacy | Excellent | Good | Poor |
| Data utility at high privacy | Good | Fair | Fair |
| Ease of implementation | Easy | Moderate | Complex |
| Computational overhead | Low | Low | Low |
| Scalability | Excellent | Excellent | Excellent |
| Regulatory acceptance | Moderate | Moderate | Growing |
| Composability | Poor | Poor | Excellent |

#### When to Use Each

| Scenario | Recommended Technique | Rationale |
|----------|---------------------|-----------|
| Publishing aggregate statistics | Differential privacy (ε=0.5-1.0) | Strongest guarantee, mathematical proof |
| Internal analytics with low sensitivity | k-Anonymity (k=100) | Simple, preserves data utility |
| Mixed sensitivity datasets | k-Anonymity + l-Diversity | Protects against homogeneity attacks |
| Multiple queries on same data | Differential privacy with budget | Composability prevents accumulation |
| Small datasets (< 1000 records) | k-Anonymity | Differential privacy noise too destructive |
| Regulatory compliance (GDPR, CCPA) | Combination of all three | Defense in depth |
| Real-time analytics | k-Anonymity (pre-computed) | Lower computational overhead |

#### Kamelot's Default Configuration

```yaml
# privacy/anonymization-config.yaml
anonymization:
  default_technique: k_anonymity
  k_value: 100
  l_diversity: 3
  differential_privacy:
    enabled: true
    default_epsilon: 1.0
    max_budget_per_user: 10.0
    budget_tracking: true
  aggregation:
    enabled: true
    minimum_threshold: 100
  techniques:
    - k_anonymity: "Used for published statistics"
    - l_diversity: "Used for sensitive attribute statistics"
    - differential_privacy: "Used for per-query protection"
```

#### Overhead Comparison

| Technique | Setup Time | Query Time | Storage Overhead | Maintenance |
|-----------|-----------|------------|------------------|-------------|
| k-Anonymity | 2-10 ms | < 1 ms | 0% (in-place) | Low |
| l-Diversity | 5-20 ms | < 1 ms | 0% (in-place) | Low |
| Differential Privacy | < 1 ms | 1-5 ms | 0% | Medium (budget tracking) |

#### Selecting the Right Technique

```bash
# Automated technique selection
kml privacy recommend --dataset stats.csv --sensitivity medium
# Recommended: k-anonymity + differential privacy
# 
# Reasoning:
# - Dataset size: 12,347 (adequate for k=100)
# - Sensitivity: medium (error rates by platform)
# - Query pattern: one-time publication
# 
# Configuration:
#   technique: k_anonymity
#   k: 100
#   differential_privacy: true
#   epsilon: 0.5
# 
# Rationale: k-anonymity provides adequate protection
# for publication, while differential privacy adds
# additional protection for individual queries.
```

---

## 12. Anonymization Testing and Validation

### 12.1 Testing Framework

Kamelot tests its anonymization procedures using:

| Test | Description | Frequency |
|------|-------------|-----------|
| Re-identification attempt | Simulated attempt to identify users | Quarterly |
| Statistical disclosure | Check for disclosure in published stats | Per publication |
| Linkage test | Attempt to link data to external datasets | Annually |
| k-anonymity check | Verify k ≥ 100 for all published data | Per dataset |
| l-diversity check | Verify diversity in sensitive attributes | Per dataset |

### 12.2 k-Anonymity Requirements

All published aggregate data must satisfy:

- **k = 100**: At least 100 individuals in each equivalence class
- **No unique cells**: No combination of attributes identifies fewer than 100 users

### 12.3 Testing Tools

Kamelot uses the following tools for anonymization testing:

```bash
# ARX anonymization tool for k-anonymity testing
arx validate --input stats.csv --k 100

# Custom re-identification simulation
kml privacy simulate-reidentification --input data.json

# Statistical disclosure testing
kml privacy test-disclosure --input published-stats.json
```

### 12.4 Validation Reports

After each anonymization test, a validation report is generated:

```yaml
test_date: 2026-06-15
test_type: k-anonymity
dataset: version_ping_aggregate
result: PASS
k_minimum: 100
notes: All equivalence classes meet k=100 threshold
action_items: []
```

### 12.5 Automated Anonymization Pipeline

For enterprise deployments, anonymization can be automated:

```yaml
# .kamelot/anonymization-policy.yaml
anonymization:
  enabled: true
  methods:
    - type: aggregation
      minimum_threshold: 100
    - type: rounding
      precision: day
    - type: perturbation
      distribution: laplace
      epsilon: 1.0
  audit:
    log_all_anonymizations: true
    retention_days: 365
```

This pipeline ensures consistent anonymization across all data exports without manual intervention.

### 12.6 Continuous Validation

Anonymization is validated continuously:

1. **Pre-publication**: Validate before any data release
2. **Post-publication**: Monitor for unexpected disclosures
3. **Schema change**: Re-validate when data collection changes
4. **Regular interval**: Full re-validation quarterly

*For anonymization questions: privacy@kamelot.dev*

*Last updated: June 2026*

*For a practical guide to configuring anonymization settings, refer to the Kamelot CLI reference: `kml help privacy`.*

*This document is part of the Privacy documentation suite. See also:*
- *01-privacy-policy.md — Full privacy policy*
- *02-data-collection.md — Data collection practices*
- *03-user-rights.md — User data rights*
- *05-cross-border-transfers.md — Cross-border data transfers*
- *06-consent-management.md — Consent management*

---

*Kamelot is a project of Lois-Kleinner & 0-1.gg. © 2026. All rights reserved.*

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com