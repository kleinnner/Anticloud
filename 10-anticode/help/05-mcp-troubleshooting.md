▄▄                            ██     ▄▄   ▄▄▄                  ▄▄           
████                ██         ▀▀     ██  ██▀                   ██           
████    ██▄████▄  ███████    ████     ██▄██      ▄████▄    ▄███▄██   ▄████▄  
██  ██   ██▀   ██    ██         ██     █████     ██▀  ▀██  ██▀  ▀██  ██▄▄▄▄██ 
██████   ██    ██    ██         ██     ██  ██▄   ██    ██  ██    ██  ██▀▀▀▀▀▀ 
▄██  ██▄  ██    ██    ██▄▄▄   ▄▄▄██▄▄▄  ██   ██▄  ▀██▄▄██▀  ▀██▄▄███  ▀██▄▄▄▄█ 
▀▀    ▀▀  ▀▀    ▀▀     ▀▀▀▀   ▀▀▀▀▀▀▀▀  ▀▀    ▀▀    ▀▀▀▀      ▀▀▀ ▀▀    ▀▀▀▀▀ 

ANTIKODE — terminal-native AI coding engine
Lois-Kleinner and 0-1.gg 2026 Copyright

# 05 — MCP Troubleshooting: Connection Issues and Tool Discovery Problems

The Model Context Protocol (MCP) is the standard that ANTIKODE uses for tool discovery and invocation. MCP enables ANTIKODE agents to discover available tools, understand their parameters, and invoke them. This document covers common MCP issues and their solutions.

## 5.1 MCP Architecture

The MCP layer sits between the agent and tools. The agent communicates via an MCP client, which connects to MCP servers that expose tools. The protocol flow is: Initialize (handshake capabilities), List Tools (discover available tools), Call Tool (invoke with parameters), Notifications (progress/status updates), and Shutdown (clean termination).

### 5.1.1 Transport Layers

MCP supports multiple transport layers: stdio (communication via stdin/stdout for local servers), HTTP/SSE (HTTP with Server-Sent Events for remote servers), WebSocket (full-duplex for real-time bidirectional), and Unix Socket (high-performance local communication). ANTIKODE defaults to stdio for local MCP servers and HTTP/SSE for remote servers.

## 5.2 MCP Connection Issues

### 5.2.1 Failed to connect to MCP server

Causes: MCP server process not running, wrong endpoint URL or port, network connectivity issue, firewall blocking the connection, transport protocol mismatch.

Diagnosis:
- ntikode mcp list — List configured MCP servers
- ntikode mcp status <server> — Check specific server status
- ntikode mcp test <server> — Test connection to server
- Check network connectivity: curl http://mcp-server:port/health

Solutions:
- Start the MCP server: ntikode mcp start <server>
- Verify endpoint URL in configuration: ntikode config get mcp.servers.<server>.url
- Check firewall rules for the MCP port (default: 5353)
- Ensure transport protocol matches between client and server
- Restart the MCP server: ntikode mcp restart <server>

### 5.2.2 Connection timeout

Causes: Server overloaded, network latency, large tool list causing slow initialization, server busy with previous requests.

Solutions:
- Increase connection timeout: ntikode config set mcp.timeout 30000 (30 seconds)
- Check server load: ntikode mcp status <server> --verbose
- Reduce number of tools exposed by the server
- Use --mcp-connect-timeout flag for one-off adjustments

### 5.2.3 Connection refused

Causes: Server not running on the target host/port, wrong port number, server crashed, firewall actively rejecting.

Solutions:
- Verify server is running: ntikode mcp list --running
- Check port configuration: ntikode config get mcp.servers.<server>.port
- Look for port conflicts: 
etstat -an | findstr <port>
- Check server logs: ntikode logs --mcp

## 5.3 Tool Discovery Problems

### 5.3.1 Tools not appearing

Causes: MCP server not initialized, tool discovery not completed, server returned empty tool list, server crashed during discovery, tool registration failed on server side.

