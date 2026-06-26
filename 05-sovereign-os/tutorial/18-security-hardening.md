# Security Hardening

This guide covers hardening your 01s Sovereign installation for production or security-sensitive use.

## System Updates

Keep the system updated:

```bash
# Regular updates
sudo pacman -Syu

# Enable automatic download
sudo systemctl enable --now pacman.timer

# Install security-only updates (if using arch-audit)
sudo pacman -S arch-audit
sudo arch-audit
```

## Firewall Configuration

### Firewalld

```bash
# Start and enable firewalld
sudo systemctl enable --now firewalld

# Default zone setup
sudo firewall-cmd --set-default-zone=drop
sudo firewall-cmd --add-service=ssh --permanent
sudo firewall-cmd --add-service=dhcpv6-client --permanent

# Allow specific ports
sudo firewall-cmd --add-port=8080/tcp --permanent

# Rich rules for advanced filtering
sudo firewall-cmd --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" accept' --permanent

# Apply changes
sudo firewall-cmd --reload

# Verify rules
sudo firewall-cmd --list-all
```

### iptables (Alternative)

```bash
# Basic ruleset
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Save rules
sudo iptables-save > /etc/iptables/iptables.rules
```

## SSH Hardening

Edit `/etc/ssh/sshd_config`:

```bash
# Disable root login
PermitRootLogin no

# Disable password authentication
PasswordAuthentication no
PubkeyAuthentication yes

# Use strong key exchange
KexAlgorithms curve25519-sha256,diffie-hellman-group16-sha512

# Limit users
AllowUsers 01s youruser

# Change port (optional)
Port 2222

# Restart SSH
sudo systemctl restart sshd
```

### Generate SSH Keys

```bash
# Ed25519 key (recommended)
ssh-keygen -t ed25519 -a 100

# RSA key (fallback)
ssh-keygen -t rsa -b 4096

# Copy to remote server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@remote
```

## Audit System (01s Ledger)

```bash
# Initialize ledger
01s-ledger init

# Enable comprehensive logging
sudo systemctl enable --now 01s-boot.service
sudo systemctl enable --now 01s-state.timer

# Regular verification
01s-ledger verify

# Schedule automatic verification (cron)
echo "0 */6 * * * /usr/bin/01s-ledger verify >> /var/log/ledger-verify.log" | crontab -

# Log critical events
01s-ledger log security_check firewall="enabled" ssh="hardened" status="passed"
```

## SELinux/AppArmor

01s Sovereign uses AppArmor (preferred):

```bash
# Install AppArmor
sudo pacman -S apparmor

# Enable
sudo systemctl enable --now apparmor

# Check status
sudo aa-status

# Set profiles to enforce
sudo aa-enforce /etc/apparmor.d/*

# Create custom profile
sudo aa-genprof /usr/local/bin/myapp
```

## Kernel Hardening

Add to `/etc/sysctl.d/99-hardening.conf`:

```bash
# IP spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# Ignore source routed packets
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Kernel panic on OOM
vm.panic_on_oom = 1
kernel.panic = 10

# Restrict kernel pointer access
kernel.kptr_restrict = 2
kernel.dmesg_restrict = 1

# ASLR
kernel.randomize_va_space = 2
```

Apply:

```bash
sudo sysctl -p /etc/sysctl.d/99-hardening.conf
```

## User Account Security

```bash
# Create separate admin user
sudo useradd -m -G wheel admin
sudo passwd admin

# Disable direct 01s login (force sudo via admin)
sudo usermod -s /usr/bin/nologin 01s

# Password policies (install libpwquality)
sudo pacman -S libpwquality
# Edit /etc/pam.d/passwd
# password required pam_pwquality.so retry=3 minlen=12 difok=3
```

## File Permissions

```bash
# Secure sensitive files
sudo chmod 600 /etc/shadow
sudo chmod 600 /etc/gshadow
sudo chmod 644 /etc/passwd
sudo chmod 644 /etc/group

# Secure SSH
sudo chmod 700 ~/.ssh
sudo chmod 600 ~/.ssh/*
sudo chmod 644 ~/.ssh/*.pub

# Secure ledger
chmod 700 ~/ledger/

# Check for world-writable files
find / -type d -perm -o+w -not -path '/proc/*' -not -path '/sys/*' 2>/dev/null
```

