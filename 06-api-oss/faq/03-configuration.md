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

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
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
