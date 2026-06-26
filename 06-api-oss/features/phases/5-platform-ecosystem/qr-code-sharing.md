---
title: "QR Code Sharing"
sidebar_position: 99
description: "QR code generation for Passaporte identity sharing, bridge connection, tunnel access, form"
tags: [features]
---

# QR Code Sharing

## What It Does
QR code generation for Passaporte identity sharing, bridge connection, tunnel access, form
distribution, and temporary access provisioning. Zero-configuration device pairing — scan
a QR code from any phone camera to connect, authenticate, or access API-OSS. Uses the
`qrcode` Rust crate with customizable size and error correction levels (L, M, Q, H).
Output formats: ASCII art (terminal), SVG (web UI), and PNG (download/share).

## How It Works
QR code generation is implemented using the `qrcode` Rust crate, integrated into `tunnel.rs`,
`graph.rs`, and the CLI. The system encodes different payload types as QR content:
Passaporte public keys (ed25519, 32 bytes, base64url encoded) for identity sharing, tunnel
URLs (public HTTPS URL from the built-in tunnel) for remote access, bridge connection tokens
(for Telegram/Discord/WhatsApp bot QR login), form URLs (for form builder distribution), and
temporary access tokens (time-limited, Passaporte-scoped, with specific permission grants).
QR codes are generated in multiple formats: ASCII art for terminal display using a block
character matrix, SVG for web UI as scalable vector graphics with theming support, and PNG
for download and sharing. Error correction level defaults to Medium (M, approximately 15%
recovery) and is configurable to Low (L, approximately 7%), Quarter (Q, approximately 25%),
or High (H, approximately 30%). Customization options include module size (in pixels or
terminal columns), foreground/background colors, and optional logo overlay (API-OSS logo in
the center). The QR code for Passaporte sharing encodes: Passaporte public key (ed25519,
32 bytes) as base64url, Passaporte ID (hash of public key), display name, and an optional
validity duration. When scanned on another device with the API-OSS PWA or mobile bridge, the
scanner can add the Passaporte as a contact, establish a P2P sync connection, or grant
temporary graph access. Temporary access QR codes are time-limited (configurable, default
15 minutes) and scoped to specific permissions (e.g., read-only graph access or specific
bridge access). Each QR share event is recorded in the ledger with: sharing Passaporte ID,
shared Passaporte ID (if known), payload type, timestamp, and expiry.

The `qrcode` Rust crate renders QR codes by encoding payload bytes into a Reed-Solomon error-
corrected binary matrix using the QR code standard (ISO/IEC 18004). For terminal display, the
matrix is converted to ASCII block characters (U+2588 full block for dark modules, space for
light modules) using a configurable module size (default 2 terminal columns per module). For
SVG output, each module becomes a `<rect>` element in a scalable group with theming support
(dark module color via CSS variable `--qr-dark`, light via `--qr-light`). For PNG output,
the matrix is rendered via the `image` crate with bilinear anti-aliasing and optional logo
overlay composited at the center using Porter-Duff alpha blending. The CLI flag parsing for
`api-oss share qr` is handled by clap derive: `#[derive(clap::Args)]` on the `QrArgs` struct
with fields for `--passaporte`, `--tunnel`, `--form <id>`, `--access <duration>`,
`--permission <scope>`, `--size <cols>`, `--error-correction <level>`, and `--output <fmt>`.
The validation ensures mutually exclusive flags (passaporte/tunnel/form/access) are rejected
with a clear error message from clap's `conflicts_with` attribute. QR codes support error
correction levels L (7%), M (15%), Q (25%), and H (30%) — default is M, providing a balance
between density and resilience. Session-based QR codes include an embedded timestamp and
expiry duration (default 15 minutes) for time-limited access tokens, with the expiry
enforced server-side by the gateway on scan validation.

