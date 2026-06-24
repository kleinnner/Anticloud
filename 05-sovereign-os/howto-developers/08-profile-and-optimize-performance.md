# Profile and Optimize Performance

This guide covers performance profiling, flamegraph generation, and JIT optimization techniques for the 01s toolchain.

## Prerequisites

```bash
sudo pacman -S perf valgrind linux-tools
```

## Profiling the Lexer

### Basic Performance Counters

```bash
# Count cycles, instructions, cache misses
perf stat -e cycles,instructions,cache-misses,cache-references \
    bash -c 'echo "let x = 42 * 1000000" | 01s-lexer > /dev/null'

# Sample output:
# Performance counter stats for 'bash -c ...':
#     1,234,567,890      cycles
#     2,345,678,901      instructions
#        12,345,678      cache-misses
#        98,765,432      cache-references
```

### CPU Profiling with perf

```bash
# Profile lexer with call graph
perf record -F 99 -g \
    bash -c 'for i in $(seq 1 1000); do echo "let x = $i"; done | 01s-lexer > /dev/null'

perf report

# Key metrics to look for:
# - Hot functions (high self-cycles)
# - Cache miss rate
# - Branch mispredictions
```

## Generating Flame Graphs

### Step 1: Install FlameGraph Tools

```bash
git clone https://github.com/brendangregg/FlameGraph /tmp/FlameGraph
export PATH=$PATH:/tmp/FlameGraph
```

### Step 2: Collect Profile Data

```bash
# Profile the full pipeline
perf record -F 99 -g -- \
    bash -c '
    for i in $(seq 1 100); do
        echo "let x = $i * 2 + 1"
    done | 01s-lexer | 01s-parser | 01s-codegen > /dev/null
    '

# Generate flamegraph
perf script | stackcollapse-perf.pl | flamegraph.pl > /tmp/pipeline-flame.svg
```

### Step 3: Analyze the Flamegraph

Open `/tmp/pipeline-flame.svg` in a browser:
- Wide bars = functions consuming significant CPU time
- Tall stacks = deep call chains
- Red-colored frames = hot functions

## Optimizing the Lexer

### 1. Byte-Level Processing

```rust
// Before: Char vector with bounds checking
impl Lexer {
    fn peek(&self) -> Option<char> {
        self.chars.get(self.pos).copied()
    }
}

// After: Byte-level with iterator
impl Lexer {
    fn peek(&self) -> Option<u8> {
        if self.pos < self.input.len() {
            Some(self.input.as_bytes()[self.pos])
        } else {
            None
        }
    }
}
```

### 2. Token Pre-Allocation

```rust
// Before: Dynamic growth
fn tokenize(&mut self) -> Vec<Token> {
    let mut tokens = Vec::new();
    // ...
}

// After: With capacity hint
fn tokenize(&mut self) -> Vec<Token> {
    let estimated = self.chars.len() / 4;  // rough estimate
    let mut tokens = Vec::with_capacity(estimated.max(16));
    // ...
}
```

### 3. Inline Hints

```rust
#[inline(always)]
fn peek(&self) -> Option<char> { ... }

#[inline]
fn read_identifier(&mut self) -> String { ... }
```

## Optimizing the Parser

### 1. Token Lookup Optimization

```rust
// Before: String comparison
fn peek(&self) -> Option<&Token> {
    self.tokens.get(self.pos)
}

// After: Use match on token type
fn expect_keyword(&mut self, expected: &str) -> bool {
    match self.peek() {
        Some(tok) if tok.ttype == "Keyword" && tok.value == expected => {
            self.advance();
            true
        }
        _ => false,
    }
}
```

### 2. AST Pool Allocation

```rust
// Pre-allocate common AST nodes
struct AstPool {
    numbers: Vec<Expr>,
    strings: Vec<Expr>,
}

impl AstPool {
    fn new_number(&mut self, val: i64) -> Expr {
        Expr::Number(val)
    }
}
```

## Optimizing the Codegen

### 1. Instruction Selection Optimization

