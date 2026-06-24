---
title: "Glossary 3: Technical Terms"
sidebar_position: 3
description: "Documentation for Glossary 3: Technical Terms"
tags: [glossary]
---

# Glossary 3: Technical Terms

## Terms

### WebSocket
- Bidirectional communication protocol (full-duplex over TCP)
- API-OSS uses WebSocket as its primary API protocol (810 message types)

### REST API
- HTTP-based API following RESTful principles
- API-OSS provides OpenAI-compatible REST endpoints

### SDK (Software Development Kit)
- Language-specific libraries for integrating with API-OSS
- Available: Python, JavaScript/TypeScript, Rust

### CLI (Command Line Interface)
- Terminal-based tool for managing API-OSS
- Supports 87+ commands for all operations

### Single Binary
- API-OSS ships as a single executable file (no dependencies)
- Simplifies deployment and reduces attack surface

### WASM (WebAssembly)
- Portable binary instruction format for sandboxed execution
- API-OSS uses WASM for plugin isolation and security

### MCP (Model Context Protocol)
- Protocol for AI models to interact with external tools
- API-OSS implements MCP server for tool integration

### pgwire (PostgreSQL Wire Protocol)
- Allows PostgreSQL-compatible clients to query API-OSS
- Enables integration with existing database tools

### GraphQL
- Query language for APIs
- API-OSS provides GraphQL interface for complex queries

### gRPC
- High-performance RPC framework
- API-OSS supports gRPC for inter-service communication

### SHA-256
- Cryptographic hash function producing 256-bit digests
- API-OSS uses SHA-256 for audit ledger integrity

### Base64
- Binary-to-text encoding scheme
- Used in API-OSS for transmitting binary data in JSON/WebSocket messages

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)
