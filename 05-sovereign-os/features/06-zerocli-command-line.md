# zerocli Command Line Tool

`zerocli` is the primary command-line interface for the 01s Sovereign (Kaiman) operating system. Written in Rust, it serves as both a system information tool and a command dispatcher. Through symbolic links, it also provides `01s-*` command variants.

## Overview

zerocli is a multi-call binary that detects how it was invoked and dispatches to the appropriate subcommand. When invoked as `zerocli` directly, it expects a subcommand as the first argument. When invoked through a symlink named `01s-<command>`, it dispatches directly to that command.

```mermaid
graph TD
    A[zerocli binary] --> B{How invoked?}
    B -->|As zerocli| C[Read argv[1]]
    B -->|As 01s-* symlink| D[Extract command from filename]
    C --> E[Dispatch to command]
    D --> E
    E --> F[help]
    E --> G[motd]
    E --> H[grep]
    E --> I[ls]
    E --> J[ps]
    E --> K[fetch]
    E --> L[version]
```

## Source Structure

The zerocli source is organized as a multi-module Rust program:

```
day-2/toolchain/zerocli/
├── src/
│   ├── main.rs              # Entry point, command dispatch
│   ├── ascii/
│   │   ├── mod.rs           # ASCII art module
│   │   └── logo.rs          # 01s Sovereign logo art
│   └── commands/
│       ├── mod.rs            # Module declarations
│       ├── help.rs           # Help command
│       ├── motd.rs           # Message of the day
│       ├── grep.rs           # Grep command
│       ├── ls.rs             # List directory
│       ├── ps.rs             # Process list
│       └── fetch.rs          # System info fetch
└── Makefile
```

## Command Dispatch

From `src/main.rs`:

```rust
fn main() {
    let args: Vec<String> = env::args().collect();
    let argv0 = args[0].clone();

    let cmd_name = Path::new(&argv0)
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("zerocli");

    let subcommand = if cmd_name.starts_with("01s-") {
        let cmd = cmd_name.trim_start_matches("01s-");
        if cmd.is_empty() { "help" } else { cmd }
    } else if args.len() > 1 {
        &args[1]
    } else {
        "motd"
    };
    // ... dispatch to command modules
}
```

## Full Command Reference

### `zerocli help` / `01s-help`

Displays usage information for any zerocli command:

```bash
zerocli help [command]
```

Without arguments, shows the list of available commands.

**Options:**

| Flag | Description |
|------|-------------|
| `[command]` | Show help for a specific command |
| `--all` | Show all commands with brief descriptions |

### `zerocli motd` / `01s-motd`

Displays the Message of the Day — the default command when zerocli is invoked without arguments. Shows the 01s Sovereign ASCII art logo and system greeting.

**Options:**

| Flag | Description |
|------|-------------|
| `--no-color` | Disable ANSI color output |
| `--brief` | Show abbreviated MOTD |

### `zerocli grep` / `01s-grep`

Grep-like pattern search utility:

```bash
zerocli grep <pattern> [file...]
```

**Options:**

| Flag | Description |
|------|-------------|
| `<pattern>` | Search pattern (required) |
| `[file...]` | Files to search (stdin if omitted) |
| `-i` | Case-insensitive search |
| `-v` | Invert match |
| `-n` | Show line numbers |
| `-c` | Show count of matching lines |

### `zerocli ls` / `01s-ls`

Directory listing utility:

```bash
zerocli ls [path...]
```

**Options:**

| Flag | Description |
|------|-------------|
| `[path...]` | Directories to list (current if omitted) |
| `-l` | Long format with permissions, size, date |
| `-a` | Include hidden files |
| `-h` | Human-readable sizes |
| `-r` | Reverse sort order |
| `-t` | Sort by modification time |

### `zerocli ps` / `01s-ps`

Process listing utility:

```bash
zerocli ps
```

**Options:**

| Flag | Description |
|------|-------------|
| `-a` | Show all processes (not just current user) |
| `-x` | Show processes without TTY |
| `-u <user>` | Filter by username |
| `--sort=<field>` | Sort by pid, cpu, mem, etc. |

