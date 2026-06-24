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

# Kasteran* — Reproducible Outputs
© Lois-Kleinner & 0-1.gg 2026

## Overview

Reproducible outputs extend the concept of deterministic builds to the entire software supply chain. Kasteran* provides verified builds, hash verification, and cryptographic attestation to ensure that every output can be independently verified as matching its source.

## Verified Builds

### What is a Verified Build?
A verified build is one where a third party can independently confirm that a binary was produced from a specific source code.

### Verification Process
```
1. Obtain source code (hash-verified)
2. Obtain build environment (containerized)
3. Obtain build configuration (manifest)
4. Perform build with --deterministic
5. Compare binary hash with published hash
6. Verify attestation signature
```

### Automated Verification
```
kasteran verify --artifact my_app.wasm --manifest build.manifest.json
```

This command:
1. Downloads the source code
2. Verifies source hashes
3. Builds the artifact
4. Compares hashes
5. Reports verification status

## Hash Verification

### Artifact Hashing
Every release artifact is hashed:
```
kasteran: sha256:abc123def456...
kasteran-stdlib: sha256:ghi789jkl012...
install-script: sha256:mno345pqr678...
```

### Hash Publication
Hashes are published through multiple channels:
- **Website**: Official download page
- **Repository**: Checksums file in GitHub releases
- **Package manager**: Package manager checksums
- **Social media**: Verification announced on verified accounts

### Multi-Hash
Multiple hash algorithms provide defense in depth:
```json
{
    "sha256": "abc...",
    "sha512": "def...",
    "blake3": "ghi..."
}
```

## Cryptographic Attestation

### Build Attestation
Builds are cryptographically signed:
```
kasteran build --attest
```

This generates an attestation document:
```json
{
    "type": "https://in-toto.io/Statement/v1",
    "predicateType": "https://slsa.dev/provenance/v1",
    "subject": [{
        "name": "my_app.wasm",
        "digest": {"sha256": "abc123..."}
    }],
    "predicate": {
        "builder": {"id": "https://github.com/kasteran/kasteran"},
        "buildType": "kasteran/v1",
        "invocation": {
            "configSource": {"digest": {"sha256": "def456..."}}
        },
        "materials": [{
            "uri": "git+https://github.com/kasteran/kasteran",
            "digest": {"sha256": "ghi789..."}
        }]
    }
}
```

### SLSA Compliance
Kasteran* builds follow SLSA (Supply-chain Levels for Software Artifacts) requirements:
- **SLSA Level 1**: Builds are scripted and documented
- **SLSA Level 2**: Builds are version-controlled and signed
- **SLSA Level 3**: Builds are isolated and reproducible
- **SLSA Level 4**: Builds are fully verifiable and hermetic

### Attestation Verification
```
kasteran verify-attestation --artifact my_app.wasm --attestation build.attestation.json
```

Verifies:
1. Attestation signature is valid
2. Artifact hash matches attestation
3. Builder identity is authorized
4. Source materials are verified

## Reproducibility Network

A network of independent verifiers confirms reproducibility:

### Community Verifiers
```
verifier: "Alice (independent developer)"
system: Ubuntu 24.04, x86-64
build: kasteran 1.0.0
result: MATCH (hash verified)
timestamp: 2026-06-19T10:30:00Z
```

### CI Verifiers
```
verifier: "GitHub Actions (kasteran-ci)"
system: Ubuntu 24.04, x86-64
build: kasteran 1.0.0
result: MATCH
timestamp: 2026-06-19T10:30:00Z
```

## Binary Transparency

Kasteran* implements binary transparency:
- All official binaries are logged in a public, append-only log
- Anyone can verify which binaries exist
- No unverifiable binaries can be created
- The log is monitored for unauthorized entries

## Conclusion

Kasteran* reproducible outputs ensure that every binary can be independently verified as matching its source code. Hash verification, cryptographic attestation, and binary transparency provide end-to-end integrity for the software supply chain.
