---
title: "License Commands Reference"
sidebar_position: 19
description: "Manage API-OSS licenses via CLI."
tags: [cli]
---

# License Commands Reference

## Overview

Manage API-OSS licenses via CLI.

## apioss license

```bash
apioss license <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `show` | Display license info |
| `validate` | Validate license key |
| `activate` | Activate a license |
| `deactivate` | Deactivate current license |
| `renew` | Refresh offline license |

### apioss license show

```bash
apioss license show [flags]

Flags:
  -j, --json     JSON output

Examples:
  apioss license show
  apioss license show --json
  # Licensed to: ACME Corp
  # Type: enterprise
  # Expires: 2026-05-31
  # Features: all
```

### apioss license validate

```bash
apioss license validate [flags]

Flags:
  -k, --key string   License key to validate

Examples:
  apioss license validate
  apioss license validate --key "OSS-XXXX-YYYY-ZZZZ"
```

### apioss license activate

```bash
apioss license activate <key> [flags]

Flags:
  --offline       Activate in air-gapped mode
  --token string  Offline activation token

Examples:
  apioss license activate "OSS-XXXX-YYYY-ZZZZ"
  apioss license activate "OSS-XXXX" --offline --token "abc123"
```

## Next

- [20 Completion & Help](20-completion-help.md)

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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