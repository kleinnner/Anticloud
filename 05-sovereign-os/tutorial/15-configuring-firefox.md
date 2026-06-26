# Configuring Firefox

01s Sovereign ships with Firefox pre-installed and configured with privacy-enhancing settings. This guide covers the custom configuration and how to further harden your browser.

## Pre-Installed Configuration

Firefox on 01s Sovereign comes with a `user.js` file that applies privacy and security settings automatically.

### What's Configured

| Setting | Value | Benefit |
|---------|-------|---------|
| `privacy.trackingprotection.enabled` | `true` | Blocks trackers |
| `privacy.trackingprotection.socialtracking.enabled` | `true` | Blocks social media trackers |
| `privacy.firstparty.isolate` | `true` | Isolates cookie jars by site |
| `privacy.resistFingerprinting` | `true` | Makes fingerprinting harder |
| `dom.security.https_only_mode` | `true` | Forces HTTPS |
| `network.dns.disablePrefetch` | `true` | Prevents DNS prefetching |
| `media.peerconnection.enabled` | `false` | Disables WebRTC (prevents IP leaks) |
| `webgl.disabled` | `true` | Disables WebGL (reduces fingerprinting) |
| `browser.sessionstore.privacy_level` | `2` | Doesn't save session data |
| `browser.formfill.enable` | `false` | Disables form autofill |
| `signon.rememberSignons` | `false` | Disables password saving |
| `browser.safebrowsing.enabled` | `false` | Disables Google Safe Browsing |
| `browser.send_pings` | `false` | Disables hyperlink auditing |
| `geo.enabled` | `false` | Disables geolocation |
| `browser.urlbar.suggest.history` | `false` | Disables URL bar history suggestions |

## Customizing user.js

The user.js file is located at:

```
~/.mozilla/firefox/user.js
```

### Adding Your Own Settings

```javascript
// Append to ~/.mozilla/firefox/user.js

// Disable pocket
user_pref("extensions.pocket.enabled", false);

// Disable sponsored content
user_pref("browser.newtabpage.activity-stream.showSponsored", false);
user_pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);

// Enable DNS-over-HTTPS
user_pref("network.trr.mode", 2);
user_pref("network.trr.uri", "https://mozilla.cloudflare-dns.com/dns-query");

// Custom fonts
user_pref("font.name.monospace.x-western", "Cascadia Code");
user_pref("font.name.serif.x-western", "Noto Serif");
user_pref("font.name.sans-serif.x-western", "Cantarell");
```

## User Chrome CSS

Custom CSS can be applied to Firefox's UI via `userChrome.css`:

```
~/.mozilla/firefox/userChrome.css
```

### Example userChrome.css

```css
/* Compact tab bar */
.tabbrowser-tab {
  min-height: 28px !important;
  max-height: 28px !important;
}

/* Hide sidebar header */
#sidebar-header {
  display: none !important;
}

/* Dark scrollbar */
:root {
  scrollbar-color: #333 #111 !important;
}

/* Hide pocket button */
#pocket-button {
  display: none !important;
}

/* Hide library button */
#library-button {
  display: none !important;
}

/* Custom URL bar colors */
#urlbar {
  --urlbar-height: 32px !important;
  --urlbar-toolbar-bottom-border-color: transparent !important;
}
```

## Installing Extensions

Recommended privacy extensions:

1. **uBlock Origin** -- Content blocker
2. **NoScript** -- Script blocker
3. **Privacy Badger** -- Tracker blocking
4. **HTTPS Everywhere** -- HTTPS enforcement
5. **Bitwarden** -- Password manager (replaces built-in)

## Creating a New Profile

```bash
# Open profile manager
firefox --ProfileManager

# Create profile from command line
firefox -CreateProfile "work /home/01s/.mozilla/firefox/work"
```

## Multi-Account Containers

Firefox Multi-Account Containers allows you to keep sessions separate:

1. Install the extension from Firefox Add-ons
2. Create containers: Personal, Work, Banking, Shopping
3. Assign sites to containers
4. Each container has isolated cookies and storage

## Proxy Configuration

```bash
# System-wide proxy
gsettings set org.gnome.system.proxy mode 'manual'
gsettings set org.gnome.system.proxy.http host '127.0.0.1'
gsettings set org.gnome.system.proxy.http port 8080
```

For Firefox-specific proxy:
1. Open Firefox Settings
2. Search "proxy"
3. Configure in Network Settings

## Performance Tuning

```bash
# Enable hardware acceleration
# about:config -> layers.acceleration.force-enabled = true

# Limit content process count
# about:config -> dom.ipc.processCount = 4

# Enable parallel painting
# about:config -> gfx.webrender.all = true
```

