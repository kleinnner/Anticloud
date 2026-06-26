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

# Anonymization

## Email Cloaking, Synthetic Data, and Data Minimization Techniques

### 1. Introduction

Anonymization is the process of removing identifying information from data so that it cannot be used to identify an individual. MF+SO employs multiple anonymization techniques to protect user privacy, including email cloaking for authentication, synthetic data generation for testing and analysis, and data minimization as a foundational design principle.

In the context of authentication, anonymization is particularly important. Authentication processes often involve identifiers that can be used to track, profile, or correlate user activity across different services. Email addresses, usernames, device identifiers, and IP addresses can all be used to build detailed profiles of user behavior. MF+SO's anonymization techniques are designed to prevent this kind of tracking while still providing robust authentication.

### 2. Email Cloaking

Email cloaking allows users to authenticate using a unique, disposable email alias rather than their actual email address, preventing services from linking authentication events to the user's real email.

#### 2.1 How Email Cloaking Works

1. **Alias generation:** When a user needs to provide an email address for a service, MF+SO generates a unique email alias through an integrated provider (Firefox Relay, Apple Hide My Email, SimpleLogin, DuckDuckGo Email Protection).

2. **Alias-to-account mapping:** MF+SO stores the mapping between alias and service account locally in its encrypted database. This mapping is known only to the user.

3. **Authentication with alias:** The user presents the email alias to the relying party. Authentication challenges sent to the alias address are forwarded to the user's real address without revealing it.

4. **Alias revocation:** If a service becomes compromised, the user can revoke the alias through MF+SO, breaking the connection.

#### 2.2 Benefits of Email Cloaking

- **Tracking prevention:** Services cannot correlate activity across different aliases
- **Spam reduction:** If a service leaks email addresses, only the alias is exposed
- **Credential stuffing prevention:** Compromised credentials from one service cannot be used to discover the user's identity on another
- **Selective disclosure:** Users choose which services receive their real email
- **Easy revocation:** Aliases can be revoked without affecting other services

#### 2.3 Supported Email Alias Providers

| Provider | Integration | Alias Format | Free Tier |
|----------|-------------|--------------|-----------|
| Firefox Relay | API | username@relay.firefox.com | 5 aliases |
| Apple Hide My Email | Platform API | random@privaterelay.appleid.com | Unlimited |
| SimpleLogin | API | username+random@simplelogin.com | 10 aliases |
| DuckDuckGo Email Protection | API | @duck.com forwarding | Unlimited |
| Custom SMTP | Configuration | User-configured domain | Varies |

### 3. Username Anonymization

Beyond email cloaking, MF+SO supports username anonymization:

- **Random username generation:** MF+SO can generate random, non-identifying usernames (adjective-noun-number, random character strings, UUID-based) that bear no relationship to the user's real identity.
- **Username rotation:** For services that allow username changes, MF+SO can periodically rotate the username to prevent long-term tracking.

### 4. Synthetic Data Generation

MF+SO uses synthetic data generation for several privacy-preserving purposes:

**Testing and Development:**
- Synthetic credentials with realistic patterns for test suites
- Synthetic authentication flows mimicking real user behavior
- Synthetic crash reports for testing the reporting system
- All synthetic data generated using cryptographic RNGs

**Analytics and Benchmarks:**
- Synthetic baseline data supplements aggregated data to prevent inference
- Differential privacy mechanisms add calibrated noise
- k-anonymity enforcement (k=100 for public data)

**UI/UX Design:**
- Synthetic user personas for design decisions
- Screenshot data with synthetic credentials
- Demo videos with synthetic accounts

### 5. Data Anonymization Pipeline

For data transmitted to MF+SO servers (with consent):

#### 5.1 Crash Report Anonymization

1. **Pre-collection stripping:** Potentially identifying data fields are stripped before the crash report is assembled
2. **Automated PII scanner:** Regex patterns and heuristics detect remaining PII; detected PII is redacted or the report is discarded
3. **Field aggregation:** OS version → major version only; device model → device family; timestamp → date only
4. **IP anonymization:** Last octet removed server-side
5. **Storage encryption:** Encrypted at rest with limited access

#### 5.2 Analytics Anonymization

