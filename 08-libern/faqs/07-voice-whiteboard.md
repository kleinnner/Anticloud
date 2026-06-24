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
Category: FAQ
Document ID: FAQ-007
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Voice and Whiteboard FAQ

## What voice chat quality does Libern support?

The voice system is designed for LAN peer-to-peer audio with:
- **Opus codec** for efficient audio compression (planned).
- **Low latency** for real-time conversation.
- **Adaptive bitrate** based on network conditions.

Voice channels are stored with kind `"voice"` in the channels table.

### Voice Quality Levels

| Quality | Bitrate | Sample Rate | Channels | Use Case |
|---------|---------|-------------|----------|----------|
| Low | 32 kbps | 16 kHz | Mono | Low bandwidth |
| Balanced | 64 kbps | 24 kHz | Mono | Default |
| High | 96 kbps | 48 kHz | Mono | Good quality |
| Very High | 128 kbps | 48 kHz | Stereo | Music/audio |

---

## Can I mute or deafen myself?

Yes. Voice chat controls include:
- **Mute**: Prevents your microphone audio from being sent to peers.
- **Deafen**: Prevents all audio output AND input (full silence).

### Control States

```
┌─────────────────────────────────────────────┐
│  Voice Control States                       │
├─────────────────────────────────────────────┤
│                                             │
│  Normal:  🎤 Mic On    🔊 Speakers On      │
│  Muted:   🔇 Mic Off   🔊 Speakers On      │
│  Deafened:🔇 Mic Off   🔇 Speakers Off     │
│                                             │
│  Keyboard Shortcuts:                        │
│  Ctrl+M  — Toggle mute                     │
│  Ctrl+D  — Toggle deafen                   │
└─────────────────────────────────────────────┘
```

---

## How does voice work without a server?

Voice uses **peer-to-peer** audio streaming over the LAN. When you join a voice channel:
1. The app discovers other peers in the channel via mDNS.
2. Direct WebSocket connections are established between peers.
3. Audio is streamed directly between peers — no central server required.

### P2P Audio Flow

```
┌──────────┐                     ┌──────────┐
│  Peer A  │                     │  Peer B  │
└────┬─────┘                     └────┬─────┘
     │                                │
     │ Join voice channel             │
     │ mDNS discovery                 │
     │◄──────────────────────────────►│
     │                                │
     │ WebSocket connection           │
     │◄──────────────────────────────►│
     │                                │
     │ ┌──────────────┐              │
     │ │ Mic capture  │              │
     │ │ Opus encode  │              │
     │ │ UDP stream   │─────────────►│ │ Opus decode  │
     │ └──────────────┘              │ │ Speaker play │
     │                               │ └──────────────┘
     │                               │
     │               ◄───────────────│ │ Mic capture  │
     │ ┌──────────────┐              │ │ Opus encode  │
     │ │ Speaker play │              │ └──────────────┘
     │ │ Opus decode  │              │
     │ └──────────────┘              │
```

---

## Is there push-to-talk?

Push-to-talk is not currently implemented. Voice is open (always sending when in a voice channel, unless muted). Push-to-talk may be added in a future version.

---

## What is the whiteboard?

The whiteboard is a collaborative canvas tool that allows multiple users to draw simultaneously. Whiteboard channels are identified by the `🎨` icon and `kind = "whiteboard"`.

---

## What tools does the whiteboard have?

| Tool | Shortcut | Description |
|------|----------|-------------|
| Pen | P | Freehand drawing |
| Eraser | E | Erase strokes |
| Line | L | Draw straight lines |
| Rectangle | R | Draw rectangles |
| Circle | C | Draw circles/ellipses |
| Text | T | Add text annotations |
| Select | V | Select and move strokes |
| Undo | Ctrl+Z | Undo last action |
| Redo | Ctrl+Shift+Z | Redo last action |
| Clear | — | Clear entire canvas |

### Tool Usage Examples

```
Pen:     ─────  (freeform line)
Line:    ─────  (straight line between two points)
Rect:    ┌───┐  (rectangle from corner to corner)
Circle:  ╭───╮  (ellipse from corner to corner)
Text:    "Hi"  (click to place text cursor)
Select:  ┌───┐  (drag to select and move strokes)
         └───┘
```

---

## Can the AI analyze my whiteboard?

Yes. Liber can analyze whiteboard content. Select a whiteboard channel and ask:

```
What does this diagram show?
```

Or use the API:
```typescript
import { askWhiteboard } from "./lib/ai";
await askWhiteboard(channelId, strokesJson, onToken, onDone, "Analyze this");
```

The AI receives the canvas data as JSON and provides analysis.

### AI Analysis Examples

| Canvas Content | AI Can Detect |
|----------------|---------------|
| Flowchart | Steps, decisions, data flow |
| Architecture diagram | Components, connections, layers |
| Mind map | Topics, relationships, hierarchy |
| Wireframe | UI elements, layout, navigation |
| Equations | Mathematical notation |
| Annotations | Text labels and notes |

