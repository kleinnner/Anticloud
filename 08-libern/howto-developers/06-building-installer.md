__                     ¦¦               __                                    
¦¦                     ¯¯               ¦¦                                    
¦¦            ___¦   ¦¦¦¦     ¦___      ¦¦_¦¦¦_    _¦¦¦¦_    ¦¦_¦¦¦¦  ¦¦_¦¦¦¦_
¦¦        __¦¯¯¯       ¦¦       ¯¯¯¦__  ¦¦¯  ¯¦¦  ¦¦____¦¦   ¦¦¯      ¦¦¯   ¦¦
¦¦        ¯¯¦___       ¦¦       ___¦¯¯  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯   ¦¦       ¦¦    ¦¦
¦¦______      ¯¯¯¦  ___¦¦___  ¦¯¯¯      ¦¦¦__¦¦¯  ¯¦¦____¦   ¦¦       ¦¦    ¦¦
¯¯¯¯¯¯¯¯            ¯¯¯¯¯¯¯¯            ¯¯ ¯¯¯      ¯¯¯¯¯    ¯¯       ¯¯    ¯¯

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

Document Version: 1.0.0
Category: Developer Guide
Document ID: DEV-006
Last Updated: 2026-06-19

----------------------------------------------------------------

# Building the Installer

## Introduction

Libern is distributed as platform-specific installers for Windows (MSI), macOS (DMG), and Linux (AppImage/deb). The build process uses Tauri's built-in bundler which handles compilation, resource bundling, code signing, and installer creation. This guide covers how to build installers for all platforms, the configuration options available, and how to customize the packaging process for enterprise distribution.

The build pipeline is sequential: frontend compilation (Vite) ? backend compilation (Cargo) ? resource bundling ? platform packaging. The single command `pnpm tauri build` orchestrates the entire pipeline.

By the end of this guide, you will be able to:
- Build a Windows MSI installer for enterprise deployment
- Build a macOS DMG installer for distribution
- Build Linux AppImage and deb packages
- Configure installer options including icons, metadata, and code signing
- Customize the WiX template for MSI-based installations
- Handle cross-platform packaging in CI/CD pipelines
- Troubleshoot common build and installer issues
- Verify installer integrity after build

---

## Part 1: Build System Overview

### Build Flow

The build process follows a sequential pipeline:

```
pnpm tauri build
      ¦
      ?
+-----------------+
¦ 1. Frontend      ¦  Vite builds React+TypeScript ? optimized static files
¦    Compilation   ¦  Output: apps/desktop/dist/
+-----------------+
      ¦
      ?
+-----------------+
¦ 2. Backend       ¦  Cargo compiles Rust in release mode
¦    Compilation   ¦  Output: src-tauri/target/release/libern-desktop(.exe)
+-----------------+
      ¦
      ?
+-----------------+
¦ 3. Resource      ¦  Static files, icons, resources assembled into bundle
¦    Bundling      ¦  Binary + frontend + resources = application bundle
+-----------------+
      ¦
      ?
+-----------------+
¦ 4. Platform      ¦  Platform-specific installer packaging
¦    Packaging     ¦  Windows: MSI | macOS: DMG | Linux: AppImage/deb
+-----------------+
```

### Output Locations

After a successful build, the output is organized as follows:

```
apps/desktop/src-tauri/target/release/
+-- libern-desktop.exe              # Main binary (Windows)
+-- libern-desktop                  # Main binary (macOS/Linux)
+-- bundles/
¦   +-- msi/                        # Windows Installer files
¦   ¦   +-- Libern_0.1.0_x64_en-US.msi
¦   +-- dmg/                        # macOS Disk Image files
¦   ¦   +-- Libern_0.1.0_x64.dmg
¦   +-- appimage/                   # Linux AppImage files
¦   ¦   +-- libern_0.1.0_amd64.AppImage
¦   +-- deb/                        # Linux Debian Package files
¦       +-- libern_0.1.0_amd64.deb
```

