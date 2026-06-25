---
title: "AI-OSS Gateway: Rust Architecture"
sidebar_position: 99
description: "The gateway is the brain of AI-OSS. It's a Rust binary that:"
tags: [features]
---

# AI-OSS Gateway: Rust Architecture

The gateway is the brain of AI-OSS. It's a Rust binary that:
- Manages the LlamaFile subprocess
- Executes tool calls from the AI model
- Handles WebSocket connections from the browser
- Reads/writes the knowledge graph (SQLite)
- Writes .aioss audit files
- Serves the web UI

## Why Rust?

- **Performance:** Threads and async for parallel inference + tool execution simultaneously. Memory-safe — no garbage collector pauses.
- **Binary output:** Single .exe for Windows/Linux/Mac. No runtime dependencies. Users download ONE file and run it.
- **Ecosystem:** tokio (async runtime), rusqlite (SQLite), tokio-tungstenite (WebSocket), serde (JSON), tracing (structured logging)

## Project Structure

```
ai-oss-gateway/
├── Cargo.toml              # Dependencies
├── src/
│   ├── main.rs             # Entry point, server setup
│   ├── llama.rs           # LlamaFile subprocess management
│   ├── tools.rs           # Tool registry + execution
│   ├── graph.rs           # Knowledge graph operations
│   ├── ws_server.rs       # WebSocket ↔ Browser bridge
│   ├── ledger.rs         # .aioss audit file writer
│   ├── config.rs          # config.yaml loader
│   └── embed.rs           # Local embeddings
└── static/
    └── index.html          # Web UI (WebSocket-based)
```

## Core Data Types

### LlamaManager (`src/llama.rs`)

```rust
pub struct LlamaManager {
    child: Child,               // The LlamaFile subprocess
    model_path: PathBuf,        // ~/.ai-oss/models/...
    backend: Backend,           // cpu | cuda | vulkan | metal
}

impl LlamaManager {
    pub fn new(model_path: &Path, backend: Backend) -> Self
    pub fn prompt(&self, system: &str, user: &str) -> impl Stream<Item = String>
    pub fn stop(&mut self)
}
```

### Graph Types (`src/graph.rs`)

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Node {
    pub id: Uuid,
    pub node_type: NodeType,
    pub label: String,
    pub content: String,
    pub stance: Option<Stance>,
    pub sentiment: f32,
    pub embeddings: Vec<f32>,
    pub metadata: NodeMetadata,
    pub created_at: DateTime<Utc>,
}

pub enum NodeType {
    Entity, Concept, Document, Agent, Decision, Evidence,
}

pub struct Edge {
    pub id: Uuid,
    pub source_id: Uuid,
    pub target_id: Uuid,
    pub edge_type: EdgeType,
    pub weight: f32,
    pub metadata: EdgeMetadata,
    pub created_at: DateTime<Utc>,
}

pub enum EdgeType {
    Supports, Contradicts, References, BelongsTo,
    EscalatesTo, RespondsTo, Precedes,
}
```

### Tool Types (`src/tools.rs`)

```rust
pub struct ToolCall {
    pub id: String,
    pub name: String,
    pub arguments: HashMap<String, serde_json::Value>,
}

pub enum ToolName {
    graph_search, graph_add_node, graph_add_edge,
    file_read, file_write, bash, web_search, ledger_append,
}
```

## Message Protocol (WebSocket)

All messages are JSON over WebSocket (`ws://localhost:3030`).

### Browser → Gateway

```json
// User submits a prompt
{
  "type": "prompt",
  "id": "req_001",
  "content": "Analyze the liability implications of removing Clause 4",
  "context": {
    "active_codex_id": "proj_alpha",
    "active_nodes": ["clause_4", "insurance_policy"],
    "mode": "council"
  }
}

// Browser requests graph data
{
  "type": "graph_query",
  "id": "req_002",
  "query": "contradictions clause 4",
  "limit": 10
}

// Heartbeat (auto every 60 seconds)
{
  "type": "heartbeat",
  "graph_state": { "nodes": 1420, "edges": 3847 },
  "active_agents": ["Risk Analyst", "Legal Analyst"]
}
```

