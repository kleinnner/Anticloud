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
Category: Community User Guide
Document ID: CMT-004
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Using AI Commands

## Introduction

Liber (the Libern AI assistant) is a fully offline, local AI that runs entirely on your machine. It can answer questions, summarize channels, analyze whiteboards, play games, and more. Liber is accessible through slash commands and direct mentions, and is present in every server and channel automatically.

Liber uses a pluggable AI engine architecture. By default, it runs with `MockEngine` which provides fun canned responses without requiring any model download. For full intelligence, you can download the Qwen 2.5 1.5B Instruct GGUF model (~1.1 GB) and Liber will use the `CandleEngine` for rich, context-aware responses.

This guide covers every AI-powered command available in Libern, including `/ask`, `@Liber`, `/8ball`, `/joke`, `/trivia`, `/rps`, `/wouldyourather`, and all other slash commands.

By the end of this guide, you will be able to:
- Ask Liber questions using `/ask` and `@Liber`
- Play games like 8 Ball, Rock Paper Scissors, Trivia, and Would You Rather
- Use all fun, utility, and casino slash commands
- Understand how to configure and manage Liber
- Rate Liber responses and affect future behavior via RLHF

---

## Prerequisites

- Libern is installed and you have completed identity setup
- You have a server with at least one text channel

---

## Part 1: How Liber AI Works

### AI Engine Architecture

Liber uses a pluggable AI engine architecture defined in `crates/libern-core/src/ai/`:

```
ai/
├── mod.rs          — TokenEvent, InferenceRequest, AiEngine trait
├── engine.rs       — AiEngine trait + MockEngine (canned responses)
├── qwen_engine.rs  — CandleEngine (runs llama.cpp + Qwen GGUF)
├── pipeline.rs     — Prompt building and context packing
├── conversation.rs — Conversation history management
├── rag.rs          — RAG document ingestion and querying
├── moderator.rs    — Content moderation (keyword + AI)
├── summarizer.rs   — Channel summarization
├── reward.rs       — RLHF feedback and preference learning
└── liber_user.rs   — Liber system user and welcome messages
```

### AI Engines

| Engine | Description | Model Required |
|--------|-------------|----------------|
| `MockEngine` | Returns canned responses. Used by default. | No |
| `CandleEngine` | Runs Qwen 2.5 1.5B Instruct via llama.cpp CLI. Full AI capabilities. | Yes (~1.1 GB download) |

### AiEngine Trait

The engine interface is defined in `crates/libern-core/src/ai/mod.rs`:

```rust
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

#[derive(Clone, Serialize, Deserialize)]
pub struct TokenEvent {
    pub token: String,
    pub done: bool,
    pub full_response: Option<String>,
}
```

### System Prompt

Liber's default system prompt:
```
You are Liber, the built-in AI assistant for the Libern platform.
You operate fully offline. Be helpful, precise, and emotionally intelligent.
```

### Model Download

For full AI functionality, you can download the Qwen 2.5 1.5B GGUF model:
1. When you first use an AI feature, if the model isn't found, the `ModelDownloadModal` appears.
2. The modal shows download progress (~1.1 GB total).
3. After download, the file is verified (minimum size check > 1 GB).
4. The model is saved to `{app_data_dir}/models/Qwen2-VL-2B-Instruct-Q4_K_M.gguf`.

Alternatively, download manually from Hugging Face:
```
https://huggingface.co/Qwen/Qwen2-VL-2B-Instruct-GGUF
```

### MockEngine Implementation

```rust
// crates/libern-core/src/ai/engine.rs
impl AiEngine for MockEngine {
    fn infer(&mut self, request: InferenceRequest) -> Result<(), String> {
        let canned = format!(
            "I'm Liber, your local AI assistant. I see you asked: \"{}\"\n\n\
             Here's a mock response for development. In production, \
             I'll run on Qwen 2.5 1.5B Q4_K_M GGUF.",
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
}
```

### How Liber Processes Commands

The `ask_libern` command in `apps/desktop/src-tauri/src/commands/ai.rs` handles all AI requests:

