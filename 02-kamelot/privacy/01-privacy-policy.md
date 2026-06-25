                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 

# 01 — Privacy Policy

**Kamelot — The Sovereign Semantic Vector File System**

**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. Introduction
2. What Data Kamelot Collects
3. What Data Kamelot Does NOT Collect
4. How Data Is Processed
5. Data Retention
6. Third-Party Data Sharing
7. Updates to This Policy
8. Contact for Privacy Concerns
9. Jurisdiction-Specific Provisions
10. Conclusion

---

## 1. Introduction

### 1.1 Purpose

This privacy policy explains how Kamelot ("we," "us," or "our") handles user data. Kamelot is a local-first file management system: all data processing occurs on the user's own hardware. We do not operate cloud servers that process user data.

### 1.2 Scope

This policy applies to:

- The Kamelot software (daemon, CLI, GUI)
- The Kamelot website (kamelot.dev)
- Official Kamelot package repositories
- Community communication channels (Matrix, GitHub)

### 1.3 Principles

Kamelot's privacy approach is based on four principles:

1. **Local-first**: All user data processing occurs on the user's device
2. **Minimal collection**: We collect the absolute minimum data needed
3. **Transparency**: All data collection is documented and configurable
4. **No monetization**: We do not sell, rent, or profit from user data

---

## 2. What Data Kamelot Collects

### 2.1 Automatically Collected (Version Ping)

When Kamelot starts, it may send a minimal version ping:

- Kamelot version (e.g., "0.2.0")
- Operating system (e.g., "Linux 6.8.0")
- Date (rounded to the day)

**Purpose**: To estimate the size of the user base and which platforms are most common.

**Can be disabled**: Yes — `kml config set telemetry.version_ping false`

**Retention**: Logs are anonymized and retained for 30 days.

### 2.2 Crash Reports (Opt-In)

If enabled with `--telemetry`, crash reports contain:

- Stack trace (function names only, no variable values)
- Operating system version
- CPU model
- RAM amount
- Kamelot version
- Configuration (without keys or paths)

**Purpose**: To identify and fix software bugs.

**Enabled by default**: No

**Retention**: 90 days

### 2.3 Website Analytics

Our website (kamelot.dev) uses:

- **No third-party analytics** (no Google Analytics, no cookies)
- Server logs (IP address, page requested, timestamp — retained 7 days)
- **No tracking cookies**

---

## 3. What Data Kamelot Does NOT Collect

### 3.1 Never Collected

Kamelot NEVER collects:

| Data Type | Never Collected? | Notes |
|-----------|----------------|-------|
| File contents | ✓ Never | Files stay on your device |
| File names | ✓ Never | Encrypted locally |
| File metadata | ✓ Never | Encrypted locally |
| Search queries | ✓ Never | Processed locally |
| Embedding vectors | ✓ Never | Stored encrypted locally |
| Index structure | ✓ Never | Stored locally |
| Encryption keys | ✓ Never | Derived locally, never transmitted |
| Seed phrase | ✓ Never | Displayed once, never stored |
| IP address | ✓ Never (in software) | Web server logs briefly |
| Device identifiers | ✓ Never | No UUIDs, serial numbers, etc. |
| Usage patterns | ✓ Never | No analytics tracking |
| Biometric data | ✓ Never | Not applicable |
| Contact lists | ✓ Never | Not applicable |
| Location data | ✓ Never | Not applicable |
| Payment information | ✓ Never | Kamelot is free |

### 3.2 What Is Stored Locally

The following data is stored locally on the user's device:

- Encrypted file blobs (XChaCha20-Poly1305)
- Encrypted file metadata (in .aioss ledger)
- Encrypted vector embeddings (in Qdrant)
- Configuration file (no secrets)
- Crash report queue (if enabled, pending user upload)

All locally stored data is under the user's control and can be deleted at any time.

---

## 4. How Data Is Processed

### 4.1 Local Processing

All data processing in Kamelot happens on the user's device:

