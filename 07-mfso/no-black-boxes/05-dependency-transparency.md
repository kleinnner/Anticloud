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

# Dependency Transparency

## SBOM, Known Vulnerabilities, and Supply Chain Security

### 1. Introduction

Dependency transparency addresses one of the most critical and often overlooked aspects of software security: the trustworthiness of the third-party components that make up the majority of modern applications. A typical software project contains ten to a hundred times more third-party code than original code, and each dependency represents a potential attack vector. MF+SO takes a comprehensive approach to dependency management, providing full visibility into every component, its provenance, its security status, and its license.

The modern software supply chain is complex and fragile. The SolarWinds attack of 2020, the Log4Shell vulnerability of 2021, and the xz utils backdoor of 2024 demonstrated that a single compromised dependency can cascade through the entire software ecosystem, affecting thousands of downstream projects. For authentication software, the stakes are even higher: a dependency vulnerability could leak the cryptographic keys and credentials that protect a user's entire digital identity.

MF+SO's approach to dependency transparency consists of five pillars: (1) complete Software Bill of Materials (SBOM) publication for every release, (2) multi-layered automated vulnerability scanning, (3) supply chain attack protections including dependency pinning and hash verification, (4) continuous dependency health monitoring, and (5) regular transparency reporting on the state of the dependency tree.

### 2. Software Bill of Materials

MF+SO publishes a complete Software Bill of Materials (SBOM) for every release. The SBOM is a machine-readable inventory of every component that goes into the MF+SO binary, including:

- Direct and transitive dependencies (Rust crates, Dart packages)
- System libraries linked into the binary (OpenSSL, SQLite, etc.)
- Build tooling and its dependencies (Cargo, Dart SDK, Flutter SDK)
- Container base images and their packages

The SBOM is published in two standard formats:

- **SPDX 2.3**: The industry standard for SBOM exchange, supported by most security tooling. The SPDX document includes the creation info, package information, file information, and relationship information required by the specification.
- **CycloneDX 1.5**: The OWASP standard, with rich support for component metadata, vulnerability references, and pedigree information. CycloneDX is particularly well-suited for automated vulnerability correlation.

Each SBOM entry includes:

| Field | Description | Example |
|-------|-------------|---------|
| Component name | Package name | sodiumoxide |
| Version | Exact version | 0.2.7 |
| Supplier | Creating organization | sodiumoxide contributors |
| License | SPDX license identifier | MIT |
| Download location | Source URL | https://crates.io/... |
| Package URL (PURL) | Standardized identifier | pkg:cargo/sodiumoxide@0.2.7 |
| CPE | CPE identifier (if available) | cpe:2.3:a:sodiumoxide_project:sodiumoxide:0.2.7 |
| SHA-256 hash | Cryptographic hash of component | e3b0c44298fc... |
| Relationship | Direct or transitive | DIRECT_DEPENDENCY |
| Evidence | How the component was identified | Build system lock file |

The SBOM is generated automatically by the build system using `cargo-cyclonedx` for Rust dependencies and `dart pub deps` for Dart dependencies. The SBOM generator runs as a post-build step and the resulting SBOM is included in the release artifacts. It is also published to the project website and to public SBOM repositories.

### 3. Dependency Inventory

The following sections provide a categorized inventory of MF+SO's major direct dependencies. For the complete inventory, including all transitive dependencies, refer to the SBOM for each release.

**Cryptography:**

| Dependency | Version | License | Purpose |
|-----------|---------|---------|---------|
| sodiumoxide | 0.2.7 | MIT | High-level cryptographic operations |
| blake3 | 1.5.0 | Apache-2.0 | Cryptographic hashing |
| x25519-dalek | 2.0.0 | BSD-3 | X25519 key exchange |
| ed25519-dalek | 2.1.0 | BSD-3 | Ed25519 signatures |
| aead | 0.5.2 | Apache-2.0 | Authenticated encryption |
| argon2 | 0.5.3 | Apache-2.0 | Password hashing |
| hkdf | 0.12.4 | Apache-2.0 | Key derivation |
| chacha20poly1305 | 0.10.1 | Apache-2.0 | ChaCha20-Poly1305 encryption |
| aes-gcm | 0.10.3 | Apache-2.0 | AES-GCM encryption |

