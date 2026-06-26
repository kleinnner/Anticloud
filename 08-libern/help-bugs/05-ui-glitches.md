▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document version: 1.0.0 | Updated: 2026-06-19
Category: help-bugs | ID: LIB-HLP-005

────────────────────────────────────────────────────────────────

# UI Glitches

## 1. Overview

Libern's user interface is built with web technologies (JavaScript/TypeScript, rendered via a webview). While this provides cross-platform consistency, it can also lead to rendering issues, display glitches, and interface problems that vary by platform and hardware configuration.

This guide covers common UI issues:
1. Messages not appearing in chat
2. Channel list empty or not updating
3. Server not loading or stuck on loading screen
4. Rendering artifacts and display issues
5. Input field problems
6. Theme and appearance issues

### UI Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Libern UI Architecture                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  WebView Layer                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ WebView2 (Windows) / WKWebView (macOS) /         │   │
│  │ WebKitGTK (Linux)                                │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  React Application                                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Vite + React 18 + TypeScript                     │   │
│  │ Zustand stores for state management              │   │
│  │ Framer Motion for animations                     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Tauri IPC Bridge                                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ invoke() for commands                            │   │
│  │ Channel for streaming events                     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Rust Backend                                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ All data operations go through Rust commands     │   │
│  │ No direct database access from frontend          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Messages Not Appearing

### Symptoms
- Sent messages do not appear in the chat view
- Other users' messages are not visible
- Old messages appear but new ones do not
- Message appears briefly then disappears

### Causes and Solutions

**Filter/scroll position:**
The chat view may be scrolled to a position that hides new messages.
- Solution: Scroll to the bottom of the chat. Click the "Jump to bottom" button if available.

**Channel selection issue:**
You may be viewing a different channel than expected.
- Solution: Verify the active channel is highlighted in the channel list.

**Rendering error in virtual list:**
Libern uses virtual scrolling for performance. A rendering bug may cause messages to not display.
- Solution: Scroll up and down to trigger re-rendering. Switch channels and switch back.

**Database query issue:**
The UI may be failing to load messages from the database.
- Solution: Check the database integrity. Restart Libern.

### Debugging Steps

1. Open Developer Tools: Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (macOS)
2. Check the Console tab for error messages
3. Look for errors related to database queries, virtual list rendering, or message formatting

---

## 3. Channel List Empty

### Symptoms
- The channel sidebar shows no channels
- Expected channels are missing from the list

### Causes and Solutions

**Server not fully loaded:**
The server list may not have finished loading.
- Solution: Wait a few seconds. Restart Libern if the issue persists.

**Permission issue:**
Your role may not have access to any visible channels.
- Solution: Contact the server administrator to verify your permissions.

**Filter applied:**
A channel filter or search may be active.
- Solution: Clear any search/filter in the channel list.

**Database corruption:**
The channel list data in the database may be corrupted.
- Solution: Run database integrity check: `libern --check-db`

---

## 4. Rendering Artifacts

### Visual Artifacts

**Symptoms:**
- Flickering or flashing UI elements
- Text rendering incorrectly
- Images not loading or showing as broken icons
- UI elements overlapping or positioned incorrectly

**General Solutions:**
1. **Refresh the view:** Ctrl+R or Cmd+R to force re-render
2. **Zoom reset:** Ctrl+0 or Cmd+0 to reset zoom level
3. **Clear cache:** Delete the Libern cache directory
4. **Disable hardware acceleration:** `libern --disable-gpu`
5. **Check for DPI/scaling issues**

### Font Issues

**Symptoms:**
- Text appears as boxes, question marks, or garbled characters
- Font is too small or too large
- Certain characters (emojis, special symbols) not rendering

**Solutions:**
1. Install recommended fonts (Noto Sans for Unicode support)
2. Install emoji font (Segoe UI Emoji on Windows, Apple Color Emoji on macOS)
3. Adjust font size in Settings > Appearance

---

## 5. Platform-Specific Issues

### Windows
- **Title bar rendering:** Some Windows themes may cause title bar issues. Use the default Windows theme.
- **Transparency effects:** Disable "Transparency effects" in Windows Settings if the UI has visual artifacts.
- **WebView2:** Ensure Microsoft Edge WebView2 Runtime is installed and updated.

### macOS
- **Menu bar:** The Libern menu bar may not appear on some macOS versions. Use keyboard shortcuts.
- **Full-screen mode:** Some users report rendering issues in full-screen mode. Use windowed mode.
- **Metal vs OpenGL:** macOS rendering may differ between Metal and OpenGL backends.

### Linux
- **Webview engine:** Libern uses WebKitGTK on Linux. Ensure it is up to date.
- **Wayland issues:** On Wayland, some rendering issues may occur. Use X11 as a workaround:
  ```bash
  GDK_BACKEND=x11 libern
  ```
- **XDG Shell:** If Freedesktop portal decorations are not available, window controls may not render correctly.

