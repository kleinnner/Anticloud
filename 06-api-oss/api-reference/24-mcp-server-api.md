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
