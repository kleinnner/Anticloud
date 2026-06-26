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

# Privacy Policy

## Full Privacy Policy: Data Collection, Processing, Sharing, and User Rights

### 1. Introduction

This Privacy Policy describes how MF+SO ("we," "our," or "the project") collects, processes, stores, and shares information when you use the MF+SO application. MF+SO is designed with privacy as a foundational principle. The application is primarily local-first, meaning that your credentials, authentication factors, and personal data remain on your device and are never transmitted to our servers.

Please read this policy carefully. By using MF+SO, you acknowledge the data practices described in this document. If you do not agree with these practices, you should not use the application.

### 2. Data Controller and Contact Information

MF+SO is developed and maintained by the Lois-Kleinner collective, in collaboration with 0-1.gg.

**Privacy Contact:** privacy@mfso.io
**Data Protection Officer:** dpo@mfso.io

For the purposes of the General Data Protection Regulation (GDPR) and other applicable privacy laws, the data controller is the Lois-Kleinner collective. Because MF+SO operates primarily on the user's device and minimizes data collection, the controller role is limited to the data the project actually processes (anonymized telemetry with consent, website access logs, and update check metadata).

### 3. Information We Collect

#### 3.1 Information Collected Locally (Never Transmitted)

The following information is stored exclusively on your device and is never transmitted to MF+SO or any third party:

- **Credentials and authentication factors:** Stored passwords, passkeys, WebAuthn credentials, TOTP secrets, hardware key metadata, biometric templates (if using platform biometric APIs; stored in platform secure enclave, not by MF+SO)
- **Personal identification information:** Display names, profile pictures, email addresses (for account identification within the app)
- **Authentication logs:** Local logs of authentication attempts, success/failure records, credential usage history
- **Application preferences:** UI theme, language selection, default authentication methods, timeout settings, backup configuration
- **Encryption keys:** Master encryption keys, key derivation material, recovery codes

This data is stored in an encrypted local database using AES-256-GCM or ChaCha20-Poly1305 encryption. The encryption key is derived from your master password or biometric authentication and is never accessible to MF+SO or any third party.

#### 3.2 Information Collected with Explicit Consent

With your explicit opt-in consent, MF+SO may collect:

- **Crash reports:** Anonymized crash logs including application state at crash, device type, OS version, and app version. No PII is included.
- **Usage analytics:** Anonymous usage statistics such as feature usage frequency and authentication method preferences. Aggregated and not individually identifiable.
- **Update check information:** Current version number, platform, and architecture. Transmitted automatically but includes no user-identifying information.

#### 3.3 Information Collected Automatically (Minimal)

- **Website visit information:** When you visit the MF+SO website, standard web server logs capture your IP address, browser user agent, requested pages, and access timestamps. Retained for 30 days for operational purposes only.
- **Repository access information:** When you access the MF+SO GitHub repository, GitHub's own privacy policy applies.

### 4. Information We Do NOT Collect

MF+SO explicitly does NOT collect:

- No cloud storage of credentials (passwords, passkeys, biometric data never stored on our servers)
- No personal information (name, email, phone, address not required to use the application)
- No location data (GPS, Wi-Fi positioning, IP geolocation)
- No contact lists or address book
- No browsing history or online activity outside the app
- No keystroke or input logging outside the app interface
- No advertising identifiers (IDFA, AAID)
- No behavioral profiling or user tracking
- No third-party data sharing, selling, or renting

### 5. How We Process Information

All processing of locally stored information occurs on your device and is controlled entirely by you. MF+SO does not have access to or process your locally stored data.

For the limited information transmitted to MF+SO servers (with consent):

- **Crash reports:** Processed to identify and fix bugs. Self-hosted Sentry instance. Retained for 90 days.
- **Usage analytics:** Processed to understand feature adoption and prioritize development. Self-hosted Plausible Analytics. Raw data aggregated within 24 hours, aggregates retained 24 months.
- **Update checks:** Processed to deliver appropriate update notifications. Version information logged temporarily and not retained.

### 6. Legal Basis for Processing

For users in the EEA and other jurisdictions with comprehensive data protection laws:

- **Legitimate interest:** For operational data (website logs, update checks) necessary for providing and securing the service
- **Consent:** For crash reports and usage analytics, collected only with explicit opt-in consent
- **Contractual necessity:** For data processed to deliver application functionality

### 7. Data Sharing and Disclosure

MF+SO does not sell, rent, trade, or share your personal data with third parties for any purpose.

