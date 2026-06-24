---
title: "Grant Budget Tracking"
sidebar_position: 10
description: "Track and manage grant budgets."
tags: [grants]
---

# Grant Budget Tracking

## Overview

Track and manage grant budgets.

## Budget Categories

| Category | Allocated | Spent | Remaining | Utilization |
|---|---|---|---|---|
| Personnel | €100,000 | €45,000 | €55,000 | 45% |
| Equipment | €50,000 | €50,000 | €0 | 100% |
| Travel | €10,000 | €2,000 | €8,000 | 20% |
| Subcontractors | €30,000 | €10,000 | €20,000 | 33% |
| Overhead | €20,000 | €8,000 | €12,000 | 40% |
| **Total** | **€210,000** | **€115,000** | **€95,000** | **55%** |

## Budget Tracking Tool

```bash
# View budget
apioss grants budget --grant eic-accelerator

# Add expense
apioss grants expense --grant eic-accelerator \
  --category equipment \
  --amount 5000 \
  --description "GPU server" \
  --date 2025-06-01

# Generate burn rate report
apioss grants burn-rate --grant eic-accelerator
```

## Budget Reallocation

```yaml
reallocation:
  original:
    equipment: €50,000
    travel: €10,000
  requested:
    equipment: €45,000
    travel: €15,000
  reason: Additional conferences for dissemination
```

## Next

- [Timeline Management](11-timeline-management.md)

## See Also

Related grants, investor, and commercial documentation.

- [Grant Proposals](../grants/01-eic-accelerator.md)
- [Grant Management](../grants/07-grant-management.md)
- [Investor Overview](../investors/01-investor-overview.md)
- [Commercial Guide](../commercial/01-commercial-overview.md)
