# Introduction to zerocli

`zerocli` is the primary command-line interface for 01s Sovereign. It provides a set of utilities for system management, file operations, and process monitoring -- all with zero trust (every action is logged to the ledger).

## Overview

zerocli is a multi-call binary that behaves differently based on how it is invoked:
- When executed as `zerocli`, it uses subcommands
- When symlinked as `01s-ls`, `01s-ps`, `01s-grep`, etc., it runs the corresponding command

## Commands

### Message of the Day (motd)

```bash
# Display the MOTD (default command)
zerocli
# or
zerocli motd
```

Displays the 01s Sovereign ASCII art banner with system information.

### List Directory (ls)

```bash
# List current directory
zerocli ls

# List with details
zerocli ls -la
```

### List Processes (ps)

```bash
# Show all processes
zerocli ps

# Show process tree
zerocli ps aux
```

### Search Files (grep)

```bash
# Search for pattern in file
zerocli grep "pattern" file.txt

# Recursive search
zerocli grep -r "pattern" /etc/
```

### Fetch URL (fetch)

```bash
# Download a file
zerocli fetch https://example.com/file.txt

# Fetch with output filename
zerocli fetch -o output.txt https://example.com/file.txt
```

### Show Help (help)

```bash
# Display help
zerocli help

# Help for a specific command
zerocli help ls
```

### Show Version (version)

```bash
zerocli version
```

Output: `zerocli v1.0.0 -- 0-1 Sovereign System CLI`

## Symbolic Link Mode

zerocli can be invoked through symbolic links for convenience:

| Symlink | Command |
|---------|---------|
| `01s-ls` | `zerocli ls` |
| `01s-ps` | `zerocli ps` |
| `01s-grep` | `zerocli grep` |
| `01s-fetch` | `zerocli fetch` |
| `01s-motd` | `zerocli motd` |

```bash
# Create symlinks (pre-installed in ISO)
ln -s /usr/bin/zerocli /usr/local/bin/01s-ls
ln -s /usr/bin/zerocli /usr/local/bin/01s-ps
ln -s /usr/bin/zerocli /usr/local/bin/01s-grep
```

## Detailed Command Reference

### motd (Message of the Day)

Displays a system banner with:
- 01s Sovereign ASCII art logo
- Kernel version
- Uptime
- Memory usage
- Disk usage
- Active ledger status

```bash
# Display MOTD
zerocli motd
```

Example output:
```
  â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—  â–ˆâ–ˆâ•—â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—
 â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•— â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•”â•â•â•â•â•
 â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•‘ â–ˆâ–ˆâ•‘â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—
 â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•‘ â–ˆâ–ˆâ•‘â•šâ•â•â•â•â–ˆâ–ˆâ•‘
 â–ˆâ–ˆâ•‘  â–ˆâ–ˆâ•‘ â–ˆâ–ˆâ•‘â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•‘
 â•šâ•â•  â•šâ•â• â•šâ•â•â•šâ•â•â•â•â•â•â•

 01s Sovereign v1.0.1
 Kernel: 6.x.x-arch1-1
 Uptime: 2h 15m
 Memory: 1.2 GB / 7.8 GB
 Ledger: Active (42 entries)
```

### ls (List Directory)

Lists files and directories with optional details:

```bash
# Basic listing
zerocli ls
# Output: Documents  Downloads  Music  Pictures  code

# Detailed listing
zerocli ls -la
# Output:
# total 42
# drwxr-xr-x  1 01s 01s    512 Jun 14 12:00 .
# drwxr-xr-x  1 01s 01s    512 Jun 14 12:00 ..
# drwxr-xr-x  1 01s 01s    512 Jun 14 12:00 Documents
# drwxr-xr-x  1 01s 01s    512 Jun 14 12:00 Downloads

# Sort by size
zerocli ls -laS
```

### ps (Process List)

Shows running processes with optional details:

