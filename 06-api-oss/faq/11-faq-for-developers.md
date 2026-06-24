---
title: "FAQ for Developers"
sidebar_position: 11
description: "Q: Can I use the OpenAI Python SDK with API-OSS?"
tags: [faq]
---

# FAQ for Developers

## SDK

```text
Q: Can I use the OpenAI Python SDK with API-OSS?
A: Yes, just change the base_url to your API-OSS endpoint.

Q: Do you have a Rust SDK?
A: Yes, available at github.com/example/apioss-sdk-rs.

Q: Is there a TypeScript SDK?
A: Yes, available on npm as `apioss-sdk`.
```

## API

```text
Q: What API format do you support?
A: OpenAI-compatible API format.

Q: Do you support streaming?
A: Yes, both SSE and WebSocket streaming.

Q: What about function calling?
A: Fully supported via OpenAI-compatible format.
```

## Plugins

```text
Q: What languages can I write plugins in?
A: WASM (primary), JavaScript (legacy).

Q: Can I use external libraries in plugins?
A: WASM plugins can link static libraries.

Q: How do I debug plugins?
A: Use `apioss plugin debug <name>`.
```

## Next

- [FAQ for Enterprise](12-faq-for-enterprise.md)

## See Also

Related FAQ, support, and troubleshooting documentation.

- [FAQ Index](../faq/01-general.md)
- [Support Guide](../support/01-getting-help.md)
- [Troubleshooting](../troubleshooting/01-app-wont-start.md)
- [User Manual](../user-manual/01-getting-started.md)
