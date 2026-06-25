# Use the AI-OSS API in Your App

This guide shows how to integrate with the 01s-ledger audit system from your own applications.

## Overview

The `01s-ledger` binary provides a command-line interface for writing to and reading from the cryptographic audit trail. Any application can integrate by spawning `01s-ledger` processes or by directly writing to the `.aioss` file format.

## Method 1: Command-Line Integration

### Writing to the Ledger

From any programming language, spawn `01s-ledger log`:

#### Bash

```bash
# Log a simple event
01s-ledger log app_event action=user-login user=alice status=success

# Log with multiple attributes
01s-ledger log payment_processed \
    transaction_id=txn_abc123 \
    amount=99.99 \
    currency=USD \
    merchant=01s-store \
    status=completed
```

#### Python

```python
import subprocess
import json

def log_to_ledger(event_type: str, **kwargs):
    """Log an event to the 01s audit ledger."""
    args = ['01s-ledger', 'log', event_type]
    for key, value in kwargs.items():
        args.append(f"{key}={value}")
    
    result = subprocess.run(
        args,
        capture_output=True,
        text=True,
        timeout=5
    )
    
    if result.returncode == 0:
        return result.stdout.strip()  # Returns the entry hash
    else:
        raise RuntimeError(f"Ledger error: {result.stderr}")

# Usage
hash = log_to_ledger(
    "api_request",
    endpoint="/users",
    method="GET",
    status_code="200",
    duration_ms="45"
)
print(f"Logged entry hash: {hash}")
```

#### Node.js

```javascript
const { execSync } = require('child_process');

function logToLedger(eventType, attributes = {}) {
    const args = ['01s-ledger', 'log', eventType];
    for (const [key, value] of Object.entries(attributes)) {
        args.push(`${key}=${value}`);
    }
    
    try {
        const output = execSync(args.join(' '), { 
            encoding: 'utf-8',
            timeout: 5000
        });
        return output.trim();
    } catch (error) {
        console.error('Ledger error:', error.stderr?.toString());
        throw error;
    }
}

// Usage
const hash = logToLedger('user_action', {
    action: 'document_edit',
    document_id: 'doc_456',
    user: 'bob',
    timestamp: Date.now().toString()
});
console.log(`Logged: ${hash}`);
```

#### Rust

```rust
use std::process::Command;

fn log_to_ledger(event_type: &str, attrs: &[(&str, &str)]) -> Result<String, String> {
    let mut cmd = Command::new("01s-ledger");
    cmd.arg("log").arg(event_type);
    for (k, v) in attrs {
        cmd.arg(format!("{k}={v}"));
    }
    
    let output = cmd.output().map_err(|e| e.to_string())?;
    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

fn main() {
    let hash = log_to_ledger("build_event", &[
        ("component", "parser"),
        ("status", "success"),
        ("duration_ms", "230"),
    ]).expect("Failed to log");
    println!("Logged entry: {hash}");
}
```

### Reading from the Ledger

```python
import subprocess
import json

def get_ledger_status():
    """Get ledger status."""
    result = subprocess.run(
        ['01s-ledger', 'status'],
        capture_output=True, text=True
    )
    return result.stdout

def get_recent_entries(n=10):
    """Get recent ledger entries."""
    result = subprocess.run(
        ['01s-ledger', 'tail', str(n)],
        capture_output=True, text=True
    )
    return result.stdout

def export_ledger(session_id=None):
    """Export ledger as JSON."""
    args = ['01s-ledger', 'export']
    if session_id:
        args.append(session_id)
    result = subprocess.run(args, capture_output=True, text=True)
    return result.stdout

def verify_ledger():
    """Verify ledger integrity."""
    result = subprocess.run(
        ['01s-ledger', 'verify'],
        capture_output=True, text=True
    )
    return result.returncode == 0, result.stdout

# Usage
print(get_ledger_status())
print(get_recent_entries(5))
is_valid, message = verify_ledger()
print(f"Ledger valid: {is_valid}")
```

## Method 2: Direct File Access

### Reading the JSON Format