Diagnosis:
- ntikode tools list —all — Show all tools including pending discovery
- ntikode mcp discover <server> — Force tool re-discovery
- ntikode mcp debug <server> — Show MCP protocol messages

Solutions:
- Wait for tool discovery to complete: ntikode mcp wait <server>
- Restart the MCP server and force re-discovery
- Check server-side tool registration logs
- Verify server capability includes tool discovery: ntikode mcp capabilities <server>

### 5.3.2 Tool descriptions wrong or missing

Causes: Server provides incomplete tool definitions, missing parameter schemas, incorrect parameter types, description too short or misleading.

Solutions:
- Request server update tool definitions
- Check tool schema: ntikode tools schema <tool>
- Override tool description in configuration:
`json
{
  "mcp": {
    "tools": {
      "my-tool": {
        "description": "Custom description for agent",
        "parameters": { "type": "object", "properties": {} }
      }
    }
  }
}
`

### 5.3.3 Too many tools discovered

Causes: Server exposes all available tools without filtering, including internal/debug tools, no categorization.

Solutions:
- Filter tools by prefix or category: ntikode config set mcp.toolFilter "files_,git_,docker_"
- Exclude specific tools: ntikode tools hide debug-tool
- Group tools by server in the tools list
- Request server implement tool categorization

## 5.4 Tool Invocation Issues

### 5.4.1 Tool call returns error

Causes: Invalid parameters, missing required fields, server-side execution error, resource not available, authentication failure.

Diagnosis:
- ntikode session query —latest —type tool_call —format json — See exact parameters sent
- ntikode session query —latest —type tool_result —format json — See exact error returned
- ntikode mcp debug <server> —tool my-tool — Debug specific tool call

Solutions:
- Validate parameters against tool schema
- Check for missing required fields
- Verify server-side prerequisites are met
- Check authentication/tokens for protected tools

### 5.4.2 Tool call timeout

Causes: Tool execution takes longer than configured timeout, server under load, tool waiting for external resource.

Solutions:
- Increase tool timeout: ntikode config set mcp.toolTimeout 60000
- Check if tool supports progress notifications
- Use async tool execution if available
- Split large operations into smaller chunks

### 5.4.3 Tool returns unexpected output format

Causes: Server version mismatch, output schema changed, content negotiation failed, encoding issue.

Solutions:
- Check expected vs actual output format
- Update tool schema cache: ntikode mpc rediscover <server>
- Add output transformation in configuration:
`json
{
  "mcp": {
    "tools": {
      "my-tool": {
        "outputTransform": "json"
      }
    }
  }
}
`

## 5.5 MCP Configuration

### 5.5.1 Server Configuration

MCP servers are configured in antikode.json:
`json
{
  "mcp": {
    "servers": {
      "local-tools": {
        "transport": "stdio",
        "command": "node",
        "args": ["mcp-server.js"],
        "env": { "NODE_ENV": "production" },
        "autoStart": true
      },
      "remote-api": {
        "transport": "http",
        "url": "http://localhost:5353",
        "headers": { "Authorization": "Bearer " },
        "timeout": 10000
      }
    }
  }
}
`

### 5.5.2 Authentication

For authenticated MCP servers:
- Token-based: Set headers in configuration
- Certificate-based: Configure TLS in transport options
- API key: Pass via environment variable
- OAuth: Use auth callback URL
- Mutual TLS: Configure client certificate

### 5.5.3 Health Checks

MCP servers can be configured with health check endpoints:
`json
{
  "mcp": {
    "healthCheck": {
      "path": "/health",
      "interval": 30,
      "timeout": 5,
      "unhealthyThreshold": 3
    }
  }
}
`

## 5.6 MCP Server Development

### 5.6.1 Creating MCP Tools

