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
Category: Tutorial
Document ID: TUT-006
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Managing Roles and Permissions

## Introduction

Roles in Libern allow you to organize members and control what they can do in a server. Each role has a set of permission flags that can be combined to create granular access control. This tutorial covers creating roles, managing permissions, and using invite codes.

### Permission Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Permission System                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  64-bit Bitmask     Role Structure                      │
│  ┌────────────────┐  ┌────────────────────────────┐    │
│  │ Bit 0: Manage  │  │ Role                       │    │
│  │      Server    │  │ ├── id: UUID               │    │
│  │ Bit 1: Manage  │  │ ├── name: "Moderator"      │    │
│  │      Channels  │  │ ├── color: 0xFF0000        │    │
│  │ Bit 2: Manage  │  │ ├── position: 1            │    │
│  │      Roles     │  │ └── permissions: 32568     │    │
│  │ ...            │  └────────────────────────────┘    │
│  │ Bit 14: Manage │                                     │
│  │      Whiteboard│     User → Roles → Permissions     │
│  └────────────────┘     ┌────────────────────────┐    │
│                         │ User has role A OR B   │    │
│                         │ Effective = A \| B     │    │
│                         │ Check: effective & bit │    │
│                         └────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## Part 1: Permission System

Permissions in Libern use a **bitmask** system. Each permission is a single bit in a 64-bit integer. The permission constants are defined in `apps/desktop/src-tauri/src/commands/role.rs`:

```rust
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
```

### Bitmask Visualization

```
Permission bitmask layout (64 bits):

Bit  0: █ Manage Server
Bit  1: █ Manage Channels
Bit  2: █ Manage Roles
Bit  3: █ Manage Messages
Bit  4: █ Send Messages
Bit  5: █ Read Messages
Bit  6: █ Connect Voice
Bit  7: █ Speak
Bit  8: █ Mute Members
Bit  9: █ Create Invite
Bit 10: █ Kick Members
Bit 11: █ Attach Files
Bit 12: █ Embed Links
Bit 13: █ Draw Whiteboard
Bit 14: █ Manage Whiteboard
Bits 15-63: Reserved

Example: Default Member = 16 | 32 | 512 | 2048 | 4096 | 8192
  Binary: 0000000000000000001000000001111100110000
  Decimal: 14896
```

### Default Permissions

When a role is created without specifying permissions, the default is:
```rust
PERM_READ_MESSAGES | PERM_SEND_MESSAGES | PERM_CREATE_INVITE
// = 32 | 16 | 512 = 560
```

### Combining Permissions

Use bitwise OR to combine permissions:
```rust
let moderator_perms = PERM_MANAGE_MESSAGES | PERM_MUTE_MEMBERS | PERM_KICK_MEMBERS
                    | PERM_SEND_MESSAGES | PERM_READ_MESSAGES | PERM_CREATE_INVITE
                    | PERM_ATTACH_FILES | PERM_EMBED_LINKS | PERM_DRAW_WHITEBOARD;
// = 8 | 256 | 1024 | 16 | 32 | 512 | 2048 | 4096 | 8192 = 16184
```

### Checking Permissions

```rust
fn has_permission(effective: i64, permission: i64) -> bool {
    (effective & permission) != 0
}

// Example: Check if user can kick members
let can_kick = has_permission(user_effective_perm, PERM_KICK_MEMBERS);
```

---

## Part 2: Create a Role

### Using the API

```typescript
import { createRole } from "./lib/api";

const role = await createRole(
    serverId,     // The server UUID
    "Moderator",  // Role name
    0xFF0000,     // Optional: color (hex RGB, e.g., red)
    560           // Optional: permission bitmask
);
```

The `create_role` command:
1. Generates a new UUID for the role ID.
2. Calculates the next position (max existing position + 1).
3. Inserts the role into the `roles` table.
4. Returns the created Role object.

