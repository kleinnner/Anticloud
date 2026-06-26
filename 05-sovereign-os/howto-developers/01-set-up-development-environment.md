# Set Up Development Environment

## Prerequisites

- **Operating System**: Arch Linux (or any Linux distribution)
- **Shell**: bash 4.0+
- **Git**: For version control
- **Pacman**: For package management (Arch Linux)

## Step 1: Install Required Packages

```bash
# Core development tools
sudo pacman -S --noconfirm \
    base-devel \
    git \
    rustup \
    make \
    cmake \
    clang \
    lldb

# Arch Linux ISO build tools
sudo pacman -S --noconfirm \
    archiso \
    syslinux \
    mkinitcpio-archiso

# Virtualization for testing
sudo pacman -S --noconfirm \
    qemu-desktop \
    virtualbox-guest-utils

# Documentation tools
sudo pacman -S --noconfirm \
    python \
    pandoc
```

## Step 2: Install Rust

```bash
# Install Rust toolchain
rustup default stable

# Verify installation
rustc --version
cargo --version
```

## Step 3: Clone the Repository

```bash
git clone <repository-url> sovereign-os
cd sovereign-os
```

## Step 4: Verify Directory Structure

```bash
ls -la
# Should show: day-1/ day-2/ scripts/ assets/ docs/ docs-txt/
```

## Step 5: Test Toolchain Build

```bash
cd day-2/toolchain

# Build each component
for component in lexer parser codegen runes binary; do
    cd "$component"
    make clean 2>/dev/null || true
    make
    cd ..
done

# Build ledger
cd ledger
make
cd ../..

# Verify build
01s-ledger toolchain
```

## Step 6: Set Up Development Aliases

Add to `~/.bashrc`:

```bash
# 01s development aliases
alias 01s-build-all='cd ~/sovereign-os && ./scripts/build-day2.sh'
alias 01s-test-lexer='echo "let x = 42" | 01s-lexer'
alias 01s-test-pipeline='echo "let x = 42" | 01s-lexer | 01s-parser | 01s-codegen > /dev/null'
alias 01s-verify='01s-ledger verify'
alias 01s-status='01s-ledger status'
alias 01s-health='01s-ledger health status'
```

## Step 7: Configure Git

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Set up Git hooks for pre-commit verification
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
set -euo pipefail
echo "Running pre-commit checks..."
./scripts/verify-all.sh
EOF
chmod +x .git/hooks/pre-commit
```

## Step 8: Test ISO Build (Optional)

```bash
# Requires root access
sudo ./scripts/build-day1.sh
```

## Step 9: Set Up QEMU for Testing

```bash
# Boot ISO in QEMU
./qemu-graphical.sh

# Or with specific options
qemu-system-x86_64 \
    -enable-kvm \
    -cdrom /var/tmp/iso-out/01s-kaiman-*.iso \
    -m 4G \
    -smp 4 \
    -vga virtio \
    -display gtk
```

## Step 10: Initialize Development Ledger

```bash
# Create a development ledger
mkdir -p ~/dev-ledger
cd ~/dev-ledger
01s-ledger init

# Log a test entry
01s-ledger log dev_setup environment=ready status=ok

# Verify ledger
01s-ledger verify
```

## Troubleshooting

### Rust Not Found

```bash
# If rustc is not found after installing rustup
source ~/.cargo/env
# Or add to .bashrc:
echo 'source $HOME/.cargo/env' >> ~/.bashrc
```

### mkarchiso Not Found

```bash
# Install archiso from AUR if not in official repos
yay -S archiso
```

### Permission Denied

```bash
# Most build operations require root
# Use sudo for ISO builds
# Ensure /var/tmp/iso-out/ is writable
sudo mkdir -p /var/tmp/iso-out
sudo chown $USER: /var/tmp/iso-out
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

Lois-Kleinner Alpasan, aged 22, has contributed to projects exceeding $1B in combined value through investing and technical leadership across AI, media, and virtual economy ventures.

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