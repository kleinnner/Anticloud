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
Category: help-bugs | ID: LIB-HLP-006

────────────────────────────────────────────────────────────────

# Voice and Whiteboard Issues

## 1. Overview

Libern provides real-time voice chat and collaborative whiteboard features. These features rely on local hardware (microphone, speakers, GPU) and P2P connections for real-time data transmission. Because they operate on local device resources and direct P2P channels, issues can arise from hardware incompatibility, driver problems, permission settings, or network latency.

This guide covers:
1. No audio device detected
2. Microphone not working
3. Speakers/headphones not producing sound
4. Whiteboard canvas not loading
5. Whiteboard sync issues
6. Voice and whiteboard general performance

### Voice & Whiteboard Dependency Chain

```
Voice Chat                      Whiteboard
──────────                      ──────────
Microphone  ─► OS Permits ─►    WebGL       ─► GPU Drivers
Speakers    ─► OS Permits ─►    Canvas      ─► WebView
Opus Codec  ─► Audio Driver     CRDT Sync   ─► Network
P2P Stream  ─► Network          Stroke Data ─► SQLite
            ─► Firewall                      ─► .aioss
```

---

## 2. No Audio Device Detected

### Symptoms
- Voice chat controls are grayed out
- Error message: "No audio device found"
- The device selection dropdown is empty
- Clicking "Join Voice" does nothing

### Causes and Solutions

**No microphone or speaker connected:**
- Verify your microphone and speakers/headphones are physically connected
- Check if they appear in your OS sound settings
- Test with another application (Voice Recorder, Audacity, etc.)

**Driver issues:**
- Windows: Update audio drivers from Device Manager
- macOS: Audio drivers are built-in; check System Information > Audio
- Linux: Check your audio subsystem (ALSA, PulseAudio, PipeWire):
  ```
  pactl list short sources
  pactl list short sinks
  ```

**Permission denied:**
Libern needs permission to access your microphone:
- Windows: Settings > Privacy & Security > Microphone > Allow Libern
- macOS: System Settings > Privacy & Security > Microphone > Enable Libern
- Linux: Check with `pactl` or your desktop environment's privacy settings

---

## 3. Microphone Not Working

### Troubleshooting Steps

**Step 1: Test the microphone in the OS**
- Windows: Sound Settings > Input > Test Microphone
- macOS: System Settings > Sound > Input > Input Level
- Linux: `arecord -d 5 test.wav && aplay test.wav`

**Step 2: Check Libern voice settings**
- Open Settings > Voice
- Verify the correct input device is selected
- Adjust input volume/gain
- Check that push-to-talk or voice activity detection is configured correctly

**Step 3: Check P2P connection**
- Voice requires an active P2P connection
- Verify you are connected to the voice channel's server
- Check network status indicator

**Step 4: Check for application-specific mute**
- Ensure you are not muted in the voice channel
- Look for the mute icon in the voice channel UI
- Check if the server has muted you

### Microphone Troubleshooting Table

| Symptom | Likely Cause | Solution |
|---------|-------------|----------|
| Mic not detected | Not connected | Check physical connection |
| Mic detected, no audio | Permission denied | Grant mic permission |
| Audio too quiet | Low gain | Increase mic boost in OS |
| Audio distorted | Clipping | Reduce mic gain |
| Echo heard by others | Speakers vs headphones | Use headphones |
| Robotic sound | Packet loss | Check network, enable FEC |
| Others can't hear me | Muted | Check mute button |
| Intermittent audio | Wi-Fi interference | Use Ethernet |

---

## 4. Whiteboard Canvas Not Loading

### Symptoms
- Whiteboard area shows a blank or gray screen
- Loading spinner that never completes
- Error message: "Canvas failed to initialize"
- Whiteboard controls are visible but the drawing area is empty

### Causes and Solutions

**WebGL not supported:**
The whiteboard requires WebGL for rendering.
- Check WebGL support: `libern --check-webgl`
- Update GPU drivers
- Enable WebGL in browser/OS settings if disabled

**GPU driver issues:**
- Update to the latest GPU driver
- Try disabling GPU acceleration: `libern --disable-gpu`
- On Linux, ensure Mesa/Vulkan drivers are installed:
  ```
  sudo apt install mesa-utils vulkan-utils
  ```

**Canvas size limit:**
Very large whiteboards may exceed canvas size limits:
- Reduce the canvas area
- Clear unused elements from the whiteboard
- Zoom in to reduce the visible canvas area

---

## 5. Whiteboard Sync Issues

### Symptoms
- Drawing elements appear/disappear randomly
- Other users see different content than you
- Elements are in wrong positions on different peers

### Causes and Solutions

**CRDT sync delay:**
Whiteboard changes are synced via CRDT, which may have latency:
- Wait for synchronization to complete
- Check peer connection quality
- Reduce drawing frequency

**Conflicting edits:**
When two users edit the same element simultaneously:
- CRDT will merge changes, but the result may not match either user's intent
- Communicate with collaborators to avoid simultaneous edits on same objects

**Large whiteboard data:**
Very large whiteboards may cause sync lag:
- Archive old whiteboard content
- Split the whiteboard into multiple boards

