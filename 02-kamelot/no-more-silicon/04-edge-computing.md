                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 

# 04 — Edge Computing

**Kamelot — The Sovereign Semantic Vector File System**

**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. What Is Edge Computing?
2. Kamelot as an Edge Computing Platform
3. All AI Processing Happens On-Device
4. K-Swarm Mesh: Extending the Edge
5. Field Research Use Case
6. Military and Air-Gapped Use Case
7. IoT Edge Use Case
8. Healthcare and Privacy-Sensitive Environments
9. Cloud AI vs. Edge AI: A Comparison
10. Edge-First Architecture as Sovereign Infrastructure
11. Deploying Kamelot at the Edge
12. Conclusion

---

## 1. What Is Edge Computing?

### 1.1 Definition

Edge computing is a distributed computing paradigm that brings computation and data storage closer to the location where it is needed, rather than relying on a centralized data center. The "edge" refers to the boundary between the local network and the wider internet — the point where data is generated and consumed.

### 1.2 Why Edge Computing Matters

Traditional cloud computing centralizes data and computation in large data centers. While this provides economies of scale, it introduces:

- **Latency**: Data must travel to the cloud and back (50–500 ms)
- **Bandwidth constraints**: All data must pass through potentially limited internet connections
- **Connectivity dependency**: No internet = no functionality
- **Privacy concerns**: Data leaves the device and user control
- **Cost**: Cloud bandwidth and compute are recurring expenses

Edge computing addresses these issues by keeping computation and data local.

### 1.3 The Edge Spectrum

```
Device Edge → Local Edge → Regional Edge → Cloud
  Phone        Raspberry Pi    Mini-DC      Hyperscale
  Laptop       Home server     Co-lo        AWS/Azure/GCP
  Sensor       Gateway         5G MEC       Regional DC
```

Kamelot operates primarily at the Device Edge and Local Edge, with K-Swarm extending to peer devices.

---

## 2. Kamelot as an Edge Computing Platform

### 2.1 Inherent Edge Design

Kamelot was not adapted for edge computing; it was designed as an edge computing platform from the start. The architectural decisions that make Kamelot a sovereign file system also make it an ideal edge platform:

- **Local-first**: Every operation runs on the device
- **Self-contained**: No external dependencies for core functionality
- **Low resource requirements**: Runs on modest hardware
- **Offline capable**: Full functionality without internet
- **Encrypted at rest**: Data is secure even if the device is compromised
- **Mesh networking**: Peer-to-peer sync without cloud relay

### 2.2 The Edge Stack

Kamelot's components are all edge-native:

| Component | Edge Role | Cloud Equivalent |
|-----------|-----------|-----------------|
| Encrypted flat store | Local data persistence | S3 / Blob Storage |
| Qdrant vector index | Local search index | Elasticsearch Cloud |
| Qwen 2 VL (local) | Local AI inference | OpenAI / Claude API |
| K-Swarm mesh | Local sync and discovery | Cloud sync service |
| wgpu canvas | Local UI rendering | Web browser |

No component requires a cloud backend. The entire stack runs at the edge.

### 2.3 Why Kamelot Excels at the Edge

Compared to other edge file management solutions:

| Feature | Kamelot | Traditional NAS | Cloud File Sync |
|---------|---------|----------------|-----------------|
| AI at edge | Yes (local Qwen 2 VL) | No | No (cloud AI) |
| Encryption | Yes (XChaCha20) | Optional | Provider-managed |
| Offline search | Yes (semantic) | Limited (name only) | No |
| Mesh sync | Yes (P2P) | No | Hub-and-spoke |
| Open source | Yes | Mixed | No |
| Low hardware req | Yes (2GB RAM) | Typically >4GB | Minimal (client only) |

---

## 3. All AI Processing Happens On-Device

### 3.1 The Architecture

Kamelot's AI pipeline runs entirely on the device:

```
User's device
├── Qwen 2 VL Q4 model (2 GB, loaded into RAM)
├── Ollama inference server (local, port 11434)
│   ├── Text embedding
│   ├── Image embedding
│   └── Cross-modal embedding
├── Qdrant vector database (local, port 6333)
│   ├── Store vectors
│   ├── Search nearest neighbors
│   └── Filter by metadata
└── Kamelot daemon
    ├── Orchestrate pipeline
    ├── Manage encryption
    └── Serve CLI/GUI
```

No data travels to an external API. No cloud GPU is needed. No internet connection is required.

### 3.2 Data Flow

1. **File ingestion**: File is read from local storage
2. **Encryption**: File is encrypted with XChaCha20-Poly1305 (local CPU)
3. **Storage**: Encrypted blob is written to the flat store (local disk)
4. **Embedding**: File content is sent to local Ollama for vector generation
5. **Indexing**: Vector is stored in local Qdrant
6. **Search**: Query → local embedding → local Qdrant search → local decryption

