---
title: "FRONTEND / UI — FREQUENTLY ASKED QUESTIONS"
sidebar_position: 5
description: "Clear your browser cache (hard reload: Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac). If the issue persists, open the browser's developer console (F12) and check for WebSocket connection errors. Ensure"
tags: [faq]
---

# FRONTEND / UI — FREQUENTLY ASKED QUESTIONS

## The UI shows a blank screen. What do I do?

Clear your browser cache (hard reload: Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac). If the issue persists, open the browser's developer console (F12) and check for WebSocket connection errors. Ensure the gateway is running and accessible on the configured `ui_port`.

## The UI says "WebSocket disconnected" or "Connection lost".

The gateway may have stopped, the network may be down, or the port may be blocked. Check that `api-oss` is running, that nothing else is using the WebSocket port (default 3030), and that your firewall allows local connections. The UI will auto-reconnect when the gateway is available again.

## What browsers are supported?

Chrome, Firefox, Edge, and Safari (current and two previous major versions). Internet Explorer is not supported.

## The graph canvas is not rendering.

Ensure your browser supports WebGL. On Firefox, check `about:support` for WebGL being blocked. On Chrome, check `chrome://gpu`. If WebGL is disabled in the browser, the canvas will fall back to a static view.

## How do I register a new account?

There is no account system. API-SOS is a single-user local application. The user name in the config file (`user.name`) is displayed in the UI but does not control access.

## Can I change the theme?

Yes. Set `user.theme` in the config to `dark` or `light` and restart the gateway. The UI will load with the selected theme.

## Can I use API-SOS from my phone?

The frontend is a responsive single-page application that works in mobile browsers. There is no native mobile app, though the mobile/ directory contains a React Native wrapper project.

## The UI is slow / laggy.

Check the browser's developer tools (Performance tab) for JavaScript bottlenecks. Large conversation histories or graph visualisations with thousands of nodes may strain the browser. Archive old conversations to improve performance.

## How do I report a frontend bug?

Open the browser developer console (F12), reproduce the issue, and include the console output in your bug report. See docs/support/02-bug-report-template.md.

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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

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
