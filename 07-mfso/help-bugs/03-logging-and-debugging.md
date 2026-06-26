<!--
     ▄▄▄   ▄▄▄  ▄▄▄  ▄▄▄▄▄▄▄▄              ▄▄▄▄      ▄▄▄▄     ▄▄▄     
    ██     ███  ███  ██▀▀▀▀▀▀            ▄█▀▀▀▀█    ██▀▀██      ██    
    ██     ████████  ██           ██     ██▄       ██    ██     ██    
    ██     ██ ██ ██  ███████   ▄▄▄██▄▄▄   ▀████▄   ██ ██ ██     ██    
  ▀▀█▄     ██ ▀▀ ██  ██        ▀▀▀██▀▀▀       ▀██  ██    ██     ▄█▀▀  
    ██     ██    ██  ██           ██     █▄▄▄▄▄█▀   ██▄▄██      ██    
    ██     ▀▀    ▀▀  ▀▀                   ▀▀▀▀▀      ▀▀▀▀       ██    
    ▀█▄▄                                                      ▄▄█▀    

MF+SO — Multi Factor+ Sign On
by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner
The Sovereign Identity & Authentication Vault
-->

# Logging & Debugging

> **Last Updated:** 2026-06-19
> **Category:** Troubleshooting

## Overview

MF+SO includes comprehensive logging and debugging capabilities to help troubleshoot issues. This guide explains how to enable logging, interpret log output, and use debug mode.

## Log Levels

| Level | Prefix | Description |
|---|---|---|
| ERROR | [ERR] | Critical errors that may affect functionality |
| WARN | [WRN] | Warning conditions that should be reviewed |
| INFO | [INF] | Normal operational messages |
| DEBUG | [DBG] | Detailed debugging information |
| TRACE | [TRC] | Extremely detailed tracing (use only when asked by support) |

## Enabling Logging

### Desktop (macOS / Windows / Linux)

#### Persistent configuration:
```yaml
# ~/.config/mfso/config.yaml (macOS/Linux)
# %APPDATA%/MF+SO/config.yaml (Windows)
logging:
  level: debug  # error, warn, info, debug, trace
  file: ~/.config/mfso/logs/mfso.log
  max_size: 50  # MB, rotates automatically
  max_files: 5  # number of rotated logs to keep
  components:
    sync: debug
    crypto: warn
    network: info
```

#### Command-line configuration:
```bash
# Set log level
mfso --log-level debug

# Set log level for specific component
mfso --log-level sync=debug,crypto=warn

# Enable trace logging (verbose!)
mfso --log-level trace
```

#### Runtime configuration:
```bash
# While MF+SO is running, change log level dynamically
mfso-admin debug set-log-level --level debug
mfso-admin debug set-log-level --component sync --level trace
```

### Mobile (iOS / Android)

#### Via Settings UI:
1. Open MF+SO
2. Settings > Advanced > Logging Level
3. Select: Error, Warn, Info, Debug, or Trace
4. Logs are written to `MF+SO/logs/` in the app's documents directory

#### Via Developer Menu:
1. Tap the MF+SO logo 5 times on the Settings screen
2. Developer menu appears
3. Enable "Verbose Logging"
4. Optionally enable "Network Logging"

## Log File Locations

### Desktop

| Platform | Default Log Location |
|---|---|
| macOS | `~/Library/Logs/MF+SO/mfso.log` |
| Windows | `%APPDATA%\MF+SO\logs\mfso.log` |
| Linux | `~/.config/mfso/logs/mfso.log` |

### Mobile

| Platform | Log Location | Access Method |
|---|---|---|
| iOS | Settings > Help > Export Logs | Via email, AirDrop, file share |
| Android | Settings > Help > Export Logs | Via share sheet, file manager |

### Enterprise Server

| Component | Log Location |
|---|---|
| Main application | `/var/log/mfso/mfso.log` |
| Audit engine (.aioss) | `/var/log/mfso/audit.log` |
| IdP (SAML/OIDC) | `/var/log/mfso/idp.log` |
| ZTNA | `/var/log/mfso/ztna.log` |
| API | `/var/log/mfso/api.log` |
| Sync | `/var/log/mfso/sync.log` |

## Reading Log Output

### Log Entry Format

```
[2026-06-19 14:30:00.123] [INF] [vault] Vault unlocked successfully (user: jdoe@company.com)
[2026-06-19 14:30:01.456] [DBG] [sync] Starting sync cycle (device: iPhone-15-Pro)
[2026-06-19 14:30:02.789] [DBG] [sync] Uploading 3 changed entries
[2026-06-19 14:30:03.012] [WRN] [network] High latency detected (2.3s) for sync.mfso.io
[2026-06-19 14:30:04.567] [INF] [sync] Sync completed (3 uploaded, 2 downloaded, 0 conflicts)
[2026-06-19 14:30:05.890] [ERR] [crypto] HMAC verification failed for entry abc123
```

### Log Component Breakdown

| Component | Logs | Useful For |
|---|---|---|
| `vault` | Vault open/close, lock/unlock, backup/restore | Vault access issues |
| `crypto` | Encryption, decryption, key derivation | Key errors, authentication failures |
| `sync` | Sync cycles, uploads, downloads, conflicts | Sync failures, slow sync |
| `network` | HTTP requests, responses, latency, DNS | Connectivity issues |
| `totp` | TOTP generation, time synchronization | Wrong codes, expired codes |
| `fido2` | FIDO2/WebAuthn registration, authentication | Passkey issues |
| `idp` | SAML/OIDC operations (Enterprise) | SSO failures |
| `ztna` | WireGuard/Tailscale operations (Enterprise) | Tunnel issues |
| `api` | API requests, responses (Enterprise) | API integration issues |
| `ui` | UI rendering, navigation | UI glitches, crashes |

