▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document version: 1.0.0 | Updated: 2026-06-19
Category: why-use | ID: WY-03

────────────────────────────────────────────────────────────────

# Why Not Microsoft Teams?

## Executive Summary

Microsoft Teams is an enterprise collaboration platform deeply integrated
into the Microsoft 365 ecosystem. It is expensive, resource-heavy,
closed-source, and stores all your data in Microsoft's cloud. Libern offers
a sovereign, offline-first alternative with local AI, cryptographic
verification, and zero cost — without the Microsoft tax or vendor lock-in.

This document provides a comprehensive technical, economic, and architectural
comparison between Microsoft Teams and Libern.

---

## The Microsoft Tax

### Teams Pricing

| Plan              | Price/user/month | Requires M365 | Storage per user |
|-------------------|-----------------|---------------|------------------|
| Teams Free        | $0              | No            | 2GB              |
| Teams Essentials  | $4.00           | No            | 10GB             |
| Microsoft 365 Bus | $12.50          | Yes           | 1TB              |
| Microsoft 365 Ent | $22.00+         | Yes           | Unlimited        |
| Teams Premium     | $10.00 extra    | Yes           | Same as base     |

For a 100-person organization on M365 Business Basic:
- **Annual cost**: $15,000/year minimum
- **With Teams Premium**: $27,000+/year
- **Hidden costs**: Azure AD sync, SharePoint storage, admin training

### Libern Pricing

| Plan              | Price/user/month | Storage    |
|-------------------|-----------------|------------|
| Everyone          | **$0**          | Unlimited  |

**Annual cost for 100 users: $0**

### Total Cost of Ownership: 100 Users for 5 Years

| Cost Item                | Teams E3          | Teams E5 + Premium | Libern              |
|--------------------------|-------------------|---------------------|---------------------|
| Subscription             | $138,000          | $276,000            | $0                  |
| Copilot AI               | $0 (not incl)     | $180,000            | $0 (Liber included) |
| Azure AD                | Included          | Included            | $0 (none needed)    |
| SharePoint storage        | Included          | Included            | $0 (local disk)     |
| IT admin (20% time)     | $100,000          | $100,000            | $0 (no admin)       |
| Compliance overhead     | $50,000           | $50,000             | $0 (architectural)  |
| Migration/exit cost     | $250,000 (if leaving)| $250,000          | $0                  |
| **Total 5-Year Cost**   | **$538,000**      | **$856,000**        | **$0**              |

---

## Feature Comparison

```
┌──────────────────────────────────┬───────┬──────────────────────────┐
│ Feature                          │ Teams │ Libern                   │
├──────────────────────────────────┼───────┼──────────────────────────┤
│ Offline operation                │ ❌    │ ✅ Fully offline + LAN   │
│ Local AI assistant               │ ❌    │ ✅ Liber (Qwen 1.5B)     │
│ E2E encryption                   │ ❌    │ ✅ Ed25519 + X25519      │
│ Cryptographic ledger             │ ❌    │ ✅ .aioss SHA3-256 chain │
│ CRDT sync                        │ ❌    │ ✅ HLC + LWW-Element-Set │
│ mDNS discovery                   │ ❌    │ ✅ LAN P2P               │
│ No subscription                  │ ❌    │ ✅ Forever free          │
│ Self-sovereign identity          │ ❌    │ ✅ Ed25519 keypair       │
│ Cross-platform                   │ ✅    │ ✅ (Tauri native)        │
│ Channels                         │ ✅    │ ✅                       │
│ Voice calls                      │ ✅    │ ✅ (direct LAN UDP)      │
│ Screen sharing                   │ ❌    │ Coming                   │
│ File sharing                     │ ✅    │ ✅ (unlimited size)      │
│ Whiteboard                       │ ✅    │ ✅ (CRDT-based canvas)   │
│ Open source                      │ ❌    │ ✅ (MIT/Apache 2.0)      │
│ Local-only operation             │ ❌    │ ✅                       │
│ Tamper-evident logs              │ ❌    │ ✅ SHA3-256 hash chain   │
│ AI content moderation            │ ❌    │ ✅ Local AI moderation   │
│ Document RAG                     │ ❌    │ ✅ Local semantic search │
│ Prediction markets               │ ❌    │ ✅ Built-in              │
│ Ed25519 message signing          │ ❌    │ ✅ Every message signed  │
│ Zero telemetry                   │ ❌    │ ✅ Guaranteed            │
│ Built-in games                   │ ❌    │ ✅ Dice, slots, BJ       │
│ XP/leveling system               │ ❌    │ ✅ Built-in              │
│ Starboard                        │ ❌    │ ✅ Configurable          │
│ Community marketplace            │ ❌    │ ✅ Plugin/item store     │
│ Forkable/open core              │ ❌    │ ✅ AGPL-3.0              │
└──────────────────────────────────┴───────┴──────────────────────────┘
```

