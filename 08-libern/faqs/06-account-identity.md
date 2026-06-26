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
Category: FAQ
Document ID: FAQ-006
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Account and Identity FAQ

## How do identities work?

Libern uses **cryptographic identity** based on Ed25519 key pairs. When you create an identity:

1. A UUID is generated as your user ID.
2. An Ed25519 key pair is generated (32-byte public key, 64-byte private key).
3. Your display name and public key are stored in the local SQLite database.
4. The private key is used for signing messages (currently placeholder, full implementation in progress).

```rust
// From apps/desktop/src-tauri/src/commands/user.rs
#[tauri::command]
pub fn create_user(display_name: String) -> Result<User, String> {
    let id = Uuid::new_v4().to_string();
    let public_key = vec![0u8; 32];
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "INSERT INTO users (id, display_name, public_key, is_local, created_at)
         VALUES (?1, ?2, ?3, 1, ?4)",
        rusqlite::params![id, display_name, public_key, now],
    )?;
    Ok(User { id, display_name, public_key, ... })
}
```

### Identity Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Libern Identity System                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Onboarding                                              │
│  1. User enters display name                             │
│  2. System generates:                                    │
│     - UUID (v4) for user ID                             │
│     - Ed25519 keypair (public + private)                │
│  3. Stored in local SQLite                               │
│                                                          │
│  users table structure:                                  │
│  ┌──────────┬──────────────┬──────────────┬──────────┐  │
│  │   id     │ display_name │  public_key  │ is_local │  │
│  ├──────────┼──────────────┼──────────────┼──────────┤  │
│  │ uuid...  │   "Alice"    │  [32 bytes]  │    1     │  │
│  │ uuid...  │   "Bob"      │  [32 bytes]  │    0     │  │
│  │ 0000...1 │   "Liber"    │  [32 bytes]  │    1     │  │
│  └──────────┴──────────────┴──────────────┴──────────┘  │
│                                                          │
│  is_local = 1: This machine's user                      │
│  is_local = 0: Remote peer discovered via LAN           │
└─────────────────────────────────────────────────────────┘
```

---

## How many identities can I have?

You can have multiple local users, but only one is set as the "local" user (`is_local = 1`). Multiple remote users (peers on the LAN) are stored with `is_local = 0`.

---

## Can I recover my keys?

Currently, key recovery is not implemented. The private key is:
- Generated at identity creation.
- Currently a placeholder (`vec![0u8; 32]`).
- Not yet exported or backed up.

Future versions will include:
- **Key export/import**: Export your private key as an encrypted file.
- **Recovery phrase**: BIP-39 style mnemonic for key recovery.
- **Cross-device sync**: Optional encrypted sync between your devices.

---

## What information is stored about me?

The `users` table stores:
```sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    public_key BLOB NOT NULL,
    avatar_path TEXT,
    is_local INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

