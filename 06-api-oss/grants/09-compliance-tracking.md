---
title: "Grant Compliance Tracking"
sidebar_position: 9
description: "Track compliance requirements for grant-funded projects."
tags: [grants]
---

# Grant Compliance Tracking

## Overview

Track compliance requirements for grant-funded projects.

## Common Requirements

| Requirement | Description | Frequency |
|---|---|---|
| Financial audit | Independent audit of grant funds | Annual |
| Progress reports | Technical and narrative reports | Quarterly |
| Time tracking | Personnel time allocation | Monthly |
| Procurement | Competitive bidding documentation | Per purchase |
| IP reporting | IP generated during project | Annually |

## Compliance Checklist

```yaml
grant: eic-accelerator
requirements:
  - id: FIN-01
    description: Submit quarterly financial report
    frequency: quarterly
    next_due: 2025-09-30
    owner: finance@api-oss.local
    status: on-track
  - id: TECH-01
    description: Submit technical progress report
    frequency: quarterly
    next_due: 2025-09-30
    owner: engineering@api-oss.local
    status: on-track
```

## Audit Preparation

```bash
# Generate compliance report
apioss grants compliance --grant eic-accelerator --output report.pdf

# Audit checklist
apioss grants audit-prep --grant eic-accelerator
```

## Next

- [Budget Tracking](10-budget-tracking.md)

## See Also

Related grants, investor, and commercial documentation.

- [Grant Proposals](../grants/01-eic-accelerator.md)
- [Grant Management](../grants/07-grant-management.md)
- [Investor Overview](../investors/01-investor-overview.md)
- [Commercial Guide](../commercial/01-commercial-overview.md)