**Protocol Implementation:**

| Dependency | Version | License | Purpose |
|-----------|---------|---------|---------|
| webauthn-rs | 0.5.0 | Apache-2.0 | WebAuthn protocol implementation |
| oauth2 | 5.0.0 | MIT | OAuth 2.1 client |
| openidconnect | 3.1.0 | Apache-2.0 | OpenID Connect compliance |
| totp-rs | 5.2.0 | MIT | TOTP implementation |

**Networking and Storage:**

| Dependency | Version | License | Purpose |
|-----------|---------|---------|---------|
| reqwest | 0.12.0 | Apache-2.0 | HTTP client |
| rusqlite | 0.31.0 | MIT | SQLite database |
| sqlcipher | 0.4.0 | BSD-3 | Encrypted database layer |
| protobuf | 3.5.0 | BSD-3 | Data serialization |
| serde | 1.0.200 | Apache-2.0 | Serialization framework |

**UI and Platform:**

| Dependency | Version | License | Purpose |
|-----------|---------|---------|---------|
| flutter | 3.22.0 | BSD-3 | Application framework |
| proview | 4.2.0 | MIT | QR code scanning |
| local_auth | 2.2.0 | BSD-3 | Platform biometric authentication |
| biometric_storage | 3.1.0 | MIT | Biometric key storage |
| flutter_secure_storage | 9.0.0 | BSD-3 | Secure platform storage |

### 4. Vulnerability Scanning

MF+SO employs multiple layers of automated vulnerability scanning to identify and address known vulnerabilities in dependencies:

**Pre-commit scanning:** Before a change is committed, the developer's local environment scans any new or updated dependencies against the GitHub Advisory Database and the National Vulnerability Database (NVD). Pre-commit hooks prevent commits that introduce dependencies with known critical or high-severity vulnerabilities.

**CI/CD scanning:** Every build in the CI/CD pipeline runs a comprehensive vulnerability scan using multiple tools:

| Scanner | Scope | Database |
|---------|-------|----------|
| cargo-audit | Rust dependencies | RustSec Advisory Database |
| dart pub audit | Dart dependencies | Dart package vulnerability database |
| trivy | Filesystem, containers | NVD, OSV, GitHub advisories |
| osv-scanner | All dependencies | Open Source Vulnerabilities database |
| grype | All dependencies | Multiple upstream databases |
| snyk | All dependencies (supplementary) | Snyk vulnerability database |

Each scanner is configured to fail the build if any dependency has a known vulnerability with a CVSS 4.0 score above 7.0. Vulnerabilities with scores below 7.0 are flagged for review but do not block the build.

**Continuous monitoring:** Between builds, the MF+SO dependency monitoring system watches all vulnerability databases for newly disclosed vulnerabilities affecting any component in the SBOM. When a new vulnerability is disclosed, an automated alert is sent to the security team, the vulnerability is triaged within 24 hours, and if the vulnerability is critical or high severity, an emergency release process begins.

### 5. Supply Chain Attack Protections

MF+SO implements multiple layers of defense against supply chain attacks:

**Dependency pinning:** All dependencies are pinned to specific versions in the lock files (`Cargo.lock`, `pubspec.lock`). Version ranges are never used in production builds. This prevents automatic upgrades from introducing unexpected or malicious code.

**Hash verification:** Every dependency download is verified against a cryptographic hash stored in the lock file. The package managers (Cargo and pub) verify these hashes before using the downloaded code. If the hash does not match, the build fails.

**Source-based dependencies:** For the most critical dependencies — cryptographic libraries and protocol implementations — MF+SO uses source-based dependencies rather than precompiled binaries. The source code is downloaded and compiled as part of the MF+SO build, ensuring that the compiled code matches the published source.

**Code review of dependency updates:** All dependency version updates are subject to the same code review process as any other change. The review specifically examines the diff between the old and new versions, the maintainer's reputation and history, any new transitive dependencies introduced, and the dependency's own dependency tree.

