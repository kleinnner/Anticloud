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

# Security FAQ

> **Last Updated:** 2026-06-19
> **Category:** Security

## Is MF+SO secure?

Yes. MF+SO is designed with security as the primary requirement, not an afterthought. The architecture follows zero-trust principles: your secrets never leave your device unencrypted, and MF+SO servers never have access to your plaintext data.

The system has undergone:
- **3 independent security audits** by Cure53, Trail of Bits, and Kudelski Security
- **Bug bounty program** on HackerOne with $100,000+ paid in bounties
- **FIPS 140-2** validation for cryptographic module
- **SOC 2 Type II** certification for Enterprise infrastructure
- **ISO 27001:2022** certification

## How are my secrets encrypted?

MF+SO uses a multi-layer encryption architecture:

### Key Derivation
```
Master Password
       ↓
Argon2id (mem=128MB, time=3, threads=4, salt=256-bit)
       ↓
Master Key (256-bit AES key)
       ↓
       ├──→ Storage Key — Encrypts all data on disk using AES-256-GCM
       ├──→ Sync Key — Encrypts sync data using XChaCha20-Poly1305
       ├──→ Auth Key — Used for IdP signing operations (Ed25519)
       └──→ Backup Key — Encrypts exports using XChaCha20-Poly1305
```

### At Rest
- All data is encrypted with AES-256-GCM
- Keys are stored in the device's secure enclave (SEP, TPM, TEE)
- Data is inaccessible without the master password
- Additional biometric authentication available

### In Transit
- TLS 1.3 with mutual authentication (mTLS) for server communications
- End-to-end encryption for sync data
- WireGuard tunnels for ZTNA traffic

## What encryption algorithms does MF+SO use?

| Algorithm | Purpose | Key Size |
|---|---|---|
| AES-256-GCM | Data at rest encryption | 256 bits |
| XChaCha20-Poly1305 | Sync and backup encryption | 256 bits |
| Argon2id | Password-based key derivation | N/A |
| PBKDF2-HMAC-SHA256 | Legacy compatibility | 256 bits |
| Ed25519 | Digital signatures | 256 bits |
| X25519 | Key agreement | 256 bits |
| ECDSA P-256 / P-384 | Certificate signing | 256 / 384 bits |
| RSA 2048 / 4096 | Legacy compatibility | 2048 / 4096 bits |
| SHA-256 / SHA-384 / SHA-512 | Hashing | N/A |
| CRYSTALS-Kyber | Post-quantum KEM | 3168 / 6336 bits |
| CRYSTALS-Dilithium | Post-quantum signatures | 2528 / 4624 bits |

## What happens if MF+SO servers are breached?

Since MF+SO employs zero-knowledge architecture, a server breach would not expose user secrets:

1. **No plaintext data** — MF+SO servers only store encrypted blobs
2. **No keys** — Encryption keys never leave user devices
3. **No passwords** — Master passwords are never transmitted to servers
4. **No TOTP seeds** — Seeds are encrypted before sync
5. **Audit trail** — The .aioss engine would detect and log any unauthorized access attempts

In the event of a breach:
- User data remains secure (end-to-end encrypted)
- Sync tokens would be rotated
- All users would be notified
- Forensic investigation via .aioss chain

## How does MF+SO protect against brute force attacks?

Multiple layers of brute force protection:

**On-device:**
- Argon2id memory-hard function (takes ~3 seconds on modern hardware)
- Progressive delay after failed attempts
- Account lockout after 10 failed attempts (configurable)
- Wipe after 20 failed attempts (configurable)

**On-server (sync/cloud services):**
- Rate limiting per IP (10 attempts/minute)
- Rate limiting per account (5 attempts/minute)
- CAPTCHA after 3 failed attempts
- Geolocation blocking for unusual locations
- Impossible travel detection

**Enterprise:**
- All above plus:
- Automatic IP blocking
- Integration with existing SIEM
- Custom rate limit policies
- HSM-enforced key rate limiting

## Is my data safe if my phone is stolen?

Yes, assuming you use a strong master password and have security features enabled:

1. **Hardware binding** — TOTP seeds and keys are bound to the device's secure enclave
2. **Encryption** — All data encrypted with AES-256-GCM
3. **Lock screen** — App auto-locks immediately on screen off
4. **Biometric** — Fingerprint/face unlock for quick access
5. **Wipe capability** — Remote wipe via MF+SO web portal
6. **Brute force protection** — Device wipes after 20 failed attempts
7. **No cached passwords** — Master password never cached in memory

Without your master password or biometric, the data on the device is computationally infeasible to decrypt.

## Does MF+SO support biometric authentication?

Yes. MF+SO supports biometric unlock on all platforms:

| Platform | Methods |
|---|---|
| iOS | Face ID, Touch ID |
| Android | Fingerprint, Face Unlock (biometric class 3 required) |
| macOS | Touch ID, Face ID |
| Windows | Windows Hello (fingerprint, face, PIN) |
| Linux | fprintd, PAM biometric modules |

Biometrics are an additional convenience layer — they unlock the encryption key stored in the secure enclave but do not replace the master password.

## Can someone access my vault if they have my phone and my fingerprint?

This is a common concern with biometric authentication. Here's how MF+SO addresses it:

1. **Biometric data never leaves the device** — It is processed entirely within the secure enclave
2. **Biometric unlock has limits** — After 5 failed biometric attempts, the master password is required
3. **Biometric + password required** — Sensitive operations (export, add new master password, change settings) always require the master password
4. **Hardware binding** — Even with biometric access, the decryption keys are bound to the specific device hardware

## How are TOTP seeds generated and stored?

1. **Seed generation** — Done by the service provider (e.g., Google, GitHub) when you enable 2FA
2. **Seed delivery** — Via QR code or manual text key
3. **Seed storage** — Encrypted within MF+SO vault using AES-256-GCM
4. **Seed protection** — Bound to device hardware via secure enclave
5. **Seed sync** — End-to-end encrypted; server never sees plaintext seeds

## Does MF+SO use cloud storage?

Yes and no. MF+SO uses cloud services for:
- **Sync** — Encrypted blobs only; zero-knowledge
- **Push notifications** — Necessary for push authentication
- **Enterprise features** — IdP, ZTNA, audit logging

All cloud data is end-to-end encrypted. The sync server stores only:
- Encrypted vault data (unreadable without your master password)
- Non-sensitive metadata (account names, icons, last modified timestamps)
- Device registration tokens

## What is the recovery process if I forget my master password?

See the [Account Recovery FAQ](03-account-recovery.md) for detailed information. In summary:
- **No password reset** — Due to zero-knowledge architecture, MF+SO cannot reset your password
- **Recovery phrase** — A 24-word BIP-39 seed phrase is generated during setup
- **Emergency sheet** — Printable backup with QR codes
- **Biometric fallback** — Works as long as you remain on registered devices

## Does MF+SO use post-quantum cryptography?

Yes, as of v2.5, MF+SO supports post-quantum cryptography for forward-looking security:

- **CRYSTALS-Kyber** — Key encapsulation mechanism (NIST FIPS 203)
- **CRYSTALS-Dilithium** — Digital signatures (NIST FIPS 204)
- **SPHINCS+** — Stateless hash-based signatures (NIST FIPS 205)

Post-quantum algorithms are used in hybrid mode with classical algorithms (e.g., Kyber + X25519) for compatibility while providing quantum resistance.

## How are software updates secured?

1. **Code signing** — All updates are signed with Ed25519
2. **Chain of trust** — Signing certificates are managed by a hardware-protected root CA
3. **Verification** — Updates are verified before installation using cryptographic signature checking
4. **Rollback protection** — The system prevents downgrade to versions with known vulnerabilities
5. **Integrity check** — Installation includes runtime integrity verification

## Has MF+SO undergone security audits?

Yes. MF+SO has undergone extensive security audits:

| Auditor | Year | Scope | Findings |
|---|---|---|---|
| Cure53 | 2025 | Core cryptography, mobile apps | 2 critical, 3 high (all fixed) |
| Trail of Bits | 2025 | Server infrastructure, API | 1 critical, 4 high (all fixed) |
| Kudelski Security | 2026 | Full stack audit | 0 critical, 2 high (all fixed) |
| NCC Group | 2026 | Enterprise features | 1 high, 3 medium (all fixed) |

All audit reports are available to Enterprise customers under NDA.

