▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document version: 1.0.0 | Updated: 2026-06-19
Category: governance | ID: LIB-GOV-005

────────────────────────────────────────────────────────────────

# Security Disclosures

## 1. Overview

The Libern project takes security seriously. We are committed to
responsibly disclosing vulnerabilities and ensuring that our users can
safely use Libern in their environments. This document outlines our
policies for reporting, investigating, and disclosing security
vulnerabilities in Libern.

## 2. Reporting Vulnerabilities

### 2.1 How to Report

If you believe you have found a security vulnerability in Libern, please
report it to us immediately.

**Primary reporting channel:**
- Email: security@libern.ai
- PGP key available at: https://libern.ai/security-pgp.asc

**Alternative reporting channels:**
- GitHub Security Advisory (private): https://github.com/libern/libern/security/advisories
- Direct message to a Core Team member (Signal, Matrix) — verify identity first

**Do NOT report security vulnerabilities through public channels:**
- Do not file a public GitHub issue
- Do not post in public chat channels
- Do not discuss on social media

### 2.2 What to Include

Please include as much of the following information as possible:

**Required:**
- Description of the vulnerability
- Steps to reproduce
- Affected versions
- Impact assessment

**Helpful:**
- Proof of concept (if available, in an encrypted format)
- Suggested fix (if known)
- Your contact information for follow-up questions

### 2.3 PGP Encryption

For sensitive vulnerability information, please encrypt your report using
the Libern security team's PGP key:

```
Key ID: 0x...
Fingerprint: ...
```

The key is available at https://libern.ai/security-pgp.asc and on public
key servers.

## 3. Disclosure Policy

### 3.1 Our Commitment

When we receive a security report, we commit to:

1. **Acknowledge receipt** within 48 hours
2. **Assess severity** within 5 business days
3. **Develop and test a fix** based on severity
4. **Release the fix** according to our timeline
5. **Publish a security advisory** after the fix is released

### 3.2 Disclosure Timeline

| Severity | Initial Assessment | Fix Development | Release Target |
|----------|-------------------|-----------------|----------------|
| Critical (CVSS 9.0+) | 24 hours | 3-5 days | 7 days |
| High (CVSS 7.0-8.9) | 48 hours | 7-14 days | 14 days |
| Medium (CVSS 4.0-6.9) | 5 business days | 14-30 days | Next release |
| Low (CVSS 0-3.9) | 10 business days | 30-60 days | Next release |

### 3.3 Coordinated Disclosure

We practice coordinated disclosure:
- We work with the reporter to agree on a disclosure timeline
- We give credit to the reporter (unless they prefer to remain anonymous)
- We publish the advisory simultaneously with the fix release

### 3.4 Embargo Period

We may request an embargo period for critical vulnerabilities to allow users
time to update before details are made public. The standard embargo is:
- 7 days for critical issues
- 14 days for high-severity issues
- 30 days for medium-severity issues

## 4. Vulnerability Handling Process

### 4.1 Triage

Upon receiving a report:
1. Log the report in the security tracking system
2. Assign a unique ID (LIBERN-SEC-YYYY-NNN)
3. Assess the severity using CVSS 4.0
4. Assign a handler from the security team
5. Set the disclosure timeline

### 4.2 Investigation

The security team:
1. Reproduces the vulnerability
2. Identifies the root cause
3. Determines the affected versions
4. Assesses the real-world impact
5. Develops a fix

### 4.3 Fix Development

The fix is developed:
- On a private branch
- With additional test coverage to prevent regression
- Reviewed by at least two security team members
- Tested against all supported versions

### 4.4 Release

The fix is released:
- As a patch release for the current version
- Backported to supported versions if needed
- With a security advisory

## 5. Security Advisory

### 5.1 Advisory Format

Security advisories are published on GitHub Security Advisories and include:

```
LIBERN-SEC-2026-001: Title of the Vulnerability
─────────────────────────────────────────────

Description:
A clear description of the vulnerability.

CVE: CVE-2026-XXXXX

Severity: Critical (CVSS 9.1)

Affected Versions:
- Libern < 1.2.1
- Libern 1.3.0-beta.1

Fixed Versions:
- Libern 1.2.1
- Libern 1.3.0-rc.1

Impact:
An attacker could exploit this vulnerability to...
Workaround:
If you cannot update immediately, ...

References:
- https://github.com/libern/libern/security/advisories/GHSA-xxxx-xxxx-xxxx
- https://nvd.nist.gov/vuln/detail/CVE-2026-XXXXX

Credit:
Reported by Name (optional organization)
```

### 5.2 CVE Assignment

