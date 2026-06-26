▄▄                     ██               ▄▄
██                     ▀▀               ██
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document Version: 1.0.0
Last Updated: 2026-06-19
Category: BDR / AI Decision
Audience: Engineering team, ML/Infrastructure
Doc ID: LIBERN-BDR-AI-004

# BDR 004: Why Local llama.cpp Instead of Cloud AI APIs

## Status

**Accepted.** Local inference via `llama-cpp-2` Rust crate with Qwen 2.5 1.5B GGUF model.

## Context

Libern requires an AI assistant ("Liber") that provides:
1. Chat Q&A, summarization, document analysis, content moderation
2. **Zero data exfiltration** — no data can leave the user's machine
3. **Offline operation** — AI must work without internet
4. **No ongoing costs** — no per-token or per-user AI fees
5. **Low latency** — responses in <2 seconds for most queries

The team evaluated:

**Option A: Cloud AI APIs**
- OpenAI GPT-4, Anthropic Claude, Google Gemini
- Pay per token, high quality

**Option B: Local llama.cpp (Qwen 2.5 1.5B)**
- Open-source model, runs on-device via CPU/GPU
- Free, private, offline

**Option C: Hybrid (local for basic, cloud for complex)**
- Use local for fast path, cloud for complex queries

## Decision

**Chose fully local AI via `llama-cpp-2`** with Qwen 2.5 1.5B Instruct.

### Implementation

The AI subsystem is in `libern-core/src/ai/`:

```
libern-core/src/ai/
├── mod.rs           # AiEngine trait, TokenEvent, ModerationResult
├── engine.rs        # MockEngine for development
├── qwen_engine.rs   # CandleEngine for production Qwen
├── pipeline.rs      # Prompt construction, context packing
├── summarizer.rs    # Channel summarization logic
├── moderator.rs     # Content moderation (keyword + model)
├── rag.rs           # Document RAG with embeddings
├── conversation.rs  # Context window management
├── liber_user.rs    # Liber's system user identity
└── reward.rs        # RLHF feedback collection
```

### Why Local Over Cloud

1. **Privacy.** Cloud AI requires sending all user messages to external servers. Libern's value proposition is zero data exfiltration — local AI is the only option.

2. **Offline operation.** Cloud APIs require internet. Libern works fully offline.

3. **Cost.** Cloud AI costs $10-30/user/month for Slack AI or Copilot. Local AI costs $0 after the one-time model download.

4. **Latency.** Cloud AI round-trip: 1-5 seconds. Local AI: 0.2-2 seconds. The difference is noticeable in chat.

5. **Rate limits.** Cloud APIs have rate limits. Local AI has none.

6. **Reliability.** Cloud AI depends on API uptime. Local AI works regardless of network status.

### Model Selection

| Model | Params | Quant | Size | Quality | Speed (CPU) |
|---|---|---|---|---|---|
| Qwen 2.5 1.5B | 1.5B | Q4_K_M | 1.1 GB | Good | 15-40 tok/s |
| Llama 3.2 3B | 3B | Q4_K_M | 2.2 GB | Better | 8-15 tok/s |
| Mistral 7B | 7B | Q4_K_M | 4.1 GB | Best | 3-8 tok/s |

**Chose Qwen 2.5 1.5B** because:
- Best quality-to-size ratio for the 1.5B class
- Fits in <2 GB RAM during inference
- Fast enough for real-time chat (40 tok/s)
- Apache 2.0 license

### Engine Abstraction

```rust
// mod.rs — AiEngine trait enables multiple backends
pub trait AiEngine: Send + 'static {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String>;
    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String>;
    fn is_loaded(&self) -> bool;
    fn model_info(&self) -> ModelInfo;
}
```

```rust
// engine.rs — MockEngine for CI/development
pub struct MockEngine { loaded: AtomicBool }
// Returns canned responses, no model file needed
```

```rust
// lib.rs — Runtime engine selection
let engine: Box<dyn AiEngine + Send> = if model_path.exists() {
    Box::new(CandleEngine::new(model_path, binary_dir)?)
} else {
    Box::new(MockEngine::new())  // Graceful fallback
};
```

### Trade-offs Acknowledged

| Concern | Mitigation |
|---|---|
| Model quality lower than GPT-4 | Qwen 2.5 1.5B is surprisingly capable for a 1.5B model. Good enough for summarization, Q&A, moderation. |
| 1.1 GB download | One-time. Resume support via HTTP Range headers. Can be pre-placed by IT. |
| 1.6 GB RAM during inference | Only when actively using AI. Memory is freed when model unloads. |
| Slower than cloud for complex tasks | For complex tasks, use cloud as an optional backend (planned). |
| Model file integrity | SHA-256 verification on download. |

### Performance Targets

From `AI_FEATURES_PLAN.md`:

