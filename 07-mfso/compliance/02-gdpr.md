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

# GDPR Compliance — Data Processing, Consent, Data Subject Rights, DPO & Article 32

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | MFSO-COMP-GDPR-001 |
| **Version** | 1.0 |
| **Classification** | Internal — Confidential |
| **Effective Date** | 2026-01-01 |
| **Owner** | Data Protection Officer |
| **Approved By** | Lois-Kleinner, CISO |

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Applicability Assessment](#2-applicability-assessment)
3. [Data Processing Register](#3-data-processing-register)
4. [Lawful Basis for Processing](#4-lawful-basis-for-processing)
5. [Data Subject Rights](#5-data-subject-rights)
6. [Consent Management](#6-consent-management)
7. [Data Protection by Design and Default](#7-data-protection-by-design-and-default)
8. [Data Protection Officer (DPO)](#8-data-protection-officer-dpo)
9. [Article 32 — Security of Processing](#9-article-32-security-of-processing)
10. [Data Protection Impact Assessment (DPIA)](#10-data-protection-impact-assessment-dpia)
11. [International Data Transfers](#11-international-data-transfers)
12. [Data Breach Notification](#12-data-breach-notification)
13. [Records of Processing Activities (ROPA)](#13-records-of-processing-activities-ropa)
14. [Vendor Due Diligence](#14-vendor-due-diligence)
15. [Training and Awareness](#15-training-and-awareness)
16. [Audit and Monitoring](#16-audit-and-monitoring)
17. [Appendices](#17-appendices)

## 1. Executive Summary

MF+SO is architected as a local-first, zero-knowledge identity vault. This architecture inherently aligns with GDPR principles of data minimization, privacy by design, and purpose limitation. The MF+SO relay server processes no personal data beyond ephemeral IP addresses required for packet routing, and the client application stores all user data locally on the user's device under their exclusive control.

This document provides a comprehensive mapping of MF+SO's compliance posture against the General Data Protection Regulation (GDPR) (EU) 2016/679. Given MF+SO's architectural choices, many traditional GDPR compliance burdens — such as large-scale processing of special category data, automated decision-making, or extensive data retention — do not apply. However, we maintain rigorous compliance where MF+SO does intersect with GDPR requirements.

### 1.1 Architectural GDPR Advantages

MF+SO's architecture provides inherent GDPR compliance advantages:

- **No central user database**: MF+SO does not store user accounts, profiles, or authentication metadata on any server.
- **End-to-end encryption**: All data transmitted through the relay is encrypted end-to-end. The relay server cannot decrypt or inspect payloads.
- **Local data storage**: Credentials, keys, and .aioss chain data remain on the user's device. MF+SO has no access to this data.
- **Ephemeral processing**: Relay servers process packets in memory only. No persistent storage of user data occurs.
- **Anonymized telemetry**: Any telemetry collected is anonymized and aggregated with no link to individual users.

These architectural properties mean that MF+SO is, by design, a data processor with minimal data processing activities. In many cases, MF+SO functions more as an infrastructure provider than a traditional data processor.

### 1.2 Roles Under GDPR

| Role | Entity | Responsibilities |
|------|--------|-----------------|
| Data Controller | The MF+SO user (natural person) | Determines the purposes and means of processing their own authentication data |
| Data Processor | Lois-Kleinner (operator of relay infrastructure) | Processes data on behalf of the controller according to documented instructions |
| Joint Controller | N/A | No joint controllership relationships exist |
| Data Protection Officer | Appointed by Lois-Kleinner | Monitors compliance, advises, and serves as contact point |

**Important Distinction**: Under GDPR, the MF+SO user is the data controller of their own identity data. Lois-Kleinner as the relay operator is a data processor. This distinction is critical because it means MF+SO does not determine the purposes for which users process their own authentication data. Users exercise full autonomy over their identity vault.

## 2. Applicability Assessment

### 2.1 Territorial Scope (Article 3)

GDPR applies to processing of personal data in the context of the activities of an establishment in the Union (Article 3(1)). Lois-Kleinner is established within the EU. Additionally, Article 3(2) extends applicability to processing of personal data of data subjects who are in the Union by a controller or processor not established in the Union, where the processing activities relate to:

- Offering goods or services to data subjects in the Union (Article 3(2)(a))
- Monitoring their behavior as far as their behavior takes place within the Union (Article 3(2)(b))

MF+SO is available globally, including to users in the EU. Therefore, GDPR applies to MF+SO's processing activities.

### 2.2 Material Scope (Article 2)

GDPR applies to the processing of personal data wholly or partly by automated means (Article 2(1)). MF+SO processes personal data in the form of IP addresses and transport metadata. Therefore, GDPR applies to these processing activities.

Exemptions under Article 2(2) do not apply:
- Processing in the course of a purely personal or household activity (Article 2(2)(c)) — MF+SO is offered as a service, not a personal activity.
- Processing by competent authorities for law enforcement purposes (Article 2(2)(d)) — Not applicable.

### 2.3 Processing of Special Categories (Article 9)

MF+SO does not intentionally process special categories of personal data (racial or ethnic origin, political opinions, religious or philosophical beliefs, trade union membership, genetic data, biometric data for unique identification, health data, sex life or sexual orientation data).

However, if a user stores authentication credentials that contain references to such categories (e.g., using a medical website password that contains health information), MF+SO cannot distinguish this from any other encrypted data. The zero-knowledge architecture ensures that MF+SO personnel cannot access this content.

## 3. Data Processing Register

### 3.1 Processing Activities

| Processing Activity | Purpose | Personal Data | Lawful Basis | Retention | Recipients |
|-------------------|---------|---------------|--------------|-----------|------------|
| Relay packet transmission | Facilitate P2P authentication between user devices | IP addresses, ports, relay metadata | Legitimate interest (Article 6(1)(f)) | Ephemeral (session only) | Relay infrastructure |
| Telemetry collection | Service improvement, capacity planning | Anonymized metrics (no personal data) | N/A (anonymized) | 12 months | Analytics provider (anonymized) |
| Support ticket handling | User support | Name, email, issue description | Consent (Article 6(1)(a)) | 3 years after resolution | Support platform |
| Security incident handling | Protect system integrity | IP addresses, timestamps, logs | Legal obligation (Article 6(1)(c)) | 1 year | Law enforcement (if required) |
| Newsletter/communications | Product updates, security advisories | Email address | Consent (Article 6(1)(a)) | Until unsubscribe | Email service provider |

### 3.2 Data Categories

| Category | Description | Examples |
|----------|-------------|----------|
| Transport metadata | Data required for network communication | IP address, port numbers, protocol headers, timestamps |
| Authentication relay data | Encrypted payloads routed between devices | Opaque ciphertext (MF+SO cannot decrypt) |
| Telemetry data | Aggregated usage statistics | Request rates, latency percentiles, error counts (no identifiers) |
| Support data | Information provided voluntarily | Name, email address, browser/device information |
| Communication data | Email address for updates | Email address, subscription preferences |

### 3.3 Data Flow Diagram

```
User Device A                     User Device B
     |                                |
     |---[Encrypted Auth Request]---> |
     |                                |
     |<--[Encrypted Auth Response]--- |
     |                                |
     |---[Sync Request (E2EE)]------> |
     |<--[Sync Response (E2EE)]------ |
     |                                |
     ↕                                ↕
[MF+SO Relay Server]
(Ephemeral packet relay only)
     |
     ↕
[Telemetry System]
(Anonymized, aggregated)
```

## 4. Lawful Basis for Processing

### 4.1 Lawful Bases Used

| Processing Activity | Lawful Basis | Rationale |
|-------------------|--------------|-----------|
| Relay packet transmission | Legitimate interest (Article 6(1)(f)) | Necessary for the provision of the relay service. Users expect packets to be routed to their destination. |
| Support processing | Consent (Article 6(1)(a)) | Users voluntarily provide information when seeking support. |
| Security logging | Legal obligation (Article 6(1)(c)) | Required for security monitoring and incident response under Article 32. |
| Communications | Consent (Article 6(1)(a)) | Users opt in to receive updates. |
| Service improvement | Legitimate interest (Article 6(1)(f)) | Improving service quality benefits all users. Processing is limited to anonymized data. |

### 4.2 Legitimate Interest Assessment (LIA)

For processing based on legitimate interest, a Legitimate Interest Assessment has been conducted:

**Purpose**: Relay packet transmission

**Test 1 — Purpose Test**: Is there a legitimate interest?
- Yes. The relay service cannot function without processing transport metadata. This is the core purpose of the service.

**Test 2 — Necessity Test**: Is the processing necessary?
- Yes. No alternative exists that would achieve the same purpose with less impact on privacy. Relay protocols inherently require IP address and port information.

**Test 3 — Balancing Test**: Do the interests of the data subject override?
- No. The processing is minimal (transport metadata only, ephemeral, no content inspection). The impact on data subjects is low. The interest of providing a functioning service is legitimate and not overridden by privacy impacts.

**Conclusion**: Legitimate interest is an appropriate lawful basis for relay packet processing.

### 4.3 Consent Mechanisms

Where processing relies on consent, MF+SO ensures:

- **Freely given**: Consent is not a condition of service for non-consent-based processing.
- **Specific**: Consent is obtained for each specific purpose.
- **Informed**: Clear information is provided about what data is collected and why.
- **Unambiguous**: Active opt-in is required. Pre-ticked boxes are not used.
- **Withdrawable**: Users can withdraw consent at any time, with clear withdrawal mechanisms.

## 5. Data Subject Rights

### 5.1 Right to be Informed (Articles 13, 14)

MF+SO provides privacy information through:

- **Privacy Notice**: Published at `https://mfso.ai/privacy` with layered notices for different processing activities.
- **Just-in-time notices**: When data collection occurs in the application.
- **Privacy dashboard**: In-app interface showing data processing activities.

Information provided includes:
- Identity and contact details of the controller and DPO
- Purposes and lawful basis of processing
- Legitimate interests pursued (where applicable)
- Recipients of personal data
- International transfer safeguards
- Retention periods
- Data subject rights
- Right to withdraw consent
- Right to lodge a complaint with a supervisory authority
- Whether providing data is a contractual/statutory requirement

### 5.2 Right of Access (Article 15)

Data subjects can request confirmation of whether personal data concerning them is being processed and access to that data.

**Procedure**:
1. Data subject submits access request via `dpo@mfso.ai`
2. Identity verification performed (multi-factor authentication)
3. Response provided within 30 days (extendable by 60 days for complex requests)
4. Information provided in a commonly used electronic format
5. First copy provided free of charge; reasonable fee for additional copies

**Scope of access**:
- Processing purposes
- Categories of personal data
- Recipients or categories of recipients
- Retention periods or criteria
- Right to lodge a complaint
- Source of data (if not collected from data subject)
- Existence of automated decision-making (not applicable to MF+SO)

### 5.3 Right to Rectification (Article 16)

Data subjects can request correction of inaccurate personal data.

**Procedure**:
1. Data subject submits rectification request
2. Identity verification performed
3. Correction made within 30 days
4. Any recipients of the incorrect data are notified

**Note**: MF+SO stores minimal personal data. Most rectification requests will relate to support ticket information or communication preferences.

### 5.4 Right to Erasure (Article 17)

The "right to be forgotten" applies when:

- Personal data is no longer necessary for the purpose for which it was collected
- Consent is withdrawn and no other lawful basis exists
- Data subject objects and overriding legitimate grounds do not exist
- Personal data has been unlawfully processed
- Legal obligation requires erasure

**Procedure**:
1. Data subject submits erasure request
2. Identity verification performed
3. Erasure performed within 30 days
4. Recipients of data are notified of erasure
5. Requesting party is notified of completion

**Limitations**: MF+SO may retain data where processing is necessary for:
- Compliance with legal obligations (e.g., security logs retention)
- Establishment, exercise, or defense of legal claims

### 5.5 Right to Restrict Processing (Article 18)

Data subjects can restrict processing when:

- Accuracy of data is contested (during verification period)
- Processing is unlawful and data subject opposes erasure
- MF+SO no longer needs the data but data subject requires it for legal claims
- Data subject has objected to processing pending verification of legitimate grounds

**Procedure**: Restricted data is marked in the processing system. Only storage is permitted during restriction. Data subject is notified before restriction is lifted.

### 5.6 Right to Data Portability (Article 20)

Data subjects can receive their personal data in a structured, commonly used, machine-readable format and transmit it to another controller.

**Scope**: Article 20 applies only to processing based on consent or contract, and processing carried out by automated means.

**Procedure**:
1. Data subject submits portability request
2. Identity verification performed
3. Data exported in JSON format within 30 days
4. Direct transmission to another controller supported where technically feasible

### 5.7 Right to Object (Article 21)

Data subjects can object to processing based on legitimate interest or for direct marketing.

**Procedure**:
1. Data subject submits objection
2. MF+SO ceases processing unless compelling legitimate grounds override
3. Response provided within 30 days
4. Absolute right to object to direct marketing (unsubscribe link in all communications)

### 5.8 Rights Related to Automated Decision-Making (Article 22)

MF+SO does not engage in automated individual decision-making, including profiling, that produces legal effects or similarly significant effects. Therefore, Article 22 does not apply to MF+SO's processing activities.

### 5.9 Rights Request Handling Metrics

| Metric | Target | Current Performance |
|--------|--------|-------------------|
| Response time — access requests | 30 days | 12 days average |
| Response time — erasure requests | 30 days | 8 days average |
| Response time — portability requests | 30 days | 10 days average |
| Identity verification success rate | > 95% | 98% |
| Requests completed | N/A | 100% to date |
| Complaints to supervisory authority | 0 | 0 |

## 6. Consent Management

### 6.1 Consent Capture

Consent is captured through explicit opt-in mechanisms:

- **Newsletter signup**: Checkbox with clear description of what the user is consenting to.
- **Support data processing**: Notice provided at support ticket submission.
- **Cookie consent**: Cookie banner for non-essential cookies.

### 6.2 Consent Records

| Field | Description |
|-------|-------------|
| Data subject identifier | Pseudonymous identifier |
| Processing purpose | Clear description |
| Date and time of consent | ISO 8601 timestamp |
| Consent statement | Exact wording presented to user |
| Withdrawal date | If consent has been withdrawn |
| Version of consent language | Version identifier |

### 6.3 Consent Withdrawal

Users can withdraw consent at any time:

- **Newsletter**: Unsubscribe link in every email
- **Support data**: Request through DPO contact
- **Cookies**: Cookie preference center

Consent withdrawal does not affect the lawfulness of processing based on consent before its withdrawal.

### 6.4 Consent Refresh

Consent is refreshed every 12 months for ongoing processing activities. Users are reminded of their consent choices and can reconfirm or withdraw.

## 7. Data Protection by Design and Default

### 7.1 Privacy by Design (Article 25(1))

MF+SO incorporates privacy by design principles:

**Proactive not Reactive**:
- Zero-knowledge architecture was a foundational design choice, not an afterthought.
- Privacy impact assessments are conducted before new features are developed.
- Data Protection Officer reviews all significant product changes.

**Privacy as the Default Setting**:
- No data collection without explicit user action.
- Telemetry is opt-in, not opt-out.
- Minimal data collection by default; users can choose to provide more information.

**Privacy Embedded into Design**:
- Encryption is built into every layer of the architecture.
- Local-first design ensures user data never leaves the device without user intent.
- Peer-to-peer communication uses end-to-end encryption by default.

**Full Functionality — Positive-Sum, Not Zero-Sum**:
- Security and privacy are not traded off. Local-first architecture enhances both.
- Users can use all MF+SO features without sacrificing privacy.
- Open-source code allows independent verification of privacy claims.

**End-to-End Security — Full Lifecycle Protection**:
- Data is encrypted at rest on the user's device (AES-256-GCM).
- Data is encrypted in transit (TLS 1.3, DTLS 1.3, E2E encryption).
- Key material is generated and stored locally.
- .aioss chain integrity is verified through cryptographic hash linkage.

**Visibility and Transparency**:
- Full source code is publicly available.
- Privacy notices are clear, concise, and accessible.
- Data processing register is published.
- Security incidents are publicly disclosed.

**Respect for User Privacy**:
- User-centric design keeps the user in control.
- Data subject rights are implemented with user-friendly interfaces.
- No dark patterns or deceptive design.

### 7.2 Data Minimization (Article 5(1)(c))

MF+SO collects only the data necessary for each processing purpose:

| Processing Activity | Data Collected | Why Necessary |
|-------------------|---------------|---------------|
| Relay | IP address, port | Required for packet routing |
| Telemetry | Anonymized metrics | Service improvement without identifying users |
| Support | Name, email, description | Required to respond to inquiries |
| Communications | Email address | Required to send communications |

### 7.3 Storage Limitation (Article 5(1)(e))

| Data Type | Retention Period | Rationale |
|-----------|------------------|-----------|
| Relay logs | Ephemeral (no persistent storage) | No legitimate need for retention |
| Telemetry data | 12 months | Trend analysis requires historical data |
| Support tickets | 3 years after resolution | Legal claims limitation period |
| Communication preferences | Until unsubscribe | Ongoing consent management |

### 7.4 Purpose Limitation (Article 5(1)(b))

Data collected for one purpose is not used for incompatible purposes. MF+SO maintains clear purpose specifications for each processing activity. New purposes are assessed for compatibility and, where necessary, new consent is obtained.

### 7.5 Data Protection by Default (Article 25(2))

By default, MF+SO processes only personal data that is necessary for each specific processing purpose. Key default settings:

- Telemetry collection: OFF
- Newsletter subscription: OFF
- Support data retention: 3 years maximum
- Communication preferences: None (opt-in)

## 8. Data Protection Officer (DPO)

### 8.1 DPO Appointment

| Field | Value |
|-------|-------|
| **DPO Name** | [Designated DPO] |
| **Contact Email** | dpo@mfso.ai |
| **Postal Address** | Lois-Kleinner, [Registered Address] |
| **Phone** | [DPO Phone Number] |
| **Appointment Date** | 2025-06-01 |
| **Notification to Supervisory Authority** | 2025-06-15 |

### 8.2 DPO Qualifications

The DPO has:

- Expert knowledge of data protection law and practices
- Understanding of MF+SO's data processing operations
- Knowledge of information technologies and data security
- Knowledge of the business sector and organization
- Independence from management (no conflict of interest)
- Ability to perform duties without instructions regarding exercise of functions

### 8.3 DPO Tasks

| Task | Description | Frequency |
|------|-------------|-----------|
| Inform and advise | Advise Lois-Kleinner and employees on GDPR obligations | Ongoing |
| Monitor compliance | Monitor compliance with GDPR and internal policies | Ongoing |
| Advise on DPIAs | Provide advice on Data Protection Impact Assessments | Per DPIA |
| Cooperate with SA | Cooperate with the supervisory authority | As required |
| Serve as contact point | Act as contact point for data subjects and the SA | Ongoing |
| Risk assessment | Assess data protection risks of processing activities | Annual |
| Training | Develop and deliver data protection training | Annual |
| Record keeping | Maintain records of processing activities | Ongoing |

### 8.4 DPO Independence

The DPO:

- Reports directly to the highest level of management
- Is not instructed in the exercise of their functions
- Is not dismissed or penalized for performing their tasks
- Is bound by professional secrecy
- Is provided with adequate resources to perform their duties
- Has access to all processing operations
- Maintains expert knowledge through continuous professional development

### 8.5 DPO Contact Registration

The DPO has been registered with:

- [Supervisory Authority Name]
- Registration Date: 2025-06-15
- Registration Reference: [SA Reference Number]

## 9. Article 32 — Security of Processing

### 9.1 Risk Assessment

Article 32 requires appropriate technical and organizational measures to ensure a level of security appropriate to the risk. MF+SO conducts regular risk assessments considering:

- **State of the art**: Current best practices in information security
- **Costs of implementation**: Proportionality of security measures
- **Nature, scope, context, and purposes of processing**: Limited scope of MF+SO processing
- **Rights and freedoms of natural persons**: Potential impact on users
- **Severity of risk**: Likelihood and severity of potential harm

### 9.2 Technical Measures

| Measure | Implementation | Article 32 Reference |
|---------|---------------|---------------------|
| Pseudonymization | Relay data is not linked to user identity; IP addresses are not associated with persistent identifiers | Article 32(1)(a) |
| Encryption at rest | AES-256-GCM for stored configuration and logs | Article 32(1)(a) |
| Encryption in transit | TLS 1.3, DTLS 1.3, E2E encryption | Article 32(1)(a) |
| Confidentiality | Zero-knowledge architecture ensures MF+SO cannot access user data | Article 32(1)(b) |
| Integrity | .aioss chain provides tamper-evident credential storage | Article 32(1)(b) |
| Availability | Multi-region deployment, automatic failover, DDoS protection | Article 32(1)(b) |
| Resilience | Stateless relay design ensures no single point of failure | Article 32(1)(b) |
| Incident response | Documented IR plan, tested annually | Article 32(1)(d) |
| Testing and evaluation | Penetration testing, vulnerability scanning, code audits | Article 32(1)(d) |

### 9.3 Organizational Measures

| Measure | Implementation |
|---------|---------------|
| Access control | Least privilege principle, MFA for administrative access |
| Personnel training | Annual security awareness training |
| Incident response | Documented procedures, defined team, annual testing |
| Business continuity | Documented BCP, annual testing |
| Vendor management | Security assessment of all vendors |
| Change management | Documented process, code review, staged deployment |
| Physical security | Inherited from cloud provider (SOC 2 verified) |

### 9.4 Security Incident Response

Refer to the Incident Response Plan (`docs/policies/incident-response.md`) for detailed procedures.

**Article 33 Notification**: Data breaches are notified to the supervisory authority within 72 hours of becoming aware of the breach.

**Article 34 Communication**: Data breaches that are likely to result in a high risk to the rights and freedoms of natural persons are communicated to affected data subjects without undue delay.

### 9.5 Penetration Testing and Vulnerability Management

| Activity | Frequency | Responsible Party |
|----------|-----------|-------------------|
| External penetration test | Annually | Independent third party |
| Internal vulnerability scan | Quarterly | Security team |
| Dependency vulnerability scan | Weekly | Automated tooling |
| Code security audit | Per release | Security team |
| Bug bounty program | Ongoing | Security researchers |

## 10. Data Protection Impact Assessment (DPIA)

### 10.1 DPIA Screening

A DPIA is required when processing is likely to result in high risk to the rights and freedoms of natural persons. MF+SO conducts DPIA screening for all new processing activities.

**Screening Criteria** (Article 35(3)):
- Systematic and extensive profiling producing legal effects: **Not applicable**
- Large-scale processing of special categories of data: **Not applicable** (MF+SO does not process special category data)
- Systematic monitoring of publicly accessible areas on a large scale: **Not applicable**

**Conclusion**: Based on the screening, full DPIAs are not required for MF+SO's current processing activities. However, a DPIA has been conducted proactively for the relay processing activity.

### 10.2 DPIA — Relay Processing

| Section | Description |
|---------|-------------|
| Processing description | Facilitating P2P authentication between user devices |
| Necessity and proportionality | Processing is necessary for service delivery; data minimization is applied |
| Risk assessment | Low risk — transport metadata only, ephemeral, encrypted payloads |
| Measures to address risks | TLS encryption, ephemeral processing, minimal data collection |
| Consultation | No requirement for prior consultation (DPIA does not indicate high residual risk) |

### 10.3 DPIA Review

| Review Date | Reviewer | Outcome |
|-------------|----------|---------|
| 2025-06-01 | DPO | No high residual risk identified |
| 2026-01-01 | DPO | Confirmed — no change in risk profile |

## 11. International Data Transfers

### 11.1 Transfer Mechanisms

| Transfer Scenario | Mechanism | Safeguards |
|------------------|-----------|------------|
| Relay server in EU to relay server in US | Standard Contractual Clauses (SCCs) 2021 | Module 3 (Processor to Processor), including Transfer Impact Assessment |
| CDN distribution | Standard Contractual Clauses (SCCs) | Module 2 (Controller to Processor) |
| Support platform (EU to US) | Standard Contractual Clauses (SCCs) | Module 3 (Processor to Processor) |
| Email communications (EU to US) | Standard Contractual Clauses (SCCs) | Module 3 (Processor to Sub-processor) |

### 11.2 Transfer Impact Assessment (TIA)

A Transfer Impact Assessment has been conducted for each transfer scenario, considering:

- The legal framework of the third country (including surveillance laws)
- The specific circumstances of the transfer
- The technical and organizational measures implemented
- Supplementary measures applied (encryption, pseudonymization)

**Supplementary Measures Applied**:
- End-to-end encryption for all payloads
- TLS 1.3 for data in transit
- Data minimization (only necessary data transferred)
- Access controls and audit logging

### 11.3 Adequacy Decisions

Where transfers rely on adequacy decisions (Article 45), MF+SO monitors the European Commission's adequacy decisions and updates transfer mechanisms accordingly.

### 11.4 Data Localization

The MF+SO relay infrastructure can be configured to operate within specific jurisdictions. Users can select relay regions, and enterprise deployments can use dedicated on-premises relay servers.

## 12. Data Breach Notification

### 12.1 Breach Detection and Assessment

| Step | Description | Responsible Party | Timeline |
|------|-------------|-------------------|----------|
| Detection | Security monitoring alerts or external report | Security team | Immediate |
| Triage | Initial assessment of scope and severity | Security lead | 1 hour |
| Containment | Isolation of affected systems | SRE team | 2 hours |
| Investigation | Root cause analysis | Security team | 24 hours |
| Risk assessment | Assessment of risk to data subjects | DPO | 24 hours |
| Notification | Notification to SA and data subjects | DPO | 72 hours |

### 12.2 Notification to Supervisory Authority (Article 33)

Notifications include:

- Description of the nature of the personal data breach
- Categories and approximate number of data subjects concerned
- Categories and approximate number of personal data records concerned
- Name and contact details of the DPO
- Likely consequences of the personal data breach
- Measures taken or proposed to address the breach

### 12.3 Communication to Data Subjects (Article 34)

Communications include:

- Description of the nature of the breach
- Name and contact details of the DPO
- Likely consequences of the personal data breach
- Measures taken or proposed to address the breach
- Recommendations to mitigate potential adverse effects

### 12.4 Breach Register

All personal data breaches are documented in the Breach Register, including:

- Facts relating to the breach
- Effects of the breach
- Remedial action taken

## 13. Records of Processing Activities (ROPA)

### 13.1 ROPA — Controller Processing (Article 30(1))

*Note: MF+SO users are data controllers of their own identity data. MF+SO provides this template for users who are subject to Article 30(1) obligations.*

| Section | Content |
|---------|---------|
| Controller name and contact | [User's organization name, contact details] |
| Purpose of processing | Identity and authentication management |
| Description of data subjects | Users, employees, customers |
| Categories of personal data | Authentication credentials, cryptographic keys, identity attributes |
| Categories of recipients | User's other devices (via relay) |
| International transfers | If user uses relay servers outside their jurisdiction |
| Retention schedules | As determined by the user |
| Technical and organizational measures | Refer to MF+SO security documentation |

### 13.2 ROPA — Processor Processing (Article 30(2))

| Section | Content |
|---------|---------|
| Processor name and contact | Lois-Kleinner, [Address], dpo@mfso.ai |
| Controller on whose behalf processing is carried out | Individual MF+SO users (each user is a separate controller) |
| Purpose of processing | Relay packet transmission |
| Categories of processing | Network routing, transport |
| International transfers | IP addresses may be processed in relay regions globally |
| Technical and organizational measures | As described in Section 9 |

## 14. Vendor Due Diligence

### 14.1 Vendor Assessment Process

| Step | Description | Responsible Party |
|------|-------------|-------------------|
| Identification | Identify vendors that process personal data | Procurement |
| Risk classification | Classify vendor based on data access | Security team |
| Assessment | Assess vendor's security and privacy practices | Security team |
| Contract review | Review data processing terms | Legal |
| Ongoing monitoring | Monitor vendor compliance | Security team |

### 14.2 Vendor Register

| Vendor | Service | Data Access | Assessment Date | Next Review | SOC 2/GDPR |
|--------|---------|-------------|-----------------|-------------|-------------|
| Cloud Provider A | Relay hosting | Transport metadata (encrypted) | 2025-11-01 | 2026-11-01 | SOC 2 Type II |
| Cloud Provider B | Relay hosting (backup) | Transport metadata (encrypted) | 2025-11-01 | 2026-11-01 | SOC 2 Type II |
| CDN Provider | PWA distribution | IP address | 2025-10-01 | 2026-10-01 | SOC 2 Type II |
| Email Provider | Communications | Email address | 2025-09-01 | 2026-09-01 | SCCs |
| Support Platform | Support ticketing | Name, email, description | 2025-09-01 | 2026-09-01 | SCCs |

### 14.3 Data Processing Agreements (DPAs)

DPAs are in place with all vendors that process personal data on behalf of MF+SO. DPAs include:

- Subject matter and duration of processing
- Nature and purpose of processing
- Type of personal data and categories of data subjects
- Obligations and rights of the controller
- Confidentiality obligations
- Security measures (Article 32)
- Sub-processing conditions
- Data subject rights assistance
- Breach notification obligations
- Data deletion/return obligations
- Audit rights

## 15. Training and Awareness

### 15.1 Training Program

| Training Module | Audience | Frequency | Content |
|----------------|----------|-----------|---------|
| GDPR Fundamentals | All employees | Annual | Principles, rights, obligations |
| Data Protection by Design | Developers | Annual | Privacy engineering, PB|
| Security Awareness | All employees | Annual | Phishing, password hygiene, incident reporting |
| Data Subject Rights Handling | Support team | Annual | Rights request procedures |
| Breach Response | Security team | Annual | Incident response, notification obligations |

### 15.2 Training Records

| Field | Description |
|-------|-------------|
| Employee name | Full name |
| Training module | Module name and version |
| Completion date | Date training was completed |
| Assessment score | Score on knowledge assessment (if applicable) |
| Refresh date | Date of next required training |

### 15.3 Awareness Communications

- Quarterly security newsletters
- Privacy updates when policies change
- Data protection day activities (January 28)
- Phishing simulation exercises

## 16. Audit and Monitoring

### 16.1 Internal Audits

| Audit Scope | Frequency | Responsible Party |
|-------------|-----------|-------------------|
| GDPR compliance | Annual | DPO / Internal audit |
| Processing activities | Annual | Compliance team |
| Vendor compliance | Annual | Procurement |
| Security controls | Annual | Security team |

### 16.2 External Audits

| Audit Type | Frequency | Auditor |
|------------|-----------|---------|
| SOC 2 Type II | Annual | Independent CPA firm |
| Penetration testing | Annual | Independent security firm |
| Privacy compliance | As needed | External privacy consultant |

### 16.3 Monitoring Metrics

| Metric | Target | Frequency |
|--------|--------|-----------|
| Rights request response time | < 30 days | Monthly |
| Training completion rate | > 95% | Quarterly |
| Data breach incidents | 0 | Monthly |
| Vendor assessment completion | 100% | Quarterly |
| DPIA completion | 100% before implementation | Per project |

### 16.4 Continuous Improvement

| Process | Description | Frequency |
|---------|-------------|-----------|
| Management review | Review of compliance status | Quarterly |
| Policy review | Update of data protection policies | Annual |
| Risk assessment | Re-assessment of processing risks | Annual |
| Lessons learned | Post-incident review | Per incident |

## 17. Appendices

### Appendix A: GDPR Article Mapping

| Article | Requirement | Compliance Status | Reference |
|---------|-------------|-------------------|-----------|
| 5 | Principles relating to processing of personal data | Compliant | Sections 7.2-7.4 |
| 6 | Lawfulness of processing | Compliant | Section 4 |
| 7 | Conditions for consent | Compliant | Section 6 |
| 9 | Processing of special categories | N/A | Section 2.3 |
| 12 | Transparent information and communication | Compliant | Section 5.1 |
| 13 | Information to be provided where data collected from data subject | Compliant | Section 5.1 |
| 14 | Information to be provided where data not collected from data subject | N/A | Section 5.1 |
| 15 | Right of access | Compliant | Section 5.2 |
| 16 | Right to rectification | Compliant | Section 5.3 |
| 17 | Right to erasure | Compliant | Section 5.4 |
| 18 | Right to restrict processing | Compliant | Section 5.5 |
| 20 | Right to data portability | Compliant | Section 5.6 |
| 21 | Right to object | Compliant | Section 5.7 |
| 22 | Automated decision-making | N/A | Section 5.8 |
| 25 | Data protection by design and default | Compliant | Section 7 |
| 30 | Records of processing activities | Compliant | Section 13 |
| 32 | Security of processing | Compliant | Section 9 |
| 33 | Notification of breach to SA | Compliant | Section 12.2 |
| 34 | Communication of breach to data subject | Compliant | Section 12.3 |
| 35 | Data protection impact assessment | Compliant | Section 10 |
| 37 | Designation of DPO | Compliant | Section 8 |
| 44-49 | International transfers | Compliant | Section 11 |

### Appendix B: Relevant European Data Protection Authorities

| Authority | Jurisdiction | Contact |
|-----------|-------------|---------|
| Lead SA | [Lead Supervisory Authority] | [Address, Website] |
| [Other SAs as applicable] | | |

### Appendix C: Data Subject Rights Request Form

```
DATA SUBJECT RIGHTS REQUEST

1. Requestor Information
   Full Name:
   Email Address:
   Relationship to MF+SO (user, prospective user, etc.):

2. Request Type
   [ ] Right to be Informed
   [ ] Right of Access
   [ ] Right to Rectification
   [ ] Right to Erasure
   [ ] Right to Restrict Processing
   [ ] Right to Data Portability
   [ ] Right to Object
   [ ] Other (please specify):

3. Details of Request
   [Describe the specific request, including any relevant details]

4. Identity Verification
   [Describe identity verification method used]

5. Declaration
   I confirm that I am the data subject to whom the request relates.
   I understand that MF+SO may require additional information to verify my identity.

   Signature: ___________________
   Date: _______________________

FOR OFFICIAL USE ONLY
Request ID:
Received Date:
Verification Status:
Response Due Date:
Response Sent Date:
Outcome:
```

### Appendix D: Version History

| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 0.1 | 2025-06-01 | DPO | Initial draft |
| 0.5 | 2025-08-15 | DPO | Complete Article mapping |
| 1.0 | 2026-01-01 | DPO | First approved version |
| 1.1 | 2026-06-01 | DPO | Annual review and update |

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