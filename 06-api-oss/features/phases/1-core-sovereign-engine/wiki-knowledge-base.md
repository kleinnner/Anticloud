---
title: "Wiki / Knowledge Base"
sidebar_position: 99
description: "Auto-generates a wiki-style knowledge base from the knowledge graph. Each node type becomes a wiki page with automatically extracted content, backlinks, and category tags. The wiki updates as the grap"
tags: [features]
---

# Wiki / Knowledge Base

## What It Does
Auto-generates a wiki-style knowledge base from the knowledge graph. Each node type becomes a wiki page with automatically extracted content, backlinks, and category tags. The wiki updates as the graph changes and can be published to static HTML. The wiki provides a human-readable view of the graph's knowledge, with cross-references mirroring graph edges.

## How It Works
The wiki system is implemented in i-oss-gateway/src/handlers/wiki.rs. When a user triggers wiki generation via WebSocket on port 3030 (generate_wiki message):

1. The system queries the knowledge graph at data/graph.db (SQLite WAL) for all nodes, grouped by type.
2. For each node, it generates a wiki page: the node name becomes the page title, the description becomes the summary, properties are rendered as tables, and connected nodes (via edges) become links.
3. Backlinks are computed: for each node, which other nodes reference it? These appear as "Referenced by" sections on the page.
4. Category tags are assigned based on node type and property values.
5. A table of contents is generated organizing pages by type and category.
6. The wiki can be published to static HTML: the system writes all pages as HTML files to the configured output directory, generating an index.html with navigation.

**Automatic updates**: The wiki can be configured to regenerate automatically when the graph changes (add/edit/delete nodes). A change watcher monitors the graph and triggers incremental wiki regeneration for affected pages.

The frontend WikiView (React 18 + Vite 5 + Tailwind) renders wiki pages with navigation, table of contents, search, and category filters. Pages support Markdown rendering for descriptions.

WebSocket messages: generate_wiki (trigger full wiki generation), publish_wiki (export to static HTML), list_wikis (list all published wikis), wiki_generated, wiki_published, wiki_list.

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including wiki generate, wiki publish, wiki list.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Wiki view.
4. Click "Generate Wiki" to create wiki pages from the current graph state.
5. Browse pages by category (Entity, Concept, Document, etc.) or search by keyword.
6. Click any page to view its content � backlinks show which other pages reference it.
7. Click "Publish to HTML" to export the wiki as static HTML files.
8. The published wiki can be served by any static file server or viewed locally.
9. Use CLI: pi-oss wiki generate, pi-oss wiki publish --dir ./wiki-output.
10. Use pi-oss wiki list to see all published wiki versions.

Config in opencode.json:
`json
{
  "wiki": {
    "auto_generate": true,
    "publish_dir": "./data/wiki",
    "include_backlinks": true,
    "max_pages": 500
  }
}
`

## The Moat
- Palantir requires manual documentation creation and maintenance � no auto-generation from data.
- Our wiki is generated directly from the graph � every entity, concept, decision, and document becomes a page with zero manual effort.
- Links between pages mirror graph edges, creating a naturally connected knowledge base.
- Automatic updates mean the wiki never goes stale � it reflects the current graph state.
- Static HTML export makes the knowledge base portable and shareable without requiring the system.

## Why Choose API-OSS
Living documentation that maintains itself. Organizations that struggle with documentation maintenance � where docs quickly become outdated � get a wiki that updates automatically as knowledge changes. The graph-to-wiki pipeline converts structured knowledge into human-readable documentation with zero manual effort.

## Competitive Comparison
- **Palantir**: Manual documentation � no auto-generation from knowledge graph. Documentation must be written and maintained separately.
- **OpenAI**: No knowledge base or wiki feature. ChatGPT has no wiki generation capability.
- **Anthropic**: No persistent knowledge base or wiki. Claude cannot generate documentation from stored knowledge.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Wiki / Knowledge Base

## What It Does
Auto-generates a wiki-style knowledge base from the knowledge graph. Each node type becomes a wiki page with automatically extracted content, backlinks, and category tags. The wiki updates as the graph changes and can be published to static HTML. The wiki provides a human-readable view of the graph's knowledge, with cross-references mirroring graph edges.

## How It Works
The wiki system is implemented in i-oss-gateway/src/handlers/wiki.rs. When a user triggers wiki generation via WebSocket on port 3030 (generate_wiki message):

1. The system queries the knowledge graph at data/graph.db (SQLite WAL) for all nodes, grouped by type.
2. For each node, it generates a wiki page: the node name becomes the page title, the description becomes the summary, properties are rendered as tables, and connected nodes (via edges) become links.
3. Backlinks are computed: for each node, which other nodes reference it? These appear as "Referenced by" sections on the page.
4. Category tags are assigned based on node type and property values.
5. A table of contents is generated organizing pages by type and category.
6. The wiki can be published to static HTML: the system writes all pages as HTML files to the configured output directory, generating an index.html with navigation.

**Automatic updates**: The wiki can be configured to regenerate automatically when the graph changes (add/edit/delete nodes). A change watcher monitors the graph and triggers incremental wiki regeneration for affected pages.

The frontend WikiView (React 18 + Vite 5 + Tailwind) renders wiki pages with navigation, table of contents, search, and category filters. Pages support Markdown rendering for descriptions.

WebSocket messages: generate_wiki (trigger full wiki generation), publish_wiki (export to static HTML), list_wikis (list all published wikis), wiki_generated, wiki_published, wiki_list.

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including wiki generate, wiki publish, wiki list.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Wiki view.
4. Click "Generate Wiki" to create wiki pages from the current graph state.
5. Browse pages by category (Entity, Concept, Document, etc.) or search by keyword.
6. Click any page to view its content � backlinks show which other pages reference it.
7. Click "Publish to HTML" to export the wiki as static HTML files.
8. The published wiki can be served by any static file server or viewed locally.
9. Use CLI: pi-oss wiki generate, pi-oss wiki publish --dir ./wiki-output.
10. Use pi-oss wiki list to see all published wiki versions.

Config in opencode.json:
`json
{
  "wiki": {
    "auto_generate": true,
    "publish_dir": "./data/wiki",
    "include_backlinks": true,
    "max_pages": 500
  }
}
`

## The Moat
- Palantir requires manual documentation creation and maintenance � no auto-generation from data.
- Our wiki is generated directly from the graph � every entity, concept, decision, and document becomes a page with zero manual effort.
- Links between pages mirror graph edges, creating a naturally connected knowledge base.
- Automatic updates mean the wiki never goes stale � it reflects the current graph state.
- Static HTML export makes the knowledge base portable and shareable without requiring the system.

## Why Choose API-OSS
Living documentation that maintains itself. Organizations that struggle with documentation maintenance � where docs quickly become outdated � get a wiki that updates automatically as knowledge changes. The graph-to-wiki pipeline converts structured knowledge into human-readable documentation with zero manual effort.

## Competitive Comparison
- **Palantir**: Manual documentation � no auto-generation from knowledge graph. Documentation must be written and maintained separately.
- **OpenAI**: No knowledge base or wiki feature. ChatGPT has no wiki generation capability.
- **Anthropic**: No persistent knowledge base or wiki. Claude cannot generate documentation from stored knowledge.
