---
title: "Discord Bridge"
sidebar_position: 99
description: "A full Discord bot integration allowing sovereign AI interaction inside any Discord server."
tags: [features]
---

# Discord Bridge

## What It Does
A full Discord bot integration allowing sovereign AI interaction inside any Discord server.
Supports slash commands (e.g., `/ask`, `/query`, `/graph`, `/ingest`, `/status`), threads
for long-running operations, file attachments for document ingestion, rich embeds for
formatted responses, and role-based access control mapping Discord roles to Passaporte
permissions. All AI processing happens on the local API-OSS gateway — no data leaves the
operator's infrastructure. Config token in `opencode.json` under `bridges.discord.token`.

## How It Works
The Discord bridge is implemented in `discord.rs` under `ai-oss-gateway/src/` using the
`serenity` or `poise` Rust library to interface with the Discord Gateway API. It connects
to Discord as a bot application using a token configured in `opencode.json` under
`bridges.discord.token`. The bot registers slash commands via Discord's interactions
endpoint — commands like `/ask`, `/query`, `/graph`, `/ingest`, `/status`. When a user
executes a slash command, Discord sends an interaction to the bridge, which maps the
command to a WebSocket message on port 3030 (part of the 810-message protocol). The
response from the gateway is formatted and sent back as a Discord message with rich embeds
showing graph data, model responses, or status information. Thread management creates
dedicated Discord threads for long-running operations (e.g., "analyzing document...") with
progress updates streamed to the thread. File attachment handling: when a user uploads a
file, the bridge downloads it, processes it locally (text extraction, image analysis via
Qwen2.5-VL on CUDA), and stores the result in the knowledge graph. Role-based access
control maps Discord server role IDs to Passaporte roles via configuration — e.g., only
users with the "analyst" role can execute `/query --all` for sensitive operations. The
bridge supports both polling mode (simpler, no public URL needed) and webhook mode (real-
time, requires tunnel). The bridge communicates with the local gateway via WebSocket on port
3030, so all AI and graph operations run on the local machine. The bridge can be started,
stopped, and monitored via the CLI: `api-oss bridge discord connect`, `bridge discord
disconnect`, `bridge discord status`. These are part of the 87 CLI commands.

Under the hood, `discord.rs` uses the `serenity` or `poise` Rust library which handles the
Discord Gateway API connection internally. The Discord Gateway is a persistent WebSocket
connection (`wss://gateway.discord.gg/`) that sends compressed JSON payloads (zlib-stream
compression) containing events like `INTERACTION_CREATE`, `MESSAGE_CREATE`, and
`GUILD_MEMBERS_CHUNK`. The bridge identifies itself to Discord's API with its bot token
via the `Authorization: Bot <token>` header during the identify payload, which also
declares gateway intents: `GUILD_MESSAGES`, `MESSAGE_CONTENT`, `GUILD_MEMBERS`, and
`DIRECT_MESSAGES`. Slash commands are registered via Discord's interactions API: the bridge
sends a `PUT` request to `https://discord.com/api/v10/applications/<app-id>/commands` with
a JSON array of command definitions (name, description, options with types and choices).
When a user invokes a slash command, Discord sends an `INTERACTION_CREATE` event; the bridge
acknowledges within 3 seconds via a `PONG` or `DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE`
response type, then processes the command (sending the appropriate WS message to the gateway
on port 3030) and edits the deferred response with the result. Discord's rate limits are
handled via response headers (`X-RateLimit-Remaining`, `X-RateLimit-Reset-After`) with
automatic retry after the reset period. The bridge uses tokio-per-bridge task isolation:
`discord_bridge_task` owns the `serenity::Client` instance and handles all Discord-specific
connection lifecycle, reconnection (Discord supports automatic reconnect with a 1–5 second
backoff), and sharding (multiple bot instances for large servers) if configured.

## How to Operate
1. Create a Discord application at `discord.com/developers/applications`, create a bot, and
   copy the bot token.
2. Configure the bot token in `opencode.json` under `bridges.discord.token`,
   `bridges.discord.guild_id` (optional, restricts to one server), and
   `bridges.discord.role_map` (maps Discord role IDs to Passaporte roles).
3. Ensure the gateway is running: `api-oss start` — the bridge auto-connects if configured.
4. Alternatively, manually connect: `api-oss bridge discord connect` from the CLI.
5. In Discord, use `/api-oss help` to see all available slash commands.
6. Use `/api-oss ask What is the status of Project X?` — the bot responds from the local
   model with answer sourced from the knowledge graph.
7. Use `/api-oss graph query --type Document --limit 5` — returns formatted graph results
   as a rich embed with node details and metadata.
8. Use `/api-oss ingest` with an attached file — the bridge processes the file into the
   knowledge graph with content hashing.
9. Use `/api-oss status` — shows gateway health, loaded model, connected peers.
10. Check bridge status: `api-oss bridge discord status` or send WS `bridge_discord_status`.
11. Disconnect: `api-oss bridge discord disconnect`.
12. Monitor bridge health via Prometheus on port 9000: `bridge_discord_commands_total`.

## The Moat
- No competitor offers a Discord bot that connects to a local-first, sovereign AI engine.
  All AI Discord bots on the market send data to cloud APIs (OpenAI, Anthropic, Google).
- All file attachments, queries, and commands are processed on the local gateway — zero data
  exfiltration to cloud services.
- Role-based access control maps existing Discord roles to Passaporte roles — no separate
  authentication system needed for team access control.
- Full knowledge graph querying from within Discord: users search their entire graph without
  leaving their communication platform.

## Why Choose API-OSS
A defense team operating on a classified network can use Discord (configured on their
internal infrastructure) as their AI interface, with all processing happening on-premises —
no data ever reaches a cloud API. A corporate team can deploy an internal AI assistant into
their existing Discord server, giving employees access to the company knowledge graph
without building a custom frontend or paying per-user licensing. A community can run a
local AI bot that moderates, answers questions, and maintains a community knowledge base.

## Competitive Comparison
- **Palantir**: No Discord integration. Palantir operates through its own proprietary
  frontend applications.
- **OpenAI**: ChatGPT has no Discord bot. OpenAI offers API access but not a turnkey
  Discord integration that is ready to deploy.
- **Anthropic**: Claude has no Discord bot or Discord integration.
- **Google**: No Discord integration for Gemini AI.
- **Nvidia**: No Discord integration for any AI platform.

## Cost-Benefit Analysis
Cloud AI Discord bots using OpenAI API cost $0.15/M tokens for GPT-4. A team exchanging
1000 messages/day (average 500 tokens each) would cost $75/day or $2,250/month in API costs.
API-OSS Discord bridge costs $0 — all inference is local with the free
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model. The hardware cost is a one-time $2,000
workstation with a CUDA GPU. Building a custom Discord bot with graph integration would
cost $50k–$150k in development time. API-OSS bridge is built-in and free. The privacy
benefit of zero data sent to third-party APIs is invaluable for sensitive environments.

## Applications
- **Consumer**: Personal AI assistant in Discord DMs or servers. Chat with your local
  knowledge graph, ask questions, share files — all from within Discord without cloud data.
- **Government / Defense**: Secure team AI operations within existing Discord infrastructure
  (on-premises or air-gapped). Analysts query the intelligence graph via slash commands
  without leaving their communication platform.
- **Enterprise**: Internal AI bot for support, knowledge management, and automation.
  Employees interact with the company knowledge graph from their existing Discord workspace.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
