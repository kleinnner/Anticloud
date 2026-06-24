---
title: "Glossary 13: Plugin Glossary"
sidebar_position: 13
description: "Documentation for Glossary 13: Plugin Glossary"
tags: [glossary]
---

# Glossary 13: Plugin Glossary

## Terms

### Plugin
- A reusable extension packaged as a WASM module
- Adds new capabilities to API-OSS without modifying core

### WASM (WebAssembly)
- Binary instruction format for sandboxed execution
- Plugin runtime environment in API-OSS

### Plugin Manifest
- TOML/YAML file describing plugin metadata and permissions
- Required for all marketplace plugins

### Plugin Permissions
- Declared capabilities the plugin needs (filesystem, network, etc.)
- Reviewed and approved at install time

### Sandbox
- Isolated execution environment for plugin code
- Prevents malicious or buggy plugins from affecting the system

### Plugin SDK
- Development kit for building plugins
- Provides: API bindings, testing tools, documentation

### Plugin Scaffold
- Auto-generated plugin template
- `api-oss plugin scaffold` command creates boilerplate

### Tool Plugin
- Plugin that implements a new tool the AI can use
- Examples: calculator, web scraper, code executor

### Connector Plugin
- Plugin that connects to an external data source
- Examples: Salesforce, SAP, ServiceNow, Jira

### Bridge Plugin
- Plugin that implements a new communication bridge
- Examples: custom platform integration

### Dashboard Plugin
- Plugin that provides a custom frontend view
- Built with React components

### Data Source Plugin
- Plugin that provides data for RAG/ingestion
- Examples: custom database connector, file format parser

### Model Loader Plugin
- Plugin that adds support for new model formats
- Advanced: extends model loading capabilities

### Plugin Marketplace
- Central repository for publishing and discovering plugins
- Supports: search, ratings, reviews, one-click install

### Revenue Share
- Split of plugin sale revenue between author and platform
- Standard: 70% author, 30% platform

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)