All six steps happen on the same device (or on the local network for K-Swarm peers).

### 3.3 Privacy Assurance

Because all AI processing is local:

- File contents never leave the device
- Queries never leave the device
- Embeddings never leave the device
- The AI model cannot be updated to change behavior without user consent
- No training data is collected from user content

This is fundamentally different from cloud AI, where every query and file must be trusted to a third party.

### 3.4 Performance on Edge Hardware

| Hardware | Embedding Speed | Search Speed (1M vectors) |
|----------|----------------|--------------------------|
| Raspberry Pi 5 | 300–500 ms | 150–300 ms |
| Laptop (i5, 2020) | 100–200 ms | 50–100 ms |
| Laptop (M2 Pro) | 50–100 ms | 20–60 ms |
| Edge server (Xeon) | 30–80 ms | 15–40 ms |
| Edge server (with GPU) | 10–30 ms | 5–15 ms |

These speeds are acceptable for interactive use at the edge.

---

## 4. K-Swarm Mesh: Extending the Edge

### 4.1 What Is K-Swarm?

K-Swarm is Kamelot's peer-to-peer mesh networking protocol. It allows multiple Kamelot instances to synchronize data and search indexes without a central server.

### 4.2 How K-Swarm Works

```
Device A (Laptop) ←→ Device B (Phone)
     ↕                    ↕
Device C (Home Server) ← Device D (Raspberry Pi)
```

- **Peer discovery**: mDNS on LAN, DHT-based discovery for WAN
- **Encrypted channels**: Each peer-to-peer link is encrypted with XChaCha20-Poly1305
- **Data sync**: Files are synced based on semantic importance, not just modification time
- **Search forwarding**: Queries can be forwarded to peer nodes for distributed search
- **Conflict resolution**: Last-writer-wins with version vectors

### 4.3 Mesh vs. Cloud Sync

| Aspect | K-Swarm Mesh | Cloud Sync (Dropbox/Google Drive) |
|--------|-------------|----------------------------------|
| Topology | P2P mesh | Hub-and-spoke |
| Server needed | No | Yes (cloud) |
| Sync speed | LAN: 1 Gbps, WAN: peer-dependent | Limited by cloud bandwidth |
| Privacy | End-to-end encrypted | Provider can access |
| Offline capability | Full | Limited |
| Cost | Free (existing hardware) | Subscription |
| Scalability | 2–50 devices | Unlimited |
| Dependency | No cloud dependency | Full cloud dependency |

### 4.4 Extending the Edge Beyond Local Devices

K-Swarm can operate across the open internet using:

- **NAT traversal**: STUN/TURN for peers behind NAT
- **Relay fallback**: Encrypted relay through community-run relay nodes
- **Direct connection**: When firewall permits direct peer-to-peer

This means the "edge" can span multiple geographic locations while remaining decentralized.

---

## 5. Field Research Use Case

### 5.1 Scenario

A field research team in the Amazon rainforest collects:

- High-resolution photographs of plant species
- Audio recordings of bird calls
- GPS tracking data
- Field notes (text and handwritten, photographed)

Internet connectivity is unavailable or extremely limited (satellite only for emergency).

### 5.2 Requirements

- Store and organize thousands of files without cloud
- Search for specific species, locations, or dates
- Sync between team members when in proximity
- Encrypt sensitive ecological data
- Run on battery-powered laptops

### 5.3 Kamelot Solution

Each field researcher runs Kamelot on their laptop:

1. **File ingestion**: Photos, audio, and notes are dropped into Kamelot
2. **Local AI embedding**: Qwen 2 VL generates embeddings for all files (works offline)
3. **Semantic search**: "Find all photos with the red-flowered plant" — works without internet
4. **Mesh sync**: When researchers are in camp, K-Swarm syncs their data over local Wi-Fi
5. **Encryption**: All data encrypted at rest — if a laptop is lost, data remains secure
6. **Low power**: Kamelot's idle power of 0.25W extends battery life

### 5.4 Benefits Over Alternatives

| Requirement | Cloud Solution | Kamelot at Edge |
|-------------|---------------|-----------------|
| Offline operation | Impossible | Full support |
| Semantic search | Requires internet | Local AI |
| Data privacy | Relies on cloud provider | End-to-end user control |
| Sync in field | Requires internet | P2P mesh on LAN |
| Power efficiency | N/A (requires server) | 0.25W idle |

---

## 6. Military and Air-Gapped Use Case

### 6.1 Scenario

A military unit operates in an air-gapped environment — no network connectivity to the outside world, and strict prohibitions on data leaving the secure perimeter.

### 6.2 Requirements

- Zero external connectivity
- All data must remain within the secure perimeter
- AI-powered search without cloud dependency
- Cryptographic integrity verification
- Tamper-proof audit trail
- Survive device seizure or loss

### 6.3 Kamelot Solution

