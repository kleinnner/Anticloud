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

# Source Code Availability

## Full Access to the MF+SO Source Repository: GitHub, Build Reproducibility, Licensing

### 1. Introduction

MF+SO's source code is publicly available under a permissive open-source license. This document provides comprehensive information about where the source code is hosted, how to access it, how to build it, what license governs its use, and what commitments the project makes regarding source code availability over the long term.

The principle is simple: any security-relevant software that cannot be independently inspected cannot be independently trusted. MF+SO therefore publishes all source code — including the core authentication engine, cryptographic primitives, user interface components, build tooling, and test infrastructure — in a publicly accessible version-controlled repository. There are no proprietary components, no closed-source modules, and no "source available" restrictions. Every line of code that runs on the user's device is open for inspection.

### 2. Repository Location and Structure

The primary MF+SO repository is hosted on GitHub at `https://github.com/lois-kleinner/mfso`. This repository contains the complete source tree, organized into the following top-level directories:

```
mfso/
├── src/                    # Main application source code
│   ├── core/               # Core authentication engine
│   │   ├── crypto/         # Cryptographic primitives and operations
│   │   ├── factors/        # Multi-factor authentication logic
│   │   ├── storage/        # Local credential storage
│   │   └── protocol/       # WebAuthn, FIDO2, OIDC implementations
│   ├── ui/                 # User interface (Flutter/Dart)
│   │   ├── screens/        # Application screens
│   │   ├── widgets/        # Reusable UI components
│   │   └── themes/         # Visual theming and styling
│   ├── platform/           # Platform-specific code (Windows, macOS, Linux, Android, iOS)
│   └── bindings/           # FFI bindings for native platform APIs
├── tests/                  # Test suites
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   ├── crypto/             # Cryptographic test vectors
│   └── fuzz/               # Fuzz testing harnesses
├── docs/                   # Documentation
│   ├── architecture/       # Architecture documentation
│   ├── api/                # API reference
│   ├── threat-model/       # Threat model documentation
│   └── security/           # Security policies and procedures
├── scripts/                # Build and maintenance scripts
├── build/                  # Build configuration
├── .github/                # GitHub Actions workflows
├── SECURITY.md             # Security disclosure policy
├── CONTRIBUTING.md         # Contribution guidelines
├── CODE_OF_CONDUCT.md      # Code of conduct
├── LICENSE                 # License file
└── README.md               # Project overview
```

The repository uses Git for version control, with a branching strategy that follows the GitHub Flow model: the `main` branch contains the latest stable release, while development occurs on feature branches that are merged through pull requests. Each release is tagged with a signed semantic version tag (e.g., `v1.2.3`), and the tag is signed with the project's GPG key to ensure authenticity.

The repository also contains the following supporting branches:
- `stable`: Points to the latest stable release
- `nightly`: Daily builds of the current development state
- `release/v*.*`: Maintenance branches for previous major releases

Each branch and tag is protected by branch rules that require passing CI checks and code review before merging.

### 3. Mirrors and Alternative Access

While GitHub is the primary repository host, MF+SO source code is also available through the following mirrors:

- **GitLab**: `https://gitlab.com/lois-kleinner/mfso` — Mirror updated within 1 hour of GitHub
- **Codeberg**: `https://codeberg.org/lois-kleinner/mfso` — Mirror for European users
- **SourceHut**: `https://git.sr.ht/~lois-kleinner/mfso` — Email-first workflow mirror
- **Software Heritage**: `https://archive.softwareheritage.org/...` — Long-term archival

These mirrors provide redundancy and ensure that the source code remains accessible even if GitHub experiences an outage or if access to GitHub is restricted in certain jurisdictions. All mirrors are synchronized automatically through the project's CI/CD pipeline.

The project also publishes source code tarballs for each release on the GitHub releases page and the project website. These tarballs are signed with the project's GPG key and include checksum files for integrity verification.

### 4. Build Reproducibility

One of the most critical properties of MF+SO's source code availability is build reproducibility. A build is said to be reproducible if, given the same source code, build environment, and build instructions, multiple independent parties can produce byte-for-byte identical binaries. This property allows users to verify that a binary distributed through official channels — the App Store, Google Play, Microsoft Store, or the MF+SO website — was actually built from the published source code and not tampered with during the build or distribution process.

MF+SO achieves build reproducibility through several mechanisms working together:

- **Deterministic compilation**: The build system uses fixed compiler versions, deterministic timestamp handling (via SOURCE_DATE_EPOCH), consistent file ordering (all file lists are sorted), and reproducible compression settings (gzip -n, zip -X) to ensure that repeated builds produce identical output.

- **Containerized build environment**: The build process runs inside a Docker container whose image is pinned to a specific cryptographic digest (SHA-256), ensuring that every build starts from exactly the same environment. The container image is built from a Dockerfile in the repository, which is version-controlled and reviewed like any other source file.

- **Pinned dependencies**: All dependencies are pinned to specific versions using cryptographic hash verification in the package manager configuration. The Cargo.lock file for Rust dependencies and the pubspec.lock file for Dart dependencies are both committed to the repository.

- **Build manifest**: Each release includes a signed build manifest that lists the exact source commit hash, build container image digest, all dependency versions, compiler flags, and environment variables used to produce the official binaries.

- **Reproducible build verification tool**: MF+SO provides a command-line tool, `mfso-verify`, that automates the process of downloading the source, reproducing the build in a container, and comparing the SHA-256 checksum of the result to the published signed checksum. This tool can be run on any machine with Docker installed and does not require the MF+SO SDK to be installed locally.

### 5. Building from Source

Building MF+SO from source requires the following tooling:

- **Dart SDK** (version 3.5 or later) for the Flutter-based UI and business logic
- **Rust toolchain** (edition 2024) for the native cryptographic engine
- **Docker** for the reproducible build environment
- **CMake** (version 3.28 or later) for native platform integration
- **Platform SDKs**: Windows SDK (10.0.20348 or later), Xcode (15.0 or later for macOS/iOS), Android NDK (r26 or later), Linux development headers (glibc 2.35 or later)

Detailed build instructions are maintained in the `BUILDING.md` file at the root of the repository. The instructions cover building for all supported platforms:

- **Desktop**: Windows (x86_64, arm64), macOS (arm64, x86_64), Linux (x86_64, arm64)
- **Mobile**: Android (arm64, armeabi-v7a, x86_64), iOS (arm64)
- **Web**: PWA (WebAssembly, progressive web application)

For convenience, the repository provides a Docker-based build script that automates the entire build process:

```bash
git clone https://github.com/lois-kleinner/mfso.git
cd mfso
./scripts/build.sh --platform linux/amd64 --output ./build-output
```

The output binary will be placed in `build-output/` along with a SHA-256 checksum file for verification. The build script also generates the SBOM, build manifest, and verification certificates as part of the build output.

### 6. Licensing

MF+SO is released under the Apache License, Version 2.0. This permissive open-source license allows anyone to:

- Use the software for any purpose, including commercial use
- Modify the software and create derivative works
- Distribute the software in original or modified form
- Sublicense the software under different terms
- Use the software without paying royalties or fees

The only requirements are:

- Preservation of copyright notices and the license text in all copies
- A statement of changes made to modified versions
- Acceptance of the disclaimer of warranty and limitation of liability

The Apache 2.0 license was chosen specifically for its permissiveness, which maximizes adoption in both open-source and proprietary contexts. Unlike copyleft licenses (GPL, AGPL), the Apache license does not require derivative works to be released under the same license. This means that organizations can integrate MF+SO into their own products without being forced to open-source their proprietary code, lowering the barrier to adoption while still providing all users with access to MF+SO's source code.

The license explicitly grants patent rights from contributors to users, providing additional protection against patent litigation. Section 3 of the Apache 2.0 license grants a perpetual, worldwide, non-exclusive, royalty-free patent license to any contributor's patents that are necessarily infringed by their contributions. This means that if a contributor holds a patent that reads on their contribution, they automatically license it to all users of the software.

The license also includes a termination clause (Section 4) that automatically revokes the license from any party that initiates patent litigation against the project or any of its users. This "patent retaliation" clause protects the community from patent aggressors.

### 7. Source Code Longevity Commitments

MF+SO makes the following commitments regarding source code availability:

- **Permanent availability**: The source code will remain publicly available for the lifetime of the project. If the project is discontinued, the source code will be archived in multiple independent repositories (GitHub, GitLab, Software Heritage, Internet Archive) with a final release.

- **No source code removal**: Historical versions of the source code will never be removed or made inaccessible. All past releases remain available through Git tags and GitHub releases. This applies even if a version contains a security vulnerability — the vulnerable code remains available for study.

