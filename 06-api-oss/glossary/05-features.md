---
title: "Glossary 5: Feature Glossary"
sidebar_position: 5
description: "Documentation for Glossary 5: Feature Glossary"
tags: [glossary]
---

# Glossary 5: Feature Glossary

## Terms

### Graph Engine
- Knowledge graph visualization and navigation system
- Represents entities and relationships as interactive nodes and edges

### Search Engine
- Full-text and semantic search across indexed content
- Supports BM25, embedding similarity, and hybrid search

### Ingestion Pipeline
- Automated document processing: upload → chunk → embed → index
- Supports PDF, DOCX, TXT, HTML, Markdown, CSV, JSON, code files

### Annotation Studio
- Tool for labeling data for fine-tuning and evaluation
- Supports text classification, NER, document labeling, QA pairs

### IAA (Inter-Annotator Agreement)
- Statistical measure of consistency between annotators
- API-OSS supports Cohen's Kappa, Fleiss' Kappa scoring

### Adjudication
- Resolution of conflicting annotations
- API-OSS provides workflow for conflict resolution

### Active Learning
- ML technique to select the most informative data for annotation
- Reduces annotation cost by 30–50%

### Contradiction Detection
- Identifies inconsistent statements in model outputs
- Maintains a contradiction graph for cross-reference

### Council Engine
- Multi-agent orchestration system
- Routes sub-tasks to specialized agents, aggregates results

### Bridge
- Connector that relays API-OSS to external platforms
- Available: Discord, Telegram, WhatsApp, Slack, Matrix, Signal, Email, SMS

### Tool (WASM Tool)
- Sandboxed WASM module that extends AI capabilities
- Examples: calculator, web scraper, database query, code executor

### Plugin
- Reusable extension package for API-OSS
- Types: tools, connectors, bridges, dashboards, data sources

### Pipeline Builder
- Visual workflow editor for chaining operations
- Supports: ingest → process → analyze → output

### Dashboard
- Customizable visualization views
- Built with React, supports real-time data updates

### Materialized View
- Pre-computed query results stored for fast access
- API-OSS uses for offline data and performance optimization

### Zero-Copy Clone
- Instant dataset duplication without copying data
- Uses copy-on-write for storage efficiency

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)
