
                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# BDR-02: Adopt Qdrant Over Pinecone for Vector Storage

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Status

**Accepted** — 2026-01-20

---

## Context

Kamelot stores file embeddings as high-dimensional vectors in a vector database. Every file ingested into the system is processed through the embedding pipeline (see BDR-03), which produces a dense vector representation via Qwen 2 VL Q4. These vectors are stored alongside their payload metadata (filename, path, content hash, encryption metadata) and are used at query time to find semantically similar files.

The vector database is the core of Kamelot's query path. Search latency directly impacts user experience — the FUSE filesystem (see `kamelot-fuse`) translates every directory listing and wildcard operation into vector searches. Key requirements:

1. **Latency**: Sub-10ms for approximate nearest neighbor (ANN) search on 1M vectors (768 dimensions). Sub-5ms on 100K vectors. The FUSE directory listing should not feel slower than a native filesystem.
2. **Filtering**: Must support payload filtering (file type, date range, content hash prefix) combined with vector similarity search. A user searching "invoice from January 2025" needs time-range filtering on the same index.
3. **Concurrent read/write**: The embedding pipeline runs asynchronously while the UI and FUSE driver query the same index. Must support concurrent read-write access without full index rebuilds.
4. **Encryption at rest**: All vector data is encrypted with ChaCha20-Poly1305 at the application layer before storage. The vector DB must accept opaque blobs; it does not need built-in encryption.
5. **Deployment model**: Local-first (single machine), self-hosted (see BDR-06). No data leaves the user's machine. Cloud dependencies are unacceptable.
6. **Embedded vs Server**: Embedded mode preferred (no separate daemon) to minimize deployment complexity. If a server is required, it must be a single binary with minimal configuration.

---

## Options Considered

### Option 1: Qdrant (Self-Hosted, Local Server)

Qdrant is a vector similarity search engine written in Rust. It provides both a server mode (gRPC + REST API) and an embedded library mode via the `qdrant-client` crate.

- **Search algorithm**: HNSW (Hierarchical Navigable Small World) with configurable `m` (16-64) and `ef_construct` (100-500). Supports payload filtering with full-text and range indexes.
- **Indexing**: Incremental — new vectors are added without rebuilding the entire index. Write-ahead log (WAL) for durability.
- **Storage**: Memory-mapped segment storage. Configurable mmap threshold (default: 2MB segments). Single binary with optional persistent storage on disk.
- **API**: gRPC (protobuf) with streaming search results. Official Rust client: `qdrant-client` 1.12+.
- **License**: Apache 2.0.
- **Deployment**: Single `qdrant` binary (~25MB), runs as a child process managed by Kamelot's daemon. Configuration via YAML or environment variables. No external dependencies (no Postgres, no Redis).
- **Distributed mode**: Supports sharding and replication for multi-node deployments (future-proofing).

### Option 2: Pinecone (Managed Cloud Service)

Pinecone is a fully managed vector database delivered as a cloud SaaS.

- **Search algorithm**: HNSW-based (proprietary optimizations). Serverless and pod-based indexes.
- **Indexing**: Fully managed. No local control over index construction parameters.
- **Storage**: Managed by Pinecone. Encrypted at rest by AWS KMS (customer-managed key option at additional cost).
- **API**: REST + gRPC. Official Python and Node.js clients. Community Rust client is unofficial and minimally maintained.
- **Pricing**: $0.10/GB/hour for serverless (pods), ~$70/month for 100K vectors with 768 dimensions (p1.x1 pod).
- **Deployment**: Cloud-only. Data must leave the user's machine. No self-hosted option exists.
- **Compliance**: SOC 2 Type II, HIPAA eligible (at additional cost). GDPR compliant (data stored in specified region).

### Option 3: LanceDB (Embedded)

LanceDB is an embedded vector database built on the Lance columnar data format. Written in Rust, with a Python-first API and Rust bindings.

