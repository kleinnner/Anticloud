# Building a Custom ISO

This guide explains how to build a custom 01s Sovereign ISO with your own modifications.

## Build Environment

The ISO build script (`scripts/build-day1.sh`) requires:

- Linux environment (preferably Arch Linux)
- Root access (mkarchiso requires root)
- archiso package (`pacman -S archiso`)
- Docker/Podman (optional, for containerized builds)
- ImageMagick (for wallpaper processing)

## Build Script Overview

### Day 1 Build (Base System)

The build script creates the complete ISO from scratch:

```bash
# From the project root, run:
sudo bash scripts/build-day1.sh
```

Build stages:

1. **Prepare profile** -- Copy configuration files to working directory
2. **Install packages** -- Install packages from `packages.x86_64`
3. **Copy assets** -- Themes, wallpapers, sounds, GRUB themes
4. **Generate branding** -- Create Plymouth assets, splash images
5. **Integrate 01s-ledger** -- Copy ledger binary and systemd services
6. **Pre-create user** -- Create the 01s user with home directory
7. **Build ISO** -- Run mkarchiso
8. **Copy to output** -- Copy ISO to shared folder with verification
9. **Smoke test** -- Boot ISO in QEMU and verify boot process

### Day 2 Build (Toolchain Overlay)

```bash
# Build toolchain components
for d in zerocli lexer parser codegen runes binary; do
  [ -f day-2/toolchain/$d/Makefile ] && make -C day-2/toolchain/$d
done

# Run Day 2 script
sudo bash scripts/build-day2.sh
```

## Customizing the Build

### Modifying packages.x86_64

The package list is at `day-1/iso/profile/packages.x86_64`:

```bash
# Customize installed packages
nano day-1/iso/profile/packages.x86_64
```

Add or remove package names, one per line.

### Customizing the GRUB Theme

```bash
# Replace GRUB theme
rm -rf day-1/iso/profile/grub/themes/*
cp -r my-grub-theme day-1/iso/profile/grub/themes/

# Update GRUB config
nano day-1/iso/profile/grub/grub.cfg
```

### Customizing Wallpaper

```bash
# Replace wallpaper
cp my-wallpaper.png assets/Wallpaper.png

# Or skip wallpaper generation
# The build script checks assets/Wallpaper.png
```

### Adding Custom Scripts

```bash
# Add scripts to airootfs
mkdir -p day-1/iso/profile/airootfs/usr/local/bin
cp my-custom-script.sh day-1/iso/profile/airootfs/usr/local/bin/
chmod +x day-1/iso/profile/airootfs/usr/local/bin/my-custom-script.sh

# Reference in customize_airootfs.sh
nano day-1/iso/profile/airootfs/root/customize_airootfs.sh
```

### Adding Systemd Services

```bash
# Create service file
mkdir -p day-1/iso/profile/airootfs/etc/systemd/system

sudo tee day-1/iso/profile/airootfs/etc/systemd/system/my-service.service << 'EOF'
[Unit]
Description=My Custom Service

[Service]
Type=simple
ExecStart=/usr/local/bin/my-service.sh

[Install]
WantedBy=multi-user.target
EOF

# Enable in customize_airootfs.sh
echo "systemctl enable my-service.service" >> day-1/iso/profile/airootfs/root/customize_airootfs.sh
```

## Docker Build

The project includes a Dockerfile for containerized builds:

```bash
# Build using Docker
docker build -t 01s-builder -f Dockerfile.archiso-builder .
docker run -it --rm --privileged \
  -v $(pwd):/build:Z \
  01s-builder bash -c "cd /build && bash scripts/build-day1.sh"
```

### Using Podman

```bash
# Build using Podman
sudo podman run -it --rm --privileged \
  -v $(pwd):/build:Z \
  docker.io/archlinux:latest \
  bash -c "pacman -Syu --noconfirm archiso imagemagick && cd /build && bash scripts/build-day1.sh"
```

## Build Output

The build produces:

```
day-1/iso/out/01-sovereign-<version>-x86_64-<date>.iso
```

If the copy step fails, a compressed fallback is created:

```
day-1/iso/out/01-sovereign-<version>-x86_64-<date>.iso.zst
```

## Smoke Testing

The build script automatically runs a QEMU smoke test:

```bash
# Manual QEMU boot
qemu-system-x86_64 -enable-kvm \
  -cdrom day-1/iso/out/01-sovereign-*.iso \
  -m 4096 -vga std -display gtk
```

For serial-only testing:

```bash
qemu-system-x86_64 \
  -drive file=day-1/iso/out/01-sovereign-*.iso,media=cdrom,if=virtio,readonly=on \
  -m 4096 -vga std -nographic -serial mon:stdio
```

