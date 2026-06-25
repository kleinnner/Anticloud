▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

Document Version: 1.0.0
Category: Enterprise Administration Guide
Document ID: ENT-003
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Configuring Security

## Introduction

Libern's security model is built on cryptographic primitives: Ed25519 for identity signing, SHA3-256 for hash chaining, and a 14-bit permission bitfield for granular access control. This guide covers how to configure security for enterprise deployments, including role-based permission management, audit settings, compliance configurations, and network security considerations.

By the end of this guide, you will be able to:
- Configure the 14-bit permission system for granular access control
- Set up enterprise role templates
- Configure audit logging and compliance settings
- Understand network security for LAN P2P communication
- Implement security best practices for enterprise deployment

---

## Part 1: The 14-Bit Permission System

Libern uses a bitmask permission system where each permission is a single bit in a 64-bit integer. Currently, 14 bits are defined, leaving room for future expansion.

### Permission Bit Definitions

`ust
// apps/desktop/src-tauri/src/commands/role.rs
pub const PERM_MANAGE_SERVER: i64      = 1 << 0;   // 1
pub const PERM_MANAGE_CHANNELS: i64   = 1 << 1;   // 2
pub const PERM_MANAGE_ROLES: i64      = 1 << 2;   // 4
pub const PERM_MANAGE_MESSAGES: i64   = 1 << 3;   // 8
pub const PERM_SEND_MESSAGES: i64     = 1 << 4;   // 16
pub const PERM_READ_MESSAGES: i64     = 1 << 5;   // 32
pub const PERM_CONNECT_VOICE: i64     = 1 << 6;   // 64
pub const PERM_SPEAK: i64             = 1 << 7;   // 128
pub const PERM_MUTE_MEMBERS: i64      = 1 << 8;   // 256
pub const PERM_CREATE_INVITE: i64     = 1 << 9;   // 512
pub const PERM_KICK_MEMBERS: i64      = 1 << 10;  // 1024
pub const PERM_ATTACH_FILES: i64      = 1 << 11;  // 2048
pub const PERM_EMBED_LINKS: i64       = 1 << 12;  // 4096
pub const PERM_DRAW_WHITEBOARD: i64   = 1 << 13;  // 8192
pub const PERM_MANAGE_WHITEBOARD: i64 = 1 << 14;  // 16384
`

### Permission Categories

| Category | Bits | Permissions |
|----------|------|-------------|
| Administration | 0-2 | MANAGE_SERVER, MANAGE_CHANNELS, MANAGE_ROLES |
| Moderation | 3, 8, 10 | MANAGE_MESSAGES, MUTE_MEMBERS, KICK_MEMBERS |
| Communication | 4-7 | SEND_MESSAGES, READ_MESSAGES, CONNECT_VOICE, SPEAK |
| Content | 9, 11, 12 | CREATE_INVITE, ATTACH_FILES, EMBED_LINKS |
| Whiteboard | 13, 14 | DRAW_WHITEBOARD, MANAGE_WHITEBOARD |

### Default Permission Sets

`ust
// Default member permissions
pub const DEFAULT_PERMISSIONS: i64 = PERM_READ_MESSAGES       // 32
    | PERM_SEND_MESSAGES             // 16
    | PERM_CREATE_INVITE             // 512
    | PERM_ATTACH_FILES              // 2048
    | PERM_EMBED_LINKS               // 4096
    | PERM_DRAW_WHITEBOARD;          // 8192
// Total: 14896

// Administrator permissions
pub const ADMIN_PERMISSIONS: i64 = DEFAULT_PERMISSIONS
    | PERM_MANAGE_SERVER             // 1
    | PERM_MANAGE_CHANNELS           // 2
    | PERM_MANAGE_ROLES              // 4
    | PERM_MANAGE_MESSAGES           // 8
    | PERM_CONNECT_VOICE             // 64
    | PERM_SPEAK                     // 128
    | PERM_MUTE_MEMBERS              // 256
    | PERM_KICK_MEMBERS              // 1024
    | PERM_MANAGE_WHITEBOARD;        // 16384
// Total: 32767
`

