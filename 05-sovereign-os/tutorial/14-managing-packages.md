# Managing Packages

01s Sovereign uses `pacman`, the Arch Linux package manager, for package management. This guide covers common package operations.

## Package Manager Basics

### Updating Package Database

```bash
# Sync package database
sudo pacman -Sy
```

### Upgrading Packages

```bash
# Upgrade all installed packages
sudo pacman -Syu
```

### Installing Packages

```bash
# Install a single package
sudo pacman -S package-name

# Install multiple packages
sudo pacman -S package1 package2 package3

# Install without confirmation
sudo pacman -S --noconfirm package-name

# Install a group
sudo pacman -S gnome
```

### Removing Packages

```bash
# Remove a package (keep config)
sudo pacman -R package-name

# Remove package and dependencies
sudo pacman -Rs package-name

# Remove package, dependencies, and config files
sudo pacman -Rns package-name

# Remove orphaned dependencies
sudo pacman -Rns $(pacman -Qtdq)
```

### Searching Packages

```bash
# Search package names and descriptions
pacman -Ss search-term

# Search installed packages
pacman -Qs search-term

# Show package info
pacman -Si package-name

# Show installed package info
pacman -Qi package-name

# List all installed packages
pacman -Q

# List explicitly installed packages
pacman -Qe

# List files owned by a package
pacman -Ql package-name
```

## Package Cache Management

```bash
# Check cache size
du -sh /var/cache/pacman/pkg/

# Remove old package versions (keep last 2)
sudo paccache -r

# Remove all cached packages
sudo paccache -rk 0

# Remove unused packages from cache
sudo pacman -Sc
```

## Configuring pacman

Configuration file: `/etc/pacman.conf`

```ini
[options]
HoldPkg     = pacman glibc
Architecture = auto
Color
CheckSpace
VerbosePkgLists
ParallelDownloads = 5

[core]
Include = /etc/pacman.d/mirrorlist

[extra]
Include = /etc/pacman.d/mirrorlist

[community]
Include = /etc/pacman.d/mirrorlist

[multilib]
Include = /etc/pacman.d/mirrorlist
```

## Using the AUR

The Arch User Repository (AUR) contains community-maintained packages.

### Installing yay (AUR Helper)

```bash
# Install dependencies
sudo pacman -S --needed git base-devel

# Clone and build yay
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

### Using yay

```bash
# Search AUR
yay -Ss package-name

# Install from AUR
yay -S package-name

# Update all packages (including AUR)
yay -Syu

# Remove package
yay -R package-name

# List orphaned AUR packages
yay -Qtdq

# Clean build cache
yay -Sc
```

### Manual AUR Installation

```bash
# Clone AUR package
git clone https://aur.archlinux.org/package-name.git
cd package-name

# Inspect PKGBUILD
cat PKGBUILD

# Build and install
makepkg -si
```

## Package Troubleshooting

### Incomplete Updates

If `pacman -Syu` fails midway:

```bash
# Fix broken packages
sudo pacman -Syu --overwrite='*'

# Force reinstall
sudo pacman -S --force package-name
```

### Database Lock Error

```bash
# Remove lock file (if no other pacman running)
sudo rm /var/lib/pacman/db.lck
```

### Keyring Issues

```bash
# Update keyring
sudo pacman -Sy archlinux-keyring

# Reinitialize keyring
sudo rm -rf /etc/pacman.d/gnupg
sudo pacman-key --init
sudo pacman-key --populate archlinux
```

### Failed Dependency

```bash
# Check dependency tree
pactree package-name

# Force install without dependency check
sudo pacman -Sdd package-name
```

## 01s-Specific Packages

| Package | Description |
|---------|-------------|
| `01s-ledger` | Audit ledger daemon |
| `zerocli` | Zero-trust CLI |
| `01s-lexer` | Custom tokenizer |
| `01s-parser` | Recursive descent parser |
| `01s-codegen` | x86_64 JIT compiler |
| `01s-runes` | Glyph rendering system |
| `01s-binary` | Binary loader/inspector |

## Mirror Configuration

```bash
# Rank mirrors by speed
sudo pacman-mirrors --fasttrack