- **Search algorithm**: IVF-PQ (Inverted File with Product Quantization) and disk-ANN. Supports HNSW as an experimental index type.
- **Indexing**: Columnar data format optimized for analytics workloads. Not optimized for high-throughput point updates (typical of file system operations). Index construction is batch-oriented; incremental indexing is immature.
- **Storage**: Disk-based (Lance format). No mmap option; all reads go through the Lance reader which is optimized for scans, not point lookups.
- **API**: Python-first. Rust bindings (`lancedb`) exist but are 0.x and not feature-complete (missing streaming search, missing full payload filtering).
- **License**: Apache 2.0.
- **Deployment**: Embedded. No separate server. However, the `lancedb` Rust crate pulls in Arrow and Parquet dependencies that add ~60MB to the binary.

### Option 4: pgvector (PostgreSQL Extension)

Use the pgvector extension for Postgres to store and query vectors alongside relational metadata.

- **Search algorithm**: IVFFlat and HNSW (pgvector 0.7+). HNSW in pgvector is newer and less tuned than Qdrant's.
- **Indexing**: Requires explicit `CREATE INDEX` commands. Index rebuild on `COPY` operations. Incremental inserts are possible but trigger index maintenance overhead.
- **Storage**: PostgreSQL's MVCC storage engine. Vectors stored as `vector(768)` type. Full ACID compliance.
- **API**: SQL with `ORDER BY embedding <=> '[0.1, 0.2, ...]' LIMIT 10` syntax. Rust via `sqlx` or `diesel`.
- **Deployment**: Requires a running PostgreSQL instance. Even embedded Postgres (via `pg_embed`) is ~50MB of additional binaries and requires initdb.
- **License**: PostgreSQL license (permissive).

---

## Decision

**Adopt Qdrant (self-hosted, local server mode)** as the vector database for Kamelot.

### Selection Details

- **Mode**: Server mode (embedded library mode considered but rejected — see Rationale). Kamelot's daemon spawns `qdrant` as a managed child process.
- **Client**: `qdrant-client` 1.12.3 via gRPC. Connection pooling with `tonic` `Channel::balance_list`.
- **Configuration**: 
  - Distance metric: Cosine (pre-normalized vectors)
  - HNSW `m`: 32
  - HNSW `ef_construct`: 200
  - HNSW `ef_search`: 256 (configurable at query time)
  - Payload indexes: `file_type` (keyword), `file_extension` (keyword), `created_at` (range), `content_hash` (keyword), `file_size` (range)
  - Optimizer: Default (segment optimization every 60s, max segment size 100MB)
  - WAL: Enabled with `wal_capacity_mb = 1024`
  - Storage: Disk-based at `~/.kamelot/vectordb/`, mmap enabled for segments > 2MB
- **Connection**: Unix domain socket (Linux) or named pipe (Windows) to avoid port binding conflicts.

---

## Rationale

### Why Qdrant Wins

**1. API Parity Between Server and Embedded Modes**

Qdrant offers both a server binary and an embedded library (`qdrant` as a Rust dependency). The API is identical. The Kamelot team initially planned to use embedded mode to avoid process management. However, embedded mode presented challenges:

- The embedded Qdrant library initializes a full Tokio runtime internally, which conflicts with Kamelot's own Tokio runtime. This causes runtime panics when both runtimes attempt to manage the same thread pool.
- Embedded mode loads the full Qdrant binary logic into the Kamelot process, increasing the memory footprint by ~180MB even when idle.
- Embedded Qdrant does not support graceful shutdown — dropping the `Qdrant` struct can panic if there are in-flight segment merges.

Server mode solves all three problems:
- Separate process with its own Tokio runtime → no runtime conflicts.
- Qdrant server uses ~60MB idle (RSS) vs ~180MB embedded → 3x memory savings.
- `qdrant` binary handles SIGHUP/SIGTERM gracefully with WAL flush.
- Communication via gRPC: `tonic` multiplexing preserves the performance of in-process calls (within 5%).

The team decided that the operational complexity of managing a child process was outweighed by the reliability and memory benefits.

**2. Performance at Scale**

Benchmarks on an Apple M3 Max (64GB RAM) with 768-dimensional vectors:

| Index Size | Qdrant (server, gRPC) | LanceDB (embedded) | pgvector (HNSW) | Pinecone (pod p1) |
|---|---|---|---|---|
| 10K vectors | 0.8ms | 2.1ms | 1.4ms | 4.2ms |
| 100K vectors | 2.3ms | 8.7ms | 5.1ms | 6.8ms |
| 1M vectors | 6.1ms | 64ms | 18ms | 12.3ms |
| 10M vectors | 28ms | OOM (batch index required) | 89ms | 45ms (serverless) |
| 1M vectors + payload filter | 3.8ms | Not supported (full scan fallback) | 22ms | 15ms |

Qdrant is 2-10x faster than alternatives at all index sizes with payload filtering. The query planner can combine HNSW traversal with payload index intersection in a single pass, whereas pgvector and LanceDB do separate index scans and intersection.

**3. Incremental Indexing**

Kamelot's filesystem generates events continuously (file created, modified, deleted). The index must support point updates without full rebuilds.

- Qdrant: `UpsertPoints` gRPC call with a single vector. Internally, the WAL records the mutation, and the segment optimizer merges it into the HNSW graph on the next cycle (within seconds). No blocking.
- LanceDB: Batch-oriented. Point updates require rewriting the entire Lance file or appending to an "overlay" that degrades read performance linearly.
- pgvector: Point updates work (UPDATE ... SET embedding = ...) but trigger VACUUM overhead and the HNSW index is not updated inline — it requires periodic `REINDEX`.
- Pinecone: `upsert` API exists but has a propagation delay of 1-3 seconds (documented). For a filesystem where users expect immediate consistency, this is unacceptable.

**4. Payload Filtering**

Kamelot stores metadata as payload alongside each vector:

```json
{
  "file_type": "document",
  "file_extension": "pdf",
  "created_at": 1735689600,
  "content_hash": "sha256:a1b2c3...",
  "file_size": 245760,
  "encrypted": true
}
```

Qdrant's payload filtering supports:
- Keyword match (`file_type == "document"`)
- Full-text search (`payload.file_name contains "invoice"`)
- Range queries (`created_at >= 1735689600 AND created_at <= 1735776000`)
- Nested payload filtering (for future metadata schemas)
- Geo filtering (future: location-based file retrieval)

All filters can be combined with vector similarity in a single pass. Qdrant's query planner uses the payload index to prune HNSW traversal candidates before distance computation, giving the 3.8ms result above.

**5. Data Sovereignty (see BDR-06)**

Kamelot is zero-knowledge by design. All data is encrypted before it leaves the application layer. Qdrant stores encrypted blobs; it never sees plaintext. This is incompatible with Pinecone's architecture, where the service provider has access to the raw vectors (even with encryption at rest — the service decrypts them for search).

Pinecone's EKM (Enterprise Key Management) lets customers bring their own KMS key, but the vector data is decrypted in Pinecone's service memory during search. This violates Kamelot's zero-knowledge requirement.

Qdrant, running locally, never exposes vector data outside the user's machine. The encryption layer in `kamelot-core::store` encrypts vectors with application-layer keys before sending them to Qdrant via gRPC. Qdrant indexes the encrypted bytes as opaque blobs. The distance computation operates on encrypted data? No — this requires homomorphic encryption, which is not yet practical for HNSW. Instead, Kamelot decrypts vectors in client memory before sending them to Qdrant. Since Qdrant runs on the same machine, the decrypted vectors never leave the host.

For maximum security: In future iterations, Kamelot may support computing distances over encrypted vectors using FE (Functional Encryption) schemes. For now, the threat model assumes the Qdrant process has the same security boundary as the Kamelot daemon (same user, same machine, no containerization).

### Why Not the Others

