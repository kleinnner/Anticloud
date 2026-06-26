# 01s Sovereign — User Controls and Consent

**How Users Control Their Data**

## The Principle

In 01s Sovereign, the user owns their data and has full control over it. The system is designed with the principle that users should be able to see what data is collected, understand why it is collected, control what is collected, export their data, delete their data, and verify that their choices are respected.

## Data Visibility

### Viewing Collected Data

Users can see exactly what data has been collected through the `01s-ledger` CLI:

```bash
# View recent entries
01s-ledger tail
# Sample output:
# [2026-06-19T08:00:00Z] state: boot (session: sess_abc123)
# [2026-06-19T08:05:00Z] state: system_health
# [2026-06-19T08:10:00Z] state: system_health

# View specific entry types
01s-ledger tail --type state
01s-ledger tail --type state | grep config_change

# View full data inventory
01s-ledger export --format json

# View data statistics
01s-ledger status
# Session ID: sess_abc123
# Entries: 1,442
# Types: boot (12), system_health (432), config_change (8), ...
# Total size: 2.4 MB
# Head hash: sha3-256:a1b2c3d4...
```

### Desktop Data Viewer

The `01s-ledger` GUI provides a graphical interface with:

| Feature | Description |
|---------|-------------|
| Dashboard | Data collection overview and status |
| Per-category viewer | Browse data by type |
| Export tools | One-click export in multiple formats |
| Deletion tools | Guided purge process |
| Privacy metrics | Real-time collection metrics |
| Trust Score | Overall system trustworthiness |
| Compliance reports | Framework-specific evidence exports |
| Real-time monitoring | Live audit event feed |

#### Dashboard Layout

```
┌─────────────────────────────────────────────────┐
│ 01s Sovereign Privacy Dashboard                  │
├──────────┬──────────┬──────────┬─────────────────┤
│ Status   │ Data     │ Trust    │ Retention       │
│ ✅ ALL   │ 2.4 MB   │ Score    │ 28 days         │
│ ACTIVE   │ 1,442    │ 0.97     │ remaining       │
│          │ entries  │ /1.00    │                 │
├──────────┴──────────┴──────────┴─────────────────┤
│ Data Categories                                   │
│ ┌─────────────────────────────────────────────┐  │
│ │ System Events: 12 entries                    │  │
│ │ State Snapshots: 432 entries                 │  │
│ │ Shell Commands: 856 entries                  │  │
│ │ Config Changes: 8 entries                    │  │
│ │ User Logins: 134 entries                     │  │
│ └─────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────┤
│ Quick Actions                                      │
│ [Export Data] [Purge Session] [View Full Log]     │
│ [Compliance Report] [Privacy Settings]            │
└─────────────────────────────────────────────────┘
```

## Consent Mechanisms

### Installation Consent

During installation, users explicitly consent to:

| Consent Category | Status | Purpose | Default |
|-----------------|--------|---------|---------|
| System audit logging | Required | OS operation | Enabled |
| Health diagnostics | Recommended | System health monitoring | Enabled |
| Shell command logging | Optional | Enhanced audit trail | Enabled |
| Extended diagnostics | Optional | Advanced troubleshooting | Disabled |
| Network activity logging | Optional | Security monitoring | Enabled |

Each consent choice is recorded in the ledger with cryptographic proof:

```json
{
  "type": "consent",
  "consent_id": "consent_20260614_abc123",
  "scope": "shell_command_logging",
  "level": "optional",
  "status": "granted",
  "granted_at": "2026-06-14T08:00:00Z",
  "method": "installation_wizard",
  "consent_version": "1.2",
  "ledger_entry": {
    "index": 5,
    "hash": "sha3-256:a1b2c3d4..."
  }
}
```

#### Installation Consent Screen

