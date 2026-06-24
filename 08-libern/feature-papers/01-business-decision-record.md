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
Category: Feature Paper
Document ID: PAP-001
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Business Decision Record (BDR)

## Document Meta

| Field | Value |
|-------|-------|
| BDR ID | BDR-001 |
| Title | Libern Architecture Foundation: Offline-First Sovereign Collaboration |
| Status | Accepted |
| Deciders | Libern Architecture Team |
| Date | 2026-03-15 |
| Last Updated | 2026-06-19 |

---

## 1. Context

### 1.1 Problem Statement

The collaboration software market is dominated by cloud-dependent platforms (Discord, Slack, Microsoft Teams) that require constant internet connectivity, central server infrastructure, and third-party data storage. These platforms present significant challenges for:

- **Privacy-conscious organizations**: All data passes through and is stored on third-party servers.
- **Air-gapped environments**: Military, intelligence, and critical infrastructure that cannot connect to the internet.
- **Offline scenarios**: Teams in remote locations, on aircraft, or during network outages lose access to their collaboration tools.
- **Data sovereignty**: Organizations subject to data residency requirements cannot control where their data is stored.
- **Cost**: Cloud infrastructure costs scale with usage, making large deployments expensive.
- **Vendor lock-in**: Switching platforms requires migrating data and retraining users.

### 1.2 Existing Solutions and Their Limitations

| Solution | Limitations |
|----------|-------------|
| Discord | Cloud-only, no E2EE, data mining, Nitro subscription required for core features |
| Slack | Cloud-only, message history limits on free tier, expensive at scale |
| Microsoft Teams | Cloud-dependent, complex infrastructure, expensive licensing |
| Matrix/Element | Federated but requires server, complex setup, no offline-first |
| TeamSpeak | Voice-only, no chat/canvas, server administration required |
| IRC/XMPP | Legacy protocols, no modern features, no offline support |
| Local file sharing | No real-time collaboration, no message persistence |

### 1.3 Architectural Goals

Libern was designed to address these limitations with the following goals:

1. **Fully offline-first**: All features must work without internet connectivity.
2. **Zero infrastructure**: Single binary, no servers, no cloud.
3. **Privacy by default**: All data stays on the user's machine.
4. **Tamper-evident audit trail**: Cryptographic ledger for all actions.
5. **Peer-to-peer sync**: LAN-based data sharing without central coordination.
6. **Modular AI**: Local AI assistant that respects privacy.
7. **Extensible**: Plugin system for community contributions.

---

## 2. Decision: Technology Stack

### 2.1 Decision: Tauri v2 over Electron

| Criteria | Tauri | Electron |
|----------|-------|----------|
| Binary size | ~5MB (without bundle) | ~150MB+ |
| RAM usage | ~50MB idle | ~200MB+ idle |
| Backend language | Rust (safe, fast) | JavaScript (Node.js) |
| Security model | Capability-based | Same-origin policy |
| Native API access | Direct via Rust | IPC bridge |
| Build target | Single binary | Requires Node.js runtime |

**Decision**: Use Tauri v2 for the desktop shell.

**Rationale**: Tauri produces significantly smaller binaries, uses less memory, and leverages Rust's safety guarantees. The capability-based permission model aligns with Libern's security requirements.

**Consequences**:
- Positive: Smaller distribution, lower resource usage, safer code.
- Positive: Direct access to system APIs (SQLite, crypto, audio) without IPC overhead.
- Negative: Requires Rust expertise for backend contributions.
- Negative: Smaller ecosystem compared to Electron.

### 2.2 Decision: SQLite (rusqlite) over tauri-plugin-sql

**Decision**: Use rusqlite directly instead of the Tauri SQL plugin.

**Rationale**:
- Full control over SQLite features: WAL mode, FTS5, custom functions.
- Transactional integrity for CRDT merges.
- Direct access from Rust commands without serialize/deserialize through JS.
- Better for complex queries (ledger verification, permission checks).
- No plugin dependency risk.

### 2.3 Decision: Ed25519 over RSA or ECDSA

**Decision**: Use Ed25519 (Edwards-curve Digital Signature Algorithm) for identity signing.

**Rationale**:
- Smaller keys (32-byte public, 64-byte private) vs RSA (2048+ bits).
- Faster signing and verification (approximately 10x faster than RSA).
- Constant-time execution (no timing side channels).
- Well-audited implementation via ed25519-dalek crate.
- Post-quantum resistance considerations: Ed25519 is not quantum-resistant, but the .aioss format supports algorithm migration.

### 2.4 Decision: SHA3-256 over SHA-256

**Decision**: Use SHA3-256 (Keccak-based) for hash chaining.

**Rationale**:
- Immune to length extension attacks (unlike SHA-256).
- NIST-standardized alternative to SHA-2.
- Future-proof: no known practical attacks.
- Similar performance to SHA-256 on modern hardware.

### 2.5 Decision: CRDT (LWW Element Set) over OT or Git-like Merge

**Decision**: Use Last-Write-Wins Element Set CRDT for conflict resolution.

**Rationale**:
- LWW is the simplest CRDT that guarantees convergence.
- HLC timestamps provide causal ordering without clock sync.
- No central coordinator needed for merge decisions.
- Simpler to implement correctly than Operational Transformation.
- Lower memory overhead than full git-like DAG merge.

