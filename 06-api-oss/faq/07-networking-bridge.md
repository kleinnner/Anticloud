---
title: "NETWORKING & BRIDGE — FREQUENTLY ASKED QUESTIONS"
sidebar_position: 7
description: "Default ports: 3030 (WebSocket for tool integrations), 8081 (UI frontend), and optional TLS on 443. These are configurable in `gateway.ws_port`, `gateway.ui_port`, and `tls.port`."
tags: [faq]
---

# NETWORKING & BRIDGE — FREQUENTLY ASKED QUESTIONS

## What ports does API-SOS use?

Default ports: 3030 (WebSocket for tool integrations), 8081 (UI frontend), and optional TLS on 443. These are configurable in `gateway.ws_port`, `gateway.ui_port`, and `tls.port`.

## Can I change the ports?

Yes. Edit `gateway.ws_port` and `gateway.ui_port` in the configuration file and restart the gateway.

## The WebSocket connection is refused.

Ensure the gateway is running and nothing else is using the same port. Check firewall rules — local connections may be blocked by third-party security software. Verify the port number matches between the config and your client.

## How do I enable CORS for cross-origin requests?

Set `gateway.allowed_origins` in the config to a comma-separated list of permitted origins. The default is `*` (all origins) for local development.

## Can I use API-SOS behind a reverse proxy?

Yes. Configure your reverse proxy (nginx, Apache, HAProxy) to forward traffic to the gateway's WebSocket and UI ports. Set `gateway.proxy` to `true` if you need the gateway to honour X-Forwarded-For headers.

## How do I set up the Telegram bridge?

Provide your Telegram bot token in `bridge.telegram_token`. The gateway will connect to Telegram's API and relay messages between Telegram and the local AI. Set `bridge.auto_start` to `true` to launch bridges on startup.

## How do I set up the Discord bridge?

Provide your Discord bot token in `bridge.discord_token` and the channel IDs in `bridge.discord_channel_ids`. The bot must be invited to the server with the appropriate permissions.

## How do I set up the WhatsApp bridge?

You need a WhatsApp Business API token, phone number ID, and verify token. These are provided in `bridge.whatsapp_token`, `bridge.whatsapp_phone_id`, and `bridge.whatsapp_verify_token`.

## What is the tunnel port?

The `bridge.tunnel_port` (default 8081) is used for the tunnel service that exposes the local gateway to external services (Telegram, Discord, WhatsApp) without exposing your home network.

## Can I run multiple bridges simultaneously?

Yes. Configure each bridge independently in the config file. They run as separate tasks within the gateway process.

## See Also

Related FAQ, support, and troubleshooting documentation.

- [FAQ Index](../faq/01-general.md)
- [Support Guide](../support/01-getting-help.md)
- [Troubleshooting](../troubleshooting/01-app-wont-start.md)
- [User Manual](../user-manual/01-getting-started.md)

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com