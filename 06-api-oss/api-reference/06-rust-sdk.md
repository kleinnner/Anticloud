---
title: "API Reference 06: Rust SDK"
sidebar_position: 6
description: "[dependencies]"
tags: [api]
---

# API Reference 06: Rust SDK

## Installation

```toml
[dependencies]
api-oss = "0.1"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```

## Client Initialization

```rust
use api_oss::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let client = APIOSS::builder()
        .api_key("sk-aioss-xxxxxxxxxxxx")
        .base_url("http://localhost:8080/v1")
        .timeout(std::time::Duration::from_secs(30))
        .build()?;

    Ok(())
}
```

## Chat

```rust
use api_oss::chat::{ChatMessage, ChatCompletionRequest};

// Basic chat
let response = client
    .chat()
    .create(ChatCompletionRequest::new(
        "qwen2.5-7b-q4",
        vec![ChatMessage::user("Hello!")],
    ))
    .await?;

if let Some(msg) = response.choices.first() {
    println!("{}", msg.message.content.as_deref().unwrap_or(""));
}

// System prompt + user
let response = client
    .chat()
    .create(ChatCompletionRequest::new(
        "qwen2.5-7b-q4",
        vec![
            ChatMessage::system("You are a legal assistant."),
            ChatMessage::user("Analyze this contract for risks."),
        ],
    ))
    .await?;

// Streaming
let mut stream = client
    .chat()
    .create_streaming(ChatCompletionRequest::new(
        "qwen2.5-7b-q4",
        vec![ChatMessage::user("Tell me a story")],
    ))
    .await?;

use futures_util::StreamExt;
while let Some(chunk) = stream.next().await {
    let chunk = chunk?;
    if let Some(delta) = chunk.choices.first().and_then(|c| c.delta.as_ref()) {
        if let Some(ref content) = delta.content {
            print!("{}", content);
        }
    }
}
```

## Function Calling

```rust
use api_oss::chat::{Tool, FunctionDef};
use serde_json::json;

let tools = vec![Tool::function(FunctionDef::new(
    "graph_search",
    "Search the knowledge graph",
    json!({
        "type": "object",
        "properties": {
            "query": { "type": "string" }
        },
        "required": ["query"]
    }),
))];

let response = client
    .chat()
    .create(
        ChatCompletionRequest::new("qwen2.5-7b-q4", vec![ChatMessage::user("Find contradictions")])
            .with_tools(tools),
    )
    .await?;

if let Some(msg) = response.choices.first().map(|c| &c.message) {
    if let Some(tool_calls) = &msg.tool_calls {
        for call in tool_calls {
            match call.function.name.as_str() {
                "graph_search" => {
                    let result = client.graph().search(&call.function.arguments).await?;
                    // Send result back to model...
                }
                _ => {}
            }
        }
    }
}
```

## Graph CRUD

```rust
use api_oss::graph::{Node, NodeType, Edge, EdgeType};

// Search
let results: Vec<Node> = client
    .graph()
    .search("liability cap")
    .node_type(NodeType::Concept)
    .limit(10)
    .await?;

for node in results {
    println!("{} ({}): {}", node.label, node.node_type, node.content);
}

// Get by ID
let node: Node = client.graph().get("uuid_insurance_policy").await?;

// Create
let new_node = client
    .graph()
    .create(Node::new(NodeType::Concept, "New Clause", "Clause text..."))
    .await?;

// Link
client
    .graph()
    .link(&new_node.id, "uuid_policy", EdgeType::References)
    .weight(1.0)
    .await?;

// Neighbors
let neighbors = client
    .graph()
    .neighbors("uuid_sarah")
    .depth(2)
    .await?;
```

## Document Ingestion

```rust
use api_oss::documents::IngestOptions;

let result = client
    .documents()
    .ingest("./contract.pdf")
    .options(IngestOptions::new()
        .codex_id("project-alpha")
        .chunk_size(512)
        .recursive(true))
    .await?;

println!("Created {} nodes", result.nodes_created);

// Watch directory
let mut watcher = client
    .documents()
    .watch("./inbox/")
    .await?;

while let Some(event) = watcher.next().await {
    println!("New document: {}", event.path.display());
}
```

## Error Handling

```rust
use api_oss::error::APIOSSError;

match client.chat().create(request).await {
    Ok(response) => println!("Success: {}", response.id),
    Err(APIOSSError::RateLimited { retry_after, .. }) => {
        println!("Rate limited, retry in {}s", retry_after);
        tokio::time::sleep(Duration::from_secs(retry_after as u64)).await;
    }
    Err(APIOSSError::Auth { .. }) => {
        eprintln!("Authentication failed");
    }
    Err(e) => {
        eprintln!("API Error: {}", e);
    }
}
```

## Feature Flags

```toml
[dependencies.api-oss]
version = "0.1"
features = ["full"]     # All features
# Or selectively:
features = ["chat", "graph", "documents"]
# Available: chat, graph, documents, models, ledger, council, bridge, streaming
```

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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
