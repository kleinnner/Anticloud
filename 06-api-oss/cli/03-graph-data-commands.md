---
title: "CLI Guide 03: Graph & Data Commands"
sidebar_position: 3
description: "Graph commands manage the knowledge graph, data ingestion, search, and document storage."
tags: [cli]
---

# CLI Guide 03: Graph & Data Commands

## Overview

Graph commands manage the knowledge graph, data ingestion, search, and document storage.

## Graph Nodes

```bash
# List all nodes
api-oss graph node list

# Get specific node
api-oss graph node get <node-id>

# Create a node
api-oss graph node create --label "Paris" --type "Entity" --codex "travel"

# Update a node
api-oss graph node update <node-id> --label "Paris, France"

# Delete a node
api-oss graph node delete <node-id>

# Search nodes
api-oss graph node search --query "France" --codex travel
```

## Graph Edges

```bash
# List edges
api-oss graph edge list

# Get edge
api-oss graph edge get <edge-id>

# Create edge
api-oss graph edge create --source <node-id> --target <node-id> --relation "located_in"

# Delete edge
api-oss graph edge delete <edge-id>
```

## Graph Query

```bash
# Search using FTS5
api-oss graph query "Paris landmarks"
api-oss graph query --fts5 "Eiffel Tower"

# Path finding
api-oss graph path --from <node-a> --to <node-b> --max-depth 5

# Subgraph extraction
api-oss graph subgraph --center <node-id> --radius 2

# Count nodes/edges
api-oss graph stats
```

## Graph Import/Export

```bash
# Export graph as JSON
api-oss graph export --format json --output graph.json

# Export as CSV
api-oss graph export --format csv --output nodes.csv

# Import from JSON
api-oss graph import --file graph.json

# Import from CSV
api-oss graph import --file nodes.csv --type nodes
```

## Graph Version Control

```bash
# List versions
api-oss graph vcs list

# Create a version snapshot
api-oss graph vcs snapshot --message "Before major cleanup"

# Diff two versions
api-oss graph vcs diff --from <version-a> --to <version-b>

# Restore version
api-oss graph vcs restore <version-id>
```

## Ingest Files

```bash
# Ingest a single file
api-oss ingest ./document.pdf

# Ingest all files in directory
api-oss ingest ./documents/

# Watch directory for new files
api-oss ingest --watch ./incoming/

# Ingest with specific codex
api-oss ingest ./report.pdf --codex "legal"

# Supported formats
api-oss ingest --help-formats  # PDF, DOCX, XLSX, CSV, JSON, TXT, PPTX, HTML
```

## Search

```bash
# Full-text search
api-oss search "quantum computing"

# Search within specific codex
api-oss search "machine learning" --codex "research"

# Limit results
api-oss search "AI" --limit 20

# Show search profiles
api-oss search profiles

# Use a search profile
api-oss search "GDPR" --profile enterprise
```

## Document Commands

```bash
# List documents
api-oss document list

# Get document content
api-oss document get <doc-id>

# Get document metadata
api-oss document info <doc-id>

# Delete document and its graph nodes
api-oss document rm <doc-id>

# Export document
api-oss document export <doc-id> --format txt
```

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com