## Build Configuration Reference

### Key Files

| File | Purpose |
|------|---------|
| `day-1/VERSION` | Version string for the ISO |
| `day-1/iso/profile/packages.x86_64` | Package list |
| `day-1/iso/profile/profiledef.sh` | ISO profile definition |
| `day-1/iso/profile/pacman.conf` | Pacman configuration for build |
| `day-1/iso/profile/grub/grub.cfg` | GRUB configuration |
| `day-1/iso/profile/airootfs/root/customize_airootfs.sh` | Post-install customization |
| `scripts/build-day1.sh` | Main build script |
| `scripts/build-day2.sh` | Toolchain build script |
| `boot-iso.sh` | Boot the latest ISO |

### Build Options

```bash
# Set version explicitly
VERSION=1.0.0-test bash scripts/build-day1.sh

# Skip QEMU test
NO_QEMU_TEST=1 bash scripts/build-day1.sh

# Clean build
rm -rf day-1/iso/out day-1/iso/work
bash scripts/build-day1.sh
```

## Troubleshooting Builds

| Error | Solution |
|-------|----------|
| `mkarchiso: command not found` | Install archiso: `pacman -S archiso` |
| `Permission denied` | Run as root: `sudo bash scripts/build-day1.sh` |
| `vboxsf I/O hang` | The script uses local tmpfs to avoid this |
| `Package not found` | Check package name in packages.x86_64 |
| `Space exhausted` | Ensure > 10 GB free space for build |
| `CRLF line endings` | Script auto-fixes with sed |

---


## ISO Build System Architecture

`mermaid
graph TD
    A[build-day1.sh] --> B[Shared Profile]
    A --> C[Local Profile]
    A --> D[AI Root FS]
    B --> E[GRUB Theme]
    B --> F[Plymouth Theme]
    B --> G[DevShell Scripts]
    B --> H[Ledger Services]
    D --> I[Package Installation]
    D --> J[Theme Installation]
    D --> K[Sound Files]
    D --> L[User Config]
    C --> M[profiledef.sh]
    C --> N[packages.x86_64]
    C --> O[pacman.conf]
    A --> P[ISO Output]
`

## Build Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| profiledef.sh | ISO metadata and boot modes | iso/profile/ |
| packages.x86_64 | List of packages to include | iso/profile/ |
| pacman.conf | Pacman config for build | iso/profile/ |
| uild-day1.sh | Main build orchestration | scripts/ |
| uild-day2.sh | Toolchain build | scripts/ |
| irootfs/ | Additional files for live system | iso/profile/ |

## Build Environment Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Disk space | 10 GB | 30 GB |
| RAM | 2 GB | 8 GB |
| CPU | 2 cores | 4+ cores |
| Internet | 10 Mbps | 50+ Mbps |
| Build time | 30 min | 15 min (SSD) |

## Build Phases

1. **Environment Setup**: Create temp directories, verify dependencies
2. **Package Installation**: Copy package manifest, configure pacman, download packages
3. **Theme Integration**: Extract themes, configure branding, generate Plymouth assets
4. **Custom Content**: Install scripts, configure Firefox, sound scheme, systemd services
5. **Build ISO**: Run mkarchiso, generate checksums, copy output

## Customizing packages.x86_64

`ash
# Edit package list
nano iso/profile/packages.x86_64

# Add packages (one per line)
# my-package

# Remove packages (delete line or comment with #)

# Rebuild
./build-day1.sh
`

## Build Validation

`ash
# Check ISO size
ls -lh out/*.iso

# Verify checksum
sha256sum out/*.iso

# Test in QEMU
qemu-system-x86_64 -cdrom out/*.iso -m 2048

# Check GRUB in ISO
isoinfo -R -f -i out/*.iso | grep grub
`

## Build Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| mkarchiso not found | archiso not installed | sudo pacman -S archiso |
| Package download fails | Network issue | Check internet and mirror list |
| Disk full during build | Not enough space | Clear /tmp and rebuild |
| Permission denied | File ownership | Build as non-root with sudo |
| ISO too large | Too many packages | Remove unused packages |

## Practice Exercises

1. **Minimal ISO**: Remove all optional packages and build a minimal ISO
2. **Custom Theme**: Replace the default wallpaper with a custom image
3. **Add Package**: Add a new package to packages.x86_64 and rebuild
4. **Version Bump**: Update the ISO version in profiledef.sh and rebuild


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
| Build fails early | Missing dependencies | Install rchiso package |
| ISO too large | Too many packages | Remove unnecessary packages |
| Boot fails | Wrong boot mode | Check profiledef.sh bootmodes |
| Network not working | Missing firmware | Add linux-firmware to packages |
| Theme not applied | Missing assets | Check theme paths in build script |

