# Networking and Connectivity

This guide covers network configuration on 01s Sovereign, including WiFi, Ethernet, VPN, and firewall setup.

## NetworkManager

01s Sovereign uses NetworkManager for network management.

### Basic Commands

```bash
# Check device status
nmcli device status

# List connections
nmcli connection show

# Show active connection details
nmcli connection show --active
```

### WiFi

```bash
# List available networks
nmcli device wifi list

# Connect to open network
nmcli device wifi connect "SSID"

# Connect to secured network
nmcli device wifi connect "SSID" password "password"

# Connect to hidden network
nmcli device wifi connect "SSID" password "password" hidden yes

# Disconnect WiFi
nmcli device disconnect wlan0

# Reconnect
nmcli device connect wlan0

# Turn WiFi on/off
nmcli radio wifi on
nmcli radio wifi off

# Show saved WiFi passwords
nmcli -s connection show "SSID" | grep 802-11-wireless-security.psk
```

### Ethernet

```bash
# Enable/disable Ethernet
nmcli device connect eth0
nmcli device disconnect eth0
```

### Static IP Configuration

```bash
# Create static connection
nmcli connection add type ethernet con-name "static-eth" \
  ifname eth0 \
  ipv4.method manual \
  ipv4.addresses 192.168.1.100/24 \
  ipv4.gateway 192.168.1.1 \
  ipv4.dns "8.8.8.8 1.1.1.1"

# Activate
nmcli connection up "static-eth"

# Modify existing connection
nmcli connection modify "SSID" ipv4.method manual
nmcli connection modify "SSID" ipv4.addresses 192.168.1.100/24
```

### nmtui (Text User Interface)

For interactive configuration:

```bash
nmtui
```

## Advanced Network Configuration

### Bonding

```bash
# Create bond interface
nmcli connection add type bond con-name bond0 ifname bond0 bond.options "mode=balance-rr"

# Add slaves
nmcli connection add type ethernet slave-type bond con-name bond0-eth0 ifname eth0 master bond0
nmcli connection add type ethernet slave-type bond con-name bond0-eth1 ifname eth1 master bond0

# Activate
nmcli connection up bond0
```

### Bridging

```bash
# Create bridge
nmcli connection add type bridge con-name br0 ifname br0

# Add interface
nmcli connection add type ethernet slave-type bridge con-name br0-eth0 ifname eth0 master br0
```

## VPN Configuration

### OpenVPN

```bash
# Install OpenVPN
sudo pacman -S openvpn networkmanager-openvpn

# Import configuration
nmcli connection import type openvpn file client.ovpn

# Connect
nmcli connection up client
```

### WireGuard

```bash
# Install WireGuard
sudo pacman -S wireguard-tools networkmanager-wireguard

# Generate keys
wg genkey | tee /etc/wireguard/private.key | wg pubkey > /etc/wireguard/public.key

# Configure
nmcli connection add type wireguard con-name wg0 ifname wg0 \
  ipv4.method manual \
  ipv4.addresses 10.0.0.2/24

nmcli connection modify wg0 \
  wireguard.private-key /etc/wireguard/private.key

nmcli connection modify wg0 \
  +wireguard.peer-endpoint "vpn.example.com:51820" \
  +wireguard.peer-public-key "PEER_PUBLIC_KEY" \
  +wireguard.peer-allowed-ips "0.0.0.0/0"
```

## DNS Configuration

### System DNS

```bash
# Check current DNS
nmcli device show | grep DNS

# Set DNS via NetworkManager
nmcli connection modify "SSID" ipv4.dns "1.1.1.1 8.8.8.8"
nmcli connection down "SSID"
nmcli connection up "SSID"
```

### DNS-over-HTTPS

```bash
# Install stubby DNS-over-TLS proxy
sudo pacman -S stubby

# Configure stubby
sudo nano /etc/stubby/stubby.yml

# Enable stubby service
sudo systemctl enable --now stubby

# Configure NetworkManager to use local stubby
nmcli connection modify "SSID" ipv4.dns "127.0.0.1"
```

