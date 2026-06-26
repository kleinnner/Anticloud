---
title: "Privacy-Preserving Private Set Intersection (PSI)"
sidebar_position: 99
description: "Cryptographic protocol that allows two parties to find the intersection of their datasets"
tags: [features]
---

# Privacy-Preserving Private Set Intersection (PSI)

## What It Does
Cryptographic protocol that allows two parties to find the intersection of their datasets
without revealing non-overlapping data.
Enables collaborative analysis across organizations without either party exposing
sensitive records to the other.
## How It Works
PSI is implemented in the Rust module `ai-oss-gateway/src/psi.rs` using an ECDH-based
protocol built on `curve25519-dalek` for elliptic curve operations.
The protocol begins when one API-OSS instance sends a `psi_start` WebSocket message to a
peer instance on port 3030.
Each instance blinds its dataset elements by hashing them to curve points and multiplying
by a private scalar.
The blinded sets are exchanged, and each party applies its own scalar to the received
blinded set.
The intersection is revealed by comparing the double-blinded values — matching values
indicate common elements.
The protocol supports both semi-honest security (ECDH-PSI) and malicious security
(OT-based PSI with oblivious transfer extension).
For large datasets exceeding 100,000 elements, the system falls back to a circuit-based
PSI approach that uses garbled circuits for better asymptotic performance.
The intersection result is returned via `psi_result` WebSocket messages and stored in
`data/graph.db` (SQLite WAL) as a first-class graph entity.
Every PSI session is recorded in the immutable ledger at `data/ledger/` in `.aioss` format
for auditability.
Configuration for PSI sessions — including peer addresses, allowed datasets, and
protocol parameters — is driven by `opencode.json` at the root level and the gateway
configuration layer.
The gateway is started via `api-oss start` or by invoking the single binary directly.
TLS 1.3 between peers is handled by auto-generated self-signed certificates via `rcgen`
and `rustls`, requiring no LetsEncrypt dependency.
Because all cryptographic operations use pure Rust crates, the entire feature works fully
air-gapped with no internet access.
## How to Operate
1.
**Open the PsiView** frontend at `https://localhost:8081/psi` (HTTP UI served on port 8081).
This view manages PSI session lifecycle, peer connection configuration, and result
inspection.
2.
**Configure a peer** by providing the remote instance's WebSocket URL and optional bearer token (generated via `api-oss auth generate`).
3.
**Initiate a session** by clicking "Start PSI" — this sends a `psi_start` message over the WebSocket to port 3030 of the peer.
4.
**Monitor progress** in the real-time status panel — the Rust engine streams progress updates as blinding, exchange, and intersection phases complete.
5.
**Inspect the result** once the `psi_result` message is received — matching elements are displayed with context from both datasets.
6.
**Alternatively, use the CLI**: `api-oss psi start --peer wss://peer-instance:3030 --dataset my_set` launches a headless PSI session.
The CLI supports 87 total commands across 9 subcommand groups (auth, service, sync,
backup, etc.).
7.
**Audit the session** by checking `data/ledger/` for the `.aioss` ledger entry recording the PSI interaction with cryptographic proof of execution.
## The Moat
- **Cryptographic guarantee, not trust**: The protocol uses `curve25519-dalek` for ECDH blinding and optional OT extension for malicious security.
No data leaves either party's instance except cryptographically blinded elements —
mathematical guarantees replace legal agreements.
- **Local-first architecture**: All computation runs locally in the Rust engine.
No third party facilitates the intersection.
This eliminates the need for a trusted intermediary.
- **No plaintext data exchange**: Even the intersection elements are never transmitted in plaintext unless both parties choose to reveal them after the protocol completes.
- **Air-gapped operation**: The entire PSI protocol runs offline.
Peer instances connect directly via WebSocket on port 3030 with TLS 1.3 — no cloud relay
or coordination server required.
- **Tamper-proof audit trail**: Every PSI session is recorded in `data/ledger/` with `.aioss` format, providing cryptographic proof of what was intersected and when.
- **Pure Rust stack**: No OpenSSL, no external crypto libraries.
The `curve25519-dalek` crate is formally verified against the X25519 RFC.
## Why Choose API-OSS
PSI enables collaboration that is impossible with any competing platform.
When two organizations need to join datasets — fraud analysts at competing banks,
intelligence agencies in allied nations, pharmaceutical companies in joint research — no
other vendor provides a cryptographic protocol that runs entirely on-premises without data
leaving either party's control.
Competitors either require data to be uploaded to their cloud (destroying privacy) or
provide no intersection capability at all.
API-OSS delivers production-grade PSI as a built-in, zero-cost feature of a single binary
deployment.
## Competitive Comparison
- **Palantir**: No PSI capability — Foundry requires all data to be aggregated in a single instance.
Cross-organization collaboration means both parties upload full datasets to Palantir's
cloud.
- **OpenAI**: No PSI — data must be shared in plaintext if collaboration is needed.
The platform provides no cryptographic intersection protocols.
- **Snowflake**: No PSI — data sharing via Snowflake requires full table visibility between accounts.
No privacy-preserving join capability.
- **Anthropic**: No PSI — no multi-party computation capabilities of any kind.
## Cost-Benefit Analysis
Implementing PSI in-house requires hiring cryptographic engineers (annual cost $400k-$600k
for a team of two) and auditing a custom protocol implementation ($100k-$200k for a formal
security review).
Cloud competitors like Palantir would charge $1M+/yr for a custom Foundry deployment that
still does not provide PSI — data must be shared in plaintext.
Snowflake's data sharing feature requires both parties to have Snowflake accounts
($2k-$20k/mo each) and exposes full datasets.
API-OSS provides PSI at zero additional cost — it is included in the free, single-binary
deployment.
The time savings are substantial: what would take 6-12 months of engineering effort to
build and audit is immediately available.
Risk reduction is significant — data breach exposure is eliminated because raw data
never leaves either party's infrastructure.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Intersect watchlists across allied nations without revealing full intelligence holdings.
Each nation blinds its list, exchanges with allies, and learns only the common persons of
interest.
- **Enterprise**: Fraud detection across competing banks — Bank A and Bank B intersect customer accounts flagged for suspicious activity without exposing their full customer base.
Healthcare research consortia intersect patient cohorts without violating HIPAA.

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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