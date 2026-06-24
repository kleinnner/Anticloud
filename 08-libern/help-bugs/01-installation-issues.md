▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
Document version: 1.0.0 | Updated: 2026-06-19
Category: help-bugs | ID: LIB-HLP-001

────────────────────────────────────────────────────────────────

# Installation Issues

## 1. Overview

This guide covers common installation issues for Libern on Windows, macOS, and Linux. Libern is distributed as a single self-contained binary with no external dependencies. Despite this simplicity, installation issues can arise due to operating system policies, file system permissions, or environmental factors.

Most installation problems fall into one of these categories:
1. Installer fails to launch or crashes during setup
2. Binary is blocked by operating system security
3. MSI installer issues (Windows-specific)
4. Permission denied errors
5. Missing dependencies or runtime requirements

### Installation Decision Tree

```
Problem: Libern won't install or launch
    │
    ├── Windows?
    │   ├── Installer won't run → Check SmartScreen, antivirus, admin rights
    │   ├── MSI error → Use direct download, clear package cache
    │   ├── Permission denied → Run as admin, check UAC
    │   └── App won't launch → Reinstall, check WebView2
    │
    ├── macOS?
    │   ├── "Damaged" error → Right-click → Open, remove quarantine
    │   ├── Apple Silicon issue → Install Rosetta 2 or use ARM build
    │   └── Permission denied → chmod +x, check Gatekeeper
    │
    └── Linux?
        ├── Missing libraries → Install webkit2gtk, openssl, etc.
        ├── AppImage won't run → Install FUSE, make executable
        └── Permission denied → Use ~/.local/bin or home directory
```

---

## 2. Windows Installation Issues

### 2.1 Installer Fails to Launch

**Symptoms:** Double-clicking the installer produces no response, or an error dialog appears briefly and disappears.

**Causes and Solutions:**

- **Download incomplete or corrupted:** Verify the SHA-256 checksum of the downloaded file against the checksum published on the release page.
  ```
  certutil -hashfile Libern-Setup-x64.exe SHA256
  ```
  Compare the output with the published checksum.

- **Windows SmartScreen blocked:** Right-click the installer, select Properties, check "Unblock" if present, then click Apply and OK. This indicates the installer has not yet built reputation with Microsoft's SmartScreen system.

- **Antivirus quarantined:** Check your antivirus quarantine logs. Temporarily disable real-time protection during installation (re-enable immediately after). Add the installer file to your antivirus exclusions list if needed.

- **Windows Installer service not running:** Press Win+R, type `services.msc`, find "Windows Installer" service, ensure it is running and set to Manual or Automatic.

### 2.2 MSI Not Found (Package Manager Install)

**Symptoms:** Error message: "The specified MSI file could not be found" when using winget or Chocolatey.

**Causes and Solutions:**

- **Repository cache stale:** Update your package manager sources.
  - winget: `winget source update`
  - Chocolatey: `choco upgrade chocolatey` then `choco install libern`

- **Package not yet available:** Libern may not yet be indexed by your package manager. Download the installer directly from the releases page instead.

- **Corrupted package cache:** Clear the package manager cache.
  - winget: `winget cache --purge`
  - Chocolatey: `choco clean`

### 2.3 Permissions Denied

**Symptoms:** "Access denied" or "You do not have sufficient privileges" during installation.

**Causes and Solutions:**

- **Not running as administrator:** Right-click the installer and select "Run as administrator". Libern installs to Program Files by default, which requires elevated privileges.

- **User Account Control (UAC) blocking:** Ensure UAC is not set to "Always notify" (the highest setting). You can temporarily lower it for installation, but reset it afterward.

- **File system permissions:** Ensure the installation directory is not restricted by group policy. Contact your IT administrator if you are on a managed device.

- **Disk space full:** Check that you have at least 500 MB of free disk space. The binary itself is approximately 50-200 MB, plus space for the SQLite database and AI model.

### 2.4 Installation Path Issues

**Symptoms:** Installation succeeds but the application does not appear in the Start Menu or cannot be found.

**Solutions:**
- **Default path:** Libern installs to `%ProgramFiles%\Libern` by default
- **Portable mode:** You can also run the binary directly from any folder without installation. Download the portable ZIP and extract to any location.
- **Add to PATH:** Add the Libern directory to your PATH environment variable for command-line access.

