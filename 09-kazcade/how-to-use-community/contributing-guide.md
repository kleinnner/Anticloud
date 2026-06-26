<!--
  __   ___                      __                        __                     
  ¦¦  ¦¦¯                       ¦¦                        ¦¦                     
  ___¦  ¦¦_¦¦      _¦¦¦¦¦_  ¦¦¦¦¦¦¦¦  ¦¦ _¦¦¯    _¦¦¦¦¦_   _¦¦¦_¦¦   _¦¦¦¦_   ¦___     
  __¦¯¯¯    ¦¦¦¦¦      ¯ ___¦¦      _¦¯   ¦¦_¦¦      ¯ ___¦¦  ¦¦¯  ¯¦¦  ¦¦____¦¦    ¯¯¯¦__ 
  ¯¯¦___    ¦¦  ¦¦_   _¦¦¯¯¯¦¦    _¦¯     ¦¦¯¦¦_    _¦¦¯¯¯¦¦  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯    ___¦¯¯ 
      ¯¯¯¦  ¦¦   ¦¦_  ¦¦___¦¦¦  _¦¦_____  ¦¦  ¯¦_   ¦¦___¦¦¦  ¯¦¦__¦¦¦  ¯¦¦____¦  ¦¯¯¯     
           ¯¯    ¯¯   ¯¯¯¯ ¯¯  ¯¯¯¯¯¯¯¯  ¯¯   ¯¯¯   ¯¯¯¯ ¯¯    ¯¯¯ ¯¯    ¯¯¯¯¯
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Contributing Guide

This guide covers the process for contributing code, documentation, or benchmarks to the Kazkade project.

## Quick Start

```bash
# Fork and clone
git clone https://github.com/your-username/kazcade
cd kazkade

# Build
cargo build --release

# Run tests
cargo test --release

# Run linting
cargo clippy --all-targets -- -D warnings
```

## Contribution Workflow

```
+----------+    +----------+    +----------+    +----------+
¦ Fork     ¦--->¦ Branch   ¦--->¦ Commit   ¦--->¦ Push     ¦
¦ repo     ¦    ¦ feature/ ¦    ¦ signed   ¦    ¦ to fork  ¦
+----------+    +----------+    +----------+    +----------+
                                          ¦
                                          ?
                                 +------------------+
                                 ¦ Open Pull Request¦
                                 ¦ (Draft ? Review) ¦
                                 +------------------+
                                          ¦
                                          ?
                                 +------------------+
                                 ¦ CI Checks Pass   ¦
                                 ¦ Clippy, Tests,   ¦
                                 ¦ Bench, Audit     ¦
                                 +------------------+
                                          ¦
                                          ?
                                 +------------------+
                                 ¦ Maintainer       ¦
                                 ¦ Review & Merge   ¦
                                 +------------------+
```

## PR Workflow

### 1. Fork & Branch

```bash
git checkout -b feature/my-feature
```

Branch naming:

- `feature/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation
- `bench/` — Benchmark contributions
- `perf/` — Performance improvements

### 2. Development

```bash
# Build
cargo build

# Run specific tests
cargo test -p kazcade-core

# Watch mode
cargo watch -x test
```

### 3. Commit

Commits must be signed with a GPG or SSH key:

```bash
git config commit.gpgsign true
git commit -S -m "feat: add AVX512 scatter/gather optimization"
```

Commit message convention:

```
<type>: <short description>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `perf`, `refactor`, `test`, `chore`

### 4. Pre-Push Checks

Run these before pushing:

```bash
# Full test suite
cargo test --release --all-features

# Clippy
cargo clippy --all-targets --all-features -- -D warnings

# Formatting
cargo fmt --check

# Self-test
./target/release/kazcade self-test

# Bench (quick)
./target/release/kazcade bench --quick
```

### 5. Open Pull Request

