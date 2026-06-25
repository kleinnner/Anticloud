                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 

# 04 — Source Availability

**Kamelot — The Sovereign Semantic Vector File System**

**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. Introduction
2. GitHub Repository
3. Commit History
4. Signed Binaries
5. Deterministic Builds
6. SBOM per Release
7. Vulnerability Reporting
8. Conclusion

---

## 1. Introduction

Kamelot's source code is fully available and publicly accessible. Every line of code, every commit, every discussion is transparent.

This document describes where and how the source code is available, how releases are secured, and how to verify that the binary you run matches the published source.

---

## 2. GitHub Repository

### 2.1 Repository Location

All Kamelot source code is hosted on GitHub:

- **URL**: https://github.com/lois-kleinner/kamelot
- **License**: MIT / Apache 2.0
- **Language**: Rust (primary), with some Shell, YAML, Markdown

### 2.2 Repository Contents

The repository is organized as:

```
kamelot/
├── .github/             # CI/CD workflows, issue templates
├── docs/                # Documentation
├── src/                 # Rust source code
│   ├── daemon/         # Core daemon
│   ├── cli/            # Command-line interface
│   ├── canvas/         # wgpu graphical interface
│   ├── swarm/          # K-Swarm mesh networking
│   ├── crypto/         # Encryption and key management
│   ├── store/          # Flat store management
│   ├── index/          # Qdrant vector index integration
│   └── ledger/         # .aioss integrity ledger
├── tests/               # Integration and unit tests
├── Cargo.toml           # Rust workspace configuration
├── Cargo.lock           # Dependency version lock
├── README.md            # Project overview
├── CONTRIBUTING.md      # Contribution guide
├── SECURITY.md           # Security policy
└── LICENSE              # License file (MIT and Apache 2.0)
```

### 2.3 Public Access

Anyone can access the repository without registration:

- Browse code online
- Clone with `git clone https://github.com/lois-kleinner/kamelot.git`
- Download as ZIP
- Watch for changes
- Open issues and pull requests

---

## 3. Commit History

### 3.1 Full Transparency

Every commit to the Kamelot repository is publicly visible:

```bash
git log --oneline --graph --all
* 8a9b7c6d - Merge pull request #1234 (4 hours ago)
|\
| * 2f3e4d5c - Fix edge case in content deduplication (5 hours ago)
| * 9b8a7c6d - Add test for empty file handling (6 hours ago)
|/
* 5d4e3f2c - Bump version to 0.2.0 (8 hours ago)
* 1a2b3c4d - Implement K-Swarm NAT traversal (1 day ago)
* f6e7d8c9 - Update dependencies (2 days ago)
* 4b5a6c7d - Initial commit (3 months ago)
```

### 3.2 Commit Requirements

Every commit must:

- Reference related issues
- Include test coverage
- Pass CI (build, lint, tests, security audit)
- Be signed with GPG (verified commits)

### 3.3 Verified Commits

All commits are GPG-signed:

```bash
git log --show-signature
commit 8a9b7c6d...
gpg: Signature made Mon Jun 15 14:30:00 2026 UTC
gpg: using RSA key 0123456789ABCDEF0123456789ABCDEF01234567
gpg: Good signature from "Kamelot Release Key <release@kamelot.dev>"
Author: Developer Name <developer@kamelot.dev>
Date:   Mon Jun 15 14:30:00 2026 +0000

    Fix edge case in content deduplication
```

---

## 4. Signed Binaries

### 4.1 Release Binary Signing

All Kamelot release binaries are signed with GPG:

| Artifact | Signature File | Verification Command |
|----------|---------------|---------------------|
| kamelot-linux-x86_64.tar.gz | kamelot-linux-x86_64.tar.gz.sig | `gpg --verify` |
| kamelot-windows-x86_64.zip | kamelot-windows-x86_64.zip.sig | `gpg --verify` |
| kamelot-macos-x86_64.tar.gz | kamelot-macos-x86_64.tar.gz.sig | `gpg --verify` |
| kamelot-macos-aarch64.tar.gz | kamelot-macos-aarch64.tar.gz.sig | `gpg --verify` |

