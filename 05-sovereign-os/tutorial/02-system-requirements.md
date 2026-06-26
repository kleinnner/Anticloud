# System Requirements

01s Sovereign (Kaiman) is designed to run on a wide range of x86_64 hardware. Below are the minimum and recommended specifications for a smooth experience.

## Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| **CPU** | x86_64 (Intel Core 2 Duo / AMD Athlon 64 X2 or better) |
| **RAM** | 2 GB (4 GB recommended) |
| **Storage** | 20 GB free space |
| **Graphics** | VGA-compatible GPU (Intel HD Graphics, AMD Radeon, NVIDIA GeForce 8000+) |
| **Display** | 1024x768 resolution or higher |
| **USB Port** | For bootable media installation |
| **Network** | Ethernet or WiFi (for updates and package installation) |

## Recommended Requirements

| Component | Recommendation |
|-----------|---------------|
| **CPU** | Intel Core i5 / AMD Ryzen 3 (4+ cores) |
| **RAM** | 8 GB or more |
| **Storage** | 64 GB SSD or faster |
| **Graphics** | GPU with 3D acceleration |
| **Display** | 1920x1080 or higher |
| **Network** | Broadband internet connection |

### Detailed Specs Table

| Component | Minimum | Recommended | Optimal |
|-----------|---------|-------------|---------|
| CPU | 2 cores @ 1.6 GHz | 4 cores @ 2.5 GHz | 8+ cores @ 3.0+ GHz |
| RAM | 2 GB DDR3 | 8 GB DDR4 | 16+ GB DDR4/DDR5 |
| Storage | 20 GB HDD | 64 GB SSD | 256+ GB NVMe SSD |
| GPU | VGA/HD 4000 | GTX 1050 / RX 560 | RTX 3060 / RX 6700+ |
| Display | 1024x768 | 1920x1080 | 2560x1440+ |
| Network | 1 Mbps | 10 Mbps | 100+ Mbps |
| USB | USB 2.0 | USB 3.0 | USB 3.2+ |

## Tested Hardware

The following hardware configurations have been tested with 01s Sovereign:

### Laptops

| Model | CPU | RAM | GPU | Status |
|-------|-----|-----|-----|--------|
| ThinkPad X1 Carbon Gen 9 | i7-1165G7 | 16 GB | Intel Iris Xe | Verified |
| Dell XPS 13 9310 | i7-1185G7 | 16 GB | Intel Iris Xe | Verified |
| HP EliteBook 845 G8 | Ryzen 5 5600U | 16 GB | AMD Radeon | Verified |
| ThinkPad T480 | i5-8350U | 8 GB | Intel UHD 620 | Verified |
| Framework 13 | i7-1260P | 32 GB | Intel Iris Xe | Verified |
| MacBook Pro 2019 (via Bootcamp) | i9-9880H | 16 GB | AMD Radeon Pro 5600M | Experimental |
| ASUS ROG Zephyrus G14 | Ryzen 9 5900HS | 16 GB | RTX 3060 | Verified (NVIDIA) |

### Desktops

| CPU | GPU | RAM | Status |
|-----|-----|-----|--------|
| Intel i5-12400 | Integrated UHD 730 | 16 GB DDR4 | Verified |
| AMD Ryzen 5 5600X | RTX 3060 | 32 GB DDR4 | Verified |
| Intel i9-12900K | RX 6800 XT | 64 GB DDR5 | Verified |
| AMD Ryzen 7 5800X3D | GTX 1080 Ti | 32 GB DDR4 | Verified |
| Intel i7-12700 | No dGPU | 16 GB DDR4 | Verified |

### Virtual Machines

| Hypervisor | CPU | RAM | Storage | Status |
|------------|-----|-----|---------|--------|
| QEMU/KVM | 4 vCPU | 8 GB | 32 GB qcow2 | Fully supported |
| QEMU/KVM | 2 vCPU | 4 GB | 20 GB qcow2 | Minimum verified |
| VirtualBox | 4 vCPU | 8 GB | 32 GB VDI | Supported |
| VMware Workstation | 4 vCPU | 8 GB | 32 GB VMDK | Supported |
| Hyper-V Gen 2 | 4 vCPU | 8 GB | 32 GB VHDX | Supported |
| Proxmox VE | 4 vCPU | 8 GB | 32 GB qcow2 | Verified |

