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
