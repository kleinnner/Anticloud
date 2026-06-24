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

# Rollback and Recovery — Safe Deployment Reversion

## Overview

Enterprise deployments must support safe rollback when a new Kazkade release introduces regressions, incompatibilities, or unexpected behavior. Kazkade's deployment architecture is designed for side-by-side version management, allowing operators to revert to a previous binary while preserving the integrity and continuity of the `.aioss` ledger.

## Side-by-Side Binary Management

Unlike overwrite-style installers, Kazkade installs each version to a version-stamped directory:

```
C:\Program Files\Kazkade\
  v1.2.3\
    bin\
      kazkade.exe
  v1.3.0\
    bin\
      kazkade.exe
  current -> v1.3.0   (symlink junction)
```

On macOS and Linux:

```
/opt/kazkade/
  v1.2.3/
    bin/kazkade
  v1.3.0/
    bin/kazkade
  current -> v1.3.0   (symlink)
```

The `current` symlink is updated only after a successful post-install verification. This means the previous version remains fully intact and functional.

## Rollback Procedure

### Step 1: Identify the Target Version

```bash
kazkade --version          # current version
kazkade versions list      # all installed versions
```

### Step 2: Switch the Symlink

```bash
# Linux / macOS
sudo ln -sfn /opt/kazkade/v1.2.3/bin/kazkade /opt/kazkade/current/bin/kazkade

# Windows (PowerShell)
Remove-Item -Path "C:\Program Files\Kazkade\current" -Force
New-Item -ItemType Junction -Path "C:\Program Files\Kazkade\current" -Target "C:\Program Files\Kazkade\v1.2.3"
```

### Step 3: Verify the Rollback

```bash
kazkade --version          # should now report v1.2.3
kazkade info --json        # verify binary hash matches the expected manifest
```

## .aioss Ledger Continuity After Rollback

A critical concern during rollback is ledger integrity. The `.aioss` ledger is forward-compatible across Kazkade versions: all versions of Kazkade v1.x share the same ledger format, hash chain algorithm (SHA3-256), and signing scheme (Ed25519).

When rolling back:

- Existing ledger entries remain valid and verifiable
- New entries written by the older version are indistinguishable in format from those written by the newer version
- The hash chain continues uninterrupted

To verify ledger continuity after a rollback:

```bash
kazkade ledger verify --ledger <path>
```

This command validates the full chain from genesis to the most recent entry, regardless of which Kazkade version wrote each entry.

## Testing Hash Chain Consistency Across Binary Versions

For compliance and audit purposes, enterprises may need to demonstrate that the hash chain remains consistent even when entries are produced by different binary versions. The following procedure validates cross-version consistency:

```bash
# Step 1: Back up the current ledger
cp -r /opt/kazkade/v1.3.0/ledger /opt/kazkade/ledger-backup

# Step 2: Run a benchmark with the new version
/opt/kazkade/v1.3.0/bin/kazkade benchmark --suite quick

# Step 3: Roll back
sudo ln -sfn /opt/kazkade/v1.2.3 /opt/kazkade/current

# Step 4: Run a benchmark with the old version
/opt/kazkade/v1.2.3/bin/kazkade benchmark --suite quick

# Step 5: Verify the entire chain
kazkade ledger verify --ledger /opt/kazkade/ledger
```

The verification will walk through entries written by both v1.3.0 and v1.2.3, recompute each hash using the shared SHA3-256 implementation, and validate every Ed25519 signature.

## Automated Rollback Script

Deploy a rollback script across the fleet for rapid incident response:

```bash
#!/usr/bin/env bash
# rollback.sh — Roll back Kazkade to a specified version

set -euo pipefail

TARGET_VERSION="${1:-}"

if [ -z "$TARGET_VERSION" ]; then
  echo "Usage: $0 <version>"
  echo "Installed versions:"
  ls /opt/kazkade/ | grep ^v
  exit 1
fi

TARGET_PATH="/opt/kazkade/$TARGET_VERSION"
if [ ! -d "$TARGET_PATH" ]; then
  echo "Error: Version $TARGET_VERSION not found at $TARGET_PATH"
  exit 1
fi

echo "Rolling back to $TARGET_VERSION..."
ln -sfn "$TARGET_PATH" /opt/kazkade/current

echo "Verifying rollback..."
/opt/kazkade/current/bin/kazkade info --json

echo "Verifying ledger continuity..."
/opt/kazkade/current/bin/kazkade ledger verify

echo "Rollback to $TARGET_VERSION complete."
```

## Recovery from Corrupt Installation

If a new Kazkade installation itself is corrupt or fails verification:

```bash
# The installer does NOT update the 'current' symlink on failure.
# Simply re-point to the known-good version:
sudo ln -sfn /opt/kazkade/v1.2.3 /opt/kazkade/current

# Remove the failed installation:
rm -rf /opt/kazkade/v1.3.0

# Report the incident:
kazkade ledger write --event-type deploy-failed --payload "v1.3.0 checksum mismatch"
```

## Best Practices

- Keep at least the last two versions installed for rapid rollback
- Test rollback in a staging environment before executing on production
- Include `kazkade ledger verify` in the rollback script to automatically confirm chain integrity
- Log every rollback event to the `.aioss` ledger for audit trail completeness
- Monitor rollback frequency as a metric; frequent rollbacks may indicate CI/CD pipeline issues

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
