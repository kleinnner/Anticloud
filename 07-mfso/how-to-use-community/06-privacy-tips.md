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

# Privacy Tips

## Table of Contents

1. [Introduction](#introduction)
2. [Duress PIN](#duress-pin)
3. [Cloaking Mode](#cloaking-mode)
4. [Data Minimization](#data-minimization)
5. [Privacy-First Configuration](#privacy-first-configuration)
6. [Sharing Safely](#sharing-safely)
7. [Travel Privacy](#travel-privacy)
8. [Advanced Privacy Features](#advanced-privacy-features)
9. [Privacy FAQ](#privacy-faq)

## Introduction

MF+SO is built on the principle of sovereign identity — you own your data, and you control who can access it. This guide covers privacy features and best practices to help you protect your identity and data.

### MF+SO's Privacy Promise

- **Zero-knowledge encryption**: MF+SO servers never see your plaintext data
- **No tracking**: We don't track your usage or behavior
- **Minimal data collection**: Only what's necessary for the service to function
- **Open verification**: The .aioss ledger is independently verifiable
- **No third-party sharing**: Your data is never sold or shared

### Privacy Threats

| Threat | Description | MF+SO Protection |
|--------|-------------|------------------|
| Shoulder surfing | Someone looking at your screen | Cloaking, auto-hide |
| Physical coercion | Forced to unlock your vault | Duress PIN |
| Device theft | Your device containing vault access | Encryption, remote wipe |
| Surveillance | Monitoring your online activity | Encrypted traffic, no tracking |
| Data brokers | Aggregating your personal data | Data minimization |
| Corporate tracking | Service provider analyzing your usage | Zero-knowledge architecture |

## Duress PIN

### What is a Duress PIN?

A duress PIN is a special code that, when entered, appears to unlock your vault but actually:

1. **Unlocks a decoy vault**: Shows a fake vault with non-sensitive entries
2. **Triggers an alert**: Secretly notifies your emergency contacts
3. **Logs the event**: Records the duress event in the .aioss ledger
4. **Preserves evidence**: The real vault remains encrypted and secure

### Setting Up Duress PIN

1. Go to Settings → Security → Duress PIN
2. Tap "Set Up Duress PIN"
3. Choose your duress PIN (different from your regular PIN):
   - Minimum 6 digits
   - Should look like a normal PIN
   - Easy to remember under stress
4. Optional: Set up the decoy vault:
   - Add a few non-sensitive entries
   - These will be shown when duress PIN is used
5. Optional: Add emergency contacts:
   - These contacts will be notified (silently)
   - They receive a pre-configured alert message
6. Tap "Save"

### Using Duress PIN

Under duress, simply enter your duress PIN instead of your regular PIN:
- The app opens normally (to the decoy vault)
- The attacker sees a functional vault
- Your real vault remains hidden
- Emergency contacts are notified

### Example Scenario

You're stopped at a border crossing. An official demands you unlock your phone. You enter your duress PIN. The official sees a vault with a few unimportant entries. Meanwhile, your emergency contact receives a discreet alert that you've used your duress PIN.

### Duress PIN Best Practices

- **Use a pattern**: Make the duress PIN a variation of your regular PIN (e.g., regular: 1234, duress: 1243)
- **Practice**: Remember which PIN is which
- **Don't save it**: Never write down that you have a duress PIN
- **Update contacts**: Keep emergency contacts current
- **Test occasionally**: Verify it still works after app updates

## Cloaking Mode

### What is Cloaking?

Cloaking mode hides the content of your vault from view. When enabled:

- Entry names are hidden or replaced with generic names
- TOTP codes are masked
- Password fields show only dots
- The vault appears empty or contains only non-sensitive items

### Enabling Cloaking

**Quick Toggle**:
1. Tap the cloak icon in the top toolbar
2. The vault immediately cloaks
3. Tap again to uncloak

**Automatic Cloaking**:
1. Go to Settings → Privacy → Cloaking
2. Enable "Auto-cloak on app switch"
3. Enable "Auto-cloak after inactivity"
4. Set the inactivity timeout (15 seconds recommended)

**Scheduled Cloaking**:
1. Set a schedule for automatic cloaking
2. Example: Cloak automatically between 10 PM and 7 AM
3. Useful if someone might access your device while you sleep

### Cloaking Levels

| Level | What's Hidden | Visual Effect |
|-------|---------------|---------------|
| Mild | Only TOTP codes are masked | Codes show as •••••• |
| Moderate | Entry names and codes are hidden | Names replaced with generic titles |
| Full | Entire vault appears empty | "No entries" message shown |
| Decoy | Decoy entries are shown instead | Fake entries with plausible names |

### Cloaking Triggers

You can configure multiple triggers:
- **Proximity**: Use NFC tags or Bluetooth beacons to auto-cloak
- **WiFi**: Cloak when not connected to trusted networks
- **Location**: Cloak when at specific locations (border crossings, airports)
- **Time**: Cloak during specific hours
- **Headphones**: Cloak when headphones are disconnected (undesired audio)

### Face Detection Cloaking

On supported devices (iOS, Android):
1. Settings → Privacy → Face Detection
2. Enable "Auto-cloak when face not detected"
3. The app monitors for your face using the front camera
4. If someone else looks at the screen, content is hidden
5. App shows a "Camera in use" indicator for transparency

## Data Minimization

### What to Store in Your Vault

**Safe to Store**:
- Usernames and passwords
- TOTP setup keys
- Secure notes (non-personal)
- Recovery codes
- Non-sensitive identity info

**Be Careful With**:
- Full home address
- Social Security / National ID numbers
- Passport scans
- Bank account numbers
- Medical information

**Avoid Storing**:
- Information you wouldn't want exposed
- Data you don't need regular access to
- Secrets that should never be digital

### Vault Entry Privacy Settings

Each vault entry has privacy settings:

1. Open an entry → Edit → Privacy
2. Configure:
   - **Hide from search**: Entry won't appear in search results
   - **Hide from quick view**: Entry won't show on dashboard
   - **Require master password**: Require master password (not just PIN) to view
   - **Auto-lock on view**: Lock vault after viewing this entry
   - **Cloak priority**: This entry is always cloaked

### Minimizing Metadata

MF+SO collects minimal metadata:

| Data Point | Collected | Purpose | Retention |
|------------|-----------|---------|-----------|
| Email address | Yes | Account identification | Until account deletion |
| Device type | Yes | Service optimization | 30 days |
| OS version | Yes | Compatibility | 30 days |
| App version | Yes | Update management | 30 days |
| Usage statistics | No | — | — |
| IP address | Temporarily | Rate limiting | 24 hours |
| Location | No | — | — |
| Browsing history | No | — | — |

### Disabling Telemetry

1. Go to Settings → Privacy → Telemetry
2. Options:
   - **Disable all telemetry**: No usage data sent
   - **Disable crash reporting**: App crashes not reported
   - **Disable diagnostics**: No diagnostic data
3. All telemetry is disabled by default

## Privacy-First Configuration

### Recommended Settings

| Setting | Recommendation | Why |
|---------|---------------|-----|
| Auto-lock timer | 1 minute | Minimizes exposure window |
| Clipboard clear | 10 seconds | Prevents code/password lingering |
| Screen capture | Blocked | Prevents visual data theft |
| App switcher preview | Hidden | Hides content in app overview |
| Notification previews | Hidden | Codes/passwords hidden in notifications |
| Biometric unlock | Enabled | Faster access, no password exposure |
| Auto-cloak on switch | Enabled | Hides content when switching apps |

### Lock Screen Privacy

1. Go to Settings → Privacy → Lock Screen
2. Configure:
   - **Hide notifications**: TOTP codes not shown in notifications
   - **Notification content**: "MF+SO: New code" instead of the actual code
   - **Widget privacy**: Vault widgets show only generic content
   - **Quick actions**: Disable quick actions on lock screen

### Browser Privacy

| Setting | Recommendation | Why |
|---------|---------------|-----|
| Autofill on HTTPS only | Enabled | Prevents autofill on insecure pages |
| Save browsing history | Disabled | No record of sites visited |
| Clear autofill data on lock | Enabled | Data cleared when vault locks |
| Disable autofill on private browsing | Enabled | Extra privacy in incognito mode |

### Network Privacy

1. **Always use VPN**: MF+SO traffic is encrypted, but VPN adds network-level privacy
2. **Tor compatibility**: MF+SO works over Tor (with some latency)
3. **DNS over HTTPS**: Use secure DNS for additional privacy
4. **Disable LAN discovery**: Prevent other devices on your network from detecting MF+SO

## Sharing Safely

### Sharing Risks

When you share vault entries:
- **The recipient** now has access to the shared credential
- **You can't control** what they do with it
- **They might share it** further
- **They might lose** their device containing the shared data

### Safe Sharing Practices

1. **Share one-time passwords**, not the actual secret
2. **Set expiration** on shared items
3. **Use emergency access** instead of permanent sharing
4. **Share only what's needed** — not your entire vault
5. **Revoke access** when no longer needed

### Emergency Access

Emergency access allows someone to request access to your vault:
1. They request access (in-app)
2. You're notified
3. A timer starts (configurable: 24-72 hours)
4. You can deny the request
5. If you don't deny it, access is granted after the timer

### Recipient Privacy

When sharing with someone:
- They don't see your other vault entries
- They don't know what else you have in your vault
- The shared entry is added to their vault (not linked to yours)
- They can't see who else you've shared with

## Travel Privacy

### Pre-Travel Checklist

- [ ] Enable duress PIN
- [ ] Enable cloaking (with schedule)
- [ ] Create a travel vault (separate, limited vault for travel)
- [ ] Remove sensitive entries from main vault
- [ ] Disable biometric unlock (can be compelled)
- [ ] Set up auto-wipe (after X failed attempts)
- [ ] Export travel-only vault (minimal entries)
- [ ] Backup main vault (seed phrase at home)
- [ ] Update emergency contacts
- [ ] Review auto-cloak settings

### Crossing Borders

1. **Use duress PIN** if required to unlock your device
2. **Keep seed phrase at home** — never travel with it
3. **Use travel vault**: A separate vault with only travel-needed entries
4. **Enable auto-cloak** for duration of travel
5. **Disable biometrics** (can be compelled in many jurisdictions)

### Device Loss Abroad

If your device is lost or stolen while traveling:
1. Use another device to access your vault (if synced)
2. Log into mfso.app on a borrowed device
3. Trigger "Remove All Devices" to revoke access
4. Change your master password
5. Contact support for recovery assistance

## Advanced Privacy Features

### Steganographic Vault

For advanced users: hide your vault inside innocuous files:
1. Your vault can be embedded in an image, audio file, or document
2. Only you know which file contains your vault
3. Without knowing where to look, the vault is invisible

### Vault Splitting

Split your vault into multiple identities:
1. Create multiple vaults (up to 5)
2. Each vault has its own seed phrase
3. Each vault has different entries
4. Different vaults for: work, personal, travel, anonymous

### Disappearing Messages

For shared entries:
1. Enable "Self-destruct" on shared entries
2. Set a timer (1 hour to 30 days)
3. After the timer expires, the entry is deleted from the recipient's vault
4. No trace remains

### Anonymous Mode

Use MF+SO without creating an account:
1. No email required
2. No sync (vault exists only on your device)
3. Local backups only
4. Full functionality except sync

## Privacy FAQ

### General

**Q: Can MF+SO see my passwords?**
A: No. All data is encrypted on your device before being sent to our servers. We never have access to your plaintext passwords, TOTP seeds, or vault contents.

**Q: Does MF+SO track my usage?**
A: No. All tracking and telemetry is disabled by default. You can verify in Settings → Privacy → Telemetry.

**Q: Can law enforcement access my vault?**
A: Without your master password or seed phrase, it is cryptographically impossible to access your vault. MF+SO cannot provide access because we don't have the ability to decrypt your vault.

**Q: What happens if MF+SO is acquired?**
A: The zero-knowledge architecture means an acquiring company still cannot access user data. The .aioss ledger ensures transparency of any changes.

### Technical

**Q: Is the vault encrypted at rest?**
A: Yes. AES-256-GCM encryption with keys derived from your master password and device key.

**Q: Is data encrypted in transit?**
A: Yes. TLS 1.3 with perfect forward secrecy for all communications.

**Q: Are screenshots of the vault blocked?**
A: On supported platforms (iOS, Android with managed devices), screenshots are blocked. Desktop apps can prevent screen capture.

**Q: Can I use MF+SO anonymously?**
A: Yes. Use the offline-only mode (no email registration required).

### Legal

**Q: Does MF+SO comply with GDPR?**
A: Yes. MF+SO is fully GDPR-compliant, including right to access, right to erasure, and data portability.

**Q: Where is my data stored?**
A: Encrypted vault data is stored on MF+SO servers. The physical location depends on your chosen server region (US, EU, or custom for enterprise).

**Q: Does MF+SO share data with third parties?**
A: No. MF+SO never shares, sells, or transfers user data to third parties.

**Q: Can I delete my account and all data?**
A: Yes. Account deletion permanently removes all your data from our servers. The .aioss ledger entries are anonymized (immutable record, but unlinked from you).

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