```bash
# All processes
zerocli ps
# Output:
#   PID  COMMAND
#     1  systemd
#   123  systemd-journal
#   456  gdm
#   789  gnome-shell
#   ...  

# Detailed view
zerocli ps aux
# Output:
# USER       PID  CPU  MEM  COMMAND
# 01s       1234  0.5  2.3  gnome-shell
# root         1  0.0  0.1  systemd
```

### grep (Search)

Searches files for patterns:

```bash
# Basic search
zerocli grep "error" /var/log/syslog
# Output with line numbers:
# /var/log/syslog:42: [ERROR] Connection timeout
# /var/log/syslog:87: [ERROR] Disk full

# Recursive case-insensitive search
zerocli grep -ri "TODO" /usr/src/toolchain/
# /usr/src/toolchain/lexer/main.rs:15: TODO: Add unicode support
```

### fetch (Download)

Downloads files from URLs:

```bash
# Basic download
zerocli fetch https://example.com/file.txt
# Output: Downloaded file.txt (1024 bytes)

# Download with custom name
zerocli fetch -o output.txt https://example.com/file.txt

# Show progress
zerocli fetch -v https://example.com/large-file.iso
```

## Output Formatting

zerocli supports output formatting options:

| Flag | Effect |
|------|--------|
| `--color` | Color output (auto/always/never) |
| `--json` | Output as JSON |
| `--quiet` | Suppress non-essential output |
| `--verbose` | Show detailed information |

```bash
# JSON output for scripting
zerocli ps --json
# Output: [{"pid": 1, "command": "systemd"}, ...]

# Quiet mode for scripts
zerocli ls --quiet
```

## Ledger Integration

Every zerocli command invocation is automatically logged to the 01s ledger:

```bash
# Check the ledger after using zerocli
01s-ledger tail 3
```

The ledger records:
- Command executed
- Arguments used
- Exit status
- Timestamp
- User who ran the command

This provides a complete audit trail of all CLI operations.

### Verification of Command History

```bash
# See all zerocli commands used today
01s-ledger export | jq '.[] | select(.type == "tool_call") | .content.command'
```

## Scripting with zerocli

zerocli can be used in shell scripts for automated workflows:

```bash
#!/bin/bash
# system-report.sh - Generate system report

echo "=== System Report ==="
echo "Date: $(date)"

echo "--- Processes ---"
zerocli ps aux --json | jq '.[] | select(.command | test("systemd"))'

echo "--- Large Files ---"
zerocli ls -la /var/log/ | sort -k5 -rn | head -5

echo "--- Download Latest ISO ---"
zerocli fetch https://github.com/Lois-Kleinner/sovereign-os/releases/latest/download/iso

# Log the report generation
01s-ledger log report name="system-report" status=completed

## ASCII Art Display

zerocli includes built-in ASCII art:

```bash
# Display the 01s sovereign rune
01s-runes

# List available glyphs
01s-runes --list
```

## Configuration

zerocli does not require configuration files. It reads the `HOME` environment variable for ledger storage and uses sensible defaults for all operations.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOME` | `/home/user` | User home directory |
| `LEDGER_DIR` | `$HOME/ledger/` | Ledger storage path |
| `ZEROCLI_COLOR` | `auto` | Color output (always/never/auto) |

## Source Code

The zerocli source code is available at `/usr/src/toolchain/zerocli/`.

To rebuild:

```bash
cd /usr/src/toolchain/zerocli/
make clean
make
```

## Use Cases

### System Administration

```bash
# Quick system check
zerocli ps | grep -c "systemd"
zerocli ls -la /var/log/

# Download scripts securely
zerocli fetch https://scripts.0-1.gg/verify.sh
```

### Development Workflow

```bash
# Search through codebase
zerocli grep -r "TODO\|FIXME" /usr/src/toolchain/

# Check running processes
zerocli ps aux | grep 01s
```

## Comparison with Standard GNU Tools

