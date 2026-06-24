---
title: "API Reference 30: CLI API (Programmatic Use)"
sidebar_position: 30
description: "The CLI can be used programmatically for scripting and automation."
tags: [api]
---

# API Reference 30: CLI API (Programmatic Use)

## Overview

The CLI can be used programmatically for scripting and automation.

## Exit Codes

| Code | Meaning | Recovery |
|------|---------|----------|
| 0 | Success | — |
| 1 | General error | Check error message |
| 2 | Configuration error | Validate config file |
| 3 | Model error | Check model path/integrity |
| 4 | Graph error | Run `ai-oss doctor` |
| 5 | Ledger error | Check disk space/permissions |
| 6 | Port in use | Use different port or kill process |
| 7 | Permission denied | Run with appropriate permissions |
| 8 | LlamaFile crash | Restart, check model compatibility |
| 9 | Internal error | Report bug |
| 10 | Signal interrupt | Normal shutdown |

## JSON Output

All commands support `--json` flag for machine-parsable output:

```bash
# Query as JSON
ai-oss query "Summarize the contract" --json > result.json

# Graph search as JSON
ai-oss graph search "liability cap" --json --limit 50

# Model list as JSON
ai-oss model list --json | jq '.[] | select(.status == "loaded")'

# Config as JSON
ai-oss config list --json | jq '.ledger'
```

## Non-Interactive Mode

```bash
# One-shot query (no interactive shell)
ai-oss query "What is the liability cap?"

# Pipe input
cat document.txt | ai-oss query "Summarize this" --stream

# Batch processing
for file in ./contracts/*.pdf; do
  ai-oss ingest "$file" --codex project-alpha
done
```

## Automation Examples

```bash
# Backup script
#!/bin/bash
ai-oss graph export json > "backup-$(date +%Y%m%d).json"
ai-oss config list --json > "config-$(date +%Y%m%d).json"

# Health check for monitoring
if ai-oss doctor --json | jq -e '.status == "healthy"' > /dev/null; then
  echo "AI-OSS is healthy"
else
  echo "AI-OSS needs attention"
  ai-oss doctor --fix
fi

# Automated ingestion
ai-oss ingest /data/inbox/ --recursive --watch --json
```

## CI/CD Integration

```yaml
# GitHub Actions
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install AI-OSS
        run: |
          curl -L https://github.com/ai-oss/releases/download/v0.1.0/ai-oss-linux -o ai-oss
          chmod +x ai-oss
      - name: Validate config
        run: |
          ai-oss doctor --json
      - name: Test query
        run: |
          echo "Hello" | ai-oss query "Respond with just 'OK'" --json
```

## Python Subprocess

```python
import subprocess
import json

def aioss_query(text: str) -> dict:
    result = subprocess.run(
        ["ai-oss", "query", text, "--json"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        raise Exception(f"CLI error: {result.stderr}")
    return json.loads(result.stdout)

def aioss_ingest(path: str, codex: str = None):
    cmd = ["ai-oss", "ingest", path, "--json"]
    if codex:
        cmd.extend(["--codex", codex])
    result = subprocess.run(cmd, capture_output=True, text=True)
    return json.loads(result.stdout)
```

## Shell Completion (Scripting)

```bash
# Generate completion for custom scripts
eval "$(ai-oss completion bash)"
complete -F _aioss my-custom-script
```

## CLI Logging for Automation

```bash
# Structured logging for log aggregation
LOG_FORMAT=json AIOSS_LOG_LEVEL=info ai-oss start --headless

# Pipe to log aggregator
ai-oss start --headless 2>&1 | tee -a /var/log/ai-oss.log
```

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)