We request CVE identifiers for all confirmed vulnerabilities:
- Critical and High severity: Always assigned
- Medium and Low severity: Assigned on a case-by-case basis

### 5.3 Advisory Distribution

Advisories are published on:
1. GitHub Security Advisories
2. Libern website (security page)
3. Mailing list (security-announce@libern.ai)
4. Community channels

## 6. Scope

### 6.1 In Scope

Security vulnerabilities in:
- The Libern binary (released versions)
- The Libern build system and CI/CD pipeline
- The Libern website and infrastructure
- Official Libern plugins and extensions
- The .aioss format specification and implementation

### 6.2 Out of Scope

The following are generally out of scope:
- Third-party dependencies (report to the dependency maintainer)
- Operating system vulnerabilities
- Hardware vulnerabilities
- Social engineering attacks against Libern users
- Physical security of user devices
- Self-DoS (attacks that only affect the attacker)
- Theoretical vulnerabilities without a practical exploit

### 6.3 Dependency Vulnerabilities

If a vulnerability is in a third-party dependency:
1. We will determine if Libern is affected
2. We will update the dependency to a fixed version
3. We will credit the original reporter if the dependency fix is included
   in our advisory

## 7. Bug Bounty Program

### 7.1 Current Status

Libern does not currently have a formal bug bounty program. Security
researchers who report valid vulnerabilities are recognized in our security
advisories and may receive:
- Public acknowledgment (with consent)
- A spot in our Hall of Fame
- Invitation to the security research group

### 7.2 Future Plans

We are exploring options for a bug bounty program. If you are interested
in contributing, please contact security@libern.ai to express interest.

## 8. Security Team

### 8.1 Team Structure

The Libern security team consists of:
- **Security Lead:** Oversees all security activities
- **Core Security Team:** 3-5 members handling triage and fixes
- **Extended Security Team:** Additional contributors who assist with
  specific areas (cryptography, networking, etc.)

### 8.2 Contact

| Role | Contact |
|------|---------|
| Security Team | security@libern.ai |
| Security Lead | security-lead@libern.ai |
| PGP Key | https://libern.ai/security-pgp.asc |

## 9. Best Practices for Users

### 9.1 Keeping Libern Updated

- Enable automatic update checks in Libern settings
- Subscribe to security announcements
- Update promptly when security releases are published
- Verify binary checksums before installation

### 9.2 Verifying Integrity

Always verify the integrity of Libern releases:
```bash
# Import the Libern signing key
gpg --recv-keys KEY_ID

# Verify the release signature
gpg --verify libern-v1.2.0.tar.gz.asc libern-v1.2.0.tar.gz

# Verify the checksum
sha256sum libern-v1.2.0.tar.gz
```

### 9.3 Reporting Suspicious Activity

If you suspect a security issue:
1. Report it immediately using the channels above
2. Do not share details publicly
3. Preserve any evidence (logs, screenshots)
4. If urgent, isolate affected systems

## 10. Security Research

### 10.1 Safe Harbor

Libern supports security research conducted in good faith. We will not
pursue legal action against researchers who:
- Follow responsible disclosure practices
- Do not destroy or corrupt user data
- Do not violate applicable laws
- Do not publicly disclose vulnerabilities before the embargo ends

### 10.2 Research Guidelines

If you are conducting security research on Libern:
- Use test accounts and test data
- Do not access or modify data you do not own
- Stop testing if you encounter user data
- Report findings promptly
- Allow reasonable time for fixes before disclosure

## 11. Automated Security Testing

### 11.1 Continuous Security

Libern incorporates security testing into the CI/CD pipeline:
- **Static analysis:** Rust Clippy, TypeScript ESLint security rules
- **Dependency scanning:** Dependabot, cargo-audit, npm audit
- **Fuzz testing:** Continuous fuzzing of cryptographic and parsing code
- **SAST:** Semgrep rules for common vulnerability patterns

### 11.2 Vulnerability Scanning

- All dependencies are scanned for known vulnerabilities
- Scanning runs on every PR and release
- Critical findings block releases

## 12. Security Researcher Recognition Program

### 12.1 Hall of Fame

Libern maintains a Security Researcher Hall of Fame to recognize individuals
who have reported valid security vulnerabilities. With the researcher's
permission, we publicly acknowledge their contribution.

To be eligible for recognition:
- Report a previously unknown vulnerability
- Follow responsible disclosure practices
- Provide sufficient detail for reproduction and fix

### 12.2 Levels of Recognition

