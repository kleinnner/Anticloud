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
Category: why-use | ID: WY-05

────────────────────────────────────────────────────────────────

# Why Not Signal?

## Executive Summary

Signal is the gold standard for private one-to-one messaging. It provides
strong E2EE, is open source, and is run by a nonprofit foundation. However,
Signal is **only a messaging app** — it has no collaboration features,
no channels/teams, no AI, no file management, no offline operation beyond
cached messages, and requires a phone number to register. Libern provides
Signal-grade E2EE plus a full collaboration platform with local AI, all
without requiring any third-party infrastructure.

This document provides a detailed comparison between Signal and Libern across
privacy, collaboration, AI, identity, and offline capabilities.

---

## Feature Comparison

```
┌──────────────────────────────────┬───────────┬────────────────────────┐
│ Feature                          │ Signal    │ Libern                 │
├──────────────────────────────────┼───────────┼────────────────────────┤
│ End-to-end encryption            │ ✅ (x3DH) │ ✅ (Ed25519 + X25519)  │
│ Open source                      │ ✅        │ ✅                     │
│ Phone number required            │ ✅        │ ❌ (Ed25519 keypair)   │
│ Offline operation                │ Partial   │ ✅ Full offline + LAN  │
│ Local AI assistant               │ ❌        │ ✅ Liber (Qwen 1.5B)   │
│ Cryptographic ledger             │ ❌        │ ✅ .aioss SHA3-256     │
│ CRDT sync                        │ ❌        │ ✅ HLC + LWW-Element-Set│
│ mDNS discovery                   │ ❌        │ ✅ LAN P2P             │
│ Self-sovereign identity          │ ❌        │ ✅ Ed25519 keypair     │
│ Team/channel support             │ ❌        │ ✅ Servers + channels   │
│ Voice/video calls                │ ✅        │ ✅ (direct P2P UDP)    │
│ File sharing                     │ ✅ (100MB)│ ✅ (unlimited local)    │
│ Whiteboard                       │ ❌        │ ✅ CRDT-based canvas    │
│ Built-in games                   │ ❌        │ ✅ Dice, slots, BJ      │
│ Prediction markets               │ ❌        │ ✅ On-chain bets       │
│ Starboard                        │ ❌        │ ✅ Configurable        │
│ XP/leveling                      │ ❌        │ ✅ Built-in            │
│ AI content moderation            │ ❌        │ ✅ Local AI moderation │
│ Document RAG                     │ ❌        │ ✅ Local semantic search│
│ Tamper-evident logs              │ ❌        │ ✅ verify_any()        │
│ Ed25519 message signing          │ ❌        │ ✅ Every message signed│
│ Bot/plugin ecosystem             │ ❌        │ ✅ WASM/Rust plugins   │
│ Multi-device                     │ ✅        │ Coming (keypair sync)  │
│ No cloud dependency              │ ❌        │ ✅                     │
│ Channels/servers/roles           │ ❌        │ ✅ Full collaboration  │
│ Threads (reply_to)               │ ❌        │ ✅                     │
│ Message pinning                  │ ❌        │ ✅                     │
│ Message search                   │ ❌        │ ✅                     │
│ Roles & permissions              │ ❌        │ ✅ (bitfield)          │
│ Invite codes                     │ ❌        │ ✅                     │
│ Marketplace                      │ ❌        │ ✅                     │
│ Server analytics                 │ ❌        │ ✅ (stats)             │
│ GPS/proximity (mDNS) discovery   │ ❌        │ ✅                     │
└──────────────────────────────────┴───────────┴────────────────────────┘
```

---

## The Signal Gap: Collaboration

Signal is designed for person-to-person and group messaging. It is not a
collaboration platform. There are no:

- **Channels** — no topic-based communication
- **Servers/Teams** — no organization hierarchy
- **Roles & permissions** — no permission management
- **Threads** — no message threading
- **Pin messages** — no pinned content
- **Starboard** — no community recognition
- **Whiteboard** — no collaborative canvas
- **Marketplace** — no plugin or extension store
- **Invite system** — no structured invite/join flow
- **Voice channels** — no persistent voice rooms

### What Libern Adds

