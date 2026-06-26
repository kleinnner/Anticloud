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

# Privacy FAQ

> **Last Updated:** 2026-06-19
> **Category:** Privacy

## What data does MF+SO collect?

MF+SO is designed with a **data minimization** philosophy. We collect only what is necessary for the service to function:

### Required data (always collected):
- **Email address** — For account creation, sync, and notifications
- **Encrypted vault data** — Encrypted blobs for sync (unreadable by us)
- **Device identifiers** — For device management and push notifications
- **Usage metrics** — Anonymous app usage data (can be disabled)

### Optional data (collected only with consent):
- **Diagnostic logs** — For troubleshooting (deleted after 30 days)
- **Crash reports** — For stability improvements
- **Feature usage analytics** — To improve the product

### Data we NEVER collect:
- Master passwords
- TOTP seeds or codes
- Private keys
- Content of communications
- Browsing history (browser extension)
- Contact list (mobile app)
- Location data (unless you enable geo-fencing)

## Does MF+SO sell my data?

**Absolutely not.** MF+SO does not and will never:
- Sell user data
- Share data with advertisers
- Monetize personal information
- Use data for targeted advertising

Our business model is based on subscriptions and enterprise licensing, not data monetization.

## Can third parties access my data?

Third parties cannot access your plaintext data because:
1. **End-to-end encryption** — Your data is encrypted with keys only you possess
2. **Zero-knowledge architecture** — We never have access to your encryption keys
3. **No plaintext storage** — All data stored on our servers is encrypted

In exceptional circumstances where we receive valid legal process:
- We can only provide encrypted blobs
- We cannot decrypt user data
- We notify users of legal requests (where legally permitted)

## How does MF+SO handle GDPR requests?

MF+SO provides tools to fulfill all GDPR data subject rights:

| Right | How to Exercise |
|---|---|
| Right to be informed | See our privacy policy at mfso.io/privacy |
| Right of access | Export your data via Settings > Export |
| Right to rectification | Edit your profile in Settings |
| Right to erasure | Delete your account via Settings > Delete Account |
| Right to restriction | Contact privacy@mfso.io |
| Right to data portability | Export in standard formats via Settings > Export |
| Right to object | Disable analytics in Settings > Privacy |
| Automated decisions | We do not use automated profiling for personal data |

## What is the privacy policy for the browser extension?

The MF+SO browser extension operates with strict privacy principles:
- **No browsing history collection** — We do not track your browsing
- **No data transmission** — Extensions communicate only with the local desktop app via IPC
- **No third-party code** — Extensions do not load external scripts
- **Permission minimal** — Only request permissions essential for functionality
- **Open source** — Extension code is source-available for inspection

## Does MF+SO use analytics?

Yes, but with strong privacy protections:

**What is tracked (anonymous):**
- App launch count
- Feature usage (e.g., "user generated TOTP code")
- Performance metrics (e.g., "app launch time: 0.5s")
- Error rates (e.g., "QR scan failure rate: 0.1%")

**What is NOT tracked:**
- Specific account names or services
- TOTP codes or passwords
- Individual user behavior patterns
- Content of any encrypted data

**Controls:**
- Analytics can be disabled in Settings > Privacy
- Anonymous by default (no personal identifiers linked)
- Data retention: 90 days for analytics
- Data processed in EU (GDPR protections)

## Where is my data stored?

| Data Type | Storage Location | Encryption |
|---|---|---|
| Local vault data | Your device | AES-256-GCM |
| Sync data (at rest) | US, EU, or APAC region | Encrypted blobs |
| Sync data (in transit) | End-to-end | XChaCha20-Poly1305 |
| Account email | US (primary), EU (GDPR) | AES-256 at rest |
| Backup files | Your chosen location | XChaCha20-Poly1305 |

You choose your data region during account setup. Enterprise customers can specify custom data residency requirements.

## Does MF+SO comply with CCPA?

Yes. California Consumer Privacy Act (CCPA) compliance:
- **Right to know** — Full data inventory available
- **Right to delete** — Account deletion available
- **Right to opt-out** — No data selling to opt out of
- **Non-discrimination** — No price changes based on privacy choices

Contact privacy@mfso.io for CCPA requests.

## How does MF+SO handle data retention?

| Data Type | Active Account | Deleted Account |
|---|---|---|
| Vault data (sync) | Until deleted or account closed | 30 days |
| Account information | Until account closed | 90 days |
| Usage analytics | 90 days | 90 days |
| Crash reports | 30 days | 30 days |
| Backup files | Your control | Your control |
| Audit logs (Enterprise) | Per policy (7 years typical) | Per policy |

## Can I use MF+SO anonymously?

MF+SO Free tier can be used without creating a MF+SO account:

| Feature | Without Account | With Account |
|---|---|---|
| TOTP codes | ✓ | ✓ |
| Password management | ✓ | ✓ |
| FIDO2 credentials | ✓ | ✓ |
| Local backups | ✓ | ✓ |
| Device sync | ✗ | ✓ (Free: 2 devices) |
| Cloud backups | ✗ | ✓ (Premium) |
| Push notifications | ✗ | ✓ |
| Account recovery | Seed phrase only | Seed phrase + sync |

You only need an email address if you want sync, cloud backup, or premium features.

## What happens to my data if MF+SO shuts down?

In the unlikely event MF+SO ceases operations:
1. **Notice period** — Minimum 90 days notice provided
2. **Data export** — Simplified export tools made available
3. **Open source release** — Key components would be released as open source
4. **Transition tools** — Migration tools to alternative providers

Your local vault data is always accessible with your master password, regardless of MF+SO's status.

## How does MF+SO handle government data requests?

MF+SO's policy on government data requests:
1. **Transparency** — We publish a biannual transparency report
2. **User notification** — We notify affected users (unless legally prohibited)
3. **Challenge overbroad requests** — We legally challenge requests that are overly broad
4. **Minimum data** — We provide only what is legally required
5. **No backdoors** — We do not build law enforcement access mechanisms

As of our latest transparency report, we have received 12 government requests and challenged 8 of them.

## Does MF+SO share data with its parent company?

Lois-Kleinner is the sole entity behind MF+SO. There is no parent company that accesses user data. MF+SO data is governed by the same privacy policies and technical controls regardless of corporate structure.

## How is data protected during transmission?

All network communication uses:
- **TLS 1.3** with strong cipher suites (TLS_AES_256_GCM_SHA384)
- **Certificate pinning** for mobile apps
- **Mutual TLS (mTLS)** for server-to-server communication
- **End-to-end encryption** for sync data (additional layer beyond TLS)
- **Certificate Transparency** monitoring

## Can I request all data MF+SO has about me?

Yes. Submit a Data Subject Access Request (DSAR):
1. In-app: Settings > Privacy > Data Access Request
2. Email: privacy@mfso.io
3. Web: mfso.io/privacy/dsar

We will provide a machine-readable export within 30 days (GDPR standard).

## Does MF+SO use any third-party services that access my data?

| Service | Purpose | Data Access | Certification |
|---|---|---|---|
| AWS (S3, EC2, SQS) | Cloud infrastructure | Encrypted blobs only | SOC 2, ISO 27001 |
| Stripe | Payment processing | Payment info only | PCI-DSS Level 1 |
| SendGrid | Transactional emails | Email address only | SOC 2 |
| Firebase | Push notifications | Device token only | SOC 2 |
| Sentry | Crash reporting | Anonymized crash data | SOC 2, GDPR |

All third-party services are contractually bound to process data only as instructed by MF+SO and in compliance with applicable privacy laws.

## How does MF+SO handle children's privacy?

MF+SO does not knowingly collect data from children under 13 (COPPA) or 16 (GDPR):
- Age verification during sign-up
- No targeted advertising (ever, to any age)
- Parental controls available in Enterprise tier
- Immediate deletion of any discovered child data

## What data does MF+SO collect from the browser extension?

The browser extension collects minimal data, all stored locally:

| Data | Collected | Stored Where | Purpose |
|---|---|---|---|
| Visited website URLs | Yes (hashed) | Local extension storage | To suggest matching credentials |
| Login form fields | Yes (temporarily) | Memory only (not disk) | To identify and fill forms |
| Auto-fill credentials | No | Never transmitted | Filled directly from desktop app |
| Browsing history | No | N/A | Not collected |
| Search queries | No | N/A | Not collected |
| Personal communications | No | N/A | Not collected |

### Extension Permissions Explained

| Permission | Why Needed |
|---|---|
| `storage` | Store extension settings locally |
| `nativeMessaging` | Communicate with desktop MF+SO app |
| `tabs` | Know which tab is active for auto-fill |
| `<all_urls>` | Auto-fill credentials on any website |
| `clipboardWrite` | Copy TOTP codes to clipboard |

## How does MF+SO handle data retention in detail?

### Default Retention Periods

| Data Category | Active Account | After Deletion Triggered | After Deletion Complete |
|---|---|---|---|
| Encrypted vault data | Until modified or deleted | 30 days (grace period) | Purged from all systems |
| Sync metadata (IDs, versions) | Indefinite | 30 days | Purged |
| Account email address | Active account | 30 days | Anonymized within 90 days |
| Usage analytics (anonymized) | 90 days rolling | 90 days | Deleted at end of period |
| Crash reports | 30 days | 30 days | Deleted at end of period |
| Support tickets | 3 years | 3 years | Anonymized |
| Payment information | Not stored by MF+SO | Not applicable | Handled by Stripe |
| Audit logs (Enterprise) | Per policy (7 years typical) | Per policy | Per policy |

