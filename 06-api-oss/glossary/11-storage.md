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
