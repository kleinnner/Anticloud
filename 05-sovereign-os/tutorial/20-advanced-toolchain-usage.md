# Advanced Toolchain Usage

This guide covers advanced topics for the 01s Sovereign custom toolchain, including custom lexer grammars, JIT optimization flags, and extending the pipeline.

## Custom Lexer Grammars

The lexer can be extended with new token types for domain-specific languages.

### Adding Keywords

The lexer's keyword list is defined in `01s-lexer/src/main.rs`:

```rust
let keywords = ["let", "fn", "if", "else", "while", "return", "true", "false", "nil"];
```

To add keywords:

```bash
# Edit the source
vim /usr/src/toolchain/lexer/src/main.rs

# Add to keywords array
let keywords = ["let", "fn", "if", "else", "while", "return",
                "true", "false", "nil", "match", "import", "type"];

# Rebuild
make -C /usr/src/toolchain/lexer
```

### Adding Custom Operators

The lexer supports two-character operator detection. To add new operators:

```rust
if ["==", "!=", "<=", ">=", "&&", "||", "->", "=>", "::", ".."].contains(&pair.as_str()) {
```

### Extending Punctuation

```rust
if op.len() == 1 && "(){}[];,:.@#$%^&*".contains(c) {
```

## Advanced Parser Features

### Recursive-Descent Extensions

The parser supports extending statement types. For example, adding a `match` statement:

```rust
fn parse_match(&mut self) -> Option<Stmt> {
    self.expect("match")?;
    let expr = self.parse_expr()?;
    self.expect("{")?;
    let mut arms = Vec::new();
    while self.peek().map(|t| t.value.as_str()) != Some("}") {
        let pattern = self.parse_expr()?;
        self.expect("=>")?;
        let value = self.parse_expr()?;
        arms.push((pattern, value));
    }
    self.expect("}")?;
    Some(Stmt::Match(expr, arms))
}
```

### Precedence Climbing

For expression parsing with proper operator precedence:

| Level | Operators | Associativity |
|-------|-----------|---------------|
| 1 | `*`, `/` | Left |
| 2 | `+`, `-` | Left |
| 3 | `==`, `!=`, `<`, `>`, `<=`, `>=` | Left |
| 4 | `&&` | Left |
| 5 | `\|\|` | Left |

## JIT Optimization Flags

The code generator supports various optimization strategies:

### Stack vs Register Allocation

By default, the codegen uses a stack-based architecture. For better performance:

```rust
// In 01s-codegen/src/main.rs

// Enable register allocation (experimental)
const USE_REGISTER_ALLOC: bool = true;

// Number of callee-saved registers to use
const REGISTER_POOL_SIZE: usize = 6; // RBX, R12-R15, RBP
```

### Emit Statistics

```bash
# Enable verbose codegen output
CODEGEN_VERBOSE=1 cat program.01s | 01s-lexer | 01s-parser | 01s-codegen
```

### Memory Optimization

```rust
// Adjust stack frame size
em.emit(&[0x48, 0x81, 0xec, 0x00, 0x04, 0x00, 0x00]); // 1KB frame
```

## Pipeline Extensions

### Creating Preprocessors

```bash
#!/bin/bash
# 01s-pp: Preprocess .01s files

cat "$1" | \
  sed 's/^import "\(.*\)"/\n  \/* import \1 *\/\n/' | \
  01s-lexer | \
  01s-parser | \
  01s-codegen
```

### Creating Postprocessors

```bash
#!/bin/bash
# 01s-link: Link multiple .bin files

cat "$@" > /tmp/combined.bin
01s-binary -d < /tmp/combined.bin > linked-dump.txt
```

## Working with Machine Code

### Disassembly

```bash
# Disassemble generated binary
objdump -D -b binary -m i386:x86-64 prog.bin

# Show raw hex with offsets
01s-binary -d < prog.bin
```

### Understanding Emitted Code

```
Address   | Bytes       | Assembly
0x0000    | 55          | push %rbp
0x0001    | 48 89 e5    | mov %rsp, %rbp
0x0004    | 48 81 ec 00 01 00 00 | sub $0x100, %rsp
          | ...         | (instructions)
0x002F    | 48 c7 c0 00 00 00 00 | mov $0x0, %rax
0x0036    | c9           | leave
0x0037    | c3           | ret
```

## Custom Binary Format

The binary format loader supports both standard ELF and the custom 01s format.

### Binary Format Specification