**Service Providers:** We use GitHub (source code hosting — public data only), Hetzner (server hosting — EU location), and Cloudflare (CDN/DDoS protection — anonymized request metadata). All providers are contractually bound to process data only on our instructions and in accordance with this Privacy Policy.

**Legal Disclosures:** We may disclose information if required by law, such as in response to a valid court order. We will make reasonable efforts to notify affected users before disclosing their information, unless prohibited by law.

### 8. Data Retention

| Data Type | Retention Period | Rationale |
|-----------|------------------|-----------|
| Locally stored credentials and keys | Until deleted by user | User control |
| Application logs (local) | Configurable (default 30 days) | User convenience |
| Crash reports (anonymized) | 90 days | Bug fixing |
| Usage analytics raw events | 24 hours | Aggregation |
| Usage analytics aggregates | 24 months | Product planning |
| Website access logs | 30 days | Security monitoring |

### 9. Data Security

MF+SO implements appropriate technical and organizational measures: encryption at rest (AES-256-GCM, ChaCha20-Poly1305), encryption in transit (TLS 1.3), access controls (multi-factor for server access), regular security audits, data minimization, and anonymization of transmitted data.

### 10. International Data Transfers

MF+SO's infrastructure is hosted in the European Union (Germany). Data transmitted to our servers is stored and processed within the EU. Locally stored data on your device is subject to the laws of your jurisdiction. MF+SO has no access to or control over local data and cannot be compelled to disclose it.

### 11. Children's Privacy

MF+SO is not intended for children under 16 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect personal information from children.

### 12. Policy Updates

Material changes to this Privacy Policy will be communicated through the application, project website, and community forum. Changes take effect 30 days after notification, except for changes that enhance privacy protections, which take effect immediately.

### 13. Your Rights

Depending on your jurisdiction, you may have rights including: access, rectification, deletion, restriction of processing, data portability, objection, consent withdrawal, and complaint to a supervisory authority.

To exercise any of these rights, contact privacy@mfso.io.

### 14. Governing Law

This Privacy Policy is governed by the General Data Protection Regulation (GDPR) as the primary legal framework. For users in other jurisdictions, local data protection laws may apply.

### 15. Contact and Complaints

**Privacy Team:** privacy@mfso.io
**Data Protection Officer:** dpo@mfso.io

You have the right to lodge a complaint with your local data protection supervisory authority. For EU users, the lead supervisory authority is the authority based on the project's server location in Germany.

### 16. Privacy Policy for Specific Features

Different MF+SO features have specific privacy implications:

**WebAuthn and Passkey Management:** When MF+SO manages WebAuthn credentials (passkeys), the cryptographic key pairs are generated and stored locally. The public key may be registered with relying parties (websites, services), but the private key never leaves the device. MF+SO cannot access your passkeys or use them to authenticate on your behalf.

**TOTP Code Generation:** Time-based one-time passwords are generated locally from shared secrets stored in the encrypted database. The TOTP codes exist only in memory during the brief display period (typically 30 seconds). MF+SO does not log generated TOTP codes.

**Backup and Restore:** When you create a backup, the backup file is encrypted with a separate backup key derived from your backup passphrase. MF+SO cannot decrypt backup files. Backup files should be stored securely — the project recommends encrypted storage or physical isolation.

**Browser Extension:** The MF+SO browser extension (if used) communicates with the MF+SO application through a local interface. No credential data passes through the browser extension's network connection. The extension does not collect browsing history or website content.

**Hardware Security Key Integration:** When MF+SO communicates with hardware security keys (YubiKey, etc.), the communication is handled through platform APIs. The hardware key's attestation data is processed locally and is not transmitted to any server.

### 17. Data Processing Agreements

Organizations that deploy MF+SO and need to establish data processing agreements (DPAs) can contact the privacy team. Because MF+SO processes data primarily on the user's device and does not access organizational credentials, the DPA requirements are typically limited to:

- Anonymized crash report data (with consent)
- Usage analytics data (with consent)
- Update check metadata

The project provides a standard DPA template that covers these processing activities. The DPA is based on the European Commission's Standard Contractual Clauses and includes the technical and organizational measures implemented by the project.

### 18. Privacy Incidents and Remediation

MF+SO maintains a log of privacy incidents, distinct from security incidents:

| Date | Incident | Impact | Remediation |
|------|----------|--------|-------------|
| N/A | No privacy incidents to date | N/A | N/A |

Privacy incidents are defined as events that result in unauthorized access to, disclosure of, or processing of personal data. To date, MF+SO has experienced no privacy incidents. This is attributable to the project's data minimization practices and local-first architecture.

