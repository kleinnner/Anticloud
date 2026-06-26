                                                                
                ▄    ▄                      ▄▄▄             ▄   
  ▄             █  ▄▀   ▄▄▄   ▄▄▄▄▄   ▄▄▄     █     ▄▄▄   ▄▄█▄▄ 
   ▀▀▀▄▄        █▄█    ▀   █  █ █ █  █▀  █    █    █▀ ▀█    █   
   ▄▄▄▀▀        █  █▄  ▄▀▀▀█  █ █ █  █▀▀▀▀    █    █   █    █   
  ▀             █   ▀▄ ▀▄▄▀█  █ █ █  ▀█▄▄▀  ▄▄█▄▄  ▀█▄█▀    ▀▄▄ 
                                                                
# FAQ — Pricing and Licensing

**Kamelot — The Sovereign Semantic Vector File System**
**Lois-Kleinner & 0-1.gg © 2026**

---

## Table of Contents

1. [Is Kamelot Free?](#is-kamelot-free)
2. [What's the Difference Between Community and Enterprise?](#whats-the-difference-between-community-and-enterprise)
3. [Do I Need a Subscription?](#do-i-need-a-subscription)
4. [Is Kamelot Open Source?](#is-kamelot-open-source)
5. [Can I Use Kamelot for My Business?](#can-i-use-kamelot-for-my-business)
6. [What Licenses Are the Dependencies Under?](#what-licenses-are-the-dependencies-under)
7. [How Does Kamelot Make Money?](#how-does-kamelot-make-money)
8. [Is the AI Model Free to Use?](#is-the-ai-model-free-to-use)
9. [What Is the Refund Policy?](#what-is-the-refund-policy)
10. [Can I Get a Volume Discount for Enterprise?](#can-i-get-a-volume-discount-for-enterprise)

---

## Is Kamelot Free?

**Yes, the core Kamelot software is completely free for individual use.**

You can download, install, and use Kamelot indefinitely with no restrictions on:
- Number of files indexed
- Number of queries performed
- Number of devices (one user, multiple devices)
- Duration of use
- Features (all core features are available in the free version)

There is no:
- Subscription fee
- One-time purchase fee
- Usage cap
- Data cap
- "Pro" feature gating

The free version includes:
- Full semantic vector search
- Omnibox UI
- FUSE/WinFSP virtual drive mount
- End-to-end encryption
- .aioss ledger (full versioning and rollback)
- CLI tools
- All supported file format parsers
- Mock embedding backend
- Real embedding backend (requires local Ollama + model)

---

## What's the Difference Between Community and Enterprise?

| Feature | Community (Free) | Enterprise Support |
|---------|-----------------|-------------------|
| Core Kamelot software | ✓ | ✓ |
| Semantic search | ✓ | ✓ |
| Omnibox UI | ✓ | ✓ |
| FUSE/WinFSP mount | ✓ | ✓ |
| Encryption | ✓ | ✓ |
| .aioss ledger | ✓ | ✓ |
| CLI tools | ✓ | ✓ |
| File format support | ✓ | ✓ |
| Community support (Discord, GitHub) | ✓ | ✓ |
| Documentation | ✓ | ✓ |
| **Priority email support** | — | ✓ |
| **Phone/video support** | — | ✓ |
| **SLA (response time guarantee)** | — | ✓ |
| **Custom development** | — | Available |
| **On-site deployment assistance** | — | Available |
| **Training sessions** | — | Available |
| **SSO/LDAP integration** | — | Available |
| **Audit log export** | — | Available |
| **Compliance documentation** | — | Available |
| **Bug bounty participation** | — | ✓ |
| **Early access to releases** | — | ✓ |

Enterprise Support is not a different product — it's a support and services package for organizations that need guaranteed response times, compliance assistance, and deployment help.

---

## Do I Need a Subscription?

**No.** There is no subscription requirement.

The core Kamelot software is free forever. You can use it without:
- Creating an account
- Registering with an email
- Providing payment information
- Agreeing to a subscription

The only paid options are entirely optional:
1. **Community License**: A one-time supporter payment of $50-$100 for users who want to support development and get priority community support
2. **Enterprise Support**: Annual contracts starting at $5,000 for organizations that need SLAs and professional support

Neither of these affects the core functionality or features available.

---

## Is Kamelot Open Source?

**Partially.** The core components of Kamelot are open source:

| Component | License | Source Available |
|-----------|---------|-----------------|
| Kamelot daemon (core) | MIT / Apache-2.0 | GitHub |
| Kamelot CLI (kml) | MIT / Apache-2.0 | GitHub |
| Vello GPU UI | MIT / Apache-2.0 | GitHub |
| .aioss ledger library | MIT / Apache-2.0 | GitHub |
| Kamelot SDK (bindings) | MIT / Apache-2.0 | GitHub |

Components that are **not** open source:
- Enterprise support plugins (SSO, audit logging)
- Professional consulting tooling
- Internal build and deployment infrastructure

The open-source components can be audited, forked, and contributed to. The company (Lois-Kleinner & 0-1.gg) provides the open-source core and sells support/services around it.

### Open Source Philosophy

Kamelot's open-source strategy is modeled after successful projects like:
- **GitLab**: Open-source core, proprietary enterprise features
- **Grafana**: Open-source core, paid enterprise support
- **Qdrant**: Open-source core, paid cloud and enterprise features

This model ensures:
- The core product remains free and auditable
- The company can sustain development through enterprise revenue
- Users are not locked into a proprietary platform
- The community can contribute improvements

---

## Can I Use Kamelot for My Business?

Yes. The free Community version can be used for commercial purposes within your organization. There are no restrictions on:
- Business use of the free version
- Number of users in your organization
- Revenue generated using Kamelot
- Deployment in commercial environments

However, if your organization requires:
- Guaranteed response times for support
- Compliance documentation (SOC 2, HIPAA, GDPR support)
- Custom integration development
- On-site deployment assistance
- SSO/LDAP integration
- Audit log export

...then an Enterprise Support contract is recommended.

### Commercial Use License Summary

| Use Case | Free Version | Enterprise Support |
|----------|-------------|-------------------|
| Personal use | ✓ | ✓ |
| Freelance / solo business | ✓ | ✓ |
| Small team (<10 users) | ✓ | ✓ |
| Mid-size organization | ✓ | Recommended |
| Large enterprise | ✓ | Recommended |
| Government / public sector | ✓ | Required for SLAs |
| Healthcare (HIPAA) | ✓ (with compliance review) | Recommended |
| Financial services | ✓ (with compliance review) | Recommended |

---

## What Licenses Are the Dependencies Under?

Kamelot's dependencies use various open-source licenses. See the full [Software Bill of Materials](docs/feature-paper/04-software-bill-of-materials.md) for the complete list.

### Key Dependencies and Their Licenses

| Component | License | Obligations |
|-----------|---------|-------------|
| Kamelot core | MIT / Apache-2.0 | Attribution |
| Rust compiler | MIT / Apache-2.0 | Attribution |
| Qdrant | Apache-2.0 | Attribution |
| Ollama | MIT | Attribution |
| Qwen 2 VL model | Apache-2.0 | Attribution |
| WinFSP | GPL-3.0 with linking exception | Proprietary use allowed |
| libfuse3 | GPL-2.0 with FUSE exception | Proprietary use allowed |
| All Rust crates | Various (MIT, Apache-2.0, BSD-3, etc.) | See SBOM for details |

### GPL Considerations

Kamelot uses GPL-licensed libraries (WinFSP, libfuse3) that include linking exceptions allowing proprietary use. These exceptions specifically permit using the libraries in proprietary software without making the proprietary code subject to the GPL.

### Attribution Requirements

If you distribute Kamelot (e.g., as part of a product), you must include the attribution notices for Apache-2.0 and BSD-3 licensed dependencies. The NOTICES file in the repository contains all required attributions.

---

## How Does Kamelot Make Money?

Kamelot is developed by **Lois-Kleinner & 0-1.gg**, a company founded on the principle that software should be free for individuals and paid for by organizations that need support.

### Revenue Streams

| Stream | Description | % of Revenue (Projected) |
|--------|-------------|--------------------------|
| Enterprise Support | Annual contracts for support, SLAs, compliance | 70% |
| Community Licenses | One-time payments from supporters | 10% |
| Consulting Services | Custom development, deployment, training | 15% |
| Training | Public and private training sessions | 5% |

### Why Not Ads or Data Monetization?

Kamelot does not and will never:
- Show advertisements
- Sell user data
- Monetize user content
- Harvest telemetry for commercial purposes
- Restrict features behind paywalls

This is a fundamental design principle. The self-hosted, zero-knowledge architecture makes data monetization impossible by design.

### Sustainability

The revenue model is designed to be sustainable with:
- Low customer acquisition costs (word-of-mouth, community growth)
- High margins on enterprise support (software margins, minimal incremental cost)
- Recurring revenue from annual enterprise contracts
- Growing community that generates organic adoption

---

## Is the AI Model Free to Use?

The default AI model (Qwen 2 VL) is released under the **Apache 2.0 license**, which permits:
- Commercial use
- Modification
- Distribution
- Sublicensing
- Private use

There are no per-inference fees, no usage quotas, and no API keys required for local use. The model runs entirely on your hardware.

### Model Licensing Summary

| Model | License | Commercial Use | Fees |
|-------|---------|---------------|------|
| Qwen 2 VL 7B Q4 | Apache-2.0 | Yes | None |
| nomic-embed-text | Apache-2.0 | Yes | None |
| all-MiniLM-L6-v2 | Apache-2.0 | Yes | None |
| Llama 3.2 | Llama 3.2 Community | Yes (<700M MAU) | None |
| Mistral | Apache-2.0 | Yes | None |

---

## What Is the Refund Policy?

### Community Licenses

Community Licenses (one-time supporter payments) are refundable within 30 days of purchase if the software does not meet your needs. Contact community@kamelot.ai with your purchase details.

### Enterprise Support Contracts

Enterprise Support contracts are billed annually. Refunds are available on a pro-rata basis if canceled within the first 90 days. After 90 days, the contract is non-refundable but service continues through the paid period.

### Consulting Services

Consulting and training services are billed at time of booking. Cancellations with more than 14 days notice receive a full refund. Cancellations with 7-14 days notice receive a 50% refund. Cancellations with less than 7 days notice are non-refundable.

---

## Can I Get a Volume Discount for Enterprise?

Yes. Enterprise Support pricing is volume-based:

| Tier | Annual Price | Users Covered | Effective Per-User Cost |
|------|-------------|---------------|------------------------|
| Bronze | $5,000 | Up to 50 | $100+/user |
| Silver | $15,000 | Up to 200 | $75+/user |
| Gold | $50,000 | Up to 1,000 | $50+/user |
| Platinum | $150,000 | 1,000+ | Contact us |

Volume discounts are available for:
- Non-profit and educational institutions: 25% discount
- Government agencies: 15% discount
- Multi-year commitments: 10-20% discount
- Bundled training and consulting: Package pricing

Contact enterprise@kamelot.ai for a custom quote.

---

## Can I Use Kamelot in a SaaS Product?

The MIT and Apache 2.0 licenses on Kamelot's core components permit use in SaaS products, as these are permissive licenses that do not require source code distribution for network use. The GPL-licensed components (WinFSP, libfuse3) include linking exceptions that allow proprietary use.

### Redistribution Requirements

| Component | Redistribution Requirement |
|-----------|--------------------------|
| Kamelot core (MIT/Apache 2.0) | Include attribution notice |
| WinFSP (GPL with linking exception) | Include license notice |
| libfuse3 (GPL with FUSE exception) | Include license notice |
| Qwen 2 VL model (Apache 2.0) | Include attribution |

### What You Cannot Do

- Remove or alter license notices
- Sublicense Kamelot under a more restrictive license
- Use the Kamelot name or logo without permission
- Claim the code as your own original work

---

## What Happens If Kamelot Inc. Goes Out of Business?

Because Kamelot is self-hosted and open source, you continue using it indefinitely without any dependency on the company's continued operation.

### What Continues to Work

- All existing installations continue functioning
- The open-source code remains available (forked, mirrored)
- Local indexes, ledgers, and flat stores remain intact
- Community forks can emerge to provide continued development

### What Would Be Lost

- Enterprise support services (SLAs, dedicated engineers)
- Official package repositories and update channels
- Professional consulting and training
- Community infrastructure (Discord, forums) — though these could be community-maintained

### Mitigation Strategy

To ensure continuity:
1. Mirror the source code repository
2. Back up your encryption keys and ledger independently
3. Pin specific versions for production deployments
4. Participate in the community to maintain access to support resources

This is a key advantage of the open-source, self-hosted model over proprietary SaaS alternatives.

---

## Are There Any Usage Limits?

No. Kamelot has no artificial usage limits on:
- Number of files indexed
- Number of queries
- Number of devices
- Storage capacity
- Duration of use

The only limits are technical (hardware capacity) and are documented in the system requirements. Some third-party dependencies have their own limits:

| D dependency | Limit |
|--------------|-------|
| Qdrant (free tier) | Single node, ~2M vectors practical max |
| Ollama | None |
| Qwen 2 VL model | None |

Enterprise sharding and clustering are available through Enterprise Support for exceeding Qdrant's single-node limits.

---

## Can I Get a Discount for Non-Profits or Education?

Yes. Kamelot offers the following discounts:

| Sector | Discount | Eligibility |
|--------|----------|-------------|
| Non-profit organizations | 25% | Valid 501(c)(3) or equivalent |
| Educational institutions | 25% | Accredited schools and universities |
| Government agencies | 15% | Federal, state, and local |
| Open-source projects | 50% | Active open-source projects with community |
| Startup (<10 employees) | 20% | First year only |

Discounts apply to Enterprise Support contracts. Community Licenses (one-time supporter payments) are not eligible for additional discounts.

To apply for a discount, contact enterprise@kamelot.ai with proof of eligibility.

---

## What Payment Methods Are Accepted?

| Method | Community License | Enterprise Support |
|--------|------------------|-------------------|
| Credit/Debit card | Yes (Visa, MC, Amex) | Yes |
| PayPal | Yes | No |
| Wire transfer | No | Yes |
| ACH | No | Yes |
| Purchase Order | No | Yes |
| Cryptocurrency | Planned | Planned |

All prices are in USD. Enterprise invoices are net-30 for PO-based payments.

---

## Is There a Free Trial for Enterprise Support?

Enterprise Support is an annual contract. However, we offer:
- **30-day risk-free period**: Full refund if canceled within 30 days
- **Proof of concept engagement**: Paid POC at $5,000 (credited toward first-year contract)
- **Community edition first**: We recommend trying the free Community edition before purchasing enterprise support

The free Community edition includes all the core features. Enterprise Support adds SLAs, compliance documentation, and dedicated engineering — not additional features.

---

## How Often Are Community Licenses Released?

Community Licenses are organized into annual cohorts:
- **2026 Cohort**: Available now
- **2027 Cohort**: Planned for January 2027
- **Special editions**: Early adopter, lifetime, and founding member editions may be offered during milestone releases

Each cohort includes access to community support channels, recognition in the project credits, and notification of major releases.

---

## Can I Upgrade My Support Tier Mid-Contract?

Yes. Upgrades are available at any time:
- Price is prorated for the remainder of the contract year
- New tier benefits begin immediately upon payment
- Downgrades take effect at the next renewal date

### Example

If you purchase Bronze in January and upgrade to Silver in July:
- You pay the difference between Silver and Bronze, prorated for 6 months
- Silver benefits apply immediately
- At January renewal, you renew at the Silver price

---

## Are There Regional Pricing Variations?

Kamelot uses global pricing with adjustments for purchasing power parity:

| Region | Adjustment | Notes |
|--------|-----------|-------|
| United States | 100% (base) | — |
| Canada | 100% (USD) | Invoiced in USD |
| European Union | 100% (EUR equivalent) | EU VAT may apply |
| United Kingdom | 100% (GBP equivalent) | VAT may apply |
| Australia / NZ | 100% (AUD/NZD) | GST may apply |
| Developing economies | 40-60% of base | Based on World Bank income classification |
| India | 50% of base | INR pricing available |

Self-hosted software and enterprise support pricing are adjusted. The free Community edition is globally free regardless of region.

---

## What Is the Partner / Reseller Program?

Kamelot offers a partner program for resellers, system integrators, and managed service providers:

### Partner Tiers

| Tier | Requirements | Discount | Benefits |
|------|-------------|----------|----------|
| Reseller | Minimum 5 enterprise deals/year | 20% margin | Sales support, marketing materials |
| Solution Partner | Certified engineers, reference customer | 25% margin | Joint marketing, lead sharing |
| Strategic Partner | Exclusive regional or vertical rights | 30% margin | Co-development, executive sponsorship |

Contact partners@kamelot.ai for partnership inquiries.

---

## Can I White-Label Kamelot?

White-label licensing (rebranding Kamelot as your own product) is available under the Enterprise Platinum tier or through a separate OEM agreement.

### White-Label Includes

- Custom binary signing with your certificates
- Rebranded UI (logo, colors, name)
- Custom installer packages
- Modified documentation
- Source code access for deep customization

OEM agreements start at $50,000/year and include dedicated support and custom development hours.

---

## What Is the License for My Contributions?

Contributions to Kamelot are accepted under the same license as the component being modified (MIT / Apache 2.0). By submitting a pull request, you agree to license your contributions under these terms.

### Contributor License Agreement (CLA)

For significant contributions (new features, substantial rewrites), a CLA may be required:
- Grants Kamelot Inc. the right to use your contribution
- Does not transfer your copyright
- Allows relicensing for future license changes

CLAs are not required for bug fixes, documentation improvements, or minor changes.

---

## How Does Kamelot Compare Cost to Cloud File Search Solutions?

| Service | Pricing Model | Estimated Annual Cost (50K files) |
|---------|--------------|----------------------------------|
| Kamelot (free) | Free | $0 |
| Kamelot (with hardware) | One-time hardware | $200-$1,500 (one time) |
| Google Drive + search | Subscription | $120-$240/user/year |
| Dropbox + search | Subscription | $180-$288/user/year |
| Box + search | Subscription | $180-$420/user/year |
| M-Files (DMS) | Per-seat license | $300-$700/user/year |
| Elastic Cloud Search | Per GB indexed | $1,200-$6,000/year |
| Algolia | Per search operation | $1,500-$10,000/year |
| Coveo | Per query | $2,000-$15,000/year |
| Sinova | Self-hosted license | $5,000-$20,000 one-time + support |

Kamelot is the only solution that combines semantic search, self-hosted privacy, zero per-query costs, and open-source code in a single package.

---

## Can I Get a Refund for an Accidental Community License Purchase?

Yes. If you accidentally purchased a Community License, contact community@kamelot.ai within 30 days for a full refund. Accidental purchases include:
- Duplicate purchases (bought twice by mistake)
- Wrong tier selected
- Purchase made without understanding the product is free

Refunds are processed within 5 business days to the original payment method.

---

## Does Kamelot Use Any Revenue from My Data?

**Absolutely not.** Kamelot's revenue model is based entirely on:
1. Enterprise support contracts (SLAs, compliance, dedicated engineering)
2. Community License supporter payments (optional, one-time)
3. Consulting and training services

Kamelot does not and will never:
- Sell user data
- Display advertisements
- Use file content for AI training
- Share telemetry with third parties
- Monetize usage patterns
- Restrict features behind paywalls

This is guaranteed by the open-source code, self-hosted architecture, and the company's charter.

---

## Is There a Usage Limit on the Free Version?

**No.** The free version of Kamelot has no artificial limits:

| Resource | Free Version | Enterprise Version |
|----------|-------------|-------------------|
| Files indexed | Unlimited | Unlimited |
| Queries | Unlimited | Unlimited |
| Users | 1 (single-user) | Multi-user (planned) |
| Storage | Unlimited | Unlimited |
| Devices | Unlimited (same user) | Unlimited |
| Features | All core features | Same + enterprise plugins |
| Updates | All updates | Priority updates |
| Support | Community support | Enterprise SLA |

The only differences between free and enterprise are support-related (SLAs, compliance documentation, dedicated engineering).

---

## How Does the Community License Support Development?

The Community License is a voluntary supporter payment that helps sustain Kamelot development:

### Where the Money Goes

| Allocation | Percentage | Purpose |
|------------|------------|---------|
| Development | 60% | Salaries for core developers |
| Infrastructure | 15% | CI/CD, release servers, domain names |
| Security | 10% | Security audits, bug bounty program |
| Community | 10% | Community events, moderation, documentation |
| Operations | 5% | Administrative costs, legal fees |

### Why Not Require Payment?

The team believes that semantic file search should be universally accessible, not limited by ability to pay. The free version will always include all core features. Community Licenses are for users who:
- Want to support the project financially
- Want recognition as a supporter
- Want priority community support
- Want early access to releases (special editions)

---

## Are There Any Grants or Funding Available?

Kamelot is primarily self-funded through the founding team and enterprise revenue. We also participate in:

| Funding Source | Status | Amount |
|---------------|--------|--------|
| Self-funded (founding team) | Active | Seed round |
| Enterprise revenue | Active | Operational |
| Open-source grants | Applied | $50K-$250K |
| Research partnerships | Exploring | Variable |

We are not currently seeking venture capital funding, as the self-hosted, privacy-focused model aligns better with sustainable, independent growth.

---

## What Is the Long-Term Pricing Vision?

Kamelot's pricing philosophy is guided by these principles:

### Core Principles

1. **Free forever**: The core semantic search product remains free for individual use indefinitely
2. **Support, not features**: Paid tiers provide support and services, not gated features
3. **Predictable pricing**: No per-query, per-file, or per-storage costs. Transparent annual pricing
4. **No vendor lock-in**: Users can stop paying at any time without losing functionality

### Pricing Roadmap

| Year | Free Version | Community | Enterprise |
|------|-------------|-----------|------------|
| 2026 (v0.x) | All core features | $50-$100 one-time | $5K-$150K/year |
| 2027 (v1.0) | All core features | $50-$100 one-time | $5K-$150K/year |
| 2028 (v2.0) | All core features | $75-$150 one-time | $5K-$200K/year |
| Long-term | Always free | Always optional | Market-adjusted |

No feature that exists in the free version will ever be moved behind a paywall.

---

## Can I Use Kamelot for Commercial Product Development?

Yes. The MIT and Apache 2.0 licenses permit using Kamelot in commercial product development, including:
- Building proprietary applications that use Kamelot
- Embedding Kamelot in commercial products
- Using Kamelot in internal tools at a for-profit company
- Developing plugins or extensions for sale

### Attribution Requirements

If you distribute Kamelot (as source code or binary) with your product, you must:
1. Include the original copyright notice
2. Include the license text (MIT/Apache 2.0)
3. State that changes were made (if applicable)

If you use Kamelot as a service (not distributing it), no attribution is required, though it's appreciated.

---

## Does the Community License Cover Commercial Use?

Yes. The Community License (one-time supporter payment) is purely a support and recognition tier. It does not change the software license terms. Kamelot's core is MIT/Apache 2.0, which permits commercial use regardless of whether you hold a Community License.

The Community License provides:
- Priority community support
- Recognition in project credits
- Early access to releases (special editions)
- A warm feeling from supporting open-source development

It does not provide:
- Additional features (all features are in the free version)
- SLA guarantees (those require Enterprise Support)
- Commercial use rights (already granted by MIT/Apache 2.0)

---

## What If I Need Custom Licensing?

Custom licensing is available for:
- **OEM integration**: Embedding Kamelot in hardware products
- **White-label distribution**: Rebrading Kamelot as a proprietary product
- **License compatibility**: Adapting to specific legal requirements
- **Extended warranty**: Custom liability and indemnification terms

Contact legal@kamelot.ai for custom licensing inquiries. Custom licenses are negotiated on a case-by-case basis with minimum terms starting at $25,000/year.

---

## How Do I Update My Billing Information?

### Community License

Community Licenses are one-time purchases. No billing information is stored or updated. If you lose your purchase receipt, contact community@kamelot.ai with your payment details.

### Enterprise Support

Enterprise Support billing information can be updated through the support portal:

1. Log in to [support.kamelot.ai](https://support.kamelot.ai)
2. Go to Account → Billing
3. Update payment method or contact information
4. Changes take effect for the next billing cycle

For urgent billing changes, contact billing@kamelot.ai.

---

## Comparison with Open-Source Competitors

Kamelot is not the only open-source file search tool. Here's how it compares:

| Feature | Kamelot | DocFetcher | Recoll | FSearch | Everything |
|---------|---------|------------|--------|---------|------------|
| License | MIT/Apache 2.0 | GPL 2.0+ | GPL 2.0+ | GPL 2.0+ | MIT |
| Price | Free | Free | Free | Free | Free |
| Semantic search | Yes | No | No | No | No |
| Multimodal search | Yes | No | No | No | No |
| Encryption | Yes | No | No | No | No |
| Immutable ledger | Yes | No | No | No | No |
| Offline | Yes | Yes | Yes | Yes | Yes |
| OS Support | Linux/Win/Mac | Linux/Win/Mac | Linux/Win/Mac | Linux | Windows |
| FUSE mount | Yes | No | No | No | No |
| File versioning | Yes | No | No | No | No |
| Real-time indexing | Yes | No | Yes | Yes | Yes |

Kamelot is the only open-source option that combines semantic search, encryption, file versioning, and a virtual filesystem mount — all for free.

---

## Frequently Asked Pricing Questions

### Is There a Hidden Cost?

No. Kamelot is transparent about all costs:
- Core software: Free forever
- AI model weights: Free (Apache 2.0)
- Dependencies (Qdrant, Ollama): Free (open source)
- Hardware: Your existing hardware (or minimal upgrade)
- Electricity: Minimal ($1-$4/month)
- Support: Optional paid tiers

There are no:
- Surprise fees
- Overage charges
- Hidden subscription requirements
- Mandatory payment for features

### Can I Get an Invoice for Tax Purposes?

| Purchase Type | Invoice Available | How to Get |
|---------------|------------------|------------|
| Community License | Yes | Emailed automatically after purchase |
| Enterprise Support | Yes | Included in welcome package |
| Consulting/Training | Yes | Provided after service delivery |

All invoices include:
- Kamelot Inc. business details
- Purchaser details
- Itemized charges
- Applicable taxes
- Payment terms

### What Currency Are Prices In?

All prices are listed in USD. Enterprise invoices can be issued in:
- USD (US Dollar)
- EUR (Euro) — at prevailing exchange rate
- GBP (British Pound) — at prevailing exchange rate

International customers are responsible for any applicable VAT, GST, or sales tax.

### Is Kamelot VAT-Exempt?

VAT-exempt purchases are available for:
- EU businesses with valid VAT number (reverse charge applies)
- US tax-exempt organizations (provide exemption certificate)
- Canadian First Nations (provide applicable documentation)

Contact billing@kamelot.ai with your exemption documentation.

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com