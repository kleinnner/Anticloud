---
title: "Glossary 14: Tool Glossary"
sidebar_position: 14
description: "Documentation for Glossary 14: Tool Glossary"
tags: [glossary]
---

# Glossary 14: Tool Glossary

## Terms

### Tool
- A function the AI can call autonomously
- Examples: get_weather, calculate, search_database, send_email

### Function Calling
- AI model capability to output structured function calls
- API-OSS supports OpenAI-compatible function calling format

### Tool Registration
- Declaring a tool's name, description, parameters
- Done via API, config, or plugin manifest

### Tool Execution
- Running the tool's implementation and returning results
- API-OSS executes tools in WASM sandbox

### Tool Parameters
- Input schema for tool arguments (JSON Schema format)
- Defined in tool registration

### Built-in Tools
- Tools that ship with API-OSS
- Examples: search, calculator, web_scrape, code_run, sql_query

### Custom Tools
- User-defined tools via WASM plugins
- Can be shared via marketplace

### MCP (Model Context Protocol)
- Standard protocol for tool integration
- API-OSS implements MCP server for connecting to external tools

### MCP Server
- Server implementing the MCP protocol
- API-OSS can both host and connect to MCP servers

### Tool Chain
- Sequence of tool calls chained together
- AI decides when to use tools and in what order

### Tool Feedback
- Result returned from tool execution
- AI uses feedback to decide next action

### Error Handling (Tools)
- How API-OSS handles tool failures gracefully
- AI can retry, skip, or ask user for input

### Rate Limit (Tools)
- Maximum calls per minute for a tool
- Prevents abuse and excessive resource usage

### Tool Logging
- Recording all tool invocations and results
- Part of audit ledger for compliance

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)
