▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document version: 1.0.0 | Updated: 2026-06-19
Category: help-bugs | ID: LIB-HLP-002

────────────────────────────────────────────────────────────────

# Connection Problems

## 1. Overview

Libern uses peer-to-peer (P2P) connections for communication between users. Unlike cloud-based applications that connect to a central server, Libern peers must discover each other on the network and establish direct encrypted connections. This architecture provides privacy and sovereignty but can lead to connection issues that are different from traditional applications.

This guide covers the most common connection problems:
1. mDNS discovery failing to find peers
2. WebSocket connection failures
3. Firewall and network configuration issues
4. NAT traversal problems
5. Network segment and routing issues

### P2P Connection Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Libern P2P Connection Model                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Phase 1: Discovery                                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Peer A broadcasts mDNS: _libern._tcp.local       │   │
│  │ Peer B responds with IP:port                     │   │
│  │ Protocol: UDP multicast (port 5353)              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Phase 2: Connection                                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Peer A opens WebSocket to Peer B's IP:port       │   │
│  │ Protocol: WebSocket over TCP (port 42069+)       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Phase 3: Synchronization                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Peers exchange CRDT state                        │   │
│  │ Real-time message relay                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 2. mDNS Discovery Issues

### 2.1 How mDNS Discovery Works

Libern uses multicast DNS (mDNS) to discover peers on the local network. When Libern starts, it broadcasts an mDNS query for `_libern._tcp.local`. Other Libern instances on the same network segment respond with their connection information. This is the same protocol used by Apple AirDrop and Chromecast.

### 2.2 Peers Not Showing Up

**Symptoms:** The peer list or server browser shows no other Libern instances, even though other users on the same network have Libern running.

**Causes and Solutions:**

- **Different network segments:** mDNS broadcasts are typically limited to a single broadcast domain. If users are on different VLANs, subnets, or Wi-Fi access points, mDNS may not propagate.
  - Solution: Configure mDNS relay on your network infrastructure, or use direct IP connections (see Section 4).

- **Network isolation:** Some enterprise or public Wi-Fi networks disable multicast traffic entirely.
  - Solution: Use manual peer connection via IP address.

- **Firewall blocking mDNS:** mDNS uses UDP port 5353. If this port is blocked, discovery will fail.
  - Windows: Check Windows Defender Firewall > Advanced Settings > Inbound Rules. Ensure UDP 5353 is allowed for Libern.
  - macOS: System Settings > Network > Firewall > Add Libern.
  - Linux: `sudo ufw allow 5353/udp` or configure firewalld appropriately.

- **Multiple network interfaces:** If you have multiple active network interfaces (Ethernet, Wi-Fi, VPN), mDNS may be sent on the wrong interface.
  - Solution: In Libern settings, specify the correct network interface for discovery.

### 2.3 mDNS Discovery Troubleshooting Table

| Symptom | Likely Cause | Diagnostic | Solution |
|---------|-------------|------------|----------|
| No peers found | Different subnet | `ip addr` or `ifconfig` | Use same subnet or relay |
| Peers appear slowly | Large network | Wait 30s, click Refresh | Add direct IP connections |
| Peers intermittently visible | Wi-Fi interference | Check signal strength | Use Ethernet |
| mDNS on wrong interface | VPN active | Check network interfaces | Specify correct interface |
| macOS peers not found | Firewall blocking | Check Privacy & Security | Allow Libern in firewall |

---

## 3. WebSocket Connection Failures

### 3.1 How WebSocket Connections Work

After mDNS discovery, Libern establishes WebSocket connections between peers for real-time communication. These connections carry messages, voice data, and synchronization events.

### 3.2 Connection Refused

**Symptoms:** Error message: "Connection refused" or "WebSocket connection failed."

**Causes and Solutions:**

- **Libern not running on target machine:** Verify the target has Libern running and is discoverable.

- **Port not open:** Libern uses a dynamic port range for WebSocket connections. The default is port 42069 but may vary.
  - Check which port Libern is listening on:
    - Windows: `netstat -ano | findstr "libern"`
    - macOS/Linux: `lsof -i -P | grep libern`
  - Ensure the port is not blocked by a firewall.

