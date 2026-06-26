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
Document ID: FAQ-005
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Offline Usage FAQ

## Can I use Libern without internet?

**Yes.** Libern is designed as an offline-first application. The core functionality works fully without any internet connection:

### What Works Offline

| Feature | Works Offline? | Notes |
|---------|---------------|-------|
| Text chat | Yes | Within LAN peers |
| Voice chat | Yes | LAN peer-to-peer audio |
| Whiteboard | Yes | Collaborative canvas |
| AI assistant | Yes | Local model inference |
| .aioss ledger | Yes | Local hash chain recording |
| Marketplace | Yes | Local item browsing/publishing |
| Casino games | Yes | Pure Rust RNG |
| XP/Leveling | Yes | Local database |
| Roles/Permissions | Yes | Local database |
| Slash commands | Yes | Rust-instant or local AI |
| mDNS peer discovery | Yes | LAN only |
| WebSocket P2P sync | Yes | LAN only |

### What Requires Internet

| Feature | Internet Required? | Alternative |
|---------|-------------------|-------------|
| AI model download | Yes | Use MockEngine |
| External URL links | Yes | Copy/paste content |
| Software updates | Yes | Manual download |

### Offline/Online Feature Matrix

```
Feature                    Fully Offline    LAN Only    Internet Required
─────────────────────────────────────────────────────────────────────
Text chat                     ✓              ✓
Voice chat                    ✓              ✓
Whiteboard                    ✓              ✓
AI (with model)               ✓              ✓
AI (model download)                                        ✓
.aioss ledger                 ✓              ✓
Marketplace                   ✓              ✓
Casino games                  ✓              ✓
XP/Leveling                   ✓              ✓
Roles/Permissions             ✓              ✓
Peer discovery                               ✓
P2P sync                                     ✓
Software updates                                           ✓
External links                                               ✓
```

---

## What does "offline-first" mean?

Offline-first means the application is designed to work without network connectivity as the primary mode. Network connectivity (internet) is optional and only used for specific operations like model downloads.

The architecture:
1. All data is stored locally (SQLite).
2. All operations work on local data first.
3. Peer synchronization happens only when connected via LAN.
4. No cloud dependency — the app never requires internet to function.

### Offline-First Design Principles

```
Principles:
┌─────────────────────────────────────────────────────┐
│  1. Local First                                      │
│     All data written to local DB before any sync    │
│     User never waits for network                    │
├─────────────────────────────────────────────────────┤
│  2. Graceful Degradation                            │
│     Features work without network                   │
│     Network just adds peer collaboration            │
├─────────────────────────────────────────────────────┤
│  3. Conflict-Free                                   │
│     CRDT ensures no data loss during sync           │
│     No merge conflicts to resolve manually          │
├─────────────────────────────────────────────────────┤
│  4. Privacy by Design                                │
│     No phone-home, no telemetry                     │
│     Network only for explicit user actions          │
└─────────────────────────────────────────────────────┘
```

---

## How does Libern work on a LAN without internet?

Libern uses:
1. **mDNS** (multicast DNS) for discovering other Libern instances on the local network.
2. **WebSocket** connections for real-time communication between peers.
3. **CRDT merge** for conflict-free synchronization of state.

When you start Libern on a LAN:
1. It broadcasts its presence via mDNS.
2. Other Libern instances discover it.
3. WebSocket connections are established.
4. State is synchronized using CRDT merge (LWW Element Set).
5. Messages, whiteboard strokes, and other data are shared in real-time.

### LAN Discovery Flow

```
┌─────────┐                     ┌─────────┐
│  Peer A │                     │  Peer B │
└────┬────┘                     └────┬────┘
     │                               │
     │ 1. mDNS: _libern._tcp.local  │
     │  ───────────────────────────► │
     │ 2. mDNS Response             │
     │  ◄─────────────────────────── │
     │                               │
     │ 3. WebSocket connect         │
     │  ───────────────────────────► │
     │ 4. WebSocket established     │
     │  ◄─────────────────────────── │
     │                               │
     │ 5. CRDT state sync           │
     │  ───────────────────────────► │
     │ 6. CRDT state sync           │
     │  ◄─────────────────────────── │
     │                               │
     │ 7. Real-time messages        │
     │  ───────────────────────────► │
     │ 8. Real-time messages        │
     │  ◄─────────────────────────── │
     │                               │
```

---

## What happens when I'm completely offline (no LAN)?

When running without any network (not even LAN):
- You can still use all features as a **single-user** instance.
- Create servers, channels, send messages, use AI, play games.
- No peer discovery will occur.
- Data is stored locally and will sync when you reconnect to a LAN with peers.

### Single-User Mode

```
┌──────────────────────────────────────────────┐
│           Single-User (Fully Offline) Mode    │
├──────────────────────────────────────────────┤
│                                              │
│  Available:                                  │
│  ✓ All core features                         │
│  ✓ AI assistant (with model)                 │
│  ✓ Marketplace                               │
│  ✓ Casino games                              │
│  ✓ .aioss ledger                             │
│                                              │
│  Not Available:                              │
│  ✗ Peer discovery                            │
│  ✗ Multi-user collaboration                  │
│  ✗ Message sync                              │
│                                              │
│  Data persists locally, syncs when LAN       │
│  becomes available again                     │
└──────────────────────────────────────────────┘
```

