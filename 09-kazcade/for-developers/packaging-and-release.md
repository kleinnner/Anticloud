<!--
  ▄▄   ▄▄▄                      ▄▄                        ▄▄                     
  ██  ██▀                       ██                        ██                     
  ▄▄▄█  ██▄██      ▄█████▄  ████████  ██ ▄██▀    ▄█████▄   ▄███▄██   ▄████▄   █▄▄▄     
  ▄▄█▀▀▀    █████      ▀ ▄▄▄██      ▄█▀   ██▄██      ▀ ▄▄▄██  ██▀  ▀██  ██▄▄▄▄██    ▀▀▀█▄▄ 
  ▀▀█▄▄▄    ██  ██▄   ▄██▀▀▀██    ▄█▀     ██▀██▄    ▄██▀▀▀██  ██    ██  ██▀▀▀▀▀▀    ▄▄▄█▀▀ 
      ▀▀▀█  ██   ██▄  ██▄▄▄███  ▄██▄▄▄▄▄  ██  ▀█▄   ██▄▄▄███  ▀██▄▄███  ▀██▄▄▄▄█  █▀▀▀     
           ▀▀    ▀▀   ▀▀▀▀ ▀▀  ▀▀▀▀▀▀▀▀  ▀▀   ▀▀▀   ▀▀▀▀ ▀▀    ▀▀▀ ▀▀    ▀▀▀▀▀
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Packaging and Release

This guide covers the build process, cross-compilation, CI pipeline setup, versioning, and release checklist for Kazkade.

## Build Process

Kazkade is a single crate. The standard build commands:

```bash
# Development build (fast, unoptimized)
cargo build

# Release build (LTO, fat LTO, codegen-units=1, stripped symbols)
cargo build --release

# Run tests
cargo test

# Run benchmarks
cargo run --release -- bench --size 512
```

The release profile in `Cargo.toml` is:

```toml
[profile.release]
lto = "fat"
codegen-units = 1
opt-level = 3
strip = "symbols"
```

## Cross-Compilation

### Prerequisites

Install cross-compilation targets:

```bash
# For aarch64 (ARM 64-bit)
rustup target add aarch64-unknown-linux-gnu
sudo apt install gcc-aarch64-linux-gnu   # or equivalent for your distro

# For x86_64 (if on ARM)
rustup target add x86_64-unknown-linux-gnu
sudo apt install gcc-x86-64-linux-gnu
```

### Cross-Compile

```bash
# Build for aarch64 Linux
CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc \
    cargo build --release --target aarch64-unknown-linux-gnu

# Build for x86_64 Windows (cross from Linux)
rustup target add x86_64-pc-windows-gnu
cargo build --release --target x86_64-pc-windows-gnu

# Build for macOS (requires macOS host)
cargo build --release --target x86_64-apple-darwin
cargo build --release --target aarch64-apple-darwin
```

### Conditional Compilation

The codebase uses `#[cfg(target_arch = "x86_64")]` and `#[cfg(target_arch = "aarch64")]` for SIMD modules. Platform-specific dependencies are in `Cargo.toml`:

```toml
[target.'cfg(windows)'.dependencies]
windows-sys = { version = "0.59", features = [...] }

[target.'cfg(unix)'.dependencies]
libc = "0.2"

[target.'cfg(target_os = "linux")'.dependencies]
io-uring = "0.6"
```

## CI Pipeline

There is no `.github/workflows/ci.yml` file yet in the repository. Below is the recommended CI configuration for GitHub Actions:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}

    steps:
    - uses: actions/checkout@v4
    - uses: actions-rust-lang/setup-rust-toolchain@v1

    - name: Build
      run: cargo build --release

    - name: Run tests
      run: cargo test

    - name: Run benchmarks
      run: cargo run --release -- bench --size 256

  cross:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions-rust-lang/setup-rust-toolchain@v1
    - name: Install cross
      run: cargo install cross
    - name: Cross-compile aarch64
      run: cross build --release --target aarch64-unknown-linux-gnu
```

## Version Bumping

The version is in `Cargo.toml`:

```toml
[package]
name = "kazkade"
version = "1.0.0"
```

Kazkade follows **Semantic Versioning**:

- **Major**: Breaking changes to public API or .acol/.aioss file formats
- **Minor**: New features, SIMD kernels, compression codecs, backward-compatible additions
- **Patch**: Bug fixes, performance improvements, documentation

Bump the version with:

```bash
# Manual edit, or use cargo-edit:
cargo install cargo-edit
cargo set-version 1.1.0
```

## Changelog

Maintain a `CHANGELOG.md` in the repo root following the format:

```markdown
# Changelog

## [1.1.0] - 2026-06-18

### Added
- New U64 column data type support
- Tanh SIMD kernel (AVX2 + NEON)
- ZRLE compression codec for sparse columns

### Changed
- Improved GEMM auto-tuner: now tests 16 configs
- Dashboard: added Benchmarks tab

### Fixed
- RLE decompression off-by-one for large runs
- NEON softmax NaN on all-zero input

## [1.0.0] - 2026-06-14

### Added
- Initial release: SIMD GEMM, columnar storage, rasterizer, dashboard, aioss ledger
```

## Release Checklist

Before cutting a release, complete each step:

1. **Run full test suite**:
   ```bash
   cargo test --all-features
   ```

2. **Run benchmarks** (verify no regression):
   ```bash
   cargo run --release -- bench --size 512
   ```

3. **Verify platform builds**:
   ```bash
   cargo build --release  # native
   # Cross-compile test (if CI available)
   ```

4. **Check documentation builds**:
   ```bash
   cargo doc --no-deps
   ```

5. **Bump version** in `Cargo.toml` and update `CHANGELOG.md`.

6. **Tag the release**:
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```

7. **Build release artifacts**:
   ```bash
   cargo build --release
   # Binary at: target/release/kazkade.exe or target/release/kazkade
   ```

8. **Create GitHub Release** with:
   - Binary artifact(s) for each platform
   - `CHANGELOG.md` entry
   - SHA256 checksums

9. **Post-release**: Verify the published binary works:
   ```bash
   ./kazkade --version
   ./kazkade info
   ./kazkade bench --size 256
   ```

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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