## Supported Architectures

Currently, 01s Sovereign is built exclusively for **x86_64** (also known as amd64). This includes:

- Intel Core series (Core 2, i3, i5, i7, i9, Xeon)
- AMD Ryzen series (Ryzen 3, 5, 7, 9, Threadripper, EPYC)
- Compatible x86_64 processors from other vendors

> **Note:** ARM64 (aarch64) support is on the roadmap but not yet available. There is no 32-bit (i686) support.

### CPU Feature Requirements

| Feature | Required | Notes |
|---------|----------|-------|
| x86_64 | Yes | 64-bit extensions |
| SSE2 | Yes | Minimum SIMD support |
| SSSE3 | Recommended | Performance optimization |
| SSE4.1/4.2 | Recommended | Better toolchain performance |
| AVX/AVX2 | Optional | Accelerated crypto operations |
| AES-NI | Recommended | Faster SHA/hash operations |
| VT-x/AMD-V | Recommended | For QEMU/KVM nested virtualization |

## Virtualization Support

01s Sovereign is fully tested in virtualized environments:

| Hypervisor | Status |
|------------|--------|
| **QEMU/KVM** | Fully supported (see [QEMU Testing](22-qemu-testing.md)) |
| **VirtualBox** | Supported (enable EFI, 3D acceleration) |
| **VMware Workstation/Player** | Supported |
| **Microsoft Hyper-V** | Supported (Generation 2 VM) |
| **WSL2** | Not currently supported |

### QEMU Quick Start

```bash
# Basic boot
qemu-system-x86_64 -enable-kvm -cdrom 01-sovereign-1.0.0-x86_64-20260611.iso -m 4096 -vga std -display gtk

# Boot with UEFI
qemu-system-x86_64 -enable-kvm -bios /usr/share/edk2/x64/OVMF.fd -cdrom latest.iso -m 4096 -display gtk

# Boot with persistent disk
qemu-system-x86_64 -enable-kvm -cdrom latest.iso -drive file=01s-vm.qcow2,format=qcow2 -m 4096 -display gtk

# Serial console (no GUI)
qemu-system-x86_64 -drive file=latest.iso,media=cdrom,if=virtio,readonly=on -m 4096 -nographic -serial mon:stdio
```

### VirtualBox Configuration

1. Create VM: Type Linux, Version Arch Linux (64-bit)
2. Settings:
   - System > Motherboard > Enable EFI (checked)
   - System > Processor > 4+ CPU cores
   - Display > Acceleration > Enable 3D Acceleration
3. Storage: Add ISO to optical drive
4. Network: Bridged or NAT (default)
5. Start VM and press F12 for boot menu

### VMware Configuration

1. Create VM: Linux > Other Linux 5.x kernel 64-bit
2. Customize:
   - 4+ GB RAM
   - 2+ CPU cores
   - 32+ GB virtual disk
   - CD/DVD drive set to ISO

### Hyper-V Configuration

```powershell
# Create Generation 2 VM
New-VM -Name "01s-Sovereign" -MemoryStartupBytes 4096MB -Generation 2
Set-VMProcessor -VMName "01s-Sovereign" -Count 4
Add-VMDvdDrive -VMName "01s-Sovereign" -Path "C:\ISOs\01-sovereign-1.0.0.iso"
Start-VM -Name "01s-Sovereign"

# Disable Secure Boot for installation
Set-VMFirmware -VMName "01s-Sovereign" -EnableSecureBoot Off
```

## Storage Considerations

### Filesystem Support

01s Sovereign supports the following filesystems for installation:

| Filesystem | Recommended for | Notes |
|------------|----------------|-------|
| **ext4** | Root filesystem | Default choice, mature and stable |
| **Btrfs** | Root + snapshots | Supports snapshots, compression, subvolumes |
| **XFS** | Data partitions | Good for large files, high performance |
| **F2FS** | SSDs | Flash-friendly filesystem |
| **VFAT** | EFI System Partition | Required for UEFI boot |
| **NTFS** | Dual-boot with Windows | Read/write support |

### Filesystem Comparison

