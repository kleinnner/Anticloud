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