### 2.5 Windows Installation Troubleshooting Table

| Issue | Likely Cause | Solution |
|-------|-------------|----------|
| Installer doesn't open | SmartScreen blocked | Right-click → Properties → Unblock |
| "Windows protected your PC" | No publisher reputation | Click "More info" → "Run anyway" |
| MSI error 1603 | Installation failure | Check logs in %TEMP%\Libern*.log |
| Missing DLL error | VC++ Redistributable | Install from Microsoft.com |
| "Entry point not found" | Windows version too old | Update to Windows 10+ |
| App closes immediately | WebView2 missing | Install WebView2 Runtime |

---

## 3. macOS Installation Issues

### 3.1 "Libern is damaged and cannot be opened"

**Symptoms:** macOS displays a warning that the application is damaged or cannot be verified.

**Causes and Solutions:**

- **Gatekeeper blocking:** This is macOS's security system preventing unsigned applications from running. Libern is not signed with an Apple Developer ID (the project is currently self-signed). To run:
  1. Open System Settings > Privacy & Security > Security
  2. Look for a message about Libern being blocked
  3. Click "Open Anyway"
  4. Alternatively, right-click (or Ctrl+click) the app and select Open

- **Quarantine attribute set:** If the file was downloaded via a browser, macOS sets a quarantine flag. Remove it with:
  ```
  xattr -d com.apple.quarantine /Applications/Libern.app
  ```

- **Corrupted download:** Re-download the binary and verify the checksum.

### 3.2 "The application cannot be opened" — Apple Silicon

**Symptoms:** Error on Apple Silicon (M1/M2/M3/M4) Macs.

**Causes and Solutions:**

- **Rosetta 2 needed (x64 build):** If you downloaded the x64 build, install Rosetta 2:
  ```
  softwareupdate --install-rosetta
  ```

- **Native ARM build available:** Download the ARM64 build for native performance on Apple Silicon.

- **Architecture mismatch:** Verify you downloaded the correct architecture. Check with:
  ```
  file /Applications/Libern.app/Contents/MacOS/libern
  ```

### 3.3 Permission Denied on Launch

**Symptoms:** Terminal says "Permission denied" when trying to run the binary.

**Solutions:**
```
chmod +x /Applications/Libern.app/Contents/MacOS/libern
```

---

## 4. Linux Installation Issues

### 4.1 Missing Library Dependencies

**Symptoms:** Error about missing shared libraries when launching.

**Common Missing Libraries and Solutions:**

- **libwebkit2gtk-4.1:** Required for the UI. Install via your package manager:
  - Ubuntu/Debian: `sudo apt install libwebkit2gtk-4.1-dev`
  - Fedora: `sudo dnf install webkit2gtk4.1-devel`
  - Arch: `sudo pacman -S webkit2gtk-4.1`

- **libxdo / libxkbcommon:** Required for keyboard input handling:
  - Ubuntu/Debian: `sudo apt install libxdo-dev libxkbcommon-dev`
  - Fedora: `sudo dnf install libxdo-devel libxkbcommon-devel`

- **OpenSSL:** Required for cryptographic operations:
  - Ubuntu/Debian: `sudo apt install libssl-dev`
  - Fedora: `sudo dnf install openssl-devel`

- **Check all dependencies:**
  ```
  ldd /path/to/libern | grep "not found"
  ```

### 4.2 AppImage Issues

**Symptoms:** AppImage fails to mount or launch.

**Solutions:**

- **FUSE not installed:** AppImages require FUSE:
  - Ubuntu/Debian: `sudo apt install fuse libfuse2`
  - Fedora: `sudo dnf install fuse`
  - Arch: `sudo pacman -S fuse2`

- **AppImage not executable:**
  ```
  chmod +x Libern-*.AppImage
  ```

- **FUSE 3 compatibility:** On newer distributions with FUSE 3, you may need libfuse2 compatibility.

### 4.3 Permission Denied on /opt or /usr/local

**Symptoms:** Cannot install to system directories without sudo.

**Solutions:**
- Run the binary directly from your home directory (no installation needed)
- Install to `~/.local/bin` and add it to your PATH
- Use the portable tarball instead of the system installer

### 4.4 Linux Dependency Quick Reference

