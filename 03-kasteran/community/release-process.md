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