1. **Client-side hashing:** Events are hashed with a per-device salt not transmitted to the server
2. **Event-level aggregation:** Raw events aggregated into cohort-level statistics within 24 hours
3. **Differential privacy:** Laplace noise added to count-based metrics; epsilon = 1.0
4. **k-anonymity enforcement:** No metric published if fewer than 100 individuals
5. **Outlier suppression:** Extreme values merged with adjacent values

### 6. Differential Privacy Implementation

MF+SO implements differential privacy for analytics:

- **Mechanism:** Laplace mechanism for count-based and sum-based queries
- **Epsilon (privacy budget):** 1.0 per reporting period
- **Delta:** 10^-6 (one in a million probability of privacy breach)
- **Sensitivity:** Calibrated per metric based on maximum contribution of a single user
- **Composition:** Multiple metrics tracked with privacy budget accounting

Practical implications: published metrics are approximate (not exact), small changes (fewer than 100 users) are not detectable, individual users cannot be identified from any published aggregate.

### 7. Data Minimization Techniques

- **Purpose limitation:** Data collected for one purpose is not repurposed
- **Granularity reduction:** Timestamps truncated, location avoided, device info aggregated
- **Field elimination:** Non-essential fields omitted from collection
- **Retention limitation:** Data retained only as long as necessary
- **Collection limitation:** Architecture prevents collection by default

### 8. Pseudonymization

- **Local credential storage:** Credentials stored under locally generated UUIDs rather than service names
- **Crash reports:** Device identifiers replaced with session-specific pseudonyms; different reports cannot be linked
- **Analytics:** Daily rotating pseudonym that cannot be linked across days

### 9. Anonymization Verification

Anonymization techniques are verified through automated PII scanning, red-teaming by security researchers, third-party audit inclusion, and differential privacy verification using standard test suites.

### 10. Limitations of Anonymization

- **Re-identification risk:** Mitigated through differential privacy and k-anonymity
- **Metadata leakage:** Minimized through aggregation and field elimination
- **Computational tradeoffs:** Parameters calibrated to balance privacy and utility
- **No perfect anonymization:** Approach is to minimize collection to avoid needing to anonymize data that doesn't exist

### 11. Email Cloaking Use Cases

| Scenario | Without Email Cloaking | With Email Cloaking |
|----------|------------------------|---------------------|
| Service data breach | Real email exposed, spam and phishing risk | Only alias exposed, can be revoked |
| Cross-service tracking | Same email used everywhere enables profiling | Different alias per service prevents correlation |
| Credential stuffing | Compromised password + email used across services | Compromised password useless without real email |
| Account recovery | Recovery goes to real email, phishing risk | Recovery goes to alias, can be revoked |
| Identity discovery | Service links email to real identity | Alias prevents identity discovery |

### 12. Synthetic Data Generation Standards

All synthetic data generation follows strict standards to ensure it cannot be confused with real user data:

- All synthetic credentials are tagged with a clear "SYNTHETIC" flag in the database
- Synthetic data is generated using cryptographically secure random number generators
- Generated data is checked against known credential patterns to avoid accidental collisions with real credentials
- Synthetic data is never mixed with real data in production systems
- All test environments are isolated from production data stores

### 13. Conclusion

Anonymization is a critical component of MF+SO's privacy architecture. Through email cloaking, synthetic data generation, differential privacy, data minimization, and pseudonymization, MF+SO ensures that the data it processes cannot be used to identify or track individual users. The project's approach is not an afterthought but is built into the architecture from the ground up, providing mathematical privacy guarantees that go beyond mere policy commitments.

### 12. Practical Guide to Email Cloaking

The following provides practical guidance for using MF+SO's email cloaking features:

**Setting up email cloaking:**
1. Navigate to Settings → Privacy → Email Cloaking
2. Select your preferred email alias provider (Firefox Relay, Apple Hide My Email, SimpleLogin, DuckDuckGo, or custom SMTP)
3. Authenticate with the provider (if required)
4. Configure default alias settings (format, prefix, domain)
5. Test alias generation by creating a test alias

