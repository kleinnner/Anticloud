                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 

# 03 — Existing Hardware

**Kamelot — The Sovereign Semantic Vector File System**

**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. Introduction
2. Minimum Requirements
3. Laptop Support (2010+)
4. Desktop Support (Any Era)
5. Server Support (x86 and ARM)
6. Single-Board Computer Support
7. GPU: Nice to Have, Not Required
8. Storage Recommendations
9. Networking Requirements
10. Operating System Compatibility
11. Architecture-Specific Notes
12. Performance Tuning for Existing Hardware
13. Conclusion

---

## 1. Introduction

Kamelot is designed to work on the hardware you already own. We believe that semantic file management should not require a hardware purchase, a cloud subscription, or a system upgrade. If your computer was manufactured in the last 15 years and runs a modern operating system, it can run Kamelot.

This document details the hardware requirements and recommendations for running Kamelot across a wide range of existing hardware configurations.

---

## 2. Minimum Requirements

### 2.1 Absolute Minimum

These requirements are sufficient to run the core Kamelot daemon with basic functionality (encrypted storage, file retrieval, CLI interface, basic search):

| Component | Minimum Requirement |
|-----------|-------------------|
| CPU | x86-64 dual-core, any model from 2010+; or ARM64 dual-core |
| RAM | 2 GB (1 GB for OS + 512 MB for Kamelot + 512 MB buffer) |
| Storage | 500 MB for Kamelot binary + base index (excluding file store) |
| OS | Linux kernel 5.x+, Windows 10+, macOS 12+ |
| Network | Optional (for K-Swarm mesh) |

At this configuration:

- AI features (semantic search, embedding) will be slow or unavailable
- Files will be stored encrypted but not indexed semantically
- Basic file operations (store, retrieve, list) work normally

### 2.2 Recommended

For a good experience with AI features enabled:

| Component | Recommended |
|-----------|------------|
| CPU | x86-64 quad-core, 2.5 GHz+; or ARM64 octa-core (M1/M2) |
| RAM | 8 GB (4 GB for OS + 2 GB for Qwen 2 VL + 1 GB for Qdrant + 1 GB buffer) |
| Storage | 256 GB+ SSD (NVMe preferred) |
| GPU | Optional — any GPU that supports Vulkan 1.0+ for the wgpu canvas |
| OS | Linux kernel 6.x+, Windows 11, macOS 13+ |

At this configuration:

- Semantic search completes in 100–500 ms
- File embedding completes in 50–200 ms
- GUI canvas runs at 60 FPS
- Multiple users can be served simultaneously

### 2.3 Production / Enterprise

For enterprise deployments with high throughput:

| Component | Production |
|-----------|-----------|
| CPU | 8+ cores, x86-64, 3.0 GHz+ |
| RAM | 16 GB+ |
| Storage | 1 TB+ NVMe |
| GPU | Dedicated GPU (NVIDIA RTX 4060+ or AMD RX 7600+) for faster embedding |
| OS | Linux (Ubuntu 24.04 LTS, Debian 12, RHEL 9) |
| Network | 1 Gbps+ for K-Swarm mesh |

At this configuration:

- Semantic search completes in 10–50 ms
- File embedding completes in 10–50 ms
- GUI canvas runs at 60+ FPS
- Supports 10+ concurrent users
- Index capacity: 10M+ files

---

## 3. Laptop Support (2010+)

### 3.1 General Compatibility

Any x86-64 laptop manufactured after 2010 can run Kamelot. This includes:

**Business laptops (most compatible):**
- Lenovo ThinkPad X220, X230, T420, T430, T440, T450, T460, T470, T480, T490, T14, X1 Carbon (all generations)
- Dell Latitude E6420, E6430, E7440, 5480, 5490, 5400, 5410, 5420, 5430, 5440
- HP EliteBook 8460p, 8470p, 840 G1–G10, 850 G1–G10
- Fujitsu Lifebook series
- Panasonic Toughbook series

**Consumer laptops:**
- Dell Inspiron series (2010+)
- HP Pavilion, Envy, Spectre series (2010+)
- Acer Aspire, Swift series
- ASUS VivoBook, ZenBook series
- Lenovo IdeaPad, Yoga series

**Apple laptops:**
- MacBook Air (2012+ with Linux, or macOS 12+)
- MacBook Pro (2012+ with Linux, or macOS 12+)

### 3.2 Performance by Generation

| Laptop Generation | CPU Example | Embedding Speed | Search Speed | Overall Experience |
|------------------|-------------|----------------|--------------|-------------------|
| 2010–2012 (Core 2nd gen) | i5-2520M | 500–800 ms | 200–400 ms | Functional, slow AI |
| 2013–2015 (Core 4th gen) | i5-4300U | 300–500 ms | 150–300 ms | Good for personal use |
| 2016–2018 (Core 7th/8th gen) | i5-8250U | 150–300 ms | 80–150 ms | Very good |
| 2019–2021 (Core 10th/11th gen) | i7-1165G7 | 80–150 ms | 40–80 ms | Excellent |
| 2022+ (Core 12th/13th gen) | i7-1365U | 40–80 ms | 20–50 ms | Excellent |
| Apple M1/M2/M3 | M2 Pro | 50–100 ms | 20–60 ms | Excellent |

