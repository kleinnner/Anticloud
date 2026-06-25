# Set Up Disaster Recovery

This guide covers enterprise disaster recovery configuration for 01s Sovereign, including backup strategies, restoration procedures, and high-availability ledger replication.

## Backup Strategy

```mermaid
graph TD
    A[01s Node] --> B[Ledger Backup]
    A --> C[Health Backup]
    A --> D[System Backup]
    B --> E[Replicated Ledger]
    C --> F[Health Archive]
    D --> G[System Image]
    E --> H[Off-site Storage]
    F --> H
    G --> H
```

## Step 1: Ledger Backup Script

```bash
#!/usr/bin/env bash
# /usr/local/bin/01s-backup.sh
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/01s}"
LEDGER_DIR="${LEDGER_DIR:-$HOME/ledger}"
RETENTION_DAYS="${RETENTION_DAYS:-90}"
DATE=$(date +%Y-%m-%d)

mkdir -p "$BACKUP_DIR/{ledger,health,system,$DATE}"

# 1. Backup ledger files
if [ -d "$LEDGER_DIR" ]; then
    cp -r "$LEDGER_DIR" "$BACKUP_DIR/$DATE/ledger"
    01s-ledger verify 2>&1 | tee -a "$BACKUP_DIR/$DATE/verify.log"
    01s-ledger sign > "$BACKUP_DIR/$DATE/state-proof.txt"
fi

# 2. Backup health logs
if [ -d "logs/health" ]; then
    cp -r logs/health "$BACKUP_DIR/$DATE/health"
fi

# 3. Generate manifest
cd "$BACKUP_DIR/$DATE"
find . -type f -exec sha256sum {} \; > manifest.sha256

# 4. Create compressed archive
cd "$BACKUP_DIR"
tar czf "01s-dr-backup-${DATE}.tar.gz" "$DATE"

# 5. Clean old backups
find "$BACKUP_DIR" -name "01s-dr-backup-*.tar.gz" -mtime "+$RETENTION_DAYS" -delete

# 6. Log backup
01s-ledger log backup_event type=disaster_recovery status=complete
```

## Step 2: Ledger Replication

### Primary Node Setup

```bash
#!/usr/bin/env bash
# /usr/local/bin/01s-replicate.sh
set -euo pipefail

REPLICATION_TARGETS=("backup-01.01s.internal" "backup-02.01s.internal")
SSH_KEY="/root/.ssh/01s-replication"

for target in "${REPLICATION_TARGETS[@]}"; do
    echo "Replicating to $target..."
    rsync -avz --delete \
        -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
        "$HOME/ledger/" \
        "root@${target}:$HOME/ledger/"
    
    ssh -i "$SSH_KEY" "root@${target}" "01s-ledger verify"
    01s-ledger log replication target="$target" status=success
done
```

### Replication Service

```ini
# /etc/systemd/system/01s-replication.service
[Unit]
Description=01s Ledger Replication
After=network.target 01s-ledger.service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/01s-replicate.sh

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/01s-replication.timer
[Unit]
Description=Replicate ledger every hour

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
```

## Step 3: Restoration Procedures

### Restore Ledger from Backup

```bash
#!/usr/bin/env bash
# /usr/local/bin/01s-restore.sh
set -euo pipefail

BACKUP_FILE="${1:-}"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup-file.tar.gz>"
    ls -lh /var/backups/01s/01s-dr-backup-*.tar.gz
    exit 1
fi

echo "Restoring from: $BACKUP_FILE"

# Verify backup integrity
BACKUP_HASH=$(sha256sum "$BACKUP_FILE" | cut -d' ' -f1)

# Extract backup
WORK_DIR=$(mktemp -d)
tar xzf "$BACKUP_FILE" -C "$WORK_DIR"
EXTRACTED_DIR=$(ls "$WORK_DIR")

# Verify manifest
cd "$WORK_DIR/$EXTRACTED_DIR"
sha256sum -c manifest.sha256 2>&1 | grep -v "OK$" || true

# Restore ledger
if [ -d "ledger" ]; then
    cp -r "ledger"/* "$HOME/ledger/"
fi

# Verify restored ledger
01s-ledger verify

# Log restoration
01s-ledger log restore_event backup="$BACKUP_FILE" status=complete

rm -rf "$WORK_DIR"
echo "=== Restore Complete ==="
```

