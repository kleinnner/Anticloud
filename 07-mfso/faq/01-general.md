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

# General FAQ

> **Last Updated:** 2026-06-19
> **Category:** General

## Table of Contents

1.  [What is MF+SO?](#what-is-mfso)
2.  [How is MF+SO different from other authenticator apps?](#how-is-mfso-different-from-other-authenticator-apps)
3.  [Is MF+SO free?](#is-mfso-free)
4.  [What platforms does MF+SO support?](#what-platforms-does-mfso-support)
5.  [Do I need an internet connection?](#do-i-need-an-internet-connection)
6.  [Can I use MF+SO for personal accounts?](#can-i-use-mfso-for-personal-accounts)
7.  [Can I use MF+SO for business?](#can-i-use-mfso-for-business)
8.  [How do I get started?](#how-do-i-get-started)
9.  [What languages does MF+SO support?](#what-languages-does-mfso-support)
10. [Does MF+SO have a desktop app?](#does-mfso-have-a-desktop-app)
11. [Does MF+SO have a browser extension?](#does-mfso-have-a-browser-extension)
12. [What is the maximum number of accounts I can store?](#what-is-the-maximum-number-of-accounts-i-can-store)
13. [Can I export my data from MF+SO?](#can-i-export-my-data-from-mfso)
14. [Who created MF+SO?](#who-created-mfso)
15. [Is MF+SO open source?](#is-mfso-open-source)
16. [Where is MF+SO based?](#where-is-mfso-based)
17. [How do I contact support?](#how-do-i-contact-support)
18. [What is the roadmap for MF+SO?](#what-is-the-roadmap-for-mfso)
19. [Can MF+SO replace my password manager?](#can-mfso-replace-my-password-manager)
20. [Does MF+SO support hardware security keys?](#does-mfso-support-hardware-security-keys)
21. [Can I use MF+SO on multiple devices?](#can-i-use-mfso-on-multiple-devices)
22. [How does MF+SO make money?](#how-does-mfso-make-money)
23. [What payment methods are accepted?](#what-payment-methods-are-accepted)
24. [Can I get a refund?](#can-i-get-a-refund)
25. [How does MF+SO handle feature requests?](#how-does-mfso-handle-feature-requests)

## What is MF+SO?

MF+SO (Multi Factor+ Sign On) is a **sovereign identity and authentication vault**. It is a next-generation authenticator application that securely stores your multi-factor authentication (MFA) tokens, passwords, passkeys, and digital identities entirely on your device. Unlike traditional authenticator apps that store secrets on servers and rely on cloud connectivity for most operations, MF+SO is built on a device-first, privacy-respecting architecture.

Think of MF+SO as a digital vault that lives on your phone or computer. It generates time-based one-time passwords (TOTP), supports FIDO2/WebAuthn credentials, manages hardware security keys, and can even serve as an enterprise-grade identity provider. All cryptographic operations happen on your device, and your secrets are never exposed to MF+SO servers.

The name stands for **Multi Factor+ Sign On**: the "plus" represents the additional layers of security and functionality beyond standard MFA — including hardware-backed key storage, biometric verification, behavioral analysis, and enterprise identity management.

## How is MF+SO different from other authenticator apps?

Most authenticator apps (like Google Authenticator, Microsoft Authenticator, or Authy) store TOTP seeds on the service provider's servers or use cloud sync that exposes secrets to third parties. MF+SO takes a fundamentally different approach:

| Aspect | Traditional Authenticators | MF+SO |
|---|---|---|
| Seed storage | Server-side or cloud-synced | Device-only, hardware-backed |
| Encryption | Standard AES | Argon2id + AES-256-GCM + TPM binding |
| Offline capability | Limited | Full offline operation |
| Device binding | None | Hardware attestation |
| Backup | Cloud-dependent | Encrypted local + E2EE sync |
| Open source | Rarely | Core modules open source |
| Enterprise features | Separate product | Built into same app |
| Audit logging | Basic | .aioss cryptographic chain |

## Is MF+SO free?

MF+SO offers a generous **Free tier** that covers most personal use cases:

**Free tier includes:**
- Unlimited TOTP accounts
- Unlimited passwords and passkeys
- FIDO2/WebAuthn credential management
- Offline operation
- Encrypted local backups
- Basic device sync (2 devices)
- Standard security features

**Premium tier ($3.99/month or $39.99/year):**
- Unlimited device sync
- Advanced backup (cloud + local)
- Biometric unlock
- Browser extension
- Priority support
- Custom themes and icons

**Enterprise tier (starting at $6/user/month):**
- SAML 2.0 / OIDC Identity Provider
- ZTNA with WireGuard/Tailscale
- .aioss enterprise audit engine
- Compliance reporting (SOC 2, HIPAA, PCI-DSS)
- Self-hosted or air-gapped deployment
- Dedicated support

## What platforms does MF+SO support?

MF+SO is available on the following platforms:

| Platform | Status | Notes |
|---|---|---|
| **iOS** | ✅ v2.5+ | iPhone 12+, iOS 16+ |
| **iPadOS** | ✅ v2.5+ | iPad 7th gen+, iPadOS 16+ |
| **Android** | ✅ v2.5+ | Android 12+, 4 GB RAM minimum |
| **macOS** | ✅ v2.5+ | Apple Silicon + Intel (M1+, 2020+) |
| **Windows** | ✅ v2.5+ | Windows 10 22H2+, 11 |
| **Linux** | ✅ v2.5+ | Ubuntu 22.04+, Fedora 38+, Debian 12+ |
| **Chrome Extension** | ✅ v2.5+ | Chrome 110+ |
| **Firefox Add-on** | ✅ v2.5+ | Firefox 110+ |
| **Edge Extension** | ✅ v2.5+ | Edge 110+ |
| **Safari Extension** | ✅ v2.5+ | Safari 16+ |

**Minimum requirements:**
- iOS: iPhone 12+, iOS 16+, 500 MB storage
- Android: Android 12+, 4 GB RAM, 500 MB storage
- Desktop: 4 GB RAM, 1 GB storage, Secure Enclave/TPM 2.0 recommended

## Do I need an internet connection?

**No.** MF+SO is designed to work fully offline for all core functionality:
- TOTP code generation
- Password management
- FIDO2/WebAuthn authentication
- Local backup and restore

Internet is only required for:
- Syncing between your devices (optional)
- Using MF+SO as an enterprise IdP
- Receiving push authentication requests
- Cloud backups (Premium feature)
- Software updates

## Can I use MF+SO for personal accounts?

Absolutely. MF+SO Free tier is perfect for personal use:
- Add accounts by scanning QR codes or manual entry
- Generate TOTP codes for any service that supports it (Google, Facebook, GitHub, etc.)
- Store and auto-fill passwords
- Use passkeys for passwordless logins
- Sync across up to 2 personal devices

## Can I use MF+SO for business?

Yes. MF+SO Enterprise is built specifically for organizations. Features include:
- **SAML 2.0 / OpenID Connect Identity Provider** — Centralized SSO for all your apps
- **Zero-Trust Network Access** — Replace legacy VPNs with identity-based network access
- **Device Management** — Enforce security policies, remote wipe, device attestation
- **Compliance** — SOC 2, HIPAA, PCI-DSS, GDPR compliance reports
- **Audit Trail** — Tamper-evident cryptographic audit logging
- **Team Management** — RBAC, group policies, delegated administration

See the Enterprise documentation for full details.

## How do I get started?

1. **Download MF+SO** from the App Store, Google Play Store, or mfso.io/download
2. **Create your vault** — Set a strong master password
3. **Secure your vault** — Set up biometric unlock (fingerprint/face)
4. **Add accounts** — Scan QR codes from your existing services
5. **Set up sync** (optional) — Create a free MF+SO account to sync across devices
6. **Explore features** — Try FIDO2, password management, and backup

Full getting started guide: [docs/getting-started](./)

## What languages does MF+SO support?

| Language | Support Level | Translation Progress |
|---|---|---|
| English | Full | 100% |
| Spanish | Full | 100% |
| French | Full | 100% |
| German | Full | 100% |
| Japanese | Full | 100% |
| Korean | Full | 100% |
| Portuguese (BR) | Full | 100% |
| Chinese (Simplified) | Full | 100% |
| Chinese (Traditional) | Full | 100% |
| Russian | Full | 100% |
| Arabic | Beta | 85% |
| Hindi | Beta | 80% |
| Turkish | Beta | 75% |

Community translations are welcome via our Crowdin project.

## Does MF+SO have a desktop app?

Yes. MF+SO is available as a native desktop application for:
- **macOS** — Native SwiftUI app with Apple Silicon optimization
- **Windows** — Native WinUI 3 app with TPM integration
- **Linux** — GTK4 app with systemd integration

Desktop apps include:
- Full vault access and management
- Biometric unlock (Touch ID, Windows Hello, fingerprint)
- Browser extension integration
- QR code scanning via webcam
- TOTP code display

## Does MF+SO have a browser extension?

Yes. MF+SO offers browser extensions that integrate with the desktop app:
- **Auto-fill** passwords and TOTP codes
- **Detect** login forms and suggest credentials
- **Generate** strong passwords
- **FIDO2/WebAuthn** support for passwordless logins
- **One-click** TOTP code filling

The browser extension communicates with the desktop app via encrypted local IPC — your credentials never touch the browser's storage or any cloud service.

## What is the maximum number of accounts I can store?

There is **no artificial limit** on the number of accounts you can store in MF+SO. The only limitation is your device's storage capacity. Each TOTP account requires approximately 1 KB of storage, so even with 10,000 accounts, you would use less than 10 MB.

## Can I export my data from MF+SO?

Yes. MF+SO supports multiple export formats to ensure you are never locked in:

- **Encrypted backup** — Full vault export encrypted with your passphrase (recommended)
- **CSV export** — Account names and metadata (no secrets) for inventory purposes
- **Standard Auth URI** — Export in the standard `otpauth://` URI format for migration to other apps
- **MF+SO Interchange Format** — JSON-based format with full metadata preservation

All exports require your master password or biometric verification.

## Who created MF+SO?

MF+SO was created by **Lois-Kleinner** in partnership with **0-1.gg**. The founding team consists of security engineers and cryptography researchers with backgrounds at major tech companies and government security agencies.

Key team members:
- **Alexis Kleinner** — CEO & Co-Founder
- **Dr. Marie Lois** — CTO & Co-Founder (formerly Cryptography Research at MIT)
- **James Chen** — Head of Engineering (formerly Google Authentication team)
- **Dr. Sarah Williams** — Chief Cryptographer (formerly NIST)
- **David Park** — Head of Enterprise (formerly Okta)

## Is MF+SO open source?

MF+SO has a **mixed-source model**:

**Open source (MIT License):**
- Core cryptographic library (libmfso-crypto)
- TOTP/HOTP implementation
- QR code scanning engine
- SDKs for Go, Python, Java, Rust
- Security audit framework

**Source-available (BSL 1.1):**
- Mobile and desktop client code
- Sync protocol
- Backup system

**Proprietary:**
- Enterprise features (IdP, ZTNA, .aioss)
- Advanced analytics and reporting
- Some UI components

We believe this model balances transparency with the ability to fund continued development.

## Where is MF+SO based?

MF+SO (Lois-Kleinner Inc.) is headquartered in:
- **San Francisco, CA** (HQ)
- **Zurich, Switzerland** (European HQ)
- **Singapore** (APAC HQ)

Data centers are located in:
- US East (Virginia)
- US West (Oregon)
- EU West (Frankfurt, Germany)
- APAC (Singapore)
- Additional regions for Enterprise customers

## How do I contact support?

**Free tier:**
- GitHub Issues: github.com/mfso/mfso/issues
- Community Discord: discord.gg/mfso
- Help Center: help.mfso.io

**Premium tier:**
- Email: support@mfso.io (24-hour response)
- Live chat: mfso.io (business hours)

**Enterprise:**
- Enterprise Portal: enterprise.mfso.io
- Phone: +1 (415) 555-MFSO
- Dedicated Slack channel
- Named support engineer

## What is the roadmap for MF+SO?

Our public roadmap is available at [roadmap.mfso.io](https://roadmap.mfso.io). Key upcoming features:

**Q3 2026:**
- macOS native app (released)
- Linux desktop app (released)
- Browser extensions (released)

**Q4 2026:**
- Passkey sync across devices
- Family sharing plans
- SSH key management

**Q1 2027:**
- Post-quantum cryptography support
- Hardware wallet integration (Ledger, Trezor)
- Advanced backup encryption

**Q2 2027:**
- Decentralized identity (DID) support
- Biometric-sharing between devices
- API for developers

## Can MF+SO replace my password manager?

MF+SO includes password management features, but it is not a full replacement for dedicated password managers for most users:
- **Yes:** Store and auto-fill passwords, generate strong passwords, sync across devices
- **No:** Advanced sharing features, family plans, emergency access, form auto-fill beyond login

For integrated password + MFA management, MF+SO is excellent. If you need advanced password sharing, consider pairing MF+SO with a dedicated password manager.

## Does MF+SO support hardware security keys?

Yes. MF+SO supports:
- **FIDO2/WebAuthn** — Both as a platform authenticator (device itself) and as a roaming authenticator
- **YubiKey** — All models (Security Key, 5 Series, Bio)
- **Google Titan** — All models
- **SoloKey** — All models
- **Feitian** — All FIDO2 models
- **Smart Cards** — PIV/CAC cards (Enterprise tier)
- **Ledger/Trezor** — Hardware wallets (upcoming)

## Can I use MF+SO on multiple devices?

Yes. MF+SO supports multi-device usage:
- **Free:** Up to 2 devices via end-to-end encrypted sync
- **Premium:** Unlimited devices
- **Enterprise:** Managed multi-device with policies

Sync is fully end-to-end encrypted. Your sync key is derived from your master password and never leaves your devices. MF+SO servers only store encrypted blobs.

## How does MF+SO make money?

MF+SO has a sustainable business model:
- **Free tier** — Generous personal use tier funded by paid tiers
- **Premium subscriptions** — $3.99/month for power users
- **Enterprise licensing** — $6+/user/month for organizations
- **Professional services** — Consulting, migration, training

We do NOT sell user data, show ads, or monetize personal information.

## What payment methods are accepted?

- Credit/debit cards (Visa, Mastercard, Amex, Discover)
- PayPal
- Apple Pay / Google Pay
- Cryptocurrency (USDC, USDT via Coinbase Commerce)
- Bank transfer (Enterprise only)
- Purchase orders (Enterprise, annual contracts)

## Can I get a refund?

- **Free tier:** No charges, so no refund needed
- **Premium:** 30-day money-back guarantee for annual subscriptions; monthly subscribers can cancel anytime
- **Enterprise:** Refund terms specified in contract; typically pro-rated refund for unused months

## How does MF+SO handle feature requests?

We love community feedback! Feature requests can be submitted via:
- GitHub Issues (upvote existing requests)
- Discord (#feature-requests channel)
- In-app feedback form
- Enterprise customer roadmap calls

We review all requests and prioritize based on community interest, strategic alignment, and engineering capacity. See our public roadmap for what's coming next.

## How does MF+SO compare to other authenticator apps in detail?

### Comparison Table: MF+SO vs Top 5 Authenticators

| Feature | MF+SO | Google Auth | Microsoft Auth | Authy | Duo Mobile | 1Password |
|---|---|---|---|---|---|---|
| TOTP Codes | Unlimited | Unlimited | Unlimited | Unlimited | Limited | Limited |
| HOTP Support | Yes | No | No | No | No | No |
| FIDO2/WebAuthn | Yes | Yes | Yes | No | Yes | Yes |
| Password Management | Yes | No | No | No | No | Yes |
| Offline Operation | Full | Codes only | Partial | Partial | No | Full |
| End-to-End Encryption | Yes | No | No | Yes | No | Yes |
| Hardware-Backed Keys | Yes | No | Partial | No | No | Partial |
| Cloud Sync | E2EE | No | MS Account | Twilio | No | 1P Account |
| Multi-Device | 2 Free/Unl Premium | No | Yes | Yes | No | Yes |
| Desktop App | All platforms | No | No | Yes | No | Yes |
| Browser Extension | Yes | No | Yes | No | No | Yes |
| Enterprise IdP | Yes | No | Partial | No | Partial | No |
| ZTNA | Yes | No | No | No | Yes | No |
| Open Source Core | Yes | No | No | No | No | No |
| Post-Quantum Crypto | Yes | No | No | No | No | No |
| Self-Hosted | Yes | No | No | Yes | No | No |
| Price | Free/$4/$6+ | Free | Free | Free | $3+/user | $3+/month |

## How do I set up MF+SO for the first time?

### Step-by-step Setup Guide

**Step 1: Download and Install**
1. Open the App Store (iOS), Google Play Store (Android), or visit mfso.io/download (desktop)
2. Search for "MF+SO" and download the app
3. Install and open the application

**Step 2: Create Your Vault**
1. Tap "Create New Vault"
2. Enter a strong master password (minimum 12 characters, mix of letters, numbers, symbols)
3. Confirm your master password
4. **IMPORTANT:** Write down your 24-word recovery seed phrase and store it securely
5. Verify your seed phrase by entering a few randomly selected words

**Step 3: Secure Your Vault**
1. Enable biometric unlock (Face ID, Touch ID, fingerprint, or Windows Hello)
2. Set up auto-lock timeout (recommended: Immediately or 1 minute)
3. Configure backup settings
4. Create an encrypted backup and store it safely

**Step 4: Add Your First Account**
1. Tap the "+" button to add a new account
2. Scan the QR code from the service you want to protect (Google, GitHub, Facebook, etc.)
3. Alternatively, tap "Manual Entry" and enter the secret key
4. Name your account and assign it to a group if desired

**Step 5: Set Up Sync (Optional)**
1. Create a free MF+SO account using your email
2. Verify your email address
3. Your vault will begin syncing across devices automatically

## How do I use MF+SO with specific services?

### Google / Gmail
1. Go to myaccount.google.com > Security > 2-Step Verification
2. Scroll to "Authenticator app" and tap "Set up"
3. Choose your device type and tap "Next"
4. Scan the QR code with MF+SO
5. Enter the 6-digit code from MF+SO to verify

### GitHub
1. Go to github.com/settings/security
2. Under "Two-factor authentication," click "Enable two-factor authentication"
3. Under "Set up using an app," scan the QR code
4. Enter the 6-digit code from MF+SO to verify
5. Save your recovery codes

### Facebook
1. Go to Settings > Security and Login > Use two-factor authentication
2. Select "Authentication App" as your security method
3. Scan the QR code with MF+SO
4. Enter the 6-digit code from MF+SO to confirm

### Twitter / X
1. Go to Settings > Security and account access > Security > Two-factor authentication
2. Select "Authentication app"
3. Scan the QR code with MF+SO
4. Enter the 6-digit code to verify

### Microsoft / Outlook
1. Go to account.microsoft.com > Security > Advanced security options
2. Under "Two-factor verification," click "Add a new way to sign in or verify"
3. Choose "Use an authenticator app"
4. Scan the QR code with MF+SO
5. Enter the code to verify

### Amazon
1. Go to Your Account > Login & security > Two-Step Verification (2SV) Settings
2. Click "Get Started" > "Authenticator App"
3. Scan the QR code with MF+SO
4. Enter the code to verify

## How does the freemium model work in detail?

### Feature Breakdown by Tier

| Feature | Free | Premium ($3.99/mo) | Enterprise ($6+/user/mo) |
|---|---|---|---|
| TOTP/HOTP Accounts | Unlimited | Unlimited | Unlimited |
| Password Management | Unlimited | Unlimited | Unlimited |
| FIDO2/WebAuthn | Yes | Yes | Yes |
| Hardware Security Keys | Yes | Yes | Yes |
| Local Encrypted Backups | Yes | Yes | Yes |
| Device Sync | 2 devices | Unlimited | Unlimited |
| Cloud Backups | No | Yes | Yes |
| Biometric Unlock | Yes | Yes | Yes |
| Browser Extension | No | Yes | Yes |
| Priority Support | No | Yes | Yes (Dedicated) |
| SAML / OIDC IdP | No | No | Yes |
| ZTNA / WireGuard | No | No | Yes |
| .aioss Audit Engine | No | No | Yes |
| Compliance Reports | No | No | Yes |
| Self-Hosted Deployment | No | No | Yes |
| Post-Quantum Crypto | No | No | Yes |

### What Happens When You Upgrade?

When you upgrade from Free to Premium:
1. Your existing vault and all accounts remain intact
2. Device sync is upgraded from 2 to unlimited devices
3. Cloud backup is enabled
4. Browser extension access is granted
5. You receive priority support

When you upgrade from Premium to Enterprise:
1. Your organization manages your account
2. Enterprise features (IdP, ZTNA, audit) become available
3. Your administrator may enforce additional security policies
4. You may need to enroll your device for compliance

## How do I manage my subscription?

### Changing Plans
1. Open MF+SO > Settings > Account > Subscription
2. Select "Change Plan"
3. Choose your new plan
4. Confirm changes
5. Changes take effect immediately (upgrade) or at billing period end (downgrade)

### Canceling Your Subscription
1. Open MF+SO > Settings > Account > Subscription
2. Select "Cancel Subscription"
3. Confirm cancellation
4. You retain access until the end of the current billing period
5. After cancellation, you revert to Free tier features

### Billing Questions
- **When am I billed?** At the start of each billing period (monthly or annually)
- **Can I switch from monthly to annual?** Yes, at any time. Annual billing is 17% cheaper
- **Do you offer refunds?** 30-day money-back guarantee for annual Premium subscriptions
- **What payment methods do you accept?** Credit/debit cards, PayPal, Apple Pay, Google Pay

## How does MF+SO ensure accessibility?

We are committed to making MF+SO accessible to all users:

### Accessibility Features
- **Screen Reader Support** — Full VoiceOver (iOS) and TalkBack (Android) support
- **Dynamic Type** — Text size adjusts to your system settings
- **High Contrast Mode** — Enhanced visibility for visually impaired users
- **Reduced Motion** — Disables animations for users with motion sensitivity
- **Keyboard Navigation** — Full keyboard accessibility (desktop)
- **Color Blind Friendly** — All security indicators use shapes and text, not just colors
- **Audio Feedback** — Optional audio confirmation for actions

### Accessibility Certifications
- WCAG 2.1 AA compliant (targeting AAA by 2027)
- VPAT (Voluntary Product Accessibility Template) available on request

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com