---

## Part 2: Configuring Security via API

### Creating a Role with Specific Permissions

`	ypescript
import { createRole, assignRole } from "./lib/api";

// Create a "Read Only" role
const readOnlyRole = await createRole(
    serverId,
    "Read Only",
    0x808080,  // Gray color
    32          // READ_MESSAGES only
);

// Create a "Moderator" role
const moderatorRole = await createRole(
    serverId,
    "Moderator",
    0x00FF00,  // Green color
    32568       // Default + MANAGE_MESSAGES + MUTE_MEMBERS + KICK_MEMBERS + MANAGE_WHITEBOARD
);

// Assign roles to users
await assignRole(userId, moderatorRole.id);
`

### Checking Permissions

`	ypescript
import { checkPermission } from "./lib/api";

// Check if a user can manage messages
const canManage = await checkPermission(
    userId,
    serverId,
    1 << 3  // PERM_MANAGE_MESSAGES
);
`

### Effective Permission Calculation

The permission system computes effective permissions by performing a bitwise OR of all roles assigned to a user:

`ust
// From apps/desktop/src-tauri/src/commands/role.rs
pub fn get_effective_permissions(
    conn: &Connection,
    user_id: &str,
    server_id: &str,
) -> Result<i64, String> {
    let effective: i64 = conn.query_row(
        "SELECT COALESCE(SUM(r.permissions), 0) FROM roles r
         INNER JOIN role_assignments ra ON r.id = ra.role_id
         WHERE r.server_id = ?1 AND ra.user_id = ?2",
        rusqlite::params![server_id, user_id],
        |row| row.get(0),
    ).map_err(|e| e.to_string())?;

    Ok(effective)
}
`

If a user has multiple roles (e.g., "Member" with 14896 and "Moderator" with 32568), the effective permissions are 14896 | 32568 = 32760 (all permissions except MANAGE_SERVER).

---

## Part 3: Enterprise Security Templates

### Template: Financial Services (Regulated)

`	ypescript
const FINANCIAL_ROLES = {
    auditor: {
        name: "Compliance Auditor",
        permissions: PERM_READ_MESSAGES, // Read-only access
        color: 0xFFD700,
    },
    trader: {
        name: "Trader",
        permissions: PERM_READ_MESSAGES | PERM_SEND_MESSAGES | PERM_ATTACH_FILES,
        color: 0x00FF00,
    },
    compliance_officer: {
        name: "Compliance Officer",
        permissions: PERM_READ_MESSAGES | PERM_MANAGE_MESSAGES,
        color: 0x0000FF,
    },
    administrator: {
        name: "System Admin",
        permissions: ADMIN_PERMISSIONS,
        color: 0xFF0000,
    },
};
`

### Template: Healthcare (HIPAA-Relevant)

`	ypescript
const HEALTHCARE_ROLES = {
    clinician: {
        name: "Clinician",
        permissions: PERM_READ_MESSAGES | PERM_SEND_MESSAGES | PERM_ATTACH_FILES | PERM_EMBED_LINKS,
        color: 0x00AA00,
    },
    patient_advocate: {
        name: "Patient Advocate",
        permissions: PERM_READ_MESSAGES | PERM_SEND_MESSAGES,
        color: 0x0000AA,
    },
    it_auditor: {
        name: "IT Security Auditor",
        permissions: PERM_READ_MESSAGES,
        color: 0xAA0000,
    },
};
`

### Template: Education

