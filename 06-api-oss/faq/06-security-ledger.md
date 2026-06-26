---
title: "SECURITY & LEDGER — FREQUENTLY ASKED QUESTIONS"
sidebar_position: 6
description: "Each ledger entry contains the SHA-256 hash of the previous entry, forming a chain. Tampering with any entry changes its hash and breaks the chain. Verification is built in: `api-oss ledger verify`."
tags: [faq]
---

# SECURITY & LEDGER — FREQUENTLY ASKED QUESTIONS

## Is the .aioss ledger truly tamper-proof?

Each ledger entry contains the SHA-256 hash of the previous entry, forming a chain. Tampering with any entry changes its hash and breaks the chain. Verification is built in: `api-oss ledger verify`.

## Does API-SOS send my data anywhere?

Never. API-SOS has no telemetry, analytics, or cloud dependency. All data stays on your hardware.

## What happens if the ledger is tampered with?

The ledger verify command (`api-oss ledger verify`) will report the exact entry where the chain breaks. You can trace back to the last valid entry and identify which entry was altered.

## Can the ledger be encrypted?

The ledger files themselves are plain JSON (for portability). If you require encryption at rest, place the `data/ledger` directory on an encrypted filesystem (BitLocker, LUKS, FileVault).

## What is TPM attestation?

Trusted Platform Module attestation verifies that the system hardware and firmware have not been tampered with. API-SOS can integrate with TPM 2.0 to provide hardware-rooted trust for the ledger and decision outputs.

## How does model signing work?

Models can be signed with an Ed25519 keypair. The signature is verified at load time. If the model binary or signature is invalid, the gateway refuses to load it. See the ModelSigning view in the frontend.

## Are WebSocket connections encrypted?

Yes, if TLS is enabled in the config (`tls.enabled: true`). Without TLS, WebSocket connections are unencrypted (ws://) and should only be used on localhost or trusted networks.

## How do I rotate the ledger's time source?

Set `ledger.time_source` to `system` (default), `ntp`, or `custom`. If using `custom`, provide the offset via `ledger.time_offset_secs`. This is useful when the system clock is unreliable or deliberately skewed.

## What is the contradiction engine?

The contradiction engine is a three-layer system that scans decisions and outputs for logical inconsistencies, factual contradictions, and policy violations. It runs on a configurable interval (`contradiction_engine.scan_interval_ms`, default 60 seconds).

## See Also

Related FAQ, support, and troubleshooting documentation.

- [FAQ Index](../faq/01-general.md)
- [Support Guide](../support/01-getting-help.md)
- [Troubleshooting](../troubleshooting/01-app-wont-start.md)
- [User Manual](../user-manual/01-getting-started.md)

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