▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

Document Version: 1.0.0
Category: Tutorial
Document ID: TUT-004
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Using AI in Libern

## Introduction

Liber (the Libern AI assistant) is a fully offline, local AI that runs entirely on your machine. It can answer questions, summarize channels, analyze whiteboards, play games, and more. This tutorial covers every AI feature available.

### AI Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                   Liber AI System                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │  MockEngine  │  │CandleEngine │  │  Pipeline (ctx)  │  │
│  │ (canned rsp) │  │(Qwen GGUF)  │  │  pack_context()  │  │
│  └─────────────┘  └──────┬──────┘  │  build_prompt()   │  │
│                          │          └──────────────────┘  │
│                          ▼                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Supporting Modules                     │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌───────────┐   │  │
│  │  │ RAG    │ │Moderator│ │Summariz│ │  Reward   │   │  │
│  │  │(docs)  │ │(safety) │ │(chats) │ │  (RLHF)   │   │  │
│  │  └────────┘ └────────┘ └────────┘ └───────────┘   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           Inference Pipeline                         │  │
│  │  User Input → Context Pack → LLM → Token Stream → UI│  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## Step 1: How Liber AI Works

Liber uses a pluggable AI engine architecture defined in `crates/libern-core/src/ai/`:

```
ai/
├── engine.rs       — AiEngine trait + MockEngine (canned responses)
├── qwen_engine.rs  — CandleEngine (runs llama.cpp + Qwen GGUF)
├── pipeline.rs     — Prompt building and context packing
├── conversation.rs — Conversation history management
├── rag.rs          — RAG document ingestion and querying
├── moderator.rs    — Content moderation (keyword + AI)
├── summarizer.rs   — Channel summarization
├── reward.rs       — RLHF feedback and preference learning
├── liber_user.rs   — Liber system user and welcome messages
└── mod.rs          — TokenEvent, InferenceRequest, AiEngine trait
```

### AI Engines

| Engine | File | Description |
|--------|------|-------------|
| `MockEngine` | `engine.rs` | Returns canned responses. No model file needed. Used by default. |
| `CandleEngine` | `qwen_engine.rs` | Runs Qwen 2.5 1.5B instruct via llama.cpp CLI. Requires model download. |

The `AiEngine` trait defines:
```rust
pub trait AiEngine: Send + 'static {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String>;
    fn embed(&mut self, text: &str) -> Result<Vec<f32>, String>;
    fn is_loaded(&self) -> bool;
    fn model_info(&self) -> ModelInfo;
}
```

### InferenceRequest Structure

```rust
pub struct InferenceRequest {
    pub prompt: String,
    pub max_tokens: u32,      // Default: 512
    pub temperature: f32,     // Default: 0.7
    pub callback: Box<dyn Fn(TokenEvent) + Send>,
}

pub enum TokenEvent {
    Token(String),
    Done { full_response: String },
    Error(String),
}
```

---

## Step 2: Download the AI Model

For full AI functionality, download the Qwen 2.5 1.5B GGUF model.

### Automatic Download

When you first use an AI feature, if the model isn't found, the `ModelDownloadModal` component appears:

1. The modal shows download progress (~1.1 GB total).
2. Progress updates show percentage, speed (KB/s), and bytes downloaded.
3. After download, the file is verified (minimum size check > 1GB).
4. The model is saved to `{app_data_dir}/models/Qwen2-VL-2B-Instruct-Q4_K_M.gguf`.

The `download_model` command (`apps/desktop/src-tauri/src/commands/installer.rs:17`) downloads from Hugging Face:
```
https://huggingface.co/Qwen/Qwen2-VL-2B-Instruct-GGUF/resolve/main/Qwen2-VL-2B-Instruct-Q4_K_M.gguf
```