# Set specific mirrors
sudo nano /etc/pacman.d/mirrorlist

# Refresh after changing mirrors
sudo pacman -Syy
```

## Downgrading Packages

```bash
# Find older version in cache
ls /var/cache/pacman/pkg/package-name*

# Install older version
sudo pacman -U /var/cache/pacman/pkg/package-name-old.pkg.tar.zst

# Or use downgrade tool
sudo pacman -S downgrade
```

## Package Verification

```bash
# Verify installed package files
sudo pacman -Qk package-name

# Verify all packages
sudo pacman -Qkk

# Check for missing files
sudo pacman -Qk 2>&1 | grep -v "0 missing files"
```

## Essential Package Groups

| Group | Description | Size |
|-------|-------------|------|
| `base` | Core system | ~200 MB |
| `base-devel` | Development tools | ~300 MB |
| `gnome` | GNOME desktop | ~800 MB |
| `gnome-extra` | Extra GNOME apps | ~400 MB |
| `xfce4` | Xfce desktop | ~200 MB |
| `plasma` | KDE Plasma desktop | ~1 GB |
| `xorg` | X11 display server | ~100 MB |

---




## See Also

- [Post-Installation Setup](07-post-installation-setup.md)
- [Development Environment](17-development-environment.md)
- [Package Management Issues](../help/06-package-management-issues.md)

---


## Package Management Command Reference

| Action | pacman | yay (AUR) |
|--------|--------|-----------|
| Install | `pacman -S pkg` | `yay -S pkg` |
| Remove | `pacman -R pkg` | `yay -R pkg` |
| Remove + configs | `pacman -Rns pkg` | `yay -Rns pkg` |
| Search | `pacman -Ss keyword` | `yay -Ss keyword` |
| Info | `pacman -Qi pkg` | `yay -Qi pkg` |
| Update all | `pacman -Syu` | `yay -Syu` |
| List installed | `pacman -Q` | `yay -Q` |
| List explicit | `pacman -Qqe` | `yay -Qqe` |
| Orphans | `pacman -Qdt` | `yay -Qdt` |

## Update Best Practices
```bash
# Daily: sync database
sudo pacman -Sy

# Weekly: full system update
sudo pacman -Syu