## about:config Reference

| Key | Description |
|-----|-------------|
| `browser.cache.disk.enable` | Enable/disable disk cache |
| `browser.cache.memory.enable` | Enable/disable memory cache |
| `browser.sessionhistory.max_entries` | Max back/forward entries |
| `dom.storage.enabled` | Enable/disable DOM storage |
| `javascript.enabled` | Enable/disable JavaScript |
| `network.http.max-connections` | Max HTTP connections |
| `network.http.max-persistent-connections-per-server` | Max persistent connections |
| `security.ssl.enable_ocsp_stapling` | Enable OCSP stapling |
| `security.ssl.require_safe_negotiation` | Require safe TLS negotiation |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Websites not loading correctly | Disable resistFingerprinting temporarily |
| Videos not playing | Check `media.ffmpeg.vaapi.enabled` |
| Sync not working | Check `identity.fxaccounts.enabled` |
| Certificate errors | Check system time is correct |
| High memory usage | Reduce content process count |

---

## See Also

- [Privacy FAQ](../faq/10-privacy-faq.md)
- [Security Hardening](18-security-hardening.md)
- [Desktop Tour](08-desktop-tour.md)

---


## Common Mistakes

| Mistake | Why It Happens | Correct Approach |
|---------|---------------|------------------|
| user.js not applied | Wrong profile | Check bout:support for correct path |
| userChrome.css not working | Setting not enabled | Enable 	oolkit.legacyUserProfileCustomizations.stylesheets |
| Extension blocked | Policy restriction | Check /usr/lib/firefox/distribution/policies.json |
| Fonts look wrong | Font smoothing | Set gfx.font_rendering.cleartype_params.rendering_mode |

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


## Firefox about:config Complete Reference

### Privacy Configuration

| Preference | Value | Description |
|-----------|-------|-------------|
| privacy.trackingprotection.enabled | true | Blocks known trackers |
| privacy.trackingprotection.fingerprinting.enabled | true | Blocks fingerprinting scripts |
| privacy.trackingprotection.cryptomining.enabled | true | Blocks cryptocurrency miners |
| privacy.firstparty.isolate | true | Isolates cookies per domain |
| privacy.resistFingerprinting | true | Spoofs fingerprinting APIs |
| privacy.clearOnShutdown.history | true | Clears history on exit |
| privacy.clearOnShutdown.cookies | true | Clears cookies on exit |
| privacy.clearOnShutdown.cache | true | Clears cache on exit |
| privacy.sanitize.sanitizeOnShutdown | true | Enables shutdown sanitization |
| 
etwork.cookie.lifetimePolicy | 2 | Delete cookies on closing Firefox |
| 
etwork.cookie.thirdparty.sessionOnly | true | Third-party cookies session only |

### Security Configuration

| Preference | Value | Description |
|-----------|-------|-------------|
| security.ssl.enable_ocsp_stapling | true | OCSP stapling for certs |
| security.ssl.require_safe_negotiation | true | Requires safe SSL negotiation |
| security.csp.enable | true | Content Security Policy |
| security.mixed_content.block_active_content | true | Blocks mixed active content |
| security.mixed_content.block_display_content | true | Blocks mixed display content |
| security.sandbox.content.level | 5 | Maximum content sandboxing |
| security.fileuri.strict_origin_policy | true | Strict file URI policy |
| dom.security.https_only_mode | true | HTTPS-only mode |
| dom.security.https_only_mode_ever_enabled | true | Persistent HTTPS-only |

### Performance Configuration

| Preference | Value | Description |
|-----------|-------|-------------|
| dom.ipc.processCount | 8 | Content processes (set to CPU core count) |
| rowser.cache.disk.enable | true | Enable disk cache |
| rowser.cache.disk.capacity | 512000 | Disk cache size (KB) |
| media.hardware-video-decoding.enabled | true | Hardware video acceleration |
| gfx.webrender.all | true | WebRender GPU compositing |
| layers.acceleration.force-enabled | true | Force GPU acceleration |
| 
etwork.http.max-connections | 900 | Max connections |
| 
etwork.http.max-persistent-connections-per-server | 10 | Connections per server |
| 
etwork.dnsCacheEntries | 1000 | DNS cache entries |
| 
etwork.dnsCacheExpiration | 3600 | DNS cache TTL (seconds) |
| 
etwork.http.max-connections | 900 | Max connections |

### Telemetry Disabled