-- Extended profile fields (via migrations)
ALTER TABLE users ADD COLUMN bio TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN pronouns TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN handle TEXT;
```

The `User` model in TypeScript:
```typescript
interface User {
  id: string;
  display_name: string;
  public_key: number[];
  avatar_path: string | null;
  is_local: number;
  created_at: number;
}
```

### Profile Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | UUID v4 | Unique identifier | Auto-generated |
| display_name | String | Visible name | Yes |
| public_key | 32 bytes | Ed25519 public key | Auto-generated |
| avatar_path | String/null | Path to avatar image | Optional |
| is_local | 0 or 1 | Local or remote user | Auto-set |
| bio | String | Short biography | Optional |
| pronouns | String | Gender pronouns | Optional |
| handle | String | Unique handle | Optional |

---

## How do I update my profile?

```typescript
import { updateProfile } from "./lib/api";
await updateProfile(
    userId,
    "My bio text",     // bio
    "they/them",       // pronouns
    "myhandle",        // handle (unique)
    "NewDisplayName"   // display_name
);
```

### Check Handle Availability

```typescript
import { checkHandle } from "./lib/api";
const isAvailable = await checkHandle("myhandle");
```

### Update Display Name

```typescript
import { updateDisplayName } from "./lib/api";
await updateDisplayName(userId, "New Name");
```

### Profile Update Commands

```rust
#[tauri::command]
pub fn update_profile(
    db: State<Database>,
    user_id: String,
    bio: Option<String>,
    pronouns: Option<String>,
    handle: Option<String>,
    display_name: Option<String>,
) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    if let Some(b) = bio {
        conn.execute("UPDATE users SET bio = ?1 WHERE id = ?2",
            rusqlite::params![b, user_id]).map_err(|e| e.to_string())?;
    }
    if let Some(p) = pronouns {
        conn.execute("UPDATE users SET pronouns = ?1 WHERE id = ?2",
            rusqlite::params![p, user_id]).map_err(|e| e.to_string())?;
    }
    if let Some(h) = handle {
        conn.execute("UPDATE users SET handle = ?1 WHERE id = ?2",
            rusqlite::params![h, user_id]).map_err(|e| e.to_string())?;
    }
    if let Some(d) = display_name {
        conn.execute("UPDATE users SET display_name = ?1 WHERE id = ?2",
            rusqlite::params![d, user_id]).map_err(|e| e.to_string())?;
    }

    Ok(())
}
```

---

## Can I have the same identity on multiple machines?

Not yet. Each Libern installation creates a unique identity. Future versions will allow:
1. Exporting your identity key from one machine.
2. Importing it on another machine.
3. The public key will match, allowing peers to recognize you across devices.

---

## What is the "local user"?

The local user is the identity created during onboarding. It is marked with `is_local = 1`. The `get_local_user` command returns the first user with `is_local = 1`:

```rust
#[tauri::command]
pub fn get_local_user(db: State<Database>) -> Result<Option<User>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let result = conn.query_row(
        "SELECT id, display_name, public_key, avatar_path, is_local, created_at
         FROM users WHERE is_local = 1 LIMIT 1",
        [],
        |row| {
            Ok(User {
                id: row.get(0)?,
                display_name: row.get(1)?,
                public_key: row.get(2)?,
                avatar_path: row.get(3)?,
                is_local: row.get(4)?,
                created_at: row.get(5)?,
            })
        },
    );
    match result {
        Ok(user) => Ok(Some(user)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}
```

---

## What happens to remote users?

When peers discover each other via LAN, their user information is synchronized:
1. Peer A broadcasts presence via mDNS.
2. Peer B discovers Peer A and adds them to the local database.
3. Remote users have `is_local = 0`.
4. Remote users' public keys are stored for signature verification.

### Remote User Sync

```
Peer A (local user: Alice)          Peer B (local user: Bob)
        │                                   │
        │  mDNS: "Alice available"          │
        │──────────────────────────────────►│
        │                                   │
        │                                   │  INSERT INTO users
        │                                   │  (id: A's UUID, name: "Alice",
        │                                   │   is_local: 0)
        │  mDNS: "Bob available"            │
        │◄──────────────────────────────────│
        │                                   │
        │  INSERT INTO users                │
        │  (id: B's UUID, name: "Bob",     │
        │   is_local: 0)                   │
        │                                   │
```

---

## Can I delete my identity?

Deleting your identity means deleting the user record from the database:
1. Close Libern.
2. Delete the app data directory (or just `libern.db`).
3. Restart Libern — it will prompt for onboarding again.

**Warning**: This is permanent. There is no way to recover your identity.

---

## What is the Liber user?

Liber has a reserved system user ID: `00000000-0000-0000-0000-000000000001`. This user is created automatically when the database initializes:

```rust
// From crates/libern-core/src/ai/liber_user.rs
pub const LIBER_USER_ID: &str = "00000000-0000-0000-0000-000000000001";

pub fn ensure_liber_user(db: &Database) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().timestamp_millis();
    conn.execute(
        "INSERT OR IGNORE INTO users (id, display_name, public_key, is_local, created_at)
         VALUES (?1, 'Liber', x'00...00', 1, ?2)",
        rusqlite::params![LIBER_USER_ID, now],
    )?;
    Ok(())
}
```

Liber posts welcome messages and AI responses as this system user.

---

## How is my profile displayed?

The `Profile` component (in `apps/desktop/src/components/profile/`) displays:
- Display name
- Avatar (from `avatar_path` or generated initials)
- Bio
- Pronouns
- Handle
- Join date

The `Avatar` UI component renders:
- Image from `avatar_path` if available
- Generated initials (first 2 characters of display name) as fallback

### Avatar Generation

```typescript
// From apps/desktop/src/components/profile/Avatar.tsx
export function Avatar({ user, size = 40 }: { user: User; size?: number }) {
    if (user.avatar_path) {
        return <img src={user.avatar_path} alt={user.display_name}
                    style={{ width: size, height: size, borderRadius: '50%' }} />;
    }

    // Generate initials from display name
    const initials = user.display_name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: stringToColor(user.display_name),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: size * 0.4,
        }}>
            {initials}
        </div>
    );
}
```

---

## Multiple users on one machine?

Currently, only one local user per installation is supported. The onboarding creates a single user. To switch users:
1. Delete the current user's database.
2. Restart Libern and create a new identity.

Multi-user support may be added in future versions.

---

## Identity Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│              Identity Lifecycle                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Creation                                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Onboarding → Enter name → Generate keypair      │   │
│  │ → INSERT users → Return User                     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Usage                                                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Send messages (signed with private key)          │   │
│  │ Join/create servers                              │   │
│  │ Update profile (name, bio, pronouns, handle)     │   │
│  │ Discovered by LAN peers                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Deletion                                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Delete libern.db → Identity lost permanently     │   │
│  │ No recovery possible (key backup not yet impl.) │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Future: Export/Import                                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Export encrypted private key                     │   │
│  │ Import on another device                         │   │
│  │ Same public key = same identity                  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## User Model (Rust)

```rust
// From crates/libern-core/src/db/models.rs
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub display_name: String,
    pub public_key: Vec<u8>,
    pub avatar_path: Option<String>,
    pub is_local: i32,
    pub created_at: i64,
    // Extended fields (via migrations)
    pub bio: Option<String>,
    pub pronouns: Option<String>,
    pub handle: Option<String>,
}
```

### User Queries

```rust
// Get local user
pub fn get_local_user(conn: &Connection) -> Result<Option<User>, String> {
    let result = conn.query_row(
        "SELECT id, display_name, public_key, avatar_path, is_local, created_at,
                bio, pronouns, handle
         FROM users WHERE is_local = 1 LIMIT 1",
        [],
        |row| {
            Ok(User {
                id: row.get(0)?,
                display_name: row.get(1)?,
                public_key: row.get(2)?,
                avatar_path: row.get(3)?,
                is_local: row.get(4)?,
                created_at: row.get(5)?,
                bio: row.get(6)?,
                pronouns: row.get(7)?,
                handle: row.get(8)?,
            })
        },
    );
    match result {
        Ok(user) => Ok(Some(user)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

// Get user by ID
pub fn get_user(conn: &Connection, user_id: &str) -> Result<Option<User>, String> {
    // Similar query with WHERE id = ?1
}
```

---

## Profile UI Components

```typescript
// From apps/desktop/src/components/profile/ProfilePanel.tsx
interface ProfilePanelProps {
  user: User;
  isLocal: boolean;
  onClose: () => void;
}

export function ProfilePanel({ user, isLocal }: ProfilePanelProps) {
  return (
    <div className="profile-panel">
      <Avatar user={user} size={80} />
      <h2>{user.display_name}</h2>
      {user.handle && <span className="handle">@{user.handle}</span>}
      {user.pronouns && <span className="pronouns">{user.pronouns}</span>}
      {user.bio && <p className="bio">{user.bio}</p>}
      <div className="meta">
        <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
        {isLocal && <span className="badge">You</span>}
      </div>
      {isLocal && <ProfileEditor user={user} />}
    </div>
  );
}
```

### Ed25519 Key Generation (Planned)

```rust
// Future Ed25519 key generation
use ed25519_dalek::{Keypair, Signer, Verifier};

pub fn generate_identity() -> (Vec<u8>, Vec<u8>) {
    let mut csprng = rand::rngs::OsRng;
    let keypair = Keypair::generate(&mut csprng);

    let public_key = keypair.public.to_bytes().to_vec();   // 32 bytes
    let private_key = keypair.secret.to_bytes().to_vec();  // 32 bytes

    (public_key, private_key)
}

pub fn sign_message(private_key: &[u8], message: &[u8]) -> Vec<u8> {
    let secret = ed25519_dalek::SecretKey::from_bytes(private_key).unwrap();
    let public = ed25519_dalek::VerifyingKey::from(&secret);
    let keypair = Keypair { secret, public };
    keypair.sign(message).to_bytes().to_vec()  // 64 bytes
}
```

---

## Identity FAQ Summary

| Question | Answer |
|----------|--------|
| How are identities created? | Ed25519 key pair + UUID |
| Can I recover my keys? | Not yet (planned) |
| Can I have multiple users? | One local user per install |
| What is stored about me? | Display name, public key, bio, pronouns, handle |
| Can I change my name? | Yes, via API |
| Can I use same ID on multiple machines? | Not yet (planned) |
| What is the Liber user? | System user ID 0000...001 |
| Can I delete my identity? | Yes, delete database |
| How does the Avatar work? | Image or generated initials |
| Can I set a custom avatar? | Yes, via avatar_path |
| What happens to remote users? | Stored with is_local=0 |
| How is the Liber user created? | Automatically on DB init |

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