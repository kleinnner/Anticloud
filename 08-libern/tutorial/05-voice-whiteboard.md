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
Document ID: TUT-005
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Voice Chat and Whiteboard

## Introduction

Libern provides real-time voice communication and collaborative whiteboard canvases. Voice chat uses LAN peer-to-peer audio streaming, while the whiteboard offers a shared drawing canvas. Both features operate fully offline.

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│           Voice & Whiteboard System                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Voice Chat                  Whiteboard              │
│  ┌─────────────────┐       ┌──────────────────┐     │
│  │ Opus Codec      │       │ WebGL Canvas     │     │
│  │ P2P Streaming   │       │ Drawing Tools     │     │
│  │ Mute/Deafen     │       │ Stroke Storage    │     │
│  │ Volume Control  │       │ AI Analysis       │     │
│  └────────┬────────┘       └────────┬─────────┘     │
│           │                         │               │
│           └──────────┬──────────────┘               │
│                      ▼                              │
│           ┌────────────────────┐                    │
│           │   CRDT Sync Layer  │                    │
│           │  LWW Element Set   │                    │
│           │  HLC Timestamps    │                    │
│           └────────┬───────────┘                    │
│                    ▼                                │
│           ┌────────────────────┐                    │
│           │  .aioss Ledger    │                    │
│           └────────────────────┘                    │
└─────────────────────────────────────────────────────┘
```

---

## Part 1: Voice Chat

Voice channels in Libern are identified by the `🔊` icon in the ChannelSidebar. The channel kind is stored as `"voice"` in the `channels` table.

### Joining a Voice Channel

1. Select a voice channel (marked with `🔊`) from the ChannelSidebar.
2. Click the join button or the voice channel entry.
3. The `ChannelSidebar` component uses the `channelIcons` mapping:
```typescript
const channelIcons: Record<string, string> = {
  text: "#",
  voice: "🔊",
  whiteboard: "🎨",
  world: "🌍",
};
```

### Voice Chat Controls

```
┌─────────────────────────────────────────────┐
│  Voice Channel: 🔊 General Voice            │
├─────────────────────────────────────────────┤
│                                             │
│  Connected: 3 users                         │
│                                             │
│  ┌───┐  ┌───┐  ┌───┐                       │
│  │ 🎤 │  │ 🔇 │  │ ⚙️ │                     │
│  │Mic │  │Spkr│  │Set │                     │
│  └───┘  └───┘  └───┘                       │
│                                             │
│  User List:                                 │
│  ┌─────────────────────────────────────┐   │
│  │ Alice    🎤  ────▓▓▓▓▓░░░░ 80%     │   │
│  │ Bob      🔊  ────▓▓▓▓▓▓▓▓ 100%    │   │
│  │ Charlie  🔇                          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

- **Mute**: Toggle microphone mute (prevents your audio from being sent).
- **Deafen**: Toggle deafen (prevents you from hearing others AND your audio from being sent).
- **Volume**: Adjust individual user volume levels.

### Audio Engine

The audio system is located at `crates/libern-core/src/audio/` (currently under development with an empty directory). The planned architecture includes:

- **Opus codec** for audio compression.
- **WebRTC-style** peer connection for low-latency streaming.
- **LAN discovery** via mDNS for finding peers.

### Voice Channel Database

```sql
-- Audio nodes for 3D spatial audio (future)
CREATE TABLE IF NOT EXISTS audio_nodes (
    id TEXT PRIMARY KEY,
    world_id TEXT NOT NULL,
    pos_x REAL NOT NULL, pos_y REAL NOT NULL, pos_z REAL NOT NULL,
    audio_source_id TEXT NOT NULL,
    radius REAL DEFAULT 10.0,
    volume REAL DEFAULT 0.5,
    loop_play INTEGER DEFAULT 0,
    play_on_join INTEGER DEFAULT 0,
    owner_id TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
```

### Server Voice Statistics

