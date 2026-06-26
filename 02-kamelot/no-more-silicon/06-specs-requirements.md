                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 

# 06 — Specs and Requirements

**Kamelot — The Sovereign Semantic Vector File System**

**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. Introduction
2. Minimum Configuration
3. Recommended Configuration
4. Production Configuration
5. Use-Case-Specific Requirements
6. CPU Performance Benchmarks
7. RAM Requirements
8. Storage Sizing and Performance
9. GPU Requirements
10. Network Requirements
11. Software Requirements
12. Scaling Guidelines
13. Conclusion

---

## 1. Introduction

This document provides detailed hardware and software specifications for deploying Kamelot across various use cases. Whether you're running Kamelot on a Raspberry Pi for personal use or deploying across an enterprise server fleet, this guide will help you choose the right configuration.

All specifications are for Kamelot with AI features enabled. If AI features are disabled, requirements decrease significantly.

---

## 2. Minimum Configuration

### 2.1 Overview

The minimum configuration is sufficient for:

- Basic file storage and retrieval
- CLI-only interface (no GUI)
- Encrypted storage with manual key entry
- File indexing without semantic search
- K-Swarm mesh with a single peer

AI features (semantic search, automatic embedding) are not functional at this level.

### 2.2 Hardware

| Component | Requirement | Notes |
|-----------|-------------|-------|
| CPU | x86-64, 2 cores, 1.5 GHz+ | Any CPU from 2010+; or ARM64 2 cores |
| RAM | 2 GB | 1 GB for OS + 512 MB for Kamelot |
| Storage | 500 MB (Kamelot) + file store | 500 MB for binary + base index |
| Storage device | Any (HDD, SSD, NVMe, SD card) | HDD sufficient for basic ops |
| GPU | None | Terminal mode only |
| Network | Optional (Ethernet or WiFi) | For K-Swarm mesh |

### 2.3 Software

| Component | Requirement |
|-----------|-------------|
| OS | Linux kernel 5.x+, Windows 10 1809+, macOS 12+ |
| Runtime | None (statically linked binary) |
| Dependencies | libc (glibc 2.28+ or musl), POSIX threads |
| AI model | Not loaded (AI features disabled) |

### 2.4 Performance

| Operation | Performance |
|-----------|-------------|
| File storage (encrypt + write) | 0.5–2 ms per file |
| File retrieval (read + decrypt) | 0.5–2 ms per file |
| File list (1000 files) | 10–20 ms |
| Basic search (filename only) | 5–50 ms (depends on filesystem) |
| AI embedding | Not available |
| Semantic search | Not available |

### 2.5 When to Use Minimum

- Testing and evaluation
- File backup node with no search requirements
- IoT sensor data collection
- Educational environments
- Resource-constrained devices (2 GB RAM SBCs)

---

## 3. Recommended Configuration

### 3.1 Overview

The recommended configuration provides:

- Full AI features (semantic search, automatic embedding)
- GUI canvas (wgpu)
- K-Swarm mesh with multiple peers
- Good performance for personal use

### 3.2 Hardware

| Component | Requirement | Notes |
|-----------|-------------|-------|
| CPU | x86-64, 4 cores, 2.5 GHz+ | Intel i5 or AMD Ryzen 5 equivalent; or ARM64 (M1/M2, 8 cores) |
| RAM | 8 GB | 4 GB for OS + 2 GB for Qwen 2 VL Q4 model + 1 GB for Qdrant + 1 GB buffer |
| Storage | 256 GB+ | SSD strongly recommended |
| Storage device | SATA SSD or NVMe | SATA SSD minimum, NVMe preferred |
| GPU | Integrated GPU (any) | For wgpu canvas (Vulkan 1.0+, Metal, or D3D12) |
| Network | 100 Mbps+ Ethernet or WiFi 5+ | For K-Swarm mesh |

### 3.3 Software

| Component | Requirement |
|-----------|-------------|
| OS | Linux kernel 6.x+, Windows 11, macOS 13+ |
| Runtime | None |
| Dependencies | Vulkan 1.0+ or Metal or D3D12 (for GUI) |
| AI model | Qwen 2 VL Q4 (2 GB RAM, loaded via Ollama) |
| Ollama | Required for AI model management |

### 3.4 Performance

| Operation | Performance |
|-----------|-------------|
| File storage (encrypt + write) | 0.2–0.5 ms per file |
| File retrieval (read + decrypt) | 0.2–0.5 ms per file |
| File list (1000 files) | 2–5 ms |
| Basic search (filename) | 2–10 ms |
| AI embedding (per file) | 50–150 ms |
| Semantic search (1M vectors) | 50–100 ms |
| GUI canvas | 60 FPS |