| Operation | Expected Time |
|---|---|
| Model load | 3-8 seconds |
| First token | 200-800ms |
| Token generation | 15-40 tok/s |
| Embedding (512 tokens) | 300-500ms |
| Moderation (model) | 500-1000ms |
| Moderation (keyword) | <1ms |
| Context packing | 10-50ms |
| Cosine similarity (50k) | 20-50ms |

### Alternatives Considered

**Cloud AI (OpenAI/Claude).** Rejected because:
- Violates privacy requirement (data leaves device)
- Requires internet (violates offline requirement)
- Ongoing cost ($10-30/user/month)
- OpenAI/Claude ToS allow training on API inputs (opt-out available but dubious)

**Hybrid (local fast path, cloud for complex).** Rejected for MVP because:
- Adds architectural complexity
- Privacy promise is undermined if any data goes to cloud
- Can be added later as optional feature

## Consequences

1. Liber AI works fully offline with zero data exfiltration.
2. One-time model download (~1.1 GB) required for AI features.
3. MockEngine provides AI functionality during development without model file.
4. Performance depends on local hardware (15-40 tok/s on modern CPU).
5. Model can be upgraded independently (swap GGUF files).

## AiEngine Trait Deep Dive

The `AiEngine` trait in `libern-core/src/ai/mod.rs` defines the interface for all AI backends:

```rust
pub trait AiEngine: Send + 'static {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String>;
    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String>;
    fn is_loaded(&self) -> bool;
    fn model_info(&self) -> ModelInfo;
}
```

The `InferenceRequest` struct contains:

```rust
pub struct InferenceRequest {
    pub prompt: String,
    pub max_tokens: u32,
    pub temperature: f32,
    pub callback: Box<dyn Fn(TokenEvent) + Send>,
}
```

Tokens are streamed back via the callback:

```rust
pub struct TokenEvent {
    pub token: String,
    pub done: bool,
    pub full_response: Option<String>,
}
```

This enables real-time streaming of AI responses in the UI — tokens appear as they are generated.

## MockEngine for Development

The `MockEngine` (in `libern-core/src/ai/engine.rs`) provides deterministic responses for CI/CD:

```rust
impl AiEngine for MockEngine {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String> {
        let canned = format!(
            "I'm Liber, your local AI assistant. I see you asked: \"{}\"",
            request.prompt.chars().take(80).collect::<String>()
        );
        for word in canned.split(' ') {
            (request.callback)(TokenEvent {
                token: format!("{} ", word),
                done: false,
                full_response: None,
            });
        }
        (request.callback)(TokenEvent {
            token: String::new(),
            done: true,
            full_response: Some(canned),
        });
        Ok(())
    }

    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String> {
        let hash: u64 = text.bytes().fold(0u64, |acc, b| {
            acc.wrapping_mul(31).wrapping_add(b as u64)
        });
        let mut emb = vec![0.0f32; 128];
        for i in 0..128 {
            emb[i] = ((hash >> (i % 8 * 8)) & 0xFF) as f32 / 255.0 - 0.5;
        }
        let mag: f32 = emb.iter().map(|x| x * x).sum::<f32>().sqrt();
        if mag > 0.0 { for e in &mut emb { *e /= mag; } }
        Ok(emb)
    }
}
```

## RAG System Architecture

The RAG system in `libern-core/src/ai/rag.rs` enables document Q&A:

```rust
pub fn ingest_document(
    engine: &mut Box<dyn AiEngine + Send>,
    db: &Database,
    document_id: &str,
    text: &str,
    chunk_size: usize,
) -> Result<usize, String> {
    let chunks = chunk_text(text, chunk_size);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    for (i, chunk) in chunks.iter().enumerate() {
        let embedding = engine.embed(chunk)?;
        let embedding_blob: Vec<u8> = embedding
            .iter()
            .flat_map(|f| f.to_le_bytes())
            .collect();
        conn.execute(
            "INSERT INTO document_chunks (...) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            rusqlite::params![
                uuid::Uuid::new_v4().to_string(),
                document_id, i as i32, chunk, embedding_blob,
                chrono::Utc::now().timestamp_millis(),
            ],
        ).map_err(|e| e.to_string())?;
    }
    Ok(chunks.len())
}
```

Query flow: embed query → cosine similarity search → top-k chunks → RAG prompt → model inference.

## Content Moderation Pipeline

`libern-core/src/ai/moderator.rs` implements a two-stage moderation:

1. **Keyword filter** — fast pre-filter using pattern matching
2. **AI classification** — model-based analysis with structured output

```rust
pub fn classify_message(engine: &mut Box<dyn AiEngine + Send>, content: &str) -> Result<ModerationResult, String> {
    if let Some(classification) = keyword_filter(content) {
        return Ok(ModerationResult { classification, reason: "Matched keyword filter".into(), confidence: 0.95 });
    }
    let prompt = format!(
        "Classify the following message as SAFE, FLAG, or BLOCK.\n\
         Consider: toxicity, harassment, hate speech, spam, malicious code.\n\n\
         Message: {}\n\nRespond with JSON only",
        content
    );
    engine.infer(InferenceRequest { prompt, max_tokens: 128, temperature: 0.0, callback })
}
```