**SBOM verification:** After a build completes, the generated SBOM is compared against the expected SBOM from the build manifest. Any unexpected change in the dependency tree triggers a build failure and alerts the security team.

### 6. Dependency Health Monitoring

Beyond vulnerability scanning, MF+SO monitors the health of its dependencies to identify signs of maintainer burnout, abandonment, or malicious activity:

- **Maintainer activity:** The system tracks commit frequency, issue response times, and release cadence for each direct dependency. A sudden decrease in maintainer activity may indicate burnout or abandonment, prompting a search for alternative dependencies.
- **Maintainer changes:** When a dependency changes ownership or maintainer, the change is flagged for review. The new maintainer's reputation and history are evaluated before the dependency is trusted.
- **Unusual release patterns:** Rapid, consecutive releases or releases with minimal changelogs are flagged for review. These patterns can indicate an account compromise or a malicious actor pushing updates.
- **License changes:** Any change in a dependency's license is automatically flagged, as license changes can have legal implications for distribution.
- **Deprecation notices:** Dependencies that have been deprecated are flagged for replacement, as deprecated dependencies no longer receive security updates.

### 7. Dependency Update Policy

MF+SO follows a structured policy for dependency updates, balancing security against stability:

- **Security updates:** Applied immediately upon availability for critical and high-severity vulnerabilities. Released as a patch version increment within 24 hours (critical) or 72 hours (high).
- **Minor updates:** Applied within 30 days of release. Batched into the next scheduled release.
- **Major updates:** Applied within 90 days, after thorough testing and review. May require migration effort.
- **Manual review threshold:** All updates to cryptographic dependencies, protocol implementation dependencies, and dependencies with direct access to credentials or keys require manual review.

### 8. Conclusion

Dependency transparency is a critical component of MF+SO's "no black boxes" philosophy. By publishing a complete SBOM, implementing multiple layers of vulnerability scanning, protecting against supply chain attacks, and maintaining rigorous dependency health monitoring, MF+SO provides users and organizations with the visibility they need to assess and trust the software's supply chain.

### 8. Real-World Supply Chain Incidents and MF+SO's Response

The software industry has experienced several major supply chain attacks that inform MF+SO's dependency management practices:

**SolarWinds (2020):** Attackers compromised the SolarWinds build system and injected malicious code into Orion software updates. MF+SO's defense: reproducible builds ensure that any build system compromise is detectable because the binary would not match the published source. SBOM publication allows organizations to verify the integrity of each component.

**Codecov (2021):** Attackers modified a Codecov Bash Uploader script to exfiltrate environment variables from CI/CD environments. MF+SO's defense: minimized CI/CD access tokens, no secrets in environment variables, and all CI/CD scripts are version-controlled and reviewed.

**log4j / Log4Shell (2021):** A critical remote code execution vulnerability in the Apache Log4j library affected thousands of applications. MF+SO's response: the project does not use Log4j or any Java-based logging library. The Rust and Dart logging frameworks were immediately checked for similar vulnerabilities.

**xz utils backdoor (2024):** A sophisticated backdoor was introduced into the xz utils library over a period of years. MF+SO's defense: source-based dependencies for critical libraries, pinning of all dependency versions, and automated scanning for suspicious patterns in dependency updates.

**Polyfill.io supply chain attack (2024):** A domain acquisition led to malicious JavaScript being served through the Polyfill.io CDN. MF+SO's defense: no CDN-hosted JavaScript dependencies in the native applications. The PWA bundles all dependencies and verifies them at build time.

Each of these incidents has been analyzed and used to improve MF+SO's dependency management practices. The project maintains a living document of lessons learned from supply chain incidents across the industry.

### 9. Dependency Risk Assessment Framework

MF+SO uses a structured framework for assessing the risk of each dependency:

| Risk Factor | Low Risk | Medium Risk | High Risk | Critical Risk |
|-------------|----------|-------------|-----------|---------------|
| Function | Non-security utility | General library | Security-adjacent | Cryptographic/auth |
| Maintenance | Active, multiple maintainers | Active, single maintainer | Irregular | Abandoned |
| Community | Large, diverse | Moderate | Small | Single contributor |
| Age | 5+ years | 2-5 years | 1-2 years | < 1 year |
| CVE history | No CVEs | 1-2 CVEs, promptly fixed | Multiple CVEs | Unpatched CVEs |
| Dependency tree | No dependencies | 1-10 transitive | 10-50 transitive | 50+ transitive |
| License | Permissive | Weak copyleft | Strong copyleft | Proprietary/unknown |

Dependencies flagged as high or critical risk are subject to additional review, may require source-based builds, and are candidates for replacement with lower-risk alternatives.

### 10. Transitive Dependency Deep Dive

While direct dependencies are documented and reviewed, transitive dependencies (dependencies of dependencies) are equally important. MF+SO's tools provide full visibility into the transitive dependency tree:

**Visualization:** The SBOM includes the complete dependency graph, showing how each transitive dependency is included. This visualization helps identify:
- Dependencies included through multiple paths (potential version conflicts)
- Deeply nested dependencies that may be difficult to review
- Unexpected or suspicious dependency relationships

**Transitive risk aggregation:** For each transitive dependency, the risk score is computed based on the framework above. The aggregate risk of the dependency tree is published in the supply chain security report.

**Deduplication:** The build system automatically deduplicates dependencies that are included through multiple paths, using the highest version specified.

**Transparency:** All transitive dependencies are listed in the SBOM with the same level of detail as direct dependencies. There are no hidden transitive dependencies.

### 11. Dependency License Compliance

MF+SO maintains license compliance for all dependencies:

| License Category | Count | Examples |
|-----------------|-------|----------|
| MIT | 142 | sodiumoxide, reqwest, serde |
| Apache 2.0 | 98 | blake3, argon2, webauthn-rs |
| BSD 3-Clause | 21 | x25519-dalek, ed25519-dalek |
| BSD 2-Clause | 15 | parts of Flutter SDK |
| ISC | 3 | OpenSSL-derived code |
| Zlib | 2 | Compression libraries |
| CC0 | 1 | Public domain declarations |

All dependencies are checked for license compatibility with the Apache 2.0 license using automated license scanning. Conflicts are resolved by replacing the conflicting dependency or, if no replacement exists, documenting the exception in the NOTICE file.

### 12. Dependency Replacement Process

When a dependency becomes unsuitable (abandoned, vulnerable, license issue), MF+SO follows a structured replacement process:

1. **Identification:** The unsuitable dependency is identified through scanning, audit, or community report
2. **Evaluation:** Potential replacements are evaluated against the dependency selection criteria
3. **Decision:** The TSC makes a decision on the replacement
4. **Migration:** The replacement is implemented and tested
5. **Deprecation:** The old dependency is marked as deprecated
6. **Removal:** The old dependency is removed in the next major release

The project maintains a list of deprecated dependencies and their replacement status in the repository.

### 13. Conclusion and Best Practices

Dependency transparency is a critical component of MF+SO's "no black boxes" philosophy. By publishing a complete SBOM for every release, implementing multiple layers of automated vulnerability scanning, protecting against supply chain attacks through rigorous dependency management, and maintaining continuous dependency health monitoring, MF+SO provides users and organizations with the visibility they need to assess and trust the software's supply chain.

For organizations building their own software, MF+SO's dependency management practices serve as a reference model for supply chain security. The tools and processes used by MF+SO are themselves open source and can be adapted for other projects.

The key principles are: know every dependency, verify every download, scan every vulnerability, monitor every change, and be prepared to replace any component at any time. In authentication software, where the trustworthiness of the entire system depends on the trustworthiness of every component, dependency transparency is not optional — it is essential.

### 14. Dependency Update Workflow Example

The following provides a concrete example of how a dependency update is handled:

**Scenario:** A new version of the `serde` crate is released with a critical security fix

**Step 1 — Notification:**
Dependabot creates a PR updating `serde` from 1.0.200 to 1.0.201. The PR includes: the changelog, the diff between versions, and an automated analysis of the dependency change (only version number changes, no new transitive dependencies).