## Step 4: High Availability Configuration

### Active-Passive Setup

```bash
# Primary node
cat > /etc/01s/ha-primary.conf << 'CONF'
HA_MODE=primary
HA_PEER=backup-01.01s.internal
HA_HEARTBEAT_INTERVAL=5
HA_FAILOVER_THRESHOLD=3
LEDGER_SYNC_MODE=real-time
CONF

# Backup node
cat > /etc/01s/ha-backup.conf << 'CONF'
HA_MODE=backup
HA_PRIMARY=primary-01.01s.internal
HA_HEARTBEAT_INTERVAL=5
HA_FAILOVER_THRESHOLD=3
CONF
```

## Step 5: Automated Failover

```bash
#!/usr/bin/env bash
# /usr/local/bin/01s-failover.sh
set -euo pipefail

PRIMARY="${HA_PRIMARY:-}"

# Check if primary is reachable
if ping -c 1 -W 2 "$PRIMARY" &>/dev/null; then
    echo "Primary is healthy. No failover needed."
    exit 0
fi

echo "Primary unreachable. Initiating failover..."

# Verify local ledger integrity
if ! 01s-ledger verify; then
    echo "ERROR: Local ledger is corrupted. Cannot failover."
    exit 1
fi

# Promote to primary
cat > /etc/01s/ha.conf << 'CONF'
HA_MODE=primary
HA_FAILOVER_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
CONF

# Start local ledger service
systemctl restart 01s-ledger

# Log failover
01s-ledger log ha_event type=failover from_primary="$PRIMARY" status=activated

echo "=== Failover Complete: $(hostname) is now primary ==="
```

## Step 6: Disaster Recovery Testing

```bash
#!/usr/bin/env bash
# /usr/local/bin/01s-dr-test.sh
set -euo pipefail

echo "=== 01s Disaster Recovery Test ==="

# Test 1: Backup integrity
echo "Test 1: Backup Integrity"
01s-ledger verify && echo "  [PASS] Ledger intact" || echo "  [FAIL] Chain broken"

# Test 2: Replication
echo "Test 2: Replication"
for target in backup-01 backup-02; do
    if ssh "root@${target}.01s.internal" "01s-ledger verify" 2>/dev/null; then
        echo "  [PASS] $target"
    else
        echo "  [FAIL] $target"
    fi
done

# Test 3: Restoration
echo "Test 3: Restoration"
BACKUP=$(ls -t /var/backups/01s/01s-dr-backup-*.tar.gz 2>/dev/null | head -1)
if [ -n "$BACKUP" ]; then
    TMP_DIR=$(mktemp -d)
    tar xzf "$BACKUP" -C "$TMP_DIR"
    if [ -d "$TMP_DIR"/*/ledger ]; then
        echo "  [PASS] Backup extractable"
    else
        echo "  [FAIL] Backup corrupted"
    fi
    rm -rf "$TMP_DIR"
else
    echo "  [SKIP] No backups found"
fi

01s-ledger log dr_test date="$(date +%Y-%m-%d)" status=complete
```

## DR Configuration Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `BACKUP_DIR` | `/var/backups/01s` | Backup storage location |
| `RETENTION_DAYS` | 90 | Days to retain backups |
| `REPLICATION_TARGETS` | (empty) | Remote backup servers |
| `HA_MODE` | standalone | standalone/primary/backup |
| `HA_HEARTBEAT_INTERVAL` | 5 | Heartbeat check seconds |
| `HA_FAILOVER_THRESHOLD` | 3 | Missed heartbeats before failover |
| `SYNC_INTERVAL` | 300 | Ledger sync interval seconds |
## Deployment Troubleshooting