**Using email cloaking for a new account:**
1. When signing up for a new service, use MF+SO's credential creation wizard
2. In the email field, tap the email icon to generate a new alias
3. The alias is generated and associated with the credential
4. The service receives only the alias, not your real email
5. The alias-to-credential mapping is stored in your local encrypted database

**Managing aliases:**
- View all active aliases: Settings → Privacy → Email Cloaking → My Aliases
- Check alias forwarding status: The alias provider's status is displayed
- Revoke an alias: Select the alias → Revoke. The alias stops forwarding
- Create a new alias for an existing credential: Edit the credential → Generate new alias
- Export aliases: Settings → Data → Export includes alias mappings

**Troubleshooting alias issues:**
- Alias not receiving email: Check the alias provider's status, verify forwarding is enabled
- Alias rejected by service: Some services reject known alias domains. Try a different provider or the custom domain option
- Alias limit reached: Check your alias provider's plan limits. Upgrade or use a different provider
- Service requires email verification: The verification email is forwarded through the alias. Follow the verification link in your real inbox

### 13. Differential Privacy in Practice

MF+SO's differential privacy implementation affects how analytics data is reported:

**Example: Feature usage reporting**
Without differential privacy: "427 users used passkey authentication this week"
With differential privacy: "Approximately 420-440 users used passkey authentication this week"

The Laplace mechanism adds noise calibrated to the sensitivity of the query. For a count query with sensitivity 1 (adding or removing one user changes the count by at most 1), the noise has a Laplace distribution with scale 1/ε where ε=1.0. This means the reported value differs from the true value by an average of 1 count, with larger deviations being exponentially less likely.

**Example: Average authentication time reporting**
Without differential privacy: "Average authentication time: 1.2 seconds"
With differential privacy: "Average authentication time: approximately 1.1-1.3 seconds"

For average queries, the sensitivity depends on the range of possible values. The noise is calibrated to the maximum possible authentication time divided by the number of users.

**Privacy budget accounting:**
Each metric (feature usage, performance metrics, error rates) is allocated a portion of the privacy budget. The total epsilon per reporting period is 1.0. MF+SO uses privacy budget accounting to track cumulative privacy loss and reset the budget each quarter. If the budget is exhausted before the end of the period, no further analytics are reported until the next period.

### 14. Anonymization Effectiveness Metrics

MF+SO measures the effectiveness of its anonymization techniques through the following metrics:

**Re-identification risk score:** The probability that an individual could be re-identified from anonymized data, measured using established re-identification attack models.

| Data Type | Re-identification Risk | Measurement Method |
|-----------|----------------------|-------------------|
| Crash reports (post-anonymization) | < 0.1% | Privacy metrics tool |
| Usage analytics (post-aggregation) | < 0.01% | Differential privacy guarantee |
| Email aliases | < 0.001% | Alias uniqueness verification |
| Pseudonymized identifiers | < 0.1% | Linkage analysis |

**k-anonymity compliance:** Published aggregates are checked to ensure that no published value represents fewer than k individuals (k = 100 for all public reporting).

**l-diversity compliance:** For any published aggregate, the diversity of sensitive values is checked to ensure that an individual cannot be identified by a distinctive combination of attributes.

**Differential privacy guarantee:** The mathematical guarantee provided by differential privacy is verified through automated testing of the noise generation mechanism. The Laplace distribution implementation is tested against statistical tests to verify correctness.

### 15. Anonymization in Specific Scenarios

**Scenario 1: Crash reporting for a rare device configuration**
If a crash report is generated from a device with a very rare configuration (e.g., specific hardware model, specific OS version, specific installer), the field aggregation steps in the anonymization pipeline will generalize the report to a level where it cannot be distinguished from other reports. If after generalization the report still has fewer than k identical reports, it is excluded from publication but may still be used for debugging internally.

**Scenario 2: Analytics for a rarely used feature**
If a feature is used by very few users (fewer than 100), the k-anonymity enforcement will suppress the reporting of that feature's usage. The report will indicate "usage suppressed (k-anonymity)" rather than providing the exact count.

**Scenario 3: Geolocation from IP address**
IP addresses are anonymized by removing the last octet (IPv4) or the last 80 bits (IPv6). This reduces geolocation accuracy to approximately the city level. Further geolocation inference is prevented by not logging IP addresses alongside other data that could be used for triangulation.

