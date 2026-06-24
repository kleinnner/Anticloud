---
title: "WCAG Compliance Statement"
sidebar_position: 2
description: "API-OSS compliance with Web Content Accessibility Guidelines (WCAG) 2.1."
tags: [accessibility]
---

# WCAG Compliance Statement

## Overview

API-OSS compliance with Web Content Accessibility Guidelines (WCAG) 2.1.

## Compliance Level

**Target: WCAG 2.1 AA**

| Principle | Status | Notes |
|---|---|---|
| Perceivable | Compliant | All non-text content has alternatives |
| Operable | Compliant | Keyboard accessible, no seizures |
| Understandable | Compliant | Readable, predictable input |
| Robust | Compliant | Compatible with assistive tech |

## Specific Criteria

### Perceivable

```yaml
1.1.1 Non-text Content: All images have alt text
1.2.1 Audio-only/Video-only: Transcripts available
1.3.1 Info and Relationships: Semantic HTML
1.4.1 Use of Color: Not sole indicator
1.4.3 Contrast: 4.5:1 minimum
```

### Operable

```yaml
2.1.1 Keyboard: Full keyboard navigation
2.1.2 No Keyboard Trap: Focus can be moved
2.2.1 Timing Adjustable: No time limits
2.4.1 Bypass Blocks: Skip navigation links
2.4.2 Page Titled: Descriptive titles
```

### Understandable

```yaml
3.1.1 Language: lang attribute specified
3.2.2 On Input: No unexpected changes
3.3.2 Labels: Form labels provided
3.3.3 Error Suggestion: Helpful error messages
```

### Robust

```yaml
4.1.1 Parsing: Valid HTML
4.1.2 Name, Role, Value: ARIA attributes correct
```

## Next

- [Accessibility Features](03-accessibility-features.md)
