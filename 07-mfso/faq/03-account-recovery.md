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

# Account Recovery FAQ

> **Last Updated:** 2026-06-19
> **Category:** Account & Recovery

## Can MF+SO reset my password?

No. Due to MF+SO's zero-knowledge architecture, your master password is never stored or transmitted to our servers. This means:
- We cannot reset your password
- We cannot recover your vault
- We cannot access your data

This is a **security feature**, not a bug. If we could reset your password, that would mean we have access to your encryption keys — and so would any attacker who compromised our systems.

## I forgot my master password. What can I do?

Your options depend on what recovery methods you set up during initial configuration:

### Option 1: Biometric unlock
If you enrolled biometric unlock (fingerprint, face, etc.) before forgetting your password:
1. Open MF+SO
2. Select "Unlock with biometrics"
3. Once inside, go to **Settings > Security > Change Master Password**
4. Set a new password

### Option 2: Seed phrase recovery
If you saved your 24-word recovery seed phrase:
1. Uninstall and reinstall MF+SO
2. Select "Recover from seed phrase"
3. Enter your 24 words in order
4. Set a new master password

### Option 3: Emergency sheet
If you printed or saved your emergency sheet:
1. The sheet contains QR codes that can be scanned to restore your vault
2. Uninstall and reinstall MF+SO
3. Select "Recover from backup"
4. Scan the QR code on your emergency sheet

### Option 4: Backup file
If you have an encrypted backup file:
1. Uninstall and reinstall MF+SO
2. Select "Restore from backup"
3. Choose your backup file
4. Enter your backup passphrase

## What is the seed phrase recovery?

During initial setup, MF+SO generates a **24-word BIP-39 seed phrase** that can be used to recover your vault. This phrase is:
- **Never stored** on MF+SO servers
- **Never transmitted** over the network
- **Only shown once** during initial setup
- **Cryptographically generated** from your device's secure random number generator

The seed phrase can regenerate all your encryption keys. It is the master key to your identity vault.

### Important warnings:
- Store your seed phrase **offline** (write it down, store in a safe)
- Never type it into any website
- Never take a photo of it with cloud-synced photos
- Anyone with your seed phrase has full access to your vault

## I lost my seed phrase. Can you help?

We cannot recover lost seed phrases. This is by design — if we could recover them, so could an attacker.

Without your seed phrase or a backup file, and without your master password, **your vault data is permanently inaccessible**.

This is why we strongly recommend:
1. **Write down your seed phrase** and store it in a safe location
2. **Print your emergency sheet** and keep it in a secure place
3. **Create an encrypted backup** and store it externally
4. **Set up biometric unlock** on all your devices

## I lost my phone. How do I recover my vault?

### If you have another device with MF+SO installed
1. Install MF+SO on your new device
2. Sign in to sync (Premium feature or Free with 2 devices)
3. Your vault will restore from the encrypted sync

### If this was your only device
You need either:
- Your **seed phrase** (see recovery instructions above)
- Your **encrypted backup file** + backup passphrase
- Your **emergency sheet**

If you have none of these, your vault cannot be recovered.

## I lost my device with MF+SO. What about my TOTP accounts?

If your device is lost or stolen:
1. **Immediately revoke** MF+SO sync access via mfso.io/account
2. **Regenerate recovery codes** for each service you use 2FA with
3. **Contact the security team** at each service provider to report the device lost
4. **Set up new 2FA** with a fresh device once recovered

## Can I use multiple recovery methods?

Yes. We strongly encourage setting up multiple recovery methods:
- ✅ Seed phrase (required during setup)
- ✅ Biometric unlock (recommended)
- ✅ Emergency sheet (recommended)
- ✅ Encrypted backup (recommended)
- ✅ Secondary device sync (Premium)

## What happens to my data if I don't use MF+SO for a long time?

**Personal accounts:**
- After 12 months of inactivity, your sync data is marked for deletion
- You receive email reminders at 3, 6, 9, and 12 months
- After deletion, sync data cannot be recovered
- Local device data remains accessible if you still have the device

