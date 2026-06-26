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

# FIDO2/WebAuthn Standards — CTAP, Attestation & Platform Authenticators

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | MFSO-COMP-FIDO2-001 |
| **Version** | 1.0 |
| **Classification** | Internal — Confidential |
| **Effective Date** | 2026-01-01 |
| **Owner** | Core Development Team |
| **Approved By** | Lois-Kleinner, CISO |

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [FIDO2 Standard Overview](#2-fido2-standard-overview)
3. [WebAuthn (W3C)](#3-webauthn-w3c)
4. [CTAP (Client to Authenticator Protocol)](#4-ctap-client-to-authenticator-protocol)
5. [Attestation Models](#5-attestation-models)
6. [Platform Authenticators](#6-platform-authenticators)
7. [MF+SO FIDO2 Implementation](#7-mfso-fido2-implementation)
8. [Registration Flow](#8-registration-flow)
9. [Authentication Flow](#9-authentication-flow)
10. [Privacy Considerations](#10-privacy-considerations)
11. [Security Considerations](#11-security-considerations)
12. [Cross-Platform Compatibility](#12-cross-platform-compatibility)
13. [Testing and Verification](#13-testing-and-verification)
14. [Appendices](#14-appendices)

## 1. Executive Summary

FIDO2 is an open authentication standard developed by the FIDO Alliance and the World Wide Web Consortium (W3C) that enables passwordless and multi-factor authentication using public key cryptography. The FIDO2 standard encompasses two core components: the W3C WebAuthn specification and the FIDO Alliance's CTAP (Client to Authenticator Protocol).

This document provides a comprehensive overview of FIDO2/WebAuthn standards and their implementation within MF+SO. MF+SO leverages the WebAuthn API as a primary authentication mechanism, enabling users to authenticate using platform authenticators (biometrics, PIN) or external authenticators (security keys) without relying on traditional passwords.

### 1.1 FIDO2 Architecture

The FIDO2 architecture consists of three main components:

1. **Relying Party (RP)**: The service that wants to authenticate users. In MF+SO's case, this is the MF+SO client application itself, which acts as its own RP for vault access.
2. **Client**: The user agent (browser) that mediates between the RP and the authenticator. Typically the web browser.
3. **Authenticator**: The hardware or software component that generates and stores key pairs and performs cryptographic operations. Can be platform (TPM, Secure Enclave) or cross-platform (USB/NFC/BLE security key).

### 1.2 MF+SO's Use of FIDO2

MF+SO uses FIDO2/WebAuthn for:

| Use Case | Description |
|----------|-------------|
| Vault Unlock | Primary authentication to unlock the local .aioss vault |
| Key Release | Authorization to release cryptographic keys for signing |
| Multi-Device Sync | Authentication between paired MF+SO instances |
| Recovery Verification | Proof of identity during vault recovery |

## 2. FIDO2 Standard Overview

### 2.1 Core Concepts

**Public Key Cryptography**: FIDO2 uses asymmetric key pairs for authentication. The private key is stored securely on the authenticator and never leaves it. The public key is registered with the relying party.

**Challenge-Response Protocol**: Authentication uses a challenge-response mechanism. The relying party sends a challenge, the authenticator signs it with the private key, and the relying party verifies the signature with the public key.

**Origin Binding**: Credentials are scoped to a specific origin (website domain). An authenticator registered on one origin cannot be used to authenticate on a different origin (when properly implemented).

**User Verification**: FIDO2 supports user verification through:
- Knowledge factors (PIN)
- Biometric factors (fingerprint, face recognition)
- Possession factors (the authenticator itself)

**Resident Keys**: Keys stored on the authenticator (rather than on the relying party server), enabling passwordless authentication.

### 2.2 FIDO2 Assertions

The standard defines two main operations:

| Operation | Description | Key Output |
|-----------|-------------|------------|
| Registration | Creates a new credential (key pair) | Public key, credential ID, attestation |
| Authentication | Proves possession of the private key | Assertion: signature, authenticator data |

### 2.3 Protocol Stack

```
┌─────────────────────────────┐
│         WebAuthn API         │  ← W3C Specification
│  (navigator.credentials)     │
├─────────────────────────────┤
│       CTAP2 / CTAP1         │  ← FIDO Alliance Spec
│  (USB/NFC/BLE Transport)     │
├─────────────────────────────┤
│      Authenticator           │  ← Hardware/Software
│  (TPM, Secure Enclave, Key)  │
└─────────────────────────────┘
```

## 3. WebAuthn (W3C)

### 3.1 Specification Overview

WebAuthn is a W3C Recommendation (formally "Web Authentication: An API for accessing Public Key Credentials") that defines a standard web API for creating and using public key-based credentials. It is the web-facing component of FIDO2.

**Specification Status**: W3C Recommendation, Level 2 (April 2021), Level 3 in development.

**Key API Methods**:

| Method | Description |
|--------|-------------|
| `navigator.credentials.create()` | Register a new credential |
| `navigator.credentials.get()` | Authenticate with an existing credential |

### 3.2 Registration (Credential Creation)

The WebAuthn registration flow:

```
RP → Client: PublicKeyCredentialCreationOptions
Client → Authenticator: create()
Authenticator: Generates key pair, stores private key
Authenticator → Client: AttestationObject
Client → RP: PublicKeyCredential
RP: Verifies attestation, stores public key
```

**PublicKeyCredentialCreationOptions**:

```json
{
  "rp": {
    "name": "MF+SO",
    "id": "mfso.app"
  },
  "user": {
    "name": "user@example.com",
    "displayName": "User",
    "id": "base64url-user-id"
  },
  "challenge": "base64url-random-challenge",
  "pubKeyCredParams": [
    { "type": "public-key", "alg": -7 },
    { "type": "public-key", "alg": -8 },
    { "type": "public-key", "alg": -257 }
  ],
  "timeout": 60000,
  "attestation": "none",
  "authenticatorSelection": {
    "authenticatorAttachment": "platform",
    "residentKey": "required",
    "userVerification": "required"
  },
  "extensions": {
    "credProps": true
  }
}
```

**Algorithm Identifiers**:

| COSE Algorithm ID | Algorithm | Curve | MF+SO Support |
|------------------|-----------|-------|---------------|
| -7 | ES256 | P-256 | Full |
| -8 | EdDSA | Ed25519 | Full |
| -257 | RS256 | RSA 2048 | Supported |
| -35 | ES384 | P-384 | Supported |
| -36 | ES512 | P-521 | Supported |

### 3.3 Authentication (Credential Assertion)

The WebAuthn authentication flow:

```
RP → Client: PublicKeyCredentialRequestOptions
Client → Authenticator: get()
Authenticator: User verification, sign challenge
Authenticator → Client: AssertionObject
Client → RP: PublicKeyCredential (with assertion)
RP: Verify signature against stored public key
```

**PublicKeyCredentialRequestOptions**:

```json
{
  "challenge": "base64url-random-challenge",
  "timeout": 60000,
  "rpId": "mfso.app",
  "allowCredentials": [
    {
      "type": "public-key",
      "id": "base64url-credential-id"
    }
  ],
  "userVerification": "required",
  "extensions": {}
}
```

### 3.4 WebAuthn Level 2 Enhancements

| Feature | Description | MF+SO Usage |
|---------|-------------|-------------|
| Conditional Mediation | Autofill-based UI for discoverable credentials | Yes |
| Large Blob Storage | Store arbitrary data associated with credentials | Planned |
| Enterprise Attestation | Managed device attestation support | Yes |
| AppID Compatibility | Support for legacy U2F appIDs | For compatibility |
| Credential Properties Extension | `credProps` extension (rk, authenticatorDisplay) | Yes |

## 4. CTAP (Client to Authenticator Protocol)

### 4.1 CTAP Overview

CTAP defines the communication protocol between the client (browser/platform) and the authenticator (security key, platform authenticator).

**CTAP Versions**:

| Version | Status | Support |
|---------|--------|---------|
| CTAP1 (U2F) | Legacy, widely supported | Universal |
| CTAP2.0 | Current standard | Universal |
| CTAP2.1 | Latest revision | Modern authenticators |
| CTAP2.2 | In development | Future |

### 4.2 CTAP Transports

**USB**: 
- CTAP1 over HID (U2F)
- CTAP2 over HID
- Max packet size: 64 bytes

**NFC**:
- CTAP2 over NFC
- ISO-DEP frame format
- Limited bandwidth, higher latency

**BLE**:
- CTAP2 over BLE
- GATT-based communication
- Lower power, lower bandwidth
- Pairing required for encryption

### 4.3 CTAP2 Commands

| Command | Code | Description |
|---------|------|-------------|
| authenticatorMakeCredential | 0x01 | Create credential (registration) |
| authenticatorGetAssertion | 0x02 | Get assertion (authentication) |
| authenticatorGetInfo | 0x04 | Get authenticator info |
| authenticatorClientPIN | 0x06 | Client PIN operations |
| authenticatorReset | 0x07 | Reset authenticator |
| authenticatorBioEnrollment | 0x09 | Biometric enrollment |
| authenticatorCredentialManagement | 0x0A | Manage stored credentials |
| authenticatorSelection | 0x0B | User presence test |
| authenticatorLargeBlobs | 0x0C | Large blob operations |
| authenticatorConfig | 0x0D | Authenticator configuration |

### 4.4 CTAP2.1 Improvements

- **Credential management**: Enumerate and manage resident credentials
- **Bio enrollment**: On-device biometric enrollment
- **Enterprise attestation**: Device attestation for managed environments
- **AlwaysUv**: Require user verification for all operations
- **Large blobs**: Store up to 64KB of RP-associated data
- **Minimum PIN length**: Configure minimum PIN length requirements

## 5. Attestation Models

### 5.1 Attestation Overview

Attestation is the process by which an authenticator proves its identity and properties to the relying party during registration. It provides assurance about the type and security characteristics of the authenticator.

### 5.2 Attestation Types

**None Attestation**:

| Field | Value |
|-------|-------|
| Format | "none" |
| Identifier | None |
| Privacy | Maximum (no authenticator identification) |
| Security | Low (no authenticator verification) |
| Use case | Privacy-sensitive applications |

**Self Attestation**:

| Field | Value |
|-------|-------|
| Format | "self" |
| Identifier | Credential public key |
| Privacy | High (no unique identifier) |
| Security | Medium (no hardware root of trust) |
| Use case | Software authenticators |

**Basic Attestation**:

| Field | Value |
|-------|-------|
| Format | "packed", "tpm", "android-key", "apple" |
| Identifier | Manufacturer certificate |
| Privacy | Medium (batch or unique cert) |
| Security | High (hardware-backed) |
| Use case | Hardware authenticators |

**ECDA (Elliptic Curve Direct Anonymous Attestation)**:

| Field | Value |
|-------|-------|
| Format | "packed" with ECDA |
| Identifier | Anonymous credential |
| Privacy | High (unlinkable) |
| Security | High (privacy-preserving) |
| Use case | Privacy-sensitive with hardware trust |

### 5.3 Attestation Formats

| Format | Description | Verification |
|--------|-------------|--------------|
| packed | Compact CBOR-based format | PEM certificates |
| tpm | TPM-specific format | TPM manufacturer certs |
| android-key | Android Keystore attestation | Google certificate chain |
| android-safetynet | SafetyNet attestation | Google certificate chain |
| apple | Apple platform attestation | Apple certificate chain |
| fido-u2f | Legacy U2F format | U2F certificate chain |
| none | No attestation | No verification |

### 5.4 MF+SO Attestation Policy

| Attestation Type | Trust Level | MF+SO Behavior |
|-----------------|-------------|----------------|
| none | Default | Accept; no verification |
| self | Low | Accept; warning if expected hardware |
| packed (ECDAA) | Medium | Accept; verify certificate chain |
| packed (basic) | Medium | Accept; verify certificate chain |
| tpm | High | Accept; verify TPM certificate |
| android-key | High | Accept; verify Google certificate |
| apple | High | Accept; verify Apple certificate |

MF+SO uses attestation preference "none" by default for privacy but allows configuration to require specific attestation types for enterprise deployments.

## 6. Platform Authenticators

### 6.1 Platform Authenticator Types

**TPM (Trusted Platform Module)**:

| Feature | Details |
|---------|---------|
| Type | Hardware chip (dedicated or firmware) |
| Platforms | Windows, Linux, ChromeOS |
| Key storage | Hardware-bound, non-exportable |
| User verification | PIN, Windows Hello |
| FIPS certification | FIPS 140-2/3 |

**Secure Enclave (Apple)**:

| Feature | Details |
|---------|---------|
| Type | Dedicated secure coprocessor |
| Platforms | macOS, iOS, iPadOS |
| Key storage | Secure Enclave, non-exportable |
| User verification | Touch ID, Face ID, device password |
| SEP isolation | Isolated from main processor |

**StrongBox / TEE (Android)**:

| Feature | Details |
|---------|---------|
| Type | Hardware-backed keystore (TEE/StrongBox) |
| Platforms | Android 9+ |
| Key storage | Hardware-bound, non-exportable |
| User verification | Biometric, PIN, pattern |
| Security chip | Dedicated security chip (StrongBox) |

**Software Authenticator**:

| Feature | Details |
|---------|---------|
| Type | Software-based key storage |
| Platforms | All browsers with WebAuthn |
| Key storage | Browser-managed (encrypted) |
| User verification | Platform biometric or PIN |
| Portability | Key not exportable |

### 6.2 Platform Authenticator Security Characteristics

| Authenticator | Key Isolation | Anti-Cloning | User Verification | Certifications |
|--------------|---------------|--------------|-------------------|----------------|
| TPM 2.0 | Full (hardware) | Yes (unique per device) | PIN, biometric | FIPS 140-2, Common Criteria |
| Apple Secure Enclave | Full (hardware) | Yes (UID-based) | Touch ID, Face ID | FIPS 140-2 (pending) |
| Android TEE/StrongBox | Full (hardware) | Yes (hardware-bound) | Biometric, PIN | Common Criteria |
| Software (OS managed) | OS-level isolation | Limited | OS user verification | Varies by platform |

### 6.3 User Verification Methods

**Platform Biometrics**:

| Method | Platform | False Acceptance | False Rejection |
|--------|----------|-----------------|-----------------|
| Face ID | iOS | 1:1,000,000 | < 1% |
| Touch ID | iOS | 1:50,000 | < 1% |
| Windows Hello (Face) | Windows | 1:100,000 | < 1% |
| Android Biometric | Android | Varies (class 3: 1:50,000) | Varies |

**PIN**:
- Platform PINs are user-chosen numeric or alphanumeric codes
- Typically fallback when biometrics fail
- Security depends on PIN complexity (4-6 digit default, configurable)

## 7. MF+SO FIDO2 Implementation

### 7.1 Implementation Architecture

MF+SO implements FIDO2/WebAuthn at multiple levels:

```
┌──────────────────────────────────────┐
│         MF+SO Web Client             │
│  ┌────────────────────────────────┐  │
│  │  WebAuthn API Wrapper           │  │
│  │  (TypeScript)                   │  │
│  ├────────────────────────────────┤  │
│  │  Credential Manager             │  │
│  │  (Store/Retrieve Credentials)   │  │
│  ├────────────────────────────────┤  │
│  │  .aioss Chain Integration       │  │
│  │  (Link to vault entries)        │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
         ↕
┌──────────────────────────────────────┐
│      Browser WebAuthn API            │
│  (navigator.credentials.create/get)   │
└──────────────────────────────────────┘
         ↕
┌──────────────────────────────────────┐
│      Platform Authenticator          │
│  (TPM / Secure Enclave / TEE)         │
└──────────────────────────────────────┘
```

### 7.2 Credential Storage

| Storage Type | Location | Content |
|-------------|----------|---------|
| Authenticator private key | Platform authenticator | Never exported |
| Public key | .aioss chain | Credential ID, public key, algorithm |
| Credential metadata | IndexedDB | Friendly name, creation date, usage count |
| RP info | .aioss chain | Relying party configuration |

### 7.3 Credential Management

MF+SO provides a credential management interface that supports:

| Operation | Description |
|-----------|-------------|
| List credentials | Display all registered FIDO2 credentials |
| Rename credential | Assign friendly names |
| Remove credential | Delete credential from authenticator |
| Export credential metadata | Export non-sensitive credential information |
| Backup credential references | Backup credential IDs and public keys |

## 8. Registration Flow

### 8.1 MF+SO Registration Process

```
User: Initiates registration
MF+SO: Generates user ID and challenge
MF+SO: Creates PublicKeyCredentialCreationOptions
Browser: Displays authenticator selection UI
User: Selects authenticator, performs gesture
Authenticator: Creates key pair, stores private key
Authenticator: Performs user verification (biometric/PIN)
Authenticator: Generates attestation
Browser: Returns PublicKeyCredential to MF+SO
MF+SO: Verifies attestation (if requested)
MF+SO: Stores public key and credential ID in .aioss chain
MF+SO: Records credential metadata
```

### 8.2 MF+SO Registration Options

MF+SO configures WebAuthn registration with the following defaults:

| Parameter | Default Value | Options |
|-----------|---------------|---------|
| attestation | "none" | "none", "indirect", "direct", "enterprise" |
| authenticatorAttachment | "platform" | "platform", "cross-platform", undefined |
| residentKey | "required" | "discouraged", "preferred", "required" |
| userVerification | "required" | "discouraged", "preferred", "required" |
| discoverableCredentials | "required" | "discouraged", "preferred", "required" |

### 8.3 Registration Verification

```
MF+SO verifies:
1. Attestation object format
2. Client data hash validation (SHA-256)
3. Origin matching (rp.id)
4. Challenge matching
5. Credential ID uniqueness
6. Algorithm validity
7. Attestation signature (if attestation != "none")
```

## 9. Authentication Flow

### 9.1 MF+SO Authentication Process

```
User: Initiates authentication (vault unlock)
MF+SO: Generates challenge
MF+SO: Creates PublicKeyCredentialRequestOptions
Browser: Displays authenticator UI
User: Performs user verification (biometric/PIN)
Authenticator: Retrieves private key
Authenticator: Signs challenge
Authenticator: Generates assertion
Browser: Returns PublicKeyCredential to MF+SO
MF+SO: Retrieves stored public key
MF+SO: Verifies assertion signature
MF+SO: Verifies authenticator data
MF+SO: Unlocks vault
```

### 9.2 Authentication Verification

```
MF+SO verifies:
1. Credential ID matches stored credential
2. Assertion signature using stored public key
3. Client data hash matches expected
4. RP ID matches expected
5. Challenge matches issued challenge
6. Counter value (if available, monotonic)
7. User verification flag (if required)
8. Credential algorithm matches stored algorithm
```

### 9.3 User Verification Requirement

MF+SO requires user verification (UV) for all vault operations. This ensures that:

- The user is physically present
- The user has confirmed their identity (biometric or PIN)
- The authenticator has performed user verification

```typescript
// MF+SO authentication always requires user verification
const assertion = await navigator.credentials.get({
  publicKey: {
    challenge: challengeBuffer,
    rpId: "mfso.app",
    allowCredentials: allowCredentialsList,
    userVerification: "required"
  }
});
```

## 10. Privacy Considerations

### 10.1 Privacy Principles

| Principle | Implementation |
|-----------|---------------|
| Unlinkability | Different RP IDs for different contexts |
| Limited disclosure | Attestation "none" as default |
| Anonymity | No personal information in credential |
| User consent | User gesture required for each operation |
| Minimal data | Only credential ID and signature transmitted |

### 10.2 Credential Partitioning

MF+SO supports credential partitioning for different vaults:

| Vault Context | RP ID | Credential Storage |
|--------------|-------|-------------------|
| Personal vault | mfso.app | Platform authenticator |
| Enterprise vault | enterprise.example.com | Separate credential |
| Recovery vault | mfso.app/recovery | Separate credential |

### 10.3 Resident Key Privacy

Resident keys (discoverable credentials) are stored on the authenticator. MF+SO:

- Limits resident key usage to when necessary
- Provides credential management (list, remove)
- Supports non-resident keys for less sensitive operations

## 11. Security Considerations

### 11.1 Threat Model

| Threat | Impact | Mitigation |
|--------|--------|------------|
| Phishing | Credential misuse | Origin binding prevents RP confusion |
| Credential theft | Unauthorized access | Private key never leaves authenticator |
| Authenticator cloning | Credential duplication | Hardware-bound keys prevent cloning |
| Biometric bypass | Unauthorized user verification | Liveness detection, anti-spoofing |
| Side channel attacks | Key extraction | Hardware isolation, constant-time operations |
| Malware attacks | Credential interception | OS-level isolation, secure path |

### 11.2 Security Best Practices

| Practice | MF+SO Implementation |
|----------|---------------------|
| Challenge randomness | Cryptographically random 32-byte challenges |
| Challenge uniqueness | Single-use challenges |
| Challenge timeout | 60-second challenge expiration |
| Origin validation | Strict RP ID matching |
| Credential protection | Non-exportable private keys |
| User verification | Required for all operations |
| Attestation verification | Optional, configurable |
| Credential counter | Monotonic counter check (where available) |

### 11.3 Platform-Specific Security

**Windows**:
- TPM-backed key storage
- Windows Hello for user verification
- Virtualization-based security (VBS)

**macOS/iOS**:
- Secure Enclave key storage
- Touch ID / Face ID user verification
- Biometric enrollment bound to Secure Enclave

**Android**:
- TEE or StrongBox key storage
- BiometricPrompt for user verification
- Biometric class 3 (strong) recommended

**Linux**:
- TPM or software-backed storage
- PAM-based user verification
- Integrated Windows Hello (ChromeOS)

## 12. Cross-Platform Compatibility

### 12.1 Browser Support

| Browser | WebAuthn Level 1 | WebAuthn Level 2 | Platform Auth | Cross-Platform |
|---------|------------------|------------------|---------------|----------------|
| Chrome | ✓ | ✓ | ✓ | ✓ |
| Firefox | ✓ | Partial | ✓ | ✓ |
| Safari | ✓ | ✓ | ✓ | ✓ |
| Edge | ✓ | ✓ | ✓ | ✓ |
| Brave | ✓ | ✓ | ✓ | ✓ |
| Opera | ✓ | ✓ | ✓ | ✓ |

### 12.2 Platform Support

| Platform | WebAuthn API | Platform Authenticator | Conditional Mediation |
|----------|-------------|----------------------|---------------------|
| Windows 10+ | Edge, Chrome, Firefox | Windows Hello (TPM) | Edge, Chrome |
| macOS 10.14+ | Safari, Chrome, Firefox | Touch ID (Secure Enclave) | Safari |
| iOS 14.5+ | Safari | Face ID / Touch ID | Safari (16.4+) |
| Android 7+ | Chrome, Firefox | Biometric (TEE/StrongBox) | Chrome |
| Linux | Chrome, Firefox | TPM (limited) | Chrome |
| ChromeOS | Chrome | Built-in platform auth | Chrome |

### 12.3 MF+SO Cross-Device Authentication

MF+SO extends FIDO2 authentication across devices using the .aioss chain:

1. Primary device registers FIDO2 credential
2. Public key propagated via .aioss chain to secondary devices
3. Secondary device authenticates using its own platform authenticator
4. Cross-device authentication without shared secrets

## 13. Testing and Verification

### 13.1 Conformance Testing

MF+SO undergoes FIDO2 conformance testing through:

| Test | Tool | Frequency |
|------|------|-----------|
| FIDO2 Conformance Tools | FIDO Alliance tools | Per release |
| WebAuthn API testing | WPT (Web Platform Tests) | Continuous |
| Cross-browser testing | BrowserStack / Sauce Labs | Per release |
| Platform authenticator testing | Physical device inventory | Per release |

### 13.2 Security Testing

| Test | Description | Frequency |
|------|-------------|-----------|
| Attestation verification testing | Verify all attestation formats | Per release |
| Challenge replay testing | Ensure single-use challenge enforcement | Per release |
| Origin validation testing | Verify origin binding | Per release |
| Credential management testing | CRUD operations for credentials | Per release |
| Privacy analysis | Ensure no unintended information leakage | Per release |

### 13.3 FIDO Alliance Certification

| Certification | Status | Target |
|--------------|--------|--------|
| FIDO2 Server Certification | In progress | Q2 2026 |
| FIDO2 WebAuthn Certification | In progress | Q3 2026 |
| U2F Certification | Not planned | N/A |

## 14. Appendices

### Appendix A: COSE Algorithm Registry

| COSE Key | Name | Algorithm | Curve/Hash | Key Size |
|----------|------|-----------|------------|----------|
| -7 | ES256 | ECDSA w/ SHA-256 | P-256 | 32 bytes |
| -8 | EdDSA | EdDSA | Ed25519 | 32 bytes |
| -35 | ES384 | ECDSA w/ SHA-384 | P-384 | 48 bytes |
| -36 | ES512 | ECDSA w/ SHA-512 | P-521 | 66 bytes |
| -257 | RS256 | RSASSA-PKCS1-v1_5 w/ SHA-256 | RSA 2048+ | 256+ bytes |
| -258 | RS384 | RSASSA-PKCS1-v1_5 w/ SHA-384 | RSA 3072+ | 384+ bytes |
| -259 | RS512 | RSASSA-PKCS1-v1_5 w/ SHA-512 | RSA 4096+ | 512+ bytes |
| -65535 | RS1 | RSASSA-PKCS1-v1_5 w/ SHA-1 | RSA 1024+ | 128+ bytes |

### Appendix B: FIDO2 Error Codes

| Error Code | Description | MF+SO Handling |
|------------|-------------|----------------|
| NOT_ALLOWED | User canceled or denied | Show fallback options |
| INVALID_STATE | Invalid credential state | Re-registration prompt |
| CONSTRAINT_ERROR | Security constraints violated | Show error explanation |
| NOT_SUPPORTED | Operation not supported | Feature detection, upgrade prompt |
| ABORT_ERROR | Operation aborted | Retry logic |
| SECURITY_ERROR | Security error in WebAuthn | Log, report, retry |
| NETWORK_ERROR | Network error (conditional mediation) | Retry with timeout |
| UNKNOWN | Unknown error | Log, generic error message |

### Appendix C: Glossary

| Term | Definition |
|------|-----------|
| ASM | Authenticator Specific Module |
| CA | Certificate Authority |
| COSE | CBOR Object Signing and Encryption |
| CTAP | Client to Authenticator Protocol |
| ECDAA | Elliptic Curve Direct Anonymous Attestation |
| FIDO | Fast Identity Online |
| MDS | Metadata Service (FIDO) |
| PIN | Personal Identification Number |
| RP | Relying Party |
| TEE | Trusted Execution Environment |
| TPM | Trusted Platform Module |
| U2F | Universal 2nd Factor |
| UV | User Verification |
| WebAuthn | Web Authentication API |

### Appendix D: References

- WebAuthn Level 2: https://www.w3.org/TR/webauthn-2/
- FIDO2 CTAP 2.1: https://fidoalliance.org/specs/fido-v2.1-ps-20210615/
- FIDO2 Server Spec: https://fidoalliance.org/specs/fido-v2.0-ps-20150904/
- FIDO Metadata Service: https://fidoalliance.org/metadata/
- COSE Algorithms: RFC 9053
- CBOR Encoding: RFC 8949

### Appendix E: Version History

| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 0.1 | 2025-10-01 | Core Dev | Initial draft |
| 0.5 | 2025-11-15 | Core Dev | Complete implementation details |
| 1.0 | 2026-01-01 | Core Dev | First approved version |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
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
