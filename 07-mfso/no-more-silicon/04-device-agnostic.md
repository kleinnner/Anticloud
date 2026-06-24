<!--
     ▄▄▄   ▄▄▄  ▄▄▄  ▄▄▄▄▄▄▄▄              ▄▄▄▄      ▄▄▄▄     ▄▄▄     
    ██     ███  ███  ██▀▀▀▀▀▀            ▄█▀▀▀▀█    ██▀▀██      ██    
    ██     ████████  ██           ██     ██▄       ██    ██     ██    
    ██     ██ ██ ██  ███████   ▄▄▄██▄▄▄   ▀████▄   ██ ██ ██     ██    
  ▀▀█▄     ██ ▀▀ ██  ██        ▀▀▀██▀▀▀       ▀██  ██    ██     ▄█▀▀  
    ██     ██    ██  ██           ██     █▄▄▄▄▄█▀   ██▄▄██      ██    
    ██     ▀▀    ▀▀  ▀▀                   ▀▀▀▀▀      ▀▀▀▀       ██    
    ▀█▄▄                                                      ▄▄█▀    

MF+SO — Multi Factor+ Sign On
by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner
The Sovereign Identity & Authentication Vault
-->

# Cross-Platform — Any Device with a Browser & No Hardware Lock-In

## 1. Executive Summary

Traditional authentication solutions often lock users into specific hardware ecosystems. Hardware tokens may not work with all devices. Native apps are platform-specific. Passkeys are beginning to fragment across platform vendors (Apple, Google, Microsoft).

MF+SO breaks this pattern. As a PWA built on web standards, MF+SO works on any device with a modern browser, regardless of operating system, manufacturer, or form factor. This document details MF+SO's cross-platform capabilities and their benefits.

### 1.1 Platform Fragmentation Problem

| Platform | Native App | Passkey | Hardware Token | MF+SO PWA |
|----------|-----------|---------|---------------|-----------|
| iOS | ✓ | ✓ (Apple) | Lightning/NFC | ✓ |
| Android | ✓ | ✓ (Google) | USB-C/NFC | ✓ |
| Windows | ✗ | ✓ (Microsoft) | USB-A/C | ✓ |
| macOS | ✗ | ✓ (Apple) | USB-C | ✓ |
| Linux | ✗ | ✗ | USB-A | ✓ |
| ChromeOS | ✗ | ✓ (Google) | USB-C | ✓ |

## 2. Universal Compatibility

### 2.1 Operating Systems

| OS | Browser | MF+SO Support |
|----|---------|---------------|
| iOS 14+ | Safari | Full |
| iPadOS 14+ | Safari | Full |
| Android 8+ | Chrome | Full |
| Windows 10+ | Edge, Chrome, Firefox | Full |
| macOS 11+ | Safari, Chrome, Firefox | Full |
| Linux | Chrome, Firefox | Full |
| ChromeOS | Chrome | Full |

### 2.2 Devices

| Device Type | Example | Support |
|-------------|---------|---------|
| Phone | iPhone, Samsung Galaxy | Full |
| Tablet | iPad, Galaxy Tab | Full |
| Laptop | MacBook, ThinkPad | Full |
| Desktop | Windows PC, iMac | Full |
| Chromebook | Pixelbook, Lenovo Duet | Full |
| Smart TV (limited) | WebOS, Tizen | Basic (pairing only) |

### 2.3 Form Factors

- Touch screens (phone, tablet)
- Keyboard/mouse (desktop, laptop)
- Stylus (tablet with pen)
- Foldable displays
- External monitor setups
- Projector/ presentation mode

## 3. Hardware Independence

### 3.1 No Vendor Lock-In

| Lock-In Type | Traditional Solution | MF+SO |
|-------------|---------------------|-------|
| Platform | iOS-only app | Any browser |
| Hardware vendor | YubiKey (specific brand) | Any device |
| Ecosystem | Apple-only, Google-only | All ecosystems |
| Connector type | USB-A/C/Lightning | WebAuthn (abstracted) |

### 3.2 Seamless Device Switching

- Start using MF+SO on your phone
- Continue on your laptop (same .aioss chain)
- Access from a shared computer (with caution)
- No hardware token to carry or remember

## 4. Synchronization Across Devices

### 4.1 .aioss Chain Sync

- .aioss chain syncs between all user devices
- Credentials, settings, and configuration stay current
- Peer-to-peer sync (no cloud storage of credentials)
- E2E encrypted synchronization

### 4.2 Device Pairing

| Method | Description | Security |
|--------|-------------|----------|
| QR code | Scan on screen | High (visual verification) |
| Pairing code | Alphanumeric code | High (short-lived) |
| NFC tap | Tap devices together | High (proximity) |
| Manual entry | Type code manually | Medium (error-prone) |

## 5. Responsive Design

### 5.1 UI Adaptation

| Screen Size | Layout | Features |
|-------------|--------|----------|
| < 480px | Phone layout | Bottom navigation, single column |
| 480-768px | Tablet layout | Side panel, two columns |
| 768-1200px | Desktop layout | Full sidebar, multi-column |
| > 1200px | Wide layout | Extra panels, credential preview |

### 5.2 Input Method Adaptation

- Touch-optimized controls for phones
- Keyboard shortcuts for desktop
- Mouse/trackpad gestures
- Stylus support for tablets
- Hardware key support (FIDO2 security keys)

## 6. Enterprise Cross-Platform Benefits

### 6.1 BYOD Support

- Employees use their personal devices
- No device-type restriction
- Consistent experience across all devices
- No per-platform development cost

### 6.2 Mixed-Device Environments

In a typical enterprise:

- 40% iPhone, 30% Android, 20% Windows, 10% Mac
- MF+SO works on all of them identically
- No platform-specific training needed
- Single support knowledge base

## 7. Future-Proofing

### 7.1 New Platforms

As new platforms emerge (foldables, AR/VR, new OS entries):

- MF+SO will work if they have a browser
- No porting effort required
- No re-certification needed

### 7.2 Legacy Platform Support

- Older devices can run MF+SO on older browsers
- No forced upgrades for authentication
- Long-tail platform support

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*
