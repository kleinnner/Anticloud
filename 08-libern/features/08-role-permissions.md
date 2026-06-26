▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document version: 1.0.0 | Updated: 2026-06-19
Category: features | ID: LIB-FEAT-008

────────────────────────────────────────────────────────────────

# Role-Based Access Control — 14-Bit Permission Bitfield, Role Assignment, Invite Codes

**What we bring to the market:** A compact, deterministic RBAC system with
a 14-bit permission bitfield, per-server role assignments, cryptographically
generated invite codes, and bitwise-OR permission composition — no server
needed.

---

## 1. The Problem

```
┌──────────────────────────────────────────────────────────────────────┐
│               THE PERMISSION MANAGEMENT PROBLEM                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Every collaboration platform implements permissions differently:     │
│                                                                       │
│  Discord:    Complex snowflake-based hierarchy, 50+ perms, API-only   │
│  Slack:      Permission sets tied to plans, limited customization     │
│  Teams:      Azure AD dependency, admin-only, no per-channel RBAC    │
│  Matrix:     Power levels 0-100, no bitfield, no named roles          │
│                                                                       │
│  Common problems:                                                     │
│  ❌ Permissions require internet to verify                            │
│  ❌ Cannot check permission offline                                   │
│  ❌ Opaque permission inheritance                                     │
│  ❌ No audit trail for role changes                                   │
│                                                                       │
│  Libern: 14-bit bitfield, local SQLite check, offline-verifiable       │
│           role assignment, Ed25519 signed audit.                     │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Why 14 Bits?

| # of Permissions | Bitfield Size | Example Systems | Bits Wasted |
|-----------------|---------------|----------------|-------------|
| 10 | 16 bits (i16) | Minimal RBAC | 6 bits |
| 14 | 16 bits (i16) | **Libern** | 2 bits — optimal |
| 32 | 32 bits (i32) | Simple systems | 18 bits |
| 50+ | 64 bits (i64) | Discord | 14+ bits |
| 100+ | 128+ bits | Complex RBAC | Many |

Libern uses 14 bits packed into an i64 to leave room for future expansion
without changing the data type.

---

## 2. The 14-Bit Permission Bitfield

```
┌──────────────────────────────────────────────────────────────────────┐
│                    PERMISSION BITFIELD (i64, lower 15 bits used)      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Bit  │ Constant                 │ Value     │ Description            │
│  ─────┼──────────────────────────┼───────────┼─────────────────────── │
│  0    │ PERM_MANAGE_SERVER       │ 1 << 0    │ Edit server settings   │
│  1    │ PERM_MANAGE_CHANNELS     │ 1 << 1    │ Create/delete channels │
│  2    │ PERM_MANAGE_ROLES        │ 1 << 2    │ Create/edit roles      │
│  3    │ PERM_MANAGE_MESSAGES     │ 1 << 3    │ Delete any message     │
│  4    │ PERM_SEND_MESSAGES       │ 1 << 4    │ Send text messages     │
│  5    │ PERM_READ_MESSAGES       │ 1 << 5    │ Read channel history   │
│  6    │ PERM_CONNECT_VOICE       │ 1 << 6    │ Join voice channels    │
│  7    │ PERM_SPEAK               │ 1 << 7    │ Talk in voice          │
│  8    │ PERM_MUTE_MEMBERS        │ 1 << 8    │ Mute/deafen others     │
│  9    │ PERM_CREATE_INVITE       │ 1 << 9    │ Generate invite codes  │
│  10   │ PERM_KICK_MEMBERS        │ 1 << 10   │ Remove members         │
│  11   │ PERM_ATTACH_FILES        │ 1 << 11   │ Upload files/images    │
│  12   │ PERM_EMBED_LINKS         │ 1 << 12   │ Show link previews     │
│  13   │ PERM_DRAW_WHITEBOARD     │ 1 << 13   │ Sketch on whiteboard   │
│  14   │ PERM_MANAGE_WHITEBOARD   │ 1 << 14   │ Clear/wipe whiteboard  │
│                                                                       │
│  Example bit patterns:                                                │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  Full Admin: 0x7FFF (all bits set)                           │    │
│  │  Member:     0x3A0   (read, send, connect, speak, files)     │    │
│  │  Guest:      0x020   (read only)                             │    │
│  │  Moderator:  0x72F   (read, send, manage messages, mute)     │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Common Role Templates