## How to Operate
1. Start the gateway: `api-oss start`. WebSocket on 3030, HTTP UI on 8081.
2. Share your Passaporte: `api-oss share qr --passaporte` — displays QR code in terminal.
3. Share tunnel access: `api-oss share qr --tunnel` — QR for public tunnel URL.
4. Share a form: `api-oss share qr --form <form-id>` — QR for form submission URL.
5. Temporary access: `api-oss share qr --access 15m --permission graph:read`.
6. Customize: `api-oss share qr --passaporte --size 10 --error-correction H`.
7. In web UI, QR codes displayed in relevant views — click to enlarge and download.
8. On mobile PWA, use built-in QR scanner to scan and import Passaportes.
9. View QR share history: `api-oss ledger verify --type QrShare`.
10. Generate batch QR codes: `for id in $(api-oss graph query --type Form --format json | jq
    -r '.nodes[].id'); do api-oss share qr --form "$id" --output png > "form-$id.png"; done`.
11. Configure QR defaults in `opencode.json` under `qr.default_size`, `qr.default_error_correction`,
    and `qr.logo_enabled` (default false) for consistent enterprise-wide QR output.
12. For automated sharing scripts, use WS `share_qr` message with
    `{"type": "share_qr", "payload_type": "passaporte", "format": "svg"}`.

## The Moat
- No competitor offers QR-based device pairing for a local-first AI platform. Palantir
  requires manual configuration; OpenAI/Anthropic have no device pairing at all.
- The combination of cryptographic identity (Passaporte ed25519 keys) with visual QR code
  scanning enables secure, zero-touch device onboarding without NFC, Bluetooth, or network
  configuration.
- Time-limited, permission-scoped temporary access QR codes provide granular access control
  that is cryptographically enforced and user-friendly.
- QR share events are ledger-attested — complete audit trail of identity sharing.

## Why Choose API-OSS
A user walks up to a colleague's laptop, shares their Passaporte by scanning a QR code, and
instantly has P2P sync connectivity — no typing IP addresses, no exchanging keys manually.
A field team distributes temporary access to the intelligence graph by displaying a QR code
on a tablet — each scan logged with grantor identity and permissions.

## Competitive Comparison
- **Palantir**: No QR code sharing. Manual configuration and VPN setup required.
- **OpenAI**: Cloud-native, no device pairing needed (account-based).
- **Anthropic**: Cloud-native, no device pairing.
- **Nvidia**: No QR-based sharing for AI platforms.
- **Apple/Google**: AirDrop/Nearby Share for files, not AI platform identity management.

## Cost-Benefit Analysis
Manual device pairing: 5–15 minutes per device. For 500 devices: 40–125 hours of IT time
($3k–$9k at $75/hour). QR code sharing eliminates this entirely. Temporary access QR codes
replace physical visitor badges ($500 badge printer + $50/month stock + 5 min/check-in).
Ledger-attested QR share events replace separate access logging ($2k–$10k/year for SaaS).

Cloud alternatives for identity sharing: Apple AirDrop requires Apple ecosystem ($1,000+
per device), Google Nearby Share requires Google Play Services (no offline mode), and
both are limited to file sharing — not cryptographically signed identity exchange with
permission scoping. Palantir has no QR-based identity sharing at any price tier —
integrating a separate identity management system like Okta ($2/user/month) with custom
QR code generation would cost $12k/year for 500 users plus development time ($20k–$50k).
API-OSS QR sharing is free and built-in. The ephemeral access QR codes eliminate the need
for temporary VPN accounts ($10/user/month for a 7-day account = $70 per temporary user)
and the associated provisioning/deprovisioning IT labor (15 min per user at $18.75/incident).
For a facility with 1,000 temporary visitors per year, API-OSS QR access saves
approximately $12,000 annually in VPN account costs and 250 hours of IT time.

## Applications
- **Consumer**: Share Passaporte identity between laptop and phone by scanning QR code.
- **Government / Defense**: Secure one-time access tokens via QR, full audit trail.
- **Enterprise**: Onboard new team members by scanning QR from their screen. Contractor
  access with automatic expiry.

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com