## Verification Checklist

- [ ] Build completes without errors
- [ ] ISO file exists and has reasonable size
- [ ] ISO boots in QEMU
- [ ] Desktop loads with auto-login
- [ ] Custom theming is visible
- [ ] Ledger is initialized
- [ ] Checksums match


## See Also

- [QEMU Testing](22-qemu-testing.md)
- [First Boot Walkthrough](05-first-boot-walkthrough.md)
- [Contributing Back](25-contributing-back.md)

### Common Pitfalls (Custom ISO)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| Build takes too long | No parallel compression | Use xz -T0 or zstdmt for multicore |
| ISO exceeds 4.7 GB | DVD media limit exceeded | Remove large packages or split into multiple ISOs |
| Boot fails on UEFI systems | Missing bootloader files | Verify profiledef.sh includes UEFI bootloader |
| AUR packages fail to build | Network required during build | Pre-download all AUR sources before offline build |
| Custom theme not applied | Wrong asset paths | Verify theme files exist in releng/airootfs |

## Practice Exercises (Advanced)

1. **Minimal ISO Build**: Create a minimal 01s ISO (under 1 GB) with only essential packages; test boot time difference
2. **Enterprise ISO**: Build a custom ISO with pre-configured network settings, security policies, and monitoring tools
3. **Automated Build Pipeline**: Set up a CI/CD pipeline that rebuilds the custom ISO on every commit to the build config
4. **Multi-Variant ISO**: Create three ISO variants (desktop, server, minimal) and compare their package sets
5. **ISO Signing and Verification**: Set up GPG signing of your custom ISO in the build script; create a verification guide

## Further Reading

- [Post-Installation Setup](07-post-installation-setup.md) — After ISO install
- [QEMU Testing](22-qemu-testing.md) — Testing custom ISOs
- [Day1 ISO Build System](../features/02-day1-iso-build-system.md) — Build system details
- [Building from Source](../developers/03-building-from-source.md) — Source build
- [Contributing Back](25-contributing-back.md) — Share your ISO config
- [Installation FAQ](../faq/02-installation-faq.md) — Common issues
- [Boot Troubleshooting](../help/02-boot-troubleshooting.md) — Boot issues
- [Package Maintainer Guide](../developers/16-package-maintainer-guide.md) — Packages
- [Enterprise Deployment](../enterprise/02-deployment-models.md) — Mass deployment
- [SBOM Overview](../bdr/04-sbom-overview.md) — Software bill of materials

## Build Profile Structure

```
releng/
├── airootfs/etc/skel/     # Skeleton files
├── airootfs/etc/pacman.d/ # Repository configs
├── efiboot/               # UEFI boot loader
├── isolinux/              # BIOS boot loader
├── profiledef.sh          # Build profile
├── packages.x86_64        # Package list
└── pacman.conf            # pacman config
```

## packages.x86_64 Example

```
01s-sovereign-desktop
01s-ledger
zerocli
01s-toolchain
gnome gnome-tweaks gnome-shell-extensions
base-devel git vim rust
firefox thunderbird htop vlc gimp
linux-firmware amd-ucode intel-ucode
```

## Real-World Scenario: Enterprise Custom ISO

A hospital builds a custom ISO for 200 nursing stations: (1) Remove all games and media applications, (2) Add healthcare-specific packages (EMR client, medical imaging viewer), (3) Pre-configure network settings for hospital LAN, (4) Set security policies (firewall, AppArmor, mandatory logging), (5) Add custom SSL certificates, (6) Pre-install monitoring agent. Build time: 15 minutes. ISO size: 2.8 GB. Deployment: PXE boot with automated install.

## Complete Build Profile Reference

```bash
# profiledef.sh
iso_name="01s-custom"
iso_label="01S_CUSTOM_$(date +%Y%m)"
iso_publisher="My Organization"
iso_application="01s Sovereign Custom Build"
iso_version="$(date +%Y.%m)"
install_dir="arch"
buildmodes=('iso')
bootmodes=('bios.syslinux.mbr' 'bios.syslinux.eltorito'
           'uefi-x64.systemd-boot.esp' 'uefi-x64.systemd-boot.eltorito')
arch="x86_64"
pacman_conf="pacman.conf"
airootfs_image_type="squashfs"
airootfs_image_tool_options=('-comp' 'xz' '-Xbcj' 'x86' '-b' '1M')
file_permissions=(
  ["/etc/shadow"]="0:0:400"
  ["/etc/gshadow"]="0:0:400"
  ["/root"]="0:0:750"
)
```

## Adding Custom Files to ISO

