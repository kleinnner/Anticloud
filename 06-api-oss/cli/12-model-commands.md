---
title: "Model Commands Reference"
sidebar_position: 12
description: "Manage AI models via CLI."
tags: [cli]
---

# Model Commands Reference

## Overview

Manage AI models via CLI.

## apioss models

```bash
apioss models <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `list` | List available models |
| `add` | Register a new model |
| `remove` | Remove a model |
| `update` | Update model config |
| `test` | Test a model endpoint |

### apioss models list

```bash
apioss models list [flags]

Flags:
  -j, --json     JSON output
  -f, --filter   Filter by provider

Examples:
  apioss models list
  apioss models list --json
  apioss models list --filter openai
```

### apioss models add

```bash
apioss models add <name> <provider> [flags]

Flags:
      --model-id string     Provider model ID
      --capability strings  Model capabilities (chat, embeddings, image)
      --context int         Context window size
      --pricing-input float Input token price
      --pricing-output float Output token price

Examples:
  apioss models add gpt-4 openai --model-id gpt-4-turbo
  apioss models add claude-3 anthropic --capability chat
  apioss models add text-embedding-3 openai --capability embeddings
```

### apioss models test

```bash
apioss models test <name> [flags]

Flags:
      --prompt string   Test prompt

Examples:
  apioss models test gpt-4 --prompt "Hello"
```

## Next

- [13 Log Commands](13-log-commands.md)

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

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
