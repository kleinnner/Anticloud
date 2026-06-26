# Post-Installation Setup

After installing 01s Sovereign, follow this guide to configure your system for daily use.

## First Login

By default, the user `01s` with password `01s` is created during installation.

```bash
# Change your password immediately
passwd

# Verify your user belongs to the right groups
groups
# Expected: wheel, storage, power
```

## Creating Additional Users

```bash
# Create a new user
sudo useradd -m -G wheel,storage,power -s /bin/bash username

# Set password
sudo passwd username

# Verify
id username
```

### Bulk User Creation Script

```bash
#!/bin/bash
# create-users.sh - Create multiple users from a CSV file
# CSV format: username,password,groups

CSV_FILE="$1"
if [ -z "$CSV_FILE" ]; then
    echo "Usage: $0 users.csv"
    exit 1
fi

while IFS=, read -r user pass groups; do
    sudo useradd -m -G "$groups" -s /bin/bash "$user"
    echo "$user:$pass" | sudo chpasswd
    echo "Created user: $user"
done < "$CSV_FILE"
```

## Network Setup

### WiFi (NetworkManager)

```bash
# List available networks
nmcli device wifi list

# Connect to a network
nmcli device wifi connect "SSID" password "password"

# Show connection status
nmcli connection show

# Enable WiFi
nmcli radio wifi on
```

### Ethernet

Ethernet typically works automatically via DHCP. For static IP:

```bash
nmcli connection add type ethernet con-name "static-eth" \
  ifname eth0 ip4 192.168.1.100/24 gw4 192.168.1.1
nmcli connection modify "static-eth" ipv4.dns "8.8.8.8 1.1.1.1"
nmcli connection up "static-eth"
```

### Network Profile Management

```bash
# List saved connections
nmcli connection show

# Switch between connections
nmcli connection up "Home-WiFi"
nmcli connection up "Work-Ethernet"

# Set connection priority
nmcli connection modify "Home-WiFi" connection.autoconnect-priority 10
nmcli connection modify "Work-Ethernet" connection.autoconnect-priority 5
```

## Updating Packages

01s Sovereign uses `pacman` for package management:

```bash
# Update package database
sudo pacman -Sy

# Upgrade all packages
sudo pacman -Syu

# Search for a package
pacman -Ss package-name

# Install a package
sudo pacman -S package-name

# Remove a package
sudo pacman -R package-name

# Remove a package and its dependencies
sudo pacman -Rs package-name

# Remove unused packages (orphans)
sudo pacman -Rns $(pacman -Qtdq)
```

### Automatic Updates

```bash
# Enable automatic download of updates
sudo systemctl enable --now pacman.timer

# Check timer status
sudo systemctl status pacman.timer

# View next update time
sudo systemctl list-timers pacman.timer
```

### Partial Upgrades Warning

**Never** do partial upgrades (e.g., `pacman -Sy package` without also running `pacman -Su`). This can lead to dependency conflicts. Always use `pacman -Syu` for full system updates.

## Enabling the AUR

Arch User Repository (AUR) access requires an AUR helper:

```bash
# Install yay (recommended)
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

# Search AUR
yay -Ss aur-package

# Install from AUR
yay -S aur-package

# Update all (including AUR)
yay -Syu
```

### Alternative AUR Helpers

| Helper | Pros | Cons |
|--------|------|------|
| yay | Popular, well-maintained | Go dependency |
| paru | Rust-based, fast | Less community adoption |
| trizen | Perl-based, simple | Less maintained |
| pamac | GUI available | GNOME dependency |

## Configuring the 01s Ledger

Initialize and configure the audit ledger:

```bash
# Initialize the ledger
01s-ledger init

# Check ledger status
01s-ledger status

# Configure auto-logging (as root)
sudo systemctl enable --now 01s-state.timer
sudo systemctl enable --now 01s-boot.service

# View recent ledger entries
01s-ledger tail 10

# Verify ledger integrity
01s-ledger verify
```

### Ledger Configuration

The ledger can be configured via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `LEDGER_DIR` | `~/ledger/` | Ledger storage directory |
| `LEDGER_MAX_ENTRIES` | 10000 | Max entries per file |
| `LEDGER_WATCH_INTERVAL` | 60 | Watch mode interval (seconds) |

```bash
# Customize ledger location
export LEDGER_DIR=/mnt/secure/ledger
01s-ledger init
```

## Setting Up Development Tools

### Install Compilers

```bash
# Install GCC and LLVM/Clang
sudo pacman -S gcc clang llvm make cmake

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Configure Git

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
git config --global credential.helper store
```

### Git Configuration Reference

