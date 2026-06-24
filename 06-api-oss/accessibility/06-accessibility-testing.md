---
title: "Accessibility Testing"
sidebar_position: 6
description: "Testing methodology for API-OSS accessibility."
tags: [accessibility]
---

# Accessibility Testing

## Overview

Testing methodology for API-OSS accessibility.

## Automated Testing

```bash
# Axe accessibility checks
npx axe http://localhost:3000 --save report.json

# Lighthouse CI
npx lighthouse http://localhost:3000 --output html

# Pa11y CI
npx pa11y-ci --sitemap http://localhost:3000/sitemap.xml
```

## Manual Testing

```yaml
checklist:
  - Navigate with keyboard only
  - Test with screen reader
  - Zoom to 200% - no content loss
  - Check color contrast
  - Verify form labels
  - Check heading hierarchy
  - Test focus indicators
  - Verify ARIA labels
```

## CI Integration

```yaml
# .github/workflows/a11y.yml
name: Accessibility
on: [pull_request]
jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker compose up -d
      - run: npx axe http://localhost:3000
      - uses: dequelabs/axe-github-actions@v3
```

## Report

```bash
npm run test:a11y
# Output: a11y-report.html
```

## Next

- [Accessibility Roadmap](07-accessibility-roadmap.md)
