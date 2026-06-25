<!--
  ▄▄   ▄▄▄                      ▄▄                        ▄▄                     
  ██  ██▀                       ██                        ██                     
  ▄▄▄█  ██▄██      ▄█████▄  ████████  ██ ▄██▀    ▄█████▄   ▄███▄██   ▄████▄   █▄▄▄     
  ▄▄█▀▀▀    █████      ▀ ▄▄▄██      ▄█▀   ██▄██      ▀ ▄▄▄██  ██▀  ▀██  ██▄▄▄▄██    ▀▀▀█▄▄ 
  ▀▀█▄▄▄    ██  ██▄   ▄██▀▀▀██    ▄█▀     ██▀██▄    ▄██▀▀▀██  ██    ██  ██▀▀▀▀▀▀    ▄▄▄█▀▀ 
      ▀▀▀█  ██   ██▄  ██▄▄▄███  ▄██▄▄▄▄▄  ██  ▀█▄   ██▄▄▄███  ▀██▄▄███  ▀██▄▄▄▄█  █▀▀▀     
           ▀▀    ▀▀   ▀▀▀▀ ▀▀  ▀▀▀▀▀▀▀▀  ▀▀   ▀▀▀   ▀▀▀▀ ▀▀    ▀▀▀ ▀▀    ▀▀▀▀▀
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# RBAC Guide

This guide covers role-based access control including role definitions, permission scopes, and .aioss keypair roles.

## RBAC Model

`
┌──────────────────────────────────────────────────────────┐
│                    RBAC Hierarchy                         │
│                                                           │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐       │
│  │ User     │───>│ Role     │───>│ Permissions   │       │
│  │ (Ed25519)│    │ (Group)  │    │ (Scopes)      │       │
│  └──────────┘    └──────────┘    └──────────────┘       │
│       │                │                │                │
│       ▼                ▼                ▼                │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐       │
│  │ Keypair  │    │ Inherits │    │ Resources    │       │
│  │ Auth     │    │ from org │    │ (stores, API)│       │
│  └──────────┘    └──────────┘    └──────────────┘       │
└──────────────────────────────────────────────────────────┘
`

## Built-in Roles

### Enterprise Roles

| Role | Level | Description |
|------|-------|-------------|
| superadmin | System | Full system access, all teams |
| dmin | Team/Org | Team administration |
| uditor | System | Read-only audit access |
| operator | Team | Data operations |
| nalyst | Team | Query and analysis |
| iewer | Team | Read-only queries |

### Permission Definitions

`yaml
# ~/.kazcade/rbac/roles.yml
roles:
  superadmin:
    description: "Full system administration"
    permissions:
      - system:*
      - teams:*
      - ledger:*
      - users:*
      - license:*

  admin:
    description: "Team administration"
    permissions:
      - team:manage
      - team:members
      - team:quota
      - team:stores
      - team:queries
      - team:audit

  auditor:
    description: "Read-only audit access"
    permissions:
      - ledger:read
      - ledger:verify
      - audit:read
      - audit:export

  operator:
    description: "Data operations"
    permissions:
      - stores:read
      - stores:write
      - stores:delete
      - stores:ingest
      - stores:export
      - queries:run
      - queries:manage

  analyst:
    description: "Data analysis"
    permissions:
      - stores:read
      - queries:run
      - queries:save
      - export:csv
      - export:json
      - export:parquet
      - dashboard:use

  viewer:
    description: "Read-only access"
    permissions:
      - stores:read
      - queries:run
      - dashboard:use
`

## Permission Scopes

### Resource Scopes

`yaml
scopes:
  system:
    - "*"                    # All system resources
    - "config"              # System configuration
    - "license"             # License management

  teams:
    - "*"                   # All teams
    - "team:<name>"         # Specific team

  stores:
    - "*"                   # All stores
    - "store:<name>"        # Specific store
    - "store:<team>/*"      # Team stores

  ledger:
    - "*"                   # Full ledger access
    - "read"                # Read-only
    - "verify"              # Verification only
    - "write"               # Create entries

  queries:
    - "*"                   # All query actions
    - "run"                 # Execute queries
    - "save"                # Save queries
    - "manage"              # Manage query queue

  users:
    - "*"                   # All user management
    - "create"              # Create users
    - "deactivate"          # Deactivate users
    - "roles"               # Assign roles
`

### Permission Evaluation