## Cost Comparison: Cloud vs Local AI

| Cost factor | Cloud AI (per user/year) | Local AI (per user/year) |
|-------------|-------------------------|-------------------------|
| API usage (10K queries/mo) | $60-180 | $0 |
| GPU inference hardware | $0 (included) | $0 (CPU-only) |
| Network bandwidth | $5-15 | $0 |
| Model download amortized | $0 | $0.50 (one-time) |
| **Total** | **$65-195/user/yr** | **$0.50/user (first year)** |

## Local AI: Module-by-Module Breakdown

### Summarizer Module

```rust
// libern-core/src/ai/summarizer.rs
pub fn summarize_channel(
    engine: &mut Box<dyn AiEngine + Send>,
    db: &Database,
    channel_id: &str,
    message_count: u32,
    callback: Box<dyn Fn(TokenEvent) + Send>,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT content FROM messages WHERE channel_id = ?1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT ?2"
    ).map_err(|e| e.to_string())?;

    let messages: Vec<String> = stmt
        .query_map(rusqlite::params![channel_id, message_count], |row| {
            row.get::<_, String>(0)
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    if messages.is_empty() {
        return Err("No messages to summarize".into());
    }

    let conversation = messages.iter().enumerate()
        .map(|(i, m)| format!("Message {}: {}", i + 1, m))
        .collect::<Vec<_>>().join("\n");

    let prompt = format!(
        "Summarize the following channel conversation in concise bullet points.\n\
         Focus on: key decisions, action items, important questions.\n\n{}",
        conversation
    );

    engine.infer(InferenceRequest {
        prompt,
        max_tokens: 512,
        temperature: 0.3,
        callback,
    })
}
```

### Moderator Module (Two-Stage)

```rust
// libern-core/src/ai/moderator.rs
// Stage 1: Keyword pre-filter (fast path)
pub fn keyword_filter(content: &str) -> Option<Classification> {
    let lower = content.to_lowercase();
    for pattern in BLOCKED_PATTERNS {
        if lower.contains(pattern) {
            return Some(Classification::Block);
        }
    }
    for pattern in FLAGGED_PATTERNS {
        if lower.contains(pattern) {
            return Some(Classification::Flag);
        }
    }
    None
}

// Stage 2: AI classification (accurate path)
pub fn classify_message(
    engine: &mut Box<dyn AiEngine + Send>,
    content: &str,
) -> Result<ModerationResult, String> {
    if let Some(classification) = keyword_filter(content) {
        return Ok(ModerationResult {
            classification,
            reason: "Matched keyword filter".into(),
            confidence: 0.95,
        });
    }

    let prompt = format!(
        "Classify the following message as SAFE, FLAG, or BLOCK.\n\
         Consider: toxicity, harassment, hate speech, spam, malicious code.\n\n\
         Message: {}\n\nRespond with JSON only",
        content
    );

    engine.infer(InferenceRequest {
        prompt,
        max_tokens: 128,
        temperature: 0.0,
        callback,
    })
}
```

### RAG Module (Document Q&A)

```rust
// libern-core/src/ai/rag.rs
pub fn query_documents(
    engine: &mut Box<dyn AiEngine + Send>,
    db: &Database,
    query: &str,
    channel_id: &str,
    top_k: usize,
    callback: Box<dyn Fn(TokenEvent) + Send>,
) -> Result<(), String> {
    let query_embed = engine.embed(query)?;
    
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT c.chunk_text, c.embedding, d.file_name
         FROM document_chunks c
         JOIN documents d ON c.document_id = d.id
         WHERE d.channel_id = ?1 AND c.embedding IS NOT NULL"
    ).map_err(|e| e.to_string())?;

    let mut scored: Vec<(f32, String, String)> = stmt
        .query_map(rusqlite::params![channel_id], |row| {
            let text: String = row.get(0)?;
            let embedding_blob: Vec<u8> = row.get(1)?;
            let file_name: String = row.get(2)?;
            let emb: Vec<f32> = embedding_blob.chunks(4)
                .map(|c| f32::from_le_bytes([c[0], c[1], c[2], c[3]]))
                .collect();
            let score = cosine_similarity(&query_embed, &emb);
            Ok((score, text, file_name))
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    scored.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap_or(std::cmp::Ordering::Equal));
    let top: Vec<_> = scored.into_iter().take(top_k).collect();

    // Build RAG prompt and infer
    let context = top.iter().enumerate()
        .map(|(_, (score, text, file))| 
            format!("[Source: {}, Relevance: {:.2}]\n{}", file, score, text))
        .collect::<Vec<_>>().join("\n\n");

    let prompt = format!(
        "Answer the question based on the provided document context.\n\
         If the context doesn't contain the answer, say so.\n\n\
         Context:\n{}\n\nQuestion: {}",
        context, query
    );

    engine.infer(InferenceRequest {
        prompt,
        max_tokens: 512,
        temperature: 0.3,
        callback,
    })
}

fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
    let dot: f32 = a.iter().zip(b.iter()).map(|(x, y)| x * y).sum();
    let mag_a: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
    let mag_b: f32 = b.iter().map(|x| x * x).sum::<f32>().sqrt();
    if mag_a == 0.0 || mag_b == 0.0 { 0.0 } else { dot / (mag_a * mag_b) }
}
```

