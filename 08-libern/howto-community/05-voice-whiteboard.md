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
Document ID: CMT-005
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Voice Chat and Whiteboard

## Introduction

Libern provides real-time voice communication and collaborative whiteboard canvases. Voice chat uses LAN peer-to-peer audio streaming (no server relay), while the whiteboard offers a shared drawing canvas that synchronizes across peers via CRDT merge. Both features operate fully offline and require no internet connection.

The voice system uses Opus codec for audio compression and UDP multicast for low-latency streaming. The whiteboard is powered by Fabric.js and supports infinite canvas, multiple tool types, and simultaneous multi-user editing.

By the end of this guide, you will be able to:
- Join and participate in voice channels
- Use mute, deafen, and volume controls
- Open and use the collaborative whiteboard
- Use all whiteboard drawing tools
- Understand how voice and whiteboard sync across peers
- Use AI analysis on whiteboard content
- Manage 3D world channels

---

## Prerequisites

- Libern is installed with a configured identity
- You belong to a server with voice and/or whiteboard channels

---

## Part 1: Voice Chat Overview

Voice channels in Libern are identified by the `🔊` icon in the ChannelSidebar. The channel kind is stored as `"voice"` in the `channels` table.

### How Voice Works

Voice chat uses a direct LAN P2P architecture:
1. When you join a voice channel, Libern discovers other peers on the local network via mDNS.
2. Audio is captured from your microphone using the `cpal` Rust crate.
3. Audio is encoded using the Opus codec for efficient transmission.
4. Encoded audio is streamed to peers via UDP broadcast (low latency).
5. Incoming streams are decoded and played through your speakers/headphones.

There is no central server — all audio flows directly between peers on the same LAN.

### Voice Architecture Diagram

```
┌─────────────────┐          ┌─────────────────┐
│  Peer A         │          │  Peer B          │
│                 │          │                  │
│ Microphone ──►  │          │  ┌─► Speakers    │
│ cpal capture    │   UDP    │  │               │
│ Opus encode     │◄────────►│  │ Opus decode   │
│ Network send    │          │  │ Network recv  │
└─────────────────┘          └──┴──────────────┘
                                    ▲
                                    │
                              ┌─────┴─────┐
                              │  Peer C    │
                              │  (mixed in)│
                              └───────────┘
```

### Current Status

The voice chat system is under active development. The audio engine is located at `crates/libern-core/src/audio/` which currently contains module stubs for:
- `capture.rs` — Microphone input capture
- `decoder.rs` — Opus audio decoding
- `mixer.rs` — Multi-stream audio mixing

Voice channels are functional for channel creation and listing. Full voice streaming will be enabled in a future release.

---

## Part 2: Joining a Voice Channel

### Via the Channel Sidebar

1. Look for a channel with the `🔊` icon in the ChannelSidebar.
2. Click the voice channel entry.
3. If the channel is the selected channel, the interface switches to voice mode.
4. A voice panel appears showing:
   - Channel name
   - List of connected users (with speaking indicators)
   - Volume sliders for each user
   - Mute/Deafen controls

### Creating a Voice Channel

If your server doesn't have a voice channel:

1. Click the **"+"** button next to "Voice Channels" in the ChannelSidebar.
2. Select kind **"voice"** in the `CreateChannelModal`.
3. Enter a name (e.g., "General Voice").
4. Click Create.

### Voice Channel in the Database

```sql
-- Channels with kind='voice' are treated as voice channels
SELECT * FROM channels WHERE server_id = ?1 AND kind = 'voice';
```

### Voice View Interface

```
┌──────────────────────────────────────────────┐
│  🔊 General Voice                             │
├──────────────────────────────────────────────┤
│                                              │
│  Connected Users                             │
│                                              │
│  ┌──┐                                        │
│  │  │ @Alice    ● Speaking   [─────░──] 100% │
│  └──┘                                        │
│  ┌──┐                                        │
│  │  │ @Bob                   [───────░─]  80% │
│  └──┘                                        │
│  ┌──┐                                        │
│  │  │ @Carol                 [──────░──]  90% │
│  └──┘                                        │
│                                              │
├──────────────────────────────────────────────┤
│  [🎤 Mute] [🔊 Deafen] [📞 Leave]            │
└──────────────────────────────────────────────┘
```