`	ypescript
const EDUCATION_ROLES = {
    student: {
        name: "Student",
        permissions: PERM_READ_MESSAGES | PERM_SEND_MESSAGES | PERM_DRAW_WHITEBOARD | PERM_ATTACH_FILES,
        color: 0x00AAAA,
    },
    instructor: {
        name: "Instructor",
        permissions: STUDENT_PERMISSIONS | PERM_MANAGE_MESSAGES | PERM_MUTE_MEMBERS | PERM_EMBED_LINKS,
        color: 0xAA00AA,
    },
    admin: {
        name: "School Admin",
        permissions: ADMIN_PERMISSIONS,
        color: 0xAAAA00,
    },
};
`

---

## Part 4: Audit Settings

### Configuring Audit Logging

The .aioss ledger serves as Libern's audit log. Enterprise administrators can configure:

1. **Seal interval**: How often the auto-scheduler seals sessions (default: 10 minutes).
2. **Session types**: What types of activity are recorded (chat, system, AI, games).
3. **Entry types**: What actions create entries (messages, channel changes, role changes, etc.).
4. **Retention**: How long sessions are kept before archiving.

### Configuring Seal Interval

`	ypescript
import { setAiossInterval } from "./lib/api";

// Enterprise compliance: seal every minute
await setAiossInterval(60);

// Standard: seal every 10 minutes (default)
await setAiossInterval(600);

// Minimal logging: seal every hour
await setAiossInterval(3600);
`

### Viewing Audit Logs

1. Open the Compliance dashboard (🛡️).
2. Browse .aioss sessions by date.
3. View entries by type, actor, or timestamp.
4. Verify the hash chain integrity.
5. Export as JSON, TXT, or HTML compliance report.

### Audit Log Aggregation

For enterprise compliance, aggregate .aioss sessions from all team members:

`ash
# Copy all .aioss files from user machines to audit server
robocopy \\PC-001\C$\Users\%USERNAME%\AppData\Roaming\com.libern.app\data\aioss D:\audit-logs\libern\PC-001 /E
`

---

## Part 5: Network Security

### LAN Communication Security

Libern uses the following network protocols:
- **mDNS** (port 5353/UDP): Peer discovery on the local network.
- **WebSocket** (configurable port, default 42069/TCP): P2P data synchronization.
- **UDP** (configurable port): Voice chat audio streaming.

### Firewall Configuration

`powershell
# Windows Firewall rules for Libern
New-NetFirewallRule -DisplayName "Libern - mDNS Discovery" 
    -Direction Inbound -Protocol UDP -LocalPort 5353 -Action Allow

New-NetFirewallRule -DisplayName "Libern - P2P Sync" 
    -Direction Inbound -Protocol TCP -LocalPort 42069 -Action Allow

New-NetFirewallRule -DisplayName "Libern - Voice Chat" 
    -Direction Inbound -Protocol UDP -LocalPort 42070-42080 -Action Allow
`

### Security Best Practices for Enterprise Networks

1. **Segment Libern traffic**: Use a dedicated VLAN for Libern P2P traffic.
2. **Disable mDNS if not needed**: For fully remote teams, mDNS discovery is unnecessary.
3. **Monitor network traffic**: Watch for unusual P2P connections.
4. **Use firewall rules**: Restrict Libern ports to authorized subnets only.
5. **VPN for WAN teams**: Use VPN to create a virtual LAN for remote workers.

### TLS and Encryption

