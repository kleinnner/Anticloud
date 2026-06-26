```
▄▄                            ██     ▄▄   ▄▄▄                  ▄▄           
████                ██         ▀▀     ██  ██▀                   ██           
████    ██▄████▄  ███████    ████     ██▄██      ▄████▄    ▄███▄██   ▄████▄  
██  ██   ██▀   ██    ██         ██     █████     ██▀  ▀██  ██▀  ▀██  ██▄▄▄▄██ 
██████   ██    ██    ██         ██     ██  ██▄   ██    ██  ██    ██  ██▀▀▀▀▀▀ 
▄██  ██▄  ██    ██    ██▄▄▄   ▄▄▄██▄▄▄  ██   ██▄  ▀██▄▄██▀  ▀██▄▄███  ▀██▄▄▄▄█ 
▀▀    ▀▀  ▀▀    ▀▀     ▀▀▀▀   ▀▀▀▀▀▀▀▀  ▀▀    ▀▀    ▀▀▀▀      ▀▀▀ ▀▀    ▀▀▀▀▀ 

ANTIKODE — terminal-native AI coding engine
Lois-Kleinner and 0-1.gg 2026 Copyright
```

# Encryption at Rest and in Transit

## Overview

ANTIKODE employs encryption to protect data both at rest (stored data) and in transit (data during download). This document describes the encryption mechanisms, their cryptographic foundations, and their operational configuration.

## Encryption at Rest

### .aioss Ledger

The .aioss ledger stores cryptographic hashes rather than raw content. However, the ledger file itself may contain metadata that users may wish to protect.

**Default State**: The ledger is stored in plain binary format at `.ANTIKODE/ledger/chain.dat`. It inherits the protection of the host OS filesystem (file permissions, disk encryption).

**Optional Full Encryption**: Users may enable ledger encryption, which encrypts each entry's metadata field using AES-256-GCM:

```toml
[ledger.encryption]
enabled = true
algorithm = "AES-256-GCM"
key_source = "keychain"  # Options: keychain, env, file
```

When enabled, the metadata in each entry is encrypted before writing to disk. The entry header, hashes, and timestamps remain unencrypted to enable chain verification. The encryption key is stored in the OS keychain by default.

### Model Files

Downloaded model files are stored in the user-configured model cache directory. These files contain pre-trained model parameters (tensor weights) and do not contain user data.

**Default State**: Model files are stored as downloaded (typically unencrypted). Users are encouraged to enable disk-level encryption (FileVault on macOS, BitLocker on Windows, LUKS on Linux) for the model cache directory.

**Integrity Verification**: Model files can be verified against published SHA-256 checksums to ensure they have not been tampered with:

```bash
antikode models verify --checksum sha256:expected_hash
```

### Configuration Files

ANTIKODE configuration files (`.ANTIKODE/config.toml`) may contain model paths and settings but do not contain credentials or secrets by default. Users should ensure appropriate filesystem permissions on the `.ANTIKODE` directory.

## Encryption in Transit

### Model Downloads

When users download models, ANTIKODE uses HTTPS (TLS 1.3) for all network communication:

- **Protocol**: TLS 1.3 (minimum)
- **Cipher Suites**: TLS_AES_256_GCM_SHA384 or TLS_CHACHA20_POLY1305_SHA256
- **Certificate Verification**: Full chain verification against system CA store
- **HSTS**: Enforced for download servers that support it

### Update Checks

If enabled, update checks use the same HTTPS/TLS 1.3 configuration as model downloads.

## Cryptographic Algorithm Selection

ANTIKODE uses the following cryptographic primitives:

| Algorithm | Purpose | Standard |
|-----------|---------|----------|
| SHA-256 | Hashing for ledger | FIPS 180-4 |
| AES-256-GCM | Optional ledger encryption | FIPS 197 / NIST SP 800-38D |
| Ed25519 | Anchor signing | RFC 8032 |
| TLS 1.3 | Transport security | RFC 8446 |
| ChaCha20-Poly1305 | Alternative cipher | RFC 8439 |

## Key Management

### Anchor Signing Keys

Keys for .aioss ledger anchoring are managed through the host OS keychain:

- **macOS**: Apple Keychain / Secure Enclave
- **Windows**: Windows Credential Manager / TPM
- **Linux**: secret-tool (libsecret) / TPM

Key generation:

```bash
antikode ledger init-key --key-type ed25519
```

### Encryption Keys

Keys for optional ledger encryption are managed similarly. The key is derived from the OS keychain and never stored in plain text.

## FIPS 140-2/140-3 Compliance

For federal deployments requiring FIPS validation:

- ANTIKODE can be configured to use FIPS-validated cryptographic modules
- SHA-256 is FIPS 140-2 approved
- AES-256 is FIPS 140-2 approved
- Ed25519 is not FIPS-approved; for FIPS modes, ECDSA with P-256 is used instead

FIPS mode is enabled through configuration:

```toml
[crypto]
fips_mode = true
```

When FIPS mode is enabled, non-approved algorithms are disabled and only FIPS-approved cryptographic primitives are available.

## Recommended Encryption Configuration

### Standard Security

```
ledger encryption: enabled
disk encryption: OS-level (FileVault/BitLocker/LUKS)
model verification: enabled
transport: TLS 1.3 (default)
```

### Maximum Security

```
ledger encryption: enabled with HSM-backed keys
disk encryption: OS-level with hardware-backed key
model verification: enforced (block if checksum mismatch)
transport: TLS 1.3 with certificate pinning
FIPS mode: enabled (if required)
```

## Works Cited

NIST. *Secure Hash Standard (SHS)*. FIPS PUB 180-4, 2015.

NIST. *Advanced Encryption Standard (AES)*. FIPS PUB 197, 2001.

NIST. *Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM)*. NIST Special Publication 800-38D, 2007.

Rescorla, Eric. "The Transport Layer Security (TLS) Protocol Version 1.3." *RFC 8446*, IETF, 2018.

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

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
