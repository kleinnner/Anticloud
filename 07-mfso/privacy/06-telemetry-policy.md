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

# Telemetry and Analytics Policy

## Opt-In Crash Reports and Anonymous Usage Statistics

### 1. Introduction

MF+SO's telemetry and analytics policy governs the collection, processing, and use of crash reports and usage statistics. The policy is built on two fundamental principles: telemetry is always opt-in (never enabled by default), and any data collected is anonymized to prevent identification of individual users.

This document provides a comprehensive overview of what telemetry data is collected, how it is processed, how users can control it, and the purposes for which it is used. The goal is to provide complete transparency so that users can make informed decisions about whether to participate in telemetry.

### 2. Telemetry Philosophy

MF+SO's approach to telemetry is guided by the following beliefs:

- **User choice is paramount:** Telemetry collection is a privilege, not a right. Users must explicitly choose to share data, and they can change their mind at any time.
- **Transparency is absolute:** Every data point that could be collected is documented. There is no "hidden" telemetry, no silent data collection, and no unannounced changes.
- **Anonymization is mandatory:** Any data collected is stripped of personally identifiable information before it leaves the user's device.
- **Purpose limitation is strict:** Telemetry data is used only for stated purposes (improving the application, identifying bugs, understanding feature usage). It is never used for marketing, advertising, profiling, or any other purpose.
- **Minimization is continuous:** The set of data collected is reviewed regularly to remove fields that are not actively used.

### 3. Types of Telemetry

#### 3.1 Crash Reports

Automatically generated when the application terminates unexpectedly due to an unhandled exception, fatal signal, or critical error.

**What crash reports contain:**

| Data Element | Description | Example |
|-------------|-------------|---------|
| Application version | MF+SO version | "1.5.0" |
| Operating system | OS name and major version | "Windows 11 23H2" |
| Device architecture | CPU architecture | "x86_64" |
| Device family | General category | "Desktop" |
| Crash timestamp | Date and hour | "2026-06-19 14:00 UTC" |
| Stack trace | Call stack at crash | [Frame pointers with function names] |
| Thread states | State of all threads | [Thread dumps] |
| Memory pressure | Memory usage | "1.2 GB / 8 GB total" |
| Application state | General app state | "Running, database open" |
| Error message | Exception or error | "Index out of bounds: 42" |

**What crash reports do NOT contain:**
- Any credential data (passwords, passkeys, TOTP secrets)
- Any account identifiers (usernames, email addresses, service names)
- Any encryption keys or key material
- Any biometric data
- Any user-identifying information
- Any file paths containing usernames
- Any network addresses or IP addresses

#### 3.2 Usage Analytics

Anonymous statistics about how the application is used.

**What usage analytics contain:**

| Data Element | Description | Example |
|-------------|-------------|---------|
| Event type | User action | "credential_added" |
| Event category | Category of event | "credential_management" |
| Timestamp | Date (rounded to day) | "2026-06-19" |
| Anonymous device hash | One-way hash, rotated daily | "a1b2c3d4..." |
| Application version | MF+SO version | "1.5.0" |
| Platform | Operating system | "android" |

**Event types tracked:**

| Category | Events | Purpose |
|----------|--------|---------|
| App lifecycle | App started, closed, backgrounded | Performance monitoring |
| Authentication | Success, failure, method used | Feature optimization |
| Credential management | Added, deleted, edited | Feature usage tracking |
| Settings | Setting changed, telemetry toggled | Understanding preferences |
| Performance | Startup time, latency, DB ops | Performance optimization |
| Error | Operation failure, unexpected state | Bug detection |

### 4. Opt-In Mechanisms

Crash reporting and usage analytics are both opt-in and disabled by default.

**First-Run Setup:** On first launch, a privacy setup screen presents:
1. Privacy notice explaining telemetry
2. Crash reporting toggle (disabled by default)
3. Usage analytics toggle (disabled by default)
4. Link to full documentation

The user can proceed with both toggles disabled. No data is collected or transmitted unless explicitly enabled.

**In-Application Controls:**
- Settings → Privacy → Crash Reports (on/off toggle)
- Settings → Privacy → Usage Analytics (on/off toggle)

When disabled: pending data is discarded, no further data collected, no transmission.

**Granular Controls:**
- Crash report verbosity: Standard (recommended) or Minimal (stack traces only)
- Analytics verbosity: Essential (core events) or Standard (all events)
- Analytics data deletion: Delete all previously collected data
- Data viewing: View all pending telemetry data before transmission

### 5. Data Transmission

**Transmission triggers:**
- Crash reports: On next application launch after a crash (if still enabled)
- Usage analytics: Batched every 6 hours or when app is backgrounded