## Debug Mode

### Enabling Debug Mode

**Desktop:**
```bash
mfso --debug
# Or
mfso-admin debug enable
```

**Mobile:**
Settings > Advanced > Debug Mode (tap 7 times on the version number)

**Enterprise:**
```bash
mfso-admin config set --key debug.enabled --value true
```

### Debug Mode Features

When debug mode is enabled:
1. **Additional menu items** — "Developer" menu appears in Settings
2. **Network inspector** — View all HTTP/WebSocket requests in real-time
3. **Key inspector** — View cryptographic key metadata (not the keys themselves)
4. **Database inspector** — Browse the local database contents
5. **Memory monitor** — View memory usage and allocation
6. **FPS counter** — UI frame rate display
7. **Performance graphs** — CPU, memory, network usage graphs

### Debug Commands (Desktop CLI)

```bash
# View current configuration
mfso-admin debug config

# Test database integrity
mfso-admin debug db-check

# Force sync
mfso-admin debug sync --force

# Clear sync state (re-sync from server)
mfso-admin debug sync --reset

# Test cryptography
mfso-admin debug crypto-test

# Generate diagnostic report
mfso-admin debug report --output ./diagnostic.zip

# Check network connectivity
mfso-admin debug network-test
```

## Exporting Logs

### User Export

1. Open MF+SO
2. Settings > Help > Export Logs
3. Choose export method:
   - Email: Sends logs as email attachment
   - File: Saves to device storage
   - Clipboard: Copies recent logs to clipboard
4. Share with support team

### Automated Export (Enterprise)

```bash
# Export logs from all nodes
mfso-admin logs export --all-nodes --output ./logs-export/

# Export with specific time range
mfso-admin logs export --since "2026-06-18" --until "2026-06-19"

# Export with filtering
mfso-admin logs export --level error --component sync
```

## Log Analysis

### Common Log Patterns

#### Pattern: Sync conflict
```
[WRN] [sync] Sync conflict detected for entry abc123
[WRN] [sync] Local version: modified 2026-06-19T12:00:00Z
[WRN] [sync] Remote version: modified 2026-06-19T12:00:05Z
[INF] [sync] Using last-writer-wins resolution (remote)
```

**Interpretation:** An entry was edited on two devices at nearly the same time. The newer version was kept.

**Action:** Check if the correct version was kept. If not, manually correct the entry.

#### Pattern: Authentication failure
```
[ERR] [crypto] HMAC-SHA1 verification failed
[ERR] [vault] Invalid master password attempt (attempt 3/10)
[WRN] [vault] Account lockout triggered for 5 minutes
```

**Interpretation:** Wrong master password was entered 3 times. Account is locked for 5 minutes.

**Action:** Wait 5 minutes, ensure correct master password. If password is forgotten, use recovery phrase.

#### Pattern: Network timeout
```
[WRN] [network] Request to sync.mfso.io timed out after 30s
[DBG] [network] DNS resolution for sync.mfso.io: 203.0.113.42
[DBG] [network] Connection established but no response received
```

**Interpretation:** The app can resolve DNS but cannot complete the TCP connection to the sync server.

**Action:** Check firewall/proxy settings. Verify corporate network allows outbound connections.

## Platform-Specific Debugging

### iOS

```bash
# View app logs in real-time (requires Mac)
sudo log stream --predicate 'subsystem == "io.mfso.app"'

# View crash reports
Settings > Privacy > Analytics & Improvements > Analytics Data > Search "MF+SO"

# Simulate low memory
Xcode > Product > Scheme > Edit Scheme > Diagnostics > Memory Management
```

### Android

```bash
# View app logs
adb logcat --pid=$(adb shell pidof -s io.mfso.app)

# Filter by log level
adb logcat *:WARN

# Capture to file
adb logcat -d -f /sdcard/mfso-logs.txt
```

### Desktop (macOS / Linux)

```bash
# Follow log file in real-time
tail -f ~/.config/mfso/logs/mfso.log

# Filter by component
tail -f ~/.config/mfso/logs/mfso.log | grep "\[sync\]"

# Filter by level
tail -f ~/.config/mfso/logs/mfso.log | grep "\[ERR\]"
```

### Desktop (Windows)

```powershell
# View recent logs
Get-Content "$env:APPDATA\MF+SO\logs\mfso.log" -Tail 100

# Follow log file
Get-Content "$env:APPDATA\MF+SO\logs\mfso.log" -Tail 10 -Wait

# Filter by component
Get-Content "$env:APPDATA\MF+SO\logs\mfso.log" | Select-String "\[sync\]"
```

## Enterprise Debugging

### Server-Side Debugging

```bash
# Enable debug logging on specific component
mfso-admin debug enable --component idp --level debug

# View real-time IdP logs
journalctl -u mfso-idp -f

# Generate support bundle
mfso-admin support-bundle --output /tmp/mfso-support.tar.gz

# Run diagnostic suite
mfso-admin diagnostics run --all
```

### Performance Profiling

```bash
# Generate CPU profile (30 seconds)
mfso-admin debug pprof cpu --duration 30

# Generate heap profile
mfso-admin debug pprof heap

# View in browser
mfso-admin debug pprof view --file /tmp/pprof.cpu.prof

# Run load test
mfso-admin benchmark auth --concurrency 100 --duration 60
```

## Security Notes

- Debug logs may contain sensitive information (account names, email addresses)
- Review logs before sharing to ensure no secrets are exposed
- Logs do NOT contain: master passwords, TOTP seeds, private keys, or session tokens
- Debug mode should be disabled when not actively troubleshooting
- Enterprise logs may contain PII; follow your organization's data handling policies

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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