| Setting | Recommended Value | Purpose |
|---------|-------------------|---------|
| `user.name` | Your full name | Commit attribution |
| `user.email` | Your email | Commit attribution |
| `init.defaultBranch` | `main` | Default branch name |
| `core.editor` | `vim` | Default editor |
| `diff.tool` | `vimdiff` | Diff viewer |
| `merge.tool` | `vimdiff` | Merge tool |
| `credential.helper` | `store` | Credential caching |

## Configuring the Desktop

### Set Keyboard Layout

```bash
localectl set-x11-keymap us
```

### Configure Time and Date

```bash
sudo timedatectl set-ntp true
sudo timedatectl set-timezone Region/City
timedatectl status
```

### Configure Display Scaling

```bash
# For HiDPI displays
gsettings set org.gnome.mutter experimental-features "['scale-monitor-framebuffer']"
# Then go to Settings > Displays to set scaling percentage
```

### Configure Default Applications

```bash
# Set default browser
xdg-settings set default-web-browser firefox.desktop

# Set default file manager
xdg-mime default org.gnome.Nautilus.desktop inode/directory
```

## Security Hardening

### Firewall Setup

```bash
sudo systemctl enable --now firewalld
sudo firewall-cmd --add-service=ssh --permanent
sudo firewall-cmd --reload
```

### SSH Hardening

```bash
sudo sed -i 's/#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

### Generate SSH Keys

```bash
# Ed25519 key (recommended)
ssh-keygen -t ed25519 -a 100

# Copy to remote server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@remote
```

## Backup Initial Configuration

```bash
# Backup system configuration
sudo tar czf /root/system-config-backup.tar.gz \
  /etc/systemd/ /etc/default/grub /etc/NetworkManager/ /etc/firewalld/

# Backup ledger state
tar czf ~/ledger-backup.tar.gz ~/ledger/

# Create initial restore point
sudo timeshift --create --comments "Initial setup"
```

## Essential Package Installation

```bash
# Essential utilities
sudo pacman -S htop neofetch zip unzip p7zip curl wget

# Multimedia codecs
sudo pacman -S ffmpeg gst-plugins-good gst-plugins-bad gst-plugins-ugly

# Fonts
sudo pacman -S noto-fonts noto-fonts-emoji ttf-dejavu ttf-liberation