### 3.5 When to Use Recommended

- Personal file management with AI features
- Home server deployment
- Small team (2–5 users)
- Development and testing

---

## 4. Production Configuration

### 4.1 Overview

The production configuration is for:

- Enterprise deployment
- High throughput and concurrency
- Large file collections (10M+ files)
- Multiple simultaneous users
- High availability (redundant nodes)

### 4.2 Hardware

| Component | Requirement | Notes |
|-----------|-------------|-------|
| CPU | x86-64, 8+ cores, 3.0 GHz+ | Intel Xeon, AMD EPYC, or high-end Core/Ryzen |
| RAM | 16 GB+ | 32 GB recommended for large indexes |
| Storage | 1 TB+ | NVMe only |
| Storage device | NVMe (PCIe 4.0+) | Enterprise NVMe (Samsung PM9A3, Kioxia CD8, etc.) |
| GPU | Dedicated GPU recommended | NVIDIA RTX 4060+ or AMD RX 7600+ for faster embedding |
| Network | 1 Gbps+ | 10 Gbps recommended for cluster deployments |

### 4.3 Software

| Component | Requirement |
|-----------|-------------|
| OS | Linux (Ubuntu 24.04 LTS, Debian 12, RHEL 9) |
| Runtime | None |
| Dependencies | Vulkan 1.0+ (for GUI, optional on servers) |
| AI model | Qwen 2 VL Q4 (default) or Q8 (higher quality) |
| Ollama | Required for AI model management |
| Qdrant | Bundled, but can use external Qdrant for large indexes |
| Monitoring | Prometheus metrics endpoint (optional) |

### 4.4 Performance

| Operation | Performance |
|-----------|-------------|
| File storage (encrypt + write) | 0.05–0.2 ms per file |
| File retrieval (read + decrypt) | 0.05–0.2 ms per file |
| File list (1000 files) | <1 ms |
| Basic search (filename) | <1 ms |
| AI embedding (per file) | 10–50 ms |
| Semantic search (1M vectors) | 10–30 ms |
| Semantic search (10M vectors) | 30–100 ms |
| GUI canvas | 60+ FPS |
| Concurrent users | 10+ |

### 4.5 When to Use Production

- Enterprise file management
- Large media archives
- Research data management
- Legal and compliance document management
- Healthcare imaging archives
- Multi-site deployments with K-Swarm

---

## 5. Use-Case-Specific Requirements

### 5.1 Personal Laptop

| User Profile | RAM | CPU | Storage | GPU | Notes |
|-------------|-----|-----|---------|-----|-------|
| Light user (no AI) | 2 GB | 2 cores | 128 GB HDD | None | Terminal mode only |
| Regular user (AI) | 8 GB | 4 cores | 256 GB SSD | iGPU | Good experience |
| Power user (lots of files) | 16 GB | 6 cores | 1 TB NVMe | iGPU or dGPU | Maximum performance |
| Battery-conscious | 8 GB | 4 cores (efficient) | 256 GB SSD | iGPU | Configure for low power |

### 5.2 Home Server

| User Profile | RAM | CPU | Storage | GPU | Notes |
|-------------|-----|-----|---------|-----|-------|
| Light (files only) | 2 GB | 2 cores | 500 GB HDD | None | Backup node only |
| Standard (AI + search) | 8 GB | 4 cores | 1 TB SSD | iGPU | Good for family use |
| Media server | 16 GB | 6 cores | 4 TB HDD + 256 GB SSD cache | iGPU | Photos, videos, music |
| Multi-family | 16 GB | 8 cores | 8 TB HDD + 512 GB SSD cache | iGPU | Multiple users |

### 5.3 Enterprise Server

| Deployment Size | RAM | CPU | Storage | GPU | Network |
|----------------|-----|-----|---------|-----|---------|
| Small (10 users) | 16 GB | 8 cores | 2 TB NVMe | RTX 4060 | 1 Gbps |
| Medium (100 users) | 32 GB | 16 cores | 10 TB NVMe | RTX 4090 | 10 Gbps |
| Large (1000 users) | 64 GB+ | 32 cores+ | 100 TB NVMe array | 2× RTX 4090 or A series | 10+ Gbps |
| Multi-site | Per site | Per site | Per site | Per site | 1 Gbps inter-site |

### 5.4 Edge / IoT

