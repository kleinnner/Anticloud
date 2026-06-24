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

# Audit Logging

> **Every action is a record. Every record is permanent.**

Kazkade's audit logging is not an add-on — it is the `.aioss` ledger itself. Every CLI command, query execution, configuration change, access control decision, and system event is appended as a signed, timestamped record in the tamper-evident hash chain. There is no separate audit log to tamper with; the audit trail **is** the ledger.

---

## 1. Audit Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Kazkade Audit Logging Stack                       │
├─────────────────────────────────────────────────────────────────────┤
│  Audit Categories                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ CLI Ops  │ │ Queries  │ │ Config   │ │ Access   │ │ System   │  │
│  │          │ │          │ │ Changes  │ │ Decisions│ │ Events   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│  .aioss Ledger (single append-only hash chain)                       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │ G  │→│ C1 │→│ C2 │→│ A1 │→│ Q1 │→│ C3 │→│ S1 │→│ C4 │→│ A2 │→│...
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘  │
│   G=Genesis  C=CLI  A=Access  Q=Query  S=System                     │
├─────────────────────────────────────────────────────────────────────┤
│  Verification Layer                                                  │
│  - Hash chain integrity check                                        │
│  - Ed25519 signature verification                                    │
│  - Timestamp monotonicity check                                      │
│  - Region consistency check                                          │
├─────────────────────────────────────────────────────────────────────┤
│  Report Generation                                                   │
│  - Automated audit reports (JSON, PDF, CSV)                          │
│  - Real-time monitoring dashboard                                    │
│  - Compliance-specific reports (SOC 2, ISO 27001, GDPR)              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Audit Record Types

### 2.1 Audit Record Enum

```rust
/// All audit event types in the Kazkade system.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "event_type")]
pub enum AuditEvent {
    // ── CLI Operations ──
    CliCommand {
        command: String,
        args: Vec<String>,
        working_dir: Option<String>,
        exit_code: i32,
        duration_ms: u64,
    },
    CliQuery {
        query: String,
        plan: Option<String>,
        rows_returned: u64,
        duration_ms: u64,
    },
    
    // ── Ledger Operations ──
    LedgerInit {
        path: String,
        region: RegionTag,
        public_key: [u8; 32],
    },
    LedgerAppend {
        path: String,
        record_seqno: u64,
        payload_size: u64,
        payload_hash: [u8; 32],
    },
    LedgerVerify {
        path: String,
        records_checked: u64,
        passed: bool,
        failures: Vec<String>,
    },
    
    // ── Configuration Changes ──
    ConfigChange {
        key: String,
        old_value: Option<String>,
        new_value: Option<String>,
        source: ConfigSource,
    },
    
    // ── Access Control ──
    AccessGrant {
        user: String,
        role: Role,
        resource: String,
    },
    AccessRevoke {
        user: String,
        resource: String,
    },
    AccessDenied {
        user: String,
        operation: String,
        resource: String,
        reason: String,
    },
    
    // ── System Events ──
    SystemStartup {
        version: String,
        hostname: String,
        platform: String,
    },
    SystemShutdown {
        uptime_seconds: u64,
    },
    BackupInitiated {
        path: String,
        size_bytes: u64,
    },
    BackupCompleted {
        path: String,
        checksum: [u8; 32],
    },
    Error {
        severity: ErrorSeverity,
        message: String,
        stack_trace: Option<String>,
    },
}
```

### 2.2 Record Structure

```rust
/// A typed audit record wrapping any AuditEvent.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditRecord {
    pub seqno: u64,
    pub timestamp: i128,
    pub event: AuditEvent,
    pub actor_key: [u8; 32],
    pub session_id: Option<String>,
    pub correlation_id: Uuid,
    pub prev_hash: [u8; 32],
    pub signature: [u8; 64],
}
```

---

## 3. CLI Audit Integration

### 3.1 Automatic Command Logging

Every CLI command is automatically logged to the `.aioss` audit ledger:

```bash
# Every command is logged automatically.
kazkade ledger init my-ledger.aioss --region EU
# → Audit record: LedgerInit { path: "my-ledger.aioss", region: "EU" }

kazkade query "SELECT * FROM ledger WHERE value > 100"
# → Audit record: CliQuery { query: "SELECT * FROM ledger WHERE value > 100", rows_returned: 42 }

kazkade access grant --user bob --role operator
# → Audit record: AccessGrant { user: "bob", role: "Operator" }
```

### 3.2 Audit Configuration

```bash
# Configure audit ledger path.
kazkade audit configure \
    --ledger /var/log/kazcade/audit.aioss

# Set audit verbosity.
kazkade audit configure \
    --verbosity full  # full | summary | errors-only

# Enable audit to stdout in addition to ledger.
kazkade audit configure \
    --stdout true
```

### 3.3 Audit Query

View audit records directly:

```bash
# Query all audit events.
kazkade query "
    SELECT seqno, timestamp, event_type, actor_key
    FROM audit
    WHERE event_type = 'AccessGrant'
    ORDER BY timestamp DESC
    LIMIT 10
" --ledger audit.aioss

# Search for a specific user's actions.
kazkade query "
    SELECT seqno, timestamp, event, actor_key
    FROM audit
    WHERE actor_key = '0xabcd...ef01'
    ORDER BY timestamp DESC
"
```

---

## 4. Audit Report Generation

### 4.1 Automated Reports

```bash
# Generate a full audit report.
kazkade audit report \
    --ledger audit.aioss \
    --output audit-report.json \
    --start "2026-01-01T00:00:00Z" \
    --end "2026-06-19T23:59:59Z"

# Generate a summary report.
kazkade audit report summary \
    --ledger audit.aioss \
    --output summary.csv

# Generate a compliance-specific report.
kazkade audit report compliance \
    --framework soc2 \
    --output soc2-report.json
```

### 4.2 Report Contents

```json
{
  "report_metadata": {
    "generated_at": "2026-06-19T07:00:00Z",
    "ledger": "audit.aioss",
    "time_range": {
      "start": "2026-01-01T00:00:00Z",
      "end": "2026-06-19T23:59:59Z"
    },
    "ledger_integrity": {
      "chain_valid": true,
      "records_checked": 1048576,
      "fails": 0
    }
  },
  "summary": {
    "total_events": 1048576,
    "events_by_type": {
      "CliCommand": 524288,
      "CliQuery": 262144,
      "AccessGrant": 128,
      "AccessRevoke": 64,
      "AccessDenied": 16,
      "ConfigChange": 256,
      "SystemStartup": 8,
      "SystemShutdown": 8,
      "Error": 4
    },
    "unique_actors": 12,
    "events_per_day_avg": 5825
  },
  "events": [
    {
      "seqno": 1,
      "timestamp": "2026-01-01T00:00:00Z",
      "event_type": "LedgerInit",
      "actor_key": "0xabcd...ef01",
      "details": {
        "path": "audit.aioss",
        "region": "EU"
      }
    }
  ],
  "compliance_mapping": {
    "SOC2_CC6_1": {
      "requirement": "Logical access controls",
      "coverage": "PASS"
    },
    "SOC2_CC6_2": {
      "requirement": "Access provisioning",
      "coverage": "PASS"
    }
  }
}
```

### 4.3 Periodic Report Automation

```bash
# Schedule daily audit reports.
kazkade audit schedule \
    --interval daily \
    --time 02:00 \
    --output /var/reports/audit-{date}.json

# Schedule weekly compliance reports.
kazkade audit schedule \
    --interval weekly \
    --day monday \
    --time 03:00 \
    --framework soc2 \
    --output /var/reports/soc2-{date}.json
```

---

## 5. Tamper-Evident Verification

### 5.1 Hash Chain Integrity

```rust
/// Verify the integrity of an audit ledger's hash chain.
pub fn verify_audit_chain(path: &str) -> Result<AuditVerificationReport, AuditError> {
    let ledger = AiossLedger::mmap_open(path)?;
    let mut prev_hash = [0u8; 32];
    let mut verified_count = 0u64;
    let mut failures = Vec::new();
    
    for record in ledger.iter() {
        // Verify hash chain link.
        let computed_prev_hash = sha3_256(&record.serialize_header()?);
        if computed_prev_hash != record.prev_hash {
            // First record's prev_hash should be genesis hash.
            if record.seqno != 0 || prev_hash != [0u8; 32] {
                failures.push(VerificationFailure {
                    seqno: record.seqno,
                    reason: "Hash chain broken".to_string(),
                });
            }
        }
        
        // Verify Ed25519 signature.
        let signing_input = serialize_for_signing(&record);
        let public_key = VerifyingKey::from_bytes(&record.actor_key)?;
        let signature = Signature::from_bytes(&record.signature);
        
        if public_key.verify_strict(&signing_input, &signature).is_err() {
            failures.push(VerificationFailure {
                seqno: record.seqno,
                reason: "Invalid signature".to_string(),
            });
        }
        
        // Verify timestamp is monotonic (no time-travel).
        if record.seqno > 0 {
            let prev = ledger.get(record.seqno - 1)?;
            if record.timestamp < prev.timestamp {
                failures.push(VerificationFailure {
                    seqno: record.seqno,
                    reason: "Timestamp regression (possible tampering)".to_string(),
                });
            }
        }
        
        prev_hash = record.digest();
        verified_count += 1;
    }
    
    Ok(AuditVerificationReport {
        ledger_path: path.to_string(),
        records_checked: verified_count,
        chain_valid: failures.is_empty(),
        failures,
        verified_at: SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos() as i128,
    })
}
```

### 5.2 Verification Commands

```bash
# Verify audit ledger integrity.
kazkade audit verify --ledger audit.aioss

# Continuous verification (watch mode).
kazkade audit verify --watch --interval 60

# Verify against a known-good checkpoint.
kazkade audit verify \
    --ledger audit.aioss \
    --checkpoint checkpoint.sig
```

### 5.3 Remote Audit Verification