| Level | Criteria | Recognition |
|-------|----------|-------------|
| Thanked | Any valid report | Mentioned in security advisory |
| Notable | Medium severity or higher | Listed in Hall of Fame |
| Distinguished | High severity or multiple reports | Hall of Fame + project swag |
| Honorary | Critical severity or exceptional help | Hall of Fame + invitation to security team |

### 12.3 Anonymity

Researchers may request to remain anonymous. Reports submitted anonymously
will still be investigated and fixed, but recognition will not include the
reporter's name.

## 13. Third-Party Security Audits

### 13.1 Independent Audits

Libern engages independent security auditors for periodic assessments:
- **Cryptographic audit:** Review of Ed25519, SHA-3, and encryption
  implementations
- **Architecture review:** Assessment of overall security architecture
- **Penetration testing:** Simulated attacks against Libern deployments
- **Dependency audit:** Review of third-party dependencies for vulnerabilities

### 13.2 Audit Schedule

| Audit Type | Frequency | Last Completed | Next Scheduled |
|-----------|-----------|---------------|----------------|
| Full security audit | Annual | 2026 Q1 | 2027 Q1 |
| Cryptographic review | Annual | 2026 Q1 | 2027 Q1 |
| Dependency audit | Quarterly | 2026 Q2 | 2026 Q3 |
| Penetration test | Semi-annual | 2026 Q1 | 2026 Q3 |

### 13.3 Audit Reports

Audit findings are published in summary form on the Libern security page.
Detailed reports are available to:
- Enterprise customers under NDA
- Security researchers conducting further analysis
- Regulatory bodies upon request

## 14. Security FAQ

**Q: Does Libern collect any data that could help an attacker?**
A: No. Libern has no telemetry, no analytics, and no automatic data
collection. Attackers cannot extract user data from any Libern server
(because there is no server).

**Q: How do I know a Libern release is authentic?**
A: All releases are signed with the Libern GPG key. Verify the signature
before installation.

**Q: What if a vulnerability is found in the cryptography?**
A: We follow cryptographic best practices and use well-audited libraries.
If a vulnerability is found, we will issue an emergency release with a fix
and transition to alternative algorithms if necessary.

**Q: How do I join the security team?**
A: Security team members are typically experienced maintainers who have
demonstrated security expertise. If you are interested, start by
contributing to the project and expressing your interest to the Core Team.

**Q: Are there known vulnerabilities I should be aware of?**
A: All known vulnerabilities are published on our GitHub Security Advisories
page. There are no unpatched critical vulnerabilities at this time.

## 15. Appendix: Security Contact Information

| Purpose | Contact | Encryption |
|---------|---------|------------|
| Vulnerability reports | security@libern.ai | PGP recommended |
| Security questions | security@libern.ai | N/A |
| Bug bounty inquiries | security-bounty@libern.ai | PGP recommended |
| PGP Key Fingerprint | Available at libern.ai/security-pgp.asc | |
| GitHub Security | github.com/libern/libern/security/advisories | Built-in encryption |

## 16. Security Disclosure Timeline Template

```
Security Disclosure Timeline
════════════════════════════

CVE ID: CVE-2026-XXXXX
LIBERN-SEC ID: LIBERN-SEC-2026-NNN

Report Received: [Date]
Reporter: [Name / Anonymous]
Severity: [Critical / High / Medium / Low]
CVSS Score: [X.X]

Initial Assessment: [Date]
Fix Developed: [Date]
Fix Tested: [Date]
Fix Released: [Version, Date]
Advisory Published: [Date]

Coordinated Disclosure Window:
- Embargo Start: [Date]
- Embargo End: [Date]
- Public Disclosure: [Date]

Credit: [Reporter name / Organization]
```


## 18. Vulnerability Classification Guide

### 18.1 CVSS Scoring Reference

| Severity | CVSS 4.0 Score | Response SLA | Examples |
|----------|---------------|--------------|----------|
| Critical | 9.0-10.0 | 24h assessment, 7d fix | RCE, auth bypass, crypto break |
| High | 7.0-8.9 | 48h assessment, 14d fix | SQL injection, privilege escalation |
| Medium | 4.0-6.9 | 5d assessment, 30d fix | XSS, information disclosure |
| Low | 0.1-3.9 | 10d assessment, 60d fix | Minor info leak, best practice |

### 18.2 Libern-Specific Vulnerability Categories

| Category | Example | Severity (typical) |
|----------|---------|-------------------|
| Cryptographic | Weak key generation, signature bypass | Critical |
| P2P protocol | Connection hijacking, message injection | High |
| Data storage | Unencrypted database access, SQL injection | High |
| AI subsystem | Prompt injection, model poisoning | Medium |
| Network | mDNS spoofing, port scanning | Medium |
| Build | Dependency vulnerability, supply chain | High |
| Configuration | Insecure defaults, permission bypass | Medium |
| Denial of service | Resource exhaustion, crash loop | Medium |