Libern provides all of Signal's core encrypted messaging plus:

```rust
// apps/desktop/src-tauri/src/commands/
// Libern has a full collaboration command set:
mod server;      // create, update, delete servers
mod channel;     // create, delete channels with types
mod role;        // role-based permission system (bitfield)
mod message;     // send, edit, delete, search messages
mod invite;      // invite codes with expiry and usage limits
mod pins;        // pin/unpin messages in channels
mod stars;       // starboard system with configurable thresholds
mod marketplace; // plugin/item marketplace with likes
mod predictions; // prediction markets with betting
mod games;       // casino games (slots, blackjack, dice)
mod xp;          // XP/leveling system with leaderboards
mod stats;       // server analytics and member statistics
mod profile;     // user profiles with bio, pronouns, handles
```

Signal has none of these. It is, by design, a focused messaging app.

### Collaboration Feature Matrix

| Feature               | Signal               | Libern               |
|-----------------------|----------------------|----------------------|
| Channels              | ❌ (no concept)      | ✅ Text + voice      |
| Servers               | ❌ (no concept)      | ✅ Multiple servers  |
| Roles & permissions   | ❌                   | ✅ Bitfield (15+)    |
| Threads               | ❌ (flat messages)   | ✅ reply_to          |
| Pin messages          | ❌                   | ✅                   |
| Starboard             | ❌                   | ✅ Configurable      |
| Voice channels        | ❌ (calls only)      | ✅ Persistent rooms  |
| Whiteboard            | ❌                   | ✅ CRDT-based        |
| File browser          | ❌ (media only)      | ✅ Marketplace       |
| Bot API               | ❌                   | ✅ WASM/Rust         |
| Invite system         | ❌ (group links)     | ✅ Codes + expiry    |
| Server stats          | ❌                   | ✅                   |

---

## The Phone Number Dependency

### Signal Requires a Phone Number

```
Signal registration flow:
1. Install Signal app
2. Enter phone number
3. Receive SMS/call verification code
4. Enter code → access granted

Problems:
- Requires cellular/WiFi for SMS verification
- Phone number tied to identity — cannot change easily
- No privacy from Signal (they know your phone number)
- Not usable without a SIM or VoIP number
- Lost phone = potential identity loss
```

### Libern Uses Keypair Identity

```
Libern registration flow:
1. Install Libern
2. Generate Ed25519 keypair (or import existing)
3. Choose display name
4. Done. You have an identity.

No phone number. No email. No SMS. No third-party verification.
```

```rust
// apps/desktop/src-tauri/src/commands/user.rs
#[tauri::command]
pub fn create_user(db: State<Database>, display_name: String) -> Result<User, String> {
    // Generate UUID identity with Ed25519 keypair
    // No phone number, no email, no third-party dependency
}
```

Your identity is your Ed25519 keypair file. Copy it to any device and you
have the same identity. No phone number, no signal server, no foundation.

### Identity Comparison

| Aspect              | Signal                      | Libern                      |
|---------------------|-----------------------------|-----------------------------|
| Identifier          | Phone number (+1-555-...)   | Ed25519 public key hash     |
| Verification        | SMS/call (needs cell service)| None (self-generated)       |
| Portability         | ❌ Tied to phone number     | ✅ Copy keypair file        |
| Anonymity           | ❌ Phone known to Signal    | ✅ No personal info         |
| Recovery            | ❌ Lost phone = lost access | ✅ Backup keypair file      |
| Server dependency   | ✅ Signal server verifies   | ❌ No server needed         |
| Change identifier   | ❌ New phone = new identity | ✅ Generate new keypair     |
| Multi-device        | ✅ Linked devices           | 🔜 Keypair sync             |

---

## Offline: Cached vs Native

### Signal Offline Limitations

Signal's "offline" mode:
- Can view messages that were previously synced
- Cannot send new messages (they queue but may fail)
- Cannot start new conversations
- Cannot search history reliably
- Cannot access media not already downloaded
- Keys may be lost if not backed up
- No local AI (requires cloud)

### Libern Offline Capabilities

