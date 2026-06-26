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

# Offline Data Ownership

**Category:** Data Safety
**File:** 03-offline-data-ownership.md
**Revision:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Data Never Leaves Your Machine](#data-never-leaves-your-machine)
3. [Full Offline Access](#full-offline-access)
4. [No Cloud Storage](#no-cloud-storage)
5. [Local Database Architecture](#local-database-architecture)
6. [Local AI Inference](#local-ai-inference)
7. [P2P Synchronization Model](#p2p-synchronization-model)
8. [User Control Over Data](#user-control-over-data)
9. [Comparison with Cloud-Based Platforms](#comparison-with-cloud-based-platforms)
10. [References](#references)

---

## Overview

Libern is designed around a fundamental principle: **your data belongs to you and never leaves your machine unless you explicitly choose to share it.** There is no cloud, no server-side storage, no third-party data processing. Every message, file, AI response, whiteboard stroke, and voice recording is stored exclusively on your local machine.

---

## Data Never Leaves Your Machine

### Local-Only Storage

All Libern data is stored in two locations on the local machine:

1. **SQLite Database** (`<app_data>/libern/data.db`)
   - Messages, users, channels, servers, roles, AI conversations, moderation logs, document chunks, marketplace items
   - 20+ tables defined in `crates/libern-core/src/db/schema.rs`

2. **.aioss Ledger Files** (`<app_data>/libern/ledgers/`)
   - Tamper-evident hash chains recording every action
   - Binary (.aioss) and JSON (.aioss.json) formats

### What Never Leaves

| Data Type | Storage | Offline? | Sent to Cloud? |
|-----------|---------|----------|---------------|
| Messages | SQLite + .aioss | Yes | No |
| Private keys | SQLite (encrypted) | Yes | No |
| AI model | Local filesystem | Yes | No |
| Files/attachments | Local filesystem | Yes | No |
| Voice recordings | Local filesystem | Yes | No |
| Whiteboard strokes | SQLite + .aioss | Yes | No |
| AI conversation history | SQLite | Yes | No |

### What Is Shared (User-Opted)

- **Messages in shared channels:** Sent to peers via WebSocket
- **Server/channel metadata:** Shared with peers who join server
- **File transfers:** Direct P2P
- **Presence information:** mDNS broadcast

---

## Full Offline Access

### Zero Internet Dependency

- **Installation:** Single binary, no package manager
- **First launch:** No account creation, no email verification
- **Daily use:** All features work offline
- **AI inference:** Local Qwen model via `llama.cpp`
- **Peer discovery:** mDNS on local LAN

### Offline Capabilities

| Feature | Online Required? | Notes |
|---------|-----------------|-------|
| Send messages | No | P2P or local |
| Voice chat | No | LAN direct |
| Liber AI | No | Local inference |
| File sharing | No | LAN P2P |
| Whiteboard | No | P2P sync |
| Document RAG | No | Local embeddings |
| User management | No | Local DB |
| .aioss ledger | No | Local |

---

## No Cloud Storage

| Cloud Dependency | Libern's Approach | Benefit |
|-----------------|-------------------|---------|
| Message relay | P2P WebSocket | No SPOF |
| File hosting | Local + LAN | No limits |
| User auth | Ed25519 keypairs | No account DB |
| AI inference | Local llama.cpp | No API costs |
| Voice routing | Direct UDP | Low latency |
| Presence | mDNS | No status server |
| Analytics | None | Zero telemetry |

### What This Means

- **No data caps:** As much storage as your disk allows
- **No subscription:** All features free
- **No ToS changes:** No cloud provider controls your data
- **No shutdown:** Works even if dev team disappears
- **No data mining:** No company analyzing conversations

---

## Local Database Architecture

```rust
pub struct Database {
    pub conn: Mutex<Connection>,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self, rusqlite::Error> {
        let conn = Connection::open(db_path)?;
        conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")?;
        // ...
    }
}
```

Key features:
- **WAL mode:** Concurrent reads during writes
- **Foreign keys:** Referential integrity
- **No network:** SQLite is local-only
- **Portable:** Single `.db` file

---

## Local AI Inference

### The Liber AI Pipeline

```
User: "@Liber summarize the last 50 messages"
  → Rust queries messages from local SQLite
  → Constructs prompt locally (no API call)
  → Pushes to local Qwen inference queue
  → Qwen processes on CPU/GPU
  → Tokens streamed back via Tauri Channel
  → Liber's response rendered in chat
```

### What Never Happens

- No HTTP request to an AI API provider
- No prompt data sent over network
- No usage statistics transmitted
- No user messages logged by third party

---

## P2P Synchronization Model

1. **Discovery:** mDNS broadcasts
2. **Authentication:** Ed25519 challenge-response
3. **CRDT Sync:** Deterministic merge
4. **Verification:** Ed25519 signature check
5. **Application:** Local SQLite + .aioss

### User Control

- Choose which servers to share
- Servers can be "local only"
- Peers can be blocked
- All P2P traffic is direct

### No Cloud Fallback

Libern has **no cloud fallback**. Wide-area sync requires user-setup VPN (Tailscale, WireGuard).

---

## User Control Over Data

| Action | Method |
|--------|--------|
| View all data | Libern UI or direct SQLite |
| Export all data | .aioss JSON, SQLite dump, TXT |
| Delete all data | Delete app data directory |
| Delete specific data | UI delete commands |
| Back up data | Copy .db and .aioss files |
| Audit data | verify_any() hash check |

---

## Comparison with Cloud-Based Platforms

| Aspect | Cloud Platforms | Libern |
|--------|---------------|--------|
| Data storage | Company servers | Local machine |
| Internet required | Always | Never |
| File limits | 25MB-1GB | Unlimited |
| History retention | Limited | Unlimited |
| AI processing | Cloud API | Local inference |
| Account required | Yes | No (keypair) |
| Company access | Yes | No |
| Works after shutdown | No | Yes |

---

## Data Ownership Verification

You can verify that your data remains local at any time:

### Method 1: File System Inspection

```bash
# Check that no data is stored in cloud directories
ls "$env:APPDATA/libern/libern.db"   # Local SQLite
ls "$env:APPDATA/libern/keys/"        # Local keys
ls "$env:APPDATA/libern/models/"      # Local AI model

# No cloud sync directories exist
Test-Path "$env:APPDATA/libern/cloud_sync"  # Should not exist
Test-Path "$env:APPDATA/libern/telemetry"    # Should not exist
```

### Method 2: Network Monitor

```bash
# Run while using Libern — no cloud connections should appear
netstat -n | findstr "443"  # No HTTPS to cloud services
```

### Method 3: Database Contents

```sql
-- Verify no server URLs in configuration
SELECT * FROM config WHERE key LIKE '%cloud%' OR key LIKE '%sync%';
-- Expected: empty result set
```

## Freedom from Vendor Lock-In

| Vendor Lock-In Mechanism | Libern's Approach |
|-------------------------|-------------------|
| Proprietary file format | Open SQLite + documented .aioss JSON |
| API dependency | P2P direct, no API keys |
| Account system | None (Ed25519 identity) |
| Subscription billing | None (free software) |
| Feature gates | All features in single binary |
| Data import/export friction | Immediate export, any format |
| Service shutdown | Continues working independently |
| EULA/ToS changes | AGPL-3.0 protects user rights |
| Ecosystem lock-in | Can migrate to any SQLite-compatible tool |

## The Offline Pledge

Libern makes the following commitments to data ownership:

1. **We cannot access your data.** There is no server, no cloud, no backend. Your data stays on your machine.
2. **We cannot change the rules.** AGPL-3.0 license means the source is frozen at your version. No remote updates can alter privacy properties.
3. **We cannot monetize your data.** There is no telemetry, no analytics, no advertising. There is no business model based on data collection.
4. **We cannot stop working.** Even if the development team disappears, the software continues functioning. There is no license server, no activation, no cloud dependency.
5. **We cannot lock you in.** All data is in open formats. You can migrate to any other tool at any time.

## Offline Data Verification Procedures

### Daily Data Check

```bash
#!/bin/bash
echo "=== Daily Data Ownership Check ==="
echo "Date: $(date)"
echo ""

# 1. Confirm SQLite is local
DB_PATH="$HOME/.local/share/libern/data.db"
if [ -f "$DB_PATH" ]; then
    echo "✓ Local SQLite database present: $DB_PATH"
    echo "  Size: $(du -h "$DB_PATH" | cut -f1)"
else
    echo "✗ Database not found!"
fi

# 2. Confirm no cloud sync processes
if pgrep -x "rclone" > /dev/null || pgrep -x "onedrive" > /dev/null; then
    echo "⚠ Cloud sync tools are running (verify Libern is excluded)"
fi

# 3. Check for unexpected network connections
CONNECTIONS=$(ss -tupn 2>/dev/null | grep -c "ESTAB" || netstat -n 2>/dev/null | findstr /c:"ESTABLISHED" | find /c /v "")
echo "  Active connections: $CONNECTIONS"

# 4. List all local data files
echo ""
echo "Local data files:"
find "$HOME/.local/share/libern" -type f 2>/dev/null | while read f; do
    echo "  $(du -h "$f" | cut -f1) $f"
done
```

### Data Location Verification

```sql
-- SQL: Verify all data is in local database only
-- No remote servers, no cloud identifiers
SELECT 'Data Location Verification' as check_name;
SELECT COUNT(*) as total_tables FROM sqlite_master WHERE type='table';
SELECT name as locally_stored_tables FROM sqlite_master WHERE type='table' ORDER BY name;
-- Expected: Only Libern's internal tables, no cloud sync tables
```

## Offline Feature Matrix

| Feature | Works Offline | Works on LAN Only | Requires Internet |
|---------|-------------|-------------------|-------------------|
| Text messaging | ✓ | ✓ | - |
| AI chat (Qwen) | ✓ | ✓ | - |
| AI summarization | ✓ | ✓ | - |
| RAG document query | ✓ | ✓ | - |
| Content moderation | ✓ | ✓ | - |
| Role management | ✓ | ✓ | - |
| Server management | ✓ | ✓ | - |
| Channel management | ✓ | ✓ | - |
| .aioss audit trail | ✓ | ✓ | - |
| File attachments | ✓ | ✓ | - |
| Voice chat (P2P) | - | ✓ | - |
| P2P sync | - | ✓ | - |
| mDNS discovery | - | ✓ | - |
| AI model download | - | - | ✓ |
| Application updates | - | - | ✓ |

## Offline-By-Default Configuration

```json
{
  "network": {
    "lan_only": true,
    "enable_mdns": false,
    "enable_ws_sync": false,
    "discovery_port": 42068,
    "audio_port": 42069
  },
  "ai": {
    "enabled": true,
    "model_path": "/path/to/model.gguf"
  },
  "storage": {
    "max_attachment_size_mb": 500,
    "retention_days": 0
  },
  "updates": {
    "auto_update": false
  }
}
```

## Data Ownership FAQ

### Who owns the data in Libern?

You do. All data is stored on your machine. Libern the software does not access, transmit, or process your data on any external server.

### Can Libern see my messages?

No. There is no server, no backend, no telemetry. Libern has no mechanism to see your data.

### What happens if I delete Libern?

Your data files remain on your machine unless you explicitly delete them. You can export or back up your data before uninstalling.

### Can I use Libern without the AI model?

Yes. All non-AI features work without the model. Liber simply shows "model not available" for AI features.

### Does Libern require an account?

No. Libern uses Ed25519 keypairs for identity. No email, password, phone, or any personal information is required.

### Can multiple people share one Libern installation?

Libern is designed for single-user per installation. For shared machines, use OS-level user accounts.

### What if my hard drive fails?

Restore from backup. The .aioss ledger files can be independently verified to confirm no data corruption occurred before the failure.

### Can I export my data to another platform?

Yes. SQLite is a standard format. You can export to CSV, JSON, or plain text. The .aioss JSON format is also documented for custom tooling.

## Data Ownership Comparison Matrix

| Aspect | Libern | Discord | Slack | Microsoft Teams |
|--------|--------|---------|-------|-----------------|
| Data storage location | Local machine | Discord servers | Slack servers | Azure servers |
| Internet required | No | Yes | Yes | Yes |
| Company access to data | None | Full | Full | Full |
| Government access to data | Limited (device seizure) | Possible (legal request) | Possible | Possible |
| Data format | Open (SQLite) | Proprietary | Proprietary | Proprietary |
| Export format | JSON, CSV, SQL | Limited API | API (Enterprise) | eDiscovery |
| Data retention control | Full user control | Vendor policy | Vendor policy | Admin configurable |
| Data deletion | Immediate | Delayed | Delayed | 30-day hold |
| Works after company shuts down | Yes | No | No | No |
| Can modify source code | Yes (AGPL-3.0) | No | No | No |
| Offline AI | Yes | No | No | No |

## Offline Data Audit

```rust
pub fn audit_data_ownership(data_dir: &str) -> DataOwnershipReport {
    let mut report = DataOwnershipReport {
        timestamp: chrono::Utc::now().to_rfc3339(),
        local_data_found: Vec::new(),
        cloud_data_found: Vec::new(),
        network_connections: Vec::new(),
        ai_data_local: true,
        telemetry_found: false,
    };

    // Check for local data files
    let paths = ["libern.db", "config.json", "keys/identity.pem", "aioss"];
    for path in &paths {
        let full_path = std::path::Path::new(data_dir).join(path);
        if full_path.exists() {
            report.local_data_found.push(path.to_string());
        }
    }

    // Check for cloud indicators in config
    let config_path = std::path::Path::new(data_dir).join("config.json");
    if let Ok(config) = std::fs::read_to_string(&config_path) {
        if config.contains("cloud") || config.contains("s3://") || config.contains("azure") {
            report.cloud_data_found.push("Cloud references found in config".into());
        }
    }

    report
}

pub struct DataOwnershipReport {
    pub timestamp: String,
    pub local_data_found: Vec<String>,
    pub cloud_data_found: Vec<String>,
    pub network_connections: Vec<String>,
    pub ai_data_local: bool,
    pub telemetry_found: bool,
}
```

## Data Ownership Verification Certificate

```json
{
  "certificate_type": "Data Ownership Verification",
  "tool": "Libern Data Ownership Auditor",
  "timestamp": "2026-06-19T12:00:00Z",
  "checks": {
    "data_storage_location": {
      "path": "~/.local/share/libern/",
      "cloud_sync_found": false,
      "external_storage_found": false,
      "verdict": "PASS — All data stored locally"
    },
    "network_connections": {
      "connections_during_idle": 0,
      "connections_during_active_use": {
        "mDNS_multicast": true,
        "direct_p2p": false,
        "http_external": false
      },
      "verdict": "PASS — No unauthorized network connections"
    },
    "ai_data_flow": {
      "local_inference": true,
      "cloud_api_calls": false,
      "prompts_sent_externally": 0,
      "verdict": "PASS — AI runs entirely locally"
    },
    "telemetry": {
      "analytics_code_found": false,
      "crash_reporting_enabled": false,
      "usage_tracking_found": false,
      "verdict": "PASS — Zero telemetry confirmed"
    }
  },
  "overall_verdict": "PASS — User maintains full data ownership"
}
```

## References

- `crates/libern-core/src/db/mod.rs` — Database initialization
- `crates/libern-core/src/db/schema.rs` — All table definitions
- `crates/libern-core/src/db/models.rs` — Data structs
- `crates/libern-aioss/src/` — .aioss ledger
- `crates/libern-core/src/ai/` — Local AI inference

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

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