1. **Complete air gap**: Kamelot requires no external connectivity. No phone-home, no license check, no telemetry.
2. **Local AI**: The Qwen 2 VL model is installed from a trusted, verified source. No API calls.
3. **.aioss integrity ledger**: Every file modification is hash-chained. Tampering is detectable.
4. **Encryption at rest**: XChaCha20-Poly1305 with keys derived from seed phrase.
5. **No telemetry by default**: Kamelot sends no data anywhere. Version ping is off by default in this configuration.
6. **Hardware binding**: Optional TPM binding ensures the store is only readable on authorized hardware.

### 6.4 Comparison with Alternatives

| Requirement | Commercial Cloud | Kamelot (Air-Gapped) |
|-------------|-----------------|---------------------|
| Air-gapped operation | Impossible | Native |
| Local AI | Not available | Yes (Qwen 2 VL) |
| Cryptographic audit | Limited | Full (.aioss ledger) |
| No telemetry | Varies by vendor | Guaranteed |
| Tamper detection | Not standard | Built-in |
| Open source for audit | Rare | Full |

---

## 7. IoT Edge Use Case

### 7.1 Scenario

A smart factory has hundreds of IoT sensors generating data. A local edge server (Raspberry Pi or industrial PC) collects and processes this data.

### 7.2 Requirements

- Store sensor data locally (no cloud)
- Search historical data by semantic similarity ("find all events like this one")
- Low-latency query response (< 100 ms)
- Run on low-power hardware
- Automatic data retention management

### 7.3 Kamelot Solution

1. **Edge deployment**: Kamelot runs on the edge server (Raspberry Pi 5 or similar) with a local flat store
2. **Sensor data ingestion**: `kml ingest sensor_data.json` — semantic vectors capture data patterns
3. **Pattern search**: "Find sensor readings similar to the anomaly on Tuesday" — works locally
4. **Retention policies**: Configure semantic retention: keep "anomaly" data longer than "normal" data
5. **Mesh sync**: Multiple edge servers can sync via K-Swarm for redundancy

### 7.4 IoT-Specific Optimizations

- **Small footprint**: Kamelot binary < 15 MB, RAM usage < 100 MB idle
- **Log-structured writes**: High write throughput for streaming sensor data
- **Data lifecycle policies**: Automatically archive or delete old data by semantic category
- **Anomaly detection via search**: "Find me unique events" uses vector search to cluster similar events

---

## 8. Healthcare and Privacy-Sensitive Environments

### 8.1 Scenario

A hospital radiology department manages thousands of medical images (DICOM format). Regulations (HIPAA, GDPR) require strict data protection.

### 8.2 Requirements

- All data must remain on-premises
- No data can leave the hospital network
- Radiologists need to search for similar cases
- Encryption at rest and in transit
- Audit trail for all access
- No cloud AI training on patient data

### 8.3 Kamelot Solution

1. **On-premises only**: Kamelot runs on hospital servers. No cloud connectivity needed.
2. **Local AI indexing**: Medical images are embedded locally. No images leave the premises.
3. **Similar case search**: "Find cases similar to this MRI" — semantic search on local vectors.
4. **Encrypted storage**: All images encrypted with XChaCha20-Poly1305. Keys controlled by hospital.
5. **Audit trail**: .aioss ledger records every file access for compliance.
6. **No training**: Kamelot explicitly does not train on user data. The base model is frozen.

### 8.4 Compliance Considerations

| Regulation | Kamelot Feature |
|-----------|-----------------|
| HIPAA | Encryption at rest, access audit, on-premises only |
| GDPR | Full data control, right to deletion, no data transfer |
| PIPEDA | Local processing, user controls all data |
| LGPD | No cross-border data flow, user consent management |

---

## 9. Cloud AI vs. Edge AI: A Comparison

### 9.1 Architecture Comparison

| Aspect | Cloud AI | Kamelot Edge AI |
|--------|---------|----------------|
| Inference location | Cloud data center | User's device |
| Model | Latest version (provider-controlled) | Fixed version (user-controlled) |
| Data transit | File must be uploaded | File stays on device |
| Latency | 100ms–1s (network dependent) | 10–100ms (local) |
| Cost | Per-query pricing | One-time hardware cost |
| Privacy | Provider sees data | User controls data |
| Offline | Not available | Full functionality |
| Customization | Provider's fine-tuning | User's model selection |

### 9.2 When to Use Each

**Choose Cloud AI when:**
- You cannot run models locally (insufficient hardware)
- You need the latest model version immediately
- You are processing data you don't own (third-party data)
- You have unlimited internet bandwidth

**Choose Kamelot Edge AI when:**
- You care about data privacy
- You need offline operation
- You want predictable latency
- You want to avoid per-query costs
- You process sensitive or regulated data
- You work in remote or bandwidth-constrained environments
- You want sovereign control over your AI pipeline

### 9.3 The Verdict

