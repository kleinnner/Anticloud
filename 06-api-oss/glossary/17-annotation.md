---
title: "Glossary 17: Annotation Glossary"
sidebar_position: 17
description: "Documentation for Glossary 17: Annotation Glossary"
tags: [glossary]
---

# Glossary 17: Annotation Glossary

## Terms

### Annotation
- Labeling data with metadata for training or evaluation
- API-OSS provides a full annotation studio

### Annotation Studio
- Web-based tool for data labeling
- Supports: classification, NER, document labeling, QA pairs

### Label / Tag
- A category or value assigned to data
- Examples: "positive/negative/neutral", "person/organization/location"

### Label Schema
- Definition of allowed labels and their hierarchy
- Created per project, can include validation rules

### Annotator
- Person performing annotation tasks
- API-OSS supports individual annotators and teams

### Annotation Project
- Organized collection of annotation tasks
- Includes: label schema, dataset, annotator assignments

### IAA (Inter-Annotator Agreement)
- Statistical measure of annotator consistency
- API-OSS supports: Cohen's Kappa, Fleiss' Kappa, percent agreement

### Cohen's Kappa
- IAA metric for two annotators, chance-adjusted
- Range: −1 to 1 (0.8+ = strong agreement)

### Fleiss' Kappa
- IAA metric for 3+ annotators, chance-adjusted
- Generalization of Cohen's Kappa

### Percent Agreement
- Simple percentage of identical annotations
- Does not account for chance agreement

### Adjudication
- Resolving conflicting annotations
- Workflow: present conflicts → expert resolves → record decision

### Active Learning
- ML technique selecting most informative items for annotation
- API-OSS uses uncertainty sampling and diversity sampling

### Uncertainty Sampling
- Active learning: select items model is most uncertain about
- Maximizes information gain per annotation

### Diversity Sampling
- Active learning: select diverse subset of data
- Ensures coverage of the data distribution

### Gold Standard / Ground Truth
- Authoritative, verified annotations
- Used for evaluating model and annotator accuracy

### Annotation Queue
- Ordered list of items waiting to be annotated
- API-OSS supports priority-based and round-robin queues

### Annotation Export
- Downloading annotations in standard formats
- Formats: JSONL, CSV, spaCy, CONLL, AIOSS

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com