```yaml
# .github/PULL_REQUEST_TEMPLATE.md
---
name: Pull Request
about: Contribute to Kazkade
title: ''
labels: ''
assignees: ''

---

## Description
<!-- Describe the change -->

## Type
- [ ] Feature
- [ ] Bug fix
- [ ] Performance
- [ ] Documentation
- [ ] Benchmark

## Checklist
- [ ] Tests added/updated
- [ ] Docs updated
- [ ] Benchmarks recorded
- [ ] Signed commits
- [ ] Clippy clean
- [ ] Formatting clean

## Benchmarks
<!-- If applicable, include benchmark results -->
```

## CI Checks

Pull requests automatically run:

| Check | Tool | Description |
|-------|------|-------------|
| Build | `cargo build` | Compiles all targets |
| Tests | `cargo test` | Unit + integration tests |
| Lint | `cargo clippy` | Static analysis |
| Format | `cargo fmt` | Code formatting |
| Audit | `cargo audit` | Dependency vulnerabilities |
| Bench | `kazkade bench --quick` | Performance regression check |
| Docs | `cargo doc` | Documentation builds |

View CI status:

```bash
gh pr checks
```

## CLA Signing

All contributors must sign a Contributor License Agreement:

```bash
# Sign electronically
kazkade ledger cla-sign \
  --contributor "Your Name" \
  --email "your@email.com" \
  --key your-key.json

# Verify CLA status
kazkade ledger cla-status
```

The CLA is stored in the `.aioss` ledger and can be verified by anyone.

## Code Review Process

### Review Expectations

| Area | Reviewers | Turnaround |
|------|-----------|------------|
| Core runtime | 2 maintainers | 48 hours |
| SQL engine | 2 maintainers | 48 hours |
| Plugins | 1 maintainer | 24 hours |
| Documentation | 1 maintainer | 24 hours |
| Benchmarks | 1 maintainer | 24 hours |

### Review Checklist

Reviewers check:

- [ ] Correctness — does the code do what it claims?
- [ ] Safety — no unsafe code without justification
- [ ] Performance — no obvious regressions
- [ ] Testing — adequate coverage
- [ ] Documentation — API docs and usage examples
- [ ] Style — matches existing codebase conventions

## Development Environment

### Rust Toolchain

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Set toolchain
rustup toolchain install nightly
rustup default stable

# Components
rustup component add clippy rustfmt
```

### VS Code Setup

```json
{
  "rust-analyzer.checkOnSave.command": "clippy",
  "rust-analyzer.cargo.features": "all",
  "editor.formatOnSave": true
}
```

### Recommended Extensions

- `rust-lang.rust-analyzer`
- `tamasfe.even-better-toml`
- `vadimcn.vscode-lldb`
- `serayuzgur.crates`

## Documentation Contributions

Doc contributions are highly valued:

```bash
# Build docs locally
cargo doc --open

# Serve docs
python -m http.server 8000 --directory target/doc

# Edit markdown in docs/
```

Documentation standards:

- Clear, practical examples
- Code blocks with language tags
- Mermaid diagrams for architecture
- Tables for reference data
- Links to related guides

## Benchmark Contributions

```bash
# Run full bench suite
kazkade bench --record --sign your-key.json

# Export for PR
kazkade bench export --format json --output bench-results.json
```

Include in PR description:

```
## Benchmark Results

| Module    | Before | After  | Change |
|-----------|--------|--------|--------|
| scan_i64  | 1.2 GB/s | 1.4 GB/s | +16.7% |
| filter_eq | 890 MB/s | 920 MB/s | +3.4%  |
```

## Getting Help

| Resource | Location |
|----------|----------|
| GitHub Issues | https://github.com/kazcade/kazcade/issues |
| GitHub Discussions | https://github.com/kazcade/kazcade/discussions |
| Discord | https://discord.gg/kazcade |
| Matrix | #kazcade:matrix.org |

## Community Recognition

Contributors are recognized in:

- `CONTRIBUTORS.md` — All contributors
- Release notes — Major contributors called out
- Dashboard — Contributor badge on leaderboard

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

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