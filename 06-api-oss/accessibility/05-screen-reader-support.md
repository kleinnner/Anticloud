---
title: "Screen Reader Support"
sidebar_position: 5
description: "Screen reader compatibility guide for API-OSS."
tags: [accessibility]
---

# Screen Reader Support

## Overview

Screen reader compatibility guide for API-OSS.

## Supported Screen Readers

| Screen Reader | OS | Browser | Status |
|---|---|---|---|
| VoiceOver | macOS | Safari | Supported |
| NVDA | Windows | Firefox | Supported |
| JAWS | Windows | Chrome | Supported |
| TalkBack | Android | Chrome | Supported |
| Narrator | Windows | Edge | Supported |

## ARIA Landmarks

```html
<header role="banner">
<nav role="navigation" aria-label="Main navigation">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">
```

## Live Regions

```html
<!-- Status updates -->
<div role="status" aria-live="polite">
  API key created successfully
</div>

<!-- Error messages -->
<div role="alert">
  Invalid API key
</div>
```

## Dynamic Content

```yaml
screen_reader_updates:
  - Loading states announced
  - Search results announced
  - Error messages announced
  - Status changes announced
  - Modal openings announced
```

## Testing

```bash
# Run accessibility tests
npm run test:a11y

# Generate report
npx axe dist/ --save report.json
```

## Next

- [Accessibility Testing](06-accessibility-testing.md)