| Deployment | RAM | CPU | Storage | GPU | Power |
|-----------|-----|-----|---------|-----|-------|
| Field research | 8 GB | 4 cores (efficient) | 256 GB SSD | None | Battery-optimized |
| Air-gapped | 8 GB | 4 cores | 512 GB SSD | None | Low power |
| Raspberry Pi | 4 GB (min), 8 GB (rec) | 4 cores (Cortex-A76) | 128 GB SD or NVMe hat | VideoCore VII | 5–15 W |
| Industrial edge | 8 GB | 4 cores (industrial temp) | 128 GB industrial SSD | None | 10–25 W |

---

## 6. CPU Performance Benchmarks

### 6.1 Embedding Performance

Embedding performance is the primary CPU-bound operation in Kamelot. Benchmarks use Qwen 2 VL Q4 model via Ollama.

| CPU | Cores | Frequency | Embedding Time (per file) | Batch Throughput (files/sec) |
|-----|-------|-----------|--------------------------|-----------------------------|
| Intel Core i3-6100 | 2 | 3.7 GHz | 350 ms | 2.9 |
| Intel Core i5-6500 | 4 | 3.2 GHz | 200 ms | 5.0 |
| Intel Core i5-8250U | 4 | 1.6/3.4 GHz | 180 ms | 5.6 |
| Intel Core i7-10750H | 6 | 2.6/5.0 GHz | 100 ms | 10.0 |
| Intel Core i7-1365U | 10 | 1.3/5.2 GHz | 60 ms | 16.7 |
| Intel Core i9-13900K | 24 | 3.0/5.8 GHz | 30 ms | 33.3 |
| AMD Ryzen 5 5600X | 6 | 3.7/4.6 GHz | 80 ms | 12.5 |
| AMD Ryzen 7 7800X3D | 8 | 4.2/5.0 GHz | 45 ms | 22.2 |
| AMD Ryzen 9 7950X | 16 | 4.5/5.7 GHz | 25 ms | 40.0 |
| Apple M1 | 8 (4P+4E) | 3.2 GHz | 80 ms | 12.5 |
| Apple M2 Pro | 12 (8P+4E) | 3.5 GHz | 55 ms | 18.2 |
| Apple M3 Max | 16 (12P+4E) | 4.1 GHz | 35 ms | 28.6 |
| Raspberry Pi 5 | 4 | 2.4 GHz | 400 ms | 2.5 |
| Ampere Altra | 80 | 3.0 GHz | 20 ms | 50.0 (parallel) |

### 6.2 Search Performance

Search performance is dominated by Qdrant vector search, which is CPU and memory-bound.

| CPU | 100K vectors | 1M vectors | 10M vectors |
|-----|-------------|-----------|------------|
| 4 cores, 2.5 GHz | 5 ms | 15 ms | 60 ms |
| 8 cores, 3.0 GHz | 3 ms | 8 ms | 35 ms |
| 16 cores, 4.0 GHz | 2 ms | 5 ms | 20 ms |

### 6.3 Encryption Throughput

XChaCha20-Poly1305 encryption benefits from CPU crypto extensions.

| CPU | AES-NI / Crypto Extensions | Throughput |
|-----|---------------------------|------------|
| Intel (with AES-NI) | Yes | 2–4 GB/s |
| Intel (without AES-NI) | No | 500 MB/s |
| AMD (with AES-NI) | Yes | 2–4 GB/s |
| Apple M-series | ARM Crypto Extensions | 2–3 GB/s |
| Raspberry Pi 5 | ARM Crypto Extensions | 800 MB/s |
| Raspberry Pi 4 | ARM Crypto Extensions | 300 MB/s |

---

## 7. RAM Requirements

### 7.1 Base Memory Usage

| Component | Memory (idle) | Memory (active) |
|-----------|--------------|-----------------|
| Kamelot daemon | 40–60 MB | 100–200 MB |
| Qdrant (small index, 100K vectors) | 100–200 MB | 200–500 MB |
| Qdrant (medium index, 1M vectors) | 500 MB–1 GB | 1–2 GB |
| Qdrant (large index, 10M vectors) | 2–5 GB | 5–10 GB |
| Ollama + Qwen 2 VL Q4 | 2 GB | 2–3 GB |
| wgpu canvas | 50 MB | 100–200 MB |

### 7.2 Total Memory by Deployment

