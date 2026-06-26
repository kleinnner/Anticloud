<!--
     ▄▄▄   ▄▄▄  ▄▄▄  ▄▄▄▄▄▄▄▄              ▄▄▄▄      ▄▄▄▄     ▄▄▄     
    ██     ███  ███  ██▀▀▀▀▀▀            ▄█▀▀▀▀█    ██▀▀██      ██    
    ██     ████████  ██           ██     ██▄       ██    ██     ██    
    ██     ██ ██ ██  ███████   ▄▄▄██▄▄▄   ▀████▄   ██ ██ ██     ██    
  ▀▀█▄     ██ ▀▀ ██  ██        ▀▀▀██▀▀▀       ▀██  ██    ██     ▄█▀▀  
    ██     ██    ██  ██           ██     █▄▄▄▄▄█▀   ██▄▄██      ██    
    ██     ▀▀    ▀▀  ▀▀                   ▀▀▀▀▀      ▀▀▀▀       ██    
    ▀█▄▄                                                      ▄▄█▀    

MF+SO — Multi Factor+ Sign On
by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner
The Sovereign Identity & Authentication Vault
-->

# Technical FAQ

> **Last Updated:** 2026-06-19
> **Category:** Technical

## How does TOTP work?

Time-Based One-Time Password (TOTP) is defined in **RFC 6238**. Here's how it works:

### Algorithm Steps
1. **Shared Secret** — When you enable 2FA on a service, it generates a shared secret (the "seed")
2. **QR Code** — The service displays the seed as a QR code (or text key)
3. **Storage** — MF+SO stores the seed encrypted in your vault
4. **Time Step** — Current UNIX time is divided by 30 (the standard time step)
5. **HMAC** — The seed is combined with the time counter using HMAC-SHA1
6. **Truncation** — The HMAC output is truncated to 6-8 digits
7. **Display** — The code is displayed and refreshed every 30 seconds

### Code Generation Formula
```
TOTP = Truncate(HMAC-SHA1(K, T))
Where:
  K = shared secret (seed)
  T = floor(current_unix_time / 30)
```

### Security Properties
- Codes are valid only during their 30-second window (+/- 1 window for clock skew)
- Each code is derived from both the seed and the current time
- Without the seed, codes cannot be predicted
- The seed never leaves your device after enrollment

## What is FIDO2 / WebAuthn?

**FIDO2** is a set of standards for passwordless authentication, consisting of:
- **WebAuthn** (W3C standard) — The web API for credential registration and authentication
- **CTAP2** (FIDO standard) — Client-to-Authenticator Protocol for communicating with authenticators

### How FIDO2 Works

**Registration:**
1. Website requests a new credential
2. Browser asks your authenticator (MF+SO) to create a key pair
3. MF+SO generates an ECDSA or Ed25519 key pair in the secure enclave
4. Public key is sent to the website; private key never leaves the device
5. Website stores the public key associated with your account

**Authentication:**
1. Website sends a challenge to your browser
2. Browser asks your authenticator to sign the challenge
3. MF+SO signs the challenge with the private key
4. Website verifies the signature with the stored public key
5. You are authenticated — no password needed!

### Benefits
- **Phishing-resistant** — Credentials are bound to the website origin
- **Passwordless** — No passwords to remember or leak
- **Hardware-backed** — Private keys stored in secure enclave
- **Cross-platform** — Works across browsers and operating systems

## What is the difference between HOTP and TOTP?

| Feature | HOTP (RFC 4226) | TOTP (RFC 6238) |
|---|---|---|
| Based on | Counter | Time |
| Code changes | After each use | Every 30 seconds |
| Code validity | Until used | ~30-60 seconds |
| Clock required | No | Yes |
| Out-of-sync | Counter must be synchronized | Clock skew tolerance |
| Use case | Hardware tokens, backup codes | Mobile authenticators |

MF+SO supports both: TOTP for standard 2FA and HOTP for hardware tokens and backup codes.

## What browsers are supported?

