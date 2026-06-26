<!--
  __   ___                      __                        __                     
  ¦¦  ¦¦¯                       ¦¦                        ¦¦                     
  ___¦  ¦¦_¦¦      _¦¦¦¦¦_  ¦¦¦¦¦¦¦¦  ¦¦ _¦¦¯    _¦¦¦¦¦_   _¦¦¦_¦¦   _¦¦¦¦_   ¦___     
  __¦¯¯¯    ¦¦¦¦¦      ¯ ___¦¦      _¦¯   ¦¦_¦¦      ¯ ___¦¦  ¦¦¯  ¯¦¦  ¦¦____¦¦    ¯¯¯¦__ 
  ¯¯¦___    ¦¦  ¦¦_   _¦¦¯¯¯¦¦    _¦¯     ¦¦¯¦¦_    _¦¦¯¯¯¦¦  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯    ___¦¯¯ 
      ¯¯¯¦  ¦¦   ¦¦_  ¦¦___¦¦¦  _¦¦_____  ¦¦  ¯¦_   ¦¦___¦¦¦  ¯¦¦__¦¦¦  ¯¦¦____¦  ¦¯¯¯     
           ¯¯    ¯¯   ¯¯¯¯ ¯¯  ¯¯¯¯¯¯¯¯  ¯¯   ¯¯¯   ¯¯¯¯ ¯¯    ¯¯¯ ¯¯    ¯¯¯¯¯
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Team Management

This guide covers multi-team workspace administration, creating teams, managing members, and shared ledgers.

## Workspace Architecture

`
+------------------------------------------------------+
¦                Enterprise Workspace                   ¦
¦                                                       ¦
¦  +-------------+  +-------------+  +-------------+  ¦
¦  ¦ Team:        ¦  ¦ Team:        ¦  ¦ Team:        ¦  ¦
¦  ¦ Analytics    ¦  ¦ Engineering  ¦  ¦ Compliance   ¦  ¦
¦  ¦              ¦  ¦              ¦  ¦              ¦  ¦
¦  ¦ Members: 12  ¦  ¦ Members: 8   ¦  ¦ Members: 3   ¦  ¦
¦  ¦ Ledger: A1   ¦  ¦ Ledger: B2   ¦  ¦ Ledger: C3   ¦  ¦
¦  ¦ Stores: 23   ¦  ¦ Stores: 15   ¦  ¦ Stores: 5    ¦  ¦
¦  +-------------+  +-------------+  +-------------+  ¦
¦                                                       ¦
¦  +------------------------------------------------+  ¦
¦  ¦         Shared Ledger (Enterprise Root)        ¦  ¦
¦  ¦   SHA3-256 + Ed25519 — Immutable Audit Trail  ¦  ¦
¦  +------------------------------------------------+  ¦
+------------------------------------------------------+
`

## Creating a Team

### CLI

`ash
kazcade-ctl team create analytics \
  --display-name "Data Analytics Team" \
  --description "Responsible for business analytics" \
  --ledger-path /data/ledgers/analytics \
  --quota-storage 500GB \
  --quota-nodes 5
`

### Admin Dashboard

`
+---------------------------------------------+
¦  Create Team                                ¦
¦                                             ¦
¦  Team Name:  analytics                      ¦
¦  Display:    Data Analytics Team            ¦
¦  Description: Business analytics and        ¦
¦               reporting                     ¦
¦                                             ¦
¦  Storage Quota: 500 GB                      ¦
¦  Node Quota:    5                           ¦
¦  Max Members:   20                          ¦
¦                                             ¦
¦  [Create] [Cancel]                          ¦
+---------------------------------------------+
`

## Managing Members

### Add Members

`ash
# Add single user
kazcade-ctl team add-member analytics \
  --user alice@company.com \
  --role analyst

# Add multiple
kazcade-ctl team add-members analytics \
  --users bob@company.com,carol@company.com \
  --role viewer

# Invite via email
kazcade-ctl team invite analytics \
  --email dave@company.com \
  --role operator \
  --message "You've been added to the Analytics team"
`

### Team Roles

