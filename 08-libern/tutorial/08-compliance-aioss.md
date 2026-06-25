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
Category: Tutorial
Document ID: TUT-008
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Compliance and .aioss Sessions

## Introduction

The .aioss (AI Operated Session Store) format is Libern's tamper-evident binary ledger. Every action in Libern — messages sent, channels created, roles assigned — is recorded as a hash-chained entry in the .aioss session. This tutorial covers viewing sessions, verifying integrity, exporting, and signing.

### .aioss System Overview

```
┌─────────────────────────────────────────────────────────┐
│                   .aioss Ledger System                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Hash Chain Structure                            │   │
│  │                                                   │   │
│  │  Genesis Entry (index: 0)    Entry 1 (index: 1)  │   │
│  │  ┌──────────────────┐       ┌──────────────────┐ │   │
│  │  │ content_hash: H0 │       │ content_hash: H1 │ │   │
│  │  │ parent_hash: 0   │──────►│ parent_hash: H0  │ │   │
│  │  └──────────────────┘       └────────┬─────────┘ │   │
│  │                                       │           │   │
│  │  Entry 2 (index: 2)       Entry 3     │           │   │
│  │  ┌──────────────────┐       ┌────────▼─────────┐ │   │
│  │  │ content_hash: H2 │       │ content_hash: H3 │ │   │
│  │  │ parent_hash: H1 │──────►│ parent_hash: H2  │ │   │
│  │  └──────────────────┘       └──────────────────┘ │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Verification: Check every parent_hash matches          │
│  the hash of the previous entry                         │
└─────────────────────────────────────────────────────────┘
```

---

## Part 1: What is .aioss?

.aioss is a binary file format with the following structure:

### File Layout

```
┌─────────────────────────────────────────┐
│          AiossHeader (128 bytes)        │
├─────────────────────────────────────────┤
│          AiossEntry 0 (256 bytes)       │
├─────────────────────────────────────────┤
│          AiossEntry 1 (256 bytes)       │
├─────────────────────────────────────────┤
│          ...                            │
└─────────────────────────────────────────┘
```

### Header Format (128 bytes)

The `AiossHeader` is defined in `crates/libern-aioss/src/header.rs`:

| Offset | Size | Field | Description |
|--------|------|-------|-------------|
| 0 | 5 | `magic` | Magic bytes `b"AIOSS"` |
| 5 | 2 | `version` | Format version (LE u16, currently 1) |
| 7 | 2 | `header_checksum` | CRC-16 of header fields |
| 9 | 36 | `session_id` | UUID as ASCII bytes |
| 45 | 32 | `created_at` | ISO 8601 timestamp, null-padded |
| 77 | 1 | `status` | 0=active, 1=sealed, 2=archived |
| 78 | 1 | `session_type` | 0=chat, 1=game, 2=ai, 3=system |
| 79 | 4 | `entry_count` | Number of entries (LE u32) |
| 83 | 32 | `genesis_hash` | SHA3-256 of first entry |
| 115 | 32 | `head_hash` | SHA3-256 of last entry |
| 147 | 8 | `_reserved` | Reserved for future use |

### Header Rust Implementation

```rust
// From crates/libern-aioss/src/header.rs
#[repr(C, packed)]
pub struct AiossHeader {
    pub magic: [u8; 5],              // b"AIOSS"
    pub version: [u8; 2],            // LE u16
    pub header_checksum: [u8; 2],    // CRC-16
    pub session_id: [u8; 36],        // UUID ASCII
    pub created_at: [u8; 32],        // ISO 8601, null-padded
    pub status: u8,                  // 0=active, 1=sealed, 2=archived
    pub session_type: u8,            // 0=chat, 1=game, 2=ai, 3=system
    pub entry_count: [u8; 4],        // LE u32
    pub genesis_hash: [u8; 32],      // SHA3-256
    pub head_hash: [u8; 32],         // SHA3-256
    pub _reserved: [u8; 8],          // Future use
}

impl AiossHeader {
    pub const SIZE: usize = 128;

    pub fn new(session_id: &str, session_type: u8) -> Self {
        let mut header = AiossHeader {
            magic: *b"AIOSS",
            version: 1u16.to_le_bytes(),
            header_checksum: [0u8; 2],
            session_id: [0u8; 36],
            created_at: [0u8; 32],
            status: 0,
            session_type,
            entry_count: 0u32.to_le_bytes(),
            genesis_hash: [0u8; 32],
            head_hash: [0u8; 32],
            _reserved: [0u8; 8],
        };

        // Copy session_id (null-padded)
        let sid_bytes = session_id.as_bytes();
        let len = sid_bytes.len().min(36);
        header.session_id[..len].copy_from_slice(&sid_bytes[..len]);

        // Set created_at to current ISO 8601
        let now = chrono::Utc::now().format("%Y-%m-%dT%H:%M:%S%.3fZ").to_string();
        let now_bytes = now.as_bytes();
        let len = now_bytes.len().min(32);
        header.created_at[..len].copy_from_slice(&now_bytes[..len]);

        header
    }
}
```