```rust
#[tauri::command]
pub fn download_model(
    app: AppHandle,
    on_event: tauri::ipc::Channel<DownloadProgress>,
) -> Result<(), String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let models_dir = app_dir.join("models");
    std::fs::create_dir_all(&models_dir).map_err(|e| e.to_string())?;

    let url = "https://huggingface.co/Qwen/Qwen2-VL-2B-Instruct-GGUF/\
               resolve/main/Qwen2-VL-2B-Instruct-Q4_K_M.gguf";
    let dest = models_dir.join("Qwen2-VL-2B-Instruct-Q4_K_M.gguf");
    let temp_dest = models_dir.join("download.tmp");

    // Download with progress tracking
    let client = reqwest::blocking::Client::new();
    let response = client.get(url).send().map_err(|e| e.to_string())?;
    let total = response.content_length().unwrap_or(0);
    let mut downloaded: u64 = 0;
    let mut file = std::fs::File::create(&temp_dest).map_err(|e| e.to_string())?;

    for chunk in response.bytes().flatten() {
        file.write_all(&chunk).map_err(|e| e.to_string())?;
        downloaded += chunk.len() as u64;
        let _ = on_event.send(DownloadProgress {
            downloaded,
            total,
            speed: 0, // calculated in frontend
        });
    }

    // Verify minimum size
    if downloaded < 1_000_000_000 {
        std::fs::remove_file(&temp_dest).ok();
        return Err("Downloaded file is too small".to_string());
    }

    std::fs::rename(&temp_dest, &dest).map_err(|e| e.to_string())?;
    Ok(())
}
```

### Manual Download

1. Download from: https://huggingface.co/Qwen/Qwen2-VL-2B-Instruct-GGUF
2. Place the `.gguf` file in `{app_data_dir}/models/`.
3. Also download `llama-cli` (or `llama-cli.exe`) from https://github.com/ggml-org/llama.cpp/releases
4. Place the binary in `{app_data_dir}/bin/` or the app's `binaries/` directory.

### Skip the Model

You can skip the model download — Liber will use `MockEngine` which provides basic canned responses.

```
┌──────────────────────────────────────┐
│  Model Download Decision Tree        │
│                                      │
│  Model exists?                       │
│  ├── Yes ──► Use CandleEngine        │
│  └── No                              │
│      ├── Download?                   │
│      │   ├── Yes ──► Download + Use  │
│      │   └── No ──► Use MockEngine   │
│      └── Download failed?            │
│          └── Yes ──► Use MockEngine  │
└──────────────────────────────────────┘
```

---

## Step 3: Ask Liber Questions

### Using /ask

Type `/ask` followed by your question in any text channel:

```
/ask What is CRDT merge?
```

The `ask_libern` Tauri command:
1. Retrieves recent conversation history (last 20 messages) from `ai_conversations` table.
2. Packs the context into a prompt window (max 2048 tokens).
3. Builds a chat prompt using the `build_chat_prompt` pipeline.
4. Streams tokens back via Tauri IPC Channel.
5. The `LiberMessageBubbleInner` component displays the streaming response.
6. After completion, shows `RatingButtons` for feedback.

### Using @Liber

You can also mention Liber directly:

```
@Liber What is the .aioss format?
```

Both `/ask` and `@Liber` trigger the same `ask_libern` command.

### Streaming Response

The response is streamed token-by-token. The `LiberMessageBubbleInner` component shows:
- An animated typing indicator (bouncing dots) during streaming.
- A blinking cursor (`▊`) at the end of the text.
- The full response when complete.
- Rating buttons (thumbs up/down) for RLHF feedback.

```typescript
// From apps/desktop/src/lib/ai.ts
export async function askLibern(
  channelId: string,
  query: string,
  onToken: (token: string) => void,
  onDone: (full: string) => void,
): Promise<void> {
  const channel = new Channel<AiToken>();
  channel.onmessage = (msg) => {
    if (msg.done) {
      onDone(msg.full_response || "");
    } else {
      onToken(msg.token);
    }
  };
  await invoke("ask_libern", { channelId, query, onEvent: channel });
}
```

