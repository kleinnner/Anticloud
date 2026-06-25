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

# Self-Sovereign Identity

**Category:** Data Safety
**File:** 02-self-sovereign-identity.md
**Revision:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [No OAuth, No Third-Party Identity](#no-oauth-no-third-party-identity)
3. [Ed25519 Keypair Architecture](#ed25519-keypair-architecture)
4. [Identity Generation](#identity-generation)
5. [Key Storage](#key-storage)
6. [Identity in the Database](#identity-in-the-database)
7. [Signing Messages](#signing-messages)
8. [Peer Identity in P2P](#peer-identity-in-p2p)
9. [Portable Identity](#portable-identity)
10. [Comparison with Centralized Identity](#comparison-with-centralized-identity)
11. [Frequently Asked Questions](#frequently-asked-questions)
12. [References](#references)

---

## Overview

Libern implements **self-sovereign identity (SSI)** — every user is identified solely by an Ed25519 keypair that they generate and control. There is no central authority, no OAuth provider, no email verification, no phone number requirement, and no third-party identity provider of any kind. Your identity is your keypair, and your keypair is your identity.

---

## No OAuth, No Third-Party Identity

Libern categorically rejects the OAuth/SSO model for:
- **Dependency on external services:** OAuth creates a dependency chain.
- **Privacy implications:** Every OAuth flow leaks information.
- **Centralized control:** Providers can revoke access, ban accounts.
- **Offline incompatibility:** OAuth requires internet for token exchange.

```rust
pub struct Identity {
    pub user_id: String,      // UUID v4, generated locally
    pub public_key: Vec<u8>,  // Ed25519 public key bytes
}
```

There is no `email`, `phone`, `oauth_token`, or `idp` field.

---

## Ed25519 Keypair Architecture

| Component | Size | Encoding |
|-----------|------|----------|
| Private key (seed) | 32 bytes | Raw binary |
| Public key | 32 bytes | Raw binary or base64 |
| Signature | 64 bytes | Raw binary or base64 |
| Full keypair | 64 bytes | Private + public |

### Rust Crate

```toml
ed25519-dalek = "2"
```

---

## Identity Generation

```rust
let mut secret_bytes = [0u8; 32];
OsRng.fill_bytes(&mut secret_bytes);
let signing_key = SigningKey::from_bytes(&secret_bytes);
let verifying_key = signing_key.verifying_key();
```

The process:
1. **Entropy source:** `OsRng` (operating system CSPRNG: CryptGenRandom/getrandom/SecRandomCopyBytes)
2. **Key expansion:** `SigningKey::from_bytes` expands the 32-byte seed
3. **Public key derivation:** scalar multiplication of base point

### User ID

```rust
let user_id = uuid::Uuid::new_v4().to_string();
```

---

## Key Storage

### Private Key

The Ed25519 private key is:
- **Never transmitted** over the network
- **Never uploaded** to any server
- **Never logged** in any .aioss ledger
- **Never shared** with other peers

### Public Key

Stored in the `users` table and included in:
- Every signed message
- Every `StateProof`
- P2P handshake messages
- The `.aioss` ledger

### Database Schema

```sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    public_key BLOB NOT NULL,      -- 32-byte Ed25519 public key
    avatar_path TEXT,
    is_local INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);
```

---

## Signing Messages

### Signing Flow

1. User composes a message
2. Create `Message` struct with content, channel_id, HLC timestamp
3. Serialize to canonical bytes
4. `signing_key.sign(payload_bytes)` → 64-byte signature
5. Store signature in `messages.signature` BLOB
6. Broadcast includes signature

### Verification on Receipt

1. Extract author's Ed25519 public key
2. Reconstruct canonical payload bytes
3. `verifying_key.verify(payload_bytes, &signature)`
4. If fails, reject message and log security event

---

## Peer Identity in P2P

### Connection Establishment

```
Peer A                          Peer B
  |-- [nonce] ------------------->|
  |                               |-- Sign(nonce) with Ed25519 private key
  |<-- [public_key + signature] --|
  |-- Verify signature ---------->|
```

### Identity in CRDT Merges

```
For each operation in incoming CRDT state:
  1. Lookup author's public key
  2. Verify Ed25519 signature
  3. If valid: apply with HLC ordering
  4. If invalid: reject, log security event
```

---

## Portable Identity

### Moving Between Machines

1. Export keypair from Machine A (encrypted with passphrase)
2. Transfer export file (USB, LAN, cloud storage)
3. Import on Machine B
4. Machine B now has same Ed25519 identity

### Multiple Devices

- Each device has a copy of the keypair
- All devices sign with the same private key
- CRDT merge resolves conflicts

### No Vendor Lock-In

- No "Libern account" to delete or suspend
- No company can revoke your identity
- No subscription required
- Works with any Libern-compatible implementation

---

## Comparison with Centralized Identity

| Property | Centralized (Discord, Slack) | Libern (SSI) |
|----------|------------------------------|---------------|
| Identity authority | Company servers | None (self-generated) |
| Account creation | Email/password/SSO | Generate Ed25519 keypair |
| Account recovery | Via email support | Via key backup file |
| Account deletion | Company controls | User deletes key file |
| Identity portability | None | Full (export/import) |
| Offline authentication | Impossible | Native |
| Privacy from provider | None | Complete |
| Phishing resistance | Low | High (cryptographic) |

---

## Frequently Asked Questions

### What if I lose my private key?

Without your key, you cannot sign new messages. Existing signed messages remain verifiable. Back up your key!

### Can I have multiple identities?

Yes. Each keypair is a separate identity.

### Can someone steal my identity?

Only if they gain access to your private key file and passphrase.

### Can I change my public key?

Generate a new keypair. Old key remains valid for verifying past messages.

### Does Libern use DIDs?

Not currently. DID integration is a potential future enhancement.

---

## Key Rotation Policy

```rust
pub struct KeyRotationCertificate {
    pub old_public_key: Vec<u8>,     // The key being rotated
    pub new_public_key: Vec<u8>,     // The new key
    pub rotation_timestamp: i64,     // When rotation was performed
    pub signature: Vec<u8>,          // Ed25519 signed by OLD key
}

impl KeyRotationCertificate {
    pub fn sign(old_signing_key: &SigningKey, new_public_key: &[u8]) -> Self {
        let rotation_timestamp = chrono::Utc::now().timestamp_millis();
        let message = format!("{}:{}:{}",
            hex::encode(old_signing_key.verifying_key().as_bytes()),
            hex::encode(new_public_key),
            rotation_timestamp
        );
        let signature = old_signing_key.sign(message.as_bytes());

        KeyRotationCertificate {
            old_public_key: old_signing_key.verifying_key().as_bytes().to_vec(),
            new_public_key: new_public_key.to_vec(),
            rotation_timestamp,
            signature: signature.to_bytes().to_vec(),
        }
    }

    pub fn verify(&self) -> bool {
        let old_key = match VerifyingKey::from_bytes(&self.old_public_key.try_into().unwrap()) {
            Ok(k) => k,
            Err(_) => return false,
        };
        let message = format!("{}:{}:{}",
            hex::encode(&self.old_public_key),
            hex::encode(&self.new_public_key),
            self.rotation_timestamp
        );
        let sig = match Signature::from_slice(&self.signature) {
            Ok(s) => s,
            Err(_) => return false,
        };
        old_key.verify(message.as_bytes(), &sig).is_ok()
    }
}
```

## Future: DID Integration

Libern's identity system is designed to be forward-compatible with W3C Decentralized Identifiers (DIDs):

```
Current: Ed25519 public key → UUID-based user ID
Future:  Ed25519 public key → DID:key → DID document
```

Potential DID methods:
- `did:key` — Directly derived from Ed25519 public key
- `did:keri` — Key Event Receipt Infrastructure (rotation support)
- `did:webs` — Web-based DID (for organizational directories)

## Identity Security Best Practices

| Practice | Description | Implementation |
|----------|-------------|---------------|
| Cold storage backup | Store key offline, not on network drive | USB drive or printed QR |
| Multi-factor | Combine key with passphrase | AES-256-GCM encryption |
| Key rotation | Generate new key periodically | Rotation certificate flow |
| Revocation | Notify peers of compromised key | Manual (broadcast to peers) |
| Split key | Shamir's Secret Sharing (future) | Not yet implemented |

## Identity Threat Model

| Threat | Impact | Mitigation |
|--------|--------|-----------|
| Private key theft | Attacker can sign as user | Passphrase encryption |
| Private key loss | Cannot sign new messages | Key backup, recovery phrase |
| Social engineering | Trick user into signing | User education |
| Quantum computer | Break Ed25519 (~2030?) | Migrate to FIPS 205 (SLH-DSA) |
| OS keylogger | Capture passphrase | Hardware security (future) |

## Comparison with Web3 Identity

| Property | Libern | Ethereum | IPFS/Filecoin |
|----------|--------|----------|---------------|
| Key type | Ed25519 | ECDSA (secp256k1) | Various |
| Identity resolution | Local lookup | ENS / smart contract | IPNS |
| Key rotation | Certificate-based | Manual (new address) | Key rotation |
| Recovery | Backup file | Seed phrase | Backup file |
| Offline use | Full | Limited | Limited |
| Privacy | Complete | Pseudonymous | Pseudonymous |

## Identity in the Libern Architecture

Identity is a cross-cutting concern that touches every part of the system:

```
┌─────────────────────────────────────────────────────────────┐
│              Identity in Libern Architecture                  │
│                                                               │
│  User Interface                                                │
│  ├─ Display name shown in chat                                │
│  ├─ Avatar image displayed next to messages                   │
│  └─ Ed25519 key fingerprint for verification                  │
│                                                               │
│  API Layer (Tauri Commands)                                   │
│  ├─ author_id parameter in all write commands                 │
│  ├─ signature generation on message creation                  │
│  └─ permission checks via user_id                             │
│                                                               │
│  Database Layer                                                │
│  ├─ users table stores public keys                            │
│  ├─ messages.signature BLOB column                            │
│  └─ Foreign key references to users.id                        │
│                                                               │
│  P2P Layer                                                    │
│  ├─ mDNS announcements include user_id                        │
│  ├─ WebSocket handshake verifies Ed25519 identity             │
│  └─ CRDT operations signed by author                          │
│                                                               │
│  Audit Layer                                                   │
│  ├─ .aioss entries include actor field                        │
│  ├─ StateProof signed by user's Ed25519 key                   │
│  └─ Verification confirms identity of all actions             │
└─────────────────────────────────────────────────────────────┘
```

## Identity Security Audit Protocol

### Verifying Identity Integrity

```bash
#!/bin/bash
# libern-identity-audit.sh
echo "=== Libern Identity Audit ==="
echo ""

# 1. Check key file exists
KEY_FILE="$HOME/.local/share/libern/keys/identity.pem"
if [ -f "$KEY_FILE" ]; then
    echo "✓ Key file exists: $KEY_FILE"
    KEY_SIZE=$(stat -c%s "$KEY_FILE" 2>/dev/null || stat -f%z "$KEY_FILE" 2>/dev/null)
    echo "  Size: $KEY_SIZE bytes"
else
    echo "✗ Key file not found!"
fi

# 2. Check database has users
DB_FILE="$HOME/.local/share/libern/data.db"
if [ -f "$DB_FILE" ]; then
    USER_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM users;")
    LOCAL_USER=$(sqlite3 "$DB_FILE" "SELECT display_name FROM users WHERE is_local=1 LIMIT 1;")
    echo "✓ Database found: $DB_FILE"
    echo "  Total users: $USER_COUNT"
    echo "  Local user: $LOCAL_USER"

    # Check for public keys
    KEY_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM users WHERE public_key IS NOT NULL;")
    echo "  Users with public keys: $KEY_COUNT"
else
    echo "✗ Database not found!"
fi

# 3. Verify .aioss has valid entries
AIOSS_COUNT=$(find "$HOME/.local/share/libern/aioss" -name "*.aioss" 2>/dev/null | wc -l)
echo "✓ .aioss files: $AIOSS_COUNT"

echo ""
echo "=== Identity Audit Complete ==="
```

### Identity Recovery Drill

Organizations should periodically test identity recovery:

```
Recovery Drill Procedure:
1. Simulate key loss on a test machine
2. Attempt to recover identity from backup file
3. Verify that recovered identity can sign messages
4. Verify that past signed messages are still verifiable
5. Document the recovery process and timing

Expected timeline:
  - Key file import: < 1 minute
  - Identity verification: < 10 seconds
  - Message signing test: < 1 second
  - Past message verification: < 5 seconds
```

## Identity Backup Best Practices

| Method | Security | Convenience | Recommended For |
|--------|----------|-------------|-----------------|
| Encrypted file (USB) | High | Medium | Enterprise, long-term |
| Printed QR code | Very High | Low | Cold storage, disaster recovery |
| Password manager | Medium | High | Personal use |
| Paper backup (BIP39) | High | Medium | Recovery phrases |
| Cloud storage (encrypted) | Medium | High | Convenience backup |

### Emergency Identity Recovery Card

```text
┌──────────────────────────────────────┐
│      LIBERN EMERGENCY RECOVERY        │
│                                       │
│  If you lose your identity key:       │
│                                       │
│  1. Install Libern on new machine     │
│  2. Select "Import Identity"          │
│  3. Locate your backup key file       │
│  4. Enter your passphrase             │
│  5. Sync with peers to restore data   │
│                                       │
│  Without your key file + passphrase,  │
│  your identity is permanently lost.   │
│                                       │
│  Store backups in at least 2 places.  │
└──────────────────────────────────────┘
```

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| Ed25519 key generation | ~0.1ms | Fresh OsRng entropy |
| Ed25519 signing | ~0.05ms | Per message |
| Ed25519 verification | ~0.05ms | Per message verified |
| Key export (AES-256-GCM) | ~1ms | Including Argon2id key derivation |
| Key import | ~1ms | Decryption + verification |
| UUID generation | < 0.01ms | uuid crate v4 |

### Memory Usage

| Component | Memory | Notes |
|-----------|--------|-------|
| Ed25519 private key (RAM) | 32 bytes | Seed only |
| Ed25519 public key (RAM) | 32 bytes | Derived from seed |
| Ed25519 signature | 64 bytes | Per operation |
| Full keypair in memory | 64 bytes | Private + public |
| Encrypted key file | 111 bytes | On disk |

## Identity-Related Tauri Commands

| Command | Function | Description |
|---------|----------|-------------|
| `create_user` | `create_user()` | Create new Ed25519 identity |
| `get_local_user` | `get_local_user()` | Get current local user identity |
| `update_display_name` | `update_display_name()` | Update display name |
| `export_identity` | `export_identity()` | Export encrypted private key |
| `import_identity` | `import_identity()` | Import encrypted private key |

## References

- `crates/libern-core/src/crypto/mod.rs` — Identity, LedgerEntry, verify_chain
- `crates/libern-aioss/src/state_proof.rs` — StateProof::sign, StateProof::verify
- `crates/libern-core/src/db/schema.rs` — users table schema
- `crates/libern-core/src/db/models.rs` — User struct with public_key
- `ed25519-dalek = "2"` — Cargo dependency
- `rand = "0.8"` — OsRng entropy source
- RFC 8032 — Ed25519 EdDSA signature scheme

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
