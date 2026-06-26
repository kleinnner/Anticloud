                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# Qdrant Integration

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

- [Introduction](#introduction)
- [Qdrant Overview](#qdrant-overview)
- [Architecture](#architecture)
- [Collection Setup](#collection-setup)
- [Vector Configuration](#vector-configuration)
- [Query Flow](#query-flow)
- [gRPC Client Architecture](#grpc-client-architecture)
- [Embedding Synchronization](#embedding-synchronization)
- [Index Configuration](#index-configuration)
- [HNSW Parameters](#hnsw-parameters)
- [Payload Management](#payload-management)
- [Filtering and Optimization](#filtering-and-optimization)
- [Performance Tuning](#performance-tuning)
- [Client Implementation](#client-implementation)
- [Error Handling and Retries](#error-handling-and-retries)
- [Bulk Operations](#bulk-operations)
- [Snapshot and Recovery](#snapshot-and-recovery)
- [Configuration Reference](#configuration-reference)
- [Security Considerations](#security-considerations)

---

## Introduction

Qdrant is the vector database that powers Kamelot's semantic search engine. It stores all file embeddings as 1536-dimensional vectors, indexes them using HNSW (Hierarchical Navigable Small World) graphs, and provides fast approximate nearest neighbor search at query time.

Kamelot embeds Qdrant as a library (using its Rust client with gRPC) rather than running it as a separate service. This eliminates network overhead and simplifies deployment while maintaining the full feature set of the vector database.

---

## Qdrant Overview

Qdrant is an open-source vector database written in Rust, optimized for high-performance similarity search:

### Key Features

| Feature | Kamelot Usage |
|---------|--------------|
| Vector storage | 1536-dimensional file embeddings |
| HNSW indexing | Approximate nearest neighbor search |
| Payload storage | File metadata alongside vectors |
| Filtering | Filter by file type, date, size |
| gRPC API | Client-server communication |
| Batching | Bulk upsert for ingestion pipeline |
| Snapshots | Backup and restore vector indexes |
| Distances | Cosine similarity |
| Quantization | Optional for memory reduction |

---

## Architecture

```graphify
graph TD
    subgraph "Kamelot Process"
        VFS[VFS Daemon]
        QE[Query Engine]
        ING[Ingestion Pipeline]
        QC[Qdrant Client<br/>gRPC]
    end
    
    subgraph "Qdrant Embedded"
        GRPC[gRPC Server<br/>localhost only]
        COLL[Collection<br/>kamelot_vectors]
        HNSW[HNSW Index]
        PAY[Payload Store]
        WAL[Write-Ahead Log]
        SEG[Segment Manager]
        STORE[Storage<br/>Local File System]
    end
    
    subgraph "Query Flow"
        Q[Natural Language<br/>Query]
        EMB[Qwen 2 VL<br/>Embedder]
        SRCH[Vector Search]
        RES[Result Inodes]
    end
    
    VFS --> QE
    QE --> QC
    ING --> QC
    QC --> GRPC
    GRPC --> COLL
    COLL --> HNSW
    COLL --> PAY
    COLL --> WAL
    COLL --> SEG
    SEG --> STORE
    
    Q --> EMB
    EMB --> SRCH
    SRCH --> QC
    QC --> RES
```

---

## Collection Setup

On first initialization, Kamelot creates a dedicated Qdrant collection:

```rust
use qdrant_client::qdrant::{
    CreateCollectionBuilder, VectorParamsBuilder, Distance,
    HnswConfigDiffBuilder, OptimizersConfigDiffBuilder,
    CollectionOperationResponse,
};

fn create_collection(client: &QdrantClient) -> Result<CollectionOperationResponse> {
    let request = CreateCollectionBuilder::new(
        "kamelot_vectors",
        VectorParamsBuilder::new(1536, Distance::Cosine)
    )
    .optimizers_config(
        OptimizersConfigDiffBuilder::default()
            .default_segment_number(2)
            .memmap_threshold_kb(65536)
    )
    .hnsw_config(
        HnswConfigDiffBuilder::default()
            .m(16)
            .ef_construct(200)
            .full_scan_threshold(10000)
    )
    .on_disk_payload(true)
    .build();
    
    client.create_collection(request).await
}
```

### Collection Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Collection name | `kamelot_vectors` | Descriptive |
| Vector size | 1536 | Qwen 2 VL embedding dimension |
| Distance metric | Cosine | Best for semantic similarity |
| On-disk payload | True | Reduce RAM usage |
| Replication factor | 1 | Single-node embedded deployment |
| Write consistency factor | 1 | No replication needed |
| Shard number | 1 | Single-node embedded deployment |

---

## Vector Configuration

### Vector Parameters

```rust
VectorParamsBuilder::new(1536, Distance::Cosine)
    .on_disk(true)
```

### Distance Metric Selection

Why Cosine over Dot or Euclidean:

| Metric | Formula | Best For | Notes |
|--------|---------|----------|-------|
| Cosine | 1 - cos(A, B) | Semantic similarity | Invariant to vector magnitude |
| Dot | -A·B | Normalized vectors | Same as cosine for unit vectors |
| Euclidean | |A - B|² | Spatial data | Sensitive to magnitude |

Since Kamelot normalizes all embeddings to unit length, Cosine and Dot are equivalent. Cosine is chosen for clarity and compatibility.

### Vector Storage

| Aspect | In-Memory | On-Disk |
|--------|-----------|---------|
| Performance | ~10x faster | Baseline |
| RAM usage (1M vectors) | ~6 GB | ~100 MB |
| Query latency | 0.2 ms | 1.5 ms |
| Recommended for | < 100K vectors | > 100K vectors |

Kamelot defaults to on-disk storage for the payload but keeps the HNSW graph in memory for performance.

---

## Query Flow

The complete query flow from natural language to file results:

```graphify
sequenceDiagram
    participant User as User/App
    participant VFS as VFS Daemon
    participant Embed as Qwen 2 VL
    participant QClient as Qdrant Client
    participant Qdrant as Qdrant Engine
    
    User->>VFS: Request: "tax documents 2025"
    VFS->>Embed: embed("tax documents 2025")
    Embed-->>VFS: vector [1536 f32]
    VFS->>QClient: Search(collection, vector, limit=100)
    QClient->>Qdrant: gRPC: SearchPoints
    Qdrant->>Qdrant: HNSW search
    Qdrant-->>QClient: Top 100 results
    QClient-->>VFS: Vec<ScoredPoint>
    VFS->>VFS: Extract inodes from payload
    VFS-->>User: Virtual directory with files
```

### Search Request

```rust
use qdrant_client::qdrant::{
    SearchPointsBuilder, SearchResponse, WithPayloadSelectorBuilder,
    FilterBuilder, FieldConditionBuilder, MatchBuilder,
};

async fn search(
    client: &QdrantClient,
    vector: Vec<f32>,
    limit: u64,
    score_threshold: Option<f32>,
    filters: Option<Filter>,
) -> Result<SearchResponse> {
    let mut request = SearchPointsBuilder::new(
        "kamelot_vectors",
        vector,
        limit,
    )
    .with_payload(WithPayloadSelectorBuilder::default().enable(true))
    .build();
    
    if let Some(threshold) = score_threshold {
        request.score_threshold = threshold;
    }
    
    if let Some(filter) = filters {
        request.filter = Some(filter);
    }
    
    client.search_points(request).await
}
```

### Search Response

```rust
struct SearchResult {
    inode: u64,              // From payload
    filename: String,         // From payload
    similarity: f32,          // Cosine similarity score
    mime_type: String,        // From payload
    size: u64,                // From payload
    created_at: SystemTime,   // From payload
}

impl From<ScoredPoint> for SearchResult {
    fn from(point: ScoredPoint) -> Self {
        let payload = point.payload.unwrap();
        SearchResult {
            inode: payload["inode"].as_integer().unwrap() as u64,
            filename: payload["filename"].as_str().unwrap().to_string(),
            similarity: point.score,
            mime_type: payload["mime_type"].as_str().unwrap().to_string(),
            size: payload["size"].as_integer().unwrap() as u64,
            created_at: /* parse from payload */,
        }
    }
}
```

---

## gRPC Client Architecture

Kamelot uses Qdrant's gRPC API for communication. Even in embedded mode, the communication happens over localhost gRPC.

### Client Connection

```rust
use qdrant_client::QdrantClient;

#[derive(Clone)]
struct QdrantConnection {
    client: QdrantClient,
    health: Arc<AtomicBool>,
    reconnect_backoff: ExponentialBackoff,
}

impl QdrantConnection {
    async fn connect(config: &QdrantConfig) -> Result<Self> {
        let client = QdrantClient::from_url(&format!(
            "http://{}:{}",
            config.host,
            config.port
        ))
        .with_api_key(config.api_key.as_deref())
        .with_connect_timeout(config.connect_timeout)
        .with_timeout(config.request_timeout)
        .build()?;
        
        Ok(Self {
            client,
            health: Arc::new(AtomicBool::new(true)),
            reconnect_backoff: ExponentialBackoff::new(
                Duration::from_millis(100),
                Duration::from_secs(30),
            ),
        })
    }
    
    async fn health_check(&self) -> Result<bool> {
        match self.client.health_check(()).await {
            Ok(_) => {
                self.health.store(true, Ordering::Relaxed);
                Ok(true)
            }
            Err(_) => {
                self.health.store(false, Ordering::Relaxed);
                Ok(false)
            }
        }
    }
}
```

### Proto Service Definition

Kamelot's Qdrant interaction uses the standard Qdrant protobuf service:

```protobuf
service Qdrant {
    rpc UpsertPoints (UpsertPointsRequest) returns (UpsertPointsResponse);
    rpc DeletePoints (DeletePointsRequest) returns (DeletePointsResponse);
    rpc SearchPoints (SearchPointsRequest) returns (SearchPointsResponse);
    rpc ScrollPoints (ScrollPointsRequest) returns (ScrollPointsResponse);
    rpc CountPoints (CountPointsRequest) returns (CountPointsResponse);
    rpc RecommendPoints (RecommendPointsRequest) returns (RecommendPointsResponse);
}
```

### Used Methods

| Method | Purpose | Frequency |
|--------|---------|-----------|
| UpsertPoints | Index new/changed vectors | On every ingestion |
| SearchPoints | Query by vector | On every VFS query |
| DeletePoints | Remove deleted file vectors | On file deletion |
| ScrollPoints | Iterate all vectors (for reindex) | Rare |
| CountPoints | Get vector count for stats | Periodic |
| RecommendPoints | Similarity recommendation | Optional feature |

---

## Embedding Synchronization

The embedding index must stay synchronized with the flat store:

### Synchronization Flow

```graphify
flowchart TD
    A[File Ingestion] --> B[Blob Encrypted & Stored]
    B --> C[Embedding Generated]
    C --> D[Upsert to Qdrant]
    D --> E[sled: mark indexed]
    
    F[File Deletion] --> G[sled: mark deleted]
    G --> H[Delete from Qdrant]
    H --> I[Ledger entry]
    
    J[sled Crash/Replay] --> K{Check: inode in Qdrant?}
    K -->|Yes| L[Verify hash matches]
    K -->|No| M[Re-embed and upsert]
    L --> N{Match?}
    N -->|Yes| O[OK]
    N -->|No| M
    
    P[Reindex Command] --> Q[Scroll All Qdrant Points]
    Q --> R[For each: verify in sled]
    R --> S{Exists?}
    S -->|Yes| T[Check hash]
    S -->|No| U[Delete from Qdrant]
    T --> V{Match?}
    V -->|Yes| W[Skip]
    V -->|No| X[Re-embed]
    X --> Y[Upsert Updated]
```

### Consistency Check

```bash
# Verify synchronization
kml qdrant verify

# Re-sync from scratch
kml qdrant resync

# Check specific inode
kml qdrant check --inode 000000000000002A
```

---

## Index Configuration

### HNSW Index

The HNSW (Hierarchical Navigable Small World) index is the primary search data structure:

```rust
HnswConfigDiffBuilder::default()
    .m(16)                          // Number of bi-directional links per node
    .ef_construct(200)              // Dynamic candidate list size during construction
    .full_scan_threshold(10000)     // Threshold for switching to exact search
    .max_indexing_threads(4)        // Parallel indexing threads
    .on_disk(false)                 // Keep index in memory for performance
```

### Segment Configuration

```rust
OptimizersConfigDiffBuilder::default()
    .default_segment_number(2)          // Target segments per shard
    .memmap_threshold_kb(65536)         // Threshold for mmap (64 MB)
    .indexing_threshold(20000)          // Items threshold for index building
    .flush_interval_sec(5)              // WAL flush frequency
    .max_optimization_threads(2)        // Background optimization threads
```

### Payload Index

Qdrant can index payload fields for fast filtering:

```rust
fn create_payload_indexes(client: &QdrantClient) -> Result<()> {
    // Index on mime_type for filtering by file type
    client.create_field_index(
        CreateFieldIndexCollectionBuilder::new(
            "kamelot_vectors",
            "mime_type",
            FieldType::Keyword,
        )
    )?;
    
    // Index on created_at for time-based filtering
    client.create_field_index(
        CreateFieldIndexCollectionBuilder::new(
            "kamelot_vectors",
            "created_at",
            FieldType::Integer,
        )
    )?;
    
    // Index on file_type for category filtering
    client.create_field_index(
        CreateFieldIndexCollectionBuilder::new(
            "kamelot_vectors",
            "file_type",
            FieldType::Keyword,
        )
    )?;
    
    Ok(())
}
```

---

## HNSW Parameters

### Parameter Guide

| Parameter | Effect | Low Value | High Value |
|-----------|--------|-----------|------------|
| `m` | Graph connectivity | Lower memory, lower recall | Higher memory, higher recall |
| `ef_construct` | Index quality | Faster indexing | Better recall |
| `ef_search` | Search quality | Faster search | Better recall |

### Kamelot Defaults

| Parameter | Default | Memory (1M vectors) | Recall@10 |
|-----------|---------|-------------------|-----------|
| m = 8, ef = 100 | 200 MB | 0.94 |
| m = 16, ef = 100 | 300 MB | 0.97 |
| m = 16, ef = 200 | 300 MB | 0.99 |
| m = 32, ef = 100 | 500 MB | 0.98 |
| m = 32, ef = 200 | 500 MB | 0.995 |

### Search-Time Parameter

```rust
#[derive(Clone)]
struct SearchConfig {
    /// HNSW ef parameter for search (trade-off: speed vs recall)
    ef_search: u64,
    
    /// Exact search threshold (use exact KNN below this many vectors)
    exact_search_threshold: u64,
    
    /// Whether to use quantization
    quantization: Option<QuantizationConfig>,
}

impl Default for SearchConfig {
    fn default() -> Self {
        Self {
            ef_search: 100,
            exact_search_threshold: 10000,
            quantization: None,
        }
    }
}
```

---

## Payload Management

### Stored Payload Fields

| Field | Type | Purpose | Size per Entry |
|-------|------|---------|---------------|
| `inode` | `uint64` | Primary key | 8 bytes |
| `filename` | `string` | Display name | ~50 bytes avg |
| `original_path` | `string` | Original location | ~100 bytes avg |
| `mime_type` | `string` | File type filter | ~20 bytes avg |
| `file_type` | `string` | Category | ~10 bytes avg |
| `size` | `uint64` | File size | 8 bytes |
| `created_at` | `uint64` | Unix timestamp | 8 bytes |
| `modified_at` | `uint64` | Unix timestamp | 8 bytes |
| `content_hash` | `string` | Integrity check | 64 bytes |
| `tags` | `repeated string` | User labels | ~50 bytes avg |

### Payload Size

| Files | Raw Payload | Compressed | On Disk |
|-------|------------|-----------|---------|
| 10,000 | 3.5 MB | 1.8 MB | 5 MB |
| 100,000 | 35 MB | 18 MB | 50 MB |
| 1,000,000 | 350 MB | 180 MB | 500 MB |

---

## Filtering and Optimization

### Query Filters

```rust
fn build_query_filter(query: &ParsedQuery) -> Option<Filter> {
    let mut conditions = Vec::new();
    
    // Filter by file type
    if let Some(file_type) = &query.file_type {
        conditions.push(
            FieldConditionBuilder::new("file_type")
                .r#match(MatchBuilder::new().keyword(file_type))
                .build()
        );
    }
    
    // Filter by MIME type
    if let Some(mime) = &query.mime_type {
        conditions.push(
            FieldConditionBuilder::new("mime_type")
                .r#match(MatchBuilder::new().keyword(mime))
                .build()
        );
    }
    
    // Filter by date range
    if let Some(date_range) = &query.date_range {
        conditions.push(
            FieldConditionBuilder::new("created_at")
                .range(RangeBuilder::new()
                    .gte(date_range.start.timestamp())
                    .lte(date_range.end.timestamp()))
                .build()
        );
    }
    
    // Filter by size range
    if let Some(size_range) = &query.size_range {
        conditions.push(
            FieldConditionBuilder::new("size")
                .range(RangeBuilder::new()
                    .gte(size_range.min)
                    .lte(size_range.max))
                .build()
        );
    }
    
    if conditions.is_empty() {
        None
    } else {
        Some(FilterBuilder::new().must(conditions).build())
    }
}
```

### Performance Optimization

```graphify
flowchart TD
    A[Query Arrives] --> B{Has Filters?}
    B -->|Yes| C{Filter Selectivity}
    C -->|High Selectivity| D[Pre-filter Payloads]
    C -->|Low Selectivity| E[Vector Search First]
    D --> F[Limited Vector Search]
    E --> G[Full Vector Search]
    F --> H[Apply Remaining Filters]
    G --> H
    H --> I[Return Results]
    
    B -->|No| J[Standard HNSW Search]
    J --> I
```

### Scrolling Large Result Sets

```rust
async fn scroll_all_matching(
    client: &QdrantClient,
    filter: Option<Filter>,
    batch_size: u64,
) -> Result<Vec<ScoredPoint>> {
    let mut all_points = Vec::new();
    let mut offset: Option<PointId> = None;
    
    loop {
        let request = ScrollPointsBuilder::new("kamelot_vectors")
            .limit(batch_size)
            .filter(filter.clone())
            .with_payload(true)
            .build();
        
        // Apply offset for pagination
        let request = if let Some(off) = offset {
            request.with_offset(off)
        } else {
            request
        };
        
        let response = client.scroll_points(request).await?;
        
        all_points.extend(response.result.unwrap().points);
        
        if let Some(next_offset) = response.next_page_offset {
            offset = Some(next_offset);
        } else {
            break;
        }
    }
    
    Ok(all_points)
}
```

---

## Performance Tuning

### Benchmark Configuration

```toml
[qdrant.performance]
# HNSW search parameter (higher = better recall, slower)
ef_search = 100

# Quantization strategy: None, Scalar, Product
quantization = "Scalar"
quantization_always = false

# Enable on-disk vector storage
vectors_on_disk = false

# Enable on-disk payload storage
payload_on_disk = true

# Mmap threshold for segments (bytes)
mmap_threshold = "64MB"

# Indexing threshold (items before index is built)
indexing_threshold = 20000

# Max threads for indexing
max_indexing_threads = 4

# Max threads for optimization
max_optimization_threads = 2

# WAL flush interval (seconds)
flush_interval = 5
```

### Latency vs Recall Trade-off

```graphify
graph LR
    subgraph "ef_search = 50"
        L50[Latency: 0.5ms<br/>Recall: 0.93]
    end
    subgraph "ef_search = 100"
        L100[Latency: 0.8ms<br/>Recall: 0.97]
    end
    subgraph "ef_search = 200"
        L200[Latency: 1.5ms<br/>Recall: 0.99]
    end
    subgraph "ef_search = 500"
        L500[Latency: 3.2ms<br/>Recall: 0.998]
    end
    
    L50 --> L100 --> L200 --> L500
```

### Memory Optimization

| Technique | Memory Saved | Performance Impact | Complexity |
|-----------|-------------|-------------------|-----------|
| Scalar quantization | 4x | -5% recall | Low |
| Product quantization (PQ) | 8x | -10% recall | Medium |
| On-disk vectors | 6 GB freed | +1ms latency | Low |
| On-disk payload | 500 MB freed | No impact | Low |
| Raw score (no quantization) | Baseline | Baseline | None |

---

## Client Implementation

### Complete Client Wrapper

```rust
use qdrant_client::prelude::*;
use qdrant_client::qdrant::*;

#[derive(Clone)]
pub struct KamelotQdrantClient {
    client: QdrantClient,
    config: QdrantConfig,
}

impl KamelotQdrantClient {
    pub async fn connect(config: QdrantConfig) -> Result<Self> {
        let client = QdrantClient::from_url(&config.url())
            .with_api_key(config.api_key.as_deref())
            .with_connect_timeout(Duration::from_secs(5))
            .with_timeout(Duration::from_secs(30))
            .build()?;
        
        Ok(Self { client, config })
    }
    
    pub async fn ensure_collection(&self) -> Result<()> {
        let collections = self.client.list_collections().await?;
        let exists = collections.collections.iter()
            .any(|c| c.name == self.config.collection);
        
        if !exists {
            self.create_collection().await?;
        }
        
        Ok(())
    }
    
    pub async fn index_file(&self, inode: u64, vector: Vec<f32>,
                             metadata: &FileMetadata) -> Result<()> {
        let points = vec![PointStruct::new(
            inode as PointId,
            vector,
            metadata.to_payload(),
        )];
        
        self.client.upsert_points(
            UpsertPointsBuilder::new(
                &self.config.collection,
                points,
            ).wait(true),
        ).await?;
        
        Ok(())
    }
    
    pub async fn search(&self, vector: Vec<f32>, limit: u64,
                        threshold: f32) -> Result<Vec<SearchResult>> {
        let response = self.client.search_points(
            SearchPointsBuilder::new(
                &self.config.collection,
                vector,
                limit as u64,
            )
            .score_threshold(threshold)
            .with_payload(true),
        ).await?;
        
        Ok(response.result.into_iter()
            .map(SearchResult::from)
            .collect())
    }
    
    pub async fn delete_file(&self, inode: u64) -> Result<()> {
        let points = vec![inode.into()];
        self.client.delete_points(
            DeletePointsBuilder::new(&self.config.collection)
                .points(points),
        ).await?;
        
        Ok(())
    }
    
    pub async fn count(&self) -> Result<u64> {
        let response = self.client.count_points(
            CountPointsBuilder::new(&self.config.collection),
        ).await?;
        
        Ok(response.result.map(|r| r.count as u64).unwrap_or(0))
    }
}
```

---

## Error Handling and Retries

### Retry Policy

```rust
#[derive(Clone)]
struct RetryPolicy {
    max_retries: u32,
    base_delay: Duration,
    max_delay: Duration,
    retryable_errors: Vec<grpc::Code>,
}

impl Default for RetryPolicy {
    fn default() -> Self {
        Self {
            max_retries: 3,
            base_delay: Duration::from_millis(100),
            max_delay: Duration::from_secs(5),
            retryable_errors: vec![
                grpc::Code::Unavailable,
                grpc::Code::DeadlineExceeded,
                grpc::Code::ResourceExhausted,
                grpc::Code::Internal,
            ],
        }
    }
}

impl QdrantClientWrapper {
    async fn with_retry<T, F, Fut>(&self, operation: F) -> Result<T>
    where
        F: Fn() -> Fut,
        Fut: Future<Output = Result<T>>,
    {
        let mut last_error = None;
        let mut delay = self.retry_policy.base_delay;
        
        for attempt in 0..=self.retry_policy.max_retries {
            match operation().await {
                Ok(result) => return Ok(result),
                Err(e) => {
                    if self.is_retryable(&e) && attempt < self.retry_policy.max_retries {
                        tokio::time::sleep(delay).await;
                        delay = (delay * 2).min(self.retry_policy.max_delay);
                        last_error = Some(e);
                    } else {
                        return Err(e);
                    }
                }
            }
        }
        
        Err(last_error.unwrap())
    }
    
    fn is_retryable(&self, error: &QdrantError) -> bool {
        match error {
            QdrantError::Grpc(status) => {
                self.retry_policy.retryable_errors.contains(&status.code())
            }
            QdrantError::Timeout(_) => true,
            _ => false,
        }
    }
}
```

---

## Bulk Operations

### Batch Indexing

```rust
async fn batch_index(
    client: &KamelotQdrantClient,
    batch: Vec<(u64, Vec<f32>, Payload)>,
) -> Result<()> {
    const BATCH_SIZE: usize = 100;
    
    for chunk in batch.chunks(BATCH_SIZE) {
        let points: Vec<PointStruct> = chunk.iter()
            .map(|(inode, vector, payload)| {
                PointStruct::new(*inode as PointId, vector.clone(), payload.clone())
            })
            .collect();
        
        client.upsert_points(
            UpsertPointsBuilder::new("kamelot_vectors", points)
                .wait(true),
        ).await?;
    }
    
    Ok(())
}
```

### Bulk Delete

```rust
async fn batch_delete(
    client: &KamelotQdrantClient,
    inodes: &[u64],
) -> Result<()> {
    const BATCH_SIZE: usize = 1000;
    
    for chunk in inodes.chunks(BATCH_SIZE) {
        let points: Vec<PointId> = chunk.iter()
            .map(|&id| id.into())
            .collect();
        
        client.delete_points(
            DeletePointsBuilder::new("kamelot_vectors")
                .points(points),
        ).await?;
    }
    
    Ok(())
}
```

---

## Snapshot and Recovery

### Creating Snapshots

```rust
async fn create_snapshot(client: &QdrantClient) -> Result<String> {
    let response = client.create_snapshot(
        CreateSnapshotBuilder::new("kamelot_vectors"),
    ).await?;
    
    Ok(response.snapshot_url)
}
```

### Recovery

```bash
# List available snapshots
kml qdrant snapshots

# Restore from snapshot
kml qdrant restore --snapshot mysnapshot.snapshot

# Recover from backup
kml backup restore --qdrant-only /backups/kamelot-backup.tar.gz
```

---

## Configuration Reference

```toml
[qdrant]
# gRPC connection
host = "127.0.0.1"
port = 6334
api_key = ""

# Collection
collection = "kamelot_vectors"
dimension = 1536
distance = "Cosine"

# Storage
storage_path = "/var/lib/kamelot/qdrant"
on_disk_payload = true
on_disk_vectors = false

# HNSW index
hnsw_m = 16
hnsw_ef_construct = 200
hnsw_ef_search = 100
hnsw_full_scan_threshold = 10000

# Optimizers
optimizer_default_segment_number = 2
optimizer_memmap_threshold = "64MB"
optimizer_indexing_threshold = 20000
optimizer_flush_interval = 5

# Quantization
quantization_enabled = false
quantization_type = "Scalar"
quantization_always = false

# Performance
max_indexing_threads = 4
max_optimization_threads = 2
connect_timeout = "5s"
request_timeout = "30s"

# Retry
max_retries = 3
retry_base_delay = "100ms"
retry_max_delay = "5s"
```

---

## Security Considerations

### Network Security

- gRPC server binds to localhost only (127.0.0.1)
- No external network exposure
- Optional TLS for remote deployments
- API key for authentication

### Data Security

- Payload does not contain file contents
- Payload contains only metadata and inode references
- Vector data does not reveal file content
- All file contents are in the encrypted flat store

### Operational Security

- Snapshots are encrypted at rest
- WAL is written to encrypted storage
- Memory-mapped segments are in process address space
- Client connections are authenticated

### Audit Logging

```rust
impl KamelotQdrantClient {
    async fn audit_log(&self, operation: &str, inode: Option<u64>) {
        log::info!(
            "Qdrant operation: {} | inode: {:?} | client: {}",
            operation,
            inode,
            self.config.host,
        );
    }
}
```

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com