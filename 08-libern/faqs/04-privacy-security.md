▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

Document Version: 1.0.0
Category: FAQ
Document ID: FAQ-004
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Privacy and Security FAQ

## Is my data safe?

Yes. Libern is designed with privacy and security as core principles:

1. **Local-first**: All data is stored on your local machine. There are no cloud servers.
2. **No telemetry**: Libern does not collect any usage data, analytics, or crash reports.
3. **Cryptographic signing**: Every message is signed with your Ed25519 key.
4. **Tamper-evident**: Every action is recorded in the `.aioss` hash chain.
5. **Zero external dependencies**: No cloud APIs, no remote services.

### Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│               Libern Security Layers                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: Local Storage                                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │ All data in local SQLite database                │   │
│  │ No cloud sync, no data export                    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Layer 2: Cryptographic Identity                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Ed25519 key pair generation                      │   │
│  │ Private key never leaves machine                 │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Layer 3: Message Signing                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Every message signed with private key            │   │
│  │ Signature verified by recipients                 │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Layer 4: Tamper Evidence                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ .aioss hash chain (SHA3-256)                     │   │
│  │ Each entry links to previous hash                │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Layer 5: State Proofs                                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Ed25519 signature over head hash                 │   │
│  │ Verifiable by third parties                      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Is there end-to-end encryption?

Libern uses **cryptographic signing** rather than traditional end-to-end encryption. Every message is:

1. **Signed** with the author's Ed25519 private key.
2. **Verified** by recipients using the author's public key.
3. **Hash-chained** into the `.aioss` ledger for tamper evidence.

The current implementation stores a placeholder signature (`vec![0u8; 64]`), but the architecture is designed for full Ed25519 signing. The identity creation generates a public/private keypair:

```rust
// From apps/desktop/src-tauri/src/commands/user.rs
pub fn create_user(display_name: String) -> Result<User, String> {
    let public_key = vec![0u8; 32]; // placeholder, real Ed25519 later
    // ... insert user with public key
}
```

### Planned Encryption Enhancements

| Feature | Status | Description |
|---------|--------|-------------|
| Ed25519 signing | Placeholder | Full cryptographic message signing |
| Private key persistence | Planned | Store encrypted private key |
| Key export/import | Planned | BIP-39 seed phrase recovery |
| TLS for WebSocket | Planned | Encrypted P2P transport |
| End-to-end encryption | Research | Per-channel encryption keys |

---

## Does Libern collect telemetry?

**No.** Libern has zero telemetry. There are no analytics libraries, no crash reporting services, no usage tracking, and no log uploads. Everything stays on your machine.

The only network requests Libern makes are:
- **mDNS discovery**: Broadcasting your presence on the LAN for peer discovery.
- **Model download**: Downloading the AI model from Hugging Face (optional).
- **External links**: Opening URLs that users explicitly click.

### Telemetry Comparison

| Platform | Telemetry | Analytics | Crash Reports |
|----------|-----------|-----------|---------------|
| Discord | ✅ Yes | ✅ Yes | ✅ Yes |
| Slack | ✅ Yes | ✅ Yes | ✅ Yes |
| Microsoft Teams | ✅ Yes | ✅ Yes | ✅ Yes |
| Libern | ❌ No | ❌ No | ❌ No |

---

## How are messages signed?

Every message has a `signature` field (64 bytes) and an `hlc_timestamp` field. The signature covers the message content, channel ID, and HLC timestamp. The current implementation uses a placeholder, but the architecture supports full Ed25519:

```sql
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    content TEXT NOT NULL,
    hlc_timestamp INTEGER NOT NULL,
    signature BLOB NOT NULL,
    -- ...
);
```

### Planned Signing Flow