1. Liber retrieves recent conversation history (last 20 messages) from the `ai_conversations` table.
2. Context is packed into a prompt window (max 2048 tokens).
3. If the query starts with `/`, the command-specific system prompt is used.
4. A chat prompt is built using the `build_chat_prompt` pipeline.
5. Tokens stream back via Tauri IPC Channel.
6. The `LiberMessageBubble` component displays the streaming response.
7. After completion, rating buttons appear for feedback (thumbs up/down).

```rust
#[tauri::command]
pub fn ask_libern(
    ai: State<AiState>,
    db: State<Database>,
    channel_id: String,
    query: String,
    on_event: tauri::ipc::Channel<TokenEvent>,
) -> Result<(), String> {
    let mut engine = ai.engine.lock().map_err(|e| e.to_string())?;

    let history = libern_core::ai::conversation::get_recent(&db, &channel_id, 20)?;
    let context: Vec<(String, String)> = history
        .iter()
        .map(|(role, content, _)| (role.clone(), content.clone()))
        .collect();

    let packed = libern_core::ai::pipeline::pack_context(&context, 2048, 4);
    let is_slash = query.starts_with('/');
    let prompt = if is_slash {
        build_liber_prompt(&query)
    } else {
        libern_core::ai::pipeline::build_chat_prompt(SYSTEM_PROMPT, &packed, &query)
    };

    let callback = Box::new(move |event: TokenEvent| {
        on_event.send(event).ok();
    });

    let engine_ref: &mut Box<dyn AiEngine + Send> = &mut *engine;
    engine_ref.infer(InferenceRequest {
        prompt,
        max_tokens: 1024,
        temperature: 0.7,
        callback,
    })
}
```

---

## Part 2: /ask — Ask Liber Anything

### Usage

```
/ask <your question>
```

The `/ask` command sends your question to Liber for an AI-powered response.

### Examples

```
/ask What is CRDT merge?
/ask How does the .aioss format work?
/ask Can you explain hybrid logical clocks?
/ask What's the difference between Ed25519 and RSA?
/ask Summarize today's conversation
/ask What are the action items from this discussion?
```

### Streaming Response

The response is streamed token-by-token:
- An animated typing indicator (bouncing dots) during streaming.
- A blinking cursor (`▊`) at the end of the text.
- The full response appears when complete.
- Rating buttons (thumbs up/down) for RLHF feedback.

### @Liber Mention

You can also mention Liber directly in any message:

```
@Liber What is the .aioss format?
```

Both `/ask` and `@Liber` trigger the same `ask_libern` command.

---

## Part 3: /8ball — Magic 8 Ball

### Usage

```
/8ball <question>
```

The Magic 8 Ball command provides random answers to yes/no questions.

### Examples

```
/8ball Will it rain tomorrow?
/8ball Is this a good idea?
/8ball Should I take the job?
```

### How It Works

Liber acts as a Magic 8 Ball with a command-specific system prompt:

```rust
fn get_system_prompt(query: &str) -> &'static str {
    if query.starts_with("/8ball") {
        return "You are a Magic 8 Ball. Respond with ONE of these exactly: 'It is certain', \
                'It is decidedly so', 'Without a doubt', 'Yes definitely', \
                'You may rely on it', 'As I see it, yes', 'Most likely', \
                'Outlook good', 'Yes', 'Signs point to yes', 'Reply hazy try again', \
                'Ask again later', 'Better not tell you now', 'Cannot predict now', \
                'Concentrate and ask again', 'Don't count on it', 'My reply is no', \
                'My sources say no', 'Outlook not so good', 'Very doubtful'. \
                Start your response with '🎱 ' and the prediction in bold. Then add a short funny follow-up.";
    }
    // ...
}
```

---

## Part 4: /joke — Tell Me a Joke

### Usage

```
/joke
/joke programming
/joke puns
```

Liber tells a short, clean joke. You can optionally specify a category: `programming`, `puns`, `dad`, `science`, or general (default).

### How It Works

The AI is prompted with a category-specific system prompt:
```
Tell a short, clean joke. Format: 😂 **[setup]**

[punchnline]
```

---

## Part 5: /trivia — Get a Trivia Question

### Usage

```
/trivia [category]
```

Liber generates a random trivia question with multiple choice answers.

### Examples