### Gateway → Browser

```json
// Streaming token
{"type": "token", "id": "req_001", "content": "Sim", "done": false}
{"type": "token", "id": "req_001", "content": "ulation", "done": false}

// Done
{"type": "done", "id": "req_001", "total_tokens": 342, "duration_ms": 14200}

// Tool call detected
{
  "type": "tool_call",
  "id": "req_001",
  "tool": {
    "id": "tool_001",
    "name": "graph_search",
    "arguments": { "query": "contradiction clause 4" }
  }
}

// Error
{"type": "error", "id": "req_001", "message": "Model inference failed: out of memory"}
```

## Tool Execution Flow

1. **Model outputs tool call** — Qwen2.5 outputs XML-like tool call
2. **Gateway intercepts** — `parse_tool_call()` extracts name + args
3. **Tool execution** — Dispatches to handler (graph_search, file_read, bash, etc.)
4. **Result fed back to model** — Tool output injected as context

## Contradiction Detection Algorithm

```rust
fn detect_contradictions(new_node: &Node) -> Vec<Contradiction> {
    // 1. Semantic similarity search (cosine > 0.7)
    let candidates = graph_store.embedding_search(
        new_node.embeddings, threshold = 0.7
    );
    // 2. Check existing edges for CONTRADICTS
    // 3. Implicit contradiction: high similarity + opposing stance
}
```

## Graph Database (SQLite)

```sql
CREATE TABLE nodes (
  id TEXT PRIMARY KEY,
  node_type TEXT NOT NULL,
  label TEXT NOT NULL,
  content TEXT,
  stance TEXT,
  sentiment REAL DEFAULT 0.0,
  embedding BLOB,
  metadata TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE edges (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES nodes(id),
  target_id TEXT NOT NULL REFERENCES nodes(id),
  edge_type TEXT NOT NULL,
  weight REAL DEFAULT 0.5,
  metadata TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_edges_source ON edges(source_id);
CREATE INDEX idx_edges_target ON edges(target_id);
CREATE VIRTUAL TABLE nodes_fts USING fts5(label, content);
```

## Config Structure (opencode.json)

```json
{
  "gateway": {
    "host": "127.0.0.1",
    "port": 3030,
    "ui_port": 8080,
    "log_level": "info"
  },
  "model": {
    "llamafile_path": "~/.ai-oss/llamafile",
    "model_path": "~/.ai-oss/models/Qwen2.5-7B-Instruct-Q4_K_M.gguf",
    "backend": "cpu",
    "context_length": 8192,
    "threads": 4,
    "n_gpu_layers": 0
  },
  "ledger": {
    "enabled": true,
    "directory": "~/.ai-oss/ledger",
    "format": "aioss",
    "retention_days": 365
  },
  "tools": {
    "sandboxed": true,
    "allowed_paths": ["~/.ai-oss/", "/tmp/ai-oss/"],
    "blocked_commands": ["rm -rf /", "dd if=", ":(){:|:&};"]
  }
}
```

## Dependencies (Cargo.toml)

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
tokio-tungstenite = "0.21"
futures-util = "0.3"
rusqlite = { version = "0.31", features = ["bundled"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
uuid = { version = "1", features = ["v4", "serde"] }
chrono = { version = "0.4", features = ["serde"] }
tracing = "0.1"
tracing-subscriber = "0.3"
anyhow = "1"
thiserror = "1"
parking_lot = "0.12"
sha2 = "0.10"
base64 = "0.22"
directories = "5"
```

## See Also

Related features, architecture, and roadmap documentation.

- [Features Overview](../features/README.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [API Reference](../api-reference/01-overview.md)
- [Roadmap](../roadmap/01-product-vision.md)

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
