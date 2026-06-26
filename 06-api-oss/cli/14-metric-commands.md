---
title: "Metric Commands Reference"
sidebar_position: 14
description: "Query gateway metrics via CLI."
tags: [cli]
---

# Metric Commands Reference

## Overview

Query gateway metrics via CLI.

## apioss metrics

```bash
apioss metrics <subcommand> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| `query` | Query a metric |
| `list` | List available metrics |
| `top` | Show top-N metrics |
| `histogram` | Show latency histogram |
| `health` | Show health metrics |

### apioss metrics query

```bash
apioss metrics query <metric> [flags]

Flags:
  --since duration   Time range start
  --until duration   Time range end
  --interval string  Aggregation interval (1m, 5m, 1h)
  -j, --json         JSON output

Examples:
  apioss metrics query apioss_requests_total --since 1h
  apioss metrics query apioss_request_latency_ms --interval 5m --json
```

### apioss metrics top

```bash
apioss metrics top [flags]

Flags:
  --limit int     Number of results (default 10)
  --metric string Metric to sort by

Examples:
  apioss metrics top --limit 5
  apioss metrics top --metric apioss_errors_total
```

### apioss metrics histogram

```bash
apioss metrics histogram [flags]

Flags:
  --since duration   Time range start
  --bucket string    Bucket boundaries

Examples:
  apioss metrics histogram --since 1h
  # Output:
  # <10ms:  4523
  # 10-50ms: 2341
  # 50-100ms: 567
  # 100ms+:  123
```

## apioss metrics health

```bash
apioss metrics health [flags]

Flags:
  -j, --json   JSON output

Examples:
  apioss metrics health
  # database: ok, redis: ok, uptime: 72h
```

## Next

- [15 Admin Commands](15-admin-commands.md)

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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
