---
title: "DEVELOPER & INTEGRATION — FREQUENTLY ASKED QUESTIONS"
sidebar_position: 10
description: "The primary protocol is bidirectional WebSocket with JSON messages. There is also a REST API for certain operations. See docs/dev/protocol-walkthrough.md for full details."
tags: [faq]
---

# DEVELOPER & INTEGRATION — FREQUENTLY ASKED QUESTIONS

## What protocol does API-SOS use?

The primary protocol is bidirectional WebSocket with JSON messages. There is also a REST API for certain operations. See docs/dev/protocol-walkthrough.md for full details.

## How do I connect to the WebSocket?

Connect to `ws://localhost:3030/ws` (or `wss://` if TLS is enabled). Send JSON messages with a `type` field and the gateway responds with messages on the same connection.

## What message types are available?

The protocol supports approximately 40 message types covering chat, tools, ledgers, models, graphs, contradictions, compliance, and system management. See the protocol walkthrough for the full schema.

## Is there a REST API?

Yes. The REST API is available at `http://localhost:8081/api/`. See docs/dev/rest-api.md for endpoints and examples.

## Are there client SDKs?

JavaScript/TypeScript SDK is available in the frontend source code. Python SDK is at docs/dev/python-sdk.md. Both provide typed wrappers around the WebSocket protocol.

## Can I use API-SOS as an OpenAI-compatible API endpoint?

Yes. The gateway exposes an OpenAI-compatible API at `/v1/chat/completions` for drop-in replacement. See docs/dev/openai-migration.md.

## How do I develop a plugin?

Plugins are sandboxed tools that extend the system's capabilities. See docs/dev/plugin-guide.md for the plugin API, lifecycle hooks, and deployment instructions.

## What is the sandboxed tool system?

API-SOS has a sandboxed execution environment for tools (file system access, code execution, network requests). Tools are defined in `tools.rs` and exposed via WebSocket. See docs/guide/dev/ for tutorials on building custom tools.

## How do the council agents work?

The council consists of three agents: Risk (assesses downsides), Legal (evaluates compliance), and Strategist (proposes actions). They deliberate on every output. See docs/guide/users/12-the-council-engine-overview.md.

## Can I customise the system prompt?

Yes. Set `user.system_prompt` in the config file to a custom prompt that will be prepended to every conversation. You can also set per-conversation system prompts in the chat interface.

## How do I contribute to the open-source codebase?

Fork the repository, make your changes, and submit a pull request. See the engineering guide at docs/internal/engineering-guide.md for the codebase overview and coding conventions.

## See Also

Related FAQ, support, and troubleshooting documentation.

- [FAQ Index](../faq/01-general.md)
- [Support Guide](../support/01-getting-help.md)
- [Troubleshooting](../troubleshooting/01-app-wont-start.md)
- [User Manual](../user-manual/01-getting-started.md)
