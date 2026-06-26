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

# Common Error Codes

> **Last Updated:** 2026-06-19
> **Category:** Troubleshooting

## Error Code Format

MF+SO errors follow this format:
```
MFSO-[Category]-[Number]: [Error Message]
```

Example: `MFSO-AUTH-0421: Invalid master password`

## Error Categories

| Category | Code Range | Description |
|---|---|---|
| AUTH | 4000-4999 | Authentication errors |
| VAULT | 5000-5999 | Vault/storage errors |
| SYNC | 6000-6999 | Sync errors |
| NET | 7000-7999 | Network errors |
| CRYPTO | 8000-8999 | Cryptography errors |
| FIDO | 9000-9999 | FIDO2/WebAuthn errors |
| IDP | 10000-10999 | IdP errors (Enterprise) |
| ZTNA | 11000-11999 | ZTNA errors (Enterprise) |
| API | 12000-12999 | API errors |
| DEVICE | 13000-13999 | Device errors |
| BACKUP | 14000-14999 | Backup/restore errors |
| GENERAL | 9000-9999 | General errors |

## Authentication Errors (AUTH)

### MFSO-AUTH-0401: Invalid master password

| Field | Value |
|---|---|
| **Code** | MFSO-AUTH-0401 |
| **Message** | Invalid master password |
| **Cause** | Wrong master password entered |
| **Solution** | Re-enter correct password. If forgotten, use seed phrase recovery |
| **Retry limit** | 10 attempts before account lockout (5 minutes) |

### MFSO-AUTH-0402: Account locked

| Field | Value |
|---|---|
| **Code** | MFSO-AUTH-0402 |
| **Message** | Account temporarily locked due to too many failed attempts |
| **Cause** | 10 consecutive incorrect master password attempts |
| **Solution** | Wait 5 minutes. Use biometric unlock if enrolled |
| **Permanent lock** | After 20 total failed attempts, vault is wiped (configurable) |

### MFSO-AUTH-0403: Biometric authentication failed

| Field | Value |
|---|---|
| **Code** | MFSO-AUTH-0403 |
| **Message** | Biometric authentication failed |
| **Cause** | Fingerprint/face not recognized or biometric sensor issue |
| **Solution** | Clean sensor, reposition finger/face, or enter master password instead |
| **Fallback** | Master password after 5 biometric failures |

### MFSO-AUTH-0404: Session expired

| Field | Value |
|---|---|
| **Code** | MFSO-AUTH-0404 |
| **Message** | Session has expired, please re-authenticate |
| **Cause** | Session timeout exceeded (default: 8 hours) |
| **Solution** | Re-enter master password or authenticate with biometric |

### MFSO-AUTH-0405: MFA required for this action

| Field | Value |
|---|---|
| **Code** | MFSO-AUTH-0405 |
| **Message** | Multi-factor authentication required |
| **Cause** | Action requires additional verification (e.g., export, delete vault) |
| **Solution** | Complete MFA challenge (TOTP, FIDO2, push) |

## Vault Errors (VAULT)

### MFSO-VAULT-0501: Vault not found

| Field | Value |
|---|---|
| **Code** | MFSO-VAULT-0501 |
| **Message** | Vault database not found |
| **Cause** | Vault has not been created yet, or database file is missing |
| **Solution** | Create a new vault or restore from backup |
| **Data loss?** | No — vault creation will set up a fresh vault |

### MFSO-VAULT-0502: Vault corrupted

| Field | Value |
|---|---|
| **Code** | MFSO-VAULT-0502 |
| **Message** | Vault database is corrupted and cannot be opened |
| **Cause** | Storage error, device crash, or low storage corruption |
| **Solution** | MF+SO will attempt auto-repair. If unsuccessful, restore from backup |
| **Prevention** | Ensure 1 GB+ free storage, enable cloud backups |

### MFSO-VAULT-0503: Vault decryption failed

| Field | Value |
|---|---|
| **Code** | MFSO-VAULT-0503 |
| **Message** | Failed to decrypt vault data |
| **Cause** | Wrong master password, corrupted data, or key mismatch |
| **Solution** | Verify master password. If correct, try restoring from backup |

### MFSO-VAULT-0504: Storage full

| Field | Value |
|---|---|
| **Code** | MFSO-VAULT-0504 |
| **Message** | Insufficient storage to complete operation |
| **Cause** | Device storage is below minimum threshold |
| **Solution** | Free up storage (delete unused apps, photos, etc.) |

## Sync Errors (SYNC)

### MFSO-SYNC-0601: Sync authentication failed

| Field | Value |
|---|---|
| **Code** | MFSO-SYNC-0601 |
| **Message** | Sync authentication failed — please sign in again |
| **Cause** | Sync token expired or revoked |
| **Solution** | Sign out and sign back in to MF+SO account |

### MFSO-SYNC-0602: Sync quota exceeded