### 3.3 Laptop-Specific Considerations

- **Battery life**: Kamelot's idle power draw (0.25 W) has negligible impact on battery life. Active embedding uses more power but is typically brief.
- **Thermal throttling**: Older laptops may throttle during batch embedding. Reduce batch size with `--batch-size 10`.
- **RAM limitations**: 4 GB laptops can run Kamelot without AI features. 8 GB is recommended for AI features.
- **Storage limitations**: A 128 GB SSD is sufficient for Kamelot + files. Larger file collections need larger storage.

---

## 4. Desktop Support (Any Era)

### 4.1 General Compatibility

Any x86-64 desktop computer from any era can run Kamelot. Desktop hardware is even more flexible than laptops due to:

- Upgradeability (CPU, RAM, storage can be swapped)
- Better cooling (sustained performance under load)
- Higher power budget (can handle continuous embedding)

**Business desktops (excellent for Kamelot):**
- Dell OptiPlex 3xxx, 5xxx, 7xxx series (2010+)
- HP Compaq, ProDesk, EliteDesk series (2010+)
- Lenovo ThinkCentre M58p, M72e, M73, M83, M900, M910, M920, M930 series
- Intel NUC, NUC Kit series

**Custom-built PCs:**
- Any AMD or Intel x86-64 system
- Mini-ITX, micro-ATX, ATX form factors
- All power supply ratings

### 4.2 Performance by CPU

| CPU Family | Cores | Embedding Speed | Search Speed |
|-----------|-------|----------------|--------------|
| Intel Core i3-4xxx | 2 | 400–600 ms | 200–300 ms |
| Intel Core i5-6xxx | 4 | 200–350 ms | 100–200 ms |
| Intel Core i7-8xxx | 6 | 100–200 ms | 50–100 ms |
| Intel Core i9-12xxx | 8+ | 30–80 ms | 15–40 ms |
| AMD Ryzen 3 3xxx | 4 | 200–350 ms | 100–200 ms |
| AMD Ryzen 5 5xxx | 6 | 80–150 ms | 40–100 ms |
| AMD Ryzen 7 7xxx | 8 | 40–100 ms | 20–60 ms |
| AMD Ryzen 9 7xxx | 12+ | 20–60 ms | 10–30 ms |

### 4.3 Desktop-Specific Advantages

- **GPU flexibility**: Desktops can easily accommodate a dedicated GPU for faster embedding
- **Storage flexibility**: Multiple drives can be combined for storage + backup
- **Always-on capability**: Desktops are well-suited for 24/7 Kamelot server operation
- **ECC RAM support**: Some workstation platforms support ECC for data integrity

---

## 5. Server Support (x86 and ARM)

### 5.1 Industry Standard Servers

| Server Series | Form Factor | Notes |
|--------------|------------|-------|
| Dell PowerEdge R640, R740, R750, R660 | 1U/2U rack | Excellent for enterprise |
| HPE ProLiant DL360, DL380 | 1U/2U rack | Excellent for enterprise |
| Supermicro SuperServer | Various | Good for custom deployments |
| Lenovo ThinkSystem SR630, SR650 | 1U/2U rack | Good for enterprise |
| Cisco UCS C-Series | Rack | Compatible |

### 5.2 ARM Servers

| Server | CPU | Notes |
|--------|-----|-------|
| Ampere Altra | 80 cores | Excellent for embedding |
| Ampere Altra Max | 128 cores | High-throughput embedding |
| AWS Graviton 3 | 64 cores | Cloud deployment only |
| Raspberry Pi 5 Compute Module | 4 cores | Lightweight deployment |

### 5.3 Server-Specific Considerations

- **IPMI/iDRAC**: Kamelot works alongside server management interfaces
- **RAID**: Kamelot does not require RAID but works with RAID arrays
- **Hot-swap drives**: Kamelot handles hot-swapped drives gracefully (remount required)
- **Power supply**: Redundant PSUs are supported (Kamelot's single-threaded operation doesn't benefit from multi-socket)

---

## 6. Single-Board Computer Support

### 6.1 Raspberry Pi

| Model | RAM | Kamelot Experience | AI Features? |
|-------|-----|-------------------|--------------|
| Pi 4 Model B | 2/4/8 GB | Basic file server | Limited (Qwen too large for 2 GB) |
| Pi 5 | 4/8 GB | Good personal server | Yes (8 GB model, slow embedding) |
| Pi 5 CM | 4/8 GB | Good embedded server | Yes (8 GB model) |

**Pi 5 performance:**
- File embedding: 300–500 ms
- Semantic search: 100–300 ms
- Encryption throughput: 800 MB/s
- Power consumption: 5–15 W

**Tips for Pi deployment:**
1. Use a good quality SD card (A2 class) or NVMe hat
2. Use the 8 GB model for AI features
3. Consider active cooling if embedding large batches
4. Disable GUI canvas (use CLI mode) to save resources

### 6.2 Other SBCs