```
┌─────────────────────────────────────────────────────┐
│ Privacy Settings                                     │
│                                                     │
│ [✓] System audit logging (required for operation)   │
│     Purpose: System security and operational audit  │
│                                                     │
│ [✓] Health diagnostics (recommended)                │
│     Purpose: Monitor system health and detect issues │
│     Data: CPU temp, disk SMART, memory usage        │
│                                                     │
│ [✓] Shell command logging (optional)                │
│     Purpose: Enhanced security audit trail          │
│     Data: Commands you type in terminal             │
│     [Learn more] [What this means]                  │
│                                                     │
│ [ ] Extended diagnostics (optional)                  │
│     Purpose: Advanced troubleshooting               │
│     Data: Detailed system telemetry                 │
│                                                     │
│ All data stays local. No data is sent externally.   │
│ You can change these settings anytime.              │
│                                                     │
│            [Accept] [Customize]                     │
└─────────────────────────────────────────────────────┘
```

### Runtime Consent

Applications requesting data access must obtain user consent through:

| Access Type | Consent Prompt | Granularity |
|-------------|---------------|-------------|
| Filesystem access | Per-file and per-directory permissions | Read/Write/Execute |
| Network access | Per-application firewall rules | Allow/Block/Ask |
| Camera | Explicit device request | Per-use/Always/Deny |
| Microphone | Explicit device request | Per-use/Always/Deny |
| Location | Services access request | Per-use/Always/Deny |
| Notifications | Application notification permission | Allow/Block |

#### Application Consent Prompt

```
┌─────────────────────────────────────┐
│ Application "Document Editor" wants │
│ to access:                          │
│                                     │
│ 📁 Documents folder (Read/Write)    │
│                                     │
│ [Deny]  [Allow Once]  [Allow Always]│
└─────────────────────────────────────┘
```

Consent is:
- Per-application (not blanket grants)
- GDPR Article 7 compliant
- Revocable at any time
- Cryptographically recorded in ledger

## Consent Lifecycle

### Consent States

```
NotRequested → Requested → Granted → Active → Withdrawn
                                        ↓
                                    Expired
```

### State Transitions

| Transition | Trigger | Ledger Event |
|------------|---------|--------------|
| NotRequested → Requested | Application request | `consent.requested` |
| Requested → Granted | User acceptance | `consent.granted` |
| Granted → Active | System application | `consent.active` |
| Active → Withdrawn | User revocation | `consent.withdrawn` |
| Active → Expired | Time-based expiry | `consent.expired` |

### Consent Record Example

```json
{
  "event_type": "consent",
  "consent_id": "consent_app_42_fs",
  "timestamp": "2026-06-19T14:30:00Z",
  "scope": "filesystem_access",
  "level": "application",
  "application": "Document Editor",
  "resource": "/home/user/Documents/",
  "access_type": "read_write",
  "status": "granted",
  "method": "portal_api_prompt",
  "consent_version": "1.2",
  "expires_at": "2027-06-19T14:30:00Z"
}
```

## Consent Management Interface

### CLI Commands

```bash
# View all consent records
01s-ledger consent status
# Output:
# Consent ID              Scope            Status    Granted At
# consent_install_001    system_audit     active    2026-06-14
# consent_install_002    health_diag      active    2026-06-14
# consent_install_003    shell_cmd        active    2026-06-14
# consent_app_42_fs      app_fs_access    active    2026-06-19

# Grant consent
01s-ledger consent grant --scope shell_command_logging

# Revoke consent
01s-ledger consent revoke --consent-id consent_install_003

# Export consent records
01s-ledger export --gdpr --consent
```

### GUI Consent Manager

```
┌─────────────────────────────────────────────────┐
│ Privacy Settings > Consent Management            │
├─────────────────────────────────────────────────┤
│ System Consents                                   │
│ ┌─────────────────────────────────────────────┐  │
│ │ System Audit Logging           ✅ Active    │  │
│ │ Health Diagnostics             ✅ Active    │  │
│ │ Shell Command Logging          ✅ Active  [×]│  │
│ │ Extended Diagnostics           ❌ Denied   │  │
│ └─────────────────────────────────────────────┘  │
│                                                  │
│ Application Consents                              │
│ ┌─────────────────────────────────────────────┐  │
│ │ Document Editor - File Access  ✅ Active  [×]│  │
│ │ Web Browser - Camera           ❌ Denied   │  │
│ └─────────────────────────────────────────────┘  │
│                                                  │
│ Consent History (Last 30 Days)                    │
│ ┌─────────────────────────────────────────────┐  │
│ │ 2026-06-19  Web Browser denied camera       │  │
│ │ 2026-06-18  Shell cmd logging revoked       │  │
│ │ 2026-06-15  Document editor granted FS      │  │
│ └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Data Export

### Export Options

```bash
# Export all data
01s-ledger export --format json
01s-ledger export --format csv
01s-ledger export --format aioss