# Monthly: cleanup
sudo pacman -Sc
sudo pacman -Rns $(pacman -Qdtq)
```

## AUR Helper Installation
```bash
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git /tmp/yay
cd /tmp/yay
makepkg -si
```

## Troubleshooting
| Problem | Cause | Solution |
|---------|-------|----------|
| Lock error | Stale lock file | Remove `/var/lib/pacman/db.lck` |
| Corrupted package | Download error | Run `pacman -Syu` again |
| DNS resolution fail | Network | Check `/etc/resolv.conf` |
| GPG key error | Expired keys | Run `pacman-key --refresh-keys` |
| Disk full | No space | Check `df -h` and clean cache |


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
| Package not found | Typo in name | Use pacman -Ss keyword to search |
| Dependency conflict | Version mismatch | Use pacman -Syu to sync first |
| AUR package fails | Missing build deps | Install ase-devel group |
| GPG key error | Expired key | Run pacman-key --refresh-keys |

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

### Common Pitfalls (Package Management)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| Partial upgrade breaks system | Mixing Arch and custom repos | Always run pacman -Syu (full system upgrade) |
| AUR helper not installed | Manual AUR access required | Install yay or paru for AUR access |
| Ledger not logging package installs | Hook not installed | Verify pacman hook file exists in /etc/pacman.d/hooks/ |
| Package conflict with custom toolchain | System package overwrites toolchain | Use --overwrite flag carefully |
| Orphaned dependencies accumulate | Packages not cleaned | Use pacman -Qdtq to find orphans periodically |

## Practice Exercises (Advanced)

1. **Custom Repository Setup**: Create a local pacman repository with 5 custom packages; install from it on a separate machine
2. **PKGBUILD Creation**: Write a PKGBUILD for a simple open-source project; submit it to AUR
3. **Ledger Integration**: Verify that every package install, upgrade, and removal is properly logged in the ledger
4. **Downgrade Procedure**: Downgrade a previously upgraded package using pacman cache; verify ledger reflects the change
5. **Package Audit Script**: Write a script that lists all installed packages, their versions, and last-modified dates from the ledger

## Further Reading

- [Post-Installation Setup](07-post-installation-setup.md) â€” Initial package install
- [Development Environment](17-development-environment.md) â€” Dev packages
- [Package Maintainer Guide](../developers/16-package-maintainer-guide.md) â€” Maintainer docs
- [Security Hardening](18-security-hardening.md) â€” Package security
- [AUR and Community Packages](../community/07-community-projects-and-ecosystem.md) â€” Community software
- [Package FAQ](../faq/06-security-faq.md) â€” Package questions
- [Package Troubleshooting](../help/06-package-management-issues.md) â€” Issue resolution
- [Custom ISO Building](21-building-custom-iso.md) â€” Including packages in ISO
- [Enterprise Deployment](../enterprise/02-deployment-models.md) â€” Enterprise packages
- [Toolchain Integration](../features/05-custom-toolchain-overview.md) â€” Toolchain packages

## Package Command Reference

| Operation | Command | Ledger Entry |
|-----------|---------|-------------|
| Install | `pacman -S pkg` | PKG_INSTALL |
| Remove | `pacman -R pkg` | PKG_REMOVE |
| Upgrade | `pacman -Syu` | PKG_UPGRADE |
| Search | `pacman -Ss term` | QUERY |
| Orphans | `pacman -Qdtq` | QUERY |
| Cache | `pacman -Scc` | CACHE_CLEAN |

## PKGBUILD Example

```bash
pkgname=my-01s-app
pkgver=1.0.0
pkgrel=1
pkgdesc="Example app with ledger integration"
arch=('x86_64')
depends=('01s-ledger' 'zerocli' 'gtk3')
build() { cd "$srcdir/$pkgname-$pkgver"; cargo build --release; }
package() { install -Dm755 target/release/$pkgname "$pkgdir/usr/bin/$pkgname"; }
post_install() { 01s-ledger register-package "$pkgname" "$pkgver"; }
```

## Real-World Scenario: Package Migration

An organization migrates 50 machines from Ubuntu to 01s Sovereign. Process: (1) Export list of installed Ubuntu packages, (2) Cross-reference with Arch Linux equivalents, (3) Create a script that installs all equivalent packages, (4) Run install script on each machine, (5) Verify each machine's ledger shows all expected packages installed. Migration time: 30 min per machine (automated) vs 2 hours manual.

## Package Sources

01s Sovereign uses these package repositories:
1. **Core**: Essential system packages (maintained by Arch)
2. **Extra**: Additional software (maintained by Arch)  
3. **Community**: Community-maintained packages (Arch)
4. **Multilib**: 32-bit compatibility libraries
5. **01s-Core**: 01s Sovereign specific packages
6. **01s-Community**: Community-contributed packages
7. **AUR**: Arch User Repository (user-submitted)

## Repository Configuration

```bash
# /etc/pacman.conf
[core]
Include = /etc/pacman.d/mirrorlist

[extra]
Include = /etc/pacman.d/mirrorlist

[community]
Include = /etc/pacman.d/mirrorlist

[multilib]
Include = /etc/pacman.d/mirrorlist

[01s-core]
Server = https://repo.01s.sovereign/core/$arch

