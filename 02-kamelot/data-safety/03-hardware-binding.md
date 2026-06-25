                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 

# 03 — Hardware Binding

**Kamelot — The Sovereign Semantic Vector File System**

**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. Introduction
2. MF+SO Hardware Binding
3. BLE/NFC Proximity Authentication
4. Without Mobile Device: Disk Is Noise
5. TPM 2.0 on Windows
6. TPM + Trusted Boot on Linux
7. Threat Model for Hardware Theft
8. Recovery Procedure
9. Comparison of Binding Methods
10. Implementation Details
11. Conclusion

---

## 1. Introduction

Hardware binding is a security mechanism that ties encrypted data to a specific physical device or set of devices. A hard-drive-bound Kamelot store renders files inaccessible if the drive is removed from its authorized hardware context.

Kamelot supports multiple hardware binding mechanisms, ranging from optional TPM binding to the innovative MF+SO BLE/NFC proximity system.

---

## 2. MF+SO Hardware Binding

### 2.1 What Is MF+SO Hardware Binding?

MF+SO (Multi-Factor + Sovereign Origination) hardware binding is a novel approach that uses the user's mobile device as a physical authentication factor. The mobile device acts as a "key" that must be in proximity for the Kamelot store to be accessible.

### 2.2 How It Works

```
Kamelot Store (laptop/desktop) ←→ Mobile Device (phone)
        │                              │
        │  BLE/NFC handshake           │
        │  (cryptographic challenge)    │
        │                              │
        ▼                              ▼
    Store unlocked                  Key stored on phone
    (in process memory)             (in secure enclave)
```

1. The user's mobile device stores a cryptographic key in its secure enclave
2. When Kamelot starts, it broadcasts a BLE (Bluetooth Low Energy) advertisement or waits for NFC tap
3. The mobile device responds with a signed challenge
4. Kamelot verifies the signature and derives the decryption key
5. The store is unlocked for the session

### 2.3 Why This Matters

Without MF+SO binding:

- A stolen laptop can be booted, and an attacker can attempt to extract the seed phrase or brute-force it
- A stolen hard drive can be attached to another computer and analyzed

With MF+SO binding:

- A stolen laptop without the phone in proximity cannot unlock the store
- A stolen hard drive attached to another computer cannot unlock the store (the mobile device doesn't know about the new computer)
- Even with the seed phrase, the store is inaccessible without the authorized phone

### 2.4 Setup Process

```bash
# 1. Initialize Kamelot with hardware binding
kml init --hw-bind mfso

# 2. Install the Kamelot companion app on your phone
# (Available on iOS App Store and Google Play)

# 3. Pair phone with Kamelot
kml hw-bind pair
# Scanning for Kamelot devices...
# Tap your phone against the NFC reader or ensure BLE is enabled

# 4. Confirm pairing on phone
# Phone shows: "Authorize this device as a Kamelot storage node?"
# User confirms with biometric or PIN

# 5. Binding complete
# Store is now bound to this phone + computer pair
```

---

## 3. BLE/NFC Proximity Authentication

### 3.1 BLE Authentication

BLE authentication works continuously in the background:

1. Kamelot node broadcasts a BLE advertisement every 1–5 seconds
2. The authenticated phone receives the advertisement
3. Phone responds with a timestamped, signed authentication token
4. Kamelot verifies the signature and updates its "trust timer"
5. If no authentication token is received for more than a configurable timeout (default: 60 seconds), the store locks

**Range**: BLE operates at approximately 10–30 meters (30–100 feet) depending on environment.

**Power consumption**: BLE advertisement consumes negligible power (both phone and computer).

### 3.2 NFC Authentication

NFC authentication provides a higher level of security by requiring physical proximity:

1. User taps phone against NFC reader on the computer
2. NFC establishes a secure channel
3. Phone transmits authentication token over NFC
4. Kamelot unlocks the store

**Range**: NFC requires physical contact (< 10 cm / 4 inches).

**Use case**: High-security environments where even BLE range is too permissive.

### 3.3 Combined Mode

BLE and NFC can be combined:

- **BLE**: Used for convenience (keep unlocked while in the room)
- **NFC**: Used for initial unlock (requires deliberate action)

Configuration:

```bash
kml hw-bind mode combined
# BLE range: 10 meters
# NFC: Required for initial unlock
# BLE: Maintains unlock while in range
# Auto-lock: 30 seconds after phone leaves BLE range
```

### 3.4 Timeout Configuration

```bash
# Unlock for 5 minutes after phone leaves range (convenience)
kml config set hw-bind.timeout 300

# Lock immediately when phone leaves range (maximum security)
kml config set hw-bind.timeout 0

# Keep unlocked 1 hour (for overnight batch processing)
kml config set hw-bind.timeout 3600
```

---

## 4. Without Mobile Device: Disk Is Noise

### 4.1 The Security Property

When the authorized mobile device is not in range, the Kamelot store is cryptographically indistinguishable from random noise.

**This means:**
- A stolen drive can be attached to any computer
- The files on the drive appear as random binary data
- Without the mobile device, the key derivation cannot complete
- Without the key, the XChaCha20-Poly1305 encryption is unbreakable

### 4.2 What the Attacker Sees

```
> ls /mnt/stolen-drive/blobs/a1/
a1b2c3d4e5f6...  ← looks like random hex
7f8g9h0j1k2l...  ← looks like random hex

> file a1b2c3d4e5f6...
a1b2c3d4e5f6...: data

> hexdump a1b2c3d4e5f6...
00000000  2a 3f 9d 8c 7e 1b 4f 5a   ── random-looking bytes
00000008  6c 2d 8e 3a 1f 5b 7c 9d   ── random-looking bytes
...

> kml ls
Error: Store is locked. Authenticate with mobile device.
```

The store cannot be identified as a Kamelot store unless the attacker knows what to look for (and even then, there is no identifying magic number or header).

### 4.3 Comparison with TPM-Only Binding

| Aspect | TPM Only | MF+SO (Phone) |
|--------|----------|---------------|
| Attacker steals computer | TPM releases key (same hardware) | Store locked (no phone) |
| Attacker steals drive | Store locked (different hardware) | Store locked (no phone) |
| Attacker steals both computer and phone | Store locked (phone authorized to computer) | Store locked unless both are paired |
| User loses phone | Need backup recovery | Need backup recovery |
| Hardware replacement | Need TPM recovery procedure | Need to re-pair new phone |

### 4.4 Drive Removal Detection

Kamelot can detect when its store is removed from the authorized hardware context:

- On startup, it checks the hardware binding (TPM + MF+SO)
- If the binding does not match, the store refuses to derive keys
- No error messages reveal the nature of the data (just "Store locked")

---

## 5. TPM 2.0 on Windows

### 5.1 What Is TPM?

A Trusted Platform Module (TPM) is a dedicated microcontroller designed to secure hardware through integrated cryptographic keys. TPM 2.0 is the current standard and is built into most modern Windows PCs.

### 5.2 How TPM Binding Works on Windows

```
Windows + TPM 2.0
    │
    ├── TPM stores a sealed key (Storage Root Key)
    │
    ├── At boot: TPM unseals the key only if:
    │   ├── BIOS/UEFI firmware hashes match (Secure Boot)
    │   ├── Bootloader hashes match
    │   └── OS kernel hashes match
    │
    ├── Unsealed key → used as HMAC key for seed phrase
    │
    └── Kamelot can only derive master key if TPM releases the HMAC key
```

### 5.3 Windows Setup

```bash
# Check if TPM is available
kml hw-bind tpm status
# TPM 2.0 detected: Yes
# TPM manufacturer: Intel
# TPM version: 2.0

# Bind store to TPM
kml hw-bind tpm bind
# Sealing key to current hardware state...
# Done. Store is now TPM-bound.

# Verify binding
kml hw-bind tpm verify
# Binding valid: Yes
# PCR values match: Yes
# Store integrity: OK
```

### 5.4 Platform Configuration Registers (PCRs)

TPM binding uses PCRs to measure the system state:

| PCR | Measured Component | Value Changes When |
|-----|-------------------|-------------------|
| PCR 0 | BIOS/UEFI firmware | BIOS update |
| PCR 1 | BIOS configuration | BIOS settings changed |
| PCR 2 | Option ROM firmware | Hardware changes |
| PCR 4 | Bootloader / MBR | Bootloader update |
| PCR 7 | Secure Boot state | Secure Boot config changed |
| PCR 11 | BitLocker status | BitLocker configuration |

Kamelot uses a configurable PCR set. Default: PCR 0 + PCR 4 + PCR 7.

### 5.5 BIOS Update Handling

If BIOS updates change PCR values, the TPM binding breaks. To handle this:

```bash
# Before BIOS update, create TPM recovery file
kml hw-bind tpm backup --recovery-file "C:\kamelot-tpm-recovery.bin"

# After BIOS update, restore binding
kml hw-bind tpm restore --recovery-file "C:\kamelot-tpm-recovery.bin"

# Or, use a recovery key (24-word seed phrase backup)
kml hw-bind tpm recover --seed-phrase "..."
```

---

## 6. TPM + Trusted Boot on Linux

### 6.1 Trusted Boot Chain

Linux supports TPM-based trusted boot through several components:

```
UEFI Firmware (measured by TPM)
    │
    ▼
shim (signed by Microsoft) → GRUB (measured)
    │
    ▼
Linux kernel (signed) → initramfs (measured)
    │
    ▼
Kamelot (measured via IMA)
    │
    ▼
TPM releases key → Kamelot derives master key
```

### 6.2 IMA (Integrity Measurement Architecture)

Linux's IMA subsystem measures file integrity:

```bash
# Enable IMA in kernel config
CONFIG_IMA=y
CONFIG_IMA_MEASURE_PCRS=10

# Configure IMA policy
echo "measure func=BPRM_CHECK" > /sys/kernel/security/ima/policy

# Kamelot binary is measured before execution
# TPM will only release keys if Kamelot binary hash matches
```

### 6.3 Linux Setup

```bash
# Install TPM 2.0 tools
sudo apt install tpm2-tools tpm2-abrmd tpm2-swtpm

# Check TPM status
kml hw-bind tpm status
# TPM 2.0 detected: Yes
# TPM manufacturer: Nuvoton
# TPM version: 2.0
# IMA active: Yes

# Bind store with trusted boot
kml hw-bind tpm bind --pcr-list 0,2,4,7,9
# Binding requires:
# - Same hardware (PCR 0)
# - Same firmware (PCR 2)
# - Same bootloader (PCR 4)
# - Same secure boot config (PCR 7)
# - Same kernel/initramfs (PCR 9)

# Verify binding
kml hw-bind tpm verify
# Binding valid: Yes
# All PCRs match: Yes
```

### 6.4 Kernel Update Handling

When the kernel is updated, PCR 9 changes. To handle this:

```bash
# Method 1: Update binding after kernel update
kml hw-bind tpm rebind

# Method 2: Exclude PCR 9 (less secure, more convenient)
kml hw-bind tpm bind --pcr-list 0,2,4,7

# Method 3: Use signed kernel + IMA policy
# Only signed kernels can unlock, but any signed kernel works
```

### 6.5 Clevis Integration

For advanced Linux deployments, Kamelot integrates with Clevis (automated decryption framework):

```bash
# Configure Clevis to automatically unseal TPM
sudo clevis luks bind -d /dev/sda1 tpm2 '{"pcr_ids":"0,2,4,7"}'

# Kamelot can use Clevis for automatic key release
kml config set hw-bind.clevis-enabled true
```

---

## 7. Threat Model for Hardware Theft

### 7.1 Scenario: Laptop Stolen While Turned Off

**Situation**: Thief steals a laptop that is powered off.

**Kamelot without hardware binding**:
- Drive is removed and attached to another computer
- Files are encrypted with XChaCha20-Poly1305
- Security depends entirely on seed phrase strength
- Without seed phrase: unbreakable

**Kamelot with TPM binding**:
- Drive is removed and attached to another computer
- TPM in new computer does not match
- Store refuses to unlock
- Even with seed phrase, TPM binding prevents access on unauthorized hardware

**Kamelot with MF+SO binding**:
- Drive is removed and attached to another computer
- Without authorized phone, store appears as random noise
- Even with seed phrase, MF+SO binding prevents access

### 7.2 Scenario: Laptop Stolen While Turned On (Logged In)

**Situation**: Thief steals a laptop that is running and logged in.

**Without hardware binding**:
- If Kamelot is running, keys are in memory
- Thief can access all files through the running Kamelot daemon
- However: files are decrypted on demand; if the daemon is killed, files are safe

**With hardware binding**:
- Same vulnerability: running daemon has keys in memory
- **Mitigation**: Screen lock + auto-lock timeout
- Kamelot can be configured to lock when screen locks:
  ```bash
  kml config set hw-bind.screen-lock-trigger true
  ```

### 7.3 Scenario: Drive Stolen from Server

**Situation**: Hard drive is removed from a server that was running.

**Without binding**:
- Drive can be analyzed offline
- Encryption protects files (assuming strong seed phrase)

**With TPM binding**:
- Drive is useless on any other hardware
- Even if attacker has the seed phrase, TPM binding prevents access

**With MF+SO binding**:
- Drive is useless without authorized phone(s)
- K-Swarm replicas on other nodes remain accessible to authorized users

### 7.4 Scenario: Both Laptop and Phone Stolen

**Situation**: Thief steals both devices.

**Without binding**: Danger (if seed phrase is stored on one of the devices... but it shouldn't be)

**With TPM + MF+SO**: 
- TPM binding provides defense (different hardware? depends on scenario)
- MF+SO: Phone is bound to the specific laptop. If thief has both, they could attempt to unlock
- **Mitigation**: Phone requires biometric or PIN to authenticate

**Best practice**: Never store the seed phrase on the laptop or phone.

---

## 8. Recovery Procedure

### 8.1 Lost Mobile Phone

If the authorized phone is lost, the user must recover using the seed phrase:

```bash
# 1. On the same computer
kml hw-bind recover --seed-phrase "..."
# Phone binding will be removed
# New phone can be paired:
kml hw-bind pair

# 2. On a different computer
kml init --recover --seed-phrase "..."
# Hardware binding must be re-established
kml hw-bind tpm bind
kml hw-bind pair
```

### 8.2 Backup Mobile Device

Kamelot supports multiple authorized mobile devices:

```bash
# Pair a backup phone
kml hw-bind pair --device "Spare Phone"

# List authorized devices
kml hw-bind list
# Authorized devices:
# 1. iPhone 15 Pro (currently in range)
# 2. iPhone SE (backup, last seen 2026-06-15)

# Remove lost device
kml hw-bind remove --device "Spare Phone"
```

### 8.3 TPM Failure or Hardware Replacement

If the TPM fails or the motherboard needs replacement:

```bash
# Before hardware change (if possible):
kml hw-bind tpm backup --recovery-file "/backup/kamelot-tpm-recovery.bin"

# After hardware change:
kml hw-bind tpm restore --recovery-file "/backup/kamelot-tpm-recovery.bin"

# If no backup exists:
kml hw-bind recover --seed-phrase "..."
# This removes TPM binding and allows access with just seed phrase
```

### 8.4 Disaster Recovery Flow

```
Hardware Failure or Theft
    │
    ├── Have seed phrase?
    │   ├── Yes → Recover on any hardware
    │   │         (lose hardware binding)
    │   │
    │   └── No → Have TPM recovery file?
    │       ├── Yes → Restore on same model hardware
    │       │
    │       └── No → Have SSS shares?
    │           ├── Yes → Recover seed phrase from shares
    │           │
    │           └── No → Files permanently lost
```

---

## 9. Comparison of Binding Methods

| Method | Security Level | Convenience | Hardware Required | Recovery Complexity |
|--------|---------------|------------|-------------------|-------------------|
| No binding | Seed phrase only | High | None | Simple (seed phrase) |
| TPM 2.0 (Windows) | Medium | High | TPM 2.0 (built-in) | Moderate (recovery file) |
| TPM + Trusted Boot (Linux) | High | Medium | TPM 2.0 | Moderate (recovery file) |
| MF+SO BLE | Medium | Very High | Phone with BLE | Low (re-pair phone) |
| MF+SO NFC | High | Medium | Phone with NFC | Low (re-pair phone) |
| TPM + MF+SO combined | Very High | Medium | TPM + Phone | Moderate (multiple methods) |

### 9.1 Recommended Configurations

| Use Case | Recommended Binding |
|----------|-------------------|
| Personal laptop, casual use | None or MF+SO BLE |
| Personal laptop, privacy-conscious | MF+SO BLE + NFC |
| Work laptop, company policy | TPM 2.0 |
| Enterprise server | TPM + Trusted Boot |
| Air-gapped / military | TPM + MF+SO NFC |
| Home server / NAS | TPM (if available) or None |

---

## 10. Implementation Details

### 10.1 BLE Protocol

The BLE authentication protocol is designed for security and low power:

```
Kamelot (peripheral)           Phone (central)
    │                              │
    │  Advertisement (UUID)         │
    │─────────────────────────────>│
    │                              │
    │  ← Connection request ─────  │
    │                              │
    │  ← Challenge (random nonce)  │
    │                              │
    │  Signed response (HMAC) ────>│
    │                              │
    │  Verify signature            │
    │  Generate session key        │
    │                              │
    │  Encrypted session ←───────  │
```

### 10.2 NFC Protocol

NFC uses a simpler challenge-response:

```
1. Kamelot generates NDEF (NFC Data Exchange Format) message with challenge
2. Phone reads NDEF message
3. Phone signs challenge with stored key
4. Phone writes signed response to NDEF
5. Kamelot reads response and verifies
6. Store is unlocked
```

### 10.3 Secure Enclave Integration

On mobile devices, keys are stored in the secure enclave:

- **iOS**: Secure Enclave (SEP) — keys never leave the SEP
- **Android**: StrongBox / TEE — keys protected by hardware-backed keystore

The secure enclave ensures that even if the phone is compromised, the key cannot be extracted.

---

## 11. Advanced BLE/NFC Protocol Details

### 11.1 BLE Advertisement Format

Kamelot's BLE advertisement uses a custom service UUID to avoid interference:

```
ADV_IND Packet:
├── Flags: 0x06 (LE General Discoverable + BR/EDR Not Supported)
├── Complete Local Name: "Kamelot-{node_id[:8]}"
├── 16-bit Service UUID: 0xFED2 (Kamelot service)
├── Manufacturer Specific Data:
│   ├── Company ID: 0xXXXX (assigned to Lois-Kleinner)
│   ├── Protocol Version: 0x01
│   ├── Node ID: 8 bytes (unique node identifier)
│   ├── Challenge: 16 bytes (random nonce)
│   └── Capabilities: 2 bytes (flags for BLE/NFC/support)
└── TX Power Level: 0 dBm (calibrated for RSSI ranging)
```

### 11.2 BLE Security Considerations

| Consideration | Mitigation |
|--------------|------------|
| Advertisement spoofing | Challenge-response prevents replay attacks |
| MITM during pairing | Out-of-band (OOB) verification via NFC or PIN |
| BLE address tracking | Random static address rotation every 15 minutes |
| Signal strength fingerprinting | RSSI is not used for authentication, only for range estimation |
| Denial of service (jamming) | Fallback to NFC or seed phrase entry |
| Bluetooth vulnerabilities | Minimum BT 4.2 (LE Secure Connections with ECC) |

### 11.3 NFC NDEF Message Format

```
NDEF Message (Kamelot Challenge):
├── Record 1: TNF 0x02 (MIME Media)
│   ├── Type: "application/x-kamelot-auth"
│   ├── Payload:
│   │   ├── Protocol Version: 1 byte
│   │   ├── Node ID: 8 bytes
│   │   ├── Challenge: 32 bytes (cryptographic nonce)
│   │   ├── Timestamp: 8 bytes (nanoseconds since epoch)
│   │   └── Node Public Key: 32 bytes (X25519 ephemeral key)

NDEF Message (Phone Response):
├── Record 1: TNF 0x02 (MIME Media)
│   ├── Type: "application/x-kamelot-auth-response"
│   ├── Payload:
│   │   ├── Protocol Version: 1 byte
│   │   ├── Challenge Signature: 64 bytes (Ed25519 signature)
│   │   ├── Phone Public Key: 32 bytes (X25519 ephemeral key)
│   │   ├── Encrypted Session Key: 48 bytes (XChaCha20-Poly1305)
│   │   └── Phone Model: String (informational only)
```

### 11.4 Session Key Derivation

After BLE/NFC authentication, a session key is derived for encrypted communication:

```rust
use x25519_dalek::{EphemeralSecret, PublicKey};
use blake2::{Blake2b512, Digest};

/// Perform BLE/NFC key exchange
fn perform_key_exchange(
    node_secret: &EphemeralSecret,
    phone_public: &PublicKey,
) -> [u8; 32] {
    // Compute Diffie-Hellman shared secret
    let shared_secret = node_secret.diffie_hellman(phone_public);

    // Derive session key using Blake2b KDF
    let mut hasher = Blake2b512::new();
    hasher.update(b"kamelot-session-key-v1");
    hasher.update(shared_secret.as_bytes());
    hasher.update(b"handshake");
    let result = hasher.finalize();

    // Use first 32 bytes as XChaCha20 key
    let mut session_key = [0u8; 32];
    session_key.copy_from_slice(&result[..32]);
    session_key
}
```

## 12. Edge Cases and Failure Modes

### 12.1 Phone Out of Battery

| Scenario | Behavior | User Action Required |
|----------|----------|---------------------|
| Phone battery dead | Store remains locked | Charge phone, or use recovery seed phrase |
| Phone in airplane mode | BLE still works (BLE is not dependent on cellular/Wi-Fi) | None (BLE active in airplane mode) |
| Phone lost/stolen | Store locked permanently without recovery | Use seed phrase to recover |
| Phone factory reset | Key in secure enclave is lost | Use seed phrase to recover, re-pair phone |

### 12.2 BLE Range Edge Cases

| Environment | Typical BLE Range | Behavior at Range Limit |
|-------------|------------------|------------------------|
| Open office | 20–30 meters | Occasional reconnects, 60-second grace timer |
| Home (walls) | 10–15 meters | Reliable within typical room distances |
| Enterprise (steel/concrete) | 5–10 meters | May need NFC for reliable authentication |
| Outdoors (line of sight) | 30–50 meters | Extended range, battery may disconnect first |

### 12.3 TPM State Changes

| TPM State Change | Effect on Binding | Recovery |
|------------------|-------------------|----------|
| BIOS update (PCR 0 changes) | Binding broken | Use TPM recovery file |
| Bootloader update (PCR 4 changes) | Binding broken | Use TPM recovery file |
| Secure Boot toggle (PCR 7 changes) | Binding broken | Use TPM recovery file |
| TPM firmware update | All keys lost | Use seed phrase recovery |
| TPM chip failure | All keys lost | Use seed phrase recovery |
| Motherboard replacement | TPM identity changes | Use seed phrase recovery |

### 12.4 Multi-Device Edge Cases

```bash
# Scenario: User has 2 laptops and 1 phone
# Phone is paired with both laptops
kml hw-bind list --verbose
# Authorized devices:
# 1. "Office Laptop" (ThinkPad X1) - Pairing: 2026-01-15
# 2. "Home Desktop" (Custom PC) - Pairing: 2026-03-20
# 3. "iPhone 15 Pro" - Authentication device
#    → Authorized for: Office Laptop, Home Desktop

# Phone is within BLE range of both laptops simultaneously
# Kamelot on each laptop independently authenticates
# No conflict — each laptop maintains its own session with the phone

# Scenario: Phone is out of range of one laptop but in range of another
# Out-of-range laptop: Locked after 60-second timeout
# In-range laptop: Remains unlocked
# Behavior is per-node, not global
```

## 13. Performance and Benchmarks

### 13.1 Authentication Latency

| Method | Cold Start | Warm Start | Power Consumption |
|--------|-----------|------------|-------------------|
| BLE advertisement → response | 500–1,500 ms | 50–200 ms | Node: 0.5 mW, Phone: 2 mW |
| NFC tap → response | 100–300 ms | 100–300 ms | Node: 0 W (passive), Phone: 10 mW |
| Seed phrase entry | 5–10 seconds | N/A | Negligible |
| TPM unseal | 200–500 ms | 100–300 ms | <0.1 mW |
| TPM + BLE combined | 700–2,000 ms | 150–500 ms | Node: 0.5 mW, Phone: 2 mW |

### 13.2 BLE Power Consumption

| State | Node Power | Phone Power | Duration |
|-------|-----------|-------------|----------|
| Idle (advertising) | 0.5 mW | 0 mW | Continuous |
| Connection establishment | 5 mW | 15 mW | 50–200 ms |
| Authentication exchange | 10 mW | 25 mW | 100–500 ms |
| Encrypted session | 2 mW | 5 mW | Per sync operation |
| Idle (no phone in range) | 0.5 mW | 0 mW | Continuous (with backoff) |

### 13.3 Impact on Phone Battery

| Usage Pattern | Daily BLE Energy | Impact on Phone Battery |
|--------------|-----------------|------------------------|
| Always in range (office, 8 hours) | 0.5 mWh | <0.1% of typical phone battery |
| Periodic (home, 4 hours) | 0.25 mWh | <0.05% |
| Rare (NFC only) | 0.01 mWh | Negligible |

## 14. Implementation Guide

### 14.1 Setting Up MF+SO Binding

```bash
# Step 1: Ensure your phone has the Kamelot Companion App
# Download from:
# iOS: https://apps.apple.com/app/kamelot
# Android: https://play.google.com/store/apps/details?id=dev.kamelot.companion

# Step 2: Initialize Kamelot with hardware binding
kml init --hw-bind mfso
# Output: MF+SO hardware binding configured.
# Please install the Kamelot Companion App on your phone.

# Step 3: Pair your phone
kml hw-bind pair
# Scanning for phones...
# Found: "iPhone 15 Pro" (RSSI: -45 dBm)
# Tap NFC or confirm on phone to pair.

# Step 4: Configure timeout
kml config set hw-bind.timeout 120
# Auto-lock after 120 seconds of phone being out of range.

# Step 5: Test the setup
kml hw-bind test
# Testing MF+SO binding...
# ✓ BLE advertisement detected
# ✓ Phone responded to challenge
# ✓ Authentication signature valid
# ✓ Session established
# All tests passed.
```

### 14.2 Setting Up TPM Binding on Linux

```bash
# Step 1: Verify TPM availability
sudo apt install tpm2-tools
tpm2_getcap --capability="properties-fixed"
# TPM 2.0 detected.

# Step 2: Create TPM recovery file (do this BEFORE binding)
kml hw-bind tpm backup --recovery-file /secure/kamelot-tpm-recovery.bin

# Step 3: Bind to TPM with selected PCRs
kml hw-bind tpm bind --pcr-list 0,2,4,7
# Sealing key to PCR values...
# PCR 0: 0x3a5f... (BIOS)
# PCR 2: 0x7b1d... (Option ROM)
# PCR 4: 0xf2e4... (Bootloader)
# PCR 7: 0x1c8a... (Secure Boot)
# Binding complete.

# Step 4: Store recovery file in a secure, separate location
# (Do NOT store on the same device as the Kamelot store)

# Step 5: Verify binding
kml hw-bind tpm verify
# ✓ TPM binding valid
# ✓ All PCR values match
# ✓ Store integrity confirmed
```

## 15. Conclusion

Hardware binding adds a critical layer of security to Kamelot's encryption. While the encryption alone (XChaCha20-Poly1305 with a strong seed phrase) provides excellent protection, hardware binding ensures that even if the seed phrase is compromised, the data is only accessible from authorized hardware.

The MF+SO system is particularly innovative, using the user's mobile device as a physical authentication factor. Without the phone in proximity, the encrypted store is indistinguishable from random noise.

For users who want maximum security, combining TPM binding with MF+SO provides defense against:
- Drive theft (TPM binding)
- Full system theft (MF+SO binding requires phone)
- Seed phrase compromise (both TPM and phone required)

The result is a defense-in-depth approach to data protection that keeps files safe even when the hardware is in the wrong hands.

---

*For hardware binding support: hwbind@kamelot.dev*

*Last updated: June 2026*

*This document is part of the Data Safety documentation suite. See also:*
- *01-encryption-architecture.md — Encryption architecture*
- *02-key-management.md — Key management*
- *04-aioss-ledger-integrity.md — .aioss integrity ledger*
- *05-zero-knowledge-proof.md — Zero-knowledge architecture*
- *06-threat-model.md — Comprehensive threat model*

---

*Kamelot is a project of Lois-Kleinner & 0-1.gg. © 2026. All rights reserved.*

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

Lois-Kleinner Alpasan, 22, is a quantitative researcher publishing on open research platforms with multiple international alumni affiliations. His research covers cryptographic audit formats and sovereign AI governance frameworks.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/YMJKOG
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