**Enterprise accounts:**
- Retention policies are configurable by your organization's administrator
- Typical enterprise retention: 90 days after deactivation
- Contact your organization's IT department

## How do I proactively prepare for recovery?

1. **During setup:**
   - Write down your 24-word seed phrase
   - Store it in a fireproof safe or safety deposit box
   - Print and store the emergency sheet

2. **Regularly:**
   - Create encrypted backups (Settings > Backup)
   - Store backups on external media or cloud storage
   - Verify your seed phrase annually by performing a test recovery on a secondary device

3. **Best practices:**
   - Never store your seed phrase digitally (no photos, no cloud, no email)
   - Use a password manager to store a hint, not the phrase itself
   - Tell a trusted person where your seed phrase is stored (for inheritance planning)

## Can I recover my enterprise account differently?

Enterprise accounts have additional recovery options:
- **Admin reset** — Enterprise administrators can initiate a password reset flow for managed users
- **Escrow keys** — Organizations can configure key escrow for compliance
- **Emergency access** — Configured emergency contacts can request access
- **Account recovery codes** — Enterprise administrators can generate single-use recovery codes

Contact your organization's MF+SO administrator for assistance.

## What is the emergency sheet?

The emergency sheet is a printable document containing:
- QR code encoding your encrypted vault
- QR code encoding your recovery seed phrase (encrypted)
- QR code encoding recovery instructions
- Basic account information
- Space for storing the sheet in a secure location

The emergency sheet allows someone (or you) to recover your vault using:
- The sheet itself
- A passphrase you separately share with a trusted contact

## How do I set up emergency access?

Emergency access allows trusted contacts to request access to your vault:

```
You → Designate emergency contacts
   → Set waiting period (e.g., 7 days)
   → Contacts can request access if you're unresponsive
   → You receive notification and can deny the request
   → After waiting period, contact gains access
```

Available in Premium tier and above.

## What about inheritance planning?

For family and inheritance planning:
1. Store your seed phrase in a will or with your estate attorney
2. Use the emergency access feature to designate trusted contacts
3. Create a sealed envelope with your seed phrase in a safe deposit box
4. Document your MF+SO accounts and their locations
5. Consider a digital estate planning service

## Can I change my recovery seed phrase?

No. The seed phrase is derived from your device's initial cryptographic setup and cannot be changed without resetting your entire vault.

To get a new seed phrase:
1. Export all your accounts (Settings > Export)
2. Delete your vault (Settings > Delete Vault)
3. Set up a new vault (this generates a new seed phrase)
4. Re-import your accounts

## What is the difference between the master password and the backup passphrase?

| | Master Password | Backup Passphrase |
|---|---|---|
| **Purpose** | Unlock your vault daily | Encrypt backup files |
| **When set** | During initial vault creation | When creating encrypted backup |
| **Can be changed** | Yes (from within vault) | Yes (create new backup) |
| **Can be reset** | No (zero knowledge) | No |
| **Required for** | App unlock, TOTP viewing, adding accounts | Restoring from backup |
| **If forgotten** | Use seed phrase or biometric | Create new backup with new passphrase |
| **Length requirement** | Min 12 characters | Min 8 characters |
| **Strength** | Argon2id derived (memory-hard) | XChaCha20-Poly1305 derived |

## How do I safely store my recovery seed phrase?

### Recommended Storage Methods

**Primary: Written copy stored securely**
- Write the 24 words on the provided card (included with physical orders)
- Use a permanent marker on quality paper
- Store in a fireproof home safe
- Do NOT laminate (ink may degrade)

**Backup: Safety deposit box**
- Store a second copy in a bank safety deposit box
- Update if you change your master password
- Ensure your estate executor knows where it is

**Digital: Only if using offline encryption**
- Store in an encrypted file (not in cloud)
- Use a second encryption layer (e.g., VeraCrypt volume)
- Store on offline media (USB drive in safe)

### Storage Methods to AVOID

| Method | Risk | Why |
|---|---|---|
| Photo on phone | High | Cloud sync, malware, theft |
| Email to yourself | Critical | Email compromise = vault compromise |
| Password manager | Medium | Contradiction: egg and basket problem |
| Notes app (iCloud) | High | iCloud breach risk |
| SMS to yourself | Critical | SIM swap attack |
| WhatsApp message | High | Cloud backup, account compromise |