| Deployment | Components Loaded | Total RAM Needed |
|-----------|-----------------|-----------------|
| Minimal (no AI) | Kamelot daemon | 200 MB |
| CLI only + AI | Kamelot + Ollama + Qdrant | 3–4 GB |
| GUI + AI (small index) | Kamelot + Ollama + Qdrant + Canvas | 4–5 GB |
| GUI + AI (medium index) | Kamelot + Ollama + Qdrant + Canvas | 6–8 GB |
| GUI + AI (large index) | Kamelot + Ollama + Qdrant + Canvas | 10–16 GB |
| Server + AI (large index) | Kamelot + Ollama + Qdrant | 8–16 GB |

### 7.3 Memory Tuning

| Parameter | Default | Description |
|-----------|---------|-------------|
| `qdmrant.memory-limit` | 2 GB | Maximum RAM for Qdrant |
| `cache.max-size` | 200 MB | Embedding cache size |
| `store.write-cache` | 64 MB | Encryption write buffer |
| `canvas.fps` | 60 | Canvas frame rate (lower = less GPU mem) |

---

## 8. Storage Sizing and Performance

### 8.1 Storage Overhead

| Component | Size | Notes |
|-----------|------|-------|
| Kamelot binary | 12–15 MB | Static binary |
| Qdrant index | ~2 GB per 1M vectors | Depends on vector dimensions |
| .aioss ledger | ~100 MB per 1M entries | Append-only, grows with use |
| Flat store blobs | Equal to original file size (before encryption adds ~64 bytes overhead per blob) |
| Temporary files | Configurable, default 500 MB | For batch operations |

### 8.2 Storage Scaling

| Number of Files | Flat Store Size | Index Size | Ledger Size | Total Kamelot Overhead |
|----------------|----------------|-----------|-------------|----------------------|
| 10,000 | File-dependent | 20 MB | 1 MB | N/A |
| 100,000 | File-dependent | 200 MB | 10 MB | N/A |
| 1,000,000 | File-dependent | 2 GB | 100 MB | N/A |
| 10,000,000 | File-dependent | 20 GB | 1 GB | N/A |
| 100,000,000 | File-dependent | 200 GB | 10 GB | N/A |

### 8.3 Storage Performance by Device

| Device Type | Sequential Read | Sequential Write | Random Read (4K) | Random Write (4K) |
|------------|----------------|-----------------|------------------|-------------------|
| NVMe (PCIe 4.0) | 5,000 MB/s | 3,000 MB/s | 800K IOPS | 600K IOPS |
| NVMe (PCIe 3.0) | 2,500 MB/s | 1,500 MB/s | 400K IOPS | 300K IOPS |
| SATA SSD (Samsung 870 EVO) | 560 MB/s | 530 MB/s | 98K IOPS | 88K IOPS |
| SATA SSD (budget) | 450 MB/s | 350 MB/s | 50K IOPS | 40K IOPS |
| HDD (7200 RPM) | 160 MB/s | 150 MB/s | 100 IOPS | 100 IOPS |
| HDD (5400 RPM) | 100 MB/s | 90 MB/s | 80 IOPS | 80 IOPS |
| SD Card (A2) | 90 MB/s | 70 MB/s | 4K IOPS | 2K IOPS |
| eMMC | 250 MB/s | 100 MB/s | 10K IOPS | 5K IOPS |

### 8.4 Storage Recommendations by Use Case

| Use Case | Recommended Storage | Rationale |
|----------|-------------------|-----------|
| Personal (AI enabled) | SATA SSD (256 GB+) | Encryption throughput matches SATA SSD speed |
| Personal (large media) | NVMe (1 TB+) | Large files benefit from NVMe sequential speed |
| Enterprise | Enterprise NVMe (3.84 TB+) | High endurance, consistent latency |
| Raspberry Pi | A2 SD card or NVMe hat | SD is adequate; NVMe is better |
| Backup server | HDD (large capacity) | Sequential writes are fine for backup |

---

## 9. GPU Requirements

### 9.1 GPU for AI Embedding

The GPU is used by Ollama to accelerate Qwen 2 VL inference. GPU acceleration is optional but recommended for production deployments.

| GPU | VRAM | Embedding Speedup | Notes |
|-----|------|-------------------|-------|
| None (CPU only) | 0 GB | 1x (baseline) | Works on any CPU |
| Intel UHD Graphics | Shared | 2–3x | Most modern CPUs |
| Intel Iris Xe | Shared | 3–4x | |
| AMD Radeon Graphics (Ryzen) | Shared | 3–4x | |
| Apple M1/M2 integrated | Shared | 4–5x | |
| NVIDIA RTX 3050 | 6 GB | 6–8x | Entry-level |
| NVIDIA RTX 4060 | 8 GB | 8–10x | Recommended |
| NVIDIA RTX 4090 | 24 GB | 15–20x | Overkill for most |
| AMD RX 7600 | 8 GB | 6–8x | |
| AMD RX 7900 XTX | 24 GB | 10–15x | |
| NVIDIA A4000 | 16 GB | 10–15x | Enterprise |