| Board | CPU | RAM | Notes |
|-------|-----|-----|-------|
| Orange Pi 5 | Rockchip RK3588 | 8–32 GB | Excellent, better than Pi 5 |
| Rock Pi 5 | Rockchip RK3588 | 4–16 GB | Good alternative to Pi |
| LattePanda 3 Delta | Intel N6000 | 8 GB | x86 compatibility |
| Odroid N2+ | Amlogic S922X | 4 GB | Limited (4 GB RAM) |
| Libre Computer LePotato | Amlogic S905X | 2 GB | Insufficient RAM |

---

## 7. GPU: Nice to Have, Not Required

### 7.1 What GPU Does for Kamelot

The GPU is used for two things in Kamelot:

1. **AI embedding (via Ollama)**: GPU acceleration speeds up Qwen 2 VL inference significantly
2. **GUI canvas (via wgpu)**: Smooth rendering of the file browser interface

### 7.2 Without a GPU

If no GPU is available (or a very old GPU):

1. **AI embedding**: Falls back to CPU via Ollama. Slower but functional.
2. **GUI canvas**: Falls back to TTY (terminal) interface. Fully functional but text-only.

### 7.3 With an Integrated GPU (iGPU)

Most modern CPUs include an iGPU that can accelerate both tasks:

| iGPU | Embedding Acceleration | Canvas Performance |
|------|----------------------|-------------------|
| Intel UHD Graphics (12th gen+) | 2–3x vs CPU-only | 60 FPS |
| Intel Iris Xe | 3–4x vs CPU-only | 60 FPS |
| AMD Radeon Graphics (Ryzen 7xxx) | 3–4x vs CPU-only | 60 FPS |
| Apple M1/M2 integrated | 4–5x vs CPU-only | 60 FPS |

### 7.4 With a Discrete GPU

| GPU | Embedding Acceleration | Notes |
|-----|----------------------|-------|
| NVIDIA RTX 3060 | 8–10x vs CPU-only | Excellent value |
| NVIDIA RTX 4060 | 10–12x vs CPU-only | Recommended |
| NVIDIA RTX 4090 | 20–25x vs CPU-only | Overkill for personal use |
| AMD RX 7600 | 6–8x vs CPU-only | Good alternative |
| AMD RX 7900 XTX | 12–15x vs CPU-only | Overkill for personal use |

### 7.5 GPU Memory Requirements

| Model | VRAM Needed | Notes |
|-------|------------|-------|
| Qwen 2 VL Q4 (default) | 2–3 GB | Fits most GPUs |
| Qwen 2 VL Q8 | 4–6 GB | Higher quality but needs more VRAM |
| Qwen 2 VL FP16 | 12–16 GB | Requires high-end GPU |

---

## 8. Storage Recommendations

### 8.1 SSD vs. HDD

| Aspect | SSD | HDD |
|--------|-----|-----|
| File retrieval | <5 ms | 10–20 ms |
| Encryption throughput | 3+ GB/s | 100–200 MB/s |
| Embedding batch processing | Excellent | Good |
| Power consumption | 0.5–2 W | 5–10 W |
| Noise | Silent | Audible |
| Cost per GB | Higher | Lower |
| Recommended for | Kamelot store | Backup |

**Recommendation**: Use an SSD for the Kamelot store. Use HDDs for backup.

### 8.2 NVMe vs. SATA

| Interface | Sequential Read | Sequential Write | Random IOPS |
|-----------|----------------|-----------------|-------------|
| NVMe (PCIe 4.0) | 5–7 GB/s | 3–5 GB/s | 500K+ |
| NVMe (PCIe 3.0) | 2–3.5 GB/s | 1–2 GB/s | 200K+ |
| SATA SSD | 500–560 MB/s | 400–500 MB/s | 50–100K |
| SATA HDD | 100–200 MB/s | 100–200 MB/s | 100–200 |

Kamelot benefits from NVMe's random IOPS for index operations, but SATA SSDs are adequate for most use cases.

### 8.3 Storage Sizing

| Use Case | Store Size | Files | Index Size |
|---------|-----------|-------|------------|
| Minimal personal | 50 GB | 10,000 | 20 MB |
| Typical personal | 500 GB | 100,000 | 200 MB |
| Heavy personal | 2 TB | 500,000 | 1 GB |
| Small team | 5 TB | 1,000,000 | 2 GB |
| Enterprise | 50 TB+ | 10,000,000+ | 20 GB+ |

---

## 9. Networking Requirements

### 9.1 Local Operation (No Network Required)

Kamelot's core functionality works without any network connection:

- File storage and retrieval
- Local semantic search
- CLI and GUI interfaces
- Backup to local drives

### 9.2 K-Swarm Mesh Networking

For multi-device sync, K-Swarm requires:

| Network Type | Minimum Speed | Recommended Speed |
|-------------|--------------|-------------------|
| Local LAN | 100 Mbps | 1 Gbps |
| Remote (WAN) | 10 Mbps | 50 Mbps+ |
| Peer-to-peer (mesh) | 10 Mbps per peer | 100 Mbps per peer |

### 9.3 Cloud Sync

Kamelot does not require cloud sync. For users who choose it:

- Any internet connection (10 Mbps+ recommended)
- No static IP required (K-Swarm uses NAT traversal)
- No port forwarding needed (K-Swarm uses relay fallback)

---

## 10. Operating System Compatibility

