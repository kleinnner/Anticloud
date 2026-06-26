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

# Troubleshooting FAQ

> **Last Updated:** 2026-06-19
> **Category:** Troubleshooting

## Camera not working for QR code scanning

### Common causes and solutions:

**Permission denied:**
- iOS: Settings > MF+SO > Camera > Enable
- Android: Settings > Apps > MF+SO > Permissions > Camera > Allow
- Desktop: Check OS privacy settings for camera access

**Camera not detected:**
- Ensure no other app is using the camera
- Restart the app
- Restart your device
- On desktop: Test camera with another app to verify it works

**QR code not scanning:**
- Ensure good lighting
- Hold steady, 15-20 cm from the code
- Clean the camera lens
- Try the manual entry option instead

**Alternative: Manual entry**
If scanning fails, you can typically add the account by entering the secret key manually:
1. On the service's 2FA setup page, click "Can't scan QR code?" or "Manual entry"
2. Copy the secret key
3. In MF+SO, tap Add Account > Manual Entry
4. Paste the secret key

## Sync not working between devices

### Common causes and solutions:

**Sync not enabled:**
- Verify sync is enabled in Settings > Sync
- Ensure you are signed in to the same MF+SO account on all devices
- Free tier: Limited to 2 devices

**Network issues:**
- Check internet connectivity on both devices
- Check if MF+SO servers are accessible (status.mfso.io)
- Corporate firewall may block sync; check with IT

**Stale sync:**
- Pull-to-refresh on the device list
- Reinstall MF+SO on the problematic device
- Sign out and sign back in

**Conflict errors:**
- If you see "sync conflict" messages, ensure you are running the same version on all devices
- Conflicts are resolved automatically, but you may need to accept the resolution

**Sync troubleshooting checklist:**
1. Are both devices on the same app version?
2. Are both devices signed into the same account?
3. Is sync enabled on both devices?
4. Is there an internet connection on both devices?
5. Have you tried restarting the app?

## Installation errors

### iOS installation issues:

**"App not available" or "Cannot connect to App Store":**
- Check your internet connection
- Sign out and sign back into the App Store
- Ensure your device meets minimum requirements (iOS 16+)

**"App cannot be installed" — general:**
- Restart your device
- Go to Settings > General > iPhone Storage > Check for available space
- Delete and re-download the app

### Android installation issues:

**"App not compatible with your device":**
- Ensure Android 12+ (API 31+)
- Device must have 4 GB+ RAM
- Check if your device has hardware-backed keystore support

**"Installation failed" — general:**
- Clear Play Store cache: Settings > Apps > Google Play Store > Storage > Clear Cache
- Ensure sufficient storage space (500 MB+)
- Disable any package installer blockers
- Restart device

### Desktop installation issues:

**Linux:**
```
# If dpkg fails, try fixing dependencies:
sudo apt --fix-broken install

# Flatpak version:
flatpak install flathub io.mfso.MFSO

# AppImage:
chmod +x MF+SO-*.AppImage
./MF+SO-*.AppImage
```

**Windows:**
- Run installer as administrator
- Disable antivirus temporarily during installation
- Ensure Windows 10 22H2+ or Windows 11
- Install Visual C++ Redistributable if prompted

**macOS:**
- Drag app to Applications folder
- If "unidentified developer" warning: System Settings > Privacy & Security > Open Anyway
- Ensure macOS 13+ (Ventura) or newer

## TOTP codes not working

### Common causes:

**Time synchronization:**
- Ensure your device clock is set to automatic network time
- Manual time/date changes can break TOTP codes
- Syncing to NTP server can help

**Wrong seed:**
- Verify you entered the correct secret key
- Some services use different algorithms (SHA256 vs SHA1)
- Check if the service uses TOTP (time-based) or HOTP (counter-based)

**Code expired:**
- Codes refresh every 30 seconds
- Try the code that appears after the current one
- Some services allow a 30-second grace period

**Account already used:**
- If you previously set up 2FA with another app, the old seed may still be active
- Reset 2FA on the service and set up fresh with MF+SO

