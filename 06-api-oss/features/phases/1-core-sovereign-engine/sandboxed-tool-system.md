---
title: "Sandboxed Tool System"
sidebar_position: 99
description: "Eleven tools (search, read, write, execute, analyze, transform, pipe, summarize, and more) each with path-traversal protection that prevents escape from the workspace. Tools require CLAW approval befo"
tags: [features]
---

# Sandboxed Tool System

## What It Does
Eleven tools (search, read, write, execute, analyze, transform, pipe, summarize, and more) each with path-traversal protection that prevents escape from the workspace. Tools require CLAW approval before execution. The sandbox uses WASM isolation for safe code execution. Path allowlists ensure tools can only access ./data/ and the workspace directory.

## How It Works
The sandboxed tool system is implemented in i-oss-gateway/src/tools.rs, 	ool_parser.rs, and wasm_sandbox.rs. Each tool is a Rust function with a defined input schema, output schema, and access scope.

**Path-traversal protection**: Before any tool that accesses the filesystem executes, 	ool_parser.rs applies regex-based checks against a whitelist of allowed directory patterns. Any path containing .., absolute paths outside the allowlist, or symlinks pointing outside the workspace are rejected immediately. The checks run before the plan is presented to the user � no execution happens until the path is validated.

**Eleven tools**: search (graph search), read (file read), write (file write), execute (command execution in sandbox), analyze (data analysis), transform (data transformation), pipe (pipeline data between tools), summarize (text summarization), query (graph query), scrape (web scrape), and custom (user-defined tool templates).

**WASM isolation**: The execute tool runs user-provided code in a WASM sandbox using Wasmtime. The sandbox has no filesystem access, no network access, and a memory limit of 128MB. Code is compiled to WASM bytecode at runtime and executed in the sandbox. Results are serialized and returned.

**CLAW gating**: All tools require CLAW (Constrained Local Autonomous Workflow) approval before execution. The plan is presented to the user showing the tool name, arguments, estimated impact, and target resource. The user must approve within the timeout window (default 120 seconds).

Every tool execution is recorded in the SHA-256 hash-chained audit ledger at data/ledger/ in .aioss format. The system runs on the single pi-oss binary. HTTP UI on port 8081. WebSocket on port 3030 carries 	ool_call, 	ool_result, pprove_tools, and get_tool_templates messages.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. When an agent requests a tool call, the CLAW view shows the plan with tool name, arguments, and impact.
4. Review the plan. Click "Approve" to allow execution, "Reject" to deny.
5. The tool executes in the sandbox and the result is returned to the agent.
6. Use the Tool Templates view to see available tools and their schemas.
7. Use CLI: pi-oss tool list, pi-oss tool execute --name search --args '{"query":"budget"}'.
8. All tool executions are viewable in the Ledger view with full details.

Config in opencode.json:
`json
{
  "tools": {
    "path_allowlist": ["./data", "./workspace"],
    "wasm_memory_mb": 128,
    "claw_required": true
  }
}
`

## The Moat
- OpenAI's plugin system runs in the cloud with opaque sandboxing � users cannot inspect or verify sandbox security.
- Anthropic's tool use has no sandbox at all � tools run with full process privileges.
- Our system implements path-traversal protection at multiple layers (regex validation, CLAW approval, WASM sandbox).
- WASM bytecode isolation provides a proven, verifiable sandbox for code execution.
- Every tool execution is audited in the cryptographic ledger.
- No competitor offers this combination of sandboxing, approval workflow, and audit.

## Why Choose API-OSS
Defense-in-depth tool sandboxing for safe local AI. Organizations that need to give AI agents access to files, data, and execution capabilities can do so with confidence that the tools are properly constrained. The three-layer protection (path validation, human approval, WASM sandbox) ensures that no tool can escape its bounds or operate without oversight.

## Competitive Comparison
- **OpenAI**: Plugin sandbox is cloud-only; no local sandbox offered. Users cannot run tools locally.
- **Anthropic**: Tool use has no sandboxing � runs with full user privileges. No path traversal protection.
- **Palantir**: AIP tools run on server infrastructure with no local sandbox or WASM isolation.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Sandboxed Tool System