| Distribution | Command |
|-------------|---------|
| Ubuntu/Debian | `sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev libssl-dev` |
| Fedora | `sudo dnf install webkit2gtk4.1-devel gtk3-devel libappindicator-gtk3-devel librsvg2-devel openssl-devel` |
| Arch | `sudo pacman -S webkit2gtk-4.1 gtk3 libappindicator-gtk3 librsvg openssl` |
| openSUSE | `sudo zypper install webkit2gtk-4.1-devel gtk3-devel libappindicator3-devel librsvg-devel libopenssl-devel` |

---

## 5. Cross-Platform Issues

### 5.1 Antivirus False Positives

Some antivirus software may flag Libern as a false positive because it is a new binary without an established reputation.

**Solutions:**
- Submit the binary to your antivirus vendor as a false positive
- Add an exclusion rule for the Libern directory
- Verify the binary's checksum against the official release
- Build from source if you are concerned about binary integrity

### 5.2 Network Firewall Blocking

**Symptoms:** Libern installs but cannot discover peers.

**Solutions:**
- Allow Libern through the firewall (see connection-problems.md)
- For Windows: Windows Defender Firewall may prompt for network access
- For macOS: System Preferences > Security & Privacy > Firewall > Add Libern
- For Linux: `sudo ufw allow 42069/udp` (default Libern discovery port)

### 5.3 Insufficient Disk Space

Libern requires approximately:
- Application binary: 50-200 MB
- AI model (optional): 500 MB - 2 GB
- SQLite database: Variable (grows with usage)
- .aioss ledger exports: Variable

**Check available space:**
- Windows: `fsutil volume diskfree C:`
- macOS/Linux: `df -h ~`

### 5.4 Unicode Path Characters

On some Windows configurations, Libern may have issues with Unicode characters in the installation path. Install to a path with only ASCII characters if you encounter this issue.

---

## 6. Building from Source

If pre-built binaries are not available for your platform or architecture:

### 6.1 Prerequisites
- Rust toolchain (nightly may be required)
- Node.js and npm (for frontend assets)
- Platform-specific build dependencies

### 6.2 Build Steps
```
git clone https://github.com/libern/libern
cd libern
cargo build --release
```

### 6.3 Common Build Errors

- **Missing C linker:** Install your platform's C compiler (build-essential on Linux, Xcode Command Line Tools on macOS, MSVC Build Tools on Windows)
- **Rust version too old:** `rustup update`
- **Out of memory during compilation:** `RUSTFLAGS="-C link-args=-Wl,--no-keep-memory"` or increase swap space

---

## 7. Verifying Installation

After installation, verify Libern is working:

1. Launch the application
2. You should see the Libern welcome screen
3. Check the About dialog for the correct version
4. The application should create a data directory automatically:
   - Windows: `%APPDATA%\Libern`
   - macOS: `~/Library/Application Support/Libern`
   - Linux: `~/.local/share/libern`

### Verification Checklist

```
☐ Libern binary exists at the expected location
☐ Application launches without error
☐ Welcome screen is displayed
☐ About dialog shows correct version
☐ Data directory is created
☐ `libern.db` exists in data directory
☐ Default server channels are created (if onboarding completed)
```

---

## 8. Post-Installation Checks

### Check Libern Version

```bash
libern --version
```

### Check Database Integrity

```bash
libern --check-db
```

### Run Full Diagnostics

```bash
libern --diagnose
```

### Common Post-Install Issues

| Issue | Solution |
|-------|----------|
| App runs but UI is blank | Check WebView2, try `--disable-gpu` |
| App runs but no sound | Check audio device permissions |
| App runs but no AI | Download model or use MockEngine |
| App runs but no peers | Check firewall, ensure on same LAN |

---

## 9. Getting Help

If you still encounter issues after trying the solutions above, please collect the following information and open a GitHub issue:

- Operating system and version
- Libern version (from the About dialog or `libern --version`)
- Installation method (direct download, package manager, built from source)
- Full error message text or screenshot
- Logs from `~/.local/share/libern/logs` (Linux) or equivalent path
- Output of `libern --diagnose`

---

## Installation Log Locations

### Windows Installer Logs

The Windows installer (WiX) generates installation logs:

```
%TEMP%\Libern-*.log
%TEMP%\MSI*.log
```

To capture detailed installation logs:
```powershell
msiexec /i Libern-Setup-x64.msi /l*vx %TEMP%\libern-install.log
```

### Runtime Logs

Libern prints diagnostic information to stdout/stderr:

```bash
# Windows (PowerShell)
.\Libern.exe 2>&1 | Out-File -FilePath libern.log

# macOS/Linux
./libern 2>&1 | tee libern.log
```

---

## Installation Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| 0 | Success | — |
| 1601 | Installer service unavailable | Start Windows Installer service |
| 1602 | Installation canceled | Run installer again |
| 1603 | Fatal error during installation | Check logs, re-download |
| 1605 | Uninstall pending | Reboot and retry |
| 1618 | Another installation in progress | Wait, try again |
| 1620 | Source file not found | Re-download installer |
| 1641 | Reboot required | Reboot and continue |
| 3010 | Reboot required (exit code) | Reboot |

---

## Package Manager Installation

### winget (Windows)

```powershell
# Search
winget search libern

# Install
winget install libern

# Uninstall
winget uninstall libern
```

### Chocolatey (Windows)

```powershell
# Install
choco install libern

# Upgrade
choco upgrade libern

# Uninstall
choco uninstall libern
```

### Homebrew (macOS)

```bash
# Install
brew install libern

# Upgrade
brew upgrade libern

# Uninstall
brew uninstall libern
```

### Linux Package Managers

```bash
# Snap (if available)
snap install libern

# Flatpak (if available)
flatpak install flathub io.libern.Libern
```

---

## Security: Verifying Downloads

Always verify the integrity of downloaded files:

### SHA-256 Checksum Verification

```bash
# Windows
certutil -hashfile Libern-Setup-x64.exe SHA256

# macOS/Linux
sha256sum Libern-x.y.z.AppImage
```

Compare the output hash with the checksum published on the releases page. A matching hash confirms:
- The file was not corrupted during download
- The file has not been tampered with
- You have the authentic Libern binary

### GPG Signature Verification (Future)

Libern releases will also be signed with a GPG key:
```bash
gpg --verify Libern-Setup-x64.exe.sig Libern-Setup-x64.exe
```

---

## Post-Installation Steps

After successful installation, complete these steps:

1. **Launch Libern** and complete onboarding
2. **Create your identity** (display name)
3. **Create or join a server**
4. **Test messaging** (send a test message)
5. **Download AI model** (optional, for AI features)
6. **Check Settings** → Adjust preferences
7. **Invite peers** (share invite code)

### First Launch Checklist

```
☐ Libern launches without errors
☐ Welcome screen displayed
☐ Identity created successfully
☐ Server created or joined
☐ Can send and receive messages
☐ AI status check (MockEngine or real model)
☐ Database file exists in app data directory
☐ Version matches expected release version
```

---

## Platform-Specific Known Issues

### Windows Known Issues

| Issue | Workaround | Status |
|-------|-----------|--------|
| SmartScreen block on first launch | Right-click → Properties → Unblock | Will improve with signed binaries |
| Antivirus false positive | Add exclusion for Libern directory | Report to AV vendors |
| UAC prompt during install | Expected for Program Files install | By design |
| WebView2 missing | Install from Microsoft.com | Bundled in future |
| Windows N editions missing Media Player | Install Media Feature Pack | Rare edge case |

### macOS Known Issues

| Issue | Workaround | Status |
|-------|-----------|--------|
| Gatekeeper blocks unsigned app | Right-click → Open | Will get Apple Developer ID |
| "App is damaged" message | Run `xattr -d com.apple.quarantine` | Common for unsigned apps |
| Microphone permission needed on first voice | Accept permission dialog | By design |
| Apple Silicon (ARM) compatibility | Use ARM64 build or Rosetta 2 | Native ARM build available |

### Linux Known Issues

| Issue | Workaround | Status |
|-------|-----------|--------|
| AppImage needs FUSE | `sudo apt install fuse libfuse2` | Common requirement |
| Missing WebKit2GTK | Install via package manager | Must be installed separately |
| Wayland rendering issues | `GDK_BACKEND=x11 libern` | Wayland support improving |
| Audio permission on some distros | Install pulseaudio-utils | Integration varies |

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.
