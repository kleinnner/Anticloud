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

# Updates & Migration FAQ

> **Last Updated:** 2026-06-19
> **Category:** Updates & Migration

## How do I update MF+SO?

### Mobile (iOS/Android)
Updates are distributed through the respective app stores:
- **iOS:** App Store → Updates
- **Android:** Google Play Store → My Apps → MF+SO
- **Auto-updates:** Enable in your device settings for automatic updates

### Desktop (macOS/Windows/Linux)
- **Automatic:** MF+SO checks for updates at launch and prompts you to install
- **Manual:** Help > Check for Updates
- **Silent:** Enterprise deployments can configure silent updates

### Browser Extension
Updates are handled automatically by the browser's extension management system.

## What is the update schedule?

| Channel | Frequency | Stability | Audience |
|---|---|---|---|
| Stable | Monthly | High | All users |
| Beta | Bi-weekly | Medium | Opt-in |
| Nightly | Daily | Low | Developers |

## What's new in the latest version?

Check the changelog:
- In-app: Settings > About > Version History
- Online: mfso.io/changelog
- GitHub: github.com/mfso/mfso/releases

## Do I need to back up before updating?

MF+SO updates are designed to be non-destructive, but we recommend:
1. **Create a backup** before major version updates (X.0.0)
2. **Verify your seed phrase** is accessible
3. **Check compatibility** for breaking changes (published in release notes)

## What if an update fails?

### Update stuck or incomplete:

1. **Restart the app** and try again
2. **Check internet connection**
3. **Ensure sufficient storage** (500 MB+ free)
4. **Reinstall the app** (backup first!)

### Recovery after failed update:

```bash
# Desktop: Clear update cache
rm -rf ~/.config/mfso/updates/
# Then restart MF+SO

# Mobile: Clear app data (Android)
Settings > Apps > MF+SO > Storage > Clear Data
```

### Rollback procedure:

If a recent update introduced issues:
1. **Mobile:** Uninstall and install the previous version from APK/iPA backup
2. **Desktop:** Use package manager to downgrade (`apt install mfso=previous-version`)
3. **Enterprise:** Use the admin console to schedule a rollback

## Can I migrate from Authy to MF+SO?

### Authy Desktop Migration

Authy Desktop allows you to extract TOTP seeds:

1. Install Authy Desktop (not mobile)
2. Enable developer mode: Settings > Developer Mode
3. Open DevTools (Ctrl+Shift+I or Cmd+Option+I)
4. Go to Console tab
5. Run the Authy token extraction script (available on GitHub)
6. Copy the extracted TOTP URIs
7. In MF+SO: Add Account > Import > Paste URIs

**Note:** This requires technical knowledge. Authy encrypts seeds on mobile, making extraction impossible.

### Authy Mobile Migration

Unfortunately, Authy mobile does not allow seed export. Options:
1. **Manual migration:** Disable 2FA on each service, then re-enable with MF+SO
2. **Authy Desktop method:** See above (if you have access to Authy Desktop)
3. **Professional services:** MF+SO offers migration assistance for Enterprise customers

## Can I migrate from Google Authenticator to MF+SO?

### Method 1: QR Code Export (Android, newer versions)

Google Authenticator added export functionality:

1. Open Google Authenticator
2. Tap menu (three dots) > Transfer accounts > Export accounts
3. Select accounts to transfer
4. QR codes will be displayed
5. Use MF+SO to scan each QR code

### Method 2: Manual Setup

1. In each service, disable 2FA
2. Re-enable 2FA and choose "Set up differently"
3. Scan the new QR code with MF+SO

### Method 3: Rooted Device (Advanced)

If you have root access, you can extract the Google Authenticator database:
```bash
# Requires root access
adb root
adb pull /data/data/com.google.android.apps.authenticator2/databases/databases
# Then use a database browser to extract totp_ URIs
```

## Can I migrate from Microsoft Authenticator to MF+SO?

### Method 1: Personal Account Export

1. Open Microsoft Authenticator
2. Settings > Export accounts
3. QR codes will be displayed
4. Scan with MF+SO

### Method 2: Enterprise Account

For work/school accounts:
- Microsoft Authenticator may not allow export for managed accounts
- Contact your IT administrator to reset MFA
- Re-register with MF+SO

## Can I migrate from 1Password, Bitwarden, or other password managers?

### Bitwarden:
```
Export from Bitwarden:
1. Tools > Export vault > CSV (unencrypted)
2. In MF+SO: Settings > Import > Bitwarden CSV

Note: Bitwarden export includes TOTP seeds if you have premium
```