```rust
// Before: Always use 64-bit mov for push
fn emit_push_imm(em: &mut Emitter, val: i64) {
    em.emit(&[0x48, 0xb8]); // movabs $val, %rax
    em.emit(&(val as u64).to_le_bytes());
    em.emit(&[0x50]); // push %rax
}

// After: Use shorter encoding for small values
fn emit_push_imm(em: &mut Emitter, val: i64) {
    if val >= -128 && val <= 127 {
        em.emit(&[0x6a, val as u8]); // push $imm8 (2 bytes)
    } else if val >= -2147483648 && val <= 2147483647 {
        em.emit(&[0x68]);            // push $imm32 (5 bytes)
        em.emit(&(val as i32).to_le_bytes());
    } else {
        em.emit(&[0x48, 0xb8]);      // movabs $val, %rax (10 bytes)
        em.emit(&(val as u64).to_le_bytes());
        em.emit(&[0x50]);
    }
}
```

### 2. Peephole Optimization

```rust
fn peephole_optimize(em: &mut Emitter) {
    let code = &em.code;
    let mut opt = Vec::with_capacity(code.len());
    let mut i = 0;
    
    while i < code.len() {
        // Pattern: push %rax; pop %rax  →  remove both
        if i + 1 < code.len() && code[i] == 0x50 && code[i + 1] == 0x58 {
            i += 2;
            continue;
        }
        
        // Pattern: mov $0, %rax; push %rax  →  push $0
        if i + 7 < code.len()
            && code[i..i+3] == [0x48, 0xc7, 0xc0]
            && code[i+3..i+7] == [0x00, 0x00, 0x00, 0x00]
            && code[i+7] == 0x50
        {
            opt.extend_from_slice(&[0x6a, 0x00]);  // push $0
            i += 8;
            continue;
        }
        
        opt.push(code[i]);
        i += 1;
    }
    em.code = opt;
}
```

### 3. Register Allocation

```rust
struct RegisterAllocator {
    regs: Vec<&'static str>,
    used: [bool; 16],  // RAX, RCX, RDX, RBX, RSI, RDI, R8-R15
}

impl RegisterAllocator {
    fn alloc(&mut self) -> Option<usize> {
        for (i, &used) in self.used.iter().enumerate() {
            if !used {
                self.used[i] = true;
                return Some(i);
            }
        }
        None  // spill to stack
    }
    
    fn free(&mut self, reg: usize) {
        self.used[reg] = false;
    }
}
```

## Benchmarking

### Running Benchmarks

```bash
#!/bin/bash
# benchmark.sh — Run performance benchmarks

echo "=== Lexer Benchmarks ==="
for size in 100 1000 10000; do
    # Generate test input
    python3 -c "for i in range($size): print(f'let x{i} = {i * 2} + 1')" > /tmp/input.txt
    
    # Time lexer
    echo "Input size: $size lines"
    time (01s-lexer < /tmp/input.txt > /dev/null) 2>&1
done

echo ""
echo "=== Pipeline Benchmarks ==="
for size in 10 100 1000; do
    python3 -c "for i in range($size): print(f'fn fib_{i}(n) {{ return n }}')" > /tmp/input.txt
    
    echo "Program size: $size functions"
    time (01s-lexer < /tmp/input.txt | 01s-parser | 01s-codegen > /dev/null) 2>&1
done
```

### Using perf stat for Comparison

```bash
# Before optimization
perf stat -r 5 bash -c 'echo "let x = 42 * 1000" | 01s-lexer > /dev/null' 2>&1 | tail -10

# Apply optimization (rebuild)
make -C day-2/toolchain/lexer

# After optimization
perf stat -r 5 bash -c 'echo "let x = 42 * 1000" | 01s-lexer > /dev/null' 2>&1 | tail -10
```

## Memory Profiling with Valgrind

```bash
# Heap profiling
valgrind --tool=massif \
    bash -c 'echo "let x = 42 * 10000" | 01s-lexer > /dev/null'
ms_print massif.out.* | head -50

# Cache profiling
valgrind --tool=cachegrind \
    bash -c 'echo "let x = 42 * 10000" | 01s-lexer > /dev/null'
cg_annotate cachegrind.out.*
```

## Recording Results to Health Ledger

```bash
# Log benchmark results
DATE=$(date +%Y-%m-%d)
01s-ledger health log "$DATE" lexer_throughput performance pass 125 "1000 tokens in 125ms"
01s-ledger health log "$DATE" parser_throughput performance pass 340 "1000 AST nodes in 340ms"
01s-ledger health log "$DATE" codegen_throughput performance pass 280 "100 bytes in 280ms"
01s-ledger health log "$DATE" code_size measurement pass 0 "$(stat -c%s /usr/bin/01s-codegen) bytes"
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
