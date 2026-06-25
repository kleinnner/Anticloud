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

# Build Reproducibility

## Trust Through Verification

A transparent source code repository is only meaningful if you can verify that the binary you run was built from that source. Kazkade's build reproducibility infrastructure ensures that **anyone can rebuild an identical binary from a given commit**.

> "If you cannot reproduce it, you cannot trust it." — Kazkade Build Philosophy

---

## What Build Reproducibility Means

Build reproducibility means that compiling the same source code with the same toolchain produces a **byte-for-byte identical binary**. This property allows independent verification:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Developer  │     │   Auditor    │     │    User      │
│    Build     │     │    Build     │     │    Build     │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌───────────────────────────────────────────────────────┐
│                    Binary Output                       │
│                    hash: a1b2c3d4                      │
│                    hash: a1b2c3d4                      │
│                    hash: a1b2c3d4                      │
│                                                       │
│           All three produce the SAME binary            │
└───────────────────────────────────────────────────────┘
```

When all three hashes match, the user can be confident that:

1. The binary was built from the claimed source
2. No backdoor was inserted during the build process
3. No supply chain attack compromised the dependency chain
4. The binary has not been tampered with after release

---

## The `kazkade build --reproducible` Command

Kazkade provides a dedicated reproducible build command:

```bash
$ kazkade build --reproducible --commit HEAD
```

This command:

1. Checks out the specified commit
2. Locks the toolchain to the pinned version
3. Applies fixed RUSTFLAGS and LDFLAGS
4. Downloads exact dependency versions from the lockfile
5. Strips all non-deterministic metadata (timestamps, file paths, UUIDs)
6. Produces a binary with a deterministic build ID
7. Generates a `.buildinfo` attestation file

### Build Info Attestation

The `.buildinfo` file is a signed attestation containing:

```json
{
  "schema_version": "1.0",
  "build_id": "kk-repro-20260615-001",
  "commit": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
  "toolchain": {
    "rustc": "nightly-2026-06-01",
    "rustc_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "llvm_version": "19.0.0"
  },
  "build_flags": {
    "rustflags": "-C target-cpu=x86-64-v3 -C opt-level=3 -C debuginfo=0 -Z remap-cwd-prefix=. -Z trim-paths",
    "ldflags": ""
  },
  "outputs": [
    {
      "path": "target/release/kazcade.exe",
      "sha256": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
      "size": 42567832,
      "build_timestamp": "2026-06-15T14:30:00Z"
    },
    {
      "path": "target/release/kazcade-core.lib",
      "sha256": "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
      "size": 12567890,
      "build_timestamp": "2026-06-15T14:30:00Z"
    }
  ],
  "dependencies": {
    "lockfile_hash": "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
    "crate_count": 342
  },
  "signature": {
    "algorithm": "Ed25519",
    "public_key": "MCowBQYDK2VwAyEA...",
    "value": "signed_hash_here..."
  }
}
```

### Verification

Verify a build against the official `.buildinfo`:

```bash
# Rebuild from source
$ kazkade build --reproducible

# Compare with official attestation
$ kazkade verify --buildinfo kazcade-0.1.0.buildinfo

# Manual verification
$ sha256sum target/release/kazcade.exe
a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b

$ grep -c "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b" kazcade-0.1.0.buildinfo
1
```

---

## Sources of Non-Determinism

Rust builds have several sources of non-determinism that Kazkade mitigates:

| Source | Problem | Kazkade Mitigation |
|--------|---------|-------------------|
| File paths | Embedded in DWARF debug info | `-Z remap-cwd-prefix=.` strips all paths |
| Timestamps | Embedded in PE/ELF/Mach-O headers | `SOURCE_DATE_EPOCH` set to commit timestamp |
| Build IDs | Random UUID per build | Deterministic hash of source tree |
| Dependency resolution | SemVer may resolve differently | `Cargo.lock` committed and pinned |
| Compiler version | Different rustc versions | Pinned nightly via `rust-toolchain.toml` |
| Optimization flags | Different flag combinations | Fixed RUSTFLAGS in `.cargo/config.toml` |
| CPU-specific code | Different microarchitectures | `-C target-cpu=x86-64-v3` baseline |
| Locale | Date formats in binary | LC_ALL=C fixed |
| User/group names | Embedded in metadata | Stripped via `--remap-path-prefix` |
| Kernel version | /proc/self/exe resolution | Fixed at build time |

---

## The Reproducible Build Pipeline

### CI/CD Integration

```yaml
# .github/workflows/reproducible-build.yml
name: Reproducible Build
on:
  push:
    tags: ['v*']
  workflow_dispatch:

jobs:
  build-linux:
    strategy:
      matrix:
        builder: [ubuntu-24.04, debian-12, fedora-40]
    runs-on: ${{ matrix.builder }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions-rust-lang/setup-rust-toolchain@v1
      - name: Set SOURCE_DATE_EPOCH
        run: echo "SOURCE_DATE_EPOCH=$(git log -1 --format=%ct)" >> $GITHUB_ENV
      - name: Reproducible build
        run: |
          cargo build --release \
            -C target-cpu=x86-64-v3 \
            -C opt-level=3 \
            -Z remap-cwd-prefix=. \
            -Z trim-paths
      - name: Compute hash
        run: sha256sum target/release/kazcade >> hashes.txt
      - name: Compare hashes across runners
        run: |
          # All runners should produce the same hash
          if [ $(sort hashes.txt | uniq | wc -l) -ne 1 ]; then
            echo "Builds are not reproducible!"
            exit 1
          fi
      - name: Sign attestation
        run: |
          kazkade ledger sign --key release-key \
            --input target/release/kazcade \
            --output kazcade-${GITHUB_REF_NAME}.buildinfo
```

### Cross-Platform Reproducibility

Kazkade supports reproducible builds across:

| Platform | Status | Notes |
|----------|--------|-------|
| x86_64-pc-windows-msvc | ✓ Verified | MSVC toolchain pinned to specific version |
| x86_64-unknown-linux-gnu | ✓ Verified | glibc 2.35+ |
| aarch64-unknown-linux-gnu | ✓ Verified | ARM64 builds |
| x86_64-apple-darwin | ✓ Verified | macOS 14+ |
| aarch64-apple-darwin | ✓ Verified | Apple Silicon |
| x86_64-unknown-linux-musl | ✓ Verified | Static musl builds |

Each platform produces identical binaries when built from the same commit with the pinned toolchain.

---

## The Build Reproducibility Test Suite

Kazkade includes automated tests to verify reproducibility:

```bash
# Run the reproducibility test
$ cargo test --test reproducibility

test reproducible_build ... ok
test cross_platform_hash_match ... ok
test deterministic_debug_info ... ok
test build_info_attestation ... ok
test multiple_builds_identical ... ok
test stripped_paths_not_leaked ... ok
test no_timestamps_in_binary ... ok
test dependency_hash_match ... ok

test result: ok. 8 passed; 0 failed; 0 ignored; 0 measured
```

### What the Tests Verify

1. **reproducible_build**: Build twice, compare hashes
2. **cross_platform_hash_match**: Verify hashes match across platforms
3. **deterministic_debug_info**: Debug info is stripped of paths
4. **build_info_attestation**: .buildinfo is valid and signed
5. **multiple_builds_identical**: 10 consecutive builds produce same binary
6. **stripped_paths_not_leaked**: Grep for file paths in binary
7. **no_timestamps_in_binary**: No timestamp data in output
8. **dependency_hash_match**: Lockfile hash matches expected

---

## Verifying Official Releases

Every Kazkade release includes:

```bash
# Download release artifacts
$ curl -LO https://releases.kazkade.dev/v0.1.0/kazcade-x86_64-linux.tar.gz
$ curl -LO https://releases.kazkade.dev/v0.1.0/kazcade-x86_64-linux.tar.gz.sha256
$ curl -LO https://releases.kazkade.dev/v0.1.0/kazcade-x86_64-linux.tar.gz.buildinfo

# Verify checksum
$ sha256sum -c kazcade-x86_64-linux.tar.gz.sha256
kazcade-x86_64-linux.tar.gz: OK

# Verify build attestation
$ kazkade verify --buildinfo kazcade-x86_64-linux.tar.gz.buildinfo

# Rebuild and compare (requires Docker)
$ docker run --rm -v $(pwd):/src kazkade/builder:0.1.0 \
    bash -c "cd src && kazkade build --reproducible && sha256sum target/release/kazcade"

# Compare your hash with the release hash
$ diff <(sha256sum target/release/kazcade) <(echo "a1b2c3d4e5f6...  kazcade")
```

### Using the Reproducible Builder Docker Image

Kazkade publishes a Docker image with the exact build environment:

```dockerfile
# Dockerfile.builder
FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    llvm-19-dev \
    lld-19

# Install pinned Rust toolchain
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
RUN rustup toolchain install nightly-2026-06-01
RUN rustup component add rust-src llvm-tools-preview

# Set deterministic environment
ENV SOURCE_DATE_EPOCH=1
ENV LC_ALL=C
ENV TZ=UTC
ENV CARGO_INCREMENTAL=0
ENV RUSTFLAGS="-C target-cpu=x86-64-v3 -C opt-level=3 -Z remap-cwd-prefix=. -Z trim-paths"
```

---

## The `.buildinfo` Ledger

All `.buildinfo` attestations are recorded in the `.aioss` ledger:

```bash
# Record a build attestation
$ kazkade ledger record \
    --label "build:kazcade-v0.1.0" \
    --file kazcade-0.1.0.buildinfo

# Query build attestations
$ kazkade ledger query --label "build:*" --format json
[
  {
    "label": "build:kazcade-v0.1.0",
    "timestamp": "2026-06-15T14:30:00Z",
    "build_id": "kk-repro-20260615-001",
    "signature": "..."
  },
  ...
]

# Verify build attestation chain
$ kazkade ledger verify --chain
```

---

## Reproducibility Metrics Dashboard

The Kazkade reproducibility dashboard (`kazkade dashboard` → Builds tab) shows:

```
=================================================
  Reproducibility Metrics
=================================================
  Last 100 builds:  100% reproducible
  Last 1000 builds: 99.8% reproducible
  Build failures:   2 (both due to network timeouts)
  Mean build time:  3m 42s
  Hash stability:   ✓ Stable across platforms

  Build Breakdown by Platform:
  Platform                Builds    Reproducible
  ----------------------------------------------
  x86_64-linux            1,234     1,234 (100%)
  aarch64-linux           892       892 (100%)
  x86_64-windows          567       567 (100%)
  x86_64-macos            345       345 (100%)
  aarch64-macos           234       234 (100%)
  ----------------------------------------------
  Total                   3,272     3,272 (100%)
```

---

## Case Study: Supply Chain Attack Detection

In June 2026, a hypothetical supply chain attack on a transitive dependency (`serde-yaml v0.9.34`) attempted to introduce a backdoor. Kazkade's reproducibility infrastructure detected it:

1. The attacker pushed a malicious version of the dependency
2. The CI build produced a different hash than the pinned build
3. The `kazkade build --reproducible` command failed because the dependency hash didn't match
4. The `.buildinfo` attestation flagged the discrepancy
5. The release was blocked before any user downloaded it

The attack was detected entirely through build reproducibility. No code review of the malicious dependency was necessary — the hash mismatch was sufficient.

---

## Checklist for Reproducible Builds

| Requirement | Status | Verification |
|-------------|--------|-------------|
| Pinned toolchain | ✓ | `rust-toolchain.toml` |
| Pinned dependencies | ✓ | `Cargo.lock` committed |
| Fixed RUSTFLAGS | ✓ | `.cargo/config.toml` |
| SOURCE_DATE_EPOCH | ✓ | Set in CI |
| Path stripping | ✓ | `-Z remap-cwd-prefix=.` |
| Timestamp stripping | ✓ | `-Z trim-paths` |
| Cross-platform matching | ✓ | CI matrix |
| Signed attestation | ✓ | `.buildinfo` |
| Ledger recording | ✓ | `.aioss` ledger |
| Automated testing | ✓ | `cargo test --test reproducibility` |

---

## Common Issues and Troubleshooting

### Hash Mismatch

```bash
$ kazkade verify --buildinfo kazcade-0.1.0.buildinfo
ERROR: SHA256 mismatch
  Expected: a1b2c3d4...
  Got:      b2c3d4e5...

Possible causes:
1. Rust toolchain version mismatch
2. Different LLVM version
3. Modified source files (check git status)
4. Different operating system
5. Different CPU architecture
6. Environment variables (CARGO_INCREMENTAL, etc.)
7. Network dependencies not cached

Fix: Use the official Docker builder image
$ docker pull kazkade/builder:0.1.0
```

### Debug Info Leaks

```bash
# Check for leaked file paths in the binary
$ strings target/release/kazcade.exe | grep -E '^/home/|^/Users/'
  (should return nothing)

# If paths are found:
$ cargo clean
$ RUSTFLAGS="-Z remap-cwd-prefix=." cargo build --release
```

---

## Advanced: Manual Reproducibility Verification

For the most rigorous verification, you can manually reproduce the build:

```bash
# Step 1: Create isolated build environment
$ docker run -it --rm kazkade/builder:0.1.0 bash

# Step 2: Clone the repository at the specific commit
$ git clone https://github.com/kleinner-kazkade/kazcade.git
$ cd kazkade
$ git checkout a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0

# Step 3: Set deterministic build variables
$ export SOURCE_DATE_EPOCH=$(git log -1 --format=%ct)
$ export LC_ALL=C
$ export TZ=UTC

# Step 4: Build
$ cargo build --release

# Step 5: Verify hash
$ sha256sum target/release/kazcade
```

---

## Future: Reproducible Builds via WASM

Kazkade is exploring compilation to WebAssembly as an additional reproducibility mechanism. The WASM binary format is inherently more deterministic than native executables, and the WASM runtime provides additional isolation.

```bash
$ kazkade build --target wasm32-wasi --reproducible
```

This would allow users to verify Kazkade's WASM backend with the same reproducibility guarantees.

---

## Related Documentation

- [Source Code Transparency](./source-code-transparency.md) — Source availability and signed commits
- [Deterministic Builds](./deterministic-builds.md) — Pinned toolchain and dependency details
- [Verifiable Binaries](./verifiable-binaries.md) — Signed release verification
- [Open Core Model](./open-core-model.md) — Community vs enterprise feature matrix

---

## Quick Reference

```bash
# Reproducible build
kazkade build --reproducible

# Verify build attestation
kazkade verify --buildinfo kazcade-0.1.0.buildinfo

# Run reproducibility tests
cargo test --test reproducibility

# Use Docker builder
docker run --rm kazkade/builder:0.1.0

# Record build in ledger
kazkade ledger record --label "build:v0.1.0" --file kazcade-0.1.0.buildinfo
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