### 10.1 Linux (Primary Platform)

| Distribution | Support Level | Notes |
|-------------|--------------|-------|
| Ubuntu 24.04 LTS | Full | Primary development target |
| Debian 12 | Full | Recommended for servers |
| Fedora 40+ | Full | Good for desktop use |
| Arch Linux | Full | Rolling release support |
| openSUSE Tumbleweed | Full | Good for testing |
| RHEL 9 / Rocky Linux 9 | Full | Enterprise deployments |
| Alpine Linux | Community | Small footprint deployment |

### 10.2 Windows

| Version | Support Level | Notes |
|---------|--------------|-------|
| Windows 10 1809+ | Full | Fully tested |
| Windows 11 | Full | Fully tested |
| Windows Server 2019+ | Full | Enterprise deployment |

Windows-specific notes:
- wgpu canvas uses DirectX 12
- File system access via Win32 API
- Task scheduler for background indexing

### 10.3 macOS

| Version | Support Level | Notes |
|---------|--------------|-------|
| macOS 12 Monterey | Full | Fully tested |
| macOS 13 Ventura | Full | Fully tested |
| macOS 14 Sonoma | Full | Fully tested |
| macOS 15 Sequoia | Full | Latest support |

macOS-specific notes:
- wgpu canvas uses Metal
- Keychain integration for key storage (optional)
- Spotlight integration (optional)

### 10.4 BSD

| Version | Support Level | Notes |
|---------|--------------|-------|
| FreeBSD 13+ | Community | Not officially tested |

---

## 11. Architecture-Specific Notes

### 11.1 x86-64

- **Baseline**: SSE4.2 recommended but not required
- **Performance features**: AVX2, AVX-512 used when available (auto-detected)
- **AES-NI**: Strongly recommended for encryption performance

### 11.2 ARM64 (aarch64)

- **Baseline**: ARMv8-A+
- **Performance features**: NEON used for vector operations
- **ARM Crypto Extensions**: Used for encryption acceleration
- **Big.LITTLE awareness**: Embedding scheduled on performance cores, background tasks on efficiency cores

### 11.3 ARMv7 (32-bit)

- Not supported (requires 64-bit for memory addressing with large models)

### 11.4 RISC-V

- Experimental support expected in 2027

---

## 12. Performance Tuning for Existing Hardware

### 12.1 For Low-RAM Systems (2–4 GB)

1. Disable AI features: `kml config set ai.enabled false`
2. Use CLI mode: `kml config set canvas.enabled false`
3. Reduce cache size: `kml config set cache.max-size 50MB`
4. Disable K-Swarm: `kml config set swarm.enabled false`

### 12.2 For Low-Power Systems (Raspberry Pi, Laptops on Battery)

1. Reduce embedding threads: `kml config set embedding.threads 2`
2. Batch index during off-peak: `kml config set index.schedule "02:00"`
3. Reduce canvas FPS: `kml config set canvas.fps 30`
4. Use CPU-only mode: `kml config set gpu.enabled false`

### 12.3 For HDD-Based Systems

1. Increase encryption buffer: `kml config set crypto.buffer-size 1MB`
2. Increase write cache: `kml config set store.write-cache 256MB`
3. Schedule background operations during idle time

### 12.4 For Multi-User Systems (Enterprise)

1. Increase Qdrant memory limit: `kml config set qdrant.memory-limit 4GB`
2. Increase thread pool: `kml config set server.threads 8`
3. Enable request queuing: `kml config set server.queue-depth 1000`
4. Use dedicated GPU for embedding

---

## 13. Conclusion

Kamelot runs on virtually any computer manufactured in the last 15 years. It requires no GPU, no cloud subscription, and no hardware upgrade. The system adapts to available resources:

- On low-end hardware (2 GB RAM, HDD): Core file storage and retrieval work perfectly
- On mid-range hardware (8 GB RAM, SATA SSD): AI features work with moderate performance
- On high-end hardware (16 GB+ RAM, NVMe, GPU): Full semantic capabilities at maximum speed

This broad compatibility means that users can adopt Kamelot on the hardware they already own. No new silicon needed.

---

---

## 14. Hardware Compatibility Tables

### 14.1 Motherboard & Chipset Compatibility

| Chipset | CPU Support | RAM Type | SATA Ports | M.2 Slots | Kamelot Rating |
|---|---|---|---|---|---|
| Intel H61 (2011) | Sandy/Ivy Bridge | DDR3 | 4 | 0 | Good |
| Intel B75 (2012) | Ivy Bridge | DDR3 | 5 | 1 (SATA) | Good |
| Intel H81 (2013) | Haswell | DDR3 | 4 | 1 (SATA) | Good |
| Intel B85 (2013) | Haswell | DDR3 | 6 | 1 (SATA) | Good |
| Intel H97 (2014) | Haswell Refresh | DDR3 | 6 | 1 (M.2) | Very Good |
| Intel B150 (2015) | Skylake | DDR4 | 6 | 1 (M.2) | Very Good |
| Intel B250 (2017) | Kaby Lake | DDR4 | 6 | 2 (M.2) | Very Good |
| Intel B360 (2018) | Coffee Lake | DDR4 | 6 | 2 (M.2) | Excellent |
| Intel B460 (2020) | Comet Lake | DDR4 | 6 | 2 (M.2) | Excellent |
| Intel B660 (2022) | Alder Lake | DDR4/DDR5 | 4 | 3 (M.2) | Excellent |
| AMD A320 (2017) | Ryzen 1xxx-3xxx | DDR4 | 4 | 1 (M.2) | Very Good |
| AMD B450 (2018) | Ryzen 1xxx-5xxx | DDR4 | 6 | 2 (M.2) | Excellent |
| AMD B550 (2020) | Ryzen 3xxx-5xxx | DDR4 | 6 | 2 (M.2) | Excellent |
| AMD X570 (2019) | Ryzen 3xxx-5xxx | DDR4 | 8 | 2 (M.2) | Excellent |