`python
def check_permission(user, action, resource):
    # 1. Check user's roles
    for role in user.roles:
        # 2. Deny explicity overrides
        if role.denies(action, resource):
            return False
        # 3. Allow if any role grants it
        if role.allows(action, resource):
            return True
    # 4. Default deny
    return False
`

## Managing Roles

### CLI

`ash
# Create custom role
kazcade-ctl role create custom-analyst \
  --display-name "Custom Analyst" \
  --description "Analyst with export permissions" \
  --permissions "stores:read,queries:run,export:*,dashboard:use"

# Assign role
kazcade-ctl user role assign alice@company.com \
  --role custom-analyst \
  --scope "team:analytics"

# Remove role
kazcade-ctl user role remove alice@company.com \
  --role custom-analyst

# List roles
kazcade-ctl role list
`

### API

`ash
# Create role
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "custom-analyst",
    "display_name": "Custom Analyst",
    "permissions": ["stores:read", "queries:run", "export:*"]
  }' \
  https://kazcade.company.com/api/v1/admin/roles

# Assign role
curl -X POST -H "Authorization: Bearer <token>" \
  https://kazcade.company.com/api/v1/admin/users/alice@company.com/roles \
  -d '{"role": "custom-analyst", "scope": "team:analytics"}'
`

## .aioss Keypair Roles

Kazkade uses Ed25519 keypairs for authentication and role binding.

### Key Generation

`ash
# Generate admin keypair
kazkade ledger keygen --output admin-key.json --type admin

# Generate operator keypair
kazkade ledger keygen --output operator-key.json --type operator

# Generate auditor keypair
kazkade ledger keygen --output auditor-key.json --type auditor
`

### Key Info

`ash
kazkade ledger keyinfo admin-key.json
`

`
Public Key:  ed25519:abcd1234...
Role:        admin
Scope:       system:*
Created:     2026-06-19T12:00:00Z
Expires:     2027-06-19T12:00:00Z
Issuer:      superadmin (ed25519:aaaa...)
`

### Role Binding

Keys are bound to roles via ledger entries:

`ash
# Bind key to role
kazkade ledger entry create \
  --type RoleBinding \
  --data '{
    "public_key": "ed25519:abcd1234...",
    "role": "admin",
    "scope": "team:analytics",
    "expires": "2027-06-19T12:00:00Z"
  }' \
  --sign superadmin-key.json
`

### Key-based Authentication

`ash
# Authenticate with keypair
kazkade query "SELECT * FROM data" \
  --key admin-key.json

# API authentication
curl -H "Authorization: Key ed25519:abcd1234..." \
  -H "Signature: <signed-payload>" \
  https://kazcade.company.com/api/v1/query
`

### Key Revocation

`ash
# Revoke a key
kazkade ledger entry create \
  --type KeyRevocation \
  --data '{"public_key": "ed25519:abcd1234..."}' \
  --sign superadmin-key.json

# Verify key is valid
kazkade ledger keyverify ed25519:abcd1234...
# Status: REVOKED (since 2026-06-19T13:00:00Z)
`

## Role Hierarchy and Inheritance

`
Organization Level
└── superadmin
    └── admin
        └── auditor

Team Level
└── team-admin
    ├── operator
    ├── analyst
    └── viewer
`

Inheritance:

`yaml
roles:
  team-admin:
    inherits: []
    permissions: [team:*]
  operator:
    inherits: [viewer]
    permissions: [stores:write, stores:ingest, stores:export]
  analyst:
    inherits: [viewer]
    permissions: [queries:save, export:*]
  viewer:
    inherits: []
    permissions: [stores:read, queries:run]
`

## Audit Logging

All RBAC operations are logged:

`ash
kazcade-ctl audit --type rbac --since 24h
`

`
2026-06-19 12:00  RoleBinding   admin@co  key:abcd → analyst (scope:analytics)
2026-06-19 11:30  RoleCreate    admin@co  role:custom-analyst created
2026-06-19 10:00  KeyRevoke     admin@co  key:dead → revoked (compromised)
`

## Best Practices

1. **Principle of least privilege** — Start with viewer, grant as needed
2. **Key rotation** — Rotate keys every 90 days
3. **Role separation** — Admin and auditor must be different people
4. **Audit all changes** — Every permission change is a ledger entry
5. **Default deny** — Unspecified permissions are denied

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

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