| Browser | Version | Extension | FIDO2/WebAuthn |
|---|---|---|---|
| Google Chrome | 110+ | ✅ | ✅ |
| Mozilla Firefox | 110+ | ✅ | ✅ |
| Microsoft Edge | 110+ | ✅ | ✅ |
| Apple Safari | 16+ | ✅ | ✅ |
| Opera | 95+ | ✅ | ✅ |
| Brave | 1.50+ | ✅ | ✅ |
| Vivaldi | 6.0+ | ✅ | ✅ |
| Arc | 1.0+ | ✅ | ✅ |

## How does MF+SO handle large vaults?

MF+SO is designed to handle vaults with thousands of entries efficiently:
- **Lazy loading** — Account list renders progressively
- **Search indexing** — Full-text search with sub-100ms response
- **Pagination** — Large lists are paginated (100 items per page)
- **Memory optimization** — Only actively used entries are kept in memory
- **Compression** — Vault data is compressed (zstd) on disk and in transit

### Performance by Vault Size

| Entries | App Launch | Search | Sync | Backup |
|---|---|---|---|---|
| 100 | < 1s | < 10ms | < 1s | < 1s |
| 1,000 | < 1s | < 20ms | < 3s | < 2s |
| 10,000 | ~2s | < 50ms | ~10s | ~5s |
| 100,000 | ~5s | < 100ms | ~60s | ~30s |

## How does device sync work?

MF+SO uses **end-to-end encrypted synchronization**:

```
Device A                    MF+SO Sync Server              Device B
    │                             │                             │
    │  1. Encrypt vault data      │                             │
    │     (XChaCha20-Poly1305)    │                             │
    │                             │                             │
    │  2. Upload encrypted blob   │                             │
    │────────────────────────────▶│                             │
    │                             │  3. Push notification       │
    │                             │────────────────────────────▶│
    │                             │                             │
    │                             │  4. Download encrypted blob │
    │                             │◀────────────────────────────│
    │                             │                             │
    │                             │  5. Decrypt locally         │
    │                             │     (sync key derived from  │
    │                             │      master password)       │
```

**Sync key derivation:**
- Derived from master password + device-specific salt
- Never transmitted to server
- Unique per device
- Changes if master password changes

**Conflict resolution:**
- Last-writer-wins for independent changes
- Merge strategy for concurrent edits
- Deterministic resolution based on device ID + timestamp

## How does MF+SO handle QR code scanning?

MF+SO uses two approaches for QR code scanning:

1. **Native camera** (mobile) — Uses the device camera with real-time QR detection
   - Automatic detection and parsing
   - Works offline
   - Supports standard `otpauth://` URIs

2. **Image file** (desktop) — Import screenshots or downloaded QR images
   - Drag and drop support
   - File picker integration
   - Clipboard paste support

### Supported QR formats:
- Standard TOTP: `otpauth://totp/{label}?secret={BASE32}&issuer={name}`
- Standard HOTP: `otpauth://hotp/{label}?secret={BASE32}&counter={N}&issuer={name}`
- MF+SO migration: `mfso://import/{encrypted-data}`
- Emergency sheet: Proprietary format

## Does MF+SO support push authentication?

Yes. MF+SO supports push-based authentication for services that integrate with MF+SO Enterprise:

1. Service sends authentication request to MF+SO server
2. MF+SO server sends push notification to your device
3. You see: "Login attempt from [service] — Approve or Deny?"
4. You tap Approve or Deny
5. Response is cryptographically signed and sent back
6. Service verifies the response

Push authentication is available through MF+SO Enterprise IdP.

## What is the .aioss audit engine?

.aioss (Advanced Immutable Observation & Security Stream) is MF+SO's proprietary audit logging system:
- **Tamper-evident** — Cryptographic hash chain links all events
- **Immutable** — Once recorded, events cannot be modified
- **Verifiable** — Chain integrity can be independently verified
- **Searchable** — Indexed for efficient querying
- **Compliant** — Pre-built mappings for SOC 2, HIPAA, PCI-DSS

Available in Enterprise tier.

## How does MF+SO integrate with existing systems?