**Step 2 — Automated checks:**
The CI pipeline runs automated checks on the PR:
- All unit tests pass
- All integration tests pass
- Security scanning shows no new vulnerabilities
- Fuzz testing shows no regressions
- The SBOM generation produces an updated SBOM

**Step 3 — Review:**
A reviewer examines the update:
- Confirms the changelog is legitimate (no unexpected changes)
- Reviews the diff for suspicious code changes
- Verifies that serde's own dependencies are unaffected
- Approves the PR

**Step 4 — Merge:**
The PR is merged to the main branch. The CI pipeline runs again on the merge commit to confirm everything is still working.

**Step 5 — Release:**
The update is included in the next scheduled release. If the CVE severity is critical, an emergency release is made instead.

**Step 6 — Verification:**
After the release, the SBOM is verified to confirm that the updated dependency is included. The vulnerability scanning confirms that the previously identified CVE is no longer present.

### 15. Third-Party Dependency Evaluation Checklist

When evaluating a new dependency for inclusion in MF+SO, the following checklist is used:

- [ ] Is the dependency strictly necessary, or can the functionality be implemented in-house?
- [ ] Does the dependency have a permissive open-source license compatible with Apache 2.0?
- [ ] Is the dependency actively maintained (commits within the last 3 months)?
- [ ] Does the dependency have multiple maintainers (bus factor > 1)?
- [ ] Is the dependency well-documented with clear API documentation?
- [ ] Has the dependency had a security audit or does it have a published security record?
- [ ] Does the dependency have minimal transitive dependencies (prefer shallow dependency trees)?
- [ ] Is the dependency available as source (not precompiled binary)?
- [ ] Does the dependency support the required platforms (Windows, macOS, Linux, Android, iOS)?
- [ ] Is the dependency free of known vulnerabilities at the current version?
- [ ] Does the dependency have a published SBOM or dependency manifest?
- [ ] Is the dependency's source repository hosted on a platform we can mirror?

Each item must be checked before the dependency is approved. Documentation of the evaluation is stored in the project's dependency records.

### 16. Dependency Incident Response

If a vulnerability is discovered in a dependency:

**Triage (within 1 hour for critical, 24 hours for other):**
1. Confirm the vulnerability: Check the advisory details, verify the affected versions
2. Assess impact: Determine if MF+SO uses the vulnerable functionality
3. Prioritize: Assign severity based on actual impact to MF+SO users

**Response (within 24 hours for critical, 72 hours for high):**
1. If a patched version is available: Update the dependency, test, and release
2. If no patch is available: Implement a workaround (feature flag, input validation, etc.)
3. If the vulnerability cannot be mitigated: Issue a security advisory with impact assessment

**Disclosure:**
1. Publish a security advisory with CVE assignment
2. Include: vulnerability description, affected versions, fix version, workarounds, credit
3. Notify users through the security announcement channel

### 17. Transitive Dependency Risk Mitigation

Transitive dependencies (dependencies of direct dependencies) are a common blind spot in supply chain security. MF+SO mitigates transitive dependency risk through:

**Visibility:** The SBOM includes all transitive dependencies with the same level of detail as direct dependencies. There are no hidden dependencies.

**Version pinning:** The lock file pins every transitive dependency to a specific version. This prevents unexpected transitive updates from introducing vulnerabilities.

**Vulnerability scanning:** Transitive dependencies are scanned with the same vulnerability databases as direct dependencies. A vulnerability in a deeply nested transitive dependency is detected at the same speed as a direct dependency vulnerability.

**Audit:** During dependency audits, the entire transitive dependency tree is reviewed. High-risk transitive dependencies are flagged for replacement.

**Minimization:** MF+SO avoids dependencies with deep or broad dependency trees. When two dependencies offer similar functionality, the one with fewer transitive dependencies is preferred.
### 18. Dependency Management Tools

MF+SO uses the following tools for dependency management:

**Rust dependencies:**
- Cargo (Rust package manager) with Cargo.lock for version pinning
- cargo-audit for vulnerability scanning
- cargo-deny for license compliance and duplicate detection
- cargo-outdated for update availability checking
- cargo-vet for dependency audit and trust verification
- cargo-crev for community code review of dependencies