| Feature | ext4 | Btrfs | XFS | F2FS |
|---------|------|-------|-----|------|
| Snapshots | No | Yes | No | No |
| Compression | No | Yes (zstd/lzo) | No | No |
| Subvolumes | No | Yes | No | No |
| Max file size | 16 TB | 16 EB | 8 EB | 3.9 TB |
| Max volume size | 1 EB | 16 EB | 8 EB | 16 TB |
| Online defrag | Yes | Yes | No | No |
| Shrink support | Yes | No | No | No |
| SSD optimization | Moderate | Good | Moderate | Excellent |
| Maturity | Very high | High | Very high | Medium |

### Partition Layout (Recommended)

For a standard installation:

```
Partition 1: /boot/efi — 512 MB — EFI System Partition (FAT32)
Partition 2: /boot — 1 GB — ext4 (optional, for kernels)
Partition 3: / — 30-50 GB — ext4 or Btrfs
Partition 4: /home — Remainder — ext4 or Btrfs
Partition 5: swap — 2-8 GB — swap (optional, or use swapfile/zram)
```

### Alternative Partition Layouts

**Minimal (20 GB):**
```
/boot/efi: 512 MB
/       : 19.5 GB (includes /home)
swap    : 2 GB swapfile (not separate partition)
```

**Development workstation (128+ GB):**
```
/boot/efi: 512 MB (FAT32)
/       : 50 GB (Btrfs with subvolumes)
/home   : 70+ GB (XFS for large files)
swap    : 8 GB (swapfile on Btrfs)
/var    : 10 GB (separate for logs)
```

**Dual-boot with Windows:**
```
Windows C:  — Existing Windows partition (NTFS)
/boot/efi:  — Shared EFI partition (already exists)
/       : 30+ GB (ext4)
/home   : 50+ GB (ext4)
swap    : 4 GB (or swapfile)
```

### Storage Performance Recommendations

| Use Case | Recommended Setup |
|----------|-------------------|
| General desktop | 256 GB SSD + ext4 + noatime |
| Developer workstation | 512 GB NVMe + Btrfs + compression |
| Server/headless | 128 GB SSD root + large data disk (XFS) |
| VM host | Separate disk for VMs (XFS or ext4) |
| Media production | Multiple SSDs, Btrfs RAID |

## BIOS/UEFI Support

| Boot Mode | Support |
|-----------|---------|
| **UEFI** (x64) | Fully supported, recommended |
| **Legacy BIOS** | Supported via BIOS-compatible boot |

The ISO is hybrid and boots on both UEFI and legacy BIOS systems. UEFI is preferred for security features like Secure Boot (note: you may need to disable Secure Boot or enroll custom keys).

### Secure Boot Status

| Feature | Support |
|---------|---------|
| UEFI boot | Full support |
| Secure Boot (disabled) | Works |
| Secure Boot (enabled) | May need MOK enrollment |
| Custom MOK keys | Supported via `mokutil` |

To enroll custom MOK keys:

```bash
# From the booted system
sudo mokutil --import /path/to/MOK.der
# Reboot and follow the MOK Manager prompts
```

## Network Requirements

- **Offline installation:** Full desktop experience available without internet
- **Online installation:** Recommended for updates, package installation, and toolchain development
- **Minimum speed:** 1 Mbps for basic package updates
- **Recommended:** 10 Mbps or faster for ISO downloads (the ISO is ~2-4 GB)

### Bandwidth Estimation

| Task | Data | Time at 10 Mbps | Time at 100 Mbps |
|------|------|-----------------|------------------|
| ISO download | 3 GB | 40 min | 4 min |
| System update | ~500 MB | 7 min | 40 sec |
| Install AUR package | ~100 MB | 1.5 min | 8 sec |
| Full system update | ~2 GB | 27 min | 2.7 min |

## Optional Hardware

| Hardware | Notes |
|----------|-------|
| **SSD** | Dramatically improves boot time and responsiveness |
| **Dedicated GPU** | Enables GNOME animations, Wayland compositing |
| **WiFi card** | Must be supported by Linux kernel (most modern cards work) |
| **Bluetooth adapter** | Supported via BlueZ stack |
| **Webcam** | Supported via Video4Linux |
| **Fingerprint reader** | Supported via libfprint (not all readers) |

### Compatible WiFi Chipsets

