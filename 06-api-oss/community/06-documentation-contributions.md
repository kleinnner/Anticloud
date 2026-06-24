---
title: "Community Playbook 6: Documentation Contributions"
sidebar_position: 6
description: "How to encourage and manage community documentation contributions."
tags: [community]
---

# Community Playbook 6: Documentation Contributions

## Overview

How to encourage and manage community documentation contributions.

## Why Documentation Matters

```yaml
Good documentation:
  - Reduces support tickets by 40%+
  - Increases adoption (people can learn independently)
  - Lowers barrier to contribution
  - Improves search rankings (SEO)
  - Builds trust (shows attention to detail)

Bad documentation:
  - Creates frustration
  - Generates support burden
  - Causes abandonment
```

## Documentation Contribution Paths

### Beginner: Small Fixes

| Task | Effort | Value |
|------|--------|-------|
| Fix typo | 2 minutes | Medium |
| Clarify sentence | 5 minutes | High |
| Update screenshot | 10 minutes | High |
| Add example | 15 minutes | Very high |
| Fix broken link | 2 minutes | High |

### Intermediate: Sections

| Task | Effort | Value |
|------|--------|-------|
| Write FAQ entry | 30 minutes | High |
| Write troubleshooting guide | 1–2 hours | Very high |
| Write tutorial | 2–4 hours | Very high |
| Translate to another language | 4+ hours | Very high |
| Add code examples (Rust, Python, JS) | 1–2 hours | Very high |

### Advanced: Full Docs

| Task | Effort | Value |
|------|--------|-------|
| Write migration guide | 4–8 hours | Very high |
| Write architecture guide | 8–16 hours | Very high |
| Record video tutorial | 4+ hours | Very high |
| Create interactive playground | 16+ hours | Game-changing |

## Contribution Workflow

```markdown
1. Find an issue labeled "docs" or "good-first-doc"
2. Comment "I'll take this" (prevents duplicate work)
3. Fork repo and create a branch
4. Edit docs (in `/docs/` directory)
5. Preview locally (build docs site)
6. Submit PR
7. Maintainer reviews within 24 hours
8. Merge and celebrate 🎉
```

## Documentation Style Guide

```yaml
General:
  - Active voice ("do this" not "this should be done")
  - Present tense ("API-OSS supports" not "API-OSS will support")
  - You/your (second person, not "the user")
  - Short paragraphs (3–5 sentences max)
  - Code blocks for commands and configs

Format:
  - Headers: ATX-style (# for h1, ## for h2, ### for h3)
  - Code: ``` with language tag
  - Lists: Use - for unordered, 1. for ordered
  - Links: [text](url)
  - Bold: **important terms**
```

## Quality Review Process

```yaml
Minimum criteria:
  - No typos or grammar errors
  - Code examples are correct
  - Screenshots match current UI
  - Links are valid
  - Follows style guide

Review checklist:
  [ ] Accurate? (technically correct)
  [ ] Clear? (readable by target audience)
  [ ] Complete? (covers the topic)
  [ ] Examples work? (copy-paste tested)
  [ ] Links correct?
```

## Recognizing Doc Contributors

- "Documentation Hero" Discord role
- Listed in docs/contributors.md
- Monthly "Best Doc" award ($100 gift card)
- Annual "Documentation Impact Award" ($500 + trophy)

## See Also

Related community, contributing, and governance documentation.

- [Community Overview](../community/01-building-community.md)
- [Contributing Guide](../contributing/01-contributing-overview.md)
- [Community Projects](../community-projects/01-community-projects-overview.md)
- [Governance](../governance/01-governance-overview.md)
