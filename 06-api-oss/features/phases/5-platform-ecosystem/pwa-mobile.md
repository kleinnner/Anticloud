---
title: "PWA / Mobile"
sidebar_position: 99
description: "A Progressive Web App installable on any phone, tablet, or desktop via the browser's install"
tags: [features]
---

# PWA / Mobile

## What It Does
A Progressive Web App installable on any phone, tablet, or desktop via the browser's install
prompt. Provides full API-OSS functionality through bridge integrations (Telegram, WhatsApp,
Discord) and tunnel access for remote connectivity. Works offline with a cached UI shell and
background sync for queuing operations. No app store submission required — instant
deployment across iOS, Android, Windows, macOS, and Linux.

## How It Works
The PWA is built on top of the existing HTTP UI served on port 8081. A PWA manifest
(`manifest.json`) declares the app name, icons (192px and 512px), theme color, display mode
(`standalone`), and start URL. A service worker registers on first visit and caches all
static UI assets (HTML, CSS, JS, fonts) in the Cache API during the install event. For
offline operation: when the device is offline, the service worker serves cached assets and
queues WebSocket messages in IndexedDB. When connectivity returns (detected via the
WebSocket reconnection with jittered exponential backoff: 1s, 2s, 4s, ... 60s max), the
queued messages are sent in order. Background sync API triggers synchronization when the
device has connectivity — even if the browser is closed (Chrome for Android and desktop).
The PWA views are mobile-responsive versions of all desktop views with touch-friendly
targets (minimum 44px), bottom navigation bar, and swipe gestures. The bridge-focused UI
provides quick access to Telegram, WhatsApp, and Discord interactions. The tunnel QR code
scanner (using the built-in camera API via `getUserMedia`) makes connection to a remote
instance one-scan. Push notifications via the Notification API: sync completed, bridge
messages received, pipeline finished, backup completed, workflow approval requests. The
service worker handles notification click events to open the relevant view. The PWA works on
iOS 16.4+ (Safari), Android (Chrome), and desktop (Chrome, Edge, Firefox). For iOS,
limitations apply for background sync and push notifications due to Safari's PWA support
restrictions, but core offline functionality works. The PWA supports the Web Share API.
The service worker implements a cache-first strategy for static assets with versioned cache
names (`api-oss-v1`, `api-oss-v2`, etc.) — when a new version is detected, the old cache
is pruned after all tabs using the old version are closed. The offline queue depth is 500
messages, with automatic replay on reconnection and exponential backoff (1s, 2s, 4s, ...
60s max) for failed message delivery, matching the WebSocket protocol's retry policy.

The PWA manifest (`manifest.json`) is served by the gateway's HTTP server on port 8081 at
`/manifest.json`. It declares `start_url: "/"`, `display: "standalone"`, `orientation: "any"`,
and `background_color: "#1a1a2e"` matching the default dark theme. The service worker
(`sw.js`) is registered on page load via a `<script>` tag in the main HTML template. During
the `install` event, the service worker opens the Cache API with cache name `api-oss-v1`
and stores all static assets (HTML shell, CSS bundle, JavaScript bundle, fonts, icon SVGs).
On `fetch` events, the worker implements a cache-first strategy for static assets and a
network-first strategy for API data queries. For offline WebSocket message queuing, the
service worker intercepts the WebSocket `send()` call by wrapping the native API: when the
connection drops, outgoing messages are serialized and stored in IndexedDB under the
`pending_messages` object store with a monotonically increasing sequence number. On
reconnection (detected via the WebSocket `onopen` event), the worker reads all pending
messages ordered by sequence number and replays them through the restored connection. The
Background Sync API registers a `sync` event tag (`"sync-pending-messages"`) via
`self.registration.sync.register()`, ensuring queued messages are sent even if the user
closes the browser tab. On iOS 16.4+, the PWA supports the `display: standalone` mode with
separate cookie storage, but lacks Background Sync API — pending messages are flushed on
the next page load. Push notifications use the VAPID protocol: the gateway generates a
VAPID key pair, the service worker subscribes via `pushManager.subscribe()`, and the
gateway sends encrypted push payloads through the browser's push service when bridge
messages arrive or workflow approvals are needed.

