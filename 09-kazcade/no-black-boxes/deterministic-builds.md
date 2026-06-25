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

# Deterministic Builds

## The Foundation of Reproducibility

Deterministic builds are the technical foundation upon which build reproducibility is built. While reproducibility ensures identical outputs from the same inputs, determinism guarantees that the same source code always produces the same compiled output regardless of **when**, **where**, or **by whom** it is built.

> "Determinism is not a feature of the compiler. It is a discipline of the build system." — Kazkade Toolchain Philosophy

---

## The Deterministic Build Stack

Kazkade's deterministic build system operates at multiple layers:

```
┌────────────────────────────────────────────────────────────┐
│                    Deterministic Build Stack                │
├────────────────────────────────────────────────────────────┤
│ Layer 7: Build Attestation     │ .buildinfo, ledger entry   │
│ Layer 6: Output Post-Processor │ strip-nondeterminism       │
│ Layer 5: Linker                │ lld (deterministic)        │
│ Layer 4: Compiler              │ rustc (pinned nightly)     │
│ Layer 3: Toolchain             │ rust-toolchain.toml        │
│ Layer 2: Dependencies          │ Cargo.lock (pinned)        │
│ Layer 1: Build Scripts         │ Fixed RUSTFLAGS, env vars  │
│ Layer 0: Source Code           │ Immutable git commit       │
└────────────────────────────────────────────────────────────┘
```

Each layer must be deterministic for the entire stack to produce a reproducible binary. A failure at any layer breaks the chain.

---

## Pinned Toolchain

### rust-toolchain.toml

Kazkade pins the exact Rust toolchain version in `rust-toolchain.toml`:

```toml
[toolchain]
channel = "nightly-2026-06-01"
components = ["rustc", "cargo", "rust-std", "rust-src", "llvm-tools-preview"]
targets = [
    "x86_64-unknown-linux-gnu",
    "aarch64-unknown-linux-gnu",
    "x86_64-pc-windows-msvc",
    "x86_64-apple-darwin",
    "aarch64-apple-darwin",
    "x86_64-unknown-linux-musl",
]
profile = "minimal"
```

This ensures every developer and CI system uses the exact same compiler version. The pinned nightly is tested for at least 7 days before being adopted for release builds.

### Toolchain Hash Verification

The toolchain download is verified by hash:

```bash
# Verify the toolchain hash
$ rustup show
Default host: x86_64-unknown-linux-gnu
rustup home:  /home/user/.rustup

Installed toolchains:
--------------------
nightly-2026-06-01-x86_64-unknown-linux-gnu (override)
  rustc: 1.85.0-nightly (abc123def 2026-06-01)
  hash:  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

# The hash must match the reference in the repository
$ cat toolchain-hashes.txt
nightly-2026-06-01 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

---

## Fixed RUSTFLAGS

Kazkade defines a canonical set of RUSTFLAGS in `.cargo/config.toml`:

```toml
# .cargo/config.toml
[build]
rustflags = [
    "-C", "target-cpu=x86-64-v3",
    "-C", "opt-level=3",
    "-C", "debuginfo=0",
    "-C", "codegen-units=1",
    "-C", "lto=fat",
    "-C", "embed-bitcode=yes",
    "-C", "linker=clang-lld",
    "-C", "link-arg=-Wl,--build-id=none",
    "-Z", "remap-cwd-prefix=.",
    "-Z", "trim-paths",
    "-Z", "linker-flavor=ld.lld",
]

[target.x86_64-unknown-linux-gnu]
rustflags = [
    "-C", "target-feature=+avx2,+fma,+bmi1,+bmi2,+lzcnt,+popcnt",
]

