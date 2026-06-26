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

# Cookie Policy

## No Cookies in the PWA, Local Storage Only, No Third-Party Tracking

### 1. Introduction

This Cookie Policy explains how MF+SO uses cookies and similar technologies. Because MF+SO is primarily a native desktop and mobile application, and its web interface (the Progressive Web App, or PWA) is designed with privacy as a core requirement, the use of cookies is extremely limited.

The short version: **MF+SO does not use any cookies for tracking, advertising, analytics, or any purpose that could compromise user privacy.** The PWA uses only strictly necessary local storage mechanisms for application functionality, and no third-party cookies or tracking technologies are employed.

### 2. What Are Cookies?

Cookies are small text files stored on a user's device by a web browser when visiting a website. They are used for various purposes:

- **Essential/Strictly necessary cookies:** Required for the website to function (session management, security tokens)
- **Functionality cookies:** Remember user preferences and settings
- **Analytics cookies:** Track how users interact with the website
- **Advertising/tracking cookies:** Build user profiles for targeted advertising
- **Third-party cookies:** Set by domains other than the one the user is visiting

MF+SO does not use any cookies in the last four categories. The only storage mechanisms used are strictly necessary for the PWA to function.

### 3. Cookies in the MF+SO PWA

The MF+SO Progressive Web App is accessible at `https://app.mfso.io`. When you use the PWA:

**MF+SO's PWA does not set any HTTP cookies.**

The PWA functions without cookies by using alternative mechanisms:
- **Session management:** Handled through the WebAuthn API and local authentication, not through cookies
- **State management:** Managed client-side through the application state
- **Authentication:** Performed through cryptographic protocols that do not require session cookies

### 4. Local Storage

Instead of cookies, the MF+SO PWA uses the browser's Local Storage API for limited, strictly necessary data:

| Storage Key | Purpose | Data Stored | Duration |
|-------------|---------|-------------|----------|
| mfso.preferences | UI preferences | Theme selection, language | Until cleared |
| mfso.session | Session state (encrypted) | Temporary session token | Until tab closes |
| mfso.auth_cache | Auth cache | Cached auth status (no credentials) | 5 minutes |

**What local storage does NOT contain:**
- No credentials (passwords, passkeys, TOTP secrets)
- No encryption keys
- No personal information
- No tracking identifiers
- No advertising data
- No browsing history

All local storage is scoped to the `https://app.mfso.io` origin and is not accessible to any other website or application.

### 5. Service Worker Cache

As a PWA, MF+SO uses a service worker for offline functionality, caching:
- Application code (HTML, CSS, JavaScript)
- Static assets (icons, fonts)
- Application configuration

No user data, credentials, or personal information is cached. The cache is automatically updated when new versions are deployed.

### 6. No Third-Party Cookies

MF+SO explicitly does not use third-party cookies:

- **No advertising cookies:** MF+SO does not serve or permit any advertising
- **No social media cookies:** No social media sharing widgets, "like" buttons, or embedded content that sets cookies
- **No analytics cookies:** Plausible Analytics (self-hosted) is cookie-less by design
- **No tracking pixels:** No web beacons, tracking pixels, or invisible tracking
- **No third-party scripts:** No third-party JavaScript that could set cookies

### 7. Cookies in Native Applications

Native MF+SO applications (Windows, macOS, Linux, Android, iOS) do not use HTTP cookies at all. User preferences and application state are stored using platform-specific local storage:
- Windows: `%APPDATA%\MF+SO`
- macOS: `~/Library/Application Support/MF+SO`
- Linux: `~/.local/share/mfso`
- Android: Application internal storage
- iOS: Application sandboxed storage

These are not cookies and are not accessible to any other application.

### 8. Cookie-Like Technologies

| Technology | Used? | Purpose |
|------------|-------|---------|
| HTTP cookies | No | N/A |
| Local Storage | Yes (PWA only) | Application state |
| Session Storage | Yes (PWA only) | Temporary session |
| IndexedDB | Yes (PWA only) | Offline data cache |
| Web SQL | No | N/A |
| Flash cookies | No | N/A |
| ETag tracking | No | N/A |
| Browser fingerprinting | No | N/A |
| Canvas fingerprinting | No | N/A |
| Web beacon / tracking pixel | No | N/A |
| First-party analytics | Yes (with consent) | Cookie-less Plausible |
| Third-party analytics | No | N/A |

### 9. Cookie Consent