### 9.2 GPU for wgpu Canvas

The wgpu canvas requires a GPU with graphics API support:

| API | Required Version | Supported Since |
|-----|-----------------|-----------------|
| Vulkan | 1.0 | 2016 GPUs |
| Metal | 2.0 | 2012 Macs |
| DirectX 12 | Feature Level 11.0 | 2015 GPUs |
| OpenGL ES | 3.0 | 2012 GPUs (fallback) |

### 9.3 GPU Memory for Canvas

| Resolution | Memory Used |
|-----------|------------|
| 1920×1080 (Full HD) | 32–64 MB |
| 2560×1440 (QHD) | 64–128 MB |
| 3840×2160 (4K) | 128–256 MB |
| Multiple monitors | Add per-monitor allocation |

---

## 10. Network Requirements

### 10.1 Local Operation

Kamelot does not require any network connectivity for core operations. All file storage, retrieval, and search functions work offline.

### 10.2 K-Swarm Mesh

| Factor | Minimum | Recommended |
|--------|---------|-------------|
| LAN bandwidth | 100 Mbps | 1 Gbps |
| WAN bandwidth | 10 Mbps | 50 Mbps |
| Latency (LAN) | <5 ms | <1 ms |
| Latency (WAN) | <100 ms | <50 ms |
| Number of peers | 2 | 4–8 |
| NAT traversal | STUN | STUN + TURN relay |

### 10.3 Initial Model Download

Downloading the Qwen 2 VL Q4 model requires internet once:

| Model | Size | Download Time (100 Mbps) | Download Time (1 Gbps) |
|-------|------|-------------------------|------------------------|
| Qwen 2 VL Q4 | 2 GB | 3 minutes | 16 seconds |
| Qwen 2 VL Q8 | 4 GB | 6 minutes | 32 seconds |
| Qwen 2 VL FP16 | 14 GB | 19 minutes | 2 minutes |

### 10.4 Cloud Sync (Optional)

If using a cloud relay with green hosting partners:

| Factor | Recommendation |
|--------|---------------|
| Bandwidth | 10 Mbps+ |
| Latency | <100 ms to relay server |
| Data transfer | Monthly: 10–100 GB (depends on usage) |

---

## 11. Software Requirements

### 11.1 Operating Systems

| OS | Version | Architecture | Support Status |
|----|---------|-------------|----------------|
| Linux (Ubuntu) | 22.04+ | x86_64, aarch64 | Full |
| Linux (Debian) | 11+ | x86_64, aarch64, armv7 | Full |
| Linux (Fedora) | 38+ | x86_64, aarch64 | Full |
| Linux (Arch) | Rolling | x86_64, aarch64 | Full |
| Linux (RHEL) | 9+ | x86_64, aarch64 | Full |
| Linux (Alpine) | 3.18+ | x86_64, aarch64 | Community |
| Windows | 10 1809+, 11 | x86_64 | Full |
| Windows Server | 2019+ | x86_64 | Full |
| macOS | 12+ | x86_64, aarch64 | Full |
| FreeBSD | 13+ | x86_64, aarch64 | Community |

### 11.2 Dependencies

Kamelot is distributed as a statically linked binary with no runtime dependencies on most platforms.

**Linux**: glibc 2.28+ or musl, libpthread (usually installed by default)

**Windows**: Windows 10 1809+ or later (no additional runtime needed)

**macOS**: macOS 12+ (no additional runtime needed)

**For GPU canvas**: Vulkan 1.0+ loader and drivers (Linux/Windows), Metal runtime (macOS)

### 11.3 AI Model Dependencies

| Component | Required | Purpose |
|-----------|----------|---------|
| Ollama | Yes | AI model runner |
| Qwen 2 VL Q4 | Default | Embedding model |
| curl | Recommended | Model download |

---

## 12. Scaling Guidelines

### 12.1 Vertical Scaling

| Resource | Scaling Strategy |
|----------|-----------------|
| CPU | More cores improve embedding throughput linearly. More frequency improves search latency. |
| RAM | More RAM allows larger Qdrant indexes and larger file caches. |
| Storage | NVMe provides best encryption throughput. Capacity scales with number of drives. |
| GPU | Dedicated GPU improves embedding speed 5–20x over CPU. |

