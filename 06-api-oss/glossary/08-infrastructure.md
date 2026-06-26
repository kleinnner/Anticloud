---
title: "Glossary 8: Infrastructure Glossary"
sidebar_position: 8
description: "Documentation for Glossary 8: Infrastructure Glossary"
tags: [glossary]
---

# Glossary 8: Infrastructure Glossary

## Terms

### Single Binary
- A single executable file containing the entire application
- API-OSS ships as a single binary with no external dependencies

### Docker
- Container platform for packaging and running applications
- API-OSS provides official Docker images

### Docker Compose
- Multi-container Docker orchestration
- API-OSS provides docker-compose.yml for model + app + bridges

### Kubernetes (K8s)
- Container orchestration platform
- API-OSS provides Helm charts for K8s deployment

### Helm Chart
- Kubernetes package manager template
- API-OSS Helm chart supports production-grade deployment

### GPU (Graphics Processing Unit)
- Specialized processor for parallel computation
- API-OSS supports CUDA (NVIDIA), ROCm (AMD), Vulkan, Metal

### CUDA
- NVIDIA's parallel computing platform
- API-OSS uses CUDA for GPU-accelerated inference

### ROCm
- AMD's GPU computing platform
- API-OSS supports ROCm for AMD GPU inference

### CPU Inference
- Running models on CPU only (no GPU required)
- API-OSS optimized for CPU inference via llama.cpp backend

### Metal
- Apple's GPU framework
- API-OSS supports Metal acceleration on macOS

### Vulkan
- Cross-platform GPU API
- API-OSS supports Vulkan for GPU inference

### VRAM (Video RAM)
- GPU memory used for model loading
- Determines maximum model size that can run

### RAM (Random Access Memory)
- System memory for application data
- API-OSS memory usage scales with document index size

### Storage Backend
- Where data is persisted (local disk, NAS, S3, NFS)
- API-OSS supports multiple storage backends

### Config File (config.toml)
- TOML-format configuration for API-OSS
- Controls models, ports, auth, logging, and all settings

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)

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