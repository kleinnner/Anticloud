<!--
  __   ___                      __                        __                     
  ¦¦  ¦¦¯                       ¦¦                        ¦¦                     
  ___¦  ¦¦_¦¦      _¦¦¦¦¦_  ¦¦¦¦¦¦¦¦  ¦¦ _¦¦¯    _¦¦¦¦¦_   _¦¦¦_¦¦   _¦¦¦¦_   ¦___     
  __¦¯¯¯    ¦¦¦¦¦      ¯ ___¦¦      _¦¯   ¦¦_¦¦      ¯ ___¦¦  ¦¦¯  ¯¦¦  ¦¦____¦¦    ¯¯¯¦__ 
  ¯¯¦___    ¦¦  ¦¦_   _¦¦¯¯¯¦¦    _¦¯     ¦¦¯¦¦_    _¦¦¯¯¯¦¦  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯    ___¦¯¯ 
      ¯¯¯¦  ¦¦   ¦¦_  ¦¦___¦¦¦  _¦¦_____  ¦¦  ¯¦_   ¦¦___¦¦¦  ¯¦¦__¦¦¦  ¯¦¦____¦  ¦¯¯¯     
           ¯¯    ¯¯   ¯¯¯¯ ¯¯  ¯¯¯¯¯¯¯¯  ¯¯   ¯¯¯   ¯¯¯¯ ¯¯    ¯¯¯ ¯¯    ¯¯¯¯¯
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Pricing & Packaging — Kazkade

## Overview

Kazkade is offered in three tiers. The core runtime is always open source (Apache 2.0). Paid tiers add support, SLAs, compliance features, and dedicated engineering.

| Tier | Price | Best For |
|------|-------|----------|
| **Community** | Free | Individual developers, open-source projects, evaluation |
| **Team** | $199/node/month | Engineering teams, startups, mid-market |
| **Enterprise** | Custom | Large organizations, regulated industries, custom deployments |

---

## Tier Comparison

| Feature | Community | Team | Enterprise |
|---------|-----------|------|------------|
| **Kazcade runtime** | ? Latest stable | ? Latest stable | ? Custom build |
| **`.aioss` ledger format** | ? Read & write | ? Read & write | ? Read & write |
| **Benchmark harness** | ? All kernels | ? All kernels | ? Custom kernels |
| **SQL engine** | ? 10 GB file limit | ? Unlimited | ? Unlimited |
| **Dashboard** | ? Local only | ? Local + remote | ? Custom deployment |
| **Public verification** | ? Verify any ledger | ? Verify any ledger | ? Verify any ledger |
| **Patching** | Community issue tracker | ? Priority patches | ? 24-hr SLA patches |
| **Support** | Community Discord | ? Email + Slack (4 hr) | ? Dedicated engineer |
| **SLA** | None | ? 99.9% uptime for ledger registry | ? Custom |
| **Ledger registry** | Public only | ? Private team registry | ? Private + on-prem |
| **Custom kernel dev** | ? | ? | ? |
| **Training** | ? | ? 2 sessions/year | ? Unlimited |
| **License** | Apache 2.0 | Apache 2.0 + commercial terms | Custom commercial |
| **Audit certification** | ? | ? SOC 2 Type II report | ? Custom audit package |

---

## Community (Free)

### What's Included
- kazkade runtime — all features, no artificial limits on benchmark capability
- `.aioss` ledger — create, append, and verify ledgers
- SQL engine — files up to 10 GB
- Dashboard — local web UI
- Public ledger registry — publish ledgers for anyone to verify
- Community Discord support — best-effort

### What's Not Included
- No SLA
- No private ledger registry
- No priority patches
- No dedicated support
- SQL limited to 10 GB file size

### Best For
- Individual developers evaluating the platform
- Open-source projects integrating Kazkade into CI
- Students and researchers

**License:** Apache 2.0 — use, modify, redistribute freely.

---

## Team ($199/node/month)

### What's Included (Everything in Community, plus:)
- **Private ledger registry** — your team's ledgers, encrypted at rest, role-based access
- **Priority patches** — security fixes within 48 hours
- **Email + Slack support** — 4-hour response during business hours (24/5)
- **Unlimited SQL** — no file size limit
- **SLA:** 99.9% uptime guarantee for ledger registry and package mirror
- **Remote dashboard** — share dashboards with team members
- **Training:** 2 virtual sessions per year (1 hour each)

