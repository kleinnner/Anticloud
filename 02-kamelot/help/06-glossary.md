                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# Glossary — Terms and Definitions

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## A

**.aioss** — Advanced Immutable Open Storage System. The append-only ledger at the heart of Kamelot's data model. Every file operation is recorded as an immutable entry in the .aioss ledger, providing a complete history for audit, rollback, and recovery.

**AEAD** — Authenticated Encryption with Associated Data. An encryption mode that provides both confidentiality and integrity. Kamelot uses XChaCha20-Poly1305 AEAD for per-file encryption.

**Anticipatory Mounting** — A planned feature that pre-mounts likely-to-be-needed files in the FUSE namespace based on context (time of day, current project, recent activity), reducing perceived file access time to zero.

**Append-Only** — A property of the .aioss ledger where entries can only be added, never modified or deleted. This ensures immutability of the operation history.

**ARPU** — Average Revenue Per User. A business metric used in the unit economics analysis of Kamelot's enterprise support model.

**Argon2id** — A memory-hard key derivation function used to derive encryption keys from user passwords. Selected for its resistance to GPU-based brute force attacks.

---

## B

**BDR** — Business Decision Record. A document that records a significant architectural decision, including context, options considered, decision, rationale, and consequences. See `docs/feature-paper/01-business-decision-record.md`.

**Blob** — A binary large object. In Kamelot, each file's encrypted content is stored as a blob in the flat store, identified by its inode number.

**Blake3** — A cryptographic hash function used for content hashing in Kamelot. Selected for its speed (10x faster than SHA-256) and security.

**BM25** — Best Match 25. A text retrieval ranking function used in hybrid search (combined with vector similarity) to improve result relevance.

---

## C

**Canvas** — A Kamelot UI feature that provides a 2D spatial layout of files, allowing visual organization and spatial memory-based file retrieval.

**Cargo** — Rust's package manager and build system. Kamelot uses Cargo for dependency management, build, and testing.

**Content Hash** — A cryptographic hash (Blake3) of a file's content, stored in the .aioss ledger to verify file integrity and detect tampering.

**Content Parsing** — The process of extracting text, metadata, and structure from files during indexing. Kamelot parses documents, code, images, and other formats to generate searchable content.

**Continuous Learning** — A planned feature where the embedding model fine-tunes on user correction patterns (e.g., when a user selects the 3rd result instead of the 1st), improving future query accuracy.

**Cosine Similarity** — A measure of similarity between two vectors, calculated as the cosine of the angle between them. Kamelot uses cosine similarity to rank search results by relevance to the query.

**CRDT** — Conflict-Free Replicated Data Type. Used in the K-Swarm mesh protocol for distributed state synchronization without conflicts.

---

## D

**Daemon** — The background process that runs Kamelot's core functionality: file watching, indexing, embedding, search, and FUSE mount management.

**Docker** — Containerization platform. Optional dependency for running Qdrant and Ollama. Kamelot can also run these services natively without Docker.

---

## E

**eBPF** — Extended Berkeley Packet Filter. Planned technology for kernel-level file operation monitoring, providing more efficient file change detection than userspace polling.

**Electron** — A framework for building desktop applications with web technologies (HTML, CSS, JavaScript). Kamelot explicitly chose NOT to use Electron, opting for native Rust GPU UI instead.

**Embedding** — A vector representation of data (text, image, or file content) in a high-dimensional space. Kamelot generates embeddings of file contents and user queries to enable semantic similarity search.

**Embedding Dimension** — The number of dimensions in the embedding vector. Kamelot uses 768-dimensional embeddings (from Qwen 2 VL). Higher dimensions can store more information but require more storage and compute.

**Enterprise Support** — Paid support tiers for organizations using Kamelot in production. Includes SLAs, dedicated engineering, compliance documentation, and custom development.

**Episodic Memory** — A type of long-term memory involving recollection of specific events. Kamelot leverages the file's temporal context (when it was created/modified) to augment semantic search.

---

## F

**Flat Store** — Kamelot's encrypted file storage system. Each file is stored as an independent encrypted blob in a flat namespace (no directories), keyed by inode number. Provides O(1) lookups and simple per-file encryption.

**FUSE** — Filesystem in Userspace. A kernel module that allows non-privileged users to create filesystems without editing kernel code. Kamelot uses FUSE (Linux) and macOSFUSE (macOS) to mount the virtual search drive.

**FUSE-T** — A userspace FUSE implementation for macOS that doesn't require kernel extensions. Planned as an alternative to macOSFUSE for macOS 15+ compatibility.

---

## G

**Garbage Collection** — The process of removing unreferenced data from the flat store. When files are deleted or rolled back, previous blob versions become unreachable and are candidates for garbage collection.

**GGUF** — GPT-Generated Unified Format. A file format for storing quantized machine learning models. Qwen 2 VL is distributed in GGUF format.

**GPU UI** — Graphical User Interface rendered on the GPU. Kamelot uses Vello (compute-shader-based vector renderer) on wgpu (GPU abstraction) for its native GPU UI, avoiding the performance penalties of Electron.

**Graphify** — A Kamelot UI feature that renders interactive relationship graphs between files, showing connections based on content similarity, co-occurrence, and user-defined relationships.

**gRPC** — Remote Procedure Call framework used by Qdrant's client-server communication. Kamelot communicates with Qdrant via gRPC using the `tonic` Rust crate.

---

## H

**HNSW** — Hierarchical Navigable Small World. An approximate nearest neighbor search algorithm used by Qdrant for fast vector similarity search. Provides sub-100ms search at 1M+ vectors.

**HKDF** — HMAC-based Key Derivation Function. Used by Kamelot to derive per-file encryption keys from the master key, ensuring each file has a unique encryption key.

**Hybrid Search** — A search approach that combines multiple retrieval methods: vector similarity (semantic), keyword matching (BM25), and metadata filtering. Provides better results than any single method.

---

## I

**Inode** — Inode number. Kamelot assigns a unique inode number to each indexed file. The inode serves as the primary identifier for the file in the flat store, ledger, and Qdrant.

**Ingest** — The process of reading, parsing, embedding, and indexing files into Kamelot. Also referred to as indexing.

**IPC** — Inter-Process Communication. Kamelot uses Unix domain sockets (Linux/macOS) and named pipes (Windows) for communication between the daemon, CLI, and UI processes.

---

## K

**K-Swarm** — Kamelot Swarm protocol. A mesh networking protocol designed for distributed Kamelot instances to share search indexes and file access across multiple machines. Planned for v2.0.

**KDF** — Key Derivation Function. A cryptographic function that derives one or more secret keys from a master key, password, or passphrase. Kamelot uses HKDF for per-file key derivation.

**kml** — The Kamelot CLI tool. Provides commands for file search, indexing, configuration, ledger management, and system administration.

---

## L

**Latency Budget** — The allocation of time across the query pipeline components (embedding, search, ranking, rendering, mounting) to meet the total response time target.

**Ledger** — See `.aioss`.

**libfuse3** — The FUSE library for Linux. Kamelot uses libfuse3 to create the virtual filesystem mount on Linux systems.

**LKM** — Loadable Kernel Module. A kernel module that can be loaded at runtime. Relevant to FUSE and eBPF integration.

**LTV** — Lifetime Value. The total revenue expected from a customer over their relationship with Kamelot's enterprise support services.

---

## M

**Magic Moment** — The first time a user types a vague natural language query and Kamelot returns exactly the file they were looking for — a file they could not locate by any traditional method. This is the emotional turning point where users become advocates.

**Memory Safety** — A property of programming languages that prevent memory errors such as buffer overflows, use-after-free, and null pointer dereferences. Rust provides memory safety guarantees without garbage collection.

**MF+SO** — Multi-Factor + Single Outcome. A guiding design principle: many ways to search (text, voice, image, tags, date, Canvas, Graphify) but always a single, clear path to the file.

**MIME Type** — Multipurpose Internet Mail Extensions type. Standard identifier for file formats (e.g., `application/pdf`, `image/png`). Kamelot uses MIME types for file type detection and content parsing selection.

**Mini-Filter** — A Windows filesystem filter driver. Planned for more efficient file change detection on Windows, replacing the current polling-based approach.

**Mock Backend** — A development embedding backend that returns deterministic random vectors instead of real embeddings. Used for testing and development without requiring an AI model.

**Multimodal** — Capable of processing multiple types of input (text, images, audio). Kamelot's embedding model (Qwen 2 VL) is multimodal, enabling search by visual description as well as text.

---

## N

**Native Rust GPU UI** — Kamelot's graphical interface, built with Vello (vector rendering) on wgpu (GPU abstraction) with Winit (windowing), all in Rust. Chosen over Electron for 10x performance and 1/100th RAM usage.

**North Star Metric** — "Seconds from thought to file." The single metric that defines Kamelot's core value proposition: the speed and ease of retrieving a file by describing its content.

**NSM** — See North Star Metric.

---

## O

**Ollama** — A local model serving tool that wraps model download, quantization, GPU acceleration, and API serving. Kamelot uses Ollama to serve the Qwen 2 VL embedding model locally.

**Omnibox** — Kamelot's primary search interface. A global search bar (configurable hotkey, default `Ctrl+Space`) that provides real-time semantic search results as the user types.

**O(1) Lookup** — Constant-time lookup complexity. The Kamelot flat store can retrieve any file in constant time by its inode number, regardless of the total number of files stored.

---

## P

**Per-File Encryption** — Each file in Kamelot's flat store is encrypted with a unique key derived from the master key and the file's inode number. This means compromising one file's key does not compromise other files.

**Payload Filtering** — Qdrant's ability to filter search results based on stored payload fields (file type, size, date, tags). Enables hybrid queries combining vector similarity with structured filters.

**POSIX Bridge** — The FUSE/WinFSP virtual filesystem that allows existing applications and tools to access Kamelot-indexed files through standard filesystem operations.

**Progressive Indexing** — An indexing strategy that prioritizes recently used and important files first, making the system searchable within 30 seconds while the full index continues in the background.

---

## Q

**Qdrant** — A Rust-native vector database used by Kamelot for storing and searching file embeddings. Selected for its self-hosted sovereignty, payload filtering, and snapshot-based backup.

**Qwen 2 VL** — The default embedding model used by Kamelot. A 7-billion-parameter vision-language model quantized to Q4, capable of understanding both text and images. Licensed under Apache 2.0.

**Query Cache** — A cache that stores recent query results, allowing identical or similar queries to be served without re-running the embedding and search pipeline.

**Query Directory** — A virtual directory in the FUSE mount that shows search results as files. Currently a known issue (returns empty for `readdir`), planned for v0.2.0.

---

## R

**Ransomware Response** — The process of recovering from a ransomware attack using Kamelot's .aioss ledger rollback capability. Steps: Isolate, Assess, Rollback, Verify, Restore, Post-mortem.

**Recovery Key** — A human-readable phrase that can re-derive the master encryption key. Generated during `kml init` and must be stored securely offline.

**Re-indexing** — The process of regenerating the vector index from scratch. Required when changing embedding models or after ledger recovery.

**Rollback** — The ability to revert files to a previous state using the .aioss ledger's immutable history. Supports per-inode, all-files, and timestamp-based rollback.

**RTO** — Recovery Time Objective. The target time to restore service after a disaster. Kamelot's RTO target is 4 hours for S1 incidents.

**RPO** — Recovery Point Objective. The maximum acceptable data loss in a disaster. Kamelot's RPO target is 5 minutes.

---

## S

**SBOM** — Software Bill of Materials. A complete inventory of all software components in Kamelot, including dependencies, licenses, and version information.

**Semantic Memory** — Memory of meanings, understandings, and conceptual knowledge. Kamelot leverages semantic memory by searching file content meaning rather than file names or locations.

**sled** — An embedded key-value database written in Rust. Kamelot uses sled for metadata storage (inode-to-path mappings, configuration).

**Sovereign Storage** — Storage that is fully controlled by the user, without dependency on third-party services. Kamelot's self-hosted architecture ensures sovereignty.

**SPDX** — Software Package Data Exchange. An open standard for communicating software bill of materials information. Kamelot publishes SPDX 2.3 SBOMs.

**Synthetic Workspace** — A virtual directory in the Kamelot FUSE mount that presents files based on semantic criteria rather than physical location. Think of it as a "smart folder."

---

## T

**Tamper-Evident Ledger** — The .aioss ledger is designed so that any modification to past entries is detectable via hash chain verification.

**Telemetry** — Usage data collected from Kamelot installations. Telemetry is opt-in, anonymous, and stored locally. No query content or file content is ever collected.

**Thought to File** — See North Star Metric.

**TOML** — Tom's Obvious, Minimal Language. A configuration file format used for Kamelot's `config.toml`.

---

## U

**Unit Economics** — The direct revenues and costs associated with a business model. Kamelot's unit economics analysis covers cost per file ingested, cost per query, storage cost, and infrastructure cost.

---

## V

**Vector Database** — A database optimized for storing and searching vector embeddings. Kamelot uses Qdrant as its vector database.

**Vector Embedding** — See Embedding.

**Vello** — A compute-shader-based vector graphics renderer written in Rust. Kamelot uses Vello for its GPU-accelerated UI rendering.

**Virtual Query Directory** — See Query Directory.

**VRAM** — Video Random Access Memory. GPU memory used for storing model weights and intermediate computations. Kamelot's embedding model requires 6-8 GB of VRAM.

---

## W

**wgpu** — A safe, portable GPU abstraction layer for Rust, implemented in WebGPU's API. Kamelot uses wgpu as the foundation for its GPU UI and compute operations.

**WinFSP** — Windows File System Proxy. A kernel-mode driver that allows user-space filesystem implementations on Windows. Kamelot uses WinFSP to create its virtual drive on Windows.

**Winit** — A cross-platform window creation and event handling library for Rust. Kamelot uses Winit for its Omnibox window.

---

## X

**XChaCha20-Poly1305** — An authenticated encryption algorithm used by Kamelot for per-file encryption. XChaCha20 provides a 192-bit nonce for safe random nonce generation, and Poly1305 provides authentication.

---

## Y

**YAML** — A human-readable data serialization format. Kamelot uses TOML for configuration instead of YAML.

---

## Z

**Zero-Knowledge Architecture** — A system design where the service provider has no knowledge of user data. Kamelot's self-hosted, locally-processed architecture ensures zero-knowledge: not even Kamelot Inc. can access user files.

**Zero-Cost Abstraction** — A Rust concept where high-level language features compile down to efficient machine code with no runtime overhead. Kamelot relies on Rust's zero-cost abstractions for performance-critical filesystem operations.

**Zero Data Exfiltration** — The property that file contents never leave the user's machine. Kamelot achieves this through local AI inference, local vector search, and encrypted local storage.

---

## Numeric

**0-1.gg** — The founding entity of Kamelot, alongside Lois-Kleinner. The "0-1" represents the journey from zero to one — creating something new.

**3-2-1 Backup Strategy** — A backup best practice: 3 copies of data, on 2 different media types, with 1 copy offsite. Kamelot's backup documentation recommends this strategy.

**768** — The embedding dimension used by Kamelot (from Qwen 2 VL). Each file is represented as a 768-dimensional vector.

---

## Symbols

**/kml** — The default mount point for the Kamelot virtual drive on Linux and macOS.

**K:\** — The default mount point for the Kamelot virtual drive on Windows.

**Ctrl+Space** — The default hotkey for opening the Omnibox. Configurable in `config.toml`.

**>85%** — The target Top-1 query accuracy: the correct file should be the first result in more than 85% of queries.

---

## A (Extended)

**Access Control** — Mechanisms for restricting file access to authorized users. Kamelot currently implements single-user access control via OS file permissions on the configuration and key directories.

**Active Memory** — The amount of RAM in use during peak operation. Kamelot's active memory includes the Qdrant HNSW index, the embedding model in VRAM, and the daemon process memory.

**Address Space Layout Randomization (ASLR)** — A security technique that randomizes memory addresses to prevent exploit targeting. Kamelot's Rust binary inherits ASLR from the operating system.

**Aggregated Telemetry** — Anonymized usage statistics that can be optionally shared for product improvement. Never includes query content, file content, or personal identifiers.

**AI Inference** — The process of running a machine learning model to generate predictions. In Kamelot, AI inference converts file content into vector embeddings.

**Algorithmic Complexity** — The computational resources required by an algorithm as input size grows. Kamelot relies on O(1) flat store lookups and O(log n) HNSW search.

**Aliasing** — A memory safety issue where multiple pointers reference the same location. Rust's ownership system prevents aliasing-related bugs.

**Allocation** — The process of reserving memory for program use. Kamelot minimizes allocations in the hot path (query pipeline) for performance.

**Anomaly Detection** — Identification of unusual patterns in file access or system behavior. Planned for future integration with the .aioss ledger monitoring.

**ANSI Escape Codes** — Terminal formatting codes used by Kamelot's CLI for colored log output. Disabled in JSON log mode.

**Anti-Magic Moment** — The first time a user is confident Kamelot should find a file and it does not. A critical failure mode that must be recovered from quickly.

