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
Document ID: FAQ-001
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# General FAQ

## What is Libern?

Libern is a **sovereign, offline-first, LAN-P2P collaborative telecom engine**. It is a single-binary desktop application that provides Discord-like collaboration (text chat, voice, whiteboard, AI assistant) without any central server, cloud dependency, or external infrastructure.

Every message is cryptographically signed, hash-chained into a tamper-evident `.aioss` ledger, and synchronized peer-to-peer via CRDT merge.

### Core Philosophy

Libern is built on three core principles:

1. **Sovereignty**: You control your data. No third party has access.
2. **Offline-First**: All features work without internet. The network is optional.
3. **Transparency**: Everything is open source and cryptographically verifiable.

### Architecture at a Glance

```
┌─────────────────────────────────────────────────────┐
│                Libern Architecture                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Frontend (React + TypeScript)                      │
│  ┌──────────────┐ ┌──────────────┐                 │
│  │  Chat UI     │ │  Whiteboard  │                 │
│  └──────────────┘ └──────────────┘                 │
│         │                  │                        │
│  ┌──────┴──────────────────┴──────┐                │
│  │      Tauri IPC (invoke/events) │                │
│  └──────┬──────────────────┬──────┘                │
│         ▼                  ▼                        │
│  ┌──────────────┐ ┌──────────────┐                 │
│  │ Rust Backend │ │ AI Engine   │                 │
│  │ (commands)   │ │ (Qwen/Mock) │                 │
│  └──────┬───────┘ └──────────────┘                 │
│         │                                           │
│  ┌──────┴──────────────────────────────────────┐   │
│  │        Local SQLite + .aioss Ledger          │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Is Libern free?

Yes, Libern is free and open source. The source code is available at:
- https://github.com/libern/libern

The project is built by the community under Lois-Kleinner and 0-1.gg.

There are no:
- Premium tiers
- Subscription fees
- In-app purchases
- Paywalls for features
- Data caps or limits

---

## Is Libern open source?

Yes. The entire codebase is publicly available. The workspace consists of:

```
libern/
├── apps/
│   ├── desktop/      — Tauri desktop application (React + Rust)
│   └── sandbox/      — Sandbox for testing
├── crates/
│   ├── libern-core/  — Core library (AI, CRDT, crypto, DB, sync)
│   └── libern-aioss/ — .aioss binary format implementation
├── Cargo.toml        — Rust workspace
└── build.bat         — Windows build script
```

### Codebase Statistics

| Metric | Value |
|--------|-------|
| Rust crates | 2 (`libern-core`, `libern-aioss`) |
| Application projects | 2 (`desktop`, `sandbox`) |
| Frontend framework | React + Vite + Zustand |
| Backend framework | Tauri 2.x |
| Database | SQLite (via rusqlite) |
| AI runtime | llama.cpp CLI |
| Cryptography | SHA3-256, Ed25519 |

---

## What makes Libern different from Discord or Slack?

| Feature | Discord | Slack | Libern |
|---------|---------|-------|--------|
| Server | Centralized cloud | Centralized cloud | Peer-to-peer LAN |
| Data ownership | Discord servers | Slack servers | Your machine |
| Encryption | Transport only | Transport only | End-to-end signing |
| Offline | Requires internet | Requires internet | Fully offline-first |
| AI assistant | Cloud-based AI | Cloud-based AI | Local AI (Qwen 2.5) |
| Audit trail | Server logs | Server logs | .aioss hash chain |
| Cost | Free + premium | Free + paid tiers | Completely free |
| Telemetry | Yes | Yes | Zero telemetry |
| Account | Email + password | Email + password | Ed25519 key pair |
| Self-hostable | No | No | Yes (single binary) |
| Open source | Partial client | No | Full source |
| Message integrity | Server trust | Server trust | Cryptographic proof |

### Comparison Diagram

```
Discord/Slack Model:
┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │────►│  Cloud  │◄────│  User   │
│  A      │     │  Server │     │  B      │
└─────────┘     └─────────┘     └─────────┘
   Data goes through central server
   Internet required
   No offline capability

