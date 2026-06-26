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
Category: governance | ID: LIB-GOV-004

────────────────────────────────────────────────────────────────

# Release Process

## 1. Overview

This document defines the release process for the Libern project. Libern
follows semantic versioning (SemVer 2.0.0) for all releases. The release
process is designed to ensure quality, stability, and predictability for
users while allowing the project to move forward with new features and
improvements.

## 2. Versioning

### 2.1 Semantic Versioning

Libern uses MAJOR.MINOR.PATCH versioning:

- **MAJOR:** Incompatible API or data format changes (e.g., 2.0.0)
- **MINOR:** New features in a backward-compatible manner (e.g., 1.3.0)
- **PATCH:** Backward-compatible bug fixes (e.g., 1.2.1)

### 2.2 Pre-release Versions

Pre-release versions indicate that the software is not yet stable:

| Suffix | Meaning | Example |
|--------|---------|---------|
| -alpha.N | Early development, may be unstable | 1.0.0-alpha.1 |
| -beta.N | Feature-complete, testing needed | 1.0.0-beta.1 |
| -rc.N | Release candidate, final testing | 1.0.0-rc.1 |

### 2.3 Version Scope

Version numbers apply to:
- The Libern binary release
- The .aioss ledger format version
- The P2P protocol version
- The database schema version
- The API version (if applicable)

Breaking changes in any of these areas will increment the MAJOR version.

## 3. Release Cadence

### 3.1 Release Types

| Release Type | Frequency | Scope | Stability |
|-------------|-----------|-------|-----------|
| Major | ~12 months | Breaking changes | High (after beta) |
| Minor | ~4-6 weeks | New features | High |
| Patch | As needed | Bug fixes | Very high |
| Security | As needed | Security fixes | Critical |
| Pre-release | Before major/minor | Testing | Variable |

### 3.2 Release Schedule

Libern follows a time-based release schedule with feature-based flexibility:

- **Minor releases:** Every 4-6 weeks
- **Major releases:** Every 12 months (approximately)
- **Patch releases:** As needed, typically within days of a confirmed bug
- **Security releases:** Within 72 hours of a confirmed vulnerability

The release schedule is published in the project's roadmap and release
milestones on GitHub.

## 4. Release Process

### 4.1 Pre-Release Phase

For minor and major releases:

1. **Feature freeze (2 weeks before release):**
   - No new features accepted
   - Only bug fixes, documentation, and release preparation

2. **Beta phase (1 week):**
   - Beta builds published for testing
   - Community testing encouraged
   - Bug reports prioritized

3. **Release candidate phase (1 week):**
   - RC builds published
   - Only critical bug fixes accepted
   - Final testing and verification

### 4.2 Patch Release Process

1. Identify the bug and create a fix
2. Apply the fix to the current release branch
3. Backport to older supported versions if needed
4. Test the fix
5. Publish the patch release

### 4.3 Security Release Process

1. Receive and confirm the vulnerability report
2. Develop and test the fix privately
3. Prepare the security advisory
4. Publish the fix and advisory simultaneously
5. Backport to all supported versions

## 5. Branching Strategy

### 5.1 Branch Structure

```
main          ← Development branch (latest)
  ├─ release/v1.2.x    ← Release branch for v1.2 series
  ├─ release/v1.1.x    ← Release branch for v1.1 series
  └─ release/v1.0.x    ← Release branch for v1.0 series (maintenance)
```

### 5.2 Branch Policies

