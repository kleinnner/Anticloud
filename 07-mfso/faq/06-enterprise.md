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

# Enterprise FAQ

> **Last Updated:** 2026-06-19
> **Category:** Enterprise

## Can MF+SO Enterprise integrate with our existing SSO?

Yes. MF+SO Enterprise serves as both a SAML 2.0 and OpenID Connect Identity Provider. It can also integrate with existing IdPs:
- **As IdP** — Replace your current SSO provider with MF+SO
- **As proxy** — Sit in front of existing IdP (Azure AD, Okta, Ping) and add MFA
- **As SP** — Delegate authentication to an upstream IdP

See the [SAML/OIDC IdP Guide](/docs/enterprise/02-saml-oidc-idp.md) for detailed integration steps.

## What applications does MF+SO Enterprise support?

MF+SO supports any application that uses:
- **SAML 2.0** — Thousands of enterprise applications
- **OpenID Connect / OAuth 2.0** — Modern web and mobile apps
- **SCIM 2.0** — User provisioning and deprovisioning
- **LDAP** — Legacy application support
- **RADIUS** — Network device authentication
- **Header-based** — Reverse proxy authentication

Pre-built integration templates are available for 300+ applications including:
Salesforce, Slack, Google Workspace, Microsoft 365, AWS, GitHub, GitLab, Jira,
Confluence, ServiceNow, Workday, SAP, Oracle, and many more.

## Can MF+SO Enterprise replace our VPN?

Yes, with our **Zero-Trust Network Access (ZTNA)** feature:
- Built on WireGuard for high-performance encrypted tunnels
- Peer-to-peer mesh networking via Tailscale integration
- Identity-based access policies (not IP-based)
- Device attestation and posture checking
- Micro-segmentation for workload isolation
- No open ports, no VPN concentrators

See the [ZTNA Guide](/docs/enterprise/03-zero-trust-network-access.md) for full details.

## How does MF+SO Enterprise handle compliance?

MF+SO Enterprise includes comprehensive compliance features:
- **SOC 2 Type II** — Certified (report available under NDA)
- **GDPR** — Full compliance, DPA available
- **HIPAA** — BAA available, all technical safeguards implemented
- **PCI-DSS** — SAQ support, MFA for all administrative access
- **FedRAMP Moderate** — In progress (expected Q4 2026)
- **ISO 27001:2022** — Certified

Compliance reports can be generated with one click from the admin console.

## Can we deploy MF+SO Enterprise on-premises?

Yes. Self-hosted deployment options:
- **Bare metal** — Ubuntu, RHEL, Rocky Linux, Debian
- **Virtualized** — VMware vSphere, Hyper-V, Nutanix
- **Containerized** — Kubernetes (Helm charts provided)
- **Air-gapped** — No internet required after installation

All updates are delivered via signed packages. License activation can be done offline.

## How does MF+SO Enterprise licensing work?

- **Per-active-user pricing** — $6/user/month (Standard) to $22/user/month (Platinum)
- **Volume discounts** — Available at 1,000+ users
- **Self-hosted or cloud** — Same pricing
- **Annual or multi-year** — Discounts for longer commitments
- **Support tiers** — Standard (8x5), Premium (24/7), Platinum (dedicated)

See the [Enterprise Pricing](/docs/enterprise/07-enterprise-pricing.md) for complete details.

## Does MF+SO Enterprise support multi-tenancy?

Yes. MSPs and large organizations can create isolated tenants:
- **Complete data isolation** — Cryptographic separation between tenants
- **Independent configuration** — Each tenant has its own policies, branding
- **Administrative delegation** — Tenant administrators with limited scope
- **Usage metering** — Per-tenant usage tracking and billing

## How long does an Enterprise deployment take?

| Deployment Type | Typical Timeline |
|---|---|
| Cloud (managed) | 1-2 days |
| Self-hosted (single node) | 1-3 days |
| Self-hosted (HA cluster) | 3-7 days |
| Air-gapped | 5-10 days |
| With migration from existing IdP | 1-4 weeks |