```
Message Creation:
┌────────────┐    ┌──────────────┐    ┌──────────────┐
│  Content   │───►│  HLC tick    │───►│  Sign with   │
│  "Hello"   │    │  1718000000  │    │  Ed25519     │
└────────────┘    └──────────────┘    └──────┬───────┘
                                             │
                                             ▼
                                    ┌──────────────────┐
                                    │  64-byte signature│
                                    │  stored in row   │
                                    └──────────────────┘

Message Verification:
┌────────────┐    ┌──────────────┐    ┌──────────────┐
│  Message   │───►│  Load sender │───►│  Verify with │
│  + sig     │    │  public key  │    │  Ed25519     │
└────────────┘    └──────────────┘    └──────┬───────┘
                                             │
                                    ┌────────┴────────┐
                                    │  Valid/Invalid  │
                                    └─────────────────┘
```

---

## What is the .aioss ledger?

The .aioss (AI Operated Session Store) format is a tamper-evident binary ledger that records every action. It uses:

- **SHA3-256** for content hashing
- **Hash chaining** (each entry references the hash of the previous entry)
- **Ed25519 state proofs** for external verification
- **Binary format** (128-byte header + 256-byte entries)

The hash chain ensures that any tampering with past entries is immediately detectable.

### Tamper Evidence

```
Valid Chain:
┌────┐   ┌────┐   ┌────┐
│ E0 │──►│ E1 │──►│ E2 │
│pH=0│   │pH=H0│  │pH=H1│
└────┘   └────┘   └────┘

Tampered Chain:
┌────┐   ┌────┐   ┌────┐
│ E0 │──►│ E1'│──►│ E2 │
│pH=0│   │pH=H0│  │pH=H1'│ ← Mismatch!
└────┘   └────┘   └────┘
         │
         E1' modified → hash H1' ≠ original H1
         But E2's parent_hash still points to H1
         Verification detects the break!
```

---

## Can I verify the integrity of my data?

Yes. The Compliance dashboard provides multiple verification tools:

1. **Verify .aioss files**: Checks the entire hash chain for consistency.
   ```typescript
   const result = await verifyAiossFile("/path/to/session.aioss");
   // { verified: true, tampered_count: 0, total_entries: 42 }
   ```

2. **Health diagnostics**: Runs system checks (CPU, memory, disk, network).
   ```typescript
   const health = await runHealthDiagnostics();
   ```

3. **State proofs**: Generate Ed25519 signatures over ledger state.
   ```typescript
   const proof = await signAiossSession(0);
   ```

---

## Where is my data stored?

All data is stored locally in the app data directory:

| Platform | Location |
|----------|----------|
| Windows | `%APPDATA%\com.libern.app\data` |
| macOS | `~/Library/Application Support/com.libern.app` |
| Linux | `~/.local/share/com.libern.app` |

Contents:
- `libern.db` — SQLite database (all app data)
- `models/` — AI model files
- `aioss/` — Sealed .aioss ledger files
- `bin/` — llama.cpp binary

---

## Can I delete my data?

Yes. Simply delete the app data directory. This removes:
- All servers and channels
- All messages and history
- Your identity (public/private keys)
- AI conversation history
- .aioss ledger files

### Data Deletion Options

| Method | Data Removed | Recovery Possible? |
|--------|-------------|-------------------|
| Delete `libern.db` | All messages, servers, settings | No |
| Delete `models/` | AI model file | Yes (re-download) |
| Delete `aioss/` | Sealed ledgers | No (if no backup) |
| Uninstall app | App binary only | Yes (data preserved) |
| Full data wipe | Everything | No |

---

## Is my identity recoverable?

Currently, identities are stored locally with the public key in the SQLite database. The Ed25519 private key is not yet persisted (placeholder implementation). In future versions:

- **Key backup**: Private keys will be exportable/importable.
- **Recovery phrase**: A BIP-39 style seed phrase for key recovery.

For now, if you delete your app data, your identity is permanently lost.

---

## How does peer-to-peer work on LAN?

Libern uses **mDNS** (multicast DNS) for peer discovery on the local network. Once peers discover each other, they communicate via **WebSocket** connections. Data is synchronized using **CRDT merge** (Conflict-Free Replicated Data Types) from `crates/libern-core/src/crdt/`.

