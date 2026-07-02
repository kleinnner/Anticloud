<!-- SEO -->
<meta name="description" content="Sovereign-OS — Arch Linux-based sovereign operating system with .aioss ledger daemon, custom toolchain, TPM attestation, measured boot, 20 GNOME shell extensions.">
<meta name="keywords" content="sovereign os, privacy OS, linux, cryptography, TPM, attestation">



<!-- Breadcrumb: Home > Projects > Sovereign-OS -->

![Status](https://img.shields.io/badge/status-experimental-ff3b30?style=for-the-badge)
![Category](https://img.shields.io/badge/category-OS-ff3b30?style=for-the-badge)
![Language](https://img.shields.io/badge/language-Linux-000000?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# Sovereign-OS

Arch Linux-based Sovereign Operating System with .aioss ledger daemon, custom toolchain, TPM attestation, measured boot, and 20 GNOME shell extensions.

## Quick Facts

| Attribute | Value |
|-----------|-------|
| **Status** | ![Experimental](https://img.shields.io/badge/-experimental-ff3b30) |
| **Category** | Core Infrastructure |
| **Language** | Linux (Arch Linux) |
| **Source** | [`05-sovereign-os/`](https://github.com/kleinnner/Anticloud/tree/main/05-sovereign-os) |
| **Dependencies** | Kasteran, Libern, aioss-format |

## Boot Chain

```mermaid
flowchart TD
    P[Power On] -->|UEFI| TB[TPM Measured Boot]
    TB -->|PCR Values| AT[Attestation]
    TB -->|Secure| BL[Boot Loader]
    BL -->|Verified| KN[Linux Kernel]
    KN -->|Init| SD[systemd]
    SD -->|Start| AL[.aioss Ledger Daemon]
    SD -->|Load| CT[Custom Toolchain]
    SD -->|Start| GS[GNOME Shell<br/>+ 20 Extensions]
    AL -->|Log Events| AF[.aioss Ledger]
    AT -->|Remote Verify| VS[Verification Server]
```

## Relationship Graph

```mermaid
flowchart LR
    SOV[Sovereign-OS] -->|Custom Toolchain| KAS[Kasteran]
    SOV -->|Crypto| LIB[Libern]
    SOV -->|Ledger| AIO[aioss-format]
    SOV -->|Attestation| VS[Verification Server]
```

## Boot Attestation

```mermaid
sequenceDiagram
    UEFI->>TPM: measure(firmware)
    TPM-->>UEFI: PCR_0
    UEFI->>Bootloader: start
    Bootloader->>TPM: measure(kernel)
    TPM-->>Bootloader: PCR_1
    Bootloader->>Kernel: start
    Kernel->>TPM: measure(initramfs)
    TPM-->>Kernel: PCR_2
    Kernel->>aioss: attest(PCR_0, PCR_1, PCR_2)
    aioss-->>Kernel: ledger_entry
    Kernel->>User: verified boot complete
```

## Key Features

- **TPM Measured Boot**: Hardware-rooted trust from power-on
- **.aioss Ledger Daemon**: System-wide cryptographic audit
- **Custom Toolchain**: Built with Kasteran compiler
- **20 GNOME Extensions**: Enhanced privacy and security UI
- **Remote Attestation**: Verify system integrity over network
- **Privacy-First Design**: No telemetry, no cloud dependencies

## Related Projects

| Project | Relationship | Protocol |
|---------|-------------|----------|
| [Kasteran](Kasteran) | Custom toolchain — compiled with Kasteran | Native |
| [Libern](Libern) | Cryptographic dependency — provides Ed25519, SHA3-256 | FFI |
| [aioss-format](aioss-format) | Ledger — system-wide cryptographic audit | IPC |

---

> 📖 **Full docs**: [Docusaurus Sovereign-OS](https://kleinnner.github.io/Anticloud/docs/projects/sovereign-os) · [Home](Home) · [Projects](Projects) · [Architecture](Architecture) · [Ecosystem](Ecosystem) · [Roadmap](Roadmap) · [Glossary](Glossary) · [Protocol-Spec](Protocol-Spec)

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! OSF ! DANS ! Figshare           !
!  Academia.edu ! HuggingFace ! ORCID                                !
!  Internet Archive ! anticloud.telepedia.net ! Miraheze             !
!  anticloud.fandom.com                                             !
!                                                                    !
!  0-1.gg ! GitHub ! GitLab ! Codeberg ! GH Pages                    !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  LinkedIn ! DEV ! WordPress ! Tumblr                               !
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