---

## How do I create a whiteboard channel?

1. Select a server from the ServerListSidebar.
2. In the ChannelSidebar, click the `+` button next to "Text Channels".
3. In the CreateChannelModal, enter a channel name.
4. Select kind "whiteboard".
5. Click Create.

The `create_channel` command handles the rest.

---

## How are whiteboard strokes saved?

Whiteboard strokes are:
1. Assigned HLC timestamps for ordering.
2. Merged using CRDT (LWW Element Set) for conflict-free sync.
3. Recorded in the `.aioss` ledger for tamper-evident history.

---

## Can multiple people draw at the same time?

Yes. The whiteboard supports multi-user collaboration:
- Each user's strokes are identified by their user ID.
- CRDT merge ensures strokes converge on all peers.
- Real-time sync via WebSocket.

### Multi-User Collaboration

```
┌─────────────────────────────────────────────┐
│  Collaborative Whiteboard                    │
├─────────────────────────────────────────────┤
│                                             │
│  Alice (red pen):    ──── Line A ────       │
│  Bob (blue pen):     ┌──── Rect B ────┐    │
│  Charlie (green):    "Annotation C"        │
│                                             │
│  All three users see the same canvas       │
│  CRDT merge combines all strokes           │
│  Each stroke identified by user ID         │
└─────────────────────────────────────────────┘
```

---

## What are "world decals"?

World decals are 3D whiteboard-style annotations that can be placed in 3D worlds. They extend the whiteboard concept into three dimensions:

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

---

## Are voice and whiteboard channels recorded in .aioss?

Yes. Voice channel joins/leaves and whiteboard strokes are recorded as entries in the server's `.aioss` session. This provides a complete audit trail of all collaboration activity.

---

## What audio nodes are used for spatial audio?

The `audio_nodes` table supports 3D spatial audio for world channels:

```sql
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

This enables 3D positional audio where sound sources are placed in the 3D world and attenuate based on distance.

---

## How do I leave a voice channel?

Click the **Leave** or **Disconnect** button in the voice interface. Your departure is recorded in the `.aioss` ledger and broadcast to peers.

---

## Can I adjust individual user volume?

Per-user volume controls are available in the voice interface. You can adjust each connected user's volume independently.

---

## What are the system requirements for voice chat?

- **Network**: LAN connection (Wi-Fi or Ethernet). Voice is not designed for WAN/internet use.
- **Microphone**: Any system-recognized microphone.
- **Speakers/headphones**: Any audio output device.
- **Bandwidth**: ~64-128 kbps per stream (Opus codec).

---

## Voice Channel Management

### Creating Voice Channels

Voice channels are created just like text channels:

```typescript
import { createChannel } from "./lib/api";
const channel = await createChannel(
    serverId,
    "General Voice",
    "voice",  // channel kind
    null      // parent_id
);
```

### Voice Channel Controls API

```typescript
import { invoke } from "@tauri-apps/api/core";

// Join voice channel
await invoke("join_voice_channel", { channelId });

// Leave voice channel
await invoke("leave_voice_channel");

// Toggle mute
await invoke("toggle_mute");

// Toggle deafen
await invoke("toggle_deafen");

// Set volume for user
await invoke("set_user_volume", { userId, volume: 0.8 });

// Get connected users
const users = await invoke("get_voice_users", { channelId });
```

### Voice State Model

```typescript
interface VoiceState {
  channelId: string | null;
  connected: boolean;
  muted: boolean;
  deafened: boolean;
  users: VoiceUser[];
}

interface VoiceUser {
  userId: string;
  displayName: string;
  speaking: boolean;
  volume: number;
  muted: boolean;
  deafened: boolean;
}
```

---

## Whiteboard Technical Details

### Stroke Data Format

```json
{
  "id": "stroke-uuid",
  "userId": "user-uuid",
  "tool": "pen",
  "points": [
    {"x": 100.5, "y": 200.3, "pressure": 0.8},
    {"x": 150.2, "y": 220.1, "pressure": 0.6}
  ],
  "color": "#FF0000",
  "thickness": 3,
  "opacity": 1.0,
  "timestamp": 1718000000000,
  "hlc": 1234567890123456
}
```

### Whiteboard CRDT Sync

Strokes are synced using LWW Element Set:

```rust
// Each stroke becomes an element in the CRDT set
pub struct Stroke {
    pub id: String,
    pub user_id: String,
    pub data: StrokeData, // JSON blob
}

// CRDT operations
let mut strokes = LwwElementSet::<Stroke>::new();

// Add stroke
strokes.add(stroke, hlc.tick());

// Remove stroke (erase)
strokes.remove(stroke_id, hlc.tick());

// Merge from peer
strokes.merge(&peer_strokes);

