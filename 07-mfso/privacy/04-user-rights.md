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

# User Rights

## Access, Correction, Deletion, Portability, and Withdrawal

### 1. Introduction

User rights are a cornerstone of modern data protection frameworks such as the GDPR, CCPA, and similar laws worldwide. These rights give individuals control over their personal data, including the right to access what data is held, to correct inaccuracies, to delete data, to port data to other services, and to withdraw consent for data processing.

MF+SO takes user rights seriously. However, the nature of MF+SO's architecture — local-first, with minimal data collection and no cloud storage of credentials — means that many user rights are exercised differently than in traditional cloud-based services. This document explains the user rights that MF+SO provides, how they can be exercised, and the architectural context that shapes their implementation.

### 2. The Right to Access (GDPR Article 15)

The right to access gives users the right to know what personal data is being processed, how, and for what purpose.

**In MF+SO, the right to access is exercised primarily through the application itself:**

- **Locally stored data:** All locally stored data — credentials, authentication factors, application settings, local logs — is directly accessible through the application interface. Users can browse their stored credentials, view authentication history, and inspect settings at any time without making a formal request.

- **Transmitted data:** For limited data transmitted to MF+SO servers (crash reports, usage analytics), users can view what has been sent through Settings → Privacy → Data Log.

- **Formal access request:** Users can contact privacy@mfso.io for a formal data access request under GDPR or other frameworks. Because the project collects minimal data, such requests typically confirm that no user credentials, authentication data, or personal information are held by MF+SO, and provide any anonymized data associated with the request.

**Response timeline:** Formal access requests are acknowledged within 48 hours and fulfilled within 30 calendar days.

### 3. The Right to Rectification (GDPR Article 16)

The right to rectification gives users the right to have inaccurate personal data corrected.

**In MF+SO, rectification is exercised through the application interface:**

- Credential editing: Users can edit any stored credential at any time
- Setting correction: Application settings can be modified at any time
- Account information: User-provided labels or identifiers can be corrected directly

Because MF+SO maintains no central database of user information, users have full control over their local data and can correct any inaccuracies immediately.

### 4. The Right to Deletion (GDPR Article 17)

The right to deletion gives users the right to have their personal data deleted.

**In MF+SO, deletion can be exercised through multiple options:**

- **Individual credential deletion:** Select a credential → Delete → Confirm. The credential is securely deleted from the encrypted database.
- **Bulk deletion:** Select multiple credentials for batch deletion, delete all for a specific category or relying party.
- **Full application reset:** Settings → Security → Reset Application. The entire encrypted database and all associated files are securely deleted. The application returns to initial setup state.
- **Application uninstallation:** The encrypted database, preferences, and sandboxed storage are deleted.

**Server-side data:** Anonymized crash reports are automatically deleted within 90 days. Analytics raw data is aggregated within 24 hours and deleted. Users can request expedited deletion of remaining server-side data by contacting privacy@mfso.io.

### 5. The Right to Data Portability (GDPR Article 20)

The right to data portability gives users the right to receive their personal data in a structured, commonly used, machine-readable format and to transmit that data to another service.

**Supported export formats:**

| Format | Description | Coverage |
|--------|-------------|----------|
| CSV | Comma-separated values | Credential list (service, username, URL) |
| JSON | JavaScript Object Notation | Full credential data (all fields) |
| Encrypted MF+SO backup | Native encrypted format | All data, restoreable in another MF+SO instance |
| Bitwarden JSON | Bitwarden-compatible format | Migration to/from Bitwarden |
| 1Password CSV | 1Password-compatible CSV | Migration to/from 1Password |
| Apple Keychain | Apple-native format (macOS only) | Export to Apple Keychain |

**How to exercise portability:** Settings → Data → Export → Select format → Select scope → Generate export → Save to desired location.

Because MF+SO stores data locally, portability is inherently simpler than in cloud-based services. Users can generate an export at any time without waiting for a server to process the request.

### 6. The Right to Restrict Processing (GDPR Article 18)

Processing restriction is implemented through telemetry opt-out (disable crash reporting and analytics), update check control, and the ability to choose not to perform operations that involve data transmission.

### 7. The Right to Withdraw Consent (GDPR Article 7)

**Consent withdrawal** can be exercised at any time through Settings → Privacy → toggle off enabled telemetry features. Withdrawal takes effect immediately. Any pending data is discarded. Core authentication functionality continues without degradation.

| Consent Type | How Given | How Withdrawn | Effect |
|-------------|-----------|---------------|--------|
| Crash reporting | Opt-in during setup or settings | Toggle off in settings | No more crash reports sent |
| Usage analytics | Opt-in during setup or settings | Toggle off in settings | No more analytics sent |
| Privacy policy acceptance | Acknowledged during setup | N/A (necessary for use) | Cannot use without acceptance |

### 8. The Right to Object (GDPR Article 21)

