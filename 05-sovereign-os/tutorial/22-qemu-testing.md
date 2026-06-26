# QEMU Testing

This guide covers testing 01s Sovereign ISOs using QEMU, including the project's standard testing approach.

## Quick Start

```bash
# Boot the latest ISO
qemu-system-x86_64 -enable-kvm \
  -cdrom day-1/iso/out/01-sovereign-1.0.0-x86_64-20260611.iso \
  -m 4096 -vga std -display gtk
```

## Prerequisites

```bash
# Install QEMU
sudo pacman -S qemu-full qemu-desktop

# Verify KVM support
ls /dev/kvm
```

## The qemu-cmd.txt Approach

The project uses a standard `qemu-cmd.txt` file to document the boot command:

```
# Boot the latest ISO. Run from project root.
qemu-system-x86_64 -enable-kvm \
  -cdrom day-1/iso/out/01-sovereign-1.0.0-x86_64-20260611.iso \
  -m 4096 -vga std -display gtk
```

## Boot Methods

### Graphical Boot (default)

```bash
qemu-system-x86_64 -enable-kvm -cdrom latest.iso -m 4096 -display gtk
```

### Serial Console Boot (for automation)

```bash
qemu-system-x86_64 \
  -drive file=latest.iso,media=cdrom,if=virtio,readonly=on \
  -m 4096 -vga std -nographic -serial mon:stdio
```

### UEFI Boot

```bash
qemu-system-x86_64 -enable-kvm \
  -bios /usr/share/edk2/x64/OVMF.fd \
  -cdrom latest.iso -m 4096 -display gtk
```

## Testing Scripts

### Smoke Test Script

The `scripts/qemu-video-test.sh` script runs a video mode test:

```bash
bash scripts/qemu-video-test.sh
```

### Automated Boot Test

The build script (`scripts/build-day1.sh`) includes an automated boot test:

```bash
# Run after build
timeout 300 qemu-system-x86_64 \
  -drive file=latest.iso,media=cdrom,if=virtio,readonly=on \
  -m 4096 -vga std -nographic -serial mon:stdio \
  2>&1 | tee /tmp/boot-verify.log
```

The test checks for:
- Kernel boot messages
- GDM/GNOME desktop start
- Absence of kernel panics
- Error counts in boot log

## Creating Test Disk Images

```bash
# Create a persistent VM disk
qemu-img create -f qcow2 01s-vm.qcow2 32G

# Boot with persistent storage
qemu-system-x86_64 -enable-kvm \
  -cdrom latest.iso \
  -drive file=01s-vm.qcow2,format=qcow2 \
  -m 4096 -display gtk
```

## Network Testing

```bash
# Enable network
qemu-system-x86_64 -enable-kvm \
  -cdrom latest.iso -m 4096 \
  -netdev user,id=net0 -device e1000,netdev=net0 \
  -display gtk

# Port forwarding (SSH)
qemu-system-x86_64 -enable-kvm \
  -cdrom latest.iso -m 4096 \
  -netdev user,id=net0,hostfwd=tcp::2222-:22 \
  -device e1000,netdev=net0 \
  -display gtk
```

## Ledger Testing

After the VM boots, test the ledger:

```bash
# Inside the VM
01s-ledger init
01s-ledger status
01s-ledger toolchain
01s-ledger log test name="qemu-test" result="passed"
01s-ledger verify
```

## Performance Testing

```bash
# Measure boot time
timeout 60 qemu-system-x86_64 \
  -drive file=latest.iso,media=cdrom,if=virtio,readonly=on \
  -m 4096 -nographic -serial mon:stdio 2>&1 | \
  grep -E "Started|Reached target" | wc -l
```

## Advanced QEMU Options

```bash
# Multi-core CPU
-cpu host -smp cores=4,threads=2

# VirtIO for better performance
-drive file=latest.iso,media=cdrom,if=virtio,readonly=on
-drive file=01s-vm.qcow2,format=qcow2,if=virtio

# Audio support
-audio pa,model=intel-hda

# USB passthrough
-usb -device usb-host,vendorid=0x1234,productid=0x5678

# Shared clipboard
-device virtio-serial-pci
-chardev qemu-vdagent,id=vdagent,name=vdagent
-device virtserialport,chardev=vdagent,name=com.redhat.spice.0
```

## Troubleshooting QEMU

| Issue | Solution |
|-------|----------|
| `Could not access KVM kernel module` | Enable virtualization in BIOS, install qemu-desktop |
| `No display available` | Use `-nographic` or install GTK/SDL support |
| `Slow performance` | Enable KVM (`-enable-kvm`), use VirtIO drivers |
| `No network` | Add `-netdev user,id=net0 -device e1000,netdev=net0` |
| `Boot hangs` | Try `-no-reboot` or different -vga option |
| `Windows host` | Use the `boot-iso.ps1` PowerShell script |