## Alternative AI Models Tested

| Model | Params | Quant | RAM | Quality | Speed | Verdict |
|-------|--------|-------|-----|---------|-------|---------|
| Qwen 2.5 1.5B | 1.5B | Q4_K_M | 1.6 GB | Good | 40 tok/s | ✅ Chosen |
| Llama 3.2 3B | 3B | Q4_K_M | 2.4 GB | Better | 15 tok/s | 🔄 Future |
| Mistral 7B | 7B | Q4_K_M | 4.7 GB | Best | 7 tok/s | ❌ Too slow |
| Phi-3 Mini | 3.8B | Q4_K_M | 2.8 GB | Good | 12 tok/s | ❌ Quality |
| Gemma 2 2B | 2B | Q4_K_M | 1.8 GB | Fair | 20 tok/s | ❌ Quality |
| StableLM 3B | 3B | Q4_K_M | 2.2 GB | Fair | 14 tok/s | ❌ Quality |

## Prompt Engineering Patterns

### Summarization Prompt
```
Summarize the following channel conversation in concise bullet points.
Focus on: key decisions, action items, important questions.

Conversation:
Message 1: ...
Message 2: ...

Bullet points:
```

### Moderation Prompt
```
Classify the following message as SAFE, FLAG, or BLOCK.
Consider: toxicity, harassment, hate speech, spam, malicious code.

Message: {content}

Response (JSON): {"classification": "...", "reason": "...", "confidence": 0.0}
```

### RAG Q&A Prompt
```
Answer the question based on the provided document context.
If the context doesn't contain the answer, say so.

Context:
[Source: doc.pdf, Relevance: 0.95]
...

Question: {query}
```

## References

- `libern-core/src/ai/engines.rs` — MockEngine implementation
- `libern-core/src/ai/mod.rs` — AiEngine trait definition
- `libern-core/src/ai/pipeline.rs` — Prompt construction for local inference
- `libern-core/src/ai/summarizer.rs` — Channel summarization pipeline
- `libern-core/src/ai/moderator.rs` — Moderation pipeline
- `libern-core/src/ai/rag.rs` — Document RAG with local embeddings
- `libern-core/src/ai/conversation.rs` — Context window management
- `libern-core/src/ai/reward.rs` — RLHF feedback collection
- `apps/desktop/src-tauri/src/lib.rs` — AI engine initialization
- `apps/desktop/src-tauri/src/commands/ai.rs` — AI Tauri commands
- `AI_FEATURES_PLAN.md` — Complete AI subsystem design

## Technical Implementation Reference

### Core Rust Architecture

`ust
// libern-core/src/lib.rs
pub mod ai;
pub mod crdt;
pub mod crypto;
pub mod db;
`

### Database Schema (libern-core/src/db/schema.rs)

`sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    public_key BLOB NOT NULL,
    avatar_path TEXT,
    is_local INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL REFERENCES users(id),
    avatar_path TEXT,
    invite_code TEXT UNIQUE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS channels (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'text',
    position INTEGER NOT NULL DEFAULT 0,
    parent_id TEXT REFERENCES channels(id),
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    content_plain TEXT,
    reply_to TEXT REFERENCES messages(id),
    hlc_timestamp INTEGER NOT NULL,
    signature BLOB NOT NULL,
    edited_at INTEGER,
    deleted_at INTEGER,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color INTEGER,
    position INTEGER NOT NULL DEFAULT 0,
    permissions INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS role_assignments (
    role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, user_id)
);

CREATE TABLE IF NOT EXISTS invites (
    code TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    max_uses INTEGER,
    use_count INTEGER NOT NULL DEFAULT 0,
    expires_at INTEGER,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_conversations (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    token_count INTEGER,
    message_ref TEXT,
    created_at INTEGER NOT NULL
);
`

### Database Initialization