```
/trivia
/trivia science
/trivia history
/trivia geography
/trivia technology
```

### Available Categories

- `general` — Random general knowledge
- `science` — Scientific facts and discoveries
- `history` — Historical events and figures
- `geography` — World geography
- `technology` — Tech and computing trivia

### How It Works

The AI is prompted to generate trivia with a specific format:

```rust
if query.starts_with("/trivia") {
    return "Generate a random trivia question with 4 options (A, B, C, D). \
            Format exactly:\n\n📝 **[category]**\n\n[question]\n\nA) [option]\nB) [option]\nC) [option]\nD) [option]\n\n||Correct answer: [letter]||";
}
```

Example output:
```
/trivia science

📝 **Science Trivia**
What is the chemical symbol for gold?
A) Ag
B) Au
C) Fe
D) Cu

Type your answer (A/B/C/D) or ask Liber for the answer!
```

---

## Part 6: /rps — Rock Paper Scissors

### Usage

```
/rps <move>
```

Play Rock Paper Scissors against Liber. Moves: `rock`, `paper`, `scissors`.

### How It Works

Liber randomly selects its move and compares:
- Rock beats Scissors
- Scissors beats Paper
- Paper beats Rock
- Same move = Tie

```
/rps rock

🪨 **Rock Paper Scissors**
You chose: Rock
Liber chose: Scissors
Result: **You win!** 🎉
```

### System Prompt

```rust
if query.starts_with("/rps") {
    return "Play Rock Paper Scissors. React to the user's choice and pick your own. \
            Format: ✂️ You chose [x]. I chose [y]. **[win/lose/tie]**!";
}
```

---

## Part 7: /wouldyourather — Would You Rather

### Usage

```
/wyr <option A> or <option B>
```

Liber responds to a "Would You Rather" scenario with reasoning.

### Examples

```
/wyr fly or be invisible
/wyr have unlimited money or unlimited time
/wyr live in space or under the ocean
```

### How It Works

```
/wyr fly or be invisible

🤔 **Would You Rather**
**Fly** — Imagine soaring above the clouds, feeling the wind rush past you.
Practical perks: no traffic, free travel, incredible views.

BUT — Invisibility has its own appeal: privacy, sneaking into movies,
the ability to observe the world unseen.

I'd lean toward **fly**. Here's why: the joy and freedom of flight
is an active, positive experience. Invisibility is more about
avoiding detection — a passive superpower.

**Verdict**: Fly wins! ✈️
```

---

## Part 8: Casino Commands

### /slots — Slot Machine

```
/slots <bet>
```

Play the slot machine with a bet in XP.

```
/slots 50
```

The slot machine has 3 reels with symbols: 🍒 ⭐ 7️⃣ 💎 🍀 🔔

**Payout structure**:
- All 3 match → 5x multiplier
- 2 match → 2x multiplier
- No match → 0

```rust
// From apps/desktop/src-tauri/src/commands/games.rs
#[tauri::command]
pub fn casino_slots(user_id: String, bet: i32) -> Result<serde_json::Value, String> {
    let symbols = ["🍒", "⭐", "7️⃣", "💎", "🍀", "🔔"];
    let mut rng = rand::thread_rng();
    let reels: Vec<&str> = (0..3).map(|_| symbols[rng.gen_range(0..symbols.len())]).collect();

    let all_same = reels[0] == reels[1] && reels[1] == reels[2];
    let two_same = reels[0] == reels[1] || reels[1] == reels[2] || reels[0] == reels[2];

    let multiplier = if all_same { 5 } else if two_same { 2 } else { 0 };
    let winnings = if bet > 0 { bet * multiplier } else { 0 };

    Ok(serde_json::json!({
        "reels": reels,
        "multiplier": multiplier,
        "bet": bet,
        "winnings": winnings,
        "net": winnings - bet,
    }))
}
```

### /blackjack — Blackjack

```
/blackjack <bet> [hit|stand]
```

Play a simplified blackjack game.

```
/blackjack 50 hit
```

**Payout structure**:
- Win → 2x bet
- Push → 1x bet (refund)
- Lose/Bust → 0