MF+SO does not process personal data based on legitimate interest grounds (except operational data) and does not engage in direct marketing. Users who wish to object to any processing can contact privacy@mfso.io.

### 9. Rights Related to Automated Decision-Making

MF+SO does not make automated decisions that produce legal or similarly significant effects. All authentication decisions are based on user-initiated actions and explicit cryptographic verification.

### 10. Exercising Your Rights

| Right | Directly in App | Via Email |
|-------|-----------------|-----------|
| Access | Browse credentials in app interface | privacy@mfso.io |
| Correction | Edit credentials directly | privacy@mfso.io |
| Deletion | Delete credentials directly | privacy@mfso.io |
| Portability | Settings → Data → Export | privacy@mfso.io |
| Consent withdrawal | Settings → Privacy → Telemetry | privacy@mfso.io |

### 11. Response Timeline

| Request Type | Acknowledgment | Substantive Response |
|-------------|----------------|---------------------|
| Access | 48 hours | 30 calendar days |
| Correction | 48 hours | 30 calendar days |
| Deletion | 48 hours | 30 calendar days |
| Portability | 48 hours | 30 calendar days |
| Consent withdrawal | Immediate (via settings) | N/A |

### 12. Limitations on User Rights

- Data not in MF+SO possession cannot be provided, corrected, or deleted (local data is user-controlled)
- Anonymized and aggregated data cannot be retroactively associated with a specific user
- Identity verification may be required to prevent unauthorized access

### 13. Local-First Architecture and User Rights

The local-first architecture transforms the user rights paradigm. In cloud services, users must request that the service provider exercise rights on their behalf. In MF+SO, users have direct, immediate control:

| Right | Cloud Service | MF+SO |
|-------|---------------|-------|
| Access | Submit request, wait for response | Browse directly in app |
| Correction | Request change, wait for processing | Edit directly in app |
| Deletion | Request deletion, wait for confirmation | Delete directly in app |
| Portability | Request export, wait for download link | Export directly in app |
| Withdrawal | Change settings in account portal | Change settings in app |

### 14. Conclusion

MF+SO provides comprehensive user rights that align with GDPR, CCPA, and other data protection frameworks. While the local-first architecture means that many rights are exercised differently than in cloud-based services, the result is more direct and immediate user control. Users can access, correct, delete, and export their data at any time through the application interface, without needing to submit formal requests or wait for responses.

### 14. How to Exercise Rights: Step-by-Step

The following provides step-by-step instructions for exercising each user right through the application:

**Access your data:**
1. Open MF+SO and authenticate (biometric, PIN, or master password)
2. Navigate to the credential list (main screen)
3. Browse all stored credentials. Each entry shows: service name, username, authentication method, creation date
4. Select any credential to view its full details
5. Navigate to Settings → Privacy → Local Data to view additional stored data (preferences, logs)
6. Navigate to Settings → Privacy → Data Log to view transmitted data (crash reports, analytics)

**Correct incorrect data:**
1. Open MF+SO and authenticate
2. Select the credential with incorrect data
3. Tap the "Edit" button
4. Modify the incorrect fields
5. Tap "Save" to store the corrected data
6. The old data is overwritten in the encrypted database

**Delete specific credentials:**
1. Open MF+SO and authenticate
2. Navigate to the credential list
3. Select the credential to delete
4. Tap "Delete" and confirm
5. The credential is securely removed from the encrypted database
6. The deletion is logged locally

**Delete all data (application reset):**
1. Open MF+SO and authenticate
2. Navigate to Settings → Security
3. Select "Reset Application"
4. Read the warning about permanent data loss
5. Enter your master password to confirm
6. The entire encrypted database is securely deleted
7. The application returns to its initial setup state

**Export your data:**
1. Open MF+SO and authenticate
2. Navigate to Settings → Data → Export
3. Select the export format (CSV, JSON, encrypted backup, etc.)
4. Select the scope (all credentials, specific vaults, specific categories)
5. Set an export passphrase (for encrypted formats)
6. Choose the export destination
7. The export file is generated and saved

**Withdraw telemetry consent:**
1. Open MF+SO and authenticate
2. Navigate to Settings → Privacy
3. Toggle off "Crash Reports" and/or "Usage Analytics"
4. Any pending telemetry data is immediately discarded
5. No further data is collected or transmitted

### 15. Rights Exercise for Data on MF+SO Servers

For the limited data that may be held on MF+SO servers (anonymized crash reports and analytics), the rights exercise process differs:

**Right to access:**
1. Send an email to privacy@mfso.io with "Access Request" in the subject line
2. Include your device identifier (available in Settings → Privacy → Device ID)
3. The privacy team will respond with a summary of any data associated with your device
4. Because data is anonymized, we may not be able to identify all data associated with your device