`ust
// libern-core/src/db/mod.rs
pub struct Database {
    pub conn: Mutex<Connection>,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self, rusqlite::Error> {
        let conn = Connection::open(db_path)?;
        conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")?;
        let db = Database { conn: Mutex::new(conn) };
        db.initialize_tables()?;
        Ok(db)
    }

    pub fn in_memory() -> Result<Self, rusqlite::Error> {
        let conn = Connection::open_in_memory()?;
        conn.execute_batch("PRAGMA foreign_keys=ON;")?;
        let db = Database { conn: Mutex::new(conn) };
        db.initialize_tables()?;
        Ok(db)
    }

    fn initialize_tables(&self) -> Result<(), rusqlite::Error> {
        let conn = self.conn.lock().unwrap();
        for stmt in schema::CREATE_TABLES {
            if let Err(e) = conn.execute(stmt, []) {
                if !e.to_string().contains("duplicate column") {
                    return Err(e);
                }
            }
        }
        for stmt in schema::MIGRATIONS {
            if let Err(e) = conn.execute(stmt, []) {
                if !e.to_string().contains("duplicate column") {
                    return Err(e);
                }
            }
        }
        Ok(())
    }
}
`

### Cryptographic Ledger

`ust
// libern-core/src/crypto/mod.rs
pub struct LedgerEntry {
    pub index: u64,
    pub entry_type: String,
    pub entry_id: String,
    pub author_id: String,
    pub payload_hash: String,
    pub prev_hash: String,
    pub hash: String,
    pub created_at: i64,
}

impl LedgerEntry {
    pub fn compute_hash(prev_hash: &str, payload_hash: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(prev_hash.as_bytes());
        hasher.update(payload_hash.as_bytes());
        hex::encode(hasher.finalize())
    }

    pub fn hash_payload(data: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(data);
        hex::encode(hasher.finalize())
    }
}

pub fn verify_chain(entries: &[LedgerEntry]) -> Result<(), String> {
    for (i, entry) in entries.iter().enumerate() {
        let expected_hash = if i == 0 {
            LedgerEntry::compute_hash("", &entry.payload_hash)
        } else {
            LedgerEntry::compute_hash(&entries[i - 1].hash, &entry.payload_hash)
        };
        if entry.hash != expected_hash {
            return Err(format!(
                "Hash mismatch at entry {}: expected {}, got {}",
                entry.index, expected_hash, entry.hash
            ));
        }
    }
    Ok(())
}
`

### CRDT Engine

`ust
// libern-core/src/crdt/mod.rs
pub struct HybridLogicalClock {
    pub physical: u64,
    pub logical: u16,
}

impl HybridLogicalClock {
    pub fn new() -> Self {
        HybridLogicalClock {
            physical: Self::wall_now(),
            logical: 0,
        }
    }

    pub fn tick(&mut self) -> u64 {
        let now = Self::wall_now();
        if now > self.physical {
            self.physical = now;
            self.logical = 0;
        } else {
            self.logical = self.logical.wrapping_add(1);
        }
        self.encode()
    }

    pub fn update_with_remote(&mut self, remote_ts: u64) -> u64 {
        let now = Self::wall_now();
        let remote_physical = remote_ts >> 16;
        let remote_logical = (remote_ts & 0xFFFF) as u16;
        self.physical = self.physical.max(now).max(remote_physical);
        if self.physical == remote_physical {
            self.logical = self.logical.max(remote_logical).wrapping_add(1);
        } else {
            self.logical = 0;
        }
        self.encode()
    }

    fn encode(&self) -> u64 {
        (self.physical << 16) | (self.logical as u64)
    }

    fn wall_now() -> u64 {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64
    }
}

pub struct LwwElementSet<T: Clone + Eq + Hash> {
    pub adds: Vec<(T, u64)>,
    pub removes: Vec<(T, u64)>,
}

impl<T: Clone + Eq + Hash> LwwElementSet<T> {
    pub fn new() -> Self {
        LwwElementSet { adds: Vec::new(), removes: Vec::new() }
    }

    pub fn add(&mut self, element: T, timestamp: u64) {
        self.adds.push((element, timestamp));
    }

    pub fn remove(&mut self, element: T, timestamp: u64) {
        self.removes.push((element, timestamp));
    }

    pub fn snapshot(&self) -> Vec<T> {
        let mut result = Vec::new();
        for (elem, add_ts) in &self.adds {
            let is_removed = self.removes.iter()
                .any(|(r, rm_ts)| r == elem && rm_ts > add_ts);
            if !is_removed && !result.contains(elem) {
                result.push(elem.clone());
            }
        }
        result
    }

    pub fn merge(&mut self, other: &LwwElementSet<T>) {
        for (elem, ts) in &other.adds {
            if !self.adds.iter().any(|(e, _)| e == elem) {
                self.adds.push((elem.clone(), *ts));
            }
        }
        for (elem, ts) in &other.removes {
            if !self.removes.iter().any(|(e, _)| e == elem) {
                self.removes.push((elem.clone(), *ts));
            }
        }
    }
}
`

### AI Engine Interface