- **Process already bound to port:** Another application may be using the required port. Kill the conflicting process or change Libern's port configuration.

### 3.3 WebSocket Handshake Failed

**Symptoms:** "WebSocket handshake error" or "Unexpected response code."

**Causes and Solutions:**

- **Proxy interference:** Some enterprise proxies intercept WebSocket upgrade requests. Configure Libern to use direct connections or add Libern to the proxy bypass list.
  - Solution: Check proxy settings and configure Libern to bypass the proxy for local connections.

- **TLS/SSL mismatch:** If one peer is configured to use TLS and the other is not, the handshake will fail.
  - Solution: Ensure both peers have consistent encryption settings.

- **Version mismatch:** Different versions of Libern may use incompatible WebSocket protocols.
  - Solution: Ensure all peers are running the same or compatible versions of Libern.

### 3.4 Intermittent Connection Drops

**Symptoms:** Connection drops after a few seconds or minutes, then reconnects.

**Causes and Solutions:**

- **Network instability:** Poor Wi-Fi signal or network congestion.
  - Solution: Check network quality. Use wired Ethernet if possible.

- **Power saving features:** Some operating systems throttle network activity for battery conservation.
  - Windows: Check Power Options > Advanced > Wireless Adapter Settings > Power Saving Mode.
  - macOS: System Settings > Battery > Low Power Mode.
  - Linux: Check TLP or power-profiles-daemon settings.

---

## 4. Firewall and Network Configuration Issues

### 4.1 Windows Firewall Configuration

**Symptoms:** Libern works on some networks but not others.

**Solutions:**
1. Open Windows Defender Firewall with Advanced Security
2. Create Inbound Rule:
   - Rule Type: Port
   - Protocol: TCP (for WebSocket) and UDP (for mDNS)
   - Ports: 5353 (mDNS), 42069-42100 (Libern dynamic range)
   - Action: Allow the connection
   - Profile: Domain, Private (enable), Public (optional)
   - Name: "Libern P2P Communication"
3. Or use command line:
   ```
   netsh advfirewall firewall add rule name="Libern" dir=in action=allow program="C:\Program Files\Libern\libern.exe" enable=yes
   netsh advfirewall firewall add rule name="Libern UDP" dir=in action=allow protocol=udp localport=5353,42069-42100
   ```

### 4.2 Linux Firewall (UFW)

**Solutions:**
```
sudo ufw allow 5353/udp comment 'Libern mDNS'
sudo ufw allow 42069/tcp comment 'Libern P2P'
sudo ufw reload
```

For firewalld:
```
sudo firewall-cmd --add-port=42069/tcp --permanent
sudo firewall-cmd --add-port=5353/udp --permanent
sudo firewall-cmd --reload
```

---

## 5. Quick Diagnostic Checklist

1. Are both peers on the same network segment/subnet?
   - Check IP addresses: both should be in the same range (e.g., 192.168.1.x)
2. Can peers ping each other?
   - `ping <peer_ip_address>`
3. Is the Libern port open?
   - `Test-NetConnection <peer_ip> -Port 42069` (Windows)
   - `nc -zv <peer_ip> 42069` (macOS/Linux)
4. Is mDNS working?
   - `dns-sd -B _libern._tcp local` (macOS)
   - `avahi-browse _libern._tcp` (Linux)
5. Are both peers running the same Libern version?

---

## 6. Connection Troubleshooting Reference

| Issue | Diagnostic Command | Solution |
|-------|-------------------|----------|
| No mDNS discovery | `avahi-browse _libern._tcp` | Check firewall, subnet |
| Connection refused | `nc -zv <ip> 42069` | Check Libern is running |
| Intermittent drops | `ping -t <ip>` | Fix Wi-Fi, disable power saving |
| VPN interference | `ip route show` | Configure split tunneling |
| Enterprise block | Contact IT | Request port exceptions |
| Port conflict | `netstat -ano \| findstr 42069` | Kill conflicting process |

---

## 7. Network Configuration Examples

### Home Network (Typical)

