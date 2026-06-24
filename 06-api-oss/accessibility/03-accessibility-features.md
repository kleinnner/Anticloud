---
title: "Accessibility Features"
sidebar_position: 3
description: "Accessibility features in API-OSS."
tags: [accessibility]
---

# Accessibility Features

## Overview

Accessibility features in API-OSS.

## Dashboard

```yaml
keyboard:
  - Tab navigation through all controls
  - Enter/Space to activate
  - Escape to close modals
  - Arrow keys for navigation menus

screen_reader:
  - ARIA labels on all interactive elements
  - Semantic heading structure
  - Alt text on all images
  - Status announcements for dynamic content

visual:
  - High contrast mode
  - Resizable text (up to 200%)
  - Reduced motion option
  - Color-blind friendly palette
```

## CLI

```yaml
screen_reader:
  - Structured output format (--json)
  - No ANSI colors by default (--no-color)
  - Descriptive error messages
  - Consistent command structure
```

## API

```yaml
accessibility:
  - Structured error responses
  - Clear error messages
  - Consistent response format
  - Rate limit feedback
```

## Next

- [Keyboard Shortcuts](04-keyboard-shortcuts.md)