Libern's offline mode:
- Full read/write to all channels
- Full search across all messages
- Full AI access (Liber runs locally via Qwen 2.5 1.5B)
- Full file access (files are local)
- mDNS peer discovery on LAN
- CRDT sync when connectivity returns
- .aioss ledger fully accessible
- Health diagnostics (hardware/network)

```rust
// apps/desktop/src-tauri/src/commands/stats.rs
#[tauri::command]
pub fn is_network_available() -> Result<bool, String> {
    // Check network without being dependent on it
    Ok(TcpStream::connect_timeout(
        &"1.1.1.1:53".parse().unwrap(),
        Duration::from_millis(1000),
    ).is_ok())
}
```

Even when the network is unavailable, Libern continues to function
at full capacity. Signal becomes a read-only archive.

### Offline Scenario Comparison

| Scenario                    | Signal                          | Libern                         |
|-----------------------------|---------------------------------|--------------------------------|
| Internet outage (1 hour)    | Read only, no new messages       | Full operation                 |
| Remote area (no cell/WiFi)  | Useless (needs registration)     | Full operation + LAN discovery |
| Air-gapped environment      | Not possible (needs Signal svr)  | Fully operational              |
| Travel (no roaming)         | Read cached messages only        | Full operation                 |
| Disaster (network down)     | Cannot communicate               | Full team P2P communication    |
| LAN party (no WAN)          | Not possible                     | mDNS + P2P voice + chat        |

---

## The AI Difference

### Signal + AI

Signal has no AI features. The Signal Foundation has explicitly stated they
will not add AI, as it would compromise their privacy model. To use AI with
Signal, you would need:
1. A separate bot service
2. An OpenAI/Anthropic API subscription
3. Message forwarding (privacy risk)
4. No offline availability

### Libern + AI

Libern's AI is:
- **Native**: Every channel has access to Liber
- **Local**: Qwen 2.5 1.5B runs on your machine
- **Private**: Data never leaves your computer
- **Offline**: Works without internet
- **Free**: No API costs
- **Capable**: Summarization, Q&A, moderation, RAG, whiteboard analysis

```rust
// crates/libern-core/src/ai/qwen_engine.rs
pub struct CandleEngine {
    model_path: String,
    binary_path: String,  // llama.cpp CLI binary
}

impl AiEngine for CandleEngine {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String> {
        // Runs Qwen 2.5 1.5B locally via llama.cpp
        // Data never leaves the machine
        // No API call, no network request
    }
}
```

This is something Signal will never have — not because they can't build it,
but because their architecture (cloud-based push notifications, phone number
identity, thin client) fundamentally prevents local AI.

### AI Capability Comparison

| Capability              | Signal          | Libern                    |
|-------------------------|-----------------|---------------------------|
| Chat assistant          | ❌              | ✅ ask_libern             |
| Summarization           | ❌              | ✅ summarize_channel      |
| Whiteboard analysis     | ❌              | ✅ ask_whiteboard         |
| Content moderation      | ❌              | ✅ moderate_message       |
| Document RAG            | ❌              | ✅ Local semantic search  |
| Preference learning     | ❌              | ✅ Reward model           |
| Custom personality      | ❌              | ✅ Personality packs      |
| Offline AI              | ❌              | ✅ Yes (local Qwen)       |
| Privacy (data stays local)| N/A (no AI)   | ✅ Architecturally ensured|

---

## Cryptographic Verification

### Signal's Cryptographic Model