### Personal use:
- Standard TOTP/HOTP (works with any service that provides QR codes)
- FIDO2/WebAuthn (works with any website supporting passkeys)
- Browser extensions (Chrome, Firefox, Edge, Safari)

### Enterprise use:
- SAML 2.0 Identity Provider
- OpenID Connect Provider
- SCIM 2.0 provisioning
- LDAP/Active Directory sync
- REST API
- Webhook events
- SIEM integration (Splunk, ELK, Chronicle)

## What is the technical architecture?

```
┌─────────────────────────────────────────────────────────────────┐
│                     MF+SO Client Architecture                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   UI     │  │   Vault  │  │   Sync   │  │   Auth   │       │
│  │  Layer   │  │  Manager │  │  Engine  │  │  Engine  │       │
│  │          │  │          │  │          │  │          │       │
│  │ • Screens│  │ • CRUD   │  │ • E2EE   │  │ • TOTP   │       │
│  │ • Themes │  │ • Search │  │ • Queue  │  │ • HOTP   │       │
│  │ • i18n   │  │ • Export │  │ • Conflicts│ • FIDO2  │       │
│  └──────────┘  └──────────┘  └──────────┘  │ • Biometric      │
│                                            └──────────┘       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Security Layer                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │  Crypto  │  │  Secure  │  │  Key     │              │  │
│  │  │  Engine  │  │  Enclave │  │  Manager  │              │  │
│  │  └──────────┘  └──────────┘  └──────────┘              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Platform Abstraction Layer                │  │
│  │  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐           │  │
│  │  │ iOS   │  │Android│  │Mac/Win│  │ Linux │           │  │
│  │  │Native │  │Native │  │Native │  │Native │           │  │
│  │  └───────┘  └───────┘  └───────┘  └───────┘           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## What programming languages is MF+SO built with?

| Component | Language | Framework |
|---|---|---|
| Core cryptography | Rust | Custom |
| iOS app | Swift | SwiftUI |
| Android app | Kotlin | Jetpack Compose |
| macOS app | Swift | SwiftUI |
| Windows app | C# | WinUI 3 |
| Linux app | Rust | GTK4 |
| Backend (Enterprise) | Go | Custom |
| Browser extension | TypeScript | Manifest V3 |
| SDKs | Go, Python, Java, Rust, .NET | Various |

## What is the minimum Android/iOS version?

| Platform | Minimum Version | Recommended Version |
|---|---|---|
| iOS | 16.0 | 17.0+ |
| iPadOS | 16.0 | 17.0+ |
| Android | 12.0 (API 31) | 14.0+ (API 34) |

## Does MF+SO work on jailbroken/rooted devices?

Yes, but with additional warnings and reduced security guarantees:
- Warning displayed on jailbroken/rooted devices
- Secure enclave may be compromised
- Additional security restrictions may be enforced
- Some Enterprise policies may block enrollment from jailbroken devices

## What happens to my data when I delete my account?

1. **Immediate:** Local vault data remains on device until app is uninstalled
2. **Within 24 hours:** Sync data is deleted from servers
3. **Within 30 days:** All server-side data is permanently deleted
4. **Within 90 days:** Backup data in cold storage is purged

You can download your data before deletion.

## Does MF+SO support hardware security keys directly?

Yes. MF+SO acts as a **FIDO2 authenticator**:
- **Platform authenticator** — Your device itself acts as the authenticator using its secure enclave
- **Roaming authenticator** — MF+SO can manage external security keys (YubiKey, Google Titan, etc.)
- **Cross-platform authentication** — Use your MF+SO vault to authenticate on any device via QR code

## How does the MF+SO sync protocol work technically?

The MF+SO sync protocol is a custom end-to-end encrypted synchronization protocol designed specifically for identity vaults. It uses a CRDT (Conflict-free Replicated Data Type) approach to handle concurrent edits across devices.

### Sync Flow
```
Device A                        Sync Server                     Device B
    │                               │                               │
    │  1. Establish session          │                               │
    │  (mTLS + Bearer token)         │                               │
    │───────────────────────────────▶│                               │
    │                               │                               │
    │  2. Upload encrypted changes   │                               │
    │  ┌──────────────────────┐     │                               │
    │  │ Each entry payload:   │     │                               │
    │  │ • Entry ID (UUID)    │     │                               │
    │  │ • Version number     │     │                               │
    │  │ • Timestamp          │     │                               │
    │  │ • Encrypted blob     │     │                               │
    │  │ • HMAC-SHA256        │     │                               │
    │  └──────────────────────┘     │                               │
    │───────────────────────────────▶│                               │
    │                               │  3. Push notification          │
    │                               │───────────────────────────────▶│
    │                               │                               │
    │                               │  4. Download changes          │
    │                               │◀───────────────────────────────│
    │                               │                               │
    │                               │  5. Return encrypted blobs     │
    │                               │───────────────────────────────▶│
    │                               │  6. Decrypt locally            │
    │                               │  7. Apply CRDT merge           │