```
Magic:  "01SB" (4 bytes)
Header: 64 bytes
  - version (u16)
  - entry_point (u64)
  - code_size (u64)
  - data_size (u64)
  - flags (u32)
Entries: variable length
```

### Creating Custom Binary Loaders

```rust
// Example: Write a custom loader
use std::fs;
use std::io::Read;

struct CustomBinary {
    magic: [u8; 4],
    version: u16,
    entry: u64,
    code: Vec<u8>,
}

fn load_custom(path: &str) -> CustomBinary {
    let mut f = fs::File::open(path).unwrap();
    let mut magic = [0u8; 4];
    f.read_exact(&mut magic).unwrap();
    // ... parse rest
}
```

## Performance Analysis

### Benchmarking

```bash
# Time compilation pipeline
time (cat program.01s | 01s-lexer | 01s-parser | 01s-codegen > /dev/null)

# Profile with perf
perf stat -e instructions,cache-misses,branch-misses \
  bash -c 'cat program.01s | 01s-lexer | 01s-parser | 01s-codegen > /dev/null'
```

### Profiling Codegen Output

```bash
# Count instructions in generated binary
objdump -d prog.bin | grep -c '^[[:space:]]'

# Measure execution time
perf stat ./prog.bin
```

## Integration with External Tools

### LLVM Integration

```bash
# Convert 01s AST to LLVM IR (planned feature)
cat program.01s | 01s-lexer | 01s-parser | 01s-to-llvm > program.ll
llc program.ll -o program.o
gcc program.o -o program
```

### GCC Integration

```bash
# Use as a compiler plugin
gcc -fplugin=/usr/lib/01s/01s-plugin.so program.c
```

## Custom Runes

Create custom rune glyphs:

```bash
# Create a custom glyph file
sudo mkdir -p /usr/local/share/01s/runes/glyphs

sudo tee /usr/local/share/01s/runes/glyphs/my-rune << 'EOF'
  â–ˆâ–ˆâ•—  â–ˆâ–ˆâ•—
  â•šâ–ˆâ–ˆâ•—â–ˆâ–ˆâ•”â•
   â•šâ–ˆâ–ˆâ–ˆâ•”â•
   â–ˆâ–ˆâ•”â–ˆâ–ˆâ•—
  â–ˆâ–ˆâ•”â• â–ˆâ–ˆâ•—
  â•šâ•â•  â•šâ•â•
EOF

# Display custom rune
01s-runes my-rune
```

## Debugging Toolchain

### Debug Mode

```bash
# Enable debug output
export 01S_DEBUG=1
cat program.01s | 01s-lexer

# Redirect debug to file
01S_DEBUG_LOG=/tmp/debug.log cat program.01s | 01s-lexer | 01s-parser
```

### Common Debug Flags

| Flag | Component | Effect |
|------|-----------|--------|
| `01S_LEXER_TRACE` | Lexer | Show token-by-token processing |
| `01S_PARSER_TRACE` | Parser | Show parser state transitions |
| `01S_CODEGEN_TRACE` | Codegen | Show instruction emission |
| `01S_BINARY_TRACE` | Binary | Show binary parsing details |

---

## See Also

- [Writing Your First Program](13-writing-your-first-program.md)
- [Using the Custom Toolchain](12-using-the-custom-toolchain.md)
- [Toolchain FAQ](../faq/03-toolchain-faq.md)

---



## Detailed Walkthrough

### Step-by-Step Guide

Follow these steps to complete the task described in this guide:

1. Open a terminal (Ctrl+Alt+T or Super+T)
2. Verify you are in the correct environment
3. Follow each instruction in sequence
4. Check the expected output at each step
5. If something goes wrong, refer to the troubleshooting section below

### Expected Outputs at Each Step

| Step | Expected Output | If Different |
|------|----------------|--------------|
| Command check | Command executes without error | Check PATH and permissions |
| Configuration apply | Setting is updated | Check for error messages |
| Verification | Pass / Success message | Re-check previous steps |
| Completion | Process completes | Check system logs |

### Common Error Messages

| Error Message | Meaning | Solution |
|---------------|---------|----------|
| "Permission denied" | Need sudo/root | Prepend sudo to the command |
| "Command not found" | Tool not installed | Install with sudo pacman -S |
| "File not found" | Wrong path | Check path with ls or ind |
| "Connection refused" | Service not running | Start with systemctl start |
| "Invalid argument" | Wrong syntax | Check command syntax in docs |