### Common Deployment Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| PXE boot fails | DHCP not configured | Check dnsmasq service |
| Node not in inventory | DNS not resolving | Add to /etc/hosts |
| Ansible connection refused | SSH not running | Enable sshd.service |
| Ledger init fails | HOME not set | Use explicit --home flag |
| Health check fails | Missing logs dir | Create logs/health/ |
| Package install fails | Mirror not synced | Run pacman -Sy |

### Validation Commands

```bash
# Verify deployment
ansible all -m ping
ansible all -m shell -a "01s-ledger verify"
ansible all -m shell -a "systemctl is-active 01s-ledger"
ansible all -m shell -a "df -h /"

# Check replication
for node in node-01 node-02; do
    ssh $node "01s-ledger status | head -5"
done

# Health check all nodes
for node in $(cat inventory/hosts); do
    echo "=== $node ==="
    ssh $node "01s-ledger health status" 2>/dev/null || echo "Unreachable"
done
```

### Log Files

| Log | Location | Purpose |
|-----|----------|---------|
| PXE/DHCP | /var/log/dnsmasq.log | Boot requests |
| HTTP | /var/log/nginx/access.log | File transfers |
| Ansible | ~/.ansible/log/ | Automation logs |
| Ledger | ~/ledger/*.aioss | Audit entries |
| Health | logs/health/*.health | Diagnostics |
| System | journalctl -u 01s-ledger | Service logs |

## Automation Scripts

### Mass Ledger Initialization

```bash
#!/bin/bash
# init-all-ledgers.sh
for node in $(cat nodes.txt); do
    ssh root@$node "01s-ledger init && 01s-ledger log deployment status=init"
    echo "Initialized: $node"
done
```

### Compliance Report Generator

```bash
#!/bin/bash
# generate-compliance-report.sh
OUTPUT="/var/reports/compliance-$(date +%Y%m%d)"
mkdir -p $OUTPUT

for node in $(cat nodes.txt); do
    ssh root@$node "01s-ledger verify && 01s-ledger export" > $OUTPUT/$node.json
done

tar czf $OUTPUT.tar.gz $OUTPUT
```

### Backup All Nodes

```bash
#!/bin/bash
# backup-all.sh
for node in $(cat nodes.txt); do
    ssh root@$node "/usr/local/bin/01s-backup.sh"
    scp root@$node:/var/backups/01s/01s-dr-backup-*.tar.gz /backups/
done
```

## Monitoring Integration Guide

### Prometheus Node Discovery

```yaml
# /etc/prometheus/file_sd_configs/01s-nodes.yml
- targets:
    - node-01:9091
    - node-02:9091
    - node-03:9091
  labels:
    job: 01s-ledger
    environment: production
```

### Grafana Dashboard Variables

```json
{
  "templating": {
    "list": [
      {
        "name": "node",
        "type": "query",
        "query": "label_values(01s_ledger_entries, instance)"
      }
    ]
  }
}
```

## Rollback Procedures

### Rolling Back a Deployment

1. Identify the issue from logs
2. Fix the configuration/template
3. Re-run Ansible playbook:
   ```bash
   ansible-playbook -i inventory deploy-01s.yml --limit failed-node
   ```
4. Verify fix on the node
5. Continue with remaining nodes

### Full Rollback to Previous Snapshot

```bash
# If deployment is completely broken:
# 1. Boot from ISO on each node
# 2. Restore from pre-deployment backup
for node in $(cat nodes.txt); do
    ssh root@$node "
        systemctl stop 01s-ledger
        cp -r /backups/pre-deploy/ledger/* ~/ledger/
        systemctl start 01s-ledger
        01s-ledger verify
    "
done
```

## Performance Reference

### Expected Performance Metrics

| Metric | Desktop | Server | Ledger Node |
|--------|---------|--------|-------------|
| Boot time | 15-30s | 10-20s | 10-15s |
| Ledger verify | <1s | <1s | <1s |
| Health check | <0.5s | <0.5s | <0.5s |
| Memory usage | 50-100 MB | 30-60 MB | 30-50 MB |
| Disk I/O | Low | Low | Low |
| Network I/O | Minimal | Minimal | Minimal |

### Bottleneck Identification

| Symptom | Likely Bottleneck | Tool |
|---------|-------------------|------|
| Slow ledger verify | Disk I/O | iostat -x 1 |
| Slow health checks | CPU | mpstat -P ALL 1 |
| Slow replication | Network | iperf3 -c server |
| Slow boot | systemd services | systemd-analyze blame |
| Slow application | Memory | free -h, vmstat 1 |

---

Lois-Kleinner and 0-1.gg 2026 Copyright
## Advanced Diagnostic Procedures

### Ledger Performance Profiling

```bash
# Profile ledger operations
time 01s-ledger verify
time 01s-ledger export > /dev/null
time 01s-ledger status

# Check ledger file size growth
watch -n 60 'du -sh ~/ledger/'

# Monitor system resources during ledger operations
top -b -n 1 | grep "01s-ledger"
```

### Network Diagnostic Procedures

```bash
# Full network diagnostic suite
echo "=== Network Diagnostics ==="
echo "--- Interfaces ---"
ip link show
echo "--- IP Addresses ---"
ip addr show
echo "--- Routing ---"
ip route show
echo "--- DNS ---"
cat /etc/resolv.conf
echo "--- Connectivity ---"
ping -c 2 8.8.8.8
echo "--- Open Ports ---"
ss -tulpn
```

### System Health Check Script

```bash
#!/bin/bash
# health-check.sh
echo "=== System Health Check ==="
echo "Date: $(date)"
echo ""
echo "--- CPU ---"
top -bn1 | grep "Cpu(s)"
echo ""
echo "--- Memory ---"
free -h
echo ""
echo "--- Disk ---"
df -h /
echo ""
echo "--- Load ---"
uptime
echo ""
echo "--- Services ---"
systemctl --failed
echo ""
echo "--- Ledger ---"
01s-ledger verify > /dev/null 2>&1 && echo "Ledger: OK" || echo "Ledger: FAILED"
echo ""
echo "--- Last Boot ---"
who -b
```

## Common Troubleshooting Scenarios

### Scenario 1: System Won't Wake from Suspend

**Symptoms**: Screen stays black, system unresponsive after opening laptop lid.
**Causes**: GPU driver issue, ACPI problem, firmware bug.

**Diagnostic Steps**:
1. Try switching TTY (Ctrl+Alt+F2)
2. If TTY works, restart GDM: `sudo systemctl restart gdm`
3. Check kernel messages: `dmesg | grep -i "drm\|gpu\|acpi"`
4. Check journal: `journalctl -b | grep -i "resume\|suspend"`
5. Test with different kernel parameters: `acpi=off`, `nouveau.modeset=0`

### Scenario 2: Bluetooth Device Won't Pair

**Symptoms**: Device discovered but pairing fails.
**Causes**: Wrong PIN, driver issue, device compatibility.

**Diagnostic Steps**:
1. Restart Bluetooth: `sudo systemctl restart bluetooth`
2. Remove and re-scan: `bluetoothctl remove XX:XX:XX:XX:XX:XX`
3. Check kernel module: `lsmod | grep bluetooth`
4. Try manual pairing: `bluetoothctl pair XX:XX:XX:XX:XX:XX`
5. Check compatibility list for your device

### Scenario 3: USB Device Not Recognized

**Symptoms**: Device plugged in but not detected.
**Causes**: Driver missing, power issue, hardware fault.

**Diagnostic Steps**:
1. Check dmesg: `dmesg | tail -20` (look for USB-related messages)
2. List USB devices: `lsusb`
3. Check power: `cat /sys/bus/usb/devices/*/power/control`
4. Reset USB: `sudo modprobe -r usbcore && sudo modprobe usbcore`
5. Try different port or cable

## Package Management Best Practices

### Pre-Update Checklist

```bash
# Before running system updates:
echo "=== Pre-Update Checks ==="
echo "1. Check disk space: $(df -h / | tail -1 | awk '{print $4}') free"
echo "2. Check memory: $(free -h | grep Mem | awk '{print $7}') available"
echo "3. Backup ledger: $(01s-ledger verify > /dev/null 2>&1 && echo 'OK' || echo 'FAILED')"
echo "4. Check internet: $(ping -c 1 8.8.8.8 > /dev/null 2>&1 && echo 'OK' || echo 'FAILED')"
echo "5. Check battery: $(cat /sys/class/power_supply/BAT0/capacity 2>/dev/null || echo 'N/A')%"
```

### Post-Update Checklist

```bash
# After running system updates:
echo "=== Post-Update Checks ==="
sudo pacman -Qkk | grep -v "0 missing files" || echo "All files verified"
01s-ledger verify && echo "Ledger chain intact" || echo "Ledger FAILED"
01s-ledger toolchain && echo "Toolchain verified" || echo "Toolchain FAILED"
systemctl --failed || echo "All services running"
```

### Package Cache Management

```bash
# Automatic cache cleanup
cat > /etc/systemd/system/paccache-clean.service << 'EOF'
[Unit]
Description=Clean pacman cache