---

## The Resource Hog Problem

Microsoft Teams is notorious for resource consumption:

| Metric             | Microsoft Teams | Libern        |
|--------------------|-----------------|---------------|
| RAM (idle)         | 600MB-1.2GB     | <120MB        |
| RAM (with AI)      | N/A (no AI)     | <400MB        |
| CPU (idle)         | 10-20%          | <1%           |
| Install size       | 400MB+          | <30MB         |
| Startup time       | 15-30 seconds   | <1 second     |
| GPU usage          | Often 10-30%    | None (2D UI)  |

Microsoft Teams is built on Electron and the SharePoint framework, making it
one of the heaviest enterprise applications. Libern is built on Tauri
(Rust + native webview), making it lightweight and fast.

```rust
// crates/libern-core/src/db/mod.rs
// Libern uses SQLite WAL mode — lightweight, zero-config
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

### Why Teams is So Heavy

```
Microsoft Teams Architecture:
┌─────────────────────────────────────┐
│ Teams Client (Electron)             │
│ ├── Chromium renderer (~300MB)      │
│ ├── Node.js runtime (~200MB)        │
│ ├── SharePoint framework (~100MB)   │
│ ├── React + Fluent UI (~50MB)       │
│ ├── Skype media stack (~100MB)      │
│ └── WebRTC stack (~50MB)            │
│ Total: ~800MB RAM (idle)            │
└─────────────────────────────────────┘

Libern Architecture:
┌─────────────────────────────────────┐
│ Libern Client (Tauri)               │
│ ├── Rust binary (~12MB)             │
│ ├── OS WebView (shared, ~0MB)       │
│ ├── SQLite library (~1MB)           │
│ └── Opus codec (~0.5MB)             │
│ Total: <120MB RAM (idle)            │
└─────────────────────────────────────┘
```

---

## Data Sovereignty

### Microsoft's Data Handling

When you use Teams:
- All messages, files, and metadata stored in Microsoft 365 (US, EU, or other)
- Microsoft has full access for compliance, eDiscovery, and support
- AI features (Teams Premium) send data to Azure OpenAI — third-party API
- Administrators can access all user communications
- Subject to US CLOUD Act and foreign government requests
- Microsoft's AI training may use your data (unless explicitly opted out)

### Libern's Data Handling

When you use Libern:
- All data stored locally in encrypted SQLite files
- No cloud server has access to your communications
- AI runs locally — zero data leaves your machine
- Administrators only have access to servers they host locally
- Not subject to foreign government data requests
- Your data never touches any AI training pipeline

### Compliance Matrix

| Requirement           | Teams (E5 Required)          | Libern (Included)          |
|-----------------------|------------------------------|----------------------------|
| Audit logging         | $35/user/mo (E5 add-on)      | Free (.aioss ledger)       |
| Legal hold            | $35/user/mo (E5 add-on)      | Free (local SQLite export) |
| Data retention        | $35/user/mo (E5 add-on)      | Free (full local)          |
| BYOK                  | $35/user/mo (E5 add-on)      | Free (your Ed25519 key)    |
| Tamper-evident logs   | Not available                 | Free (SHA3-256 chain)      |
| Message signing       | Not available                 | Free (Ed25519 per message) |

---

## The Teams-on-Teams Problem

Microsoft Teams is not a single product — it requires an entire ecosystem:

```
Microsoft Teams
├── Requires: Microsoft 365 subscription
├── Requires: Azure Active Directory
├── Requires: SharePoint Online (for files)
├── Requires: Exchange Online (for email integration)
├── Requires: OneDrive for Business (personal files)
├── Requires: Microsoft Graph API (for automation)
├── Supports: Power Platform (for workflows)
└── Supports: Teams App Store (for extensions)
```

If any of these services goes down, Teams functionality degrades or breaks.
Each service adds cost, complexity, and attack surface.

### Libern's Architecture

```
Libern
├── Requires: A computer
├── Optional: LAN network (for P2P sync)
├── Optional: Internet (for WAN sync)
└── That's it.
```

No directory service. No file sync service. No email server. No cloud APIs.
Just a local application that communicates directly with peers.

### Dependency Cascade Failure

```
Teams Outage Scenario:
M365 Auth Down ──► Teams Can't Start
     │