**Dart/Flutter dependencies:**
- pub (Dart package manager) with pubspec.lock for version pinning
- dart pub audit for vulnerability scanning
- dart pub outdated for update availability checking

**Cross-platform tools:**
- Dependabot for automated dependency update PRs
- Renovate for dependency update management
- Trivy for container and filesystem vulnerability scanning
- OSV-Scanner for Open Source Vulnerabilities database checking
- SBOM generation (SPDX, CycloneDX) for transparency

These tools are configured in the repository's CI/CD pipeline and are run on every pull request and commit.

### 19. Dependency Security Best Practices

MF+SO follows these dependency security best practices:

- All dependencies are pinned to exact versions (no version ranges)
- Lock files are committed to the repository
- Dependency updates require code review
- Security updates are prioritized by severity
- Dependencies with known critical vulnerabilities block builds
- Dependencies are scanned for malware signatures
- Transitive dependencies are monitored for changes
- Abandoned or unmaintained dependencies are replaced
- Dependencies with excessive permissions are avoided
- Source-based dependencies are preferred over precompiled binaries
### 20. Dependency Management Incident Response

If a dependency-related security incident occurs:

**Incident types:**
- New vulnerability disclosed in a dependency
- Dependency maintainer account compromise affecting a dependency
- Malicious code injected into a dependency package
- Dependency license change affecting compatibility

**Response steps:**
1. Identify the affected dependency and MF+SO's usage of it
2. Assess the severity based on actual impact to MF+SO users
3. If a fix is available: update the dependency, test, and release
4. If no fix is available: implement a workaround
5. If the dependency is compromised: fork, patch, and migrate
6. Publish a security advisory
7. Update the SBOM for the affected release

**Communication:**
- Critical incidents: Notify users within 24 hours through security advisory
- High incidents: Notify users within 72 hours
- Medium and low: Include in next release notes

### 21. Dependency Selection Case Studies

**Case Study 1: Cryptographic library selection**
MF+SO needed a cryptographic library for Rust. Candidates included: sodiumoxide (libsodium bindings), rust-crypto (pure Rust), ring, and OpenSSL bindings.
- Decision: sodiumoxide was selected because it wraps libsodium (extensively audited), provides high-level safe APIs, and has a mature Rust binding
- Reasons for rejection: rust-crypto had limited audit history, ring had a smaller feature set, OpenSSL bindings added complexity
- Outcome: sodiumoxide has been audited twice with no critical findings

**Case Study 2: Database library selection**
MF+SO needed a local encrypted database. Candidates included: SQLCipher (encrypted SQLite), sled (embedded database), and rocksdb.
- Decision: SQLCipher was selected because it provides battle-tested SQLite encryption, has wide platform support, and integrates well with Rust through rusqlite
- Reasons for rejection: sled had limited platform support, rocksdb had excessive transitive dependencies
- Outcome: SQLCipher has proven reliable across all supported platforms
### 22. Third-Party Dependency Audit Process

MF+SO maintains an audit process for critical third-party dependencies:

- Cryptographic dependencies are audited at least annually by a security firm
- Protocol implementation dependencies are audited at least every 2 years
- Storage and networking dependencies are audited every 3 years
- Dependencies with security incidents are audited immediately after the incident
- Audit results are published in the project's audit reports

### 23. Dependency Elimination Efforts

MF+SO actively works to reduce its dependency footprint:

- Unnecessary dependencies are identified through regular dependency tree reviews
- Dependencies that provide minimal functionality are candidates for in-house implementation
- Consolidation: multiple dependencies serving similar purposes are consolidated into fewer dependencies
- The dependency count is tracked as a metric and reviewed quarterly
- Each new dependency requires justification and approval through the dependency selection process
### 24. Final Note

Dependency transparency ensures that every component in MF+SO's software supply chain is known, tracked, and verified. In authentication software, the trustworthiness of the whole depends on the trustworthiness of every part. MF+SO's dependency management provides the visibility needed to maintain that trust.
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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