Stubby is a legitimate DNS privacy tool that encrypts DNS queries using TLS. It acts as a local proxy, forwarding DNS requests to upstream resolvers over an encrypted connection.

## Firewall

### Firewalld Basics

```bash
# Check status
sudo firewall-cmd --state

# List zones
sudo firewall-cmd --list-all-zones

# Allow service
sudo firewall-cmd --add-service=ssh --permanent
sudo firewall-cmd --reload

# Allow port
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --reload

# Block port
sudo firewall-cmd --remove-port=8080/tcp --permanent
sudo firewall-cmd --reload

# Check rules
sudo firewall-cmd --list-all
```

### Creating Custom Rules

```bash
# Create rich rule
sudo firewall-cmd --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" service name="ssh" accept' --permanent

# Port forwarding
sudo firewall-cmd --add-forward-port=port=80:proto=tcp:toport=8080 --permanent
```

## Bluetooth

```bash
# Check Bluetooth status
bluetoothctl show

# Enable Bluetooth
sudo systemctl enable --now bluetooth

# Pair device
bluetoothctl
# Inside bluetoothctl:
# power on
# agent on
# scan on
# pair XX:XX:XX:XX:XX:XX
# connect XX:XX:XX:XX:XX:XX
# trust XX:XX:XX:XX:XX:XX
```

## Network Troubleshooting

### Diagnostic Commands

```bash
# Check connectivity
ping -c 4 8.8.8.8

# DNS resolution
nslookup google.com
dig google.com

# Trace route
traceroute google.com

# Check listening ports
ss -tulpn

# Network statistics
netstat -i

# Bandwidth test
speedtest-cli

# Check wireless info
iwconfig
iw dev wlan0 link
```

### Common Issues

| Issue | Solution |
|-------|----------|
| WiFi not detected | Check `rfkill list`, `sudo rfkill unblock wifi` |
| DHCP not working | `sudo dhcpcd eth0` |
| DNS resolution fails | Check `/etc/resolv.conf`, restart NetworkManager |
| Slow connection | Check for interference, change WiFi channel |
| VPN won't connect | Check firewall rules, correct credentials |

## Network Performance

```bash
# Check link speed
ethtool eth0

# Monitor bandwidth
sudo pacman -S nload
nload

# Check for packet loss
ping -c 100 -i 0.1 8.8.8.8 | grep loss
```

---

## See Also

- [Post-Installation Setup](07-post-installation-setup.md)
- [Security Hardening](18-security-hardening.md)
- [Network Troubleshooting](../help/07-network-troubleshooting.md)

---



## Detailed Walkthrough

### Step-by-Step Guide

Follow these steps to complete the task described in this guide:

1. Open a terminal (Ctrl+Alt+T or Super+T)
2. Verify you are in the correct environment
3. Follow each instruction in sequence
4. Check the expected output at each step
5. If something goes wrong, refer to the troubleshooting section below

### Expected Outputs at Each Step

| Step | Expected Output | If Different |
|------|----------------|--------------|
| Command check | Command executes without error | Check PATH and permissions |
| Configuration apply | Setting is updated | Check for error messages |
| Verification | Pass / Success message | Re-check previous steps |
| Completion | Process completes | Check system logs |

### Common Error Messages

| Error Message | Meaning | Solution |
|---------------|---------|----------|
| "Permission denied" | Need sudo/root | Prepend sudo to the command |
| "Command not found" | Tool not installed | Install with sudo pacman -S |
| "File not found" | Wrong path | Check path with ls or ind |
| "Connection refused" | Service not running | Start with systemctl start |
| "Invalid argument" | Wrong syntax | Check command syntax in docs |

### Verification Commands

After completing the guide steps, verify with:

`ash
# Check tool is accessible
which <tool-name>

# Check version
<tool-name> --version

# Check service status
systemctl status <service-name>

# View logs
journalctl -u <service-name> --no-pager -n 20
`

### Alternative Approaches