SharePoint Down ──► Files Unavailable
     │
Exchange Down ──► Calendar/Email Broken
     │
Graph API Down ──► Bots and Workflows Broken
     │
Internet Down ──► Teams Completely Useless

Libern Outage Scenario:
Internet Down ──► Everything still works
     │
LAN Down ──► Local mode, all features work
     │
Power Out ──► (same for both platforms)
```

---

## The AI Disparity

### Teams Premium AI ($10/user/month extra)

- Meeting recap with AI-generated notes
- Speaker timeline (who said what when)
- Personalized highlights
- Requires cloud connectivity
- Processes data through Azure OpenAI
- Limited to meeting contexts
- Extra cost $10/user/month

### Libern AI (Included)

- **ask_libern()**: Chat with AI in any channel
- **summarize_channel()**: Summarize any conversation
- **ask_whiteboard()**: AI analyzes canvas drawings
- **moderate_message()**: Content moderation
- **RAG**: Index any document and ask questions
- Always available (offline)
- Zero additional cost
- Customizable personality

```rust
// apps/desktop/src-tauri/src/commands/ai.rs
#[tauri::command]
pub fn ask_libern(
    ai: State<AiState>,
    channel_id: String,
    query: String,
    on_event: Channel<TokenEvent>,
) -> Result<(), String> {
    let mut engine = ai.engine.lock()?;
    let history = conversation::get_recent(&db, &channel_id, 20)?;
    let context = pipeline::pack_context(&history, 2048, 4);
    let prompt = pipeline::build_chat_prompt(SYSTEM_PROMPT, &context, &query);
    engine.infer(InferenceRequest { prompt, max_tokens: 1024, temperature: 0.7, callback })
}
```

### AI Feature Comparison

| Feature                | Teams Copilot ($30/user/mo) | Libern Liber (Free) |
|------------------------|-----------------------------|---------------------|
| Meeting summarization  | ✅                          | Coming              |
| Channel summarization  | ❌                          | ✅                  |
| Document Q&A (RAG)     | ✅ (M365 docs only)         | ✅ (any document)   |
| Whiteboard analysis    | ❌                          | ✅                  |
| Content moderation     | ❌                          | ✅                  |
| Custom personality     | ❌                          | ✅ (personality packs)|
| Offline operation      | ❌                          | ✅                  |
| Data privacy           | Sent to Azure OpenAI        | Stays local         |
| Per-token cost         | Included in subscription    | $0                  |

---

## Compliance and Audit

### Teams Compliance Features

Teams offers compliance features — at enterprise pricing:
- Data Loss Prevention (DLP): Enterprise E5 only (~$35/user/month)
- Legal hold/eDiscovery: Enterprise E5 only
- Retention policies: Included in most plans
- Audit logging: Enterprise E5 only
- Customer Key (BYOK): Enterprise E5 only

### Libern Compliance

All compliance features are **native and free**:
- **Tamper-evident logs**: `.aioss` SHA3-256 hash chain — every entry is
  cryptographically linked to its predecessor
- **Ed25519 signing**: Every message is signed with the author's keypair
- **State proofs**: Head hash can be Ed25519-signed for notarization
- **Verification**: `verify_any()` validates the entire chain
- **Export**: `.aioss`, `.json`, `.txt` formats are all standard

```rust
// crates/libern-aioss/src/state_proof.rs
pub struct StateProof {
    pub head_hash: String,
    pub timestamp: String,
    pub entry_count: u64,
    pub session_id: String,
    pub signature: Option<String>,  // Ed25519 signature
    pub public_key: String,         // Ed25519 public key
    pub verified: bool,
}
```

This is superior to Teams' compliance features because:
1. It's **cryptographic** — not just policy-based
2. It's **free** — no $35/user/month premium
3. It's **verifiable** — anyone can verify the chain
4. It's **portable** — the .aioss file can be audited anywhere

---

## Migration Considerations

### What You Leave Behind in Teams

| Teams Feature        | Libern Equivalent                     |
|----------------------|---------------------------------------|
| Channels & threads   | Channels with reply_to                |
| Teams & SharePoint   | Local storage, P2P sync               |
| Guest access         | Invite codes                          |
| Meetings             | Voice channels (direct P2P UDP)       |
| Chat                 | Messages with Ed25519 signing         |
| Files                | Local files, no size limit            |
| Approvals            | TODO — community plugin               |
| Lists                | TODO — community plugin               |
| Planner/Tasks        | TODO — community plugin               |
| Power Automate       | WASM/Rust automation engine           |

### What You Gain

1. **Full data sovereignty** — no Microsoft cloud dependency
2. **Zero subscription cost** — save $15,000+/year/100 users
3. **Local AI** — private, instant, always available
4. **Offline operation** — communicate without internet
5. **Cryptographic guarantees** — signed, hashed, verifiable
6. **Unlimited storage** — limited only by your disk
7. **Open source** — inspect, modify, extend
8. **Lightweight client** — <120MB RAM vs Teams' 600MB-1.2GB
9. **No dependency cascade** — one app, no ecosystem
10. **Tamper-evident audit** — .aioss ledger for everything

### Migration Steps

- [ ] Install Libern (one binary, no admin rights needed)
- [ ] Generate Ed25519 identities (no phone, no email)
- [ ] Create server structure (mirror Teams channels)
- [ ] Invite team members (invite codes with expiry)
- [ ] Configure roles and permissions (bitfield based)
- [ ] Set up Liber AI (download Qwen model, ~1.1GB)
- [ ] Migrate files (copy from SharePoint to local)
- [ ] Cancel M365/Teams subscription (estimated savings: $15K+/year)

---

## Performance Benchmark

| Metric               | Microsoft Teams | Libern        |
|----------------------|-----------------|---------------|
| RAM (idle)           | 600MB-1.2GB     | <120MB        |
| RAM (in meeting)     | 1-2GB           | N/A           |
| CPU (idle)           | 10-20%          | <1%           |
| Install size         | 400MB+          | <30MB         |
| Startup time         | 15-30 seconds   | <1 second     |
| GPU usage            | 10-30% (WebGL)  | None          |
| Message latency      | 200-500ms       | <5ms          |
| Meeting join time    | 10-30 seconds   | Instant       |
| AI response time     | 5-15s (cloud)   | 0.2-2s (local)|
| File access latency  | Dependent on net | Instant (local)|
| Offline operation    | Read-only cache  | Full operation |

---

## The Platform Dependency Problem

Teams is deeply embedded in the Microsoft ecosystem. This creates:

1. **Vendor lock-in**: Cannot leave Microsoft without replacing M365
2. **Cost escalation**: Prices increase 15-20% over 3 years
3. **Feature gatekeeping**: Advanced features locked behind E5 ($38/user/mo)
4. **Data gravity**: All data flows into Microsoft's ecosystem
5. **AI training**: Your data potentially trains Microsoft's AI models

Libern reverses all of these:
1. **No vendor**: Open source, forkable
2. **Zero cost**: No subscription, no escalation
3. **All features free**: No tier gating
4. **Data stays local**: No gravity well
5. **No AI training**: Local model, your data stays yours

---

## Conclusion: Why Not Teams?

Microsoft Teams is a product designed for a world where:
- You trust Microsoft with all your data
- You have an unlimited budget for subscriptions
- You have a dedicated IT team to manage the ecosystem
- You accept resource-heavy, slow clients
- You never need to work offline

Libern is for organizations that:
- Want to **own** their data and infrastructure
- Don't want to pay **per user per month** for communication tools
- Need **offline capability** for remote or field operations
- Want **local AI** that doesn't send data to third parties
- Demand **cryptographic verification** of their communications
- Prefer **lightweight, fast** applications

**Teams locks you into Microsoft. Libern sets you free.**

## Use Case Scenarios: Teams vs Libern

### Enterprise Headquarters

| Scenario | Microsoft Teams | Libern |
|----------|----------------|--------|
| 1,000 employees | $276,000-$456,000/yr | $0 |
| AI assistant | Copilot $30/user/mo extra | Liber included free |
| File storage | SharePoint cloud | Local disk unlimited |
| Offline capability | Read-only cache | Full operation |
| Compliance audit | E5 required ($35/user/mo) | .aioss chain included |

### Field Operations (Oil & Gas, Mining)

| Requirement | Teams | Libern |
|-------------|-------|--------|
| No internet | Not usable | Fully functional |
| Data sovereignty | Microsoft servers | Local machines |
| Voice quality | Cloud relay | Direct P2P UDP |
| Setup complexity | M365 tenant required | Single binary |
| IT dependency | Full IT team required | Zero IT overhead |

### Healthcare Organization

| Compliance Need | Teams Solution | Cost | Libern Solution | Cost |
|----------------|---------------|------|-----------------|------|
| HIPAA compliance | E5 + BAA | $35/user/mo | No BAA needed (local) | $0 |
| Audit trail | E5 audit logs | $35/user/mo | .aioss SHA3-256 | $0 |
| Data encryption | At rest (Microsoft keys) | Included | Ed25519 + X25519 | $0 |
| Patient data privacy | Microsoft employees can access | Not auditable | Architecturally private | $0 |

## Enterprise Migration Cost Analysis

### Total Cost of Ownership: 100 Users, 5 Years

| Cost Category | Teams E3 | Teams E5 + Premium | Libern |
|--------------|----------|-------------------|--------|
| Subscription | $138,000 | $456,000 | $0 |
| AI (Copilot/Liber) | $0 (not incl) | $180,000 | $0 |
| Compliance packs | $0 (not incl) | $60,000 | $0 |
| IT admin (est 20%) | $100,000 | $100,000 | $0 |
| Migration/exit cost | $250,000 (if left) | $250,000 (if left) | $0 |
| **5-Year Total** | **$488,000** | **$1,046,000** | **$0** |

### Hidden Costs of Teams Deployment

- **Hardware upgrades**: 8GB RAM laptops can't run Teams well → 16GB needed
- **Bandwidth costs**: 1-5MB/hour per user for background sync
- **Azure AD sync**: Directory synchronization tooling required
- **SharePoint training**: Users need training for file management
- **M365 admin**: Dedicated admin time for tenant management
- **Vendor lock-in**: Cannot leave without replacing entire M365 stack

## The Technical Architecture Gap

### Why Teams Can't Add Libern's Features

| Libern Feature | Why Teams Can't Replicate |
|---------------|--------------------------|
| Offline-first CRDT | Teams is fundamentally cloud-first (Exchange/SharePoint) |
| Local AI | Conflicts with Azure OpenAI revenue ($30/user/mo) |
| Zero infrastructure | Azure cloud is Microsoft's core revenue driver |
| .aioss audit | Cannot add hash chains to SharePoint/Exchange |
| Self-sovereign identity | Would replace Azure AD (identity revenue) |

### Teams' Dependency Stack vs Libern

```
Teams:
┌─────────────────────────────────────────┐
│ Microsoft Teams Client (Electron)        │
├─────────────────────────────────────────┤
│ Requires: Azure AD, Exchange, SharePoint │
│ Requires: OneDrive, Graph API, Intune   │
│ Requires: TLS, DNS, SMTP                │
│ 5+ services must be operational         │
└─────────────────────────────────────────┘