- Currently, P2P sync uses plain WebSocket (ws://).
- Future releases will support WSS (WebSocket Secure) with TLS.
- Voice chat uses Opus encoding but is not encrypted (future E2EE planned).
- All .aioss ledger entries are cryptographically signed and hash-chained, providing integrity even without transport encryption.

---

## Part 6: Compliance Configuration

### Enterprise Compliance Settings

Configure compliance parameters in the Libern config file:

`json
{
    "compliance": {
        "audit_log_retention_days": 365,
        "auto_seal_sessions": true,
        "seal_interval_seconds": 60,
        "min_entries_before_seal": 100,
        "sign_state_proofs": true,
        "export_on_seal": true,
        "export_format": "both",
        "compliance_report_auto_generate": true,
        "compliance_report_schedule": "0 0 * * *",
        "encrypt_at_rest": false
    }
}
`

### State Proof Generation

For cryptographic audit evidence, generate signed state proofs:

`	ypescript
// Generate a signed proof for each sealed session
import { signAiossSession } from "./lib/api";

const proof = await signAiossSession(sessionIndex);
// {
//   head_hash: "abcd...",
//   entry_count: 42,
//   session_id: "uuid...",
//   signature: "base64...",
//   public_key: "base64...",
//   verified: true
// }
`

State proofs can be independently verified by anyone with the public key, providing non-repudiation for compliance auditors.

---

## Part 7: Security Incident Response

### Detecting Tampering

The Compliance dashboard's ledger verification detects:
- Modified entries (hash mismatch)
- Broken hash chain (parent_hash doesn't match previous entry)
- Missing entries (index gaps)
- Suspicious timestamps (out of order, future dates)

`	ypescript
// Programmatic verification
const result = await verifyAiossFile("/path/to/session.aioss");
// { verified: true/false, tampered_count: 0, total_entries: 150 }
`

### Incident Response Workflow

1. **Detect**: Run unHealthDiagnostics() and erifyAiossFile() on all sessions.
2. **Isolate**: Identify affected sessions and users.
3. **Preserve evidence**: Export affected sessions with signed state proofs.
4. **Analyze**: Review the hash chain to determine the scope of tampering.
5. **Remediate**: Revoke compromised keys, restore from backup, update security policies.
6. **Report**: Generate compliance reports documenting the incident.

---

## Part 8: Security Checklist

### Initial Security Configuration

- [ ] Define role hierarchy with least-privilege permissions.
- [ ] Create enterprise role templates.
- [ ] Set appropriate .aioss seal interval (60s for compliance-heavy environments).
- [ ] Configure firewall rules for Libern ports.
- [ ] Test permission enforcement with multiple user accounts.
- [ ] Verify .aioss ledger integrity after initial setup.
- [ ] Configure backup schedule for .aioss sessions.
- [ ] Document key escrow procedure (if used).

### Ongoing Security Maintenance

- [ ] Review role assignments quarterly.
- [ ] Verify .aioss chain integrity weekly.
- [ ] Update Libern to latest version for security patches.
- [ ] Audit user list and remove inactive accounts.
- [ ] Review permission bitfield assignments.
- [ ] Test backup restoration process.
- [ ] Review network firewall rules.
- [ ] Update incident response plan.

---

## Part 9: Troubleshooting Security Configuration

| Problem | Solution |
|---------|----------|
| Permission denied despite having the role | Check that the role assignment exists. Verify the permission bitmask calculation. Multiple roles are ORed together. |
| User can see channels they shouldn't | The permission system is server-wide. Channel-specific permissions are planned for a future release. |
| .aioss verification fails | Run erifyAiossFile() on the session. If tampering is detected, isolate the affected session and investigate. |
| mDNS discovery not finding peers | Check firewall rules. mDNS uses port 5353/UDP. Ensure all machines are on the same subnet. |
| WebSocket connection refused | Check the Libern listen port (default 42069). Ensure no other process is using the port. |
| State proof verification fails | The signature uses Ed25519. The verifying key is returned by signAiossSession. Ensure the correct public key is used. |
| AI model security concern | The AI model runs entirely locally. No data leaves the machine. The model file itself is a standard GGUF format. |
| User bypasses role permissions | All permission checks are enforced server-side in Rust Tauri commands. Frontend only hides UI elements. |

---

## Next Steps

Now that security is configured, proceed to:

- **Enterprise Guide 04**: Backup Strategies — Backing up .aioss sessions, SQLite DB, user keys
- **Enterprise Guide 05**: Monitoring — Health diagnostics, .aioss verification, network status

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