## What It Does
Eleven tools (search, read, write, execute, analyze, transform, pipe, summarize, and more) each with path-traversal protection that prevents escape from the workspace. Tools require CLAW approval before execution. The sandbox uses WASM isolation for safe code execution. Path allowlists ensure tools can only access ./data/ and the workspace directory.

## How It Works
The sandboxed tool system is implemented in i-oss-gateway/src/tools.rs, 	ool_parser.rs, and wasm_sandbox.rs. Each tool is a Rust function with a defined input schema, output schema, and access scope.

**Path-traversal protection**: Before any tool that accesses the filesystem executes, 	ool_parser.rs applies regex-based checks against a whitelist of allowed directory patterns. Any path containing .., absolute paths outside the allowlist, or symlinks pointing outside the workspace are rejected immediately. The checks run before the plan is presented to the user � no execution happens until the path is validated.

**Eleven tools**: search (graph search), read (file read), write (file write), execute (command execution in sandbox), analyze (data analysis), transform (data transformation), pipe (pipeline data between tools), summarize (text summarization), query (graph query), scrape (web scrape), and custom (user-defined tool templates).

**WASM isolation**: The execute tool runs user-provided code in a WASM sandbox using Wasmtime. The sandbox has no filesystem access, no network access, and a memory limit of 128MB. Code is compiled to WASM bytecode at runtime and executed in the sandbox. Results are serialized and returned.

**CLAW gating**: All tools require CLAW (Constrained Local Autonomous Workflow) approval before execution. The plan is presented to the user showing the tool name, arguments, estimated impact, and target resource. The user must approve within the timeout window (default 120 seconds).

Every tool execution is recorded in the SHA-256 hash-chained audit ledger at data/ledger/ in .aioss format. The system runs on the single pi-oss binary. HTTP UI on port 8081. WebSocket on port 3030 carries 	ool_call, 	ool_result, pprove_tools, and get_tool_templates messages.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. When an agent requests a tool call, the CLAW view shows the plan with tool name, arguments, and impact.
4. Review the plan. Click "Approve" to allow execution, "Reject" to deny.
5. The tool executes in the sandbox and the result is returned to the agent.
6. Use the Tool Templates view to see available tools and their schemas.
7. Use CLI: pi-oss tool list, pi-oss tool execute --name search --args '{"query":"budget"}'.
8. All tool executions are viewable in the Ledger view with full details.

Config in opencode.json:
`json
{
  "tools": {
    "path_allowlist": ["./data", "./workspace"],
    "wasm_memory_mb": 128,
    "claw_required": true
  }
}
`

## The Moat
- OpenAI's plugin system runs in the cloud with opaque sandboxing � users cannot inspect or verify sandbox security.
- Anthropic's tool use has no sandbox at all � tools run with full process privileges.
- Our system implements path-traversal protection at multiple layers (regex validation, CLAW approval, WASM sandbox).
- WASM bytecode isolation provides a proven, verifiable sandbox for code execution.
- Every tool execution is audited in the cryptographic ledger.
- No competitor offers this combination of sandboxing, approval workflow, and audit.

## Why Choose API-OSS
Defense-in-depth tool sandboxing for safe local AI. Organizations that need to give AI agents access to files, data, and execution capabilities can do so with confidence that the tools are properly constrained. The three-layer protection (path validation, human approval, WASM sandbox) ensures that no tool can escape its bounds or operate without oversight.

## Competitive Comparison
- **OpenAI**: Plugin sandbox is cloud-only; no local sandbox offered. Users cannot run tools locally.
- **Anthropic**: Tool use has no sandboxing � runs with full user privileges. No path traversal protection.
- **Palantir**: AIP tools run on server infrastructure with no local sandbox or WASM isolation.
### Protocol Message Reference

The feature communicates over WebSocket on port 3030 with the following message types. All messages are JSON with `type` and `payload` fields. The frontend sends request messages; the backend responds with response or event messages.

**Request messages** (frontend ? backend):
- Detailed in the How to Operate section above � each actionable step corresponds to a WebSocket message
- All messages include a `req_id` field for request-response correlation
- Errors are returned as `{ "type": "error", "req_id": "...", "message": "..." }`
- Messages are processed asynchronously � results may arrive in a different order than requests

**Response/event messages** (backend ? frontend):
- Each request generates at least one response message with status and data
- Streaming responses send multiple messages (e.g., one per token) followed by a completion message
- Event messages (e.g., model status changes, contradiction scan results) are pushed without a corresponding request
- The WebSocket connection is persistent � the frontend reconnects automatically on disconnect