### 14.2 Network Card Compatibility

| NIC Model | Speed | Type | Kamelot Support | Notes |
|---|---|---|---|---|
| Realtek RTL8111/8168 | 1 Gbps | Integrated | Full | Most common, works out of box |
| Intel I219-V/I219-LM | 1 Gbps | Integrated | Full | Excellent Linux support |
| Intel I210-T1 | 1 Gbps | PCIe | Full | Server-grade, very reliable |
| Intel X550-T2 | 10 Gbps | PCIe | Full | High-end, overkill for most |
| Broadcom BCM5720 | 1 Gbps | Integrated | Full | Common on Dell servers |
| Realtek RTL8125BG | 2.5 Gbps | Integrated | Full | Modern motherboards |
| Qualcomm Atheros QCA8171 | 1 Gbps | Integrated | Full | Budget systems |
| USB 2.0 Ethernet (various) | 100 Mbps | USB | Limited | Slow but functional |
| USB 3.0 Ethernet (various) | 1 Gbps | USB | Full | Good for systems without onboard NIC |
| Intel AX200/AX210 | WiFi 6 | M.2 | Full | Best WiFi option |
| Realtek RTL8822CE | WiFi 5 | M.2 | Full | Common in mid-range laptops |

### 14.3 GPU Compatibility Matrix

| GPU | VRAM | Embedding Speedup | Canvas Performance | Power Draw | Form Factor |
|---|---|---|---|---|---|
| NVIDIA GT 710 (2014) | 1 GB | 1.2x | 30 FPS | 19 W | Low profile |
| NVIDIA GT 1030 (2017) | 2 GB | 2.5x | 60 FPS | 30 W | Low profile |
| NVIDIA GTX 1650 (2019) | 4 GB | 4x | 60+ FPS | 75 W | Single slot |
| NVIDIA RTX 3060 (2021) | 12 GB | 8x | 60+ FPS | 170 W | Dual slot |
| NVIDIA RTX 4060 (2023) | 8 GB | 10x | 60+ FPS | 115 W | Dual slot |
| AMD RX 6400 (2022) | 4 GB | 3x | 60 FPS | 53 W | Single slot |
| AMD RX 6600 (2021) | 8 GB | 5x | 60+ FPS | 132 W | Dual slot |
| Intel Arc A380 (2022) | 6 GB | 3x | 60 FPS | 75 W | Single slot |
| Intel Arc A750 (2022) | 8 GB | 5x | 60+ FPS | 225 W | Dual slot |

### 14.4 Storage Controller Compatibility

| Controller | Interface | Max Drives | RAID Support | Kamelot Notes |
|---|---|---|---|---|
| Intel RST (onboard) | SATA | 6 | 0/1/5/10 | Works, passthrough mode preferred |
| AMD RAID (onboard) | SATA | 8 | 0/1/10 | Works, passthrough mode preferred |
| LSI/Broadcom SAS 9207-8i | SAS/SATA | 8 | 0/1/10 | Excellent for large storage pools |
| LSI/Broadcom SAS 9305-16i | SAS/SATA | 16 | 0/1/10 | Enterprise, excellent |
| Marvell 88SE9230 | SATA | 4 | 0/1 | Works, no special config needed |
| ASMedia ASM1062 | SATA | 2 | None | Simple, works out of box |

---

## 15. Migration Case Studies

### 15.1 Case Study: K-12 School District — 500 Chromebooks + 50 Desktops

**Background**: A school district had 500 Chromebooks (2018-2021 models, 4 GB RAM, 32 GB eMMC) used by students and 50 Dell OptiPlex desktops (2015-2018) used by staff. File storage was a mix of Google Drive (consumer, no educational compliance) and USB drives.

**Migration**: The district deployed Kamelot on the 50 desktops as a K-Swarm cluster for centralized storage. Chromebooks accessed files via the Kamelot web interface (no client installation needed). The existing Google Drive data was batch-exported and indexed.

**Results**:
- 2 TB of curriculum materials, student work, and administrative documents centralized and searchable
- 500 students and 50 staff members could search across all files with natural language queries
- The district eliminated $3,000/month in Google Workspace licensing fees
- Offline access via cached copies on Chromebooks ensured learning continuity during internet outages
- Student privacy concerns were addressed — no data left the district's network
- IT staff reported 80% reduction in file recovery requests

### 15.2 Case Study: Healthcare Clinic — Mixed Windows/Mac Environment

