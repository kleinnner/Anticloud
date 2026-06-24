                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# 09 — K-Swarm Setup

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Overview](#overview)
2. [What is K-Swarm?](#what-is-k-swarm)
3. [Architecture](#architecture)
4. [Installation on Multiple Devices](#installation-on-multiple-devices)
5. [Configuring the Mesh](#configuring-the-mesh)
6. [Peer Discovery](#peer-discovery)
7. [Verifying Connections](#verifying-connections)
8. [Offloading Binaries, Retaining Indexes](#offloading-binaries-retaining-indexes)
9. [Remote File Access](#remote-file-access)
10. [Security and Encryption](#security-and-encryption)
11. [Performance Tuning](#performance-tuning)
12. [Troubleshooting](#troubleshooting)
13. [Advanced Configuration](#advanced-configuration)

---

## Overview

K-Swarm is Kamelot's peer-to-peer mesh networking protocol. It allows multiple Kamelot instances on different devices to connect, share indexes, and access files remotely. Unlike cloud-based file sync services, K-Swarm is fully decentralized, encrypted end-to-end, and operates without any central server.

With K-Swarm, you can:

- Search files on your desktop from your laptop
- Access work files from home without a VPN
- Share project files with colleagues without cloud storage
- Offload large binary files to a NAS while keeping indexes on your laptop
- Collaborate on workspaces in real-time

## What is K-Swarm?

K-Swarm (Kamelot Swarm) is a peer-to-peer networking layer built on the Noise Protocol Framework and libp2p primitives. Each Kamelot instance runs a K-Swarm node that can discover, connect to, and communicate with other nodes.

### Key Features

- **Fully Decentralized:** No central server, no cloud, no third party
- **End-to-End Encrypted:** All traffic encrypted with Noise XK handshake + ChaCha20-Poly1305
- **NAT Traversal:** Works across networks via STUN/TURN and hole-punching
- **Peer Discovery:** mDNS (local network), DHT (distributed hash table), manual peer addresses
- **Partial Sync:** Sync only indexes and metadata, not full file content
- **Offline-First:** Devices work independently, sync when connected
- **Selective Sharing:** Granular control over what is shared with whom

### Use Cases

**Personal Multi-Device:**
- Desktop at home + laptop on the go
- All devices can search all files
- Binary files stay on the device that has them; indexes are shared

**Team Collaboration:**
- Share workspaces with colleagues
- Co-arrange canvas layouts
- See real-time updates to shared files

**Home Server/NAS:**
- Run a headless K-Swarm node on a NAS
- Laptop connects to NAS for file access without full sync

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           K-Swarm Mesh Network                          │
│                                                                         │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     │
│   │ Desktop  │────▶│ Laptop   │────▶│ Phone    │────▶│ NAS      │     │
│   │ (Office) │◀────│ (Home)   │◀────│ (Mobile) │◀────│ (Server) │     │
│   └──────────┘     └──────────┘     └──────────┘     └──────────┘     │
│         │               │               │               │              │
│         │               │               │               │              │
│         ▼               ▼               ▼               ▼              │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                      Noise Protocol Layer                       │  │
│   │         End-to-end encrypted connections (XK handshake)         │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│         │               │               │               │              │
│         ▼               ▼               ▼               ▼              │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                      K-Swarm Protocol Layer                     │  │
│   │      Peer discovery · Query routing · File transfer · Sync      │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│         │               │               │               │              │
│         ▼               ▼               ▼               ▼              │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                      Kamelot Store Layer                        │  │
│   │      Each device has its own local store with local + remote    │  │
│   │      indexes                                                    │  │
│   └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Peer Types

**Full Node:** Complete Kamelot store with all files, indexes, and canvas layouts
**Index Node:** Has all indexes but only lightweight metadata (no binary files)
**Edge Node:** Connects to other nodes but stores minimal data locally
**NAS/Server Node:** Headless, always-on, serves files to other nodes

## Installation on Multiple Devices

### Prerequisites

Each device needs:

1. Kamelot installed
2. A Kamelot store initialized
3. Network connectivity between devices
4. Firewall ports open (default: 9120-9129 UDP/TCP)

### Install on Each Device

```bash
# Device 1: Desktop (Linux)
curl -fsSL https://kamelot.sh/install.sh | bash
kml init ~/kamelot_store

# Device 2: Laptop (macOS)
brew install lois-kleinner/tap/kamelot
kml init ~/kamelot_store

# Device 3: NAS (Linux, headless)
curl -fsSL https://kamelot.sh/install.sh | bash
kml init /mnt/nas/kamelot_store --headless
```

### Firewall Configuration

**Linux (ufw):**
```bash
sudo ufw allow 9120:9129/tcp comment 'K-Swarm TCP'
sudo ufw allow 9120:9129/udp comment 'K-Swarm UDP'
```

**Linux (firewalld):**
```bash
sudo firewall-cmd --add-port=9120-9129/tcp --permanent
sudo firewall-cmd --add-port=9120-9129/udp --permanent
sudo firewall-cmd --reload
```

**Windows (PowerShell as Admin):**
```powershell
New-NetFirewallRule -DisplayName "K-Swarm TCP" -Direction Inbound -Protocol TCP -LocalPort 9120-9129 -Action Allow
New-NetFirewallRule -DisplayName "K-Swarm UDP" -Direction Inbound -Protocol UDP -LocalPort 9120-9129 -Action Allow
```

**macOS:**
```bash
# macOS usually doesn't block local network traffic
# If using a third-party firewall, allow kml on ports 9120-9129
```

### Port Configuration

If the default port range conflicts:

```bash
kml config set kswarm.port_start 22000
kml config set kswarm.port_end 22009
```

## Configuring the Mesh

### Enable K-Swarm

```bash
# Enable K-Swarm on each device
kml config set kswarm.enabled true
kml config set kswarm.node_name "Desktop-Office"  # Unique name per device

# Start K-Swarm
kml kswarm start
```

### Node Identity

Each node has a cryptographic identity:

```bash
# View your node ID
kml kswarm id
```

Output:
```
Node ID: 12D3KooWQzYzR4X8Kj5X8Kj5X8Kj5X8Kj5X8Kj5X8Kj5X8Kj5X
Node Name: Desktop-Office
Public Key: 7a3b5c... (Ed25519)
```

The Node ID is derived from the Ed25519 public key. It serves as the unique identifier across the network.

### Setting Up Peer Connections

**Method 1: Local Network Discovery (mDNS)**

On a local network, K-Swarm automatically discovers peers via mDNS:

```bash
# Enable mDNS discovery
kml config set kswarm.discovery.mdns true

# Discover peers on local network
kml kswarm discover
```

Output:
```
Discovering peers on local network...
  Found: Laptop-Home (12D3KooW...)
  Found: NAS-Server (12D3KooX...)
  Found: Phone-Android (12D3KooY...)
```

**Method 2: Manual Peer Address**

For devices on different networks:

```bash
# Add a peer manually
kml kswarm peer add 12D3KooWQzYzR4X8K...@192.168.1.100:9120

# Add with a name
kml kswarm peer add "laptop@home.example.com:9120" --name "Laptop-Home"

# List known peers
kml kswarm peers
```

**Method 3: Peer Exchange via DHT**

For larger networks:

```bash
# Enable DHT peer discovery (requires at least one bootstrap node)
kml config set kswarm.discovery.dht true
kml config set kswarm.discovery.bootstrap_nodes \
  "/ip4/192.168.1.100/tcp/9120/p2p/12D3KooW..."
```

### Bootstrap Nodes

In a DHT-based network, at least one node needs to be a bootstrap:

```bash
# On the bootstrap node (e.g., NAS):
kml config set kswarm.bootstrap true

# On other nodes:
kml config set kswarm.discovery.bootstrap_nodes \
  "/ip4/nas.local/tcp/9120/p2p/12D3KooW..."
```

### Relay Nodes

For nodes behind strict NAT:

```bash
# Configure a relay node
kml config set kswarm.relay true

# Connect via relay
kml kswarm connect --relay /ip4/relay.example.com/tcp/9120/p2p/12D3KooR...
```

## Peer Discovery

### mDNS Discovery (Local Network)

```bash
# mDNS broadcasts every 30 seconds
kml config set kswarm.discovery.mdns_interval 30  # seconds

# Custom service name (if multiple K-Swarm networks)
kml config set kswarm.discovery.mdns_service "_kamelot._tcp"
```

### DHT Discovery (Global Network)

```bash
# DHT lookup interval
kml config set kswarm.discovery.dht_interval 60  # seconds

# Number of closest peers to query
kml config set kswarm.discovery.dht_lookup_parallelism 3
```

### Manual Discovery

```bash
# Discover peers on a specific subnet
kml kswarm discover --subnet 10.0.0.0/24

# Scan a specific host
kml kswarm discover --host 192.168.1.50

# Discover via a rendezvous point string
kml kswarm discover --rendezvous "kamelot-team-project"
```

### Peer Status

```bash
# Show peer connection status
kml kswarm status
```

Output:
```
K-Swarm Status:
  Node ID:      12D3KooWQzYzR4X8...
  Node Name:    Desktop-Office
  Status:       Running
  Uptime:       12h 34m 56s

Peers:
  Peer Name     Peer ID                           Status    Latency   Address
  ──────────    ────────                           ──────    ───────   ───────
  Laptop-Home   12D3KooWAbCdEf...                  Online    12ms      192.168.1.101:9120
  NAS-Server    12D3KooWXyZ012...                  Online    2ms       10.0.0.50:9120
  Phone-Android 12D3KooW3456Ab...                  Offline   -         (last seen: 2h ago)
```

## Verifying Connections

### Connection Test

```bash
# Ping a specific peer
kml kswarm ping 12D3KooWAbCdEf...
```

Output:
```
Pinging 12D3KooWAbCdEf... (Laptop-Home)
  Response time: 12ms
  Connection: OK
  Protocol version: 1.0
  Features: index_sync, file_transfer, workspace_sync
```

### Network Test

```bash
# Test full network connectivity
kml kswarm test
```

Output:
```
K-Swarm Network Test:
  ✓ Local node: OK
  ✓ mDNS discovery: Working (3 peers found)
  ✓ DHT connectivity: Working (5 nodes in routing table)
  ✓ NAT traversal: Working (direct connection to 2 peers, relay for 1)
  ✓ End-to-end encryption: Verified (Noise XK)
  ✓ Index sync: Working (45,678 vectors synced)
  ✓ File transfer: Working (12.4 MB/s throughput)
```

### Bandwidth Test

```bash
# Test bandwidth between peers
kml kswarm bandwidth 12D3KooWAbCdEf...
```

Output:
```
Bandwidth test to Laptop-Home:
  Download: 45.2 Mbps
  Upload:   38.7 Mbps
  Latency:  12ms
  Jitter:   3ms
  Packet loss: 0.01%
```

### Connection Details

```bash
# Show detailed connection info
kml kswarm peer info 12D3KooWAbCdEf...
```

Output:
```
Peer: Laptop-Home (12D3KooWAbCdEf...)
  Status:    Online
  Address:   192.168.1.101:9120
  Connected: 12h 34m 56s
  Latency:   12ms
  Protocol:  Noise XK + ChaCha20-Poly1305
  Transport: TCP (direct)
  Features:
    ✓ Index Sync
    ✓ File Transfer
    ✓ Workspace Sync
    ✓ Canvas Sync
    ○ Relay (not supported on this peer)
  Shared Resources:
    - Store: ~/kamelot_store (12,345 files, 45.2 GB)
    - Workspaces: 8 shared, 3 collaborative
    - Index: 12,345 vectors (384 dim)
```

## Offloading Binaries, Retaining Indexes

One of K-Swarm's most powerful features is the ability to offload large binary files to a NAS or server while keeping the indexes (and thus searchability) on your laptop.

### How It Works

```
Laptop (Index-only mode)
  ┌─────────────────────────────┐
  │  Store: Local Index         │
  │  ├── All embeddings         │  ← Searchable locally
  │  ├── All metadata           │  ← Browseable locally
  │  ├── All ledger blocks      │  ← Rollback capable
  │  └── × File contents        │  ← NOT stored locally
  └──────────┬──────────────────┘
             │ Query: "find tax return 2025"
             │ Results: Score 0.94, Inode 7f3a...
             │
             │ GET /inode/7f3a5c91...
             ▼
NAS (File storage)
  ┌─────────────────────────────┐
  │  Store: Full                │
  │  ├── All embeddings         │
  │  ├── All metadata           │
  │  ├── All ledger blocks      │
  │  └── ✓ File contents        │  ← Stored here
  └─────────────────────────────┘
```

### Configuring Index-Only Mode

```bash
# On the laptop (index only):
kml config set kswarm.store_mode "index-only"
kml config set kswarm.file_storage "remote"
kml config set kswarm.preferred_storage_peer "NAS-Server"

# On the NAS (full storage):
kml config set kswarm.store_mode "full"
kml config set kswarm.file_storage "local"
```

### Selective Offloading

```bash
# Offload files older than 30 days
kml kswarm offload --older-than 30 --to-peer NAS-Server

# Offload files larger than 100 MB
kml kswarm offload --larger-than 100MB --to-peer NAS-Server

# Offload by type
kml kswarm offload --mime video/mp4 --to-peer NAS-Server

# Offload specific files
kml kswarm offload 7f3a5c91... --to-peer NAS-Server
```

### Bring Files Back Locally

```bash
# Download a file back locally
kml get 7f3a5c91... --prefer-local

# Prefetch commonly used files
kml kswarm prefetch "budget*" --to-local

# Set cache size for local copies
kml config set kswarm.local_cache_size 10GB
```

### Automatic Tiering

```bash
# Configure automatic storage tiering
kml config set kswarm.tiering.enabled true
kml config set kswarm.tiering.strategy "age:size"
kml config set kswarm.tiering.offload_older_than 30  # days
kml config set kswarm.tiering.offload_larger_than 100MB
kml config set kswarm.tiering.storage_peer "NAS-Server"
kml config set kswarm.tiering.local_cache_size 5GB
kml config set kswarm.tiering.local_cache_ttl 7  # days
```

### Troubleshooting Offloading

```bash
# Check offload status
kml kswarm offload-status

# Check which files are local vs. remote
kml list --storage-location

# Force re-download
kml kswarm fetch 7f3a5c91... --force
```

## Remote File Access

### Searching Remote Files

When connected to peers, searches automatically include remote files:

```bash
kml query "budget spreadsheets"
```

Results will show both local and remote files, with a remote indicator:

```
Top 10 results for "budget spreadsheets":
  Score  Inode                                    Name              Location
  ─────  ─────                                    ────              ────────
  0.94  7f3a5c91-...    budget-2025.xlsx            Local
  0.87  a1b2c3d4-...    q4-budget.xlsx              Remote (NAS-Server)
  0.83  e5f6a7b8-...    marketing-budget.xlsx       Remote (Laptop-Home)
```

### Retrieving Remote Files

```bash
# Get a remote file (downloads from peer automatically)
kml get a1b2c3d4... --output budget.xlsx

# Streaming (no local copy)
kml get a1b2c3d4... --stream | less

# Get from a specific peer
kml get a1b2c3d4... --prefer-peer NAS-Server
```

### File Transfer Protocol

K-Swarm uses a custom file transfer protocol:

1. Request: Client sends inode and desired quality
2. Discovery: Peers with the file respond
3. Selection: Client selects the best peer (by latency/bandwidth)
4. Transfer: Encrypted chunked transfer with resumability
5. Verification: BLAKE3 hash verification on completion

```bash
# Show transfer status
kml kswarm transfers

# Cancel a transfer
kml kswarm cancel-transfer a1b2c3d4...

# Resume an interrupted transfer
kml kswarm resume-transfer a1b2c3d4...
```

### Offline Access

When a peer is offline, you can still see its files in search results but cannot download them:

```
Budget.xlsx
  Location: Remote (Laptop-Home) — OFFLINE
  Last synced: 2 hours ago
  Status: Cannot access — peer offline
```

Kamelot caches recently accessed files:

```bash
# Configure offline cache
kml config set kswarm.offline_cache_size 2GB
kml config set kswarm.offline_cache_ttl 7  # days
```

### Access Control

Control what files are accessible to which peers:

```bash
# Share all files with specific peers
kml kswarm share --with 12D3KooWAbCdEf...

# Share only specific files
kml kswarm share 7f3a5c91... --with 12D3KooWAbCdEf...

# Share by workspace
kml kswarm share-workspace "Team Project" --with 12D3KooWAbCdEf...

# Revoke access
kml kswarm revoke 7f3a5c91... --from 12D3KooWAbCdEf...
```

### Access Groups

```bash
# Create access groups
kml kswarm group create "team-alpha"
kml kswarm group add-peer "team-alpha" 12D3KooWAbCdEf...
kml kswarm group add-peer "team-alpha" 12D3KooWXyZ012...

# Share with a group
kml kswarm share-workspace "Team Project" --group "team-alpha"
```

## Security and Encryption

### Noise Protocol Framework

K-Swarm uses the Noise Protocol Framework with the XK handshake pattern:

```
→ e, s           : Initiator sends ephemeral + static public keys
← e, ee, se, s   : Responder sends ephemeral, performs DH operations, sends static
→ es, ss         : Initiator finalizes handshake
```

After handshake:
- Transport: ChaCha20-Poly1305 (authenticated encryption)
- Key rotation: Every 10 minutes or 100 MB transferred

### Peer Authentication

```bash
# Require peer authentication
kml config set kswarm.authentication.required true

# Add authorized peers
kml kswarm auth add 12D3KooWAbCdEf... --name "Laptop-Home"

# Remove authorized peer
kml kswarm auth remove 12D3KooWAbCdEf...

# List authorized peers
kml kswarm auth list

# Enable connection whitelist (reject all others)
kml config set kswarm.authentication.whitelist_only true
```

### Encryption Options

```bash
# Default (recommended)
kml config set kswarm.encryption "noise_xk"

# Pre-shared key (for added security)
kml config set kswarm.encryption "noise_xk_psk"
kml config set kswarm.psk_file ~/.kamelot/kswarm_psk

# Disable encryption (not recommended, local network only)
kml config set kswarm.encryption "none"
```

### Certificate-Based Authentication

For enterprise deployments:

```bash
# Generate certificate authority
kml kswarm cert ca generate --output ./kamelot-ca

# Generate peer certificate
kml kswarm cert generate --ca ./kamelot-ca --output ./peer-cert

# Configure peer
kml config set kswarm.tls.cert ./peer-cert/cert.pem
kml config set kswarm.tls.key ./peer-cert/key.pem
kml config set kswarm.tls.ca ./kamelot-ca/ca.pem
```

### Audit Logging

```bash
# Enable audit log
kml config set kswarm.audit.enabled true
kml config set kswarm.audit.log_path ~/.kamelot/kswarm-audit.log

# View audit log
kml kswarm audit
```

Output:
```
2026-06-19 10:00:00  CONNECT  Laptop-Home (12D3KooWAbC...)  192.168.1.101:9120
2026-06-19 10:01:00  QUERY    Laptop-Home                    "budget spreadsheets" → 3 results
2026-06-19 10:02:00  GET      Laptop-Home                    7f3a5c91... (budget.xlsx)  12.4 MB
2026-06-19 10:05:00  DISCONNECT Laptop-Home                  Graceful
```

## Performance Tuning

### Bandwidth Limits

```bash
# Limit upload speed
kml config set kswarm.bandwidth.upload_limit 10Mbps

# Limit download speed
kml config set kswarm.bandwidth.download_limit 50Mbps

# Set total bandwidth limit
kml config set kswarm.bandwidth.total_limit 100Mbps

# Schedule bandwidth limits
kml config set kswarm.bandwidth.schedule """
  Mon-Fri 09:00-17:00: 5Mbps
  Mon-Fri 17:00-09:00: 50Mbps
  Sat-Sun: 100Mbps
"""
```

### Connection Limits

```bash
# Max simultaneous peers
kml config set kswarm.max_peers 50

# Max connections per peer
kml config set kswarm.max_connections_per_peer 5

# Connection timeout
kml config set kswarm.connection_timeout 30  # seconds
```

### Caching

```bash
# Query cache
kml config set kswarm.cache.query_size 1000
kml config set kswarm.cache.query_ttl 300

# Metadata cache
kml config set kswarm.cache.metadata_size 10000
kml config set kswarm.cache.metadata_ttl 3600

# File cache
kml config set kswarm.cache.file_size 5GB
kml config set kswarm.cache.file_ttl 86400
```

### Compression

```bash
# Enable compression for transfers
kml config set kswarm.compression enabled
kml config set kswarm.compression.algorithm "zstd"
kml config set kswarm.compression.level 3  # 1-22
```

### Index Sync Optimization

```bash
# Sync interval
kml config set kswarm.sync.index_interval 60  # seconds

# Batch size
kml config set kswarm.sync.batch_size 1000  # vectors per batch

# Delta sync (only send changes)
kml config set kswarm.sync.delta_only true
```

## Troubleshooting

### Connection Refused

```bash
# Check if K-Swarm is running
kml kswarm status

# Check firewall
sudo ufw status  # Linux
# Check Windows Firewall

# Check if port is open
netstat -an | findstr 9120  # Windows
ss -tlnp | grep 9120        # Linux
lsof -i :9120               # macOS

# Try a different port range
kml config set kswarm.port_start 22000
kml config set kswarm.port_end 22009
kml kswarm restart
```

### Peer Not Discovered

```bash
# Check mDNS
kml kswarm discover --debug

# Check if peers are on the same network
# mDNS typically doesn't cross subnets

# Add peer manually
kml kswarm peer add 12D3KooW...@192.168.1.101:9120

# Check DHT
kml kswarm dht status
```

### Slow Transfers

```bash
# Test bandwidth
kml kswarm bandwidth 12D3KooWAbCdEf...

# Check for bottlenecks
kml kswarm transfers --verbose

# Enable compression
kml config set kswarm.compression.enabled true

# Limit number of concurrent transfers
kml config set kswarm.max_concurrent_transfers 3
```

### Sync Conflicts

```bash
# Check sync status
kml kswarm sync-status

# Resolve conflicts
kml kswarm sync-resolve --strategy "newest-wins"
# Strategies: newest-wins, oldest-wins, local-wins, remote-wins, manual

# Manual conflict resolution
kml kswarm sync-resolve --manual
```

### NAT Traversal Issues

```bash
# Check NAT type
kml kswarm nat-check

# Enable relay
kml config set kswarm.relay.enabled true

# Configure STUN server
kml config set kswarm.stun_servers ["stun.l.google.com:19302"]

# Configure TURN server
kml config set kswarm.turn_server "turn.example.com:3478"
kml config set kswarm.turn_username "user"
kml config set kswarm.turn_password "pass"
```

### High CPU/Memory Usage

```bash
# Reduce peer count
kml config set kswarm.max_peers 10

# Reduce sync frequency
kml config set kswarm.sync.index_interval 300

# Disable DHT
kml config set kswarm.discovery.dht false

# Limit indexing queue
kml config set kswarm.sync.max_pending 100
```

## Advanced Configuration

### Full K-Swarm Configuration Reference

```toml
[kswarm]
enabled = true
node_name = "Desktop-Office"
node_type = "full"  # full, index-only, edge, nas
port_start = 9120
port_end = 9129
address = "0.0.0.0"  # Listen on all interfaces
external_address = ""  # Public address for NAT

[kswarm.discovery]
mdns = true
mdns_interval = 30
dht = false
dht_interval = 60
dht_lookup_parallelism = 3
bootstrap_nodes = []
rendezvous_string = ""

[kswarm.authentication]
required = false
whitelist_only = false
psk_file = ""

[kswarm.encryption]
protocol = "noise_xk"
key_rotation_interval = 600  # seconds
key_rotation_bytes = 104857600  # 100 MB

[kswarm.transport]
tcp_enabled = true
quic_enabled = false
websocket_enabled = false
relay_enabled = false
relay_peers = []

[kswarm.nat]
stun_servers = ["stun.l.google.com:19302"]
turn_server = ""
turn_username = ""
turn_password = ""
enable_hole_punching = true

[kswarm.bandwidth]
upload_limit = "0"  # 0 = unlimited
download_limit = "0"
total_limit = "0"

[kswarm.sync]
index_interval = 60
workspace_interval = 30
canvas_interval = 5
delta_only = true
batch_size = 1000
max_pending = 1000

[kswarm.cache]
query_size = 1000
query_ttl = 300
metadata_size = 10000
metadata_ttl = 3600
file_size = "5GB"
file_ttl = 86400

[kswarm.compression]
enabled = false
algorithm = "zstd"
level = 3

[kswarm.tiering]
enabled = false
strategy = "age:size"
offload_older_than = 30
offload_larger_than = "100MB"
local_cache_size = "5GB"
local_cache_ttl = 7

[kswarm.audit]
enabled = false
log_path = "~/.kamelot/kswarm-audit.log"
log_level = "info"
```

### Command Reference

```bash
# Start/Stop
kml kswarm start
kml kswarm stop
kml kswarm restart

# Status
kml kswarm status
kml kswarm id
kml kswarm peers
kml kswarm transfers

# Discovery
kml kswarm discover
kml kswarm discover --subnet 10.0.0.0/24

# Peers
kml kswarm peer add <address>
kml kswarm peer remove <peer_id>
kml kswarm peer info <peer_id>
kml kswarm ping <peer_id>
kml kswarm bandwidth <peer_id>

# Sharing
kml kswarm share <inode> --with <peer_id>
kml kswarm share-workspace <workspace> --with <peer_id>
kml kswarm revoke <inode> --from <peer_id>

# Groups
kml kswarm group create <name>
kml kswarm group delete <name>
kml kswarm group add-peer <group> <peer_id>
kml kswarm group remove-peer <group> <peer_id>

# Storage
kml kswarm offload <inode> --to-peer <peer_id>
kml kswarm fetch <inode>
kml kswarm prefetch <pattern>
kml kswarm offload-status

# Sync
kml kswarm sync-status
kml kswarm sync-now
kml kswarm sync-resolve --strategy <strategy>

# Network
kml kswarm test
kml kswarm nat-check
kml kswarm bandwidth <peer_id>

# Security
kml kswarm auth add <peer_id>
kml kswarm auth remove <peer_id>
kml kswarm auth list
kml kswarm cert generate
kml kswarm audit

# Diagnostics
kml kswarm logs
kml kswarm dht status
kml kswarm debug
```

---

*Next tutorial: [10 — Recovery & Rollback](10-recovery-rollback.md)*