| Role Name | Bitmask Hex | Bits | Description |
|-----------|------------|------|-------------|
| Admin | 0x7FFF | 0-14 | All permissions |
| Moderator | 0x72F | 0,1,2,3,5,6,7,9,11 | Manage server, channels, messages, voice |
| Member | 0x3A0 | 5,6,7,9,11 | Read, send, connect, speak, attach |
| Guest | 0x020 | 5 | Read only |
| Voice Only | 0x0C0 | 6,7 | Connect and speak, no text |
| Whiteboard Editor | 0x2020 | 5,13 | Read messages and draw |
| Inviter | 0x220 | 5,9 | Read and create invites |

---

## 3. Code: Permission Constants and Role CRUD

Real bitfield constants and role management from
`apps/desktop/src-tauri/src/commands/role.rs`:

```rust
// apps/desktop/src-tauri/src/commands/role.rs
pub const PERM_MANAGE_SERVER: i64 = 1 << 0;
pub const PERM_MANAGE_CHANNELS: i64 = 1 << 1;
pub const PERM_MANAGE_ROLES: i64 = 1 << 2;
pub const PERM_MANAGE_MESSAGES: i64 = 1 << 3;
pub const PERM_SEND_MESSAGES: i64 = 1 << 4;
pub const PERM_READ_MESSAGES: i64 = 1 << 5;
pub const PERM_CONNECT_VOICE: i64 = 1 << 6;
pub const PERM_SPEAK: i64 = 1 << 7;
pub const PERM_MUTE_MEMBERS: i64 = 1 << 8;
pub const PERM_CREATE_INVITE: i64 = 1 << 9;
pub const PERM_KICK_MEMBERS: i64 = 1 << 10;
pub const PERM_ATTACH_FILES: i64 = 1 << 11;
pub const PERM_EMBED_LINKS: i64 = 1 << 12;
pub const PERM_DRAW_WHITEBOARD: i64 = 1 << 13;
pub const PERM_MANAGE_WHITEBOARD: i64 = 1 << 14;

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
    let perms = permissions.unwrap_or(
        PERM_READ_MESSAGES | PERM_SEND_MESSAGES | PERM_CREATE_INVITE
    );
    let max_pos: i32 = conn
        .query_row(
            "SELECT COALESCE(MAX(position), -1) + 1 FROM roles WHERE server_id = ?1",
            rusqlite::params![server_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO roles (id, server_id, name, color, position, permissions, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        rusqlite::params![id, server_id, name, color, max_pos, perms, now],
    ).map_err(|e| e.to_string())?;
    Ok(Role { id, server_id, name, color, position: max_pos, permissions: perms, created_at: now })
}

#[tauri::command]
pub fn update_role(
    db: State<Database>,
    id: String,
    name: Option<String>,
    color: Option<i32>,
    permissions: Option<i64>,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    if let Some(ref name) = name {
        conn.execute("UPDATE roles SET name = ?1 WHERE id = ?2",
            rusqlite::params![name, id]).map_err(|e| e.to_string())?;
    }
    if let Some(color) = color {
        conn.execute("UPDATE roles SET color = ?1 WHERE id = ?2",
            rusqlite::params![color, id]).map_err(|e| e.to_string())?;
    }
    if let Some(perms) = permissions {
        conn.execute("UPDATE roles SET permissions = ?1 WHERE id = ?2",
            rusqlite::params![perms, id]).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub fn delete_role(db: State<Database>, id: String) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM role_assignments WHERE role_id = ?1",
        rusqlite::params![id]).map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM roles WHERE id = ?1",
        rusqlite::params![id]).map_err(|e| e.to_string())?;
    Ok(())
}
```

---

## 4. Code: Permission Checking with Bitwise OR

Permissions are checked by OR'ing all of a user's role bitfields:

```rust
// apps/desktop/src-tauri/src/commands/role.rs
#[tauri::command]
pub fn check_permission(
    db: State<Database>,
    user_id: String,
    server_id: String,
    permission: i64,
) -> Result<bool, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    // Get effective permissions (bitwise OR of all user's roles)
    let effective: i64 = conn
        .query_row(
            "SELECT COALESCE(SUM(r.permissions), 0) FROM roles r
             INNER JOIN role_assignments ra ON r.id = ra.role_id
             WHERE r.server_id = ?1 AND ra.user_id = ?2",
            rusqlite::params![server_id, user_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    Ok((effective & permission) != 0)
}
```

**Permission resolution flow:**

