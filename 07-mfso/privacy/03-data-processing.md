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

# Data Processing

## Local-Only Processing, No Cloud Servers, Zero-Knowledge Architecture

### 1. Introduction

Data processing is the set of operations performed on user data within MF+SO. This document provides a comprehensive account of how MF+SO processes data, emphasizing three core principles: all sensitive processing occurs locally on the user's device, no cloud servers are involved in authentication or credential management, and the architecture employs zero-knowledge techniques wherever data must be shared or verified.

The distinction between local and remote processing is fundamental to MF+SO's privacy model. In traditional authentication applications, sensitive operations such as biometric matching, credential verification, and key management may be performed on remote servers, creating privacy risks and potential points of compromise. MF+SO moves all such operations to the user's device, ensuring that the user's sensitive data never leaves their control.

### 2. Local Processing Architecture

MF+SO's processing architecture is designed around local-first principles. All operations involving user credentials, authentication factors, encryption keys, and personal data are performed on the user's device.

#### 2.1 Credential Storage and Management

When a user adds a credential to MF+SO, the following processing occurs entirely on-device:

1. **Credential ingestion:** The credential data is received through the application interface (manual entry, import, browser extension, QR code scanning for TOTP).

2. **Encryption:** The credential is encrypted using AES-256-GCM or ChaCha20-Poly1305 with a unique nonce and authentication tag. The encryption key is derived from the user's master password or biometric authentication using Argon2id key derivation.

3. **Storage:** The encrypted credential is stored in the local SQLCipher database, which provides transparent encryption at the database level.

4. **Access control:** When the user needs to use a credential, they authenticate to MF+SO. The master encryption key is derived from this authentication and used to decrypt the requested credential in memory. The plaintext credential exists only for the duration of the operation and is then securely zeroed from memory.

#### 2.2 Authentication Processing

When MF+SO authenticates to a relying party:

1. The user initiates authentication at the relying party's interface
2. MF+SO presents matching credentials for the user to select
3. The cryptographic authentication assertion is generated locally
4. The assertion is delivered to the relying party through the appropriate channel (WebAuthn API, TOTP code, etc.)

The relying party never receives any information about MF+SO itself, the user's other credentials, or the user's authentication factors.

#### 2.3 Biometric Processing

Biometric authentication is processed entirely by the platform's biometric subsystem:

1. **Enrollment:** MF+SO requests access to the platform biometric API. The biometric template is stored in the platform's secure enclave or TEE. MF+SO never receives the template.

2. **Verification:** MF+SO calls the platform biometric API, which performs matching in the secure enclave. MF+SO receives only a Boolean result.

3. **Fallback:** If biometric authentication fails, MF+SO falls back to master password or PIN authentication, processed locally using Argon2id verification.

### 3. No Cloud Servers

MF+SO is designed to function without any cloud servers for its core functionality:

- **No cloud authentication:** When you authenticate using a credential stored in MF+SO, the credential is retrieved from the local database, the assertion is generated locally, and it is delivered directly to the relying party. No MF+SO server is involved.

- **No cloud credential sync:** MF+SO does not offer cloud-based credential synchronization. Each device maintains its own local credential database. Local-only backup options are available (encrypted local file, manual transfer).

- **Infrastructure servers:** MF+SO operates servers for specific non-credential purposes: website (mfso.io), package repository, update check API, crash reporting (opt-in), analytics (opt-in), and community forum. None of these servers have access to user credentials.

### 4. Zero-Knowledge Architecture

MF+SO achieves zero-knowledge through the following mechanisms:

**Zero-Knowledge Proofs:** MF+SO uses ZKP techniques to verify credentials without revealing them. Password verification uses locally stored Argon2id hashes. WebAuthn assertions prove possession of private keys without revealing the keys.

**End-to-End Encryption:** Backup files are encrypted with a key derived from a backup passphrase. Export files use per-export keys. MF+SO servers never have access to encryption keys.

**Ephemeral Processing:** Decrypted credentials exist in memory only during the specific operation. Memory is securely zeroed after use. Plaintext is never written to disk, swap, or crash dumps.

**Cryptographic Isolation:** Each credential is encrypted with a unique key derived from the master key and a per-credential salt. Compromise of one encrypted credential does not compromise others. Domain separation prevents cross-protocol attacks.

### 5. Processing Lifecycle

| Stage | Description | Location | Security Controls |
|-------|-------------|----------|-------------------|
| Collection | Data from user input or platform API | Device | Input validation, sandboxing |
| Encryption | Data encrypted before storage | Device | AES-256-GCM, unique nonces |
| Storage | Encrypted data persisted | Device | SQLCipher, file-level encryption |
| Retrieval | Data read from storage | Device | Access control, authentication |
| Decryption | Data decrypted for use | Device | In-memory only, ephemeral |
| Processing | Authentication operations | Device | Zero-knowledge, constant-time |
| Destruction | Secure deletion | Device | Memory zeroing, file shredding |

