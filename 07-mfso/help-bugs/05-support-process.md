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

# Support Process

> **Last Updated:** 2026-06-19
> **Category:** Support

## Overview

This document describes how to get help with MF+SO. We offer multiple support channels depending on your subscription tier and the nature of your issue.

## Support Channels

### Channel Comparison

| Channel | Best For | Availability | Response Time | Free | Premium | Enterprise |
|---|---|---|---|---|---|---|
| GitHub Issues | Bug reports, feature requests | 24/7 | 1-7 days | ✓ | ✓ | ✓ |
| Discord Community | Quick questions, community help | 24/7 | Minutes-hours | ✓ | ✓ | ✓ |
| Help Center | Documentation, FAQs | 24/7 | Self-service | ✓ | ✓ | ✓ |
| Email Support | Account issues, detailed bugs | Business hours | 24 hours | ✗ | ✓ | ✓ |
| Live Chat | Quick troubleshooting | Business hours | < 5 minutes | ✗ | ✓ | ✓ |
| Phone Support | Critical issues | 24/7 | < 15 min | ✗ | ✗ | ✓ (Premium+) |
| Enterprise Portal | All enterprise support | 24/7 | Tiered SLA | ✗ | ✗ | ✓ |
| Slack/Discord (Private) | Enterprise communication | 24/7 | Tiered SLA | ✗ | ✗ | ✓ (Platinum) |

## Free Tier Support

### Available Channels

1. **GitHub Issues**
   - URL: https://github.com/mfso/mfso/issues
   - Best for: Reporting bugs, requesting features
   - See [GitHub Issues Guide](06-github-issues.md) for filing good reports

2. **Discord Community**
   - URL: https://discord.gg/mfso
   - Channels: #help, #general, #bugs, #feature-requests
   - Community-driven support
   - MF+SO team members are active

3. **Help Center**
   - URL: https://help.mfso.io
   - Searchable knowledge base
   - FAQ, troubleshooting guides, video tutorials

4. **Status Page**
   - URL: https://status.mfso.io
   - Service availability
   - Incident reports
   - Maintenance schedules

### What Free Tier Support Includes

- Bug triage and fixes
- Security vulnerability handling
- Public feature requests
- Community support via Discord
- Documentation access

### What Free Tier Does NOT Include

- Direct email/chat support
- Personal onboarding assistance
- SLA guarantees
- Phone support
- Custom development

## Premium Support

### Available Channels

1. **Email Support**
   - Address: support@mfso.io
   - Response time: < 24 hours
   - Business hours: Mon-Fri, 9 AM - 6 PM local time

2. **Live Chat**
   - URL: https://mfso.io/chat
   - Available: Mon-Fri, 9 AM - 6 PM local time
   - Response time: < 5 minutes

3. **All Free-tier channels** (GitHub, Discord, Help Center)

### What Premium Support Includes

- Direct email support with 24-hour response
- Live chat during business hours
- Priority bug fixes
- Feature request consideration
- Basic onboarding assistance

### Premium Support SLA

| Issue Severity | Response Time | Update Frequency |
|---|---|---|
| Critical | < 12 hours | Every 4 hours |
| High | < 24 hours | Daily |
| Medium | < 48 hours | Every 2 days |
| Low | < 5 business days | Weekly |

## Enterprise Support

### Available Channels

1. **Enterprise Portal**
   - URL: https://enterprise.mfso.io
   - 24/7 ticket submission and tracking
   - Service health dashboard
   - Compliance report access

2. **Email Support**
   - Address: enterprise-support@mfso.io
   - Dedicated support queue

3. **Phone Support**
   - Number: Provided in onboarding
   - Available: 24/7 (Premium+ tier)

4. **Slack/Discord**
   - Private channel with MF+SO engineers
   - Available: 24/7 (Platinum tier)

5. **Named Support Engineer**
   - Single point of contact (Premium+)
   - Account familiarity and context

### Enterprise Support SLA

| Severity | Standard | Premium | Platinum |
|---|---|---|---|
| **Critical — Service Down, Data Loss** | 1 hour | 15 minutes | 5 minutes |
| **High — Major Feature Impaired** | 4 hours | 1 hour | 30 minutes |
| **Medium — Partial Feature Impaired** | 8 hours | 4 hours | 2 hours |
| **Low — Cosmetic, Documentation** | 24 hours | 8 hours | 4 hours |

### Severity Definitions

| Severity | Definition | Examples |
|---|---|---|
| **Critical (S1)** | Production service is down or data loss is imminent | User cannot authenticate, sync is completely broken |
| **High (S2)** | Major feature is significantly impaired, no workaround | SAML IdP failing, ZTNA partial outage |
| **Medium (S3)** | Feature partially impaired, workaround available | TOTP code display issue, search not working |
| **Low (S4)** | Cosmetic issue, minor bug, documentation error | UI glitch, typo in documentation |

## How to Get the Best Support

### Before Contacting Support

1. **Check existing resources:**
   - Search the Help Center: https://help.mfso.io
   - Search GitHub Issues: https://github.com/mfso/mfso/issues
   - Check our Discord: #help channel, #known-issues
   - Check the Status Page: https://status.mfso.io

