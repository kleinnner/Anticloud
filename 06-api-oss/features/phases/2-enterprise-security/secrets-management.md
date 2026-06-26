---
title: "Secrets Management"
sidebar_position: 99
description: "Encrypted secrets store with environment-specific configuration, atomic rotation support,"
tags: [features]
---

# Secrets Management

## What It Does
Encrypted secrets store with environment-specific configuration, atomic rotation support,
and optional hardware binding via TPM 2.0.
API keys, database credentials, service tokens, and any sensitive configuration values are
stored encrypted at rest with AES-256-GCM envelope encryption.
## How It Works
Secrets management is implemented in the Rust module `ai-oss-gateway/src/secrets.rs`.
The secrets store is backed by an encrypted SQLite database in `data/graph.db` with a
separate encrypted table for secret values.
Each secret is encrypted using AES-256-GCM with a per-secret key derived from a master
encryption key via HKDF-SHA256.
The master key itself can be optionally sealed to a physical TPM 2.0 chip — if
`tpm.seal_master_key: true` is set in `opencode.json`, the master key is wrapped by the
TPM's storage root key (SRK) and bound to specific PCR values (platform configuration
registers).
This means if the secrets database is copied off the machine, it cannot be decrypted
without access to the original TPM hardware with the same PCR state.
Secrets are organized into environments (dev, staging, production) — each environment
has its own encrypted secret scope.
Secret rotation is atomic: when `secrets rotate <key>` is invoked, a new version of the
secret is generated, but the old version remains valid until the rotation window closes
(configurable via `rotation_window: "24h"` in `opencode.json`).
During the window, both old and new secrets are accepted — ensuring zero-downtime
rotation for services that cache credentials.
The CLI (`api-oss secrets list`, `api-oss secrets set`, `api-oss secrets get`, `api-oss
secrets rotate`, `api-oss secrets unset`) provides full management, one of 87 CLI commands
across 9 subcommand groups (auth, service, sync, backup, etc.).
WebSocket messages to port 3030 (`secret_set`, `secret_get`, `secret_rotate`,
`secret_delete`) enable programmatic access.
The HTTP UI at `https://localhost:8081/secrets` renders a secrets management dashboard.
All secret operations are recorded in the immutable ledger at `data/ledger/` in `.aioss`
format — recording which secrets were accessed, rotated, or deleted, but never exposing
the secret values themselves.
The gateway runs as a single binary via `api-oss start`, fully air-gapped with no internet
required.
## How to Operate
1.
**Set a secret**: `api-oss secrets set --name db_password --env production --value "my-secret"` stores the value encrypted at rest.
2.
**Retrieve a secret**: `api-oss secrets get --name db_password --env production` decrypts and displays the value (only in terminal, never logged).
3.
**Rotate a secret**: `api-oss secrets rotate --name db_password --env production` generates a new encrypted version.
The old version remains valid for the rotation window.
4.
**Bind to TPM**: Configure `opencode.json` with `tpm.seal_master_key: true` and `tpm.pcr_selection: [7, 11]`.
On next startup, the master key is sealed to TPM PCR values — secrets cannot be
decrypted if the TPM state changes.
5.
**Manage via UI**: Open `https://localhost:8081/secrets` for a visual secrets manager with rotation status and audit log.
6.
**Audit secret access**: Check `data/ledger/` for `.aioss` entries recording secret access events (without exposing values).
7.
**Test TPM binding**: `api-oss tpm attest` verifies TPM connectivity; `api-oss secrets verify-sealed` confirms the master key is TPM-bound.
## The Moat
- **Hardware-bound encryption**: With TPM sealing, secrets cannot be decrypted off the original hardware.
A stolen database backup is useless without the specific TPM 2.0 chip and correct PCR
state.
- **Atomic zero-downtime rotation**: Secret rotation uses a transition window where both old and new values are accepted.
Services continue operating during rotation — no downtime, no coordination.
- **AES-256-GCM with per-secret keys**: Each secret gets its own encryption key derived from the master key via HKDF.
Compromise of one secret's decryption does not expose others.
- **Environment isolation**: Secrets for dev, staging, and production are stored in separate encrypted scopes.
A developer with access to dev secrets cannot read production secrets.
- **Immutable audit without value exposure**: Every secret access, creation, rotation, and deletion is logged to `data/ledger/` — but the actual secret values are never written to the ledger.
- **Pure Rust crypto**: All encryption uses `aes-gcm`, `hkdf`, and `sha2` Rust crates.
No OpenSSL dependency.
## Why Choose API-OSS
Cloud vendors provide secrets management as a separate service with per-secret or
per-operation pricing — AWS Secrets Manager costs $0.40/secret/month plus $0.05 per
10,000 API calls.
OpenAI provides no secrets management.
Palantir Foundry's secrets management is cloud-dependent with per-environment licensing.
API-OSS provides a complete, hardware-bound secrets management system as a built-in
feature at zero additional cost.
The TPM binding option is unique among AI platforms — no competitor offers
hardware-backed key protection for AI system secrets.
## Competitive Comparison
- **OpenAI**: No secrets management — users store API keys in their own infrastructure.
No encryption, no rotation support.
- **Palantir**: Secrets via Foundry, cloud-dependent.
Per-environment licensing adds cost.
No TPM binding.
- **Snowflake**: Key management via cloud KMS (AWS KMS, Azure Key Vault, GCP KMS) — requires cloud infrastructure and per-key costs.
- **Anthropic**: No secrets management.
## Cost-Benefit Analysis
Cloud secrets management services cost $0.40/secret/month (AWS Secrets Manager) plus API
call costs.
A deployment with 50 secrets costs $240/year plus API usage.
Hardware Security Module (HSM) integration for key protection costs $5k-$15k/year.
API-OSS provides equivalent secrets management with optional TPM binding at zero
additional cost.
Time savings: implementing zero-downtime secret rotation in-house requires 2-4 weeks of
engineering.
Risk reduction: TPM-bound secrets prevent data breach from physical server theft — even
if the hard drive is removed, secrets remain encrypted without the TPM.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Classified system credentials managed with hardware-bound keys on TPM-equipped machines.
If a server is physically compromised, secrets cannot be extracted without the TPM chip.
- **Enterprise**: Centralized secrets management for AI pipeline credentials — database passwords, API keys for external services, and service tokens are all stored encrypted with automatic rotation and full audit.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com