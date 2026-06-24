---
title: "Community Playbook 5: Moderation & Governance"
sidebar_position: 5
description: "Guidelines for community moderation and governance structure."
tags: [community]
---

# Community Playbook 5: Moderation & Governance

## Overview

Guidelines for community moderation and governance structure.

## Governance Model

### Core Team

```yaml
Members: 3–5 maintainers
Responsibilities:
  - Final technical decisions
  - Release management
  - Security vulnerability response
  - RFC approval
Selection: Appointment by existing core team
```

### Committers

```yaml
Members: 5–20 trusted contributors
Responsibilities:
  - Merge PRs (with core team approval)
  - Issue triage
  - Code review
  - Community moderation
Selection: Nominated by core team + community vote
```

### Community Moderators

```yaml
Members: 3–10 community members
Responsibilities:
  - Discord moderation
  - Enforce Code of Conduct
  - Support newcomers
  - Organize events
Selection: Volunteer application
```

## Code of Conduct

### Policy

```yaml
Expected behavior:
  - Be respectful and inclusive
  - Use welcoming language
  - Accept constructive criticism gracefully
  - Focus on what's best for the community

Unacceptable behavior:
  - Harassment, discrimination, or hate speech
  - Trolling, insulting, or derogatory comments
  - Publishing others' private information
  - Sexual content or unwelcome advances
  - Spam or self-promotion
```

### Enforcement

```yaml
First offense: Warning (private message)
Second offense: 7-day mute (temporary)
Third offense: Permanent ban

Emergency (harassment, threats):
  - Immediate permanent ban
  - Report to authorities if needed

Appeals:
  - Email core@api-oss.local
  - Reviewed within 7 days
  - Decision is final
```

## Moderation Tools

```yaml
Discord:
  - Auto-mod for hate speech filtering
  - Slow mode in #general (5 seconds)
  - @everyone ping limited to core team
  - Verified phone requirement (anti-spam)

GitHub:
  - Branch protection (require PR review)
  - CODEOWNERS for sensitive directories
  - Issue templates (reduces noise)
  - Stale bot (auto-close inactive issues)
```

## Conflict Resolution

```yaml
Step 1: Private discussion (moderator + involved parties)
Step 2: Mediation (core team member as neutral third party)
Step 3: Core team vote (majority decision)
Step 4: Appeal to outer council (if established)

Principles:
  - Assume good faith
  - Focus on behavior, not person
  - Document decisions (transparency)
  - Prefer de-escalation over punishment
```

## Transparency

```yaml
Public information:
  - All moderation actions (anonymized)
  - Core team meeting notes
  - RFC discussions
  - Roadmap decisions

Private information:
  - Personal user information
  - Security vulnerabilities (until fixed)
  - Harassment investigation details
```

## See Also

Related community, contributing, and governance documentation.

- [Community Overview](../community/01-building-community.md)
- [Contributing Guide](../contributing/01-contributing-overview.md)
- [Community Projects](../community-projects/01-community-projects-overview.md)
- [Governance](../governance/01-governance-overview.md)