[target.aarch64-unknown-linux-gnu]
rustflags = [
    "-C", "target-feature=+neon,+fp16",
]
```

### Why Each Flag Matters

| Flag | Non-Determinism Source | Fix |
|------|----------------------|-----|
| `target-cpu=x86-64-v3` | CPU-specific codegen | Sets a fixed baseline |
| `opt-level=3` | Optimization level | Fixed to max optimization |
| `debuginfo=0` | Debug info variations | Strips all debug info |
| `codegen-units=1` | Codegen partitioning | Single unit = deterministic |
| `lto=fat` | LTO behavior | Fat LTO is deterministic |
| `embed-bitcode=yes` | LLVM bitcode embedding | Fixed inclusion |
| `linker=clang-lld` | Linker selection | LLD is deterministic |
| `--build-id=none` | Build ID randomness | Removes random build ID |
| `remap-cwd-prefix=.` | File path embedding | Strips paths |
| `trim-paths` | Path leakage | Removes path info |

---

## Pinned Dependencies

### Cargo.lock

The `Cargo.lock` file is committed to the repository and never modified except by explicit dependency updates:

```
$ git log --oneline -- Cargo.lock | head -10
a1b2c3d fix: bump tokio to 1.40.0 for security fix
b2c3d4e chore: update serde to 1.0.210
c3d4e5f feat: add arrow dependency for Parquet support
d4e5f6a chore: initial Cargo.lock
```

### Dependency Pinning Policy

| Dependency Type | Pinning Policy | Update Frequency |
|----------------|---------------|-----------------|
| Core runtime deps | Exact version | Security patches only |
| SIMD deps | Exact version | Verified on test matrix |
| Codec deps | Exact version | Performance validated |
| Development deps | Minor version range | Weekly automated PRs |
| Benchmark deps | Minor version range | As needed |

### Dependency Hash Verification

Every dependency is verified by hash at build time:

```bash
# Generate dependency hashes
$ cargo generate-lockfile
$ kazkade sbom --deep > deps.json

# Verify dependency hashes against registry
$ kazkade verify --deps

# Check for tampered dependencies
$ kazkade verify --deps-hash
```

---

## Environment Variable Control

Deterministic builds require a controlled environment. Kazkade's build system sets:

```bash
# Mandatory for deterministic builds
export SOURCE_DATE_EPOCH=1718467200  # Fixed to commit timestamp
export LC_ALL=C
export TZ=UTC
export LANG=C
export LANGUAGE=C
export CARGO_INCREMENTAL=0
export CARGO_NET_RETRY=0
export RUST_BACKTRACE=0
export RUST_LOG=off

# Stripped from build environment
unset CARGO_CACHE_RUSTFLAGS
unset CARGO_ENCODED_RUSTFLAGS
unset RUSTC_WRAPPER
unset CC
unset CXX
unset AR
unset HOST_CC
unset HOST_CXX
```

---

## Deterministic Linker Configuration

Kazkade uses LLD (LLVM Linker) with its deterministic mode enabled:

```bash
# .cargo/config.toml linker configuration
[target.x86_64-unknown-linux-gnu]
linker = "clang-lld"
rustflags = [
    "-C", "link-arg=-Wl,--build-id=none",
    "-C", "link-arg=-Wl,--hash-style=gnu",
    "-C", "link-arg=-Wl,--no-rosegment",
    "-C", "link-arg=-Wl,--sort-section=alignment",
    "-C", "link-arg=-fuse-ld=lld",
]
```

LLD's deterministic mode ensures:
- No embedded timestamps
- No random UUIDs in build IDs
- Identical section ordering
- Identical symbol table layout

---

## Post-Processing for Determinism

Even with deterministic tools, some non-determinism can creep in. Kazkade applies a post-processing step:

```bash
# Post-processing pipeline
$ kazkade build --post-process \
    --strip-nondeterminism \
    --normalize-debug \
    --canonicalize-permissions
```

The post-processor handles:

```rust
// Pseudocode for post-processing
fn post_process_binary(path: &Path) -> Result<()> {
    // 1. Zero out timestamps in PE/ELF/Mach-O headers
    zero_timestamps(path)?;

    // 2. Normalize section alignment
    normalize_sections(path)?;

    // 3. Strip debug info directory
    strip_debug_dir(path)?;

    // 4. Canonicalize file permissions to 0755
    set_permissions(path, 0o755)?;

    // 5. Remove any embedded build paths
    strip_build_paths(path)?;

    // 6. Normalize string table ordering
    normalize_strings(path)?;

    Ok(())
}
```

---

## The Deterministic Build Test Suite

Kazkade includes a comprehensive test suite for determinism:

```bash
# Run all deterministic build tests
$ cargo test --test deterministic