### 18.3 Vulnerability Scoring Decision Tree

```
Report received
        │
        ▼
Is it a security vulnerability?
   ├── No → Forward to regular issue tracker
   │
   └── Yes →
        ├── Determine attack vector (network/local/physical)
        ├── Determine impact (confidentiality/integrity/availability)
        ├── Determine exploitability (requires auth? user interaction?)
        ├── Calculate CVSS 4.0 score
        ├── Assign severity
        └── Begin handling per policy
```

## 19. Security Research Collaboration

### 19.1 Research Agreement Template

```
Security Research Agreement — Libern Project
══════════════════════════════════════════════

This agreement governs security research conducted on Libern software.

1. Scope: Testing of Libern software versions [X.Y.Z] in test
   environments only.

2. Rules of Engagement:
   - Use test accounts and test data only
   - Do not access, modify, or exfiltrate real user data
   - Stop testing immediately if user data is encountered
   - Report findings via security@libern.ai
   - Allow [X] days for remediation before disclosure

3. Safe Harbor:
   - Good-faith research is encouraged and protected
   - No legal action will be taken against researchers
     following these terms
   - Credit will be given for valid findings

4. Disclosure:
   - Coordinated disclosure is required
   - CVE assignment will be requested
   - Public disclosure after fix is released
```

### 19.2 Academic Research Collaboration

Libern welcomes academic research on:
- CRDT security properties and attack surfaces
- P2P network authentication mechanisms
- Local AI model security and privacy
- Decentralized identity management
- Cryptographic protocol analysis

Contact research@libern.ai for collaboration inquiries.

## 20. Security Incident Response Simulation

### 20.1 Tabletop Exercise: Key Compromise

**Scenario:** An attacker gains access to a developer's workstation and extracts the Libern code signing private key.

**Injects:**
1. **Discovery:** A community member reports a suspicious binary on a third-party download site
2. **Investigation:** Security team confirms the binary is signed with the compromised key
3. **Response:**
   - Revoke compromised signing key
   - Generate new signing keypair
   - Issue security advisory
   - Verify all legitimate release checksums
   - Request takedown of malicious binary
4. **Recovery:**
   - All users must verify checksums before updating
   - New signing key distributed through multiple channels
   - Root key used to sign new release signing key

### 20.2 Tabletop Exercise: Dependency Vulnerability

**Scenario:** A critical vulnerability (CVSS 9.5) is announced in the `ed25519-dalek` library used by Libern.

**Injects:**
1. **Discovery:** Dependabot alert triggers for CVE-2026-XXXX
2. **Assessment:** Determine if Libern is affected (uses affected functions)
3. **Response:**
   - Update `ed25519-dalek` to patched version
   - Test all cryptographic operations
   - Release emergency patch (v1.2.1)
   - Publish security advisory
4. **Recovery:**
   - Users update to v1.2.1
   - Verify signatures with new version
   - Monitor for related issues

## 21. Security Tools Configuration

### 21.1 Automated Scanning Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "cargo"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "security"

  - package-ecosystem: "npm"
    directory: "/apps/desktop"
    schedule:
      interval: "weekly"
```

```yaml
# .github/workflows/security-scan.yml
name: Security Scan
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions-rust-lang/setup-rust-toolchain@v1
      - run: cargo audit
      - run: cargo clippy -- -D warnings
      - run: npm audit --audit-level=high
```

### 21.2 Fuzz Testing Configuration

```rust
// tests/fuzz/crdt_fuzz.rs
#![no_main]
use libfuzzer_sys::fuzz_target;
use libern_core::crdt::LwwElementSet;

fuzz_target!(|data: &[u8]| {
    // Fuzz CRDT merge with random data
    let mut set_a = LwwElementSet::new();
    let mut set_b = LwwElementSet::new();

    // Apply random operations
    for chunk in data.chunks(16) {
        if chunk.len() < 16 { break; }
        let elem = chunk[0];
        let ts = u64::from_le_bytes(chunk[0..8].try_into().unwrap());
        if chunk[8] % 2 == 0 {
            set_a.add(elem, ts);
        } else {
            set_a.remove(elem, ts);
        }
    }

    // Verify CRDT properties
    let snap = set_a.snapshot();
    assert!(snap.len() <= set_a.adds.len());
});
```


## 17. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-06-19 | Libern Team | Initial security disclosures document |

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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