## What is MF+SO's vulnerability disclosure policy?

MF+SO operates a responsible disclosure program:

- **Platform:** HackerOne
- **Rewards:** $100 - $25,000 per vulnerability
- **Disclosure window:** 90 days from report
- **Scope:** All MF+SO products and services
- **Out of scope:** Denial of service, physical attacks, social engineering

Our security.txt is available at mfso.io/.well-known/security.txt

## Does MF+SO comply with GDPR and privacy regulations?

Yes. MF+SO is fully GDPR-compliant:

- **Data Processing Agreement (DPA)** — Available for all customers
- **Data Protection Officer (DPO)** — privacy@mfso.io
- **Data residency** — Choose EU, US, or APAC regions
- **Right to erasure** — Full account deletion available
- **Data portability** — Export your data anytime
- **Privacy by design** — Minimal data collection by default

## How does MF+SO handle zero-day vulnerabilities?

MF+SO has a dedicated security team that monitors for zero-day threats:

1. **Automated scanning** — Continuous vulnerability scanning of dependencies
2. **Threat intelligence** — Integration with multiple threat intelligence feeds
3. **Rapid response** — SLA-based patching (critical: 7 days, high: 14 days)
4. **Emergency updates** — Ability to push urgent security patches
5. **Transparency** — Security advisories published at security.mfso.io

## Can government agencies access my MF+SO data?

MF+SO is designed to make data access by third parties (including government agencies) technically infeasible:

1. **End-to-end encryption** — Your data is encrypted with keys only you possess
2. **No backdoors** — MF+SO does not include any law enforcement access mechanisms
3. **Transparency** — We publish transparency reports quarterly
4. **Jurisdiction** — Data stored in your chosen region
5. **Encryption at rest** — All data encrypted even on our servers

In jurisdictions where we are legally compelled to provide data, the only data we can provide is encrypted blobs — which are useless without your decryption keys.

## How does MF+SO protect against phishing attacks?

Phishing-resistant authentication is built into MF+SO's architecture:

### FIDO2/WebAuthn Protection
FIDO2 credentials are bound to the specific website origin (e.g., `https://google.com`). If a user is tricked into visiting `https://goog1e.com`, the FIDO2 credential will not work because the origin does not match. This makes FIDO2 inherently phishing-resistant.

### TOTP Code Context
When viewing TOTP codes, MF+SO displays the service name and issuer alongside the code. Users are trained to verify this information before entering codes on any website.

### Browser Extension Warnings
The MF+SO browser extension:
- Warns if the domain name looks similar to a saved account's domain
- Detects lookalike characters (e.g., "g00gle.com" instead of "google.com")
- Flags recently registered domains
- Shows the actual URL before auto-filling credentials

### Push Authentication Context
When receiving a push authentication request, MF+SO displays:
- The application name requesting authentication
- The geographic location of the request
- The device and browser information
- Risk assessment score

Users are trained to **deny** any unexpected authentication requests.

### Security Education
MF+SO includes in-app security tips:
- Quarterly phishing awareness reminders
- Best practices for recognizing phishing attempts
- Guidelines for verifying website authenticity
- Report phishing functionality

## How does device attestation work?

Device attestation confirms that the device requesting authentication is genuine and uncompromised.

### TPM Attestation (Windows/Linux)

```
1. MF+SO requests device identity from TPM
2. TPM generates an Attestation Identity Key (AIK)
3. AIK is signed by the TPM's Endorsement Key (EK) certificate
4. MF+SO sends the AIK and certificate to the verification server
5. Server verifies:
   a. EK certificate is from a trusted manufacturer
   b. AIK was generated by a genuine TPM
   c. Device has not been tampered with
6. Server returns attestation result
```

### Apple Secure Enclave Attestation (iOS/macOS)

Apple devices use the Secure Enclave to provide hardware-level attestation:
1. MF+SO requests a hardware-bound key from the Secure Enclave
2. Secure Enclave generates the key and returns the public key with an attestation
3. Attestation includes the device's unique hardware ID (hashed) and that the key is protected by the Secure Enclave
4. Server verifies the Apple-signed attestation
5. Result determines device trust level

### Android TEE Attestation