| Chipset | Driver | Status |
|---------|--------|--------|
| Intel AX200/AX201 | iwlwifi | Excellent |
| Intel AX210/AX211 | iwlwifi | Excellent |
| Intel 9260/9560 | iwlwifi | Excellent |
| Realtek RTL8822CE | rtw88 | Good |
| Realtek RTL8852AE | rtw89 | Good |
| Qualcomm QCA6174 | ath10k | Good |
| Broadcom BCM4360 | brcmfmac | Fair (requires firmware) |
| Mediatek MT7921 | mt7921e | Good |

## Power Requirements

### Desktop Systems
- Standard ATX power supply (300W minimum, 500W recommended for GPU)
- UPS recommended for production use

### Laptops
- 45W+ USB-C charger (most modern laptops)
- Battery life: 3-6 hours typical (varies by hardware and workload)

## Display Requirements

| Display Type | Resolution | Notes |
|-------------|------------|-------|
| Standard | 1920x1080 | Full HD, recommended minimum |
| High-DPI | 2560x1440+ | Fractional scaling supported (experimental) |
| 4K | 3840x2160 | Works with 200% scaling |
| Ultra-wide | 3440x1440 | Supported, may need manual configuration |
| Multiple monitors | Up to 6 | Supported via GNOME/Wayland |

## Audio Requirements

| Interface | Support |
|-----------|---------|
| Intel HDA | Full support |
| USB Audio | Full support |
| Bluetooth Audio | Supported via PipeWire |
| HDMI/DP Audio | Supported |
| Professional audio (ASIO) | Via JACK/PipeWire |

---

## Hardware Compatibility Notes

| Component | Consideration | Recommendation |
|-----------|--------------|---------------|
| NVIDIA GPU | Proprietary driver needed | Use `nouveau` or install `nvidia` drivers post-install |
| Broadcom WiFi | Some chips lack open drivers | Use USB WiFi dongle with Linux support |
| Fingerprint reader | Limited Linux support | Check Arch Wiki for your model |
| Thunderbolt 3/4 | Generally works | May need `bolt` package |
| Hybrid graphics | Requires `optimus-manager` or `prime` | Configure post-install |
| High-DPI display (4K+) | GNOME scales well | Set scale factor in Settings |

## Storage Requirements by Use Case

| Use Case | Minimum Storage | Recommended | Notes |
|----------|----------------|-------------|-------|
| Basic desktop | 20 GB | 64 GB | Web browsing, documents |
| Development | 30 GB | 128 GB | Toolchain, build artifacts |
| Media production | 50 GB | 256 GB+ | Audio/video files |
| Virtualization | 40 GB + VM storage | 128 GB + 256 GB | VM images |
| Enterprise deployment | 30 GB | 64 GB | Standard image + logging |

## Verification Checklist

- [ ] Your CPU is x86_64 (64-bit Intel/AMD)
- [ ] You have at least 2 GB RAM (4 GB recommended)
- [ ] At least 20 GB free disk space
- [ ] USB port available (for live USB install)
- [ ] Network connection for updates
- [ ] BIOS/UEFI supports booting from USB/DVD

## Common Mistakes

| Mistake | Consequence | Solution |
|---------|-------------|----------|
| Using 32-bit CPU | ISO won't boot | Check CPU with `lscpu` |
| Insufficient RAM (1 GB) | Desktop may not load | Add swap or increase RAM |
| USB 2.0 for live boot | Very slow boot times | Use USB 3.0 when possible |
| No network during install | Can't download updates | Pre-load packages or use full ISO |
| SSD without TRIM | Performance degradation | Enable `fstrim.timer` |

## Practice Exercise

**Hardware Audit**: Run the following commands on your current system to check compatibility:

```bash
# Check CPU architecture
lscpu | grep "Architecture"

# Check RAM
free -h

# Check disk space
df -h /

# Check GPU
lspci | grep -E "VGA|3D"

# Check USB version
lsusb -t | grep -o "USB [0-9.]*" | sort -u
```

Then compare the output against the minimum and recommended requirements above.

## See Also

- [Downloading the ISO](03-downloading-the-iso.md)
- [Creating Bootable Media](04-creating-bootable-media.md)
- [First Boot Walkthrough](05-first-boot-walkthrough.md)
- [Installation Guide](06-installation-guide.md)
- [QEMU Testing](22-qemu-testing.md)
- [Performance FAQ](../faq/09-performance-faq.md)

