▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

────────────────────────────────────────────────────────────────

# Verifiable Binaries

**Category:** No Black Boxes
**File:** 03-verifiable-binaries.md
**Revision:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Reproducible Builds](#reproducible-builds)
3. [Binary Signing](#binary-signing)
4. [Verification Process](#verification-process)
5. [Build Environment](#build-environment)
6. [Verification Tooling](#verification-tooling)
7. [Trust Chain](#trust-chain)
8. [References](#references)

---

## Overview

Libern provides **verifiable binaries** through two complementary mechanisms: **reproducible builds** (anyone can build the same source code and get byte-identical binaries) and **binary signing** (official releases are signed with a Libern development key for authenticity verification).

This combination means:
1. **Users can verify** that the binary they downloaded was built from the published source code.
2. **No hidden modifications** can be introduced between source and binary.
3. **No third party** can substitute a malicious binary without detection.

---

## Reproducible Builds

### What Reproducible Builds Mean

A build is reproducible if, given the same source code, build environment, and build instructions, it produces **byte-identical binaries**. This allows anyone to independently verify that the official binary matches the source code.

### Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Rust crates (libern-core, libern-aioss) | Deterministic | With pinned toolchain + Cargo.lock |
| Tauri desktop app | In progress | Frontend bundling introduces non-determinism |
| Sandbox app | Deterministic | Pure Rust, no frontend |

### Achieving Reproducibility

**1. Pinned Toolchain**

The Rust toolchain version is pinned:

```bash
# rust-toolchain.toml
[toolchain]
channel = "1.77.0"
components = ["rustc", "cargo"]
```

**2. Locked Dependencies**

`Cargo.lock` ensures all dependencies are pinned to specific versions.

**3. Deterministic Compilation Flags**

```bash
# Build with consistent settings
cargo build --release
# Additional flags for reproducibility:
# - CARGO_INCREMENTAL=0 (disable incremental compilation)
# - RUSTC_BOOTSTRAP=0 (no unstable features)
```

**4. Timestamp Normalization**

File timestamps in the binary are set to a fixed value:

```bash
# Set SOURCE_DATE_EPOCH for deterministic timestamps
export SOURCE_DATE_EPOCH=1700000000
cargo build --release
```

**5. File Order Determinism**

The compiler and linker are configured for deterministic file ordering:
```
-C metadata=libern (consistent crate hash)
-C link-arg=-Wl,--no-insert-timestamp (Linux)
```

### Verifying Reproducibility

```bash
# Step 1: Clone the repository at a specific tag
git clone https://github.com/libern/libern.git
cd libern
git checkout v1.0.0

# Step 2: Verify the commit hash matches the release
git log --oneline -1
# Expected: <release commit hash>

# Step 3: Build in a reproducible environment
export SOURCE_DATE_EPOCH=<release epoch>
export CARGO_INCREMENTAL=0
cargo build --release

# Step 4: Compare hashes
sha256sum target/release/libern-core.rlib
# Expected: matches the hash published with the release
```

---

## Binary Signing

### Signing Key

Official Libern releases are signed using an Ed25519 keypair. The public key is published in multiple locations:

1. **Repository:** `SIGNING_KEY.txt` in the repository root.
2. **Website:** Libern's official website.
3. **Social media:** Libern's official social media accounts.
4. **Key servers:** Potentially Keybase or similar.

### Signing Process

For each release, the build artifacts are signed:

```bash
# Sign the binary
./libern sign-binary \
    --binary target/release/libern-desktop.exe \
    --key /path/to/libern-signing-key \
    --output target/release/libern-desktop.exe.sig

# Sign the checksums file
sha256sum target/release/*.exe target/release/*.dll > SHA256SUMS
./libern sign-binary \
    --binary SHA256SUMS \
    --key /path/to/libern-signing-key \
    --output SHA256SUMS.sig
```

### Signature Format

The signature file contains:
```
Libern Binary Signature v1
File: libern-desktop.exe
SHA256: <hex hash of file>
Algorithm: Ed25519
Public Key: <base64-encoded public key>
Signature: <base64-encoded Ed25519 signature>
Timestamp: <ISO 8601>
```

### Multiple Signatures

For high-security releases, multiple developers may sign:

```bash
# Developer 1 signs
./libern sign-binary --binary release.zip --key dev1-key --output release.zip.sig.dev1

# Developer 2 signs
./libern sign-binary --binary release.zip --key dev2-key --output release.zip.sig.dev2

# Verification checks that both signatures are valid
```

---

## Verification Process

### Automated Verification

```bash
# Download the binary and signature
curl -LO https://github.com/libern/libern/releases/download/v1.0.0/libern-desktop.exe
curl -LO https://github.com/libern/libern/releases/download/v1.0.0/libern-desktop.exe.sig

# Verify the signature
libern verify-binary \
    --binary libern-desktop.exe \
    --signature libern-desktop.exe.sig \
    --public-key SIGNING_KEY.txt

# Verify the SHA256 checksum
sha256sum libern-desktop.exe
# Compare with the checksum in the release notes
```

### Manual Verification

**Step 1: Download the public key**

```bash
curl -LO https://raw.githubusercontent.com/libern/libern/main/SIGNING_KEY.txt
```

**Step 2: Extract the public key**

```bash
cat SIGNING_KEY.txt
# Output:
# Libern Signing Key
# Algorithm: Ed25519
# Public Key (base64): abc123...xyz==
```

**Step 3: Verify the binary**

```rust
// Using the verifier from state_proof.rs:
let signature_bytes = base64::decode(&signature_b64)?;
let public_key_bytes = base64::decode(&public_key_b64)?;
let binary_hash = sha256::digest(&binary_bytes);
let message = format!("libern-desktop.exe:{}", binary_hash);

let verifying_key = VerifyingKey::from_bytes(&public_key_bytes)?;
let signature = Signature::from_slice(&signature_bytes)?;
verifying_key.verify(message.as_bytes(), &signature)?;
// If no error, the binary is authentic
```

**Step 4: Build from source and compare**

```bash
# Build from source
git clone https://github.com/libern/libern.git
cd libern
git checkout v1.0.0
cargo build --release

# Compare
sha256sum target/release/libern-desktop.exe
sha256sum downloaded/libern-desktop.exe
# Both should match (if reproducible builds are achieved)
```

---

## Build Environment

### Recommended Build Environment

For reproducible builds, use a clean build environment:

```dockerfile
# Dockerfile for reproducible builds
FROM rust:1.77.0-slim-bookworm

RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libwebkit2gtk-4.1-dev \
    libjavascriptcoregtk-4.1-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build
COPY . .

ENV SOURCE_DATE_EPOCH=1700000000
ENV CARGO_INCREMENTAL=0
ENV RUSTFLAGS="-C metadata=libern -C link-arg=-Wl,--no-insert-timestamp"

RUN cargo build --release --workspace

CMD ["sha256sum", "target/release/libern-desktop"]
```

### Windows Build Environment

For Windows builds, use a clean Windows Server Core container:

```dockerfile
# Windows Dockerfile
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Install Rust toolchain
# Install Visual Studio Build Tools
# Build with pinned toolchain

CMD ["powershell", "-Command", "Get-FileHash target/release/libern-desktop.exe"]
```

### macOS Build Environment

For macOS builds, use a macOS runner:

```yaml
# GitHub Actions workflow
build-macos:
  runs-on: macos-14
  steps:
    - uses: actions/checkout@v4
    - uses: actions-rust-lang/setup-rust-toolchain@v1
      with:
        toolchain: 1.77.0
    - run: cargo build --release
    - run: shasum -a 256 target/release/libern-desktop
```

---

## Verification Tooling

### Libern Verify Command

Libern includes a built-in binary verification command:

```bash
# Generate a signing key
libern generate-signing-key --output signing-key.libern

# Sign a binary
libern sign --binary my-binary.exe --key signing-key.libern

# Verify a binary
libern verify --binary my-binary.exe --signature my-binary.exe.sig
```

### Third-Party Verification

Tools that can verify Libern binaries:

| Tool | Purpose | Platform |
|------|---------|----------|
| `sha256sum` | Checksum verification | All |
| `gpg` | Signature verification (if GPG-signed) | All |
| `minisign` | Ed25519 signature verification | All |
| `signify` | OpenBSD-style signing | Unix |
| Windows `Authenticode` | Code signing (if Authenticode-signed) | Windows |

### Release Artifacts

Each release includes:

```
libern-v1.0.0/
├── libern-desktop-x86_64-pc-windows-msvc.exe
├── libern-desktop-x86_64-pc-windows-msvc.exe.sig
├── libern-desktop-x86_64-apple-darwin.dmg
├── libern-desktop-x86_64-apple-darwin.dmg.sig
├── libern-desktop-x86_64-unknown-linux-gnu.AppImage
├── libern-desktop-x86_64-unknown-linux-gnu.AppImage.sig
├── SHA256SUMS
├── SHA256SUMS.sig
└── SIGNING_KEY.txt
```

---

## Trust Chain

### Key Hierarchy

```
Root Signing Key (offline storage)
  └─ Release Signing Key (CI/CD)
       └─ Release Binary Signature
            └─ Binary

Verification path:
  User downloads binary + signature
  User downloads public key from multiple sources
  User verifies signature against public key
  User (optionally) builds from source to verify reproducibility
```

### Key Protection

| Key | Storage | Access | Compromise Impact |
|-----|---------|--------|-------------------|
| Root signing key | Offline (hardware wallet) | Physical access required | Could sign malicious releases |
| Release signing key | CI/CD secrets | CI/CD pipeline only | Could sign malicious release |

### Revocation

If a signing key is compromised:
1. A revocation certificate is published.
2. A new keypair is generated.
3. The new public key is published through all channels.
4. All future releases are signed with the new key.
5. Old releases remain verifiable with the compromised key (the compromise does not retroactively affect old signatures).

---


## Build Environment — Expanded

### Docker Build Environment

```dockerfile
# Dockerfile.reproducible
# Fully reproducible build environment

FROM debian:bookworm-slim AS builder

# Install minimal build dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    pkg-config \
    libssl-dev \
    libwebkit2gtk-4.1-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Install pinned Rust toolchain
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | \
    sh -s -- -y --default-toolchain 1.77.0

ENV PATH="/root/.cargo/bin:${PATH}"
ENV SOURCE_DATE_EPOCH=1700000000
ENV CARGO_INCREMENTAL=0
ENV RUSTFLAGS="-C metadata=libern -C link-arg=-Wl,--no-insert-timestamp"

WORKDIR /build
COPY . .

# Build release binaries
RUN cargo build --release --workspace

# Output: hashes of built artifacts
RUN sha256sum target/release/* > /build/SHA256SUMS.built

FROM scratch
COPY --from=builder /build/target/release/ /release/
COPY --from=builder /build/SHA256SUMS.built /
```

### Windows Build Environment

```dockerfile
# Dockerfile.windows
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Install Visual Studio Build Tools
ADD https://aka.ms/vs/17/release/vs_buildtools.exe vs_buildtools.exe
RUN vs_buildtools.exe --quiet --wait --norestart \
    --installPath C:\BuildTools \
    --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 \
    || IF "%ERRORLEVEL%"=="3010" EXIT 0

# Install Rust
ADD https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe rustup-init.exe
RUN rustup-init.exe -y --default-toolchain 1.77.0

ENV CARGO_INCREMENTAL=0
ENV SOURCE_DATE_EPOCH=1700000000

WORKDIR C:\build
COPY . .

RUN cargo build --release
CMD ["certutil", "-hashfile", "target\\release\\libern-desktop.exe", "SHA256"]
```

## Verification Tools — Expanded

### Libern Built-in Verification Commands

```bash
# Generate a new signing keypair
libern generate-signing-key --output signing-key.libern

# Sign a release artifact
libern sign --binary libern-desktop.exe \
    --key signing-key.libern \
    --output libern-desktop.exe.sig

# Verify a signed binary
libern verify --binary libern-desktop.exe \
    --signature libern-desktop.exe.sig

# Verify all artifacts in a release directory
libern verify-release --dir ./release-v1.2.0/

# Check for reproducible build
libern check-reproducible --reference-hash SHA256SUMS.reference

# Display signing key fingerprint
libern key-fingerprint --key SIGNING_KEY.txt
```

### Third-Party Verification Commands

```bash
# GPG verification
gpg --verify SHA256SUMS.sig SHA256SUMS
gpg --verify libern-desktop.exe.sig libern-desktop.exe

# OpenBSD signify verification
signify -V -p libern.pub -x SHA256SUMS.sig -m SHA256SUMS

# minisign verification
minisign -Vm libern-desktop.exe -P SIGNING_KEY.pub

# Windows Authenticode verification
signtool verify /pa /v libern-desktop.exe
```

## Release Verification Protocol

### Complete Trust Chain Verification

```
Step 1: Obtain the official public key
   Source 1: GitHub repository (SIGNING_KEY.txt)
   Source 2: Official website
   Source 3: Keybase / social media
   → Cross-reference all three sources

Step 2: Verify the release signature
   wget https://github.com/libern/libern/releases/download/v1.0.0/libern-desktop.exe
   wget https://github.com/libern/libern/releases/download/v1.0.0/libern-desktop.exe.sig
   wget https://github.com/libern/libern/releases/download/v1.0.0/SIGNING_KEY.txt
   libern verify --binary libern-desktop.exe --signature libern-desktop.exe.sig --key SIGNING_KEY.txt

Step 3: Verify checksum
   wget https://github.com/libern/libern/releases/download/v1.0.0/SHA256SUMS
   sha256sum -c SHA256SUMS  # Check libern-desktop.exe entry

Step 4: Build from source (optional but recommended)
   git clone https://github.com/libern/libern.git
   cd libern
   git checkout v1.0.0
   git verify-commit v1.0.0  # Verify tag signature
   cargo build --release
   sha256sum target/release/libern-desktop.exe
   # Compare with checksums from Step 3
```

### Verification on Air-Gapped Systems

For high-security environments without internet access:

1. Download binaries, signatures, and checksums on a connected system
2. Verify integrity on the connected system
3. Transfer verified binaries via trusted media (USB, CD-R)
4. Re-verify checksums on the air-gapped system after transfer
5. Install from the verified media


## References

- **Source code:** `crates/libern-aioss/src/state_proof.rs` — Ed25519 signing and verification
- **Source code:** `Cargo.toml` — Workspace and dependency configuration
- **Build script:** `build.bat` — Automated build instructions
- **Reproducible Builds:** `https://reproducible-builds.org/`
- **Ed25519:** RFC 8032 — Edwards-Curve Digital Signature Algorithm

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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