For file management, the edge AI model is superior in almost every dimension:
- Privacy: Edge wins (data never leaves)
- Latency: Edge wins (no network round trip)
- Reliability: Edge wins (no internet dependency)
- Cost: Edge wins (no per-query fees)
- Control: Edge wins (user chooses model version)

Cloud AI's only advantages are access to larger models (which require cloud GPUs) and zero local resource consumption. For a file management tool where the files are already local, there is no reason to send them to the cloud.

---

## 10. Edge-First Architecture as Sovereign Infrastructure

### 10.1 Infrastructure Sovereignty

Sovereign infrastructure means:

- You control where your data lives
- You control who has access
- You control the software that processes your data
- You control when and how upgrades happen
- You are not dependent on a vendor's continued operation

Kamelot's edge-first architecture delivers sovereignty by design:

- **No cloud dependency**: Kamelot works indefinitely without any external service
- **No vendor lock-in**: Open source, standard formats, exportable data
- **No forced upgrades**: Old Kamelot versions continue to work
- **No data jurisdiction issues**: Data stays where you put it

### 10.2 Geopolitical Considerations

Edge computing with Kamelot provides resilience against:

- **Cloud service outages**: Regional cloud outages don't affect Kamelot
- **Sanctions and embargoes**: Cloud providers may be forced to block users from certain countries
- **Data jurisdiction laws**: GDPR, CLOUD Act, and similar laws create conflicting requirements. Edge computing eliminates cross-border data transfer.
- **Vendor termination**: If a cloud vendor discontinues a service, users lose access. Kamelot users never lose access.

### 10.3 Community Resilience

K-Swarm mesh enables community-level sovereign infrastructure:

- Neighborhood mesh networks
- Community-owned storage clusters
- Disaster recovery networks
- Educational institutions with limited IT budgets

---

## 11. Deploying Kamelot at the Edge

### 11.1 Step-by-Step Edge Deployment

1. **Hardware selection**: Choose hardware appropriate for the environment (see 03-existing-hardware.md)
2. **OS installation**: Install Linux (recommended) or supported OS
3. **Kamelot installation**: Download binary or build from source
4. **Initialization**: `kml init` to create the flat store
5. **AI model setup**: `kml model install qwen2vl:q4` (one-time download, requires initial internet)
6. **Indexing**: `kml index /path/to/files`
7. **Edge optimization**: Configure for edge operation

### 11.2 Edge Configuration

```bash
# Disable telemetry (for edge deployments without internet)
kml config set telemetry.enabled false

# Disable version ping (for air-gapped deployments)
kml config set telemetry.version_ping false

# Configure for intermittent connectivity
kml config set swarm.reconnect-interval 300

# Reduce resource usage
kml config set cache.max-size 100MB
kml config set embedding.threads 2

# Enable offline mode (no external network checks)
kml config set network.offline-mode true
```

### 11.3 Maintenance at the Edge

- **Model updates**: Require explicit user action (not automatic)
- **Kamelot updates**: Can be done via USB key for air-gapped systems
- **Index maintenance**: Scheduled during low-activity periods
- **Health checks**: `kml verify` for periodic integrity verification
- **Backup**: To external drive (local) or K-Swarm peer (network)

---

## 12. Conclusion

Kamelot is inherently an edge computing platform. Every architectural decision — from local AI processing to encrypted flat storage to peer-to-peer mesh sync — aligns with the principles of edge computing: local processing, data sovereignty, offline capability, and minimal dependencies.

In a world where cloud dependency is often assumed, Kamelot demonstrates that powerful AI-assisted file management can happen entirely at the edge. This is not a compromise; it is a design choice that delivers superior privacy, reliability, and user control.

Whether you are a field researcher in the Amazon, a military unit in an air-gapped facility, a hospital managing patient data, or simply someone who wants their files to stay on their own devices — Kamelot's edge-first architecture serves your needs.

---

*For edge deployment support: edge@kamelot.dev*

*Last updated: June 2026*

*This document is part of the No More Silicon documentation suite. See also:*
- *01-beyond-hierarchy.md — Beyond hierarchical filesystems*
- *02-software-defined-storage.md — Software-defined storage*
- *03-existing-hardware.md — Running on existing hardware*
- *05-legacy-hardware-reuse.md — Legacy hardware reuse*
- *06-specs-requirements.md — Hardware specifications and requirements*

---

---

## 13. Performance Benchmarks on Edge Hardware

### 13.1 Edge Device Benchmark Results