### 1Password:
```
1. File > Export > CSV
2. In MF+SO: Settings > Import > 1Password CSV

Note: TOTP seeds are exported only in 1Password 8+
```

### Other Managers:
- **LastPass:** Export CSV → Import in MF+SO
- **KeePass:** Export to CSV → Import in MF+SO
- **Dashlane:** Export to CSV → Import in MF+SO
- **Enpass:** Export to CSV → Import in MF+SO

## Can I migrate from Duo Security to MF+SO?

Duo uses proprietary protocols and does not allow seed export:

1. **Unlink each service** from Duo
2. **Re-link each service** with MF+SO
3. For Enterprise: MF+SO can replace Duo as your MFA provider entirely

## What about migrating between MF+SO devices?

### Same OS:
1. On old device: Settings > Backup > Create Backup
2. Transfer backup file to new device (AirDrop, file share, etc.)
3. On new device: Settings > Restore > Select Backup

### Different OS (e.g., iOS to Android):
1. Use MF+SO sync (Premium feature)
2. Or create a backup file and transfer manually
3. Or use seed phrase recovery

## How do I migrate from MF+SO Free to Premium?

1. Open Settings > MF+SO Account > Subscription
2. Choose Premium plan
3. Complete payment
4. Features unlock immediately

**No data loss or migration needed** — Premium features are enabled on your existing vault.

## How do I migrate from MF+SO Personal to Enterprise?

Your organization's IT administrator will handle this. Typically:
1. Organization enables Enterprise on your account
2. You keep your existing vault and accounts
3. Additional Enterprise features become available
4. You may be required to enroll your device and accept policies

## Can I use MF+SO alongside other authenticator apps?

Yes. MF+SO does not conflict with other authenticator apps. However:
- Each TOTP seed can only work with one app at a time (per seed sharing)
- You can have the same account in multiple authenticator apps (some services allow this)
- For best security, use only one authenticator per account

## What happens to my data during migration?

**Importing to MF+SO:**
- Your data is copied (not moved)
- Original app still has your data
- You can verify MF+SO works before removing other apps

**Exporting from MF+SO:**
- Your data is exported in plaintext only for CSV exports
- Encrypted backups remain encrypted
- You maintain full control of your exported data

## Is there a trial period for Premium/Enterprise?

| Tier | Trial Duration | Features | Limit |
|---|---|---|---|
| Premium | 30 days | All Premium features | 3 accounts (trial) |
| Enterprise | 30 days | All features | 50 users |
| Enterprise (online trial) | 14 days | Cloud-hosted | 25 users |

## How do I cancel my subscription?

### Premium:
- Settings > MF+SO Account > Subscription > Cancel
- You retain access until the end of the billing period
- Downgrade to Free at end of period
- Cloud sync limited to 2 devices after downgrade

### Enterprise:
- Written notice per contract terms
- Typical: 30-90 days notice
- Data export available before termination
- Data deleted per retention policy after termination

## Detailed Migration Procedures

### Migrating from Google Authenticator (Step by Step)

**Method 1: Using Google Authenticator's Export Feature (Android, v6.0+)**
1. Open Google Authenticator on your Android device
2. Tap the three-dot menu in the top-right corner
3. Select "Transfer accounts" → "Export accounts"
4. Authenticate with your device's screen lock (PIN, pattern, biometric)
5. Select the accounts you want to transfer (or select all)
6. QR codes will be displayed on screen (one at a time)
7. Open MF+SO on your new device
8. Tap the "+" icon to add an account
9. Scan each QR code from the Google Authenticator display
10. Verify codes are generating correctly in MF+SO

**Method 2: Manual (All Platforms)**
1. For each service that uses Google Authenticator, log into that service
2. Navigate to the 2FA/security settings
3. Disable two-factor authentication (you will need to confirm via existing codes)
4. Re-enable two-factor authentication
5. When the QR code appears, scan it with MF+SO instead of Google Authenticator
6. Verify the code works
7. Repeat for each service

**Method 3: Root-only Database Extraction**
Advanced users with root access can extract the Google Authenticator database:
```bash
# Requires USB debugging enabled and root access
adb root
adb pull /data/data/com.google.android.apps.authenticator2/databases/databases
# Use sqlite3 to examine the database
sqlite3 databases "SELECT * FROM accounts;"
# Extract secret keys and manually enter into MF+SO
```

### Migrating from Authy (Step by Step)