### Verification Commands

After completing the guide steps, verify with:

`ash
# Check tool is accessible
which <tool-name>

# Check version
<tool-name> --version

# Check service status
systemctl status <service-name>

# View logs
journalctl -u <service-name> --no-pager -n 20
`

### Alternative Approaches

If the primary method doesn't work for your setup:

1. **Manual method**: Perform each step manually instead of using automation
2. **GUI method**: Use graphical tools instead of command line
3. **Container method**: Run in a Docker/Podman container
4. **VM method**: Set up in a virtual machine first

### Performance Considerations

| Factor | Impact | Recommendation |
|--------|--------|---------------|
| Disk I/O | Slow on HDD | Use SSD for better performance |
| Network speed | Affects downloads | Use wired connection |
| RAM | Affects compilation | Close other applications |
| CPU cores | Affects parallel tasks | Use -j flag for parallel builds |

### Next Steps

Once you've completed this guide, move to the next tutorial, practice on a test system, or explore the feature documentation for advanced options.


## Reference Information

### Related Commands
| Command | Purpose | Example |
|---------|---------|---------|
| man <topic> | View manual page | man ls |
| <command> --help | Show help | zerocli --help |
| info <topic> | GNU info page | info bash |

### Configuration Files
| File | Purpose | Location |
|------|---------|----------|
| System config | Global settings | /etc/ |
| User config | Per-user settings | ~/.config/ |
| Service config | Service definitions | /etc/systemd/system/ |
| Application data | Persistent data | ~/.local/share/ |

### Log Files Reference
| Log | Command | Location |
|-----|---------|----------|
| System journal | journalctl -xe | /var/log/journal/ |
| Boot log | dmesg | Kernel ring buffer |
| Auth log | journalctl -u sshd | /var/log/ |
| Ledger | 01s-ledger tail | ~/ledger/ |
| Health | 01s-ledger health status | logs/health/ |

### Environment Variables
| Variable | Purpose | Default |
|----------|---------|---------|
| HOME | User home directory | /home/username |
| PATH | Executable search paths | /usr/local/bin:/usr/bin:/bin |
| LANG | System locale | en_US.UTF-8 |
| TERM | Terminal type | xterm-256color |
| EDITOR | Default text editor | nano |
| SHELL | Default shell | /bin/bash |
| USER | Current username | (login name) |

### Service Management Quick Reference
| Action | System Service | User Service |
|--------|---------------|--------------|
| View status | systemctl status <name> | systemctl --user status <name> |
| Start | sudo systemctl start <name> | systemctl --user start <name> |
| Stop | sudo systemctl stop <name> | systemctl --user stop <name> |
| Enable at boot | sudo systemctl enable <name> | systemctl --user enable <name> |
| Disable | sudo systemctl disable <name> | systemctl --user disable <name> |
| View logs | journalctl -u <name> | journalctl --user -u <name> |

### File System Hierarchy
| Directory | Purpose |
|-----------|---------|
| /bin | Essential user binaries |
| /boot | Boot loader files |
| /dev | Device files |
| /etc | System configuration |
| /home | User home directories |
| /proc | Process information |
| /root | Root user home |
| /run | Runtime variable data |
| /tmp | Temporary files |
| /usr | User system resources |
| /var | Variable data (logs, spools) |

### Package File Extensions
| Extension | Type | Install Command |
|-----------|------|----------------|
| .pkg.tar.zst | Standard package | pacman -U |
| .pkg.tar.xz | Legacy package | pacman -U |
| .src.tar.gz | Source package | makepkg -si |
| .flatpak | Flatpak app | flatpak install |
| .AppImage | Portable app | chmod +x && ./ |

## Common Mistakes

| Mistake | Why It Happens | Correct Approach |
|---------|---------------|------------------|
| Binary not found | Toolchain not built | Run make in /usr/src/toolchain/ |
| Pipeline fails | Missing input | Pipe source file through all stages |
| Parser error | Syntax error | Check source for unmatched brackets |
| Codegen error | Unsupported feature | Check AST output for unsupported nodes |

## Practice Exercises

1. Review the key concepts covered in this guide
2. Try applying each configuration step on your system
3. Document any differences you observe from expected behavior
4. Share your experience in the community forums
5. Write a summary of what you learned

## Verification Checklist

- [ ] You can perform the main task described in this guide
- [ ] You understand the common mistakes and how to avoid them
- [ ] You can troubleshoot basic issues independently
- [ ] You know where to find additional help if needed