## App crashes or freezes

### Initial troubleshooting:

1. **Restart the app** — Force close and reopen
2. **Restart your device** — Full restart clears memory issues
3. **Update the app** — Check for latest version
4. **Check storage** — Ensure sufficient free storage space
5. **Reinstall** — Backup first, then reinstall

### Crash reporting:

If crashes persist:
- Enable crash reporting: Settings > Privacy > Share Crash Reports
- Submit a report via: Settings > Help > Report Issue
- Include in your report:
  - App version (Settings > About)
  - Device model and OS version
  - Steps to reproduce the crash
  - Screenshots or screen recording

## Browser extension not connecting

### Common causes:

**Extension not paired:**
- Desktop app must be running and unlocked
- Pairing: Extensions > MF+SO > Pair with Desktop App
- Check that both are on the same network

**Connection issues:**
- Restart both the desktop app and browser
- Re-install the browser extension
- Check for other security extensions that may block IPC connections

**Platform-specific:**
- Chrome/Brave: Ensure native messaging host is installed
- Firefox: Check permissions in about:addons
- Edge: Reset extension settings
- Safari: Enable extension in Safari > Settings > Extensions

## Push authentication not working

### Troubleshooting steps:

1. **Check notification permissions:**
   - iOS: Settings > MF+SO > Notifications > Allow
   - Android: Settings > Apps > MF+SO > Notifications > Allow

2. **Check device registration:**
   - Verify device appears in MF+SO account settings
   - Re-register the device if missing

3. **Check network:**
   - Push notifications require internet connectivity
   - Corporate firewalls may block Google/iOS push services
   - VPN can sometimes interfere with push

4. **Enterprise only:**
   - Verify IdP is correctly configured for push authentication
   - Check admin console for push notification settings
   - Ensure push certificates are valid (APNs/FCM)

## Backup and restore issues

### Backup creation fails:

- Ensure sufficient storage space
- Check write permissions to backup location
- Try different backup location (local vs cloud)
- Ensure app is fully unlocked

### Restore fails:

- Verify backup file is not corrupted
- Ensure correct passphrase is used
- Check backup file format is compatible with current app version
- Try restoring on the same device/OS version first

### Cloud backup issues (Premium):

- Check cloud service connection settings
- Re-authenticate with cloud provider
- Check cloud storage quota

## General performance issues

### App is slow:

- **Large vault** — Consider organizing accounts into groups
- **Old device** — Performance is optimized for current-gen devices
- **Too many apps open** — Close other apps to free memory
- **Corrupted cache** — Clear app cache (Settings > Advanced > Clear Cache)
- **Update needed** — Check for app updates

### TOTP code display lag:

- Codes should appear immediately after generation
- If lagging: restart the app
- Large number of concurrent codes may cause delay on older devices
- This is a known issue affecting devices with less than 4 GB RAM

## Enterprise troubleshooting

### IdP integration issues:

- Verify SAML/OIDC metadata is correctly configured
- Check certificate validity and expiry dates
- Ensure correct entity IDs and ACS URLs
- Enable debug logging: mfso-admin config set logging.level trace

### ZTNA connection issues:

- Verify WireGuard ports are open (UDP 51820)
- Check NAT traversal configuration
- Verify device posture score meets minimum requirements
- Check peer connectivity matrix: mfso-admin ztna peer-graph

### Sync delays in Enterprise:

- Check Redis cluster health
- Verify PostgreSQL replication status
- Monitor sync queue depth
- Ensure all nodes are running same version

## QR Code Scanning Problems

### Camera Not Opening

**iOS:**
1. Check camera permissions: Settings > MF+SO > Camera > Enable
2. If still not working, toggle camera permission off and on again
3. Restart the app
4. If using iPhone 14 Pro/15 Pro, check that LiDAR is not obstructed

**Android:**
1. Check camera permissions: Settings > Apps > MF+SO > Permissions > Camera > Allow
2. Some Android 14+ devices require camera permission even when using photo picker
3. Clear app cache: Settings > Apps > MF+SO > Storage > Clear Cache
4. Restart the device

