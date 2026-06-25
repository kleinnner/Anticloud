                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# 07 — Infinite Canvas

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Overview](#overview)
2. [What is the Infinite Canvas?](#what-is-the-infinite-canvas)
3. [Launching the Canvas](#launching-the-canvas)
4. [Canvas Interface](#canvas-interface)
5. [Drag and Drop](#drag-and-drop)
6. [Spatial Memory](#spatial-memory)
7. [Node Linking](#node-linking)
8. [Canvas Navigation](#canvas-navigation)
9. [Canvas Elements](#canvas-elements)
10. [Organizing the Canvas](#organizing-the-canvas)
11. [Canvas and Search Integration](#canvas-and-search-integration)
12. [Performance and Rendering](#performance-and-rendering)
13. [Multi-Monitor Support](#multi-monitor-support)
14. [Configuration](#configuration)
15. [Keyboard Shortcuts](#keyboard-shortcuts)
16. [Troubleshooting](#troubleshooting)

---

## Overview

The infinite canvas is Kamelot's most visually distinctive feature. It is a native, GPU-accelerated 2D rendering engine that creates an infinite, zoomable plane where your files appear as interactive tiles. Unlike traditional file managers that constrain you to a grid of icons or a list of filenames, the canvas unleashes your files into an unbounded spatial environment.

The canvas is built with Rust and uses Vulkan (Linux/Windows) or Metal (macOS) for GPU-accelerated rendering. There is no browser, no Electron, no JavaScript. The canvas renders at 60+ FPS with thousands of nodes, supporting smooth pan, zoom, and infinite scrolling.

## What is the Infinite Canvas?

The infinite canvas replaces the traditional desktop file manager. Instead of seeing a window with folders and files in a grid, you see an endless dark plane where file tiles float freely.

### Key Capabilities

- **Spatial arrangement:** Place files anywhere on the plane. Your brain remembers where things are spatially.
- **Drag and drop:** Move files between the canvas and other applications.
- **Node linking:** Draw bezier curve connections between related files.
- **Infinite zoom:** Zoom from a bird's-eye view of thousands of files down to a single document.
- **Cluster detection:** Kamelot automatically suggests clusters of semantically similar files.
- **Annotations:** Add sticky notes and text labels anywhere on the canvas.

### How It Differs from Traditional File Managers

| Aspect | Traditional File Manager | Kamelot Canvas |
|--------|------------------------|----------------|
| Layout | Grid or list | Free-form, infinite |
| Organization | Folders (hierarchical) | Spatial proximity |
| Navigation | Click through folders | Pan, zoom, search |
| Relationships | Parent-child (folders) | Bezier link curves |
| Memory Model | Path-based | Spatial + semantic |
| Performance | CPU-rendered | GPU-accelerated |
| Scale | Limited by window | Infinite |

## Launching the Canvas

### From the CLI

```bash
# Launch the canvas UI
kamelot-ui

# Or via the kml command
kml ui

# Open with a specific store
kml ui --store ~/work_kamelot
```

### From the Start Menu

**Linux:**
- Applications → Kamelot → Kamelot Canvas

**Windows:**
- Start Menu → Kamelot → Kamelot Canvas

**macOS:**
- Applications → Kamelot.app

### Command Line Options

```bash
kamelot-ui [OPTIONS]

Options:
  --store <PATH>        Path to the Kamelot store
  --fullscreen          Start in fullscreen mode
  --windowed            Start in windowed mode
  --width <WIDTH>       Window width (default: 1280)
  --height <HEIGHT>     Window height (default: 800)
  --x <X>               Window X position
  --y <Y>               Window Y position
  --monitor <N>         Monitor number for fullscreen
  --no-omnibox          Disable the omnibox overlay
  --verbose             Verbose logging
  --help                Print help
```

## Canvas Interface

### Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🔍 [Search...]  │  [+ Add]  │  [View]  │  [Workspaces]  │  [Settings] │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                          Infinite Canvas Area                            │
│                                                                          │
│      ┌──────────┐                        ┌──────────┐                    │
│      │ budget   │                        │  report   │                    │
│      │ .xlsx    │◄──────────────────────►│  .pdf     │                    │
│      └──────────┘                        └──────────┘                    │
│                                                                          │
│                    ┌──────────┐                                          │
│                    │  notes   │                                          │
│                    │  .md     │                                          │
│                    └──────────┘                                          │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Status: 42 files · Zoom: 100% · Position: (1200, -340) · 60 FPS │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Toolbar

The toolbar provides quick access to common actions.

**Left Side:**
- 🔍 Search: Opens the omnibox
- [+ Add]: Add files to the canvas
- [View]: Toggle view options (grid snap, labels, links)
- [Workspaces]: Manage workspaces
- [Settings]: Canvas settings

**Right Side:**
- Zoom controls (+ / - / Fit)
- Undo / Redo
- Fullscreen toggle

### Status Bar

The status bar shows:
- File count in current view
- Zoom percentage
- Cursor position (canvas coordinates)
- FPS (frames per second)
- Store name
- Connection status (Qdrant, Ollama)

### Context Menu

Right-click on the canvas for options:

```
┌──────────────────────────────┐
│  New Note                    │
│  Paste File                  │
│  ─────────────────────       │
│  Select All                  │
│  Select by Query...          │
│  ─────────────────────       │
│  Zoom to Fit                 │
│  Reset View                  │
│  ─────────────────────       │
│  Show Grid                   │
│  Snap to Grid                │
│  ─────────────────────       │
│  Create Workspace from View  │
│  Canvas Settings             │
└──────────────────────────────┘
```

## Drag and Drop

### Dragging Files from Your Computer

You can drag files from your system's file manager directly onto the canvas:

1. Open your file manager (Nautilus, Finder, Explorer, etc.)
2. Select one or more files
3. Drag them onto the Kamelot canvas window
4. The files are automatically ingested and placed as tiles

[screenshot: drag-from-filesystem-to-canvas.png]
*Dragging a PDF from the file manager onto the Kamelot canvas.*

### Dragging Files from the Canvas to Your Computer

1. Select a file tile on the canvas
2. Drag it out of the canvas window
3. Drop it in a folder or onto another application
4. The file is decrypted and written to the drop location

### Dragging Between Canvas Windows

If you have multiple canvas windows open (e.g., for different stores):

1. Select a tile in one window
2. Drag it to another canvas window
3. The file is copied to the second store

### Dragging from the Omnibox

Search results from the omnibox can be dragged directly onto the canvas:

1. Open the omnibox (`Super+Space`)
2. Search for files
3. Drag a result onto the canvas
4. The file tile appears at the drop position

### Multi-File Drag

Select multiple files with `Ctrl+Click`, then drag them all at once:

1. `Ctrl+Click` on several tiles
2. Click and hold any selected tile
3. Drag the group to a new position
4. All selected files move together

### Importing from System

```bash
# From CLI, add a file directly to the canvas position
kml put document.pdf --canvas-position "1200, -340"
```

## Spatial Memory

Spatial memory is the cognitive process that enables you to remember the location of objects in physical space. The canvas leverages this by letting you place files wherever you want, creating a personalized spatial layout.

### Why Spatial Memory Works

Studies show that:
- Humans can remember 1,000+ object locations with surprising accuracy
- Spatial memory is long-lasting (years) and resistant to interference
- Spatial cues (clusters, boundaries, landmarks) improve recall by 300%+

### Creating Spatial Landmarks

Organize your files spatially like you would organize a physical desk:

```
Top-left corner:       Work projects
Top-right corner:      Personal documents
Center:                Current active projects
Bottom-left:           Archive
Bottom-right:          Reference materials
```

Over time, you'll develop spatial intuition. You'll remember that "the budget spreadsheet is in the top-left cluster, near the Q4 reports."

### Auto-Placement

When files are added to the canvas without explicit positioning, Kamelot uses semantic clustering:

```bash
kml config set canvas.auto_place true
kml config set canvas.cluster_threshold 0.7  # Similarity threshold for clustering
```

With auto-placement enabled, new files are positioned near semantically similar files.

### Grid Snapping

For those who prefer order:

```bash
kml config set canvas.snap_to_grid true
kml config set canvas.grid_size 100  # Pixels between grid points
```

### Saving and Restoring Layouts

Canvas layouts are persisted in the store:

```bash
# Layouts are saved automatically on exit and restored on startup
# You can also save/load layouts manually:
kml canvas layout save "work-layout"
kml canvas layout load "work-layout"
kml canvas layout list
kml canvas layout delete "old-layout"
```

## Node Linking

Nodes (file tiles) can be connected with bezier curves to show relationships.

### Creating a Link

**Method 1: Click and Drag**

1. Click the link handle (small circle) on the edge of a node
2. Drag to another node
3. Release to create the link

[screenshot: creating-bezier-link.png]
*Dragging a bezier link between two file nodes.*

**Method 2: Keyboard**

1. Select the source node
2. Press `L` to enter link mode
3. Click the target node
4. Press `Enter` or `L` again to confirm

**Method 3: Auto-Link**

Kamelot can automatically link files above a similarity threshold:

```bash
kml config set canvas.auto_link true
kml config set canvas.auto_link_threshold 0.85

# Apply auto-linking to current canvas
kml canvas auto-link
```

### Link Styles

```bash
# Set link style
kml config set canvas.link_style "bezier"
# Options: bezier, straight, curved, dashed, dotted, segmented

# Set link color
kml config set canvas.link_color "#7c3aed"

# Set link thickness
kml config set canvas.link_thickness 2.0

# Set animation
kml config set canvas.link_animation "flow"
# Options: none, flow, pulse, dash
```

### Link Labels

Add labels to links:

1. Double-click a link
2. Type a label: "References" or "Updated together"
3. Press Enter

### Link Groups

Create link groups for visual clarity:

```
[Project Alpha]
  ├── research.pdf ───┐
  ├── budget.xlsx ────┤─── proposal.pdf
  ├── timeline.md ────┘
  └── notes.txt
```

### Removing Links

- Right-click a link → "Delete"
- Select link → `Delete` key
- Select source node → `L` → click empty space

## Canvas Navigation

### Panning

| Method | Action |
|--------|--------|
| Middle mouse drag | Pan in any direction |
| Right mouse drag | Pan (if not in context menu mode) |
| Arrow keys | Pan (small increments) |
| Shift + Arrow keys | Pan (large increments) |
| Ctrl + Arrow keys | Pan to edge of current cluster |

### Zooming

| Method | Action |
|--------|--------|
| Scroll wheel | Zoom in/out |
| Ctrl + Scroll wheel | Zoom (finer control) |
| + / - keys | Zoom in/out |
| Ctrl + 0 | Zoom to 100% |
| Ctrl + 9 | Zoom to fit all nodes |
| Ctrl + Shift + F | Zoom to fit selected nodes |

### Navigation Commands

```bash
# Keyboard shortcuts for navigation
G         : Go to... (enter coordinates)
Home      : Go to origin (0, 0)
Ctrl+G    : Go to file... (search for file to center on)
Z         : Zoom mode (click to zoom in, right-click to zoom out)
F         : Focus on selected node
Ctrl+F    : Focus on cluster (zoom to fit cluster around selected)
```

### Bookmarking Positions

```bash
# Set a bookmark
Ctrl+Shift+1 through Ctrl+Shift+9 : Set bookmark at current view

# Go to a bookmark
Ctrl+1 through Ctrl+9 : Navigate to bookmark

# Named bookmarks
kml canvas bookmark set "office"
kml canvas bookmark go "office"
kml canvas bookmark list
```

### Minimap

Press `M` or click the minimap button to toggle the minimap:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                    ┌──────────┐│
│                                                    │  Minimap ││
│                                                    │ ┌──────┐ ││
│                                                    │ │ ████ │ ││
│                                                    │ └──────┘ ││
│                                                    │          ││
│                                                    └──────────┘│
└──────────────────────────────────────────────────────────────────┘
```

The minimap shows all nodes as dots (color-coded by type) and the current viewport as a rectangle. You can drag the viewport rectangle to navigate.

## Canvas Elements

### File Tiles

Each file appears as a tile on the canvas.

**Tile Components:**

```
┌─────────────────────────┐
│  📄                     │  ← File type icon (top-left)
│                         │
│   tax-return-2025      │  ← File name
│   .pdf                 │
│                         │
│   245 KB · 2 days ago   │  ← Metadata
│                         │
│  ○────────────────────○ │  ← Link handles (left/right)
└─────────────────────────┘
```

**Tile States:**

- **Default:** Normal appearance
- **Selected:** Highlighted border (accent color)
- **Hovered:** Slight scale-up, shadow
- **Dragging:** Semi-transparent, follows cursor
- **Linked:** Shows connected link indicators

### File Type Icons

Each MIME type has a distinctive icon:

| Icon | Type |
|------|------|
| 📄 | Document (PDF, DOCX) |
| 📊 | Spreadsheet (XLSX, CSV) |
| 📽 | Presentation (PPTX) |
| 🖼 | Image (JPG, PNG, GIF) |
| 🎵 | Audio (MP3, WAV, FLAC) |
| 🎬 | Video (MP4, MOV) |
| 📝 | Text (TXT, MD) |
| 💻 | Code (RS, PY, JS) |
| 🗄 | Archive (ZIP, TAR) |
| 📦 | Data (JSON, XML, YAML) |

### Notes and Annotations

Add text notes anywhere on the canvas:

1. Right-click → "New Note"
2. Type your text
3. Press Escape to finish

**Note formatting:**
- `**bold**`, `*italic*`, `~~strikethrough~~`
- `- List item`
- `# Heading`
- `[link text](url)`
- Basic Markdown supported

### Clusters

Kamelot can automatically group semantically similar files into clusters:

```bash
# Auto-cluster
kml canvas cluster

# Auto-cluster with custom threshold
kml canvas cluster --threshold 0.75
```

Clusters appear as subtle background regions with labels:

```
┌─────────────────────────────────────────────────────┐
│                        ┌ ─ ─ ─ ─ ─ ─ ─ ─ ┐         │
│                        │  Tax Documents    │         │
│                        │  ┌──────────┐     │         │
│                        │  │ tax.pdf  │     │         │
│                        │  ├──────────┤     │         │
│                        │  │ irs.pdf  │     │         │
│                        │  └──────────┘     │         │
│                        └ ─ ─ ─ ─ ─ ─ ─ ─ ┘         │
└─────────────────────────────────────────────────────┘
```

### Links

As described in the Node Linking section, links are bezier curves connecting related files.

### Background

The canvas background can be customized:

```bash
# Background style
kml config set canvas.background "grid"    # Grid lines
kml config set canvas.background "dots"    # Dot grid
kml config set canvas.background "solid"   # Solid color
kml config set canvas.background "none"    # Transparent

# Background color
kml config set canvas.background_color "#1a1b26"

# Grid color
kml config set canvas.grid_color "#2f354a"
```

## Organizing the Canvas

### Creating Groups

Group related nodes:

1. Select multiple nodes (`Ctrl+Click` or drag selection rectangle)
2. Right-click → "Group"
3. A group container appears around the nodes
4. Double-click the group header to name it

### Nesting Groups

Groups can be nested:

```
┌─────────────────────────────────────┐
│  Work Projects (Group)              │
│  ┌───────────────────────────────┐  │
│  │  Q4 2025 (Subgroup)           │  │
│  │  ├── budget.xlsx              │  │
│  │  ├── report.pdf               │  │
│  │  └── presentation.pptx        │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  Q1 2026 (Subgroup)           │  │
│  │  ├── planning.md              │  │
│  │  └── timeline.xlsx            │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Collapsing and Expanding

- Double-click a group header to collapse/expand
- Group collapses to a single tile showing file count
- Links to files inside collapsed groups are hidden

### Color Coding

Assign colors to nodes or groups:

1. Select a node/group
2. Right-click → "Color"
3. Choose a color

```bash
# CLI
kml canvas color 7f3a5c91... --color "#ef4444"
```

### Labels

Add text labels to the canvas:

1. Right-click → "New Label"
2. Type the label text
3. Position it anywhere

Labels are useful for:
- Section headers ("Archive", "Active Projects")
- Descriptions ("Files from the 2025 tax season")
- Directions ("Drag files here for review")

## Canvas and Search Integration

### Omnichord Search

The omnibox integrates with the canvas:

1. Press `Super+Space` (or omnibox hotkey)
2. Search for files
3. Results show their canvas positions
4. Select a result: canvas centers on that file

### Visual Search Results

When you search from within the canvas:

1. Press `Ctrl+F` or click the search icon
2. Type your query
3. Matching files highlight on the canvas (pulsing glow)
4. Non-matching files dim

### Query-Based Selection

```bash
# Select all files matching a semantic query
kml canvas select "budget spreadsheets"
```

Selected files can then be:
- Moved as a group
- Colored
- Linked together
- Exported

### Saving Search as View

```bash
kml canvas save-view "tax-documents"
# Later:
kml canvas load-view "tax-documents"
# This moves the viewport to show only tax-related files
```

## Performance and Rendering

### Rendering Engine

The canvas uses a custom Vulkan/Metal renderer built in Rust:

- **Render path:** Deferred shading with compute-based culling
- **LOD (Level of Detail):** Nodes simplify at distance
- **Instancing:** GPU instancing for tiles with shared textures
- **Culling:** Frustum culling + occlusion culling
- **Text:** Signed Distance Field (SDF) text rendering

### Performance Benchmarks

| Node Count | Memory | FPS |
|------------|--------|-----|
| 100 | 50 MB | 120 FPS |
| 1,000 | 200 MB | 120 FPS |
| 10,000 | 1.5 GB | 60 FPS |
| 100,000 | 12 GB | 30 FPS |
| 1,000,000 | ~100 GB | 15 FPS |

### Optimization Settings

```bash
# Reduce texture quality
kml config set canvas.texture_quality "medium"
# Options: low, medium, high, ultra

# Reduce shadow quality
kml config set canvas.shadow_quality "low"

# Disable animations
kml config set canvas.animations false

# Reduce draw distance
kml config set canvas.max_draw_distance 10000

# Disable node previews
kml config set canvas.show_previews false

# Reduce update frequency
kml config set canvas.update_fps 30
```

### GPU Requirements

| GPU | Expected Performance |
|-----|---------------------|
| Integrated (Intel UHD) | 30 FPS, 500 nodes |
| Entry-level (GTX 1650) | 60 FPS, 5,000 nodes |
| Mid-range (RTX 3060) | 60 FPS, 20,000 nodes |
| High-end (RTX 4090) | 120 FPS, 100,000 nodes |
| Apple M1 | 60 FPS, 5,000 nodes |
| Apple M2 Pro/Max | 60 FPS, 20,000 nodes |

### Vulkan/Metal Debugging

```bash
# Enable validation layers (debug builds)
kamelot-ui --validate

# Log GPU info
kamelot-ui --gpu-info

# Performance overlay
kamelot-ui --perf-overlay

# Wireframe mode
kamelot-ui --wireframe
```

## Multi-Monitor Support

### Window Placement

```bash
# Start on specific monitor
kamelot-ui --monitor 2

# Start in fullscreen on specific monitor
kamelot-ui --monitor 2 --fullscreen

# Remember window position
kml config set canvas.remember_position true
```

### Spanning Multiple Monitors

```bash
# Span canvas across all monitors (experimental)
kamelot-ui --span-monitors
```

### DPI Scaling

```bash
# Force DPI scaling
kml config set canvas.dpi_scale 1.5

# Or use system DPI (default)
kml config set canvas.dpi_scale "auto"
```

## Configuration

### Canvas Configuration Options

```toml
[canvas]
width = 1280
height = 800
fullscreen = false
remember_position = true
remember_size = true

[canvas.rendering]
vsync = true
fps_limit = 60
texture_quality = "high"
shadow_quality = "medium"
anti_aliasing = "msaa_4x"
anisotropic_filtering = 8

[canvas.navigation]
zoom_speed = 1.0
pan_speed = 1.0
invert_scroll = false
smooth_scrolling = true
edge_panning = true
edge_pan_margin = 20

[canvas.appearance]
background = "grid"
background_color = "#1a1b26"
grid_color = "#2f354a"
grid_spacing = 50
node_width = 200
node_height = 160
font_size = 12
show_file_icons = true
show_file_sizes = true
show_dates = true

[canvas.links]
default_style = "bezier"
default_color = "#7c3aed"
default_thickness = 2.0
auto_link = false
auto_link_threshold = 0.85
animation = "flow"

[canvas.clustering]
auto_cluster = false
cluster_threshold = 0.75
show_cluster_labels = true
cluster_padding = 50

[canvas.layout]
auto_place = false
snap_to_grid = false
grid_size = 100
margin = 20
```

### CLI Configuration

```bash
# Set all canvas options via kml config
kml config set canvas.width 1920
kml config set canvas.height 1080
kml config set canvas.fullscreen true
kml config set canvas.snap_to_grid true
kml config set canvas.grid_size 80
kml config set canvas.auto_place true
kml config set canvas.auto_link true
kml config set canvas.auto_link_threshold 0.8
```

## Keyboard Shortcuts

### Navigation

| Shortcut | Action |
|----------|--------|
| Arrow keys | Pan |
| Shift + Arrow | Fast pan |
| Scroll wheel | Zoom |
| Ctrl + Scroll wheel | Fine zoom |
| Ctrl + 0 | 100% zoom |
| Ctrl + 9 | Fit all to view |
| Ctrl + Shift + F | Fit selection |
| Home | Go to origin |
| G | Go to coordinates |
| M | Toggle minimap |
| Ctrl + [1-9] | Go to bookmark |

### Selection

| Shortcut | Action |
|----------|--------|
| Click | Select single |
| Ctrl + Click | Toggle selection |
| Shift + Click | Range selection |
| Ctrl + A | Select all |
| Escape | Deselect all |
| Drag (on empty) | Rectangle selection |

### File Operations

| Shortcut | Action |
|----------|--------|
| Delete | Remove file from store |
| Ctrl + C | Copy selected files |
| Ctrl + V | Paste files |
| Ctrl + X | Cut (move) |
| Ctrl + D | Duplicate |
| F2 | Rename file |
| Ctrl + I | Show file info |
| Enter | Open file |

### Canvas Editing

| Shortcut | Action |
|----------|--------|
| L | Toggle link mode |
| N | New note |
| Ctrl + Z | Undo |
| Ctrl + Shift + Z | Redo |
| G | Group selected |
| Ctrl + G | Ungroup |
| Ctrl + B | Add bookmark |
| Color | Color picker |

### View

| Shortcut | Action |
|----------|--------|
| Ctrl + F | Search/highlight |
| Ctrl + H | Toggle file labels |
| Ctrl + Shift + H | Toggle links |
| F11 | Toggle fullscreen |
| Tab | Cycle focus through UI elements |

## Troubleshooting

### Canvas Won't Launch

**Missing GPU driver:**
```bash
# Linux
vulkaninfo --summary
# If fails, install Vulkan drivers

# macOS
# Ensure MoltenVK is installed
brew list molten-vk

# Windows
dxdiag  # Check DirectX/Vulkan support
```

**Store not found:**
```bash
kml ui --store /path/to/valid/store
```

### Low FPS

```bash
# Reduce quality settings
kml config set canvas.texture_quality "low"
kml config set canvas.shadow_quality "low"
kml config set canvas.anti_aliasing "none"
kml config set canvas.fps_limit 30

# Check GPU usage
# Linux: nvidia-smi or radeontop
# Windows: Task Manager → GPU
# macOS: Activity Monitor → GPU
```

### Nodes Not Rendering

```bash
# Force refresh
F5

# Reset viewport
Ctrl + 9

# Check store connection
kml status
```

### Black Screen

```bash
# Try software rendering (fallback)
kamelot-ui --software-render

# Check for Vulkan errors
kamelot-ui --validate 2>&1 | head -20
```

### Crashes

```bash
# Check crash logs
# Linux/macOS: ~/.local/share/kamelot/canvas.log
# Windows: %APPDATA%\Kamelot\canvas.log

# Run in verbose mode
kamelot-ui --verbose 2>&1 | tee canvas.log
```

---

*Next tutorial: [08 — Workspace Management](08-workspace-management.md)*

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