- **License irrevocability**: The Apache 2.0 license is irrevocable. Once code is released under this license, recipients retain their rights even if the project changes its licensing for future versions. This is established in Section 2 of the Apache 2.0 license and has been confirmed by case law in multiple jurisdictions.

- **Dual licensing not intended**: MF+SO has no plans to offer a commercial license or change to a source-available license (such as the Business Source License or similar). The project is and will remain open source under the Apache 2.0 license.

- **Contribution agreement**: Contributors retain ownership of their contributions but grant the project a perpetual, royalty-free license to distribute their code under the project's license. No contributor license agreement (CLA) assigning copyright to the project is required. This is established through the inbound=outbound policy: by contributing, the contributor agrees that their contribution is licensed under the same license as the project.

### 8. Third-Party Source Integrations

MF+SO integrates several third-party open-source components. Each component's source code availability and license are documented in the project's NOTICE file and dependency manifest:

| Component | License | Source Repository | Notes |
|-----------|---------|-------------------|-------|
| SodiumOxide | MIT | github.com/sodiumoxide/sodiumoxide | Cryptographic operations |
| web3dart | Apache 2.0 | github.com/web3dart/web3dart | WebAuthn/FIDO2 |
| Flutter framework | BSD 3-Clause | github.com/flutter/flutter | UI framework |
| SQLCipher | BSD 3-Clause | github.com/sqlcipher/sqlcipher | Encrypted database |
| BoringSSL | OpenSSL/ISC | boringssl.googlesource.com/boringssl | TLS/crypto primitives |
| protobuf | BSD 3-Clause | github.com/protocolbuffers/protobuf | Data serialization |
| re2 | BSD 3-Clause | github.com/google/re2 | Regex library |
| rustls | Apache 2.0 | github.com/rustls/rustls | TLS in Rust |
| blake3 | Apache 2.0 | github.com/BLAKE3-team/BLAKE3 | Hashing |
| x25519-dalek | BSD 3-Clause | github.com/dalek-cryptography/x25519-dalek | Key exchange |
| ed25519-dalek | BSD 3-Clause | github.com/dalek-cryptography/ed25519-dalek | Signatures |
| argon2 | Apache 2.0 | github.com/rust-argon2/argon2 | Password hashing |
| reqwest | Apache 2.0 | github.com/seanmonstar/reqwest | HTTP client |

All third-party components are included as source (not precompiled binaries) in the build process, ensuring that the entire software stack is open and auditable. The build system downloads each component from its official source repository, verifies its cryptographic hash, and compiles it as part of the MF+SO build.

### 9. Verification of Official Binaries

Users who download MF+SO from official app stores or the project website can verify that the binary corresponds to the published source code using the following process:

1. **Download the binary** from the official distribution channel (App Store, Google Play, Microsoft Store, or mfso.io/download).

2. **Download the checksum file** from the GitHub release page for the corresponding version. The checksum file contains SHA-256 hashes for all platform binaries.

3. **Verify the checksum**: Run `sha256sum -c mfso-1.2.3-linux-x86_64.sha256` (Linux) or equivalent command on other platforms. This confirms that the file has not been corrupted during download.

4. **Verify the checksum signature**: The checksum file is signed with the MF+SO release signing key (GPG key ID: 0xMFSO2026). Download the signature file from the GitHub release page, import the public key from keys.openpgp.org or the project website, and verify: `gpg --verify mfso-1.2.3-checksums.txt.asc mfso-1.2.3-checksums.txt`. This confirms that the checksum file was created by the MF+SO project.

5. **Rebuild from source**: Use the `mfso-verify` tool to rebuild the binary from source inside the specified build container: `mfso-verify --binary mfso-1.2.3-linux-x86_64.AppImage --release v1.2.3`. The tool automatically clones the repository at the specified tag, pulls the build container image, and performs the build.

6. **Compare the checksums**: The rebuilt binary's SHA-256 checksum should match the checksum in the signed checksum file exactly. If they match, the binary is verified. If they do not match, the binary has been tampered with or the build environment is inconsistent.

This verification process ensures that the binary you are running is exactly the binary that was built from the source code you can inspect. Any discrepancy indicates tampering or a build environment mismatch and should be reported as a security incident immediately.

### 10. Source Code and Security Updates

When security updates are released, the corresponding source code changes are immediately available in the repository. Users and organizations can:

- Review the specific commits that fix the vulnerability
- Verify that the fix is appropriate and complete
- Patch their own builds if they cannot immediately update to the latest version
- Apply the fix to older versions if they are running a long-term support deployment