### Common Pitfalls (Advanced Toolchain)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| JIT compilation fails | Memory protection not set | Check ulimit -l for locked memory limits |
| Pipeline memory leak | Large AST not freed | Use --gc-interval flag to control GC |
| Custom runes not displaying | Glyph table not updated | Rebuild glyph cache after adding runes |
| Optimization degrades performance | Wrong optimization flags | Profile before and after each optimization |
| Debug symbols stripped | Release build configuration | Build with --debug for debugging, --release for production |

## Practice Exercises (Advanced)

1. **Custom Optimization Pass**: Implement a dead-code elimination pass in the codegen; benchmark improvement on real programs
2. **Runes Glyph Designer**: Create a custom set of runes for monitoring system metrics (CPU, RAM, disk I/O)
3. **Cross-Stage Validation**: Write a validator that checks the AST output of the parser before passing to codegen
4. **Toolchain Performance Benchmark**: Create a benchmark suite that measures each stage for programs of varying complexity (10-1000 lines)
5. **Custom Binary Format Extension**: Modify the binary loader to support a new section type for embedded metadata

## Further Reading

- [Custom Toolchain](12-using-the-custom-toolchain.md) â€” Basic toolchain usage
- [Writing Your First Program](13-writing-your-first-program.md) â€” Getting started
- [Codegen Backend Development](../developers/08-codegen-backend-development.md) â€” Backend dev
- [Lexer Customization](../developers/06-lexer-customization-guide.md) â€” Lexer changes
- [Parser Grammar Extension](../developers/07-parser-grammar-extension.md) â€” Grammar changes
- [Runes Glyph API](../developers/09-runes-glyph-api.md) â€” Runes reference
- [Binary Format Spec](../developers/10-binary-format-specification.md) â€” Format reference
- [Compiler Optimization Research](../research/09-custom-compiler-and-toolchain-optimization.md) â€” Research
- [Toolchain FAQ](../faq/03-toolchain-faq.md) â€” Common questions
- [Toolchain Troubleshooting](../help/05-toolchain-troubleshooting.md) â€” Issue resolution

## Optimization Pass Example: Constant Folding

```rust
fn constant_fold(ast: &mut AST) {
    for node in ast.nodes.iter_mut() {
        match node {
            Node::BinaryOp { op: Op::Add, left, right } |
            Node::BinaryOp { op: Op::Mul, left, right } => {
                if let (Node::Literal(l), Node::Literal(r)) = (&**left, &**right) {
                    let result = match op { Op::Add => l + r, Op::Mul => l * r, _ => continue };
                    *node = Node::Literal(result);
                }
            }
            _ => {}
        }
    }
}
```

## Performance Benchmark

```bash
hyperfine --warmup 3 \
  '01s-lex < samples/fibonacci.aioss > /dev/null' \
  '01s-parse < samples/fibonacci.aioss > /dev/null' \
  '01s-codegen < samples/fibonacci.aioss > /dev/null'
```

## Real-World Scenario: Teaching Compiler Design

A university course uses the 01s toolchain as a teaching compiler. Students: (1) Add a `match` expression to the lexer/parser, (2) Implement constant folding optimization, (3) Modify codegen to emit loop unrolling, (4) Benchmark before/after performance, (5) Submit changes as pull requests. The toolchain's simplicity (7 single-file Rust programs, zero dependencies) enables students to understand the full compilation pipeline in one semester.

## Pipeline Stage Options

| Stage | Flag | Effect |
|-------|------|--------|
| 01s-lex | --verbose | Show token-by-token processing |
| 01s-lex | --no-optimize | Disable lexer optimizations |
| 01s-parse | --dump-ast | Print AST as JSON |
| 01s-parse | --validate | Validate AST without output |
| 01s-codegen | --optimize O1/O2/O3 | Optimization level |
| 01s-codegen | --jit-mem N | JIT memory limit (MB) |
| 01s-codegen | --debug | Include debug symbols |
| 01s-loader | --trace | Show execution trace |
| 01s-loader | --profile | Print execution profile |

## Creating a New Optimization Pass

1. Define the optimization struct in `codegen/src/optimizer.rs`
2. Implement the `Optimize` trait with `fn apply(&self, ast: &mut AST) -> Result<(), Error>`
3. Register the pass in the optimization pipeline
4. Test with sample programs
5. Benchmark performance improvement