## Intrusion Detection

```bash
# Install AIDE
sudo pacman -S aide

# Initialize database
sudo aideinit

# Check integrity
sudo aide --check

# Install rkhunter
sudo pacman -S rkhunter
sudo rkhunter --check

# Install chkrootkit
sudo pacman -S chkrootkit
sudo chkrootkit
```

## Logging and Monitoring

```bash
# Configure auditd
sudo pacman -S audit
sudo systemctl enable --now auditd

# Watch sensitive files
sudo auditctl -w /etc/passwd -p wa -k passwd_changes
sudo auditctl -w /etc/shadow -p wa -k shadow_changes
sudo auditctl -w /etc/ssh/sshd_config -p wa -k ssh_config

# Search audit logs
sudo ausearch -k ssh_config

# Configure journald
echo "SystemMaxUse=500M" | sudo tee -a /etc/systemd/journald.conf
echo "MaxFileSec=1month" | sudo tee -a /etc/systemd/journald.conf
sudo systemctl restart systemd-journald
```

## Backup Security

```bash
# Encrypt backups
gpg --symmetric --cipher-algo AES256 backup.tar.gz

# Sign ledger exports
01s-ledger sign > ledger-signature.txt
```

## Network Security

```bash
# Block common attacks
sudo firewall-cmd --add-rich-rule='rule family=ipv4 source address=0.0.0.0/0 port port=22 protocol=tcp reject' --permanent

# Rate limit SSH connections
sudo firewall-cmd --add-rich-rule='rule family=ipv4 service name=ssh limit value=5/m accept' --permanent
```

## Regular Security Checklist

- [ ] System updated weekly
- [ ] Firewall enabled and verified
- [ ] SSH hardened (no root, no passwords)
- [ ] Ledger active and verified
- [ ] AppArmor enforcing
- [ ] Kernel parameters applied
- [ ] AIDE database initialized
- [ ] auditd running
- [ ] Weak passwords removed
- [ ] Unused services disabled
- [ ] SSH keys rotated (every 6 months)
- [ ] Ledger verification automated
- [ ] Backups encrypted
- [ ] Failed login attempts monitored

---

## See Also

- [Firewall Configuration](16-networking-and-connectivity.md)
- [Security FAQ](../faq/06-security-faq.md)
- [Incident Response Plan](../incident-reporting/01-incident-response-plan.md)

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
| Firewall not active | Not enabled | Run sudo systemctl enable --now nftables |
| SELinux not enforcing | Not configured | Enable in /etc/selinux/config |
| SSH key rejected | Wrong permissions | Set chmod 600 ~/.ssh/id_* |
| Auditd not logging | Service not started | Enable sudo systemctl enable --now auditd |

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

### Common Pitfalls (Security)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| Firewall too restrictive | Blocks SSH/admin access | Always keep an out-of-band access method |
| SELinux in permissive mode | Not enforcing policy | Check /etc/selinux/config after updates |
| SSH keys with weak permissions | 644 instead of 600 | Run chmod 600 ~/.ssh/id_* |
| Auditd log rotation missing | Disk fills with logs | Configure logrotate for auditd |
| Kernel not updated | Missed security patches | Subscribe to Arch Linux security announcements |

## Practice Exercises (Advanced)

1. **Security Baseline Scan**: Write a script that checks the system against CIS benchmarks for Arch Linux
2. **Custom AppArmor Profile**: Create an AppArmor profile for the 01s-ledger daemon; test with various attacks
3. **SSH Hardening**: Configure SSH key-only authentication with ed25519 keys; disable password auth and root login
4. **Auditd Ruleset**: Create custom auditd rules that log all file access to /etc/shadow and /etc/sudoers
5. **Intrusion Detection**: Install and configure AIDE (Advanced Intrusion Detection Environment) with the ledger as verification source

## Further Reading