```
┌─────────────────────────────────────┐
│  Internet ─── Router ─── Switch    │
│  (ISP)          │            │      │
│                 │            │      │
│            192.168.1.1   192.168.1.x │
│                            │        │
│                    ┌───────┴──────┐ │
│                    │              │ │
│               PC A (192.168.1.10) │ │
│               PC B (192.168.1.11) │ │
│               PC C (192.168.1.12) │ │
└─────────────────────────────────────┘

mDNS works across the switch (same subnet)
All PCs can discover each other
Default firewall allows LAN traffic
```

### Enterprise Network (VLANs)

```
┌─────────────────────────────────────┐
│  VLAN 10 (Engineering)             │
│  192.168.10.x                       │
│  ┌────────┐ ┌────────┐              │
│  │ PC A1  │ │ PC A2  │              │
│  └────────┘ └────────┘              │
│                                      │
│  VLAN 20 (Marketing)                │
│  192.168.20.x                       │
│  ┌────────┐ ┌────────┐              │
│  │ PC B1  │ │ PC B2  │              │
│  └────────┘ └────────┘              │
│                                      │
│  mDNS doesn't cross VLANs           │
│  Solution: mDNS relay or direct IP  │
└─────────────────────────────────────┘
```

### VPN Scenario

```
┌─────────────────────────────────────┐
│  Home Office           Corporate    │
│  ┌─────────┐          ┌─────────┐  │
│  │ PC A    │──VPN────►│ PC B    │  │
│  │ 10.0.0.2│          │ 10.0.0.3│  │
│  └─────────┘          └─────────┘  │
│       │                               │
│       ▼                               │
│  mDNS on 10.0.0.x (VPN network)      │
│  May not see local LAN peers         │
│  Solution: Use direct IP connections │
└─────────────────────────────────────┘
```

---

## 8. Port Information Reference

### Ports Used by Libern

| Port | Protocol | Purpose | Configurable |
|------|----------|---------|-------------|
| 5353 | UDP | mDNS peer discovery | No (standard) |
| 42069 | TCP | Default P2P WebSocket | Yes |
| 42070-42100 | TCP | Additional P2P connections | Yes (range) |

### Checking Open Ports

```bash
# Windows
netstat -ano | findstr "42069"
netstat -ano | findstr "5353"

# macOS/Linux
lsof -i :42069
lsof -i :5353
```

### Testing Port Connectivity

```bash
# Windows PowerShell
Test-NetConnection -ComputerName 192.168.1.10 -Port 42069

# macOS/Linux
nc -zv 192.168.1.10 42069
```

---

## 9. Network Performance Optimization

### For Better P2P Connections

1. **Use wired Ethernet** instead of Wi-Fi for stable connections
2. **Configure QoS** on your router to prioritize Libern traffic
3. **Disable power saving** on network adapters
4. **Use a dedicated VLAN** for peer-to-peer traffic in enterprise
5. **Keep firmware updated** on network equipment
6. **Reduce network congestion** during critical collaboration

### Bandwidth Requirements

| Activity | Bandwidth (per stream) |
|----------|----------------------|
| Text chat | Negligible (< 1 Kbps) |
| Voice chat (Opus) | 64-128 Kbps |
| Whiteboard sync | Variable (depending on strokes) |
| File transfer | Up to your network speed |
| .aioss sync | Variable (depending on entries) |

---

## 10. Connection Problem Decision Tree

```
Can't connect to peers?
    │
    ├── Are Libern instances running on both machines?
    │   ├── No → Start Libern on all machines
    │   └── Yes
    │
    ├── Are machines on the same network?
    │   ├── No → Use VPN or direct IP
    │   └── Yes
    │
    ├── Can peers ping each other?
    │   ├── No → Check physical connection, switch/router
    │   └── Yes
    │
    ├── Is mDNS working?
    │   ├── No → Check firewall (UDP 5353)
    │   ├── No → Check network isolation / VLAN
    │   └── Yes
    │
    ├── Is the P2P port open?
    │   ├── No → Allow TCP 42069 in firewall
    │   └── Yes
    │
    └── Are both on the same Libern version?
        ├── No → Update to same version
        └── Yes → Open a GitHub issue with diagnostics
```

---

## 11. Connection Testing with Libern CLI

### Built-in Network Tests