### Build Configuration

The `tauri.conf.json` at `apps/desktop/src-tauri/tauri.conf.json` controls all build settings:

```json
{
    "productName": "Libern",
    "version": "0.1.0",
    "identifier": "com.libern.app",
    "build": {
        "frontendDist": "../dist",
        "devUrl": "http://localhost:1420",
        "beforeDevCommand": "pnpm dev",
        "beforeBuildCommand": "pnpm build"
    },
    "app": {
        "windows": [
            {
                "title": "Libern",
                "width": 1280,
                "height": 800,
                "minWidth": 900,
                "minHeight": 600,
                "resizable": true,
                "fullscreen": false
            }
        ],
        "security": { "csp": null }
    },
    "bundle": {
        "active": true,
        "targets": "all",
        "icon": [
            "icons/32x32.png",
            "icons/128x128.png",
            "icons/128x128@2x.png",
            "icons/icon.icns",
            "icons/icon.ico"
        ],
        "windows": { "wix": { "language": "en-US" } },
        "macOS": { "minimumSystemVersion": "12.0" },
        "linux": { "deb": { "depends": [] } }
    }
}
```

---

## Part 2: Prerequisites

### Windows (MSI) Prerequisites

Building the Windows MSI installer requires:
- WiX Toolset v3: Download and install from `https://wixtoolset.org`. Verify with `candle.exe --version`.
- Visual Studio 2022 Build Tools: Install the "Desktop development with C++" workload via the Visual Studio Installer.
- Windows SDK: Included with Visual Studio Build Tools.
- .NET Framework 3.5: Required by WiX Toolset on some systems.

Install WiX Toolset:
```powershell
# Download WiX Toolset v3 from wixtoolset.org
# Or install via winget
winget install WiXToolset
```

Verify installation:
```powershell
candle.exe --version
# Windows Installer XML Toolset Tool Engine version 3.14.1.8722
```

### macOS (DMG) Prerequisites

Building the macOS DMG requires:
- Xcode Command Line Tools: Install with `xcode-select --install`.
- No additional packaging tools: macOS uses native `hdiutil` for DMG creation.

```bash
xcode-select --install
```

### Linux (AppImage/deb) Prerequisites

Building Linux packages requires:
- `appimagetool`: For AppImage creation. Download from the AppImageKit GitHub releases.
- `dpkg-dev`: For deb creation. Install with `sudo apt-get install dpkg-dev`.
- System development libraries: `libwebkit2gtk-4.1-dev`, `libgtk-3-dev`, `libasound2-dev`, and others.

```bash
sudo apt-get install -y appimagetool dpkg-dev
```

---

## Part 3: Building the Windows MSI Installer

### Basic MSI Build

To build a Windows MSI installer:
```bash
pnpm tauri build --bundles msi
```

This command orchestrates the full build pipeline: Vite frontend build, Cargo release compilation, and WiX-based MSI packaging.

### MSI Build Options

```bash
# Build only MSI
pnpm tauri build --bundles msi

# Build MSI with specific version
LIBN_VERSION=0.2.0 pnpm tauri build --bundles msi

# Build in debug mode
pnpm tauri build --debug --bundles msi
```

### MSI Configuration in tauri.conf.json

The Windows MSI configuration lives under `bundle.windows` in `tauri.conf.json`:

```json
{
    "bundle": {
        "windows": {
            "wix": {
                "language": "en-US",
                "template": "main.wxs",
                "allowDowngrades": true,
                "iconPath": "icons/icon.ico",
                "webviewInstallMode": {
                    "type": "downloadBootstrapper"
                }
            }
        }
    }
}
```

Key settings:
- `language`: Set to `en-US` for English installations.
- `template`: Path to a custom WiX template file (.wxs) for advanced customization.
- `allowDowngrades`: Controls whether users can install an older version over a newer one.
- `iconPath`: Path to the application icon file (.ico format, multi-resolution).
- `webviewInstallMode`: Configures WebView2 runtime installation (`downloadBootstrapper` is recommended for enterprise).

