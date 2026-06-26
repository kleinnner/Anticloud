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
Document ID: FAQ-009
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Troubleshooting FAQ

## Common Issues

### App won't start

**Possible causes:**
- Missing system dependencies (Linux: webkit2gtk, etc.)
- Corrupted install
- Antivirus blocking

**Solutions:**
1. Reinstall Libern.
2. On Linux: `sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev`
3. Check the console/terminal for error messages.
4. Add Libern to antivirus exclusions.

### Blank white screen

**Possible causes:**
- GPU driver issues
- WebView2 not installed (Windows)
- Corrupted web assets

**Solutions:**
1. Launch with `--disable-gpu` flag (pass in CLI).
2. On Windows, install/update Microsoft Edge WebView2 Runtime.
3. Clear the app data cache.
4. Reinstall Libern.

### "No server selected"

You haven't created or joined any servers yet.

**Solutions:**
1. Click the **+** button in the ServerListSidebar to create a server.
2. If you have an invite code, use the join functionality.
3. Check that the onboarding completed successfully.

### Identity not found (repeated onboarding)

The local user record was not found in the database.

**Solutions:**
1. Check that the app data directory exists.
2. Look for `libern.db` in the app data directory.
3. If the database is corrupted, delete it and restart Libern (this will trigger onboarding).

### AI not responding

**Possible causes:**
- Model not downloaded.
- MockEngine is active.
- Engine initialization failed.

**Solutions:**
1. Check AI status: `/status` or `await getAiStatus()`.
2. Download the AI model via the ModelDownloadModal.
3. Check that the model file exists in `{app_data}/models/`.
4. Check that llama-cli binary exists in the app's binaries directory.
5. Review the console output for engine initialization errors:
   ```
   "Liber: Failed to load Qwen (...), using MockEngine"
   "Liber: Using MockEngine"
   ```

### Slash commands not working

**Possible causes:**
- Typo in command name
- The command requires arguments

**Solutions:**
1. Type `/` and wait for the auto-complete popup to appear.
2. Check the command usage in the popup.
3. Ensure you're in a text channel (slash commands don't work in voice/whiteboard channels).

### Peer discovery not finding anyone

**Possible causes:**
- Other Libern instances not running.
- Firewall blocking mDNS.
- Not on the same LAN subnet.

**Solutions:**
1. Ensure other Libern instances are running on the same LAN.
2. Check firewall settings — allow mDNS (port 5353) and WebSocket connections.
3. Verify all machines are on the same network subnet.
4. Check the `is_network_available` command: `await isNetworkAvailable()`.

### Database errors

**Possible causes:**
- Corrupted SQLite database.
- Disk full.
- Permission issues.

**Solutions:**
1. Run health diagnostics to check disk space.
2. If the database is corrupted, delete `libern.db` (this will reset all data).
3. Check file permissions on the app data directory.

### Crash on startup

**Possible causes:**
- Missing C++ runtime (Windows).
- Outdated operating system.
- Conflicting software.

**Solutions:**
1. Install Microsoft Visual C++ Redistributable (Windows).
2. Update your OS to a supported version.
3. Temporarily disable conflicting software (antivirus, GPU overlays).
4. Launch from command line to see error messages:
   ```
   libern.exe 2>&1
   ```

---

## Troubleshooting Quick Reference

| Issue | Quick Fix | Detailed Doc |
|-------|-----------|-------------|
| App not starting | Reinstall, check deps | HLP-001 |
| Blank screen | `--disable-gpu` flag | HLP-005 |
| AI not working | Download model | HLP-003 |
| No peers found | Check firewall, LAN | HLP-002 |
| Database errors | Run `check-db`, delete DB | HLP-004 |
| Voice not working | Check mic permissions | HLP-006 |
| Whiteboard not loading | Check WebGL support | HLP-006 |
| Slow performance | Disable AI, reduce history | HLP-007 |
| Slash commands not working | Type `/` for autocomplete | FAQ-007 |
| Can't send messages | Check channel permissions | TUT-003 |

---

## Crash Recovery

### Libern crashes while running

1. Restart Libern — it will re-open the database and recover any unsealed .aioss sessions.
2. The SQLite WAL (Write-Ahead Log) mode ensures crash recovery:
   ```sql
   PRAGMA journal_mode=WAL;
   ```
3. Unsealed .aioss sessions are preserved in memory and will be sealed on next launch.

### Database recovery

If the database is corrupted:
1. **Stop Libern** immediately.
2. Navigate to the app data directory.
3. **Backup**: Copy `libern.db` to a safe location.
4. **Repair**: Try `sqlite3 libern.db ".recover" | sqlite3 libern_repaired.db`
5. **Reset**: If repair fails, delete `libern.db` and restart Libern.