Professional services available to accelerate deployment.

## Can MF+SO Enterprise sync with Active Directory?

Yes. MF+SO Enterprise supports:
- **LDAP sync** — Import users and groups from AD/LDAP
- **SCIM 2.0** — Standard provisioning protocol
- **Azure AD Connect** — Sync from Azure AD
- **Okta SCIM** — Sync from Okta
- **Custom connectors** — API-based sync for any identity source

## What is the uptime SLA?

| Tier | Guarantee | Monthly Credit |
|---|---|---|
| Standard | 99.9% | 10% per 0.5% below |
| Premium | 99.99% | 10% per 0.1% below |
| Platinum | 99.999% | 25% per 0.01% below |

## How does MF+SO Enterprise handle device management?

Device management features:
- **Automatic enrollment** — via MDM (Intune, Jamf, Workspace ONE) or self-service
- **Device attestation** — TPM, Secure Enclave, TEE verification
- **Posture checking** — OS patches, EDR status, disk encryption, firewall
- **Compliance automation** — Auto-remediate or block non-compliant devices
- **Remote wipe** — Cryptographically neutralize lost devices

## What kind of audit logging does Enterprise provide?

MF+SO Enterprise includes the **.aioss audit engine**:
- All authentication events logged
- Cryptographic chain of custody
- Tamper-evident, immutable storage
- Real-time alerting on suspicious events
- SIEM integration (Splunk, ELK, Chronicle)
- Pre-built compliance reports
- 7-year retention (configurable)

## Can we customize the login experience?

Yes. Full customization available:
- **Custom domain** — Use your own domain for IdP endpoints
- **Branding** — Logo, colors, fonts, custom CSS
- **Authentication policies** — Per-application MFA requirements
- **Language** — Full internationalization support
- **SSO portal** — Customizable app launcher dashboard

## Does MF+SO Enterprise support hardware security keys?

Yes. Enterprise supports FIDO2 security keys:
- **YubiKey** — All models (5 Series, Bio, Security Key)
- **Google Titan** — All models
- **SoloKey** — All models
- **Smart Cards** — PIV/CAC for government and defense
- **HSM integration** — Thales Luna, Entrust nCipher, AWS CloudHSM

## How does MF+SO Enterprise handle user provisioning?

- **SCIM 2.0** — Standard provisioning to/from identity providers
- **JIT (Just-In-Time)** — Auto-provision users on first login
- **Bulk import** — CSV/JSON user import
- **API** — REST API for custom provisioning workflows
- **De-provisioning** — Automatic access removal on user termination

## What support options are available for Enterprise?

| Tier | Availability | Response (Critical) | Channel |
|---|---|---|---|
| Standard | 8x5 business hours | 1 hour | Email, Portal |
| Premium | 24/7/365 | 15 minutes | Email, Portal, Phone, Slack |
| Platinum | 24/7/365 | 5 minutes | Email, Portal, Phone, Slack, Discord |

All Enterprise tiers include:
- Dedicated support portal
- Knowledge base
- Security advisories
- Software updates

## Can MF+SO Enterprise be deployed in a government environment?

Yes. Features for government deployments:
- **FedRAMP Moderate** — Authorization in progress
- **FIPS 140-2/140-3** — Validated cryptographic module
- **Air-gapped operation** — No internet required
- **HSM integration** — FIPS-certified HSM support
- **PIV/CAC** — Smart card authentication for federal employees
- **Data sovereignty** — Data stored within national boundaries

## How does enterprise onboarding work?

Enterprise onboarding follows a structured engagement model with four phases:

### Discovery Phase (Week 1)
- Requirements gathering and stakeholder interviews
- Current infrastructure audit and application inventory
- User population analysis and security policy review
- Success criteria definition and timeline planning

### Pilot Phase (Weeks 2-3)
- Deploy MF+SO Enterprise in staging environment
- Integrate 5-10 pilot applications
- Onboard 20-50 pilot users from different departments
- Gather feedback and iterate on configuration

