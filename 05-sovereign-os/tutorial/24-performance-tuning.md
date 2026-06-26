# Performance Tuning

This guide covers optimizing 01s Sovereign for maximum performance.

## Kernel Parameters

Edit `/etc/sysctl.d/99-performance.conf`:

```bash
# Reduce swappiness (use RAM, not swap)
vm.swappiness = 10

# Increase file system cache
vm.vfs_cache_pressure = 50
vm.dirty_ratio = 30
vm.dirty_background_ratio = 5

# Network buffer tuning
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 87380 134217728
net.ipv4.tcp_wmem = 4096 65536 134217728

# Enable TCP fast open
net.ipv4.tcp_fastopen = 3

# Reduce timeouts
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_tw_reuse = 1
```

Apply:

```bash
sudo sysctl -p /etc/sysctl.d/99-performance.conf
```

## GRUB Kernel Parameters

Edit `/etc/default/grub`:

```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash mitigations=off nowatchdog"
```

- `mitigations=off` -- Disable CPU vulnerability mitigations (security vs performance tradeoff)
- `nowatchdog` -- Disable watchdog timers (saves power/CPU)
- `nmi_watchdog=0` -- Disable NMI watchdog

Regenerate:

```bash
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

## I/O Schedulers

### Check Current Scheduler

```bash
cat /sys/block/sda/queue/scheduler
```

### Change Scheduler

```bash
# For NVMe SSD (use none/mq-deadline)
echo none | sudo tee /sys/block/nvme0n1/queue/scheduler

# For SATA SSD (use mq-deadline)
echo mq-deadline | sudo tee /sys/block/sda/queue/scheduler

# For HDD (use bfq)
echo bfq | sudo tee /sys/block/sda/queue/scheduler
```

### Permanent via udev

Create `/etc/udev/rules.d/60-iosched.rules`:

```
ACTION=="add|change", KERNEL=="sd*", ATTR{queue/scheduler}="mq-deadline"
ACTION=="add|change", KERNEL=="nvme*", ATTR{queue/scheduler}="none"
```

## ZRAM (Compressed RAM Swap)

```bash
# Install zram-generator
sudo pacman -S zram-generator

# Configure
sudo tee /etc/systemd/zram-generator.conf << 'EOF'
[zram0]
zram-size = ram / 2
compression-algorithm = zstd
swap-priority = 100
EOF

# Enable
sudo systemctl daemon-reload
sudo systemctl start systemd-zram-setup@zram0

# Verify
swapon --show
```

## CPU Frequency Scaling

```bash
# Check governor
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

# Set performance governor
echo performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
```

### Install cpupower

```bash
sudo pacman -S cpupower

# Set governor
sudo cpupower frequency-set -g performance

# Monitor frequency
watch -n 1 cpupower monitor
```

## Systemd Optimization

```bash
# Analyze boot
systemd-analyze
systemd-analyze blame

# Disable unnecessary services
sudo systemctl disable bluetooth.service
sudo systemctl disable cups.service

# Limit journal size
sudo journalctl --vacuum-size=100M

# Configure journald
sudo tee -a /etc/systemd/journald.conf << 'EOF'
SystemMaxUse=100M
SystemMaxFileSize=50M
MaxFileSec=1week
ForwardToSyslog=no
EOF
```

## Memory Management

### HugePages

```bash
# Enable Transparent HugePages
echo always | sudo tee /sys/kernel/mm/transparent_hugepage/enabled
echo always | sudo tee /sys/kernel/mm/transparent_hugepage/defrag
```

### Memory Compaction

```bash
# Reduce compaction latency
echo 1 | sudo tee /proc/sys/vm/compact_memory
```

## Disk Performance

### Filesystem Tuning

```bash
# ext4 tuning
sudo tune2fs -o journal_data_writeback /dev/sda2
sudo tune2fs -O ^has_journal /dev/sda2  # Disable journaling (risk of data loss)

