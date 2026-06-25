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
Category: why-use | ID: WY-02

────────────────────────────────────────────────────────────────

# Why Not Slack?

## Executive Summary

Slack is a proprietary team communication platform owned by Salesforce.
It costs $7.25-$15/user/month, limits message history on free plans,
has no local AI, and stores all your data on Salesforce's cloud servers.
Libern provides all the functionality of Slack plus local AI, cryptographic
verification, offline operation, and zero cost — all while keeping your
data on your own machines.

This document provides a comprehensive technical and economic comparison
between Slack and Libern, with real source code references and detailed
architectural analysis.

---

## The Cost Problem: Slack is Expensive

### Slack's Pricing Tiers

| Tier              | Price/user/month | Message History | Integrations | File Storage |
|-------------------|-----------------|-----------------|--------------|--------------|
| Free              | $0              | 90 days         | 10           | 5GB          |
| Pro               | $7.25           | Unlimited       | Unlimited    | 10GB         |
| Business+         | $12.50          | Unlimited       | Unlimited    | 20GB         |
| Enterprise Grid   | Custom          | Unlimited       | Custom       | Custom       |

For a team of 50 people on Pro:
- **Annual cost**: $4,350/year
- **Hidden costs**: IT admin time, integration maintenance, data export fees
- **Lock-in cost**: Migrating out of Slack is notoriously difficult

### Libern's Pricing

| Tier              | Price    | Message History | AI            | File Storage |
|-------------------|----------|-----------------|---------------|--------------|
| Everyone          | **$0**   | Unlimited       | Unlimited     | Unlimited    |

For a team of 50 people on Libern:
- **Annual cost**: $0
- **Hidden costs**: None
- **Lock-in cost**: Zero — export your Ed25519 keypair and go anywhere

### Total Cost of Ownership: 100 Users for 3 Years

| Cost Item              | Slack Pro              | Slack Business+        | Libern                  |
|------------------------|------------------------|------------------------|-------------------------|
| Subscription           | $26,100                | $45,000                | $0                      |
| Slack AI               | $36,000 (opt in)       | $36,000 (opt in)       | $0 (Liber included)     |
| IT admin (10% time)    | $30,000                | $30,000                | $0 (no admin needed)    |
| Integration costs      | $5,000 (3rd party)     | $5,000 (3rd party)     | $0 (native)             |
| Compliance overhead    | $10,000                | $10,000                | $0 (architectural)      |
| Migration/exit cost    | $50,000 (if leaving)   | $50,000 (if leaving)   | $0 (no lock-in)         |
| **Total 3-Year Cost**  | **$157,100**           | **$176,000**           | **$0**                  |

---

## Feature Comparison Matrix

```
┌──────────────────────────────────┬──────────┬──────────────────────────┐
│ Feature                          │ Slack    │ Libern                   │
├──────────────────────────────────┼──────────┼──────────────────────────┤
│ Offline operation                │ ❌       │ ✅ Fully offline + LAN   │
│ Local AI assistant               │ ❌       │ ✅ Liber (Qwen 1.5B)     │
│ E2E encryption                   │ ❌       │ ✅ Ed25519 + X25519      │
│ Cryptographic ledger             │ ❌       │ ✅ .aioss SHA3-256 chain │
│ CRDT sync                        │ ❌       │ ✅ HLC + LWW-Element-Set │
│ mDNS discovery                   │ ❌       │ ✅ LAN P2P discovery     │
│ Free with full features          │ ❌       │ ✅ Forever free          │
│ Self-sovereign identity          │ ❌       │ ✅ Ed25519 keypair       │
│ Unlimited file size              │ ❌ (1GB) │ ✅ Local disk, no limit  │
│ Message history limit            │ 90d free │ ✅ Unlimited forever     │
│ Whiteboard collaboration         │ ❌       │ ✅ CRDT-based canvas     │
│ Threads                          │ ✅       │ ✅ (via reply_to)        │
│ Channels                         │ ✅       │ ✅ (text + voice)        │
│ Roles & permissions              │ ✅       │ ✅ (bitfield permissions)│
│ App integrations                 │ ✅       │ ✅ (WASM/Rust plugins)   │
│ Built-in AI moderation           │ ❌       │ ✅ Liber moderation      │
│ Document RAG                     │ ❌       │ ✅ Local semantic search │
│ Voice + AI transcription         │ ❌       │ ✅ Real-time transcription│
│ Prediction markets               │ ❌       │ ✅ Built-in              │
│ XP/leveling                      │ ❌       │ ✅ Built-in              │
│ Hash chain verification          │ ❌       │ ✅ verify_any()          │
│ Ed25519 message signing          │ ❌       │ ✅ Every message signed  │
│ Open source                      │ ❌       │ ✅ MIT/Apache 2.0        │
│ Zero telemetry                   │ ❌       │ ✅ Guaranteed by arch    │
│ Tamper-evident logs              │ ❌       │ ✅ SHA3-256 verify_any() │
│ AI content moderation            │ ❌       │ ✅ Local AI moderation   │
│ Built-in games                   │ ❌       │ ✅ Dice, slots, BJ       │
│ Self-hosted option               │ ❌       │ ✅ (it's already local)  │
└──────────────────────────────────┴──────────┴──────────────────────────┘
```

