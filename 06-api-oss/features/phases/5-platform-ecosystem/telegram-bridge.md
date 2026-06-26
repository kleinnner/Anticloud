---
title: "Telegram Bridge"
sidebar_position: 99
description: "A full Telegram bot integration that enables sovereign AI interaction from any phone via"
tags: [features]
---

# Telegram Bridge

## What It Does
A full Telegram bot integration that enables sovereign AI interaction from any phone via
Telegram. Supports sending and receiving messages, slash commands (`/ask`, `/query`,
`/graph`, `/status`, `/help`), file attachments (photo, document, voice), inline queries,
and keyboard buttons through the Telegram Bot API. All processing happens on the local
API-OSS gateway — no data leaves the operator's infrastructure. Config token in
`opencode.json` under `bridges.telegram.token`.

## How It Works
The Telegram bridge is implemented in `telegram.rs` under `ai-oss-gateway/src/` using the
`teloxide` Rust library. It connects to Telegram's Bot API using a bot token configured in
`opencode.json` under `bridges.telegram.token`. The bridge supports up to 100 concurrent
connections with automatic reconnection logic using jittered exponential backoff (1s, 2s, 4s,
... 60s max) and a message queue depth of 1,000 pending outbound messages per session. The
bridge supports two modes: polling (bot periodically calls `getUpdates` every 200ms —
simpler, no public URL needed) and webhook (Telegram pushes updates to the bridge's public
URL — real-time, requires the tunnel). In
polling mode, the bridge runs a tokio task that calls `getUpdates` every 200ms, processing
each update through the command router. In webhook mode, the tunnel's public URL is
registered with Telegram as the webhook endpoint. Message handling: text messages are routed
to the local Qwen2-VL-2B-Instruct-Q4_K_M.gguf model for responses via WebSocket on port
3030, or parsed as commands (e.g., `/graph query Person` maps to a `graph_query` WS message).
File messages: photos and documents are downloaded, processed locally (OCR via the vision
model, text extraction), and the results are stored in the knowledge graph or returned to
the user. Voice messages are processed through the model's audio capabilities. Command
mapping: `/query` maps to `graph_query`, `/ask` maps to `model_infer`, `/graph` shows
statistics, `/status` shows gateway health. Inline queries: users can type
`@api-oss_bot <query>` in any chat to search the knowledge graph inline. Role-based access:
Telegram user IDs are mapped to Passaporte roles via configuration. The bridge supports both
private and group chats — in group chats, the bot responds when mentioned or replied to.
The CLI provides `api-oss bridge telegram connect`, `bridge telegram disconnect`, `bridge
telegram status` as part of the 87-command CLI.

Internally, `telegram.rs` uses the `teloxide` library which wraps the Telegram Bot API with
a typed dispatcher pattern. The bridge creates a `teloxide::Bot` instance from the token,
then builds a `Dispatcher` that routes incoming updates to handler closures based on
update type and content filters. The polling mode runs a `tokio::time::interval` set to
200ms, calling `bot.get_updates().offset(update_id + 1).timeout(10).await` per tick — a
long-polling approach where Telegram holds the connection open for up to 10 seconds if no
new updates exist, reducing bandwidth. On each batch of updates, the dispatcher routes them
through a pipeline: text messages with leading `/` are parsed as commands via a
`CommandParser` that maps strings like `/graph query Person` to a `GraphQuery` WS message
with parsed arguments; photos and documents trigger download via `bot.get_file()` then local
processing (OCR via Qwen2.5-VL vision, text extraction via `pdftotext` or similar); voice
messages are downloaded as OGG Opus and transcribed. The bridge architecture dedicates a
tokio task per bridge — `telegram_bridge_task`, `discord_bridge_task`,
`whatsapp_bridge_task` — each with its own `tokio::sync::mpsc` channel for outbound
messages from the gateway. This isolation ensures a failure or delay in one bridge (e.g.,
Telegram API rate limit of 30 messages/second) does not affect the others. The bridge
configuration is loaded from `opencode.json` under `bridges.telegram` and validated at
startup — missing tokens produce a warning but do not prevent gateway startup.

## How to Operate
1. Create a bot via `@BotFather` on Telegram and get the bot token.
2. Configure the token in `opencode.json` under `bridges.telegram.token`. Optionally set
   `bridges.telegram.allowed_users` for access control.
3. Ensure the gateway is running: `api-oss start` — the bridge auto-connects if configured.
4. Or manually connect: `api-oss bridge telegram connect` from CLI.
5. On Telegram, find your bot and start a chat. Send `/start` to see available commands.
6. Use `/ask What is the latest intelligence report on Project X?` — the bot responds with
   an answer from the local model and knowledge graph.
7. Use `/graph query --type Document --limit 5` — returns formatted graph query results.
8. Send a photo or document — the bot processes it locally and stores it in the graph.
9. Use `/help` to see all available commands.
10. In any chat, type `@your_bot_username search term` for inline knowledge graph search.
11. Check status: `api-oss bridge telegram status` or send WS `bridge_telegram_status`.
12. Disconnect: `api-oss bridge telegram disconnect`.
13. Monitor bridge health: `api-oss doctor --bridge telegram` shows connection state, message
    queue depth (max 1,000), reconnection count, and last error timestamp.
14. Configure rate limits in `opencode.json` under `bridges.telegram.rate_limit` — default 30
    messages/second per Telegram API constraints, with automatic queuing when exceeded.

## The Moat
- Competitors require installing native mobile apps to interact with their AI platforms.
  No competitor offers a Telegram bot connected to a local-first AI decision engine.
- By leveraging Telegram's 2 billion+ user base, API-OSS provides zero-friction mobile
  access on any phone without installing anything extra.
- All file attachments, voice messages, and commands are processed on the local gateway —
  zero data sent to cloud AI services.
- Works fully offline with polling mode — no public URL needed beyond Telegram's API.

## Why Choose API-OSS
A user in a region where Telegram is the primary communication platform can interact with
their full sovereign AI platform from any phone — no app store, no native app, no data
leaving their server. A defense team can use Telegram to query the intelligence graph from
the field. An enterprise deploys an internal AI assistant as a Telegram bot.

## Competitive Comparison
- **Palantir**: No Telegram integration. Requires Palantir mobile app or web UI.
- **OpenAI**: ChatGPT has no Telegram bot. Requires native app.
- **Anthropic**: Claude has no Telegram integration.
- **Google**: Gemini has no Telegram integration.
- **Nvidia**: No Telegram bot for AI platforms.

## Cost-Benefit Analysis
Building a custom Telegram bot with AI costs $10k–$30k. API-OSS bridge is free. ChatGPT
Plus is $20/month/user — for 50 field workers, $12,000/year saved. Cloud AI Telegram bots
using OpenAI API cost $0.15/M tokens — for 1000 messages/day at 500 tokens each:
$75/day ($27k/year). API-OSS bridge costs $0 in API fees. ngrok for webhook: $20/month;
API-OSS tunnel is free. OpenAI charges $0.01/1K tokens for GPT-4o mini inference; API-OSS
runs Qwen2-VL-2B-Instruct-Q4_K_M.gguf locally at $0 inference cost per token, saving a
team processing 10M tokens/month approximately $100/month in API fees.

## Applications
- **Consumer**: Personal AI assistant on any phone via Telegram.
- **Government / Defense**: Secure AI access via Telegram. No app store dependency.
- **Enterprise**: Team AI assistant in Telegram groups. Automated reporting. Field agent AI.

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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