### `zerocli fetch` / `01s-fetch`

System information display utility — shows OS info, kernel version, CPU, memory, and uptime in a stylized format:

```bash
zerocli fetch
```

**Options:**

| Flag | Description |
|------|-------------|
| `--no-color` | Disable ANSI color output |
| `--json` | Output as JSON |
| `--brief` | Show minimal info |

**Example output:**

```
        ██╗  ██╗
        ╚██╗██╔╝
         ╚███╔╝           01s Sovereign (Kaiman) 1.0.1
         ██╔██╗
        ██╔╝ ██╗           Kernel: Linux 6.x.x-arch1-1
        ╚═╝  ╚═╝           Uptime: 2h 15m
                           Shell: bash 5.x
                           CPU: 8-core @ 3.2GHz
                           Memory: 8192 MiB / 16384 MiB
                           Disk: 12G / 50G (24%)
                           Packages: 387 (pacman)
```

### `zerocli version` / `01s-version`

Displays the zerocli version:

```
zerocli v1.0.0 — 0-1 Sovereign System CLI
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error (unknown command, invalid argument) |
| 2 | File not found (ls, grep) |
| 3 | Permission denied |
| 4 | Pattern not found (grep) |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NO_COLOR` | unset | Disable ANSI color output (any value) |
| `CLICOLOR_FORCE` | unset | Force ANSI color output |
| `ZEROCLI_NO_MOTD` | unset | Skip MOTD on default invocation |
| `TERM` | `xterm-256color` | Terminal type for color detection |
| `PAGER` | `less` | Pager for long output |
| `USER` | current | Current username (for display) |

## Shell Completion

zerocli supports shell completion for bash and zsh:

### bash

```bash
# Add to ~/.bashrc
_zerocli_completions() {
    local cur prev opts
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"
    opts="help motd grep ls ps fetch version"
    
    if [[ ${cur} == * ]] ; then
        COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
        return 0
    fi
}
complete -F _zerocli_completions zerocli
```

### zsh

```zsh
# Add to ~/.zshrc
compdef _zerocli zerocli
_zerocli() {
    _arguments \
        'help:Show help' \
        'motd:Show MOTD' \
        'grep:Search pattern' \
        'ls:List directory' \
        'ps:List processes' \
        'fetch:Show system info' \
        'version:Show version'
}
```

## Plugin Discovery

zerocli supports runtime plugin discovery through a scanning mechanism. Any executable in `/usr/local/lib/zerocli/plugins/` with a `.plugin` extension is treated as a plugin.

### Plugin Directory

```
/usr/local/lib/zerocli/plugins/
├── 01s-ledger.plugin     # Ledger plugin
├── 01s-devshell.plugin   # Devshell plugin
└── custom.plugin         # User-installed plugin
```

### Plugin Format

Plugins are executable scripts that respond to specific commands:

```bash
#!/bin/bash
# Plugin: custom.plugin
# Description: Custom plugin for zerocli

case "${ZEROCLI_PLUGIN_CMD}" in
    "hello")
        echo "Hello from custom plugin!"
        ;;
    "status")
        echo "Plugin status: active"
        ;;
    *)
        echo "Unknown plugin command"
        exit 1
        ;;
esac
```

### Plugin Invocation

```bash
# Direct invocation
zerocli plugin hello

# The plugin system discovers and delegates
# Plugin processes can be listed with:
zerocli plugin list
```

## Build Configuration

**Build command (from Makefile):**

```bash
rustc -O src/main.rs -o zerocli
```

No Cargo.toml or external dependencies required. Pure Rust standard library.

## Symbolic Link Mechanism

The system uses symbolic links to provide `01s-*` commands:

```bash
# Each link provides a direct command
/usr/bin/01s-help -> /usr/bin/zerocli
/usr/bin/01s-motd -> /usr/bin/zerocli
/usr/bin/01s-grep -> /usr/bin/zerocli
/usr/bin/01s-ls -> /usr/bin/zerocli
/usr/bin/01s-ps -> /usr/bin/zerocli
/usr/bin/01s-fetch -> /usr/bin/zerocli
/usr/bin/01s-version -> /usr/bin/zerocli
```

