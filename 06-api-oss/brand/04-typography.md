---
title: "Typography"
sidebar_position: 4
description: "Typography guidelines for API-OSS."
tags: [brand]
---

# Typography

## Overview

Typography guidelines for API-OSS.

## Font Family

```yaml
headings:
  font: Inter
  weight: 700 (Bold)
  fallback: system-ui, -apple-system, sans-serif

body:
  font: Inter
  weight: 400 (Regular)
  fallback: system-ui, -apple-system, sans-serif

code:
  font: JetBrains Mono
  weight: 400 (Regular)
  fallback: "Fira Code", "Cascadia Code", monospace
```

## Type Scale

```yaml
h1: 36px / 2.25rem
h2: 30px / 1.875rem
h3: 24px / 1.5rem
h4: 20px / 1.25rem
body: 16px / 1rem
small: 14px / 0.875rem
caption: 12px / 0.75rem
```

## Line Heights

```yaml
headings: 1.2
body: 1.5
code: 1.4
```

## Usage

```css
/* Headings */
font-family: 'Inter', system-ui, sans-serif;
font-weight: 700;

/* Body */
font-family: 'Inter', system-ui, sans-serif;
font-weight: 400;

/* Code */
font-family: 'JetBrains Mono', monospace;
```

## Next

- [Voice and Tone](05-voice-and-tone.md)

## See Also

Related brand, press, and style documentation.

- [Brand Guidelines](../brand/01-brand-guidelines.md)
- [Press Kit](../press/01-press-kit.md)
- [Voice and Tone](../brand/05-voice-and-tone.md)
- [Logo Usage](../brand/02-logo-usage.md)
