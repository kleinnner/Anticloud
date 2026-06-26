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

# Backup and Recovery (Community Guide)

## Table of Contents

1. [Why Backup Matters](#why-backup-matters)
2. [Understanding Your Recovery Options](#understanding-your-recovery-options)
3. [Seed Phrase Backup](#seed-phrase-backup)
4. [Encrypted Exports](#encrypted-exports)
5. [Emergency Kit](#emergency-kit)
6. [Verification Checklist](#verification-checklist)
7. [Recovery Scenarios](#recovery-scenarios)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Why Backup Matters

Your MF+SO vault contains your digital identity — passwords, 2FA codes, secure notes, and identity documents. Losing access to your vault means losing access to all of these.

### What Can Go Wrong

| Scenario | Risk | Backup Needed |
|----------|------|---------------|
| Lost phone | High | Seed phrase or export |
| Phone stolen | High | Seed phrase (export may be on stolen phone) |
| Phone water damaged | High | Seed phrase or cloud export |
| Computer crashed | Medium | Seed phrase or export |
| Forgot master password | High | Seed phrase |
| Hard drive failure | Medium | Seed phrase or export |
| House fire | Medium | Off-site backup (safety deposit box) |
| Ransomware | High | Offline backup (seed phrase on paper) |
| Accidental vault deletion | Medium | Export or cloud backup |

### The Golden Rule

**Your vault is only as recoverable as your weakest backup.**

If you have a seed phrase written down, you can always recover. If you don't, your vault may be permanently lost.

## Understanding Your Recovery Options

MF+SO provides multiple, layered backup and recovery options:

| Method | What It Protects | Best For |
|--------|-----------------|----------|
| Seed phrase | Full vault recovery | Complete device loss, disaster recovery |
| Encrypted export | Full vault contents | Quick restore, migration |
| Emergency kit | Seed phrase + 2FA codes + export password | Compact all-in-one backup |
| Device sync | Current vault state | Day-to-day device changes |
| Shards (advanced) | Split-key recovery | Distributed trust setup |

### Which Method Should You Use?

| Your Situation | Recommended |
|----------------|-------------|
| First time user | Seed phrase + Emergency kit |
| Daily user | Encrypted export (weekly) |
| Power user | Seed phrase + Encrypted export + Shards |
| Enterprise user | All methods + enterprise backup |

### Backup Comparison

| Feature | Seed Phrase | Encrypted Export | Emergency Kit |
|---------|-------------|------------------|---------------|
| Complete vault recovery | Yes | Yes | Yes (with export password) |
| Works offline | Yes | Yes | Yes |
| Human-readable | Yes (words) | No (encrypted file) | Partially |
| Updateable | No (new one on vault change) | Yes | No |
| Storage size | 24 words | Varies (KB-MB) | 1 page |
| Best storage | Paper (safe) | Encrypted cloud | Paper (safe) |
| Risk if stolen | Full vault access | Protected by export password | Protected |

## Seed Phrase Backup

Your seed phrase is a sequence of 24 words that can regenerate your entire vault. It is the most important backup you will ever make.

### Creating Your Seed Phrase Backup

#### Step 1: Initial Setup

When you create your MF+SO vault, you will be guided through seed phrase backup:

1. MF+SO displays 24 words, one at a time
2. The words are randomly generated from the BIP-39 word list
3. You must write them down in the exact order shown

#### Step 2: Writing the Words

**Do**:
- Use the provided seed phrase card
- Write clearly and legibly
- Number each word (1-24)
- Double-check each word as you write it
- Use a pen with permanent ink
- Store in a fireproof and waterproof container

**Do NOT**:
- Take a photo of the seed phrase
- Store it in a digital file (cloud, notes app, email)
- Type it into any device
- Share it with anyone
- Lose it

#### Step 3: Verification

After writing your seed phrase, MF+SO will ask you to verify it:

1. You'll be asked to enter specific words from your seed phrase
2. For example: "Enter word #7" and "Enter word #15"
3. Find these words on your written card and type them in
4. Complete enough challenges to prove you wrote it down correctly

**Important**: Do not skip the verification step. This confirms your backup is correct.

#### Step 4: Safe Storage

Where to store your seed phrase:

| Location | Security | Accessibility | Recommendation |
|----------|----------|---------------|----------------|
| Home fireproof safe | High | Immediate | Primary backup |
| Bank safety deposit box | Very High | Delayed (bank hours) | Secondary backup |
| Trusted family member | Medium | Variable | Third backup |
| Home (hidden, not safe) | Low | Immediate | Not recommended |

#### Step 5: Creating Multiple Copies

For maximum safety, create at least two copies:

1. **Copy 1**: In your home safe (for quick access)
2. **Copy 2**: In a bank safety deposit box (off-site protection)
3. **Copy 3**: With a trusted family member (backup)

**Label each copy clearly** so that in an emergency, someone knows what it is.

### When to Create a New Seed Phrase

You should create a new seed phrase if:
- Your current seed phrase may have been exposed
- You've recovered your vault and the seed phrase has changed
- You want to migrate to a new vault
- It's been more than 2 years (periodic rotation recommended)

### Seed Phrase and Passphrase

If you use a BIP-39 passphrase (advanced):
- Store the passphrase **separately** from the seed phrase
- Without the passphrase, the seed phrase alone cannot access your vault
- This provides protection if someone finds your seed phrase
- But it also means you need to back up both

## Encrypted Exports

An encrypted export is a file containing all your vault data, protected by an export password.

### Creating an Export

1. Open MF+SO
2. Go to Settings → Export
3. Choose what to export:
   - **Full Vault Export**: Everything
   - **Passwords Only**: Just password entries
   - **TOTP Only**: Just 2FA accounts
   - **Selective**: Choose specific entries
4. Set an export password:
   - Must be at least 12 characters
   - Should be different from your master password
   - Write this password down (you'll need it to import)
5. Choose export location:
   - **Download**: Save to your device
   - **Email**: Send to your email (encrypted)
   - **Cloud**: Save to iCloud, Google Drive, or Dropbox
   - **USB**: Save to external drive
6. Tap "Export"
7. Verify the export was created successfully

### Export Password Rules

| Rule | Reason |
|------|--------|
| Minimum 12 characters | Brute force protection |
| Different from master password | Defense in depth |
| Write it down | You will forget it |
| Store separately from export | If one is compromised, other protects |

### How Often to Export

| Usage Pattern | Recommended Frequency |
|---------------|----------------------|
| Heavy daily use | Weekly |
| Moderate use | Monthly |
| Occasional use | After each significant change |
| Before travel | Always |
| Before device reset | Always |

### Where to Store Exports

| Location | Security | Accessibility |
|----------|----------|---------------|
| Encrypted cloud storage | High (if encrypted) | High |
| USB drive in safe | High | Medium |
| Second device | Medium | High |
| Email to yourself | Low | High | 

**Important**: Store export password separately from the export file.

### Verifying an Export

After creating an export, verify it works:

1. On a different device or in a test vault:
   - Install MF+SO (or use a different profile)
   - Choose "Import from Export"
   - Select your export file
   - Enter the export password
   - Confirm all entries are present
2. Delete the test vault after verification
3. Store the export file in your chosen location

## Emergency Kit

The emergency kit is a compact, mostly-offline backup that includes everything needed to recover your vault.

### What's in the Kit

The emergency kit contains:
1. **Your seed phrase** (written in numbered boxes)
2. **Top 5 TOTP recovery codes** (for your most important services)
3. **Export password hint** (enough to remember, not enough for others)
4. **MF+SO support contact** (email, phone, website)
5. **Recovery instructions** (simple steps for a non-technical person)

### Creating the Kit

1. Go to Settings → Emergency Kit
2. MF+SO generates a formatted page
3. Print the page (or write the details onto the provided card)
4. Store the kit in a secure location
5. Tell a trusted person where it is

### Using the Kit

The kit is designed for emergency situations:
- You lost all devices
- You need someone else to help you recover (family member, executor)
- You're traveling without your devices

### Kit Storage

- **Home safe**: Good for quick access
- **Safety deposit box**: Best for long-term security
- **With attorney**: For estate planning
- **With family member**: For emergency access

## Verification Checklist

### Weekly Checks

- [ ] Can I still access my vault? (Open MF+SO, see my entries)
- [ ] Is sync working? (Make a change, check on another device)

### Monthly Checks

- [ ] Seed phrase is still where I stored it
- [ ] Emergency kit is still in its location
- [ ] Latest encrypted export is less than 30 days old
- [ ] Export password is documented (somewhere safe)

### Quarterly Checks

- [ ] Test seed phrase recovery (create a temporary vault, recover with seed phrase, delete)
- [ ] Test export recovery (import into a test vault, verify entries, delete)
- [ ] Update export with latest vault state
- [ ] Review storage locations (safe, bank box, etc.)

### Annual Checks

- [ ] Consider rotating seed phrase
- [ ] Update emergency kit if needed
- [ ] Review trusted contacts for shard recovery
- [ ] Check that backups are still accessible

## Recovery Scenarios

### Scenario 1: Lost Your Phone (Have Seed Phrase)

**Time needed**: 5-10 minutes
**Difficulty**: Easy

1. Install MF+SO on a new device
2. Choose "Recover from Seed Phrase"
3. Enter your 24-word seed phrase
4. Set a new device PIN
5. Your vault is restored
6. Create a new export

### Scenario 2: Lost Your Phone (Have Export File)

**Time needed**: 2-5 minutes
**Difficulty**: Easy

1. Install MF+SO on a new device
2. Transfer the export file to the new device
3. Choose "Import from Export"
4. Enter your export password
5. Your vault is imported

### Scenario 3: Computer Crash (Have Seed Phrase)

**Time needed**: 5-10 minutes
**Difficulty**: Easy

1. Install MF+SO on a new/repaired computer
2. Choose "Recover from Seed Phrase"
3. Enter your 24-word seed phrase
4. Set a new device PIN
5. Your vault is restored

### Scenario 4: Everything Lost (No Seed Phrase, No Export)

**Time needed**: Varies
**Difficulty**: Very Hard — may be impossible

1. Contact MF+SO support immediately
2. Provide identity verification (email, phone, ID)
3. Support may be able to help if you have encrypted vault data on the server
4. If you used MF+SO offline-only, the vault cannot be recovered

**Important**: This scenario is why seed phrase backup is critical.

### Scenario 5: House Fire (Off-Site Backup Needed)

**Time needed**: 5-10 minutes (if you have off-site backup)
**Difficulty**: Medium

1. Retrieve your seed phrase from the safety deposit box
2. Purchase a new device
3. Install MF+SO
4. Recover with seed phrase
5. Restore from off-site export (if you had one)

### Scenario 6: Inheritance

If you've set up digital inheritance:
1. Your designated contact receives instructions from MF+SO
2. They provide the required legal documentation
3. MF+SO verifies and releases access
4. The beneficiary creates a new vault

## Best Practices

### Do

- **Store seed phrases on paper** (not digitally)
- **Make multiple copies** in different locations
- **Test your backups** regularly (quarterly)
- **Keep exports current** (monthly or after significant changes)
- **Use export passwords** that are strong and documented
- **Label backups clearly** so they're identifiable in an emergency
- **Tell a trusted person** where your backups are
- **Include vault access in your estate plan**

### Don't

- **Don't take photos** of your seed phrase
- **Don't store seed phrases** in cloud storage, email, or notes apps
- **Don't share seed phrases** with anyone, including MF+SO support
- **Don't use your master password** as your export password
- **Don't store export passwords** with the export file
- **Don't forget** to test your backups

### Traveling

When traveling:
- Take a current encrypted export on a separate USB drive
- Keep your seed phrase at home (don't travel with it)
- Know your export password (memorized)
- Have a plan if your device is lost or stolen abroad

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Can't find seed phrase | Misplaced | Check all safe locations, safety deposit box |
| Seed phrase doesn't work | Wrong words or order | Check each word carefully |
| Export password forgotten | Not documented | Try similar passwords, check password manager |
| Export file corrupted | Storage media failure | Use an older export if you have one |
| Verification failed | Seed phrase written incorrectly | Contact support for recovery options |

### Recovery Fails

If recovery fails:
1. **Don't panic**: Stop and think about what might be wrong
2. **Check the seed phrase**: Verify each word and its position
3. **Try passphrase**: If you used one, make sure you're entering it
4. **Check the export password**: Remember or find documented password
5. **Contact support**: They can guide you through recovery
6. **Use another method**: If one method fails, try another

### Seed Phrase Problems

| Error Message | Likely Cause | Solution |
|---------------|-------------|----------|
| "Invalid word" | Misspelling or wrong word | Check BIP-39 word list |
| "Checksum invalid" | Wrong word in position 24 | Re-verify all words |
| "Wrong number of words" | Missing or extra word | Count carefully |
| "No vault found" | Wrong vault or passphrase | Check passphrase |

### Export Problems

| Error Message | Likely Cause | Solution |
|---------------|-------------|----------|
| "Wrong password" | Export password incorrect | Try other passwords |
| "File corrupted" | File damaged | Use backup copy |
| "Format not recognized" | Wrong file type | Check file extension |

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
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