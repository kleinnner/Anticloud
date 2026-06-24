---
title: "Community Playbook 2: Onboarding New Contributors"
sidebar_position: 2
description: "Guide for getting new contributors from first visit to first merged PR."
tags: [community]
---

# Community Playbook 2: Onboarding New Contributors

## Overview

Guide for getting new contributors from first visit to first merged PR.

## The Contributor Journey

```
Discovery → Join → Lurk → First Contribution → Regular → Maintainer
   ↓         ↓       ↓           ↓                ↓            ↓
  Search   Discord  Read docs   Fix a bug      Own module   Commit bit
```

## Step 1: First Discovery

Make it easy to find API-OSS:

```yaml
GitHub:
  - README: clear project description + badges
  - Topics: api-oss, AI, open-source, rust, react
  - Stars: ask early users to star
  - Pin: contributing guide + code of conduct

Website:
  - "Get involved" page with links to GitHub, Discord
  - Contributor testimonials
  - Roadmap (public, links to good first issues)
```

## Step 2: First Join

Make joining frictionless:

```yaml
Discord:
  - Auto-assign "new member" role
  - Welcome message + link to contributing guide
  - #introductions channel (answer 3 questions)
  - Find a buddy program (pair with existing contributor)

GitHub:
  - First issue comment within 1 hour
  - Assign area label (makes issue feel owned by someone)
```

## Step 3: First Contribution

Make the first PR as easy as possible:

```yaml
Best first contributions:
  - Documentation: fix a typo, improve unclear section
  - Tests: add test coverage for existing function
  - Bug fixes: tagged "good-first-issue" with reproduction steps
  - Small features: well-scoped, clear acceptance criteria

Template for good-first-issue:
  - What: clear description of the issue
  - Why: why it matters (user impact)
  - How: suggested approach
  - Where: files to modify
  - Testing: how to verify
  - Help: person to ping with questions
```

## Step 4: First PR Review

Make review welcoming:

```yaml
Do:
  - Review within 24 hours
  - Thank them for contribution
  - Suggest improvements as optional
  - Approve fast (perfection can come later)
  - Merge and celebrate

Don't:
  - Nitpick style on first PR
  - Require tests on documentation PRs
  - Leave review hanging >48 hours
  - Be negative or dismissive
```

## Step 5: Retention

Keep contributors engaged:

```yaml
After first merge:
  - Add to contributors list in README
  - Send thank-you sticker pack
  - Assign related issue (build ownership)
  - Invite to contributor-only Discord channel

After 5 merges:
  - Offer commit bit (triage access)
  - Ask to mentor new contributors
  - Profile in newsletter
  - Invite to planning calls

After 20 merges:
  - Full maintainer status
  - Vote on RFCs
  - Paid contributor stipend (if budget allows)
  - Invitation to contributor summit
```

## See Also

Related community, contributing, and governance documentation.

- [Community Overview](../community/01-building-community.md)
- [Contributing Guide](../contributing/01-contributing-overview.md)
- [Community Projects](../community-projects/01-community-projects-overview.md)
- [Governance](../governance/01-governance-overview.md)
