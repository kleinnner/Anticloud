---
title: "Server Commands Reference"
sidebar_position: 6
description: "Start, stop, and manage the API-OSS gateway server."
tags: [cli]
---

# Server Commands Reference

## Overview

Start, stop, and manage the API-OSS gateway server.

## apioss start

Start the gateway server.

```bash
apioss start [flags]

Flags:
  -c, --config string    Path to config file (default "config.yml")
  -p, --port int         HTTP port (default 8080)
      --admin-port int   Admin API port (default 9090)
  -v, --verbose          Verbose logging
  -d, --detach           Run in background
      --pidfile string   PID file path

Examples:
  apioss start
  apioss start -c production.yml -p 80
  apioss start --detach
  apioss start -v --admin-port 9091
```

## apioss stop

Gracefully stop the gateway.

```bash
apioss stop [flags]

Flags:
  -t, --timeout duration   Grace period (default 30s)
  -f, --force              Force kill

Examples:
  apioss stop
  apioss stop --timeout 60s
  apioss stop --force
```

## apioss restart

Restart the gateway.

```bash
apioss restart [flags]

Flags:
  -t, --timeout duration   Grace period (default 30s)
  -c, --config string      Config file path

Examples:
  apioss restart
  apioss restart -c new-config.yml
```

## apioss status

Check gateway status.

```bash
apioss status [flags]

Flags:
  -j, --json   JSON output

Examples:
  apioss status
  apioss status --json
```

## apioss reload

Reload configuration without restart.

```bash
apioss reload [flags]

Flags:
  -c, --config string   Config file path

Examples:
  apioss reload
  apioss reload -c updated.yml
```

## Next

- [07 Config Commands](07-config-commands.md)

## See Also

Related CLI and API reference documentation.

- [CLI Getting Started](../cli/01-getting-started.md)
- [API Reference](../api-reference/01-overview.md)
- [Admin Commands](../cli/15-admin-commands.md)
- [Complete Reference](../cli/21-complete-reference.md)