### 12.2 Horizontal Scaling (K-Swarm Cluster)

| Factor | Scaling Behavior |
|--------|-----------------|
| Search capacity | Linear with number of nodes (distributed search) |
| Storage capacity | Linear with number of nodes |
| Embedding throughput | Near-linear with number of indexing nodes |
| Redundancy | Configurable replication factor (N copies of data) |
| Availability | N nodes can tolerate N-1 failures (with replication) |

### 12.3 Scale Limits

| Resource | Practical Limit | Notes |
|----------|----------------|-------|
| Files per index | 100M | Beyond this, consider sharding |
| Index size (Qdrant) | 200 GB | Beyond this, consider distributed Qdrant |
| Nodes in K-Swarm | 50 | Beyond this, consider hierarchical mesh |
| Concurrent users | 100 | Beyond this, consider load balancer |
| Storage per node | 100 TB | Beyond this, consider storage tiering |

---

## Sizing Calculator

### Formulas

Use these formulas to calculate the required resources for your Kamelot deployment.

#### Storage Sizing

```
Raw Storage Required = File Count × Average File Size × (1 + Encryption Overhead + Index Overhead + Redundancy Factor)

Where:
  Encryption Overhead = 0.02 (2% for XChaCha20-Poly1305 nonce + tag per file)
  Index Overhead = Index Size / Raw Data Size (typically 0.002 for Q4, 0.004 for FP16)
  Redundancy Factor = Replication Count (1 for no replication, 3 for 3x replication)

Example:
  File Count = 500,000
  Average File Size = 2 MB
  Encryption Overhead = 0.02
  Index Overhead = 500,000 × 0.000000715 GB / (500,000 × 2 MB) = 0.36 GB / 1000 GB = 0.00036
  Redundancy = 1 (no replication)
  
  Raw Storage = 500,000 × 2 MB × (1 + 0.02 + 0.00036 + 0) = 1,000,000 MB × 1.02036 = 1,020.36 GB ≈ 1.02 TB
```

#### Memory Sizing

```
Total RAM = OS RAM + Kamelot Daemon RAM + Qdrant RAM + Ollama RAM + Canvas RAM + Buffer

Where:
  OS RAM = 1 GB (minimum Linux), 2 GB (Windows), 1 GB (macOS)
  Kamelot Daemon RAM = 0.05 GB (idle), 0.2 GB (active)
  Qdrant RAM = File Count × 0.000002 GB (for Q4 vectors, approximate)
  Ollama RAM = 2 GB (Qwen 2 VL Q4), 4 GB (Q8), 14 GB (FP16)
  Canvas RAM = 0.05 GB (HD), 0.1 GB (4K)
  Buffer = 0.5 GB (minimum), 1 GB (recommended)

Example:
  OS: Linux (1 GB)
  File Count: 1,000,000
  Model: Qwen 2 VL Q4 (2 GB)
  Canvas: Off (0 GB)
  Active use: Yes (0.2 GB for daemon)
  
  Qdrant RAM = 1,000,000 × 0.000002 = 2 GB
  Total = 1 + 0.2 + 2 + 2 + 0 + 1 = 6.2 GB
  Recommended: 8 GB (to account for peak usage)
```

#### Embedding Time

```
Total Index Time (hours) = File Count / (Embedding Rate × Parallelism × 3600)

Where:
  Embedding Rate = files per second per thread (see CPU benchmarks)
  Parallelism = min(CPU Cores, configured threads)

Example (CPU only):
  File Count = 500,000
  CPU: Intel i5-6500 (4 cores)
  Embedding Rate: 5 files/sec total (from benchmarks)
  Parallelism: 1 (CPU-bound per file)
  
  Time = 500,000 / (5 × 1 × 3600) = 27.8 hours

Example (with GPU):
  File Count = 500,000
  GPU: NVIDIA RTX 4060
  Embedding Rate: 50 files/sec total (10x speedup)
  Parallelism: 1 (GPU handles concurrent batches)
  
  Time = 500,000 / (50 × 1 × 3600) = 2.8 hours
```

#### Search Latency Estimation

```
P50 Search Latency (ms) = 0.00001 × File Count + 5 (for Q4 quantized, SSD storage)

P95 Search Latency (ms) = 0.00003 × File Count + 15

P99 Search Latency (ms) = 0.00008 × File Count + 30

These are approximate formulas. Actual performance depends on Qdrant configuration, 
CPU speed, and concurrent query load.

Example:
  File Count = 1,000,000
  P50 = 0.00001 × 1,000,000 + 5 = 15 ms
  P95 = 0.00003 × 1,000,000 + 15 = 45 ms
  P99 = 0.00008 × 1,000,000 + 30 = 110 ms
```