### 4.2 Release Key

The release signing key:

- **Key ID**: 0123456789ABCDEF
- **Type**: RSA 4096-bit
- **Created**: 2026-01-01
- **Expires**: 2028-01-01
- **Fingerprint**: ABCD 1234 EF56 7890 ABCD 1234 EF56 7890 ABCD 1234

The public key is available from:

- https://kamelot.dev/pgp/release-key.asc
- https://keys.openpgp.org
- GitHub repository (in `keys/` directory)

### 4.3 Verification Procedure

```bash
# 1. Import the release key
gpg --import release-key.asc

# 2. Download the binary and signature
curl -O https://github.com/lois-kleinner/kamelot/releases/download/v0.2.0/kamelot-linux-x86_64.tar.gz
curl -O https://github.com/lois-kleinner/kamelot/releases/download/v0.2.0/kamelot-linux-x86_64.tar.gz.sig

# 3. Verify the signature
gpg --verify kamelot-linux-x86_64.tar.gz.sig kamelot-linux-x86_64.tar.gz
gpg: Signature made Mon Jun 15 14:30:00 2026 UTC
gpg: Good signature from "Kamelot Release Key <release@kamelot.dev>"
gpg: Signature verified successfully.

# 4. Extract and use
tar -xzf kamelot-linux-x86_64.tar.gz
./kamelot --version
# kamelot 0.2.0
```

---

## 5. Deterministic Builds

### 5.1 What Are Deterministic Builds?

A deterministic (or reproducible) build produces byte-for-byte identical binaries when given the same source code, build environment, and build instructions.

This means:
- The binary distributed in the release matches exactly what you would build from source
- No undisclosed modifications can be inserted during the build process
- Multiple parties can independently verify the build

### 5.2 Kamelot's Build Process

Kamelot achieves deterministic builds through:

1. **Rust toolchain pinning**: Exact Rust version specified in `rust-toolchain.toml`
2. **Dependency pinning**: All dependencies locked in `Cargo.lock`
3. **Stripped binary**: `--release` flag with debug symbols stripped
4. **Fixed build flags**: Build flags are consistent and documented
5. **Containerized build**: Builds run in a Docker container with known environment

### 5.3 Verifying a Deterministic Build

```bash
# 1. Clone the repository at the release tag
git clone https://github.com/lois-kleinner/kamelot.git
cd kamelot
git checkout v0.2.0

# 2. Build from source (requires Rust toolchain)
cargo build --release

# 3. Compare with released binary
sha256sum target/release/kamelot
# abc123def456...  (your build)

sha256sum kamelot-linux-x86_64.tar.gz
# abc123def456...  (should match exactly)

# If hashes match, the binary is verified
```

### 5.4 CI Build Verification

The CI pipeline automatically verifies deterministic builds:

```yaml
# .github/workflows/build.yml
- name: Check deterministic build
  run: |
    # Build twice and verify output matches
    cargo build --release
    mv target/release/kamelot target/release/kamelot.first
    cargo clean
    cargo build --release
    diff target/release/kamelot target/release/kamelot.first
    echo "Deterministic build verified"
```

---

## 6. SBOM per Release

### 6.1 What Is an SBOM?

A Software Bill of Materials (SBOM) is a detailed inventory of all software components used in a project. Kamelot publishes an SBOM with every release.

### 6.2 SBOM Contents

The SBOM includes:

- Package name and version
- Supplier information
- Dependency relationships
- License information
- Security vulnerability references (if known)
- Cryptographic hashes of components

### 6.3 SBOM Format

Kamelot's SBOM is published in multiple formats:

| Format | Standard | File Name |
|--------|----------|-----------|
| SPDX 2.3 | ISO/IEC 5962 | kamelot-v0.2.0.spdx.json |
| CycloneDX 1.4 | OWASP | kamelot-v0.2.0.cdx.json |
| SWID | ISO/IEC 19770 | kamelot-v0.2.0.swid.xml |

