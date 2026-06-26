---
title: "Migration Commands Reference"
sidebar_position: 17
description: "Migrate from other API providers and between API-OSS versions."
tags: [cli]
---

# Migration Commands Reference

## Overview

Migrate from other API providers and between API-OSS versions.

## apioss migrate

```bash
apioss migrate <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `from-openai` | Migrate from OpenAI |
| `from-anthropic` | Migrate from Anthropic |
| `from-azure` | Migrate from Azure OpenAI |
| `from-vertex` | Migrate from GCP Vertex AI |
| `from-bedrock` | Migrate from AWS Bedrock |
| `from-huggingface` | Migrate from Hugging Face |
| `from-ollama` | Migrate from Ollama |
| `config` | Migrate config between versions |

### apioss migrate from-openai

```bash
apioss migrate from-openai [flags]

Flags:
  --api-key string       OpenAI API key
  --org-id string        OpenAI organization ID
  --output string        Output config file
  --dry-run              Preview without applying

Examples:
  apioss migrate from-openai --api-key sk-... -o config.yml
  apioss migrate from-openai --api-key sk-... --dry-run
```

### apioss migrate config

```bash
apioss migrate config <from-version> <input> [flags]

Flags:
  -o, --output string   Output file
  --validate            Validate after migration

Examples:
  apioss migrate config v1-to-v2 old-config.yml -o new-config.yml
  apioss migrate config v2-to-v3 config.yml -o config-v3.yml
```

## Next

- [18 Diagnose Commands](18-diagnose-commands.md)

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