**Error handling**: All WebSocket messages include error handling. If a request fails, an error message is returned with a description. The frontend displays errors as toast notifications. Failed requests do not affect other ongoing operations.

**Rate limiting**: There is no rate limiting on WebSocket messages � the system processes messages as fast as the hardware can handle. The 3050 Ti GPU and local inference ensure no external API rate limits apply.

### CLI Command Reference

The CLI provides 87 commands across 9 subcommand groups. All commands follow the pattern `api-oss <group> <action> [options]`. Use `api-oss help` to list all groups, `api-oss help <group>` for group-specific help.

The most important commands for this feature are:
- `api-oss status` � check gateway status and feature availability
- `api-oss config get <key>` � read configuration values
- `api-oss config set <key> <value>` � update configuration
- `api-oss log tail` � view real-time system logs
- `api-oss health` � run a comprehensive health check

### Integration Points

This feature integrates with the following other system components:

- **Knowledge Graph**: All data created or modified by this feature is stored as nodes and edges in `data/graph.db`. This enables cross-feature queries and relationships.
- **Audit Ledger**: All significant actions are recorded as entries in `data/ledger/` in `.aioss` format. The SHA-256 hash chain provides tamper-proof audit.
- **Search**: Content created by this feature is indexed by the FTS5 full-text search engine, making it discoverable via the Search view.
- **Multi-Agent Council**: If enabled, decisions made by this feature that have significant impact are reviewed by the Risk, Legal, and Strategist agents.
- **Contradiction Detection**: Statements made by this feature are checked for logical consistency with existing graph content.
- **Codex Multi-Tenancy**: All data is scoped by `codex_id`, ensuring isolation between workspaces.

### Security Considerations

- All feature operations are logged to the audit ledger with cryptographic chaining
- Path traversal protection applies to any file system access
- CLAW approval required for destructive operations (configurable)
- No data is transmitted over the network for feature operation
- The SHA-256 integrity check on startup validates all system components
- PID file lock prevents concurrent instance corruption of the database
- Feature works fully offline � no cloud dependency, no data breach surface

### Known Limitations

- Performance is bounded by local hardware � the 3050 Ti GPU provides ~20-40 tokens/second
- SQLite WAL supports concurrent reads but single writer � the PID lock enforces this
- Maximum database size is limited by available disk space (tested to 10GB+)
- WebSocket connection requires the gateway to be running (port 3030)
- HTTP UI requires the gateway to be running (port 8081)

### Upgrade & Migration

- All feature data is stored in the `./data/` directory
- To upgrade: replace the binary and restart � data is forward-compatible
- To migrate: copy the `./data/` directory to the new machine
- The audit ledger can be verified independently with `api-oss ledger verify`
- Configuration in `opencode.json` is versioned � the system warns on unknown keys

### Dependencies

This feature has no external runtime dependencies. All functionality is self-contained in the single `api-oss` binary:
- No cloud API keys required
- No third-party services
- No database servers
- No runtime environments (Python, Node.js)
- Docker is optional � everything runs as a single binary
- Everything works fully offline with no internet required

### FAQ

**Q: Does this require an internet connection?**
A: No. All features work fully offline with no internet required after initial model download.

**Q: What hardware do I need?**
A: A machine with a CUDA-capable GPU. The NVIDIA 3050 Ti (4GB VRAM) is the reference target and auto-detects with backend "cuda".

**Q: How do I start the gateway?**
A: Run `api-oss start` or execute the binary directly. The HTTP UI is on port 8081 and WebSocket on port 3030.

**Q: Can I run this in Docker?**
A: Docker is optional. The system runs as a single binary with no container required.

**Q: Where is my data stored?**
A: All data is in `./data/` by default � graph at `data/graph.db` (SQLite WAL), ledger at `data/ledger/` (`.aioss` format).

**Q: How do I configure the system?**
A: Edit `opencode.json` at the root or gateway level. Config drives all behavior.

**Q: Can I use a different model?**
A: Yes. Download any GGUF model and configure it in `opencode.json`. Runtime model switching is supported.

**Q: Is there a CLI?**
A: Yes � 87 commands in 9 subcommand groups. Run `api-oss help` to get started.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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