```bash
# Create custom files in airootfs/
mkdir -p releng/airootfs/etc/systemd/system/
mkdir -p releng/airootfs/usr/local/bin/
mkdir -p releng/airootfs/home/01s/.config/

# Add custom wallpaper
cp my-wallpaper.jpg releng/airootfs/usr/share/backgrounds/01s/

# Add custom scripts
cat > releng/airootfs/usr/local/bin/setup.sh << 'SCRIPT'
#!/bin/bash
# Custom setup script run on first boot
01s-ledger init
timedatectl set-timezone America/New_York
SCRIPT
chmod +x releng/airootfs/usr/local/bin/setup.sh
```

## ISO Compression Comparison

| Method | Compression Ratio | Build Time | Boot Impact |
|--------|------------------|------------|-------------|
| gzip (default) | 2.1x | 5 min | Fast decompress |
| xz (default) | 3.8x | 25 min | Slow decompress |
| zstd (recommended) | 3.2x | 8 min | Fast decompress |
| lz4 | 1.8x | 3 min | Very fast decompress |
| lzo | 1.9x | 4 min | Very fast decompress |

## Troubleshooting ISO Builds

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot find rootfs image" | Missing airootfs | Check releng/airootfs exists |
| "Package not found" | Wrong repository | Update pacman.conf with correct repos |
| "Out of memory" | Build too large | Use tmpfs with more RAM or smaller package set |
| "Signing key not found" | GPG not configured | Run `pacman-key --init && pacman-key --populate` |
| "File too large for ISO" | ISO exceeds 4.7 GB | Remove packages or use dual-layer DVD |
| "UEFI boot fails" | Missing OVMF firmware | Add `bootmodes` for UEFI in profiledef.sh |
| "Network unreachable" | Build needs internet | Pre-download all packages or use local mirror |
| "Permission denied" | File ownership issues | Check file_permissions in profiledef.sh |

## Custom ISO Examples

### Kiosk ISO (Minimal + Browser)
```
# packages.x86_64
01s-sovereign-base
firefox
xorg-server
xorg-xinit
openbox
```

### Developer ISO (Full Dev Tools)
```
# packages.x86_64
01s-sovereign-desktop
01s-ledger zerocli 01s-toolchain
base-devel git vim emacs
rust go python nodejs
docker docker-compose
postgresql redis
```

### Server ISO (No Desktop)
```
# packages.x86_64
01s-sovereign-base
01s-ledger zerocli
nginx postgresql redis
openssh fail2ban
nftables
```

## Performance Tuning for ISO Builds

```bash
# Use tmpfs for build directory (requires enough RAM)
mkarchiso -v -w /dev/shm/archiso-tmp -o /output .

# Parallel compression
export COMPRESSION="zstd"
export COMPRESSION_OPTIONS="-T0 --ultra -22"

# Faster package downloads
# Edit /etc/pacman.conf to enable parallel downloads
ParallelDownloads = 10

# Skip package integrity check (not recommended for production)
# Add to mkarchiso command: -C pacman.conf -D /path/to/custom/repo
```

## ISO Customization Examples

### Adding Pre-installed Packages
```bash
# Edit packages.x86_64 to include your custom packages
echo "my-custom-package" >> releng/packages.x86_64

# If using AUR packages, pre-build them:
mkdir -p releng/airootfs/root/aur-packages
cd releng/airootfs/root/aur-packages
git clone https://aur.archlinux.org/yay.git
cd yay && makepkg -si
cd /root
```

### Customizing Boot Splash
```bash
# Replace Plymouth theme
git clone https://github.com/your-org/custom-plymouth-theme.git
cp -r custom-plymouth-theme releng/airootfs/usr/share/plymouth/themes/
echo "plymouth-theme = custom-plymouth-theme" >> releng/airootfs/etc/plymouth/plymouthd.conf
```

### Pre-configuring Network
```bash
# Add NetworkManager connection profile
mkdir -p releng/airootfs/etc/NetworkManager/system-connections/
cat > releng/airootfs/etc/NetworkManager/system-connections/office.nmconnection << 'NM'
[connection]
id=Office WiFi
type=wifi

[wifi]
ssid=CompanyNet
mode=infrastructure

[wifi-security]
key-mgmt=wpa-psk
psk=your-password

[ipv4]
method=auto
NM
chmod 600 releng/airootfs/etc/NetworkManager/system-connections/office.nmconnection
```

### Setting Default Applications
```bash
# Set default browser
cat > releng/airootfs/etc/skel/.config/mimeapps.list << 'MIME'
[Default Applications]
x-scheme-handler/http=firefox.desktop
x-scheme-handler/https=firefox.desktop
text/html=firefox.desktop
MIME
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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com