```python
import json
import hashlib

class AiosLedger:
    """Read and verify .aioss files."""
    
    def __init__(self, path):
        with open(path) as f:
            self.data = json.load(f)
    
    @property
    def entries(self):
        return self.data.get('entries', [])
    
    @property
    def entry_count(self):
        return self.data.get('entry_count', 0)
    
    @property
    def head_hash(self):
        return self.data.get('head_hash', '')
    
    def verify_entry(self, entry):
        """Verify a single entry's hash."""
        # Reconstruct canonical JSON (sorted keys, no hash field)
        canonical = {
            k: v for k, v in sorted(entry.items())
            if k != 'hash'
        }
        canonical_json = json.dumps(
            canonical, separators=(',', ':'), sort_keys=True
        )
        computed = hashlib.sha3_256(canonical_json.encode()).hexdigest()
        return computed == entry.get('hash', '')
    
    def verify_chain(self):
        """Verify full hash chain."""
        prev_hash = '0' * 64
        for i, entry in enumerate(self.entries):
            if entry.get('parent_hash', '') != prev_hash:
                return False, f"Chain break at entry {i}"
            if not self.verify_entry(entry):
                return False, f"Hash mismatch at entry {i}"
            prev_hash = entry['hash']
        return True, "Chain intact"

# Usage
ledger = AiosLedger('/home/alice/ledger/2026-06-19.aioss')
print(f"Entries: {ledger.entry_count}")
print(f"Head: {ledger.head_hash[:16]}...")
is_valid, msg = ledger.verify_chain()
print(f"Verification: {msg}")
```

### Reading the Binary Format

```python
import struct

def read_binary_aioss(path):
    """Read binary .aioss format."""
    with open(path, 'rb') as f:
        # Read magic
        magic = f.read(5)
        if magic != b'AIOSS':
            raise ValueError("Not a binary AIOSS file")
        
        # Read header
        version = struct.unpack('<H', f.read(2))[0]
        checksum = struct.unpack('<H', f.read(2))[0]
        session_id = f.read(36).split(b'\x00')[0].decode()
        created_at = f.read(32).split(b'\x00')[0].decode()
        status = f.read(1)[0]
        session_type = f.read(1)[0]
        entry_count = struct.unpack('<I', f.read(4))[0]
        genesis_hash = f.read(32).hex()
        head_hash = f.read(32).hex()
        reserved = f.read(8)
        
        # Read entries
        entries = []
        for i in range(entry_count):
            index = struct.unpack('<I', f.read(4))[0]
            timestamp = struct.unpack('<Q', f.read(8))[0]
            entry_type = f.read(20).split(b'\x00')[0].decode()
            actor = f.read(16).split(b'\x00')[0].decode()
            actor_label = f.read(24).split(b'\x00')[0].decode()
            content_hash = f.read(32).hex()
            parent_hash = f.read(32).hex()
            reserved = f.read(120)
            
            entries.append({
                'index': index,
                'timestamp': timestamp,
                'type': entry_type,
                'actor': actor,
                'actor_label': actor_label,
                'content_hash': content_hash,
                'parent_hash': parent_hash,
            })
        
        return {
            'session_id': session_id,
            'created_at': created_at,
            'entry_count': entry_count,
            'genesis_hash': genesis_hash,
            'head_hash': head_hash,
            'entries': entries,
        }
```

## Method 3: Health Diagnostics API

### Writing Health Checks

```python
import subprocess
import json

class HealthLedger:
    """API for the 01s health diagnostics ledger."""
    
    def log_health(self, date, test, category, status, duration_ms, detail):
        subprocess.run([
            '01s-ledger', 'health', 'log',
            date, test, category, status, str(duration_ms), detail
        ])
    
    def verify(self, date):
        result = subprocess.run(
            ['01s-ledger', 'health', 'verify', date],
            capture_output=True, text=True
        )
        return result.returncode == 0
    
    def manifest(self, date):
        result = subprocess.run(
            ['01s-ledger', 'health', 'manifest', date],
            capture_output=True, text=True
        )
        return result.stdout.strip()

# Usage
health = HealthLedger()
health.log_health("2026-06-19", "api_latency", "performance", 
                   "pass", 120, "GET /users: 120ms")
```

## Method 4: State Proof Verification

```python
class StateProof:
    """Verify ledger state proofs."""
    
    def __init__(self, head_hash, timestamp, entry_count, session_id, signature, public_key):
        self.head_hash = head_hash
        self.timestamp = timestamp
        self.entry_count = entry_count
        self.session_id = session_id
        self.signature = signature
        self.public_key = public_key
    
    def verify(self, key_hex):
        """Verify the state proof signature."""
        import hmac
        message = f"{self.session_id}|{self.timestamp}|{self.entry_count}|{self.head_hash}"
        key = bytes.fromhex(key_hex)
        
        # HMAC-SHA3-256
        sig = hmac.new(key, message.encode(), 'sha3_256').hexdigest()
        return sig == self.signature

# Usage
proof = StateProof(
    head_hash="abc123...",
    timestamp="2026-06-19T14:30:00Z",
    entry_count=42,
    session_id="2026-06-19",
    signature="def456...",
    public_key="0123456789abcdef..."
)

result = proof.verify("0123456789abcdef0123456789abcdef")
print(f"Proof valid: {result}")
```
## Expected Outputs

When following this guide, you should see:

```bash
# Typical successful output
[PASS] Step 1 completed
[PASS] Step 2 completed
[PASS] All steps completed successfully
```