// Get visible strokes
let visible = strokes.snapshot();
```

### Whiteboard Layers

The whiteboard supports layering:
- Each stroke belongs to a layer (default: 0)
- Layers can be hidden, locked, or reordered
- AI analysis considers all visible layers

```
Layer System:
┌──────────────────────────────┐
│  Layer 2: Annotations   🔒  │  ← Locked
├──────────────────────────────┤
│  Layer 1: Architecture   👁️ │  ← Visible
├──────────────────────────────┤
│  Layer 0: Background     👁️ │  ← Visible
└──────────────────────────────┘
```

---

## Voice & Whiteboard Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Voice channel UI | ✅ Done | Channel type, controls |
| Voice audio engine | 🔄 In development | Opus codec planned |
| Voice P2P streaming | 🔄 In development | WebRTC-style planned |
| Voice input selection | 🔄 Planned | Device picker |
| Push-to-talk | 📋 Planned | Key binding |
| Noise suppression | 📋 Planned | RNNoise integration |
| Echo cancellation | 📋 Planned | WebRTC AEC |
| Whiteboard canvas | ✅ Done | Full toolset |
| Whiteboard CRDT sync | ✅ Done | LWW Element Set |
| Whiteboard AI analysis | ✅ Done | Via ask_whiteboard |
| World decals | 🔄 Partial | DB schema done |
| 3D spatial audio | 📋 Future | audio_nodes schema |

✅ Done  🔄 In Development  📋 Planned

---

## Voice & Whiteboard Tips

### Voice Tips

1. **Use headphones** to prevent echo for other users
2. **Mute when not speaking** to reduce background noise
3. **Use wired Ethernet** for best voice quality
4. **Adjust VAD threshold** if voice activation cuts off speech
5. **Check OS permissions** if microphone isn't detected
6. **Close other audio apps** to avoid device conflicts

### Whiteboard Tips

1. **Use layers** to organize different aspects of your diagram
2. **Name your strokes** using the text tool for clarity
3. **Save frequently** — the whiteboard auto-saves via CRDT
4. **Use AI analysis** to get a text summary of your diagram
5. **Clear unused elements** to improve performance
6. **Collaborate in real-time** — all changes sync instantly

---

## Voice & Whiteboard FAQ Summary

## Whiteboard Data Structures

### Stroke Storage in SQLite

```sql
CREATE TABLE IF NOT EXISTS whiteboard_strokes (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id),
    stroke_data TEXT NOT NULL,      -- JSON stroke data
    hlc_timestamp INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_whiteboard_channel
    ON whiteboard_strokes(channel_id, hlc_timestamp);
```

### Stroke CRDT Operations

```rust
// Whiteboard strokes use the same CRDT as messages
pub struct StrokeCRDT {
    strokes: LwwElementSet<Stroke>,
}

impl StrokeCRDT {
    pub fn add_stroke(&mut self, stroke: Stroke, hlc: u64) {
        self.strokes.add(stroke, hlc);
    }

    pub fn remove_stroke(&mut self, stroke_id: String, hlc: u64) {
        // Create a tombstone stroke with just the ID
        let tombstone = Stroke { id: stroke_id, .. };
        self.strokes.remove(tombstone, hlc);
    }

    pub fn get_visible_strokes(&self) -> Vec<&Stroke> {
        self.strokes.snapshot()
    }

    pub fn merge_from_peer(&mut self, peer_strokes: &StrokeCRDT) {
        self.strokes.merge(&peer_strokes.strokes);
    }
}
```

---

## Voice Channel Limits

| Limit | Value | Notes |
|-------|-------|-------|
| Max users per channel | 25 | Limited by P2P bandwidth |
| Max concurrent voice channels | Unlimited | Per-server limit |
| Audio bitrate range | 16-128 kbps | Configurable |
| Sample rate | 8-48 kHz | Higher = better quality |
| Jitter buffer range | 50-500 ms | Adjustable in settings |
| FEC overhead | +20% bandwidth | When enabled |
| Push-to-talk delay | N/A | Not yet implemented |

---

## Voice & Whiteboard FAQ Summary

| Question | Answer |
|----------|--------|
| Do I need internet for voice? | No, works on LAN only |
| Can I mute myself? | Yes, mute and deafen |
| Is there push-to-talk? | Not yet (planned) |
| Can AI analyze my drawing? | Yes, via /ask command |
| Can multiple people draw? | Yes, CRDT syncs all users |
| Are voice/whiteboard recorded? | Yes, in .aioss ledger |
| What codec is used? | Opus (planned) |
| Can I adjust volume per user? | Yes |
| What WebGL version needed? | WebGL 1.0+ |
| Can I undo on whiteboard? | Yes, Ctrl+Z |
| Are there layers? | Yes, layer system supported |
| Can I export the whiteboard? | Yes, via .aioss export |
| Max users per voice channel? | ~25 |
| Can I use external microphone? | Yes, any OS-recognized mic |
| Is spatial audio supported? | Planned (3D audio nodes) |

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