## How to Operate
1. Start the gateway: `api-oss start` — HTTP UI served on port 8081.
2. On your phone, navigate to `http://localhost:8081` (same network) or scan the tunnel QR
   code for remote access.
3. The browser shows an "Install" prompt (or "Add to Home Screen" on iOS) — tap it.
4. The PWA installs as a standalone app on the home screen.
5. For remote access: enable the tunnel (`tunnel.enabled: true` in `opencode.json`), then
   scan the QR code from your phone's camera app — the PWA opens automatically.
6. Offline mode: the UI loads from the service worker cache even without connectivity.
   WebSocket messages are queued and sent when the connection is restored.
7. Bridge interaction: tap the bridge icon in the bottom navigation for Telegram, Discord,
   or WhatsApp controls.
8. QR scanner: tap the scanner icon to scan another device's Passaporte QR for pairing.
9. Push notifications: grant notification permission on first launch.
10. Update the PWA: the service worker checks for updates on each new session.
11. For iOS users, enable the tunnel (`tunnel.enabled: true`) and share the public URL via
    `api-oss share qr --tunnel` — scanning the QR code from the iPhone camera opens the PWA
    without typing URLs. The tunnel uses Let's Encrypt TLS so Safari trusts the connection
    without certificate warnings.
12. Offline mode: the UI shell loads from cache instantly even without network. Queued
    messages are stored in IndexedDB (max 500) and replayed in order when WebSocket
    connectivity restores — check pending count in the PWA's status indicator at the top
    of the navigation bar.

## The Moat
- Competitors require native iOS/Android apps distributed through app stores — creating
  dependency on Apple and Google approval processes and review cycles.
- A PWA with offline caching, background sync, and push notifications provides an app-like
  experience without app store gatekeeping or review delays.
- Bridge-first design means the PWA is not the only mobile interface — users can interact
  with API-OSS via Telegram, WhatsApp, or Discord without installing anything extra.
- QR code scanning for zero-config connection to remote instances is unique.

## Why Choose API-OSS
A defense agency with classified devices lacking Google Play or App Store access can
distribute the API-OSS PWA by simply sharing a URL — no MDM, no sideloading, no approval
process. An enterprise managing a device fleet can pre-install the PWA on any browser
without IT intervention. A consumer installs API-OSS on their phone in 10 seconds by
scanning a QR code.

## Competitive Comparison
- **Palantir**: Native iOS/Android app through app stores. Not on non-app-store devices.
- **OpenAI**: ChatGPT requires native app from App Store or Google Play. No PWA option.
- **Anthropic**: Claude has no mobile app.
- **Google**: Gemini requires Google Play Services.
- **Microsoft**: Copilot requires native app download.

## Cost-Benefit Analysis
iOS App Store annual fee: $99/year. Google Play: $25 one-time. Native mobile app
maintenance: $50k–$150k/year per platform. PWA eliminates all of this — shared with web UI,
no store fees, no review delays. App store approval takes 1–5 days per release — PWA updates
are instant. For a team releasing weekly, that is 1–5 days of delay saved per release. For
defense agencies, app store dependency is mission-critical — if Apple or Google removes the
app, mobile access is lost entirely. PWA eliminates this risk.
ngrok charges $20/month for tunnel-based remote access; the PWA connects via the built-in
free tunnel with Let's Encrypt TLS, saving $240/year per user. OpenAI charges $0.01/1K
tokens for API inference — the PWA processes all AI queries on the local gateway via
WebSocket at zero per-token cost.

## Applications
- **Consumer**: Install API-OSS on phone like an app, no app store needed.
- **Government / Defense**: Deploy to devices without Google Play or App Store. Distribute
  via internal URL or QR code. Full offline support.
- **Enterprise**: Distribute internal AI tool without MDM or app store management. Instant
  updates across the fleet. No per-device licensing.

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