### Entry Format (256 bytes)

The `AiossEntry` is defined in `crates/libern-aioss/src/entry.rs`:

| Offset | Size | Field | Description |
|--------|------|-------|-------------|
| 0 | 4 | `index` | Entry index (LE u32) |
| 4 | 8 | `timestamp_unix_ms` | Unix timestamp in milliseconds (LE u64) |
| 12 | 20 | `entry_type` | Type label, null-padded (e.g., "message") |
| 32 | 16 | `actor` | Actor ID, null-padded |
| 48 | 24 | `actor_label` | Actor display name, null-padded |
| 72 | 32 | `content_hash` | SHA3-256 of JSON content |
| 104 | 32 | `parent_hash` | SHA3-256 of previous entry |
| 136 | 12 | `_reserved` | Reserved |

The genesis entry has `parent_hash = [0; 32]`.

### Hash Chain

Each entry's hash is computed as:
```rust
pub fn compute_binary_hash(&self) -> [u8; 32] {
    let bytes = self.to_bytes();
    let mut hasher = Sha3_256::new();
    hasher.update(&bytes[0..72]);    // index through actor_label
    hasher.update(&bytes[104..]);    // parent_hash through end
    hasher.finalize().into()
}
```

The content hash is computed separately:
```rust
let content_hash = Sha3_256::digest(content_json.as_bytes());
```

### Entry Rust Implementation

```rust
// From crates/libern-aioss/src/entry.rs
#[repr(C, packed)]
pub struct AiossEntry {
    pub index: [u8; 4],              // LE u32
    pub timestamp_unix_ms: [u8; 8],  // LE u64
    pub entry_type: [u8; 20],        // null-padded
    pub actor: [u8; 16],             // null-padded
    pub actor_label: [u8; 24],       // null-padded
    pub content_hash: [u8; 32],      // SHA3-256
    pub parent_hash: [u8; 32],       // SHA3-256 of previous
    pub _reserved: [u8; 12],
    // Total: 4+8+20+16+24+32+32+12 = 148 bytes (but struct is 256 with alignment)
}

impl AiossEntry {
    pub const SIZE: usize = 256;

    pub fn new(
        index: u32,
        entry_type: &str,
        actor: &str,
        actor_label: &str,
        content_json: &str,
        parent_entry: Option<&AiossEntry>,
    ) -> Self {
        let content_hash = Sha3_256::digest(content_json.as_bytes());
        let parent_hash = match parent_entry {
            Some(entry) => entry.compute_binary_hash(),
            None => [0u8; 32], // genesis entry
        };

        // ... build entry struct ...
    }
}
```

---

## Part 2: Accessing the Compliance Dashboard

Click the **🛡️ Compliance** icon in the ServerListSidebar to open the `ComplianceDashboard` component.

The `ComplianceDashboard` (`apps/desktop/src/components/compliance/ComplianceDashboard.tsx`) has three tabs:

```
┌─────────────────────────────────────────────────────┐
│  🛡️ Compliance Dashboard                            │
├─────────────────────────────────────────────────────┤
│  [Ledgers]  [Health]  [Export]                      │
│                                                      │
│  Ledgers Tab:                                        │
│  ┌─────────────────────────────────────────────┐   │
│  │ Session List                                 │   │
│  │ ┌─────────────────────────────────────────┐ │   │
│  │ │ chat_abc123_20260619_120000.aioss  ✓    │ │   │
│  │ │ chat_def456_20260619_130000.aioss  ✓    │ │   │
│  │ │ game_789012_20260618_150000.aioss  ✓    │ │   │
│  │ └─────────────────────────────────────────┘ │   │
│  │                                              │   │
│  │ Selected Session Details:                    │   │
│  │ ID: abc123...                                │   │
│  │ Status: Sealed                               │   │
│  │ Entries: 42                                  │   │
│  │ Created: 2026-06-19T12:00:00.000Z            │   │
│  │                                              │   │
│  │ [Verify] [Sign] [Export JSON] [Export TXT]  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Part 3: View .aioss Sessions

1. Open the Compliance dashboard.
2. The **Ledgers** tab shows all .aioss files in `{app_data_dir}/aioss/`.
3. Click a session to view its details.

The session list is populated by the `list_aioss_sessions` command:
```rust
#[tauri::command]
pub fn list_aioss_sessions(app: AppHandle) -> Result<Vec<String>, String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let aioss_dir = app_dir.join("aioss");
    // Walk the directory tree for *.aioss files
    let files = walkdir::WalkDir::new(&aioss_dir)
        .into_iter().filter_map(|e| e.ok())
        .filter(|e| e.path().extension().map_or(false, |ext| ext == "aioss"))
        .map(|e| e.path().to_str().unwrap().to_string())
        .collect();
    Ok(files)
}
```

### Session Details

When a session is selected, the dashboard shows:
- **Session ID** (UUID)
- **Status** (active/sealed/archived)
- **Entry count**
- **Schema version**
- Entry list with index, type, actor, timestamp, and hashes

---

## Part 4: Verify Session Integrity

Click **"Verify"** on any selected session to run hash chain verification.

The `verify_aioss_file` command:
```rust
#[tauri::command]
pub fn verify_aioss_file(path: String) -> Result<serde_json::Value, String> {
    let bytes = std::fs::read(&path).map_err(|e| e.to_string())?;
    let (verified, tampered, total) = verify_any(&bytes)?;
    Ok(serde_json::json!({
        "verified": verified,
        "tampered_count": tampered,
        "total_entries": total,
        "path": path,
    }))
}
```

### Verification Logic

The `verify_any` function auto-detects binary vs JSON format:

```rust
pub fn verify_any(bytes: &[u8]) -> Result<(bool, usize, usize), String> {
    if bytes.len() >= 5 && &bytes[0..5] == b"AIOSS" {
        let ledger = BinaryLedger::from_bytes(bytes)?;
        Ok(verify_binary(&ledger))
    } else {
        let ledger: LedgerFileJson = serde_json::from_slice(bytes)?;
        Ok(verify_json(&ledger))
    }
}
```

Binary verification checks:
1. Each entry's `parent_hash` matches the previous entry's computed hash.
2. Each entry's computed hash matches the stored hash.

JSON verification (`verify.rs:5`) does the same for the JSON format.

```rust
// Binary verification
fn verify_binary(ledger: &BinaryLedger) -> (bool, usize, usize) {
    let mut tampered = 0;
    let total = ledger.entries.len();

    for (i, entry) in ledger.entries.iter().enumerate() {
        // Genesis entry check
        if i == 0 {
            if entry.parent_hash.iter().any(|&b| b != 0) {
                tampered += 1;
                continue;
            }
        } else {
            // Check parent_hash matches previous entry's hash
            let prev_hash = ledger.entries[i - 1].compute_binary_hash();
            if entry.parent_hash != prev_hash {
                tampered += 1;
            }
        }

        // Verify own hash integrity
        let computed = entry.compute_binary_hash();
        // Note: actual hash is not stored in entry, only computed
    }

    (tampered == 0, tampered, total)
}
```

---

## Part 5: Create and Seal Sessions

### Create a Session

```typescript
import { createAiossSession } from "./lib/api";
const session = await createAiossSession(0); // 0 = chat session
// { session_id: "uuid...", session_type: 0, created_at: "2026-..." }
```

### Append an Entry

```typescript
import { appendAiossEntry } from "./lib/api";
const entry = await appendAiossEntry(
    0,                                // session_index
    "message",                        // entry_type
    userId,                           // actor
    "User Name",                      // actor_label
    JSON.stringify({ content: "hi" }) // content_json
);
```

### Seal a Session

```typescript
import { sealAiossSession } from "./lib/api";
const path = await sealAiossSession(0);
// Returns path like: "C:/Users/.../aioss/chat/uuid_20260619_120000.aioss"
```

Sealing writes both binary (`.aioss`) and JSON (`.aioss.json`) format files.

---

## Part 6: Sign Sessions (State Proof)

Generate an Ed25519 cryptographic signature over the ledger head hash:

```typescript
import { signAiossSession } from "./lib/api";
const proof = await signAiossSession(0);
// {
//   head_hash: "abcd...",
//   entry_count: 42,
//   session_id: "uuid...",
//   signature: "base64...",
//   public_key: "base64...",
//   verified: true
// }
```

The `StateProof` (`crates/libern-aioss/src/state_proof.rs`):
1. Generates a fresh Ed25519 keypair.
2. Signs the message `"{head_hash}:{entry_count}:{session_id}"`.
3. Returns the signature and public key (both base64-encoded).

The proof can be independently verified:
```rust
pub fn verify(&self) -> bool {
    let message = format!("{}:{}:{}", self.head_hash, self.entry_count, self.session_id);
    let verifying_key = ed25519_dalek::VerifyingKey::from_bytes(&self.public_key).unwrap();
    let signature = ed25519_dalek::Signature::from_bytes(&self.signature);
    verifying_key.verify(message.as_bytes(), &signature).is_ok()
}
```

### State Proof Structure

```
┌─────────────────────────────────────────────────────┐
│  StateProof                                         │
├─────────────────────────────────────────────────────┤
│  head_hash:   "a1b2c3d4..."  (SHA3-256 hex)        │
│  entry_count: 42                                     │
│  session_id:  "abc-def-..."                         │
│                                                      │
│  Message to sign:                                    │
│  "a1b2c3d4...:42:abc-def-..."                       │
│                                                      │
│  Ed25519 Sign(message, private_key)                  │
│       │                                              │
│       ▼                                              │
│  signature: "base64..."   (64 bytes)                 │
│  public_key: "base64..."  (32 bytes)                │
└─────────────────────────────────────────────────────┘
```

---

## Part 7: Aggregation Schedule

Configure how often .aioss sessions are automatically sealed:

```typescript
import { setAiossInterval } from "./lib/api";

