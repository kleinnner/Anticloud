---
title: "Grant Management Guide"
sidebar_position: 7
description: "Manage grant proposals, submissions, and reporting for API-OSS funding."
tags: [grants]
---

# Grant Management Guide

## Overview

Manage grant proposals, submissions, and reporting for API-OSS funding.

## Grant Lifecycle

```
1. Identify opportunity
2. Write proposal
3. Submit
4. Award notification
5. Project execution
6. Progress reporting
7. Final report
8. Project closeout
```

## Pipeline Tracking

```yaml
grants:
  pipeline:
    - name: EIC Accelerator
      status: submitted
      amount: €2.5M
      deadline: 2025-06-15
      probability: 40%
    - name: EU Horizon
      status: drafting
      amount: €5M
      deadline: 2025-09-01
      probability: 20%
    - name: UAE ICT Fund
      status: awarded
      amount: $1M
      deadline: awarded
      probability: 100%
```

## Milestone Tracking

```bash
apioss grants milestones --grant eic-accelerator

# Output:
# M1: Proposal submitted (2025-06-15) ✓
# M2: First review (2025-08-01) pending
# M3: Interview (2025-09-15) pending
```

## Next

- [Grant Reporting](08-grant-reporting.md)

## See Also

Related grants, investor, and commercial documentation.

- [Grant Proposals](../grants/01-eic-accelerator.md)
- [Grant Management](../grants/07-grant-management.md)
- [Investor Overview](../investors/01-investor-overview.md)
- [Commercial Guide](../commercial/01-commercial-overview.md)