The transparency of security fixes allows organizations to conduct their own security assessments of updates before deploying them, which is particularly important in regulated environments where change management processes require pre-deployment review.

### 11. Conclusion

Source code availability is the foundation of MF+SO's security model. By publishing all source code under a permissive license, providing reproducible builds, maintaining multiple mirrors for resilience, and making long-term availability commitments, MF+SO enables the independent verification that security-critical software demands. Every user of MF+SO has the ability — and is encouraged — to inspect the code that protects their identity, verify that the distributed binary matches the published source, and participate in the ongoing improvement of the software.

The source code is not a black box. It is an open book, and we invite the world to read it, audit it, and trust it — or to show us where it falls short.

### 10. Source Code for Developers: Getting Started

For developers who want to contribute to MF+SO or build on top of it, the following provides a quick start guide:

**Cloning and building:**
```
git clone https://github.com/lois-kleinner/mfso.git
cd mfso
git checkout v1.5.0
./scripts/build.sh --platform linux/amd64 --dev
```

**Setting up the development environment:**
1. Install prerequisites: Rust 1.78+, Dart SDK 3.5+, Flutter 3.22+, Docker, platform SDKs
2. Clone the repository
3. Run the setup script: `./scripts/setup-dev.sh`
4. Verify the setup: `./scripts/check-dev.sh`
5. Build the development version: `./scripts/build.sh --dev`

**Project architecture overview:**
- The Rust core (`src/core/`) implements cryptographic operations, protocol handling, and storage management
- The Dart UI (`src/ui/`) implements the user interface using Flutter
- The Rust core is compiled as a shared library and loaded by the Dart application through FFI bindings
- Platform-specific code (biometric integration, secure storage) is in the relevant platform directories

**Contribution workflow:**
1. Find an issue to work on (look for "good first issue" labels)
2. Fork the repository
3. Create a feature branch from `main`
4. Make your changes
5. Run tests: `./scripts/test.sh`
6. Run linting: `./scripts/lint.sh`
7. Submit a pull request
8. Address review feedback
9. Once approved, your changes will be merged

### 11. Repository Management and Security

The MF+SO repository is managed according to industry best practices for security-critical open-source projects:

**Branch Protection Rules:**
- The `main`, `stable`, and release branches are protected against direct pushes
- All changes must go through pull requests with passing CI checks
- At least one approval is required for all changes; security-critical changes require two approvals
- Signed commits are required for all merges to protected branches

**Access Control:**
- Repository access is granted on a least-privilege basis
- Write access requires two-factor authentication
- Repository admin access is limited to a small number of trusted maintainers
- All access grants and revocations are logged and audited quarterly

**Secret Management:**
- No secrets (API keys, passwords, tokens) are stored in the repository
- Secrets used in CI/CD are stored in GitHub Actions secrets with access controls
- Secrets are rotated quarterly and immediately upon any suspected compromise
- Secret scanning is enabled on the repository to detect accidental commits

**Dependency Management:**
- Dependencies are automatically checked for known vulnerabilities
- Automated dependency update PRs are generated by Dependabot
- All dependency changes undergo the standard code review process
- The dependency tree is minimized to reduce the attack surface

### 12. Code Signing Infrastructure

MF+SO's code signing infrastructure is designed for maximum security:

- **Release signing key:** A 4096-bit RSA key stored on a hardware security module (HSM). The key is generated on the HSM and never exists in software form. Two authorized maintainers must be physically present to use the key.
- **Code signing certificates:** Platform-specific code signing certificates (Apple Developer ID, Microsoft Authenticode, Java signing) are stored in separate HSMs with independent access controls.
- **Key ceremony:** Key generation, backup, and rotation procedures follow documented key ceremony protocols with multiple witnesses. Ceremonies are recorded on video and the recordings are stored securely.
- **Revocation:** In case of compromise, revocation procedures are documented and tested. Certificate transparency logs are monitored for unauthorized certificate issuance.
- **Expiration and renewal:** Certificates are renewed before expiration to ensure continuous signing capability. Renewal requires the same key ceremony process as initial generation.

### 13. Download and Installation Verification

Users can verify the integrity of their downloaded MF+SO installation through multiple methods depending on the distribution channel:

**Direct download from mfso.io:**
- Download the binary and the corresponding checksum file
- Import the MF+SO GPG public key: `gpg --recv-keys MFSO2026`
- Verify the checksum file signature: `gpg --verify mfso-1.2.3-checksums.txt.asc`
- Verify the binary checksum: `sha256sum -c mfso-1.2.3-checksums.txt`

