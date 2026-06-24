---
title: "CONFIGURATION — FREQUENTLY ASKED QUESTIONS"
sidebar_position: 3
description: "The default configuration file is `gateway-config.json` in the same directory as the binary. Use the `-c` flag to specify a custom path: `api-oss -c /path/to/my-config.json`."
tags: [faq]
---

# CONFIGURATION — FREQUENTLY ASKED QUESTIONS

## Where is the configuration file?

The default configuration file is `gateway-config.json` in the same directory as the binary. Use the `-c` flag to specify a custom path: `api-oss -c /path/to/my-config.json`.

## What is the config file format?

JSON with sections for `gateway`, `model`, `user`, `ledger`, `tools`, `tls`, `rlhf`, `rag`, `contradiction_engine`, `finetune`, `video_generation`, `image_generation`, `voice`, `bridge`, `sync`, and `data_dir`.

## Can I use environment variables instead of the config file?

Certain settings can be overridden with environment variables. See the configuration file reference at docs/enterprise/11-configuration-file-reference.md for the full list.

## How do I change the port?

Edit `gateway.ws_port` and `gateway.ui_port` in the config file. Defaults are 3030 (WebSocket) and 8081 (UI). Restart the gateway after changing.

## How do I change the model?

Edit `model.model_path` in the config file to point to a different GGUF file. Or use the CLI: `api-oss config set model_path ./data/models/my-model.gguf`. The new model loads on the next request.

## How do I change the data directory?

Set `data_dir` in the config file to an absolute or relative path. All ledger, graph, and runtime data will be stored there. Migrate existing data manually if changing an existing installation.

## How do I enable HTTPS/TLS?

Set `tls.enabled` to `true` and provide your certificate and key files. The gateway will serve the UI and WebSocket over TLS on the port specified by `tls.port`.

## How do I reset to factory defaults?

Run `api-oss doctor --reset` (creates a backup first) or delete `gateway-config.json` and let the gateway create a fresh one on next start.

## The config file has a JSON error — how do I find it?

Run the JSON through a validator: `python -m json.tool gateway-config.json`. The error message will point to the exact line and column.

## See Also

Related FAQ, support, and troubleshooting documentation.

- [FAQ Index](../faq/01-general.md)
- [Support Guide](../support/01-getting-help.md)
- [Troubleshooting](../troubleshooting/01-app-wont-start.md)
- [User Manual](../user-manual/01-getting-started.md)
