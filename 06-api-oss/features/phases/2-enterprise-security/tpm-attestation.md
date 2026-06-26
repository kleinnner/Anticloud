---
title: "TPM Attestation"
sidebar_position: 99
description: "Hardware-level trust via TPM 2.0 with remote attestation and boot integrity verification."
tags: [features]
---

# TPM Attestation

## What It Does
Hardware-level trust via TPM 2.0 with remote attestation and boot integrity verification.
Proves to a remote verifier that the system is running untampered software on trusted
hardware — providing a hardware root of trust that software-only solutions cannot match.
## How It Works
TPM attestation is implemented in the Rust module `ai-oss-gateway/src/tpm.rs`.
On Linux, communication with the TPM 2.0 chip occurs via `/dev/tpm0` using the Linux TPM
device driver interface.
On Windows, the system uses the TBS (TPM Base Services) API.
The module wraps the TPM's command set — including `TPM2_Quote` for generating signed
attestation quotes, `TPM2_PCR_Read` for reading Platform Configuration Register values,
and `TPM2_GetRandom` for hardware random number generation.
The attestation flow uses a challenge-response protocol: a remote verifier sends a
`get_attestation` WebSocket message to port 3030 containing a 32-byte nonce.
The Rust engine generates a TPM quote using `TPM2_Quote`, which cryptographically signs
the current PCR values along with the nonce using the TPM's Attestation Identity Key
(AIK).
The signed quote, PCR values, and AIK certificate are returned in the `attestation_result`
message.
The remote verifier can then validate: the signature using the AIK public key (proving the
quote came from a genuine TPM), the nonce (preventing replay attacks), and the PCR values
against known-good measurements (proving the exact software and configuration state).
The CLI (`api-oss tpm attest` — generate attestation quote, `api-oss tpm verify <quote>`
— verify against known good values, `api-oss tpm status` — display TPM capabilities)
provides terminal access as part of 87 CLI commands across 9 subcommand groups (auth,
service, sync, backup, etc.).
TPM attestation integrates with the secrets management module — if `tpm.seal_master_key:
true` is configured in `opencode.json`, the master encryption key is sealed to the TPM and
released only when the expected PCR values are met, ensuring that encryption keys are only
available when the system is in a known-good state.
The HTTP UI on port 8081 renders TPM status and attestation history.
All attestation events are recorded in the immutable ledger at `data/ledger/` in `.aioss`
format.
The gateway runs as a single binary via `api-oss start`, fully air-gapped.
## How to Operate
1.
**Verify TPM presence**: Run `api-oss tpm status` to check TPM 2.0 availability, manufacturer, firmware version, and supported capabilities.
2.
**Generate an attestation**: `api-oss tpm attest` produces a signed quote with current PCR values.
For remote attestation, include a nonce: `api-oss tpm attest --nonce $(openssl rand -hex
32)`.
3.
**Verify remotely**: On a separate machine, run `api-oss tpm verify --quote quote.json --expected-pcrs known-good-pcrs.json`.
The verifier checks the TPM signature, nonce freshness, and PCR match.
4.
**Monitor via WebSocket**: A remote verifier sends `{"type": "get_attestation", "nonce": "..."}` to `wss://<instance>:3030` and receives the attestation result.
5.
**View attestation history**: Open `https://localhost:8081/tpm` to see a timeline of all attestation events and their verification status.
6.
**Configure TPM binding**: In `opencode.json`, set `tpm.seal_master_key: true` and `tpm.pcr_selection: [7, 11]` to bind encryption keys to the TPM.
7.
**Audit**: Check `data/ledger/` for `.aioss` entries recording every attestation request and result.
## The Moat
- **Hardware root of trust, not software**: TPM attestation is anchored in a dedicated cryptographic chip physically soldered to the motherboard.
Software-only trust models can be defeated by modifying the OS or hypervisor — TPM
attestation cannot be bypassed in software.
- **Tamper-evident boot chain**: PCR values measure every component from BIOS/UEFI through bootloader to kernel and initramfs.
Any modification to the boot chain changes PCR values, causing attestation to fail.
- **Nonce-based challenge-response**: Each attestation uses a fresh nonce, preventing replay attacks.
A captured attestation quote cannot be reused.
- **Integration with encryption stack**: TPM-sealed encryption keys are only released when PCR values match known-good measurements.
If the system is compromised, encryption keys are unavailable.
- **Physical TPM 2.0 requirement**: TPM attestation requires a physical TPM 2.0 chip — fTPM (firmware TPM) and software TPMs are detected and refused.
This guarantees hardware-level security.
- **Air-gapped verification**: The verifier can operate on a completely separate network.
Attestation quotes are transferred via signed files on portable media if needed.
## Why Choose API-OSS
No competitor in the AI platform space provides TPM-based hardware attestation.
Palantir offers software-only trust models.
OpenAI provides no attestation capability at all.
For classified government deployments where hardware root of trust is mandatory, API-OSS
is the only AI platform that can prove it is running genuine, untampered software on
trusted hardware.
For enterprise compliance, TPM attestation provides cryptographic proof that the AI system
meets its security configuration requirements.
## Competitive Comparison
- **Palantir**: Software-only trust model — no hardware root of trust.
Cannot prove that the deployed software matches the expected version.
- **OpenAI**: Cloud-only — no attestation available.
Users have no visibility into the software state of the servers running their workloads.
- **Snowflake**: No attestation capability.
Data warehouse infrastructure is opaque to customers.
- **Anthropic**: No attestation.
## Cost-Benefit Analysis
Building a TPM attestation system in-house requires: TPM driver development (3-6 months),
attestation protocol design (2-4 months), security audit ($50k-$100k), and ongoing
maintenance.
Most organizations cannot build this — they rely on cloud vendor trust.
API-OSS provides production-grade TPM attestation at zero additional cost, included in the
single binary.
Risk reduction: TPM attestation prevents the most sophisticated supply chain attacks —
an attacker who replaces the API-OSS binary on disk is immediately detected on next
attestation.
For classified deployments, TPM attestation is often a mandatory requirement that no other
AI platform can satisfy.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Required for classified deployments — proves that the sovereign AI system is running the approved software version on trusted hardware.
Mandatory for NATO and Five Eyes intelligence sharing agreements where hardware trust is a
prerequisite.
- **Enterprise**: Compliance verification for regulated industries — pharmaceutical companies can prove to regulators that their AI system for drug discovery is running verified software.
Hardware-bound key release for secrets management.

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
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20782230
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/06-api-oss
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/api-oss-fixed
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