## Windows Host Testing

The project includes `boot-iso.ps1` for Windows:

```powershell
# From PowerShell
.\boot-iso.ps1
```

## ISO Integrity Testing

```bash
# Mount ISO and inspect
sudo mount -o loop latest.iso /mnt

# Check filesystems
ls /mnt/arch/x86_64/

# Check EFI boot
ls /mnt/EFI/

# Check GRUB config
cat /mnt/boot/grub/grub.cfg

# Unmount
sudo umount /mnt
```

---


## QEMU Configuration Reference

| Setting | Flag | Example | Purpose |
|---------|------|---------|---------|
| RAM | -m | -m 4096 | Memory in MB |
| CPU cores | -smp | -smp 4 | Number of cores |
| CPU type | -cpu | -cpu host | CPU model |
| KVM acceleration | -enable-kvm | -enable-kvm | Hardware acceleration |
| CD-ROM | -cdrom | -cdrom file.iso | Boot ISO |
| Disk image | -drive file=...,format=... | -drive file=disk.qcow2,format=qcow2 | Persistent storage |
| Network | -netdev + -device | -netdev user,id=net0 -device e1000,netdev=net0 | VM networking |
| Display | -vga | -vga virtio | GPU emulation |
| Sound | -audiodev + -device | -audiodev pa,id=audio -device AC97,audiodev=audio | Audio |

## Testing Checklist

- [ ] ISO boots to GRUB menu
- [ ] Plymouth splash animation displays
- [ ] Desktop loads with auto-login
- [ ] Terminal works (Super+T)
- [ ] Network is accessible (ping test)
- [ ] Ledger is active (01s-ledger status)
- [ ] Sound plays (speaker-test)
- [ ] Installation completes without errors
- [ ] GRUB installs to the correct device
- [ ] Post-install boot works without ISO

## Practice Exercises

1. **Minimal Boot**: Boot with only 512 MB RAM, observe behavior
2. **Serial Debug**: Use -nographic -serial mon:stdio to capture boot log
3. **Snapshot Test**: Install OS, create snapshot, break system, restore
4. **Network Test**: Set up SSH forwarding, connect from host to VM
5. **Performance Test**: Time boot process under different RAM/CPU configs


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
| VM not booting | Wrong CPU type | Use -cpu host for best compatibility |
| No network in VM | No NIC configured | Add -netdev user,id=net0 -device virtio-net |
| Graphics glitchy | Wrong VGA type | Try -vga std or -vga virtio |
| Audio not working | No sound device | Add -audiodev pa,id=audio -device intel-hda |
| Slow VM performance | KVM not enabled | Use -enable-kvm flag |
| Mouse not working | Missing USB tablet | Add -usb -device usb-tablet |

## Verification Checklist

- [ ] QEMU is installed and working
- [ ] You can boot the 01s ISO in QEMU
- [ ] Desktop loads and is usable
- [ ] Network works inside the VM
- [ ] You can create and manage snapshots
- [ ] You understand the key QEMU flags


## See Also

- [Building Custom ISO](21-building-custom-iso.md)
- [Boot Troubleshooting](../help/02-boot-troubleshooting.md)
- [First Boot Walkthrough](05-first-boot-walkthrough.md)

---


## Common Mistakes

| Mistake | Why It Happens | Correct Approach |
|---------|---------------|------------------|
| VM not booting | Wrong CPU type | Use -cpu host for best compatibility |
| No network in VM | No NIC configured | Add -netdev user,id=net0 -device virtio-net |
| Graphics glitchy | Wrong VGA type | Try -vga std or -vga virtio |
| Audio not working | No sound device | Add -audiodev pa,id=audio -device intel-hda |

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



---

Lois-Kleinner and 0-1.gg 2026 Copyright

### Common Pitfalls (QEMU)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| No hardware acceleration | KVM not enabled | Check lsmod | grep kvm and enable in BIOS |
| Network not working in guest | No network device added | Use -netdev user,id=net0 -device e1000,netdev=net0 |
| Poor graphics performance | Wrong VGA model | Use -vga virtio for better performance |
| Copy-paste broken | spice-vdagent not installed | Install spice-vdagent in guest and use -spice |
| Snapshot corruption | QCOW2 backing file changed | Never modify backing files after creating snapshots |

## Practice Exercises (Advanced)