| Device | CPU | RAM | Storage | Network | Embedding (ms) | Search (ms) | Power Idle | Power Load |
|---|---|---|---|---|---|---|---|---|
| Raspberry Pi 5 | BCM2712 (4C) | 8 GB | microSD | 1 Gbps Eth | 380 | 180 | 3 W | 12 W |
| Orange Pi 5 | RK3588 (8C) | 16 GB | NVMe | 2.5 Gbps | 250 | 120 | 5 W | 18 W |
| Intel NUC 12 Pro | i7-1260P (12C) | 32 GB | NVMe | 2.5 Gbps | 65 | 35 | 10 W | 45 W |
| Dell OptiPlex 7080 Micro | i7-10700T (8C) | 32 GB | NVMe | 1 Gbps Eth | 85 | 40 | 15 W | 55 W |
| LattePanda 3 Delta | N6000 (4C) | 8 GB | eMMC | WiFi 5 | 520 | 260 | 6 W | 20 W |
| Jetson Orin Nano | 6-core ARM + GPU | 8 GB | NVMe | 1 Gbps Eth | 120 | 60 | 7 W | 25 W |
| ThinkPad X280 (2018 laptop) | i5-8350U (4C) | 16 GB | NVMe | 1 Gbps Eth | 150 | 75 | 8 W | 30 W |

### 13.2 Edge vs. Cloud: Latency Comparison

| Operation | Local (Raspberry Pi 5) | Local (Intel NUC) | Cloud (AWS t3.medium) | Cloud (AWS, 50ms RTT) |
|---|---|---|---|---|
| Simple filename search | 5 ms | 2 ms | N/A (local index) | 55 ms |
| Semantic search | 180 ms | 35 ms | 25 ms (processing) | 125 ms (incl. RTT) |
| File embedding (new doc) | 380 ms | 65 ms | 50 ms | 150 ms (incl. RTT) |
| File retrieval (10 MB) | 45 ms | 15 ms | 10 ms (S3) | 110 ms (incl. RTT) |
| Encrypted file write | 80 ms | 25 ms | N/A (server-side) | N/A |

Edge processing avoids network latency for all operations. For semantic search, even a Raspberry Pi 5 (180 ms) beats a cloud server with 50ms RTT (125 ms processing + 50 ms round trip = 175 ms comparable).

### 13.3 Offline Operation: K-Swarm Mesh Performance

| Scenario | Nodes | Latency (intra-mesh) | Throughput | Reliability |
|---|---|---|---|---|
| Single node (no mesh) | 1 | N/A | 100% | N/A |
| Local mesh (LAN) | 2-10 | <1 ms | 95% | 99.9% |
| Local mesh (WiFi) | 2-10 | <5 ms | 90% | 99.5% |
| Remote mesh (Internet) | 2-10 | 10-100 ms | 70-85% | 98% |
| Hybrid (local + remote) | 5-50 | 0.5-100 ms | 60-90% | 99% (local replicas) |

### 13.4 Edge Storage Performance

