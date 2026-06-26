---
title: "Annotation Studio"
sidebar_position: 99
description: "Provides a full-featured annotation UI for labeling items with custom label"
tags: [features]
---

# Annotation Studio

## What It Does
Provides a full-featured annotation UI for labeling items with custom label
schemas, navigating through datasets item-by-item, and assigning confidence
scores.
Supports multi-turn annotation workflows with real-time collaboration.
Runs entirely locally — no data ever leaves the machine.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading annotation
configuration from `opencode.json`.
The `annotation/` Rust modules in `ai-oss-gateway/src/` manage annotation data
and CRUD operations.

The Annotation Studio is a React-based frontend view (`AnnotationStudioView`)
that connects to the gateway via WebSocket to port 3030.
When an annotator opens the studio, the view sends an `annotation_session_start`
WS message, which the gateway acknowledges with a session ID and the first
unannotated item from the active campaign.

The annotator sees the item input (text, image, document, or structured data),
the label schema (defined per campaign — single-label classification, multi-
label, free-text, ordinal scale, or bounding boxes), and input controls
(radio buttons, checkboxes, text fields, sliders, or canvas drawing tools).
The annotator applies labels according to the schema, optionally assigns a
confidence score (1-5), adds comments, and submits via `annotation_create`
WS message.

The gateway validates the annotation against the schema (required fields, value
ranges, type constraints) and stores it in the SQLite database at
`./data/annotations.db`.
If active learning is enabled, the next item is automatically selected using
the configured sampling strategy.

The studio supports multi-turn workflows: for generative tasks, the annotator
can provide a prompt, see the model's response, and rate the response quality
creating a preference pair for DPO fine-tuning.

Real-time collaboration features include: seeing how many other annotators are
active on the same campaign, viewing real-time annotation counts, and receiving
notifications when new items are added.

The studio includes a quality feedback loop: if an annotator's recent
annotations show low agreement with ground truth, the studio displays a
notification and optionally shows the correct label for training.

Navigation controls include: previous/next item, jump to item by ID, filter by
annotation status, and search within items.
Keyboard shortcuts for power users: `j`/`k` to navigate, `1-5` for confidence,
`Enter` to submit, `s` to skip, `/` to search, `c` for comment.

Annotator statistics are displayed in a sidebar: items completed in this
session, average time per item, current streak, and consistency score.
The HTTP UI on port 8081 serves the Annotation Studio page.

WS messages include `annotation_session_start`, `annotation_get_next_item`,
`annotation_create`, `annotation_get_for_item`, `annotation_update`, and
`annotation_delete`.
The 87 CLI commands include `annotation export` and `annotation stats`.
All data is stored locally — no annotation data is uploaded externally.

## How to Operate
1. Open Annotation Studio on port 8081. Navigate to Annotation > Studio.
2. Select an active campaign from the dropdown.
3. The studio displays the first unannotated item with the label schema panel.
4. Select labels, set confidence (1-5), add optional comment, click "Submit"
   or press Enter. The next item loads automatically.
5. Navigate with `<` and `>` buttons or `j`/`k` keys.
6. Filter items by status, ID range, or keyword search.
7. Press `?` to see the keyboard shortcuts overlay.
8. Export annotations: `api-oss annotation export --campaign camp_001
   --format jsonl`.
9. Configure in `opencode.json`:
   ```json
   {
     "annotation": {
       "studio": {
         "auto_advance": true,
         "show_confidence": true,
         "keyboard_shortcuts": true,
         "real_time_collaboration": true
       }
     }
   }
   ```

## The Moat
- Runs entirely locally — no data ever leaves the machine
- Combines schema management, navigation, and confidence scoring in one
  workspace
- Works fully offline in air-gapped environments
- Multi-turn annotation for complex workflows
- Active learning integration for intelligent item selection
- Real-time collaboration shows team activity
- Keyboard shortcuts for high-volume annotation
- SQLite storage with ledger-backed integrity

## Why Choose API-OSS
Mercor is cloud-only — data must be uploaded. Annotators need internet.
API-OSS works fully offline, suitable for defense, intelligence, healthcare,
and any domain where data cannot leave premises.
The studio matches or exceeds cloud annotation platforms with no data
exfiltration risk.

## Competitive Comparison
- **Mercor**: Cloud-only. Data upload required. No offline mode. Per-annotation
  pricing.
- **Palantir**: Annotation in Foundry requires cloud infrastructure.
- **OpenAI**: No annotation tooling.
- **Anthropic**: No annotation studio.
- **Nvidia**: No annotation tooling in NeMo.

## Cost-Benefit Analysis
Mercor charges $0.50-$2.00/annotation. 10K items = $5K-$20K.
100K items/year = $50K-$200K/year.
API-OSS studio is free — internal annotators at no per-item cost.
Cloud platforms (Labelbox, Supervisely) cost $5K-$50K/year plus per-annotation.
Building equivalent costs ~$120K in engineering time.
Offline capability eliminates connectivity requirements for field deployments.

## Applications
- **Consumer**: Annotate personal data for custom model training — all on
  personal hardware with no upload.
- **Government / Defense**: Classify sensitive intelligence data without
  network transmission in secure facilities.
- **Enterprise**: Build domain-specific datasets for fine-tuning proprietary
  models on-premises.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
