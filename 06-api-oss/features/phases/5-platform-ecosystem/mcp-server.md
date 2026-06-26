---
title: "MCP Server"
sidebar_position: 99
description: "A Model Context Protocol (MCP) server that makes API-OSS compatible with Claude Desktop,"
tags: [features]
---

# MCP Server

## What It Does
A Model Context Protocol (MCP) server that makes API-OSS compatible with Claude Desktop,
Cursor IDE, and any MCP-compatible client. Exposes the full knowledge graph and decision
engine through the MCP standard using JSON-RPC 2.0 over stdio (for local process
integration) or WebSocket (for remote access). Accessible via `api-oss mcp` CLI commands
with auto-install capability for Claude Desktop integration.

## How It Works
The MCP server is implemented in `mcp_server.rs` under `ai-oss-gateway/src/`. It implements
the MCP protocol specification — JSON-RPC 2.0 messages exchanged over stdio or WebSocket.
The server registers MCP tools, resources, and prompts that bridge to API-OSS capabilities.
MCP tools (callable by the LLM): `graph_query` (execute graph queries with filtering and
traversal), `graph_add` (add nodes and edges to the knowledge graph), `ledger_verify`
(check cryptographic integrity of ledger entries), `model_infer` (run inference on the local
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model with CUDA backend), `agent_ask` (conversational
interface to the decision engine). MCP resources (data the LLM can read):
`graph://nodes/{id}` (individual graph node), `graph://search?q={query}` (graph search
results), `ledger://entries?limit=10` (recent ledger entries), `model://info` (loaded model
metadata), `system://status` (gateway health with peer count and uptime). MCP prompts (pre-
built templates for common tasks): `graph-analysis` (analyze a subgraph), `data-ingest`
(ingest data from a connector), `audit-check` (verify a ledger entry chain). When Claude
Desktop or Cursor connects to the MCP server, the LLM can discover tools, resources, and
prompts via the MCP initialization handshake, then invoke them dynamically during
conversations. The server supports both stdio transport (for `claude mcp add` integration)
and WebSocket transport (for remote connections). The CLI provides `api-oss mcp start` to
launch the server. `api-oss mcp install` auto-detects Claude Desktop's configuration file
and adds the MCP server entry — the user simply restarts Claude Desktop to see the API-OSS
tools. All MCP operations are fully offline with no API keys or cloud connectivity required.

The MCP protocol implementation in `mcp_server.rs` follows the JSON-RPC 2.0 specification
exactly: each message is a JSON object with `jsonrpc: "2.0"`, `id` (number or string for
requests/notifications), `method` (string identifying the tool/resource/prompt to invoke),
and `params` (object with named arguments). The `initialize` handshake exchanges protocol
version and capabilities — the server advertises `tools: {}, resources: {}, prompts: {}`
in its `ServerCapabilities`. Tool definitions are registered via an `mcp_tool!` macro that
generates a `McpTool` struct with name, description, and a JSON Schema `inputSchema`
derived from the handler function's Rust types using `schemars` for compile-time schema
generation. When the LLM calls a tool (e.g., `tools/call` with `name: "graph_query"` and
`arguments: {...}`), the server dispatches to the corresponding handler, which sends the
appropriate `ClientMessage` over the gateway's internal WebSocket channel, awaits the
`ServerMessage` response, and returns the result as a JSON-RPC response with `result`
containing a `content` array of `McpContent` items (text, image, or resource). The stdio
transport reads JSON-RPC messages from stdin line-by-line and writes responses to stdout,
suitable for `claude mcp add` integration where Claude Desktop spawns the server as a
child process. The WebSocket transport runs a separate `tokio-tungstenite` server on port
8312 (configurable via `mcp.websocket_port` in `opencode.json`), accepting multiple
simultaneous client connections — each gets its own `McpSession` with a separate gateway
WebSocket connection. The `mcp install` command auto-detects Claude Desktop's config file
location (macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`,
Windows: `%APPDATA%\Claude\claude_desktop_config.json`, Linux:
`~/.config/Claude/claude_desktop_config.json`) and injects the MCP server entry.

## How to Operate
1. Ensure the gateway is running: `api-oss start` — the MCP server connects on port 3030.
2. Start the MCP server: `api-oss mcp start` — launches the MCP server process (stdio or
   WebSocket mode).
3. For Claude Desktop: `api-oss mcp install` — auto-configures Claude. Restart Claude.
4. In Claude Desktop, the hammer icon shows available MCP tools: `graph_query`, `graph_add`,
   `ledger_verify`, `model_infer`, `agent_ask`.
5. Use natural language: "Search my knowledge graph for all documents about Project X" —
   Claude Desktop calls the `graph_query` tool.
6. "Add this analysis to the graph" — Claude Desktop calls the `graph_add` tool.
7. "Verify the integrity of the last 10 ledger entries" — calls `ledger_verify`.
8. For Cursor IDE: configure the MCP server in Cursor's MCP settings pointing to the
   WebSocket endpoint at `ws://localhost:8312`.
9. For custom MCP clients: connect to `ws://localhost:8312` (default MCP WebSocket port).
10. Check server status: `api-oss mcp status` — shows connected clients and tools.
11. Stop the server: `api-oss mcp stop`.
12. Monitor Prometheus metrics on port 9000: `mcp_tools_invoked_total`.

## The Moat
- Anthropic created the MCP spec but does not ship a fully offline, self-contained MCP
  server with a knowledge graph backend — Claude Desktop's default servers are all cloud-
  tied and require API keys.
- By implementing MCP on top of API-OSS, we provide MCP clients with a sovereign, offline-
  compatible backend that no competitor offers.
- The `graph_query` and `graph_add` tools give LLMs direct access to a persistent,
  queryable knowledge graph — most MCP servers only provide document search or web browsing.
- The `mcp install` command makes integration with Claude Desktop a single command, with
  zero manual configuration required.

## Why Choose API-OSS
A data analyst using Claude Desktop can connect it to their local API-OSS knowledge graph
via MCP — Claude can search, query, and add to the graph using natural language, with all
data staying on the local machine. A developer using Cursor IDE can query their project's
knowledge graph without leaving the editor. A team in an air-gapped environment can use any
MCP-compatible client with their local AI decision engine.

## Competitive Comparison
- **Anthropic**: Created the MCP spec but provides no offline server. Claude Desktop
  requires a cloud API key for its built-in tools.
- **OpenAI**: No MCP support. Function calling is a proprietary protocol.
- **Google**: Vertex AI has no MCP implementation.
- **Palantir**: No MCP support, closed ecosystem.

## Cost-Benefit Analysis
Claude Pro costs $20/month per user for cloud API access. Using API-OSS MCP server with
Claude Desktop eliminates the need for API calls — all inference is local. For a team of 50
analysts, that is $12,000/year savings in Claude subscriptions. Building a custom MCP server
with knowledge graph integration would cost $50k–$100k in development time. API-OSS provides
it built-in and free. One-time hardware cost ($2,000 GPU workstation) replaces ongoing API
costs. The `mcp install` feature eliminates per-user configuration time.

## Applications
- **Consumer**: Connect Claude Desktop to local sovereign AI with natural language queries.
- **Government / Defense**: Air-gapped AI with MCP-compatible tooling — analysts use Claude
  Desktop (configured offline) to interact with the intelligence graph.
- **Enterprise**: Integrate API-OSS with any MCP-compatible IDE, assistant, or tool.

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
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776094
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/06-api-oss
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
4. Lois-Kleinner Internet Arc: https://archive.org/details/api-oss-fixed
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