[01s-community]
Server = https://repo.01s.sovereign/community/$arch
```

## Ledger Package Hooks

```ini
# /etc/pacman.d/hooks/01s-ledger-install.hook
[Trigger]
Operation = Install
Operation = Upgrade
Operation = Remove
Type = Package
Target = *

[Action]
Description = Recording package operation in ledger...
When = PostTransaction
Exec = /usr/bin/01s-ledger hook --operation=%S --package=%o
```

## Package Cache Management

```bash
# View cache size
du -sh /var/cache/pacman/pkg/

# Keep only last 3 versions
sudo paccache -rk3

# Remove all uninstalled packages from cache
sudo paccache -ruk0

# Clear entire cache (caution)
sudo pacman -Scc
```

## Package Management Troubleshooting

### Common Issues and Solutions

```bash
# "Failed to commit transaction (conflicting files)"
# A package wants to overwrite a file owned by another package
sudo pacman -Syu --overwrite /path/to/file

# "database is locked"
# Another pacman process is running
rm /var/lib/pacman/db.lck

# "invalid or corrupted package (PGP signature)"
# GPG keyring is out of date
sudo pacman -Sy archlinux-keyring

# "target not found"
# Package name wrong or repository not configured
pacman -Ss keyword

# "could not satisfy dependencies"
# Missing dependency requires explicit install
sudo pacman -S dependency-package
```

### Managing AUR Packages with yay

```bash
# Install yay (AUR helper)
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

# Search AUR
yay -Ss package-name

# Install from AUR
yay -S package-name

# Update all packages (including AUR)
yay -Syu

# Remove package and dependencies
yay -Rns package-name
```

### Package Cache Cleanup

```bash
# Keep only the latest 2 versions of each package
sudo paccache -rk2

# Remove all cached versions of uninstalled packages
sudo paccache -ruk0

# Show cache size
du -sh /var/cache/pacman/pkg/

# Manual cache cleanup
ls -la /var/cache/pacman/pkg/
sudo rm /var/cache/pacman/pkg/old-package-*.pkg.tar.zst
```

## 01s-Specific Package Management

### Custom Repository Setup
```bash
# Create and host your own package repository
mkdir -p /srv/http/01s-repo/x86_64
cd /srv/http/01s-repo/x86_64

# Add packages to repository
repo-add 01s-custom.db.tar.gz my-package-1.0-1-x86_64.pkg.tar.zst

# Configure client to use it
echo "[01s-custom]
Server = http://your-server.com/01s-repo/\$arch" >> /etc/pacman.conf
```

### Package Hold (Prevent Updates)
```bash
# Add package to IgnorePkg in pacman.conf
echo "IgnorePkg = linux linux-headers" >> /etc/pacman.conf

# Ignore package group
echo "IgnoreGroup = libreoffice" >> /etc/pacman.conf

# Prevent specific version upgrades
echo "linux 6.8.5" | sudo tee -a /etc/pacman.d/hooks/linux-hold.hook
```

### Package Query Reference
```bash
# List installed packages with description
pacman -Q | head -20

# Find which package owns a file
pacman -Qo /usr/bin/firefox

# List packages not required by any other
pacman -Qdt

# List explicitly installed packages
pacman -Qe

# Show package information
pacman -Qi 01s-ledger

# List package files
pacman -Ql 01s-ledger
```

## Common Package Groups

| Group | Contents | Size | Purpose |
|-------|----------|------|---------|
| base | Core utilities, glibc, kernel | 500 MB | Essential system |
| base-devel | GCC, make, autotools | 800 MB | Build tools |
| gnome | GNOME desktop environment | 1.2 GB | Desktop |
| gnome-extra | Additional GNOME apps | 600 MB | Extended desktop |
| xfce4 | Lightweight desktop | 400 MB | Alternative DE |
| 01s-sovereign | 01s-specific packages | 150 MB | Core 01s |

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
