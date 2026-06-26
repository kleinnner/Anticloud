<!--
     ▄▄▄   ▄▄▄  ▄▄▄  ▄▄▄▄▄▄▄▄              ▄▄▄▄      ▄▄▄▄     ▄▄▄     
    ██     ███  ███  ██▀▀▀▀▀▀            ▄█▀▀▀▀█    ██▀▀██      ██    
    ██     ████████  ██           ██     ██▄       ██    ██     ██    
    ██     ██ ██ ██  ███████   ▄▄▄██▄▄▄   ▀████▄   ██ ██ ██     ██    
  ▀▀█▄     ██ ▀▀ ██  ██        ▀▀▀██▀▀▀       ▀██  ██    ██     ▄█▀▀  
    ██     ██    ██  ██           ██     █▄▄▄▄▄█▀   ██▄▄██      ██    
    ██     ▀▀    ▀▀  ▀▀                   ▀▀▀▀▀      ▀▀▀▀       ██    
    ▀█▄▄                                                      ▄▄█▀    

MF+SO — Multi Factor+ Sign On
by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner
The Sovereign Identity & Authentication Vault
-->

# CCPA Compliance — Consumer Rights, Opt-Out, Data Inventory & Enforcement

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | MFSO-COMP-CCPA-001 |
| **Version** | 1.0 |
| **Classification** | Internal — Confidential |
| **Effective Date** | 2026-01-01 |
| **Owner** | Privacy & Compliance Team |
| **Approved By** | Lois-Kleinner, CISO |

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [CCPA Applicability](#2-ccpa-applicability)
3. [Consumer Rights](#3-consumer-rights)
4. [Right to Know](#4-right-to-know)
5. [Right to Delete](#5-right-to-delete)
6. [Right to Opt-Out](#6-right-to-opt-out)
7. [Right to Correct](#7-right-to-correct)
8. [Right to Limit Use of Sensitive PI](#8-right-to-limit-use-of-sensitive-pi)
9. [Right to Non-Discrimination](#9-right-to-non-discrimination)
10. [Data Inventory and Mapping](#10-data-inventory-and-mapping)
11. [Privacy Notice](#11-privacy-notice)
12. [Opt-Out Mechanisms](#12-opt-out-mechanisms)
13. [Service Provider Agreements](#13-service-provider-agreements)
14. [Minors and Children's Privacy](#14-minors-and-childrens-privacy)
15. [Enforcement and Penalties](#15-enforcement-and-penalties)
16. [Compliance Program](#16-compliance-program)
17. [Appendices](#17-appendices)

## 1. Executive Summary

The California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA) establish comprehensive privacy rights for California residents. This document assesses MF+SO's compliance posture against CCPA/CPRA requirements and outlines the policies, procedures, and controls implemented to ensure compliance.

MF+SO's local-first, zero-knowledge architecture provides inherent privacy advantages. The minimal data collected, coupled with strong technical controls, positions MF+SO favorably for CCPA compliance. This document details the specific compliance measures implemented across all relevant CCPA/CPRA requirements.

### 1.1 CCPA vs CPRA

| Aspect | CCPA (2018) | CPRA (2020, effective 2023) |
|--------|-------------|------------------------------|
| Rights | Know, Delete, Opt-Out, Non-Discrimination | Added: Correct, Limit Sensitive PI, Automated Decision-Making |
| Sensitive PI | Not defined | Defined and protected |
| Business threshold | $25M+ revenue, 50K+ records, 50%+ revenue from sale | Additional: $25M+ revenue only (simplified) |
| Enforcement | AG enforcement | Dedicated enforcement agency (CPPA) |
| Exemptions | Employment, B2B | Modified |
| Risk assessment | Not required | Required for certain processing |

## 2. CCPA Applicability

### 2.1 Business Threshold

| Threshold | MF+SO Status |
|-----------|-------------|
| Gross revenue > $25M | Not met (early stage) |
| Buys/receives/sells/share PI of 100K+ consumers | Not met (minimal data processing) |
| Derives 50%+ of revenue from selling/sharing PI | Not met (no PI sales) |

**Current Status**: MF+SO does not currently meet CCPA business thresholds. However, compliance measures are implemented proactively in anticipation of growth and to support enterprise customers.

### 2.2 Personal Information Collected

| Category | Collected | Source | Purpose |
|----------|-----------|--------|---------|
| Identifiers | Limited (email for support) | User voluntary submission | Support, communications |
| Internet/network activity | IP address (ephemeral) | Network transmission | Relay routing |
| Geolocation | Approximate (region level) | IP address | Relay region selection |
| Inferences | None | N/A | N/A |

### 2.3 Sensitive Personal Information

| Category | Collected | CCPA Classification | MF+SO Use |
|----------|-----------|-------------------|-----------|
| Account credentials | User-controlled (local) | Sensitive PI | Authentication |
| Biometric data | User-controlled (local) | Sensitive PI | Platform authenticator |
| Precise geolocation | Not collected | Sensitive PI | N/A |

## 3. Consumer Rights

### 3.1 Rights Overview

| Right | CCPA | CPRA | MF+SO Implementation |
|-------|------|------|---------------------|
| Right to Know | ✓ | Expanded | Section 4 |
| Right to Delete | ✓ | Revised | Section 5 |
| Right to Opt-Out | ✓ | Expanded | Section 6 |
| Right to Correct | ✗ | ✓ | Section 7 |
| Right to Limit Sensitive PI | ✗ | ✓ | Section 8 |
| Right to Non-Discrimination | ✓ | ✓ | Section 9 |
| Right to Automated Decision-Making | ✗ | ✓ | N/A |

### 3.2 Rights Request Process

```
Consumer → Submits request (web form, email, phone)
MF+SO → Verifies identity (reasonable verification)
MF+SO → Processes request (within 45 days, extendable +45)
MF+SO → Provides response (same format as request)
MF+SO → Records request (for compliance records)
```

**Verification Requirements**:

| Request Type | Verification Level | Method |
|-------------|-------------------|--------|
| Know | Moderate | Email verification + additional info if available |
| Delete | Moderate | Email verification + confirmation |
| Opt-Out | Minimal | DSN signal + confirmation |

**Response Timelines**:

| Request Type | Standard Response | Maximum (with extension) |
|-------------|------------------|-------------------------|
| Know | 45 days | 90 days |
| Delete | 45 days | 90 days |
| Correct | 45 days | 90 days |
| Opt-Out | 15 business days | 15 business days |

## 4. Right to Know

### 4.1 Categories of Information

Upon verified request, MF+SO provides:

1. Categories of personal information collected
2. Specific pieces of personal information collected
3. Categories of sources
4. Business/commercial purpose for collection
5. Categories of third parties with whom shared
6. Categories of personal information sold/shared

### 4.2 12-Month Lookback

CCPA requires disclosure of information collected in the preceding 12 months. MF+SO maintains records to support this requirement:

- Support ticket history (3 years)
- Communication preferences (continuous)
- Relay metadata (ephemeral, not stored)

### 4.3 Response Format

MF+SO provides information in a readily usable format (JSON or CSV) through:

- Secure web portal (recommended)
- Email (encrypted upon request)
- Mail (upon request)

## 5. Right to Delete

### 5.1 Deletion Request Process

1. Consumer submits deletion request
2. Identity verified
3. Personal information deleted from all systems
4. Service providers directed to delete
5. Confirmation sent to consumer

### 5.2 Exceptions

MF+SO may deny deletion requests when retention is necessary for:

- Complete a transaction
- Detect security incidents
- Debug/debug errors
- Exercise free speech rights
- Comply with legal obligations
- Internal uses compatible with context
- Scientific/historical research (with safeguards)

### 5.3 Deletion Implementation

| Data Type | Deletion Method | Verification |
|-----------|----------------|--------------|
| Support data | Permanent deletion from database | DB query confirmation |
| Communication data | Unsubscribe + data deletion | Removal confirmation |
| Relay metadata | Ephemeral (not stored) | N/A |

## 6. Right to Opt-Out

### 6.1 Opt-Out of Sale/Share

CCPA defines "sale" broadly as any exchange for valuable consideration. MF+SO does not sell personal information. MF+SO does not share personal information for cross-context behavioral advertising.

**Affirmative Statement**: MF+SO does not sell or share personal information as defined by CCPA/CPRA.

### 6.2 Opt-Out Mechanisms

| Mechanism | Implementation | Status |
|-----------|---------------|--------|
| "Do Not Sell or Share My Personal Information" link | Footer of website | Implemented |
| Global Privacy Control (GPC) | GPC signal detection | Implemented |
| User preference center | Dedicated privacy dashboard | Implemented |
| Email opt-out | Privacy email request | Implemented |
| Authorized agent | Verification procedure | Implemented |

### 6.3 Opt-Out Preference Signals

MF+SO respects Global Privacy Control (GPC) signals:

| Signal | Detection | Action |
|--------|-----------|--------|
| GPC header (`Sec-GPC: 1`) | HTTP header | Treat as opt-out request |
| GPC DOM property | JavaScript detection | Treat as opt-out request |
| Browser-based GPC extension | Automatic detection | Treat as opt-out request |

## 7. Right to Correct

### 7.1 Correction Request Process

CPRA (Section 1798.106) grants consumers the right to correct inaccurate personal information.

1. Consumer identifies inaccuracy
2. MF+SO verifies request
3. Correction made in all systems
4. Service providers notified
5. Confirmation to consumer

### 7.2 Correction Scope

| Data Type | Correctable | Procedure |
|-----------|-------------|-----------|
| Email address | Yes | Update via preference center |
| Name | Yes | Manual update on request |
| Support data | Yes | Support ticket update |
| Communication preferences | Yes | Self-service preference center |

## 8. Right to Limit Use of Sensitive PI

### 8.1 Sensitive PI Identification

| Category | MF+SO Processing | Limitation Applied |
|----------|-----------------|-------------------|
| Account credentials | Locally stored, user-controlled | Processing limited to authentication |
| Biometric data | Locally processed (FIDO2) | Processing limited to authentication |
| Precise geolocation | Not collected | N/A |

### 8.2 Limitation Implementation

MF+SO limits the use of sensitive personal information to purposes necessary for service provision:

- **Service provision**: Authentication, vault management
- **Security**: Abuse prevention, fraud detection
- **Compatibility**: Ensuring service functionality

## 9. Right to Non-Discrimination

### 9.1 Prohibited Practices

CCPA § 1798.125 prohibits businesses from discriminating against consumers who exercise their CCPA rights.

MF+SO does not:

- Deny goods or services
- Charge different prices or rates
- Provide different level or quality of service
- Suggest different price/quality

### 9.2 Financial Incentive Programs

MF+SO does not offer financial incentive programs tied to data collection.

## 10. Data Inventory and Mapping

### 10.1 Data Inventory

| Data Element | Category | Source | Purpose | Storage | Retention | Third-Party Sharing |
|-------------|----------|--------|---------|---------|-----------|-------------------|
| IP address | Internet/activity | Network | Relay routing | Ephemeral | Session only | Relay provider |
| Email address | Identifiers | User | Support, comms | Support DB | 3 years | Email provider |
| Support data | Identifiers | User | Support | Support DB | 3 years | Support provider |
| Device fingerprint | Commercial info | Device | Fraud prevention | Ephemeral | Session only | None |
| Communication prefs | Commercial info | User | Comms | Comms DB | Until unsubscribe | Email provider |

### 10.2 Data Flow Map

```
User Data Input
    ↕
┌──────────────────────┐
│  MF+SO Data Systems   │
│  ┌────────────────┐  │
│  │ Support System   │──→ Support Provider (DPA)
│  │ Email System     │──→ Email Provider (DPA)
│  │ Relay System     │──→ Relay Provider (Service Provider)
│  └────────────────┘  │
└──────────────────────┘
    ↕
Data Retention & Deletion
```

### 10.3 Data Retention Schedule

| Data Type | Retention Period | Deletion Method |
|-----------|-----------------|-----------------|
| IP addresses | Session only | Automatic |
| Support data | 3 years after resolution | Permanent deletion |
| Communication data | Until unsubscribe | Permanent deletion |
| Telemetry data | 12 months | Anonymization |

## 11. Privacy Notice

### 11.1 Notice Requirements

MF+SO's privacy notice (published at `https://mfso.ai/privacy`) includes:

1. Categories of personal information collected in preceding 12 months
2. Categories of sources
3. Business/commercial purpose for collection
4. Categories of third parties with whom shared
5. Specific pieces of personal information collected
6. Consumer rights under CCPA/CPRA
7. Methods for submitting rights requests
8. Designated methods for submission
9. Nondiscrimination policy
10. Contact information
11. Last updated date

### 11.2 Notice at Collection

MF+SO provides notice at or before the point of collection:

- **Support form**: Notice displayed before submission
- **Newsletter signup**: Notice displayed before signup
- **Relay usage**: Notice in application TOS
- **Cookies**: Cookie notice on first visit

### 11.3 Notice Updates

| Trigger | Action | Timeline |
|---------|--------|----------|
| Policy change | Update notice, notify consumers | Within 30 days |
| New data collection | Update notice | Before collection |
| Annual review | Review and update | Annually |

## 12. Opt-Out Mechanisms

### 12.1 Website Implementation

```html
<!-- "Do Not Sell or Share My Personal Information" link -->
<footer>
  <a href="/privacy/opt-out" class="ccpa-opt-out">
    Do Not Sell or Share My Personal Information
  </a>
</footer>

<!-- Global Privacy Control detection -->
<script>
  if (navigator.globalPrivacyControl) {
    // User has GPC enabled
    applyOptOut();
  }
</script>
```

### 12.2 Service Provider Classification

MF+SO ensures that all third-party data recipients are properly classified:

| Recipient | Classification | CCPA Status | Contractual Safeguards |
|-----------|---------------|-------------|----------------------|
| Cloud provider A | Service Provider | ✓ | DPA + SOC 2 |
| Cloud provider B | Service Provider | ✓ | DPA + SOC 2 |
| Email provider | Service Provider | ✓ | DPA + SCCs |
| Support provider | Service Provider | ✓ | DPA + SCCs |

## 13. Service Provider Agreements

### 13.1 Contractual Requirements

CCPA requires service provider agreements that:

- Prohibit the service provider from retaining, using, or disclosing PI for any purpose other than the specific business purpose
- Prohibit the service provider from combining PI with other data
- Require notification of any subcontractors
- Require compliance with CCPA obligations

### 13.2 Contract Register

| Vendor | Agreement Type | Dated | Contains CCPA/CPRA Provisions |
|--------|---------------|-------|------------------------------|
| Cloud Provider A | DPA | 2025-01-01 | Yes |
| Cloud Provider B | DPA | 2025-03-01 | Yes |
| Email Provider | DPA | 2025-06-01 | Yes |
| Support Provider | DPA | 2025-06-01 | Yes |

## 14. Minors and Children's Privacy

### 14.1 Age Verification

MF+SO does not target or market to minors under 16. The service is designed for general adult use.

| Requirement | Implementation |
|-------------|---------------|
| Opt-in consent for minors 13-15 | Not applicable (no sale/sharing) |
| Opt-in consent for minors < 13 | Not applicable (no targeted collection) |
| COPPA compliance | Not applicable (not child-directed) |

### 14.2 Opt-In for Minors

Should MF+SO ever process data of known minors:

- Consent obtained from parent/guardian for minors < 13
- Consent obtained from minor (13-15) for sale/sharing
- Robust age verification implemented

## 15. Enforcement and Penalties

### 15.1 Enforcement Framework

| Enforcement Body | Authority | Scope |
|-----------------|-----------|-------|
| California Privacy Protection Agency (CPPA) | Rulemaking, enforcement | CPRA violations |
| California Attorney General | Enforcement (until CPPA operational) | CCPA violations |
| Private right of action | Data breach | CCPA § 1798.150 |

### 15.2 Penalties

| Violation Type | Penalty Range |
|---------------|--------------|
| Civil penalty (intentional) | $2,500 - $7,500 per violation |
| Civil penalty (unintentional) | $2,500 per violation |
| Private right of action (breach) | $100 - $750 per incident per consumer |
| Injunctive relief | Available |

### 15.3 MF+SO Penalty Mitigation

| Mitigation Factor | Implementation |
|------------------|---------------|
| Timely cure of violations | 30-day cure period |
| Good faith compliance | Documented policies and procedures |
| Training | Annual privacy training |
| Monitoring | Continuous compliance monitoring |

## 16. Compliance Program

### 16.1 Privacy Program Structure

| Role | Responsibility |
|------|---------------|
| Privacy Officer | Overall CCPA compliance |
| Data Protection Officer | Cross-jurisdictional privacy |
| Engineering Lead | Technical privacy controls |
| Legal Counsel | Contractual compliance |

### 16.2 Compliance Monitoring

| Activity | Frequency | Responsibility |
|----------|-----------|---------------|
| Rights request tracking | Ongoing | Privacy team |
| Data inventory review | Quarterly | Privacy team |
| Vendor compliance review | Annually | Procurement |
| Training completion | Annually | HR |
| Policy review | Annually | Privacy Officer |
| Contract review | Per change | Legal |

### 16.3 Training

| Training Module | Audience | Frequency |
|---------------|----------|-----------|
| CCPA/CPRA fundamentals | All employees | Annually |
| Rights request handling | Support team | Bi-annually |
| Privacy engineering | Development team | Annually |
| Vendor management | Procurement | Annually |

### 16.4 Consumer Request Metrics

| Metric | Target |
|--------|--------|
| Request response time (know) | < 45 days |
| Request response time (delete) | < 45 days |
| Request response time (opt-out) | < 15 business days |
| Verification rate | > 95% |
| Satisfaction rate | > 90% |

## 17. Appendices

### Appendix A: CCPA/CPRA Section Mapping

| Section | Requirement | Status | Reference |
|---------|-------------|--------|-----------|
| 1798.100 | Right to Know | Compliant | Section 4 |
| 1798.105 | Right to Delete | Compliant | Section 5 |
| 1798.120 | Right to Opt-Out | Compliant | Section 6 |
| 1798.106 | Right to Correct | Compliant | Section 7 |
| 1798.121 | Limit Sensitive PI | Compliant | Section 8 |
| 1798.125 | Non-Discrimination | Compliant | Section 9 |
| 1798.110 | Data Inventory | Compliant | Section 10 |
| 1798.130 | Privacy Notice | Compliant | Section 11 |
| 1798.135 | Opt-Out Mechanisms | Compliant | Section 12 |
| 1798.140 | Definitions | Compliant | N/A |
| 1798.145 | Exemptions | Compliant | N/A |
| 1798.150 | Private Action | Risk managed | Section 15 |
| 1798.155 | Enforcement | Compliant | Section 15 |
| 1798.175 | Service Providers | Compliant | Section 13 |
| 1798.185 | Rulemaking | Monitor | Ongoing |

### Appendix B: Consumer Rights Request Form

```
CCPA/CPRA RIGHTS REQUEST

1. Requestor Information
   Full Name:
   Email Address:
   Phone Number:
   Relationship to MF+SO:

2. Request Type
   [ ] Right to Know (categories)
   [ ] Right to Know (specific pieces)
   [ ] Right to Delete
   [ ] Right to Opt-Out of Sale/Share
   [ ] Right to Correct
   [ ] Right to Limit Use of Sensitive PI
   [ ] Other (specify):

3. Verification Method
   [ ] Email verification
   [ ] Additional verification (specify):

4. Preferred Response Format
   [ ] Online portal
   [ ] Email (encrypted if available)
   [ ] Mail

FOR OFFICIAL USE ONLY
Request ID:
Received Date:
Verification Status:
Response Due Date:
Response Sent Date:
Outcome:
```

### Appendix C: State Privacy Law Crosswalk

| State | Law | Effective | Similar to CCPA | MF+SO Coverage |
|-------|-----|-----------|-----------------|----------------|
| California | CCPA/CPRA | 2020/2023 | — | Full |
| Virginia | VCDPA | 2023 | Yes | Covered by CCPA program |
| Colorado | ColoPA | 2023 | Yes | Covered by CCPA program |
| Connecticut | CTDPA | 2023 | Yes | Covered by CCPA program |
| Utah | UCPA | 2023 | Partial | Covered by CCPA program |
| Texas | TDPSA | 2024 | Yes | Covered by CCPA program |

### Appendix D: Glossary

| Term | Definition |
|------|-----------|
| AG | Attorney General |
| CCPA | California Consumer Privacy Act |
| CPRA | California Privacy Rights Act |
| CPPA | California Privacy Protection Agency |
| DPA | Data Processing Agreement |
| GPC | Global Privacy Control |
| PI | Personal Information |
| SCC | Standard Contractual Clauses |
| Sensitive PI | Sensitive Personal Information |

### Appendix E: Version History

| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 0.1 | 2025-11-01 | Privacy Team | Initial draft |
| 0.5 | 2025-12-15 | Privacy Team | Complete rights mapping |
| 1.0 | 2026-01-01 | Privacy Team | First approved version |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