### Ask Command Implementation

```rust
#[tauri::command]
pub fn ask_libern(
    ai: State<AiState>,
    db: State<Database>,
    channel_id: String,
    query: String,
    on_event: tauri::ipc::Channel<TokenEvent>,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    // Get conversation history
    let history: Vec<(String, String)> = {
        let mut stmt = conn.prepare(
            "SELECT role, content FROM ai_conversations
             WHERE channel_id = ?1 ORDER BY created_at DESC LIMIT 20"
        ).map_err(|e| e.to_string())?;
        // ... collect results
        vec![]
    };

    // Build prompt
    let prompt = build_chat_prompt(&history, &query);

    // Run inference
    let callback = Box::new(move |event: TokenEvent| {
        let _ = on_event.send(event);
    });

    let request = InferenceRequest {
        prompt,
        max_tokens: 512,
        temperature: 0.7,
        callback,
    };

    let mut engine = ai.engine.lock().map_err(|e| e.to_string())?;
    engine.infer(request)
}
```

---

## Step 4: Slash Commands

Libern supports a rich set of slash commands. Commands are categorized into three types:
- **Rust**: Instant execution (no AI needed)
- **Liber**: AI-powered (executed via `ask_libern`)

### Fun Commands

| Command | Type | Usage | Description |
|---------|------|-------|-------------|
| `/8ball` | Liber | `/8ball <question>` | Ask the Magic 8 Ball |
| `/roll` | Rust | `/roll 2d6` | Roll dice (NdM format) |
| `/flip` | Rust | `/flip` | Flip a coin |
| `/rps` | Liber | `/rps rock` | Play Rock Paper Scissors |
| `/trivia` | Liber | `/trivia science` | Get a trivia question |
| `/joke` | Liber | `/joke` | Liber tells a joke |
| `/wyr` | Liber | `/wyr fly or invisibility` | Would You Rather |
| `/rate` | Liber | `/rate my joke` | Liber rates something |
| `/brainrot` | Liber | `/brainrot` | Assess your brainrot level |
| `/wys` | Liber | `/wys zombie apocalypse` | Would You Survive scenario |
| `/quiz` | Liber | `/quiz history hard` | Start a quiz |

### Casino Commands

| Command | Type | Usage | Description |
|---------|------|-------|-------------|
| `/slots` | Rust | `/slots 50` | Play slot machine (bet in XP) |
| `/blackjack` | Rust | `/blackjack 50` | Play blackjack |

### Utility Commands

| Command | Type | Usage | Description |
|---------|------|-------|-------------|
| `/choose` | Liber | `/choose pizza or sushi` | Pick between options |
| `/assess` | Liber | `/assess 50` | Assess last N messages |
| `/predict` | Liber | `/predict ...` | Create prediction market |
| `/summary` | Liber | `/summary` | Summarize channel |
| `/leaderboard` | Rust | `/leaderboard` | Show XP leaderboard |
| `/starboard` | Rust | `/starboard` | Show top starred messages |

### How Slash Commands Work

The `SlashCommands` component (`apps/desktop/src/components/chat/SlashCommands.tsx`) provides:

1. **Detection**: Regex `/\/(\w*)$/` detects partial slash commands as you type.
2. **Auto-complete popup**: Shows filtered commands with descriptions, usage, and badges (`instant` for Rust, `ai` for Liber).
3. **Navigation**: Arrow keys to navigate, Enter/Tab to select.

### Slash Command UI