If the primary method doesn't work for your setup:

1. **Manual method**: Perform each step manually instead of using automation
2. **GUI method**: Use graphical tools instead of command line
3. **Container method**: Run in a Docker/Podman container
4. **VM method**: Set up in a virtual machine first

### Performance Considerations

| Factor | Impact | Recommendation |
|--------|--------|---------------|
| Disk I/O | Slow on HDD | Use SSD for better performance |
| Network speed | Affects downloads | Use wired connection |
| RAM | Affects compilation | Close other applications |
| CPU cores | Affects parallel tasks | Use -j flag for parallel builds |

### Next Steps

Once you've completed this guide, move to the next tutorial, practice on a test system, or explore the feature documentation for advanced options.


## Reference Information

### Related Commands
| Command | Purpose | Example |
|---------|---------|---------|
| man <topic> | View manual page | man ls |
| <command> --help | Show help | zerocli --help |
| info <topic> | GNU info page | info bash |

### Configuration Files
| File | Purpose | Location |
|------|---------|----------|
| System config | Global settings | /etc/ |
| User config | Per-user settings | ~/.config/ |
| Service config | Service definitions | /etc/systemd/system/ |
| Application data | Persistent data | ~/.local/share/ |

### Log Files Reference
| Log | Command | Location |
|-----|---------|----------|
| System journal | journalctl -xe | /var/log/journal/ |
| Boot log | dmesg | Kernel ring buffer |
| Auth log | journalctl -u sshd | /var/log/ |
| Ledger | 01s-ledger tail | ~/ledger/ |
| Health | 01s-ledger health status | logs/health/ |

### Environment Variables
| Variable | Purpose | Default |
|----------|---------|---------|
| HOME | User home directory | /home/username |
| PATH | Executable search paths | /usr/local/bin:/usr/bin:/bin |
| LANG | System locale | en_US.UTF-8 |
| TERM | Terminal type | xterm-256color |
| EDITOR | Default text editor | nano |
| SHELL | Default shell | /bin/bash |
| USER | Current username | (login name) |

### Service Management Quick Reference
| Action | System Service | User Service |
|--------|---------------|--------------|
| View status | systemctl status <name> | systemctl --user status <name> |
| Start | sudo systemctl start <name> | systemctl --user start <name> |
| Stop | sudo systemctl stop <name> | systemctl --user stop <name> |
| Enable at boot | sudo systemctl enable <name> | systemctl --user enable <name> |
| Disable | sudo systemctl disable <name> | systemctl --user disable <name> |
| View logs | journalctl -u <name> | journalctl --user -u <name> |

### File System Hierarchy
| Directory | Purpose |
|-----------|---------|
| /bin | Essential user binaries |
| /boot | Boot loader files |
| /dev | Device files |
| /etc | System configuration |
| /home | User home directories |
| /proc | Process information |
| /root | Root user home |
| /run | Runtime variable data |
| /tmp | Temporary files |
| /usr | User system resources |
| /var | Variable data (logs, spools) |

### Package File Extensions
| Extension | Type | Install Command |
|-----------|------|----------------|
| .pkg.tar.zst | Standard package | pacman -U |
| .pkg.tar.xz | Legacy package | pacman -U |
| .src.tar.gz | Source package | makepkg -si |
| .flatpak | Flatpak app | flatpak install |
| .AppImage | Portable app | chmod +x && ./ |

## Common Mistakes

| Mistake | Why It Happens | Correct Approach |
|---------|---------------|------------------|
| WiFi not detected | Missing firmware | Install linux-firmware package |
| Ethernet not working | DHCP not enabled | Use systemctl enable --now systemd-networkd |
| DNS not resolving | Wrong resolver config | Check /etc/resolv.conf |
| Firewall blocking traffic | Default deny policy | Configure 
ftables rules |

## Practice Exercises

1. Review the key concepts covered in this guide
2. Try applying each configuration step on your system
3. Document any differences you observe from expected behavior
4. Share your experience in the community forums
5. Write a summary of what you learned