The server tracks total voice minutes:
```sql
CREATE TABLE IF NOT EXISTS server_stats (
    server_id TEXT PRIMARY KEY REFERENCES servers(id),
    total_messages INTEGER DEFAULT 0,
    total_members INTEGER DEFAULT 0,
    total_voice_minutes INTEGER DEFAULT 0,
    messages_today INTEGER DEFAULT 0,
    last_updated INTEGER
);
```

### P2P Voice Streaming Flow

```
┌─────────┐         ┌─────────┐
│  Peer A │         │  Peer B │
│  (Speaker)        │  (Listener)
└────┬────┘         └────┬────┘
     │                    │
     │ mDNS discover      │
     │◄──────────────────►│
     │                    │
     │ WebSocket connect  │
     │◄──────────────────►│
     │                    │
     │ Audio stream       │
     │ (Opus encoded)     │
     │───────────────────►│
     │                    │
     │ ┌──────────────┐   │
     │ │Mic → Opus    │   │
     │ │Encode → Send │   │
     │ └──────────────┘   │
     │                    │
     │                    │ ┌──────────────┐
     │                    │ │Receive → Decode│
     │                    │ │Play audio    │
     │                    │ └──────────────┘
```

---

## Part 2: Whiteboard

Whiteboard channels (`🎨`) provide a collaborative drawing canvas. The whiteboard allows multiple users to draw simultaneously in real-time.

### Opening the Whiteboard

1. Select a whiteboard channel from the ChannelSidebar (marked with `🎨`).
2. The whiteboard canvas opens in the main content area.
3. Multiple users can draw on the same canvas simultaneously.

### Whiteboard Tools

The whiteboard canvas supports these drawing tools:

| Tool | Shortcut | Description |
|------|----------|-------------|
| **Pen** | P | Freehand drawing with adjustable thickness and color |
| **Eraser** | E | Erase strokes |
| **Line** | L | Draw straight lines |
| **Rectangle** | R | Draw rectangles (filled or outline) |
| **Circle** | C | Draw circles/ellipses |
| **Text** | T | Add text annotations |
| **Select** | V | Select and move existing strokes |
| **Undo/Redo** | Ctrl+Z / Ctrl+Shift+Z | Undo or redo the last action |
| **Clear** | — | Clear the entire canvas |

### Whiteboard UI Layout

```
┌─────────────────────────────────────────────────────┐
│  🎨 Whiteboard Canvas — Server Name                 │
├─────────────────────────────────────────────────────┤
│  Toolbar:                                           │
│  [Pen] [Eraser] [Line] [Rect] [Circle] [Text]      │
│  [Select] [Undo] [Redo] [Clear]  Color: ■ Thick:── │
├─────────────────────────────────────────────────────┤
│                                                     │
│              Canvas Area                             │
│                                                     │
│        ┌──────────────────────┐                     │
│        │   ▲ User A: Alice    │                     │
│        │   /                  │                     │
│        │  /  Diagram showing  │                     │
│        │ /   architecture     │                     │
│        └──────────────────────┘                     │
│                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │ User A:    │  │ User B:    │  │ User C:    │   │
│  │ Alice      │  │ Bob        │  │ Charlie    │   │
│  │ ● pen      │  │ ● rect     │  │ ● text     │   │
│  └────────────┘  └────────────┘  └────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Stroke Data

Whiteboard strokes are stored as JSON and can be analyzed by Liber AI via the `ask_whiteboard` command. The stroke format includes:
- Stroke type (pen, eraser, shape)
- Points (x, y coordinates)
- Color (RGBA)
- Thickness
- Timestamp

```json
{
  "type": "pen",
  "points": [
    {"x": 100, "y": 200},
    {"x": 150, "y": 220},
    {"x": 200, "y": 240}
  ],
  "color": "#FF0000",
  "thickness": 3,
  "timestamp": 1718000000000
}
```

### AI Whiteboard Analysis

Liber can analyze whiteboard content:

```
/ask Analyze this diagram
```

Or programmatically:
```typescript
import { askWhiteboard } from "./lib/ai";
await askWhiteboard(
    channelId,
    strokesJson,  // JSON string of all strokes
    onToken,
    onDone,
    "What does this diagram show?"
);
```

The `ask_whiteboard` command (`apps/desktop/src-tauri/src/commands/ai.rs:67`) sends the canvas data and question to the AI:

```rust
#[tauri::command]
pub fn ask_whiteboard(
    ai: State<AiState>,
    _channel_id: String,
    strokes_json: String,
    query: Option<String>,
    on_event: tauri::ipc::Channel<TokenEvent>,
) -> Result<(), String> {
    let mut engine = ai.engine.lock().map_err(|e| e.to_string())?;
    let q = query.unwrap_or_default();
    let prompt = format!(
        "Analyze this whiteboard diagram.\nCanvas data:\n{}\nQuestion: {}",
        strokes_json, q
    );
    let request = InferenceRequest {
        prompt,
        max_tokens: 256,
        temperature: 0.5,
        callback: Box::new(move |event| {
            let _ = on_event.send(event);
        }),
    };
    engine.infer(request)
}
```

### Whiteboard Sync

Whiteboard data is synchronized peer-to-peer using the same CRDT mechanism as text messages. Strokes are:
1. Assigned HLC timestamps.
2. Merged using `LwwElementSet` semantics.
3. Stored as entries in the `.aioss` ledger.

### CRDT Merge for Whiteboard

```
Peer A draws a circle           Peer B draws a rectangle
    │                               │
    ▼                               ▼