```rust
#[tauri::command]
pub fn casino_blackjack(user_id: String, bet: i32, action: String) -> Result<serde_json::Value, String> {
    let mut rng = rand::thread_rng();
    let player_card = rng.gen_range(1..=11) + rng.gen_range(1..=11);
    let dealer_card = rng.gen_range(1..=11) + rng.gen_range(1..=11);

    let (player, dealer) = match action.as_str() {
        "hit" => {
            let new_p = player_card + rng.gen_range(1..=11);
            (new_p.min(21), dealer_card)
        }
        _ => (player_card, dealer_card),
    };

    let result = if player > 21 { "bust" }
        else if dealer > 21 || player > dealer { "win" }
        else if player == dealer { "push" }
        else { "lose" };

    let multiplier = match result {
        "win" => 2,
        "push" => 1,
        _ => 0,
    };
    let winnings = if bet > 0 { bet * multiplier } else { 0 };

    Ok(serde_json::json!({
        "player": player,
        "dealer": dealer,
        "result": result,
        "bet": bet,
        "winnings": winnings,
        "net": winnings - bet,
    }))
}
```

### Starting Casino Balance

Each user starts with **1000 XP** casino balance. Tracked in `casino_balances` table:
```sql
CREATE TABLE IF NOT EXISTS casino_balances (
    user_id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 1000,
    lifetime_won INTEGER DEFAULT 0,
    lifetime_lost INTEGER DEFAULT 0,
    updated_at INTEGER
);
```

### Casino Balance Management

```typescript
import { getCasinoBalance } from "./lib/api";

const balance = await getCasinoBalance(userId);
// { balance: 1000, lifetime_won: 0, lifetime_lost: 0 }
```

---

## Part 9: Other Slash Commands

### /roll — Roll Dice

```
/roll <NdM>
```

Roll dice in NdM format (N dice with M sides each).

```
/roll 2d6    # Roll two six-sided dice
/roll d20    # Roll a 20-sided die
/roll 3d8    # Roll three eight-sided dice
```

The `roll_dice` command is a pure Rust instant command — no AI needed:

```rust
#[tauri::command]
pub fn roll_dice(dice: String) -> Result<String, String> {
    let parts: Vec<&str> = dice.split('d').collect();
    let count = parts.get(0).and_then(|s| s.parse::<u32>().ok()).unwrap_or(1);
    let sides = parts.get(1).and_then(|s| s.parse::<u32>().ok()).ok_or(
        "Invalid format. Use NdM (e.g. 2d6)".to_string()
    )?;
    let count = count.max(1).min(100);
    let sides = sides.max(2).min(10000);

    let mut rng = rand::thread_rng();
    let rolls: Vec<u32> = (0..count).map(|_| rng.gen_range(1..=sides)).collect();
    let total: u32 = rolls.iter().sum();
    let rolls_str = rolls.iter().map(|r| r.to_string()).collect::<Vec<_>>().join(", ");

    Ok(format!("🎲 **{}d{}**: {} = **{}**", count, sides, rolls_str, total))
}
```

### /flip — Flip a Coin

```
/flip
```

Instant heads or tails result:
```
🪙 **Coin Flip**: Heads
```

```rust
#[tauri::command]
pub fn flip_coin() -> Result<String, String> {
    let result = if rand::thread_rng().gen_bool(0.5) { "Heads" } else { "Tails" };
    Ok(format!("🪙 **Coin Flip**: {}", result))
}
```

### /choose — Pick Between Options

```
/choose <option A> or <option B> [or option C...]
```

Liber picks one of your options randomly.

```
/choose pizza or sushi or tacos
```

### /rate — Rate Something

```
/rate <thing>
```

Liber rates your thing out of 10.

```
/rate my joke
/rate my code
```

### /brainrot — Assess Brainrot Level

```
/brainrot
```

Liber analyzes your recent messages to assess your "brainrot" level — a fun, non-serious metric for how much internet slang and meme culture your messages contain.

```
🧠 **Brainrot Assessment**

████████░░ [80]%

Diagnosis: Chronic skibidi energy. Your messages are 80% slang,
15% references, and 5% actual communication. Touch grass maybe?
```

### /predict — Create a Prediction Market

```
/predict Will we finish the project by Friday?
```

