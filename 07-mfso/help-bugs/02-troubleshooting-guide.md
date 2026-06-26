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

# Troubleshooting Guide

> **Last Updated:** 2026-06-19
> **Category:** Troubleshooting

## Systematic Troubleshooting by Symptom

This guide provides step-by-step troubleshooting for common MF+SO issues, organized by symptom.

## 1. App Won't Launch

### iOS / iPadOS
1. **Force quit and restart:** Swipe up from bottom → swipe MF+SO up to close → tap to reopen
2. **Restart device:** Hold power + volume → slide to power off → wait 30s → power on
3. **Update app:** App Store → Updates → MF+SO
4. **Reinstall:** Delete app → App Store → reinstall MF+SO → restore from backup
5. **Check storage:** Settings > General > iPhone Storage → ensure > 500 MB free

### Android
1. **Force stop:** Settings > Apps > MF+SO > Force Stop → reopen
2. **Clear cache:** Settings > Apps > MF+SO > Storage > Clear Cache
3. **Restart device:** Hold power → Restart
4. **Update app:** Play Store → My Apps → MF+SO
5. **Reinstall:** Uninstall → Play Store → reinstall → restore from backup

### Desktop (macOS / Windows / Linux)
1. **Check logs:** `~/.config/mfso/logs/` (or `%APPDATA%/MF+SO/logs/` on Windows)
2. **Terminate background processes:**
   - macOS: `killall mfso`
   - Windows: Task Manager → end MF+SO processes
   - Linux: `pkill mfso`
3. **Restart app:** Open from Applications menu or terminal
4. **Check dependencies (Linux):**
   ```bash
   ldd /usr/bin/mfso | grep "not found"
   sudo apt install -f
   ```
5. **Reinstall:** Download latest version from mfso.io/download

## 2. TOTP Codes Not Working

### Symptom: Code rejected by service

1. **Check clock sync:**
   - Ensure device time is set to automatic (network time)
   - TOTP codes depend on accurate time (±30 second tolerance)
   - Manual time/date changes break TOTP codes

2. **Check code freshness:**
   - Codes expire every 30 seconds
   - Try the next code (wait for refresh)
   - Some services have a small grace window (±1 code)

3. **Verify seed:**
   - Did you scan the QR code correctly?
   - Some services use SHA256 instead of default SHA1 for TOTP
   - Some services use 8-digit codes instead of 6-digit

4. **Check for duplicate:**
   - If you set up 2FA on another device earlier, the old seed may still be active
   - Disable and re-enable 2FA on the service to get a fresh seed

### Symptom: Wrong code displayed

1. **Check account type:**
   - Make sure it's set to TOTP (time-based), not HOTP (counter-based)
   - Some legacy services use HOTP

2. **Check algorithm:**
   - Default is SHA1
   - Some services require SHA256 or SHA512
   - Edit account → Advanced → Algorithm → select correct option

3. **Check digit count:**
   - Default is 6 digits
   - Some services use 7 or 8 digits
   - Edit account → Advanced → Digits → select correct count

### Symptom: Code expires too quickly

1. Default TOTP period is 30 seconds (RFC 6238 standard)
2. Some services use 60-second periods
3. Edit account → Advanced → Period → set to 30 or 60

## 3. Sync Not Working

### Basic Checks
- [ ] Both devices have internet connectivity
- [ ] Both devices are signed into the same MF+SO account
- [ ] Both devices are on MF+SO v2.5+ (same major version)
- [ ] Sync is enabled on both devices (Settings > Sync)
- [ ] Free tier: limited to 2 devices

### Step-by-Step

1. **Force sync:** Open MF+SO → pull down to refresh (mobile) or press Ctrl+R (desktop)
2. **Check sync status:** Settings > Sync > "Last synced: [time]"
3. **Re-authenticate:** Sign out and sign back in on both devices
4. **Check server status:** Visit status.mfso.io
5. **Firewall check:** Ensure `*.mfso.io:443` is accessible
6. **Proxy check:** If behind corporate proxy, configure in Settings > Network
7. **Logs:** Check sync logs: Settings > Help > Export Logs

### Sync Error Messages

| Error | Meaning | Solution |
|---|---|---|
| "Sync failed: Network error" | No internet or proxy issue | Check connection, configure proxy |
| "Sync failed: Authentication error" | Session expired | Sign out and sign back in |
| "Sync failed: Conflict" | Data conflict between devices | Accept resolved version, re-edit if needed |
| "Sync failed: Quota exceeded" | Free tier device limit reached | Upgrade to Premium or disconnect unused device |
| "Sync failed: Server error" | MF+SO server issue | Check status.mfso.io, try again later |

## 4. Backup and Restore Issues

### Backup Creation Fails

| Error | Solution |
|---|---|
| "Not enough storage" | Free up storage space on device |
| "Permission denied" | Grant file access permission in OS settings |
| "Encryption failed" | Ensure master password is correct |
| "Unknown error" | Check logs, retry with smaller backup |

### Restore Fails