### Common Pitfalls

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| Ignoring UEFI vs BIOS requirements | Legacy systems lack UEFI support | Check motherboard manual before installation |
| Underestimating RAM needs | GNOME + ledger consumes ~2 GB | Ensure at least 4 GB total RAM |
| SSD vs HDD performance | Ledger writes are I/O intensive | Use SSD for ledger partition |
| Missing virtualization extensions | QEMU requires hardware virt | Enable VT-x/AMD-V in BIOS |
| Wrong architecture download | x86_64 only, no ARM support | Verify processor architecture before download |

## Practice Exercises (Intermediate)

1. **Compatibility Audit**: Run lscpu, ree -h, and lsblk on your current system; determine if it meets all 01s Sovereign requirements
2. **Virtual Hardware Config**: Create a QEMU VM with exactly the minimum specs; test whether the OS is usable
3. **Upgrade Plan**: Write a step-by-step plan to upgrade a system from minimum to recommended specifications
4. **Partition Layout Design**: Given a 500 GB SSD, design an optimal partition layout including ledger partition
5. **GPU Compatibility Research**: Look up your GPU on the Arch Linux wiki; determine if it requires proprietary drivers

## Further Reading

- [Downloading the ISO](03-downloading-the-iso.md) — Where to get the installation image
- [Creating Bootable Media](04-creating-bootable-media.md) — USB/DVD preparation
- [First Boot Walkthrough](05-first-boot-walkthrough.md) — Initial system startup
- [Installation Guide](06-installation-guide.md) — Full installation procedure
- [QEMU Testing Guide](22-qemu-testing.md) — Virtual machine setup
- [Performance Tuning](24-performance-tuning.md) — Hardware optimization
- [Performance FAQ](../faq/09-performance-faq.md) — Common performance issues
- [Boot Troubleshooting](../help/02-boot-troubleshooting.md) — Solving boot problems
- [Enterprise Deployment](../enterprise/02-deployment-models.md) — Production deployment
- [Desktop Troubleshooting](../help/04-desktop-troubleshooting.md) — Desktop issues

## Storage Allocation Guide

For optimal performance on a 256 GB SSD:

| Partition | Size | Type | Mount | FS | Purpose |
|-----------|------|------|-------|-----|---------|
| EFI | 512 MB | FAT32 | /boot | vfat | Boot loader |
| Root | 80 GB | Linux | / | ext4 | System files |
| Ledger | 20 GB | Linux | /var/log/01s | ext4 | Audit data |
| Home | 151.5 GB | Linux | /home | ext4 | User data |
| Swap | 4 GB | Swap | [swap] | swap | Memory overflow |

## Hardware Compatibility Notes

Running below recommended specs causes:
- **2 GB RAM**: Desktop usable but swapping with 5+ browser tabs
- **4 GB RAM**: Smooth with 10-15 tabs, editor, terminal
- **8 GB RAM**: Heavy workloads including VMs and containers
- **HDD vs SSD**: Boot 12s vs 45s; ledger writes 2ms vs 50ms

## Real-World Scenario: Enterprise Hardware Audit

A company planning to deploy 01s Sovereign across 200 workstations runs a compatibility audit script. Results show 184 machines (92%) meet minimum requirements. The 16 failures break down as: 8 with 2 GB RAM (upgradable), 5 with HDD (replace with SSD), 2 with unsupported GPU (GMA 500 series), 1 with 32-bit CPU (must replace). Upgrade cost: $8,400 for RAM/SSD upgrades vs $160,000 for full replacement.

## Performance Benchmark by Hardware

| Hardware Spec | Boot Time | App Launch | Max Browser Tabs | Power Draw |
|--------------|-----------|------------|------------------|------------|
| 2015 i5 + 4GB + HDD | 45s | 3.2s | 8 | 15W |
| 2018 i7 + 8GB + SSD | 12s | 1.1s | 25 | 22W |
| 2022 i7 + 32GB + NVMe | 8s | 0.6s | 60+ | 35W |
| VM (4 vCPU + 8GB) | 22s | 2.8s | 15 | Host-dependent |

## Detailed Storage Requirements

