---
sidebar_label: Diff Viewer
description: Compare files, directories, and text with a side-by-side diff viewer supporting syntax highlighting, merge previews, and patch generation.
keywords: [developer utilities, productivity, diff viewer, CLI tools, developer experience, Anticloud]
image: /img/anticloud-social.png
---

# Diff Viewer

Diff Viewer provides a visual interface for comparing text, code, and configuration files. It supports unified and side-by-side views with syntax highlighting for over 100 languages.

## Features

- Side-by-Side Comparison: Dual-pane view with line-level change highlighting and navigation
- Syntax Highlighting: Language-aware diff display for code, markup, and configuration files
- Directory Diff: Compare entire directory trees with file-level change summaries
- Patch Generation: Create and apply unified diff patches with context control
- Inline Editing: Edit files directly in the diff view with real-time update preview

## Workflow

```mermaid
flowchart LR
    A[Original File] --> B[Comparison Engine]
    B --> C[Diff Computation]
    C --> D[Syntax Highlighting]
    D --> E[Side-by-Side Display]
    E --> F[Patch Export]
```

## Usage

View the full documentation on GitHub: [Tool Directory](https://github.com/kleinnner/Anticloud/tree/main/12-api-oss-tools/diff-viewer)

## Related Tools

- [JSON Explorer](../utilities/json-explorer)
- [SQL Formatter](../utilities/sql-formatter)
- [Regex Playground](../utilities/regex-playground)
