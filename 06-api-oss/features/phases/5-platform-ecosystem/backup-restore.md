---
title: "Backup + Restore"
sidebar_position: 99
description: "Full state backup and restore covering the knowledge graph (graph.db), ledger (signed"
tags: [features]
---

# Backup + Restore

## What It Does
Full state backup and restore covering the knowledge graph (graph.db), ledger (signed
entries), configuration (opencode.json at root and gateway level), and model hashes
(SHA-256 manifest for verifiable re-download). Encrypted backup files use AEAD encryption
(AES-256-GCM or ChaCha20-Poly1305). Supports automated scheduled backups with configurable
retention policies and remote destinations (rsync, SCP, S3-compatible). CLI: `api-oss
backup create`, `backup restore`, `backup list`, `backup schedule`, `backup verify`.
The backup engine supports configurable concurrency with up to 4 parallel compression
streams for large graph databases, and a message queue depth of 100 progress notifications
for real-time streaming to the WebSocket client during long-running backup operations.

## How It Works
The backup system lives in `backup.rs` under `ai-oss-gateway/src/`. When triggered via CLI
or WebSocket message (`backup_create` on port 3030), it creates a tar.gz archive containing:
a JSON dump of the entire graph database (graph.db serialized as typed nodes with all edges
and properties), a JSON dump of the ledger with all Passaporte signatures intact, the active
configuration in TOML format, and a SHA-256 manifest of all downloaded models (enabling
integrity-checked re-download from the configured model source). The archive is encrypted
with AEAD using a key derived from the operator's Passaporte identity — only the same
Passaporte can decrypt and restore. Encryption uses AES-256-GCM on hardware with AES-NI
instructions, falling back to ChaCha20-Poly1305 on ARM (Apple Silicon, Raspberry Pi). The
scheduler runs as a tokio task inside the gateway, waking at configured intervals (default:
daily at 02:00), performing the backup, pruning old backups per retention policy (default:
keep 7 daily, 4 weekly, 12 monthly), and optionally rsync-ing to a remote destination.
The backup verify command decrypts and validates the archive without restoring, checking
checksums and signature chains. Restore is all-or-nothing: the archive is decrypted,
validated, and then graph.db is replaced, the ledger is replayed, config is merged (not
overwritten for sensitive fields), and model hashes are checked against local files.
Missing or corrupted models trigger a download from the local model cache or a re-pull
from the configured model source. The entire process works fully offline with no internet
dependency. All backup operations are integrated with the CLI's 87-command structure and
the web UI on port 8081.

## How to Operate
1. Start the gateway: `api-oss start` or launch the binary directly. The CLI is available
   immediately and connects to the gateway on port 3030.
2. Create an on-demand backup: `api-oss backup create` — the backup file is written to
   `./backups/` by default with a timestamped filename.
3. List existing backups: `api-oss backup list` — shows filename, size, date, and integrity
   status for each backup file.
4. Verify a backup without restoring: `api-oss backup verify --file ./backups/backup.enc`.
5. Schedule recurring backups: `api-oss backup schedule --interval daily --retention 7` or
   edit `opencode.json` under `backup.schedule` with cron expressions.
6. Restore from backup: `api-oss backup restore --file ./backups/backup.enc` — the gateway
   restarts after restore to reload the full state.
7. In the web UI on port 8081, open the Backup/Restore view for a graphical interface with
   schedule configuration, backup file browser, and one-click restore.
8. All WS messages (`backup_create`, `backup_restore`, `backup_list`, `backup_schedule`,
   `backup_progress`) stream progress updates for long-running operations.
9. For remote backup destinations, configure `backup.remote` in `opencode.json` with
    rsync/SCP/S3-compatible target URL and credentials.
10. All backup configuration is persisted in `opencode.json` at root or gateway level and
    restored as part of the backup archive itself.