### Seed Phrase Safety Checklist

- [ ] Written down with pen on paper (not typed)
- [ ] Two copies in separate physical locations
- [ ] No digital photographs taken
- [ ] Not stored in any cloud service
- [ ] Spelling of each word verified against BIP-39 word list
- [ ] Word order verified (not just the words themselves)
- [ ] Tested by performing a recovery on a secondary device
- [ ] Location documented in estate planning
- [ ] Trusted person informed of location
- [ ] Reviewed annually for readability

## What is the BIP-39 seed phrase and why 24 words?

BIP-39 (Bitcoin Improvement Proposal 39) is a standard for mnemonic seed phrases. MF+SO uses the same standard for recovery phrases.

### Why BIP-39?
- **Proven standard** — Used by billions of dollars in cryptocurrency
- **Language support** — Available in 10+ languages
- **Checksum** — Last word includes a checksum to detect errors
- **Widely supported** — Can be recovered in any BIP-39 compatible wallet

### Why 24 words instead of 12?
- **12 words:** 128 bits of entropy (adequate for most uses)
- **24 words:** 256 bits of entropy (future-proof, quantum-resistant)
- MF+SO uses 24 words to ensure long-term security (post-quantum era)

### Entropy Comparison
| Phrase Length | Entropy Bits | Possible Combinations | Security Level |
|---|---|---|---|
| 12 words | 128 | 2^128 (3.4 × 10^38) | Good |
| 24 words | 256 | 2^256 (1.1 × 10^77) | Post-quantum safe |

### Word List Languages
| Language | Standard |
|---|---|
| English | Default |
| Chinese (Simplified) | BIP-39 Chinese (Simplified) |
| Chinese (Traditional) | BIP-39 Chinese (Traditional) |
| French | BIP-39 French |
| Italian | BIP-39 Italian |
| Japanese | BIP-39 Japanese |
| Korean | BIP-39 Korean |
| Spanish | BIP-39 Spanish |

## How does biometric recovery work?

Biometric recovery allows you to unlock your vault using fingerprints or facial recognition without entering your master password.

### How It Works
1. During setup, MF+SO generates an intermediate recovery key
2. The recovery key is encrypted using the device's biometric-keyed encryption
3. The encrypted recovery key is stored in the device's secure enclave
4. When you authenticate with biometrics, the secure enclave decrypts the recovery key
5. The recovery key is used to unlock the vault for the session

### Security Properties
- Biometric data never leaves the device's secure enclave
- The recovery key is bound to the specific device hardware
- After 5 failed biometric attempts, master password is required
- Biometric unlock can be revoked remotely (Enterprise)

### Limitations
- Only works on devices where biometric was initially enrolled
- Adding a new fingerprint/face may not carry over (iOS Secure Enclave behavior)
- Requires supported hardware (Secure Enclave, TPM, TEE)

## How does emergency access work in detail?

Emergency access allows designated contacts to request access to your vault if you become unavailable.

### Setup Process
1. Go to Settings > Security > Emergency Access
2. Tap "Add Emergency Contact"
3. Enter the contact's MF+SO email address
4. Set the waiting period (1-30 days)
5. Configure what they can access (all vault or specific items)

### Access Request Flow
```
Contact requests access
        │
        ▼
You receive notification: 
"[Contact] is requesting access 
to your vault in 7 days"
        │
        ├──→ [Deny] Request cancelled immediately
        │
        ├──→ [Ignore] Waiting period continues
        │
        └──→ [Allow] Access granted immediately
    
        ▼
After waiting period expires:
- Contact receives encryption keys
- Contact can access vault
- You receive final notification
- Access can be revoked anytime
```

### Best Practices
- Designate 2-3 emergency contacts (different types)
- Set appropriate waiting periods (7 days is recommended)
- Use a "check-in" system with family members
- Inform your emergency contacts and explain the process
- Review emergency contacts annually

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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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