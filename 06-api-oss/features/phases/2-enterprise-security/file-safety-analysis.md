---
title: "File Safety Analysis"
sidebar_position: 99
description: "Hash-based file reputation analysis that checks documents against"
tags: [features]
---

# File Safety Analysis

## What It Does
Hash-based file reputation analysis that checks documents against
known-safe and
known-malicious hash databases before ingestion.
Integrates directly into the document ingestion pipeline — every file is
verified before
any content is parsed or stored, preventing malicious document ingestion.
## How It Works
File safety analysis is implemented in the Rust module
`ai-oss-gateway/src/file_safety.rs`.
When a file is submitted for ingestion — either via the HTTP UI on port
8081 or
programmatically via WebSocket to port 3030 — the ingestion pipeline
first computes the
file's SHA-256 and SHA-512 hashes before any content parsing begins.
The hashes are looked up in a local SQLite database (`data/graph.db`) that
stores known
file reputations imported from external threat intelligence feeds
(VirusTotal, AbuseIPDB,
custom blocklists/allowlists).
The database supports three reputation categories: known-safe (hash is
trusted — file is
allowed with no further checks), known-malicious (hash is known to be
malware or
containing prohibited content — file is rejected immediately), and
unknown (hash is not
in the database — file is allowed but flagged for review).
The hash check runs before any content parsing, before the file is written
to storage, and
before any AI model inference.
This prevents malicious files from ever being processed by the
Qwen2-VL-2B-Instruct-Q4_K_M.gguf model running on CUDA.
For air-gapped deployments, the hash database is updated via signed
reputation update
packages on portable media — the database is imported from the threat
intelligence feeds
on a connected workstation and transferred to the air-gapped system via
secure media.
The CLI (`api-oss file-safety check`, `api-oss file-safety reputation
--hash`, `api-oss
file-safety db-update`) provides terminal access as part of 87 CLI commands
across 9
subcommand groups (auth, service, sync, backup, etc.).
The HTTP UI renders the `FileSafetyView` with file upload monitoring, hash
database
statistics, and reputation query interface.
All file safety checks are recorded in the immutable ledger at
`data/ledger/` in `.aioss`
format with cryptographic chaining.
Configuration is driven by `opencode.json` — including configurable
action on unknown
hash (allow, flag, or block).
The gateway runs as a single binary via `api-oss start`, fully air-gapped.
## How to Operate
1.
**Check a file**: Upload a file via `https://localhost:8081/files/safety` or use the CLI: `api-oss file-safety check --file document.pdf`.
The system computes hashes and checks the local database.
2.
**Query reputation**: `api-oss file-safety reputation --hash <sha256>` looks up a specific hash in the local database.
3.
**Import threat intelligence**: On a connected workstation, download threat feeds and generate a signed update package.
Transfer to the air-gapped system on secure media and run `api-oss
file-safety db-update
--package threat-feed-2025-06.sig`.
4.
**Review flagged files**: The `FileSafetyView` shows files with unknown reputation that were flagged for manual review.
5.
**Add custom allowlist/blocklist**: `api-oss file-safety reputation set --hash <sha256> --status known-safe` or `--status known-malicious`.
6.
**Configure unknown action**: In `opencode.json`, set `file_safety.on_unknown: "block"` to reject all files with unknown reputation.
7.
**Audit**: Check `data/ledger/` for `.aioss` entries recording every file safety check with its result.
## The Moat
- **Pre-ingestion, pre-parse, pre-inference**: Hash verification runs before any content is parsed, stored, or processed by the AI model.
Malicious files are stopped before they can exploit any vulnerability in
the parsing or
model pipeline.
- **Local hash database with air-gapped updates**: The reputation database is local to the instance.
Updates arrive on signed portable media — no cloud dependency for threat
intelligence.
- **Dual hash (SHA-256 + SHA-512)**: Using both hash algorithms provides redundancy against cryptographic weaknesses in either algorithm.
- **Three-tier reputation model**: Known-safe, known-malicious, and unknown — with configurable action on unknown files.
This balances security and operational flexibility.
- **Immutable audit trail**: Every file safety check is recorded in `data/ledger/` with cryptographic proof.
An auditor can verify that every ingested file passed safety checks.
- **Integrated into the ingestion pipeline**: No separate file scanning infrastructure.
The safety check is part of the same Rust binary that handles everything
else.
## Why Choose API-OSS
OpenAI performs no file safety analysis on uploaded files — users upload
content
directly to the API without any pre-ingestion scanning.
Palantir offers file scanning but requires cloud-based content inspection.
Snowflake has no document ingestion pipeline.
API-OSS provides hash-based file reputation analysis as a built-in feature
of the
ingestion pipeline — every file is checked against known-threat databases
before any
processing occurs.
For organizations that ingest documents from external sources — partner
submissions,
public submissions, email attachments — file safety analysis prevents
malicious content
from ever reaching the AI system.
## Competitive Comparison
- **OpenAI**: No file safety analysis — files are processed as submitted.
Users must implement their own pre-scanning.
- **Palantir**: File scanning available but cloud-dependent — requires data to leave your network for content inspection.
- **Snowflake**: No document ingestion pipeline — no file safety capability.
- **Anthropic**: No file ingestion or safety analysis.
## Cost-Benefit Analysis
File scanning infrastructure (ClamAV integration, custom hash database,
threat feed
subscriptions) costs $10k-$50k/year to build and maintain.
For air-gapped deployments, the cost increases significantly because threat
feeds must be
manually imported.
API-OSS provides built-in file safety analysis at zero additional cost.
Time savings: 1-2 months of scanning pipeline development eliminated.
Risk reduction: pre-ingestion scanning prevents malicious files from
reaching the AI model
— a single ransomware-laced document ingested into an AI system could
compromise the
entire deployment.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Prevents malicious document ingestion in classified systems — documents from external sources (partner intelligence, field reports, public sources) are hash-checked against known threat databases before any content reaches the classified processing pipeline.
- **Enterprise**: Safe ingestion of external partner documents and attachments — a financial services firm receiving client documents for AI analysis checks each file against threat databases before processing, preventing document-based malware from reaching the trading systems.

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