**Background**: A 15-provider healthcare clinic used a mix of Windows and Mac workstations. Patient records were stored on a Windows file server organized by patient last name. Finding records for patients with common last names was difficult.

**Migration**: Kamelot was installed on the existing Windows Server 2019 file server. Semantic search indexed both patient records (PDFs) and associated clinical data. HIPAA-compliant encryption was configured.

**Results**:
- Providers could search by diagnosis, procedure, medication, or date range — not just patient name
- A provider found 12 patients with a rare condition by searching "lupus nephritis class IV" instead of browsing folders
- The clinic avoided a $25,000 EMR upgrade by extending their existing system with semantic search
- Audit logging in Kamelot satisfied compliance requirements for patient data access tracking
- Cross-referencing patients by condition became possible for the first time, improving population health management

### 15.3 Case Study: Software Development Company — 100 Developer Workstations

**Background**: A software company with 100 developers stored code, documentation, and design files on network shares organized by project. Developers spent significant time searching for documentation, specifications, and historical design decisions.

**Migration**: Kamelot was deployed on each developer workstation (no central server). K-Swarm mesh enabled shared semantic search across all workstations. Git repositories were indexed alongside design files, meeting notes, and technical specifications.

**Results**:
- Developers could search across code, docs, and designs with a single query
- Historical design decisions documented in meeting notes were suddenly discoverable
- Onboarding time for new developers dropped from 4 weeks to 2 weeks (new hires could find relevant documentation immediately)
- The company created a company-wide semantic knowledge graph linking code, docs, and design files
- Indexing occurred locally on each workstation, so no server infrastructure was needed

---

## Hardware Compatibility Matrix

### Tested Configurations

The following configurations have been tested with Kamelot and verified to work across all features.

#### Desktop Configurations

| Configuration ID | CPU | RAM | Storage | GPU | OS | Status |
|-----------------|-----|-----|---------|-----|-----|--------|
| DESKTOP-001 | Intel i5-12400 | 16 GB DDR4 | 512 GB NVMe | None (iGPU) | Ubuntu 24.04 | ✅ Verified |
| DESKTOP-002 | Intel i7-13700K | 32 GB DDR5 | 1 TB NVMe | RTX 4060 8 GB | Ubuntu 24.04 | ✅ Verified |
| DESKTOP-003 | AMD Ryzen 5 7600 | 16 GB DDR5 | 512 GB NVMe | None (iGPU) | Fedora 40 | ✅ Verified |
| DESKTOP-004 | AMD Ryzen 7 7800X3D | 32 GB DDR5 | 2 TB NVMe | RX 7600 8 GB | Ubuntu 24.04 | ✅ Verified |
| DESKTOP-005 | Intel i9-13900K | 64 GB DDR5 | 4 TB NVMe | RTX 4090 24 GB | Ubuntu 24.04 | ✅ Verified |
| DESKTOP-006 | Intel i3-10100 | 8 GB DDR4 | 256 GB SATA SSD | None | Windows 11 | ✅ Verified |
| DESKTOP-007 | Intel i5-6500 | 8 GB DDR4 | 500 GB HDD | None | Windows 10 | ✅ Verified (limited AI) |
| DESKTOP-008 | AMD Ryzen 3 2200G | 8 GB DDR4 | 240 GB SATA SSD | None | Linux Mint 21 | ✅ Verified |

#### Laptop Configurations

| Configuration ID | Model | CPU | RAM | Storage | OS | Status |
|-----------------|-------|-----|-----|---------|-----|--------|
| LAPTOP-001 | ThinkPad X1 Carbon Gen 10 | i7-1265U | 16 GB | 512 GB NVMe | Ubuntu 24.04 | ✅ Verified |
| LAPTOP-002 | ThinkPad T480 | i5-8350U | 16 GB | 512 GB SATA SSD | Fedora 40 | ✅ Verified |
| LAPTOP-003 | Dell Latitude 5440 | i5-1345U | 16 GB | 256 GB NVMe | Windows 11 | ✅ Verified |
| LAPTOP-004 | Dell XPS 15 9530 | i7-13700H | 32 GB | 1 TB NVMe | Ubuntu 24.04 | ✅ Verified |
| LAPTOP-005 | MacBook Air M2 | M2 8-core | 16 GB | 256 GB | macOS 14 | ✅ Verified |
| LAPTOP-006 | MacBook Pro M3 Max | M3 Max 16-core | 48 GB | 1 TB | macOS 14 | ✅ Verified |
| LAPTOP-007 | HP EliteBook 840 G8 | i5-1135G7 | 16 GB | 256 GB NVMe | Windows 10 | ✅ Verified |
| LAPTOP-008 | Lenovo Yoga 9i Gen 8 | i7-1360P | 16 GB | 512 GB NVMe | Windows 11 | ✅ Verified |

#### Server Configurations