**Approximate Nearest Neighbor (ANN)** — A class of algorithms that find approximately nearest neighbors in high-dimensional space, trading exactness for speed. HNSW is an ANN algorithm.

**ASCII Art Header** — The decorative Kamelot logo displayed at the top of documentation files, rendered in ASCII characters.

**Asynchronous I/O** — Non-blocking input/output operations that allow the program to continue executing while waiting for I/O. Kamelot uses Tokio for async I/O.

**Atomic Operation** — An operation that completes in a single, indivisible step. Kamelot's ledger append operations are atomic to ensure consistency.

**Attestation** — Cryptographic evidence that software has not been tampered with. Planned for future release verification.

**Audit Trail** — A chronological record of system activities. Kamelot's .aioss ledger provides an immutable audit trail of all file operations.

**Authentication** — The process of verifying user identity. Kamelot currently relies on OS-level authentication with plans for SSO/LDAP integration.

**Automatic Differentiation** — A technique for computing gradients used in machine learning training. Not used in Kamelot's inference-only pipeline.

**Availability** — The proportion of time a system is operational. Kamelot targets 99.9% availability for the daemon process.

---

## B (Extended)

**Backpressure** — A mechanism for handling overload by signaling upstream components to slow down. Used in Kamelot's ingestion pipeline when Qdrant or the flat store cannot keep up.

**Backup** — A copy of data used for recovery in case of data loss. Kamelot recommends the 3-2-1 backup strategy for the flat store, ledger, and encryption keys.

**Bandwidth** — The maximum rate of data transfer. Kamelot's local architecture eliminates network bandwidth concerns for search operations.

**Base64** — A binary-to-text encoding scheme. Used by Kamelot for embedding transfer between the daemon and Qdrant.

**Batch Processing** — Processing multiple items together for efficiency. Kamelot's ingestion pipeline batches file embeddings before inserting into Qdrant.

**Benchmark** — A standardized test for measuring performance. Kamelot publishes benchmarks for query latency, indexing throughput, and accuracy.

**Bidirectional Bridge** — A two-way communication channel. Used between the Kamelot daemon and the Vello UI via IPC.

**Binary Serialization** — Converting data structures to binary format for storage or transmission. Kamelot uses MessagePack and Protocol Buffers.

**Binding** — A connection between a service and a network address. Kamelot's daemon binds to localhost by default for security.

**Bloat** — Unnecessary code or dependencies that increase binary size. Kamelot's Rust binary is kept lean at 6-8 MB through careful dependency management.

**Blocking I/O** — Input/output operations that pause program execution until complete. Minimized in Kamelot's async architecture.

**Boolean Query** — A search query using Boolean operators (AND, OR, NOT). Kamelot supports Boolean filters in hybrid search via Qdrant payload filtering.

**Bootstrapping** — The initial startup sequence of a system. Kamelot's bootstrap includes loading config, connecting to Qdrant and Ollama, and mounting the FUSE filesystem.

**Bottleneck** — A component that limits overall system performance. Common Kamelot bottlenecks include embedding generation (CPU) and HNSW index size (RAM).

**Bounds Checking** — Verifying that array accesses are within valid range. Rust performs bounds checking at runtime, preventing buffer overflows.

**Brute Force** — An attack that tries all possible values. Argon2id key derivation resists GPU-based brute force attacks.

**Buffer Pool** — A pre-allocated memory region for temporary data. Used in Kamelot's FUSE read path to reduce allocation overhead.

**Build Target** — The platform for which software is compiled. Kamelot builds for x86_64 and aarch64 on Linux, Windows, and macOS.

**Bulk Ingest** — The process of indexing a large number of files at once. Kamelot's bulk ingest processes files in parallel batches.

**Byte Order Mark (BOM)** — A Unicode character used to indicate byte order. Kamelot's parsers handle BOM in text files.

---

## C (Extended)

**Cache Locality** — A measure of how efficiently a program uses CPU caches. Kamelot's data structures are designed for cache-friendly access patterns.

**Cache Coherency** — Consistency of data stored in multiple caches. Managed by the memory-mapped HNSW index in Qdrant.

**Callback** — A function passed as an argument to another function. Used in Kamelot's FUSE driver for filesystem operation handlers.

**Capacity Planning** — The process of determining required hardware resources. Kamelot's documentation provides capacity guidelines based on file count.

**Cascading Failure** — A failure that propagates from one component to others. Kamelot's architecture isolates failures: the UI, daemon, Qdrant, and Ollama can fail independently.

**Ceph** — A distributed storage system. Kamelot can run on top of CephFS for enterprise deployments.

**Certificate Pinning** — A security technique that associates a host with its expected certificate. Used by Kamelot for secure model downloads.

**Chain of Trust** — A sequence of cryptographic verifications from a trusted root. Kamelot uses this for verifying model and binary signatures.

**Channel** — A Rust type for communication between threads. Used in Kamelot for IPC between daemon and UI processes.

**Checksum** — A value used to verify data integrity. Kamelot stores Blake3 content hashes in the .aioss ledger.

**Chroot** — A Linux operation that changes the root directory for a process. Kamelot does not use chroot for isolation.

**Ciphertext** — Encrypted data. Kamelot's flat store contains ciphertext of file contents encrypted with XChaCha20-Poly1305.

**Classic Mac OS** — The original Macintosh operating system. Not supported by Kamelot.

**Client-Server Architecture** — A distributed system where clients request services from a server. Kamelot's daemon acts as a server for CLI and UI clients.

**Clock Cycle** — A single pulse of a processor's clock. Kamelot's performance-sensitive paths are optimized for minimal clock cycles.

**Cloud Sync** — The process of synchronizing files with cloud storage. Kamelot works alongside cloud sync services but does not provide its own sync.

**Cluster** — A group of computers working together. Kamelot supports single-node deployments with planned multi-node via K-Swarm.

**Code Generation** — Creating source code programmatically. Kamelot uses Rust macros for code generation in serialization and CLI argument parsing.

**Codec** — A device or program for encoding/decoding data. Kamelot uses various codecs for file format parsing.

**Collection** — A named group of vectors in Qdrant. Kamelot uses a single collection for all file embeddings.

**Collision Resistance** — A property of hash functions where finding two inputs with the same hash is computationally infeasible. Kamelot uses Blake3 and SHA-256.

**Columnar Storage** — Data organized by columns rather than rows. LanceDB uses columnar storage; Qdrant uses vector-oriented storage.

**Command Injection** — An attack that executes arbitrary commands. Kamelot prevents this by using structured APIs instead of shell commands.

**Commit** — In ledger context, a recorded operation entry. Each file operation is a commit in the .aioss ledger.

**Communication Protocol** — Rules for data exchange between systems. Kamelot uses gRPC for Qdrant, HTTP for Ollama, and Unix sockets for IPC.

**Compaction** — The process of consolidating data for efficiency. Qdrant performs segment compaction to optimize the vector index.

**Compatibility Layer** — Software that allows programs written for one system to run on another. Kamelot's FUSE/WinFSP bridge is a compatibility layer.

**Compile Time** — The time required to compile source code. Kamelot's full clean build takes 8-12 minutes.

**Compiler Optimizations** — Transformations applied by the compiler to improve code. Rust's LLVM backend provides aggressive optimization.

**Composite Index** — An index combining multiple fields. Qdrant supports composite payload indexes for efficient filtering.

**Compression Ratio** — The ratio of uncompressed to compressed data size. Kamelot does not compress encrypted blobs (encrypted data is incompressible).

**Comptime** — Zig's compile-time execution feature. Not applicable to Kamelot's Rust codebase.

**Concurrency** — Multiple tasks making progress simultaneously. Kamelot's async Tokio runtime handles concurrent operations efficiently.

**Connection Pool** — A cache of database connections maintained for reuse. Kamelot uses connection pooling for Qdrant gRPC connections.

**Consensus** — Agreement among distributed nodes on data state. Not applicable to Kamelot's single-node architecture.

**Constant Factor** — The multiplicative constant in algorithm complexity analysis. Kamelot optimizes for low constant factors in the query path.

**Constructor** — A function that initializes a new object. Rust uses associated functions (`new()`) instead of constructors.

**Content Addressable Storage** — Storage where data is identified by its content hash. Kamelot's flat store uses inode numbers rather than content hashes.

**Context Switch** — The process of switching the CPU from one process to another. Kamelot minimizes context switches through async I/O.

**Continuation** — A representation of program state at a point in execution. Used in Rust async functions as generated state machines.

**Control Flow Integrity** — A security mechanism ensuring program execution follows expected paths. Rust's type system provides compile-time control flow guarantees.

**Cooperative Scheduling** — Task scheduling where tasks voluntarily yield control. Kamelot's async runtime uses cooperative scheduling.

**Copy-on-Write (CoW)** — A technique where data is shared until modified. ZFS uses CoW; Kamelot's flat store does not.

**Core Dump** — A file containing a process's memory state at crash. Kamelot can generate core dumps for debugging.

**Coroutine** — A generalized subroutine for cooperative multitasking. Rust's async functions are a form of coroutines.

**Corruption** — Data that has been damaged or altered. Kamelot detects corruption via content hash verification.

**Cost Model** — A mathematical model for estimating system costs. Kamelot's unit economics document provides detailed cost models.

**Counting Bloom Filter** — A probabilistic data structure for approximate membership queries with deletion support. Used in Kamelot's query cache.

**Covariance** — A measure of how two variables change together. Used in machine learning, not directly in Kamelot.

**Crash Consistency** — The property that a system can recover to a consistent state after a crash. Kamelot's append-only ledger provides crash consistency.

**CRC32** — A cyclic redundancy check for error detection. Kamelot uses stronger Blake3 hashes for integrity.

**Critical Path** — The sequence of operations that determines total execution time. Kamelot's critical path is: query → embedding → search → rank → render.

**Cross-Compilation** — Compiling code for a different target platform than the host. Kamelot uses Rust's cross-compilation for multi-platform releases.

**Cross-Site Scripting (XSS)** — A web security vulnerability. Not applicable to Kamelot's native desktop application.

**Crypto Agility** — The ability to switch cryptographic algorithms without major changes. Kamelot's architecture supports algorithm upgrades.

**Cryptographic Hash** — A one-way function producing a fixed-size output. Kamelot uses SHA-256 and Blake3 for different purposes.

**Cryptographic Nonce** — A number used once in cryptographic communication. XChaCha20 uses a 192-bit nonce.

**Crystal Programming Language** — A compiled language with Ruby-like syntax. Not used by Kamelot.

**CUDA** — NVIDIA's parallel computing platform. Used by Ollama for GPU-accelerated model inference with NVIDIA GPUs.

**Cumulative Layout Shift** — A web performance metric. Not applicable to Kamelot's native GPU UI.

**Curl** — A command-line tool for transferring data. Used in Kamelot's download examples and API testing snippets.

**Cursor** — A database iterator for paginated results. Qdrant uses cursors for large result sets.

**Custom Allocator** — A user-defined memory allocator. Kamelot uses the system allocator with Jemalloc on Linux for performance.

**CVE** — Common Vulnerabilities and Exposures. A public database of security vulnerabilities. Kamelot targets zero memory-safety CVEs.

**Cyclic Dependency** — A dependency that forms a cycle. Rust's module system prevents cyclic dependencies at compile time.

---

## D (Extended)

**Dark Launch** — Releasing a feature to a subset of users. Not applicable to Kamelot's self-hosted model.

**Data at Rest** — Inactive data stored persistently. Kamelot encrypts data at rest with XChaCha20-Poly1305.

**Data in Transit** — Data actively moving between locations. Kamelot's IPC uses Unix domain sockets for secure local communication.

**Data at Work** — Data currently being processed. Kamelot processes data in system RAM or GPU VRAM.

**Data Augmentation** — Techniques for increasing data diversity. Not applicable to Kamelot's embedding pipeline.

**Data Breach** — Unauthorized access to data. Kamelot's zero-knowledge architecture minimizes breach risk.

**Data Deduplication** — Eliminating duplicate copies of data. Kamelot does not perform content deduplication across files.

**Data Exfiltration** — Unauthorized copying of data. Kamelot prevents this through local-only processing.

**Data Locality** — Keeping data close to where it is processed. Kamelot achieves this through local storage and processing.

**Data Migration** — Moving data between storage systems. Kamelot provides tools for migration between versions.

**Data Parallelism** — Distributing data across multiple processors. Used in batch embedding generation on GPU.

**Data Plane** — The part of a system that processes data. Kamelot's data plane is the ingestion and search pipeline.

**Data Poisoning** — Manipulating training data to compromise a model. Kamelot mitigates this by using verified model sources.

**Data Race** — Concurrent access to shared data without synchronization. Rust prevents data races at compile time.

**Data Serialization** — Converting data structures to a storable format. Kamelot uses MessagePack for IPC and Protobuf for Qdrant.

**Data Sharding** — Partitioning data across multiple databases. Planned for Qdrant at scale.

**Data Sink** — A destination for data flow. Kamelot's data sinks include Qdrant, the flat store, and the .aioss ledger.

**Data Source** — An origin of data for processing. Kamelot's data sources are files on the local filesystem.

**Data Structure** — A structured way of organizing data. Kamelot uses graphs (HNSW), trees (runtime-none), and flat arrays.

**Data Warehouse** — A system for analytical reporting. Not relevant to Kamelot's operational data model.

**Data Wrangling** — The process of cleaning data. Not applicable to Kamelot's ingestion pipeline (files are indexed as-is).

**Database Migration** — Changing a database schema. Qdrant handles schema evolution automatically for vector collections.

**Datagram** — A self-contained packet of data. Not used in Kamelot's stream-based IPC.

**Deadlock** — A situation where tasks wait for each other indefinitely. Rust's ownership system and Kamelot's async design prevent deadlocks.

**Dead Store Elimination** — A compiler optimization removing unused writes. Applied by Rust's LLVM backend.

**Debug Symbol** — Metadata mapping binary code to source. Kamelot's release builds strip debug symbols.

**Decryption** — Converting ciphertext to plaintext. Kamelot decrypts file blobs on-the-fly when accessed via FUSE.

**Default Argument** — A function parameter with a default value. Rust does not support default arguments; Kamelot uses the builder pattern instead.

**Defense in Depth** — Multiple layers of security controls. Kamelot implements encryption, memory safety, isolated processes, and access control.

**Defragmentation** — Reducing fragmentation in storage. Kamelot's flat store does not fragment.

**Degrees of Parallelism** — The number of tasks executed simultaneously. Kamelot's ingestion pipeline uses configurable parallelism.

**Denial of Service (DoS)** — An attack that makes a system unavailable. Kamelot's local-only design limits DoS risk.

**Dependency Graph** — A directed graph of dependencies. Kamelot's Cargo.lock defines a precise dependency graph.

**Dependency Injection** — A pattern for providing dependencies to a component. Kamelot uses trait objects for pluggable backends.

**Deployment** — The process of making software available for use. Kamelot supports native installation and Docker deployment.

**Deprecation** — Marking a feature as obsolete. Kamelot follows semantic versioning for deprecation.

**Derivative** — In calculus, the rate of change. Used in gradient-based optimization, not in Kamelot's inference-only pipeline.

**Deserialization** — Converting a serialized format back to data structures. Kamelot uses Serde for safe deserialization.

**Design Document** — A written description of a system's design. Kamelot maintains BDRs and feature papers as design documents.

**Destructor** — A function called when an object is destroyed. Rust's Drop trait provides deterministic destructors.

**Detached Signature** — A digital signature stored separately from the signed data. Kamelot uses detached GPG signatures for release verification.

**Deterministic Build** — A build that produces identical output given identical input. Kamelot's builds are reproducible via Cargo.

**DevOps** — A set of practices combining development and operations. Kamelot provides DevOps tools for self-hosted deployments.

**Diagnostic** — A tool or message for identifying problems. Kamelot's `kml doctor` is the primary diagnostic tool.

**Dictionary Attack** — An attack trying common passwords. Argon2id resists dictionary attacks through memory-hard derivation.

**Diffing** — Comparing two versions of data. The .aioss ledger enables file version diffing (planned feature).

**Digest** — A hash output. See Cryptographic Hash.

**Digital Signature** — A cryptographic method for verifying authenticity. Kamelot releases are signed with GPG.

**Dimensionality** — The number of dimensions in vector space. Kamelot uses 768-dimensional embeddings.

**Direct Memory Access (DMA)** — Hardware feature allowing devices to access memory directly. Not managed by Kamelot.

**Directory Traversal** — An attack accessing files outside the intended directory. Kamelot's FUSE driver prevents traversal attacks.

**Disaster Recovery (DR)** — The process of restoring systems after a disaster. Kamelot provides DR procedures for ledger and flat store recovery.

**Disk I/O** — Input/output operations on storage devices. Kamelot optimizes for minimal disk I/O during search.

**Distributed Denial of Service (DDoS)** — A DoS attack from multiple sources. Not relevant to Kamelot's local architecture.

**Distributed Lock** — A mechanism for coordinating access in distributed systems. Not used in Kamelot's single-node deployment.