1. **Automated Test Suite**: Write a QEMU test script that boots the ISO, runs a set of verification commands, and reports pass/fail
2. **Snapshot Management**: Create a hierarchy of QCOW2 snapshots for different test scenarios (clean install, with packages, with custom config)
3. **Network Attack Simulation**: Set up a virtual network with two VMs and simulate a network attack; verify ledger captures the event
4. **Performance Benchmarking**: Compare boot time, package install speed, and file I/O between QEMU and bare metal
5. **Multi-Architecture Testing**: If supported, test the ISO on QEMU emulating ARM64 or RISC-V (even if boot fails)

## Further Reading

- [Building Custom ISO](21-building-custom-iso.md) — ISO building
- [First Boot Walkthrough](05-first-boot-walkthrough.md) — First boot guide
- [Installation Guide](06-installation-guide.md) — Full installation
- [Boot Troubleshooting](../help/02-boot-troubleshooting.md) — Boot issues
- [Testing Framework](../developers/12-testing-framework.md) — Test tools
- [CI/CD Pipeline](../developers/18-ci-cd-pipeline-reference.md) — Automation
- [Performance Tuning](24-performance-tuning.md) — Optimization
- [Network Troubleshooting](../help/07-network-troubleshooting.md) — Network issues
- [Desktop Troubleshooting](../help/04-desktop-troubleshooting.md) — Desktop issues
- [Community Testing](../community/02-getting-started-as-contributor.md) — Community QA

## Complete VM Launch Script

```bash
#!/bin/bash
ISO="$1"; DISK="$2"; MEM="${3:-4096}"; CPUS="${4:-4}"
if [ ! -f "$DISK" ]; then qemu-img create -f qcow2 "$DISK" 40G; fi
qemu-system-x86_64 \
  -machine type=q35,accel=kvm -cpu host \
  -smp cores=$CPUS -m $MEM \
  -drive file="$DISK",format=qcow2,if=virtio,aio=native \
  -cdrom "$ISO" \
  -netdev user,id=net0,hostfwd=tcp::2222-:22 \
  -device virtio-net-pci,netdev=net0 \
  -vga virtio -display gtk,gl=on
```

## Testing Scenarios

| Test | Args | Expected | Criteria |
|------|------|----------|----------|
| BIOS Boot | (default) | GRUB menu | Boots to GRUB |
| UEFI Boot | -bios OVMF.fd | UEFI GRUB | UEFI detected |
| Min RAM | -m 2048 | Desktop loads | No OOM |
| No KVM | -accel tcg | Slow but works | Desktop <5min |
| USB Passthrough | -usb -device usb-host | Device visible | lsusb shows it |

## Real-World Scenario: QA Testing Pipeline

A QA team tests every ISO release using QEMU: (1) 20 VMs launch simultaneously with different hardware profiles, (2) Automated test suite runs (boot, desktop, ledger initialize, toolchain compile, package install, network), (3) Results logged to central ledger, (4) Any failure triggers alert to release manager, (5) Pass threshold: 95% of tests must pass for release. Pipeline: runs in 30 minutes, covers 120 test scenarios.

## QEMU Network Configurations

### User-mode Network (Default)
```bash
# Simple NAT networking, no external access to guest
-netdev user,id=net0 -device virtio-net-pci,netdev=net0
# Forward host port 2222 to guest SSH
-netdev user,id=net0,hostfwd=tcp::2222-:22
```

### Tap Network (Bridged)
```bash
# Guest appears on physical network
# Requires root or sudo
-netdev tap,id=net0,ifname=tap0,script=no,downscript=no
-device virtio-net-pci,netdev=net0
```

### VLAN/Isolated Network
```bash
# Guest-to-guest communication only
-netdev socket,id=net0,mcast=230.0.0.1:1234
-device virtio-net-pci,netdev=net0
```

## QEMU Monitoring

```bash
# Connect to QEMU monitor (via -monitor stdio)
(qemu) info registers     # View CPU state
(qemu) info block         # View disk status  
(qemu) info network       # View network status
(qemu) system_reset       # Simulate reset button
(qemu) system_powerdown   # Simulate power button
(qemu) savevm snapshot1   # Save VM state
(qemu) loadvm snapshot1   # Restore VM state
(qemu) stop               # Pause VM
(qemu) cont               # Resume VM
(qemu) quit               # Exit QEMU
```

## Testing Matrix Extended