| Field | Value |
|---|---|
| **Code** | MFSO-SYNC-0602 |
| **Message** | Device limit reached for your plan |
| **Cause** | Free tier limited to 2 devices; Premium: unlimited |
| **Solution** | Upgrade to Premium or disconnect an unused device |

### MFSO-SYNC-0603: Sync conflict

| Field | Value |
|---|---|
| **Code** | MFSO-SYNC-0603 |
| **Message** | Sync conflict detected — automatic resolution applied |
| **Cause** | Same entry edited on multiple devices | See Logging guide for details |
| **Solution** | Verify resolved version is correct; re-edit if needed |

### MFSO-SYNC-0604: Sync throttled

| Field | Value |
|---|---|
| **Code** | MFSO-SYNC-0604 |
| **Message** | Sync requests are being throttled — try again later |
| **Cause** | Too many sync requests in a short period |
| **Solution** | Wait 60 seconds before syncing again |

## Network Errors (NET)

### MFSO-NET-0701: Connection timeout

| Field | Value |
|---|---|
| **Code** | MFSO-NET-0701 |
| **Message** | Connection timed out |
| **Cause** | Server not reachable within time limit |
| **Solution** | Check internet connection, try again later. Check status.mfso.io |

### MFSO-NET-0702: DNS resolution failed

| Field | Value |
|---|---|
| **Code** | MFSO-NET-0702 |
| **Message** | DNS resolution failed for {hostname} |
| **Cause** | DNS server cannot resolve MF+SO hostname |
| **Solution** | Check DNS configuration, try 1.1.1.1 or 8.8.8.8 |

### MFSO-NET-0703: TLS handshake failed

| Field | Value |
|---|---|
| **Code** | MFSO-NET-0703 |
| **Message** | TLS handshake failed — certificate verification error |
| **Cause** | Expired certificate, MITM proxy, or incorrect system time |
| **Solution** | Check system date/time. If behind corporate proxy, add certificate exception |

### MFSO-NET-0704: Proxy authentication required

| Field | Value |
|---|---|
| **Code** | MFSO-NET-0704 |
| **Message** | Proxy requires authentication |
| **Cause** | Corporate proxy needs credentials |
| **Solution** | Configure proxy in Settings > Network |

## Cryptography Errors (CRYPTO)

### MFSO-CRYPTO-0801: Key derivation failed

| Field | Value |
|---|---|
| **Code** | MFSO-CRYPTO-0801 |
| **Message** | Key derivation from master password failed |
| **Cause** | Incorrect Argon2id parameters or corrupted salt |
| **Solution** | Restore from backup and re-create vault. Contact support if persistent |

### MFSO-CRYPTO-0802: HMAC verification failed

| Field | Value |
|---|---|
| **Code** | MFSO-CRYPTO-0802 |
| **Message** | HMAC verification failed — data integrity compromised |
| **Cause** | Data corruption or tampering detected |
| **Solution** | Restore from backup. If persistent, device may have hardware issues |

### MFSO-CRYPTO-0803: Secure enclave unavailable

| Field | Value |
|---|---|
| **Code** | MFSO-CRYPTO-0803 |
| **Message** | Secure enclave/TPM not available on this device |
| **Cause** | Device does not have hardware security module, or it's disabled |
| **Solution** | Enable TPM in BIOS/UEFI (desktop). MF+SO works in software-only fallback mode |

### MFSO-CRYPTO-0804: Key attestation failed

| Field | Value |
|---|---|
| **Code** | MFSO-CRYPTO-0804 |
| **Message** | Device attestation failed — device may be compromised |
| **Cause** | Keys do not match expected device identity (root detection) |
| **Solution** | If device is legitimate, re-attest. If compromised, restore from backup on trusted device |

## FIDO2 Errors (FIDO)

### MFSO-FIDO-0901: FIDO2 credential creation failed

| Field | Value |
|---|---|
| **Code** | MFSO-FIDO-0901 |
| **Message** | Failed to create FIDO2 credential |
| **Cause** | Secure enclave error, or FIDO2 not available on this device |
| **Solution** | Ensure device supports FIDO2. Try using a hardware security key instead |

### MFSO-FIDO-0902: FIDO2 assertion failed

| Field | Value |
|---|---|
| **Code** | MFSO-FIDO-0902 |
| **Message** | FIDO2 authentication assertion failed |
| **Cause** | Challenge not signed correctly, or credential not found |
| **Solution** | Verify credential exists, try re-registering with the service |

### MFSO-FIDO-0903: No compatible authenticator

| Field | Value |
|---|---|
| **Code** | MFSO-FIDO-0903 |
| **Message** | No compatible FIDO2 authenticator available |
| **Cause** | This device does not support FIDO2 platform authenticator |
| **Solution** | Use an external FIDO2 security key (YubiKey, Google Titan) |

## Enterprise Errors (IDP, ZTNA, API)

### MFSO-IDP-10001: SAML assertion generation failed