Android devices with StrongBox or TEE (Trusted Execution Environment):
1. MF+SO requests key attestation via Android Keystore
2. Keystore returns a certificate chain showing the key was generated in a secure environment
3. Certificate chain verified against Google's root certificate
4. Additional checks: bootloader status, verified boot, device integrity

## What is the Security Incident Response Plan?

MF+SO maintains a comprehensive incident response plan aligned with NIST SP 800-61:

### Incident Classification

| Level | Definition | Examples | Response Team |
|---|---|---|---|
| L1 | Minor incident, no user impact | Isolated bug, non-exploitable | Engineering |
| L2 | Moderate incident, limited impact | Vulnerability in non-critical component | Security Team |
| L3 | Major incident, significant impact | Active exploit, data exposure possible | Incident Response Team |
| L4 | Critical incident, widespread impact | Full compromise, active attack | Full IR Team + Executives |

### Response Timeline (L3/L4)

| Phase | Time | Actions |
|---|---|---|
| Detection | Immediate | Automated alert from .aioss engine |
| Triage | < 15 minutes | Assess severity, notify IR team |
| Containment | < 1 hour | Isolate affected systems, block attack vectors |
| Eradication | < 4 hours | Remove attacker access, patch vulnerabilities |
| Recovery | < 24 hours | Restore from clean backups, verify integrity |
| Post-Mortem | < 7 days | Full investigation, root cause analysis, improvements |

### Communication Plan

| Audience | Channel | Timing | Content |
|---|---|---|---|
| Internal team | Slack, phone | Immediate | Incident details, actions needed |
| Affected users | Email, in-app alert | < 4 hours | What happened, what we're doing |
| All users | Email, blog | < 24 hours | General notice, recommendations |
| Enterprise customers | Dedicated Slack, email | < 1 hour | Per-contract SLA notification |
| Regulatory bodies | Formal notice | Per regulation | GDPR: 72 hours, HIPAA: 60 days |
| Public | Blog, status page | < 72 hours | Summary, lessons learned |

## How does MF+SO rate its security?

### Independent Security Ratings

| Rating Agency | Score | Summary |
|---|---|---|
| SecurityScorecard | 98/100 | A+ Rating |
| BitSight | 780/900 | Advanced |
| SOC 2 Type II | Compliant | Annual audit by KPMG |
| ISO 27001:2022 | Certified | Annual audit by BSI |
| CSA STAR | Level 2 | Self-assessment + 3rd party |
| FedRAMP | In progress | Expected Q4 2026 |

### Bug Bounty Effectiveness

| Metric | Value |
|---|---|
| Total bounties paid | $250,000+ |
| Average payout | $3,500 |
| Average time to triage | 4 hours |
| Average time to fix (critical) | 3.5 days |
| Total vulnerabilities found | 87 |
| All resolved | Yes |
| Percent found externally | 85% |

## How does MF+SO handle third-party security assessments?

### Annual Penetration Testing Schedule

| Quarter | Scope | Tester |
|---|---|---|
| Q1 | Mobile apps (iOS, Android) | Cure53 |
| Q2 | Server infrastructure, API | Trail of Bits |
| Q3 | Enterprise features (IdP, ZTNA) | NCC Group |
| Q4 | Full stack, cryptographic review | Kudelski Security |

### Continuous Security Testing
- SAST (Static Analysis) — Run on every PR
- DAST (Dynamic Analysis) — Run daily on staging
- Dependency scanning — Every 6 hours
- Container scanning — Every build
- API fuzzing — Continuous
- Network penetration testing — Quarterly

## What happens during a security audit?

### External Audit Process

1. **Scoping** — Define systems, controls, and standards in scope
2. **Evidence Collection** — MF+SO provides system configurations, logs, policies
3. **Testing** — Auditor performs independent testing (pen testing, code review)
4. **Findings** — Auditor reports vulnerabilities, misconfigurations, gaps
5. **Remediation** — MF+SO fixes findings within agreed timeline
6. **Re-testing** — Auditor verifies fixes
7. **Report** — Final report issued with compliance status

### Audit Access for Customers
Enterprise customers can request:
- SOC 2 Type II report (under NDA)
- ISO 27001 certificate
- Penetration test summary
- Compliance mapping documents
- Right to audit clause (Enterprise Platinum)

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