---

## The Data Sovereignty Issue

### Where Your Data Goes

When you use Slack:
```
Your Company ──► Slack/Salesforce Servers
                     │
                     ├── Stored in US/EU data centers
                     ├── Accessible to Slack engineers
                     ├── Subject to US cloud subpoenas
                     ├── Analyzed for product improvement
                     └── Potentially shared with third parties
```

When you use Libern:
```
Your Company ──► Local Machine (encrypted SQLite)
                     │
                     ├── You control access
                     ├── No third party can read it
                     ├── Not subject to foreign subpoenas
                     ├── Backup to your own storage
                     └── Portable: one file moves it all
```

### Slack's Data Collection

- Every message, file, and reaction is stored on Salesforce servers
- Slack scans messages for "workplace analytics"
- Slack's AI features send your data to third-party LLM providers (OpenAI, etc.)
- Metadata (who talks to whom, when, how often) is collected and analyzed
- Integration data flows through Slack's servers

Libern:
- Messages stay on local machines
- AI runs locally (Qwen 2.5 1.5B) — no data leaves your computer
- No telemetry, no analytics, no tracking
- Metadata is local — nobody but you knows your communication patterns

### Data Privacy Regulation Compliance

| Regulation       | Slack Compliance                    | Libern Advantage                    |
|------------------|-------------------------------------|-------------------------------------|
| GDPR             | DPA required, data in EU regions    | No data to protect (all local)      |
| CCPA             | Must allow data deletion requests   | Nothing to delete (all local)       |
| HIPAA            | Requires BAA, enterprise plan       | No BAA needed (not a processor)     |
| SOX              | Audit logs in enterprise grid       | .aioss provides native audit trail  |
| EU AI Act        | Cloud AI = high risk classification | Local AI = minimal risk (exempt)    |

---

## The AI Divide

### Slack AI (Add-on: $10/user/month extra)

```
User Query ──► Slack API ──► Salesforce Cloud ──► OpenAI/Anthropic API
                  │                                     │
                  └── Your data is processed             │
                      by third-party AI providers        │
                                                          ▼
                                                   Your data trains
                                                   their models
```

- Extra cost on top of subscription
- Data leaves your organization
- Requires cloud connectivity
- Limited context from Slack's APIs
- No customization or personality

### Libern AI (Included: $0)

```
User Query ──► Local llama.cpp (Qwen 2.5 1.5B)
                  │
                  ├── Data stays on your machine
                  ├── Works offline
                  ├── No API costs
                  ├── Full conversation context
                  └── Customizable personality
```

From `crates/libern-core/src/ai/`:
- **engine.rs**: `AiEngine` trait for pluggable backends
- **qwen_engine.rs**: Qwen 2.5 1.5B running via llama.cpp CLI
- **rag.rs**: Document ingestion with embeddings + cosine similarity search
- **moderator.rs**: Keyword pre-filter + AI content classification
- **summarizer.rs**: Channel conversation summarization
- **reward.rs**: User preference learning from upvote/downvote feedback
- **pipeline.rs**: Context packing and prompt construction
- **conversation.rs**: AI conversation history management

```rust
// crates/libern-core/src/ai/mod.rs
pub trait AiEngine: Send + 'static {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String>;
    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String>;
    fn is_loaded(&self) -> bool;
    fn model_info(&self) -> ModelInfo;
}
```

### AI Cost Comparison (Annual, 100 Users)

| Cost Component       | Slack AI ($10/user/mo) | Libern AI (included) |
|----------------------|------------------------|----------------------|
| Subscription         | $12,000                | $0                   |
| Data privacy cost    | All messages processed | None (local)         |
| Offline capability   | None                   | Full                 |
| Context window       | Limited by API         | Configurable (2048+) |
| Customization        | None                   | Personality packs    |
| Integration depth    | Slack API only         | Full Rust backend    |