**Warning**: Resetting the database will lose all servers, channels, messages, and settings.

---

## Log Locations

### Tauri/Rust logs

Libern prints diagnostic information to stdout/stderr. To capture logs:

**Windows (PowerShell):**
```powershell
.\Libern.exe 2>&1 | Out-File -FilePath libern.log
```

**macOS/Linux:**
```bash
./libern 2>&1 | tee libern.log
```

### Console output includes:
- Database initialization status
- AI engine selection (MockEngine vs CandleEngine)
- AI model loading failures
- Tauri command errors
- Rust panic messages

### No debug log files

Libern does not write debug log files by default. This is intentional for privacy (no telemetry, no log uploads). Debug information is only visible in the terminal.

---

## Known Issues

### AI Model Download Fails

- **Download interrupted**: Retry the download. The temp file is deleted on failure.
- **Slow connection**: The model is ~1.1 GB. Ensure stable internet.
- **Download complete but file too small**: The downloader checks for minimum 1 GB. If the file is smaller, it's deleted and an error is returned.

### Slots/Blackjack Not Working

- Ensure you have sufficient XP balance (minimum 1000).
- The bet must be a positive integer.

### Marketplace Item Not Showing

- Check your visibility setting (public/server/private).
- Public items appear globally; server items only in the server they were published in.

---

## Getting Help

If you can't resolve the issue:

1. **Check the documentation**: All docs are in `docs/` directory.
2. **Search GitHub issues**: https://github.com/libern/libern/issues
3. **Open a new issue**: Include:
   - Libern version
   - Operating system and version
   - Steps to reproduce
   - Console output (if available)

### Debug Commands

| Command | Purpose |
|---------|---------|
| `libern --version` | Check version |
| `libern --check-db` | Verify database integrity |
| `libern --diagnose` | Full system diagnostic |
| `libern --ai-diagnostics` | AI engine diagnostic |
| `libern --voice-diagnostics` | Voice system diagnostic |
| `libern --performance-report` | Performance report |
| `libern --profile-startup` | Startup profiling |
| `libern --db-stats` | Database size and statistics |
| `libern --memory-stats` | Memory usage details |
| `libern --network-stats` | Network performance stats |
| `libern --ai-benchmark` | AI model benchmark |
| `libern --reset-config` | Reset configuration to defaults |
| `libern --migrate-db` | Force database migration |
| `libern --vacuum-db` | Compact and optimize database |

---

## Troubleshooting by Symptom

### Application Freezes

| Symptom | Likely Cause | Solution |
|---------|-------------|----------|
| App freezes for seconds | AI inference running | Wait or reduce max_tokens |
| App freezes on startup | Database migration | Run `--migrate-db` |
| App freezes when scrolling | Too many messages | Reduce loaded history |
| App freezes during sync | Large file transfer | Set file size limits |

### Feature-Specific Issues

| Feature | Issue | Solution |
|---------|-------|----------|
| Whiteboard | Canvas blank | Check WebGL, update drivers |
| Voice chat | No audio | Check mic permissions |
| Marketplace | Can't see items | Check visibility settings |
| Casino | Can't bet | Check balance > 0 |
| AI | Generic responses | Download real model |
| Search | No results | Check channel selection |
| Reactions | Can't add emoji | Check permissions |
| Starboard | No messages shown | Configure starboard settings |

### Platform-Specific Solutions

**Windows:**
- Install Microsoft Edge WebView2 Runtime
- Install Visual C++ Redistributable
- Disable "Transparency effects" for UI glitches

**macOS:**
- Right-click → Open to bypass Gatekeeper
- Grant microphone permission in System Settings
- On Apple Silicon, use ARM64 build

**Linux:**
- Install WebKit2GTK: `sudo apt install libwebkit2gtk-4.1-dev`
- Use X11 backend: `GDK_BACKEND=x11 libern`
- Install FUSE for AppImage: `sudo apt install fuse libfuse2`

---

## Error Log Interpretation

### Common Log Messages

```
[INFO] Database initialized at /path/to/libern.db
    → Normal: Database loaded successfully

[INFO] Liber: Using MockEngine
    → AI model not found, using fallback

[INFO] Liber: Loaded Qwen 2.5 1.5B Instruct
    → AI model loaded successfully

[WARN] No peers discovered via mDNS
    → No other Libern instances on network

[ERROR] Failed to open database: database disk image is malformed
    → Database corruption detected

[ERROR] Connection refused: 192.168.1.100:42069
    → Peer not reachable, check firewall

[ERROR] AI engine not initialized
    → Model load failed, check model file

[PANIC] thread 'main' panicked at '...'
    → Rust panic, report as bug with full trace
```

