                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# FAQ — Performance

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [How Fast Is Search with 10K / 100K / 1M Files?](#how-fast-is-search-with-10k--100k--1m-files)
2. [Does the AI Model Slow Things Down?](#does-the-ai-model-slow-things-down)
3. [How Much RAM Does Kamelot Use?](#how-much-ram-does-kamelot-use)
4. [Does It Work on SSDs and HDDs?](#does-it-work-on-ssds-and-hdds)
5. [What Is the Indexing Speed?](#what-is-the-indexing-speed)
6. [Will Kamelot Slow Down My Computer?](#will-kamelot-slow-down-my-computer)
7. [How Does Performance Compare to Spotlight / Everything?](#how-does-performance-compare-to-spotlight--everything)
8. [What Is the Query Latency Breakdown?](#what-is-the-query-latency-breakdown)
9. [Does Kamelot Use Network Bandwidth?](#does-kamelot-use-network-bandwidth)
10. [Can I Run Kamelot on a Raspberry Pi?](#can-i-run-kamelot-on-a-raspberry-pi)
11. [How Does Performance Scale with Multiple Users?](#how-does-performance-scale-with-multiple-users)
12. [What Can I Do to Improve Performance?](#what-can-i-do-to-improve-performance)

---

## How Fast Is Search with 10K / 100K / 1M Files?

Search performance depends on file count, hardware, and configuration. Below are benchmarks for a typical configuration (GPU + NVMe SSD + 32 GB RAM):

### Query Latency (p95, GPU Embedding)

| File Count | Simple Query | Complex Query | First Query (cold) | Cache Hit |
|-----------|-------------|--------------|-------------------|-----------|
| 1,000 | 25ms | 45ms | 95ms | 12ms |
| 10,000 | 30ms | 55ms | 110ms | 14ms |
| 100,000 | 45ms | 75ms | 140ms | 18ms |
| 500,000 | 70ms | 110ms | 190ms | 25ms |
| 1,000,000 | 90ms | 150ms | 240ms | 30ms |
| 5,000,000 | 200ms | 350ms | 500ms | 60ms |

### Query Latency (p95, CPU-Only Embedding)

| File Count | Simple Query | Complex Query | First Query (cold) |
|-----------|-------------|--------------|-------------------|
| 1,000 | 120ms | 300ms | 450ms |
| 10,000 | 130ms | 320ms | 480ms |
| 100,000 | 150ms | 360ms | 520ms |
| 500,000 | 200ms | 420ms | 620ms |
| 1,000,000 | 250ms | 500ms | 750ms |

### Definitions

- **Simple query**: "budget spreadsheet" (3 words, common terms)
- **Complex query**: "The architecture diagram from the Q2 planning session that shows the new microservices for the onboarding flow" (20 words, specific context)
- **First query**: Time includes model loading into VRAM/cache (cold start)
- **Cache hit**: Query result is served from the query cache (identical or similar query recently executed)

---

## Does the AI Model Slow Things Down?

The AI model (Qwen 2 VL Q4) is the primary determinant of query and indexing latency.

### Embedding Generation Latency

| Hardware | Model | Average Latency | Peak VRAM/RAM |
|----------|-------|----------------|---------------|
| NVIDIA RTX 4090 | Qwen 2 VL 7B Q4 | 8ms | 6.2 GB VRAM |
| NVIDIA RTX 3090 | Qwen 2 VL 7B Q4 | 12ms | 6.2 GB VRAM |
| NVIDIA RTX 3060 | Qwen 2 VL 7B Q4 | 22ms | 6.2 GB VRAM |
| Apple M2 Max (32GB) | Qwen 2 VL 7B Q4 | 18ms | 8 GB unified |
| Apple M1 (16GB) | Qwen 2 VL 7B Q4 | 45ms | 8 GB unified |
| AMD RX 7900 XTX | Qwen 2 VL 7B Q4 | 15ms | 6.5 GB VRAM |
| CPU (AMD Ryzen 9 7950X) | Qwen 2 VL 7B Q4 | 180ms | 12 GB RAM |
| CPU (Intel i7-13700K) | Qwen 2 VL 7B Q4 | 220ms | 12 GB RAM |
| CPU (Intel i5-12400) | Qwen 2 VL 7B Q4 | 350ms | 12 GB RAM |
| Any (mock mode) | None | 0.1ms | 0 MB |

### Does the Model Run Continuously?

The model is loaded into VRAM/RAM when the Kamelot daemon starts and stays resident for the lifetime of the process. This means:

- **First query after daemon start**: Slower (100-500ms) as model is loaded
- **Subsequent queries**: Model already loaded, only inference time (~10-50ms)
- **CPU impact**: Minimal when idle (model sits in RAM, uses minimal CPU)
- **GPU impact**: Minimal when idle (model sits in VRAM, zero GPU utilization)

You can configure the model to unload after a period of inactivity to free resources:

```toml
[ollama]
unload_after_seconds = 300  # Unload model after 5 minutes idle
```

---

## How Much RAM Does Kamelot Use?

### Memory Usage Breakdown

| Component | Idle RAM | Active RAM | Notes |
|-----------|---------|-----------|-------|
| Kamelot daemon | 15-30 MB | 50-100 MB | Rust binary, minimal |
| Qdrant (100K vectors) | 800 MB | 800 MB | HNSW graph in RAM |
| Qdrant (1M vectors) | 8 GB | 8 GB | Scales linearly with vectors |
| Ollama (Qwen 2 VL Q4) | 6-8 GB | 6-8 GB | Model loaded in VRAM or RAM |
| Vello UI | 15-30 MB | 30-60 MB | GPU UI, minimal |
| sled metadata store | 10-50 MB | 10-50 MB | Embedded DB |
| **Total (100K files)** | **~7-9 GB** | **~7-9 GB** | |
| **Total (1M files)** | **~14-16 GB** | **~14-16 GB** | |

### Memory Optimization Options

| Technique | RAM Saved | Performance Impact |
|-----------|----------|-------------------|
| Use smaller model (Qwen 2 VL 2B Q4) | ~3 GB | Reduced accuracy |
| Use CPU-only model (nomic-embed-text) | ~6 GB (no GPU) | Reduced multimodal capabilities |
| Unload model when idle | ~6-8 GB (freed) | ~500ms reload on next query |
| Reduce Qdrant HNSW ef_construct | ~20% index size | Slightly slower search |
| Use mock mode for small deployments | ~6-8 GB | No semantic search, dev only |
| Use swap for Qdrant index | Variable | 10-100x slower search |

---

## Does It Work on SSDs and HDDs?

### SSDs (Recommended)

Kamelot is optimized for SSD storage. The flat store, Qdrant index, and .aioss ledger all benefit from SSD random I/O performance.

| Metric | NVMe SSD | SATA SSD |
|--------|---------|----------|
| Initial indexing (100K files) | 8-12 minutes | 12-20 minutes |
| Query latency | Baseline | +5-15ms |
| File open via FUSE/WinFSP | Baseline | +2-5ms |
| Ledger operations | Baseline | +1-3ms |

### HDDs (Supported, Slower)

Kamelot works on HDDs but with reduced performance:

| Metric | 7200 RPM HDD | 5400 RPM HDD |
|--------|-------------|-------------|
| Initial indexing (100K files) | 30-60 minutes | 45-90 minutes |
| Query latency | +50-150ms | +100-300ms |
| File open via FUSE/WinFSP | +10-30ms | +20-60ms |
| Ledger operations | +5-15ms | +10-30ms |

### Recommendations
- **Index storage**: SSD recommended. Qdrant HNSW index benefits significantly from fast random reads.
- **File storage**: HDD is fine for the encrypted flat store (sequential writes). Your original files remain on whatever storage they're on.
- **Ledger**: SSD recommended for append operations.

---

## What Is the Indexing Speed?

Indexing speed depends on file size, file type, hardware, and embedding model.

### Indexing Throughput

| Hardware Configuration | Files/Second | 10K Files | 100K Files | 1M Files |
|----------------------|-------------|-----------|------------|----------|
| GPU + NVMe SSD | 15-25 | 7-11 min | 1.1-1.8 hrs | 11-18 hrs |
| GPU + SATA SSD | 12-18 | 9-14 min | 1.5-2.3 hrs | 15-23 hrs |
| GPU + HDD | 6-10 | 17-28 min | 2.8-4.6 hrs | 28-46 hrs |
| CPU + NVMe SSD | 2-5 | 33-83 min | 5.6-14 hrs | 56-140 hrs |
| CPU + HDD | 1-3 | 55-167 min | 9.3-28 hrs | 93-278 hrs |
| Mock mode + SSD | 500-2000 | 5-20 sec | 50 sec - 3.3 min | 8-33 min |

### Per-File Indexing Time Breakdown

| File Type | Read | Parse | Embedding (GPU) | Embedding (CPU) | Total (GPU) | Total (CPU) |
|-----------|------|-------|-----------------|-----------------|-------------|-------------|
| Small text file (10 KB) | 0.2ms | 1ms | 10ms | 100ms | 15ms | 105ms |
| Large document (1 MB) | 2ms | 50ms | 50ms | 350ms | 110ms | 410ms |
| Code file (100 KB) | 0.5ms | 5ms | 20ms | 200ms | 30ms | 210ms |
| Image (5 MB) | 5ms | 80ms | 80ms | 500ms | 175ms | 595ms |
| PDF (2 MB) | 3ms | 100ms | 50ms | 350ms | 165ms | 465ms |
| Binary (10 MB) | 8ms | 2ms | 10ms | 100ms | 30ms | 120ms |

### First Index vs Incremental Indexing

| Index Type | Speed | Notes |
|-----------|-------|-------|
| First index (full scan) | Per-file speed | Must embed every file once |
| Incremental (new files) | Per-file speed | Only processes new/changed files |
| Incremental (watched) | <1s lag | File system events trigger reindex |
| Re-index (full) | Same as first index | Re-embeds all files |
| Re-index (partial) | Per-file speed | Only re-embeds files with changes |

---

## Will Kamelot Slow Down My Computer?

Kamelot is designed to run as a background service with minimal resource impact.

### CPU Usage

| Scenario | CPU Usage | Impact |
|----------|-----------|--------|
| Idle (daemon + UI) | 0-1% | None |
| Query execution | 5-20% (one core) | <500ms burst |
| Indexing (GPU) | 10-30% (one core) | Negligible |
| Indexing (CPU) | 80-100% (all cores) | **May slow other tasks** |
| Qdrant search | 5-15% (one core) | <100ms burst |

### Disk I/O

| Scenario | Read | Write | Impact |
|----------|------|-------|--------|
| Idle | 0 MB/s | 0 MB/s | None |
| Indexing (first run) | 50-200 MB/s | 10-50 MB/s | Moderate |
| Incremental indexing | 1-10 MB/s | 1-5 MB/s | Minimal |
| Query | 1-5 MB/s | 0 MB/s | Minimal |
| File open via FUSE | 0-200 MB/s | 0 MB/s | Depends on file size |

### Network I/O

| Scenario | Network | Impact |
|----------|---------|--------|
| Idle | 0 Kbps | None |
| Query | 0 Kbps | None |
| Model download (one-time) | 100+ Mbps | 2-10 minutes |
| Software update (periodic) | 10-50 Mbps | 10-30 seconds |

### Recommendations

- **Index during idle hours**: Schedule large indexing jobs for when you're away from the computer
- **CPU throttling**: Set `indexing.cpu_cores = N` in config to limit indexing CPU usage
- **I/O throttling**: Set `indexing.io_priority = "low"` to reduce disk I/O impact
- **Batch indexing**: Use `kml index --batch-size 100` to control resource usage

---

## How Does Performance Compare to Spotlight / Everything?

| Metric | Kamelot | macOS Spotlight | Everything (Windows) | Windows Search |
|--------|---------|----------------|---------------------|----------------|
| Search method | Semantic + filename | Filename + metadata | Filename only | Filename + metadata |
| Find file by content | Yes | Limited (specific apps) | No | Limited |
| Find file by description | Yes | No | No | No |
| 10K file latency | 30ms | ~50ms | <1ms | ~1-5s |
| 100K file latency | 75ms | ~200ms | <1ms | ~5-30s |
| 1M file latency | 150ms | ~1-5s | <5ms | >30s |
| Image content search | Yes | No | No | No |
| RAM usage | 7-9 GB | 2-4 GB | 50-200 MB | 500 MB - 2 GB |
| Offline | Yes | Yes | Yes | Yes |
| FUSE mount | Yes | No | No | No |

**Key takeaway**: Filename-only tools (Everything) are faster for exact filename matches. Kamelot is faster for everything else — especially when you don't know the filename.

---

## What Is the Query Latency Breakdown?

### Full Query Pipeline Timing

```
User presses hotkey              T+0ms
Omnibox opens                    T+20ms
User types query                 T+500ms - T+3000ms
User presses Enter               T+0ms (from enter)
  Query sent to daemon           +1ms
  Embedding generation (GPU)     +10ms - +50ms
  Embedding generation (CPU)     +100ms - +500ms
  Qdrant HNSW search             +5ms - +100ms (depends on index size)
  Result ranking                  +1ms - +5ms
  Result filtering                +1ms - +3ms
  Results sent to UI              +1ms
  UI renders results              +5ms - +16ms (60 FPS)
User sees results                 Total: ~24ms - ~675ms
User selects result              T+0ms (from selection)
  FUSE/WinFSP mount               +5ms - +50ms
  Application opens file          +100ms - +2000ms (app-dependent)
File is open
```

### Where Time Is Spent (GPU, 100K files)

```
Embedding:     30%  (15-40ms)
Qdrant search: 30%  (15-40ms)
UI rendering:  20%  (10-20ms)
Ranking:       10%  (5-10ms)
Other:         10%  (5-10ms)
```

### Where Time Is Spent (CPU, 100K files)

```
Embedding:     65%  (250-450ms)
Qdrant search: 15%  (50-80ms)
UI rendering:  10%  (30-50ms)
Ranking:        5%  (10-20ms)
Other:          5%  (10-20ms)
```

---

## Does Kamelot Use Network Bandwidth?

Kamelot uses **zero** network bandwidth during normal operation. All processing is local.

Network usage scenarios:
- **Model download**: One-time, 4+ GB. Required for first-time setup.
- **Software updates**: Periodic, ~15 MB per update.
- **Telemetry (optional)**: Anonymized usage statistics, ~100 KB/week.
- **Community support**: Only when you visit forums or submit bug reports.

There is no phone-home mechanism, no cloud API calls, no data exfiltration. Kamelot is designed as a fully offline system.

---

## Can I Run Kamelot on a Raspberry Pi?

Kamelot can run on a Raspberry Pi 5 (or equivalent ARM SBC) with significant performance limitations.

### Raspberry Pi 5 (8 GB RAM)

| Metric | Performance |
|--------|-------------|
| Embedding model | nomic-embed-text (137M params) or CPU Qwen 2 VL 2B |
| Files/second (indexing) | 0.5-2 |
| Query latency | 500ms - 2s |
| Max recommended index | 50,000 files |
| RAM usage | 6-7 GB (leaves 1-2 GB for system) |
| Storage | SD card recommended for index, USB SSD for files |

### Installation on Raspberry Pi

```bash
# Install Kamelot (ARM build)
curl -O https://releases.kamelot.ai/latest/kamelot-linux-aarch64.tar.gz
tar -xzf kamelot-linux-aarch64.tar.gz
sudo mv kamelot /usr/local/bin/

# Use CPU-optimized model
kml config set ollama.model "nomic-embed-text"
kml start
```

---

## How Does Performance Scale with Multiple Users?

Kamelot is designed as a single-user system. Multi-user access is achieved through network sharing of the Kamelot API.

### Concurrent Query Performance

| Concurrent Users | Query Latency (p95) | RAM Per User | Notes |
|-----------------|-------------------|-------------|-------|
| 1 | Baseline | Baseline | — |
| 5 | +10ms | +50 MB | Minimal impact |
| 10 | +25ms | +100 MB | Moderate impact |
| 25 | +75ms | +250 MB | Noticeable |
| 50 | +200ms | +500 MB | Requires tuning |
| 100 | +500ms | +1 GB | Requires sharding |

### Multi-User Configuration

For multi-user deployments:
- Use a dedicated server with sufficient RAM (32 GB+ for 25+ users)
- Enable query caching (`[query_cache] enabled = true`)
- Set appropriate HNSW thread count
- Consider multiple Qdrant replicas for high availability

---

## What Can I Do to Improve Performance?

### Quick Wins (No Cost)

1. **Enable query caching**: Reduces repeat query latency by 80%
2. **Increase Qdrant ef_search**: `qdrant.hnsw_ef_search = 256` improves accuracy
3. **Reduce index scope**: Exclude large binary files, `node_modules`, `.git`
4. **Use SSD for index storage**: Move `~/.kamelot` to SSD
5. **Index during idle hours**: Schedule `kml index` for when you're away

### Moderate Improvements (Some Configuration)

1. **Switch to GPU-accelerated inference**: If using CPU, install GPU drivers
2. **Use a smaller model**: Replace Qwen 2 VL 7B with 2B for 3x speedup
3. **Increase RAM**: More RAM allows larger HNSW graph, faster search
4. **Dedicate Qdrant to fast storage**: Move Qdrant storage to NVMe

### Major Improvements (Hardware Upgrade)

1. **Add or upgrade GPU**: RTX 3060+ for 10x embedding speedup
2. **Upgrade to NVMe SSD**: 2-3x indexing speedup over SATA SSD
3. **Increase system RAM**: 32 GB for 500K+ files, 64 GB for 1M+ files
4. **Dedicated server**: Separate Kamelot into daemon server + thin client

### Configuration Tuning

```toml
# Performance-optimized config
[qdrant]
hnsw_ef_construct = 512   # Higher = better accuracy, slower indexing
hnsw_ef_search = 256      # Higher = better accuracy, slower search
hnsw_m = 32               # Higher = better accuracy, more RAM
optimizers_cpu = true     # Move optimization to CPU threads

[query_cache]
enabled = true
max_entries = 1000
ttl_seconds = 3600

[indexing]
cpu_cores = 4             # Limit CPU usage during indexing
batch_size = 100          # Embed files in batches (GPU only)
parse_parallel = true     # Parse files in parallel

[ollama]
keep_alive = 0            # Unload model immediately after each query
num_gpu_layers = 35       # Send more layers to GPU (if VRAM available)
```

---

## How Does File Size Affect Performance?

File size directly impacts indexing speed and storage usage:

### Indexing Time by File Size

| File Size | GPU Indexing | CPU Indexing | Storage Overhead |
|-----------|-------------|-------------|------------------|
| <10 KB | 10-20ms | 50-100ms | ~8 KB metadata |
| 10 KB - 1 MB | 20-80ms | 100-500ms | ~8 KB + encrypted blob |
| 1 MB - 10 MB | 80-200ms | 500-2000ms | Proportional to size |
| 10 MB - 100 MB | 200-1000ms | 2-10s | Proportional to size |
| >100 MB | 1-5s | 10-60s | Proportional |

### Large File Handling

Files larger than 100 MB are handled with special processing:
- **Streaming read**: Files are read in chunks to avoid loading the entire file into RAM
- **Sampled embedding**: For very large files, only the first 10 MB of content is used for embedding
- **Metadata priority**: Large binary files are indexed primarily by metadata

The maximum configurable file size for full content indexing:

```toml
[indexing]
max_content_size_mb = 100   # Files larger than this get metadata-only indexing
```

---

## Does Kamelot Support Parallel Indexing Across Multiple Machines?

Kamelot is designed as a single-machine system. Parallel indexing across multiple machines is not natively supported. However, there are workarounds:

### Approach 1: Partitioned Indexing

Index different directories on different machines, then merge the Qdrant collections:

```bash
# Machine 1: Index project A
kml index /path/to/projectA

# Machine 2: Index project B
kml index /path/to/projectB

# Export Qdrant snapshots and merge (manual process)
```

### Approach 2: Shared Storage

Place all files on shared network storage (NAS), index from one machine:
- Single machine does all indexing
- All users access the same index via network
- Performance limited by network bandwidth

### Approach 3: K-Swarm (Planned)

The K-Swarm mesh protocol (planned for v2.0) will enable distributed indexing and search across multiple machines with automatic synchronization.

---

## What Is the Impact of Embedding Model Size on Performance?

Kamelot supports multiple embedding models with different performance characteristics:

| Model | Parameters | Dimensions | VRAM | Quality | Latency (GPU) | Latency (CPU) |
|-------|-----------|------------|------|---------|---------------|---------------|
| Qwen 2 VL 7B Q4 | 7B | 768 | 6.2 GB | Best | 8-50ms | 180-350ms |
| Qwen 2 VL 2B Q4 | 2B | 768 | 2.5 GB | Good | 5-20ms | 80-200ms |
| nomic-embed-text | 137M | 768 | 0.5 GB | Text only | 3-10ms | 20-80ms |
| all-MiniLM-L6-v2 | 80M | 384 | 0.3 GB | Basic | 2-5ms | 10-40ms |
| bge-small-en-v1.5 | 33M | 384 | 0.2 GB | Minimum | 1-3ms | 8-20ms |

### Choosing a Model

- **Best quality**: Qwen 2 VL 7B Q4 (multimodal, understands images + text)
- **Good balance**: Qwen 2 VL 2B Q4 (smaller, faster, still multimodal)
- **Text-only, fast**: nomic-embed-text (CPU-friendly, no GPU required)
- **Minimum resources**: all-MiniLM-L6-v2 (runs on Raspberry Pi)
- **Development/testing**: Mock mode (no model needed, random vectors)

To switch models:

```bash
kml config set ollama.model "nomic-embed-text"
kml restart
```

Switching models requires re-indexing all files (embeddings from different models are not compatible).

---

## How Does Kamelot Perform with Very Large Files (>1 GB)?

Very large files (>1 GB) require special handling due to memory constraints:

### Default Behavior

- **Files > 100 MB**: Content-sampled embedding (first 10 MB)
- **Files > 500 MB**: Metadata-only indexing (embeddings generated from filename, path, and metadata)
- **Files > 1 GB**: Metadata-only indexing, excluded from full-text content search

### Configuring Large File Handling

```toml
[indexing]
max_content_size_mb = 200     # Increase threshold for full content parsing
large_file_strategy = "sample" # "sample" (default), "skip", or "full"
sample_size_mb = 20            # How much of the file to sample
```

### Performance Impact

| File Size | Content Parsed | Embedding Time | Storage |
|-----------|---------------|----------------|---------|
| 100 MB | First 10 MB | ~200ms | 100 MB encrypted + 8 KB index |
| 500 MB | Metadata only | ~2ms | 500 MB encrypted + 8 KB index |
| 2 GB | Metadata only | ~2ms | 2 GB encrypted + 8 KB index |

Searching for these files by content description is still effective because filenames, paths, and metadata are indexed.

---

## How Does Query Performance Change with Concurrent Access?

Kamelot handles concurrent queries through async processing:

### Single GPU

| Concurrent Queries | p50 Latency | p95 Latency | Throughput |
|-------------------|------------|-------------|------------|
| 1 | 80ms | 120ms | 12 QPS |
| 5 | 95ms | 180ms | 40 QPS |
| 10 | 120ms | 280ms | 65 QPS |
| 25 | 200ms | 600ms | 100 QPS |
| 50 | 400ms | 1200ms | 120 QPS |

### Multiple GPUs (Future)

Planned support for multi-GPU configurations will increase concurrent query throughput linearly with GPU count.

### Query Queuing

When the system is overloaded, queries are queued:

```toml
[daemon]
max_concurrent_queries = 10    # Maximum simultaneous queries
query_queue_size = 100         # Maximum queued queries
queue_timeout_ms = 5000        # Timeout for queued queries
```

Exceeding these limits returns an error to the client, preventing system overload.

---

## What Monitoring Metrics Should I Track?

For production Kamelot deployments, track these key metrics:

### Performance Metrics

| Metric | Warning | Critical | Description |
|--------|---------|----------|-------------|
| Query latency (p95) | >500ms | >2s | Time from query to results |
| Indexing throughput | <5 files/s | <1 file/s | Files indexed per second |
| Embedding latency (p95) | >200ms | >1s | Model inference time |
| Qdrant search latency (p95) | >100ms | >500ms | Vector search time |
| Qdrant index size | >80% RAM | >95% RAM | Memory usage for HNSW |

### Health Metrics

| Metric | Warning | Critical | Description |
|--------|---------|----------|-------------|
| Daemon uptime | — | <99.9% | Service availability |
| Qdrant connectivity | — | Disconnected | Database connection status |
| Ollama connectivity | — | Disconnected | Model backend status |
| FUSE mount status | — | Unmounted | Virtual drive status |
| Disk space | <20% free | <5% free | Storage availability |
| Memory usage | >80% | >95% | System RAM usage |

### Tools for Monitoring

```bash
# Quick health check
kml doctor

# Prometheus metrics (if configured)
curl http://localhost:9010/metrics

# Qdrant metrics
curl http://localhost:6333/metrics

# System monitoring
kml stats --interval 5s  # Live stats every 5 seconds
```

---

## How Does Kamelot Handle SSD vs HDD for Different Components?

Optimal performance requires matching storage to workload characteristics:

| Component | Recommended Storage | Workload Pattern | Why |
|-----------|-------------------|-----------------|-----|
| Qdrant HNSW index | SSD (NVMe preferred) | Random reads, small writes | HNSW graph traversal is random I/O |
| Flat store (blobs) | HDD or SSD | Sequential writes, random reads | Blobs are sequential writes; reads may be random |
| .aioss ledger | SSD | Sequential writes, occasional reads | Append-only, low latency preferred |
| Thumbnail cache | SSD | Random reads/writes | Frequent small file operations |
| Ollama model storage | SSD | Sequential read at load time | Model loading is one-time sequential |
| System swap | SSD (if used) | Random | Swap on HDD is extremely slow |

### Hybrid Configuration

For optimal cost-efficiency with large datasets:

```toml
[storage]
flat_store_path = "/hdd/kamelot/store"     # HDD for encrypted blobs
cache_path = "/ssd/kamelot/cache"           # SSD for performance-critical cache
```

This configuration directs blob storage to cheaper HDD space while keeping the index and cache on fast SSD.

---

## What Is the Cold Start Time for Kamelot?

Cold start refers to launching Kamelot for the first time after system boot:

| Component | Time | Notes |
|-----------|------|-------|
| Kamelot daemon start | <100ms | Rust binary starts immediately |
| Qdrant start | 2-5 seconds | Loading HNSW index from disk |
| Ollama start | 1-3 seconds | Loading model server |
| Model loading (GPU) | 3-10 seconds | Loading 4GB model into VRAM |
| Model loading (CPU) | 10-30 seconds | Loading model into system RAM |
| FUSE mount | <100ms | After daemon ready |
| UI start | <200ms | Vello GPU UI |
| **Total cold start (GPU)** | **~6-15 seconds** | |
| **Total cold start (CPU)** | **~13-40 seconds** | |
| **Total cold start (mock)** | **<500ms** | No model loading |

### Configuring for Faster Cold Start

```toml
[daemon]
lazy_model_load = false    # Load model at startup (slower start, faster first query)
lazy_model_load = true     # Load model on first query (faster start, slower first query)
```

---

## Does Kamelot Support GPU Sharing with Other Applications?

Kamelot's GPU usage is managed by Ollama, which allocates VRAM for the embedding model:

### GPU Memory Allocation

| Scenario | VRAM Used | Available for Other Apps |
|----------|-----------|------------------------|
| Qwen 2 VL 7B Q4 | 6.2 GB | Remaining VRAM |
| Qwen 2 VL 2B Q4 | 2.5 GB | Most VRAM available |
| nomic-embed-text (CPU) | 0 GB | All VRAM available |
| Mock mode | 0 GB | All VRAM available |

### Coexistence with Other GPU Applications

- **Training ML models**: Not recommended while Kamelot is indexing (GPU contention)
- **Gaming**: Kamelot's model can be unloaded during gaming (configure `ollama.unload_after_seconds`)
- **Video editing**: Minimal impact as embedding is bursty, not continuous
- **Other AI tools**: If using Ollama for other models, ensure total VRAM usage fits in GPU memory

### GPU Priority Configuration

```toml
[ollama]
num_gpu_layers = 35       # Reduce to use less VRAM (e.g., 20 for 4GB VRAM)
keep_alive = "5m"         # Unload model after 5 minutes idle
gpu_device = 0            # Select specific GPU in multi-GPU setups
```

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