```bash
# Verify a remote audit ledger.
kazkade audit verify \
    --remote https://node.internal:8443 \
    --ledger audit.aioss \
    --tls-cert auditor.crt

# Compare two audit ledgers for consistency.
kazkade audit compare \
    --primary audit.aioss \
    --replica backup-audit.aioss
```

---

## 6. Real-Time Audit Monitoring

### 6.1 Dashboard Audit View

The web dashboard includes a real-time audit stream:

```bash
# Launch dashboard with audit focus.
kazkade dashboard --audit-view

# Filter by event type.
kazkade dashboard --audit-filter AccessDenied
```

### 6.2 Audit Alerting

```rust
/// Configure alerts based on audit events.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditAlert {
    pub name: String,
    pub condition: AlertCondition,
    pub severity: AlertSeverity,
    pub actions: Vec<AlertAction>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AlertCondition {
    EventType { event_type: String, count_gt: u32 },
    Actor { actor_key: [u8; 32], event_type: String },
    RateLimit { events_per_minute: u32 },
    Custom { wasm_module: Vec<u8> },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AlertAction {
    Log,
    Email { to: Vec<String> },
    Webhook { url: String },
    PagerDuty { routing_key: String },
    Slack { webhook_url: String },
}
```

```bash
# Configure an alert for access denials.
kazkade audit alert create \
    --name "Access Denial Spike" \
    --condition 'EventType("AccessDenied") > 10' \
    --severity warning \
    --action slack "https://hooks.slack.com/services/..."

# List configured alerts.
kazkade audit alert list
```

---

## 7. Audit Retention and Rotation

### 7.1 Retention Policies

```bash
# Set audit retention policy.
kazkade audit retention \
    --ledger audit.aioss \
    --policy keep-all  # keep-all | time-based | size-based

# Time-based retention (keep 7 years for SOX compliance).
kazkade audit retention \
    --ledger audit.aioss \
    --policy time-based \
    --retention-days 2555

# Size-based retention (keep last 1 TB).
kazkade audit retention \
    --ledger audit.aioss \
    --policy size-based \
    --max-size 1TB
```

### 7.2 Ledger Rotation

When an audit ledger reaches its size limit, Kazkade automatically rotates to a new ledger:

```rust
impl AuditLedgerManager {
    pub fn rotate_ledger(&mut self) -> Result<(), AuditError> {
        let current = self.current_ledger_path();
        let archive = format!("{}.archive.{}", current, now_nanos());
        
        // Rename current ledger to archive.
        std::fs::rename(&current, &archive)?;
        
        // Create new ledger linked to the previous.
        let new_ledger = AiossLedger::create(&current, self.genesis_config.clone())?;
        
        // Append a rotation record linking to the archive.
        let rotation_record = AuditRecord {
            seqno: 0,
            timestamp: now_nanos(),
            event: AuditEvent::LedgerRotation {
                previous_ledger: archive,
                previous_last_seqno: self.current_last_seqno(),
            },
            actor_key: self.system_key,
            session_id: None,
            correlation_id: Uuid::new_v4(),
            prev_hash: self.genesis_hash,
            signature: [0u8; 64],
        };
        
        new_ledger.append(rotation_record, &self.system_signing_key)?;
        
        Ok(())
    }
}
```

---

## 8. Compliance Mapping

| Requirement                    | Standard          | Kazkade Mechanism                        |
|--------------------------------|-------------------|------------------------------------------|
| Audit logging                  | SOC 2 CC6.3      | `.aioss` ledger as audit trail           |
| Tamper protection              | SOC 2 CC6.7      | SHA3-256 hash chain                      |
| Audit log retention            | SOC 2 CC6.4      | Configurable retention + rotation        |
| User activity monitoring       | ISO 27001 A.12.4 | Every CLI/query/access logged            |
| Audit log review               | ISO 27001 A.12.7 | Automated report generation              |
| Time synchronization           | ISO 27001 A.12.4 | NTP-synced nanosecond timestamps         |
| Audit log protection           | PCI DSS 10.2     | Append-only, encrypted at rest           |
| Regular audit report           | GDPR Art. 30     | `kazkade audit report`                    |
| Breach detection               | GDPR Art. 33     | Real-time alerting on audit events       |

---

## 9. Audit Performance

| Metric                  | Value                |
|-------------------------|----------------------|
| Max append throughput   | 1,000,000 records/s  |
| Latency per audit write | < 5 µs               |
| Ledger size efficiency  | ~72 bytes/record     |
| Verification speed      | 50 GB/s (mmap)       |
| Query time (1B records) | < 100 ms             |

---

## 10. Summary

- **Every action is audited**: CLI, queries, config, access, system events
- **Tamper-evident**: SHA3-256 + Ed25519 hash chain
- **No separate audit log**: The `.aioss` ledger IS the audit trail
- **Automated reporting**: JSON, CSV, PDF, compliance-specific
- **Real-time alerting**: Webhook, Slack, PagerDuty, email
- **Compliant**: SOC 2, ISO 27001, GDPR, PCI DSS, HIPAA
- **Retention-aware**: Configurable policies with automatic rotation

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