| Feature | GNU Coreutils | zerocli |
|---------|---------------|---------|
| Ledger logging | No | Yes (automatic) |
| JSON output | No (`--json` not standard) | Yes (`--json`) |
| Symlink mode | No | Yes (01s-ls, 01s-ps) |
| Color output | Partial | Consistent |
| Multi-call binary | No (separate binaries) | Yes (single binary) |
| Source transparency | Separate packages | Included in /usr/src/ |

## Performance

zerocli adds minimal overhead compared to standard tools:

| Command | Standard | zerocli | Overhead |
|---------|----------|---------|----------|
| ls (100 files) | 2ms | 3ms | 1ms |
| ps (50 processes) | 3ms | 4ms | 1ms |
| grep (1MB file) | 10ms | 11ms | 1ms |

The overhead comes from ledger logging, which records each command execution.

## Extending zerocli

zerocli is open-source and can be extended:

```bash
# Source structure
/usr/src/toolchain/zerocli/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ main.rs      # Entry point and dispatcher
â”‚   â”œâ”€â”€ commands/
â”‚   â”‚   â”œâ”€â”€ ls.rs    # Directory listing
â”‚   â”‚   â”œâ”€â”€ ps.rs    # Process listing
â”‚   â”‚   â”œâ”€â”€ grep.rs  # Text search
â”‚   â”‚   â”œâ”€â”€ fetch.rs # URL download
â”‚   â”‚   â””â”€â”€ motd.rs  # Message of the day
â”‚   â””â”€â”€ ledger.rs    # Ledger integration
â””â”€â”€ Makefile
```

To add a new command:

```rust
// 1. Create src/commands/mycommand.rs
pub fn execute(args: &[&str]) -> Result<(), String> {
    // Your command implementation
    Ok(())
}

// 2. Register in main.rs
mod commands::mycommand;
// ...
"mycommand" => commands::mycommand::execute(&cmd_args),

// 3. Rebuild
make -C /usr/src/toolchain/zerocli
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Command not found | Check symlinks are created: `ls -la /usr/local/bin/01s-*` |
| Ledger not logging | Ensure `01s-ledger init` has been run |
| Permission denied | Run with `sudo` for system-level operations |
| Colors not working | Set `ZEROCLI_COLOR=always` |
| Output truncated | Redirect to file or use `--json` for parsing |
| Slow commands | Check ledger disk I/O; ensure SSD if possible |
| Symbolic link missing | Recreate with `ln -s /usr/bin/zerocli /usr/local/bin/01s-*` |

## Frequently Asked Questions

**Q: Do I need to use zerocli instead of standard tools?**
A: No. Standard GNU tools work fine. zerocli provides the same functionality with ledger integration.

**Q: Can zerocli replace all my CLI tools?**
A: It covers common operations (ls, ps, grep, fetch). For specialized tools (tar, find, awk), use standard commands.

**Q: Does zerocli work over SSH?**
A: Yes. zerocli functions as a normal CLI tool and works in any terminal session, including SSH.

**Q: How do I disable ledger logging for a specific command?**
A: Currently all zerocli commands are logged. To avoid logging, use standard GNU tools instead.

---

## See Also

- [Using 01s-Ledger](10-using-01s-ledger.md)
- [Using the Custom Toolchain](12-using-the-custom-toolchain.md)
- [Writing Your First Program](13-writing-your-first-program.md)

---


## Common Mistakes

| Mistake | Why It Happens | Correct Approach |
|---------|---------------|------------------|
| Command not found | zerocli not in PATH | Check /usr/bin/zerocli |
| No color output | TERM not set | Export TERM=xterm-256color |
| Symlink broken | 01s-* links missing | Run ln -s /usr/bin/zerocli /usr/bin/01s-<cmd> |
| Plugin not working | Wrong directory | Place in /usr/local/lib/zerocli/plugins/ |

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

### Common Pitfalls (zerocli)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| Command not recognized | zerocli not initialized | Run zerocli init first |
| Output truncated without pager | Long output in terminal | Pipe to less or use --format json |
| Plugin not loaded | Wrong extension point | Check plugin implements correct interface |
| Environment variable missing | PATH not set in profile | Add zerocli to ~/.bashrc or ~/.zshrc |
| Color codes not rendering | TERM not set correctly | Export TERM=xterm-256color in profile |

## Practice Exercises (Advanced)

1. **Plugin Development**: Write a zerocli plugin that monitors CPU temperature and logs it to the ledger every 5 minutes
2. **Alias System**: Create a set of aliases that map common Linux commands to their zerocli equivalents
3. **Output Formatting**: Use zerocli's JSON output mode to pipe data into a web dashboard (Node.js/Python)
4. **Scripting Automation**: Write a bash script that uses zerocli to batch-process 100 files and log each operation
5. **Security Audit**: Review the zerocli source code and identify any potential security issues (run as non-root)

## Further Reading

- [Using 01s-Ledger](10-using-01s-ledger.md) â€” Ledger operations
- [Custom Toolchain](12-using-the-custom-toolchain.md) â€” Toolchain usage
- [zerocli Plugins](../developers/05-zerocli-plugins-development.md) â€” Plugin development
- [zerocli Features](../features/06-zerocli-command-line.md) â€” Feature overview
- [Toolchain FAQ](../faq/03-toolchain-faq.md) â€” Common questions
- [Debugging and Profiling](../developers/17-debugging-and-profiling.md) â€” Development tools
- [CI/CD Pipeline](../developers/18-ci-cd-pipeline-reference.md) â€” Automation
- [Ledger Troubleshooting](../help/03-ledger-troubleshooting.md) â€” Issue resolution
- [Community Plugins](../community/07-community-projects-and-ecosystem.md) â€” Shared plugins
- [Contributing Code](../developers/11-contributing-code.md) â€” Development guide

## Command Reference

| Command | Description | Example |
|---------|-------------|---------|
| `zerocli init` | Initialize environment | `zerocli init --force` |
| `zerocli status` | Show daemon/plugin status | `zerocli status --verbose` |
| `zerocli run` | Run command with logging | `zerocli run -- ./build.sh` |
| `zerocli log` | Show command history | `zerocli log --since 1h` |
| `zerocli plugin` | Manage plugins | `zerocli plugin install monitor` |
| `zerocli alias` | Manage aliases | `zerocli alias set ll "ls -la"` |

## Plugin Development Template

```python
#!/usr/bin/env python3
import psutil, json, subprocess, time