---

## Part 3: Voice Controls

### Mute

Muting prevents your microphone audio from being sent to other users.

- **Toggle mute**: Click the **microphone icon** (🎤) in the UserPanel or voice panel.
- When muted, the microphone icon changes to a muted state (🚫🎤).
- Other users can see your mute status.

```typescript
import { setMute } from "./lib/api";
await setMute(true);  // Mute on
await setMute(false); // Mute off
```

### Deafen

Deafening prevents you from hearing other users AND prevents your audio from being sent.

- **Toggle deafen**: Click the **speaker icon** (🔊) in the UserPanel or voice panel.
- When deafened, the speaker icon changes to a muted state (🔇).
- Other users can see your deafen status.
- Deafen implies mute (you cannot be deafened but not muted).

```typescript
import { setDeafen } from "./lib/api";
await setDeafen(true);  // Deafen on
await setDeafen(false); // Deafen off
```

### Volume Control

Adjust the volume of individual users:

1. In the voice panel, locate the user whose volume you want to adjust.
2. Drag the volume slider left (quieter) or right (louder).
3. Volume settings are persisted locally per user.

### Voice Activity Detection (VAD)

When enabled, Libern automatically detects when you are speaking and only transmits audio when voice activity is detected. This reduces bandwidth usage and background noise transmission.

VAD settings can be configured in Settings → Voice → Voice Activity Detection.

### Audio Device Selection

Configure your input and output devices in Settings → Voice:

```
┌─────────────────────────────────────┐
│ Voice Settings                       │
├─────────────────────────────────────┤
│ Input Device: [Microphone (Realtek)] │
│ Output Device: [Speakers (Realtek)]  │
│                                      │
│ Input Volume: [███████░░░░]          │
│ Output Volume: [████████░░]          │
│                                      │
│ VAD Sensitivity: [░░░░████░░]        │
│                                      │
│ [Test Microphone] [Test Speakers]    │
└─────────────────────────────────────┘
```

---

## Part 4: Voice Statistics

The server tracks total voice usage:

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

Voice session data is stored in `voice_sessions`:
```sql
CREATE TABLE IF NOT EXISTS voice_sessions (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id),
    joined_at INTEGER NOT NULL,
    left_at INTEGER,
    duration_ms INTEGER
);
```

---

## Part 5: Whiteboard Overview

Whiteboard channels (`🎨`) provide a collaborative drawing canvas. The whiteboard uses Fabric.js for rendering and supports multiple users drawing simultaneously in real-time. Whiteboard data is synchronized peer-to-peer using the same CRDT mechanism as text messages.

### Opening the Whiteboard

1. Select a whiteboard channel from the ChannelSidebar (marked with `🎨`).
2. The WhiteboardView opens in the main content area, showing:
   - Infinite canvas with pan/zoom
   - Drawing toolbar at the top
   - Color picker and stroke width controls
   - Layer panel (future feature)

### Creating a Whiteboard Channel

1. Click the **"+"** button next to "Whiteboard Channels".
2. Select kind **"whiteboard"**.
3. Enter a name (e.g., "Brainstorm Canvas").
4. Click Create.

---

## Part 6: Whiteboard Drawing Tools

The whiteboard toolbar provides these drawing tools:

```
┌──────────────────────────────────────────────────────────────────────┐
│ [✏️] [🧹] [─] [▬] [●] [T] [🖱️]  Color: [■]  Size: [───░──]  [↩️][↪️]│
└──────────────────────────────────────────────────────────────────────┘
```

### Pen Tool

Freehand drawing with adjustable thickness and color.

1. Select the **Pen** tool (✏️).
2. Choose a color from the color picker.
3. Adjust stroke thickness with the slider (1-50px).
4. Click and drag on the canvas to draw.
5. Release to complete the stroke.

### Eraser Tool

Erase existing strokes by clicking/touching them.

1. Select the **Eraser** tool (🧹).
2. Click on any stroke to remove it.
3. Alternatively, click and drag to erase multiple strokes.

### Line Tool

Draw straight lines between two points.

1. Select the **Line** tool.
2. Click where the line should start.
3. Drag to where the line should end.
4. Release to place the line.

### Rectangle Tool

Draw rectangles (filled or outline).

