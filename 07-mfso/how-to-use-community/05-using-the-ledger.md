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

# Using the .aioss Ledger

## Table of Contents

1. [What is the .aioss Ledger?](#what-is-the-aioss-ledger)
2. [Why It Matters](#why-it-matters)
3. [How the Ledger Works (Simple)](#how-the-ledger-works-simple)
4. [Accessing Your Ledger](#accessing-your-ledger)
5. [Ledger Entry Types](#ledger-entry-types)
6. [Verification and Trust](#verification-and-trust)
7. [Practical Uses](#practical-uses)
8. [Privacy and the Ledger](#privacy-and-the-ledger)
9. [Enterprise Features](#enterprise-features)

## What is the .aioss Ledger?

The .aioss ledger is a digital record book that tracks important events in your MF+SO vault. Think of it as a tamper-proof diary that records every significant action related to your identity and authentication.

### A Simple Analogy

Imagine a physical notebook where:
1. Every time you do something important in your vault, a new page is added
2. Each page is numbered and linked to the previous page
3. The notebook is stored in a bulletproof glass case that everyone can see but no one can touch
4. You can verify that no pages have been removed or changed

That's essentially what the .aioss ledger is — an append-only, tamper-evident record.

### Ledger vs. Regular Logs

| Feature | Regular Logs | .aioss Ledger |
|---------|-------------|---------------|
| Can be modified | Yes (by admin) | No (immutable) |
| Tamper detection | Difficult | Cryptographic proof |
| Decentralized | No | Yes (distributed) |
| User-verifiable | Sometimes | Always |
| Time source | Server clock | Consensus timestamp |
| Audit validity | Trust-based | Cryptography-based |

### Technical Description (Non-Technical)

The .aioss ledger is a distributed ledger technology (DLT) purpose-built for identity and authentication events. Unlike blockchain-based systems, .aioss is designed for:

- **Privacy**: Only metadata is recorded on the ledger, not your secrets
- **Speed**: Entries are confirmed in under 2 seconds
- **Efficiency**: Low energy consumption (not proof-of-work)
- **Compliance**: Meets GDPR, SOC 2, and other regulatory requirements
- **Sovereignty**: You can verify your own ledger without relying on MF+SO

## Why It Matters

### For You as a User

The ledger matters because it gives you:

1. **Proof of Identity Actions**: You can prove when you created your vault, added a 2FA code, or changed your password
2. **Dispute Resolution**: If there's ever a question about when something happened, the ledger provides an immutable record
3. **Security Monitoring**: You can review who accessed your vault and when
4. **Trust Without Reliance**: You don't have to trust MF+SO — you can verify the ledger yourself
5. **Regulatory Compliance**: For enterprise users, the ledger provides auditable proof of compliance

### Real-World Scenarios

**Scenario 1: Account Dispute**
You're told you logged into a service at 3 AM. You check your .aioss ledger and see that no authentication event occurred at that time. You have cryptographic proof it wasn't you.

**Scenario 2: Compliance Audit**
Your organization is being audited. The auditor asks: "Can you prove that all employees had MFA enabled by January 1st?" The enterprise ledger provides tamper-proof evidence.

**Scenario 3: Security Investigation**
You suspect someone accessed your vault. The ledger shows every authentication attempt with cryptographic proof. You can confirm no unauthorized access occurred.

**Scenario 4: Recovery Verification**
After recovering your vault, the ledger confirms the recovery event and provides proof of vault continuity.

## How the Ledger Works (Simple)

### Entries and Blocks

The ledger is built from entries grouped into blocks:

1. **Entry**: A single event (e.g., "vault created", "TOTP added")
2. **Block**: A group of entries confirmed together (every few seconds)
3. **Chain**: Each block references the previous block (hence "blockchain")
4. **Consensus**: Multiple nodes agree on the block contents

### Cryptographic Linking

Each block contains:
- **Hash**: A unique fingerprint of this block's data
- **Previous Hash**: The fingerprint of the previous block
- **Timestamp**: When the block was created (consensus time)
- **Signature**: Signed by the consensus nodes

This creates a chain where:
- If someone changes an old block, its hash changes
- This breaks the link to the next block
- The tampering is immediately detectable

### Your Vault Key and the Ledger

The ledger entries related to your vault are linked to your vault's public key. This means:

1. You can prove entries belong to you (only you have the private key)
2. Others can verify entries are yours (your public key is known)
3. No one can forge entries (they don't have your private key)
4. MF+SO cannot create entries on your behalf

## Accessing Your Ledger

### In-App Ledger View

1. Open MF+SO
2. Go to Tools → Activity Ledger
3. You'll see a chronological list of events

The ledger view shows:

| Column | Description |
|--------|-------------|
| **Timestamp** | When the event occurred (UTC) |
| **Event Type** | What happened (e.g., "Vault Created", "TOTP Added") |
| **Details** | Additional information (e.g., account name) |
| **Status** | Confirmed / Pending |
| **Verify** | Tap to cryptographically verify this entry |

### Filtering and Searching

- **By date**: Select date range
- **By event type**: Filter specific types
- **By service**: Filter by account or service
- **Keyword search**: Search event details

### Exporting Your Ledger

You can export your ledger for external verification:

1. Tools → Activity Ledger → Export
2. Choose format:
   - **JSON**: Machine-readable (for auditors, tools)
   - **PDF**: Human-readable (for records)
   - **CSV**: Spreadsheet-compatible
3. Choose date range
4. Tap "Export"

### Public Verification

Anyone can verify a ledger entry without installing MF+SO:

1. From the ledger entry, tap "Share Proof"
2. A verification link or QR code is generated
3. The verifier opens https://verify.mfso.app
4. They enter the verification code or scan the QR code
5. They see the verified entry (but not your sensitive data)

## Ledger Entry Types

### Vault Events

| Event | Description | Privacy |
|-------|-------------|---------|
| Vault Created | Your vault was created | Public: vault ID only |
| Vault Recovered | Vault restored from seed phrase | Public: recovery method |
| Master Password Changed | Password was changed | Public: timestamp only |
| Device PIN Changed | Device PIN was updated | Private: device only |
| Vault Exported | Encrypted export created | Public: export type |

### Authentication Events

| Event | Description | Privacy |
|-------|-------------|---------|
| MF+SO Login | You logged into MF+SO | Public: device type, location |
| TOTP Code Generated | A TOTP code was generated | Private: never recorded |
| 2FA Verified | 2FA was completed successfully | Public: service ID (hashed) |
| New Device Added | A new device was authorized | Public: device type, timestamp |
| Session Started | A new session was created | Public: session duration |

### Account Management Events

| Event | Description | Privacy |
|-------|-------------|---------|
| TOTP Account Added | A new 2FA account was added | Public: service name (hashed) |
| Password Entry Added | A new password was stored | Public: entry count |
| Entry Modified | An entry was edited | Public: entry ID (hashed) |
| Entry Deleted | An entry was removed | Public: entry ID (hashed) |
| Folder Created | A new folder was organized | Public: folder name (hashed) |

### Security Events

| Event | Description | Privacy |
|-------|-------------|---------|
| Failed Login | Incorrect password attempt | Public: attempt count |
| Lockout Triggered | Vault locked after too many attempts | Public: duration |
| Duress Mode Activated | Duress PIN was used | Public: alert flag |
| Backup Created | Seed phrase or export was created | Public: backup type |
| Security Audit | Security audit was performed | Public: audit score |

### What Is NOT Recorded

The ledger NEVER records:
- Your actual passwords
- Your TOTP secrets or generated codes
- Your seed phrase or shards
- Your master password
- Your private keys
- The content of your secure notes
- Personal identifiable information (names, emails, addresses)

## Verification and Trust

### How to Verify

1. **In-app verification**: Every entry has a "Verify" button that checks the cryptographic chain
2. **Export verification**: Exported ledgers include verification proofs
3. **Independent verification**: Use the public verification tool at verify.mfso.app

### What Verification Tells You

- **Integrity**: The entry has not been modified since it was created
- **Authenticity**: The entry was created by your vault (signed with your key)
- **Order**: The entries are in the correct chronological order
- **Completeness**: No entries have been removed from the chain

### Trust Model

The .aioss ledger uses a hybrid trust model:

| Component | Trust Basis |
|-----------|-------------|
| Entry content | Signed with your vault key |
| Entry timing | Consensus timestamp from distributed nodes |
| Block ordering | Cryptographic hash chain |
| Ledger integrity | Distributed consensus |
| Node honesty | Economic and cryptographic incentives |

### Nodes and Consensus

The ledger is maintained by geographically distributed nodes:
- **MF+SO operated nodes**: 3 nodes (for service reliability)
- **Independent nodes**: 5+ nodes run by partners and community
- **Enterprise nodes**: Enterprise customers can run their own node

Consensus requires agreement from 2/3 of nodes.

## Practical Uses

### For Personal Security

1. **Monitor access**: Check the ledger weekly to ensure no unauthorized access
2. **Track changes**: See when passwords or 2FA were modified
3. **Verify sync**: Confirm that sync events are occurring normally
4. **Alert on suspicious activity**: Set up alerting for specific ledger events
5. **Prove actions**: In case of dispute, provide cryptographic proof

### For Family Accounts

If you manage family members' accounts:
1. Each family member has their own vault
2. You can verify their security events
3. Ledger provides proof of good security practices
4. In case of inheritance, the ledger provides account history

### For Compliance

1. **Audit trail**: Ledger provides complete, tamper-evident audit trail
2. **Regulatory evidence**: Prove compliance with MFA requirements
3. **Incident investigation**: Use ledger to reconstruct events
4. **Data governance**: Proof of data handling practices

### For Technical Users

1. **API access**: Query the ledger programmatically
2. **Custom dashboards**: Build monitoring around ledger events
3. **Integration**: Feed ledger events into SIEM systems
4. **Validation scripts**: Write automated ledger verification

## Privacy and the Ledger

### What the Ledger Reveals

The ledger is designed to be privacy-preserving:
- **No secrets**: Actual passwords, TOTP seeds, and private keys are never recorded
- **Hashed identifiers**: Service names and entry IDs are hashed (one-way)
- **No personal data**: Your name, email, and address are not recorded
- **Minimal metadata**: Only necessary information is stored

### Who Can See Your Ledger

| Party | Can View | Cannot View |
|-------|----------|-------------|
| You (vault owner) | Full ledger | N/A |
| MF+SO | Anonymized entries | Your identity, secrets |
| Enterprise admin (if applicable) | Organization entries | Member passwords |
| Public | Nothing (by default) | Your ledger |
| Auditor (with your permission) | Specific entries | Secrets, private data |

### Deleting Ledger Data

Because the ledger is immutable, entries cannot be deleted. However:
- **You can export** your ledger at any time
- **You can revoke** your vault key, making future entries unlinkable
- **Enterprise compliance** requirements may mandate retention periods
- **GDPR right to erasure**: MF+SO can anonymize ledger entries (remove link to your identity)

### Ledger and GDPR

The .aioss ledger is GDPR-compliant:
- **Right to access**: You can export your complete ledger
- **Right to erasure**: Your vault key can be revoked (anonymizing future entries)
- **Data minimization**: Only necessary metadata is stored
- **Purpose limitation**: Ledger is only used for security and compliance
- **Data portability**: Export your ledger in standard formats

## Enterprise Features

### Compliance Reporting

Enterprise customers get advanced ledger features:

1. **Automated Reports**: Generate compliance reports from ledger data
2. **Custom Filters**: Filter by user, time, event type, or custom criteria
3. **Scheduled Exports**: Automatic export of ledger data to your systems
4. **Retention Policies**: Configure how long ledger data is retained
5. **Real-time Monitoring**: Live feed of ledger events

### SIEM Integration

Integrate .aioss ledger with your SIEM:

| SIEM | Integration Method |
|------|-------------------|
| Splunk | REST API + pre-built dashboard |
| ELK Stack | Logstash plugin |
| Sumo Logic | HTTP Event Collector |
| Azure Sentinel | Data Connector |
| IBM QRadar | Universal REST API |

### Multi-Signature Verification

For organizations:
- Require 2+ authorized parties to verify important events
- Useful for compliance and separation of duties
- Provides multi-party verification of security actions

### Running Your Own Node

Enterprise customers can run their own .aioss node:
1. **Full validation**: Verify all ledger entries
2. **Local copy**: Maintain a local copy of the ledger
3. **Custom retention**: Configure your own data retention
4. **API access**: Full API access for tooling integration
5. **Audit reports**: Generate custom audit reports

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
