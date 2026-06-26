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

# SBOM and Supply Chain Integrity

## Overview

Kazkade is built on the Rust ecosystem with a strong commitment to supply chain transparency. Every release is accompanied by a Software Bill of Materials (SBOM) in SPDX 2.3 format, listing all direct and transitive dependencies. Combined with reproducible builds and `Cargo.lock` verification, enterprises can fully trace the provenance of every binary.

## Software Bill of Materials

The SBOM is generated at build time and published alongside each release artifact. It enumerates every crate in the dependency graph with its version, license, and source repository.

### Core Dependencies

| Crate | Version | License | Purpose |
|-------|---------|---------|---------|
| `eframe` | 0.27+ | MIT/Apache-2.0 | Native GUI framework for benchmark visualization |
| `egui` | 0.27+ | MIT/Apache-2.0 | Immediate-mode GUI toolkit |
| `clap` | 4.x | MIT/Apache-2.0 | CLI argument parsing |
| `sha3` | 0.10+ | MIT/Apache-2.0 | SHA3-256 hashing for ledger and integrity |
| `ed25519-dalek` | 2.x | BSD-3-Clause | Ed25519 digital signatures for ledger |
| `serde` / `serde_json` | 1.x | MIT/Apache-2.0 | Serialization of ledger entries and configuration |
| `ring` | 0.17+ | ISC | Cryptographic primitives and random number generation |
| `chrono` | 0.4+ | MIT/Apache-2.0 | Timestamp handling for ledger entries |
| `criterion` | 0.5+ | MIT/Apache-2.0 | Statistical benchmarking framework |
| `anyhow` | 1.x | MIT/Apache-2.0 | Error handling |
| `tracing` | 0.1+ | MIT | Structured logging and diagnostics |

### SBOM Generation

```bash
cargo sbom --format spdx --output kazkade-sbom.spdx.json
```

The SBOM is generated using `cargo sbom` (cargo-sourcebom) and includes:

- Package name, version, and supply chain URI
- License identifiers (SPDX short identifiers)
- Download locations for every crate
- Package verification codes (SHA3-256)
- Dependency relationships (DEPENDS_ON, BUILT_FROM)

## Cargo.lock Verification

The `Cargo.lock` file is committed to the repository and is part of the release artifact. Its integrity is verified by comparing the lock file hash against the signed release manifest.

```bash
kazkade verify-lock --lock Cargo.lock --manifest release.sig
```

This ensures that the exact dependency versions used at build time match what is declared in the release. Any drift indicates a supply chain modification.

## Reproducible Builds

Kazkade supports reproducible (deterministic) builds. When building from the same source commit with the same Rust toolchain version, the resulting binary is byte-for-byte identical. This is achieved through:

- Pinned `Cargo.lock` freezing all dependency versions
- Stable compiler target with fixed `rustc` version
- Stripped binary paths and timestamps from debug symbols
- Fixed codegen and optimization flags in `.cargo/config.toml`

To verify reproducibility:

```bash
git checkout <release-tag>
rustup toolchain install <pinned-version>
cargo build --release
sha256sum target/release/kazkade
```

Compare the resulting hash with the official release checksum published in the release manifest.

## CI/CD Pipeline Integrity

The build pipeline is hardened to prevent supply chain attacks:

1. **Source Integrity**: Every commit is signed with GPG or SSH. Tags are signed and verified.
2. **Build Isolation**: Builds run in ephemeral, disposable containers with no network access after dependency resolution.
3. **Dependency Caching**: Downloaded crates are cached and their hashes verified against the lock file.
4. **Artifact Signing**: The release binary and SBOM are signed with the Kazkade release key (Ed25519).
5. **Provenance Attestation**: The build system issues an in-toto attestation linking the source commit, builder identity, and output artifact hash.

## Enterprise Verification Workflow

```bash
# Step 1: Download the SBOM and release manifest
curl -O https://releases.kazkade.dev/v1.2.3/kazkade-sbom.spdx.json
curl -O https://releases.kazkade.dev/v1.2.3/release.sig

# Step 2: Verify the manifest signature
kazkade verify-manifest --manifest release.sig

# Step 3: Verify the binary against the manifest
sha256sum kazkade --check release.sig

# Step 4: Audit the SBOM for known vulnerabilities
kazkade audit-sbom --sbom kazkade-sbom.spdx.json --db osv
```

This four-step process ensures that only verified, untampered Kazkade binaries enter your environment.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