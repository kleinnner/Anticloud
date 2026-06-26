---
title: "Glossary 11: Storage Glossary"
sidebar_position: 11
description: "Documentation for Glossary 11: Storage Glossary"
tags: [glossary]
---

# Glossary 11: Storage Glossary

## Terms

### SQLite
- Embedded relational database engine
- API-OSS uses SQLite for metadata, user data, and configuration

### WAL (Write-Ahead Logging)
- SQLite journaling mode for better concurrency
- API-OSS enables WAL mode by default

### Materialized View
- Pre-computed query result stored as a table
- API-OSS uses for offline data access and performance

### Zero-Copy Clone
- Instant dataset copy without duplicating data
- Uses copy-on-write — only changes consume new storage

### Copy-on-Write (CoW)
- Storage optimization: data shared until modified
- Foundation for zero-copy clones

### Snapshot
- Point-in-time copy of data for backup/recovery
- API-OSS supports instant snapshots via zero-copy technology

### Backup
- Copy of data for disaster recovery
- API-OSS supports: file copy, rsync, S3, automated backup schedule

### Data Directory
- Location where API-OSS stores all data
- Configurable via config.toml (default: ./data/)

### Storage Quota
- Maximum storage allowed per user/team
- Enforced in multi-user configurations

### Deduplication
- Eliminating duplicate data to save space
- API-OSS detects and deduplicates document storage

### Compression
- Reducing data size algorithmically
- API-OSS compresses stored documents (configurable level)

### Data Migration
- Moving data between API-OSS versions or instances
- API-OSS provides migration tools and version compatibility

### Export
- Extracting data in portable format (JSON, CSV, AIOSS)
- API-OSS supports full and partial exports

### Import
- Loading data from external sources
- API-OSS supports: files, API, connectors, marketplace

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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