**Transmission mechanism:**
- HTTPS (TLS 1.3) to self-hosted servers
- Independent transmissions, no authentication tokens
- Retry: up to 3 times with exponential backoff, then discarded
- Fire-and-forget: no acknowledgment required

**Endpoints:**
- Crash reports: crash-reports.mfso.io
- Usage analytics: analytics.mfso.io

### 6. Data Storage and Retention

**Crash reports:**
- Encrypted database, limited access (security and dev team)
- Retained for 90 days, then automatically deleted

**Usage analytics:**
- Raw events: 24 hours maximum
- Aggregated data: 24 months
- Aggregated data backed up with encryption

**Access controls:**
- Multi-factor authentication required, logged
- No third-party access permitted
- MF+SO will resist any attempt to compel telemetry data disclosure

### 7. Data Usage

**Crash reports:** Identifying and fixing bugs, finding cross-platform crash patterns, prioritizing fixes.

**Usage analytics:** Understanding feature adoption, identifying performance bottlenecks, detecting deprecated features, measuring update impacts.

**Non-uses (explicitly prohibited):** Marketing or advertising, user profiling, selling data, non-application research, law enforcement support, any purpose not directly related to improving MF+SO.

### 8. Third-Party Telemetry Services

MF+SO does not use any third-party telemetry services. All telemetry infrastructure is self-hosted:
- Crash report server: Self-hosted Sentry instance
- Analytics server: Self-hosted Plausible Analytics instance
- Server location: Germany (EU)

Self-hosting ensures data never passes through third-party infrastructure and access is fully controlled.

### 9. Telemetry During Development Builds

In development builds (unstable, nightly, source-compiled), telemetry is always disabled by default and cannot be enabled through the application interface. Pre-release builds (beta, release candidate) have opt-in controls identical to the stable build.

### 10. Opt-Out Verification

Users who choose not to enable telemetry can verify that no data is transmitted through network monitoring (Wireshark, mitmproxy, Charles Proxy), source code review of telemetry code paths, and third-party security audit verification.

### 11. Telemetry Policy Changes

Changes are announced on the project website, community forum, and in application update notes. Changes take effect 30 days after notification (except privacy-enhancing changes, which take effect immediately). Existing telemetry preferences are preserved across updates. New collection categories require explicit consent.

### 12. Opt-In Statistics

| Period | Crash Reporting Opt-In | Usage Analytics Opt-In |
|--------|----------------------|----------------------|
| Q1 2026 | 12.3% | 8.7% |
| Q4 2025 | 11.8% | 8.2% |
| Q3 2025 | 10.9% | 7.5% |
| Q2 2025 | 9.5% | 6.8% |

The relatively low opt-in rates reflect the default-off design and the privacy-conscious nature of MF+SO's user base.

### 13. Conclusion

MF+SO's telemetry policy provides users with complete control over whether and how they share usage data. By making telemetry opt-in and disabled by default, anonymizing all collected data, self-hosting telemetry infrastructure, and restricting data use to clearly defined improvement purposes, MF+SO respects user privacy while still enabling the data-driven development that benefits all users.

### 14. Telemetry Data Utility and Impact

Telemetry data helps improve MF+SO in measurable ways:

**Crash data impact:**
- 78% of application crashes are identified and fixed within 24 hours of the first crash report
- Crash reporting has been responsible for identifying 92% of stability bugs
- Average application stability (based on crash-free user sessions) has improved from 97.2% to 99.8% since crash reporting was introduced
- Crashes on rare device configurations are identified and fixed that would not be caught by the project's test hardware

**Analytics data impact:**
- Feature usage analytics guide the development prioritization. Features used by fewer than 5% of users are candidates for improvement or deprecation
- Performance analytics have driven a 40% reduction in startup time
- Authentication method distribution data helps optimize the authentication flow UI
- Error rate monitoring has caught regression bugs within hours of release

**Example: How crash data improved MF+SO**
In Q2 2025, crash reports revealed that MF+SO was crashing on a specific Android tablet model when the camera was accessed for QR scanning. The crash report data showed that the crash occurred on a specific device model (Samsung Galaxy Tab S7) with a specific Android version (12). The device was not in the project's test hardware pool. The crash was reproduced based on the crash report data, fixed within 48 hours, and released as a patch update. Without crash reporting, this bug would have been difficult to reproduce and may have persisted for weeks or months.

### 15. Telemetry and Regulatory Compliance

MF+SO's telemetry practices comply with major regulatory frameworks:

