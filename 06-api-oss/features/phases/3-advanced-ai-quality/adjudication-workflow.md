---
title: "Adjudication Workflow"
sidebar_position: 99
description: "Resolves disagreement between multiple annotators on the same item through"
tags: [features]
---

# Adjudication Workflow

## What It Does
Resolves disagreement between multiple annotators on the same item through
side-by-side comparison.
A senior annotator or adjudicator reviews conflicting labels and picks the
correct answer, producing a gold-standard ground truth.
Supports partial adjudication and batch resolution.

## How It Works
The gateway starts via `api-oss start` or direct binary, loading adjudication
configuration from `opencode.json`.
The annotation pipeline Rust module in `ai-oss-gateway/src/` manages the
adjudication workflow.

When annotation campaigns produce items with conflicting labels (annotators
disagree on the correct label), those items enter the adjudication queue.
Conflicts are detected when a campaign item receives multiple annotations that
do not match.
The module identifies items where the annotation labels disagree and creates
adjudication tasks.

Each task presents the item's input data, all annotator labels (anonymized by
default, with identities optionally visible), and a summary of which labels
were chosen by how many annotators.
Adjudicators access their queue through the `AdjudicationView` frontend view
(connected via WS to port 3030).

The view shows a side-by-side comparison of all annotator labels, with the
item input at the top and each annotator's label with confidence score
displayed in a column.
The adjudicator selects the correct label, optionally adds a justification
comment, and submits.
Side-by-side rendering is performed entirely client-side in React.

When an adjudication is submitted (via WS message `adjudication_resolve`), the
module records the resolution, the adjudicator's identity, the timestamp, and
the justification in the SQLite database at `./data/annotations.db`.
The item is then promoted to the ground truth dataset with the adjudicated
label marked as authoritative.

The module supports batch adjudication: items with the same pattern of
disagreement (same annotator pair disagreeing in the same direction) can be
resolved in bulk.
Partial adjudication allows resolving some conflicts while leaving others for
later.

Adjudication progress is tracked per campaign: total conflicts found, resolved,
and remaining.
The frontend displays these statistics in a dashboard with color-coded conflict
resolution status.
The HTTP UI on port 8081 includes an Adjudication queue view showing pending
conflicts sorted by campaign, with priority scoring.

WS messages include `adjudication_get_conflicts`, `adjudication_resolve`,
`adjudication_conflicts_result`, and `adjudication_resolved`.
All data stays local — no cloud dependency for conflict resolution.

## How to Operate
1. View queue: `api-oss adjudication list --campaign camp_001`.
2. Open Adjudication view on port 8081. Navigate to Annotation > Adjudication.
3. Review conflicting labels side-by-side. Select the correct label.
   Add justification. Click "Resolve."
4. Batch resolve: `api-oss adjudication batch-resolve --campaign camp_001
   --pattern "dr_smith:malignant,dr_jones:benign" --correct-label malignant`.
5. Check status: `api-oss adjudication status --campaign camp_001`.
6. View history: `api-oss adjudication history --campaign camp_001`.
7. Re-open: `api-oss adjudication reopen --conflict-id conf_042`.
8. Assign: `api-oss adjudication assign --adjudicator dr_senior
   --campaign camp_001 --count 20`.
9. Configure in `opencode.json`:
   ```json
   {
     "annotation": {
       "adjudication": {
         "anonymize_annotators": true,
         "require_justification": true,
         "auto_promote_to_ground_truth": true
       }
     }
   }
   ```

## The Moat
- Full offline adjudication with local state management
- Conflicts tracked per-item across annotator sessions
- Side-by-side rendering entirely client-side in React
- Batch resolution for common disagreement patterns
- Partial adjudication allows flexible workflow
- Auto-promotion to ground truth creates canonical datasets
- All decisions recorded in the ledger

## Why Choose API-OSS
Palantir's adjudication requires Foundry cloud infrastructure.
Mercor has no structured adjudication workflow.
API-OSS provides a dedicated adjudication UI with side-by-side comparison,
batch resolution, and automatic ground truth promotion.

## Competitive Comparison
- **Palantir**: Adjudication in Foundry requires cloud infrastructure.
- **Mercor**: No structured adjudication workflow.
- **OpenAI / Anthropic / Nvidia**: No adjudication workflows.

## Cost-Benefit Analysis
Building adjudication workflow costs ~$40K in engineering time.
Without structured adjudication, each conflict takes ~10 minutes of coordinator
time. For 500 conflicts, that's 83 hours (~$5K).
API-OSS resolves individually in 30 seconds and patterns in seconds — 90%+
time savings.
Each unresolved conflict degrades model accuracy by 2-5%.

## Applications
- **Consumer**: Resolve conflicting personal tags on media libraries.
- **Government / Defense**: Adjudicate intelligence classification
  disagreements offline in secure facilities.
- **Enterprise**: Quality assurance for production annotation teams.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