---

## 6. Quick Recovery Steps

1. Press Ctrl+R (Cmd+R) to refresh the UI
2. Switch to a different server/channel and switch back
3. Close and reopen Libern
4. Clear the application cache
5. Reset to default settings
6. Reinstall Libern (preserving the data directory)

---

## 7. UI Issues Troubleshooting Table

| Issue | Likely Cause | Quick Fix | Detailed Fix |
|-------|-------------|-----------|--------------|
| Blank screen | GPU/WebView issue | Ctrl+R | `--disable-gpu` flag |
| Messages missing | Scroll position | Scroll to bottom | Check DB integrity |
| Channel list empty | Permissions/loading | Wait/restart | Check server access |
| Fonts garbled | Missing fonts | Install fonts | Configure font settings |
| UI flickering | GPU acceleration | Disable GPU | Update GPU drivers |
| Input not working | Focus issue | Click elsewhere | Restart app |
| Theme not applying | Cache issue | Clear cache | Reset to default |
| Slow scrolling | Virtual list | Reduce history | Compact mode |
| Emoji not showing | Missing emoji font | Install emoji font | OS-specific solution |
| Wayland glitches (Linux) | Wayland compositor | Use X11 | `GDK_BACKEND=x11` |

---

## 8. WebView-Specific Issues

### Windows (WebView2)

**Symptoms:**
- Blank white screen on startup
- Slow page loading
- Missing web features

**Solutions:**
1. **Install/Update WebView2 Runtime:**
   - Download from https://developer.microsoft.com/en-us/microsoft-edge/webview2/
   - Or install via: `winget install Microsoft.Edge.WebView2Runtime`

2. **Clear WebView2 cache:**
   ```
   Remove-Item "$env:LOCALAPPDATA\com.libern.app\cache\*" -Recurse
   ```

3. **Repair WebView2:**
   - Open Settings > Apps > Microsoft Edge WebView2 Runtime > Modify > Repair

4. **Disable GPU in WebView:**
   ```
   set WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--disable-gpu
   libern.exe
   ```

### macOS (WKWebView)

**Symptoms:**
- Rendering glitches on macOS 14+
- Issues with full-screen mode
- Text rendering artifacts

**Solutions:**
1. **Update macOS:** WKWebView updates come with macOS updates
2. **Toggle hardware acceleration:**
   - Try launching with `LIBERN_DISABLE_GPU=1`
3. **Clear WKWebView cache:** Delete `~/Library/Caches/com.libern.app/`

### Linux (WebKitGTK)

**Symptoms:**
- Segfaults related to WebKit
- Missing UI elements
- Slow rendering

**Solutions:**
1. **Update WebKitGTK:**
   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt upgrade libwebkit2gtk-4.1-0

   # Fedora
   sudo dnf update webkit2gtk4.1

   # Arch
   sudo pacman -Syu webkit2gtk-4.1
   ```

2. **Use X11 backend:**
   ```bash
   GDK_BACKEND=x11 libern
   ```

3. **Disable GPU acceleration in WebKit:**
   ```bash
   LIBERN_DISABLE_WEBKIT_GPU=1 libern
   ```

---

## 9. Cache Management

### Cache Location

| Platform | Cache Directory |
|----------|----------------|
| Windows | `%LOCALAPPDATA%\com.libern.app\cache` |
| macOS | `~/Library/Caches/com.libern.app` |
| Linux | `~/.cache/com.libern.app` |

### Clearing Cache

**Via Libern:**
1. Open Settings > Advanced
2. Click "Clear Cache"
3. Restart Libern

**Manual:**
```bash
# Windows
Remove-Item "$env:LOCALAPPDATA\com.libern.app\cache\*" -Recurse -Force