```
┌─────────────────────────────────────────┐
│  /sum▊                                   │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │ /summary     ai  Summarize channel  ││
│  │ /starboard  inst Top starred msgs  ││
│  │ /slots      inst Play slot machine ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Rust Commands (Instant)

Rust commands execute instantly via Tauri commands and post the result as a message:

```rust
// From apps/desktop/src-tauri/src/commands/games.rs
#[tauri::command]
pub fn roll_dice(dice: String) -> Result<String, String> {
    // Parse "2d6" format, generate random rolls, return formatted result
    let parts: Vec<&str> = dice.split('d').collect();
    let count: u32 = parts[0].parse().unwrap_or(1);
    let sides: u32 = parts.get(1).and_then(|s| s.parse().ok()).unwrap_or(6);

    let mut rng = rand::thread_rng();
    let rolls: Vec<u32> = (0..count).map(|_| rng.gen_range(1..=sides)).collect();
    let total: u32 = rolls.iter().sum();
    let rolls_str = rolls.iter().map(|r| r.to_string()).collect::<Vec<_>>().join(", ");

    Ok(format!("🎲 **{}d{}**: {} = **{}**", count, sides, rolls_str, total))
}

#[tauri::command]
pub fn flip_coin() -> Result<String, String> {
    let result = if rand::thread_rng().gen_bool(0.5) { "Heads" } else { "Tails" };
    Ok(format!("🪙 **Coin Flip**: {}", result))
}
```

### Liber Commands (AI-Powered)

Liber commands use specific system prompts:

```rust
// From apps/desktop/src-tauri/src/commands/ai.rs
fn get_system_prompt(query: &str) -> &'static str {
    if query.starts_with("/8ball") {
        return "You are a Magic 8 Ball. Respond with ONE of these exactly: \
                'Yes', 'No', 'Maybe', 'Ask again later', 'Certainly', \
                'Outlook good', 'Don't bet on it', 'Cannot predict now'.";
    }
    if query.starts_with("/trivia") {
        return "Generate a random trivia question with 4 options (A, B, C, D). \
                Indicate the correct answer. Use format: \
                Question: ...\nA) ...\nB) ...\nC) ...\nD) ...\nAnswer: ...";
    }
    if query.starts_with("/joke") {
        return "Tell a short, clean joke. Use setup + punchline format.";
    }
    if query.starts_with("/rps") {
        return "Play Rock Paper Scissors. Randomly choose rock, paper, or scissors. \
                Announce both choices and the winner.";
    }
    if query.starts_with("/wyr") {
        return "Respond to a 'Would You Rather' question. Give a thoughtful \
                analysis of both options, then pick one.";
    }
    if query.starts_with("/rate") {
        return "Rate the thing the user asks about out of 10. \
                Give a brief, humorous reason for the rating.";
    }
    if query.starts_with("/brainrot") {
        return "Analyze the user's recent messages for 'brainrot' content. \
                Rate 1-10 and give a funny assessment.";
    }
    if query.starts_with("/wys") {
        return "Create a 'Would You Survive' survival scenario. \
                Describe the situation, give 3 choices, reveal the outcome.";
    }
    if query.starts_with("/assess") {
        return "Analyze the last N messages for tone, sentiment, and topics. \
                Give a brief summary of the conversation quality.";
    }
    if query.starts_with("/choose") {
        return "Pick one of the user's options randomly. Announce your choice \
                and give a brief, funny reason.";
    }
    if query.starts_with("/predict") {
        return "Help the user create a prediction market. \
                Ask for: question, options (usually 2), closing time.";
    }
    if query.starts_with("/quiz") {
        return "Generate a quiz question on the requested topic and difficulty. \
                Format: Question, 4 options, correct answer, brief explanation.";
    }
    if query.starts_with("/summary") {
        return "Summarize the recent channel conversation. \
                Identify key topics, decisions, and action items.";
    }
    SYSTEM_PROMPT
}
```

---

## Step 5: Channel Summarization

Summarize recent channel activity:

```
/summary
```

Or via the API:
```typescript
import { summarizeChannel } from "./lib/ai";
await summarizeChannel(channelId, onToken, onDone, 50);
```

The `summarize_channel` command fetches the last N messages, builds a summarization prompt, and streams the summary:

```rust
// From crates/libern-core/src/ai/summarizer.rs
pub fn summarize_channel(
    engine: &mut Box<dyn AiEngine + Send>,
    db: &Database,
    channel_id: &str,
    message_count: u32,
    callback: Box<dyn Fn(TokenEvent) + Send>,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    // Fetch recent messages
    let mut stmt = conn.prepare(
        "SELECT u.display_name, m.content FROM messages m
         JOIN users u ON m.author_id = u.id
         WHERE m.channel_id = ?1 AND m.deleted_at IS NULL
         ORDER BY m.created_at DESC LIMIT ?2"
    ).map_err(|e| e.to_string())?;

    let mut messages = Vec::new();
    // ... collect messages ...

    // Build summary prompt
    let prompt = format!(
        "Summarize the following channel conversation. Identify key topics, \
         decisions made, and any action items.\n\n{}",
        messages.join("\n")
    );

    let request = InferenceRequest {
        prompt,
        max_tokens: 256,
        temperature: 0.5,
        callback,
    };

    engine.infer(request)
}
```

---

## Step 6: RAG (Retrieval-Augmented Generation)

Liber supports RAG for querying documents uploaded to a channel.

### Document Ingestion Flow

```
Document Upload
    │
    ▼
