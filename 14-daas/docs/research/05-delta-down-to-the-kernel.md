# We traced cloud dependency to its root — the kernel — and built the off switch.

**Δ Down to the Kernel: Why the Cloud's Grip Starts at Ring-0**

---

## The Problem

Most sovereignty-focused systems operate at the application layer. They run on standard operating systems, on standard kernels, and assume that application-level changes are sufficient to guarantee independence from cloud providers. This is false. The kernel is the first and most fundamental point of collapse. Every operating system kernel makes assumptions about the hardware it runs on, the storage it uses, the network it connects to. These assumptions are a form of hidden lock-in — they commit the system to a specific vision of how computing works. If that vision was shaped by cloud assumptions, the system is already collapsed into a cloud-dependent state before any application code runs.

## What We Built

We designed the Δ kernel architecture: a kernel that exists in superposition across all possible hardware, storage, and network configurations until the moment of boot. The Δ kernel uses TPM 2.0 measured boot to attest to every possible hardware configuration simultaneously, deferring the collapse into a specific configuration until the system actually encounters the hardware. This means the same kernel binary can boot on bare metal, in a VM, on a container runtime, or on a cloud instance — and it will collapse into exactly the driver set, memory model, and I/O scheduler that the hardware requires, without ever being recompiled or reconfigured. The kernel does not know what it will run on. It holds all possibilities until measurement forces collapse.

## The Research

The operating system kernel is the deepest layer at which cloud dependency can be embedded. We analyze the assumptions that standard kernels make about hardware, storage, networking, and trust, and demonstrate that each assumption is a point of collapse into cloud dependency. We propose the Δ kernel architecture: a kernel designed from first principles to exist in superposition across all possible hardware configurations. The Δ kernel uses TPM 2.0 measured boot as its collapse mechanism — the hardware itself tells the kernel which state to collapse into, through PCR measurements that form a unique hardware identity. The same binary can boot on any hardware because it was never written for specific hardware. It was written for all hardware simultaneously.

> **Full citation:** Alpasan, L.-K. (2026). Δ Down to the Kernel: Why the Cloud's Grip Starts at Ring-0. *The Anticloud Research Corpus.*

## Why The Anticloud

Every layer above the kernel inherits the kernel's assumptions. If your kernel expects a network to configure itself via DHCP, your system has already collapsed into a network-dependent state before your application starts. If your kernel expects block storage from a specific vendor, your system has already committed to that vendor's ecosystem. The Anticloud does not operate at the application layer and assume the kernel is safe. The Anticloud redefines the kernel itself — the Δ kernel that holds all hardware possibilities until the moment it meets the hardware. That is the only way to guarantee that sovereignty is not compromised at the deepest level.

ΔaaS requires one machine, one binary, and zero trust in anyone.

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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