| Operation | Location | Description |
|-----------|----------|-------------|
| File encryption | User's device | XChaCha20-Poly1305 on local CPU |
| File decryption | User's device | XChaCha20-Poly1305 on local CPU |
| AI embedding | User's device | Qwen 2 VL via local Ollama |
| Vector search | User's device | Local Qdrant instance |
| File indexing | User's device | Local daemon process |
| K-Swarm sync | User's devices | Encrypted P2P between user's devices |

### 4.2 No Cloud Processing

Kamelot does not process user data in the cloud:

- No data is uploaded to Kamelot servers
- No data is sent to third-party AI APIs
- No data is processed on remote infrastructure
- No data is used for model training

### 4.3 Download-Time Processing

When downloading the Qwen 2 VL AI model:

- The model is downloaded from Hugging Face (or configured mirror)
- Only the model is downloaded — no user data is transmitted
- The model download is a one-time event (updates require user consent)

---

## 5. Data Retention

### 5.1 User Data

User data (files, metadata, indexes) is retained according to user configuration:

- **Default**: Retained indefinitely until user deletes
- **User control**: Users can delete individual files, entire indexes, or the complete store
- **Retention policies**: Configurable (e.g., "delete files not accessed in 365 days")

### 5.2 Telemetry Data

| Data Type | Retention Period | Deletion |
|-----------|-----------------|----------|
| Version ping | 30 days (anonymized logs) | Automatic |
| Crash reports | 90 days | Automatic |
| Website logs | 7 days | Automatic |

### 5.3 Deletion

Users can delete their data at any time:

```bash
# Delete all data
kml store delete --all

# Delete individual file
kml rm "document.pdf"

# Delete index only (keep files)
kml index delete

# Factory reset
kml init --reset
```

---

## 6. Third-Party Data Sharing

### 6.1 No Data Sharing

Kamelot does not share user data with third parties:

- No data sold to advertisers
- No data shared with analytics companies
- No data provided to AI training companies
- No data exchanged with "data brokers"

### 6.2 Third-Party Services Used

| Service | Purpose | Data Shared | Privacy Policy |
|---------|---------|-------------|----------------|
| GitHub | Source code hosting | None (user decides to visit) | GitHub Privacy Policy |
| Hugging Face | AI model distribution | None (model download only) | Hugging Face Privacy Policy |
| HackerOne | Bug bounty program | None (researcher submits reports) | HackerOne Privacy Policy |

None of these services receive user file data or file metadata.

### 6.3 Legal Disclosures

Kamelot may disclose data if required by law:

- Valid court order or subpoena
- Compliance with applicable laws
- Protection of rights or safety

In practice, Kamelot holds very little user data (version pings only). User files are never accessible to us.

---

## 7. Updates to This Policy

### 7.1 Notification

Users will be notified of policy changes through:

- In-app notification on next update
- Announcement on GitHub
- Blog post for significant changes

### 7.2 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-01 | Initial privacy policy |
| 1.1 | 2026-06-15 | Clarified crash report contents |

### 7.3 Material Changes

Material changes (changes that affect user rights or data collection) will be communicated at least 30 days in advance.

---

## 8. Contact for Privacy Concerns

### 8.1 Contact Methods

| Purpose | Contact |
|---------|---------|
| Privacy questions | privacy@kamelot.dev |
| Data deletion requests | privacy@kamelot.dev |
| GDPR inquiries | gdpr@kamelot.dev |
| Security issues | security@kamelot.dev |

### 8.2 Response Time

We aim to respond to privacy inquiries within:

- 48 hours for general questions
- 72 hours for deletion requests
- 30 days for complex GDPR inquiries

### 8.3 Data Protection Officer

Our Data Protection Officer can be reached at:

- Email: dpo@kamelot.dev
- Mail: Kamelot Privacy, c/o Lois-Kleinner, [Address]

---

## 9. Jurisdiction-Specific Provisions

### 9.1 GDPR (European Union)

Under the General Data Protection Regulation:

- **Data controller**: The user (Kamelot is a data processor)
- **Data processor**: Kamelot (processes data on user's hardware, per user's instructions)
- **Lawful basis**: Legitimate interest (for version ping); consent (for crash reports)
- **Data transfers**: No cross-border transfers (data stays on user's device)
- **Your rights**: Access, rectification, erasure, portability, restriction, objection

Since Kamelot processes data locally on the user's device, the user has complete control over their data.

### 9.2 CCPA (California)

Under the California Consumer Privacy Act:

- **No sale of data**: Kamelot does not sell user data
- **Right to know**: Users can see what data is collected (see Section 2)
- **Right to delete**: Users can delete all data (see Section 5)
- **Non-discrimination**: No price changes based on privacy choices

### 9.3 PIPEDA (Canada)

Under the Personal Information Protection and Electronic Documents Act:

- **Consent**: Implied for version ping (configurable)
- **Accountability**: Kamelot is transparent about data practices
- **Safeguards**: Encryption at rest (XChaCha20-Poly1305)
- **Access**: Users can access their data (which is all local)

### 9.4 LGPD (Brazil)

Under the Lei Geral de Proteção de Dados:

- **Legal bases**: Legitimate interest (version ping), consent (crash reports)
- **Data subject rights**: All applicable rights are supported
- **Data protection officer**: Appointed (see Section 8)

---

## 10. Conclusion

Kamelot is designed to respect your privacy. We collect the absolute minimum data needed to improve the software, never access your files, never transmit your data to third parties, and give you complete control over your data.

Because Kamelot is local-first, most privacy concerns simply don't apply. Your files stay on your device, encrypted with keys only you possess. No cloud server, no third party, no us.

---

## 11. Data Processing Agreements

### 11.1 When DPAs Are Needed

Under GDPR Article 28, data processing agreements (DPAs) are required when a processor processes personal data on behalf of a controller. Kamelot provides DPA templates for enterprise users who deploy Kamelot in a data-processing context.

### 11.2 Kamelot's Role

In most deployments, Kamelot acts as a **data processing tool**, not a data processor. The user is the data controller and Kamelot provides the technical infrastructure for local data management. However, when Kamelot's telemetry infrastructure receives and stores minimal data (version pings, crash reports), Kamelot acts as a data processor for that specific, limited data.

### 11.3 DPA Content

Standard Kamelot DPAs cover:

| Clause | Description |
|--------|-------------|
| Subject matter | Processing of telemetry data (version pings, crash reports) |
| Duration | Duration of software use + retention period |
| Nature and purpose | Software improvement, bug fixing |
| Type of personal data | None (telemetry is anonymized) |
| Categories of data subjects | Kamelot users |
| Obligations of processor | Data minimization, security, confidentiality |
| Sub-processing | Hugging Face (model distribution only) |
| Data transfer | No cross-border transfers of personal data |
| Deletion | Automatic deletion after retention period |
| Audit rights | Source code transparency enables verification |

### 11.4 Executing a DPA

Enterprise users can request a DPA by:

```bash
# Contact enterprise support
kml enterprise request-dpa --email legal@company.com
```

Or by emailing dpa@kamelot.dev with your entity details.

### 11.5 DPA and Self-Hosted Deployments

When Kamelot is fully self-hosted with telemetry disabled:

- No data reaches Kamelot-operated infrastructure
- No DPA is needed between user and Kamelot
- The user retains full control and responsibility
- Kamelot is purely a software tool, not a processor

### 11.6 Sub-Processors

Kamelot engages the following sub-processors:

| Sub-Processor | Service | Data Access |
|---------------|---------|-------------|
| Hugging Face | AI model hosting | None (direct download by user) |
| GitHub | Source code, issue tracking | None (user-initiated access) |
| Hetzner | Telemetry server hosting | Anonymized telemetry only |

Users will be notified 30 days before any new sub-processor is engaged.

## 12. Privacy Impact of K-Swarm Networking

### 12.1 Overview

K-Swarm is Kamelot's peer-to-peer mesh networking layer that enables encrypted synchronization between a user's own devices. This section analyzes the privacy implications of K-Swarm.

### 12.2 Discovery Protocol

K-Swarm device discovery uses:

- **LAN**: mDNS/Bonjour (local network only)
- **WAN**: DHT-based discovery (Kademlia distributed hash table)
- **Relay**: TURN server for NAT traversal (optional, user-configurable)

Privacy considerations for each:

| Discovery Method | Privacy Implication |
|-----------------|---------------------|
| mDNS (LAN) | Visible only on local network |
| DHT (WAN) | Peer ID visible to DHT network |
| TURN relay | Relay sees encrypted traffic only |

### 12.3 Data During Sync

When K-Swarm synchronizes between devices:

| Aspect | Detail |
|--------|--------|
| Data in transit | XChaCha20-Poly1305 encrypted |
| Metadata visible | File size (encrypted), sync timestamps |
| File names visible | No (encrypted in transit) |
| Peer identity | Ed25519 public key (pseudonymous) |
| Routing | Encrypted, relay cannot read content |

### 12.4 Privacy Recommendations for K-Swarm

Users concerned about privacy should:

1. **Use LAN-only mode**: `kml config set swarm.lan-only true`
2. **Disable WAN discovery**: `kml config set swarm.wan-discovery false`
3. **Use direct connections only**: `kml config set swarm.relay disabled`
4. **Limit peer count**: `kml config set swarm.max-peers 4`
5. **Rotate peer identities**: `kml swarm rotate-identity`

### 12.5 Metadata Exposure

Even with encryption, some metadata is unavoidably exposed:

- Number of files synced
- Size of encrypted blobs
- Sync frequency and timing
- Number of peers online

For most users, this metadata exposure is acceptable. For high-security environments, consider disabling K-Swarm entirely:

```bash
kml config set swarm.enabled false
```

### 12.6 Third-Party Relay Concerns

If using a third-party TURN relay for NAT traversal:

- The relay sees encrypted traffic only
- The relay cannot decrypt file data
- The relay sees source/destination IP addresses
- The relay sees connection timing

Users can self-host their own TURN server for maximum privacy:

```bash
kml config set swarm.turn-server "turn://user:pass@self-hosted.example.com:3478"
```

## Privacy Policy Change Management

### Notification Procedures

Changes to Kamelot's privacy policy follow a structured notification process to ensure users are informed and can respond.

#### Change Classification

| Change Type | Definition | Examples | Notice Period |
|-------------|------------|----------|--------------|
| Minor | No effect on user rights or data collection | Formatting, grammar, clarifications | No notice required |
| Standard | Changes to data handling or collection | New telemetry field, retention change | 30 days |
| Major | Significant impact on user privacy | New data collection, third-party sharing | 60 days |
| Emergency | Legal or security-driven changes | Compliance with new regulation, vulnerability fix | As soon as practical |

#### Notification Channels

| Channel | Audience | Timing | Format |
|---------|----------|--------|--------|
| In-app notification | All users | On next launch after change | Modal or banner |
| Email (if subscribed) | Registered users | At notice period start | Email with summary |
| GitHub release notes | Developers/contributors | At change publication | Markdown entry |
| Blog post | General public | At notice period start | Full article |
| Social media (Matrix/X) | Community | At notice period start | Short summary |
| Privacy policy page | Website visitors | Updated immediately | Versioned changelog |

#### Notification Content

Each change notification includes:

1. **Summary**: Plain-language description of what changed
2. **Effective date**: When the change takes effect
3. **What you need to do**: Any action required by the user
4. **How to opt out**: If applicable
5. **Contact**: For questions or concerns
6. **Link to diff**: GitHub commit showing exact changes

```markdown
# Privacy Policy Update — June 2026

## Summary
We have updated our privacy policy to clarify how K-Swarm 
mesh networking handles peer discovery metadata.

## Effective Date
July 19, 2026 (30 days from notification)

## What Changed
- Added Section 12.2: Expanded description of K-Swarm 
  discovery protocols and their privacy implications
- Added Section 12.4: Privacy recommendations for K-Swarm
- Updated Section 2.1: Clarified version ping data contents

## What You Need To Do
No action required. These changes are clarifications and 
additions, not reductions in privacy protection.

## Questions?
Contact privacy@kamelot.dev
```

### Version History

Every version of the privacy policy is preserved and accessible.

#### Version Archive

All privacy policy versions are stored at `https://kamelot.dev/privacy/archive/` with the following naming convention:

```
privacy-v{MAJOR}-{MINOR}-{YYYY-MM-DD}.md
privacy-v1-0-2026-01-01.md  (initial version)
privacy-v1-1-2026-06-15.md  (current)
```

#### Changelog

| Version | Date | Author | Changes | Impact |
|---------|------|--------|---------|--------|
| 1.0 | 2026-01-01 | Legal team | Initial privacy policy | N/A |
| 1.1 | 2026-06-15 | Legal + Engineering | Added K-Swarm privacy section, clarified crash reports | Standard |
| 1.2 | 2026-09-01 | Legal + Engineering | Added automated decision-making section (GDPR Art. 22) | Standard |
| 2.0 | 2027-01-01 | External audit | Major restructure for GDPR compliance certification | Major |

#### Diff Links

Each version change links to the exact GitHub diff:

```bash
# View changes between versions
git diff v1.0 -- docs/privacy/01-privacy-policy.md
git diff v1.1 -- docs/privacy/01-privacy-policy.md
git diff v1.0..v1.1 -- docs/privacy/01-privacy-policy.md
```

#### User Notification of Changes

```bash
# View privacy policy changelog
kml docs privacy changelog
# Privacy Policy Changelog
# 
# Current version: 1.1 (2026-06-15)
# Previous version: 1.0 (2026-01-01)
# 
# Changes in 1.1:
# - Added K-Swarm privacy section (§12)
# - Clarified crash report contents (§2.2)
# - Updated sub-processor list (§11.6)
# 
# Next review scheduled: 2026-12-15

# Acknowledge policy update
kml docs privacy acknowledge --version 1.1
# Privacy policy v1.1 acknowledged by user.
# Next reminder: 2026-12-15 (6 months)
```

### Consent Renewal

Certain privacy-related consents require periodic renewal.

#### Consent Types and Renewal Periods

| Consent Type | Renewal Period | Trigger | Method |
|-------------|----------------|---------|--------|
| Telemetry (version ping) | Annual | Policy change or yearly | In-app prompt |
| Crash reporting | Annual | Policy change or yearly | In-app prompt |
| K-Swarm P2P discovery | No renewal | On first use | Configuration setting |
| Third-party relay use | No renewal | On configuration | Configuration setting |
| Data processing (enterprise) | Per agreement | Per DPA terms | Signed agreement |

#### Consent Renewal Workflow

```mermaid
flowchart LR
    A[Policy Change] --> B{Change Type?}
    B -->|Minor| C[Log change]
    B -->|Standard| D[Notify user]
    B -->|Major| E[Notify + request consent]
    D --> F[30 day notice]
    E --> G[60 day notice]
    F --> H{User action?}
    G --> H
    H -->|Accept| I[Log consent]
    H -->|Reject| J{Revert or disable?}
    J -->|Can revert| K[Restore previous behavior]
    J -->|Cannot revert| L[Offer to disable feature]
    K --> M[Notify of current state]
    L --> M
```

#### Consent Record Keeping

All consent events are logged:

```bash
# View consent history
kml privacy consents --history
# Consent History
# 
# ┌──────────┬────────────┬──────────┬────────────┐
# │ Date     │ Type       │ Decision │ Version    │
# ├──────────┼────────────┼──────────┼────────────┤
# │ 2026-06- │ Telemetry  │ Granted  │ v1.1       │
# │ 15       │            │          │            │
# │ 2026-06- │ Crash      │ Denied   │ v1.1       │
# │ 15       │ reporting  │          │            │
# │ 2026-01- │ Telemetry  │ Granted  │ v1.0       │
# │ 01       │            │          │            │
# │ 2026-01- │ Crash      │ Denied   │ v1.0       │
# │ 01       │ reporting  │          │            │
# └──────────┴────────────┴──────────┴────────────┘
```

### Impact Assessment

Before any privacy policy change, an impact assessment is conducted.

#### Assessment Framework

| Factor | Assessment Question | Scoring |
|--------|-------------------|---------|
| Data scope | Does this change collect new data types? | 0 (none) to 5 (new PII) |
| Data sensitivity | Does this change affect sensitive data? | 0 (none) to 5 (health/biometric) |
| User control | Can users opt out of the change? | 0 (full control) to 5 (no control) |
| Transparency | Is the change clearly documented? | 0 (fully) to 5 (opaque) |
| Legal impact | Does this affect regulatory compliance? | 0 (none) to 5 (new obligations) |

**Risk Score = Sum of all factors**

| Risk Level | Score | Required Action |
|------------|-------|-----------------|
| Low | 0-5 | Standard notice |
| Medium | 6-10 | Extended notice + FAQ |
| High | 11-15 | Prior consultation + opt-in consent |
| Critical | 16-25 | External privacy review + full re-consent |

#### Assessment Template

```yaml
# impact-assessment-template.yaml
change:
  title: "Privacy Policy v1.2"
  date: "2026-09-01"
  author: "privacy-team@kamelot.dev"
  
assessment:
  data_scope:
    score: 2
    reasoning: "Adds documentation of automated decision-making but no new data collection"
  
  data_sensitivity:
    score: 0
    reasoning: "No new data collected"
  
  user_control:
    score: 1
    reasoning: "All automated features are configurable by user"
  
  transparency:
    score: 0
    reasoning: "Full documentation in source code and policy"
  
  legal_impact:
    score: 2
    reasoning: "GDPR Article 22 compliance documentation"
  
  risk_score: 5
  risk_level: "Low"
  
  required_action: "Standard notice (30 days)"
```

---

## 13. Automated Decision-Making

### 13.1 GDPR Article 22

GDPR Article 22 gives individuals the right not to be subject to decisions based solely on automated processing that produce legal effects or similarly significant effects.

### 13.2 Kamelot's Automated Features

Kamelot includes several automated features:

| Feature | Automated? | Significant Effect? | Human Oversight? |
|---------|-----------|---------------------|-------------------|
| File tagging | Yes | No (organizational only) | Configurable |
| Semantic search ranking | Yes | No (retrieval only) | No |
| Cache eviction | Yes | No (performance only) | Configurable |
| K-Swarm conflict resolution | Yes | Yes (for data integrity) | Logged for review |
| Crash report generation | Yes | No (bug fixing only) | User-reviewed |

### 13.3 No Automated Decisions with Legal Effect

Kamelot's automated processing does not:

- Make credit decisions
- Evaluate job performance
- Assess educational achievement
- Determine insurance eligibility
- Predict criminal behavior
- Make hiring decisions

All automated processing is limited to file management and system optimization.

### 13.4 User Control

Users can configure or disable automated features:

```bash
# Disable auto-tagging
kml config set ai.auto-tagging false

# Disable automatic cache management
kml config set cache.auto-evict false

# Review conflict resolution logs
kml swarm conflicts --log

# Manually approve sync conflicts
kml swarm resolve --manual
```

### 13.5 Transparency

Kamelot documents all automated decision-making logic in:

- Source code (fully auditable)
- Process documentation (05-process-documentation.md)
- Release notes for algorithm changes

### 13.6 Right to Human Intervention

For any automated decision that produces significant effects, users can:

1. Disable the automated feature entirely
2. Request explanation of the decision logic
3. Request human review of specific decisions
4. Appeal automated decisions by contacting support@kamelot.dev

*For privacy inquiries: privacy@kamelot.dev*

*Last updated: June 2026*

*This document is part of the Privacy documentation suite. See also:*
- *02-data-collection.md — Detailed data collection practices*
- *03-user-rights.md — User data rights*
- *04-anonymization.md — Anonymization practices*
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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

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