**Right to deletion:**
1. Send an email to privacy@mfso.io with "Deletion Request" in the subject line
2. Include your device identifier
3. The privacy team will delete any data associated with your device from our servers
4. Note that aggregated analytics data cannot be retroactively deleted because individual contributions cannot be identified

**Right to portability:**
1. Send an email to privacy@mfso.io with "Portability Request" in the subject line
2. Include your device identifier
3. The privacy team will provide any data we hold in a machine-readable format
4. Because we hold minimal data, the portability package is typically very small or empty

### 16. Rights by Jurisdiction

The following table summarizes user rights by major jurisdiction:

| Right | GDPR (EU) | CCPA (California) | LGPD (Brazil) | PIPL (China) | MF+SO Support |
|-------|-----------|-------------------|---------------|--------------|---------------|
| Access | Article 15 | 1798.110 | Article 9 | Article 45 | Directly in app |
| Correction | Article 16 | 1798.106 | Article 18 | Article 46 | Directly in app |
| Deletion | Article 17 | 1798.105 | Article 16 | Article 47 | Directly in app |
| Portability | Article 20 | Not explicit | Article 18 | Article 45 | Multi-format export |
| Restriction | Article 18 | Not explicit | Article 18 | Article 44 | Telemetry opt-out |
| Objection | Article 21 | Not explicit | Article 19 | Article 44 | Telemetry opt-out |
| Automated decisions | Article 22 | Not explicit | Article 20 | Not explicit | No automated decisions |
| Consent withdrawal | Article 7 | Not explicit | Article 8 | Article 15 | Settings toggle |
| Complaint | Article 77 | Not explicit | Article 18 | Article 50 | privacy@mfso.io |

### 17. Data Retention and Rights

The relationship between data retention and user rights is important to understand:

- **Locally stored data:** Retained until the user deletes it or the application is uninstalled. Users can exercise their rights at any time.
- **Crash reports:** Retained for 90 days. After 90 days, the data is automatically deleted and cannot be accessed, corrected, or ported.
- **Usage analytics raw data:** Retained for 24 hours. After 24 hours, only aggregated statistics remain. Individual data cannot be accessed, corrected, or ported after aggregation.
- **Usage analytics aggregates:** Retained for 24 months. Aggregated data cannot be associated with individual users and cannot be accessed, corrected, or ported.
- **Website logs:** Retained for 30 days. After 30 days, logs are deleted and cannot be accessed.

Users should exercise their rights within the relevant retention period for the data type. After the retention period, the data no longer exists and rights cannot be exercised.

### 18. Identity Verification for Rights Requests

When processing formal rights requests (submitted by email), MF+SO may need to verify the requester's identity to prevent unauthorized access to data:

**What we verify:** We verify that the person making the request is the same person whose data is being requested. For data that is not associated with a specific identity (anonymized data), verification may not be possible.

**How we verify:** We may ask for confirmation of the device ID, the timestamp of the first crash report or analytics submission, or other information that only the legitimate user would know.

**What we do NOT require:** We do not require copies of government-issued identification, proof of address, or any other sensitive personal information for verification.

**If verification fails:** If we cannot verify the requester's identity, we may deny the request or request additional verification. We will explain the reason for denial and how to appeal.

### 19. Authorized Agent Requests

Under the CCPA and other applicable laws, users may designate an authorized agent to exercise their rights on their behalf:

**Requirements:**
- The authorized agent must provide written authorization signed by the user
- The user must verify their identity directly with MF+SO
- The authorized agent must verify their own identity

**Process:**
1. The user sends an email to privacy@mfso.io designating the authorized agent
2. The user verifies their identity through the standard verification process
3. The authorized agent submits the rights request on behalf of the user
4. MF+SO processes the request as if it were submitted by the user directly

### 20. Non-Discrimination for Rights Exercise

MF+SO does not discriminate against users who exercise their privacy rights. Regardless of whether you exercise any or all of your rights:

- You will receive the same level of service
- You will have access to all features of the application
- You will not be charged different prices
- You will not receive different quality of service
- You will not be denied service (except in cases where exercise of a right makes service impossible, such as withdrawing privacy policy acceptance)

This non-discrimination policy applies to all users, regardless of jurisdiction.
### 21. User Rights Resources

The following resources are available to help users exercise their rights:

- Step-by-step guides: https://mfso.io/docs/user-rights
- Video tutorials: https://mfso.io/tutorials/user-rights
- FAQ: https://mfso.io/faq/privacy
- Contact form: https://mfso.io/contact
- Support forum: https://community.mfso.io

### 22. User Rights for Enterprise Deployments

For enterprise deployments of MF+SO, user rights are handled as follows:

- The enterprise (organization) is the data controller for credential data stored on enterprise-managed devices
- MF+SO is the data processor for the limited data transmitted with consent
- Enterprise users should contact their organization's IT department for credential-related rights
- Enterprise users can contact MF+SO for telemetry-related rights
- Data processing agreements are available for enterprise customers
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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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