### 6. Third-Party Processing

MF+SO uses no third-party services for data processing. No cloud AI/ML services for biometric matching, no third-party authentication services, no third-party credential storage, no third-party data processing pipelines. All processing is performed by code in the MF+SO application process.

### 7. Processing During Backup

When creating a backup: encrypted credentials are read from the local database, decrypted and re-encrypted with the backup key (derived from backup passphrase), and written to the user-specified location. The backup file is encrypted with Argon2id key derivation from the backup passphrase.

### 8. Processing During Updates

Updates: pre-update safety backup, local database schema migration if needed, post-update integrity verification. All update processing occurs locally.

### 9. Processing Verification

Because all processing is local and MF+SO is open source, users can verify processing claims through source code review, third-party audit reports, network monitoring (to verify no unexpected connections), and platform debugging tools.

### 10. Conclusion

MF+SO's data processing architecture is built on the principles of local execution, zero-knowledge design, and full user control. By ensuring that all sensitive processing occurs on the user's device, that no cloud servers are involved in authentication or credential management, and that zero-knowledge techniques protect data that must be shared, MF+SO provides a privacy-respecting authentication experience that does not require users to trust external infrastructure.

### 9. Detailed Authentication Flow Processing

The following provides a detailed walkthrough of the processing that occurs during different authentication methods:

**Password-based authentication:**
1. User navigates to the relying party's authentication page
2. User selects the credential in MF+SO's credential list
3. MF+SO retrieves the encrypted credential from the local database
4. The credential is decrypted in memory using the master encryption key
5. The password is auto-filled into the relying party's form (or copied to clipboard)
6. After the password is filled or copied, the memory holding the plaintext password is immediately zeroed
7. A local log entry is created: timestamp, service name, authentication method (password)

**Passkey/WebAuthn authentication:**
1. User navigates to the relying party's WebAuthn authentication page
2. The relying party sends a WebAuthn authentication challenge (navigator.credentials.get())
3. The platform routes the challenge to MF+SO
4. MF+SO identifies the matching credential based on the relying party ID
5. The user authenticates to MF+SO (biometric, PIN, or master password)
6. MF+SO uses the stored private key to sign the authentication challenge
7. The signed assertion is returned to the platform, which delivers it to the relying party
8. The private key is used only for the signature operation and remains in secure storage
9. A local log entry is created: timestamp, relying party, authentication method (passkey)

**TOTP-based authentication:**
1. User selects the TOTP credential in MF+SO
2. The TOTP shared secret is decrypted in memory
3. The current TOTP code is generated using the RFC 6238 algorithm
4. The code is displayed to the user or copied to clipboard
5. The shared secret and generated code are zeroed from memory after use
6. A local log entry is created: timestamp, service name, authentication method (TOTP)

**Hardware key authentication:**
1. User initiates authentication at the relying party
2. The relying party sends a CTAP2/WebAuthn challenge
3. MF+SO activates the connected hardware security key (user must touch/activate the key)
4. The hardware key performs the cryptographic operation internally
5. The signed assertion is returned through MF+SO to the relying party
6. MF+SO does not have access to the hardware key's private keys
7. A local log entry is created: timestamp, relying party, authentication method (hardware key)

### 10. Processing During Credential Import

When importing credentials from another password manager or authenticator:

1. **Import initiation:** User selects the import option and chooses the import format (CSV, JSON, Bitwarden JSON, 1Password CSV, etc.)
2. **File reading:** The import file is read and parsed. The file is not imported into the main database at this point; it is held in memory for preview
3. **Preview:** User reviews the parsed credentials and selects which to import
4. **Duplicate detection:** Selected credentials are checked against existing entries for duplicates. User is prompted to skip or overwrite duplicates
5. **Encryption and import:** Selected credentials are encrypted with the master key and stored in the local database
6. **Source file deletion:** User is prompted to securely delete the import file after successful import
7. **Verification:** A sample of imported credentials is verified by decrypting and comparing with the original values

Throughout this process, the import file is never transmitted to any network service. All processing occurs locally.

### 11. Processing During Backup and Restore

**Backup processing:**
1. User initiates backup through Settings → Data → Backup
2. User selects backup location (local file, external drive, network share)
3. User creates a backup passphrase (strength indicator is shown)
4. All credentials are read from the encrypted database
5. Credentials are re-encrypted with a backup key derived from the backup passphrase using Argon2id
6. Application settings and configuration are included in the backup
7. The backup file is written to the selected location
8. A backup verification step decrypts a sample of records from the backup to ensure integrity
9. The user can choose to encrypt the backup file with the operating system's file encryption (BitLocker, FileVault, etc.)

