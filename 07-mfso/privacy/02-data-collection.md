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

# Data Collection Practices

## What MF+SO Collects, What It Does Not Collect, and Telemetry Opt-In

### 1. Introduction

Data collection is one of the most important privacy considerations in modern software. Many applications collect vast amounts of personal data — often far more than is necessary to provide their core functionality — and monetize this data through advertising, profiling, or sale to third parties. MF+SO takes the opposite approach: data collection is minimized by design, and any data that is collected requires explicit user consent.

This document provides a detailed, transparent account of MF+SO's data collection practices. It covers what data the application collects, the technical mechanisms by which data could be collected (and why they are not used), the types of data that are explicitly excluded from collection, and the telemetry opt-in system that gives users full control over any data sharing.

### 2. The Data Minimization Principle

Data minimization is a core principle of MF+SO's architecture. The principle states that an application should collect only the data that is strictly necessary to provide the service the user requests, and should retain that data only for as long as it is needed. MF+SO extends this principle further: the application should be designed so that even if data collection were attempted, the data would not exist to be collected.

This is achieved through three architectural strategies:

1. **Local-first architecture:** All user data — credentials, keys, preferences, logs — is stored on the user's device. There is no cloud database of user information to be compromised or subpoenaed. The local database is encrypted with user-derived keys that MF+SO itself cannot access.

2. **Ephemeral processing:** Data that is processed temporarily (e.g., credentials during authentication) is held in memory only during the processing window. After the operation completes, the memory is securely zeroed. The plaintext data is never written to disk, swap, crash dumps, or any other persistent storage.

3. **Zero-knowledge design:** Where data must be processed, it is processed in a way that the application itself learns nothing about the content. For example, biometric matching is performed by the platform's secure enclave; MF+SO receives only a Boolean result.

### 3. What MF+SO Collects

#### 3.1 Locally Stored Data (Never Transmitted)

**Authentication Data:**
- Usernames and account identifiers for configured services
- Passwords, passkeys, and other authentication secrets (encrypted at rest)
- TOTP shared secrets and generated one-time passwords
- WebAuthn credential IDs and public keys for registered authenticators
- FIDO2/CTAP2 credential metadata
- Hardware security key metadata (manufacturer, model, protocols)
- Biometric reference data (handled by platform secure enclave, not MF+SO)

**Configuration Data:**
- Application preferences (theme, language, default methods)
- Authentication method ordering and priority
- Timeout and lock settings
- Backup configuration
- Custom authentication flows and rules

**Local Logs:**
- Authentication attempt timestamps and outcomes
- Credential usage history
- Application error logs
- Performance metrics

**Encryption Material:**
- Master encryption key (derived, never stored directly)
- Key derivation salt and parameters
- Recovery codes and backup encryption keys

#### 3.2 Data That May Be Transmitted (With Consent)

**Crash Reports (opt-in, disabled by default):**
- Application state at crash (call stack, thread states)
- Device information: model, OS version, MF+SO version
- Memory and storage usage at crash time
- Timestamp of crash (rounded to hour)
- No credentials, keys, or PII

**Usage Analytics (opt-in, disabled by default):**
- Feature usage events (e.g., "credential_added")
- Performance metrics (startup time, authentication latency)
- Error rates and failure reasons
- No credentials, keys, or PII
- IP addresses anonymized at network edge

**Update Check (automatic, no consent needed):**
- Current MF+SO version
- OS platform and architecture
- No user-identifying information

### 4. Data Collection Technical Implementation

**Crash Reporting** uses a self-hosted Sentry instance. Before transmission, the crash report is scanned for potential PII and redacted. If the anonymization fails, the report is discarded rather than transmitted with potential PII.

**Usage Analytics** uses self-hosted Plausible Analytics. Events are collected locally, batched, and transmitted asynchronously over TLS 1.3. IP addresses are masked. No cookies are used.

**Update Checking** uses the GitHub Releases API. The request includes version, platform, and architecture only. No user-identifying information is included.

### 5. What MF+SO Does NOT Collect

Explicit list of data types that MF+SO does NOT collect:

- No biometric data transmission (fingerprints, face scans, iris scans stay in platform secure enclave)
- No location data (GPS, Wi-Fi positioning, IP geolocation)
- No contact data (contacts, address book, social graph)
- No browsing data (websites visited, services used)
- No communication content (email, messages)
- No file system data outside application sandbox
- No network data (DNS queries, network traffic)
- No advertising identifiers (IDFA, AAID)
- No third-party code for data collection
- No device sensor data (accelerometer, gyroscope, etc.)
- No audio or video (except explicit QR code scanning)

### 6. Data Collection During First Run

On first launch:
1. The application creates its local encrypted database
2. The user acknowledges the privacy policy
3. The privacy setup screen presents: crash reporting (opt-in, disabled), usage analytics (opt-in, disabled), update checking (enabled by default)
4. No data is transmitted during setup until explicitly enabled

### 7. Opt-In and Opt-Out Mechanisms