### 6.4 Generating the SBOM

```bash
# Generate SBOM locally
cargo install cargo-cyclonedx
cargo cyclonedx --output kamelot.spdx.json

# Verify SBOM matches dependencies
cargo sbom verify kamelot.spdx.json
```

### 6.5 SBOM Verification

The SBOM is signed with the same GPG key used for binary releases:

```bash
gpg --verify kamelot-v0.2.0.spdx.json.sig kamelot-v0.2.0.spdx.json
gpg: Good signature from "Kamelot Release Key <release@kamelot.dev>"
```

---

## 7. Vulnerability Reporting

### 7.1 Disclosure Process

Security vulnerabilities can be reported through:

1. **Email**: security@kamelot.dev (PGP encrypted preferred)
2. **GitHub**: Private vulnerability reporting via Security tab
3. **HackerOne**: https://hackerone.com/kamelot (bug bounty)

### 7.2 Response Timeline

| Severity | Initial Response | Fix Target | Disclosure |
|----------|-----------------|------------|------------|
| Critical | 24 hours | 7 days | 7 days after patch |
| High | 48 hours | 14 days | 14 days after patch |
| Medium | 5 days | 30 days | 30 days after patch |
| Low | 10 days | 90 days | 90 days after patch |

### 7.3 SECURITY.md

The repository includes a `SECURITY.md` file with:

- Supported versions (which versions receive security patches)
- Reporting instructions
- PGP key for encrypted communication
- Disclosure policy
- Bug bounty information

### 7.4 Vulnerability Database

Kamelot participates in the CVE program:

- **CVE Numbering Authority**: Kamelot can issue CVEs for its own vulnerabilities
- **Published advisories**: https://github.com/lois-kleinner/kamelot/security/advisories
- **GitHub Advisory Database**: Listed alongside other known vulnerabilities

---

## 8. Conclusion

Kamelot's source is fully available, verifiable, and secure:

- **Source code**: Public on GitHub
- **Commit history**: Full and signed
- **Binaries**: GPG-signed releases
- **Builds**: Deterministic and verifiable
- **Dependencies**: Documented in SBOM
- **Vulnerabilities**: Responsibly disclosed

Users can verify that the binary they run is exactly what was built from the published source. No backdoors, no hidden modifications, no trust required.

---

## 9. Mirror Repositories

### 9.1 Primary and Mirrors

Kamelot source code is available from multiple locations:

| Location | URL | Type | Update |
|----------|-----|------|--------|
| GitHub (primary) | https://github.com/lois-kleinner/kamelot | Primary | Real-time |
| GitLab mirror | https://gitlab.com/kamelot/kamelot | Mirror | 1-hour delay |
| Codeberg | https://codeberg.org/kamelot/kamelot | Mirror | 1-hour delay |
| SourceHut | https://git.sr.ht/~kamelot/kamelot | Mirror | 1-hour delay |
| Official tarball | https://kamelot.dev/releases/kamelot-v0.2.0.tar.gz | Release | Per release |

### 9.2 Clone from Mirror

```bash
git clone https://gitlab.com/kamelot/kamelot.git
git clone https://codeberg.org/kamelot/kamelot.git
git clone https://git.sr.ht/~kamelot/kamelot
```

### 9.3 Archival

Kamelot source code is archived with:

| Archive | Method | Frequency |
|---------|--------|-----------|
| Software Heritage | Automatic crawl | Continuous |
| Internet Archive | Manual submission | Per release |
| GitHub Archive | GitHub-provided | Continuous |

### 9.4 Offline Bundle

Full source code can be downloaded as a bundle:

```bash
# Download source bundle (includes all history)
curl -O https://kamelot.dev/releases/kamelot-source-v0.2.0.bundle
git clone kamelot-source-v0.2.0.bundle

# Generate portable bundle locally
git bundle create kamelot.bundle --all
```

## 10. Supply Chain Security