**Restore processing:**
1. User initiates restore through Settings → Data → Restore
2. User selects the backup file
3. User enters the backup passphrase
4. The backup file is decrypted in memory
5. User can choose to merge with existing data or overwrite
6. If merging, duplicate detection is performed
7. Credentials are re-encrypted with the current master key (which may differ from the backup key)
8. A restore verification step decrypts a sample of records
9. The backup file is not modified during the restore process

### 12. Processing for Edge Cases

MF+SO's local processing handles several edge cases:

**No network connectivity:** All authentication operations work without network connectivity. The only features that require connectivity are: update checking (optional), crash report submission (optional), and analytics submission (optional).

**Application crash during processing:** If the application crashes during a processing operation (e.g., during credential import), the partially imported data is handled through a crash recovery mechanism. The database maintains a write-ahead log that allows recovery to a consistent state.

**Memory pressure:** On devices with limited memory, MF+SO adjusts its processing behavior to reduce memory usage. The credential decryption cache is reduced, authentication logs are truncated earlier, and background processing is deferred.

**Concurrent access:** MF+SO supports a single-user model (one authenticated session at a time). If multiple authentication operations are requested simultaneously, they are queued and processed sequentially to prevent race conditions.

**Platform sleep/hibernate:** If the device enters sleep or hibernate mode during processing, MF+SO saves its processing state to encrypted temporary storage. When the device wakes, the processing continues from the saved state.

### 13. Verification of Processing Claims

Users can verify MF+SO's processing claims through multiple methods:

**Source code review:** The entire processing pipeline is implemented in open-source code. Users can trace the processing path for any operation to verify that data is not transmitted or stored in unexpected ways.

**Network monitoring:** Users can monitor the application's network connections using system tools (Firewall logs, Wireshark, tcpdump) to verify that no unexpected data transmissions occur during processing.

**Platform debugging tools:** Developers can use platform debugging tools (Android Studio Profiler, Xcode Instruments, Windows Performance Analyzer) to trace the application's processing and verify local execution.

**Third-party audit:** The processing claims are verified during third-party security audits. Audit reports confirm that processing occurs locally and that data is handled as documented.

**File system monitoring:** Users can monitor the application's file system access to verify that data is stored only in the expected locations and that no unexpected files are created.

### 14. Processing Performance

MF+SO's local processing is designed for performance:

| Operation | Typical Processing Time | Dependencies |
|-----------|------------------------|--------------|
| Password decryption | < 5 ms | Master key in cache |
| TOTP code generation | < 1 ms | Shared secret decryption |
| WebAuthn assertion | < 50 ms | Platform API, hardware key |
| Biometric authentication | < 500 ms | Platform biometric API |
| Credential import (100 entries) | < 1 second | Parsing, encryption |
| Local backup (100 entries) | < 2 seconds | Encryption, file I/O |
| Full database search | < 10 ms | SQLite indexing |
| Application startup | < 2 seconds | Database initialization |

These processing times are typical for modern devices. Performance may vary on older hardware or devices under load. Processing times are not affected by network conditions since all processing is local.

### 15. Processing for Multiple Credential Vaults

MF+SO supports organizing credentials into vaults for different contexts (personal, work, shared family accounts). Each vault has its own encryption context:

- **Personal vault:** Encrypted with the user's master key derived from their password or biometric
- **Work vault:** Can be encrypted with a separate key managed by the organization
- **Shared vault:** Can be encrypted with a shared key distributed among vault members

When processing credentials from different vaults, MF+SO ensures cryptographic isolation:
- Operations in one vault cannot access data from another vault
- Vault switching requires re-authentication if the vaults use different keys
- Vault metadata (names, icons, colors) is not encrypted but contains no sensitive information

### 16. Processing for Biometric Authentication Continuity

Biometric authentication involves processing by both MF+SO and the platform:

1. MF+SO requests biometric authentication from the platform API
2. The platform activates the biometric sensor (fingerprint scanner, face camera, iris scanner)
3. The sensor captures the biometric sample
4. The platform's secure enclave or TEE processes the sample
5. The sample is compared against the enrolled biometric template stored in the secure enclave
6. The platform returns a Boolean result to MF+SO: authenticated or not authenticated
7. If authentication fails, the platform may return additional information: "too many attempts," "biometric not recognized," "sensor error"
8. MF+SO handles the response: on success, derive the master key; on failure, increment the failure counter and optionally lock the application

The biometric sample is never accessible to MF+SO. The platform APIs are designed to prevent application-level code from accessing biometric data directly.

### 17. Processing for Application Locking

When MF+SO locks the application (after timeout, manual lock, or too many failed attempts):