**App Store downloads:**
- App Store downloads are signed by the platform vendor's signing infrastructure
- Additional verification can be performed using the reproducible build process
- Platform-specific verification tools (codesign on macOS, SignTool on Windows) can verify the embedded signature

**Package manager installations:**
- Linux packages (.deb, .rpm) include GPG signatures from the package repository
- The package repository signing key is published on the project website
- Package manager verification (apt --verify, rpm -K) checks these signatures automatically

**Chocolatey/Winget/Homebrew:**
- Package manifests are reviewed and approved by package maintainers
- Package installation scripts verify checksums before installation
- The package source is the official MF+SO release, not a third-party mirror

### 14. Building for Air-Gapped Environments

Organizations that deploy software in air-gapped or restricted network environments can build MF+SO without internet access:

1. **Export the source code:** Clone the repository to a portable medium on an internet-connected machine: `git clone --depth 1 --branch v1.2.3 https://github.com/lois-kleinner/mfso.git`
2. **Export the build container:** Save the build container image: `docker save ghcr.io/lois-kleinner/mfso-builder:latest -o mfso-builder.tar`
3. **Export dependencies:** Pre-fetch all dependency caches: `cargo vendor` and `dart pub cache repair`
4. **Transfer to air-gapped environment:** Copy the source code, container image, and dependency cache to the air-gapped machine
5. **Load the container:** `docker load -i mfso-builder.tar`
6. **Build:** Run the build script with the offline flag: `./scripts/build.sh --offline --platform linux/amd64`

The build manifest for the release specifies the exact dependency versions and container images needed, making the air-gapped build process deterministic.

### 15. Source Code for Specific Compliance Requirements

Different regulatory frameworks impose different requirements on source code access and verification:

**FIPS 140-3 compliance:** Organizations that require FIPS 140-3 validated cryptography can build MF+SO with the FIPS mode enabled. The FIPS mode uses the OpenSSL FIPS Object Module for cryptographic operations. The source code for the FIPS integration is in the repository, and the OpenSSL FIPS module is included as a build dependency.

**Section 508 / WCAG accessibility:** The source code includes accessibility features and compliance with WCAG 2.1 AA standards. Organizations can review the accessibility implementation in the source code and modify it to meet additional requirements.

**FedRAMP equivalence:** While MF+SO is not a cloud service and therefore not subject to FedRAMP, organizations using MF+SO in FedRAMP-authorized environments can review the source code to verify that it meets their security requirements.

**State-specific data protection laws:** The source code's data handling practices can be reviewed against the requirements of state-specific data protection laws (CCPA, CPA, VCDPA, etc.).

### 16. Git History and Forensic Analysis

The complete Git history of the MF+SO repository provides a forensic record of all changes to the codebase:

- Every commit is signed with the author's GPG key, providing cryptographic proof of authorship
- Every commit references the issue or pull request that motivated the change
- The commit history shows who reviewed and approved each change
- The commit timestamps provide a chronological record of the project's development
- Git bisect can be used to identify exactly which commit introduced a bug or vulnerability

Security researchers and forensic analysts can use the Git history to:
- Trace the evolution of security-critical code over time
- Identify when specific vulnerabilities were introduced
- Verify that security fixes were properly reviewed and tested
- Assess the project's responsiveness to security issues
- Evaluate the quality and consistency of the development process

The Git history is immutable (with normal use) and provides a tamper-evident record of the project's development. Any attempt to rewrite history would be detectable through comparison with the repository mirrors and archived copies.

### 17. Source Code Availability for Automated Tools

MF+SO's source code is structured to support automated analysis tools:

**API documentation generation:** The source code includes documentation comments that are used to generate API documentation. The documentation generation process is part of the build pipeline: `make docs`.

**Code quality metrics:** The build pipeline generates code quality metrics including: test coverage percentage, cyclomatic complexity, dependency count, and documentation coverage. These metrics are published with each release.

**Automated security scanning:** The repository includes configuration for automated security scanning tools (CodeQL, Semgrep, Trivy). Organizations can run the same scanning tools on their own copies of the source code.

**Dependency analysis:** The SBOM generation is fully automated and runs as part of the build pipeline. The SBOM is available in SPDX and CycloneDX formats and can be ingested by any SBOM-compatible tool.