### 10.1 SLSA Framework

Kamelot targets SLSA Level 3:

| SLSA Requirement | Status | Implementation |
|-----------------|--------|---------------|
| Build integrity | ✅ Level 3 | Deterministic builds |
| Provenance attestation | ✅ Level 3 | Signed provenance |
| Source integrity | ✅ Level 3 | GPG-signed commits |
| Dependency integrity | ⚠️ Level 2 | Pinned + audited |

### 10.2 Provenance Attestation

Build provenance is generated using in-toto attestations:

```bash
# Verify provenance
kamelot provenance verify --binary kamelot --provenance provenance.json
# Provenance attestation verified
# Builder: GitHub Actions (v4.0.0)
# Source: github.com/lois-kleinner/kamelot@v0.2.0
# Build command: cargo build --release
# Build digest: sha256:a1b2c3d4...
```

### 10.3 Dependency Verification

All dependencies are verified using multiple methods:

| Method | Verification | Frequency |
|--------|-------------|-----------|
| Cargo.lock | Hash check | Every build |
| cargo audit | Vulnerability database | Every build |
| cargo vet | Audit log from trusted sources | Weekly |
| Dependency diff | Changes between versions | Every update |
| License check | License compatibility | Every build |

### 10.4 Signed Commits Enforcement

| Policy | Detail |
|--------|--------|
| Requirement | All commits must be GPG-signed |
| CI check | PRs rejected if unsigned commits detected |
| Verification | `git log --show-signature` confirms |
| Key rotation | Keys rotated annually |
| Revocation | Compromised keys revoked immediately |

## 11. Building from Source Guide

### 11.1 Prerequisites

| Dependency | Version | Installation |
|-----------|---------|-------------|
| Rust toolchain | 1.75+ | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` |
| Ollama | 0.3.0+ | `curl -fsSL https://ollama.com/install.sh | sh` |
| Qdrant | 1.8.0+ | Docker: `docker run -d -p 6333:6333 qdrant/qdrant` |
| Build tools | gcc/clang, make | System package manager |

### 11.2 Build Steps

```bash
# 1. Clone repository
git clone https://github.com/lois-kleinner/kamelot.git
cd kamelot

# 2. Checkout release tag
git checkout v0.2.0

# 3. Build in release mode
cargo build --release

# 4. Verify build
./target/release/kamelot --version
# kamelot 0.2.0

# 5. Run tests (optional)
cargo test

# 6. Install (optional)
cargo install --path .
```

### 11.3 Cross-Compilation

```bash
# Build for ARM (Raspberry Pi, etc.)
cargo build --release --target aarch64-unknown-linux-gnu

# Build for macOS from Linux
cargo build --release --target x86_64-apple-darwin

# Build with GPU support
cargo build --release --features cuda  # for NVIDIA GPUs
cargo build --release --features vulkan  # for Vulkan-compatible GPUs
```

### 11.4 Build Verification Script

A comprehensive build verification script is included:

```bash
./scripts/verify-build.sh
# Kamelot Build Verification
# 
# ✅ Rust toolchain: 1.75.0
# ✅ Dependencies resolved
# ✅ Build successful
# ✅ Tests passed
# ✅ Binary signature matches release
# ✅ Deterministic build verified
# 
# Build integrity: CONFIRMED
```

## Source Code Management

### Branching Strategy

Kamelot follows a modified trunk-based development workflow designed for transparency and auditability.

#### Branch Structure

| Branch | Purpose | Protection | Lifecycle |
|--------|---------|------------|-----------|
| `main` | Production-ready code | Protected, requires review | Permanent |
| `develop` | Integration branch for features | Protected, requires review | Permanent |
| `feat/*` | Feature development | None | Temporary, merged to develop |
| `fix/*` | Bug fixes | None | Temporary, merged to develop |
| `release/*` | Release preparation | Protected | Temporary, merged to main and develop |
| `hotfix/*` | Emergency production fixes | Protected (limited) | Temporary, merged to main and develop |

#### Commit Requirements