# Btrfs tuning (if using Btrfs)
sudo mount -o compress=zstd:3,noatime,ssd /dev/sda2 /mnt
```

### Mount Options

Add to `/etc/fstab`:

```
# noatime reduces disk writes significantly
UUID=xxx / ext4 defaults,noatime 0 1
```

### Trim SSDs

```bash
# Enable periodic trim
sudo systemctl enable --now fstrim.timer

# Manual trim
sudo fstrim -av
```

## Network Performance

```bash
# Increase network buffer
sudo tee /etc/sysctl.d/90-network-performance.conf << 'EOF'
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 87380 134217728
net.ipv4.tcp_wmem = 4096 65536 134217728
net.ipv4.tcp_congestion_control = bbr
net.core.default_qdisc = fq
EOF

# Load BBR congestion control
sudo modprobe tcp_bbr

# Apply
sudo sysctl -p /etc/sysctl.d/90-network-performance.conf
```

## GNOME Performance

```bash
# Disable animations
gsettings set org.gnome.desktop.interface enable-animations false

# Reduce refresh rate
gsettings set org.gnome.mutter refresh-rate 60

# Disable blur (Blur My Shell extension)
gsettings set org.gnome.shell.extensions.blur-my-shell blur-enabled false

# Reduce workspace count
gsettings set org.gnome.mutter dynamic-workspaces false
gsettings set org.gnome.desktop.wm.preferences num-workspaces 2
```

## Monitoring Performance

```bash
# Real-time monitoring
htop
iotop
nethogs

# Disk latency
iostat -x 1

# Memory details
free -h
vmstat 1

# Network throughput
iftop
bmon

# Comprehensive stats
dstat -c -d -n -m 1
```

## Benchmarking

```bash
# CPU benchmark
sudo pacman -S sysbench
sysbench cpu run

# Disk benchmark
sysbench fileio --file-test-mode=rndrw prepare
sysbench fileio --file-test-mode=rndrw run
sysbench fileio --file-test-mode=rndrw cleanup

# Memory benchmark
sysbench memory run

# Network benchmark
sudo pacman -S iperf3
iperf3 -c iperf.example.com
```

## Preload (Application Caching)

```bash
# Install preload
yay -S preload

# Enable
sudo systemctl enable --now preload
```

## Power Management

```bash
# Install TLP (for laptops)
sudo pacman -S tlp
sudo systemctl enable --now tlp

# Check power consumption
sudo powertop
```

---

## See Also

- [Security Hardening](18-security-hardening.md)
- [Performance FAQ](../faq/09-performance-faq.md)
- [Performance Problems](../help/08-performance-problems.md)

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
| System feels slow | Too many services | Disable unused systemd services |
| Boot takes long | Plymouth timeout | Reduce timeout in /etc/plymouth/plymouthd.conf |
| Graphics lag | Wrong GPU driver | Install appropriate driver (nvidia/amd/intel) |
| Memory full | Too many apps | Check htop for memory hogs |

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

### Common Pitfalls (Performance)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| Too many services enabled | Clean install enables everything | Audit and disable unused systemd services |
| I/O bottleneck from ledger | Ledger on same disk as OS | Move ledger to dedicated SSD or partition |
| Swapping under memory pressure | Insufficient RAM | Add swap file or increase RAM |
| GPU not used for rendering | Wrong driver installed | Install appropriate GPU driver and verify with glxinfo |
| Thermal throttling during build | No active cooling | Monitor temperatures with sensors and improve cooling |

## Practice Exercises (Advanced)

1. **Before/After Benchmarking**: Measure boot time, app launch time, and file I/O before and after applying each tuning optimization
2. **Custom Kernel Compilation**: Build a custom Linux kernel with only the drivers and features you need; benchmark performance gain
3. **CPU Governor Tuning**: Test all CPU governors (performance, powersave, ondemand, schedutil) and benchmark each
4. **Storage Benchmark**: Use fio to benchmark different filesystems (ext4, btrfs, xfs, f2fs) on the same hardware
5. **Memory Analysis**: Use valgrind or heaptrack to profile a memory-heavy application; optimize and measure improvement

## Further Reading

- [System Requirements](02-system-requirements.md) — Hardware requirements
- [Post-Installation Setup](07-post-installation-setup.md) — Initial tuning
- [Development Environment](17-development-environment.md) — Dev performance
- [Custom ISO Building](21-building-custom-iso.md) — Minimal ISO
- [Performance FAQ](../faq/09-performance-faq.md) — Common questions
- [Performance Problems](../help/08-performance-problems.md) — Issue resolution
- [Energy Efficiency Benchmarks](../csr/04-energy-efficiency-benchmarks.md) — Green computing
- [Enterprise Cost Analysis](../enterprise/08-cost-analysis.md) — Cost implications
- [Toolchain Optimization Research](../research/09-custom-compiler-and-toolchain-optimization.md) — Research
- [Hardware Lifecycle Extension](../csr/03-extending-hardware-lifecycle.md) — Sustainability

## Benchmark Commands

```bash
# Boot time
systemd-analyze; systemd-analyze blame | head -10

