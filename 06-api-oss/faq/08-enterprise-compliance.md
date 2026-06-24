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