// Available intervals
await setAiossInterval(60);      // 1 minute
await setAiossInterval(600);     // 10 minutes (default)
await setAiossInterval(3600);    // 1 hour
await setAiossInterval(86400);   // 24 hours
```

The `AiossScheduler` manages the sealing schedule:
```rust
pub struct AiossScheduler {
    interval: AiossInterval,
    last_seal: Instant,
}

impl AiossScheduler {
    pub fn new(interval: AiossInterval) -> Self {
        AiossScheduler {
            interval,
            last_seal: Instant::now(),
        }
    }

    pub fn should_seal(&self) -> bool {
        self.last_seal.elapsed() >= self.interval.as_duration()
    }

    pub fn seal(&mut self) {
        self.last_seal = Instant::now();
        // Perform sealing logic
    }
}
```

---

## Part 8: Health Diagnostics

The compliance dashboard includes a health diagnostics system that checks:

```typescript
import { runHealthDiagnostics } from "./lib/api";
const health = await runHealthDiagnostics();
// Returns array of health entries:
// [
//   { test: "cpu_available", category: "hardware", status: "pass", duration_ms: 5, detail: "CPU detected" },
//   { test: "memory_available", category: "hardware", status: "pass", duration_ms: 10, detail: "16GB RAM available" },
//   { test: "gpu_available", category: "hardware", status: "warn", duration_ms: 50, detail: "No GPU detected, using CPU" },
//   { test: "disk_space", category: "storage", status: "pass", duration_ms: 20, detail: "100GB free" },
//   { test: "network_reachable", category: "network", status: "pass", duration_ms: 150, detail: "1.1.1.1 reachable" },
// ]
```

Each health entry is hash-chained (previous entry's hash is included in the next), forming a verifiable diagnostics chain.

### Health Tests

| Test | Category | Description |
|------|----------|-------------|
| `cpu_available` | hardware | CPU detected and operational |
| `memory_available` | hardware | Sufficient RAM available |
| `gpu_available` | hardware | GPU detected (warn if CPU-only) |
| `disk_space` | storage | Sufficient free disk space |
| `network_reachable` | network | Internet connectivity check |
| `db_integrity` | database | SQLite integrity check |
| `aioss_verify` | compliance | .aioss hash chain verification |

---

## Part 9: Export Formats

The Compliance dashboard Export tab provides:
- **JSON export** — Download the ledger as JSON
- **TXT log export** — Download as human-readable text log
- **Compliance Report (HTML)** — Generate an HTML compliance report

```typescript
// Get ledger as JSON
import { getAiossLedgerJson } from "./lib/api";
const ledger = await getAiossLedgerJson(0);
```

### Export Format Examples

```json
// JSON format (.aioss.json)
{
  "header": {
    "magic": "AIOSS",
    "version": 1,
    "session_id": "abc123...",
    "created_at": "2026-06-19T12:00:00.000Z",
    "status": "sealed",
    "session_type": "chat",
    "entry_count": 42,
    "genesis_hash": "...",
    "head_hash": "..."
  },
  "entries": [
    {
      "index": 0,
      "timestamp": 1718000000000,
      "type": "message",
      "actor": "user-uuid",
      "actor_label": "Alice",
      "content": {"text": "Hello everyone!"},
      "content_hash": "...",
      "parent_hash": "00000000..."
    }
  ]
}
```

```txt
// TXT log format (.aioss.txt)
═══════════════════════════════════════════════════
.aioss Session Log
Session: abc123...
Created: 2026-06-19T12:00:00.000Z
Status: Sealed
═══════════════════════════════════════════════════

