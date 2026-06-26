# Development Environment

This guide covers setting up a complete development environment on 01s Sovereign for working with the custom toolchain and general software development.

## Pre-Installed Tools

01s Sovereign comes with these development tools pre-installed:

| Tool | Purpose |
|------|---------|
| **Alacritty** | GPU-accelerated terminal |
| **Vim** | Terminal text editor |
| **Nano** | Simple terminal editor |
| **Git** | Version control |
| **TMUX** | Terminal multiplexer |
| **01s-ledger** | Audit ledger |
| **zerocli** | Zero-trust CLI |
| **Clang/LLVM** | C/C++ compiler (toolchain base) |

## Installing Additional Compilers

### GCC

```bash
sudo pacman -S gcc make cmake
```

### Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### Python

```bash
sudo pacman -S python python-pip python-virtualenv
```

### Node.js

```bash
sudo pacman -S nodejs npm
```

### Go

```bash
sudo pacman -S go
```

## Setting Up the Custom Toolchain

The custom toolchain source is located at `/usr/src/toolchain/`.

### Building All Components

```bash
cd /usr/src/toolchain/

for d in zerocli lexer parser codegen runes binary; do
  echo "Building $d..."
  make -C "$d" clean 2>/dev/null
  make -C "$d"
done
```

### Verifying Build

```bash
01s-ledger toolchain
```

## Editor Configuration

### Vim Configuration

01s Sovereign includes a `.vimrc` in the skel directory:

```bash
cat ~/.vimrc
```

Recommended additions:

```vim
" In ~/.vimrc
syntax on
set number
set tabstop=2
set shiftwidth=2
set expandtab
set hlsearch
set incsearch
set mouse=a

" 01s filetype detection
au BufRead,BufNewFile *.01s set filetype=01s
```

### VS Code (Optional)

```bash
# Install from AUR
yay -S visual-studio-code-bin

# Or install open-source version
sudo pacman -S code
```

### JetBrains IDEs

```bash
# Install IntelliJ IDEA
yay -S intellij-idea-ultimate-edition

# Install CLion
yay -S clion
```

## Git Configuration

```bash
# Basic configuration
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --global init.defaultBranch main

# Aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

# Diff tool
git config --global diff.tool vimdiff

# Credential storage
git config --global credential.helper store
```

## Debugging Tools

```bash
# Install debugging tools
sudo pacman -S gdb strace ltrace valgrind perf

# Binary analysis
sudo pacman -S binutils elfutils objdump
```

### Using GDB

```bash
# Compile with debug symbols
gcc -g -o program program.c

# Run debugger
gdb ./program
```

### Using strace

```bash
# Trace system calls
strace -f -o trace.log ./program

# Filter by syscall
strace -e open,read,write ./program
```

## Profiling Tools

```bash
# Using perf
perf stat ./program
perf record ./program
perf report

# Using valgrind
valgrind --leak-check=full ./program
```

## Working with the Toolchain Ledger

Every development action is logged to the ledger:

```bash
# Log compilation
01s-ledger log compile source="program.01s" result="success"

# Log test run
01s-ledger log test name="unit-tests" passed="42" failed="0"

# Check development history
01s-ledger tail 20
```

## TMUX Configuration

01s Sovereign includes a pre-configured `.tmux.conf`:

```bash
# Start tmux
tmux

# Key bindings
# Ctrl+b "  - split horizontal
# Ctrl+b %  - split vertical
# Ctrl+b arrows - navigate panes
# Ctrl+b c  - new window
# Ctrl+b n/p - next/prev window
# Ctrl+b d  - detach
```

## Shell Customization

### Alacritty Configuration

```bash
~/.config/alacritty/alacritty.toml
```

### Starship Prompt

01s Sovereign uses Starship for a customized prompt:

```bash
~/.config/starship.toml
```

## Project Structure for 01s Development

Recommended project structure:

```
my-project/
├── src/
│   ├── main.01s
│   └── lib.01s
├── tests/
│   └── test_main.01s
├── Makefile
├── README.md
└── .gitignore
```

### Example Makefile

