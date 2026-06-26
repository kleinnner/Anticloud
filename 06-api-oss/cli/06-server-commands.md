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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com