| Branch | Purpose | Base | Merge Policy |
|--------|---------|------|-------------|
| main | Active development | N/A | Squash merge from feature branches |
| release/vX.Y.x | Release stabilization | main | Cherry-pick from main |
| feature/* | Feature development | main | Squash merge to main |
| fix/* | Bug fixes | main or release/* | Squash merge |
| release/v* | Release branches | main | Created at feature freeze |

### 5.3 Version Support Policy

Libern supports:
- Current major version (latest MAJOR.minor.patch)
- Previous major version (security fixes only)
- Each major version is supported for 12 months after the next major release

## 6. Release Checklist

### 6.1 Pre-Release Checklist

- [ ] All planned features are implemented
- [ ] All tests pass (unit, integration, E2E)
- [ ] No known critical or high-severity bugs
- [ ] Documentation is updated
- [ ] Changelog is updated
- [ ] Release notes are drafted
- [ ] Version numbers are updated (Cargo.toml, package.json, etc.)
- [ ] Dependencies are updated and checked for vulnerabilities
- [ ] Performance benchmarks are within acceptable range
- [ ] Security audit is completed (for major releases)

### 6.2 Release Checklist

- [ ] Tag the release: `git tag -s v1.2.0`
- [ ] Build release binaries for all platforms
- [ ] Sign release binaries
- [ ] Verify binary checksums
- [ ] Upload to GitHub Releases
- [ ] Publish release notes and changelog
- [ ] Update documentation
- [ ] Publish to package managers (if applicable)
- [ ] Announce on community channels

### 6.3 Post-Release Checklist

- [ ] Monitor for issues in the first 48 hours
- [ ] Prepare hotfix patches if critical issues are found
- [ ] Update the roadmap
- [ ] Close release milestones
- [ ] Open next release milestone

## 7. Changelog

### 7.1 Changelog Format

The changelog follows the Keep a Changelog format:

```
# Changelog

## [1.2.0] - 2026-06-19

### Added
- New feature A
- New feature B

### Changed
- Performance improvement in X
- Updated dependency Y

### Fixed
- Bug fix for issue #123
- Security fix for CVE-2026-XXXX

### Deprecated
- Legacy feature Z (will be removed in 2.0)

### Removed
- Removed deprecated feature W

### Security
- Security fix for critical vulnerability (CVE-2026-XXXX)
```

### 7.2 Changelog Categories

| Category | Description |
|----------|-------------|
| Added | New features |
| Changed | Changes in existing functionality |
| Deprecated | Soon-to-be removed features |
| Removed | Previously deprecated features removed |
| Fixed | Bug fixes |
| Security | Vulnerability fixes |

### 7.3 Changelog Maintenance

- The changelog is maintained in `CHANGELOG.md`
- Entries are added as pull requests are merged (not retroactively)
- Each release has a clearly defined section with the version and date
- Unreleased changes are listed under `[Unreleased]`

## 8. Release Artifacts

### 8.1 Binary Releases

Release binaries are provided for:
- **Windows:** x86_64, ARM64 (installer MSI, portable ZIP)
- **macOS:** x86_64, ARM64 (DMG, tar.gz)
- **Linux:** x86_64, ARM64 (AppImage, tar.gz, deb, rpm)

### 8.2 Binary Signing

All release binaries are signed:
- Windows: Authenticode signature
- macOS: Apple Developer ID signature (when available)
- Linux: GPG signature
- All: SHA-256 checksums published

### 8.3 Verification

Users can verify releases:
```bash
# Download the checksum file
wget https://github.com/libern/libern/releases/download/v1.2.0/checksums.txt

# Download the signature
wget https://github.com/libern/libern/releases/download/v1.2.0/checksums.txt.asc

# Verify the signature (requires the Libern GPG public key)
gpg --verify checksums.txt.asc checksums.txt

# Verify the binary
sha256sum libern-v1.2.0-x86_64-linux.tar.gz
# Compare with the checksum listed in checksums.txt
```

### 8.4 Software Bill of Materials (SBOM)

Each release includes an SBOM listing:
- All direct and transitive dependencies
- Dependency versions
- License information
- Known vulnerabilities (at time of release)

## 9. Release Management

### 9.1 Release Manager

Each release has a designated Release Manager responsible for:
- Managing the release timeline
- Coordinating the release team
- Making go/no-go decisions
- Publishing the release
- Post-release monitoring

### 9.2 Release Team

The release team includes:
- Release Manager (leads the process)
- QA Lead (testing coordination)
- Documentation Lead (docs updates)
- Security Lead (security review)
- Community Lead (announcements and coordination)

## 10. Emergency Releases

### 10.1 Hotfix Process

For critical bugs that cannot wait for the next scheduled release:
1. Create a hotfix branch from the latest release tag
2. Apply and test the fix
3. Create a patch release
4. Merge the fix back to main

### 10.2 Security Hotfix Process

For security vulnerabilities:
1. Private development of the fix
2. Coordinated disclosure (if applicable)
3. Emergency release with security advisory
4. Public disclosure after the release

### 10.3 Expedited Release Criteria

Emergency releases are justified for:
- Critical security vulnerabilities (CVSS 9.0+)
- Data loss bugs
- Complete application failure on a supported platform
- Regulatory compliance issues

## 11. Backward Compatibility

### 11.1 Compatibility Policy

- **Minor and patch releases:** Maintain backward compatibility for all
  public APIs, data formats, and protocols
- **Major releases:** May break backward compatibility with documented
  migration paths
- **Deprecation:** Features are deprecated in one minor release before
  removal in the next major release

### 11.2 Data Format Compatibility

- The .aioss ledger format is versioned
- Libern can read older format versions
- New format versions are only introduced in major releases

### 11.3 Protocol Compatibility

- P2P protocol version is negotiated during connection
- Peers with different minor versions can communicate
- Major version differences may prevent communication

## 12. Release Communication

### 12.1 Announcement Channels

Releases are announced on:
- GitHub Releases page
- Libern blog
- Community chat (Matrix, Discord)
- Social media (Twitter/Mastodon)
- Mailing list

### 12.2 Release Communication Checklist

- [ ] Release notes drafted and reviewed
- [ ] Migration guide prepared (if needed)
- [ ] Announcement drafted for each channel
- [ ] Social media graphics prepared (if needed)
- [ ] Release timing coordinated with community
- [ ] Security advisory prepared (if security fix)
- [ ] Post-release monitoring plan in place
- [ ] Rollback plan documented (if major release)

### 12.3 Release Notes

Release notes include:
- Summary of changes
- Changelog entries
- Known issues
- Upgrade instructions
- Download links
- Checksums

### 12.3 Migration Guides

Major releases include migration guides covering:
- Breaking changes
- Data migration steps
- Configuration migration
- Feature replacements
- Rollback procedures

## 13. Release Checklist Template

For each release, the Release Manager uses this checklist:

### Pre-Release (2 weeks before)
- [ ] Feature freeze announced
- [ ] All planned features completed
- [ ] Release branch created
- [ ] Version numbers updated in all files
- [ ] Changelog updated with unreleased changes

### Testing (1 week before)
- [ ] All tests pass
- [ ] Beta build published
- [ ] Beta testers notified
- [ ] Beta feedback collected and reviewed
- [ ] Regression testing complete

### Release Candidate (3 days before)
- [ ] RC build published
- [ ] Final testing complete
- [ ] Documentation updated
- [ ] Migration guide reviewed (if applicable)
- [ ] Security advisory prepared (if applicable)

### Release Day
- [ ] Final binaries built and signed
- [ ] Checksums generated and verified
- [ ] GitHub Release published
- [ ] Package managers updated
- [ ] Release notes published
- [ ] Announcement sent to all channels
- [ ] Monitoring dashboards verified

### Post-Release (24-48 hours)
- [ ] Critical bug monitoring active
- [ ] User feedback collection started
- [ ] Hotfix prepared if needed
- [ ] Release retrospective scheduled


## 15. Release Automation

### 15.1 CI/CD Pipeline

```
Developer Push
        │
        ▼
GitHub Actions Workflow
   ├─ Lint (cargo clippy, npm run lint)
   ├─ Test (cargo test, npm test)
   ├─ Security Scan (cargo audit, npm audit)
   ├─ Build (cargo build --release)
   │     ├─ Windows (x86_64, ARM64)
   │     ├─ macOS (x86_64, ARM64)
   │     └─ Linux (x86_64, ARM64)
   ├─ Sign (Ed25519 signature)
   ├─ Package (MSI, DMG, AppImage, tar.gz)
   └─ Publish (GitHub Releases)
```

### 15.2 Automated Testing Gates

| Gate | Tool | Requirement |
|------|------|-------------|
| Code style | cargo fmt, ESLint | Must pass |
| Static analysis | cargo clippy | Zero warnings |
| Unit tests | cargo test | 100% pass |
| Integration tests | cargo test --test | 100% pass |
| Security audit | cargo audit | Zero CVEs |
| Dependency scan | Dependabot | No critical findings |
| Binary size check | CI script | Within 5% of baseline |
| Performance check | CI benchmark | No regression > 10% |

### 15.3 Release Signing Automation

```yaml
# GitHub Actions release job
sign-release:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/download-artifact@v4
      with:
        name: release-binaries
    - name: Sign binaries
      run: |
        for binary in *.exe *.dmg *.AppImage *.tar.gz; do
          libern sign-binary \
            --binary "$binary" \
            --key <(echo "${{ secrets.RELEASE_SIGNING_KEY }}") \
            --output "$binary.sig"
        done
    - name: Generate checksums
      run: sha256sum *.{exe,dmg,AppImage,tar.gz} > SHA256SUMS
    - name: Sign checksums
      run: |
        gpg --batch --passphrase "${{ secrets.GPG_PASSPHRASE }}" \
          --output SHA256SUMS.sig --detach-sig SHA256SUMS
```

## 16. Release Testing Procedures

### 16.1 Manual Testing Checklist

```
□ Install on clean Windows 11 system
  □ MSI installer completes without error
  □ Application launches successfully
  □ First-run wizard works
  □ Can create account (Ed25519 key gen)
  □ Can create server
  □ Can send messages
  □ AI features functional
  □ Voice chat works
  □ Whiteboard functions
  □ Can export .aioss ledger
  □ Can verify .aioss integrity
  □ Can uninstall cleanly

□ Install on clean macOS system
  □ (Same checks as Windows)

□ Install on clean Linux system
  □ (Same checks as Windows)
```

### 16.2 Regression Testing

Run the full regression suite:
```bash
# Rust backend tests
cargo test --workspace

# Frontend tests
cd apps/desktop && npm test

# CRDT convergence tests
cargo test --test crdt_convergence

# AI engine tests
cargo test --test ai_engine

# Database migration tests
cargo test --test db_migration

# P2P protocol tests
cargo test --test p2p_handshake
```

## 17. Real-World Release Example

### 17.1 Version 1.2.0 Release Timeline

| Date | Activity | Responsible |
|------|----------|-------------|
| Jun 1 | Feature freeze announced | Release Manager |
| Jun 1-7 | Bug fix sprint | All maintainers |
| Jun 8 | Beta.1 published | Release Manager |
| Jun 8-14 | Beta testing period | Community |
| Jun 12 | Beta.2 (critical fix) | Release Manager |
| Jun 15 | RC.1 published | Release Manager |
| Jun 15-18 | Final testing | QA team |
| Jun 19 | v1.2.0 released | Release Manager |
| Jun 19-21 | Monitoring period | All maintainers |

### 17.2 Hotfix Example (v1.2.1)

| Date | Activity |
|------|----------|
| Jun 20 | Critical bug reported (issue #901) |
| Jun 20 | Bug confirmed: database migration fails on large datasets |
| Jun 20 | Fix developed and tested |
| Jun 20 | Fix merged to release/v1.2.x branch |
| Jun 21 | v1.2.1 published with advisory |
| Jun 21 | Community notified |


## 14. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-06-19 | Libern Team | Initial release process document |

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com