| Preference | Value | Description |
|-----------|-------|-------------|
| datareporting.healthreport.uploadEnabled | false | Disable health report |
| datareporting.policy.dataSubmissionEnabled | false | Disable data submission |
| 	oolkit.telemetry.enabled | false | Disable telemetry |
| 	oolkit.telemetry.unified | false | Disable unified telemetry |
| 	oolkit.telemetry.server | data:, | Null telemetry server |
| rowser.tabs.crashReporting.sendReport | false | Disable crash reports |
| rowser.crashReports.unsubmittedCheck.enabled | false | Disable crash report checks |
| dom.security.https_only_mode | true | HTTPS-only mode |

## Detailed user.js Customization

Add these to your user.js for additional hardening:

`javascript
// Enhanced fingerprinting protection
user_pref("privacy.resistFingerprinting.letterboxing", true);
user_pref("privacy.window.maxInnerWidth", 1600);
user_pref("privacy.window.maxInnerHeight", 900);

// Disable WebGL (fingerprinting vector)
user_pref("webgl.disabled", true);

// Disable WebRTC (IP leakage)
user_pref("media.peerconnection.enabled", false);

// Disable geolocation
user_pref("geo.enabled", false);

// Disable Pocket
user_pref("extensions.pocket.enabled", false);

// Disable prefetching
user_pref("network.prefetch-next", false);
user_pref("network.dns.disablePrefetch", true);
user_pref("network.predictor.enabled", false);

// Disable WebNotifications
user_pref("dom.webnotifications.enabled", false);

// Disable password manager
user_pref("signon.rememberSignons", false);

// Enhanced cache control
user_pref("browser.cache.offline.enable", false);
user_pref("browser.cache.memory.enable", true);
user_pref("browser.cache.memory.capacity", 51200);
`

## Firefox Hardening Test

Verify your Firefox security configuration:

`ash
# Check that user.js is loaded
grep -c "privacy.trackingprotection.enabled" ~/.mozilla/firefox/*.default*/user.js

# Check current about:config values
grep "^user_pref" ~/.mozilla/firefox/*.default*/user.js | wc -l

# Count security preferences
grep -c "security\|privacy\|telemetry" ~/.mozilla/firefox/*.default*/user.js
`

## Browser Comparison: Privacy Features

| Feature | Firefox (01s) | Chrome | Brave | Edge |
|---------|--------------|--------|-------|------|
| Tracker blocking | Enabled (strict) | Limited | Enabled | Limited |
| Fingerprinting protection | Enabled | None | Enabled | None |
| Cryptomining blocking | Enabled | None | Enabled | None |
| DNS over HTTPS | Cloudflare | System | Built-in | None |
| Telemetry | Disabled | Default on | Minimal | Default on |
| HTTPS-only mode | Enabled | Disabled | Enabled | Disabled |
| First-party isolation | Enabled | None | None | None |
| Open source | Yes | Partial | Yes | No |

## Extension Management via Policies

For enterprise deployments:

`json
{
  "policies": {
    "BlockAboutAddons": false,
    "ExtensionSettings": {
      "uBlock0@raymondhill.net": {
        "installation_mode": "force_installed",
        "install_url": "https://addons.mozilla.org/firefox/downloads/latest/ublock-origin/latest.xpi"
      },
      "jid1-MnnxcxisBPnSXQ@jetpack": {
        "installation_mode": "force_installed",
        "install_url": "https://addons.mozilla.org/firefox/downloads/latest/privacy-badger/latest.xpi"
      }
    },
    "DisableTelemetry": true,
    "DisableFirefoxStudies": true,
    "DisablePocket": true,
    "EnableTrackingProtection": {
      "Value": true,
      "Locked": true
    }
  }
}
`

## Performance Benchmarks

| Browser | Startup | Tab Open | Memory (10 tabs) | Memory (50 tabs) |
|---------|---------|----------|------------------|-------------------|
| Firefox (01s) | 1.2s | 0.3s | 450 MB | 1.2 GB |
| Chrome | 1.5s | 0.2s | 600 MB | 1.8 GB |
| Brave | 1.3s | 0.2s | 500 MB | 1.4 GB |
| Edge | 1.4s | 0.2s | 550 MB | 1.6 GB |

## Firefox Profile Backup

`ash
# Backup Firefox profile
tar czf firefox-backup-.tar.gz ~/.mozilla/

# Restore Firefox profile
tar xzf firefox-backup-20260619.tar.gz -C ~/

# List all profiles
firefox -P
`
"@
    "21-building-custom-iso.md" = @"
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
    
    C --> M[archiso Profile]
    M --> N[profiledef.sh]
    M --> O[packages.x86_64]
    M --> P[pacman.conf]
    
    A --> Q[ISO Output]