### Booking
- Annual commitment (monthly billing available at $249/node/month)
- Minimum 5 nodes
- Volume discounts: 10+ nodes ? $179/node/month; 25+ ? $159/node/month; 50+ ? $139/node/month

### Best For
- Engineering teams running benchmarks in CI
- Fintech startups needing auditable computation
- AI/ML teams publishing signed model benchmarks
- Edge/IoT teams validating hardware across device fleets

**License:** Apache 2.0 runtime + commercial terms for registry and support services.

---

## Enterprise (Custom)

### What's Included (Everything in Team, plus:)
- **Dedicated engineer** — named contact, available during your business hours
- **24-hour SLA** for critical patches (P1: 4 hours)
- **Custom builds** — branded binary, custom SIMD kernels, embedded ledger integration
- **On-prem ledger registry** — deploy inside your VPC / air-gapped network
- **Unlimited training** — as many sessions as needed for your teams
- **Custom audit certification** — SOC 2, ISO 27001 mapping, SOX compliance reports
- **License customization** — embed Kazkade in your own product (OEM licensing available)
- **Priority feature requests** — ranked and voted by Enterprise customers
- **Escalation path to engineering leadership**

### Pricing
- Annual contract
- Pricing: Custom based on node count, deployment complexity, and support scope
- Typical range: $15,000–$150,000/year

### Best For
- Large financial institutions (banks, hedge funds, exchanges)
- HPC centers with heterogeneous cluster management
- Government and defense (air-gapped deployments)
- ISVs embedding Kazkade in their own products

---

## Packaging Options

| Option | Description | Available In |
|--------|-------------|-------------|
| **Binary download** | Static musl-linked binary for Linux, macOS, Windows | Community, Team, Enterprise |
| **Docker image** | Official Docker image (multi-arch) | Community, Team, Enterprise |
| **Package manager** | Homebrew, Scoop, APT repositories | Team, Enterprise |
| **Source build** | Build from source with custom flags | Community (manual), Enterprise (assisted) |
| **Embedded SDK** | Link Kazkade as a library (C ABI) | Enterprise only |

---

## Licensing Terms

| Aspect | Community | Team | Enterprise |
|--------|-----------|------|------------|
| **Runtime license** | Apache 2.0 | Apache 2.0 | Custom |
| **Use in commercial product** | ? Allowed | ? Allowed | ? Allowed (OEM terms may apply) |
| **Redistribution** | ? Allowed | ? Allowed (runtime only) | ? Custom terms |
| **Modification** | ? Allowed | ? Allowed | ? Allowed |
| **Audit rights** | N/A | Kazkade may audit usage | Custom |
| **Indemnification** | None | ? Standard | ? Custom |

---

## Renewal Process

### Community
- No renewal required. The software is yours permanently under Apache 2.0.

### Team
- **Auto-renewal:** Contracts auto-renew unless 30-day written notice is given.
- **Renewal window:** 60 days before expiration, invoice is sent.
- **Payment terms:** Net 30 for annual contracts; monthly via credit card.
- **Grace period:** 15 days after expiration. After that, private registry and remote dashboard access are suspended. Ledger data is retained for 90 days.

### Enterprise
- **Renewal window:** 90 days before expiration.
- **Dedicated account manager** handles renewal negotiation.
- **Escalation:** VP of Sales reviews terms 60 days before expiration.
- **Continuity:** If renewal is delayed, full service continues for 30 days past expiration at no penalty.

---

## Frequently Asked Questions (for BDRs)

### "Is the Community edition limited?"
> "No — the runtime, ledger, and benchmark harness are fully featured. The limits are on support, SLA, and advanced features like private registry and unlimited SQL."

### "Can we start Community and upgrade to Team later?"
> "Yes. Migrate to Team at any time. Your ledgers and benchmarks are fully compatible. We'll help you import them into the private registry."

### "What counts as a 'node'?"
> "A node is a unique machine (physical or virtual) running Kazkade. CI runners, dev machines, and production servers all count. Free tier: unlimited nodes for personal use; Team tier: billed per node."

### "Do you offer academic discounts?"
> "Yes — 50% off Team tier for accredited academic institutions. Contact sales for details."

### "Is there a free trial for Team?"
> "Yes — 14-day free trial with full Team features, no credit card required."

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

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