MCP tools can be created in any language. The server exposes tools via the MCP protocol. A minimal MCP server in JavaScript:
`javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'example-mcp-server',
  version: '1.0.0'
}, {
  capabilities: { tools: {} }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'example/greet',
    description: 'Greet a user',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name to greet' }
      },
      required: ['name']
    }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name === 'example/greet') {
    return { content: [{ type: 'text', text: Hello, ! }] };
  }
  throw new Error(Tool not found: );
});

const transport = new StdioServerTransport();
await server.connect(transport);
`

### 5.6.2 Debugging MCP Servers

`ash
# Test MCP server directly
antikode mcp test-server --command "node mcp-server.js"

# View MCP protocol messages
antikode mcp debug protocol

# Simulate tool calls
antikode mcp call local-tools example/greet --param name=World
`

## 5.7 Common MCP Error Codes

### MCP-ERR-001 — Invalid Initialize
Server returned invalid initialize response. Check protocol version compatibility.

### MCP-ERR-002 — Method Not Found
Requested method not supported by server. Check server capabilities.

### MCP-ERR-003 — Invalid Parameters
Tool parameters failed validation. Check parameter types and required fields.

### MCP-ERR-004 — Internal Error
Server-side error. Check server logs for details.

### MCP-ERR-005 — Resource Not Found
Requested tool or resource does not exist on server. Check tool name.

### MCP-ERR-006 — Authentication Failed
Server rejected authentication. Check credentials and token validity.

### MCP-ERR-007 — Rate Limited
Server is rate limiting requests. Reduce request frequency.

## 5.8 MCP Troubleshooting Flowchart

`mermaid
flowchart TD
    A[MCP Issue] --> B{Connection established?}
    B -->|No| C{Server running?}
    C -->|No| D[Start MCP server]
    C -->|Yes| E{Correct URL/port?}
    E -->|No| F[Update config]
    E -->|Yes| G{Transport match?}
    G -->|No| H[Fix transport config]
    G -->|Yes| I{Authentication?}
    I -->|Failed| J[Update credentials]
    I -->|OK| K[Check firewall]
    B -->|Yes| L{Tools discovered?}
    L -->|No| M[Force re-discovery]
    L -->|Yes| N{Tool calls work?}
    N -->|No| O{Invalid params?}
    O -->|Yes| P[Fix parameters]
    O -->|No| Q[Check server logs]
    N -->|Yes| R[OK]
    D --> S[Retry]
    F --> S
    H --> S
    J --> S
    K --> S
    M --> S
    P --> S
    Q --> S
    S --> T{Resolved?}
    T -->|No| U[Escalate to community]
    T -->|Yes| R
`

## 5.9 Performance Optimization

### 5.9.1 Reducing Latency

- Use stdio transport for local servers
- Minimize tool count per server
- Enable tool caching: ntikode config set mcp.cacheTools true
- Increase parallel connections: ntikode config set mcp.maxParallel 5
- Use connection pooling for HTTP transport

### 5.9.2 Scaling MCP Servers

For high-throughput environments:
- Run multiple server instances behind a load balancer
- Use Unix sockets for lower latency
- Implement request queuing for rate-limited servers
- Monitor server health with automatic restart

## 5.10 Plugin MCP Integration

Plugins can also register MCP servers. Plugin MCP servers are started and stopped by the plugin lifecycle. Issues with plugin MCP servers often stem from plugin initialization failures.

Common issues:
- Plugin MCP server fails to start: Check plugin manifest and logs
- Plugin tools not appearing: Ensure plugin is enabled and activated
- Plugin tool errors: Check plugin implementation

## 5.11 Getting Help with MCP

If MCP issues persist:
1. Run ntikode mcp diagnose —full
2. Share MCP debug logs: ntikode logs —mcp —output mcp-debug.log
3. Include server configuration (redact tokens)
4. Post in #mcp channel on Matrix with error details

For MCP specification details, visit modelcontextprotocol.io. For ANTIKODE-specific MCP integration docs, see docs.antikode.dev/mcp.