---

## How does CRDT sync work when reconnecting?

The CRDT system in `crates/libern-core/src/crdt/mod.rs` uses a **Last-Write-Wins Element Set (LWW Element Set)**:

```rust
pub struct LwwElementSet<T: Clone + Eq + Hash> {
    pub adds: Vec<(T, u64)>,
    pub removes: Vec<(T, u64)>,
}
```

When two peers reconnect:
1. They exchange their add and remove sets.
2. The `merge` function combines them:
   ```rust
   pub fn merge(&mut self, other: &LwwElementSet<T>) {
       // Add elements from other that don't exist locally
       // For conflicts, higher HLC timestamp wins
   }
   ```
3. The `snapshot` function computes the current state:
   ```rust
   pub fn snapshot(&self) -> Vec<T> {
       // Returns elements that have an add timestamp higher than any remove timestamp
   }
   ```

This ensures that when peers reconnect after being offline, their state converges without conflicts.

### Reconnection Merge Example

```
Peer A (offline for 1 hour):      Peer B (offline for 1 hour):
  Sent 5 messages                   Sent 3 messages
  Deleted 1 channel                 Created 1 channel
         │                               │
         └───────────┬───────────────────┘
                     ▼
            Both peers reconnect
                    │
                    ▼
          CRDT merge occurs:
          - All 8 messages from both peers
          - Channel deletion and creation
          - HLC determines final state
                    │
                    ▼
          Both peers see identical state
          No data loss, no conflicts
```

---

## Will I lose data if I go offline?

**No.** All data is persisted to local SQLite storage. Going offline does not cause data loss. When you reconnect to peers, the CRDT sync merges any changes made while offline.

---

## How does the Hybrid Logical Clock work offline?

The HLC (Hybrid Logical Clock) works independently on each node:
```rust
pub struct HybridLogicalClock {
    pub physical: u64,  // Wall clock (ms, 48 bits)
    pub logical: u16,   // Logical counter (16 bits)
}
```

When events happen offline:
1. The tick() increments using local wall time + logical counter.
2. When two peers sync, timestamps are reconciled using max() of both.
3. The update_with_remote() function handles clock drift:
   ```rust
   pub fn update_with_remote(&mut self, remote_ts: u64) -> u64 {
       let now = Self::wall_now();
       self.physical = self.physical.max(now).max(remote_physical);
       // Adjust logical counter accordingly
   }
   ```

---

## Can I share files without internet?

File attachments work via LAN peer-to-peer. When you attach a file:
1. The file is stored locally and referenced in the message.
2. The file data is transferred to connected peers via WebSocket.
3. Peers cache the file locally.

---

## Can I use the AI without downloading the model?

Yes. If you skip the model download, Liber uses `MockEngine` which provides basic responses. To use the real AI model, you need to download it once (requires internet). After download, it works fully offline.

---

## Is there any "phone home" functionality?

**No.** Libern has no phone-home, no telemetry, no analytics, and no automatic update checks. The only outbound connections are:
- mDNS (LAN broadcast, stays on local network)
- Hugging Face (only during manual model download)

You can verify this by checking the Tauri commands and the Rust source code — there are no HTTP clients or network requests except the model downloader.

---

## Can I use Libern on an air-gapped network?

Yes. Libern is ideal for air-gapped environments:
- No internet required for core functionality.
- All data stays within the local network.
- No external dependencies.
- The .aioss ledger provides an audit trail suitable for compliance.

For air-gapped deployment:
1. Download the installer on a connected machine.
2. Transfer it to the air-gapped machine via USB.
3. Optionally download the AI model and transfer it.
4. Use Libern fully offline.

---

## What about time synchronization on offline networks?

Libern uses HLC timestamps which do not require NTP or external time sync. The HLC guarantees:
1. **Strictly increasing** timestamps (even if wall clock goes backward).
2. **Causal ordering** across peers (via update_with_remote).
3. **Conflict resolution** (higher timestamp wins in CRDT merge).

```rust
// HLC is always strictly increasing
let mut prev = 0u64;
for _ in 0..1000 {
    let ts = hlc.tick();
    assert!(ts > prev);
    prev = ts;
}
```

---

## How does Libern handle clock drift between peers?

The HLC's `update_with_remote` function handles clock drift by taking the maximum of:
1. Current wall time
2. Remote timestamp's physical component
3. Existing local physical time

This ensures that even if one peer's clock is significantly ahead/behind, the merged timestamps converge to a consistent ordering.

### Clock Drift Scenario