Creates a prediction market that others can bet on.

### /quiz — Start a Quiz

```
/quiz [category] [difficulty]
```

Start an interactive quiz. Categories include `general`, `science`, `history`, `geography`, `technology`. Difficulty can be `easy`, `medium`, or `hard`.

### /summary — Summarize Channel

```
/summary
```

Liber summarizes the recent channel conversation, highlighting decisions, action items, and key questions.

The summarizer fetches recent messages and feeds them to the AI:

```rust
// crates/libern-core/src/ai/summarizer.rs
pub fn summarize_channel(
    engine: &mut Box<dyn AiEngine + Send>,
    db: &Database,
    channel_id: &str,
    message_count: u32,
    callback: Box<dyn Fn(TokenEvent) + Send>,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT content FROM messages WHERE channel_id = ?1 AND deleted_at IS NULL \
         ORDER BY created_at DESC LIMIT ?2"
    ).map_err(|e| e.to_string())?;

    let messages: Vec<String> = stmt
        .query_map(rusqlite::params![channel_id, message_count], |row| {
            row.get::<_, String>(0)
        }).map_err(|e| e.to_string())?
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

### /assess — Assess Recent Messages

```
/assess <count>
```

Liber assesses the last N messages for sentiment, topic, and quality.

### /leaderboard — Show XP Leaderboard

```
/leaderboard
```

Shows the top 10 users by XP in the current server.

### /starboard — Show Starred Messages

```
/starboard
```

Shows the top starred messages in the current server.

### /help — Show Help

```
/help
```

Displays a list of all available commands with brief descriptions and usage.

### /wys — Would You Survive

```
/wys zombie apocalypse
```

Creates a survival scenario with a percentage and 3 choices.

---

## Part 10: Liber Response Rating (RLHF)

After each AI response, you can rate it with thumbs up/down.

### How to Rate

1. After Liber responds, click the **thumbs up** (👍) or **thumbs down** (👎) button.
2. Optionally select a category (e.g., "concise", "detailed", "funny", "off-topic").
3. Optionally leave a text comment.

### How Ratings Affect Liber

The RLHF system in `reward.rs` maintains preference profiles:
- Tracks preferred response styles (categories like "concise", "detailed", "funny")
- Adjusts temperature bias based on average scores
- Generates personalized style prompts

```typescript
import { rateResponse, getUserPreferences } from "./lib/ai";

await rateResponse(channelId, userId, responseId, 1, "concise");

const prefs = await getUserPreferences(userId);
// { total_feedback: 15, avg_score: 0.8, top_categories: ["concise", "detailed"], temperature_bias: 0.1 }
```

### RLHF Backend

```rust
#[tauri::command]
pub fn rate_response(
    db: State<Database>,
    ai: State<AiState>,
    channel_id: String,
    user_id: String,
    response_id: String,
    score: i8,
    category: Option<String>,
    comment: Option<String>,
) -> Result<serde_json::Value, String> {
    let fb = libern_core::ai::reward::Feedback {
        id: uuid::Uuid::new_v4().to_string(),
        channel_id,
        user_id: user_id.clone(),
        response_id,
        score: score.clamp(-1, 1),
        category,
        comment,
        created_at: chrono::Utc::now().timestamp_millis(),
    };

    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO ai_feedback (id, channel_id, user_id, response_id, score, category, comment, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        rusqlite::params![fb.id, fb.channel_id, fb.user_id, fb.response_id, fb.score, fb.category, fb.comment, fb.created_at],
    ).map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "id": fb.id,
        "score": fb.score,
        "applied": true,
    }))
}
```

---

## Part 11: AI Status and Configuration

### Check AI Status

```typescript
import { getAiStatus } from "./lib/ai";

const status = await getAiStatus();
// { loaded: true, model: "Qwen 2.5 1.5B Instruct", quant: "Q4_K_M", context_size: 4096 }
```

### Manage Conversation History

```typescript
import { getConversationHistory, clearConversationHistory } from "./lib/ai";

// View history (last 50 messages)
const history = await getConversationHistory(channelId, 50);

// Clear history for this channel
await clearConversationHistory(channelId);
```

### Per-Server AI Configuration

Server owners can configure Liber per-server:
```typescript
import { setAiConfig } from "./lib/ai";

