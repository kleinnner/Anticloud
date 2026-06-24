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

# Encryption in Transit — TLS, WebRTC DTLS & E2E Encryption for P2P Sync

## 1. Executive Summary

Data in transit must be protected against interception, modification, and impersonation. MF+SO employs multiple layers of encryption for all data in transit: TLS 1.3 for relay communication, DTLS 1.3 for WebRTC peer-to-peer channels, and additional end-to-end encryption for .aioss chain synchronization.

This document describes the encryption-in-transit architecture of MF+SO, including protocol choices, cipher suites, certificate management, and the end-to-end encryption layer.

### 1.1 Encryption Layers

| Layer | Protocol | Purpose |
|-------|----------|---------|
| Transport | TLS 1.3 | Client ↔ Relay server |
| Peer-to-peer | DTLS 1.3 over WebRTC | Device ↔ Device |
| End-to-end | X25519 + AES-256-GCM | .aioss chain sync |

## 2. TLS 1.3

### 2.1 TLS Configuration

| Parameter | Configuration |
|-----------|--------------|
| Minimum version | TLS 1.2 (TLS 1.3 preferred) |
| Cipher suites | TLS_AES_256_GCM_SHA384 |
| Key exchange | X25519 (ECDHE) |
| Certificate type | ECDSA P-384 |
| OCSP stapling | Enabled |
| HSTS | Enabled, max-age=31536000 |

### 2.2 TLS Handshake

```
Client                                     Server
  │                                           │
  │ ← ClientHello (supported versions,       │
  │    cipher suites, key share)              │
  │                                           │
  │ ServerHello →                            │
  │ EncryptedExtensions →                    │
  │ Certificate →                            │
  │ CertificateVerify →                      │
  │ Finished →                               │
  │                                           │
  │ Finished →                               │
  │                                           │
  │ ← Encrypted Application Data →           │
```

### 2.3 Certificate Management

- Automated certificate issuance (ACME / Let's Encrypt)
- 90-day certificate validity
- Automatic renewal with 30-day window
- Certificate transparency logging
- Pinning via Expect-CT header

## 3. WebRTC DTLS

### 3.1 DTLS Overview

WebRTC uses DTLS (Datagram Transport Layer Security) for peer-to-peer communication:

| Feature | DTLS 1.3 |
|---------|----------|
| Basis | TLS 1.3 adapted for datagrams |
| Cipher | TLS_AES_256_GCM_SHA384 |
| Key exchange | X25519 |
| Fingerprint | SHA-256 of certificate |

### 3.2 DTLS Handshake

```
Peer A (Offerer)                      Peer B (Answerer)
      │                                      │
      │ ← DTLS ClientHello                   │
      │                                      │
      │ DTLS ServerHello →                  │
      │ DTLS Certificate →                  │
      │ DTLS CertificateVerify →            │
      │ DTLS Finished →                     │
      │                                      │
      │ ← DTLS Finished                      │
      │                                      │
      │ ← Encrypted SRTP/SCTP Data →         │
```

### 3.3 WebRTC Security

- Mandatory DTLS for all peer connections
- Certificate fingerprints verified out-of-band
- SRTP key derivation from DTLS handshake
- Perfect Forward Secrecy via ephemeral keys

## 4. End-to-End Encryption

### 4.1 E2E Encryption Layer

In addition to transport encryption, MF+SO adds an E2E layer for .aioss chain sync:

| Component | Algorithm |
|-----------|-----------|
| Key exchange | X25519 (Curve25519 ECDH) |
| Symmetric encryption | AES-256-GCM |
| Key derivation | HKDF-SHA256 |
| Nonce | Random 96-bit |

### 4.2 E2E Encryption Flow

```
Device A (Sender)
1. Generate ephemeral X25519 key pair
2. ECDH with recipient's public key
3. Derive shared secret via HKDF
4. Encrypt payload with AES-256-GCM
5. Send: { ephemeral_public, ciphertext, nonce }

Device B (Recipient)
1. Receive { ephemeral_public, ciphertext, nonce }
2. ECDH with own private key + sender's ephemeral key
3. Derive same shared secret
4. Decrypt and authenticate ciphertext
```

## 5. Perfect Forward Secrecy

### 5.1 PFS Guarantee

All encryption layers provide Perfect Forward Secrecy:

| Layer | PFS Mechanism | Key Lifetime |
|-------|---------------|--------------|
| TLS 1.3 | Ephemeral X25519 key exchange | Per connection |
| DTLS 1.3 | Ephemeral X25519 key exchange | Per connection |
| E2E | Ephemeral key per message | Per message |

### 5.2 PFS Benefit

If long-term keys are compromised, past sessions remain secure because:

- Session keys are derived from ephemeral keys
- Ephemeral keys are discarded after session ends
- No persistent record of session keys

## 6. Certificate Management

### 6.1 Relay Certificates

| Field | Value |
|-------|-------|
| Issuer | Let's Encrypt / ACME CA |
| Type | ECDSA P-384 |
| Validity | 90 days |
| Renewal | Automated, 30-day window |
| Revocation | OCSP + CRL |

### 6.2 Peer Certificates

- Self-signed, ephemeral certificates
- Generated per WebRTC session
- Fingerprints verified via pairing process
- No CA dependency

## 7. Security Properties

| Property | Protection |
|----------|------------|
| Confidentiality | AES-256-GCM encryption |
| Integrity | GCM authentication tag |
| Authentication | Certificate verification |
| Replay protection | TLS/DTLS sequence numbers |
| Forward secrecy | Ephemeral key exchange |
| Downgrade protection | TLS 1.3 version negotiation |

---

*MF+SO — Multi Factor+ Sign On*
*by Lois-Kleinner & 0-1.gg · © 2026 Lois-Kleinner*
*The Sovereign Identity & Authentication Vault*