### Custom WiX Template

For advanced MSI customization, create a `main.wxs` file in the `src-tauri/` directory:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Wix xmlns="http://schemas.microsoft.com/wix/2006/wi">
    <Product Id="*" Name="Libern" Language="1033" Version="!(bind.FileVersion.MainExe)"
             Manufacturer="Lois-Kleinner and 0-1.gg" UpgradeCode="YOUR-GUID">
        <Package InstallerVersion="200" Compressed="yes" InstallScope="perMachine" />

        <MajorUpgrade DowngradeErrorMessage="A newer version of Libern is already installed."
                       AllowDowngrades="yes" />

        <Media Id="1" Cabinet="product.cab" EmbedCab="yes" />

        <!-- Installation directory -->
        <Directory Id="TARGETDIR" Name="SourceDir">
            <Directory Id="ProgramFiles64Folder">
                <Directory Id="INSTALLDIR" Name="Libern" />
            </Directory>
        </Directory>

        <!-- Start Menu shortcut -->
        <DirectoryRef Id="INSTALLDIR">
            <Component Id="ApplicationShortcut" Guid="*">
                <Shortcut Id="StartMenuShortcut"
                          Name="Libern"
                          Target="[INSTALLDIR]Libern.exe"
                          WorkingDirectory="INSTALLDIR" />
                <RemoveFolder Id="CleanupShortcut" On="uninstall" />
                <RegistryValue Root="HKCU" Key="Software\Libern"
                               Name="installed" Type="integer" Value="1" />
            </Component>
        </DirectoryRef>

        <!-- Files -->
        <Feature Id="MainFeature" Title="Libern" Level="1">
            <ComponentGroupRef Id="AppFiles" />
            <ComponentRef Id="ApplicationShortcut" />
        </Feature>
    </Product>
</Wix>
```

### Bundling Native Binaries

To bundle supporting binaries like `llama-cli.exe` for AI functionality, configure the resources section:

```json
{
    "bundle": {
        "resources": [
            "binaries/**/*"
        ]
    }
}
```

This bundles all files from the `binaries/` directory into the installer. Resources are accessible at runtime via `app.path().resource_dir()`.

### Code Signing

For production Windows builds, sign both the executable and the MSI:

```powershell
# Sign the executable with Authenticode certificate
signtool sign /fd SHA256 /a /f certificate.pfx /p password libern-desktop.exe

# Sign the MSI
signtool sign /fd SHA256 /a /f certificate.pfx /p password Libern_0.1.0_x64_en-US.msi
```

Code signing establishes trust with Windows SmartScreen and enterprise software distribution policies.

### Cross-Compilation for Windows

To build the Windows MSI on Linux or macOS for CI/CD purposes:
```bash
rustup target add x86_64-pc-windows-msvc
pnpm tauri build --target x86_64-pc-windows-msvc --bundles msi
```

Cross-compilation requires the MinGW-w64 toolchain on Linux or the MSVC toolchain on macOS (via osxcross).

---

## Part 4: Building the macOS DMG

### Basic DMG Build

To build a macOS DMG:
```bash
pnpm tauri build --bundles dmg
```

The DMG contains the `Libern.app` bundle with the application binary, frameworks, and resources.

### DMG Configuration

Configure macOS-specific options in `bundle.macOS`:

```json
{
    "bundle": {
        "macOS": {
            "minimumSystemVersion": "12.0",
            "signingIdentity": "Developer ID Application: Your Name (TEAMID)",
            "entitlements": "entitlements.plist",
            "frameworks": []
        }
    }
}
```

### Entitlements File

Create a `entitlements.plist` file in `src-tauri/`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.device.microphone</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
    <key>com.apple.security.network.server</key>
    <true/>
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>
</dict>
</plist>
```

### Code Signing and Notarization

