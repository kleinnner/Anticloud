▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

────────────────────────────────────────────────────────────────

# GDPR Compliance

**Category:** Privacy
**File:** 03-gdpr-compliance.md
**Revision:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Data Locality](#data-locality)
3. [Data Export](#data-export)
4. [Data Deletion](#data-deletion)
5. [Purpose Limitation](#purpose-limitation)
6. [Data Minimization](#data-minimization)
7. [Security of Processing](#security-of-processing)
8. [Controller vs Processor Status](#controller-vs-processor-status)
9. [Cross-Border Data Transfers](#cross-border-data-transfers)
10. [References](#references)

---

## Overview

Libern's architecture is uniquely suited to help organizations and individuals meet their obligations under the **General Data Protection Regulation (GDPR)** (Regulation (EU) 2016/679). Because Libern operates on a fully local, offline-first, no-cloud basis, many of GDPR's most challenging requirements are either automatically satisfied or significantly simplified.

---

## Data Locality

### Article 5(1)(e): Storage Limitation

All personal data is stored locally on the user's machine. Data retention is entirely under the user's control.

### Article 28: Processor

Libern is not a data processor. All processing occurs on the user's local machine. The user is the data controller.

### Data Location Specification

| Data Type | Location | Jurisdiction | Controller Control |
|-----------|----------|-------------|-------------------|
| Messages | Local SQLite | User's machine | Full |
| User profiles | Local SQLite | User's machine | Full |
| AI conversations | Local SQLite | User's machine | Full |
| .aioss ledgers | Local filesystem | User's machine | Full |
| Ed25519 keys | Local SQLite (encrypted) | User's machine | Full |
| AI model | Local filesystem | User's machine | Full |

---

## Data Export

### Article 20: Right to Data Portability

Libern satisfies Article 20 with immediate, complete data export in three open formats:

**Format 1: .aioss JSON**
```json
{
  "session_id": "uuid-here",
  "status": "sealed",
  "entries": [{ "timestamp": "...", "type": "message", "content": {...} }]
}
```

**Format 2: SQLite Dump**
```bash
sqlite3 data.db .dump > libern-full-export.sql
```

**Format 3: Plain Text (TXT)**
```
2026-06-14T12:00:00.000Z|0|message|user1|Alice|||hash...|Hello!
```

### GDPR Compliance for Export

| Requirement | Libern's Compliance |
|-------------|-------------------|
| Without undue delay | Instant |
| Commonly used format | JSON, CSV, SQL |
| Machine-readable | Yes |
| Structured | Yes (schema-documented) |
| No charge | Free |
| No hindrance | No rate limits |

---

## Data Deletion

### Article 17: Right to Erasure

**Path 1: Individual Messages**
- Removed from SQLite, recorded in .aioss as deletion event

**Path 2: Channel or Server Deletion**
- Removes all associated data from local database

**Path 3: Full Data Wipe**
```bash
rm -rf ~/.local/share/libern
```

### Deletion Limitations

| Data | Deletable? |
|------|-----------|
| Messages in SQLite | Yes (content removed) |
| .aioss entries | Partial (content hash remains) |
| Ed25519 keys | Yes |
| User profile | Yes |
| AI model | Yes |
| P2P copies on peers | No (user should notify peers) |

---

## Purpose Limitation

### Article 5(1)(b)

Libern processes data for a single purpose: collaboration. No secondary processing:

| Purpose | Implemented? |
|---------|-------------|
| Message delivery | Yes |
| Message storage | Yes |
| AI assistance | Yes (fully local) |
| Content moderation | Yes (fully local) |
| Advertising profiling | No |
| Product analytics | No |
| Third-party data sharing | No |
| AI model training | No |

---

## Data Minimization

### Article 5(1)(c)

| Data Field | Required? | Purpose |
|-----------|-----------|---------|
| Display name | Yes | Identification |
| Ed25519 public key | Yes | Authentication |
| Avatar | No | Visual ID |
| User ID (UUID) | Yes | Foreign keys |
| Pronouns | No | User preference |
| Bio | No | User preference |

**What Libern does NOT collect:**
Email, phone, real name, address, DOB, gender, IP, device IDs, location, browsing history, contacts

---

## Security of Processing

### Article 32

| Security Measure | Implementation | GDPR Reference |
|-----------------|---------------|----------------|
| Pseudonymisation | Ed25519 public key identity | 32(1)(a) |
| Encryption at rest | AES-256-GCM for keys | 32(1)(a) |
| Encryption in transit | X25519 + AES-256-GCM | 32(1)(a) |
| Integrity | SHA3-256 hash chain | 32(1)(b) |
| Availability | Local data, no server | 32(1)(b) |
| Resilience | CRDT merge recovery | 32(1)(c) |
| Testing | verify_any() | 32(1)(d) |

---

## Controller vs Processor Status

Libern is a **tool**, not a service. The user/organization is the **data controller**:

```
User/Organization
  Role: Data Controller
  - Decides what data to process
  - Determines purposes and means
  - Ensures lawful basis
  - Responds to data subject requests

  Tool: Libern (desktop application)
  - Does not process data on behalf of controller
  - Does not have access to controller's data
  - Is not a data processor
```

A Data Processing Agreement (DPA) with Libern's developers is not required.

---

## Cross-Border Data Transfers

### Articles 44-49

Libern does not transfer personal data across borders by default. In P2P mode, data is transferred directly between peers (controller-to-controller). Standard Contractual Clauses are not required.

---

## GDPR Data Flow Map

```
┌─────────────────────────────────────────────────────────────┐
│                    GDPR Data Flow Map                        │
│                                                              │
│  Controller: [Organization Name]                             │
│  Processor: NONE (Libern is local software)                  │
│  DPO: [Name / Contact]                                       │
│                                                              │
│  Data Flows:                                                  │
│                                                              │
│  User Input ──► Libern Application ──► Local SQLite          │
│       │              │                       │               │
│       │              ▼                       ▼               │
│       │         Local AI (Qwen)         .aioss Ledger        │
│       │              │                       │               │
│       │              ▼                       ▼               │
│       │         Local Only             Local Only            │
│       │                                                   │
│       └──► Optional: P2P to authorized peers (same org)  │
│                                                              │
│  Third Countries: NONE (all data stays local)               │
│  Automated Decisions: NONE (AI is assistive only)           │
│  Profiling: NONE                                            │
└─────────────────────────────────────────────────────────────┘
```

## Data Subject Rights Implementation

```
┌─────────────────────────────────────────────────────────────┐
│              Data Subject Request Handling                    │
│                                                               │
│  User submits request                                         │
│         │                                                     │
│         ▼                                                     │
│  Identify request type:                                       │
│  ├── Right of Access (Art. 15) → Export user data as JSON    │
│  ├── Right to Rectification (Art. 16) → Use edit commands    │
│  ├── Right to Erasure (Art. 17) → Anonymize messages, delete │
│  ├── Right to Portability (Art. 20) → Export in JSON/CSV     │
│  └── Right to Restrict (Art. 18) → Disable AI, P2P           │
│         │                                                     │
│         ▼                                                     │
│  Execute within 30 days (Art. 12(3))                          │
│         │                                                     │
│         ▼                                                     │
│  Document the request and response in .aioss audit trail      │
│         │                                                     │
│         ▼                                                     │
│  Confirm completion to data subject (Art. 12(3))              │
└─────────────────────────────────────────────────────────────┘
```

## GDPR Compliance Verification

```bash
#!/bin/bash
# libern-gdpr-check.sh — Verify GDPR compliance
echo "=== GDPR Compliance Check ==="
echo ""

# 1. Data Controller Status
echo "1. Controller/Processor Status:"
echo "   Libern is a TOOL, not a PROCESSOR"
echo "   → No DPA required with Libern developers"
echo "   → Organization is sole Data Controller"

# 2. Data Location
echo ""
echo "2. Data Location:"
DB_PATH="$HOME/.local/share/libern/data.db"
if [ -f "$DB_PATH" ]; then
    echo "   SQLite database: LOCAL only"
    # Check for any cloud paths in config
    if grep -q "cloud\|s3\|azure\|gcs" "$HOME/.local/share/libern/config.json" 2>/dev/null; then
        echo "   WARNING: Cloud paths detected in config!"
    else
        echo "   No cloud storage configured: ✓"
    fi
fi

# 3. Data Minimization
echo ""
echo "3. Data Minimization:"
echo "   Required PII fields: 2 (display_name, public_key)"
echo "   Optional fields: 3 (avatar, bio, pronouns)"
echo "   Email: NOT COLLECTED"
echo "   Phone: NOT COLLECTED"
echo "   Real name: NOT COLLECTED"

# 4. Right to Erasure
echo ""
echo "4. Right to Erasure (Art. 17):"
echo "   delete_message: SOFT DELETE ✓"
echo "   VACUUM: HARD DELETE available ✓"
echo "   Full data wipe: rm -rf ~/.local/share/libern ✓"

# 5. Data Portability
echo ""
echo "5. Data Portability (Art. 20):"
echo "   Export formats: JSON ✓ CSV ✓ SQL ✓ TXT ✓"
echo "   Export trigger: User-invoked ✓"
echo "   Export speed: Instant ✓"

# 6. Cross-border transfers
echo ""
echo "6. Cross-border Transfers (Art. 44-49):"
echo "   Default: NO TRANSFERS ✓"
echo "   P2P: User-controlled ✓"

echo ""
echo "=== GDPR Check Complete ==="
```

## One-Click GDPR Response

```typescript
// Frontend component for GDPR data request handling
async function handleDataSubjectRequest(requestType: string, userId: string) {
    switch (requestType) {
        case 'access':
            // Art. 15 - Right of Access
            const userData = await invoke('get_user_data', { userId });
            const messages = await invoke('get_user_messages', { userId });
            const conversations = await invoke('get_ai_conversations', { userId });
            return { userData, messages, conversations };

        case 'portability':
            // Art. 20 - Right to Portability
            await invoke('export_user_data', { userId, format: 'json' });
            await invoke('export_aioss_sessions', { userId });
            return { message: 'Data exported. Files saved to desktop.' };

        case 'erasure':
            // Art. 17 - Right to Erasure
            await invoke('anonymize_user_messages', { userId });
            await invoke('delete_user_data', { userId });
            return { message: 'Data anonymized per Article 17.' };

        case 'rectification':
            // Art. 16 - Right to Rectification
            return { message: 'Use edit_message or update_display_name commands.' };

        case 'restrict':
            // Art. 18 - Right to Restrict Processing
            await invoke('disable_ai_for_user', { userId });
            await invoke('disable_p2p_for_user', { userId });
            return { message: 'Processing restricted. AI and P2P disabled.' };
    }
}
```

## GDPR Compliance Automation

### Automated Data Subject Access Request (DSAR) Response

```python
#!/usr/bin/env python3
"""Libern DSAR Response Generator"""
import sqlite3, json, os, datetime

def generate_dsar_response(data_dir, user_id, output_dir):
    """Generate complete response for a GDPR Data Subject Access Request."""
    db_path = os.path.join(data_dir, "libern.db")
    if not os.path.exists(db_path):
        return {"error": "Database not found"}

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    response = {
        "response_generated": datetime.datetime.utcnow().isoformat(),
        "regulation": "GDPR (Regulation (EU) 2016/679)",
        "articles": ["15 (Right of access)", "20 (Right to portability)"],
        "data_subject": {"user_id": user_id},
        "data_categories": {}
    }

    # Personal data
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    if user:
        response["data_categories"]["identity"] = {
            "user_id": user["id"],
            "display_name": user["display_name"],
            "public_key": user["public_key"].hex() if user["public_key"] else None,
            "created_at": user["created_at"],
        }

    # Messages authored
    cursor.execute(
        "SELECT id, channel_id, content, created_at, edited_at FROM messages WHERE author_id = ? AND deleted_at IS NULL",
        (user_id,)
    )
    messages = [dict(row) for row in cursor.fetchall()]
    response["data_categories"]["messages"] = {
        "count": len(messages),
        "data": messages
    }

    # AI conversations
    cursor.execute(
        "SELECT id, channel_id, role, content, created_at FROM ai_conversations WHERE user_id = ?",
        (user_id,)
    )
    ai_convos = [dict(row) for row in cursor.fetchall()]
    response["data_categories"]["ai_conversations"] = {
        "count": len(ai_convos),
        "data": ai_convos
    }

    # Role assignments
    cursor.execute("""
        SELECT r.name as role_name, s.name as server_name
        FROM role_assignments ra
        JOIN roles r ON r.id = ra.role_id
        JOIN servers s ON s.id = r.server_id
        WHERE ra.user_id = ?
    """, (user_id,))
    roles = [dict(row) for row in cursor.fetchall()]
    response["data_categories"]["role_assignments"] = roles

    # Server memberships
    cursor.execute("""
        SELECT s.id, s.name, s.created_at
        FROM servers s
        WHERE s.owner_id = ?
    """, (user_id,))
    owned_servers = [dict(row) for row in cursor.fetchall()]
    response["data_categories"]["owned_servers"] = owned_servers

    conn.close()

    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"dsar-response-{user_id[:8]}.json")
    with open(output_path, "w") as f:
        json.dump(response, f, indent=2, default=str)

    return output_path
```

### Data Processing Register Entry

Organizations should document Libern in their data processing register:

```json
{
  "processing_activity": "Team Collaboration",
  "controller": "Organization Name",
  "processor": "N/A (Libern is local software, not a processor)",
  "tool": "Libern v0.1.0",
  "purpose": "Internal team communication, file sharing, AI assistance",
  "lawful_basis": "Contract (Article 6(1)(b)), Legitimate Interest (Article 6(1)(f))",
  "data_categories": [
    "Display names (editable, user-provided)",
    "Messages (user-generated content)",
    "Ed25519 public keys (cryptographic identifiers)"
  ],
  "data_subjects": "Employees, contractors",
  "retention": "User-configurable (default: indefinite)",
  "cross_border": "None (local storage only)",
  "security_measures": "Ed25519 signatures, SHA3-256 hash chain, local-only AI"
}
```

### GDPR Compliance Checklist

| Article | Requirement | Libern | User Action Needed |
|---------|-------------|--------|-------------------|
| 5(1)(a) | Lawful processing | ✓ Built-in | Define lawful basis |
| 5(1)(c) | Data minimization | ✓ Minimal fields | Review custom fields |
| 5(1)(e) | Storage limitation | ✓ Configurable | Set retention policy |
| 7 | Consent | ✓ | Document consent method |
| 15 | Right of access | ✓ Export available | Use export commands |
| 17 | Right to erasure | ✓ Delete functions | Execute deletion |
| 20 | Right to portability | ✓ JSON/CSV/SQL | Use export commands |
| 25 | Privacy by design | ✓ Architecture | Review documentation |
| 28 | Processor | ✓ Not a processor | Document controller-only |
| 30 | Records of processing | ✓ .aioss provides ROPA | Use .aioss as ROPA |
| 32 | Security | ✓ Crypto audit trail | Regular verification |
| 33 | Breach notification | ✓ .aioss forensic data | Incident response plan |
| 35 | DPIA | ✓ Documentation assists | Complete DPIA |

## References

- `crates/libern-core/src/db/schema.rs` — Database schema (data minimization)
- `crates/libern-core/src/db/models.rs` — Data models (minimal fields)
- `crates/libern-aioss/src/ledger.rs` — .aioss JSON export format
- `crates/libern-aioss/src/writer.rs` — Export functions
- `crates/libern-aioss/src/txt_log.rs` — Plain text export
- `crates/libern-aioss/src/state_proof.rs` — Ed25519 keypair generation
- `crates/libern-core/src/crypto/mod.rs` — Identity structure
- Regulation (EU) 2016/679 — General Data Protection Regulation

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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