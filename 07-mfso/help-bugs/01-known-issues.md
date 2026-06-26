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

# Known Issues

> **Last Updated:** 2026-06-19
> **Category:** Bugs & Known Issues

## How to Use This Document

This document lists currently known issues in MF+SO. Each issue includes:
- **Issue ID** — Reference number for support and bug reports
- **Affected Versions** — Which versions are impacted
- **Platform** — iOS, Android, Desktop, All
- **Severity** — Critical, High, Medium, Low
- **Description** — What the issue is
- **Workaround** — How to work around the issue if impacted
- **Fix Status** — Planned, In Progress, Fixed in version X
- **Reported** — Link to GitHub issue

## Current Known Issues

### Critical Severity

**[K001] Desktop app crash on certain Linux distros with Wayland**

| Field | Value |
|---|---|
| **Issue ID** | K001 |
| **Affected Versions** | 2.5.0 - 2.5.3 |
| **Platform** | Linux (Wayland) |
| **Severity** | Critical |
| **Reported** | [#8923](https://github.com/mfso/mfso/issues/8923) |

**Description:**
The desktop app crashes immediately on launch on Fedora 38+ and Arch Linux when running under Wayland with certain GPU drivers (NVIDIA proprietary, AMD with ROCm).

**Root Cause:**
Wayland compatibility issue with the GTK4 surface rendering backend. The app uses an OpenGL context that is not properly initialized under Wayland on these specific configurations.

**Workaround:**
Launch MF+SO with XWayland:
```bash
GDK_BACKEND=x11 mfso
```
Or switch your session to X11 temporarily.

**Fix Status:**
In Progress. Fix targeted for v2.6.0 (Q3 2026). We are migrating to a Vulkan-based rendering backend that handles Wayland properly.

**[K002] Vault corruption on iOS when storage is critically low**

| Field | Value |
|---|---|
| **Issue ID** | K002 |
| **Affected Versions** | 2.4.0 - 2.5.3 |
| **Platform** | iOS |
| **Severity** | Critical |
| **Reported** | [#8945](https://github.com/mfso/mfso/issues/8945) |

**Description:**
When iOS device storage drops below 500 MB, database write operations can fail partially, leading to vault corruption. The corruption is detected on next app launch, triggering a restoration from backup, but recent changes may be lost.

**Root Cause:**
iOS SQLite WAL (Write-Ahead Log) journal mode fails silently when storage is exhausted, leading to an inconsistent database state.

**Workaround:**
Ensure at least 1 GB of free storage is available on your iOS device. Enable automatic cloud backups (Premium) to minimize data loss. If corruption occurs:
1. Close MF+SO
2. Free up storage space (delete unused apps, photos, etc.)
3. Reopen MF+SO — it should detect corruption and restore from last good backup

**Fix Status:**
In Progress. We are implementing pre-write storage checks and graceful failure handling. Fix targeted for v2.6.0.

### High Severity

**[H001] Sync conflict when editing the same account on two devices simultaneously**

| Field | Value |
|---|---|
| **Issue ID** | H001 |
| **Affected Versions** | All versions |
| **Platform** | All |
| **Severity** | High |
| **Reported** | [#8321](https://github.com/mfso/mfso/issues/8321) |

**Description:**
When an account is edited on two devices at nearly the same time (within the same sync cycle), the sync engine's conflict resolution may pick the wrong version. In some cases, account metadata (name, icon, notes) from one device overwrites that from the other device, while the TOTP secret is correctly preserved from both.

**Root Cause:**
The conflict resolution algorithm uses last-writer-wins on individual fields, but field-level merge logic is incomplete for account metadata.

**Workaround:**
Avoid editing the same account simultaneously on multiple devices. If conflict occurs:
1. Check the account name, icon, and notes on both devices
2. Re-edit on the device with the correct information
3. Force a sync (pull-to-refresh) to propagate the correct version

**Fix Status:**
Planned for v2.6.0. We are implementing a more sophisticated merge strategy using CRDT (Conflict-free Replicated Data Types).

**[H002] FIDO2 credential registration fails on some Android devices with custom ROMs**

| Field | Value |
|---|---|
| **Issue ID** | H002 |
| **Affected Versions** | 2.3.0 - 2.5.3 |
| **Platform** | Android |
| **Severity** | High |
| **Reported** | [#8678](https://github.com/mfso/mfso/issues/8678) |

**Description:**
When registering a FIDO2/WebAuthn credential on Android devices running custom ROMs (LineageOS, GrapheneOS, etc.) without Google Play Services, the FIDO2 registration fails with cryptic errors.

**Root Cause:**
FIDO2 on Android relies on Google Play Services' FIDO2 API. Custom ROMs may not include this API or may have a non-functional implementation.

**Workaround:**
Install Google Play Services (if not already present). Some custom ROMs require flashing GApps (Google Apps) package. Alternatively, use the browser-based WebAuthn flow instead of the native FIDO2 API.

**Fix Status:**
In Progress. We are implementing a direct CTAP2/HID transport that bypasses Google Play Services for FIDO2 operations. Targeted for v2.7.0.

**[H003] Browser extension disconnects from desktop app after sleep/resume on macOS**

| Field | Value |
|---|---|
| **Issue ID** | H003 |
| **Affected Versions** | 2.5.0 - 2.5.3 |
| **Platform** | macOS + browser extension |
| **Severity** | High |
| **Reported** | [#9012](https://github.com/mfso/mfso/issues/9012) |

**Description:**
After macOS wakes from sleep, the browser extension loses its connection to the desktop MF+SO app. The extension shows "Disconnected" and requires manual re-pairing.

**Root Cause:**
The WebSocket connection between the extension and native messaging host is not properly re-established after macOS sleep. The native messaging host process terminates on sleep but the extension's connection tracking does not detect the disconnection.

**Workaround:**
Refresh the browser page or restart the browser. This re-establishes the connection automatically. Alternatively, lock/unlock the desktop app to trigger a reconnection.

**Fix Status:**
In Progress. Fix targeted for v2.5.4 (hotfix). Adding WebSocket keepalive and automatic reconnection logic.

**[H004] Push notifications delayed by 30+ minutes on some Android devices**

| Field | Value |
|---|---|
| **Issue ID** | H004 |
| **Affected Versions** | 2.4.0 - 2.5.3 |
| **Platform** | Android |
| **Severity** | High |
| **Reported** | [#8765](https://github.com/mfso/mfso/issues/8765) |

**Description:**
Push authentication requests (approve/deny) are delayed by 30 minutes or more on Android devices from certain manufacturers (Xiaomi, Huawei, Oppo, OnePlus) due to aggressive battery optimization.

**Root Cause:**
These manufacturers implement aggressive background process killing and notification deferral. Firebase Cloud Messaging (FCM) high-priority messages are being queued or delayed.

**Workaround:**
1. Go to Settings > Apps > MF+SO > Battery > Select "Unrestricted" (not "Optimized")
2. Disable battery optimization for FCM: Settings > Apps > Google Play Services > Battery > Unrestricted
3. Add MF+SO to the "Auto-start" or "Protected apps" list in your device's security settings
4. Do not use "Battery Saver" or "Ultra Power Saving" mode while awaiting push auth

**Fix Status:**
In Progress. We are implementing a fallback polling mechanism that checks for pending auth requests every 30 seconds as backup to push. Fix targeted for v2.6.0.

### Medium Severity

**[M001] TOTP code is sometimes displayed as expired for 1-2 seconds**

| Field | Value |
|---|---|
| **Issue ID** | M001 |
| **Affected Versions** | All versions |
| **Platform** | All |
| **Severity** | Medium |
| **Reported** | [#8123](https://github.com/mfso/mfso/issues/8123) |

**Description:**
When a TOTP code is about to expire, the UI sometimes shows "Expired" for 1-2 seconds before generating the next code. This is purely cosmetic — the correct code is always shown the rest of the time.

**Root Cause:**
Timer refresh race condition. The countdown timer in the UI triggers a state update slightly before the actual TOTP computation completes.

**Workaround:**
None needed — the code is still valid during the "Expired" display. Wait 1-2 seconds and the correct next code will appear.

**Fix Status:**
Planned. Minor UI timing fix in v2.6.0.

**[M002] Account search does not find accented characters**

| Field | Value |
|---|---|
| **Issue ID** | M002 |
| **Affected Versions** | 2.4.0 - 2.5.3 |
| **Platform** | All |
| **Severity** | Medium |
| **Reported** | [#8543](https://github.com/mfso/mfso/issues/8543) |

**Description:**
Searching for "cafe" does not find "café". The search index is not using Unicode normalization, so accented characters are treated as separate characters.

**Root Cause:**
The search index uses byte-level comparison instead of Unicode normalization (NFC/NFD).

**Workaround:**
Type the exact characters used in the account name, including accents. Or search for a substring that does not include the accented character.

**Fix Status:**
In Progress. Fix targeted for v2.6.0. Will implement NFD normalization on the search index.

**[M003] Backup file size is 2x expected for large vaults**

| Field | Value |
|---|---|
| **Issue ID** | M003 |
| **Affected Versions** | 2.5.0 - 2.5.3 |
| **Platform** | All |
| **Severity** | Medium |
| **Reported** | [#8890](https://github.com/mfso/mfso/issues/8890) |

**Description:**
Backup files for vaults with 10,000+ entries are approximately 2x larger than expected. A vault with 10,000 accounts should produce ~30 MB backup but produces ~60 MB.

**Root Cause:**
JSON serialization includes redundant metadata in each account entry. The backup format was not optimized for large vaults.

**Workaround:**
Backup files are still fully functional at the larger size. The size increase affects storage and transfer time but not functionality. For large vaults, allow 2-5 minutes for backup creation.

**Fix Status:**
In Progress. Fix targeted for v2.6.0. We are implementing a more compact backup format with deduplication.

**[M004] Windows app does not auto-start on boot**

| Field | Value |
|---|---|
| **Issue ID** | M004 |
| **Affected Versions** | 2.5.0 - 2.5.3 |
| **Platform** | Windows |
| **Severity** | Medium |
| **Reported** | [#9056](https://github.com/mfso/mfso/issues/9056) |

**Description:**
The "Launch on startup" setting in MF+SO for Windows does not work for some users. The setting appears enabled but the app does not start after a reboot.

**Root Cause:**
The startup registry key (HKCU\Software\Microsoft\Windows\CurrentVersion\Run) is written correctly, but Windows Defender or third-party antivirus may block the startup entry. Additionally, the shortcut-based startup method used in the MSI installer does not work for all user configurations.

**Workaround:**
Manually add MF+SO to startup:
1. Press Win+R, type `shell:startup`, press Enter
2. Right-click > New > Shortcut
3. Browse to MF+SO executable (typically `C:\Program Files\MF+SO\mfso.exe`)
4. Click Next, Finish

**Fix Status:**
In Progress. Fix targeted for v2.5.4 using a more robust startup mechanism.

**[M005] Export to CSV does not include custom fields**

| Field | Value |
|---|---|
| **Issue ID** | M005 |
| **Affected Versions** | 2.5.0 - 2.5.3 |
| **Platform** | All |
| **Severity** | Medium |
| **Reported** | [#9101](https://github.com/mfso/mfso/issues/9101) |

**Description:**
When exporting vault data to CSV, the export includes standard fields (name, issuer, type) but excludes any custom fields the user has defined.

**Root Cause:**
The CSV export generator iterates over predefined fields only and does not include dynamically added custom fields.

**Workaround:**
Use JSON export instead, which includes all custom fields. Settings > Export > JSON Format. The JSON export is also more suitable for data migration.

**Fix Status:**
In Progress. Fix targeted for v2.6.0.

### Low Severity

**[L001] App icon is pixelated on some Android launchers**

| Field | Value |
|---|---|
| **Issue ID** | L001 |
| **Affected Versions** | 2.5.0 - 2.5.3 |
| **Platform** | Android |
| **Severity** | Low |
| **Reported** | [#8456](https://github.com/mfso/mfso/issues/8456) |

**Description:**
The MF+SO app icon appears pixelated or blurry on Android launchers that use non-standard icon sizes (e.g., Nova Launcher with icon size set to 120%).

**Root Cause:**
MF+SO includes adaptive icons for standard densities only (mdpi, hdpi, xhdpi, xxhdpi). Launchers using custom icon sizes may scale to non-standard resolutions.

**Workaround:**
Use the default launcher or set icon size to 100% in your custom launcher.

**Fix Status:**
Planned for v2.7.0. We will add xxxhdpi and xxxhdpi+ icon variants.

**[L002] Dark mode toggle does not apply instantly to settings page**

| Field | Value |
|---|---|
| **Issue ID** | L002 |
| **Affected Versions** | 2.5.0 - 2.5.3 |
| **Platform** | All |
| **Severity** | Low |
| **Reported** | [#8601](https://github.com/mfso/mfso/issues/8601) |

**Description:**
When toggling dark mode in settings, the main interface updates immediately but the settings page itself remains in the previous mode until navigated away and back.

**Root Cause:**
The theme change event does not propagate to the settings view controller.

**Workaround:**
Navigate to another screen and back to see the theme change applied to settings.

**Fix Status:**
Planned for v2.6.0.

**[L003] Tooltip text is truncated in Portuguese (Brazilian)**

| Field | Value |
|---|---|
| **Issue ID** | L003 |
| **Affected Versions** | 2.5.0 - 2.5.3 |
| **Platform** | All |
| **Severity** | Low |
| **Reported** | [#8987](https://github.com/mfso/mfso/issues/8987) |

**Description:**
In Portuguese (Brazilian) translation, several tooltip strings are longer than the UI element width, causing text truncation.

**Root Cause:**
The translated strings are significantly longer than the English equivalents, and the UI elements have fixed widths that were optimized for English.

**Workaround:**
Switch the app language to English for affected screens, or resize the window/device to a wider format.

**Fix Status:**
In Progress. Fix targeted for v2.5.4. We are implementing dynamic tooltip width based on content length.

## Resolved Issues

Previously known issues that have been fixed:

| ID | Description | Fixed In | Date |
|---|---|---|---|
| K004 | iOS widget not refreshing on iOS 17.4+ | v2.5.2 | 2026-04-15 |
| H005 | Sync loop when one device has no internet | v2.5.1 | 2026-03-20 |
| M006 | Camera permission dialog appears twice on Android 14 | v2.5.0 | 2026-03-01 |
| L004 | Spacing issue in account list on iPad | v2.5.0 | 2026-03-01 |

## Reporting New Issues

If you encounter an issue not listed here:
1. Search GitHub Issues: https://github.com/mfso/mfso/issues
2. Check if the issue exists; if not, create a new issue
3. Include your MF+SO version, device/OS, and steps to reproduce
4. Attach debug logs (see Logging and Debugging guide)

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com