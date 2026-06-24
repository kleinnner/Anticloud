---
title: "Glossary 4: Enterprise Terms"
sidebar_position: 4
description: "Documentation for Glossary 4: Enterprise Terms"
tags: [glossary]
---

# Glossary 4: Enterprise Terms

## Terms

### SLA (Service Level Agreement)
- Contractual guarantee of service availability and performance
- API-OSS Enterprise: 99.9% uptime SLA

### SSO (Single Sign-On)
- Authentication system allowing one set of credentials for multiple apps
- API-OSS supports: OIDC, SAML, LDAP, OAuth 2.0

### RBAC (Role-Based Access Control)
- Permission model based on user roles
- API-OSS: admin, operator, editor, viewer roles with granular permissions

### ABAC (Attribute-Based Access Control)
- Permission model based on user attributes (department, clearance, location)
- API-OSS supports ABAC for fine-grained access control

### LDAP (Lightweight Directory Access Protocol)
- Directory service protocol for user management
- API-OSS integrates with LDAP/Active Directory for enterprise auth

### OIDC (OpenID Connect)
- Identity layer on top of OAuth 2.0
- API-OSS supports any OIDC provider (Okta, Auth0, Azure AD, Keycloak)

### SAML (Security Assertion Markup Language)
- XML-based federated identity protocol
- API-OSS supports SAML 2.0 for enterprise SSO

### Audit Trail / Audit Ledger
- Immutable record of all operations
- API-OSS uses SHA-256 linked chain for tamper-evident audit

### SOX (Sarbanes-Oxley Act)
- US financial reporting and audit compliance standard
- API-OSS audit ledger supports SOX compliance

### GDPR (General Data Protection Regulation)
- EU data protection regulation
- API-OSS's local-first architecture inherently supports GDPR compliance

### HIPAA (Health Insurance Portability and Accountability Act)
- US healthcare data privacy regulation
- API-OSS provides HIPAA compliance package with PHI handling

### SOC 2 (Service Organization Control 2)
- Auditing standard for service providers
- API-OSS supports SOC 2 Type II compliance requirements

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)