| Role | Permissions | Description |
|------|-------------|-------------|
| dmin | All | Full team control |
| nalyst | Query, Export, Visualize | Data analysis |
| operator | Ingest, Transform, Manage | Data operations |
| iewer | Query, Read-only | View data only |
| uditor | Ledger read, Audit log | Compliance |

### Remove Members

`ash
kazcade-ctl team remove-member analytics alice@company.com

# Deactivate (temporary)
kazcade-ctl team deactivate-member analytics alice@company.com

# Reactivate
kazcade-ctl team activate-member analytics alice@company.com
`

## Team Configuration

### Quotas

`	oml
# Team config stored in ledger
[team.analytics]
display_name = "Data Analytics Team"

[team.analytics.quotas]
storage_bytes = 500000000000  # 500 GB
max_members = 20
max_concurrent_queries = 50
query_timeout_secs = 300
ingest_rate_mbps = 100

[team.analytics.features]
shared_dashboards = true
cross_team_queries = false
export_csv = true
export_json = true
export_parquet = true
`

### Update Quotas

`ash
kazcade-ctl team update analytics \
  --quota-storage 1TB \
  --quota-members 30 \
  --max-queries 100
`

## Shared Ledgers

Each team has an isolated sub-ledger within the enterprise ledger:

`ash
# View team ledger
kazkade ledger --team analytics

# Team ledger entries
kazkade ledger entries --team analytics --limit 10

# Verify team ledger integrity
kazkade ledger verify --team analytics

# Cross-team audit
kazkade ledger verify-chain --root enterprise-root.aioss
`

### Ledger Hierarchy

`
Enterprise Root Ledger
+-- Team: Analytics (A1)
¦   +-- Entry 0: Team Genesis
¦   +-- Entry 1: Member alice@company.com added
¦   +-- Entry 2: Dataset sales_q2.acol ingested
¦   +-- ...
+-- Team: Engineering (B2)
¦   +-- Entry 0: Team Genesis
¦   +-- ...
+-- Team: Compliance (C3)
    +-- ...
`

## Team Dashboard

`ash
kazkade dashboard --team analytics
`

Shows team-specific view:

`
+---------------------------------------------+
¦ Analytics Team Dashboard                     ¦
¦                                             ¦
¦ Members Online: 3/12                        ¦
¦ Active Queries: 4                           ¦
¦ Storage Used: 234 GB / 500 GB               ¦
¦ Today's Queries: 1,234                      ¦
¦                                             ¦
¦ Recent Activity:                            ¦
¦  alice    Queried sales_q2  2 min ago      ¦
¦  bob      Ingested data.csv 5 min ago      ¦
¦  carol    Exported report   10 min ago     ¦
+---------------------------------------------+
`

## Cross-Team Collaboration

### Shared Data

`ash
# Share a dataset with another team
kazcade-ctl dataset share sales_q2.acol \
  --with engineering \
  --permission read

# Shared datasets appear in both teams
kazkade query 'SELECT * FROM "sales_q2.acol"' --team engineering
`

### Cross-Team Queries

`ash
# Query across teams (if enabled)
kazkade query \
  "SELECT * FROM shared://analytics/sales_q2.acol" \
  --team engineering
`

## Audit Trail

All team operations are logged:

`ash
kazcade-ctl team audit analytics --since 7d
`

`
Timestamp           Action                  User               Details
2026-06-19 12:00    member.added            admin@company.com  alice@ added as analyst
2026-06-19 11:30    quota.updated           admin@company.com  Storage: 500GB -> 1TB
2026-06-19 10:00    dataset.shared          alice@company.com  sales_q2 -> engineering (read)
2026-06-19 09:00    member.removed          admin@company.com  dave@ removed (inactive)
`

## Team Management API

`ash
# List all teams
curl -H "Authorization: Bearer <token>" \
  https://kazcade.company.com/api/v1/admin/teams

# Create team
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "analytics",
    "display_name": "Data Analytics Team",
    "quota_storage_gb": 500
  }' \
  https://kazcade.company.com/api/v1/admin/teams

# Team stats
curl -H "Authorization: Bearer <token>" \
  https://kazcade.company.com/api/v1/admin/teams/analytics/stats
`

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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