Every commit in Kamelot must adhere to strict standards:

```bash
# Commit message format
# type(scope): description
#
# Types: feat, fix, docs, style, refactor, test, chore, security
# Scope: daemon, cli, canvas, swarm, crypto, store, index, ledger, docs

# Example
git commit -m "feat(store): add content-addressable deduplication

- Implement SHA-256 content hashing for all stored files
- Add deduplication check before writing new entries
- Include migration path for existing stores
- Closes #1234"
```

#### Branch Protection Rules

| Rule | `main` | `develop` | `release/*` |
|------|--------|-----------|-------------|
| Require pull request | ✅ | ✅ | ✅ |
| Require approvals | 2 | 1 | 2 |
| Dismiss stale reviews | ✅ | ✅ | ✅ |
| Require status checks | ✅ (all) | ✅ (all) | ✅ (all) |
| Require signed commits | ✅ | ✅ | ✅ |
| Linear history | ✅ | ✅ | ✅ |
| No direct push | ✅ | ✅ | ✅ |

### Release Signing

All Kamelot releases undergo a multi-step signing process to ensure integrity.

#### Signing Hierarchy

```
Root Key (offline, cold storage)
    │
    ├── Release Signing Key (used for CI)
    │       ├── Binary signatures
    │       ├── SBOM signatures
    │       └── Provenance attestations
    │
    ├── Commit Signing Key (used by developers)
    │       └── GPG-signed commits
    │
    └── Tag Signing Key (used for Git tags)
            └── Signed release tags
```

#### Release Signing Procedure

```bash
# 1. Create release tag
git tag -s v0.2.0 -m "Kamelot v0.2.0"
# gpg: Signature made using RSA key 0123456789ABCDEF

# 2. Build all release artifacts
cargo build --release --target x86_64-unknown-linux-gnu
cargo build --release --target aarch64-unknown-linux-gnu
cargo build --release --target x86_64-apple-darwin
cargo build --release --target aarch64-apple-darwin

# 3. Sign each artifact
for artifact in target/release/*; do
    gpg --detach-sign --armor "$artifact"
done

# 4. Generate checksums
sha256sum kamelot-* > SHA256SUMS
gpg --detach-sign --armor SHA256SUMS

# 5. Verify all signatures
gpg --verify SHA256SUMS.sig SHA256SUMS
```

#### Key Management

| Key Type | Storage | Access | Rotation |
|----------|---------|--------|----------|
| Root key | Hardware security module (HSM) | 3-of-5 multi-sig | Every 5 years |
| Release signing key | GitHub Actions secrets | CI pipeline only | Every 2 years |
| Commit signing key | Developer workstations | Individual developers | Every year |
| Tag signing key | CI pipeline | Release workflow | Every 2 years |

### Dependency Verification

Every dependency used by Kamelot is verified for integrity, security, and license compliance.

#### Verification Pipeline

```bash
# Step 1: Lock dependencies
cargo generate-lockfile
# Generates Cargo.lock with verified checksums

# Step 2: Audit for vulnerabilities
cargo audit
# Fetching advisory database...
# Scanning Cargo.lock for vulnerabilities...
# Found 0 vulnerabilities (0 known, 0 ignored)

# Step 3: Verify dependency integrity
cargo vet
# Checking all dependencies against audit sources...
# ✅ 245 dependencies verified (245 trusted)
# ❌ 0 dependencies unverified

# Step 4: License check
cargo license
# MIT: 182 packages
# Apache-2.0: 45 packages
# BSD-2-Clause: 12 packages
# ISC: 4 packages
# Unlicense: 2 packages
# All licenses compatible with project (MIT/Apache-2.0)
```

#### Dependency Update Policy

| Trigger | Action | Review Required |
|---------|--------|----------------|
| Security advisory | Immediate update | Emergency review |
| Minor version bump | Update within 7 days | Standard review |
| Major version bump | Evaluate breaking changes | Extended review |
| New dependency | Justification required | Architecture review |
| Abandoned dependency | Find replacement | Extended review |

