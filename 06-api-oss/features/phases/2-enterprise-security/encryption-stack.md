---
title: "Encryption Stack"
sidebar_position: 99
description: "Full-stack encryption using AES-256-GCM for data at rest, Ed25519 for"
tags: [features]
---

# Encryption Stack

## What It Does
Full-stack encryption using AES-256-GCM for data at rest, Ed25519 for
signing and
identity, Curve25519 for key agreement, RSA for legacy compatibility, and
Argon2id for
password hashing.
Every cryptographic operation uses audited, pure-Rust implementations with
zero OpenSSL
dependency.
## How It Works
The encryption stack is unified in the Rust module
`ai-oss-gateway/src/crypto.rs`, which
provides a consistent API wrapping all cryptographic primitives.
**Data at rest**: Every file in `data/graph.db` (SQLite WAL) and every entry in `data/ledger/` (`.aioss` format) is encrypted with AES-256-GCM.
Per-file encryption keys are derived from a master key via HKDF-SHA256.
The master key can be sealed to a TPM 2.0 chip for hardware-bound
protection.
**Data in transit**: TLS 1.3 is handled by `rustls` with X25519 key agreement — no OpenSSL, no certbot, no LetsEncrypt.
Self-signed certificates are auto-generated on first boot by `rcgen` and
stored in the
encrypted secrets store.
**Signing**: Ed25519 via `ed25519-dalek` is used for codex signatures (proving which user authored which content), audit log integrity (each `.aioss` ledger entry is signed), and TPM attestation quotes.
**Hashing**: Argon2id via the `argon2` Rust crate is used for password hashing with configurable memory (default 64MB) and time (default 3 iterations) parameters — resistant to both GPU and ASIC brute-force attacks.
**Key exchange**: Curve25519 via `curve25519-dalek` is used for the PSI protocol's ECDH blinding and for session key establishment.
**Legacy RSA**: Available for SAML assertion signature verification and compatibility with existing PKI infrastructure, using the `rsa` crate.
All primitives are selected from the Rust crate ecosystem with formal
verification or
heavy auditing.
The gateway is configured via `opencode.json` — encryption settings,
allowed
ciphersuites, key rotation intervals — and started by `api-oss start` or
the binary
directly.
The Qwen2-VL-2B-Instruct-Q4_K_M.gguf model runs on CUDA but all
cryptographic operations
remain on CPU in protected memory.
The entire stack operates fully air-gapped with no internet dependency.
## How to Operate
1.
**Verify encryption status**: Open the compliance dashboard at `https://localhost:8081/compliance` or run `api-oss crypto status` (one of 87 CLI commands across 9 subcommand groups).
2.
**Configure TLS**: In `opencode.json`, set `tls.ciphersuites: ["TLS13_AES_256_GCM_SHA384"]` to restrict allowed cipher suites.
Default is TLS 1.3 only with no 1.2 fallback.
3.
**Rotate signing keys**: `api-oss crypto rotate-signing-key` generates a new Ed25519 key pair.
Old signatures remain verifiable with the previous key in the key history.
4.
**Configure Argon2 parameters**: In `opencode.json`, set `crypto.argon2.memory_cost: 131072` (128MB) and `crypto.argon2.time_cost: 5` for higher brute-force resistance.
5.
**Check FIPS-like status**: `api-oss crypto self-test` runs the internal KATs (Known Answer Tests) for each primitive to verify correct implementation.
6.
**Audit**: All key rotations, cipher configuration changes, and crypto self-test results are recorded in `data/ledger/` in `.aioss` format.
## The Moat
- **Zero OpenSSL dependency**: Every primitive uses pure-Rust implementations (`aes-gcm`, `ed25519-dalek`, `curve25519-dalek`, `rsa`, `argon2`, `rustls`).
This eliminates the most common source of memory-safety vulnerabilities in
cryptographic
code (Heartbleed, etc.).
- **Audited and formally verified crates**: `curve25519-dalek` has a formally verified core against the X25519 RFC.
`rustls` has undergone multiple security audits.
`aes-gcm` is a pure Rust implementation with no unsafe code in the critical
path.
- **Forward secrecy**: TLS 1.3 with X25519 provides perfect forward secrecy — compromising the server's long-term key does not allow decrypting past sessions.
- **Hardware-bound key protection**: Optional TPM 2.0 sealing of the master encryption key — if the machine is compromised, the key cannot be extracted without the physical TPM chip.
- **Configurable cryptographic policy**: All cipher choices, key sizes, and algorithm selections are configurable via `opencode.json` — enabling compliance with organizational cryptographic standards.
- **Self-verifying implementation**: The `crypto self-test` command runs KATs for every primitive, providing assurance that the cryptographic implementation is correct.
## Why Choose API-OSS
Cloud AI platforms rely on the cloud provider's encryption infrastructure
— users cannot
verify which ciphers are used, whether forward secrecy is enabled, or
whether memory-safe
implementations are deployed.
Palantir uses Java's Bouncy Castle cryptographic provider, which has a
significantly
larger attack surface than the focused Rust crate approach.
API-OSS provides a fully audited, pure-Rust encryption stack with zero
OpenSSL dependency
— every byte of cryptographic code is inspectable, auditable, and
verifiable.
For organizations that require cryptographic assurance (FIPS 140-3
equivalent, NATO
cryptographic standards), API-OSS provides the transparency and
implementation quality
that cloud vendors cannot match.
## Competitive Comparison
- **OpenAI**: Cloud encryption — users cannot verify which cryptographic primitives are used.
TLS termination is handled by cloud infrastructure, not verifiable by
customers.
- **Palantir**: Uses Bouncy Castle (Java) for cryptographic operations — a large library with a broad attack surface.
No memory safety guarantees.
- **Snowflake**: Cloud encryption keys managed by cloud provider (AWS KMS, Azure Key Vault).
Users have limited visibility into encryption implementation.
- **Anthropic**: API-only — no data at rest encryption is customer-visible.
## Cost-Benefit Analysis
Implementing a FIPS 140-3 compliant cryptographic stack in-house requires:
a cryptographic
engineering team ($400k-$600k/year), FIPS certification costs ($100k-$300k
per module),
and ongoing security audits ($50k-$100k/year).
Cloud vendors bundle encryption in their platform cost but provide no
implementation
transparency.
API-OSS provides a production-grade, pure-Rust encryption stack at zero
additional cost
— all cryptographic primitives are included in the single binary.
Time savings: years of cryptographic engineering eliminated.
Risk reduction: eliminating OpenSSL removes the most common source of
critical CVEs in
deployed systems — Heartbleed (CVE-2014-0160), Cloudflare
(CVE-2019-1559), and dozens of
memory-safety vulnerabilities.
## Applications
- **Consumer**: N/A
- **Government / Defense**: FIPS 140-3 equivalent encryption for classified deployments with audited, memory-safe Rust implementations.
Forward secrecy ensures that past classified decisions cannot be decrypted
even if
long-term keys are compromised.
- **Enterprise**: Customer-managed encryption keys with verifiable implementation — financial services and healthcare organizations can inspect every cryptographic primitive used in their AI deployment.