### Rollout Phase (Weeks 4-8)
- Production deployment and cutover planning
- Migrate applications in batches (starting with low-risk)
- Onboard user groups incrementally with communication
- Conduct administrator and help desk training

### Optimization Phase (Ongoing)
- Performance tuning and policy refinement
- Custom integration development
- Compliance report configuration
- Knowledge transfer and documentation handoff

## What training does MF+SO provide for Enterprise?

| Training Type | Duration | Audience | Topics Covered |
|---|---|---|---|
| Administrator | 1 day | IT/Security team | Installation, configuration, day-2 operations |
| Help Desk | 4 hours | Support team | User management, password resets, troubleshooting |
| End User | 1 hour | All users | Installing MF+SO, daily usage, best practices |
| Developer | 2 days | Engineering | API integration, SDK usage, custom connectors |
| Compliance | 1 day | Audit/Compliance | Report generation, evidence collection, auditor support |

## How does identity federation work in MF+SO Enterprise?

MF+SO Enterprise supports multiple federation patterns:

### Hub-and-Spoke Federation
Multiple upstream IdPs feed into MF+SO, which presents a unified IdP to downstream applications:
```
Azure AD ──┐
Okta ──────┼───▶ MF+SO Enterprise ───▶ Application A
Ping ──────┘                            Application B
```

Benefits: Consistent MFA policies across departments, unified audit trail, centralized compliance reporting.

### B2B Partner Federation
Establish trust relationships with partner organizations for secure resource sharing:
```
Company A (MF+SO) ◄─── Trust ──▶ Company B (Any IdP)
```
- Each org maintains its own identity infrastructure
- MF+SO manages cross-org trust
- JIT provisioning for guest users
- Automatic deprovisioning when access is revoked

### Cross-Domain Federation
For global organizations with regional identity infrastructure:
```
Global Trust Federation
├── US Region (Okta)
├── EU Region (Azure AD)
└── APAC Region (Ping)
```
- Users authenticate in their home region
- Cross-region access via federation trust
- Consistent policy enforcement globally

## How does MF+SO Enterprise handle privileged access management?

Privileged access is managed through Just-In-Time (JIT) elevation:

```yaml
pam:
  jit_elevation:
    enabled: true
    approval_required: true
    max_duration: 240  # minutes (4 hours)
    justification_required: true
    audit_all_access: true
    
    roles:
      - name: "break-glass-admin"
        duration: 60  # minutes
        approval: "emergency"  # automatic for verified emergencies
        mfa_required: true
        mfa_method: "hardware_key"
        notify:
          - "ciso@company.com"
          - "security-team@company.com"
```

## What identity protocols does MF+SO Enterprise support?

| Protocol | Role | Standards |
|---|---|---|
| SAML 2.0 | IdP and SP | OASIS |
| OpenID Connect 1.0 | Provider and RP | OpenID Foundation |
| OAuth 2.0 | Authorization Server | IETF RFC 6749 |
| SCIM 2.0 | Provisioning | IETF RFC 7643/7644 |
| LDAP v3 | User directory | IETF RFC 4511 |
| RADIUS | Network auth | IETF RFC 2865 |
| Kerberos v5 | Enterprise SSO | IETF RFC 4120 |
| WS-Federation 1.2 | Legacy SSO | OASIS |
| FIDO2 / WebAuthn | Passwordless | W3C / FIDO Alliance |
| CTAP2 | Authenticator protocol | FIDO Alliance |

## What is the service level agreement for uptime?

| Tier | Uptime Guarantee | Monthly Credit Calculation |
|---|---|---|
| Standard | 99.9% | 10% credit per 0.5% below |
| Premium | 99.99% | 10% credit per 0.1% below |
| Platinum | 99.999% | 25% credit per 0.01% below |

Maximum monthly credit: 50% of monthly fee. Credits applied to next invoice. Excludes planned maintenance (notified 7 days in advance).

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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