`ust
// libern-core/src/ai/mod.rs
pub trait AiEngine: Send + 'static {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String>;
    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String>;
    fn is_loaded(&self) -> bool;
    fn model_info(&self) -> ModelInfo;
}

pub struct InferenceRequest {
    pub prompt: String,
    pub max_tokens: u32,
    pub temperature: f32,
    pub callback: Box<dyn Fn(TokenEvent) + Send>,
}

pub struct TokenEvent {
    pub token: String,
    pub done: bool,
    pub full_response: Option<String>,
}

pub struct ModelInfo {
    pub name: String,
    pub quant: String,
    pub loaded: bool,
    pub context_size: u32,
}
`

### Mock Engine Implementation

`ust
// libern-core/src/ai/engine.rs
pub struct MockEngine {
    loaded: AtomicBool,
}

impl MockEngine {
    pub fn new() -> Self {
        MockEngine { loaded: AtomicBool::new(true) }
    }
}

impl AiEngine for MockEngine {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String> {
        let canned = format!(
            "I'm Liber, your local AI assistant. I see you asked: \"{}\"",
            request.prompt.chars().take(80).collect::<String>()
        );
        for word in canned.split(' ') {
            (request.callback)(TokenEvent {
                token: format!("{} ", word), done: false, full_response: None,
            });
        }
        (request.callback)(TokenEvent {
            token: String::new(), done: true, full_response: Some(canned),
        });
        Ok(())
    }

    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String> {
        let hash: u64 = text.bytes().fold(0u64, |acc, b|
            acc.wrapping_mul(31).wrapping_add(b as u64));
        let mut emb = vec![0.0f32; 128];
        for i in 0..128 {
            emb[i] = ((hash >> (i % 8 * 8)) & 0xFF) as f32 / 255.0 - 0.5;
        }
        let mag: f32 = emb.iter().map(|x| x * x).sum::<f32>().sqrt();
        if mag > 0.0 { for e in &mut emb { *e /= mag; } }
        Ok(emb)
    }

    fn is_loaded(&self) -> bool { self.loaded.load(Ordering::Relaxed) }

    fn model_info(&self) -> ModelInfo {
        ModelInfo {
            name: "Mock (Qwen 2.5 1.5B)".into(),
            quant: "Q4_K_M".into(), loaded: true, context_size: 4096,
        }
    }
}
`

### RAG Document System

`ust
// libern-core/src/ai/rag.rs
pub fn ingest_document(
    engine: &mut Box<dyn AiEngine + Send>,
    db: &Database,
    document_id: &str,
    text: &str,
    chunk_size: usize,
) -> Result<usize, String> {
    let chunks = chunk_text(text, chunk_size);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    for (i, chunk) in chunks.iter().enumerate() {
        let embedding = engine.embed(chunk)?;
        let embedding_blob: Vec<u8> = embedding.iter()
            .flat_map(|f| f.to_le_bytes()).collect();
        conn.execute(
            "INSERT INTO document_chunks (id, document_id, chunk_index, chunk_text, embedding, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            rusqlite::params![uuid::Uuid::new_v4().to_string(), document_id,
                i as i32, chunk, embedding_blob, chrono::Utc::now().timestamp_millis()],
        ).map_err(|e| e.to_string())?;
    }
    Ok(chunks.len())
}

fn chunk_text(text: &str, chunk_size: usize) -> Vec<String> {
    text.split_whitespace()
        .collect::<Vec<_>>()
        .chunks(chunk_size)
        .map(|c| c.join(" "))
        .collect()
}
`

### Data Models

`ust
// libern-core/src/db/models.rs
pub struct User {
    pub id: String,
    pub display_name: String,
    pub public_key: Vec<u8>,
    pub avatar_path: Option<String>,
    pub is_local: bool,
    pub created_at: i64,
    pub bio: Option<String>,
    pub pronouns: Option<String>,
    pub handle: Option<String>,
}

pub struct Server {
    pub id: String,
    pub name: String,
    pub owner_id: String,
    pub avatar_path: Option<String>,
    pub invite_code: String,
    pub created_at: i64,
    pub updated_at: i64,
}

pub struct Channel {
    pub id: String,
    pub server_id: String,
    pub name: String,
    pub kind: String,
    pub position: i32,
    pub parent_id: Option<String>,
    pub created_at: i64,
}

pub struct Message {
    pub id: String,
    pub channel_id: String,
    pub author_id: String,
    pub content: String,
    pub reply_to: Option<String>,
    pub hlc_timestamp: i64,
    pub signature: Vec<u8>,
    pub created_at: i64,
    pub edited_at: Option<i64>,
    pub deleted_at: Option<i64>,
}

pub struct Role {
    pub id: String,
    pub server_id: String,
    pub name: String,
    pub color: Option<i32>,
    pub position: i32,
    pub permissions: i64,
    pub created_at: i64,
}

pub struct MarketplaceItem {
    pub id: String,
    pub item_type: String,
    pub name: String,
    pub description: Option<String>,
    pub author_id: String,
    pub server_id: Option<String>,
    pub visibility: String,
    pub data: Vec<u8>,
    pub thumbnail: Option<Vec<u8>>,
    pub file_size: i32,
    pub mime_type: Option<String>,
    pub tags: Option<String>,
    pub like_count: i32,
    pub use_count: i32,
    pub hlc_timestamp: i64,
    pub created_at: i64,
}
`