**Distributed System** — A system with components on multiple computers. Kamelot is primarily single-node with planned K-Swarm distribution.

**DNS** — Domain Name System. Used only for downloading models and updates.

**Document-Oriented Database** — A database storing semi-structured data. Not used by Kamelot.

**Domain-Specific Language (DSL)** — A language specialized for a particular domain. Kamelot uses TOML for configuration.

**Double Free** — A memory error where memory is freed twice. Rust prevents this through ownership.

**Downtime** — Periods when a system is unavailable. Kamelot's target uptime is 99.9%.

**Drain** — In networking, the process of closing connections gracefully. Kamelot drains active queries before shutdown.

**Driver** — Software controlling hardware devices. Kamelot interacts with FUSE and WinFSP drivers.

**Drop** — Rust's trait for cleanup when a value goes out of scope. Ensures deterministic resource management.

**Dry Run** — A test execution without side effects. Kamelot supports `kml index --dry-run`.

**Dual Licensing** — Offering software under multiple licenses. Kamelot's core is dual-licensed under MIT and Apache 2.0.

**Dump** — A copy of system state for analysis. Kamelot can create debug bundles containing configuration, logs, and system info.

**Duplicate** — An identical copy of data. Kamelot identifies duplicates via content hashing but does not automatically deduplicate.

**Dynamic Analysis** — Testing software during execution. Kamelot uses MIRI for Rust undefined behavior detection.

**Dynamic Dispatch** — Runtime method resolution. Kamelot uses trait objects for the embedding backend pluggability.

**Dynamic Library** — A library loaded at runtime. Kamelot statically links dependencies for a self-contained binary.

**Dynamic Programming** — An algorithmic technique. Not directly used in Kamelot.

---

## E (Extended)

**Early Exit** — An optimization that stops computation when a result is good enough. Used in HNSW search for approximate results.

**Eager Loading** — Loading data before it is needed. Kamelot pre-loads the embedding model at daemon start.

**Edge Case** — An unusual input or situation. Kamelot tests edge cases like empty files, very long filenames, and special characters.

**Edit Distance** — A measure of difference between strings. Not used in Kamelot's search (vector similarity is used instead).

**Efficiency** — The ratio of useful output to total input. Kamelot's Rust implementation provides high energy efficiency.

**Egress** — Outbound network traffic. Kamelot has near-zero egress during normal operation.

**Elapsed Time** — The actual time taken for an operation. Kamelot measures this for the North Star Metric.

**Election** — The process of selecting a leader in distributed systems. Not applicable to Kamelot's single-node architecture.

**Eligibility Trace** — A reinforcement learning concept. Not used in Kamelot.

**Elliptic Curve Cryptography (ECC)** — Public-key cryptography based on elliptic curves. Not used in Kamelot's file encryption (uses XChaCha20-Poly1305 instead).

**Embedded Database** — A database that runs within the application process. Kamelot uses sled as an embedded metadata store.

**Emission** — In tracing, producing a log event. Kamelot's tracing crate emits structured events.

**Empirical Testing** — Testing based on observation. Kamelot's performance benchmarks are based on empirical measurements.

**Empty Slice** — A zero-length slice in Rust. Used to represent the absence of data without allocation.

**Emulation** — Imitating one system on another. Not used by Kamelot.

**Encoding** — Converting data to a different format. Kamelot handles various file encodings (UTF-8, UTF-16, Latin-1) in text parsing.

**Encrypted Volume** — A storage volume protected by encryption. Kamelot can run on encrypted volumes (LUKS, BitLocker, FileVault).

**End of File (EOF)** — A condition indicating the end of a data source. Handled gracefully by Kamelot's parsers.

**End-to-End Encryption (E2EE)** — Encryption that prevents intermediaries from reading data. Kamelot's local-only architecture is stronger than E2EE (no intermediaries exist).

**Endianness** — The order of bytes in binary data. Kamelot handles both little-endian and big-endian in file parsing.

**Enforcement** — Ensuring compliance with rules. Kamelot enforces encryption via the flat store driver.

**Entropy** — A measure of randomness. Kamelot uses OS-provided entropy for cryptographic key generation.

**Enum** — A type representing one of several variants. Rust's enums are used extensively in Kamelot for error handling and state representation.

**Environment Variable** — A named value in the operating system. Kamelot uses RUST_LOG for log level configuration.

**Epoch** — A point in time used as a reference. Kamelot timestamps use Unix epoch milliseconds.

**Ergonomics** — The ease of use of a tool or interface. Kamelot prioritizes ergonomics in CLI and UI design.

**Erlang** — A programming language for concurrent systems. Not used by Kamelot.

**Error Code** — A numeric identifier for an error condition. Kamelot uses Rust's error types with descriptive messages.

**Error Correction** — Detecting and fixing errors in data. Handled by storage hardware (ECC RAM, checksummed filesystems).

**Error Handling** — The practice of anticipating and responding to errors. Kamelot uses Rust's Result type for comprehensive error handling.

**Error Rate** — The frequency of errors in a system. Kamelot targets >99.5% query success rate.

**Escalation** — Transferring an issue to higher-level support. Kamelot's enterprise support defines a 4-tier escalation path.

**Escape Analysis** — A compiler optimization determining if allocations can be stack-allocated. Performed by Rust's LLVM backend.

**Eviction** — Removing entries from a cache. Kamelot's query cache uses LRU eviction.

**Event Loop** — A programming construct that waits for events. Kamelot's Tokio runtime implements an event loop.

**Eventual Consistency** — A consistency model where replicas converge over time. Not applicable to Kamelot's single-node model.

**Exabyte** — 1 billion gigabytes. Kamelot is not designed for exabyte-scale storage.

**Exception** — An event that disrupts normal program flow. Rust uses Result and Option instead of exceptions.

**Exclusive Lock** — A lock that prevents concurrent access. Used by Kamelot for flat store write operations.

**Execution Plan** — A strategy for executing a database query. Qdrant's optimizer generates execution plans for search queries.

**Expiration** — The time after which data is invalid. Kamelot's cache entries have configurable TTL expiration.

**Explicit Lifetime** — A Rust annotation specifying how long a reference is valid. Used in Kamelot's public API for safety.

**Exploit** — Code that takes advantage of a vulnerability. Kamelot targets zero exploitable memory safety vulnerabilities.

**Export** — The process of transferring data out of a system. Kamelot supports key export and ledger export.

**Expression** — A combination of values and operators. Rust is an expression-oriented language.

**Extension** — Additional functionality added to a system. Kamelot supports extension via the planned plugin system.

**External Fragmentation** — Free memory broken into small pieces. Not an issue in Kamelot's flat store (contiguous blobs).

**Extract, Transform, Load (ETL)** — A data pipeline pattern. Kamelot's ingestion pipeline follows a read-parse-embed-index flow.

**Extreme Programming (XP)** — An agile software methodology. Not adopted by Kamelot's development process.

---

## F (Extended)

**Fail-fast** — A design principle where systems detect and report failures immediately. Kamelot's daemon fails fast on configuration errors.

**Failover** — Automatic switching to a redundant component. Not applicable to Kamelot's single-node architecture.

**Failure Domain** — A scope of potential failure. Kamelot isolates failure domains between daemon, Qdrant, and Ollama.

**False Negative** — A search result that incorrectly excludes a relevant file. Kamelot targets <5% false negative rate.

**False Positive** — A search result that incorrectly includes an irrelevant file. Kamelot targets <5% false positive rate.

**Fan-out** — Distributing work to multiple workers. Used in Kamelot's parallel ingestion pipeline.

**Fatal Error** — An error that causes program termination. Kamelot logs fatal errors before exiting.

**Fault Tolerance** — The ability to continue operating after failures. Kamelot provides fault tolerance through the immutable ledger.

**Fence** — A memory barrier instruction. Used in Kamelot's lock-free data structures.

**Fiber** — A lightweight thread. Rust's async tasks are comparable to fibers.

**Fibonacci Heap** — A data structure for priority queues. Not used in Kamelot.

**Field** — A component of a struct or database record. Qdrant vectors have associated payload fields.

**FIFO** — First In, First Out. A queue discipline used in Kamelot's ingestion buffer.

**File Allocation Table (FAT)** — A simple filesystem. Kamelot can index files on FAT-formatted drives.

**File Descriptor** — An OS handle for opened files. Kamelot minimizes open file descriptors through connection pooling.

**File Handle** — See File Descriptor.

**File Lock** — A mechanism for restricting file access. Kamelot avoids file locks during read-only access.

**File Offset** — The position in a file for read/write operations. Used in Kamelot's content parsers.

**File System** — A method for storing and organizing files. Kamelot augments the existing filesystem with semantic search.

**File Transfer Protocol (FTP)** — A network protocol for file transfer. Not used by Kamelot.

**Filter** — A criterion for selecting data. Kamelot supports payload filtering in Qdrant queries.

**Finalization** — Cleanup operations before deallocation. Rust's Drop trait provides deterministic finalization.

**Fingerprinting** — Computing a compact identifier for data. Kamelot uses content hashes for file fingerprinting.

**Fire and Forget** — A messaging pattern where the sender does not wait for response. Used in Kamelot's telemetry pipeline.

**Firewall** — A network security system. Kamelot binds to localhost, not requiring firewall configuration.

**Firmware** — Software embedded in hardware. Not managed by Kamelot.

**First-Class Function** — A function that can be passed as a value. Rust supports closures as first-class functions.

**First Result** — The top-ranked search result. Kamelot's accuracy target requires >85% Top-1 accuracy.

**Fixed-Point Arithmetic** — Arithmetic without floating-point errors. Not used in Kamelot (uses f32/f64 for vectors).

**Flag** — A boolean configuration option. Kamelot CLI uses flags like `--verbose`, `--debug`.

**Flaky Test** — A test with non-deterministic results. Kamelot aims to eliminate flaky tests in CI.

**Flash Storage** — Solid-state storage. Kamelot recommends flash storage for optimal performance.

**FlatBuffers** — A serialization library. Not used by Kamelot (uses Protocol Buffers for Qdrant).

**Flattening** — Converting nested structures to flat. Used in Kamelot's ingestion pipeline design.

**Fleet** — A group of managed systems. Kamelot supports fleet management for enterprise deployments.

**Floating Point** — A numerical representation with fractional precision. Kamelot uses f32 for vector embeddings.

**Flooding** — Overwhelming a system with requests. Kamelot's local-only design prevents network flooding.

**Flow Control** — Managing data transmission rates. Kamelot uses backpressure in ingestion.

**Flush** — Writing buffered data to storage. Kamelot flushes the ledger after each write for durability.

**Flyweight Pattern** — A design pattern for memory efficiency. Used in Kamelot's shared model state.

**Folding** — A functional programming operation. Rust's `fold` is used in Kamelot for aggregation operations.

**Footer** — Metadata at the end of a data structure. Various file formats have footers parsed by Kamelot.

**Foreground** — A process that runs with terminal interaction. Kamelot can run in foreground mode for debugging.

**Foreign Function Interface (FFI)** — A mechanism for calling functions in other languages. Kamelot uses FFI for FUSE/WinFSP bindings.

**Fork** — A copy of a process. Kamelot does not use fork for concurrency (uses async tasks instead).

