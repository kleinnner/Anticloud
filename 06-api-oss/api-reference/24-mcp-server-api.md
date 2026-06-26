---
title: "API Reference 24: MCP Server API"
sidebar_position: 24
description: "AI-OSS implements the Model Context Protocol (MCP) for integration with MCP-compatible clients (Claude Code, Cursor, etc.)."
tags: [api]
---

# API Reference 24: MCP Server API

## Overview

AI-OSS implements the Model Context Protocol (MCP) for integration with MCP-compatible clients (Claude Code, Cursor, etc.).

## Connection Methods

### stdio (Default)

```bash
api-oss mcp serve
# Starts MCP server over stdio
# Connect via: claude mcp add api-oss -- npx api-oss mcp serve
```

### HTTP (SSE)

```bash
api-oss mcp serve --transport sse --port 3031
# Connect via SSE at http://localhost:3031/sse
```

## MCP Tools Exposed

| Tool Name | Description |
|-----------|-------------|
| `graph_search` | Search the knowledge graph |
| `graph_get_node` | Get node by ID |
| `graph_get_neighbors` | Get node neighbors |
| `graph_create_node` | Create a new node |
| `graph_create_edge` | Link two nodes |
| `search_documents` | Search indexed documents |
| `ingest_document` | Ingest a new document |
| `query_model` | Query the AI model directly |
| `list_models` | List available models |
| `read_ledger` | Query the audit ledger |
| `list_bridges` | List configured bridges |
| `send_bridge_message` | Send message via bridge |

## MCP Tool Definitions

```json
{
  "tools": [
    {
      "name": "graph_search",
      "description": "Search nodes in the knowledge graph",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "Search query"
          },
          "limit": {
            "type": "number",
            "default": 10
          }
        },
        "required": ["query"]
      }
    },
    {
      "name": "query_model",
      "description": "Query the AI model directly",
      "inputSchema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "The prompt to send"
          },
          "model": {
            "type": "string",
            "description": "Model to use (optional; uses default)"
          },
          "max_tokens": {
            "type": "number",
            "default": 2048
          }
        },
        "required": ["prompt"]
      }
    }
  ]
}
```

## Claude Desktop Integration

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "api-oss": {
      "command": "api-oss",
      "args": ["mcp", "serve"],
      "env": {
        "AIOSS_API_KEY": "sk-aioss-xxxxxxxxxxxx",
        "AIOSS_BASE_URL": "http://localhost:8080"
      }
    }
  }
}
```

## Cursor Integration

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "api-oss": {
      "command": "api-oss",
      "args": ["mcp", "serve"],
      "env": {
        "AIOSS_API_KEY": "sk-aioss-xxxxxxxxxxxx"
      }
    }
  }
}
```

## Configuration

```json
{
  "mcp": {
    "enabled": true,
    "transport": "stdio",
    "port": 3031,
    "allowed_tools": ["graph_search", "query_model", "search_documents"],
    "rate_limit_per_minute": 60,
    "max_context_length": 4096
  }
}
```

## Security

The MCP server inherits API-OSS authentication and authorization. All tools respect API key permissions and RBAC.

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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