def collect_metrics():
    cpu = psutil.cpu_percent(interval=1)
    mem = psutil.virtual_memory()
    return {"cpu": cpu, "mem_percent": mem.percent,
            "mem_avail_mb": mem.available / 1024 / 1024}

def log_to_ledger(metrics):
    cmd = ["zerocli", "run", "--", "echo", json.dumps(metrics)]
    subprocess.run(cmd, capture_output=True)

while True:
    log_to_ledger(collect_metrics())
    time.sleep(300)
```

## Real-World Scenario: Development Workflow

A developer uses zerocli to log all build operations: `zerocli run -- make && zerocli run -- make test`. When a build fails, the developer checks `zerocli log --failed` to see the exact command that failed, the exit code, and the timestamp. The ledger entry includes the full command, working directory, environment variables (redacted), and output hash. This enables deterministic reproduction of the build for debugging.

## Command Details

### zerocli init
Initializes the zerocli environment, creating configuration files and registering with the ledger daemon.
```bash
zerocli init                    # Interactive setup
zerocli init --default          # Default config
zerocli init --force            # Re-initialize if exists
```

### zerocli run
Executes a command and logs it to the ledger.
```bash
zerocli run -- ls -la          # Log directory listing
zerocli run --output json -- make   # Log build with JSON output
zerocli run --no-log -- whoami  # Execute without logging
```

### zerocli log
Displays command history from the ledger.
```bash
zerocli log                    # Last 20 commands
zerocli log --since 1h         # Last hour
zerocli log --failed           # Only failed commands
zerocli log --search "nginx"   # Search command history
zerocli log --format json      # JSON output for processing
```

### zerocli config
Manages zerocli configuration.
```bash
zerocli config show            # Display current config
zerocli config set editor.code  # Set default editor
zerocli config get editor.code # Get specific setting
zerocli config reset            # Reset to defaults
```

## Configuration File Reference

zerocli configuration is stored in `~/.config/zerocli/config.toml`:

```toml
[general]
prompt = "01s> "
pager = "less"
default_format = "table"