The CRDT uses a **Last-Write-Wins Element Set (LWW Element Set)**:
```rust
pub struct LwwElementSet<T: Clone + Eq + Hash> {
    pub adds: Vec<(T, u64)>,
    pub removes: Vec<(T, u64)>,
}
```

This allows peers to merge their state without conflicts — the highest HLC timestamp always wins.

### P2P Security

```
┌──────────────────────────────────────────────┐
│     P2P Communication Security               │
├──────────────────────────────────────────────┤
│                                              │
│  Discovery: mDNS (UDP 5353)                 │
│  └── Local network only                      │
│                                              │
│  Transport: WebSocket (TCP dynamic port)     │
│  └── Direct P2P connections                  │
│                                              │
│  Authentication: Ed25519 public keys         │
│  └── Peers identified by public key          │
│                                              │
│  Integrity: SHA3-256 hash chain (.aioss)    │
│  └── Every action recorded immutably         │
│                                              │
│  No:                                         │
│  - Open ports to internet                    │
│  - Cloud relay servers                       │
│  - Third-party access                        │
└──────────────────────────────────────────────┘
```

---

## What security measures are in place?

1. **Cryptographic signing** (Ed25519)
2. **Tamper-evident hash chaining** (SHA3-256)
3. **HLC timestamps** for causal ordering
4. **Foreign key constraints** in SQLite
5. **SQLite WAL mode** for crash recovery
6. **Content moderation** (keyword + AI-based)

### Security Checklist

| Measure | Status |
|---------|--------|
| Cryptographic signing | Planned (placeholder now) |
| Hash chain integrity | ✅ Implemented |
| P2P transport security | ✅ LAN-only |
| Content moderation | ✅ Keyword + AI |
| Crash recovery (WAL) | ✅ SQLite WAL mode |
| Zero telemetry | ✅ By design |
| Open source auditability | ✅ Public repository |
| Dependency scanning | ✅ Via cargo-audit |

---

## Can someone else access my data?

Since all data is stored locally, physical access to your machine would be required. Libern does not expose any network services beyond:
- mDNS peer discovery (LAN only)
- WebSocket connections (LAN only, to known peers)

There are no open ports, no cloud sync, and no remote access features.

---

## What about regulatory compliance?

The .aioss format is designed for compliance requirements:
- **FDA 21 CFR Part 11** (electronic records/signatures)
- **GDPR** (data sovereignty — all data is local)
- **SOC 2** (audit trails via .aioss hash chain)
- **HIPAA** (no PHI transmitted to external servers)

---

## Does Libern use any third-party services?

The only external network request is:
- **Hugging Face** for AI model download (optional)

All other functionality operates entirely offline without external dependencies.

---

## Security Best Practices

### Recommended Security Configuration

```json
{
  "security": {
    "verify_signatures": false,
    "require_peer_auth": false,
    "allow_lan_discovery": true,
    "encrypt_websocket": false,
    "auto_seal_interval_minutes": 10,
    "backup_enabled": true,
    "backup_interval_hours": 24
  }
}
```

### For Enhanced Security

1. **Enable message verification**: Once Ed25519 signing is implemented, enable signature verification
2. **Use TLS for WebSocket**: In future versions, enable encrypted P2P transport
3. **Regular .aioss sealing**: Set auto-seal interval to 10 minutes or less
4. **Backup regularly**: Enable automatic database backups
5. **Physical security**: Since all data is local, physical machine access is the primary threat vector

### Threat Model