```

### Encryption Details
Each sync entry is encrypted with a two-layer scheme:
1. **Per-entry encryption:** XChaCha20-Poly1305 with a random 256-bit key
2. **Key wrapping:** The per-entry key is wrapped using the sync key (derived from master password via HKDF-SHA256)
3. **Integrity:** HMAC-SHA256 over the encrypted payload prevents tampering

The server only sees encrypted payloads and non-sensitive metadata (entry ID, version, timestamp). No plaintext secrets ever touch the server.

### Conflict Resolution (CRDT)

| Data Type | Strategy | Behavior |
|---|---|---|
| Account name | LWW (Last Writer Wins) | Latest timestamp wins |
| TOTP secret | LWW with merge | If both modified, newer wins |
| Notes | LWW (full replacement) | Complete text replaced |
| Tags/groups | Set union | Tags from both kept |
| Custom fields | Per-field LWW | Each field resolved independently |
| Favorites | LWW (boolean) | Latest value wins |

## How does the browser extension communicate with the desktop app?

The extension uses the **Native Messaging API** for secure local communication:

```
Browser Extension (Chrome/Firefox/Edge/Safari)
        │
        │ JSON messages over stdin/stdout (paired)
        │ ECDH-derived encryption per message
        │
Native Messaging Host (mfso-native-messaging)
        │
        │ IPC over Unix domain socket / named pipe
        │ Same encryption layer
        │
MF+SO Desktop App
```

Communication is local only, no network traffic. The extension and desktop app are paired using a 6-digit verification code.

## How is the vault database structured internally?

MF+SO uses **SQLite** with **SQLCipher** encryption for local storage.

### Schema Highlights
- **vault_entries:** Primary table with encrypted BLOB data, HMAC, version tracking
- **entry_metadata:** Searchable metadata (name, issuer, type, tags) stored encrypted
- **sync_log:** Tracks sync operations for debugging and recovery
- **settings:** Key-value configuration store
- **recovery_data:** Encrypted seed phrase and backup keys

### Performance Features
- **WAL mode** — Write-Ahead Logging for concurrent reads
- **Memory-mapped I/O** — Fast access for large vaults
- **Full-text search index** — On name, issuer, and tags
- **Periodic VACUUM** — Automated database optimization

## How does MF+SO handle very large vaults (>100K entries)?

### Architecture Optimizations

| Feature | Description | Benefit |
|---|---|---|
| Lazy loading | Entries loaded on demand | 60% faster launch |
| Virtual scrolling | Only visible items rendered | Smooth scrolling at 60 FPS |
| Incremental search | Index built progressively | Instant search results |
| Database sharding | Multiple database files | Parallel access |
| zstd compression | For backup and sync | 75% smaller payloads |
| LRU cache | Hot entries in memory | 90% cache hit rate |

### Performance by Vault Size (v2.5)

| Operation | 1K entries | 10K entries | 100K entries |
|---|---|---|---|
| Launch | < 1s | ~3s | ~12s |
| Search | < 10ms | ~50ms | ~150ms |
| Full backup | < 2s | ~5s | ~45s |
| Memory | 50 MB | 200 MB | 650 MB |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*

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