```rust
// From apps/desktop/src-tauri/src/commands/role.rs
#[tauri::command]
pub fn create_role(
    db: State<Database>,
    server_id: String,
    name: String,
    color: Option<i32>,
    permissions: Option<i64>,
) -> Result<Role, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    let perms = permissions.unwrap_or(PERM_READ_MESSAGES | PERM_SEND_MESSAGES | PERM_CREATE_INVITE);

    let max_pos: i32 = conn.query_row(
        "SELECT COALESCE(MAX(position), -1) + 1 FROM roles WHERE server_id = ?1",
        rusqlite::params![server_id], |row| row.get(0),
    ).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO roles (id, server_id, name, color, position, permissions, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        rusqlite::params![id, server_id, name, color, max_pos, perms, now],
    ).map_err(|e| e.to_string())?;

    Ok(Role { id, server_id, name, color, position: max_pos, permissions: perms, created_at: now })
}
```

### Role Color System

Colors are stored as 24-bit RGB integers:
```
0xFF0000 = Red
0x00FF00 = Green
0x0000FF = Blue
0xFFA500 = Orange
0x9B59B6 = Purple
0x1ABC9C = Teal
null     = No color (default)
```

Colors are used to:
- Display a colored dot next to the role name
- Color the user's name in chat if they have a colored role
- Sort roles visually in the role list

---

## Part 3: Manage Roles

### List Roles

```typescript
import { getRoles } from "./lib/api";
const roles = await getRoles(serverId);
```

Roles are returned in ascending order by position.

```rust
#[tauri::command]
pub fn get_roles(
    db: State<Database>,
    server_id: String,
) -> Result<Vec<Role>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT id, server_id, name, color, position, permissions, created_at
         FROM roles WHERE server_id = ?1 ORDER BY position ASC"
    ).map_err(|e| e.to_string())?;

    let roles = stmt.query_map(rusqlite::params![server_id], |row| {
        Ok(Role {
            id: row.get(0)?,
            server_id: row.get(1)?,
            name: row.get(2)?,
            color: row.get(3)?,
            position: row.get(4)?,
            permissions: row.get(5)?,
            created_at: row.get(6)?,
        })
    }).map_err(|e| e.to_string())?
    .filter_map(|r| r.ok())
    .collect();

    Ok(roles)
}
```

### Update a Role

```typescript
import { updateRole } from "./lib/api";
await updateRole(roleId, "New Name", 0x00FF00, 1234);
```

All fields are optional — only provided fields are updated.

```rust
#[tauri::command]
pub fn update_role(
    db: State<Database>,
    role_id: String,
    name: Option<String>,
    color: Option<i32>,
    permissions: Option<i64>,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    if let Some(n) = name {
        conn.execute("UPDATE roles SET name = ?1 WHERE id = ?2",
            rusqlite::params![n, role_id]).map_err(|e| e.to_string())?;
    }
    if let Some(c) = color {
        conn.execute("UPDATE roles SET color = ?1 WHERE id = ?2",
            rusqlite::params![c, role_id]).map_err(|e| e.to_string())?;
    }
    if let Some(p) = permissions {
        conn.execute("UPDATE roles SET permissions = ?1 WHERE id = ?2",
            rusqlite::params![p, role_id]).map_err(|e| e.to_string())?;
    }

    Ok(())
}
```

### Delete a Role

```typescript
import { deleteRole } from "./lib/api";
await deleteRole(roleId);
```

This also deletes all role assignments for the deleted role.

---

## Part 4: Assign Roles to Members

### Assign a Role

```typescript
import { assignRole } from "./lib/api";
await assignRole(userId, roleId);
```

Uses `INSERT OR IGNORE` so it's safe to call multiple times.

```rust
#[tauri::command]
pub fn assign_role(
    db: State<Database>,
    user_id: String,
    role_id: String,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT OR IGNORE INTO role_assignments (role_id, user_id) VALUES (?1, ?2)",
        rusqlite::params![role_id, user_id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}
```

### Remove a Role

```typescript
import { removeRole } from "./lib/api";
await removeRole(userId, roleId);
```

### Check Permissions

```typescript
import { checkPermission } from "./lib/api";
const canKick = await checkPermission(
    userId,
    serverId,
    1 << 10  // PERM_KICK_MEMBERS
);
```