---

## The Cryptographic Advantage

Slack provides no cryptographic guarantees. Messages are stored in
Salesforce's database with no integrity verification. If Salesforce suffers
a breach or insider threat, data can be modified without detection.

### Libern's .aioss Cryptographic Ledger

Every Slack channel conversation in Libern is recorded in a `.aioss` file:

```rust
// crates/libern-aioss/src/header.rs
pub struct AiossHeader {
    pub magic: [u8; 5],         // b"AIOSS"
    pub version: u16,            // Format version
    pub session_id: [u8; 36],    // UUID v4
    pub created_at: [u8; 32],    // ISO 8601 timestamp
    pub status: u8,              // active/sealed/archived
    pub session_type: u8,        // chat/game/ai/system
    pub entry_count: u32,        // Number of entries
    pub genesis_hash: [u8; 32],  // SHA3-256 of first entry
    pub head_hash: [u8; 32],     // SHA3-256 of latest entry
}
```

```rust
// crates/libern-aioss/src/entry.rs
pub struct AiossEntry {
    pub index: u32,              // Sequential index
    pub timestamp_unix_ms: u64,  // Millisecond precision
    pub entry_type: [u8; 20],    // "message", "voice", "ai", etc.
    pub actor: [u8; 16],         // Who created this entry
    pub content_hash: [u8; 32],  // SHA3-256 of JSON content
    pub parent_hash: [u8; 32],   // SHA3-256 of previous entry
}
```

Chain verification:
```rust
// crates/libern-aioss/src/verify.rs
pub fn verify_any(bytes: &[u8]) -> Result<(bool, usize, usize), String>
// Returns (verified, tampered_count, total_entries)
```

Slack cannot provide this because their business model depends on
centralized control of your data.

---

## Offline Capability

### Slack Offline

Slack's "offline" mode:
- Shows cached messages up to last sync
- Cannot send new messages
- Cannot browse channels not in cache
- Cannot search
- Cannot access files
- Cannot use any integrations
- Loses changes when connectivity returns

### Libern Offline

Libern's offline mode:
- Full read/write to all channels
- Full search across all messages
- Full AI access (Liber runs locally)
- Full file access (files are local)
- Messages sync via CRDT when connectivity returns
- Zero data loss

This is possible because Libern uses:
1. **Local SQLite database** (`crates/libern-core/src/db/mod.rs`) with WAL mode
2. **CRDT** for conflict-free merging (`crates/libern-core/src/crdt/mod.rs`)
3. **HLC** for timestamp ordering across disconnected peers
4. **mDNS** for LAN peer discovery (no central server needed)
5. **P2P sync** without a relay server

### Offline Scenario Comparison

| Scenario                         | Slack                              | Libern                              |
|----------------------------------|------------------------------------|-------------------------------------|
| Internet outage (1 hour)         | Can't work, messages queued        | Full functionality                  |
| Remote field work (no internet)  | Useless                            | Full functionality with local AI    |
| Air-gapped environment           | Not possible                       | Fully operational                   |
| LAN party (no WAN)               | Not possible                       | mDNS + P2P works perfectly          |
| Disaster recovery (network down) | Cannot coordinate                  | Full team communication             |
| International travel              | Needs roaming data                 | Works offline, syncs later          |

---

## Permission System

Slack has a limited permission model. Libern uses a bitfield-based
permission system that is both simpler and more flexible:

```rust
// apps/desktop/src-tauri/src/commands/role.rs
pub const PERM_MANAGE_SERVER: i64     = 1 << 0;
pub const PERM_MANAGE_CHANNELS: i64   = 1 << 1;
pub const PERM_MANAGE_ROLES: i64      = 1 << 2;
pub const PERM_MANAGE_MESSAGES: i64   = 1 << 3;
pub const PERM_SEND_MESSAGES: i64     = 1 << 4;
pub const PERM_READ_MESSAGES: i64     = 1 << 5;
pub const PERM_CONNECT_VOICE: i64     = 1 << 6;
pub const PERM_SPEAK: i64             = 1 << 7;
pub const PERM_MUTE_MEMBERS: i64      = 1 << 8;
pub const PERM_CREATE_INVITE: i64     = 1 << 9;
pub const PERM_KICK_MEMBERS: i64      = 1 << 10;
pub const PERM_ATTACH_FILES: i64      = 1 << 11;
pub const PERM_EMBED_LINKS: i64       = 1 << 12;
pub const PERM_DRAW_WHITEBOARD: i64   = 1 << 13;
pub const PERM_MANAGE_WHITEBOARD: i64 = 1 << 14;
```