Split into chunks (128 words each)
    │
    ▼
Embed each chunk (AiEngine::embed)
    │
    ▼
Store in document_chunks table
    │
Query arrives
    │
    ▼
Embed query
    │
    ▼
Cosine similarity search
    │
    ▼
Top 5 most relevant chunks
    │
    ▼
Build augmented prompt
    │
    ▼
Run inference
```

### Upload a Document

```typescript
import { uploadDocument } from "./lib/ai";
const result = await uploadDocument(
    channelId,
    serverId,
    userId,
    "document.txt",
    fileContent  // string content
);
```

### Query Uploaded Documents

```
/ask Based on the uploaded documents, what is the main topic?
```

The `query_documents` command:
1. Embeds the query using `AiEngine::embed()`.
2. Finds the top 5 most similar document chunks using cosine similarity.
3. Builds a prompt with the relevant context.
4. Runs inference with the augmented prompt.

```rust
// RAG cosine similarity implementation
fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
    let dot: f32 = a.iter().zip(b.iter()).map(|(x, y)| x * y).sum();
    let mag_a: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
    let mag_b: f32 = b.iter().map(|x| x * x).sum::<f32>().sqrt();
    dot / (mag_a * mag_b)
}
```

### Document Chunking

Documents are split into chunks (default 128 words per chunk). Each chunk is embedded and stored in the `document_chunks` table.

```sql
CREATE TABLE IF NOT EXISTS document_chunks (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    document_name TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding BLOB,            -- f32 vector stored as bytes
    created_at INTEGER NOT NULL
);
```

---

## Step 7: Content Moderation

Liber can moderate messages for content safety:

```typescript
import { moderateMessage } from "./lib/ai";
const result = await moderateMessage("message content");
// { classification: "Safe" | "Flag" | "Block", reason: "...", confidence: 0.95 }
```

The moderation pipeline in `moderator.rs`:
1. **Keyword filter**: Checks against blocked/flagged pattern lists.
2. **AI classification**: If no keyword match, asks the AI to classify.

```rust
// Two-stage moderation
pub fn moderate_message(engine: &mut Box<dyn AiEngine + Send>, content: &str) -> ModerationResult {
    // Stage 1: Keyword filter
    if let Some(category) = keyword_filter(content) {
        return ModerationResult {
            classification: category,
            reason: "Keyword match".to_string(),
            confidence: 1.0,
        };
    }

    // Stage 2: AI classification
    let prompt = format!(
        "Classify the following message as SAFE, FLAG, or BLOCK.\nMessage: {}\nRespond with only one word.",
        content
    );
    // ... run inference and parse result
}
```

---

## Step 8: RLHF Feedback System

After each AI response, you can rate it with thumbs up/down:

```typescript
import { rateResponse } from "./lib/ai";
await rateResponse(channelId, userId, responseId, 1, "concise");
```

The `reward.rs` module maintains preference profiles:
- Tracks preferred response styles (categories like "concise", "detailed", "funny")
- Adjusts temperature bias based on average scores
- Generates personalized style prompts

```rust
// RLHF preference tracking
pub struct PreferenceProfile {
    pub total_feedback: u32,
    pub avg_score: f32,
    pub top_categories: Vec<String>,
    pub temperature_bias: f32,
    pub style_prompt: String,
}

