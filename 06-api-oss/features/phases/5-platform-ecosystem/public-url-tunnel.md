---
title: "Public URL Tunnel"
sidebar_position: 99
description: "A built-in tunnel service that generates a public HTTPS URL and QR code for accessing"
tags: [features]
---

# Public URL Tunnel

## What It Does
A built-in tunnel service that generates a public HTTPS URL and QR code for accessing
API-OSS from any phone or remote device. No ngrok dependency, no third-party service, no
rate limits. Self-contained TLS termination with Let's Encrypt auto-certificates via ACME
protocol. Supports self-hosted relay for air-gapped environments. QR code generation for
one-scan device pairing using the `qrcode` Rust crate with ASCII/SVG/PNG output.

## How It Works
The tunnel is implemented in `tunnel.rs` under `ai-oss-gateway/src/`. It uses `rustls` for
TLS 1.3 termination and an embedded Let's Encrypt ACME client for automatic certificate
provisioning via HTTP-01 or DNS-01 challenges. When the tunnel is enabled, the gateway
opens an outbound WebSocket connection to the tunnel relay server (default:
`tunnel.api-oss.local:443`, self-hostable). The relay server assigns a public hostname (e.g.,
`abc123.tunnel.api-oss.local`) and proxies HTTPS connections to the local gateway. For
advanced deployments, the tunnel can operate in direct mode: the gateway opens a port
(default 443) and uses Let's Encrypt ACME to obtain a certificate for a custom domain. TLS
certificates are cached locally and automatically renewed 30 days before expiry. The tunnel
generates a QR code encoding the public URL — displayed in the terminal as ASCII art and
available in the web UI as SVG/PNG download. Scanning the QR code on a phone opens the
API-OSS PWA directly without any manual URL entry. The tunnel supports multiple simultaneous
connections multiplexed to the appropriate local service (WebSocket on 3030 or HTTP UI on
8081). Security: only operators with a valid Passaporte can use the tunnel. The tunnel works
with bridge agents (Telegram/Discord/WhatsApp) for webhook routing. CLI: `api-oss tunnel
start`, `tunnel stop`, `tunnel status`. WS: `tunnel_status`, `tunnel_restart`.

Under the hood, `tunnel.rs` uses `rustls` for TLS 1.3 with a configurable cipher suite
( default: TLS13_AES_256_GCM_SHA384, fallback: TLS13_CHACHA20_POLY1305_SHA256 ). The
embedded ACME client implements the `acme-v02` API from Let's Encrypt, performing HTTP-01
challenges by temporarily binding an HTTP handler on port 80 (or via the DNS-01 challenge if
`tunnel.dns_challenge: true` and DNS credentials are configured). The TLS session cache
stores certificates PEM-encoded at `./data/tls/cert.pem` and `./data/tls/key.pem`, rotated
30 days before expiry via a tokio timer task. For the relay mode, the gateway initiates an
outbound WebSocket connection through `tokio-tungstenite` to the configured relay server.
The relay server maintains an in-memory map of hostname-to-WebSocket connections, forwarding
incoming HTTPS requests to the correct gateway by matching the SNI hostname. The CLI tunnel
subcommand is defined via clap derive as `TunnelCmd` enum with `Start`, `Stop`, and `Status`
variants, each with `#[derive(clap::Args)]` structs for optional flag overrides (e.g.,
`tunnel start --port 8443 --domain custom.example.com`). The tunnel generates the public URL
QR code using the same `qrcode` crate integration as the QR sharing feature — ASCII in
terminal, SVG/PNG in web UI. The tunnel supports up to 100 concurrent connections with
automatic reconnection using jittered exponential backoff (1s, 2s, 4s, ... 60s max) and
heartbeat via WebSocket Ping/Pong frames at 30-second intervals. TLS certificates are
automatically renewed 30 days before expiry via a daily tokio timer task that checks
certificate validity and triggers ACME renewal if needed.