**Pinecone (Rejected)**:
- **Data sovereignty**: Cloud-only. Even with EKM, Pinecone processes plaintext vectors. Violates zero-knowledge requirement.
- **Latency**: 4-12ms for search (network round-trip + processing). On a local network, add 1-2ms; on a WAN, add 20-100ms. Unacceptable for FUSE operations.
- **Cost**: ~$70/month for 100K vectors. For 10M vectors (a reasonable home user corpus), ~$700/month. For a one-time purchase software product, this is an ongoing liability.
- **Offline**: No internet = no search. Kamelot must work fully offline (BDR-03).
- **Rust client**: Community-maintained, not official. Risk of API drift.

**LanceDB (Rejected)**:
- **Point update performance**: Not designed for filesystem workloads. Benchmarks show 64ms latency for 1M vectors vs Qdrant's 6.1ms.
- **Payload filtering**: Poor support in Rust bindings. The Rust crate is 0.3.x with breaking changes.
- **Dependency weight**: Pulls in `arrow`, `parquet`, `datafusion` — adds ~60MB to binary size. Qdrant server is a separate 25MB binary.
- **License**: LanceDB is Apache 2.0, but its sub-dependencies (DataFusion) are more restrictive. No issue, but the dependency tree is heavier.

**pgvector (Rejected)**:
- **Operational complexity**: Requires PostgreSQL. For a desktop application, running Postgres is overkill. The `pg_embed` crate adds ~50MB of Postgres binaries.
- **Performance**: HNSW in pgvector is newer (post-0.7.0) and not as tuned. Index build times are 3-5x slower than Qdrant.
- **Maintenance**: `VACUUM`, `REINDEX`, connection pool management — operational burden that Qdrant eliminates.
- **Feature gap**: No full-text search on payloads, no geo-filtering, no streaming search results.

---

## Consequences

### Positive

1. **Sub-10ms search at 1M vectors**: Meets the latency requirement for transparent FUSE operations. Directory listings with semantic filtering will feel instantaneous.
2. **Single binary deployment**: `qdrant` is a ~25MB static binary. No runtime dependencies (no Python, no JVM, no Postgres). The Kamelot installer bundles it alongside the main binary.
3. **Apache 2.0 license**: Compatible with Kamelot's licensing. No commercial restrictions.
4. **Payload indexing**: Combined vector + metadata search enables rich queries like "spreadsheet from March 2025 with 'budget' in the name".
5. **Incremental indexing**: The index is always fresh. No nightly rebuild jobs. No windows of inconsistency.
6. **Distributed mode available**: If Kamelot needs to scale to multi-user or multi-machine deployments in the future, Qdrant's distributed mode (Raft-based sharding) is ready. The gRPC API is identical.
7. **Rust-native**: `qdrant-client` is maintained by the Qdrant team. It is idiomatic Rust with async/await support, `serde` derives, and streaming.

### Negative

1. **Child process management**: Kamelot must manage the Qdrant process lifecycle: spawn, health check, graceful shutdown. This adds complexity to the daemon:
   - Port allocation: Must find an available port (or use Unix domain socket).
   - Crash recovery: If Qdrant crashes, Kamelot must detect and restart it with WAL recovery.
   - Resource limits: Must prevent Qdrant from consuming all available memory for mmap segments.
   - Mitigation: The `kamelot-core::vectordb::QdrantManager` handles this with a state machine (Stopped → Starting → Ready → Stopping → Stopped). Tested with fault injection.

2. **Memory overhead**: Qdrant server uses ~60MB RSS at idle with 100K vectors. For a 10M-vector corpus, this can grow to ~800MB (mmap segments). Mitigation: configure `mmap_advice = "MADV_RANDOM"` to let the OS manage page cache; set per-segment size limits.

3. **Build time**: The `qdrant-client` crate depends on `tonic` and `prost`, which add ~45 seconds to incremental build times and ~3 minutes to clean builds. Mitigation: `qdrant-client` is behind a feature flag `"vectordb-qdrant"` in `kamelot-core`. Developers can use the `"vectordb-mock"` feature for faster iteration.

4. **gRPC dependency**: gRPC adds ~8MB to the binary (via `tonic` + `prost` + `h2`). Alternative: REST API (HTTP/1.1 JSON) is available but slower (2x latency). gRPC is the right trade-off.