Users can control data collection at any time:
- Settings → Privacy → Crash Reports (on/off toggle)
- Settings → Privacy → Usage Analytics (on/off toggle)
- Settings → Privacy → Update Checks (on/off toggle)

When a telemetry feature is disabled, any pending data is immediately discarded.

### 8. Data Collection During Application Updates

Telemetry settings are preserved across updates. New data collection categories require explicit consent before activation. Settings are never reset by an update.

### 9. Third-Party Data Collection

MF+SO contains no third-party code that collects data independently. No third-party analytics SDKs, advertising SDKs, crash reporting SDKs (Sentry is self-hosted), social media SDKs, or any other third-party data collection code is included.

### 10. Data Collection Verification

Because MF+SO is open source, claims about data collection can be independently verified through source code review, network traffic monitoring, build verification, and third-party security audits.

### 11. Regulatory Compliance

Data collection practices comply with GDPR (data minimization, purpose limitation, consent), CCPA/CPRA (limited collection, opt-out rights), LGPD, PIPEDA, and other data protection frameworks.

### 12. Future Changes to Data Collection

Any future changes to data collection will follow these principles: expansion only with clear justification, transparent disclosure before implementation, explicit user consent for new categories, and regulatory compliance assessment before deployment.

### 13. Conclusion

MF+SO's data collection practices reflect the project's fundamental belief that privacy is not a feature to be toggled but a design principle to be architected from the ground up. By minimizing data collection, storing data locally by default, requiring explicit opt-in for any data transmission, and avoiding third-party data collection entirely, MF+SO provides authentication services that respect and protect user privacy.

### 13. Detailed Breakdown of Credential Types

The following provides a detailed breakdown of the credential types stored locally by MF+SO:

**Password Credentials:**
- Service URL and name
- Username or account identifier
- Password (encrypted with AES-256-GCM)
- Notes or custom fields (encrypted)
- Category or vault assignment
- Creation and last modification timestamps
- Password strength indicator (computed locally, not stored)
- Expiration date (if configured)

**Passkey Credentials:**
- Relying party identifier and name
- User handle (opaque identifier from the RP)
- Credential ID (from WebAuthn attestation)
- Public key (stored for display purposes, private key in platform secure storage)
- Signature counter (for clone detection)
- Creation timestamp
- Authenticator attachment modality (platform, cross-platform, or both)

**TOTP Credentials:**
- Service name and issuer
- Account name
- Shared secret (encrypted)
- Algorithm (SHA-1, SHA-256, SHA-512)
- Digits (6 or 8)
- Time step (typically 30 seconds)
- Creation timestamp

**Hardware Security Keys:**
- Key name (user-assigned)
- Manufacturer and model
- Protocol support (FIDO2, U2F, OATH, PIV)
- Credential ID list
- PIN verification status
- Firmware version
- Creation timestamp

### 14. Platform-Specific Data Collection

While MF+SO's data collection practices are consistent across platforms, there are platform-specific considerations:

**Windows:**
- Credential storage uses the Windows Credential Manager for platform-level integration
- Biometric authentication uses Windows Hello
- The app is distributed as an MSI installer (no telemetry in the installer)
- The app uses the Windows Data Protection API (DPAPI) for additional key protection

**macOS:**
- Credential storage uses the macOS Keychain for platform-level integration
- Biometric authentication uses Touch ID
- The app is distributed as a DMG (no telemetry in the installer)
- The app uses the Secure Enclave for cryptographic key protection

**Linux:**
- Credential storage uses the local encrypted database (no platform-specific storage)
- Biometric authentication is available through supported PAM modules
- The app is distributed as an AppImage or through package managers
- No platform-specific secure storage is assumed (relying on full-disk encryption)

**Android:**
- Credential storage uses the Android Keystore for key protection
- Biometric authentication uses Android Biometric API
- The app is distributed through Google Play or as an APK
- The app uses Android's credential-encrypted storage

**iOS:**
- Credential storage uses the iOS Keychain for platform-level integration
- Biometric authentication uses Face ID or Touch ID
- The app is distributed through the App Store
- The app uses the Secure Enclave for cryptographic key protection

### 15. Data Collection for Third-Party Integrations

