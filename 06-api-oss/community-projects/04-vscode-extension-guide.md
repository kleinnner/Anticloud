---
title: "apioss-vscode Extension"
sidebar_position: 4
description: "VS Code extension for managing API-OSS."
tags: [community-projects]
---

# apioss-vscode Extension

## Overview

VS Code extension for managing API-OSS.

## Features

```yaml
- Gateway status in status bar
- Route management
- API key management
- Log viewer
- Config file syntax highlighting
- Snippets for config.yml
```

## Installation

```bash
code --install-extension community.apioss-vscode
```

## Commands

```text
API-OSS: Show Status      - View gateway health
API-OSS: List Routes      - Browse configured routes
API-OSS: Create Key       - Generate new API key
API-OSS: View Logs        - Stream gateway logs
API-OSS: Reload Config    - Reload gateway config
```

## Configuration

```json
{
  "apioss.endpoint": "http://localhost:8080",
  "apioss.apiKey": "ak-...",
  "apioss.refreshInterval": 30
}
```

## Next

- [Community Projects Index](10-community-projects-index.md)

## See Also

Related community projects and development documentation.

- [Community Projects](../community-projects/01-community-projects-overview.md)
- [Community Overview](../community/01-building-community.md)
- [Contributing Guide](../contributing/01-contributing-overview.md)
- [Plugin Development](../plugins/01-plugins-overview.md)