running 12 tests
test deterministic_flags ... ok
test pinned_toolchain ... ok
test pinned_dependencies ... ok
test fixed_rustflags ... ok
test environment_controlled ... ok
test linker_deterministic ... ok
test post_processing ... ok
test cross_platform_flags ... ok
test timing_independent ... ok
test user_independent ... ok
test directory_independent ... ok
test network_independent ... ok

test result: ok. 12 passed; 0 failed
```

### Test Descriptions

| Test | What It Verifies |
|------|-----------------|
| `deterministic_flags` | All RUSTFLAGS are set from config, not environment |
| `pinned_toolchain` | Toolchain matches rust-toolchain.toml exactly |
| `pinned_dependencies` | Cargo.lock hash matches reference |
| `fixed_rustflags` | No RUSTFLAGS override from environment |
| `environment_controlled` | LC_ALL, TZ, SOURCE_DATE_EPOCH all set |
| `linker_deterministic` | LLD is used with deterministic flags |
| `post_processing` | Post-processor removes all non-determinism |
| `cross_platform_flags` | Flags are consistent across platforms |
| `timing_independent` | Build at different times produces same binary |
| `user_independent` | Build as different users produces same binary |
| `directory_independent` | Build in different directories produces same binary |
| `network_independent` | Build without network produces same binary |

---

## The Cost of Determinism

Deterministic builds have trade-offs:

### Performance Impact

| Setting | Build Time Impact | Binary Size Impact |
|---------|------------------|-------------------|
| `codegen-units=1` | +25% build time | -5% binary size |
| `lto=fat` | +15% build time | -15% binary size |
| `embed-bitcode=yes` | +10% build time | +30% binary size |
| `debuginfo=0` | -10% build time | -50% binary size |
| Total | +40% build time | -35% binary size |

### Feature Restrictions

Some features are incompatible with deterministic builds:

| Feature | Issue | Alternative |
|---------|-------|-------------|
| `sccache` | Cache-based non-determinism | Build without cache |
| `mold` linker | Non-deterministic section ordering | Use LLD instead |
| Split DWARF | Random file names | Single debug info |
| Profile-guided optimization | Non-deterministic profiles | No PGO for release |

---

## CI/CD Determinism Checks

Every pull request is checked for determinism:

```yaml
name: Determinism Check
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - name: Build twice
        run: |
          cargo build --release
          cp target/release/kazcade target/release/kazcade.first
          cargo clean
          cargo build --release
          diff target/release/kazcade target/release/kazcade.first
      - name: Check for path leaks
        run: |
          strings target/release/kazcade | grep -E '^/home/|^/Users/' && exit 1 || true
      - name: Check for timestamp leaks
        run: |
          strings target/release/kazcade | grep -E '\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}' && exit 1 || true
```

---

## Verifying Determinism

### For End Users

```bash
# Verify the binary you downloaded was deterministically built
$ kazkade verify --deterministic

# Compare your build with the official one
$ kazkade verify --compare release-hashes.txt

# Generate a determinism report
$ kazkade build --deterministic-report
```

### For Auditors

```bash
# Full determinism audit
$ git clone https://github.com/kleinner-kazkade/kazcade.git
$ cd kazkade
$ git checkout v0.1.0

# Set up the deterministic environment
$ export SOURCE_DATE_EPOCH=$(git log -1 --format=%ct)
$ export LC_ALL=C

# Build
$ cargo build --release

# Verify against published hash
$ sha256sum target/release/kazcade
# Compare with: https://releases.kazkade.dev/v0.1.0/sha256sums.txt
```

---

## Deterministic Builds on Different Operating Systems

### Linux (glibc)

```bash
# Ubuntu 24.04, Debian 12, Fedora 40 all produce identical binaries
$ RUSTFLAGS="-C target-cpu=x86-64-v3 -C opt-level=3 -C debuginfo=0 \
  -Z remap-cwd-prefix=. -Z trim-paths" \
  cargo build --release --target x86_64-unknown-linux-gnu