**Desktop:**
1. Check OS privacy settings for camera access
2. Ensure no other app (Zoom, Teams, browser) is using the camera
3. Try a different USB port if using external camera
4. On Linux: check video group membership: `sudo usermod -a -G video $USER`

### QR Code Won't Scan

| Issue | Solution |
|---|---|
| QR code is blurry | Clean camera lens, hold 15-20 cm from code, ensure good lighting |
| QR code is too small | Move closer or zoom in (mobile) |
| QR code is too large | Move further back |
| Screen glare | Tilt the screen or move to a different angle |
| QR code from screenshot | Use "Import from Image" instead of camera |
| QR code from PDF (desktop) | Try increasing display scaling |
| QR code is damaged | Request a new QR code from the service |
| Code contains unusual characters | Try manual entry instead |

### Manual Entry Alternative

When QR codes won't scan, most services provide a manual setup key:
1. On the 2FA setup page, click "Can't scan QR code?" or "Manual setup"
2. Copy the secret key (usually a 16-32 character base32 string)
3. In MF+SO: Add Account > Manual Entry
4. Paste the secret key
5. Enter the account name and issuer
6. Verify the code works

## Import/Export Issues

### Import Troubleshooting

| Error | Cause | Solution |
|---|---|---|
| "Unsupported format" | File format not recognized | Use supported formats: CSV, JSON, otpauth:// |
| "File corrupted" | File is damaged | Re-download the export file, try again |
| "Duplicate accounts" | Account already exists | Skip duplicates or merge (choose which to keep) |
| "Import failed at line X" | Malformed data in specific row | Open file, fix line X, try again |
| "Encryption mismatch" | Wrong password for encrypted file | Verify the backup passphrase (different from master password) |

### Export Troubleshooting

| Issue | Solution |
|---|---|
| Export file is empty | Ensure vault is not empty, try again |
| Export file is too large | Large vaults (>10K entries) may take 30-60 seconds |
| Export fails mid-process | Free up storage space, try again |
| Export password not accepted | Use the master password or backup passphrase (configurable) |
| CSV export missing fields | Use JSON export for complete data |

## Account Management Issues

### Cannot Add Account

| Issue | Solution |
|---|---|
| "Invalid secret key" | The secret key must be base32 encoded (A-Z, 2-7). Check for typos |
| "Duplicate account detected" | Account with same name + issuer already exists. Edit existing or rename |
| "Max accounts reached" | No maximum (Free tier has unlimited accounts) |
| "App freezes when adding" | Large vault may take a moment. Wait 10-15 seconds |
| "QR code not recognized" | Try manual entry |

### Cannot Edit/Delete Account

1. Check if vault is locked (unlock first)
2. Check if account is syncing (wait for sync to complete)
3. Restart the app
4. If an Enterprise-managed account, your administrator may have restricted editing

### Account Names Not Showing Correctly

1. Check if account has a custom name set
2. If imported from another app, names may be truncated (12 character limit in some formats)
3. Edit the account and correct the name
4. If synced, changes will propagate to other devices

## Battery Drain Issues

### App Draining Battery (Mobile)

**Common causes:**
- Background sync too frequent
- Push notification processing
- Camera usage for QR scanning
- Widget refresh (iOS/Android)

**Solutions:**
1. Reduce sync frequency: Settings > Sync > Sync Interval > 30 minutes
2. Disable background refresh: OS settings > MF+SO > Background App Refresh > OFF
3. Reduce widget refresh: Remove widgets from home screen if not needed
4. Close app after use (don't leave in background)
5. Update to latest version (battery optimizations in v2.5+)

### Battery Usage Comparison

| Feature | Battery Impact per Hour | Notes |
|---|---|---|
| App running (background) | < 1% | Minimal |
| App unlocked (foreground) | 2-5% | Normal use |
| QR scanning (camera) | 8-12% | Temporary |
| Sync (background) | 1-3% | Per sync cycle |
| Browser extension | < 1% | Minimal |
| Push notifications | < 0.5% | Per notification |

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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