- [Post-Installation Setup](07-post-installation-setup.md) — Initial security setup
- [Networking and Connectivity](16-networking-and-connectivity.md) — Network security
- [OS Security Architectures](../research/08-operating-system-security-architectures.md) — Research background
- [Data Safety Overview](../data-safety/01-overview-of-data-safety-in-01s.md) — Data protection
- [Incident Response Plan](../incident-reporting/01-incident-response-plan.md) — Security events
- [Security FAQ](../faq/06-security-faq.md) — Common questions
- [Ledger Troubleshooting](../help/03-ledger-troubleshooting.md) — Audit issues
- [Enterprise Security](../enterprise/03-compliance-and-certifications.md) — Enterprise
- [Compliance Guide](../compliance/01-gdpr-compliance.md) — Regulatory compliance
- [Privacy by Design](../privacy/08-privacy-by-design-architecture.md) — Privacy architecture

## AppArmor Profile Example

```
# /etc/apparmor.d/usr.sbin.01s-ledgerd
#include <tunables/global>
/usr/sbin/01s-ledgerd {
  #include <abstractions/base>
  capability dac_override,
  /var/log/01s/** rw,
  /etc/01s/** r,
  deny /home/** w,
  deny capability sys_admin,
}
```

## systemd Service Hardening

```ini
[Service]
ProtectSystem=strict
ProtectHome=true
NoNewPrivileges=true
CapabilityBoundingSet=CAP_DAC_OVERRIDE CAP_SYS_PTRACE
SystemCallFilter=@system-service
MemoryDenyWriteExecute=true
PrivateDevices=true
```

## Security Audit Checklist

- [ ] Firewall enabled: `systemctl status nftables`
- [ ] SSH password auth disabled in sshd_config
- [ ] Root login disabled via SSH
- [ ] Ledger integrity: `01s-ledger verify`
- [ ] Auditd running: `systemctl status auditd`
- [ ] Kernel: `sysctl kernel.dmesg_restrict=1`

## Real-World Scenario: Incident Response

A security analyst detects suspicious outbound traffic. Response: (1) Isolate machine from network, (2) Export ledger: `01s-ledger export --since "24h ago" --format json`, (3) Analyze entries for unauthorized access, (4) Identify compromised user account via sudo escalation records, (5) Restore from last known good backup, (6) Update ledger recovery entry. Total response time: 45 minutes.

## Kernel Security Parameters

```bash
# /etc/sysctl.d/99-security.conf
# Restrict kernel log access
kernel.dmesg_restrict = 1
kernel.kptr_restrict = 2

# Restrict ptrace
kernel.yama.ptrace_scope = 2

# Network hardening
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# ASLR
kernel.randomize_va_space = 2

# Magic SysRq
kernel.sysrq = 0
```

## Password Policy Configuration

```bash
# /etc/security/pwquality.conf
minlen = 12
dcredit = -1
ucredit = -1
ocredit = -1
lcredit = -1
minclass = 3
maxrepeat = 3
gecoscheck = 1
```

## SSH Server Hardening

```bash
# /etc/ssh/sshd_config
Port 22                    # Change to non-standard port?
Protocol 2
PermitRootLogin no
MaxAuthTries 3
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
ClientAliveInterval 300
ClientAliveCountMax 2
```

## Intrusion Detection with AIDE

```bash
# Install AIDE
sudo pacman -S aide

# Initialize database
sudo aide --init
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Configure what to monitor
sudo nano /etc/aide/aide.conf
# /etc p+i+u+g+md5
# /bin p+i+u+g+sha256
# /usr/bin p+i+u+g+sha256
# !/var/log

# Run check
sudo aide --check

# Update database after legitimate changes
sudo aide --update

# Automate with cron/systemd timer
sudo systemctl enable aidecheck@daily
```

## USB Device Control

```bash
# Block USB storage devices (allow only keyboards/mice)
cat > /etc/modprobe.d/block-usb-storage.conf << 'CONF'
install usb-storage /bin/true
CONF

# USBGuard for whitelist-based control
sudo pacman -S usbguard
sudo usbguard generate-policy > /etc/usbguard/rules.conf
sudo systemctl enable --now usbguard

# View USB devices currently blocked
sudo usbguard list-devices

# Temporarily allow a device
sudo usbguard allow-device 123
```

## System Monitoring

```bash
# Install monitoring tools
sudo pacman -S htop iotop iftop nethogs

# Real-time process monitoring
htop

# Disk I/O monitoring
sudo iotop

# Network usage by process
sudo nethogs

# Network bandwidth
iftop

# System load average
cat /proc/loadavg

# Open file descriptors
lsof | wc -l

# Listening ports
ss -tlnp
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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

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