```bash
# Quick network status
libern --network-status

# Detailed connection test
libern --test-connection 192.168.1.100

# List all discovered peers
libern --list-peers

# Show current connections
libern --show-connections

# Network diagnostic report
libern --network-diagnostics
```

### Test Script for Windows

```powershell
# connection-test.ps1
$PEER_IP = "192.168.1.100"
$PORT = 42069

Write-Host "=== Libern Connection Test ==="
Write-Host "Peer IP: $PEER_IP"

# Test 1: Ping
Write-Host "`n1. Testing ping..."
if (Test-Connection -ComputerName $PEER_IP -Count 2 -Quiet) {
    Write-Host "   ✅ Ping successful"
} else {
    Write-Host "   ❌ Ping failed - check network connectivity"
}

# Test 2: Port
Write-Host "`n2. Testing port $PORT..."
$result = Test-NetConnection -ComputerName $PEER_IP -Port $PORT -WarningAction SilentlyContinue
if ($result.TcpTestSucceeded) {
    Write-Host "   ✅ Port $PORT is open"
} else {
    Write-Host "   ❌ Port $PORT is closed - check firewall"
}

# Test 3: Libern process
Write-Host "`n3. Checking Libern process..."
$proc = Get-Process libern -ErrorAction SilentlyContinue
if ($proc) {
    Write-Host "   ✅ Libern is running (PID: $($proc.Id))"
} else {
    Write-Host "   ❌ Libern is not running"
}

# Test 4: Libern version
Write-Host "`n4. Libern version..."
try {
    $version = & "libern" --version 2>$null
    Write-Host "   ✅ $version"
} catch {
    Write-Host "   ❌ Could not get version"
}

Write-Host "`n=== Test Complete ==="
```

### Test Script for macOS/Linux

```bash
#!/bin/bash
# connection-test.sh
PEER_IP="192.168.1.100"
PORT=42069

echo "=== Libern Connection Test ==="
echo "Peer IP: $PEER_IP"

echo -e "\n1. Testing ping..."
if ping -c 2 "$PEER_IP" &>/dev/null; then
    echo "   ✅ Ping successful"
else
    echo "   ❌ Ping failed"
fi

echo -e "\n2. Testing port $PORT..."
if nc -zv "$PEER_IP" "$PORT" 2>/dev/null; then
    echo "   ✅ Port $PORT is open"
else
    echo "   ❌ Port $PORT is closed"
fi

echo -e "\n3. Checking Libern process..."
PID=$(pgrep libern)
if [ -n "$PID" ]; then
    echo "   ✅ Libern is running (PID: $PID)"
else
    echo "   ❌ Libern is not running"
fi

echo -e "\n4. Libern version..."
libern --version 2>/dev/null && echo "   ✅ Version check passed" \
    || echo "   ❌ Version check failed"

echo -e "\n=== Test Complete ==="
```

---

## 12. Network Equipment Compatibility

### Router Compatibility

| Brand | mDNS Support | UPnP | Notes |
|-------|-------------|------|-------|
| Asus | ✅ Yes | ✅ Yes | Works out of box |
| TP-Link | ✅ Yes | ✅ Yes | May need to enable multicast |
| Netgear | ✅ Yes | ✅ Yes | Orbi systems may isolate |
| Ubiquiti | ⚠️ Default off | ✅ Yes | Enable mDNS reflector |
| Cisco | ⚠️ Enterprise | Varies | Requires IT configuration |
| MikroTik | ⚠️ Default off | ⚠️ Default off | Configure manually |
| pfSense | ⚠️ Default off | ⚠️ Default off | Install Avahi package |

### Switch Compatibility

- **Managed switches**: May need IGMP snooping configuration
- **Unmanaged switches**: Usually work (pass all multicast)
- **VLANs**: mDNS doesn't cross VLAN boundaries without a reflector

### Wi-Fi Considerations

- **Access point isolation**: Common on public Wi-Fi, blocks P2P
- **Client isolation**: Some APs prevent client-to-client communication
- **Multicast rate**: Low multicast rates can cause mDNS packet loss
- **5 GHz vs 2.4 GHz**: Both work; 5 GHz has less interference

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