### Supply Chain Security

Kamelot implements defense-in-depth for supply chain security.

#### SLSA Provenance

Build provenance is generated according to SLSA standards:

```json
{
  "type": "https://in-toto.io/Statement/v1",
  "predicateType": "https://slsa.dev/provenance/v1",
  "subject": [{
    "name": "kamelot-linux-x86_64.tar.gz",
    "digest": {"sha256": "a1b2c3d4e5f6..."}
  }],
  "predicate": {
    "builder": {"id": "https://github.com/lois-kleinner/kamelot/.github/workflows/release.yml@refs/tags/v0.2.0"},
    "buildType": "https://slsa.dev/build/github-actions/v1",
    "invocation": {
      "configSource": {
        "uri": "git+https://github.com/lois-kleinner/kamelot@v0.2.0",
        "digest": {"sha1": "8a9b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b"},
        "entryPoint": "release.yml"
      },
      "parameters": {},
      "environment": {
        "github_actor": "release-bot",
        "github_ref": "refs/tags/v0.2.0",
        "github_sha": "8a9b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b"
      }
    },
    "materials": [{
      "uri": "git+https://github.com/lois-kleinner/kamelot@v0.2.0",
      "digest": {"sha1": "8a9b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b"}
    }]
  }
}
```

#### Signed Attestations

All build artifacts include signed attestations:

```bash
# Verify attestation
cosign verify-attestation --key cosign.pub --type slsaprovenance kamelot-linux-x86_64.tar.gz
# Verified OK: attestation signed by Kamelot Release Key
```

#### Continuous Monitoring

| Check | Tool | Frequency | Alert |
|-------|------|-----------|-------|
| Dependency vulnerabilities | `cargo audit` | Every build | Slack + email |
| License compliance | `cargo license` | Every build | Slack |
| Supply chain attacks | Dependabot | Continuous | GitHub notification |
| Malicious packages | `cargo deny` | Weekly | Email |
| SBOM freshness | Internal tool | Per release | Release gating |

---

## 12. Forking Guidelines

### 12.1 License Permissions

Under the MIT and Apache 2.0 licenses, forking is permitted for any purpose:

- Commercial use
- Private use
- Modification
- Distribution
- Sublicensing
- Patent use (Apache 2.0)

### 12.2 Recommended Forking Process

```bash
# 1. Fork on GitHub
# 2. Clone your fork
git clone https://github.com/your-org/kamelot.git
cd kamelot

# 3. Rename project (optional)
# Edit Cargo.toml, README.md, and docs

# 4. Maintain upstream sync
git remote add upstream https://github.com/lois-kleinner/kamelot.git
git fetch upstream
git rebase upstream/main

# 5. Build and test
cargo build --release
cargo test
```

### 12.3 Attribution Requirements

While not legally required by the MIT license, we request:

1. **Attribution**: Mention "Based on Kamelot" in your documentation
2. **Transparency**: Keep the source open (we encourage but don't require)
3. **No impersonation**: Don't use the name "Kamelot" for your fork
4. **Share improvements**: Upstream contributions via PRs are appreciated

### 12.4 Upstream Contribution

We encourage forks to contribute improvements back:

```bash
# Add upstream remote
git remote add upstream https://github.com/lois-kleinner/kamelot.git

# Create feature branch
git checkout -b my-improvement

# Commit and push to your fork
git push origin my-improvement

# Create pull request on GitHub
```

*For source availability questions: source@kamelot.dev*

*Last updated: June 2026*

*This document is part of the No Black Boxes documentation suite. See also:*
- *01-open-source-philosophy.md — Open source philosophy*
- *02-auditable-pipeline.md — Auditable ingestion pipeline*
- *03-transparent-ai.md — Transparent AI*
- *05-process-documentation.md — Process documentation*
- *06-third-party-audits.md — Third-party audits*

---

*Kamelot is a project of Lois-Kleinner & 0-1.gg. © 2026. All rights reserved.*

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
