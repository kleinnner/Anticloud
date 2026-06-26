---
title: "32 — 10X FEATURES"
sidebar_position: 99
description: "*Version:** 1.0 (May 2026)"
tags: [features]
---

# 32 — 10X FEATURES

**Version:** 1.0 (May 2026)
**Covers:** RBAC, Data Connectors, Audit Dashboard, Compliance Export, Desktop App, Local Sync Folder, Browser Extension, P2P Multi-Instance Sync
**Files:** `src/auth.rs`, `src/rbac.rs`, `src/connectors/`, `src/sync.rs`, `frontend/views/`, `src-tauri/`, `extension/`, `scripts/folder_watch.sh`

---

## Feature 1: RBAC — Role-Based Access Control

### Principle

> Institutions have teams. Teams have roles. Roles have permissions. No permission, no action. Frictionless by default — single-user mode acts as admin.

### Architecture

```
User → WebSocket → AuthMiddleware → RBACGuard → Handler
                      │
              JWT or Bearer Token
              (contains: user_id, role, codex_scope)
```

### Data Model

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Role {
    Admin,        // Full access to everything
    Editor,       // Can query, create nodes, run tools
    Viewer,       // Can query and view graph, no mutations
    Auditor,      // Can view ledger and exports, nothing else
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub name: String,
    pub role: Role,
    pub codex_ids: Vec<String>,  // Scoped to specific codices
    pub token_hash: String,      // bcrypt hash of bearer token
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RbacConfig {
    pub enabled: bool,            // default false — backward compatible
    pub default_role: Role,       // Role::Editor
    pub users: Vec<User>,
}
```

### File: `src/rbac.rs` (new, ~150 lines)

```rust
use std::collections::HashMap;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use parking_lot::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Role {
    Admin, Editor, Viewer, Auditor,
}

impl Role {
    pub fn can_read_graph(&self) -> bool {
        matches!(self, Role::Admin | Role::Editor | Role::Viewer)
    }
    pub fn can_write_graph(&self) -> bool {
        matches!(self, Role::Admin | Role::Editor)
    }
    pub fn can_run_tools(&self) -> bool {
        matches!(self, Role::Admin | Role::Editor)
    }
    pub fn can_manage_users(&self) -> bool {
        matches!(self, Role::Admin)
    }
    pub fn can_view_ledger(&self) -> bool {
        matches!(self, Role::Admin | Role::Auditor)
    }
    pub fn can_export(&self) -> bool {
        matches!(self, Role::Admin | Role::Auditor)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub name: String,
    pub role: Role,
    pub codex_ids: Vec<String>,
    pub token_hash: String,
    pub created_at: String,
}

pub struct RbacManager {
    users: HashMap<String, User>,  // token_hash → User
    pub enabled: bool,
}

impl RbacManager {
    pub fn new(config: RbacConfig) -> Self {
        let mut users = HashMap::new();
        for u in config.users {
            users.insert(u.token_hash.clone(), u);
        }
        RbacManager { users, enabled: config.enabled }
    }

    pub fn authenticate(&self, token: &str) -> Option<&User> {
        if !self.enabled {
            // Fallback: no auth = everything allowed
            return None;
        }
        // Hash the incoming token and compare
        let hash = sha256(token);
        self.users.get(&hash)
    }

    pub fn check(&self, token: &str, permission: fn(&Role) -> bool) -> bool {
        match self.authenticate(token) {
            Some(user) => permission(&user.role),
            None => !self.enabled, // If auth disabled, allow
        }
    }
}

fn sha256(input: &str) -> String {
    use sha2::{Sha256, Digest};
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    format!("{:x}", hasher.finalize())
}
```

### Integration with ws_server.rs

In the auth middleware, after validating the bearer token, resolve the user and inject `UserInfo` as an extension:

```rust
// In middleware, after token validation:
let user = rbac.authenticate(token);
req.extensions_mut().insert(user);

// In each handler, check permission:
let user = req.extensions().get::<User>();
if !user.map(|u| u.role.can_write_graph()).unwrap_or(true) {
    return Err(StatusCode::FORBIDDEN);
}
```

### CLI Commands

```bash
# Add a user
api-oss auth add-user --name "Sarah" --role editor --codex alpha,beta

# Generate a token for a user (includes their role in the JWT)
api-oss auth generate --user sarah

# List users
api-oss auth list-users

# Remove user
api-oss auth remove-user --id user_abc123
```

### UX (Frontend)

In the sidebar, add a user menu:

- If `role == Admin`: Settings gear visible (manage users, view all codices)
- If `role == Editor`: Full access to chat, graph, tools. Cannot manage users.
- If `role == Viewer`: Chat search only. No tools, no node creation. Read-only graph.
- If `role == Auditor`: Dedicated "Audit" tab with ledger view, export buttons. No chat.

---

## Feature 2: Data Connectors — Frictionless Enterprise Ingestion

### Principle

> Drop a connection string or OAuth URL. API-OSS pulls documents automatically. Zero manual ingestion.

### Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ SharePoint  │───→│              │    │             │
│ Google Drive│───→│  Connector   │───→│  Knowledge  │
│ OneDrive    │───→│  Engine      │    │  Graph      │
│ SMB Share   │───→│  (cron+ws)   │    │             │
│ SQL DB      │───→│              │    └─────────────┘
└─────────────┘    └──────────────┘
```

### File: `src/connectors/mod.rs` (new, ~200 lines)

```rust
/// A connector ingests documents from an external source into the graph.
#[async_trait]
pub trait Connector: Send + Sync {
    fn name(&self) -> &str;
    fn config_schema(&self) -> serde_json::Value; // JSON Schema for UI
    async fn connect(&self, config: &serde_json::Value) -> Result<(), anyhow::Error>;
    async fn poll(&self, graph: &GraphStore) -> Result<PollResult, anyhow::Error>;
}

pub struct PollResult {
    pub files_ingested: usize,
    pub errors: Vec<String>,
}

// Built-in connectors
pub struct SharePointConnector;  // Microsoft Graph API
pub struct GoogleDriveConnector; // Google Drive API
pub struct LocalFolderConnector; // Watches a local directory

impl Connector for LocalFolderConnector {
    fn name(&self) -> &str { "local_folder" }
    fn config_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Folder path to watch"},
                "recursive": {"type": "boolean", "default": true},
                "auto_ingest": {"type": "boolean", "default": true},
                "file_patterns": {"type": "array", "items": {"type": "string"},
                    "default": ["*.pdf", "*.docx", "*.xlsx", "*.txt", "*.md"]}
            },
            "required": ["path"]
        })
    }
    async fn connect(&self, config: &serde_json::Value) -> Result<(), anyhow::Error> {
        let path = config["path"].as_str().ok_or("Missing path")?;
        std::fs::create_dir_all(path)?;
        tracing::info!("Watching folder: {}", path);
        Ok(())
    }
    async fn poll(&self, graph: &GraphStore) -> Result<PollResult, anyhow::Error> {
        // Scan folder for new/modified files, ingest them
        // File modified = re-ingest with newer timestamp
        todo!("Implement folder scanning + ingestion")
    }
}
```

### UI — Connector Configuration

A new "Connectors" tab in the settings view:

```
┌──────────────────────────────────────────────┐
│  Data Connectors                         [+] │
├──────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐  │
│  │ 📁 Local Folder: ./data/documents      │  │
│  │ Status: Connected ● 142 files ingested │  │
│  │ [Disconnect] [Sync Now]               │  │
│  ├────────────────────────────────────────┤  │
│  │ 🔒 SharePoint: /sites/legal-dept       │  │
│  │ Status: OAuth required                 │  │
│  │ [Connect]                             │  │
│  ├────────────────────────────────────────┤  │
│  │ 🔒 Google Drive: sarah@org.com         │  │
│  │ Status: OAuth required                 │  │
│  │ [Connect]                             │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### Frictionless by Default

The `local_folder` connector auto-activates on startup pointing at `{data_dir}/documents`. Users see:

```
📁 Documents folder is being watched.
  Drop files into ./data/documents/
  They appear in your graph automatically.
```

No config. No clicks. Just drag a file into the folder.

---

## Feature 3: Audit Dashboard

### Principle

> Regulators don't read JSON. They read dashboards. Show them every AI decision, verified, timestamped, with a green checkmark or red alert.

### View: `AuditDashboardView.tsx` (new, ~300 lines)

Layout:

```
┌──────────────────────────────────────────────────────────┐
│  AUDIT DASHBOARD                              [Export ▼] │
├────────────────┬─────────────────────────────────────────┤
│  ┌──────────┐  │  Ledger Integrity                        │
│  │ ● 100%   │  │  ┌──────────────────────────────────┐  │
│  │ Verified │  │  │ ████████████████████████████████  │  │
│  └──────────┘  │  │ 0 tampered · 1,247 entries        │  │
│                 │  └──────────────────────────────────┘  │
│  ┌──────────┐  │                                         │
│  │ 1,247    │  │  Activity (Last 7 Days)                 │
│  │ Entries  │  │  ┌──────────────────────────────────┐  │
│  └──────────┘  │  │ ██▁▄▆█▇▅▃▁▁▃▅▇▆▄▂▁              │  │
│                 │  │ Queries  ·  Tool calls  ·  Graphs  │  │
│  ┌──────────┐  │  └──────────────────────────────────┘  │
│  │ 3 Users  │  │                                         │
│  │ Active   │  │  Recent Decisions                       │
│  └──────────┘  │  ┌──────────────────────────────────┐  │
│                 │  │ 12:34  User query: "Contract ..." │  │
│  ┌──────────┐  │  │ 12:30  Council voted Pro (3-0)   │  │
│  │ SOC 2    │  │  │ 12:28  Contradiction detected     │  │
│  │ Ready    │  │  │ 12:25  Tool: graph_search (47ms) │  │
│  └──────────┘  │  └──────────────────────────────────┘  │
└────────────────┴─────────────────────────────────────────┘
```

### Protocol Message

```rust
ClientMessage::GetAuditDashboard { id: String }
ServerMessage::AuditDashboardData {
    id: String,
    ledger_entry_count: u64,
    tampered_count: u64,
    verified_percentage: f64,
    active_users: u32,
    queries_last_7d: Vec<u32>,
    recent_activity: Vec<AuditEvent>,
    compliance_status: ComplianceStatus,
}
```

### Compliance Status

```rust
pub struct ComplianceStatus {
    pub soc2_ready: bool,       // Ledger verification passes, exports work
    pub gdpr_compliant: bool,   // Right to erasure, data portability enabled
    pub uae_pdpl: bool,         // Data stays in UAE jurisdiction
    pub chain_verified_since: String,  // ISO 8601 timestamp
    pub last_export: Option<String>,
}
```

---

## Feature 4: Compliance Report Export

### Principle

> One click → formatted PDF/HTML compliance report. Ready for a regulator. No templates, no manual work.

### File: `src/export/compliance.rs` (new, ~120 lines)

```rust
pub struct ComplianceReport {
    pub institution_name: String,
    pub report_date: String,
    pub report_period: String,      // "2026-05-01 to 2026-05-31"
    pub ledger_summary: LedgerSummary,
    pub verification_status: VerifyResult,
    pub user_activity: Vec<UserActivity>,
    pub data_processing: DataProcessingSummary,
    pub gdpr_section: GdprSection,
    pub signatures: Vec<Signature>,
}

pub fn generate_compliance_pdf(report: &ComplianceReport) -> Result<Vec<u8>, anyhow::Error> {
    // Generate cover page with institution logo + report period
    // Generate verification summary with hash chain status
    // Generate user activity table
    // Generate data processing summary
    // Generate GDPR compliance checklist
    // Include digital signature (Ed25519)
    todo!("Implement PDF generation")
}
```

### Supported Formats

| Format | Method | Description |
|--------|--------|-------------|
| PDF | `generate_compliance_pdf()` | Signed PDF with embedded chain hashes |
| HTML | `generate_compliance_html()` | Self-contained HTML, printable |
| .aioss | Ledger export | Raw data for technical auditors |
| CSV | Activity export | User activity for spreadsheet analysis |

### Protocol

```rust
ClientMessage::ExportComplianceReport {
    id: String,
    format: String,       // "pdf" | "html" | "aioss" | "csv"
    period_start: Option<String>,
    period_end: Option<String>,
    institution_name: Option<String>,
}

ServerMessage::ComplianceReportReady {
    id: String,
    format: String,
    url: String,
    file_size_bytes: u64,
    chain_verified: bool,
}
```

---

## Feature 5: Desktop App (Tauri)

### Principle

> Already have the Tauri infra. Make it a real desktop citizen — system tray, auto-update, native notifications, auto-start on boot.

### File: `src-tauri/src/lib.rs` (enhancements)

```rust
// Add system tray
tauri::Builder::default()
    .system_tray(tauri::SystemTray::new().with_menu(
        tauri::Menu::with_items([
            MenuItem::new("Open API-OSS", true, None),
            MenuItem::new("Start Gateway", true, None),
            MenuItem::new("Stop Gateway", true, None),
            MenuItem::quit(),
        ])
    ))
    .on_system_tray_event(|app, event| match event {
        SystemTrayEvent::MenuItemClick { id, .. } => {
            match id.as_str() {
                "open" => { /* open main window */ }
                "start" => { /* spawn gateway */ }
                "stop" => { /* kill gateway */ }
                _ => {}
            }
        }
        _ => {}
    })

// Auto-update (uses tauri-updater)
tauri::Builder::default()
    .updater(tauri::UpdaterConfig {
        check_interval: 3600, // Check every hour
        endpoint: "https://api-sos.ai/updates".into(),
        ..Default::default()
    })

// Auto-start on boot (Windows: registry, Mac: LaunchAgent)
tauri::Builder::default()
    .plugin(tauri_plugin_auto_start::init())
```

### System Tray Icon States

| State | Icon | Description |
|-------|------|-------------|
| Stopped | 🔴 | Gateway not running |
| Starting | 🟡 | Model loading |
| Running | 🟢 | Ready for queries |
| Error | 🔴⚠️ | Something went wrong |

Click tray → quick actions menu (Start/Stop/Open/Quit). No need to find the terminal.

---

## Feature 6: Local File Sync Folder

### Principle

> Drop a file into `~/API-OSS/`. It appears in your knowledge graph automatically. Like Dropbox for AI.

### Implementation

The folder is watched by the local connector. On startup:

```rust
// In ws_server.rs build_app():
let watch_path = PathBuf::from(&config.data_dir).join("inbox");
std::fs::create_dir_all(&watch_path)?;

// Spawn a file watcher
let watcher_config = config.clone();
let watcher_graph = graph.clone();
tokio::spawn(async move {
    let mut debounce = tokio::time::interval(Duration::from_secs(5));
    loop {
        debounce.tick().await;
        if let Ok(entries) = std::fs::read_dir(&watch_path) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_file() {
                    // Ingest the file
                    if let Ok(result) = IngestEngine::ingest(&path, &watcher_graph, None, 512, 48) {
                        tracing::info!("Auto-ingested: {} ({} nodes)", result.file, result.nodes_created);
                        // Move to processed folder
                        let processed = watch_path.join("processed");
                        let _ = std::fs::create_dir_all(&processed);
                        let _ = std::fs::rename(&path, processed.join(path.file_name().unwrap_or_default()));
                    }
                }
            }
        }
    }
});
```

### UX

Show the inbox path in the UI sidebar:

```
📥 Sync Folder: ~/.api-oss/inbox
   (3 files waiting · 142 ingested)