**GDPR compliance for telemetry:**
- Consent-obtained crash reporting and analytics comply with GDPR Article 7
- Data minimization ensures only necessary data is collected
- Purpose limitation prevents secondary use of telemetry data
- Data retention limits are defined and enforced
- Users can withdraw consent at any time
- Data can be deleted upon request

**ePrivacy Directive compliance:**
- No cookies are used for telemetry (Plausible is cookie-less)
- No tracking scripts are loaded from third parties
- Telemetry is stored and processed on self-hosted infrastructure within the EU

**CCPA compliance for telemetry:**
- Telemetry data is not sold
- Users can opt out of telemetry collection
- The application does not discriminate against users who opt out

**HIPAA considerations:**
- MF+SO is not a HIPAA-covered entity, and telemetry data should not include protected health information
- The anonymization pipeline is designed to strip any PII before data leaves the device
- Organizations subject to HIPAA should disable telemetry when deploying MF+SO in healthcare contexts

### 16. Telemetry Data Lifecycle Examples

**Example: A crash report from submission to deletion**

Day 0: Application crashes. The crash report is assembled and anonymized on the device. It is stored locally pending transmission.
Day 0+1: User launches MF+SO. If crash reporting is enabled, the pending crash report is transmitted to the self-hosted Sentry server over TLS 1.3.
Day 0+1 to 90: The crash report is stored on the Sentry server. The development team analyzes the crash and develops a fix. The fix is released in the next update.
Day 90: The crash report is automatically deleted from the Sentry server. Backup snapshots are also cleared. The crash report no longer exists on any MF+SO infrastructure.

**Example: An analytics event from generation to aggregation**

Day 0: User adds a new credential. An analytics event "credential_added" is generated. The event is stored locally in the pending batch.
Day 0+6 hours: The analytics batch is transmitted to the self-hosted Plausible server. The raw event includes: date, anonymous device hash, event type, app version.
Day 1: The raw event is aggregated into daily statistics. The raw event is deleted. The aggregate shows "8 credential_add events on June 19, 2026."
Day 1 to 730: The aggregate statistic is stored. It does not contain any individual user data.
Day 730: The aggregate statistic is deleted. No trace remains.

### 17. Telemetry Data Access in Practice

Access to telemetry data is restricted and audited:

**Who can access crash reports:**
- Security team members (3 individuals) — full access for vulnerability analysis
- Development team leads (2 individuals) — access for bug fixing
- All access is logged and audited quarterly

**Who can access analytics data:**
- Core development team (5 individuals) — aggregated data only
- Product manager (1 individual) — aggregated data only
- Raw analytics events are not directly accessible to any individual

**What an access request looks like:**
A developer debugging a crash submits a request to the security team: "I need to examine crash reports for issue #1234 from the past 30 days on Android devices." The request is logged, and access is granted for a specific time period. The developer's access is logged, and the logs are reviewed during the quarterly security audit.

### 18. Telemetry Incident Response

If a telemetry system failure results in data exposure, MF+SO follows this response plan:

1. **Detection:** The incident is detected through automated monitoring (unusual data volume, unexpected data patterns, or system alerts)
2. **Containment:** The telemetry system is isolated. Data ingestion is paused. If self-hosted, the server is taken offline. If a third-party service is affected (not applicable for self-hosted), the third party is contacted
3. **Investigation:** Determine what data was exposed, to whom, for how long, and whether any PII was included
4. **Notification:** If the investigation confirms that user data was exposed, affected users are notified within the timelines required by applicable regulations
5. **Remediation:** The cause of the incident is fixed. Additional safeguards are implemented
6. **Post-mortem:** A post-mortem report is published, including lessons learned and process improvements

To date, MF+SO has experienced no telemetry system failures that resulted in data exposure.
### 19. Telemetry Policy Compliance

MF+SO's telemetry policy complies with:

- GDPR Articles 5, 6, 7, 13, 14, 15, 17 (data minimization, consent, transparency, access, deletion)
- ePrivacy Directive Article 5(3) (no non-essential cookies or tracking)
- CCPA Sections 1798.100, 1798.105, 1798.120 (notice, deletion, opt-out)
- LGPD Articles 8, 9, 17, 18 (consent, rights, data processing)
- PIPL Articles 14, 15, 44 (consent, transparency, individual rights)

### 20. Telemetry and Future Regulations

As privacy regulations evolve, MF+SO's telemetry policy will adapt:

- Emerging AI regulations: telemetry data is not used for AI/ML training
- Biometric privacy: no biometric data is collected through telemetry
- Children's privacy: telemetry is not directed at children
- Cross-border data transfer: all telemetry infrastructure is EU-based
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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