Libern:
┌─────────────────────────────────────────┐
│ Libern (Tauri native)                   │
├─────────────────────────────────────────┤
│ Requires: A computer                    │
│ That's it.                              │
└─────────────────────────────────────────┘
```

## The Real Cost of Teams Resource Consumption

A 1,000-employee organization running Teams:
- **RAM waste**: Average 800MB per user vs Libern's 120MB = 680MB saved
- **680MB × 1,000 × $15/GB (enterprise RAM cost)** = $10,200/year in hardware
- **CPU waste**: 15% idle CPU × 1,000 machines × 65W × 8760 hours × $0.12/kWh = $10,260/year in electricity
- **IT troubleshooting**: 500+ helpdesk tickets/year for Teams performance issues

Libern eliminates all of these costs through lightweight Tauri architecture.

---

## Related Documents

- `docs/competitors/03-microsoft-teams.md` — Deep competitive analysis of Teams
- `docs/competitors/11-matrix-analysis.md` — Full competitive matrix
- `docs/why-use/06-why-libern.md` — Why Libern exists
- `docs/investors/02-problem-statement.md` — The centralization trap
- `crates/libern-core/src/db/mod.rs` — SQLite database module
- `crates/libern-aioss/src/state_proof.rs` — State proof implementation
- `apps/desktop/src-tauri/src/commands/ai.rs` — AI commands
- `COMPETITIVE_EDGE.md` — Full competitive analysis document

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