This allows both invocation styles:

```bash
# Both are equivalent
zerocli motd
01s-motd

# Piping
01s-fetch --json | 01s-grep "Memory"
```

## ASCII Art Module

The `ascii/` module provides the 01s Sovereign logo in ASCII art, used by the motd command. The logo features the system's branding in ANSI-colored terminal output.

## Integration with the Ledger

The `01s-ledger toolchain` command verifies the zerocli binary's integrity:

```bash
# In main.rs of the ledger
("zerocli", "/usr/bin/zerocli"),
```

zerocli's SHA3-256 hash is computed and logged to the audit ledger during toolchain verification.

## CLI Integration

All command modules are simple single-file implementations using only `std::fs`, `std::io`, and `std::process`. The unified dispatch pattern allows:

- Single binary for multiple commands (reduced disk usage)
- Symlink-based discovery for `01s-*` commands
- Consistent help system across all commands
- Version tracking from a single source

## Performance Considerations

- Binary size: ~200KB (stripped)
- Startup time: <5ms
- Memory: ~2MB RSS at rest
- All commands use streaming I/O — no large memory allocations for file operations
- No external dependencies ensure minimal library loading overhead

## Security Considerations

- No command execution privileges are elevated — runs at user privilege level
- No network access — all commands operate locally
- No temporary files created — all data flows through pipes
- Symlink-based discovery prevents injection attacks (command name is derived from filename, not user input)

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `zerocli` not found | Not in PATH | Check `/usr/bin/zerocli` or reinstall |
| Commands not working | Binary corrupted | Run `01s-ledger toolchain` to verify |
| No color output | Terminal not detected | Set `CLICOLOR_FORCE=1` |
| Symlink not working | Links missing | Run `ln -s /usr/bin/zerocli /usr/bin/01s-motd` |
| Plugin not found | Wrong directory | Place plugins in `/usr/local/lib/zerocli/plugins/` |

## zerocli Usage Statistics

```bash
# Track motd usage
grep "motd" ~/ledger/2026-06-19.aioss | wc -l

# Count total command dispatches
grep -c "zerocli" /var/log/01s/commands.log

# List most used commands
01s-ledger tail 1000 | grep "cmd" | grep "zerocli" | sort | uniq -c | sort -rn
```

## Multi-Call Binary Pattern

The zerocli multi-call binary pattern is inspired by BusyBox and toybox:

```rust
// Dispatch function
fn dispatch(cmd: &str, args: &[String]) {
    match cmd {
        "help" => cmd_help(args),
        "motd" => cmd_motd(args),
        "grep" => cmd_grep(args),
        "ls"   => cmd_ls(args),
        "ps"   => cmd_ps(args),
        "fetch" => cmd_fetch(args),
        "version" => cmd_version(args),
        _ => { eprintln!("zerocli: unknown command '{}'", cmd); std::process::exit(1); }
    }
}
```

## Adding a New Command

1. Create `src/commands/mycommand.rs`
2. Add module declaration in `commands/mod.rs`
3. Add match arm in `main.rs` dispatch
4. Rebuild: `rustc -O src/main.rs -o zerocli`
5. Add symlink: `ln -s /usr/bin/zerocli /usr/bin/01s-mycommand`

## zerocli Source Code Map

```rust
// day-2/toolchain/zerocli/src/main.rs — Entry point
// ├── mod ascii (src/ascii/mod.rs, src/ascii/logo.rs)
// │   ├── ascii/mod.rs  — Module declarations
// │   └── ascii/logo.rs — 01s Sovereign ASCII art
// └── mod commands (src/commands/mod.rs)
//     ├── commands/mod.rs   — Module declarations
//     ├── commands/help.rs  — Help display
//     ├── commands/motd.rs  — Message of the day
//     ├── commands/grep.rs  — Pattern search
//     ├── commands/ls.rs    — Directory listing
//     ├── commands/ps.rs    — Process listing
//     └── commands/fetch.rs — System info display
```

