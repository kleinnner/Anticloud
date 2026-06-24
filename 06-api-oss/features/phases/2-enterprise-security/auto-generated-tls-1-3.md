---
title: "Auto-Generated TLS 1.3"
sidebar_position: 99
description: "Generates self-signed TLS 1.3 certificates on first boot using `rcgen`."
tags: [features]
---

# Auto-Generated TLS 1.3

## What It Does
Generates self-signed TLS 1.3 certificates on first boot using `rcgen`.
No LetsEncrypt, no external CA, no internet connection required.
Works fully air-gapped from the moment of installation — enabling zero-touch deployment
in disconnected environments.
## How It Works
TLS termination is implemented in the Rust module `ai-oss-gateway/src/tls.rs` using the
`rustls` library for TLS 1.3 and `rcgen` for certificate generation.
On first startup — when the gateway is started via `api-oss start` or by invoking the
binary directly — the TLS module checks for an existing certificate and private key in
the encrypted secrets store.
If none exists, it generates: a 2048-bit RSA or ECDSA P-256 key pair (configurable in
`opencode.json`), a self-signed X.509 v3 certificate with a random serial number, SAN
entries for `localhost`, `127.0.0.1`, and the machine's hostname (detected at runtime),
and validity of 365 days (configurable).
The certificate is signed by the generated key — no external CA is involved.
The private key is stored in the encrypted secrets store, optionally sealed to TPM 2.0 if
configured.
The certificate is stored alongside it.
On subsequent startups, the existing certificate is loaded.
If the certificate is within 30 days of expiry, it is automatically renewed with a new
random serial and validity period.
TLS 1.3 is enforced exclusively — there is no TLS 1.2 fallback to prevent downgrade
attacks.
The supported ciphersuites are `TLS13_AES_256_GCM_SHA384` and
`TLS13_CHACHA20_POLY1305_SHA256` (configurable via `opencode.json`).
All HTTP traffic on port 8081 and WebSocket traffic on port 3030 is served over TLS 1.3.
The CLI (`api-oss server tls renew` — force certificate rotation, `api-oss server tls
status` — display certificate details and expiry) provides management as part of 87 CLI
commands across 9 subcommand groups (auth, service, sync, backup, etc.).
Certificate generation, renewal, and all TLS configuration are recorded in the immutable
ledger at `data/ledger/` in `.aioss` format.
For deployments that need CA-signed certificates, the auto-generated certificate can be
replaced by placing a custom certificate and key in the paths specified in
`opencode.json`; a `server tls import` command supports importing PEM-encoded certificates
and encrypted private keys.
## How to Operate
1.
**Start the gateway**: `api-oss start` — the TLS module generates a self-signed certificate on first boot automatically.
No configuration needed.
2.
**View certificate details**: `api-oss server tls status` displays the certificate's subject, issuer (self), validity period, serial number, and SAN entries.
3.
**Access the UI**: Open `https://localhost:8081` — the browser will warn about the self-signed certificate.
Accept the warning or add the certificate to the trust store.
4.
**Force renewal**: `api-oss server tls renew` generates a new certificate and key.
Connections are not disrupted — the new certificate is used for new connections.
5.
**Import custom certificate**: `api-oss server tls import --cert cert.pem --key key.pem` replaces the auto-generated certificate with a CA-signed certificate.
6.
**Configure ciphersuites**: In `opencode.json`, set `tls.ciphersuites: ["TLS13_AES_256_GCM_SHA384"]` to restrict to a single cipher suite.
7.
**Audit**: Check `data/ledger/` for `.aioss` entries recording certificate generation, renewal, and import events.
## The Moat
- **Zero-dependency certificate management**: Certificate generation uses `rcgen` and `rustls` — both pure Rust libraries.
No OpenSSL, no certbot, no LetsEncrypt, no external PKI infrastructure.
This makes first-boot setup instantaneous and completely offline.
- **Automatic renewal**: Certificates are renewed automatically before expiry.
The operator never needs to manually rotate certificates in a running deployment.
- **TLS 1.3 only, no fallback**: TLS 1.2 is not offered, preventing downgrade attacks.
All connections use forward-secure key exchange (X25519 or P-256).
- **Air-gapped from first boot**: Certificate generation requires no internet.
The system is fully operational with TLS on a completely disconnected network from the
moment the binary starts.
- **Optional TPM key protection**: The private key can be sealed to TPM 2.0, providing hardware-backed protection for the TLS identity.
- **Single binary, no proxy dependency**: TLS termination is handled directly in the Rust binary.
No nginx, no HAProxy, no reverse proxy needed.
## Why Choose API-OSS
Every cloud AI vendor requires internet connectivity for TLS — certificates are managed
by the cloud provider's infrastructure.
Self-hosted deployments of AI platforms typically require separate certificate management
(certbot, nginx configuration, reverse proxy setup).
API-OSS is the only AI platform that auto-generates TLS certificates on first boot with
zero configuration and zero internet dependency.
For air-gapped classified networks, factory floors, and remote deployments where internet
is unavailable or prohibited, this eliminates the single biggest setup friction point.
## Competitive Comparison
- **Palantir**: Requires cloud connection for certificate management — Palantir Foundry deployments must reach Palantir's cloud infrastructure for certificate provisioning.
- **OpenAI**: Cloud-only — no self-hosted TLS possible.
Users connect to OpenAI's infrastructure over TLS managed by OpenAI.
- **Snowflake**: Cloud-only — no air-gapped deployment.
TLS is managed by Snowflake's cloud infrastructure.
- **Anthropic**: Cloud-only — no self-hosted TLS.
## Cost-Benefit Analysis
Certificate management infrastructure (certbot, Let's Encrypt automation, CA certificates,
reverse proxy configuration) costs $5k-$15k/year in engineering time and infrastructure.
Commercial CA certificates cost $200-$1,000/year each.
API-OSS provides automatic TLS 1.3 with self-signed certificates at zero additional cost.
Time savings: certificate setup that takes 1-2 hours in connected environments is reduced
to zero — the certificate is generated on first boot automatically.
Risk reduction: automatic renewal before expiry prevents certificate expiration outages,
which affected 22% of organizations in a 2023 survey (Venafi).
## Applications
- **Consumer**: N/A
- **Government / Defense**: Mandatory for air-gapped classified networks — the system must support TLS without any internet-dependent certificate provisioning.
API-OSS generates valid TLS 1.3 certificates on first boot in a SCIF with no network
connectivity of any kind.
- **Enterprise**: Zero-touch deployment in disconnected factory floors and remote sites — an edge deployment on an oil platform or mining site generates its own TLS certificate on power-up with no dependency on corporate PKI infrastructure.