Example skeleton:
```rust
pub struct DeadCodeElimination;
impl Optimize for DeadCodeElimination {
    fn apply(&self, ast: &mut AST) -> Result<(), Error> {
        let mut new_nodes = Vec::new();
        for node in &ast.nodes {
            if !is_dead_code(node) {
                new_nodes.push(node.clone());
            }
        }
        ast.nodes = new_nodes;
        Ok(())
    }
}
```

## Cross-Compilation Strategy

1. Isolate architecture-specific code in `codegen/src/arch/`
2. Create `x86_64.rs`, `arm64.rs`, `riscv.rs` modules
3. Add `--target` flag to codegen
4. Implement instruction selection for each target
5. Test with QEMU system emulation

## Integrating Toolchain with External Tools

```bash
# Export AST for external analysis
01s-parse < source.aioss --dump-ast > ast.json
python3 -c "
import json
with open('ast.json') as f:
    ast = json.load(f)
print(f'Found {len(ast[\"nodes\"])} AST nodes')
"

# Convert to Graphviz for visualization
cat ast.json | python3 -c "
import json, sys
ast = json.load(sys.stdin)
print('digraph AST {')
for i, node in enumerate(ast['nodes']):
    print(f'  n{i} [label=\"{node[\"type\"]}\"]')
    if 'children' in node:
        for j, child in enumerate(node['children']):
            print(f'  n{i} -> n{i}_{j}')
print('}')
" | dot -Tpng > ast.png
```

## Toolchain Extension Points

| Component | Extension Point | Purpose |
|-----------|----------------|---------|
| Lexer | Token enum | Add new token types |
| Lexer | tokenize() match arms | Add lexer patterns |
| Parser | Expression enum | Add AST node types |
| Parser | parse_expression() | Add grammar rules |
| Codegen | emit_instruction() | Add code generation |
| Codegen | generate_register_allocation() | Custom register allocation |
| Linker | resolve_symbols() | Custom linking rules |
| Loader | load_segments() | Custom memory layout |
| Runes | render_glyph() | Custom glyph rendering |

## Debugging with the Trace Flag

```bash
# Enable execution trace
01s-loader --trace program.bin
# Output: each instruction executed with register state

# Limit trace to specific range
01s-loader --trace --trace-start 100 --trace-end 200 program.bin

# Trace with memory state
01s-loader --trace-memory program.bin

# Profile execution
01s-loader --profile program.bin
# Output: instruction count, hot functions, memory usage
```

## Pipeline Stage Statistics

| Stage | LOC | Memory (avg) | Time (100 lines) | Temp Files |
|-------|-----|--------------|------------------|------------|
| Lexer | 847 | 2.1 MB | 1.2 ms | None |
| Parser | 1,203 | 8.4 MB | 3.8 ms | None |
| Codegen | 1,456 | 16.2 MB | 7.1 ms | .o file |
| Linker | 623 | 4.8 MB | 1.5 ms | .bin file |
| Disassembler | 491 | 3.2 MB | 0.8 ms | None |
| Loader | 378 | 2.7 MB | 0.3 ms | None |
| Runes | 312 | 1.8 MB | 0.5 ms | None |

## Advanced Compiler Concepts Demonstrated

The toolchain implements several compiler design concepts useful for learning:

| Concept | Implementation | Location |
|---------|---------------|----------|
| Tokenization | Character-by-character state machine | Lexer: tokenize() |
| Recursive Descent | Grammar-driven parsing functions | Parser: parse_expression() |
| Abstract Syntax Tree | Typed node hierarchy | Parser: Expression enum |
| Register Allocation | Simple linear scan algorithm | Codegen: allocate_registers() |
| Constant Folding | Compile-time expression evaluation | Codegen: constant_fold() |
| Dead Code Elimination | Unreachable code detection | Codegen: eliminate_dead() |
| Peephole Optimization | Pattern-based instruction matching | Codegen: peephole_optimize() |
| JIT Compilation | Runtime code generation and execution | Codegen: jit_compile() |
| Symbol Resolution | Name-to-address mapping | Linker: resolve_symbols() |
| Relocation | Address fixup for linked code | Linker: relocate() |
| Segment Loading | Memory mapping of binary sections | Loader: load_segments() |
| Instruction Decoding | Binary-to-assembly translation | Disassembler: disassemble() |
| Glyph Rendering | Character-to-pixel mapping | Runes: render_glyph() |

---

Lois-Kleinner and 0-1.gg 2026 Copyright