### Configurable Retention (Enterprise)

Enterprise customers can configure retention policies per data type:

```yaml
retention:
  audit_logs:
    duration: "7 years"
    action: "archive"
  user_data:
    inactive_users: 90  # days before suspension
    deleted_users: 30  # days before permanent deletion
  sessions:
    max_lifetime: 365  # days
    idle_timeout: 60  # minutes
  backups:
    daily: 30  # days
    weekly: 52  # weeks
    monthly: 36  # months
```

## How does MF+SO respond to data breaches?

### Breach Notification Protocol

1. **Detection** — .aioss engine detects anomalous access or exfiltration patterns
2. **Confirmation** — Security team confirms breach and assesses scope
3. **Containment** — Affected systems isolated, access revoked
4. **Notification** — Following regulatory timelines:
   - GDPR: < 72 hours
   - HIPAA: < 60 days
   - CCPA: Without unreasonable delay
   - Enterprise customers: Per SLA (typically < 1 hour)
5. **Remediation** — Root cause analysis, system fixes
6. **Post-mortem** — Full transparency report published

### What Users Can Expect

If a breach is confirmed:
- Immediate notification via email and in-app alert
- Clear description of what data was affected
- Steps being taken to remediate
- Recommendations for additional security steps
- Credit monitoring if financial data was involved (no known cases)

### Historical Breaches

As of 2026, MF+SO has experienced **zero** data breaches. Our zero-knowledge architecture means that even in the event of a server compromise, user secrets remain encrypted.

## How does MF+SO handle data portability requests?

### Standard Data Export
1. Settings > Account > Export Data
2. Choose format:
   - **Encrypted backup** (.mfbak — MF+SO Backup format)
   - **Standard URIs** (otpauth:// format)
   - **CSV** (account names and metadata only)
   - **JSON** (complete data with all fields)
3. Set backup passphrase (for encrypted formats)
4. Download or share the export file

### API-Based Portability (Enterprise)
Enterprise customers can programmatically export all user data via:
```
GET /api/v1/export/users   (bulk user export)
GET /api/v1/export/audit   (audit log export)
GET /api/v1/export/config  (configuration export)
```

### Data Portability SLA
| Request Type | Completion Time | Format |
|---|---|---|
| Self-service export | Immediate | User choice |
| Enterprise bulk export (1K users) | < 1 hour | JSON |
| Enterprise bulk export (10K users) | < 4 hours | JSON |
| Full tenant export | < 24 hours | Multiple formats |

## How does MF+SO manage privacy across different regions?

### Regional Privacy Compliance

| Region | Regulation | Status | DPO Contact |
|---|---|---|---|
| EU / EEA | GDPR | Fully compliant | dpo-eu@mfso.io |
| United Kingdom | UK GDPR | Fully compliant | dpo-uk@mfso.io |
| Switzerland | nFADP | Fully compliant | dpo-ch@mfso.io |
| United States | CCPA, COPPA | Fully compliant | privacy@mfso.io |
| Brazil | LGPD | Fully compliant | dpo-br@mfso.io |
| Canada | PIPEDA | Fully compliant | privacy@mfso.io |
| Japan | APPI | Fully compliant | privacy-jp@mfso.io |
| South Korea | PIPA | Compliant | privacy-kr@mfso.io |
| India | DPDPA | In progress (2027) | privacy@mfso.io |

### Data Residency Options

| Region | Sync Data | Audit Logs (Enterprise) | Backup Storage |
|---|---|---|---|
| United States | US East (Virginia) | US East (Virginia) | US West (Oregon) |
| Europe | EU West (Frankfurt) | EU West (Frankfurt) | EU Central (Zurich) |
| Asia-Pacific | APAC (Singapore) | APAC (Singapore) | APAC (Sydney) |
| Custom | Per contract | Per contract | Per contract |

## How does the MF+SO privacy policy compare to competitors?

| Feature | MF+SO | Google Auth | MS Auth | Authy |
|---|---|---|---|---|
| No data selling | ✓ | ✓ | ✓ | ✓ |
| E2EE for backups | ✓ | N/A | ✗ | Partial |
| Zero-knowledge architecture | ✓ | ✗ | ✗ | ✗ |
| Open source crypto | ✓ | ✗ | ✗ | ✗ |
| No third-party analytics | ✓ | ✗ | ✗ | ✗ |
| Data portability | ✓ | Limited | Limited | Limited |
| Right to deletion | ✓ | ✓ | ✓ | ✓ |
| Privacy policy simplicity | Grade A | Grade C | Grade C | Grade B |

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20782162
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/06-api-oss
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/api-oss-fixed
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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