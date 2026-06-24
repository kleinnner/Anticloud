---
title: "Voting Process"
sidebar_position: 5
description: "Voting procedures for API-OSS governance decisions."
tags: [governance]
---

# Voting Process

## Overview

Voting procedures for API-OSS governance decisions.

## Vote Types

| Type | Voters | Threshold | Duration |
|---|---|---|---|
| RFC approval | TSC | 2/3 majority | 7 days |
| TSC election | All contributors | Simple majority | 14 days |
| Code of conduct | TSC | Unanimous | 7 days |
| Release approval | Core committers | 2/3 majority | 3 days |
| Community decision | All members | Simple majority | 7 days |

## Voting Process

```
1. Proposal posted on GitHub
2. Label: `vote-pending`
3. Voting period opens
4. Votes cast as comments:
   - 👍 Approve
   - 👎 Reject
   - 👀 Abstain
5. Results tallied at close
6. Decision recorded in issue
```

## Eligibility

| Role | Can Vote On |
|---|---|
| Contributor | Community decisions |
| Maintainer | + Release approval |
| Core committer | + TSC elections |
| TSC member | + RFCs, all decisions |

## Runoff

```
- If no candidate reaches threshold: top 2 advance
- Runoff: 7 days
- If still tied: Project lead decides
```

## Emergency Decisions

```
- Security vulnerabilities: TSC can fast-track (24h vote)
- Project lead can make emergency decisions (must ratify)
```

## Next

- [06 Code of Conduct Enforcement](06-code-of-conduct-enforcement.md)

## See Also

Related governance, contributing, and security documentation.

- [Governance Overview](../governance/01-governance-overview.md)
- [Contributing Guide](../contributing/01-contributing-overview.md)
- [Code of Conduct](../governance/06-code-of-conduct-enforcement.md)
- [Security Advisory](../governance/08-security-advisory-process.md)