### Cargo.toml (Workspace Root)

`	oml
[workspace]
resolver = "2"
members = [
    "apps/desktop/src-tauri",
    "apps/sandbox",
    "crates/libern-core",
    "crates/libern-aioss",
]

[workspace.package]
version = "0.1.0"
edition = "2021"
authors = ["Libern Team"]
`

## Database Test Coverage

`ust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_database_initializes_in_memory() {
        let db = Database::in_memory().expect("failed to create in-memory db");
        let conn = db.conn.lock().unwrap();
        let table_count: i32 = conn
            .query_row("SELECT COUNT(*) FROM sqlite_master WHERE type='table'",
                [], |row| row.get(0)).unwrap();
        assert!(table_count >= 7, "should have at least 7 tables");
    }

    #[test]
    fn test_database_foreign_keys_enforced() {
        let db = Database::in_memory().unwrap();
        let result = db.conn.lock().unwrap().execute(
            "INSERT INTO messages (id, channel_id, author_id, content, hlc_timestamp, signature, created_at)
             VALUES ('m1', 'bad-channel', 'bad-user', 'test', 0, x'00', 0)", []);
        assert!(result.is_err(), "foreign key violation should error");
    }

    #[test]
    fn test_servers_table_insert_and_query() {
        let db = Database::in_memory().unwrap();
        let conn = db.conn.lock().unwrap();
        conn.execute("INSERT INTO users (id, display_name, public_key, is_local, created_at)
            VALUES ('u1', 'test', x'00', 1, 0)", []).unwrap();
        conn.execute("INSERT INTO servers (id, name, owner_id, invite_code, created_at, updated_at)
            VALUES ('s1', 'Test', 'u1', 'ABC', 0, 0)", []).unwrap();
        let name: String = conn.query_row(
            "SELECT name FROM servers WHERE id = 's1'", [], |row| row.get(0)).unwrap();
        assert_eq!(name, "Test");
    }
}
`

## Frontend Integration

`	ypescript
// apps/desktop/src/lib/api.ts
import { invoke } from '@tauri-apps/api/core';

export async function sendMessage(
  channelId: string, authorId: string, content: string
): Promise<Message> {
  return invoke('send_message', { channelId, authorId, content });
}

export async function getMessages(
  channelId: string, limit?: number, before?: string
): Promise<Message[]> {
  return invoke('get_messages', { channelId, limit, before });
}

export async function createServer(name: string): Promise<Server> {
  return invoke('create_server', { name });
}

export async function getServers(): Promise<Server[]> {
  return invoke('get_servers');
}
`

`	ypescript
// apps/desktop/src/stores/serverStore.ts
import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

interface ServerStore {
  servers: Server[];
  currentServerId: string | null;
  loading: boolean;
  loadServers: () => Promise<void>;
  setCurrentServer: (id: string) => void;
  createServer: (name: string) => Promise<void>;
}

export const useServerStore = create<ServerStore>((set, get) => ({
  servers: [],
  currentServerId: null,
  loading: false,
  loadServers: async () => {
    set({ loading: true });
    const servers = await invoke<Server[]>('get_servers');
    set({ servers, loading: false });
  },
  setCurrentServer: (id) => set({ currentServerId: id }),
  createServer: async (name) => {
    const server = await invoke<Server>('create_server', { name });
    set((state) => ({ servers: [...state.servers, server] }));
  },
}));
`

## Libern Architecture: Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Desktop framework | Tauri v2 | Rust backend, small binary, security |
| Database | SQLite (rusqlite) | Local-first, zero infrastructure |
| State sync | CRDT (HLC + LWW) | Offline-first, no central server |
| Cryptography | Ed25519 + SHA3-256 | Fast, secure, auditable |
| AI inference | Local (llama.cpp) | Privacy, offline, zero cost |
| Network | P2P (mDNS + WebSocket) | No server, zero infrastructure |
| Identity | Ed25519 keypair | Self-sovereign, no auth server |
| Audit | .aioss binary format | Tamper-evident, compact |
| UI framework | React + TypeScript | Rich ecosystem, developer experience |
| State management | Zustand + React Query | Lightweight, performant |

## Libern Project Structure