The `check_permission` command computes the **effective permission** by performing a bitwise OR of all roles assigned to the user:

```rust
// From apps/desktop/src-tauri/src/commands/role.rs
#[tauri::command]
pub fn check_permission(
    db: State<Database>,
    user_id: String,
    server_id: String,
    permission: i64,
) -> Result<bool, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let effective: i64 = conn.query_row(
        "SELECT COALESCE(SUM(r.permissions), 0) FROM roles r
         INNER JOIN role_assignments ra ON r.id = ra.role_id
         WHERE r.server_id = ?1 AND ra.user_id = ?2",
        rusqlite::params![server_id, user_id],
        |row| row.get(0),
    ).map_err(|e| e.to_string())?;

    Ok((effective & permission) != 0)
}
```

### Permission Check Flow

```
┌──────────┐    ┌──────────────┐    ┌───────────────────┐
│  User    │    │ checkPerm    │    │ check_permission  │
│  action  │───►│ ("kick")     │───►│ (Rust command)    │
└──────────┘    └──────────────┘    └─────────┬─────────┘
                                              ▼
                                    ┌─────────────────────┐
                                    │ SELECT SUM(permissions│
                                    │ FROM roles r        │
                                    │ JOIN role_assignments│
                                    │ WHERE user_id=?     │
                                    │ AND server_id=?     │
                                    ├─────────────────────┤
                                    │ effective = 32568   │
                                    │ permission = 1024   │
                                    │ (effective & perm)  │
                                    │ = 32568 & 1024      │
                                    │ = 1024 != 0         │
                                    │ → true              │
                                    └─────────────────────┘
```

---

## Part 5: Invite Codes

Invite codes allow members to join servers without requiring a direct assignment.

### Create an Invite

```typescript
import { createInvite } from "./lib/api";

// Unlimited uses, no expiry
const code = await createInvite(serverId, userId);

// Limited uses with expiry
const code = await createInvite(serverId, userId, 10, Date.now() + 86400000);
```

The invite code is a 12-character string generated from a charset that excludes ambiguous characters:

```rust
const CHARSET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
// No '0', 'O', '1', 'l' — reduces confusion
```

### Join via Invite

```typescript
import { joinViaInvite } from "./lib/api";
const server = await joinViaInvite("AbCdEfGhIjKl");
```

Validation checks:
1. Invite code exists in the database.
2. `use_count < max_uses` (if `max_uses` is set).
3. Current time < `expires_at` (if `expires_at` is set).
4. If valid, increments `use_count` and returns the server.

### List and Delete Invites

```typescript
import { getInvites, deleteInvite } from "./lib/api";

const invites = await getInvites(serverId);
await deleteInvite("AbCdEfGhIjKl");
```

---

## Part 6: Database Schema for Roles and Invites

```sql
-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color INTEGER,
    position INTEGER NOT NULL DEFAULT 0,
    permissions INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

-- Role assignments (many-to-many)
CREATE TABLE IF NOT EXISTS role_assignments (
    role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, user_id)
);

-- Invites table
CREATE TABLE IF NOT EXISTS invites (
    code TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    max_uses INTEGER,
    use_count INTEGER NOT NULL DEFAULT 0,
    expires_at INTEGER,
    created_at INTEGER NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_roles_server ON roles(server_id);
CREATE INDEX IF NOT EXISTS idx_role_assignments_user ON role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_invites_server ON invites(server_id);
```

### Entity Relationship Diagram

```
users ──1:N──► role_assignments ◄──N:1── roles ──N:1── servers
  │                │                           │
  │                │                           │
  └────────────────┴───────────────────────────┘
                         │
                    server_id key for
                    role permission checks
```

---

## Part 7: Example Permission Configurations

### Default Member
```typescript
const DEFAULT_PERMS = PERM_SEND_MESSAGES | PERM_READ_MESSAGES | PERM_CREATE_INVITE
                    | PERM_ATTACH_FILES | PERM_EMBED_LINKS | PERM_DRAW_WHITEBOARD;
// = 16 | 32 | 512 | 2048 | 4096 | 8192 = 14896
```