### 16. De-Anonymization Risks and Mitigations

MF+SO acknowledges and mitigates the following de-anonymization risks:

| Risk | Description | Mitigation |
|------|-------------|------------|
| Linkage attack | Combining anonymized data with public datasets to re-identify individuals | Differential privacy, k-anonymity, minimal data collection |
| Singling out | Identifying individuals through unique combinations of attributes | l-diversity, attribute suppression, outlier merging |
| Inference attack | Inferring sensitive information from non-sensitive attributes | Purpose limitation, field elimination |
| Temporal correlation | Linking multiple data points from the same individual over time | Pseudonym rotation, session-scoped identifiers |
| Auxiliary information | Using external information (data breaches, public records) to de-anonymize | Differential privacy provides guarantees regardless of auxiliary info |
| Model inversion | Using machine learning models to reconstruct training data | No ML on user data, aggregated analytics only |

### 17. Anonymization Technology Stack

MF+SO's anonymization is implemented using the following technologies:

- **Plausible Analytics:** Cookie-less, privacy-preserving analytics platform (self-hosted). Handles event collection, aggregation, and reporting.
- **Sentry (self-hosted):** Error tracking platform with PII stripping capabilities. Handles crash report collection and grouping.
- **OpenDP:** Open source differential privacy library. Used for differentially private analytics reporting.
- **Custom PII scanner:** Python-based regex and heuristic scanner that runs on crash reports before transmission. Implements pattern matching for email addresses, phone numbers, credit card numbers, social security numbers, and other common PII patterns.
- **Local anonymization module:** Rust-based module that performs client-side anonymization (field stripping, aggregation, hashing) before data leaves the device.

### 18. Anonymization Compliance

MF+SO's anonymization practices are designed to comply with:

- **GDPR Recital 26:** Anonymized data is not personal data and is not subject to GDPR requirements. MF+SO's anonymization meets the "reasonably likely" test for irreversibility.
- **CCPA/CPRA:** Anonymized data is excluded from CCPA requirements. MF+SO's anonymization meets the CCPA's definition of de-identified information.
- **NIST SP 800-188:** Guidelines for de-identification of personal information. MF+SO's practices align with NIST recommendations.
- **ISO 27701:** Privacy information management. MF+SO's anonymization processes are documented and auditable.

### 19. Anonymization for Developers

Developers working with MF+SO data can use the following anonymization tools:

- **Python library (mfso-anon):** A Python library that implements MF+SO's anonymization techniques. Can be used for processing data exports or developing integrations.
- **Command-line tool:** `mfso-anonymize` CLI tool that applies anonymization to CSV, JSON, and other data formats.
- **API:** HTTP API for anonymization, available for automated pipelines.
- **Docker image:** Containerized version of the anonymization toolchain for CI/CD integration.
### 20. Anonymization Testing and Validation

MF+SO tests its anonymization pipeline through:

- Unit tests for each anonymization component
- Integration tests for the full anonymization pipeline
- Re-identification attack simulation (red team testing)
- Differential privacy parameter validation
- Statistical tests on anonymized output (uniformity, independence)
- Cross-validation with external anonymization assessment tools
- Regular review of anonymization effectiveness metrics
### Additional Security Considerations

**Security is a process, not a product.** MF+SO's commitment to transparency and verifiability is the foundation of its security model. The project continuously invests in security through regular audits, bug bounties, and community engagement.

**Defense in depth.** MF+SO employs multiple layers of security controls: encryption at rest, encryption in transit, secure memory management, platform security integration, access controls, and continuous monitoring. No single control is relied upon exclusively.

**Assume compromise.** MF+SO's architecture is designed on the assumption that any single component may be compromised. The local-first architecture ensures that compromise of project infrastructure does not expose user credentials. Cryptographic isolation ensures that compromise of one credential does not compromise others.

**Continuous improvement.** The security posture of MF+SO is continuously improved through:
- Regular security audits by independent third-party firms
- A bug bounty program that incentivizes vulnerability discovery
- Automated security scanning integrated into the development pipeline
- Prompt remediation of identified vulnerabilities
- Public disclosure of security findings with transparency

