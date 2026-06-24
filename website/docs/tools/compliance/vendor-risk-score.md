---
sidebar_label: Vendor Risk Score
description: Assess and score third-party vendor risk across security, compliance, financial stability, and operational resilience dimensions.
keywords: [compliance, governance, vendor risk score, FedRAMP, SOC2, audit, risk management, Anticloud]
image: /img/anticloud-social.png
---

# Vendor Risk Score

Vendor Risk Score provides a structured framework for evaluating third-party vendors and partners. It aggregates risk signals across multiple domains to produce a composite risk score that informs vendor selection and oversight decisions.

## Features

- Risk Dimensions: Score vendors across security, privacy, compliance, financial, and operational categories
- Questionnaire Integration: Send and score vendor security questionnaires with automated analysis
- Evidence Collection: Request and verify vendor documentation including SOC reports and penetration tests
- Dynamic Scoring: Automatically update scores based on breach notifications, news, and certification changes
- Portfolio View: Dashboard showing risk distribution across the entire vendor ecosystem

## Workflow

```mermaid
flowchart LR
    A[Vendor Profile] --> B[Risk Category Scoring]
    B --> C[Evidence Verification]
    C --> D[Weighted Aggregation]
    D --> E[Composite Score]
    E --> F[Vendor Tier Assignment]
```

## Usage

View the full documentation on GitHub: [Tool Directory](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/vendor-risk-score)

## Related Tools

- [Capability Matrix](../compliance/capability-matrix)
- [Supply Chain SBOM](../compliance/supply-chain-sbom)
- [Compliance Gap Analyzer](../compliance/compliance-gap-analyzer)
