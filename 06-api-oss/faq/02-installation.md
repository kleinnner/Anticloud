---
title: "INSTALLATION — FREQUENTLY ASKED QUESTIONS"
sidebar_position: 2
description: "Download the latest release binary for your platform, place it in a directory of your choice, download a GGUF model file, and run `api-oss start`. Full setup takes approximately five minutes."
tags: [faq]
---

# INSTALLATION — FREQUENTLY ASKED QUESTIONS

## How do I install API-SOS?

Download the latest release binary for your platform, place it in a directory of your choice, download a GGUF model file, and run `api-oss start`. Full setup takes approximately five minutes.

## What operating systems are supported?

Windows 10/11 (x86_64), Ubuntu 20.04+ (x86_64, ARM64), and macOS 12+ (Apple Silicon, Intel).

## What are the exact system requirements?

Minimum: 4-core CPU, 8 GB RAM, 10 GB free storage. Recommended: 8-core CPU, 16-32 GB RAM, NVIDIA CUDA GPU with 8 GB+ VRAM, 50 GB SSD.

## How do I upgrade from an older version?

Download the new binary, stop the running gateway, replace the old binary, and restart. Your configuration, ledger, and knowledge graph are preserved. See docs/enterprise/08-upgrading-between-versions.md for details.

## Can I install on an air-gapped machine?

Yes. Download the binary, model files, and any dependencies on a connected machine, transfer them via secure media (USB drive, optical disc), and run completely offline.

## How do I install on Windows silently?

Use the silent deployment guide at docs/enterprise/02-silent-windows-deployment.md. The binary is a single .exe with no installer; distribute it via Group Policy or SCCM.

## Can I run API-SOS in Docker?

Yes. See docs/enterprise/05-docker-deployment.md for the Dockerfile and docker-compose configuration.

## Can I deploy on Kubernetes?

Yes. See docs/KUBERNETES/deployment-guide.md for Helm charts and configuration.

## What files do I need to back up before upgrading?

Your `gateway-config.json` (or custom config), the `data/` directory (ledger, graph database, models), and any custom certificates.

## See Also

Related FAQ, support, and troubleshooting documentation.

- [FAQ Index](../faq/01-general.md)
- [Support Guide](../support/01-getting-help.md)
- [Troubleshooting](../troubleshooting/01-app-wont-start.md)
- [User Manual](../user-manual/01-getting-started.md)

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

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