| Component | Minimum | Recommended | Notes |
|-----------|---------|-------------|-------|
| OS + GNOME | 8 GB | 15 GB | Increases with packages |
| Ledger | 5 GB | 20 GB | 2MB/month, grows with use |
| Swap | 2 GB | 8 GB | Equal to RAM for hibernation |
| User Data | 10 GB | 50 GB+ | Depends on use case |
| EFI Partition | 100 MB | 512 MB | FAT32 required |
| Total | 25 GB | 93 GB+ | |

## Verified Hardware Database

Community-tested hardware configurations:
- Lenovo ThinkPad T480 (2018): 100% compatible
- Dell XPS 13 9370 (2018): 100% compatible
- HP EliteBook 840 G5 (2018): 95% (fingerprint reader unsupported)
- System76 Galago Pro (2020): 100% compatible
- Custom desktop (Intel i5-12400, NVIDIA RTX 3060): 100% with proprietary driver
- Custom desktop (AMD Ryzen 5 5600X, Radeon RX 6700): 100% compatible

## Virtual Machine Specific Requirements

| Hypervisor | Recommended Settings | Notes |
|------------|---------------------|-------|
| QEMU/KVM | 4 vCPU, 8 GB RAM, 40 GB disk, virtio drivers | Best performance |
| VMware | 4 vCPU, 8 GB RAM, 40 GB disk, VMware Tools | Good compatibility |
| VirtualBox | 4 vCPU, 8 GB RAM, 40 GB disk, Guest Additions | Slower graphics |
| Hyper-V | 4 vCPU, 8 GB RAM, 40 GB disk, Linux Integration Services | Good compatibility |
| Parallels (macOS) | 4 vCPU, 8 GB RAM, 40 GB disk, Parallels Tools | Best on Apple HW |

## Checking Requirements from Live USB

When booted from the live USB environment, you can check hardware compatibility before installing:

```bash
# Check all requirements at once
echo "=== CPU ==="
lscpu | grep -E "Architecture|Model name|CPU\(s\)"
echo "=== Memory ==="
free -h
echo "=== Disk ==="
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,FSTYPE
echo "=== GPU ==="
lspci -k | grep -A 2 -E "VGA|3D"
echo "=== Network ==="
ip addr show | grep -E "inet |state"
echo "=== USB ==="
lsusb
echo "=== Virtualization ==="
grep -E "svm|vmx" /proc/cpuinfo && echo "VT-x/AMD-V: Supported" || echo "VT-x/AMD-V: NOT supported"
```

## Cloud-Ready Images

| Provider | Image Type | Size | Launch Time |
|----------|------------|------|-------------|
| AWS EC2 | AMI (x86_64) | 8 GB | ~3 minutes |
| DigitalOcean | Droplet Snapshot | 10 GB | ~2 minutes |
| Linode | Custom Image | 8 GB | ~2 minutes |
| Hetzner | Install Image | 1 GB | ~5 minutes |
| Proxmox | VM Template | 10 GB | ~1 minute |
| Any KVM | QCOW2 Image | 8 GB | Variable |

## Detailed Hardware Compatibility List

### Fully Supported (2018+)
- Lenovo ThinkPad T480, T490, T14, X1 Carbon (Gen 6+)
- Dell XPS 13 (9370+), XPS 15 (9570+), Latitude 5000+ series
- HP EliteBook 800+ series, ProBook 400+ series
- System76 Galago Pro, Lemur Pro, Oryx Pro
- ASUS ZenBook UX series, ROG Zephyrus
- Framework Laptop (all generations)
- Custom Desktop: Intel 8th gen+, AMD Ryzen 2000+

### Mostly Supported (2015-2018)
- Lenovo ThinkPad T460, T470, X260, X270
- Dell XPS 13 (9350, 9360), Latitude 3000+ series
- HP EliteBook 700+ series
- MacBook Pro (2015-2017) - limited GPU support
- Custom Desktop: Intel 6th-7th gen, AMD Ryzen 1000 series
- Requires: may need nomodeset for NVIDIA Optimus

### Limited Support (2012-2015)
- Lenovo ThinkPad T430, T440, T450, X230, X240
- Dell Latitude E series, Optiplex 3000 series
- HP EliteBook 600 series
- MacBook Pro (2012-2014) - GPU passthrough only
- Custom Desktop: Intel 3rd-5th gen, AMD FX series
- Requires: limited 3D acceleration, no hardware video decode

## Recommended Hardware for Specific Use Cases

