▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

────────────────────────────────────────────────────────────────

# End-to-End Encryption

**Category:** Privacy
**File:** 02-e2e-encryption.md
**Revision:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Ed25519 Signing Architecture](#ed25519-signing-architecture)
3. [SHA3-256 Hashing](#sha3-256-hashing)
4. [Encryption Architecture](#encryption-architecture)
5. [Key Management](#key-management)
6. [Message Encryption Flow](#message-encryption-flow)
7. [P2P Channel Encryption](#p2p-channel-encryption)
8. [At-Rest Encryption](#at-rest-encryption)
9. [Cryptographic Primitives Summary](#cryptographic-primitives-summary)
10. [References](#references)

---

## Overview

Libern implements a comprehensive end-to-end encryption (E2EE) architecture built on three cryptographic primitives: **Ed25519** for digital signatures, **SHA3-256** for hash chaining, and **X25519** for key exchange. Unlike platforms that claim E2EE but control the key infrastructure, Libern's E2EE is fully client-side with no central key server.

---

## Ed25519 Signing Architecture

### Key Generation

```rust
use ed25519_dalek::{SigningKey, VerifyingKey, Signature, Signer, Verifier};
use rand::rngs::OsRng;

pub fn generate_keypair() -> (SigningKey, VerifyingKey) {
    let mut secret_bytes = [0u8; 32];
    OsRng.fill_bytes(&mut secret_bytes);
    let signing_key = SigningKey::from_bytes(&secret_bytes);
    let verifying_key = signing_key.verifying_key();
    (signing_key, verifying_key)
}
```

### Signing Messages

```rust
fn sign_message(signing_key: &SigningKey, message: &Message) -> Signature {
    let payload = serialize_canonical(message);
    signing_key.sign(&payload)
}
```

### Verifying Messages

```rust
fn verify_message(verifying_key: &VerifyingKey, message: &Message, signature: &Signature) -> bool {
    let payload = serialize_canonical(message);
    verifying_key.verify(&payload, signature).is_ok()
}
```

---

## SHA3-256 Hashing

```rust
use sha3::{Digest, Sha3_256};

pub fn compute_binary_hash(&self) -> [u8; 32] {
    let bytes = self.to_bytes();
    let mut hasher = Sha3_256::new();
    hasher.update(&bytes[0..72]);
    hasher.update(&bytes[104..]);
    hasher.finalize().into()
}
```

### Why SHA3-256

| Property | SHA-256 | SHA3-256 |
|----------|---------|----------|
| Algorithm | Merkle-Damgard | Sponge construction |
| NIST standard | FIPS 180-4 | FIPS 202 |
| Length extension | Vulnerable | Resistant |
| Performance | Faster | Slower |

---

## Encryption Architecture

### Key Exchange: X25519

```
Peer A                           Peer B
  |-- X25519 public key A -------->|
  |<-- X25519 public key B --------|
  | Compute shared_secret =        |
  |   X25519(priv_A, pub_B)        |
  |                                | Compute shared_secret =
  |                                |   X25519(priv_B, pub_A)
  | Derive session key via HKDF    |
  | Encrypted communication begins |
```

### Session Encryption: AES-256-GCM

- **Algorithm:** AES-256 in Galois/Counter Mode
- **Key size:** 256 bits (derived via HKDF)
- **Nonce:** 96-bit random per message
- **AAD:** Channel ID, author ID, HLC timestamp
- **Authentication tag:** 128-bit GCM tag

### Perfect Forward Secrecy

- Ephemeral X25519 keypair per session
- Ephemeral private key wiped after session ends
- Compromise of long-term key does not compromise past sessions

---

## Key Management

| Key | Size | Purpose | Storage | Duration |
|-----|------|---------|---------|----------|
| Ed25519 identity private | 32 B | Signing | SQLite (encrypted) | Permanent |
| Ed25519 identity public | 32 B | Verification | SQLite (plain) | Permanent |
| X25519 long-term private | 32 B | P2P auth | SQLite (encrypted) | Permanent |
| X25519 ephemeral private | 32 B | PFS | Memory | Session |
| AES-256 session key | 32 B | Encryption | Memory | Session |

### Key Derivation

```
PRK = HMAC-SHA256(salt, X25519_shared_secret)
session_key = HKDF-Expand(PRK, "libern-p2p-session-v1", 32)
```

---

## Message Encryption Flow

### Sending

```
1. User composes message
2. Create Message struct with content, channel_id, HLC timestamp
3. Ed25519 sign: signature = signing_key.sign(canonical_payload)
4. Optional E2EE:
   - If channel has E2EE enabled:
     a. Look up session key for each peer
     b. ciphertext = AES-256-GCM.encrypt(session_key, nonce, payload, aad)
     c. Append nonce and auth tag
5. Store in local SQLite
6. Append to .aioss ledger
7. Broadcast to peers via WebSocket
```

### Receiving

```
1. Receive via WebSocket
2. Optional decrypt:
   - If E2EE enabled, decrypt with session key
   - Verify AES-256-GCM auth tag
3. Verify Ed25519 signature
4. Update local HLC
5. Apply CRDT merge
6. Append to local .aioss ledger
```

---

## P2P Channel Encryption

### Channel Encryption Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **Plain** | Ed25519 signatures only | Public channels |
| **Signed** | Ed25519 + plaintext | Trusted LAN |
| **E2EE** | X25519 + AES-256-GCM | Sensitive channels |

---

## At-Rest Encryption

### Private Key Encryption

```
encrypted_key = AES-256-GCM.encrypt(
    key = derive_from_passphrase(user_passphrase),
    plaintext = ed25519_seed_32_bytes,
    nonce = random_12_bytes
)
```

Argon2id parameters:
- Memory: 64 MB
- Iterations: 3
- Parallelism: 4

---

## Cryptographic Primitives Summary

| Primitive | Algorithm | Key/Output | Standard | Crate |
|-----------|-----------|------------|----------|-------|
| Digital signature | Ed25519 | 64 B sig, 32 B key | RFC 8032 | `ed25519-dalek` v2 |
| Hash (primary) | SHA3-256 | 32 B | FIPS 202 | `sha3` v0.10 |
| Hash (legacy) | SHA-256 | 32 B | FIPS 180-4 | `sha2` v0.10 |
| Key exchange | X25519 | 32 B keys | RFC 7748 | `x25519-dalek` |
| Symmetric encryption | AES-256-GCM | 32 B key | NIST SP 800-38D | `aes-gcm` |
| Key derivation | HKDF-SHA256 | Variable | RFC 5869 | `hkdf` |
| Password KDF | Argon2id | Variable | RFC 9106 | `argon2` |
| RNG | OS CSPRNG | N/A | NIST SP 800-90A | `rand` v0.8 |

---

## Encryption Protocol Details

### X25519 Key Exchange in Detail

```
Peer A generates:
  - ephemeral_priv_a = random 32 bytes (OsRng)
  - ephemeral_pub_a = X25519(ephemeral_priv_a, BASE_POINT)

Peer B generates:
  - ephemeral_priv_b = random 32 bytes (OsRng)
  - ephemeral_pub_b = X25519(ephemeral_priv_b, BASE_POINT)

Exchange:
  Peer A ──(ephemeral_pub_a)──► Peer B
  Peer A ◄──(ephemeral_pub_b)── Peer B

Both compute:
  shared_secret = X25519(ephemeral_priv_a, ephemeral_pub_b)
                = X25519(ephemeral_priv_b, ephemeral_pub_a)

Key Derivation:
  prk = HKDF-Extract(salt=random_16_bytes, ikm=shared_secret)
  session_key = HKDF-Expand(prk, info="libern-p2p-session-v1", length=32)
  nonce_prefix = HKDF-Expand(prk, info="libern-p2p-nonce-v1", length=8)

Session key is used for AES-256-GCM.
Nonce = nonce_prefix (8 bytes) || counter (4 bytes, big-endian)
```

### AES-256-GCM Encryption

```rust
fn encrypt_message(session_key: &[u8; 32], plaintext: &[u8], aad: &[u8]) -> Vec<u8> {
    use aes_gcm::{Aes256Gcm, Key, Nonce};
    use aes_gcm::aead::{Aead, KeyInit};

    let key = Key::<Aes256Gcm>::from_slice(session_key);
    let cipher = Aes256Gcm::new(key);

    let mut nonce_bytes = [0u8; 12];
    rand::RngCore::fill_bytes(&mut rand::rngs::OsRng, &mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    let ciphertext = cipher.encrypt(nonce, plaintext)
        .expect("Encryption failed");

    let mut result = Vec::new();
    result.extend_from_slice(&nonce_bytes);      // 12 bytes
    result.extend_from_slice(&ciphertext);        // ciphertext + 16 byte tag
    result
}
```

### Deniability

Libern's encryption provides deniability (like Signal's):
- No digital signatures on encrypted content (only on the outer message envelope)
- Session keys are ephemeral and not stored long-term
- Recipient cannot prove to a third party that a specific sender sent a specific message

However, the Ed25519 signatures on the outer message envelope provide non-repudiation for the message metadata (who sent it, when, to which channel).

## Future Cryptography Roadmap

| Feature | Timeline | Description |
|---------|----------|-------------|
| Post-quantum signatures | 2027 | FIPS 205 (SLH-DSA) or FIPS 206 (ML-DSA) |
| Messaging Layer Security (MLS) | 2027 | RFC 9180, efficient group messaging |
| End-to-end encryption final | 2026 | Full E2EE for all P2P channels |
| Metadata protection | 2027 | Private presence, private group membership |
| Forward secrecy audit | 2026 | Third-party cryptographic audit |

## Cryptographic Key Lifecycle

### Key Generation

```
┌─────────────────────────────────────┐
│        Ed25519 Key Generation        │
│                                      │
│  OsRng (CSPRNG)                      │
│    │                                 │
│    ▼                                 │
│  32-byte seed ──► SigningKey         │
│                    │                 │
│                    ▼                 │
│              VerifyingKey            │
│                    │                 │
│                    ▼                 │
│  Storage:                            │
│  ├── Private key: SQLite (encrypted) │
│  └── Public key: SQLite + .aioss    │
└─────────────────────────────────────┘
```

### Key Usage

| Operation | Key Used | Algorithm | Frequency |
|-----------|----------|-----------|-----------|
| Sign message | Ed25519 private | Ed25519 | Per message |
| Verify message | Ed25519 public | Ed25519 | Per message received |
| P2P handshake | Ed25519 + X25519 | Challenge-response | Per connection |
| Session key exchange | X25519 ephemeral | X25519 ECDH | Per P2P session |
| Encrypt message | AES-256-GCM session | AES-256-GCM | Per message (E2EE) |
| Decrypt message | AES-256-GCM session | AES-256-GCM | Per message (E2EE) |

### Key Destruction

```rust
pub fn destroy_session_keys(keys: &mut SessionKeys) {
    // Zero out ephemeral private keys
    for byte in &mut keys.ephemeral_private {
        *byte = 0;
    }
    // Zero out session keys
    for byte in &mut keys.session_key {
        *byte = 0;
    }
    // Zero out nonce counter
    keys.nonce_counter = 0;
    // Memory will be reclaimed by Rust's memory safety
}
```

## Cipher Suite Support

Libern's cryptographic implementations support the following cipher suites:

| Suite | Algorithm | Status | Use Case |
|-------|-----------|--------|----------|
| `TLS_AES_256_GCM_SHA384` | AES-256-GCM | Planned | P2P transport (future) |
| `X25519_Ed25519` | X25519 ECDH + Ed25519 | ✓ Active | P2P key exchange |
| `AES256GCM_SHA3` | AES-256-GCM + SHA3-256 | ✓ Active | Message encryption |
| `Ed25519_SHA3` | Ed25519 + SHA3-256 | ✓ Active | Signatures + hashing |
| `X25519Kyber768` | X25519 + Kyber-768 | Research | Post-quantum (future) |

### Crypto Agility

Libern's architecture supports crypto agility — the ability to switch cryptographic primitives without breaking existing data:

```rust
pub enum CryptoSuite {
    V1 { 
        signature: SignatureAlgo::Ed25519,
        hash: HashAlgo::Sha3256,
        cipher: CipherAlgo::Aes256Gcm,
        key_exchange: KeyExchangeAlgo::X25519,
    },
    V2 {
        signature: SignatureAlgo::EdDsa,
        hash: HashAlgo::Sha3256,
        cipher: CipherAlgo::Aes256Gcm,
        key_exchange: KeyExchangeAlgo::X25519Kyber,
    },
}
```

## Encryption Key Lifecycle Summary

| Stage | Duration | Storage | Description |
|-------|----------|---------|-------------|
| Key generation | < 1 ms | RAM | OsRng CSPRNG |
| Identity signing | Permanent | SQLite (encrypted) | Ed25519 private key |
| P2P handshake | Per session | RAM | X25519 ephemeral |
| Session encryption | Per session | RAM | AES-256-GCM session key |
| Session end | Immediate | Destroyed | Zeroed in RAM |
| Key export | User-initiated | File (encrypted) | Argon2id + AES-256-GCM |
| Key import | User-initiated | SQLite (encrypted) | Decrypted and stored |

## E2EE Channel Setup Protocol

```
┌───────────────┐                  ┌───────────────┐
│    Peer A      │                  │    Peer B      │
└───────┬───────┘                  └───────┬───────┘
        │                                  │
        │ 1. Create E2EE channel            │
        │ 2. Generate channel X25519 keypair │
        │ 3. Sign channel public key         │
        │    with user Ed25519 identity      │
        │                                  │
        │──── Channel invite ──────────────►│
        │    {channel_id, pub_key, sig}     │
        │                                  │
        │                                  │ 4. Verify invite signature
        │                                  │ 5. Generate own X25519 keypair
        │◄── Key exchange response ────────│
        │    {channel_id, pub_key, sig}     │
        │                                  │
        │ 6. Compute shared secret         │
        │ 7. Derive session key via HKDF    │
        │                                  │ 8. Compute shared secret
        │                                  │ 9. Derive session key via HKDF
        │                                  │
        │══════ E2EE communication ═══════►│
        │    {nonce, ciphertext, tag}       │
        │◄═══ E2EE communication ═════════│
        │    {nonce, ciphertext, tag}       │
```

### Channel Key Rotation

For long-lived E2EE channels, keys should be rotated regularly:

```rust
pub struct ChannelKeyRotation {
    pub channel_id: String,
    pub old_key_hash: String,       // SHA-256 of old public key
    pub new_public_key: Vec<u8>,    // New X25519 public key
    pub rotation_number: u32,       // Incrementing rotation counter
    pub signed_by: Vec<u8>,         // Ed25519 signature by channel creator
}

impl ChannelKeyRotation {
    pub fn verify(&self, creator_public_key: &[u8]) -> bool {
        let message = format!("{}:{}:{}:{}",
            self.channel_id, self.old_key_hash,
            hex::encode(&self.new_public_key), self.rotation_number
        );
        let sig = Signature::from_slice(&self.signed_by).ok()?;
        let key = VerifyingKey::from_bytes(&creator_public_key.try_into().ok()?).ok()?;
        key.verify(message.as_bytes(), &sig).is_ok()
    }
}
```

## Cryptographic Protocol Negotiation

When two Libern peers connect, they negotiate cryptographic parameters:

```rust
pub struct CryptoNegotiation {
    pub version: u32,                    // Protocol version
    pub supported_signature_algorithms: Vec<String>,  // ["Ed25519"]
    pub supported_key_exchange: Vec<String>,           // ["X25519"]
    pub supported_ciphers: Vec<String>,                // ["AES-256-GCM"]
    pub supported_hashes: Vec<String>,                 // ["SHA3-256"]
    pub preferred_e2ee: bool,            // Both peers agree on E2EE?
}

impl CryptoNegotiation {
    pub fn negotiate(local: &Self, remote: &Self) -> Result<CryptoSuite, String> {
        // Find intersection of supported algorithms
        let signature = intersect(&local.supported_signature_algorithms, &remote.supported_signature_algorithms)
            .first().ok_or("No common signature algorithm")?;
        let key_exchange = intersect(&local.supported_key_exchange, &remote.supported_key_exchange)
            .first().ok_or("No common key exchange")?;
        let cipher = intersect(&local.supported_ciphers, &remote.supported_ciphers)
            .first().ok_or("No common cipher")?;

        Ok(CryptoSuite {
            signature: signature.clone(),
            key_exchange: key_exchange.clone(),
            cipher: cipher.clone(),
            e2ee: local.preferred_e2ee && remote.preferred_e2ee,
        })
    }
}
```

## Comparison with Other E2EE Implementations

| Feature | Libern | Signal | WhatsApp | Matrix (Megolm) |
|---------|--------|--------|----------|-----------------|
| Identity binding | Ed25519 self-generated | Phone number | Phone number | Optional |
| Key distribution | Direct P2P | Central server | Central server | Server-side |
| Group E2EE | Planned (MLS) | Signal Protocol | Signal Protocol | Megolm |
| Forward secrecy | ✓ (ephemeral keys) | ✓ | ✓ | ✓ |
| Post-compromise security | ✓ | ✓ | ✓ | Partial |
| Metadata protection | Minimal | Transport-level | Transport-level | Minimal |
| Open source | ✓ (AGPL-3.0) | ✓ (GPLv3) | No | ✓ (Apache 2.0) |
| Offline E2EE | ✓ | Limited | Limited | Limited |

## References

- `crates/libern-aioss/src/state_proof.rs` — Ed25519 key generation, signing, verification
- `crates/libern-aioss/src/entry.rs` — SHA3-256 content hashing
- `crates/libern-aioss/src/ledger.rs` — SHA3-256 canonical JSON hashing
- `crates/libern-core/src/crypto/mod.rs` — Identity, SHA-256 ledger
- `crates/libern-core/src/crdt/mod.rs` — HybridLogicalClock

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