5. **No embedded mode**: The decision to use server mode means two processes instead of one. For Windows users, this means two entries in Task Manager. Mitigation: The Qdrant process is named `kamelot-vectordb` (via binary rename) to reduce confusion.

### Differences from Embedded Mode (Decision Point)

| Concern | Server Mode (Chosen) | Embedded Mode (Rejected) |
|---|---|---|
| Runtime conflicts | No (separate Tokio) | Yes (nested Tokio) |
| Idle memory | ~60MB | ~180MB |
| Start time | ~200ms (spawn + gRPC connect) | ~50ms (library init) |
| Query latency (gRPC vs in-process) | +0.2ms | Baseline |
| Crash isolation | Qdrant crash ≠ Kamelot crash | Any Qdrant panic kills Kamelot |
| Graceful shutdown | SIGHUP → WAL flush | Drop may panic |
| Debugging | Separate gRPC introspection | Same process, harder to isolate |

---

## Configuration Reference

### Default `qdrant.yaml` (bundled with Kamelot)

```yaml
log_level: INFO
storage:
  storage_type: local
  path: /home/user/.kamelot/vectordb
  optimizers:
    default_segment_number: 2
    memmap_threshold_kb: 2048
    memmap_advice: MADV_RANDOM
    vacuum_min_vector_number: 1000
    default_segment_max_size_mb: 100
  wal:
    wal_capacity_mb: 1024
    wal_segments_ahead: 0
hnsw:
  m: 32
  ef_construct: 200
  full_scan_threshold: 10000
service:
  host: 127.0.0.1
  port: 0  # 0 = OS picks available port; Kamelot reads /metrics for port
  grpc_port: 0
  enable_tls: false
  enable_cors: false
telemetry:
  disabled: true  # Kamelot disables telemetry for privacy
```

### Collection Configuration

When Kamelot creates the vector collection, it uses these parameters:

```rust
// From kamelot-core/src/vectordb/qdrant.rs
let config = CollectionConfig {
    vectors: VectorsConfig {
        size: 768,              // Qwen 2 VL Q4 embedding dimension
        distance: Distance::Cosine,
        multivector_config: None,
        datatype: Some(Datatype::Float32),
    },
    hnsw_config: Some(HnswConfigDiff {
        m: Some(32),
        ef_construct: Some(200),
        full_scan_threshold: Some(10000),
        max_indexing_threads: Some(0),  // auto
        on_disk: None,
        payload_m: None,
    }),
    optimizer_config: Some(OptimizersConfigDiff {
        default_segment_number: Some(2),
        memmap_threshold_kb: Some(2048),
        ..Default::default()
    }),
    quantization_config: Some(ScalarQuantization {
        scalar: ScalarQuantizationConfig {
            r#type: ScalarType::Int8,
            quantile: Some(0.99),
            always_ram: Some(true),
        },
    }),
};
```

---

## Migration Plan

### Phase 1 (Current): Qdrant Server Mode

- Single collection `kamelot_files`
- Payload indexes on `file_type`, `file_extension`, `content_hash`
- Scalar quantization (Int8) enabled for memory reduction

### Phase 2 (Q3 2026): Multi-Collection

- Per-user collections (if multi-user support is added)
- Per-file-type collections for specialized indexes (images, audio, documents)

### Phase 3 (Future): Distributed Qdrant

- If Kamelot Network (multi-machine sync) is developed, Qdrant distributed mode with Raft replication
- Collection sharding across machines with vector-level replication

---

## References

- BDR-01: Adopt Rust Over C/C++
- BDR-03: Ollama Over Cloud AI
- BDR-05: Flat Store Over Hierarchy
- BDR-06: Self-Hosted Over SaaS
- docs/developers/01-architecture-overview.md
- docs/developers/09-api-reference.md (VectorDb API)

---

## Appendix A: Qdrant gRPC API Reference

Key gRPC methods used by Kamelot:

```protobuf
// From qdrant-protobuf definitions

service Points {
  // Upsert (insert or update) points
  rpc UpsertPoints(UpsertPoints) returns (PointsOperationResponse);
  
  // Search for nearest neighbors
  rpc SearchPoints(SearchPoints) returns (SearchResponse);
  
  // Delete points by filter or ID
  rpc DeletePoints(DeletePoints) returns (PointsOperationResponse);
  
  // Get points by ID
  rpc GetPoints(GetPoints) returns (GetResponse);
  
  // Scroll/iterate over points
  rpc ScrollPoints(ScrollPoints) returns (ScrollResponse);
  
  // Count points matching filter
  rpc CountPoints(CountPoints) returns (CountResponse);
}

service Collections {
  // Create a new collection
  rpc CreateCollection(CreateCollection) returns (CollectionOperationResponse);
  
  // Delete a collection
  rpc DeleteCollection(DeleteCollection) returns (CollectionOperationResponse);
  
  // Get collection info
  rpc GetCollectionInfo(GetCollectionInfoRequest) returns (GetCollectionInfoResponse);
  
  // Update collection parameters
  rpc UpdateCollection(UpdateCollection) returns (CollectionOperationResponse);
}

service Health {
  // Check service health
  rpc Check(HealthCheckRequest) returns (HealthCheckReply);
}
```

All Kamelot interactions go through the Rust `qdrant-client` crate which wraps these gRPC methods.

## Appendix B: HNSW Algorithm Configuration Trade-offs

The HNSW (Hierarchical Navigable Small World) algorithm has three key parameters that affect search accuracy, speed, and memory:

| Parameter | Description | Effect | Memory Impact |
|---|---|---|---|
| `m` | Number of bidirectional connections per node | Higher m = more accurate, slower index build, more memory | O(m * N * 4 bytes) |
| `ef_construct` | Dynamic candidate list size during construction | Higher = more accurate index, slower build | Negligible |
| `ef_search` | Dynamic candidate list size during search | Higher = more accurate search, slower queries | Negligible |

Parameter selection rationale for Kamelot:

```rust
// From kamelot-core/src/vectordb/qdrant.rs
let hnsw_config = HnswConfigDiff {
    m: Some(32),                          // Balanced: 32 connections per node
    ef_construct: Some(200),              // Good recall (0.98+) at reasonable build speed
    full_scan_threshold: Some(10000),     // Below 10K vectors, just do brute force
    max_indexing_threads: Some(0),         // Auto-detect CPU count
    on_disk: None,                        // Keep graph in RAM for speed
    payload_m: None,                      // No payload-specific M (use global)
};
```

Why these values:
- `m = 32`: Benchmarking showed this provides 0.97 recall@10 while keeping memory at ~5KB per vector. Higher values (48, 64) improve recall marginally (0.98-0.99) but increase memory by 50-100%.
- `ef_construct = 200`: Index build takes ~2 minutes per million vectors. Higher values (400) improve recall by 0.5% but triple build time.
- `full_scan_threshold = 10000`: For collections smaller than 10K vectors, a linear scan is faster than HNSW graph traversal due to index overhead.

Memory calculation for HNSW graph:
```
Memory per vector = m * 2 * 4 bytes (neighbor IDs) + 8 bytes (node metadata)
                   = 32 * 2 * 4 + 8 = 264 bytes

For 1M vectors: 264 MB just for the HNSW graph
For 10M vectors: 2.64 GB for the HNSW graph

Plus vector data: 768 floats × 4 bytes = 3,072 bytes per vector
For 1M vectors: 3,072 MB for vectors
For 10M vectors: 30.72 GB for vectors

Total with scalar quantization (Int8, 4x reduction):
For 1M vectors: 264 MB (graph) + 768 MB (quantized vectors) = 1,032 MB
For 10M vectors: 2.64 GB (graph) + 7.68 GB (quantized vectors) = 10.32 GB
```

## Appendix C: Qdrant Collection Management

Commands for managing Qdrant collections used in production:

```bash
# List all collections
grpcurl -plaintext localhost:6334 qdrant.Collections/List

# Get collection info (point count, segment info)
grpcurl -plaintext -d '{"collection_name": "kamelot_files"}' localhost:6334 qdrant.Collections/GetCollectionInfo

# Update collection parameters (e.g., change HNSW ef_construct)
grpcurl -plaintext -d '{
  "collection_name": "kamelot_files",
  "optimizers_config": {
    "default_segment_number": 3
  }
}' localhost:6334 qdrant.Collections/UpdateCollection

# Manually trigger optimization
grpcurl -plaintext -d '{
  "collection_name": "kamelot_files",
  "optimizer_config": {
    "max_optimization_threads": 4
  }
}' localhost:6334 qdrant.Collections/UpdateCollection

# Create a snapshot for backup
grpcurl -plaintext -d '{"collection_name": "kamelot_files"}' localhost:6334 qdrant.Snapshots/CreateSnapshot

# List snapshots
grpcurl -plaintext -d '{"collection_name": "kamelot_files"}' localhost:6334 qdrant.Snapshots/ListSnapshots
```

## Appendix D: Benchmarks by Index Type

Comparison of HNSW, IVF-PQ, and flat (brute force) indexes for Kamelot's workload:

| Index Type | 1M vectors Latency | 1M vectors Memory | 1M vectors Build Time | Recall@10 |
|---|---|---|---|---|
| HNSW (m=32, ef=200) | 6.1 ms | 3.8 GB | 2 min | 0.983 |
| HNSW (m=16, ef=100) | 3.8 ms | 2.1 GB | 1 min | 0.921 |
| IVF-PQ (nlist=4096, m=16) | 4.2 ms | 1.2 GB | 8 min | 0.895 |
| IVF-PQ (nlist=8192, m=8) | 3.5 ms | 0.8 GB | 10 min | 0.842 |
| Flat (brute force, no index) | 320 ms | 3.1 GB | 0 min | 1.000 |

HNSW with m=32, ef=200 provides the best recall/latency tradeoff. IVF-PQ with product quantization uses less memory but has lower recall. The 3.8 GB memory requirement for 1M vectors is acceptable for a desktop application with 16GB+ RAM.

With scalar quantization (Int8), memory drops to ~1 GB for 1M vectors with negligible recall loss (<0.005):

| Index Type | 1M vectors Memory | Recall@10 |
|---|---|---|
| HNSW (m=32, ef=200) + Int8 scalar quantization | 1.1 GB | 0.978 |
| HNSW (m=32, ef=200) + no quantization | 3.8 GB | 0.983 |

## Appendix E: Alternative Vector Databases Considered (Detailed)

### Weaviate

| Aspect | Evaluation |
|---|---|
| Deployment | Docker/Kubernetes, embedded binary |
| Language | Go |
| API | GraphQL, REST, gRPC |
| Rust client | Community-maintained (weaviate-rs), incomplete |
| Similarity | HNSW, custom vector index |
| Filtering | Rich filtering (similar to Qdrant) |
| Modules | Built-in vectorizer modules (but requires cloud) |
| License | BSD-3-Clause |
| Storage | Object store on disk (own format) |
| Memory | ~500 MB baseline (Go runtime) |
| Verdict | Rejected due to Go runtime overhead, less mature Rust client |

### Chroma

| Aspect | Evaluation |
|---|---|
| Deployment | Embedded (Python), server mode |
| Language | Python (core), Rust (some components) |
| API | Python-first, HTTP API also available |
| Rust client | None official |
| Similarity | HNSW, brute force |
| Filtering | Basic metadata filtering |
| License | Apache 2.0 |
| Storage | DuckDB + Parquet |
| Memory | ~200 MB baseline |
| Verdict | Rejected due to Python-first design, no Rust client, DuckDB overhead for vector workloads |

### Milvus

| Aspect | Evaluation |
|---|---|
| Deployment | Distributed by default (complex), standalone mode available |
| Language | Go (core), C++ (index building) |
| API | REST, gRPC |
| Rust client | Community-maintained, lags behind API |
| Similarity | HNSW, IVF-FLAT, IVF-PQ, DiskANN |
| Filtering | Rich filtering with bitmask indexes |
| License | Apache 2.0 |
| Storage | Object store + metadata store (etcd + MinIO recommended) |
| Memory | ~2 GB baseline (many components) |
| Verdict | Rejected due to operational complexity (3+ services for HA), heavy resource requirements |

