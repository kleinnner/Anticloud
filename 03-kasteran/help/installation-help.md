<!--
KASTERAN* — The Last Programming Language
© Lois-Kleinner & 0-1.gg 2026. All rights reserved.

 ▄▄   ▄▄▄                                           ▄     
 ██  ██▀                         ██              ▄▄ █ ▄▄  
 ██▄██      ▄█████▄  ▄▄█████▄  ███████    ▄████▄    ██▄████   ▄█████▄  ██▄████▄   █████   
 █████      ▀ ▄▄▄██  ██▄▄▄▄ ▀    ██      ██▄▄▄▄██   ██▀       ▀ ▄▄▄██  ██▀   ██  ▀▀ █ ▀▀  
 ██  ██▄   ▄██▀▀▀██   ▀▀▀▀██▄    ██      ██▀▀▀▀▀▀   ██       ▄██▀▀▀██  ██    ██     ▀     
 ██   ██▄  ██▄▄▄███  █▄▄▄▄▄██    ██▄▄▄   ▀██▄▄▄▄█   ██       ██▄▄▄███  ██    ██           
 ▀▀    ▀▀   ▀▀▀▀ ▀▀   ▀▀▀▀▀▀      ▀▀▀▀     ▀▀▀▀▀    ▀▀        ▀▀▀▀ ▀▀  ▀▀    ▀▀           
-->

# Kasteran* — Installation Help
© Lois-Kleinner & 0-1.gg 2026

## Common Installation Issues

This guide covers installation issues across Windows, macOS, and Linux.

## Prerequisites

- Rust toolchain (rustc 1.70+)
- Git
- C compiler (for C backend): gcc, clang, or MSVC
- CMake (for Cranelift JIT)

## Windows

### Issue: MSVC Build Tools Not Found

**Error:**
```
error: linker 'link.exe' not found
```

**Solution:** Install Visual Studio Build Tools from https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022. Select "Desktop development with C++" workload.

### Issue: Long Path Support

**Error:**
```
The filename or extension is too long
```

**Solution:** Enable long path support in Windows:
```
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 1 /f
```

### Issue: openssl-sys Build Failure

**Error:**
```
error: failed to run custom build command for 'openssl-sys'
```

**Solution:** Install OpenSSL via vcpkg or Chocolatey:
```
choco install openssl
```
Or use the `native-tls-vendored` feature flag.

## macOS

### Issue: Xcode Command Line Tools

**Error:**
```
error: failed to run custom build command for 'cc'
```

**Solution:**
```
xcode-select --install
```

### Issue: Homebrew Linker Errors

**Error:**
```
ld: library not found for -lSystem
```

**Solution:** Ensure Command Line Tools are properly configured:
```
sudo rm -rf /Library/Developer/CommandLineTools
xcode-select --install
```

## Linux

### Issue: Missing Development Packages

**Error (Ubuntu/Debian):**
```
error: linker 'cc' not found
```

**Solution:**
```
sudo apt-get update
sudo apt-get install build-essential pkg-config libssl-dev cmake
```

**Error (Fedora/RHEL):**
```
sudo dnf groupinstall "Development Tools"
sudo dnf install openssl-devel cmake
```

**Error (Arch Linux):**
```
sudo pacman -S base-devel openssl cmake
```

### Issue: glibc Version

**Error:**
```
/lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.32' not found
```

**Solution:** Build with an older glibc target or use a musl-based build:
```
rustup target add x86_64-unknown-linux-musl
cargo build --target x86_64-unknown-linux-musl --release
```

## All Platforms

### Issue: Rust Version Too Old

**Error:**
```
error[E0658]: use of unstable library feature
```

**Solution:** Update Rust:
```
rustup update stable
```

### Issue: WASM Target Not Installed

**Error:**
```
error: target 'wasm32-unknown-unknown' not installed
```

**Solution:**
```
rustup target add wasm32-unknown-unknown
```

### Issue: Cranelift JIT Build Failure

**Error:**
```
error: failed to compile 'cranelift-jit'
```

**Solution:** The Cranelift JIT backend requires a recent Rust compiler. If you encounter issues:
1. Update Rust: `rustup update`
2. Install cmake and ensure it is in PATH
3. On Linux, install `libclang-dev`:
   ```
   sudo apt-get install libclang-dev
   ```

### Issue: Git Clone Timeout

**Error:**
```
fatal: unable to access 'https://github.com/.../': Failed to connect
```

**Solution:**
```
# Use SSH instead
git clone git@github.com:user/repo.git

# Or set a higher timeout
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
```

### Issue: Disk Space

**Error:**
```
No space left on device (os error 28)
```

**Solution:**
```
# Clean cargo cache
cargo clean
# Remove old Rust toolchains
rustup toolchain remove old-toolchain
```

### Issue: Permission Denied (Linux/macOS)

**Error:**
```
error: Permission denied (os error 13)
```

**Solution:**
```
# Do not install as root; use local installation
cargo install --path . --root ~/.local
# Ensure ~/.local/bin is in PATH
```

## Verifying Installation

After a successful build:

```
$ kasteran --version
Kasteran* 0.5.0 (2026-06-19)

$ kasteran run --version
Bytecode VM: running in interpreter mode

$ echo 'fn main() { print("Hello, Kasteran*!") }' > test.ka
$ kasteran run test.ka
Hello, Kasteran*!
```

If all commands work, the installation is complete.

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
