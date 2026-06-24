<!--
KASTERAN* — The Last Programming Language
© Lois-Kleinner & 0-1.gg 2026. All rights reserved.

 ▄▄   ▄▄▄                                           ▄     
 ██  ██▀                         ██              ▄▄ █ ▄▄  
 ██▄██      ▄█████▄  ▄▄█████▄  ███████    ▄████▄    ██▄████   ▄█████▄  ██▄████▄   █████   
 █████      ▀ ▄▄▄██  ██▄▄▄▄ ▀    ██      ██▄▄▄▄██   ██▀       ▀ ▄▄▄██  ██▀   ██  ▀▀ █ ▀▀  
 ██  ██▄   ▄██▀▀▀██   ▀▀▀▀██▄    ██      ██▀▀▀▀▀▀   ██       ▄██▀▀▀██  ██    ██     ▀     
 ██   ██▄  ██▄▄▄███  █▄▄▄▄▄██    ██▄▄▄   ▀██▄▄▄▄█   ██       ██▄▄▄███  ██    ██           
 ▀▀    ▀▀   ▀▀▀▀ ▀▀   ▀▀▀▀▀▀      ▀▀▀▀     ▀▀▀▀▀    ▀▀        ▀▀▀▀ ▀▀  ▀▀    ▀▀           
-->

# Kasteran* — CCPA Compliance
© Lois-Kleinner & 0-1.gg 2026

## Overview

The California Consumer Privacy Act (CCPA) grants California residents specific rights over their personal information. Kasteran* provides technical infrastructure to help organizations comply with CCPA requirements. While CCPA shares similarities with GDPR, it has distinct requirements that warrant specific attention.

## Consumer Rights Under CCPA

### Right to Know
Consumers have the right to know what personal information is being collected, used, shared, and sold. Kasteran* provides comprehensive data mapping through its type system. The compiler can generate a complete data inventory that identifies:

- Categories of personal information collected
- Sources of collection
- Business purpose for collection
- Categories of third parties with whom information is shared
- Specific pieces of personal information collected about a particular consumer

The data inventory is maintained as part of the build artifact and can be regenerated whenever the codebase changes.

### Right to Delete
CCPA provides consumers the right to request deletion of personal information. Kasteran* implements deletion through a multi-layered approach:

1. Primary data stores are cleared through the application API
2. Backup data is purged through the retention management system
3. Cache entries are invalidated immediately
4. Third-party data sharing is revoked through the service provider management system

The deletion process is fully auditable, with tamper-evident logs recording each deletion action. The .aioss protocol supports cryptographic proof of deletion.

### Right to Opt-Out of Sale
Consumers can direct a business to stop selling their personal information. Kasteran* provides a first-class opt-out mechanism:

- Opt-out preferences are stored with the consumer profile
- The access control system enforces opt-out status at runtime
- Service provider agreements contractually prohibit sale of data
- The compliance reporting system tracks opt-out requests and their implementation

The compiler can enforce that data of opting-out consumers is never routed through sale channels, providing compile-time guarantees.

### Right to Non-Discrimination
CCPA prohibits discrimination against consumers who exercise their rights. Kasteran* supports this through access controls that prevent differential treatment based on privacy choices. The audit logging system can detect patterns that may indicate discriminatory practices.

## Service Provider Agreements

CCPA requires businesses to enter into agreements with service providers that process personal information on their behalf. Kasteran* includes a service provider agreement management framework:

- Standardized agreement templates that meet CCPA requirements
- Automated compliance monitoring of service provider activities
- Data minimization enforcement — service providers receive only the data necessary for their function
- Contractual prohibitions on retaining, using, or disclosing data beyond the scope of the agreement

## Data Inventory and Mapping

CCPA requires businesses to maintain an inventory of data collection and sharing practices. Kasteran* generates this inventory automatically:

```
Source: User registration form
Categories: Identifiers (name, email, address)
Purpose: Account management
Third parties: Payment processor (limited to transaction data)
Retention: Duration of account + 2 years
```

The inventory is a living document that updates with each build. It can be exported in machine-readable formats for compliance reporting.

## Consumer Request Processing

CCPA requires businesses to respond to consumer requests within 45 days. Kasteran* provides automated request processing:

1. **Verification**: Multi-factor authentication and identity verification workflows
2. **Tracking**: Each request receives a unique identifier for status tracking
3. **Fulfillment**: Automated data retrieval and packaging for access requests
4. **Deletion**: Automated data removal with verification
5. **Notification**: Updates to the consumer at each stage of processing

The request management system maintains a dashboard showing request volumes, processing times, and resolution rates.

## Training and Awareness

Kasteran* includes training materials for employees handling CCPA requests. The documentation covers:

- Identifying CCPA requests
- Proper handling procedures
- Escalation paths for complex requests
- Record-keeping requirements

## Compliance Reporting

Kasteran* generates CCPA compliance reports that document:

- Number of consumer requests received, complied with, and denied
- Categories of personal information collected and disclosed
- Business purposes for collection
- Opt-out request fulfillment rates
- Service provider compliance status

These reports can be produced on demand or on a regular schedule for management review.

## Penalties and Liability

CCPA provides for statutory damages of $100-$750 per consumer per incident for data breaches, plus civil penalties for intentional violations. Kasteran* reduces this risk through:

- Compile-time security guarantees that prevent data breaches
- Automated compliance enforcement
- Comprehensive audit trails for demonstrating compliance
- Breach detection and notification systems

## Conclusion

Kasteran* provides robust support for CCPA compliance through architectural features that embed consumer privacy protections directly into the language. Organizations can reduce compliance costs while achieving stronger privacy guarantees.