## Verification Checklist

- [ ] You can perform the main task described in this guide
- [ ] You understand the common mistakes and how to avoid them
- [ ] You can troubleshoot basic issues independently
- [ ] You know where to find additional help if needed

### Common Pitfalls (Networking)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| WiFi not connecting | Missing firmware package | Install linux-firmware and iwd or NetworkManager |
| Static IP reverting after reboot | NetworkManager config not saved | Save profile in nmcli connection |
| DNS resolution slow | Wrong resolver configured | Use systemd-resolved with Cloudflare/Google DNS |
| Firewall blocking legitimate traffic | Default rules too strict | Add explicit allow rules for services |
| VPN not routing correctly | Split tunnel vs full tunnel | Check VPN config for route settings |

## Practice Exercises (Advanced)

1. **Network Topology Map**: Map all devices on your local network using 
map; identify open ports and services
2. **Custom Firewall Ruleset**: Design a stateful nftables ruleset that logs all denied traffic to the ledger
3. **WireGuard VPN Setup**: Set up a WireGuard VPN server and client; verify traffic is encrypted and logged
4. **Bandwidth Monitoring**: Use 
ethogs or iftop to identify which applications consume the most bandwidth
5. **DNS-over-HTTPS Configuration**: Enable DNS-over-HTTPS using systemd-resolved; verify queries are encrypted

## Further Reading

- [Security Hardening](18-security-hardening.md) â€” Firewall and network security
- [Post-Installation Setup](07-post-installation-setup.md) â€” Network setup
- [Network Troubleshooting](../help/07-network-troubleshooting.md) â€” Solving issues
- [Systemd Service Architecture](../features/17-systemd-service-architecture.md) â€” Service management
- [Enterprise Deployment](../enterprise/02-deployment-models.md) â€” Network config
- [Data Safety Overview](../data-safety/01-overview-of-data-safety-in-01s.md) â€” Data in transit
- [Encryption at Rest](../data-safety/06-encryption-at-rest-and-in-transit.md) â€” Network encryption
- [Privacy Policy](../privacy/01-privacy-policy.md) â€” Data collection
- [Network FAQ](../faq/06-security-faq.md) â€” Common questions
- [Community Network Help](../community/04-communication-channels.md) â€” Peer support

## Static IP Configuration

```bash
cat > /etc/systemd/network/20-wired.network << 'NET'
[Match]
Name=enp0s3
[Network]
Address=192.168.1.100/24
Gateway=192.168.1.1
DNS=1.1.1.1
Domains=local.lan
NET
systemctl enable --now systemd-networkd
systemctl enable --now systemd-resolved
```

## nftables Rules for Common Services

```bash
table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;
        ct state established,related accept
        iif lo accept
        ip saddr 192.168.0.0/16 tcp dport 22 accept
        tcp dport { 80, 443 } accept
        udp dport 53 accept
        icmp type echo-request accept
        log prefix "nftables-drop: " limit rate 5/minute
        counter drop
    }
}
```

## Real-World Scenario: Remote Office Setup

A remote office deploys 10 01s Sovereign workstations behind a site-to-site VPN. Configuration: (1) WireGuard VPN to headquarters, (2) DNS via internal resolver, (3) Firewall allows only VPN subnet SSH access, (4) Printers accessible via IPP on local subnet, (5) Internet access via headquarters proxy. Ledger on each workstation records all network connections initiated, enabling security team to verify no unauthorized connections exist.

## Network Manager Comparison

| Feature | NetworkManager | systemd-networkd | netctl | iwd |
|---------|---------------|-----------------|--------|-----|
| Default in 01s | Yes | Optional | Optional | Optional |
| GUI Support | Full | None | None | None |
| WiFi | Full | Minimal | Full | Full |
| VPN | Full | Manual | Manual | None |
| Complexity | Low | Medium | Medium | Low |
| Configuration | CLI + GUI | Config files | Profiles | CLI |

## Common Network Configurations

