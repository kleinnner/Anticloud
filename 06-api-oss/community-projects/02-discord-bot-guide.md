---
title: "apioss-discord-bot"
sidebar_position: 2
description: "A Discord bot that uses API-OSS as its AI backend."
tags: [community-projects]
---

# apioss-discord-bot

## Overview

A Discord bot that uses API-OSS as its AI backend.

## Features

```yaml
- Chat with AI via Discord
- Multi-model support
- Conversation history
- Rate limiting per user
- Admin commands
```

## Quick Start

```bash
git clone https://github.com/community/apioss-discord-bot
cd apioss-discord-bot
cp .env.example .env
# Edit .env with your tokens
docker compose up -d
```

## Configuration

```env
DISCORD_TOKEN=your-bot-token
APIOSS_URL=http://apioss:8080
APIOSS_KEY=ak-...
DEFAULT_MODEL=gpt-4
RATE_LIMIT=10  # Messages per minute
```

## Commands

```text
/chat <message> - Chat with AI
/model <name>   - Switch model
/reset          - Reset conversation
/stats          - Show usage stats
/help           - Show help
```

## Next

- [apioss-terraform Guide](03-terraform-guide.md)

## See Also

Related community projects and development documentation.

- [Community Projects](../community-projects/01-community-projects-overview.md)
- [Community Overview](../community/01-building-community.md)
- [Contributing Guide](../contributing/01-contributing-overview.md)
- [Plugin Development](../plugins/01-plugins-overview.md)

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