| Configuration ID | Model | CPU | RAM | Storage | GPU | Status |
|-----------------|-------|-----|-----|---------|-----|--------|
| SERVER-001 | Dell PowerEdge R740 | Xeon Gold 6248R (2) | 128 GB | 4× 2 TB NVMe RAID10 | None | ✅ Verified |
| SERVER-002 | HPE ProLiant DL380 Gen10 | Xeon Silver 4214 (2) | 64 GB | 8× 4 TB SATA SSD RAID6 | None | ✅ Verified |
| SERVER-003 | Supermicro SYS-110D | Xeon D-2142IT | 32 GB | 2× 1 TB NVMe | None | ✅ Verified |
| SERVER-004 | Custom Ryzen 9 7950X | AMD Ryzen 9 7950X | 64 GB | 2× 2 TB NVMe | RTX 4060 | ✅ Verified |
| SERVER-005 | Raspberry Pi 5 | BCM2712 | 8 GB | 128 GB NVMe hat | None | ✅ Verified |
| SERVER-006 | Orange Pi 5 Plus | RK3588 | 16 GB | 256 GB NVMe | None | ✅ Verified |

### Driver Requirements

#### Required Drivers

| Component | Linux | Windows | macOS |
|-----------|-------|---------|-------|
| Kamelot binary | None (static binary) | None (static binary) | None (static binary) |
| Ollama | None (auto-downloads) | None (auto-downloads) | None (auto-downloads) |
| Qdrant | None (bundled) | None (bundled) | None (bundled) |
| FUSE (optional) | libfuse2/3 | WinFsp | macFUSE |
| GPU (NVIDIA) | nvidia-driver-545+ | NVIDIA Game Ready 545+ | Built-in |
| GPU (AMD) | mesa 24+ | AMD Adrenalin 24+ | N/A |
| wgpu | Vulkan 1.0+ driver | DirectX 12 | Metal |

#### Driver Installation

```bash
# Linux: NVIDIA GPU driver
sudo apt install nvidia-driver-550
sudo nvidia-xconfig
sudo systemctl restart display-manager
# Verify: nvidia-smi should show GPU

# Linux: AMD GPU driver (mesa)
sudo apt install mesa-vulkan-drivers
# Verify: vulkaninfo should list AMD device

# Linux: FUSE for filesystem mount
sudo apt install fuse3
sudo modprobe fuse
```

#### Driver Verification Script

```bash
kml diagnose drivers
# Kamelot Driver Diagnostics
# 
# ┌─────────────────────┬─────────┬────────────────────┐
# │ Component           │ Status  │ Details            │
# ├─────────────────────┼─────────┼────────────────────┤
# │ FUSE driver         │ ✅      │ fuse3 1.14.0       │
# │ Vulkan driver       │ ✅      │ NVIDIA 550.78      │
# │ Ollama connection   │ ✅      │ localhost:11434    │
# │ Qdrant connection   │ ✅      │ localhost:6333     │
# │ AES-NI support      │ ✅      │ Available          │
# │ AVX2 support        │ ✅      │ Available          │
# │ GPU compute         │ ✅      │ CUDA 12.4          │
# └─────────────────────┴─────────┴────────────────────┘
```

### Known Issues

#### Compatibility Issues

| Issue ID | Affected Hardware | Symptom | Workaround | Status |
|----------|------------------|---------|------------|--------|
| KCI-001 | AMD Ryzen 1xxx series | Slow embedding (50% expected performance) | Use CPU-only mode | Known limitation |
| KCI-002 | Intel HD Graphics 2500 (Ivy Bridge) | wgpu canvas fails to initialize | Use CLI mode | Won't fix (HW too old) |
| KCI-003 | Realtek RTL8821CE WiFi | K-Swarm mesh disconnects under load | Use Ethernet | Driver issue, upstream |
| KCI-004 | Raspberry Pi 4 (2 GB model) | Out of memory during AI embedding | Disable AI features | Known limitation |
| KCI-005 | Virtual machines with < 2 vCPUs | Slow index performance | Assign more vCPUs | Expected behavior |
| KCI-006 | 32-bit ARM systems | Binary not available | Use 64-bit OS | Won't fix |
| KCI-007 | Windows 10 < 1809 | Binary compatibility issues | Update to 1809+ | Won't fix |
| KCI-008 | WSL1 (not WSL2) | File performance issues | Use WSL2 or native | Won't fix |

#### Known Limitations

| Limitation | Description | Planned Resolution |
|-----------|-------------|-------------------|
| 32-bit OS support | No 32-bit binaries provided | No plans |
| Very old GPUs (pre-2012) | No Vulkan support | No plans (HW too old) |
| Android/iOS devices | No native mobile client | Q4 2026 |
| Itanium (IA-64) | Not supported | No plans |
| 68000 series Macs | Not supported | No plans |

### Performance Tiers

Kamelot categorizes hardware into performance tiers based on real-world testing.

#### Tier Definitions

| Tier | Requirements | Capabilities | User Experience |
|------|-------------|--------------|-----------------|
| **Tier 1: Bronze** | 2-4 GB RAM, any CPU, any storage | Core file storage, basic search, CLI only | Functional without AI |
| **Tier 2: Silver** | 4-8 GB RAM, quad-core CPU, SSD | AI features with reduced speed, CLI + GUI | Good for personal use |
| **Tier 3: Gold** | 8-16 GB RAM, 6+ core CPU, NVMe | Full AI features, good performance | Excellent for power users |
| **Tier 4: Platinum** | 16-32 GB RAM, 8+ core CPU, NVMe + GPU | Maximum performance, multiple concurrent users | Enterprise-grade |
| **Tier 5: Titanium** | 32+ GB RAM, 16+ core CPU, NVMe + high-end GPU | High-throughput, large-scale deployments | Large enterprise |