1. **Backup format:** Ensure backup file is from a compatible MF+SO version
2. **Corrupted backup:** If backup file is corrupted, try an older backup
3. **Wrong passphrase:** The backup passphrase is NOT the master password—it's the passphrase set when creating the backup
4. **Version mismatch:** Backups from v2.4.x can restore to v2.5.x, but not the reverse

### Cloud Backup Issues (Premium)

1. **Cloud not connected:** Settings > Backup > Cloud Backup > Reconnect
2. **Cloud storage full:** Check your cloud storage quota
3. **Sync conflicts:** Disable cloud backup temporarily, re-enable after sync

## 5. Browser Extension Issues

### Extension Not Connecting

1. **Desktop app must be running:** Extension communicates with local desktop app
2. **Desktop app must be unlocked:** Locked app cannot respond to extension requests
3. **Check pairing:**
   - Extension icon shows status: green = connected, yellow = disconnected, red = error
   - Click extension → "Pair with Desktop App"
   - A pairing code will appear in the desktop app

4. **Restart both:**
   - Close browser, close desktop app
   - Open desktop app → unlock → open browser → check extension

5. **Browser-specific:**
   - Chrome: chrome://extensions → MF+SO → Enable
   - Firefox: about:addons → Extensions → MF+SO → Enable
   - Edge: edge://extensions → MF+SO → Enable
   - Safari: Safari > Settings > Extensions > MF+SO > Enable

### Extension Not Auto-Filling

1. **Check permissions:** Extension needs "Read and change data" permission on websites
2. **Check keyboard shortcut:** Windows: Ctrl+Shift+M, Mac: Cmd+Shift+M
3. **Right-click to fill:** Right-click in password field → MF+SO → Fill
4. **Click extension icon:** Click extension → select account → auto-fill

## 6. Performance Issues

### App is Slow

| Symptom | Likely Cause | Solution |
|---|---|---|
| Slow launch (30+ seconds) | Large vault (10K+ entries) | Lazy loading improves after initial load |
| Slow search | Index rebuilding | Wait for index rebuild (30-60s after launch) |
| Laggy scrolling | Memory pressure | Close other apps, restart MF+SO |
| High battery drain | Background sync | Reduce sync frequency in Settings |
| Desktop: high CPU | Software rendering | Enable GPU acceleration in Settings |

### Performance Optimization

1. **Reduce vault size:** Archive or delete unused accounts (Settings > Clean Up)
2. **Clear cache:** Settings > Advanced > Clear Cache
3. **Reduce sync frequency:** Settings > Sync > Sync Interval > Every 30 min
4. **Update app:** Latest versions include performance improvements
5. **Upgrade device:** Minimum: 4 GB RAM, SSD storage

## 7. Crash Recovery

### App Keeps Crashing

1. **Safe mode (mobile):** Hold down the app icon after launching → release when "Safe Mode" appears
2. **Clear data (Android):** Settings > Apps > MF+SO > Storage > Clear Data (backup first!)
3. **Reinstall:** Delete and reinstall the app
4. **Restore from backup:** After reinstall, restore from latest backup

### Data Recovery After Crash

If MF+SO crashes and your vault appears empty:
1. Don't panic — local vault data is usually recoverable
2. Do NOT uninstall the app (this may delete the vault)
3. Force close and restart the app 2-3 times
4. If still empty: Settings > Help > Recover Vault
5. Last resort: Restore from backup file

## 8. Enterprise Troubleshooting

### IdP Issues

| Issue | Check | Solution |
|---|---|---|
| Users can't log in | IdP configuration | Verify SAML/OIDC endpoints, certificates |
| Applications not receiving attributes | Claim mapping | Check attribute mapping, test with test tool |
| SSO loop | Cookie/session configuration | Clear browser cookies, check session duration |
| Certificate error | Expired certificate | Renew IdP signing certificate |

### ZTNA Issues

| Issue | Check | Solution |
|---|---|---|
| Can't establish tunnel | Firewall ports | Open UDP 51820 (WireGuard) |
| High latency | Hub placement | Check hub geographic proximity, add regional hubs |
| Device not connecting | Device posture | Check compliance score, verify attestation |
| Intermittent connection | NAT/firewall timeout | Reduce keepalive interval to 15s |

### Sync Issues in Enterprise

1. Check Redis cluster health: `mfso-admin redis health`
2. Check PostgreSQL replication: `mfso-admin database replication status`
3. Check sync queue: `mfso-admin sync queue depth`
4. Verify all nodes on same version: `mfso-admin cluster nodes`

## 9. Still Having Issues?

1. **Search GitHub Issues:** https://github.com/mfso/mfso/issues
2. **Check our Help Center:** https://help.mfso.io
3. **Join our Discord:** https://discord.gg/mfso
4. **Contact Support:**
   - Free tier: GitHub Issues
   - Premium: support@mfso.io
   - Enterprise: enterprise portal
5. **Provide these details when reporting:**
   - MF+SO version (Settings > About)
   - Device model and OS version
   - Steps to reproduce the issue
   - Screenshots/screen recording
   - Debug logs (Settings > Help > Export Logs)