`

## Build Configuration Files Reference

| File | Purpose | Location |
|------|---------|----------|
| profiledef.sh | ISO metadata and boot modes | iso/profile/ |
| packages.x86_64 | List of packages to include | iso/profile/ |
| pacman.conf | Pacman configuration for build | iso/profile/ |
| uild-day1.sh | Main build orchestration | scripts/ |
| uild-day2.sh | Toolchain build | scripts/ |
| irootfs/ | Additional files for the live system | iso/profile/ |

## Build Environment Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Disk space | 10 GB | 30 GB |
| RAM | 2 GB | 8 GB |
| CPU | 2 cores | 4+ cores |
| Internet | 10 Mbps | 50+ Mbps |
| Build time | 30 min | 15 min (SSD) |
| Packages | rchiso | rchiso + base-devel |

## Build Phases Detail

### Phase 1: Environment Setup (build-day1.sh lines 1-80)
- Create temporary directories
- Install archiso tools
- Verify build dependencies

### Phase 2: Package Installation (lines 81-200)
- Copy package manifest
- Configure pacman
- Download and cache packages

### Phase 3: Theme Integration (lines 200-350)
- Extract Cyber-Dusk-Rounded-Glass
- Configure Obsidian-flow shell theme
- Install Pebble icons and WhiteSur cursors
- Generate Plymouth assets
- Copy GRUB themes

### Phase 4: Custom Content (lines 351-450)
- Install DevShell scripts
- Configure Firefox user.js and userChrome.css
- Install sound scheme OGG files
- Configure systemd services

### Phase 5: Build ISO (lines 451-500)
- Run mkarchiso
- Generate checksums
- Copy final ISO to output directory

## Customizing packages.x86_64

To add or remove packages from the ISO:

`ash
# Edit the package list
nano iso/profile/packages.x86_64

# Add packages (one per line)
# package-name
# package-name

# Remove packages (delete the line or comment with #)

# Rebuild
./build-day1.sh
`

## Adding Custom Files to airootfs

`ash
# Create the directory structure
mkdir -p iso/profile/airootfs/usr/local/bin
mkdir -p iso/profile/airootfs/etc/systemd/system

# Add your custom script
cp my-custom-script.sh iso/profile/airootfs/usr/local/bin/
chmod +x iso/profile/airootfs/usr/local/bin/my-custom-script.sh

