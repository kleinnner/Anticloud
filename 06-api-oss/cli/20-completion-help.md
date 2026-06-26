---
title: "Shell Completion & Help"
sidebar_position: 20
description: "Shell completion, help system, and usage tips."
tags: [cli]
---

# Shell Completion & Help

## Overview

Shell completion, help system, and usage tips.

## Shell Completion

### Bash

```bash
# Generate completion
apioss completion bash > /etc/bash_completion.d/apioss
source /etc/bash_completion.d/apioss

# Or add to .bashrc
echo 'source <(apioss completion bash)' >> ~/.bashrc
```

### Zsh

```bash
# Generate completion
apioss completion zsh > /usr/local/share/zsh/site-functions/_apioss
autoload -U compinit && compinit

# Or add to .zshrc
echo 'source <(apioss completion zsh)' >> ~/.zshrc
```

### Fish

```bash
apioss completion fish > ~/.config/fish/completions/apioss.fish
```

### PowerShell

```powershell
apioss completion powershell | Out-String | Invoke-Expression

# Add to profile
Add-Content $PROFILE "`napioss completion powershell | Out-String | Invoke-Expression"
```

## Help System

```bash
# Top-level help
apioss --help
apioss -h

# Command help
apioss config --help
apioss routes add --help

# Subcommand help
apioss license activate --help
```

## Man Page

```bash
# Generate man page
apioss man > /usr/local/share/man/man1/apioss.1
apropos apioss
```

## Usage Tips

```bash
# Short flags
apioss start -d              # Detach
apioss status -j             # JSON output
apioss logs --tail -l error  # Error stream
apioss config set gateway.port 80  # Quick update

# Piping
apioss keys list --json | jq '.keys[].name'
apioss logs --since 1h --json | grep error
apioss backup list --json | jq -r '.backups[0].id' | xargs apioss restore
```

## Next

- [21 Complete Reference](21-complete-reference.md)

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com