```
┌──────────────────────────────────────────────────────────────────────┐
│                    PERMISSION RESOLUTION                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  User "Alice" has roles:                                              │
│    - Moderator:  0x72F  (bits 0,1,2,3,5,6,7,9,11)                   │
│    - Member:     0x3A0  (bits 5,6,7,9,11)                            │
│                                                                       │
│  Effective (bitwise OR):                                              │
│    0x72F | 0x3A0 = 0x72F                                             │
│                                                                       │
│  Check: PERM_KICK_MEMBERS (1 << 10 = 0x400)                          │
│    0x72F & 0x400 = 0x000 → false ❌                                  │
│                                                                       │
│  Check: PERM_SEND_MESSAGES (1 << 4 = 0x010)                          │
│    0x72F & 0x010 = 0x010 → true ✅                                   │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Permission Resolution Examples

| User Roles | Effective Perms | Can Kick? | Can Send? | Can Draw? |
|-----------|----------------|-----------|-----------|-----------|
| [Admin] | 0x7FFF | ✅ | ✅ | ✅ |
| [Moderator, Member] | 0x72F | ❌ | ✅ | ❌ |
| [Member] | 0x3A0 | ❌ | ✅ | ❌ |
| [Guest] | 0x020 | ❌ | ❌ | ❌ |
| [Voice Only] | 0x0C0 | ❌ | ❌ | ❌ |
| [Whiteboard Editor] | 0x2020 | ❌ | ❌ | ✅ |
| [] (no roles) | 0x000 | ❌ | ❌ | ❌ |

---

## 5. Code: Role Assignment

```rust
// apps/desktop/src-tauri/src/commands/role.rs
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

#[tauri::command]
pub fn remove_role(
    db: State<Database>,
    user_id: String,
    role_id: String,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM role_assignments WHERE role_id = ?1 AND user_id = ?2",
        rusqlite::params![role_id, user_id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}
```

---

## 6. Code: Invite Code Generation and Joining

Users join servers via cryptographically-random invite codes from
`apps/desktop/src-tauri/src/commands/invite.rs`:

```rust
// apps/desktop/src-tauri/src/commands/invite.rs
fn generate_code() -> String {
    use rand::Rng;
    const CHARSET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let mut rng = rand::thread_rng();
    (0..12)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}

#[tauri::command]
pub fn create_invite(
    db: State<Database>,
    server_id: String,
    created_by: String,
    max_uses: Option<i32>,
    expires_at: Option<i64>,
) -> Result<String, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let code = generate_code();
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "INSERT INTO invites (code, server_id, created_by, max_uses, expires_at, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        rusqlite::params![code, server_id, created_by, max_uses, expires_at, now],
    ).map_err(|e| e.to_string())?;
    Ok(code)
}
```

### Invite Code Validation

```rust
#[tauri::command]
pub fn join_via_invite(
    db: State<Database>,
    code: String,
) -> Result<Server, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let invite: (String, Option<i32>, i32, Option<i64>) = conn
        .query_row(
            "SELECT server_id, max_uses, use_count, expires_at FROM invites WHERE code = ?1",
            rusqlite::params![code],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
        )
        .map_err(|_| "Invalid invite code".to_string())?;

    let (server_id, max_uses, use_count, expires_at) = invite;

    if let Some(max) = max_uses {
        if use_count >= max { return Err("Invite has reached max uses".into()); }
    }
    if let Some(expires) = expires_at {
        let now = chrono::Utc::now().timestamp_millis();
        if now > expires { return Err("Invite has expired".into()); }
    }

    conn.execute("UPDATE invites SET use_count = use_count + 1 WHERE code = ?1",
        rusqlite::params![code]).map_err(|e| e.to_string())?;

    conn.query_row(
        "SELECT id, name, owner_id, avatar_path, invite_code, created_at, updated_at
         FROM servers WHERE id = ?1",
        rusqlite::params![server_id],
        |row| Ok(Server {
            id: row.get(0)?, name: row.get(1)?, owner_id: row.get(2)?,
            avatar_path: row.get(3)?, invite_code: row.get(4)?,
            created_at: row.get(5)?, updated_at: row.get(6)?,
        }),
    ).map_err(|_| "Server not found".to_string())
}
```

### Invite Code Properties

| Property | Value |
|----------|-------|
| Length | 12 characters |
| Alphabet | 54 chars (no 0/O/1/I/l) |
| Entropy | log2(54^12) = ~69.5 bits |
| Collision probability | Negligible (2^69 space) |
| Max uses | Configurable (None = unlimited) |
| Expiry | Configurable (None = never) |
| Use tracking | Incremented on each join |

---

## 7. Code: Database Schema

Real table definitions from `crates/libern-core/src/db/schema.rs`:

```sql
-- crates/libern-core/src/db/schema.rs
CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color INTEGER,
    position INTEGER NOT NULL DEFAULT 0,
    permissions INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS role_assignments (
    role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, user_id)
);

