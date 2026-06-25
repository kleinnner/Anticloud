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

# Password Management

## Table of Contents

1. [Introduction](#introduction)
2. [Adding Passwords](#adding-passwords)
3. [Viewing and Copying Passwords](#viewing-and-copying-passwords)
4. [Editing Password Entries](#editing-password-entries)
5. [Autofill with Browser Extension](#autofill-with-browser-extension)
6. [Password Generator](#password-generator)
7. [Organizing Your Passwords](#organizing-your-passwords)
8. [Password Health and Security](#password-health-and-security)
9. [Import and Export](#import-and-export)
10. [Troubleshooting](#troubleshooting)

## Introduction

MF+SO provides a secure, encrypted vault for all your passwords. Unlike traditional password managers, MF+SO uses zero-knowledge encryption — meaning your passwords are encrypted on your device before being stored, and not even MF+SO can read them.

Your passwords are stored alongside your 2FA codes, secure notes, and identity documents in a single, unified vault. This means you can access everything you need to log into any account from one place.

## Adding Passwords

### Method 1: Manual Entry

1. Tap the "+" button (bottom-right on mobile, top toolbar on desktop)
2. Select "Password"
3. Fill in the fields:

| Field | Required | Description |
|-------|----------|-------------|
| **Account Name** | Yes | Descriptive name (e.g., "Amazon", "Work Email") |
| **Username/Email** | Yes | The login identifier |
| **Password** | Yes | The password (can be typed or generated) |
| **URL** | No | Website address (enables autofill) |
| **Notes** | No | Additional information |
| **Folder** | No | Organize into folders |
| **Tags** | No | Add searchable tags |
| **Favorite** | No | Star for quick access |

4. Tap "Save"

### Method 2: Save from Browser

When you log into a website with the MF+SO browser extension:

1. Enter your username and password on the website
2. The MF+SO extension detects the login
3. A popup asks: "Save this password to MF+SO?"
4. Review the details (auto-detected from the form)
5. Edit if needed (add notes, change folder)
6. Click "Save Password"

### Method 3: Bulk Import

See the "Import" section below for importing from other password managers.

### Method 4: Capture from App

On mobile, you can capture login credentials from apps:

1. When logging into an app, the MF+SO keyboard appears
2. It offers to save the credentials
3. Confirm to add to your vault

## Viewing and Copying Passwords

### Viewing Password List

The main vault view shows all your password entries:
- **Card View**: Each entry shows account name, username, and masked password
- **List View**: Compact entries with quick-copy buttons
- **Search**: Find by account name, URL, or tags

### Revealing a Password

1. Tap the password entry to open details
2. The password is masked by default (••••••••)
3. Tap the eye icon to reveal the password
4. The password stays visible for 10 seconds (configurable)
5. It auto-hides when you navigate away

### Copying a Password

1. Tap the copy icon next to the password field
2. The password is copied to your clipboard
3. A "Copied!" animation confirms the action
4. Clipboard auto-clears after 10 seconds

### Copying Username or Other Fields

- Tap any field to copy it individually
- Tap "Copy All" to copy username, password, and other fields

## Editing Password Entries

### Changing Fields

1. Open the password entry
2. Tap "Edit" (pencil icon)
3. Modify any field:
   - **Account Name**: Rename the entry
   - **Username/Email**: Update login identifier
   - **Password**: Enter a new password
   - **URL**: Update the website address
   - **Notes**: Add or edit notes
   - **Folder/Tags**: Change organization
4. Tap "Save"

### Changing a Password

When you update a password for an online account:

1. Open the entry and tap "Edit"
2. Tap the password field
3. Enter the new password (or generate one)
4. Tap "Save"

**Password History**: MF+SO keeps the last 5 passwords for each entry (configurable). To view history:

1. Open entry details
2. Tap "Password History"
3. See previous passwords with dates
4. Copy an old password if needed

### Creating a New Version

If you want to keep the old entry while creating a new one:

1. Open the entry
2. Tap the menu (three dots)
3. Tap "Duplicate"
4. Edit the duplicate
5. Save as a new entry

## Autofill with Browser Extension

### Installing the Extension

1. Open your browser's extension store:
   - Chrome: Chrome Web Store
   - Firefox: Firefox Add-ons
   - Edge: Edge Add-ons
   - Safari: Safari Extensions
2. Search for "MF+SO"
3. Click "Add to [Browser]"
4. Pin the extension for easy access

### Setting Up Autofill

1. Click the MF+SO icon in your browser toolbar
2. Click "Connect to Vault"
3. A QR code appears
4. Open MF+SO desktop app → Settings → Browser Extension
5. Scan the QR code
6. The extension is now connected

### Using Autofill

**Method 1: Click Field**

1. Go to a login page
2. Click the username/email field
3. The MF+SO autofill popup appears
4. Click the entry you want to use
5. MF+SO fills in both username and password

**Method 2: Extension Menu**

1. Click the MF+SO extension icon
2. Search for the account
3. Click the entry
4. The page fills automatically

**Method 3: Keyboard Shortcut**

- **Windows/Linux**: Ctrl+Shift+L
- **macOS**: Cmd+Shift+L

On the login page, press the shortcut and MF+SO fills in credentials.

### Autofill Settings

Configure autofill in Settings → Browser Extension:

| Setting | Options | Description |
|---------|---------|-------------|
| Auto-fill on page load | On / Off | Automatically fill credentials when page loads |
| Submit after fill | On / Off | Automatically submit the form after filling |
| Fill delay | 0-5 seconds | Delay before filling (avoids detection) |
| Keyboard shortcut | Custom | Change the autofill shortcut |
| Excluded sites | List | Never autofill on these sites |

### Autofill Security

- MF+SO only autofills on pages whose URL matches the stored URL
- HTTPS required for autofill
- No autofill on iframes or embedded forms
- Manual unlock required if vault is locked

## Password Generator

### Using the Generator

1. When adding or editing a password, tap the wand icon
2. The password generator opens

### Generator Settings

| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| Length | 8-128 characters | 24 | Total password length |
| Uppercase | On/Off | On | Include A-Z |
| Lowercase | On/Off | On | Include a-z |
| Numbers | On/Off | On | Include 0-9 |
| Symbols | On/Off | On | Include !@#$%^&* etc. |
| Exclude ambiguous | On/Off | Off | Exclude l, I, 1, O, 0 |
| Exclude similar | On/Off | Off | Exclude similar-looking chars |

### Password Strength Indicator

- **Weak**: < 8 characters or simple patterns → Red
- **Fair**: 8-12 characters → Orange
- **Good**: 12-20 characters → Yellow
- **Strong**: 20+ characters with all types → Light green
- **Very Strong**: 30+ characters with all types → Dark green

### Password Rules

The generator can enforce specific rules:
- Must include at least 1 uppercase, 1 lowercase, 1 number
- Must include at least 2 symbols
- No consecutive repeating characters
- No keyboard patterns (e.g., "qwerty")

### Pronounceable Passwords

For passwords you might need to dictate:

1. In the generator, toggle "Pronounceable"
2. Generates passwords like "CoNneCt5-TraP_D0g"
3. Easier to read aloud
4. Slightly less entropy (but still strong)

## Organizing Your Passwords

### Folders

Create folders to group related passwords:

1. In the sidebar, tap "Folders"
2. Tap "+" to create a folder
3. Name it (e.g., "Work", "Personal", "Finance", "Social")
4. Drag entries into folders
5. Tap a folder to view its contents

**Suggested folder structure**:
```
All Passwords
├── Work
│   ├── Email (Work)
│   ├── HR System
│   ├── Project Management
│   └── VPN
├── Personal
│   ├── Personal Email
│   ├── Social Media
│   └── Messaging
├── Finance
│   ├── Bank Accounts
│   ├── Credit Cards
│   ├── Investments
│   └── Insurance
├── Shopping
│   ├── Amazon
│   ├── eBay
│   └── Other Stores
└── Technical
    ├── Domain Registrars
    ├── Hosting
    └── API Keys
```

### Tags

Tags provide cross-folder organization:

1. Open an entry → Edit → Tags
2. Add tags like: "urgent", "shared", "family", "work", "important"
3. Search by tag: type #tagname in search
4. Tags appear as colored badges

### Favorites

Star frequently used entries:
- Tap the star icon on any entry
- Favorites appear at the top of lists
- Favorites folder shows all starred items

### Search

Search across all fields:
1. Tap the search bar
2. Type account name, URL, username, or tags
3. Results update in real-time
4. Recent searches are saved for quick access

### Quick Filters

| Filter | Description |
|--------|-------------|
| All | Show all password entries |
| No Folder | Show entries not in any folder |
| Weak Passwords | Show entries with weak passwords |
| Reused Passwords | Show passwords used in multiple entries |
| Expired | Show passwords older than 90 days |
| Never Updated | Show passwords created but never updated |

## Password Health and Security

### Security Dashboard

The security dashboard shows your overall password health:

1. Go to Tools → Security Dashboard
2. Metrics displayed:

| Metric | What It Shows |
|--------|---------------|
| **Overall Score** | Percentage of healthy passwords (target: > 80%) |
| **Weak Passwords** | Count of passwords below 12 characters |
| **Reused Passwords** | Count of passwords used in multiple entries |
| **Old Passwords** | Passwords not changed in > 90 days |
| **Missing 2FA** | Accounts with passwords but no TOTP setup |
| **Exposed Passwords** | Passwords found in known data breaches |

### Password Strength Analysis

MF+SO analyzes each password:

| Strength | Criteria | Action |
|----------|----------|--------|
| Very Weak | < 8 characters or common patterns | Change immediately |
| Weak | 8-11 characters | Change soon |
| Fair | 12-15 characters | Consider improving |
| Strong | 16-19 characters | Good |
| Very Strong | 20+ characters with all types | Excellent |

### Breach Monitoring

MF+SO checks passwords against known data breaches:

1. **How it works**: When you save a password, a hash is sent to check against breach databases. Your actual password is never sent.
2. **Automatic check**: Every time you save or update a password
3. **Manual check**: Tools → Security Dashboard → Check All Passwords
4. **Notifications**: Alerts if a password appears in a new breach

### Password Expiry Reminders

1. Go to Settings → Security → Password Expiry
2. Set reminder intervals:
   - **None**: No reminders
   - **30 days**: Remind every 30 days
   - **60 days**: Remind every 60 days
   - **90 days**: Remind every 90 days (recommended)
   - **Custom**: Set your own interval
3. You'll receive in-app and email reminders

### Security Audit

Run a full security audit:

1. Tools → Security Audit
2. The audit checks:
   - Password strength for all entries
   - Password reuse across entries
   - Accounts with missing 2FA
   - Outdated passwords
   - HTTPS availability for stored URLs
   - Breach status
3. Results show actionable recommendations
4. Tap any recommendation to fix it

## Import and Export

### Importing from Other Password Managers

**Supported Sources**:
- Bitwarden (JSON, CSV)
- LastPass (CSV)
- 1Password (1pif, CSV)
- Dashlane (CSV)
- KeePass (KDBX)
- Chrome (CSV)
- Firefox (CSV)
- Safari (CSV)

**Import Steps**:

1. Export your data from your current password manager
2. In MF+SO, go to Settings → Import
3. Select your source
4. Upload the export file
5. Map fields if needed (username, password, URL, notes)
6. Review the preview
7. Tap "Import"
8. Duplicates are automatically detected and skipped

### Exporting Your Passwords

**Export Format**: Encrypted JSON (.mfso)

1. Go to Settings → Export
2. Choose export type:
   - **Full Export**: All vault entries
   - **Passwords Only**: Just password entries
   - **Selective**: Choose specific entries
3. Set a strong export password (different from master password)
4. MF+SO generates the encrypted file
5. Download or save the file

## Troubleshooting

### Common Issues

| Issue | Likely Cause | Solution |
|-------|-------------|----------|
| Autofill not working | Extension not connected | Reconnect extension to desktop app |
| Password not saving | Sync conflict | Check internet, try again |
| Import fails | Format not recognized | Check import format guide |
| Wrong URL matched | URL stored incorrectly | Edit entry, update URL |
| Password won't paste | Clipboard disabled in field | Check browser security settings |
| Extension icon grayed out | Vault locked | Unlock vault in desktop app |

### Sync Conflicts

If changes aren't appearing across devices:

1. Check that all devices have internet
2. Check that sync is enabled on all devices
3. Force sync: Settings → Sync → Force Sync
4. Check sync status: Settings → Sync → Status

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
