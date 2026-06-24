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

# Quickstart Guide

## Welcome to MF+SO

Welcome to MF+SO — Multi Factor+ Sign On, the sovereign identity and authentication vault. This quickstart guide will get you up and running in 5 minutes with a fully functional vault and your first two-factor authentication code.

MF+SO is designed to be your digital identity command center. It stores your passwords, generates TOTP codes, manages your authentication tokens, and keeps your digital identity secure — all with zero-knowledge encryption that ensures only you can access your data.

## What You'll Need

- A computer or mobile device
- Internet connection
- About 5 minutes of your time
- One online account you want to secure with 2FA

## Step 1: Install MF+SO

### Desktop (Windows, macOS, Linux)

1. Open your browser and go to https://mfso.app/download
2. Choose your operating system:
   - **Windows**: Download the .exe or .msi installer
   - **macOS**: Download the .dmg (Apple Silicon or Intel)
   - **Linux**: Download the .AppImage, .deb, or .rpm package
3. Run the installer and follow the on-screen instructions
4. Launch MF+SO from your Applications folder or Start menu

### Mobile (iOS, Android)

1. Open your device's app store:
   - **iOS**: App Store — search for "MF+SO"
   - **Android**: Google Play Store — search for "MF+SO"
2. Tap "Get" or "Install"
3. Wait for the download to complete
4. Tap "Open"

### Browser Extension (Chrome, Firefox, Edge)

1. Visit your browser's extension store:
   - **Chrome**: Chrome Web Store — search for "MF+SO"
   - **Firefox**: Firefox Add-ons — search for "MF+SO"
   - **Edge**: Edge Add-ons — search for "MF+SO"
2. Click "Add to [Browser]"
3. Pin the extension for easy access

## Step 2: Create Your Vault

When you first open MF+SO, you'll see the welcome screen. Follow these steps:

### 2.1 Choose Your Vault Name

1. Enter a display name for your vault (e.g., "My Personal Vault")
2. This name is stored locally and helps you identify your vault if you have multiple
3. Tap "Create Vault"

### 2.2 Create Your Master Password

Your master password is the most important security decision you'll make:

1. **Choose a strong password**:
   - At least 12 characters (20+ recommended)
   - Mix of uppercase, lowercase, numbers, and symbols
   - Not used anywhere else
   - Not based on personal information

2. **Enter your master password** in the first field
3. **Re-enter it** in the confirmation field
4. MF+SO will show a strength meter — aim for "Strong" or "Very Strong"

3. **Important**: MF+SO cannot recover your master password. If you forget it, you'll need your seed phrase to recover your vault (you'll get this in the next step).

### 2.3 Record Your Seed Phrase

This is the most important step. Your seed phrase is the master key to your vault:

1. MF+SO will display 24 words in order
2. **Write them down** on the seed phrase card provided in the app or on a piece of paper
3. **Write each word exactly** as shown, in the correct order
4. **Store the card** in a safe place (fireproof safe, safety deposit box)
5. **Never share** your seed phrase with anyone
6. **Never store** your seed phrase digitally (no photos, no cloud storage, no notes app)

**Verification**: MF+SO will ask you to enter a few random words from your seed phrase to confirm you wrote them down correctly. This is important — complete this step.

### 2.4 Set Your Device PIN

1. Choose a 6-digit PIN for quick access to MF+SO
2. This PIN is separate from your master password
3. It provides quick access while keeping your vault secure
4. You can also set up biometric authentication (face or fingerprint)

### 2.5 Vault Creation Complete

You'll see a confirmation screen with:
- Your vault name
- Account creation date
- A reminder to store your seed phrase safely

Tap "Enter Vault" to continue.

## Step 3: Add Your First 2FA (TOTP)

Now let's add a two-factor authentication code to your vault. This will let you generate 2FA codes for any service that supports authenticator apps.

### 3.1 Find the Setup Key

1. Go to the website or app where you want to enable 2FA
2. Navigate to Security Settings → Two-Factor Authentication
3. Select "Authenticator App" as your 2FA method
4. You'll see either:
   - **QR Code**: A square barcode to scan
   - **Setup Key**: A code like `JBSWY3DPEHPK3PXP`

### 3.2 Add to MF+SO

**Method A: Scan QR Code** (easiest)

1. In MF+SO, tap the "+" button (or "Add Account")
2. Select "Scan QR Code"
3. Point your camera at the QR code on your screen
4. MF+SO will automatically read the code and create the entry

**Method B: Enter Setup Key**

1. In MF+SO, tap the "+" button (or "Add Account")
2. Select "Enter Setup Key"
3. Give the account a name (e.g., "Google", "GitHub", "Email")
4. Paste or type the setup key
5. Select the type (TOTP is most common)
6. Tap "Save"

### 3.3 Generate Your First Code