Signal provides E2EE for message content, but:
- No message signing (can't prove authorship)
- No chain hashing (can't detect deleted/modified history)
- No state proofs (can't notarize conversation state)
- Keys are managed by the Signal server
- No public auditability

### Libern's Cryptographic Model

Libern provides all of Signal's E2EE plus:

1. **Ed25519 message signing**: Every message is signed with the sender's
   private key. Recipients verify with the public key. Proves authorship
   and integrity.

2. **SHA3-256 hash chain**: Every message has a hash that includes the
   previous message's hash (`parent_hash`). Tampering with any message
   breaks the chain. (`crates/libern-aioss/src/entry.rs:L20-L45`)

3. **State proofs**: The head hash of any .aioss session can be
   Ed25519-signed to create a notarized proof of state at a point in time.
   (`crates/libern-aioss/src/state_proof.rs:L18-L71`)

4. **Chain verification**: `verify_any()` detects tampering instantly.
   (`crates/libern-aioss/src/verify.rs:L57-L65`)

5. **Parallel health chain**: Hardware/network diagnostics form their own
   hash chain for system integrity. (`crates/libern-aioss/src/health.rs`)

```
┌─────────────────────────────────────────────────────────┐
│ Redundant Security: Signal E2EE + Libern Cryptographic  │
│ Ledger + Ed25519 Signing = Triple-layer protection      │
└─────────────────────────────────────────────────────────┘
```

### Cryptographic Feature Comparison

| Feature               | Signal                    | Libern                    |
|-----------------------|---------------------------|---------------------------|
| E2EE (encryption)     | ✅ x3DH + Double Ratchet  | ✅ Ed25519 + X25519       |
| Message signing       | ❌                        | ✅ Ed25519 per message    |
| Hash chain            | ❌                        | ✅ SHA3-256 parent chain  |
| State proofs          | ❌                        | ✅ Ed25519-signed         |
| Chain verification    | ❌                        | ✅ verify_any()           |
| Health diagnostics    | ❌                        | ✅ Parallel hash chain    |
| Forward secrecy       | ✅                        | 🔜 Planned                |
| Deniability           | ✅                        | 🔜 Planned                |
| Meta-data protection  | ❌ (server knows metadata)| ✅ Architecturally private|

---

## Cost and Sustainability

| Aspect               | Signal                               | Libern                        |
|----------------------|--------------------------------------|-------------------------------|
| Usage cost           | Free (donation-funded)               | Free                          |
| Server costs         | Signal Foundation pays               | $0 (P2P, no servers)          |
| Phone number needed  | Yes                                  | No                            |
| AI costs             | N/A                                  | $0 (local inference)          |
| Identity system      | Centralized (Signal server)          | Decentralized (Ed25519 keypair)|
| Business model       | Donations + grants                   | Self-sovereign (no model)     |
| Vendor dependency    | Signal Foundation                    | None (you own your instance)  |

Signal depends on the Signal Foundation to maintain servers, process
registrations, and handle push notifications. If the foundation goes under,
Signal stops working.

Libern depends on nothing but the code on your machine. You own your
instance. You decide when and how to connect.

---

## Metadata Exposure

Signal encrypts message content but still exposes metadata:
- Who you communicate with (sender/recipient pairs)
- When you communicate (timestamps)
- How often you communicate (frequency patterns)
- Approximate location (IP addresses on server logs)
- Device information

Libern has no central server, so these metadata are never collected.

### Metadata Comparison

| Metadata Type        | Signal (collected)        | Libern (collected)         |
|----------------------|---------------------------|----------------------------|
| Communication graph  | ✅ Server sees pairs      | ❌ Impossible              |
| Message timestamps   | ✅ Server sees            | ❌ Local only              |
| Frequency patterns   | ✅ Server sees            | ❌ Local only              |
| IP addresses         | ✅ Server logs            | ❌ P2P, ephemeral          |
| Device info          | ✅ Server sees            | ❌ Not collected           |
| Phone number         | ✅ Required               | ❌ Not used                |
| Location             | ✅ Approximate (IP)       | ❌ Not collected           |

---

## When Signal Works Better

Signal is the right choice when:
- You only need one-to-one or small group messaging
- You want maximum privacy with minimum complexity
- You accept the phone number requirement
- You don't need AI, collaboration tools, or offline operation

### When Libern Works Better

Libern is the right choice when:
- You need a **full collaboration platform** (servers, channels, roles)
- You want **local AI** — private, offline, free
- You need **offline operation** — field work, travel, remote areas
- You want **cryptographic audit** — tamper-evident logs, state proofs
- You want **true identity sovereignty** — Ed25519 keypairs, no phone numbers
- You need **P2P collaboration** — LAN parties, disaster recovery

---

## Conclusion: Why Not Signal?

Signal is an excellent messaging app that we recommend for basic private
communication. But it is not a collaboration platform.

Libern is a **sovereign collaboration engine** that provides:
- Signal-grade E2EE (and more — Ed25519 signing, hash chains, state proofs)
- Full server/channel/role infrastructure
- Local AI (Liber) — private, offline, free
- CRDT-based offline-first operation
- .aioss cryptographic audit ledger
- Self-sovereign Ed25519 identity (no phone number)
- Zero infrastructure (P2P, no servers)

Use Signal for private messages. Use Libern for **owning your communication
infrastructure**.

**One is an app. The other is a sovereign platform.**

## Use Case Scenarios: Signal vs Libern

### Basic Communication Needs

| Scenario | Signal | Libern |
|----------|--------|--------|
| One-to-one messaging | ✅ Excellent | ✅ Excellent |
| Group chat (<100) | ✅ Good | ✅ Good |
| Group chat (100+) | ❌ Unwieldy | ✅ Channels + roles |
| File sharing | 100MB limit | Unlimited |
| Voice/video calls | ✅ E2EE | ✅ Direct P2P |
| Disappearing messages | ✅ | Coming (.aioss TTL) |

### Team Collaboration

| Requirement | Signal | Libern |
|-------------|--------|--------|
| Channels by topic | ❌ | ✅ Text + voice channels |
| Role-based permissions | ❌ | ✅ Bitfield (15+ perms) |
| Message threads | ❌ (flat list) | ✅ reply_to |
| Message search | ❌ | ✅ Full-text search |
| Pin important messages | ❌ | ✅ pin_message |
| Starboard/highlights | ❌ | ✅ Configurable |
| Bot/plugin integration | ❌ | ✅ WASM/Rust plugins |
| Shared whiteboard | ❌ | ✅ CRDT-based canvas |

### Cryptographic Comparison Deep Dive

| Property | Signal Protocol | Libern Protocol |
|----------|----------------|-----------------|
| Encryption | x3DH + Double Ratchet | Ed25519 + X25519 |
| Message signing | ❌ Not provided | ✅ Ed25519 per message |
| Forward secrecy | ✅ Yes | 🔜 Planned |
| Deniability | ✅ Yes | 🔜 Planned |
| Hash chain | ❌ No chain linking | ✅ SHA3-256 parent chain |
| State proofs | ❌ No notarization | ✅ Ed25519 state proofs |
| Metadata protection | ❌ Server sees graph | ✅ Architecturally private |
| Post-compromise security | ✅ Yes (ratchet) | 🔜 Planned |

## When to Use Signal vs When to Use Libern

### Use Signal When:

- You only need private one-to-one messaging
- You already have a phone number and Signal contacts
- You don't need collaboration features (channels, roles, AI)
- You accept metadata exposure (Signal server knows who you message)
- Offline capability is not a requirement

### Use Libern When:

- You need team collaboration (channels, servers, roles)
- You want local AI that's private and offline
- You need cryptographic audit trails for compliance
- You want offline-first operation (field work, travel)
- You don't want to give a phone number
- You need unlimited file sharing
- You want self-sovereign identity (Ed25519 keypair)

## The Metadata Problem

Signal's server architecture inevitably exposes metadata:

```
Signal Communication Metadata:
├── Who you message (sender ID + recipient ID)
├── When you message (timestamps)
├── How often (frequency analysis)
├── Approximate location (IP address logs)
├── Group membership (who is in which group)
├── Device information (OS, app version)
└── Message sizes (approximate content length)

This metadata is stored on Signal's servers.
Even with E2EE, the metadata reveals communication patterns.
```

Libern has no central server, so no metadata is collected:

```
Libern Communication Metadata:
├── Who you message: Not collected (P2P, ephemeral)
├── When you message: Local only
├── How often: Local only
├── Location: Not collected
├── Group membership: Local only
└── Message sizes: Not measurable externally
```

---

## Related Documents

- `docs/competitors/05-signal.md` — Deep competitive analysis of Signal
- `docs/competitors/11-matrix-analysis.md` — Full competitive matrix
- `docs/why-use/06-why-libern.md` — Why Libern exists
- `crates/libern-core/src/crypto/mod.rs` — Ed25519 implementation
- `crates/libern-aioss/src/state_proof.rs` — State proof implementation
- `apps/desktop/src-tauri/src/commands/user.rs` — User creation command
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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