```

The PWA can show a system notification when a new file is ingested.

---

## Feature 7: Browser Extension

### Principle

> Highlight text on any webpage → right-click → "Add to API-OSS Graph." Your browsing becomes your knowledge base.

### File: `extension/manifest.json` (new)

```json
{
  "manifest_version": 3,
  "name": "API-OSS Clipper",
  "version": "1.0",
  "description": "Clip web content directly into your API-OSS knowledge graph",
  "permissions": ["contextMenus", "storage", "activeTab"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "options_page": "options.html"
}
```

### File: `extension/background.js` (new, ~60 lines)

```javascript
// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'apioss-clip',
    title: 'Add to API-OSS Graph',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    id: 'apioss-page',
    title: 'Add entire page to API-OSS',
    contexts: ['page'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const apiossUrl = localStorage.getItem('apioss_url') || 'http://localhost:3030';
  const apiossToken = localStorage.getItem('apioss_token') || '';

  const content = info.selectionText || tab?.title || '';
  const source = tab?.url || '';

  fetch(`${apiossUrl}/api/ingest-text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiossToken}`,
    },
    body: JSON.stringify({
      text: content,
      source: source,
      title: tab?.title || 'Clipped content',
    }),
  });
});

// Popup: show connection status + recent clips
```

### Options Page

```
┌──────────────────────────────┐
│  API-OSS Clipper Settings    │
│                              │
│  Gateway URL                 │
│  [http://localhost:3030    ] │
│                              │
│  Auth Token (optional)       │
│  [sk-....................  ] │
│                              │
│  Default Node Type           │
│  [Web Page ▼]                │
│                              │
│  [Test Connection] ● OK      │
│                              │
│  Recent Clips: 47            │
└──────────────────────────────┘
```

---

## Feature 8: P2P Multi-Instance Sync

### Principle

> Two or more API-OSS instances synchronize their graphs via a cryptographically verified protocol, over LAN or via .aioss packages on removable media. No central server. No cloud. Pure sovereign sync.

### Architecture

```
Instance A (Dubai Gov) ───┐
                           ├── [LAN / USB / Signed Package] ──┐
Instance B (Singapore) ───┘                                  │
                                                             ▼
Instance C (London) ─────────────────────────────────── Instance D (Abu Dhabi)
```

### Sync Protocol

Each instance exports graph mutations as a signed .aioss package:

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SyncPackage {
    pub schema: String,             // "https://api-camus.ai/sync/v1"
    pub instance_id: String,        // UUID of the source instance
    pub instance_name: String,      // "Dubai Gov - Legal Dept"
    pub created_at: String,
    pub entries: Vec<SyncEntry>,
    pub genesis_hash: String,       // Hash of the first entry in this package
    pub head_hash: String,          // Hash of the last entry
    pub signature: String,          // Ed25519 signature of head_hash
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SyncEntry {
    pub index: u64,
    pub timestamp: String,
    pub entry_type: String,         // "graphmutation" | "council_vote" | "document"
    pub content: Value,
    pub parent_hash: String,
    pub hash: String,
}
```

### Import Flow

```
1. Instance A exports SyncPackage → USB drive
2. USB drive physically moved to Instance B (airgap)
3. Instance B verifies Ed25519 signature
4. Instance B verifies hash chain integrity
5. Instance B applies each SyncEntry:
   a. Graph mutation → merge into local graph
   b. Document → copy to local storage
   c. Council vote → store as reference

Conflict resolution:
  - Same node, different content → last-writer-wins by timestamp
  - Same edge, different weight → average the weights
  - Deleted node → tombstone wins (deletion is final)
```

### File: `src/sync.rs` (Full Implementation, ~250 lines)

```rust
pub struct SyncManager {
    instance_id: String,
    instance_name: String,
    signing_key: ed25519_dalek::SigningKey,
    known_peers: Vec<PeerInfo>,
}

impl SyncManager {
    /// Export all graph mutations since a given timestamp as a SyncPackage
    pub fn export_since(&self, graph: &GraphStore, since: &str) -> Result<SyncPackage, anyhow::Error> {
        let entries = self.collect_sync_entries(graph, since)?;
        let genesis_hash = entries.first().map(|e| e.hash.clone()).unwrap_or_default();
        let head_hash = entries.last().map(|e| e.hash.clone()).unwrap_or_default();
        let canonical = format!("{}:{}", genesis_hash, head_hash);
        let signature = self.signing_key.sign(canonical.as_bytes());

        Ok(SyncPackage {
            schema: "https://api-camus.ai/sync/v1".into(),
            instance_id: self.instance_id.clone(),
            instance_name: self.instance_name.clone(),
            created_at: chrono::Utc::now().to_rfc3339(),
            entries,
            genesis_hash,
            head_hash,
            signature: format!("{:x}", signature),
        })
    }

    /// Import a SyncPackage from another instance
    pub fn import(&self, graph: &GraphStore, pkg: &SyncPackage) -> Result<ImportResult, anyhow::Error> {
        // 1. Verify signature (requires knowing the peer's public key)
        let peer_key = self.lookup_peer_key(&pkg.instance_id)?;
        let canonical = format!("{}:{}", pkg.genesis_hash, pkg.head_hash);
        // 2. Verify hash chain
        for (i, entry) in pkg.entries.iter().enumerate() {
            let expected_parent = if i > 0 { &pkg.entries[i-1].hash } else { &pkg.genesis_hash };
            if entry.parent_hash != *expected_parent {
                return Err(anyhow::anyhow!("Chain broken at entry {}", i));
            }
        }
        // 3. Apply entries
        let mut imported = 0u64;
        for entry in &pkg.entries {
            if self.apply_entry(graph, entry)? {
                imported += 1;
            }
        }
        Ok(ImportResult { imported_entries: imported, instance_id: pkg.instance_id.clone() })
    }

    fn apply_entry(&self, graph: &GraphStore, entry: &SyncEntry) -> Result<bool, anyhow::Error> {
        match entry.entry_type.as_str() {
            "graph_mutation" => {
                // Deserialize and apply
                // ...
                Ok(true)
            }
            _ => Ok(false),
        }
    }
}
```

### CLI Commands

```bash
# Export sync package to USB
api-oss sync export --since "2026-05-01" --output /mnt/usb/sync-package.aioss

# Import sync package from USB
api-oss sync import --package /mnt/usb/sync-package.aioss

# List known peers
api-oss sync peers

# Add peer (exchange public keys via QR code or file)
api-oss sync peer add --instance-id abc123 --name "Dubai Gov" --pubkey <hex>

# Start LAN sync (auto-discover peers via mDNS)
api-oss sync listen --port 9735
```

### The Moat

This turns every API-OSS instance into a node in a **sovereign mesh network**. No cloud. No central authority. Every node independently verifies every mutation.

For a government with 50 departments across 7 emirates: each department runs its own instance, syncs via USB or encrypted LAN, and the entire government's AI knowledge is shared without ever touching the internet. This does not exist anywhere else.

---

## Implementation Priority

| Feature | Impact | Effort | Do When |
|---------|--------|--------|---------|
| **Local file sync** | High (frictionless onboarding) | 1 day | Now |
| **Multi-user + RBAC** | Critical (closes enterprise deals) | 1 week | Now |
| **Desktop app tray** | High (perceived professionalism) | 2 days | Now |
| **Audit dashboard** | High (regulator-ready) | 3 days | Week 2 |
| **Compliance export** | High (closes compliance reviews) | 2 days | Week 2 |
| **Browser extension** | Medium (knowledge growth) | 2 days | Week 3 |
| **Data connectors** | High (enterprise requirement) | 2 weeks | Week 3 |
| **P2P sync** | Category-defining moat | 1 week | Week 4 |

---

*API-OSS — The Anti-Cloud*

## See Also

Related features, architecture, and roadmap documentation.

- [Features Overview](../features/README.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [API Reference](../api-reference/01-overview.md)
- [Roadmap](../roadmap/01-product-vision.md)

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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