**Consequences**:
- Positive: Simple, provably convergent merge.
- Positive: No central server needed.
- Negative: Last-write-wins means concurrent edits may lose data (acceptable for chat).
- Negative: Not suitable for fine-grained collaborative editing (use whiteboard's Fabric.js for that).

---

## 3. Decision: Data Architecture

### 3.1 Decision: SQLite + .aioss Dual Storage

**Decision**: Store operational data in SQLite and maintain a separate cryptographic ledger in .aioss format.

| Store | Purpose | Format |
|-------|---------|--------|
| SQLite | Fast queries, CRUD operations, search | Relational (tables, indexes, FTS5) |
| .aioss | Immutable audit trail, compliance, verification | Binary hash chain (128-byte header, 256-byte entries) |

**Rationale**:
- SQLite provides fast, flexible querying for day-to-day operations.
- .aioss provides the tamper-evident, cryptographically verifiable audit trail.
- Separation of concerns: operational data can be deleted/edited without affecting the audit trail.
- .aioss can be verified independently of Libern (by auditors, regulators).

### 3.2 Decision: UUID v4 over Sequential IDs

**Decision**: Use UUID v4 for all entity identifiers.

**Rationale**:
- No central ID generation needed (offline-friendly).
- No collision risk for practical deployment sizes.
- No information leakage about entity count or creation order.
- Standard format supported across all platforms.

### 3.3 Decision: HLC Timestamps over Wall Clock

**Decision**: Use Hybrid Logical Clocks for event ordering.

**Structure**: 64-bit value: 48-bit physical (milliseconds) + 16-bit logical counter.

**Rationale**:
- Provides causal ordering without NTP synchronization.
- Physical component allows human-readable timestamps.
- Logical component resolves concurrent events.
- Monotonic: always increasing, never goes backward.

---

## 4. Decision: Network Architecture

### 4.1 Decision: LAN-only P2P for MVP

**Decision**: Restrict P2P synchronization to LAN (mDNS discovery + WebSocket transport) for the MVP release.

**Rationale**:
- Simplifies initial implementation significantly.
- Avoids NAT traversal complexity (STUN/TURN/ICE).
- LAN provides low latency and high bandwidth for sync.
- mDNS is zero-configuration (no server needed).
- WAN P2P support is planned for future releases.

### 4.2 Decision: WebSocket over gRPC or Custom Protocol

**Decision**: Use WebSocket (via tokio-tungstenite) for P2P data sync.

**Rationale**:
- Standard protocol with excellent library support.
- Works over LAN without complex configuration.
- Easy to debug (text-based framing).
- Tauri has built-in Channel support that maps well to WebSocket streams.

---

## 5. Decision: AI Architecture

### 5.1 Decision: Local AI over Cloud API

**Decision**: Run AI inference entirely on the local machine using Qwen 2.5 1.5B.

**Rationale**:
- Complete privacy: no data leaves the machine.
- Offline operation: AI works without internet.
- No recurring API costs.
- No rate limiting or usage quotas.

### 5.2 Decision: llama.cpp over ONNX Runtime or tflite

**Decision**: Use llama.cpp (via llama-cpp-2 Rust crate) for AI inference.

**Rationale**:
- Best CPU inference performance for LLMs.
- GGUF format provides efficient model storage.
- Wide model support (any GGUF model can be used).
- GPU offloading support for faster inference.

### 5.3 Decision: Pluggable Engine Architecture

**Decision**: Implement AiEngine trait with multiple implementations (MockEngine, CandleEngine).

**Rationale**:
- Graceful degradation: Liber works without a model file.
- Easy testing: MockEngine returns deterministic responses.
- Future-proof: new engines can be added without changing the command layer.
- User choice: users can choose CPU-only or GPU-accelerated inference.

---

## 6. Decision: Permission Architecture

### 6.1 Decision: Bitmask over RBAC or ACL

**Decision**: Use a 64-bit integer bitmask for permissions.

**Rationale**:
- Compact storage (single i64 column).
- Fast to compute (bitwise OR for effective permissions).
- Easy to extend (unused bits for future permissions).
- Simple to combine roles (OR all assigned role bitmasks).

### 6.2 Current Permission Bits (14 defined)

Bits 0-14 cover: MANAGE_SERVER, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, SEND_MESSAGES, READ_MESSAGES, CONNECT_VOICE, SPEAK, MUTE_MEMBERS, CREATE_INVITE, KICK_MEMBERS, ATTACH_FILES, EMBED_LINKS, DRAW_WHITEBOARD, MANAGE_WHITEBOARD.

50 bits remain for future expansion (channel-specific permissions, custom roles, etc.).

---

## 7. Decision: Whiteboard Architecture

### 7.1 Decision: Fabric.js over Custom Canvas or Excalidraw

**Decision**: Use Fabric.js for the whiteboard canvas.

**Rationale**:
- Mature library with comprehensive drawing tools.
- Built-in event handling for stroke capture.
- Export to SVG/PNG built-in.
- Infinite canvas via viewport transforms.
- CRDT integration: serialize strokes, sync via HLC-timestamped payloads.

---

## 8. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CRDT data loss in edge cases | Low | High | Extensive testing with simulated conflicts; HLC ensures causal ordering |
| Audio latency on LAN | Medium | Medium | Opus at low bitrate (16-32kbps); buffer tuning |
| SQLite contention with P2P sync | Low | Medium | WAL mode; connection pooling |
| Large canvas performance | Medium | Low | Level-of-detail rendering; viewport culling |
| P2P NAT traversal complexity | High | Medium | Deferred to post-MVP; LAN-only for now |
| Build times (Rust + C++) | High | Low | sccache; incremental compilation; pre-built llama.cpp binaries |
| AI model download size (~1.1GB) | Medium | Low | Download on first launch; resumable download; skip option |
| Private key security | Low | Critical | Platform-specific encryption (DPAPI, Keychain); user education |

---

## 9. Alternatives Considered

### 9.1 Why not Discord?

Discord requires constant internet, stores all data on their servers, has no E2EE, monetizes through data collection and Nitro subscriptions, and has file size limits and message history limits on free tier.

### 9.2 Why not Matrix?

Matrix requires a homeserver, has complex setup, does not support offline-first operation well, and has a heavy client (Element).

### 9.3 Why not a custom Electron app?

Electron produces large binaries (150MB+), uses significant RAM (200MB+ idle), and has a less secure security model compared to Tauri.

### 9.4 Why not a web app?

Web apps cannot operate offline without service workers (limited), cannot access native APIs (microphone, file system) without permission prompts, and require a web server.

---

## 10. Implementation Phases

### Phase 0: Scaffolding (3-5 days)
Tauri + React scaffolding, Tailwind dark theme, app shell layout, SQLite initialization, first Tauri commands.

### Phase 1: Identity & Servers (5-7 days)
Ed25519 keypair generation, user CRUD, server CRUD, channel management.

### Phase 2: Chat System (7-10 days)
Message CRUD, markdown rendering, file attachments, search, reactions, pins.

### Phase 3: Roles & Permissions (4-5 days)
Role CRUD, permission bitmask enforcement, invite codes.

### Phase 4: CRDT & P2P Sync (7-10 days)
HLC implementation, LWW element set, mDNS discovery, WebSocket transport, sync protocol.

### Phase 5: Whiteboard (5-7 days)
Fabric.js canvas, drawing tools, stroke sync via CRDT.

### Phase 6: Voice Chat (5-7 days)
Opus codec, microphone capture, UDP broadcast, audio mixer.

### Phase 7: AI Engine (ongoing)
MockEngine, CandleEngine, Qwen integration, summarization, moderation, RAG.

### Phase 8: Polish (ongoing)
Error boundaries, keyboard shortcuts, settings, i18n, performance, accessibility.

---

## 11. Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-15 | Tauri v2 over Electron | Binary size, RAM, Rust safety |
| 2026-03-15 | Ed25519 over RSA | Performance, key size |
| 2026-03-15 | SQLite + .aioss dual storage | Operational speed + audit trail |
| 2026-03-20 | CRDT LWW over OT | Simplicity, convergence guarantee |
| 2026-03-20 | UUID v4 over sequential | Offline-friendly, no central ID gen |
| 2026-03-25 | LAN-only P2P for MVP | Avoid NAT traversal complexity |
| 2026-04-01 | Local AI over cloud API | Privacy, offline, cost |
| 2026-04-01 | Fabric.js for whiteboard | Mature, feature-rich |
| 2026-04-05 | Bitmask permissions over RBAC | Compact, fast, extensible |
| 2026-04-10 | HLC over wall clock | Causal ordering without NTP |

---

## 12. References

- ADL-001: CRDT Selection
- ADL-002: Cryptographic Primitives
- ADL-003: Storage Architecture
- ADL-004: Network Protocol
- ADL-005: AI Engine Architecture
- ADL-006: Permission System
- LIBERN_BUILD_PLAN.md — Implementation plan
- AI_FEATURES_PLAN.md — AI subsystem design

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

## 13. Architectural Principles

The following architectural principles guide all decision-making in the Libern project. Every decision should be evaluated against these principles:

Principle of Offline Primacy: All features must work without internet connectivity. Online features are enhancements to offline capabilities, not the other way around. This principle ensures that Libern delivers on its core promise of sovereign operation.

Principle of Zero Infrastructure: Libern must never require a server, cloud service, or external infrastructure to function. Users should be able to download a single binary and start collaborating immediately. This principle eliminates operational complexity and vendor dependency.

Principle of Cryptographic Verifiability: Every action in Libern must be cryptographically signed and hash-chained to provide tamper-evident audit trails. Users and auditors should be able to verify the integrity of any data independently.

Principle of Local Privacy: User data must remain on the user's machine by default. Data should only be shared with explicit user consent and through direct peer-to-peer channels. No data should ever be transmitted to third parties.

Principle of Graceful Degradation: When resources are constrained or unavailable, Libern should degrade gracefully rather than fail entirely. Features may be reduced in capability but should never become completely unavailable.

Principle of Permissionless Innovation: The open source nature of Libern means anyone can inspect, modify, and extend the software. The architecture should support plugins and extensions to enable community innovation without compromising core security.

## 14. Technology Selection Criteria

All technology choices in Libern are evaluated against these criteria:

Open Source: The technology must be available under a permissive open-source license. Proprietary dependencies are not acceptable for core functionality.

Cross-Platform: The technology must support Windows, macOS, and Linux as first-class targets. Platform-specific implementations should be isolated behind platform-agnostic interfaces.

Performance: The technology must meet or exceed performance requirements for its domain. Compromises in developer convenience are acceptable for significant performance gains.

Security: The technology must have a strong security track record with no known design-level vulnerabilities. Security-critical components must have been independently audited.

Ecosystem: The technology must have an active community, regular releases, and responsive maintenance. Abandoned or low-maintenance technologies are not acceptable for core dependencies.

Rust-First: Where comparable options exist, prefer Rust-native implementations over FFI bindings to C libraries. Rust provides memory safety guarantees that reduce the risk of security vulnerabilities.

## 15. Decision Documentation Format

All architectural decisions are documented using a consistent format that includes:

The decision ID for cross-referencing and tracking in the Architecture Decision Log. The title that clearly describes what was decided. The status indicating whether the decision is proposed, accepted, deprecated, or superseded. The date when the decision was made for chronological context.

The context section explains the problem being solved, the constraints that apply, and the factors that influenced the decision. This section should include enough information for someone unfamiliar with the project to understand why the decision was needed.

The options section lists the alternatives that were considered with brief descriptions of each. This demonstrates that the decision was made after considering multiple approaches rather than defaulting to a familiar option.

The decision section states what was chosen with specific version information where applicable.

The rationale section explains why the chosen option was selected over the alternatives. This is the most important section because it captures the reasoning that future engineers will need to understand when evaluating whether the decision should be revisited.

The consequences section lists the positive and negative implications of the decision. Both intended benefits and anticipated drawbacks should be documented honestly.

## 16. Decision Reversal Process

When a previous architectural decision needs to be reversed, follow this process:

Identify the specific decision to be reversed and the reasons why the original rationale no longer applies. Changes in technology, project requirements, or understanding of the problem domain may justify reversal.

Evaluate the impact of reversal including migration costs, compatibility breaks, and developer training requirements. A cost-benefit analysis should demonstrate that the reversal provides net positive value.

Propose the reversal as a new architecture decision with status proposed. Reference the original decision ID and explain why it is being superseded.

Seek consensus from the architecture team through the same review process as the original decision.

Document the superseded decision with a note about the new decision that replaced it and the date of reversal.

## 17. Architecture Review Board

The Libern Architecture Review Board is responsible for maintaining architectural coherence across the project. The board consists of senior engineers with deep knowledge of the Libern codebase and architecture.

The board reviews all major architectural decisions, evaluates trade-offs between competing approaches, ensures consistency across different parts of the system, identifies cross-cutting concerns that affect multiple modules, and maintains the architecture documentation including the BDR and ADL documents.

Architecture decisions are proposed as pull requests to the documentation repository. Board members review and discuss the proposal, request changes or clarifications, and ultimately approve or reject the decision. Approved decisions are merged and recorded in the Architecture Decision Log.


## 18: Technology Radar

The Libern technology radar tracks technologies that are under evaluation for future adoption. Technologies are categorized as Adopt, Trial, Assess, or Hold:

Adopt technologies are those we have decided to adopt and are actively implementing. Current adopt technologies include Tauri v2 for the desktop shell, rusqlite for database access, and ed25519-dalek for cryptographic signing.

Trial technologies are those we are actively experimenting with in a limited context. Current trial technologies include candle-core as an alternative AI inference engine to llama-cpp-2.

Assess technologies are those we are evaluating for future adoption but have not yet committed to. Current assess technologies include WAN P2P protocols for cross-LAN connectivity, WASM-based plugin systems for community extensions, and alternative audio codecs for voice chat.

Hold technologies are those we have evaluated and decided not to adopt at this time. Current hold technologies include Electron as an alternative to Tauri, MongoDB or other NoSQL databases as alternatives to SQLite, and cloud AI APIs as alternatives to local inference.

The technology radar is reviewed quarterly and updated as technologies mature and project requirements evolve.

## 19: Architecture Documentation Standards

All architecture documentation in the Libern project follows these standards:

Diagrams use the Mermaid markup language for version-controllable architecture diagrams. Diagrams are stored as .mmd files alongside the markdown documentation and rendered in the documentation viewer.

Code examples use syntax-highlighted code blocks with the appropriate language tag. Examples should be compilable or runnable where possible to ensure accuracy.

Tables present structured information consistently. All tables use the standard markdown table syntax with header rows separated by dashes.

Links reference specific files and line numbers using the file:line format for precise cross-referencing. Links to external resources use the full URL with descriptive anchor text.

Version information is included for all dependency references. When a decision is tied to a specific version of a technology, that version is documented to provide context for future decisions.

## 20: Conclusion

The Libern Business Decision Record captures the key architectural decisions that define the project's foundation. These decisions are not static; they will evolve as the project matures, as technology advances, and as user needs become better understood. However, the core principles of sovereignty, offline-first operation, and cryptographic verifiability will remain constant. Every future decision should be evaluated against these principles to ensure that Libern remains true to its mission of providing sovereign collaboration without compromise.


## 21: Libern Architecture Evolution

The Libern architecture is designed to evolve over time without breaking existing deployments. The evolution strategy includes:

Backward compatibility guarantee: All database schemas and .aioss formats are versioned. New versions are backward compatible with old data. Migration paths are documented and tested.

Feature flag system: New features are gated behind feature flags for gradual rollout and easy rollback if issues are discovered.

API versioning: Tauri command signatures are versioned through the command naming convention. Old command signatures are maintained alongside new ones during transition periods.

Documentation currency: All architecture documentation is updated when decisions change. Outdated documentation is clearly marked with a deprecation notice and reference to the current documentation.

Deprecation policy: Deprecated features are supported for at least two releases before removal. Deprecation notices are communicated through release notes and changelogs.

This evolution strategy ensures that Libern can adopt new technologies and improve its architecture without abandoning existing users or requiring disruptive migrations.

## 22: Libern Architecture Decisions Referenced

The following external architecture decisions have influenced Libern's design:

The Tauri framework's capability-based permission model influenced Libern's approach to security. Instead of relying on user confirmation dialogs, Libern uses declarative capability declarations that specify exactly which system resources the application needs.

The SQLite WAL mode influenced Libern's approach to concurrent database access. Instead of implementing a complex connection pool, Libern relies on WAL mode to allow concurrent reads during writes and serializes writes through a mutex.

The Fabric.js event system influenced Libern's approach to whiteboard stroke capture. Instead of polling for canvas changes, Libern listens for Fabric.js events and captures strokes as they are created, providing fine-grained CRDT synchronization.

The llama.cpp architecture influenced Libern's approach to AI inference. Instead of running inference in the main process, Libern spawns a separate inference thread that communicates with the main process through channels, ensuring the UI remains responsive.

These external influences are acknowledged to provide context for Libern's design decisions and to give credit to the open source projects that have informed Libern's architecture.

## 23: Decision Validation Framework

Every architectural decision in Libern is validated against a consistent framework:

| Criterion | Description | Scoring |
|-----------|-------------|---------|
| Offline compatibility | Does the decision preserve full offline operation? | Pass/Fail |
| Zero infrastructure | Does the decision eliminate or reduce server dependency? | Pass/Fail |
| Security impact | Does the decision maintain or improve security posture? | 1-5 scale |
| Performance | Does the decision meet or improve performance targets? | 1-5 scale |
| Complexity cost | Does the decision add acceptable architectural complexity? | 1-5 scale |
| Migration effort | How much existing code needs to change? | 1-5 scale |
| Community impact | How does the decision affect contributors and users? | 1-5 scale |

A decision must pass all Pass/Fail criteria and achieve a minimum average of 3.5 on scaled criteria to be accepted.

## 24: Decision Reversal Examples

### Reversal Example 1: Initial Database Choice

Initially, the team considered using `tauri-plugin-sql` for database access. This decision was reversed in favor of direct `rusqlite` usage after discovering:
- Plugin limitations with complex queries (CRDT merge, ledger verification)
- Performance overhead from serializing through JS bridge
- Plugin dependency risk (upstream changes could break Libern)

The reversal was documented as an architecture decision and implemented in Phase 0.

### Reversal Example 2: Audio Codec Evaluation

The team initially planned to use the `cpal` crate directly for audio playback. After evaluation, the decision was reversed to use Opus encoding (via the `opus` crate) for network transmission and `cpal` only for local capture/playback. This reversal added the Opus encoding layer but significantly reduced bandwidth requirements for voice chat.

## 25: Libern Architecture Decision Metrics

Track the health of the architecture decision process:

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Decisions documented | All major decisions | 11 BDRs + 15 ADLs | ✅ |
| Decision reversal rate | <20% | ~5% | ✅ |
| Time to reach decision | <2 weeks | ~1 week | ✅ |
| Contributors involved | >2 per decision | 3-5 | ✅ |
| Code references per decision | >3 | >5 | ✅ |

The architecture decision process is reviewed quarterly to ensure it remains effective as the project grows.

These practices ensure that Libern's architecture decisions are well-documented, validated, and maintainable over the project's lifetime.


## Technical Implementation Reference

### Core Rust Architecture

`ust
// libern-core/src/lib.rs
pub mod ai;
pub mod crdt;
pub mod crypto;
pub mod db;
`

### Database Schema (libern-core/src/db/schema.rs)

`sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    public_key BLOB NOT NULL,
    avatar_path TEXT,
    is_local INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL REFERENCES users(id),
    avatar_path TEXT,
    invite_code TEXT UNIQUE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS channels (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'text',
    position INTEGER NOT NULL DEFAULT 0,
    parent_id TEXT REFERENCES channels(id),
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    content_plain TEXT,
    reply_to TEXT REFERENCES messages(id),
    hlc_timestamp INTEGER NOT NULL,
    signature BLOB NOT NULL,
    edited_at INTEGER,
    deleted_at INTEGER,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color INTEGER,
    position INTEGER NOT NULL DEFAULT 0,
    permissions INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS role_assignments (
    role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, user_id)
);

CREATE TABLE IF NOT EXISTS invites (
    code TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    max_uses INTEGER,
    use_count INTEGER NOT NULL DEFAULT 0,
    expires_at INTEGER,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_conversations (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    token_count INTEGER,
    message_ref TEXT,
    created_at INTEGER NOT NULL
);
`

### Database Initialization

`ust
// libern-core/src/db/mod.rs
pub struct Database {
    pub conn: Mutex<Connection>,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self, rusqlite::Error> {
        let conn = Connection::open(db_path)?;
        conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")?;
        let db = Database { conn: Mutex::new(conn) };
        db.initialize_tables()?;
        Ok(db)
    }

    pub fn in_memory() -> Result<Self, rusqlite::Error> {
        let conn = Connection::open_in_memory()?;
        conn.execute_batch("PRAGMA foreign_keys=ON;")?;
        let db = Database { conn: Mutex::new(conn) };
        db.initialize_tables()?;
        Ok(db)
    }

    fn initialize_tables(&self) -> Result<(), rusqlite::Error> {
        let conn = self.conn.lock().unwrap();
        for stmt in schema::CREATE_TABLES {
            if let Err(e) = conn.execute(stmt, []) {
                if !e.to_string().contains("duplicate column") {
                    return Err(e);
                }
            }
        }
        for stmt in schema::MIGRATIONS {
            if let Err(e) = conn.execute(stmt, []) {
                if !e.to_string().contains("duplicate column") {
                    return Err(e);
                }
            }
        }
        Ok(())
    }
}
`

### Cryptographic Ledger

`ust
// libern-core/src/crypto/mod.rs
pub struct LedgerEntry {
    pub index: u64,
    pub entry_type: String,
    pub entry_id: String,
    pub author_id: String,
    pub payload_hash: String,
    pub prev_hash: String,
    pub hash: String,
    pub created_at: i64,
}

impl LedgerEntry {
    pub fn compute_hash(prev_hash: &str, payload_hash: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(prev_hash.as_bytes());
        hasher.update(payload_hash.as_bytes());
        hex::encode(hasher.finalize())
    }

    pub fn hash_payload(data: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(data);
        hex::encode(hasher.finalize())
    }
}

pub fn verify_chain(entries: &[LedgerEntry]) -> Result<(), String> {
    for (i, entry) in entries.iter().enumerate() {
        let expected_hash = if i == 0 {
            LedgerEntry::compute_hash("", &entry.payload_hash)
        } else {
            LedgerEntry::compute_hash(&entries[i - 1].hash, &entry.payload_hash)
        };
        if entry.hash != expected_hash {
            return Err(format!(
                "Hash mismatch at entry {}: expected {}, got {}",
                entry.index, expected_hash, entry.hash
            ));
        }
    }
    Ok(())
}
`

### CRDT Engine

`ust
// libern-core/src/crdt/mod.rs
pub struct HybridLogicalClock {
    pub physical: u64,
    pub logical: u16,
}

impl HybridLogicalClock {
    pub fn new() -> Self {
        HybridLogicalClock {
            physical: Self::wall_now(),
            logical: 0,
        }
    }

    pub fn tick(&mut self) -> u64 {
        let now = Self::wall_now();
        if now > self.physical {
            self.physical = now;
            self.logical = 0;
        } else {
            self.logical = self.logical.wrapping_add(1);
        }
        self.encode()
    }

    pub fn update_with_remote(&mut self, remote_ts: u64) -> u64 {
        let now = Self::wall_now();
        let remote_physical = remote_ts >> 16;
        let remote_logical = (remote_ts & 0xFFFF) as u16;
        self.physical = self.physical.max(now).max(remote_physical);
        if self.physical == remote_physical {
            self.logical = self.logical.max(remote_logical).wrapping_add(1);
        } else {
            self.logical = 0;
        }
        self.encode()
    }

    fn encode(&self) -> u64 {
        (self.physical << 16) | (self.logical as u64)
    }

    fn wall_now() -> u64 {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64
    }
}

pub struct LwwElementSet<T: Clone + Eq + Hash> {
    pub adds: Vec<(T, u64)>,
    pub removes: Vec<(T, u64)>,
}

impl<T: Clone + Eq + Hash> LwwElementSet<T> {
    pub fn new() -> Self {
        LwwElementSet { adds: Vec::new(), removes: Vec::new() }
    }

    pub fn add(&mut self, element: T, timestamp: u64) {
        self.adds.push((element, timestamp));
    }

    pub fn remove(&mut self, element: T, timestamp: u64) {
        self.removes.push((element, timestamp));
    }

    pub fn snapshot(&self) -> Vec<T> {
        let mut result = Vec::new();
        for (elem, add_ts) in &self.adds {
            let is_removed = self.removes.iter()
                .any(|(r, rm_ts)| r == elem && rm_ts > add_ts);
            if !is_removed && !result.contains(elem) {
                result.push(elem.clone());
            }
        }
        result
    }

    pub fn merge(&mut self, other: &LwwElementSet<T>) {
        for (elem, ts) in &other.adds {
            if !self.adds.iter().any(|(e, _)| e == elem) {
                self.adds.push((elem.clone(), *ts));
            }
        }
        for (elem, ts) in &other.removes {
            if !self.removes.iter().any(|(e, _)| e == elem) {
                self.removes.push((elem.clone(), *ts));
            }
        }
    }
}
`

### AI Engine Interface

`ust
// libern-core/src/ai/mod.rs
pub trait AiEngine: Send + 'static {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String>;
    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String>;
    fn is_loaded(&self) -> bool;
    fn model_info(&self) -> ModelInfo;
}

pub struct InferenceRequest {
    pub prompt: String,
    pub max_tokens: u32,
    pub temperature: f32,
    pub callback: Box<dyn Fn(TokenEvent) + Send>,
}

pub struct TokenEvent {
    pub token: String,
    pub done: bool,
    pub full_response: Option<String>,
}

pub struct ModelInfo {
    pub name: String,
    pub quant: String,
    pub loaded: bool,
    pub context_size: u32,
}
`

### Mock Engine Implementation

`ust
// libern-core/src/ai/engine.rs
pub struct MockEngine {
    loaded: AtomicBool,
}

impl MockEngine {
    pub fn new() -> Self {
        MockEngine { loaded: AtomicBool::new(true) }
    }
}

impl AiEngine for MockEngine {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String> {
        let canned = format!(
            "I'm Liber, your local AI assistant. I see you asked: \"{}\"",
            request.prompt.chars().take(80).collect::<String>()
        );
        for word in canned.split(' ') {
            (request.callback)(TokenEvent {
                token: format!("{} ", word), done: false, full_response: None,
            });
        }
        (request.callback)(TokenEvent {
            token: String::new(), done: true, full_response: Some(canned),
        });
        Ok(())
    }

    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String> {
        let hash: u64 = text.bytes().fold(0u64, |acc, b|
            acc.wrapping_mul(31).wrapping_add(b as u64));
        let mut emb = vec![0.0f32; 128];
        for i in 0..128 {
            emb[i] = ((hash >> (i % 8 * 8)) & 0xFF) as f32 / 255.0 - 0.5;
        }
        let mag: f32 = emb.iter().map(|x| x * x).sum::<f32>().sqrt();
        if mag > 0.0 { for e in &mut emb { *e /= mag; } }
        Ok(emb)
    }

    fn is_loaded(&self) -> bool { self.loaded.load(Ordering::Relaxed) }

    fn model_info(&self) -> ModelInfo {
        ModelInfo {
            name: "Mock (Qwen 2.5 1.5B)".into(),
            quant: "Q4_K_M".into(), loaded: true, context_size: 4096,
        }
    }
}
`

### RAG Document System

`ust
// libern-core/src/ai/rag.rs
pub fn ingest_document(
    engine: &mut Box<dyn AiEngine + Send>,
    db: &Database,
    document_id: &str,
    text: &str,
    chunk_size: usize,
) -> Result<usize, String> {
    let chunks = chunk_text(text, chunk_size);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    for (i, chunk) in chunks.iter().enumerate() {
        let embedding = engine.embed(chunk)?;
        let embedding_blob: Vec<u8> = embedding.iter()
            .flat_map(|f| f.to_le_bytes()).collect();
        conn.execute(
            "INSERT INTO document_chunks (id, document_id, chunk_index, chunk_text, embedding, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            rusqlite::params![uuid::Uuid::new_v4().to_string(), document_id,
                i as i32, chunk, embedding_blob, chrono::Utc::now().timestamp_millis()],
        ).map_err(|e| e.to_string())?;
    }
    Ok(chunks.len())
}

fn chunk_text(text: &str, chunk_size: usize) -> Vec<String> {
    text.split_whitespace()
        .collect::<Vec<_>>()
        .chunks(chunk_size)
        .map(|c| c.join(" "))
        .collect()
}
`

### Data Models

`ust
// libern-core/src/db/models.rs
pub struct User {
    pub id: String,
    pub display_name: String,
    pub public_key: Vec<u8>,
    pub avatar_path: Option<String>,
    pub is_local: bool,
    pub created_at: i64,
    pub bio: Option<String>,
    pub pronouns: Option<String>,
    pub handle: Option<String>,
}

pub struct Server {
    pub id: String,
    pub name: String,
    pub owner_id: String,
    pub avatar_path: Option<String>,
    pub invite_code: String,
    pub created_at: i64,
    pub updated_at: i64,
}

pub struct Channel {
    pub id: String,
    pub server_id: String,
    pub name: String,
    pub kind: String,
    pub position: i32,
    pub parent_id: Option<String>,
    pub created_at: i64,
}

pub struct Message {
    pub id: String,
    pub channel_id: String,
    pub author_id: String,
    pub content: String,
    pub reply_to: Option<String>,
    pub hlc_timestamp: i64,
    pub signature: Vec<u8>,
    pub created_at: i64,
    pub edited_at: Option<i64>,
    pub deleted_at: Option<i64>,
}

pub struct Role {
    pub id: String,
    pub server_id: String,
    pub name: String,
    pub color: Option<i32>,
    pub position: i32,
    pub permissions: i64,
    pub created_at: i64,
}

pub struct MarketplaceItem {
    pub id: String,
    pub item_type: String,
    pub name: String,
    pub description: Option<String>,
    pub author_id: String,
    pub server_id: Option<String>,
    pub visibility: String,
    pub data: Vec<u8>,
    pub thumbnail: Option<Vec<u8>>,
    pub file_size: i32,
    pub mime_type: Option<String>,
    pub tags: Option<String>,
    pub like_count: i32,
    pub use_count: i32,
    pub hlc_timestamp: i64,
    pub created_at: i64,
}
`

### Cargo.toml (Workspace Root)

`	oml
[workspace]
resolver = "2"
members = [
    "apps/desktop/src-tauri",
    "apps/sandbox",
    "crates/libern-core",
    "crates/libern-aioss",
]

[workspace.package]
version = "0.1.0"
edition = "2021"
authors = ["Libern Team"]
`

## Database Test Coverage

`ust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_database_initializes_in_memory() {
        let db = Database::in_memory().expect("failed to create in-memory db");
        let conn = db.conn.lock().unwrap();
        let table_count: i32 = conn
            .query_row("SELECT COUNT(*) FROM sqlite_master WHERE type='table'",
                [], |row| row.get(0)).unwrap();
        assert!(table_count >= 7, "should have at least 7 tables");
    }

    #[test]
    fn test_database_foreign_keys_enforced() {
        let db = Database::in_memory().unwrap();
        let result = db.conn.lock().unwrap().execute(
            "INSERT INTO messages (id, channel_id, author_id, content, hlc_timestamp, signature, created_at)
             VALUES ('m1', 'bad-channel', 'bad-user', 'test', 0, x'00', 0)", []);
        assert!(result.is_err(), "foreign key violation should error");
    }

    #[test]
    fn test_servers_table_insert_and_query() {
        let db = Database::in_memory().unwrap();
        let conn = db.conn.lock().unwrap();
        conn.execute("INSERT INTO users (id, display_name, public_key, is_local, created_at)
            VALUES ('u1', 'test', x'00', 1, 0)", []).unwrap();
        conn.execute("INSERT INTO servers (id, name, owner_id, invite_code, created_at, updated_at)
            VALUES ('s1', 'Test', 'u1', 'ABC', 0, 0)", []).unwrap();
        let name: String = conn.query_row(
            "SELECT name FROM servers WHERE id = 's1'", [], |row| row.get(0)).unwrap();
        assert_eq!(name, "Test");
    }
}
`

## Frontend Integration

`	ypescript
// apps/desktop/src/lib/api.ts
import { invoke } from '@tauri-apps/api/core';

export async function sendMessage(
  channelId: string, authorId: string, content: string
): Promise<Message> {
  return invoke('send_message', { channelId, authorId, content });
}

export async function getMessages(
  channelId: string, limit?: number, before?: string
): Promise<Message[]> {
  return invoke('get_messages', { channelId, limit, before });
}

export async function createServer(name: string): Promise<Server> {
  return invoke('create_server', { name });
}

export async function getServers(): Promise<Server[]> {
  return invoke('get_servers');
}
`

`	ypescript
// apps/desktop/src/stores/serverStore.ts
import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

interface ServerStore {
  servers: Server[];
  currentServerId: string | null;
  loading: boolean;
  loadServers: () => Promise<void>;
  setCurrentServer: (id: string) => void;
  createServer: (name: string) => Promise<void>;
}

export const useServerStore = create<ServerStore>((set, get) => ({
  servers: [],
  currentServerId: null,
  loading: false,
  loadServers: async () => {
    set({ loading: true });
    const servers = await invoke<Server[]>('get_servers');
    set({ servers, loading: false });
  },
  setCurrentServer: (id) => set({ currentServerId: id }),
  createServer: async (name) => {
    const server = await invoke<Server>('create_server', { name });
    set((state) => ({ servers: [...state.servers, server] }));
  },
}));
`

## Libern Architecture: Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Desktop framework | Tauri v2 | Rust backend, small binary, security |
| Database | SQLite (rusqlite) | Local-first, zero infrastructure |
| State sync | CRDT (HLC + LWW) | Offline-first, no central server |
| Cryptography | Ed25519 + SHA3-256 | Fast, secure, auditable |
| AI inference | Local (llama.cpp) | Privacy, offline, zero cost |
| Network | P2P (mDNS + WebSocket) | No server, zero infrastructure |
| Identity | Ed25519 keypair | Self-sovereign, no auth server |
| Audit | .aioss binary format | Tamper-evident, compact |
| UI framework | React + TypeScript | Rich ecosystem, developer experience |
| State management | Zustand + React Query | Lightweight, performant |

## Libern Project Structure

`
libern/
├── Cargo.toml                          # Workspace root
├── build.bat                           # Build orchestration
├── LIBERN_BUILD_PLAN.md                # Build plan documentation
├── AI_FEATURES_PLAN.md                 # AI subsystem plan
├── COMPETITIVE_EDGE.md                 # Competitive analysis
├── crates/
│   ├── libern-core/                    # Core library
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── crdt/mod.rs             # CRDT engine
│   │       ├── crypto/mod.rs           # Cryptographic primitives
│   │       ├── db/
│   │       │   ├── mod.rs              # Database initialization
│   │       │   ├── schema.rs           # Schema definition
│   │       │   └── models.rs           # Data models
│   │       └── ai/
│   │           ├── mod.rs              # AiEngine trait
│   │           ├── engine.rs           # MockEngine
│   │           ├── qwen_engine.rs      # CandleEngine
│   │           ├── pipeline.rs         # Prompt construction
│   │           ├── summarizer.rs       # Channel summarization
│   │           ├── moderator.rs        # Content moderation
│   │           ├── rag.rs              # Document RAG
│   │           ├── conversation.rs     # Context management
│   │           ├── liber_user.rs       # Liber identity
│   │           └── reward.rs           # RLHF feedback
│   └── libern-aioss/                   # .aioss format
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs
│           ├── header.rs               # 128-byte header
│           ├── entry.rs                # 256-byte entry
│           ├── ledger.rs               # Ledger types
│           ├── writer.rs               # Binary/JSON writer
│           ├── reader.rs               # Binary/JSON reader
│           ├── verify.rs               # Chain verification
│           ├── health.rs               # Health diagnostics
│           ├── event_store.rs          # Event persistence
│           ├── state_proof.rs          # Ed25519 proofs
│           ├── schedule.rs             # Session sealing
│           └── txt_log.rs              # TXT export
├── apps/
│   ├── desktop/                        # Tauri desktop app
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── lib/api.ts
│   │   │   ├── lib/ai.ts
│   │   │   ├── lib/utils.ts
│   │   │   ├── stores/serverStore.ts
│   │   │   ├── stores/messageStore.ts
│   │   │   ├── stores/uiStore.ts
│   │   │   └── types/index.ts
│   │   └── src-tauri/
│   │       ├── Cargo.toml
│   │       ├── tauri.conf.json
│   │       ├── build.rs
│   │       └── src/
│   │           ├── main.rs
│   │           ├── lib.rs
│   │           └── commands/
│   │               ├── mod.rs
│   │               ├── server.rs
│   │               ├── channel.rs
│   │               ├── message.rs
│   │               ├── user.rs
│   │               ├── role.rs
│   │               ├── ai.rs
│   │               ├── xp.rs
│   │               ├── stats.rs
│   │               └── stars.rs
│   └── sandbox/                        # 3D Boxel engine
│       ├── Cargo.toml
│       └── src/
│           ├── main.rs
│           ├── liber.rs
│           ├── world.rs
│           ├── player.rs
│           ├── character.rs
│           ├── camera.rs
│           ├── cube.rs
│           ├── texture.rs
│           ├── audio.rs
│           ├── voice.rs
│           ├── chat.rs
│           ├── pipeline.rs
│           └── screen_share.rs
├── docs/
│   ├── README.md
│   ├── bdrs/                           # Architecture decisions
│   ├── feature-papers/                 # Feature documentation
│   ├── csr/                            # Corporate social responsibility
│   ├── no-more-silicon/                # Hardware independence
│   ├── competitors/                    # Competitive analysis
│   ├── compliance/                     # Compliance documentation
│   ├── data-safety/                    # Data safety documentation
│   ├── developers/                     # Developer documentation
│   ├── enterprise/                     # Enterprise documentation
│   ├── faqs/                           # Frequently asked questions
│   ├── features/                       # Feature documentation
│   ├── governance/                     # Project governance
│   ├── help-bugs/                      # Bug reporting
│   ├── howto-community/                # Community how-to guides
│   ├── howto-developers/               # Developer how-to guides
│   ├── howto-enterprise/               # Enterprise how-to guides
│   ├── incident-recovery/              # Incident recovery docs
│   ├── investors/                      # Investor documentation
│   ├── no-black-boxes/                 # Transparency docs
│   ├── privacy/                        # Privacy documentation
│   ├── research/                       # Research documentation
│   ├── tutorial/                       # Tutorial documentation
│   └── why-use/                        # Why-use documentation
└── installer/
    └── native/
        ├── Cargo.toml
        ├── build.rs
        └── src/
            ├── main.rs
            ├── lib.rs
            ├── app.rs
            ├── state.rs
            ├── theme.rs
            ├── widgets.rs
            ├── system.rs
            ├── downloader.rs
            └── screens/
                ├── mod.rs
                ├── splash.rs
                ├── check.rs
                ├── download.rs
                ├── install.rs
                ├── elevation.rs
                ├── complete.rs
                └── error.rs
`

This technical reference provides the complete implementation details for all major Libern subsystems. Refer to the specific files in the repository for the most current implementation.