11. Test backup integrity without restoring: `api-oss backup verify --file ./backups/backup.enc
    --verbose` — decrypts and validates the archive in memory, checks all SHA-256 checksums,
    ledger signature chains, and reports status without writing any files.
12. For automated rotation, set `backup.retention.daily` (default 7), `backup.retention.weekly`
    (default 4), and `backup.retention.monthly` (default 12) in `opencode.json` — old backups
    beyond retention limits are pruned automatically after each scheduled backup run.

## The Moat
- Competitors assume cloud persistence and offer no first-class backup/restore tooling.
  OpenAI, Anthropic, and Google provide no way to export full state for local backup.
- AEAD encryption with Passaporte-derived keys means only the identity that created the
  backup can decrypt and restore it — a cryptographic guarantee, not an ACL.
- The backup format includes ledger signatures, enabling forensic verification: you can
  prove the backed-up state was not tampered with at any point in its history.
- Works fully offline with no cloud dependency — essential for air-gapped and defense
  environments where internet access is not available.
- Scheduled backup with configurable retention is built in, not an add-on service that
  requires additional licensing.

## Why Choose API-OSS
A defense contractor operating in an air-gapped facility needs to guarantee that months of
intelligence analysis data is never lost. API-OSS provides scheduled, encrypted,
integrity-verified backups that can be stored on removable media and restored onto any
compatible hardware — no cloud, no vendor lock-in, no data exfiltration risk. An enterprise
subject to compliance regimes (SOC 2, FedRAMP, ITAR) can point to automated encrypted
backups with ledger-attested integrity as a verifiable control. A consumer running API-OSS
on a home server can schedule daily backups to a NAS with zero configuration.

## Competitive Comparison
- **Palantir**: Backup is through cloud infrastructure, no portable encrypted backup format.
  You cannot take a Palantir backup to another system or restore it independently.
- **OpenAI/Anthropic**: Cloud-only, no user backup capability whatsoever. Your chat history
  and data are at the provider's discretion with no exportable full-state format.
- **Nvidia**: No backup tooling for AI platform deployments.
- **Google**: Vertex AI has no exportable backup format — data is locked in GCP.
- **Snowflake**: Can export data but requires snowflake CLI and SQL, no one-command encrypted
  full-state backup with cryptographic integrity verification.

## Cost-Benefit Analysis
Palantir charges for data egress and storage; backing up 100 GB of graph data from Palantir
Foundry could cost thousands in egress fees. API-OSS backup creates a portable encrypted
archive at zero cost beyond storage media ($10/month for 1 TB NAS). OpenAI charges
$30/month for ChatGPT Plus with zero backup capability — losing chat history is
irrecoverable. An enterprise spending $50k/year on backup solutions for their AI platform
can replace that with a one-time $2,000 GPU workstation running API-OSS. The time cost of
data loss (days of rework, lost intelligence, compliance violations) is eliminated by
automated scheduled backups with cryptographic verification. Retention policy automation
replaces manual backup management, saving approximately 2 hours/month of IT operations
time, worth $3,600/year at a loaded $150/hour rate.
ngrok charges $20/month for tunnels to support remote backup destinations; API-OSS backup
uses direct rsync/SCP/S3 connections without tunnel dependency. OpenAI API charges
$0.01/1K tokens for data processing — backup and restore operations run entirely locally
at zero per-operation cost, with no API call fees for serializing or deserializing the
knowledge graph state.

## Applications
- **Consumer**: Scheduled encrypted backups to external drive or NAS. Peace of mind that
  months of personal knowledge graph work, research data, and configurations are safe.
- **Government / Defense**: Air-gapped backup with cryptographic verification. Full state
  transferred between classified and unclassified environments via removable media with
  integrity guarantees and ledger attestation.
- **Enterprise**: Compliance-grade backup with AEAD encryption, scheduled rotation, remote
  destination, and audit trail. Satisfies SOC 2, HIPAA, and ITAR backup requirements
  without additional backup software licensing.

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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