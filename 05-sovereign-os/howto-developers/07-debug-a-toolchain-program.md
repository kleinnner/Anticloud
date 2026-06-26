# Debug a Toolchain Program

This guide walks through step-through debugging for the lexer, parser, and codegen components of the 01s toolchain.

## Prerequisites

- Rust toolchain (rustc, rust-gdb, or lldb)
- The 01s toolchain source code
- Basic understanding of the compilation pipeline

## Debugging the Lexer

### Step 1: Build with Debug Symbols

```bash
cd day-2/toolchain/lexer

# Build with debug info
rustc -g src/main.rs -o lexer-debug

# Or with optimizations + debug symbols
rustc -g -O src/main.rs -o lexer-debug
```

### Step 2: Run with GDB

```bash
# Start GDB
rust-gdb ./lexer-debug

# Set breakpoint at tokenize
(gdb) break lexer::Lexer::tokenize

# Run with input
(gdb) run < <(echo "let x = 42")

# Step through execution
(gdb) step
(gdb) print self.chars
(gdb) print self.pos

# Continue to next breakpoint
(gdb) continue

# Inspect tokens after tokenize returns
(gdb) finish
(gdb) print tokens

# Debug with core dump
(gdb) run < <(echo "invalid @ input")
(gdb) bt
```

### Step 3: Debug with LLDB

```bash
# Start LLDB
lldb-19 ./lexer-debug

# Set breakpoint
(lldb) breakpoint set --name tokenize

# Run with input
(lldb) run < <(echo "fn test() { return 42 }")

# Step
(lldb) step
(lldb) frame variable
(lldb) continue
```

### Step 4: Debug the Pipeline

```bash
# Debug full pipeline with a test case
echo "let x = 42 * 5" > /tmp/test-input.txt

# Step through each stage
gdb --args bash -c 'cat /tmp/test-input.txt | 01s-lexer | 01s-parser | 01s-codegen > /dev/null'

# Debug individual stages in isolation
echo "let x = 42 * 5" | 01s-lexer > /tmp/tokens.txt
cat /tmp/tokens.txt | 01s-parser > /tmp/ast.txt
cat /tmp/ast.txt | 01s-codegen > /tmp/output.bin
```

## Debugging the Parser

### Step 1: Build Parser with Debug

```bash
cd day-2/toolchain/parser
rustc -g src/main.rs -o parser-debug
```

### Step 2: Track Parse State

```rust
// Add debug logging to parser
fn parse_program(&mut self) -> Program {
    eprintln!("Parsing program...");
    let mut stmts = Vec::new();
    while self.peek().is_some() && self.peek().map(|t| t.ttype.as_str()) != Some("EOF") {
        if let Some(stmt) = self.parse_stmt() {
            eprintln!("Parsed statement: {:?}", stmt);
            stmts.push(stmt);
        } else {
            eprintln!("Failed to parse statement at position {}", self.pos);
            self.advance();
        }
    }
    Program { statements: stmts }
}
```

### Step 3: Trace Pipeline with strace

```bash
# Trace system calls
strace -o /tmp/lexer.strace \
    bash -c 'echo "let x = 42" | 01s-lexer | 01s-parser > /dev/null'

# Trace only read/write syscalls
strace -e trace=read,write \
    echo "let x = 42" | 01s-lexer | 01s-parser > /dev/null

# Trace with timing
strace -T -e trace=read,write \
    echo "let x = 42 * 1000" | 01s-lexer | 01s-parser > /dev/null
```

## Debugging the Codegen

### Step 1: Build Codegen with Debug

```bash
cd day-2/toolchain/codegen
rustc -g src/main.rs -o codegen-debug
```

### Step 2: Inspect Generated Machine Code

```bash
# Generate binary
echo "let x = 42" | 01s-lexer | 01s-parser | 01s-codegen > /tmp/prog.bin

# Disassemble
objdump -D -b binary -m i386:x86-64 /tmp/prog.bin

# Or hex dump
xxd /tmp/prog.bin

# Using 01s-binary
01s-binary -l /tmp/prog.bin
01s-binary -d < /tmp/prog.bin
```

### Step 3: Add Instruction Tracing

```rust
// Add tracing to Emitter
impl Emitter {
    fn emit(&mut self, bytes: &[u8]) {
        eprintln!("  emit {:02X?} ({} bytes)", bytes, bytes.len());
        self.code.extend_from_slice(bytes);
    }
    
    fn emit_label(&mut self, id: usize) {
        eprintln!("  label L{} at offset {}", id, self.code.len());
        self.labels.push((id, self.code.len()));
    }
    
    fn finalize(&mut self) {
        eprintln!("Finalizing labels...");
        for (patch_offset, label_id, is_relative) in &self.patches {
            let target = self.labels.iter()
                .find(|(id, _)| *id == *label_id)
                .map(|(_, off)| *off)
                .unwrap_or(0);
            eprintln!("  patch at offset {} -> L{} (offset {})",
                      patch_offset, label_id, target);
            // ...
        }
    }
}
```

## Debugging the Ledger

### Step 1: Enable Verbose Logging

```bash
# Run ledger with verbose output
01s-ledger init 2>&1
01s-ledger log test_event status=ok 2>&1
01s-ledger verify 2>&1
```

### Step 2: Inspect Hash Chain

```bash
# Export and analyze
01s-ledger export > /tmp/ledger.json

# Check hash chain manually
python3 << 'EOF'
import json, hashlib

with open('/tmp/ledger.json') as f:
    ledger = json.load(f)

for i, entry in enumerate(ledger):
    # Recompute hash
    canonical = {
        k: v for k, v in sorted(entry.items())
        if k != 'hash'
    }
    cjson = json.dumps(canonical, separators=(',', ':'), sort_keys=True)
    computed = hashlib.sha3_256(cjson.encode()).hexdigest()
    
    match = "OK" if computed == entry.get('hash', '') else "MISMATCH"
    print(f"Entry {i}: {match}")
    print(f"  Stored:   {entry.get('hash', '')[:16]}...")
    print(f"  Computed: {computed[:16]}...")
EOF
```

### Step 3: Test Hash Chain Break Detection

```bash
# Create a test ledger
01s-ledger init
01s-ledger log test entry=1
01s-ledger log test entry=2

# Manually corrupt an entry
LEDGER_FILE=~/ledger/$(date +%Y-%m-%d).aioss
sed -i 's/entry=2/entry=2_CORRUPTED/' "$LEDGER_FILE"

# Detect the break
01s-ledger verify
# Expected: [FAIL] Entry 1: hash mismatch
```

## Debugging Script

```bash
#!/usr/bin/env bash
# debug-pipeline.sh — Full debug of the compilation pipeline
set -euo pipefail

INPUT="${1:-let x = 42}"
echo "=== Pipeline Debug ==="
echo "Input: $INPUT"
echo ""

echo "=== Stage 1: Lexer ==="
echo "$INPUT" | 01s-lexer
echo ""

echo "=== Stage 2: Parser ==="
echo "$INPUT" | 01s-lexer | 01s-parser
echo ""

echo "=== Stage 3: Codegen ==="
echo "$INPUT" | 01s-lexer | 01s-parser | 01s-codegen > /tmp/debug-output.bin
echo "Output: $(wc -c < /tmp/debug-output.bin) bytes"
echo ""

echo "=== Binary Analysis ==="
01s-binary -l /tmp/debug-output.bin
echo ""

echo "=== Disassembly ==="
objdump -D -b binary -m i386:x86-64 /tmp/debug-output.bin 2>/dev/null || \
    echo "(objdump not available)"
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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

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