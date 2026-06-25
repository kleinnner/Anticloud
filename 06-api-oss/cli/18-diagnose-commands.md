---
title: "Diagnose & Troubleshooting Commands"
sidebar_position: 18
description: "Diagnose and troubleshoot gateway issues via CLI."
tags: [cli]
---

# Diagnose & Troubleshooting Commands

## Overview

Diagnose and troubleshoot gateway issues via CLI.

## apioss diagnose

Run comprehensive diagnostic checks.

```bash
apioss diagnose [flags]

Flags:
  --check strings     Specific checks (db, redis, routes, plugins, tls, dns)
  --verbose           Verbose output
  --output string     Output format (text, json, html)
  --since duration    Check metrics since

Examples:
  apioss diagnose
  apioss diagnose --check db,redis
  apioss diagnose --verbose
  apioss diagnose --output json
```

### Check Types

| Check | What it verifies |
|---|---|
| `db` | Database connectivity, migrations, connection pool |
| `redis` | Redis connectivity, memory, keyspace |
| `routes` | Route configuration validity |
| `plugins` | Plugin health and configuration |
| `tls` | Certificate expiry and validity |
| `dns` | DNS resolution for upstreams |
| `ports` | Port availability |

### Output

```json
{
  "status": "degraded",
  "timestamp": "2025-05-31T12:00:00Z",
  "checks": {
    "db": { "status": "ok", "latency_ms": 2 },
    "redis": { "status": "ok", "latency_ms": 1 },
    "routes": { "status": "ok", "count": 15 },
    "tls": {
      "status": "warning",
      "message": "Certificate expires in 14 days"
    }
  },
  "recommendations": [
    "Renew TLS certificate for api.example.com"
  ]
}
```

## apioss verify

Verify system integrity.

```bash
apioss verify [flags]

Flags:
  --checksum     Verify file checksums
  --config       Verify config integrity
  --db           Verify database integrity

Examples:
  apioss verify
  apioss verify --db
  apioss verify --config
```

## Next

- [19 License Commands](19-license-commands.md)

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
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