[logging]
enabled = true
max_entries = 10000
exclude_patterns = ["ls", "echo"]

[security]
sudo_logging = true
redact_patterns = ["--password", "token="]

[plugins]
directory = "/usr/local/lib/zerocli/plugins"
auto_load = true
```

## zerocli Workflow Examples

### Development Workflow
```bash
# Start coding session
zerocli log --begin-session

# Build project (logged)
zerocli run -- make clean
zerocli run -- make
zerocli run -- make test

# Commit changes
git add .
git commit -m "Fix bug in parser"
zerocli alias commit "git commit"

# End session
zerocli log --end-session
```

### System Administration
```bash
# Check system status
zerocli status --all

# View failed commands
zerocli log --failed --last 20

# Search command history
zerocli log --search "pacman" --since "1 week ago"

# Export admin activity for compliance
zerocli log --user root --format json --output root-commands.json
```

### Plugin Management
```bash
# List installed plugins
zerocli plugin list

# Install plugin from registry
zerocli plugin install system-monitor

# Install plugin from file
zerocli plugin install --file ./my-plugin.01s

# Enable/disable plugins
zerocli plugin disable system-monitor

# Configure plugin
zerocli plugin config system-monitor --interval 60

# Remove plugin
zerocli plugin remove system-monitor
```

## zerocli vs Standard CLI Comparison

| Feature | Standard CLI | zerocli |
|---------|-------------|---------|
| Command execution | Direct | Intercepted via DEBUG trap |
| Logging | None by default | All commands logged to ledger |
| History | ~/.bash_history | Searchable, timestamped, auditable |
| Security | No tamper protection | Hash-chained, verified |
| Output capture | Manual with pipes | Automatic JSON/table formats |
| Plugin system | None | Modular architecture |
| Session tracking | None | Session start/end markers |
| Failure reporting | Exit code only | Error details + ledger entry |

## zerocli vs Standard CLI: Detailed Comparison

| Feature | Standard CLI (bash) | zerocli |
|---------|-------------------|---------|
| Command Execution | Direct by shell | Intercepted via DEBUG trap |
| History Storage | ~/.bash_history | Hash-chained ledger database |
| History Search | grep + history | `zerocli log --search` |
| Timestamp Accuracy | Second precision | Millisecond precision (ISO 8601) |
| User Tracking | Not recorded by default | UID recorded for every command |
| Exit Code Recording | Not recorded | Recorded for every command |
| Tamper Protection | None | SHA3-256 hash chain |
| Export Format | Plain text | JSON, CSV, YAML, TAR.GZ |
| Plugin System | None | Modular architecture |
| Session Tracking | Not supported | Session start/end markers |
| Remote Audit | Not possible | Export for compliance |
| Resource Usage | Minimal | ~5ms overhead per command |

## Common zerocli Error Messages

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "zerocli: command not found" | Not installed or not in PATH | Install zerocli package, check PATH |
| "Error: ledger not initialized" | 01s-ledgerd not running | `systemctl start 01s-ledgerd` |
| "Error: DEBUG trap not active" | Shell not configured | `source /etc/profile.d/01s-ledger.sh` |
| "Error: plugin not found" | Plugin not installed | `zerocli plugin list` to see available |
| "Error: permission denied" | Insufficient privileges | Run with sudo (will be logged) |
| "Warning: slow operation detected" | Command took >30 seconds | Check if command is expected to be slow |
| "Warning: failed to record entry" | Ledger database locked | Check 01s-ledgerd status, retry |

---

Lois-Kleinner and 0-1.gg 2026 Copyright
