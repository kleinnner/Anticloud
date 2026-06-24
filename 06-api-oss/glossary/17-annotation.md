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
