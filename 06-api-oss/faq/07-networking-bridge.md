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