If MF+SO integrates with third-party services (at the user's explicit direction), the following data collection practices apply:

**Browser Extension Integration:**
- The extension communicates with the MF+SO application through a local socket
- No credential data is transmitted over the network
- The extension reads the current website domain to suggest matching credentials
- The extension does not collect browsing history or website content
- The extension's data collection is limited to: current tab URL (for credential matching), form field names (for autofill), and authentication challenge data (for WebAuthn)

**Cloud Backup Services:**
- If the user chooses to back up to a third-party cloud service (not MF+SO infrastructure), the backup file is encrypted before upload
- MF+SO does not have access to the cloud backup service
- The encryption key is derived from the backup passphrase, which is known only to the user
- The cloud backup service's privacy policy applies to the storage of the encrypted file

**Identity Provider Integration:**
- When authenticating with an external identity provider (e.g., Apple, Google, Microsoft), the authentication is performed through platform APIs
- MF+SO receives only the authentication assertion from the platform, not the user's credentials for that provider
- The external identity provider's privacy policy applies to that authentication

### 16. Data Collection Auditing

MF+SO provides users with tools to audit what data has been collected:

**Local Data Audit:**
- Settings → Privacy → Local Data shows a complete inventory of all stored data
- Users can browse credentials, view authentication logs, and inspect application settings
- This inventory is generated from the local database and does not require network access

**Transmitted Data Audit:**
- Settings → Privacy → Data Log shows all data that has been transmitted to MF+SO servers
- Users can view crash report summaries, analytics events, and update check timestamps
- This log is maintained locally and is not accessible to MF+SO

**Platform API Usage Audit:**
- Settings → Privacy → Platform Access shows which platform APIs have been accessed
- Users can see when biometric authentication, camera (QR scanning), and storage access were last used
- This audit log is maintained by the platform, not by MF+SO

### 17. Data Collection Risk Assessment

MF+SO conducts a regular risk assessment of its data collection practices:

| Data Type | Risk Level | Justification | Mitigation |
|-----------|-----------|---------------|------------|
| Local credentials | High (if exposed) | Direct access to user accounts | Encrypted at rest, derived key, secure memory |
| Local logs | Low | Usage patterns only | Stored locally, user-configurable retention |
| Crash reports (anonymized) | Low | No PII, no credentials | Anonymization pipeline, limited retention |
| Usage analytics (anonymized) | Low | Aggregated, no individual data | Differential privacy, k-anonymity |
| Update check data | Very low | Version and platform only | No user identifiers, not retained |
| Website access logs | Low | Standard server logs | 30-day retention, access-controlled |

The risk assessment is reviewed quarterly and updated when data collection practices change.

### 18. Data Collection by Application Version

MF+SO maintains version-specific documentation of data collection practices. When a new version introduces changes to data collection:

1. The change is documented in the version's release notes
2. The privacy policy is updated before the release
3. The data collection documentation in this file is updated
4. Users are notified of the change through the application (for privacy-relevant changes)
5. New data collection categories require opt-in consent before activation

Users can view the data collection practices for their specific application version in the application's About screen.

### 19. Data Collection Compliance Checklist

For organizations evaluating MF+SO's data collection practices for compliance purposes, the following checklist summarizes key findings:

- [ ] Credential data is stored locally and encrypted (AES-256-GCM)
- [ ] No credential data is transmitted to MF+SO or third parties
- [ ] Biometric data is handled by platform APIs, not by MF+SO
- [ ] Crash reporting is opt-in and disabled by default
- [ ] Usage analytics are opt-in and disabled by default
- [ ] No third-party analytics, advertising, or tracking SDKs are used
- [ ] No cookies are used for tracking
- [ ] Location data is not collected
- [ ] Contact data is not collected
- [ ] Browsing history is not collected
- [ ] Data collection is fully documented and verifiable through source code
- [ ] Data retention limits are defined and enforced
- [ ] Data deletion is supported through the application interface
- [ ] Consent can be withdrawn at any time
- [ ] All data collection claims are verifiable through open-source code

Each checkbox represents a design decision that was explicitly made during MF+SO's development and is maintained through code review and security testing.
### 20. Data Collection in Different Application Modes

MF+SO operates in different modes that affect data collection:

**Standard mode (default):**
- All credential processing is local
- No data transmission occurs
- Telemetry is disabled
- Update checking is enabled (for security updates)

**Telemetry-enabled mode:**
- Crash reporting is enabled (if opted in)
- Usage analytics are enabled (if opted in)
- All other processing remains local
- Telemetry data is anonymized before transmission

**Offline mode:**
- No network access is used by the application
- Credential processing is local
- Update checking is disabled
- Telemetry is disabled even if settings indicate otherwise

**Enterprise-managed mode:**
- Data collection is determined by enterprise policy
- Enterprise administrators may enforce telemetry settings
- All credential data remains local (not accessible to administrators)
- Enterprise policy settings are documented in the enterprise deployment guide

### 21. Data Collection During Uninstallation

When MF+SO is uninstalled, the following data collection cleanup occurs:

**Platform-native uninstall:**
- The encrypted credential database is deleted
- Application preferences are deleted
- Local cache files are deleted
- Platform storage (Keychain, Credential Manager) entries are not deleted (platform limitation)
- Users should manually delete platform storage entries if desired

**User-initiated data cleanup:**
- Before uninstalling, users can export their data through Settings -> Data -> Export
- After uninstalling, users can verify data deletion by checking the application directory
- For sensitive environments, secure deletion tools (shred, sdelete) can be used on the application directory
### 22. Data Collection Policy Enforcement

Data collection policies are enforced through:

- Code review: all changes that could affect data collection are flagged and reviewed by the privacy team
- Automated scanning: the CI/CD pipeline scans for unexpected data transmission
- Third-party audit: data collection practices are verified during security audits
- User reporting: users can report suspected data collection violations to privacy@mfso.io
- Network monitoring: periodic network traffic analysis to verify no unexpected data transmission occurs
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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com