---

## 6. Voice Performance Issues

### High Latency

**Symptoms:**
- Noticeable delay between speaking and hearing
- Conversation feels unnatural due to lag

**Solutions:**
1. **Network quality:** Check latency to peers (target: < 50ms for good quality)
2. **Bandwidth:** Voice requires ~64-128 kbps per stream
3. **Jitter buffer:** Lower = less latency, more packet loss; Higher = more latency, fewer dropouts
4. **Codec quality:** Lower quality reduces bandwidth

### Packet Loss / Dropouts

**Symptoms:**
- Audio cuts in and out
- Words are missing or garbled
- Robotic or distorted sound

**Solutions:**
1. Increase jitter buffer in voice settings
2. Enable forward error correction (FEC)
3. Reduce network congestion
4. Use wired Ethernet instead of Wi-Fi

---

## 7. Diagnostic Tools

### Voice Diagnostic
```
libern --voice-diagnostics
```
Tests:
- Audio device enumeration
- Microphone capture
- Speaker playback
- Opus codec initialization
- Network latency measurement

### Whiteboard Diagnostic
```
libern --whiteboard-diagnostics
```
Tests:
- WebGL support and version
- Canvas rendering performance
- Memory usage
- CRDT sync status

### Network Voice Test
```
libern --voice-test <peer_address>
```
Measures:
- Round-trip latency
- Packet loss percentage
- Jitter
- Bandwidth utilization

---

## 8. Voice & Whiteboard Quick Reference

| Problem | Quick Check | Solution |
|---------|------------|----------|
| No audio device | OS sound settings | Check connections, drivers |
| Mic not working | Permissions | Grant mic access |
| Whiteboard blank | `--check-webgl` | Update GPU drivers |
| Drawing not syncing | Peer connections | Wait for CRDT sync |
| Voice latency | Ping peers | Use Ethernet |
| Audio dropouts | Network quality | Enable FEC |
| Canvas slow | GPU usage | Reduce resolution |
| Sync conflicts | Simultaneous edits | Coordinate with team |

---

## 9. Audio Device Troubleshooting by Platform

### Windows

**No microphone detected:**
1. Check Sound Settings > Input > Choose your input device
2. Ensure microphone is not disabled in Device Manager
3. Update audio drivers from manufacturer's website
4. Test with another app (Voice Recorder)

**Microphone permission:**
1. Settings > Privacy & Security > Microphone
2. Ensure "Microphone access" is ON
3. Ensure Libern is in the allowed list

**Audio enhancements causing issues:**
1. Right-click speaker icon > Sound > Playback tab
2. Select your device > Properties > Advanced
3. Disable "Enable audio enhancements"

**Exclusive mode conflicts:**
1. Sound Control Panel > Device > Properties > Advanced
2. Uncheck "Allow applications to take exclusive control"

### macOS

**Microphone permission:**
1. System Settings > Privacy & Security > Microphone
2. Toggle Libern to ON
3. If prompted repeatedly, restart the app

**Core Audio restart:**
```bash
sudo killall coreaudiod
```

**Check audio devices:**
```bash
system_profiler SPAudioDataType
```

### Linux

**Audio system check:**
```bash
# Check PulseAudio
pactl info
pactl list short sources
pactl list short sinks

# Check PipeWire
pw-cli list-objects | grep -i node

# Test microphone
arecord -d 5 test.wav && aplay test.wav
```

**Permission issues:**
```bash
# Add user to audio group
sudo usermod -a -G audio $USER

# Restart audio service
systemctl --user restart pipewire
# or
pulseaudio -k && pulseaudio --start
```

---

## 10. Whiteboard Canvas Performance Optimization

### Reduce Canvas Load

| Setting | Effect | Performance Impact |
|---------|--------|-------------------|
| Reduce resolution (50%) | Lower quality | High improvement |
| Disable shadows | Less rendering | Medium improvement |
| Reduce undo history | Less memory | Medium improvement |
| Limit visible layers | Fewer elements | Low improvement |
| Archive old strokes | Fewer total strokes | High improvement |

### Performance Settings

```json
{
  "whiteboard": {
    "canvas_resolution": 0.5,
    "enable_shadows": false,
    "undo_history_size": 50,
    "max_visible_layers": 10,
    "gpu_acceleration": true,
    "vsync": true,
    "antialiasing": false
  }
}
```

### When to Optimize

| Symptom | Action |
|---------|--------|
| Drawing lags >100ms behind cursor | Reduce resolution to 0.5 |
| Pan/zoom is janky | Disable shadows |
| Memory >500 MB for whiteboard | Reduce undo history |
| CRDT sync takes >5 seconds | Archive old strokes |
| GPU usage >90% | Disable antialiasing |

---

## 11. Voice Codec and Quality

### Opus Codec Settings

| Quality | Bitrate | Sample Rate | Use Case |
|---------|---------|-------------|----------|
| Very Low | 16 kbps | 8 kHz | Extremely low bandwidth |
| Low | 32 kbps | 16 kHz | Minimal bandwidth |
| Balanced | 64 kbps | 24 kHz | Default |
| High | 96 kbps | 48 kHz | Good quality |
| Very High | 128 kbps | 48 kHz | Music/audio |