| Scenario | QEMU Flags | Expected | Verification |
|----------|------------|----------|-------------|
| Default boot | (none) | GRUB appears | Visual check |
| UEFI boot | -bios OVMF.fd | UEFI GRUB | ls /sys/firmware/efi |
| Low RAM | -m 2048 | Desktop loads | free -m |
| No KVM | -accel tcg | Slow boot | Boot time >60s |
| virtio-scsi | -device virtio-scsi-pci | SCSI disk | lsblk |
| USB 3.0 | -device nec-usb-xhci | xHCI controller | lsusb |
| Audio | -audiodev pa | Sound output | speaker-test |
| Dual monitor | -vga virtio -display gtk | Two displays | xrandr |

## QEMU Performance Optimization

```bash
# Enable KVM hardware acceleration
qemu-system-x86_64 -enable-kvm ...

# Use host CPU features
qemu-system-x86_64 -cpu host ...

# Use virtio for block and network
-drive file=disk.qcow2,if=virtio,aio=native,cache.direct=on
-netdev user,id=net0 -device virtio-net-pci,netdev=net0

# Allocate hugepages for memory
echo 2048 | sudo tee /proc/sys/vm/nr_hugepages
qemu-system-x86_64 -mem-prealloc -mem-path /dev/hugepages ...

# Use multiple I/O threads
qemu-system-x86_64 -object iothread,id=iothread1 \
  -device virtio-blk-pci,iothread=iothread1,drive=system

# Enable MSI-X interrupts
qemu-system-x86_64 -device virtio-net-pci,mq=on,vectors=6 ...
```

## Automated Testing with QEMU

```bash
#!/bin/bash
# test-01s-iso.sh - Automated ISO testing script

ISO="$1"
TIMEOUT="${2:-120}"
RESULT_DIR="test-results/$(date +%Y%m%d-%H%M%S)"

mkdir -p "$RESULT_DIR"
qemu-img create -f qcow2 test-disk.qcow2 20G

# Boot and run tests via SSH
expect << 'EXPECT'
spawn qemu-system-x86_64 -enable-kvm -m 4096 \
  -drive file=test-disk.qcow2,format=qcow2 \
  -cdrom [lindex $argv 0] \
  -netdev user,id=net0,hostfwd=tcp::2222-:22 \
  -device virtio-net-pci,netdev=net0 \
  -nographic

expect "login:" { send "root\r" }
expect "#" { send "01s-ledger status\r" }
expect "#" { send "01s-ledger verify\r" }
expect "#" { send "zerocli --version\r" }
expect "#" { send "poweroff\r" }
expect eof
EXPECT

echo "Tests complete. Results saved to $RESULT_DIR"
```

## QEMU Image Management

```bash
# Create images with different formats
qemu-img create -f qcow2 test-disk.qcow2 40G
qemu-img create -f raw test-disk.raw 40G
qemu-img create -f vdi test-disk.vdi 40G  # VirtualBox
qemu-img create -f vmdk test-disk.vmdk 40G  # VMware

# Convert between formats
qemu-img convert -f qcow2 -O raw test-disk.qcow2 test-disk.raw
qemu-img convert -f qcow2 -O vdi test-disk.qcow2 test-disk.vdi

# Resize disk
qemu-img resize test-disk.qcow2 +20G

# Create snapshot chain
qemu-img create -f qcow2 -b base-disk.qcow2 -F qcow2 snapshot1.qcow2
qemu-img create -f qcow2 -b snapshot1.qcow2 -F qcow2 snapshot2.qcow2

# Check disk info
qemu-img info test-disk.qcow2
```

## Virtual Networking Scenarios

### Scenario 1: Single VM with Internet
```bash
qemu-system-x86_64 -netdev user,id=net0 -device virtio-net-pci,netdev=net0
# VM gets 10.0.2.0/24 via DHCP, NAT to host network
# Host can reach VM via port forwarding
```

### Scenario 2: Two VMs with Private Network
```bash
# Create tap interfaces on host
sudo ip tuntap add dev tap0 mode tap
sudo ip tuntap add dev tap1 mode tap
sudo ip link set tap0 up
sudo ip link set tap1 up

# Launch VM1
qemu-system-x86_64 -netdev tap,id=net0,ifname=tap0 -device virtio-net-pci,netdev=net0

# Launch VM2
qemu-system-x86_64 -netdev tap,id=net0,ifname=tap1 -device virtio-net-pci,netdev=net0

# VMs can communicate through host bridge
```

### Scenario 3: VM with Multiple NICs
```bash
qemu-system-x86_64 \
  -netdev user,id=net0,hostfwd=tcp::2222-:22 \
  -device virtio-net-pci,netdev=net0 \
  -netdev tap,id=net1,ifname=tap0 \
  -device e1000,netdev=net1
# eth0: NAT (management), eth1: bridged (data)
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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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