HLC timestamp: 1718000001000    HLC timestamp: 1718000002000
    │                               │
    ▼                               ▼
Both strokes added to LWW Set with their timestamps
    │                               │
    └───────────┬───────────────────┘
                ▼
        CRDT Merge occurs
        When peers sync:
        - Circle (ts: 1718000001000)
        - Rectangle (ts: 1718000002000)
        - Both present in snapshot
                ▼
        Both peers see the same canvas
```

### World Decals (3D Whiteboard)

For 3D world channels, whiteboard-style decals can be placed in 3D space:

```sql
CREATE TABLE IF NOT EXISTS world_decals (
    id TEXT PRIMARY KEY,
    world_id TEXT NOT NULL,
    block_id TEXT,
    image_source_id TEXT,
    pos_x REAL NOT NULL, pos_y REAL NOT NULL, pos_z REAL NOT NULL,
    normal_x REAL, normal_y REAL, normal_z REAL,
    scale REAL DEFAULT 0.15,
    color_r REAL DEFAULT 1, color_g REAL DEFAULT 1, color_b REAL DEFAULT 1,
    opacity REAL DEFAULT 1.0,
    owner_id TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
```

### Whiteboard Use Cases

```
┌─────────────────────────────────────────────────────┐
│  Use Case: Architecture Design Session              │
│                                                     │
│  Participants: Alice, Bob, Charlie                  │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Alice: Draws system architecture diagram    │   │
│  │     [Client] ──► [API] ──► [Database]       │   │
│  │                              │               │   │
│  │  Bob: Adds arrows and labels                 │   │
│  │     HTTPS    REST    SQL                     │   │
│  │                              │               │   │
│  │  Charlie: Annotates with notes               │   │
│  │     "Need caching layer here"                │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Liber AI: "This shows a three-tier architecture    │
│  with client, API, and database layers."            │
└─────────────────────────────────────────────────────┘
```

---

## Part 3: CRDT Synchronization

Both voice and whiteboard features use the CRDT (Conflict-Free Replicated Data Type) system defined in `crates/libern-core/src/crdt/mod.rs`.

### Hybrid Logical Clock (HLC)

All real-time events use HLC timestamps to ensure causal ordering:

```rust
pub struct HybridLogicalClock {
    pub physical: u64,  // Wall clock in milliseconds (48 bits)
    pub logical: u16,   // Logical counter (16 bits)
}

impl HybridLogicalClock {
    /// Generate a new strictly increasing timestamp
    pub fn tick(&mut self) -> u64 {
        let now = Self::wall_now();
        if now > self.physical {
            self.physical = now;
            self.logical = 0;
        } else {
            self.logical += 1;
        }
        (self.physical << 16) | self.logical as u64
    }

    /// Merge with a remote timestamp (handles clock drift)
    pub fn update_with_remote(&mut self, remote_ts: u64) -> u64 {
        let remote_physical = remote_ts >> 16;
        let now = Self::wall_now();
        self.physical = self.physical.max(now).max(remote_physical);
        self.logical = 0;
        self.tick()
    }

    fn wall_now() -> u64 {
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64
    }
}
```

### LWW Element Set

The `LwwElementSet<T>` provides conflict-free merge semantics:
- Elements tracked in two sets: `adds` and `removes`.
- On merge, the higher timestamp wins.
- Supports `add`, `remove`, `snapshot`, and `merge` operations.

```rust
pub struct LwwElementSet<T: Clone + Eq + Hash> {
    pub adds: Vec<(T, u64)>,
    pub removes: Vec<(T, u64)>,
}

impl<T: Clone + Eq + Hash> LwwElementSet<T> {
    pub fn new() -> Self {
        LwwElementSet { adds: vec![], removes: vec![] }
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
            let removed = self.removes.iter()
                .any(|(r, rm_ts)| r == elem && rm_ts > add_ts);
            if !removed {
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
```

---

## Step-by-Step: Voice Chat Walkthrough

1. **Create a voice channel**: In a server, click `+` next to "Text Channels", select kind "voice".
2. **Join the channel**: Click the voice channel entry. The interface switches to voice mode.
3. **Mute yourself**: Click the microphone icon to toggle mute.
4. **Deafen**: Click the speaker icon to toggle deafen.
5. **Adjust volume**: Use the per-user volume sliders (if available).
6. **Leave**: Click the leave button or disconnect button.

### Voice Chat Troubleshooting Table

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| No audio device detected | Microphone not connected | Check physical connection and OS settings |
| Can't hear others | Output device not set | Check Settings > Voice > Output Device |
| Others can't hear you | Microphone muted | Check mute button and OS permissions |
| Echo/feedback | Speakers instead of headphones | Use headphones or enable echo cancellation |
| Audio cuts out | Network congestion | Check Wi-Fi signal, use Ethernet |
| Robotic sound | Packet loss | Enable FEC in voice settings |

---

## Step-by-Step: Whiteboard Walkthrough

1. **Create a whiteboard channel**: Click `+`, select kind "whiteboard".
2. **Open the canvas**: Click the whiteboard channel entry.
3. **Draw**: Select the pen tool and draw on the canvas.
4. **Change colors**: Use the color picker to change stroke color.
5. **Adjust thickness**: Use the thickness slider.
6. **Erase**: Switch to eraser tool and erase strokes.
7. **AI analysis**: Type `/ask What does this diagram represent?` to get AI analysis.
8. **Clear canvas**: Use the clear tool to reset the canvas.

### Whiteboard Troubleshooting Table

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Canvas not loading | WebGL not supported | Check GPU drivers, update webview |
| Drawing lag | GPU performance | Reduce canvas resolution in settings |
| Sync issues | P2P connection problem | Check peer connections, wait for sync |
| Missing strokes | CRDT merge conflict | Refresh the canvas |
| High memory usage | Too many elements | Archive old content, clear undo history |

---

## Next Steps

- **Tutorial 06**: Managing Roles — Create roles, assign permissions, invite codes
- **Tutorial 07**: Marketplace and Games — Browse marketplace, casino games, XP

### Related References

- **FAQ-007**: Voice and Whiteboard FAQ — Common questions answered
- **HLP-006**: Voice and Whiteboard Issues — Troubleshooting guide
- **DEV-003**: Sync Protocol — CRDT details
- **DEV-001**: Architecture Overview — System architecture

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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
