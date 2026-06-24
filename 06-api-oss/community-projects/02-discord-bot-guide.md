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
