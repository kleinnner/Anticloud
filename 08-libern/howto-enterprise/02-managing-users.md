__                     ¦¦               __                                    
¦¦                     ¯¯               ¦¦                                    
¦¦            ___¦   ¦¦¦¦     ¦___      ¦¦_¦¦¦_    _¦¦¦¦_    ¦¦_¦¦¦¦  ¦¦_¦¦¦¦_
¦¦        __¦¯¯¯       ¦¦       ¯¯¯¦__  ¦¦¯  ¯¦¦  ¦¦____¦¦   ¦¦¯      ¦¦¯   ¦¦
¦¦        ¯¯¦___       ¦¦       ___¦¯¯  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯   ¦¦       ¦¦    ¦¦
¦¦______      ¯¯¯¦  ___¦¦___  ¦¯¯¯      ¦¦¦__¦¦¯  ¯¦¦____¦   ¦¦       ¦¦    ¦¦
¯¯¯¯¯¯¯¯            ¯¯¯¯¯¯¯¯            ¯¯ ¯¯¯      ¯¯¯¯¯    ¯¯       ¯¯    ¯¯

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

Document Version: 1.0.0
Category: Enterprise Administration Guide
Document ID: ENT-002
Last Updated: 2026-06-19

----------------------------------------------------------------

# Managing Users in Libern

## Introduction

Libern's user management model is fundamentally different from traditional platforms. There is no central directory, no LDAP integration, and no cloud-based user database. Each user's identity is a self-sovereign Ed25519 keypair generated on their local machine. Enterprise administrators must adapt their user management practices to this decentralized model while still maintaining security, auditability, and offboarding capabilities.

This guide covers user identity management, key backup strategies, user offboarding, and how to handle user lifecycle in an enterprise Libern deployment.

By the end of this guide, you will be able to:
- Understand Libern's self-sovereign identity model
- Implement key backup and recovery procedures
- Handle user offboarding and access revocation
- Audit user activity through the .aioss ledger
- Manage user roles and permissions at scale

---

## Part 1: The Self-Sovereign Identity Model

### How Identities Work

Each Libern user has:
- **User ID**: A UUID v4 generated on first launch.
- **Display Name**: A human-readable name set by the user (not unique).
- **Ed25519 Keypair**: A cryptographic key pair for signing messages.
  - **Public Key** (32 bytes): Shared with peers for signature verification.
  - **Private Key** (64 bytes): Stored encrypted on the user's machine. Never leaves the device.

### Identity Storage

The identity is stored in two places:
1. **SQLite database** (users table): User ID, display name, public key, avatar path.
2. **Key file** (platform-specific encrypted storage): The private key.

| Platform | Private Key Storage |
|----------|-------------------|
| Windows | DPAPI-encrypted file in %APPDATA%\com.libern.app\data\keys\{user_id}.key |
| macOS | Keychain item under com.libern.app |
| Linux | AES-256-GCM encrypted file in ~/.local/share/com.libern.app/keys/{user_id}.key |

### Identity Properties

- **Portable**: Users can export their keypair and import it on another machine.
- **Verifiable**: Any message signed with the private key can be verified by anyone with the public key.
- **Non-repudiable**: A valid signature proves the message was created by the key owner.
- **Recoverable**: With the exported encrypted backup file, users can restore their identity.

---

## Part 2: User Onboarding in Enterprise

### Standard Onboarding Flow

1. User installs Libern (via MDM or direct download).
2. User launches Libern and completes the onboarding wizard.
3. User creates their identity (Ed25519 keypair generated).
4. User joins the enterprise server via an invite code.
5. User is assigned default role(s) by the server owner.

### Pre-Provisioned Identity (Optional)

For tighter control, enterprises can pre-generate identities:

`ust
// Enterprise identity provisioning tool
use ed25519_dalek::Keypair;
use rand::rngs::OsRng;

pub fn provision_identity(employee_id: &str, display_name: &str) -> (String, Vec<u8>) {
    let mut csprng = OsRng;
    let keypair = Keypair::generate(&mut csprng);
    let user_id = uuid::Uuid::new_v4().to_string();

    // Create export bundle (encrypted with enterprise master key)
    let export_data = serde_json::json!({
        "user_id": user_id,
        "display_name": display_name,
        "public_key": hex::encode(keypair.public.to_bytes()),
        "private_key_encrypted": encrypt_with_master_key(&keypair.to_bytes()),
        "created_at": chrono::Utc::now().to_rfc3339(),
    });

    (user_id, serde_json::to_vec_pretty(&export_data).unwrap())
}
`

The pre-provisioned identity can be distributed to the user via a secure channel. The user imports it during onboarding.

### ID Provisioning via Script

`powershell
# provision-libern-identity.ps1
param(
    [string],
    [string],
    [string] = ".\identities"
)

 = Join-Path -Path  -ChildPath 
New-Item -ItemType Directory -Path  -Force

# This would call a Libern CLI tool to generate the identity
# (CLI tool is a planned future feature)
Write-Host "Provisioning identity for  ()..."
Write-Host "Identity file: \identity.json"
Write-Host "Distribute this file securely to the user."
`

---

## Part 3: Key Backup and Recovery

### Why Backup Matters

Without their private key, a user:
- Cannot prove ownership of their messages.
- Cannot access servers they created.
- Loses their identity permanently.

### User-Initiated Backup

Users can export their identity at any time:

`	ypescript
import { exportIdentity } from "./lib/api";

// Export with a strong password
const exportData = await exportIdentity("user-provided-password");
// Save exportData as a JSON file
`

The exported file contains:
- User ID
- Encrypted private key (AES-256-GCM with key derived from password via PBKDF2)
- Public key
- Display name
- Creation timestamp

### Enterprise Backup Strategy

For enterprise deployments, consider these backup approaches:

#### Option 1: User-Managed (Recommended)
- Users are responsible for exporting and backing up their own identity.
- IT provides guidance and schedules reminders.
- Lowest administrative overhead.
- User has full control of their key.

#### Option 2: Central Key Escrow (Optional)
- On first launch, the private key is encrypted with an enterprise master key.
- The encrypted key is uploaded to a secure key escrow server.
- The escrow server is highly secured, air-gapped when possible.
- Access to the escrow server requires multi-party authorization.

`ust
// Enterprise key escrow flow
pub async fn escrow_key(
    user_id: &str,
    public_key: &[u8],
    encrypted_private_key: &[u8],
    escrow_server_url: &str,
) -> Result<(), EscrowError> {
    let client = reqwest::Client::new();
    let response = client
        .post(format!("{}/api/v1/keys/escrow", escrow_server_url))
        .json(&serde_json::json!({
            "user_id": user_id,
            "public_key": hex::encode(public_key),
            "encrypted_private_key": hex::encode(encrypted_private_key),
            "escrowed_at": chrono::Utc::now().to_rfc3339(),
        }))
        .header("Authorization", "Bearer <enterprise-api-token>")
        .send()
        .await?;

    if !response.status().is_success() {
        return Err(EscrowError::UploadFailed(response.text().await?));
    }
    Ok(())
}
`

#### Key Escrow Security Considerations

- The escrow server must be treated as a critical security asset.
- Use Hardware Security Module (HSM) for the master encryption key.
- Implement split-key recovery (M-of-N authorization).
- Audit all access to escrowed keys.
- Comply with data residency requirements (escrow server location).

---

## Part 4: User Offboarding

Offboarding a user in Libern does not involve deleting a central account. Instead, it involves:

1. **Revoking server access**: Kicking the user from all enterprise servers.
2. **Invalidating invites**: Deleting unused invite codes.
3. **Archiving their .aioss sessions**: Ensuring their activity is preserved for compliance.
4. **Handling their key**: Optionally recovering escrowed keys if enterprise policy requires.
5. **Transferring ownership**: If the user owned servers, transferring ownership.