For distribution outside the Mac App Store:

```bash
# 1. Sign the .app bundle
codesign --deep --force --verify --verbose \
    --sign "Developer ID Application: Your Name (TEAMID)" \
    --options runtime \
    path/to/Libern.app

# 2. Build the DMG
pnpm tauri build --bundles dmg

# 3. Submit to Apple's notary service
xcrun notarytool submit Libern_0.1.0_x64.dmg \
    --apple-id your@email.com \
    --team-id YOUR_TEAM_ID \
    --password @keychain:AC_PASSWORD \
    --wait

# 4. Staple the notarization ticket
xcrun stapler staple Libern_0.1.0_x64.dmg
```

Notarization is required for macOS Gatekeeper to allow users to run the application without security warnings.

### Cross-Compilation Limitation

DMG builds require macOS. Cross-compilation from Windows or Linux to produce macOS DMGs is not supported. CI/CD pipelines should use macOS runners (GitHub Actions `macos-latest`, Cirrus CI macOS, etc.) for macOS builds.

---

## Part 5: Building Linux Packages

### Basic Linux Build

Build all Linux package formats:
```bash
pnpm tauri build --bundles appimage,deb
```

### AppImage Configuration

Configure AppImage settings in `bundle.linux`:

```json
{
    "bundle": {
        "linux": {
            "icon": ["icons/32x32.png", "icons/128x128.png", "icons/256x256.png"],
            "bundleMediaFramework": false
        }
    }
}
```

Create an AppStream metadata file `libern.appdata.xml` for Linux software centers:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<component type="desktop-application">
    <id>com.libern.app</id>
    <name>Libern</name>
    <summary>Sovereign Collaborative Telecom Engine</summary>
    <description>
        <p>Libern is a sovereign, offline-first, LAN-P2P collaborative telecom engine.</p>
    </description>
    <categories>
        <category>Network</category>
        <category>Chat</category>
    </categories>
    <url type="homepage">https://libern.io</url>
    <project_license>MIT</project_license>
</component>
```

### deb Configuration

Configure deb package settings:

```json
{
    "bundle": {
        "linux": {
            "deb": {
                "depends": [
                    "libwebkit2gtk-4.1-0",
                    "libgtk-3-0",
                    "libasound2",
                    "libopus0"
                ],
                "section": "net",
                "priority": "optional"
            }
        }
    }
}
```

### Cross-Compilation for Linux

To build Linux packages on Windows or macOS:
```bash
rustup target add x86_64-unknown-linux-gnu
pnpm tauri build --target x86_64-unknown-linux-gnu --bundles appimage,deb
```

Cross-compilation requires a Linux sysroot and linker (`gcc-x86-64-linux-gnu` on Debian-based systems).

---

## Part 6: Customizing the Bundle

### Application Icons

Icons must be provided in multiple resolutions and formats:

```json
{
    "bundle": {
        "icon": [
            "icons/32x32.png",
            "icons/128x128.png",
            "icons/128x128@2x.png",
            "icons/icon.icns",
            "icons/icon.ico"
        ]
    }
}
```

Generate icons from a source 1024x1024 PNG using ImageMagick:

```bash
# Windows/macOS icons
convert source.png -resize 32x32 icons/32x32.png
convert source.png -resize 128x128 icons/128x128.png
convert source.png -resize 256x256 icons/128x128@2x.png

# Windows .ico (multi-resolution)
convert source.png -define icon:auto-resize=256,128,64,48,32,16 icons/icon.ico

# macOS .icns
convert source.png -resize 1024x1024 icons/icon.icns
```

### Resource Bundling

Additional files can be bundled with the application:

```json
{
    "bundle": {
        "resources": [
            "binaries/**/*",
            "config/default.json",
            "locales/**/*"
        ]
    }
}
```

Resources are accessed at runtime using the Tauri resource resolver API:

```rust
use tauri::Manager;