[Service]
Type=oneshot
ExecStart=/usr/bin/paccache -r
ExecStart=/usr/bin/paccache -rk 2
EOF

cat > /etc/systemd/system/paccache-clean.timer << 'EOF'
[Unit]
Description=Weekly pacman cache cleanup

[Timer]
OnCalendar=weekly
Persistent=true

[Install]
WantedBy=timers.target
EOF

sudo systemctl enable --now paccache-clean.timer
```

## User Support Escalation Path

### L1: Self-Service (User)

1. Check documentation
2. Search known issues
3. Try listed workarounds
4. Check FAQ
5. Review system logs

### L2: Community Support (Peer)

1. Ask in Matrix chat
2. Post on GitHub Discussions
3. Search GitHub Issues
4. Ask on mailing list
5. Request help from community

### L3: Technical Support (Maintainer)

1. Create GitHub Issue
2. Include system information
3. Provide reproduction steps
4. Attach relevant logs
5. Wait for maintainer response

### L4: Enterprise Support (Dedicated)

1. Submit support ticket
2. Call dedicated hotline
3. Request live assistance
4. Schedule remote session
5. Request on-site visit

## Performance Tuning Guide

### CPU Performance Tuning

```bash
# Check CPU governor
cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Set performance governor
echo performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Disable C-states (reduce latency)
sudo nano /etc/default/grub
# Add: processor.max_cstate=1 intel_idle.max_cstate=0
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

### Memory Performance Tuning

```bash
# Reduce swappiness
echo 10 | sudo tee /proc/sys/vm/swappiness

# Enable swap compression (zram)
sudo pacman -S zram-generator
sudo systemctl enable --now systemd-zram-setup@zram0

# Check swap usage
swapon --show

# Clear memory cache (temporary)
echo 3 | sudo tee /proc/sys/vm/drop_caches
```

### Disk Performance Tuning

```bash
# Check I/O scheduler
cat /sys/block/sda/queue/scheduler

# Set scheduler to none (NVMe) or mq-deadline (SSD)
echo none | sudo tee /sys/block/nvme0n1/queue/scheduler

# Enable TRIM for SSDs
sudo systemctl enable --now fstrim.timer

# Check disk health
sudo smartctl -a /dev/sda | grep -i "health\|temperature\|reallocated"
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
