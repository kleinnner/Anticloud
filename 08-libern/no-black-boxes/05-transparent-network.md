▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

────────────────────────────────────────────────────────────────

# Transparent Network

**Category:** No Black Boxes
**File:** 05-transparent-network.md
**Revision:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [mDNS Discovery Is Visible](#mdns-discovery-is-visible)
3. [WebSocket P2P Is Inspectable](#websocket-p2p-is-inspectable)
4. [No Hidden Traffic](#no-hidden-traffic)
5. [Network Protocol Documentation](#network-protocol-documentation)
6. [Network Monitoring Tools](#network-monitoring-tools)
7. [Traffic Verification](#traffic-verification)
8. [References](#references)

---

## Overview

Libern's network communications are **fully transparent** — every protocol, every packet format, and every connection is documented, inspectable, and verifiable. There are no hidden connections, no covert channels, no unannounced network activity, and no encrypted tunnels concealing the nature of the traffic.

This document describes Libern's network protocols (mDNS for discovery and WebSocket for P2P messaging) and provides tools and techniques for users to inspect and verify all network activity.

---

## mDNS Discovery Is Visible

### What Is mDNS

Multicast DNS (mDNS) is a standard protocol (RFC 6762) for DNS-like name resolution on a local network without a central DNS server. Libern uses mDNS for **peer discovery** — finding other Libern instances on the same LAN segment.

### How Libern Uses mDNS

When Libern starts, it:
1. **Announces** its presence on the LAN by sending an mDNS multicast packet.
2. **Listens** for mDNS announcements from other Libern instances.
3. **Resolves** discovered peers' IP addresses and service ports.

### mDNS Packet Format

The mDNS packets follow the standard DNS format:

```
┌────────────────────────────────────────────────────┐
│        mDNS Query/Response (UDP port 5353)          │
├────────────────────────────────────────────────────┤
│ Transaction ID: 0x0000 (mDNS uses 0)                │
│ Flags: 0x8400 (Response, Authoritative)             │
│ Questions: 1                                        │
│ Answer RRs: 1                                      │
│ Authority RRs: 0                                    │
│ Additional RRs: 0                                   │
├────────────────────────────────────────────────────┤
│ Question: _libern._tcp.local (PTR query)           │
│ Answer: libern-instance-abc.local (SRV record)      │
│   Priority: 0, Weight: 0, Port: 9xxxx              │
│   Target: hostname.local                            │
│ Additional: A record for hostname.local             │
└────────────────────────────────────────────────────┘
```

### What Information Is Broadcast

| Field | Content | Sensitivity |
|-------|---------|-------------|
| Service type | `_libern._tcp` | Low (identifies the app) |
| Instance name | UUID v4 (e.g., `a1b2c3d4-...`) | Low (random identifier) |
| Hostname | Machine hostname (user-configurable) | Medium |
| Port | Ephemeral port number | Low |
| IP address | Machine's LAN IP | Low (already visible on LAN) |

### Scope

mDNS is confined to the local subnet:
- **Not routable** — mDNS packets do not cross routers.
- **Not forwarded** — Most enterprise networks block mDNS across VLANs.
- **Link-local** — Packets have TTL=255 and are dropped by routers.

### Visibility

Users can observe mDNS traffic using:

```bash
# Windows (requires Npcap/Wireshark)
# Or use PowerShell to check DNS cache
Get-DnsClientCache | Where-Object { $_.Entry -match "libern" }

# Linux
sudo tcpdump -i any port 5353 -v
# Look for queries containing "_libern._tcp.local"

# Cross-platform with Wireshark
# Filter: mdns and _libern
```

### Configurability

mDNS discovery can be:
- **Enabled** (default) — Other Libern instances on the LAN can discover this instance.
- **Disabled** — Instance is invisible to LAN discovery; must connect via IP directly.

---

## WebSocket P2P Is Inspectable

### How P2P Connections Work

Libern uses **direct WebSocket connections** for P2P messaging. When two peers synchronize:

1. Peer A resolves Peer B's IP address (via mDNS or manual entry).
2. Peer A initiates a WebSocket connection to `ws://<peer-b-ip>:<port>/libern`.
3. Ed25519 challenge-response handshake authenticates both peers.
4. CRDT operations are exchanged over the WebSocket.
5. Connection is kept open for real-time updates.

### WebSocket Message Format

All messages are JSON-encoded with Ed25519 signatures:

```json
{
  "type": "crdt_merge",
  "payload": {
    "server_id": "abc-123",
    "operations": [
      {
        "op": "add_message",
        "channel_id": "chan-456",
        "message": {
          "id": "msg-789",
          "content": "Hello!",
          "author_id": "user-001",
          "hlc_timestamp": 17180000000000001,
          "signature": "base64ed25519sig..."
        }
      }
    ]
  },
  "sender_id": "user-001",
  "timestamp": "2026-06-14T12:00:00.000Z",
  "signature": "base64ed25519sig..."
}
```

### What Is Visible on the Wire

| Message Field | Content | Inspectable? |
|--------------|---------|-------------|
| `type` | `crdt_merge`, `handshake`, `ping`, `pong` | Yes — plain JSON |
| `payload` | CRDT operations | Yes — plain JSON |
| `sender_id` | UUID of sender | Yes |
| `timestamp` | ISO 8601 | Yes |
| `signature` | Ed25519 signature | Yes — raw bytes in base64 |
| Message content | User messages | Yes — plain (unless E2EE enabled) |

### When E2EE Is Enabled

If end-to-end encryption is enabled:
- The outer JSON envelope remains visible (type, sender_id, timestamp, signature).
- The message content is encrypted (AES-256-GCM) and appears as base64-encoded ciphertext.
- Each peer can still inspect metadata and verify signatures.
- The fact that encryption is enabled is visible.

### Inspecting WebSocket Traffic

```bash
# Using websocat to connect directly
websocat ws://192.168.1.100:9876/libern
# Observe the handshake and CRDT messages

# Using Wireshark
# Filter: websocket and ip.addr == 192.168.1.100
# Follow TCP stream to see unencrypted messages

# Using tshark
tshark -i any -Y "websocket and ip.addr==192.168.1.100" -T json
```

---

## No Hidden Traffic

### Complete Network Traffic Inventory

Libern's total network traffic consists of exactly:

| Protocol | Direction | Purpose | Frequency | User Control |
|----------|-----------|---------|-----------|-------------|
| mDNS (UDP 5353) | Multicast | Peer discovery | On startup + every 60s | Can disable |
| WebSocket (TCP) | Peer-to-peer | CRDT sync | On demand | Must connect |
| Direct UDP | Peer-to-peer | Voice chat | On demand | Must join voice |
| HTTP(S) | Outbound | Model download | Once | Must click download |

### What Libern Does NOT Do

Libern does NOT generate any of the following network traffic:

| Traffic Type | Common in Other Apps | Libern |
|-------------|---------------------|--------|
| HTTP/HTTPS to analytics servers | Yes (Discord, Slack) | No |
| DNS lookups for non-local names | Yes (all cloud apps) | No |
| NTP queries (for tracking) | Some apps | No |
| STUN/TURN requests | Yes (WebRTC apps) | No |
| CRL/OCSP checks | Yes (certificate validation) | No |
| License server checks | Yes (commercial software) | No |
| Telemetry pings | Yes (almost all) | No |
| CDN resource loading | Yes (web apps) | No (local bundle) |
| Background update checks | Yes (many apps) | No |
| Beacon/navigator.sendBeacon | Yes (web analytics) | No |

### Connection Lifecycle

```
Libern Startup
  ├─ mDNS: Announce presence (UDP multicast, port 5353)
  ├─ mDNS: Listen for peers (UDP multicast, port 5353)
  └─ No other network connections

User Action: Join Server
  ├─ WebSocket: Connect to peer (TCP direct, ephemeral port)
  ├─ Handshake: Ed25519 challenge-response
  ├─ CRDT sync: Exchange operations
  └─ Connection remains open

User Action: Join Voice
  ├─ Direct UDP: Audio stream (ephemeral port)
  └─ Connection remains open

User Action: Download AI Model
  ├─ HTTP(S): Download from HuggingFace mirror (user-initiated)
  └─ Connection closes after download

Libern Shutdown
  ├─ WebSocket: Close connections
  ├─ UDP: Close sockets
  └─ mDNS: Goodbye packet (optional)
```

---

## Network Protocol Documentation

### mDNS Protocol

| Property | Value |
|----------|-------|
| Transport | UDP |
| Port | 5353 |
| Multicast address | 224.0.0.251 (IPv4), FF02::FB (IPv6) |
| Service type | `_libern._tcp.local` |
| TTL | 255 (link-local, not forwarded) |
| Standard | RFC 6762 |

### WebSocket P2P Protocol

| Property | Value |
|----------|-------|
| Transport | TCP |
| Scheme | `ws://` (plain), `wss://` (future) |
| Path | `/libern` |
| Encoding | JSON (UTF-8) |
| Authentication | Ed25519 challenge-response |
| Heartbeat | Ping/pong every 30 seconds |
| Reconnection | Exponential backoff (1s, 2s, 4s, ... max 60s) |

### Voice Protocol

| Property | Value |
|----------|-------|
| Transport | UDP |
| Codec | Opus (default) |
| Sample rate | 48 kHz |
| Frame size | 20 ms |
| Encryption | X25519 + AES-256-GCM (optional) |
| Jitter buffer | Adaptive, 40-200 ms |

### Model Download Protocol

| Property | Value |
|----------|-------|
| Transport | HTTPS |
| Port | 443 |
| Resume support | Yes (Range headers) |
| Verification | SHA-256 checksum |
| URL | Configurable (default: HuggingFace) |

---

## Network Monitoring Tools

### Built-in Network Logging

Libern includes a network diagnostic mode:

```bash
# Enable verbose network logging
libern --log-network

# Output shows every connection:
# [2026-06-14 12:00:00] mDNS: Announcing _libern._tcp.local on port 9876
# [2026-06-14 12:00:05] mDNS: Discovered peer a1b2c3d4-... at 192.168.1.101:9877
# [2026-06-14 12:00:10] WebSocket: Connecting to 192.168.1.101:9877/libern
# [2026-06-14 12:00:10] WebSocket: Handshake complete (peer: user-bob)
# [2026-06-14 12:00:15] WebSocket: Received CRDT merge (5 operations)
```

### Third-Party Monitoring

| Tool | Purpose | Platform |
|------|---------|----------|
| Wireshark | Full packet inspection | All |
| tcpdump | Command-line packet capture | Linux, macOS |
| netstat | Connection listing | All |
| lsof -i | Open ports and connections | Linux, macOS |
| Resource Monitor | Network activity | Windows |
| Microsoft Network Monitor | Packet capture | Windows |

### Complete Network Audit

```bash
#!/bin/bash
# network-audit.sh — Monitor all Libern network activity

echo "=== Libern Network Audit ==="
echo "Timestamp: $(date)"

echo ""
echo "=== Listening Ports ==="
netstat -tlnp 2>/dev/null | grep libern || echo "(use appropriate OS command)"

echo ""
echo "=== Active Connections ==="
netstat -tnp 2>/dev/null | grep libern || echo "(use appropriate OS command)"

echo ""
echo "=== mDNS Traffic (30s capture) ==="
timeout 30 tcpdump -i any port 5353 -c 10 2>/dev/null || echo "(requires root)"

echo ""
echo "=== WebSocket Traffic (30s capture) ==="
timeout 30 tcpdump -i any "tcp portrange 9000-10000" -c 20 2>/dev/null || echo "(adjust port range)"

echo ""
echo "=== Audit Complete ==="
```

---

## Traffic Verification

### Verification Steps

**Step 1: Baseline — No Activity**

With Libern running but no servers joined:
- Expected traffic: Only mDNS (every ~60 seconds).
- Verify with: `tcpdump port 5353` or Wireshark.
- No WebSocket, no HTTP, no unexpected UDP.

**Step 2: P2P Join**

When joining a server on LAN:
- Expected: WebSocket connection to peer's IP.
- Verify: WebSocket handshake visible in Wireshark.
- Verify: JSON messages containing CRDT operations.

**Step 3: Voice Call**

When joining a voice channel:
- Expected: UDP stream to peer's IP.
- Verify: Real-time audio packets in Wireshark.
- Verify: Opus codec signature in packet payloads.

**Step 4: Model Download**

When downloading the AI model:
- Expected: HTTPS connection to HuggingFace.
- Verify: TLS handshake to huggingface.co.
- Verify: HTTP GET with Range headers.

### Zero-Traffic Guarantee

When no user-initiated actions are in progress:
- Libern produces **zero outbound traffic**.
- No periodic heartbeats.
- No telemetry.
- No update checks.
- No DNS queries.
- No NTP queries.

This can be verified by running a packet capture for an extended period (hours) with Libern idle.

---


## Network Protocol Details — Expanded

### Complete Packet Inspection Guide

**mDNS Discovery Packets:**
```
Ethernet II
├─ Destination: 01:00:5E:00:00:FB (multicast)
├─ Source: [device MAC]
└─ Type: IPv4 (0x0800)

IP
├─ Source: [device IP]
├─ Destination: 224.0.0.251
└─ Protocol: UDP (17)

UDP
├─ Source Port: [ephemeral]
├─ Destination Port: 5353
└─ Length: [variable]

mDNS
├─ Transaction ID: 0x0000
├─ Flags: 0x8400 (Response, Authoritative)
├─ Questions: 1
├─ Answer RRs: 1
├─ Question: _libern._tcp.local PTR ?
├─ Answer (SRV):
│   ├─ Priority: 0
│   ├─ Weight: 0
│   ├─ Port: 9876
│   └─ Target: hostname.local
└─ Additional (A): [IP address]
```

**WebSocket CRDT Sync:**
```
TCP Connection
├─ Source: [peer A IP]:[port]
├─ Destination: [peer B IP]:[port]
└─ Protocol: TCP

WebSocket Upgrade
├─ GET /libern HTTP/1.1
├─ Upgrade: websocket
├─ Connection: Upgrade
├─ Sec-WebSocket-Key: [base64]
└─ Sec-WebSocket-Protocol: libern-crdt-v1

WebSocket Frames (JSON)
├─ Frame 1: Handshake challenge
│   {"type":"handshake","challenge":"base64...","pubkey":"base64..."}
├─ Frame 2: Handshake response
│   {"type":"handshake_response","signature":"base64...","pubkey":"base64..."}
├─ Frame 3+: CRDT operations
│   {"type":"crdt_merge","payload":{...},"sender_id":"...","signature":"..."}
└─ Heartbeat (every 30s)
    {"type":"ping"} / {"type":"pong"}
```

## Network Security Analysis

### Threat Model

| Threat | Vector | Severity | Mitigation |
|--------|--------|----------|------------|
| mDNS spoofing | Attacker sends fake mDNS responses | Medium | Verify peer identity via Ed25519 handshake |
| Man-in-the-middle | Attacker intercepts P2P connection | Low (encrypted) | P2P encryption + key verification |
| Eavesdropping | Passive network monitoring | None (encrypted) | Payloads are encrypted |
| Denial of service | Flood P2P with garbage data | Medium | Rate limiting, connection limits |
| Peer impersonation | Attacker claims another's identity | Low | Ed25519 challenge-response |
| Port scanning | Discover Libern instances | Low | mDNS can be disabled |

### Encryption Details

**P2P Channel Encryption (ChaCha20-Poly1305):**
```
Key Exchange:
  1. Each peer generates ephemeral X25519 keypair
  2. Peers exchange public keys during handshake
  3. Shared secret computed via X25519 ECDH
  4. Session key derived via SHA-256(shared_secret || nonce)

Encryption:
  Algorithm: ChaCha20-Poly1305 (AEAD)
  Nonce: 12 bytes (random, per-message)
  Key: 32 bytes (session-derived)
  Tag: 16 bytes (authentication)
```

**FIPS Mode Encryption (AES-256-GCM):**
```
Key Exchange:
  1. Each peer generates ephemeral ECDH P-384 keypair
  2. Peers exchange public keys during handshake
  3. Shared secret computed via ECDH P-384
  4. Session key derived via SHA-384(shared_secret || nonce)

Encryption:
  Algorithm: AES-256-GCM (AEAD)
  Nonce: 12 bytes (random, per-message)
  Key: 32 bytes (session-derived)
  Tag: 16 bytes (authentication)
```

## Network Configuration Reference

### Complete Network Settings

```json
{
  "network": {
    "discovery": {
      "mdns": {
        "enabled": true,
        "service_type": "_libern._tcp",
        "port": 0,
        "announce_interval_seconds": 60
      }
    },
    "p2p": {
      "websocket": {
        "enabled": true,
        "port": 0,
        "max_connections": 50,
        "heartbeat_seconds": 30,
        "timeout_seconds": 300,
        "reconnect_base_seconds": 1,
        "reconnect_max_seconds": 60
      },
      "voice": {
        "enabled": true,
        "port_range": "50000-50100",
        "codec": "opus",
        "sample_rate": 48000,
        "frame_size_ms": 20,
        "encryption": "auto"
      }
    },
    "security": {
      "tls": {
        "enabled": false,
        "cert_path": "",
        "key_path": ""
      },
      "allowed_ips": [],
      "blocked_ips": [],
      "rate_limit_per_second": 100
    }
  }
}
```

## Network Audit Log Examples

### Connection Lifecycle Log

```
[2026-06-19 10:00:00] NET: Libern starting up
[2026-06-19 10:00:01] mDNS: Announcing _libern._tcp on port 9876
[2026-06-19 10:00:02] mDNS: Listening on port 5353 for peer announcements
[2026-06-19 10:00:05] mDNS: Discovered peer "alice-laptop" at 192.168.1.50:9877
[2026-06-19 10:00:06] WS: Connecting to ws://192.168.1.50:9877/libern
[2026-06-19 10:00:06] WS: Handshake initiated (challenge sent)
[2026-06-19 10:00:06] WS: Handshake complete — peer authenticated as "alice"
[2026-06-19 10:00:07] CRDT: Starting initial sync with peer "alice"
[2026-06-19 10:00:08] CRDT: Sync complete — 1,247 operations exchanged
[2026-06-19 10:00:10] NET: Connection to "alice" established and synced
```

### Zero-Traffic Verification Log

```
[2026-06-19 14:00:00] NET: Libern idle — no user-initiated activity
[2026-06-19 14:00:01] mDNS: Announcement sent (scheduled, every 60s)
[2026-06-19 14:00:01] NET: No other network traffic detected
[2026-06-19 14:01:00] mDNS: Announcement sent
[2026-06-19 14:01:00] NET: No other network traffic detected
[2026-06-19 14:02:00] mDNS: Announcement sent
[2026-06-19 14:02:00] NET: No other network traffic detected
...
[2026-06-19 15:00:00] NET: 1 hour idle — only mDNS announcements (60 packets total)
[2026-06-19 15:00:00] NET: Zero unexpected network connections
[2026-06-19 15:00:00] NET: Zero DNS queries
[2026-06-19 15:00:00] NET: Zero HTTP/HTTPS requests
[2026-06-19 15:00:00] NET: Zero telemetry or analytics traffic
```


## References

- **Source code:** `apps/sandbox/src/audio.rs` — Voice UDP audio streaming
- **Source code:** `apps/sandbox/src/voice.rs` — Voice activity detection and transmission
- **Source code:** `crates/libern-core/src/crdt/mod.rs` — CRDT operations synced over WebSocket
- **Source code:** `crates/libern-core/src/crypto/mod.rs` — Ed25519 handshake for P2P auth
- **Source code:** `crates/libern-aioss/src/state_proof.rs` — Ed25519 signing for state proofs
- **RFC 6762:** Multicast DNS (mDNS)
- **RFC 6455:** WebSocket Protocol
- **RFC 6716:** Opus Audio Codec

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