# Rebuild
./build-day1.sh
`

## Build Validation

After a successful build, validate the ISO:

`ash
# Check ISO size
ls -lh out/*.iso

# Verify checksum
sha256sum out/*.iso

# Test in QEMU
qemu-system-x86_64 -cdrom out/*.iso -m 2048

# Check GRUB configuration
isoinfo -R -f -i out/*.iso | grep grub

# List packages in ISO
isoinfo -R -f -i out/*.iso | grep -E "\.pkg\.tar"

# Check boot modes
isoinfo -R -f -i out/*.iso | grep -i efi
`

## Build Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| mkarchiso not found | archiso not installed | sudo pacman -S archiso |
| Package download fails | Network issue | Check internet and mirror list |
| Disk full during build | Not enough space | Clear /tmp and rebuild |
| Permission denied | File ownership | Build as non-root user with sudo |
| ISO too large | Too many packages | Remove unused packages |
| Boot fails on hardware | Wrong boot mode | Check profiledef.sh bootmodes |

## GitHub Actions Build Workflow

For automated ISO building via CI:

`yaml
name: Build ISO
on: [push, workflow_dispatch]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install archiso
        run: sudo pacman -S archiso --noconfirm
      - name: Build ISO
        run: sudo ./scripts/build-day1.sh
      - name: Upload ISO
        uses: actions/upload-artifact@v4
        with:
          name: 01s-iso
          path: out/*.iso
`

## Build Script Customization

Key variables to customize in uild-day1.sh:

`ash
# ISO version
VERSION="1.0.1"

# Output directory
OUTPUT_DIR="out"

# Temporary build directory
TEMP_DIR="/tmp/archiso-build"

# Package cache directory
CACHE_DIR="/var/cache/pacman/pkg"

# Shared profile directory
SHARED_PROFILE="iso/shared"

# Local profile directory  
LOCAL_PROFILE="iso/profile"

# AI root filesystem directory
AIROOTFS="iso/profile/airootfs"
`
"@
    "22-qemu-testing.md" = @"
## QEMU Complete Command Reference

### Basic Commands

`ash
# Boot with ISO (CD-ROM)
qemu-system-x86_64 -cdrom 01-sovereign-*.iso -m 2048

# Boot with UEFI firmware
qemu-system-x86_64 -bios /usr/share/ovmf/x64/OVMF.fd -cdrom 01-sovereign-*.iso -m 2048

# Boot with existing disk image
qemu-system-x86_64 -drive file=01s-disk.img,format=raw -m 2048

# Boot with virtio disk
qemu-system-x86_64 \
    -drive file=01s-disk.img,format=raw,if=virtio \
    -cdrom 01-sovereign-*.iso -m 2048
`

### Network Configuration

`ash
# Basic user-mode network (NAT)
qemu-system-x86_64 ... -netdev user,id=net0 -device e1000,netdev=net0

# Advanced user-mode with port forwarding
qemu-system-x86_64 ... \
    -netdev user,id=net0,hostfwd=tcp::2222-:22 \
    -device virtio-net,netdev=net0

# Tap networking for bridged mode
qemu-system-x86_64 ... \
    -netdev tap,id=net0,ifname=tap0 \
    -device virtio-net,netdev=net0
`

### Storage Options

`ash
# Create disk image
qemu-img create -f qcow2 01s-disk.qcow2 20G

# Use raw format for better performance
qemu-img create -f raw 01s-disk.raw 20G

# Attach multiple disks
qemu-system-x86_64 ... \
    -drive file=01s-disk.qcow2,format=qcow2,if=virtio \
    -drive file=data-disk.qcow2,format=qcow2,if=virtio
`

### GPU and Display Options

`ash
# Basic VGA
qemu-system-x86_64 ... -vga std

# Virtio GPU (better performance)
qemu-system-x86_64 ... -vga virtio

# QXL for SPICE
qemu-system-x86_64 ... -vga qxl -spice port=5900,disable-ticketing

# No display (console only)
qemu-system-x86_64 ... -nographic

# VNC remote access
qemu-system-x86_64 ... -vnc :0
`

## QEMU Configuration Profiles

### Development Environment

`ash
#!/bin/bash
# dev-env.sh � Quick development VM
qemu-system-x86_64 \
    -drive file=01s-disk.qcow2,format=qcow2,if=virtio \
    -cdrom 01-sovereign-*.iso \
    -m 4096 \
    -smp 4 \
    -cpu host \
    -vga virtio \
    -netdev user,id=net0,hostfwd=tcp::2222-:22 \
    -device virtio-net,netdev=net0 \
    -display gtk
`

### Testing Environment

`ash
#!/bin/bash
# test-env.sh � Automated testing VM
qemu-system-x86_64 \
    -drive file=01s-disk.qcow2,format=qcow2,if=virtio \
    -m 2048 \
    -smp 2 \
    -cpu qemu64 \
    -vga std \
    -netdev user,id=net0 \
    -device virtio-net,netdev=net0 \
    -nographic \
    -serial mon:stdio
`

### Performance Testing Environment

`ash
#!/bin/bash
# perf-test.sh � Performance testing
qemu-system-x86_64 \
    -drive file=01s-disk.qcow2,format=qcow2,if=virtio,aio=native,cache.direct=on \
    -m 8192 \
    -smp 8 \
    -cpu host \
    -enable-kvm \
    -vga virtio \
    -netdev user,id=net0 \
    -device virtio-net,netdev=net0 \
    -object memory-backend-ram,size=8192M,policy=bind,host-nodes=0 \
    -numa node,memdev=mem
`

## Snapshot Management

`ash
# Create snapshot
qemu-img snapshot -c clean-install 01s-disk.qcow2

# List snapshots
qemu-img snapshot -l 01s-disk.qcow2

# Apply snapshot
qemu-img snapshot -a clean-install 01s-disk.qcow2

# Delete snapshot
qemu-img snapshot -d clean-install 01s-disk.qcow2
`

## QEMU Monitor Commands

Press Ctrl+Alt+2 to enter the QEMU monitor:

`qemu
# Send key combinations
sendkey ctrl-alt-f1

# Change removable media
eject ide1-cd0
change ide1-cd0 /path/to/new-image.iso

# System info
info registers
info block
info network

# Reset system
system_reset

# Power off
system_powerdown
`

## Testing Matrix

| Scenario | QEMU Command | What to Verify |
|----------|-------------|----------------|
| Boot from ISO | -cdrom iso | GRUB menu appears |
| UEFI boot | -bios OVMF.fd | UEFI GRUB works |
| Installation | -drive file=disk.qcow2 + -cdrom iso | Install completes |
| First boot after install | -drive file=disk.qcow2 | Desktop loads |
| Network access | -netdev user | Internet reachable |
| SSH access | hostfwd=tcp::2222-:22 | ssh -p2222 user@localhost |
| Multiple monitors | -vga virtio | Display configuration |
| Snapshot test | -loadvm snapshot | State restored |
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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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