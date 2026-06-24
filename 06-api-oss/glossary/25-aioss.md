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