### 19. Third-Party Subprocessors

MF+SO uses the following third-party subprocessors for infrastructure operations:

| Subprocessor | Service | Data Access | Location | Purpose |
|-------------|---------|-------------|----------|---------|
| Hetzner | Server hosting | Anonymized crash reports, analytics | Germany | Application hosting |
| GitHub (Microsoft) | Source code hosting | Public repository data | Global | Code management |
| Cloudflare | CDN, DDoS protection | Anonymized request metadata | Global | Content delivery |
| HackerOne | Bug bounty platform | Vulnerability reports | Global | Security research |
| Open Collective | Financial platform | Donation/payment data | Global | Financial management |

All subprocessors are contractually bound to process data only on MF+SO's instructions. Subprocessors are reviewed annually for their security and privacy practices.

### 20. Data Protection Impact Assessment Summary

The Data Protection Impact Assessment (DPIA) for MF+SO identified the following key findings:

**Processing activities assessed:**
- Local credential storage and authentication (no personal data processing by MF+SO)
- Anonymized crash report collection (low risk)
- Anonymous usage analytics (low risk)
- Website and infrastructure operations (low risk)

**Risk assessment:**
- Overall risk level: Low
- Highest risk activity: Anonymized crash report collection (potential for inadvertent PII inclusion)
- Mitigations: Pre-collection PII stripping, automated PII scanning, field aggregation, IP anonymization

**Recommendations:**
- Regular review of anonymization effectiveness
- Annual DPIA update
- Privacy training for all contributors with infrastructure access

The DPIA was conducted in accordance with Article 35 of the GDPR and is reviewed annually.

### 21. Privacy Policy for Minors

MF+SO is not intended for children under the age of 16, or the applicable age of digital consent in your jurisdiction. The project does not knowingly collect personal information from children.

If a parent or guardian believes that MF+SO has collected personal information from a child without their consent, they should contact privacy@mfso.io. The project will take steps to delete the information as soon as possible.

Educational institutions that deploy MF+SO for students should obtain appropriate consent from parents or guardians, in accordance with applicable laws (such as FERPA in the United States or COPPA for children under 13).

### 22. Regional Privacy Notices

In addition to the global privacy policy, the following regional notices apply:

**California (CCPA/CPRA):** See the separate "GDPR and CCPA Compliance Summary" document for a detailed explanation of California privacy rights.

**Virginia (VCDPA):** Virginia residents have the right to access, correct, delete, and port personal data. These rights can be exercised through the application interface or by contacting privacy@mfso.io.

**Brazil (LGPD):** Brazilian data subjects have rights under the Lei Geral de Proteção de Dados (LGPD), including access, correction, anonymization, portability, and deletion. These rights are exercised as described in the User Rights document.

**Japan (APPI):** MF+SO complies with the Act on Protection of Personal Information (APPI) through its data minimization, consent-based telemetry, and transparent data handling practices.

### 23. Privacy by Design and Default Implementation

MF+SO implements privacy by design (Article 25 GDPR) through specific architectural decisions:

**Privacy by Design — Proactive not Reactive:**
- Data minimization is enforced at the architecture level, not through policy
- Local-first processing ensures data never leaves the device unless explicitly authorized
- The application is designed to function fully without any data collection

**Privacy by Default:**
- All telemetry is disabled by default (crash reporting, usage analytics)
- No data is transmitted without explicit user action
- Privacy settings are preserved across application updates
- New features default to the most privacy-protective configuration

**Technical Implementation:**
- The application does not have network permissions for data transmission during normal operation
- Telemetry code paths are behind a feature flag that is disabled by default
- When telemetry is disabled, the application does not initialize the telemetry subsystem

### 24. Privacy Policy Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-15 | Initial privacy policy |
| 1.1 | 2025-06-01 | Added data processing details, clarified telemetry consent |
| 1.2 | 2025-12-01 | Updated regional privacy notices, added subprocessor list |
| 1.3 | 2026-03-01 | Added DPIA summary, updated data retention periods |
| 1.4 | 2026-06-01 | Current version — added privacy by design section, expanded user rights |

### 25. Privacy Frequently Asked Questions

**Q: Does MF+SO have access to my passwords?**
A: No. Your passwords and other credentials are encrypted on your device with a key derived from your master password or biometric authentication. MF+SO does not have access to this key and cannot decrypt your credentials.

**Q: What happens if MF+SO's servers are hacked?**
A: MF+SO's servers do not store any user credentials, authentication factors, or personal data. If our servers were compromised, the attacker would gain access only to anonymized crash reports and analytics data, which cannot be used to identify individual users or access their accounts.