# Development
sudo pacman -S git base-devel cmake python nodejs
```

## Post-Installation Checklist

- [ ] Changed default password
- [ ] Network connectivity verified
- [ ] System packages updated
- [ ] Ledger initialized and running
- [ ] Firewall enabled
- [ ] SSH configured
- [ ] Development tools installed
- [ ] Git configured
- [ ] Timezone set correctly
- [ ] AUR helper installed
- [ ] Automatic updates enabled
- [ ] Backup created
- [ ] Keyboard layout set
- [ ] Display scaling configured
- [ ] Media codecs installed

---

## See Also

- [Desktop Tour](08-desktop-tour.md)
- [Customizing Appearance](09-customizing-appearance.md)
- [Managing Packages](14-managing-packages.md)
- [Security Hardening](18-security-hardening.md)
- [Backup and Restore](19-backup-and-restore.md)

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

### Common Pitfalls (Post-Installation)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| User account has no sudo | Not added to wheel group | Run gpasswd -a username wheel as root |
| Firewall blocks everything | Default deny policy | Configure 
ftables rules for your services |
| Timezone wrong | Not set during install | Use 	imedatectl set-timezone Region/City |
| Hostname not resolving | Not set in /etc/hosts | Add 127.0.1.1 myhostname to hosts file |
| Locale not generating | Missing locale.gen entry | Uncomment locale in /etc/locale.gen and run locale-gen |

## Practice Exercises (Advanced)

1. **Post-Install Checklist Script**: Write a bash script that runs through the entire post-install checklist and reports pass/fail for each item
2. **Service Audit**: List all enabled systemd services and identify which ones are 01s-specific vs standard Arch
3. **Custom User Setup**: Create three user accounts with different privilege levels (admin, standard, restricted) and verify restrictions
4. **Firewall Ruleset**: Design and implement a minimal nftables ruleset that allows only SSH, HTTP, and the ledger daemon
5. **Automation with Ansible**: Write an Ansible playbook that performs the entire post-installation setup on a fresh install

## Further Reading

- [Installation Guide](06-installation-guide.md) — Previous installation step
- [Desktop Tour](08-desktop-tour.md) — GNOME environment overview
- [Security Hardening](18-security-hardening.md) — Advanced security setup
- [Using 01s-Ledger](10-using-01s-ledger.md) — Ledger initialization
- [Networking and Connectivity](16-networking-and-connectivity.md) — Network setup
- [Managing Packages](14-managing-packages.md) — Package management
- [Development Environment](17-development-environment.md) — Dev tools setup
- [Installation FAQ](../faq/02-installation-faq.md) — Common issues
- [Desktop FAQ](../faq/05-desktop-faq.md) — Desktop configuration
- [Community Setup Guide](../community/02-getting-started-as-contributor.md) — Contributing

## User Account Configuration

```bash
useradd -m -G wheel,audio,video,storage,rfkill alice
chmod 700 /home/alice/.ssh
touch /home/alice/.ssh/authorized_keys
chmod 600 /home/alice/.ssh/authorized_keys
chown -R alice:alice /home/alice/.ssh
sudo -u alice ssh-keygen -t ed25519 -C "alice@01s-host"
```

## Firewall Configuration Example

```bash
cat > /etc/nftables.conf << 'EOF'
table inet filter {
    chain input { type filter hook input priority 0; policy drop;
        ct state established,related accept
        iif lo accept
        tcp dport { 22, 80, 443 } accept
        ip protocol icmp accept
        counter drop
    }
    chain forward { type filter hook forward priority 0; policy drop; }
    chain output { type filter hook output priority 0; policy accept; }
}
EOF
systemctl enable --now nftables
```

## Real-World Scenario: Remote Team Setup

A remote development team of 12 sets up 01s Sovereign workstations. Each developer: (1) Creates user account with their SSH key, (2) Configures firewall to allow only SSH from VPN IP range, (3) Initializes ledger with `01s-ledger init`, (4) Verifies toolchain with `01s-ledger toolchain --verify`, (5) Sets up Git with ledger-integrated commit hooks. IT verifies all 12 workstations are correctly configured via a remote ledger query.

## Complete Setup Checklist

After installation, run through these steps in order:

### Day 1: Core Setup
- [ ] Update system: `sudo pacman -Syu`
- [ ] Create user and set passwords
- [ ] Enable firewall: `sudo systemctl enable --now nftables`
- [ ] Initialize ledger: `01s-ledger init`
- [ ] Verify toolchain: `01s-ledger toolchain --verify`

### Day 2: Desktop Configuration
- [ ] Configure network (WiFi credentials, static IP if needed)
- [ ] Set display preferences (resolution, scaling, refresh rate)
- [ ] Install preferred applications
- [ ] Configure backup schedule
- [ ] Set up SSH for remote access

### Day 3: Security Hardening
- [ ] Review enabled services: `systemctl list-units --state=enabled`
- [ ] Check firewall rules: `sudo nft list ruleset`
- [ ] Configure automatic updates
- [ ] Set up AppArmor profiles
- [ ] Test ledger integrity verification

## Post-Install Troubleshooting

| Issue | Check | Solution |
|-------|-------|----------|
| No network | `ip addr show` | Check cable, restart NetworkManager |
| No sound | `pactl info` | Install pipewire-pulse |
| Screen too bright | `brightnessctl` | Install brightnessctl or use settings |
| No extensions | `gnome-extensions list` | Install via GNOME Software |
| Firewall blocking | `nft list ruleset` | Add allow rules as needed |
| Ledger not recording | `systemctl status 01s-ledgerd` | Restart daemon, check permissions |

## Package Installation Workflow

After initial setup, install additional packages based on your use case:

### Desktop Applications
```bash
# Office suite
sudo pacman -S libreoffice-fresh

# Multimedia
sudo pacman -S vlc gimp inkscape

# Communication
sudo pacman -S thunderbird element-desktop

# Development
sudo pacman -S git vim rust go python nodejs
```

### Verification Commands
```bash
# Verify each component is working correctly
echo "=== Firewall ===" && sudo nft list ruleset | head -5
echo "=== Ledger ===" && 01s-ledger status
echo "=== Network ===" && ping -c 1 1.1.1.1
echo "=== Desktop ===" && echo $XDG_SESSION_TYPE
echo "=== Sound ===" && pactl info | head -1
echo "=== Display ===" && xrandr | grep " connected"
```

## User Environment Customization

```bash
# Set default shell
chsh -s /bin/bash

# Create bash aliases
cat >> ~/.bashrc << 'ALIASES'
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias 01s-status='01s-ledger status && 01s-ledger toolchain'
alias update='sudo pacman -Syu'
ALIASES

# Set environment variables
cat >> ~/.bashrc << 'VARS'
export EDITOR=nano
export BROWSER=firefox
export VISUAL=nano
VARS

# Source the file
source ~/.bashrc
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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