```

### Linux (musl)

```bash
# Static musl builds are also deterministic
$ RUSTFLAGS="-C target-cpu=x86-64-v3 -C opt-level=3 -C debuginfo=0 \
  -Z remap-cwd-prefix=. -Z trim-paths" \
  cargo build --release --target x86_64-unknown-linux-musl
```

### Windows

```bash
# Windows builds require MSVC toolchain pinning
$ rustup toolchain install nightly-2026-06-01-x86_64-pc-windows-msvc
$ RUSTFLAGS="-C target-cpu=x86-64-v3 -C opt-level=3 -C debuginfo=0" \
  cargo build --release --target x86_64-pc-windows-msvc
```

### macOS

```bash
# macOS builds are deterministic within the same SDK version
$ RUSTFLAGS="-C target-cpu=apple-m1 -C opt-level=3 -C debuginfo=0 \
  -Z remap-cwd-prefix=. -Z trim-paths" \
  cargo build --release --target aarch64-apple-darwin
```

---

## The Non-Determinism Debugger

Kazkade includes a tool to identify sources of non-determinism:

```bash
# Analyze a non-deterministic build
$ kazkade debug --non-determinism

Non-determinism Analysis Report
===============================
Comparing build-1.exe vs build-2.exe
Size: 42,567,832 vs 42,567,832 (identical)
SHA256: a1b2c3d4 vs b2c3d4e5 (DIFFERENT)

Differential Analysis:
  Offset     Build 1         Build 2         Field
  --------   ------------    ------------    ------
  0x1A2B3C   /home/user/     /home/builder/  DW_AT_comp_dir
  0x3C4D5E   2026-06-15T14   2026-06-15T15   Timestamp
  0x5E6F70   abcdef01        23456789        Build ID
  0x7F8A9B   core::ptr       core::ptr       Symbol table (identical)

Root cause: SOURCE_DATE_EPOCH not set; build path not remapped
Fix: export SOURCE_DATE_EPOCH; add -Z remap-cwd-prefix=.
```

---

## Determinism Across Time

A key design goal: builds from the same commit must be identical **forever**. This means:

1. **Compiler upgrades must not change behavior** — Kazkade records the exact compiler behavior
2. **Dependency upgrades must not change behavior** — All dependency versions are frozen
3. **OS upgrades must not change behavior** — The Docker build image is versioned and frozen

```
Build Date    Toolchain     Hash          Verifiable?
──────────────────────────────────────────────────────
2026-06-01    nightly-2026  a1b2c3d4      ✓
2026-07-01    nightly-2026  a1b2c3d4      ✓ (unchanged)
2026-08-01    nightly-2026  a1b2c3d4      ✓ (unchanged)
2027-01-01    nightly-2026  a1b2c3d4      ✓ (unchanged)
```

This is achieved by:
- Freezing the Docker builder image
- Freezing the toolchain version
- Freezing all dependency versions
- Verifying hash stability across time

---

## The Determinism Manifesto

Kazkade's determinism requirements are codified in `DETERMINISM.md`:

```
1. The same source must always produce the same binary.
2. No environmental factor may affect the output.
3. All build inputs must be explicitly declared and pinned.
4. The build process must be fully scripted and automated.
5. Build outputs must be independently verifiable.
6. Non-determinism must be treated as a bug, not a feature.
7. The build environment must be reproducible from documented inputs.
8. Build failures due to non-determinism must block releases.
```

---

## Related Documentation

- [Source Code Transparency](./source-code-transparency.md) — Source availability
- [Build Reproducibility](./build-reproducibility.md) — Full reproducibility guide
- [Verifiable Binaries](./verifiable-binaries.md) — Signed release verification
- [Dependency Disclosure](./dependency-disclosure.md) — Dependency tree management

---

## Quick Reference

```bash
# Verify deterministic flags
rustc --version --verbose
cat .cargo/config.toml

# Build deterministically
RUSTFLAGS="-C target-cpu=x86-64-v3 -C opt-level=3 -C debuginfo=0 \
  -Z remap-cwd-prefix=. -Z trim-paths" \
  cargo build --release

# Run determinism tests
cargo test --test deterministic

# Debug non-determinism
kazkade debug --non-determinism --binary-a build-1.exe --binary-b build-2.exe

# Generate determinism report
kazkade build --deterministic-report
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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
