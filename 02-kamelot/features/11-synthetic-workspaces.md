                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                

# Synthetic Workspaces

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

- [Introduction](#introduction)
- [What Is a Synthetic Workspace?](#what-is-a-synthetic-workspace)
- [Workspace Architecture](#workspace-architecture)
- [From Query to Workspace](#from-query-to-workspace)
- [Workspace Lifecycle](#workspace-lifecycle)
- [Creating Workspaces](#creating-workspaces)
- [Interacting with Workspaces](#interacting-with-workspaces)
- [Dissolving Workspaces](#dissolving-workspaces)
- [Workspace Persistence](#workspace-persistence)
- [Multi-Workspace Management](#multi-workspace-management)
- [Workspace Layout and Spatial Memory](#workspace-layout-and-spatial-memory)
- [Workspace Sharing](#workspace-sharing)
- [Workspace Templates](#workspace-templates)
- [Use Cases](#use-cases)
- [Performance Characteristics](#performance-characteristics)
- [Configuration](#configuration)
- [Implementation Details](#implementation-details)
- [Comparison with Traditional Approaches](#comparison-with-traditional-approaches)

---

## Introduction

Synthetic workspaces are the culmination of Kamelot's semantic approach to file management. When a user performs a natural language query, the result is not merely a list of files — it is a temporary visual desktop populated with the query results, arranged in a spatially meaningful layout based on their semantic relationships.

Unlike traditional folders that impose a permanent structure on files, synthetic workspaces are ephemeral. They exist only as long as they are useful, and when dissolved, their files return to the latent vector space from which they came. There is no need to decide "where to save" a workspace because workspaces are not storage locations — they are views into the semantic graph.

---

## What Is a Synthetic Workspace?

A synthetic workspace is a temporary, query-generated collection of files presented as a visual desktop in the canvas UI. It is "synthetic" because it does not correspond to any physical directory structure; it is synthesized on-the-fly from semantic search results.

```graphify
graph TD
    subgraph "Latent Vector Space"
        A[File A<br/>tax_report.pdf]
        B[File B<br/>invoice.pdf]
        C[File C<br/>meeting_notes.md]
        D[File D<br/>budget.xlsx]
        E[File E<br/>photo.jpg]
        F[File F<br/>contract.pdf]
        G[File G<br/>code.rs]
        H[File H<br/>design.png]
    end
    
    subgraph "Query → Workspace"
        Q[Query: "tax documents 2025"]
        WS[Workspace: Tax 2025<br/>Temporary Visual Desktop]
    end
    
    A --> Q
    B --> Q
    D --> Q
    F --> Q
    Q --> WS
    
    WS -->|Dissolve| A
    WS -->|Dissolve| B
    WS -->|Dissolve| D
    WS -->|Dissolve| F
    
    style WS fill:#4a90d9,color:white
```

---

## Workspace Architecture

```graphify
graph TD
    subgraph "Workspace Manager"
        WS1[Workspace 1<br/>"Tax 2025"]
        WS2[Workspace 2<br/>"Q3 Planning"]
        WS3[Workspace 3<br/>"ML Papers"]
        WM[Workspace Manager<br/>Lifecycle, Routing, Events]
    end
    
    subgraph "Workspace Components"
        ID[Identity<br/>ID, Name, Created]
        NODES[Nodes<br/>Files + Layout]
        QUERY[Query<br/>Original + Filters]
        STATE[State<br/>Dirty, Frozen, Active]
        LAYOUT[Layout<br/>Positions, Zoom, Links]
    end
    
    subgraph "Storage"
        MEM[In-Memory<br/>Active Workspaces]
        DISK[On-Disk<br/>Frozen Workspaces]
        CACHE[Cache<br/>Recent Workspaces]
    end
    
    subgraph "Data Sources"
        QDRANT[Qdrant<br/>Vector Search]
        STORE[Flat Store<br/>File Contents]
        LEDGER[Ledger<br/>History]
    end
    
    WM --> WS1
    WM --> WS2
    WM --> WS3
    
    WS1 --> ID
    WS1 --> NODES
    WS1 --> QUERY
    WS1 --> STATE
    WS1 --> LAYOUT
    
    WM --> MEM
    WM --> DISK
    WM --> CACHE
    
    WS1 --> QDRANT
    WS1 --> STORE
    WS1 --> LEDGER
```

---

## From Query to Workspace

The transformation from a natural language query to a visual workspace:

```graphify
sequenceDiagram
    participant User as User
    participant CLI as CLI / Canvas
    participant QE as Query Engine
    participant QD as Qdrant
    participant WM as Workspace Manager
    participant UI as Canvas UI
    
    User->>CLI: kml query "tax documents 2025"
    CLI->>QE: execute_query("tax documents 2025")
    QE->>QD: search(embedding, top_k=50)
    QD-->>QE: 50 results with scores
    
    QE-->>CLI: Query results
    
    CLI->>WM: create_workspace("Tax 2025", results)
    WM->>WM: Assign workspace ID
    WM->>WM: Compute spatial layout from vectors
    WM->>WM: Store query and metadata
    
    WM-->>UI: Workspace created with 50 nodes
    UI->>UI: Animate nodes into view
    UI-->>User: Workspace "Tax 2025" active
    
    Note over User,UI: User works with files in workspace
    
    User->>UI: Close workspace tab
    UI->>WM: dissolve_workspace("Tax 2025")
    WM->>WM: Save layout if frozen
    WM->>UI: Remove nodes from canvas
    UI-->>User: Workspace dissolved
```

### Workspace Creation from CLI

```bash
# Create from explicit query
kml workspace create "Tax 2025" --query "tax documents 2025"

# Create from query with options
kml workspace create "Q3 Planning" \
    --query "Q3 goals planning roadmap" \
    --top-k 100 \
    --threshold 0.7 \
    --file-type "pdf,docx,xlsx"

# Create from existing file
kml workspace create "Similar to Report" \
    --anchor /path/to/report.pdf \
    --top-k 30

# Create from query history
kml workspace create "Historical Tax" \
    --ledger-query "tax+2024" \
    --at "2025-01-01T00:00:00Z"
```

---

## Workspace Lifecycle

Workspaces follow a defined lifecycle:

```graphify
stateDiagram-v2
    [*] --> Creating: Query executed
    
    Creating --> Active: Layout computed
    
    Active --> Frozen: User freezes
    Active --> Dissolved: User closes
    Active --> Modified: User adds/removes files
    
    Modified --> Active: User continues
    Modified --> Frozen: User freezes
    Modified --> Dissolved: User closes
    
    Frozen --> Active: User reopens
    Frozen --> Dissolved: TTL expired / manual
    
    Dissolved --> [*]: Return to latent space
    
    state Creating {
        [*] --> Embedding: Query received
        Embedding --> Searching: Vector computed
        Searching --> Layout: Results received
        Layout --> [*]: Positions computed
    }
    
    state Active {
        [*] --> Interacting: User works
        Interacting --> Interacting: Add/remove/move files
    }
```

### Lifecycle States

| State | Description | Duration | Persistence |
|-------|-------------|----------|-------------|
| Creating | Query execution + layout computation | 100-500 ms | None |
| Active | User is working with the workspace | Minutes to hours | In-memory |
| Modified | User has customized the workspace | Variable | In-memory + auto-save |
| Frozen | Saved for later use | Days to months | On-disk |
| Dissolved | Terminated, resources released | Instant | None |

---

## Creating Workspaces

### Programmatic Creation

```rust
pub struct WorkspaceManager {
    workspaces: HashMap<WorkspaceId, SyntheticWorkspace>,
    next_id: AtomicU64,
    config: WorkspaceConfig,
}

impl WorkspaceManager {
    pub async fn create_from_query(
        &mut self,
        name: String,
        query: String,
        options: QueryOptions,
    ) -> Result<WorkspaceId> {
        let id = WorkspaceId(self.next_id.fetch_add(1, Ordering::SeqCst));
        
        // Execute the query
        let results = query_engine.execute(&query, options).await?;
        
        // Compute positions
        let vectors: Vec<Vec<f32>> = results.iter()
            .map(|r| r.vector.clone())
            .collect();
        let positions = layout_engine.compute_layout(&vectors, &options.layout)?;
        
        // Build workspace
        let workspace = SyntheticWorkspace {
            id,
            name,
            query: QuerySource::Natural(query),
            created_at: SystemTime::now(),
            last_active: SystemTime::now(),
            state: WorkspaceState::Active,
            
            nodes: results.into_iter().zip(positions).map(|(result, pos)| {
                WorkspaceNode {
                    inode: result.inode,
                    filename: result.filename,
                    position: pos,
                    size: Vec2::new(160.0, 120.0),
                    similarity: result.score,
                    metadata: result.metadata,
                }
            }).collect(),
            
            layout: LayoutState {
                camera_offset: Vec2::ZERO,
                camera_zoom: 1.0,
                force_layout_enabled: true,
            },
        };
        
        // Store and return
        let id = workspace.id;
        self.workspaces.insert(id, workspace);
        
        Ok(id)
    }
}
```

### Options for Creation

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--query` | String | - | Natural language query |
| `--anchor` | Path | - | File to find similar to |
| `--top-k` | u32 | 50 | Number of files to include |
| `--threshold` | f32 | 0.65 | Minimum similarity |
| `--file-type` | String | "" | Filter by type (comma-separated) |
| `--date-from` | String | "" | Date range start |
| `--date-to` | String | "" | Date range end |
| `--layout` | String | "force" | Layout algorithm |
| `--tags` | String | "" | Filter by tags |
| `--ledger-query` | String | "" | Historical query in ledger |

---

## Interacting with Workspaces

### Canvas Interactions

| Action | Result |
|--------|--------|
| Drag file | Reposition within workspace |
| Double-click file | Open in default application |
| Right-click file | Context menu (copy, tag, pin, etc.) |
| Select + Delete | Remove from workspace (not from store) |
| Ctrl+C / Ctrl+V | Copy files between workspaces |
| Drag into workspace from outside | Add file to workspace |
| Drag file to tab bar | Move file to another workspace |
| Click empty space | Deselect all |
| Box select | Multi-select files |
| Pin file | Keep in workspace even if query changes |

### Context Menu

```
┌─────────────────────┐
│ Open                │
│ Open with...        │
├─────────────────────┤
│ Copy to clipboard   │
│ Move to workspace   │
│ Pin to workspace    │
├─────────────────────┤
│ Tag...              │
│ Similar files...    │
│ File info           │
├─────────────────────┤
│ Remove from view    │
│ Delete from store   │
└─────────────────────┘
```

### Live Updates

Workspaces can be configured for live updates:

```bash
# Create a workspace that auto-updates
kml workspace create "Live Tax" \
    --query "tax documents" \
    --live-update 60  # Refresh every 60 seconds
```

When live updates are enabled, the workspace periodically re-executes the query and:
- Adds new matching files with an animation
- Removes files that no longer match (unless pinned)
- Updates similarity scores
- Adjusts layout smoothly

---

## Dissolving Workspaces

The dissolution of a workspace is a deliberate design choice:

### What Happens on Dissolve

```rust
fn dissolve_workspace(&mut self, id: WorkspaceId) -> Result<()> {
    let workspace = self.workspaces.remove(&id)
        .ok_or(Error::WorkspaceNotFound)?;
    
    // If frozen, save before dissolving
    if workspace.state == WorkspaceState::Frozen {
        self.save_frozen(workspace)?;
        return Ok(());
    }
    
    // Log the dissolution
    ledger.append(LedgerEntry {
        entry_type: EntryType::WorkspaceDissolve,
        payload: workspace.id.0.to_le_bytes().to_vec(),
        // ...
    })?;
    
    // Clean up resources
    self.layout_cache.remove(&id);
    self.thumbnail_cache.remove_workspace(id);
    
    log::info!("Workspace '{}' dissolved ({} files)", 
        workspace.name, workspace.nodes.len());
    
    Ok(())
}
```

### Dissolution Effects

| Aspect | Effect |
|--------|--------|
| Files | Return to latent space (not deleted) |
| Layout | Discarded (unless frozen) |
| Canvas | Nodes animate away then disappear |
| Tab | Removed from tab bar |
| Memory | Freed immediately |
| Undo | Can recreate from query (not exact layout) |

### The "Taxes Folder" Metaphor

A traditional "Taxes" folder exists permanently. A synthetic "Taxes" workspace:

1. **Created** when you query "tax documents"
2. **Populated** with all semantically tax-related files
3. **Used** while you work on taxes
4. **Dissolved** when tax season is over
5. **Recreated** later with updated results (including new tax documents added since)

The folder dissolves back into latent space, taking up no permanent storage, no directory structure, and requiring no maintenance from the user.

---

## Workspace Persistence

### Persistence Levels

| Level | Description | Storage | Recall |
|-------|-------------|---------|--------|
| Ephemeral | Auto-dissolve on close | None | Must recreate |
| Auto-save | Save on close, auto-dissolve after TTL | Checkpoint file | Last N auto-saves |
| Frozen | Manual save, persistent until manual delete | Full workspace file | Immediate |
| Pinned | Always active, never dissolves | In-memory | Always available |

### Auto-Save

```rust
struct AutoSaveManager {
    save_dir: PathBuf,
    max_saves: usize,
    save_interval: Duration,
}

impl AutoSaveManager {
    fn auto_save(&self, workspace: &SyntheticWorkspace) -> Result<()> {
        let path = self.save_dir.join(format!(
            "workspace_{:016X}.kmlws",
            workspace.id.0
        ));
        
        let data = WorkspaceData {
            id: workspace.id,
            name: workspace.name.clone(),
            query: workspace.query.clone(),
            nodes: workspace.nodes.iter().map(|n| NodeData {
                inode: n.inode,
                position: n.position,
                pinned: n.pinned,
            }).collect(),
            layout: workspace.layout.clone(),
            created_at: workspace.created_at,
            last_active: SystemTime::now(),
        };
        
        let encoded = bincode::serialize(&data)?;
        std::fs::write(&path, encoded)?;
        
        Ok(())
    }
}
```

### Frozen Workspace Format

Frozen workspaces are stored as `.kmlws` files:

```
/var/lib/kamelot/workspaces/
├── frozen/
│   ├── workspace_0000000000000001.kmlws
│   ├── workspace_0000000000000002.kmlws
│   └── ...
├── auto-save/
│   ├── workspace_0000000000000003.kmlws
│   └── ...
└── templates/
    ├── default.kmlwt
    └── research.kmlwt
```

---

## Multi-Workspace Management

### Tab Bar

The canvas UI shows active workspaces in a tab bar:

```graphify
graph LR
    subgraph "Tab Bar"
        T1["Tax 2025<br/>12 files ●"]
        T2["Q3 Planning<br/>8 files"]
        T3["ML Papers<br/>24 files ●"]
        T4["+ New<br/>Workspace"]
        T5["⚙ Workspace<br/>Settings"]
    end
```

- Bold dot (●) = unsaved changes
- Click tab to switch
- Close button (×) to dissolve
- Drag to reorder

### Workspace Commands

```bash
# List active workspaces
kml workspace list

# Switch to workspace
kml workspace switch "Tax 2025"

# Rename
kml workspace rename "Tax 2025" "Tax 2025 v2"

# Freeze (save permanently)
kml workspace freeze "Tax 2025"

# Dissolve
kml workspace dissolve "Tax 2025"

# Show details
kml workspace info "Tax 2025"
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl + N | New workspace |
| Ctrl + W | Close current workspace |
| Ctrl + Tab | Next workspace |
| Ctrl + Shift + Tab | Previous workspace |
| Ctrl + 1-9 | Switch to workspace by index |
| Ctrl + Shift + N | New workspace from selected files |
| Ctrl + S | Save workspace layout |
| Ctrl + Shift + F | Freeze workspace |

---

## Workspace Layout and Spatial Memory

### Layout Types

| Layout | Algorithm | Best For |
|--------|-----------|----------|
| Force-directed | GPU force simulation (default) | General purpose |
| Grid | Aligned rows and columns | Comparison tasks |
| Circle | Radial layout | Relationship visualization |
| Timeline | Chronological order | Temporal sequences |
| Cluster | Grouped by similarity | Topic exploration |
| Manual | User-defined positions | Custom organization |

### Spatial Memory

Workspaces leverage spatial memory — the brain's natural ability to remember visual locations:

```rust
struct SpatialMemory {
    /// Per-user, per-workspace position history
    positions: HashMap<(UserId, WorkspaceId, Inode), Vec2>,
    
    /// Learning rate for new positions
    learning_rate: f32,
    
    /// Decay factor (forgotten positions fade)
    decay: f32,
    
    /// Persistence backend
    store: Arc<sled::Tree>,
}

impl SpatialMemory {
    fn get_position(
        &self,
        user: UserId,
        workspace: WorkspaceId,
        inode: Inode,
        default: Vec2,
    ) -> Vec2 {
        self.positions
            .get(&(user, workspace, inode))
            .copied()
            .unwrap_or(default)
    }
    
    fn set_position(
        &mut self,
        user: UserId,
        workspace: WorkspaceId,
        inode: Inode,
        position: Vec2,
    ) {
        self.positions.insert((user, workspace, inode), position);
        self.persist_position(user, workspace, inode, position);
    }
}
```

### Layout Persistence

```bash
# Save current layout
kml workspace save-layout

# Reset to auto-layout
kml workspace reset-layout

# Export layout
kml workspace export-layout layout.json

# Import layout
kml workspace import-layout layout.json
```

---

## Workspace Sharing

### Within the Same Device

```bash
# Share workspace with another local user
kml workspace share "Tax 2025" --user "alice"

# The workspace appears in Alice's Kamelot
# She can interact with it, but changes are private
```

### Across K-Swarm Peers

```bash
# Share workspace with a remote peer
kml workspace share "Q3 Planning" --peer 12D3KooW... --permission read

# The peer can view the workspace, browse files
# Files are transferred on-demand (binary offloading)
```

### Workspace as URL

```bash
# Generate a shareable workspace URL
kml workspace share-link "ML Papers" --expires "24h"
# kamelot://workspace/12D3KooW.../abc123def456

# Open a shared workspace
kml workspace open kamelot://workspace/12D3KooW.../abc123def456
```

### Collaborative Workspaces

Future version: multiple users can interact with the same workspace in real-time, with changes synced through K-Swarm.

---

## Workspace Templates

### Template System

Templates allow users to create workspaces with predefined configurations:

```bash
# Create from template
kml workspace create "My Research" --template research

# List templates
kml workspace templates

# Create new template from existing workspace
kml workspace save-template "My Research" --as research_template
```

### Built-in Templates

| Template | Query | Layout | Filters |
|----------|-------|--------|---------|
| Default | Empty | Force-directed | None |
| Research | "research papers" | Cluster | PDF filter |
| Development | "code source" | Force-directed | Code files filter |
| Photo browsing | "photos images" | Timeline | Image filter |
| Document review | "documents" | Grid | Doc filter |
| Music | "music audio" | Circle | Audio filter |

### Template Format

```json
{
  "name": "Research",
  "description": "Browse and organize research papers",
  "default_query": "research papers",
  "layout": "cluster",
  "filters": {
    "file_types": ["pdf", "epub"],
    "min_similarity": 0.7
  },
  "canvas_config": {
    "background": "#1a1a2e",
    "link_visibility": 0.75,
    "show_minimap": true
  },
  "node_styling": {
    "default_width": 200,
    "default_height": 150,
    "show_thumbnails": true
  }
}
```

---

## Use Cases

### 1. Project-Based Work

```bash
# Start a new project
kml workspace create "Website Redesign" \
    --query "website redesign mockups assets" \
    --file-type "png,psd,ai,fig,sketch"

# All design files appear in a spatial layout
# Grouped by similarity (mockups near each other, icons near each other)

# Work for a week, adding new files
# Workspace auto-updates

# Project completes
kml workspace freeze "Website Redesign"
# Saved for future reference
```

### 2. Research and Writing

```bash
# Research a topic
kml workspace create "ML Paper Review" \
    --query "machine learning transformer architecture 2025" \
    --file-type "pdf" \
    --top-k 200

# Papers cluster by subtopic (NLP, Vision, RL, etc.)
# Read abstracts, open papers, take notes

# Write your summary paper
# It automatically appears in the workspace when saved

# When done, dissolve — nothing to clean up
kml workspace dissolve "ML Paper Review"
```

### 3. Event Planning

```bash
# Get everything related to an event
kml workspace create "Conference 2025" \
    --query "conference 2025 travel accommodation schedule speakers"

# Venue photos, flight confirmations, schedule PDFs
# All in one visual space

# Add notes and checklists — they join the cluster

# After the conference
kml workspace freeze "Conference 2025"
# Archived for next year's planning
```

### 4. Creative Work

```bash
# Visual mood board
kml workspace create "Brand Design" \
    --query "brand design moodboard colors typography" \
    --file-type "jpg,png,svg,pdf"

# Images and references fill the canvas spatially
# Drag to arrange by color palette
# Add your own designs as you create them

# Export the workspace layout as a visual reference
kml workspace export-layout brand_moodboard.json
```

### 5. Forensics and Investigation

```bash
# Investigate file system changes
kml workspace create "Suspicious Activity" \
    --ledger-query "FileCreate+FileUpdate" \
    --date-from "2025-01-15T14:00:00Z" \
    --date-to "2025-01-15T15:00:00Z"

# All files created/modified in that window appear
# Arranged chronologically on a timeline layout
# Linked files show relationship chains
```

### 6. Personal Knowledge Management

```bash
# Daily review workspace
kml workspace create "Today's Work" \
    --query "_recent_modified" \
    --date-from "today"

# Everything you touched today, in one place
# Review, organize, tag, or archive
# Dissolve at end of day — fresh start tomorrow
```

---

## Performance Characteristics

### Workspace Creation

| Files in Workspace | Query Time | Layout Time | Total |
|-------------------|-----------|-------------|-------|
| 10 | 100 ms | 20 ms | 120 ms |
| 50 | 150 ms | 80 ms | 230 ms |
| 200 | 250 ms | 300 ms | 550 ms |
| 1000 | 500 ms | 1.2 s | 1.7 s |

### Memory per Workspace

| Files | Node Data | Thumbnails | Layout | Total |
|-------|-----------|-----------|--------|-------|
| 10 | 2 KB | 500 KB | 1 KB | ~500 KB |
| 50 | 10 KB | 2.5 MB | 5 KB | ~2.5 MB |
| 200 | 40 KB | 10 MB | 20 KB | ~10 MB |
| 1000 | 200 KB | 50 MB | 100 KB | ~50 MB |

### Workspace Switch Latency

| Scenario | Latency |
|----------|---------|
| Switch active workspace (in memory) | < 1 ms |
| Restore from auto-save | 50 ms |
| Restore from frozen | 150 ms |
| Create from query (warm Qdrant) | 230 ms |
| Create from query (cold Qdrant) | 400 ms |

---

## Configuration

```toml
[workspaces]
# Maximum concurrent active workspaces
max_active = 20

# Auto-save interval (seconds)
auto_save_interval = 60

# Maximum auto-saves per workspace
max_auto_saves = 3

# Auto-dissolve idle workspace after (minutes, 0 = never)
auto_dissolve_idle_minutes = 60

# Default workspace creation options
default_top_k = 50
default_threshold = 0.65
default_layout = "force"

# Workspace storage
workspace_dir = "/var/lib/kamelot/workspaces"
max_frozen_storage = "10GB"

# Thumbnail caching
thumbnail_cache_size = 500
thumbnail_resolution = "128x128"

[workspaces.layout]
# Force layout parameters
force_attraction = 0.01
force_repulsion = 500.0
force_centering = 0.001
force_damping = 0.85
force_max_velocity = 50.0

# Default spacing
node_spacing = 150

# Link visualization
show_links = true
link_threshold = 0.75

[workspaces.spatial_memory]
# Enable spatial memory
enabled = true

# Persistence
persist_interval = 30  # seconds
max_memory_size = 10000  # positions per user
```

---

## Implementation Details

### Workspace Data Structure

```rust
#[derive(Clone)]
pub struct SyntheticWorkspace {
    pub id: WorkspaceId,
    pub name: String,
    pub query: QuerySource,
    pub created_at: SystemTime,
    pub last_active: SystemTime,
    pub state: WorkspaceState,
    pub nodes: Vec<WorkspaceNode>,
    pub layout: LayoutState,
    pub metadata: WorkspaceMetadata,
}

#[derive(Clone)]
pub struct WorkspaceNode {
    pub inode: Inode,
    pub filename: String,
    pub position: Vec2,
    pub size: Vec2,
    pub similarity: f32,
    pub pinned: bool,
    pub metadata: FileMetadata,
    pub thumbnail: Option<Thumbnail>,
    pub tags: Vec<String>,
}

#[derive(Clone)]
pub struct LayoutState {
    pub camera_offset: Vec2,
    pub camera_zoom: f32,
    pub force_layout_enabled: bool,
    pub algorithm: LayoutAlgorithm,
    pub custom_positions: HashMap<Inode, Vec2>,
}

impl SyntheticWorkspace {
    pub fn add_node(&mut self, node: WorkspaceNode) {
        // Compute initial position based on similarity to existing nodes
        let position = self.compute_insertion_position(&node);
        let mut node = node;
        node.position = position;
        self.nodes.push(node);
        self.update_layout();
    }
    
    pub fn remove_node(&mut self, inode: Inode) {
        self.nodes.retain(|n| n.inode != inode);
        self.update_layout();
    }
    
    pub fn find_similar_in_workspace(&self, inode: Inode, top_k: usize) -> Vec<&WorkspaceNode> {
        let target = self.nodes.iter().find(|n| n.inode == inode);
        let target = match target {
            Some(t) => t,
            None => return vec![],
        };
        
        let mut scored: Vec<(&WorkspaceNode, f32)> = self.nodes.iter()
            .filter(|n| n.inode != inode)
            .map(|n| (n, n.similarity))
            .collect();
        
        scored.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
        scored.truncate(top_k);
        
        scored.into_iter().map(|(n, _)| n).collect()
    }
    
    fn compute_insertion_position(&self, new_node: &WorkspaceNode) -> Vec2 {
        // Find most similar node and place near it
        let most_similar = self.nodes.iter()
            .max_by(|a, b| a.similarity.partial_cmp(&b.similarity).unwrap());
        
        match most_similar {
            Some(similar) => {
                let offset = Vec2::new(
                    rand::thread_rng().gen_range(-100.0..100.0),
                    rand::thread_rng().gen_range(-100.0..100.0),
                );
                similar.position + offset
            }
            None => Vec2::ZERO,
        }
    }
}
```

### Workspace Manager

```rust
pub struct WorkspaceManager {
    workspaces: HashMap<WorkspaceId, SyntheticWorkspace>,
    tab_order: Vec<WorkspaceId>,
    active_id: Option<WorkspaceId>,
    spatial_memory: SpatialMemory,
    auto_save: AutoSaveManager,
    config: WorkspaceConfig,
}

impl WorkspaceManager {
    pub async fn create(&mut self, name: String, query: String, 
                         options: QueryOptions) -> Result<WorkspaceId> {
        let workspace = self.build_workspace(name, query, options).await?;
        let id = workspace.id;
        self.workspaces.insert(id, workspace);
        self.tab_order.push(id);
        self.active_id = Some(id);
        Ok(id)
    }
    
    pub fn dissolve(&mut self, id: WorkspaceId) -> Result<()> {
        self.workspaces.remove(&id);
        self.tab_order.retain(|&tid| tid != id);
        if self.active_id == Some(id) {
            self.active_id = self.tab_order.last().copied();
        }
        Ok(())
    }
    
    pub fn freeze(&mut self, id: WorkspaceId) -> Result<()> {
        if let Some(ws) = self.workspaces.get_mut(&id) {
            ws.state = WorkspaceState::Frozen;
            self.auto_save.save(ws)?;
        }
        Ok(())
    }
    
    pub fn rename(&mut self, id: WorkspaceId, new_name: String) -> Result<()> {
        if let Some(ws) = self.workspaces.get_mut(&id) {
            ws.name = new_name;
        }
        Ok(())
    }
    
    pub fn switch_to(&mut self, id: WorkspaceId) -> Result<()> {
        if self.workspaces.contains_key(&id) {
            self.active_id = Some(id);
            if let Some(ws) = self.workspaces.get_mut(&id) {
                ws.last_active = SystemTime::now();
            }
        }
        Ok(())
    }
}
```

---

## Comparison with Traditional Approaches

| Aspect | Traditional Folders | Synthetic Workspaces |
|--------|-------------------|---------------------|
| Creation | User creates | Generated from query |
| Persistence | Permanent | Temporary (dissolvable) |
| Organization | Manual | Automatic (semantic) |
| Navigation | Tree traversal | Spatial layout |
| Maintenance | Manual cleanup | Self-cleaning |
| Structure | Rigid hierarchy | Flexible layout |
| Storage | Occupies real space | Virtual (query only) |
| Cross-device | Manual sync | Automatic via K-Swarm |
| Versioning | None (or manual) | Built-in via ledger |
| Collaboration | File sharing | Workspace sharing |
| Discovery | Browse directories | Visual exploration |
| Overhead | User attention | Compute time |

### When to Use Each

| Use Case | Traditional Folder | Synthetic Workspace |
|----------|------------------|-------------------|
| Permanent archive | ✓ | |
| Short-term project | | ✓ |
| File organization | ✓ | ✓ (complementary) |
| Version management | | ✓ |
| Team collaboration | ✓ (shared drive) | ✓ (shared workspace) |
| Backup | ✓ | (ledger provides this) |
| Quick access | ✓ (shortcuts) | ✓ (recent queries) |

---

*Synthetic workspaces represent a fundamental shift from location-based to meaning-based file interaction. By treating workspaces as ephemeral views into the semantic graph rather than permanent storage locations, Kamelot eliminates the cognitive burden of file organization while enabling new forms of visual data interaction.*

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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