Because MF+SO does not use any non-essential cookies, there is no cookie consent banner on the MF+SO website or PWA. This is consistent with the ePrivacy Directive and GDPR, which require consent only for non-essential cookies.

The PWA displays a privacy notice on first visit informing users that no cookies are used for tracking, local storage is only for functionality, and no personal data is collected without explicit consent.

### 10. Third-Party Websites

The MF+SO website may contain links to third-party websites (GitHub, community forum). These have their own cookie policies. MF+SO does not embed third-party content that sets cookies (no YouTube embeds, no Twitter/X feeds, no Facebook content, no advertising, no third-party analytics scripts).

### 11. Cookie Security

For limited local storage in the PWA:
- **Encryption:** Sensitive data encrypted before storage
- **Scoping:** All data scoped to the MF+SO origin
- **Access control:** No other website or script can access MF+SO's local storage
- **Clear data:** Users can clear stored data through browser settings or app interface (Settings → Advanced → Clear Local Data)

### 12. Managing Local Storage

**Browser settings:** Developer tools → Application → Local Storage → Select `https://app.mfso.io` → Clear items

**Application interface (PWA):** Settings → Advanced → Clear Local Data

**Application interface (Native):** Settings → Advanced → Reset Application State

Clearing local storage resets preferences but does not affect stored credentials (stored separately in encrypted database).

### 13. Do Not Track and Global Privacy Control

MF+SO respects the Do Not Track (DNT) browser setting and Global Privacy Control (GPC) signal:
- When DNT or GPC is enabled, no analytics data is collected regardless of consent setting
- No tracking of any kind is performed
- The application operates in fully local mode
- Signals are honored automatically without requiring additional user action

### 14. Comparison with Common Practices

| Practice | Industry Common | MF+SO |
|----------|-----------------|-------|
| Analytics cookies | Most websites | Not used (cookie-less analytics) |
| Advertising cookies | Ad-supported sites | Not used |
| Social media cookies | Sites with social features | Not used |
| Tracking pixels | Marketing teams | Not used |
| Third-party analytics | Google Analytics, etc. | Not used (self-hosted, cookie-less) |
| Session cookies | Most web apps | Not used (stateless auth) |
| Preference cookies | Many websites | Not used (local storage instead) |
| Cross-site tracking | Ad networks | Not used |

### 15. Cookie Policy Updates

This Cookie Policy may be updated to reflect changes in technology, legal requirements, or MF+SO's practices. Given the commitment to not using cookies for tracking or advertising, material changes are expected to be rare. Any change introducing new cookie usage will be clearly documented, justified, and communicated with advance notice.

### 16. Conclusion

MF+SO's approach to cookies is simple: they are not used for any purpose that could compromise user privacy. The PWA uses only strictly necessary local storage mechanisms, no HTTP cookies are set, no third-party cookies are employed, and no tracking technologies of any kind are used. This approach demonstrates that a fully functional web application can be built without compromising on privacy.

### 16. Technical Implementation Details of Local Storage

The Local Storage API used by MF+SO's PWA has specific technical characteristics:

**Storage limits:**
- Local Storage is limited to approximately 5-10 MB per origin, depending on the browser
- MF+SO uses less than 100 KB of Local Storage under normal conditions
- For larger data (cached application code), IndexedDB is used with a limit of 50+ MB

**Data persistence:**
- Local Storage data persists until explicitly cleared by the user or application
- Data survives browser restarts, system restarts, and PWA updates
- Data is cleared when the user clears browser data for the origin

**Security:**
- Local Storage is sandboxed by origin — mfso.io data cannot be accessed by any other website
- Data is encrypted in the application layer before storage (AES-256-GCM)
- The encryption key is derived from user authentication and is not stored in Local Storage

**Performance:**
- Local Storage operations are synchronous and fast (typically < 1 ms)
- Read operations are cached in memory after the first access
- Write operations are batched to minimize storage I/O

### 17. Service Worker Implementation Details

The MF+SO PWA service worker implements the following caching strategies:

**Application shell (HTML, CSS, JavaScript):**
- Strategy: Cache-first, network fallback
- The application shell is served from the service worker cache for instant loading
- Updates are fetched in the background and applied on the next visit
- Cached version is verified against the server version on each launch

**Static assets (icons, fonts, images):**
- Strategy: Cache-first, network fallback
- Assets are cached during the initial visit and served from cache thereafter
- Cache is updated when assets change (versioned URLs)
- Assets are pre-cached for offline use