```
Scenario: Peer A clock is 5 minutes ahead of Peer B

Peer A timestamp:  1718000300000  (ahead by 5 min)
Peer B timestamp:  1718000000000  (correct)

When they sync:
Peer B receives Peer A's timestamp
Peer B calls HLC.update_with_remote(1718000300000)
Peer B's physical = max(1718000000000, now, 1718000300000)
Peer B's physical = 1718000300000 (adopts A's time)

Now both use the same physical time base
Causal ordering is preserved
```

---

## Offline Use Cases

### Disaster Recovery / Emergency Communication

```
Scenario: Natural disaster disrupts internet and cellular

1. Teams deploy Libern on laptops in shelter
2. LAN connects machines in close proximity
3. Full communication available:
   - Text chat for coordination
   - Whiteboard for maps/plans
   - AI assistant for information lookup
   - .aioss ledger for record keeping
4. No internet required at any point
5. Data persists for later review
```

### Remote Field Operations

```
Scenario: Research team in remote area without internet

1. Team members connect laptops via ad-hoc Wi-Fi
2. Libern provides full collaboration suite:
   - Daily logs in text channels
   - Whiteboard for diagrams
   - AI for data analysis
   - Voice for hands-free communication
3. .aioss ledger maintains verifiable records
4. Data synced when peers are in range
```

### Classroom / Training

```
Scenario: Computer lab without internet access

1. Instructor installs Libern on all machines
2. Students collaborate via LAN:
   - Class discussions in text channels
   - Collaborative whiteboard exercises
   - AI tutor for questions
   - Quiz commands for assessment
3. No IT infrastructure needed
4. Complete offline operation
```

### Secure Facility

```
Scenario: Classified facility with no external network

1. Libern deployed on air-gapped network
2. All communication stays within facility
3. Features available:
   - Encrypted-style messaging
   - .aioss audit trail
   - AI assistant (local model)
   - No telemetry, no external connectivity
4. Meets strict security requirements
```

---

## Offline vs Online Feature Matrix

```
                    Completely   LAN-only   Internet
Feature             Offline      (peers)    Required
─────────────────────────────────────────────────────
Create identity      ✓           ✓         
Create server        ✓           ✓         
Send messages        ✓           ✓         
Read messages        ✓           ✓         
Voice chat                       ✓         
Whiteboard           ✓           ✓         
AI (with model)      ✓           ✓         
AI (model download)                         ✓
Marketplace          ✓           ✓         
Casino games         ✓           ✓         
XP/Leveling          ✓           ✓         
Roles/Permissions    ✓           ✓         
Peer discovery                    ✓         
P2P sync                         ✓         
Software updates                              ✓
External links                               ✓
```

---

## Offline Architecture Deep Dive

### Data Flow When Fully Offline

```
User sends message
    │
    ▼
┌─────────────────────┐
│  1. SQLite INSERT   │  ← Always succeeds (local DB)
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  2. .aioss append   │  ← Always succeeds (local file)
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  3. CRDT state add  │  ← Updated in memory
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  4. mDNS check?     │  ← Are there LAN peers?
└─────────┬───────────┘
     Yes│         │No
        ▼         ▼
┌────────────┐  ┌────────────────────┐
│ Send via   │  │ Queue for later    │
│ WebSocket  │  │ (no data loss)     │
└────────────┘  └────────────────────┘
```

When LAN becomes available:
1. Peers discover each other via mDNS
2. WebSocket connections established
3. CRDT state merged (all offline changes synced)
4. All queues drained

---

## CRDT Conflict Resolution Examples

### Scenario: Same Message Edited Offline

```
Peer A edits message: "Let's meet at 3pm" → "Let's meet at 4pm"
Peer B edits message: "Let's meet at 3pm" → "Let's meet at 5pm"

CRDT Resolution:
- Both edits have different HLC timestamps
- The edit with the later timestamp wins
- Other peer's edit is recorded but not applied
- No data loss — both edits visible in history
```

### Scenario: Channel Created Offline on Both Peers

```
Peer A creates channel: #design (offline)
Peer B creates channel: #design (offline)

CRDT Resolution:
- Both channels have different UUIDs
- Both exist after merge
- Admin can delete duplicate
```

### Scenario: Delete vs Edit Conflict

```
Peer A deletes a message
Peer B edits the same message

CRDT Resolution:
- Delete timestamp > Edit timestamp → Message deleted
- Edit timestamp > Delete timestamp → Message edited
- Higher timestamp wins deterministically
```

---

## Offline FAQ Summary

| Question | Answer |
|----------|--------|
| Can I use it without internet? | Yes, fully offline-first |
| Can I collaborate on LAN? | Yes, P2P sync |
| Will I lose data offline? | No, persists locally |
| Can I use AI offline? | Yes (after model download) |
| Does it phone home? | No |
| Air-gapped networks? | Yes, ideal for this |
| Time sync needed? | No, HLC handles it |
| File sharing offline? | Yes, via LAN P2P |
| What happens on reconnect? | CRDT merge syncs all changes |
| Can multiple peers edit same thing? | Yes, CRDT resolves conflicts |
| Is there data loss risk? | Only if local DB is deleted |
| How does HLC work offline? | Uses local wall clock + logical counter |

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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