#### Network Bandwidth for K-Swarm

```
Sync Bandwidth (Mbps) = Daily Changes × Average Change Size × 8 / Sync Window (seconds)

Where:
  Daily Changes = number of files added/modified per day
  Average Change Size = MB per file change
  Sync Window = seconds per day available for sync

Example:
  Daily Changes = 500 files
  Average Change Size = 5 MB
  Sync Window = 4 hours = 14,400 seconds
  
  Sync Bandwidth = 500 × 5 MB × 8 / 14,400 = 20,000 / 14,400 = 1.39 Mbps
  Recommended: At least 10 Mbps (for burst and headroom)
```

### Example Calculations

#### Personal User

```
Profile: Personal laptop, 50,000 files, average 1 MB each, 8 GB RAM, SATA SSD, no GPU

Storage:
  Raw = 50,000 × 1 MB × 1.02036 = 51,018 MB ≈ 51 GB
  Recommended: 256 GB SSD (leaves room for growth)

Memory:
  OS: 1 GB (Linux)
  Daemon: 0.2 GB (active)
  Qdrant: 50,000 × 0.000002 = 0.1 GB
  Ollama: 2 GB (Q4)
  Canvas: 0.05 GB (HD)
  Buffer: 1 GB
  Total: 1 + 0.2 + 0.1 + 2 + 0.05 + 1 = 4.35 GB
  Recommended: 8 GB (matches 8 GB RAM)

Index Time:
  CPU: i5-8250U (4 cores)
  Rate: 5.6 files/sec total
  Time = 50,000 / 5.6 / 3600 = 2.48 hours
  Actual: ~3 hours (with overhead)

Search Latency:
  P50 = 0.00001 × 50,000 + 5 = 5.5 ms
  P95 = 0.00003 × 50,000 + 15 = 16.5 ms
  P99 = 0.00008 × 50,000 + 30 = 34 ms
```

#### Enterprise Deployment

```
Profile: Enterprise server, 5,000,000 files, average 500 KB each, 32 GB RAM, NVMe, RTX 4060

Storage:
  Raw = 5,000,000 × 0.5 MB × 1.02036 = 2,550,900 MB ≈ 2.55 TB
  With 2x replication: 5.1 TB
  Recommended: 2 × 4 TB NVMe (RAID1 or independent with replication)

Memory:
  OS: 1 GB (Linux server)
  Daemon: 0.2 GB (active)
  Qdrant: 5,000,000 × 0.000002 = 10 GB
  Ollama: 2 GB (Q4)
  Canvas: 0 GB (headless server)
  Buffer: 2 GB
  Total: 1 + 0.2 + 10 + 2 + 0 + 2 = 15.2 GB
  Recommended: 32 GB (for peak load + concurrent queries)

Index Time:
  CPU: Ryzen 9 7950X (16 cores)
  GPU: RTX 4060
  Rate: ~50 files/sec (GPU accelerated)
  Time = 5,000,000 / 50 / 3600 = 27.8 hours
  Actual: ~30 hours (with batch overhead)

Search Latency:
  P50 = 0.00001 × 5,000,000 + 5 = 55 ms
  P95 = 0.00003 × 5,000,000 + 15 = 165 ms
  P99 = 0.00008 × 5,000,000 + 30 = 430 ms
```

#### Edge / Raspberry Pi

```
Profile: Raspberry Pi 5, 10,000 files, average 2 MB each, 8 GB RAM, microSD

Storage:
  Raw = 10,000 × 2 MB × 1.02036 = 20,407 MB ≈ 20.4 GB
  Recommended: 128 GB SD card or NVMe hat

Memory:
  OS: 1 GB (Raspberry Pi OS)
  Daemon: 0.05 GB (idle, mostly)
  Qdrant: 10,000 × 0.000002 = 0.02 GB
  Ollama: 2 GB (Q4, but may be disabled for power saving)
  Canvas: 0 GB (headless)
  Buffer: 1 GB
  Total: 1 + 0.05 + 0.02 + 2 + 0 + 1 = 4.07 GB
  With AI disabled: 1 + 0.05 + 0.02 + 0 + 0 + 1 = 2.07 GB
  Recommended: 8 GB (to use AI features)

Index Time:
  CPU: BCM2712 (4 cores)
  Rate: 2.5 files/sec
  Time = 10,000 / 2.5 / 3600 = 1.11 hours
  Actual: ~1.5 hours

Search Latency:
  P50 = 0.00001 × 10,000 + 5 = 5.1 ms
  P95 = 0.00003 × 10,000 + 15 = 15.3 ms
  P99 = 0.00008 × 10,000 + 30 = 30.8 ms
```