### Offboarding Workflow

`	ypescript
// Enterprise offboarding script
async function offboardUser(userId: string, adminId: string, servers: Server[]) {
    for (const server of servers) {
        // 1. Remove user from all roles
        const roles = await getRoles(server.id);
        for (const role of roles) {
            try {
                await removeRole(userId, role.id);
            } catch (e) {
                // Role might not be assigned
            }
        }

        // 2. Remove user from server (kick)
        // Note: Libern doesn't have a "kick" command yet.
        // Revoking all role assignments effectively removes access.
        // The user's messages remain visible (authored by their public key).

        // 3. Transfer server ownership if needed
        const serverDetail = await getServer(server.id);
        if (serverDetail.owner_id === userId) {
            await updateServer(server.id, { owner_id: adminId });
        }
    }

    // 4. Archive the user's .aioss sessions
    const sessions = await listAiossSessions();
    for (const session of sessions) {
        const proof = await signAiossSession(session.id);
        // Store the signed proof in a tamper-evident archive
        await archiveStateProof(proof);
    }
}
`

### What Happens to the User's Data

| Data | Action | Rationale |
|------|--------|-----------|
| Messages | Retained (anonymized by public key) | Compliance and audit requirements |
| Servers (owned) | Ownership transferred | Prevent orphaned servers |
| Invites (created) | Deleted | Prevent unauthorized access |
| Private key | Deleted by user (on their machine) | User responsibility |
| .aioss ledger | Archived and sealed | Immutable audit trail |
| Casino balance | Irrelevant (local only) | N/A |
| Marketplace items | Retained or transferred | Value may persist |

---

## Part 5: Auditing User Activity

Enterprise administrators can audit user activity through the .aioss ledger, which records every action in a tamper-evident hash chain.

### Viewing User Activity

1. Open the Compliance dashboard (??? icon).
2. Browse .aioss sessions by date or session type.
3. Filter entries by actor (user ID).
4. Verify the integrity of the hash chain.

### Programmatic Audit

`	ypescript
// Export user activity for compliance
async function exportUserActivity(userId: string, startDate: number, endDate: number) {
    const sessions = await listAiossSessions();

    const userEntries = [];
    for (const sessionPath of sessions) {
        const ledger = await getAiossLedgerJson(sessionPath);
        for (const entry of ledger.entries) {
            if (entry.actor === userId &&
                entry.timestamp_unix_ms >= startDate &&
                entry.timestamp_unix_ms <= endDate) {
                userEntries.push(entry);
            }
        }
    }

    return userEntries;
}
`

### Audit Log Schema

Each .aioss entry contains:
- Index (sequential)
- Timestamp (Unix milliseconds)
- Entry type ("message", "channel_create", "role_change", etc.)
- Actor ID (user UUID)
- Actor label (display name at time of action)
- Content hash (SHA3-256 of the JSON content)
- Parent hash (SHA3-256 of previous entry)
- Entry hash (computed from all fields)

---

## Part 6: Role and Permission Management

### Enterprise Role Templates

For enterprise deployments, pre-configure these role templates:

#### Default Member
- Permissions: READ_MESSAGES, SEND_MESSAGES, CREATE_INVITE, ATTACH_FILES, EMBED_LINKS, DRAW_WHITEBOARD
- Bitmask: 14896

#### Read-Only User
- Permissions: READ_MESSAGES
- Bitmask: 32
- Use case: Compliance auditors, external stakeholders

#### Moderator
- Permissions: Default Member + MANAGE_MESSAGES, MUTE_MEMBERS, KICK_MEMBERS, MANAGE_WHITEBOARD
- Bitmask: 32568