let resource_path = app.path().resource_dir()?.join("binaries/llama-cli.exe");
```

### Version Information

Update the version in three locations before building:

1. `src-tauri/Cargo.toml`:
   ```toml
   [package]
   version = "0.2.0"
   ```

2. `src-tauri/tauri.conf.json`:
   ```json
   {
       "version": "0.2.0"
   }
   ```

3. `package.json`:
   ```json
   {
       "version": "0.2.0"
   }
   ```

All three versions should match to avoid confusion in error reports and telemetry.

---

## Part 7: CI/CD Pipeline

### GitHub Actions Workflow

Set up a GitHub Actions workflow with a matrix strategy across three operating systems:

```yaml
name: Build and Release
on:
  push:
    tags: ["v*"]

jobs:
  build:
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions-rust-lang/setup-rust-toolchain@v1
      - uses: actions/setup-node@v4
        with: { node-version: "20" }

      # Install dependencies
      - name: Install pnpm
        run: npm install -g pnpm
      - name: Install dependencies
        run: pnpm install

      # Platform-specific setup
      - name: Install WiX (Windows)
        if: matrix.os == 'windows-latest'
        run: nuget install WiX -OutputDirectory wix

      - name: Install Linux deps
        if: matrix.os == 'ubuntu-latest'
        run: |
          sudo apt-get update
          sudo apt-get install -y libwebkit2gtk-4.1-dev libgtk-3-dev \
            libasound2-dev libopus-dev

      # Build
      - name: Build installer
        run: pnpm tauri build
        env:
          APPLE_SIGNING_IDENTITY: ${{ secrets.APPLE_SIGNING_IDENTITY }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
          APPLE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
          WINDOWS_CERTIFICATE: ${{ secrets.WINDOWS_CERTIFICATE }}
          WINDOWS_CERTIFICATE_PASSWORD: ${{ secrets.WINDOWS_CERTIFICATE_PASSWORD }}

      # Upload artifacts
      - uses: actions/upload-artifact@v4
        with:
          name: installer-${{ matrix.os }}
          path: apps/desktop/src-tauri/target/release/bundle/
```

### Artifact Management

Upload build artifacts using `actions/upload-artifact` for each platform. Tagged releases (`v` prefix) should trigger the build workflow and attach artifacts to the GitHub Release automatically.

```yaml
- name: Create Release
  uses: softprops/action-gh-release@v1
  if: startsWith(github.ref, 'refs/tags/')
  with:
    files: |
      apps/desktop/src-tauri/target/release/bundle/**/*
    generate_release_notes: true
```

---

## Part 8: Build Troubleshooting

### Common Build Errors

| Problem | Solution |
|---------|----------|
| WiX candle.exe not found | Install WiX Toolset v3 and add to PATH environment variable. Verify with `candle.exe --version`. |
| MSI build fails with NMAKE error | Ensure Visual Studio Build Tools are installed with the MSVC toolchain. Run from Developer Command Prompt. |
| DMG build fails on Linux | DMG builds require macOS. Use a macOS runner in CI/CD or build on a Mac development machine. |
| AppImage exceeds 4GB size limit | Exclude large files (AI models) from the AppImage. Download models on first launch instead. |
| Code signing certificate not found | Import the certificate into the system store. For CI, use environment variables with Azure Key Vault or similar. |
| Missing library on Linux | Install the required system libraries: libwebkit2gtk-4.1-dev, libgtk-3-dev, libasound2-dev, libopus-dev. |
| Resource not found at runtime | Verify the resource path in tauri.conf.json. Resources are relative to the src-tauri/ directory. |
| Build takes too long | Use `sccache` for Rust compilation caching. Split frontend and backend builds in CI. |
| Permission denied running installer | On macOS, right-click and Open for unsigned apps. On Linux, `chmod +x` the AppImage. |
| "WebView2 not found" on Windows | The MSI should include a WebView2 bootstrapper. Check `webviewInstallMode` configuration. |
| MSI installation requires admin | Set `InstallScope="perMachine"` in the WiX template for per-machine installation. |
| AppImage not running on older Linux | Build on the oldest Linux distribution you want to support (e.g., Ubuntu 20.04). |

### Platform-Specific Debugging

**Windows MSI**:
```powershell
# Test MSI installation silently
msiexec /i Libern_0.1.0_x64_en-US.msi /qn /l*v install.log

# Examine MSI contents
msiexec /a Libern_0.1.0_x64_en-US.msi /qb TARGETDIR="D:\extract"
```

**macOS DMG**:
```bash
# Verify DMG integrity
hdiutil verify Libern_0.1.0_x64.dmg

# Mount and inspect
hdiutil attach Libern_0.1.0_x64.dmg
ls /Volumes/Libern

# Extract for inspection
hdiutil convert Libern_0.1.0_x64.dmg -format UDTO -o Libern.cdr
```

**Linux AppImage**:
```bash
# Extract and inspect
./Libern_0.1.0_amd64.AppImage --appimage-extract
ls squashfs-root/

# Run with debug output
./Libern_0.1.0_amd64.AppImage --verbose
```

**Linux deb**:
```bash
# Inspect package metadata
dpkg-deb --info libern_0.1.0_amd64.deb

# Extract contents
dpkg-deb --extract libern_0.1.0_amd64.deb extracted/
```

---

## Part 9: Post-Build Verification

### Integrity Checks

After building, verify the installer integrity:

**Windows MSI**:
```powershell
msiexec /a Libern_0.1.0_x64_en-US.msi /qb TARGETDIR="D:\test-extract"
# Verify files are present
Get-ChildItem -Recurse "D:\test-extract"
```

**macOS DMG**:
```bash
hdiutil verify Libern_0.1.0_x64.dmg
```

**Linux AppImage**:
```bash
./Libern_0.1.0_amd64.AppImage --appimage-extract
```

**Linux deb**:
```bash
dpkg-deb --info libern_0.1.0_amd64.deb
```

### Checksum Generation

Generate SHA-256 checksums for release distribution:

```bash
# Windows (PowerShell)
Get-FileHash -Algorithm SHA256 *.msi *.dmg *.AppImage *.deb > SHA256SUMS

# macOS/Linux
sha256sum *.msi *.dmg *.AppImage *.deb > SHA256SUMS
```

### Verification by Users

Users can verify the download integrity:

```bash
# Windows (PowerShell)
$hash = Get-FileHash -Algorithm SHA256 .\Libern-Setup-0.1.0.exe
if ($hash.Hash -eq "expected-checksum") { "Verified!" } else { "CORRUPTED!" }

# macOS/Linux
echo "expected-checksum  Libern-0.1.0.dmg" | sha256sum --check
```

---

## Part 10: Enterprise Deployment Considerations

### Silent Installation

For enterprise deployment, support silent/unattended installation:

**Windows MSI**:
```powershell
msiexec /i Libern_0.1.0_x64_en-US.msi /qn /norestart ALLUSERS=1
```

**macOS DMG**:
```bash
# Enterprise deployment via MDM
sudo installer -pkg Libern.pkg -target /
```

**Linux deb**:
```bash
sudo dpkg -i libern_0.1.0_amd64.deb
```

### Configuration Management

Enterprise deployments can pre-configure Libern:
- Deploy the `.aioss` ledger configuration.
- Pre-populate the database with server connections.
- Set environment variables for AI model paths.
- Configure firewall rules for LAN P2P discovery.

### Update Strategy

Libern supports the following update strategies:
- **Manual download**: Users download from the releases page.
- **Side-by-side installation**: MSI allows side-by-side versions.
- **Future**: In-app update mechanism (Tauri updater plugin).

---

## Next Steps

Return to:
- **How-To Guide 01**: Setting Up Development Environment
- **How-To Guide 05**: Testing for comprehensive build verification

----------------------------------------------------------------

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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