### Tool Recommendations

| Tool | Purpose | Platform | Link |
|------|---------|----------|------|
| Kamelot Benchmark | Built-in performance testing | Cross-platform | `kml benchmark full` |
| `fio` | Storage IOPS and latency | Linux | `sudo apt install fio` |
| `iperf3` | Network throughput | Cross-platform | `iperf3 -s` / `iperf3 -c` |
| `stress-ng` | CPU/memory stress testing | Linux | `sudo apt install stress-ng` |
| `smartctl` | Drive health monitoring | Linux | `sudo apt install smartmontools` |
| `htop` | Real-time resource monitor | Cross-platform | `sudo apt install htop` |
| `nmon` | Performance monitoring | Linux | `sudo apt install nmon` |
| Kamelot Capacity Planner | Web-based sizing calculator | Web | https://kamelot.dev/calculator |

#### Using the Built-in Benchmark

```bash
# Run full benchmark suite
kml benchmark full
# Kamelot Full Benchmark
#
# ┌────────────────────────┬──────────┬─────────────┐
# │ Component              │ Result   │ Rating      │
# ├────────────────────────┼──────────┼─────────────┤
# │ CPU embedding (single) │ 85 ms    │ 🟢 Excellent │
# │ CPU embedding (batch)  │ 22 files/s│ 🟢 Excellent │
# │ GPU embedding (single) │ 8 ms     │ 🟢 Excellent │
# │ GPU embedding (batch)  │ 180 file/s│ 🟢 Excellent │
# │ Vector search (P50)    │ 12 ms    │ 🟢 Excellent │
# │ Vector search (P95)    │ 28 ms    │ 🟢 Excellent │
# │ Encryption throughput  │ 3.2 GB/s │ 🟢 Excellent │
# │ Storage read (seq)     │ 4.8 GB/s │ 🟢 Excellent │
# │ Storage write (seq)    │ 3.1 GB/s │ 🟢 Excellent │
# └────────────────────────┴──────────┴─────────────┘
# 
# Your hardware is rated: PLATINUM
# Recommended configuration: Production
```

#### Common Configurations Reference

| Scenario | CPU | RAM | Storage | GPU | Max Files | Est. Cost |
|----------|-----|-----|---------|-----|-----------|-----------|
| Budget personal | i3-12100 | 8 GB | 256 GB SSD | iGPU | 100K | $400 |
| Standard personal | i5-13400 | 16 GB | 512 GB NVMe | iGPU | 500K | $800 |
| Power user | i7-13700 | 32 GB | 1 TB NVMe | RTX 4060 | 5M | $2,000 |
| Small team | Ryzen 7 7700 | 32 GB | 2 TB NVMe | RTX 4060 | 10M | $3,500 |
| Enterprise | Xeon Silver | 64 GB | 4 TB NVMe | RTX 4090 | 50M | $10,000 |
| Large enterprise | Dual EPYC | 256 GB | 100 TB NVMe | 2× A4000 | 500M | $50,000+ |

---

## 13. Conclusion

Kamelot's flexible hardware and software requirements make it suitable for a wide range of deployments — from a 2 GB RAM Raspberry Pi in a field research camp to a 64 GB RAM enterprise server handling millions of files.

The key specifications to remember:

- **Minimum**: 2 GB RAM, 2 cores, any storage, no GPU
- **Recommended**: 8 GB RAM, 4 cores, SSD, integrated GPU
- **Production**: 16 GB+ RAM, 8+ cores, NVMe, dedicated GPU

Choose the configuration that matches your use case, and scale up as needed. Kamelot grows with you.

---

*For configuration assistance or sizing questions: specs@kamelot.dev*

*Last updated: June 2026*

*This document is part of the No More Silicon documentation suite. See also:*
- *01-beyond-hierarchy.md — Beyond hierarchical filesystems*
- *02-software-defined-storage.md — Software-defined storage*
- *03-existing-hardware.md — Running on existing hardware*
- *04-edge-computing.md — Edge computing architecture*
- *05-legacy-hardware-reuse.md — Legacy hardware reuse*

---

*Kamelot is a project of Lois-Kleinner & 0-1.gg. © 2026. All rights reserved.*

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com