**API responses (configuration, update check):**
- Strategy: Network-first, cache fallback (for non-sensitive data)
- The latest data is fetched from the network when available
- Cached data is used when offline
- Authentication-related responses are never cached

**What is NOT cached:**
- Credentials or authentication data
- User preferences (stored in Local Storage)
- TOTP codes or other temporary authentication values
- Any data that could identify the user

### 18. Cookie Policy for Third-Party Integrations

While MF+SO itself does not use cookies, third-party integrations that users may enable could involve cookies:

**Integration with browser extensions:**
- The MF+SO companion browser extension uses local storage for the same purposes as the PWA
- The extension does not inject cookies into any web pages
- The extension communicates with the MF+SO native application through local WebSocket (no cookies involved)

**Integration with WebAuthn platform APIs:**
- WebAuthn API calls do not involve cookies
- The authentication is challenge-response based, not session-cookie based
- Platform authenticators (TPM, Secure Enclave) do not use cookies

**Integration with hardware security keys:**
- Hardware keys (YubiKey, SoloKey, etc.) communicate through CTAP2 protocol
- CTAP2 does not use cookies
- Hardware keys store credentials internally, not in cookies

**Integration with recovery email:**
- If the user provides a recovery email address, MF+SO stores it locally
- Recovery emails are sent through a transactional email service
- The email service may use tracking pixels or cookies in recovery emails
- Users are advised to disable remote images in their email client to prevent tracking

### 19. Regulatory Compliance for Cookies

MF+SO's cookie-less approach simplifies compliance with cookie regulations:

**ePrivacy Directive (EU Cookie Law):**
- No cookie consent banner is required because MF+SO does not use non-essential cookies
- The privacy notice on first visit satisfies the transparency requirement

**GDPR:**
- No cookie-related consent is required
- Local Storage usage is covered by the privacy policy, which is accepted by the user
- The "legitimate interest" basis applies to the necessary local storage

**CCPA:**
- No cookie-related opt-out is required
- The "Do Not Sell My Personal Information" link does not apply to cookie data
- No cookie-related disclosures are required beyond the general privacy policy

**LGPD (Brazil):**
- Cookie consent is not required for strictly necessary local storage
- The privacy notice satisfies transparency requirements

**PIPEDA (Canada):**
- Implicit consent applies to necessary local storage
- The privacy notice satisfies the meaningful consent requirement

### 20. Cookie Security Best Practices for Users

While MF+SO does not use cookies, users should follow general cookie security best practices for all web browsing:

- Use browser privacy settings to block third-party cookies (most modern browsers block them by default)
- Clear cookies regularly, especially for sensitive sites (banking, email, government services)
- Use container tabs or separate browser profiles for different contexts (personal, work, shopping)
- Enable "Do Not Track" or "Global Privacy Control" in browser settings
- Consider using browser extensions that enhance cookie controls (Privacy Badger, uBlock Origin)
- Use private/incognito browsing for sessions where you do not want persistent cookies
- Review and manage cookies periodically through browser settings

MF+SO's cookie-less design means that users who follow these practices will have no conflict with the MF+SO PWA. The PWA functions regardless of cookie settings, privacy extensions, and tracking protection features.

### 21. Future of Cookie Policy

As web technologies evolve, MF+SO may adapt its cookie policy:

**Potential changes requiring policy updates:**
- If the PWA requires new storage mechanisms for future features
- If browser APIs change and require different storage approaches
- If regulatory requirements for cookie-less storage change
- If the project decides to offer a web-based version with different architecture

**Principles that will not change:**
- No tracking through cookies or similar technologies
- No third-party cookies or third-party tracking
- No advertising or advertising-related technologies
- Minimal data storage, with encryption when sensitive data is stored
- Full transparency about all storage mechanisms used
### 22. Cookie Policy for Future Web Features

As MF+SO's web presence evolves, new features will be evaluated for cookie usage:

- New features will use cookie-less approaches wherever possible
- If cookies are technically necessary for a feature, the feature will use first-party cookies only
- Any cookie usage will be documented in this policy before implementation
- Users will be notified of any new cookie usage
- No advertising, tracking, or analytics cookies will be introduced

### 23. Conclusion

MF+SO's cookie policy reflects the project's commitment to privacy by default. By avoiding cookies entirely in its PWA and using only strictly necessary local storage, MF+SO demonstrates that a fully functional web application can be built without the tracking and profiling that has become endemic on the modern web.
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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