### Moderator
```typescript
const MOD_PERMS = DEFAULT_PERMS | PERM_MANAGE_MESSAGES | PERM_MUTE_MEMBERS
                | PERM_KICK_MEMBERS | PERM_MANAGE_WHITEBOARD;
// = 14896 | 8 | 256 | 1024 | 16384 = 32568
```

### Admin
```typescript
const ADMIN_PERMS = PERM_MANAGE_SERVER | PERM_MANAGE_CHANNELS | PERM_MANAGE_ROLES
                  | MOD_PERMS;
// = 1 | 2 | 4 | 32568 = 32575 (full management)
```

### Permission Comparison Table

| Permission | Default | Moderator | Admin |
|-----------|---------|-----------|-------|
| Manage Server | ✗ | ✗ | ✓ |
| Manage Channels | ✗ | ✗ | ✓ |
| Manage Roles | ✗ | ✗ | ✓ |
| Manage Messages | ✗ | ✓ | ✓ |
| Send Messages | ✓ | ✓ | ✓ |
| Read Messages | ✓ | ✓ | ✓ |
| Connect Voice | ✗ | ✗ | ✓ |
| Speak | ✗ | ✗ | ✓ |
| Mute Members | ✗ | ✓ | ✓ |
| Create Invite | ✓ | ✓ | ✓ |
| Kick Members | ✗ | ✓ | ✓ |
| Attach Files | ✓ | ✓ | ✓ |
| Embed Links | ✓ | ✓ | ✓ |
| Draw Whiteboard | ✓ | ✓ | ✓ |
| Manage Whiteboard | ✗ | ✓ | ✓ |

---

## Part 8: Role Model

The `Role` model is defined in `crates/libern-core/src/db/models.rs`:

```rust
pub struct Role {
    pub id: String,
    pub server_id: String,
    pub name: String,
    pub color: Option<i32>,
    pub position: i32,
    pub permissions: i64,
    pub created_at: i64,
}
```

And in the TypeScript types:
```typescript
interface Role {
  id: string;
  server_id: string;
  name: string;
  color: number | null;
  position: number;
  permissions: number;
  created_at: number;
}

interface RoleAssignment {
  role_id: string;
  user_id: string;
}

// API response for permission check
interface PermissionCheck {
  allowed: boolean;
  effective_permissions: number;
}
```

---

## Part 9: Use Cases

### Community Server Roles

```
Role Hierarchy:
┌─────────────────────────────┐
│  @admin (position: 0)      │
│  - ALL permissions         │
├─────────────────────────────┤
│  @moderator (position: 1)  │
│  - Manage messages         │
│  - Mute/kick members       │
│  - Manage whiteboard       │
├─────────────────────────────┤
│  @member (position: 2)     │
│  - Send/read messages      │
│  - Attach files, embed     │
│  - Draw on whiteboard      │
├─────────────────────────────┤
│  @guest (position: 3)      │
│  - Read messages only      │
│  - No file attachments     │
└─────────────────────────────┘
```

### Enterprise Server Roles

```
┌─────────────────────────────────┐
│  @ceo (position: 0)            │
│  - Full access                 │
├─────────────────────────────────┤
│  @manager (position: 1)        │
│  - Manage channels, messages   │
│  - All communication perms     │
├─────────────────────────────────┤
│  @employee (position: 2)       │
│  - Send/read messages          │
│  - Attach files                │
├─────────────────────────────────┤
│  @intern (position: 3)         │
│  - Read-only in most channels  │
│  - Limited file attachments    │
├─────────────────────────────────┤
│  @client (position: 4)         │
│  - Read-only, specific channel │
│  - No attachments              │
└─────────────────────────────────┘
```

---

## Next Steps

- **Tutorial 07**: Marketplace and Games — Browse marketplace, publish items, casino games
- **Tutorial 08**: Compliance and .aioss — View sessions, verify integrity, export

### Related References

- **FAQ-001**: General FAQ — Overview of Libern features
- **FAQ-006**: Account and Identity FAQ — Identity management
- **DEV-001**: Architecture Overview — System architecture

────────────────────────────────────────────────────────────────

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