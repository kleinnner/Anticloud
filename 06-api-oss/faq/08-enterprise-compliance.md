---
title: "ENTERPRISE & COMPLIANCE — FREQUENTLY ASKED QUESTIONS"
sidebar_position: 8
description: "API-SOS is designed to be deployed in a SOC 2-compliant manner. The SOC 2 readiness guide is at docs/internal/soc2-readiness.md. Formal SOC 2 certification depends on the operational controls around y"
tags: [faq]
---

# ENTERPRISE & COMPLIANCE — FREQUENTLY ASKED QUESTIONS

## Is API-SOS SOC 2 compliant?

API-SOS is designed to be deployed in a SOC 2-compliant manner. The SOC 2 readiness guide is at docs/internal/soc2-readiness.md. Formal SOC 2 certification depends on the operational controls around your specific deployment.

## Is API-SOS compliant with UAE PDPL?

Yes. The zero-data-leakage architecture means no personal data ever leaves your hardware. See the privacy policy and DPA for details.

## Does API-SOS support role-based access control (RBAC)?

Yes. Enterprise deployments can configure RBAC through `rbac.enabled` with defined roles and permissions. See docs/enterprise/21-role-based-access-control.md.

## Does API-SOS support attribute-based access control (ABAC)?

Yes. ABAC extends RBAC with attribute-based rules (time of day, IP range, data classification). See docs/enterprise/22-attribute-based-access-control.md.

## Can I integrate with SSO / OIDC / SAML / LDAP?

Yes. API-SOS supports SSO via OIDC, SAML 2.0, and LDAP for enterprise authentication. See the respective guides in docs/enterprise/.

## What audit trail does it provide?

Every decision and action is recorded in the `.aioss` hash-chained ledger with timestamp, actor, input, output, and the SHA-256 chain link. The ledger is self-verifying and portable.

## Can I generate compliance reports automatically?

Yes. The Compliance Dashboard and Compliance Package Builder in the frontend allow you to generate reports for SOC 2, ISO 27001, GDPR, and PDPL. See docs/enterprise/32-compliance-dashboard-setup.md.

## Is there a SIEM integration?

Yes. API-SOS can forward logs to external SIEM systems via syslog or WebSocket. See docs/enterprise/49-siem-integration.md.

## What data retention policies are available?

Configure `ledger.retention_days` to automatically prune old ledger entries. The knowledge graph and conversation history have separate retention settings. See docs/enterprise/46-data-retention-policies.md.

## Can I deploy in a multi-node high-availability configuration?

Yes. Enterprise HA deployments use multiple gateway instances behind a load balancer with a shared data directory on networked storage. See docs/enterprise/09-multi-node-ha-setup.md.

## See Also

Related FAQ, support, and troubleshooting documentation.

- [FAQ Index](../faq/01-general.md)
- [Support Guide](../support/01-getting-help.md)
- [Troubleshooting](../troubleshooting/01-app-wont-start.md)
- [User Manual](../user-manual/01-getting-started.md)

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
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