**Formal Verification** — Proving correctness mathematically. Not used by Kamelot (relies on Rust's type system and testing).

**Format String** — A string with placeholders for formatting. Rust's formatting macros are type-safe, preventing format string vulnerabilities.

**Forward Compatibility** — The ability to accept future data formats. Kamelot's data formats include version fields.

**Forward Error Correction (FEC)** — Error correction without retransmission. Not used in Kamelot.

**Fragmentation** — Divided storage space. Kamelot's flat store does not suffer from fragmentation.

**Frame** — In UI, a single image in a rendering sequence. Kamelot targets 60 FPS rendering.

**Framework** — A reusable software platform. Kamelot's philosophy avoids heavy frameworks.

**Free List** — A data structure tracking free memory. Not used in Kamelot (relies on OS allocator).

**FreeBSD** — A Unix-like operating system. Kamelot has planned support for FreeBSD.

**Free Space** — Available storage capacity. Kamelot monitors free space for the flat store and index.

**Free Variable** — A variable not bound in a local scope. In Rust closures, free variables are captured.

**Frequency** — The rate at which something occurs. Query frequency is tracked in Kamelot's telemetry.

**Freshness** — How current data is. Kamelot targets index freshness of <5 minutes.

**Friction** — Anything that slows user progress. Kamelot aims to eliminate friction in file retrieval.

**Frontend** — The user-facing part of software. Kamelot's frontend is the Vello GPU UI and CLI.

**Fronting** — Using a front-end service to access a back-end. Not applicable to Kamelot.

**Full-Text Search** — Searching documents by their text content. Kamelot combines full-text (BM25) with vector search.

**Functional Programming** — A paradigm using pure functions. Rust supports functional programming features.

**Function Call** — The execution of a named routine. Kamelot's hot path minimizes function call overhead.

**FUSE Passthrough** — Forwarding FUSE operations directly. Used in Kamelot's FUSE driver for read operations.

**Fuzz Testing** — Testing with random inputs. Kamelot uses fuzzing for input parsing and IPC validation.

---

## G (Extended)

**Garbage Collector (GC)** — Automatic memory management. Kamelot avoids GC latency by using Rust's ownership model.

**Gaussian Distribution** — A normal distribution. Not used in Kamelot's algorithms.

**General Public License (GPL)** — A copyleft license. WinFSP and libfuse3 use GPL with linking exceptions.

**Generalization** — The ability to handle unseen data. Not directly relevant to Kamelot's inference pipeline.

**Generational Index** — A data structure for safe indexing. Not used in Kamelot.

**Generic** — A type that can work with multiple types. Rust's generics are used throughout Kamelot for type-safe abstractions.

**Geo-Distribution** — Deploying across geographic regions. Not applicable to Kamelot's local architecture.

**Geohash** — A spatial data encoding. Not used in Kamelot.

**Gigabyte (GB)** — 1 billion bytes. Kamelot's daemon uses ~15-30 MB RAM idle.

**Git** — A version control system. Kamelot's source is managed on GitHub.

**Glob Pattern** — A pattern with wildcards for file matching. Used in Kamelot's include/exclude patterns.

**Global State** — Shared state accessible throughout a program. Kamelot minimizes global state for testability.

**Glue Code** — Code connecting different components. Kamelot's orchestrator module contains glue code.

**Goroutine** — Go's lightweight thread. Not used in Kamelot (uses Rust async tasks instead).

**Graceful Degradation** — Maintaining partial functionality after failure. Kamelot can operate without Qdrant or Ollama in degraded mode.

**Graceful Shutdown** — A clean shutdown process. Kamelot's daemon drains active operations before exiting.

**Gradient** — In ML, the derivative of a loss function. Not used in Kamelot's inference-only pipeline.

**Gradient Descent** — An optimization algorithm. Not used in Kamelot.

**Granularity** — The size of the smallest addressable unit. Kamelot's flat store operates at file-level granularity.

**Graph Database** — A database based on graph theory. Not applicable to Kamelot (uses vector database).

**Graphical Shell** — A desktop environment. Kamelot's Omnibox integrates with any graphical shell.

**GraphQL** — A query language for APIs. Not used by Kamelot (uses gRPC and JSON-RPC).

**Greedy Algorithm** — An algorithm making locally optimal choices. Used in HNSW graph construction.

**Group** — A collection of related items. Kamelot supports grouping files by type, date, and project.

**Guard** — A protection mechanism. Kamelot uses mutex guards for shared state.

**Guard Page** — Memory pages with no access rights. Used for stack overflow detection.

**Guest** — In virtualization, the operating system running in a VM. Kamelot runs as a guest application.

**Guideline** — A recommended practice. Kamelot's documentation provides guidelines for configuration.

---

## H (Extended)

**Hack** — A quick, inelegant solution. Kamelot's codebase aims for clean, maintainable code.

**Hamming Distance** — A measure of string difference. Not used by Kamelot (uses cosine similarity).

**Handle** — An abstraction for a resource. Kamelot uses handles for file access via FUSE.

**Handshake** — The initial communication establishing a connection. Kamelot performs handshakes with Qdrant and Ollama on startup.

**Hang** — A state where a program stops responding. Kamelot detects hangs via watchdog timers.

**Hard Disk Drive (HDD)** — A mechanical storage device. Kamelot works on HDDs but recommends SSDs for indexing.

**Hard Link** — A directory entry pointing to the same inode. Kamelot treats hard links as separate files.

**Hard Real-Time** — A system where missed deadlines cause failure. Kamelot is not a hard real-time system.

**Hardening** — Securing a system against attacks. Kamelot's security hardening includes encryption, memory safety, and process isolation.

**Hardware Abstraction Layer (HAL)** — An interface between hardware and software. Kamelot uses wgpu as a GPU abstraction layer.

**Hardware Acceleration** — Using hardware for faster processing. Kamelot uses GPU acceleration for embedding generation.

**Harmonic Mean** — An average of rates. Used in F1 score calculation for search accuracy.

**Hash** — The output of a hash function. Kamelot uses hashes for content integrity and lookups.

**Hash Chain** — A sequence where each entry includes the hash of the previous. The .aioss ledger uses a hash chain.

**Hash Collision** — Two inputs producing the same hash. Cryptographic hashes make collisions infeasible.

**Hash Map** — A data structure mapping keys to values using hash functions. Used in Kamelot's metadata store.

**Hash Set** — A set implementation using hash functions. Used in Kamelot for deduplication.

**Hash Table** — See Hash Map.

**Hashed Password** — A password transformed by a hash function. Kamelot uses Argon2id for password hashing.

**Hazard Pointer** — A technique for safe memory reclamation. Not used in Kamelot.

**Head** — The current position or latest state. In ledger context, the head is the most recent entry.

**Header** — Metadata at the beginning of a data structure. Kamelot parses file headers for format detection.

**Heap** — A region of memory for dynamic allocation. Rust manages the heap through ownership.

**Heap Memory** — Dynamically allocated memory. Kamelot minimizes heap allocation in the query path.

**Heap Profiling** — Analyzing heap memory usage. Kamelot uses tools like heaptrack and jemalloc stats.

**Heartbeat** — A periodic signal indicating liveness. Used in Kamelot's daemon health monitoring.

**Help** — Documentation or guidance. Kamelot provides help via `kml help`, docs, and community.

**Heresy** — In software, an unconventional choice. Kamelot's choice of Rust GPU UI over Electron is considered heresy by some.

**Heritage** — The legacy of software design. Kamelot's heritage includes Plan 9's per-process namespaces and Bell Labs research.

**Heterogeneous** — Composed of different elements. Kamelot handles heterogeneous file types and formats.

**Heuristic** — A practical problem-solving approach. HNSW uses heuristics for graph construction.

**Hex Dump** — A hexadecimal representation of binary data. Used in debugging binary file parsing.

**Hidden Markov Model (HMM)** — A statistical model. Not used in Kamelot.

**Hierarchical** — Organized in a tree structure. The traditional filesystem is hierarchical; Kamelot is semantic.

**High Availability (HA)** — A system designed to be continuously operational. Kamelot targets 99.9% availability.

**High Water Mark** — The maximum observed value. Used in buffer sizing and cache limits.

**Hindsight** — Understanding after the fact. Kamelot documents lessons learned in BDRs.

**Hold** — A temporary pause in processing. Used in Kamelot's backpressure mechanism.

**Honeypot** — A decoy system for detecting attacks. Not used by Kamelot.

**Hook** — A point where custom code can be injected. Kamelot's FUSE driver uses operation hooks.

**Hop** — A step in a network path. K-Swarm mesh uses multiple hops for distributed queries.

**Horizontal Scaling** — Adding more machines to handle load. Kamelot scales horizontally via Qdrant sharding.

**Host** — A computer running software. Kamelot runs on the host operating system.

**Hot Path** — The most frequently executed code path. Kamelot's hot path is the query pipeline.

**Hot Reload** — Updating code without restarting. Not supported by Kamelot's compiled Rust binary.

**Hotfix** — An urgent bug fix. Kamelot distributes hotfixes through package managers.

**Hue** — A color property. Not directly relevant to Kamelot.

**Human-Readable** — Easily understood by humans. Kamelot's CLI output is human-readable with JSON option.

**Hybrid Cloud** — Combining cloud and on-premises infrastructure. Kamelot is designed for on-premises but can run in hybrid setups.

**Hyper-threading** — Intel's simultaneous multithreading. Kamelot benefits from hyper-threading for parallel ingestion.

**Hyperconverged Infrastructure** — Integrated compute, storage, and networking. Not relevant to Kamelot.

**Hypervisor** — Software creating virtual machines. Kamelot can run on hypervisors like VMware and Hyper-V.

**Hypothesis** — A proposed explanation. Kamelot uses A/B testing for feature validation.

---

## I (Extended)

**I/O-bound** — Performance limited by input/output. Kamelot is I/O-bound during ingestion and CPU/GPU-bound during search.

**ICMP** — Internet Control Message Protocol. Not used by Kamelot.

**Icon** — A pictorial representation. Kamelot generates file thumbnails as icons in the UI.

**IDE (Integrated Development Environment)** — Software for development. Kamelot integrates with IDEs via FUSE mount.

**Identifier** — A name identifying an entity. Kamelot uses inode numbers as file identifiers.

**Idempotent** — An operation that has the same effect whether executed once or multiple times. Kamelot's index operation is idempotent.

**Idle** — The state of being inactive. Kamelot's daemon uses minimal resources when idle.

**Immediate Mode GUI (IMGUI)** — A GUI paradigm where UI is rebuilt each frame. The Vello UI uses a retained-mode approach.

**Immutable** — Cannot be changed after creation. Kamelot's .aioss ledger is immutable.

**Imperative** — A programming paradigm using statements. Rust supports both imperative and functional styles.

**Implementation** — The actual code realizing a specification. Kamelot's implementation follows the BDR specifications.

**Import** — Bringing external code into scope. Kamelot's Rust code uses `use` declarations for imports.

**In-Place** — Modifying data without copying. Kamelot's parsing avoids in-place modification of file content.

**Incident** — An unexpected event. Kamelot provides incident response procedures.

**Inclusive** — Designed to be accessible. Kamelot's community follows an inclusive Code of Conduct.

**Increment** — An addition of one. Ledger sequence numbers increment monotonically.

**Incremental Backup** — Backing up only changed data. Kamelot's ledger enables incremental backup strategies.

**Incremental Indexing** — Indexing only new or changed files. Kamelot's file watcher triggers incremental indexing.

**Indentation** — The placement of whitespace to show structure. Kamelot uses 4-space indentation in Rust code.

**Index** — A data structure for fast lookup. Kamelot uses Qdrant's HNSW index for vector search.

**Indexer** — A component that builds and maintains an index. Kamelot's ingestion pipeline is the indexer.

**Indicator** — A metric signaling system state. Kamelot tracks leading and lagging indicators for performance.

**Indirection** — Accessing data through a reference. Kamelot minimizes indirection in hot paths.

**Induction** — Generalizing from specific observations. Not directly applicable.

**Inference** — The process of running a trained model. Kamelot performs inference for embedding generation.

**Infinite Loop** — A loop that never terminates. Rust prevents infinite loops only through testing.

**Information Retrieval (IR)** — The science of searching information. Kamelot is an information retrieval system.

**Information Leak** — Unintended exposure of information. Kamelot prevents this through encryption and local processing.

**Infrastructure** — The underlying system components. Kamelot's infrastructure includes the OS, Qdrant, Ollama, and storage.

**Ingestion** — The process of bringing data into a system. Kamelot's ingestion pipeline handles reading, parsing, embedding, and indexing.

**Initialization** — Setting up initial state. Kamelot's `kml init` command performs initialization.

**Initialization Vector (IV)** — See Nonce.

**Inlining** — A compiler optimization replacing a function call with the function body. Rust's LTO enables aggressive inlining.

**Inner Join** — A database join operation. Not applicable to Qdrant.

**Input Validation** — Checking input for correctness. Kamelot validates user input at the CLI and API boundaries.

**Insertion** — Adding new data. Kamelot inserts file embeddings into Qdrant during indexing.

**Inspection** — Examining data or code. Kamelot supports ledger inspection via `kml ledger` commands.

**Instance** — A single running copy of software. Each Kamelot installation is an instance.

**Instruction** — A single CPU operation. Kamelot's performance-sensitive code compiles to efficient instructions.

**Instrumentation** — Code that collects performance data. Kamelot's telemetry framework provides instrumentation.

**Integer Overflow** — When integer arithmetic exceeds representable range. Rust detects integer overflow in debug mode.

**Integration** — Combining components into a working system. Kamelot integrates with Qdrant, Ollama, and the OS filesystem.

**Integrity** — The assurance that data is unaltered. Kamelot provides integrity via content hashes and AEAD encryption.

**Intellectual Property (IP)** — Legal rights to creations. Kamelot is open source under permissive licenses.

**Intensive** — Demanding significant resources. Embedding generation is GPU-intensive.

**Intent** — A user's goal or purpose. Kamelot matches search intent via semantic understanding.

**Interactive** — Responding to user input in real-time. Kamelot's Omnibox provides interactive search.

**Interface** — A shared boundary between components. Kamelot defines interfaces for pluggable backends.

**Interleaving** — Alternating execution of multiple tasks. Kamelot's async runtime interleaves tasks efficiently.

**Intermittent** — Occurring at irregular intervals. Kamelot handles intermittent failures with retry logic.

**Internal Fragmentation** — Wasted space within allocated blocks. Not significant in Kamelot's flat store.

**Internationalization (i18n)** — Designing for multiple languages. Kamelot's UI supports multiple languages (i18n planned).

**Interpolation** — Estimating values between known points. Not used in Kamelot.

**Interpretation** — Translating and executing code. Kamelot is compiled, not interpreted.

**Interpreter** — A program that executes code directly. Not applicable to Kamelot's compiled Rust binary.

**Interrupt** — A signal to the processor. Kamelot's async runtime does not use interrupts.

**Interval** — A time period. Kamelot's indexing interval is configurable.

**Intrinsic** — Built-in compiler functions. Rust intrinsics are used in Kamelot's performance-critical sections.

**Inverse Document Frequency (IDF)** — A measure of how rare a term is. Used in BM25 ranking.

**Invocation** — The act of calling a function. Kamelot's CLI is invoked via the `kml` command.

**Involuntary Context Switch** — A forced CPU context switch. Kamelot minimizes these through efficient scheduling.

**IP Address** — Internet Protocol address. Kamelot binds to 127.0.0.1 by default.

**IPC (Inter-Process Communication)** — Communication between processes. Kamelot uses Unix sockets and named pipes.

**IRQ** — Interrupt Request. Not managed by Kamelot.

**Island** — An isolated system. Kamelot can operate as an air-gapped island system.

**Isolation** — Separating components for security. Kamelot isolates the daemon, Qdrant, and Ollama processes.

**Issue** — A problem or task to be tracked. Kamelot uses GitHub Issues for bug tracking.

**Iterator** — A Rust trait for sequential access. Used extensively in Kamelot for efficient data processing.

**I/O** — Input/Output. Kamelot manages file I/O for indexing and search.

---

## J

**Jacketing** — Limiting resource usage. Kamelot supports CPU and I/O throttling for indexing.

**Jail** — A FreeBSD security mechanism. Not used by Kamelot.

**Jam** — A situation where buffers are full. Handled via backpressure.

**Jar** — A Java archive. Not used by Kamelot (Rust package format is crate).

**Jargon** — Specialized terminology. This glossary defines Kamelot jargon.

**Java** — A programming language. Not used by Kamelot.

**JavaScript** — A scripting language. Not used in Kamelot's native UI.

**Jitter** — Variation in latency. Kamelot targets low jitter for consistent query performance.

**Job** — A unit of work. Kamelot's ingestion pipeline processes files as jobs.

**Join** — Combining data from multiple sources. Not applicable to Qdrant vector search.

**Journal** — An append-only log. The .aioss ledger is Kamelot's journal.

**Journaling** — Recording operations for crash recovery. The .aioss ledger provides journaling.

**JSON** — JavaScript Object Notation. Kamelot supports JSON log format and JSON output for CLI.

**JSON-RPC** — A remote procedure call protocol using JSON. Kamelot's daemon exposes a JSON-RPC API.

**Jumbo Frame** — A network frame larger than 1500 bytes. Not relevant to Kamelot's local architecture.

**Jump** — A branch instruction. Not directly managed in Rust.

**Just-in-Time (JIT)** — Compilation at runtime. Not used in Kamelot.

**Jupyter Notebook** — An interactive computing environment. Kamelot can index .ipynb files.

**Jurisdiction** — Legal authority. Kamelot's self-hosted model avoids jurisdictional data issues.

**Just Works** — A product philosophy. Kamelot aims for a "just works" installation experience.

---

## K (Extended)

**K-Means** — A clustering algorithm. Not used directly in Kamelot.

**K-Nearest Neighbors (KNN)** — A classification algorithm. Vector search is a form of KNN retrieval.

**Kernel** — The core of an operating system. Kamelot interacts with the kernel via FUSE.

**Kernel Module** — A kernel extension. WinFSP is a kernel module; FUSE-T avoids kernel modules.

**Key Derivation** — Generating cryptographic keys from a secret. Kamelot uses HKDF for key derivation.

**Key Management** — Handling cryptographic keys. Kamelot manages encryption keys locally.

**Key Rotation** — Replacing old keys with new ones. Kamelot supports key rotation via `kaml keys rotate`.

**Key-Value Store** — A database using key-value pairs. sled is an embedded key-value store used by Kamelot.

**Keyboard Shortcut** — A key combination for quick actions. Kamelot uses `Ctrl+Space` for the Omnibox.

**Keyword Search** — Searching by exact word matching. Kamelot combines keyword search (BM25) with semantic search.

**Killer App** — An application compelling enough to justify platform adoption. Kamelot aims to be a killer app for self-sovereign storage.

**Kilobyte (KB)** — 1000 bytes. Kamelot's daemon log output is typically a few KB per query.

**Kinetic Storage** — Storage using mechanical movement. Not applicable.

**Kolmogorov Complexity** — A measure of information content. Not used in Kamelot.

**Kernel Same-page Merging (KSM)** — A memory deduplication technique. Not used by Kamelot.

---

## L (Extended)

**Label** — An descriptive identifier. Kamelot supports user-defined labels for files.

**Lag** — Delay between cause and effect. Kamelot tracks indexing lag (time from file creation to searchable).

**LAN** — Local Area Network. Kamelot services bind to localhost, not LAN.

**Landing Zone** — A destination for data. The flat store is the landing zone for encrypted file blobs.

**Large Language Model (LLM)** — An AI model for language tasks. Kamelot uses VLM (Vision-Language Model), not LLM.

**Last Mile** — The final step of a process. The FUSE mount is the last mile of file retrieval.

**Latency** — Time delay. Kamelot targets sub-100ms search latency.

**Latent** — Existing but not yet developed. Kamelot's potential for multi-user support is latent.

**Launch** — Starting a program. Kamelot launches on system startup via service configuration.

**Layer** — A level of abstraction. Kamelot operates as a layer above the filesystem.

**Layout** — The arrangement of elements. Kamelot's UI layout is optimized for search efficiency.

**Lazy** — Deferred until needed. Kamelot uses lazy initialization for some components.

**Leak** — A resource that is not properly released. Rust prevents memory leaks through ownership.

**Leap Second** — An adjustment to atomic time. Handled by the OS, not Kamelot.

**Learning Rate** — A machine learning hyperparameter. Not used in Kamelot's inference pipeline.

**Least Recently Used (LRU)** — A cache eviction policy. Kamelot's query cache uses LRU eviction.

**Least Privilege** — A security principle granting minimum necessary access. Kamelot's daemon runs with user-level privileges.

**Legacy** — Outdated technology. Kamelot aims to replace legacy hierarchical file search.

**Lemon** — A parser generator. Not used by Kamelot (uses hand-written parsers).

**Lexer** — A tokenizer for parsing. Kamelot uses custom lexers for file format parsing.

**Lexical** — Relating to words. Lexical search matches exact words; semantic search matches meaning.

**Library** — A collection of reusable code. Kamelot is distributed as a standalone binary with library crates.

**License** — A legal instrument governing use. Kamelot uses MIT / Apache 2.0 for core components.

**Lifetime** — In Rust, the period a reference is valid. Kamelot uses explicit lifetimes in safe FFI.

**Ligature** — A typographic feature. Not applicable.

**Likelihood** — A probability measure. Not used in Kamelot.

**Linear Scan** — A sequential search. Brute-force search is linear; HNSW avoids linear scans.

**Lineage** — The origin of data. Kamelot's .aioss ledger tracks file lineage.

**Linked List** — A data structure of linked nodes. Not commonly used in Kamelot.

**Linker** — A tool combining object files. Kamelot uses LLVM's lld linker.

**Lint** — A static analysis tool. Kamelot uses Clippy for Rust linting.

**List Comprehension** — A concise list creation syntax. Not available in Rust.

**Literal** — A fixed value in source code. Kamelot uses string and numeric literals in configuration.

**Little Endian** — Byte order with least significant byte first. Kamelot handles both endianness.

**Live Migration** — Moving a running system. Not applicable to Kamelot.

**Load Average** — System load metric. Kamelot monitors load average for performance.

**Load Balancer** — Distributing traffic across servers. Not needed for Kamelot's local architecture.

**Loader** — Software loading programs into memory. Not managed by Kamelot.

**Localhost** — The local computer's loopback address. Kamelot services bind to localhost.

**Localization (l10n)** — Adapting to local languages. Planned for Kamelot's UI.

**Lock** — A synchronization primitive. Kamelot minimizes lock contention through lock-free data structures.

**Lock Contention** — Multiple threads waiting for the same lock. Kamelot avoids this through async design.

**Lock-Free** — A concurrency approach without locks. Used in Kamelot's telemetry pipeline.

**Log** — A record of events. Kamelot's structured logging provides detailed operational records.

**Logarithmic** — Scaling logarithmically. HNSW search time scales logarithmically with index size.

**Logging** — The practice of recording events. Kamelot uses the tracing crate for structured logging.

**Logic Error** — A programming mistake in logic. Caught by Rust's type system and testing.

**Logical** — Relating to abstract reasoning. Kamelot's semantic search uses logical content understanding.

**Long Polling** — A technique for receiving updates. Not used by Kamelot.

**Loop** — A repeating code structure. Kamelot's event loop handles asynchronous operations.

**Loose Coupling** — Minimizing dependencies between components. Kamelot's pluggable backends are loosely coupled.

**Loss** — In compression, data lost. Embedding quantization introduces minimal loss.

**Loss Function** — An ML optimization objective. Not used in Kamelot's inference.

**Lossless** — Compression without data loss. Kamelot stores files without compression (encrypted).

**Lowering** — A compiler transformation. Not directly relevant.

**Low-Level** — Close to hardware. Kamelot's FUSE driver operates at a low level.

**Luminance** — Measurement of light intensity. Not relevant.

---

## M (Extended)

**M.2** — A form factor for SSDs. Recommended for Kamelot's index storage.

**Machine Code** — Binary instructions executed by CPU. Kamelot compiles to native machine code.

**Machine Learning (ML)** — AI that learns from data. Kamelot uses ML for embedding generation.

**Macro** — Code that generates code. Kamelot uses Rust macros for logging and serialization.

**Magic Number** — A constant with unexplained value. Kamelot avoids magic numbers in configuration.

**Magnetic Tape** — A sequential storage medium. Not used by Kamelot.

**Main Memory** — RAM. Kamelot requires sufficient RAM for the HNSW index.

**Maintainability** — Ease of maintenance. Kamelot prioritizes maintainable code through Rust's type system.

**Major Version** — A significant release. Kamelot follows semantic versioning.

**Malformed** — Incorrectly formatted. Kamelot handles malformed files gracefully during parsing.

**Malware** — Malicious software. Kamelot's architecture provides ransomware resistance.

**Man-In-The-Middle (MITM)** — An attack intercepting communication. Kamelot's local-only design prevents MITM.

**Manageability** — Ease of management. Kamelot provides CLI and config file management.

**Mandatory Access Control (MAC)** — System-enforced access control. Not yet implemented in Kamelot.

**Manifest** — A file listing package contents. Kamelot's release downloads include manifest files.

**Manual** — Documentation for users. This glossary is part of Kamelot's manual.

**Many-to-Many** — A relationship where multiple items relate to multiple others. Files can belong to multiple Synthetic Workspaces.

**Mapping** — Associating elements. Kamelot maps inodes to file metadata in sled.

**Mask** — A pattern for bitwise operations. Used in low-level operations.

**Massively Parallel** — Highly parallel processing. GPU inference is massively parallel.

**Master Key** — The top-level encryption key. Kamelot derives all file keys from the master key.

**Materialization** — Making something concrete. Kamelot materializes virtual files through FUSE.

**Mathematical Optimization** — Finding the best solution. HNSW optimizes for approximate nearest neighbor search.

**Matrix** — A rectangular array of numbers. Vectors are single-column matrices.

**Mature** — Well-established and stable. Kamelot's dependencies are chosen for maturity.

**Maximum Transmission Unit (MTU)** — Largest network packet. Not relevant.

**Mean** — The average. Kamelot tracks mean query latency.

**Mean Reciprocal Rank (MRR)** — An information retrieval metric. Not used in Kamelot's primary metrics.

**Measure** — A quantifiable observation. Kamelot's North Star Metric is a measure.

**Mechanical Sympathy** — Designing software for hardware characteristics. Kamelot's design considers cache hierarchies and I/O patterns.

**Median** — The middle value. Kamelot tracks median query latency alongside p95.

**Medium** — The storage material (e.g., HDD, SSD). Kamelot performs differently on different media.

**Member** — A component of a group. Community members are part of the Kamelot community.

**Memoization** — Caching function results. Used in Kamelot's query cache.

**Memory** — Computer storage (RAM). Kamelot's memory usage depends on index size and model.

**Memory Bandwidth** — The rate of memory data transfer. Important for HNSW index traversal.

**Memory Leak** — Unreleased memory. Rust prevents most memory leaks through ownership.

**Memory-Mapped File** — A file mapped to memory. Qdrant supports memory-mapped HNSW indexes.

**Memory Ordering** — CPU instruction ordering. Not managed directly by Kamelot.

**Menu** — A UI element listing options. The Omnibox can function as an application launcher.

**Merge** — Combining data from multiple sources. Kamelot merges vector and keyword search results.

**Mesh Network** — A network where each node connects to multiple others. K-Swarm uses mesh topology.

**Message** — A unit of communication. Kamelot uses messages for IPC.

**Message Queue** — A buffer for messages. Not used in Kamelot.

**Metadata** — Data describing other data. Kamelot indexes file metadata for search filtering.

**Metaprogramming** — Programs that manipulate programs. Rust macros enable limited metaprogramming.

**Method** — A function associated with a type. Kamelot uses methods extensively.

**Metric** — A quantifiable measurement. Kamelot tracks product, performance, and business metrics.

**Microbenchmark** — A small, focused performance test. Kamelot uses microbenchmarks for critical paths.

**Microservice** — An independently deployable service. Kamelot's daemon, Qdrant, and Ollama form a microservice architecture.

**Middleware** — Software between OS and applications. The FUSE driver is middleware.

**Migration** — Moving between versions. Kamelot provides migration documentation.

**MIMD** — Multiple Instruction, Multiple Data. A parallel computing classification.

**Minification** — Reducing file size. Not applicable to Rust.

**Minimal** — As small as possible. Kamelot's Rust binary is minimal.

**Minimum Viable Product (MVP)** — The smallest useful product. Kamelot's v1.0 is the MVP.

**Mirror** — A replica of data. RAID 1 mirrors data for redundancy.

**Mitigation** — Reducing the severity of a threat. Kamelot's append-only ledger mitigates ransomware.

**Mixin** — A class providing functionality to other classes. Rust uses traits instead of mixins.

**Mobile** — Portable computing. Kamelot has planned mobile support.

**Mock** — A test double. Kamelot's mock embedding backend enables testing without AI models.

**Modal** — A UI element requiring interaction. The Omnibox is a modal search interface.

**Mode** — A configuration state. Kamelot supports offline, online, and mock modes.

**Model** — A machine learning model. Kamelot uses Qwen 2 VL for embedding generation.

**Modem** — A network device. Not relevant.

**Modular** — Composed of independent modules. Kamelot's codebase is modular.

**Modulo** — A mathematical operation. Used in hashing algorithms.

**Monitor** — A tool for observing state. Kamelot provides `kml doctor` for system monitoring.

**Monolithic** — A single large component. Kamelot's daemon is monolithic for simplicity.

**Monte Carlo** — A class of randomized algorithms. Not used in Kamelot.

**Mount** — Making a filesystem accessible. Kamelot mounts the virtual drive via FUSE.

**Mount Point** — The directory where a filesystem is mounted. /kml (Linux) or K:\ (Windows).

**Mutex** — Mutual exclusion lock. Used sparingly in Kamelot.

**Mutual Exclusion** — Preventing concurrent access. Kamelot uses async tasks, not mutexes for concurrency.

---

## N (Extended)

**Namespace** — A container for identifiers. Kamelot's inode namespace is flat.

**Naming Convention** — A standard for names. Kamelot follows Rust naming conventions.

**Nanosecond (ns)** — 10^-9 seconds. Kamelot's log timing uses millisecond precision.

**NAS** — Network Attached Storage. Kamelot can index files on NAS devices.

**Native** — Running directly on hardware. Kamelot compiles to native code.

**Natural Language** — Human language. Kamelot accepts natural language queries.

**Natural Language Processing (NLP)** — AI for human language. Kamelot uses NLP for query understanding.

**Navigation** — Moving through a UI. Kamelot minimizes navigation for file access.

**Nearest Neighbor** — The closest data point in a metric space. Vector search finds nearest neighbors.

**Needle** — A searched-for item. The file is the needle in the filesystem haystack.

**Nesting** — Placing structures inside others. Kamelot's flat store avoids nesting.

**Network** — Interconnected computers. Kamelot is offline-first but can use LAN for multi-user.

**Network Effect** — Increasing value with more users. Kamelot benefits from community network effects.

**Neural Network** — An AI model inspired by brains. Qwen 2 VL is a neural network.

**Neuron** — A unit in a neural network. Not directly referenced in Kamelot.

**Neutral** — Impartial. Kamelot supports all file types equally.

**Node** — A point in a graph or network. HNSW's graph structure has nodes.

**Noise** — Random variations. Kamelot filters noise in search results.

**Non-Blocking** — An operation that does not block execution. Kamelot uses non-blocking I/O.

**Non-Deterministic** — Not predictable. Hash table iteration is non-deterministic in some implementations.

**Non-Functional Requirement** — A quality attribute (performance, security). Kamelot documents non-functional requirements in BDRs.

**Non-Volatile Memory (NVM)** — Memory that retains data without power. SSDs are non-volatile.

**Nonce** — A number used once in cryptography. XChaCha20 uses a 192-bit nonce.

**Normal Distribution** — A bell-shaped distribution. Query latency may follow a normal distribution.

**Normal Form** — A database design principle. Not applicable to vector databases.

**Normalization** — Scaling data to a standard range. Embeddings are normalized for cosine similarity.

**Norm** — The length of a vector. Cosine similarity uses normalized vectors.

**Notebook** — An interactive document. Kamelot can index Jupyter notebooks.

**Notification** — An alert to the user. Kamelot provides desktop notifications for indexing milestones.

**Nudge** — A gentle prompt. Kamelot's UI nudges users toward effective queries.

**Null** — The absence of a value. Rust eliminates null pointers.

**Null Pointer** — A pointer pointing to nothing. Rust uses Option instead of null.

**Number Crunching** — Intensive numerical computation. Embedding generation is number crunching.

**Numeric** — Relating to numbers. Vector embeddings are numeric representations.

**NUMA** — Non-Uniform Memory Access. Kamelot benefits from NUMA-aware memory allocation.

**Nvidia** — A GPU manufacturer. Kamelot supports Nvidia GPUs via CUDA.

---

## O (Extended)

**Object** — A data structure with fields. In Rust, structs are objects.

**Object Code** — Compiled machine code. Kamelot distributes compiled object code as binaries.

**Object-Oriented** — A paradigm using objects. Rust supports OOP patterns through traits.

**Obfuscation** — Making code difficult to understand. Not used by Kamelot.

**Observation** — A recorded data point. Telemetry observations are stored locally.

**Off-by-One** — A common programming error. Rust's type system catches off-by-one errors in indexing.

**Offline** — Not connected to a network. Kamelot is fully functional offline.

**Offsourcing** — Delegating work externally. Not applicable.

**Omit** — Leave out. Kamelot omits unnecessary features for simplicity.

**One-Click** — Very simple operation. Kamelot aims for one-click installation.

**One-to-Many** — A relationship where one item relates to many. One query can return many files.

**One-to-One** — A relationship where one item relates to one other. One inode maps to one file.

**Online** — Connected to a network. Kamelot works both online and offline.

**Ontology** — A formal representation of knowledge. Not used by Kamelot.

**Opacity** — Lack of transparency. Kamelot's AI model is not fully opaque (open-source model).

**Open** — Accessible and modifiable. Kamelot is open source.

**Open Core** — A model with a free core and paid extras. Kamelot follows the open-core model.

**Open Source** — Software with source code available. Kamelot's core is open source.

**Operating System (OS)** — System software managing hardware. Kamelot runs on Linux, Windows, and macOS.

**Operation** — A single action or function. File operations are recorded in the ledger.

**Operational Database** — A database for day-to-day operations. sled is Kamelot's operational metadata store.

**Operator** — A symbol for an operation. Not directly applicable.

**Opt-In** — Choosing to participate. Telemetry is opt-in.

**Optical** — Related to light. Optical storage (CD/DVD) is not recommended.

**Optimistic Concurrency** — Assuming conflicts are rare. Not applicable to single-user Kamelot.

**Optimization** — Making more efficient. Kamelot continuously optimizes performance.

**Option** — A Rust type for optional values. Replaces null pointers.

**Orchestration** — Coordinating multiple services. Kamelot orchestrates Qdrant and Ollama.

**Order** — A sequence or arrangement. Search results are ordered by relevance.

**Ordinal** — A position in an order. Result rank is an ordinal.

**Orphan** — An unlinked resource. The garbage collector reclaims orphaned blobs.

**Orthogonal** — Independent and unrelated. Features should be orthogonal for maintainability.

**OS-Level Virtualization** — Containerization. Kamelot can run in containers.

**Outage** — A period of unavailability. Kamelot's local architecture minimizes outage risk.

**Outbound** — Outgoing traffic. Kamelot has minimal outbound traffic.

**Outlier** — An extreme value. Query latency outliers are investigated.

**Output** — The result of processing. Search results are the output of a query.

**Over-Engineering** — Making more complex than needed. Kamelot avoids over-engineering.

**Overhead** — Extra resource usage. Kamelot's overhead is minimal.

**Overlap** — Shared area. Synthetic Workspaces can overlap.

**Override** — Replace a default behavior. Configuration overrides defaults.

**Overflow** — Exceeding capacity. Rust detects arithmetic overflow in debug mode.

**Overhead** — See Overhead.

**Overlay** — A virtual layer over another system. FUSE creates an overlay filesystem.

**Oversubscription** — Allocating more resources than available. Not recommended for Kamelot.

**Ownership** — Rust's memory management model. Kamelot relies on ownership for safety.

---

## P (Extended)

**Package** — A distributable unit of software. Kamelot is distributed via package managers.

**Package Manager** — Software managing packages. Kamelot supports Homebrew, APT, Snap, Chocolatey.

**Packing** — Compressing data. Not applicable to encrypted blobs.

**Padding** — Extra bytes for alignment. Cryptographic padding may be used.

**Page** — A fixed-size memory block. Virtual memory uses pages.

**Page Cache** — OS cache for file pages. Kamelot benefits from the page cache.

**Page Fault** — An interrupt when accessing unmapped memory. Minimized in Kamelot's hot path.

**Pagination** — Dividing results into pages. Kamelot supports paginated search results.

**Pair Programming** — Two developers sharing one workstation. Not directly relevant.

**Panic** — Rust's unrecoverable error. Kamelot's daemon should not panic in production.

**Parallel** — Simultaneous execution. Kamelot parallelizes file ingestion.

**Parallelism** — Executing multiple tasks simultaneously. Kamelot uses both concurrency and parallelism.

**Parameter** — A configurable value. HNSW parameters affect accuracy and performance.

**Parameterization** — Making behavior configurable. Kamelot's algorithm parameters are configurable.

**Parity** — Error detection using bit counts. RAID 5 uses parity.

**Parse** — Analyze a string or file. Kamelot parses file contents for indexing.

**Parser** — A component that parses input. Kamelot has parsers for many file formats.

**Partial Application** — Fixing some function arguments. Rust closures enable partial application.

**Partition** — A division of data. Qdrant partitions vectors into segments.

**Partition Tolerance** — A CAP theorem property. Not applicable to single-node Kamelot.

**Passphrase** — A sequence of words for authentication. Kamelot uses recovery phrases.

**Password** — A secret for authentication. Optional for Kamelot's encryption.

**Password Manager** — Software storing passwords. Recommended for storing Kamelot recovery keys.

**Patch** — An update fixing issues. Kamelot uses semantic versioning for patches.

**Path** — A filesystem location. Kamelot finds files without requiring the path.

**Path Traversal** — An attack accessing unauthorized files. Kamelot's FUSE driver prevents this.

**Pattern** — A recurring solution. Kamelot uses design patterns from Rust ecosystem.

**Payload** — Data associated with a vector. Qdrant payloads store file metadata.

**Peak** — The maximum value. Peak memory usage occurs during large index builds.

**Peer** — An equal node in a network. K-Swarm peers share indexes.

**Pending** — Awaiting completion. Pending queries are queued.

**Penetration Testing** — Security testing by simulated attack. Planned for Kamelot v1.0.

**Per-Second** — A rate measurement. Kamelot measures files indexed per second.

**Percentile** — A value below which a given percentage falls. Kamelot tracks p50, p95, p99 latency.

**Perceptron** — A simple neural network unit. Not directly relevant.

**Performance** — The speed and efficiency of a system. Kamelot's performance is a core focus.

**Permission** — Authorization to access. Kamelot relies on OS file permissions.

**Persistence** — Data lasting beyond program execution. Kamelot persists data in the flat store and ledger.

**Pessimistic Concurrency** — Assuming conflicts are likely. Not applicable.

**Phantom Read** — A database isolation issue. Not applicable to Qdrant.

**Phase** — A stage in a process. Indexing has multiple phases.

**Philosophy** — A guiding principle. Kamelot's philosophy is zero-knowledge, self-sovereign storage.

**Phishing** — A social engineering attack. Not directly prevented by Kamelot.

**Photorealistic** — Resembling a photograph. Not applicable to Kamelot's UI.

**Physical** — Related to hardware. Physical access to the machine can bypass software security.

**Piece** — A part of a whole. Files are pieces of the user's information landscape.

**Pipeline** — A sequence of processing stages. Kamelot's ingestion pipeline processes files.

**Pivot** — A strategic change in direction. Not applicable.

**Pixel** — A picture element. Kamelot's UI renders at native resolution.

**Placebo** — An inactive treatment. Not applicable.

**Plaintext** — Unencrypted data. Plaintext file content is encrypted before storage.

**Platform** — The operating environment. Kamelot supports three major platforms.

**Plausible Deniability** — A security property. Not provided by Kamelot.

**Plugin** — An extension module. Kamelot plans a plugin system.

**Point** — A single unit in Qdrant. Each file is a point in the Qdrant collection.

**Pointer** — A memory address. Rust references are safe pointers.

**Poison** — A corrupted or invalid state. Mutex poisoning in Rust protects against inconsistent state.

**Policy** — A set of rules. Kamelot's backup policy recommends 3-2-1 strategy.

**Polling** — Repeatedly checking for events. Kamelot uses event-driven file watching, not polling.

**Polymorphism** — Many forms. Rust traits enable polymorphism.

**Pool** — A collection of reusable resources. Kamelot uses connection pools.

**Popcount** — Population count (bit counting). Not used.

**Port** — A network endpoint. Kamelot uses ports 6333, 6334, 11434, 9010, 9011.

**Portability** — Ability to run on multiple platforms. Kamelot is designed for portability.

**Portal** — A web-based gateway. Kamelot's support portal is at support.kamelot.ai.

**Positional Encoding** — Encoding position in sequences. Used in transformer models like Qwen 2 VL.

**Post-Mortem** — An analysis after an incident. Kamelot recommends post-mortems for security incidents.

**PostgreSQL** — A relational database. Not used by Kamelot (uses Qdrant).

**Power Law** — A relationship where one quantity varies as a power of another. File sizes often follow a power law distribution.

**Pre-Aggregation** — Pre-computing summaries. Not used by Kamelot.

**Precision** — The fraction of relevant results among retrieved results. Kamelot targets high precision.

**Preference** — A user's chosen setting. Kamelot stores preferences in config.toml.

**Prefix** — A beginning of a string. Used in search autocomplete.

**Preprocessing** — Preparing data for analysis. Kamelot preprocesses files for embedding.

**Prestige** — Reputation or influence. Not applicable.

**Pretty Print** — Formatting for readability. Kamelot's CLI output is pretty-printed.

**Prevention** — Stopping something from happening. Kamelot prevents data loss through the immutable ledger.

**Primary Key** — A unique identifier. Inode numbers are the primary key in Kamelot.

**Primitive** — A basic data type. Rust primitives include integers and booleans.

**Principal** — An entity with permissions. The OS user is the principal.

**Principle** — A fundamental truth. Kamelot's principles include zero-knowledge and offline-first.

**Priority** — An order of importance. Support tickets have severity-based priority.

**Privacy** — Freedom from observation. Kamelot prioritizes privacy.

**Private Key** — A secret cryptographic key. Kamelot's master key is private.

**Privilege** — A special right. Kamelot runs without special privileges.

**PRNG** — Pseudo-Random Number Generator. Used for cryptographic key generation.

**Probability** — The likelihood of an event. Search result relevance is a probability score.

**Probe** — A test or investigation. Health checks probe service availability.

**Problem** — An issue to be solved. Kamelot solves the problem of file retrieval.

**Procedure** — A series of actions. Disaster recovery procedures are documented.

**Process** — A running program. Kamelot's daemon, Qdrant, and Ollama run as separate processes.

**Processing** — Manipulating data. Kamelot processes files for indexing.

**Processor** — A CPU. Kamelot benefits from multi-core processors.

**Production** — The live operating environment. Kamelot is designed for production use.

**Profiler** — A tool for performance analysis. Kamelot supports flamegraph profiling.

**Program** — A set of instructions. Kamelot is a program for semantic file search.

**Programming** — Writing instructions for a computer. Kamelot is written in Rust.

**Progress** — Forward movement. Indexing progress is reported to the user.

**Projection** — A transformation reducing dimensions. Not used in embedding generation.

**Promise** — An async programming construct. Not used in Rust (uses Futures).

**Prompt** — A user input request. The Omnibox is a search prompt.

**Propagation** — Spreading of information. Changes propagate through the indexing pipeline.

**Property** — An attribute of an object. File properties include size and type.

**Proposal** — A suggested plan. Feature requests are proposals.

**Protocol** — A set of rules for communication. Kamelot uses gRPC, HTTP, and JSON-RPC.

**Prototype** — An early model. Kamelot's initial versions are prototypes.

**Provider** — A service supplier. Ollama is the model inference provider.

**Proxy** — An intermediary. Not used in Kamelot's architecture.

**Prune** — Remove unnecessary items. Qdrant prunes old segments.

**Pseudocode** — Informal code description. Used in documentation.

**Public Key** — A shareable cryptographic key. Not used in Kamelot's symmetric encryption.

**Publish** — Make available. Kamelot publishes releases and documentation.

**Pull** — Fetch data from a source. Kamelot pulls model weights from Hugging Face.

**Pull Request (PR)** — A proposed code change. Community contributions are submitted as PRs.

**Pulse** — A regular signal. The daemon sends health pulses.

**Purge** — Remove completely. Cache entries are purged by TTL.

**Purity** — A functional programming concept. Not enforced in Kamelot.

**Pursuit** — The act of seeking. Kamelot pursues the North Star Metric.

**Push** — Send data to a destination. Not applicable.

---

## Q (Extended)

**QoS (Quality of Service)** — Prioritizing certain traffic. Not applicable to local-only services.

**Quadtree** — A spatial data structure. Not used by Kamelot.

**Qualification** — Meeting required standards. Enterprise support qualification ensures readiness.

**Quality** — A measure of excellence. Kamelot targets high quality in search results.

**Quantization** — Reducing precision of model weights. Qwen 2 VL Q4 is quantized to 4 bits.

**Quantization-Aware Training (QAT)** — Training for quantized deployment. Not used by Kamelot.

**Quantum Computing** — Computing using quantum mechanics. Not relevant to Kamelot.

**Quarantine** — Isolating potentially harmful data. Part of ransomware response procedure.

**Quarter** — A three-month period. Kamelot's OKRs are quarterly.

**Quartile** — A statistical division. Not commonly used in Kamelot.

**Query** — A request for information. Kamelot queries are natural language descriptions.

**Query Complexity** — How complicated a query is. Complex queries take longer to process.

**Query Expansion** — Adding related terms to a query. Planned for future versions.

**Query Optimizer** — A component improving query performance. Qdrant's optimizer handles this.

**Query Parameter** — A value modifying a query. Qdrant accepts search parameters.

**Query Plan** — A strategy for executing a query. Not exposed by Kamelot.

**Query Refinement** — Adjusting a query for better results. Kamelot's UI guides refinement.

**Queue** — A FIFO data structure. Used in Kamelot's ingestion pipeline.

**Quiesce** — Temporarily halt operations. The system quiesces during backup.

**Quota** — A usage limit. Kamelot has no built-in quotas.

**Quotation** — A reference to source material. User quotes from beta testing are documented.

**Quote** — A price estimate. Enterprise support quotes are provided on request.

---

## R (Extended)

**Race Condition** — A concurrency bug. Rust prevents data races at compile time.

**RAID** — Redundant Array of Independent Disks. Kamelot works with RAID configurations.

**RAM Disk** — A virtual drive in RAM. Not recommended for persistent storage.

**Random Access** — Accessing data in any order. HNSW provides fast random access to vectors.

**Random I/O** — Non-sequential I/O. SSDs excel at random I/O; HDDs do not.

**Range** — A set of values. Date range filters narrow search results.

**Rank** — The position in an ordered list. Search results are ranked by relevance.

**Rapid Application Development (RAD)** — Fast prototyping methodology. Not used by Kamelot.

**Raspberry Pi** — A single-board computer. Kamelot can run on Raspberry Pi 5.

**Rationale** — The reasoning behind a decision. BDRs document rationale.

**Raw** — Unprocessed data. Raw file content is processed during ingestion.

**Ray** — A workload scheduling framework. Not used by Kamelot.

**Read** — An I/O operation to retrieve data. Kamelot reads files during indexing and FUSE access.

**Read Replica** — A copy used for read operations. Not applicable to single-node Qdrant.

**Read-Only** — Cannot be written to. Kamelot's Windows mount is currently read-only.

**Readme** — A documentation file. Kamelot has README files in the repository.

**Readout** — A data display. Not applicable.

**Real-Time** — Responding instantly. Kamelot provides real-time search results.

**Realm** — A domain. Not applicable.

**Rebalance** — Redistributing load. Qdrant rebalances segments automatically.

**Reboot** — Restarting a computer. Required after WinFSP installation.

**Rebuild** — Reconstructing data. The index can be rebuilt from the ledger.

**Recall** — The fraction of relevant results retrieved. Kamelot balances precision and recall.

**Recency** — How recent something is. Recency is a factor in result ranking.

**Recertification** — Renewing a certification. Not applicable.

**Reciprocal** — The inverse of a number. MRR is the mean reciprocal rank.

**Reclamation** — Recovering resources. Garbage collection reclaims blob storage.

**Recognition** — Identifying something. File type recognition occurs during parsing.

**Recommendation** — A suggested action. Kamelot recommends hardware configurations.

**Reconciliation** — Resolving differences. Not applicable.

**Reconnect** — Establishing a connection again. Kamelot reconnects to Qdrant on failure.

**Reconstruction** — Rebuilding from parts. Files can be reconstructed from the ledger.

**Record** — A stored entry. Each ledger entry is a record.

**Recovery** — Restoring after failure. Kamelot provides rollback-based recovery.

**Recurrence** — Occurring repeatedly. Backup should be a recurring task.

**Recursion** — A function calling itself. Used in some parsing algorithms.

**Red Team** — A security testing group. Planned for future exercises.

**Redirect** — Forwarding to another location. Not applicable.

**Redistribution** — Spreading across systems. Not applicable.

**Redstone** — A fictional material. Not applicable.

**Reduced Instruction Set Computer (RISC)** — A CPU design philosophy. ARM is RISC-based.

**Redundancy** — Duplication for reliability. RAID provides storage redundancy.

**Reference** — A pointer to data. Rust references are safe.

**Reference Counting** — Tracking reference counts. Rust uses Rc for shared ownership.

**Refine** — Improving iteratively. Query refinement improves results.

**Reflection** — Introspecting code. Rust has limited reflection capabilities.

**Refresh** — Updating data. The index refresh interval is configurable.

**Region** — A geographic area. Not applicable to local storage.

**Registration** — Creating an account. Not required for Kamelot (no accounts).

**Registry** — A database of configurations. Windows Registry stores WinFSP settings.

**Regression** — A decline in performance. Regression testing prevents this.

**Reindex** — Indexing again. Required when changing models or after ledger recovery.

**Reinforcement Learning (RL)** — ML through rewards. Not used in Kamelot.

**Relation** — A connection between things. Files have many relations (content, source, project).

**Relational Database** — A database using relations. Not used by Kamelot.

**Relational Model** — A data model using relations. Not applicable.

**Relationship** — A connection between entities. Graphify visualizes file relationships.

**Relative Path** — A path relative to the current location. Kamelot uses absolute paths internally.

**Release** — A distributable version. Kamelot uses semantic versioning.

**Relevance** — How related a result is. Relevancy ranking determines result order.

**Reliability** — Consistency of operation. Kamelot targets high reliability.

**Reload** — Loading again. Configuration can be reloaded without restart.

**Remaining** — Still to be processed. Indexing shows remaining files count.

**Remediation** — Correcting a problem. Security remediation is prioritized.

**Remote** — Distant or external. Kamelot is primarily local but supports remote CLI.

**Remote Code Execution (RCE)** — A critical vulnerability. Rust prevents memory-safety RCE.

**Remote Procedure Call (RPC)** — Calling a remote function. Kamelot uses gRPC and JSON-RPC.

**Removal** — Taking away. File removal creates a tombstone in the ledger.

**Rename** — Changing a name. Renames are recorded as ledger entries.

**Rendering** — Generating an image. Kamelot's GPU UI renders search results.

**Renewal** — Extending a subscription. Enterprise support is renewed annually.

**Reorganization** — Restructuring. Qdrant reorganizes segments for performance.

**Repair** — Fixing damage. `kml fsck` repairs index issues.

**Repeatability** — Consistent results. Deterministic builds ensure repeatability.

**Replay** — Re-executing recorded operations. Ledger replay reconstructs state.

**Replication** — Copying data for redundancy. Not applicable to single-node.

**Repository** — A storage location. Kamelot's repository is on GitHub.

**Representation** — A model of something. Vectors are representations of content.

**Reproducible Build** — A build producing identical output. Kamelot supports reproducible builds.

**Request** — A demand for service. Query requests are sent to the daemon.

**Requirement** — A necessary condition. System requirements are documented.

**Reservation** — A set-aside resource. GPU memory is reserved for the model.

**Reset** — Returning to default state. Configuration can be reset.

**Resident Memory** — Memory staying in RAM. The model is resident in VRAM/RAM.

**Residual** — Remaining after subtraction. Not used.

**Resilience** — The ability to recover. Kamelot's architecture provides resilience.

**Resolution** — The number of pixels. Not relevant.

**Resolution** — Solving a problem. Support tickets aim for resolution.

**Resource** — A consumable asset. Resources include CPU, RAM, disk, and GPU.

**Resource Leak** — An unreleased resource. Rust prevents resource leaks.

**Response** — A reply to a request. Query responses contain results.

**Responsiveness** — Speed of response. Kamelot targets responsive search.

**Rest** — Remaining after processing. Not applicable.

**REST API** — A web API using HTTP. Not used by Kamelot (JSON-RPC instead).

**Restoration** — Returning to a previous state. Rollback restores file state.

**Restriction** — A limitation. Access restrictions are planned.

**Result** — The output of a query. Search results include file names, paths, and scores.

**Resumption** — Continuing after interruption. Indexing can resume after interruption.

**Retention** — Keeping users engaged. User retention is a key metric.

**Retraining** — Training a model again. Not applicable to inference-only pipeline.

**Retrieval** — Getting data from storage. File retrieval is Kamelot's core function.

**Retry** — Attempting again. Kamelot retries failed operations.

**Return on Investment (ROI)** — The benefit relative to cost. Kamelot provides high ROI.

**Reuse** — Using again. Query results can be cached for reuse.

**Reverse Engineering** — Analyzing a system to understand its design. Open source enables this.

**Reverse Proxy** — An intermediary for servers. Not used by Kamelot.

**Review** — Examining for quality. Code reviews are standard practice.

**Revision** — A version of a document. The ledger stores revision history.

**Revocation** — Invalidating a credential. Key revocation is supported.

**Rewind** — Going backward. Rollback rewinds file state.

**Rigorous** — Thorough and accurate. Kamelot's testing is rigorous.

**RISC** — Reduced Instruction Set Computer. ARM is a RISC architecture.

**Risk** — The possibility of loss. Security risks are assessed and mitigated.

**Risk Assessment** — Evaluating potential risks. Kamelot publishes risk assessments.

**Rival** — A competitor. Cloud storage services are rivals.

**Robust** — Strong and resilient. Kamelot's architecture is robust.

**Roll Forward** — Recovering by applying changes. Not used by Kamelot.

**Rollback** — Reverting to a previous state. Kamelot's core recovery feature.

**Rolling Upgrade** — Gradual update without downtime. Not applicable.

**ROM** — Read-Only Memory. Not relevant.

**Root** — The top-level user. Some operations require root.

**Root Cause** — The fundamental cause of a problem. Root cause analysis is performed.

**Root Directory** — The top directory. /kml is the root of the Kamelot virtual drive.

**Rotation** — Replacing old data periodically. Log rotation is configurable.

**Round Trip** — A complete communication cycle. gRPC round trips add latency.

**Route** — A path for data. IPC routes data between components.

**Router** — A network device. Not managed by Kamelot.

**Routine** — A regular procedure. Backup routines should be established.

**Runtime** — The environment while a program runs. Rust has a minimal runtime.

---

## S (Extended)

**Safe** — Free from risk. Rust's safe code guarantees memory safety.

**Safety** — Protection from harm. Memory safety is a key feature.

**Salt** — Random data used in hashing. Argon2id uses salt.

**Sampling** — Selecting a subset. Query result sampling may be used.

**Sandbox** — An isolated environment. Ollama runs in a sandbox.

**Satisfaction** — Meeting expectations. User satisfaction is tracked.

**Saturation** — Full capacity. Resource saturation degrades performance.

**Scalability** — Ability to grow. Kamelot scales from 10 to millions of files.

**Scale** — Size or extent. Scale affects architecture choices.

**Scan** — Examining sequentially. HNSW avoids linear scans.

**Scenario** — A situation or use case. Magic Moment scenarios are documented.

**Schedule** — A timed plan. Indexing can be scheduled.

**Schema** — A data structure definition. Qdrant collections have a schema.

**Scheme** — A systematic plan. Not applicable.

**Scope** — The extent of coverage. Indexing scope is configurable.

**Scoring** — Assigning a numeric score. Relevance scores rank results.

**Scratch** — A temporary workspace. Not used.

**Screen Reader** — Accessibility software. Not yet supported.

**Script** — A program in an interpreted language. Not used by Kamelot.

**Scroll** — Moving through content. The Omnibox scrolls through results.

**Search** — Looking for information. Kamelot's primary function.

**Search Engine** — A system for information retrieval. Kamelot is a personal semantic search engine.

**Secondary** — Second in importance. Secondary indexes improve performance.

**Section** — A division of a document. Documentation files have sections.

**Sector** — A storage unit on disk. Not managed by Kamelot.

**Secure** — Protected from threats. Kamelot is designed for security.

**Security** — Protection of data. Kamelot implements multiple security layers.

**Seed** — A starting value. Random seeds are used in cryptographic operations.

**Seek** — Moving to a position. Minimizing seeks improves performance.

**Segment** — A piece of something. Qdrant segments the vector index.

**Segmentation** — Dividing into segments. Qdrant's segment-based architecture.

**Selection** — Choosing from options. Result selection is user-driven.

**Selective** — Choosing carefully. Selective indexing excludes unwanted files.

**Self-Contained** — Needing no external dependencies. Kamelot's binary is self-contained.

**Self-Hosted** — Run on the user's own hardware. Kamelot is self-hosted.

**Semantic** — Relating to meaning. Kamelot performs semantic search.

**Semantic Search** — Search by meaning, not keywords. Kamelot's core feature.

**Semantic Versioning** — Version format MAJOR.MINOR.PATCH. Kamelot follows semver.

**Semaphore** — A synchronization primitive. Not used by Kamelot.

**Sensitive** — Requiring protection. File content can be sensitive.

**Sequence** — An ordered series. Ledger entries are sequentially numbered.

**Sequential** — One after another. Sequential I/O is faster on HDDs.

**Serial** — One at a time. Some operations are serial for consistency.

**Serialization** — Converting to a storage format. Kamelot uses Serde.

**Server** — A program that serves clients. Kamelot's daemon is a server.

**Service** — A background process. Kamelot runs as a service.

**Service Level Agreement (SLA)** — A guarantee of service. Enterprise support includes SLAs.

**Service Level Objective (SLO)** — A target service level. Kamelot sets SLOs.

**Session** — A period of interaction. Not used.

**Set** — A collection of unique items. Results are a set of files.

**Setup** — Initial configuration. Kamelot's setup is via `kml init`.

**Severity** — The seriousness of an issue. Support severity levels range S1-S4.

**Shadow** — A secondary copy. Not applicable.

**Shallow Copy** — A copy sharing references. Not applicable.

**SHA** — Secure Hash Algorithm. Kamelot uses SHA-256.

**Shard** — A horizontal partition. Qdrant supports sharding.

**Shared** — Accessed by multiple. Files can appear in multiple Workspaces.

**Shared Library** — see Dynamic Library.

**Shared Memory** — Memory accessible by multiple processes. Not used.

**Shell** — A command-line interface. Kamelot works with any shell.

**Shellcode** — Exploit code. Rust prevents shellcode injection.

**Shield** — Protection. The encryption layer is a shield.

**Shift** — A change in position. The cognitive shift after the Magic Moment.

**Shortcut** — A quick way to do something. Omnibox hotkey is a shortcut.

**Sibling** — A related entity. Not applicable.

**Side Effect** — An observable effect beyond returning a value. Kamelot minimizes side effects.

**Sidecar** — A supporting process. Qdrant and Ollama run as sidecars.

**Sieve** — A filter. Not applicable.

**Sift** — Examine carefully. Kamelot sifts through files to find matches.

**Sight** — Visual ability. Multimodal models process visual content.

**Sign** — Cryptographically sign. Releases are signed.

**Signal** — An indicator. Query cancellation signals are used.

**Signature** — Cryptographic proof of authenticity. Release signatures verify integrity.

**Signed Distance Function (SDF)** — A mathematical function. Not used.

**Significance** — Importance. Statistical significance is considered.

**Silent** — Without notification. Silent failures are avoided.

**Similarity** — How alike things are. Cosine similarity measures vector similarity.

**Simple** — Not complex. Kamelot's design philosophy favors simplicity.

**Simulation** — Imitating a process. Ransomware simulations test recovery.

**Single Point of Failure (SPOF)** — A component whose failure halts the system. Kamelot minimizes SPOFs.

**Singular** — Unique. Each file has a unique inode number.

**Sink** — A destination. The flat store is a data sink.

**Situation** — A set of circumstances. Not applicable.

**Size** — Magnitude or extent. File size affects indexing time.

**Sketch** — A rough design. Not applicable.

**Skew** — Asymmetry in distribution. Data skew affects performance.

**Skip** — Omit or pass over. Kamelot skips unreadable files.

**Slash** — The / character. /kml is the mount point.

**Slice** — A contiguous memory region. Rust slices are used for efficient access.

**Slippage** — Falling behind schedule. OKR slippage is tracked.

**Slot** — A position. Not applicable.

**Slow** — Taking more time than expected. Slow queries are flagged.

**Slow Path** — Code paths with lower performance. Minimized in Kamelot.

**Small Data** — Manageable data size. Kamelot handles personal data volumes.

**Smart Folder** — A virtual folder based on criteria. Synthetic Workspaces are smart folders.

**Smoke Test** — A basic functionality test. Kamelot runs smoke tests in CI.

**Snapshot** — A point-in-time copy. Qdrant supports snapshot-based backup.

**Snippet** — A small piece of code or text. Search results show content snippets.

**Snowflake** — A unique entity. Not applicable.

**Social Engineering** — Manipulating people for information. Not preventable by software alone.

**Socket** — A network communication endpoint. Unix domain sockets are used for IPC.

**Soft Delete** — Marking as deleted without removal. Ledger tombstones are soft deletes.

**Soft Link** — A symbolic link. Not used by Kamelot.

**Software** — Programs and data. Kamelot is software for semantic search.

**Software Bill of Materials (SBOM)** — An inventory of components. Kamelot publishes SBOMs.

**Software Development Kit (SDK)** — A set of tools for developers. Kamelot plans an SDK.

**Software License** — A legal agreement. Kamelot uses MIT / Apache 2.0.

**Software Update** — A new version. Update mechanisms are documented.

**Solid State Drive (SSD)** — Flash-based storage. Recommended for Kamelot.

**Solution** — An answer to a problem. Kamelot is a solution for file retrieval.

**Sort** — Ordering data. Search results are sorted by relevance.

**Source** — The origin of data. File sources include local drives and network mounts.

**Source Code** — Human-readable code. Kamelot's source is on GitHub.

**Sovereign** — Self-governing. Kamelot enables data sovereignty.

**Space** — Storage capacity. Kamelot manages storage space.

**Spam** — Unsolicited messages. Community guidelines prohibit spam.

**Span** — The extent of something. Not applicable.

**Sparse** — Having few non-zero elements. Not applicable to dense vectors.

**Spatial** — Relating to space. Canvas provides spatial file organization.

**Spawn** — Creating a new process. Kamelot does not spawn subprocesses.

**Spear Phishing** — Targeted phishing. Not directly prevented.

**Specification** — A detailed description. BDRs serve as specifications.

**Spectre** — A CPU vulnerability. OS-level mitigations apply.

**Speed** — Rate of operation. Kamelot optimizes for speed.

**Spike** — A sudden increase. Traffic spikes are handled.

**Splash Screen** — A startup screen. Not used by Kamelot.

**Split** — Dividing. Ledger supports time-based split for archival.

**Spoofing** — Faking identity. Local-only design prevents network spoofing.

**Spread** — Distribution range. Query latency spread is minimized.

**Spreadsheet** — Tabular data. Kamelot indexes spreadsheet files.

**Spring** — A coiled mechanism. Not applicable.

**SQL** — Structured Query Language. Not used by Kamelot.

**SQL Injection** — A database attack. Not applicable to Qdrant.

**Stability** — Resistance to change. Kamelot aims for API stability.

**Stack** — A LIFO data structure. The call stack is managed by Rust.

**Stack Overflow** — Call stack exhaustion. Monitored but not common in Rust.

**Stale** — Out of date. Stale cache entries are evicted.

**Stall** — A pause in progress. Indexing stalls are monitored.

**Standalone** — Independent. Kamelot can run standalone.

**Standard** — A required or agreed level. Kamelot follows industry standards.

**Standard Deviation** — A measure of dispersion. Latency standard deviation is tracked.

**Standard Library** — The core library of a language. Rust's std library is used extensively.

**Standby** — A ready but inactive state. Not applicable.

**Star** — A rating symbol. User ratings are a metric.

**Starvation** — A lack of resources. Not expected in normal operation.

**State** — The condition of a system. The ledger tracks system state.

**State Machine** — A model of states and transitions. Kamelot's pipeline uses state machines.

**Statement** — A single instruction. Not applicable.

**Static** — Not changing. Static analysis finds bugs at compile time.

**Static Analysis** — Analyzing code without execution. Clippy provides static analysis.

**Static Dispatch** — Resolving calls at compile time. Used for performance.

**Static Link** — Linking libraries at compile time. Kamelot uses static linking.

**Statistical** — Relating to statistics. Metrics are statistically analyzed.

**Statistics** — Collection and analysis of data. Telemetry generates statistics.

**Status** — The current state. kml status shows daemon health.

**Storage** — A medium for data. Kamelot uses local storage.

**Storage Class** — A tier of storage. Not applicable.

**Storage Engine** — A database component. Qdrant's storage engine manages vectors.

**Store** — A place to keep data. The flat store holds encrypted files.

**Strategy** — A plan of action. Backup strategy is user-defined.

**Stream** — A sequence of data. Kamelot streams search results as user types.

**Stream Processing** — Processing data in streams. Not applicable.

**Stress** — Excessive demand. Kamelot handles stress via backpressure.

**Strict** — Demanding exact compliance. Rust is strict about safety.

**String** — A sequence of characters. Rust strings are UTF-8.

**Strip** — Removing metadata. Release binaries are stripped.

**Structure** — The arrangement of parts. File structure is parsed during indexing.

**Structured Data** — Organized data. Qdrant payloads are structured.

**Stub** — A placeholder implementation. Rollback was initially a stub.

**Style** — A manner of doing something. Code style follows Rust conventions.

**Subdirectory** — A directory within a directory. Not relevant to the flat store.

**Subdomain** — A subdivision of a domain. Not applicable.

**Subject** — An entity being acted upon. Not applicable.

**Submodule** — A module within a module. Rust uses modules.

**Submission** — Sending for consideration. Bug submissions follow templates.

**Subnet** — A network subdivision. Not applicable.

**Subprocess** — A child process. Not used by Kamelot.

**Subroutine** — A function. Functions are subroutines.

**Subscription** — A recurring payment. Kamelot has no subscription requirement.

**Subset** — A part of a set. Files are a subset of indexed content.

**Subsystem** — A secondary system. Qdrant is a subsystem.

**Subtle** — Not obvious. Magic Moment detection is subtle.

**Success** — Achieving a goal. Query success rate is tracked.

**Successor** — A replacement. Not applicable.

**Suite** — A set of related things. Kamelot's test suite is comprehensive.

**Summary** — A condensed version. Search results include summaries.

**Superblock** — A filesystem metadata structure. Not applicable to flat store.

**Supercomputer** — A high-performance computer. Kamelot does not require one.

**Superuser** — An administrator account. Some operations need superuser.

**Supplement** — An addition. Documentation supplements are added.

**Supply Chain** — The sequence of software creation. Kamelot secures its supply chain.

**Support** — Assistance. Kamelot offers community and enterprise support.

**Suppression** — Preventing something. Noise suppression improves result quality.

**Surface Area** — The attack surface. Kamelot minimizes network surface.

**Surge** — A sudden increase. Query surges are handled.

**Surveillance** — Monitoring. Not applicable.

**Survival** — Continuing to exist. Data survival is ensured through backup.

**Suspend** — Pausing operation. Not applicable.

**Suspicious** — Causing distrust. Suspicious file operations are logged.

**Swap** — Using disk as RAM. Slower but allows larger indexes.

**Sweep** — A comprehensive search. Not applicable.

**Swift** — A programming language. Not used by Kamelot.

**Swim** — Not applicable.

**Switch** — Selecting options. Network switches not managed.

**Symbol** — A representation. Symbols are used in embeddings.

**Symbolic Link** — A file referencing another. Not used by Kamelot.

**Symbolic** — Representing something else. Not applicable.

**Symmetric** — Balanced. AES is symmetric encryption.

**Symmetric Multiprocessing (SMP)** — Multiple CPUs sharing memory. Kamelot benefits from SMP.

**Synchronization** — Coordinating timing. State synchronization uses atomic operations.

**Synchronous** — Occurring at the same time. Some operations are synchronous.

**Syndrome** — A set of symptoms. Not applicable.

**Syntax** — Rules of language structure. File format syntax is parsed.

**Synthesis** — Combining to form something new. Directory structure is synthesized.

**Synthetic** — Artificially created. Workspaces are synthetic directories.

**System** — A collection of components. Kamelot is a file retrieval system.

**System Call** — OS kernel function calls. FUSE operations involve system calls.

**System Resource** — An OS resource. System resources are monitored.

**Systemd** — Linux service manager. Kamelot supports systemd service installation.

---

## T (Extended)

**Table** — Data arranged in rows and columns. Not used by Kamelot.

**Tableau** — Not applicable.

**Tabular** — In table form. Kamelot parses tabular data files.

**Tag** — A label. Tags can be assigned to files.

**Tail** — The end. `tail -f` follows log file end.

**Tail Latency** — High-percentile latency. Kamelot optimizes tail latency.

**Tamper** — Meddle with. The ledger is tamper-evident.

**Tape** — Magnetic tape storage. Not recommended.

**Target** — A goal. Performance targets are documented.

**Task** — A unit of work. Async tasks handle concurrent operations.

**TCB (Trusted Computing Base)** — The part of a system critical for security. Kamelot's TCB is minimal.

**TCP** — Transmission Control Protocol. Used for local communications.

**Team** — A group of people. The Kamelot team is small.

**Teardown** — Disassembly. Not applicable.

**Technique** — A method. Various techniques improve search accuracy.

**Technology** — Applied knowledge. Kamelot uses state-of-the-art AI.

**Template** — A pattern for creating things. Bug report templates are provided.

**Temporal** — Relating to time. Temporal context aids file retrieval.

**Temporary** — Not permanent. Temporary files are excluded from indexing.

**Tenant** — A customer. Not applicable to single-user.

**Tendency** — A pattern of behavior. Not applicable.

**Tension** — A balancing act. OKR cross-objective tensions are resolved.

**Tensor** — A multi-dimensional array. Embeddings are tensors.

**Tensor Processing Unit (TPU)** — Google's AI accelerator. Not used by Kamelot.

**Terabyte (TB)** — 1000 GB. Kamelot handles terabyte-scale collections.

**Term** — A word or phrase. Search query terms are analyzed.

**Term Frequency (TF)** — How often a term appears. Used in BM25.

**Terminal** — A command-line interface. Kamelot CLI works in any terminal.

**Termination** — Ending. Graceful termination is supported.

**Ternary** — Three-part. Not applicable.

**Test** — A procedure for verification. Kamelot has unit, integration, and performance tests.

**Test Coverage** — The proportion of code tested. Kamelot targets high coverage.

**Test Double** — A test substitute. Mocks are test doubles.

**Test Harness** — A test execution environment. CI provides test harnesses.

**Test Suite** — A collection of tests. Tests are organized in suites.

**Testing Pyramid** — A model of test distribution. Kamelot follows the pyramid.

**Text** — Written content. File text is the primary search target.

**Texture** — Not applicable.

**Theft** — Taking without permission. Encryption protects against theft.

**Theme** — A visual style. Kamelot's UI supports dark/light themes.

**Theory** — An explanation. Information retrieval theory underpins Kamelot.

**Thermal** — Related to heat. Not directly relevant.

**Thick Client** — A client doing most processing. Kamelot's UI is a thick client.

**Thin Client** — A client with minimal processing. Not applicable.

**Third Party** — An external entity. Kamelot minimizes third-party dependencies.

**Thread** — A lightweight process. Kamelot uses async tasks, not threads.

**Thread Pool** — A pool of reusable threads. Used in Kamelot's blocking operations.

**Thread Safety** — Correctness under concurrency. Rust ensures thread safety.

**Threat** — A potential danger. The threat model documents threats.

**Threat Actor** — An entity posing a threat. Not applicable.

**Threat Assessment** — Evaluating threats. Security docs include assessments.

**Threat Hunting** — Proactive threat search. Not applicable.

**Threat Intelligence** — Information about threats. Not used by Kamelot.

**Threshold** — A boundary value. Similarity thresholds filter results.

**Throttle** — Limit the rate. Kamelot throttles CPU and I/O during indexing.

**Throughput** — Work done per unit time. Indexing throughput in files/second.

**Thumbnail** — A small preview image. Kamelot generates thumbnails.

**Thunk** — A deferred computation. Not used.

**Tick** — A timed event. Not used.

**Tier** — A level in a hierarchy. Support tiers are Bronze through Platinum.

**Tight Loop** — A loop with minimal work. Not common in Kamelot.

**Tile** — A UI element. Not used.

**Tilt** — A bias or angle. Not applicable.

**Time Complexity** — How runtime scales with input. HNSW has logarithmic time complexity.

**Time Series** — Data indexed by time. Ledger entries form a time series.

**Time to Live (TTL)** — A lifespan. Cache entries have TTL.

**Timeout** — An operation limit. Configurable timeouts for Qdrant and Ollama.

**Timer** — A timing mechanism. Watchdog timers detect hangs.

**Timestamp** — A time marker. Ledger entries are timestamped.

**Tiering** — Moving data between tiers. Not applicable.

**Toggle** — A switch. Feature toggles enable experimental features.

**Token** — An atomic unit of text. Model tokens are counted.

**Tokenization** — Splitting text into tokens. Embedding models tokenize input.

**Tolerance** — Acceptable variation. Performance tolerance is defined.

**Tombstone** — A deletion marker. Ledger tombstones mark deletions.

**Tool** — A device or software. Kamelot is a tool for file retrieval.

**Toolchain** — A set of development tools. Rust toolchain is required for building.

**Top-Level** — At the highest level. Top-level domains not relevant.

**Top-N** — The top N results. Top-1 accuracy is tracked.

**Topic** — A subject. Discussion topics are organized by category.

**Topology** — Configuration of a network. Not applicable.

**Total Cost of Ownership (TCO)** — Full cost over time. Kamelot's TCO is low.

**Trace** — A detailed log. Trace level logging is very verbose.

**Track** — Follow. Metrics are tracked over time.

**Traffic** — Network data flow. Kamelot has minimal traffic.

**Trailer** — Metadata at the end. Not applicable.

**Training** — Teaching. Training services are offered for enterprises.

**Transaction** — An atomic operation. Ledger entries are transactional.

**Transcode** — Convert between formats. Not applicable.

**Transfer** — Moving data. File transfer is not Kamelot's function.

**Transform** — Change form. File content is transformed into vectors.

**Transformer** — A neural network architecture. Qwen 2 VL uses transformers.

**Transient** - Temporary. Transient errors are retried.

**Transistor** - A semiconductor component. Not relevant.

**Transition** - A change from one state to another. Monitored.

**Translation** - Converting between languages. i18n translation is planned.

**Transmission** - Sending data. Not applicable to local architecture.

**Transparency** - Openness about operations. Kamelot values transparency.

**Transport** - Moving data between systems. gRPC is the transport for Qdrant.

**Transport Layer Security (TLS)** - Encrypted network communication. Not used for local IPC.

**Trap** - An interrupt. Not applicable.

**Traversal** - Moving through a structure. Directory tree traversal occurs in indexing.

**Tree** - A hierarchical data structure. Not used for the flat store.

**Triage** - Prioritizing issues. Support tickets are triaged.

**Trial** - A test. Trials are not applicable (free software).

**Trigger** - An event that starts something. File watcher triggers indexing.

**Truncate** - Shortening. Log truncation is configured.

**Trust** - Confidence. Users must trust self-hosted software.

**Trusted Platform Module (TPM)** - A hardware security chip. Not used by Kamelot.

**Truth** - The accepted state. The ledger is the source of truth.

**Try** - An attempt. Rust's try operator propagates errors.

**Tuning** - Adjusting for performance. HNSW parameters benefit from tuning.

**Tuple** - An ordered list. Rust tuples are used for grouping values.

**Turbulence** - Instability. Not applicable.

**Turing Complete** - Able to simulate any computation. Rust is Turing complete.

**Turnaround** - Time from request to completion. Turnaround time is minimized.

**Tutorial** - A teaching document. Kamelot has tutorials on the wiki.

**Tweak** - A small adjustment. Configuration tweaks improve performance.

**Twiddle** - Adjust slightly. Not applicable.

**Two-Phase Commit** - A distributed transaction protocol. Not used.

**Two-Way** - Mutual. Not applicable.

**Type** - A classification. File types determine parsing.

**Type Inference** - Automatically deducing types. Rust infers types in many contexts.

**Type Safety** - Preventing type errors. Rust provides type safety.

**Type System** - Rules governing types. Rust's type system prevents errors.

**Typical** - Representing the norm. Typical use cases are documented.

**Typo** - A typing error. Query typos are handled via fuzzy matching.

---

## U (Extended)

**Ubiquitous** - Present everywhere. Not applicable.

**UDP** - User Datagram Protocol. Not used.

**UI Component** - A reusable UI element. Custom components are built.

**ULID** - Universally Unique Lexicographically Sortable Identifier. Not used.

**Ultimate** - Final or best. Not applicable.

**Unary** - Operating on one operand. Not applicable.

**Unbounded** - Without limit. Some resources should be bounded.

**Unbuffered** - Not using a buffer. Not applicable.

**Uncertainty** - Lack of certainty. Not applicable.

**Unchecked** - Not verified. Unchecked assumptions are avoided.

**Unclean** - Not clean. Unclean shutdown is handled.

**Uncommitted** - Not saved. Uncommitted changes may be lost.

**Uncompressed** - Not compressed. Encrypted blobs are incompressible.

**Undefined Behavior (UB)** - Behavior not defined by language spec. Rust eliminates UB in safe code.

**Underflow** - Below minimum range. Checked in Rust debug mode.

**Underscore** - The _ character. Used in Rust for unused variables.

**Understanding** - Comprehension. Kamelot aims to understand user intent.

**Undo** - Reversing an action. Rollback is the undo mechanism.

**Unicode** - A character encoding standard. Kamelot supports Unicode file paths.

**Unified** - Made uniform. Not applicable.

**Uninstall** - Remove software. Uninstall instructions are provided.

**Union** - A combination. Union types in Rust are enums.

**Unique** - One of a kind. Inode numbers are unique.

**Unit** - A single thing. Unit economics analyze per-file costs.

**Unit Test** - Testing a single unit. Kamelot has extensive unit tests.

**Unity** - Being united. Not applicable.

**Universal** - Applicable everywhere. Semantic search is universal.

**Unix** - A family of operating systems. Kamelot runs on Unix-like systems.

**Unknown** - Not known. Unknown file types are handled.

**Unlimited** - Without limit. No usage limits.

**Unlink** - Remove a file. Unlink creates a ledger tombstone.

**Unload** - Remove from memory. The model can unload after idle.

**Unlock** - Make accessible. Encryption keys unlock files.

**Unmount** - Dismount a filesystem. FUSE unmount is supported.

**Unnecessary** - Not needed. Unnecessary features are avoided.

**Unordered** - Not in a specific order. Hash tables are unordered.

**Unpack** - Extract from a container. Archive files are unpacked.

**Unpredictable** - Not predictable. Jitter is minimized.

**Unprotected** - Not secured. Unprotected files should not be indexed.

**Unreachable** - Not accessible. Annotated with `unreachable!()`.

**Unsafe** - Not safe. Unsafe Rust blocks are isolated.

**Unstable** - Not stable. Pre-1.0 APIs are unstable.

**Untested** - Not tested. Untested code is avoided.

**Untrusted** - Not trusted. User input is untrusted.

**Unverified** - Not verified. Downloads are verified via signature.

**Update** - Make current. Software updates are documented.

**Upgrade** - Improve. Version upgrades are supported.

**Upload** - Send data. Not applicable.

**Uptime** - Time of operation. Kamelot targets high uptime.

**Up-to-Date** - Current. Keeping software up to date.

**Urgency** - Importance requiring immediate action. Support severity reflects urgency.

**URL** - Uniform Resource Locator. Used for model downloads.

**Usage** - The act of using. Usage patterns are analyzed.

**Use Case** - A specific scenario. Use cases are documented.

**Used Memory** - Memory in use. Tracked by system monitor.

**User** - A person using the system. Kamelot is single-user.

**User Agent** - A client identifier. Not applicable.

**User Datagram** - Not used.

**User Experience (UX)** - The overall experience. Kamelot focuses on UX.

**User ID** - A user identifier. Not used (single-user).

**User Interface (UI)** - The visual interface. Kamelot's UI is built with Vello.

**User Space** - Application memory space. FUSE operates in user space.

**Utility** - Usefulness. Kamelot utility grows with index size.

**Utilization** - Usage level. Resource utilization is tracked.

**UUID (Universally Unique Identifier)** - A 128-bit identifier. Used for query IDs in telemetry.

---

## V (Extended)

**Vacancy** - Empty space. Not applicable.

**Validation** - Checking correctness. Input validation is important.

**Validity** - Being valid. Not applicable.

**Valuation** - Estimated worth. Not applicable.

**Value** - Worth or import. Kamelot provides value through time savings.

**Vanilla** - Plain. Vanilla configuration defaults.

**Variable** - A changeable value. Rust variables are immutable by default.

**Variance** - A measure of spread. Latency variance is minimized.

**Variant** - A version. File format variants are handled.

**VDI (Virtual Desktop Infrastructure)** - Desktop virtualization. Not relevant.

**Vector** - A mathematical quantity with magnitude and direction. Embeddings are vectors.

**Vector Database** - A DB optimized for vectors. Qdrant is Kamelot's vector DB.

**Vector Dimension** - The length of a vector. Kamelot uses 768 dimensions.

**Vector Index** - A data structure for vector search. HNSW is the index.

**Vector Space** - A mathematical space. Embeddings exist in vector space.

**Vendor** - A provider. Kamelot avoids vendor lock-in.

**Vendor Lock-In** - Dependency on a vendor. Self-hosted avoids lock-in.

**Verbose** - Using more words. Verbose logging provides detail.

**Verification** - Confirming correctness. Release signatures enable verification.

**Version** - A specific release. Kamelot uses semantic versioning.

**Version Control** - Managing changes. Git is used for version control.

**Vertical Scaling** - Adding more power to a machine. Kamelot scales vertically.

**Viability** - Ability to survive. Business viability is ensured.

**Victim** - A harmed entity. Not applicable.

**Video** - Moving images. Kamelot indexes video files.

**View** - A visual representation. The FUSE mount provides a filesystem view.

**Virtual** - Simulated. Kamelot creates virtual directories.

**Virtual Environment** - An isolated workspace. Not applicable.

**Virtual Machine (VM)** - An emulated computer. Kamelot runs in VMs.

**Virtual Memory** - Memory abstraction. Managed by OS.

**Virus** - Malicious software. Kamelot is not an antivirus.

**Visibility** - Ability to be seen. Operational visibility via logs.

**Vision** - A future aspiration. Kamelot's vision is self-sovereign storage.

**Visual** - Relating to sight. Visual content is searchable.

**Visual Studio Code** - An IDE. Kamelot integrates with VS Code.

**Vital** - Essential. Data recovery is vital.

**VLAN** - Virtual LAN. Not applicable.

**VMware** - A virtualization platform. Kamelot runs on VMware.

**Vocabulary** - A set of terms. Model vocabulary affects tokenization.

**Volatile** - Unstable. RAM is volatile storage.

**Voltage** - Electrical potential. Not applicable.

**Volume** - A storage unit. Kamelot manages file volumes.

**Volumetric** - Relating to volume. Not applicable.

**Vulnerability** - A security weakness. Kamelot minimizes vulnerabilities.

---

## W (Extended)

**WAN** - Wide Area Network. Not applicable to local architecture.

**Warm** - Pre-loaded and ready. Model warm-up reduces first-query latency.

**Warm Standby** - A backup ready to take over. Not applicable.

**Warning** - An alert about potential issues. Warnings are logged.

**Warrant** - Legal authorization. Not applicable.

**Warranty** - A guarantee. Software is provided without warranty.

**Watch** - Monitor for changes. File watchers detect modifications.

**Watchdog** - A timer that detects hangs. Used for daemon health.

**Waterfall** - A sequential development model. Not used (agile).

**Weak Reference** - A reference that does not prevent garbage collection. Not applicable.

**Weakness** - A limitation. Honest weakness disclosure.

**Weaponize** - Turn into a weapon. Not applicable.

**Weather** - Atmospheric conditions. Not applicable (offline).

**Web** - The World Wide Web. Kamelot is not a web application.

**Web Application** - An app running in a browser. Kamelot is native, not web.

**WebAssembly (WASM)** - A binary instruction format. Not used.

**Webhook** - An HTTP callback. Not used.

**WebSocket** - A full-duplex communication protocol. Used for UI-daemon communication.

**Weight** - A model parameter. Model weights determine behavior.

**Whitelist** - An allowlist. Antivirus exclusions are whitelists.

**Widget** - A UI element. Kamelot uses custom widgets.

**Wildcard** - A pattern-matching character. Glob patterns use wildcards.

**Windowing** - Operating system GUI management. Winit handles windowing.

**Wired** - Physical network connection. Not relevant.

**Wireless** - Radio-based communication. Not relevant.

**Wizard** - A step-by-step setup tool. Onboarding wizard is planned.

**Word** - A unit of language. Query words are analyzed.

**Work** - Effort applied. Not directly applicable.

**Workaround** - An alternative solution. Known issues have workarounds.

**Workflow** - A sequence of tasks. Kamelot integrates with existing workflows.

**Worker** - A component that does work. Ingestion workers process files.

**Workload** - The amount of work. Workload distribution is balanced.

**Workspace** - See Synthetic Workspace.

**Workstation** - A powerful computer. Recommended for large indexes.

**WORM (Write Once, Read Many)** - Storage model. The ledger is WORM-like.

**Worst Case** - The most unfavorable scenario. Worst-case latency is bounded.

**Wrapper** - A component wrapping another. FFI wrappers isolate unsafe code.

**Write** - Recording data. FUSE write support is planned.

**Write Amplification** - Extra writes due to storage internals. Minimized in flat store.

**Write-ahead Log (WAL)** - A log for crash recovery. The ledger serves as WAL.

---

## X (Extended)

**Xeon** - Intel's server processor. Suitable for large deployments.

**Xerox** - A photocopy company. Not relevant.

**XFS** - A Linux filesystem. Kamelot works on XFS.

**XML** - Extensible Markup Language. Kamelot parses XML files.

**XMPP** - An instant messaging protocol. Not used.

**XOR** - Exclusive OR operation. Used in some hash functions.

**XOR Filter** - A probabilistic data structure. Not used.

**XPath** - A query language for XML. Not used.

**XRP** - Not applicable.

**XSS (Cross-Site Scripting)** - A web vulnerability. Not applicable to native app.

**XTerm** - A terminal emulator. Works with Kamelot CLI.

**XZ** - A compression format. Kamelot handles .xz archives.

---

## Y (Extended)

**Y2K** - Year 2000 problem. Not relevant.

**YAML Ain't Markup Language (YAML)** - A data serialization format. Kamelot uses TOML instead.

**Yank** - Pull or remove. Not applicable.

**Yarn** - A package manager. Not used (Rust uses Cargo).

**Year** - A time unit. OKRs are set per year.

**Yellow** - A status color. Monitor status is yellow for warnings.

**Yelp** - A business review service. Not relevant.

**Yield** - Produce or give way. Async yields control.

**Yottabyte (YB)** - A massive data unit. Not relevant.

**Young** - Recent. Young files benefit from recency bias.

**Your** - Belonging to you. Your data stays on your machine.

---

## Z (Extended)

**Z-Score** - A statistical measure. Not used.

**Z-Wave** - A wireless protocol. Not relevant.

**Zap** - Not applicable.

**Zeal** - Enthusiasm. Community zeal drives adoption.

**Zealot** - An extreme enthusiast. Not applicable.

**Zero** - Nothing. Zero data exfiltration is a property.

**Zero Configuration** - No setup required. Target for v2.0.

**Zero Copy** - No copying of data. Used in Rust for efficiency.

**Zero Day** - An unpatched vulnerability. Kamelot's open source enables rapid patching.

**Zero Division** - Division by zero. Prevented by Rust's checked division.

**Zero Trust** - A security model. Kamelot implements zero-trust principles.

**Zero-Cost Abstraction** - A Rust concept. Kamelot uses zero-cost abstractions.

**Zig** - A programming language. Considered but not chosen.

**Zombie** - A defunct process. Not applicable.

**Zone** - An area. Not applicable.

**Zoom** - Magnify. Not directly relevant.

**Zstd** - A compression algorithm. Not used (encrypted data is incompressible).

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

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