# CPU
sysbench cpu run; sysbench cpu --threads=4 run

# Memory
sysbench memory run

# Disk I/O
sysbench fileio --file-test-mode=rndrw run

# Ledger
time 01s-ledger verify --full

# App launch
hyperfine firefox nautilus gnome-terminal
```

## Optimization Impact Table

| Optimization | Boot Time | App Launch | Power | Difficulty |
|-------------|-----------|------------|-------|------------|
| Disable services | -3.2s | - | +0.3W | Easy |
| SSD upgrade | -28s | -1.5s | -0.5W | Hardware |
| Reduce Plymouth | -2.0s | - | - | Easy |
| Custom kernel | -1.5s | -0.3s | -0.8W | Expert |
| Disable animations | - | +0.2s | -0.4W | Easy |
| CPU governor perf | -0.5s | -0.2s | +3.0W | Easy |

## Real-World Scenario: Performance Regression

A system feels slow after kernel update. Investigation: (1) `systemd-analyze blame` shows 5s increase in boot time, (2) `journalctl` reveals GPU driver modules taking longer to load, (3) Check kernel changelog - new security mitigation affecting GPU DMA, (4) Workaround: add `i915.enable_guc=0` to kernel parameters, (5) Boot time returns to normal. Ledger records the config change for future reference.

## Service Audit Results (Default Installation)

| Service | Status | Memory | CPU | Can Disable? |
|---------|--------|--------|-----|-------------|
| cups-browsed | idle | 12 MB | 0% | Yes (no printer) |
| avahi-daemon | active | 8 MB | 0% | Yes (no mDNS needed) |
| bluetooth | active | 15 MB | 0% | Yes (desktop without BT) |
| colord | active | 20 MB | 0% | Yes (no color-managed display) |
| PackageKit | active | 45 MB | 0% | No (software updates) |
| tracker-miner-fs | active | 120 MB | 2% | Yes (file search, disable with caution) |
| gdm | active | 65 MB | 0% | No (display manager) |
| NetworkManager | active | 30 MB | 0% | No (networking) |
| 01s-ledgerd | active | 25 MB | 1% | No (audit system) |

## CPU Governor Tuning

```bash
# Check current governor
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

# Available governors
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_governors

# Set to performance (max speed, more power)
echo performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Set to powersave (min speed, less power)
echo powersave | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Set to schedutil (kernel-managed, recommended)
echo schedutil | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Make persistent
sudo pacman -S cpupower
sudo systemctl enable --now cpupower
```

## Memory Optimization

```bash
# Check memory pressure
free -h; vmstat 1 5

# Reduce swappiness (default 60, lower = less swapping)
echo 10 | sudo tee /proc/sys/vm/swappiness
echo "vm.swappiness=10" | sudo tee /etc/sysctl.d/99-swap.conf

