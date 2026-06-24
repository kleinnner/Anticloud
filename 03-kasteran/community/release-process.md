<!--
KASTERAN* — The Last Programming Language
© Lois-Kleinner & 0-1.gg 2026. All rights reserved.

 ▄▄   ▄▄▄                                           ▄     
 ██  ██▀                         ██              ▄▄ █ ▄▄  
 ██▄██      ▄█████▄  ▄▄█████▄  ███████    ▄████▄    ██▄████   ▄█████▄  ██▄████▄   █████   
 █████      ▀ ▄▄▄██  ██▄▄▄▄ ▀    ██      ██▄▄▄▄██   ██▀       ▀ ▄▄▄██  ██▀   ██  ▀▀ █ ▀▀  
 ██  ██▄   ▄██▀▀▀██   ▀▀▀▀██▄    ██      ██▀▀▀▀▀▀   ██       ▄██▀▀▀██  ██    ██     ▀     
 ██   ██▄  ██▄▄▄███  █▄▄▄▄▄██    ██▄▄▄   ▀██▄▄▄▄█   ██       ██▄▄▄███  ██    ██           
 ▀▀    ▀▀   ▀▀▀▀ ▀▀   ▀▀▀▀▀▀      ▀▀▀▀     ▀▀▀▀▀    ▀▀        ▀▀▀▀ ▀▀  ▀▀    ▀▀           
-->

# Kasteran* — Release Process
© Lois-Kleinner & 0-1.gg 2026

## Overview

The Kasteran* release process ensures that releases are well-tested, documented, and distributed reliably. This process covers versioning, changelog management, release candidates, and stable releases.

## Versioning

Kasteran* follows [Semantic Versioning 2.0.0](https://semver.org/):

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Pre-release Versions
```
1.0.0-alpha.1
1.0.0-beta.1
1.0.0-rc.1
```

## Release Types

### Nightly Builds
- Built every night from main branch
- For testing and early feedback
- Not recommended for production
- Published to package registries with `-nightly` tag

### Alpha Releases
- Major features complete
- Known bugs may exist
- For community testing and feedback
- Published to package registries

### Beta Releases
- Feature complete
- Major bugs resolved
- For wider testing and API stabilization
- Published to package registries

### Release Candidates (RC)
- Ready for release
- All planned features complete
- All known critical bugs fixed
- Final testing before stable release

### Stable Releases
- Production-ready
- Fully tested and documented
- Backward compatible (within major version)
- Published to all distribution channels

## Release Schedule

### Regular Releases
- **Minor releases**: Every 3 months
- **Patch releases**: As needed (typically every 2-4 weeks)
- **Major releases**: Every 12-18 months

### Release Timeline
```
Week 1: Feature freeze
Week 2: Alpha release
Week 3: Beta release
Week 4: Release candidate
Week 5: Stable release
```

## Changelog

The changelog follows [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

## [1.1.0] - 2026-06-19

### Added
- New feature description (#1234)
- Another new feature (#1235)

### Changed
- Existing feature improvement (#1236)

### Deprecated
- Feature to be removed in future (#1237)

### Removed
- Feature removed (#1238)

### Fixed
- Bug fix description (#1239)

### Security
- Security fix description (#1240)
```

## Release Workflow

### 1. Preparation
- Review all merged PRs for the release
- Ensure all issues are closed or deferred
- Verify CI/CD pipeline is green
- Update version numbers

### 2. Create Release Branch
```
git checkout -b release/1.1.0
```

### 3. Update Changelog
- Compile changelog from commit messages
- Review and edit for clarity
- Add release date

### 4. Build and Test
```
cargo build --release
cargo test --all
kasteran test examples
```

### 5. Create Release Artifacts
- Compile binaries for all platforms
- Generate checksums and signatures
- Create SBOM

### 6. Release Notes
Write comprehensive release notes:
- Summary of changes
- New features with examples
- Breaking changes with migration guide
- Deprecation notices
- Known issues

### 7. Publish
- Tag release: `git tag v1.1.0`
- Push tag: `git push origin v1.1.0`
- Publish to package registries
- Publish release on GitHub
- Update website and documentation

### 8. Announcement
- Blog post for major/minor releases
- Release notes on GitHub
- Social media announcement
- Community channels notification

## Release Verification

Each release is verified:
- **Deterministic build**: Binary matches source
- **Hash verification**: Checksums published
- **Signature verification**: GPG signed
- **SBOM verification**: Dependencies documented

## Conclusion

The Kasteran* release process ensures consistent, well-documented, and verified releases. Semantic versioning, changelog management, and release candidates provide predictability and reliability for users.
