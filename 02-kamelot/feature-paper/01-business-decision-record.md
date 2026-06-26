                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# Business Decision Record — Complete Architecture Rationale

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [BDR-001: Rust over C/C++](#bdr-001-rust-over-cc)
2. [BDR-002: Qdrant over Alternative Vector Databases](#bdr-002-qdrant-over-alternative-vector-databases)
3. [BDR-003: Local AI (Ollama/Qwen) over Cloud API](#bdr-003-local-ai-ollamaqwen-over-cloud-api)
4. [BDR-004: Native Rust GPU UI over Electron](#bdr-004-native-rust-gpu-ui-over-electron)
5. [BDR-005: Flat Store over Hierarchical Filesystem](#bdr-005-flat-store-over-hierarchical-filesystem)
6. [BDR-006: Self-Hosted over SaaS](#bdr-006-self-hosted-over-saas)
7. [Summary Decision Matrix](#summary-decision-matrix)
8. [Cross-Cutting Concerns](#cross-cutting-concerns)
9. [Decision Log](#decision-log)

---

## BDR-001: Rust over C/C++

### Context

Kamelot requires a systems-level programming language capable of high-performance I/O, direct memory management, and cross-platform compilation. The core must handle FUSE/WinFSP interactions, kernel-level or near-kernel filesystem operations, vector database client integration, and GPU-accelerated rendering — all while maintaining strict security guarantees for encrypted data-at-rest.

The founding team evaluated C (C11), C++ (C++20), and Rust (edition 2021). Additional consideration was given to Go and Zig as darker horses.

### Options Considered

| Option | Strengths | Weaknesses |
|--------|-----------|------------|
| **Rust** | Memory safety without GC, zero-cost abstractions, rich type system, Cargo ecosystem, cross-compilation | Learning curve, compile times, immature GPU ecosystem |
| **C11** | Universal ABI, minimal runtime, every platform supports it | No memory safety, manual memory management, no package ecosystem, slow development velocity |
| **C++20** | RAII, templates, huge ecosystem, GPU compute via CUDA/C++ AMP | Unsafe by default, ABI instability, complex build systems, historical security baggage |
| **Go** | Fast compilation, goroutines, simple concurrency | GC pauses at scale, no FUSE-level performance guarantees, CGo FFI overhead |
| **Zig** | C-ABI compatible, comptime, no hidden control flow | Too immature for production filesystem work, tiny ecosystem, limited library support |

### Decision

Adopt Rust as the sole implementation language for all Kamelot components: the core daemon, FUSE/WinFSP driver, CLI tools, GPU UI renderer, and all library crates.

### Rationale

1. **Memory safety at the filesystem layer is non-negotiable.** A single buffer overflow in a filesystem driver can corrupt the entire disk. Rust's ownership model eliminates entire classes of vulnerabilities at compile time. C and C++ have had 50 years to solve memory safety and have not. The NSA, Microsoft, and Google all now recommend Rust for new systems-level infrastructure.

2. **Cross-compilation without pain.** Kamelot must ship on Linux (x86_64, aarch64), Windows (x86_64, aarch64), and macOS (x86_64, aarch64, Apple Silicon). Rust's target-triple system and `cross` tooling make this straightforward. C/C++ cross-compilation for six targets requires per-platform toolchains, sysroots, and endless autotools/bazel/CMake configuration.

3. **Cargo is the best package manager in systems programming.** The ability to declare `qdrant-client = "1.13"` and get a reproducible, auditable dependency tree is transformative. C/C++ still relies on vcpkg, Conan, system package managers, or git submodules — none of which handle transitive dependency resolution at Cargo's level.

4. **Ecosystem velocity.** Key dependencies — `clap` (CLI), `serde` (serialization), `tokio` (async runtime), `tracing` (structured logging), `wgpu` (GPU compute), `vello` (vector rendering) — are mature, well-maintained, and idiomatic. The Rust ecosystem for vector databases, AI inference clients, and encrypted storage is growing rapidly.

5. **Fearless concurrency.** The Kamelot daemon must handle concurrent FUSE requests, Qdrant queries, model inference, and ledger writes. Rust's `Send + Sync` guarantees prevent data races at compile time — a class of bug that routinely plagues C/C++ filesystem implementations.

6. **Binary size and startup time.** A release-compiled Kamelot daemon is approximately 6–8 MB stripped. Startup is sub-100ms. Go binaries are typically 2–3x larger with noticeable GC warm-up. C binaries are smaller but lack safety guarantees.

### Consequences

**Positive:**
- Zero memory-safety CVEs in audited deployments (target)
- 6–8 MB statically linked binary with no runtime dependencies
- Confident concurrency: no data race bugs in production
- Rapid prototyping via Cargo's dependency ecosystem

**Negative:**
- Steeper hiring funnel: Rust developers are rarer than C++ developers
- Compile times: full clean build is 8–12 minutes; incremental is 30–60 seconds
- Some platform-specific FFI (WinFSP, libfuse3) requires `unsafe` blocks — these are isolated and heavily audited
- GPU UI stack (wgpu + Vello) is Rust-first but still maturing

---

## BDR-002: Qdrant over Alternative Vector Databases

### Context

Kamelot's core innovation is semantic vector search over files. Every file is embedded into a high-dimensional vector space, and queries are converted to vectors that are matched via cosine similarity. The vector database is the heart of the retrieval engine — it must be fast, reliable, and sovereign.

### Options Considered

| Option | Type | Strengths | Weaknesses |
|--------|------|-----------|------------|
| **Qdrant** | Self-hosted, Rust | Open core, no gRPC limits, built-in filtering, hardware-efficient, snapshot API | Requires separate process, limited Kubernetes-native features in free tier |
| **Pinecone** | SaaS | Fully managed, fast, good SDK | No self-host option, data leaves your network, cost at scale, gRPC rate limits |
| **Weaviate** | Self-hosted / Cloud | GraphQL API, hybrid search, modules ecosystem | Java/Go stack, heavy resource footprint, complex setup |
| **Milvus** | Self-hosted | Cloud-native, distributed, GPU acceleration | Docker Compose with 5+ services, high memory usage, complex operations |
| **Chroma** | Embedded, Python | Simple API, runs in-process | Python-only, no production persistence, no filtering, not designed for 1M+ vectors |
| **LanceDB** | Embedded, Rust | Embedded, fast columnar storage | Early stage, limited query functionality, no built-in networking |
| **pgvector** | PostgreSQL extension | Leverages existing Postgres | Slower than dedicated vector DBs, poor at 1M+ scale, no native filtering on HNSW |
| **FAISS** | Library (index) | Blazing fast, GPU support | Not a database (no persistence, no CRUD, no filtering, no networking) |

### Decision

Use **Qdrant** (self-hosted) as the primary vector database, with a pluggable backend trait that allows alternative implementations.

### Rationale

1. **Self-hosted sovereignty.** Qdrant is the only top-tier vector database that offers a genuinely capable free self-hosted tier without artificial limits. Pinecone and Weaviate Cloud require data to leave your network. Kamelot's zero-knowledge architecture demands that no vector data ever transits a third-party network.

2. **Written in Rust.** Qdrant shares our language stack. This confers several advantages: we can audit the source, contribute patches, and understand the performance characteristics intimately. The client library (`qdrant-client`) is a first-class Rust crate with zero-cost abstractions.

3. **No gRPC limits.** Pinecone and Weaviate both enforce gRPC message size limits that become problematic when querying with large batch payloads. Qdrant's gRPC API has no hard-coded limits — crucial for bulk ingest of 100K+ files.

4. **Hardware efficiency.** Qdrant's HNSW implementation is among the most memory-efficient in the industry. A single node with 8 GB RAM can index 1M+ 768-dimensional vectors with sub-100ms query latency. Milvus requires 3x the memory for comparable performance.

5. **Built-in payload filtering.** Qdrant supports rich payload filtering on ingest and query: file extension, size ranges, modification timestamps, MIME types, custom tags. This enables hybrid queries like "show me PDFs from Q2 that contain financial data" — combining vector similarity with structured filters.

6. **Snapshot API for backup.** Qdrant's snapshot mechanism allows point-in-time backup and restore of the entire vector index without downtime. This integrates directly with Kamelot's disaster recovery procedures.

### Consequences

**Positive:**
- Full data sovereignty: vectors never leave the host
- Sub-100ms query latency at 1M+ files
- Rich payload filtering enables hybrid search
- Snapshot-based backup and recovery
- Rust-native stack simplifies debugging

**Negative:**
- Requires running a separate process (Docker or bare metal)
- Qdrant's free tier lacks sharding — single node limit of ~2M vectors (adequate for Kamelot v1)
- No built-in embedding generation (Kamelot handles this via Ollama)
- Operational overhead of monitoring a second service

---

## BDR-003: Local AI (Ollama/Qwen) over Cloud API

### Context

Embedding generation is the process of converting file content and user queries into vector representations. The quality of these embeddings directly determines retrieval accuracy. The team evaluated whether to use cloud-hosted embedding APIs or run models locally.

### Options Considered

| Option | Privacy | Latency | Cost | Offline | Quality |
|--------|---------|---------|------|---------|---------|
| **Ollama + Qwen 2 VL (local)** | Full | 50–300ms | $0 | Yes | Good |
| **OpenAI text-embedding-3-large** | None | 100–500ms | $0.13/1M tokens | No | Excellent |
| **Google Gemini embedding** | None | 150–600ms | $0.04/1M tokens | No | Very Good |
| **Cohere embed-english-v3.0** | None | 100–400ms | $0.10/1M tokens | No | Very Good |
| **Mock/dummy embeddings** | Full | 0.1ms | $0 | Yes | Terrible |
| **Hugging Face transformers (local, direct)** | Full | 200–2000ms | $0 | Yes | Good |
| **llama.cpp (local, direct)** | Full | 100–800ms | $0 | Yes | Good |

### Decision

Default to **Ollama + Qwen 2 VL (Q4 quantized)** for production deployments, with a mock embedding backend for development and testing.

### Rationale

1. **Zero data exfiltration.** Embedding cloud APIs require sending file contents to a third-party server. For files containing proprietary code, financial data, personal information, or trade secrets, this is unacceptable. Kamelot's value proposition — "your files never leave your machine" — is incompatible with cloud embedding APIs.

2. **Offline operation.** Kamelot is designed for environments where internet connectivity is intermittent or absent: field research, air-gapped government networks, submarines, remote construction sites. Cloud APIs would render the product useless in these scenarios.

3. **Cost at scale.** For a user indexing 500,000 files with average size 50 KB, embedding at OpenAI pricing would cost approximately $3,250 (25 billion tokens at $0.13/1M). Over a year of re-indexing and query embedding, costs exceed $10,000. Local inference is free after the one-time hardware cost.

4. **Ollama provides operational simplicity.** Ollama wraps model download, quantization, GPU acceleration, and API serving into a single `ollama run` command. Direct use of Hugging Face transformers or llama.cpp requires significantly more configuration and is harder to automate.

5. **Qwen 2 VL offers multimodal understanding.** Unlike pure text embedding models, Qwen 2 VL can understand images, diagrams, screenshots, and scanned documents. This is critical for Kamelot's promise of finding any file by semantic content — including architectural diagrams, whiteboard photos, and UI mockups.

6. **Mock backend enables CI/CD.** The mock embedding backend returns deterministic random vectors. This allows integration tests to run in CI environments without GPU, without downloading 4 GB models, and without Ollama. Developers can iterate on the search pipeline without neural network overhead.

### Consequences

**Positive:**
- Absolute privacy: file contents never leave the host
- Free inference after hardware purchase
- Offline capability: works on airplanes, boats, bunkers
- Multimodal understanding: images, PDFs, diagrams
- Mock backend for rapid development and CI

**Negative:**
- Requires 4–8 GB VRAM or 16 GB system RAM for Qwen 2 VL Q4
- Embedding quality is lower than state-of-the-art cloud models (OpenAI, Cohere)
- First-time setup requires downloading 4 GB+ model weights
- Slower than cloud APIs on CPU-only hardware (300–800ms vs 100–200ms)
- Ollama is a separate process that must be managed

---

## BDR-004: Native Rust GPU UI over Electron

### Context

Kamelot requires a graphical user interface for search results, file browsing, the Omnibox, Canvas, and Graphify visualization. The team evaluated building a web-based UI in Electron/Tauri versus native Rust GPU UI using wgpu and Vello.

### Options Considered

| Option | Binary Size | RAM Usage | Performance | Development Speed | GPU Access |
|--------|-------------|-----------|-------------|-------------------|------------|
| **Electron** | 150–250 MB | 200–500 MB | Moderate | Fast | Indirect (CSS) |
| **Tauri (webview)** | 5–15 MB | 100–300 MB | Good | Medium | Indirect |
| **egui (wgpu)** | 3–5 MB | 20–50 MB | Very Good | Medium | Direct |
| **Vello + wgpu + Winit** | 2–4 MB | 15–30 MB | Excellent | Slow | Direct (compute) |
| **Slint** | 3–8 MB | 25–60 MB | Good | Medium | Indirect |
| **Druid / Xilem** | 3–6 MB | 20–40 MB | Very Good | Slow | Direct |
| **IMGUI (C++)** | 1–2 MB | 10–20 MB | Excellent | Slow | Direct |

### Decision

Build the Kamelot UI using **Vello** (vector graphics renderer) on **wgpu** (GPU abstraction) with **Winit** (windowing). This is the **native Rust GPU UI** stack.

### Rationale

1. **10x performance over Electron.** Vello renders vector graphics directly on the GPU using compute shaders, achieving 60+ FPS with 100,000+ vector elements. Electron in the same scenario drops to 6–12 FPS. The Omnibox and Canvas require smooth real-time rendering of file thumbnails, previews, and graph layouts.

2. **1/100th the RAM usage.** An Electron app starts at 200 MB and climbs rapidly with complexity. Vello + wgpu + Winit idles at 15–30 MB. On a system with 8 GB RAM, this means the UI uses 0.2% of available memory instead of 6%.

3. **15 MB binary vs 150+ MB.** Electron bundles Chromium, Node.js, and hundreds of npm packages. Vello/wgpu/Winit statically link into a 2–4 MB binary plus 10 MB of optional GPU shader cache.

4. **Direct GPU access for Canvas and Graphify.** The Canvas feature renders 2D spatial layouts of files. Graphify renders interactive relationship graphs between files. Both require direct GPU compute access. Electron forces these through WebGL or Canvas2D, which abstract over the GPU and add latency.

5. **No JavaScript dependency chain.** Electron/Tauri apps pull in 1,000+ npm dependencies with an average of 80+ known vulnerabilities per production Electron app. Rust's dependency tree is auditable, typed, and compile-time checked.

6. **Vello's compute-shader architecture.** Unlike traditional vector renderers that rasterize on the CPU, Vello uses compute shaders to render on the GPU directly. This means the UI rendering does not compete with the CPU for filesystem operations or embedding inference.

### Consequences

**Positive:**
- 15–30 MB RAM idle, 60+ FPS at all times
- 6 MB binary, sub-second startup
- Direct GPU access for advanced visualization features
- No JavaScript dependency vulnerabilities
- Consistent look and feel across all three platforms

**Negative:**
- Significantly more development time than Electron/Tauri
- UI iteration requires Rust compilation (no hot-reload of CSS/HTML)
- Smaller community for UI widgets — must build custom components
- Vello is pre-1.0 and breaking API changes are expected
- Accessibility (screen readers, high-contrast) must be manually implemented

---

## BDR-005: Flat Store over Hierarchical Filesystem

### Context

Traditional filesystems use hierarchical directory trees with inodes, dentries, and directory entries. Kamelot inverts this model: every file is stored as an encrypted blob in a flat namespace, identified by an inode number. The hierarchical view is synthesized on-the-fly via FUSE/WinFSP.

### Options Considered

| Model | Encryption | Fragmentation | Lookup Speed | Backups | Complexity |
|-------|------------|---------------|--------------|---------|------------|
| **Flat store (Kamelot)** | Trivial (per-inode AEAD) | None | O(1) hash lookup | Append-only ledger | Low |
| **Traditional hierarchical** | Complex (directory-level, file-level, mixed) | Significant | O(log n) B-tree | Snapshots, incremental | High |
| **Content-addressed (IPFS-like)** | Built into content hashes | None | O(1) hash lookup | Git-like | Medium |
| **Relational database** | Column/row level | N/A | O(log n) index | SQL dump | High |
| **Object store (S3-compatible)** | Server-side or client | None | O(1) key lookup | Replication | Medium |

### Decision

Use an **encrypted flat store** where each file is stored as a separate encrypted blob keyed by inode number. The .aioss ledger provides append-only metadata tracking.

### Rationale

1. **Simpler encryption.** In a flat store, each file is independently encrypted with XChaCha20-Poly1305 AEAD. The key is derived from a master key plus the inode number (KDF). There are no directory-level keys, no permission propagation, no complex key hierarchies. Each file's encryption is atomic, testable, and auditable.

2. **No fragmentation.** Traditional filesystems suffer from fragmentation as files are created, deleted, and resized across the disk. The flat store creates each file as a contiguous blob. Deletion simply removes the entry from the ledger and marks the blob as reclaimable. There is no fragmentation because there are no directory trees to maintain.

3. **O(1) lookups.** Given an inode number, the store computes the storage path via a simple hash function: `SHA256(inode)[0:2]/SHA256(inode)[2:4]/SHA256(inode)`. This is a constant-time operation regardless of the total number of files. Hierarchical filesystems require B-tree traversals that degrade as the directory grows.

4. **Atomic backups via append-only ledger.** The .aioss ledger is an append-only sequence of metadata entries: inode created, file written, file renamed, file deleted. To back up, you export the ledger and the blob store. Both are sequential and parallelizable. Restore is a replay of the ledger. Traditional filesystem backups must snapshot tree state and handle concurrent modifications.

5. **Immutable history.** The ledger provides a complete history of every file operation. This enables point-in-time rollback, ransomware recovery (revert to pre-encryption state), and full audit trails. Hierarchical filesystems with journaling provide crash recovery but not user-visible rollback.

### Consequences

**Positive:**
- Each file encrypted independently with strong AEAD
- O(1) lookup regardless of store size
- Zero fragmentation over time
- Append-only ledger provides full history and rollback
- Backups are simple sequential copies of ledger + blobs
- No directory tree corruption (there is no tree)

**Negative:**
- All directory structure is synthesized — adds complexity to FUSE driver
- No native "move" operation (rename requires ledger append, data stays in place)
- Duplicate detection requires content hashing (not inherent in the model)
- Deleting a file does not reclaim disk space until blob garbage collection runs
- Users cannot browse the flat store directly (must go through FUSE or CLI)

---

## BDR-006: Self-Hosted over SaaS

### Context

The fundamental architectural decision: should Kamelot run as a cloud service with a thin client, or as entirely self-hosted software that the user installs and controls?

### Options Considered

| Model | Privacy | Cost to 1M files | Internet Required | Vendor Lock-in | User Control |
|-------|---------|-------------------|-------------------|----------------|--------------|
| **Self-hosted (Kamelot)** | Complete | $0 (your hardware) | No | None | Total |
| **SaaS cloud** | Zero (provider sees all) | $500–2000/month | Yes | Severe | None |
| **Hybrid (local client, cloud index)** | Partial (metadata in cloud) | $100–500/month | Yes | Medium | Partial |
| **P2P network** | High | $0 (shared nodes) | Yes | Low | Medium |

### Decision

Kamelot is **self-hosted only**. There is no cloud service. The user installs, configures, and controls all components on their own hardware.

### Rationale

1. **Zero-knowledge architecture is absolute.** The entire value proposition of Kamelot — "your files, your intelligence, your sovereignty" — is predicated on the user being the sole controller of their data. A SaaS model would violate this at the architectural level, regardless of encryption claims.

2. **Compliance ownership.** Organizations handling HIPAA, GDPR, ITAR, PCI-DSS, or SOC 2 data cannot use SaaS that processes or stores protected data without extensive BAA agreements, DPAs, and audits. Self-hosted Kamelot inherits the compliance posture of the underlying infrastructure — the organization maintains full control.

3. **No subscription dependency.** A user who installs Kamelot in 2026 can continue using it indefinitely without paying a subscription, even if the company ceases operations. SaaS models create existential dependency on the provider's continued operation and pricing benevolence.

4. **Cost efficiency at scale.** Cloud SaaS costs scale linearly with data volume. Self-hosted storage costs are a one-time hardware investment. For power users with 1M+ files (500 GB+), SaaS pricing at $0.10–0.50/GB/month becomes $600–$3,000/month. Self-hosted is a single $500 SSD.

5. **Latency and availability.** Cloud SaaS requires internet connectivity and introduces network latency to every operation. Self-hosted Kamelot operates at filesystem latency — microseconds for metadata, milliseconds for queries — and is available as long as the machine is running.

6. **Business model alignment.** Kamelot's revenue comes from professional support, enterprise licenses (compliance features, audit logging, SSO), and consulting — not from data monetization or subscriptions. This aligns the business incentives with user sovereignty.

### Consequences

**Positive:**
- Absolute user privacy and data sovereignty
- No vendor lock-in: data is stored in open formats (.aioss, flat blobs)
- No subscription required for core functionality
- Compliance is inherited from user's infrastructure
- Works fully offline

**Negative:**
- User must manage their own stack (Kamelot daemon, optional Qdrant, optional Ollama)
- No centralized support infrastructure (must rely on community or paid support)
- No built-in backup service (user must configure their own)
- Feature updates require manual installation
- No automatic threat intelligence feeds

---

## Summary Decision Matrix

| Decision | Chosen Option | Runner-up | Key Differentiator | Risk Level |
|----------|---------------|-----------|--------------------|------------|
| Language | Rust | C++20 | Memory safety + Cargo | Low |
| Vector DB | Qdrant (self-hosted) | LanceDB | Payload filtering + snapshots | Low |
| AI Backend | Ollama + Qwen 2 VL | Mock (dev) | Privacy + multimodality | Medium |
| UI Framework | Vello + wgpu + Winit | Tauri | 10x perf, 1/100th RAM | High (immature) |
| Storage Model | Encrypted flat store | Content-addressed | Simpler encryption, O(1) | Low |
| Deployment Model | Self-hosted only | Hybrid | Absolute sovereignty | Medium |

**Overall risk assessment across all BDRs:**
- **Low risk**: Rust, Qdrant, flat store — proven technologies with solid track records
- **Medium risk**: Local AI (model quality gap vs cloud), self-hosted (user ops burden)
- **High risk**: Native Rust GPU UI (Vello pre-1.0, custom widget development, small community)

The high risk of the UI stack is accepted because the performance and memory benefits are central to the product vision, and the architecture allows a fallback to a CLI-only or Tauri-based UI if Vello proves untenable.

---

## Cross-Cutting Concerns

### Performance

All architecture decisions optimize for the North Star Metric: **seconds from thought to file**. Rust's zero-cost abstractions, Qdrant's hardware-efficient HNSW, local AI's sub-second inference, GPU UI's smooth rendering, and the flat store's O(1) lookups all contribute to the <3 second target.

### Security

Security is baked into every layer:
- **Language**: Rust's memory safety prevents buffer overflows, use-after-free, and data races
- **Encryption**: XChaCha20-Poly1305 per-file AEAD with KDF-derived keys
- **Storage**: Flat store eliminates directory-based attack surfaces
- **AI**: Local inference prevents data exfiltration via embedding APIs
- **Deployment**: Self-hosted ensures no third-party data access

### Compliance

Each decision was evaluated against HIPAA, GDPR, ITAR, PCI-DSS, and SOC 2 requirements:
- Self-hosted: organization maintains compliance posture
- Encryption: per-file AEAD meets encryption-at-rest requirements
- Audit trail: append-only .aioss ledger provides immutable audit log
- Access control: currently single-user; multi-user RBAC is on the roadmap

### Operability

Self-hosted deployment requires the user to manage:
1. Kamelot daemon (systemd/winsw/launchd)
2. Qdrant (Docker or bare metal)
3. Ollama (Docker or bare metal)

The team has created `kml init`, `kml doctor`, and `kml start` commands to automate this as much as possible, but operational complexity is higher than an all-in-one SaaS solution.

### Sustainability

Rust's energy efficiency (2–4x more energy-efficient than equivalent Python or Node.js), local AI (no datacenter energy), and the flat store's I/O efficiency contribute to Kamelot's environmental sustainability. The self-hosted model also avoids the energy overhead of cloud datacenters for non-compute workloads.

---

## Decision Log

| Date | Decision ID | Decision | Author | Rationale |
|------|-------------|----------|--------|-----------|
| 2025-11-01 | BDR-001 | Rust over C/C++ | Lois-Kleinner | Memory safety, Cargo ecosystem, cross-compilation |
| 2025-11-03 | BDR-002 | Qdrant over alternatives | Lois-Kleinner | Self-hosted sovereignty, Rust-native, payload filtering |
| 2025-11-05 | BDR-003 | Local AI over cloud API | Lois-Kleinner | Zero data exfiltration, offline operation, cost |
| 2025-11-08 | BDR-004 | Native Rust GPU UI over Electron | Lois-Kleinner | 10x performance, 1/100th RAM, direct GPU access |
| 2025-11-10 | BDR-005 | Flat store over hierarchy | 0-1.gg | Simpler encryption, O(1) lookups, rollback |
| 2025-11-12 | BDR-006 | Self-hosted over SaaS | 0-1.gg | Zero-knowledge architecture, compliance ownership |

---

## References

- [BDR-002 Implementation: Qdrant integration architecture](link)
- [BDR-003 Implementation: Ollama bridge specification](link)
- [BDR-004 Implementation: Vello UI architecture](link)
- [BDR-005 Implementation: Flat store and .aioss ledger specification](link)
- [North Star Metric documentation](02-north-star-metric.md)
- [SBOM with full dependency audit](04-software-bill-of-materials.md)

---

## Post-Decision Validation

### BDR-001 Validation (Rust)

| Criteria | Result | Evidence |
|----------|--------|----------|
| Memory safety CVEs | 0 | No memory safety vulnerabilities in production |
| Binary size | 6.8 MB | Release build with LTO |
| Compile time (full) | 9 minutes | CI builds on 8-core runner |
| Compile time (incremental) | 45 seconds | Typical developer workflow |
| Cross-platform builds | 6 targets | Linux x86_64/aarch64, Windows x86_64/aarch64, macOS x86_64/aarch64 |

### BDR-002 Validation (Qdrant)

| Criteria | Result | Evidence |
|----------|--------|----------|
| Query latency (100K) | 45ms p95 | Benchmark on RTX 3060 + NVMe |
| Memory usage (100K vectors) | 800 MB | HNSW index |
| Backup/restore | 30 seconds | Qdrant snapshot creation |
| Payload filtering | Working | File type, size, date filters |

### BDR-003 Validation (Local AI)

| Criteria | Result | Evidence |
|----------|--------|----------|
| Offline capability | Verified | Zero network calls during operation |
| Embedding quality (Top-1) | 78% | Test corpus of 10,000 diverse files |
| GPU embedding latency | 23ms p50 | Qwen 2 VL 7B Q4 on RTX 3060 |
| Mock mode reliability | 100% | CI pipeline passes with mock backend |

### BDR-004 Validation (GPU UI)

| Criteria | Result | Evidence |
|----------|--------|----------|
| RAM usage (idle) | 22 MB | Vello + wgpu + Winit |
| Render performance | 60 FPS | 1000+ search results |
| Binary size | 5.2 MB | UI component only |
| Startup time | 180ms | Cold start to render |

### BDR-005 Validation (Flat Store)

| Criteria | Result | Evidence |
|----------|--------|----------|
| O(1) lookup time | <1μs | SHA256-based path computation |
| Encryption overhead | +40 bytes/file | XChaCha20-Poly1305 AEAD |
| Storage fragmentation | 0% | Contiguous blob storage |
| Garbage collection | Working | `kml vacuum` reclaims space |

### BDR-006 Validation (Self-Hosted)

| Criteria | Result | Evidence |
|----------|--------|----------|
| Installations (v0.1 beta) | 200+ | Opt-in telemetry |
| Installation time | <5 min | Linux with package manager |
| Support requests | 45/month | Community support channels |
| Downtime reports | 2 | Both resolved within 4 hours |

---

## Revisiting Decisions: When to Reconsider

### Triggers for BDR Re-evaluation

1. **New technology availability**: A superior vector database, AI model, or UI framework becomes available
2. **User feedback patterns**: Consistent complaints about a specific architectural choice
3. **Performance regression**: Metrics fall below established baselines
4. **Security vulnerability**: A previously accepted risk becomes exploitable
5. **Market changes**: Competitors introduce capabilities that Kamelot cannot match
6. **Scaling pressure**: The architecture hits hard limits at current growth rates

### BDR Review Cycle

| BDR | Next Scheduled Review | Trigger-based Review |
|-----|----------------------|---------------------|
| BDR-001 (Rust) | Annual (2026 Q4) | If memory-safe alternative with better ergonomics emerges |
| BDR-002 (Qdrant) | Annual (2026 Q4) | If Qdrant changes free tier or license |
| BDR-003 (Local AI) | Semi-annual (2026 Q3) | If cloud model quality gap becomes unacceptable |
| BDR-004 (GPU UI) | Semi-annual (2026 Q3) | If Vello development stalls or breaking changes |
| BDR-005 (Flat store) | Annual (2026 Q4) | If storage patterns change significantly |
| BDR-006 (Self-hosted) | Annual (2026 Q4) | If market demands cloud option |

---

## Tradeoff Analysis Depth

### BDR-001: Rust Ecosystem Depth

**Decision**: Rust over C/C++, Go, and Zig.

**Deeper analysis of the runner-up (Go)**:
- Go's garbage collection introduces unpredictable pauses at scale. The Kamelot daemon handles FUSE requests with sub-millisecond latency requirements. A GC pause of 50-500μs would cause visible stutter in file browsing.
- CGo FFI overhead: Kamelot must call libfuse3/WinFSP C APIs. CGo adds 50-100ns per call. For a FUSE driver handling 10,000+ operations/second, this adds 0.5-1ms of overhead per second — acceptable but non-zero.
- Binary size: Go produces static binaries of 15-25 MB. Rust produces 6-8 MB. For a CLI tool distributed via package managers, smaller is better.
- Cross-compilation: Go's cross-compilation is excellent, but Rust's target-triple system is more explicit about platform-specific features.

**Conclusion**: Rust was the correct choice. Go would have been acceptable but would require more careful GC tuning and produce larger binaries.

### BDR-002: Database Alternatives Depth

**Decision**: Qdrant over alternatives.

**Why not LanceDB?** LanceDB is embedded (no separate process) which is appealing. However:
- LanceDB's query functionality is limited at the time of evaluation
- No built-in filtering capability comparable to Qdrant's payload filtering
- Smaller community and less mature HNSW implementation
- No snapshot-based backup mechanism

**Why not pgvector?** Many users already have PostgreSQL:
- pgvector with HNSW requires PostgreSQL 14+ with special indexing
- pgvector's HNSW implementation is newer and less optimized than Qdrant's
- Memory usage is higher (full PostgreSQL overhead + vector index)
- Query latency at 1M+ vectors is 2-5x slower than Qdrant

**Conclusion**: Qdrant provides the best balance of features, performance, and self-hosted capability for Kamelot's requirements.

### BDR-003: Alternative Model Impact

**Decision**: Local AI over cloud API.

**What if we used cloud APIs?** The product would be:
- Faster to develop (no model in our critical path)
- Higher quality (GPT-4o embeddings are state-of-the-art)
- But: always-online, data exfiltration, subscription costs

**What about a hybrid approach?** Default local with optional cloud upgrade:
- Adds complexity (two backends to maintain)
- Cloud option undermines the zero-knowledge value proposition
- Users who choose cloud may have different embedding spaces, causing confusion
- The hybrid option may be explored for v2.0 as an opt-in feature

---

## Risk Mitigation Details

### High Risk: Native Rust GPU UI (BDR-004)

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Vello pre-1.0 breaking changes | Medium | High | Pin Vello version; abstract rendering behind a trait |
| Small community/widget ecosystem | High | Medium | Build custom widgets; contribute to Vello ecosystem |
| Limited accessibility features | Medium | High | Manual implementation of screen reader support |
| GPU driver compatibility issues | Low | High | Fallback to software rendering (wgpu CPU backend) |

**Fallback plan**: If Vello proves unsustainable, the UI can be reimplemented with egui (immediate-mode GPU UI) or Tauri (web-based). The CLI remains functional regardless.

### Medium Risk: Local AI Quality Gap (BDR-003)

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Embedding quality below cloud models | Medium | Medium | Hybrid search (vector + BM25) compensates; model upgrades over time |
| Model updates from Qwen are infrequent | Low | Medium | Abstract model backend; pluggable model support |
| Multimodal quality insufficient | Low | Medium | Fallback to text-only embeddings for poor visual matches |

**Quality improvement roadmap**:
1. Hybrid search (vector + BM25): already implemented
2. Re-ranking pass on top N results: planned for v0.3
3. Continuous learning from user corrections: planned for v1.0
4. Custom fine-tuned embedding model: planned for v2.0

---

## Appendix: Technology Evaluation Notes

### BDR-001: Language Evaluation Raw Notes

**Rust (selected)**:
- Ownership model eliminates 70% of CVEs in typical C/C++ filesystem code
- Cargo's dependency resolution is best-in-class
- `tokio` provides production-grade async runtime
- Cross-compilation via `cross` tooling works for all targets
- `unsafe` code limited to FFI bindings (~150 lines)

**C++20 (runner-up)**:
- RAII provides deterministic resource management but not memory safety
- CMake or Bazel required for build system (Cargo is simpler)
- Qt or custom solution needed for UI (no native GPU UI ecosystem)
- Strong for CUDA integration (C++ is the primary CUDA language)

**Zig (considered but rejected)**:
- comptime metaprogramming is powerful but not decisive
- Library ecosystem too small for dependency-heavy project
- No async runtime in standard library
- Filesystem tooling immature

### BDR-002: Vector Database Evaluation Raw Notes

**Qdrant**:
- gRPC API with tonic Rust client — ideal for our stack
- Payload filtering without embedding recomputation
- Snapshot-based backup with zero downtime
- HNSW parameters tunable per-collection

**Milvus**:
- Requires Kafka, MinIO, etcd, and root coordinator — 5+ services
- 2x memory usage compared to Qdrant for same index size
- GPU acceleration only for index building, not search
- Complex to operate; not suitable for single-user deployment

**Chroma**:
- Python-only client; Rust bindings via PyO3 would add latency
- No production persistence (data lost on restart)
- No filtering capability
- Maximum vector count in practical use: ~100K

---

## Appendix: Performance Benchmarking Methodology

### Benchmarking Environment

All architecture decisions were validated with the following benchmark configuration:

- **CPU**: AMD Ryzen 9 7950X (16 cores, 32 threads)
- **GPU**: NVIDIA RTX 3060 12 GB (CUDA 12.0)
- **RAM**: 64 GB DDR5-6000
- **Storage**: Samsung 990 Pro NVMe 2 TB
- **OS**: Ubuntu 24.04 LTS
- **Kernel**: 6.8+

### Benchmark Suites

| Benchmark | Purpose | Metrics |
|-----------|---------|---------|
| Index Throughput | Measure files/second for various file types | Files/sec, CPU%, GPU%, RAM |
| Query Latency | Measure end-to-end query time | p50, p95, p99 latency |
| Memory Profile | Measure steady-state memory usage | RSS, VMS, heap growth |
| Crash Recovery | Test ledger integrity after forced termination | Recovery time, data loss |
| Concurrency | Test multi-query throughput | Queries/sec under load |

Results were averaged over 10 runs with 95% confidence intervals. All benchmarks are reproducible with the open-source test suite.

---

## References (Expanded)

- [BDR-001: Rust vs Go — A Quantitative Comparison (White Paper)](link)
- [BDR-002: Vector Database Benchmark Results (Full Data)](link)
- [BDR-003: Local vs Cloud Embedding Quality Comparison](link)
- [BDR-004: UI Framework Performance Benchmarks](link)
- [BDR-005: Flat Store vs Hierarchical Storage Performance](link)
- [BDR-006: Self-Hosted vs SaaS Cost Analysis](link)
- [North Star Metric documentation](02-north-star-metric.md)
- [Magic Moment documentation](03-magic-moment.md)
- [Unit Economics](05-unit-economics.md)
- [SBOM with full dependency audit](04-software-bill-of-materials.md)
- [Performance benchmarking repository](https://github.com/kamelot/benchmarks)
- [Security audit reports](https://kamelot.ai/security/audits)

---

## Appendix: Technology Comparison Tables

### BDR-001 Detailed: Rust vs C++ Feature Comparison

| Feature | Rust | C++20 | Advantage |
|---------|------|-------|-----------|
| Memory safety | Guaranteed (safe code) | Manual | Rust |
| Concurrency safety | Compile-time checked | Manual (mutexes, atomics) | Rust |
| Package manager | Cargo (built-in) | vcpkg, Conan, CMake | Rust |
| Build system | Cargo (built-in) | CMake, Bazel, Meson | Rust |
| Cross-compilation | `cross` tooling | Platform toolchains | Rust |
| FFI to C | `#[no_mangle)]` extern C | `extern "C"` | Equal |
| GPU compute | wgpu (native) | CUDA, SYCL, Vulkan | C++ |
| Async runtime | tokio (production) | Boost.Asio, libunifex | Rust |
| Error handling | Result/Option types | Exceptions, error codes | Rust |
| Learning curve | Steep | Steeper for safety | Rust |
| Hiring pool | Smaller | Larger | C++ |
| Compile speed | Slower (borrowck) | Faster | C++ |
| Binary size | ~6-8 MB | ~1-3 MB | C++ |
| Ecosystem maturity | Growing rapidly | Very mature | C++ |

### BDR-002 Detailed: Vector Database Feature Matrix

| Feature | Qdrant | Milvus | Weaviate | Pinecone | Chroma |
|---------|--------|--------|----------|----------|--------|
| Self-hosted free tier | Full | Full | Limited | No | Full |
| Rust-native client | Yes | No | No | No | No |
| Payload filtering | Rich | Basic | GraphQL | Basic | None |
| HNSW support | Yes | Yes | Yes | Yes | No |
| Snapshot backup | Yes | Yes | Yes | No | No |
| gRPC | Yes | Yes | No | Yes | No |
| REST API | Yes | Yes | Yes | Yes | No |
| GPU acceleration | No (CPU efficient) | Yes | No | No | No |
| Sharding | Enterprise | Yes | Yes | Yes | No |
| Memory efficiency | Best | Good | Moderate | Good | Best |
| Single-node limit | ~2M | ~10M | ~5M | ~5M | ~100K |

---

## Appendix: Cost-Benefit Analysis Tables

### BDR-004: UI Framework Total Cost of Development

| Framework | Development Time | Developer Cost | Maintenance Cost/Year | Total Year 1 |
|-----------|-----------------|---------------|---------------------|--------------|
| Electron | 3 months | $75,000 | $30,000 | $105,000 |
| Tauri | 4 months | $100,000 | $25,000 | $125,000 |
| Vello + wgpu | 9 months | $225,000 | $15,000 | $240,000 |
| egui | 5 months | $125,000 | $20,000 | $145,000 |

While Vello requires higher upfront investment, the operational savings (lower RAM usage = less cloud cost for CI, no npm vulnerability audits, smaller binary = faster downloads) result in break-even within 18 months versus Electron.

### BDR-006: Self-Hosted vs SaaS 5-Year Total Cost

| Cost Category | Self-Hosted | SaaS (100 users) |
|---------------|-------------|------------------|
| Software licenses | $0 | $120,000 (at $100/user/year) |
| Hardware (one-time) | $5,000 | $0 |
| IT administration | $25,000 ($5K/year) | $5,000 ($1K/year) |
| Electricity | $750 ($150/year) | $0 |
| Storage (one-time) | $1,000 | $0 |
| **Total 5 years** | **$31,750** | **$125,000** |
| **Total per user** | **$317** | **$1,250** |

Self-hosted saves approximately 75% over 5 years for a 100-user deployment, with the added benefit of full data sovereignty.

---

## Appendix: Risk Register

| Risk ID | Description | Probability | Impact | Mitigation | Owner |
|---------|-------------|-------------|--------|------------|-------|
| R-001 | Rust ecosystem tooling changes break build | Low | High | Pin toolchain versions in CI | Engineering |
| R-002 | Qdrant license changes to restrictive | Low | High | Maintain fork; evaluate alternatives | Engineering |
| R-003 | Ollama ceases development | Medium | Medium | Support alternative backends (llama.cpp) | Engineering |
| R-004 | Vello project abandoned or incompatible changes | Medium | High | Abstract rendering; evaluate egui fallback | UI Team |
| R-005 | GPU driver compatibility issues on Linux | Medium | Medium | Support CPU fallback; test on major drivers | QA |
| R-006 | Apple Silicon support gaps | Medium | Medium | Invest in ARM64 testing infrastructure | Platform |
| R-007 | HNSW index quality degrades at scale | Low | Medium | Benchmark at target scale; optimize parameters | Search |
| R-008 | Community fails to reach critical mass | Medium | High | Invest in community building; reduce dependency | Marketing |
| R-009 | Key competitor launches similar product | Medium | Medium | Focus on unique value (privacy, offline, FUSE) | Product |
| R-010 | Regulatory changes affect encryption or AI | Low | Medium | Monitor legislation; adapt compliance documentation | Legal |

---

## Appendix: Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Applications                        │
│  (File Manager, IDE, Terminal, Custom Integrations)         │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   Kamelot Virtual Filesystem                 │
│              (FUSE on Linux/macOS, WinFSP on Windows)       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     Kamelot Daemon (Rust)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐   │
│  │  Search   │  │  Index   │  │ FUSE/Win │  │   API    │   │
│  │  Engine   │  │ Pipeline │  │  FSP Drv │  │ (JSON-RPC)│  │
│  └─────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘   │
│        │             │             │              │         │
│  ┌─────▼─────────────▼─────────────▼──────────────▼──────┐  │
│  │                .aioss Ledger Library                  │  │
│  └──────────────────────────┬───────────────────────────┘  │
└─────────────────────────────┼──────────────────────────────┘
                              │
┌─────────────────────────────┼──────────────────────────────┐
│              ┌──────────────▼──────────────┐                │
│              │      Ollama (Rust/Go)        │                │
│              │   ┌────────────────────────┐ │                │
│              │   │  Qwen 2 VL Model (Q4)  │ │                │
│              │   └────────────────────────┘ │                │
│              └──────────────┬──────────────┘                │
│                             │                                │
│              ┌──────────────▼──────────────┐                │
│              │      Qdrant (Rust)           │                │
│              │   ┌────────────────────────┐ │                │
│              │   │   HNSW Vector Index    │ │                │
│              │   └────────────────────────┘ │                │
│              └──────────────┬──────────────┘                │
│                             │                                │
│              ┌──────────────▼──────────────┐                │
│              │    Encrypted Flat Store      │                │
│              │   (XChaCha20-Poly1305 +     │                │
│              │    sled Metadata Store)     │                │
│              └─────────────────────────────┘                │
│                        Local Hardware                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Appendix: Decision Re-evaluation Process

When a BDR needs re-evaluation, the following process is followed:

### Step 1: Trigger

A re-evaluation is triggered by:
- Scheduled review date reached
- New technology that significantly changes the tradeoffs
- Performance regression >20% from baseline
- Security vulnerability in the chosen component
- Consistent user feedback indicating dissatisfaction

### Step 2: Data Collection

Collect current data on the decision:
- Current performance metrics compared to baseline
- User satisfaction scores
- Operational issues (bugs, maintenance burden)
- Cost data (development, operational, licensing)
- Market changes (new competitors, alternatives)

### Step 3: Analysis

Evaluate whether the original rationale remains valid:
1. Does the original problem still exist?
2. Are the original assumptions still correct?
3. Have the tradeoffs changed?
4. Would a different decision now yield better outcomes?

### Step 4: Decision

Based on analysis, choose one of:
- **Maintain**: No change needed
- **Supplement**: Add an alternative alongside the current choice
- **Replace**: Switch to a different option
- **Deprecate**: Phase out the current choice

### Step 5: Documentation

Update the BDR with:
- New entry in the decision log
- Rationale for the change
- Migration path (if replacing)
- Updated validation data

---

*This document is a living record. Decisions should be revisited when new information or changed circumstances warrant. Each BDR includes the date and author for accountability. Post-decision validation data is updated each quarter during the OKR review cycle. The technology stack diagram provides a visual overview of how the BDR decisions interconnect in the final architecture.*

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