### Home Network (DHCP)
```bash
# Default - usually works out of the box
systemctl enable --now NetworkManager
nmtui  # Interactive configuration
```

### Office Network (Static IP + Proxy)
```bash
# Configure static IP
nmcli con mod "Wired" ipv4.method manual \
  ipv4.addresses 192.168.1.100/24 \
  ipv4.gateway 192.168.1.1 \
  ipv4.dns "8.8.8.8 1.1.1.1"

# Set HTTP proxy
gsettings set org.gnome.system.proxy mode 'manual'
gsettings set org.gnome.system.proxy.http host 'proxy.company.com'
gsettings set org.gnome.system.proxy.http port 8080
```

### Public WiFi (Captive Portal)
```bash
# NetworkManager handles captive portal detection
# Open browser and authenticate
# Verify with:
curl --insecure https://captiveportal.01s.sovereign
```

## Network Performance Testing

```bash
# Test bandwidth
curl -o /dev/null http://speedtest.tele2.net/100MB.zip

# Test latency
ping -c 10 1.1.1.1

# Test DNS resolution
dig +stats google.com

# Test MTU (find optimal MTU size)
ping -M do -s 1472 google.com  # Decrease until no fragmentation

# Traceroute
traceroute -n google.com

# Check for packet loss
mtr -r -c 100 google.com
```

## Wireless Troubleshooting

```bash
# Check WiFi adapter
iw dev
iwconfig

# Scan for networks
sudo iw dev wlan0 scan | grep SSID

# Check connection status
iw dev wlan0 link

# Check signal strength
iw dev wlan0 station dump

# Restart NetworkManager
sudo systemctl restart NetworkManager

# View connection history
nmcli connection show

# Delete problematic connection
nmcli connection delete "OldWiFiName"

# Re-scan and reconnect
nmcli device wifi rescan
nmcli device wifi connect "MyNetwork" password "mypassword"
```

## VPN Configuration (WireGuard)

```bash
# Install WireGuard
sudo pacman -S wireguard-tools

# Create configuration
sudo nano /etc/wireguard/wg0.conf
# [Interface]
# PrivateKey = <your-private-key>
# Address = 10.0.0.2/24
# 
# [Peer]
# PublicKey = <server-public-key>
# Endpoint = vpn.example.com:51820
# AllowedIPs = 0.0.0.0/0

# Start VPN
sudo systemctl enable --now wg-quick@wg0

# Verify connection
sudo wg show
ping -c 3 10.0.0.1
```

## Network Diagnostics Reference

```bash
# Quick connectivity test
curl -I https://01s.sovereign

# DNS resolution test
host 01s.sovereign

# Route tracing
traceroute -n 01s.sovereign

# Port scanning (local)
ss -tuln

# Bandwidth test
curl -o /dev/null http://speedtest.example.com/1GB.bin

# WiFi diagnostics
iw dev wlan0 link
iw dev wlan0 station dump

# Packet capture
sudo tcpdump -i any port 80 -c 100
```

## Firewall Rule Examples

```bash
# Allow SSH only from office IP
sudo nft add rule inet filter input ip saddr 203.0.113.0/24 tcp dport 22 accept

# Rate limit SSH connections
sudo nft add rule inet filter input tcp dport 22 meter ssh-meter { ip saddr limit rate 10/minute } accept

# Allow local network file sharing
sudo nft add rule inet filter input ip saddr 192.168.0.0/16 tcp dport { 139, 445 } accept
sudo nft add rule inet filter input ip saddr 192.168.0.0/16 udp dport { 137, 138 } accept

# Block known bad IPs
sudo nft add set inet filter bad_ips { type ipv4_addr; }
sudo nft add element inet filter bad_ips { 1.2.3.4, 5.6.7.8 }
sudo nft add rule inet filter input ip saddr @bad_ips drop

# Log dropped packets
sudo nft add rule inet filter input log prefix "NFT-DROP: " drop

# Save rules
sudo nft list ruleset > /etc/nftables.conf
```

---

Lois-Kleinner and 0-1.gg 2026 Copyright

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
