---
title: "Offline Model Signing (Ed25519)"
sidebar_position: 99
description: "Cryptographically signs models using Ed25519 key pairs entirely offline."
tags: [features]
---

# Offline Model Signing (Ed25519)

## What It Does
Cryptographically signs models using Ed25519 key pairs entirely offline.
Supports key generation, model signing, signature verification, and public key
export.
Provides a complete supply chain security solution for model distribution with
no certificate authority or cloud dependency.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading cryptographic
module configuration from `opencode.json` under the `model_security` section.
The Ed25519 implementation uses the `ed25519-dalek` Rust crate (v2.x), which
provides constant-time signature operations with no external dependencies and
FIPS 140-2 compatible key generation.
On first use, an operator generates a signing key pair via
`api-oss model generate-key`.

The module calls `ed25519_dalek::Keypair::generate()` using the OS random
number generator (`OsRng`).
The private key is encrypted at rest with AES-256-GCM using a key derived from
a user-provided passphrase via Argon2id.
The encrypted private key is stored in `./data/keys/signing/` while the public
key is exported to `./data/keys/public/` in both raw binary and PEM formats.

To sign a model, the operator runs `api-oss model sign --model my_model.gguf`.
The module reads the model file, computes SHA-256, then signs the hash with
the Ed25519 private key.
The signature (64 bytes), public key fingerprint, and signing timestamp are
stored in a ledger entry alongside the model metadata.
The model file itself is not modified — the signature and metadata live in the
ledger, enabling verification without altering model files.

To verify, the operator runs `api-oss model verify-sig --model my_model.gguf`.
The module reads the model's SHA-256, loads the corresponding ledger entry,
retrieves the stored signature and public key, and calls
`public_key.verify(hash, signature)`.
Verification returns the signer identity, timestamp, and whether the signature
is valid.

Public keys can be exported for sharing: `api-oss model export-public-key
--key my_key --format pem`.
Multiple signing keys are supported — organizations can have per-team or
per-environment keys.
Key revocation is handled by adding a revocation entry to the ledger;
verification checks the revocation list before accepting a signature.
All cryptographic operations run entirely offline with no network calls.

The 87 CLI commands include `model sign`, `model verify-sig`, `model
generate-key`, `model export-public-key`, `model list-keys`, and `model
revoke-key`.

## How to Operate
1. Generate a signing key pair: `api-oss model generate-key --name my_org_key`.
   Prompts for a passphrase used to encrypt the private key via Argon2id.
   Outputs: "Key pair generated. Public key: ./data/keys/public/my_org_key.pem"
2. Export public key: `api-oss model export-public-key --name my_org_key
   --format pem`. The PEM file can be shared with downstream consumers.
3. Sign a model: `api-oss model sign --model models/qwen2-vl-2b-q4.gguf
   --key my_org_key`. The signature (64 bytes) is recorded in the ledger.
4. Verify a model: `api-oss model verify-sig --model models/qwen2-vl-2b-q4.gguf`.
   Returns "Valid signature by my_org_key, signed 2026-05-30T12:00:00Z".
5. List keys: `api-oss model list-keys`. Shows all key names, fingerprints,
   creation dates, and revocation status.
6. Revoke a key: `api-oss model revoke-key --name compromised_key --reason
   "Key exposed in log". Adds a revocation ledger entry.
7. Batch sign all models: `api-oss model sign-all --key my_org_key`.
8. Require verification at boot in `opencode.json`:
   ```json
   {
     "model_security": {
       "require_signing": true,
       "trusted_public_keys": ["./data/keys/public/my_org_key.pem"]
   }
   }
   ```
   With this config, the gateway refuses to load any model without a valid
   signature from a trusted key.

## The Moat
- Ed25519 signing and verification run entirely offline — no CA or cloud
- Signatures stored in the immutable ledger for tamper-evident provenance
- Private keys encrypted at rest with AES-256-GCM and Argon2id
- Multiple key support for per-team and per-environment signing
- Key revocation via ledger entries
- No competitor offers cryptographic model signing with offline verification

## Why Choose API-OSS
OpenAI, Anthropic, and Nvidia do not offer cryptographic model signing — model
provenance relies on trust in the provider.
Palantir provides centralized signing via Foundry but requires cloud
infrastructure.
API-OSS enables any organization to sign models with Ed25519 and verify them
on any machine with the public key, no internet required.

## Competitive Comparison
- **OpenAI / Anthropic / Nvidia**: No cryptographic model signing.
- **Palantir**: Centralized signing via Foundry — not available offline.
- **Mercor**: No model provenance or signing capabilities.

## Cost-Benefit Analysis
In-house Ed25519 implementation costs ~$30K in engineering time.
Supply chain attacks cost an average of $4.5M per incident (IBM 2024).
Defense contractors require cryptographic signing — custom solutions cost
$50K+ to certify.
PKI alternatives require CA subscriptions ($200-$500/year/certificate).
API-OSS Ed25519 signing is free and offline.

## Applications
- **Consumer**: Sign and verify custom models before sharing.
- **Government / Defense**: End-to-end supply chain security for model
  acquisition in classified environments.
- **Enterprise**: Internal model signing for governance and audit compliance.

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