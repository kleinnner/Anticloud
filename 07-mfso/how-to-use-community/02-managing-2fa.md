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

# Managing 2FA

## Table of Contents

1. [Introduction to TOTP](#introduction-to-totp)
2. [Viewing Your TOTP Codes](#viewing-your-totp-codes)
3. [Copying Codes to Clipboard](#copying-codes-to-clipboard)
4. [Understanding the Timer](#understanding-the-timer)
5. [Adding a New 2FA Account](#adding-a-new-2fa-account)
6. [Editing an Existing 2FA Account](#editing-an-existing-2fa-account)
7. [Deleting a 2FA Account](#deleting-a-2fa-account)
8. [Organizing Your TOTP Accounts](#organizing-your-totp-accounts)
9. [Advanced Features](#advanced-features)
10. [Troubleshooting](#troubleshooting)

## Introduction to TOTP

Time-based One-Time Password (TOTP) is the industry standard for two-factor authentication. MF+SO generates these codes locally on your device using a shared secret that you establish when you set up 2FA with a service.

### How TOTP Works

1. You set up 2FA on a website (e.g., Google, GitHub, your bank)
2. The website gives you a secret key (shown as a QR code or text)
3. You add this secret to MF+SO
4. MF+SO uses the secret and the current time to generate a 6-digit code
5. The code changes every 30 seconds
6. You enter the code on the website to prove you have the secret

### Why Use MF+SO for TOTP?

| Feature | Benefit |
|---------|---------|
| All in one place | Your passwords and 2FA codes in a single vault |
| Encrypted backup | Your TOTP seeds are backed up with your vault |
| Cross-device sync | Codes available on all your devices |
| Offline capability | Codes work without internet |
| Secure export | Export all codes with encrypted backup |
| Multiple views | Grid, list, and search views for quick access |

## Viewing Your TOTP Codes

### Main Dashboard View

When you open MF+SO, your TOTP codes are displayed on the main dashboard:

1. **Grid View** (default): Each TOTP account shows as a card with:
   - Account name and icon (auto-detected from URL)
   - Current 6-digit code
   - Circular countdown timer
   - Color-coded urgency (green → yellow → red as timer counts down)

2. **List View**: Compact list with:
   - Account name and code side by side
   - More accounts visible at once
   - Quick-copy buttons

3. **Search View**: Filter accounts by name:
   - Type any part of the account name
   - Matching accounts appear in real-time
   - Great for large vaults (50+ accounts)

### Switching Views

- Mobile: Tap the view icon in the top toolbar
- Desktop: View → Grid / List / Search
- Keyboard shortcut: Ctrl+1 (grid), Ctrl+2 (list), Ctrl+3 (search)

### Dark Mode and Accessibility

- MF+SO supports dark mode for comfortable viewing in low light
- High-contrast mode for users with visual impairments
- Adjustable font size for the 6-digit codes
- Screen reader support for all TOTP elements

## Copying Codes to Clipboard

MF+SO makes it easy to copy TOTP codes:

### Quick Copy (Recommended)

1. Tap or click on the 6-digit code
2. The code is immediately copied to your clipboard
3. A brief "Copied!" animation confirms the action
4. The code stays selected for 30 seconds (or until it changes)

### Auto-Copy

Enable auto-copy in Settings:
1. Go to Settings → TOTP → Auto-Copy
2. Choose when to auto-copy:
   - **On tap**: Copies when you tap the account card
   - **On selection**: Copies when you select an account
   - **Disabled**: Manual copy only

### Clipboard Security

MF+SO helps protect your codes:

| Feature | Description |
|---------|-------------|
| Auto-clear clipboard | Clears clipboard after 10 seconds (configurable: 3-60 seconds) |
| No screenshots | Codes are hidden from screenshots (where OS supports) |
| Overlay protection | Codes not visible in app switcher/overview |
| Clipboard notification | Notification when code is copied to clipboard |

### Copy to Another Device

- If you're on desktop and need a code on mobile (or vice versa):
  1. Select the code on the source device
  2. It's copied to clipboard
  3. If sync is enabled, the code is also available on other devices
  4. Note: Each device generates codes independently (no sync lag)

## Understanding the Timer

### The Countdown Circle

Each TOTP account shows a circular timer:

1. **Full Circle**: Code was just generated (30 seconds remaining)
2. **Three-Quarter Circle**: ~22 seconds remaining
3. **Half Circle**: ~15 seconds remaining
4. **Quarter Circle**: ~7 seconds remaining
5. **Almost Empty**: ~3 seconds remaining (code will change soon)

### Color Coding

| Timer Status | Color | Meaning |
|-------------|-------|---------|
| 30-15 seconds | Green | Plenty of time to use the code |
| 15-7 seconds | Yellow | Code still valid, but getting older |
| 7-0 seconds | Red | Code expires very soon - wait for fresh code |

### Timer Accuracy

- MF+SO synchronizes time with NTP servers regularly
- If your device time is off, codes will be incorrect
- To check synchronization: Settings → TOTP → Sync Time
- Automatic sync: Every 24 hours or on significant time zone changes

### Manual Time Sync

If codes aren't working:

1. Go to Settings → TOTP → Sync Time
2. Tap "Sync Now"
3. MF+SO will fetch the current time from NTP servers
4. Time drift is displayed (should be < 30 seconds)
5. If drift > 30 seconds, auto-correction is applied

## Adding a New 2FA Account

### Method 1: Scan QR Code

**Best for**: Most websites and services

1. Tap the "+" button (bottom-right on mobile, top toolbar on desktop)
2. Select "Scan QR Code"
3. Grant camera permission if prompted
4. Point your camera at the QR code on the website
5. MF+SO will automatically:
   - Read the QR code
   - Extract the secret key
   - Detect the account name and issuer
6. Verify the pre-filled details:
   - **Account Name**: Usually your email or username
   - **Issuer**: The website/service name (e.g., "Google", "GitHub")
   - **Secret Key**: Hidden for security (verify it was read correctly)
7. Tap "Save"

**Pro tip**: If the QR code is on your computer screen, you can use your phone to scan it. On mobile, you can also scan from another phone's screen.

### Method 2: Enter Setup Key

**Best for**: When QR code is unavailable or can't be scanned

1. Tap the "+" button
2. Select "Enter Setup Key"
3. Fill in the details:
   - **Account Name**: Your username or email for this service
   - **Issuer**: The service name (will use as display name)
   - **Secret Key**: The key from the website (usually a string of letters and numbers)
   - **Type**: TOTP (most common) or HOTP (counter-based)
4. Optional settings:
   - **Algorithm**: SHA-1 (default), SHA-256, SHA-512
   - **Digits**: 6 (default), 7, or 8
   - **Period**: 30 seconds (default), 60 seconds
5. Tap "Save"

### Method 3: Import from Another App

**Best for**: Moving from another authenticator app

1. Export your codes from the old app (usually as a QR code or JSON file)
2. In MF+SO, tap "+" → "Import"
3. Select the import method:
   - **Scan QR**: For QR code exports
   - **Upload File**: For JSON or text file exports
4. Follow the on-screen instructions

**Supported import sources**:
- Google Authenticator
- Microsoft Authenticator
- Authy
- LastPass Authenticator
- 2FAS
- andOTP
- Aegis

### Method 4: Manual Entry with All Parameters

**Best for**: Advanced users, custom TOTP implementations

1. Tap "+" → "Manual Entry"
2. Enter all parameters explicitly:
   - Secret (base32 encoded)
   - Algorithm (SHA-1, SHA-256, SHA-512)
   - Digits (6, 7, 8)
   - Period (30, 60, or custom seconds)
   - Counter (for HOTP only)
3. Verify by checking that a valid code is generated
4. Tap "Save"

## Editing an Existing 2FA Account

### Changing Account Details

1. Tap the account card to open its details
2. Tap the "Edit" button (pencil icon)
3. You can edit:
   - **Account Name**: Change the display name
   - **Issuer**: Change the service name
   - **Icon**: Change or remove the service icon
   - **Notes**: Add or edit notes about this account
   - **Folder**: Move to a different folder
   - **Tags**: Add or remove tags
4. Tap "Save"

### Regenerating the Secret

**Important**: This will break your existing 2FA with the service. You must re-enable 2FA on the website after doing this.

1. Open the account details
2. Tap "Advanced"
3. Tap "Replace Secret"
4. Scan a new QR code or enter a new setup key
5. Confirm that you understand the old codes will stop working
6. Tap "Confirm"

### Changing the Icon

1. Open the account details
2. Tap "Edit"
3. Tap the current icon
4. Choose from:
   - **Auto-detect**: MF+SO will find the icon from the URL
   - **Search icons**: Browse the icon library
   - **Custom URL**: Enter a URL to a custom icon
   - **Upload**: Upload your own image
5. Tap "Save"

### Adding Recovery Codes

Many services provide backup/recovery codes when you set up 2FA. You can store these in MF+SO:

1. Open the account details
2. Tap "Add Recovery Codes"
3. Enter the recovery codes (one per line)
4. Tap "Save"
5. Recovery codes are shown in a separate section
6. Codes can be marked as "Used" individually

## Deleting a 2FA Account

### Before Deleting

**WARNING**: Deleting a TOTP account from MF+SO will remove your ability to generate 2FA codes for that service. Before deleting:

1. Ensure you have another way to authenticate (recovery codes, SMS backup, another authenticator)
2. Or be prepared to go through account recovery on the service
3. Consider disabling 2FA on the service first, then re-adding later

### Delete Steps

1. Open the account details
2. Tap the menu (three dots) in the top-right corner
3. Tap "Delete Account"
4. Confirm deletion:
   - Type "DELETE" to confirm (prevents accidental deletion)
   - Tap "Permanently Delete"
5. The account is removed from your vault

### Deletion Recovery

If you accidentally delete an account:

- **Immediately**: If sync is enabled, check the "Trash" folder
- **From backup**: Restore from your last encrypted export
- **From seed phrase**: If you have a recent backup, restore your vault

**Deleted items are kept in Trash for 30 days** before permanent deletion.

### Bulk Delete

To delete multiple accounts:

1. In list view, tap "Select" (top-right)
2. Tap each account you want to delete
3. Tap the trash icon
4. Confirm bulk deletion

## Organizing Your TOTP Accounts

### Folders

Organize accounts into folders:

1. Tap "Folders" in the sidebar (desktop) or bottom navigation (mobile)
2. Tap "+" to create a new folder
3. Name the folder (e.g., "Work", "Personal", "Finance", "Social Media")
4. Drag accounts into folders
5. Tap a folder to view only accounts in that folder

**Default folders** (can be renamed or deleted):
- All Accounts
- Favorites
- Recent
- Trash

### Tags

Tag accounts for cross-folder organization:

1. Open an account's details
2. Tap "Tags"
3. Enter tag names (e.g., "urgent", "shared", "legacy")
4. Tags appear as colored badges on account cards
5. Search by tag: type "#tagname" in the search bar

### Favorites

Star your most-used accounts:

1. Tap the star icon on any account card
2. Starred accounts appear in the "Favorites" view
3. They also appear at the top of search results

### Sorting

Change the sort order:

1. Tap "Sort" in the toolbar
2. Choose sort method:
   - **A-Z**: Alphabetical by account name
   - **Z-A**: Reverse alphabetical
   - **Recently Used**: Most recently accessed first
   - **Recently Added**: Newest accounts first
   - **Custom**: Drag to reorder manually

## Advanced Features

### Multi-Account TOTP

Some services (like Google) allow multiple accounts. MF+SO supports:

1. Add each account separately
2. Use the same issuer name with different account names
3. MF+SO groups them under the issuer in search

### TOTP for Multiple Devices

Your TOTP accounts sync across all your devices:

1. Add an account on your phone
2. It appears on your laptop and browser extension
3. Each device generates codes independently
4. No sync delay for code generation

### Steam TOTP

MF+SO supports Steam's custom TOTP algorithm:

1. When adding a Steam account, select "Steam" as the type
2. Enter the shared secret from Steam
3. MF+SO generates the correct alphanumeric Steam code

### Push-Based 2FA

For services that use push notifications instead of TOTP:

- MF+SO can store the account credentials
- Push notifications are handled through the service's own app
- MF+SO stores the recovery codes and backup methods

## Troubleshooting

### Codes Not Working

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| All codes are wrong | Device time is incorrect | Settings → TOTP → Sync Time |
| One code is wrong | Wrong secret entered | Delete and re-add the account |
| Code expired before I used it | Code was too old | Wait for a fresh code (next 30-second window) |
| Code is 7 digits but I need 6 | Wrong digit configuration | Edit account → change Digits to 6 |
| "Invalid code" on website | Time drift > 30 seconds | Sync time and try again |

### Sync Issues

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Account not on other device | Sync hasn't completed | Wait a few seconds, check internet |
| Account duplicated | Race condition in sync | Delete duplicate, keep one |
| Changes not appearing | Offline changes pending | Reconnect to internet |

### Import Issues

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| QR code won't scan | Camera focus or lighting | Clean lens, increase lighting, reduce glare |
| Import file not recognized | Wrong format | Check import format, convert if needed |
| Duplicates after import | Already had some accounts | Use "Skip duplicates" option |

### Performance

| Issue | Solution |
|-------|----------|
| App feels slow with many codes | Switch to list view (faster than grid) |
| Search is slow | Reduce number of accounts (archive unused) |
| Battery drain | Reduce auto-refresh frequency in Settings |

## Best Practices

1. **Use descriptive names**: Name accounts so you can tell them apart (e.g., "Google - Work" vs "Google - Personal")
2. **Store recovery codes**: Always add recovery codes when available
3. **Regular cleanup**: Remove accounts for services you no longer use
4. **Sync time regularly**: Especially after traveling to different time zones
5. **Backup your vault**: Create regular encrypted exports
6. **Use folders**: Organize by category for quick access
7. **Enable auto-fill**: For seamless login on supported browsers
8. **Review device list**: Check which devices have access to your vault

### Security Notes

- Your TOTP seeds are encrypted in your vault
- Only you can access them with your master password
- MF+SO cannot recover TOTP seeds if you lose your vault
- Back up your seed phrase to protect your TOTP codes
- TOTP seeds sync between devices with end-to-end encryption
- MF+SO servers never see your TOTP seeds in plaintext

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
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
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