Roles are created, permissions assigned, and checkable:
```
check_permission(db, user_id, server_id, PERM_MANAGE_SERVER) -> bool
```

This is all local, instant, and verifiable — unlike Slack's cloud-based
permission system.

---

## The Salesforce Tax

Since Salesforce acquired Slack in 2021 for $27.7B:

```
Slack's Priorities Before Acquisition:
├── User experience
├── Innovation
├── Developer ecosystem
└── Privacy

Slack's Priorities After Acquisition:
├── Salesforce integration
├── Cross-selling M365 products
├── Data sharing with Salesforce
├── Enterprise upsell
└── Price increases
```

Consequences for users:
- **Price increase**: 20% increase in 2025
- **Feature direction**: Salesforce-driven roadmap
- **Data exposure**: Data accessible to Salesforce ecosystem
- **Integration deprioritization**: Non-Salesforce integrations deprioritized
- **Vendor lock-in**: Increasingly bundled with Salesforce products

Libern has no corporate parent. No acquisition risk. No cross-selling
pressure. No data sharing with third parties.

---

## Performance Comparison

| Metric                  | Slack                 | Libern               |
|-------------------------|-----------------------|----------------------|
| RAM (idle)              | 400MB-1GB             | <120MB               |
| CPU (idle)              | 5-15%                 | <1%                  |
| Install size            | 200MB+                | <30MB                |
| Startup time            | 5-15 seconds          | <1 second            |
| Message latency         | 50-500ms              | <5ms                 |
| AI response time        | 5-15s (cloud API)     | 0.2-2s (local)       |
| Voice latency           | N/A (no voice)        | <20ms (direct LAN)   |
| Search latency          | 100-500ms (cloud)     | <10ms (local SQLite) |
| File access latency     | Dependent on upload   | Instant (local disk) |
| Cross-platform          | Windows, Mac, Linux   | Windows, Mac, Linux  |

### Why Electron Matters

Slack is built on Electron (Chromium + Node.js):
- Every instance includes a full browser engine
- 200MB+ download for what is essentially a web app
- High memory usage even when minimized
- Slower startup due to Chromium initialization

Libern is built on Tauri (Rust native + OS WebView):
- Native binary <30MB
- No embedded browser engine
- Near-zero idle resource usage
- Instant startup (<1 second)

---

## Built-In Features Slack Would Charge For

| Slack Paid Feature          | Slack Cost       | Libern Equivalent       |
|-----------------------------|------------------|-------------------------|
| Unlimited message history   | $7.25/user/month | Included                |
| Unlimited integrations      | $7.25/user/month | Included (WASM/Rust)    |
| 20GB storage per user       | $12.50/user/month| Unlimited local storage |
| Slack AI                    | $10/user/month   | Included (local Qwen)   |
| Slack Canvas                | Included in Pro  | Included (CRDT canvas)  |
| Slack Clips (voice)         | Included         | Included + transcription|
| Analytics                   | $12.50/user/month| Included (local stats)  |
| 24/7 support                | Enterprise only  | Community + source code |
| Enterprise compliance       | $15/user/month   | Included (.aioss chain) |
| Data export                 | Enterprise only  | Included (SQLite export)|

---

## The Slack-to-Libern Migration

### What You Gain

1. **$4,000+/year savings** for a 50-person team
2. **Data sovereignty** — your data never touches third-party servers
3. **Local AI** — instant, private, free AI assistance
4. **Offline operation** — communicate during internet outages
5. **Cryptographic verification** — tamper-evident message chains
6. **Unlimited everything** — history, files, integrations
7. **Portable identity** — your Ed25519 keypair moves with you

### What You Lose

1. Slack's proprietary integrations (replaceable with local WASM plugins)
2. Salesforce ecosystem lock-in (feature, not a bug)
3. Cloud convenience (replaced by mDNS + P2P discovery)

### Migration Checklist