await setAiConfig(serverId, {
    enabled: true,
    enabled_channels: ["general", "random"],
    moderation_level: "FlagAndBlock",
    temperature: 0.7,
    max_response_tokens: 1024,
});
```

### Content Moderation

Liber can moderate message content using the `moderate_message` command:

```typescript
import { moderateMessage } from "./lib/ai";

const result = await moderateMessage("message content to check");
// { classification: "Safe" | "Flag" | "Block", reason: "...", confidence: 0.95 }
```

---

## Part 12: Slash Command Auto-Complete

As you type a slash command in the MessageInput, the `SlashCommands` component provides auto-complete:

1. **Detection**: Regex `/\/(\w*)$/` detects partial slash commands as you type.
2. **Auto-complete popup**: Shows filtered commands with descriptions, usage, and badges:
   - `instant` for Rust commands (no AI needed)
   - `ai` for Liber-powered commands
3. **Navigation**: Arrow keys to navigate, Enter/Tab to select.

### Command Types

| Badge | Type | Latency |
|-------|------|---------|
| `instant` | Rust command (e.g., /roll, /flip, /slots) | <1ms |
| `ai` | Liber-powered (e.g., /ask, /joke, /8ball) | 200ms-2s (depends on AI engine) |

### Complete Command Reference

| Command | Type | Description |
|---------|------|-------------|
| `/ask <question>` | ai | Ask Liber anything |
| `/8ball <question>` | ai | Magic 8 Ball |
| `/joke [category]` | ai | Tell a joke |
| `/trivia [category]` | ai | Trivia question |
| `/rps <move>` | ai | Rock Paper Scissors |
| `/wyr <A> or <B>` | ai | Would You Rather |
| `/rate <thing>` | ai | Rate something /10 |
| `/brainrot` | ai | Brainrot assessment |
| `/wys <scenario>` | ai | Would You Survive |
| `/assess <count>` | ai | Assess recent messages |
| `/summary` | ai | Summarize channel |
| `/quiz [cat] [diff]` | ai | Interactive quiz |
| `/choose <A> or <B>` | ai | Pick between options |
| `/predict <question>` | ai | Create prediction market |
| `/roll <NdM>` | instant | Roll dice |
| `/flip` | instant | Flip a coin |
| `/slots <bet>` | instant | Slot machine |
| `/blackjack <bet> <action>` | instant | Blackjack |
| `/leaderboard` | instant | XP leaderboard |
| `/starboard` | instant | Starred messages |
| `/help` | instant | Show command list |

---

## Part 13: Troubleshooting AI Commands

| Problem | Solution |
|---------|----------|
| "Liber is not responding" | Liber may be using MockEngine which has limited responses. Download the AI model for full functionality. |
| "Model not found" | Download the Qwen model via Settings → AI → Download Model, or manually from Hugging Face. |
| Slow AI responses | Token generation rate is 15-40 tok/s on modern CPUs. GPU offloading can improve speed. Enable GPU layers in AI settings. |
| "Command not recognized" | Check the command spelling. Use /help to see all available commands. |
| Liber gives short replies | The default engine is MockEngine. For verbose responses, download the full AI model. |
| /trivia not responding | Ensure the AI model is loaded. Trivia is AI-powered and requires the full engine. |
| Rating buttons not appearing | The RLHF feedback system requires the AI model. Ratings may not appear with MockEngine. |
| Casino command says "insufficient balance" | Your casino balance starts at 1000 XP. Earn more XP by sending messages or check your balance. |
| AI response is repetitive | Lower the temperature setting in AI configuration (default 0.7). |
| "Failed to download model" | Check your internet connection and disk space. Try downloading manually from Hugging Face. |
| Liber not responding in specific channel | The channel may be excluded in per-server AI config. Check with the server owner. |

---

## Next Steps

Now that you can use all AI commands, proceed to:

- **How-To Guide 05**: Voice and Whiteboard — Join voice channels, use mute/deafen, collaborate on the whiteboard
- **How-To Guide 06**: Marketplace and Levels — Browse marketplace, earn XP, play casino games, check leaderboards

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com