# Export specific time period
01s-ledger export --period 2026-01-01:2026-06-30

# Framework-specific exports
01s-ledger export --gdpr
01s-ledger export --ccpa
01s-ledger export --hipaa

# Encrypted export
01s-ledger export --encrypt --recipient-key <public_key>

# Minimal export (exclude system entries)
01s-ledger export --minimal --format json
```

### Export Formats

| Format | Size | Readability | Schema | Use Case |
|--------|------|-------------|--------|----------|
| JSON | Medium | Human-readable | Full schema | Universal export |
| CSV | Small | Tabular | Flat | Analysis |
| AIOSS | Small | Binary | Native | Verification |
| TXT | Large | Human-readable | Pipe-delimited | Quick review |

## Data Deletion

### Purge Commands

```bash
# Purge specific session
01s-ledger purge <session_id>

# Purge data older than retention
01s-ledger purge --older-than 365

# Purge specific entry types
01s-ledger purge --type cmd

# Purge specific user data
01s-ledger purge --user <user_id>

# Purge all data (factory reset -like)
01s-ledger purge --all

# Test purge (dry run)
01s-ledger purge --test
```

### Deletion Proof

```json
{
  "purge_proof": {
    "session_id": "sess_abc123",
    "purge_timestamp": "2026-06-19T10:00:00Z",
    "method": "anonymization",
    "entries_before": 1442,
    "entries_after": 1420,
    "entries_anonymized": 22,
    "new_head_hash": "sha3-256:9f8e7d6c...",
    "chain_integrity": true,
    "authorized_by": "user_42",
    "cryptographic_signature": "ed25519:abc123..."
  }
}
```

## Privacy Configuration

### Configuration File

```bash
# /etc/01s/ledger.conf

# State snapshot frequency (seconds)
STATE_INTERVAL=300

# Shell command logging (true/false)
LOG_SHELL_COMMANDS=true

# File access logging level (none/basic/full)
LOG_FILE_ACCESS=basic

# Data retention period (days)
RETENTION_DAYS=30

# Audit detail level (minimal/standard/maximum)
AUDIT_LEVEL=standard

# Health diagnostics (true/false)
HEALTH_DIAGNOSTICS=true

# Network logging level (none/metadata/full)
NETWORK_LOG_LEVEL=metadata

# User identification mode (realname/pseudonym/anonymous)
USER_ID_MODE=pseudonym
```

### Configuration via CLI

```bash
# Set configuration values
01s-ledger config set STATE_INTERVAL 600
01s-ledger config set LOG_SHELL_COMMANDS false

# View current configuration
01s-ledger config show

# Reset to defaults
01s-ledger config reset
```

## Preference Management

### Granular Control Options

| Preference | Options | Default | Impact |
|------------|---------|---------|--------|
| State snapshot frequency | 60s, 300s, 600s, 1800s | 300s | Performance history granularity |
| Shell command logging | On/Off | On | Audit trail completeness |
| File access logging | None/Basic/Full | Basic | Security audit depth |
| Network logging | None/Metadata/Full | Metadata | Network security visibility |
| Health diagnostics | On/Off | On | System health monitoring |
| User ID mode | Realname/Pseudonym/Anonymous | Pseudonym | Privacy level in logs |
| Retention period | 0-2555 days | 30 | Data storage duration |

## Verification

Users can verify privacy controls are working:

```bash
# 1. Check no telemetry services exist
systemctl list-units | grep -i telemetry
# Should return no results

# 2. Monitor network for unexpected connections
sudo tcpdump -i any -n
# Should show only user-initiated traffic

# 3. Verify audit integrity
01s-ledger verify
# Should return PASS

# 4. Check data collection
01s-ledger status
# Shows exactly what data exists

