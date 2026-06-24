<!--
KASTERAN* — The Last Programming Language
© Lois-Kleinner & 0-1.gg 2026. All rights reserved.

 ▄▄   ▄▄▄                                           ▄     
 ██  ██▀                         ██              ▄▄ █ ▄▄  
 ██▄██      ▄█████▄  ▄▄█████▄  ███████    ▄████▄    ██▄████   ▄█████▄  ██▄████▄   █████   
 █████      ▀ ▄▄▄██  ██▄▄▄▄ ▀    ██      ██▄▄▄▄██   ██▀       ▀ ▄▄▄██  ██▀   ██  ▀▀ █ ▀▀  
 ██  ██▄   ▄██▀▀▀██   ▀▀▀▀██▄    ██      ██▀▀▀▀▀▀   ██       ▄██▀▀▀██  ██    ██     ▀     
 ██   ██▄  ██▄▄▄███  █▄▄▄▄▄██    ██▄▄▄   ▀██▄▄▄▄█   ██       ██▄▄▄███  ██    ██           
 ▀▀    ▀▀   ▀▀▀▀ ▀▀   ▀▀▀▀▀▀      ▀▀▀▀     ▀▀▀▀▀    ▀▀        ▀▀▀▀ ▀▀  ▀▀    ▀▀           
-->

# Kasteran* — Third-Party Sharing
© Lois-Kleinner & 0-1.gg 2026

## Overview

This document describes how and when Kasteran* shares data with third parties. We maintain strict controls over data sharing, ensuring that any third-party access is governed by contractual safeguards and data minimization principles.

## Who Has Access

### Service Providers
We share data with limited service providers who help us operate:

| Provider | Purpose | Data Shared | Safeguards |
|---|---|---|---|
| GitHub | Code repository, issue tracking | Account info, contributions | DPA in place |
| Cloud Provider | Infrastructure hosting | Anonymized telemetry | DPA, EU data region |
| Package Registry | Package distribution | Package metadata | Public by design |
| Email Service | Transactional emails | Email address only | DPA in place |

### Contractual Safeguards
All service providers are bound by:
- **Data Processing Agreements** (DPAs)
- **Confidentiality obligations**
- **Data minimization requirements**
- **Security standards** (at least SOC 2 or equivalent)
- **Audit rights**
- **Data deletion** upon contract termination

## What We Do NOT Share

We do NOT share:
- Source code or program content
- Personal information without consent
- Telemetry data with analytics companies
- Usage data for advertising or marketing
- User identities or contact information
- Financial information

## Data Minimization

When sharing data, we apply data minimization:
- Share only the minimum data necessary
- Aggregate and anonymize where possible
- Limit access to authorized personnel only
- Establish specific purposes for each sharing arrangement

## Legal Sharing

We may share data if:
- Required by law, court order, or legal process
- Necessary to protect the rights, property, or safety of Kasteran*, users, or others
- To enforce our terms of service or other agreements

In such cases:
- We will review the request for validity
- We will limit disclosure to the minimum required
- We will notify affected users unless prohibited by law
- We will maintain a record of the disclosure

## Business Transfers

In the event of a merger, acquisition, or asset sale:
- Users will be notified of the transfer
- Data will remain subject to this privacy policy
- Users may request data deletion before transfer
- Acquirer will be bound by the same obligations

## International Transfers

Data transferred internationally is protected by:
- **Standard Contractual Clauses** (EU → non-EU)
- **Binding Corporate Rules** (intra-company)
- **Adequacy decisions** (EU-recognized countries)
- **Data localization** where required by law

## User Consent

Sharing for purposes beyond service provision requires explicit consent:
- Opt-in consent for marketing-related sharing
- Separate consent for each sharing purpose
- Right to withdraw consent at any time
- Easy opt-out mechanisms

## Transparency

We maintain a register of all third-party sharing arrangements:
```
sharing_register:
  - provider: "Cloud Provider"
    purpose: "infrastructure hosting"
    data: "anonymized telemetry"
    safeguards: "DPA, encryption"
    region: "EU"
```

## Conclusion

Kasteran* limits third-party data sharing to essential service providers, with strict contractual safeguards and data minimization. We do not sell data, share for advertising, or transfer data without user consent.