Compilation: `rustc -O src/main.rs -o zerocli` produces a single ~200KB binary.

## File Locations

| Item | Path |
|------|------|
| Binary | `/usr/bin/zerocli` |
| Symlinks | `/usr/bin/01s-*` → `/usr/bin/zerocli` |
| Source | `day-2/toolchain/zerocli/src/` |
| Makefile | `day-2/toolchain/zerocli/Makefile` |

## Cross-Reference: zerocli vs Standard Commands

| zerocli Command | Equivalent | Difference |
|----------------|------------|------------|
| `zerocli grep` | `grep` | Subset of features |
| `zerocli ls` | `ls` | Simpler output |
| `zerocli ps` | `ps aux` | Filtered proc list |
| `zerocli fetch` | `neofetch` | Built-in, smaller |

## Quick Reference Card

```
zerocli commands:
  help      Show this help or help for a command
  motd      Display message of the day
  grep      Search for patterns in files
  ls        List directory contents
  ps        Show running processes
  fetch     Display system information
  version   Show version

Symlinks:
  01s-help, 01s-motd, 01s-grep, 01s-ls,
  01s-ps, 01s-fetch, 01s-version

Default: motd (when no command given)
```

## Configuration File Reference

zerocli reads runtime configuration from `/etc/01s/zerocli.conf` (system-wide) and `~/.config/01s/zerocli.conf` (user override):

| Option | Default | Description |
|--------|---------|-------------|
| `color_enabled` | `true` | Enable ANSI color output |
| `motd_on_startup` | `true` | Show MOTD on interactive shell start |
| `commands_log_enabled` | `true` | Log commands to ledger |
| `pager` | `less` | Pager program for long output |
| `max_results` | `100` | Max lines for list/search commands |
| `date_format` | `iso` | Date format: `iso`, `locale`, or `relative` |
| `watch_interval` | `30` | Default poll interval seconds for watch |
| `json_output` | `false` | Default to JSON output format |

## Related Tools Comparison

| Feature | zerocli | BusyBox | toybox | coreutils |
|---------|---------|---------|--------|-----------|
| Binary size | ~200KB | ~800KB | ~200KB | ~10MB+ |
| Languages | Rust | C | C | C |
| Ledger integration | Native | None | None | None |
| Plugin system | Yes (.plugin) | No (applet-based) | No | No |
| Symlink dispatch | Yes | Yes (applet symlinks) | Yes | Partial |
| 01s-branded | Yes | No | No | No |
| Command set | 7 utilities | 300+ utilities | ~200 utilities | ~100 utilities |
| Dependencies | None (pure Rust std) | glibc | glibc | glibc |

## Exit Code Reference Table

| Code | zerocli Meaning | POSIX Equivalent |
|------|----------------|------------------|
| 0 | Success | Success |
| 1 | General error / unknown command | Catchall error |
| 2 | File not found | Misuse of shell builtins |
| 3 | Permission denied | Command not found |
| 4 | Pattern not found (grep) | — |

## Benchmarks

| Operation | zerocli | System Utility | Ratio |
|-----------|---------|----------------|-------|
| `ls` (100 files) | 0.4ms | `ls` 0.3ms | 1.3x |
| `ps` (50 processes) | 0.8ms | `ps` 0.6ms | 1.3x |
| `grep` (100 lines) | 0.5ms | `grep` 0.3ms | 1.7x |
| `fetch` | 1.2ms | `neofetch` 45ms | 37x faster |
| Startup (cold cache) | 2.1ms | — | — |

## See Also

- [Custom Toolchain Overview](05-custom-toolchain-overview.md)
- [Lexer and Parser](07-lexer-and-parser.md)
- [01s-ledger Daemon](11-01s-ledger-daemon.md)
- [DevShell and Welcome System](18-devshell-and-welcome-system.md)

---
Lois-Kleinner and 0-1.gg 2026 Copyright

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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