# 5. Verify consent settings
01s-ledger consent status
# Shows current consent state
```

## User Rights Summary

| Right | How to Exercise | Command |
|-------|----------------|---------|
| Access data | View or export | `01s-ledger tail`, `01s-ledger export` |
| Correct data | Log correction | `01s-ledger log correction` |
| Delete data | Purge session | `01s-ledger purge` |
| Restrict processing | Disable collection | Config changes |
| Port data | Export in open format | `01s-ledger export --format json` |
| Object to processing | Disable features | Config changes |
| Withdraw consent | Revoke consent | `01s-ledger consent revoke` |

## User Control Verification

### Verification Commands

```bash
# Verify data collection status
01s-ledger config show | grep -E "LOG_|STATE_|HEALTH_|NETWORK_"

# Verify consent status
01s-ledger consent status

# Verify data export
01s-ledger export --format json --output /tmp/my_data.json
wc -l /tmp/my_data.json

# Verify data deletion
01s-ledger purge --test
01s-ledger purge <session_id>
01s-ledger verify-purge-proof

# Verify no hidden data collection
systemctl list-units | grep -i telemetry
ss -tulpn | grep -i collect
```

### Control Verification Dashboard

```
┌─────────────────────────────────────────────────────┐
│ Privacy Control Verification                         │
├─────────────────────────────────────────────────────┤
│                                                        │
│ Collection Controls                                    │
│ ✓ Shell command logging: DISABLED                      │
│ ✓ File access logging: BASIC                           │
│ ✓ Health diagnostics: ENABLED                          │
│ ✓ Network logging: METADATA                            │
│                                                        │
│ Consent Status                                         │
│ ✓ System audit: GRANTED (required)                     │
│ ✓ Health diag: GRANTED (recommended)                   │
│ ✓ Shell logging: REVOKED                               │
│                                                        │
│ Data Lifecycle                                         │
│ ✓ Retention: 30 days                                   │
│ ✓ Current data: 1,442 entries (2.4 MB)                 │
│ ✓ Last purge: 2026-06-18 (122 entries anonymized)      │
│ ✓ Last export: 2026-06-19 (JSON, 1,442 entries)        │
│                                                        │
│ [Refresh] [Export Report] [Verify All]                 │
└─────────────────────────────────────────────────────┘
```

## User Interface Design Principles

### Consent UX Standards

| Principle | Implementation | Example |
|-----------|---------------|---------|
| Clarity | Plain language, no legalese | "This records commands you type" |
| Choice | Equal prominence for accept/decline | Both buttons same size |
| Context | Explain why data is needed | "For security audit purposes" |
| Control | Easy to change later | Settings panel accessible |
| Confirmation | Show what was chosen | Summary before finalizing |
| Withdrawal | As easy as granting | One-click revocation |

### Dark Patterns Avoided

| Dark Pattern | Definition | How 01s Avoids |
|-------------|------------|----------------|
| Hidden consent | Burying consent in TOS | Separate, clear prompt |
| Pre-checked boxes | Default opt-in | All optional unchecked |
| Confirmshaming | Guilt-tripping users | Neutral language |
| False hierarchy | Making decline harder | Equal button prominence |
| Nagging | Repeated requests | Once, with "don't ask again" |
| Roach motel | Easy in, hard to leave | One-click revocation |

## Accessibility in Privacy Controls

### Keyboard Navigation

All privacy controls are fully keyboard-navigable:
- Tab through options
- Enter to select
- Escape to dismiss
- Arrow keys for radio buttons
- Screen reader compatible labels

### Screen Reader Support

```html
<!-- Consent prompt with ARIA labels -->
<div role="dialog" aria-labelledby="consent-title" aria-describedby="consent-desc">
  <h2 id="consent-title">Shell Command Logging</h2>
  <p id="consent-desc">This records terminal commands for security audit.</p>
  <button aria-label="Accept shell command logging">Enable</button>
  <button aria-label="Decline shell command logging">Skip</button>
</div>
```

### High Contrast Mode

All consent prompts support:
- High contrast color schemes
- Large font options (up to 200%)
- Configurable color themes
- Reduced motion options

## Conclusion

01s Sovereign puts users in control of their data. Every data collection point is visible, configurable, and auditable. Users can see exactly what is collected, export or delete it at any time, and verify that their privacy choices are respected — all through cryptographic guarantees rather than policy promises.

---

Lois-Kleinner and 0-1.gg 2026 Copyright

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