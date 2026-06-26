---
title: "Annotation Campaigns"
sidebar_position: 99
description: "Manages annotation campaigns with target items, deadlines, status tracking, and"
tags: [features]
---

# Annotation Campaigns

## What It Does
Manages annotation campaigns with target items, deadlines, status tracking, and
dataset linkage.
Provides progress monitoring dashboards and per-campaign quality metrics.
Campaigns can be created, modified, and completed without any network
connectivity.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading campaign
configuration from `opencode.json`.
The annotation pipeline Rust module in `ai-oss-gateway/src/` manages campaign
lifecycle.

When a campaign is created (via CLI or frontend), the module creates a
campaign record in the SQLite database at `./data/annotations.db`.
Each campaign has: a name, description, target dataset (reference to a ground
truth dataset or an uploaded item list), per-item annotation schema (label
type, options, confidence scale), target number of annotations per item,
assignee list (which annotators or annotator groups), deadline, and status
(draft, active, paused, completed).

Campaigns pull items from the linked dataset — the module iterates through
unannotated items and creates annotation tasks for each.
The iteration uses a configurable batch size (default 100) to avoid excessive
memory consumption with large datasets.
Annotators access their assigned items through the Annotation Studio frontend
view, which connects via WebSocket to port 3030.
The studio displays the item, the annotation schema, and submission controls.

As annotations are submitted, the module updates the campaign progress: items
annotated vs. total, annotations per item, and per-annotator contribution
counts.
The SQLite write path is batched — annotations accumulate in memory and flush
every 50 submissions, reducing disk I/O under high annotation throughput.
The campaign dashboard (served via HTTP UI on port 8081) shows real-time
progress with a progress bar, per-annotator breakdown (items completed,
average time per item, agreement rate with ground truth), and a list of
recently submitted annotations.

Quality metrics are computed per campaign: annotation completeness (fraction
of items that have reached the target annotations-per-item count), inter-
annotator agreement (Cohen's Kappa or Fleiss' Kappa), and annotator reliability
scores.

Campaigns can be paused (stopping new annotation task assignment), resumed,
or completed (marking all remaining unannotated items as skipped and finalizing
the campaign).
Completed campaigns produce a summary report: total items annotated, total
annotations, average annotations per item, agreement metrics, and per-annotator
statistics.
The report is structured as JSON and can be exported to PDF via the headless
Chrome renderer, making it suitable for inclusion in compliance dossiers.

The campaign lifecycle is managed through a state machine with transitions:
draft → active → paused ↔ active → completed. Each transition is recorded in
the ledger with a timestamp and the initiating operator's identity.
Cancelled campaigns (draft → cancelled or active → cancelled) retain all
annotations collected before cancellation for audit purposes.

Campaign results feed into the ground truth dataset system — annotations from
completed campaigns can be reviewed, adjudicated, and promoted to ground truth.
All campaign state is stored locally in SQLite and backed by the ledger for
integrity.
The 87 CLI commands include `campaign create`, `campaign list`, `campaign
status`, `campaign pause`, `campaign resume`, `campaign complete`, and
`campaign report`.

## How to Operate
1. Create: `api-oss campaign create --name "Q2 Labeling" --dataset my_dataset
   --schema ./schema.json --annotations-per-item 3 --deadline 2026-06-30`.
2. List: `api-oss campaign list`.
3. Status: `api-oss campaign status --campaign camp_001`.
4. Pause: `api-oss campaign pause --campaign camp_001`.
5. Resume: `api-oss campaign resume --campaign camp_001`.
6. Complete: `api-oss campaign complete --campaign camp_001`.
7. Report: `api-oss campaign report --campaign camp_001`.
8. Add items: `api-oss campaign add-items --campaign camp_001 --dataset more`.
9. Export results: `api-oss campaign export --campaign camp_001 --format jsonl`.
10. Clone campaign: `api-oss campaign clone --campaign camp_001 --name "Q3 Labeling"`.
11. Configure defaults in `opencode.json`:
    ```json
    {
      "annotation": {
        "campaigns": {
          "default_annotations_per_item": 3,
          "auto_advance_on_submit": true,
          "batch_size": 100,
          "max_concurrent_items": 500
        }
      }
    }
    ```

## The Moat
- Campaign state fully local and auditable via the ledger
- Works with no network connectivity
- Integration with ground truth datasets and workforce profiles
- Real-time progress tracking with per-annotator granularity
- Quality metrics computed locally
- Audit-ready campaign reports

## Why Choose API-OSS
Mercor's campaign management is cloud-only with no offline fallback.
API-OSS campaigns work entirely offline, suitable for defense, intelligence,
and field deployments where connectivity is unavailable.

## Competitive Comparison
- **Mercor**: Cloud-only. No offline mode.
- **Palantir**: Similar features in Foundry but require cloud infrastructure.
- **OpenAI**: No annotation campaign management.
- **Anthropic**: No annotation tooling.
- **Nvidia**: No annotation campaign capabilities.

## Cost-Benefit Analysis
Mercor charges per annotation — 30K annotations at $0.50-$1.00 = $15K-$30K.
Scale that to 100K annotations/year at $0.75 average = $75K/year in annotation
fees alone.
API-OSS campaigns are free with internal annotators. The only cost is annotator
labor — typically $15-$25/hr for internal staff vs. Mercor's $0.50-$2.00/item.
20 campaigns/year with Mercor = $300K-$600K/year saved vs. API-OSS.
Cloud annotation platforms (Labelbox, Supervisely) add $5K-$50K/year in SaaS
subscriptions on top of per-annotation fees. API-OSS eliminates both.
Building equivalent campaign management costs ~$40K in engineering time.
Annotator time savings from automated task distribution saves 5 hrs/week of
coordinator time ($15K/year at $60/hr loaded cost).

## Applications
- **Consumer**: Track personal labeling projects over time.
- **Government / Defense**: Structure intelligence labeling campaigns with
  accountability.
- **Enterprise**: Coordinate large-scale annotation initiatives across teams.

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