# Clear page cache (if needed)
echo 1 | sudo tee /proc/sys/vm/drop_caches

# Disable unused kernel features
# Add to /etc/modprobe.d/blacklist.conf
blacklist bluetooth
blacklist thunderbolt
```

## ZRAM Configuration

ZRAM provides compressed swap in RAM, useful for systems with limited memory:

```bash
# Install zram-generator
sudo pacman -S zram-generator

# Configure
cat > /etc/systemd/zram-generator.conf << 'CONF'
[zram0]
zram-size = ram / 2
compression-algorithm = zstd
swap-priority = 100
CONF

# Start
sudo systemctl enable --now systemd-zram-setup@zram0

# Verify
zramctl
swapon --show
```

## Kernel Parameters for Performance

```bash
# Add to /etc/sysctl.d/99-performance.conf

# Increase read-ahead for SSD
vm.vfs_cache_pressure = 50

# Reduce swappiness
vm.swappiness = 10

# Increase dirty page limits
vm.dirty_ratio = 30
vm.dirty_background_ratio = 5

# Improve network performance
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728

# Reduce latency
kernel.numa_balancing = 0
```

## Desktop Performance Profiling

```bash
# Profile GNOME Shell performance
sudo pacman -S sysprof
sysprof-cli 10 -o gnome-profile.syscap

# Measure frame rate
glxgears  # Basic OpenGL test
GALLIUM_HUD=fps glxgears  # Detailed FPS with Mesa

# Check display server performance
sudo systemctl status gdm
gsettings get org.gnome.mutter check-clopped-windows

# Measure input latency
sudo pacman -S latencytop
sudo latencytop
```

## Disk Performance Optimization

```bash
# Check disk scheduler
cat /sys/block/sda/queue/scheduler

# Set scheduler to none (NVMe) or mq-deadline (SSD)
echo "none" | sudo tee /sys/block/nvme0n1/queue/scheduler

# Make persistent
echo 'ACTION=="add|change", KERNEL=="nvme*", ATTR{queue/scheduler}="none"' | \
  sudo tee /etc/udev/rules.d/60-iosched.rules

# Enable TRIM for SSD
sudo systemctl enable --now fstrim.timer

# Check TRIM status
sudo fstrim -v /

# Mount options for SSD
# Add to /etc/fstab: noatime,nodiratime,discard
# Example: UUID=xxx / ext4 defaults,noatime,discard 0 1
```

## Graphics Performance Tuning

```bash
# Check current GPU driver
glxinfo | grep "OpenGL renderer"

# For NVIDIA GPUs
sudo pacman -S nvidia nvidia-utils nvidia-settings
sudo nvidia-settings  # GUI configuration

# For AMD GPUs (built-in or Radeon)
# Usually works out of the box with Mesa
sudo pacman -S mesa vulkan-radeon libva-mesa-driver

# For Intel GPUs
sudo pacman -S mesa vulkan-intel intel-media-driver

# Enable GPU acceleration in Firefox
# about:config -> gfx.webrender.all -> true
# about:config -> layers.acceleration.force-enabled -> true

# Force GPU rendering in GNOME
gsettings set org.gnome.mutter experimental-features "['scale-monitor-framebuffer']"
```

## Power Management Optimization

```bash
# Install power management tools
sudo pacman -S tlp tlp-rdw
sudo systemctl enable --now tlp

# Configure TLP
sudo nano /etc/tlp.conf
# CPU_SCALING_GOVERNOR_ON_AC=performance
# CPU_SCALING_GOVERNOR_ON_BAT=powersave
# CPU_ENERGY_PERF_POLICY_ON_AC=performance
# CPU_ENERGY_PERF_POLICY_ON_BAT=power
# DISK_DEVICES="nvme0n1 sda"
# DISK_APM_LEVEL_ON_AC="254 254"
# DISK_APM_LEVEL_ON_BAT="128 128"

# Check TLP status
sudo tlp-stat -s
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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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