### Office Workstation
- CPU: Intel i5 / AMD Ryzen 5 (2018+)
- RAM: 8 GB DDR4
- Storage: 256 GB SSD
- Display: 1920x1080
- Estimated Cost: $500-800
- Performance: Excellent for office tasks, 30+ browser tabs

### Development Workstation
- CPU: Intel i7 / AMD Ryzen 7 (2020+)
- RAM: 32 GB DDR5
- Storage: 512 GB NVMe SSD
- Display: 2560x1440 or 4K
- GPU: Dedicated (optional for ML/AI)
- Estimated Cost: $1,200-2,000
- Performance: Excellent for compilation, containers, and multitasking

### Production Server
- CPU: Intel Xeon / AMD EPYC
- RAM: 64 GB+ ECC
- Storage: 2x 1 TB NVMe (RAID1)
- Network: 10 GbE
- Estimated Cost: $3,000-8,000
- Performance: Excellent for high-throughput audit logging

### Budget/Legacy Machine
- CPU: Intel i5 / AMD Ryzen 5 (2015+)
- RAM: 4 GB DDR3/DDR4
- Storage: 240 GB SATA SSD
- Estimated Cost: $200-400 (used)
- Performance: Adequate for basic tasks, 8-10 browser tabs

## Measured Power Consumption

| Hardware Configuration | Idle | Light Load | Heavy Load |
|------------------------|------|------------|------------|
| Desktop (i7-12700, 32GB, NVMe, RTX 3060) | 45W | 85W | 180W |
| Laptop (i5-1135G7, 16GB, SSD) | 7W | 15W | 35W |
| Mini PC (N100, 8GB, SSD) | 6W | 12W | 25W |
| Server (Xeon Silver, 64GB, RAID) | 65W | 110W | 220W |

## Cloud Deployment Hardware Equivalents

| Cloud Provider | Instance Type | vCPU | RAM | Storage | Monthly Cost (est.) |
|---------------|---------------|------|-----|---------|---------------------|
| AWS | t3.large | 2 | 8 GB | 50 GB gp3 | $30 |
| AWS | m6i.xlarge | 4 | 16 GB | 100 GB gp3 | $90 |
| AWS | c6i.2xlarge | 8 | 16 GB | 200 GB gp3 | $150 |
| DigitalOcean | Premium Intel | 4 | 8 GB | 100 GB | $48 |
| DigitalOcean | Premium Intel | 8 | 16 GB | 200 GB | $96 |

## Installation Source Options

01s Sovereign can be installed from multiple sources:

| Source | Size | Speed | Best For |
|--------|------|-------|----------|
| Full Desktop ISO | 3.2 GB | Varies | Standard installation |
| Minimal ISO | 1.1 GB | Fast | Server/headless |
| Network Install | ~500 MB | Depends on connection | Custom package selection |
| Virtual Appliance | 2.0 GB | Ready to boot | QEMU/VMware/VirtualBox |
| Cloud Image | 1.5 GB | Ready to deploy | AWS, DigitalOcean, Linode |

Choose the Full Desktop ISO for first-time installation. Experienced users may prefer the Minimal ISO and customize their package selection.

## Accessibility Support in 01s Sovereign

01s Sovereign includes accessibility features for users with disabilities:

| Feature | Description | Activation |
|---------|-------------|------------|
| Screen Reader | Orca screen reader for visually impaired | Settings > Accessibility > Screen Reader |
| Large Text | Increases font size system-wide | Settings > Accessibility > Large Text |
| High Contrast | High contrast theme for visibility | Settings > Accessibility > High Contrast |
| Sticky Keys | Modifier keys stay active when pressed | Settings > Accessibility > Typing |
| Slow Keys | Delay before key press is accepted | Settings > Accessibility > Typing |
| Bounce Keys | Ignore rapid duplicate key presses | Settings > Accessibility > Typing |
| Mouse Keys | Control pointer with numpad | Settings > Accessibility > Pointing |
| Zoom | Magnify portion of screen | Super+Alt+8 to toggle |
| Sound Keys | Audio feedback for toggle keys | Settings > Accessibility > Hearing |
| Visual Alerts | Flash screen instead of sounds | Settings > Accessibility > Hearing |

These features work with the Wayland display server and most GNOME applications.

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