1. Select the **Rectangle** tool (▬).
2. Click and drag to define the rectangle bounds.
3. The rectangle is filled with the current color (use the fill toggle for outline only).

### Circle Tool

Draw circles and ellipses.

1. Select the **Circle** tool (●).
2. Click and drag to define the circle radius.
3. Hold Shift to constrain to a perfect circle.

### Text Tool

Add text annotations to the canvas.

1. Select the **Text** tool (T).
2. Click on the canvas to place a text cursor.
3. Type your text.
4. Click away to finish.

### Select Tool

Select, move, resize, and rotate existing strokes.

1. Select the **Select** tool (🖱️).
2. Click on a stroke to select it.
3. Drag to move.
4. Drag corner handles to resize.
5. Use the rotation handle to rotate.

### Undo/Redo

- **Undo**: `Ctrl+Z` or click the Undo button (↩️).
- **Redo**: `Ctrl+Shift+Z` or click the Redo button (↪️).

### Clear Canvas

Clears all strokes from the current canvas.

1. Click the **Clear** button (🗑️).
2. Confirm the action.
3. All strokes are removed (this is recorded in the CRDT as deletions).

---

## Part 7: Whiteboard Canvas Controls

### Pan and Zoom

- **Pan**: Click and drag on an empty area of the canvas, or hold `Space` and drag.
- **Zoom**: Use the mouse wheel (`Ctrl+Scroll`) or the zoom slider in the toolbar.
- **Zoom to fit**: Click the **Fit** button to zoom to show all content.
- **Reset zoom**: Double-click on an empty area to reset to 100%.

### Color Picker

The color picker offers:
- Preset color swatches (red, orange, yellow, green, cyan, blue, purple, pink, black, white, gray)
- Custom color picker (click the swatch to open the full picker)
- Recent colors section
- Color hex code input

### Stroke Thickness

Adjust stroke thickness from 1px to 50px using the slider. The preview shows the current thickness.

### Canvas Export

You can export the whiteboard canvas as an image:

1. Right-click on the canvas.
2. Select **Export** from the context menu.
3. Choose **PNG** or **SVG** format.
4. The file is saved to your Downloads folder.

---

## Part 8: AI Whiteboard Analysis

Liber can analyze whiteboard content to provide insights, identify elements, or answer questions about the drawing.

### Using /ask on the Whiteboard

1. While viewing a whiteboard channel, type in the chat panel:
   ```
   /ask What does this diagram represent?
   ```
2. Liber analyzes the current visible strokes and provides a response.

### Programmatic Analysis

```typescript
import { askWhiteboard } from "./lib/ai";

const strokesJson = getCurrentStrokes(); // Serialize canvas strokes
await askWhiteboard(
    channelId,
    strokesJson,
    (token) => appendToResponse(token),
    (full) => finalizeResponse(full),
    "What does this diagram show?"
);
```

The `ask_whiteboard` command sends the canvas data and question to the AI:

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

    let callback = Box::new(move |event: TokenEvent| {
        on_event.send(event).ok();
    });

    let engine_ref: &mut Box<dyn AiEngine + Send> = &mut *engine;
    engine_ref.infer(InferenceRequest {
        prompt,
        max_tokens: 512,
        temperature: 0.3,
        callback,
    })
}
```

---

## Part 9: Whiteboard CRDT Sync

Whiteboard strokes are synchronized peer-to-peer using the same CRDT mechanism as text messages.

### Stroke Data Format

Each stroke is serialized to JSON:
```json
{
    "id": "uuid",
    "tool": "pen",
    "points": [[x1, y1], [x2, y2], ...],
    "color": "#ff0000",
    "thickness": 3,
    "hlc_timestamp": 1718000000000,
    "author_id": "uuid"
}
```

### Sync Mechanism

1. Strokes are assigned HLC timestamps when created.
2. Merged using `LwwElementSet` semantics (Last-Write-Wins).
3. Stored as entries in the `.aioss` ledger.
4. Synced to peers via the same CRDT protocol.

### Stroke Storage

Whiteboard strokes are stored in the `whiteboard_strokes` table:
```sql
CREATE TABLE IF NOT EXISTS whiteboard_strokes (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES users(id),
    stroke_data BLOB NOT NULL,
    hlc_timestamp INTEGER NOT NULL,
    signature BLOB NOT NULL,
    created_at INTEGER NOT NULL
);
```

### Multi-User Collaboration Example

```
User A draws a box          User B draws a circle
      │                            │
      ▼                            ▼