#### Administrator
- Permissions: All (MANAGE_SERVER, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, SEND_MESSAGES, READ_MESSAGES, CONNECT_VOICE, SPEAK, MUTE_MEMBERS, CREATE_INVITE, KICK_MEMBERS, ATTACH_FILES, EMBED_LINKS, DRAW_WHITEBOARD, MANAGE_WHITEBOARD)
- Bitmask: 32767

#### Compliance Auditor
- Permissions: READ_MESSAGES, MANAGE_MESSAGES (for review)
- Bitmask: 40

### Creating Roles Programmatically

`	ypescript
async function createEnterpriseRoles(serverId: string) {
    const roles = [
        { name: "Read Only", permissions: 32 },
        { name: "Member", permissions: 14896 },
        { name: "Moderator", permissions: 32568 },
        { name: "Admin", permissions: 32767 },
        { name: "Auditor", permissions: 40 },
    ];

    for (const role of roles) {
        await createRole(serverId, role.name, null, role.permissions);
    }
}
`

---

## Part 7: Managing Users at Scale

### User List Export

`	ypescript
async function exportUserList(serverId: string): Promise<User[]> {
    const roles = await getRoles(serverId);
    const users = new Map<string, { roles: string[] }>();

    for (const role of roles) {
        // In Libern, role assignments are many-to-many.
        // Query all users with this role.
        const members = await getRoleMembers(role.id);
        for (const member of members) {
            if (!users.has(member.id)) {
                users.set(member.id, { roles: [] });
            }
            users.get(member.id)!.roles.push(role.name);
        }
    }

    return Array.from(users.entries()).map(([id, data]) => ({
        id,
        roles: data.roles,
    }));
}
`

### User Statistics

`	ypescript
async function getUserStatistics(serverId: string, userId: string) {
    const stats = await getServerStats(serverId);
    const level = await getLevel(userId, serverId);
    const casinoBalance = await getCasinoBalance(userId);

    return {
        userId,
        level: level.level,
        xp: level.xp,
        casino_balance: casinoBalance.balance,
        messages_sent: stats.total_messages, // per-server aggregate
    };
}
`

---

## Part 8: Multi-Device Identity

### Using the Same Identity on Multiple Machines

1. Export identity from machine A (Settings > Export Identity).
2. Transfer the exported file to machine B (USB drive, secure file share).
3. On machine B, during onboarding, choose "Import Identity".
4. Enter the password used during export.
5. The identity is restored on machine B.

### Identity Synchronization

Messages and data do not automatically sync between machines. Each machine maintains its own local database and .aioss ledger. To sync:
1. Ensure both machines are on the same LAN.
2. Libern's P2P sync will exchange messages when both are online.
3. For full data portability, copy the entire app data directory.

---

## Part 9: Troubleshooting User Management

| Problem | Solution |
|---------|----------|
| User cannot find their identity after reinstall | Identity was lost. Always export before reinstalling. If no backup, create a new identity. |
| Exported identity file is corrupted | The file uses JSON with base64-encoded encrypted key. Try re-exporting. |
| "Cannot import identity: wrong password" | The password is used for AES-256-GCM decryption. There is no recovery mechanism. |
| User left the company and their messages are still visible | Messages are cryptographically signed. They remain as an immutable record. For GDPR erasure, see compliance documentation. |
| User sees "server not found" after being removed | They were kicked from the server. Their role assignments were deleted. |
| Multiple users with the same display name | Display names are not unique. Users are identified by their public key. |
| Pre-provisioned identity import fails | Ensure the JSON format matches the expected schema. Check that the private key was encrypted correctly. |
| Key escrow server unreachable | Check network connectivity and TLS configuration. The escrow server must be accessible from the user's machine during first launch. |

---

## Next Steps

Now that you understand user management, proceed to:

- **Enterprise Guide 03**: Configuring Security — Permission roles, audit settings, compliance
- **Enterprise Guide 04**: Backup Strategies — Backing up .aioss sessions, SQLite DB, user keys

----------------------------------------------------------------

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