# macOS
rm -rf ~/Library/Caches/com.libern.app/*

# Linux
rm -rf ~/.cache/com.libern.app/*
```

### Cache Size Management

Configure cache limits in settings:

```json
{
  "ui": {
    "cache_size_mb": 200,
    "message_cache_limit": 500,
    "image_cache_enabled": true,
    "image_cache_max_size_mb": 50,
    "avatar_cache_enabled": true
  }
}
```

---

## 10. Developer Tools

### Opening Developer Tools

| Platform | Shortcut |
|----------|----------|
| Windows/Linux | Ctrl+Shift+I |
| macOS | Cmd+Option+I |

### Developer Tools Console Commands

```javascript
// Check store state
window.__LIBERN_DEV__.store.getState()

// View messages
window.__LIBERN_DEV__.store.getState().messages

// Force refresh UI
window.location.reload()

// Check for errors
console.error('Manual check')

// Measure performance
performance.mark('start')
// ... do something ...
performance.measure('operation', 'start')
console.log(performance.getEntriesByType('measure'))
```

### Common Console Errors

| Error | Meaning |
|-------|---------|
| `Failed to load resource: net::ERR_CONNECTION_REFUSED` | Tauri command failed |
| `Uncaught TypeError: Cannot read properties of undefined` | Missing data in state |
| `WebSocket connection to 'ws://...' failed` | P2P connection issue |
| `ERROR: invoke 'command_name' failed with: ...` | Backend error |
| `React rendering error: ...` | Component rendering issue |

---

## 11. UI Refresh and Recovery

### Force Refresh Methods

| Method | Description |
|--------|-------------|
| Ctrl+R / Cmd+R | Force re-render of UI |
| Switch channel | Change selected channel |
| Switch server | Change selected server |
| Restart Libern | Full application restart |
| Clear cache | Remove corrupted cached data |
| Reset settings | Restore default configuration |

### When to Use Each Method

1. **Ctrl+R** — For minor rendering glitches
2. **Switch channel** — If one channel fails to render
3. **Restart** — For persistent issues after trying above
4. **Clear cache** — If UI has corrupted data
5. **Reset settings** — If configuration is corrupted
6. **Reinstall** — Last resort for unresolvable issues

---

## 12. UI Component Debugging

### Chat Components

| Component | File | Common Issues |
|-----------|------|---------------|
| MessageInput | `MessageInput.tsx` | Slash commands not showing, Enter key not sending |
| MessageList | `MessageList.tsx` | Messages not loading, scroll position issues |
| MessageContent | `MessageContent.tsx` | Markdown not rendering, code blocks broken |
| SlashCommands | `SlashCommands.tsx` | Popup not appearing, wrong commands shown |

### Layout Components

| Component | File | Common Issues |
|-----------|------|---------------|
| AppShell | `AppShell.tsx` | Layout broken, panels wrong size |
| ServerListSidebar | `ServerListSidebar.tsx` | Servers not showing, icons wrong |
| ChannelSidebar | `ChannelSidebar.tsx` | Channels missing, icons wrong |
| ChatArea | `ChatArea.tsx` | Empty area, wrong channel displayed |

### AI Components

| Component | File | Common Issues |
|-----------|------|---------------|
| LiberMessageBubble | `LiberMessageBubble.tsx` | Streaming not working, rating broken |
| ModelDownloadModal | `ModelDownloadModal.tsx` | Progress not updating, download fails |

### Debug Component State

```javascript
// In Developer Tools Console:

// Check which components are mounted
document.querySelectorAll('[data-component]').length

// Check store state
window.__LIBERN_DEV__.store.getState()

// Force a component re-render
// (switch channels and back)

// Check for React errors
// Look for red error messages in Console tab
```

---

## 13. CSS and Theming

### CSS Variables

Libern uses CSS custom properties for theming:

```css
:root {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-tertiary: #0f3460;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --accent: #e94560;
  --success: #4caf50;
  --warning: #ff9800;
  --error: #f44336;
  --border: #333;
  --radius: 8px;
  --font-family: 'Segoe UI', system-ui, sans-serif;
  --font-size: 14px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}
```

### Custom Themes

Users can create custom themes by providing a JSON file:

```json
{
  "name": "Dark Blue",
  "colors": {
    "bg-primary": "#0d1117",
    "bg-secondary": "#161b22",
    "text-primary": "#c9d1d9",
    "accent": "#58a6ff"
  }
}
```

### Theme File Location

```
Windows: %APPDATA%\com.libern.app\themes\
macOS: ~/Library/Application Support/com.libern.app/themes/
Linux: ~/.local/share/com.libern.app/themes/
```

---

## 14. Screen Resolution and Scaling

### Supported Resolutions

| Resolution | Aspect Ratio | Notes |
|------------|-------------|-------|
| 1280x720 | 16:9 | Minimum supported |
| 1366x768 | 16:9 | Common laptop |
| 1920x1080 | 16:9 | Full HD (recommended) |
| 2560x1440 | 16:9 | QHD |
| 3840x2160 | 16:9 | 4K UHD |
| 2560x1600 | 16:10 | MacBook Pro |
| 2736x1824 | 3:2 | Surface Book |

### DPI Scaling Issues

| Symptom | Solution |
|---------|----------|
| UI too small on high-DPI | Increase font size in Settings |
| UI too large on low-DPI | Decrease font size in Settings |
| Blurry text on 4K | Set DPI scaling to 100% in app settings |
| Elements overlapping | Reset zoom (Ctrl+0) |
| Cursor misaligned | Disable GPU acceleration |

### Override DPI Scaling

**Windows:**
1. Right-click Libern.exe > Properties > Compatibility
2. Change high DPI settings
3. Check "Override high DPI scaling behavior"
4. Select "Application" from dropdown

**macOS:**
- Get Info > Check "Open in Low Resolution"

**Linux:**
```bash
GDK_SCALE=2 libern    # 200% scaling
GDK_DPI_SCALE=1.5 libern  # 150% scaling
```

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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