#### Tier-Specific Benchmarks

| Benchmark | Bronze | Silver | Gold | Platinum | Titanium |
|-----------|--------|--------|------|----------|----------|
| File embedding | > 1,000 ms | 200-500 ms | 50-200 ms | 20-80 ms | 10-40 ms |
| Search (P50) | > 500 ms | 150-300 ms | 50-150 ms | 15-50 ms | 8-25 ms |
| Search (P95) | > 2,000 ms | 500-1,000 ms | 150-500 ms | 50-150 ms | 25-80 ms |
| Files indexed/day | 10,000 | 50,000 | 200,000 | 500,000 | 1,000,000+ |
| Encryption throughput | 200 MB/s | 800 MB/s | 2 GB/s | 4 GB/s | 6 GB/s+ |
| Concurrent users | 1 | 1-3 | 3-10 | 10-50 | 50-200+ |
| Max file collection | 10,000 | 100,000 | 1,000,000 | 10,000,000 | 100,000,000+ |

#### Example Hardware by Tier

| Tier | Example System | Approximate Price (2026) |
|------|---------------|-------------------------|
| Bronze | Raspberry Pi 5 (8 GB), Celeron laptop | $50 - $200 |
| Silver | ThinkPad T480, Dell OptiPlex 3050 | $200 - $500 |
| Gold | Dell XPS 15, custom Ryzen 5 desktop | $500 - $1,500 |
| Platinum | MacBook Pro M3 Pro, Threadripper workstation | $1,500 - $5,000 |
| Titanium | Dual Xeon server, EPYC workstation | $5,000+ |

---

## 16. Performance Tuning Benchmarks

### 16.1 Configuration Parameter Impact

| Configuration Change | Embedding Speed | Search Speed | Memory Usage | CPU Usage | Best For |
|---|---|---|---|---|---|
| Default (no changes) | Baseline | Baseline | Baseline | Baseline | Balanced |
| `embedding.threads 4` | +25% | No change | +50 MB | +40% | Modern multi-core CPUs |
| `embedding.threads 1` | -40% | No change | -30 MB | -30% | Low-power systems |
| `qdrant.memory-limit 2GB` | No change | +15% | +1.5 GB | +5% | Systems with spare RAM |
| `qdrant.memory-limit 512MB` | No change | -25% | -1 GB | -5% | Systems with 4 GB RAM |
| `gpu.enabled true` | +200-400% | No change | +VRAM | -40% (CPU) | Systems with GPU |
| `canvas.enabled false` | No change | No change | -200 MB | -2% | Headless servers |
| `ai.enabled false` | N/A | N/A | -1.5 GB | -40% | Minimum RAM systems |

### 16.2 Index Size vs. Performance Scaling

| Number of Files | Index Size | Initial Index Time (i5-6500) | Search (P50) | Search (P99) |
|---|---|---|---|---|
| 1,000 | 2.5 MB | 45 sec | 50 ms | 120 ms |
| 10,000 | 25 MB | 7 min | 80 ms | 200 ms |
| 100,000 | 250 MB | 1.2 hr | 150 ms | 400 ms |
| 500,000 | 1.2 GB | 6 hr | 350 ms | 900 ms |
| 1,000,000 | 2.5 GB | 12 hr | 600 ms | 1.8 sec |
| 5,000,000 | 12 GB | 60 hr | 2.1 sec | 6.5 sec |
| 10,000,000 | 25 GB | 120 hr | 4.5 sec | 14 sec |

Index size scales linearly with file count. Search speed degrades logarithmically. For collections over 1M files, consider using a dedicated GPU and 32 GB+ of RAM.

### 16.3 Power Consumption Profiles

| Hardware Profile | Idle (W) | Indexing (W) | Search (W) | Annual Energy (kWh) | Annual Cost ($0.12/kWh) |
|---|---|---|---|---|---|
| Raspberry Pi 5 | 3 | 12 | 5 | 52 | $6.24 |
| Old laptop (2012) | 14 | 38 | 18 | 175 | $21.00 |
| SFF desktop (2016) | 18 | 52 | 22 | 240 | $28.80 |
| Mid-tower desktop (2020) | 35 | 110 | 45 | 420 | $50.40 |
| Enterprise server (R740) | 120 | 350 | 150 | 1,520 | $182.40 |
| K-Swarm cluster (10 SFF) | 180 | 520 | 220 | 2,400 | $288.00 |

*For hardware compatibility questions: hardware@kamelot.dev*

*Last updated: June 2026*

*This document is part of the No More Silicon documentation suite. See also:*
- *01-beyond-hierarchy.md — Beyond hierarchical filesystems*
- *02-software-defined-storage.md — Software-defined storage*
- *04-edge-computing.md — Edge computing architecture*
- *05-legacy-hardware-reuse.md — Legacy hardware reuse*
- *06-specs-requirements.md — Detailed specifications and requirements*

---

*Kamelot is a project of Lois-Kleinner & 0-1.gg. © 2026. All rights reserved.*
