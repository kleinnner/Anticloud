<!--
  ▄▄   ▄▄▄                      ▄▄                        ▄▄                     
  ██  ██▀                       ██                        ██                     
  ▄▄▄█  ██▄██      ▄█████▄  ████████  ██ ▄██▀    ▄█████▄   ▄███▄██   ▄████▄   █▄▄▄     
  ▄▄█▀▀▀    █████      ▀ ▄▄▄██      ▄█▀   ██▄██      ▀ ▄▄▄██  ██▀  ▀██  ██▄▄▄▄██    ▀▀▀█▄▄ 
  ▀▀█▄▄▄    ██  ██▄   ▄██▀▀▀██    ▄█▀     ██▀██▄    ▄██▀▀▀██  ██    ██  ██▀▀▀▀▀▀    ▄▄▄█▀▀ 
      ▀▀▀█  ██   ██▄  ██▄▄▄███  ▄██▄▄▄▄▄  ██  ▀█▄   ██▄▄▄███  ▀██▄▄███  ▀██▄▄▄▄█  █▀▀▀     
           ▀▀    ▀▀   ▀▀▀▀ ▀▀  ▀▀▀▀▀▀▀▀  ▀▀   ▀▀▀   ▀▀▀▀ ▀▀    ▀▀▀ ▀▀    ▀▀▀▀▀
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Enterprise Deployment Guide — Silent & Automated Fleet Installation

## Overview

Kazkade is designed for frictionless deployment across heterogeneous enterprise fleets comprising Windows, macOS, and Linux nodes. The `kazkade-installer` tool supports fully silent (unattended) installation, enabling integration with configuration management systems such as Ansible, SCCM, JAMF, Puppet, and SaltStack.

## The Kazkade Installer

The installer is a single, self-contained binary distributed via the Kazkade release portal. It supports the following flags for automated deployment:

| Flag | Purpose |
|------|---------|
| `--silent` | Suppresses all interactive prompts |
| `--install-path <path>` | Specifies a custom installation root |
| `--add-to-path` | Appends the Kazkade binary directory to the system PATH |
| `--version <ver>` | Pins a specific release version |
| `--verify` | Performs SHA3-256 checksum validation after extraction |

### Windows

```powershell
kazkade-installer.exe --silent --install-path "C:\Program Files\Kazkade" --add-to-path --verify
```

For SCCM/Intune deployment, wrap the command in a PowerShell script and deploy as a Win32 application. Use the exit code to report success: `0` indicates a clean install, `1` indicates a checksum mismatch, and `2` indicates a PATH conflict.

### macOS

```bash
sudo ./kazkade-installer --silent --install-path /opt/kazkade --add-to-path --verify
```

For JAMF Pro, deploy via a policy with a script payload. The installer respects the `$PATH` conventions of `/etc/paths.d/` on macOS, creating a `kazkade` entry for system-wide availability.

### Linux

```bash
sudo ./kazkade-installer --silent --install-path /opt/kazkade --add-to-path --verify
```

For Ansible, use the `command` or `copy` module with a conditional `creates` flag on the target binary. The installer writes a `.profile.d` snippet for bash and zsh compatibility.

## PATH Configuration

When `--add-to-path` is supplied, the installer automatically detects the user's shell and appends the Kazkade bin directory to the appropriate configuration file. On Windows, the system-level `PATH` environment variable is updated via the registry (requires administrator privileges). On macOS and Linux, the installer writes to `/etc/profile.d/kazkade.sh` or `~/.profile` as appropriate.

## Verifying Deployment

After installation, verification should be scripted as part of the provisioning pipeline. The following command confirms a successful deployment:

```bash
kazkade info --json
```

This command outputs the installed version, build hash, compiler toolchain, and the path to the `.aioss` ledger. In a CI/CD or configuration-management context, parse the JSON to assert:

- `version` matches the target release
- `build_hash` matches the signed artifact manifest
- `ledger_path` points to an existing, initialized ledger

### Exit Codes for Automation

| Code | Meaning |
|------|---------|
| 0 | Verified and operational |
| 1 | Binary not found or checksum mismatch |
| 2 | Ledger initialization failed |
| 3 | Version mismatch |

## Fleet Deployment Checklist

1. Download the installer from the Kazkade release portal into a secured internal repository
2. Distribute the installer via your configuration management tool of choice
3. Run the silent installation command with `--verify`
4. Check the exit code for success
5. Execute `kazkade info --json` as a post-install verification step
6. Register the node in your inventory with the returned build hash

## Security Considerations

- Always use `--verify` in production to guard against transport-layer corruption
- Pin a specific `--version` to prevent unvalidated upgrades
- Store the installer behind your internal artifact repository; never pull directly from the internet on production nodes
- Audit the `.aioss` ledger path after installation to ensure it resides on an encrypted volume

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