2. **Gather information:**
   - MF+SO version (Settings > About)
   - Device model and OS version
   - What you were doing when the issue occurred
   - Steps to reproduce the issue
   - Error messages or codes (see Common Error Codes)
   - Logs (Settings > Help > Export Logs)
   - Screenshots or screen recording

3. **Attempt basic troubleshooting:**
   - Restart the app
   - Restart your device
   - Check for app updates
   - Ensure internet connectivity

### When Contacting Support

**Include in your message:**
- Clear description of the issue
- Steps to reproduce
- Expected behavior vs actual behavior
- Environment details (app version, OS version, device model)
- Any error codes or messages
- Logs (if applicable)
- Screenshots (if visual)

**Do NOT include:**
- Your master password (we will never ask for it)
- Your seed phrase (we will never ask for it)
- Sensitive personal information
- TOTP codes or account screenshots showing codes

## Support Escalation

### Escalation Path (Enterprise)

```
Support Engineer (Tier 1)
       │
   15+ minutes (Critical) / 4+ hours (High)
       │
       ▼
Senior Support Engineer (Tier 2)
       │
   1+ hour (Critical) / 8+ hours (High)
       │
       ▼
Engineering Team Lead (Tier 3)
       │
   4+ hours (Critical) / 24+ hours (High)
       │
       ▼
VP Engineering / CTO (Tier 4)
```

### Escalation Request

To escalate a support issue:
- Enterprise Portal: Click "Request Escalation" on your ticket
- Email: Mark subject line with "[ESCALATION]"
- Phone: Ask to speak with the escalation manager

## Support Hours

| Tier | Hours | Time Zones |
|---|---|---|
| Free | Community only | Global |
| Premium | Mon-Fri, 9 AM - 6 PM | US Eastern, Pacific |
| Enterprise Standard | Mon-Fri, 8 AM - 8 PM | US, EU |
| Enterprise Premium | 24/7/365 | Global |
| Enterprise Platinum | 24/7/365 | Global |

## Holiday Coverage

Enterprise Premium and Platinum tiers have full coverage on major holidays:
- US: New Year, MLK Day, Presidents Day, Memorial Day, Independence Day, Labor Day, Thanksgiving, Christmas
- EU: Regional holidays based on support location
- APAC: Regional holidays based on support location

## Feature Requests

### How to Submit

1. **GitHub Issues:** Use the "Feature Request" template
2. **Discord:** Post in #feature-requests channel
3. **In-app:** Settings > Feedback > Feature Request
4. **Enterprise:** Speak with your named support engineer

### What Happens Next

1. Issue is reviewed by product team (weekly triage)
2. If aligned with product vision → added to roadmap
3. If not aligned → closed with explanation
4. Highly requested features are prioritized

## Reporting Security Issues

### Security Vulnerability Reporting

If you discover a security vulnerability:

**DO NOT** report it in public GitHub issues or Discord.

**DO** report it confidentially:
- Email: security@mfso.io
- HackerOne: https://hackerone.com/mfso
- PGP Key: Available at https://mfso.io/.well-known/security.txt

### Bug Bounty Program

MF+SO runs a bug bounty program on HackerOne:

| Severity | Reward |
|---|---|
| Critical | $5,000 - $25,000 |
| High | $2,000 - $5,000 |
| Medium | $500 - $2,000 |
| Low | $100 - $500 |

## Customer Feedback

We welcome feedback on our support process:
- Survey: After each support interaction
- Email: feedback@mfso.io
- GitHub: https://github.com/mfso/mfso/issues

## Support Process Flowchart

```
                    ┌──────────────────────┐
                    │   Issue Occurs        │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Check Help Center    │
                    │  & Known Issues       │
                    └──────────┬───────────┘
                               │
                     ┌─────────┴──────────┐
                     │   Issue Resolved?   │
                     ├─────YES───────NO────┤
                     │                    │
                     ▼                    ▼
              ┌──────────────┐   ┌──────────────────┐
              │  Done!       │   │  Choose Channel   │
              │  (Share fix  │   │  based on tier     │
              │   on Discord)│   └────────┬─────────┘
              └──────────────┘            │
                               ┌──────────┴──────────┐
                               │  Create Support      │
                               │  Request with:       │
                               │  • App version       │
                               │  • OS version        │
                               │  • Steps to reproduce│
                               │  • Logs              │
                               │  • Screenshots       │
                               └──────────┬──────────┘
                                          │
                               ┌──────────▼──────────┐
                               │  Support Team        │
                               │  Responds            │
                               │  (per SLA)           │
                               └──────────┬──────────┘
                                          │
                               ┌──────────┴──────────┐
                               │  Issue Resolved?     │
                               ├─────YES───────NO────┤
                               │                    │
                               ▼                    ▼
                        ┌──────────────┐   ┌──────────────┐
                        │  Close &     │   │  Escalate    │
                        │  Survey      │   │  to Tier 2/3 │
                        └──────────────┘   └──────────────┘
```

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
