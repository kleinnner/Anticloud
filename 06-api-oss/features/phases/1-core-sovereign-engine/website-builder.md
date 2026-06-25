---
title: "Website Builder"
sidebar_position: 99
description: "Generates static HTML websites from natural language descriptions. The system writes HTML, CSS, and JavaScript based on user requirements. Sites can be regenerated, previewed in a live iframe, and pub"
tags: [features]
---

# Website Builder

## What It Does
Generates static HTML websites from natural language descriptions. The system writes HTML, CSS, and JavaScript based on user requirements. Sites can be regenerated, previewed in a live iframe, and published to a local or remote directory. Each site is a complete, self-contained static website with no server-side dependencies.

## How It Works
The Website Builder is implemented in i-oss-gateway/src/handlers/website.rs. When a user provides a website description via WebSocket on port 3030 (generate_website message):

1. The description is sent to the local LLM (Qwen2-VL-2B-Instruct-Q4_K_M.gguf on CUDA) with a system prompt that instructs the model to generate complete HTML, CSS, and JavaScript.
2. The LLM generates the code, which is validated: HTML structure is checked for well-formedness, CSS is checked for syntax errors, JavaScript is checked for obvious issues.
3. The generated site is saved to a subdirectory under ./data/websites/<id>/ with an index.html file.
4. The frontend WebsiteBuilderView (React 18 + Vite 5 + Tailwind) renders the site in a sandboxed iframe for live preview.
5. If the user requests regeneration (with refined description), the process repeats and overwrites the site.

**Publishing**: The publish_website command copies the site files to a configurable output directory (local path or network share). This allows deployment to any static hosting without additional tooling.

**Regeneration**: Users can iterate on their description � "make the header blue", "add a contact form" � and the system regenerates the site. The previous version is archived in case the user wants to revert.

The frontend provides: description input field, regeneration button, live preview iframe with sandbox attributes, publish controls (target directory, site name), and a list of previously generated sites.

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including website generate, website publish, website list.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Website Builder view.
4. Describe the website you want (e.g., "a personal portfolio page with a dark theme, my name John, and three project cards").
5. Click "Generate". The site appears in the preview iframe within seconds.
6. Refine: "make the background darker" and regenerate. Previous version is archived.
7. Click "Publish" to write the site to disk at the configured output directory.
8. Use CLI: pi-oss website generate --description "portfolio site", pi-oss website list.
9. Use pi-oss website publish --id <id> --dir ./my-site.

Config in opencode.json:
`json
{
  "website": {
    "output_dir": "./data/websites",
    "publish_dir": "./published",
    "archive_versions": true
  }
}
`

## The Moat
- OpenAI and other competitors do not offer website generation as a built-in feature.
- Users must manually copy generated code from ChatGPT and set up their own deployment.
- Our Website Builder is an integrated tool that handles the full pipeline from natural language to deployable static site.
- Live preview in a sandboxed iframe lets users iterate visually without touching code.
- Publishing to a directory means the site is ready to deploy to any static host.

## Why Choose API-OSS
Rapid prototyping of static websites without leaving the AI platform. Non-developers can create functional websites by describing them in plain English. Developers can use it for rapid prototyping, iterating on design ideas. The integrated preview and publishing pipeline makes it genuinely useful � not just a code generator but a complete website creation workflow.

## Competitive Comparison
- **OpenAI**: No website generation feature. ChatGPT can generate code but cannot preview or publish it.
- **Anthropic**: No website generation. Claude cannot generate complete deployable websites.
- **Google**: No integrated website builder in Gemini.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Website Builder

## What It Does
Generates static HTML websites from natural language descriptions. The system writes HTML, CSS, and JavaScript based on user requirements. Sites can be regenerated, previewed in a live iframe, and published to a local or remote directory. Each site is a complete, self-contained static website with no server-side dependencies.

## How It Works
The Website Builder is implemented in i-oss-gateway/src/handlers/website.rs. When a user provides a website description via WebSocket on port 3030 (generate_website message):

1. The description is sent to the local LLM (Qwen2-VL-2B-Instruct-Q4_K_M.gguf on CUDA) with a system prompt that instructs the model to generate complete HTML, CSS, and JavaScript.
2. The LLM generates the code, which is validated: HTML structure is checked for well-formedness, CSS is checked for syntax errors, JavaScript is checked for obvious issues.
3. The generated site is saved to a subdirectory under ./data/websites/<id>/ with an index.html file.
4. The frontend WebsiteBuilderView (React 18 + Vite 5 + Tailwind) renders the site in a sandboxed iframe for live preview.
5. If the user requests regeneration (with refined description), the process repeats and overwrites the site.

**Publishing**: The publish_website command copies the site files to a configurable output directory (local path or network share). This allows deployment to any static hosting without additional tooling.

**Regeneration**: Users can iterate on their description � "make the header blue", "add a contact form" � and the system regenerates the site. The previous version is archived in case the user wants to revert.

The frontend provides: description input field, regeneration button, live preview iframe with sandbox attributes, publish controls (target directory, site name), and a list of previously generated sites.

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including website generate, website publish, website list.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. SHA-256 integrity check on startup.
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Website Builder view.
4. Describe the website you want (e.g., "a personal portfolio page with a dark theme, my name John, and three project cards").
5. Click "Generate". The site appears in the preview iframe within seconds.
6. Refine: "make the background darker" and regenerate. Previous version is archived.
7. Click "Publish" to write the site to disk at the configured output directory.
8. Use CLI: pi-oss website generate --description "portfolio site", pi-oss website list.
9. Use pi-oss website publish --id <id> --dir ./my-site.

Config in opencode.json:
`json
{
  "website": {
    "output_dir": "./data/websites",
    "publish_dir": "./published",
    "archive_versions": true
  }
}
`

## The Moat
- OpenAI and other competitors do not offer website generation as a built-in feature.
- Users must manually copy generated code from ChatGPT and set up their own deployment.
- Our Website Builder is an integrated tool that handles the full pipeline from natural language to deployable static site.
- Live preview in a sandboxed iframe lets users iterate visually without touching code.
- Publishing to a directory means the site is ready to deploy to any static host.

## Why Choose API-OSS
Rapid prototyping of static websites without leaving the AI platform. Non-developers can create functional websites by describing them in plain English. Developers can use it for rapid prototyping, iterating on design ideas. The integrated preview and publishing pipeline makes it genuinely useful � not just a code generator but a complete website creation workflow.

## Competitive Comparison
- **OpenAI**: No website generation feature. ChatGPT can generate code but cannot preview or publish it.
- **Anthropic**: No website generation. Claude cannot generate complete deployable websites.
- **Google**: No integrated website builder in Gemini.
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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