| Field | Value |
|---|---|
| **Code** | MFSO-IDP-10001 |
| **Message** | Failed to generate SAML assertion |
| **Cause** | Invalid configuration, missing attributes, or signing key unavailable |
| **Solution** | Check IdP configuration, verify signing certificate |

### MFSO-IDP-10002: OIDC token validation failed

| Field | Value |
|---|---|
| **Code** | MFSO-IDP-10002 |
| **Message** | OpenID Connect token validation failed |
| **Cause** | Invalid token signature, expired token, or wrong issuer |
| **Solution** | Verify client configuration, check token expiry |

### MFSO-ZTNA-11001: WireGuard tunnel setup failed

| Field | Value |
|---|---|
| **Code** | MFSO-ZTNA-11001 |
| **Message** | WireGuard tunnel establishment failed |
| **Cause** | NAT traversal issue, firewall blocking UDP 51820 |
| **Solution** | Open UDP port 51820 on firewall. Enable relay server if NAT is restrictive |

### MFSO-ZTNA-11002: Device posture check failed

| Field | Value |
|---|---|
| **Code** | MFSO-ZTNA-11002 |
| **Message** | Device did not pass posture requirements |
| **Cause** | Device is missing required security controls (disk encryption, EDR, patches) |
| **Solution** | Install required security software, update OS, enable disk encryption |

### MFSO-API-12001: API rate limit exceeded

| Field | Value |
|---|---|
| **Code** | MFSO-API-12001 |
| **Message** | API rate limit exceeded. Try again in {retry_after} seconds |
| **Cause** | Too many API requests in the window |
| **Solution** | Implement exponential backoff, or request rate limit increase |

### MFSO-API-12002: API authentication required

| Field | Value |
|---|---|
| **Code** | MFSO-API-12002 |
| **Message** | API key or Bearer token is missing or invalid |
| **Cause** | Missing or invalid Authorization header |
| **Solution** | Include valid API key in header: `Authorization: Bearer {token}` |

## Device Errors (DEVICE)

### MFSO-DEVICE-13001: Device not registered

| Field | Value |
|---|---|
| **Code** | MFSO-DEVICE-13001 |
| **Message** | Device is not registered with your account |
| **Cause** | Device not enrolled in sync or enterprise device management |
| **Solution** | Register device in Settings > Sync > Register Device |

### MFSO-DEVICE-13002: Device remote wiped

| Field | Value |
|---|---|
| **Code** | MFSO-DEVICE-13002 |
| **Message** | This device has been remotely wiped by an administrator |
| **Cause** | Enterprise admin or user initiated remote wipe |
| **Solution** | If unintentional, contact your administrator. Restore from backup |

## Backup Errors (BACKUP)

### MFSO-BACKUP-14001: Backup creation failed

| Field | Value |
|---|---|
| **Code** | MFSO-BACKUP-14001 |
| **Message** | Failed to create backup |
| **Cause** | Storage full, permission denied, or encryption error |
| **Solution** | Free storage, grant permissions, or check backup passphrase |

### MFSO-BACKUP-14002: Backup restoration failed

| Field | Value |
|---|---|
| **Code** | MFSO-BACKUP-14002 |
| **Message** | Failed to restore from backup |
| **Cause** | Corrupted backup, wrong passphrase, or version incompatibility |
| **Solution** | Verify passphrase, try different backup file, or use seed phrase |

### MFSO-BACKUP-14003: Backup encryption mismatch

| Field | Value |
|---|---|
| **Code** | MFSO-BACKUP-14003 |
| **Message** | Backup encryption key does not match — wrong passphrase |
| **Cause** | Incorrect backup passphrase entered |
| **Solution** | Re-enter the correct backup passphrase. This is different from your master password |

## General Errors (GENERAL)

### MFSO-GENERAL-9001: Unknown error

| Field | Value |
|---|---|
| **Code** | MFSO-GENERAL-9001 |
| **Message** | An unknown error occurred |
| **Cause** | Unexpected condition not covered by specific error codes |
| **Solution** | Restart app. If persistent, report with debug logs |

### MFSO-GENERAL-9002: Feature not available

| Field | Value |
|---|---|
| **Code** | MFSO-GENERAL-9002 |
| **Message** | This feature is not available on your current plan |
| **Cause** | Feature requires Premium or Enterprise subscription |
| **Solution** | Upgrade to Premium or Enterprise. See mfso.io/pricing |

### MFSO-GENERAL-9003: Platform not supported

| Field | Value |
|---|---|
| **Code** | MFSO-GENERAL-9003 |
| **Message** | This feature is not supported on your platform |
| **Cause** | Feature requires hardware or OS capabilities not available |
| **Solution** | Check the feature's platform requirements in documentation |

## Error Reporting

If you encounter an error code not documented here:
1. Search GitHub Issues: https://github.com/mfso/mfso/issues
2. Include the full error code and message in your bug report
3. Include steps to reproduce
4. Attach debug logs (Settings > Help > Export Logs)

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