## Common Pitfalls

1. **Incorrect permissions**: Many operations require `sudo`
2. **Missing dependencies**: Ensure all prerequisites are installed
3. **Version mismatches**: Check version numbers match expected values
4. **Path issues**: Use absolute paths or verify working directory
5. **Concurrent access**: Don't run multiple ledger operations simultaneously

## Verification Steps

After completing this guide:

```bash
# Verify each component
01s-ledger toolchain
01s-ledger verify
echo "let x = 42" | 01s-lexer | 01s-parser | 01s-codegen > /dev/null && echo "[OK] Pipeline works"
```

## Rollback Procedure

```bash
# Undo changes
cd sovereign-os
git checkout -- <changed-files>
# Or restore from backup
cp backup/* original/
```

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|--------------|----------|
| Command not found | Binary not in PATH | Check /usr/bin/ |
| Permission denied | Not running as root | Prepend sudo |
| File exists | Already initialized | Use different path |
| Connection refused | Service not running | systemctl start |
| Hash mismatch | File corrupted | Restore from backup |
## Expected Outputs

When following this guide, you should see:

```bash
# Typical successful output
[PASS] Step 1 completed
[PASS] Step 2 completed
[PASS] All steps completed successfully
```

## Common Pitfalls

1. **Incorrect permissions**: Many operations require `sudo`
2. **Missing dependencies**: Ensure all prerequisites are installed
3. **Version mismatches**: Check version numbers match expected values
4. **Path issues**: Use absolute paths or verify working directory
5. **Concurrent access**: Don't run multiple ledger operations simultaneously

## Verification Steps

After completing this guide:

```bash
# Verify each component
01s-ledger toolchain
01s-ledger verify
echo "let x = 42" | 01s-lexer | 01s-parser | 01s-codegen > /dev/null && echo "[OK] Pipeline works"
```

## Rollback Procedure

```bash
# Undo changes
cd sovereign-os
git checkout -- <changed-files>
# Or restore from backup
cp backup/* original/
```

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|--------------|----------|
| Command not found | Binary not in PATH | Check /usr/bin/ |
| Permission denied | Not running as root | Prepend sudo |
| File exists | Already initialized | Use different path |
| Connection refused | Service not running | systemctl start |
| Hash mismatch | File corrupted | Restore from backup |


---

Lois-Kleinner and 0-1.gg 2026 Copyright
## Additional Section 1

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 1.1

Expanded detail for this area with examples and edge cases.

### Subsection 1.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 1 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 2

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 2.1

Expanded detail for this area with examples and edge cases.

### Subsection 2.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 2 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 3

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 3.1

Expanded detail for this area with examples and edge cases.

### Subsection 3.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 3 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 4

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 4.1

Expanded detail for this area with examples and edge cases.

### Subsection 4.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 4 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 5

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 5.1

Expanded detail for this area with examples and edge cases.

### Subsection 5.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 5 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 6

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 6.1

Expanded detail for this area with examples and edge cases.

### Subsection 6.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 6 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 7

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 7.1

Expanded detail for this area with examples and edge cases.

### Subsection 7.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 7 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 8

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 8.1

Expanded detail for this area with examples and edge cases.

### Subsection 8.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 8 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 9

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 9.1

Expanded detail for this area with examples and edge cases.

### Subsection 9.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 9 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 10

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 10.1

Expanded detail for this area with examples and edge cases.

### Subsection 10.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 10 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 11

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 11.1

Expanded detail for this area with examples and edge cases.

### Subsection 11.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 11 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 12

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 12.1

Expanded detail for this area with examples and edge cases.

### Subsection 12.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 12 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 13

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 13.1

Expanded detail for this area with examples and edge cases.

### Subsection 13.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 13 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 14

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 14.1

Expanded detail for this area with examples and edge cases.

### Subsection 14.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 14 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 15

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 15.1

Expanded detail for this area with examples and edge cases.

### Subsection 15.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 15 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 16

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 16.1

Expanded detail for this area with examples and edge cases.

### Subsection 16.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 16 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 17

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 17.1

Expanded detail for this area with examples and edge cases.

### Subsection 17.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 17 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 18

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 18.1

Expanded detail for this area with examples and edge cases.

### Subsection 18.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 18 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 19

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 19.1

Expanded detail for this area with examples and edge cases.

### Subsection 19.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 19 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |


## Additional Section 20

Detailed reference content for this section covering additional aspects of the guide.

### Subsection 20.1

Expanded detail for this area with examples and edge cases.

### Subsection 20.2

More detailed guidance and expected behavior.

| Item | Description | Example |
|------|-------------|--------|
| Operation 20 | Description of operation | `command --flag` |
| Expected | Expected outcome | Success message |
| Verification | How to verify | `verify-command` |

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