Libern Model:
┌─────────┐                 ┌─────────┐
│  User   │◄─── LAN P2P ───►│  User   │
│  A      │                 │  B      │
└─────────┘                 └─────────┘
   Direct peer-to-peer
   No central server
   Works fully offline on LAN
```

---

## What platforms does Libern support?

- **Windows** 10/11 (x86_64)
- **macOS** 12+ (x86_64, ARM64)
- **Linux** (glibc 2.28+, x86_64)

### Platform Support Matrix

| Feature | Windows | macOS | Linux |
|---------|---------|-------|-------|
| Text chat | ✓ | ✓ | ✓ |
| Voice chat | ✓ | ✓ | ✓ |
| Whiteboard | ✓ | ✓ | ✓ |
| AI assistant | ✓ | ✓ | ✓ |
| .aioss ledger | ✓ | ✓ | ✓ |
| Marketplace | ✓ | ✓ | ✓ |
| mDNS discovery | ✓ | ✓ | ✓ |
| Apple Silicon native | N/A | ✓ | N/A |
| AppImage | N/A | N/A | ✓ |
| MSI installer | ✓ | N/A | N/A |
| DMG package | N/A | ✓ | N/A |

---

## Do I need internet?

No. Libern is designed to work fully offline on a LAN. Core features work without any internet connection:

- Text chat (within LAN)
- Voice chat (within LAN)
- Whiteboard (within LAN)
- AI assistant (local model)
- .aioss ledger recording
- Marketplace (local)
- Casino games (local)
- XP/Leveling (local)

Internet is only needed for:
- Downloading the AI model from Hugging Face
- Accessing external resources linked in messages

### Offline Capability Diagram

```
┌─────────────────────────────────────────────────────┐
│           What Works Without Internet                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Core Features          Network-Required             │
│  ┌──────────────────┐  ┌──────────────────────┐    │
│  │ ✓ Text chat      │  │ ✗ AI model download │    │
│  │ ✓ Voice chat     │  │ ✗ External URLs     │    │
│  │ ✓ Whiteboard     │  │ ✗ Software updates  │    │
│  │ ✓ AI (local)     │  └──────────────────────┘    │
│  │ ✓ .aioss ledger  │                               │
│  │ ✓ Marketplace    │                               │
│  │ ✓ Casino games   │                               │
│  │ ✓ XP/Leveling    │                               │
│  │ ✓ Roles/perms    │                               │
│  │ ✓ Slash commands │                               │
│  └──────────────────┘                               │
└─────────────────────────────────────────────────────┘
```

---

## Who is Liber?

Liber is the built-in AI assistant for Libern. It runs entirely on your machine. The name references the concept of liberty/sovereignty — your data never leaves your device.

Liber's user ID is reserved as `00000000-0000-0000-0000-000000000001`.

### Liber's Capabilities

| Capability | Description |
|-----------|-------------|
| Question answering | Answer questions about any topic |
| Channel summarization | Summarize recent conversations |
| Whiteboard analysis | Analyze diagrams and drawings |
| RAG document querying | Answer questions based on uploaded documents |
| Content moderation | Classify message safety |
| Games | Trivia, 8-ball, RPS, quizzes |
| Slash commands | Over 15 AI-powered commands |

---

## What is .aioss?

.aioss stands for **AI Operated Session Store**. It is a binary file format that records every action in a tamper-evident hash chain. Each entry contains:
- Index and timestamp
- Entry type and actor information
- SHA3-256 content hash
- SHA3-256 parent hash (linking to previous entry)

This creates an immutable, verifiable chain of all activity. Like a blockchain, but for your local collaboration sessions.

### .aioss vs Blockchain

| Aspect | Blockchain | .aioss |
|--------|-----------|--------|
| Purpose | Distributed ledger | Local audit trail |
| Consensus | Mining/staking | None (single writer) |
| Network | Global P2P | Local single file |
| Immutability | Proof of work | Hash chain |
| Tokens | Yes | No |
| Mining | Yes | No |
| Size limit | Unlimited (grows) | Configurable seal interval |

---

## Can I use Libern for enterprise compliance?

Yes. The .aioss format is designed specifically for compliance requirements:
- Tamper-evident hash chain
- Ed25519 cryptographic state proofs
- Automated session sealing at configurable intervals
- Exportable in binary, JSON, and TXT formats
- Health diagnostics with hash-chained audit trail

### Compliance Standards Support

| Standard | How Libern Helps |
|----------|-----------------|
| GDPR | All data local, no data export required |
| HIPAA | No PHI transmitted externally |
| SOC 2 | Audit trails via .aioss hash chain |
| FDA 21 CFR Part 11 | Electronic records/signatures |
| EU AI Act | Transparent local AI, no black boxes |

---

## Does Libern use a blockchain?

No. While the .aioss hash chain is similar to blockchain in structure, it is not a distributed ledger or cryptocurrency. There is no mining, no consensus algorithm, and no tokens. Each .aioss file is a local audit trail, optionally signed for external verification.

---

## What programming languages is Libern built with?

- **Rust** — Backend engine, Tauri commands, CRDT, crypto, .aioss format
- **TypeScript/React** — Frontend UI (Vite + React + Zustand)
- **Tauri** — Desktop framework (combines Rust backend with web frontend)

### Technology Stack

```
┌─────────────────────────────────────┐
│  Frontend Layer                     │
│  TypeScript │ React │ Zustand      │
│  Vite │ Framer Motion │ CSS        │
├─────────────────────────────────────┤
│  IPC Layer                          │
│  Tauri invoke() / Channel<>        │
├─────────────────────────────────────┤
│  Backend Layer                      │
│  Rust │ tokio │ serde │ rusqlite  │
│  tauri::State │ Mutex │ UUID      │
├─────────────────────────────────────┤
│  Storage Layer                      │
│  SQLite (libern.db)                │
│  .aioss Binary Files               │
│  GGUF Model Files                  │
└─────────────────────────────────────┘
```

---

## How large is the application?

- The Libern binary is approximately 10-15 MB.
- The SQLite database grows with use but typically stays small (a server with thousands of messages is a few MB).
- The AI model (Qwen 2.5 1.5B) is ~1.1 GB if downloaded.
- The llama.cpp CLI binary is ~5-10 MB.

### Storage Breakdown

```
Component             Size         Optional?
─────────────────────────────────────────────
Libern binary         10-15 MB     No
SQLite database       1-100 MB     No (grows with use)
Qwen 2.5 1.5B model  1.1 GB       Yes
llama.cpp binary      5-10 MB      Yes (if using AI)
.aioss exports        Variable     Yes (configurable)
Cache/temp files      <50 MB       No
```

---

## What is the license?

The project is copyrighted by Lois-Kleinner and 0-1.gg (2026). All rights reserved. The source code is publicly available for viewing and auditing.

---

## How can I contribute?

See the **Developers FAQ** (FAQ-010) for contribution guidelines. In summary:
1. Fork the repository
2. Create a feature branch
3. Make changes following code style
4. Add tests for new functionality
5. Submit a pull request

---

## Where can I get help?

- **Check the troubleshooting FAQ** (FAQ-009)
- **Read the developer documentation** (docs/developers/)
- **Open an issue on GitHub**
- **Join the community channels**

### Support Resources

| Resource | Location |
|----------|----------|
| Documentation | `docs/` directory |
| GitHub Issues | https://github.com/libern/libern/issues |
| Tutorials | `docs/tutorial/` |
| FAQs | `docs/faqs/` |
| Troubleshooting | `docs/help-bugs/` |

---

## Frequently Asked Questions Summary

| Question | Short Answer | Doc Reference |
|----------|-------------|---------------|
| Is it free? | Yes, completely free | FAQ-001 |
| Is it open source? | Yes, full source available | FAQ-001 |
| Do I need internet? | No, works fully offline | FAQ-005 |
| Is there a server? | No, P2P on LAN | FAQ-001 |
| What about privacy? | Zero telemetry, all local | FAQ-004 |
| Can I use AI offline? | Yes, runs locally | FAQ-003 |
| What platforms? | Windows, macOS, Linux | FAQ-002 |
| How do I install? | Single binary installer | FAQ-002 |

---

## Comparison: Libern vs Other Platforms

### Libern vs Discord

| Aspect | Discord | Libern |
|--------|---------|--------|
| Server infrastructure | Cloud (AWS/GCP) | None (P2P) |
| Internet required | Yes | No |
| Data storage | Discord servers | Your machine |
| Encryption | Transport TLS | Cryptographic signing + hash chain |
| Moderation | Corporate | Local AI + keyword |
| Customization | Limited bots | Open source, full control |
| Cost | Free + Nitro ($10/mo) | Completely free |
| Privacy | Telemetry, analytics | Zero telemetry |
| Audit trail | Server logs | .aioss tamper-evident ledger |
| AI | Cloud (various models) | Local (Qwen 2.5 1.5B) |

### Libern vs Slack

| Aspect | Slack | Libern |
|--------|-------|--------|
| Pricing | Free tier limited, Pro $8/mo | Free forever |
| Offline support | Limited | Full offline-first |
| Message history | 90 days (free) | Unlimited (local) |
| File storage | 5 GB (free) | Unlimited (local disk) |
| Integrations | 2,400+ apps | Open source API |
| Data ownership | Slack | You |
| Self-hostable | No | Yes (single binary) |
| Audit logs | Paid add-on | Built-in .aioss |

### Libern vs Matrix

| Aspect | Matrix | Libern |
|--------|--------|--------|
| Architecture | Federated servers | P2P LAN |
| Complexity | High (server setup) | Low (single binary) |
| Encryption | Olm/Megolm (E2EE) | Ed25519 signing |
| Offline | Limited | Full |
| Voice/Video | Via Jitsi bridge | Native P2P |
| Whiteboard | Via plugin | Built-in |
| AI | External bots | Built-in local AI |

---

## How Libern Handles Data

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Libern Data Flow                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  User Action                                             │
│  (send message, create channel, etc.)                   │
│         │                                                │
│         ▼                                                │
│  1. Write to local SQLite                               │
│     (immediate, always succeeds)                        │
│         │                                                │
│         ▼                                                │
│  2. Append to .aioss ledger                             │
│     (tamper-evident hash chain)                         │
│         │                                                │
│         ▼                                                │
│  3. Broadcast to LAN peers                              │
│     (via WebSocket, if connected)                       │
│         │                                                │
│         ▼                                                │
│  4. Peers receive and merge via CRDT                    │
│     (conflict-free, no data loss)                       │
│                                                          │
│  If step 3 fails (no peers):                            │
│  - Data is safe in SQLite                               │
│  - CRDT merge happens when peers reconnect              │
│  - No data loss ever                                    │
└─────────────────────────────────────────────────────────┘
```