**License compliance checking:** Automated license compliance checking runs on every pull request. The results are published in the PR checks. Organizations can use the same tools to verify license compliance in their own use of MF+SO.

### 18. Source Code and the Development Lifecycle

MF+SO follows a defined development lifecycle that ensures source code quality and security:

**Planning phase:**
- Features and fixes are proposed as issues in the GitHub issue tracker
- Issues are triaged and prioritized by the development team
- Major features require a design document that is reviewed by the TSC
- Security-relevant changes are labeled with the "security" tag

**Development phase:**
- Changes are developed on feature branches
- Development follows the coding standards documented in CONTRIBUTING.md
- Security-critical changes follow the secure coding checklist
- Changes include tests (unit tests for all changes, integration tests for feature changes)

**Review phase:**
- All changes require code review (at least one reviewer, two for security code)
- Automated checks must pass before merging
- Reviewers verify: correctness, security, performance, style, test coverage
- Review feedback is addressed through additional commits

**Release phase:**
- Releases are tagged with signed semantic version tags
- Release notes are generated from the commit history
- The build pipeline produces reproducible builds
- The SBOM, build manifest, and verification files are published with the release

**Maintenance phase:**
- Security patches are backported to supported release branches
- Long-term support (LTS) releases receive security updates for 18 months
- Deprecated features are marked with advance notice

This lifecycle ensures that every change to the source code is planned, reviewed, tested, and documented. Users can trace any feature or fix back to its originating issue and review the full discussion and decision-making process.
### 19. Source Code Licensing FAQ

**Can I use MF+SO source code in my commercial product?**
Yes, the Apache 2.0 license explicitly permits use in commercial products. You may incorporate MF+SO code into your product without releasing your product's source code.

**Do I need to include the license text?**
Yes, the Apache 2.0 license requires that you retain all copyright notices and the license text in any copies or substantial portions of the software.

**What if I modify the code?**
You must include a notice stating that you modified the files, along with the date of modification. This is required by Section 4 of the Apache 2.0 license.

**Can I relicense MF+SO code?**
You cannot change the license for MF+SO code itself. However, you can sublicense your own additions under a different license, as long as the MF+SO code remains under Apache 2.0.

**Does MF+SO require a CLA?**
No, MF+SO does not require a Contributor License Agreement. Contributors retain ownership of their contributions but grant the project a perpetual license through the inbound=outbound policy.

### 20. Source Code Verification for Package Managers

Package maintainers who distribute MF+SO through package managers should follow these verification steps:

1. Download the source tarball from the GitHub release page
2. Verify the GPG signature on the release tag
3. Verify the SHA-256 checksum of the tarball
4. Build the software using the official Docker build container
5. Verify that the built binary matches the official release checksum
6. If verification passes, proceed with packaging
7. If verification fails, investigate the discrepancy before distributing

Package maintainers are encouraged to publish their verification results to the transparency log to provide additional assurance to users.
### 21. Source Code Metrics and Quality

MF+SO tracks source code quality metrics to ensure maintainability and auditability:

| Metric | Current Value | Target |
|--------|--------------|--------|
| Lines of code (Rust) | 15,234 | N/A |
| Lines of code (Dart) | 28,456 | N/A |
| Lines of code (tests) | 12,847 | N/A |
| Test coverage | 94.2% | > 90% |
| Documentation coverage | 92% | > 90% |
| Cyclomatic complexity | 2.1 avg | < 5 avg |
| Dependency count | 42 direct, 156 transitive | Minimal |
| Security audit findings | 0 critical, 0 high open | 0 |

These metrics are published with each release and tracked over time to ensure the codebase remains maintainable and auditable.

### 22. Source Code and Academic Research

MF+SO's open-source codebase supports academic research in authentication security:

- Researchers can reproduce experiments exactly using tagged releases
- The reproducible build process ensures that research results can be verified
- The complete development history is available for longitudinal studies
- Security researchers can analyze vulnerability patterns over time
- Usability researchers can study the application's design and user interface

MF+SO actively collaborates with academic researchers and provides access to code, documentation, and (where appropriate) anonymized data for research purposes.
### 23. Final Note

Source code availability is the foundation of MF+SO's security model. By publishing all source code under a permissive license, providing reproducible builds, maintaining multiple mirrors, and making long-term availability commitments, MF+SO enables the independent verification that security-critical software demands. The source code is not a black box - it is an open book, and we invite the world to read it.
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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