**Q: Can law enforcement access my data through MF+SO?**
A: MF+SO does not store any data that could help law enforcement access your accounts. Your credentials are stored only on your device, and MF+SO cannot provide them to anyone, including law enforcement.

**Q: Does MF+SO collect data about which websites I visit?**
A: No. MF+SO only interacts with websites when you explicitly use the application to authenticate. The application does not track your browsing activity.

**Q: Can I use MF+SO without any data collection?**
A: Yes. All telemetry features are opt-in and disabled by default. You can use the full functionality of MF+SO without enabling crash reporting or usage analytics.

### 26. Privacy Commitment Statement

MF+SO makes the following privacy commitments to all users:

1. We will never sell your personal data
2. We will never share your personal data with third parties for advertising or marketing
3. We will never store your credentials or authentication factors on our servers
4. We will always require your explicit consent before collecting any data
5. We will always be transparent about what data we collect and how we use it
6. We will always respect your privacy choices and make them easy to exercise
7. We will never surprise you with changes to our data collection practices
8. We will always publish our security audits and transparency reports

These commitments are not just policies — they are architectural principles that are enforced by the design of the software. You can verify them by inspecting the source code.
### 27. Privacy Training for Contributors

All MF+SO contributors with access to user data or infrastructure receive privacy training:

**Training content:**
- GDPR and CCPA fundamentals
- Data minimization principles
- Privacy by design and default
- Incident response procedures
- User rights handling
- Data protection impact assessment methodology

**Training frequency:**
- Initial training: Before gaining access to user data or infrastructure
- Annual refresher: Each year
- Event-driven: When significant privacy regulations or practices change

**Training records:**
- Training completion is tracked and audited
- Training records are maintained for compliance purposes

### 28. Privacy Audit Schedule

MF+SO maintains a privacy audit schedule:

| Audit Type | Frequency | Scope |
|------------|-----------|-------|
| Privacy policy review | Semi-annual | Policy accuracy, regulatory compliance |
| Data collection audit | Annual | Data inventory, purpose limitation |
| Consent mechanism audit | Annual | Opt-in/opt-out, consent records |
| User rights audit | Annual | Rights request handling, response times |
| Third-party data processing audit | Annual | Subprocessor compliance, DPAs |
| Data retention audit | Annual | Retention schedules, deletion processes |

Privacy audit results are published in the project's transparency reports.
### 29. Privacy and Security Coordination

MF+SO maintains close coordination between privacy and security functions:

- Privacy incidents are handled by the same incident response team as security incidents
- Security audits include privacy impact assessment
- Privacy requirements are integrated into the secure development lifecycle
- Security updates are reviewed for privacy implications before release

This coordination ensures that privacy and security are not treated as separate concerns but as complementary aspects of user protection. A feature that improves security at the expense of privacy is not acceptable, and vice versa.

### 30. Privacy Policy Enforcement

MF+SO enforces this privacy policy through:

- Automated compliance checks in the CI/CD pipeline (data collection verification, consent mechanism validation)
- Quarterly privacy reviews by the privacy team
- Annual privacy audit by an external auditor
- User feedback mechanisms for reporting privacy concerns
- Public transparency reporting for accountability

Violations of this policy are treated as security incidents and handled through the incident response process.

### 31. User Feedback on Privacy

MF+SO values user feedback on privacy matters:

- Privacy feature requests: community.mfso.io (Privacy category)
- Privacy concerns: privacy@mfso.io
- Privacy policy feedback: privacy@mfso.io
- Bug bounty program: privacy-related bugs are in scope

Feedback is reviewed by the privacy team and incorporated into the project's privacy roadmap. Users who submit privacy feedback are acknowledged in the project's privacy acknowledgments (with consent).
### 32. Privacy Policy Acceptance

By using MF+SO, you acknowledge that you have read and understood this privacy policy. If you do not agree with any part of this policy, you should not use the application.

Your continued use of MF+SO after changes to this policy take effect constitutes your acceptance of the changes. If you do not accept the changes, you should stop using the application and delete your data before the changes take effect.

### 33. Contact Information Summary

| Purpose | Contact | Response Time |
|---------|---------|---------------|
| Privacy inquiries | privacy@mfso.io | 48 hours |
| Data Protection Officer | dpo@mfso.io | 48 hours |
| Security issues | security@mfso.io | 24 hours (critical) |
| General inquiries | hello@mfso.io | 5 business days |
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com