impl PreferenceProfile {
    pub fn update(&mut self, score: i32, category: &str) {
        self.total_feedback += 1;
        // Running average: new_avg = old_avg + (score - old_avg) / count
        self.avg_score += (score as f32 - self.avg_score) / self.total_feedback as f32;
        // Adjust temperature: more positive = more creative
        self.temperature_bias = (self.avg_score * 0.1).clamp(-0.3, 0.3);
    }
}
```

```typescript
import { getUserPreferences } from "./lib/ai";
const prefs = await getUserPreferences(userId);
// { total_feedback, avg_score, top_categories, temperature_bias, style_prompt }
```

---

## Step 9: AI Status

Check the current AI engine status:

```typescript
import { getAiStatus } from "./lib/ai";
const status = await getAiStatus();
// { loaded: true, model: "Qwen 2.5 1.5B Instruct", quant: "Q4_K_M", context_size: 4096 }
```

```rust
#[tauri::command]
pub fn get_ai_status(ai: State<AiState>) -> Result<serde_json::Value, String> {
    let engine = ai.engine.lock().map_err(|e| e.to_string())?;
    let info = engine.model_info();
    Ok(serde_json::json!({
        "loaded": engine.is_loaded(),
        "model": format!("{} (via {})", info.name, info.backend),
        "quant": info.quantization,
        "context_size": info.context_size,
    }))
}
```

---

## Step 10: Conversation History

View and manage AI conversation history:

```typescript
import { getConversationHistory, clearConversationHistory } from "./lib/ai";

// Get history (last 50 messages)
const history = await getConversationHistory(channelId, 50);

// Clear history
await clearConversationHistory(channelId);
```

History is stored in the `ai_conversations` table:
```sql
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

CREATE INDEX IF NOT EXISTS idx_ai_conv_channel
    ON ai_conversations(channel_id, created_at DESC);
```

---

## System Prompt

Liber's default system prompt:
```
You are Liber, the built-in AI assistant for the Libern platform.
You operate fully offline. Be helpful, precise, and emotionally intelligent.

You can:
- Answer questions about Libern features
- Summarize conversations
- Analyze whiteboard diagrams
- Play games (trivia, 8-ball, RPS, etc.)
- Generate creative content
- Help with document analysis

Guidelines:
- Be concise but thorough
- Use markdown formatting when helpful
- Admit when you don't know something
- Never fabricate information
- Stay on topic
```

---

## Step 11: Use Cases

### Knowledge Base Assistant

```
Team uses Liber as an always-available knowledge base:
- /ask "What is the deployment process?"
- Upload documentation → RAG queries
- /summary for daily standup recap
- Rate responses to improve over time
```

### Educational Tool

```
Classroom uses Liber for learning:
- /quiz science medium — Generate practice quizzes
- /trivia history — Fun learning games
- /ask "Explain quantum computing" — Get explanations
- @Liber "Summarize today's lecture notes"
```

---

## Next Steps

- **Tutorial 05**: Voice and Whiteboard — Voice chat, whiteboard canvas tools
- **Tutorial 07**: Marketplace and Games — Browse marketplace, casino games, XP leaderboard

### Related References

- **FAQ-003**: AI FAQ — Detailed AI questions and answers
- **FAQ-005**: Offline FAQ — AI operation without internet
- **HLP-003**: AI Not Responding — Troubleshooting AI issues
- **DEV-002**: AI Engine Architecture — Deep dive into AI implementation

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