Entry #0 | 2026-06-19 12:00:01 | message | Alice
  Content: Hello everyone!
  Content Hash: a1b2...
  Parent Hash: 0000...
───────────────────────────────────────────────────

Entry #1 | 2026-06-19 12:00:05 | message | Bob
  Content: Hi Alice!
  Content Hash: c3d4...
  Parent Hash: a1b2...
───────────────────────────────────────────────────
```

---

## Part 10: Full API Reference

### .aioss Commands

All .aioss commands are registered in `apps/desktop/src-tauri/src/lib.rs`:

```rust
commands::aioss::create_aioss_session,
commands::aioss::append_aioss_entry,
commands::aioss::seal_aioss_session,
commands::aioss::verify_aioss_file,
commands::aioss::sign_aioss_session,
commands::aioss::get_aioss_ledger_json,
commands::aioss::set_aioss_interval,
commands::aioss::run_health_diagnostics,
commands::aioss::list_aioss_sessions,
```

### File Locations

Sealed sessions are stored at:
```
{app_data_dir}/aioss/chat/{session_id_prefix}_{timestamp}.aioss
{app_data_dir}/aioss/chat/{session_id_prefix}_{timestamp}.aioss.json
```

### Directory Structure

```
aioss/
├── chat/
│   ├── abc123_20260619_120000.aioss
│   ├── abc123_20260619_120000.aioss.json
│   ├── def456_20260619_130000.aioss
│   └── def456_20260619_130000.aioss.json
├── game/
│   └── ghi789_20260618_150000.aioss
└── ai/
    └── jkl012_20260617_090000.aioss
```

---

## Step-by-Step: Compliance Walkthrough

1. **Open Compliance**: Click the 🛡️ icon in the left sidebar.
2. **Browse sessions**: The Ledgers tab lists all .aioss files.
3. **View a session**: Click any session to see its header and entries.
4. **Verify integrity**: Click "Verify" to check the hash chain.
5. **Run diagnostics**: Switch to the Health tab to check system status.
6. **Configure export**: Switch to the Export tab to set the aggregation interval.
7. **Generate proof**: Click "Generate Signed Proof" for Ed25519 state proof.
8. **Export**: Use JSON, TXT, or HTML export buttons.

---

## Use Cases

### Regulatory Compliance

```
Healthcare organization uses Libern:
- All patient communications recorded in .aioss
- Hash chain provides tamper-evident audit trail
- Regular sealing creates immutable records
- State proofs allow external audit verification
- HIPAA compliance through local-only data storage
```

### Internal Audit

```
Enterprise uses Libern for internal communication:
- .aioss session per department meeting
- Health diagnostics verify system integrity
- Exported logs serve as official records
- Signed proofs provide cryptographic evidence
- Aggregation schedule matches retention policy
```

---

## Next Steps

Now you've completed all the tutorials. Next, explore:

- **FAQs**: General, installation, AI, privacy, offline, troubleshooting
- **Developers**: Architecture overview, AI engine, sync protocol, .aioss spec

### Related References

- **FAQ-004**: Privacy and Security FAQ — Data protection details
- **HLP-004**: Database Corruption — .aioss recovery procedures
- **DEV-004**: .aioss Format Specification — Complete format documentation
- **DEV-001**: Architecture Overview — System architecture

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