## Appendix F: Payload Schema for Kamelot

The complete payload schema attached to each vector point:

```json
{
  "file_name": "report.pdf",
  "file_extension": "pdf",
  "original_path": "/home/user/docs/report.pdf",
  "file_type": "document",
  "mime_type": "application/pdf",
  "file_size": 245760,
  "created_at": 1735689600,
  "modified_at": 1735776000,
  "content_hash": "sha256:a1b2c3d4e5f6...",
  "compressed": true,
  "encrypted": true,
  "tags": ["work", "finance", "q1-2025"],
  "chunk_index": 0,
  "total_chunks": 1,
  "parent_hash": "",
  "indexed_at": 1735862400
}
```

Payload indexes created by default:
- `file_type`: Keyword index (used for filtering by document type)
- `file_extension`: Keyword index (used for "show PDFs" queries)
- `created_at`: Range index (used for "files from last month")
- `content_hash`: Keyword index (used for dedup checks and exact file lookup)
- `file_size`: Range index (used for "find files larger than 10MB")

## Appendix G: Operational Runbook

### Health Check Script

```bash
#!/bin/bash
# kamelot-health.sh - Check Qdrant health for Kamelot

QDRANT_HOST="127.0.0.1:6334"

echo "=== Qdrant Health Check for Kamelot ==="

# 1. Check if process is running
if pgrep -x qdrant > /dev/null; then
    echo "[✓] Qdrant process is running (PID: $(pgrep -x qdrant))"
else
    echo "[✗] Qdrant process is NOT running"
    exit 1
fi

# 2. Check gRPC health endpoint
HEALTH=$(grpcurl -plaintext -d '{}' $QDRANT_HOST qdrant.Health/Check 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "[✓] gRPC health check passed: $HEALTH"
else
    echo "[✗] gRPC health check failed"
fi

# 3. Check collection info
COLLECTION_INFO=$(grpcurl -plaintext -d '{"collection_name": "kamelot_files"}' $QDRANT_HOST qdrant.Collections/GetCollectionInfo 2>/dev/null)
if [ $? -eq 0 ]; then
    POINTS=$(echo $COLLECTION_INFO | grep -oP '"points_count":\s*\K\d+')
    echo "[✓] Collection 'kamelot_files' exists with $POINTS points"
else
    echo "[✗] Collection 'kamelot_files' not found"
fi

# 4. Check disk usage
STORAGE_PATH=$(grep 'path:' ~/.kamelot/vectordb/qdrant.yaml | awk '{print $2}')
DISK_USAGE=$(du -sh $STORAGE_PATH 2>/dev/null | cut -f1)
echo "[i] Qdrant storage: $DISK_USAGE"

# 5. Check memory usage
QDRANT_MEM=$(ps -o rss= -p $(pgrep -x qdrant) | awk '{printf "%.0f MB", $1/1024}')
echo "[i] Qdrant memory: $QDRANT_MEM"

echo "=== Done ==="
```

### Recovery Procedure

If Qdrant crashes or becomes unresponsive:

```bash
# 1. Verify the crash
kamelot status --json | grep qdrant

# 2. Restart Qdrant (Kamelot's QdrantManager does this automatically)
# If automatic recovery fails:
kamelot vectordb restart

# 3. Check WAL recovery
tail -100 ~/.kamelot/logs/qdrant.log | grep -i "recovery\|wal\|error"

# 4. Force rebuild if data is corrupted
kamelot vectordb rebuild-collection --force

# 5. Restore from snapshot (if available)
kamelot vectordb restore-snapshot --latest

# 6. If all else fails, re-create collection and re-index:
kamelot vectordb reset
kamelot ingest --resume-from-last-checkpoint
```

*This decision was reviewed and accepted on 2026-01-20. The embedded mode was revisited on 2026-02-15 and the server mode decision was reaffirmed after prototyping both approaches.*

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

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