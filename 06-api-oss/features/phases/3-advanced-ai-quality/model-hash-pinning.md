---
title: "Model Hash Pinning"
sidebar_position: 99
description: "Records SHA-256 hashes of model files in the immutable ledger at import time."
tags: [features]
---

# Model Hash Pinning

## What It Does
Records SHA-256 hashes of model files in the immutable ledger at import time.
Verifies hashes at every boot to detect tampering.
Blocks execution if hash mismatch is detected.
Provides tamper-evident model provenance with cryptographic guarantees.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading configuration
from `opencode.json`.
The hash pinning module integrates with the ledger subsystem — specifically the
`LedgerEntry` trait which provides the `commit()` and `verify()` methods used
for all integrity-checked storage.
When a model is imported — through the CLI (`model import`), the HTTP UI on
port 8081, or the modelfile system — the module computes the SHA-256 hash of
the entire model file using the `sha2` Rust crate.

The hash, along with the model filename, file size, import timestamp, and
operator identity, is recorded as a ledger entry.
The ledger entry is signed with the node's Ed25519 identity key, chained to
the previous ledger entry via its hash, and stored in `./data/ledger/`.
On every subsequent boot, before the gateway loads any model, the pinning
module recomputes the SHA-256 of each registered model file and compares it
against the ledger entry.

If the hashes match, the model is approved for loading and inference proceeds
normally.
If the hashes differ, the gateway refuses to load the model, logs a critical
alert with the expected vs. actual hash, and emits a `model_tamper_detected`
event over WebSocket to port 3030.
The event includes the model name, expected hash, actual hash, and the
timestamp of the last valid verification.

The gateway can be configured to shut down entirely on tamper detection
(`"shutdown_on_tamper": true` in `opencode.json`) or to continue running with
non-tampered models while marking the tampered model as unavailable.
Hash verification also runs on scheduled intervals if configured:
`"verification_interval_minutes": 60` checks all pinned models every hour.
Verification results are themselves recorded as ledger entries, creating an
audit trail of every integrity check.

Multiple replicas or backups of the same model file are tracked individually —
each file path gets its own hash entry.
The 87 CLI commands include `model pin`, `model verify`, `model
verify-schedule`, and `model pin-status`.
The frontend displays hash pinning status in the Model Registry view, showing
each model with its hash, last verified timestamp, and verification result.
A tamper-detected model is highlighted in red with a warning icon.

## How to Operate
1. Pin a model on import: `api-oss model import --file model.gguf`.
   The import automatically computes SHA-256 and records it in the ledger with
   a `model_pin` entry containing hash, filename, size, and operator identity.
2. Verify all pinned models: `api-oss model verify`.
   Shows each model with hash match or mismatch status. Returns exit code 0 if
   all pass, 1 if any fail.
3. Verify a specific model: `api-oss model verify --model my_model.gguf`.
4. Configure boot verification in `opencode.json`:
   ```json
   {
     "model_security": {
       "hash_pinning": {
         "enabled": true,
         "verify_on_boot": true,
         "shutdown_on_tamper": false,
         "verification_interval_minutes": 60
       }
     }
   }
   ```
5. Remove a pin after intentional update: `api-oss model unpin --model my_model
   --reason "Updated to v2"`.
6. View pinning history: `api-oss ledger query --type model_pin`. Returns all
   pin, verify, and unpin events with timestamps and operator identities.
7. Schedule verification: `api-oss model schedule-verify --interval 120`.

## The Moat
- Cryptographic hash pinning anchored in the immutable ledger
- Verification before any inference — compromised models never execute
- No competitor offers ledger-bound hash verification for model files
- Scheduled verification provides continuous integrity monitoring
- Tamper detection events broadcast in real-time over WebSocket
- Shutdown-on-tamper provides fail-closed security

## Why Choose API-OSS
Palantir tracks model provenance centrally in Foundry's cloud, requiring
connectivity.
OpenAI, Anthropic, and Nvidia offer no hash pinning.
API-OSS pins every model's SHA-256 in a local, immutable ledger and verifies
it at every boot.
Even if an attacker gains filesystem access, the gateway detects tampering
before any inference occurs.

## Competitive Comparison
- **Palantir**: Model provenance tracking exists but is centralized in
  Foundry's cloud.
- **OpenAI / Anthropic / Nvidia**: No model hash pinning or local tamper
  detection.
- **Mercor**: No model provenance tooling.

## Cost-Benefit Analysis
In-house hash pinning implementation costs ~$15K in engineering time for the
SHA-256 computation, ledger integration, boot verification, and event logging.
A model tampering incident costs an average of $500K to investigate and
remediate (IBM Cost of a Data Breach 2024). For AI systems, tampered models
can produce subtly incorrect outputs that compound over time — detection within
minutes vs. weeks dramatically reduces blast radius.
Hash pinning detects tampering instantly at boot and every N minutes
thereafter. Without it, a tampered model could run for days before discovery.
Defense contractors require per-boot integrity verification per DFARS 252.204-
7012 — custom solutions cost $30K+ to certify. API-OSS satisfies this
requirement immediately with no additional certification cost.
Continuous monitoring replaces periodic manual hash checks: 1 hour/week of
operator time ($5K/year) saved.

## Applications
- **Consumer**: Ensure downloaded models haven't been tampered with.
- **Government / Defense**: Guarantee model integrity in classified deployments.
- **Enterprise**: Supply chain security — verify model provenance from any
  source.

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
