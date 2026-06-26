                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# 08 — Workspace Management

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Overview](#overview)
2. [What Are Synthetic Workspaces?](#what-are-synthetic-workspaces)
3. [Creating a Workspace](#creating-a-workspace)
4. [Managing Workspaces](#managing-workspaces)
5. [Using Workspaces in the CLI](#using-workspaces-in-the-cli)
6. [Using Workspaces on the Canvas](#using-workspaces-on-the-canvas)
7. [Workspace History and Restoration](#workspace-history-and-restoration)
8. [Sharing Workspaces](#sharing-workspaces)
9. [Automation and Workspaces](#automation-and-workspaces)
10. [Workspace Best Practices](#workspace-best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Overview

Workspaces are one of Kamelot's most powerful organizational concepts. They replace traditional folders with dynamic, query-based collections of files. A workspace is essentially a saved semantic search that continuously updates as you add more files to your store.

This approach solves a fundamental problem with traditional folders: a file can only be in one folder (or requires symlinks/hardlinks to appear in multiple places). With workspaces, a file can belong to any number of workspaces simultaneously, because workspaces are just queries — they don't own files, they reference them.

## What Are Synthetic Workspaces?

A synthetic workspace is a named, saved query that produces a dynamic collection of files. Unlike a folder, which is a static container, a workspace is a lens through which you view a subset of your files.

### Folder vs. Workspace

| Aspect | Traditional Folder | Kamelot Workspace |
|--------|-------------------|-------------------|
| Nature | Static container | Dynamic query |
| Membership | Explicit (move file in) | Implicit (matches query) |
| Updates | Manual | Automatic |
| Duplication | File can be in one folder | File can be in many workspaces |
| Empty state | Empty folder | Query returns fewer results |
| Deletion | Deletes files | Removes the view only |
| Storage | Filesystem metadata | Just the query text |

### How Workspaces Work

```
Workspace: "Q4 2025 Financial Documents"
Query: files semantically related to "Q4 2025 financial documents"
      + MIME type filter: application/pdf, application/xlsx
      + Tag filter: #finance
      + Date filter: October 2025 - December 2025
      ↓
Dynamic set of files matching ALL criteria
      ↓
When new files matching these criteria are added, they automatically appear
```

### Workspace Types

**Query Workspace:** Based on a natural language query
```
"meeting notes from the product team"
```

**Filter Workspace:** Based on explicit filters
```
@pdf #finance since:2025-01-01
```

**Hybrid Workspace:** Combines query and filters
```
"budget spreadsheets" @xlsx #work since:2025-01-01
```

**Canvas Workspace:** Based on canvas spatial selection
```
All files within a rectangular region of the canvas
```

**Ledger Workspace:** Based on ledger state
```
All files that existed on a specific date
```

## Creating a Workspace

### From the CLI

```bash
# Create a workspace from a query
kml workspace create "Q4 Financial Documents" \
  --query "Q4 2025 financial documents" \
  --mime application/pdf \
  --mime application/xlsx \
  --tag finance \
  --since "2025-10-01" \
  --until "2025-12-31"

# Create a workspace from a file
kml workspace create "Similar to tax return" \
  --similar-to tax-return-2025.pdf \
  --min-score 0.8

# Create an empty workspace (for manual file addition)
kml workspace create "My Custom Collection" --empty
```

### From the Canvas

1. Press `Ctrl+Shift+S` or click Workspaces → "Create Workspace"
2. Enter a name
3. Optionally set a query and filters
4. Click "Create"

[screenshot: creating-workspace-dialog.png]
*Workspace creation dialog on the canvas.*

### From the Omnibox

1. Search for files
2. Ctrl+S → "Save as Workspace"
3. Enter a name
4. The current search becomes a workspace

### From Search Results

```bash
# Save any query as a workspace
kml query "tax documents" --save-as-workspace "Tax Documents 2025"
```

### Importing a Workspace

```bash
# Import a workspace from a file
kml workspace import ./workspace-config.yaml

# YAML format:
# name: "Research Papers"
# query: "machine learning papers"
# tags: [academic, research]
# mime_types: [application/pdf]
# created_after: "2025-01-01"
```

## Managing Workspaces

### Listing Workspaces

```bash
kml workspace list
```

Output:
```
Workspaces:
  Name                          Files   Query                  Created
  ────────────────────────────  ──────  ─────────────────────  ───────────────────
  Q4 Financial Documents        12      "Q4 2025 financial"   2026-06-19 10:00:00
  Research Papers               45      "machine learning"    2026-06-18 15:30:00
  Vacation Photos               23      "vacation" @image     2026-06-15 09:00:00
  Meeting Notes                 67      "meeting notes"       2026-06-10 14:00:00
```

### Viewing Workspace Contents

```bash
# Show files in a workspace
kml workspace show "Q4 Financial Documents"

# With verbose output
kml workspace show "Q4 Financial Documents" --verbose

# As JSON
kml workspace show "Research Papers" --format json
```

### Updating a Workspace

```bash
# Change the query
kml workspace update "Q4 Financial Documents" --query "Q4 2025 budget and financial reports"

# Add a filter
kml workspace update "Research Papers" --tag peer-reviewed

# Change the name
kml workspace rename "Q4 Financial Documents" "Q4 2025 Finance"
```

### Deleting a Workspace

```bash
# Delete a workspace (does NOT delete the files)
kml workspace delete "Temporary Collection"
```

### Workspace Statistics

```bash
# Show workspace statistics
kml workspace stats "Q4 Financial Documents"
```

Output:
```
Workspace: Q4 Financial Documents
  Files:      12
  Raw Size:   45.2 MB
  Last View:  2026-06-19 11:00:00
  Created:    2026-06-19 10:00:00
  Changes:    3 files added, 0 removed since creation
  Dynamic:    Yes (auto-updates)
```

## Using Workspaces in the CLI

### Query Within a Workspace

```bash
# Search only within a workspace
kml query "budget" --workspace "Q4 Financial Documents"

# This is equivalent to:
# kml query "budget Q4 2025 financial documents" @pdf @xlsx #finance
# But more precise because it uses the workspace's full query context
```

### Ingest into a Workspace

When you ingest a file, you can add it to a workspace:

```bash
kml put new-document.pdf --workspace "Q4 Financial Documents"

# Add to multiple workspaces
kml put new-document.pdf \
  --workspace "Q4 Financial Documents" \
  --workspace "Important Documents"
```

### Batch Operations with Workspaces

```bash
# Export all files in a workspace
kml workspace export "Q4 Financial Documents" --output ./export/

# Copy all files to another store
kml workspace copy "Research Papers" --target-store ~/research_kamelot

# Add a tag to all files in a workspace
kml workspace tag "Q4 Financial Documents" --add "reviewed"

# Remove a tag from all files
kml workspace tag "Meeting Notes" --remove "draft"
```

### Pinning a Workspace

```bash
# Pin a workspace for quick access
kml workspace pin "Q4 Financial Documents"

# List pinned workspaces
kml workspace list --pinned

# Unpin
kml workspace unpin "Q4 Financial Documents"
```

## Using Workspaces on the Canvas

### Opening a Workspace

On the canvas toolbar, click "Workspaces" → select a workspace:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Workspaces                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  [Q4 Financial Documents]  [Research Papers]  [Vacation Photos]    │  │
│  │  [+ Create New Workspace]                                          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

Selecting a workspace:
1. Zooms the canvas to show only files in that workspace
2. Highlights workspace files with a colored border
3. DIMS all non-workspace files

### Workspace as a Canvas Layer

Workspaces can be treated as layers:

- **Foreground:** Current workspace files (fully visible)
- **Background:** Other files (dimmed, 20% opacity)
- **Hidden:** Non-workspace files can be toggled off

### Multiple Workspaces on Canvas

You can view multiple workspaces simultaneously:

```bash
kml canvas show-workspaces "Q4 Financial Documents" "Research Papers"
```

Each workspace gets a distinct color:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  [BLUE] Q4 Financial Documents                                   │
│    ├── budget.xlsx                                               │
│    └── report.pdf                                                │
│                                                                  │
│  [GREEN] Research Papers                                         │
│    ├── paper1.pdf                                                │
│    ├── paper2.pdf                                                │
│    └── notes.md                                                  │
│                                                                  │
│  Files in both workspaces appear with a split-color indicator    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Workspace-Specific Layouts

Each workspace can have its own canvas layout:

```bash
# Save the current canvas arrangement as the workspace layout
kml workspace layout save "Q4 Financial Documents"

# Restore the workspace's saved layout
kml workspace layout restore "Q4 Financial Documents"

# Reset layout
kml workspace layout reset "Research Papers"
```

When you switch to a workspace, its saved layout is automatically restored.

### Workspace Tabs

Workspaces appear as tabs at the top of the canvas:

```
┌──────────────────────────────────────────────────────────────────┐
│  [All Files]  [Q4 Finance]  [Research]  [Vacation Photos]  [+] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  (Canvas shows only files in the active tab)                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

- Click a tab to switch workspaces
- `Ctrl+Tab`: Next workspace
- `Ctrl+Shift+Tab`: Previous workspace
- Close button (`×`) on tab to close workspace

### Workspace and Canvas Annotations

Annotations are workspace-scoped by default:

- Notes created while in a workspace are associated with that workspace
- They are visible only when that workspace is active
- Global annotations (visible in all workspaces) can be created with `Ctrl+Shift+N`

## Workspace History and Restoration

### Workspace Change Log

Every change to a workspace is recorded:

```bash
kml workspace history "Q4 Financial Documents"
```

Output:
```
Workspace History: Q4 Financial Documents
  Created:   2026-06-19 10:00:00
  Updated:   2026-06-19 12:00:00 (query changed)
  Updated:   2026-06-19 14:00:00 (tag "approved" added)
  Updated:   2026-06-19 16:00:00 (3 files matched, 1 no longer matches)
```

### Workspace Snapshots

You can take snapshots of a workspace at a point in time:

```bash
# Take a snapshot
kml workspace snapshot "Q4 Financial Documents"

# List snapshots
kml workspace snapshots "Q4 Financial Documents"

# Restore to a snapshot
kml workspace restore "Q4 Financial Documents" --snapshot 2026-06-19T12:00:00Z
```

### Workspace Rollback

If a workspace configuration has been corrupted:

```bash
# Roll back to a previous state
kml workspace rollback "Q4 Financial Documents" --hours 1
```

### Auto-Save

Workspaces are automatically saved every 5 minutes:

```bash
# Configure auto-save interval
kml config set workspaces.auto_save_interval 5  # minutes

# Disable auto-save
kml config set workspaces.auto_save_interval 0
```

## Sharing Workspaces

### Export Workspace Configuration

```bash
# Export a workspace to share with others
kml workspace export-config "Research Papers" --output research-papers.yaml
```

This exports the workspace definition (query, filters, tags, layout) as YAML:

```yaml
name: Research Papers
version: 1
query: "machine learning"
filters:
  mime_types:
    - application/pdf
  tags:
    - academic
    - research
  since: "2025-01-01"
canvas_layout:
  nodes:
    - inode: "7f3a5c91-..."
      position: { x: 100, y: 200 }
    - inode: "a1b2c3d4-..."
      position: { x: 300, y: 150 }
  links:
    - from: "7f3a5c91-..."
      to: "a1b2c3d4-..."
```

### Import Workspace Configuration

```bash
kml workspace import research-papers.yaml
```

### Share via K-Swarm

```bash
# Share workspace with a connected peer
kml kswarm share-workspace "Research Papers" --peer alice

# Share with all peers
kml kswarm share-workspace "Q4 Financial Documents" --all
```

### Collaborative Workspaces

If you have K-Swarm configured, workspaces can be collaborative:

```bash
# Make a workspace collaborative
kml workspace collaborate "Team Project" --enable

# Invite peers
kml workspace invite "Team Project" --peer bob --peer charlie

# View collaborators
kml workspace members "Team Project"
```

Collaborative workspaces sync:
- File membership (which files match)
- Canvas layouts (node positions)
- Annotations
- Links between nodes

## Automation and Workspaces

### Auto-Create Workspaces

```bash
# Auto-create workspaces based on common topics
kml workspace auto-create --min-files 5 --threshold 0.7

# This creates workspaces like:
# - "Tax Documents" (18 files)
# - "Meeting Notes" (45 files)
# - "Budget Spreadsheets" (12 files)
```

### Scheduled Workspace Operations

```bash
# Schedule a workspace cleanup
kml workspace schedule "Research Papers" \
  --remove-older-than 90 \
  --every "monday at 9am"
```

### Webhook Integration

Workspaces can trigger webhooks when files are added/removed:

```bash
kml workspace webhook "Important Documents" \
  --url "https://hooks.example.com/kamelot" \
  --on-add \
  --on-remove
```

### Workspace Notifications

```bash
# Get notified when a workspace changes
kml workspace watch "Q4 Financial Documents"

# Desktop notification when new files match
kml config set workspaces.notifications true
```

### Templated Workspaces

Create workspace templates:

```yaml
# template-project.yaml
name: "{{project_name}}"
query: "{{project_name}} {{project_keyword}}"
filters:
  tags: ["{{project_keyword}}"]
  mime_types:
    - application/pdf
    - application/xlsx
canvas_layout:
  auto_cluster: true
  auto_link: true
  cluster_threshold: 0.75
```

Apply the template:

```bash
kml workspace template ./template-project.yaml \
  --var project_name="Q1 2026 Planning" \
  --var project_keyword="planning"
```

## Workspace Best Practices

### Naming Conventions

Good workspace names are:
- **Descriptive:** "Q4 2025 Financial Documents" not "Finance Stuff"
- **Searchable:** Names that would match if you searched for them
- **Consistent:** Use a consistent naming scheme

Examples:
```
Tax Documents 2025
Tax Documents 2026
Meeting Notes - Product Team
Meeting Notes - Engineering Team
Budget Spreadsheets - Personal
Budget Spreadsheets - Work
```

### Granularity

- **Too broad:** "All Documents" (defeats the purpose)
- **Too narrow:** "The specific PDF I opened last Tuesday" (over-engineered)
- **Just right:** "Q4 2025 Budget Reports" (specific but not overly narrow)

### Workspace vs. Tags

- Use **tags** for cross-cutting concerns (e.g., `#important`, `#reviewed`)
- Use **workspaces** for thematic collections (e.g., "Tax Documents 2025")
- Use **both** combined for precision

### Maintenance

```bash
# Find unused workspaces
kml workspace unused --older-than 30

# Archive unused workspaces
kml workspace archive "Old Project"

# List archived workspaces
kml workspace list --archived

# Unarchive
kml workspace unarchive "Old Project"
```

### Workspace Lifecycle

1. **Create:** Start with a specific query
2. **Refine:** Adjust query and filters as needed
3. **Use:** Browse files, add annotations, build canvas layout
4. **Archive:** When no longer actively used
5. **Delete:** When no longer needed (files are NOT deleted)

## Troubleshooting

### Workspace Shows Wrong Files

```bash
# Check the workspace definition
kml workspace show "My Workspace" --definition

# Rebuild the workspace
kml workspace rebuild "My Workspace"

# Check for query syntax errors
kml workspace validate "My Workspace"
```

### Workspace Empty

```bash
# Check if store has any files
kml list --count

# Check workspace query
kml workspace show "My Workspace" --definition

# Test the query directly
kml query "your workspace query text"

# Relax filters
kml workspace update "My Workspace" --min-score 0.5
```

### Workspace Too Large

```bash
# Add more specific filters
kml workspace update "My Workspace" --min-score 0.8

# Limit number of files
kml workspace update "My Workspace" --limit 100

# Add date range
kml workspace update "My Workspace" --since "2026-01-01"
```

### Collaborative Workspace Sync Issues

```bash
# Force sync
kml kswarm sync-workspace "Team Project"

# Check K-Swarm status
kml kswarm status

# Resolve conflicts
kml workspace resolve-conflicts "Team Project"
```

### Workspace Layout Lost

```bash
# Check if layout was saved
kml workspace layout list "My Workspace"

# Restore from auto-save
kml workspace layout restore "My Workspace" --auto-save

# Manual layout restore from snapshot
kml workspace layout restore "My Workspace" --snapshot latest
```

---

*Next tutorial: [09 — K-Swarm Setup](09-k-swarm-setup.md)*

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com