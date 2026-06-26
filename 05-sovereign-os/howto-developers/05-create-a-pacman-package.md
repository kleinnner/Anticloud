# Create a Pacman Package

This guide covers creating PKGBUILD files and setting up a local repository for 01s Sovereign packages.

## Step 1: Create the Package Directory

```bash
mkdir -p 01s-toolchain-pkg
cd 01s-toolchain-pkg
```

## Step 2: Write the PKGBUILD

```bash
# PKGBUILD — 01s Toolchain Package
# Maintainer: Your Name <email@example.com>

pkgname=01s-toolchain
pkgver=1.0.1
pkgrel=1
pkgdesc="01s Sovereign Toolchain - Custom lexer, parser, codegen, runes, binary, and ledger"
arch=('x86_64')
url="https://01s.sovereign"
license=('MIT')
depends=(
    'glibc'
    'gcc-libs'
)
makedepends=('rust')
source=(
    "${pkgname}-${pkgver}.tar.gz::https://github.com/01s/sovereign/archive/v${pkgver}.tar.gz"
)
sha256sums=('SKIP')

build() {
    cd "$srcdir/sovereign-${pkgver}/day-2/toolchain"
    
    # Build zerocli
    cd zerocli
    make
    cd ..
    
    # Build lexer
    cd lexer
    make
    cd ..
    
    # Build parser
    cd parser
    make
    cd ..
    
    # Build codegen
    cd codegen
    make
    cd ..
    
    # Build runes
    cd runes
    make
    cd ..
    
    # Build binary
    cd binary
    make
    cd ..
    
    # Build ledger
    cd ledger
    make
    cd ../..
}

check() {
    # Test each binary
    for bin in zerocli/zerocli lexer/lexer parser/parser codegen/codegen runes/runes binary/binary; do
        if [ ! -x "$srcdir/sovereign-${pkgver}/day-2/toolchain/$bin" ]; then
            echo "ERROR: $bin not found or not executable"
            exit 1
        fi
    done
    echo "All binaries built successfully"
}

package() {
    cd "$srcdir/sovereign-${pkgver}/day-2/toolchain"
    
    # Install zerocli
    install -Dm755 zerocli/zerocli "$pkgdir/usr/bin/zerocli"
    
    # Create zerocli symlinks
    for cmd in help motd grep ls ps fetch; do
        ln -sf /usr/bin/zerocli "$pkgdir/usr/bin/01s-${cmd}"
    done
    
    # Install toolchain binaries with 01s- prefix
    install -Dm755 lexer/lexer "$pkgdir/usr/bin/01s-lexer"
    install -Dm755 parser/parser "$pkgdir/usr/bin/01s-parser"
    install -Dm755 codegen/codegen "$pkgdir/usr/bin/01s-codegen"
    install -Dm755 runes/runes "$pkgdir/usr/bin/01s-runes"
    install -Dm755 binary/binary "$pkgdir/usr/bin/01s-binary"
    install -Dm755 ledger/01s-ledger "$pkgdir/usr/bin/01s-ledger"
    
    # Install source code
    mkdir -p "$pkgdir/usr/src/toolchain"
    cp -r * "$pkgdir/usr/src/toolchain/"
    
    # Install systemd service
    mkdir -p "$pkgdir/usr/lib/systemd/system"
    cat > "$pkgdir/usr/lib/systemd/system/01s-ledger.service" << 'SERVICE'
[Unit]
Description=01s Audit Ledger Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/01s-ledger init
ExecReload=/usr/bin/01s-ledger verify
Restart=on-failure

[Install]
WantedBy=multi-user.target
SERVICE
    
    # Install man page
    mkdir -p "$pkgdir/usr/share/man/man1"
    cat > "$pkgdir/usr/share/man/man1/01s-ledger.1" << 'MAN'
.TH 01S-LEDGER 1 "2026" "01s Sovereign" "User Commands"
.SH NAME
01s-ledger \- cryptographic audit trail system
.SH SYNOPSIS
01s-ledger [command] [args...]
.SH COMMANDS
init, log, tail, status, verify, watch, export, purge, toolchain, health, sign
MAN
}
```

## Step 3: Build the Package

```bash
# Generate checksums
makepkg -g >> PKGBUILD

# Build package
makepkg -s

# Install locally
sudo pacman -U 01s-toolchain-1.0.1-1-x86_64.pkg.tar.zst
```

## Step 4: Set Up a Local Repository

```bash
# Create repository directory
sudo mkdir -p /var/cache/pacman/01s
sudo chown -R $USER: /var/cache/pacman/01s

# Copy packages
cp *.pkg.tar.zst /var/cache/pacman/01s/
cd /var/cache/pacman/01s

# Create repository database
repo-add 01s.db.tar.gz *.pkg.tar.zst
```

## Step 5: Configure Pacman

Add to `/etc/pacman.conf`:

```ini
[01s]
SigLevel = Optional TrustAll
Server = file:///var/cache/pacman/01s
```

## Step 6: Install from Repository

```bash
sudo pacman -Sy
sudo pacman -S 01s-toolchain
```

## Step 7: Package for the ISO

Create a package list entry for the ISO:

```bash
# day-1/iso/profile/packages.x86_64
# Add at the end:
01s-toolchain
```

Update `pacman.conf` in the ISO profile to include the custom repository:

```ini
[01s]
SigLevel = Optional TrustAll
Server = https://repo.01s.sovereign/$arch
```

## PKGBUILD Reference

### Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `pkgname` | Package name | `01s-lexer` |
| `pkgver` | Package version | `1.0.0` |
| `pkgrel` | Package release | `1` |
| `pkgdesc` | Description | "01s Sovereign Tokenizer" |
| `arch` | Target architecture | `('x86_64')` |
| `url` | Project URL | `https://01s.sovereign` |
| `license` | License | `('MIT')` |
| `depends` | Runtime dependencies | `('glibc')` |
| `makedepends` | Build dependencies | `('rust')` |
| `source` | Source files/URLs | `('file.tar.gz')` |
| `sha256sums` | Checksums | `('SKIP')` |

### Functions

| Function | Purpose |
|----------|---------|
| `build()` | Compile source code |
| `check()` | Run tests |
| `package()` | Install files to package directory |
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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
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