### Network Requirements by Quality

| Quality | Bandwidth | Max Jitter | Packet Loss Tolerance |
|---------|----------|------------|-----------------------|
| Very Low | 16 kbps | 200 ms | 20% |
| Low | 32 kbps | 150 ms | 15% |
| Balanced | 64 kbps | 100 ms | 10% |
| High | 96 kbps | 80 ms | 5% |
| Very High | 128 kbps | 50 ms | 3% |

### Forward Error Correction (FEC)

FEC adds redundant data to recover from packet loss:
- **Enabled**: +20% bandwidth, +10% packet loss recovery
- **Disabled**: Normal bandwidth, no recovery

Enable FEC when:
- Packet loss > 5%
- Wi-Fi connection
- Congested network

---

## 12. Advanced Diagnostic Commands

### Voice Diagnostics

```bash
# Full voice system diagnostic
libern --voice-diagnostics

# Test with specific peer
libern --voice-test 192.168.1.100

# Audio device list
libern --list-audio-devices

# Audio loopback test
libern --audio-loopback
```

### Whiteboard Diagnostics

```bash
# Full whiteboard diagnostic
libern --whiteboard-diagnostics

# WebGL capabilities
libern --check-webgl

# Canvas stress test
libern --whiteboard-stress-test

# CRDT sync status
libern --crdt-status
```

────────────────────────────────────────────────────────────────

---

## 13. Platform-Specific Audio Fixes

### Windows Audio Stack

```
Audio Path:
Application → Windows Audio Session API (WASAPI)
           → Audio Engine (mixer, APO)
           → Audio Driver
           → Hardware (speaker/mic)

Troubleshooting levels:
1. Check app volume in Volume Mixer
2. Check default device in Sound Settings
3. Check driver in Device Manager
4. Check APO (Audio Processing Objects)
5. Disable audio enhancements
```

**Quick fixes for Windows audio:**
```powershell
# Restart audio service
net stop audiosrv && net start audiosrv

# Restart Windows Audio Endpoint Builder
net stop AudioEndpointBuilder && net start AudioEndpointBuilder
```

### macOS Audio Stack

```
Audio Path:
Application → Core Audio
           → Audio Driver (built-in)
           → Hardware

Troubleshooting:
1. Restart Core Audio: sudo killall coreaudiod
2. Reset NVRAM (Intel Macs): restart + Cmd+Option+P+R
```

### Linux Audio Stack

```
Audio Path (modern):
Application → PipeWire → ALSA → Hardware

Connectivity check:
pactl info                    # Is PulseAudio running?
pactl list short sources      # List input devices
pactl list short sinks        # List output devices

Permission fix:
sudo usermod -a -G audio $USER  # Add user to audio group
```

---

## 14. Tested External Hardware

### Microphones

| Microphone | Type | Works? | Notes |
|-----------|------|--------|-------|
| Blue Yeti | USB | ✅ Yes | Stereo mode |
| Blue Snowball | USB | ✅ Yes | May need gain adj. |
| Rode NT-USB | USB | ✅ Yes | Good quality |
| Samson Q2U | USB/XLR | ✅ Yes | USB mode works |
| Built-in laptop mic | Internal | ⚠️ Varies | Often low quality |
| Gaming headset | USB | ✅ Yes | Most work well |

### Speakers/Headphones

| Device | Type | Works? | Notes |
|--------|------|--------|-------|
| Wired headphone | 3.5mm | ✅ Yes | Best for voice |
| Bluetooth headset | BT | ⚠️ Varies | May have echo |
| USB headset | USB | ✅ Yes | Most work |
| Laptop speakers | Built-in | ✅ Yes | Echo risk |

---

## 15. Voice Quality Troubleshooting

### "I can hear others but they can't hear me"

1. Check mute button — Is mic icon muted?
2. Check OS permissions — Microphone access granted?
3. Check input device — Correct mic selected?
4. Check P2P connection — Connected to voice channel?

### "Others can hear me but I can't hear them"

1. Check output device — Correct speakers selected?
2. Check volume slider — Turned up?
3. Check deafen status
4. Check OS volume mixer

### "Audio is robotic or cuts out"

1. Check network quality — Packet loss?
2. Enable FEC — Forward Error Correction
3. Reduce audio quality — Lower bitrate
4. Use Ethernet instead of Wi-Fi

### "Echo or feedback"

1. Use headphones instead of speakers
2. Lower speaker volume
3. Enable echo cancellation
4. Move mic away from speakers

---

## 16. Whiteboard Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Canvas failed to initialize" | WebGL unavailable | Update GPU drivers |
| "WebGL not supported" | Browser/OS issue | Run `--check-webgl` |
| "Failed to render stroke" | Invalid stroke data | Clear and redraw |
| "Canvas size exceeds limit" | Too many elements | Archive content |
| "CRDT sync timeout" | Slow peer connection | Check network |
| "Layer limit exceeded" | Too many layers | Merge layers |
| "Undo history corrupted" | Memory issue | Clear undo history |

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

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