1. All decrypted credentials are zeroed from memory
2. The master encryption key is discarded from memory
3. The application returns to the authentication screen
4. Any in-progress operations are terminated
5. The local database file handle is closed and reopened (for platforms that support this)
6. A lock event is logged locally

To unlock, the user must re-authenticate (biometric, PIN, or master password). The master key is re-derived from the authentication and used to access the encrypted database.

### 18. Processing for Multiple Devices

MF+SO does not provide built-in cloud sync, but processing for manual credential transfer works as follows:

**Export on source device:**
1. User authenticates and navigates to Settings → Data → Export
2. User selects credentials to transfer
3. User sets a transfer passphrase
4. Credentials are encrypted with a key derived from the transfer passphrase
5. The encrypted transfer file is saved to the device

**Import on target device:**
1. User transfers the encrypted file to the target device (USB, local network, cloud storage)
2. User opens MF+SO on the target device
3. User navigates to Settings → Data → Import
4. User selects the transfer file
5. User enters the transfer passphrase
6. Credentials are decrypted and re-encrypted with the target device's master key
7. The transfer file is not modified during import

Throughout this process, the transfer passphrase is never transmitted over any network. The encrypted transfer file can be safely transferred over any channel because it is encrypted with a key known only to the user.

### 19. Processing and Regulatory Compliance

MF+SO's processing model supports compliance with key regulatory requirements:

**GDPR Article 5 (Data Minimization):** Processing is limited to what is necessary. Credentials are processed locally, not on servers.
**GDPR Article 25 (Privacy by Design):** Local processing is a privacy-by-design feature, not an afterthought.
**GDPR Article 32 (Security of Processing):** Local processing eliminates many attack vectors present in cloud-based processing.
**CCPA (Data Sale Opt-Out):** No processing for data sale purposes occurs.
**HIPAA (if used in healthcare):** Protected health information is never transmitted. All processing is local.
**PCI DSS (if used for payment credentials):** No cardholder data is transmitted. Local processing reduces PCI scope.

### 20. Processing for Future Features

MF+SO is designed to maintain its local-first processing model for planned future features:

**Peer-to-peer credential sharing (planned):** Credentials shared between users will use end-to-end encryption. The credentials will be encrypted on the sender's device and decrypted on the receiver's device. The MF+SO infrastructure will handle only encrypted payloads that cannot be decrypted.

**Biometric federation (planned):** Support for using one device's biometric sensor to authenticate to another device will use encrypted communication channels. The biometric processing remains on the originating device.

**Hardware security key pass-through (planned):** Support for using hardware security keys connected to one device through another device will use encrypted tunnels. The hardware key's cryptographic operations remain on the connected device.

All future features will maintain the principle that sensitive processing occurs on the user's device, not on MF+SO infrastructure.
### 21. Processing for Credential Health Checks

MF+SO includes credential health check features that process credentials locally:

**Password strength evaluation:**
- The password is evaluated against zxcvbn (an open-source password strength estimator)
- The evaluation uses the plaintext password temporarily in memory
- The password is not transmitted to any service for evaluation
- The evaluation result (strength score) is stored, not the password
- Common passwords, patterns, and compromised password databases are checked against a local database that does not require network access

**Duplicate credential detection:**
- MF+SO checks if the same password is used for multiple services
- This check is performed locally against the encrypted database
- The comparison result (duplicate found or not) is displayed to the user
- The actual password values are not compared directly; only salted hashes are compared

**Credential age tracking:**
- MF+SO tracks when each credential was last updated
- Credentials that have not been updated in a configurable period are flagged
- The age check is performed locally using stored timestamps

### 22. Processing for Accessibility

MF+SO's processing includes accessibility features:

**Screen reader support:**
- All user interface elements are labeled for screen reader compatibility
- Authentication prompts include audio cues
- Error messages include descriptive text for screen readers

**Keyboard navigation:**
- All authentication flows can be completed using keyboard only
- Tab order follows a logical sequence
- Keyboard shortcuts are available for common operations

**Visual accessibility:**
- High-contrast mode adjusts color schemes for visibility
- Font size can be adjusted independently of system settings
- Animations can be reduced or disabled
### 23. Processing Verification Checklist

Users and auditors can verify MF+SO's processing claims using this checklist:

- [ ] All data stays local: verify no unexpected network connections during use
- [ ] Encrypted at rest: verify database file is encrypted (check file header)
- [ ] Encrypted in transit: verify TLS connections (where applicable)
- [ ] Ephemeral processing: verify credentials are not written to disk in plaintext
- [ ] Secure deletion: verify deleted credentials cannot be recovered
- [ ] Platform isolation: verify biometric data is not accessible to MF+SO
- [ ] No cloud storage: verify no data is stored on external servers (except opt-in telemetry)
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
