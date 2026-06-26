---
title: "Annotation Workforce Management"
sidebar_position: 99
description: "Manages annotator profiles including skill tags, reliability scoring, and"
tags: [features]
---

# Annotation Workforce Management

## What It Does
Manages annotator profiles including skill tags, reliability scoring, and
maximum concurrent assignments.
Tracks annotator performance over time to identify top performers and flag
low-quality annotators.
Fully offline workforce management with no dependency on external platforms.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading workforce
configuration from `opencode.json`.
The `workforce.rs` Rust module in `ai-oss-gateway/src/` manages annotator
profiles and assignments.

Annotator profiles are stored in the SQLite database at `./data/annotations.db`.
Each profile includes: annotator identifier (username or UUID), display name,
skill tags (list of domain expertise areas: "radiology", "legal_documents",
"sentiment", "code_review", etc.), reliability score (0.0-1.0 computed from
historical IAA and ground truth alignment), maximum concurrent assignments
(configurable cap on how many active items an annotator can have), total items
annotated, average time per item, and historical agreement scores.

When a campaign is created, the workforce module recommends annotators based
on skill tag matching against the campaign's domain.
Assignments are distributed round-robin among qualified annotators, respecting
their concurrent assignment caps.

When an annotator completes an item, the module updates their statistics:
items annotated count increments, average time per item updates, and if ground
truth data is available, the agreement score is updated.
The reliability score is computed as a weighted moving average of the
annotator's recent agreement with ground truth, IAA overlap, and consistency.

Annotators whose reliability drops below a configurable threshold (default 0.7)
are automatically flagged for review and removed from active assignment until
a supervisor reviews them.
The supervisor dashboard (HTTP UI on port 8081) displays annotator performance
metrics: a leaderboard of high-performers, a list of flagged annotators, per-
annotator trend charts, and individual detail views.

The workforce module also supports annotator groups — teams that can be
assigned as a unit to campaigns.
Groups have collective skill tags and capacity management.
When a group is assigned to a campaign, items are distributed among group
members using a load-balancing algorithm that accounts for each member's
current workload, reliability score, and skill match.
Group capacity is the sum of individual capacities, capped by a configurable
group maximum.

Reliability scoring uses a weighted moving average with configurable window
size (default 100 annotations). The formula weights recent annotations more
heavily: the most recent 10 annotations have 2x weight, the next 20 have 1.5x,
and the remaining 70 have 1x.
This ensures annotator scores reflect current performance while maintaining
statistical stability.
When ground truth data is unavailable, reliability is estimated using pairwise
agreement with other annotators on overlapping items, falling back to
consensus-based scoring when no ground truth exists.
The 87 CLI commands include `workforce add-annotator`, `workforce list`,
`workforce show`, `workforce flag-review`, `workforce approve`, `workforce
add-skill`, and `workforce group-create`.

All workforce data is stored locally with ledger-backed integrity.

## How to Operate
1. Add annotator: `api-oss workforce add-annotator --username dr_smith
   --skills "radiology,oncology" --max-concurrent 20`.
2. List: `api-oss workforce list`.
3. Show details: `api-oss workforce show --annotator dr_smith`.
4. Flag for review: `api-oss workforce flag-review --annotator dr_jones
   --reason "Reliability dropped to 0.68"`.
5. Approve: `api-oss workforce approve --annotator dr_jones --restore`.
6. Create group: `api-oss workforce group-create --name "Radiology Team"
   --annotators "dr_smith,dr_jones"`.
7. Add skills: `api-oss workforce add-skill --annotator dr_smith
   --skills "mri,petscan"`.
8. Export: `api-oss workforce export --format csv`.
9. Configure defaults in `opencode.json`:
   ```json
   {
     "annotation": {
       "workforce": {
         "reliability_threshold": 0.7,
         "default_max_concurrent": 15,
         "auto_flag_on_drop": true
       }
     }
   }
   ```

## The Moat
- Fully offline workforce management — no external platform dependency
- Reliability scores from local IAA and task statistics
- Profile data in the local ledger with cryptographic integrity
- Skill-based assignment ensures annotator-task fit
- Automatic flagging of low-reliability annotators
- No cloud subscription required

## Why Choose API-OSS
Mercor provides workforce management as a cloud SaaS — data leaves premises.
API-OSS enables organizations to manage their own annotation teams with full
data locality.

## Competitive Comparison
- **Mercor**: Cloud SaaS. Data leaves premises. Vendor lock-in.
- **Palantir**: No dedicated workforce management.
- **OpenAI / Anthropic / Nvidia**: No workforce management capabilities.

## Cost-Benefit Analysis
Mercor workforce management adds ~20% premium to annotation costs.
$100K/year in annotations = $20K/year additional.
For a team of 20 annotators, that's $20K/year in SaaS overhead with no
additional functionality beyond what API-OSS provides.
Building equivalent tracking in-house costs ~$30K in engineering time,
plus ongoing maintenance ($5K-$10K/year).
Catching one unreliable annotator early saves $5K-$15K in re-annotation costs
per incident. For a 20-person team with 5% low-performers, that's 1 annotator
caught per quarter = $20K-$60K/year savings.
Mercor offers no reliability scoring or automated flagging — all quality
management is manual, adding 5-10 hrs/week of supervisor time ($15K-$30K/year
at $60/hr).

## Applications
- **Consumer**: N/A.
- **Government / Defense**: Manage classified annotation teams in air-gapped
  environments.
- **Enterprise**: Run distributed annotation workforces with accountability.

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