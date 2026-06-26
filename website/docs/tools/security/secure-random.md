---
sidebar_label: Secure Random
description: Generate cryptographically secure random numbers, strings, UUIDs, and byte sequences suitable for keys, tokens, salts, and nonces.
keywords: [cryptography, security, secure random, hash, encryption, verification, penetration testing, Anticloud]
image: /img/anticloud-social.png
---

# Secure Random

Secure Random provides a cryptographically strong random value generator for security-critical applications. It draws entropy from operating system sources to produce unpredictable output resistant to statistical and cryptographic attacks.

## Features

- Multiple Output Types: Generate integers, byte arrays, hex strings, Base64 tokens, and UUIDv4 values
- Configurable Length: Specify exact output size with support for arbitrary byte lengths
- Entropy Sources: Uses OS-level CSPRNG (/dev/urandom, CryptGenRandom, getrandom)
- Character Sets: Customize allowed characters for password and token generation
- Batch Generation: Produce multiple random values in a single operation with collision statistics

## Workflow

```mermaid
flowchart LR
    A[Generate Request] --> B[Entropy Collection]
    B --> C[CSPRNG Seed]
    C --> D[Output Formatting]
    D --> E[Random Value]
```

## Usage

View the full documentation on GitHub: [Tool Directory](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/secure-random)

## Related Tools

- [Encrypt Text](../security/encrypt-text)
- [TOTP Generator](../security/totp-generator)
- [Passphrase Generator](../utilities/passphrase-generator)

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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