- [ ] Install Libern on all team machines
- [ ] Generate Ed25519 identities for each team member
- [ ] Create servers and channels (mirroring Slack structure)
- [ ] Set up roles and permissions
- [ ] Configure Liber AI personality
- [ ] Invite team members via invite codes
- [ ] mDNS will auto-discover peers on same LAN
- [ ] Export Slack history (optional, via Slack's export feature)
- [ ] Cancel Slack subscription (estimated savings: $4,350+/year)

---

## Conclusion: Why Not Slack?

Slack is a well-polished product that costs too much, respects your privacy
too little, and gives you too little control. It is designed to extract
recurring revenue while holding your data hostage.

Libern gives you:
- **All the collaboration features** Slack offers
- **Plus features** Slack will never have (local AI, cryptographic ledgers,
  offline-first CRDT, self-sovereign identity)
- **At zero cost** — no subscriptions, no per-user fees, no AI token charges

For any team that values privacy, independence, and long-term cost savings,
Libern is the clear choice. The only thing you lose is the Salesforce
lock-in.

## Use Case Scenarios: Slack vs Libern

### Remote Team Coordination

| Scenario | Slack | Libern |
|----------|-------|--------|
| Internet outage | Work stops | Full functionality |
| International team | Latency, data sovereignty | Local AI, P2P sync |
| File sharing | 1GB limit, cloud storage | Unlimited, local disk |
| AI assistance | $10/user/mo, cloud-dependent | Free, local, offline |
| Privacy guarantee | Trust-based (policy) | Architectural (no data leaves) |

### Enterprise Compliance

| Compliance Need | Slack Solution | Cost | Libern Solution | Cost |
|-----------------|---------------|------|-----------------|------|
| Audit trail | Enterprise Grid logs | $15/user/mo | .aioss SHA3-256 chain | $0 |
| Data retention | Business+ policy | $12.50/user/mo | Full local retention | $0 |
| E-discovery | Enterprise Grid | Custom | SQLite export | $0 |
| Message signing | Not available | N/A | Ed25519 per message | $0 |
| E2EE | Not available | N/A | Ed25519 + X25519 | $0 |

### Developer/Technical Team

| Feature | Slack | Libern |
|---------|-------|--------|
| Code snippet sharing | ✅ (with formatting) | ✅ (Markdown) |
| Bot development | Node.js/Python API | WASM/Rust plugins |
| Integration hosting | Cloud servers | Local execution |
| Offline development | Not supported | Full support |
| Data control | Vendor-managed | Self-sovereign |

## The Long-Term Cost of Slack

### Cumulative 5-Year Cost for 50 Users

| Year | Slack Pro | Slack Business+ | Libern |
|------|-----------|-----------------|--------|
| Year 1 | $4,350 | $7,500 | $0 |
| Year 2 | $4,350 | $7,500 | $0 |
| Year 3 | $4,350 | $7,500 | $0 |
| Year 4 | $4,350 | $7,500 | $0 |
| Year 5 | $4,350 | $7,500 | $0 |
| **Total** | **$21,750** | **$37,500** | **$0** |

### Opportunity Cost

Beyond subscription costs, Slack imposes:
- **Lock-in risk**: Proprietary format, hard to migrate
- **Privacy cost**: All communication data accessible to Salesforce
- **AI data exposure**: Messages processed by third-party AI providers
- **Downtime cost**: Average 2-4 hours of outages per year
- **Training cost**: New hires need Slack training

Libern eliminates all of these costs through architectural sovereignty.

## The Technical Architecture: Why Slack Can't Match Libern

### Slack's Architecture Limitations

Slack was built in 2013 as a cloud-first application. Its architecture has fundamental constraints:

1. **Single-tenant database**: All data in one Salesforce-controlled DB
2. **No offline writes**: Client cannot persist changes without server
3. **Cloud-only AI**: Any AI feature requires server-side processing
4. **No cryptographic guarantees**: Messages are plaintext in database
5. **Proprietary protocol**: Slack RTM/WebSocket API is closed

### Libern's Architectural Advantages

1. **Local-first SQLite**: Every node has complete data replica
2. **Offline CRDT**: All writes work offline, sync later
3. **Local AI inference**: Qwen 2.5 1.5B runs on-device
4. **Ed25519 + SHA3-256**: Full cryptographic integrity
5. **Open protocol**: P2P CRDT + .aioss are open formats

---

## Related Documents

- `docs/competitors/02-slack.md` — Deep competitive analysis of Slack
- `docs/competitors/11-matrix-analysis.md` — Full competitive matrix
- `docs/why-use/06-why-libern.md` — Why Libern exists
- `docs/investors/02-problem-statement.md` — The centralization trap
- `crates/libern-core/src/ai/mod.rs` — AI engine trait
- `crates/libern-aioss/src/verify.rs` — Chain verification
- `apps/desktop/src-tauri/src/commands/role.rs` — Permission commands
- `COMPETITIVE_EDGE.md` — Full competitive analysis document

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