---

## Diagnostic Report Format

When opening a GitHub issue, include the output of:

```bash
# Full diagnostic
libern --diagnose

# Output includes:
# === Libern Diagnostic Report ===
# Version: 1.0.0
# OS: Windows 11 Pro (10.0.22631)
# CPU: Intel i7-13700K (16 cores)
# RAM: 32 GB (24 GB free)
# GPU: NVIDIA RTX 4070 (12 GB)
# Storage: SSD (500 GB free)
# Database: 15 MB, OK
# AI Model: Loaded (Qwen 2.5 1.5B)
# Network: LAN connected, 2 peers
# .aioss: 3 sessions, 156 entries, verified OK
# === End Report ===
```

---

## Quick Troubleshooting Flowchart

```
Having an issue?
    │
    ├── App won't start?
    │   ├── Reinstall → Works? Done.
    │   └── Still broken → Check deps, logs, GitHub issues
    │
    ├── Feature not working?
    │   ├── Check if feature requires internet
    │   ├── Check if feature requires permissions
    │   ├── Check settings/configuration
    │   └── Restart app
    │
    ├── Can't connect to peers?
    │   ├── Are you on same network?
    │   ├── Firewall blocking ports?
    │   ├── mDNS enabled on network?
    │   └── Try direct IP connection
    │
    ├── AI issues?
    │   ├── Model downloaded?
    │   ├── Engine initialized?
    │   └── Hardware sufficient?
    │
    └── Still stuck?
        └── Collect diagnostic report → Open GitHub issue
```

---

## Troubleshooting Common Error Messages

### "database disk image is malformed"

**Cause:** SQLite database corruption
**Solution:**
1. Stop Libern immediately
2. Backup `libern.db`
3. Run recovery: `sqlite3 libern.db ".recover" | sqlite3 libern_repaired.db`
4. Replace database if recovery succeeded

### "Connection refused"

**Cause:** Target peer not running or firewall blocking
**Solution:**
1. Verify Libern is running on target machine
2. Check firewall settings (TCP 42069)
3. Test connectivity: `nc -zv <ip> 42069`

### "AI: MockEngine"

**Cause:** AI model not loaded
**Solution:**
1. Download model via Settings > AI
2. Check model exists at `{app_data}/models/`
3. Check llama-cli binary exists

### "No peers discovered"

**Cause:** mDNS not working or different network
**Solution:**
1. Verify both machines on same network/subnet
2. Check firewall allows UDP 5353
3. Try direct IP connection

### "WebSocket handshake failed"

**Cause:** Incompatible versions or proxy interference
**Solution:**
1. Ensure both peers on same Libern version
2. Check proxy settings
3. Disable VPN temporarily

---

## Error Recovery Procedures

### Application Crash

```
1. Note what you were doing when crash occurred
2. Capture console output if possible
3. Restart Libern
4. Check if data is intact
5. Report crash with details
```

### Data Loss

```
1. Check if .aioss exports exist
2. Check if peers have data via CRDT
3. Recover from backup
4. If no backup exists, data may be lost
```

### Configuration Corruption

```
1. Reset configuration: libern --reset-config
2. Settings reset to defaults
3. Data preserved
4. Reconfigure preferences
```

---

## Frequently Reported Issues

| Issue Reports | Status | Known Workaround |
|---------------|--------|-----------------|
| AI model download fails on slow connections | Open | Download manually from Hugging Face |
| Whiteboard lags on integrated GPUs | Open | Reduce canvas resolution |
| mDNS not working on enterprise Wi-Fi | By design | Use direct IP connections |
| Voice echo on speakerphone | Open | Use headphones |
| High memory usage with many servers | Open | Leave unused servers |
| Unicode characters in chat garbled on some fonts | Open | Install Noto Sans font |
| Whiteboard doesn't load on integrated GPUs | Open | Reduce canvas resolution |
| .aioss export fails on large sessions | Open | Reduce seal interval |

---

## File an Issue Template

When opening a GitHub issue, use this template:

```markdown
**Libern Version:** [e.g., 1.0.0]
**OS:** [e.g., Windows 11, macOS 14.5, Ubuntu 24.04]
**Hardware:** CPU, RAM, GPU, Storage type

**Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1. Open Libern
2. Go to ...
3. Click ...
4. See error

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Logs/Diagnostics:**
```
[Output of libern --diagnose or relevant logs]
```

**Screenshots:**
[If applicable]
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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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