┌─────────────────┐      ┌─────────────────┐
│ Local DB:        │      │ Local DB:        │
│ stroke_1 = box   │      │ stroke_2 = circle │
│ HLC: 1000        │      │ HLC: 1001        │
└────────┬────────┘      └────────┬────────┘
         │                        │
         └─────────┬──────────────┘
                   ▼
      ┌──────────────────────┐
      │ CRDT Merge           │
      │ LWW: higher HLC wins │
      │ Result: both visible │
      └──────────────────────┘
```

---

## Part 10: 3D World Channels

World channels (`🌍`) provide a 3D spatial environment where whiteboard-style decals can be placed in 3D space.

### World Decals

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

### Audio Nodes

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

---

## Part 11: Step-by-Step Voice Chat Walkthrough

1. **Create a voice channel**: In a server, click `+` next to "Voice Channels", select kind "voice", enter a name.
2. **Join the channel**: Click the voice channel entry in the ChannelSidebar.
3. **Check your audio devices**: Go to Settings → Voice → ensure correct input/output devices are selected.
4. **Test your microphone**: Click "Test Microphone" in Settings → Voice and speak a few words.
5. **Mute yourself**: Click the microphone icon to toggle mute.
6. **Deafen**: Click the speaker icon to toggle deafen.
7. **Adjust volume**: Use the per-user volume sliders to balance audio levels.
8. **Enable VAD**: Turn on Voice Activity Detection to only transmit when speaking.
9. **Leave**: Click the leave button or disconnect button, or select a different channel.

---

## Part 12: Step-by-Step Whiteboard Walkthrough

1. **Create a whiteboard channel**: Click `+`, select kind "whiteboard", enter a name.
2. **Open the canvas**: Click the whiteboard channel entry in the ChannelSidebar.
3. **Draw**: Select the pen tool and draw on the canvas.
4. **Change colors**: Use the color picker to change stroke color.
5. **Adjust thickness**: Use the thickness slider.
6. **Add shapes**: Switch to rectangle or circle tool to add geometric shapes.
7. **Add text**: Use the text tool to add annotations.
8. **Select and move**: Use the select tool to rearrange elements.
9. **Erase**: Switch to eraser tool and click strokes to erase.
10. **Pan and zoom**: Hold Space and drag to pan; scroll to zoom.
11. **AI analysis**: Type `/ask What does this diagram represent?` to get AI analysis.
12. **Export**: Right-click canvas and select Export → PNG or SVG.

---

## Part 13: Troubleshooting Voice and Whiteboard

| Problem | Solution |
|---------|----------|
| Cannot hear others | Check that you are not deafened. Check your output device in Settings → Voice. Ensure other users are in the same channel. |
| Others cannot hear me | Check that you are not muted. Check your input device in Settings → Voice. Microphone permissions may be required. |
| Whiteboard not responding | Try refreshing the canvas (Ctrl+R in the whiteboard view). Check for JavaScript errors in the console (Ctrl+Shift+I). |
| Canvas is blank | You may need to pan or zoom. Use the Fit to Content button or double-click to reset zoom. |
| Whiteboard strokes not syncing | Ensure peers are connected via LAN. Check peer status in the Compliance dashboard. |
| Drawing is laggy | Reduce canvas resolution or close other GPU-intensive applications. Fabric.js uses WebGL for rendering. |
| Voice audio is choppy | Lower your microphone sample rate in Settings → Voice. Ensure your network connection is stable. |
| "No voice channel found" | The server may not have any voice channels. Create one using the "+" button. |
| Microphone not detected | Check OS microphone permissions. On Windows: Settings → Privacy → Microphone. On macOS: System Preferences → Security & Privacy → Microphone. |
| Whiteboard export fails | Ensure there are strokes on the canvas. The export requires at least one stroke to generate an image. |
| "Cannot undo" | Undo history is cleared when the page is refreshed. Undo only works within the current session. |

---

## Next Steps

Now that you can use voice and whiteboard, proceed to:

- **How-To Guide 06**: Marketplace and Levels — Browse the marketplace, earn XP, play casino games, check the leaderboard

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