`
libern/
├── Cargo.toml                          # Workspace root
├── build.bat                           # Build orchestration
├── LIBERN_BUILD_PLAN.md                # Build plan documentation
├── AI_FEATURES_PLAN.md                 # AI subsystem plan
├── COMPETITIVE_EDGE.md                 # Competitive analysis
├── crates/
│   ├── libern-core/                    # Core library
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── crdt/mod.rs             # CRDT engine
│   │       ├── crypto/mod.rs           # Cryptographic primitives
│   │       ├── db/
│   │       │   ├── mod.rs              # Database initialization
│   │       │   ├── schema.rs           # Schema definition
│   │       │   └── models.rs           # Data models
│   │       └── ai/
│   │           ├── mod.rs              # AiEngine trait
│   │           ├── engine.rs           # MockEngine
│   │           ├── qwen_engine.rs      # CandleEngine
│   │           ├── pipeline.rs         # Prompt construction
│   │           ├── summarizer.rs       # Channel summarization
│   │           ├── moderator.rs        # Content moderation
│   │           ├── rag.rs              # Document RAG
│   │           ├── conversation.rs     # Context management
│   │           ├── liber_user.rs       # Liber identity
│   │           └── reward.rs           # RLHF feedback
│   └── libern-aioss/                   # .aioss format
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs
│           ├── header.rs               # 128-byte header
│           ├── entry.rs                # 256-byte entry
│           ├── ledger.rs               # Ledger types
│           ├── writer.rs               # Binary/JSON writer
│           ├── reader.rs               # Binary/JSON reader
│           ├── verify.rs               # Chain verification
│           ├── health.rs               # Health diagnostics
│           ├── event_store.rs          # Event persistence
│           ├── state_proof.rs          # Ed25519 proofs
│           ├── schedule.rs             # Session sealing
│           └── txt_log.rs              # TXT export
├── apps/
│   ├── desktop/                        # Tauri desktop app
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── lib/api.ts
│   │   │   ├── lib/ai.ts
│   │   │   ├── lib/utils.ts
│   │   │   ├── stores/serverStore.ts
│   │   │   ├── stores/messageStore.ts
│   │   │   ├── stores/uiStore.ts
│   │   │   └── types/index.ts
│   │   └── src-tauri/
│   │       ├── Cargo.toml
│   │       ├── tauri.conf.json
│   │       ├── build.rs
│   │       └── src/
│   │           ├── main.rs
│   │           ├── lib.rs
│   │           └── commands/
│   │               ├── mod.rs
│   │               ├── server.rs
│   │               ├── channel.rs
│   │               ├── message.rs
│   │               ├── user.rs
│   │               ├── role.rs
│   │               ├── ai.rs
│   │               ├── xp.rs
│   │               ├── stats.rs
│   │               └── stars.rs
│   └── sandbox/                        # 3D Boxel engine
│       ├── Cargo.toml
│       └── src/
│           ├── main.rs
│           ├── liber.rs
│           ├── world.rs
│           ├── player.rs
│           ├── character.rs
│           ├── camera.rs
│           ├── cube.rs
│           ├── texture.rs
│           ├── audio.rs
│           ├── voice.rs
│           ├── chat.rs
│           ├── pipeline.rs
│           └── screen_share.rs
├── docs/
│   ├── README.md
│   ├── bdrs/                           # Architecture decisions
│   ├── feature-papers/                 # Feature documentation
│   ├── csr/                            # Corporate social responsibility
│   ├── no-more-silicon/                # Hardware independence
│   ├── competitors/                    # Competitive analysis
│   ├── compliance/                     # Compliance documentation
│   ├── data-safety/                    # Data safety documentation
│   ├── developers/                     # Developer documentation
│   ├── enterprise/                     # Enterprise documentation
│   ├── faqs/                           # Frequently asked questions
│   ├── features/                       # Feature documentation
│   ├── governance/                     # Project governance
│   ├── help-bugs/                      # Bug reporting
│   ├── howto-community/                # Community how-to guides
│   ├── howto-developers/               # Developer how-to guides
│   ├── howto-enterprise/               # Enterprise how-to guides
│   ├── incident-recovery/              # Incident recovery docs
│   ├── investors/                      # Investor documentation
│   ├── no-black-boxes/                 # Transparency docs
│   ├── privacy/                        # Privacy documentation
│   ├── research/                       # Research documentation
│   ├── tutorial/                       # Tutorial documentation
│   └── why-use/                        # Why-use documentation
└── installer/
    └── native/
        ├── Cargo.toml
        ├── build.rs
        └── src/
            ├── main.rs
            ├── lib.rs
            ├── app.rs
            ├── state.rs
            ├── theme.rs
            ├── widgets.rs
            ├── system.rs
            ├── downloader.rs
            └── screens/
                ├── mod.rs
                ├── splash.rs
                ├── check.rs
                ├── download.rs
                ├── install.rs
                ├── elevation.rs
                ├── complete.rs
                └── error.rs
`

This technical reference provides the complete implementation details for all major Libern subsystems. Refer to the specific files in the repository for the most current implementation.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com