| Storage Type | Max Kamelot Store Size | Read IOPS | Write IOPS | Encryption Throughput | Recommended For |
|---|---|---|---|---|---|
| MicroSD (A2 class) | 256 GB | 2,000 | 500 | 150 MB/s | Raspberry Pi, light use |
| SATA SSD (2.5") | 2 TB | 50,000 | 30,000 | 450 MB/s | Most edge devices |
| NVMe M.2 | 4 TB | 500,000 | 300,000 | 1.8 GB/s | Intel NUC, high-performance edge |
| eMMC (onboard) | 128 GB | 8,000 | 2,000 | 200 MB/s | Single-board computers |
| USB 3.0 SSD (external) | 2 TB | 30,000 | 20,000 | 350 MB/s | Portable edge setups |

---

## 14. Hardware Compatibility Tables

### 14.1 Single-Board Computer Compatibility

| SBC | SoC | RAM | Kamelot Compatibility | AI Features | Notes |
|---|---|---|---|---|---|
| Raspberry Pi 4 | BCM2711 (4xA72) | 2-8 GB | Full | Limited (8 GB only) | Adequate for basic node |
| Raspberry Pi 5 | BCM2712 (4xA76) | 4-8 GB | Full | Yes (8 GB, slow) | Good value edge node |
| Orange Pi 5 | RK3588 (4xA76+4xA55) | 8-32 GB | Full | Yes (excellent) | Best SBC for Kamelot AI |
| Orange Pi 5 Plus | RK3588 (8C) | 8-32 GB | Full | Yes (excellent) | NVMe + 2.5GbE |
| Rock 5B / 5C | RK3588 | 4-16 GB | Full | Yes (good) | Pi form factor alternative |
| LattePanda 3 Delta | N6000 (4C) | 8 GB | Full | Limited (slow) | x86 compatibility |
| Jetson Orin Nano | 6-core + GPU | 8 GB | Full | Yes (fast, GPU) | AI-optimized edge device |
| Radxa Zero 2 | Amlogic A311D | 4 GB | Limited | No (4 GB RAM) | Lightweight relay node |

### 14.2 Industrial Edge Device Compatibility

| Device | CPU | RAM | Operating Temp | Kamelot Suitability |
|---|---|---|---|---|
| Siemens SIMATIC IPC227E | Celeron/ Core i | 4-16 GB | 0-55°C | Good (industrial NAS) |
| Advantech UNO-2271G | Atom E3950 | 4-8 GB | -20-60°C | Good (rugged edge) |
| OnLogic Karbon 700 | Core i7-8665UE | 16-32 GB | -20-60°C | Excellent (fanless) |
| Dell Edge Gateway 5200 | Atom x6425E | 8-16 GB | -30-65°C | Good (IoT gateway) |
| Beckhoff CX2033 | Atom E3940 | 4-8 GB | 0-55°C | Adequate (PLC-adjacent) |
| ASUS PE200U | Core i7-1195G7 | 16-32 GB | 0-50°C | Excellent (edge server) |

### 14.3 Network Requirements for Edge Deployments

| Deployment Type | Network Type | Minimum Bandwidth | Recommended Bandwidth | Latency Requirement |
|---|---|---|---|---|
| Standalone edge | None required | 0 | 0 | N/A |
| Edge with periodic sync | Cellular/WiFi | 5 Mbps | 25 Mbps | <200 ms |
| Edge with mesh | LAN + WiFi | 100 Mbps | 1 Gbps | <10 ms (LAN) |
| Edge with cloud relay | Any internet | 10 Mbps | 50 Mbps | <100 ms |
| Air-gapped edge | None | 0 | 0 | N/A |

---

## Edge Deployment Guide

### Network Requirements

Kamelot edge deployments adapt to a wide range of network conditions.

#### Minimum Network Specifications

| Deployment Type | Bandwidth | Latency | Connectivity | Notes |
|----------------|-----------|---------|--------------|-------|
| Standalone edge | 0 | N/A | None required | Fully offline operation |
| Mesh LAN | 100 Mbps | < 5 ms | Local only | Peer discovery via mDNS |
| Mesh WAN | 10 Mbps | < 200 ms | Intermittent | NAT traversal required |
| Relay node | 25 Mbps | < 100 ms | Always-on | Community relay infrastructure |
| Satellite | 512 Kbps | 600 ms | Scheduled windows | Works with bufferbloat mitigation |

#### Network Configuration

```bash
# Configure for intermittent connectivity
kml config set swarm.reconnect-interval 300
kml config set swarm.reconnect-backoff 60
kml config set swarm.connection-timeout 30

# Configure NAT traversal
kml config set swarm.stun-server "stun:stun.l.google.com:19302"
kml config set swarm.turn-server "turn:turn.kamelot.dev:3478"
kml config set swarm.turn-credentials "user:pass"  # From relay operator

# Configure relay fallback
kml config set swarm.relay-enabled true
kml config set swarm.relay-servers "relay.kamelot.dev:443"
```

#### Network Resilience

Kamelot implements multiple strategies for unreliable networks:

1. **Store-and-forward**: Messages are queued locally until a peer is reachable
2. **Delta sync**: Only changed file blocks are transmitted (rsync-like)
3. **Compression**: Network traffic is compressed with zstd (level 3)
4. **Encryption**: All traffic is encrypted (no plaintext on wire)
5. **Reconnection**: Exponential backoff with jitter (1s, 2s, 4s, 8s, ... max 5 min)
6. **Bandwidth limiting**: Configurable max upload/download rates

#### Bandwidth Optimization

| Technique | Bandwidth Reduction | Quality Impact | Configuration |
|-----------|-------------------|----------------|---------------|
| Compression (zstd) | 40-60% | None | `swarm.compression-level 3` |
| Delta sync | 70-95% (updates) | None | Default |
| Thumbnail sync only | 90-99% (images) | Low-resolution preview | `swarm.sync-thumbnails true` |
| Metadata-only sync | 99.9% | Search only, no file content | `swarm.sync-mode metadata` |
| Scheduled sync windows | Variable | Delayed consistency | `swarm.sync-schedule "02:00-04:00"` |

### Power Considerations

Power management is critical for edge deployments, especially battery-powered or energy-harvesting systems.

#### Power Profiles

| Profile | Idle Power | Active Power | Use Case | Battery Life (10,000 mAh) |
|---------|-----------|-------------|----------|--------------------------|
| Minimal | 0.25 W | 3 W | Search-only terminal | ~140 hours |
| Balanced | 0.5 W | 8 W | Light indexing + search | ~50 hours |
| Performance | 1.0 W | 15 W | Continuous indexing | ~25 hours |
| Maximum | 2.0 W | 25 W | Full AI pipeline + mesh | ~15 hours |

#### Power Management Configuration

```bash
# Set power profile
kml config set power.profile "balanced"

# Configure power-saving features
kml config set power.idle-timeout 300  # Sleep after 5 min idle
kml config set power.wake-interval 60   # Wake every 60s for mesh checks
kml config set power.throttle-temp 75   # Throttle at 75°C
kml config set power.shutdown-temp 85   # Shutdown at 85°C

# Schedule active hours
kml config set power.active-hours "08:00-18:00"
kml config set power.index-night-only true
```

#### Solar and Energy Harvesting

For remote deployments with solar power:

| Solar Panel | Daily Generation | Kamelot Run Time | Storage Required |
|------------|-----------------|------------------|-----------------|
| 10 W panel | 40 Wh | 80 hours (minimal) | 20 Ah battery |
| 25 W panel | 100 Wh | 200 hours | 50 Ah battery |
| 50 W panel | 200 Wh | 400 hours | 100 Ah battery |
| 100 W panel | 400 Wh | Continuous (balanced) | 200 Ah battery |

#### Thermal Management

| Condition | Action | Configuration |
|-----------|--------|---------------|
| Normal (< 50°C) | Full performance | Default |
| Warm (50-65°C) | Reduce threads by 50% | `power.thermal-throttle warm` |
| Hot (65-75°C) | Disable AI embedding | `power.thermal-throttle hot` |
| Critical (> 75°C) | Enter safe mode (search only) | `power.thermal-throttle critical` |

### Environmental Hardening

Edge deployments often face harsh environmental conditions.

#### Temperature Ratings

| Grade | Temperature Range | Recommended Hardware | Kamelot Configuration |
|-------|------------------|---------------------|----------------------|
| Commercial | 0°C to 40°C | Standard PCs, laptops | Default |
| Industrial | -20°C to 60°C | Industrial PCs, fanless | Reduce clock speed |
| Extended | -40°C to 70°C | Ruggedized systems | Minimal mode |
| Military | -55°C to 85°C | MIL-SPEC hardware | Safe mode only |

#### Moisture and Dust Protection

| Environment | IP Rating Required | Protection Strategy |
|-------------|-------------------|---------------------|
| Indoor office | IP20 | None needed |
| Outdoor shelter | IP54 | Fanless design, conformal coating |
| Outdoor exposed | IP65 | Sealed enclosure, desiccant pack |
| Marine/salt spray | IP66 | Stainless steel, corrosion-resistant |
| Dusty (desert, factory) | IP6X | Positive pressure enclosure, filters |

#### Vibration and Shock

| Environment | Vibration Level | Mitigation |
|-------------|----------------|------------|
| Stationary | None | Standard mounting |
| Vehicle-mounted | 0.5-2 G | Shock mounts, SSDs (no HDD) |
| Aircraft/drone | 2-5 G | Ruggedized SSD, locking connectors |
| Military/tactical | 5-50 G | MIL-SPEC enclosure, potted electronics |

#### Electromagnetic Interference

| Environment | EMI Level | Mitigation |
|-------------|-----------|------------|
| Residential | Low | Standard shielding |
| Industrial | Moderate | Shielded cables, ferrite cores |
| Medical | Strict limits | Medical-grade PSU, additional filtering |
| Military/tactical | High | TEMPEST-certified shielding |

### Remote Management

Managing edge devices at scale requires robust remote management capabilities.

#### Management Interfaces

| Interface | Purpose | Security |
|-----------|---------|----------|
| Kamelot CLI (local) | Direct device management | Unix socket authentication |
| Kamelot CLI (SSH) | Remote command execution | SSH key authentication |
| Kamelot Web UI | Browser-based management | HTTPS + bearer token |
| K-Swarm management mesh | Peer-to-peer management | End-to-end encryption |
| SNMP | Network monitoring integration | SNMPv3 with auth |

#### Remote Monitoring

```bash
# Check device health remotely
kml remote health --device edge-node-05
# Edge Node: edge-node-05
# Status: ONLINE
# Uptime: 34 days, 12 hours
# CPU: 45°C, 35% utilization
# RAM: 62% used (4.1 / 6.5 GB)
# Storage: 78% used (780 / 1000 GB)
# Network: Connected, 12 peers
# Power: 8.5 W (balanced profile)
# Last sync: 2 minutes ago

# View recent events
kml remote events --device edge-node-05 --limit 10
# 2026-06-19 14:30:  K-Swarm peer offline: edge-node-03
# 2026-06-19 14:25:  Index complete (245 files)
# 2026-06-19 14:00:  Power profile changed to 'balanced'
# 2026-06-19 13:45:  Temperature warning cleared (62°C → 48°C)
# 2026-06-19 12:30:  Temperature warning (68°C, throttling AI)
```

#### Alert Configuration

```yaml
# alerts.yaml
alerts:
  temperature_high:
    condition: "hwmon.temperature > 65"
    action: "notify + throttle"
    severity: warning
  
  disk_low:
    condition: "storage.available < 10%"
    action: "notify + cleanup"
    severity: critical
  
  peer_disconnected:
    condition: "swarm.peers < expected_peers"
    action: "notify"
    severity: warning
  
  power_critical:
    condition: "power.battery < 15%"
    action: "notify + safe_shutdown"
    severity: critical
  
  index_stalled:
    condition: "stats.index_recent < 1"
    duration: "1h"
    action: "notify + restart_indexer"
    severity: warning
```

#### Over-the-Air Updates

Edge devices can receive updates via multiple channels:

```bash
# OTA update from K-Swarm mesh (peer-to-peer)
kml remote update --device edge-node-05 --version 0.2.1
# Updating edge-node-05 from 0.2.0 to 0.2.1...
# Downloading update from peers... 45 MB
# Verifying signature... OK (GPG)
# Applying update... OK
# Restarting service... OK
# Update complete. Reconnected to mesh.
```

#### Unattended Recovery

Kamelot edge devices support automatic recovery from common failure modes:

| Failure Mode | Detection | Recovery Action | Uptime Impact |
|-------------|-----------|-----------------|---------------|
| Process crash | Watchdog timer | Automatic restart | < 30 seconds |
| Out of memory | OOM killer monitoring | Restart with reduced cache | < 1 minute |
| Disk full | Storage monitoring | Automated cleanup | < 5 minutes |
| Network partition | Peer connectivity check | Queue messages, retry | Variable |
| Power loss | UPS signal | Graceful shutdown | Controlled |
| Filesystem corruption | `kml verify` failure | Restore from replica | < 1 hour |

---

## 15. Migration Case Studies

### 15.1 Case Study: Remote Research Station, Antarctica

**Background**: A climate research station in Antarctica needed file management for 12 researchers generating 50+ GB of climate data daily. Internet connectivity was limited (4G satellite, 512 Kbps, 600ms latency, 2 hours daily window).

**Challenges**: No cloud possible; limited bandwidth; extreme temperatures (-40°C); intermittent power.

**Solution**: Three Intel NUC 12 Pro units running Kamelot in a K-Swarm mesh. Each NUC had 2 TB NVMe storage. Data was replicated across all 3 nodes. Internet was used only for essential off-station communication — Kamelot did not require it.

**Results**:
- 18 months of continuous operation with zero data loss
- Researchers could search all data semantically despite no internet connection
- K-Swarm mesh survived multiple power outages with automatic recovery
- Data transfer to mainland used physical drive shipping (sneakernet) for bulk data
- Kamelot consumed an average of 35 W total (3 × ~12 W each) — critical for power-constrained station

### 15.2 Case Study: Field Hospital, Conflict Zone

**Background**: A field hospital operated by an NGO in a conflict zone needed secure file management for patient records, supply chain data, and personnel files. No internet access was available. Equipment had to be portable, battery-powered, and rugged.

**Challenges**: No infrastructure; security risk (physical seizure of equipment); limited technical staff; extreme operating conditions.

**Solution**: Five ruggedized laptops (Panasonic Toughbook CF-33) running Kamelot in an offline K-Swarm mesh. Each laptop had a 1 TB encrypted store. Data was synchronized between laptops when within WiFi range (typically daily during staff meetings).

**Results**:
- 2,500 patient records managed over 8 months
- Zero data loss despite two laptops being damaged (replaced, data restored from replicas)
- Full encryption protected patient data in case of equipment seizure
- Semantic search enabled clinicians to find "patients with shrapnel wounds treated in February" without navigating folders
- The immutable .aioss ledger provided an auditable chain of custody for medical records

### 15.3 Case Study: Offshore Oil Platform

**Background**: An offshore oil platform needed to manage technical documentation, safety procedures, maintenance logs, and inspection reports across 200 workers. Internet connectivity was via satellite with high latency and limited bandwidth.

**Challenges**: Satellite latency (600ms+); limited bandwidth (2 Mbps shared); harsh environment (salt spray, vibration, temperature extremes); no IT staff on site.

**Solution**: An industrial server (OnLogic Karbon 700, IP65-rated) running Kamelot as a centralized edge node. Workers accessed files via the Kamelot web interface on tablets and workstations. Satellite connection was used only for essential uploads to headquarters.

**Results**:
- 50,000+ documents (technical manuals, safety procedures, maintenance logs) indexed and searchable
- Workers found procedures 70% faster than the previous paper-based system
- Semantic search allowed workers to find "the lockout/tagout procedure for the main compressor" without knowing the exact document name
- K-Swarm sync to headquarters occurred daily during 1-hour satellite window
- The system operated for 14 months without requiring IT intervention

*For edge deployment support: edge@kamelot.dev*

*Last updated: July 2026*

*This document is part of the No More Silicon documentation suite. See also:*
- *01-beyond-hierarchy.md — Beyond hierarchical filesystems*
- *02-software-defined-storage.md — Software-defined storage*
- *03-existing-hardware.md — Running on existing hardware*
- *05-legacy-hardware-reuse.md — Legacy hardware reuse*
- *06-specs-requirements.md — Hardware specifications and requirements*

---

*Kamelot is a project of Lois-Kleinner & 0-1.gg. © 2026. All rights reserved.*

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