### Data Redundancy

Libern provides multiple layers of data protection:

| Layer | Method | Protection From |
|-------|--------|-----------------|
| 1 | Local SQLite | Primary storage |
| 2 | WAL mode (SQLite) | Crash recovery |
| 3 | .aioss hash chain | Tamper evidence |
| 4 | CRDT peer sync | Hardware failure |
| 5 | Manual backup | All of the above |

---

## Glossary

| Term | Definition |
|------|------------|
| **Libern** | Sovereign Collaborative Telecom Engine |
| **Liber** | Built-in AI assistant |
| **.aioss** | AI Operated Session Store (tamper-evident ledger) |
| **CRDT** | Conflict-Free Replicated Data Type |
| **HLC** | Hybrid Logical Clock |
| **LWW** | Last-Write-Wins (CRDT strategy) |
| **mDNS** | Multicast DNS (peer discovery) |
| **P2P** | Peer-to-peer (direct connection) |
| **Ed25519** | Elliptic curve digital signature algorithm |
| **SHA3-256** | Secure Hash Algorithm 3 (256-bit) |
| **GGUF** | GPT-Generated Unified Format (model file) |
| **Qwen 2.5** | The AI model used by Liber |
| **MockEngine** | Fallback AI engine (canned responses) |
| **CandleEngine** | Real AI engine (uses Qwen model) |
| **RAG** | Retrieval-Augmented Generation |
| **RLHF** | Reinforcement Learning from Human Feedback |
| **Tauri** | Desktop framework (Rust + web) |
| **Zustand** | State management library |
| **SQLite** | Embedded database engine |
| **WAL** | Write-Ahead Log (SQLite journal mode) |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-06-19 | Initial release |

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