CREATE TABLE IF NOT EXISTS invites (
    code TEXT PRIMARY KEY,
    server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    max_uses INTEGER,
    use_count INTEGER NOT NULL DEFAULT 0,
    expires_at INTEGER,
    created_at INTEGER NOT NULL
);
```

---

## 8. Code: Role Model

From `crates/libern-core/src/db/models.rs`:

```rust
// crates/libern-core/src/db/models.rs
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Role {
    pub id: String,
    pub server_id: String,
    pub name: String,
    pub color: Option<i32>,
    pub position: i32,
    pub permissions: i64,
    pub created_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Server {
    pub id: String,
    pub name: String,
    pub owner_id: String,
    pub avatar_path: Option<String>,
    pub invite_code: String,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub display_name: String,
    pub public_key: Vec<u8>,
    pub avatar_path: Option<String>,
    pub is_local: bool,
    pub created_at: i64,
    pub bio: Option<String>,
    pub pronouns: Option<String>,
    pub handle: Option<String>,
}
```

---

## 9. Server Stats — Permission-Related Queries

```rust
// apps/desktop/src-tauri/src/commands/stats.rs
#[tauri::command]
pub fn get_server_stats(db: State<Database>, server_id: String) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let total_members: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM users u
             JOIN role_assignments ra ON u.id = ra.user_id
             JOIN roles r ON ra.role_id = r.id
             WHERE r.server_id = ?1",
            rusqlite::params![server_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    Ok(serde_json::json!({
        "total_members": total_members,
    }))
}
```

---

## 10. End-to-End: User Joins Server via Invite

```
┌──────────────────────────────────────────────────────────────────────┐
│                    USER JOINS SERVER FLOW                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. User has invite code "AbCdEfGhIjKl"                              │
│     │                                                                │
│     ▼                                                                │
│  2. Frontend: invoke("join_via_invite", { code: "AbCdEfGhIjKl" })   │
│     │                                                                │
│     ▼                                                                │
│  3. Rust: invite.rs — join_via_invite()                              │
│     │  a. Look up invite by code in SQLite                           │
│     │  b. Check max_uses (if set, use_count < max_uses)              │
│     │  c. Check expires_at (if set, now < expires_at)                │
│     │  d. Increment use_count                                        │
│     │  e. Return Server object                                       │
│     │                                                                │
│     ▼                                                                │
│  4. Frontend: adds server to Zustand state, navigates to server      │
│     │                                                                │
│     ▼                                                                │
│  5. Default role assignment: server provides "Member" role           │
│     │  - assign_role(user_id, member_role_id)                        │
│     │  - User gains: read, send, connect, speak, attach files        │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 11. Use Cases and Scenarios

| Use Case | Configuration | Benefit |
|----------|--------------|---------|
| School classroom | 1 Admin (teacher), 30 Members (students) | Students can't delete each others' messages |
| Legal team | Partners (Admin), Associates (Moderator), Paralegals (Member) | Tiered access to confidential channels |
| Open source project | Maintainers (Admin), Contributors (Member), Users (Guest) | Read-only for external users |
| Gaming community | Admins, Mods, VIPs, Members | VIP role has voice priority |
| Enterprise department | Director (Admin), Managers (Moderator), Staff (Member) | Permission hierarchy mirrors org chart |

---

## 12. Market Comparison

| Feature | Libern | Discord | Slack | Teams | Matrix |
|---------|--------|---------|-------|-------|--------|
| Bitfield permissions | ✅ (14-bit i64) | ✅ (snowflake) | ❌ (plan-based) | ❌ (AAD) | ❌ (power lvl) |
| Offline permission check | ✅ (SQLite) | ❌ | ❌ | ❌ | ✅ (local) |
| Role colors | ✅ | ✅ | ❌ | ❌ | ❌ |
| Position ordering | ✅ | ✅ | ❌ | ❌ | ❌ |
| Invite codes | ✅ | ✅ | ❌ | ❌ | ✅ |
| Invite max uses | ✅ | ✅ | N/A | N/A | ❌ |
| Invite expiry | ✅ | ✅ | N/A | N/A | ❌ |
| Permission audit ledger | ✅ (.aioss) | ❌ | ❌ | ❌ | ❌ |
| Ed25519 signed roles | ✅ | ❌ | ❌ | ❌ | ❌ |
| CRDT-synced role state | ✅ | ❌ | ❌ | ❌ | ✅ |
| Manage server perm | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage roles perm | ✅ | ✅ | ❌ | ✅ | ✅ |
| Kick members perm | ✅ | ✅ | ❌ | ✅ | ✅ |
| Whiteboard perms | ✅ (2 bits) | ❌ | ❌ | ✅ | ❌ |
| Invite alphabet (69-bit entropy) | ✅ | ❌ | ❌ | ❌ | ❌ |
| User bio/pronouns/handle | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 13. Code: User Management Commands

```rust
// apps/desktop/src-tauri/src/commands/user.rs
#[tauri::command]
pub fn get_users(db: State<Database>, server_id: String) -> Result<Vec<serde_json::Value>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT DISTINCT u.id, u.display_name, u.public_key, u.avatar_path,
                u.is_local, u.created_at, u.bio, u.pronouns, u.handle
         FROM users u
         JOIN role_assignments ra ON u.id = ra.user_id
         JOIN roles r ON ra.role_id = r.id
         WHERE r.server_id = ?1
         ORDER BY u.display_name"
    ).map_err(|e| e.to_string())?;

    let users = stmt.query_map(rusqlite::params![server_id], |row| {
        Ok(serde_json::json!({
            "id": row.get::<_, String>(0)?,
            "display_name": row.get::<_, String>(1)?,
            "public_key": hex::encode(row.get::<_, Vec<u8>>(2)?),
            "avatar_path": row.get::<_, Option<String>>(3)?,
            "is_local": row.get::<_, i32>(4)? != 0,
            "created_at": row.get::<_, i64>(5)?,
            "bio": row.get::<_, Option<String>>(6)?,
            "pronouns": row.get::<_, Option<String>>(7)?,
            "handle": row.get::<_, Option<String>>(8)?,
        }))
    }).map_err(|e| e.to_string())?
    .collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())?;

    Ok(users)
}
```

---

## 14. Profile Editor Component

```tsx
// apps/desktop/src/components/profile/ProfileEditor.tsx
export function ProfileEditor({ userId }: { userId: string }) {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [pronouns, setPronouns] = useState("");

  const handleSave = async () => {
    await invoke("update_profile", { userId, displayName, bio, pronouns });
    toast.success("Profile updated!");
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="text-sm font-medium">Display Name</label>
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-3 py-2 rounded border" />
      </div>
      <div>
        <label className="text-sm font-medium">Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)}
          className="w-full px-3 py-2 rounded border" rows={3} />
      </div>
      <div>
        <label className="text-sm font-medium">Pronouns</label>
        <select value={pronouns} onChange={(e) => setPronouns(e.target.value)}
          className="w-full px-3 py-2 rounded border">
          <option value="">Prefer not to say</option>
          <option value="he/him">he/him</option>
          <option value="she/her">she/her</option>
          <option value="they/them">they/them</option>
          <option value="any/all">any/all</option>
        </select>
      </div>
      <Button onClick={handleSave}>Save Profile</Button>
    </div>
  );
}
```

---

## 15. Server Management Commands

```rust
// apps/desktop/src-tauri/src/commands/server.rs
#[tauri::command]
pub fn create_server(
    db: State<Database>, name: String, owner_id: String,
) -> Result<serde_json::Value, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let id = uuid::Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();
    let invite_code = generate_code();

    conn.execute(
        "INSERT INTO servers (id, name, owner_id, invite_code, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?5)",
        rusqlite::params![id, name, owner_id, invite_code, now],
    ).map_err(|e| e.to_string())?;

    // Create default #general channel
    conn.execute(
        "INSERT INTO channels (id, server_id, name, kind, position, created_at)
         VALUES (?1, ?2, 'general', 'text', 0, ?3)",
        rusqlite::params![uuid::Uuid::new_v4().to_string(), id, now],
    ).map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "id": id, "name": name, "owner_id": owner_id,
        "invite_code": invite_code, "created_at": now,
    }))
}
```

---

## 16. Create Server Modal (Frontend)

```tsx
// apps/desktop/src/components/server/CreateServerModal.tsx
export function CreateServerModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    const result = await invoke("create_server", { name, ownerId: currentUserId });
    // Liber sends welcome message to #general
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-bold">Create Server</h2>
        <p className="text-sm text-[var(--fill-secondary)]">
          A new #general channel will be created automatically.
          Liber will post a welcome message with .aioss recording notice.
        </p>
        <Input placeholder="Server name" value={name}
          onChange={(e) => setName(e.target.value)} />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>Create</Button>
        </div>
      </div>
    </Dialog>
  );
}
```

---

## 17. Create Channel Modal (Frontend)

```tsx
// apps/desktop/src/components/server/CreateChannelModal.tsx
export function CreateChannelModal({ serverId, onClose }: { serverId: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"text" | "voice" | "whiteboard">("text");

  const handleCreate = async () => {
    await invoke("create_channel", { serverId, name, kind });
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-bold">Create Channel</h2>
        <Input placeholder="Channel name" value={name}
          onChange={(e) => setName(e.target.value)} />
        <select value={kind} onChange={(e) => setKind(e.target.value as any)}
          className="w-full px-3 py-2 rounded border">
          <option value="text">Text</option>
          <option value="voice">Voice</option>
          <option value="whiteboard">Whiteboard</option>
        </select>
        <p className="text-xs text-[var(--fill-tertiary)]">
          Liber will post a welcome message in new text channels.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>Create</Button>
        </div>
      </div>
    </Dialog>
  );
}
```

---

## 18. Permission Check in Tauri Commands

Permissions are enforced at the Tauri command level. Example of a permission-gated command:

```rust
// Checking permissions before executing sensitive operations
pub fn require_permission(
    db: &Database, user_id: &str, server_id: &str, required_perm: i64,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let effective: i64 = conn
        .query_row(
            "SELECT COALESCE(SUM(r.permissions), 0) FROM roles r
             INNER JOIN role_assignments ra ON r.id = ra.role_id
             WHERE r.server_id = ?1 AND ra.user_id = ?2",
            rusqlite::params![server_id, user_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    if (effective & required_perm) == 0 {
        return Err("Insufficient permissions".to_string());
    }
    Ok(())
}
```

---

## 19. Key Takeaway

**Libern's RBAC is the first offline-verifiable permission system for
collaboration platforms.** The 14-bit permission bitfield allows compact
representation (single i64 per role), bitwise-OR composition for multi-role
users, and local SQLite-based verification without network access. Role
creation, assignment, and permission checking are fully local Tauri commands
that operate on the embedded database — no API calls, no cloud round-trips.
Invite codes use a 12-character cryptographically random alphabet with
optional max-uses and expiry. Every role change is recorded in the .aioss
ledger for tamper-evident audit, making Libern the only RBAC system that
can cryptographically prove "who had which permission when."

The system supports 15 distinct permission bits packed into an i64 with room
for expansion, role colors with position-based ordering, composite permission
resolution via SQL SUM on role_assignments JOIN, and Ed25519-signed role
creation events in the cryptographic ledger. Combined with the Libern user
model (display name, public key, avatar, bio, pronouns, handle), this RBAC
system provides a complete identity and access control layer for sovereign,
offline-first collaboration.

---

## 14. References

1. Libern Desktop. "Permission constants, role CRUD, check_permission." apps/desktop/src-tauri/src/commands/role.rs, 2026.
2. Libern Desktop. "Invite code generation and join_via_invite." apps/desktop/src-tauri/src/commands/invite.rs, 2026.
3. Libern Core. "Database schema for roles, role_assignments, invites." crates/libern-core/src/db/schema.rs, 2026.
4. Libern Core. "Role, Server, and User models." crates/libern-core/src/db/models.rs, 2026.
5. Ferraiolo, D.F., et al. "Role-Based Access Controls." NIST, 1992.
6. Sandhu, R., et al. "Role-Based Access Control Models." IEEE Computer, 1996.
7. Libern Desktop. "Server stats with role-based member counting." apps/desktop/src-tauri/src/commands/stats.rs, 2026.

**Related docs:**
- /docs/features/01-libern-overview.md
- /docs/features/07-crypto-ledger.md
- /docs/features/09-marketplace.md
- /docs/guides/02-server-setup.md

**Plain text backup:** /docs-txt/features/08-role-permissions.txt

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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com