**Using Authy Desktop (the only way to extract seeds):**
1. Install Authy Desktop on your computer (not the mobile app)
2. Sign in to your Authy account
3. Enable developer mode: Settings > General > Developer Mode (toggle on)
4. Open Chrome Developer Tools: View > Developer > Developer Tools
5. Go to the Console tab in DevTools
6. Run the Authy token extraction script:
```javascript
// This script is available at: github.com/mfso/authy-migration
// Paste the complete script into the console and press Enter
```
7. The script will output your TOTP URIs in the console
8. Copy all the output
9. Open MF+SO on your device
10. Use "Import from Clipboard" or manually add each account
11. Verify codes in MF+SO match Authy codes

**If Authy Desktop is not available:**
Unfortunately, without Authy Desktop, seeds cannot be extracted from Authy mobile. You will need to:
1. For each service: log in, disable 2FA, re-enable 2FA with MF+SO
2. This is time-consuming but the only option

### Migrating from Microsoft Authenticator (Step by Step)

1. Open Microsoft Authenticator on your device
2. Tap the three-dot menu → "Settings"
3. Select "Export accounts"
4. Confirm your identity (biometric or PIN)
5. QR codes will be displayed for each account
6. Open MF+SO and scan each QR code
7. Verify codes work

**Note:** Microsoft Authenticator only allows export of personal accounts. Work/school accounts managed by an organization cannot be exported.

### Migrating from Duo Mobile (Step by Step)

Duo Mobile does not allow seed export due to its proprietary protocol. Complete re-enrollment is required:

1. For each service using Duo:
   - Log into the service
   - Navigate to security settings
   - Find Duo Security section
   - Unlink or disable Duo authentication
   - Enable standard TOTP authentication instead
   - Scan the QR code with MF+SO
2. Alternative: If your organization uses Duo, contact your IT administrator about switching to MF+SO
3. Enterprise customers: MF+SO can replace Duo entirely as your MFA provider

### Migrating from 1Password (Step by Step)

1. Open 1Password on your desktop
2. File > Export > All Items
3. Choose CSV format (unencrypted)
4. Save the exported CSV file
5. Open MF+SO on your desktop
6. Settings > Import > From CSV
7. Select the exported CSV file
8. Map the columns correctly:
   - 1Password "title" → MF+SO "name"
   - 1Password "URL" → MF+SO "issuer"
   - 1Password "otpauth" → MF+SO "secret" (if TOTP is included)
9. Complete the import
10. Verify a few accounts generate correct codes

### Migrating from Bitwarden (Step by Step)

1. Open Bitwarden desktop app or web vault
2. Tools > Export vault
3. Choose CSV format (or JSON for more complete data)
4. Enter your master password to confirm
5. Save the export file
6. Open MF+SO > Settings > Import > Select file
7. Bitwarden CSV format is supported natively
8. Complete import and verify accounts

## Version Compatibility Matrix

| MF+SO Version | iOS | Android | macOS | Windows | Linux | Browser Ext |
|---|---|---|---|---|---|---|
| 2.0.x | 16+ | 12+ | — | — | — | — |
| 2.1.x | 16+ | 12+ | — | — | — | — |
| 2.2.x | 16+ | 12+ | — | — | — | Chrome |
| 2.3.x | 16+ | 12+ | 13+ | — | Ubuntu 22.04 | Chrome, FF |
| 2.4.x | 16+ | 12+ | 13+ | 10+ | Ubuntu 22.04, Fedora | Chrome, FF, Edge |
| 2.5.x | 16+ | 12+ | 14+ | 10/11 | Ubuntu 22+, Fedora 38+ | All major |

## Migration Checklist

### Before Migration
- [ ] Install latest MF+SO on all devices
- [ ] Create a full backup of your current authenticator (where possible)
- [ ] Verify MF+SO works by adding one test account
- [ ] Ensure you have access to your accounts (passwords, recovery codes)
- [ ] Allocate sufficient time (1-2 hours for 50+ accounts)
- [ ] Have your phone available for SMS verification (some services require it)

### During Migration
- [ ] Start with less critical accounts first
- [ ] Verify each account generates codes correctly before disabling the old app
- [ ] Check the code in MF+SO matches the code in your old app (if using same seed)
- [ ] For important accounts: set up MF+SO alongside your existing authenticator (don't remove old one yet)

### After Migration
- [ ] Keep your old authenticator app installed for 1-2 weeks
- [ ] Test each migrated account by actually logging in with MF+SO codes
- [ ] Once verified, disable/remove the old authenticator app
- [ ] Create a backup of MF+SO vault
- [ ] Store your MF+SO recovery seed phrase in a safe place
- [ ] Update any emergency access settings in MF+SO

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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