## Platform-Specific Troubleshooting Details

### iOS Specific Issues

**App crashes on launch (iOS 17.4+):**
1. Check if the crash is specific to your device model
2. Try reinstalling the app
3. If using TestFlight version, try the App Store version instead
4. File a report with the crash log:
   - Settings > Privacy & Security > Analytics & Improvements > Analytics Data
   - Find the latest MF+SO crash log (sort by date)
   - Share the crash log with our support team

**Widget not updating:**
1. Ensure iOS is 17.0+
2. Remove widget from home screen and add it again
3. Open MF+SO at least once after adding the widget
4. Widgets update every 15 minutes with new codes
5. For real-time updates, use the app directly

**Auto-fill not working on websites:**
1. Go to Settings > Passwords > AutoFill Passwords
2. Ensure MF+SO is selected as an auto-fill provider
3. If multiple providers are selected, try selecting only MF+SO
4. Restart Safari after changing settings
5. Some websites use custom input fields that may not be detected

### Android Specific Issues

**App uses too much battery:**
1. Settings > Apps > MF+SO > Battery > Battery optimization > Don't optimize
2. Settings > Apps > MF+SO > Background restriction > Not restricted
3. Disable if not needed: Settings > Accounts > Auto-sync data
4. Latest versions (2.5+) have reduced battery usage by 40%

**Android Auto-fill not working:**
1. Settings > System > Languages & input > Advanced > Auto-fill service
2. Select MF+SO as the auto-fill service
3. Ensure MF+SO is NOT in "Sleep" or "Deep sleep" status (check in Battery settings)
4. On Samsung devices: Settings > Battery > App power management > Add MF+SO to "Unrestricted apps"
5. On Xiaomi devices: Settings > Apps > Manage apps > MF+SO > Battery saver > No restrictions

**App is force-closed by system:**
Many Android manufacturers aggressively close background apps:
1. **Samsung:** Settings > Battery > Background usage limits > Never sleeping apps > Add MF+SO
2. **Xiaomi:** Settings > Apps > Manage apps > MF+SO > Autostart > Enable
3. **Huawei:** Settings > Battery > Launch > MF+SO > Manage manually > Allow auto-launch, secondary launch, run in background
4. **OnePlus:** Settings > Battery > Battery optimization > MF+SO > Don't optimize
5. **Realme/Oppo:** Settings > Battery > Sleep standby optimization > Off

### Desktop Specific Issues (macOS)

**App icon bouncing but not opening:**
1. Right-click dock icon → Force Quit
2. Open Terminal: `killall mfso`
3. Reopen from Applications
4. If still stuck: `rm -rf ~/Library/Caches/io.mfso.app`

**Touch ID not working:**
1. Ensure Touch ID is set up in System Settings > Touch ID & Password
2. Ensure MF+SO is checked in the "Use Touch ID for:" list
3. If MacBook lid was closed and opened, Touch ID may need the password first
4. Reboot the Mac

**Menu bar icon missing:**
1. Ensure "Show in menu bar" is enabled: MF+SO > Preferences > General
2. If still missing: killall ControlCenter (restarts menu bar)
3. Check if MF+SO is running in Activity Monitor

### Desktop Specific Issues (Windows)

**App crashes on startup (Windows 10/11):**
1. Run as Administrator (right-click > Run as Administrator)
2. Disable antivirus temporarily to test if it's interfering
3. Install the latest Visual C++ Redistributable
4. Check Windows Event Viewer for details: Event Viewer > Windows Logs > Application
5. Reinstall the app

**Windows Hello not working:**
1. Ensure Windows Hello is set up: Settings > Accounts > Sign-in options > Windows Hello
2. Ensure TPM 2.0 is enabled in BIOS/UEFI
3. Run `mfso-admin diagnostics windows-hello` to test
4. If using a PIN, try using fingerprint or face instead

**System tray icon missing:**
1. Click the arrow (^) in the taskbar to show hidden icons
2. Drag MF+SO icon to the taskbar
3. If not there: Settings > Personalization > Taskbar > Select which icons appear on the taskbar > MF+SO > ON

### Desktop Specific Issues (Linux)

**App doesn't launch (missing dependencies):**
```bash
# Check for missing libraries
ldd /usr/bin/mfso | grep "not found"

# Install common dependencies
sudo apt install libgtk-4-1 libgraphene-1.0-0 libvulkan1

# On Fedora:
sudo dnf install gtk4-devel graphene-devel vulkan-loader
```

**Wayland rendering issues:**
```bash
# Force X11 backend if Wayland has issues
GDK_BACKEND=x11 mfso

# Or use software rendering (slower but reliable)
MFSO_RENDERER=software mfso

# For persistent configuration:
echo 'export GDK_BACKEND=x11' >> ~/.profile
```

**File picker crashes:**
This is a known GTK4 issue on some Linux distributions.
Workaround: Use the terminal command to import files:
```bash
mfso import --file /path/to/export.csv
```

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