## How to Operate
1. Enable tunnel: set `tunnel.enabled: true` in `opencode.json` at root or gateway level.
2. Start gateway: `api-oss start` — tunnel connects automatically.
3. Tunnel URL displayed in terminal: `https://abc123.tunnel.api-oss.local`. QR shown as ASCII.
4. Web UI on port 8081 shows the tunnel URL and QR code in the Tunnel view.
5. Scan QR code with any phone camera — opens the API-OSS PWA directly.
6. Share tunnel: `api-oss share qr --tunnel` generates QR for the tunnel URL.
7. Check status: `api-oss tunnel status` — shows URL, connection state, cert expiry.
8. Custom domain: set `tunnel.domain: my.domain.com` with DNS pointed to the relay.
9. Self-hosted relay: set `tunnel.relay: ws://my-relay:443` for air-gapped environments.
10. Disable: `api-oss tunnel stop` or set `tunnel.enabled: false`.
11. Monitor: Prometheus on port 9000 — `tunnel_connections_active`, `tunnel_bytes_sent_total`,
    `tunnel_cert_expiry_days` (Gauge showing days until certificate expiry).
12. Rotate TLS certs manually: delete `./data/tls/cert.pem` and restart — the ACME client
    provisions a new certificate automatically on next tunnel start.
13. For advanced setups, configure DNS-01 challenge in `opencode.json` under
    `tunnel.dns_challenge: true` with `tunnel.dns_provider: "cloudflare"` and the
    corresponding API token for wildcard certificate support.

## The Moat
- Competitors require ngrok (paid, $20/month, rate-limited, data through ngrok servers) or
  complex reverse proxy setup (nginx + Let's Encrypt) for remote access.
- Built-in tunnel with automatic TLS and QR code generation provides zero-configuration
  remote access that works out of the box anywhere.
- Self-hostable relay option means the tunnel can operate entirely within an organization's
  network — no third-party dependency for sensitive environments.
- QR code generation for one-scan device pairing is unique among AI platforms.

## Why Choose API-OSS
A field worker in a remote location scans a QR code from their phone and instantly accesses
their home API-OSS instance — no ngrok, no VPN, no configuration. A defense team runs their
own tunnel relay inside the classified network for secure remote access. An enterprise
provides zero-config remote access for field workers with automatic TLS.

## Competitive Comparison
- **Palantir**: No tunnel feature. Requires VPN or complex networking.
- **ngrok**: Paid ($20/month basic), rate-limited, data through ngrok servers.
- **OpenAI/Anthropic**: Cloud-native, no tunnel needed but no local-first option.
- **Cloudflare Tunnel**: Free but requires Cloudflare account, complex setup.
- **Tailscale**: Requires account and auth, not for one-time access sharing.

## Cost-Benefit Analysis
ngrok costs $20/month basic, $100/month business. For 10 developers: $200–$1,000/month.
API-OSS tunnel is free — no subscription, no rate limits, no data caps. Self-hosted relay
eliminates third-party costs entirely. Configuring ngrok takes 30–60 min per developer;
built-in tunnel takes 0 min. For 10 developers: 5–10 hours saved (~$750–$1,500).

Cloudflare Tunnel is free but requires a Cloudflare account, domain setup (DNS changes can
take 24–48 hours to propagate), and exposes traffic through Cloudflare's infrastructure —
not suitable for air-gapped or classified deployments. Tailscale Funnel ($5/user/month for
team plan, $20/user/month for business) requires Tailscale account and client installation
on every device. API-OSS tunnel works with zero accounts, zero DNS configuration, zero
third-party infrastructure (in self-hosted relay mode). A self-hosted relay server running
on a $5/month VPS provides unlimited tunnels for an entire organization — replacing
$2,400/year in ngrok business subscriptions for 2 developers. TLS certificate management
via Let's Encrypt ACME saves ~2 hours/month of manual cert renewal per domain ($3,600/year
at $150/hour for DevOps). The built-in tunnel also eliminates the need for reverse proxy
configuration (nginx/Caddy setup: 2–4 hours initial + ongoing maintenance), saving
$300–$600 in engineer time per deployment and ongoing operational overhead.

## Applications
- **Consumer**: Access API-OSS from phone via QR code. Share temporary access.
- **Government / Defense**: Secure remote access with automatic TLS. Self-hosted relay for
  air-gapped networks.
- **Enterprise**: Zero-config remote access for field workers, demos, and bridge webhooks.

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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