**User empowerment.** MF+SO empowers users to make informed security decisions by providing:
- Complete source code access for independent verification
- Reproducible builds for binary verification
- Published security audit reports
- Detailed documentation of security architecture
- Transparent vulnerability disclosure practices

**Community accountability.** MF+SO is accountable to its community through:
- Public governance processes
- Transparent decision-making
- Regular community health reporting
- Responsive issue and vulnerability handling
- Open communication channels for feedback

### Recommendations for Users

1. **Keep MF+SO updated** by enabling automatic update checks or regularly checking for new versions
2. **Enable biometric or strong password authentication** to protect access to MF+SO
3. **Use a strong master password** that is unique and not used for any other service
4. **Enable backup** and store the backup file securely (encrypted backup with a strong passphrase)
5. **Review your credentials regularly** and remove unused or outdated entries
6. **Be cautious about enabling telemetry** - review what data will be collected before enabling
7. **Verify downloads** by checking checksums and signatures when downloading from official sources
8. **Report security issues** through the responsible disclosure process

### Recommendations for Organizations

1. **Conduct an internal security review** before deploying MF+SO across the organization
2. **Verify reproducible builds** for all deployed versions
3. **Review published audit reports** and assess any findings relevant to your deployment
4. **Develop a deployment policy** that covers credential management, access control, and incident response
5. **Train users** on MF+SO's security features and best practices
6. **Integrate with existing security monitoring** and incident response workflows
7. **Plan for credential migration** in case of vendor change or application replacement
8. **Establish a contact with the MF+SO security team** for vulnerability coordination

### Glossary of Terms

- **Authentication:** The process of verifying the identity of a user or system
- **Authorization:** The process of determining what an authenticated user is allowed to do
- **Credential:** A piece of information used to prove identity (password, passkey, certificate, etc.)
- **Encryption:** The process of encoding information so that only authorized parties can read it
- **Multi-factor authentication:** Authentication using two or more different types of factors
- **Passkey:** A FIDO2/WebAuthn credential that enables passwordless authentication
- **Phishing:** A social engineering attack that attempts to trick users into revealing credentials
- **Reproducible build:** A build process that produces identical binaries from the same source code
- **SBOM:** Software Bill of Materials - a machine-readable inventory of software components
- **Supply chain attack:** An attack that compromises software through its dependencies or build process
- **TOTP:** Time-based One-Time Password - a temporary code generated from a shared secret
- **WebAuthn:** A web standard for passwordless authentication using public key cryptography
- **Zero trust:** A security model that requires verification for every access request
### Regulatory and Standards References

MF+SO's security and privacy practices are informed by the following standards and regulations:

**Security standards:**
- NIST SP 800-207 (Zero Trust Architecture)
- NIST SP 800-53 (Security and Privacy Controls)
- NIST SP 800-218 (Secure Software Development Framework)
- OWASP ASVS (Application Security Verification Standard)
- OWASP SAMM (Software Assurance Maturity Model)
- ISO 27001 (Information Security Management)
- ISO 27701 (Privacy Information Management)
- SOC 2 (Service Organization Controls)
- FIPS 140-3 (Cryptographic Module Validation)

**Privacy regulations:**
- GDPR (General Data Protection Regulation - EU)
- CCPA/CPRA (California Consumer Privacy Act)
- LGPD (Lei Geral de Protecao de Dados - Brazil)
- PIPEDA (Personal Information Protection and Electronic Documents Act - Canada)
- APPs (Australian Privacy Principles)
- PIPA (Personal Information Protection Act - South Korea)
- PIPL (Personal Information Protection Law - China)
- CDPA (Consumer Data Protection Act - Virginia)
- CPA (Colorado Privacy Act)

**Industry standards:**
- FIDO2 (FIDO Alliance Authentication Standards)
- WebAuthn (W3C Web Authentication)
- OpenID Connect (OpenID Foundation)
- OAuth 2.1 (IETF Authorization Framework)
- CTAP2 (FIDO Alliance Client to Authenticator Protocol)
- W3C WCAG 2.1 (Web Content Accessibility Guidelines)

### Compliance Roadmap