```makefile
.PHONY: all clean run

LEXER = 01s-lexer
PARSER = 01s-parser
CODEGEN = 01s-codegen

all: build/program.bin

build/program.bin: src/main.01s
	@mkdir -p build
	cat $< | $(LEXER) | $(PARSER) | $(CODEGEN) > $@
	@echo "Built: $@"

run: build/program.bin
	./$<

clean:
	rm -rf build
```

### Example .gitignore

```
build/
*.bin
*.aioss
logs/
```

---

## See Also

- [Writing Your First Program](13-writing-your-first-program.md)
- [Advanced Toolchain Usage](20-advanced-toolchain-usage.md)
- [Contributing Back](25-contributing-back.md)

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
| Tool not found | Not installed | Use sudo pacman -S <package> |
| Devshell not starting | tmux missing | Install tmux: sudo pacman -S tmux |
| PATH not updated | Shell restart needed | Run exec  or log out/in |
| Alias not working | Wrong shell | Check if using bash (our default) |

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

### Common Pitfalls (Development)

| Pitfall | Why It Happens | How to Avoid |
|---------|---------------|--------------|
| Devshell not activating | tmux not installed or configured | Install tmux and configure .tmux.conf |
| PATH not finding tools | Profile not sourced after install | Run exec  or log out and back in |
| Git not configured | Missing user.email and user.name | Set global git config on first use |
| Debugger not working | Missing permissions for ptrace | Allow ptrace in /etc/sysctl.d/ or use root |
| VS Code extensions missing | Extensions not in offline cache | Download extensions in a zip file for offline use |

## Practice Exercises (Advanced)

1. **Devshell Customization**: Modify the devshell configuration to include your preferred editor, terminal, and debugging tools
2. **Multi-Language Setup**: Configure development environments for Python, Rust, Go, and Node.js simultaneously using devshell modules
3. **Git Hook Integration**: Create a pre-commit git hook that runs the toolchain linter before every commit
4. **Remote Development**: Set up VS Code Remote SSH for developing on a headless 01s Sovereign server
5. **Containers in 01s**: Install and configure Docker or Podman; verify container operations are logged in the ledger

## Further Reading

- [Writing Your First Program](13-writing-your-first-program.md) — Getting started
- [Custom Toolchain](12-using-the-custom-toolchain.md) — Toolchain usage
- [Advanced Toolchain](20-advanced-toolchain-usage.md) — Advanced tools
- [Source Repository Structure](../developers/02-source-code-repository-structure.md) — Code layout
- [Building from Source](../developers/03-building-from-source.md) — Build process
- [Testing Framework](../developers/12-testing-framework.md) — Testing tools
- [Debugging and Profiling](../developers/17-debugging-and-profiling.md) — Debug tools
- [CI/CD Pipeline](../developers/18-ci-cd-pipeline-reference.md) — Automation
- [Development FAQ](../faq/12-development-faq.md) — Common questions
- [Contributing Code](../developers/11-contributing-code.md) — Code contributions

## Multi-Language Setup

```bash
# Python
pacman -S python python-pip
# Rust
pacman -S rustup
rustup default stable
# Go
pacman -S go
mkdir -p ~/go/{bin,src,pkg}
# Node.js 
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
```

## Git Configuration

```bash
git config --global user.name "Alice User"
git config --global user.email "alice@example.com"
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global fetch.prune true
```

## Real-World Scenario: CI/CD Pipeline

A development team configures a CI/CD pipeline: (1) Developer pushes code to GitHub, (2) GitHub Actions triggers build VM running 01s Sovereign, (3) VM builds toolchain, compiles source, and runs tests, (4) Ledger captures every step with timestamps and hashes, (5) If tests pass, binary is signed and published to package repository, (6) Release entry added to ledger with all build artifacts hashes. Pipeline execution time: 8 minutes. Ledger entries: 47 per build.

## Installed Development Tools

