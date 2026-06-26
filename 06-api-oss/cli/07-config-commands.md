---
title: "Config Commands Reference"
sidebar_position: 7
description: "Manage gateway configuration via CLI."
tags: [cli]
---

# Config Commands Reference

## Overview

Manage gateway configuration via CLI.

## apioss config

```bash
apioss config <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `init` | Create default config file |
| `validate` | Validate config file |
| `show` | Display current config |
| `set` | Set a config value |
| `get` | Get a config value |
| `migrate` | Migrate config between versions |
| `diff` | Show differences between configs |
| `export` | Export config with resolved env vars |
| `encrypt` | Encrypt sensitive config values |

### apioss config init

```bash
apioss config init [flags]

Flags:
  -o, --output string   Output file (default "config.yml")
      --v3              Generate v3 config format

Examples:
  apioss config init
  apioss config init -o production.yml
  apioss config init --v3
```

### apioss config validate

```bash
apioss config validate [file]

Examples:
  apioss config validate
  apioss config validate config.yml
  apioss config validate --v2 config-v2.yml
```

### apioss config set

```bash
apioss config set <key> <value>

Examples:
  apioss config set gateway.port 8080
  apioss config set routes[0].upstream https://api.openai.com
  apioss config set --file config.yml gateway.host 0.0.0.0
```

### apioss config migrate

```bash
apioss config migrate <from-version> <input> [flags]

Flags:
  -o, --output string   Output file

Examples:
  apioss config migrate v1-to-v2 config.yml -o config-v2.yml
  apioss config migrate v2-to-v3 config-v2.yml -o config-v3.yml
```

### apioss config encrypt

```bash
apioss config encrypt <value>

Examples:
  apioss config encrypt "my-api-key"
  # Output: encrypted:aes256gcm:base64:abc123...
```

## Next

- [08 Route Commands](08-route-commands.md)

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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