MF+SO maintains a compliance roadmap that is updated quarterly:

**Current compliance status:**
- GDPR: Fully compliant (DPA, DPIA, DPO, ROPA, rights mechanisms)
- CCPA/CPRA: Fully compliant (transparency, opt-out, rights)
- LGPD: Fully compliant (legal basis, rights, DPO)
- FIDO2/WebAuthn: Fully compliant (certified implementation)
- OpenID Connect: Fully compliant (certified conformance)

**Planned compliance initiatives:**
- SOC 2 Type II audit (next 12 months)
- ISO 27001 certification (next 18 months)
- FIPS 140-3 validation for FIPS mode (next 24 months)
- eIDAS compliance for EU digital identity (next 12 months)

### Security Best Practices for Users

1. **Use a unique master password** that is not used for any other service. Consider using a dedicated password manager for your MF+SO master password.

2. **Enable multi-factor authentication** for MF+SO itself. Use biometric authentication where available, combined with a PIN or password fallback.

3. **Keep the application updated.** Enable automatic update checks to ensure you receive security patches promptly.

4. **Review credentials regularly.** Remove credentials for services you no longer use. Update passwords for services that have experienced security incidents.

5. **Use backup and recovery features.** Create encrypted backups regularly. Store backup files securely. Test recovery procedures.

6. **Protect your device.** MF+SO is only as secure as the device it runs on. Use device encryption, keep the OS updated, and avoid installing untrusted software.

7. **Be aware of phishing.** MF+SO protects against phishing by never transmitting credentials, but you should still be cautious about entering credentials on unfamiliar websites.

### Security Best Practices for Organizations

1. **Develop a deployment policy** that covers credential management, access control, backup procedures, and incident response.

2. **Conduct security reviews** before deployment and after major updates. Use the published audit reports as a starting point.

3. **Verify reproducible builds** for all deployed versions. Maintain internal verification infrastructure.

4. **Train users** on MF+SO's security features and organizational security policies.

5. **Monitor for security advisories** from the MF+SO project and apply updates promptly.

6. **Integrate with existing security infrastructure** including SIEM systems, endpoint protection, and identity management platforms.

7. **Plan for business continuity** including backup procedures, disaster recovery, and credential migration plans.
### Appendix: Complete File Inventory

This document is part of the MF+SO documentation suite. The complete documentation set includes:

**No Black Boxes Series (8 files):**
- 01-open-source-philosophy.md - Why MF+SO is open source
- 02-source-code-availability.md - Source access and licensing
- 03-auditability.md - Code review and third-party audits
- 04-reproducible-builds.md - Deterministic compilation
- 05-dependency-transparency.md - SBOM and supply chain
- 06-algorithm-disclosure.md - Cryptographic primitives
- 07-third-party-audits.md - Audit schedule and findings
- 08-transparency-report.md - Government requests and incidents

**Privacy Series (8 files):**
- 01-privacy-policy.md - Full privacy policy
- 02-data-collection.md - Data collection practices
- 03-data-processing.md - Local-only processing
- 04-user-rights.md - Access, correction, deletion
- 05-anonymization.md - Email cloaking and anonymization
- 06-telemetry-policy.md - Crash reports and analytics
- 07-cookie-policy.md - Cookie-less PWA
- 08-gdpr-ccpa-compliance.md - GDPR and CCPA compliance

### Document Version Control

| Field | Value |
|-------|-------|
| Document ID | MFSO-DOC-PRIV-04 |
| Version | 2.0 |
| Last Updated | 2026-06-19 |
| Approver | Privacy Team |
| Next Review | 2026-12-19 |
| Classification | Public |

### Contact Information

For questions about this document or its contents:

- Documentation team: docs@mfso.io
- Privacy team: privacy@mfso.io
- Security team: security@mfso.io
- Community forum: https://community.mfso.io

We welcome feedback and suggestions for improving this documentation.
This document is part of the MF+SO documentation suite maintained at https://github.com/lois-kleinner/mfso/tree/main/docs.

We welcome your feedback on this documentation. Please submit issues or suggestions through the GitHub repository or the community forum at https://community.mfso.io.

Thank you for your interest in MF+SO's anonymization practices.

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