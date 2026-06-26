---
title: "Browser Extension"
sidebar_position: 99
description: "A Chrome (Manifest v3) and Firefox (Manifest v2) browser extension that provides right-click"
tags: [features]
---

# Browser Extension

## What It Does
A Chrome (Manifest v3) and Firefox (Manifest v2) browser extension that provides right-click
"Send to API-OSS" functionality, web page content ingestion into the knowledge graph, and
a sidebar for sovereign AI interaction. Works entirely through the local API-OSS instance
on port 3030 — no cloud servers are ever contacted. All AI processing runs on the local
machine using the Qwen2-VL-2B-Instruct-Q4_K_M.gguf model with CUDA backend.

## How It Works
The extension directory contains a manifest file (v3 for Chrome, v2 for Firefox), a
background service worker, a content script, and a sidebar popup. When the user right-clicks
on any page, the content script extracts the page content using Readability for article
extraction and Open Graph / schema.org metadata parsing for structured data. It sends the
extracted content via the background service worker over WebSocket to the local API-OSS
instance at `ws://localhost:3030`. The service worker maintains a persistent WebSocket
connection with automatic reconnection using jittered exponential backoff (1s, 2s, 4s, ...
60s max), part of the 810 total protocol messages. The sidebar popup provides a chat
interface that sends queries to the local model via the same WS connection — no data ever
leaves the local machine. The "Add to knowledge graph" feature parses structured data from
the page (products, events, people, organizations) and creates typed graph nodes with
appropriate edges. The extension stores connection configuration (host, port) in
chrome.storage.local — by default it connects to localhost:3030. The sidebar also provides
graph query capabilities, allowing the user to search their local knowledge graph while
browsing. All image data from pages can be analyzed by the vision-capable Qwen2.5-VL model
locally. The extension supports offline operation: if the API-OSS instance is not running,
the extension shows a "Connect" button and attempts periodic reconnection automatically.
The service worker handles disconnection gracefully, caching pending operations for retry.
The WebSocket connection uses heartbeat at 30-second intervals with jittered exponential
backoff (1s, 2s, 4s, ... 60s max) and max_retries of 20 before giving up. All messages
use JSON serialization via serde tagged enums with the `type` field discriminator matching
the Rust protocol's `#[serde(tag = "type")]` attribute for deterministic message routing.

## How to Operate
1. Ensure API-OSS is running: `api-oss start` or launch the binary. The WebSocket server is
   on port 3030, and the HTTP UI is served on port 8081.
2. Install the extension from the Chrome Web Store / Firefox Add-ons, or load it unpacked
   from the extension development directory.
3. Click the extension icon in the toolbar — the sidebar opens showing the chat interface.
4. Right-click any page and select "Summarize page with API-OSS" — the page content is sent
   to the local model and summarized without any cloud contact or data exfiltration.
5. Right-click and select "Add to knowledge graph" — structured data from the page is parsed
   and added as typed graph nodes with edges.
6. Right-click and select "Ask about this page" — the sidebar opens with page context
   pre-loaded for question answering.
7. Use the sidebar search bar to query your knowledge graph: equivalent to
   `api-oss graph query` through the WS protocol.
8. Pin the extension to see a badge indicator showing connection status (green = connected,
   red = disconnected, yellow = connecting).
9. Configure the connection in the extension options — set custom host/port if running
    API-OSS on a different machine on the LAN.
10. Keyboard shortcuts: Alt+Shift+A opens the sidebar, Alt+Shift+S sends the current page
    to the knowledge graph — configurable in `chrome://extensions/shortcuts`.
11. For P2P-synced graphs, the extension queries the local gateway which syncs with peers
     automatically — you query all your devices' data from any machine.
12. To customize the WebSocket reconnect behavior, set `max_backoff: 30` and
     `max_retries: 20` in the extension options — the service worker uses these values to
     control reconnection attempts with jittered exponential backoff starting at 1 second.

## The Moat
- No competitor offers a browser extension that connects to a local-first AI decision
  engine — ChatGPT, Gemini, and Claude extensions all require cloud API keys and send page
  content to cloud servers for processing.
- All page content processed by the extension stays on the local machine — not uploaded to
  OpenAI, Google, or Anthropic servers. True privacy-preserving AI browsing with local
  inference on a model you control.
- The extension can operate fully offline — on an airplane, in an air-gapped facility, or
  in areas with no internet connectivity. No competitor's AI extension can make this claim.
- Deep integration with the knowledge graph: page content is not just summarized, it is
  structured, typed, and persisted as navigable graph nodes with full metadata.

## Why Choose API-OSS
A journalist researching a sensitive topic can use the browser extension to collect,
summarize, and organize web pages into their local knowledge graph without any data being
sent to cloud servers — protecting sources and story confidentiality. A defense analyst can
ingest intelligence reports from a classified web portal directly into the air-gapped graph
database with a single right-click. A knowledge worker can build a personal research
database across thousands of web pages, all searchable and interconnected, all running on
their laptop with no cloud dependency whatsoever.

## Competitive Comparison
- **OpenAI**: ChatGPT extension exists but sends all page content to OpenAI servers for
  processing. Requires ChatGPT Plus ($20/month). No offline mode, no privacy guarantee.
- **Anthropic**: Claude has no browser extension. No web page ingestion capability.
- **Google**: Gemini extension exists but is cloud-only, sends data to Google servers.
  Requires Google account. No offline mode.
- **Palantir**: No browser extension exists. No sovereign AI browsing capability.

## Cost-Benefit Analysis
OpenAI ChatGPT Plus costs $20/month per user. For a team of 50 researchers analyzing
sensitive web content, that is $1,000/month plus the privacy cost of sending all research
data to OpenAI servers. API-OSS extension costs $0 — a one-time $2,000 GPU workstation
serves the entire team with local inference. The time savings: right-click summarization
replaces 5–10 minutes of manual note-taking per page, saving approximately 2 hours/day per
researcher. At $100/hour fully loaded, that is $200/day saved per researcher — or $50,000
per year per researcher. The privacy benefit of zero data exfiltration to cloud AI providers
is unquantifiable for sensitive or classified work.

Google's Gemini extension and Anthropic's Claude have no browser extension — users must
copy-paste page content manually (5 minutes per page) or use clunky bookmarklets. A
researcher analyzing 20 pages/day saves 100 minutes daily using API-OSS right-click
workflow. For compliance teams, sending proprietary data to OpenAI/Google servers for
summarization may violate data protection regulations (GDPR fines up to 4% of global
revenue, or $20M for a $500M company). API-OSS eliminates this regulatory risk entirely.

## Applications
- **Consumer**: Privacy-preserving AI browsing companion. Build a personal knowledge base
  from web research without sending browsing data to big tech companies.
- **Government / Defense**: Analyze web content from classified networks without exfiltrating
  to cloud services. All processing stays within the secured environment with fully
  air-gapped operation.
- **Enterprise**: Secure research assistant that never sends proprietary data to third
  parties. Competitive intelligence gathering with zero data leakage risk and legal/compliance
  research with absolute confidentiality guarantees.

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com