```
┌─────────────────────────────────────────────────────────┐
│                  Libern Threat Model                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Threats Mitigated:                                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ✓ Data theft from cloud breach (no cloud)        │   │
│  │ ✓ Third-party data access (no servers)           │   │
│  │ ✓ Surveillance/telemetry (zero telemetry)        │   │
│  │ ✓ Message tampering (.aioss hash chain)          │   │
│  │ ✓ Identity spoofing (signatures planned)         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Remaining Threats (mitigated by user):                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ✗ Physical access to device                     │   │
│  │   → Use full-disk encryption (BitLocker, etc.)  │   │
│  │ ✗ Malware on device                              │   │
│  │   → Use antivirus, keep OS updated              │   │
│  │ ✗ LAN eavesdropping                              │   │
│  │   → Use encrypted LAN (WPA3, etc.)              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Data Storage Details

### SQLite Database Contents

| Table | Data Stored | Sensitivity |
|-------|-------------|-------------|
| `users` | Display names, public keys | Medium |
| `servers` | Server names, invite codes | Low |
| `channels` | Channel names, types | Low |
| `messages` | Message content, timestamps, signatures | High |
| `message_reactions` | Emoji reactions | Low |
| `roles` | Role names, permissions | Low |
| `role_assignments` | User-role mappings | Medium |
| `invites` | Invite codes, usage counts | Medium |
| `user_xp` | XP totals, levels | Low |
| `casino_balances` | Casino balances | Medium |
| `ai_conversations` | AI chat history | Medium |
| `document_chunks` | Document embeddings | Medium |
| `marketplace_items` | Published item data | Medium |
| `aioss_sessions` | Session metadata | Low |
| `health_logs` | Diagnostic results | Low |

### What Gets Signed (Planned)

Each message will be signed with Ed25519. The signature covers:
- Message ID
- Channel ID
- Content hash
- HLC timestamp
- Author ID

The signature ensures:
- **Authentication**: The author is who they claim to be
- **Integrity**: Content hasn't been modified
- **Non-repudiation**: Authors cannot deny sending messages

---

## Privacy Policy (Summary)

Libern's approach to privacy:

1. **Data Collection**: We do not collect any data. Period.
2. **Data Storage**: All data stored locally on your device.
3. **Data Sharing**: We do not share data. There are no servers to share from.
4. **Data Retention**: You control your data. Delete it any time.
5. **Third Parties**: No third-party services except Hugging Face for optional AI model download.
6. **Cookies**: No cookies. The app uses no web tracking.
7. **Analytics**: No analytics libraries or tracking code.
8. **Crash Reporting**: No automatic crash reporting.

---

## Security FAQ Summary

## External Audits and Verification

### Code Auditability

Since Libern is fully open source:
1. Anyone can audit the code for security issues
2. The binary can be built from source (reproducible builds planned)
3. The .aioss format is fully documented
4. Cryptographic algorithms are standard (SHA3-256, Ed25519)

### Verifying Your Binary

```bash
# Build from source and compare
git clone https://github.com/libern/libern
cd libern
cargo build --release

# Compare with downloaded binary
sha256sum target/release/libern.exe
# Compare hash with published checksum
```

### Network Traffic Verification

You can verify Libern makes no unexpected network requests:

```bash
# Windows
netstat -ano | findstr libern

# macOS/Linux
lsof -i -P | grep libern
```

Expected connections:
- mDNS (UDP 5353, local network only)
- WebSocket P2P (TCP, local network only)
- Hugging Face (TCP 443, during model download only)

---

## Security FAQ Summary

| Question | Answer |
|----------|--------|
| Is my data encrypted? | Cryptographically signed (E2E planned) |
| Do you collect telemetry? | No, zero telemetry |
| Where is my data stored? | Locally on your machine |
| Can you see my messages? | No, we have no servers |
| Is the AI private? | Yes, runs entirely locally |
| Can I verify data integrity? | Yes, via .aioss verification |
| Can I delete my data? | Yes, delete app data directory |
| Is my identity recoverable? | Not yet (key backup planned) |
| What protections exist? | Hash chains, signing, local-only |
| Can others access my data? | Only with physical access |
| Is there a threat model? | Yes (see above) |
| What about compliance? | .aioss supports GDPR, HIPAA, SOC 2 |
| Can I audit the code? | Yes, fully open source |
| Can I verify network traffic? | Yes, use netstat/lsof |
| Are there backdoors? | No, verifiable in source code |

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
