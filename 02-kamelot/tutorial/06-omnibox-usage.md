                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# 06 — Omnibox Usage

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Overview](#overview)
2. [What is the Omnibox?](#what-is-the-omnibox)
3. [Installation and Setup](#installation-and-setup)
4. [Global Hotkey](#global-hotkey)
5. [Basic Usage](#basic-usage)
6. [Query Syntax](#query-syntax)
7. [Result Materialization](#result-materialization)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Search History](#search-history)
10. [Filters and Modifiers](#filters-and-modifiers)
11. [Omnibox Actions](#omnibox-actions)
12. [Integration with Canvas](#integration-with-canvas)
13. [Configuration](#configuration)
14. [Theming](#theming)
15. [Troubleshooting](#troubleshooting)
16. [Tips and Tricks](#tips-and-tricks)

---

## Overview

The omnibox is Kamelot's desktop-wide search interface. It is a lightweight, always-available window that appears on top of any application when you press the global hotkey. You type a natural language query, and the omnibox displays matching files from your Kamelot store in real-time.

Unlike traditional desktop search tools (which index filenames and content as keywords), the omnibox uses Kamelot's semantic vector search to understand the meaning behind your query. It doesn't just find files whose names contain your search terms — it finds files that are conceptually related to what you're asking for.

The omnibox is written in Rust and rendered using native GPU acceleration. It is a separate process from the full canvas UI, designed to be lightweight and launch instantly.

## What is the Omnibox?

The omnibox is a small overlay window that provides:

- Instant semantic search across all files in your Kamelot store
- Real-time results as you type (debounced by 150ms)
- File preview and quick actions (open, copy, reveal)
- Drag-and-drop integration with the canvas
- Search history with frequency-based ranking
- Filter chips for MIME type, tags, and date ranges

### Architecture

```
┌──────────────────────────────────────────────┐
│              Desktop Environment              │
│  ┌────────────────────────────────────────┐  │
│  │     Current Application (Browser,      │  │
│  │     Editor, Terminal, etc.)            │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │         Omnibox Overlay Window         │  │
│  │  ┌────────────────────────────────┐    │  │
│  │  │  Search: [find my tax doc █]   │    │  │
│  │  ├────────────────────────────────┤    │  │
│  │  │  📄 tax-return-2025.pdf  0.94 │    │  │
│  │  │  📄 irs-forms.pdf        0.87 │    │  │
│  │  │  📊 budget-2025.xlsx     0.72 │    │  │
│  │  └────────────────────────────────┘    │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

## Installation and Setup

### Installing the Omnibox Daemon

The omnibox runs as a background daemon process. It is included with the Kamelot UI installation.

```bash
# If installed via package manager
# The daemon is installed automatically

# If installed via cargo
cargo install kamelot --features daemon

# Verify the daemon is available
kml daemon --help
```

### Starting the Daemon

```bash
# Start the daemon (runs in background)
kml daemon start

# Start with a specific store
kml daemon start --store ~/work_kamelot

# Start with verbose logging
kml daemon start --verbose
```

### Auto-Start on Login

**Linux (systemd):**

```bash
# Create a user service
mkdir -p ~/.config/systemd/user/

cat > ~/.config/systemd/user/kamelot-daemon.service << 'EOF'
[Unit]
Description=Kamelot Omnibox Daemon
After=network.target

[Service]
ExecStart=%h/.cargo/bin/kml daemon start --store %h/kamelot_data
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
EOF

# Enable and start
systemctl --user enable kamelot-daemon
systemctl --user start kamelot-daemon
```

**Windows (Task Scheduler):**

```powershell
# Create a scheduled task
$action = New-ScheduledTaskAction -Execute "kml.exe" -Argument "daemon start --store C:\kamelot_data"
$trigger = New-ScheduledTaskTrigger -AtLogOn
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount
Register-ScheduledTask -TaskName "KamelotOmniboxDaemon" -Action $action -Trigger $trigger -Principal $principal
Start-ScheduledTask -TaskName "KamelotOmniboxDaemon"
```

**macOS (LaunchAgent):**

```bash
cat > ~/Library/LaunchAgents/gg.0-1.kamelot.daemon.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>gg.0-1.kamelot.daemon</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/kml</string>
        <string>daemon</string>
        <string>start</string>
        <string>--store</string>
        <string>/Users/username/kamelot_data</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/gg.0-1.kamelot.daemon.plist
```

## Global Hotkey

The omnibox is activated by a global hotkey that works across all applications.

### Default Hotkey

| Platform | Default Hotkey |
|----------|----------------|
| Linux | `Super+Space` |
| Windows | `Win+Space` |
| macOS | `Cmd+Space` |

If the default hotkey conflicts with your system (e.g., macOS uses `Cmd+Space` for Spotlight), you can change it.

### Configuring the Hotkey

```bash
# Change the hotkey
kml config set omnibox.hotkey "Alt+Space"

# Common alternatives:
# Ctrl+Space  (may conflict with IDE autocomplete)
# Alt+Space   (good on most platforms)
# Ctrl+Shift+F
# Super+K     (Atom-style)
```

Supported modifier keys: `Ctrl`, `Alt`, `Shift`, `Super` (Windows/Command key).

Supported regular keys: `Space`, `A-Z`, `F1-F12`, `0-9`, etc.

### Multiple Hotkeys

```bash
kml config set omnibox.hotkey "Super+Space,Ctrl+Shift+F"
```

### System-Specific Notes

**Linux (X11):**

The daemon uses `xdotool` or the `keybinder` library. Ensure you have the necessary dependencies:

```bash
sudo apt install libkeybinder-3.0-0  # Debian/Ubuntu
sudo dnf install keybinder3          # Fedora
```

**Linux (Wayland):**

Wayland restricts global hotkey registration. The omnibox uses the `wlr-foreign-toplevel-management` protocol. Ensure your compositor supports it:

- GNOME: Requires the `KGlobalAccel` daemon
- KDE: Built-in support
- Sway: Built-in support
- Hyprland: Built-in support

**Windows:**

Works natively. The hotkey is registered using `RegisterHotKey` Win32 API.

**macOS:**

Requires accessibility permissions:

1. Open System Settings → Privacy & Security → Accessibility
2. Add `kml` and/or `kamelot-daemon` to the list

## Basic Usage

### Opening the Omnibox

Press `Super+Space` (or your configured hotkey). The omnibox appears centered at the top of your screen:

```
┌──────────────────────────────────────────────────────────────────────┐
│  🔍  find my tax documents                                    [⌃K]  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  No results yet. Start typing to search...                          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Typing a Query

Start typing your query. Results appear after a 150ms debounce:

```
┌──────────────────────────────────────────────────────────────────────┐
│  🔍  find my tax documents                                    [⌃K]  │
├──────────────────────────────────────────────────────────────────────┤
│  📄  tax-return-2025.pdf                               0.94  just now│
│      Q4 2025 tax filing document                                     │
│  📄  irs-form-1040.pdf                                 0.87  2 days  │
│      IRS 1040 form for 2025 tax year                                │
│  📄  w2-2025.png                                       0.83  2 days  │
│      W-2 form from employer                                         │
│  📊  budget-2025.xlsx                                  0.72  1 week  │
│      Annual budget spreadsheet                                      │
│                                                                      │
│  4 results (0.3s)                                                    │
└──────────────────────────────────────────────────────────────────────┘
```

### Selecting a Result

**Mouse:** Click the result to open it.

**Keyboard:**
- `↓` / `↑`: Navigate through results
- `Enter`: Open selected file
- `Ctrl+Enter`: Open file location in file manager

### Closing the Omnibox

- `Escape`: Close without selecting
- `Ctrl+W`: Close
- Click outside the omnibox: Close

## Query Syntax

The omnibox supports the same query syntax as the CLI:

### Natural Language

```text
find my tax documents
show me budget spreadsheets from last quarter
photos from vacation in hawaii
project proposal for the board meeting
```

### Tag Filters

```text
#work        Files tagged with "work"
#important   Files tagged with "important"
#work #finance  Files with both tags
```

### MIME Type Filters

```text
@pdf         Only PDF files
@image       Only images (all image types)
@code        Only code files
@text        Only text files
@spreadsheet Only spreadsheet files
```

### Date Filters

```text
today        Files ingested today
yesterday    Files ingested yesterday
this week    Files from this week
this month   Files from this month
since:2025-06-01  Files since a date
until:2025-12-31  Files until a date
```

### Combined Queries

```text
tax documents @pdf #work
budget @spreadsheet this month
photos @image since:2026-01-01
```

### Exact Name Match

```text
name:"tax-return-2025.pdf"  Exact filename match
```

### Inode Lookup

```text
id:7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c  Look up by inode
```

## Result Materialization

"Materialization" refers to the process of making a search result into an actual usable file. The omnibox provides several ways to materialize results.

### Open File

Pressing `Enter` opens the file with the default application for its MIME type:

- `application/pdf` → opens in PDF viewer
- `text/plain` → opens in text editor
- `image/jpeg` → opens in image viewer

### Copy File

Copy the file to the system clipboard:

- `Ctrl+C`: Copy file content (text files) or file path
- `Ctrl+Shift+C`: Copy the file itself (as a file copy operation)

### Drag and Drop

You can drag a result from the omnibox into any application that accepts file drops:

1. Select a result with the mouse
2. Drag it out of the omnibox
3. Drop it into an email, document, or folder

### Reveal in File Manager

- `Ctrl+Enter`: Open the containing folder in the system file manager

### Save to Disk

```text
Ctrl+S: Save a copy to a specific location
```

### Share via K-Swarm

```text
Ctrl+Shift+S: Share file with a connected K-Swarm peer
```

### Open in Canvas

```text
Ctrl+Shift+Enter: Open the file on the infinite canvas
```

## Keyboard Shortcuts

### Navigation

| Shortcut | Action |
|----------|--------|
| `↓` | Next result |
| `↑` | Previous result |
| `Page Down` | Next page |
| `Page Up` | Previous page |
| `Home` | First result |
| `End` | Last result |

### Actions

| Shortcut | Action |
|----------|--------|
| `Enter` | Open selected file |
| `Ctrl+Enter` | Reveal in file manager |
| `Shift+Enter` | Open with... (choose application) |
| `Ctrl+Shift+Enter` | Open on canvas |
| `Ctrl+C` | Copy file path to clipboard |
| `Ctrl+Shift+C` | Copy file content to clipboard |
| `Ctrl+S` | Save as... |
| `Ctrl+D` | Download/share via K-Swarm |
| `Delete` | Remove from store |
| `Ctrl+E` | Edit file metadata (tags, name) |
| `Ctrl+I` | Show file info |

### Omnibox Controls

| Shortcut | Action |
|----------|--------|
| `Escape` | Close omnibox |
| `Ctrl+W` | Close omnibox |
| `Ctrl+K` | Clear search (focus input) |
| `Ctrl+L` | Focus search input |
| `Ctrl+Backspace` | Delete word before cursor |
| `Ctrl+Delete` | Delete word after cursor |
| `Ctrl+←` | Previous word |
| `Ctrl+→` | Next word |
| `Ctrl+A` | Select all text |
| `Tab` | Complete current filter |
| `Shift+Tab` | Cycle filter backward |

### History

| Shortcut | Action |
|----------|--------|
| `Ctrl+R` | Search history mode |
| `Ctrl+Shift+R` | Clear search history |
| `↑` (in empty search) | Previous search from history |

### Filter Chips

| Shortcut | Action |
|----------|--------|
| `Ctrl+T` | Add tag filter |
| `Ctrl+M` | Add MIME type filter |
| `Ctrl+D` | Add date filter |
| `Backspace` (on empty input) | Remove last filter chip |

## Search History

The omnibox maintains a history of your searches, ranked by frequency and recency.

### Viewing History

Press `Ctrl+R` or click the history icon to enter history mode:

```
┌──────────────────────────────────────────────────────────────────────┐
│  🔍  [history mode]                                           [⌃R]  │
├──────────────────────────────────────────────────────────────────────┤
│  🔄  find my tax documents                               12 times   │
│  🔄  budget spreadsheets                                 8 times    │
│  🔄  project files                                       5 times    │
│  🔄  vacation photos                                     3 times    │
│  🔄  meeting notes                                       2 times    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Searching History

While in history mode, typing filters the history list:

```
┌──────────────────────────────────────────────────────────────────────┐
│  🔍  [history] tax                                            [⌃R]  │
├──────────────────────────────────────────────────────────────────────┤
│  🔄  find my tax documents                               12 times   │
│  🔄  tax forms from irs                                    4 times   │
│  🔄  state tax return                                      2 times   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### History Storage

Search history is stored at:

- **Linux/macOS:** `~/.local/share/kamelot/history.db`
- **Windows:** `%APPDATA%\Kamelot\history.db`

The history database uses SQLite and stores:

- Query text (normalized, lowercased)
- Timestamp of last use
- Frequency count
- Filters used with the query (tags, MIME types, dates)

### Clearing History

```bash
# Clear all history
kml daemon history --clear

# Clear history older than 30 days
kml daemon history --prune 30

# Disable history
kml config set omnibox.history.enabled false
```

### Privacy

History is stored locally only. It is never sent to any server.

You can enable incognito mode:

```bash
# Toggle incognito
kml config set omnibox.incognito true

# In incognito mode:
# - No history is recorded
# - No typing is cached
# - Results are not preloaded
```

## Filters and Modifiers

### Filter Chips

The omnibox supports filter chips that appear below the search input:

```
┌──────────────────────────────────────────────────────────────────────┐
│  🔍  budget                                                    [⌃K]  │
│  [@spreadsheet ×] [#work ×] [since: 2026-01-01 ×]                  │
├──────────────────────────────────────────────────────────────────────┤
│  📊  budget-2025.xlsx                                  0.94  1 week  │
│  📊  q4-budget.xlsx                                    0.87  2 weeks │
│  📊  marketing-budget.xlsx                             0.72  1 month │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Adding Filters

**By typing:**
```text
budget @spreadsheet #work since:2026-01-01
```

**By keyboard:**
- `Ctrl+T`: Add tag filter → type tag name → Enter
- `Ctrl+M`: Add MIME type picker → select type → Enter
- `Ctrl+D`: Add date picker → select range → Enter

**By mouse:**
Click the "+" button next to the filter chips area.

### Removing Filters

- Click the `×` on a filter chip
- `Backspace` on empty input removes the last chip

### Filter Types

**MIME Type Filters:**
```text
@pdf        @docx       @xlsx       @pptx
@image      @jpeg       @png        @gif
@code       @rust       @python     @javascript
@text       @markdown   @csv        @json
@audio      @video      @archive
```

**Tag Filters:**
```text
#work       #personal   #important  #archive
#finance    #legal      #research   #design
```

**Date Filters:**
```text
today       yesterday   this week   this month
this year   last week   last month  last year
since:2026-01-01    until:2026-06-01
```

**Size Filters:**
```text
size>1MB    size<100KB  size:1MB-10MB
```

## Omnibox Actions

### File Info Panel

Press `Ctrl+I` on a selected result to show detailed file info:

```
┌──────────────────────────────────────────────────────────────────────┐
│  File Information                                                    │
│                                                                      │
│  Name:      tax-return-2025.pdf                                      │
│  Inode:     7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c                    │
│  Size:      245 KB (250,880 bytes)                                   │
│  MIME:      application/pdf                                          │
│  Created:   2026-06-19 10:00:00 UTC                                  │
│  Ledger:    Block #42                                                │
│  Tags:      finance, taxes, 2025                                     │
│  Author:    Jane Doe                                                  │
│  Embedding: 384 dims (cosine)                                        │
│                                                                      │
│  [Open]  [Reveal]  [Canvas]  [Share]  [Delete]                     │
└──────────────────────────────────────────────────────────────────────┘
```

### Quick Preview

For text-based files (`.txt`, `.md`, `.py`, `.rs`, etc.), hovering or selecting shows a preview:

```
┌──────────────────────────────────────────────────────────────────────┐
│  📄  notes.md                                              0.91      │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │ # Meeting Notes - June 19, 2026                          │       │
│  │                                                          │       │
│  ## Attendees                                             │       │
│  - John Smith (Product)                                    │       │
│  - Jane Doe (Engineering)                                  │       │
│  - Bob Wilson (Design)                                     │       │
│  └──────────────────────────────────────────────────────────┘       │
│  3 lines · 245 bytes                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### Batch Actions

Select multiple results with `Ctrl+Click` or `Shift+Click`, then:

- `Enter`: Open all selected
- `Ctrl+S`: Save all to a directory
- `Delete`: Remove all selected from store
- `Ctrl+Shift+Enter`: Add all to canvas

### Quick Actions Menu

Press `Ctrl+Shift+A` or right-click on a result:

```
┌────────────────────────────────────┐
│  Open                               │
│  Open With...                       │
│  Open Location                      │
│  Open on Canvas                     │
│  ─────────────────────              │
│  Copy Path                          │
│  Copy Content                       │
│  Copy File                          │
│  ─────────────────────              │
│  Share via K-Swarm                  │
│  Save As...                         │
│  ─────────────────────              │
│  Edit Metadata                      │
│  Add Tag                            │
│  Remove Tag                         │
│  ─────────────────────              │
│  Show Info                          │
│  Show in Ledger                     │
│  ─────────────────────              │
│  Delete from Store                  │
└────────────────────────────────────┘
```

## Integration with Canvas

The omnibox is deeply integrated with the GPU canvas.

### Open on Canvas

Press `Ctrl+Shift+Enter` to open a file on the canvas. If the file hasn't been placed yet, it appears at the center of the current viewport.

### Drag to Canvas

You can drag results from the omnibox directly onto the canvas window. The file appears as a tile at the drop position.

### Canvas-Aware Search

The omnibox can show you where files are located on the canvas:

```text
show me where my tax documents are on the canvas
```

This centers the canvas viewport on the cluster of matching files.

### Recent Canvas Items

The omnibox also indexes canvas-specific items:

- Nodes (file tiles on the canvas)
- Links (bezier curves between nodes)
- Annotations (text notes on the canvas)

```text
find the annotation I wrote about the Q4 budget
```

## Configuration

### Omnibox Configuration Options

```toml
[omnibox]
enabled = true
hotkey = "Super+Space"
hotkey_alt = ""
show_on_start = false
position = "top-center"
width = 800
max_results = 10
debounce_ms = 150
font_size = 14
opacity = 0.95

[omnibox.history]
enabled = true
max_entries = 1000
prune_after_days = 90

[omnibox.preview]
enabled = true
max_preview_lines = 30
max_preview_size = 10240  # 10 KB

[omnibox.theme]
mode = "system"  # "light", "dark", "system"
accent_color = "#7c3aed"
background_color = ""
text_color = ""

[omnibox.daemon]
auto_start = true
log_level = "info"
port = 9120
```

### CLI Configuration

```bash
# Enable/disable
kml config set omnibox.enabled true

# Change hotkey
kml config set omnibox.hotkey "Alt+Space"

# Set position
kml config set omnibox.position "top-center"
# Options: top-center, top-left, top-right, center

# Set width
kml config set omnibox.width 900

# Set theme
kml config set omnibox.theme.mode "dark"
kml config set omnibox.theme.accent_color "#3b82f6"
```

## Theming

### Built-in Themes

```bash
# List available themes
kml daemon themes

# Apply a theme
kml config set omnibox.theme "catppuccin-mocha"
```

Available themes: `default-dark`, `default-light`, `catppuccin-latte`, `catppuccin-mocha`, `dracula`, `nord`, `solarized-dark`, `solarized-light`, `tokyo-night`, `gruvbox`.

### Custom Themes

Create a theme file:

```toml
# ~/.config/kamelot/themes/custom.toml
[omnibox.theme]
mode = "dark"
background = "#1a1b26"
foreground = "#a9b1d6"
accent = "#7aa2f7"
border = "#414868"
result_hover = "#1f2335"
result_selected = "#24283b"
preview_background = "#16161e"
chip_background = "#2f354a"
chip_text = "#7aa2f7"
scrollbar = "#414868"
scrollbar_hover = "#565f89"
```

Apply it:

```bash
kml config set omnibox.theme.custom "~/.config/kamelot/themes/custom.toml"
```

## Troubleshooting

### Omnibox Does Not Appear

**Daemon not running:**
```bash
kml daemon status
# If not running:
kml daemon start
```

**Hotkey conflict:**
```bash
# Try a different hotkey
kml config set omnibox.hotkey "Alt+Space"
kml daemon restart
```

**Wayland issues (Linux):**
```bash
# Check compositor support
echo $XDG_SESSION_TYPE
# If Wayland, ensure your compositor supports global shortcuts
```

**macOS permissions:**
```bash
# Re-request accessibility permissions
kml daemon permissions --request
```

### Omnibox Shows No Results

**Store not initialized:**
```bash
kml status
# Check if store exists and is accessible
```

**Qdrant not running:**
```bash
kml status | grep Qdrant
# Should show "Connected"
```

**No files ingested:**
```bash
kml list --count
# Should show > 0 files
```

### Slow Results

High debounce delay:
```bash
kml config set omnibox.debounce_ms 100
```

Network issues with Ollama:
```bash
# Use mock for testing
kml config set ollama.model mock
```

### Omnibox Crashes

```bash
# Check logs
kml daemon logs --tail 50

# Restart daemon
kml daemon stop
kml daemon start --verbose
```

## Tips and Tricks

### Power Search

Combine multiple techniques for precision:

```text
@pdf #finance since:2026-01-01 budget OR financial OR "quarterly report"
```

### Quick File Actions

```text
# Open a file by exact name
name:"tax-return-2025.pdf"

# Open a file by inode
id:7f3a5c91-b2d4-4f8e-9a1c-3e5f7d8b2a1c

# Show recently added files
recent:20
```

### Workspace Integration

```text
# Search within a specific workspace
workspace:"Q4 Planning" budget

# Create a workspace from current search
Ctrl+Shift+S → save as workspace "Tax Documents 2025"
```

### Canvas Navigation

```text
# Show file on canvas
canvas:show tax-return-2025.pdf

# Show cluster of related files
canvas:cluster "tax documents"

# Recent files modified on canvas
canvas:recent
```

### Multiple Stores

Switch between stores quickly:

```text
store:work budget
store:personal vacation photos
```

### Quick Tags

```text
# Add a tag to multiple files
select files → Ctrl+E → type tag name → Enter

# Remove a tag
select files → Ctrl+E → click × on tag
```

### Calculator Mode

```text
# Basic arithmetic
= 42 + 15
→ 57

# Unit conversion
= 100 USD to EUR
→ 92.50 EUR
```

### Shortcut Reference Card

Print or save this reference:

```
╔══════════════════════════════════════════════════════════════╗
║                 KAMELOT OMNIBOX SHORTCUTS                    ║
╠══════════════════════════════════════════════════════════════╣
║  Super+Space        Open Omnibox                            ║
║  Escape / Ctrl+W    Close Omnibox                           ║
║                                                              ║
║  ↓ / ↑              Navigate results                        ║
║  Enter              Open file                               ║
║  Ctrl+Enter         Reveal in file manager                  ║
║  Shift+Enter        Open with...                            ║
║  Ctrl+Shift+Enter   Open on canvas                          ║
║                                                              ║
║  Ctrl+C             Copy path                               ║
║  Ctrl+Shift+C       Copy content                            ║
║  Ctrl+S             Save as...                              ║
║  Delete             Remove from store                       ║
║                                                              ║
║  Ctrl+I             Show file info                          ║
║  Ctrl+E             Edit metadata                           ║
║  Ctrl+D             Share via K-Swarm                       ║
║                                                              ║
║  Ctrl+R             Search history                          ║
║  Ctrl+T             Add tag filter                          ║
║  Ctrl+M             Add MIME filter                         ║
║  Tab                Complete filter                         ║
╚══════════════════════════════════════════════════════════════╝
```

---

*Next tutorial: [07 — Infinite Canvas](07-infinite-canvas.md)*

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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