| Tool | Package | Purpose | Config File |
|------|---------|---------|-------------|
| Git | git | Version control | ~/.gitconfig |
| VS Code | code | Text editor | ~/.config/Code/ |
| Python | python | Scripting | ~/.pythonrc |
| GCC | gcc | C/C++ compilation | - |
| Rust | rustup | Rust toolchain | ~/.cargo/config |
| Node.js | nvm | JavaScript runtime | ~/.nvm/ |
| Go | go | Go compiler | ~/.go/ |
| Docker | docker | Containers | /etc/docker/ |

## Devshell Integration with VS Code

```json
// .vscode/settings.json for 01s development
{
  "terminal.integrated.shell.linux": "/usr/bin/bash",
  "terminal.integrated.env.linux": {
    "DEVSHELL": "1",
    "01S_TOOLCHAIN_PATH": "/usr/src/toolchain"
  },
  "rust-analyzer.linkedProjects": [
    "/usr/src/toolchain/lexer/Cargo.toml",
    "/usr/src/toolchain/parser/Cargo.toml"
  ],
  "editor.formatOnSave": true,
  "files.autoSave": "onFocusChange"
}
```

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| PATH | Standard paths + ~/.local/bin | Executable search |
| EDITOR | nano | Default text editor |
| BROWSER | firefox | Default web browser |
| PAGER | less | Terminal pager |
| TERM | xterm-256color | Terminal emulation |
| DEVSHELL | 0 | Set to 1 in devshell |
| 01S_LEDGER_PATH | /var/log/01s | Ledger database path |

## Python Development Environment

```bash
# Install Python development tools
sudo pacman -S python python-pip python-virtualenv

# Create virtual environment
python -m venv ~/venv/myproject
source ~/venv/myproject/bin/activate

# Install packages
pip install flask requests numpy pandas

# Set up Python linting
pip install pylint black mypy
pylint --generate-rcfile > ~/.pylintrc
```

## Rust Development Environment

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add components
rustup component add rust-analyzer rust-src clippy

# Create new project
cargo new myproject
cd myproject

# Build and run
cargo build
cargo run

# Run tests
cargo test

# Format code
cargo fmt

# Check for issues
cargo clippy
```

## Container Development with Docker

```bash
# Install Docker
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

# After log out and back in:
docker run hello-world

# Development container example
cat > Dockerfile << 'DOCKER'
FROM rust:latest
WORKDIR /app
COPY . .
RUN cargo build --release
CMD ["./target/release/myapp"]
DOCKER

# Build and run
docker build -t myapp .
docker run myapp

# View container logs
docker logs myapp

# Stop container
docker stop myapp
```

## VS Code Extensions for 01s Development

Recommended extensions for developing on 01s Sovereign:

```bash
code --install-extension rust-lang.rust-analyzer
code --install-extension ms-python.python
code --install-extension golang.go
code --install-extension bungcip.better-toml
code --install-extension eamodio.gitlens
code --install-extension yzhang.markdown-all-in-one
code --install-extension gruntfuggly.todo-tree
code --install-extension tamasfe.even-better-toml
code --install-extension vadimcn.vscode-lldb  # Debugger
code --install-extension streetsidesoftware.code-spell-checker
```

## GNOME Builder for Native Development

GNOME Builder is an alternative IDE integrated with the GNOME desktop:

```bash
sudo pacman -S gnome-builder
gnome-builder  # Launch from terminal or applications
```

Builder features:
- Native GTK application development
- Integrated debugger (gdb, lldb)
- Profiling tools (sysprof)
- Flatpak integration for sandboxed builds
- Git integration with visual diff
- Vala, C, C++, Rust, Python support
- UI designer for GTK applications
- Performance profiling built-in
- Template-based project creation
- Build system support (meson, cmake, cargo, autotools)

## Remote Development via SSH

```bash
# From another machine, connect to 01s Sovereign
ssh -p 2222 user@01s-machine.local

# Mount remote filesystem via SSHFS
mkdir ~/remote-01s
sshfs user@01s-machine.local:/home/user ~/remote-01s

# Develop remotely with VS Code
# Install "Remote - SSH" extension
# Ctrl+Shift+P > Remote-SSH: Connect to Host
# Enter: user@01s-machine.local
```

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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