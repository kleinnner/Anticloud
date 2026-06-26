---
title: "WhatsApp Bridge"
sidebar_position: 99
description: "A WhatsApp Business API integration for sovereign AI interaction via WhatsApp on any phone."
tags: [features]
---

# WhatsApp Bridge

## What It Does
A WhatsApp Business API integration for sovereign AI interaction via WhatsApp on any phone.
Particularly focused on emerging markets where WhatsApp is the primary communication
platform with over 2 billion users globally. Supports text, media (images, documents, voice),
interactive messages (buttons, lists), and message templates for structured communication.
All AI processing happens on the local API-OSS gateway — no data leaves the operator's
infrastructure. Config token in `opencode.json` under `bridges.whatsapp.token`.

## How It Works
The WhatsApp bridge is implemented in `whatsapp.rs` under `ai-oss-gateway/src/` — one of
three bridge agents alongside Telegram and Discord. It connects to the WhatsApp Business API
(Cloud API) using a configured access token and phone number ID in `opencode.json` under
`bridges.whatsapp.token` and `bridges.whatsapp.phone_number_id`. The bridge operates in
webhook mode: incoming messages are pushed by WhatsApp to the bridge's webhook URL (requires
a public URL — provided by the built-in tunnel with Let's Encrypt TLS). When a message
arrives, the bridge parses it (text, image, document, voice, location, interactive reply),
routes it through the command handler, and sends a response. Text commands mirror the CLI:
`/ask`, `/graph query`, `/status`, `/help`. Media messages: images are analyzed by the local
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model via CUDA (vision capabilities), documents are
text-extracted and stored in the knowledge graph, voice messages are processed through
speech-to-text. For outbound messages, the bridge supports: text messages, image messages
with captions, document messages, interactive buttons (up to 3), interactive lists (up to 10
sections), and message templates (pre-approved templates for business communication). The
bridge maps WhatsApp phone numbers to Passaporte identities via configuration — known users
are authenticated automatically on message receipt. The bridge supports both one-on-one chats
and group chats. In group chats, the bridge responds only when mentioned or when replying to
one of its messages. Communication with the local gateway uses WebSocket on port 3030 — all
AI processing is local with zero cloud dependency beyond WhatsApp's API endpoint. The bridge
can be connected/disconnected via CLI: `api-oss bridge whatsapp connect`, `disconnect`,
`status` as part of the 87-command CLI. The bridge maintains a message queue depth of 1,000
outbound messages with automatic reconnection using jittered exponential backoff (1s, 2s, 4s,
... 60s max). Heartbeat at 30-second intervals via the WebSocket Ping/Pong mechanism ensures
the bridge stays connected to the local gateway. Max connections default to 10 concurrent
WhatsApp Business API sessions with rate limiting at 250 messages/phone number/day.

The WhatsApp Business API integration in `whatsapp.rs` communicates with Meta's Cloud API
at `https://graph.facebook.com/v18.0/`. The bridge registers a webhook URL (provided by
the built-in tunnel — `https://<tunnel-host>/webhooks/whatsapp`) via a `POST` to
`/<phone-number-id>/subscribed_apps` with the access token. Incoming messages arrive as
JSON payloads on the webhook endpoint with a `field` of `"messages"` and an entry containing
the sender's phone number, message type (`text`, `image`, `document`, `audio`, `location`,
`interactive`, `button`, `order`), and message content. The bridge verifies the webhook
signature by computing the SHA-256 HMAC of the raw request body with the App Secret
(configured as `bridges.whatsapp.app_secret`) and comparing it against the
`X-Hub-Signature-256` header — rejecting mismatches with HTTP 401. Media messages trigger
a download via the Media API endpoint (`GET /<media-id>`) with the access token, saving the
media to a temporary directory for local processing by the Qwen2.5-VL model (image analysis
via the vision encoder), OCR pipeline (document text extraction), or speech-to-text (audio
transcription via the model's audio understanding). The bridge architecture uses the same
tokio-per-bridge pattern: `whatsapp_bridge_task` owns the webhook listener (an Axum route
registered on the HTTP server at port 8081 under `/webhooks/whatsapp`) and the outbound
message channel. Outbound messages are sent via `POST` to `/<phone-number-id>/messages` with
the required JSON body format for text, image, document, or interactive messages. Rate
limiting is handled per the WhatsApp Business API limits (default 250 messages/phone
number/day for marketing, 1,000/phone number/day for business).

## How to Operate
1. Set up WhatsApp Business API account: go to `business.whatsapp.com`, create an account,
   configure a phone number, generate an access token.
2. Configure the token and phone number ID in `opencode.json` under `bridges.whatsapp.token`,
   `bridges.whatsapp.phone_number_id`, and optionally `allowed_numbers`.
3. Ensure gateway running: `api-oss start` — the tunnel must be enabled for webhook reach.
4. Connect the bridge: `api-oss bridge whatsapp connect` — registers webhook with WhatsApp.
5. On WhatsApp, find your business phone number and send a message.
6. Send `/help` to see available commands.
7. Send `/ask What is the status of Project Alpha?` — responds from local knowledge graph.
8. Send a photo with caption "Analyze this" — processed by local Qwen2.5-VL model.
9. Send `/status` to check gateway health and model loaded state.
10. Check bridge status: `api-oss bridge whatsapp status` or WS `bridge_whatsapp_status`.
11. Disconnect: `api-oss bridge whatsapp disconnect` — unregisters the webhook.
12. Monitor: Prometheus on port 9000 — `bridge_whatsapp_messages_total`.

## The Moat
- WhatsApp has over 2 billion users and is the dominant platform in emerging markets. No
  competitor offers a WhatsApp bot connected to a local-first AI decision engine.
- The bridge enables sovereign AI access on the most ubiquitous messaging platform on earth,
  reaching users who may not have smartphones capable of running native AI apps.
- All media and messages are processed on the local gateway — zero data sent to cloud AI
  services.
- Interactive messages (buttons, lists) provide a structured UI within WhatsApp.

## Why Choose API-OSS
A humanitarian organization operating where WhatsApp is the primary communication platform
deploys API-OSS as a WhatsApp bot that field workers interact with from basic phones — no
app installation, no data leaving the local server. A customer support team integrates their
local knowledge graph with WhatsApp Business for AI-powered support without sending customer
data to third-party AI APIs. A consumer in an emerging market interacts with AI through the
app they use daily.

## Competitive Comparison
- **Palantir**: No WhatsApp integration. Requires Palantir app.
- **OpenAI**: ChatGPT has no WhatsApp bot.
- **Anthropic**: Claude has no WhatsApp integration.
- **Google**: Gemini has no WhatsApp integration.
- **Nvidia**: No WhatsApp bot for AI platforms.

## Cost-Benefit Analysis
WhatsApp Business API: free incoming, ~$0.005–$0.08 per outbound conversation. For 10,000
conversations/month: $50–$800 in WhatsApp fees. API-OSS bridge adds zero beyond WhatsApp's
fees. Cloud AI WhatsApp bots using OpenAI API add $0.15/M tokens — for 10,000 conversations
at 1,000 tokens each: $1,500/month API costs. API-OSS uses local inference: $0. Building a
custom WhatsApp bot: $15k–$50k. API-OSS bridge is free. One-time $2,000 GPU workstation.

## Applications
- **Consumer**: Personal AI assistant on WhatsApp from any phone — most accessible AI.
- **Government / Defense**: Secure AI access where WhatsApp is ubiquitous. Field agents
  query intelligence graph from basic phones.
- **Enterprise**: Customer support automation via WhatsApp Business. Field agent AI assistant
  for remote teams in emerging markets.

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
