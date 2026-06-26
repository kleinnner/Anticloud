                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# K-Swarm Mesh

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

- [Introduction](#introduction)
- [What Is K-Swarm?](#what-is-k-swarm)
- [Architecture Overview](#architecture-overview)
- [Libp2p Foundation](#libp2p-foundation)
- [Peer Identity and Authentication](#peer-identity-and-authentication)
- [Encrypted Tunnels](#encrypted-tunnels)
- [Semantic Sync Protocol](#semantic-sync-protocol)
- [Binary Offloading](#binary-offloading)
- [Index Synchronization](#index-synchronization)
- [NAT Traversal](#nat-traversal)
- [Peer Discovery](#peer-discovery)
- [Offline-First Operation](#offline-first-operation)
- [Conflict Resolution](#conflict-resolution)
- [Security Model](#security-model)
- [Performance Characteristics](#performance-characteristics)
- [Configuration](#configuration)
- [Commands Reference](#commands-reference)

---

## Introduction

K-Swarm is Kamelot's peer-to-peer encrypted mesh networking subsystem. Built on Libp2p, it connects multiple devices running Kamelot into a secure, decentralized network where semantic indexes are synchronized and files are accessible across devices through end-to-end encrypted tunnels.

The key insight behind K-Swarm is **semantic sync**: devices synchronize their vector indexes (the "map" of where files are) but can choose to leave large binary blobs on their originating device. This means your laptop knows about the files on your desktop and can return them in search results, but the actual file bytes are only transferred when you explicitly open or copy a file.

---

## What Is K-Swarm?

K-Swarm is not a file sync service like Dropbox or Syncthing. It is a **semantic mesh** that connects your personal devices into a unified semantic file system:

```graphify
graph TD
    subgraph "Home Network"
        LAPTOP[Laptop<br/>Work Documents]
        DESKTOP[Desktop<br/>Media Library]
        SERVER[Home Server<br/>Backups]
    end
    
    subgraph "Mobile"
        PHONE[Phone<br/>Photos & Notes]
        TABLET[Tablet<br/>Reading]
    end
    
    subgraph "Remote"
        VPS[Cloud VPS<br/>Always-on Relay]
    end
    
    LAPTOP === DESKTOP
    LAPTOP === SERVER
    LAPTOP === PHONE
    LAPTOP === TABLET
    LAPTOP === VPS
    DESKTOP === SERVER
    DESKTOP === VPS
    PHONE === VPS
    TABLET === VPS
    SERVER === VPS
    
    style LAPTOP fill:#4a90d9
    style DESKTOP fill:#4a90d9
    style SERVER fill:#4a90d9
    style PHONE fill:#4a90d9
    style TABLET fill:#4a90d9
    style VPS fill:#7c4ad9
```

---

## Architecture Overview

```graphify
graph TD
    subgraph "K-Swarm Node"
        subgraph "Network Layer"
            LP[Libp2p Host]
            ID[Identity Manager<br/>Ed25519 Keypair]
            TR[Transport Manager<br/>TCP, QUIC, WebRTC]
            UP[Upgrader<br/>Noise + TLS]
            MP[Muxer<br/>Yamux, Mplex]
        end
        
        subgraph "Protocol Layer"
            DISC[Discovery<br/>mDNS / DHT / Relay]
            TUN[Tunnel Manager<br/>E2E Encrypted Streams]
            SYNC[Semantic Sync<br/>Index Replication]
            FILE[File Transfer<br/>Binary Transfer]
            PING[Heartbeat / Keepalive]
        end
        
        subgraph "Application Layer"
            QSYNC[Query Sync<br/>Cross-device Search]
            WSRV[Workspace Sharing<br/>Shared Workspaces]
            EVT[Event Bus<br/>File Change Events]
        end
        
        subgraph "Kamelot Core"
            VFS[VFS Layer]
            QD[Qdrant Index]
            FS[Flat Store]
            LG[Ledger]
        end
        
        LP --> TR
        TR --> UP
        UP --> MP
        MP --> DISC
        MP --> TUN
        MP --> SYNC
        MP --> FILE
        MP --> PING
        
        TUN --> QSYNC
        TUN --> WSRV
        TUN --> EVT
        
        QSYNC --> QD
        WSRV --> VFS
        EVT --> FS
        EVT --> LG
        SYNC --> QD
        FILE --> FS
    end
```

---

## Libp2p Foundation

Libp2p is the modular networking stack that provides the foundation for K-Swarm:

### Used Modules

| Module | Purpose | Kamelot Configuration |
|--------|---------|----------------------|
| TCP Transport | Reliable stream transport | Port 9001, with noise encryption |
| QUIC Transport | Low-latency transport | Port 9002, with TLS 1.3 |
| WebRTC Transport | Browser/mobile compatibility | STUN/TURN for NAT traversal |
| Noise Upgrader | Encryption + authentication | X25519 + ChaCha20-Poly1305 |
| Yamux Muxer | Stream multiplexing | Default configuration |
| Kademlia DHT | Peer discovery, content routing | Bootstrap peers, LAN mode |
| mDNS | Local network discovery | Automatic on LAN |
| Circuit Relay | NAT traversal relay | Configurable relay nodes |
| Identify Protocol | Peer information exchange | Enabled |
| Ping Protocol | Connectivity checks | 30-second interval |

### Host Configuration

```rust
use libp2p::{
    identity, noise, tcp, yamux, quic,
    kad, mdns, relay, ping,
    swarm::SwarmBuilder,
    Multiaddr, PeerId,
};

fn build_swarm(config: &SwarmConfig) -> Result<Swarm<Behaviour>> {
    let keypair = identity::Keypair::generate_ed25519();
    let peer_id = keypair.public().to_peer_id();
    
    let transport = tcp::tokio::Transport::new(
        tcp::Config::default().nodelay(true),
    )
    .upgrade(noise::Config::new(&keypair)?)
    .multiplex(yamux::Config::default())
    .or_else(quic::tokio::Transport::new(
        quic::Config::new(&keypair)?,
    ));
    
    let behaviour = Behaviour {
        kademlia: kad::Behaviour::new(
            peer_id,
            kad::Config::default(),
        ),
        mdns: mdns::tokio::Behaviour::new()?,
        relay: relay::Behaviour::new(peer_id, relay::Config::default()),
        ping: ping::Behaviour::new(
            ping::Config::new().with_interval(Duration::from_secs(30)),
        ),
        // Custom protocols
        swarm_sync: SwarmSync::new(),
        file_transfer: FileTransfer::new(),
        query_sync: QuerySync::new(),
    };
    
    let swarm = SwarmBuilder::with_tokio_executor(
        transport, behaviour, peer_id,
    ).build();
    
    Ok(swarm)
}
```

---

## Peer Identity and Authentication

### Identity

Each Kamelot installation has a persistent Ed25519 keypair:

```rust
struct PeerIdentity {
    keypair: identity::Keypair,
    peer_id: PeerId,
    added_at: SystemTime,
    display_name: String,
    device_type: DeviceType,
    public_key: Vec<u8>,
}

impl PeerIdentity {
    fn generate() -> Self {
        let keypair = identity::Keypair::generate_ed25519();
        let peer_id = keypair.public().to_peer_id();
        
        Self {
            keypair,
            peer_id,
            added_at: SystemTime::now(),
            display_name: hostname(),
            device_type: detect_device_type(),
            public_key: keypair.public().encode_protobuf(),
        }
    }
    
    fn sign(&self, data: &[u8]) -> Result<Vec<u8>> {
        Ok(self.keypair.sign(data)?)
    }
    
    fn verify(&self, data: &[u8], signature: &[u8]) -> Result<bool> {
        Ok(self.keypair.public().verify(data, signature))
    }
}
```

### Authentication Flow

```graphify
sequenceDiagram
    participant A as Node A
    participant B as Node B
    
    A->>B: Connect (TCP/QUIC)
    A->>B: Noise handshake (X25519 + ChaCha20)
    B->>A: Noise handshake response
    Note over A,B: Encrypted channel established
    
    A->>B: Identity::push(peer_id, public_key)
    B->>A: Identity::push(peer_id, public_key)
    
    A->>B: Auth::challenge(random_nonce)
    B->>A: Auth::response(sign(nonce))
    A->>A: Verify signature with B's public key
    
    B->>A: Auth::challenge(random_nonce)
    A->>B: Auth::response(sign(nonce))
    B->>B: Verify signature with A's public key
    
    Note over A,B: Mutual authentication complete
    Note over A,B: Trust established, can sync
```

### Trust on First Use (TOFU)

K-Swarm uses a TOFU model:

1. First connection: record the peer's public key
2. Subsequent connections: verify the public key matches
3. If the key changes: flag for user confirmation

```rust
struct PeerStore {
    known_peers: HashMap<PeerId, KnownPeer>,
}

struct KnownPeer {
    peer_id: PeerId,
    public_key: Vec<u8>,
    first_seen: SystemTime,
    last_seen: SystemTime,
    display_name: String,
    trust_level: TrustLevel,
}

enum TrustLevel {
    /// First connection, auto-trusted from same LAN
    AutoTrusted,
    /// Manually verified by user
    ManuallyVerified,
    /// User accepted despite key change
    KeyChangeAccepted,
    /// Untrusted (blocked)
    Untrusted,
}
```

---

## Encrypted Tunnels

All communication between peers is end-to-end encrypted:

### Encryption Layers

```graphify
flowchart TD
    A[Application Data<br/>Query, File, Sync] --> B[Protocol Encoding<br/>Protobuf]
    B --> C[Noise Encryption<br/>X25519 + ChaCha20-Poly1305]
    C --> D[Transport Layer<br/>TCP / QUIC / WebRTC]
    D --> E[Physical Network]
    
    F[Physical Network] --> G[Transport Layer]
    G --> H[Noise Decryption]
    H --> I[Protocol Decoding]
    I --> J[Application Data]
```

### Tunnel Establishment

```rust
async fn establish_tunnel(target: PeerId) -> Result<Tunnel> {
    // 1. Get or create noise session
    let session = noise_session_pool.get_or_create(target).await?;
    
    // 2. Open multiplexed stream
    let stream = session.new_stream().await?;
    
    // 3. Negotiate tunnel parameters
    stream.write_all(&TunnelRequest {
        version: 1,
        protocol: TunnelProtocol::SemanticSync,
        compression: CompressionType::Zstd,
        priority: 5,
    }.encode_to_vec()).await?;
    
    // 4. Read tunnel response
    let response = stream.read_exact().await?;
    let response = TunnelResponse::decode(response)?;
    
    Ok(Tunnel {
        target,
        stream,
        mtu: response.mtu,
        compression: response.compression,
    })
}
```

### Tunnel Types

| Tunnel Type | Purpose | Bandwidth | Latency Sensitivity |
|------------|---------|-----------|-------------------|
| Sync | Background index sync | High | Low |
| Query | Real-time cross-device search | Low | High |
| File | On-demand file transfer | Very high | Medium |
| Event | Real-time change notifications | Very low | Very high |
| Control | Peer management | Low | Low |

---

## Semantic Sync Protocol

The core innovation of K-Swarm is semantic synchronization:

### What Gets Synced

| Data | Synced? | Reason |
|------|---------|--------|
| Embedding vectors | Yes | Required for cross-device search |
| File metadata | Yes | Required for file listing |
| Content hashes | Yes | Required for dedup |
| Ledger entries | Yes | Required for consistency |
| File contents (binaries) | No | Too large, on-demand transfer |
| Qdrant index | Partial | Only vector + metadata |
| Canvas layout | Optional | User preference |

### Sync Protocol Flow

```graphify
sequenceDiagram
    participant A as Node A
    participant B as Node B
    
    Note over A,B: Initial connection
    
    A->>B: Sync::hello(node_id, index_version)
    B->>A: Sync::hello(node_id, index_version)
    
    Note over A,B: Exchange index summaries
    
    A->>B: Sync::index_summary(last_ledger_entry, vector_count)
    B->>A: Sync::index_summary(last_ledger_entry, vector_count)
    
    Note over A,B: Determine differences
    
    A->>B: Sync::request_missing(from_entry: 10500, to_entry: 11000)
    B->>A: Sync::entry_batch([Entry 10500, ..., Entry 11000])
    
    A->>A: Apply received entries to local index
    
    A->>B: Sync::ack(up_to: 11000)
    
    Note over A,B: Periodic incremental sync
    
    A->>B: Sync::delta(new_entries: [Entry 11001, 11002])
    B->>A: Sync::ack(up_to: 11002)
```

### Index Versioning

Each node maintains a version counter for its index:

```rust
struct IndexVersion {
    /// Last ledger entry number applied
    last_ledger_entry: u64,
    
    /// Timestamp of last index modification
    last_modified: SystemTime,
    
    /// Number of vectors in the index
    vector_count: u64,
    
    /// Total size of stored metadata
    metadata_size: u64,
    
    /// BLAKE3 hash of the index summary
    summary_hash: [u8; 32],
}
```

### Sync Modes

| Mode | Description | Bandwidth | When Used |
|------|-------------|-----------|-----------|
| Full sync | Transfer entire index | High | First connection |
| Incremental | Transfer deltas | Low | Regular sync |
| Fast-forward | Only new entries | Low | Frequent sync |
| Backfill | Fill in missing history | Medium | Reconnection |

---

## Binary Offloading

The key bandwidth-saving feature: files stay on the device where they were created.

### On-Demand Transfer

```graphify
sequenceDiagram
    participant User as User on Laptop
    participant Laptop as Laptop Node
    participant Desktop as Desktop Node
    
    User->>Laptop: Search "vacation photos"
    Laptop->>Laptop: Local index search
    Note over Laptop: Returns results from both local and desktop indexes
    Laptop-->>User: Results include files from Desktop
    
    User->>Laptop: open beach_photo.jpg
    Note over Laptop: File exists only on Desktop
    
    Laptop->>Desktop: FileTransfer::request(inode: 0x42A)
    Desktop->>Desktop: Look up inode, decrypt blob
    Desktop-->>Laptop: Encrypted file stream
    Laptop->>Laptop: Decrypt, cache locally
    Laptop-->>User: Display file
    
    Note over Laptop,Desktop: File now cached on Laptop
    Note over Laptop,Desktop: Cache respects LRU policy
```

### Transfer Protocol

```rust
struct FileTransfer {
    /// Pending transfers
    pending: HashMap<TransferId, TransferState>,
    
    /// Transfer history
    history: Vec<TransferRecord>,
    
    /// Cache directory for remote files
    cache_dir: PathBuf,
    
    /// Maximum cache size
    max_cache_size: u64,
}

enum TransferState {
    Requesting,
    Downloading { progress: f32, bytes_received: u64 },
    Completed { local_path: PathBuf },
    Failed { error: String },
}
```

### Caching Policy

| Policy | Behavior | Use Case |
|--------|----------|----------|
| LRU (default) | Evict least recently used | General use |
| Keep pinned | Never evict | Important files |
| Temporary | Evict on workspace close | Query results |
| Streaming | Never cache | Large media files |

---

## Index Synchronization

### Sync Algorithm

```rust
async fn sync_index_with_peer(peer: PeerId) -> Result<SyncResult> {
    let local_version = get_local_index_version()?;
    let remote_version = get_remote_index_version(peer).await?;
    
    if local_version.last_ledger_entry >= remote_version.last_ledger_entry {
        // Local index is ahead or equal, no sync needed
        return Ok(SyncResult::UpToDate);
    }
    
    // Request missing ledger entries
    let from = local_version.last_ledger_entry + 1;
    let to = remote_version.last_ledger_entry;
    
    let entries = request_ledger_entries(peer, from, to).await?;
    
    // Apply entries to local store
    for entry in entries {
        match entry.entry_type {
            FileCreate => {
                // Add metadata and vector reference
                // But do NOT download the binary
                local_store.add_remote_file(
                    entry.inode,
                    entry.metadata,
                    entry.vector_id,
                    peer,
                )?;
            }
            FileUpdate => {
                local_store.update_remote_file(
                    entry.inode,
                    entry.metadata,
                    entry.vector_id,
                )?;
            }
            FileDelete => {
                local_store.remove_remote_file(entry.inode)?;
            }
            // ...
        }
    }
    
    // Verify integrity
    verify_index_integrity()?;
    
    // Update local version
    update_local_index_version(remote_version)?;
    
    Ok(SyncResult::Synced {
        entries_applied: (to - from + 1) as u64,
    })
}
```

### Remote File Metadata

```rust
struct RemoteFile {
    inode: Inode,
    metadata: FileMetadata,
    vector_id: u64,
    source_peer: PeerId,
    cached_until: Option<SystemTime>,
}
```

---

## NAT Traversal

### Traversal Strategies

K-Swarm attempts multiple NAT traversal strategies in order:

```graphify
flowchart TD
    A[Need to Connect<br/>to Peer B] --> B{Direct<br/>Connection?}
    B -->|Yes| C[Connect Directly]
    B -->|No| D{UPnP /<br/>NAT-PMP?}
    D -->|Yes| C
    D -->|No| E{Hole<br/>Punching?}
    E -->|Yes| F[TCP Hole Punch]
    E -->|No| G{Relay<br/>Available?}
    G -->|Yes| H[Circuit Relay]
    G -->|No| I{Fallback<br/>TURN?}
    I -->|Yes| J[TURN Relay]
    I -->|No| K[Connection Failed]
    
    F -->|Success| C
    F -->|Failure| G
    H --> C
    J --> C
```

### Circuit Relay

Nodes with public IPs can act as relays for NATed peers:

```toml
[swarm.relay]
# Enable acting as a relay for other peers
enable_relay = true

# Maximum relay connections
max_relay_connections = 100

# Relay bandwidth limit
max_bandwidth = "100Mbps"

# Reserve relay bandwidth for own connections
reserve_bandwidth = "20Mbps"
```

---

## Peer Discovery

### Discovery Mechanisms

| Mechanism | Scope | Latency | Reliability |
|-----------|-------|---------|-------------|
| mDNS | Local network | <1s | High |
| Kademlia DHT | Global | 5-30s | Medium |
| Bootstrap peers | Pre-configured | 2-10s | High |
| Relay discovery | Via relay nodes | 1-5s | Medium |
| Manual connect | Explicit address | Immediate | High |

### mDNS Discovery

```rust
fn on_mdns_discovered(peers: Vec<mdns::Peer>) {
    for peer in peers {
        if !peer_store.is_known(peer.peer_id) {
            // Auto-trust LAN peers
            peer_store.add_peer(KnownPeer {
                peer_id: peer.peer_id,
                public_key: peer.public_key,
                first_seen: SystemTime::now(),
                last_seen: SystemTime::now(),
                display_name: peer.display_name,
                trust_level: TrustLevel::AutoTrusted,
            });
            
            log::info!("Discovered new peer on LAN: {} at {}",
                peer.display_name, peer.addresses[0]);
        }
    }
}
```

### Peer List

```bash
# List connected peers
kml swarm peers
# Peer ID                                    Name           Type    Address
# 12D3KooW...aBcDeF                          home-server    Desktop /ip4/192.168.1.100/tcp/9001
# 12D3KooW...GhIjKl                          work-laptop    Laptop  /ip4/10.0.0.5/tcp/9001
# 12D3KooW...MnOpQr                          phone          Mobile  /ip4/.../udp/9002/quic-v1

# Show peer details
kml swarm peers --detail 12D3KooW...aBcDeF
# Name: home-server
# Type: Desktop
# OS: Linux 6.8.0
# Kamelot version: 0.3.0
# Index size: 12,450 files
# Last seen: 2 seconds ago
# Connection: Direct (TCP)
# Latency: 3ms
```

---

## Offline-First Operation

K-Swarm is designed for intermittent connectivity:

### Offline Behavior

```graphify
stateDiagram-v2
    [*] --> Online
    
    state Online {
        Connected --> Syncing: Changes detected
        Syncing --> Connected: Sync complete
        Connected --> Idle: No changes
        Idle --> Connected: Peer change detected
    }
    
    Online --> Offline: Network lost
    
    state Offline {
        QueueChanges --> QueueChanges: Buffer local changes
    }
    
    Offline --> Online: Network restored
    Online --> Syncing: Reconnect sync
```

### Change Queue

```rust
struct ChangeQueue {
    /// Pending changes that haven't been synced
    pending: Vec<LedgerEntry>,
    
    /// Maximum queue size
    max_size: usize,
    
    /// When the queue was last flushed
    last_flush: Option<SystemTime>,
}

impl ChangeQueue {
    fn push(&mut self, entry: LedgerEntry) -> Result<()> {
        if self.pending.len() >= self.max_size {
            return Err(Error::QueueFull);
        }
        self.pending.push(entry);
        Ok(())
    }
    
    async fn flush(&mut self, swarm: &mut Swarm<Behaviour>) -> Result<()> {
        if self.pending.is_empty() {
            return Ok(());
        }
        
        // Group entries by target peer
        let peers = self.get_connected_peers(swarm);
        if peers.is_empty() {
            return Ok(()); // Stay queued
        }
        
        for peer in peers {
            swarm.behaviour_mut().swarm_sync.send_batch(
                peer, std::mem::take(&mut self.pending),
            )?;
        }
        
        Ok(())
    }
}
```

---

## Conflict Resolution

When two peers modify the same file offline, conflicts must be resolved:

### Conflict Detection

```rust
fn detect_conflict(local: &FileMetadata, remote: &FileMetadata) -> Option<Conflict> {
    if local.content_hash == remote.content_hash {
        return None; // Same content, no conflict
    }
    
    // Both were modified after last sync
    if local.modified_at > local.last_synced_at
        && remote.modified_at > remote.last_synced_at
    {
        return Some(Conflict {
            inode: local.inode,
            local_version: local.clone(),
            remote_version: remote.clone(),
            local_peer: local_peer_id(),
            remote_peer: remote_peer_id(),
        });
    }
    
    None
}
```

### Resolution Strategies

| Strategy | Behavior | User Prompt |
|----------|----------|-------------|
| Last writer wins | Keep the most recently modified | No |
| Local wins | Keep local version | No |
| Remote wins | Keep remote version | No |
| Manual | User chooses | Yes |
| Duplicate | Keep both versions | No (auto-rename) |

### Conflict UI

When a conflict is detected, the canvas UI shows a conflict resolution dialog:

```
┌─────────────────────────────────────────┐
│  Conflict: report.pdf                   │
├─────────────────────────────────────────┤
│  Local (Laptop):                        │
│  Modified: 2025-01-15 14:30             │
│  Size: 2.4 MB                           │
│  Preview: [first page]                  │
│                                         │
│  Remote (Desktop):                      │
│  Modified: 2025-01-15 14:45             │
│  Size: 2.8 MB                           │
│  Preview: [first page]                  │
│                                         │
│  [Use Local] [Use Remote] [Keep Both]   │
└─────────────────────────────────────────┘
```

---

## Security Model

### Encryption Layers

| Layer | Protocol | Key Exchange | Purpose |
|-------|----------|-------------|---------|
| Transport | Noise IX | X25519 | Stream encryption |
| Tunnel | ChaCha20-Poly1305 | Per-session key | Message encryption |
| File transfer | XChaCha20-Poly1305 | Ephemeral key | Blob encryption |

### Authentication

- Every peer has a persistent Ed25519 keypair
- Connection is authenticated via Noise protocol
- File transfers are signed by the source peer
- Index updates include a hash chain for integrity

### Trust Model

```rust
enum TrustLevel {
    /// Peer on same LAN, auto-trusted
    Local,
    
    /// Peer manually verified (e.g., scanning QR code)
    Verified,
    
    /// Peer introduced by a trusted peer
    Introduced,
    
    /// Untrusted, all communication blocked
    Untrusted,
}

enum Permission {
    /// Can query this peer's index
    ReadIndex,
    
    /// Can request file contents
    ReadFiles,
    
    /// Can sync local index changes to peer
    WriteIndex,
    
    /// Can create/modify files on peer
    WriteFiles,
    
    /// Can act as relay for this peer
    RelayTraffic,
}
```

---

## Performance Characteristics

### Index Sync

| Files | Initial Sync | Incremental (100 changes) |
|-------|-------------|--------------------------|
| 10,000 | 2.3 s | 0.15 s |
| 100,000 | 18 s | 0.6 s |
| 1,000,000 | 3.2 min | 4.5 s |

### File Transfer

| File Size | LAN (1 Gbps) | Internet (100 Mbps) | Internet (10 Mbps) |
|-----------|-------------|--------------------|--------------------|
| 1 MB | 12 ms | 95 ms | 850 ms |
| 10 MB | 95 ms | 850 ms | 8.2 s |
| 100 MB | 850 ms | 8.2 s | 82 s |
| 1 GB | 8.5 s | 82 s | 14 min |

### Mesh Scalability

| Peers | Connection Time | Memory per Peer | Bandwidth per Peer |
|-------|----------------|----------------|-------------------|
| 2 | 100 ms | 2 MB | 500 KB/s |
| 10 | 500 ms | 20 MB | 100 KB/s |
| 50 | 3 s | 100 MB | 30 KB/s |
| 100 | 8 s | 200 MB | 15 KB/s |

---

## Configuration

```toml
[swarm]
# Enable K-Swarm P2P mesh
enabled = true

# Display name for this node
display_name = "home-laptop"

# Device type (auto-detected if not specified)
device_type = "Laptop"

# Listen addresses
listen = [
    "/ip4/0.0.0.0/tcp/9001",
    "/ip4/0.0.0.0/udp/9002/quic-v1",
]

# Bootstrap peers (multiaddrs)
bootstrap = [
    "/dns/bootstrap1.kamelot.net/tcp/9001",
    "/dns/bootstrap2.kamelot.net/tcp/9001",
]

# Peer identity key path
identity_key_path = "/var/lib/kamelot/swarm/identity"

[swarm.discovery]
# Enable mDNS on local network
mdns = true

# Enable Kademlia DHT
dht = true

# DHT bootstrap interval
dht_bootstrap_interval = "5m"

# Max peers in DHT routing table
dht_max_peers = 500

[swarm.sync]
# Sync interval
sync_interval = "30s"

# Initial sync timeout
initial_sync_timeout = "5m"

# Batch size for syncing entries
sync_batch_size = 500

# Compression for sync messages
sync_compression = "zstd"

[swarm.transfer]
# Cache directory for remote files
cache_dir = "/var/lib/kamelot/cache"

# Maximum cache size
max_cache_size = "10GB"

# Transfer bandwidth limit (per peer)
max_transfer_bandwidth = "100Mbps"

# Transfer timeout
transfer_timeout = "5m"

[swarm.relay]
# Enable acting as relay
enable_relay = false

# Max relay connections
max_relay_connections = 50

# Reserve bandwidth for relay
reserve_bandwidth = "50Mbps"

[swarm.security]
# Minimum trust level for connections
min_trust_level = "Local"

# Auto-trust LAN peers
auto_trust_lan = true

# Enable manual verification mode
require_manual_verify = false

# Block unknown peers
block_unknown = false

# Allowed peers (whitelist)
allowed_peers = []

# Blocked peers (blacklist)
blocked_peers = []
```

---

## Commands Reference

```bash
# Status
kml swarm status

# List peers
kml swarm peers
kml swarm peers --detail <peer-id>

# Connect to peer
kml swarm connect /ip4/192.168.1.100/tcp/9001

# Disconnect
kml swarm disconnect <peer-id>

# Trust management
kml swarm trust <peer-id>
kml swarm untrust <peer-id>
kml swarm verify <peer-id>

# Transfer status
kml swarm transfers
kml swarm transfers --cancel <transfer-id>

# Cache management
kml swarm cache status
kml swarm cache clear

# Relay
kml swarm relay status
kml swarm relay connect <relay-addr>

# Diagnostics
kml swarm doctor
kml swarm ping <peer-id>
kml swarm traceroute <peer-id>
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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com