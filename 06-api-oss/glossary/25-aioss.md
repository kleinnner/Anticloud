---
title: "Glossary 25: AIOSS Glossary"
sidebar_position: 25
description: "Documentation for Glossary 25: AIOSS Glossary"
tags: [glossary]
---

# Glossary 25: AIOSS Glossary

## Terms

### AIOSS Format
- AI Open Source Standard — portable format for AI assets
- API-OSS uses AIOSS for: model metadata, datasets, plugins, configurations

### AIOSS File
- A `.aioss` file containing assets and metadata
- Analogous to `.tar.gz` with structured manifest

### AIOSS Manifest
- Metadata file inside AIOSS archive
- Contains: type, version, author, license, description, dependencies

### AIOSS Asset Types
- Categories of AIOSS-packaged content
- Types: model, dataset, plugin, configuration, workflow, graph

### AIOSS Model Package
- Model weights + tokenizer + config in single file
- Portable — works across different AI platforms

### AIOSS Dataset Package
- Annotated dataset in standardized format
- Includes: data, labels, schema, splits, metadata

### AIOSS Plugin Package
- WASM plugin + manifest in AIOSS format
- For marketplace distribution

### AIOSS Configuration
- API-OSS config exported in AIOSS format
- Portable setup for sharing deployments

### Interoperability
- AIOSS format works across AI platforms
- Goal: reduce vendor lock-in for AI assets

### Metadata
- Structured information describing the asset
- Fields: name, version, author, license, tags, description, date

### License Field
- Declared license for the AIOSS asset
- Supports: MIT, Apache 2.0, GPL, CC-BY, custom

### Checksum
- Cryptographic hash of AIOSS contents
- Ensures integrity during transfer

### Signature
- Cryptographic signature of AIOSS package
- Verifies publisher identity

### Version Compatibility
- API-OSS version required for this AIOSS asset
- Ensures feature compatibility

### AIOSS Registry
- Repository of AIOSS packages (like npm/pip)
- Federated: anyone can host a registry

### AIOSS Export/Import
- Exporting from or importing to API-OSS
- `api-oss export --format aioss` / `api-oss import --file package.aioss`

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com