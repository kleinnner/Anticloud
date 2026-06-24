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

# Kasteran* — GDPR Compliance
© Lois-Kleinner & 0-1.gg 2026

## Overview

The General Data Protection Regulation (GDPR) is the European Union's comprehensive data protection framework. Kasteran* is designed to help organizations achieve and maintain GDPR compliance through architectural features that embed data protection principles directly into the language. This document maps Kasteran* capabilities to GDPR requirements.

## Data Subject Rights

GDPR grants individuals eight rights regarding their personal data. Kasteran* provides technical infrastructure to support each right.

### Right to be Informed
Organizations must inform individuals about the collection and use of their personal data. Kasteran* supports this through transparent telemetry disclosure and privacy policies that are built into the application framework. The compiler can generate privacy notices automatically based on data flow analysis.

### Right of Access
Individuals have the right to access their personal data. Kasteran* provides APIs for data access that are standardized and auditable. The data query layer supports filtering, pagination, and format selection to facilitate subject access requests (SARs).

### Right to Rectification
Individuals can request correction of inaccurate data. Kasteran* supports this through immutable audit logs that record data changes, ensuring that corrections are tracked and that both the original and corrected values are preserved for audit purposes.

### Right to Erasure (Right to be Forgotten)
Kasteran* supports data deletion through the retention policy framework. Data can be deleted from primary stores, backups, and caches. The deletion process is documented, verified, and confirmed. The .aioss protocol ensures that deletion is cryptographically enforced.

### Right to Restrict Processing
The access control system in Kasteran* can restrict processing of specific data to certain operations. This is enforced at compile time through the type system, ensuring that restricted data cannot be processed in unauthorized ways.

### Right to Data Portability
Kasteran* provides structured data export in industry-standard formats including JSON, CSV, and Parquet. The API layer supports machine-readable export, and the .aioss protocol enables direct data transfer between compliant systems.

### Right to Object
Individuals can object to processing based on legitimate interests or direct marketing. Kasteran* supports objection handling through configurable processing pipelines that can exclude data subjects based on their objection status.

### Rights Related to Automated Decision Making
Kasteran* includes provisions for meaningful human review of automated decisions. The audit trail captures the inputs, logic, and outputs of any automated decision, enabling review and challenge.

## Consent Management

GDPR requires that consent be freely given, specific, informed, and unambiguous. Kasteran* provides a consent management framework that tracks consent at the individual level. Consent records include the date, time, scope, and mechanism of consent. Withdrawal of consent is as easy as giving it. The system can enforce processing restrictions based on consent status at compile time.

## Breach Notification

Under GDPR, organizations must notify supervisory authorities within 72 hours of becoming aware of a personal data breach. Kasteran* supports this through automated breach detection and notification systems. The audit logging system can detect anomalous access patterns that may indicate a breach. When a breach is detected, the system automatically generates the required notification, including the nature of the breach, categories of data affected, and recommended mitigation measures.

The breach response subsystem in Kasteran* follows a structured process: detection, containment, assessment, notification, and remediation. All steps are documented in tamper-evident logs that can be presented to supervisory authorities as evidence of compliance.

## Data Protection Officer (DPO)

GDPR requires the appointment of a Data Protection Officer in certain circumstances. Kasteran* provides the DPO with tools for monitoring compliance, advising on data protection impact assessments (DPIAs), and cooperating with supervisory authorities. The audit dashboard gives the DPO real-time visibility into data processing activities.

## Data Protection by Design and Default

Article 25 of GDPR requires data protection by design and by default. Kasteran* embodies this principle through its architecture:

- **Data minimization**: The type system can enforce that only necessary data is collected and processed
- **Purpose limitation**: Data can be tagged with purpose codes, and the compiler enforces that data is only used for its intended purpose
- **Storage limitation**: Retention policies are enforced automatically
- **Integrity and confidentiality**: Encryption, access controls, and audit logging are built in

## Data Processing Records

Article 30 requires organizations to maintain records of processing activities. Kasteran* automatically generates and maintains these records through the audit logging system. Records include the purposes of processing, categories of data subjects, categories of recipients, retention periods, and security measures.

## Data Protection Impact Assessment

DPIAs are required for high-risk processing activities. Kasteran* provides a DPIA framework that guides organizations through the assessment process. The data flow analysis tools can identify high-risk processing activities automatically. The compiler can generate DPIA documentation based on the data flows identified in the code.

## International Transfers

GDPR restricts transfers of personal data outside the European Economic Area. Kasteran* supports data sovereignty through region controls and the .aioss protocol. Data can be tagged with jurisdiction requirements, and the runtime enforces that data stays within approved geographic boundaries. Standard contractual clauses (SCCs) and binding corporate rules (BCRs) are supported through the data governance framework.

## Penalties and Liability

Non-compliance with GDPR can result in fines up to 4% of global annual turnover. Kasteran* reduces this risk by providing auditable compliance evidence and automated enforcement of data protection requirements. The deterministic build system ensures that compliance measures are consistently applied across all deployments.

## Conclusion

Kasteran* provides comprehensive support for GDPR compliance through architectural features that embed data protection principles into the language itself. Organizations using Kasteran* can reduce the burden of compliance while achieving stronger data protection guarantees.
