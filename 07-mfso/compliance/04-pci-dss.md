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

# PCI DSS Compliance — Cardholder Data, Encryption, Access Control & Logging

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | MFSO-COMP-PCI-001 |
| **Version** | 1.0 |
| **Classification** | Internal — Confidential |
| **Effective Date** | 2026-01-01 |
| **Owner** | Security & Compliance Team |
| **Approved By** | Lois-Kleinner, CISO |

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [PCI DSS Applicability](#2-pci-dss-applicability)
3. [Build and Maintain a Secure Network (Requirement 1-2)](#3-build-and-maintain-a-secure-network-requirement-1-2)
4. [Protect Cardholder Data (Requirement 3-4)](#4-protect-cardholder-data-requirement-3-4)
5. [Maintain a Vulnerability Management Program (Requirement 5-6)](#5-maintain-a-vulnerability-management-program-requirement-5-6)
6. [Implement Strong Access Control Measures (Requirement 7-9)](#6-implement-strong-access-control-measures-requirement-7-9)
7. [Regularly Monitor and Test Networks (Requirement 10-11)](#7-regularly-monitor-and-test-networks-requirement-10-11)
8. [Maintain an Information Security Policy (Requirement 12)](#8-maintain-an-information-security-policy-requirement-12)
9. [Cardholder Data Environment (CDE)](#9-cardholder-data-environment-cde)
10. [Encryption Standards for Cardholder Data](#10-encryption-standards-for-cardholder-data)
11. [Access Control for CDE](#11-access-control-for-cde)
12. [Logging and Monitoring](#12-logging-and-monitoring)
13. [Self-Assessment Questionnaire (SAQ) Mapping](#13-self-assessment-questionnaire-saq-mapping)
14. [Qualified Security Assessor (QSA) Readiness](#14-qualified-security-assessor-qsa-readiness)
15. [Appendices](#15-appendices)

## 1. Executive Summary

The Payment Card Industry Data Security Standard (PCI DSS) is a set of security standards designed to ensure that all entities that accept, process, store, or transmit credit card information maintain a secure environment. This document assesses MF+SO's compliance posture against PCI DSS v4.0 requirements.

MF+SO is a sovereign identity and authentication vault. It does not directly process, store, or transmit cardholder data (CHD). However, MF+SO may be used to authenticate users who subsequently access systems that process payment cards. In this capacity, MF+SO's authentication mechanisms participate in the broader cardholder data environment (CDE) and must comply with applicable PCI DSS requirements.

### 1.1 PCI DSS Relevance to MF+SO

**Direct Processing**: MF+SO does not process payment transactions, store PANs, or transmit cardholder data. The MF+SO relay server has no payment processing functionality.

**Indirect Relevance**: When MF+SO is used to authenticate access to systems within a CDE, the authentication credentials and mechanisms become part of the security controls protecting cardholder data. PCI DSS Requirement 8 (Identify and Authenticate Access to System Components) directly applies.

**Scope Reduction**: MF+SO's local-first, zero-knowledge architecture means that even where it touches the CDE, the scope is limited to authentication events rather than cardholder data storage or processing.

### 1.2 PCI DSS v4.0 Requirements Overview

| Requirement | Description | MF+SO Applicability |
|-------------|-------------|---------------------|
| 1 | Install and Maintain Network Security Controls | Partial (infrastructure) |
| 2 | Apply Secure Configurations | Full |
| 3 | Protect Stored Account Data | N/A (no CHD stored) |
| 4 | Protect Cardholder Data with Strong Cryptography | Partial (relay encryption) |
| 5 | Protect All Systems from Malware | Full |
| 6 | Develop and Maintain Secure Systems | Full |
| 7 | Restrict Access by Need-to-Know | Full |
| 8 | Identify and Authenticate Access | Full (MF+SO's core function) |
| 9 | Restrict Physical Access | Partial (inherited) |
| 10 | Log and Monitor All Access | Full |
| 11 | Test Security of Systems and Networks | Full |
| 12 | Support Information Security with Policies | Full |

## 2. PCI DSS Applicability

### 2.1 Scope Determination

| Factor | Assessment | In CDE? |
|--------|-----------|---------|
| MF+SO relay server stores CHD | No | No |
| MF+SO relay server transmits CHD | No (encrypted payloads, not CHD) | No |
| MF+SO client stores CHD | Potentially (user may store payment credentials) | Yes, if used for payment auth |
| MF+SO authenticates to CDE | Yes, if used for payment system access | Yes (authentication path) |
| MF+SO management access | Administrative access to relay | Yes |

**Conclusion**: MF+SO's relay infrastructure has limited CDE scope. The client application's scope depends on the deployment context.

### 2.2 Network Segmentation

MF+SO deploys network segmentation to isolate CDE components:

- **Relay server network**: Segmented from internal management network
- **Management network**: Segmented with firewall rules
- **Build pipeline**: Separate network segment with restricted access

## 3. Build and Maintain a Secure Network (Requirements 1-2)

### 3.1 Requirement 1: Network Security Controls

| PCI DSS Requirement | MF+SO Implementation |
|--------------------|---------------------|
| 1.1 | Network security controls documented | Firewall rules documented in IaC |
| 1.2 | Inbound/outbound traffic controlled | Security group rules per component |
| 1.3 | DMZ implemented | Public-facing relay in DMZ |
| 1.4 | Anti-spoofing measures | Cloud provider anti-spoofing |
| 1.5 | Confidential data protection | All data encrypted end-to-end |

**Firewall Configuration**:
- Default deny policy for all ingress traffic
- Allowlisted ports: 443 (TLS), 8443 (WebSocket), 3478 (STUN)
- Egress restricted to required services only
- Stateful inspection enabled
- Rate limiting on relay endpoints

### 3.2 Requirement 2: Secure Configurations

| PCI DSS Requirement | MF+SO Implementation |
|--------------------|---------------------|
| 2.1 | Configuration standards documented | Infrastructure as Code (Terraform) |
| 2.2 | Change configuration from defaults | All default credentials changed |
| 2.3 | Least functionality principle | Minimal services, no unnecessary components |
| 2.4 | System inventory maintained | Asset register with configuration baseline |

**Configuration Hardening**:
- Operating system CIS benchmarks applied
- Application server security hardening
- Minimal installed packages
- Disabled unnecessary services
- Secure cryptographic configurations

## 4. Protect Cardholder Data (Requirements 3-4)

### 4.1 Requirement 3: Stored Account Data Protection

| PCI DSS Requirement | MF+SO Implementation |
|--------------------|---------------------|
| 3.1 | Data retention policies | No CHD stored; ephemeral relay data |
| 3.2 | No sensitive auth data stored after auth | N/A (no CHD processed) |
| 3.3 | PAN display masking | N/A |
| 3.4 | Render PAN unreadable | N/A |
| 3.5 | Key management | Documented in key management policy |

**Note**: MF+SO does not store cardholder data. Requirement 3 is satisfied by not collecting or storing CHD.

### 4.2 Requirement 4: Encryption of Cardholder Data

| PCI DSS Requirement | MF+SO Implementation |
|--------------------|---------------------|
| 4.1 | Strong cryptography for CHD transmission | TLS 1.3, E2E encryption |
| 4.2 | Never send unencrypted PAN | N/A (MF+SO does not transmit PAN) |

**Cryptographic Controls**:
- TLS 1.3 with strong cipher suites for all relay communications
- Certificate management automated (Let's Encrypt / ACME)
- Certificate revocation checking enabled (OCSP stapling)

## 5. Maintain a Vulnerability Management Program (Requirements 5-6)

### 5.1 Requirement 5: Malware Protection

| PCI DSS Requirement | MF+SO Implementation |
|--------------------|---------------------|
| 5.1 | Anti-malware deployed | EDR/AV on all infrastructure |
| 5.2 | Anti-malware kept current | Automated updates |
| 5.3 | Anti-malware logs retained | Log retention: 1 year |
| 5.4 | Anti-malware processes running | Continuous monitoring |

**Container Security**:
- Base images scanned for vulnerabilities
- Minimal base images (distroless)
- Read-only root filesystems
- Runtime security monitoring (Falco)

### 5.2 Requirement 6: Secure System Development

| PCI DSS Requirement | MF+SO Implementation |
|--------------------|---------------------|
| 6.1 | Vulnerability management process | Documented, automated scanning |
| 6.2 | Critical patches within 30 days | Automated patch management |
| 6.3 | Secure development lifecycle | SDLC with security gates |
| 6.4 | Change control process | Documented, peer-reviewed |
| 6.5 | OWASP vulnerabilities addressed | Code scanning, training |

**Secure Coding Practices**:
- Input validation and output encoding
- Parameterized queries (where applicable)
- Cross-site scripting (XSS) prevention
- CSRF token implementation
- Security headers (CSP, HSTS, XFO)
- Cryptographic storage of secrets

**Vulnerability Remediation SLAs**:

| Severity | Remediation Timeline |
|----------|---------------------|
| Critical | 7 days |
| High | 30 days |
| Medium | 90 days |
| Low | 180 days |

## 6. Implement Strong Access Control Measures (Requirements 7-9)

### 6.1 Requirement 7: Need-to-Know Access

| PCI DSS Requirement | MF+SO Implementation |
|--------------------|---------------------|
| 7.1 | Access control systems defined | RBAC implemented for all systems |
| 7.2 | Access granted by need-to-know | Access request with manager approval |
| 7.3 | Access reviewed quarterly | Quarterly access review |

**Access Control Model**:

| Role | Infrastructure | Source Code | Monitoring | Support |
|------|---------------|-------------|------------|---------|
| Developer | Read-only | Read/Write | Read-only | Read-only |
| SRE | Read/Write | Read-only | Read/Write | Read-only |
| Security | Read-only | Read-only | Read/Write | Read-only |
| Support | None | None | None | Read/Write |

### 6.2 Requirement 8: Identification and Authentication

| PCI DSS Requirement | MF+SO Implementation |
|--------------------|---------------------|
| 8.1 | Unique user IDs | All personnel have unique accounts |
| 8.2 | Proper authentication | MFA required for all access |
| 8.3 | Secure authentication | Strong password policy, MFA |
| 8.4 | Authentication for non-consumer users | All administrative users authenticated |
| 8.5 | Group/shared IDs prohibited | No shared accounts |
| 8.6 | MFA for remote access | MFA required for all remote access |
| 8.7 | MFA for non-console access | MFA for CLI and API access |

**Authentication Policies**:

| Policy | Configuration |
|--------|--------------|
| Password length | Minimum 14 characters |
| Password complexity | Upper, lower, number, special character |
| Password history | 24 passwords remembered |
| Account lockout | 5 failed attempts, 30-minute lockout |
| Session timeout | 15 minutes of inactivity |
| MFA | FIDO2/WebAuthn hardware-backed |

### 6.3 Requirement 9: Physical Access

| PCI DSS Requirement | MF+SO Implementation |
|--------------------|---------------------|
| 9.1 | Facility entry controls | Inherited from cloud provider |
| 9.2 | Visitor management | Inherited from cloud provider |
| 9.3 | Physical media controls | No physical media used |
| 9.4 | Device security | Company device policy |

## 7. Regularly Monitor and Test Networks (Requirements 10-11)

### 7.1 Requirement 10: Logging and Monitoring

| PCI DSS Requirement | MF+SO Implementation |
|--------------------|---------------------|
| 10.1 | Audit trails enabled | Comprehensive logging implemented |
| 10.2 | Audit trail contents | User ID, event type, date/time, success/failure |
| 10.3 | Audit trail protection | Append-only, integrity verified |
| 10.4 | Audit log review | Daily review of security logs |
| 10.5 | Audit log retention | 12 months online, 12 months offline |
| 10.6 | Time synchronization | NTP with multiple sources |
| 10.7 | Automated log analysis | SIEM with real-time alerting |

**Log Categories**:
- Authentication events (success/failure)
- Authorization changes
- Configuration modifications
- System events (start, stop, errors)
- Network connections
- Administrative actions

### 7.2 Requirement 11: Security Testing

| PCI DSS Requirement | MF+SO Implementation |
|--------------------|---------------------|
| 11.1 | Wireless access point testing | Not applicable (no wireless) |
| 11.2 | Network vulnerability scans | Quarterly internal, external scans |
| 11.3 | Penetration testing | Annual penetration test |
| 11.4 | Intrusion detection | NIDS/HIDS deployed |
| 11.5 | Change detection | File integrity monitoring |
| 11.6 | Incident response plan | Documented and tested annually |

**Penetration Testing Scope**:
- Relay server infrastructure
- Build and deployment pipeline
- Web application (PWA distribution)
- API endpoints
- Network segmentation validation

## 8. Maintain an Information Security Policy (Requirement 12)

| PCI DSS Requirement | MF+SO Implementation |
|--------------------|---------------------|
| 12.1 | Information security policy | Published and communicated |
| 12.2 | Risk assessment process | Annual risk assessment |
| 12.3 | Usage policies documented | Acceptable use policy |
| 12.4 | PCI DSS responsibilities | Roles and responsibilities defined |
| 12.5 | Incident response plan | Documented and tested |
| 12.6 | Security awareness training | Annual training program |
| 12.7 | Personnel screening | Background checks |
| 12.8 | Third-party security | Vendor risk management |
| 12.9 | Service provider oversight | SOC 2 review, contractual requirements |
| 12.10 | Emergency procedures | Documented and communicated |

## 9. Cardholder Data Environment (CDE)

### 9.1 CDE Boundaries

The CDE for MF+SO deployments is defined as follows:

```
[User Device Running MF+SO] ←→ [MF+SO Relay] ←→ [User Device Running MF+SO]
         ↕                                         ↕
    [Payment Application]                    [Payment Application]
         ↕                                         ↕
    [Payment Processor]                       [Payment Processor]
```

The MF+SO relay operates outside the CDE when it does not store, process, or transmit CHD. User devices running MF+SO are in scope when they authenticate to payment systems.

### 9.2 CDE Scope Reduction

MF+SO's architecture supports CDE scope reduction:

| Technique | Implementation |
|-----------|---------------|
| Network segmentation | Relay in separate segment |
| Encryption | E2E encryption prevents data exposure |
| Tokenization | MF+SO can store authentication tokens, not CHD |
| Data minimization | No CHD collection |

## 10. Encryption Standards for Cardholder Data

### 10.1 PCI DSS Encryption Requirements

PCI DSS v4.0 requires:

1. Strong cryptography for transmission of CHD (Requirement 4)
2. Rendering PAN unreadable anywhere it is stored (Requirement 3)

### 10.2 MF+SO Encryption Implementation

| Standard | Usage | Compliance |
|----------|-------|------------|
| TLS 1.3 | All relay communications | PCI DSS compliant |
| AES-256 | End-to-end encryption | PCI DSS compliant |
| RSA 2048+ | Certificate signing (CA) | PCI DSS compliant |
| ECDSA P-384 | Certificate authentication | PCI DSS compliant |
| X25519 | Key exchange | PCI DSS compliant |

### 10.3 Key Management

| Key Type | Generation | Storage | Rotation | Destruction |
|----------|-----------|---------|----------|-------------|
| TLS certificates | Automated (ACME) | Certificate store | 90 days | Automated |
| Relay identity keys | HSMs | HSM-protected | Annual | HSM zeroization |
| Developer signing keys | Local generation | YubiKey | Per key expiry | Physical destruction |
| Session keys | Ephemeral | Memory only | Per session | Automatic |

## 11. Access Control for CDE

### 11.1 Access Control Implementation

**Administrative Access Controls**:

| Control | Implementation |
|---------|---------------|
| Authentication | FIDO2/WebAuthn MFA |
| Authorization | RBAC with just-in-time elevation |
| Encryption | All access via VPN + TLS |
| Logging | All administrative actions logged |
| Session management | 4-hour maximum session, 15-minute inactivity |

**Access Control Technologies**:
- VPN with mTLS authentication
- Bastion hosts for SSH access
- Cloud IAM for API access
- GitHub Teams for code access
- SSO with MFA for internal tools

### 11.2 Least Privilege Implementation

- Default deny access model
- Role-based access with minimum permissions
- Time-bound access grants for emergency access
- Quarterly access certification
- Automated deprovisioning on role change

## 12. Logging and Monitoring

### 12.1 Logging Requirements

| Requirement | Implementation |
|-------------|---------------|
| Log all access to CDE | All authentication attempts logged |
| Log all administrative actions | Full audit trail |
| Log all system events | System logging enabled |
| Protect logs from modification | Append-only, centralized SIEM |
| Retain logs for 12 months | Hot storage: 3 months, cold: 9+ months |

### 12.2 Log Content

Each log entry includes:
- User identification
- Event type
- Date and timestamp
- Success or failure indication
- Origination of event (IP address)
- Affected component

### 12.3 Log Review Process

1. Automated alerting for critical events (real-time)
2. Daily review of security alerts
3. Weekly review of summary reports
4. Monthly trend analysis
5. Quarterly audit log review

### 12.4 Intrusion Detection

- Network-based IDS at network perimeter
- Host-based IDS on relay servers
- Behavioral analytics for anomaly detection
- Alert correlation in SIEM
- Automated response for confirmed threats

## 13. Self-Assessment Questionnaire (SAQ) Mapping

### 13.1 SAQ Type

Based on MF+SO's limited CDE involvement, the applicable SAQ type would be:

| SAQ Type | Applicability | MF+SO Assessment |
|----------|--------------|------------------|
| SAQ A | Card-not-present merchants | Not applicable |
| SAQ A-EP | E-commerce platforms | Not applicable |
| SAQ B | Imprint-only merchants | Not applicable |
| SAQ B-IP | Standalone terminals | Not applicable |
| SAQ C-VT | Virtual terminals | Not applicable |
| SAQ C | Merchant systems connected to internet | Not applicable |
| SAQ D | All other merchants | Partial applicability |
| SAQ P2PE | Point-to-point encryption | Not applicable |

**Recommended SAQ**: SAQ D (for entities with any CDE connection) with scope reduction for MF+SO's relay infrastructure.

### 13.2 SAQ D Mapping

| SAQ Question | MF+SO Reference | Status |
|-------------|-----------------|--------|
| 1.1 Firewall configuration | Section 3.1 | Yes |
| 2.1 Configuration standards | Section 3.2 | Yes |
| 2.2 Default passwords | Section 3.2 | Yes |
| 3.1 Data retention | Section 4.1 | Yes |
| 4.1 CHD encryption in transit | Section 4.2 | Yes |
| 5.1 Anti-malware | Section 5.1 | Yes |
| 6.1 Vulnerability management | Section 5.2 | Yes |
| 7.1 Need-to-know access | Section 6.1 | Yes |
| 8.1 Unique IDs | Section 6.2 | Yes |
| 8.3 MFA | Section 6.2 | Yes |
| 9.1 Physical access | Section 6.3 | Yes |
| 10.1 Audit trails | Section 7.1 | Yes |
| 11.1 Vulnerability scans | Section 7.2 | Yes |
| 12.1 Security policy | Section 8 | Yes |

## 14. Qualified Security Assessor (QSA) Readiness

### 14.1 QSA Engagement Process

1. **Pre-assessment**: Internal readiness review against PCI DSS requirements
2. **Scoping**: Define CDE boundaries with QSA
3. **Evidence collection**: Compile required evidence
4. **On-site assessment**: QSA review of controls
5. **Remediation**: Address identified gaps
6. **Report on Compliance (ROC)**: QSA issues ROC

### 14.2 Evidence Repository

| Evidence Type | Location | Format |
|--------------|----------|--------|
| Firewall configurations | IaC repository | Code |
| Network diagrams | Documentation | Diagram |
| Access control lists | IAM system | Exports |
| Vulnerability scan reports | Security tool | PDF |
| Penetration test reports | Document storage | PDF |
| Security policy | Documentation | PDF |
| Incident response procedures | Documentation | PDF |
| Change management logs | Project tracking | CSV |
| Training records | HR system | CSV |

### 14.3 Remediation Plan

| Finding | Severity | Remediation | Target Date |
|---------|----------|-------------|-------------|
| Document CDE scope formally | Medium | Create CDE scope document | Q1 2026 |
| Implement automated access reviews | High | Deploy IGA tool | Q2 2026 |
| Quarterly ASV scans | Medium | Schedule with ASV | Q1 2026 |
| PCI-specific training | Low | Create training module | Q2 2026 |

## 15. Appendices

### Appendix A: PCI DSS v4.0 Requirements Summary

| Req # | Requirement | Status |
|-------|-------------|--------|
| 1.1 | Firewall configuration standards | Implemented |
| 1.2 | Network traffic controls | Implemented |
| 1.3 | DMZ implementation | Implemented |
| 2.1 | Configuration standards | Implemented |
| 2.2 | Change defaults | Implemented |
| 2.3 | Least functionality | Implemented |
| 3.1 | Data retention/disposal | No CHD stored |
| 3.2 | Sensitive data after auth | N/A |
| 3.5 | Key management | Implemented |
| 4.1 | Strong cryptography in transit | Implemented |
| 5.1 | Anti-malware | Implemented |
| 5.2 | Anti-malware updates | Implemented |
| 6.1 | Vulnerability management | Implemented |
| 6.2 | Patch management | Implemented |
| 6.3 | Secure development | Implemented |
| 6.4 | Change control | Implemented |
| 6.5 | OWASP compliance | Implemented |
| 7.1 | Need-to-know access | Implemented |
| 7.2 | Access controls | Implemented |
| 7.3 | Access reviews | Implemented |
| 8.1 | Unique IDs | Implemented |
| 8.2 | Authentication | Implemented |
| 8.3 | Secure authentication | Implemented |
| 8.4 | Non-consumer authentication | Implemented |
| 8.5 | No shared accounts | Implemented |
| 8.6 | MFA remote access | Implemented |
| 8.7 | MFA non-console access | Implemented |
| 9.1 | Facility entry | Inherited |
| 9.2 | Visitor management | Inherited |
| 10.1 | Audit trails | Implemented |
| 10.2 | Audit trail contents | Implemented |
| 10.3 | Audit trail protection | Implemented |
| 10.4 | Log review | Implemented |
| 10.5 | Log retention | Implemented |
| 10.6 | Time sync | Implemented |
| 10.7 | Automated log analysis | Implemented |
| 11.1 | Wireless testing | N/A |
| 11.2 | Vulnerability scans | Implemented |
| 11.3 | Penetration testing | Implemented |
| 11.4 | IDS/IPS | Implemented |
| 11.5 | Change detection | Implemented |
| 11.6 | Incident response | Implemented |
| 12.1 | Security policy | Implemented |
| 12.2 | Risk assessment | Implemented |
| 12.3 | Usage policies | Implemented |
| 12.4 | PCI responsibilities | Implemented |
| 12.5 | Incident response plan | Implemented |
| 12.6 | Security awareness | Implemented |
| 12.7 | Personnel screening | Implemented |
| 12.8 | Third-party security | Implemented |
| 12.9 | Service provider | Implemented |
| 12.10 | Emergency procedures | Implemented |

### Appendix B: Glossary

| Term | Definition |
|------|-----------|
| ASV | Approved Scanning Vendor |
| CDE | Cardholder Data Environment |
| CHD | Cardholder Data |
| DMZ | Demilitarized Zone |
| E2E | End-to-End |
| HSM | Hardware Security Module |
| IaC | Infrastructure as Code |
| IDS | Intrusion Detection System |
| NIDS | Network Intrusion Detection System |
| HIDS | Host Intrusion Detection System |
| PAN | Primary Account Number |
| PCI SSC | PCI Security Standards Council |
| QSA | Qualified Security Assessor |
| RBAC | Role-Based Access Control |
| ROC | Report on Compliance |
| SAQ | Self-Assessment Questionnaire |
| SIEM | Security Information and Event Management |
| TLS | Transport Layer Security |

### Appendix C: Relevant Standards

- PCI DSS v4.0
- PCI DSS v3.2.1 (transitioning)
- PCI P2PE v3.1
- PCI 3DS v1.0
- NIST SP 800-53
- NIST SP 800-30

### Appendix D: Version History

| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 0.1 | 2025-11-01 | Compliance Team | Initial draft |
| 0.5 | 2025-12-15 | Compliance Team | Complete requirement mapping |
| 1.0 | 2026-01-01 | Compliance Team | First approved version |

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