1. You'll see the new account in your MF+SO vault
2. Below the account name, you'll see a 6-digit code
3. The code refreshes every 30 seconds
4. A circular timer shows how much time is left
5. Enter this code on the website to complete 2FA setup

**Congratulations!** You've just secured your first account with MF+SO. Repeat the process for any other accounts you want to protect.

## Step 4: Explore Your Vault

Now that you have your first entry, let's explore what else MF+SO can do:

### Dashboard

Your main vault view shows:
- **All accounts**: Searchable list of all your entries
- **Favorites**: Your most-used accounts (star them for quick access)
- **Categories**: Passwords, TOTP, Secure Notes, Identity Documents
- **Recent**: Recently accessed or modified entries

### Quick Actions

- **Copy code**: Tap a TOTP code to copy it to your clipboard
- **Copy password**: Tap a password field to copy it
- **Autofill**: Use the browser extension to autofill login forms
- **Search**: Use the search bar to find any entry instantly

### Entry Details

Tap any entry to see its full details:
- **Username/Email**: The login identifier
- **Password**: The stored password (tap to view or copy)
- **TOTP Code**: Current 2FA code with countdown timer
- **URL**: The website address
- **Notes**: Any additional information you've stored
- **Attachments**: Files attached to the entry

## Step 5: Set Up Sync (Optional but Recommended)

Syncing lets you access your vault from multiple devices.

### On Your First Device

1. Go to Settings → Sync
2. Tap "Enable Sync"
3. Enter your master password to authorize
4. Sync is now active

### On Your Second Device

1. Install MF+SO on your other device
2. During setup, select "Link to Existing Vault"
3. Log in with your email and master password
4. Your vault will automatically sync

### What Sync Does

- Keeps your vault consistent across all your devices
- Updates propagate in real-time (within seconds)
- Changes made offline sync when you reconnect
- Conflict resolution: last-write-wins for independent changes

### What Sync Does NOT Do

- Your vault is NOT stored in plaintext on any server
- MF+SO cannot read your vault contents (zero-knowledge)
- Sync servers only see encrypted data

## What's Next?

You've completed the 5-minute quickstart. Here's what you can do next:

### Essential Next Steps

1. **Backup your vault**: Create an encrypted export in Settings → Export
2. **Add more accounts**: Add all your important 2FA accounts
3. **Install on all devices**: Set up your phone, laptop, and browser
4. **Set up recovery**: Make sure you have your seed phrase stored safely

### Recommended Reading

| Guide | Description |
|-------|-------------|
| Managing 2FA | Daily TOTP usage, managing multiple accounts |
| Password Management | Storing and autofilling passwords |
| Backup and Recovery | Seed phrase, encrypted exports, verification |
| Privacy Tips | Duress PIN, cloaking, data minimization |
| Using the Ledger | Understanding your .aioss activity ledger |

### Configuration Tips

- **Appearance**: Customize the theme in Settings → Appearance
- **Auto-lock**: Set auto-lock timeout (30 seconds to 30 minutes)
- **Clipboard**: Configure clipboard clearing (3-60 seconds)
- **Browser Integration**: Set up the browser extension for autofill

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't scan QR code | Make sure camera permissions are enabled; increase screen brightness; clean camera lens |
| Wrong TOTP code | Check that the device time is synchronized (Settings → Sync Time) |
| Master password not working | Caps Lock may be on; check keyboard layout; use the "Show password" toggle |
| Can't find the "+" button | It's in the bottom-right corner (mobile) or top toolbar (desktop) |

### Getting Help

If you're stuck:
- **In-app help**: Settings → Help Center
- **Community Forum**: https://community.mfso.app
- **Discord**: https://discord.gg/mfso
- **Email**: support@mfso.app
- **Documentation**: https://docs.mfso.app

## Security Checklist

After your quickstart, verify these security basics:

- [ ] Master password is strong (12+ characters, complex)
- [ ] Seed phrase is written down and stored safely (not digitally)
- [ ] Seed phrase verification was completed
- [ ] Device PIN is set (not the same as master password)
- [ ] Biometric authentication is enabled (if available)
- [ ] Auto-lock is enabled (5 minutes or less)
- [ ] At least one account's 2FA is stored in MF+SO
- [ ] Encrypted backup export has been created
- [ ] App is updated to the latest version

## Keyboard Shortcuts

| Shortcut | Windows/Linux | macOS |
|----------|---------------|-------|
| Search vault | Ctrl+K | Cmd+K |
| Add entry | Ctrl+N | Cmd+N |
| Copy current TOTP | Ctrl+T | Cmd+T |
| Lock vault | Ctrl+L | Cmd+L |
| Settings | Ctrl+, | Cmd+, |
| Show/Hide password | Ctrl+Shift+P | Cmd+Shift+P |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*
